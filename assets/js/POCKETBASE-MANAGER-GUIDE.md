# 📚 Guide PocketBase Manager - Réutilisable pour tous les outils

## 🎯 Vue d'Ensemble

`pocketbase-manager.js` est un gestionnaire centralisé pour interagir avec PocketBase depuis n'importe quel outil du répertoire `/tools/`.

## 🚀 Utilisation Rapide

### 1. Inclure le Manager dans votre HTML

```html
<!-- PocketBase Manager -->
<script src="../../assets/js/pocketbase-manager.js"></script>

<!-- Votre fichier d'intégration spécifique -->
<script src="js/pocketbase-integration.js"></script>
```

### 2. Initialiser dans votre outil

```javascript
// Configuration des collections pour votre outil
const PB_CONFIG = {
    baseUrl: 'http://localhost:8090',
    collections: {
        // Mapper vos clés vers les noms de collections PocketBase
        items: 'mon_outil_items',
        users: 'mon_outil_users',
        settings: 'mon_outil_settings'
    }
};

// Créer une instance
const pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);

// Tester la connexion
const isConnected = await pbManager.testConnection();

if (isConnected) {
    console.log('✅ PocketBase connecté');
    await loadFromPocketBase();
} else {
    console.log('📦 Mode local (localStorage)');
    loadFromLocalStorage();
}
```

## 📖 API Complète

### Connexion

#### `testConnection()`
Teste la connexion à PocketBase.

```javascript
const isConnected = await pbManager.testConnection();
// Returns: boolean
```

### Lecture (GET)

#### `getRecords(collectionKey, options)`
Récupère tous les enregistrements d'une collection.

```javascript
const records = await pbManager.getRecords('items', {
    filter: 'active = true',
    sort: '-created',
    expand: 'user,category',
    perPage: 100
});
// Returns: Array<Object>
```

**Options disponibles :**
- `filter` : Filtre SQL (ex: `"name = 'test' && active = true"`)
- `sort` : Tri (ex: `"name"` ou `"-created"` pour DESC)
- `expand` : Relations à charger (ex: `"user,category"`)
- `perPage` : Nombre de résultats (défaut: 500)

#### `getRecord(collectionKey, id, options)`
Récupère un enregistrement par ID.

```javascript
const record = await pbManager.getRecord('items', 'abc123', {
    expand: 'user'
});
// Returns: Object
```

### Création (POST)

#### `createRecord(collectionKey, data)`
Crée un nouvel enregistrement.

```javascript
const newRecord = await pbManager.createRecord('items', {
    name: 'Mon item',
    description: 'Description',
    active: true
});
// Returns: Object (avec id généré)
```

### Mise à jour (PATCH)

#### `updateRecord(collectionKey, id, data)`
Met à jour un enregistrement existant.

```javascript
const updated = await pbManager.updateRecord('items', 'abc123', {
    name: 'Nouveau nom',
    active: false
});
// Returns: Object (mis à jour)
```

### Suppression (DELETE)

#### `deleteRecord(collectionKey, id)`
Supprime un enregistrement.

```javascript
const success = await pbManager.deleteRecord('items', 'abc123');
// Returns: boolean
```

### Cache

#### `getCachedRecords(collectionKey)`
Récupère les données en cache.

```javascript
const cached = pbManager.getCachedRecords('items');
// Returns: Array<Object>
```

#### `isCached(collectionKey)`
Vérifie si une collection est en cache.

```javascript
const isCached = pbManager.isCached('items');
// Returns: boolean
```

#### `clearCache()`
Vide tout le cache.

```javascript
pbManager.clearCache();
```

### Synchronisation

#### `startSync(callback, interval)`
Active la synchronisation automatique.

```javascript
pbManager.startSync(async () => {
    await saveAllData();
}, 30000); // Toutes les 30 secondes
```

#### `stopSync()`
Arrête la synchronisation automatique.

```javascript
pbManager.stopSync();
```

## 🎨 Exemple Complet : Planning Poker

```javascript
// planning-poker/js/pocketbase-integration.js

const PB_CONFIG = {
    baseUrl: 'http://localhost:8090',
    collections: {
        sessions: 'planning_poker_sessions',
        votes: 'planning_poker_votes',
        stories: 'planning_poker_stories'
    }
};

let pbManager = null;
let usePocketBase = false;

async function initPocketBase() {
    try {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        usePocketBase = await pbManager.testConnection();
        
        if (usePocketBase) {
            await loadFromPocketBase();
        } else {
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('Erreur PocketBase:', error);
        loadFromLocalStorage();
    }
}

async function loadFromPocketBase() {
    try {
        // Charger les sessions actives
        const sessions = await pbManager.getRecords('sessions', {
            filter: 'active = true',
            sort: '-created',
            expand: 'stories'
        });

        // Charger les votes
        const votes = await pbManager.getRecords('votes', {
            filter: `session = "${currentSessionId}"`,
            expand: 'user,story'
        });

        // Convertir au format de l'application
        convertToAppFormat(sessions, votes);
        
    } catch (error) {
        console.error('Erreur chargement:', error);
        loadFromLocalStorage();
    }
}

async function saveSession(session) {
    if (!usePocketBase) return;

    try {
        if (session.pbId) {
            await pbManager.updateRecord('sessions', session.pbId, {
                name: session.name,
                active: session.active,
                updated: new Date().toISOString()
            });
        } else {
            const created = await pbManager.createRecord('sessions', {
                name: session.name,
                active: true,
                created: new Date().toISOString()
            });
            session.pbId = created.id;
        }
    } catch (error) {
        console.error('Erreur sauvegarde session:', error);
    }
}

// Initialiser
document.addEventListener('DOMContentLoaded', initPocketBase);
```

