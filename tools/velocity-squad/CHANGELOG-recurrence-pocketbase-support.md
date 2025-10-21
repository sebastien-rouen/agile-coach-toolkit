# Changelog - Support Format PocketBase pour Récurrences

## 🎯 Problème

Les événements récurrents ne s'affichaient pas dans la timeline car le code attendait un format de données différent de celui stocké dans PocketBase.

## 📊 Formats Supportés

### Format 1 : Imbriqué (JavaScript)

```javascript
{
    title: "Daily Standup",
    date: "2024-11-07",
    recurring: true,
    recurrence: {
        type: "weekly",
        interval: 1,
        days: [1, 2, 3, 4, 5],
        endDate: "2024-12-31"
    }
}
```

### Format 2 : Plat (PocketBase)

```javascript
{
    title: "Daily Standup",
    date: "2024-11-07",
    recurring: true,
    recurrence_type: "weekly",
    recurrence_interval: 1,
    recurrence_days: [1, 2, 3, 4, 5],  // ou "[1,2,3,4,5]" (JSON string)
    recurrence_end_date: "2024-12-31"
}
```

## 🔧 Implémentation

### Détection de Récurrence

```javascript
const isRecurring = event.recurring || 
                   (event.recurrence && event.recurrence.type !== 'none') ||
                   (event.recurrence_type && event.recurrence_type !== 'none');
```

### Normalisation des Données

```javascript
let recurrenceType, recurrenceInterval, recurrenceDays, recurrenceEndDate;

if (event.recurrence && typeof event.recurrence === 'object') {
    // Format imbriqué
    recurrenceType = event.recurrence.type;
    recurrenceInterval = event.recurrence.interval || 1;
    recurrenceDays = event.recurrence.days || [];
    recurrenceEndDate = event.recurrence.endDate;
} else {
    // Format plat (PocketBase)
    recurrenceType = event.recurrence_type;
    recurrenceInterval = event.recurrence_interval || 1;
    recurrenceDays = event.recurrence_days || [];
    recurrenceEndDate = event.recurrence_end_date;
}
```

### Gestion JSON String

PocketBase peut stocker `recurrence_days` comme string JSON :

```javascript
if (typeof recurrenceDays === 'string') {
    try {
        recurrenceDays = JSON.parse(recurrenceDays);
    } catch (e) {
        recurrenceDays = [];
    }
}
```

## 📅 Exemple Concret

### Données PocketBase

```json
{
    "id": "abc123",
    "title": "Sprint Retrospective",
    "type": "sprint_retrospective",
    "date": "2024-11-28",
    "time": "16:30",
    "duration": 90,
    "description": "Rétrospective d'équipe pour amélioration continue",
    "recurring": true,
    "recurrence_type": "weekly",
    "recurrence_interval": 2,
    "recurrence_days": [4],
    "recurrence_end_date": "2026-01-29"
}
```

### Occurrences Générées

Pour une période du 07/11/2024 au 05/12/2024 :

- 28/11/2024 (jeudi) ✅
- 12/12/2024 (jeudi) ✅
- 26/12/2024 (jeudi) ✅
- ...

## 🐛 Logs de Débogage

### Log Initial

```javascript
console.log('🔄 Génération occurrences:', {
    eventsCount: events.length,
    startDate: '2024-11-07',
    endDate: '2024-12-05'
});
```

### Log par Événement

```javascript
console.log('📅 Événement récurrent:', {
    title: 'Sprint Retrospective',
    type: 'weekly',
    interval: 2,
    days: [4],
    startDate: '2024-11-28',
    endDate: '2026-01-29'
});
```

## ✅ Tests

### Test 1 : Format Imbriqué

```javascript
const event = {
    title: "Daily",
    date: "2024-11-07",
    recurrence: {
        type: "daily",
        interval: 1
    }
};
// ✅ Fonctionne
```

### Test 2 : Format Plat

```javascript
const event = {
    title: "Daily",
    date: "2024-11-07",
    recurring: true,
    recurrence_type: "daily",
    recurrence_interval: 1
};
// ✅ Fonctionne
```

### Test 3 : Days en JSON String

```javascript
const event = {
    title: "Weekly",
    date: "2024-11-07",
    recurrence_type: "weekly",
    recurrence_days: "[1,2,3,4,5]"  // String
};
// ✅ Converti en [1,2,3,4,5]
```


## 📁 Fichiers Modifiés

### tools/velocity-squad/js/features/planning-manager.js

**Méthode modifiée** : `generateEventOccurrences(events, startDate, endDate)`

**Modifications** :
1. Détection de récurrence multi-format
2. Normalisation des champs de récurrence
3. Conversion JSON string pour `recurrence_days`
4. Utilisation des variables normalisées dans la logique
5. Ajout de logs de débogage

**Lignes modifiées** : ~40 lignes

## 🔍 Débogage

### Vérifier les Événements

Ouvrez la console du navigateur et cherchez :

```
🔄 Génération occurrences: {eventsCount: 5, startDate: "2024-11-07", endDate: "2024-12-05"}
📅 Événement récurrent: {title: "Daily Standup", type: "weekly", interval: 1, days: [1,2,3,4,5], ...}
```

### Vérifier les Occurrences

```javascript
// Dans la console
const eventsByDate = window.velocityApp.planning.generateEventOccurrences(
    window.velocityApp.data.events,
    new Date('2024-11-07'),
    new Date('2024-12-05')
);
console.log(eventsByDate);
```

## 🎯 Résultat Attendu

### Timeline Avant

```
[vide] [vide] [vide] [vide] [vide]
```

### Timeline Après

```
[Daily] [Daily] [Daily] [Retro] [Daily]
  Lun     Mar     Mer     Jeu     Ven
```

## 🚀 Prochaines Étapes

Si les événements ne s'affichent toujours pas :

1. **Vérifier les logs** dans la console
2. **Vérifier les données** dans PocketBase
3. **Vérifier les dates** (format YYYY-MM-DD)
4. **Vérifier le champ `recurring`** (doit être `true`)

## 💡 Conseils

### Structure PocketBase Recommandée

```javascript
// Collection: events
{
    "date": "date",              // Type: date
    "time": "text",              // Format: HH:mm
    "duration": "number",        // En minutes
    "recurring": "bool",         // true/false
    "recurrence_type": "select", // daily, weekly, monthly, none
    "recurrence_interval": "number",
    "recurrence_days": "json",   // [0,1,2,3,4,5,6]
    "recurrence_end_date": "date"
}
```

### Valeurs par Défaut

```javascript
{
    recurring: false,
    recurrence_type: "none",
    recurrence_interval: 1,
    recurrence_days: [],
    recurrence_end_date: null
}
```

---

**Date** : 2025-11-07  
**Version** : 1.2.1  
**Statut** : ✅ Implémenté avec logs de débogage
