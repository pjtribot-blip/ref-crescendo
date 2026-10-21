-- ============================================================
-- Base ICMA (projet Supabase iymjbxvtpdnclyijdzcx) · nettoyage 2026-10-21
-- ============================================================
-- Exécuté le 2026-10-21 dans le projet ICMA. Résultat : 798 personnes,
-- 88 labels, 395 prix.
--
-- 1. Fusionne 28 fiches de personnes en double (graphies sans accent,
--    variantes, compositeurs réduits au nom de famille), vérifiées une par
--    une d'après le disque primé concerné (ancien id → id conservé).
-- 2. Supprime les personnes et labels reliés à aucun prix.
--
-- Sans table temporaire : l'éditeur SQL de Supabase valide chaque
-- instruction séparément. Rejouable sans effet.
-- ============================================================

delete from icma_awards_composers x
using (values (9,511),(512,11),(699,131),(1195,134),(1204,212),(1209,215),(1169,133),(1341,301),(1127,150),(1128,151),(1129,152),(1130,153),(1131,154),(1135,158),(1138,161),(1139,162),(1140,163),(1165,104),(1189,321),(1190,133),(1191,3),(1192,132),(1193,484),(1328,15),(1329,45),(1330,92),(1348,864),(1351,865)) as f(ancien, garde)
where x.person_id = f.ancien
  and exists (select 1 from icma_awards_composers y where y.award_id = x.award_id and y.person_id = f.garde);

update icma_awards_composers x set person_id = f.garde
from (values (9,511),(512,11),(699,131),(1195,134),(1204,212),(1209,215),(1169,133),(1341,301),(1127,150),(1128,151),(1129,152),(1130,153),(1131,154),(1135,158),(1138,161),(1139,162),(1140,163),(1165,104),(1189,321),(1190,133),(1191,3),(1192,132),(1193,484),(1328,15),(1329,45),(1330,92),(1348,864),(1351,865)) as f(ancien, garde)
where x.person_id = f.ancien;

delete from icma_awards_performers x
using (values (9,511),(512,11),(699,131),(1195,134),(1204,212),(1209,215),(1169,133),(1341,301),(1127,150),(1128,151),(1129,152),(1130,153),(1131,154),(1135,158),(1138,161),(1139,162),(1140,163),(1165,104),(1189,321),(1190,133),(1191,3),(1192,132),(1193,484),(1328,15),(1329,45),(1330,92),(1348,864),(1351,865)) as f(ancien, garde)
where x.person_id = f.ancien
  and exists (select 1 from icma_awards_performers y where y.award_id = x.award_id and y.person_id = f.garde and y.role is not distinct from x.role);

update icma_awards_performers x set person_id = f.garde
from (values (9,511),(512,11),(699,131),(1195,134),(1204,212),(1209,215),(1169,133),(1341,301),(1127,150),(1128,151),(1129,152),(1130,153),(1131,154),(1135,158),(1138,161),(1139,162),(1140,163),(1165,104),(1189,321),(1190,133),(1191,3),(1192,132),(1193,484),(1328,15),(1329,45),(1330,92),(1348,864),(1351,865)) as f(ancien, garde)
where x.person_id = f.ancien;

delete from icma_persons p
where not exists (select 1 from icma_awards_composers c where c.person_id = p.id)
  and not exists (select 1 from icma_awards_performers r where r.person_id = p.id);

delete from icma_labels l
where not exists (select 1 from icma_awards a where a.label_id = l.id);

select
  (select count(*) from icma_persons) as personnes,
  (select count(*) from icma_labels)  as labels,
  (select count(*) from icma_awards)  as prix;
