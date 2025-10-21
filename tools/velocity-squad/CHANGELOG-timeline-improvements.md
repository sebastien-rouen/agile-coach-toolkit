# Changelog - Améliorations Timeline

## 🎯 Modifications

### 1. Légende en Colonne

**Avant** : Les items de la légende étaient affichés en ligne (flex-wrap)

**Après** :
- Chaque `timeline-legend-item` sur une ligne séparée
- `flex-direction: column` pour l'affichage vertical
- Espacement optimisé (0.5rem entre les items)
- Largeur 100% pour chaque item
- Effet hover : translation horizontale au lieu de verticale

**CSS Modifié** :
```css
.timeline-legend {
    display: flex;
    flex-direction: column;  /* ✨ NOUVEAU */
    gap: 0.5rem;
}

.timeline-legend-item {
    width: 100%;  /* ✨ NOUVEAU */
}

.timeline-legend-item:hover {
    transform: translateX(4px);  /* ✨ MODIFIÉ */
}
```

### 2. Timeline à partir d'Aujourd'hui

**Avant** : La timeline commençait à la première date d'événement

**Après** :
- La timeline commence toujours à partir d'aujourd'hui
- Minimum 4 semaines affichées (28 jours)
- Les événements passés ne sont plus affichés
- Focus sur les événements à venir

**JavaScript Modifié** :
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

// Date de début = aujourd'hui
const startDate = dates[0] < today ? today : dates[0];

// Date de fin = minimum 4 semaines
const minEndDate = new Date(today);
minEndDate.setDate(minEndDate.getDate() + 28);
const endDate = dates[dates.length - 1] > minEndDate 
    ? dates[dates.length - 1] 
    : minEndDate;
```

## 📁 Fichiers Modifiés

1. **tools/velocity-squad/css/modules/planning.css**
   - `.timeline-legend` : flex-direction column
   - `.timeline-legend-item` : width 100%, hover translateX
   - `.timeline-legend-separator` : width 100%, height 1px
   - `.timeline-legend-box` : taille augmentée (16px)

2. **tools/velocity-squad/js/features/planning-manager.js**
   - `renderPlanningTimeline()` : Calcul dates à partir d'aujourd'hui
   - Minimum 4 semaines affichées

## 🎨 Résultat Visuel

### Légende (Avant)
```
Types d'événements : [Sprint Planning] [Daily] [Backlog Refinement]
[Sprint Review] [Sprint Rétrospective] | [Aujourd'hui]
```

### Légende (Après)
```
Types d'événements :
🟦 Sprint Planning
🟨 Daily
🟧 Backlog Refinement
🟩 Sprint Review
🟪 Sprint Rétrospective
─────────────────
🟩 Aujourd'hui
```

## ✅ Bénéfices

1. **Meilleure Lisibilité** : Chaque type sur sa propre ligne
2. **Focus Futur** : Timeline centrée sur les événements à venir
3. **Cohérence** : Toujours 4 semaines minimum affichées
4. **UX Améliorée** : Effet hover plus intuitif (glissement horizontal)

---

**Date** : 2025-11-07  
**Version** : 1.1.1  
**Statut** : ✅ Complété
