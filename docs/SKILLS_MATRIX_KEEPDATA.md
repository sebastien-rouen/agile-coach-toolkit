# Skills Matrix - Champ keepData

## Vue d'ensemble

Le champ `keepData` a été ajouté à la collection `tools_skills_matrix_matrices` pour permettre de marquer les matrices qui doivent être conservées ou supprimées.

## Structure de la collection

**Collection** : `tools_skills_matrix_matrices`

| Champ | Type | Description |
|-------|------|-------------|
| id | text | Identifiant unique (auto-généré) |
| name | text | Nom de la matrice (requis) |
| company | text | Entreprise/Organisation (optionnel) |
| description | text | Description (optionnel) |
| active | bool | Statut actif/inactif |
| **keepData** | **bool** | **Conserver ou supprimer la matrice** |
| created | autodate | Date de création |
| updated | autodate | Date de modification |

## API

### GET /api/skills-matrix/:matrixId

Récupérer une matrice par son ID.

**Réponse** :
```json
{
  "success": true,
  "matrix": {
    "id": "abc123def456789",
    "name": "Équipe Dev Frontend",
    "company": "Acme Corp",
    "description": "Matrice de compétences frontend",
    "active": true,
    "keepData": false,
    "created": "2025-01-22T10:00:00.000Z",
    "updated": "2025-01-22T10:00:00.000Z"
  }
}
```

### PUT /api/skills-matrix/:matrixId/keep-data

Mettre à jour le statut `keepData` d'une matrice.

**Body** :
```json
{
  "keepData": true
}
```

**Réponse** :
```json
{
  "success": true,
  "matrixId": "abc123def456789",
  "keepData": true
}
```

## Utilisation

### Marquer une matrice pour conservation

```javascript
async function keepMatrix(matrixId) {
    const response = await fetch(`/api/skills-matrix/${matrixId}/keep-data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keepData: true })
    });
    
    const result = await response.json();
    if (result.success) {
        console.log('Matrice marquée pour conservation');
    }
}
```

### Marquer une matrice pour suppression

```javascript
async function allowMatrixDeletion(matrixId) {
    const response = await fetch(`/api/skills-matrix/${matrixId}/keep-data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keepData: false })
    });
    
    const result = await response.json();
    if (result.success) {
        console.log('Matrice peut être supprimée');
    }
}
```

### Récupérer une matrice

```javascript
async function getMatrix(matrixId) {
    const response = await fetch(`/api/skills-matrix/${matrixId}`);
    const result = await response.json();
    
    if (result.success) {
        console.log('Matrice:', result.matrix);
        console.log('KeepData:', result.matrix.keepData);
    }
}
```

## Cas d'usage

### Interface utilisateur

```html
<div class="matrix-actions">
    <label>
        <input type="checkbox" id="keepDataCheckbox" onchange="toggleKeepData()">
        <span>Conserver cette matrice</span>
    </label>
</div>
```

```javascript
let currentMatrixId = 'abc123def456789';

async function toggleKeepData() {
    const checkbox = document.getElementById('keepDataCheckbox');
    const keepData = checkbox.checked;
    
    try {
        const response = await fetch(`/api/skills-matrix/${currentMatrixId}/keep-data`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keepData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (keepData) {
                showNotification('Matrice marquée pour conservation', 'success');
            } else {
                showNotification('Matrice peut être supprimée', 'info');
            }
        }
    } catch (error) {
        console.error('Erreur:', error);
        checkbox.checked = !keepData; // Annuler le changement
        showNotification('Erreur lors de la mise à jour', 'error');
    }
}

// Charger l'état initial
async function loadMatrix(matrixId) {
    currentMatrixId = matrixId;
    
    const response = await fetch(`/api/skills-matrix/${matrixId}`);
    const result = await response.json();
    
    if (result.success) {
        document.getElementById('keepDataCheckbox').checked = result.matrix.keepData;
    }
}
```

## Règles d'accès

La collection `tools_skills_matrix_matrices` nécessite une authentification :

- **Lecture** : `@request.auth.id != ''`
- **Création** : `@request.auth.id != ''`
- **Modification** : `@request.auth.id != ''`
- **Suppression** : `@request.auth.id != ''`

## Migration

Le champ `keepData` a été ajouté directement dans la migration initiale `1757700001_create_matrices.js`. Si vous avez déjà des matrices existantes, elles auront `keepData = null` par défaut.

## Commandes

```bash
# Redémarrer PocketBase pour appliquer la migration
pm2 restart pb-agile-drafts

# Redémarrer l'API
pm2 restart "drafts.api"

# Vérifier les logs
pm2 logs "drafts.api"
```

## Accès PocketBase Admin

Pour gérer manuellement les matrices :

```
http://localhost:8090/_/
Collection: tools_skills_matrix_matrices
```

## Exemples de requêtes

```bash
# Récupérer une matrice
curl http://localhost:3002/api/agile/skills-matrix/abc123def456789

# Marquer pour conservation
curl -X PUT http://localhost:3002/api/agile/skills-matrix/abc123def456789/keep-data \
  -H "Content-Type: application/json" \
  -d '{"keepData": true}'

# Autoriser la suppression
curl -X PUT http://localhost:3002/api/agile/skills-matrix/abc123def456789/keep-data \
  -H "Content-Type: application/json" \
  -d '{"keepData": false}'
```