## 🎨 Exemple Complet : Ikigai

```javascript
// ikigai/js/pocketbase-integration.js

const PB_CONFIG = {
    baseUrl: 'http://localhost:8090',
    collections: {
        profiles: 'ikigai_profiles',
        answers: 'ikigai_answers',
        results: 'ikigai_results'
    }
};

let pbManager = null;
let usePocketBase = false;

async function initPocketBase() {
    pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
    usePocketBase = await pbManager.testConnection();
    
    if (usePocketBase) {
        await loadProfile();
    }
}

async function loadProfile() {
    try {
        // Charger le profil de l'utilisateur
        const profiles = await pbManager.getRecords('profiles', {
            filter: 'user = "current_user_id"',
            sort: '-created',
            perPage: 1
        });

        if (profiles.length > 0) {
            const profile = profiles[0];
            
            // Charger les réponses
            const answers = await pbManager.getRecords('answers', {
                filter: `profile = "${profile.id}"`,
                expand: 'question'
            });

            applyProfileData(profile, answers);
        }
    } catch (error) {
        console.error('Erreur chargement profil:', error);
    }
}

async function saveAnswer(questionId, answer) {
    if (!usePocketBase) return;

    try {
        await pbManager.createRecord('answers', {
            profile: currentProfileId,
            question: questionId,
            answer: answer,
            created: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erreur sauvegarde réponse:', error);
    }
}

document.addEventListener('DOMContentLoaded', initPocketBase);
```

## 🔧 Bonnes Pratiques

### 1. Fallback vers localStorage

Toujours prévoir un fallback si PocketBase n'est pas disponible :

```javascript
if (usePocketBase) {
    await loadFromPocketBase();
} else {
    loadFromLocalStorage();
}
```

### 2. Gestion des Erreurs

Entourer les appels PocketBase de try/catch :

```javascript
try {
    const records = await pbManager.getRecords('items');
    // Traiter les données
} catch (error) {
    console.error('Erreur:', error);
    // Fallback vers cache ou localStorage
    const cached = pbManager.getCachedRecords('items');
}
```

### 3. Utiliser le Cache

Le cache est automatiquement géré, mais vous pouvez l'utiliser pour optimiser :

```javascript
// Vérifier le cache avant de faire une requête
if (pbManager.isCached('items')) {
    const items = pbManager.getCachedRecords('items');
    // Utiliser les données en cache
} else {
    const items = await pbManager.getRecords('items');
}
```

### 4. Synchronisation Automatique

Pour les outils collaboratifs, activer la synchronisation :

```javascript
if (usePocketBase) {
    pbManager.startSync(async () => {
        await syncAllData();
    }, 30000); // Toutes les 30 secondes
}

// Arrêter lors du déchargement
window.addEventListener('beforeunload', () => {
    pbManager.stopSync();
});
```

### 5. Nettoyage

Nettoyer le cache quand nécessaire :

```javascript
// Lors d'un changement de contexte
function switchContext() {
    pbManager.clearCache();
    await loadNewContext();
}
```

## 📊 Filtres PocketBase

### Opérateurs de Comparaison

```javascript
// Égalité
filter: "name = 'test'"

// Différent
filter: "status != 'archived'"

// Supérieur/Inférieur
filter: "score > 10"
filter: "age >= 18"
filter: "price < 100"

// LIKE (contient)
filter: "name ~ 'test'"

// IN (dans une liste)
filter: "status IN ('active', 'pending')"
```

### Opérateurs Logiques

```javascript
// ET
filter: "active = true && score > 10"

// OU
filter: "status = 'active' || status = 'pending'"

// Combinaison
filter: "(active = true && score > 10) || featured = true"
```

### Relations

```javascript
// Filtrer par relation
filter: "user.email = 'test@example.com'"

// Relation vide
filter: "category = ''"

// Relation non vide
filter: "category != ''"
```

## 🎯 Conventions de Nommage

### Collections

Format : `{outil}_{entité}` (pluriel)

```
planning_poker_sessions
planning_poker_votes
ikigai_profiles
ikigai_answers
skills_matrix_members
skills_matrix_items
```

### Champs Communs

Utiliser ces noms pour la cohérence :

- `id` : Identifiant unique (auto-généré)
- `created` : Date de création (autodate)
- `updated` : Date de modification (autodate)
- `active` : Statut actif/inactif (bool)
- `name` : Nom/Titre (text)
- `description` : Description (text)

## 🔐 Sécurité

### Rules PocketBase

Définir des règles d'accès appropriées :

```javascript
// Lecture publique
listRule: ""
viewRule: ""

// Création/Modification authentifiée
createRule: "@request.auth.id != ''"
updateRule: "@request.auth.id != ''"
deleteRule: "@request.auth.id != ''"

// Propriétaire uniquement
updateRule: "@request.auth.id = user"
deleteRule: "@request.auth.id = user"
```

## 📚 Ressources

- **Documentation PocketBase** : https://pocketbase.io/docs/
- **API Reference** : https://pocketbase.io/docs/api-records/
- **Filtres** : https://pocketbase.io/docs/api-rules-and-filters/

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14  
**Auteur** : Kiro AI Assistant
