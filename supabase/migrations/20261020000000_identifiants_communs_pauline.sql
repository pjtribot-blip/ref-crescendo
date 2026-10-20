-- ============================================================
-- Migration : 2026-10-20 · identifiants_communs_pauline
-- ============================================================
-- 1. Aligne 4 identifiants de compositeurs sur ceux de Pauline, qui
--    appelle l'API /api/compositeurs/[id] de Phono avec ses propres
--    identifiants (le bloc « Disques critiqués » restait vide pour Bach).
--    Les anciennes adresses redirigent vers les nouvelles
--    (alias dans lib/compositeurs.js).
-- 2. Fusionne la fiche en double « Marie de Grandval » dans
--    « Clémence de Grandval » (même compositrice).
--
-- Idempotente : rejouée, elle ne trouve plus rien à modifier.
-- ============================================================

begin;

update compositeurs set id = 'johann-sebastian-bach' where id = 'jean-sebastien-bach';
update compositeurs set id = 'herrade-de-landsberg'  where id = 'hildegard-de-bingen-abbesse';
update compositeurs set id = 'amalie-de-saxe'        where id = 'amelie-juliane';
update compositeurs set id = 'coriun-aharonian'      where id = 'corian-aharonian';

update albums
set composers = array(
  select t.x
  from unnest(array_replace(composers, 'Marie de Grandval', 'Clémence de Grandval')) with ordinality as t(x, o)
  group by t.x
  order by min(t.o))
where 'Marie de Grandval' = any(composers);
delete from compositeurs where id = 'marie-grandval';

-- 3. « Felix Mendelssohn Bartholdy » (14 albums, 5 graphies) → « Felix Mendelssohn »
update albums
set composers = array(
  select m.x
  from unnest(composers) with ordinality as t(n, o),
       lateral (select case
         when lower(regexp_replace(replace(t.n, chr(160), ' '), '[\s-]+', ' ', 'g'))
              in ('felix mendelssohn bartholdy', 'felix menfdelssohn bartholdy')
         then 'Felix Mendelssohn' else t.n end as x) m
  group by m.x
  order by min(t.o))
where exists (select 1 from unnest(composers) n where n ilike '%bartholdy%');

commit;
