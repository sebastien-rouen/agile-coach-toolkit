---
inclusion: always
---

# Architecture CSS - Bonnes Pratiques

## Structure Modulaire

### Organisation des Dossiers
```
assets/css/
├── components/          # Composants UI réutilisables
├── layout/             # Structure et positionnement
├── modules/            # Fonctionnalités spécifiques
├── themes/            # Light theme / Dark theme (by default)
├── base.css           # Variables et styles globaux
└── style.css          # Point d'entrée (imports uniquement)
```

### Principe de Séparation
- **Base** : Variables, reset, animations globales
- **Layout** : Grilles, conteneurs, espacement
- **Components** : Boutons, badges, modales
- **Modules** : Fonctionnalités métier spécifiques

## Conventions CSS

### Nommage
```css
/* Classes : kebab-case */
.service-item { }
.status-indicator { }
.circular-gauge { }

/* Variables : préfixes sémantiques */
--primary: #00d4ff;
--spacing-md: 12px;
--border-radius: 8px;

/* Fichiers : kebab-case */
components/button-group.css
modules/dashboard-metrics.css
```

### Variables Centralisées
```css
:root {
    /* Couleurs sémantiques */
    --primary: #00d4ff;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    
    /* Espacements harmoniques */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 20px;
    --spacing-xl: 32px;
    
    /* Système de design cohérent */
    --border-radius: 8px;
    --transition: 0.2s ease;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Ordre des Imports
```css
/* 1. Base et variables */
@import url('base.css');

/* 2. Layout */
@import url('layout/grid.css');
@import url('layout/containers.css');

/* 3. Composants */
@import url('components/buttons.css');
@import url('components/badges.css');

/* 4. Modules */
@import url('modules/dashboard.css');

/* 5. Responsive */
@import url('responsive.css');
```

## Optimisation

### Élimination des Doublons
```css
/* ❌ Avant : Doublons */
.status-online { color: #10b981; }
.service-active { color: #10b981; }
.gauge-normal { color: #10b981; }

/* ✅ Après : Variable centralisée */
:root { --success: #10b981; }
.status-online,
.service-active,
.gauge-normal {
    color: var(--success);
}
```

### Sélecteurs Optimisés
```css
/* ❌ Trop spécifique */
#main-content .section .card .header .title { }

/* ✅ Optimisé */
.card__title { }
```

### Consolidation des Animations
```css
/* ❌ Avant : Animations dupliquées */
@keyframes pulse1 { /* ... */ }
@keyframes pulse2 { /* ... */ }

/* ✅ Après : Animation unique */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```

## Méthodologie de Refactorisation

### Phase 1 : Audit
```bash
# Analyser la taille et complexité
wc -l assets/css/style.css

# Identifier les doublons
grep -rho '\.[a-zA-Z][a-zA-Z0-9_-]*' assets/css/ | sort | uniq -d
```

### Phase 2 : Migration Progressive
1. **Variables CSS** → `base.css`
2. **Composants de base** → `components/`
3. **Systèmes de layout** → `layout/`
4. **Modules fonctionnels** → `modules/`
5. **Responsive** → `responsive.css`

### Phase 3 : Tests Continus
- Tester après chaque migration
- Vérifier desktop et mobile
- Valider les interactions JavaScript
- Contrôler les performances

## Limites et Métriques

- **Maximum 800 lignes** par fichier CSS
- Si dépassement : créer des sous-modules
- Objectif : Réduction 15-20% de la taille totale
- Score de performance : > 90/100
