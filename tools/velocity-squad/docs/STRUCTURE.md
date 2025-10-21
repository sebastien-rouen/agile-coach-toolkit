# 📁 Structure du Projet - Velocity Squad

## Vue d'ensemble

```
tools/velocity-squad/
├── 📄 index.html                    # Page principale
│
├── 📁 js/                           # Scripts JavaScript
│   ├── script.js                    # Script principal (VelocityTool)
│   ├── team-manager.js              # Gestion CRUD des membres
│   └── pocketbase-integration.js    # Intégration PocketBase
│
├── 📁 css/                          # Feuilles de style
│   ├── styles.css                   # Styles principaux
│   └── team-manager.css             # Styles Team Manager
│
├── 📁 docs/                         # Documentation
│   ├── README.md                    # Documentation principale
│   ├── CHANGELOG.md                 # Historique des versions
│   ├── TEAM-MANAGER.md              # Guide Team Manager
│   └── STRUCTURE.md                 # Ce fichier
│
└── 📁 examples/                     # Exemples et templates
    └── team-example.json            # Exemple d'équipe avec moods
```

## Détail des Fichiers

### 📄 index.html

**Rôle** : Page principale de l'application

**Sections principales** :
- Header avec sélecteur de mode (Scrum/Kanban)
- Barre d'actions (Import, Export, Partage, etc.)
- Section Sprint Goal (mode Scrum uniquement)
- Dashboard en grille :
  - Graphique principal / Casino
  - KPIs (Indicateurs clés)
  - Radar de performance
  - Planning avec timeline
  - Capacité équipe
  - **Team Manager** (nouvelle section)
  - Insights coaching
- Modales (Import, Ajout sprint, Annotations, etc.)

**Dépendances externes** :
- Chart.js (graphiques)
- PapaParse (import CSV)

### 📁 js/

#### script.js
En cliq
**Rôle** : Logique principale de l'application

**Classe principale** : `VelocityTool`

**Responsabilités** :
- Gestion des sprints
- Calcul des métriques (vélocité, KPIs)
- Rendu des graphiques (Chart.js)
- Gestion des annotations
- Import/Export de données
- Intégration JIRA
- Casino d'estimation
- Planning et événements
- Achievements et gamification

**Méthodes clés** :
```javascript
init()                    // Initialisation
loadFromStorage()         // Chargement localStorage
saveToStorage()           // Sauvegarde localStorage
renderAll()               // Rendu complet
renderChart()             // Graphique vélocité
renderRadarChart()        // Radar performance
updateKPIs()              // Mise à jour indicateurs
showCoachingInsights()    // Alertes coaching
```

#### team-manager.js

**Rôle** : Gestion CRUD des membres d'équipe

**Classe principale** : `TeamManager`

**Responsabilités** :
- CRUD des membres (Create, Read, Update, Delete)
- Enregistrement du mood quotidien
- Affichage de la liste des membres
- Gestion du formulaire d'ajout/édition
- Intégration PocketBase

**Méthodes clés** :
```javascript
render()                          // Affichage liste
saveMember()                      // Création/Mise à jour
editMember(id)                    // Édition
deleteMember(id)                  // Suppression
saveMoodForMember(memberId, mood) // Enregistrement mood
getMoodForMember(memberId)        // Récupération mood
```

**Structure de données** :
```javascript
// Membre
{
  id: number,
  name: string,
  role: string,
  skills: string[],
  capacity: number,
  createdAt: string
}

// Mood
{
  id: number,
  date: string,
  score: number,        // 1=😞, 2=😐, 3=😊
  memberId: number,
  memberName: string,
  timestamp: string
}
```

#### pocketbase-integration.js

**Rôle** : Intégration avec PocketBase

**Fonctions principales** :
```javascript
// Membres
saveTeamMemberToPocketBase(member)
updateTeamMemberInPocketBase(member)
deleteTeamMemberFromPocketBase(member)

// Moods
saveMoodToPocketBase(moodEntry)

// Sprints
saveSprintToPocketBase(sprint)
updateSprintInPocketBase(sprint)

// Annotations
saveAnnotationToPocketBase(annotation)
```

