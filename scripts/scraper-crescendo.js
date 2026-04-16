// scraper-crescendo.js v4.1 — intègre normalizeLabel depuis labels-whitelist.js
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
import { normalizeLabel } from './labels-whitelist.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const API = 'https://www.crescendo-magazine.be/wp-json/wp/v2'
const CATEGORY_ID = 10
const PER_PAGE = 10
const PAUSE_BETWEEN_PAGES = 3000
const PAUSE_BETWEEN_ARTICLES = 400
const MAX_RETRIES = 5
const RETRY_DELAY = 10000

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const pagesIdx = args.indexOf('--pages')
const startIdx = args.indexOf('--start')
const MAX_PAGES = pagesIdx >= 0 ? parseInt(args[pagesIdx + 1]) : 520
const START_PAGE = startIdx >= 0 ? parseInt(args[startIdx + 1]) : 1

const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchJSON(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ref-crescendo-bot/1.0' } })
    if (res.status === 503) {
      if (attempt <= MAX_RETRIES) {
        console.log(`  ⚠ 503 — attente ${RETRY_DELAY/1000}s puis retry ${attempt}/${MAX_RETRIES}`)
        await sleep(RETRY_DELAY * attempt)
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

function cleanComposerName(raw) {
  if (!raw) return null
  let name = raw
    .replace(/\s*\([\d\w\s\-–°?c\.]+\)/g, '')
    .replace(/\s*\[.*?\]/g, '')
    .replace(/\s+v\.\s*$/, '')
    .replace(/\s+c\.\s*$/, '')
    .replace(/[*°†]+/g, '')
    .trim()

  if (name.length < 3) return null
  if (name.length > 60) return null
  if (/^\d/.test(name)) return null
  if (/[.,:;!?]/.test(name)) return null
  if (/\b(pour|avec|et|de la|du|au|les|des|son|sa|ses)\b/i.test(name) && name.split(' ').length > 3) return null
  if (/\b(sonate|concerto|symphonie|suite|quatuor|trio|duo|air|messe|requiem|cantate|fugue|prélude|fantaisie)\b/i.test(name)) return null
  if (/\b(soprano|ténor|alto|baryton|basse|piano|violon|violoncelle|flûte|hautbois|cor|trompette)\b/i.test(name)) return null
  if (/\b(orchestre|ensemble|quartet|quintet|sextet)\b/i.test(name.toLowerCase())) return null
  if (/\b(livret|texte|notice|anglais|français|allemand|aussi|disponible)\b/i.test(name)) return null

  return name
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

  const composers = new Set()

  const compMatch = text.match(/[ŒO]uvres?\s+de\s+([^.;\n]{5,300})/i)
  if (compMatch) {
    compMatch[1]
      .split(/[,;]\s*(?:et\s+)?/)
      .map(c => cleanComposerName(c))
      .filter(Boolean)
      .forEach(c => composers.add(c))
  }

  const compPattern2 = /([A-ZÀ-Ÿa-zà-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ\-]+)+)\s*(?:\([\d\w\s\-–°?c\.]+\))?\s*:/g
  let m
  while ((m = compPattern2.exec(text)) !== null) {
    const name = cleanComposerName(m[1])
    if (name) composers.add(name)
  }

  result.composers = [...composers].slice(0, 10)

  // === EXTRACTION LABEL BRUT (v4) ===
  let rawLabel = null

  // Tentative 1 : pattern "– LabelName CODE123"
  const labelMatch = text.match(/[-–]\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s&']+?)\s+[A-Z]{1,5}[\s\-]?\d/u)
  if (labelMatch) {
    const candidate = labelMatch[1].trim()
    if (!candidate.includes(' ') || candidate.split(' ').length <= 3) {
      rawLabel = candidate
    }
  }

  // Tentative 2 : dernier segment avant fin
  if (!rawLabel) {
    const segments = text.split(/\.\s+/)
    for (let i = segments.length - 1; i >= 0; i--) {
      const s = segments[i].trim().replace(/[.*]$/, '')
      if (
        s.length > 1 && s.length < 40 &&
        !s.includes(',') &&
        !/^\d/.test(s) &&
        /[A-Za-z]/.test(s) &&
        !/\b(livret|texte|notice|anglais|français|allemand|aussi|disponible|blu.ray)\b/i.test(s) &&
        !/^(Bernadette|Jean|Pierre|Marie|François|Philippe|Alain|Bernard|Guy|Axel|Carlo)/i.test(s)
      ) {
        rawLabel = s; break
      }
    }
  }

  // === VALIDATION PAR WHITELIST (v4.1) ===
  // normalizeLabel retourne null si le candidat n'est pas un vrai label
  // → évite d'écrire des parasites en base
  result.label = normalizeLabel(rawLabel)

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

// Récupère les données existantes en batch pour éviter N+1 queries
async function getExistingData(ids) {
  const { data } = await supabase
    .from('albums')
    .select('id, label, cover_url')
    .in('id', ids)
  return data ? Object.fromEntries(data.map(d => [d.id, d])) : {}
}

async function upsertAlbums(albums) {
  // Récupérer les données existantes en une seule requête
  const ids = albums.map(a => a.id)
  const existing = await getExistingData(ids)

  // Préserver label et cover_url si déjà renseignés en base
  // (la base a été nettoyée en v3.2, donc les labels existants sont tous valides)
  const toUpsert = albums.map(album => {
    const ex = existing[album.id]
    if (ex) {
      if (ex.label) album.label = ex.label
      if (ex.cover_url) album.cover_url = ex.cover_url
    }
    return album
  })

  const { error } = await supabase.from('albums').upsert(toUpsert, { onConflict: 'id' })
  if (error) console.error('  ✗ Supabase:', error.message)
  else console.log(`  ✓ ${toUpsert.length} albums insérés/mis à jour`)
}

async function main() {
  console.log(`🎵 Scraper Crescendo v4.1 (whitelist-validated) — ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`)
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
