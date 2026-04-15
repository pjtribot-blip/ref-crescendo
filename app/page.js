import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
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
          <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">608 Compositeurs</Link>
          <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">5190 Albums</Link>
          <Link href="/labels" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">Labels</Link>
          <Link href="/re
cat > app/page.js << 'EOF'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
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
          <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">608 Compositeurs</Link>
          <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">5190 Albums</Link>
          <Link href="/labels" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">Labels</Link>
          <Link href="/recherche" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">Recherche</Link>
export default async function Home() {
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
          <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">608 Compositeurs</Link>
          <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">5190 Albums</Link>
          <Link href="/labels" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">Labels</Link>
          <Link href="/recherche" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">Recherche</Link>
        </div>
      </div>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-6">Dernières critiques</h2>
        <div className="space-y-3">
          {albums?.map(a => (
            <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer"
              className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all group">
              {a.cover_url
                ? <img src={a.cover_url} alt="" className="w-12 h-12 object-cover rounded shrink-0" />
                : <div className="w-12 h-12 bg-stone-100 rounded shrink-0 flex items-center justify-center"><span className="text-stone-300">♪</span></div>
              }
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 line-clamp-1">{a.title || a.article_title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{a.label ? a.label + ' · ' : ''}{a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : ''}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
