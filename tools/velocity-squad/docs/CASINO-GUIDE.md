# 🎰 Guide Casino Story Points - Team Velocity Dashboard

## Vue d'ensemble

Le **Story Points Casino** est un outil d'estimation collaborative gamifié qui remplace le graphique principal pour offrir une expérience immersive d'estimation des User Stories.

## Accès au Casino

### Activation
1. Cliquez sur le bouton **🎰 Casino** dans la barre d'actions
2. Le graphique principal est remplacé par l'interface du casino
3. Le bouton devient **📊 Graphique** pour revenir à la vue normale

### Désactivation
- Cliquez sur **📊 Graphique** pour revenir au graphique de vélocité
- Votre progression est sauvegardée automatiquement

## Gestion des User Stories

### ➕ Ajouter des User Stories

Le système propose deux modes d'ajout :

#### Mode Simple (Une Story)
1. Cliquez sur **➕ Ajouter US** dans le header du casino
2. Sélectionnez l'onglet **📝 Une Story**
3. Remplissez le formulaire :
   - **Titre** : Nom court de la fonctionnalité (ex: "Login social OAuth")
   - **Description** : Détails de la fonctionnalité (optionnel)
4. Cliquez sur **Ajouter**

**Exemple :**
```
Titre: Dashboard analytics temps réel
Description: Affichage des métriques de vélocité avec Chart.js 
et mise à jour automatique toutes les 5 secondes
```

#### Mode Multiple (Plusieurs Stories)
1. Cliquez sur **➕ Ajouter US** dans le header du casino
2. Sélectionnez l'onglet **📋 Plusieurs Stories**
3. Saisissez vos stories dans le textarea (une par ligne)
4. Utilisez le format : `Titre | Description` ou simplement `Titre`
5. Cliquez sur **Ajouter toutes les stories**

**Formats acceptés :**
```
Login social OAuth | Intégration Google/GitHub/LinkedIn
Dashboard analytics | Métriques temps réel avec Chart.js
Notifications push
Export PDF | Génération rapports automatiques
Mode hors-ligne | Sync différée des données
```

**Avantages du mode multiple :**
- ✅ Ajout rapide de plusieurs stories
- ✅ Import depuis un fichier texte (copier-coller)
- ✅ Format simple et flexible
- ✅ Description optionnelle

### 📋 Gérer les User Stories

**Accès :**
- Cliquez sur **📋 Gérer US** dans le header du casino

**Fonctionnalités :**
- **Liste complète** : Voir toutes les User Stories avec leur statut
- **✏️ Éditer** : Modifier le titre et la description
- **🗑️ Supprimer** : Retirer une User Story (avec confirmation)
- **Statut** : Badge vert "Estimation finale: X pts" ou gris "Non estimé"
- **Estimations individuelles** : Voir toutes les estimations de chaque personne avec des chips colorés

