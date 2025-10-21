# 📁 Architecture CSS - Velocity Squad

## 🎯 Objectif

Refactorisation du fichier monolithique `styles.css` (2853 lignes) en une architecture modulaire conforme aux standards BastaVerse (max 800 lignes par fichier).

## 📂 Structure

```
css/
├── base/                   # Fondations
│   ├── variables.css       # Variables CSS et reset (40 lignes)
│   └── animations.css      # Animations globales (70 lignes)
├── layout/                 # Structure et positionnement
│   ├── header.css          # En-tête dashboard (60 lignes)
│   ├── grid.css            # Grilles et layouts (140 lignes)
│   └── modals.css          # Système de modales (40 lignes)
├── components/             # Composants UI réutilisables
│   ├── states.css          # Classes utilitaires (40 lignes)
│   ├── buttons.css         # Système de boutons (280 lignes)
│   └── forms.css           # Formulaires (140 lignes)
├── modules/                # Fonctionnalités spécifiques (À créer)
│   ├── charts.css          # Graphiques Chart.js
│   ├── casino.css          # Vue Casino
│   ├── kpi.css             # KPIs et métriques
│   ├── annotations.css     # Système d'annotations
│   ├── pi-planning.css     # PI Planning SAFe
│   ├── capacity.css        # Capacité équipe
│   ├── heatmap.css         # Heatmap burnout
│   ├── achievements.css    # Badges et notifications
│   ├── team.css            # Gestion équipe
│   ├── stories.css         # User stories
│   └── export.css          # Export de données
├── themes/                 # Thèmes (À créer)
│   └── light.css           # Thème clair
├── styles-new.css          # Point d'entrée (imports)
├── styles.css              # ⚠️ ANCIEN (à remplacer)
├── team-manager.css        # Existant (313 lignes) ✅
├── visual.css              # Existant (289 lignes) ✅
└── footer.css              # Existant (431 lignes) ✅
```

## ✅ Fichiers Créés (Phase 1)

### Base (110 lignes)
- `base/variables.css` - Variables CSS globales, reset, body
- `base/animations.css` - @keyframes consolidées (pulse, slideIn, fadeIn, bounce, spin, modalSlide)

### Layout (240 lignes)
- `layout/header.css` - Dashboard header, mode selector, framework selector
- `layout/grid.css` - Dashboard grid, sections, action bar, sprint goal section
- `layout/modals.css` - Modal overlay, modal-content, close button

### Components (460 lignes)
- `components/states.css` - Classes utilitaires (is-hidden, is-visible, is-flex, cursor-*, position-*, z-index-*)
- `components/buttons.css` - Tous les boutons (btn, btn-compact, btn-safe, mood-btn, status-btn, confidence-btn)
- `components/forms.css` - Form-group, inputs, selects, textareas, mood inputs

### Point d'Entrée (25 lignes)
- `styles-new.css` - Imports de tous les modules

**Total extrait** : 835 lignes / 2853 (29%)

## ⏳ À Créer (Phase 2)

### Modules (~2018 lignes restantes)

| Module | Lignes | Description |
|--------|--------|-------------|
| `modules/charts.css` | ~250 | Chart.js, chart-section, chart-controls, chart-view-selector |
| `modules/casino.css` | ~200 | Casino container, poker cards, estimation wheel, participants |
| `modules/kpi.css` | ~180 | KPI grid, kpi-card, kpi-value, kpi-label |
| `modules/annotations.css` | ~200 | Annotations panel, annotation items, legend |
| `modules/pi-planning.css` | ~300 | PI modal, tabs, form, objectives, risks, dependencies |
| `modules/capacity.css` | ~150 | Capacity list, capacity items, existing sprints |
| `modules/heatmap.css` | ~120 | Heatmap grid, heatmap cells, member names |
| `modules/achievements.css` | ~150 | Achievement notifications, badges, icons |
| `modules/team.css` | ~120 | Team members, team modal, team actions |
| `modules/stories.css` | ~150 | Story cards, story modal, story tabs |
| `modules/export.css` | ~100 | Export modal, export info, export fields |

### Thèmes (~200 lignes)

| Fichier | Description |
|---------|-------------|
| `themes/light.css` | Thème clair avec sélecteur `[data-theme="light"]` |

## 🔄 Migration

### Étape 1 : Créer les Modules Manquants

```bash
# Créer les fichiers modules/
New-Item -ItemType File -Path "css/modules/charts.css"
New-Item -ItemType File -Path "css/modules/casino.css"
# ... etc
```

### Étape 2 : Extraire le CSS

Pour chaque module :
1. Identifier les sections dans `styles.css`
2. Copier dans le nouveau fichier module
3. Vérifier les dépendances (variables, animations)
4. Tester le rendu

### Étape 3 : Mettre à Jour styles-new.css

```css
/* Ajouter les imports */
@import url('modules/charts.css');
@import url('modules/casino.css');
/* ... etc */
```

### Étape 4 : Mettre à Jour index.html

Remplacer :
```html
<link rel="stylesheet" href="css/styles.css">
```

Par :
```html
<link rel="stylesheet" href="css/styles-new.css">
<link rel="stylesheet" href="css/themes/light.css">
```

### Étape 5 : Tester

- Vérifier tous les composants visuels
- Tester responsive (mobile + desktop)
- Valider thème light
- Tester toutes les interactions

## 📏 Conventions

### Nommage
- **Classes** : kebab-case (`.velocity-squad-card`)
- **Variables** : préfixes sémantiques (`--primary`, `--spacing-md`)
- **Fichiers** : kebab-case (`pi-planning.css`)

### Organisation
- **Ordre des propriétés** : Display → Position → Box Model → Typographie → Visuel → Animations
- **Commentaires** : Sections avec `/* ==== TITRE ==== */`
- **Indentation** : 2 espaces

### Variables Globales

Utiliser en priorité les variables de `base/variables.css` :
```css
--success: #4CAF50;
--warning: #FF9800;
--danger: #F44336;
--primary: #2196F3;
--info: #00BCD4;
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
--border-radius: 8px;
--transition: all 0.3s ease;
```

## 🎨 Classes Utilitaires

### Visibilité
```css
.is-hidden { display: none !important; }
.is-visible { display: block !important; }
.is-flex { display: flex !important; }
```

### Curseurs
```css
.cursor-pointer { cursor: pointer; }
.cursor-default { cursor: default; }
```

### Positionnement
```css
.position-absolute { position: absolute; }
.position-relative { position: relative; }
.z-index-high { z-index: 3000; }
```

## 📊 Progression

```
Phase 1 (Base + Layout + Components)  ████████░░ 80% ✅
Phase 2 (Modules)                      ██░░░░░░░░ 20% ⏳
Phase 3 (Thèmes)                       ░░░░░░░░░░  0% ⏳

TOTAL                                  ████░░░░░░ 30%
```

## 📚 Ressources

- **Guide complet** : `../docs/REFACTORING-GUIDE.md`
- **État d'avancement** : `../REFACTORING-STATUS.md`
- **Standards BastaVerse** : `shared-css-architecture.md` (steering rules)

## ⚠️ Important

- **Ne pas supprimer** `styles.css` avant validation complète
- **Tester après chaque modification** majeure
- **Respecter la limite** de 800 lignes par fichier
- **Utiliser les variables** globales en priorité
