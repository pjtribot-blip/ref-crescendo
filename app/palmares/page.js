import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Palmarès — Crescendo Magazine',
  description: 'Les palmarès annuels de Crescendo Magazine : Millésimes et Jokers réunis, de 2021 à aujourd\'hui.',
}

export const revalidate = 3600

const ANNEES = [2025, 2024, 2023, 2022, 2021]

export default async function PalmaresIndexPage() {
  const [millesimesRes, jokersRes] = await Promise.all([
    supabase.from('albums').select('millesime_annee').not('millesime_annee', 'is', null),
    supabase.from('albums').select('published_at').eq('is_joker', true).not('published_at', 'is', null),
  ])

  const parAnnee = Object.fromEntries(ANNEES.map(a => [a, { millesimes: 0, jokers: 0 }]))
  for (const row of millesimesRes.data || []) {
    if (parAnnee[row.millesime_annee]) parAnnee[row.millesime_annee].millesimes++
  }
  for (const row of jokersRes.data || []) {
    const y = new Date(row.published_at).getFullYear()
    if (parAnnee[y]) parAnnee[y].jokers++
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-serif text-stone-900 mb-4 text-center">Palmarès</h1>
      <p className="text-xl text-stone-600 text-center mb-12">
        Les distinctions annuelles de Crescendo Magazine — Millésimes &amp; Jokers réunis
      </p>
      <div className="space-y-6">
        {ANNEES.map(annee => {
          const s = parAnnee[annee]
          const total = s.millesimes + s.jokers
          return (
            <Link
              key={annee}
              href={`/palmares/${annee}`}
              className="block bg-white border border-stone-200 rounded-2xl p-8 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              <h2 className="text-3xl font-serif text-stone-900 mb-2">Palmarès {annee}</h2>
              <p className="text-stone-600">
                {total} distinction{total > 1 ? 's' : ''}
                <span className="text-stone-400"> · {s.millesimes} Millésime{s.millesimes > 1 ? 's' : ''} · {s.jokers} Joker{s.jokers > 1 ? 's' : ''}</span>
              </p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
