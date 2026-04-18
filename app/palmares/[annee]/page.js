import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PrestoButton } from '@/lib/presto'
import { JokerLogo } from '@/lib/joker-logo'

export const revalidate = 3600

const ANNEES_VALIDES = ['2021', '2022', '2023', '2024', '2025']

export async function generateStaticParams() {
  return ANNEES_VALIDES.map(annee => ({ annee }))
}

export async function generateMetadata({ params }) {
  const { annee } = await params
  return {
    title: `Palmarès ${annee} — Crescendo Magazine`,
    description: `Les distinctions de Crescendo Magazine pour l'année ${annee} : Millésimes et Jokers réunis.`,
  }
}

const TITRES_CATEGORIES = {
  prix_special: 'Prix Bernadette Beyne & Michelle Debra',
  enregistrement_annee: "Enregistrement de l'année",
  matrimoine: 'Millésime Matrimoine',
  autre: 'Millésime',
}

export default async function PalmaresAnneePage({ params }) {
  const { annee } = await params
  if (!ANNEES_VALIDES.includes(annee)) notFound()
  const anneeNum = parseInt(annee, 10)

  const [millesimesRes, jokersRes] = await Promise.all([
    supabase
      .from('albums')
      .select('id, title, composers, label, cover_url, critique_url, millesime_categorie, millesime_label, published_at')
      .eq('millesime_annee', anneeNum),
    supabase
      .from('albums')
      .select('id, title, composers, label, cover_url, critique_url, published_at, millesime_annee')
      .eq('is_joker', true)
      .gte('published_at', `${annee}-01-01`)
      .lte('published_at', `${annee}-12-31`)
      .order('published_at', { ascending: false }),
  ])

  const millesimes = millesimesRes.data || []
  const millesimeIds = new Set(millesimes.map(a => a.id))
  const jokers = (jokersRes.data || []).filter(a => !millesimeIds.has(a.id))

  const total = millesimes.length + jokers.length

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/palmares" className="text-sm text-stone-500 hover:text-amber-700">
          ← Tous les palmarès
        </Link>
      </div>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs uppercase tracking-wider font-medium mb-4">
          ★ {total} distinction{total > 1 ? 's' : ''}
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">Palmarès {anneeNum} — Crescendo Magazine</h1>
        <p className="text-stone-700 leading-relaxed">
          En {anneeNum}, la rédaction de Crescendo Magazine a distingué <strong>{total}</strong> enregistrement
          {total > 1 ? 's' : ''} — <strong>{millesimes.length}</strong> Millésime{millesimes.length > 1 ? 's' : ''}{' '}
          et <strong>{jokers.length}</strong> Joker{jokers.length > 1 ? 's' : ''}.
        </p>
      </header>

      {millesimes.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-800 mb-4">
            Millésimes · {millesimes.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {millesimes.map(a => <MillesimeCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      {jokers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-4">
            Jokers · {jokers.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jokers.map(a => <JokerCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      {total === 0 && (
        <p className="text-stone-500">Aucune distinction pour cette année.</p>
      )}
    </main>
  )
}

function AlbumBody({ album }) {
  const composer = Array.isArray(album.composers) ? (album.composers[0] || '') : (album.composers || '')
  return (
    <a href={album.critique_url} target="_blank" rel="noopener noreferrer" className="block">
      {album.cover_url ? (
        <div className="aspect-square bg-stone-100 overflow-hidden">
          <img src={album.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-square bg-stone-100 flex items-center justify-center">
          <span className="text-stone-300 text-4xl">♪</span>
        </div>
      )}
      <div className="p-3">
        <p className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 mb-1">
          {album.title}
        </p>
        {composer && <p className="text-xs text-stone-600 line-clamp-1 mb-1">{composer}</p>}
        {album.label && <p className="text-xs text-stone-400 uppercase tracking-wider">{album.label}</p>}
      </div>
    </a>
  )
}

function AlbumActions({ album, linkClass }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 pb-3 mt-auto">
      <a href={album.critique_url} target="_blank" rel="noopener noreferrer" className={`text-xs font-medium ${linkClass}`}>
        Lire la chronique →
      </a>
      <PrestoButton title={album.title} composers={album.composers} />
    </div>
  )
}

function MillesimeCard({ album }) {
  const badge = album.millesime_label || TITRES_CATEGORIES[album.millesime_categorie] || 'Millésime'
  return (
    <article className="flex flex-col border border-amber-300 bg-amber-50/40 rounded-lg overflow-hidden hover:border-amber-500 hover:shadow-md transition-all relative">
      <div className="absolute top-2 right-2 z-10 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded">
        ★ {badge}
      </div>
      <AlbumBody album={album} />
      <AlbumActions album={album} linkClass="text-amber-700 hover:text-amber-900" />
    </article>
  )
}

function JokerCard({ album }) {
  return (
    <article className="flex flex-col border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all relative">
      <div className="absolute top-2 right-2 z-10 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1">
        <JokerLogo size="sm" /> Joker
      </div>
      <AlbumBody album={album} />
      <AlbumActions album={album} linkClass="text-stone-600 hover:text-stone-900" />
    </article>
  )
}
