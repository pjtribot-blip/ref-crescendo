export const metadata = {
  title: 'À propos',
  description: "Phono.Crescendo, base de données discographique de Crescendo Magazine, média musical francophone basé en Belgique depuis 1993.",
}

export default function AProposPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <article>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
          À propos de Phono.Crescendo
        </h1>

        <p className="text-stone-700 leading-relaxed mb-6">
          Phono.Crescendo est la base de données discographique de Crescendo
          Magazine, le mensuel musical francophone basé en Belgique depuis
          1993. Plus de 5 200 critiques d'albums classiques y sont rassemblées
          et navigables par compositeur, label, interprète, époque ou
          millésime.
        </p>

        <h2 className="font-serif text-xl text-stone-800 mt-10 mb-4">
          Méthodologie
        </h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          Les chroniques sont récoltées automatiquement depuis
          crescendo-magazine.be plusieurs fois par jour. Chaque album est
          rattaché à son compositeur, son label et ses métadonnées techniques.
          La rédaction distingue chaque automne les Millésimes de l'année et
          décerne au fil des parutions des Jokers, ses coups de cœur mensuels.
        </p>

        <h2 className="font-serif text-xl text-stone-800 mt-10 mb-4">
          Distinctions
        </h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          Les <strong className="text-stone-900">Millésimes</strong> sont les
          distinctions annuelles attribuées par la rédaction depuis 2021. Les{' '}
          <strong className="text-stone-900">Jokers</strong> signalent les
          coups de cœur ponctuels. Les{' '}
          <strong className="text-stone-900">Premières mondiales</strong>{' '}
          mettent en avant les enregistrements qui révèlent au disque des
          œuvres inédites.
        </p>

        <h2 className="font-serif text-xl text-stone-800 mt-10 mb-4">
          Crédits
        </h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          Crescendo Magazine a été fondé par Bernadette Beyne (1949-2018) et
          Michelle Debra (1950-2025). Phono.Crescendo est développé par
          Crescendo Magazine afin de donner accès aux archives des critiques
          phonographiques de manière structurée et navigable.
        </p>

        <h2 className="font-serif text-xl text-stone-800 mt-10 mb-4">
          Lire les chroniques
        </h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          Pour lire les chroniques complètes, visitez{' '}
          <a
            href="https://www.crescendo-magazine.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            crescendo-magazine.be
          </a>
          .
        </p>
      </article>
    </main>
  )
}
