# 📊 Skills Matrix - Matrice de Compétences avec Conseils Automatisés

## 🎯 Vue d'ensemble

Outil interactif de gestion des compétences d'équipe avec système de **conseils automatisés intelligents** style **Coach Sticko**. Visualisez, évaluez et développez les compétences de votre équipe avec des recommandations personnalisées en temps réel.

## ✨ Fonctionnalités Principales

### 📈 Matrice de Compétences Interactive
- **Évaluation en temps réel** : Système de notation de 0 à 4 pour chaque compétence
- **Visualisation colorée** : Codes couleur intuitifs pour identifier rapidement les niveaux
- **Totaux par compétence** : Calcul instantané des scores par compétence (v3.2.0)
- **Édition facile** : Modification des noms et niveaux en un clic
- **Suppression de compétences** : Dialogue Modifier/Supprimer avec confirmation (v3.2.0)

### 📊 Graphique en Bâtons (v3.2.0)
- **Visualisation claire** : Graphique en barres groupées pour meilleure lisibilité
- **Comparaison facile** : Barres côte à côte par compétence
- **Valeurs affichées** : Niveaux visibles au-dessus de chaque barre
- **Multi-membres** : Affichage simultané de plusieurs membres avec couleurs distinctes
- **Grille de référence** : Lignes horizontales pour les niveaux 0-4
- **Responsive** : Adaptation automatique mobile/desktop

### 📥📤 Import/Export Amélioré (v3.2.0)
- **Import JSON** : Chargement de données depuis fichier JSON
- **Import Excel** : Chargement depuis fichiers .xlsx/.xls
- **Export JSON** : Sauvegarde complète des données
- **Export Excel stylé** : Fichier professionnel avec couleurs dark cohérentes
  - En-têtes colorés (violet, bleu, rose)
  - Niveaux avec couleurs (vert, jaune, orange, rouge, gris)
  - Ligne de totaux stylée
  - Colonnes Appétences et Ownerships incluses

### ⏳ Loader Élégant (v3.3.0)
- **Feedback visuel** : Affichage d'un loader animé lors des actions de contrôle
- **Messages contextuels** : Texte dynamique selon l'action (export, import, sauvegarde)
- **Détection automatique** : Adaptation desktop/mobile avec `showLoader()` et `hideLoader()`
- **Animations fluides** : Transitions CSS avec fade-in, pulse et rotation du spinner
- **Prévention des clics** : Blocage des interactions pendant le traitement
- **Notifications améliorées** : Support des types (success, error, info, warning) avec couleurs distinctes
- **Prompt d'import** : Message temporaire après import demandant si l'utilisateur souhaite sauvegarder
  - Auto-disparition après 10 secondes
  - Choix "Sauvegarder" ou "Plus tard"
  - Design cohérent avec le thème

### 💡 Conseils Automatisés Coach Sticko

#### Système Intelligent de Recommandations
Le système analyse automatiquement les niveaux de compétence et génère des conseils personnalisés pour chaque membre :

**🌱 Niveau 1 - Débutant**
- Messages encourageants et bienveillants
- Ressources pour démarrer en douceur
- Identification automatique de mentors potentiels
- Plans d'action simples et réalisables

**🚀 Niveau 2 - En Apprentissage**
- Conseils pour progresser vers l'autonomie
- Exercices pratiques adaptés
- Suggestions de projets fil rouge
- Encouragement au pair programming

#### Messages Stylisés (v3.3.1)
- **Design élégant** : Fond semi-transparent avec bordure cyan et effet hover
- **Formatage riche** : Support de `<strong>`, `<em>` et `<code>` avec couleurs distinctes
- **Interactivité** : Animation fluide au survol
- **Thème adaptatif** : Couleurs optimisées pour dark et light mode

#### Conseils Adaptés aux Rôles (v3.3.2)
- **Personnalisation intelligente** : Messages et plans d'action adaptés selon appétences et ownerships
- **Priorisation** : Ownership > Appétence > Standard
- **Objectifs ajustés** : Délais de progression selon le contexte (2-4 mois)
- **Messages contextuels** : 3 variantes par niveau pour chaque situation

**⭐ Niveau 3 - Compétent**
- Invitation à devenir mentor
- Suggestions de partage de connaissances
- Exploration de cas d'usage avancés
- Opportunités d'animation d'ateliers

**🏆 Niveau 4 - Expert**
- Reconnaissance de l'expertise
- Suggestions d'innovation
- Opportunités de coaching
- Contribution à la documentation d'équipe

#### Fonctionnalités des Conseils

**📚 Ressources Recommandées**
- Tutoriels vidéo adaptés au niveau
- Documentation et guides pratiques
- Identification de mentors dans l'équipe
- Exercices et projets pratiques
- Communautés et groupes d'étude

**🎯 Plans d'Action Personnalisés**
- Actions concrètes et réalisables
- Suggestions de timing
- Objectifs mesurables
- Encouragement à la pratique

**🔍 Filtrage Intelligent**
- Filtrer par niveau (Débutants, En apprentissage, Compétents)
- Affichage priorisé (débutants en premier)
- Mise à jour automatique en temps réel

