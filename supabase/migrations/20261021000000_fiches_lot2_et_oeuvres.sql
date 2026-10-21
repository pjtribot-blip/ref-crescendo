-- ============================================================
-- Migration : 2026-10-21 · fiches_lot2_et_oeuvres
-- ============================================================
-- 1. Crée 20 nouvelles fiches (compositeurs suivants les plus cités sans fiche).
-- 2. Y rattache leurs albums (mêmes règles que le lot 1 + quelques graphies).
-- 3. Remplit « Œuvres majeures » (key_works) des 40 fiches créées les
--    20 et 21 octobre, seulement si le champ est vide. Fonctionne que
--    key_works soit text[] ou jsonb.
--
-- Chaque instruction est autonome (l'éditeur SQL de Supabase valide les
-- instructions une par une). Rejouable sans effet.
-- ============================================================

insert into compositeurs (id, name, born, died, nationality, period, familiarity, description) values
  ('francesco-cavalli', 'Francesco Cavalli', 1602, 1676, 'Italienne', 'Baroque', 'connu',
   'Élève de Monteverdi à Saint-Marc de Venise, Cavalli fut le compositeur d’opéras le plus joué de son temps, de La Calisto à Ercole amante.'),
  ('giuseppe-tartini', 'Giuseppe Tartini', 1692, 1770, 'Italienne', 'Baroque', 'connu',
   'Violoniste virtuose et théoricien installé à Padoue, Tartini a laissé plus d’une centaine de concertos et la célèbre sonate « Le Trille du diable ».'),
  ('andre-jolivet', 'André Jolivet', 1905, 1974, 'Française', 'Moderne', 'connu',
   'Cofondateur du groupe Jeune France avec Messiaen, Jolivet a cherché à rendre à la musique une dimension rituelle et incantatoire.'),
  ('carl-friedrich-abel', 'Carl Friedrich Abel', 1723, 1787, 'Allemande', 'Classique', 'connu',
   'Dernier grand virtuose de la viole de gambe, Abel organisa à Londres, avec Johann Christian Bach, les célèbres concerts Bach-Abel.'),
  ('florent-schmitt', 'Florent Schmitt', 1870, 1958, 'Française', 'Post-romantique', 'connu',
   'Prix de Rome et critique redouté, Schmitt a signé avec La Tragédie de Salomé et le Psaume XLVII des partitions d’une puissance orchestrale saisissante.'),
  ('michael-praetorius', 'Michael Praetorius', 1571, 1621, 'Allemande', 'Renaissance', 'connu',
   'Compositeur et théoricien luthérien, Praetorius a laissé un immense corpus de musique sacrée et le recueil de danses Terpsichore.'),
  ('george-enescu', 'George Enescu', 1881, 1955, 'Roumaine', 'Post-romantique', 'connu',
   'Violoniste, pianiste, chef et pédagogue, Enescu est la grande figure de la musique roumaine, des Rhapsodies roumaines à son opéra Œdipe.'),
  ('kalevi-aho', 'Kalevi Aho', 1949, null, 'Finlandaise', 'Contemporaine', 'connu',
   'Compositeur au catalogue foisonnant, Aho a écrit de nombreuses symphonies et plus de quarante concertos, en grande partie enregistrés par le label BIS.'),
  ('edouard-lalo', 'Édouard Lalo', 1823, 1892, 'Française', 'Romantique', 'connu',
   'Violoniste et altiste avant d’être reconnu comme compositeur, Lalo doit sa célébrité à la Symphonie espagnole et à l’opéra Le Roi d’Ys.'),
  ('frederick-delius', 'Frederick Delius', 1862, 1934, 'Britannique', 'Post-romantique', 'connu',
   'Né à Bradford et installé à Grez-sur-Loing, Delius a développé une écriture orchestrale rêveuse et chatoyante, proche de l’impressionnisme.'),
  ('gustav-holst', 'Gustav Holst', 1874, 1934, 'Britannique', 'Post-romantique', 'connu',
   'Auteur des Planètes, Holst s’est aussi passionné pour le chant populaire anglais et pour la littérature sanskrite.'),
  ('jan-pieterszoon-sweelinck', 'Jan Pieterszoon Sweelinck', 1562, 1621, 'Néerlandaise', 'Renaissance', 'connu',
   'Organiste de l’Oude Kerk d’Amsterdam, Sweelinck fut le maître de toute une génération d’organistes allemands et une figure clé du répertoire pour clavier.'),
  ('johann-david-heinichen', 'Johann David Heinichen', 1683, 1729, 'Allemande', 'Baroque', 'connu',
   'Maître de chapelle à la cour de Dresde, Heinichen a écrit pour son orchestre virtuose des concertos colorés et une abondante musique sacrée.'),
  ('henri-duparc', 'Henri Duparc', 1848, 1933, 'Française', 'Romantique', 'connu',
   'Élève de Franck, Duparc n’a laissé qu’une vingtaine d’œuvres, dont des mélodies qui comptent parmi les sommets du genre.'),
  ('josef-suk', 'Josef Suk', 1874, 1935, 'Tchèque', 'Post-romantique', 'connu',
   'Élève et gendre de Dvořák, Suk a marqué la musique tchèque par sa Symphonie Asraël, écrite après la mort de son maître puis de son épouse.'),
  ('leo-delibes', 'Léo Delibes', 1836, 1891, 'Française', 'Romantique', 'connu',
   'Maître du ballet avec Coppélia et Sylvia, Delibes est aussi l’auteur de l’opéra Lakmé et de son célèbre Duo des fleurs.'),
  ('kurt-weill', 'Kurt Weill', 1900, 1950, 'Allemande', 'Moderne', 'connu',
   'Associé à Bertolt Brecht pour L’Opéra de quat’sous et Mahagonny, Weill poursuivit sa carrière à Broadway après son exil.'),
  ('niccolo-paganini', 'Niccolò Paganini', 1782, 1840, 'Italienne', 'Romantique', 'connu',
   'Violoniste légendaire, Paganini a repoussé les limites techniques de son instrument, notamment dans ses 24 Caprices et ses concertos.'),
  ('johann-christian-bach', 'Johann Christian Bach', 1735, 1782, 'Allemande', 'Classique', 'connu',
   'Benjamin des fils de Johann Sebastian, surnommé le « Bach de Londres », Johann Christian a influencé le jeune Mozart par son style galant.'),
  ('antoine-forqueray', 'Antoine Forqueray', 1672, 1745, 'Française', 'Baroque', 'connu',
   'Virtuose de la viole de gambe à la cour de Louis XIV, rival de Marin Marais, Forqueray vit ses pièces publiées par son fils Jean-Baptiste.')
