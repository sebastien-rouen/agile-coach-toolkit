# 🎯 Guide Sprint Goal - Team Velocity Dashboard

## Vue d'ensemble

Le **Sprint Goal** est l'objectif principal que l'équipe s'engage à atteindre pendant un sprint. C'est un élément clé de Scrum qui donne une direction claire et un sens au travail de l'équipe.

## Fonctionnalités

### 📍 Affichage Permanent

- **Position** : Sous la barre d'actions, sur toute la largeur
- **Visibilité** : Uniquement en mode Scrum
- **Contenu** : Objectif du sprint actuel avec métadonnées (nom du sprint, date de fin)

### ✏️ Édition

1. **Bouton "Modifier"** : Ouvre une modal pour éditer l'objectif
2. **Sélection du sprint** : Choisir n'importe quel sprint dans la liste
3. **Textarea libre** : Jusqu'à 1000 caractères pour décrire l'objectif
4. **Sauvegarde** : Enregistrement automatique dans localStorage et PocketBase

### 🔄 Ajout lors de la création

- Le champ Sprint Goal apparaît automatiquement dans le formulaire d'ajout de sprint
- Visible uniquement en mode Scrum
- Optionnel lors de la création

## Utilisation

### Définir un Sprint Goal

```
1. Cliquez sur le bouton "✏️ Modifier" dans la section Sprint Goal
2. Sélectionnez le sprint concerné dans la liste déroulante
3. Saisissez l'objectif dans le textarea
4. Cliquez sur "Enregistrer"
```

### Bonnes Pratiques

#### ✅ Bon Sprint Goal
```
"Permettre aux utilisateurs de créer et partager leurs dashboards 
de vélocité avec leur équipe via une URL publique sécurisée"
```

**Caractéristiques :**
- Orienté valeur utilisateur
- Mesurable et vérifiable
- Concis mais complet
- Compréhensible par tous

#### ❌ Mauvais Sprint Goal
```
"Faire des développements et corriger des bugs"
```

**Problèmes :**
- Trop vague
- Pas de valeur claire
- Non mesurable
- Pas inspirant

### Exemples de Sprint Goals

#### Sprint Goal Fonctionnel
```
🎯 "Livrer le système d'authentification OAuth complet permettant 
aux utilisateurs de se connecter via Google, GitHub et LinkedIn"
```

#### Sprint Goal Technique
```
🎯 "Migrer l'infrastructure vers Kubernetes avec zéro downtime 
et améliorer les temps de déploiement de 50%"
```

#### Sprint Goal Qualité
```
🎯 "Atteindre 80% de couverture de tests sur les modules critiques 
et réduire la dette technique de 20%"
```

#### Sprint Goal Exploration
```
🎯 "Valider la faisabilité technique de l'intégration Slack 
avec un prototype fonctionnel et retours utilisateurs"
```

## Structure de Données

### Format localStorage
```json
{
  "sprints": [
    {
      "id": 1705847123456,
      "name": "Sprint 1",
      "velocity": 23,
      "endDate": "2024-01-15",
      "goal": "Objectif du sprint...",
      "timestamp": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### Format PocketBase
```javascript
{
  id: "abc123",
  session_id: "session_xyz",
  name: "Sprint 1",
  velocity: 23,
  endDate: "2024-01-15",
  goal: "Objectif du sprint...",
  bugCount: 2,
  teamSize: 5,
  source: "manual",
  created: "2024-01-01 10:00:00",
  updated: "2024-01-01 10:00:00"
}
```

## Intégration PocketBase

### Migration

La collection `velocity_squad_sprints` inclut le champ `goal` :

```javascript
{
  name: "goal",
  type: "text",
  required: false,
  options: {
    min: null,
    max: 1000,
    pattern: ""
  }
}
```

### Synchronisation

- **Création** : Le goal est sauvegardé automatiquement lors de l'ajout d'un sprint
- **Modification** : Mise à jour via la modal d'édition
- **Lecture** : Chargement automatique au démarrage de l'application

## Affichage Conditionnel

### Mode Scrum
- ✅ Section Sprint Goal visible
- ✅ Champ goal dans le formulaire d'ajout
- ✅ Bouton "Modifier" actif

### Mode Kanban
- ❌ Section Sprint Goal masquée
- ❌ Champ goal absent du formulaire
- ❌ Pas d'accès à l'édition

## Détection du Sprint Actuel

L'application affiche automatiquement le goal du sprint actuel selon cette logique :

1. **Sprint en cours** : Premier sprint dont la date de fin est >= aujourd'hui
2. **Fallback** : Si aucun sprint en cours, affiche le dernier sprint
3. **Vide** : Si aucun sprint, affiche un message d'invite

```javascript
const now = new Date();
const currentSprint = this.data.sprints
    .filter(s => new Date(s.endDate) >= now)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0] 
    || this.data.sprints[this.data.sprints.length - 1];
```

## Styles CSS

### Section Sprint Goal
```css
.sprint-goal-section {
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    padding: 1.5rem 2rem;
    box-shadow: var(--shadow);
    max-width: 1400px;
    margin: 0 auto;
    border-left: 4px solid var(--primary);
}
```

### Affichage du Goal
```css
.sprint-goal-display {
    background: white;
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 2px solid #e9ecef;
    min-height: 60px;
}
```

## Accessibilité

- **Contraste** : Texte noir sur fond blanc pour lisibilité maximale
- **Taille de police** : 1rem pour le contenu, 1.2rem pour le titre
- **Espacement** : Padding généreux pour faciliter la lecture
- **Responsive** : Adaptation automatique sur mobile

## Cas d'Usage

### Retrospective
Afficher le Sprint Goal pendant la rétrospective pour évaluer si l'objectif a été atteint.

### Planning
Définir le Sprint Goal collaborativement pendant le Sprint Planning.

### Daily Standup
Rappeler le Sprint Goal chaque jour pour maintenir le focus de l'équipe.

### Review
Présenter le Sprint Goal aux stakeholders pour contextualiser les démos.

## Limitations

- **Longueur** : Maximum 1000 caractères
- **Format** : Texte brut uniquement (pas de markdown)
- **Historique** : Pas de versioning des modifications
- **Validation** : Pas de validation de format ou de contenu

## Évolutions Futures

### Version 2.2
- 📝 Support Markdown pour le formatting
- 📊 Historique des modifications du goal
- 🎯 Suggestions de goals basées sur l'IA
- 📈 Métriques de réussite du goal

### Version 2.3
- 🔗 Lien entre goal et user stories
- ✅ Checklist de critères de succès
- 📸 Capture d'écran du goal pour les rapports
- 🌐 Traduction automatique du goal

---

**Version** : 2.1.0  
**Dernière mise à jour** : 19 janvier 2025  
**Auteur** : Team Velocity Dashboard