**👥 Détection de Mentors**
- Identification automatique des experts (niveau 3-4)
- Suggestions de binômes mentor/mentoré
- Encouragement au pair programming

## 🎨 Modèles Prédéfinis

### Domaines Techniques
- **🔐 Authentification** : OAuth, JWT, 2FA, RBAC
- **🛒 E-commerce** : Panier, Stock, Paiement, Livraison
- **🔍 Recherche** : Elasticsearch, Indexation, Filtres
- **💳 Paiement** : Stripe, PayPal, 3D Secure, PCI DSS

### Domaines Métiers
- **🏥 Santé** : Dossier patient, RDV, Prescriptions, HL7/FHIR
- **🚀 DevOps** : Docker, Kubernetes, CI/CD, Terraform
- **👥 SIRH** : Gestion employés, Paie, Congés, Formation
- **🎓 Éducation** : ENT, Moodle, Évaluations, Vie scolaire

## 🚀 Utilisation

### Démarrage Rapide

1. **Charger un modèle** : Sélectionnez un modèle prédéfini dans le menu déroulant
2. **Évaluer les compétences** : Utilisez les sélecteurs (0-4) pour chaque membre/compétence
3. **Consulter les conseils** : Les recommandations s'affichent automatiquement
4. **Filtrer les conseils** : Utilisez les boutons de filtre pour cibler un niveau
5. **Interagir avec les ressources** : Cliquez sur les ressources pour des notifications contextuelles

### Gestion des Données

**➕ Ajouter**
- Nouveau membre : Bouton "Ajouter Membre"
- Nouvelle compétence : Bouton "Ajouter Compétence"

**✏️ Modifier**
- Cliquez sur un nom de membre ou de compétence pour le renommer
- Utilisez les sélecteurs pour changer les niveaux

**🗑️ Supprimer**
- Bouton de suppression (🗑️) à droite de chaque ligne membre

**💾 Sauvegarder**
- Sauvegarde automatique dans le navigateur (localStorage)
- Export JSON : Bouton "Exporter JSON"
- Export CSV : Bouton "Exporter CSV"

## 🎯 Niveaux de Compétence

| Niveau | Badge | Description | Autonomie |
|--------|-------|-------------|-----------|
| **0** | ⚫ | Non évalué | - |
| **1** | 🟥 | Débutant | Formation nécessaire |
| **2** | 🟧 | En apprentissage | Support régulier requis |
| **3** | 🟨 | Compétent | Support occasionnel |
| **4** | 🟩 | Expert | Travail en autonomie |

## 💡 Philosophie Coach Sticko

### Principes de Base
- **Bienveillance** : Messages encourageants et positifs
- **Personnalisation** : Conseils adaptés au niveau et au contexte
- **Actionnable** : Plans d'action concrets et réalisables
- **Collaboratif** : Encouragement au mentoring et pair programming
- **Progressif** : Accompagnement étape par étape

### Ton et Style
- **Humain** : Langage simple et accessible
- **Motivant** : Célébration des progrès
- **Pratique** : Focus sur l'action et l'expérimentation
- **Inclusif** : Tout le monde peut progresser

## 🗄️ Base de Données PocketBase

### Architecture des Tables

Le Skills Matrix utilise **3 tables PocketBase** avec préfixe `skills_matrix_` ::

#### 📋 Table `skills_matrix_members` (Membres de l'équipe)
```
- id (auto)              : Identifiant unique
- name (text, required)  : Nom du membre
- email (email)          : Email du membre
- role (text)            : Rôle (Developer, PO, SM...)
- avatar (file)          : Photo de profil (max 2MB)
- active (bool)          : Statut actif/inactif
- created/updated (auto) : Dates de gestion
```

#### 🎯 Table `skills_matrix_skills` (Compétences disponibles)
```
- id (auto)                : Identifiant unique
- name (text, required)    : Nom de la compétence (unique)
- category (select)        : Catégorie (Tech, Soft Skills, Domain, Agile, DevOps...)
- description (text)       : Description détaillée
- active (bool)            : Statut actif/inactif
- created/updated (auto)   : Dates de gestion
```

#### 🔗 Table `skills_matrix_member_skills` (Lien membre ↔ compétence)
```
- id (auto)                     : Identifiant unique
- member (relation, required)   : Relation vers skills_matrix_members
- skill (relation, required)    : Relation vers skills_matrix_skills
- level (number, 0-4, required) : Niveau de compétence
- notes (text)                  : Commentaire libre
- last_assessed (date)          : Date de dernière évaluation
- created/updated (auto)        : Dates de gestion
```

### Relations
```
skills_matrix_members (1) ──→ (N) skills_matrix_member_skills (N) ←── (1) skills_matrix_skills
```

### Migrations PocketBase

Les migrations sont situées dans `bdd/pb_migrations/` :

