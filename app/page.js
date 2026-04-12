import Link from 'next/link'
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-light text-stone-800 mb-4">Référence Crescendo</h1>
      <p className="text-stone-500 mb-10 text-lg">La base de référence en musique classique</p>
      <div className="flex gap-4 justify-center">
        <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
          608 Compositeurs
        </Link>
        <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
          5190 Albums
        </Link>
      </div>
    </main>
  )
}
