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
-- 2. Amy Beach (1867–1944, américaine)
--    Millésime Matrimoine musical 2025 — Symphonie « gaélique » op. 32,
--    Orchestre symphonique de Munich / Joseph Bastian (Solo Musica).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'amy-beach', 'Amy Beach', 1867, 1944, 'américaine', 'Post-romantique', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Amy Beach');

UPDATE compositeurs
SET
  bio_enrichie = $$Amy Beach occupe dans l'histoire de la musique américaine la place inaugurale — celle de la première femme, et l'une des premières voix tout court, à avoir imposé outre-Atlantique une écriture symphonique de grande envergure. Longtemps considérée comme une figure parmi d'autres de l'école de Boston, aux côtés de MacDowell ou de Chadwick, elle en fut bien davantage la conscience pionnière, et reste aujourd'hui l'une des clés indispensables à la compréhension d'une musique savante américaine en train de se chercher.

Née Amy Marcy Cheney en 1867 dans le New Hampshire, l'enfant témoigne dès l'âge de quatre ans de dons si spectaculaires — oreille absolue, improvisation au clavier, mémoire prodigieuse — que ses parents, puis ses maîtres bostoniens, hésitent peu à la lancer sur la scène concertante. À dix-huit ans, elle épouse le Dr Henry Harris Aubrey Beach, éminent chirurgien de vingt-cinq ans son aîné, qui pose à leur union une condition paradoxalement féconde : limiter ses apparitions publiques de pianiste, et consacrer son talent à la composition. Largement autodidacte en écriture — elle étudie Berlioz, Bach et les traités d'orchestration sans jamais suivre de classe à proprement parler —, elle acquiert par la seule force de son discernement une maîtrise que ses contemporains saluent comme une évidence.

La création en 1896, par le Boston Symphony, de sa Symphonie « gaélique » en mi mineur — première symphonie composée et publiée par une Américaine — la consacre définitivement. L'œuvre, traversée de thèmes irlandais puisés dans les recueils de chansons populaires, marie l'ampleur symphonique post-romantique (on pense à Brahms, à Dvořák) à une coloration folklorique qui annonce déjà, sans en partager tous les enjeux, la quête d'une identité musicale américaine. Son catalogue compte aussi un très beau Concerto pour piano, une Mass in E-flat major de belle envergure, une Sonate pour violon et piano d'une rare intensité, et des mélodies — son domaine de prédilection — dont la fraîcheur mélodique et le raffinement harmonique appellent sans cesse de nouvelles voix.

Redécouverte progressivement depuis les années 1970, saluée aujourd'hui comme l'une des grandes figures du matrimoine musical, Amy Beach a reçu de Crescendo Magazine le Millésime Matrimoine musical 2025 pour l'enregistrement de la Symphonie « gaélique » par l'Orchestre symphonique de Munich sous la direction de Joseph Bastian chez Solo Musica — lecture somptueusement timbrée qui remet cette partition à la place qu'elle n'aurait jamais dû quitter. Pour prolonger la découverte, ses mélodies sur Robert Browning et sa Sonate pour violon et piano révèlent une chambriste de premier plan.$$,
  bio_generated_at = now()
WHERE name = 'Amy Beach';


-- ------------------------------------------------------------
-- 3. Johanna Senfter (1879–1961, allemande)
--    Millésime Matrimoine musical 2024 — Chamber Music,
--    Else Ensemble (CPO).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'johanna-senfter', 'Johanna Senfter', 1879, 1961, 'allemande', 'Post-romantique', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Johanna Senfter');

UPDATE compositeurs
SET
  bio_enrichie = $$Johanna Senfter incarne, dans le sillage de Max Reger dont elle fut l'élève la plus fidèle, une tradition de musique de chambre allemande que le XXe siècle s'est étrangement empressé d'oublier. Redécouvrir aujourd'hui son nom, c'est mesurer l'ampleur du travail qui reste à mener pour rendre justice à ces figures patiemment effacées de l'histoire, et découvrir par la même occasion une plume d'une cohérence remarquable.

