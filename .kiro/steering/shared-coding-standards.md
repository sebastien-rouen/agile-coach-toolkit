---
inclusion: always
---

# Standards de Développement

## Principes de Base

- **Lisibilité avant tout** : Le code doit être écrit pour être lu par des humains
- **Simplicité** : Privilégier les solutions simples et directes
- **Cohérence** : Maintenir un style uniforme dans tout le projet
- **Documentation** : Commenter le "pourquoi", pas le "quoi"

## Conventions de Nommage

### Variables et Fonctions
- **JavaScript/TypeScript** : camelCase
- Noms descriptifs et explicites
- Éviter les abréviations obscures

```javascript
// ✅ Bon
const userProfile = getUserProfile();
function calculateTotalPrice() { }

// ❌ Mauvais
const up = getUP();
function calcTP() { }
```

### Fichiers et Dossiers
- **Fichiers** : kebab-case
- **Dossiers** : kebab-case
- Structure logique et hiérarchique
- Noms en anglais pour la compatibilité

```
✅ Bon
assets/css/components/button-group.css
assets/js/managers/user-manager.js

❌ Mauvais
assets/css/components/ButtonGroup.css
assets/js/managers/usermanager.js
```

### CSS
- **Classes** : kebab-case
- **Variables** : préfixes sémantiques avec --

```css
/* ✅ Bon */
.service-item { }
.status-indicator { }
--primary: #00d4ff;
--spacing-md: 12px;

/* ❌ Mauvais */
.serviceItem { }
.StatusIndicator { }
```

## Langue et Commentaires

- **Interface utilisateur** : Français
- **Commentaires** : Français
- **Noms de variables/fonctions** : Anglais pour compatibilité internationale
- **Documentation** : Français

```javascript
// ✅ Bon
// Calcule le prix total avec les taxes
function calculateTotalPrice(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Mauvais
// Calculate total price with taxes
function calculerPrixTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Structure de Code

### Organisation des Fichiers
- Séparer la logique métier de la présentation
- Regrouper les fichiers par fonctionnalité
- Maintenir une architecture modulaire
- **Maximum 800 lignes par fichier** : sinon optimiser par composants

```
✅ Bon
assets/js/
├── components/
│   ├── button.js (250 lignes)
│   └── modal.js (180 lignes)
└── managers/
    ├── user-manager.js (420 lignes)
    └── data-manager.js (350 lignes)

❌ Mauvais
assets/js/
└── script.js (2500 lignes)
```

### Indentation
- **JavaScript** : 4 espaces
- **HTML** : 2 espaces
- **CSS** : 2 espaces
- Pas de tabulations

### Gestion des Erreurs
- Toujours gérer les cas d'erreur
- Messages d'erreur explicites et utiles
- **Utiliser Winston Logger** (voir `shared-structure.md`) au lieu de `console.log()`
- Logging approprié pour le débogage

```javascript
// ✅ Bon
try {
    const data = await fetchData();
    return processData(data);
} catch (error) {
    logger.error('Erreur lors du traitement des données', { error });
    throw new Error('Impossible de traiter les données');
}

// ❌ Mauvais
try {
    const data = await fetchData();
    return processData(data);
} catch (error) {
    console.log(error); // Ne jamais utiliser console.log
}
```

## Séparation des Responsabilités

### CSS et JavaScript
- **Ne jamais écrire de CSS dans les fichiers JS**
- Utiliser des classes CSS pour les états
- JavaScript gère la logique, CSS gère le style

```javascript
// ✅ Bon
element.classList.add('is-active');
element.classList.toggle('is-hidden');

// ❌ Mauvais
element.style.display = 'block';
element.style.color = '#00d4ff';
```

### HTML et JavaScript
- Éviter `innerHTML` avec des données utilisateur
- Utiliser `textContent` ou des frameworks sécurisés
- Valider et nettoyer toutes les entrées

```javascript
// ✅ Bon
element.textContent = userInput;
element.setAttribute('data-id', sanitize(userId));

// ❌ Mauvais
element.innerHTML = userInput;
```

## Documentation

### Commentaires de Code
```javascript
/**
 * Calcule le prix total d'une commande avec taxes
 * @param {Array} items - Liste des articles
 * @param {number} taxRate - Taux de taxe (0-1)
 * @returns {number} Prix total TTC
 */
function calculateTotalPrice(items, taxRate) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return subtotal * (1 + taxRate);
}
```

### CHANGELOG.md
- Mettre à jour systématiquement à chaque modification
- Format : Conventional Changelog
- Sections : Added, Changed, Fixed, Removed

### README.md
- Ne pas dépasser 1000 lignes
- Si dépassement : splitter par domaine
- Inclure : Installation, Usage, Architecture, Contribution

## Bonnes Pratiques Générales

### Sécurité
- Jamais de clés API dans le code frontend
- Variables d'environnement pour les configurations (`.env`)
- Validation côté client ET serveur
- Échapper les données utilisateur
- Utiliser `textContent` au lieu de `innerHTML`
- Sanitiser toutes les entrées utilisateur

### Performance
- Optimiser les sélecteurs CSS
- Minimiser les reflows/repaints
- Lazy loading des ressources
- Compression des assets
- Éviter les boucles imbriquées inutiles
- Utiliser `requestAnimationFrame` pour les animations

### Accessibilité
- Utiliser les balises sémantiques HTML5
- Attributs ARIA appropriés
- Contraste suffisant (WCAG AA minimum)
- Navigation au clavier fonctionnelle
- Labels explicites pour les formulaires

## Checklist Avant Commit

- [ ] Code respecte les conventions de nommage (camelCase JS, kebab-case CSS/fichiers)
- [ ] Fichiers < 800 lignes (sinon découper en composants)
- [ ] Pas de CSS dans les fichiers JS (utiliser classes CSS)
- [ ] Commentaires en français, code en anglais
- [ ] Gestion des erreurs avec Winston Logger (pas de `console.log`)
- [ ] CHANGELOG.md mis à jour (format Conventional Commits)
- [ ] Tests passent (si existants)
- [ ] Pas de secrets dans le code (vérifier `.env`)
- [ ] Validation XSS (pas de `innerHTML` avec données utilisateur)
- [ ] Indentation correcte (4 espaces JS, 2 espaces HTML/CSS)

## Références Croisées

- **Git Workflow** : Voir `shared-workflow-standards-git.md`
- **Architecture CSS** : Voir `shared-css-architecture.md` et `shared-clean-css.md`
- **Tests** : Voir `shared-testing.md` et `shared-testing-unit-patterns.md`
- **API Backend** : Voir `shared-structure.md` (Winston Logger)
- **Sécurité** : Voir `shared-securite.md`
- **PocketBase** : Voir `shared-pocketbase-migrations.md`
