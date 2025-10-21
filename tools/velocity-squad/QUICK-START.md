# 🚀 Quick Start - Velocity Squad v2.0

## 📖 Guide de Démarrage Rapide

Bienvenue dans Velocity Squad v2.0 ! Ce guide vous aidera à démarrer en 5 minutes.

---

## 🎯 Étape 1 : Ouvrir l'Application

```bash
# Ouvrir dans le navigateur
open tools/velocity-squad/index.html

# Ou via un serveur local
npx http-server tools/velocity-squad -p 8080
```

**URL** : `http://localhost:8080` ou `file:///path/to/index.html`

---

## 📋 Étape 2 : Choisir un Template (Recommandé)

### Option A : Template Prédéfini

1. Cliquez sur **📋 Templates** dans la sidebar
2. Choisissez un template :
   - 🚀 **Startup MVP** : Sprints courts (7 jours)
   - 🏢 **Projet Entreprise** : Sprints longs (14 jours)
   - 📊 **Données de Démonstration** : Données complètes

3. Cliquez sur **Charger**
4. Confirmez l'action

✅ **Résultat** : Votre dashboard est pré-rempli avec des données réalistes !

### Option B : Démarrer de Zéro

1. Cliquez sur **➕ Nouveau Sprint**
2. Remplissez le formulaire :
   - Nom du sprint
   - Dates de début et fin
   - Points engagés
   - Objectif du sprint

3. Cliquez sur **Ajouter**

---

## 📊 Étape 3 : Explorer les Graphiques

### Graphique de Vélocité
- **Vue** : Barres (Engagé vs Complété)
- **Utilité** : Comparer l'engagement et la réalisation
- **Action** : Cliquez sur un sprint pour voir les détails

### Graphique de Tendance
- **Vue** : Ligne avec moyenne mobile
- **Utilité** : Identifier les tendances
- **Action** : Survolez pour voir les valeurs

### Graphique de Burndown
- **Vue** : Ligne (Idéal vs Réel)
- **Utilité** : Suivre l'avancement du sprint
- **Action** : Sélectionnez un sprint dans le menu

---

## 🏆 Étape 4 : Débloquer des Achievements

Les achievements se débloquent automatiquement :

```
🚀 Premier Sprint          → Créer votre premier sprint
⚡ Maître de la Vélocité   → Compléter 5 sprints
🎯 Équipe Consistante      → Maintenir une vélocité stable
🔥 Haute Vélocité          → Atteindre 50+ points
👥 Bâtisseur d'Équipe      → Avoir 5+ membres
```

**Voir la progression** : Cliquez sur **🏆 Achievements** dans la sidebar

---

## 📝 Étape 5 : Ajouter des Annotations

1. Cliquez sur un point du graphique
2. Saisissez votre annotation
3. Choisissez une couleur (optionnel)
4. Cliquez sur **Ajouter**

**Voir toutes les annotations** : Cliquez sur **📝 Annotations** dans la sidebar

---

## 📚 Étape 6 : Gérer les User Stories

### Ajouter une Story

1. Cliquez sur **📚 Stories** dans la sidebar
2. Remplissez le formulaire :
   - Titre de la story
   - Description
   - Points
   - Priorité (Haute, Moyenne, Basse)

3. Cliquez sur **Ajouter**

### Import Multiple

1. Cliquez sur l'onglet **Import Multiple**
2. Saisissez vos stories au format :
   ```
   Story 1 [5] (high)
   Story 2 [3] (medium)
   Story 3 [8] (low)
   ```

3. Cliquez sur **Importer**

---

## 🎰 Étape 7 : Utiliser le Planning Poker

1. Cliquez sur **🎰 Casino** dans la sidebar
2. Cliquez sur **Démarrer une session**
3. Sélectionnez les stories à estimer
4. Cliquez sur une carte Fibonacci pour estimer
5. Cliquez sur **Révéler** pour voir le consensus

---

## 💾 Étape 8 : Sauvegarder et Exporter

### Sauvegarde Automatique
- ✅ Sauvegarde automatique toutes les 30 secondes
- ✅ Sauvegarde avant fermeture de l'application
- ✅ Données stockées dans localStorage

### Export Manuel

1. Cliquez sur **⚙️ Paramètres**
2. Cliquez sur **Exporter les données**
3. Copiez le JSON ou téléchargez le fichier

### Import