Née en 1879 à Oppenheim am Rhein dans une famille cultivée, elle étudie d'abord à Francfort au Hoch'sches Konservatorium, berceau de la tradition germanique de l'après-Brahms, où Iwan Knorr et Bernhard Sekles comptent parmi ses maîtres. C'est à Leipzig, entre 1908 et 1910, qu'elle rencontre celui qui marquera sa vie : Max Reger, qui la distingue rapidement comme son élève préférée — le mot est de lui. Elle sort de cette formation armée d'un métier polyphonique rigoureux, d'un goût prononcé pour les formes étendues de la sonate et du quatuor, et d'une conception presque religieuse du travail de composition. Pacifiste convaincue, proche plus tard de la Société religieuse des Amis, elle refuse l'éclat des grands centres pour passer l'essentiel de sa vie dans sa ville natale, où elle écrit à l'écart des chapelles avant-gardistes.

Son catalogue considérable — une centaine d'opus — témoigne d'une fidélité lucide à l'héritage regerien : polyphonie dense, chromatisme harmonique hérité de Brahms, sens du grand développement thématique, mais traversée par une sensibilité lyrique qui lui appartient en propre. Les neuf Symphonies, les sonates pour divers instruments, les très beaux quatuors, les pages chorales et les lieder forment un corpus dont on découvre aujourd'hui, concert après concert, la tenue remarquable. Rien de passéiste dans cette écriture : plutôt la revendication paisible d'une modernité du métier — celle qu'une Germaine Tailleferre ou une Ruth Crawford Seeger, à leur manière, porteront également.

C'est à cette redécouverte patiente et exemplaire que Crescendo Magazine a voulu rendre hommage en décernant à l'album Chamber Music de l'Else Ensemble, paru chez CPO, le tout premier Millésime Matrimoine musical en 2024. Une parution fondatrice, à placer au cœur de toute exploration du Matrimoine, qui révèle une chambriste d'une intelligence et d'une tendresse inattendues. Pour continuer : ses trios et ses sonates pour violoncelle, qu'une nouvelle génération d'interprètes commence enfin à porter au concert.$$,
  bio_generated_at = now()
WHERE name = 'Johanna Senfter';


-- ------------------------------------------------------------
-- 4. Eugène Ysaÿe (1858–1931, belge)
--    Millésime 2025 — Florilège éblouissant de pages orchestrales,
--    Defrise / Roussev / Tudorache / Demarquette / OPRL / Pablo González
--    (Musique en Wallonie).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'eugene-ysaye', 'Eugène Ysaÿe', 1858, 1931, 'belge', 'Post-romantique', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Eugène Ysaÿe');

UPDATE compositeurs
SET
  bio_enrichie = $$Eugène Ysaÿe appartient à cette rare catégorie de musiciens qui se trouvent, à la fois par leur archet et par leur plume, à la croisée des grandes mutations d'un siècle. À la tête de cette fameuse école franco-belge qui, de Vieuxtemps à Grumiaux, a défini pendant plus de cent ans une manière de jouer — souplesse du phrasé, chant aristocratique, sens de la grande ligne —, il occupe dans l'imaginaire musical européen une place que la modernité n'a jamais vraiment pu déloger.

Né à Liège en 1858, fils d'un musicien d'orchestre qui lui met l'archet en main dès quatre ans, il fréquente le Conservatoire de sa ville natale avant de passer auprès d'Henryk Wieniawski, puis d'Henri Vieuxtemps, dont il se réclame la vie durant. Premier violon adulé en Europe dans les années 1880, il devient très vite l'interlocuteur privilégié de toute une génération de compositeurs : César Franck lui dédie sa Sonate en la majeur pour le cadeau de son mariage, Ernest Chausson son Poème, Claude Debussy l'intègre à la carte musicale française en lui confiant la création de son Quatuor. À la tête du Quatuor Ysaÿe, il crée plusieurs des chefs-d'œuvre les plus importants de son temps. Pédagogue d'exception, il professe au Conservatoire de Bruxelles, dirige l'Orchestre symphonique de Cincinnati entre 1918 et 1922, puis fonde à son retour les Concerts Ysaÿe qui donneront leur nom au futur Concours Reine Élisabeth.

