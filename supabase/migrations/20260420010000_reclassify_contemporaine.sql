-- ============================================================
-- Migration : 2026-04-20 · reclassify_contemporaine
-- ============================================================
-- Approche conservatrice : on ne touche QUE les compositeurs
-- actuellement classés « Contemporaine ». On les répartit selon
-- leur année de naissance :
--
--   born  < 1910          → 'Moderne'         (étaient mal classés)
--   born  1910-1959       → 'Après-guerre'    (nouveau bucket)
--   born >= 1960          → 'Création vivante' (nouveau bucket)
--   born  IS NULL         → reste 'Contemporaine' (à reclasser à la main)
--
-- Toutes les autres périodes restent intactes : aucun jugement
-- éditorial préexistant (Moderne par style, Romantique tardif…)
-- n'est écrasé.
--
-- Idempotente : rejouer reproduit les mêmes affectations.
-- ============================================================

BEGIN;

UPDATE compositeurs
SET period = CASE
  WHEN born <  1910              THEN 'Moderne'
  WHEN born BETWEEN 1910 AND 1959 THEN 'Après-guerre'
  WHEN born >= 1960               THEN 'Création vivante'
  ELSE period   -- born IS NULL → reste 'Contemporaine'
END
WHERE period = 'Contemporaine';

COMMIT;


-- ============================================================
-- VÉRIFICATIONS post-migration
-- ============================================================

-- 1. Ventilation globale par période (contrôle rapide) :
-- SELECT period, COUNT(*) AS n
-- FROM compositeurs
-- GROUP BY period
-- ORDER BY n DESC;

-- 2. TODO — compositeurs encore « Contemporaine » faute de born :
--    À vérifier manuellement pour leur attribuer la bonne période.
-- SELECT id, name, nationality, died
-- FROM compositeurs
-- WHERE period = 'Contemporaine' AND born IS NULL
-- ORDER BY name;
