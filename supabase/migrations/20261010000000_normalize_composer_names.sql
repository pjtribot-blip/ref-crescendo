-- ============================================================
-- Migration : 2026-10-10 · normalize_composer_names
-- ============================================================
-- Ramène les variantes de noms de albums.composers vers le nom de
-- référence de la table compositeurs (compositeurs.name).
--
-- Pourquoi : la page /compositeurs/[id] cherche les albums avec
-- composers @> ARRAY[compositeurs.name]. Un album rangé sous
-- « van Beethoven », « van BEETHOVEN » ou « ēteris Vasks » n'apparaît
-- donc pas sur la fiche « Ludwig van Beethoven » ou « Pēteris Vasks ».
-- Origine : l'extraction du chapô par scripts/scraper-crescendo.js
-- (le prénom est perdu devant une particule minuscule « van », « de »…,
-- et les lettres hors Latin-1 comme « ē » ne sont pas reconnues).
--
-- Mode d'emploi :
--   1. lancer d'abord scripts/sql/diagnostic-noms-compositeurs.sql
--      et relire la liste ;
--   2. compléter si besoin les sections A (exclusions) et B (choix
--      manuels pour les cas ambigus) ci-dessous ;
--   3. lancer ce script en entier. Le tableau affiché à la fin donne,
--      pour chaque variante corrigée, le nom retenu et le nombre
--      d'albums modifiés.
--
-- Règles automatiques (identiques au diagnostic) : même nom à la casse
-- et aux accents près, fin du nom, ou première lettre perdue — et
-- seulement quand UN SEUL compositeur correspond.
-- Si un album contenait déjà le nom de référence, le doublon est
-- supprimé ; l'ordre des compositeurs est conservé.
--
-- Idempotente : rejouée, elle ne trouve plus de variante et ne change rien.
-- En cas d'erreur, rien n'est modifié (tout est dans une transaction).
-- ============================================================

begin;

do $$
begin
  if to_regclass('public.albums') is null or to_regclass('public.compositeurs') is null then
    raise exception 'Tables albums / compositeurs introuvables : vous n''êtes sans doute pas dans le projet Supabase du site Phono.';
  end if;
  if (select udt_name from information_schema.columns
      where table_schema = 'public' and table_name = 'albums' and column_name = 'composers') <> '_text' then
    raise exception 'albums.composers n''est pas de type text[] : migration interrompue, rien n''a été modifié.';
  end if;
end $$;

-- ------------------------------------------------------------
-- A. Variantes à NE PAS toucher, même si la règle automatique
--    propose un candidat unique (une ligne par variante).
-- ------------------------------------------------------------
create temp table exclusions (variante text primary key) on commit drop;
insert into exclusions values
  ('Strauss'),    -- Richard ou Johann ?
  ('Martin'),     -- Frank Martin ou un autre ?
  ('Couperin'),   -- François ou Louis ?
  ('Caccini');    -- Francesca ou Giulio ?