Sa composition, longtemps occultée par la magnificence de sa carrière d'interprète, se révèle d'une ampleur singulière. Les six Sonates pour violon seul op. 27 (1923), dédiées chacune à un grand violoniste contemporain — Szigeti, Thibaud, Enescu, Kreisler, Crickboom, Manén —, condensent une vie de musicien : architecture inspirée des chaconnes de Bach, écriture harmonique post-romantique traversée de hardiesses presque expressionnistes, virtuosité toujours subordonnée à l'expression. On y ajoutera les grandes pages symphoniques et concertantes — Poème élégiaque, Harmonies du soir, Méditation —, territoire discographique en pleine redécouverte.

C'est précisément à cet approfondissement qu'est consacré l'album « Florilège éblouissant de pages orchestrales d'Eugène Ysaÿe » paru chez Musique en Wallonie, distingué par Crescendo Magazine comme Millésime 2025 : Sarah Defrise, Svetlin Roussev, George Tudorache et Henri Demarquette, portés par l'Orchestre Philharmonique Royal de Liège sous la baguette de Pablo González, redonnent à cette musique sa stature symphonique pleine. Une parution qui fait œuvre patrimoniale et rappelle combien la scène belge reste l'un des laboratoires les plus vivants du grand répertoire européen. À prolonger : les six Sonates op. 27, chantier discographique inépuisable.$$,
  bio_generated_at = now()
WHERE name = 'Eugène Ysaÿe';


-- ------------------------------------------------------------
-- 5. César Franck (1822–1890, belge naturalisé français)
--    Millésime 2021 — César Franck choral : de l'autel au salon
--    (Musique en Wallonie).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'cesar-franck', 'César Franck', 1822, 1890, 'belge', 'Romantique', NULL
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'César Franck');

UPDATE compositeurs
SET
  bio_enrichie = $$César Franck occupe dans le paysage musical de la seconde moitié du XIXe siècle une position unique : Belge devenu Français, organiste devenu symphoniste, professeur qui forma toute une génération, il fut à la fois le flambeau d'une exigence pieuse du métier et l'inspirateur discret d'un renouvellement complet de la musique française. Sa postérité, immense, s'étend de Duparc à Chausson, de d'Indy à Ropartz, jusqu'aux plus lointains échos de la musique française du XXe siècle.

Né à Liège en 1822 dans une famille de Wallonie, il bénéficie très tôt d'une éducation musicale que son père oriente vers la virtuosité pianistique. Ses études au Conservatoire royal de Liège le conduisent bientôt à Paris, où il intègre dès 1835 les classes du Conservatoire. Concertiste précoce mais mal adapté au métier de virtuose itinérant, il se tourne vers l'orgue — instrument dont il deviendra le maître incontesté. Titulaire des grandes orgues de Sainte-Clotilde en 1858, il y improvise des heures durant et y compose une partie considérable de son œuvre d'organiste. Naturalisé français en 1873 pour pouvoir enseigner au Conservatoire, il forme dès lors la génération d'Henri Duparc, d'Ernest Chausson, de Vincent d'Indy et de Guy Ropartz, constituant ce que l'histoire retiendra sous le nom d'école franckiste.

Son langage, marqué par une polyphonie héritée de Bach et par l'harmonie chromatique post-wagnérienne, se singularise par le principe cyclique — le retour transformé des thèmes d'un mouvement à l'autre — qui confère à ses grandes œuvres leur cohérence architecturale unique. La Symphonie en ré mineur (1888), le Quatuor à cordes, le Quintette pour piano et cordes, le Prélude, choral et fugue, la Sonate pour violon et piano, les Variations symphoniques : autant de sommets tardifs, écrits dans les dix dernières années d'une vie discrète, qui révèlent une ambition créatrice exceptionnelle et fondent une part essentielle de la modernité française.

