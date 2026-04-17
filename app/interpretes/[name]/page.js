import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export async function generateMetadata({ params }) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  return {
    title: `${decodedName} — Référence Crescendo`,
    description: `Albums de ${decodedName} chroniqués par Crescendo Magazine.`,
  }
}

export default async function InterpretePage({ params }) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  const { data: interprete } = await supabase
    .from('interprets')
    .select('name, nb_albums, album_ids')
    .eq('name', decodedName)
    .single()

  if (!interprete) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-light mb-2 text-stone-800">{decodedName}</h1>
        <p className="text-stone-500 mb-8">Interprète introuvable.</p>
        <Link href="/interpretes" className="text-stone-600 underline hover:text-stone-800">
          ← Retour à la liste des interprètes
        </Link>
      </main>
    )
  }

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, cover_url, composers, notes')
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
            href=
