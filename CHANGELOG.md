# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### ✨ Ajouté - 2025-10-21

#### Système de Recherche avec Autocomplétion
- **Recherche intelligente dans tous les contenus** : Indexation automatique de tous les fichiers markdown des dossiers `content/`
  - Indexation au chargement avec cache en mémoire pour performances optimales
  - Recherche multi-critères : titre, tags, extrait et contenu complet
  - Algorithme de scoring intelligent pour classer les résultats par pertinence
  - Limite de 10 résultats affichés avec surlignage des termes recherchés
  
- **Interface utilisateur élégante**
  - Dropdown de résultats sous le champ de recherche avec animation
  - Affichage des métadonnées : catégorie, tags, extrait
  - Icônes colorées par catégorie pour identification rapide
  - Design responsive adapté mobile et desktop
  
- **Navigation au clavier complète**
  - `Ctrl+K` : Focus sur le champ de recherche
  - `↑/↓` : Navigation dans les résultats
  - `Enter` : Ouvrir le résultat sélectionné
  - `Escape` : Fermer les résultats
  
- **Fichiers ajoutés**
  - `assets/js/search.js` : Logique de recherche et indexation (300 lignes)
  - `assets/css/search.css` : Styles du système de recherche (200 lignes)
  - `docs/SEARCH-SYSTEM.md` : Documentation complète du système

### ✨ Ajouté - 2025-01-19

