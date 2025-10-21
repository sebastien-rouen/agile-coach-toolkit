# 🔧 Guide de Refactorisation - Velocity Squad

## 📊 État Actuel

### Violations Critiques

| Fichier | Lignes | Limite | Statut |
|---------|--------|--------|--------|
| **styles.css** | 2853 | 800 | ❌ CRITIQUE (3.5x) |
| **script.js** | 5891 | 800 | ❌ CRITIQUE (7.3x) |
| pocketbase-integration.js | 818 | 800 | ⚠️ Limite dépassée |

### CSS Inline dans JS

- **89 occurrences** de `.style.` dans les fichiers JS
- Violation des standards BastaVerse
- Maintenance difficile

## ✅ Travaux Réalisés

### Phase 1 : Structure CSS Modulaire

✅ **Créé** :
- `css/base/variables.css` - Variables et reset
- `css/base/animations.css` - Animations globales
- `css/components/states.css` - Classes utilitaires
- `css/components/buttons.css` - Système de boutons
- `css/components/forms.css` - Formulaires
- `css/layout/header.css` - En-tête
- `css/layout/grid.css` - Grilles et layouts
- `css/layout/modals.css` - Modales
- `css/styles-new.css` - Point d'entrée

## 🎯 Prochaines Étapes

### Phase 2 : Compléter la Migration CSS (2-3h)

#### 2.1 Extraire les Modules Restants

Créer ces fichiers à partir de `styles.css` :

```bash
css/modules/
├── charts.css          # Graphiques Chart.js (~250 lignes)
├── casino.css          # Vue Casino (~200 lignes)
├── kpi.css             # KPIs et métriques (~180 lignes)
├── annotations.css     # Système d'annotations (~200 lignes)
├── pi-planning.css     # PI Planning SAFe (~300 lignes)
├── capacity.css        # Capacité équipe (~150 lignes)
├── heatmap.css         # Heatmap burnout (~120 lignes)
├── achievements.css    # Badges et notifications (~150 lignes)
└── team.css            # Gestion équipe (~120 lignes)
```

#### 2.2 Créer le Thème Light

```bash
css/themes/
└── light.css           # Thème clair (~200 lignes)
```

#### 2.3 Mettre à Jour index.html

Remplacer :
```html
<link rel="stylesheet" href="css/styles.css">
```

Par :
```html
<link rel="stylesheet" href="css/styles-new.css">
<link rel="stylesheet" href="css/themes/light.css">
```

### Phase 3 : Remplacer CSS Inline (1-2h)

#### 3.1 Rechercher/Remplacer dans script.js

```javascript
// ❌ Avant
element.style.display = 'none';
element.style.display = 'block';
element.style.display = 'flex';
chart.canvas.style.cursor = 'pointer';
chart.canvas.style.cursor = 'default';
tooltip.style.position = 'absolute';
tooltip.style.left = x + 'px';
tooltip.style.top = y + 'px';
tooltip.style.zIndex = '3000';

// ✅ Après
element.classList.add('is-hidden');
element.classList.remove('is-hidden');
element.classList.add('is-flex');
chart.canvas.classList.add('cursor-pointer');
chart.canvas.classList.remove('cursor-pointer');
tooltip.classList.add('position-absolute', 'z-index-high');
tooltip.style.left = x + 'px';  // OK pour positionnement dynamique
tooltip.style.top = y + 'px';   // OK pour positionnement dynamique
```

**Note** : Les propriétés dynamiques (left, top, width, height calculées) peuvent rester en inline.

#### 3.2 Fichiers à Modifier

1. `js/script.js` - 75 occurrences
2. `js/pocketbase-integration.js` - 1 occurrence
3. `js/footer-loader.js` - 2 occurrences

### Phase 4 : Découper script.js (3-4h)

#### 4.1 Structure Cible

