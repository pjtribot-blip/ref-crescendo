-- Migration 2 : Enrichissement de 2e passe
-- Source : extraction depuis header_raw avec whitelist ÉTENDUE (60+ nouveaux labels)
-- Inclut fusions importantes : Hypérion→Hyperion, Pentagone→Pentatone, Brillant→Brilliant,
--   Melodyia→Melodiya, ODE→Ondine, CHAN→Chandos (tag catalogue), DHM→Deutsche Harmonia Mundi
-- Total albums : 284
-- Labels distincts : 62
-- Date : 2026-04-19

BEGIN;

-- ARS : 11 album(s)
UPDATE albums SET label = 'ARS' WHERE id IN ('anna-schultsz-mouvements-violonistiques', 'anniversaire-palestrina-avec-le-augsburger-domsingknaben', 'boris-bloch-parcourt-les-saisons-pour-piano-de-tchaikovski', 'concert-dinauguration-de-lorgue-reconstruit-au-centre-saint-jean-de-gdansk', 'deux-trios-de-jeunesse-de-korngold-et-zemlinsky', 'musique-de-chambre-et-piano-de-josef-suk-du-bonheur-a-la-douleur', 'myriam-barbaux-cohen-trace-litineraire-pianistique-de-mel-bonis', 'premier-cd-de-la-pianiste-myriam-barbaux-cohen-la-pudeur-de-granados', 'une-large-anthologie-pour-questionner-la-polyvalence-stylistique-de-lorgue-de-krzanowice', 'voyage-transfrontalier-avec-le-trio-goldberg', 'ysaye-en-sonates-et-en-premiere-mondiale-avec-noe-inui') AND (label IS NULL OR label = '');

-- Ad Vitam Records : 9 album(s)
UPDATE albums SET label = 'Ad Vitam Records' WHERE id IN ('francois-mardirossian-propose-une-fine-integrale-des-etudes-de-philip-glass', 'keith-jarrett-et-francois-mardirossian-retrouvaille-sans-precedent', 'la-haute-voltige-pianistique-de-tristan-pfaff', 'le-piano-dalan-hovhaness-ce-dispensateur-de-generosite', 'maxime-zecchini-face-a-janacek-et-korngold', 'pour-satie-mardirossian-convie-ses-gymnopedistes', 'roustem-saitkoulov-et-la-diction-naturelle-de-chopin', 'tableaux-denfance', 'tristan-pfaff-nous-invite-a-valser-avec-chopin') AND (label IS NULL OR label = '');

-- Ariadne : 3 album(s)
UPDATE albums SET label = 'Ariadne' WHERE id IN ('john-barbirolli-rayonnant-au-carnegie-hall-de-new-york', 'ralph-vaughan-williams-par-lui-meme', 'un-bonjour-dedward-elgar-damerique') AND (label IS NULL OR label = '');

-- Armé : 3 album(s)
UPDATE albums SET label = 'Armé' WHERE id IN ('derniere-etape-de-lintegrale-des-messes-de-josquin-par-metamorphoses', 'glorieuse-etape-milanaise-dans-lintegrale-des-messes-de-josquin-par-biscantor-metamorphoses', 'penultieme-escale-dans-lintegrale-des-messes-de-josquin-par-metamorphoses') AND (label IS NULL OR label = '');

-- Arts de Monte-Carlo : 3 album(s)
UPDATE albums SET label = 'Arts de Monte-Carlo' WHERE id IN ('aline-piboule-le-voyage-pianistique-inattendu', 'beatrice-berrut-au-sommet-de-la-sensibilite', 'un-duo-concertant-exceptionnel') AND (label IS NULL OR label = '');

-- Azur Classical : 5 album(s)
UPDATE albums SET label = 'Azur Classical' WHERE id IN ('aimez-vous-la-musique-de-salon', 'couleurs-et-rythmes-de-villa-lobos-avec-le-pianiste-flavio-varani', 'la-musique-pour-instruments-solos-de-marcel-cominotto', 'poulenc-et-damase-reunis-par-le-duo-cornil-reyes', 'voyage-musical-avec-marianne-fastre') AND (label IS NULL OR label = '');

