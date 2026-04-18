import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Les Millésimes — Référence Crescendo',
  description: 'Les Millésimes de Crescendo Magazine : la sélection annuelle des enregistrements les plus marquants.',
}

export const revalidate = 3600

async function getEditions() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase
    .from('albums')
    .select('millesime_annee, millesime_categorie')
    .not('millesime_annee', 'is', null)

  if (error || !data) return []

  const parAnnee = {}
  for (const row of data) {
    const a = row.millesime_annee
    if (!parAnnee[a]) parAnnee[a] = { annee: a, total: 0 }
    parAnnee[a].total++
  }

  return Object.values(parAnnee).sort((a, b) => b.annee - a.annee)
}

const DESCRIPTIONS = {
  2025: "Cinquième édition, marquée par la création du Prix Bernadette Beyne et Michelle Debra. Album de l'année : Berio / Žuraj par Sir Simon Rattle.",
  2024: "Quatrième édition, introduisant le Millésime Matrimoine musical consacré aux compositrices. Enregistrement de l'année : Catherine Collard.",
  2023: "Troisième édition, panorama puisé parmi 540 critiques publiées. Enregistrement de l'année : Liszt par Francesco Piemontesi.",
}

export default async function MillesimesIndexPage() {
  const editions = await getEditions()

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs uppercase tracking-wider font-medium mb-6">
          ★ Distinction annuelle de la rédaction
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Les Millésimes</h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
          Chaque année, la rédaction de Crescendo Magazine distingue les enregistrements les plus marquants parmi les centaines de critiques publiées.
        </p>
      </header>

      <div className="space-y-6">
        {editions.map((ed) => (
          <a key={ed.annee} href={`/millesimes/${ed.annee}`} className="block bg-white border border-stone-200 rounded-2xl p-8 hover:border-amber-400 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Édition {ed.annee}</span>
                  <span className="text-xs text-stone-400">· {ed.total} albums primés</span>
                </div>
                <h2 className="text-3xl font-serif text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
                  Millésimes {ed.annee}
                </h2>
                <p className="text-stone-600">{DESCRIPTIONS[ed.annee] || ''}</p>
              </div>
              <div className="text-stone-300 group-hover:text-amber-600 transition-colors shrink-0">
                <svg width="32" height="32" viewBox="0 0 24 24"
