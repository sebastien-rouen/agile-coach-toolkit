# Refactoring CSS - Séparation des préoccupations

## 🎯 Objectif

Déplacer les styles CSS du JavaScript vers les fichiers CSS appropriés selon les bonnes pratiques de développement.

## ✅ Modifications effectuées

### **1. Images avec légendes**
- **Avant** : Styles appliqués via JavaScript dans `styleImagesWithCaptions()`
- **Après** : Styles dans `assets/css/markdown.css`
- **Classes CSS** : `.image-with-caption`, `.image-with-caption img`, `.image-with-caption figcaption`

### **2. Boutons de copie des blocs de code**
- **Avant** : Styles inline appliqués via JavaScript dans `addCopyButtonsToCodeBlocks()`
- **Après** : Styles dans `assets/css/markdown.css`
- **Classes CSS** : `.copy-button` avec états hover/active et support thème sombre

## 📁 Fichiers modifiés

### `assets/css/markdown.css`
```css
/* Images avec légendes */
.markdown-content figure.image-with-caption { ... }

/* Boutons de copie */
.markdown-content .copy-button { ... }
```

### `assets/js/markdown-parser.js`
- Suppression des styles inline
- Conservation de la logique JavaScript uniquement
- Fonctions simplifiées et plus maintenables

## 🎨 Avantages

1. **Séparation des préoccupations** : CSS dans les fichiers CSS, JS pour la logique
2. **Maintenabilité** : Styles centralisés et faciles à modifier
3. **Performance** : Pas de manipulation DOM pour les styles
4. **Cohérence** : Utilisation des variables CSS du thème
5. **Thème sombre** : Support automatique via les variables CSS

## 🔧 Variables CSS utilisées

- `--space-*` : Espacements
- `--radius-*` : Bordures arrondies
- `--border-default` : Couleurs de bordure
- `--bg-secondary` : Couleurs de fond
- `--text-*` : Couleurs de texte
- `--transition-fast` : Transitions

## 📱 Responsive

Les styles sont automatiquement responsives grâce aux variables CSS et aux media queries existantes dans `markdown.css`.