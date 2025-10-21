# Changelog - Team Velocity Dashboard

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [3.5.1] - 2025-10-20

### 🔧 Amélioration : Édition Sprint Unifiée

#### Fonctionnalités
- **Modal unifiée** : Clic sur "✏️ Modifier" (Sprint Goal) ou "capacity-item" ouvre la même modal
- **Sprint Goal intégré** : Champ Sprint Goal ajouté dans la modal d'édition du sprint
- **Édition complète** : Nom, Goal, dates de début/fin dans une seule interface
- **Expérience cohérente** : Plus besoin de modals séparées pour le goal
- **Affichage date amélioré** : Date de début affichée en format lisible (ex: "lun. 15 septembre 2025")

#### 🎯 Bénéfices
- Interface simplifiée et plus intuitive
- Moins de clics pour modifier un sprint
- Toutes les informations du sprint au même endroit
- Cohérence avec le workflow Scrum
- Dates lisibles et compréhensibles

#### 🎨 Améliorations Visuelles
- **Bouton "✏️ Modifier"** : Style cohérent avec les autres boutons d'action (gradient bleu)
- **Section Sprint Goal** : Effet hover sur la section et le contenu
- **Transitions fluides** : Animations douces sur les interactions
- **Modal Humeur** : Date affichée en format lisible (même style que modal Sprint)
  - Input date invisible en overlay
  - Span visible avec fond bleu clair
  - Mise à jour automatique lors du changement de date

#### 🐛 Corrections
- **Date de début** : Affichage correct et visuel amélioré
  - Input date invisible en overlay pour sélection
  - Span visible avec fond bleu clair et bordure
  - Effet hover sur le span
  - Mise à jour avec délai après ouverture de la modal
- **Bouton Casino** : Fonctionne maintenant en un seul clic
  - Ajout de vérifications des éléments DOM
  - Logs de débogage pour tracer les changements de vue
  - Correction de la logique de toggle
  - Protection contre les appels multiples rapides (debounce)
  - Valeur par défaut 'chart' si currentView est undefined
- **Bouton "Modifier" Sprint Goal** : Ouvre maintenant le sprint le plus récent
  - Tri systématique des sprints par date de fin
  - Tri au chargement depuis localStorage
  - Log du sprint édité dans la console
- **Affichage Sprint Goal** : Affiche maintenant le sprint le plus récent
  - Tri des sprints avant affichage
  - Log du sprint affiché dans la console
  - Sélection correcte du dernier sprint
- **Toggle Casino** : Protection contre les appels multiples
  - Valeur par défaut pour currentView
  - Debounce de 300ms entre les toggles
  - Logs améliorés pour débogage
- **Mise à jour dynamique** : L'affichage se met à jour lors du changement de date

## [3.5.0] - 2025-10-20

### ✨ Nouveau : Footer Agile avec Valeurs et Principes

#### Fonctionnalités
- **Footer dynamique** : Affichage des valeurs et principes selon le mode
- **Valeurs du Manifeste Agile** : Les 4 valeurs fondamentales (toujours visibles)
- **Modern Agile** : Les 4 principes modernes de l'agilité (toujours visibles)
- **12 Principes Agile** : Les 12 principes du Manifeste en format compact (toujours visibles)
- **Piliers Scrum** : Transparence, Inspection, Adaptation + 5 valeurs Scrum
- **Principes Kanban** : 6 principes + 6 pratiques essentielles
- **Affichage conditionnel** : Scrum ou Kanban selon le mode sélectionné

#### 🎨 Design
- Fond sombre avec dégradé élégant
- Icônes emoji pour chaque valeur/principe
- Effets hover avec translation
- Badges colorés pour les valeurs et pratiques
- Responsive sur mobile et tablette

#### 🔧 Architecture
- **Fichier partial** : `partials/footer.html` (séparation du contenu)
- **CSS dédié** : `css/footer.css` (styles isolés)
- **Loader JavaScript** : `js/footer-loader.js` (chargement dynamique)
- **Mise à jour automatique** : Changement de mode Scrum/Kanban

#### 📚 Contenu Éducatif
- Liens vers Manifeste Agile et Scrum Guide
- Descriptions courtes et claires
- Rappel des fondamentaux pour l'équipe

### 🎓 Amélioration : Insights Coach Enrichis

#### Nouveaux Insights
- **Surmenage détecté** : Alerte si vélocité +50% au-dessus de la moyenne
- **Taille d'équipe** : Recommandations si < 3 ou > 9 membres
- **Diversité de compétences** : Suggestion de formations croisées
- **Actions concrètes** : Chaque insight propose une action à mener

