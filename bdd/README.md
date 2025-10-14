# 🗄️ Base de Données PocketBase - Agile Tools

## 📋 Vue d'ensemble

Ce répertoire contient les migrations PocketBase pour tous les outils Agile. Les migrations créent automatiquement la structure de base de données et un jeu de données de test.

## 🏗️ Structure

```
bdd/
├── pb_migrations/              # Migrations versionnées
│   ├── 1757700001_create_skills_matrix_members.js
│   ├── 1757700002_create_skills_matrix_skills.js
│   ├── 1757700003_create_skills_matrix_member_skills.js
│   ├── 1757700004_create_skills_matrix_templates.js
│   ├── 1757700010_seed_skills_matrix_members.js
│   ├── 1757700011_seed_skills_matrix_skills.js
│   ├── 1757700012_seed_skills_matrix_member_skills.js
│   └── 1757700013_seed_skills_matrix_templates.js
├── pb_data/                    # Données PocketBase (généré automatiquement)
│   ├── data.db                 # Base SQLite
│   ├── logs.db                 # Logs système
│   └── storage/                # Fichiers uploadés (avatars)
├── RESET-DATABASE.md           # Guide de réinitialisation
├── DIAGNOSTIC.md               # Guide de diagnostic
└── README.md                   # Ce fichier
```

## 🗂️ Tables Créées - Skills Matrix (4 tables)

### 1. skills_matrix_members
Membres de l'équipe avec leurs informations.

**Champs** :
- `id` : Identifiant unique auto-généré
- `name` : Nom du membre (requis)
- `email` : Email du membre
- `role` : Rôle (Développeur, PO, SM, DevOps...)
- `avatar` : Photo de profil (max 2MB)
- `appetences` : Compétences souhaitées (JSON array)
- `ownerships` : Expertises reconnues (JSON array)
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

### 4. skills_matrix_templates
Modèles prédéfinis de matrices de compétences.

**Champs** :
- `id` : Identifiant unique auto-généré
- `name` : Nom du template (requis, unique)
- `description` : Description du template
- `category` : Catégorie (Tech, Business, Domain, Agile, DevOps...)
- `icon` : Icône emoji du template
- `skills` : Liste des compétences (JSON array)
- `members` : Données des membres avec niveaux, appétences et ownerships (JSON array)
- `active` : Statut actif/inactif
- `created` / `updated` : Dates automatiques

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
http://localhost:8090/_/

# Identifiants par défaut (à configurer au premier lancement)
# Email: admin@example.com
# Password: (à définir)
```

## 📊 Jeu de Données de Test - Skills Matrix

### 5 Membres (avec appétences et ownerships)
1. **Alice Martin** (Développeur) - Junior
   - Compétences : JavaScript (3), React (2), Node.js (2), Git (3), Communication (3)
   - Appétences : TypeScript, Vue.js, Architecture Microservices
   - Ownerships : -

2. **Bob Dupont** (DevOps) - Senior Expert
   - Compétences : JavaScript (4), React (4), Node.js (4), Docker (3), Git (4), Leadership (4), TDD (3)
   - Appétences : Kubernetes, Service Mesh
   - Ownerships : Architecture DevOps, CI/CD, Docker

3. **Claire Rousseau** (Product Owner) - Expert Scrum
   - Compétences : JavaScript (1), Scrum (4), Communication (4), Leadership (3)
   - Appétences : Data Analytics, UX Design
   - Ownerships : Vision Produit, Roadmap, Scrum

4. **David Leroy** (Scrum Master) - Coach Agile
   - Compétences : Scrum (4), Communication (4), Leadership (4), Git (2)
   - Appétences : Coaching Agile, Facilitation Graphique
   - Ownerships : Scrum, Facilitation, Coaching d'équipe

5. **Emma Bernard** (Développeur) - Intermédiaire
   - Compétences : JavaScript (3), React (3), Node.js (2), Docker (2), Git (3), TDD (3), CI/CD (2)
   - Appétences : GraphQL, WebAssembly
   - Ownerships : TDD, Clean Code

### 10 Compétences
- **Tech** : JavaScript, React, Node.js, Git, TDD
- **DevOps** : Docker, CI/CD
- **Agile** : Scrum
- **Soft Skills** : Communication, Leadership

### 5 Templates Prédéfinis
1. **🔐 Authentification** : OAuth 2.0, JWT, 2FA/MFA, RBAC, SSO
2. **🛒 E-commerce** : Gestion Panier, Stock, Paiement, Livraison, CRM
3. **🚀 DevOps** : Docker, Kubernetes, CI/CD, Terraform, Monitoring
4. **🎯 Scrum** : Framework, Facilitation, Coaching, Retrospectives, Planning
5. **💻 Développement Web** : JavaScript, React, Node.js, TypeScript, API REST

### Niveaux
- **0** : Non évalué
- **1** : Débutant (formation nécessaire)
- **2** : En apprentissage (support régulier)
- **3** : Compétent (support occasionnel)
- **4** : Expert (autonomie complète)

## 🔄 Gestion des Migrations

### Ordre d'Exécution
1. **Créations** (001-004) : Tables créées en respectant les dépendances
2. **Seeds** (010-013) : Données insérées après création des tables

### Rollback
Chaque migration inclut une fonction de rollback (down) :

```javascript
migrate((app) => {
  // Migration (up)
}, (app) => {
  // Rollback (down)
});
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
pm2 stop pb-agile-drafts
rm -rf bdd/pb_data/data.db bdd/pb_data/logs.db
pm2 start pb-agile-drafts
```

Voir `RESET-DATABASE.md` pour plus de détails.

### Vérifier les Tables
```bash
# Accéder à l'admin PocketBase
# Collections → Voir les 4 tables créées
# Records → Vérifier les données de test
```

## 📖 Références

- **Documentation PocketBase** : https://pocketbase.io/docs/
- **Migrations JS** : https://pocketbase.io/docs/js-migrations/
- **Collections** : https://pocketbase.io/docs/collections/
- **Guide Skills Matrix** : `../tools/skills-matrix/bdd/README.md`

---

**Version** : 3.0.0  
**Dernière mise à jour** : 2025-01-14
