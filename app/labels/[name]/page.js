import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { PrestoButton } from '@/lib/presto'
import { JokerLogo } from '@/lib/joker-logo'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const name = decodeURIComponent((await params).name)
  return {
    title: `${name} — Référence Crescendo`,
    description: `Albums du label ${name} chroniqués par Crescendo Magazine.`,
  }
}

export default async function LabelDetailPage({ params }) {
  const name = decodeURIComponent((await params).name)

  const { data: albumsRaw } = await supabase
    .from('albums')
    .select('id, title, article_title, composers, label, published_at, critique_url, cover_url, millesime_annee, millesime_categorie, is_joker')
    .eq('label', name)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })

  const albums = albumsRaw || []
  if (albums.length === 0) notFound()

  const nbAlbums = albums.length
  const nbMillesimes = albums.filter(a => a.millesime_annee).length
  const nbJokers = albums.filter(a => a.is_joker).length

  const compTally = {}
  for (const a of albums) {
    if (Array.isArray(a.composers)) {
      for (const c of a.composers) compTally[c] = (compTally[c] || 0) + 1
    }
  }
  const topComposers = Object.entries(compTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const topNames = topComposers.map(([n]) => n)
  const { data: compMeta } = topNames.length > 0
    ? await supabase.from('compositeurs').select('id, name').in('name', topNames)
    : { data: [] }
  const idByName = Object.fromEntries((compMeta || []).map(m => [m.name, m.id]))

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/labels" className="text-sm text-stone-400 hover:text-stone-600 mb-6 inline-block">← Labels</Link>

      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-800 mb-4">{name}</h1>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-300 rounded-md text-xs font-medium text-stone-700">
            {nbAlbums} album{nbAlbums > 1 ? 's' : ''}
          </span>
          {nbMillesimes > 0 && (
            <Link
              href="/palmares"
              className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border-2 border-amber-400 rounded-lg text-xs font-semibold text-amber-900 hover:bg-amber-200 hover:border-amber-500 shadow-sm transition-colors"
            >
              <span className="text-amber-600">★</span>
              {nbMillesimes} Millésime{nbMillesimes > 1 ? 's' : ''}
            </Link>
          )}
          {nbJokers > 0 && (
            <Link
              href="/jokers"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 border-2 border-orange-400 rounded-lg text-sm font-semibold text-orange-900 hover:bg-orange-200 hover:border-orange-500 shadow-sm transition-colors"
            >
              <JokerLogo size="md" /> {nbJokers} Joker{nbJokers > 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>

      {topComposers.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-3">Compositeurs les plus chroniqués</h2>
          <ul className="space-y-1">
            {topComposers.map(([nom, count]) => {
              const id = idByName[nom]
              const content = (
                <>
                  <span className="text-stone-700">{nom}</span>{' '}
                  <span className="text-stone-400">({count})</span>
                </>
              )
              return (
                <li key={nom} className="text-sm flex gap-2 items-baseline">
                  <span className="text-stone-300">○</span>
                  {id ? (
                    <Link href={`/compositeurs/${id}`} className="hover:text-stone-900">{content}</Link>
                  ) : (
                    <span>{content}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
          Critiques Crescendo ({nbAlbums})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {albums.map(a => (
            <article
              key={a.id}
              className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all group"
            >
              <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="relative shrink-0">
                {a.cover_url ? (
                  <img src={a.cover_url} alt="" className="w-14 h-14 object-cover rounded" />
                ) : (
                  <div className="w-14 h-14 bg-stone-100 flex items-center justify-center rounded">
                    <span className="text-stone-300 text-xl">♪</span>
                  </div>
                )}
                {(a.millesime_annee || a.is_joker) && (
                  <div className="absolute -top-1 -right-1 flex flex-col gap-0.5 items-end">
                    {a.millesime_annee && (
                      <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                        ★ Millésime {a.millesime_annee}
                      </span>
                    )}
                    {a.is_joker && (
                      <span className="bg-orange-100 border border-orange-300 text-orange-800 text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm inline-flex items-center gap-0.5">
                        <JokerLogo size="xs" /> Joker
                      </span>
                    )}
                  </div>
                )}
              </a>
              <div className="min-w-0 flex-1">
                <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="block">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 truncate">
                    {a.title || a.article_title}
                  </p>
                  {Array.isArray(a.composers) && a.composers.length > 0 && (
                    <p className="text-xs text-stone-500 mt-0.5 truncate">
                      {a.composers.join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 mt-0.5">
                    {a.published_at ? new Date(a.published_at).getFullYear() : ''}
                  </p>
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-600 hover:text-stone-900 font-medium">
                    Lire la chronique →
                  </a>
                  <PrestoButton title={a.title || a.article_title} composers={a.composers} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