**Interface :**
```
┌─────────────────────────────────────────────┐
│ 📋 Gérer les User Stories                  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Login social OAuth                  ✏️ 🗑️│ │
│ │ Intégration Google/GitHub/LinkedIn      │ │
│ │ Estimation finale: 8 pts                │ │
│ │ Estimations individuelles:              │ │
│ │ [Alice: 8] [Bob: 5] [Charlie: 8]       │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Dashboard analytics                 ✏️ 🗑️│ │
│ │ Métriques temps réel avec Chart.js     │ │
│ │ Non estimé                              │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Chips colorés :**
Les estimations individuelles sont affichées avec des couleurs correspondant aux cartes Fibonacci :
- 🔵 **1 point** : Bleu
- 🟣 **2 points** : Violet
- 🟢 **3 points** : Vert
- 🟠 **5 points** : Orange
- 🔴 **8 points** : Rouge
- 🟤 **13 points** : Marron
- 🔴 **21 points** : Rouge foncé
- 🟣 **34 points** : Violet foncé

## Estimation des Stories

### 👤 Définir votre nom

**Première utilisation :**
1. Cliquez sur le bouton **✏️** à côté de "👤 Utilisateur"
2. Saisissez votre nom
3. Votre nom sera affiché et utilisé pour les estimations

**Modification :**
- Cliquez à nouveau sur **✏️** pour changer de nom
- Utile pour tester différentes perspectives

### 🎴 Estimer une Story

**Processus :**
1. Lisez attentivement la User Story affichée
2. Sélectionnez une carte Fibonacci (1, 2, 3, 5, 8, 13, 21, 34)
3. La carte sélectionnée s'illumine
4. Votre estimation est affichée : "✅ Votre estimation : X points"
5. Cliquez sur **💾 Enregistrer l'estimation**

**Cartes Fibonacci :**
```
┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 5 │ │ 8 │ │13 │ │21 │ │34 │
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘
```

**Signification des points :**
- **1-2** : Très simple, quelques heures
- **3-5** : Simple, 1-2 jours
- **8** : Moyen, 3-4 jours
- **13** : Complexe, 1 semaine
- **21-34** : Très complexe, à découper

### 🔄 Réinitialiser

**Utilité :**
- Recommencer l'estimation de la story actuelle
- Utile si vous changez d'avis

**Action :**
- Cliquez sur **🔄 Réinitialiser**
- Votre estimation est effacée
- Vous pouvez sélectionner une nouvelle carte

### Navigation entre les Stories

**Boutons de navigation :**
- **⬅️ US Précédente** : Revenir à la story précédente
- **➡️ US Suivante** : Passer à la story suivante

**Fonctionnement :**
1. Les boutons sont toujours visibles
2. Le bouton "US Précédente" est désactivé sur la première story
3. Le bouton "US Suivante" est désactivé sur la dernière story
4. La navigation réinitialise l'estimation en cours
5. Le compteur de progression est mis à jour (ex: "Story 2 / 6")

**Avantages :**
- ✅ Navigation libre dans le backlog
- ✅ Retour en arrière pour vérifier une estimation
- ✅ Pas besoin d'estimer dans l'ordre
- ✅ Flexibilité totale

## Interface du Casino

### Header
```
┌─────────────────────────────────────────────┐
│ 🎰 Story Points Casino                      │
│ Story 1 / 5          👤 Sébastien ROUEN ✏️  │
│ ➕ Ajouter US  📋 Gérer US                   │
└─────────────────────────────────────────────┘
```

### Story Card
```
┌─────────────────────────────────────────────┐
│ Login social OAuth                          │
│                                             │
│ Intégration Google/GitHub/LinkedIn pour    │
│ permettre aux utilisateurs de se connecter │
│ rapidement sans créer de compte            │
└─────────────────────────────────────────────┘
```

### Zone d'estimation
```
Sélectionnez votre estimation :

┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 5 │ │ 8 │ │13 │ │21 │ │34 │
└───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘

✅ Votre estimation : 8 points
```

### Contrôles
```
┌─────────────────────────────────────────────┐
│ Navigation:                                 │
│ [⬅️ US Précédente] [➡️ US Suivante]         │
│                                             │
│ Actions:                                    │
│ [💾 Enregistrer l'estimation]               │
│ [🔄 Réinitialiser]                          │
└─────────────────────────────────────────────┘
```

## Données Sauvegardées

### Structure d'une User Story
```javascript
{
  id: 1705847123456,
  title: "Login social OAuth",
  description: "Intégration Google/GitHub/LinkedIn",
  complexity: "?",
  estimate: 8,
  estimatedBy: "Sébastien ROUEN",
  estimatedAt: "2025-01-19T10:30:00.000Z",
  estimates: {
    "Alice": { points: 8, timestamp: "2025-01-19T10:25:00.000Z" },
    "Bob": { points: 5, timestamp: "2025-01-19T10:26:00.000Z" },
    "Charlie": { points: 8, timestamp: "2025-01-19T10:27:00.000Z" }
  },
  created: "2025-01-19T09:00:00.000Z"
}
```

### Persistance
- **localStorage** : Sauvegarde automatique locale
- **PocketBase** : Synchronisation serveur (si configuré)
- **Export JSON** : Inclus dans l'export complet des données

## Cas d'Usage

### Planning Poker Solo
```
1. Ajoutez toutes les stories du sprint
2. Estimez chaque story individuellement
3. Notez vos estimations
4. Partagez avec l'équipe en réunion
```

### Pré-estimation
```
1. Le Product Owner ajoute les stories
2. Chaque membre estime en amont
3. Discussion des écarts en Planning
4. Consensus final en équipe
```

### Révision d'estimations
```
1. Importez les stories existantes
2. Ré-estimez après retour d'expérience
3. Comparez avec les estimations initiales
4. Ajustez la vélocité future
```

### Formation
```
1. Créez des stories d'exemple
2. Formez les nouveaux membres
3. Expliquez la suite de Fibonacci
4. Pratiquez l'estimation relative
```

## Bonnes Pratiques

### ✅ À Faire

**Descriptions claires :**
```
❌ "Faire le login"
✅ "Implémenter l'authentification OAuth avec Google, GitHub et 
    LinkedIn, incluant la gestion des tokens et la création 
    automatique de compte utilisateur"
```

**Découpage approprié :**
- Stories > 13 points → À découper
- Stories < 3 points → Peut-être trop petites
- Viser 3-8 points pour la majorité

**Estimation relative :**
- Comparer avec des stories déjà réalisées
- Utiliser des stories de référence
- Penser en complexité, pas en temps

**Consensus d'équipe :**
- Discuter les écarts importants
- Comprendre les différentes perspectives
- Viser l'alignement, pas l'unanimité

### ❌ À Éviter

**Estimations en heures :**
```
❌ "Cette story prendra 16 heures"
✅ "Cette story est similaire à la story X (8 points)"
```

**Sur-précision :**
```
❌ Débattre entre 7 et 8 points
✅ Utiliser la suite de Fibonacci (5, 8, 13)
```

**Estimation sans contexte :**
```
❌ Estimer sans lire la description
✅ Comprendre les critères d'acceptation
```

**Stories trop grosses :**
```
❌ "Refonte complète du système" (34 points)
✅ Découper en stories de 3-8 points
```

## Raccourcis Clavier

### Navigation
- **Flèche Gauche** : Story précédente
- **Flèche Droite** : Story suivante
- **Entrée** : Enregistrer l'estimation
- **R** : Réinitialiser
- **1-8** : Sélectionner carte (1, 2, 3, 5, 8, 13, 21, 34)

### Gestion
- **A** : Ajouter une story
- **M** : Gérer les stories
- **N** : Changer de nom
- **Échap** : Fermer les modales

## Intégration PocketBase

### Collection stories
```javascript
{
  name: "velocity_squad_stories",
  fields: [
    { name: "session_id", type: "text" },
    { name: "title", type: "text" },
    { name: "description", type: "text" },
    { name: "estimate", type: "number" },
    { name: "estimatedBy", type: "text" },
    { name: "estimatedAt", type: "date" }
  ]
}
```

### Synchronisation
- **Création** : Sauvegarde automatique à l'ajout
- **Modification** : Mise à jour lors de l'estimation
- **Suppression** : Suppression immédiate
- **Lecture** : Chargement au démarrage

## Dépannage

### "Aucune User Story à estimer"
**Solution :** Cliquez sur "➕ Ajouter US" pour créer votre première story

### Les estimations ne sont pas sauvegardées
**Vérifications :**
1. Cliquez bien sur "💾 Enregistrer l'estimation"
2. Vérifiez que localStorage est activé
3. Consultez la console (F12) pour les erreurs

### Le casino ne s'affiche pas
**Solutions :**
1. Vérifiez que vous avez cliqué sur "🎰 Casino"
2. Rechargez la page (F5)
3. Videz le cache du navigateur

### Les stories ont disparu
**Récupération :**
1. Vérifiez l'export JSON de sauvegarde
2. Importez les données depuis le fichier
3. Vérifiez PocketBase si configuré

## Statistiques

### Métriques Disponibles
- **Nombre total de stories** : Dans la modal de gestion
- **Stories estimées** : Badge vert avec points
- **Stories non estimées** : Badge gris
- **Progression** : "Story X / Total" dans le header

### Export des Estimations
```json
{
  "stories": [
    {
      "title": "Login social OAuth",
      "estimate": 8,
      "estimatedBy": "Sébastien ROUEN",
      "estimatedAt": "2025-01-19T10:30:00.000Z"
    }
  ]
}
```

## Évolutions Futures

### Version 2.2
- 👥 **Mode multi-joueurs** : Estimation collaborative en temps réel
- 📊 **Statistiques d'estimation** : Analyse des patterns d'estimation
- 🎯 **Suggestions IA** : Recommandations basées sur l'historique
- 📱 **Mode mobile** : Interface optimisée pour smartphone

### Version 2.3
- 🔗 **Import JIRA** : Synchronisation directe des stories
- 📈 **Graphiques d'estimation** : Visualisation des tendances
- 🏆 **Gamification** : Points et badges pour les estimateurs
- 💬 **Commentaires** : Discussion sur les estimations

---

**Version** : 2.1.0  
**Dernière mise à jour** : 19 janvier 2025  
**Auteur** : Team Velocity Dashboard

**Bon poker planning ! 🎰🃏**