Son versant liégeois, l'organiste improvisateur et le compositeur de musique sacrée, trouve une mise en lumière remarquable dans l'album « César Franck choral : de l'autel au salon » paru chez Musique en Wallonie — parution distinguée par Crescendo Magazine dans son tout premier Millésime en 2021. Un parcours qui traverse l'œuvre chorale du maître, entre latinité liturgique et veillées familières, et rappelle combien Franck reste l'un des ponts essentiels entre la scène belge et la scène française. À prolonger : la Sonate pour violon et piano, qu'on n'écoute jamais de trop, et l'intégrale de l'œuvre d'orgue.$$,
  bio_generated_at = now()
WHERE name = 'César Franck';


-- ------------------------------------------------------------
-- 6. Adrien Tsilogiannis (1982–, belge)
--    Millésime 2023 — S'élancer,
--    Ensemble Sturm und Klang / Thomas van Haeperen (Cyprès).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'adrien-tsilogiannis', 'Adrien Tsilogiannis', 1982, NULL, 'belge', 'Contemporaine', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Adrien Tsilogiannis');

UPDATE compositeurs
SET
  bio_enrichie = $$Adrien Tsilogiannis appartient à cette génération de compositeurs belges qui, depuis le début des années 2010, imposent la vitalité d'une scène contemporaine francophone aussi riche qu'exigeante. Formé en Belgique, nourri des grandes écritures européennes d'après-guerre, il tient aujourd'hui une position qui compte dans le paysage de la création instrumentale, à la confluence de plusieurs filiations — spectrale, post-sérielle, minimaliste — qu'il assume avec une liberté revendiquée.

Né en 1982, il se forme au Conservatoire royal de Bruxelles, où il étudie la composition et l'écriture auprès des figures les plus actives de la scène musicale belge. Son parcours dessine la silhouette désormais familière mais toujours délicate d'un musicien qui partage son activité entre l'écriture de concert, la création pour la scène et l'enseignement, dont il a fait l'un des piliers de son métier. Proche de plusieurs ensembles belges qui ont fait de la création leur marque de fabrique — au premier chef Sturm und Klang, avec lequel il entretient un dialogue au long cours —, il a noué avec eux des compagnonnages créatifs dont témoigne régulièrement sa discographie.

Son écriture se reconnaît à une attention portée au geste instrumental — la manière dont le son naît, se déploie, se transforme — plutôt qu'à la hiérarchie harmonique ou à l'argument narratif. Héritière d'une tradition spectrale qu'elle croise avec une certaine rigueur de l'école française contemporaine, elle privilégie les grandes architectures temporelles, les textures orchestrales mobiles, l'élan comme principe structurant. Le catalogue récent associe œuvres pour grand ensemble et formations chambristes, avec un goût particulier pour les assemblages instrumentaux inhabituels, où la couleur devient elle-même sujet de la forme.

L'album S'élancer paru chez Cyprès, porté par l'ensemble Sturm und Klang sous la direction de Thomas van Haeperen, a reçu de Crescendo Magazine l'un des Millésimes 2023 — année où la rédaction publiait près de 540 critiques et dont les Millésimes représentent la quintessence. Cette parution, à la fois manifeste personnel et cahier de route, fait entendre avec clarté la voix d'un compositeur qui travaille l'élan comme d'autres travaillent le cri : lentement, précisément, avec une urgence qui sourd plus qu'elle n'éclate. À écouter en priorité pour quiconque veut prendre le pouls de la création belge d'aujourd'hui.$$,
  bio_generated_at = now()
WHERE name = 'Adrien Tsilogiannis';


-- ------------------------------------------------------------
-- 7. Margaret Brouwer (1940–, américaine)
--    Millésime 2024 — Rhapsodies : The Art of Sailing at Dawn,
--    Concerto for Orchestra, Symphony n°1 « Lake Voices »,
--    ORF Vienna Radio Symphony Orchestra / Marin Alsop (Naxos).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'margaret-brouwer', 'Margaret Brouwer', 1940, NULL, 'américaine', 'Contemporaine', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Margaret Brouwer');

UPDATE compositeurs
SET
  bio_enrichie = $$Margaret Brouwer occupe dans la scène contemporaine américaine une place qui tient à la fois du métier symphonique le plus abouti et d'une écoute attentive aux paysages qui l'entourent. Longtemps enseignante, aujourd'hui reconnue comme l'une des voix orchestrales américaines les plus accomplies de sa génération, elle construit depuis plus de quatre décennies un catalogue dont la densité ne cesse d'étonner.

