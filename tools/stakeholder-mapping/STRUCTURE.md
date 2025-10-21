# Structure du Projet Stakeholder Mapping

## Architecture des Fichiers

```
tools/stakeholder-mapping/
├── index.html                      # Point d'entrée HTML
├── css/                            # Styles
│   ├── styles.css                  # Styles de base (dark theme)
│   ├── table-view.css              # Styles vue tableau
│   ├── circles-view.css            # Styles vue cercles
│   ├── matrix-view.css             # Styles vue matrice
│   ├── modal.css                   # Styles modales
│   └── theme-light.css             # Thème clair
├── js/                             # Scripts JavaScript
│   ├── config.js                   # Configuration globale
│   ├── utils.js                    # Fonctions utilitaires
│   ├── data.js                     # Gestion des données
│   ├── app.js                      # Application principale
│   ├── table-view.js               # Vue tableau
│   ├── circles-view.js             # Vue cercles concentriques
│   ├── matrix-view.js              # Vue matrice Power/Interest
│   ├── modal.js                    # Gestion des modales
│   ├── import-export.js            # Import/Export JSON
│   └── pocketbase-integration.js   # Intégration PocketBase
├── README.md                       # Documentation principale
├── CHANGELOG.md                    # Historique des modifications
├── STRUCTURE.md                    # Ce fichier
└── example-data.json               # Données d'exemple
```

## Flux de Données

### 1. Initialisation
```
index.html
  ↓
app.js → init()
  ↓
DataManager.init()
  ↓
PocketBaseIntegration.init()
  ↓
Chargement des sessions depuis PocketBase
```

### 2. Ajout d'un Stakeholder
```
Utilisateur clique "+ Stakeholder"
  ↓
ModalManager.openStakeholderModal()
  ↓
Utilisateur remplit le formulaire
  ↓
ModalManager.saveStakeholder()
  ↓
DataManager.addStakeholder()
  ↓
App.refreshAllViews()
  ↓
TableView.render() + CirclesView.render() + MatrixView.render()
```

### 3. Changement de Vue
```
Utilisateur clique sur un bouton de vue
  ↓
App.switchView(view)
  ↓
Mise à jour des classes CSS
  ↓
App.renderCurrentView()
  ↓
Rendu de la vue sélectionnée
```

### 4. Sauvegarde PocketBase
```
Utilisateur clique "💾 Sauvegarder"
  ↓
App.saveData()
  ↓
PocketBaseIntegration.saveSession()
  ↓
Sauvegarde session + stakeholders dans PocketBase
```

## Modules JavaScript

### config.js
- Configuration globale de l'application
- Définition des niveaux d'influence
- Définition des domaines
- Configuration des cercles concentriques

### utils.js
- Fonctions utilitaires réutilisables
- Génération d'IDs
- Formatage de dates
- Sanitization du texte
- Calcul de quadrants
- Conversions polaires/cartésiennes
- Import/Export JSON

### data.js (DataManager)
- Gestion centralisée des données
- CRUD des stakeholders
- Gestion des sessions
- Filtrage par influence/domaine/quadrant
- Export/Import de données

### app.js (App)
- Point d'entrée de l'application
- Orchestration des modules
- Gestion des événements globaux
- Changement de vues
- Rafraîchissement des vues

### table-view.js (TableView)
- Rendu de la vue tableau
- Actions CRUD inline
- Tri et filtrage

### circles-view.js (CirclesView)
- Rendu SVG des cercles concentriques
- Positionnement spatial des stakeholders
- Tooltips interactifs
- Gestion des domaines

### matrix-view.js (MatrixView)
- Rendu de la matrice 2x2
- Répartition par quadrants
- Cartes de stakeholders

### modal.js (ModalManager)
- Gestion des modales
- Formulaires d'ajout/édition
- Validation des données

### import-export.js (ImportExport)
- Export JSON
- Import JSON
- Gestion des fichiers

### pocketbase-integration.js (PocketBaseIntegration)
- Connexion à PocketBase
- Sauvegarde des sessions
- Chargement des sessions
- Synchronisation des données

## Collections PocketBase

### tools_stakeholder_mapping_sessions
```javascript
{
  id: "auto-generated",
  name: "string",
  created: "datetime",
  updated: "datetime"
}
```

### tools_stakeholder_mapping_stakeholders
```javascript
{
  id: "auto-generated",
  session_id: "string",
  name: "string",
  role: "string",
  power: "number (1-5)",
  interest: "number (1-5)",
  influence: "select (vital|necessary|good|courtesy)",
  domain: "select (governance|customer|provider|influencer)",
  notes: "text",
  created: "datetime",
  updated: "datetime"
}
```

