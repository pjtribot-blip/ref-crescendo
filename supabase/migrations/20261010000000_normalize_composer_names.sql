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
-- insert into exclusions values
--   ('Haydn');                 -- exemple : peut désigner Michael Haydn

-- ------------------------------------------------------------
-- B. Choix manuels (cas « ambigu — à trancher » du diagnostic).
--    La cible doit être écrite EXACTEMENT comme dans compositeurs.name.
-- ------------------------------------------------------------
create temp table choix_manuels (variante text primary key, cible text not null) on commit drop;
-- insert into choix_manuels values
--   ('Schumann', 'Robert Schumann');

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
where nom not in (select variante from exclusions)
group by nom
having count(*) = 1;

insert into correspondances (variante, cible)
select variante, cible from choix_manuels
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
