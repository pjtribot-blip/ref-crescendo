-- ============================================================
-- Migration : 2026-10-10 · compositeurs_slugs_sans_accent
-- ============================================================
-- Les fiches dont l'identifiant (compositeurs.id, utilisé dans l'URL)
-- contient un accent renvoyaient une erreur 404 :
--   /compositeurs/jean-sébastien-bach   /compositeurs/cécile-chaminade
-- Cause : Next.js transmet à la page l'identifiant encore encodé
-- (« jean-s%C3%A9bastien-bach »), qui ne correspond à rien en base.
-- Le code est corrigé (lib/compositeurs.js) ; cette migration passe en
-- plus les identifiants en ASCII pour avoir des adresses simples.
--
-- Les anciennes adresses restent valables : le site les redirige
-- (redirection permanente 308) vers la nouvelle, et l'API
-- /api/compositeurs/[id] (utilisée par Pauline) accepte les deux.
--
-- Identifiants accentués relevés dans le sitemap le 2026-10-10 (2 sur 613).
-- Idempotente : rejouée, elle ne trouve plus rien à renommer.
-- ============================================================

begin;

-- Garde-fou : si une autre table référence compositeurs.id sans
-- « ON UPDATE CASCADE », on s'arrête (rien n'est modifié).
do $$
declare dependance text;
begin
  select conrelid::regclass || ' (' || conname || ')' into dependance
  from pg_constraint
  where contype = 'f'
    and confrelid = 'public.compositeurs'::regclass
    and confupdtype <> 'c'
  limit 1;
  if dependance is not null then
    raise exception 'La table % référence compositeurs.id : migration interrompue, prévenir le développeur.', dependance;
  end if;
end $$;

update compositeurs set id = 'jean-sebastien-bach'
where id = 'jean-sébastien-bach'
  and not exists (select 1 from compositeurs where id = 'jean-sebastien-bach');

update compositeurs set id = 'cecile-chaminade'
where id = 'cécile-chaminade'
  and not exists (select 1 from compositeurs where id = 'cecile-chaminade');

commit;

-- Résultat affiché : identifiants encore hors [a-z0-9-] (attendu : aucune ligne)
select id, name from compositeurs where id !~ '^[a-z0-9-]+$' order by id;
