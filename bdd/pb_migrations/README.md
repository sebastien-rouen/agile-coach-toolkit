# Migrations PocketBase - Skills Matrix

## 📋 Vue d'ensemble

Ce répertoire contient les migrations PocketBase pour l'outil **Skills Matrix** avec une architecture optimisée en 5 tables.

## 🗂️ Structure des Collections

### 1. `tools_skills_matrix_matrices`
Contexte de chaque matrice (équipe, projet, organisation)

**Champs :**
- `name` (text, required) - Nom de la matrice
- `company` (text, optional) - Entreprise/Organisation
- `description` (text, optional) - Description
- `active` (bool) - Statut actif/inactif

### 2. `tools_skills_matrix_members`
Les personnes/membres de l'équipe

**Champs :**
- `matrix` (relation → matrices) - Matrice parente
- `name` (text, required) - Nom du membre
- `email` (email, optional) - Email
- `role` (text, optional) - Rôle/Poste
- `avatar` (file, optional) - Photo de profil
- `active` (bool) - Statut actif/inactif

**Index :** Unicité sur (matrix, email)

### 3. `tools_skills_matrix_items`
Skills ET Ownerships fusionnés (type discriminant)

**Champs :**
- `matrix` (relation → matrices) - Matrice parente
- `name` (text, required) - Nom de l'item
- `type` (select: "skill" | "ownership") - Type d'item
- `category` (text, optional) - Catégorie (Tech, Soft Skills, OKR, etc.)
- `description` (text, optional) - Description
- `active` (bool) - Statut actif/inactif

**Index :** Unicité sur (matrix, type, name)

### 4. `tools_skills_matrix_member_items`
Associations membres ↔ items (pivot table)

**Champs :**
- `matrix` (relation → matrices) - Matrice parente
- `member` (relation → members) - Membre
- `item` (relation → items) - Item (skill ou ownership)
- `level` (number, 0-4) - Niveau de compétence (pour skills)
- `appetite` (number, 0-4) - Appétence (pour skills)
- `ownership_role` (select: "Owner" | "Contributor" | "Backup") - Rôle (pour ownerships)
- `notes` (text, optional) - Notes libres
- `last_assessed` (date, optional) - Date dernière évaluation

**Index :** Unicité sur (matrix, member, item)

### 5. `tools_skills_matrix_templates`
Templates prédéfinis pour créer rapidement des matrices

**Champs :**
- `name` (text, required) - Nom du template
- `description` (text, optional) - Description
- `category` (text, optional) - Catégorie (Tech, Agile, Business)
- `icon` (text, optional) - Emoji/Icône
- `data` (json, required) - Structure complète du template
- `active` (bool) - Statut actif/inactif

**Index :** Unicité sur (name)

**Règles d'accès :** Public en lecture, authentifié pour création/modification

## 📦 Fichiers de Migration

### Ordre d'exécution

1. **`1757700001_create_skills_matrix_collections.js`**
   - Création des 4 collections principales
   - Matrices, Members, Items, Member_Items

2. **`1757700002_create_templates_collection.js`**
   - Création de la collection Templates

3. **`1757700010_seed_demo_matrix.js`**
   - Seed data de démonstration
   - 1 matrice "Équipe Demo"
   - 2 membres (Alice, Bob)
   - 4 items (2 skills + 2 ownerships)
   - 5 associations

4. **`1757700011_seed_templates_part1.js`**
   - Templates : Authentification, Tribu VALUE

5. **`1757700012_seed_templates_part2.js`**
   - Templates : E-commerce, Recherche, Paiement

## 🚀 Utilisation

### Appliquer les migrations

```bash
# Redémarrer PocketBase (applique automatiquement les migrations)
pm2 restart pb-agile-drafts

# Vérifier les logs
pm2 logs pb-agile-drafts
```

### Accès admin PocketBase

```bash
# Drafts
http://localhost:8090/_/

# Production
http://localhost:8091/_/
```

## 💡 Exemples de Requêtes

### Récupérer uniquement les skills

```javascript
const skills = await pb.collection('tools_skills_matrix_items').getFullList({
  filter: `matrix="${matrixId}" && type="skill"`,
  sort: 'category,name'
});
```

### Récupérer uniquement les ownerships

```javascript
const ownerships = await pb.collection('tools_skills_matrix_items').getFullList({
  filter: `matrix="${matrixId}" && type="ownership"`,
  sort: 'category,name'
});
```

### Skills d'un membre (avec niveau + appétence)

```javascript
const memberSkills = await pb.collection('tools_skills_matrix_member_items').getFullList({
  filter: `matrix="${matrixId}" && member="${memberId}" && item.type="skill"`,
  expand: 'item'
});
```

### Ownerships d'un membre (avec rôle)

```javascript
const memberOwnerships = await pb.collection('tools_skills_matrix_member_items').getFullList({
  filter: `matrix="${matrixId}" && member="${memberId}" && item.type="ownership"`,
  expand: 'item'
});
```

### Charger un template

```javascript
const template = await pb.collection('tools_skills_matrix_templates').getFirstListItem(
  `name="Authentification"`
);

// Utiliser template.data pour créer une nouvelle matrice
```

## ✅ Avantages de cette Architecture

- **Simplicité** : Une seule table pour skills + ownerships
- **Flexibilité** : Ajout facile de nouveaux types (certification, tool, etc.)
- **Maintenabilité** : Moins de jointures à gérer
- **Performance** : Index optimisés pour les requêtes fréquentes
- **Templates** : Création rapide de matrices prédéfinies

## ⚠️ Notes Importantes

### Champs conditionnels

Dans `member_items`, certains champs sont spécifiques au type :

- **Pour les skills** : `level` et `appetite` sont utilisés
- **Pour les ownerships** : `ownership_role` est utilisé

Gérer côté frontend :

```javascript
if (item.type === 'skill') {
  // Afficher level + appetite
} else if (item.type === 'ownership') {
  // Afficher ownership_role
}
```

### Cascade Delete

Toutes les relations utilisent `cascadeDelete: true` :
- Supprimer une matrice → supprime membres, items, associations
- Supprimer un membre → supprime ses associations
- Supprimer un item → supprime ses associations

## 📚 Templates Disponibles

1. **🔐 Authentification** (Tech)
   - 6 skills sécurité
   - 2 ownerships stratégiques
   - 3 membres exemples

2. **🎯 Tribu VALUE** (Agile)
   - 17 skills coaching/agile
   - 2 ownerships leadership
   - 14 membres (coaches agiles)

3. **🛒 Panier e-commerce** (Business)
   - 6 skills e-commerce
   - 3 ownerships produit/tech
   - 3 membres exemples

4. **🔍 Recherche** (Tech)
   - 6 skills search/indexation
   - 2 ownerships expertise
   - 3 membres exemples

5. **💳 Paiement** (Business)
   - 6 skills paiement/compliance
   - 3 ownerships conformité
   - 3 membres exemples

## 🔄 Rollback

Chaque migration inclut une fonction de rollback. Pour annuler :

```bash
# Supprimer le fichier de migration problématique
rm bdd/pb_migrations/1757700012_seed_templates_part2.js

# Redémarrer PocketBase
pm2 restart pb-agile-drafts
```

## 📝 Conventions

- **Nommage** : `{timestamp}_{action}_{description}.js`
- **Timestamps** : Format Unix (1757700001, 1757700002, etc.)
- **Actions** : create, seed, update, delete
- **Rollback** : Toujours implémenter la fonction de rollback

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14