**Collections PocketBase** :
- `velocity_team` : Membres d'équipe
- `velocity_mood` : Moods quotidiens
- `velocity_sprints` : Sprints
- `velocity_annotations` : Faits marquants

### 📁 css/

#### styles.css

**Rôle** : Styles principaux de l'application

**Sections** :
- Variables CSS (couleurs, espacements)
- Reset et base
- Header et navigation
- Dashboard en grille
- Graphiques et KPIs
- Modales et formulaires
- Animations et transitions
- Responsive design

**Variables CSS** :
```css
--primary: #2196F3;
--success: #4CAF50;
--warning: #FF9800;
--danger: #F44336;
--info: #00BCD4;
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
--border-radius: 8px;
--transition: all 0.3s ease;
```

#### team-manager.css

**Rôle** : Styles spécifiques au Team Manager

**Classes principales** :
```css
.team-section              /* Conteneur principal */
.team-member-row           /* Ligne de membre */
.team-member-info          /* Informations membre */
.mood-selector-inline      /* Sélecteur de mood */
.mood-btn-inline           /* Bouton de mood */
.team-member-capacity      /* Capacité */
.team-member-actions       /* Actions (éditer/supprimer) */
.btn-icon                  /* Bouton d'action */
#teamMemberFormContainer   /* Formulaire */
```

**Layout** :
```css
.team-member-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 80px 80px;
  /* Colonnes : Info | Mood | Capacité | Actions */
}
```

### 📁 docs/

#### README.md

**Contenu** :
- Vision et objectifs
- Fonctionnalités principales
- Installation et démarrage
- Guide d'usage par rôle
- Exemples d'utilisation
- FAQ et dépannage

#### CHANGELOG.md

**Contenu** :
- Historique des versions
- Nouvelles fonctionnalités
- Corrections de bugs
- Améliorations
- Breaking changes

