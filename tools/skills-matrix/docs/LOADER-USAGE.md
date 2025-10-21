# Guide d'utilisation du Loader

## Vue d'ensemble

Le système de loader fournit un feedback visuel élégant lors des actions de contrôle (import, export, sauvegarde). Il s'adapte automatiquement au contexte (desktop ou mobile).

## Fonctions disponibles

### `showLoader(message)`

Affiche le loader approprié selon le contexte (desktop ou mobile).

```javascript
showLoader('📥 Export en cours...');
```

**Paramètres :**
- `message` (string) : Message à afficher à côté du spinner

**Comportement :**
- Sur desktop : Affiche le loader dans la barre de contrôles
- Sur mobile : Affiche le loader dans le menu mobile
- Détection automatique via `window.innerWidth <= 768`

### `hideLoader()`

Masque tous les loaders actifs.

```javascript
hideLoader();
```

### Fonctions spécifiques (usage avancé)

#### Desktop
```javascript
showControlsLoader('Message desktop');
hideControlsLoader();
```

#### Mobile
```javascript
showMobileMenuLoader('Message mobile');
hideMobileMenuLoader();
```

## Exemples d'utilisation

### Export de données

```javascript
function exportToJSON() {
    try {
        showLoader('📥 Export JSON...');
        
        setTimeout(() => {
            // Logique d'export
            const dataStr = JSON.stringify(matrixData, null, 2);
            // ... téléchargement du fichier
            
            hideLoader();
            showNotification('📥 Export JSON réussi', 'success');
        }, 300);
    } catch (error) {
        hideLoader();
        showNotification('❌ Erreur lors de l\'export', 'error');
    }
}
```

### Import de données

```javascript
function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showLoader('📤 Import JSON...');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                // ... traitement des données
                
                hideLoader();
                showNotification('📥 Import réussi', 'success');
            } catch (error) {
                hideLoader();
                showNotification('❌ Fichier invalide', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}
```

### Sauvegarde avec délai

```javascript
async function saveData() {
    try {
        showLoader('💾 Sauvegarde...');
        
        await syncWithPocketBase();
        
        hideLoader();
        showNotification('✅ Données sauvegardées', 'success');
    } catch (error) {
        hideLoader();
        showNotification('❌ Erreur de sauvegarde', 'error');
    }
}
```

## Bonnes pratiques

### 1. Toujours masquer le loader

```javascript
// ✅ Bon : Gestion des erreurs
try {
    showLoader('Traitement...');
    // ... logique
    hideLoader();
} catch (error) {
    hideLoader(); // Important !
    showNotification('Erreur', 'error');
}

// ❌ Mauvais : Loader peut rester affiché
showLoader('Traitement...');
// ... logique qui peut échouer
hideLoader();
```

### 2. Messages descriptifs

```javascript
// ✅ Bon : Message clair avec emoji
showLoader('📊 Export Excel...');
showLoader('🔄 Réinitialisation...');
showLoader('📚 Chargement bibliothèque...');

// ❌ Mauvais : Message générique
showLoader('Chargement...');
showLoader('Traitement...');
```

### 3. Délai pour les opérations rapides

```javascript
// ✅ Bon : Délai pour éviter le flash
showLoader('📥 Export...');
setTimeout(() => {
    // Opération rapide
    hideLoader();
}, 300);

// ❌ Mauvais : Flash visuel désagréable
showLoader('📥 Export...');
// Opération instantanée
hideLoader();
```

### 4. Combiner avec les notifications

```javascript
// ✅ Bon : Loader + notification de résultat
showLoader('💾 Sauvegarde...');
try {
    await saveData();
    hideLoader();
    showNotification('✅ Sauvegarde réussie', 'success');
} catch (error) {
    hideLoader();
    showNotification('❌ Erreur de sauvegarde', 'error');
}
```

## Styles et animations

### Animations CSS

Le loader utilise plusieurs animations :

- **`spin`** : Rotation du spinner (0.8s)
- **`fadeIn`** : Apparition du loader (0.3s)
- **`pulse`** : Pulsation du texte (1.5s)

### Personnalisation

Les styles sont définis dans `css/styles.css` :

```css
.controls-loader {
    background: rgba(15, 52, 96, 0.98);
    backdrop-filter: blur(8px);
    /* ... */
}

.controls-loader-spinner {
    border: 3px solid rgba(0, 212, 255, 0.2);
    border-top-color: #00d4ff;
    /* ... */
}
```

## Responsive

Le système détecte automatiquement le contexte :

- **Desktop (> 768px)** : Loader dans `.controls`
- **Mobile (≤ 768px)** : Loader dans `.mobile-menu`

## Intégration avec PocketBase

Le loader est automatiquement utilisé lors des opérations PocketBase :

```javascript
// Dans pocketbase-integration.js
if (typeof showLoader === 'function') {
    showLoader('💾 Sauvegarde...');
}

// ... synchronisation

if (typeof hideLoader === 'function') {
    hideLoader();
}
```

## Dépannage

### Le loader ne s'affiche pas

1. Vérifier que `loader.js` est chargé avant les autres scripts
2. Vérifier que les éléments HTML existent (`#controlsLoader`, `#mobileMenuLoader`)
3. Vérifier la console pour les erreurs JavaScript

### Le loader reste affiché

1. Vérifier que `hideLoader()` est appelé dans tous les cas (succès ET erreur)
2. Vérifier qu'il n'y a pas d'erreur JavaScript qui interrompt l'exécution
3. Utiliser `try/catch` pour garantir l'appel de `hideLoader()`

### Le loader ne s'adapte pas au mobile

1. Vérifier que la détection de largeur fonctionne : `window.innerWidth <= 768`
2. Vérifier que les éléments mobile existent dans le DOM
3. Tester avec les outils de développement en mode responsive

## Prompt d'import

### Fonctionnalité

Après un import réussi (JSON ou Excel), un message temporaire s'affiche pour demander à l'utilisateur s'il souhaite sauvegarder immédiatement les données importées.

### Utilisation

```javascript
// Après un import réussi
if (typeof showImportPrompt === 'function') {
    showImportPrompt('JSON'); // ou 'Excel'
}
```

### Comportement

- **Affichage** : Message en bas à droite (desktop) ou en bas (mobile)
- **Durée** : 10 secondes avant disparition automatique
- **Actions** :
  - "Sauvegarder" : Appelle `saveData(true)` et affiche une notification de succès
  - "Plus tard" : Masque le prompt et affiche une notification info

### Personnalisation

Le prompt peut être personnalisé dans `css/import-prompt.css` :

```css
.import-prompt {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* ... */
}
```

## Fichiers concernés

- **`js/loader.js`** : Fonctions de gestion du loader
- **`js/import-prompt.js`** : Gestion du prompt de sauvegarde après import
- **`css/styles.css`** : Styles du loader desktop et mobile
- **`css/import-prompt.css`** : Styles du prompt d'import
- **`index.html`** : Éléments HTML du loader
- **`js/data.js`** : Utilisation dans les actions d'import/export
- **`js/advice.js`** : Utilisation dans l'export Markdown
- **`js/pocketbase-integration.js`** : Utilisation dans la sauvegarde