-- BMN : 2 album(s)
UPDATE albums SET label = 'BMN' WHERE id IN ('lart-du-trio-a-cordes', 'le-quatuor-a-cordes-triomphant') AND (label IS NULL OR label = '');

-- BPHR : 6 album(s)
UPDATE albums SET label = 'BPHR' WHERE id IN ('arnold-schonberg-demystifie-avec-kirill-petrenko', 'compagnonnage-musical-berlinois-avec-frank-peter-zimmermann', 'karajan-en-concert-a-berlin', 'karajan-en-concert-a-berlin-la-saison-ii', 'la-mecanique-est-en-marche-petrenko-dirige-chostakovitch-a-berlin', 'sir-simon-rattle-le-voyageur-mahlerien') AND (label IS NULL OR label = '');

-- Bayerische Staatsoper Recordings : 4 album(s)
UPDATE albums SET label = 'Bayerische Staatsoper Recordings' WHERE id IN ('andrea-chenier-par-jonas-kaufmann-anja-harteros-et-george-petean', 'die-tote-stadt-a-munich', 'elias-de-mendelssohn-sous-la-direction-magistrale-de-wolfgang-sawallisch', 'lapotheose-de-la-danse-mahler-par-kirill-petrenko') AND (label IS NULL OR label = '');

-- Birmingham Record Company : 3 album(s)
UPDATE albums SET label = 'Birmingham Record Company' WHERE id IN ('alex-paxton-la-bande-son-du-jardin-des-delices', 'melinda-maxwell-melange-contemporain-et-jazz-notation-et-improvisation', 'six-jeunes-compositeurs-touchent-lalto') AND (label IS NULL OR label = '');

-- Brilliant Classics : 8 album(s)
UPDATE albums SET label = 'Brilliant Classics' WHERE id IN ('cesar-franck-en-integrale', 'le-baryton-michael-volle-interprete-brahms-admirable', 'le-czerny-de-notre-epoque', 'les-sonates-pour-violon-et-piano-de-paul-hindemith', 'menotti-et-lopera', 'sergio-fiorentino-musicien-avant-tout-mais-neanmoins-pianiste-la-revelation-dun-genie', 'splendeurs-du-violon-alto', 'touching-the-memory-musiques-pour-piano-et-cordes') AND (label IS NULL OR label = '');

-- CHAN : 3 album(s)
UPDATE albums SET label = 'CHAN' WHERE id IN ('ballets-a-la-francaise', 'le-langage-puissant-et-novateur-dedward-gregson', 'superbe-sibelius-par-sakari-oramo-et-le-bbc-symphony-orchestra') AND (label IS NULL OR label = '');

-- CHSA : 2 album(s)
UPDATE albums SET label = 'CHSA' WHERE id IN ('belle-epoque-avec-vents', 'messieurs-les-anglais-berlioz') AND (label IS NULL OR label = '');

-- Cantaloupe Music : 3 album(s)
UPDATE albums SET label = 'Cantaloupe Music' WHERE id IN ('an-atlas-of-deep-time-lhumain-ce-minuscule', 'david-handler-premier-disque-vraie-decouverte', 'evan-ziporyn-contaqt-repensent-eno-budd-fripp-et-bowie') AND (label IS NULL OR label = '');

-- CdM : 8 album(s)
UPDATE albums SET label = 'CdM' WHERE id IN ('cantigas-de-santa-maria-stimulante-compilation-reeditee-par-la-capella-de-ministrers', 'clair-obscur-un-voyage-autour-de-lunivers-fictionnel-de-cervantes', 'la-capella-de-ministrers-celebre-le-millieme-anniversaire-du-collier-de-la-colombe', 'la-creation-feminine-entre-le-12e-siecle-et-le-16e-siecle', 'liturgies-medievales-du-couvent-royal-de-sijena-aureolees-dans-la-magie-du-lieu', 'theatre-de-voix-pour-les-lamentations-pascales-de-morales', 'torbjorn-iwan-lundquist-une-autre-commemoration-de-2020', 'une-face-cachee-du-cancionero-de-uppsala-sobrement-visitee-par-la-capella-de-ministrers') AND (label IS NULL OR label = '');