-- ------------------------------------------------------------
-- B. Choix manuels (cas « ambigu — à trancher » du diagnostic).
--    La cible doit être écrite EXACTEMENT comme dans compositeurs.name.
-- ------------------------------------------------------------
--    Établis le 2026-10-11 à partir du diagnostic (graphies étrangères,
--    fautes de frappe, prénoms tronqués). Les espaces insécables et
--    doubles espaces sont ignorés dans la comparaison.
--    « Marie de Grandval » et « Clémence de Grandval » sont la même
--    compositrice, en double dans la table : on regroupe sous Clémence.
create temp table choix_manuels (variante text primary key, cible text not null) on commit drop;
insert into choix_manuels values
  ('Alexander Borodin', 'Alexandre Borodine'),
  ('Alexander Borodine', 'Alexandre Borodine'),
  ('Alexander Scriabin', 'Alexandre Scriabine'),
  ('Alexander Scriabine', 'Alexandre Scriabine'),
  ('Alexandre Nikolaïevitch Scriabine', 'Alexandre Scriabine'),
  ('de Scriabine', 'Alexandre Scriabine'),
  ('Aleksander Tansman', 'Alexandre Tansman'),
  ('Modeste Grétry', 'André Grétry'),
  ('Antoine Busnois', 'Antoine Busnoys'),
  ('Antonio Lot', 'Antonio Lotti'),
  ('Antonio Loti', 'Antonio Lotti'),
  ('Anton Dvořák', 'Antonín Dvořák'),
  ('Antonín Leopold Dvořák', 'Antonín Dvořák'),
  ('Arcangello CORELLI', 'Arcangelo Corelli'),
  ('Sir Arnold BAX', 'Arnold Bax'),
  ('Arnold SCHOENBERG', 'Arnold Schönberg'),
  ('Arnold Schoenberg', 'Arnold Schönberg'),
  ('řich Smetana', 'Bedřich Smetana'),
  ('Carl Philipp Emmanuel BACH', 'Carl Philipp Emanuel Bach'),
  ('Marie Widor', 'Charles-Marie Widor'),
  ('Warie Widor', 'Charles-Marie Widor'),
  ('Valentin Alkan', 'Charles-Valentin Alkan'),
  ('Cheryl Frances-Hoad (1980)', 'Cheryl Frances-Hoad'),
  ('Christoph Wiilbald Gluck', 'Christoph Willibald Gluck'),
  ('Clara Wieck-Schumann', 'Clara Schumann'),
  ('Claude Debussy (', 'Claude Debussy'),
  ('de GRANDVAL', 'Clémence de Grandval'),
  ('de Grandval', 'Clémence de Grandval'),
  ('Dieterich Buxtehude', 'Dietrich Buxtehude'),
  ('Dimitri CHOSTAKOVITCH', 'Dmitri Chostakovitch'),
  ('Dimitri Chostakovitch', 'Dmitri Chostakovitch'),
  ('Dimitri SHOSTAKOVITCH', 'Dmitri Chostakovitch'),
  ('Dimitri Shostakovitch', 'Dmitri Chostakovitch'),
  ('Dimtri Chostakovitch', 'Dmitri Chostakovitch'),
  ('Dmitri CHOSTAKOVICH', 'Dmitri Chostakovitch'),
  ('Dmitri Chostakovich', 'Dmitri Chostakovitch'),
  ('Dmitri SHOSTAKOVITCH', 'Dmitri Chostakovitch'),
  ('Dmitri Shostakovich', 'Dmitri Chostakovitch'),
  ('Dmitry Shostakovich', 'Dmitri Chostakovitch'),
  ('Scarlatti', 'Domenico Scarlatti'),
  ('of Domenico Scarlatti', 'Domenico Scarlatti'),
  ('Dora Pejavic', 'Dora Pejačević'),
  ('Edgar VARESE', 'Edgard Varèse'),
  ('Sir Edward Elgar', 'Edward Elgar'),
  ('by Sir Edward Elgar', 'Edward Elgar'),
  ('Sven Tüür', 'Erkki-Sven Tüür'),
  ('Ernest Krenek', 'Ernst Krenek'),
  ('Dame Ethel Smyth', 'Ethel Smyth'),
  ('Fanny Hensel Mendelssohn', 'Fanny Mendelssohn'),
  ('Felix Mendelssohn (1809', 'Felix Mendelssohn'),
  ('Mendelssohn', 'Felix Mendelssohn'),
  ('Florence Beatrice Price', 'Florence Price'),
  ('Franz Liszt (1811 – 1', 'Franz Liszt'),
  ('par Franz Liszt', 'Franz Liszt'),
  ('François Francœur', 'François Francoeur'),
  ('Georg Friedrich HAENDEL', 'Georg Friedrich Händel'),
  ('Georg Friedrich Haendel', 'Georg Friedrich Händel'),
  ('Georg-Friderich HAENDEL', 'Georg Friedrich Händel'),
  ('George Frederic Haendel', 'Georg Friedrich Händel'),
  ('George Frideric HANDEL', 'Georg Friedrich Händel'),
  ('George Frideric Haendel', 'Georg Friedrich Händel'),
  ('George Frideric Handel', 'Georg Friedrich Händel'),
  ('George Frideric Händel', 'Georg Friedrich Händel'),
  ('George Friedrich HAENDEL', 'Georg Friedrich Händel'),
  ('Haendel', 'Georg Friedrich Händel'),
  ('Georg Philip TELEMANN', 'Georg Philipp Telemann'),
  ('Georg Philip Telemann', 'Georg Philipp Telemann'),
  ('Georges Crumb', 'George Crumb'),
  ('de Giacomo Puccini', 'Giacomo Puccini'),
  ('Gilles Binchois', 'Gilles de Bins dit Binchois'),
  ('Gioacchino ROSSINI', 'Gioachino Rossini'),
  ('Gioacchino Rossini', 'Gioachino Rossini'),
  ('Giambattista PERGOLESI', 'Giovanni Battista Pergolesi'),
  ('Giovanni Battista Bononcini', 'Giovanni Bononcini'),
  ('Giovanni Pierlugi Da PALESTRINA', 'Giovanni Pierluigi da Palestrina'),
  ('Giovanni Pierluigi Palestrina', 'Giovanni Pierluigi da Palestrina'),
  ('de Giuseppe Verdi', 'Giuseppe Verdi'),
  ('yna Bacewicz', 'Grażyna Bacewicz'),
  ('Györgi Ligeti', 'György Ligeti'),
  ('Henry Purcell (1658/9-1695)', 'Henry Purcell'),
  ('Henryk Mikolaj Górecki', 'Henryk Górecki'),
  ('Henryk Mykolaj Górecki', 'Henryk Górecki'),
  ('Hidegard VON BINGEN', 'Hildegard von Bingen'),
  ('Igor STRAVINSKY', 'Igor Stravinski'),
  ('Igor Stravinsky', 'Igor Stravinski'),
  ('Igor Strawinsky', 'Igor Stravinski'),
  ('or Stravinsky', 'Igor Stravinski'),
  ('Sir James MacMillan', 'James MacMillan'),
  ('Baptiste LULLY', 'Jean-Baptiste Lully'),
  ('Baptiste Lully', 'Jean-Baptiste Lully'),
  ('Marie LECLAIR', 'Jean-Marie Leclair'),
  ('Marie Leclair', 'Jean-Marie Leclair'),
  ('Jean Philippe RAMEAU', 'Jean-Philippe Rameau'),
  ('Philippe Rameau', 'Jean-Philippe Rameau'),
  ('Johann Adolph Hasse', 'Johann Adolf Hasse'),
  ('Jan Křtitel Vaňhal', 'Johann Baptist Vanhal'),
  ('Bach', 'Johann Sebastian Bach'),
  ('Jean Sébastien BACH', 'Johann Sebastian Bach'),
  ('Jean Sébastien Bach', 'Johann Sebastian Bach'),
  ('Jean- Sébastien Bach', 'Johann Sebastian Bach'),
  ('Jean-Sébastien BACH', 'Johann Sebastian Bach'),
  ('Jean-Sébastien Bach', 'Johann Sebastian Bach'),
  ('Johan Sebastian BACH', 'Johann Sebastian Bach'),
  ('Johan Sebastian Bach', 'Johann Sebastian Bach'),
  ('Johann Sebastin Bach', 'Johann Sebastian Bach'),
  ('Johann-Sebastian Bach', 'Johann Sebastian Bach'),
  ('Sébastien BACH', 'Johann Sebastian Bach'),
  ('Sébastien Bach', 'Johann Sebastian Bach'),
  ('Franz Joseph HAYDN', 'Joseph Haydn'),
  ('Franz Joseph Haydn', 'Joseph Haydn'),
  ('Haydn', 'Joseph Haydn'),
  ('Hector Fiocco', 'Joseph-Hector Fiocco'),
  ('Josquin DESPREZ', 'Josquin des Prez'),
  ('Josquin Desprez', 'Josquin des Prez'),
  ('Leonard BENSTEIN', 'Leonard Bernstein'),
  ('Leonard Bersntein', 'Leonard Bernstein'),
  ('Ludwig von Beethoven', 'Ludwig van Beethoven'),
  ('Sir Malcolm Arnold', 'Malcolm Arnold'),
  ('Antoine CHARPENTIER', 'Marc-Antoine Charpentier'),
  ('Antoine Charpentier', 'Marc-Antoine Charpentier'),
  ('Marin Marais (1656-1728', 'Marin Marais'),
  ('Martin Marais', 'Marin Marais'),
  ('de Marin Marais', 'Marin Marais'),
  ('Anthony Turnage', 'Mark-Anthony Turnage'),
  ('Johann Michael Haydn', 'Michael Haydn'),
  ('Michel-Richard de Lalande', 'Michel-Richard Delalande'),
  ('ław Weinberg', 'Mieczysław Weinberg'),
  ('Modest MOUSSORGSKI', 'Modeste Moussorgski'),
  ('Modest Moussorgsky', 'Modeste Moussorgski'),
  ('Modest Mussorgsky', 'Modeste Moussorgski'),
  ('Modeste MOUSSORGSKY', 'Modeste Moussorgski'),
  ('Modeste Moussorgsky', 'Modeste Moussorgski'),
  ('Modeste Petrovitch Moussorgski', 'Modeste Moussorgski'),
  ('Nikolai Karlovich Medtner', 'Nikolaï Medtner'),
  ('Nicolai RIMSKY-KORSAKOV', 'Nikolaï Rimski-Korsakov'),
  ('Nicolai Rimsky-Korsakov', 'Nikolaï Rimski-Korsakov'),
  ('Nicolay Rimsky-Korsakov', 'Nikolaï Rimski-Korsakov'),
  ('Nicolaï Rimski-Korsakov', 'Nikolaï Rimski-Korsakov'),
  ('Nikolai RIMSKY-KORSAKOV', 'Nikolaï Rimski-Korsakov'),
  ('Nikolai Rimsky-Korsakov', 'Nikolaï Rimski-Korsakov'),
  ('Nikolaï RIMSKY-KORSAKOV', 'Nikolaï Rimski-Korsakov'),
  ('Nikolaï Rimsky-Korsakov', 'Nikolaï Rimski-Korsakov'),
  ('Olivier Messiaen (1908-19', 'Olivier Messiaen'),
  ('Orlandi di Lasso', 'Orlando di Lasso'),
  ('Paul HIDEMITH', 'Paul Hindemith'),
  ('Philip Glass (1937)', 'Philip Glass'),
  ('Peter Ilyich Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilitch TchaÏkowsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilitch Tchaïkovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilitch Tchaïkowsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illich TCHAÏKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illich Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illitch TCHAÏKOWSKY', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illitch Tchaikovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illitch Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illych Tchaikovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Illych Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyich Tchaikovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyich Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyich Tchaïkowvki', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyitch TCHAIKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyitch TCHAÏKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Ilyitch Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Piotr Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr IIyich TCHAÏKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilych TCHAIKOVSKY', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilyich TCHAÏKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilyich TCHAÏKOVSKY', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilyich Tchaikovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilyich Tchaïkovski', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr Ilyich Tchaïkovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Pyotr TCHAIKOVSKI', 'Piotr Ilitch Tchaïkovski'),
  ('Tchaikovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Tchaïkovsky', 'Piotr Ilitch Tchaïkovski'),
  ('Ralph Vaughan Wlliams', 'Ralph Vaughan Williams'),
  ('Raquel García Tomás', 'Raquel García-Tomás'),
  ('de Robert Schumann', 'Robert Schumann'),
  ('Roxanna Panufnik (1968)', 'Roxanna Panufnik'),
  ('Serge PROKOFIEV', 'Sergueï Prokofiev'),
  ('Serge Prokofiev', 'Sergueï Prokofiev'),
  ('Sergei PROKOFIEV', 'Sergueï Prokofiev'),
  ('Sergei Prokofiev', 'Sergueï Prokofiev'),
  ('Sergey Prokofiev', 'Sergueï Prokofiev'),
  ('Serge RACHMANINOV', 'Sergueï Rachmaninov'),
  ('Serge Rachmaninoff', 'Sergueï Rachmaninov'),
  ('Serge Rachmaninov', 'Sergueï Rachmaninov'),
  ('Sergei RACHMANINOV', 'Sergueï Rachmaninov'),
  ('Sergei Rachmaninov', 'Sergueï Rachmaninov'),
  ('Sergei Vasilevich Rachmaninov', 'Sergueï Rachmaninov'),
  ('Sergeï Rachmaninov', 'Sergueï Rachmaninov'),
  ('Sigismond Thalberg', 'Sigismund Thalberg'),
  ('Sofia Gubaidulina', 'Sofia Goubaïdoulina'),
  ('de Thierry Pécou', 'Thierry Pécou'),
  ('yevich SILVESTROV', 'Valentin Silvestrov'),
  ('William Levi DAWSON', 'William Dawson'),
  ('Sir William Walton', 'William Walton'),
  ('Wolfgang Amadeus Mozart (1756', 'Wolfgang Amadeus Mozart'),
  ('Franz Xaver Scharwenka', 'Xaver Scharwenka');

-- ------------------------------------------------------------
-- Construction de la table de correspondance
-- ------------------------------------------------------------
create temp table correspondances (variante text primary key, cible text not null) on commit drop;

insert into correspondances (variante, cible)
with noms as (
  select distinct u.nom
  from albums a, unnest(a.composers) as u(nom)
  where u.nom is not null
),
orphelins as (
  select n.nom,
    regexp_replace(translate(lower(btrim(replace(n.nom, chr(160), ' '))),
      'àáâãäåāăąçćčďèéêëēęěìíîïīñńňòóôõöøōőřśšşťùúûüūůűýÿźżžł',
      'aaaaaaaaacccdeeeeeeeiiiiinnnoooooooorssstuuuuuuuyyzzzl'), '\s+', ' ', 'g') as plie
  from noms n
  where not exists (select 1 from compositeurs c where c.name = n.nom)
),
referentiel as (
  select distinct c.name,
    regexp_replace(translate(lower(btrim(replace(c.name, chr(160), ' '))),
      'àáâãäåāăąçćčďèéêëēęěìíîïīñńňòóôõöøōőřśšşťùúûüūůűýÿźżžł',
      'aaaaaaaaacccdeeeeeeeiiiiinnnoooooooorssstuuuuuuuyyzzzl'), '\s+', ' ', 'g') as plie
  from compositeurs c
),
candidats as (
  select distinct o.nom, r.name as candidat
  from orphelins o
  join referentiel r
    on r.plie = o.plie
    or r.plie like '% ' || o.plie
    or (length(o.plie) >= 6 and r.plie like '_' || o.plie)
)
select nom, min(candidat)
from candidats
where btrim(regexp_replace(replace(nom, chr(160), ' '), '\s+', ' ', 'g')) not in (select variante from exclusions)
group by nom
having count(*) = 1;

insert into correspondances (variante, cible)
select n.nom, cm.cible
from (select distinct u.nom from albums a, unnest(a.composers) as u(nom) where u.nom is not null) n
join choix_manuels cm
  on cm.variante = btrim(regexp_replace(replace(n.nom, chr(160), ' '), '\s+', ' ', 'g'))
where not exists (select 1 from compositeurs c where c.name = n.nom)
on conflict (variante) do update set cible = excluded.cible;

-- Garde-fou : chaque cible doit exister telle quelle dans compositeurs
do $$
declare inconnue text;
begin
  select k.cible into inconnue
  from correspondances k
  where not exists (select 1 from compositeurs c where c.name = k.cible)
  limit 1;
  if inconnue is not null then
    raise exception 'Cible absente de compositeurs.name : « % ». Migration interrompue, rien n''a été modifié.', inconnue;
  end if;
end $$;

-- Bilan (calculé avant la mise à jour, affiché à la fin)
drop table if exists pg_temp.bilan;
create temp table bilan as
select k.variante, k.cible, count(a.id) as nb_albums_modifies
from correspondances k
join albums a on k.variante = any(a.composers)
group by k.variante, k.cible;

-- ------------------------------------------------------------
-- Mise à jour : remplacement + suppression des doublons, ordre conservé
-- ------------------------------------------------------------
update albums a
set composers = n.composers
from (
  select a2.id,
    array(
      select x.nom
      from (
        select coalesce(k.cible, u.nom) as nom, min(u.ord) as ord
        from unnest(a2.composers) with ordinality as u(nom, ord)
        left join correspondances k on k.variante = u.nom
        group by coalesce(k.cible, u.nom)
      ) x
      order by x.ord
    ) as composers
  from albums a2
  where a2.composers && (select array_agg(variante) from correspondances)
) n
where a.id = n.id;

commit;

-- Résultat affiché : une ligne par variante corrigée
select * from pg_temp.bilan order by nb_albums_modifies desc, variante;
