# 📅 Guide Planning & Événements

## Vue d'ensemble

La section Planning permet de visualiser et gérer tous les événements de votre équipe Agile, adaptés à votre framework (Scrum ou Kanban).

## Section Planning

### Timeline visuelle (3 semaines)

La timeline offre une vue d'ensemble rapide de vos événements :
- **Grille de 21 jours** : 3 semaines complètes
- **Indicateurs visuels** :
  - Gris : Aucun événement
  - Bleu : 1 événement
  - Orange : Plusieurs événements
  - Bordure verte : Aujourd'hui
- **Badge compteur** : Nombre d'événements sur les jours chargés
- **Clic sur un jour** : Affiche le détail des événements dans une modal
- **Semaines numérotées** : Avec plages de dates

### Affichage des événements

La section Planning affiche tous vos événements avec :
- **Icône et couleur** par type d'événement
- **Date** formatée (jour, date, mois)
- **Heure** de début
- **Durée** en minutes
- **Badge récurrent** pour les événements répétitifs
- **Description** optionnelle
- **Actions** : Modifier (✏️) et Supprimer (🗑️)

### Types d'événements

#### Mode Scrum 🏃‍♂️
- 🌅 **Daily Standup** - Synchronisation quotidienne (15 min)
- 📋 **Sprint Planning** - Planification du sprint (2-4h)
- 🔍 **Backlog Refinement** - Affinage du backlog (1-2h)
- 🎯 **Sprint Review** - Démonstration (1-2h)
- 🔄 **Sprint Retrospective** - Amélioration continue (1-2h)

#### Mode Kanban 🌊
- 🌅 **Daily Standup** - Synchronisation quotidienne (15 min)
- 🔍 **Backlog Refinement** - Affinage du backlog (1-2h)
- 🔄 **Retrospective** - Amélioration continue (1-2h)

## Ajouter un événement

### Étapes

1. Cliquez sur **"➕ Ajouter Événement"** dans la section Planning
2. Sélectionnez le **type d'événement** (adapté à votre framework)
3. Renseignez le **titre** (ex: "Daily Standup")
4. Choisissez la **date** avec le datepicker
5. Définissez l'**heure** (format 24h)
6. Indiquez la **durée** en minutes
7. Ajoutez une **description** optionnelle
8. Cochez **"Événement récurrent"** si applicable
9. Cliquez sur **"Ajouter"**

## Modifier un événement

### Étapes

1. Cliquez sur l'icône **✏️** sur l'événement à modifier
2. Le formulaire se pré-remplit avec les données existantes
3. Modifiez les champs souhaités
4. Cliquez sur **"💾 Enregistrer"**

### Champs modifiables

- Type d'événement
- Titre
- Date
- Heure
- Durée
- Description
- Statut récurrent

### Conseils

- **Daily Standup** : Marquez-le comme récurrent pour ne pas le recréer chaque jour
- **Backlog Refinement** : Planifiez-en plusieurs par sprint (recommandé : 2-3)
- **Durées recommandées** :
  - Daily : 15 min
  - Planning : 2h (sprint 1 semaine) ou 4h (sprint 2 semaines)
  - Refinement : 1h
  - Review : 1h
  - Retrospective : 1h30

## Modifier les dates d'un sprint

### Interface avec slider

1. Cliquez sur un **sprint** dans la section "Capacité Équipe"
2. Modifiez le **nom** si nécessaire
3. Cliquez sur la **date de début** pour ouvrir le datepicker
4. Utilisez le **slider** pour ajuster la durée :
   - Déplacez le curseur de 1 à 30 jours
   - La date de fin se calcule automatiquement
   - Le label affiche "+X jours"
   - La date de fin formatée s'affiche en temps réel
5. Cliquez sur **"💾 Enregistrer"**

### Avantages du slider

- **Rapide** : Ajustez la durée en un geste
- **Visuel** : Gradient de couleur (vert → orange → rouge)
- **Précis** : Affichage en temps réel de la date calculée
- **Intuitif** : Plus besoin de calculer manuellement les dates

### Durées recommandées

- **Scrum** : 7-14 jours (1-2 semaines)
- **Kanban** : 7-30 jours (1-4 semaines)
- **Startup** : 7 jours (itérations rapides)
- **Enterprise** : 14 jours (cycles plus longs)

## Templates pré-configurés

### 🚀 Startup
- **Sprints** : 6 sprints d'une semaine
- **Événements** : Daily, Planning, Refinement, Review, Retrospective
- **Sprint Goals** : Objectifs clairs et progressifs

### 🏢 Enterprise
- **Sprints** : 7 sprints de 2 semaines
- **Événements** : Tous les événements Scrum + refinements multiples
- **Sprint Goals** : Objectifs ambitieux et détaillés

### 🔧 Maintenance
- **Sprints** : 6 semaines en mode Kanban
- **Événements** : Daily, Refinements, Retrospective mensuelle
- **Sprint Goals** : Objectifs de maintenance et amélioration

## Bonnes pratiques

### Planning des événements

1. **Planifiez à l'avance** : Créez les événements au début du sprint
2. **Soyez régulier** : Gardez les mêmes horaires pour les événements récurrents
3. **Préparez** : Ajoutez des descriptions pour les événements importants
4. **Adaptez** : Ajustez les durées selon les besoins de votre équipe

### Gestion des sprints

1. **Dates cohérentes** : Assurez-vous que les sprints se suivent sans chevauchement
2. **Durée constante** : Gardez la même durée de sprint pour la prévisibilité
3. **Sprint Goals** : Définissez toujours un objectif clair et mesurable
4. **Revue régulière** : Ajustez les dates si nécessaire via le slider

## Intégration PocketBase

Les événements sont automatiquement sauvegardés dans PocketBase si disponible :
- Collection : `tools_velocity_squad_events`
- Champs : type, titre, date, heure, durée, description, récurrent
- Synchronisation automatique avec le localStorage

## Raccourcis

- **Clic sur sprint** → Ouvre la modal d'édition
- **Clic sur date de début** → Ouvre le datepicker
- **Slider** → Ajuste la durée du sprint
- **Clic sur jour timeline** → Affiche les événements du jour
- **Bouton ✏️** → Modifie un événement
- **Bouton 🗑️** → Supprime un événement

## Utilisation de la timeline

### Navigation rapide

La timeline permet de :
- **Visualiser** la charge d'événements sur 3 semaines
- **Identifier** les jours chargés (orange) vs légers (bleu)
- **Repérer** rapidement aujourd'hui (bordure verte)
- **Cliquer** sur un jour pour voir le détail

### Codes couleur

- **Gris clair** : Aucun événement prévu
- **Bleu** : 1 événement (charge normale)
- **Orange** : Plusieurs événements (charge élevée)
- **Badge rouge** : Nombre exact d'événements

### Conseils d'utilisation

1. **Équilibrez** : Évitez de surcharger certains jours
2. **Anticipez** : Planifiez les événements à l'avance
3. **Visualisez** : Utilisez la timeline pour détecter les conflits
4. **Optimisez** : Répartissez les refinements sur plusieurs jours

---

**Astuce** : Utilisez les templates pour démarrer rapidement avec des événements pré-configurés !
