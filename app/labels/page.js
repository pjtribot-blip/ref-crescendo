import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Labels — Référence Crescendo',
  description: 'Labels discographiques de musique classique recensés par Crescendo Magazine.',
}

export default async function LabelsPage() {
  const { data } = await supabase
    .from('albums')
    .select('label')
    .not('label', 'is', null)
    .neq('label', '')

  // Compte les albums par label
  const counts = {}
  for (const row of data || []) {
    const l = row.label?.trim()
    if (l && l.length > 1 && l.length < 50) {
      counts[l] = (counts[l] || 0) + 1
    }
  }

  // Trie par nombre d'albums décroissant
  const labels = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Labels</h1>
      <p className="text-stone-500 mb-8">{labels.length} labels · Référence Crescendo Magazine</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {labels.map(([label, count]) => (
          <Link
            key={label}
            href={`/albums?label=${encodeURIComponent(label)}`}
            className="block p-4 border border-stone-200 rounded-lg hover:border-stone-400 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-stone-800 text-sm leading-snug mb-1">{label}</p>
            <p className="text-xs text-stone-400">{count} critique{count > 1 ? 's' : ''}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
