---
inclusion: always
---

# Architecture API Multi-Sites

## Organisation du Répertoire Racine (API Backend)

**Structure spécifique à l'API centralisée :**

- `data/` - Répertoires de données des sites générés automatiquement
- `services/` - Services principaux (gestionnaire PocketBase, logger de site)
- `lib/` - Utilitaires partagés (chargeur de site, gestionnaire de config, middleware)
- `scripts/` - Scripts utilitaires pour PM2, vérifications de santé, gestion des sites
- `server.js` - Point d'entrée principal de l'application API Backend
- `security-config.js` - Configuration de sécurité centralisée

## Convention de Structure des Sites dans l'API

Chaque site suit ce modèle dans `data/{nom-du-site}/` :

```
{nom-du-site}/
├── api/
│   └── routes/               # Modules de routes personnalisées (pattern routes-*.js)
│       ├── utils.js          # Utilitaires partagés pour le site
│       └── routes-*.js       # Routes spécifiques aux fonctionnalités
├── config/                   # Fichiers de configuration du site
└── bdd/                      # Données PocketBase (si utilisation de PocketBase)
    ├── pb_data/              # Données PocketBase
    ├── pb_hooks/             # Hooks PocketBase
    └── pb_migrations/        # Migrations PocketBase
```

## Conventions Spécifiques à l'API Backend

### Fichiers de Routes

- **Nommage** : `routes-{fonctionnalité}.js` (ex: `routes-liens.js`, `routes-soins.js`)
- **Exports** : Doit exporter un routeur Express
- **Mapping d'URL** : Les routes correspondent à `/api/{site}/routes-{fonctionnalité}/{endpoint}`
- **utils.js requis** : Inclure les fonctions communes comme `generateId()`, `readDataFile()`, `writeDataFile()`

### Architecture de Gestion des Données

- **Primaire** : Collections PocketBase avec le pattern de nommage `{site}_{type-de-données}`
- **Fallback** : Fichiers JSON dans le répertoire `assets/data/`
- **Auto-migration** : Le service gère automatiquement le fallback PocketBase ↔ JSON

### Séparation des Environnements API Backend

- **Développement** : Répertoire `data/` - Hot-reload activé, logging verbeux
- **Production** : Même structure - Routes mises en cache, logging minimal
- **Allocation des ports** : Développement (3002), Production (3001)

### Patterns de Routage Dynamique

- **Détection automatique** : Scan des répertoires `/sites/drafts/` et `/sites/prod/`
- **Chargement à la demande** : Routes chargées uniquement quand nécessaire
- **Cache intelligent** : Mise en cache des routes en production
- **Fallback par défaut** : Routes génériques pour sites sans implémentation spécifique

### Gestion des Services Centralisés

- **PocketBase Manager** : Gestion automatisée des instances PocketBase par site
- **Site Logger** : Logging centralisé avec séparation par site
- **Config Manager** : Gestion centralisée des configurations multi-sites
- **Health Checker** : Surveillance de l'état de tous les sites
