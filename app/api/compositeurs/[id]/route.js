import { supabase } from '@/lib/supabase'
import { visibleLabel } from '@/lib/excluded-labels'

// GET /api/compositeurs/:id — API publique en lecture seule (chantier 7).
// Disques critiqués par Crescendo pour un compositeur, Millésimes et Jokers d'abord.
// Utilisée notamment par Pauline (mêmes identifiants de compositeurs).
const SITE = 'https://phono.crescendo-magazine.be'
const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS })
}

export async function GET(request, { params }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '6', 10) || 6, 1), 50)

  const { data: c } = await supabase.from('compositeurs').select('id, name').eq('id', id).single()
  if (!c) return Response.json({ error: 'Compositeur inconnu' }, { status: 404, headers: HEADERS })

  const { data } = await supabase
    .from('albums')
    .select('id, title, label, published_at, critique_url, cover_url, is_joker, millesime_annee, millesime_label')
    .contains('composers', [c.name])
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })

  const albums = data || []
  // Ordre de présentation : Millésimes, puis Jokers, puis les plus récents
  const rank = a => (a.millesime_annee ? 0 : a.is_joker ? 1 : 2)
  const sorted = [...albums].sort((a, b) => rank(a) - rank(b))

  return Response.json({
    id: c.id,
    name: c.name,
    url: `${SITE}/compositeurs/${c.id}`,
    count: albums.length,
    jokers: albums.filter(a => a.is_joker).length,
    millesimes: albums.filter(a => a.millesime_annee).length,
    albums: sorted.slice(0, limit).map(a => ({
      title: a.title,
      label: visibleLabel(a.label),
      year: a.published_at ? Number(String(a.published_at).slice(0, 4)) : null,
      critique_url: a.critique_url,
      cover_url: a.cover_url,
      joker: Boolean(a.is_joker),
      millesime: a.millesime_annee ? { annee: a.millesime_annee, label: a.millesime_label } : null,
    })),
  }, { headers: HEADERS })
}
