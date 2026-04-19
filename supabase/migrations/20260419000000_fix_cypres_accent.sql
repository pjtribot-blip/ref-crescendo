-- ============================================================
-- Migration : 2026-04-19 · fix_cypres_accent
-- ============================================================
-- Correction d'un accent perdu au scraping WordPress : les albums
-- du label belge « Cyprès » (cypres.be, accent grave sur le e)
-- ont été enregistrés en base sous la forme « Cypres » (sans
-- accent). Cette migration remet l'orthographe officielle.
--
-- Label concerné     : Cyprès (Liège, Belgique)
-- Site officiel      : https://www.cypres.be
-- Lignes attendues   : 3 albums (selon grep précédent)
-- Idempotente        : oui (WHERE ne matche que « Cypres » sans
--                      accent, donc la rejouer n'a aucun effet)
-- ============================================================

UPDATE albums
SET label = 'Cyprès'
WHERE label = 'Cypres';


-- Vérification post-migration :
-- SELECT label, COUNT(*) AS n
-- FROM albums
-- WHERE label ILIKE '%cypr%'
-- GROUP BY label;
--
-- Attendu : une seule ligne « Cyprès » avec n = 3, plus aucun « Cypres ».
