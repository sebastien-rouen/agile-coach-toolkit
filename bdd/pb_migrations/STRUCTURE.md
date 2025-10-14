# 📁 Structure des Migrations - Skills Matrix

## 📋 Vue d'Ensemble

Les migrations sont organisées en **fichiers séparés par collection** pour une meilleure maintenabilité et clarté.

## 🗂️ Organisation des Fichiers

### Création des Collections (1757700001-1757700005)

| Fichier | Collection | Description | Lignes |
|---------|-----------|-------------|--------|
| `1757700001_create_matrices.js` | `tools_skills_matrix_matrices` | Contexte des matrices | 91 |
| `1757700002_create_members.js` | `tools_skills_matrix_members` | Membres/personnes | 115 |
| `1757700003_create_items.js` | `tools_skills_matrix_items` | Skills + Ownerships | 114 |
| `1757700004_create_member_items.js` | `tools_skills_matrix_member_items` | Associations pivot | 140 |
| `1757700005_create_templates.js` | `tools_skills_matrix_templates` | Templates prédéfinis | 108 |

**Total : 5 fichiers, 568 lignes**

### Seed Data - Matrice Demo (1757700020-1757700023)

| Fichier | Collection | Données | Lignes |
|---------|-----------|---------|--------|
| `1757700020_seed_matrices.js` | `matrices` | 1 matrice "Équipe Demo" | 32 |
| `1757700021_seed_members.js` | `members` | 2 membres (Alice, Bob) | 47 |
| `1757700022_seed_items.js` | `items` | 4 items (2 skills + 2 ownerships) | 70 |
| `1757700023_seed_member_items.js` | `member_items` | 5 associations | 94 |

**Total : 4 fichiers, 243 lignes**

### Seed Data - Templates (1757700030-1757700031)

| Fichier | Templates | Lignes |
|---------|-----------|--------|
| `1757700030_seed_templates_part1.js` | Authentification, Tribu VALUE | 163 |
| `1757700031_seed_templates_part2.js` | E-commerce, Recherche, Paiement | 262 |

**Total : 2 fichiers, 425 lignes, 5 templates**

## 📊 Statistiques Globales

- **Total fichiers** : 11 migrations + 1 README
- **Total lignes de code** : 1236 lignes
- **Collections créées** : 5
- **Données de seed** : 1 matrice demo + 5 templates
- **Validation** : ✅ 100% réussie

## 🔢 Ordre d'Exécution

### Phase 1 : Création des Collections (001-005)

```
1757700001 → matrices
1757700002 → members (dépend de matrices)
1757700003 → items (dépend de matrices)
1757700004 → member_items (dépend de matrices, members, items)
1757700005 → templates (indépendant)
```

### Phase 2 : Seed Matrice Demo (020-023)

```
1757700020 → seed matrices
1757700021 → seed members (dépend de matrices)
1757700022 → seed items (dépend de matrices)
1757700023 → seed member_items (dépend de matrices, members, items)
```

### Phase 3 : Seed Templates (030-031)

```
1757700030 → seed templates part 1 (Authentification, Tribu VALUE)
1757700031 → seed templates part 2 (E-commerce, Recherche, Paiement)
```

## 🎯 Avantages de cette Organisation

### ✅ Maintenabilité
- Un fichier = une collection
- Modifications isolées
- Rollback granulaire

### ✅ Lisibilité
- Structure claire et logique
- Nommage explicite
- Documentation intégrée

### ✅ Testabilité
- Tests unitaires par collection
- Validation automatique
- Rollback testé

### ✅ Évolutivité
- Ajout facile de nouvelles collections
- Modification sans impact sur les autres
- Versioning simplifié

## 📝 Conventions de Nommage

### Format
```
{timestamp}_{action}_{collection}.js
```

### Exemples
```
1757700001_create_matrices.js
1757700020_seed_matrices.js
1757700030_seed_templates_part1.js
```

### Timestamps
- **001-005** : Création des collections
- **020-029** : Seed data matrice demo
- **030-039** : Seed data templates
- **040-049** : Réservé pour futures migrations

## 🔍 Détail des Collections

### 1. matrices (Contexte)
```javascript
{
  name: "Équipe Demo",
  company: "Ma Startup",
  description: "...",
  active: true
}
```

### 2. members (Membres)
```javascript
{
  matrix: "matrix_id",
  name: "Alice Martin",
  email: "alice@example.com",
  role: "Developer",
  avatar: null,
  active: true
}
```

### 3. items (Skills + Ownerships)
```javascript
// Skill
{
  matrix: "matrix_id",
  name: "JavaScript",
  type: "skill",
  category: "Tech",
  description: "...",
  active: true
}

// Ownership
{
  matrix: "matrix_id",
  name: "OKR Q1 2025",
  type: "ownership",
  category: "OKR",
  description: "...",
  active: true
}
```

### 4. member_items (Associations)
```javascript
// Pour un skill
{
  matrix: "matrix_id",
  member: "member_id",
  item: "skill_id",
  level: 3,
  appetite: 4,
  ownership_role: null,
  notes: "...",
  last_assessed: "2025-01-14"
}

// Pour un ownership
{
  matrix: "matrix_id",
  member: "member_id",
  item: "ownership_id",
  level: null,
  appetite: null,
  ownership_role: "Owner",
  notes: "...",
  last_assessed: null
}
```

### 5. templates (Templates)
```javascript
{
  name: "Authentification",
  description: "...",
  category: "Tech",
  icon: "🔐",
  data: {
    skills: [...],
    ownerships: [...],
    members: [...]
  },
  active: true
}
```

## 🔄 Workflow de Migration

### Ajout d'une Nouvelle Collection

1. **Créer le fichier de création**
   ```bash
   touch bdd/pb_migrations/1757700006_create_nouvelle_collection.js
   ```

2. **Créer le fichier de seed**
   ```bash
   touch bdd/pb_migrations/1757700024_seed_nouvelle_collection.js
   ```

3. **Valider**
   ```bash
   node bdd/validate-migrations.js
   ```

4. **Appliquer**
   ```bash
   pm2 restart pb-agile-drafts
   ```

### Modification d'une Collection Existante

1. **Créer une nouvelle migration**
   ```bash
   touch bdd/pb_migrations/1757700040_update_items_add_field.js
   ```

2. **Implémenter la modification**
   ```javascript
   migrate((app) => {
     const collection = app.findCollectionByNameOrId("tools_skills_matrix_items");
     collection.fields.push({
       name: "nouveau_champ",
       type: "text",
       required: false
     });
     return app.save(collection);
   }, (app) => {
     // Rollback
   });
   ```

3. **Valider et appliquer**

## 📚 Documentation Associée

- **`README.md`** : Documentation complète des migrations
- **`../ARCHITECTURE.md`** : Schéma de base de données
- **`../COMMANDS.md`** : Commandes PocketBase/PM2
- **`../WORKFLOW.md`** : Workflows d'utilisation

## ✅ Checklist de Validation

- [x] Tous les fichiers suivent la convention de nommage
- [x] Timestamps en ordre croissant
- [x] Chaque migration a une fonction de rollback
- [x] Référence `types.d.ts` présente
- [x] Documentation intégrée dans chaque fichier
- [x] Validation automatique réussie
- [x] Aucune erreur de syntaxe
- [x] Relations correctement définies
- [x] Index créés pour les performances

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14  
**Statut** : ✅ Prêt pour production