1. **1757700001_create_members.js** - Création table members
2. **1757700002_create_skills.js** - Création table skills
3. **1757700003_create_member_skills.js** - Création table pivot member_skills
4. **1757700010_seed_members.js** - Jeu de données membres (5 membres)
5. **1757700011_seed_skills.js** - Jeu de données compétences (10 compétences)
6. **1757700012_seed_member_skills.js** - Associations membres/compétences

### Démarrage PocketBase

```bash
# Redémarrer PocketBase pour appliquer les migrations
pm2 restart pb-agile-drafts

# Voir les logs
pm2 logs pb-agile-drafts

# Accès admin PocketBase
http://localhost:8XXX/_/
```

### Jeu de Données de Test

**5 Membres** :
- Alice Martin (Developer) - Junior
- Bob Dupont (Tech Lead) - Senior expert
- Claire Rousseau (Product Owner) - Expert Scrum
- David Leroy (Scrum Master) - Coach agile
- Emma Bernard (Developer) - Intermédiaire

**10 Compétences** :
- Tech : JavaScript, React, Node.js, Git, TDD
- DevOps : Docker, CI/CD
- Agile : Scrum
- Soft Skills : Communication, Leadership

**Niveaux** : 0=Non évalué, 1=Débutant, 2=En apprentissage, 3=Compétent, 4=Expert

### Convention de Préfixage

**Règle** : Toutes les tables d'un outil doivent être préfixées par `{outil}_`

**Exemples** :
- Skills Matrix : `skills_matrix_members`, `skills_matrix_skills`, `skills_matrix_member_skills`
- Planning Poker : `planning_poker_sessions`, `planning_poker_votes`
- Ikigai : `ikigai_profiles`, `ikigai_elements`

**Avantages** :
- ✅ Évite les conflits de noms entre outils
- ✅ Facilite l'identification des tables par outil
- ✅ Permet la cohabitation de plusieurs outils dans la même base
- ✅ Simplifie la maintenance et les migrations

### Reproduction pour Autres Outils

Pour créer la même structure dans un autre outil `/tools/{nom-outil}/` :

1. **Créer le dossier** : `bdd/pb_migrations/`

2. **Créer les migrations de création** (timestamp croissant) :
   ```
   1757700001_create_{table1}.js
   1757700002_create_{table2}.js
   1757700003_create_{table3}.js
   ```

3. **Créer les migrations de seed** (timestamp +10) :
   ```
   1757700010_seed_{table1}.js
   1757700011_seed_{table2}.js
   1757700012_seed_{table3}.js
   ```

4. **Respecter le préfixage** : `{outil}_{table}`

5. **Documenter dans README.md** : Section "Base de Données PocketBase"

6. **Tester** : Redémarrer PocketBase et vérifier les tables

## 🔧 Fonctionnalités Techniques

### Mise à Jour en Temps Réel
- Synchronisation automatique entre matrice, radar et conseils
- Recalcul instantané des totaux
- Régénération des recommandations à chaque modification

### Persistance des Données
- **Backend PocketBase** : Stockage permanent des données (prioritaire)
- **Fallback localStorage** : Sauvegarde locale automatique si PocketBase indisponible
- **Synchronisation automatique** : Toutes les 5 minutes avec PocketBase
- **Gestionnaire centralisé** : `pocketbase-manager.js` réutilisable par tous les outils
- Chargement automatique au démarrage
- Export/Import JSON et CSV

### Responsive Design
- Adaptation mobile et desktop
- Grilles flexibles
- Scrolling optimisé

## 📊 Cas d'Usage

### Pour les Managers
- Identifier les besoins en formation
- Planifier les montées en compétence
- Optimiser les binômes mentor/mentoré
- Suivre la progression de l'équipe

### Pour les Équipes
- Auto-évaluation collaborative
- Identification des experts internes
- Planification du pair programming
- Partage de connaissances

### Pour les Individus
- Visualiser ses forces et axes d'amélioration
- Recevoir des conseils personnalisés
- Trouver des mentors
- Suivre sa progression

## 🎨 Personnalisation

### Adapter les Conseils
Modifiez la base de connaissances `adviceDatabase` dans le code pour :
- Personnaliser les messages
- Ajouter des ressources spécifiques à votre contexte
- Adapter les plans d'action à votre organisation

### Créer des Modèles
Ajoutez vos propres modèles dans l'objet `templates` :
```javascript
myTemplate: {
    name: "Mon Domaine",
    skills: ["Compétence 1", "Compétence 2", ...],
    members: [
        { name: "Membre 1", levels: [2, 3, 1, ...] },
        ...
    ]
}
```

## 🚀 Évolutions Futures

- [ ] Historique de progression dans le temps
- [ ] Notifications de rappel pour les plans d'action
- [ ] Intégration avec systèmes RH
- [ ] Suggestions de formations externes
- [ ] Gamification avec badges et récompenses
- [ ] Export PDF avec graphiques
- [ ] Mode collaboratif temps réel

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentation complète consolidée
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions et modifications

## 📝 Licence

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Créé avec ❤️ pour faciliter le développement des compétences en équipe.

---

**Coach Sticko** 🎯 - *Parce que chaque compétence compte !*