Née en 1940 dans l'Iowa, elle se forme aux États-Unis auprès de figures tutélaires de la composition d'après-guerre — Ross Lee Finney pour le métier, George Crumb pour l'imagination sonore. De cette double filiation, elle retiendra la rigueur de l'architecture et la liberté du matériau. Après un parcours de compositrice indépendante, elle dirige pendant plusieurs années le département de composition du Cleveland Institute of Music, dans l'Ohio, formant à son tour une génération de créateurs américains. Elle fonde par ailleurs le Blue Streak Ensemble, formation de chambre vouée à la création, qui reste un vecteur privilégié de son travail.

Son écriture orchestrale — c'est sans doute le terrain où elle donne sa pleine mesure — se caractérise par une maîtrise du temps symphonique, un sens aigu des grands arcs dramatiques et une palette de couleurs qui sait puiser dans la nature américaine ses motifs les plus évocateurs. La Symphonie n°1 « Lake Voices », inspirée des lacs du Midwest, trace un paysage sonore où l'orchestre semble respirer au rythme des étendues d'eau. Le Concerto for Orchestra prolonge cette réflexion dans le territoire virtuose de l'écriture instrumentale collective, tandis que les Rhapsodies « The Art of Sailing at Dawn » déploient une sensibilité plus ouvertement lyrique. Autour de ces pages orchestrales gravite un catalogue chambriste de plus de soixante œuvres, vocales, mixtes, pédagogiques.

L'album Rhapsodies paru chez Naxos, qui réunit ces trois partitions majeures sous la baguette de Marin Alsop à la tête de l'ORF Vienna Radio Symphony Orchestra, a été distingué par Crescendo Magazine comme Millésime 2024 — consécration d'une œuvre dont la notoriété gagne enfin, sur la scène européenne, l'audience qu'elle a toujours méritée. On entend dans ces pages la plume d'une symphoniste généreuse, intelligente, qui mérite largement d'être découverte bien au-delà du cercle des spécialistes de la musique américaine contemporaine. À prolonger : ses quatuors à cordes et ses pages vocales, autre versant d'un univers d'une grande cohérence.$$,
  bio_generated_at = now()
WHERE name = 'Margaret Brouwer';


-- ------------------------------------------------------------
-- 8. Vito Žuraj (1979–, slovène)
--    Enregistrement de l'année 2025 — Automatones (couplé au Coro de Berio),
--    Chor und Symphonieorchester des Bayerischen Rundfunks /
--    Sir Simon Rattle (BR Klassik).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'vito-zuraj', 'Vito Žuraj', 1979, NULL, 'slovène', 'Contemporaine', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Vito Žuraj');

UPDATE compositeurs
SET
  bio_enrichie = $$Vito Žuraj s'impose aujourd'hui comme l'un des compositeurs les plus singuliers de la création européenne, capable de transfigurer les traditions de l'école allemande dans lesquelles il s'est formé par une sensibilité venue d'ailleurs — plus fluide, plus corporelle, plus ouverte à la théâtralité du son. Son œuvre s'installe dans ce territoire rare où la rigueur constructive croise le plaisir sensoriel, et où la musique contemporaine retrouve parfois, presque en passant, l'évidence du geste.

Né à Maribor en 1979 dans cette Slovénie qui venait tout juste de s'ouvrir au monde, il suit d'abord une formation classique à Ljubljana avant de rejoindre l'Allemagne, où il étudie la composition à Karlsruhe dans la classe de Wolfgang Rihm puis à Dresde. Cette double appartenance culturelle — les paysages balkaniques de son enfance, l'exigence spéculative de l'école germanique de l'après-Lachenmann — irrigue toute son écriture. Lauréat de prix importants, il collabore très tôt avec les formations les plus engagées dans la création contemporaine : l'Ensemble Modern, le Klangforum Wien, l'Ensemble MusikFabrik, plusieurs grandes scènes lyriques européennes. Son opéra Hands, créé à Schwetzingen, installe définitivement sa stature sur la scène de la musique nouvelle.

