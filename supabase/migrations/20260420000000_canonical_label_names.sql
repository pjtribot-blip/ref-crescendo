-- ============================================================
-- Migration : 2026-04-20 · canonical_label_names
-- ============================================================
-- Canonisation des graphies de labels discographiques : on passe les
-- formes abrégées / historiques vers la forme officielle complète.
--
-- 1. « BIS »    → « BIS Records »       (nom légal de BIS Records AB)
-- 2. « DG »     → « Deutsche Grammophon »
-- 3. « Alpha »  → « Alpha Classics »    (nom officiel sous Outhere)
--
-- Idempotente : chaque WHERE matche uniquement l'ancienne graphie ;
-- rejouer la migration n'a aucun effet.
-- ============================================================

BEGIN;

UPDATE albums SET label = 'BIS Records'        WHERE label = 'BIS';
UPDATE albums SET label = 'Deutsche Grammophon' WHERE label = 'DG';
UPDATE albums SET label = 'Alpha Classics'      WHERE label = 'Alpha';

COMMIT;


-- Vérification post-migration — aucune ligne attendue :
-- SELECT label, COUNT(*) AS n
-- FROM albums
-- WHERE label IN ('BIS', 'DG', 'Alpha')
-- GROUP BY label;
