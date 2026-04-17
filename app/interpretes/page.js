import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Interprètes — Référence Crescendo',
  description: 'Interprètes de musique classique chroniqués par Crescendo Magazine.',
}

export default async function InterpretesPage({ searchParams }) {
  const params = await searchParams
  const search = params?.q?.trim() || ''

  let query = supabase
    .from('interprets')
    .select('name, nb_albums')
    .order('nb_albums', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  query = query.limit(500)

  const { data: interprets } = await query
  const total = interprets?.length || 0

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Interprètes</h1>
      <p className="text-stone-500 mb-6">
        {search ? `${total} résultats pour « ${search} »` : `2102 interprètes · Référence Crescendo Magazine`}
      </p>

      <form method="GET" className="mb-8 flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Rechercher un interprète..."
          className="flex-1 min-w-64 border border-stone-300 rounded px-3 py-1.5 text-sm"
        />
        <button type="submit" className="px-4 py-1.5 border border-stone-400 rounded text-sm hover:bg-stone-100">
          Rechercher
        </button>
        {search && (
          <Link href="/interpretes" className="px-4 py-1.5 text-sm text-stone-500 underline">
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {interprets?.map((i) => (
          <div key={i.name} className="block p-4 border border-stone-200 rounded-lg">
            <p className="font-medium text-stone-800 text-sm mb-1">{i.name}</p>
            <p className="text-xs text-stone-400">
              {i.nb_albums} album{i.nb_albums > 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