Chez Žuraj, la musique commence par les gestes des interprètes — un souffle, un frottement, un éclat percussif — avant de se déployer en architectures sonores d'une précision d'horloger. Son écriture orchestrale, héritière d'une certaine lignée post-spectrale, se distingue par une vitalité rythmique remarquable, un humour discret mais constant, un appétit pour les polyphonies de masses instrumentales et pour les combinatoires de timbres. Automatones, œuvre-concerto pour grand orchestre, condense admirablement ces traits : mouvement perpétuel, combinatoire subtile, climat à la fois mécanique et organique.

L'album réunissant Automatones et le Coro de Luciano Berio par le Chor und Symphonieorchester des Bayerischen Rundfunks sous la direction de Sir Simon Rattle, paru chez BR Klassik, a été désigné par Crescendo Magazine comme l'Enregistrement de l'année 2025 — distinction suprême des Millésimes. La rédaction y voit l'un des grands chefs-d'œuvre des années 2020, couplage magistral qui signe l'entrée de Žuraj dans le petit cercle des compositeurs contemporains dont le nom fera date. À prolonger : ses pages concertantes récentes, et bien sûr l'intégrale Berio qui s'écrit sous nos yeux chez BR Klassik.$$,
  bio_generated_at = now()
WHERE name = 'Vito Žuraj';


-- ------------------------------------------------------------
-- 9. Kaija Saariaho (1952–2023, finlandaise)
--    Millésime 2023 — Musique chorale de Kaija Saariaho,
--    Ensemble Uusinta / Chœur de chambre d'Helsinki /
--    Nils Schweckendiek (BIS).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'kaija-saariaho', 'Kaija Saariaho', 1952, 2023, 'finlandaise', 'Contemporaine', NULL
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Kaija Saariaho');

UPDATE compositeurs
SET
  bio_enrichie = $$Kaija Saariaho compte parmi les figures majeures de la musique de son temps — celles qui ont fait bouger les frontières de l'écriture contemporaine en lui rendant le goût de la couleur, de l'espace, du souffle poétique. Son œuvre, traversée d'une puissance d'évocation rare, a marqué trois décennies de création européenne, et sa disparition en 2023 a laissé dans la vie musicale une absence que chaque nouvelle parution vient aujourd'hui éprouver.

Née à Helsinki en 1952, elle se forme dans cette scène finlandaise prodigieusement fertile qui verra éclore, à la même génération, Magnus Lindberg et Esa-Pekka Salonen. Après des études à l'Académie Sibelius auprès de Paavo Heininen, elle gagne l'Allemagne — Darmstadt, puis Freiburg avec Brian Ferneyhough et Klaus Huber — avant de s'établir en 1982 à Paris, où l'IRCAM devient son laboratoire de prédilection. C'est là qu'elle forge, au contact de l'informatique musicale et de la recherche spectrale, la langue sonore très personnelle qui restera la sienne : un art de la couleur orchestrale étendue, nourri par l'écoute minutieuse du grain du son, attentif aux transformations continues plus qu'aux événements abrupts. Elle construit au fil des décennies un catalogue immense, traversé par la poésie, la mer, les textes sacrés, l'intime comme le cosmique.

Les grandes œuvres de la maturité — l'opéra L'Amour de loin (2000), Château de l'âme, Laterna Magica, Graal théâtre, les concertos pour diverses formations — imposent une écriture où le timbre est devenu le lieu même du sens. Ses pages vocales et chorales, plus secrètes, révèlent un lyrisme d'une rare intensité, inspiré tant par les troubadours médiévaux que par la poésie contemporaine. Figure de référence de la scène musicale internationale, lauréate de tous les grands prix de composition, elle disparaît à Paris en juin 2023, laissant une œuvre dont on commence seulement à mesurer l'ampleur.

