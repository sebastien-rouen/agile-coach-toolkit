# 🔌 Intégration API PocketBase pour les Program Increments (PI)

## 📋 Vue d'ensemble

L'outil Velocity Squad dispose désormais d'une intégration complète avec PocketBase pour la gestion des Program Increments (PI). Les PIs créés via la modal sont automatiquement sauvegardés dans PocketBase et synchronisés entre les sessions.

---

## 🚀 Fonctionnalités

### Création de PI
- Formulaire accessible via le bouton "🎯 Gérer les PIs" puis "➕ Nouveau PI"
- Sauvegarde automatique dans PocketBase lors de la soumission
- Validation des dates (date de fin > date de début)
- Calcul automatique des sprints inclus dans le PI

### Modification de PI
- Édition via le bouton "✏️ Modifier" dans la liste des PIs
- Mise à jour automatique dans PocketBase
- Recalcul des sprints associés

### Suppression de PI
- Suppression via le bouton "🗑️ Supprimer" avec confirmation
- Suppression automatique dans PocketBase
- Mise à jour immédiate de l'interface

### Chargement automatique
- Les PIs sont chargés automatiquement au démarrage de la session
- Synchronisation avec les autres données (sprints, équipe, etc.)
- Affichage sur le graphique de vélocité

---

## 🔧 Architecture Technique

### Routes API

**Base URL** : `/api/velocity-squad/`

#### POST /api/velocity-squad/pi
Créer un nouveau Program Increment

**Body** :
```json
{
  "session": "session_id",
  "name": "PI 2025.1",
  "startDate": "2025-01-06",
  "endDate": "2025-03-14",
  "location": "Remote",
  "comment": "Objectifs du PI",
  "sprints": ["sprint1", "sprint2"]
}
```

**Response** :
```json
{
  "success": true,
  "pi": {
    "id": "abc123xyz",
    "session": "session_id",
    "name": "PI 2025.1",
    "startDate": "2025-01-06",
    "endDate": "2025-03-14",
    "location": "Remote",
    "comment": "Objectifs du PI",
    "sprints": ["sprint1", "sprint2"],
    "created": "2025-01-01T10:00:00.000Z",
    "updated": "2025-01-01T10:00:00.000Z"
  }
}
```

#### GET /api/velocity-squad/pi/:sessionId
Récupérer tous les PIs d'une session

**Response** :
```json
{
  "success": true,
  "pis": [
    {
      "id": "abc123xyz",
      "session": "session_id",
      "name": "PI 2025.1",
      "startDate": "2025-01-06",
      "endDate": "2025-03-14",
      "location": "Remote",
      "comment": "Objectifs du PI",
      "sprints": ["sprint1", "sprint2"],
      "created": "2025-01-01T10:00:00.000Z",
      "updated": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

#### PUT /api/velocity-squad/pi/:piId
Mettre à jour un Program Increment

**Body** :
```json
{
  "name": "PI 2025.1 - Updated",
  "startDate": "2025-01-06",
  "endDate": "2025-03-21",
  "location": "Paris",
  "comment": "Objectifs mis à jour",
  "sprints": ["sprint1", "sprint2", "sprint3"]
}
```

**Response** :
```json
{
  "success": true,
  "pi": {
    "id": "abc123xyz",
    "name": "PI 2025.1 - Updated",
    "startDate": "2025-01-06",
    "endDate": "2025-03-21",
    "location": "Paris",
    "comment": "Objectifs mis à jour",
    "sprints": ["sprint1", "sprint2", "sprint3"],
    "updated": "2025-01-02T14:30:00.000Z"
  }
}
```

#### DELETE /api/velocity-squad/pi/:piId
Supprimer un Program Increment

**Response** :
```json
{
  "success": true,
  "message": "PI supprimé avec succès"
}
```

---

## 📝 Fonctions JavaScript

### savePiToPocketBase(pi)
Sauvegarde ou met à jour un PI dans PocketBase

**Paramètres** :
- `pi` : Objet PI avec les propriétés `name`, `startDate`, `endDate`, `location`, `comment`, `sprints`

**Comportement** :
- Si `pi.pbId` existe : mise à jour
- Sinon : création et assignation de `pbId`

**Exemple** :
```javascript
const newPi = {
    name: "PI 2025.1",
    startDate: "2025-01-06",
    endDate: "2025-03-14",
    location: "Remote",
    comment: "Objectifs du PI",
    sprints: ["sprint1", "sprint2"]
};

await savePiToPocketBase(newPi);
console.log(newPi.pbId); // ID PocketBase assigné
```

### updatePiInPocketBase(pi)
Met à jour un PI existant dans PocketBase

**Paramètres** :
- `pi` : Objet PI avec `pbId` et les propriétés à mettre à jour

**Exemple** :
```javascript
const pi = {
    pbId: "abc123xyz",
    name: "PI 2025.1 - Updated",
    startDate: "2025-01-06",
    endDate: "2025-03-21",
    location: "Paris",
    comment: "Objectifs mis à jour",
    sprints: ["sprint1", "sprint2", "sprint3"]
};

