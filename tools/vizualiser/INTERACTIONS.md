# 🖱️ Guide des Interactions - Visualiseur Multi-Équipes

## Vue MindMap 🌳

### Clic sur les nœuds

#### Clic sur une équipe (niveau 1)

**Comportement** :
1. **Filtre automatique** : L'équipe cliquée devient le filtre actif
2. **Mise à jour de la vue** : Seuls les sujets de cette équipe sont affichés
3. **Dropdown synchronisé** : Le sélecteur d'équipe dans la sidebar se met à jour

**Exemple** :
```
Clic sur "🚀 Team Alpha"
→ Filtre : Team Alpha
→ Affichage : Seulement les sujets de Team Alpha
→ Sidebar : "Team Alpha" sélectionné
```

**Pour revenir à toutes les équipes** :
- Cliquer sur "🔄 Réinitialiser" dans la sidebar
- Ou sélectionner "Toutes les équipes" dans le dropdown

#### Clic sur un sujet (niveau 2+)

**Comportement** :
- **Plier/Déplier** : Affiche ou masque les détails du sujet
- **Navigation** : Permet de se concentrer sur un sujet spécifique

### Backgrounds colorés

Chaque branche d'équipe a un **background léger** pour faciliter la distinction :

| Équipe | Couleur de fond |
|--------|-----------------|
| 1ère équipe | Bleu clair (rgba(52, 152, 219, 0.05)) |
| 2ème équipe | Vert clair (rgba(46, 204, 113, 0.05)) |
| 3ème équipe | Violet clair (rgba(155, 89, 182, 0.05)) |
| 4ème équipe | Jaune clair (rgba(241, 196, 15, 0.05)) |
| 5ème équipe | Rouge clair (rgba(231, 76, 60, 0.05)) |

**Avantage** : Identification visuelle rapide des équipes, même avec beaucoup de sujets.

### Toolbar

#### Groupe Zoom 🔍
- **➕** : Zoom avant
- **➖** : Zoom arrière
- **📐** : Ajuster la vue (recentrage)

#### Groupe Arbre 📂
- **⬇️** : Tout déplier (afficher tous les détails)
- **⬆️** : Tout replier (vue compacte)

#### Groupe Vue 👁️
- **🌳** : Vue MindMap (hiérarchique)
- **🎯** : Vue Radar (criticité)

### Recentrage automatique

La MindMap se recentre automatiquement dans ces cas :
- ✅ Après le chargement d'une démo
- ✅ Après l'import de données
- ✅ Après l'application de filtres
- ✅ Après un clic sur une équipe

**Plus besoin de cliquer sur 📐 manuellement !**

---

## Vue Radar 🎯

### Survol (Hover)

**Comportement** :
- **Tooltip** : Affiche les détails du sujet
- **Opacité** : Le point devient légèrement transparent (0.8)
- **Pas de déplacement** : Le point reste fixe (pas de scale)

**Contenu du tooltip** :
```
🔴 Titre du sujet
Type: cross-team
Priorité: critical
Échéance: 2025-01-15
```

### Placement des points

Les points sont placés selon un **algorithme déterministe** :
- **Distance** : Basée sur la criticité (🔴 = bord, 🟢 = centre)
- **Angle** : Basé sur l'équipe + variation déterministe
- **Variation** : Hash du titre pour éviter les superpositions

**Avantage** : Position stable et prévisible, pas de superposition aléatoire.

### Labels automatiques

Les labels sont affichés **uniquement pour les sujets critiques** (🔴) :
- Limités à **15 caractères** pour éviter les débordements
- Positionnés au-dessus du point
- Non interactifs (pointer-events: none)

**Pourquoi seulement les critiques ?**
- Évite la surcharge visuelle
- Focus sur les points d'attention
- Meilleure lisibilité

### Taille des points

| Type | Rayon | Signification |
|------|-------|---------------|
| Cross-équipe | 10px | Sujet multi-équipes (plus visible) |
| Équipe | 8px | Sujet d'une seule équipe |
| Individuel | 8px | Sujet individuel |

### Légende

La légende est **toujours visible** en haut à droite :
- 🔴 Critique
- 🟠 Warning
- 🟢 OK
- ⚫ Neutre

