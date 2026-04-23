# Roadmap Phono.Crescendo

État d'avancement et prochains chantiers, mis à jour après les deux journées de travail des 22-23 avril 2026.

---

## ✅ TERMINÉ (23 avril 2026)

- **Chantier labels NULL** : ~460 labels récupérés (de 1202 à ~740 articles sans label). Le reliquat est majoritairement non-discographique (concerts, hommages, dossiers) — pas pertinent de continuer.
- **Page `/compositrices` basculée sur `gender='F'` en DB** (fin de la liste hardcodée de 29 noms).
- **29 compositrices marquées `F`** en DB (migration `migrations/fill-gender-compositrices.sql`).
- **Scraper à 6 runs/jour** (02/06/10/14/18/22 UTC) avec short-circuit `processPost` qui skippe les articles déjà complets — protège les corrections manuelles (title, composers) sinon réécrites à chaque upsert.
- **Page `/labels` enrichie** : tri Millésimes / Jokers, fiches détail `/labels/[name]`, top 5 compositeurs par label.
- **4 erreurs d'attribution Naxos corrigées** (DGG, Belvedere, Indesens × 2).

## ⏸️ EN DETTE (à revisiter plus tard)

- Erreurs d'attribution possibles sur d'autres labels — à spotter au fur et à mesure.
- Créer le compositeur **Louise Bertin** en DB (actuellement absente).
- Tagger **Sofia Avramidou** comme `F` et réactiver son affichage sur `/compositrices` quand un album sera chroniqué (actuellement masquée par le filtre `nb_albums >= 1`).

## 🔜 CHANTIERS À VENIR (par priorité)

1. **Page `/interpretes`** — exploiter la table `interprets` sous-exploitée (voir Chantier 2 ci-dessous).
2. **Parcours thématiques curatés** — travail éditorial (voir Chantier 4).
3. **Badge « Joker » plus visible** sur les fiches albums.
4. **Filtre par année** sur `/albums`.
5. **Affiliations Presto / Qobuz** — petit revenu (Chantier 9).
6. **Export / partage de sélections** (voir Chantier 6).
7. **Table `labels` avec métadonnées** (pays, fondation, URL) — si l'envie éditoriale se présente.

## 🛠️ AMÉLIORATIONS TECHNIQUES POSSIBLES

- **Scraper** : privilégier le header technique de l'article plutôt que les tags WP, pour éviter les faux positifs du type « Naxos distributeur » étiquetés à tort sur des labels tiers.
- **`.env.local`** : ajouter `SUPABASE_DB_URL` pour débloquer les futurs scripts de maintenance en local (aujourd'hui placeholder, il faut passer par Supabase SQL Editor ou Vercel à chaque fois).

---

## Backlog détaillé par chantier

**Échelle de complexité** : S (≤ 1 j), M (2-5 j), L (semaine+).
**Dépendances** = ce qui doit être en place ou ajouté avant/pendant le chantier.

### 1. Moteur de recherche unifié
Recherche transversale (compositeurs, interprètes, albums, labels) avec pertinence, tolérance aux accents et fuzzy matching.
Remplace le `ILIKE` basique actuel de `/recherche` par un ranking multi-index.

- **Complexité** : M
- **Dépendances** : extension `pg_trgm` côté Supabase + index GIN, ou service externe (Algolia / Typesense). Pas de changement de schéma lourd.

---

### 2. Page interprètes (exploitation table `interprets`)
Les pages `/interpretes` et `/interpretes/[name]` existent mais se limitent à nom + compteur d'albums.
Enrichir avec tri popularité, typologie (chef / soliste / ensemble), portraits, et listes de collaborations récurrentes.

- **Complexité** : M
- **Dépendances** : enrichissement de la table `interprets` (colonnes `role`, `instrument`, `bio`, `photo_url`) + scraper pour populer, ou saisie éditoriale manuelle.

---

### 3. Matrimoine étoffé (compositrices)
✅ **Livré 2026-04-23** — `/compositrices` bascule sur `.eq('gender', 'F')` en DB, liste hardcodée supprimée, tri `nb_albums` desc, filtre `nb_albums >= 1` pour masquer les entrées sans album chroniqué. 29 compositrices taggées via `migrations/fill-gender-compositrices.sql`. Élargissement au-delà du noyau reste ouvert (audit complet de la colonne `gender` sur les 608 compositeurs, bios enrichies).

---

### 4. Parcours thématiques curatés
Dossiers éditoriaux type « Intégrales Mahler », « Pianistes belges », « Baroque français aujourd'hui », « Figures du Matrimoine ».
Page `/parcours/[slug]` avec intro, sélection d'albums, liens vers les chroniques.

- **Complexité** : L
- **Dépendances** : nouvelle table `parcours` (id, slug, title, intro, album_ids[]) + workflow d'édition (UI admin ou MDX versionné dans le repo).

---

### 5. Similarité entre albums
« Si vous avez aimé X, écoutez aussi Y ». Suggestions contextuelles en bas de chaque fiche album.
Calcul offline simple : score agrégé basé sur compositeurs communs, label identique et période identique.

- **Complexité** : L
- **Dépendances** : job batch qui précalcule les top-N voisins par album (table `album_similars` ou colonne JSON `similar_ids`), relancé à chaque scrape. `pgvector` + embeddings sémantiques envisageables plus tard si on veut exploiter le texte de critique enrichi.

---

### 6. Export / partage (listes perso, CSV, playlists)
Exports CSV des résultats de `/albums` filtrés + listes personnelles sauvegardées (favoris).
Génération de playlists Spotify / Apple Music à partir d'une sélection d'albums.

- **Complexité** : L
- **Dépendances** : auth utilisateur (Supabase Auth) pour les listes perso. Intégrations API Spotify/Apple Music pour les playlists (OAuth, matching ISRC/metadata).

---

### 7. API publique lecture seule
Endpoints REST stables `/api/albums`, `/api/compositeurs`, `/api/millesimes`… avec pagination, rate limiting et CORS ouvert.
Destinés aux intégrateurs tiers (chercheurs, médias partenaires, widget interne). Le versioning (`/api/v1/…`) sera introduit si et quand on a des consommateurs externes documentés.

- **Complexité** : M
- **Dépendances** : docs OpenAPI/Swagger légères, middleware de rate limiting (Upstash Redis ou Vercel KV), décision de stabilité sur les champs exposés.

---

### 8. Widget intégrable
Script `<script src="https://phono.crescendo-magazine.be/widget.js">` qui permet à un site tiers d'afficher un module (« Derniers Jokers », « Album du jour », « Top Millésime de l'année »).
Iframe ou Web Component avec Shadow DOM pour l'isolation CSS.

- **Complexité** : M
- **Dépendances** : chantier 7 (API publique) pour la source de données, build dédié léger (< 30 KB gzippé), page de documentation d'intégration.

---

## Non-objectifs identifiés

- **Écoute intégrée** (lecteur audio in-site) — reste volontairement hors scope, le site est référence critique, pas plateforme de streaming. Le bouton « Écouter sur Presto » suffit comme pont vers l'écoute.
- **Commentaires utilisateurs** — la valeur éditoriale vient de Crescendo Magazine, pas des notations externes.
- **Multilingue** — pas à l'agenda 2026. Si un besoin anglophone émerge (export API, parcours internationaux), traitement au cas par cas sans i18n générale.
