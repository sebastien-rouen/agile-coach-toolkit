---
inclusion: always
---

# Tests et Documentation Visuelle

## Principes Généraux

- **Tests uniquement sur demande explicite** : Ne pas créer de tests automatiquement
- **Tests en français** : Descriptions et messages en français
- **Structure AAA** : Arrange, Act, Assert
- **Tests isolés** : Chaque test doit être indépendant

## Documentation Visuelle (Storybook-like)

### Structure Recommandée
```
docs/
├── components/              # Démonstrations de composants
│   ├── buttons.html        # Exemples de boutons
│   ├── modals.html         # Exemples de modales
│   └── forms.html          # Exemples de formulaires
├── patterns/               # Patterns de design
│   ├── layouts.html        # Layouts types
│   └── navigation.html     # Patterns de navigation
└── examples/               # Exemples d'intégration
    └── dashboard.html      # Exemple de dashboard complet
```

### Template de Documentation
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Composant - Boutons</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .demo-section {
            margin: 2rem 0;
            padding: 2rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
        }
        .demo-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Documentation - Boutons</h1>
        <section class="demo-section">
            <h2 class="demo-title">Bouton Principal</h2>
            <div class="demo-preview">
                <button class="btn-primary">Action Principale</button>
            </div>
            <pre class="demo-code"><code>&lt;button class="btn-primary"&gt;Action Principale&lt;/button&gt;</code></pre>
        </section>
    </div>
</body>
</html>
```

### Avantages
- ✅ Simple : Pas de framework complexe
- ✅ Rapide : HTML/CSS statique
- ✅ Visuel : Voir les composants en action
- ✅ Documentation : Code et rendu côte à côte

## Tests Unitaires

### Framework : Jest
```bash
npm install --save-dev jest
```

### Structure des Tests
```
tests/
├── unit/                    # Tests unitaires
│   ├── api/                # Tests des routes API
│   ├── lib/                # Tests des utilitaires
│   └── services/           # Tests des services
├── integration/            # Tests d'intégration
├── visual/                 # Tests visuels (docs/)
└── fixtures/               # Données de test
```

### Pattern de Test
```javascript
/**
 * Tests pour le module utils
 */
describe('Utils - generateId', () => {
    test('devrait générer un ID de 15 caractères', () => {
        // Arrange
        const expectedLength = 15;
        
        // Act
        const id = generateId();
        
        // Assert
        expect(id).toHaveLength(expectedLength);
        expect(id).toMatch(/^[a-z0-9]+$/);
    });
});
```

### Test de Route API
```javascript
const request = require('supertest');
const express = require('express');

describe('Routes API - Soins', () => {
    let app;
    
    beforeEach(() => {
        app = express();
        app.use('/api/soins', require('../api/routes/routes-soins'));
    });
    
    test('GET /api/soins devrait retourner la liste', async () => {
        const response = await request(app).get('/api/soins');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
```

## Configuration Jest

### package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "testMatch": ["**/tests/**/*.test.js"]
  }
}
```

## Workflow de Développement

1. **Développer le composant** : `assets/css/components/button.css`
2. **Documenter** : `docs/components/buttons.html`
3. **Tester visuellement** : Ouvrir dans le navigateur
4. **Tester unitairement** (si demandé) : `tests/unit/components/button.test.js`

## Bonnes Pratiques

### Documentation Visuelle
- ✅ Une page par composant ou pattern
- ✅ Montrer tous les états possibles
- ✅ Inclure le code HTML correspondant
- ✅ Tester sur différents navigateurs

### Tests Unitaires
- ✅ Tester les cas nominaux ET les erreurs
- ✅ Noms de tests descriptifs en français
- ✅ Isoler les dépendances avec des mocks
- ✅ Viser une couverture > 80%

### À Éviter
- ❌ Tests automatiques non demandés
- ❌ Documentation sans exemples visuels
- ❌ Composants non documentés
- ❌ Tests dépendants entre eux

## Commandes Utiles

```bash
# Serveur local pour docs/
npx http-server docs/ -p 8080

# Lancer les tests
npm test

# Rapport de couverture
npm run test:coverage

# Mode watch
npm run test:watch
```

## Ressources

- **Jest** : https://jestjs.io/docs/getting-started
- **Supertest** : https://github.com/visionmedia/supertest
- **Testing Best Practices** : https://github.com/goldbergyoni/javascript-testing-best-practices
