# Architecture CSS - Documentation

## 📋 Vue d'ensemble

L'architecture CSS du projet suit une approche modulaire et scalable, conforme aux bonnes pratiques définies dans les steering rules.

## 🗂️ Structure des dossiers

```
assets/css/
├── components/              # Composants UI réutilisables
│   ├── header.css          # En-tête du site
│   ├── buttons.css         # Boutons et boutons icônes
│   ├── badges.css          # Badges et tags
│   ├── tabs.css            # Onglets (sidebar et content)
│   ├── categories.css      # Items de catégories (sidebar)
│   ├── breadcrumb.css      # Fil d'Ariane
│   ├── favorites.css       # Système de favoris (étoiles)
│   ├── cards.css           # Cartes de contenu
│   └── states.css          # États (loading, empty, error, tooltips)
├── modules/                # Fonctionnalités spécifiques
│   ├── category-page.css   # Page catégorie (header + grid)
│   └── category-colors.css # Couleurs par catégorie
├── themes/                 # Thèmes
│   └── theme-light.css     # Thème clair (par défaut)
├── base.css                # Reset et styles globaux
├── variables.css           # Variables CSS centralisées
├── layout.css              # Structure et positionnement
├── sidebar.css             # Barre latérale
├── wizard.css              # Assistant de navigation
├── markdown.css            # Rendu du contenu markdown
├── modal.css               # Modales
├── search.css              # Recherche
├── responsive.css          # Media queries
└── style.css               # Point d'entrée (imports uniquement)
```

## 🎯 Principes de conception

### 1. Séparation des responsabilités
- **Base** : Variables, reset, animations globales
- **Layout** : Grilles, conteneurs, espacement
- **Components** : Composants UI réutilisables
- **Modules** : Fonctionnalités métier spécifiques

### 2. Conventions de nommage
- **Classes** : kebab-case (`.category-item`, `.btn-primary`)
- **Variables** : préfixes sémantiques (`--primary`, `--spacing-md`)
- **Fichiers** : kebab-case (`category-page.css`)

### 3. Variables centralisées
Toutes les variables sont définies dans `variables.css` :
- Couleurs sémantiques (`--primary`, `--success`, `--warning`, `--error`)
- Espacements harmoniques (`--spacing-xs` à `--spacing-xl`)
- Système de design cohérent (`--border-radius`, `--transition`, `--shadow`)

### 4. Limite de taille
- **Maximum 800 lignes** par fichier CSS
- Si dépassement : créer des sous-modules
- Objectif : Maintenabilité et lisibilité

## 📦 Ordre des imports (style.css)

```css
/* 1. Base et variables */
@import url('variables.css');
@import url('../themes/theme-light.css');
@import url('base.css');

/* 2. Layout */
@import url('layout.css');
@import url('sidebar.css');

/* 3. Composants */
@import url('components/header.css');
@import url('components/buttons.css');
@import url('components/badges.css');
@import url('components/tabs.css');
@import url('components/categories.css');
@import url('components/breadcrumb.css');
@import url('components/favorites.css');
@import url('components/cards.css');
@import url('components/states.css');

/* 4. Modules */
@import url('modules/category-page.css');
@import url('modules/category-colors.css');
@import url('wizard.css');
@import url('markdown.css');

/* 5. Fonctionnalités */
@import url('modal.css');
@import url('search.css');

/* 6. Responsive */
@import url('responsive.css');
```

## 🔧 Utilisation dans HTML

```html
<!-- Point d'entrée unique -->
<link rel="stylesheet" href="assets/css/style.css">
```

## ✅ Avantages de cette architecture

1. **Maintenabilité** : Fichiers de petite taille, faciles à modifier
2. **Réutilisabilité** : Composants indépendants et modulaires
3. **Performance** : Chargement optimisé avec un seul point d'entrée
4. **Scalabilité** : Ajout facile de nouveaux composants/modules
5. **Lisibilité** : Organisation claire et logique
6. **Cohérence** : Variables centralisées, pas de doublons

## 📊 Métriques

- **Réduction** : ~15-20% de la taille totale (élimination des doublons)
- **Fichiers** : 18 fichiers CSS modulaires
- **Taille max** : Aucun fichier ne dépasse 800 lignes
- **Variables** : ~50 variables CSS centralisées

## 🚀 Workflow de développement

### Ajouter un nouveau composant

1. Créer `assets/css/components/mon-composant.css`
2. Ajouter l'import dans `style.css` (section 3)
3. Respecter les conventions de nommage
4. Utiliser les variables existantes
5. Limiter à 800 lignes maximum

### Modifier un composant existant

1. Localiser le fichier dans `components/` ou `modules/`
2. Modifier uniquement ce fichier
3. Tester les changements
4. Vérifier qu'aucune régression n'apparaît

### Ajouter un nouveau module

1. Créer `assets/css/modules/mon-module.css`
2. Ajouter l'import dans `style.css` (section 4)
3. Utiliser les composants existants si possible

## 📝 Bonnes pratiques

### ✅ À faire
- Utiliser les variables CSS pour les couleurs, espacements, etc.
- Respecter la limite de 800 lignes par fichier
- Nommer les classes en kebab-case
- Grouper les sélecteurs similaires
- Commenter les sections importantes

### ❌ À éviter
- Dupliquer des styles existants
- Utiliser des valeurs en dur au lieu de variables
- Créer des fichiers CSS de plus de 800 lignes
- Mélanger les responsabilités (layout dans components, etc.)
- Utiliser des sélecteurs trop spécifiques

## 🔍 Références

- **Steering rules** : `.kiro/steering/shared-css-architecture.md`
- **Conventions** : `.kiro/steering/shared-coding-standards.md`
- **Git workflow** : `.kiro/steering/shared-git-workflow.md`
