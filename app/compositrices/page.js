import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Compositrices — Le Matrimoine Crescendo',
  description: 'Les compositrices chroniquées par Crescendo Magazine — le Matrimoine musical, de Hildegard von Bingen aux créatrices contemporaines.',
  openGraph: {
    type: 'website',
    title: 'Compositrices — Le Matrimoine Crescendo',
    description: 'Neuf siècles de création musicale féminine, mises en lumière par Crescendo Magazine.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compositrices — Le Matrimoine Crescendo',
    description: 'Neuf siècles de création musicale féminine, mises en lumière par Crescendo Magazine.',
  },
}

export const revalidate = 3600

export default async function CompositricesPage() {
  const { data: compositricesRaw } = await supabase
    .from('compositeurs')
    .select('id, name, nationality, born, died, period, description')
    .eq('gender', 'F')

  const { data: albumsAll } = await supabase
    .from('albums')
    .select('composers, millesime_annee, millesime_categorie')

  const nbAlbumsParNom = {}
  const millesimesParNom = {}
  const matrimoineParNom = new Set()
  for (const row of albumsAll || []) {
    const noms = Array.isArray(row.composers) ? row.composers : []
    for (const n of noms) {
      nbAlbumsParNom[n] = (nbAlbumsParNom[n] || 0) + 1
      if (row.millesime_annee) {
        millesimesParNom[n] = (millesimesParNom[n] || 0) + 1
      }
      if (row.millesime_categorie === 'matrimoine') {
        matrimoineParNom.add(n)
      }
    }
  }

  const enrichies = (compositricesRaw || []).map(c => ({
    nom: c.name,
    id: c.id,
    nationality: c.nationality ?? null,
    born: c.born ?? null,
    died: c.died ?? null,
    period: c.period ?? null,
    description: c.description ?? null,
    nb_albums: nbAlbumsParNom[c.name] || 0,
    nb_millesimes: millesimesParNom[c.name] || 0,
    matrimoine: matrimoineParNom.has(c.name),
  }))

  enrichies.sort((a, b) => {
    if (b.nb_albums !== a.nb_albums) return b.nb_albums - a.nb_albums
    return (a.born ?? 9999) - (b.born ?? 9999)
  })

  const total = enrichies.length
  const totalMillesimes = enrichies.filter(c => c.nb_millesimes > 0).length
  const totalMatrimoine = enrichies.filter(c => c.matrimoine).length

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-800 text-xs uppercase tracking-wider font-medium mb-4">
          ♀ Matrimoine · {total} compositrices · {totalMillesimes} Millésime{totalMillesimes > 1 ? 's' : ''} · {totalMatrimoine} Matrimoine
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">Compositrices — Le Matrimoine Crescendo</h1>
        <div className="max-w-none text-stone-700 space-y-4 leading-relaxed">
          <p>
            Depuis sa fondation en 1993, <strong>Crescendo Magazine</strong> se fait l&apos;écho de la richesse
            musicale dans toute sa diversité. La mise en lumière des <strong>compositrices</strong> — longtemps
            effacées des programmes et des catalogues discographiques — est devenue l&apos;un des axes
            éditoriaux forts de la rédaction : chroniques, entretiens et dossiers accompagnent le travail
            patient de redécouverte mené par interprètes, musicologues et labels, de Hildegard von Bingen
            aux créatrices de notre temps.
          </p>
          <p>
            En <strong>2024</strong>, pour prolonger cet engagement, la rédaction a créé le <strong>Millésime
            Matrimoine musical</strong> : une distinction annuelle qui salue une initiative exemplaire —
            <em> phonographique</em>, <em>éditoriale</em> ou <em>concertante</em> — consacrée à l&apos;art des
            compositrices. Cette page rassemble les créatrices chroniquées par la rédaction. Un badge{' '}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 border border-amber-300 text-amber-900 align-middle">★</span>{' '}
            signale celles dont un enregistrement a été distingué comme Millésime ; un badge{' '}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-rose-100 border border-rose-400 text-rose-800 align-middle">★ Matrimoine</span>{' '}
            identifie spécifiquement les lauréates du Millésime Matrimoine.
          </p>
          <p className="text-sm italic text-stone-500 pt-4">— La rédaction de Crescendo Magazine</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrichies.map(c => <CompositriceCard key={c.id} c={c} />)}
      </div>
    </main>
  )
}

function CompositriceCard({ c }) {
  const dates = c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''
  const meta = [dates, c.nationality].filter(Boolean).join(' · ')

  return (
    <Link
      href={`/compositeurs/${c.id}`}
      className="block p-4 border border-stone-200 rounded-lg hover:border-rose-400 hover:shadow-sm transition-all"
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <h2 className="font-medium text-stone-800 text-sm leading-snug">{c.nom}</h2>
        <div className="flex gap-1 shrink-0">
          {c.matrimoine && (
            <span className="text-xs bg-rose-100 border border-rose-400 text-rose-800 px-1.5 py-0.5 rounded font-semibold">★ Matrimoine</span>
          )}
          {!c.matrimoine && c.nb_millesimes > 0 && (
            <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-semibold">★</span>
          )}
        </div>
      </div>
      {meta && <p className="text-xs text-stone-400">{meta}</p>}
      {c.period && <p className="text-xs text-stone-500 mt-1">{c.period}</p>}
      <p className="text-xs text-stone-500 mt-2">
        {c.nb_albums > 0
          ? `${c.nb_albums} album${c.nb_albums > 1 ? 's' : ''} dans la référence`
          : 'Compositrice référencée'}
      </p>
    </Link>
  )
}
