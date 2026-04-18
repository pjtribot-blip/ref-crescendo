import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Albums — Référence Crescendo',
  description: '5190 critiques discographiques de musique classique.',
}

export const revalidate = 3600

const PERIODES = {
  all: { label: 'Toutes les périodes', gte: null, lte: null },
  recent: { label: 'Récents (2024–2026)', gte: '2024-01-01', lte: '2026-12-31' },
  '2020-2023': { label: '2020–2023', gte: '2020-01-01', lte: '2023-12-31' },
  '2015-2019': { label: '2015–2019', gte: '2015-01-01', lte: '2019-12-31' },
  'pre-2015': { label: 'Avant 2015', gte: null, lte: '2014-12-31' },
}

const TRIS = {
  recent: { label: 'Plus récent', column: 'published_at', asc: false },
  old: { label: 'Plus ancien', column: 'published_at', asc: true },
  title: { label: 'Titre A–Z', column: 'title', asc: true },
  label: { label: 'Label A–Z', column: 'label', asc: true },
}

export default async function AlbumsPage({ searchParams }) {
  const params = await searchParams
  const q = (params?.q || '').trim()
  const composer = (params?.composer || '').trim()
  const label = (params?.label || '').trim()
  const periode = params?.periode && PERIODES[params.periode] ? params.periode : 'all'
  const millesime = params?.millesime === '1'
  const joker = params?.joker === '1'
  const sort = params?.sort && TRIS[params.sort] ? params.sort : 'recent'
  const page = Math.max(1, parseInt(params?.page || '1'))
  const perPage = 24
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const [composersRes, labelsRes] = await Promise.all([
    supabase.from('albums').select('composers'),
    supabase.from('albums').select('label').not('label', 'is', null).neq('label', ''),
  ])

  const composerCounts = {}
  for (const row of composersRes.data || []) {
    const names = Array.isArray(row.composers) ? row.composers : []
    for (const n of names) composerCounts[n] = (composerCounts[n] || 0) + 1
  }
  const composerList = Object.entries(composerCounts)
    .filter(([, c]) => c >= 3)
    .sort((a, b) => a[0].localeCompare(b[0], 'fr'))

  const labelCounts = {}
  for (const row of labelsRes.data || []) {
    const l = row.label?.trim()
    if (l && l.length > 1 && l.length < 50) labelCounts[l] = (labelCounts[l] || 0) + 1
  }
  const labelList = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  let query = supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url, composers, notes, millesime_annee, millesime_label, is_joker', { count: 'exact' })

  if (q) query = query.ilike('title', `%${q}%`)
  if (composer) query = query.contains('composers', [composer])
  if (label) query = query.eq('label', label)
  const periodeConfig = PERIODES[periode]
  if (periodeConfig.gte) query = query.gte('published_at', periodeConfig.gte)
  if (periodeConfig.lte) query = query.lte('published_at', periodeConfig.lte)
  if (millesime) query = query.not('millesime_annee', 'is', null)
  if (joker) query = query.eq('is_joker', true)

  const tri = TRIS[sort]
  query = query.order(tri.column, { ascending: tri.asc, nullsFirst: false }).range(from, to)

  const { data: albums, count } = await query
  const totalPages = Math.max(1, Math.ceil((count || 0) / perPage))

  const activeFilters = []
  if (q) activeFilters.push({ key: 'q', label: `« ${q} »` })
  if (composer) activeFilters.push({ key: 'composer', label: composer })
  if (label) activeFilters.push({ key: 'label', label })
  if (periode !== 'all') activeFilters.push({ key: 'periode', label: PERIODES[periode].label })
  if (millesime) activeFilters.push({ key: 'millesime', label: '★ Millésime' })
  if (joker) activeFilters.push({ key: 'joker', label: '★ Joker' })
  if (sort !== 'recent') activeFilters.push({ key: 'sort', label: `Tri : ${TRIS[sort].label}` })

  const hasActive = activeFilters.length > 0

  const buildHref = (overrides = {}) => {
    const qs = new URLSearchParams()
    const merged = { q, composer, label, periode, millesime: millesime ? '1' : '', joker: joker ? '1' : '', sort, ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v && !(k === 'periode' && v === 'all') && !(k === 'sort' && v === 'recent')) qs.set(k, String(v))
    }
    const str = qs.toString()
    return str ? `/albums?${str}` : '/albums'
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Albums</h1>
      <p className="text-stone-500 mb-6">{count || 0} critique{count !== 1 ? 's' : ''} · Référence Crescendo Magazine</p>

      <form method="GET" className="mb-6 p-5 bg-white border border-stone-200 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="q" className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              Recherche
            </label>
            <input
              type="text"
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Rechercher dans le titre..."
              className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="composer" className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              Compositeur
            </label>
            <select
              id="composer"
              name="composer"
              defaultValue={composer}
              className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white focus:border-stone-500 focus:outline-none"
            >
              <option value="">Tous les compositeurs ({composerList.length})</option>
              {composerList.map(([name, c]) => (
                <option key={name} value={name}>{name} ({c})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="label-select" className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              Label
            </label>
            <select
              id="label-select"
              name="label"
              defaultValue={label}
              className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white focus:border-stone-500 focus:outline-none"
            >
              <option value="">Tous les labels ({labelList.length})</option>
              {labelList.map(l => (
                <option key={l.name} value={l.name}>{l.name} ({l.count})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="periode" className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              Période
            </label>
            <select
              id="periode"
              name="periode"
              defaultValue={periode}
              className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white focus:border-stone-500 focus:outline-none"
            >
              {Object.entries(PERIODES).map(([key, p]) => (
                <option key={key} value={key}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1">
              Tri
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white focus:border-stone-500 focus:outline-none"
            >
              {Object.entries(TRIS).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              name="millesime"
              value="1"
              defaultChecked={millesime}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="inline-flex items-center gap-1">
              <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-semibold">★</span>
              Millésimes uniquement
            </span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              name="joker"
              value="1"
              defaultChecked={joker}
              className="rounded border-stone-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="inline-flex items-center gap-1">
              <span className="text-xs bg-orange-100 border border-orange-300 text-orange-800 px-1.5 py-0.5 rounded font-semibold">★ Joker</span>
              uniquement
            </span>
          </label>

          <div className="ml-auto flex gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 transition-colors"
            >
              Filtrer
            </button>
            {hasActive && (
              <Link
                href="/albums"
                className="px-4 py-1.5 border border-stone-300 rounded text-sm text-stone-600 hover:border-stone-500 transition-colors"
              >
                Réinitialiser
              </Link>
            )}
          </div>
        </div>
      </form>

      {hasActive && (
        <div className="mb-6 p-3 bg-stone-50 border border-stone-200 rounded-lg flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone-700 font-medium">
            {count || 0} résultat{count !== 1 ? 's' : ''}
          </span>
          <span className="text-stone-400">·</span>
          {activeFilters.map(f => (
            <span key={f.key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-300 rounded-full text-xs text-stone-700">
              {f.label}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {albums?.map(a => (
          <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer"
            className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group relative">
            {a.millesime_annee && (
              <div className="absolute top-2 right-2 z-10 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                ★ {a.millesime_label || 'Millésime'}
              </div>
            )}
            {!a.millesime_annee && a.is_joker && (
              <div className="absolute top-2 right-2 z-10 bg-orange-100 border border-orange-300 text-orange-800 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                ★ Joker
              </div>
            )}
            {a.cover_url ? (
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img src={a.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="aspect-square bg-stone-100 flex items-center justify-center">
                <span className="text-stone-300 text-4xl">♪</span>
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 mb-1">
                {a.title || a.article_title}
              </p>
              <p className="text-xs text-stone-400">
                {a.label && `${a.label}`}
                {a.published_at ? ` · ${new Date(a.published_at).getFullYear()}` : ''}
              </p>
              {a.notes?.interprétation && (
                <p className="text-xs text-stone-500 mt-1">Interprétation : {a.notes.interprétation}/10</p>
              )}
            </div>
          </a>
        ))}
      </div>

      {(!albums || albums.length === 0) && (
        <p className="text-stone-500 text-center py-12">Aucun résultat pour ces filtres.</p>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {page > 1 && (
            <Link href={buildHref({ page: page - 1 })}
              className="px-4 py-2 border border-stone-300 rounded text-sm text-stone-600 hover:border-stone-500 transition-colors">
              ← Précédent
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-stone-400">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildHref({ page: page + 1 })}
              className="px-4 py-2 border border-stone-300 rounded text-sm text-stone-600 hover:border-stone-500 transition-colors">
              Suivant →
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
