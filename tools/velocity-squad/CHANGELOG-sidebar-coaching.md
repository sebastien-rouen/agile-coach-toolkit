# Changelog - Sidebar pour Événements + Coaching Insights

## 🎯 Modifications

### 1. Affichage des Événements du Jour dans la Sidebar

**Avant** : Les détails des événements s'affichaient en notification en bas de l'écran

**Après** : Les détails s'affichent dans la sidebar latérale

**Bénéfices** :
- Meilleure visibilité des informations
- Plus d'espace pour afficher les détails
- Cohérence avec l'affichage des annotations
- Fermeture intuitive (3 méthodes)

### 2. Intégration des Conseils de Coaching

**Nouveau** : Module `CoachingManager` pour les insights intelligents

**Fonctionnalités** :
- Détection de vélocité en baisse
- Détection de vélocité instable
- Détection du bus factor (compétences critiques)
- Détection d'anomalies statistiques
- Regroupement intelligent des alertes

## 📁 Fichiers Créés/Modifiés

### Créés

1. **tools/velocity-squad/js/features/coaching-manager.js**
   - Nouvelle classe `CoachingManager`
   - Méthodes d'analyse intelligente
   - Génération d'alertes contextuelles
   - ~200 lignes

### Modifiés

1. **tools/velocity-squad/js/features/planning-manager.js**
   - Ajout méthode `showInSidebar()`
   - Modification `showDayEventsDetails()` : Utilise sidebar
   - Affichage description et durée des événements
   - ~40 lignes modifiées

2. **tools/velocity-squad/js/app.js**
   - Import de `CoachingManager`
   - Instanciation dans le constructeur
   - Appel dans `refresh()`
   - Mise à jour data dans `renderAll()`
   - ~10 lignes ajoutées

## 💻 Implémentation

### Sidebar pour Événements

```javascript
showDayEventsDetails(date, dayEvents) {
    // Formater les événements
    const details = dayEvents.map(event => `
        <li>
            <div>${icon} ${event.title} ${event.time}</div>
            ${event.description}
            ${event.duration} min
        </li>
    `).join('');
    
    // Afficher dans la sidebar
    this.showInSidebar(
        `📅 ${formattedDate}`,
        '#2196F3',
        dayEvents.length,
        details
    );
}
```

### Coaching Insights

```javascript
// Dans app.js
this.coaching = new CoachingManager(this.data, this.notifications);

// Dans refresh()
this.coaching.showCoachingInsights();
```

## 🎨 Types d'Alertes de Coaching

### 1. Vélocité en Baisse
```
📉 Vélocité en baisse constante sur les 3 derniers sprints
💡 Conseil : Organisez une rétrospective pour identifier les blocages
```

### 2. Vélocité Instable
```
📊 Vélocité instable détectée
💡 Conseil : Revoyez votre estimation et votre définition of Done
```

### 3. Bus Factor Critique
```
🚌 Bus factor critique détecté sur 2 compétences
Compétences à risque : React, DevOps
💡 Conseil : Organisez du pair programming pour partager ces compétences
```

### 4. Anomalie Détectée
```
⚠️ Anomalie détectée sur Sprint 5
Vélocité exceptionnellement haute (85 points)
```

## 🔍 Algorithmes de Détection

### Vélocité en Baisse

```javascript
const isDecreasing = 
    lastVelocities[0] > lastVelocities[1] && 
    lastVelocities[1] > lastVelocities[2];
```

### Vélocité Instable

```javascript
const stdDev = calculateStdDev(velocities);
const isUnstable = stdDev > avgVelocity * 0.3;
```

### Bus Factor

```javascript
// Compter les membres par compétence
const skillsMap = {};
team.forEach(member => {
    member.skills.forEach(skill => {
        skillsMap[skill].push(member.name);
    });
});

// Alerter si 1 seule personne
if (skillsMap[skill].length === 1) {
    alert('Bus factor critique');
}
```

### Anomalie (Z-Score)

```javascript
const zScore = Math.abs((velocity - avg) / stdDev);
if (zScore > 2) {
    alert('Anomalie détectée');
}
```
