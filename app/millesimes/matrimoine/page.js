import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export const metadata = {
  title: 'Matrimoine musical — Crescendo Magazine',
  description: "Tous les Millésimes Matrimoine de Crescendo Magazine : les enregistrements qui mettent en lumière l'art des compositrices.",
}

export default async function MatrimoinePage() {
  const { data: albumsRaw } = await supabase
    .from('albums')
    .select('id, title, composers, label, cover_url, critique_url, millesime_annee, millesime_label')
    .eq('millesime_categorie', 'matrimoine')
    .order('millesime_annee', { ascending: false })

  const albums = albumsRaw || []
  const albumIds = albums.map(a => a.id)

  const interpretesParAlbum = {}
  if (albumIds.length > 0) {
    const { data: interprets } = await supabase
      .from('interprets')
      .select('name, album_ids')
      .overlaps('album_ids', albumIds)
    for (const interp of interprets || []) {
      for (const aid of interp.album_ids || []) {
        if (!albumIds.includes(aid)) continue
        if (!interpretesParAlbum[aid]) interpretesParAlbum[aid] = []
        interpretesParAlbum[aid].push(interp.name)
      }
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-4">
        <a href="/millesimes" className="text-sm text-stone-500 hover:text-amber-700">← Toutes les éditions</a>
      </div>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs uppercase tracking-wider font-medium mb-4">
          ★ Millésime Matrimoine · {albums.length} album{albums.length > 1 ? 's' : ''}
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">Matrimoine musical — Crescendo Magazine</h1>
        <div className="max-w-none text-stone-700 space-y-4 leading-relaxed">
          <p>
            Créée en 2024, la distinction <strong>Millésime Matrimoine</strong> vient enrichir la sélection
            annuelle de la rédaction de Crescendo Magazine. Elle ambitionne de mettre en lumière une initiative
            exemplaire — phonographique, éditoriale, pédagogique ou scénique — consacrée à l&apos;art des
            <strong> compositrices</strong>.
          </p>
          <p>
            Longtemps effacées des programmes de concerts et des catalogues discographiques, les femmes
            compositrices font aujourd&apos;hui l&apos;objet d&apos;un intense travail de redécouverte. Le Matrimoine
            reconnaît ces chantiers de réhabilitation et salue les interprètes, labels et ensembles qui en portent
            la voix.
          </p>
          <p className="text-sm italic text-stone-500 pt-4">— La rédaction de Crescendo Magazine</p>
        </div>
      </header>

      {albums.length === 0 ? (
        <p className="text-stone-500">Aucun album Matrimoine pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {albums.map(album => (
            <AlbumCard
              key={album.id}
              album={album}
              interpretes={interpretesParAlbum[album.id] || []}
            />
          ))}
        </div>
      )}
    </main>
  )
}

function AlbumCard({ album, interpretes }) {
  const composer = Array.isArray(album.composers) ? album.composers.join(', ') : (album.composers || '')
  return (
    <article className="bg-white border border-amber-300 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-900">
          ★ {album.millesime_label || 'Matrimoine'}
        </span>
        {album.millesime_annee && (
          <span className="text-xs text-stone-500 uppercase tracking-wider">
            Millésime {album.millesime_annee}
          </span>
        )}
      </div>
      <div className="flex gap-4">
        {album.cover_url ? (
          <img src={album.cover_url} alt="" className="w-28 h-28 object-cover rounded-lg shrink-0 border border-stone-200" />
        ) : (
          <div className="w-28 h-28 bg-stone-100 rounded-lg shrink-0 flex items-center justify-center">
            <span className="text-stone-300 text-3xl">♪</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-serif text-stone-900 mb-2 leading-snug">{album.title}</h3>
          {composer && <p className="text-sm font-medium text-stone-700 mb-1">{composer}</p>}
          {interpretes.length > 0 && (
            <p className="text-xs text-stone-600 mb-2 leading-snug">
              {interpretes.join(', ')}
            </p>
          )}
          {album.label && <p className="text-xs text-stone-500 uppercase tracking-wider mb-3">{album.label}</p>}
          {album.critique_url && (
            <a href={album.critique_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 hover:text-amber-900 font-medium">
              Lire la chronique →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
