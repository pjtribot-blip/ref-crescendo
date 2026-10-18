-- ============================================================
-- Diagnostic (LECTURE SEULE) · variantes de noms de compositeurs
-- ============================================================
-- À lancer AVANT la migration 20261010000000_normalize_composer_names.sql.
-- Ce script ne modifie rien.
--
-- Liste TOUS les noms présents dans albums.composers qui ne
-- correspondent exactement à aucun compositeurs.name, avec le nombre
-- d'albums concernés et le ou les compositeurs candidats.
-- Le calcul est fait dans la base (unnest), donc sans la limite des
-- 1000 lignes de l'API Supabase.
--
-- Règles de rapprochement (insensibles à la casse et aux accents) :
--   · même nom          « LUDWIG VAN BEETHOVEN » → « Ludwig van Beethoven »
--   · fin du nom        « van Beethoven »        → « Ludwig van Beethoven »
--   · 1re lettre perdue « ēteris Vasks »         → « Pēteris Vasks »
--
-- Colonne « action » :
--   sera corrigé          un seul candidat : la migration le corrigera
--   ambigu — à trancher   plusieurs candidats (ex. « Bach ») : rien n'est
--                         modifié sans décision de la rédaction
--   inconnu — inchangé    aucun candidat (compositeur absent de la table
--                         ou bruit d'extraction) : rien n'est modifié
-- ============================================================

begin;

-- Garde-fou : la suite suppose que composers est un tableau de texte (text[])
do $$
begin
  if to_regclass('public.albums') is null or to_regclass('public.compositeurs') is null then
    raise exception 'Tables albums / compositeurs introuvables : vous n''êtes sans doute pas dans le projet Supabase du site Phono.';
  end if;
  if (select udt_name from information_schema.columns
      where table_schema = 'public' and table_name = 'albums' and column_name = 'composers') <> '_text' then
    raise exception 'albums.composers n''est pas de type text[] : ne pas lancer la migration, prévenir le développeur.';
  end if;
end $$;

rollback;

-- Le tableau ci-dessous est la seule chose affichée par l'éditeur.
-- « plie » = nom en minuscules, sans accents ni espaces superflus.
with noms as (
  select u.nom, count(*) as nb_albums
  from albums a, unnest(a.composers) as u(nom)
  where u.nom is not null
  group by u.nom
),
orphelins as (
  select n.nom, n.nb_albums,
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
select
  o.nom                                              as variante,
  o.nb_albums,
  count(c.candidat)                                  as nb_candidats,
  case count(c.candidat)
    when 1 then 'sera corrigé'
    when 0 then 'inconnu — inchangé'
    else 'ambigu — à trancher'
  end                                                as action,
  string_agg(c.candidat, ' | ' order by c.candidat)  as candidats
from orphelins o
left join candidats c on c.nom = o.nom
group by o.nom, o.nb_albums
order by (count(c.candidat) = 0), (count(c.candidat) = 1) desc, o.nb_albums desc, o.nom;
