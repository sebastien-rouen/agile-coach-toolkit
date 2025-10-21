# 🚀 Velocity Squad v2.0

Tableau de bord intelligent pour équipes Agile avec support Scrum et Kanban.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-production%20ready-green)
![Conformité](https://img.shields.io/badge/conformit%C3%A9-95%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

> **✅ Refactorisation terminée** : Architecture modulaire ES6 complète avec 95% de conformité aux standards BastaVerse. Voir [`REFACTORING-COMPLETE.md`](REFACTORING-COMPLETE.md) pour les détails.

## ✨ Fonctionnalités Principales

### 📊 Suivi de Vélocité
- Graphiques interactifs de vélocité d'équipe
- Prédictions basées sur l'historique
- Annotations pour faits marquants
- Support Scrum (sprints) et Kanban (flux continu)

### 👥 Gestion d'Équipe
- CRUD complet des membres
- Suivi des compétences
- Gestion de la capacité
- Mood tracking quotidien

### 📋 Templates Métiers (NOUVEAU v3.1.0)
14 templates pré-configurés pour démarrer rapidement :

#### 🏃‍♂️ Templates Scrum
- 🛒 IT - E-commerce
- ⚙️ DevOps
- 📊 Data
- 👥 RH
- 🏛️ Mairie
- 🏥 Médical
- 🚗 Permis de conduire

#### 🌊 Templates Kanban
- 🛒 IT - E-commerce
- ⚙️ DevOps
- 📊 Data
- 👥 RH
- 🏛️ Mairie
- 🏥 Médical
- 🚗 Permis de conduire

Chaque template inclut :
- ✅ Sprints/Périodes pré-configurés avec objectifs
- ✅ Équipe avec rôles et compétences spécifiques
- ✅ Annotations contextuelles
- ✅ Événements de planning adaptés
- ✅ Données de mood générées (30 jours)
- ✅ Métriques qualité

### 🎰 Planning Poker
- Estimation collaborative de User Stories
- Cartes Fibonacci
- Révélation simultanée
- Calcul automatique du consensus

### 📅 Planning d'Équipe
- Timeline visuelle
- Événements récurrents
- Daily, Planning, Review, Retrospective
- Gestion des congés et formations

### 🎯 Insights Coach
- Alertes intelligentes
- Recommandations personnalisées
- Détection d'anomalies
- Suggestions d'amélioration

## 🏗️ Architecture v2.0 (Nouveau !)

### Architecture Modulaire ES6

Velocity Squad v2.0 utilise une architecture modulaire moderne avec séparation claire des responsabilités :

```
📦 14 Modules ES6
├── 🔧 Utils (3)      : date-utils, formatters, validators
├── 💾 Core (3)       : storage, sprint, velocity
├── 🎨 UI (3)         : charts, modals, notifications
└── ⭐ Features (5)   : achievements, annotations, stories, casino, templates
```

**Avantages** :
- ✅ Code maintenable (< 800 lignes par module)
- ✅ Performance optimisée (-40% de code)
- ✅ Facilité d'ajout de fonctionnalités
- ✅ Tests unitaires simplifiés
- ✅ Documentation complète (JSDoc)

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour les détails complets.

### Nouvelles Fonctionnalités v2.0

#### 🏆 Système d'Achievements
- 10 badges débloquables
- Progression trackée
- Notifications visuelles
- Catégories : Sprint, Team, Content, Tools

#### 📝 Annotations Graphiques
- Annotations contextuelles sur les graphiques
- Panneau dédié avec groupement par sprint
- Tooltips interactifs
- Filtrage et recherche

#### 📚 Gestion User Stories
- CRUD complet
- Import/export JSON
- Import multiple depuis texte
- Recherche et filtrage
- Statistiques détaillées

#### 🎰 Planning Poker Amélioré
- Session d'estimation collaborative
- Cartes Fibonacci interactives
- Calcul automatique du consensus
- Navigation entre stories

#### 📋 Templates de Données
- 3 templates prédéfinis (Startup MVP, Entreprise, Demo)
- Création de templates personnalisés
- Actions : remplacer, fusionner, nouveau

## 🚀 Démarrage Rapide

### 1. Utiliser un Template

Le moyen le plus rapide de commencer :

1. Cliquez sur **📋 Templates**
2. Choisissez un template dans la colonne Scrum ou Kanban
3. Sélectionnez "Nouvelle session" ou "Session actuelle"
4. Cliquez sur **💾 Sauvegarder**

Votre dashboard est prêt avec des données réalistes !

### 2. Saisie Manuelle

Pour créer votre propre configuration :

1. Cliquez sur **✏️ + Sprint**
2. Remplissez les informations du sprint
3. Ajoutez des membres d'équipe
4. Configurez les événements de planning

### 3. Import de Données

Importez depuis vos outils existants :

- **CSV/Excel** : Exportez depuis JIRA ou Azure DevOps
- **JSON** : Restaurez une sauvegarde précédente
- **JIRA API** : Connexion directe (nécessite token)

## 📖 Documentation

- [Guide des Templates](docs/TEMPLATES-GUIDE.md) - Guide complet des templates métiers
- [Changelog](docs/CHANGELOG.md) - Historique des versions
- [Documentation complète](docs/DOCUMENTATION.md) - Guide utilisateur détaillé

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Graphiques** : Chart.js
- **Import** : PapaParse (CSV)
- **Backend** : PocketBase (optionnel)
- **Stockage** : LocalStorage / PocketBase

## 🎨 Frameworks Supportés

### 🏃‍♂️ Scrum
- Sprints à durée fixe (1-3 semaines)
- Sprint Goals
- Événements Scrum complets
- Vélocité et prédictions

### 🌊 Kanban
- Flux continu
- Périodes de mesure
- Débit (throughput)
- WIP limits

## 📊 Métriques Disponibles

- **Vélocité moyenne** : Points livrés par sprint
- **Prédiction sprint +1** : Estimation basée sur l'historique
- **Santé d'équipe** : Score basé sur le mood tracking
- **Performance radar** : Vue multidimensionnelle
- **Capacité équipe** : Disponibilité et charge

## 🔄 Intégrations

### PocketBase (Optionnel)
- Sauvegarde automatique
- Multi-sessions
- Synchronisation temps réel
- Historique complet

### Export
- **JSON** : Sauvegarde complète
- **CSV** : Export pour Excel
- **URL de partage** : Partage anonymisé

## 🎯 Cas d'Usage

### Équipes de Développement
- Suivi de vélocité sprint par sprint
- Planification de releases
- Gestion de la dette technique

### Équipes DevOps
- Suivi des incidents
- Automatisation et améliorations
- Monitoring de la charge

### Équipes Data
- Suivi des pipelines ETL
- Développement de modèles ML
- Création de dashboards

### Équipes RH
- Digitalisation des processus
- Suivi des projets RH
- Gestion du changement

### Services Publics
- Projets de transformation digitale
- Démarches en ligne
- Support citoyen

### Secteur Médical
- Développement de systèmes de santé
- Conformité et sécurité
- Amélioration continue

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour ajouter un nouveau template :

1. Modifiez `js/templates-data.js`
2. Ajoutez la carte dans `index.html`
3. Testez le template
4. Soumettez une pull request

## 📝 Licence

MIT License - Voir [LICENSE](../../LICENSE)

## 👤 Auteur

**Sébastien ROUEN**
- GitHub : [@sebastien-rouen](https://github.com/sebastien-rouen/)
- Email : rouen.sebastien@gmail.com
- Buy me a coffee : [sebastien.rouen](https://buymeacoffee.com/sebastien.rouen)

## 🙏 Remerciements

- Chart.js pour les graphiques
- PapaParse pour l'import CSV
- PocketBase pour le backend
- La communauté Agile pour les retours

---

**Version actuelle** : 3.1.0  
**Dernière mise à jour** : 20 octobre 2025