-- Chanteloup Musique : 2 album(s)
UPDATE albums SET label = 'Chanteloup Musique' WHERE id IN ('le-nouvel-orgue-de-vouvant-chausse-ses-bottes-de-sept-lieues-avec-virgile-monin', 'quelques-mois-avant-le-centenaire-faure-le-requiem-autour-du-recent-orgue-de-vouvant') AND (label IS NULL OR label = '');

-- Colin Currie Records : 3 album(s)
UPDATE albums SET label = 'Colin Currie Records' WHERE id IN ('la-piece-maitresse-de-steve-reich-aux-mains-dun-maitre-des-percussions', 'les-variations-reich', 'reich-et-currie-sapplaudissent-a-la-fondation-vuitton') AND (label IS NULL OR label = '');

-- Coro : 8 album(s)
UPDATE albums SET label = 'Coro' WHERE id IN ('eclectique-programme-vesperal-par-le-choeur-du-prestigieux-magdalen-college-doxford', 'fastueuse-reconstitution-dun-office-de-vepres-en-souvenir-de-la-victoire-de-lepante', 'integrale-du-songbook-de-1611-le-radieux-chant-du-cygne-de-byrd', 'les-sixteen-a-la-sixtine-de-josquin-a-allegri-chant-sacre-a-la-chapelle-papale', 'mozart-et-haydn', 'reunion-en-un-album-des-messes-breves-de-bach-par-the-sixteen', 'symphonies-et-messes-de-haydn-par-harry-christophers-a-boston-la-fin', 'une-approche-intimiste-des-tenebrae-responsories-de-victoria') AND (label IS NULL OR label = '');

-- Cybele Records : 5 album(s)
UPDATE albums SET label = 'Cybele Records' WHERE id IN ('de-nouvelles-goldberg', 'jean-pierre-leguay-faire-entendre-ce-quon-ne-voit-pas', 'le-tout-jeune-rihm-improvise-et-senregistre-a-lorgue', 'limmense-zimmermann', 'orgue-profane') AND (label IS NULL OR label = '');

-- Deutsche Harmonia Mundi : 2 album(s)
UPDATE albums SET label = 'Deutsche Harmonia Mundi' WHERE id IN ('le-luth-dans-tous-ses-etats-dans-litalie-du-16eme-siecle', 'recital-a-loree-du-baroque-en-italie-leveil-des-passions') AND (label IS NULL OR label = '');

-- Dissonances Records : 3 album(s)
UPDATE albums SET label = 'Dissonances Records' WHERE id IN ('derapages-volontaires', 'une-integrale-mozart-authentique-au-gout-de-jour', 'une-lecon-de-vie-dun-pere-spirituel') AND (label IS NULL OR label = '');

-- ECL : 5 album(s)
UPDATE albums SET label = 'ECL' WHERE id IN ('couperin-chambriste-revisite-pour-le-duo-viole-et-clavecin', 'lempire-de-la-nuit-dans-le-clavecin-baroque-allemand', 'rome-1709-haendel-affronte-scarlatti-aux-claviers-brillant-hommage-sous-les-doigts-de-cristiano-gaudio', 'sonates-partitas-de-bach-un-fertile-parcours-organise-par-guillaume-rebinguet-sudre', 'vivaldi-guillaume-rebinguet-sudre-rend-les-sonates-pour-violon-a-lart-des-tenebrosi') AND (label IS NULL OR label = '');

-- Eloquentia : 2 album(s)
UPDATE albums SET label = 'Eloquentia' WHERE id IN ('herve-billaut-et-guillaume-coppola-a-quatre-mains-dans-une-espagne-vue-de-france', 'musique-du-silence-avec-guillaume-coppola') AND (label IS NULL OR label = '');

