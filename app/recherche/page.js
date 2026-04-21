import Link from 'next/link'
import HideUnlabeledToggle from '@/app/_components/HideUnlabeledToggle'
import { searchAll } from '@/lib/search'

export const metadata = { title: 'Recherche — Référence Crescendo' }

export default async function RecherchePage({ searchParams }) {
  const params = await searchParams
  const q = (params?.q || '').trim()
  const hide = params?.hide !== '0'   // défaut activé ; désactivé seulement si hide=0 explicite

  const { compositeurs, labels, albums } = q.length >= 2
    ? await searchAll(q, { limit: 50, includeHeaderRaw: true, hideUnlabeled: hide })
    : { compositeurs: [], labels: [], albums: [] }

  const totalResults = compositeurs.length + labels.length + albums.length

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-6 text-stone-800">Recherche</h1>

      <form method="GET" action="/recherche" className="mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Compositeur, album, label, interprète…"
            autoFocus
            className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:border-stone-500"
          />
          <button type="submit" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
            Rechercher
          </button>
        </div>
      </form>

      {q.length >= 2 && (
        <div className="mb-6">
          <HideUnlabeledToggle hide={hide} count={albums.length} />
        </div>
      )}

      {q.length >= 2 && totalResults === 0 && (
        <p className="text-stone-400 text-center py-10">Aucun résultat pour « {q} »</p>
      )}

      {q.length >= 2 && totalResults > 0 && (
        <div className="space-y-10">
          {compositeurs.length > 0 && (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
                Compositeurs ({compositeurs.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compositeurs.map(c => {
                  const dates = c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''
                  const subtitle = [c.nationality, dates, c.period].filter(Boolean).join(' · ')
                  return (
                    <Link
                      key={c.id}
                      href={`/compositeurs/${c.id}`}
                      className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-stone-800 text-sm truncate">{c.name}</p>
                        {subtitle && <p className="text-xs text-stone-400 truncate">{subtitle}</p>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {labels.length > 0 && (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
                Labels ({labels.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {labels.map(l => (
                  <Link
                    key={l.name}
                    href={`/albums?label=${encodeURIComponent(l.name)}`}
                    className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate">{l.name}</p>
                      <p className="text-xs text-stone-400">
                        {l.count} album{l.count > 1 ? 's' : ''} chroniqué{l.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
                Albums ({albums.length})
              </h2>
              <div className="space-y-3">
                {albums.map(a => {
                  const subtitle = [a.composer, a.label, a.year].filter(Boolean).join(' · ')
                  return (
                    <a
                      key={a.id}
                      href={a.critique_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all"
                    >
                      {a.cover_url
                        ? <img src={a.cover_url} alt="" className="w-12 h-12 object-cover rounded shrink-0" />
                        : <div className="w-12 h-12 bg-stone-100 rounded shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-700 line-clamp-1">{a.title}</p>
                        {subtitle && <p className="text-xs text-stone-400 truncate">{subtitle}</p>}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {q.length < 2 && (
        <p className="text-stone-400 text-center py-10">
          Tapez au moins 2 caractères — vous pouvez aussi utiliser <kbd className="px-1.5 py-0.5 text-xs bg-stone-100 border border-stone-300 rounded">⌘K</kbd> depuis n'importe quelle page.
        </p>
      )}
    </main>
  )
}
