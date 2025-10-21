---
inclusion: fileMatch
fileMatchPattern: ["tools/**/*", "**/tools/**/*"]
---

# Outils Agile - Conventions de Développement

## Structure Standardisée

Chaque outil dans `tools/` suit cette architecture :

```
tools/{nom-outil}/
├── index.html              # Point d'entrée de l'outil
├── css/
│   ├── styles.css          # Styles dark theme (par défaut)
│   └── themes/
│       └── light.css       # Thème clair (optionnel)
├── js/
│   ├── app.js              # Logique métier principale
│   └── pocketbase-integration.js # Intégration PocketBase (optionnel)
├── bdd/                    # Base de données (optionnel)
│   └── pb_migrations/      # Migrations PocketBase
│       ├── 1757700001_create_xxx.js
│       └── 1757700002_seed_xxx.js
├── config/
│   └── config.json         # Configuration spécifique
└── README.md               # Documentation complète
```

## Règles de Nommage

- **Dossiers** : kebab-case (`planning-poker`, `skills-matrix`)
- **Fichiers CSS/JS** : Identique au nom du dossier parent
- **Classes CSS** : Préfixer avec le nom de l'outil (`.planning-poker-card`, `.skills-matrix-cell`)
- **Variables CSS** : Utiliser les variables globales de `base.css` en priorité

## Principes d'Architecture

### Autonomie

- Chaque outil fonctionne indépendamment sans dépendances externes
- Pas de couplage entre outils
- Chargement isolé des ressources

### Réutilisation

- Utiliser les composants partagés : `assets/css/components/`
- Respecter les variables CSS globales : `--primary`, `--spacing-*`, `--border-radius`
- Importer uniquement les styles nécessaires

### Intégration au Thème

```css
/* ✅ Bon : Utiliser les variables globales */
.tool-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

/* ❌ Mauvais : Valeurs en dur */
.tool-card {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 12px;
}
```

## Documentation Obligatoire

Chaque `README.md` doit contenir :

1. **Description** : Objectif et contexte méthodologique
2. **Utilisation** : Instructions pas à pas
3. **Configuration** : Options disponibles dans `config.json`
4. **Références** : Sources agiles/Scrum pertinentes
5. **Captures** : Screenshots si l'interface est complexe

## Outils Disponibles

**Source unique** : La liste des outils est centralisée dans `config/config.json` dans la section `tools`.

Chaque outil est défini avec :
- `id` : Identifiant unique (kebab-case)
- `name` : Nom affiché
- `icon` : Emoji représentatif
- `path` : Chemin relatif vers l'outil
- `description` : Description courte
- `order` : Ordre d'affichage (géré via drag & drop dans l'admin)

| Outil                 | Description                         | Méthodologie                   | PocketBase |
| ----------------------| ------------------------------------| ------------------------------ | ---------- |
| `agile-fluency`       | Évaluation de maturité agile        | Modèle Fluency de Diana Larsen | ❌        |
| `delegation-poker`    | Clarification niveaux délégation    | Management 3.0 (Jurgen Appelo) | ✅        |
| `example-mapping`     | Cartographie d'exemples BDD         | Example Mapping (Matt Wynne)   | ❌        |
| `ikigai`              | Découverte du sens personnel        | Concept japonais Ikigai        | ❌        |
| `ikigai-engagement`   | Mesure d'engagement équipe          | Ikigai appliqué au travail     | ❌        |
| `planning-poker`      | Estimation collaborative            | Planning Poker (Scrum)         | ❌        |
| `skills-matrix`       | Matrice de compétences              | Skill Matrix (Agile)           | ✅        |
| `mission-tracker`     | Suivi des missions et objectifs     | OKR / Goal Setting             | ✅        |
| `velocity-squad`      | Suivi de vélocité                   | Métriques Scrum                | ✅        |
| `stakeholder-mapping` | Cartographie des parties prenantes  | Stakeholder Mapping (Agile)    | ❌        |


### Ajouter un nouvel outil

1. Créer le dossier dans `tools/{nom-outil}/`
2. Ajouter l'outil dans `config/config.json` :
```json
{
  "id": "mon-outil",
  "name": "Mon Outil",
  "icon": "🎯",
  "path": "tools/mon-outil/",
  "description": "Description de mon outil",
  "order": 9
}
```
3. L'outil apparaîtra automatiquement dans la sidebar et l'admin

## Checklist de Développement

Avant de créer ou modifier un outil :

