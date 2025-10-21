# 📖 Guide de Migration - Velocity Squad v2.0

## 🎯 Objectif

Ce guide vous aide à migrer de l'ancienne version monolithique vers la nouvelle architecture modulaire ES6.

---

## 🔄 Changements Majeurs

### Architecture
- **Avant** : 1 fichier monolithique `script.js` (2500+ lignes)
- **Après** : 14 modules ES6 organisés (< 800 lignes chacun)

### Imports
- **Avant** : Scripts globaux dans `<script>` tags
- **Après** : Modules ES6 avec `import/export`

### Accès aux Fonctions
- **Avant** : Fonctions globales `window.addSprint()`
- **Après** : Méthodes de classe `velocityApp.sprints.addSprint()`

---

## 📝 Étapes de Migration

### 1. Sauvegarder les Données (IMPORTANT)

```javascript
// Dans la console du navigateur
const backup = localStorage.getItem('velocityTool_data');
console.log('Backup:', backup);
// Copier et sauvegarder dans un fichier texte
```

### 2. Mettre à Jour index.html

#### Remplacer les anciens scripts
```html
<!-- ❌ ANCIEN -->
<script src="js/script.js"></script>

<!-- ✅ NOUVEAU -->
<script type="module" src="js/app.js"></script>
```

#### Ajouter les conteneurs UI
```html
<!-- Conteneur de notifications -->
<div id="notificationsContainer"></div>

<!-- Les modales seront créées dynamiquement -->
```

### 3. Mettre à Jour les Appels de Fonctions

#### Sprints
```javascript
// ❌ ANCIEN
addSprint(sprintData);
updateSprint(index, updates);
deleteSprint(index);

// ✅ NOUVEAU
velocityApp.sprints.addSprint(sprintData);
velocityApp.sprints.updateSprint(index, updates);
velocityApp.sprints.deleteSprint(index);
```

#### Vélocité
```javascript
// ❌ ANCIEN
calculateVelocity();
getVelocityStats();

// ✅ NOUVEAU
velocityApp.velocity.calculateAverageVelocity();
velocityApp.velocity.getVelocityStats();
```

#### Graphiques
```javascript
// ❌ ANCIEN
renderVelocityChart();
renderTrendChart();

// ✅ NOUVEAU
velocityApp.charts.renderVelocityChart();
velocityApp.charts.renderTrendChart();
```

#### Notifications
```javascript
// ❌ ANCIEN
showNotification('Message', 'success');

// ✅ NOUVEAU
velocityApp.notifications.showSuccess('Message');
velocityApp.notifications.showError('Erreur');
velocityApp.notifications.showWarning('Attention');
velocityApp.notifications.showInfo('Information');
```

#### Modales
```javascript
// ❌ ANCIEN
if (confirm('Êtes-vous sûr ?')) {
    // Action
}

// ✅ NOUVEAU
const confirmed = await velocityApp.modals.confirm({
    title: 'Confirmation',
    message: 'Êtes-vous sûr ?'
});
if (confirmed) {
    // Action
}
```

### 4. Mettre à Jour les Event Listeners

#### Avant
```javascript
document.getElementById('addSprintBtn').addEventListener('click', () => {
    addSprint(getFormData());
});
```

#### Après
```javascript
document.getElementById('addSprintBtn').addEventListener('click', () => {
    const sprintData = getFormData();
    velocityApp.sprints.addSprint(sprintData);
    velocityApp.refresh();
});
```

---

## 🆕 Nouvelles Fonctionnalités

### Achievements
```javascript
// Vérifier les achievements
velocityApp.achievements.checkAchievements();

// Obtenir la progression
const progress = velocityApp.achievements.getProgress();
console.log(`${progress.unlocked}/${progress.total} achievements`);
```

### Annotations
```javascript
// Ajouter une annotation
velocityApp.annotations.addAnnotation({
    text: 'Excellent sprint !',
    sprintIndex: 2,
    color: '#10b981'
});

// Afficher le panneau
velocityApp.annotations.showPanel();
```

### User Stories
```javascript
// Ajouter une story
velocityApp.stories.addStory({
    title: 'Nouvelle fonctionnalité',
    points: 8,
    priority: 'high'
});

// Importer plusieurs stories
const storiesText = `
Story 1 [5] (high)
Story 2 [3] (medium)
Story 3 [8] (low)
`;
velocityApp.stories.addMultipleStories(storiesText);
```

