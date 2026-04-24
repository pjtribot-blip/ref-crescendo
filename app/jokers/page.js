import { supabase } from '@/lib/supabase'
import { JokerLogo } from '@/lib/joker-logo'
import { visibleLabel } from '@/lib/excluded-labels'

export const metadata = {
  title: 'Jokers — Référence Crescendo',
  description: 'Les coups de cœur Joker de la rédaction de Crescendo Magazine.',
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

export default async function JokersPage() {
  const { data: albums, count } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url', { count: 'exact' })
    .eq('is_joker', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const groups = {}
  albums?.forEach(a => {
    const d = new Date(a.published_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
    const label = `${MOIS[d.getMonth()]} ${d.getFullYear()}`
    if (!groups[key]) groups[key] = { label, albums: [] }
    groups[key].albums.push(a)
  })

  const sortedKeys = Object.keys(groups).sort().reverse()

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Jokers</h1>
      <p className="text-stone-500 mb-10">{count} coups de cœur Joker · Les albums d'exception sélectionnés par Crescendo Magazine</p>
      {sortedKeys.map(key => (
        <section key={key} className="mb-12">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4 capitalize">{groups[key].label} <span className="text-stone-300 normal-case font-light">· {groups[key].albums.length} album{groups[key].albums.length > 1 ? 's' : ''}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups[key].albums.map(a => (
              <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer" className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all relative">
                {a.cover_url ? (
                  <div className="aspect-square bg-stone-100 overflow-hidden"><img src={a.cover_url} alt="" className="w-full h-full object-cover" /></div>
                ) : (
                  <div className="aspect-square bg-stone-100 flex items-center justify-center"><span className="text-stone-300 text-4xl">♪</span></div>
                )}
                <div className="absolute top-2 right-2 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1"><JokerLogo size="sm" /> Joker</div>
                <div className="p-3">
                  <p className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 mb-1">{a.title || a.article_title}</p>
                  {visibleLabel(a.label) && (
                    <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{visibleLabel(a.label)}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
