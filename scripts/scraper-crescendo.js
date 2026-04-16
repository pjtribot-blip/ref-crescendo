// scraper-crescendo.js v4 — avec parseHeader amélioré
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

// Nettoyage d'un nom de compositeur
function cleanComposerName(raw) {
  if (!raw) return null
  let name = raw
    .replace(/\s*\([\d\w\s\-–°?c\.]+\)/g, '')  // supprime (1685-1750), (°1963), (c.1600) etc.
    .replace(/\s*\[.*?\]/g, '')                   // supprime [attrib.] etc.
    .replace(/\s+v\.\s*$/, '')                    // supprime "v." en fin
    .replace(/\s+c\.\s*$/, '')                    // supprime "c." en fin
    .replace(/[*°†]+/g, '')                       // supprime signes diacritiques parasites
    .trim()

  // Vérifications : rejeter si trop court, trop long, ou texte parasite
  if (name.length < 3) return null
  if (name.length > 60) return null
  if (/^\d/.test(name)) return null              // commence par un chiffre
  if (/[.,:;!?]/.test(name)) return null         // contient ponctuation parasite
  if (/\b(pour|avec|et|de la|du|au|les|des|son|sa|ses)\b/i.test(name) && name.split(' ').length > 3) return null
  if (/\b(sonate|concerto|symphonie|suite|quatuor|trio|duo|air|messe|requiem|cantate|fugue|prélude|fantaisie)\b/i.test(name)) return null
  if (/\b(soprano|ténor|alto|baryton|basse|piano|violon|violoncelle|flûte|hautbois|cor|trompette)\b/i.test(name)) return null
  if (/\b(orchestre|ensemble|quartet|quintet|sextet)\b/i.test(name.toLowerCase())) return null

  return name
}

function parseHeader(text) {
  const result = { title: null, composers: [], label: null, duration: null, recording_date: null }
  if (!text) return result

  // Titre : entre ** ou première partie avant le premier ;
  const titleMatch = text.match(/\*{1,3}([^*]+)\*{1,3}/)
  if (titleMatch) result.title = titleMatch[1].trim().replace(/[.*]$/, '')

  // Durée
  const durMatch = text.match(/(\d{1,3}['′']\s*\d{2}['″′'']{1,2}|\d+h\d+)/)
  if (durMatch) result.duration = durMatch[1]

  // Date d'enregistrement
  const dateMatch = text.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i)
  if (dateMatch) result.recording_date = `${dateMatch[1]} ${dateMatch[2]}`

  // Compositeurs : plusieurs patterns
  const composers = new Set()

  // Pattern 1 : "Oeuvres de X, Y et Z"
  const compMatch = text.match(/[ŒO]uvres?\s+de\s+([^.;\n]{5,300})/i)
  if (compMatch) {
    compMatch[1]
      .split(/[,;]\s*(?:et\s+)?/)
      .map(c => cleanComposerName(c))
      .filter(Boolean)
      .forEach(c => composers.add(c))
  }

  // Pattern 2 : "NOM Prénom (date-date) : Titre de l'oeuvre"
  // Cherche les noms sous forme "Prénom NOM" suivis de dates et deux-points
  const compPattern2 = /([A-ZÀ-Ÿa-zà-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ\-]+)+)\s*(?:\([\d\w\s\-–°?c\.]+\))?\s*:/g
  let m
  while ((m = compPattern2.exec(text)) !== null) {
    const name = cleanComposerName(m[1])
    if (name) composers.add(name)
  }

  result.composers = [...composers].slice(0, 10) // max 10 compositeurs

  // Label : dernier segment significatif avant le numéro de catalogue
  // Pattern : label suivi d'un code alphanumérique
  const labelMatch = text.match(/[-–]\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s&']+?)\s+[A-Z]{1,5}[\s\-]?\d/u)
  if (labelMatch) {
    result.label = labelMatch[1].trim()
  } else {
    // Fallback : dernier segment court sans virgule ni chiffre au début
    const segments = text.split(/\.\s+/)
    for (let i = segments.length - 1; i >= 0; i--) {
      const s = segments[i].trim().replace(/[.*]$/, '')
      if (s.length > 1 && s.length < 50 && !s.includes(',') && !/^\d/.test(s) && /[A-Za-z]/.test(s)) {
        result.label = s; break
      }
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
  console.log(`🎵 Scraper Crescendo v4 — ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`)
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
