import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Labels — Référence Crescendo',
  description: 'Labels discographiques de musique classique recensés par Crescendo Magazine.',
}

export default async function LabelsPage() {
  const { data } = await supabase
    .from('albums')
    .select('label, millesime_annee')
    .not('label', 'is', null)
    .neq('label', '')

  // Compte les albums et Millésimes par label
  const stats = {}
  for (const row of data || []) {
    const l = row.label?.trim()
    if (l && l.length > 1 && l.length < 50) {
      if (!stats[l]) stats[l] = { count: 0, millesimes: 0 }
      stats[l].count++
      if (row.millesime_annee) stats[l].millesimes++
    }
  }

  // Trie par nombre d'albums décroissant
  const labels = Object.entries(stats)
    .filter(([, s]) => s.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Labels</h1>
      <p className="text-stone-500 mb-8">{labels.length} labels · Référence Crescendo Magazine</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {labels.map(([label, s]) => {
          const hasMillesime = s.millesimes > 0
          return (
            <Link
              key={label}
              href={`/albums?label=${encodeURIComponent(label)}`}
              className={`block p-4 border rounded-lg hover:shadow-sm transition-all ${
                hasMillesime
                  ? 'border-amber-300 bg-amber-50 hover:border-amber-500'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <p className="font-medium text-stone-800 text-sm leading-snug mb-1">{label}</p>
              <p className="text-xs text-stone-400">{s.count} critique{s.count > 1 ? 's' : ''}</p>
              {hasMillesime && (
                <span className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 border border-amber-300 text-amber-900">
                  ★ {s.millesimes} Millésime{s.millesimes > 1 ? 's' : ''}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </main>
  )
}
