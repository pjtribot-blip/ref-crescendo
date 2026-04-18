import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { annee } = await params
  const title = `Millésimes ${annee}`
  const description = `Les Millésimes ${annee} de Crescendo Magazine : les enregistrements primés par la rédaction, toutes catégories confondues.`
  return {
    title,
    description,
    openGraph: { type: 'article', title: `${title} — Phono.Crescendo`, description },
    twitter: { card: 'summary_large_image', title: `${title} — Phono.Crescendo`, description },
  }
}

const EDITOS = {
  2025: {
    sous_titre: "5ᵉ édition",
    paragraphes: [
      "Cette édition 2025 des Millésimes est particulière : en janvier dernier, notre cofondatrice <strong>Michelle Debra (1950-2025)</strong> nous a quittés. Crescendo Magazine avait été fondé en 1993 par Bernadette Beyne (1949-2018) et Michelle Debra, initiative novatrice et visionnaire depuis la Belgique francophone, qui s'est établi au fil des années une notoriété internationale fondée sur la découverte et le partage.",
      "Pour faire perdurer leur esprit pionnier et leur passion de la découverte, la rédaction a créé le <strong>Prix Bernadette Beyne et Michelle Debra</strong>, qui récompense une initiative pionnière et exemplative du dynamisme de la scène musicale associée aux plus hautes exigences de qualité et de renouveau. Ce premier prix est décerné à l'enregistrement consacré aux <strong>Symphonies n°1 et n°2 d'Elsa Barraine</strong> par le WDR Sinfonieorchester sous la direction d'Elena Schwarz (CPO), consacrant une artiste magistrale dans le mouvement de redécouverte des compositrices.",
      "À une époque où la modernité est remise en cause, la sélection met en avant des compositeurs qui ont marqué leur époque par la rupture et l'avant-garde. L'enregistrement de l'année consacre un album qui met en relief le magistral <strong>Coro</strong> de Luciano Berio avec <strong>Automatones</strong> de Vito Žuraj sous la baguette de Sir Simon Rattle, qui s'impose comme l'un des grands chefs-d'œuvre des années 2020. Modernité de rupture également avec deux parutions consacrées à Arnold Schoenberg (Petrenko/Berliner Philharmoniker, Payare/OSM).",
      "Les Millésimes 2025 accordent aussi une attention au matrimoine musical (Amy Beach), à la découverte de répertoires méconnus (Rózsa, Donizetti, Paris 1801), et à la scène belge avec Ricercar (Colonna/Handel par Alarcón) et Musique en Wallonie (Ysaÿe par l'OPRL).",
    ],
  },
  2024: {
    sous_titre: "4ᵉ édition",
    paragraphes: [
      "Pour ce cru 2024, la rédaction présente un <strong>nouveau prix</strong> consacré à l'art des compositrices : le <strong>Millésime Matrimoine</strong>, qui ambitionne de mettre en avant une initiative déclinée en phonographe, livre, partition ou série de concerts. Ce premier Millésime récompense un album CPO consacré à <strong>Johanna Senfter</strong> par l'Else Ensemble, une redécouverte importante.",
      "Le Millésime « enregistrement de l'année » récompense le coffret Erato en hommage à l'art de la grande <strong>Catherine Collard</strong>, qui remet enfin à disposition des enregistrements incontournables comme ses gravures dédiées à Robert Schumann.",
      "La scène belge est représentée par deux parutions majeures de Het Collectief (Messiaen/Murail chez Alpha) et Clematis (David Pohle chez Ricercar). Du côté de la musique de notre temps, un opéra majeur de John Adams (Nonesuch) et les partitions évocatrices de Margaret Brouwer magnifiées par Marin Alsop (Naxos). Cette année 2024 marque aussi les anniversaires Fauré (Piboule) et Smetana (Bychkov avec la Philharmonie tchèque).",
    ],
  },
  2023: {
    sous_titre: "3ᵉ édition",
    paragraphes: [
      "Entre novembre 2022 et novembre 2023, Crescendo Magazine a publié près de 540 critiques d'enregistrements audio, déclinés en formats physiques, numériques, DVD et Blu-Ray. Une belle centaine de Jokers ont été décernés sur cette période — qu'ils soient « absolus », « découverte » ou « patrimoine ». Les Millésimes représentent donc le meilleur du meilleur pour la rédaction.",
      "Pour la troisième année consécutive, les Millésimes s'enrichissent d'un <strong>album de l'année</strong>, une parution qui incarne son temps par son niveau d'exigence et le renouveau qu'elle apporte sur la vision des partitions. Cette année, le prix est décerné à l'enregistrement Liszt (Études d'exécution transcendante et Sonate en si mineur) avec <strong>Francesco Piemontesi</strong> chez Pentatone, album d'une grande cohérence éditoriale qui renouvelle l'approche de ces chefs-d'œuvre pianistiques.",
      "Le panorama 2023 témoigne de la richesse de la scène musicale à commencer par les parutions made in Belgium (Adrien Tsilogiannis chez Cyprès, InAlto chez Ricercar), les claviers (Gasparian chez Naïve, coffret hommage à Nicholas Angelich chez Warner), les redécouvertes patrimoniales (Offenbach par Opera Rara, Schreker sous Eschenbach), et un moment d'émotion avec l'album choral de Kaija Saariaho chez BIS.",
    ],
  },
  2022: {
    sous_titre: "2ᵉ édition",
    paragraphes: [
      "Ce cru 2022 fait le bilan d'une année particulièrement dense : <strong>525 critiques</strong> publiées sur Crescendo Magazine, parmi lesquelles la rédaction a distingué quinze parutions essentielles. Le fait le plus saillant est le <strong>renouveau éclatant du label discographique belge</strong>, porté par une génération d'interprètes confirmés : le CPE Bach de <strong>Van Reyn</strong>, un <em>Semele</em> de Haendel signé <strong>Alarcón</strong>, le second volume de l'ensemble <strong>FR2</strong> conduit par <strong>Beets et Van Goethem</strong>, ou encore le pianiste <strong>Julien Libeer</strong>.",
      "L'année aura aussi été celle de grandes commémorations — <strong>anniversaires Messiaen et Xenakis</strong> — saluées par plusieurs parutions, et d'une dimension patrimoniale assumée : le coffret <strong>Ingrid Haebler</strong>, les archives <strong>Evgueni Svetlanov</strong>, autant de restitutions qui rappellent combien l'exhumation d'enregistrements historiques nourrit encore notre écoute contemporaine.",
    ],
  },
  2021: {
    sous_titre: "1ʳᵉ édition",
    paragraphes: [
      "2021 marque l'<strong>année de lancement des Millésimes</strong>, distinction annuelle imaginée par la rédaction de Crescendo Magazine pour saluer les parutions qui ont marqué l'année. Dès cette édition inaugurale, la rédaction instaure le <strong>« Millésime des Millésimes »</strong>, enregistrement de l'année, décerné à <em>Die Tote Stadt</em> de <strong>Korngold</strong> à Munich : production d'anthologie menée par <strong>Jonas Kaufmann</strong> sous la baguette de <strong>Kirill Petrenko</strong>, captation vidéo qui inaugure le nouveau label de la <strong>Staatsoper de Munich</strong>.",
      "Le cru 2021 frappe par sa diversité, à l'image d'une année discographique qui aura su sortir des sentiers battus : le <strong>Berio</strong> de <strong>Stéphanie Richardot</strong>, les cantates de <strong>Bach</strong> par <strong>Philippe Pierlot</strong>, un chantier <strong>Andriessen</strong>, le <strong>Franck</strong> réédité par <strong>Musique en Wallonie</strong>, ou encore l'intégrale <strong>Furtwängler</strong> publiée par <strong>Warner</strong> — autant de propositions qui témoignent de la richesse d'une saison où le patrimoine dialogue avec la création contemporaine.",
    ],
  },
}