on conflict (id) do nothing;

update albums a
set composers = n.composers
from (
  with noms as (
    select distinct u.nom from albums, unnest(composers) as u(nom) where u.nom is not null
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
    select c.id, c.name,
      regexp_replace(translate(lower(btrim(replace(c.name, chr(160), ' '))),
        'àáâãäåāăąçćčďèéêëēęěìíîïīñńňòóôõöøōőřśšşťùúûüūůűýÿźżžł',
        'aaaaaaaaacccdeeeeeeeiiiiinnnoooooooorssstuuuuuuuyyzzzl'), '\s+', ' ', 'g') as plie
    from compositeurs c
  ),
  candidats as (
    select o.nom, o.plie, min(r.name) as cible, min(r.id) as cible_id, count(distinct r.name) as nb
    from orphelins o
    join referentiel r
      on r.plie = o.plie
      or r.plie like '% ' || o.plie
      or (length(o.plie) >= 6 and r.plie like '_' || o.plie)
    group by o.nom, o.plie
  ),
  k as (
    select nom as variante, cible from candidats
    where nb = 1
      and cible_id in ('francesco-cavalli', 'giuseppe-tartini', 'andre-jolivet', 'carl-friedrich-abel',
        'florent-schmitt', 'michael-praetorius', 'george-enescu', 'kalevi-aho', 'edouard-lalo',
        'frederick-delius', 'gustav-holst', 'jan-pieterszoon-sweelinck', 'johann-david-heinichen',
        'henri-duparc', 'josef-suk', 'leo-delibes', 'kurt-weill', 'niccolo-paganini',
        'johann-christian-bach', 'antoine-forqueray')
    union
    select o.nom, m.cible
    from orphelins o
    join (values ('georges enesco', 'George Enescu'), ('georges enescu', 'George Enescu'),
                 ('george enesco', 'George Enescu'), ('nicolo paganini', 'Niccolò Paganini'))
         as m(plie, cible) on m.plie = o.plie
  )
  select a2.id,
    array(
      select x.nom from (
        select coalesce(k.cible, u.nom) as nom, min(u.ord) as ord
        from unnest(a2.composers) with ordinality as u(nom, ord)
        left join k on k.variante = u.nom
        group by coalesce(k.cible, u.nom)
      ) x
      order by x.ord
    ) as composers
  from albums a2
  where a2.composers && (select array_agg(variante) from k)
) n
where a.id = n.id;