#### Insights Améliorés
- Ajout de suggestions d'actions pour chaque alerte
- Messages plus contextuels et actionnables
- Meilleure détection des patterns d'équipe

### 📝 Enrichissement : Templates Métiers

#### Plus de Faits Marquants
- **7 annotations par template** (au lieu de 3)
- Diversité des types : incidents, formations, congés, releases, équipe
- Répartition sur tous les sprints
- Scénarios réalistes par domaine métier

#### Templates Enrichis
- IT E-commerce : 7 faits (bugs, arrivées, formations, releases)
- DevOps : 7 faits (incidents, migrations, formations)
- Data : 7 faits (qualité données, promotions, API beta)
- RH : 7 faits (RGPD, bugs, recrutements)
- Mairie : 7 faits (accessibilité, SSL, promotions)
- Médical : 7 faits (certifications, bugs, téléconsultation)
- Permis : 7 faits (arrivées, bugs, releases mobile)

## [3.4.1] - 2025-10-20

### 🔄 Amélioration : Ordre d'Affichage des Sprints

#### Changement
- **Ordre chronologique inversé** : Les sprints s'affichent maintenant du plus ancien (gauche) au plus récent (droite)
- **Lecture naturelle** : Progression temporelle de gauche à droite
- **Cohérence** : Toutes les vues (Vélocité, Burndown, Burnup) utilisent le même ordre

#### 🔧 Modifications Techniques
- Inversion de l'ordre des sprints dans `renderChart()`
- Ajustement des index dans les tooltips (3 vues)
- Correction du plugin d'annotations pour l'affichage des icônes
- Mise à jour de `getAnnotationAtPosition()` pour la détection au clic/hover

#### Impact
- Les annotations restent correctement positionnées
- Les tooltips affichent les bonnes informations
- Les interactions (hover, clic) fonctionnent correctement
- Aucun impact sur les données sauvegardées

## [3.4.0] - 2025-10-20

### ✨ Nouveau : Vues Multiples Scrum Complètes

#### Fonctionnalités
- **3 vues de graphiques Scrum** :
  - 📊 **Vélocité** : Vue classique avec barres et tendance
  - 📉 **Burndown Chart** : Travail restant avec ligne idéale
  - 📈 **Burnup Chart** : Travail complété vs scope total avec progression

#### 📊 Burndown Chart
- Affichage du travail restant au fil des sprints
- Ligne idéale de descente linéaire
- Points de données avec bordure blanche
- Tooltip avec points restants
- Annotations de faits marquants préservées

#### 📈 Burnup Chart
- Travail complété cumulatif (ligne verte)
- Scope total avec variations (ligne bleue)
- Calcul automatique de la progression en %
- Simulation d'ajouts de scope en cours de route
- Tooltip enrichi avec pourcentage de progression

#### 🎨 Interface Utilisateur
- Sélecteur de vue avec 3 boutons emoji
- Bouton actif avec gradient bleu
- Effet hover avec translation
- Tooltips informatifs sur chaque bouton
- Sauvegarde automatique de la vue sélectionnée
- Restauration de la vue au rechargement

#### 🔧 Modifications Techniques
- Nouvelle propriété `settings.chartView` : 'velocity' | 'burndown' | 'burnup'
- Méthode `changeChartView(view)` : Gestion du changement de vue
- Méthode `restoreChartView()` : Restauration de la vue sauvegardée
- Méthode `renderBurndownChart()` : Rendu du burndown
- Méthode `renderBurnupChart()` : Rendu du burnup
- Titre dynamique selon la vue sélectionnée
- Annotations préservées sur toutes les vues

#### 🎨 Améliorations CSS
- Tooltips avec `::after` sur les boutons
- Animation de translation au hover
- Gradient bleu pour le bouton actif
- Fond gris clair pour le sélecteur

## [3.3.0] - 2025-10-20

### ✨ Nouveau : Amélioration du Mood Tracking

#### Fonctionnalités
- **Pré-sélection du mood existant** : Le bouton mood est automatiquement sélectionné si un mood existe déjà
  - Détection automatique du mood pour le membre et la date sélectionnés
  - Chargement du commentaire existant
  - Mise à jour au lieu de création de doublon
  - Événements sur changement de membre ou de date

#### 🔧 Modifications Techniques
- Nouvelle fonction `loadExistingMood()` : Charge le mood existant
- Modification de `saveMoodEntry()` : Détecte et met à jour le mood existant
- Événements `onchange` sur le select membre et la date
- Appel à `updateMoodInPocketBase()` pour les mises à jour

### 🎨 Amélioration : Stylisation des Boutons

