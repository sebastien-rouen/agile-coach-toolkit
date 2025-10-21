# 🚀 Installation et Démarrage - Visualiseur Multi-Équipes

## ✅ Fichiers créés

L'outil est maintenant **100% fonctionnel** avec la structure suivante :

```
tools/vizualiser/
├── index.html                          # ✅ Page principale MindMap
├── crud.html                           # ✅ Interface de gestion CRUD
├── README.md                           # ✅ Documentation complète
├── CHANGELOG.md                        # ✅ Historique des versions
├── INSTALLATION.md                     # ✅ Ce fichier
├── assets/
│   ├── css/
│   │   ├── vizualiser.css              # ✅ Styles principaux + composants
│   │   ├── mindmap.css                 # ✅ Styles MindMap Markmap
│   │   └── responsive.css              # ✅ Adaptations mobile/tablette
│   ├── js/
│   │   ├── alert-engine.js             # ✅ Calcul codes couleurs
│   │   ├── mindmap-renderer.js         # ✅ Rendu MindMap
│   │   ├── import-manager.js           # ✅ Gestion imports YAML
│   │   └── visualizer.js               # ✅ Application principale
│   └── data/
│       └── templates/
│           ├── demo-safe.yaml          # ✅ Démo SAFe ART (4 équipes)
│           ├── demo-spotify.yaml       # ✅ Démo Spotify (5 squads)
│           └── demo-simple.yaml        # ✅ Démo Simple (2 équipes)
├── config/
│   └── config.json                     # ✅ Configuration outil
└── tests/
    └── test-visualizer.html            # ✅ Suite de tests visuels
```

## 🎯 Démarrage rapide

### Option 1 : Serveur local simple

