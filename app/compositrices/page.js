import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Compositrices — Le Matrimoine Crescendo',
  description: 'Les compositrices chroniquées par Crescendo Magazine — le Matrimoine musical, de Hildegard von Bingen aux créatrices contemporaines.',
}

export const revalidate = 3600

const COMPOSITRICES = [
  'Hildegard von Bingen',
  'Francesca Caccini',
  'Barbara Strozzi',
  'Louise Bertin',
  'Fanny Mendelssohn',
  'Clara Schumann',
  'Pauline Viardot',
  'Augusta Holmès',
  'Louise Farrenc',
  'Cécile Chaminade',
  'Ethel Smyth',
  'Amy Beach',
  'Mel Bonis',
  'Nadia Boulanger',
  'Lili Boulanger',
  'Rebecca Clarke',
  'Germaine Tailleferre',
  'Florence Price',
  'Elsa Barraine',
  'Johanna Senfter',
  'Grażyna Bacewicz',
  'Galina Oustvolskaïa',
  'Sofia Goubaïdoulina',
  'Betsy Jolas',
  'Meredith Monk',
  'Kaija Saariaho',
  'Unsuk Chin',
  'Margaret Brouwer',
  'Jeanine Tesori',
]

export default async function CompositricesPage() {
  const { data: compositeurs } = await supabase
    .from('compositeurs')
    .select('id, name, nationality, born, died, period')
    .in('name', COMPOSITRICES)

  const { data: albumsAll } = await supabase
    .from('albums')
    .select('composers, millesime_categorie')

  const nbAlbumsParNom = {}
  const matrimoineParNom = new Set()
  for (const row of albumsAll || []) {
    const noms = Array.isArray(row.composers) ? row.composers : []
    for (const n of noms) {
      nbAlbumsParNom[n] = (nbAlbumsParNom[n] || 0) + 1
      if (row.millesime_categorie === 'matrimoine') matrimoineParNom.add(n)
    }
  }

  const enrichies = (compositeurs || []).map(c => ({
    ...c,
    nb_albums: nbAlbumsParNom[c.name] || 0,
    matrimoine: matrimoineParNom.has(c.name),
  })).sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999))

  const total = enrichies.length
  const totalMatrimoine = enrichies.filter(c => c.matrimoine).length

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-800 text-xs uppercase tracking-wider font-medium mb-4">
          ♀ Matrimoine · {total} compositrices · {totalMatrimoine} Millésime{totalMatrimoine > 1 ? 's' : ''}
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">Compositrices — Le Matrimoine Crescendo</h1>
        <div className="max-w-none text-stone-700 space-y-4 leading-relaxed">
          <p>
            Longtemps effacées des programmes de concerts et des catalogues discographiques, les
            <strong> compositrices</strong> font aujourd&apos;hui l&apos;objet d&apos;un intense travail de
            redécouverte. De <strong>Hildegard von Bingen</strong> à <strong>Kaija Saariaho</strong>, neuf siècles
            de création musicale féminine émergent peu à peu de l&apos;ombre patrimoniale dans laquelle ils avaient
            été relégués.
          </p>
          <p>
            En <strong>2024</strong>, Crescendo Magazine a instauré le <strong>Millésime Matrimoine musical</strong> :
            une distinction annuelle qui salue une initiative exemplaire — phonographique, éditoriale ou scénique —
            consacrée à l&apos;art des compositrices. Cette page rassemble les créatrices chroniquées par la
            rédaction, et signale d&apos;un badge doré ★ celles dont un enregistrement a reçu le Millésime Matrimoine.
          </p>
          <p className="text-sm italic text-stone-500 pt-4">— La rédaction de Crescendo Magazine</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrichies.map(c => (
          <Link
            key={c.id}
            href={`/compositeurs/${c.id}`}
            className="block p-4 border border-stone-200 rounded-lg hover:border-rose-400 hover:shadow-sm transition-all"
          >
            <div className="flex justify-between items-start mb-1 gap-2">
              <h2 className="font-medium text-stone-800 text-sm leading-snug">{c.name}</h2>
              {c.matrimoine && (
                <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-semibold shrink-0">★</span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''}
              {c.nationality ? ` · ${c.nationality}` : ''}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {c.nb_albums > 0
                ? `${c.nb_albums} album${c.nb_albums > 1 ? 's' : ''} dans la référence`
                : 'Pas encore chroniquée'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
