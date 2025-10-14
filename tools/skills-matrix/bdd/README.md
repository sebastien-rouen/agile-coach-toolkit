# 🗄️ Base de Données PocketBase - Skills Matrix

## 📋 Vue d'ensemble

Ce répertoire contient les migrations PocketBase pour le Skills Matrix. Les migrations créent automatiquement la structure de base de données et un jeu de données de test.

## 🏗️ Structure

```
/bdd/
├── pb_migrations/              # Migrations versionnées
│   ├── 1757700001_create_skills_matrix_members.js
│   ├── 1757700002_create_skills_matrix_skills.js
│   ├── 1757700003_create_skills_matrix_member_skills.js
│   ├── 1757700010_seed_skills_matrix_members.js
│   ├── 1757700011_seed_skills_matrix_skills.js
│   └── 1757700012_seed_skills_matrix_member_skills.js
├── pb_data/                    # Données PocketBase (généré automatiquement)
│   ├── data.db                 # Base SQLite
│   ├── logs.db                 # Logs système
│   └── storage/                # Fichiers uploadés (avatars)
└── .gitignore                  # Fichiers à ignorer
```

## 🗂️ Tables Créées

### 1. skills_matrix_members

Membres de l'équipe avec leurs informations.

**Champs** :

- `id` : Identifiant unique auto-généré
- `name` : Nom du membre (requis)
- `email` : Email du membre
- `role` : Rôle (Developer, PO, SM...)
- `avatar` : Photo de profil (max 2MB)
- `active` : Statut actif/inactif
- `created` / `updated` : Dates automatiques

### 2. skills_matrix_skills

Compétences disponibles dans l'organisation.

**Champs** :

- `id` : Identifiant unique auto-généré
- `name` : Nom de la compétence (requis, unique)
- `category` : Catégorie (Tech, Soft Skills, Domain, Agile, DevOps...)
- `description` : Description détaillée
- `active` : Statut actif/inactif
- `created` / `updated` : Dates automatiques

### 3. skills_matrix_member_skills

Table pivot associant membres et compétences avec niveaux.

**Champs** :

- `id` : Identifiant unique auto-généré
- `member` : Relation vers skills_matrix_members (requis)
- `skill` : Relation vers skills_matrix_skills (requis)
- `level` : Niveau 0-4 (requis)
- `notes` : Commentaire libre
- `last_assessed` : Date de dernière évaluation
- `created` / `updated` : Dates automatiques

**Contrainte** : Un membre ne peut avoir qu'une seule évaluation par compétence (index unique sur member + skill)

## 🚀 Démarrage

### Appliquer les Migrations

Les migrations sont appliquées automatiquement au démarrage de PocketBase :

```bash
# Redémarrer PocketBase pour appliquer les migrations
pm2 restart pb-agile-drafts

# Voir les logs d'application
pm2 logs pb-agile-drafts
```

### Accès Admin

```bash
# Interface admin PocketBase
http://localhost:8XXX/_/

# Identifiants par défaut (à configurer au premier lancement)
# Email: admin@example.com
# Password: (à définir)
```

## 📊 Jeu de Données de Test

### 5 Membres

1. **Alice Martin** (Developer) - Junior

   - JavaScript (3), React (2), Node.js (2), Git (3), Communication (3)

2. **Bob Dupont** (Tech Lead) - Senior Expert

   - JavaScript (4), React (4), Node.js (4), Docker (3), Git (4), Leadership (4), TDD (3)

3. **Claire Rousseau** (Product Owner) - Expert Scrum

   - JavaScript (1), Scrum (4), Communication (4), Leadership (3)

4. **David Leroy** (Scrum Master) - Coach Agile

   - Scrum (4), Communication (4), Leadership (4), Git (2)

5. **Emma Bernard** (Developer) - Intermédiaire
   - JavaScript (3), React (3), Node.js (2), Docker (2), Git (3), TDD (3), CI/CD (2)

### 10 Compétences

- **Tech** : JavaScript, React, Node.js, Git, TDD
- **DevOps** : Docker, CI/CD
- **Agile** : Scrum
- **Soft Skills** : Communication, Leadership

### Niveaux

- **0** : Non évalué
- **1** : Débutant (formation nécessaire)
- **2** : En apprentissage (support régulier)
- **3** : Compétent (support occasionnel)
- **4** : Expert (autonomie complète)

## 🔄 Gestion des Migrations

### Ordre d'Exécution

1. **Créations** (001-003) : Tables créées en respectant les dépendances
2. **Seeds** (010-012) : Données insérées après création des tables

### Rollback

Chaque migration inclut une fonction de rollback (down) :

```javascript
migrate(
  (app) => {
    // Migration (up)
  },
  (app) => {
    // Rollback (down)
  }
);
```

### Ajouter une Nouvelle Migration

```bash
# Créer un nouveau fichier avec timestamp croissant
# Format : {timestamp}_{action}_{table}.js

# Exemple
1757700020_add_field_bio_to_members.js
```

## 🛠️ Maintenance

### Backup de la Base

```bash
# Copier la base de données
cp bdd/pb_data/data.db bdd/pb_data/data.db.backup-$(date +%s)
```

### Réinitialiser la Base

```bash
# Supprimer les données (les migrations seront réappliquées)
rm -rf bdd/pb_data/
pm2 restart pb-agile-drafts
```

### Vérifier les Tables

```bash
# Accéder à l'admin PocketBase
# Collections → Voir les 3 tables créées
# Records → Vérifier les données de test
```

## 📖 Références

- **Documentation PocketBase** : https://pocketbase.io/docs/
- **Migrations JS** : https://pocketbase.io/docs/js-migrations/
- **Collections** : https://pocketbase.io/docs/collections/
- **Pattern de reproduction** : Voir `POCKETBASE-PATTERN.md` à la racine de l'outil

---

**Version** : 3.0.0  
**Dernière mise à jour** : 2025-01-14
