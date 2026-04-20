-- ============================================================
-- Migration : 2026-04-20 · rename_creation_vivante
-- ============================================================
-- Renomme le bucket « Création vivante » en « Création contemporaine »
-- pour une étiquette plus institutionnelle, lisible par un lecteur non
-- averti et cohérente avec le vocabulaire des autres périodes.
--
-- Impact : UPDATE sur les lignes dont period = 'Création vivante' issues
-- de la migration 20260420010000_reclassify_contemporaine.
--
-- Idempotente : rejouer ne fait rien après la première exécution.
-- ============================================================

BEGIN;

UPDATE compositeurs
SET period = 'Création contemporaine'
WHERE period = 'Création vivante';

COMMIT;


-- Vérification post-migration — aucune ligne attendue :
-- SELECT COUNT(*) FROM compositeurs WHERE period = 'Création vivante';
