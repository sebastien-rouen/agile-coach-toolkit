# 📊 Skills Matrix - Documentation Complète

## 🎯 Vue d'ensemble

Skills Matrix est un outil interactif de gestion des compétences d'équipe avec système de conseils automatisés intelligents. Il permet de visualiser, évaluer et développer les compétences avec des recommandations personnalisées en temps réel.

## ✨ Fonctionnalités Principales

### 1. Matrice de Compétences Interactive
- Évaluation en temps réel (0-4)
- Visualisation colorée
- Totaux automatiques
- Édition facile

### 2. Radar des Compétences
- Visualisation graphique
- Comparaison multi-membres
- Légende interactive
- Mise à jour en temps réel

### 3. Conseils Automatisés Coach Sticko
- Recommandations personnalisées par niveau
- Détection automatique de mentors
- Plans d'action contextuels
- Ressources adaptées

### 4. Appétences & Ownerships
- **Appétences** : Compétences souhaitées (aspirations)
- **Ownerships** : Expertises reconnues (responsabilités)
- Suggestions de mentors pour les appétences
- Affichage dans les conseils

### 5. Intégration PocketBase
- Stockage permanent des données
- Synchronisation automatique
- Fallback localStorage
- Architecture multi-matrices

## 🗄️ Architecture PocketBase

### Collections

#### `tools_skills_matrix_matrices`
Gestion des matrices (équipes/projets)
- `name` : Nom de la matrice
- `company` : Entreprise
- `description` : Description
- `active` : Statut

#### `tools_skills_matrix_members`
Membres de l'équipe
- `matrix` : Relation vers matrice
- `name` : Nom du membre
- `email` : Email
- `role` : Rôle
- `avatar` : Photo
- `active` : Statut

#### `tools_skills_matrix_items`
Items (skills, ownerships, appetences)
- `matrix` : Relation vers matrice
- `name` : Nom de l'item
- `type` : Type (skill, ownership, appetence)
- `category` : Catégorie
- `active` : Statut

#### `tools_skills_matrix_member_items`
Associations membre ↔ item
- `matrix` : Relation vers matrice
- `member` : Relation vers membre
- `item` : Relation vers item
- `level` : Niveau (0-4)
- `appetite` : Appétence (0-4)
- `ownership_role` : Rôle ownership
- `notes` : Commentaires

### Démarrage PocketBase

```bash
# Redémarrer PocketBase
pm2 restart pb-agile-drafts

# Voir les logs
pm2 logs pb-agile-drafts

# Accès admin
http://localhost:8XXX/_/
```

## 🚀 Utilisation

### Mode Démo vs Mode Édition

**Mode DÉMO** (sans ID dans l'URL)
- Affichage uniquement
- Pas de sauvegarde PocketBase
- localStorage uniquement
- Notification visible

**Mode ÉDITION** (avec `?matrix=ID`)
- Édition complète
- Sauvegarde PocketBase automatique
- Synchronisation en temps réel

### Sauvegarde

**Automatique** : Après chaque modification
- Sauvegarde uniquement ce qui a changé
- Optimisée pour les performances

**Manuelle** : Bouton "Sauvegarder" ou Ctrl+S
- Synchronisation complète
- Notification de succès/erreur

## 🎨 Personnalisation

### Thèmes
- **Thème sombre** : Par défaut
- **Thème clair** : Bouton 🌙/☀️ en haut à droite
- Sauvegarde automatique de la préférence

### Templates
Modèles prédéfinis pour différents domaines :
- Authentification, E-commerce, Recherche
- Santé, DevOps, SIRH, Éducation
- Chaque template inclut appétences et ownerships

## 📱 Responsive

### Desktop
- Barre de contrôles sticky
- Dropdown pour sélection membres
- Radar interactif

### Mobile
- Menu Actions sticky
- Modal plein écran pour sélection
- Radar optimisé (textes agrandis)

## 🔒 Sécurité

- Validation des entrées utilisateur
- Protection XSS
- Gestion d'erreurs robuste
- Logging centralisé Winston

## 📊 Export

- **JSON** : Export complet
- **XLSX** : Export Excel avec formatage
- Nom de fichier avec timestamp

## 🎯 Niveaux de Compétence

| Niveau | Badge | Description |
|--------|-------|-------------|
| 0 | ⚫ | Non évalué |
| 1 | 🟥 | Débutant |
| 2 | 🟧 | En apprentissage |
| 3 | 🟨 | Compétent |
| 4 | 🟩 | Expert |

## 🤝 Contribution

Créé avec ❤️ pour faciliter le développement des compétences en équipe.

**Coach Sticko** 🎯 - *Parce que chaque compétence compte !*
