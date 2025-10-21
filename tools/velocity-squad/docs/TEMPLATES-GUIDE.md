# Guide des Templates Métiers

## Vue d'ensemble

Le système de templates permet de démarrer rapidement avec des données pré-configurées adaptées à différents contextes métiers. Chaque template inclut :

- ✅ Sprints/Périodes pré-configurés avec objectifs
- ✅ Équipe avec rôles et compétences spécifiques
- ✅ Annotations contextuelles
- ✅ Événements de planning adaptés
- ✅ Métriques qualité

## Organisation des Templates

Les templates sont organisés en **deux colonnes** :

### 🏃‍♂️ Colonne Scrum
Templates pour équipes travaillant en sprints fixes (1-3 semaines)

### 🌊 Colonne Kanban
Templates pour équipes travaillant en flux continu

## Templates Disponibles

### 🛒 IT - E-commerce

#### Scrum
- **Équipe** : 5 personnes (PO, Tech Lead, Frontend, Backend, QA)
- **Sprints** : 2 semaines
- **Focus** : Développement plateforme e-commerce complète
- **Objectifs** : Catalogue, paiement, espace client, recommandations

#### Kanban
- **Équipe** : 4 personnes (Lead Dev, Fullstack, Frontend, Support)
- **Périodes** : 1 semaine
- **Focus** : Maintenance et évolutions continues
- **Objectifs** : Bugs, optimisations, nouvelles fonctionnalités

---

### ⚙️ DevOps

#### Scrum
- **Équipe** : 4 personnes (DevOps Lead, SRE, DevOps Engineer, Cloud Architect)
- **Sprints** : 2 semaines
- **Focus** : Migration infrastructure et automatisation
- **Objectifs** : Kubernetes, CI/CD, monitoring, déploiements

#### Kanban
- **Équipe** : 3 personnes (DevOps, SRE, Support Ops)
- **Périodes** : 1 semaine
- **Focus** : Support infrastructure et incidents
- **Objectifs** : Incidents, automatisation, monitoring, optimisations

---

### 📊 Data

#### Scrum
- **Équipe** : 4 personnes (Data Engineer, Data Scientist, Analytics Engineer, Data Analyst)
- **Sprints** : 2 semaines
- **Focus** : Pipelines ETL et modèles ML
- **Objectifs** : ETL, dashboards, ML, API recommandations

#### Kanban
- **Équipe** : 3 personnes (Data Analyst, Analytics Engineer, Data Engineer)
- **Périodes** : 1 semaine
- **Focus** : Rapports et analyses ad-hoc
- **Objectifs** : Rapports, maintenance ETL, dashboards, optimisations

---

### 👥 RH

#### Scrum
- **Équipe** : 3 personnes (PO RH, Fullstack Dev, UX Designer)
- **Sprints** : 2 semaines
- **Focus** : Digitalisation processus RH
- **Objectifs** : Congés, recrutement, évaluations, formation

#### Kanban
- **Équipe** : 2 personnes (RH Digital, Dev RH)
- **Périodes** : 1 semaine
- **Focus** : Gestion quotidienne RH
- **Objectifs** : Support, corrections, améliorations, nouvelles fonctionnalités

---

### 🏛️ Mairie

#### Scrum
- **Équipe** : 4 personnes (Chef de projet, 2 Développeurs, Testeur)
- **Sprints** : 3 semaines
- **Focus** : Services publics numériques
- **Objectifs** : Démarches en ligne, rendez-vous, suivi demandes, associations

#### Kanban
- **Équipe** : 3 personnes (Responsable SI, Développeur, Support)
- **Périodes** : 1 semaine
- **Focus** : Traitement demandes citoyennes
- **Objectifs** : Demandes, support, améliorations, nouvelles démarches

---

### 🏥 Médical

#### Scrum
- **Équipe** : 5 personnes (PO Médical, Tech Lead, Backend, Frontend, QA Santé)
- **Sprints** : 2 semaines
- **Focus** : Système de gestion hospitalière
- **Objectifs** : Dossier patient, prescriptions, planning, téléconsultation

#### Kanban
- **Équipe** : 4 personnes (Référent Médical, Dev Santé, Support, QA)
- **Périodes** : 1 semaine
- **Focus** : Support et maintenance système
- **Objectifs** : Support, corrections, améliorations UX, nouvelles fonctionnalités

---

### 🚗 Permis de conduire

#### Scrum
- **Équipe** : 3 personnes (PO, Fullstack Dev, Mobile Dev)
- **Sprints** : 2 semaines
- **Focus** : Plateforme d'apprentissage
- **Objectifs** : Code, tests blancs, réservation leçons, application mobile

#### Kanban
- **Équipe** : 2 personnes (Responsable Pédagogique, Développeur)
- **Périodes** : 1 semaine
- **Focus** : Support utilisateurs
- **Objectifs** : Support, corrections, contenus pédagogiques, optimisations mobile

---

## Utilisation

### 1. Ouvrir la Modal Templates

