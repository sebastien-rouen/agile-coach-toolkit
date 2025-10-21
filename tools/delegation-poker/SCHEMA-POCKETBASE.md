# 📋 Schéma PocketBase - Delegation Poker

## Mapping des champs

Ce document liste les correspondances entre les champs utilisés dans l'application et ceux dans PocketBase.

### Collection : `tools_delegation_poker_sessions`

| Application | PocketBase | Type | Requis | Notes |
|-------------|------------|------|--------|-------|
| `name` | `session_name` | text | ✅ | Nom de la session (3-200 caractères) |
| `participants` | `participants` | json | ✅ | Array de participants (auto-parsé par PocketBase) |
| `status` | `status` | select | ❌ | `active`, `completed`, `archived` (défaut: `active`) |
| `id` | `id` | text | ✅ | Auto-généré (15 caractères) |
| - | `created` | autodate | ✅ | Date de création |
| - | `updated` | autodate | ✅ | Date de modification |

**Exemple de données :**
```javascript
{
  session_name: "Équipe Produit - Sprint Planning",
  participants: ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"],
  status: "active"
}
```

### Collection : `tools_delegation_poker_decisions`

| Application | PocketBase | Type | Requis | Notes |
|-------------|------------|------|--------|-------|
| `text` | `decision_text` | text | ✅ | Texte de la décision (3-200 caractères) |
| `category` | `category` | select | ✅ | `technical`, `organizational`, `product`, `team`, `other` |
| `order` | `order` | number | ❌ | Ordre d'affichage |
| `status` | `status` | select | ❌ | `pending`, `voting`, `completed` |
| `session_id` | `session_id` | relation | ✅ | ID de la session (cascade delete) |
| `id` | `id` | text | ✅ | Auto-généré (15 caractères) |
| - | `created` | autodate | ✅ | Date de création |
| - | `updated` | autodate | ✅ | Date de modification |

**Exemple de données :**
```javascript
{
  session_id: "oijsu0f2qe1mi7l",
  decision_text: "Choix des technologies pour un nouveau composant",
  category: "technical",
  order: 0,
  status: "pending"
}
```

### Collection : `tools_delegation_poker_votes`

| Application | PocketBase | Type | Requis | Notes |
|-------------|------------|------|--------|-------|
| `participant` | `participant_name` | text | ✅ | Nom du participant (1-100 caractères) |
| `level` | `delegation_level` | number | ✅ | Niveau de délégation (1-7) |
| `comment` | `comment` | text | ❌ | Commentaire optionnel (max 500 caractères) |
| - | `voted_at` | date | ❌ | Date du vote |
| `session_id` | `session_id` | relation | ✅ | ID de la session (cascade delete) |
| `decision_id` | `decision_id` | relation | ✅ | ID de la décision (cascade delete) |
| `id` | `id` | text | ✅ | Auto-généré (15 caractères) |
| - | `created` | autodate | ✅ | Date de création |
| - | `updated` | autodate | ✅ | Date de modification |

**Index unique :** `(decision_id, participant_name)` - Un participant ne peut voter qu'une fois par décision

**Exemple de données :**
```javascript
{
  session_id: "oijsu0f2qe1mi7l",
  decision_id: "abc123xyz456789",
  participant_name: "Alice (PO)",
  delegation_level: 4,
  comment: "",
  voted_at: "2024-01-15T10:30:00Z"
}
```

### Collection : `tools_delegation_poker_consensus`

| Application | PocketBase | Type | Requis | Notes |
|-------------|------------|------|--------|-------|
| `final_level` | `final_level` | number | ✅ | Niveau consensuel (1-7) |
| `notes` | `notes` | text | ❌ | Notes de discussion (max 1000 caractères) |
| - | `agreed_at` | date | ❌ | Date du consensus |
| `session_id` | `session_id` | relation | ✅ | ID de la session (cascade delete) |
| `decision_id` | `decision_id` | relation | ✅ | ID de la décision (cascade delete) |
| `id` | `id` | text | ✅ | Auto-généré (15 caractères) |
| - | `created` | autodate | ✅ | Date de création |
| - | `updated` | autodate | ✅ | Date de modification |

