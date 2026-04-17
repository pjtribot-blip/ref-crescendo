import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function InterpretePage({ params }) {
  const resolvedParams = await params
  const rawName = resolvedParams.name
  const decodedName = decodeURIComponent(rawName)

  const { data: interprete } = await supabase
    .from('interprets')
    .select('name, nb_albums, album_ids')
    .eq('name', decodedName)
    .maybeSingle()

  if (!interprete) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-light mb-2 text-stone-800">{decodedName}</h1>
        <p className="text-stone-500 mb-8">Interprète introuvable.</p>
        <Link href="/interpretes" className="text-stone-600 underline">
          ← Retour à la liste des interprètes
        </Link>
      </main>
    )
  }

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url')
    .in('id', interprete.album_ids)
    .order('published_at', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/interpretes" className="text-sm text-stone-500 hover:text-stone-700 underline mb-4 inline-block">
        ← Tous les interprètes
      </Link>

      <h1 className="text-3xl font-light mb-2 text-stone-800">{decodedName}</h1>
      <p className="text-stone-500 mb-8">
        {interprete.nb_albums} album{interprete.nb_albums > 1 ? 's' : ''} chroniqué{interprete.nb_albums > 1 ? 's' : ''} · Référence Crescendo Magazine
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums?.map((a) => (
          
            key={a.id}
            href={a.critique_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group"
          >
            {a.cover_url ? (
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img src={a.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="aspect-square bg-stone-100 flex items-center justify-center">
                <span className="text-stone-300 text-4xl">♪</span>
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 mb-1">
                {a.title || a.article_title}
              </p>
              <p className="text-xs text-stone-400">
                {a.label && `${a.label}`}
                {a.published_at ? ` · ${new Date(a.published_at).getFullYear()}` : ''}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
