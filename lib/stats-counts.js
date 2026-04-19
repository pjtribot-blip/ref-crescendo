import { supabase } from './supabase'

/**
 * Compteurs partagés entre la home et /statistiques.
 *
 * Chaque helper fait une requête `count: 'exact', head: true` qui ne
 * rapatrie aucune ligne — seul le count exact côté serveur est retourné.
 * Ces helpers contournent la limite PostgREST (`db-max-rows`, typiquement
 * 1000) qui plafonnerait un `.select()` sans `.range()`.
 *
 * Les deux pages consomment strictement la même fonction : par
 * construction, leurs big numbers restent cohérents. Si un jour un chiffre
 * diverge, c'est qu'une des deux pages a cessé d'importer ce module.
 */

export async function getAlbumsCount() {
  const { count } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

export async function getCompositeursCount() {
  const { count } = await supabase
    .from('compositeurs')
    .select('*', { count: 'exact', head: true })
  return count || 0
}

export async function getMillesimesCount() {
  const { count } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
    .not('millesime_annee', 'is', null)
  return count || 0
}

export async function getJokersCount() {
  const { count } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
    .eq('is_joker', true)
  return count || 0
}

/**
 * Pagine la table albums par lots de 1000 pour contourner la limite
 * PostgREST. Utilisé pour les agrégations (top labels, top compositeurs,
 * volume annuel, etc.) qui nécessitent de parcourir toutes les lignes.
 *
 * Arrête dès qu'une page retourne moins que pageSize — évite un dernier
 * aller-retour inutile.
 */
export async function fetchAllAlbums(columns = '*') {
  const pageSize = 1000
  const all = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('albums')
      .select(columns)
      .range(from, from + pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return all
}
