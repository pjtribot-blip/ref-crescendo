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
 * Anciens identifiants Phono → identifiant actuel, partagé avec Pauline
 * (renommés le 2026-10-20 pour que les deux sites utilisent les mêmes).
 */
const ALIASES = {
  'jean-sebastien-bach': 'johann-sebastian-bach',
  'hildegard-de-bingen-abbesse': 'herrade-de-landsberg',
  'amelie-juliane': 'amalie-de-saxe',
  'corian-aharonian': 'coriun-aharonian',
}

/**
 * Cherche un compositeur à partir de l'identifiant brut de l'URL.
 * Accepte l'ancien identifiant (accentué ou renommé) comme le nouveau,
 * ce qui fonctionne avant comme après les migrations d'identifiants.
 * Renvoie { c, requestedId } ; c vaut null si rien n'est trouvé.
 */
export async function findCompositeur(rawId, columns = '*') {
  const requestedId = decodeCompositeurId(rawId)
  const asciiId = stripAccents(requestedId)
  const aliasId = ALIASES[asciiId]
  // Du plus ancien au plus récent : on retient le plus récent qui existe en base
  const ids = [...new Set([requestedId, asciiId, aliasId].filter(Boolean))]
  const { data } = await supabase.from('compositeurs').select(columns).in('id', ids)
  const rows = data || []
  const c = [...ids].reverse().map(id => rows.find(r => r.id === id)).find(Boolean) || null
  return { c, requestedId }
}
