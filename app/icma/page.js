import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { icma, getIcmaYears, getIcmaAwards, plierNom } from '@/lib/icma'
import { ICMA_CRITIQUES } from '@/lib/icma-critiques'
import { ICMA_JURY_FR } from '@/lib/icma-jury-fr'

export const metadata = {
  title: 'ICMA — International Classical Music Awards',
  description: 'Le palmarès complet des International Classical Music Awards depuis 2011 : prix spéciaux et enregistrements primés, année par année.',
}

export const revalidate = 3600

const SECTIONS = [
  { key: 'special_awards', title: 'Prix spéciaux' },
  { key: 'audio_video_awards', title: 'Enregistrements' },
]

function Interpretes({ performers }) {
  const noms = (performers || [])
    .map(p => p.icma_persons?.name && (p.role === 'conductor' ? `${p.icma_persons.name} (dir.)` : p.icma_persons.name))
    .filter(Boolean)
  if (!noms.length) return null
  return <p className="text-sm text-stone-600 mt-1">{noms.join(' · ')}</p>
}

/** Palmarès cumulé toutes années : labels et artistes (interprètes) les plus primés. */
async function getIcmaStats() {
  const { data } = await icma
    .from('icma_awards')
    .select('icma_labels(name), icma_awards_performers(icma_persons(name))')
  const labels = new Map()
  const artistes = new Map()
  for (const a of data || []) {
    const label = a.icma_labels?.name
    if (label) labels.set(label, (labels.get(label) || 0) + 1)
    for (const p of a.icma_awards_performers || []) {
      const nom = p.icma_persons?.name
      if (nom) artistes.set(nom, (artistes.get(nom) || 0) + 1)
    }
  }
  const top = m => [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
    .filter(([, n]) => n > 1)
    .slice(0, 12)
  return { labels: top(labels), artistes: top(artistes) }
}

function Classement({ titre, entrees }) {
  if (!entrees.length) return null
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-3">{titre}</h3>
      <ol className="space-y-1">
        {entrees.map(([nom, n]) => (
          <li key={nom} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-stone-800">{nom}</span>
            <span className="text-stone-400 tabular-nums">{n}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default async function IcmaPage({ searchParams }) {
  const params = await searchParams
  const years = await getIcmaYears()
  const requested = parseInt(params?.annee || '', 10)
  const year = years.includes(requested) ? requested : years[0]

  const [awards, { data: compositeurs }, stats] = await Promise.all([
    year ? getIcmaAwards(year) : [],
    supabase.from('compositeurs').select('id, name'),
    getIcmaStats(),
  ])
  // Compositeurs ICMA ayant une fiche sur Phono (rapprochement par nom)
  const ficheParNom = new Map((compositeurs || []).map(c => [plierNom(c.name), c.id]))

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="mb-3">
        <img
          src="/icma-logo.jpg"
          alt="International Classical Music Awards (ICMA)"
          width={640}
          height={288}
          className="h-16 sm:h-20 w-auto"
        />
      </h1>
      <p className="text-stone-500 mb-6">
        Le palmarès des <a href="https://www.icma-info.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-stone-800">International Classical Music Awards</a>,
        dont Crescendo Magazine est membre du jury.
      </p>

      <nav className="flex flex-wrap gap-2 mb-10" aria-label="Années">
        {years.map(y => (
          <Link
            key={y}
            href={`/icma?annee=${y}`}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${y === year ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}
          >
            {y}
          </Link>
        ))}
      </nav>

      {SECTIONS.map(section => {
        const items = awards.filter(a => a.icma_categories?.section === section.key)
        if (!items.length) return null
        return (
          <section key={section.key} className="mb-12">
            <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-4">
              {section.title} {year} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map(a => {
                const composers = (a.icma_awards_composers || []).map(c => c.icma_persons?.name).filter(Boolean)
                const jury = ICMA_JURY_FR[a.id] || a.jury_text
                return (
                  <article key={a.id} className="p-4 border border-stone-200 rounded-lg bg-white">
                    <p className="text-xs uppercase tracking-wider text-amber-700 mb-1">
                      {a.icma_categories?.label_fr || a.icma_categories?.label_en}
                      {a.ex_aequo && <span className="text-stone-400 normal-case tracking-normal"> · ex aequo</span>}
                    </p>
                    <h3 className="text-base font-medium text-stone-800">{a.laureate_name || a.album_title}</h3>
                    {a.laureate_name && a.album_title && <p className="text-sm text-stone-600 italic">{a.album_title}</p>}
                    {composers.length > 0 && (
                      <p className="text-sm text-stone-700 mt-1">
                        {composers.map((n, i) => {
                          const id = ficheParNom.get(plierNom(n))
                          return (
                            <span key={n}>
                              {i > 0 && ', '}
                              {id ? <Link href={`/compositeurs/${id}`} className="underline underline-offset-2 decoration-stone-300 hover:decoration-stone-600">{n}</Link> : n}
                            </span>
                          )
                        })}
                      </p>
                    )}
                    <Interpretes performers={a.icma_awards_performers} />
                    {(a.icma_labels?.name || a.label_reference) && (
                      <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
                        {[a.icma_labels?.name, a.label_reference].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      {ICMA_CRITIQUES[a.id] && (
                        <a href={ICMA_CRITIQUES[a.id]} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-stone-700 hover:text-stone-900">
                          Lire la critique Crescendo →
                        </a>
                      )}
                      {a.source_url && (
                        <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-stone-800">
                          Fiche sur icma-info.com →
                        </a>
                      )}
                    </div>
                    {jury && (
                      <details className="mt-2">
                        <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-800">Les commentaires du jury</summary>
                        <p className="text-sm text-stone-600 leading-relaxed mt-2">{jury}</p>
                      </details>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}

      {(stats.labels.length > 0 || stats.artistes.length > 0) && (
        <section className="mb-12 border-t border-stone-200 pt-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-1">
            Statistiques
          </h2>
          <p className="text-xs text-stone-400 mb-6">
            Palmarès cumulé {years.length ? `${years[years.length - 1]}–${years[0]}` : ''} · nombre de prix (deux et plus)
          </p>
          <div className="grid sm:grid-cols-2 gap-8">
            <Classement titre="Labels les plus primés" entrees={stats.labels} />
            <Classement titre="Artistes les plus primés" entrees={stats.artistes} />
          </div>
        </section>
      )}

      <p className="text-xs text-stone-400 italic">
        Source : archive ICMA compilée par Pierre-Jean Tribot d&apos;après les palmarès officiels publiés sur icma-info.com (CC BY 4.0).
      </p>
    </main>
  )
}
