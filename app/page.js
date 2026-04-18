import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PrestoButton } from '@/lib/presto'
import { JokerLogo } from '@/lib/joker-logo'

export const revalidate = 3600

const ANNEES_MILLESIMES = [2021, 2022, 2023, 2024, 2025]

const EXPLORER = [
  {
    href: '/compositeurs',
    title: 'Compositeurs',
    tone: 'stone',
    pitch: "Neuf siècles de création musicale, de Hildegard von Bingen aux créateurs de notre temps.",
  },
  {
    href: '/compositrices',
    title: 'Compositrices',
    tone: 'rose',
    pitch: "Le Matrimoine musical — les créatrices longtemps effacées des programmes, enfin remises en lumière.",
  },
  {
    href: '/belgique',
    title: 'La scène belge',
    tone: 'orange',
    pitch: "Compositeurs, interprètes, ensembles, institutions et labels qui font vivre la musique classique en Belgique.",
  },
  {
    href: '/palmares',
    title: 'Palmarès',
    tone: 'amber',
    pitch: "Les distinctions annuelles de la rédaction — Millésimes et Jokers réunis, de 2021 à aujourd\u2019hui.",
  },
  {
    href: '/labels',
    title: 'Labels',
    tone: 'stone',
    pitch: "Les labels discographiques du monde entier chroniqués par Crescendo Magazine.",
  },
  {
    href: '/jokers',
    title: 'Jokers',
    tone: 'amber',
    pitch: "Les coups de cœur de la rédaction, décernés au fil des parutions mensuelles.",
  },
]

const EXPLORER_TONES = {
  stone: 'border-stone-200 hover:border-stone-500',
  amber: 'border-amber-200 bg-amber-50/40 hover:border-amber-400',
  rose: 'border-rose-200 bg-rose-50/40 hover:border-rose-400',
  orange: 'border-orange-200 bg-orange-50/40 hover:border-orange-400',
}

