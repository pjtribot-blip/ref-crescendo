import { createClient } from '@supabase/supabase-js'

/**
 * Base ICMA (International Classical Music Awards), projet Supabase distinct
 * de Phono. Clé publiable en lecture seule (RLS), publiée dans le llms.txt
 * de l'archive ICMA : on peut la garder en valeur par défaut.
 */
const ICMA_URL = process.env.ICMA_SUPABASE_URL || 'https://iymjbxvtpdnclyijdzcx.supabase.co'
const ICMA_KEY = process.env.ICMA_SUPABASE_KEY || 'sb_publishable_l4hD1LSdT6h9WVqETyO2dw_2m60io_G'

export const icma = createClient(ICMA_URL, ICMA_KEY)

export const AWARD_SELECT = `
  id, year, laureate_name, album_title, label_reference, jury_text, ex_aequo, source_url,
  icma_categories(slug, label_fr, label_en, section, display_order),
  icma_labels(name),
  icma_awards_composers(icma_persons(name)),
  icma_awards_performers(role, icma_persons(name))
`

/** Années disponibles, de la plus récente à la plus ancienne. */
export async function getIcmaYears() {
  const { data } = await icma.from('icma_awards').select('year')
  return [...new Set((data || []).map(r => r.year))].sort((a, b) => b - a)
}

/** Prix d'une année, triés dans l'ordre officiel des catégories. */
export async function getIcmaAwards(year) {
  const { data } = await icma.from('icma_awards').select(AWARD_SELECT).eq('year', year)
  return (data || []).sort((a, b) =>
    (a.icma_categories?.display_order ?? 99) - (b.icma_categories?.display_order ?? 99) || a.id - b.id)
}

/** Nom comparable entre Phono et l'ICMA : minuscules, sans accents ni ponctuation. */
export function plierNom(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]+/g, ' ').trim()
}

/** Disques et prix ICMA d'un compositeur (rapprochement par nom). */
export async function getIcmaAwardsForComposer(name) {
  const { data } = await icma
    .from('icma_awards_composers')
    .select(`icma_persons(name), icma_awards(${AWARD_SELECT})`)
  const cible = plierNom(name)
  const seen = new Set()
  return (data || [])
    .filter(r => plierNom(r.icma_persons?.name) === cible && r.icma_awards)
    .map(r => r.icma_awards)
    .filter(a => !seen.has(a.id) && seen.add(a.id))
    .sort((a, b) => b.year - a.year)
}