-- EnPhases : 3 album(s)
UPDATE albums SET label = 'EnPhases' WHERE id IN ('hommage-de-gaetane-prouvost-et-eliane-reyes-a-lecole-franco-belge-de-violon', 'lensemble-hexameron-ressuscite-les-salons-musicaux-sous-le-premier-empire', 'suites-pour-violoncelle-de-bach-nouvelles-parutions-par-deux-grandes-dames-de-larchet') AND (label IS NULL OR label = '');

-- Et'cetera : 14 album(s)
UPDATE albums SET label = 'Et''cetera' WHERE id IN ('capiteuse-version-de-lopus-3-du-grand-violoniste-russe-de-lepoque-classique', 'chants-americains', 'concertos-pour-clavecin-de-bach-reconsideres-par-pieter-dirksen-et-hugo-reyne', 'du-cote-derwin-schulhoff', 'imaginaire-vieille-autriche-pour-noel-enregistre-en-public-a-louvain', 'le-jeune-quatuor-webern-tente-laventure-des-quatuors-de-schoenberg', 'piano-romantique-flamand-concerto-chambriste-et-pages-solistes-sur-trois-instruments-depoque', 'rares-pages-chambristes-du-style-galant-sur-un-clavecin-roial-recemment-reinvente', 'recital-vocal-de-compositrices-contemporaines-la-lumiere-presque-a-tous-les-etages', 'sonates-pour-flute-de-bach-la-discographie-se-pare-dun-gouttereau', 'tout-premier-enregistrement-integral-des-agreables-pages-pour-clavecin-de-francois-krafft', 'un-classique-du-quatre-mains-mozartien-et-une-rare-transcription-de-la-jupiter', 'un-recital-autour-du-clavecin-a-anvers-entre-la-renaissance-et-le-premier-baroque', 'yarno-missiaen-dans-lorgelbuchlein-double-debut-dun-instrument-et-dun-talent-precoce') AND (label IS NULL OR label = '');

-- Evil Penguin Records : 5 album(s)
UPDATE albums SET label = 'Evil Penguin Records' WHERE id IN ('faure-et-gounod-par-herve-niquet', 'julien-libeer-elegant-dans-lipatti-touchant-dans-mozart', 'les-quintettes-de-mozart-et-beethoven-par-des-vents-et-un-pianoforte-truculents', 'lombre-de-j-s-bach-chez-mendelssohn', 'un-nouveau-repertoire-pour-le-violoncelle-par-pieter-wispelwey') AND (label IS NULL OR label = '');

-- FY Solstice : 7 album(s)
UPDATE albums SET label = 'FY Solstice' WHERE id IN ('derniere-etape-de-la-reedition-de-lhistorique-marathon-widorien-de-pierre-labric-a-rouen', 'hommage-a-fou-tsong-de-precieuses-archives-de-concert', 'les-widor-de-pierre-labric-sur-le-cavaille-coll-de-rouen-debut-dune-exhumation-a-thesauriser', 'les-widor-de-pierre-labric-sur-le-cavaille-coll-de-rouen-suite-dune-exhumation-a-thesauriser', 'notre-dame-sans-cochereau-echo-de-quatre-concerts-des-annees-1970', 'suite-des-widor-de-pierre-labric-sur-le-cavaille-coll-de-rouen-les-quatre-premieres-symphonies', 'superbe-hommage-a-pierre-cochereau-puise-a-un-fonds-dinedits') AND (label IS NULL OR label = '');

-- Fancymusic : 2 album(s)
UPDATE albums SET label = 'Fancymusic' WHERE id IN ('bizarre-bizarre', 'une-musique-de-vampire') AND (label IS NULL OR label = '');

-- Flora : 2 album(s)
UPDATE albums SET label = 'Flora' WHERE id IN ('aura-soave', 'couperin-royal') AND (label IS NULL OR label = '');

