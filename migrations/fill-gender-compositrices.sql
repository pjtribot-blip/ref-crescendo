-- Remplit gender='F' pour les 29 compositrices listées en dur dans app/compositrices/page.js.
-- À coller dans Supabase SQL Editor. Idempotent (ré-exécutable sans effet de bord).

UPDATE compositeurs
SET gender = 'F'
WHERE name IN (
  'Hildegard von Bingen',
  'Francesca Caccini',
  'Barbara Strozzi',
  'Louise Bertin',
  'Fanny Mendelssohn',
  'Clara Schumann',
  'Pauline Viardot',
  'Augusta Holmès',
  'Louise Farrenc',
  'Cécile Chaminade',
  'Ethel Smyth',
  'Amy Beach',
  'Mel Bonis',
  'Nadia Boulanger',
  'Lili Boulanger',
  'Rebecca Clarke',
  'Germaine Tailleferre',
  'Florence Price',
  'Elsa Barraine',
  'Johanna Senfter',
  'Grażyna Bacewicz',
  'Galina Oustvolskaïa',
  'Sofia Goubaïdoulina',
  'Betsy Jolas',
  'Meredith Monk',
  'Kaija Saariaho',
  'Unsuk Chin',
  'Margaret Brouwer',
  'Jeanine Tesori'
);