---

## Filtres (Sidebar)

### Type de sujet

**Checkboxes** :
- 👥 Équipe
- 🔀 Cross-équipe
- 👤 Individuel

**Comportement** :
- Cocher/décocher pour filtrer
- Mise à jour en temps réel
- Recentrage automatique

### Statut d'alerte

**Checkboxes** :
- 🔴 Critique
- 🟠 Mitigé
- 🟢 OK
- ⚪ Neutre

**Comportement** :
- Filtrage instantané
- Combinable avec les autres filtres
- Recentrage automatique

### Équipe

**Dropdown** :
- Toutes les équipes (par défaut)
- Liste des équipes disponibles

**Comportement** :
- Sélection unique
- Synchronisé avec le clic sur une équipe dans la MindMap
- Recentrage automatique

### Bouton Réinitialiser 🔄

**Comportement** :
- Réactive tous les filtres
- Sélectionne "Toutes les équipes"
- Recentre la vue
- Retour à l'état initial

---

## Actions rapides ⚡

### Charger une démo

**Boutons disponibles** :
- 📦 Démo SAFe ART
- 📦 Démo Spotify
- 📦 Démo Simple

**Comportement** :
1. Charge les données YAML
2. Affiche la MindMap
3. **Recentre automatiquement** la vue
4. Met à jour les statistiques

**Plus besoin de cliquer sur 📐 !**

---

## Raccourcis clavier (à venir v1.1.0)

### Navigation
- `M` : Basculer en vue MindMap
- `R` : Basculer en vue Radar
- `F` : Focus sur la recherche
- `Esc` : Fermer les modales

### Zoom
- `+` : Zoom avant
- `-` : Zoom arrière
- `0` : Ajuster la vue

### Filtres
- `1` : Toggle filtre Équipe
- `2` : Toggle filtre Cross-équipe
- `3` : Toggle filtre Individuel
- `Ctrl+R` : Réinitialiser les filtres

---

## Bonnes pratiques

### ✅ Utilisation optimale

1. **Commencer par une vue d'ensemble**
   - Charger une démo
   - Observer la MindMap complète
   - Identifier les zones critiques

2. **Filtrer progressivement**
   - Cliquer sur une équipe pour focus
   - Utiliser les filtres de statut
   - Combiner les filtres

3. **Alterner les vues**
   - MindMap pour les détails
   - Radar pour la vue d'ensemble
   - Switch rapide avec les boutons

4. **Utiliser les tooltips**
   - Survoler pour les détails rapides
   - Pas besoin d'ouvrir les détails complets

### ❌ À éviter

1. **Ne pas zoomer excessivement**
   - Utiliser les filtres plutôt que le zoom
   - Préférer le focus sur une équipe

2. **Ne pas surcharger les filtres**
   - Commencer simple
   - Ajouter des filtres progressivement

3. **Ne pas ignorer le recentrage auto**
   - Laisser la vue se recentrer
   - Utiliser 📐 seulement si nécessaire

---

## Dépannage

### La MindMap ne se recentre pas

**Cause** : JavaScript désactivé ou erreur

**Solution** :
1. Vérifier la console (F12)
2. Recharger la page (Ctrl+F5)
3. Cliquer manuellement sur 📐

### Les filtres ne fonctionnent pas

**Cause** : Données non chargées

**Solution** :
1. Charger une démo
2. Vérifier que les données sont présentes
3. Réinitialiser les filtres (🔄)

### Les points radar se superposent

**Cause** : Trop de sujets sur une même équipe

**Solution** :
1. Filtrer par statut (garder seulement 🔴)
2. Utiliser la vue MindMap pour les détails
3. Diviser les sujets en plusieurs équipes

### Le clic sur une équipe ne filtre pas

**Cause** : Clic sur un sujet au lieu d'une équipe

**Solution** :
1. Cliquer sur le nom de l'équipe (niveau 1)
2. Vérifier que le dropdown se met à jour
3. Utiliser le dropdown directement si besoin

---

**Version** : 1.0.1  
**Auteur** : Sébastien ROUEN  
**License** : MIT
