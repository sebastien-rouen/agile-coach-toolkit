# 📅 Mise à Jour - Calendrier des Événements

## ✨ Améliorations Visuelles

### Mise en Surbrillance des Événements

Les événements dans la section "Planning" sont maintenant affichés comme un calendrier avec mise en surbrillance selon leur date :

#### 🟢 Aujourd'hui (Surbrillance Forte)
- **Badge** : "📍 Aujourd'hui" (vert)
- **Background** : Gradient vert clair avec transparence
- **Border** : 5px à gauche
- **Shadow** : Ombre verte prononcée
- **Animation** : Pulsation subtile pour attirer l'attention

#### 🔵 Demain (Surbrillance Moyenne)
- **Badge** : "➡️ Demain" (bleu)
- **Background** : Gradient bleu clair avec transparence
- **Border** : 4px à gauche
- **Shadow** : Ombre bleue modérée
- **Pas d'animation** : Moins d'emphase qu'aujourd'hui

#### ⚪ Événements Futurs
- **Affichage** : Normal avec date complète
- **Format** : "📅 lun. 28 oct."

#### ⚫ Événements Passés
- **Opacité** : 60% (moins visible)
- **Filtre** : Grayscale 30% (légèrement grisé)

---

## 🎨 Aperçu Visuel

### Aujourd'hui
```
┌─────────────────────────────────────────────────────────┐
│ 🌅 Daily Standup        [📍 Aujourd'hui]               │
│ Daily Standup Équipe                                    │
│ 🕐 09:30  ⏱️ 15 min  🔄 Récurrent                      │
└─────────────────────────────────────────────────────────┘
  ↑ Background vert clair + animation pulsation
```

### Demain
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Sprint Planning      [➡️ Demain]                     │
│ Sprint 27.2 Planning                                    │
│ 🕐 10:00  ⏱️ 120 min                                    │
└─────────────────────────────────────────────────────────┘
  ↑ Background bleu clair (pas d'animation)
```

### Événement Futur
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Sprint Review                                        │
│ Sprint 27.1 Review                                      │
│ 📅 ven. 29 nov.  🕐 14:00  ⏱️ 60 min                   │
└─────────────────────────────────────────────────────────┘
  ↑ Background normal
```

### Événement Passé
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Sprint Retrospective                                 │
│ Sprint 26.5 Retro                                       │
│ 📅 jeu. 14 nov.  🕐 16:30  ⏱️ 90 min                   │
└─────────────────────────────────────────────────────────┘
  ↑ Opacité 60% + grayscale
```

---

## 🔧 Modifications Techniques

### Fichiers Modifiés

**1. JavaScript** : `tools/velocity-squad/js/script.js`

**Fonction** : `renderPlanningEvents()`

**Ajouts** :
- Calcul de la date d'aujourd'hui et demain
- Comparaison des dates des événements
- Classes CSS conditionnelles (`event-today`, `event-tomorrow`, `event-past`)
- Styles inline pour la mise en surbrillance
- Badges "Aujourd'hui" et "Demain" avec gradients

**Code clé** :
```javascript
// Date d'aujourd'hui et demain
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Déterminer si c'est aujourd'hui ou demain
const isToday = eventDate.getTime() === today.getTime();
const isTomorrow = eventDate.getTime() === tomorrow.getTime();
const isPast = eventDate < today;
```

---

**2. CSS** : `tools/velocity-squad/css/styles.css`

**Ajouts** :

```css
/* Événements aujourd'hui */
.planning-event.event-today {
    animation: pulseToday 2s ease-in-out infinite;
}

@keyframes pulseToday {
    0%, 100% {
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }
    50% {
        box-shadow: 0 4px 16px rgba(76, 175, 80, 0.5);
    }
}

/* Événements demain */
.planning-event.event-tomorrow:hover {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(100, 181, 246, 0.1));
    box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);
}

/* Événements passés */
.planning-event.event-past {
    filter: grayscale(30%);
}
```

---

## 🎯 Comportement

### Tri des Événements
Les événements sont triés par date et heure (du plus ancien au plus récent).

### Mise à Jour Automatique
La mise en surbrillance se met à jour automatiquement :
- À minuit, les événements "Demain" deviennent "Aujourd'hui"
- Les événements "Aujourd'hui" deviennent "Passés"
- Nécessite un rafraîchissement de la page

### Interaction
- **Hover** : Tous les événements ont un effet hover
- **Click** : Ouvre la modal d'édition de l'événement
- **Animation** : Seuls les événements d'aujourd'hui ont une animation pulsation

---

## 📊 Palette de Couleurs

### Aujourd'hui (Vert)
- **Primary** : `#4CAF50` (Material Green 500)
- **Secondary** : `#66BB6A` (Material Green 400)
- **Shadow** : `rgba(76, 175, 80, 0.3-0.5)`

### Demain (Bleu)
- **Primary** : `#2196F3` (Material Blue 500)
- **Secondary** : `#42A5F5` (Material Blue 400)
- **Shadow** : `rgba(33, 150, 243, 0.2-0.3)`

### Passé (Gris)
- **Opacity** : `0.6`
- **Grayscale** : `30%`

---

## ✅ Avantages

1. **Visibilité Immédiate** : Les événements du jour sont immédiatement identifiables
2. **Anticipation** : Les événements de demain sont mis en avant
3. **Contexte Temporel** : Distinction claire entre passé, présent et futur
4. **Attention Guidée** : L'animation attire l'œil sur les événements urgents
5. **UX Améliorée** : Interface plus intuitive et agréable

---

## 🧪 Tests Recommandés

- [ ] Créer un événement pour aujourd'hui → Vérifier badge vert + animation
- [ ] Créer un événement pour demain → Vérifier badge bleu
- [ ] Créer un événement futur → Vérifier affichage normal
- [ ] Vérifier un événement passé → Vérifier opacité réduite
- [ ] Tester le hover sur chaque type d'événement
- [ ] Vérifier le responsive (mobile/tablette)
- [ ] Tester à minuit (changement de jour)

---

## 🎉 Conclusion

La section "Planning" affiche maintenant les événements comme un véritable calendrier avec mise en surbrillance intelligente selon la date. Les événements d'aujourd'hui sont immédiatement visibles grâce à l'animation pulsation, et ceux de demain sont mis en avant avec une surbrillance bleue.

**Version** : 3.6.3  
**Date** : 27 octobre 2025  
**Statut** : ✅ Production Ready