Cliquez sur le bouton **📋 Templates** dans la barre d'actions.

### 2. Choisir un Template

- Parcourez les deux colonnes (Scrum / Kanban)
- Cliquez sur le template qui correspond à votre contexte
- Chaque carte affiche :
  - 🎯 Icône métier
  - 📝 Nom du template
  - 👥 Taille d'équipe
  - ⏱️ Durée des sprints/périodes
  - 📋 Description du focus

### 3. Confirmer le Chargement

Une modal de confirmation s'affiche avec deux options :

#### Option A : Session actuelle
- Remplace les données actuelles
- Affiche le nombre de sprints existants
- ⚠️ Les données actuelles seront perdues

#### Option B : Nouvelle session
- Crée une nouvelle session vierge
- Charge le template dans cette nouvelle session
- 💾 Les données actuelles sont préservées (si PocketBase activé)

### 4. Validation

Cliquez sur **💾 Sauvegarder** pour confirmer le chargement.

Le template est chargé avec :
- ✅ Sprints/Périodes avec objectifs
- ✅ Membres d'équipe avec compétences
- ✅ Annotations contextuelles
- ✅ Événements de planning
- ✅ Données de mood générées (30 jours)
- ✅ Métriques qualité

---

## Personnalisation

Après le chargement d'un template, vous pouvez :

1. **Modifier les sprints** : Dates, vélocité, objectifs
2. **Ajuster l'équipe** : Ajouter/supprimer des membres, modifier les compétences
3. **Ajouter des annotations** : Faits marquants spécifiques à votre contexte
4. **Configurer les événements** : Adapter les horaires et récurrences
5. **Enregistrer le mood** : Suivre l'humeur quotidienne de l'équipe

---

## Bonnes Pratiques

### Choix du Framework

**Scrum** si :
- ✅ Projets avec scope défini
- ✅ Livraisons régulières
- ✅ Équipe stable
- ✅ Besoin de prédictibilité

**Kanban** si :
- ✅ Support et maintenance
- ✅ Flux de travail continu
- ✅ Priorités changeantes
- ✅ Équipe flexible

### Adaptation du Template

1. **Commencez avec le template le plus proche** de votre contexte
2. **Ajustez progressivement** les données selon vos besoins
3. **Conservez les bonnes pratiques** (événements, annotations)
4. **Exportez votre configuration** pour la réutiliser

### Gestion des Sessions

- **Mode local** : Un seul template actif à la fois
- **Mode PocketBase** : Plusieurs sessions possibles
  - Créez une session par projet/équipe
  - Basculez facilement entre les sessions
  - Historique complet préservé

---

## Données Incluses

### Sprints/Périodes
- Nom descriptif
- Dates de début et fin
- Vélocité réaliste
- Objectif (Sprint Goal) détaillé

### Équipe
- Noms fictifs
- Rôles spécifiques au métier
- Compétences techniques pertinentes
- Capacité (% de disponibilité)

### Annotations
- Événements marquants
- Incidents résolus
- Formations suivies
- Releases déployées
- Changements d'équipe

### Événements
- Daily Standup (récurrent)
- Sprint Planning
- Backlog Refinement
- Sprint Review
- Sprint Retrospective
- Événements spécifiques au métier

### Mood Tracking
- 30 jours de données générées
- Patterns réalistes (lundi bas, vendredi haut)
- Variation par membre
- Commentaires contextuels

---

## Développement de Nouveaux Templates

Pour ajouter un nouveau template, modifiez `js/templates-data.js` :

```javascript
'scrum-nouveau-metier': {
    name: "🎯 Nouveau Métier (Scrum)",
    framework: 'scrum',
    sprints: [
        { 
            name: "Sprint 1", 
            velocity: 20, 
            startDate: "2025-06-02", 
            endDate: "2025-06-15", 
            goal: "Objectif du sprint" 
        }
        // ... autres sprints
    ],
    team: [
        { 
            id: 1, 
            name: "Prénom", 
            role: "Rôle", 
            capacity: 100, 
            skills: ["Compétence1", "Compétence2"] 
        }
        // ... autres membres
    ],
    annotationsTemplate: [
        { 
            sprintIndex: 0, 
            type: "release", 
            text: "Description de l'événement" 
        }
        // ... autres annotations
    ],
    settings: { 
        framework: 'scrum', 
        sprintLength: 14, 
        workingDays: 10 
    }
}
```

Puis ajoutez la carte dans `index.html` :

```html
<div class="template-card" data-template="scrum-nouveau-metier" data-framework="scrum">
    <div class="template-icon">🎯</div>
    <h4>Nouveau Métier</h4>
    <p>Équipe X pers, sprints Y semaines<br>Description du contexte</p>
</div>
```

---

## Support

Pour toute question ou suggestion de nouveau template :
- 📧 Contact : rouen.sebastien@gmail.com
- 💬 GitHub : https://github.com/sebastien-rouen/
- ☕ Buy me a coffee : https://buymeacoffee.com/sebastien.rouen
