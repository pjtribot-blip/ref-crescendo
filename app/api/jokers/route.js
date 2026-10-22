import { supabase } from '@/lib/supabase'
import { visibleLabel } from '@/lib/excluded-labels'
import { SITE_URL } from '@/lib/site'

// GET /api/jokers?limit=1 — derniers Jokers de Crescendo (API publique en lecture seule).
// Utilisée par la carte Pauline sur crescendo-magazine.be (« Dernier Joker »).
const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '5', 10) || 5, 1), 20)

  const { data, error } = await supabase
    .from('albums')
    .select('title, article_title, label, published_at, critique_url, cover_url, composers')
    .eq('is_joker', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true })
    .limit(limit)
  if (error) return Response.json({ error: 'Phono indisponible' }, { status: 502, headers: { ...HEADERS, 'Cache-Control': 'no-store' } })

  return Response.json({
    url: `${SITE_URL}/jokers`,
    jokers: (data || []).map(a => ({
      title: a.title || a.article_title,
      label: visibleLabel(a.label),
      composers: Array.isArray(a.composers) ? a.composers : [],
      date: a.published_at ? String(a.published_at).slice(0, 10) : null,
      critique_url: a.critique_url,
      cover_url: a.cover_url,
    })),
  }, { headers: HEADERS })
}