-- Fondamenta : 3 album(s)
UPDATE albums SET label = 'Fondamenta' WHERE id IN ('le-violoncelle-chantant', 'un-nouvel-heritage-pour-les-melomanes-etonnant-et-interessant', 'vladimir-tropp-deroule-le-fil-des-saisons-de-tchaikovski') AND (label IS NULL OR label = '');

-- Forlane : 2 album(s)
UPDATE albums SET label = 'Forlane' WHERE id IN ('escapades-un-voyage-dans-le-temps-et-dans-lespace-par-kanae-endo', 'integrale-messiaen-a-la-cathedrale-de-toul-par-une-academie-de-37-organistes') AND (label IS NULL OR label = '');

-- Gizeh Records : 3 album(s)
UPDATE albums SET label = 'Gizeh Records' WHERE id IN ('christine-ott-au-piano-petites-musiques-au-bord-de-la-nuit', 'christine-ott-et-mathieu-gabry-deux-gouttes-de-neige', 'christine-ott-et-mathieu-gabry-sur-grand-ecran') AND (label IS NULL OR label = '');

-- Harp & Co : 3 album(s)
UPDATE albums SET label = 'Harp & Co' WHERE id IN ('78905-2', 'les-oeuvres-pour-harpe-du-compositeur-paul-lewis', 'les-reves-de-dirk-michael-kirsch') AND (label IS NULL OR label = '');

-- Hyperion : 9 album(s)
UPDATE albums SET label = 'Hyperion' WHERE id IN ('bliss-et-rubbra-superbes-concertos-pour-piano-et-orchestre-par-piers-lane', 'composition-musicale-et-condiments-peuvent-ils-faire-bon-menage', 'concertos-pour-piano-belges-du-xixe-siecle', 'finzi-musique-chorale-des-iles-britanniques', 'integrale-de-loeuvre-pour-piano-seul-de-mendelssohn-par-howard-shelley-volume-5', 'john-taverner-forces-chorales', 'marc-andre-hamelin-dans-schubert', 'stephen-hough-inatteignable', 'violoncelle-solo') AND (label IS NULL OR label = '');

-- LPO Live : 4 album(s)
UPDATE albums SET label = 'LPO Live' WHERE id IN ('mozart-a-langlaise', 'un-plantureux-baiser-de-la-fee-par-vladimir-jurowski-a-londres', 'vladimir-jurowski-chef-a-poigne-dans-la-onzieme-de-chostakovitch', 'zubin-mehta-a-londres-couleurs-et-luxuriances') AND (label IS NULL OR label = '');

-- Lanvellec Éditions : 2 album(s)
UPDATE albums SET label = 'Lanvellec Éditions' WHERE id IN ('dramaturgie-des-mots-chant-monodique-dans-litalie-baroque-deux-nouvelles-parutions', 'frescobaldi-complete-moisson-de-canzoni-da-sonare-par-de-fins-mercenaires') AND (label IS NULL OR label = '');

-- Lauda : 3 album(s)
UPDATE albums SET label = 'Lauda' WHERE id IN ('1603-loffice-des-defunts-de-victoria-en-hommage-a-marie-dautriche', 'jose-de-nebra-exhumation-des-repons-de-noel-pour-la-chapelle-de-ferdinand-vi', 'musique-sacree-de-carlos-patino-a-la-cour-de-philippe-iv-maints-inedits-chaleureusement-chantes') AND (label IS NULL OR label = '');

-- Lyrinx : 6 album(s)
UPDATE albums SET label = 'Lyrinx' WHERE id IN ('couperin-et-chopin-de-la-france-a-la-pologne', 'le-nocturne-en-musique', 'rameau-de-printemps', 'trios-russes', 'un-grand-musicien-discret-capte-un-peu-tard', 'vittorio-forte-au-sommet-de-son-art') AND (label IS NULL OR label = '');

