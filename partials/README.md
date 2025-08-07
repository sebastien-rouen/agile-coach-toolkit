# Système de Partiels HTML

Ce dossier contient les composants HTML réutilisables (header, footer, sidebar) pour éviter la duplication de code.

## 📁 Structure

```
partials/
├── header.html   - En-tête du site (logo, navigation, recherche)
├── footer.html   - Pied de page (liens, réseaux sociaux, copyright)
├── sidebar.html  - Menu latéral (catégories, favoris, récents)
└── README.md     - Ce fichier
```

## 🚀 Utilisation

### 1. Dans vos pages HTML

Remplacez les sections complètes par des placeholders :

```html
<!-- HEADER (chargé dynamiquement) -->
<div id="header-placeholder"></div>

<!-- SIDEBAR (chargé dynamiquement) -->
<div id="sidebar-placeholder"></div>

<!-- FOOTER (chargé dynamiquement) -->
<div id="footer-placeholder"></div>
```

### 2. Charger le script

Ajoutez le script de chargement **avant** les autres scripts :

```html
<script src="assets/js/partials-loader.js"></script>
<script src="assets/js/utils.js"></script>
<script src="assets/js/navigation.js"></script>
<script src="assets/js/main.js"></script>
```

### 3. Attendre le chargement

Si vous avez besoin d'exécuter du code après le chargement des partiels :

```javascript
document.addEventListener('partialsLoaded', () => {
  console.log('Partiels chargés !');
  // Votre code d'initialisation ici
});
```

## ✅ Avantages

- **DRY (Don't Repeat Yourself)** : Un seul endroit pour modifier le header/footer/sidebar
- **Maintenance facile** : Changement dans un fichier = changement sur toutes les pages
- **Cohérence** : Garantit que toutes les pages ont la même structure
- **Performance** : Chargement en parallèle des partiels

## 📝 Exemple complet

Voir le fichier `_template.html` à la racine du projet pour un exemple complet d'utilisation.

## 🔧 Modification des partiels

Pour modifier un composant :

1. Éditez le fichier correspondant dans `partials/`
2. Rechargez n'importe quelle page
3. Le changement est appliqué partout automatiquement

## ⚠️ Important

- Les partiels sont chargés de manière **asynchrone**
- Utilisez l'événement `partialsLoaded` pour initialiser votre code
- Les IDs et classes CSS doivent rester cohérents avec les scripts existants
