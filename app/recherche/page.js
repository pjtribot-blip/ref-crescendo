import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = { title: 'Recherche — Référence Crescendo' }

export default async function RecherchePage({ searchParams }) {
  const params = await searchParams
  const q = params?.q || ''
  let compositeurs = [], albums = []

  if (q.length >= 2) {
    const [{ data: comps }, { data: albs }] = await Promise.all([
      supabase.from('compositeurs').select('id, name, period, born, died, familiarity').ilike('name', `%${q}%`).limit(12),
      supabase.from('albums').select('id, title, article_title, label, published_at, critique_url, cover_url').or(`title.ilike.%${q}%,article_title.ilike.%${q}%`).order('published_at', { ascending: false }).limit(12),
    ])
    compositeurs = comps || []
    albums = albs || []
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-6 text-stone-800">Recherche</h1>
      <form method="GET" action="/recherche" className="mb-10">
        <div className="flex gap-3">
          <input type="text" name="q" defaultValue={q} placeholder="Compositeur, album, label..." autoFocus className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:border-stone-500" />
          <button type="submit" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">Rechercher</button>
        </div>
      </form>
      {q.length >= 2 && (
        <div className="space-y-10">
          {compositeurs.length > 0 && (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">Compositeurs ({compositeurs.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compositeurs.map(c => (
                  <Link key={c.id} href={`/compositeurs/${c.id}`} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all">
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{c.name}</p>
                      <p className="text-xs text-stone-400">{c.born && c.died ? `${c.born}–${c.died}` : ''}{c.period ? ` · ${c.period}` : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {albums.length > 0 && (
            <section>
              <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">Albums ({albums.length})</h2>
              <div className="space-y-3">
                {albums.map(a => (
                  <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer" className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all">
                    {a.cover_url ? <img src={a.cover_url} alt="" className="w-12 h-12 object-cover rounded shrink-0" /> : <div className="w-12 h-12 bg-stone-100 rounded shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-700 line-clamp-1">{a.title || a.article_title}</p>
                      <p className="text-xs text-stone-400">{a.label ? a.label + ' · ' : ''}{a.published_at ? new Date(a.published_at).getFullYear() : ''}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
          {compositeurs.length === 0 && albums.length === 0 && <p className="text-stone-400 text-center py-10">Aucun résultat</p>}
        </div>
      )}
    </main>
  )
}
