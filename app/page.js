import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  // Compteurs dynamiques
  const [{ count: nbAlbums }, { count: nbInterprets }, { count: nbCompositeurs }, labelsRes] = await Promise.all([
    supabase.from('albums').select('*', { count: 'exact', head: true }),
    supabase.from('interprets').select('*', { count: 'exact', head: true }),
    supabase.from('compositeurs').select('*', { count: 'exact', head: true }),
    supabase.from('albums').select('label').not('label', 'is', null),
  ])
  
  const nbLabels = new Set((labelsRes.data || []).map(a => a.label).filter(Boolean)).size

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url')
    .order('published_at', { ascending: false })
    .limit(10)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-stone-800 mb-4">Référence Crescendo</h1>
        <p className="text-stone-500 mb-8 text-lg">La base de référence en musique classique</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
            {nbCompositeurs || 0} Compositeurs
          </Link>
          <Link href="/interpretes" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
            {nbInterprets || 0} Interprètes
          </Link>
          <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
            {nbAlbums || 0} Albums
          </Link>
          <Link href="/labels" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
            {nbLabels} Labels
          </Link>
          <Link href="/recherche" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
            Recherche
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-6">Dernières critiques</h2>
        <div className="space-y-3">
          {albums?.map(a => (
            <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer"
              className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all">
              {a.cover_url ? (
                <img src={a.cover_url} alt="" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-stone-100 flex items-center justify-center rounded">
                  <span className="text-stone-300 text-2xl">♪</span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-stone-800 text-sm leading-snug mb-0.5">
                  {a.title || a.article_title}
                </p>
                <p className="text-xs text-stone-400">
                  {a.label && `${a.label} · `}
                  {a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : ''}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
