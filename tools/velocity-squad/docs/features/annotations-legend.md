# Légende des Annotations

## 📋 Vue d'ensemble

La légende des annotations affiche un résumé visuel de tous les faits marquants enregistrés dans les sprints. Elle permet de visualiser rapidement les types d'événements et leur fréquence.

## 🎨 Fonctionnalités

### Affichage Automatique

La légende s'affiche automatiquement sous le titre du graphique de vélocité lorsque des annotations sont présentes dans les données.

### Types d'Annotations

| Type | Icône | Couleur | Description |
|------|-------|---------|-------------|
| **Équipe** | 👥 | Bleu (#2196F3) | Changements dans l'équipe (arrivée, départ) |
| **Congés** | 🏖️ | Orange (#FF9800) | Périodes de congés impactant la vélocité |
| **Incident** | 🚨 | Rouge (#F44336) | Incidents techniques ou blocages majeurs |
| **Process** | 🔧 | Violet (#9C27B0) | Changements de processus ou méthodologie |
| **Release** | 🚀 | Vert (#4CAF50) | Mises en production importantes |
| **Formation** | 🎓 | Cyan (#00BCD4) | Sessions de formation ou montée en compétences |

### Compteurs

Chaque type d'annotation affiche un badge avec le nombre total d'occurrences dans tous les sprints.

### Interactivité

- **Clic** : Affiche les détails de toutes les annotations du type sélectionné
- **Hover** : Affiche un tooltip avec les descriptions des annotations
- **Clavier** : Navigation avec Tab et activation avec Entrée/Espace

## 🔧 Implémentation Technique

### Structure HTML

```html
<div class="annotation-legend" role="list" aria-label="Légende des annotations">
  <span class="annotation-legend-item" 
        data-type="team" 
        style="color: #2196F3;"
        role="listitem"
        title="Descriptions des annotations"
        tabindex="0">
    👥 Équipe 
    <span class="annotation-count">3</span>
  </span>
  <!-- Autres types... -->
</div>
```

### CSS Variables Utilisées

- `--bg-secondary` : Fond de la légende
- `--bg-card` : Fond des items
- `--bg-tertiary` : Fond au hover
- `--border-color` : Couleur des bordures

### Méthodes JavaScript

#### `renderAnnotationLegend()`

Génère et affiche la légende dans le conteneur `.chart-header`.

**Logique :**
1. Supprime la légende existante si présente
2. Filtre les types d'annotations utilisés
3. Crée les éléments HTML avec compteurs
4. Ajoute les événements de clic et clavier

#### `showAnnotationDetails(type)`

Affiche les détails des annotations d'un type spécifique.

**Paramètres :**
- `type` (string) : Type d'annotation à afficher

**Comportement :**
- Filtre les annotations par type
- Récupère les noms de sprints associés
- Affiche une notification avec la liste complète

## 🎯 Accessibilité

### ARIA

- `role="list"` : Identifie la légende comme une liste
- `role="listitem"` : Identifie chaque item
- `aria-label` : Décrit le contenu de la légende
- `tabindex="0"` : Permet la navigation au clavier

### Navigation Clavier

- **Tab** : Naviguer entre les items
- **Entrée/Espace** : Activer l'item sélectionné
- **Focus visible** : Bordure bleue au focus

## 📱 Responsive

### Mobile (< 768px)

- Espacement réduit (0.5rem)
- Taille de police réduite (0.85rem)
- Padding ajusté pour optimiser l'espace

### Desktop

- Espacement confortable (1rem)
- Taille de police standard (0.9rem)
- Effets hover et animations fluides

## 🔄 Intégration

### Appel Automatique

La légende est automatiquement affichée lors du rendu du graphique de vélocité :

```javascript
// Dans ChartsRenderer.renderVelocityChart()
this.charts[canvasId] = new Chart(ctx, { /* config */ });
this.renderAnnotationLegend(); // ✅ Appel automatique
```

### Rafraîchissement

La légende est recréée à chaque rafraîchissement du graphique pour refléter les données actuelles.

## 💡 Bonnes Pratiques

### Ajout d'Annotations

Pour que la légende soit pertinente :
- Utilisez des descriptions claires et concises
- Choisissez le type approprié
- Associez l'annotation au bon sprint

### Performance

- La légende ne s'affiche que si des annotations existent
- Les événements sont attachés une seule fois
- Les calculs sont optimisés avec des filtres

## 🐛 Dépannage

### La légende ne s'affiche pas

**Causes possibles :**
1. Aucune annotation dans les données
2. Le conteneur `.chart-header` n'existe pas
3. Le graphique n'a pas été rendu

**Solutions :**
1. Vérifier `this.data.annotations.length > 0`
2. Vérifier la présence du conteneur dans le DOM
3. S'assurer que `renderVelocityChart()` est appelé

### Les clics ne fonctionnent pas

**Causes possibles :**
1. Les événements ne sont pas attachés
2. Conflit avec d'autres gestionnaires d'événements

**Solutions :**
1. Vérifier que `renderAnnotationLegend()` est complète
2. Utiliser `e.stopPropagation()` si nécessaire

## 📚 Références

- [Chart.js Plugins](https://www.chartjs.org/docs/latest/developers/plugins.html)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
