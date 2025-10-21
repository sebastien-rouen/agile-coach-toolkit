# Corrections Mobile - 2025-01-05

## 🐛 Problèmes identifiés

### 1. Menu latéral invisible sur mobile
**Symptôme** : Impossible d'accéder au menu de navigation sur mobile
**Cause** : Sidebar en `position: fixed` mais sans mécanisme d'affichage/masquage

### 2. Options du wizard cassées
**Symptôme** : Les cartes d'options du wizard sont trop petites et illisibles
**Cause** : Padding trop réduit sur mobile (`var(--space-xs)` au lieu de `var(--space-lg)`)

## ✅ Solutions appliquées

### 1. Menu hamburger fonctionnel

#### Modifications dans `assets/css/responsive.css`
```css
@media (max-width: 599px) {
  /* Sidebar en position fixed avec transition */
  .sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height);
    height: calc(100vh - var(--header-height));
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  /* Overlay pour fermer la sidebar */
  #sidebarOverlay {
    display: none;
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  #sidebarOverlay.active {
    display: block;
  }

  /* Burger menu visible */
  .burger-btn {
    display: flex !important;
  }
}
```

**Fonctionnement** :
- Le bouton hamburger est visible sur mobile (< 599px)
- Cliquer sur le burger ajoute la classe `.active` à la sidebar
- La sidebar glisse depuis la gauche avec une transition fluide
- Un overlay semi-transparent apparaît derrière
- Cliquer sur l'overlay ferme la sidebar

### 2. Options du wizard lisibles

#### Modifications dans `assets/css/wizard.css`
```css
@media (max-width: 768px) {
  .wizard-option,
  .option-card {
    padding: var(--space-lg);  /* Au lieu de var(--space-xs) */
    text-align: left;
  }

  .option-icon {
    font-size: 2.5rem;
    margin-bottom: var(--space-sm);
  }

  .option-label {
    font-size: var(--font-size-base);
  }

  .option-description {
    font-size: var(--font-size-xs);
    margin-top: var(--space-xs);
  }
}

@media (max-width: 480px) {
  .wizard-option,
  .option-card {
    padding: var(--space-md);  /* Padding adapté aux très petits écrans */
  }

  .option-icon {
    font-size: 2rem;
  }

  .option-label {
    font-size: var(--font-size-sm);
  }

  .option-description {
    font-size: 0.75rem;
    line-height: 1.3;
  }
}
```

**Améliorations** :
- Padding suffisant pour une bonne lisibilité (16-24px)
- Icônes de taille appropriée (2-2.5rem)
- Texte aligné à gauche pour une meilleure lecture
- Descriptions visibles et lisibles

### 3. Barre de progression optimisée

```css
@media (max-width: 768px) {
  .wizard-progress {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .progress-step span {
    display: none;  /* Masquer les labels sur mobile */
  }

  .progress-separator {
    width: 20px;
    height: 2px;
  }
}
```

**Résultat** :
- Barre de progression compacte
- Numéros visibles, labels masqués pour gagner de l'espace
- Séparateurs réduits

## 📱 Tests recommandés

### Checklist de validation
- [ ] Ouvrir le site sur mobile (< 600px)
- [ ] Vérifier que le bouton hamburger est visible dans le header
- [ ] Cliquer sur le hamburger → la sidebar doit glisser depuis la gauche
- [ ] Vérifier que l'overlay apparaît derrière la sidebar
- [ ] Cliquer sur l'overlay → la sidebar doit se fermer
- [ ] Tester le wizard : les options doivent être lisibles et cliquables
- [ ] Vérifier la barre de progression du wizard
- [ ] Tester sur différentes tailles d'écran (320px, 375px, 414px, 768px)

### Outils de test
```bash
# Chrome DevTools
# 1. F12 → Toggle device toolbar (Ctrl+Shift+M)
# 2. Sélectionner un appareil mobile (iPhone SE, iPhone 12, etc.)
# 3. Tester les interactions

# Firefox Responsive Design Mode
# 1. F12 → Responsive Design Mode (Ctrl+Shift+M)
# 2. Choisir une résolution mobile
# 3. Tester les interactions
```

## 🎯 Résultats attendus

### Avant
- ❌ Menu latéral inaccessible sur mobile
- ❌ Options du wizard illisibles (trop petites)
- ❌ Pas de moyen de naviguer dans les catégories

### Après
- ✅ Bouton hamburger visible et fonctionnel
- ✅ Sidebar accessible avec animation fluide
- ✅ Options du wizard lisibles et cliquables
- ✅ Navigation mobile complète et intuitive
- ✅ Overlay pour fermer la sidebar facilement

## 📚 Références

- **Fichiers modifiés** :
  - `assets/css/responsive.css` (lignes 200-280)
  - `assets/css/wizard.css` (lignes 400-550)
  
- **Composants existants** :
  - `partials/header.html` (bouton hamburger)
  - `partials/sidebar.html` (overlay)
  - `assets/js/navigation.js` (gestion des événements)

- **Standards** :
  - `shared-css-architecture.md` (architecture CSS)
  - `shared-coding-standards.md` (conventions de code)
  - `bastaverse.md` (écosystème BastaVerse)
