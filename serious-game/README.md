# 🏥 Hospital Flow Master - Serious Game Kanban

## Vue d'ensemble

**Hospital Flow Master** est un serious game éducatif qui simule la gestion d'un service hospitalier en utilisant les principes Kanban. Les joueurs doivent optimiser le flux de patients tout en gérant les urgences, les contraintes de capacité et la satisfaction des patients.

## 🎯 Objectifs pédagogiques

### Principes Kanban enseignés
- **Visualisation du flux** : Tableau Kanban avec 5 colonnes de traitement
- **Limites WIP** : Gestion des capacités par colonne
- **Classes de service** : Priorisation selon l'urgence médicale
- **Amélioration continue** : Analyse des métriques et optimisation
- **Gestion des contraintes** : Identification et résolution des goulots d'étranglement

### Compétences développées
- Prise de décision sous pression
- Gestion des priorités multiples
- Optimisation des processus
- Analyse de métriques en temps réel
- Gestion du stress et de la charge de travail

## 🎮 Fonctionnalités du jeu

### Modes de jeu
- **⚡ Session rapide** (3 minutes) : Découverte des bases
- **🎯 Session standard** (5 minutes) : Équilibre apprentissage/pratique
- **🏆 Session longue** (10 minutes) : Maîtrise complète
- **📚 Tutoriel guidé** (2 minutes) : Apprentissage pas à pas

### Système de patients
- **4 classes de service** :
  - 🚨 **Critique** (expedite) : Urgences vitales (AVC, infarctus)
  - ⚡ **Urgent** : Douleurs thoraciques, difficultés respiratoires
  - 📋 **Standard** : Consultations, contrôles, bilans
  - 📅 **Programmé** : Chirurgies, examens pré-opératoires avec horaires

### Parcours de soins
1. **🚪 Triage** : Évaluation initiale (WIP: 5)
2. **👩‍⚕️ Consultation** : Examen médical (WIP: 4)
3. **🔬 Examens** : Tests complémentaires (WIP: 3)
4. **💊 Traitement** : Soins et médicaments (WIP: 6)
5. **🏠 Sortie** : Finalisation (WIP: ∞)

### Zones spéciales
- **🪑 Salle d'attente** : Parking pour patients en attente de triage
- **🚨 Couloir d'urgence** : Voie rapide pour urgences et critiques

## 🌡️ Système de stress et pression

### Mécanismes de stress
- **Temps d'attente critique** selon la priorité :
  - Critique : 15 min max
  - Urgent : 45 min max
  - Standard : 2h max
  - Programmé : 1h30 max

### Conséquences du stress
- **Disparition de patients** mécontents
- **Pénalités de score** importantes
- **Notifications d'urgence** colorées
- **Indicateur de stress** en temps réel

### Notifications centrales
- 🟢 **Faible** : Avertissements légers
- 🟡 **Moyen** : Patients qui s'impatientent
- 🟠 **Élevé** : Patients mécontents
- 🔴 **Critique** : Patients qui partent !

## 📊 Métriques et évaluation

### Métriques en temps réel
- **⏱️ Lead Time moyen** : Temps total de prise en charge
- **🚀 Throughput** : Patients traités par jour
- **🚨 Urgences en attente** : Nombre d'urgences non traitées
- **😊 Satisfaction moyenne** : Niveau de satisfaction global
- **🌡️ Niveau de stress** : Pression du service (0-100%)

### Système de notation
- **Note finale** : A+ à F selon les performances
- **Score en points** : Système de récompenses/pénalités
- **Achievements** : Déblocage de succès spéciaux

### Résultats détaillés
- Patients traités vs perdus
- Analyse des temps d'attente
- Leçons Kanban personnalisées
- Conseils d'amélioration

## 🎨 Interface et expérience

### Design hospitalier
- **Thème médical** cohérent
- **Couleurs par priorité** intuitives
- **Animations Theme Hospital** pour les arrivées
- **Feedback visuel** immédiat

### Accessibilité
- **Contraste élevé** pour la lisibilité
- **Icônes descriptives** pour chaque action
- **Navigation clavier** supportée
- **Responsive design** mobile/desktop

## 🛠️ Architecture technique

### Technologies utilisées
- **HTML5/CSS3/JavaScript** vanilla (ES6+)
- **Architecture modulaire** par système
- **Pas de framework** : Performance optimale
- **Progressive enhancement** : Fonctionne sans JS

### Modules principaux
- `game-engine.js` : Moteur principal et coordination
- `patient-generator.js` : Génération réaliste de patients
- `kanban-board.js` : Gestion du tableau et drag & drop
- `flow-metrics.js` : Calcul des métriques en temps réel
- `event-system.js` : Événements et notifications

### Système de données
- **Patients simulés** avec pathologies réalistes
- **Temps de traitement** variables par étape
- **Satisfaction dynamique** selon l'attente
- **Historique complet** des parcours

## 🎓 Utilisation pédagogique

### Pour les formateurs
- **Outil d'introduction** aux concepts Kanban
- **Simulation sécurisée** sans impact réel
- **Débriefing structuré** avec métriques
- **Apprentissage par l'expérience** immersif

### Pour les équipes
- **Team building** autour de l'agilité
- **Compréhension commune** des enjeux
- **Identification des anti-patterns** courants
- **Sensibilisation** à la gestion de flux

### Scénarios d'usage
- **Formations Kanban** : Introduction pratique
- **Workshops agiles** : Mise en situation
- **Rétrospectives** : Illustration des concepts
- **Onboarding** : Découverte ludique

## 🚀 Installation et déploiement

### Prérequis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation serveur requise

### Déploiement
1. Cloner le repository
2. Ouvrir `serious-game/kanban-flow/index.html`
3. Ou déployer sur hébergement statique (GitHub Pages, Netlify)

### Configuration
- Aucune configuration requise
- Fonctionne immédiatement
- Données stockées localement (localStorage)

## 📈 Évolutions futures

### Fonctionnalités prévues
- **Mode multijoueur** : Collaboration en équipe
- **Scénarios personnalisés** : Création de cas d'usage
- **Statistiques avancées** : Analyse comparative
- **Intégration LMS** : Suivi pédagogique

### Améliorations techniques
- **Sauvegarde cloud** : Synchronisation des scores
- **Analytics** : Métriques d'usage anonymisées
- **Personnalisation** : Thèmes et paramètres
- **Accessibilité renforcée** : Support lecteurs d'écran

## 📄 Licence et contribution

### Licence
MIT License - Utilisation libre pour l'éducation et la formation

### Contribution
- Issues et suggestions bienvenues
- Pull requests acceptées
- Documentation à maintenir
- Tests à ajouter

---

**Hospital Flow Master** - Apprendre Kanban en gérant un service hospitalier ! 🏥⚡