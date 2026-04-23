import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { JokerLogo } from '@/lib/joker-logo'

export const metadata = {
  title: 'Labels — Référence Crescendo',
  description: 'Labels discographiques de musique classique recensés par Crescendo Magazine.',
}

export default async function LabelsPage({ searchParams }) {
  const tri = (await searchParams)?.tri
  const sortKey = tri === 'millesimes' ? 'millesimes' : tri === 'jokers' ? 'jokers' : 'count'

  const { data } = await supabase
    .from('albums')
    .select('label, millesime_annee, is_joker')
    .not('label', 'is', null)
    .neq('label', '')

  const stats = {}
  for (const row of data || []) {
    const l = row.label?.trim()
    if (l && l.length > 1 && l.length < 50) {
      if (!stats[l]) stats[l] = { count: 0, millesimes: 0, jokers: 0 }
      stats[l].count++
      if (row.millesime_annee) stats[l].millesimes++
      if (row.is_joker) stats[l].jokers++
    }
  }

  const labels = Object.entries(stats)
    .filter(([, s]) => s.count >= 2)
    .sort((a, b) => {
      const diff = b[1][sortKey] - a[1][sortKey]
      return diff !== 0 ? diff : b[1].count - a[1].count
    })

  const chipClass = (active) =>
    `px-3 py-1 text-sm rounded-full border transition-colors ${
      active
        ? 'bg-stone-800 text-white border-stone-800'
        : 'border-stone-300 text-stone-600 hover:border-stone-500'
    }`

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Labels</h1>
      <p className="text-stone-500 mb-8">{labels.length} labels · Référence Crescendo Magazine</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/labels" className={chipClass(sortKey === 'count')}>Nb albums</Link>
        <Link href="/labels?tri=millesimes" className={chipClass(sortKey === 'millesimes')}>Millésimes</Link>
        <Link href="/labels?tri=jokers" className={chipClass(sortKey === 'jokers')}>Jokers</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {labels.map(([label, s]) => {
          const hasMillesime = s.millesimes > 0
          return (
            <Link
              key={label}
              href={`/labels/${encodeURIComponent(label)}`}
              className={`block p-4 border rounded-lg hover:shadow-sm transition-all ${
                hasMillesime
                  ? 'border-amber-300 bg-amber-50 hover:border-amber-500'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <p className="font-medium text-stone-800 text-sm leading-snug mb-1">{label}</p>
              <p className="text-xs text-stone-400">{s.count} critique{s.count > 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {s.millesimes > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 border border-amber-300 text-amber-900">
                    ★ {s.millesimes}
                  </span>
                )}
                {s.jokers > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 border border-orange-300 text-orange-800">
                    <JokerLogo size="xs" /> {s.jokers}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
