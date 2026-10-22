import { SITE_URL } from './site'

/**
 * Données structurées schema.org (JSON-LD) : décrivent les pages aux moteurs
 * de recherche et aux IA (qui est le compositeur, quelles critiques Crescendo
 * le concernent, avec album, label, date et distinction).
 */

export const CRESCENDO = {
  '@type': 'Organization',
  '@id': 'https://www.crescendo-magazine.be/#organization',
  name: 'Crescendo Magazine',
  url: 'https://www.crescendo-magazine.be',
}

/** Sérialise pour une balise <script type="application/ld+json"> (sans injection HTML). */
export function jsonLdScript(data) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

function distinction(a) {
  if (a.millesime_annee) return `Millésime Crescendo ${a.millesime_annee}${a.millesime_label ? ` · ${a.millesime_label}` : ''}`
  if (a.is_joker) return 'Joker Crescendo'
  return undefined
}

/** Fiche compositeur : la personne + chacune des critiques Crescendo de ses disques. */
export function compositeurJsonLd(c, albums) {
  const url = `${SITE_URL}/compositeurs/${encodeURIComponent(c.id)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#compositeur`,
    name: c.name,
    url,
    jobTitle: 'Compositeur',
    ...(c.born && { birthDate: String(c.born) }),
    ...(c.died && { deathDate: String(c.died) }),
    ...(c.nationality && { nationality: c.nationality }),
    ...(c.description && { description: c.description }),
    subjectOf: albums.filter(a => a.critique_url).map(a => ({
      '@type': 'Review',
      url: a.critique_url,
      name: a.article_title || a.title,
      inLanguage: 'fr',
      ...(a.published_at && { datePublished: String(a.published_at).slice(0, 10) }),
      author: CRESCENDO,
      publisher: CRESCENDO,
      itemReviewed: {
        '@type': 'MusicAlbum',
        name: a.title || a.article_title,
        ...(a.label && { recordLabel: { '@type': 'Organization', name: a.label } }),
        ...(a.cover_url && { image: a.cover_url }),
      },
      ...(distinction(a) && { award: distinction(a) }),
    })),
  }
}

/** Site entier : déclaré une fois dans le layout. */
export const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Phono.Crescendo',
  url: SITE_URL,
  inLanguage: 'fr',
  description: 'Base de données des critiques phonographiques de Crescendo Magazine, depuis 1993.',
  publisher: CRESCENDO,
  license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/recherche?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}
