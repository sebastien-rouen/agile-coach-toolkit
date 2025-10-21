# Documentation Autocomplétion - Skills Matrix

## Vue d'ensemble

Le module d'autocomplétion fournit un système intelligent de suggestions pour les champs de saisie, avec support du cache, debouncing, et navigation clavier.

## Installation

### 1. Inclure les fichiers

```html
<!-- CSS -->
<link rel="stylesheet" href="css/autocomplete.css">

<!-- JavaScript -->
<script src="js/autocomplete.js"></script>
```

### 2. Dépendances

- **PocketBase Manager** : `assets/js/pocketbase-manager.js`
- **Variables globales** : `usePocketBase`, `pbManager`

## Utilisation

### Initialisation Basique

```javascript
const input = document.querySelector('#skill-input');
initAutocomplete(input, 'skill');
```

### Initialisation Avancée

```javascript
const input = document.querySelector('#skill-input');
initAutocomplete(input, 'skill', {
    minChars: 2,              // Minimum 2 caractères avant recherche
    debounceDelay: 300,       // Délai de 300ms entre les frappes
    onSelect: (value) => {    // Callback lors de la sélection
        console.log('Sélectionné:', value);
        // Votre logique ici
    }
});
```

## API

### `initAutocomplete(input, type, options)`

Initialise l'autocomplétion sur un champ input.

**Paramètres :**
- `input` (HTMLInputElement) : Élément input à enrichir
- `type` (string) : Type d'item ('skill', 'appetence', 'ownership')
- `options` (Object, optionnel) :
  - `minChars` (number) : Nombre minimum de caractères (défaut: 2)
  - `debounceDelay` (number) : Délai de debounce en ms (défaut: 300)
  - `onSelect` (Function) : Callback lors de la sélection

**Exemple :**
```javascript
initAutocomplete(
    document.querySelector('#my-input'),
    'skill',
    {
        minChars: 1,
        debounceDelay: 200,
        onSelect: (value) => alert(`Vous avez choisi: ${value}`)
    }
);
```

### `getAutocompleteSuggestions(type, query)`

Récupère les suggestions depuis PocketBase (avec cache).

**Paramètres :**
- `type` (string) : Type d'item
- `query` (string, optionnel) : Texte de recherche

**Retour :**
- `Promise<string[]>` : Liste des suggestions

**Exemple :**
```javascript
const suggestions = await getAutocompleteSuggestions('skill', 'java');
console.log(suggestions); // ['JavaScript', 'Java', 'JavaFX']
```

## Fonctionnalités

### 🚀 Performance

- **Cache local** : 5 minutes de TTL pour réduire les requêtes
- **Debouncing** : Évite les requêtes excessives lors de la frappe
- **Limite de résultats** : 10 suggestions avec query, 20 sans

### ⌨️ Navigation Clavier

- `↓` : Suggestion suivante
- `↑` : Suggestion précédente
- `Enter` : Sélectionner la suggestion active
- `Escape` : Fermer les suggestions

### 🔒 Sécurité

- **Échappement HTML** : Protection contre les injections XSS
- **Sanitisation des filtres** : Validation des paramètres PocketBase
- **Fermeture au clic extérieur** : UX sécurisée

### 📱 Responsive

- Adaptation mobile automatique
- Font-size 16px sur mobile (évite le zoom iOS)
- Hauteur réduite sur petits écrans

## Personnalisation CSS

### Variables CSS Disponibles

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --border-color: #ddd;
    --text-primary: #333;
    --text-secondary: #999;
    --primary-light: #e3f2fd;
}
```

### Exemple de Personnalisation

```css
/* Changer la couleur de survol */
.autocomplete-item:hover {
    background-color: #ffeb3b;
    color: #000;
}

