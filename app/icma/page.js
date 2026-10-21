import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getIcmaYears, getIcmaAwards, plierNom } from '@/lib/icma'
import { ICMA_CRITIQUES } from '@/lib/icma-critiques'

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

export default async function IcmaPage({ searchParams }) {
  const params = await searchParams
  const years = await getIcmaYears()
  const requested = parseInt(params?.annee || '', 10)
  const year = years.includes(requested) ? requested : years[0]

  const [awards, { data: compositeurs }] = await Promise.all([
    year ? getIcmaAwards(year) : [],
    supabase.from('compositeurs').select('id, name'),
  ])
  // Compositeurs ICMA ayant une fiche sur Phono (rapprochement par nom)
  const ficheParNom = new Map((compositeurs || []).map(c => [plierNom(c.name), c.id]))

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light text-stone-800 mb-2">ICMA</h1>
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
                    {ICMA_CRITIQUES[a.id] && (
                      <a href={ICMA_CRITIQUES[a.id]} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-medium text-stone-700 hover:text-stone-900">
                        Lire la critique Crescendo →
                      </a>
                    )}
                    {a.jury_text && (
                      <details className="mt-2">
                        <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-800">Attendus du jury</summary>
                        <p className="text-sm text-stone-600 leading-relaxed mt-2">{a.jury_text}</p>
                      </details>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}

      <p className="text-xs text-stone-400 italic">
        Source : archive ICMA compilée par Pierre-Jean Tribot d&apos;après les palmarès officiels publiés sur icma-info.com (CC BY 4.0).
      </p>
    </main>
  )
}
