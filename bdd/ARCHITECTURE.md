# 🏗️ Architecture PocketBase - Skills Matrix

## 📊 Schéma de la Base de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILLS MATRIX DATABASE                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│  matrices                │
│  ────────────────────    │
│  • id (PK)               │
│  • name                  │
│  • company               │
│  • description           │
│  • active                │
│  • created               │
│  • updated               │
└────────┬─────────────────┘
         │
         │ 1:N
         │
    ┌────┴────────────────────────────────────┐
    │                                          │
    │                                          │
┌───▼──────────────────┐            ┌─────────▼────────────────┐
│  members             │            │  items                   │
│  ──────────────      │            │  ─────────────           │
│  • id (PK)           │            │  • id (PK)               │
│  • matrix (FK)       │            │  • matrix (FK)           │
│  • name              │            │  • name                  │
│  • email             │            │  • type (skill|ownership)│
│  • role              │            │  • category              │
│  • avatar            │            │  • description           │
│  • active            │            │  • active                │
│  • created           │            │  • created               │
│  • updated           │            │  • updated               │
└───┬──────────────────┘            └─────────┬────────────────┘
    │                                          │
    │                                          │
    │              ┌───────────────────────────┘
    │              │
    │              │
    │         ┌────▼──────────────────────┐
    │         │  member_items             │
    └─────────►  ───────────────────      │
              │  • id (PK)                │
              │  • matrix (FK)            │
              │  • member (FK)            │
              │  • item (FK)              │
              │  • level (0-4)            │  ← Pour skills
              │  • appetite (0-4)         │  ← Pour skills
              │  • ownership_role         │  ← Pour ownerships
              │  • notes                  │
              │  • last_assessed          │
              │  • created                │
              │  • updated                │
              └───────────────────────────┘


┌──────────────────────────┐
│  templates               │  (Indépendant)
│  ────────────────────    │
│  • id (PK)               │
│  • name                  │
│  • description           │
│  • category              │
│  • icon                  │
│  • data (JSON)           │
│  • active                │
│  • created               │
│  • updated               │
└──────────────────────────┘
```

## 🔗 Relations et Cardinalités

### Matrices → Members (1:N)
- Une matrice peut avoir plusieurs membres
- Un membre appartient à une seule matrice
- Cascade delete : Supprimer une matrice supprime ses membres

### Matrices → Items (1:N)
- Une matrice peut avoir plusieurs items (skills + ownerships)
- Un item appartient à une seule matrice
- Cascade delete : Supprimer une matrice supprime ses items

### Members ↔ Items (N:N via member_items)
- Un membre peut avoir plusieurs items (skills + ownerships)
- Un item peut être associé à plusieurs membres
- Table pivot : `member_items`
- Cascade delete : Supprimer un membre ou un item supprime les associations

### Templates (Indépendant)
- Aucune relation directe avec les autres tables
- Contient des structures JSON pour créer rapidement des matrices
- Public en lecture, authentifié pour modification

## 📋 Index et Contraintes

### Matrices
- **PK** : `id`
- **Index** : Aucun index supplémentaire

### Members
- **PK** : `id`
- **FK** : `matrix` → `matrices.id`
- **Index unique** : `(matrix, email)` WHERE email != ''
  - Empêche les doublons d'email dans une même matrice

### Items
- **PK** : `id`
- **FK** : `matrix` → `matrices.id`
- **Index unique** : `(matrix, type, name)`
  - Empêche les doublons de nom pour un même type dans une matrice
  - Permet d'avoir un skill "JavaScript" ET un ownership "JavaScript" (types différents)

### Member_Items
- **PK** : `id`
- **FK** : `matrix` → `matrices.id`
- **FK** : `member` → `members.id`
- **FK** : `item` → `items.id`
- **Index unique** : `(matrix, member, item)`
  - Empêche les associations en double
  - Un membre ne peut avoir qu'une seule association par item

### Templates
- **PK** : `id`
- **Index unique** : `name`
  - Empêche les doublons de nom de template

## 🎯 Types de Données

### Items.type (Discriminant)
```javascript
type: "skill" | "ownership"
```

**Pour les skills** :
- Utilise `level` (0-4) : Niveau de maîtrise
- Utilise `appetite` (0-4) : Appétence/Envie
- `ownership_role` reste NULL

**Pour les ownerships** :
- Utilise `ownership_role` : "Owner" | "Contributor" | "Backup"
- `level` et `appetite` restent NULL

### Member_Items (Champs conditionnels)

```javascript
// Exemple pour un skill
{
  member: "alice_id",
  item: "javascript_skill_id",
  level: 3,
  appetite: 4,
  ownership_role: null
}

