/**
 * Ordre canonique des périodes musicales sur Phono.Crescendo.
 * Source de vérité unique importée par /statistiques, /compositeurs,
 * /compositrices.
 *
 * « Contemporaine » est conservé en fin de liste comme bucket
 * transitoire : il regroupe les compositeurs dont la date de naissance
 * manque en base et qui n'ont donc pas encore été reclassés en
 * Moderne / Après-guerre / Création contemporaine. À vider progressivement
 * à mesure qu'on renseigne leur born — voir le TODO au bas de la
 * migration supabase/migrations/20260420010000_reclassify_contemporaine.sql
 */
export const ORDRE_PERIODES = [
  'Médiévale',
  'Renaissance',
  'Baroque',
  'Classique',
  'Romantique',
  'Post-romantique',
  'Moderne',
  'Après-guerre',
  'Création contemporaine',
  'Contemporaine',
]
