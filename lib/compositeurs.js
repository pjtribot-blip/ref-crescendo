import { supabase } from './supabase'

/**
 * Identifiant de compositeur tel qu'il arrive dans l'URL → forme lisible.
 *
 * Dans les pages (page.js, opengraph-image.js), Next.js transmet le segment
 * dynamique encore encodé : « jean-sébastien-bach » arrive sous la forme
 * « jean-s%C3%A9bastien-bach ». Les Route Handlers, eux, le reçoivent décodé.
 * On décode donc systématiquement (sans planter sur un « % » isolé) et on
 * normalise en NFC, car certains navigateurs envoient « é » décomposé (e + ́).
 */
export function decodeCompositeurId(raw) {
  let id = String(raw ?? '')
  try { id = decodeURIComponent(id) } catch {}
  return id.normalize('NFC')
}

/** « jean-sébastien-bach » → « jean-sebastien-bach » (accents retirés). */
export function stripAccents(id) {
  return id.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')
}

/**
 * Cherche un compositeur à partir de l'identifiant brut de l'URL.
 * Accepte aussi bien l'ancien identifiant accentué que le nouveau sans
 * accent, ce qui fonctionne avant comme après la migration des slugs.
 * Renvoie { c, requestedId } ; c vaut null si rien n'est trouvé.
 */
export async function findCompositeur(rawId, columns = '*') {
  const requestedId = decodeCompositeurId(rawId)
  const asciiId = stripAccents(requestedId)
  const ids = [...new Set([requestedId, asciiId])]
  const { data } = await supabase.from('compositeurs').select(columns).in('id', ids)
  const rows = data || []
  const c = rows.find(r => r.id === asciiId) || rows[0] || null
  return { c, requestedId }
}