## Vues

### Vue Tableau
- Liste complète des stakeholders
- Colonnes : Nom, Rôle, Pouvoir, Intérêt, Influence, Domaine, Actions
- Actions : Éditer, Supprimer
- Badges colorés pour influence et domaine

### Vue Cercles Concentriques
- 4 cercles : Vital (rouge), Necessary (orange), Good (vert), Courtesy (bleu)
- 4 domaines : Governance (haut), Customer (droite), Provider (bas), Influencer (gauche)
- Positionnement spatial avec randomisation pour éviter les chevauchements
- Tooltips au survol

### Vue Matrice Power/Interest
- 4 quadrants :
  - High Power, High Interest (rouge) : Most Important
  - High Power, Low Interest (orange) : Keep Satisfied
  - Low Power, High Interest (jaune) : Keep Informed
  - Low Power, Low Interest (vert) : Least Important
- Cartes de stakeholders avec métriques
- Bordure colorée selon le domaine

## Thématisation

### Variables CSS Principales
```css
--bg-primary: Fond principal
--bg-secondary: Fond secondaire
--bg-tertiary: Fond tertiaire
--bg-card: Fond des cartes

--text-primary: Texte principal
--text-secondary: Texte secondaire
--text-tertiary: Texte tertiaire

--color-vital: Rouge (#ef4444)
--color-necessary: Orange (#f59e0b)
--color-good: Vert (#10b981)
--color-courtesy: Bleu (#3b82f6)

--color-governance: Violet (#8b5cf6)
--color-customer: Cyan (#06b6d4)
--color-provider: Orange (#f97316)
--color-influencer: Rose (#ec4899)
```

### Thème Dark (par défaut)
- Fond sombre (#1a1a1a)
- Texte clair (#f3f4f6)
- Contrastes élevés

### Thème Light
- Fond clair (#ffffff)
- Texte sombre (#1f2937)
- Contrastes adaptés

## Responsive Design

### Breakpoints
- Desktop : > 1024px
- Tablet : 768px - 1024px
- Mobile : < 768px

### Adaptations Mobile
- Grille matrice en colonne unique
- Contrôles empilés verticalement
- Légende simplifiée
- Tableau avec scroll horizontal

## Intégration Agile Coach Toolkit

### Scripts Requis
```html
<!-- PocketBase Manager -->
<script src="../../assets/js/pocketbase-manager.js"></script>

<!-- Tool Integration (thème, navigation) -->
<script src="../../assets/js/tool-integration.js"></script>
```

### Configuration
```javascript
window.TOOL_CONFIG = {
    name: 'stakeholder-mapping',
    backUrl: '../../index.html#tools'
};
```

## Développement

### Ajouter une Nouvelle Vue
1. Créer `css/nouvelle-vue.css`
2. Créer `js/nouvelle-vue.js`
3. Ajouter le bouton dans `index.html`
4. Ajouter le conteneur de vue dans `index.html`
5. Implémenter `NouvelleVue.render()`
6. Ajouter le case dans `App.renderCurrentView()`

### Ajouter un Nouveau Champ
1. Modifier les migrations PocketBase
2. Ajouter le champ dans le formulaire modal
3. Mettre à jour `DataManager.addStakeholder()`
4. Mettre à jour les vues de rendu
5. Mettre à jour l'intégration PocketBase

## Tests

### Test Manuel
1. Ouvrir `index.html` dans un navigateur
2. Créer une nouvelle session
3. Ajouter des stakeholders
4. Tester les 3 vues
5. Tester l'import/export
6. Tester la sauvegarde PocketBase

### Données de Test
Utiliser `example-data.json` pour importer des données de test complètes.

## Performance

### Optimisations
- Rendu SVG pour les cercles (meilleure performance que Canvas)
- Pas de framework lourd (JavaScript vanilla)
- CSS avec variables pour thématisation rapide
- Lazy loading des vues (rendu à la demande)

### Métriques Cibles
- First Contentful Paint : < 1s
- Time to Interactive : < 2s
- Taille totale : < 200KB (sans PocketBase)

## Sécurité

### Sanitization
- Utilisation de `textContent` au lieu de `innerHTML`
- Fonction `Utils.sanitize()` pour échapper le HTML
- Validation des entrées utilisateur

### PocketBase
- Authentification gérée par PocketBase
- Rules de sécurité configurables
- HTTPS recommandé en production
