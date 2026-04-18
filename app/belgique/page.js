import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'La scène musicale belge — Référence Crescendo',
  description: 'La vitrine de la scène musicale belge sur Crescendo Magazine : compositeurs, chefs, solistes, ensembles, orchestres, festivals et labels.',
}

export const revalidate = 3600

const COMPOSITEURS_BELGES = [
  'François-Joseph Fétis',
  'Charles-Auguste de Bériot',
  'François-Auguste Gevaert',
  'Peter Benoit',
  'César Franck',
  'Henri Vieuxtemps',
  'Louis Van Waefelghem',
  'Joseph Dupont',
  'Edgar Tinel',
  'Emile Mathieu',
  'Jan Blockx',
  'Sylvain Dupuis',
  'Eugène Ysaÿe',
  'Paul Lebrun',
  'August De Boeck',
  'Guillaume Lekeu',
  'Désiré Pâque',
  'Joseph Ryelandt',
  'Paul Gilson',
  'Joseph Jongen',
  'Léon Jongen',
  'Jean Rogister',
  'Flor Alpaerts',
  'Marcel Poot',
  'Jean Absil',
  'Raymond Chevreuille',
  'Victor Legley',
  'Pierre Froidebise',
  'Marcel Quinet',
  'Frédéric Van Rossum',
  'Jean-Marie Simonis',
  'Célestin Deliège',
  'Frederik Devreese',
  'Daniel Capelletti',
  'Jean-Pierre Peuvion',
  'Boudewijn Buckinx',
  'Godfried-Willem Raes',
  'Michel Lysight',
  'Luc Brewaeys',
  'Luc Van Hove',
  'Christian Frogneux',
  'Jan Van Landeghem',
  'Stéphane Orlando',
  'Benoît Regibo',
  'Jacqueline Fontyn',
  'André Laporte',
  'Adrien Tsilogiannis',
  'Philippe Boesmans',
  'Henri Pousseur',
  'Pierre Bartholomée',
  'Claude Coppens',
  'Jacques Leduc',
  'Benoît Mernier',
  'Jean-Luc Fafchamps',
  'Claude Ledoux',
  'Piet Swerts',
  'Annelies Van Parys',
  'Wim Henderickx',
  'Philippe Rouillon',
  'Paul Van Laecken',
  'Alain Craens',
  'Michel Leclerc',
  'Robert Groslot',
  'Jean-Paul Dessy',
]

const CHEFS = [
  'Philippe Herreweghe',
  'Leonardo García Alarcón',
  'Bart Van Reyn',
  'Jos van Immerseel',
  'Sigiswald Kuijken',
  'Paul Van Nevel',
  'Ronald Zollman',
  'Georges Octors',
  'Frank Agsteribbe',
  'Jean Tubéry',
  'Herman Engels',
  'Luc Baiwir',
  'Patrick Leterme',
  'David Miller',
]

const SOLISTES_PIANISTES = [
  'Julien Libeer',
  'Apolline Jesupret',
  'Eliane Reyes',
  'Florian Noack',
  'Stéphane Ginsburgh',
  'Jean-Claude Vanden Eynden',
  'Muhiddin Dürrüoglu',
  'Boyan Vodenitcharov',
  'Hans Ryckelynck',
  'Daniel Blumenthal',
  'Thérèse Dussaut',
  'Frank Braley',
  'Liebrecht Vanbeckevoort',
  'Charlotte Jacobs',
  'Andreas Frese',
  'Jozef De Beenhouwer',
  'Plamena Mangova',
  'Polina Leschenko',
  'Catherine Mertens',
  'Jean-Michel Dayez',
  'Johan Schmidt',
  'Sophie Hallynck',
  'Aymeric De Dorlodot',
]

const SOLISTES_VIOLONISTES = [
  'Lorenzo Gatto',
  'Yossif Ivanov',
  'Hrachya Avanesyan',
  'Marc Bouchkov',
  'Tatiana Samouil',
  'Ayla Erduran',
  'Mi-Sa Yang',
  'Hrabba Atladottir',
  'Jean-Frédéric Molard',
  'Philippe Graffin',
  'Véronique Bogaerts',
]

const SOLISTES_VIOLONCELLISTES = [
  'Marie Hallynck',
  'Olivier Marron',
  'Roel Dieltiens',
  'Wieland Kuijken',
  'Didier Poskin',
]

const SOLISTES_CLAVECIN_ORGUE = [
  'Bernard Foccroulle',
]

