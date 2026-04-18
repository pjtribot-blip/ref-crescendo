import './globals.css'

export const metadata = {
  title: 'Référence Crescendo — Musique classique',
  description: 'La référence en musique classique : compositeurs, discographie, critiques.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-stone-50 min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Accueil
            </a>
            <div className="flex gap-6 text-sm text-stone-500">
              <a href="/compositeurs" className="hover:text-stone-800 transition-colors">Compositeurs</a>
              <a href="/interpretes" className="hover:text-stone-800 transition-colors">Interprètes</a>
              <a href="/albums" className="hover:text-stone-800 transition-colors">Albums</a>
              <a href="/millesimes" className="hover:text-amber-800 transition-colors text-amber-700 font-medium">Millésimes</a>
              <a href="/palmares" className="hover:text-amber-900 transition-colors text-amber-700 font-medium">Palmarès</a>
              <a href="/compositrices" className="hover:text-rose-800 transition-colors text-rose-600 font-medium">Compositrices</a>
              <a href="/jokers" className="hover:text-stone-800 transition-colors text-amber-600">Jokers</a>
              <a href="/belgique" className="hover:text-orange-800 transition-colors text-orange-600 font-medium">Belgique</a>
              <a href="/labels" className="hover:text-stone-800 transition-colors">Labels</a>
              <a href="/recherche" className="hover:text-stone-800 transition-colors">Recherche</a>
              <a href="/statistiques" className="hover:text-stone-800 transition-colors">Chiffres</a>
              <a href="https://www.crescendo-magazine.be" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 transition-colors">Magazine →</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