- [ ] Structure de dossier respectée
- [ ] Fichiers CSS/JS < 800 lignes (sinon découper)
- [ ] Classes CSS préfixées avec le nom de l'outil
- [ ] Variables CSS globales utilisées
- [ ] Outil fonctionnel en standalone
- [ ] README.md complet avec références méthodologiques
- [ ] Responsive et accessible (navigation clavier)
- [ ] Testé sur mobile et desktop
- [ ] Pas de dépendances externes non documentées

## Bonnes Pratiques

### Performance

- Lazy loading des ressources lourdes
- Minimiser les requêtes HTTP
- Optimiser les images et icônes

### Accessibilité

- Navigation clavier complète
- Attributs ARIA appropriés
- Contraste WCAG AA minimum
- Labels explicites pour les formulaires

### Responsive

- Mobile-first design
- Breakpoints cohérents avec le thème global
- Touch-friendly sur mobile (zones tactiles ≥ 44px)

### Maintenance

- Code commenté en français
- Logique métier séparée de la présentation
- Pas de CSS inline dans le JavaScript
- Utiliser `textContent` au lieu de `innerHTML` pour les données utilisateur

## Intégration Standardisée

### Scripts à inclure en bas de `index.html`

Chaque outil doit inclure ces scripts dans cet ordre :

```html
<!-- Logique métier de l'outil -->
<script src="js/app.js"></script>

<!-- PocketBase Integration (si applicable) -->
<script src="../../assets/js/pocketbase-manager.js"></script>
<script src="js/pocketbase-integration.js"></script>

<!-- Intégration Agile Coach Toolkit (gestion thème, navigation) -->
<script src="../../assets/js/tool-integration.js"></script>
<script>
  // Configuration spécifique à l'outil
  window.TOOL_CONFIG = {
    name: "{nom-outil}",
    backUrl: "../../index.html#tools",
  };
</script>
```

**Note** : Le script `tool-integration.js` gère automatiquement :

- Le toggle de thème (dark/light) avec persistance localStorage
- Le bouton de retour au toolkit
- L'initialisation du thème au chargement

### Thèmes CSS

#### Dark Theme (par défaut)

Le fichier `css/styles.css` contient le thème sombre par défaut avec ces variables :

```css
:root {
  /* Backgrounds - Dark */
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --bg-tertiary: #2d2d2d;
  --bg-card: #1f1f1f;

  /* Textes - Dark */
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;

  /* Bordures - Dark */
  --border-color: #374151;
  --border-color-hover: #4b5563;

  /* Overlay */
  --overlay-bg: rgba(0, 0, 0, 0.7);
}
```

#### Light Theme (optionnel)

Créer `css/themes/light.css` avec le sélecteur `[data-theme="light"]` :

```css
:root[data-theme="light"] {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --bg-card: #ffffff;

  /* Textes */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  /* Bordures */
  --border-color: #e5e7eb;
  --border-color-hover: #d1d5db;

  /* Overlay */
  --overlay-bg: rgba(0, 0, 0, 0.5);
}
```

Inclure dans `index.html` :

```html
<link rel="stylesheet" href="css/styles.css" />
<link rel="stylesheet" href="css/themes/light.css" />
```

### Migrations PocketBase

Pour les outils avec persistance PocketBase, créer les migrations dans `bdd/pb_migrations/` :

**Nommage** : `{timestamp}_{action}_tools_{prefixe-du-tool}_{nom}.js`

Exemples :

- `1757700001_create_tools_delegation_poker_sessions.js`
- `1757700002_create_tools_delegation_poker_decisions.js`
- `1757700010_seed_tools_delegation_poker_examples.js`

**Structure type** :

```javascript
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = new Collection({
      name: "tools_{outil}_{collection}",
      type: "base",
      system: false,
      fields: [
        {
          name: "id",
          type: "text",
          required: true,
          presentable: false,
          primaryKey: true,
          autogeneratePattern: "[a-z0-9]{15}",
          hidden: false,
        },
        // Vos champs ici
        {
          name: "created",
          type: "autodate",
          onCreate: true,
          onUpdate: false,
          presentable: false,
        },
        {
          name: "updated",
          type: "autodate",
          onCreate: true,
          onUpdate: true,
          presentable: false,
        },
      ],
      indexes: [],
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId(
      "tools_{outil}_{collection}"
    );
    return app.delete(collection);
  }
);
```

**Bonnes pratiques migrations** :

- Toujours inclure les champs `id`, `created`, `updated`
- Nommage cohérent : `tools_{outil}_{collection}`
- Timestamps Unix croissants pour l'ordre
- Implémenter la fonction de rollback
- Tester avant de commiter
