# 🎯 Vue Radar - Guide d'utilisation

## Qu'est-ce que la vue Radar ?

La **vue Radar** est une visualisation inspirée du **Stakeholder Mapping** qui permet d'identifier rapidement les sujets critiques et leur répartition par équipe.

## 📊 Comment ça fonctionne ?

### Structure

```
        Équipe A
           |
           |
Équipe D --+-- Équipe B
           |
           |
        Équipe C
```

- **Centre** : Sujets neutres ou dans les temps
- **Bord extérieur** : Sujets critiques nécessitant attention
- **Axes** : Un axe par équipe

### Placement des sujets

Les sujets sont placés selon leur **criticité** :

| Distance | Statut | Signification |
|----------|--------|---------------|
| 90% du rayon | 🔴 Critique | Échéance dépassée ou bloqué |
| 65% du rayon | 🟠 Warning | Échéance < 7 jours |
| 35% du rayon | 🟢 OK | Dans les temps |
| 15% du rayon | ⚪ Neutre | Pas d'échéance |

### Codes couleurs

- 🔴 **Rouge** : Critique (action immédiate requise)
- 🟠 **Orange** : À surveiller (attention nécessaire)
- 🟢 **Vert** : Dans les temps (tout va bien)
- ⚫ **Gris** : Neutre (pas d'échéance définie)

### Taille des points

- **Grand cercle** (10px) : Sujet cross-équipe
- **Petit cercle** (8px) : Sujet d'équipe ou individuel

## 🎓 Cas d'usage

### 1. PI Planning (SAFe)

**Contexte** : 80 personnes, 4 équipes, 14 features

**Utilisation** :
1. Charger la démo SAFe ART
2. Basculer en vue Radar (🎯)
3. Identifier visuellement les features critiques (bord extérieur)
4. Repérer les équipes surchargées (axes avec beaucoup de points)

**Avantage** : Vue d'ensemble instantanée pour le RTE

### 2. Scrum of Scrums

**Contexte** : Daily multi-équipes

**Utilisation** :
1. Afficher la vue Radar
2. Focus sur les points rouges (critiques)
3. Identifier les dépendances bloquantes

**Avantage** : Priorisation rapide des discussions

### 3. Reporting Management

**Contexte** : Point hebdomadaire avec le CTO

**Utilisation** :
1. Vue Radar pour montrer la répartition
2. Capture d'écran pour le rapport
3. Explication visuelle de la charge par équipe

**Avantage** : Communication claire et visuelle

## 🔍 Interactivité

### Survol (Hover)

Au survol d'un point, un **tooltip** s'affiche avec :
- 🎯 Titre du sujet
- 📋 Type (équipe, cross-équipe, individuel)
- 🔥 Priorité
- 📅 Échéance

### Labels automatiques

Les labels sont affichés automatiquement pour :
- ✅ Tous les sujets **critiques** (🔴)
- ✅ Tous les sujets **cross-équipe** (peu importe le statut)

Cela permet d'identifier rapidement les points d'attention.

## 🎨 Personnalisation

### Modifier les distances

Éditer `assets/js/radar-renderer.js` :

```javascript
getDistanceFromStatus(status, maxRadius) {
  const distances = {
    'danger': maxRadius * 0.9,   // Modifier ici
    'warning': maxRadius * 0.65, // Modifier ici
    'success': maxRadius * 0.35, // Modifier ici
    'neutral': maxRadius * 0.15  // Modifier ici
  };
  return distances[status] || maxRadius * 0.5;
}
```

### Modifier les couleurs

Éditer `assets/js/radar-renderer.js` :

```javascript
getColorFromStatus(status) {
  const colors = {
    'danger': '#dc3545',   // Rouge
    'warning': '#fd7e14',  // Orange
    'success': '#28a745',  // Vert
    'neutral': '#6c757d'   // Gris
  };
  return colors[status] || '#6c757d';
}
```

## 💡 Conseils d'utilisation

### ✅ Bonnes pratiques

1. **Utiliser en complément de la MindMap**
   - MindMap pour la structure hiérarchique
   - Radar pour la vue d'ensemble et la criticité

2. **Projeter en réunion**
   - Vue Radar pour le kick-off
   - Identifier les zones à risque
   - Faciliter les discussions

3. **Exporter pour le reporting**
   - Capture d'écran de la vue Radar
   - Ajouter dans les slides de présentation
   - Partager avec les stakeholders

### ❌ À éviter

1. **Trop de sujets** (> 50)
   - La vue devient illisible
   - Préférer filtrer par équipe

2. **Pas d'échéances**
   - Tous les sujets au centre (neutre)
   - Perte de l'intérêt de la vue

3. **Utiliser seule**
   - Toujours combiner avec la MindMap
   - La Radar est un complément, pas un remplacement

## 🔄 Basculer entre les vues

### Via la toolbar

Cliquer sur les boutons dans le groupe "👁️ Vue" :
- 🌳 **MindMap** : Vue arborescente hiérarchique
- 🎯 **Radar** : Vue radar de criticité

### Raccourcis clavier (à venir v1.1.0)

- `M` : Basculer en vue MindMap
- `R` : Basculer en vue Radar

## 📊 Comparaison des vues

| Critère | MindMap 🌳 | Radar 🎯 |
|---------|-----------|---------|
| **Structure** | Hiérarchique | Radiale |
| **Focus** | Organisation | Criticité |
| **Détails** | Complets | Synthétiques |
| **Idéal pour** | Exploration | Vue d'ensemble |
| **Cas d'usage** | PI Planning détaillé | Scrum of Scrums |
| **Lisibilité** | Bonne jusqu'à 100 sujets | Bonne jusqu'à 50 sujets |

## 🎯 Exemple d'interprétation

### Radar équilibré ✅

```
Tous les axes ont des points répartis uniformément
Majorité de points verts (centre)
Peu de points rouges (bord)
```

**Interprétation** : Charge équilibrée, peu de risques

### Radar déséquilibré ⚠️

```
Un axe surchargé (beaucoup de points)
Autres axes vides
Points concentrés au bord (rouges)
```

**Interprétation** : Équipe surchargée, risques élevés

### Radar critique 🔴

```
Majorité de points rouges au bord
Peu de points au centre
Plusieurs axes surchargés
```

**Interprétation** : Situation critique, action immédiate requise

## 🔗 Références

- **Stakeholder Mapping** : Technique d'origine
- **Radar Chart** : Type de visualisation
- **SAFe PI Planning** : Contexte d'utilisation

---

**Version** : 1.0.1  
**Auteur** : Sébastien ROUEN  
**License** : MIT
