# Gestion des Récurrences d'Événements

## 🎯 Vue d'ensemble

Le système de récurrence permet de créer des événements qui se répètent automatiquement selon une fréquence définie (quotidienne, hebdomadaire, mensuelle).

## 📋 Types de Récurrence

### 1. Aucune (none)
- Événement unique à une date spécifique
- Pas de répétition

### 2. Quotidienne (daily)
- L'événement se répète tous les jours
- Paramètre `interval` : Répéter tous les X jours
- Exemple : Daily Standup tous les jours ouvrés

### 3. Hebdomadaire (weekly)
- L'événement se répète chaque semaine
- Paramètre `interval` : Répéter toutes les X semaines
- Paramètre `days` : Jours de la semaine (0=Dimanche, 1=Lundi, ..., 6=Samedi)
- Exemple : Sprint Planning tous les lundis

### 4. Mensuelle (monthly)
- L'événement se répète chaque mois
- Paramètre `interval` : Répéter tous les X mois
- Même jour du mois que la date initiale
- Exemple : Réunion mensuelle le 1er de chaque mois

## 🔧 Structure de Données

```javascript
{
    id: "event-123",
    title: "Daily Standup",
    type: "daily",
    date: "2024-11-07",  // Date de début
    time: "09:00",
    duration: 15,
    recurrence: {
        type: "daily",      // none, daily, weekly, monthly
        interval: 1,        // Répéter tous les X jours/semaines/mois
        days: [1,2,3,4,5], // Pour weekly : jours de la semaine
        endDate: "2024-12-31" // Date de fin (optionnel)
    }
}
```

## 💻 Implémentation

### Méthode generateEventOccurrences()

Cette méthode génère toutes les occurrences d'événements dans une plage de dates :

```javascript
generateEventOccurrences(events, startDate, endDate) {
    const eventsByDate = {};
    
    events.forEach(event => {
        // Événement non récurrent
        if (!event.recurrence || event.recurrence.type === 'none') {
            eventsByDate[event.date] = [event];
            return;
        }
        
        // Événement récurrent
        let currentDate = new Date(event.date);
        while (currentDate <= endDate) {
            // Vérifier critères de récurrence
            // Ajouter l'événement à la date
            // Incrémenter selon le type
        }
    });
    
    return eventsByDate;
}
```


### Logique de Génération

#### Daily (Quotidien)
```javascript
if (recurrence.type === 'daily') {
    shouldInclude = true;
    currentDate.setDate(currentDate.getDate() + interval);
}
```

#### Weekly (Hebdomadaire)
```javascript
if (recurrence.type === 'weekly') {
    const dayOfWeek = currentDate.getDay();
    if (recurrence.days && recurrence.days.length > 0) {
        shouldInclude = recurrence.days.includes(dayOfWeek);
    } else {
        shouldInclude = dayOfWeek === eventDate.getDay();
    }
    currentDate.setDate(currentDate.getDate() + (7 * interval));
}
```

#### Monthly (Mensuel)
```javascript
if (recurrence.type === 'monthly') {
    shouldInclude = currentDate.getDate() === eventDate.getDate();
    currentDate.setMonth(currentDate.getMonth() + interval);
}
```

## 📅 Exemples d'Utilisation

### Daily Standup (Lundi-Vendredi)
```javascript
{
    title: "Daily Standup",
    type: "daily",
    date: "2024-11-07",
    time: "09:00",
    duration: 15,
    recurrence: {
        type: "weekly",
        interval: 1,
        days: [1, 2, 3, 4, 5], // Lun-Ven
        endDate: null
    }
}
```

### Sprint Planning (Tous les 2 lundis)
```javascript
{
    title: "Sprint Planning",
    type: "sprint_planning",
    date: "2024-11-11",
    time: "09:30",
    duration: 120,
    recurrence: {
        type: "weekly",
        interval: 2,
        days: [1], // Lundi
        endDate: "2024-12-31"
    }
}
```

### Réunion Mensuelle
```javascript
{
    title: "Réunion Mensuelle",
    type: "meeting",
    date: "2024-11-01",
    time: "14:00",
    duration: 60,
    recurrence: {
        type: "monthly",
        interval: 1,
        endDate: null
    }
}
```

## 🎨 Affichage dans la Timeline

### Génération des Jours
```javascript
generateTimelineDays(startDate, endDate, events) {
    // 1. Générer toutes les occurrences
    const eventsByDate = this.generateEventOccurrences(events, startDate, endDate);
    
    // 2. Pour chaque jour de la timeline
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEvents = eventsByDate[dateStr] || [];
        
        // 3. Appliquer les couleurs selon les événements
        if (dayEvents.length > 0) {
            // Colorier le jour
        }
    }
}
```

### Couleurs par Type
- Les jours avec événements sont colorés selon le type
- Les jours avec plusieurs événements affichent un gradient
- Le jour actuel a une bordure verte spéciale

## 🔄 Mise à Jour Automatique

### renderPlanningEvents()
- Génère les occurrences pour les 4 prochaines semaines
- Filtre uniquement les dates futures
- Affiche les événements groupés par date

### renderPlanningTimeline()
- Commence à partir d'aujourd'hui
- Affiche minimum 4 semaines
- Génère toutes les occurrences récurrentes

## 🐛 Cas Particuliers

### Événement sans Date de Fin
- Continue indéfiniment jusqu'à `endDate` de la timeline
- Recommandé : Définir une date de fin pour les récurrences

### Jours Fériés
- Non gérés automatiquement
- Possibilité d'ajouter une liste de jours exclus

### Changement d'Heure
- Les événements conservent leur heure locale
- Pas d'ajustement automatique pour l'heure d'été/hiver

## 📊 Performance

### Optimisations
- Génération des occurrences une seule fois par rendu
- Cache des événements par date
- Limite de 4 semaines pour éviter trop de calculs

### Complexité
- O(n × d) où n = nombre d'événements, d = nombre de jours
- Acceptable pour des périodes de 4-8 semaines

## 🚀 Améliorations Futures

- [ ] Support des jours fériés
- [ ] Exceptions pour dates spécifiques
- [ ] Récurrence personnalisée (ex: 1er lundi du mois)
- [ ] Import/Export iCal avec récurrences
- [ ] Synchronisation avec calendriers externes

---

**Date** : 2025-11-07  
**Version** : 1.2.0  
**Statut** : ✅ Implémenté
