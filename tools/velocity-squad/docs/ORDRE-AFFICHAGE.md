# 📊 Ordre d'Affichage des Sprints

## Vue d'ensemble

Depuis la version **3.4.1**, les sprints s'affichent dans l'**ordre chronologique** : du plus ancien (gauche) au plus récent (droite).

---

## 🎯 Principe

### Lecture Naturelle
```
┌─────────────────────────────────────────────────────────┐
│  Sprint 1  →  Sprint 2  →  Sprint 3  →  Sprint 4       │
│  (Ancien)                                  (Récent)     │
└─────────────────────────────────────────────────────────┘
```

Le temps progresse de **gauche à droite**, comme :
- Une timeline
- Un calendrier
- Une lecture de texte

---

## 🔧 Implémentation Technique

### Inversion des Données

Dans `renderChart()`, les données sont inversées avant affichage :

```javascript
// Inverser l'ordre : du plus ancien (gauche) au plus récent (droite)
const sprintsReversed = [...this.data.sprints].reverse();
const labels = sprintsReversed.map(s => s.name);
const velocities = sprintsReversed.map(s => s.velocity);
```

### Ajustement des Index

Pour les tooltips et annotations, l'index est recalculé :

```javascript
// Dans les callbacks de tooltip
const displayIndex = tooltipItems[0].dataIndex;
// Inverser l'index pour retrouver le sprint original
const sprintIndex = this.data.sprints.length - 1 - displayIndex;
const sprint = this.data.sprints[sprintIndex];
```

### Plugin d'Annotations

Le plugin dessine les icônes au bon endroit :

```javascript
// Dans annotationPlugin
const index = parseInt(sprintIndex);
const sprint = sprints[index];

// Inverser l'index pour l'affichage
const displayIndex = sprints.length - 1 - index;

const x = scales.x.getPixelForValue(displayIndex);
```

---

## ✅ Cohérence

### Toutes les Vues
L'ordre est **identique** sur les 3 vues :
- 📊 Vélocité
- 📉 Burndown
- 📈 Burnup

### Toutes les Interactions
Les interactions respectent l'ordre :
- **Tooltips** : Affichent les bonnes données
- **Annotations** : Positionnées correctement
- **Hover** : Détection au bon endroit
- **Clic** : Ouvre les bons détails

---

## 📝 Données Sauvegardées

### Aucun Impact
L'ordre d'affichage **n'affecte pas** les données sauvegardées :
- Les sprints restent dans leur ordre original en mémoire
- L'export JSON conserve l'ordre original
- L'import fonctionne normalement
- PocketBase n'est pas impacté

### Transparence
L'inversion est **uniquement visuelle** :
```javascript
// Données en mémoire (ordre original)
this.data.sprints = [Sprint 4, Sprint 3, Sprint 2, Sprint 1]

// Affichage (ordre inversé)
Graphique : [Sprint 1, Sprint 2, Sprint 3, Sprint 4]
```

---

## 🧪 Tests

### Vérification Manuelle

1. **Ouvrir l'application** avec plusieurs sprints
2. **Vérifier** que le sprint le plus ancien est à gauche
3. **Ajouter** un nouveau sprint : il doit apparaître à droite
4. **Changer de vue** : l'ordre doit rester identique

### Vérification Console

```javascript
// Afficher l'ordre original
console.log('Ordre original:', 
    window.velocityTool.data.sprints.map(s => s.name)
);

// Afficher l'ordre affiché
console.log('Ordre affiché:', 
    [...window.velocityTool.data.sprints].reverse().map(s => s.name)
);
```

### Fichiers de Test

- `tests/test-ordre-sprints.html` : Tests complets
- `tests/test-vues-scrum.html` : Tests des vues

---

## 💡 Avantages

### Lisibilité
- ✅ Lecture naturelle de gauche à droite
- ✅ Progression temporelle intuitive
- ✅ Cohérence avec les conventions

### Analyse
- ✅ Évolution visible dans le temps
- ✅ Tendances plus faciles à identifier
- ✅ Comparaison chronologique simplifiée

### Communication
- ✅ Présentation claire aux stakeholders
- ✅ Compréhension immédiate
- ✅ Pas de confusion sur l'ordre

---

## 🔄 Migration

### Pas d'Action Requise
Les utilisateurs existants n'ont **rien à faire** :
- Les données sont automatiquement affichées dans le bon ordre
- Aucune migration de données nécessaire
- Aucun impact sur les sessions sauvegardées

### Comportement Attendu
Après la mise à jour :
1. Les graphiques s'affichent dans le nouvel ordre
2. Les annotations restent au bon endroit
3. Les tooltips fonctionnent normalement
4. Aucune perte de données

---

## 📚 Références

- **CHANGELOG.md** : Version 3.4.1
- **VUES-SCRUM.md** : Documentation des vues
- **tests/test-ordre-sprints.html** : Tests de validation

---

**Version** : 3.4.1  
**Dernière mise à jour** : 2025-10-20
