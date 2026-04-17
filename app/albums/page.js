import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export const metadata = {
  title: 'Albums — Référence Crescendo',
  description: '5190 critiques discographiques de musique classique.',
}
export default async function AlbumsPage({ searchParams }) {
  const params = await searchParams
  const label = params?.label || null
  const page = parseInt(params?.page || '1')
  const perPage = 24
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Récupérer la liste des labels distincts pour le menu
  const { data: labelsData } = await supabase
    .from('albums')
    .select('label')
    .not('label', 'is', null)
  const labelsCount = {}
  labelsData?.forEach(a => { labelsCount[a.label] = (labelsCount[a.label] || 0) + 1 })
  const labelsList = Object.entries(labelsCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  let query = supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url, composers, notes', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)
  if (label) query = query.eq('label', label)
  const { data: albums, count } = await query
  const totalPages = Math.ceil((count || 0) / perPage)
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Albums</h1>
      <p className="text-stone-500 mb-6">{count || 0} critiques · Référence Crescendo Magazine</p>

      {/* Filtre par label */}
      <form method="GET" className="mb-8 flex flex-wrap items-center gap-3">
        <label htmlFor="label-select" className="text-sm text-stone-600">Label :</label>
        <select
          id="label-select"
          name="label"
          defaultValue={label || ''}
          className="border border-stone-300 rounded px-3 py-1.5 text-sm text-stone-700 bg-white hover:border-stone-400 focus:border-stone-500 focus:outline-none"
        >
          <option value="">Tous les labels ({labelsData?.length || 0})</option>
          {labelsList.map(l => (
            <option key={l.name} value={l.name}>{l.name} ({l.count})</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 border border-stone-400 rounded text-sm text-stone-700 hover:bg-stone-100 transition-colors"
        >
          Filtrer
        </button>
        {label && (
          <Link
            href="/albums"
            className="px-4 py-1.5 text-sm text-stone-500 hover:text-stone-700 underline"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {albums?.map(a => (
          <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer"
            className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group">
            {a.cover_url && (
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img src={a.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            {!a.cover_url && (
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
      {/* Pagination */}
      <div className="flex gap-2 justify-center">
        {page > 1 && (
          <Link href={`/albums?page=${page - 1}${label ? `&label=${label}` : ''}`}
            className="px-4 py-2 border border-stone-300 rounded text-sm text-stone-600 hover:border-stone-500 transition-colors">
            ← Précédent
          </Link>
        )}
        <span className="px-4 py-2 text-sm text-stone-400">
          Page {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link href={`/albums?page=${page + 1}${label ? `&label=${label}` : ''}`}
            className="px-4 py-2 border border-stone-300 rounded text-sm text-stone-600 hover:border-stone-500 transition-colors">
            Suivant →
          </Link>
        )}
      </div>
    </main>
  )
}
