// scraper-crescendo.js v3 — avec retry 503 et reprise depuis une page
//
// Usage :
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scraper-crescendo.js
//
// Options :
//   --pages 520       nombre de pages max (défaut: 520)
//   --start 22        reprendre depuis la page 22 (défaut: 1)
//   --dry-run         sans insertion Supabase
//
// Dépendances : npm install @supabase/supabase-js node-html-parser

import { createClient } from '@supabase/supabase-js'
import { parse } from 'node-html-parser'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const API = 'https://www.crescendo-magazine.be/wp-json/wp/v2'
const CATEGORY_ID = 10
const PER_PAGE = 10
const PAUSE_BETWEEN_PAGES = 3000   // 3s entre chaque page
const PAUSE_BETWEEN_ARTICLES = 400 // 0.4s entre chaque article
const MAX_RETRIES = 5
const RETRY_DELAY = 10000          // 10s avant retry après 503

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const MAX_PAGES = parseInt(args[args.indexOf('--pages') + 1] || '520')
const START_PAGE = parseInt(args[args.indexOf('--start') + 1] || '1')

const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchJSON(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ref-crescendo-bot/1.0' } })
    if (res.status === 503) {
      if (attempt <= MAX_RETRIES) {
        console.log(`  ⚠ 503 — attente ${RETRY_DELAY/1000}s puis retry ${attempt}/${MAX_RETRIES}`)
        await sleep(RETRY_DELAY * attempt) // délai croissant
        return fetchJSON(url, attempt + 1)
      }
      throw new Error(`HTTP 503 après ${MAX_RETRIES} tentatives`)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch (err) {
    if (attempt <= MAX_RETRIES && err.message.includes('503')) {
      await sleep(RETRY_DELAY * attempt)
      return fetchJSON(url, attempt + 1)
    }
    throw err
  }
}

async function fetchHTML(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ref-crescendo-bot/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return parse(await res.text())
}

function parseHeader(text) {
  const result = { title: null, composers: [], label: null, duration: null, recording_date: null }
  if (!text) return result
  const titleMatch = text.match(/\*{1,3}([^*]+)\*{1,3}/)
  if (titleMatch) result.title = titleMatch[1].trim().replace(/[.*]$/, '')
  const durMatch = text.match(/(\d{1,3}['′']\s*\d{2}['″′'']{1,2}|\d+h\d+)/)
  if (durMatch) result.duration = durMatch[1]
  const dateMatch = text.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i)
  if (dateMatch) result.recording_date = `${dateMatch[1]} ${dateMatch[2]}`
  const compMatch = text.match(/[ŒO]uvres?\s+de\s+([^.]{5,200})/i)
  if (compMatch) {
    result.composers = compMatch[1]
      .split(/,\s*(?:et\s+)?/)
      .map(c => c.replace(/\s*\([\d\w\s\-–]+\)/, '').trim())
      .filter(c => c.length > 2 && c.length < 80)
  }
  const segments = text.split(/\.\s+/)
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i].trim().replace(/[.*]$/, '')
    if (s.length > 1 && s.length < 60 && !s.includes(',') && !/^\d/.test(s)) {
      result.label = s; break
    }
  }
  return result
}

function parseNotes(htmlContent) {
  const match = htmlContent.match(/Son\s*:\s*\d[^<\n]*(Interprétation|Livret)[^<\n]*/i)
  if (!match) return null
  const notes = {}
  for (const [, key, val] of match[0].matchAll(/(\w[\w\s]+?)\s*:\s*(\d+(?:[–\-]\d+)?)/g)) {
    notes[key.trim().toLowerCase()] = val.trim()
  }
  return Object.keys(notes).length ? notes : null
}

async function enrichFromArticle(url) {
  try {
    const doc = await fetchHTML(url)
    const coverUrl = doc.querySelector('.entry-content img')?.getAttribute('src') || null
    const tags = [...doc.querySelectorAll('a[rel="tag"]')].map(a => a.text.trim()).filter(Boolean)
    return { coverUrl, tags }
  } catch { return { coverUrl: null, tags: [] } }
}

async function processPost(post) {
  const url = post.link
  const articleTitle = post.title?.rendered?.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '') || ''
  const htmlContent = post.content?.rendered || ''
  const excerptHtml = post.excerpt?.rendered || ''
  const doc = parse(htmlContent)
  const paragraphs = doc.querySelectorAll('p')
  const headerText = paragraphs[0]?.text?.trim() || parse(excerptHtml).text?.trim()
  const header = parseHeader(headerText)
  const notes = parseNotes(htmlContent)
  const { coverUrl, tags } = await enrichFromArticle(url)
  return {
    id: post.slug,
    title: header.title || articleTitle,
    article_title: articleTitle,
    composers: header.composers,
    label: header.label,
    duration: header.duration,
    recording_date: header.recording_date,
    author: null,
    published_at: post.date || null,
    cover_url: coverUrl,
    critique_url: url,
    notes,
    tags,
    header_raw: headerText,
    source: 'crescendo',
  }
}

async function upsertAlbums(albums) {
  const { error } = await supabase.from('albums').upsert(albums, { onConflict: 'id' })
  if (error) console.error('  ✗ Supabase:', error.message)
  else console.log(`  ✓ ${albums.length} albums insérés/mis à jour`)
}

async function main() {
  console.log(`🎵 Scraper Crescendo v3 — ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`)
  console.log(`   Pages ${START_PAGE} → ${START_PAGE + MAX_PAGES - 1} | Pause ${PAUSE_BETWEEN_PAGES/1000}s/page\n`)
  const allArticles = []

  for (let page = START_PAGE; page < START_PAGE + MAX_PAGES; page++) {
    const url = `${API}/posts?categories=${CATEGORY_ID}&per_page=${PER_PAGE}&page=${page}&_fields=id,slug,title,date,link,content,excerpt`
    console.log(`\n→ Page ${page}`)
    let posts
    try {
      posts = await fetchJSON(url)
    } catch (err) {
      console.error(`  ✗ Abandon page ${page}: ${err.message}`)
      break
    }
    if (!posts.length) { console.log('  Fin des résultats'); break }
    console.log(`  ${posts.length} articles`)

    for (const post of posts) {
      process.stdout.write(`  → ${post.slug.slice(0, 50)}... `)
      const article = await processPost(post)
      allArticles.push(article)
      console.log(`✓`)
      await sleep(PAUSE_BETWEEN_ARTICLES)
    }

    // Insertion par lot à chaque page
    if (!DRY_RUN && allArticles.length > 0) {
      await upsertAlbums([...allArticles])
      allArticles.length = 0
    }

    await sleep(PAUSE_BETWEEN_PAGES)
  }

  if (DRY_RUN && allArticles.length > 0) {
    console.log('\n--- DRY RUN ---')
    console.log(JSON.stringify(allArticles.slice(0, 2), null, 2))
  }

  console.log('\n✅ Terminé')
}

main().catch(console.error)