const ORDRE_CATEGORIES = ['prix_special', 'enregistrement_annee', 'matrimoine', 'autre']

const TITRES_CATEGORIES = {
  prix_special: "Prix Bernadette Beyne & Michelle Debra",
  enregistrement_annee: "Enregistrement de l'année",
  matrimoine: "Millésime Matrimoine musical",
  autre: "Autres Millésimes",
}

async function getAlbumsAnnee(annee) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase
    .from('albums')
    .select('id, title, composers, label, cover_url, critique_url, millesime_categorie, millesime_label')
    .eq('millesime_annee', annee)

  if (error || !data) return []
  return data
}

export async function generateStaticParams() {
  return [{ annee: '2021' }, { annee: '2022' }, { annee: '2023' }, { annee: '2024' }, { annee: '2025' }]
}

export default async function MillesimesAnneePage({ params }) {
  const { annee } = await params
  const anneeNum = parseInt(annee, 10)
  if (isNaN(anneeNum)) notFound()

  const albums = await getAlbumsAnnee(anneeNum)
  if (albums.length === 0) notFound()

  const edito = EDITOS[anneeNum] || { sous_titre: `${anneeNum}`, paragraphes: [] }

  const parCategorie = {}
  for (const album of albums) {
    const cat = album.millesime_categorie || 'autre'
    if (!parCategorie[cat]) parCategorie[cat] = []
    parCategorie[cat].push(album)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-4">
        <a href="/millesimes" className="text-sm text-stone-500 hover:text-amber-700">← Toutes les éditions</a>
      </div>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs uppercase tracking-wider font-medium mb-4">
          ★ {edito.sous_titre} · {albums.length} albums primés
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">Les Millésimes {anneeNum}</h1>
        <div className="max-w-none text-stone-700 space-y-4">
          {edito.paragraphes.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          <p className="text-sm italic text-stone-500 pt-4">— Pierre-Jean Tribot, Rédacteur en chef</p>
        </div>
      </header>

      {ORDRE_CATEGORIES.map((cat) => {
        const items = parCategorie[cat]
        if (!items || items.length === 0) return null
        const titreCat = TITRES_CATEGORIES[cat]
        const special = cat !== 'autre'
        const memorial = cat === 'prix_special'
        return (
          <section key={cat} className="mb-12">
            <h2 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${special ? (memorial ? 'text-stone-800' : 'text-amber-800') : 'text-stone-600'}`}>
              {titreCat}
            </h2>
            <div className={special && items.length === 1 ? '' : 'grid md:grid-cols-2 gap-6'}>
              {items.map((album) => (
                <AlbumCard key={album.id} album={album} memorial={memorial} special={special} />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}

function AlbumCard({ album, memorial, special }) {
  const borderClass = memorial
    ? 'border-stone-400 shadow-md'
    : special
    ? 'border-amber-300 shadow-md'
    : 'border-stone-200'
  const badgeClass = memorial
    ? 'bg-stone-800 text-white'
    : 'bg-amber-100 text-amber-900'
  const composer = Array.isArray(album.composers) ? album.composers.join(', ') : (album.composers || '')

  return (
    <article className={`bg-white border rounded-2xl p-6 ${borderClass}`}>
      {album.millesime_label && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${badgeClass}`}>
          ★ {album.millesime_label}
        </div>
      )}
      <div className="flex gap-4">
        {album.cover_url && (
          <img src={album.cover_url} alt="" className="w-24 h-24 object-cover rounded-lg shrink-0 border border-stone-200" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-serif text-stone-900 mb-2 leading-snug">{album.title}</h3>
          {composer && <p className="text-sm font-medium text-stone-700 mb-2">{composer}</p>}
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