do $$
declare
  t text;
  oeuvres text := $v$ values
    ('jules-massenet', '["Manon", "Werther", "Thaïs"]'),
    ('georges-bizet', '["Carmen", "Les Pêcheurs de perles", "L’Arlésienne"]'),
    ('reynaldo-hahn', '["Ciboulette", "Si mes vers avaient des ailes", "Le Bal de Béatrice d’Este"]'),
    ('charles-gounod', '["Faust", "Roméo et Juliette", "Messe solennelle de sainte Cécile"]'),
    ('carl-maria-von-weber', '["Der Freischütz", "Oberon", "Concertos pour clarinette"]'),
    ('girolamo-frescobaldi', '["Fiori musicali", "Toccate e partite", "Capricci"]'),
    ('ernest-chausson', '["Poème pour violon et orchestre", "Symphonie en si bémol majeur", "Concert pour piano, violon et quatuor à cordes"]'),
    ('louis-couperin', '["Préludes non mesurés", "Tombeau de M. de Blancrocher", "Pièces de clavecin"]'),
    ('max-reger', '["Variations et fugue sur un thème de Mozart", "Fantaisie et fugue sur B-A-C-H", "Variations Hiller"]'),
    ('erich-wolfgang-korngold', '["Die tote Stadt", "Concerto pour violon", "Les Aventures de Robin des Bois"]'),
    ('louis-vierne', '["Symphonies pour orgue", "Pièces de fantaisie", "Messe solennelle"]'),
    ('jacques-ibert', '["Escales", "Divertissement", "Concertino da camera"]'),
    ('ottorino-respighi', '["Fontane di Roma", "Pini di Roma", "Antiche danze ed arie"]'),
    ('ernest-bloch', '["Schelomo", "Baal Shem", "Avodath Hakodesh"]'),
    ('jacques-offenbach', '["Les Contes d’Hoffmann", "Orphée aux enfers", "La Belle Hélène"]'),
    ('maurice-durufle', '["Requiem", "Quatre motets sur des thèmes grégoriens", "Prélude et fugue sur le nom d’Alain"]'),
    ('erik-satie', '["Gymnopédies", "Gnossiennes", "Parade"]'),
    ('paul-dukas', '["L’Apprenti sorcier", "Ariane et Barbe-Bleue", "La Péri"]'),
    ('nicola-porpora', '["Polifemo", "Germanico in Germania", "Salve Regina"]'),
    ('wilhelm-friedemann-bach', '["Fantaisies pour clavier", "Polonaises", "Adagio et fugue en ré mineur"]'),
    ('francesco-cavalli', '["La Calisto", "Giasone", "Ercole amante"]'),
    ('giuseppe-tartini', '["Sonate « Le Trille du diable »", "Concertos pour violon", "L’Arte dell’arco"]'),
    ('andre-jolivet', '["Mana", "Chant de Linos", "Concerto pour ondes Martenot"]'),
    ('carl-friedrich-abel', '["Pièces pour viole de gambe seule", "Symphonies op. 7", "Sonates pour viole de gambe"]'),
    ('florent-schmitt', '["La Tragédie de Salomé", "Psaume XLVII", "Quintette avec piano"]'),
    ('michael-praetorius', '["Terpsichore", "Musae Sioniae", "Syntagma musicum"]'),
    ('george-enescu', '["Rhapsodies roumaines", "Œdipe", "Sonate pour violon et piano no 3"]'),
    ('kalevi-aho', '["Symphonies", "Concertos", "Musique de chambre"]'),
    ('edouard-lalo', '["Symphonie espagnole", "Le Roi d’Ys", "Concerto pour violoncelle"]'),
    ('frederick-delius', '["On Hearing the First Cuckoo in Spring", "A Village Romeo and Juliet", "Sea Drift"]'),
    ('gustav-holst', '["Les Planètes", "St Paul’s Suite", "Savitri"]'),
    ('jan-pieterszoon-sweelinck', '["Variations sur « Mein junges Leben hat ein End »", "Fantaisie chromatique", "Psaumes de David"]'),
    ('johann-david-heinichen', '["Concertos de Dresde", "Messes", "Der General-Bass in der Composition"]'),
    ('henri-duparc', '["L’Invitation au voyage", "Phidylé", "La Vie antérieure"]'),
    ('josef-suk', '["Symphonie Asraël", "Sérénade pour cordes", "Un conte d’été"]'),
    ('leo-delibes', '["Coppélia", "Sylvia", "Lakmé"]'),
    ('kurt-weill', '["L’Opéra de quat’sous", "Grandeur et décadence de la ville de Mahagonny", "Les Sept Péchés capitaux"]'),
    ('niccolo-paganini', '["24 Caprices", "Concertos pour violon", "La Campanella"]'),
    ('johann-christian-bach', '["Symphonies", "Concertos pour clavier op. 7", "Temistocle"]'),
    ('antoine-forqueray', '["Pièces de viole", "Pièces de clavecin", "La Rameau"]')
  $v$;
