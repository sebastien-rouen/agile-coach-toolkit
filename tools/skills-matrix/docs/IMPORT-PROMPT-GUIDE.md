# Guide du Prompt de Sauvegarde après Import

## 🎯 Objectif

Après un import réussi (JSON ou Excel), un message temporaire s'affiche pour demander à l'utilisateur s'il souhaite sauvegarder immédiatement les données importées. Cela évite d'oublier de sauvegarder et offre un contrôle total à l'utilisateur.

## 📋 Fonctionnement

### Déclenchement automatique

Le prompt s'affiche automatiquement après :
- ✅ Import JSON réussi
- ✅ Import Excel réussi

Il ne s'affiche PAS après :
- ❌ Import annulé par l'utilisateur
- ❌ Import échoué (fichier invalide)

### Durée d'affichage

- **Affichage** : Animation d'entrée fluide (0.4s)
- **Durée** : 10 secondes avant disparition automatique
- **Sortie** : Animation de sortie fluide (0.3s)

### Actions disponibles

#### 1. Sauvegarder (bouton vert)
```
✓ Sauvegarder
```
- Appelle `saveData(true)` pour synchronisation complète
- Affiche notification : "💾 Données sauvegardées" (success)
- Masque le prompt immédiatement

#### 2. Plus tard (bouton transparent)
```
✕ Plus tard
```
- Masque le prompt sans sauvegarder
- Affiche notification : "ℹ️ Vous pourrez sauvegarder plus tard" (info, 2s)
- L'utilisateur peut sauvegarder manuellement plus tard

#### 3. Auto-disparition
- Après 10 secondes sans action
- Aucune notification affichée
- L'utilisateur peut toujours sauvegarder manuellement

## 🎨 Design

### Position
- **Desktop** : Bas à droite (30px du bord)
- **Mobile** : Bas de l'écran (10px des bords, pleine largeur)

### Couleurs
- **Fond** : Dégradé violet (#667eea → #764ba2)
- **Bordure** : Violet semi-transparent
- **Bouton Sauvegarder** : Dégradé vert (#10b981 → #059669)
- **Bouton Plus tard** : Blanc semi-transparent

### Animations
- **Entrée** : Slide-in depuis la droite (desktop) ou le bas (mobile)
- **Sortie** : Slide-out vers la droite (desktop) ou le bas (mobile)
- **Hover** : Élévation des boutons avec ombre

## 💻 Utilisation dans le code

### Afficher le prompt

```javascript
// Après un import réussi
if (typeof showImportPrompt === 'function') {
    showImportPrompt('JSON'); // ou 'Excel'
}
```

### Masquer le prompt manuellement

```javascript
hideImportPrompt();
```

### Gérer la sauvegarde

```javascript
function handleImportSave() {
    hideImportPrompt();
    
    if (typeof saveData === 'function') {
        saveData(true); // Synchronisation complète
        showNotification('💾 Données sauvegardées', 'success');
    }
}
```

### Gérer le skip

```javascript
function handleImportSkip() {
    hideImportPrompt();
    showNotification('ℹ️ Vous pourrez sauvegarder plus tard', 'info', 2000);
}
```

## 🔧 Personnalisation

### Modifier la durée d'affichage

Dans `js/import-prompt.js` :

```javascript
// Auto-masquer après X secondes
importPromptTimeout = setTimeout(() => {
    hideImportPrompt();
}, 10000); // Modifier ici (en millisecondes)
```

### Modifier les couleurs

Dans `css/import-prompt.css` :

```css
.import-prompt {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Modifier le dégradé ici */
}

.import-prompt-btn-save {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    /* Modifier le bouton Sauvegarder */
}
```

### Modifier la position

Dans `css/import-prompt.css` :

```css
.import-prompt {
    bottom: 30px; /* Distance du bas */
    right: 30px;  /* Distance de la droite */
}
```

## 📱 Responsive

### Desktop (> 768px)
- Position : Bas à droite
- Largeur : Max 400px
- Animation : Slide depuis la droite

### Mobile (≤ 768px)
- Position : Bas de l'écran
- Largeur : Pleine largeur (avec marges 10px)
- Animation : Slide depuis le bas
- Boutons : Empilés verticalement

## 🧪 Tests

### Test manuel

1. Ouvrir `tests/test-loader.html`
2. Cliquer sur "Test Prompt JSON" ou "Test Prompt Excel"
3. Vérifier l'affichage et les animations
4. Tester les deux boutons
5. Tester l'auto-disparition (attendre 10s)

### Test dans l'application

1. Importer un fichier JSON valide
2. Confirmer l'import
3. Vérifier que le prompt s'affiche
4. Tester "Sauvegarder" → Vérifier la notification success
5. Réimporter un fichier
6. Tester "Plus tard" → Vérifier la notification info

## 🐛 Dépannage

### Le prompt ne s'affiche pas

1. Vérifier que `import-prompt.js` est chargé
2. Vérifier que `import-prompt.css` est chargé
3. Vérifier la console pour les erreurs JavaScript
4. Vérifier que `showImportPrompt()` est appelé après l'import

### Le prompt reste affiché

1. Vérifier que le timeout est bien défini (10s)
2. Vérifier qu'il n'y a pas d'erreur JavaScript
3. Appeler manuellement `hideImportPrompt()` dans la console

### Les boutons ne fonctionnent pas

1. Vérifier que `handleImportSave()` et `handleImportSkip()` existent
2. Vérifier que `saveData()` est défini
3. Vérifier la console pour les erreurs

### Le prompt s'affiche plusieurs fois

1. Vérifier qu'il n'y a qu'un seul appel à `showImportPrompt()`
2. La fonction `hideImportPrompt()` supprime automatiquement les prompts existants

## 📊 Flux utilisateur

```
Import JSON/Excel
       ↓
   Validation
       ↓
   Confirmation
       ↓
  Données importées
       ↓
  Rendu de l'interface
       ↓
  Notification success
       ↓
  Prompt de sauvegarde ← Vous êtes ici
       ↓
   ┌───┴───┐
   ↓       ↓
Sauvegarder  Plus tard
   ↓       ↓
Success   Info
```

## 🎯 Bonnes pratiques

### 1. Toujours afficher après import réussi

```javascript
// ✅ Bon
if (confirm('Importer ?')) {
    matrixData = imported;
    renderMatrix();
    hideLoader();
    showNotification('Import réussi', 'success');
    showImportPrompt('JSON'); // Important !
}

// ❌ Mauvais : Oubli du prompt
if (confirm('Importer ?')) {
    matrixData = imported;
    renderMatrix();
    hideLoader();
    showNotification('Import réussi', 'success');
    // Pas de prompt !
}
```

### 2. Ne pas afficher si import annulé

```javascript
// ✅ Bon
if (confirm('Importer ?')) {
    // ... import
    showImportPrompt('JSON');
} else {
    hideLoader();
    // Pas de prompt si annulé
}
```

### 3. Ne pas afficher si erreur

```javascript
// ✅ Bon
try {
    // ... import
    showImportPrompt('JSON');
} catch (error) {
    hideLoader();
    showNotification('Erreur', 'error');
    // Pas de prompt si erreur
}
```

## 📚 Références

- **Fichier principal** : `js/import-prompt.js`
- **Styles** : `css/import-prompt.css`
- **Tests** : `tests/test-loader.html`
- **Documentation loader** : `docs/LOADER-USAGE.md`