#### Intégration Mermaid.js pour les Diagrammes
- **Support complet de Mermaid.js** : Rendu automatique des diagrammes dans les fichiers Markdown
  - Détection automatique des blocs ` ```mermaid ` via renderer personnalisé de marked.js
  - Configuration du renderer dans `content.html` pour transformer les blocs en `<div class="mermaid">`
  - Initialisation automatique avec adaptation au thème clair/sombre
  - Fonction `refreshMermaid()` pour recharger les diagrammes lors du changement de thème
  
- **Types de diagrammes supportés**
  - Diagrammes de flux (flowchart) : LR, TD, RL, BT
  - Diagrammes de séquence (sequence)
  - Diagrammes de classes (class)
  - Diagrammes d'état (state)
  - Diagrammes de Gantt
  - Diagrammes circulaires (pie)
  - Diagrammes ERD (entity relationship)
  - User Journey
  
- **Styles CSS personnalisés**
  - Conteneur avec fond, bordure et padding adaptatifs
  - Adaptation automatique des couleurs au thème du site
  - Scrollbar horizontale pour les diagrammes larges
  - Styles pour les nœuds, flèches et labels
  
- **Documentation complète**
  - Guide d'utilisation : `docs/MERMAID-INTEGRATION.md`
  - Exemples pratiques pour l'agilité (Impact Mapping, Scrum, Kanban)
  - Syntaxe et personnalisation des diagrammes
  - Bonnes pratiques et dépannage

- **Bibliothèque externe**
  - Mermaid.js v10.6.1 chargé via CDN dans `content.html`
  - Configuration optimisée pour le rendu et la performance

### ✨ Ajouté - 2025-01-18

#### Intégration PocketBase - Velocity Squad v1.0
- **Gestion des sessions d'équipe** : Système complet de sessions réutilisables
  - Création de nouvelles sessions avec nom personnalisé
  - Chargement de sessions existantes via paramètre URL `?session=ID`
  - Mode démo sans session (localStorage uniquement)
  - Affichage du nom de session dans l'en-tête
  
- **Collections PocketBase créées**
  - `tools_velocity_squad_sessions` : Sessions d'équipe avec paramètres (framework, sprint_length, working_days)
  - `tools_velocity_squad_sprints` : Sprints avec vélocité et date de fin
  - `tools_velocity_squad_team` : Membres d'équipe avec compétences et capacité
  - `tools_velocity_squad_annotations` : Faits marquants sur les sprints (6 types)
  - `tools_velocity_squad_mood` : Suivi de l'humeur quotidienne de l'équipe

- **Synchronisation automatique**
  - Sauvegarde automatique des sprints lors de l'ajout manuel
  - Sauvegarde automatique des membres d'équipe
  - Sauvegarde automatique des annotations (faits marquants)
  - Sauvegarde automatique du mood tracking
  - Suppression synchronisée avec PocketBase

- **Interface utilisateur**
  - Bouton "➕ Nouvelle Session" dans l'en-tête
  - Notification en mode démo avec bouton de création de session
  - Notification si session introuvable avec options de récupération
  - Affichage du nom de session dans le titre

- **Migrations PocketBase**
  - 5 migrations créées pour les collections Velocity Squad
  - Relations cascade entre session et données associées
  - Index optimisés pour les requêtes fréquentes
  - Règles d'accès configurées (lecture/écriture publique)

- **Documentation**
  - `README-POCKETBASE.md` : Guide complet d'utilisation
  - Architecture des collections détaillée
  - Cas d'usage multiples (équipe unique, plusieurs équipes, historique)
  - Guide de dépannage

### ✨ Ajouté - 2025-01-14

#### Intégration PocketBase - Skills Matrix v2.0
- **Stockage cloud fonctionnel** : Données synchronisées avec PocketBase
  - Adaptation aux nouvelles collections (migrations v1.0.1)
  - Chargement automatique depuis PocketBase au démarrage
  - Création automatique d'une matrice par défaut si inexistante
  - Conversion intelligente des données PocketBase → Application
  - Fallback automatique vers localStorage si PocketBase indisponible
  
- **Fonctions de sauvegarde complètes**
  - Sauvegarde membres avec email et rôle
  - Sauvegarde skills (niveau + appétence) et ownerships (rôle)
  - Création automatique des items manquants
  - Synchronisation complète de toutes les données
  - Synchronisation automatique toutes les 5 minutes

- **Gestion des templates PocketBase**
  - Chargement des 5 templates prédéfinis
  - Application d'un template avec création de matrice
  - Support complet des templates avec skills, ownerships et membres

- **Interface utilisateur améliorée**
  - Badge de stockage dynamique : Local (navigateur) ↔ Cloud (actif)
  - Mise à jour visuelle du mode de stockage
  - Indication claire du statut de connexion PocketBase

- **PocketBase Manager réutilisable** (`/assets/js/pocketbase-manager.js`)
  - Gestionnaire centralisé pour tous les outils
  - API complète : getRecords, getRecord, createRecord, updateRecord, deleteRecord
  - Système de cache intelligent
  - Synchronisation automatique configurable
  - Documentation complète avec exemples (Planning Poker, Ikigai)

- **Documentation complète**
  - `POCKETBASE-MANAGER-GUIDE.md` : Guide complet du gestionnaire
  - `POCKETBASE-INTEGRATION-V2.md` : Intégration Skills Matrix détaillée
  - `INTEGRATION-POCKETBASE-COMPLETE.md` : Synthèse complète
  - `AUTO-SYNC-GUIDE.md` : Guide de synchronisation automatique

#### Synchronisation Automatique en Temps Réel
- **Auto-sync sur toutes les modifications** : Synchronisation immédiate avec PocketBase
  - ✅ Ajout/modification/suppression de membres
  - ✅ Ajout/modification de compétences
  - ✅ Changement de niveaux (0-4)
  - ✅ Ajout/suppression d'appétences
  - ✅ Ajout/suppression d'ownerships
  
- **Override intelligent des fonctions**
  - Interception de `addMember()`, `editMemberName()`, `deleteMember()`
  - Interception de `addSkill()`, `editSkillName()`
  - Interception de `addAppetence()`, `removeAppetence()`
  - Interception de `addOwnership()`, `removeOwnership()`
  - Sauvegarde automatique via `saveData()` pour les changements de niveau
  
- **Synchronisation périodique**
  - Sync complète toutes les 5 minutes
  - Garantit la cohérence des données
  - Logs de confirmation dans la console
  
- **Expérience utilisateur améliorée**
  - Aucune action manuelle requise
  - Feedback visuel dans la console (✅ logs)
  - Transparente et instantanée

### ✨ Ajouté - 2025-01-14

#### Migrations PocketBase - Skills Matrix (Version Finale)
- **Architecture optimisée en 5 tables** : Fusion skills + ownerships pour simplifier
- **Organisation par collection** : Un fichier de migration par collection pour meilleure maintenabilité
  - `tools_skills_matrix_matrices` : Contexte des matrices (équipe, projet)
  - `tools_skills_matrix_members` : Membres/personnes de l'équipe
  - `tools_skills_matrix_items` : Skills ET Ownerships fusionnés (type discriminant)
  - `tools_skills_matrix_member_items` : Associations membres ↔ items (pivot)
  - `tools_skills_matrix_templates` : Templates prédéfinis pour création rapide
- **11 fichiers de migration créés** (1247 lignes de code) :
  - **Création des collections** (5 fichiers) :
    - `1757700001_create_matrices.js` : Collection matrices (contexte)
    - `1757700002_create_members.js` : Collection members (membres)
    - `1757700003_create_items.js` : Collection items (skills + ownerships)
    - `1757700004_create_member_items.js` : Collection member_items (associations)
    - `1757700005_create_templates.js` : Collection templates
  - **Seed data matrice demo** (4 fichiers) :
    - `1757700020_seed_matrices.js` : 1 matrice "Équipe Demo"
    - `1757700021_seed_members.js` : 2 membres (Alice, Bob)
    - `1757700022_seed_items.js` : 4 items (2 skills + 2 ownerships)
    - `1757700023_seed_member_items.js` : 5 associations
  - **Seed data templates** (2 fichiers) :
    - `1757700030_seed_templates_part1.js` : Templates Authentification + Tribu VALUE
    - `1757700031_seed_templates_part2.js` : Templates E-commerce + Recherche + Paiement
- **5 templates prédéfinis** :
  - 🔐 Authentification (Tech) : 6 skills sécurité + 2 ownerships + 3 membres
  - 🎯 Tribu VALUE (Agile) : 17 skills coaching + 2 ownerships + 14 membres
  - 🛒 Panier e-commerce (Business) : 6 skills e-commerce + 3 ownerships + 3 membres
  - 🔍 Recherche (Tech) : 6 skills search + 2 ownerships + 3 membres
  - 💳 Paiement (Business) : 6 skills paiement + 3 ownerships + 3 membres
- **Documentation complète** (8 fichiers) :
  - `bdd/pb_migrations/README.md` : Documentation des migrations
  - `bdd/pb_migrations/STRUCTURE.md` : Organisation des fichiers
  - `bdd/ARCHITECTURE.md` : Schéma de base de données
  - `bdd/COMMANDS.md` : Guide des commandes PocketBase/PM2
  - `bdd/WORKFLOW.md` : Workflows d'utilisation
  - `bdd/validate-migrations.js` : Script de validation automatique
  - `MIGRATIONS-SKILLS-MATRIX.md` : Récapitulatif et guide
  - `MIGRATIONS-FINALES.md` : Version finale avec corrections
- **Avantages de l'architecture** :
  - Réduction de 28% du nombre de tables (7 → 5)
  - Organisation par collection (un fichier = une collection)
  - Requêtes simplifiées avec moins de jointures
  - Extensibilité facilitée (ajout de types : certification, tool, etc.)
  - Templates pour création rapide de matrices
  - Relations avec cascade delete automatique
  - Index optimisés pour les performances
  - Validation automatique (0 erreur, 0 avertissement)

### 🔧 Corrigé - 2025-10-14

#### Migrations PocketBase - Corrections Complètes (v1.0.1)
- **Fix 1 : Relations entre collections** - Utilisation des IDs au lieu des noms
  - Correction de `1757700002_create_members.js` : Récupération de l'ID de matrices
  - Correction de `1757700003_create_items.js` : Récupération de l'ID de matrices
  - Correction de `1757700004_create_member_items.js` : Récupération des IDs (3 collections)
  - Résolution de l'erreur "The relation collection doesn't exist"
  - Pattern appliqué : `app.findCollectionByNameOrId()` avant création des relations

- **Fix 2 : ID de collection manquant** - Ajout de l'attribut `id` dans toutes les collections
  - Correction de `1757700001_create_matrices.js` : Ajout de `id: "tools_skills_matrix_matrices"`
  - Correction de `1757700002_create_members.js` : Ajout de `id: "tools_skills_matrix_members"`
  - Correction de `1757700003_create_items.js` : Ajout de `id: "tools_skills_matrix_items"`
  - Correction de `1757700004_create_member_items.js` : Ajout de `id: "tools_skills_matrix_member_items"`
  - Correction de `1757700005_create_templates.js` : Ajout de `id: "tools_skills_matrix_templates"`

- **Fix 3 : Utilisation incorrecte de Dao** - Remplacement par l'API directe de `app`
  - Correction de tous les fichiers de seed (6 fichiers)
  - Remplacement de `new Dao(app)` par utilisation directe de `app`
  - Remplacement de `dao.saveRecord()` par `app.save()`
  - Remplacement de `dao.findFirstRecordByData()` par `app.findRecordsByFilter()`
  - Résolution de l'erreur "ReferenceError: Dao is not defined"

- **Fix 4 : Méthodes de recherche** - Utilisation correcte de l'API PocketBase
  - Remplacement de `findFirstRecordByData()` par `findRecordsByFilter()`
  - Pattern appliqué : `app.findRecordsByFilter(collection.id, "filter", "sort", limit)`
  - Ajout de vérifications d'existence des records avant utilisation

- **Documentation des corrections** :
  - `CORRECTIONS-FINALES.md` : Guide complet des corrections appliquées
  - Patterns de code validés et documentés
  - Validation finale : 0 erreur, 0 avertissement

### 🔧 Corrigé - 2025-10-07

#### Markdown - Phase 3 : Parser professionnel
- **Intégration de marked.js et js-yaml** : Remplacement du parser maison par des bibliothèques robustes
  - Ajout de marked.js v11.1.1 pour le parsing Markdown
  - Ajout de js-yaml v4.1.0 pour le parsing du front matter
  - Fonction `parseMarkdownAdvanced()` avec extraction de métadonnées
  - Fonction `loadMarkdownFileWithMetadata()` pour charger avec métadonnées
  - Fallback intelligent vers le parser maison si bibliothèques indisponibles
  - Support complet de GitHub Flavored Markdown (GFM)
  - Génération automatique d'extraits
  - Configuration optimisée de marked.js

#### Markdown - Phase 2 : Support des tableaux
- **Parser de tableaux Markdown** : Conversion automatique des tableaux en HTML
  - Fonction `parseMarkdownTables()` pour détecter les tableaux
  - Fonction `convertTableToHtml()` pour générer le HTML
  - Support des headers (`<thead>`)
  - Support des données (`<tbody>`)
  - Détection automatique du format Markdown (lignes avec `|`)
  - Nettoyage et trim des cellules
  - Styles CSS appliqués automatiquement (hover, zebra striping, bordures)

#### Markdown - Phase 1 : Styles améliorés
- **Création de markdown.css** : Fichier CSS dédié pour le rendu Markdown
  - Puces personnalisées (3 niveaux avec styles différents)
  - Citations stylisées avec guillemets décoratifs
  - Variantes de citations (warning, info, success, error)
  - Code inline avec bordure et couleur primaire
  - Blocs de code avec scrollbar personnalisée
  - Badges/tags avec variantes de couleurs
  - Tableaux avec hover et zebra striping
  - Liens avec icône pour les externes
  - Images avec bordure et ombre
  - Notes/callouts colorés
  - Accordéons (`<details>`) stylisés
  - Emphase variée (strong, em, mark, del, u)
  - Listes de définitions (dl, dt, dd)
  - Réduction des interlignes pour un rendu plus compact
- **Intégration dans content.html** : Ajout du lien CSS + suppression des styles inline

#### Système de partiels - Phase 5 : Compteurs et tabs
- **Compteur de ressources dynamique** : Affichage du nombre réel d'articles par catégorie
  - Chargement automatique depuis les fichiers `index.json` de chaque catégorie
  - Mapping des IDs de catégories vers les noms de dossiers
  - Chargement parallèle avec `Promise.all` pour optimiser les performances
  - Pluriel correct : "1 ressource" vs "2 ressources"
  - Gestion d'erreurs : affiche 0 si le fichier n'existe pas
- **Ajout de main.js dans category.html** : Fix du menu qui ne s'affichait pas
- **Tabs fonctionnels** : Filtrage par "Tout voir", "Favoris", "Récents"
  - Event listeners sur les tabs
  - Fonction `filterSidebarCategories()` pour filtrer l'affichage
  - Mise à jour du compteur de favoris
  - Attribut `data-category` ajouté aux items pour le filtrage

#### Système de partiels - Phase 4 : Sidebar visible sur desktop
- **Comportement responsive amélioré** : Sidebar visible par défaut sur desktop
  - Desktop (≥1025px) : Sidebar visible en permanence sous le header
  - Contenu principal décalé de 280px à gauche sur desktop
  - Bouton burger caché sur desktop
  - Overlay désactivé sur desktop
  - Mobile/Tablet : Comportement inchangé (slide-in avec overlay)
  - Breakpoints : Desktop 1025px+, Tablet 768-1024px, Mobile ≤767px
  - Meilleure UX : Navigation toujours accessible sur grands écrans

#### Système de partiels - Phase 3 : Fix CSS de la sidebar
- **Création du fichier `sidebar.css`** : Ajout de tous les styles manquants pour la sidebar
  - Styles pour le container sidebar (position fixed, slide-in animation)
  - Styles pour l'overlay (backdrop blur, fade-in/out)
  - Styles pour le header de la sidebar
  - Styles pour les tabs (Tout voir, Favoris, Récents)
  - Styles pour les items de catégories (hover, transitions)
  - Styles pour les icônes emoji et compteurs
  - Styles pour les boutons favoris
  - Scrollbar personnalisée
  - Responsive design (320px → 280px → 100%)
- **Ajout de la logique burger menu** dans `navigation.js`
  - Fonction `toggleSidebar()` pour ouvrir/fermer
  - Fonction `closeSidebar()` pour fermer au clic sur overlay
  - Event listeners sur burger button et overlay
- **Intégration du CSS** dans toutes les pages HTML
  - Ajout de `sidebar.css` dans index.html
  - Ajout de `sidebar.css` dans category.html
  - Ajout de `sidebar.css` dans content.html

#### Système de partiels - Phase 2 : Fix du chargement
- **Fix chargement des partiels** : Correction des problèmes de timing et d'affichage
  - Ajout du script `partials-loader.js` manquant dans `category.html`
  - Attente de l'événement `partialsLoaded` avant d'accéder aux éléments du header/sidebar
  - Ajout de la fonction `renderCategoriesNav()` pour remplir le menu latéral
  - Fix de l'erreur "Cannot read properties of null" dans category.html
  - Le menu latéral affiche maintenant toutes les catégories avec leurs icônes
  - Boutons favoris fonctionnels dans la sidebar

#### Système de partiels - Phase 1 : Migration
- **Système de partiels** : Correction de content.html qui contenait encore le code HTML en dur
  - Remplacement du header par le placeholder (70 lignes → 1 ligne)
  - Remplacement de la sidebar par le placeholder (50 lignes → 1 ligne)
  - Remplacement du footer par le placeholder (90 lignes → 1 ligne)
  - Ajout du script partials-loader.js
  - Le menu latéral s'affiche maintenant correctement

### À venir

- Mode clair/sombre switchable
- Export PDF des contenus
- Traduction anglaise
- PWA (Progressive Web App)

---

## [1.0.0] - 2025-10-07

### 🎉 Première version publique

#### ✨ Ajouté

- **Homepage avec wizard intelligent** en 3 étapes

  - Sélection du rôle (Scrum Master, PO, Coach...)
  - Définition de l'objectif
  - Contexte de travail
  - Recommandations personnalisées

- **14 catégories thématiques complètes** :

  - 🎯 Fondamentaux
  - 🚵 Frameworks
  - 📦 Delivery & Amélioration
  - 🎭 Animation & Facilitation
  - 🛡️ Gestion des Défis
  - 👑 Leadership & Coaching
  - 🏗️ Multi-équipes & Scale
  - 🎯 Contextes Spécialisés
  - 🎨 Product & Design
  - 🌱 Transformation & Culture
  - 🛠️ Outils & Technologies
  - 📚 Développement Coach
  - 📋 Ressources & REX
  - ⚙️ Outils Interactifs

- **Sidebar de navigation** :

  - Onglets : Tout voir / Favoris / Récents
  - Icônes colorées par catégorie
  - Recherche en temps réel
  - Compteur de contenus par catégorie

- **Système de favoris** :

  - Sauvegarde locale (localStorage)
  - Gestion des catégories et outils favoris
  - Interface dédiée

- **Outils interactifs** (v1.0) :

  - Example Mapping
  - Planning Poker
  - Rétrospectives (multiples formats)
  - Velocity Squad
  - Ikigai personnel
  - Ikigai d'engagement
  - Skills Matrix
  - Agile Fluency Model

- **Interprétation Markdown** :

  - Parser custom sans dépendance externe
  - Support complet : titres, listes, tableaux, code, blockquotes
  - Styles adaptés au dark mode

- **Design system complet** :

  - Variables CSS personnalisables
  - Composants réutilisables (cards, badges, boutons...)
  - Thème sombre par défaut
  - Palette de 14 couleurs pour les catégories

- **Responsive design** :

  - Adaptation mobile, tablette, desktop
  - Burger menu sur mobile
  - Sidebar latérale mobile
  - Icônes uniquement en petit écran

- **Performance** :

  - Aucune dépendance externe (0 npm packages)
  - Chargement < 1s
  - Lighthouse Score > 95

- **Accessibilité** :

  - ARIA labels
  - Contraste WCAG AAA
  - Navigation au clavier

- **URLs partageables** :
  - Chaque page a une URL unique
  - Deep linking pour catégories et outils
  - Bouton de partage intégré

#### 📖 Documentation

- README.md complet avec guide d'utilisation
- DOCUMENTATION.md technique détaillée
- README.md par outil interactif
- Structure de projet documentée

#### 🛠️ Infrastructure

- Configuration JSON centralisée (`config/config.json`)
- Architecture modulaire et scalable
- Séparation CSS par domaine (variables, base, components, layout, responsive)
- JavaScript organisé en modules logiques

---

## [0.9.0] - 2025-09-23 (Beta)

### ✨ Ajouté

- Prototype du wizard de navigation
- 5 premières catégories (Fondamentaux, Frameworks, Delivery, Animation, Défis)
- Structure de base HTML/CSS/JS
- Premiers outils interactifs (Planning Poker, Rétrospectives)

### 🐛 Corrigé

- Problèmes de scroll sur sidebar mobile
- Conflits CSS entre composants
- Parsing Markdown incomplet

---

## [0.5.0] - 2025-09-21 (Alpha)

### ✨ Ajouté

- Design system initial
- Palette de couleurs dark mode
- Structure de fichiers du projet

### 📖 Documentation

- Spécifications fonctionnelles
- Wireframes mobile et desktop

---

## [0.1.0] - 2025-09-20 (Concept)

### ✨ Ajouté

- Idée initiale du projet
- Liste des catégories à couvrir
- Benchmark d'outils existants

---

## Types de changements

- `✨ Ajouté` : Nouvelles fonctionnalités
- `🔧 Modifié` : Changements de fonctionnalités existantes
- `🗑️ Déprécié` : Fonctionnalités bientôt supprimées
- `🐛 Corrigé` : Corrections de bugs
- `🔒 Sécurité` : Corrections de vulnérabilités
- `⚡ Performance` : Améliorations de performance
- `📖 Documentation` : Ajouts/modifications de documentation

---

## Liens

- [Comparer versions](https://github.com/yourusername/agile-coach-toolkit/compare)
- [Toutes les releases](https://github.com/yourusername/agile-coach-toolkit/releases)
- [Issues ouvertes](https://github.com/yourusername/agile-coach-toolkit/issues)

---

**Note** : Les dates sont au format ISO 8601 (YYYY-MM-DD).

```

```
