import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'La scène musicale belge — Référence Crescendo',
  description: 'Les labels discographiques belges chroniqués par Crescendo Magazine : Ricercar, Cyprès, Musique en Wallonie, Ramée, Fuga Libera, Outhere et bien d\'autres.',
}

export const revalidate = 3600

const LABELS_BELGES = [
  'Ricercar',
  'Cyprès',
  'Musique en Wallonie',
  'Ramée',
  'Pavane',
  'Fuga Libera',
  'Outhere',
  "Et'cetera",
  'Flora',
  'Passacaille',
  'Phaedra',
  'Evil Penguin Records',
]

export default async function BelgiquePage() {
  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url, millesime_annee')
    .in('label', LABELS_BELGES)
    .order('published_at', { ascending: false })

  const parLabel = {}
  for (const label of LABELS_BELGES) {
    parLabel[label] = { albums: [], millesimes: 0 }
  }
  for (const album of albums || []) {
    const entry = parLabel[album.label]
    if (!entry) continue
    entry.albums.push(album)
    if (album.millesime_annee) entry.millesimes++
  }

  const labelsAvecAlbums = LABELS_BELGES
    .map(name => ({ name, ...parLabel[name] }))
    .filter(l => l.albums.length > 0)
    .sort((a, b) => b.albums.length - a.albums.length)

  const totalAlbums = labelsAvecAlbums.reduce((s, l) => s + l.albums.length, 0)
  const totalMillesimes = labelsAvecAlbums.reduce((s, l) => s + l.millesimes, 0)

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-50 border border-orange-200 rounded-full text-orange-800 text-xs uppercase tracking-wider font-medium mb-4">
          🇧🇪 Belgique · {totalAlbums} albums · {totalMillesimes} Millésime{totalMillesimes > 1 ? 's' : ''}
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">La scène musicale belge</h1>
        <div className="max-w-none text-stone-700 space-y-4 leading-relaxed">
          <p>
            Depuis sa fondation en <strong>1993</strong> par Bernadette Beyne et Michelle Debra, Crescendo
            Magazine porte la voix de la musique classique depuis la <strong>Belgique francophone</strong>. Un
            ancrage qui nous confère un observatoire privilégié sur la vitalité d&apos;une scène musicale
            confidentielle par sa taille, mais exceptionnelle par sa densité.
          </p>
          <p>
            Des pionniers de la redécouverte baroque aux chantiers patrimoniaux les plus ambitieux, les labels
            belges — <strong>Ricercar</strong>, <strong>Cyprès</strong>, <strong>Musique en Wallonie</strong>,{' '}
            <strong>Ramée</strong>, <strong>Fuga Libera</strong>, <strong>Outhere</strong> et bien d&apos;autres —
            occupent une place singulière dans le paysage discographique européen. Cette page rassemble les
            critiques publiées par la rédaction sur l&apos;ensemble de ces parutions.
          </p>
        </div>
      </header>

      <div className="space-y-12">
        {labelsAvecAlbums.map(label => (
          <LabelSection key={label.name} label={label} />
        ))}
      </div>
    </main>
  )
}

function LabelSection({ label }) {
  const derniers = label.albums.slice(0, 4)
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-3 mb-4 pb-2 border-b border-stone-200">
        <h2 className="text-2xl font-serif text-stone-900">{label.name}</h2>
        <span className="text-sm text-stone-500">
          {label.albums.length} album{label.albums.length > 1 ? 's' : ''}
        </span>
        {label.millesimes > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            ★ {label.millesimes} Millésime{label.millesimes > 1 ? 's' : ''}
          </span>
        )}
        <Link
          href={`/albums?label=${encodeURIComponent(label.name)}`}
          className="ml-auto text-xs text-stone-500 hover:text-stone-800 underline"
        >
          Voir tous les albums →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {derniers.map(a => (
          <a
            key={a.id}
            href={a.critique_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group relative"
          >
            {a.millesime_annee && (
              <div className="absolute top-2 right-2 z-10 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold px-1.5 py-0.5 rounded">
                ★
              </div>
            )}
            {a.cover_url ? (
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img src={a.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="aspect-square bg-stone-100 flex items-center justify-center">
                <span className="text-stone-300 text-4xl">♪</span>
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-stone-800 text-xs leading-snug line-clamp-2 mb-1">
                {a.title || a.article_title}
              </p>
              <p className="text-xs text-stone-400">
                {a.published_at ? new Date(a.published_at).getFullYear() : ''}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
