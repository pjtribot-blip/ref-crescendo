import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { PrestoButton } from '@/lib/presto'
import { JokerLogo } from '@/lib/joker-logo'

export async function generateMetadata({ params }) {
  const id = (await params).id
  const { data: c } = await supabase.from('compositeurs').select('name, description').eq('id', id).single()
  if (!c) return {}
  const title = c.name
  const description = (c.description?.slice(0, 155) || `${c.name} — fiche compositeur sur la base de données critique de Crescendo Magazine.`).trim()
  return {
    title,
    description,
    openGraph: { type: 'profile', title: `${c.name} — Phono.Crescendo`, description },
    twitter: { card: 'summary_large_image', title: `${c.name} — Phono.Crescendo`, description },
  }
}

export default async function CompositeurPage({ params }) {
  const id = (await params).id
  const { data: c } = await supabase.from('compositeurs').select('*').eq('id', id).single()
  if (!c) notFound()

  const { data: albumsRaw } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, notes, cover_url, millesime_annee, millesime_categorie, millesime_label, is_joker')
    .contains('composers', [c.name])
    .order('published_at', { ascending: false })

  const albums = albumsRaw || []
  const millesimes = albums.filter(a => a.millesime_annee)
  const matrimoineAlbums = albums.filter(a => a.millesime_categorie === 'matrimoine')

  const nbMillesimes = millesimes.length
  const nbJokers = albums.filter(a => a.is_joker).length
  const singleMillesimeYear = nbMillesimes === 1 ? millesimes[0].millesime_annee : null
  const hasMatrimoine = matrimoineAlbums.length > 0
  const matrimoineYear = matrimoineAlbums[0]?.millesime_annee

  const albumsToDisplay = albums.slice(0, 20)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/compositeurs" className="text-sm text-stone-400 hover:text-stone-600 mb-6 inline-block">← Compositeurs</Link>
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-light text-stone-800">{c.name}</h1>
          {c.familiarity === 'rare' && <span className="text-xs border border-amber-400 text-amber-600 px-2 py-1 rounded shrink-0 mt-1">Rare</span>}
        </div>
        <p className="text-stone-400 text-sm mb-4">
          {c.born && c.died ? `${c.born}–${c.died}` : ''}{c.nationality ? ` · ${c.nationality}` : ''}{c.period ? ` · ${c.period}` : ''}
        </p>

        {c.bio_enrichie && (
          <section className="border-t border-b border-stone-200 py-6 my-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-4">Présentation</h2>
            <div className="font-serif text-base leading-relaxed text-stone-700 space-y-4">
              {c.bio_enrichie.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
            <p className="text-xs italic text-stone-400 mt-6">
              Notice éditoriale générée par Claude et relue par la rédaction Crescendo.
            </p>
          </section>
        )}

        {(nbMillesimes > 0 || nbJokers > 0 || hasMatrimoine) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {nbMillesimes > 0 && (
              <Link
                href="/palmares"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-sm font-semibold text-amber-900 hover:bg-amber-200 hover:border-amber-500 shadow-sm transition-colors"
              >
                <span className="text-amber-600">★</span>
                {nbMillesimes} Millésime{nbMillesimes > 1 ? 's' : ''} Crescendo
                {singleMillesimeYear && (
                  <span className="text-amber-700 font-normal">· {singleMillesimeYear}</span>
                )}
              </Link>
            )}
            {nbJokers > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 border border-orange-300 rounded-md text-xs font-medium text-orange-800">
                <JokerLogo size="md" /> {nbJokers} Joker{nbJokers > 1 ? 's' : ''}
              </span>
            )}
            {hasMatrimoine && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 border border-rose-300 rounded-md text-xs font-semibold text-rose-800">
                ★ Matrimoine
              </span>
            )}
          </div>
        )}

        {hasMatrimoine && (
          <p className="text-sm italic text-rose-800 mb-4">
            Distinguée au Matrimoine Crescendo{matrimoineYear ? ` en ${matrimoineYear}` : ''}.
          </p>
        )}

        {c.description && <p className="text-stone-600 leading-relaxed">{c.description}</p>}
      </div>

      {c.key_works?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-3">Œuvres majeures</h2>
          <ul className="space-y-1">
            {c.key_works.map((w, i) => (
              <li key={i} className="text-stone-600 text-sm flex gap-2"><span className="text-stone-300">○</span> {w}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10 flex gap-3 flex-wrap">
        <a href={`https://www.crescendo-magazine.be/?s=${encodeURIComponent(c.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 border border-stone-300 rounded hover:border-stone-500 text-stone-600 transition-colors">Rechercher sur Crescendo</a>
        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(c.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 border border-stone-300 rounded hover:border-stone-500 text-stone-600 transition-colors">YouTube</a>
      </section>

      {albums.length > 0 && (
        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
            Critiques Crescendo ({albums.length})
          </h2>
          <div className="space-y-3">
            {albumsToDisplay.map(a => (
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
                  {a.millesime_annee ? (
                    <span className="absolute -top-1 -right-1 bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                      ★ Millésime {a.millesime_annee}
                    </span>
                  ) : a.is_joker ? (
                    <span className="absolute -top-1 -right-1 bg-orange-100 border border-orange-300 text-orange-800 text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm inline-flex items-center gap-0.5">
                      <JokerLogo size="xs" /> Joker
                    </span>
                  ) : null}
                </a>
                <div className="min-w-0 flex-1">
                  <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="block">
                    <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 truncate">
                      {a.title || a.article_title}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {a.label && `${a.label} · `}
                      {a.published_at ? new Date(a.published_at).getFullYear() : ''}
                    </p>
                  </a>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-600 hover:text-stone-900 font-medium">
                      Lire la chronique →
                    </a>
                    <PrestoButton title={a.title || a.article_title} composers={[c.name]} />
                  </div>
                </div>
              </article>
            ))}
          </div>
          {albums.length > albumsToDisplay.length && (
            <p className="text-xs text-stone-400 mt-4 text-center italic">
              {albums.length - albumsToDisplay.length} autre{albums.length - albumsToDisplay.length > 1 ? 's' : ''} critique{albums.length - albumsToDisplay.length > 1 ? 's' : ''} non affichée{albums.length - albumsToDisplay.length > 1 ? 's' : ''}.
            </p>
          )}
        </section>
      )}
    </main>
  )
}
