# Guide des Classes Utilitaires CSS

## 🎨 Gradients

### Gradients de fond
```css
.gradient-light       /* Gris clair → Blanc */
.gradient-blue        /* Bleu → Bleu foncé */
.gradient-red         /* Rouge → Rouge foncé */
.gradient-cyan        /* Cyan → Cyan foncé */
.gradient-orange      /* Orange clair → Blanc */
.gradient-blue-light  /* Bleu clair → Blanc */
.gradient-teal-light  /* Teal transparent → Cyan transparent */
```

### Exemple d'utilisation
```html
<div class="gradient-light">
  Contenu avec fond dégradé gris clair
</div>
```

## 🔘 Boutons

### Bouton de suppression
```css
.btn-remove  /* Bouton rouge avec hover et animation */
```

### Exemple d'utilisation
```html
<button class="btn-remove" onclick="deleteItem()">
  🗑️ Supprimer
</button>
```

**Styles appliqués** :
- Fond rouge (`--color-red`)
- Hover : Rouge foncé + scale(1.05)
- Padding : 0.5rem 0.75rem
- Border-radius : 6px

## 📝 Formulaires

### Input texte
```css
.form-input  /* Input avec focus bleu et validation */
```

### Select
```css
.form-select  /* Select avec style cohérent */
```

### Exemple d'utilisation
```html
<input type="text" class="form-input" placeholder="Nom de l'objectif">
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

**Styles appliqués** :
- Flex : 1 (prend tout l'espace disponible)
- Padding : 0.5rem
- Border : 1px solid `--border-medium`
- Focus : Border bleue + shadow

## 🎭 Animations

### FadeIn
```css
@keyframes fadeIn  /* Apparition en fondu avec translation */
```

### Exemple d'utilisation
```css
.mon-element {
  animation: fadeIn 0.3s ease;
}
```

**Effet** :
- Opacité : 0 → 1
- Translation : -10px → 0

## 🎨 Variables de Couleurs

### Couleurs principales
```css
--color-teal: #009688;        /* Vert-bleu (SAFe) */
--color-teal-dark: #00796B;   /* Vert-bleu foncé */
--color-blue: #2196F3;        /* Bleu (actions) */
--color-blue-dark: #1976D2;   /* Bleu foncé */
--color-red: #F44336;         /* Rouge (danger) */
--color-red-dark: #D32F2F;    /* Rouge foncé */
--color-orange: #FF9800;      /* Orange (warning) */
--color-cyan: #00BCD4;        /* Cyan (info) */
--color-cyan-dark: #0097A7;   /* Cyan foncé */
```

### Bordures
```css
--border-light: #e9ecef;      /* Bordure claire */
--border-medium: #dee2e6;     /* Bordure moyenne */
```

### Exemple d'utilisation
```css
.mon-element {
  color: var(--color-teal);
  border: 1px solid var(--border-light);
}
```

## 📦 Combinaisons Recommandées

### Card avec gradient et bordure colorée
```html
<div class="gradient-light" style="border-left: 4px solid var(--color-blue);">
  <input type="text" class="form-input" placeholder="Titre">
  <button class="btn-remove">Supprimer</button>
</div>
```

### Liste d'items avec animation
```html
<div class="objectives-list">
  <div class="objective-item gradient-light" style="animation: fadeIn 0.3s ease;">
    <input type="text" class="form-input">
    <button class="btn-remove">🗑️</button>
  </div>
</div>
```

## 🚀 Bonnes Pratiques

### ✅ À faire
- Utiliser les classes utilitaires pour éviter la duplication
- Combiner les classes pour créer des composants
- Utiliser les variables CSS pour les couleurs
- Préférer les classes aux styles inline

### ❌ À éviter
- Créer de nouvelles classes pour des styles déjà existants
- Hardcoder les couleurs (utiliser les variables)
- Dupliquer les styles de boutons/inputs
- Ignorer les classes utilitaires disponibles

## 📚 Référence Rapide

| Besoin | Classe | Variable |
|--------|--------|----------|
| Fond dégradé gris | `.gradient-light` | - |
| Fond dégradé bleu | `.gradient-blue` | - |
| Bouton supprimer | `.btn-remove` | `--color-red` |
| Input texte | `.form-input` | `--border-medium` |
| Select | `.form-select` | `--border-medium` |
| Animation apparition | - | `fadeIn` |
| Couleur teal | - | `--color-teal` |
| Bordure claire | - | `--border-light` |

## 🔄 Mise à Jour

Ce guide est mis à jour à chaque ajout de classe utilitaire.
Dernière mise à jour : 6 novembre 2025
