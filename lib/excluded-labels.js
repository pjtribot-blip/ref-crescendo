/**
 * Labels à exclure des comptages et listings transversaux (holdings
 * corporate, enseignes non-discographiques). Ces labels peuvent exister
 * dans la base — certains albums leur sont rattachés — mais ne doivent
 * pas être comptés comme labels éditoriaux à part entière.
 *
 * Outhere : holding qui chapeaute Ricercar / Alpha / Ramée / Fuga Libera.
 * Ses albums relèvent éditorialement de ces marques, pas du nom corporate.
 */
export const EXCLUDED_LABELS = new Set([
  'Outhere',
])
