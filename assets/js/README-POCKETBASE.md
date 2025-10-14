# 🗄️ PocketBase Manager - Gestionnaire Centralisé

## 📋 Vue d'ensemble

Le **PocketBase Manager** est un gestionnaire JavaScript centralisé pour faciliter l'intégration de PocketBase dans tous les outils du répertoire `/tools/`. Il fournit une API simple et cohérente pour les opérations CRUD, la gestion du cache et la synchronisation automatique.

## 🎯 Objectifs

- **Réutilisabilité** : Un seul fichier pour tous les outils
- **Simplicité** : API intuitive et facile à utiliser
- **Robustesse** : Gestion d'erreurs et fallback automatique
- **Performance** : Cache intelligent et optimisation des requêtes
- **Flexibilité** : Configuration par outil

## 🚀 Utilisation

### Installation

1. **Inclure le script** dans votre HTML :
```html
<script src="../../assets/js/pocketbase-manager.js"></script>
```

2. **Créer une instance** avec votre configuration :
```javascript
const pbManager = new PocketBaseManager(
    'http://localhost:8090',  // URL de PocketBase
    {
        members: 'skills_matrix_members',
        skills: 'skills_matrix_skills',
        memberSkills: 'skills_matrix_member_skills'
    }
);
```

### Tester la Connexion

```javascript
const isConnected = await pbManager.testConnection();
if (isConnected) {
    console.log('✅ PocketBase connecté');
} else {
    console.log('❌ PocketBase indisponible');
}
```

## 📚 API Complète

### Récupération de Données

#### getRecords(collectionKey, options)
Récupère tous les enregistrements d'une collection.

```javascript
// Récupération simple
const members = await pbManager.getRecords('members');

// Avec filtres et tri
const activeMembers = await pbManager.getRecords('members', {
    filter: 'active = true',
    sort: 'name',
    perPage: 100
});

// Avec expansion de relations
const memberSkills = await pbManager.getRecords('memberSkills', {
    expand: 'member,skill',
    sort: '-updated'
});
```

**Options disponibles** :
- `filter` : Filtre PocketBase (ex: `'active = true'`)
- `sort` : Tri (ex: `'name'` ou `'-created'`)
- `expand` : Relations à étendre (ex: `'member,skill'`)
- `perPage` : Nombre d'enregistrements (défaut: 500)

#### getRecord(collectionKey, id, options)
Récupère un enregistrement spécifique par ID.

```javascript
const member = await pbManager.getRecord('members', 'abc123xyz', {
    expand: 'skills'
});
```

### Création de Données

#### createRecord(collectionKey, data)
Crée un nouvel enregistrement.

```javascript
const newMember = await pbManager.createRecord('members', {
    name: 'Alice Martin',
    email: 'alice@example.com',
    role: 'Developer',
    active: true
});

console.log('ID créé:', newMember.id);
```

### Mise à Jour de Données

#### updateRecord(collectionKey, id, data)
Met à jour un enregistrement existant.

```javascript
await pbManager.updateRecord('members', 'abc123xyz', {
    role: 'Tech Lead',
    active: true
});
```

### Suppression de Données

#### deleteRecord(collectionKey, id)
Supprime un enregistrement.

```javascript
const success = await pbManager.deleteRecord('members', 'abc123xyz');
if (success) {
    console.log('Enregistrement supprimé');
}
```

## 🔄 Synchronisation Automatique

### startSync(callback, interval)
Active la synchronisation automatique.

```javascript
// Synchroniser toutes les 30 secondes
pbManager.startSync(async () => {
    console.log('Synchronisation...');
    await loadDataFromPocketBase();
    updateUI();
}, 30000);
```

### stopSync()
Arrête la synchronisation automatique.

```javascript
pbManager.stopSync();
```

## 💾 Gestion du Cache

### getCachedRecords(collectionKey)
Récupère les données en cache (sans requête réseau).

```javascript
const cachedMembers = pbManager.getCachedRecords('members');
```

### isCached(collectionKey)
Vérifie si une collection est en cache.

```javascript
if (pbManager.isCached('members')) {
    console.log('Données en cache disponibles');
}
```