### Planning Poker (Casino)
```javascript
// Démarrer une session
const stories = velocityApp.stories.getAllStories();
velocityApp.casino.startSession(stories);

// Sélectionner une estimation
velocityApp.casino.selectEstimate('8');

// Révéler les estimations
velocityApp.casino.revealEstimates();
```

### Templates
```javascript
// Charger un template
velocityApp.templates.loadTemplate('startup_mvp');

// Sauvegarder comme template
velocityApp.templates.saveAsTemplate(
    'Mon Template',
    'Description de mon template',
    'custom'
);
```

---

## 🔧 Utilitaires Disponibles

### DateUtils
```javascript
// Formater une date
DateUtils.formatDate('2024-01-15'); // "15/01/2024"

// Calculer la durée
DateUtils.calculateDuration('2024-01-01', '2024-01-14'); // 14

// Obtenir la date du jour
DateUtils.getCurrentDate(); // "2024-11-06"
```

### Formatters
```javascript
// Formater un nombre
Formatters.formatNumber(1234.56); // "1 234,56"

// Formater un pourcentage
Formatters.formatPercentage(0.856); // "85,6%"

// Formater une priorité
Formatters.formatPriority('high'); // "🔴 Haute"
```

### Validators
```javascript
// Valider un sprint
const validation = Validators.validateSprint(sprintData);
if (!validation.valid) {
    console.error('Erreurs:', validation.errors);
}

// Valider une story
const storyValidation = Validators.validateStory(storyData);
```

---

## 🎨 Personnalisation

### Thème
```javascript
// Le thème est géré automatiquement par tool-integration.js
// Basculer le thème
document.querySelector('.theme-toggle').click();
```

### Configuration
```javascript
// Modifier les paramètres
velocityApp.data.settings.sprintLength = 7;
velocityApp.data.settings.workingDays = 5;
velocityApp.data.settings.framework = 'kanban';
velocityApp.save();
```

---

## 🐛 Résolution de Problèmes

### Les modules ne se chargent pas
```html
<!-- Vérifier que le type="module" est présent -->
<script type="module" src="js/app.js"></script>

<!-- Vérifier la console pour les erreurs d'import -->
```

### Les données ne se sauvegardent pas
```javascript
// Vérifier que localStorage est disponible
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
// Vérifier que Chart.js est chargé
if (typeof Chart !== 'undefined') {
    console.log('Chart.js chargé');
    velocityApp.charts.renderVelocityChart();
} else {
    console.error('Chart.js non chargé');
}
```

### Erreur "Cannot read property of undefined"
```javascript
// Vérifier que l'application est initialisée
if (window.velocityApp) {
    console.log('Application initialisée');
} else {
    console.error('Application non initialisée');
}
```

---

## 📊 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+

### Fonctionnalités Requises
- ✅ ES6 Modules
- ✅ localStorage
- ✅ Promises / async-await
- ✅ Arrow functions
- ✅ Classes

---

## 🔄 Rollback (Retour en Arrière)

Si vous rencontrez des problèmes :

1. **Restaurer les données**
```javascript
localStorage.setItem('velocityTool_data', backupData);
location.reload();
```

2. **Revenir à l'ancienne version**
```bash
git checkout v1.0.0
```

3. **Contacter le support**
- GitHub Issues
- Email support

---

## ✅ Checklist de Migration

- [ ] Sauvegarder les données actuelles
- [ ] Mettre à jour index.html avec `type="module"`
- [ ] Remplacer les appels de fonctions globales
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier les graphiques
- [ ] Tester les notifications
- [ ] Tester les modales
- [ ] Vérifier la sauvegarde automatique
- [ ] Tester sur différents navigateurs
- [ ] Valider les performances

---

## 📞 Support

Besoin d'aide ?
- 📧 Email : rouen.sebastien@gmail.com
- 🐙 GitHub : https://github.com/sebastien-rouen/
- ☕ Support : https://buymeacoffee.com/sebastien.rouen

---

**Version** : 2.0.0  
**Date** : 6 novembre 2025  
**Auteur** : Sébastien ROUEN