// Exemple pour un ownership
{
  member: "bob_id",
  item: "okr_ownership_id",
  level: null,
  appetite: null,
  ownership_role: "Owner"
}
```

## 📦 Structure JSON des Templates

```json
{
  "name": "Authentification",
  "description": "Compétences pour système d'authentification",
  "category": "Tech",
  "icon": "🔐",
  "active": true,
  "data": {
    "skills": [
      {
        "name": "OAuth/SSO",
        "category": "Security",
        "type": "skill"
      }
    ],
    "ownerships": [
      {
        "name": "Architecture Sécurité",
        "category": "Strategic"
      }
    ],
    "members": [
      {
        "name": "Alice",
        "role": "Security Engineer",
        "skills": {
          "OAuth/SSO": { "level": 4, "appetite": 3 }
        },
        "appetences": ["Biométrie", "Zero Trust"],
        "ownerships": {
          "Architecture Sécurité": "Owner"
        }
      }
    ]
  }
}
```

## 🔐 Règles d'Accès (API Rules)

### Matrices, Members, Items, Member_Items
```javascript
listRule:   "@request.auth.id != ''"  // Authentifié
viewRule:   "@request.auth.id != ''"  // Authentifié
createRule: "@request.auth.id != ''"  // Authentifié
updateRule: "@request.auth.id != ''"  // Authentifié
deleteRule: "@request.auth.id != ''"  // Authentifié
```

### Templates
```javascript
listRule:   ""  // Public (lecture seule)
viewRule:   ""  // Public (lecture seule)
createRule: "@request.auth.id != ''"  // Authentifié
updateRule: "@request.auth.id != ''"  // Authentifié
deleteRule: "@request.auth.id != ''"  // Authentifié
```

## 🚀 Patterns de Requêtes

### Récupérer une matrice complète

```javascript
// 1. Charger la matrice
const matrix = await pb.collection('tools_skills_matrix_matrices')
  .getOne(matrixId);

// 2. Charger les membres
const members = await pb.collection('tools_skills_matrix_members')
  .getFullList({
    filter: `matrix="${matrixId}" && active=true`,
    sort: 'name'
  });

// 3. Charger les items (skills + ownerships)
const items = await pb.collection('tools_skills_matrix_items')
  .getFullList({
    filter: `matrix="${matrixId}" && active=true`,
    sort: 'type,category,name'
  });

// 4. Charger toutes les associations
const associations = await pb.collection('tools_skills_matrix_member_items')
  .getFullList({
    filter: `matrix="${matrixId}"`,
    expand: 'member,item'
  });
```

### Filtrer par type

```javascript
// Uniquement les skills
const skills = items.filter(item => item.type === 'skill');

// Uniquement les ownerships
const ownerships = items.filter(item => item.type === 'ownership');

// Skills d'une catégorie
const techSkills = items.filter(item => 
  item.type === 'skill' && item.category === 'Tech'
);
```

### Construire la matrice membre × item

```javascript
// Créer un objet indexé pour accès rapide
const matrixData = {};

members.forEach(member => {
  matrixData[member.id] = {
    member: member,
    skills: {},
    ownerships: {}
  };
});

// Remplir avec les associations
associations.forEach(assoc => {
  const memberId = assoc.member;
  const item = assoc.expand.item;
  
  if (item.type === 'skill') {
    matrixData[memberId].skills[item.id] = {
      item: item,
      level: assoc.level,
      appetite: assoc.appetite,
      notes: assoc.notes
    };
  } else {
    matrixData[memberId].ownerships[item.id] = {
      item: item,
      role: assoc.ownership_role,
      notes: assoc.notes
    };
  }
});
```

## 📈 Évolutivité

### Ajout de nouveaux types d'items

L'architecture permet d'ajouter facilement de nouveaux types :

```javascript
// Actuellement
type: "skill" | "ownership"

// Futur possible
type: "skill" | "ownership" | "certification" | "tool" | "language"
```

Il suffit de :
1. Modifier le champ `type` dans la collection `items`
2. Ajouter les champs spécifiques dans `member_items` si nécessaire
3. Adapter la logique frontend

### Ajout de métadonnées

Champs JSON possibles pour étendre sans migration :

```javascript
// Dans items
{
  metadata: {
    difficulty: "beginner|intermediate|advanced",
    tags: ["frontend", "security"],
    resources: ["https://..."]
  }
}

// Dans member_items
{
  metadata: {
    certifications: ["AWS Certified"],
    last_training: "2025-01-10",
    next_review: "2025-04-10"
  }
}
```

## 🎨 Catégories Suggérées

### Pour Skills
- Tech (JavaScript, Python, Docker...)
- Soft Skills (Communication, Leadership...)
- Agile (Scrum, Kanban, SAFe...)
- Product (User Stories, Roadmap...)
- Design (UX, UI, Figma...)

### Pour Ownerships
- Strategic (OKR, Vision, Roadmap...)
- Governance (Compliance, Audit...)
- Operational (CI/CD, Monitoring...)
- Ritual (Rétros, Planning, Review...)
- Documentation (Wiki, ADR, RFC...)

## 🔄 Cycle de Vie

### Création d'une matrice

```
1. Créer la matrice
   ↓
2. Ajouter les membres
   ↓
3. Ajouter les items (skills + ownerships)
   ↓
4. Créer les associations membre-item
   ↓
5. Évaluer les niveaux/appétences/rôles
```

### Mise à jour régulière

```
1. Review trimestrielle
   ↓
2. Mise à jour des niveaux/appétences
   ↓
3. Ajout de nouveaux items si besoin
   ↓
4. Ajustement des ownerships
   ↓
5. Export pour reporting
```

## 📊 Métriques Calculables

### Par Membre
- Nombre de skills maîtrisés (level ≥ 3)
- Nombre d'ownerships (Owner vs Contributor vs Backup)
- Appétence moyenne
- Progression dans le temps

### Par Item
- Nombre d'experts (level ≥ 3)
- Niveau moyen de l'équipe
- Appétence moyenne
- Couverture (% de membres ayant l'item)

### Par Matrice
- Compétences critiques (peu d'experts)
- Compétences redondantes (beaucoup d'experts)
- Gaps de compétences
- Distribution des ownerships

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14