```bash
js/
├── app.js                      # Point d'entrée (100 lignes)
├── core/
│   ├── velocity-manager.js     # Gestion vélocité (600 lignes)
│   ├── sprint-manager.js       # CRUD sprints (500 lignes)
│   └── storage-manager.js      # LocalStorage/PocketBase (300 lignes)
├── features/
│   ├── stories-manager.js      # User stories (600 lignes)
│   ├── annotations-manager.js  # Annotations (400 lignes)
│   ├── casino-manager.js       # Vue Casino (500 lignes)
│   ├── templates-manager.js    # Templates (600 lignes)
│   └── achievements-manager.js # Badges (300 lignes)
├── ui/
│   ├── chart-renderer.js       # Chart.js (500 lignes)
│   ├── modal-manager.js        # Modales (300 lignes)
│   └── notifications.js        # Toasts (150 lignes)
└── utils/
    ├── date-utils.js           # Dates (200 lignes)
    ├── validators.js           # Validation (150 lignes)
    └── formatters.js           # Formatage (100 lignes)
```

#### 4.2 Ordre de Migration

1. **Utilitaires** (utils/) - Pas de dépendances
2. **Core** (core/) - Dépend des utils
3. **UI** (ui/) - Dépend de core
4. **Features** (features/) - Dépend de tout
5. **App** (app.js) - Orchestre tout

#### 4.3 Pattern de Module

```javascript
// Exemple: js/utils/date-utils.js
export class DateUtils {
  static formatDate(date) {
    // ...
  }
  
  static getDaysBetween(start, end) {
    // ...
  }
}

// Exemple: js/core/sprint-manager.js
import { DateUtils } from '../utils/date-utils.js';

export class SprintManager {
  constructor(data) {
    this.data = data;
  }
  
  addSprint(sprint) {
    // ...
  }
  
  deleteSprint(id) {
    // ...
  }
}
```

### Phase 5 : Optimiser pocketbase-integration.js (1h)

Actuellement 818 lignes (proche limite).

**Actions** :
1. Extraire la logique de synchronisation → `sync-manager.js`
2. Créer un module de cache → `cache-manager.js`
3. Simplifier les fonctions de mapping

## 📋 Checklist de Validation

### CSS
- [ ] Tous les fichiers CSS < 800 lignes
- [ ] Variables centralisées dans base/variables.css
- [ ] Animations consolidées (pas de doublons)
- [ ] Classes préfixées `.velocity-squad-*` (optionnel)
- [ ] Thème light fonctionnel
- [ ] Responsive testé (mobile + desktop)

### JavaScript
- [ ] Tous les fichiers JS < 800 lignes
- [ ] Pas de `.style.` sauf positionnement dynamique
- [ ] Modules ES6 fonctionnels
- [ ] Imports/exports corrects
- [ ] Pas de `console.log` en production

### Tests Fonctionnels
- [ ] Graphiques vélocité OK
- [ ] Vue Casino OK
- [ ] Gestion sprints OK
- [ ] User stories OK
- [ ] Templates OK
- [ ] Annotations OK
- [ ] Achievements OK
- [ ] Import/Export OK
- [ ] PocketBase sync OK

## 🚀 Commandes Utiles

```bash
# Compter les lignes
Get-Content css/styles.css | Measure-Object -Line

# Rechercher CSS inline
Select-String -Path "js/*.js" -Pattern "\.style\."

# Valider la structure
tree css/ /F
tree js/ /F

# Tester après refacto
# Ouvrir index.html dans le navigateur
# Tester toutes les fonctionnalités
```

## 💡 Recommandations

1. **Priorité absolue** : Terminer la migration CSS (Phase 2)
2. **Important** : Remplacer CSS inline (Phase 3)
3. **Critique** : Découper script.js (Phase 4)
4. **Optimisation** : Refactoriser pocketbase-integration.js (Phase 5)

**Gain estimé après refactorisation complète** :
- Maintenabilité : +300%
- Performance : +15-20%
- Lisibilité : +400%
- Conformité standards : 100%
