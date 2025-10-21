# Wizard 2 Colonnes Mobile - 2025-01-05

## 🎯 Objectif

Afficher les options du wizard en 2 colonnes sur mobile au lieu de 1 colonne pour optimiser l'espace et améliorer l'UX.

## 🐛 Problème initial

Sur mobile, les options du wizard s'affichaient en 1 colonne, ce qui :
- Nécessitait beaucoup de scroll
- N'utilisait pas efficacement l'espace horizontal disponible
- Rendait la navigation moins fluide

## ✅ Solution appliquée

### 1. Media queries dédiées

Ajout de media queries spécifiques **avant** les media queries générales pour éviter les conflits :

```css
/* Sur mobile : forcer 2 colonnes */
@media (max-width: 768px) {
    .options-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: var(--space-sm) !important;
    }
}

/* Sur très petit mobile : garder 2 colonnes mais réduire le gap */
@media (max-width: 480px) {
    .options-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: var(--space-xs) !important;
    }
}
```

### 2. Utilisation de !important

**Pourquoi ?**
- La définition de base utilise `repeat(auto-fit, minmax(250px, 1fr))`
- Sur mobile, `auto-fit` peut créer 1 seule colonne si l'écran est < 500px
- `!important` force la grille à 2 colonnes même avec `auto-fit`

### 3. Suppression des définitions redondantes

Suppression des définitions `grid-template-columns` dans les media queries générales pour éviter les conflits.

## 📐 Spécifications

### Desktop (> 768px)
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 16px;
```
- Grille adaptative selon la largeur
- Minimum 250px par colonne
- Gap standard

### Mobile (481px - 768px)
```css
grid-template-columns: repeat(2, 1fr) !important;
gap: 8px !important;
```
- 2 colonnes fixes
- Gap réduit pour optimiser l'espace
- Padding des cartes : 16px

### Petit mobile (≤ 480px)
```css
grid-template-columns: repeat(2, 1fr) !important;
gap: 4px !important;
```
- 2 colonnes fixes
- Gap minimal
- Padding des cartes : 8px

## 🎨 Ajustements visuels

### Tailles d'icônes
- **Desktop** : 2.5rem (40px)
- **Mobile** : 2rem (32px)
- **Petit mobile** : 1.75rem (28px)

### Tailles de police
- **Label desktop** : 1rem (16px)
- **Label mobile** : 0.875rem (14px)
- **Label petit mobile** : 0.8125rem (13px)

### Padding des cartes
- **Desktop** : 32px
- **Mobile** : 16px
- **Petit mobile** : 8px

## 📱 Résultat

### Avant (1 colonne)
```
┌─────────────────────┐
│   Scrum Master      │
└─────────────────────┘
┌─────────────────────┐
│   Coach Agile       │
└─────────────────────┘
┌─────────────────────┐
│   Product Owner     │
└─────────────────────┘
...
```
- Beaucoup de scroll
- Espace horizontal gaspillé

### Après (2 colonnes)
```
┌──────────┐ ┌──────────┐
│  Scrum   │ │  Coach   │
│  Master  │ │  Agile   │
└──────────┘ └──────────┘
┌──────────┐ ┌──────────┐
│ Product  │ │   Dev    │
│  Owner   │ │          │
└──────────┘ └──────────┘
...
```
- Moins de scroll
- Espace optimisé
- Navigation plus fluide

## 🧪 Tests

### Fichier de test
`tests/test-wizard-grid.html`

**Fonctionnalités** :
- Affiche la largeur d'écran en temps réel
- Montre le nombre de colonnes détectées
- Affiche les propriétés CSS de la grille
- Permet de tester le responsive en redimensionnant

### Checklist de validation
- [ ] Desktop (> 768px) : Grille auto-fit (2-3 colonnes selon largeur)
- [ ] Mobile (481-768px) : 2 colonnes fixes, gap 8px
- [ ] Petit mobile (≤ 480px) : 2 colonnes fixes, gap 4px
- [ ] Les cartes sont lisibles dans les 2 colonnes
- [ ] Pas de débordement horizontal
- [ ] Les icônes et textes sont proportionnés

## 🔧 Commandes de test

### Tester en local
```bash
# Ouvrir le fichier de test (Windows)
start tests/test-wizard-grid.html

# Ou avec un serveur local
npx http-server . -p 8080
# Puis ouvrir http://localhost:8080/tests/test-wizard-grid.html
```

### Tester sur mobile
1. Ouvrir Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Sélectionner un appareil mobile
4. Vérifier que la grille affiche 2 colonnes

### Tester différentes largeurs
- **iPhone SE** : 375px → 2 colonnes
- **iPhone 12** : 390px → 2 colonnes
- **Samsung S20** : 412px → 2 colonnes
- **iPad Mini** : 768px → 2 colonnes
- **iPad** : 810px → auto-fit

## ⚠️ Points d'attention

### Utilisation de !important
- Nécessaire pour surcharger `auto-fit`
- Placé uniquement sur les media queries mobiles
- Ne pas abuser de `!important` ailleurs

### Ordre des media queries
- Les media queries dédiées doivent être **avant** les media queries générales
- Sinon, les styles généraux peuvent écraser les styles spécifiques

### Compatibilité
- CSS Grid supporté par tous les navigateurs modernes
- `repeat(2, 1fr)` : syntaxe standard
- Pas de fallback nécessaire

## 📚 Références

### Fichiers modifiés
- `assets/css/wizard.css` - Grille 2 colonnes mobile
- Correction : Sélecteur CSS `.option-card` (ligne 565)

### Documentation
- `CHANGELOG.md` - Historique des modifications
- `docs/WIZARD_2_COLUMNS_MOBILE_2025-01-05.md` - Ce document
- `tests/test-wizard-grid.html` - Fichier de test

### Standards CSS Grid
- [MDN - CSS Grid Layout](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Tricks - A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🚀 Prochaines étapes

### Améliorations possibles
1. **Animations** : Transition fluide lors du redimensionnement
2. **Accessibilité** : Tester la navigation au clavier
3. **Performance** : Optimiser le rendu de la grille
4. **Tests utilisateurs** : Recueillir feedback sur l'UX

### Tests à effectuer
- Tester sur vrais appareils mobiles
- Vérifier le comportement en mode paysage
- Tester avec différents contenus (textes longs)
- Valider l'accessibilité (lecteur d'écran)
