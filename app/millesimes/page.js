import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Les Millésimes',
}

export const revalidate = 3600

const DESCRIPTIONS = {
  2022: "Deuxième édition. Enregistrement de l'année : les concertos pour trompette de Tomasi, Jolivet, Jolas et Schmitt par Håkan Hardenberger et Fabien Gabel. Riche panorama de 525 critiques, entre redécouvertes patrimoniales (Haebler, Svetlanov) et scène belge (Alarcón, Libeer, FR2).",
  2021: "Première édition. Enregistrement de l'année : Die Tote Stadt de Korngold par Jonas Kaufmann et Kirill Petrenko à Munich, vidéo inaugurant le nouveau label de l'Opéra d'État de Bavière. Panorama de 534 critiques et 120 Jokers en une année, où le patrimoine rencontre les découvertes contemporaines.",
}

async function getEditions() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('albums')
    .select('millesime_annee')
    .not('millesime_annee', 'is', null)
  if (!data) return []
  const parAnnee = {}
  for (const row of data) {
    const a = row.millesime_annee
    if (!parAnnee[a]) parAnnee[a] = { annee: a, total: 0 }
    parAnnee[a].total++
  }
  return Object.values(parAnnee).sort((a, b) => b.annee - a.annee)
}

export default async function Page() {
  const editions = await getEditions()
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-serif text-stone-900 mb-4 text-center">Les Millésimes</h1>
      <p className="text-xl text-stone-600 text-center mb-12">La sélection annuelle de la rédaction de Crescendo Magazine</p>
      <div className="space-y-6">
        {editions.map((ed) => (
          <a key={ed.annee} href={"/millesimes/" + ed.annee} className="block bg-white border border-stone-200 rounded-2xl p-8 hover:border-amber-400 hover:shadow-lg transition-all">
            <h2 className="text-3xl font-serif text-stone-900 mb-2">Millésimes {ed.annee}</h2>
            <p className="text-stone-600 mb-2">{ed.total} albums primés</p>
            {DESCRIPTIONS[ed.annee] && (
              <p className="text-stone-500 text-sm leading-relaxed">{DESCRIPTIONS[ed.annee]}</p>
            )}
          </a>
        ))}
      </div>
    </main>
  )
}