-- Lyrita : 12 album(s)
UPDATE albums SET label = 'Lyrita' WHERE id IN ('archives-radiophoniques-precieuses-du-chef-dorchestre-nikolai-malko', 'cantates-de-richard-blackford-de-saint-francois-dassise-au-covid-19', 'des-archives-symphoniques-de-la-bbc-pour-langlais-robert-simpson', 'george-lloyd-un-neo-classique-attachant-mais-meconnu', 'la-jeunesse-pianistique-inconnue-de-daniel-jones', 'le-villiers-quartet-revele-des-quatuors-de-jeunesse-de-william-alwyn', 'le-violoncelle-britannique', 'lunivers-insolite-des-symphonies-du-gallois-daniel-jones', 'nelson-un-opera-de-lennox-berkeley-sur-les-amours-et-le-destin-du-vainqueur-de-trafalgar', 'quand-gustav-holst-parodiait-verdi-et-wagner', 'rebecca-clarke-et-william-busch-deux-mini-integrales-pour-piano', 'six-facettes-du-concerto-pour-piano-britannique-au-xxe-siecle') AND (label IS NULL OR label = '');

-- MarchVivo : 2 album(s)
UPDATE albums SET label = 'MarchVivo' WHERE id IN ('en-concert-a-madrid-premier-enregistrement-de-deux-quatuors-de-conrado-del-campo', 'les-couperin-au-menu-dun-concert-madrilene-de-benjamin-alard') AND (label IS NULL OR label = '');

-- Melodiya : 7 album(s)
UPDATE albums SET label = 'Melodiya' WHERE id IN ('30189-2', 'drames-symphoniques', 'le-piano-mis-a-nu', 'legende-damour-de-melikov-par-valery-gergiev', 'prokofiev-pour-deux', 'ravel-par-svetlanov', 'un-coq-plaque-or') AND (label IS NULL OR label = '');

-- Mountain Records : 2 album(s)
UPDATE albums SET label = 'Mountain Records' WHERE id IN ('lisanne-soeterbroek-seule-avec-son-violon-dans-un-bach-leger-direct-et-affable', 'lopus-111-de-beethoven-et-la-sonate-pour-piano-de-klaas-de-vries-rapproches-par-bobby-mitchell') AND (label IS NULL OR label = '');

-- Myrios Classics : 9 album(s)
UPDATE albums SET label = 'Myrios Classics' WHERE id IN ('deux-concertos-pour-violoncelle-de-1966', 'excessive-perfection', 'kirill-gerstein-dans-la-justesse-historique', 'la-symphonie-n7-de-bruckner-par-francois-xavier-roth-leloge-de-la-simplicite', 'la-troisieme-de-bruckner-par-francois-xavier-roth-une-interpretation-qui-se-merite', 'les-quintettes-avec-clarinette-de-mozart-et-de-widmann-reunis-dans-un-alliage-de-magie-sonore', 'romances-oubliees', 's-war-einmal-il-etait-une-fois', 'un-triple-hommage-historique-litteraire-et-musical-a-komitas-et-debussy') AND (label IS NULL OR label = '');

-- NMC : 4 album(s)
UPDATE albums SET label = 'NMC' WHERE id IN ('la-musique-instrumentale-de-param-vir-entre-londres-et-delhi', 'les-soliloques-de-simaku-visionnaires-virtuoses-vivants', 'martin-suckling-un-sens-tres-personnel-de-lalliance-entre-couleurs-et-rigueur', 'slide-action-lavenir-selon-le-trombone') AND (label IS NULL OR label = '');

-- Nimbus : 4 album(s)
UPDATE albums SET label = 'Nimbus' WHERE id IN ('autoportrait-dun-grand-fauve-du-piano-a-travers-celui-de-mozart', 'le-piano-ephemere-de-turina-par-martin-jones', 'on-fete-mozart-a-yale', 'un-florilege-des-melodies-de-roger-quilter') AND (label IS NULL OR label = '');

-- Odradek : 5 album(s)
UPDATE albums SET label = 'Odradek' WHERE id IN ('couleurs-avec-artur-pizzaro-et-thomas-rosner', 'earl-wild-sous-les-doigts-de-vittorio-forte', 'la-nostalgie-ou-quelque-chose-comme-ca', 'lultime-voyage-pianistique-dun-compositeur-solitaire', 'vittorio-forte-sert-avec-eloquence-la-muse-de-nikolai-medtner') AND (label IS NULL OR label = '');