await updatePiInPocketBase(pi);
```

### deletePiFromPocketBase(pi)
Supprime un PI de PocketBase

**Paramètres** :
- `pi` : Objet PI avec `pbId`

**Exemple** :
```javascript
const pi = { pbId: "abc123xyz" };
await deletePiFromPocketBase(pi);
```

---

## 🔄 Flux de Données

### Création d'un PI

1. **Utilisateur** : Remplit le formulaire dans la modal
2. **script.js** : Validation et création de l'objet PI
3. **pocketbase-integration.js** : Appel de `savePiToPocketBase()`
4. **API** : POST `/api/velocity-squad/pi`
5. **PocketBase** : Enregistrement dans `tools_velocity_squad_pi`
6. **Interface** : Mise à jour du graphique et de la liste

### Chargement au démarrage

1. **pocketbase-integration.js** : `loadFromPocketBase()`
2. **API** : GET `/api/velocity-squad/pi/:sessionId`
3. **PocketBase** : Récupération des PIs de la session
4. **Conversion** : `convertPocketBaseToApp()` transforme les données
5. **Interface** : Affichage des PIs sur le graphique

---

## 🗄️ Structure de la Collection PocketBase

**Collection** : `tools_velocity_squad_pi`

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | text | ✅ | Identifiant unique (auto-généré) |
| `session` | relation | ✅ | Référence à `tools_velocity_squad_sessions` |
| `name` | text | ✅ | Nom du PI (ex: "PI 2025.1") |
| `startDate` | date | ✅ | Date de début du PI |
| `endDate` | date | ✅ | Date de fin du PI |
| `location` | text | ❌ | Localisation du PI Planning |
| `comment` | text | ❌ | Objectifs et notes |
| `sprints` | json | ❌ | Liste des IDs de sprints |
| `created` | autodate | ✅ | Date de création (auto) |
| `updated` | autodate | ✅ | Date de mise à jour (auto) |

---

## 🧪 Tests

### Test de création

1. Ouvrir l'outil avec une session : `?session=abc123`
2. Cliquer sur "🎯 Gérer les PIs"
3. Cliquer sur "➕ Nouveau PI"
4. Remplir le formulaire et soumettre
5. Vérifier dans PocketBase Admin : `http://localhost:8116/_/`
6. Collection : `tools_velocity_squad_pi`

### Test de modification

1. Dans la liste des PIs, cliquer sur "✏️ Modifier"
2. Modifier les champs et soumettre
3. Vérifier la mise à jour dans PocketBase

### Test de suppression

1. Dans la liste des PIs, cliquer sur "🗑️ Supprimer"
2. Confirmer la suppression
3. Vérifier la suppression dans PocketBase

### Test de chargement

1. Créer un PI via PocketBase Admin
2. Recharger la page de l'outil
3. Vérifier que le PI apparaît sur le graphique

---

## 🐛 Dépannage

### Les PIs ne se sauvegardent pas

**Vérifications** :
1. PocketBase est démarré : `pm2 status`
2. Collection existe : `http://localhost:8116/_/`
3. Session valide dans l'URL : `?session=abc123`
4. Console navigateur : Vérifier les erreurs

**Solution** :
```bash
# Redémarrer PocketBase
pm2 restart pb-agile-drafts

# Vérifier les logs
pm2 logs pb-agile-drafts
```

### Les PIs ne se chargent pas

**Vérifications** :
1. Session existe dans PocketBase
2. PIs associés à la bonne session
3. Filtre de requête correct

**Solution** :
```javascript
// Dans la console navigateur
console.log('Session ID:', window.currentSessionId);
console.log('PocketBase actif:', usePocketBase);
```

### Erreur 404 sur l'API

**Vérifications** :
1. API Multi-Sites démarrée : `pm2 status`
2. Route chargée : Vérifier les logs API

**Solution** :
```bash
# Redémarrer l'API
pm2 restart drafts.api

# Vérifier les logs
pm2 logs drafts.api
```

---

## 📚 Références

- **Guide PI Planning** : `docs/PI-PLANNING-GUIDE.md`
- **Architecture PocketBase** : `docs/README-POCKETBASE.md`
- **Migration PI** : `bdd/pb_migrations/1757600105_create_velocity_squad_pi.js`
- **Routes API** : `api/routes/routes-velocity-squad.js`

---

## ✅ Checklist d'Intégration

- [x] Route API créée (`routes-velocity-squad.js`)
- [x] Collection PocketBase existante (`tools_velocity_squad_pi`)
- [x] Fonctions de synchronisation ajoutées (`pocketbase-integration.js`)
- [x] Méthodes `savePi()` et `deletePi()` mises à jour (`script.js`)
- [x] Chargement automatique des PIs au démarrage
- [x] Documentation complète
- [x] CHANGELOG mis à jour

---

**Date de création** : 27 octobre 2025  
**Version** : 1.0.0  
**Auteur** : Kiro AI Assistant