#### Changements Visuels
- **Boutons uniformisés** : "➕ Ajouter Événement" et "➕ Ajouter Membre"
  - Même style que "📝 Fait marquant"
  - Gradient bleu (#2196F3 → #1976D2)
  - Effet hover avec translation et ombre
  - Cohérence visuelle dans toute l'interface

## [3.2.0] - 2025-10-20

### ✨ Nouveau : Radar de Compétences par Membre

#### Fonctionnalités
- **Radar de compétences** : Affichage des skills de chaque membre
  - Une étoile de couleur par membre (10 couleurs disponibles)
  - Toutes les compétences uniques de l'équipe sur le radar
  - Valeur 100 si le membre possède la compétence, 0 sinon
  - Légende interactive avec nom des membres
  - Tooltip amélioré : "✓ Compétence" ou "✗ Compétence"

#### 🎨 Améliorations Visuelles
- Palette de 10 couleurs distinctes pour les membres
- Labels de compétences en gras
- Légende en bas avec points circulaires
- Grille semi-transparente
- Valeurs 0-100 masquées (focus sur les compétences)

#### 🔧 Modifications Techniques
- Fonction `renderRadarChart()` complètement réécrite
- Collecte automatique de toutes les compétences uniques
- Génération dynamique d'un dataset par membre
- Gestion des équipes sans compétences définies
- Titre changé : "🎯 Compétences Équipe"

## [3.1.2] - 2025-10-20

### 🐛 Corrigé : Gestion d'Erreurs lors de la Suppression

#### Problème Résolu
- **Erreurs 400 et DELETE échoués** : Amélioration de la robustesse de `clearCurrentSessionData()`
  - Gestion d'erreurs individuelles pour chaque suppression
  - Ordre de suppression respectant les dépendances (moods → annotations → événements → membres → sprints)
  - Continue même si certaines suppressions échouent
  - Logs détaillés pour chaque étape

#### 🔧 Modifications Techniques
- Fonction helper `deleteCollection()` avec try/catch individuel
- Suppression dans l'ordre inverse des dépendances
- Compteur de suppressions réussies vs totales
- Messages d'avertissement au lieu d'erreurs bloquantes

## [3.1.1] - 2025-10-20

### 🐛 Corrigé : Sauvegarde PocketBase des Templates

#### Problème Résolu
- **Sauvegarde PocketBase** : Les templates n'étaient pas sauvegardés dans PocketBase
  - Ajout de la sauvegarde explicite dans `loadTemplateData()`
  - Sauvegarde séquentielle de tous les sprints, membres, annotations, moods et événements
  - Méthode maintenant asynchrone (`async/await`)
  - Logs de confirmation de sauvegarde détaillés

- **Suppression des anciennes données** : Lors du choix "Session actuelle"
  - Nouvelle fonction `clearCurrentSessionData()` dans pocketbase-integration.js
  - Suppression de tous les sprints, membres, annotations, moods et événements existants
  - Évite les doublons et conflits d'IDs
  - Logs de progression de la suppression

#### 🔧 Modifications Techniques
- Méthode `loadTemplateData()` devient asynchrone
- Méthode `confirmTemplateLoad()` gère la suppression avant chargement
- Boucles `for...of` pour sauvegarder chaque élément dans PocketBase
- Vérification correcte : `typeof saveSprintToPocketBase !== 'undefined' && usePocketBase`
- Logs de debug détaillés pour tracer chaque étape
- Fallback sur localStorage si PocketBase non disponible

#### 📁 Nouveaux Fichiers
- Fonction `clearCurrentSessionData()` dans `js/pocketbase-integration.js`

## [3.1.0] - 2025-10-20

### ✨ Nouveau : Templates Métiers Scrum/Kanban

#### 🎯 Fonctionnalités
- **Templates organisés par framework** : 
  - Colonne Scrum avec 7 templates métiers
  - Colonne Kanban avec 7 templates métiers
  - Interface à deux colonnes pour une navigation claire

- **Templates métiers disponibles** :
  - 🛒 **IT - E-commerce** : Développement plateforme e-commerce
  - ⚙️ **DevOps** : Infrastructure et automatisation
  - 📊 **Data** : Analytics et data engineering
  - 👥 **RH** : Digitalisation processus RH
  - 🏛️ **Mairie** : Services publics numériques
  - 🏥 **Médical** : Système de gestion hospitalière
  - 🚗 **Permis de conduire** : Plateforme d'apprentissage

- **Système de confirmation** :
  - Modal de confirmation avant chargement du template
  - Option de sauvegarder dans la session actuelle
  - Option de créer une nouvelle session
  - Affichage du nombre de sprints actuels

- **Données complètes par template** :
  - Sprints pré-configurés avec objectifs métier
  - Équipe avec rôles et compétences spécifiques
  - Annotations contextuelles
  - Événements de planning adaptés
  - Métriques qualité

#### 📁 Nouveaux Fichiers
- `js/templates-data.js` : Définition de tous les templates métiers (14 templates)
- Mise à jour de `index.html` : Nouvelle structure de modal avec colonnes
- Mise à jour de `css/styles.css` : Styles pour les colonnes et la confirmation

#### 🔧 Améliorations Techniques
- Méthode `openTemplateConfirmation()` : Gestion de la sélection de template
- Méthode `confirmTemplateLoad()` : Validation et chargement du template
- Méthode `loadTemplateData()` : Chargement unifié des données de template
- Détection automatique de session existante
- Gestion des IDs uniques pour éviter les conflits

## [3.0.0] - 2025-10-20

### 🎉 Refonte Majeure - Team Manager

#### 🐛 Corrigé
- **IDs PocketBase** : Correction complète de la gestion des IDs
  - Remplacement des attributs `onclick` par des `data-attributes` + event delegation
  - Fix de l'erreur "Uncaught ReferenceError: [id] is not defined"
  - Fix de l'erreur "Uncaught SyntaxError: Unexpected end of input"
  - Compatible avec les IDs numériques (localStorage) et alphanumériques (PocketBase)
  - Meilleure pratique : séparation HTML/JavaScript

- **Édition de membre** : Correction du formulaire d'édition
  - Pré-remplissage correct des champs lors de l'édition
  - Mise à jour effective dans PocketBase avec `updateTeamMemberInPocketBase()`
  - Conservation du `pbId` pour les mises à jour
  - Logs de debug pour faciliter le diagnostic

- **Mood unique par jour** : Gestion correcte d'un seul mood par membre et par jour
  - Détection du mood existant avant création
  - Mise à jour du mood existant au lieu de créer un doublon
  - Nouvelle fonction `updateMoodInPocketBase()` pour les mises à jour
  - Stockage du `pbId` lors de la création pour permettre les mises à jour
  - Affichage correct du mood actuel dans l'interface

#### ✨ Nouveau : Gestion CRUD des Membres
- **Remplacement** : La "Heatmap Burnout" est remplacée par une interface moderne de gestion d'équipe
- **CRUD complet** : Création, lecture, modification et suppression des membres
- **Mood intégré** : Sélecteur de mood (😊 😐 😞) directement sur chaque ligne de membre
- **Interface intuitive** : Toutes les actions sur une seule ligne par membre
- **Modal d'édition** : Formulaire en modal pour ajout et modification
- **Autocomplétion des compétences** : 
  - Suggestions basées sur les compétences existantes de l'équipe
  - Compteur d'occurrences pour chaque compétence
  - Navigation au clavier (↑↓ Enter Escape)
  - Mise en surbrillance de la correspondance
  - Insertion intelligente avec gestion des virgules

#### 📁 Réorganisation des Fichiers
- **Nouveau dossier `js/`** : Tous les scripts JavaScript
  - `js/script.js` : Script principal
  - `js/team-manager.js` : Nouveau gestionnaire d'équipe
  - `js/pocketbase-integration.js` : Intégration PocketBase
- **Nouveau dossier `css/`** : Tous les styles
  - `css/styles.css` : Styles principaux
  - `css/team-manager.css` : Styles de la section équipe
- **Nouveau dossier `docs/`** : Documentation
  - `docs/README.md` : Documentation principale
  - `docs/CHANGELOG.md` : Ce fichier
  - `docs/TEAM-MANAGER.md` : Documentation du Team Manager

#### 🎨 Interface Utilisateur
- **Ligne de membre** : Affichage compact avec 4 colonnes
  - Informations (nom, rôle, compétences)
  - Sélecteur de mood (3 boutons)
  - Capacité en %
  - Actions (éditer, supprimer)
- **Boutons de mood** : Enregistrement instantané en un clic
- **Formulaire** : Apparition/disparition fluide avec animation
- **Responsive** : Adaptation automatique aux petits écrans

#### 🔧 Technique
- **Classe TeamManager** : Nouvelle classe dédiée à la gestion d'équipe
- **Séparation des responsabilités** : Code modulaire et maintenable
- **Compatibilité** : Les données de mood existantes restent compatibles
- **Performance** : Rendu optimisé sans calculs complexes

#### 🗑️ Supprimé
- **Heatmap Burnout** : Section remplacée par Team Manager
- **Fonction `renderBurnoutHeatmap()`** : Supprimée du script principal
- **Styles heatmap** : Remplacés par les styles team-manager

#### 📚 Documentation
- **TEAM-MANAGER.md** : Guide complet du nouveau système
- **Architecture** : Documentation de la structure des fichiers
- **API** : Documentation des méthodes JavaScript
- **Exemples** : Cas d'utilisation pratiques

### 💾 Compatibilité
- ✅ **Données mood** : 100% compatibles avec l'ancien système
- ✅ **PocketBase** : Même structure de collections
- ✅ **LocalStorage** : Pas de migration nécessaire

## [2.6.0] - 2025-01-20

### 🐛 Corrigé
- **Mood Tracking** : Correction du bug "current_user" dans PocketBase
  - Le champ `member` contient maintenant l'ID réel du membre (nombre)
  - Ajout du champ `memberName` pour stocker le nom du membre
  - Sélection du membre obligatoire dans la modal "😊 Humeur du Jour"
  - Génération de données de template utilise les vrais IDs et noms des membres
- **Heatmap Burnout** : Correction du mapping des données
  - Correction de `parseInt()` qui tronquait les IDs PocketBase alphanumériques
  - Matching flexible par ID (string/number) OU nom (compatibilité anciennes données)
  - Logs de debug pour faciliter le diagnostic
  - Les nouveaux moods enregistrent maintenant l'ID complet du membre

### ✨ Ajouté
- **Sélection de membre** : Dropdown pour choisir le membre lors de l'enregistrement de l'humeur
- **Sélection de date** : Champ date avec la date du jour par défaut
  - Permet d'enregistrer l'humeur pour une date passée
  - Validation obligatoire de la date
  - Style moderne avec icône calendrier
- **Heatmap Burnout améliorée** : 
  - Cellules grisées quand aucune donnée n'est disponible
  - Calcul du burnout basé sur les données réelles de mood
  - Tooltip indiquant le nombre d'entrées par semaine
  - Numéros de semaine ISO réels (plus de simulation)

### 🎨 Amélioré
- **Validation** : Impossible de sauvegarder un mood sans sélectionner un membre
- **Feedback** : Notification avec le nom du membre après sauvegarde
- **Cohérence** : Les données de mood influencent maintenant réellement le burnout affiché
- **Style Modal Mood** :
  - Select membre avec style moderne et effet hover
  - Textarea commentaire avec fond grisé et transition smooth
  - Placeholder descriptif avec exemples de commentaires
  - Effets focus avec bordure bleue et shadow
  - Bouton "Enregistrer" avec icône 💾

### 🗄️ Base de données
- **Migration** : Mise à jour de `1757600104_create_velocity_squad_mood.js`
  - Ajout du champ `memberName` directement dans la migration initiale

## [2.5.0] - 2025-01-20

### ✨ Ajouté
- **Timeline améliorée** : Améliorations visuelles de la timeline des événements
  - Week-ends grisés pour meilleure lisibilité
  - Nombre de semaines calculé selon la durée du premier sprint
  - Vue timeline compacte avec boutons colorés par type d'événement
  - Bouton 📊 pour basculer entre vue détaillée et vue compacte
  - Événements affichés comme des badges colorés cliquables

### 🎨 Amélioré
- **Interface planning** : Nouvelle vue compacte pour visualiser rapidement tous les événements
- **Week-ends** : Distinction visuelle des week-ends dans la timeline (grisés, opacité réduite)
- **Durée adaptative** : Timeline s'adapte à la durée du premier sprint

## [2.4.0] - 2025-01-19

### ✨ Ajouté
- **Récurrence personnalisable des événements** : Système complet de récurrence
  - **Type de récurrence** :
    - 📅 Chaque jour (daily)
    - 📆 Chaque semaine (weekly) avec sélection des jours
    - 🗓️ Chaque mois (monthly)
  - **Sélecteur de jours** : Interface visuelle avec boutons circulaires
    - Lun, Mar, Mer, Jeu, Ven, Sam, Dim
    - Multi-sélection pour les événements hebdomadaires
    - Indication visuelle des jours sélectionnés (bleu)
  - **Date de fin** : Option pour limiter la récurrence dans le temps
  - **Affichage intelligent** : Label descriptif de la récurrence dans la liste
    - "🔄 Chaque jour"
    - "🔄 Chaque Lun, Mer, Ven"
    - "🔄 Chaque mois"
  - **Intégration PocketBase** : Sauvegarde complète des paramètres de récurrence
    - Champs : recurrence_type, recurrence_days, recurrence_end_date
    - Migration : `1757700402_add_recurrence_fields.js`

### 🎨 Amélioré
- **Interface de récurrence** : Options masquées par défaut, affichées au clic sur "Événement récurrent"
- **Édition d'événements** : Pré-remplissage automatique des options de récurrence
- **Validation** : Affichage conditionnel du sélecteur de jours (uniquement pour weekly)

### 🔧 Technique
- Ajout de 3 nouveaux champs dans la collection events
- Gestion des événements de changement pour afficher/masquer les options
- Fonction `getRecurrenceLabel()` pour générer les labels descriptifs
- Stockage des jours sous forme de tableau JSON dans PocketBase

## [2.3.3] - 2025-01-19

### 🎨 Amélioré
- **Notification démo conditionnelle** : Badge "Mode Démo" caché si session valide
  - Affichage uniquement en mode local sans session
  - Disparaît automatiquement lors du chargement d'une session PocketBase
  - Meilleure indication du mode de fonctionnement

### 🐛 Corrigé
- **Accès PocketBase aux événements** : Erreur 403 "Only superusers can perform this action"
  - Création de la migration `1757700401_public_access_velocity_squad.js`
  - Configuration des règles d'accès public pour toutes les collections Velocity Squad
  - Permet la lecture, création, modification et suppression sans authentification
  - Alignement avec le fonctionnement de Skills Matrix

### 🔧 Technique
- Migration SQL directe pour modifier les règles d'accès
- Pattern LIKE 'tools_velocity_squad_%' pour toutes les collections
- Rollback disponible pour restaurer l'authentification si nécessaire

## [2.3.2] - 2025-01-19

### 🎨 Amélioré
- **Configuration Équipe stylisée** : Interface repensée pour l'ajout de membres
  - Labels clairs pour chaque champ
  - Aide contextuelle sous les champs (compétences, capacité)
  - Boutons "Sauvegarder" et "Annuler" avec icônes
  - Formulaire avec bordure en pointillés et fond gris clair
  - Cartes de membres avec badges de compétences colorés
  - Effet hover sur les cartes de membres
- **Visibilité conditionnelle** : Masquage intelligent des éléments vides
  - Bouton "Modifier Sprint Goal" caché s'il n'y a pas de sprints
  - Section Sprint Goal cachée s'il n'y a pas de sprints
  - Radar Chart remplacé par un message si pas de membres d'équipe
  - Meilleure expérience utilisateur pour les sessions vides

### 🐛 Corrigé
- **Sauvegarde PocketBase des événements** : Implémentation complète de l'intégration
  - Ajout de `saveEventToPocketBase()` pour créer des événements
  - Ajout de `updateEventInPocketBase()` pour modifier des événements
  - Ajout de `deleteEventFromPocketBase()` pour supprimer des événements
  - Chargement automatique des événements depuis PocketBase
  - Conversion correcte des données événements (PocketBase ↔ App)
  - Ajout de la collection 'events' dans la configuration PocketBase

### 🔧 Technique
- Ajout du bouton "Annuler" dans le formulaire d'ajout de membre
- Réinitialisation automatique du formulaire à l'annulation
- Gestion du canvas du radar chart pour éviter les erreurs

## [2.3.1] - 2025-01-19

### 🎨 Amélioré
- **Interface événements simplifiée** : Clic direct sur l'événement pour modifier
  - Suppression des boutons ✏️ et 🗑️ sur chaque événement
  - Clic sur l'événement ouvre la modal d'édition
  - Bouton "Supprimer" dans la modal avec confirmation
  - Changement de couleur au survol pour indiquer la cliquabilité
  - Interface plus épurée et intuitive

### 🐛 Corrigé
- **Liste déroulante vide** : Correction du remplissage de la liste "Type d'événement" en mode édition
  - Génération dynamique des options selon le framework (Scrum/Kanban)
  - Pré-sélection du type d'événement actuel
  - Affichage correct des icônes et labels

## [2.3.0] - 2025-01-19

### ✨ Ajouté
- **Timeline visuelle** : Graphique de 3 semaines affichant les événements
  - Grille de 21 jours avec vue d'ensemble
  - Indicateurs visuels par jour (aucun, 1 événement, plusieurs)
  - Badge compteur pour les jours avec plusieurs événements
  - Mise en évidence du jour actuel avec bordure verte
  - Légende explicative avec codes couleur
  - Clic sur un jour pour voir le détail des événements
  - Modal contextuelle avec liste des événements du jour
  - Affichage des semaines avec plages de dates
- **Édition d'événements** : Modification complète des événements existants
  - Bouton ✏️ sur chaque événement
  - Pré-remplissage du formulaire avec les données existantes
  - Sauvegarde des modifications
  - Changement dynamique du titre de la modal (Ajouter/Modifier)

### 🎨 Amélioré
- **Taille des événements** : Réduction de 25% de la taille des cartes d'événements
  - Padding réduit (1rem → 0.75rem)
  - Marges réduites entre les éléments
  - Tailles de police optimisées (0.9rem → 0.85rem)
  - Border-left plus fine (4px → 3px)
  - Meilleure densité d'information
- **Actions événements** : Ajout de l'icône d'édition à côté de la suppression
  - Bouton ✏️ avec style primaire
  - Bouton 🗑️ avec style danger
  - Tooltips sur les boutons d'action
  - Espacement réduit entre les boutons (0.5rem → 0.25rem)

### 🔧 Technique
- **Fonction renderPlanningTimeline()** : Génération de la timeline avec calcul automatique
- **Fonction showDayEvents()** : Affichage modal des événements d'un jour spécifique
- **Fonction editEvent()** : Gestion de l'édition d'événements
- **Amélioration addPlanningEvent()** : Support du mode édition et ajout

## [2.2.0] - 2025-01-19

### ✨ Ajouté
- **Slider date de fin** : Interface intuitive avec slider pour ajuster la durée du sprint (1-30 jours)
  - Affichage en temps réel de la date de fin calculée
  - Labels dynamiques indiquant le nombre de jours
  - Gradient de couleur sur le slider (vert → orange → rouge)
  - Datepicker de début cliquable directement sur la date
- **Section Planning** : Nouvelle section dédiée à la visualisation des événements
  - Affichage des événements Scrum : Daily, Sprint Planning, Backlog Refinement, Sprint Review, Sprint Retrospective
  - Affichage des événements Kanban : Daily, Backlog Refinement, Retrospective
  - Icônes et couleurs par type d'événement
  - Informations complètes : date, heure, durée, description
  - Badge "Récurrent" pour les événements répétitifs
  - Bouton de suppression par événement
- **Modal ajout événement** : Interface complète pour créer des événements de planning
  - Types d'événements adaptés au framework (Scrum/Kanban)
  - Champs : titre, date, heure, durée, description
  - Option "Événement récurrent"
  - Validation des données
- **Templates enrichis** : Mise à jour complète des 3 templates avec données réalistes
  - Dates de début et fin pour chaque sprint
  - Sprint Goals détaillés et pertinents
  - Événements de planning pré-configurés
  - Événements récurrents (Daily Standup)
  - Descriptions complètes pour les événements clés

### 🎨 Amélioré
- **Modal édition sprint** : Interface repensée avec slider intuitif
  - Calcul automatique de la date de fin depuis la date de début
  - Affichage formaté de la date de fin (jour, date, mois, année)
  - Meilleure expérience utilisateur pour ajuster les durées
- **Templates Startup** : 6 sprints d'une semaine avec objectifs clairs et événements Scrum
- **Templates Enterprise** : 7 sprints de 2 semaines avec objectifs ambitieux et événements détaillés
- **Templates Maintenance** : 6 semaines en mode Kanban avec objectifs de maintenance et événements adaptés

### 🐛 Corrigé
- **Migration PocketBase** : Correction de la structure de la collection `tools_velocity_squad_events`
  - Utilisation de `fields` au lieu de `schema`
  - Simplification des options de champs
  - Correction des noms de tables dans les index
  - Ajout du champ `id` avec autogeneration

## [2.1.0] - 2025-01-19

### ✨ Ajouté
- **Badge démo** : Notification visuelle "Mode Démo" dans le header avec animation pulse
- **Tooltips enrichis** : Affichage des descriptions des faits marquants au survol du graphique
- **Légende annotations** : Affichage automatique des types de faits marquants sur une seule ligne
- **Panneau annotations** : Clic sur un type dans la légende pour voir toutes les annotations filtrées
  - Panneau latéral animé qui glisse depuis la droite
  - Liste détaillée avec sprint, date et description
  - Badge avec compteur d'annotations par type
  - Fermeture avec animation
- **Effet ripple** : Animation visuelle au clic sur le bouton casino
- **Sprint Goal** : Ajout d'un objectif de sprint (textarea libre) en mode Scrum
- **Toggle Graphique/Casino** : Bouton pour basculer entre le graphique et le casino (remplace le graphique principal)
- **Section Sprint Goal** : Affichage de l'objectif du sprint actuel sous l'action-bar
- **Modal Sprint Goal** : Interface pour modifier l'objectif de n'importe quel sprint
- **Édition dates sprint** : Modal pour modifier les dates de début et fin des sprints
  - Clic sur un sprint dans la section "Capacité Équipe"
  - Datepicker pour sélection facile des dates
  - Calcul automatique de la durée
  - Validation des dates (début < fin)
- **Affichage sprints récents** : Les 3 derniers sprints affichés dans la section capacité
- **CRUD User Stories** : Gestion complète des User Stories à estimer
  - Ajout simple (une story à la fois)
  - Ajout multiple via textarea normalisé (format: `Titre | Description`)
  - Support des commentaires (lignes commençant par `#`)
  - Édition des User Stories existantes
  - Suppression des User Stories
  - Modal de gestion centralisée
- **Navigation Casino** : Boutons "US Précédente" et "US Suivante" pour naviguer librement
- **Nom utilisateur** : Personnalisation du nom pour les estimations
- **Estimation individuelle** : Chaque utilisateur peut estimer les stories
- **Sauvegarde estimations** : Les estimations sont sauvegardées par story et par utilisateur
- **Affichage estimations multiples** : Voir toutes les estimations individuelles avec chips colorés
- **Tabs ajout stories** : Interface à onglets pour choisir entre ajout simple ou multiple

### 🎨 Amélioré
- **Interface header** : Boutons "Nouvelle Session" et sélecteur de framework alignés sur une ligne
- **Bouton casino** : Nouveau style violet avec gradient et effet ripple au clic, devient "Graphique" quand actif
- **Bouton annotations** : Style amélioré avec gradient bleu et effet hover
- **Responsive** : Meilleure adaptation du header sur petits écrans avec flex-wrap
- **Vue Casino** : Remplace le graphique principal pour plus d'espace
- **Formulaire sprint** : Ajout du champ Sprint Goal visible uniquement en mode Scrum
- **Interface Casino** : Design complet avec progression, user info, et contrôles
- **Cartes Fibonacci** : Sélection visuelle avec état actif
- **Gestion des stories** : Interface claire avec statut d'estimation
- **Terminologie Kanban** : Adaptation automatique des termes (Sprint → Période, Vélocité → Débit)
- **Insights Coach** : Regroupement des alertes similaires (ex: Bus Factor multiples)
- **Détails des alertes** : Section dépliable avec informations complémentaires

### 🔧 Technique
- Ajout de callbacks personnalisés dans les tooltips Chart.js
- Amélioration du plugin d'annotations pour afficher les descriptions
- Optimisation CSS avec animations keyframes et fadeIn
- Amélioration de la structure HTML du header
- Ajout de la propriété `currentView` dans les settings (chart | casino)
- Ajout de la propriété `userName` dans les settings
- Ajout du tableau `stories` dans la structure de données
- Gestion automatique de la visibilité du Sprint Goal selon le framework
- Migration PocketBase pour la collection `velocity_squad_sprints`
- Système de toggle entre graphique et casino avec sauvegarde de l'état
- Gestion d'état du casino avec session active
- Fonction `getTerminology()` pour adaptation automatique des termes selon le framework
- Fonction `groupSimilarAlerts()` pour regroupement intelligent des alertes

### 🗄️ Base de données
- **Migration 1757600101** : Création de la collection `velocity_squad_sprints`
  - Champs : id, session_id, name, velocity, startDate, endDate, duration, goal, bugCount, teamSize, source
  - Index sur session_id, endDate et startDate pour optimisation des requêtes
  - Support du champ `goal` (texte libre jusqu'à 1000 caractères)
  - Support des champs `startDate` et `duration` pour gestion complète des sprints

### 📝 Documentation
- Mise à jour du README.md avec les nouvelles fonctionnalités
- Ajout de la section Version 2.1 dans la roadmap
- Documentation des nouveaux effets visuels
- Documentation du système de Sprint Goal

## [2.0.0] - 2024-06-01

### ✨ Ajouté
- Système complet de vélocité Scrum/Kanban
- Intelligence coaching avec alertes automatiques
- Casino de story points pour estimation collaborative
- Système d'achievements débloquables
- Mood tracking quotidien
- Heatmap burnout
- Templates enrichis (Startup, Enterprise, Maintenance)
- Import/Export CSV, JSON, JIRA
- Partage public avec URLs anonymisées
- Radar de performance multi-critères
- Prédictions de capacité équipe

### 🎨 Design
- Interface moderne avec gradients
- Animations fluides
- Responsive design complet
- Mode sombre compatible

### 🔧 Technique
- Architecture modulaire VelocityTool
- Plugin Chart.js custom pour annotations
- LocalStorage pour persistance
- Papa Parse pour import CSV
- Chart.js pour visualisations

---

**Légende des types de changements :**
- ✨ Ajouté : Nouvelles fonctionnalités
- 🎨 Amélioré : Améliorations visuelles ou UX
- 🔧 Technique : Modifications techniques ou refactoring
- 🐛 Corrigé : Corrections de bugs
- 📝 Documentation : Mises à jour de documentation
- 🔒 Sécurité : Corrections de sécurité