-- Ondine : 2 album(s)
UPDATE albums SET label = 'Ondine' WHERE id IN ('hindemith-kammermusik-acte-1', 'tremblement-de-terre-symphonique') AND (label IS NULL OR label = '');

-- Organroxx : 2 album(s)
UPDATE albums SET label = 'Organroxx' WHERE id IN ('creation-contemporaine-pour-voix-et-orgue-deux-nouvelles-parutions-chez-organroxx', 'premier-livre-du-clavier-bien-tempere-distille-au-clavicorde') AND (label IS NULL OR label = '');

-- Paradizo : 4 album(s)
UPDATE albums SET label = 'Paradizo' WHERE id IN ('autour-de-skip-sempe-un-siecle-de-renaissance-anglaise-visite-par-claviers-et-flutes-a-bec', 'fertiles-influences-franco-flamandes-au-temps-du-siecle-dor-espagnol', 'miroir-du-temps-bach-leonhardt-sempe-jeu-a-trois-mains', 'reedition-dun-rare-vinyle-de-gustav-leonhardt-a-lorgue-dedie-au-repertoire-elisabethain') AND (label IS NULL OR label = '');

-- Pentatone : 2 album(s)
UPDATE albums SET label = 'Pentatone' WHERE id IN ('gimeno-et-lorchestre-philharmonique-du-luxembourg-jouent-debussy', 'lamour-la-guerre') AND (label IS NULL OR label = '');

-- Présence Compositrices : 2 album(s)
UPDATE albums SET label = 'Présence Compositrices' WHERE id IN ('celia-oneto-bensaid-et-la-traversee-dantesque-de-marie-jaell', 'marie-vermeulin-met-en-valeur-la-poesie-picturale-de-fanny-mendelssohn') AND (label IS NULL OR label = '');

-- RCO Live : 7 album(s)
UPDATE albums SET label = 'RCO Live' WHERE id IN ('beethoven-a-amsterdam', 'horizons-contemporains-a-amsterdam', 'le-requiem-de-berlioz-par-antonio-pappano', 'rachmaninov-leffet-abduraimov', 'requiem-pour-jerome-bosch-par-detlev-glanert', 'salome-symphonie-avec-voix', 'une-fois-de-plus-jeanne-de-lorraine-revoit-le-film-de-sa-vie-dans-le-chef-doeuvre-dhonegger-et-de-claudel') AND (label IS NULL OR label = '');

-- Raumklang : 2 album(s)
UPDATE albums SET label = 'Raumklang' WHERE id IN ('baroque-germanique-enjoleurs-dialogues-darchets-en-scordatura', 'singuliere-rencontre-avec-hildegarde-von-bingen-une-derniere-fois-visitee-par-maria-jonas') AND (label IS NULL OR label = '');

-- SFS Media : 7 album(s)
UPDATE albums SET label = 'SFS Media' WHERE id IN ('6793', 'alban-berg-humaniste-avec-michael-tilson-thomas', 'du-pur-debussy', 'lorchestre-samuse', 'retrouvailles-reussies-entre-john-adams-et-le-san-francisco-symphony', 'tilson-thomasaxsan-francisco-symphony-un-plaisir-reciproque', 'troisieme-symphonie-de-copland-la-nouvelle-version-de-reference') AND (label IS NULL OR label = '');

-- Seulétoile : 3 album(s)
UPDATE albums SET label = 'Seulétoile' WHERE id IN ('barbara-strozzi-entre-poesie-du-xviie-siecle-et-lyrisme-de-notre-temps', 'helene-de-montgeroult-sur-un-pianoforte-carre-dantoine-neuhaus', 'le-repertoire-des-virginalistes-visite-par-les-archets-du-duo-coloquintes') AND (label IS NULL OR label = '');

