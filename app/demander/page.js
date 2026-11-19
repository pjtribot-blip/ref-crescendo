import { SITE_URL } from '@/lib/site'
import DemanderChat from './DemanderChat'

export const metadata = {
  title: 'Assistants IA — Demandez à Phono',
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

      <section id="connecteur" className="mt-16 pt-8 border-t border-stone-200 scroll-mt-24">
        <h2 className="text-2xl font-light text-stone-800 mb-2">Connecter Phono à votre IA</h2>
        <p className="text-stone-600 text-sm leading-relaxed mb-4">
          Vous utilisez Claude, ChatGPT, Copilot ou Cursor ? Ajoutez Phono.Crescendo comme <strong>connecteur</strong> (serveur MCP) :
          votre assistant pourra alors interroger directement les critiques, les Millésimes, les Jokers et le palmarès ICMA,
          en citant Crescendo avec le lien vers chaque critique. Gratuit, sans compte ni clé.
        </p>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Adresse du connecteur</p>
        <p className="font-mono text-sm bg-stone-100 border border-stone-200 rounded px-3 py-2 mb-4 break-all select-all">{SITE_URL}/mcp</p>
        <ol className="list-decimal pl-5 text-sm text-stone-600 space-y-1 mb-4">
          <li><strong>Claude</strong> (claude.ai) : Paramètres → Connecteurs → Ajouter un connecteur personnalisé, puis collez l’adresse.</li>
          <li><strong>ChatGPT</strong> : Paramètres → Applications et connecteurs → Créer (mode développeur), puis collez l’adresse.</li>
          <li><strong>Autres outils</strong> (Copilot, Cursor…) : ajoutez un serveur MCP « HTTP » avec cette adresse.</li>
        </ol>
        <p className="text-sm text-stone-500">
          Outils proposés : recherche de critiques (compositeur, interprète, label, année, distinction), fiche compositeur,
          palmarès Crescendo d’une année, palmarès ICMA. Lecture seule.
        </p>
      </section>
    </main>
  )
}
