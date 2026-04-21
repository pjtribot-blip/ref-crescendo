import { searchAll } from '@/lib/search'

// GET /api/search?q=… — retourne { compositeurs, labels, albums }
// 5 entrées max par catégorie, pensé pour l'autocomplete du header.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const results = await searchAll(q, { limit: 5 })
  return Response.json(results, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