const SOLISTES_VENTS = [
  'Jan De Winne',
  'Barthold Kuijken',
  'Eric Speller',
  'Baudouin Giaux',
  'Marc Grauwels',
  'Brigitte Buxton',
]

const SOLISTES_CHANTEURS = [
  'José Van Dam',
  'Werner Van Mechelen',
  'Stephan Genz',
  'Thomas Blondelle',
  'Jean-François Rouchon',
  'Lionel Meunier',
  'Céline Scheen',
  'Sophie Karthäuser',
  'Jodie Devos',
  'Marianne Merckx',
  'Lena Belkina',
  'Patrick Delcour',
  'Jean-Marc Boudreau',
  'Anna Delvaux',
  'Ludwig Van der Elst',
  'Pierre Derhet',
  'Liesbeth Devos',
  'Julie Mossay',
  'Camille Merckx',
  'Véronique Van Mol',
  'Liesbet Buyse',
  'Sarah Defrise',
  'Reinoud Van Mechelen',
  'François Soons',
  'Alexandre Beuchat',
  'Raphaële Kennedy',
]

const ORCHESTRES_SYMPHO = [
  'Orchestre Philharmonique Royal de Liège',
  'Brussels Philharmonic',
  'Orchestre National de Belgique',
  'Antwerp Symphony Orchestra',
  'Orchestre Royal de Chambre de Wallonie',
]

const ENSEMBLES_BAROQUE = [
  'Cappella Mediterranea',
  'Les Agrémens',
  "B'Rock Orchestra",
  'Il Fondamento',
  'Il Gardellino',
  'La Petite Bande',
  'Anima Eterna',
  'Ricercar Consort',
  'Vox Luminis',
  'Graindelavoix',
  'Huelgas Ensemble',
  'Zefiro Torna',
  'Capilla Flamenca',
  'Clematis',
  'InAlto',
  'Les Muffatti',
  'Ausonia',
  'Scherzi Musicali',
  'La Fenice',
  'Ensemble Biscantores',
  'Kantorij Cantabile',
  'Arpa Diatonica',
]

const ENSEMBLES_VOCAL = [
  'Collegium Vocale Gent',
  'Chœur de Chambre de Namur',
  'Vlaams Radio Koor',
  'Currende Consort',
  'Octopus Chamber Choir',
]

const ENSEMBLES_CHAMBRE = [
  'Het Collectief',
  'Ictus',
  'Oxalys',
  'Sturm und Klang',
  'Quatuor Alfama',
  'Quatuor Danel',
  'Spectra Ensemble',
  'Ensemble Musiques Nouvelles',
  'Revue Blanche',
  'Ensemble Kheops',
  'Quatuor Tana',
  'Quatuor Akhtamar',
  'Quatuor Malibran',
  'MP4 Quartet',
]

const LIEUX = [
  { name: 'Théâtre royal de La Monnaie', url: 'https://www.lamonnaiedemunt.be' },
  { name: 'Opéra Royal de Wallonie', url: 'https://www.operaliege.be' },
  { name: 'Opera Ballet Vlaanderen', url: 'https://www.operaballet.be' },
  { name: 'Flagey', url: 'https://www.flagey.be' },
  { name: 'Bozar', url: 'https://www.bozar.be' },
  { name: 'Festival de Wallonie', url: 'https://www.festivaldewallonie.be' },
  { name: 'Klarafestival', url: 'https://www.klarafestival.be' },
  { name: 'Chapelle Musicale Reine Élisabeth', url: 'https://www.musicchapel.org' },
]

const LABELS_BELGES = [
  'Ricercar',
  'Cyprès',
  'Musique en Wallonie',
  'Ramée',
  'Pavane',
  'Fuga Libera',
  'Outhere',
  "Et'cetera",
  'Flora',
  'Passacaille',
  'Phaedra',
  'Evil Penguin Records',
]

