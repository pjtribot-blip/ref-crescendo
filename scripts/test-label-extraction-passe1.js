// Test offline de la passe 1 — amélioration détection label.
//
// Charge les 20 fichiers HTML locaux dans /tmp/crescendo-sample/
// et simule la logique du scraper modifié (parseHeader + fallback tags WP).
// Affiche un rapport de ventilation : succès / échecs / suspicions de FP.
//
// Usage :
//   node scripts/test-label-extraction-passe1.js

import fs from 'node:fs'
import path from 'node:path'
import { normalizeLabel } from './labels-whitelist.js'

const SAMPLE_DIR = '/tmp/crescendo-sample'

// ---------- Extraction HTML ---------------------------------------------
// Réplique exactement le comportement du scraper : premier <p> de div.content.

function clean(s) {
  let t = s.replace(/<[^>]+>/g, '')
  const repl = [
    ['&nbsp;', ' '], ['&amp;', '&'],
    ['&#8217;', "'"], ['&#8216;', "'"],
    ['&#8220;', '"'], ['&#8221;', '"'],
    ['&#8211;', '–'], ['&#8212;', '—'],
    ['&laquo;', '«'], ['&raquo;', '»'],
    ['&eacute;', 'é'], ['&egrave;', 'è'], ['&ecirc;', 'ê'],
    ['&agrave;', 'à'], ['&acirc;', 'â'],
    ['&ocirc;', 'ô'], ['&ccedil;', 'ç'], ['&icirc;', 'î'],
  ]
  for (const [a, b] of repl) t = t.split(a).join(b)
  return t.split(/\s+/).filter(Boolean).join(' ')
}

function extractFirstP(html) {
  const m = html.match(/<div[^>]+class="[^"]*\bcontent\b[^"]*"[^>]*>/)
  if (!m) return ''
  const start = m.index + m[0].length
  const slice = html.slice(start, start + 80000)
  const p = slice.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  return p ? clean(p[1]) : ''
}

function extractTags(html) {
  return [...html.matchAll(/<a[^>]+rel="tag"[^>]*>([^<]+)<\/a>/g)]
    .map(m => m[1].trim())
    .filter(Boolean)
}

// ---------- Réplique de parseHeader (section label) ---------------------

function parseLabelFromHeader(text) {
  if (!text) return { raw: null, normalized: null }
  let rawLabel = null

  // Tentative 1 : « – LabelName CODE123 »
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

  return { raw: rawLabel, normalized: normalizeLabel(rawLabel) }
}

// ---------- Logique passe 1 (tags en fallback) --------------------------

function resolveLabel(text, tags) {
  const { raw, normalized } = parseLabelFromHeader(text)
  if (normalized) {
    return { source: 'header', raw, final: normalized }
  }
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      const n = normalizeLabel(tag)
      if (n) return { source: 'tag', raw: tag, final: n }
    }
  }
  return { source: null, raw, final: null }
}

// ---------- Run --------------------------------------------------------

const files = fs.readdirSync(SAMPLE_DIR)
  .filter(f => f.endsWith('.html'))
  .sort()

let byHeader = 0, byTag = 0, missed = 0
const missedDetails = []
const results = []

for (const f of files) {
  const slug = f.replace('.html', '')
  const html = fs.readFileSync(path.join(SAMPLE_DIR, f), 'utf-8')
  const firstP = extractFirstP(html)
  const tags = extractTags(html)
  const { source, raw, final } = resolveLabel(firstP, tags)

  results.push({ slug, tags: tags.slice(0, 3), firstP: firstP.slice(0, 160), raw, final, source })

  if (source === 'header') byHeader++
  else if (source === 'tag') byTag++
  else {
    missed++
    missedDetails.push({ slug, tags, firstP: firstP.slice(0, 200), raw })
  }
}

// ---------- Rapport ----------------------------------------------------

console.log('='.repeat(72))
console.log('  TEST OFFLINE PASSE 1 — Détection label (header + fallback tags WP)')
console.log('='.repeat(72))
console.log(`  Sample : ${files.length} articles NULL-label`)
console.log()

console.log('--- VENTILATION ---')
console.log(`  Trouvé via header   : ${byHeader} / ${files.length}`)
console.log(`  Trouvé via tag WP   : ${byTag} / ${files.length}`)
console.log(`  Manqué              : ${missed} / ${files.length}`)
const total = byHeader + byTag
const rate = Math.round(100 * total / files.length)
console.log(`  Taux de récupération: ${total} / ${files.length} (${rate}%)`)
console.log()

console.log('--- DÉTAIL PAR ARTICLE ---')
for (const r of results) {
  const icon = r.source === 'header' ? '✓H' : r.source === 'tag' ? '✓T' : '✗ '
  console.log(`\n${icon} ${r.slug}`)
  if (r.source) {
    console.log(`      label  : ${r.final}   (source: ${r.source}${r.raw ? `, raw: "${r.raw}"` : ''})`)
  } else {
    console.log(`      P1     : ${r.firstP || '(vide)'}`)
    console.log(`      tags   : ${JSON.stringify(r.tags)}`)
    console.log(`      raw    : ${r.raw ? `"${r.raw}" → null par whitelist` : '(aucun extrait)'}`)
  }
}

console.log()
console.log('--- ÉCHECS DÉTAILLÉS ---')
if (!missedDetails.length) {
  console.log('  (aucun)')
} else {
  for (const m of missedDetails) {
    console.log(`\n  ${m.slug}`)
    console.log(`    P1 [${m.firstP.length > 0 ? m.firstP.length : 0} chars] : ${m.firstP.slice(0, 300)}`)
    console.log(`    Tags WP : ${JSON.stringify(m.tags)}`)
    console.log(`    Raw extrait header : ${m.raw ? `"${m.raw}"` : '(rien)'}`)
  }
}