### clearCache()
Vide tout le cache.

```javascript
pbManager.clearCache();
```

## 🎨 Exemple Complet

```javascript
// Configuration
const PB_CONFIG = {
    baseUrl: 'http://localhost:8090',
    collections: {
        members: 'skills_matrix_members',
        skills: 'skills_matrix_skills',
        memberSkills: 'skills_matrix_member_skills'
    }
};

// Initialisation
const pbManager = new PocketBaseManager(
    PB_CONFIG.baseUrl,
    PB_CONFIG.collections
);

// Fonction d'initialisation
async function initPocketBase() {
    try {
        const isConnected = await pbManager.testConnection();
        
        if (isConnected) {
            console.log('✅ PocketBase connecté');
            await loadData();
            startAutoSync();
        } else {
            console.log('📦 Mode local (localStorage)');
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('Erreur initialisation:', error);
        loadFromLocalStorage();
    }
}

// Chargement des données
async function loadData() {
    try {
        // Charger les membres
        const members = await pbManager.getRecords('members', {
            filter: 'active = true',
            sort: 'name'
        });
        
        // Charger les compétences
        const skills = await pbManager.getRecords('skills', {
            filter: 'active = true'
        });
        
        // Charger les évaluations avec relations
        const memberSkills = await pbManager.getRecords('memberSkills', {
            expand: 'member,skill'
        });
        
        // Mettre à jour l'interface
        updateUI(members, skills, memberSkills);
        
        console.log(`📊 Chargé: ${members.length} membres, ${skills.length} compétences`);
    } catch (error) {
        console.error('Erreur chargement:', error);
    }
}

// Sauvegarde d'un membre
async function saveMember(memberData) {
    try {
        if (memberData.id) {
            // Mise à jour
            await pbManager.updateRecord('members', memberData.id, memberData);
        } else {
            // Création
            const created = await pbManager.createRecord('members', memberData);
            memberData.id = created.id;
        }
        
        console.log('✅ Membre sauvegardé');
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
    }
}

// Synchronisation automatique
function startAutoSync() {
    pbManager.startSync(async () => {
        await loadData();
    }, 5 * 60 * 1000); // Toutes les 5 minutes
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', initPocketBase);
```

## 🔧 Configuration par Outil

Chaque outil doit créer son propre fichier d'intégration (ex: `pocketbase-integration.js`) :

```javascript
// Configuration spécifique à l'outil
const PB_CONFIG = {
    baseUrl: 'http://localhost:8090',
    collections: {
        // Mapper les clés logiques aux noms de collections
        members: 'mon_outil_members',
        items: 'mon_outil_items'
    }
};

// Créer l'instance
const pbManager = new PocketBaseManager(
    PB_CONFIG.baseUrl,
    PB_CONFIG.collections
);

// Implémenter la logique spécifique
async function loadFromPocketBase() {
    // Logique de chargement spécifique à l'outil
}

async function saveToPocketBase() {
    // Logique de sauvegarde spécifique à l'outil
}
```

## ⚠️ Gestion d'Erreurs

Le gestionnaire gère automatiquement les erreurs et fournit des fallbacks :

```javascript
try {
    const records = await pbManager.getRecords('members');
} catch (error) {
    // En cas d'erreur, retourne le cache ou un tableau vide
    console.error('Erreur:', error);
    const cachedRecords = pbManager.getCachedRecords('members');
}
```

## 🎯 Bonnes Pratiques

1. **Toujours tester la connexion** avant d'utiliser PocketBase
2. **Implémenter un fallback** vers localStorage
3. **Utiliser le cache** pour optimiser les performances
4. **Synchroniser régulièrement** mais pas trop fréquemment (5-30 min)
5. **Gérer les erreurs** de manière appropriée
6. **Logger les opérations** pour faciliter le débogage

## 📖 Références

- **Documentation PocketBase** : https://pocketbase.io/docs/
- **API REST** : https://pocketbase.io/docs/api-records/
- **Filtres** : https://pocketbase.io/docs/api-rules-and-filters/

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14  
**Auteur** : BastaVerse
