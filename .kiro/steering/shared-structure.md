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
- **Site Logger** : Logging centralisé avec séparation par site (voir section dédiée ci-dessous)
- **Config Manager** : Gestion centralisée des configurations multi-sites
- **Health Checker** : Surveillance de l'état de tous les sites

## Utilisation du Winston Logger dans les Routes

Le système utilise **Winston** pour un logging centralisé et structuré. Chaque site dispose de son propre logger avec préfixage automatique et canaux séparés en développement.

### Initialisation dans les Routes

Dans vos fichiers `{site}/api/routes/routes-*.js`, récupérez le logger via le middleware :

```javascript
const express = require("express");
const router = express.Router();

// Le logger est automatiquement injecté par le middleware
router.get("/exemple", (req, res) => {
  const logger = req.siteLogger; // Logger spécifique au site

  logger.info("Traitement de la requête exemple");

  try {
    // Votre logique métier
    const result = { success: true };

    logger.info("Requête traitée avec succès", { result });
    res.json(result);
  } catch (error) {
    logger.error("Erreur lors du traitement", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
```

### Méthodes de Logging Disponibles

#### Méthodes Standard

```javascript
// Logs d'information (niveau info)
logger.info("Message informatif", { data: "optionnelle" });

// Logs d'avertissement (niveau warn)
logger.warn("Attention: ressource limitée", { remaining: 10 });

// Logs d'erreur (niveau error)
logger.error("Erreur critique", { error: error.message });

// Logs de débogage (niveau debug, uniquement en développement)
logger.debug("Détails de débogage", { variable: value });
```

#### Méthodes Spécialisées

```javascript
// Log automatique des requêtes HTTP
logger.logRequest(req, res, responseTime);
// Génère: "Request processed [site] GET /api/exemple 200 45ms"

// Log structuré des erreurs
logger.logError(error, {
  context: "validation",
  userId: req.user?.id,
});

// Log des problèmes d'architecture
logger.logArchitecture("missing-config", {
  file: "config.json",
  expected: "pocketbaseUrl",
});
```

### Exemple Complet dans une Route

```javascript
const express = require("express");
const router = express.Router();

router.post("/items", async (req, res) => {
  const logger = req.siteLogger;
  const startTime = Date.now();

  logger.info("Création d'un nouvel item", {
    body: req.body,
  });

  try {
    // Validation
    if (!req.body.name) {
      logger.warn("Validation échouée: nom manquant");
      return res.status(400).json({
        error: "Le nom est requis",
      });
    }

    // Logique métier
    const item = await createItem(req.body);

    logger.info("Item créé avec succès", {
      itemId: item.id,
      name: item.name,
    });

    // Log automatique de la requête
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);

    res.status(201).json(item);
  } catch (error) {
    logger.logError(error, {
      operation: "createItem",
      input: req.body,
    });

    res.status(500).json({
      error: "Erreur lors de la création",
    });
  }
});

module.exports = router;
```

### Configuration par Environnement

Le logger s'adapte automatiquement selon l'environnement :

**Développement (drafts)** :

- Niveau de log : `debug` (tous les logs)
- Sortie console : Activée avec couleurs
- Fichiers séparés : `logs/sites/{site}/{site}.log`
- Fichiers d'erreur : `logs/sites/{site}/{site}-error.log`

**Production (prod)** :

- Niveau de log : `warn` (warnings et erreurs uniquement)
- Sortie console : Désactivée
- Fichiers centralisés : `logs/combined.log` et `logs/error.log`
- Préfixage automatique : `[{site}]` dans les logs

### Bonnes Pratiques

1. **Toujours utiliser le logger** au lieu de `console.log()`
2. **Ajouter du contexte** avec les métadonnées (second paramètre)
3. **Logger les erreurs** avec `logger.logError()` pour capturer la stack trace
4. **Éviter les logs sensibles** (mots de passe, tokens, données personnelles)
5. **Utiliser les niveaux appropriés** :
   - `debug` : Informations de débogage détaillées
   - `info` : Événements normaux de l'application
   - `warn` : Situations anormales mais gérables
   - `error` : Erreurs nécessitant une attention

### Accès aux Logs

```bash
# Voir tous les logs en temps réel
pm2 logs

# Logs d'un site spécifique en développement
cat logs/sites/carnet-animaux/carnet-animaux.log

# Logs d'erreur uniquement
cat logs/error.log

# Logs combinés en production
cat logs/combined.log

# Filtrer par site en production
grep "\[carnet-animaux\]" logs/combined.log
```

### Rotation Automatique

Les logs sont automatiquement gérés avec rotation :

- **Taille maximale** : 5 MB par fichier
- **Fichiers conservés** : 5 versions
- **Nettoyage** : Automatique par Winston
