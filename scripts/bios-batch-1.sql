-- ============================================================
-- Phono.Crescendo — Bios enrichies · batch 1
-- ============================================================
-- Colonnes supposées déjà présentes sur `compositeurs` :
--   bio_enrichie        TEXT
--   bio_generated_at    TIMESTAMPTZ
-- Pas de contrainte UNIQUE sur `name` : on utilise INSERT ... SELECT ... WHERE NOT EXISTS.
-- Les chaînes sont dollar-quotées ($$…$$) pour éviter toute fuite d'apostrophe typographique.
--
-- Vérifie la forme du champ `id` (ici : slug kebab-case). Si ton schéma utilise
-- un uuid auto, retire le premier argument des INSERT ci-dessous.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Elsa Barraine (1910–1999, française)
--    Prix Bernadette Beyne et Michelle Debra 2025 — Symphonies nos 1 & 2,
--    WDR Sinfonieorchester / Elena Schwarz (CPO).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'elsa-barraine', 'Elsa Barraine', 1910, 1999, 'française', 'Moderne', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Elsa Barraine');

UPDATE compositeurs
SET
  bio_enrichie = $$Elsa Barraine occupe dans la musique française du XXe siècle une place singulière, à la croisée du grand métier symphonique hérité du Prix de Rome et d'une conscience politique qui traverse toute son œuvre. Figure longtemps marginalisée des histoires officielles, elle s'impose aujourd'hui comme l'une des voix les plus fortes d'une génération que l'on redécouvre enfin — celle des femmes compositeurs de l'entre-deux-guerres, trop vite classées sous l'étiquette réductrice du « sillage Boulanger ».

Née à Paris en 1910 dans une famille de musiciens — son père était violoncelliste à l'Opéra —, elle entre très jeune au Conservatoire, où elle étudie l'harmonie avec Jean Gallon et la composition dans la classe de Paul Dukas. Elle y remporte le Prix de Rome en 1929, à dix-neuf ans, avec la cantate La Vierge guerrière — distinction qu'une femme n'avait plus reçue depuis Lili Boulanger. La formation qu'elle reçoit s'ancre dans la grande tradition française — Debussy, Roussel, Dukas — mais s'ouvre très tôt à l'exemple de la Seconde école de Vienne et, plus encore, à celui de Chostakovitch, dont elle reconnaît la stature quand peu en France lui prêtent une écoute attentive. Engagée avant-guerre dans la Fédération musicale populaire aux côtés d'Honegger, de Milhaud et de Koechlin, résistante active au sein du Front national des musiciens durant l'Occupation, elle dirigera ensuite pendant deux décennies le service de chant à la Radiodiffusion française, formant plusieurs générations d'interprètes avant de professer à son tour au Conservatoire de Paris.

Son catalogue, relativement resserré — une soixantaine d'opus —, témoigne d'une exigence quasi jansénienne. Les deux Symphonies (1931, 1938) en constituent le cœur : la première, puissamment orchestrée, affiche une clarté néoclassique tendue d'intensité rythmique, tandis que la seconde, plus âpre, plus dense, s'inscrit dans la lignée des grandes symphonies politiques des années trente — on pense au Chostakovitch de la Cinquième. Autour de ces deux sommets orchestraux gravitent un Quatuor, une musique de chambre raffinée, des mélodies (notamment sur Aragon) et une série de partitions pour le cinéma où perce un sens aigu de la couleur instrumentale.

C'est à cette stature retrouvée que Crescendo Magazine a rendu hommage en 2025 en décernant à l'enregistrement des deux Symphonies par Elena Schwarz à la tête du WDR Sinfonieorchester (CPO) le tout premier Prix Bernadette Beyne et Michelle Debra — distinction créée pour saluer les chantiers éditoriaux qui modifient durablement notre écoute du répertoire. Pour prolonger la découverte, on ne saurait trop recommander les mélodies sur Aragon et la Musique rituelle pour orgue, témoignages d'un univers sonore à la fois très français et résolument libre.$$,
  bio_generated_at = now()
WHERE name = 'Elsa Barraine';


-- ------------------------------------------------------------
-- 2. Amy Beach          — en attente de la distinction complète
-- 3. Johanna Senfter    — en attente (nationalité tronquée dans la demande)
-- 4. …
-- 5. …
-- 6. …
-- 7. …
-- 8. …
-- 9. …
-- 10. …
-- ------------------------------------------------------------
-- Le reste du batch sera généré dès réception de la liste complète :
--   - nom, dates, nationalité, période, familiarity
--   - distinction Crescendo précise (Millésime ou Prix, année, interprète, label)
-- Même gabarit : INSERT ... SELECT ... WHERE NOT EXISTS; puis UPDATE SET bio_enrichie/bio_generated_at.