-- Sonamusica : 2 album(s)
UPDATE albums SET label = 'Sonamusica' WHERE id IN ('couperin-selon-michele-deverite', 'la-fleur-dans-la-cantate-baroque-italienne-un-recital-forcene') AND (label IS NULL OR label = '');

-- Soond : 7 album(s)
UPDATE albums SET label = 'Soond' WHERE id IN ('a-lassaut-de-sommes-pianistiques-signees-messiaen', 'black-museum-francois-villon-et-grand-corps-malade-refont-le-monde', 'fractionated-une-preuve-de-concept', 'gesualdo-deux-nouveaux-enregistrements-des-livres-4-et-5-venin-de-tarentule-et-collegium-vocale-en-antidote', 'mardirossian-crassin-minimal-ambient-contemporain', 'philip-glass-melodie-le-retour', 'polaroids-la-ou-est-lensemble-hopper-aujourdhui') AND (label IS NULL OR label = '');

-- Sub Rosa : 4 album(s)
UPDATE albums SET label = 'Sub Rosa' WHERE id IN ('clara-levy-voyage-au-centre-du-violon', 'ensembles-une-puissante-miscellanee-musicale', 'for-cathy-a-capella-album-a-tribute-to-cathy-berberian-avec-sarah-defrise', 'fred-frith-et-musiques-nouvelles-lexploration-musicale-dun-paysage') AND (label IS NULL OR label = '');

-- TYXart : 8 album(s)
UPDATE albums SET label = 'TYXart' WHERE id IN ('anastasia-zorina-et-chopin-entre-danse-lyrisme-et-visions-davenir', 'brahms-une-integrale-pour-orgue-envoutee-par-le-cadre-magique-de-saint-florian', 'le-duo-maiss-you-met-le-violon-et-lalto-sur-un-pied-degalite', 'lexpressivite-epanouie-du-cor-de-herve-joulain', 'musiques-mexicaines', 'trois-quatuors', 'un-violon-qui-chante', 'une-vie-en-melodies') AND (label IS NULL OR label = '');

-- Tempéraments : 2 album(s)
UPDATE albums SET label = 'Tempéraments' WHERE id IN ('lart-de-la-transcription-par-vincent-genvrin-sur-lorgue-de-lauditorium-de-radio-france', 'rhabillage-des-suites-de-guilain-par-andre-isoir-en-alternance-dun-grisant-plain-chant') AND (label IS NULL OR label = '');

-- Triton : 2 album(s)
UPDATE albums SET label = 'Triton' WHERE id IN ('la-musique-de-philippe-chamouard', 'melodies-du-vent-et-de-la-pluie') AND (label IS NULL OR label = '');

-- VOX-NX : 12 album(s)
UPDATE albums SET label = 'VOX-NX' WHERE id IN ('fin-de-la-reedition-audiophile-du-tchaikovsky-epure-dabravanel-un-manfred-vu-den-haut', 'gershwin-concertant-reedition-audiophile-des-enregistrements-de-jeffrey-siegel-et-leonard-slatkin', 'hommage-a-stanislaw-skrowaczewski', 'ma-patrie-dans-le-missouri-walter-susskind-en-quete-de-la-juste-tradition-tcheque', 'reedition-audiophile-des-grieg-de-maurice-abravanel-1-2', 'reedition-audiophile-du-tchaikovsky-de-maurice-abravanel-une-quatrieme-decantee', 'reedition-audiophile-du-tchaikovsky-epure-dabravanel-les-deux-dernieres-symphonies', 'reedition-audiophile-du-tchaikovsky-epure-dabravanel-les-trois-premieres-symphonies', 'reedition-audiophile-dune-probe-scheherazade-mais-un-smetana-tres-en-verve', 'stanislaw-skrowaczewski-dirige-ravel-style-et-puissance', 'symphonie-no-3-de-rachmaninov-une-audiophile-reedition-une-demonstrative-parution', 'taiga-et-utah-reedition-audiophile-des-grieg-de-maurice-abravanel-2-2') AND (label IS NULL OR label = '');

COMMIT;