export default async function BelgiquePage() {
  const [compositeursRes, albumsAllRes, albumsLabelsRes, interpretsRes] = await Promise.all([
    supabase
      .from('compositeurs')
      .select('id, name, born, died, period, nationality')
      .in('name', COMPOSITEURS_BELGES),
    supabase
      .from('albums')
      .select('id, composers, millesime_annee'),
    supabase
      .from('albums')
      .select('id, title, article_title, label, published_at, critique_url, cover_url, millesime_annee')
      .in('label', LABELS_BELGES)
      .order('published_at', { ascending: false }),
    supabase
      .from('interprets')
      .select('name, nb_albums, album_ids')
      .in('name', [
        ...CHEFS,
        ...SOLISTES_PIANISTES,
        ...SOLISTES_VIOLONISTES,
        ...SOLISTES_VIOLONCELLISTES,
        ...SOLISTES_CLAVECIN_ORGUE,
        ...SOLISTES_VENTS,
        ...SOLISTES_CHANTEURS,
        ...ORCHESTRES_SYMPHO,
        ...ENSEMBLES_BAROQUE,
        ...ENSEMBLES_VOCAL,
        ...ENSEMBLES_CHAMBRE,
      ]),
  ])

  const compositeurRows = compositeursRes.data || []
  const albumsAll = albumsAllRes.data || []
  const albumsLabels = albumsLabelsRes.data || []
  const interpretRows = interpretsRes.data || []

  const nbAlbumsParNom = {}
  const millesimesParNom = {}
  const millesimeAlbumIds = new Set()
  for (const a of albumsAll) {
    if (a.millesime_annee) millesimeAlbumIds.add(a.id)
    const names = Array.isArray(a.composers) ? a.composers : []
    for (const n of names) {
      nbAlbumsParNom[n] = (nbAlbumsParNom[n] || 0) + 1
      if (a.millesime_annee) millesimesParNom[n] = (millesimesParNom[n] || 0) + 1
    }
  }

  const compByName = Object.fromEntries(compositeurRows.map(c => [c.name, c]))
  const enrichComp = (name) => {
    const c = compByName[name]
    return {
      name,
      id: c?.id ?? null,
      present: Boolean(c),
      born: c?.born ?? null,
      died: c?.died ?? null,
      period: c?.period ?? null,
      nb_albums: nbAlbumsParNom[name] || 0,
      millesime: (millesimesParNom[name] || 0) > 0,
    }
  }

  const interpByName = Object.fromEntries(interpretRows.map(i => [i.name, i]))
  const enrichInterp = (name) => {
    const i = interpByName[name]
    const nb = i?.nb_albums || 0
    const ids = i?.album_ids || []
    const hasMillesime = ids.some(id => millesimeAlbumIds.has(id))
    return { name, present: Boolean(i), nb_albums: nb, millesime: hasMillesime }
  }

  const compositeurs = COMPOSITEURS_BELGES.map(enrichComp)
    .sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999))
  const byAlbumsDesc = (a, b) => b.nb_albums - a.nb_albums
  const chefs = CHEFS.map(enrichInterp).sort(byAlbumsDesc)
  const pianistes = SOLISTES_PIANISTES.map(enrichInterp).sort(byAlbumsDesc)
  const violonistes = SOLISTES_VIOLONISTES.map(enrichInterp).sort(byAlbumsDesc)
  const violoncellistes = SOLISTES_VIOLONCELLISTES.map(enrichInterp).sort(byAlbumsDesc)
  const clavecinOrgue = SOLISTES_CLAVECIN_ORGUE.map(enrichInterp).sort(byAlbumsDesc)
  const vents = SOLISTES_VENTS.map(enrichInterp).sort(byAlbumsDesc)
  const chanteurs = SOLISTES_CHANTEURS.map(enrichInterp).sort(byAlbumsDesc)
  const solistesAll = [...pianistes, ...violonistes, ...violoncellistes, ...clavecinOrgue, ...vents, ...chanteurs]
  const symphoniques = ORCHESTRES_SYMPHO.map(enrichInterp).sort((a, b) => b.nb_albums - a.nb_albums)
  const baroques = ENSEMBLES_BAROQUE.map(enrichInterp).sort((a, b) => b.nb_albums - a.nb_albums)
  const vocaux = ENSEMBLES_VOCAL.map(enrichInterp).sort((a, b) => b.nb_albums - a.nb_albums)
  const chambre = ENSEMBLES_CHAMBRE.map(enrichInterp).sort((a, b) => b.nb_albums - a.nb_albums)

  const parLabel = Object.fromEntries(LABELS_BELGES.map(l => [l, { albums: [], millesimes: 0 }]))
  for (const album of albumsLabels) {
    const e = parLabel[album.label]
    if (!e) continue
    e.albums.push(album)
    if (album.millesime_annee) e.millesimes++
  }
  const labelsAvecAlbums = LABELS_BELGES
    .map(name => ({ name, ...parLabel[name] }))
    .filter(l => l.albums.length > 0)
    .sort((a, b) => b.albums.length - a.albums.length)

  const totalLabelAlbums = labelsAvecAlbums.reduce((s, l) => s + l.albums.length, 0)
  const totalLabelMillesimes = labelsAvecAlbums.reduce((s, l) => s + l.millesimes, 0)

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-orange-50 border border-orange-200 rounded-full text-orange-800 text-xs uppercase tracking-wider font-medium mb-4">
          🇧🇪 Belgique · {totalLabelAlbums} albums chez les labels belges · {totalLabelMillesimes} Millésime{totalLabelMillesimes > 1 ? 's' : ''}
        </div>
        <h1 className="text-5xl font-serif text-stone-900 mb-6">La scène musicale belge</h1>
        <div className="max-w-none text-stone-700 space-y-4 leading-relaxed">
          <p>
            De l&apos;école franco-belge du violon au foisonnement de la musique ancienne, de la vitalité de la
            scène baroque aux créations les plus exigeantes de la musique contemporaine, la <strong>scène musicale
            belge</strong> occupe une place singulière dans le paysage européen. Un territoire confidentiel par sa
            taille, mais d&apos;une exceptionnelle densité : ensembles de pointe, voix reconnues sur la scène du
            lied et de l&apos;opéra, orchestres symphoniques, salles historiques et festivals structurent un
            écosystème dont la finesse n&apos;a rien à envier aux plus grandes nations musicales.
          </p>
          <p>
            Depuis sa fondation en <strong>1993</strong> par Bernadette Beyne et Michelle Debra,{' '}
            <strong>Crescendo Magazine</strong> porte cette scène depuis la <strong>Belgique francophone</strong>,
            en qualité de média indépendant au rayonnement international. Cette page rassemble, en un point unique,
            les compositeurs, interprètes, ensembles, institutions et labels qui font vivre la musique classique en
            Belgique — chacun relié aux critiques et dossiers publiés par la rédaction.
          </p>
        </div>
      </header>

      <nav aria-label="Sommaire" className="mb-12 p-5 bg-white border border-stone-200 rounded-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Sommaire</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li><a href="#compositeurs" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Compositeurs</a></li>
          <li><a href="#chefs" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Chefs d&apos;orchestre</a></li>
          <li><a href="#solistes" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Solistes</a></li>
          <li><a href="#ensembles" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Orchestres &amp; ensembles</a></li>
          <li><a href="#lieux" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Opéras, salles &amp; festivals</a></li>
          <li><a href="#labels" className="text-orange-700 hover:text-orange-900 underline underline-offset-4">Labels</a></li>
        </ul>
      </nav>

      <SectionHeader id="compositeurs" title="Compositeurs" count={compositeurs.filter(c => c.present).length} total={compositeurs.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
        {compositeurs.map(c => <CompositeurCard key={c.name} c={c} />)}
      </div>

      <SectionHeader id="chefs" title="Chefs d'orchestre" count={chefs.filter(x => x.present).length} total={chefs.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
        {chefs.map(i => <InterpreteCard key={i.name} i={i} />)}
      </div>

      <SectionHeader id="solistes" title="Solistes" count={solistesAll.filter(x => x.present).length} total={solistesAll.length} />
      <SubSection title="Pianistes" items={pianistes} />
      <SubSection title="Violonistes" items={violonistes} />
      <SubSection title="Violoncellistes" items={violoncellistes} />
      <SubSection title="Claveciniste / Organiste" items={clavecinOrgue} />
      <SubSection title="Vents et bois" items={vents} />
      <SubSection title="Chanteurs" items={chanteurs} />
      <div className="mb-16" />

      <SectionHeader id="ensembles" title="Orchestres et ensembles" />
      <SubSection title="Orchestres symphoniques" items={symphoniques} />
      <SubSection title="Ensembles baroques et musique ancienne" items={baroques} />
      <SubSection title="Ensembles vocaux" items={vocaux} />
      <SubSection title="Ensembles de chambre et contemporains" items={chambre} />
      <div className="mb-16" />

      <SectionHeader id="lieux" title="Opéras, salles et festivals" count={LIEUX.length} total={LIEUX.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
        {LIEUX.map(l => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-stone-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-stone-800 text-sm leading-snug mb-1">{l.name}</p>
            <p className="text-xs text-stone-400 truncate">{l.url.replace(/^https?:\/\//, '')} ↗</p>
          </a>
        ))}
      </div>

      <SectionHeader id="labels" title="Labels" count={labelsAvecAlbums.length} total={LABELS_BELGES.length} />
      <div className="space-y-12">
        {labelsAvecAlbums.map(label => (
          <LabelSection key={label.name} label={label} />
        ))}
      </div>
    </main>
  )
}

function SectionHeader({ id, title, count, total }) {
  return (
    <div id={id} className="scroll-mt-20 flex flex-wrap items-baseline gap-3 mb-6 pb-2 border-b-2 border-orange-200">
      <h2 className="text-3xl font-serif text-stone-900">{title}</h2>
      {typeof count === 'number' && (
        <span className="text-sm text-stone-500">
          {count}{typeof total === 'number' && total !== count ? ` / ${total}` : ''}
        </span>
      )}
    </div>
  )
}

function SubSection({ title, items }) {
  if (!items?.length) return null
  return (
    <div className="mb-10">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-orange-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(i => <InterpreteCard key={i.name} i={i} />)}
      </div>
    </div>
  )
}

function CompositeurCard({ c }) {
  const dates = c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''
  const content = (
    <>
      <div className="flex justify-between items-start mb-1 gap-2">
        <h4 className="font-medium text-stone-800 text-sm leading-snug">{c.name}</h4>
        {c.millesime && (
          <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-semibold shrink-0">★</span>
        )}
      </div>
      {dates && <p className="text-xs text-stone-400">{dates}</p>}
      {c.period && <p className="text-xs text-stone-500 mt-0.5">{c.period}</p>}
      <p className="text-xs text-stone-500 mt-2">
        {c.present
          ? c.nb_albums > 0
            ? `${c.nb_albums} album${c.nb_albums > 1 ? 's' : ''} dans la référence`
            : 'Compositeur référencé'
          : <span className="italic text-stone-400">Pas encore référencé</span>}
      </p>
    </>
  )
  if (c.present && c.id) {
    return (
      <Link
        href={`/compositeurs/${c.id}`}
        className="block p-4 border border-stone-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition-all"
      >
        {content}
      </Link>
    )
  }
  return (
    <div className="block p-4 border border-stone-200 border-dashed rounded-lg bg-stone-50/50">
      {content}
    </div>
  )
}

function InterpreteCard({ i }) {
  const content = (
    <>
      <div className="flex justify-between items-start mb-1 gap-2">
        <h4 className="font-medium text-stone-800 text-sm leading-snug">{i.name}</h4>
        {i.millesime && (
          <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-semibold shrink-0">★</span>
        )}
      </div>
      <p className="text-xs text-stone-500 mt-1">
        {i.present
          ? i.nb_albums > 0
            ? `${i.nb_albums} album${i.nb_albums > 1 ? 's' : ''} dans la référence`
            : 'Référencé'
          : <span className="italic text-stone-400">Pas encore référencé</span>}
      </p>
    </>
  )
  if (i.present) {
    return (
      <Link
        href={`/interpretes/${encodeURIComponent(i.name)}`}
        className="block p-4 border border-stone-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition-all"
      >
        {content}
      </Link>
    )
  }
  return (
    <div className="block p-4 border border-stone-200 border-dashed rounded-lg bg-stone-50/50">
      {content}
    </div>
  )
}

function LabelSection({ label }) {
  const derniers = label.albums.slice(0, 4)
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-3 mb-4 pb-2 border-b border-stone-200">
        <h3 className="text-2xl font-serif text-stone-900">{label.name}</h3>
        <span className="text-sm text-stone-500">
          {label.albums.length} album{label.albums.length > 1 ? 's' : ''}
        </span>
        {label.millesimes > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            ★ {label.millesimes} Millésime{label.millesimes > 1 ? 's' : ''}
          </span>
        )}
        <Link
          href={`/albums?label=${encodeURIComponent(label.name)}`}
          className="ml-auto text-xs text-stone-500 hover:text-stone-800 underline"
        >
          Voir tous les albums →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {derniers.map(a => (
          <a
            key={a.id}
            href={a.critique_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-stone-200 rounded-lg overflow-hidden hover:border-stone-400 hover:shadow-sm transition-all group relative"
          >
            {a.millesime_annee && (
              <div className="absolute top-2 right-2 z-10 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold px-1.5 py-0.5 rounded">
                ★
              </div>
            )}
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
              <p className="font-medium text-stone-800 text-xs leading-snug line-clamp-2 mb-1">
                {a.title || a.article_title}
              </p>
              <p className="text-xs text-stone-400">
                {a.published_at ? new Date(a.published_at).getFullYear() : ''}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
