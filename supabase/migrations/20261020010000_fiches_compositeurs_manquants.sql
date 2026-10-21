-- ============================================================
-- Migration : 2026-10-20 · fiches_compositeurs_manquants
-- ============================================================
-- Crée les fiches des 20 compositeurs les plus cités dans albums.composers
-- qui n'avaient pas de fiche, puis y rattache leurs albums (toutes graphies :
-- casse, accents, « von Weber », « Louis COUPERIN »…), seulement quand le nom
-- ne peut désigner qu'un seul compositeur de la table.
-- Les œuvres majeures (key_works) et la notice enrichie restent à compléter.
--
-- Idempotente : rejouée, elle ne recrée rien et ne trouve plus rien à ranger.
-- ============================================================

begin;

insert into compositeurs (id, name, born, died, nationality, period, familiarity, description) values
  ('jules-massenet', 'Jules Massenet', 1842, 1912, 'Française', 'Romantique', 'connu',
   'Maître de l''opéra français de la fin du XIXe siècle, Massenet a donné à la scène lyrique Manon, Werther et Thaïs, portées par un sens aigu de la mélodie et du théâtre.'),
  ('georges-bizet', 'Georges Bizet', 1838, 1875, 'Française', 'Romantique', 'connu',
   'Mort à trente-six ans, quelques mois après la création de Carmen, Bizet a laissé avec cet opéra l''un des ouvrages les plus joués du répertoire lyrique.'),
  ('reynaldo-hahn', 'Reynaldo Hahn', 1874, 1947, 'Française', 'Post-romantique', 'connu',
   'Né à Caracas et formé à Paris, Hahn fut un mélodiste raffiné, chef d''orchestre et figure des salons de la Belle Époque, auteur de mélodies et d''opérettes comme Ciboulette.'),
  ('charles-gounod', 'Charles Gounod', 1818, 1893, 'Française', 'Romantique', 'connu',
   'Auteur de Faust et de Roméo et Juliette, Gounod a marqué l''opéra et la musique religieuse française du XIXe siècle par la souplesse de son écriture vocale.'),
  ('carl-maria-von-weber', 'Carl Maria von Weber', 1786, 1826, 'Allemande', 'Romantique', 'connu',
   'Avec Der Freischütz, Weber a fondé l''opéra romantique allemand ; il a aussi beaucoup écrit pour la clarinette et le piano.'),
  ('girolamo-frescobaldi', 'Girolamo Frescobaldi', 1583, 1643, 'Italienne', 'Baroque', 'connu',
   'Organiste de Saint-Pierre de Rome, Frescobaldi est l''un des grands maîtres du clavier du premier baroque, auteur des Fiori musicali et de recueils de toccatas.'),
  ('ernest-chausson', 'Ernest Chausson', 1855, 1899, 'Française', 'Romantique', 'connu',
   'Disciple de Franck, Chausson a laissé une œuvre brève mais intense, dont le Poème pour violon et orchestre et la Symphonie en si bémol.'),
  ('louis-couperin', 'Louis Couperin', 1626, 1661, 'Française', 'Baroque', 'connu',
   'Oncle de François Couperin, claveciniste et organiste à Saint-Gervais, Louis Couperin est célèbre pour ses préludes non mesurés pour clavecin.'),
  ('max-reger', 'Max Reger', 1873, 1916, 'Allemande', 'Post-romantique', 'connu',
   'Héritier de Bach et de Brahms, Reger a beaucoup écrit pour l''orgue et la musique de chambre, dans une écriture contrapuntique dense et chromatique.'),
  ('erich-wolfgang-korngold', 'Erich Wolfgang Korngold', 1897, 1957, 'Autrichienne', 'Post-romantique', 'connu',
   'Enfant prodige viennois, auteur de l''opéra Die tote Stadt, Korngold a ensuite donné à Hollywood quelques-unes de ses plus grandes musiques de film.'),
  ('louis-vierne', 'Louis Vierne', 1870, 1937, 'Française', 'Post-romantique', 'connu',
   'Organiste titulaire de Notre-Dame de Paris pendant près de quarante ans, Vierne est l''auteur de six symphonies pour orgue et des Pièces de fantaisie.'),
  ('jacques-ibert', 'Jacques Ibert', 1890, 1962, 'Française', 'Moderne', 'connu',
   'Compositeur éclectique et élégant, Ibert a écrit Escales pour orchestre, le Divertissement et de nombreuses pages pour instruments à vent.'),
  ('ottorino-respighi', 'Ottorino Respighi', 1879, 1936, 'Italienne', 'Post-romantique', 'connu',
   'Brillant orchestrateur, Respighi a célébré Rome dans sa trilogie symphonique (Fontaines, Pins, Fêtes) et redonné vie à la musique ancienne italienne.'),
  ('ernest-bloch', 'Ernest Bloch', 1880, 1959, 'Suisse', 'Moderne', 'connu',
   'Né à Genève et installé aux États-Unis, Bloch a puisé dans la tradition juive l''inspiration de Schelomo pour violoncelle et orchestre et de Baal Shem.'),
  ('jacques-offenbach', 'Jacques Offenbach', 1819, 1880, 'Française', 'Romantique', 'connu',
   'Né à Cologne, Offenbach a inventé l''opéra-bouffe parisien avec Orphée aux enfers et La Belle Hélène, avant son grand opéra Les Contes d''Hoffmann.'),
  ('maurice-durufle', 'Maurice Duruflé', 1902, 1986, 'Française', 'Moderne', 'connu',
   'Organiste de Saint-Étienne-du-Mont, Duruflé a laissé un catalogue restreint et ciselé, dominé par son Requiem inspiré du chant grégorien.'),
  ('erik-satie', 'Erik Satie', 1866, 1925, 'Française', 'Moderne', 'connu',
   'Esprit libre et ironique, Satie a ouvert la voie à la musique dépouillée du XXe siècle avec ses Gymnopédies et Gnossiennes, puis le ballet Parade.'),
  ('paul-dukas', 'Paul Dukas', 1865, 1935, 'Française', 'Post-romantique', 'connu',
   'Compositeur exigeant qui détruisit une grande partie de ses œuvres, Dukas est l''auteur de L''Apprenti sorcier, d''Ariane et Barbe-Bleue et de La Péri.'),
  ('nicola-porpora', 'Nicola Porpora', 1686, 1768, 'Italienne', 'Baroque', 'connu',
   'Compositeur d''opéras napolitain et professeur de chant renommé, Porpora forma les castrats Farinelli et Caffarelli et fut le rival de Haendel à Londres.'),
  ('wilhelm-friedemann-bach', 'Wilhelm Friedemann Bach', 1710, 1784, 'Allemande', 'Baroque', 'connu',
   'Fils aîné de Johann Sebastian Bach, organiste à Dresde puis à Halle, Wilhelm Friedemann a laissé des fantaisies et des polonaises pour clavier d''une grande originalité.')