1. Cliquez sur **⚙️ Paramètres**
2. Cliquez sur **Importer les données**
3. Collez le JSON ou sélectionnez un fichier
4. Confirmez l'import

---

## 🎨 Étape 9 : Personnaliser le Thème

1. Cliquez sur l'icône **🌙/☀️** en haut à droite
2. Le thème bascule entre Dark et Light
3. Le choix est sauvegardé automatiquement

---

## 🔧 Étape 10 : Configurer les Paramètres

1. Cliquez sur **⚙️ Paramètres**
2. Modifiez :
   - Framework (Scrum / Kanban)
   - Durée des sprints (jours)
   - Jours travaillés par sprint
   - Nom d'utilisateur
   - Heure du daily

3. Cliquez sur **Sauvegarder**

---

## 📖 Ressources Utiles

### Documentation
- [`README.md`](README.md) : Guide complet
- [`ARCHITECTURE.md`](ARCHITECTURE.md) : Architecture détaillée
- [`MIGRATION-GUIDE.md`](MIGRATION-GUIDE.md) : Migration v1 → v2

### Guides Avancés
- [`REFACTORING-COMPLETE.md`](REFACTORING-COMPLETE.md) : Refactoring complet
- [`SUCCESS-SUMMARY.md`](SUCCESS-SUMMARY.md) : Résumé des accomplissements
- [`FILES-CREATED.md`](FILES-CREATED.md) : Liste des fichiers

### Support
- 📧 Email : rouen.sebastien@gmail.com
- 🐙 GitHub : https://github.com/sebastien-rouen/
- ☕ Support : https://buymeacoffee.com/sebastien.rouen

---

## 🎯 Cas d'Usage Courants

### Scrum Master
```
1. Créer un nouveau sprint
2. Ajouter les user stories
3. Utiliser le Planning Poker pour estimer
4. Suivre le burndown quotidiennement
5. Ajouter des annotations pour les événements
6. Analyser la vélocité en fin de sprint
```

### Product Owner
```
1. Gérer le backlog de stories
2. Prioriser les stories (Haute, Moyenne, Basse)
3. Suivre l'avancement des sprints
4. Analyser les tendances de vélocité
5. Exporter les rapports
```

### Équipe de Développement
```
1. Consulter les objectifs du sprint
2. Participer au Planning Poker
3. Mettre à jour les points complétés
4. Suivre le burndown
5. Célébrer les achievements débloqués
```

### Coach Agile
```
1. Analyser les métriques de vélocité
2. Identifier les tendances
3. Détecter les anomalies
4. Recommander des améliorations
5. Comparer plusieurs équipes (templates)
```

---

## 🐛 Résolution de Problèmes

### Les données ne se sauvegardent pas
```javascript
// Vérifier localStorage
if (typeof(Storage) !== "undefined") {
    console.log('localStorage disponible');
} else {
    console.error('localStorage non disponible');
}

// Forcer la sauvegarde
velocityApp.save();
```

### Les graphiques ne s'affichent pas
```javascript
// Vérifier Chart.js
if (typeof Chart !== 'undefined') {
    console.log('Chart.js chargé');
} else {
    console.error('Chart.js non chargé');
}

// Recharger les graphiques
velocityApp.charts.renderVelocityChart();
```

### Erreur "Cannot read property of undefined"
```javascript
// Vérifier l'initialisation
if (window.velocityApp) {
    console.log('Application initialisée');
} else {
    console.error('Application non initialisée');
    // Recharger la page
    location.reload();
}
```

---

## ✅ Checklist de Démarrage

- [ ] Ouvrir l'application
- [ ] Choisir un template ou créer un sprint
- [ ] Explorer les graphiques
- [ ] Ajouter une annotation
- [ ] Créer une user story
- [ ] Essayer le Planning Poker
- [ ] Personnaliser le thème
- [ ] Configurer les paramètres
- [ ] Exporter les données (backup)
- [ ] Débloquer un achievement

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser Velocity Squad v2.0 !

**Prochaines étapes** :
1. Explorer toutes les fonctionnalités
2. Personnaliser selon vos besoins
3. Partager avec votre équipe
4. Donner votre feedback

---

**Version** : 2.0.0  
**Date** : 6 novembre 2025  
**Auteur** : Sébastien ROUEN  
**License** : MIT

🚀 **Bon sprint !** 🚀
