// Rescan ciblé : re-fetch uniquement les articles dont `label` est NULL (ou
// vide) et ré-applique la logique de passe 1 (parseHeader + fallback tag WP
// via normalizeLabel). Ne touche jamais un label déjà rempli en base.
//
// Usage :
//   SUPABASE_URL=...
//   SUPABASE_SERVICE_KEY=...
//   node scripts/rescan-labels-for-nulls.js --dry-run   (défaut : dry-run)
//   node scripts/rescan-labels-for-nulls.js --apply     (écriture DB réelle)
//
// Dry-run : compte combien de labels seraient détectés, imprime des
// exemples de succès et d'échecs, aucune requête UPDATE n'est émise.

import { createClient } from '@supabase/supabase-js'
import { parse } from 'node-html-parser'
import { normalizeLabel } from './labels-whitelist.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('✗ Variables SUPABASE_URL et SUPABASE_SERVICE_KEY requises')
  process.exit(1)
}

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const DRY_RUN = !APPLY
const PAUSE_MS = 400

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ---------- Extraction label depuis le premier paragraphe -----------------
// Copie fidèle de la logique `parseHeader` du scraper principal (section
// label). Dupliquée ici pour qu'on puisse la faire évoluer indépendamment
// si on itère sur la passe 2 avant la prochaine sync du scraper.

function parseLabelFromHeader(text) {
  if (!text) return null
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

  return rawLabel
}

// ---------- Extraction HTML depuis l'article --------------------------------

async function fetchArticle(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ref-crescendo-rescan/1.0' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const doc = parse(html)
  const firstP =
       doc.querySelector('.content p')?.text?.trim()
    || doc.querySelector('.entry-content p')?.text?.trim()
    || ''
  const tags = [...doc.querySelectorAll('a[rel="tag"]')]
    .map(a => a.text.trim())
    .filter(Boolean)
  return { firstP, tags }
}

// ---------- Résolution passe 1 ---------------------------------------------

async function resolveLabel(url) {
  const { firstP, tags } = await fetchArticle(url)
  const raw = parseLabelFromHeader(firstP)
  const fromHeader = normalizeLabel(raw)
  if (fromHeader) return { label: fromHeader, source: 'header', raw }
  for (const tag of tags) {
    const normalized = normalizeLabel(tag)
    if (normalized) return { label: normalized, source: 'tag', raw: tag }
  }
  return { label: null, source: null, raw }
}

// ---------- Main -----------------------------------------------------------

async function fetchAllNulls() {
  const all = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabase
      .from('albums')
      .select('id, critique_url')
      .or('label.is.null,label.eq.')
      .not('critique_url', 'is', null)
      .range(from, from + pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return all
}

async function main() {
  console.log(`🎵 Rescan labels NULL — mode ${DRY_RUN ? 'DRY-RUN' : 'APPLY'}\n`)

  const albums = await fetchAllNulls()
  console.log(`${albums.length} albums NULL-label à scanner`)
  const est = Math.ceil(albums.length * (PAUSE_MS + 500) / 1000 / 60)
  console.log(`Durée estimée : ~${est} min\n`)

  let viaHeader = 0, viaTag = 0, missed = 0, errors = 0
  const successes = []
  const failures = []

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i]
    try {
      const { label, source, raw } = await resolveLabel(album.critique_url)
      if (label) {
        if (source === 'header') viaHeader++
        else if (source === 'tag') viaTag++
        if (successes.length < 20) successes.push({ id: album.id, label, source, raw })
        if (APPLY) {
          const { error: upErr } = await supabase
            .from('albums')
            .update({ label })
            .eq('id', album.id)
          if (upErr) throw upErr
        }
      } else {
        missed++
        if (failures.length < 20) failures.push({ id: album.id, raw })
      }
    } catch (err) {
      errors++
      if (failures.length < 20) failures.push({ id: album.id, err: err.message })
    }

    if ((i + 1) % 50 === 0 || i === albums.length - 1) {
      const done = i + 1
      const found = viaHeader + viaTag
      const denom = Math.max(1, done - errors)
      console.log(
        `  [${done}/${albums.length}]`
        + ` header:${viaHeader}`
        + ` tag:${viaTag}`
        + ` miss:${missed}`
        + ` err:${errors}`
        + ` — ${Math.round(100 * found / denom)}% de récupération`,
      )
    }
    await sleep(PAUSE_MS)
  }

  console.log('\n' + '='.repeat(72))
  console.log(`  RAPPORT FINAL — ${DRY_RUN ? 'DRY-RUN (aucun UPDATE émis)' : 'APPLIED'}`)
  console.log('='.repeat(72))
  console.log(`  Total scanné        : ${albums.length}`)
  console.log(`  Via parseHeader     : ${viaHeader}`)
  console.log(`  Via tag WP          : ${viaTag}`)
  console.log(`  Label non détecté   : ${missed}`)
  console.log(`  Erreurs HTTP/DB     : ${errors}`)
  const found = viaHeader + viaTag
  console.log(`  Taux récupération   : ${Math.round(100 * found / albums.length)}% (${found}/${albums.length})`)
  console.log()

  console.log('  --- Exemples de succès (20 premiers) ---')
  for (const s of successes) {
    console.log(`    ✓ ${s.id.slice(0, 55).padEnd(55)}  →  ${s.label}  [${s.source}]`)
  }
  console.log('\n  --- Exemples d\'échecs (20 premiers) ---')
  for (const f of failures) {
    const info = f.err ? `ERR: ${f.err}` : `raw: ${f.raw || '(rien)'}`
    console.log(`    ✗ ${f.id.slice(0, 55).padEnd(55)}  ${info}`)
  }

  if (DRY_RUN) {
    console.log('\n  ⚠ Dry-run : aucune ligne modifiée en base.')
    console.log('  Pour appliquer les UPDATE, relance avec le flag --apply.')
  }
}

main().catch(err => {
  console.error('\n✗ FATAL :', err.message)
  process.exit(1)
})
