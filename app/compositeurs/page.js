import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Compositeurs — Référence Crescendo',
  description: 'Catalogue de 608 compositeurs de musique classique.',
}

const PERIODES = ['Médiévale','Renaissance','Baroque','Classique','Romantique','Post-romantique','Moderne','Contemporaine']

export default async function CompositeursPage({ searchParams }) {
  const periode = (await searchParams)?.periode || null
  let query = supabase
    .from('compositeurs')
    .select('id, name, nationality, period, familiarity, born, died')
    .order('born', { ascending: true })
  if (periode) query = query.eq('period', periode)
  const { data: compositeurs } = await query
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Compositeurs</h1>
      <p className="text-stone-500 mb-8">{compositeurs?.length || 0} compositeurs · Référence Crescendo Magazine</p>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/compositeurs" className={`px-3 py-1 text-sm rounded-full border transition-colors ${!periode ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>Toutes</Link>
        {PERIODES.map(p => (
          <Link key={p} href={`/compositeurs?periode=${p}`} className={`px-3 py-1 text-sm rounded-full border transition-colors ${periode === p ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>{p}</Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {compositeurs?.map(c => (
          <Link key={c.id} href={`/compositeurs/${c.id}`} className="block p-4 border border-stone-200 rounded-lg hover:border-stone-400 hover:shadow-sm transition-all">
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-medium text-stone-800 text-sm leading-snug">{c.name}</h2>
              {c.familiarity === 'rare' && <span className="text-xs border border-amber-400 text-amber-600 px-1.5 py-0.5 rounded ml-2 shrink-0">Rare</span>}
            </div>
            <p className="text-xs text-stone-400">{c.born && c.died ? `${c.born}–${c.died}` : ''}{c.nationality ? ` · ${c.nationality}` : ''}</p>
            <p className="text-xs text-stone-500 mt-1">{c.period}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