**Exemple de données :**
```javascript
{
  session_id: "oijsu0f2qe1mi7l",
  decision_id: "abc123xyz456789",
  final_level: 4,
  notes: "Décision collective avec légère autonomie",
  agreed_at: "2024-01-15T10:35:00Z"
}
```

## Relations

```
tools_delegation_poker_sessions (1)
    ↓
    ├─→ tools_delegation_poker_decisions (N)
    │       ↓
    │       ├─→ tools_delegation_poker_votes (N)
    │       └─→ tools_delegation_poker_consensus (1)
    │
    ├─→ tools_delegation_poker_votes (N)
    └─→ tools_delegation_poker_consensus (N)
```

**Cascade Delete :** Quand une session est supprimée, toutes ses décisions, votes et consensus sont automatiquement supprimés.

## Règles d'accès

Toutes les collections sont publiques (règles vides) :
- `listRule: ""`
- `viewRule: ""`
- `createRule: ""`
- `updateRule: ""`
- `deleteRule: ""`

⚠️ **Note** : Pour une utilisation en production publique, il faudrait ajouter des règles d'authentification.

## Migrations

Les migrations sont dans `bdd/pb_migrations/` :

1. `1757700001_create_delegation_poker_sessions.js` - Création des sessions
2. `1757700002_create_delegation_poker_decisions.js` - Création des décisions
3. `1757700003_create_delegation_poker_votes.js` - Création des votes
4. `1757700004_create_delegation_poker_consensus.js` - Création des consensus
5. `1757700402_public_access_tools_delegation_poker.js` - Accès public

## Exemples de requêtes

### Créer une session
```javascript
await pbAPI.createSession({
  session_name: "Test Session",
  participants: ["Alice", "Bob", "Charlie"],
  status: "active"
});
```

### Créer une décision
```javascript
await pbAPI.createDecision({
  session_id: "oijsu0f2qe1mi7l",
  decision_text: "Choix des technologies",
  category: "technical",
  order: 0,
  status: "pending"
});
```

### Créer un vote
```javascript
await pbAPI.createVote({
  session_id: "oijsu0f2qe1mi7l",
  decision_id: "abc123xyz456789",
  participant_name: "Alice (PO)",
  delegation_level: 4,
  voted_at: new Date().toISOString()
});
```

### Créer un consensus
```javascript
await pbAPI.createConsensus({
  session_id: "oijsu0f2qe1mi7l",
  decision_id: "abc123xyz456789",
  final_level: 4,
  notes: "Décision collective",
  agreed_at: new Date().toISOString()
});
```

### Récupérer les décisions d'une session
```javascript
const response = await pbAPI.getDecisions("oijsu0f2qe1mi7l");
const decisions = response.items;
```

### Récupérer les votes d'une décision
```javascript
const response = await pbAPI.getVotes("abc123xyz456789");
const votes = response.items;
```

### Récupérer le consensus d'une décision
```javascript
const response = await pbAPI.getConsensus("abc123xyz456789");
const consensus = response.items[0]; // Un seul consensus par décision
```

## Dépannage

### Erreur 400 : Bad Request

**Cause** : Noms de champs incorrects ou champs requis manquants

**Solution** : Vérifier que tous les champs requis sont présents et utilisent les bons noms (voir tableaux ci-dessus)

### Erreur 404 : Not Found

**Cause** : Collection ou enregistrement introuvable

**Solution** : Vérifier que les migrations sont appliquées et que l'ID existe

### Erreur : "Unexpected token 'M', ... is not valid JSON"

**Cause** : Tentative de parser un champ JSON déjà parsé par PocketBase

**Solution** : Vérifier avec `Array.isArray()` avant d'utiliser `JSON.parse()`

```javascript
// ✅ Bon
const participants = Array.isArray(session.participants) 
    ? session.participants 
    : JSON.parse(session.participants);

// ❌ Mauvais
const participants = JSON.parse(session.participants);
```

---

**Dernière mise à jour** : 2024-01-15
