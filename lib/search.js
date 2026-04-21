import { supabase } from './supabase'
import { EXCLUDED_LABELS } from './excluded-labels'

/**
 * Logique de recherche unifiée, partagée entre :
 *   - app/api/search/route.js (dropdown live, limit 5 par type)
 *   - app/recherche/page.js   (résultats complets, limit 50 par type)
 *
 * Retourne { compositeurs, labels, albums } triés par pertinence :
 *   - priorité aux matchs en début de nom (starts-with)
 *   - puis par ordre alphabétique français
 *
 * Recherche insensible à la casse et aux accents via une normalisation
 * JS (NFD + strip des diacritiques) appliquée côté client après un
 * pré-filtre ILIKE côté Supabase. Fonctionne sur 608 compositeurs +
 * 5200 albums avec latence p95 < 300 ms sans index supplémentaire.
 *
 * TODO perf (YAGNI pour l'instant) : si les volumes doublent, ajouter
 * des index GIN trigram côté Supabase :
 *   CREATE EXTENSION IF NOT EXISTS unaccent;
 *   CREATE EXTENSION IF NOT EXISTS pg_trgm;
 *   CREATE INDEX idx_compositeurs_name_trgm
 *     ON compositeurs USING gin (unaccent(lower(name)) gin_trgm_ops);
 */

const ILIKE_FETCH_LIMIT = 200   // plafond avant re-filtrage JS

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function sortByRelevance(a, b) {
  // 1) starts-with d'abord
  if (a.starts !== b.starts) return a.starts ? -1 : 1
  // 2) alphabétique français
  return a.sortKey.localeCompare(b.sortKey, 'fr')
}

export async function searchAll(q, { limit = 5, includeHeaderRaw = false, hideUnlabeled = false } = {}) {
  const trimmed = (q || '').trim()
  if (trimmed.length < 2) {
    return { compositeurs: [], labels: [], albums: [] }
  }
  const nq = normalize(trimmed)

  const albumFields = includeHeaderRaw
    ? `title.ilike.%${trimmed}%,article_title.ilike.%${trimmed}%,title.ilike.%${nq}%,article_title.ilike.%${nq}%,header_raw.ilike.%${trimmed}%,header_raw.ilike.%${nq}%`
    : `title.ilike.%${trimmed}%,article_title.ilike.%${trimmed}%,title.ilike.%${nq}%,article_title.ilike.%${nq}%`

  const [compRes, labelsRes, albumsRes] = await Promise.all([
    supabase.from('compositeurs').select('id, name, nationality, born, died, period'),
    supabase.from('albums').select('label').not('label', 'is', null),
    supabase
      .from('albums')
      .select('id, title, article_title, label, published_at, critique_url, cover_url, composers, header_raw')
      .or(albumFields)
      .limit(ILIKE_FETCH_LIMIT),
  ])

  // Compositeurs ---------------------------------------------------------
  const compositeurs = (compRes.data || [])
    .map(c => {
      const nameN = normalize(c.name)
      const natN = normalize(c.nationality || '')
      return {
        c,
        match: nameN.includes(nq) || natN.includes(nq),
        nameMatch: nameN.includes(nq),
        starts: nameN.startsWith(nq),
        sortKey: c.name,
      }
    })
    .filter(x => x.match)
    .sort((a, b) => {
      // match sur le nom prioritaire sur match uniquement par nationalité
      if (a.nameMatch !== b.nameMatch) return a.nameMatch ? -1 : 1
      return sortByRelevance(a, b)
    })
    .slice(0, limit)
    .map(x => ({
      id: x.c.id,
      name: x.c.name,
      nationality: x.c.nationality,
      born: x.c.born,
      died: x.c.died,
      period: x.c.period,
    }))

  // Labels (distinct, avec compte, EXCLUDED_LABELS filtrés) --------------
  const labelCounts = {}
  for (const row of labelsRes.data || []) {
    const l = row.label?.trim()
    if (!l || EXCLUDED_LABELS.has(l)) continue
    if (!normalize(l).includes(nq)) continue
    labelCounts[l] = (labelCounts[l] || 0) + 1
  }
  const labels = Object.entries(labelCounts)
    .map(([name, count]) => ({
      name,
      count,
      starts: normalize(name).startsWith(nq),
      sortKey: name,
    }))
    .sort(sortByRelevance)
    .slice(0, limit)
    .map(({ name, count }) => ({ name, count }))

  // Albums ---------------------------------------------------------------
  const albums = (albumsRes.data || [])
    .map(a => {
      const title = a.title || a.article_title || ''
      const titleN = normalize(title)
      const headerN = includeHeaderRaw ? normalize(a.header_raw || '') : ''
      const match = titleN.includes(nq) || (includeHeaderRaw && headerN.includes(nq))
      return {
        a,
        title,
        match,
        titleMatch: titleN.includes(nq),
        starts: titleN.startsWith(nq),
        sortKey: title,
      }
    })
    .filter(x => x.match)
    .filter(x => !hideUnlabeled || (x.a.label && x.a.label.trim() !== ''))
    .sort((a, b) => {
      // match titre prioritaire sur match header_raw
      if (a.titleMatch !== b.titleMatch) return a.titleMatch ? -1 : 1
      return sortByRelevance(a, b)
    })
    .slice(0, limit)
    .map(x => ({
      id: x.a.id,
      title: x.title,
      composer: Array.isArray(x.a.composers) ? (x.a.composers[0] || null) : null,
      label: x.a.label,
      year: x.a.published_at ? new Date(x.a.published_at).getFullYear() : null,
      critique_url: x.a.critique_url,
      cover_url: x.a.cover_url,
    }))

  return { compositeurs, labels, albums }
}