begin
  select udt_name into t from information_schema.columns
  where table_schema = 'public' and table_name = 'compositeurs' and column_name = 'key_works';
  if t = '_text' then
    execute format(
      'update compositeurs c set key_works = array(select jsonb_array_elements_text(v.w::jsonb))
       from (%s) as v(id, w)
       where c.id = v.id and (c.key_works is null or cardinality(c.key_works) = 0)', oeuvres);
  elsif t in ('jsonb', 'json') then
    execute format(
      'update compositeurs c set key_works = v.w::%s
       from (%s) as v(id, w)
       where c.id = v.id and (c.key_works is null or jsonb_array_length(c.key_works::jsonb) = 0)', t, oeuvres);
  else
    raise notice 'Colonne key_works absente ou de type inattendu (%) : œuvres non remplies.', t;
  end if;
end $$;

select c.name as compositeur, count(a.id) as albums
from compositeurs c
left join albums a on c.name = any(a.composers)
where c.id in ('francesco-cavalli', 'giuseppe-tartini', 'andre-jolivet', 'carl-friedrich-abel',
  'florent-schmitt', 'michael-praetorius', 'george-enescu', 'kalevi-aho', 'edouard-lalo',
  'frederick-delius', 'gustav-holst', 'jan-pieterszoon-sweelinck', 'johann-david-heinichen',
  'henri-duparc', 'josef-suk', 'leo-delibes', 'kurt-weill', 'niccolo-paganini',
  'johann-christian-bach', 'antoine-forqueray')
group by c.name
order by albums desc;
