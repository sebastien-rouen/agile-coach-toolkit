# Configuration PocketBase pour Delegation Poker

## 🗄️ Collections à créer

### Collection 1 : `tools_delegation_poker_sessions`
**Description** : Stocke les sessions de Delegation Poker

**Champs** :
- `id` (auto) : Identifiant unique
- `session_name` (text) : Nom de la session
- `participants` (json) : Liste des participants ["Alice", "Bob", "Charlie"]
- `status` (select) : Statut ["active", "completed", "archived"]
- `created` (autodate) : Date de création automatique
- `updated` (autodate) : Date de mise à jour automatique

**Options** :
- API Rules : Read/Write accessible sans authentification

---

### Collection 2 : `tools_delegation_poker_decisions`
**Description** : Les décisions à clarifier

**Champs** :
- `id` (auto) : Identifiant unique
- `session_id` (relation) : Lien vers tools_delegation_poker_sessions
- `decision_text` (text) : Description de la décision (3-200 caractères)
- `category` (select) : ["technical", "organizational", "product", "team", "other"]
- `order` (number) : Ordre d'affichage
- `status` (select) : Statut ["pending", "voting", "completed"]
- `created` (autodate) : Date de création automatique
- `updated` (autodate) : Date de mise à jour automatique

**Options** :
- API Rules : Read/Write accessible sans authentification
- Cascade delete si session supprimée

---

### Collection 3 : `tools_delegation_poker_votes`
**Description** : Votes des participants

**Champs** :
- `id` (auto) : Identifiant unique
- `session_id` (relation) : Lien vers tools_delegation_poker_sessions
- `decision_id` (relation) : Lien vers tools_delegation_poker_decisions
- `participant_name` (text) : Nom du participant
- `delegation_level` (number) : Niveau de délégation (1-7)
- `comment` (text, optional) : Commentaire justificatif
- `voted_at` (date, optional) : Date du vote
- `created` (autodate) : Date de création automatique
- `updated` (autodate) : Date de mise à jour automatique

**Options** :
- API Rules : Read/Write accessible sans authentification
- Index sur (decision_id, participant_name) pour éviter les doublons

---

### Collection 4 : `tools_delegation_poker_consensus`
**Description** : Consensus finaux par décision

**Champs** :
- `id` (auto) : Identifiant unique
- `session_id` (relation) : Lien vers tools_delegation_poker_sessions
- `decision_id` (relation) : Lien vers tools_delegation_poker_decisions
- `final_level` (number) : Niveau de délégation consensuel (1-7)
- `notes` (text, optional) : Notes de la discussion
- `agreed_at` (date, optional) : Date du consensus
- `created` (autodate) : Date de création automatique
- `updated` (autodate) : Date de mise à jour automatique

**Options** :
- API Rules : Read/Write accessible sans authentification

---

## 🌱 Données de seed (exemples)

La migration `1757700010_seed_examples.js` crée **5 sessions exemples** avec décisions variées :

### 1. Équipe Produit - Sprint Planning
**Participants** : Alice (PO), Bob (Dev), Charlie (SM)  
**Décisions** : 5 décisions (technical, product, organizational, team, other)  
**Statut** : active

### 2. Service RH - Processus de Recrutement
**Participants** : Marie (DRH), Thomas (Manager), Sophie (Recruteur), Luc (Opérationnel)  
**Décisions** : 6 décisions (validation candidatures, grilles salariales, outils sourcing, entretiens, embauche, avantages)  
**Statut** : active

### 3. Service Urgences - Protocoles de Soins
**Participants** : Dr. Dubois (Chef), Infirmière Claire, Dr. Martin (Interne), Aide-soignant Paul  
**Décisions** : 7 décisions (prescriptions, triage, examens, transferts, stocks, gardes, réanimation)  
**Statut** : completed

### 4. Unité Tactique - Préparation Mission
**Participants** : Capitaine Moreau, Lieutenant Durand, Sergent-Chef Petit, Caporal Bernard  
**Décisions** : 8 décisions (engagement combat, itinéraire, communication, rôles, soutien aérien, permissions, maintenance, évacuation)  
**Statut** : active

### 5. Permis de Conduire Numérique - MVP
**Participants** : Emma (Chef Projet), Lucas (Dev Backend), Chloé (UX Designer), Antoine (Sécurité)  
**Décisions** : 9 décisions (architecture sécurité, identité numérique, MVP, UX/UI, déploiement, incidents, partenaires, sprints, RGPD)  
**Statut** : active

### Exemple de structure JSON

```json
{
  "session_name": "Équipe Produit - Sprint Planning",
  "participants": ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"],
  "status": "active"
}
```

```json
{
  "decision_text": "Choix des technologies pour un nouveau composant",
  "category": "technical",
  "order": 1,
  "status": "pending"
}
```

---

## 🔧 Configuration PocketBase

1. Créer les 4 collections dans l'interface admin
2. Configurer les relations :
   - decisions.session_id → sessions.id
   - votes.decision_id → decisions.id
   - consensus.decision_id → decisions.id
3. Activer les API Rules publiques (sans auth)
4. Importer les données de seed (optionnel)

---

## 🔗 Endpoints utilisés par l'app

```javascript
// Sessions
GET    /api/collections/tools_delegation_poker_sessions/records
POST   /api/collections/tools_delegation_poker_sessions/records
PATCH  /api/collections/tools_delegation_poker_sessions/records/:id

// Decisions
GET    /api/collections/tools_delegation_poker_decisions/records?filter=(session_id='...')
POST   /api/collections/tools_delegation_poker_decisions/records
DELETE /api/collections/tools_delegation_poker_decisions/records/:id

// Votes
GET    /api/collections/tools_delegation_poker_votes/records?filter=(decision_id='...')
POST   /api/collections/tools_delegation_poker_votes/records

// Consensus
POST   /api/collections/tools_delegation_poker_consensus/records
PATCH  /api/collections/tools_delegation_poker_consensus/records/:id
```