/* Augmenter la hauteur max */
.autocomplete-suggestions {
    max-height: 300px;
}
```

## Gestion des Erreurs

### Mode Fallback

Si PocketBase n'est pas disponible, l'autocomplétion retourne un tableau vide sans erreur bloquante.

```javascript
// Vérification automatique
if (!usePocketBase || !pbManager) {
    console.warn('PocketBase non disponible');
    return [];
}
```

### Logging

Le module utilise le logger Winston si disponible, sinon `console.error`.

```javascript
if (typeof logger !== 'undefined') {
    logger.error('Erreur autocomplétion', { error: error.message });
} else {
    console.error('Erreur autocomplétion:', error);
}
```

## Tests

### Fichier de Test

Ouvrir `tests/test-autocomplete.html` dans un navigateur pour tester :

1. Autocomplétion skills
2. Autocomplétion appétences
3. Autocomplétion ownership
4. Mode fallback sans PocketBase

### Tests Manuels

```javascript
// Test 1 : Récupération de suggestions
const suggestions = await getAutocompleteSuggestions('skill', 'java');
console.assert(suggestions.length > 0, 'Devrait retourner des suggestions');

// Test 2 : Cache
const cached = await getAutocompleteSuggestions('skill', 'java');
console.assert(cached === suggestions, 'Devrait utiliser le cache');

// Test 3 : Fallback
window.usePocketBase = false;
const empty = await getAutocompleteSuggestions('skill', 'test');
console.assert(empty.length === 0, 'Devrait retourner un tableau vide');
```

## Bonnes Pratiques

### ✅ À Faire

- Toujours définir un `onSelect` pour gérer la sélection
- Utiliser `minChars: 2` minimum pour éviter trop de résultats
- Tester le mode fallback sans PocketBase
- Inclure le CSS d'autocomplétion

### ❌ À Éviter

- Ne pas modifier directement les styles inline du JS
- Ne pas désactiver le debouncing (performances)
- Ne pas oublier de gérer les erreurs réseau
- Ne pas utiliser sur des inputs sensibles (mots de passe)

## Exemples Complets

### Exemple 1 : Formulaire d'Ajout de Skill

```html
<div class="form-group">
    <label for="skill-name">Nom du skill</label>
    <input type="text" id="skill-name" placeholder="Ex: JavaScript">
</div>

<script>
    const input = document.getElementById('skill-name');
    initAutocomplete(input, 'skill', {
        minChars: 2,
        onSelect: (value) => {
            // Vérifier si le skill existe déjà
            if (existingSkills.includes(value)) {
                alert('Ce skill existe déjà');
                input.value = '';
            }
        }
    });
</script>
```

### Exemple 2 : Recherche Globale

```html
<input type="search" id="global-search" placeholder="Rechercher...">

<script>
    const searchInput = document.getElementById('global-search');
    
    // Autocomplétion multi-types
    initAutocomplete(searchInput, null, {
        minChars: 1,
        debounceDelay: 200,
        onSelect: (value) => {
            // Rediriger vers la page de résultats
            window.location.href = `/search?q=${encodeURIComponent(value)}`;
        }
    });
</script>
```

## Dépannage

### Problème : Aucune suggestion n'apparaît

**Solutions :**
1. Vérifier que PocketBase est démarré
2. Vérifier `usePocketBase = true`
3. Vérifier que `pbManager` est initialisé
4. Ouvrir la console pour voir les erreurs

### Problème : Suggestions trop lentes

**Solutions :**
1. Augmenter `debounceDelay` (ex: 500ms)
2. Augmenter `minChars` (ex: 3)
3. Vérifier la performance de PocketBase
4. Réduire `perPage` dans la requête

### Problème : Styles incorrects

**Solutions :**
1. Vérifier que `autocomplete.css` est chargé
2. Vérifier les variables CSS définies
3. Inspecter l'élément dans DevTools
4. Vérifier la position relative du parent

## Changelog

### v1.0.0 (2025-01-17)
- ✨ Implémentation initiale
- 🚀 Cache local avec TTL de 5 minutes
- ⌨️ Navigation clavier complète
- 🔒 Protection XSS et sanitisation
- 📱 Support responsive mobile
- 🧪 Suite de tests complète

## Contribution

Pour contribuer à ce module :

1. Respecter les conventions du projet (voir `shared-workflow-standards-git.md`)
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Mettre à jour cette documentation
4. Suivre le format de commit conventionnel

## Support

Pour toute question ou problème :
- Consulter la documentation principale : `DOCUMENTATION.md`
- Ouvrir une issue sur le dépôt Git
- Contacter l'équipe de développement