**Format** : [Keep a Changelog](https://keepachangelog.com/)

#### TEAM-MANAGER.md

**Contenu** :
- Vue d'ensemble du Team Manager
- Fonctionnalités détaillées
- Architecture et fichiers
- Utilisation (CRUD + Mood)
- Intégration PocketBase
- API JavaScript
- Styles CSS
- Migration depuis Heatmap
- Exemples pratiques

#### STRUCTURE.md

**Contenu** : Ce fichier - documentation de la structure du projet

### 📁 examples/

#### team-example.json

**Contenu** : Exemple d'équipe avec 5 membres et leurs moods

**Utilisation** :
```javascript
// Charger l'exemple
fetch('examples/team-example.json')
  .then(r => r.json())
  .then(data => {
    window.velocityTool.data.team = data.team;
    window.velocityTool.data.moodTracking = data.moodTracking;
    window.teamManager.render();
  });
```

## Flux de Données

### Initialisation

```
1. DOMContentLoaded
   ↓
2. new VelocityTool()
   ↓
3. loadFromStorage() ou loadSharedData()
   ↓
4. new TeamManager(velocityTool)
   ↓
5. renderAll() + teamManager.render()
```

### Ajout d'un Membre

```
1. Clic "➕ Ajouter Membre"
   ↓
2. teamManager.showAddMemberForm()
   ↓
3. Remplissage formulaire
   ↓
4. Submit → teamManager.saveMember()
   ↓
5. Ajout dans velocityTool.data.team
   ↓
6. saveTeamMemberToPocketBase() (si disponible)
   ↓
7. velocityTool.saveToStorage()
   ↓
8. teamManager.render()
```

### Enregistrement du Mood

```
1. Clic sur bouton mood (😊 😐 😞)
   ↓
2. teamManager.saveMoodForMember(memberId, mood)
   ↓
3. Création moodEntry
   ↓
4. Suppression ancien mood du jour (si existe)
   ↓
5. Ajout dans velocityTool.data.moodTracking
   ↓
6. saveMoodToPocketBase() (si disponible)
   ↓
7. velocityTool.saveToStorage()
   ↓
8. teamManager.render()
   ↓
9. Notification "✅ Humeur enregistrée"
```

## Dépendances

### Externes (CDN)

- **Chart.js** : Graphiques interactifs
  - URL : `https://cdn.jsdelivr.net/npm/chart.js`
  - Utilisation : Vélocité, radar, annotations

- **PapaParse** : Parsing CSV
  - URL : `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`
  - Utilisation : Import CSV/Excel

### Internes

- **PocketBase Manager** : `../../assets/js/pocketbase-manager.js`
  - Gestion de la connexion PocketBase
  - Utilitaires de base de données

- **Tool Integration** : `../../assets/js/tool-integration.js`
  - Intégration avec Agile Coach Toolkit
  - Navigation entre outils

## Conventions de Code

### Nommage

- **Variables** : camelCase (`teamMember`, `moodScore`)
- **Fonctions** : camelCase (`saveMember()`, `renderAll()`)
- **Classes** : PascalCase (`VelocityTool`, `TeamManager`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_CAPACITY`)
- **Fichiers** : kebab-case (`team-manager.js`, `styles.css`)
- **IDs HTML** : camelCase (`teamMembersContainer`)
- **Classes CSS** : kebab-case (`.team-member-row`)

### Structure des Fonctions

```javascript
/**
 * Description de la fonction
 * 
 * @param {type} param - Description du paramètre
 * @returns {type} Description du retour
 */
async functionName(param) {
    // Validation
    if (!param) return;
    
    // Logique métier
    const result = doSomething(param);
    
    // Sauvegarde
    await saveToPocketBase(result);
    this.saveToStorage();
    
    // Rendu
    this.render();
    
    // Feedback
    this.showNotification('✅ Succès');
}
```

### Gestion des Erreurs

```javascript
try {
    // Code risqué
    await operation();
} catch (error) {
    console.error('Erreur:', error);
    this.showNotification('❌ Erreur', 'error');
}
```

## Performance

### Optimisations

- **Rendu ciblé** : Mise à jour uniquement des sections modifiées
- **Debouncing** : Auto-sauvegarde toutes les 30 secondes
- **Lazy loading** : Chargement des données à la demande
- **Cache** : Stockage localStorage pour accès rapide

### Métriques

- **Temps de chargement** : < 1 seconde
- **Temps de rendu** : < 100ms par section
- **Taille bundle** : ~150 KB (sans dépendances)

## Sécurité

### Données Sensibles

- ❌ Pas de mots de passe en clair
- ❌ Pas de tokens dans le code
- ✅ Validation côté client ET serveur
- ✅ Échappement des données utilisateur

### PocketBase

- Authentification requise pour les opérations CRUD
- Règles de sécurité au niveau des collections
- Validation des données avant sauvegarde

## Tests

### Tests Manuels

1. **CRUD Membres** : Ajouter, modifier, supprimer
2. **Mood** : Enregistrer, modifier, vérifier affichage
3. **Responsive** : Tester sur mobile/tablette/desktop
4. **PocketBase** : Vérifier synchronisation
5. **LocalStorage** : Vérifier sauvegarde/restauration

### Tests Automatisés (à venir)

- Tests unitaires (Jest)
- Tests d'intégration (Cypress)
- Tests de performance (Lighthouse)

## Roadmap

### Version 3.1.0

- [ ] Historique des moods par membre
- [ ] Graphique d'évolution du mood
- [ ] Export CSV de l'équipe
- [ ] Filtrage par rôle/compétence

### Version 3.2.0

- [ ] Notifications de mood bas
- [ ] Intégration avec radar de performance
- [ ] Suggestions d'amélioration basées sur les moods
- [ ] Comparaison inter-équipes

---

**Version** : 3.0.0  
**Date** : 20 octobre 2025  
**Auteur** : Sébastien ROUEN
