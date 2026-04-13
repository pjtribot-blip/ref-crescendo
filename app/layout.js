import './globals.css'
export const metadata = {
  title: 'Référence Crescendo — Musique classique',
  description: 'La référence en musique classique : compositeurs, discographie, critiques.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-stone-50 min-h-screen">
        <nav className="border-b border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-sm font-medium text-stone-800">Référence <span className="text-stone-400 font-light">Crescendo</span></a>
            <div className="flex gap-6 text-sm text-stone-500">
              <a href="/compositeurs" className="hover:text-stone-800 transition-colors">Compositeurs</a>
              <a href="/albums" className="hover:text-stone-800 transition-colors">Albums</a>
              <a href="/recherche" className="hover:text-stone-800 transition-colors">Recherche</a>
              <a href="https://www.crescendo-magazine.be" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 transition-colors">Magazine →</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
