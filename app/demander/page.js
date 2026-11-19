import DemanderChat from './DemanderChat'

export const metadata = {
  title: 'Demandez à Phono',
  description: 'Posez vos questions sur les critiques de disques de Crescendo Magazine : quel enregistrement choisir, les Millésimes et Jokers d’un compositeur, le palmarès d’une année.',
  alternates: { canonical: '/demander' },
}

export default function DemanderPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light text-stone-800 mb-2">Demandez à Phono</h1>
      <p className="text-stone-500 text-sm mb-8">
        Un assistant pour explorer les critiques de disques de Crescendo Magazine. Il cherche dans la base et renvoie
        toujours vers les critiques originales. <span className="italic">Version d’essai : l’assistant peut se tromper, vérifiez en lisant la critique.</span>
      </p>
      <DemanderChat />
    </main>
  )
}
