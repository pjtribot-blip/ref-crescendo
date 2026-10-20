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

commit;
