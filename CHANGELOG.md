# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