on conflict (id) do nothing;

-- Rattachement des albums : graphies dont le seul compositeur correspondant
-- (dans toute la table) est l'une des 20 nouvelles fiches
create temp table correspondances on commit drop as
with noms as (
  select distinct u.nom from albums a, unnest(a.composers) as u(nom) where u.nom is not null
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
  select o.nom, min(r.name) as cible, min(r.id) as cible_id, count(distinct r.name) as nb
  from orphelins o
  join referentiel r
    on r.plie = o.plie
    or r.plie like '% ' || o.plie
    or (length(o.plie) >= 6 and r.plie like '_' || o.plie)
  group by o.nom
)
select nom as variante, cible
from candidats
where nb = 1
  and cible_id in ('jules-massenet', 'georges-bizet', 'reynaldo-hahn', 'charles-gounod',
    'carl-maria-von-weber', 'girolamo-frescobaldi', 'ernest-chausson', 'louis-couperin',
    'max-reger', 'erich-wolfgang-korngold', 'louis-vierne', 'jacques-ibert', 'ottorino-respighi',
    'ernest-bloch', 'jacques-offenbach', 'maurice-durufle', 'erik-satie', 'paul-dukas',
    'nicola-porpora', 'wilhelm-friedemann-bach');

update albums a
set composers = n.composers
from (
  select a2.id,
    array(
      select x.nom
      from (
        select coalesce(k.cible, u.nom) as nom, min(u.ord) as ord
        from unnest(a2.composers) with ordinality as u(nom, ord)
        left join correspondances k on k.variante = u.nom
        group by coalesce(k.cible, u.nom)
      ) x
      order by x.ord
    ) as composers
  from albums a2
  where a2.composers && (select array_agg(variante) from correspondances)
) n
where a.id = n.id;

commit;

-- Résultat affiché : nombre d'albums par nouvelle fiche
select c.name as compositeur, count(a.id) as albums
from compositeurs c
left join albums a on c.name = any(a.composers)
where c.id in ('jules-massenet', 'georges-bizet', 'reynaldo-hahn', 'charles-gounod',
  'carl-maria-von-weber', 'girolamo-frescobaldi', 'ernest-chausson', 'louis-couperin',
  'max-reger', 'erich-wolfgang-korngold', 'louis-vierne', 'jacques-ibert', 'ottorino-respighi',
  'ernest-bloch', 'jacques-offenbach', 'maurice-durufle', 'erik-satie', 'paul-dukas',
  'nicola-porpora', 'wilhelm-friedemann-bach')
group by c.name
order by albums desc;
