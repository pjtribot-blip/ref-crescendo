import { supabase } from '@/lib/supabase'
import { visibleLabel } from '@/lib/excluded-labels'

export const metadata = {
  title: 'Premières gravures mondiales — Référence Crescendo',
  description: 'Les enregistrements en première gravure mondiale critiqués par Crescendo Magazine.',
}

export default async function PremieresPage() {
  const { data: albums, count } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url, composers', { count: 'exact' })
    .eq('is_premiere_mondiale', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const groups = {}
  albums?.forEach(a => {
    const year = new Date(a.published_at).getUTCFullYear()
    if (!groups[year]) groups[year] = []
    groups[year].push(a)
  })

  const sortedYears = Object.keys(groups).sort().reverse()

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Premières gravures mondiales</h1>
      <p className="text-stone-500 mb-10">{count} enregistrement{count > 1 ? 's' : ''} · Les enregistrements qui révèlent au disque des œuvres jamais gravées — trouvailles patrimoniales, redécouvertes et créations contemporaines</p>
      {sortedYears.map(year => (
        <section key={year} className="mb-12">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">{year} <span className="text-stone-300 normal-case font-light">· {groups[year].length} album{groups[year].length > 1 ? 's' : ''}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups[year].map(a => {
              const composer = Array.isArray(a.composers) ? a.composers[0] : null
              return (
                <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer" className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all relative">
                  {a.cover_url ? (
                    <div className="aspect-square bg-stone-100 overflow-hidden"><img src={a.cover_url} alt="" className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="aspect-square bg-stone-100 flex items-center justify-center"><span className="text-stone-300 text-4xl">♪</span></div>
                  )}
                  <div className="absolute top-2 right-2 bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-semibold px-2 py-0.5 rounded">Première mondiale</div>
                  <div className="p-3">
                    <p className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 mb-1">{a.title || a.article_title}</p>
                    {composer && (
                      <p className="text-xs text-stone-600 mb-1">{composer}</p>
                    )}
                    {visibleLabel(a.label) && (
                      <p className="text-xs uppercase tracking-wider text-stone-500">{visibleLabel(a.label)}</p>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