export default async function Home() {
  const [
    albumsCountRes,
    compositeursCountRes,
    millesimesCountRes,
    jokersCountRes,
    labelsRes,
    millesimesByYearRes,
    latestAlbumsRes,
    latestJokersRes,
  ] = await Promise.all([
    supabase.from('albums').select('*', { count: 'exact', head: true }),
    supabase.from('compositeurs').select('*', { count: 'exact', head: true }),
    supabase.from('albums').select('*', { count: 'exact', head: true }).not('millesime_annee', 'is', null),
    supabase.from('albums').select('*', { count: 'exact', head: true }).eq('is_joker', true),
    supabase.from('albums').select('label').not('label', 'is', null),
    supabase.from('albums').select('millesime_annee').not('millesime_annee', 'is', null),
    supabase
      .from('albums')
      .select('id, title, article_title, label, published_at, critique_url, cover_url')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(8),
    supabase
      .from('albums')
      .select('id, title, composers, label, critique_url, cover_url, published_at')
      .eq('is_joker', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(6),
  ])

  const nbAlbums = albumsCountRes.count || 0
  const nbCompositeurs = compositeursCountRes.count || 0
  const nbMillesimes = millesimesCountRes.count || 0
  const nbJokers = jokersCountRes.count || 0
  const nbLabels = new Set((labelsRes.data || []).map(a => a.label).filter(Boolean)).size

  const parAnnee = {}
  for (const row of millesimesByYearRes.data || []) {
    const y = row.millesime_annee
    parAnnee[y] = (parAnnee[y] || 0) + 1
  }
  const millesimesEditions = ANNEES_MILLESIMES.map(y => ({ annee: y, total: parAnnee[y] || 0 }))

  const latestAlbums = latestAlbumsRes.data || []
  const latestJokers = latestJokersRes.data || []

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <section className="mb-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-serif text-stone-900 mb-4">Phono.Crescendo</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            La base de données des critiques phonographiques de Crescendo-Magazine.be
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard value={nbAlbums} label="Critiques" href="/albums" />
          <StatCard value={nbCompositeurs} label="Compositeurs" href="/compositeurs" />
          <StatCard value={nbLabels} label="Labels" href="/labels" />
          <StatCard value={nbMillesimes} label="Millésimes" href="/millesimes" tone="amber" />
          <StatCard value={nbJokers} label="Jokers" href="/jokers" tone="amber" />
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6 pb-2 border-b-2 border-amber-200">
          <h2 className="text-3xl font-serif text-stone-900">Les Millésimes</h2>
          <Link href="/millesimes" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-4">
            Toutes les éditions →
          </Link>
        </div>
        <p className="text-stone-600 mb-6 leading-relaxed">
          Chaque automne, la rédaction distingue les parutions discographiques les plus marquantes de
          l&apos;année. Cinq éditions à ce jour.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {millesimesEditions.map(ed => (
            <Link
              key={ed.annee}
              href={`/millesimes/${ed.annee}`}
              className="block p-4 bg-white border border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-center"
            >
              <p className="text-2xl font-serif text-stone-900">{ed.annee}</p>
              <p className="text-xs text-amber-800 mt-1">
                {ed.total > 0 ? `${ed.total} primé${ed.total > 1 ? 's' : ''}` : '—'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6 pb-2 border-b border-stone-200">
          <h2 className="text-3xl font-serif text-stone-900">Explorer</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPLORER.map(e => (
            <Link
              key={e.href}
              href={e.href}
              className={`block p-5 border rounded-xl transition-all hover:shadow-sm ${EXPLORER_TONES[e.tone]}`}
            >
              <h3 className="text-xl font-serif text-stone-900 mb-2">{e.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{e.pitch}</p>
              <p className="text-xs text-stone-400 mt-3">Découvrir →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4 pb-2 border-b border-stone-200">
          <h2 className="text-3xl font-serif text-stone-900">Derniers Jokers</h2>
          <Link href="/jokers" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-4">
            Voir tous les Jokers →
          </Link>
        </div>
        <p className="text-stone-600 mb-6 leading-relaxed">
          Les coups de cœur de la rédaction, décernés tout au long de l&apos;année aux enregistrements remarquables.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestJokers.map(a => {
            const composer = Array.isArray(a.composers) ? (a.composers[0] || '') : (a.composers || '')
            return (
              <article
                key={a.id}
                className="flex flex-col border border-stone-200 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-md transition-all relative"
              >
                <div className="absolute top-2 right-2 z-10 bg-orange-100 border border-orange-300 text-orange-800 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1">
                  <JokerLogo size="sm" /> Joker
                </div>
                <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="block">
                  {a.cover_url ? (
                    <div className="aspect-square bg-stone-100 overflow-hidden">
                      <img src={a.cover_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-stone-100 flex items-center justify-center">
                      <span className="text-stone-300 text-4xl">♪</span>
                    </div>
                  )}
                  <div className="p-4 pb-2">
                    <p className="font-medium text-stone-900 text-sm leading-snug line-clamp-2 mb-1">
                      {a.title}
                    </p>
                    {composer && <p className="text-xs text-stone-600 mb-1 line-clamp-1">{composer}</p>}
                    {a.label && <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">{a.label}</p>}
                    {a.published_at && (
                      <p className="text-xs text-stone-500">
                        {new Date(a.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </a>
                <div className="flex flex-wrap items-center gap-2 px-4 pb-4 mt-auto">
                  <a href={a.critique_url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-700 hover:text-orange-900 font-medium">
                    Lire la chronique →
                  </a>
                  <PrestoButton title={a.title} composers={a.composers} />
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-6 text-center">
          <Link href="/jokers" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-4">
            Voir tous les Jokers →
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6 pb-2 border-b border-stone-200">
          <h2 className="text-3xl font-serif text-stone-900">Dernières critiques</h2>
          <Link href="/albums" className="text-sm text-stone-500 hover:text-stone-800 underline underline-offset-4">
            Tous les albums →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestAlbums.map(a => (
            <a
              key={a.id}
              href={a.critique_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group"
            >
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
                  {a.label && <span className="block truncate">{a.label}</span>}
                  {a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 pt-8 mt-12 text-center">
        <p className="text-sm text-stone-500 leading-relaxed max-w-3xl mx-auto">
          <strong className="text-stone-700">Phono.Crescendo</strong> — Une émanation de{' '}
          <a
            href="https://www.crescendo-magazine.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            Crescendo Magazine
          </a>
          , média musical francophone basé en Belgique depuis 1993.
        </p>
        <p className="text-xs text-stone-400 mt-2 italic">
          Fondé par Bernadette Beyne (1949-2018) et Michelle Debra (1950-2025).
        </p>
      </footer>
    </main>
  )
}

function StatCard({ value, label, href, tone = 'stone' }) {
  const toneClasses = tone === 'amber'
    ? 'border-amber-200 bg-amber-50/40 hover:border-amber-400'
    : 'border-stone-200 bg-white hover:border-stone-400'
  const valueClass = tone === 'amber' ? 'text-amber-900' : 'text-stone-900'
  const labelClass = tone === 'amber' ? 'text-amber-800' : 'text-stone-500'
  return (
    <Link
      href={href}
      className={`block p-4 border rounded-xl text-center transition-all hover:shadow-sm ${toneClasses}`}
    >
      <p className={`text-3xl font-serif ${valueClass}`}>{value.toLocaleString('fr-FR')}</p>
      <p className={`text-xs uppercase tracking-wider mt-1 ${labelClass}`}>{label}</p>
    </Link>
  )
}