```bash
# Depuis le dossier racine du projet
cd tools/vizualiser

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (avec npx)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Puis ouvrir : **http://localhost:8000**

### Option 2 : Ouvrir directement dans le navigateur

⚠️ **Limitation** : L'import YAML ne fonctionnera pas à cause des restrictions CORS.

1. Double-cliquer sur `index.html`
2. Utiliser les démos intégrées (boutons dans la sidebar)

### Option 3 : Intégration dans Agile Toolkit

Si vous utilisez l'écosystème complet Agile Coach Toolkit :

1. L'outil est déjà dans `tools/vizualiser/`
2. Ajouter dans `config/config.json` (racine du projet) :

```json
{
  "tools": [
    {
      "id": "vizualiser",
      "name": "Visualiseur Multi-Équipes",
      "icon": "🎯",
      "path": "tools/vizualiser",
      "description": "Cartographie visuelle avec codes couleurs d'alerte",
      "order": 10
    }
  ]
}
```

3. L'outil apparaîtra automatiquement dans la navigation

## 🧪 Tester l'installation

### 1. Tests automatiques

Ouvrir : **http://localhost:8000/tests/test-visualizer.html**

Cliquer sur "▶️ Lancer tous les tests"

**Résultat attendu** : 11/11 tests réussis ✅

### 2. Test manuel - Charger une démo

1. Ouvrir `index.html`
2. Cliquer sur "📦 Démo SAFe ART" (sidebar)
3. **Résultat attendu** :
   - MindMap affichée avec 4 branches (équipes)
   - Stats : 2 🔴, 3 🟠, 7 🟢
   - Filtres fonctionnels

### 3. Test manuel - CRUD

1. Ouvrir `crud.html`
2. Cliquer sur "➕ Nouveau sujet"
3. Remplir le formulaire et enregistrer
4. **Résultat attendu** :
   - Sujet ajouté dans le tableau
   - Données persistées dans localStorage
   - Retour sur `index.html` → sujet visible dans la MindMap

## 📦 Dépendances externes (CDN)

L'outil charge automatiquement ces bibliothèques :

- **Markmap** v0.15.4 : Visualisation MindMap
- **js-yaml** v4.1.0 : Parsing YAML
- **PocketBase** v0.20.0 : Client (optionnel, pour v1.1.0)

⚠️ **Connexion internet requise** pour le premier chargement.

### Mode offline (optionnel)

Pour utiliser sans internet :

1. Télécharger les bibliothèques :
   - https://cdn.jsdelivr.net/npm/markmap-view@0.15.4/dist/index.min.js
   - https://cdn.jsdelivr.net/npm/markmap-lib@0.15.4/dist/index.min.js
   - https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js

2. Placer dans `assets/js/vendor/`

3. Modifier les `<script src="...">` dans `index.html`

## 🔧 Configuration

### Modifier les seuils d'alerte

Éditer `assets/js/alert-engine.js` :

```javascript
class AlertEngine {
  static WARNING_DAYS = 7;   // Modifier ici (défaut: 7 jours)
  static CRITICAL_DAYS = 0;  // Modifier ici (défaut: 0 jour)
  // ...
}
```

### Personnaliser les couleurs

Éditer `assets/css/vizualiser.css` :

```css
:root {
  --primary: #0056b3;      /* Bleu principal */
  --danger: #dc3545;       /* Rouge critique */
  --warning: #fd7e14;      /* Orange warning */
  --success: #28a745;      /* Vert OK */
  --info: #17a2b8;         /* Bleu info */
}
```

## 📱 Compatibilité navigateurs

| Navigateur | Version minimale | Statut |
|------------|------------------|--------|
| Chrome     | 90+              | ✅ Testé |
| Firefox    | 88+              | ✅ Testé |
| Safari     | 14+              | ✅ Testé |
| Edge       | 90+              | ✅ Testé |
| Mobile Safari | 14+ | ✅ Testé |
| Chrome Android | 90+ | ✅ Testé |

## 🐛 Résolution de problèmes

### La MindMap ne s'affiche pas

**Cause** : Bibliothèques Markmap non chargées

**Solution** :
1. Vérifier la console navigateur (F12)
2. Vérifier la connexion internet
3. Essayer en navigation privée (cache)

### Import YAML échoue

**Cause** : Restrictions CORS (fichier ouvert directement)

**Solution** :
1. Utiliser un serveur local (voir "Démarrage rapide")
2. Ou utiliser les démos intégrées

### Les données ne persistent pas

**Cause** : localStorage désactivé ou plein

**Solution** :
1. Vérifier les paramètres de confidentialité du navigateur
2. Vider le localStorage : `localStorage.clear()` dans la console
3. Exporter les données en YAML avant de vider

### Erreur "AlertEngine is not defined"

**Cause** : Scripts chargés dans le mauvais ordre

**Solution** :
Vérifier l'ordre dans `index.html` :
```html
<script src="assets/js/alert-engine.js"></script>      <!-- 1er -->
<script src="assets/js/mindmap-renderer.js"></script>  <!-- 2e -->
<script src="assets/js/import-manager.js"></script>    <!-- 3e -->
<script src="assets/js/visualizer.js"></script>        <!-- 4e -->
```

## 📚 Prochaines étapes

1. **Tester avec vos données** :
   - Créer un fichier YAML avec votre structure
   - L'importer via "📥 Importer"

2. **Personnaliser** :
   - Modifier les couleurs dans `vizualiser.css`
   - Ajuster les seuils d'alerte dans `alert-engine.js`

3. **Intégrer** :
   - Ajouter dans votre workflow agile
   - Projeter en PI Planning / Scrum of Scrums

4. **Contribuer** :
   - Signaler des bugs sur GitHub
   - Proposer des améliorations
   - Partager vos templates YAML

## 🆘 Support

- **Documentation** : Lire `README.md`
- **Tests** : Ouvrir `tests/test-visualizer.html`
- **Exemples** : Charger les démos SAFe, Spotify, Simple
- **GitHub** : https://github.com/sebastien-rouen/agile-toolkit

---

**Version** : 1.0.0  
**Auteur** : Sébastien ROUEN  
**License** : MIT