Dans les mois qui suivent sa disparition paraît chez BIS un album de musique chorale enregistré par l'Ensemble Uusinta et le Chœur de chambre d'Helsinki sous la direction de Nils Schweckendiek — hommage posthume imprévisible dont la grâce a frappé la rédaction de Crescendo Magazine, qui l'a distingué comme Millésime 2023. Une parution qui révèle un pan moins connu de son œuvre et, ce faisant, donne à entendre l'une des plus belles signatures contemporaines dans sa dimension la plus intérieure. À prolonger : Laterna Magica, Château de l'âme, et l'écoute attentive de tous les chemins qu'elle aura tracés.$$,
  bio_generated_at = now()
WHERE name = 'Kaija Saariaho';


-- ------------------------------------------------------------
-- 10. Louis Andriessen (1939–2021, néerlandais)
--     Millésime 2021 — The Only One (Nonesuch).
-- ------------------------------------------------------------

INSERT INTO compositeurs (id, name, born, died, nationality, period, familiarity)
SELECT 'louis-andriessen', 'Louis Andriessen', 1939, 2021, 'néerlandaise', 'Contemporaine', NULL
WHERE NOT EXISTS (SELECT 1 FROM compositeurs WHERE name = 'Louis Andriessen');

UPDATE compositeurs
SET
  bio_enrichie = $$Louis Andriessen s'impose dans l'histoire de la musique européenne des cinquante dernières années comme l'un des rares créateurs à avoir su donner à la radicalité politique des années 1970 une postérité musicale durable. Maître reconnu d'une écriture à la fois immédiate et savante, il aura redéfini, jusqu'à sa disparition en 2021, les contours de la scène néerlandaise contemporaine et pesé sur toute une génération de compositeurs européens.

Né en 1939 à Utrecht dans une famille de musiciens — son père Hendrik et son oncle Willem étaient tous deux compositeurs reconnus —, il se forme au Royal Conservatoire de La Haye avant de rencontrer, déterminante pour lui, Luciano Berio à Milan. Cette rencontre lui ouvre un horizon d'écriture où la liberté combinatoire, la théâtralité et l'engagement politique deviennent les instruments d'une musique résolument neuve. Refusant dans les années 1960 l'institution orchestrale symphonique — qu'il qualifie alors d'instrument de pouvoir —, il fonde plusieurs collectifs (De Volharding, Hoketus) qui imposent des formations instrumentales hybrides, souvent sans cordes, proches à la fois du big band de jazz et des grands ensembles minimalistes américains. Cette posture, à la fois musicale et sociale, imprègnera durablement son écriture ultérieure.

Son langage marie la vigueur rythmique du minimalisme américain — Reich, Glass lui sont à bien des égards des interlocuteurs —, la densité polyphonique d'une tradition européenne qu'il n'a jamais rejetée (Bach, Stravinsky restent des phares) et un sens aigu du théâtre. Les grandes œuvres scéniques (De Staat, De Materie, Rosa, Writing to Vermeer, La Commedia), les pages pour ensemble instrumental (Workers Union, De Snelheid), les partitions pour piano témoignent d'un univers d'une cohérence remarquable, traversé par l'idée que la musique est toujours aussi, nécessairement, un acte public.

L'album The Only One paru chez Nonesuch, qui fait entendre une œuvre tardive écrite pour la voix de Nora Fischer et le Netherlands Radio Philharmonic, a été distingué par Crescendo Magazine comme l'un des Millésimes de la toute première édition en 2021. Une parution qui témoigne de la liberté créatrice d'un compositeur qui n'aura jamais cessé d'inventer, jusque dans ses œuvres les plus tardives. À prolonger : l'opéra De Materie, véritable manifeste où s'entendent toutes les forces d'une œuvre résolument à part.$$,
  bio_generated_at = now()
WHERE name = 'Louis Andriessen';


-- ============================================================
-- Fin batch 1. Vérifie le résultat avec :
--   SELECT name, char_length(bio_enrichie), bio_generated_at
--   FROM compositeurs
--   WHERE name IN (
--     'Elsa Barraine', 'Amy Beach', 'Johanna Senfter', 'Eugène Ysaÿe',
--     'César Franck', 'Adrien Tsilogiannis', 'Margaret Brouwer',
--     'Vito Žuraj', 'Kaija Saariaho', 'Louis Andriessen'
--   )
--   ORDER BY bio_generated_at DESC;
-- ============================================================
