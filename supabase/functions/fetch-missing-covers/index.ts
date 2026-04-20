// Edge Function : rattrapage des albums sans cover_url.
//
// Liste les albums où cover_url IS NULL ou '', fetch la page WordPress,
// extrait l'image via og:image → wp-post-image → premier <img>
// d'entry-content, UPDATE en base, retourne un JSON de rapport.
//
// Déployée avec "Verify JWT" DÉSACTIVÉ. Sécurité = obscurité de l'URL.
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement
// par la plateforme Edge Functions.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.103.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const PAUSE_MS = 400
const BATCH_LIMIT = 50

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function extractFromOgImage(html: string): string | null {
  const m =
       html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    ?? html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  return m?.[1] ?? null
}

function extractFromWpPostImage(html: string): string | null {
  const m =
       html.match(/<img[^>]+class=["'][^"']*wp-post-image[^"']*["'][^>]+src=["']([^"']+)["']/i)
    ?? html.match(/<img[^>]+src=["']([^"']+)["'][^>]+class=["'][^"']*wp-post-image[^"']*["']/i)
  return m?.[1] ?? null
}

function extractFirstEntryContentImage(html: string): string | null {
  const idx = html.search(/<(div|article)[^>]+class=["'][^"']*entry-content/i)
  if (idx < 0) return null
  const scope = html.slice(idx, idx + 20000)
  const m = scope.match(/<img[^>]+src=["']([^"']+\.(?:jpe?g|png|webp|avif))(?:\?[^"']*)?["']/i)
  return m?.[1] ?? null
}

function extractCover(html: string): string | null {
  return extractFromOgImage(html)
      ?? extractFromWpPostImage(html)
      ?? extractFirstEntryContentImage(html)
}

Deno.serve(async () => {
  const { data: albums, error } = await supabase
    .from('albums')
    .select('id, critique_url')
    .or('cover_url.is.null,cover_url.eq.')
    .not('critique_url', 'is', null)
    .limit(BATCH_LIMIT)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  type Success = { id: string; cover: string }
  type Failure = { id: string; url: string; reason: string }
  const successes: Success[] = []
  const failures: Failure[] = []

  for (const album of albums ?? []) {
    try {
      const res = await fetch(album.critique_url, {
        headers: { 'User-Agent': 'ref-crescendo-covers-edge/1.0' },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
      const cover = extractCover(html)
      if (!cover) throw new Error('no cover found')

      const { error: upErr } = await supabase
        .from('albums')
        .update({ cover_url: cover })
        .eq('id', album.id)
      if (upErr) throw new Error(`db: ${upErr.message}`)

      successes.push({ id: album.id, cover })
    } catch (err) {
      failures.push({
        id: album.id,
        url: album.critique_url,
        reason: err instanceof Error ? err.message : String(err),
      })
    }
    await sleep(PAUSE_MS)
  }

  return Response.json({
    total: albums?.length ?? 0,
    batch_limit: BATCH_LIMIT,
    success_count: successes.length,
    failure_count: failures.length,
    successes,
    failures,
  })
})
