import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Interprètes — Référence Crescendo',
  description: 'Interprètes de musique classique chroniqués par Crescendo Magazine : chefs d\'orchestre, solistes, ensembles.',
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
          placeholder="Rechercher un interprète (ex : Jansons, Argerich, LSO...)"
          className="flex-1 min-w-64 border border-stone-300 rounded px-3 py-1.5 text-sm text-stone-700 bg-white hover:border-stone-400 focus:border-stone-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1.5 border border-stone-400 rounded text-sm text-stone-700 hover:bg-stone-100 transition-colors"
        >
          Rechercher
        </button>
        {search && (
          <Link
            href="/interpretes"
            className="px-4 py-1.5 text-sm text-stone-500 hover:text-stone-700 underline"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {total === 0 && search && (
        <p className="text-stone-500 italic">Aucun interprète ne correspond à votre recherche.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {interprets?.map((i) => (
          <Link
            key={i.name}
            href={`/interpretes/${encodeURIComponent(i.name)}`}
            className="block p-4 border border-stone-200 rounded-lg hover:border-stone-400 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-stone-800 text-sm leading-snug mb-1">{i.name}</p>
            <p className="text-xs text-stone-400">
              {i.nb_albums} album{i.nb_albums > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>

      {!search && total >= 500 && (
        <p className="text-stone-400 text-sm text-center mt-10">
          500 premiers interprètes affichés · Utilisez la recherche pour trouver les autres
        </p>
      )}
    </main>
  )
}
