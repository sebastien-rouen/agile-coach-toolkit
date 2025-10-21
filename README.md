# 🎯 Agile Coach Toolkit

> Collection d'outils gratuits et open-source pour optimiser vos pratiques agiles et améliorer la collaboration d'équipe.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/sebastien-rouen/agile-coach-toolkit)
[![BastaVerse](https://img.shields.io/badge/BastaVerse-Ecosystem-purple.svg)](https://bastaverse.bastou.dev)

**Partie de l'écosystème BastaVerse** - Site agile avec API centralisée et PocketBase intégré.

---

## 🌟 Vue d'ensemble

**Agile Coach Toolkit** est une plateforme web complète conçue par et pour les coachs agiles, Scrum Masters, Product Owners et équipes. Elle fait partie de l'écosystème BastaVerse et regroupe :

- ✅ **13 catégories thématiques** couvrant plusieurs aspects de l'agilité
- 🛠️ **13 outils interactifs** (Planning Poker, Skills Matrix, Velocity Squad...)
- 📖 **Ressources pédagogiques** en Markdown avec support Mermaid
- 🧭 **Wizard intelligent V3** pour vous guider vers les bons outils
- 🎨 **Interface moderne** : dark mode, responsive, accessible
- 🆓 **100% gratuit et open-source** sous licence MIT
- 🔄 **API Backend** : Express.js avec PocketBase pour la persistance
- 🎮 **Serious Games** : Hospital Flow Master pour apprendre par la pratique

---

## 🚀 Démarrage rapide

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/sebastien-rouen/agile-coach-toolkit.git
cd agile-coach-toolkit

# Installer les dépendances (optionnel pour API)
npm install

# Démarrer l'API (optionnel)
npm start

# Ouvrir dans votre navigateur
open index.html

# ou serveur local
python3 -m http.server 8000
# puis accéder à http://localhost:8000
```

### Configuration BastaVerse

Le site utilise l'architecture BastaVerse avec :
- **API centralisée** : Port 3001 (prod) / 3002 (drafts)
- **PocketBase** : Port 8117 (prod) / 8116 (drafts)
- **Configuration** : Variables d'environnement dans `.env`

---

## 📂 Structure du projet (Architecture BastaVerse)

```
agile-coach-toolkit/
├── 📄 index.html              # Page d'accueil + wizard V3
├── 📄 category.html           # Template de page catégorie
├── 📄 content.html            # Template d'affichage contenu
│
├── 📁 assets/                 # Ressources statiques
│   ├── 🎨 css/
│   │   ├── variables.css      # Variables CSS (thème, couleurs)
│   │   ├── base.css          # Reset et styles de base
│   │   ├── components/       # Composants UI réutilisables
│   │   ├── layout/           # Layouts (grid, wizard, sidebar)
│   │   ├── modules/          # Styles spécifiques aux pages
│   │   ├── themes/           # Thèmes (dark par défaut)
│   │   └── style.css         # Point d'entrée CSS
│   │
│   ├── 🧠 js/
│   │   ├── main.js           # Point d'entrée et initialisation
│   │   ├── wizard.js         # Logique du wizard V3
│   │   ├── navigation.js     # Gestion menu / sidebar
│   │   ├── markdown-parser.js # Interprétation Markdown → HTML
│   │   ├── search.js         # Système de recherche
│   │   └── utils.js          # Fonctions utilitaires
│   │
│   ├── 🖼️ images/            # Images et icônes
│   │   ├── favicon.png
│   │   └── logo.png
│   │
│   └── 🎨 icons/             # Icônes SVG par catégorie
│
├── 📁 api/                    # API Backend (Express.js)
│   ├── lib/                  # Utilitaires partagés
│   │   └── utils.js          # PocketBase et helpers
│   └── routes/               # Gestionnaires de routes
│       └── routes-*.js       # Routes API spécifiques
│
├── 📁 bdd/                    # Base de données PocketBase
│   ├── pb_migrations/        # Migrations versionnées
│   ├── pb_hooks/             # Hooks PocketBase
│   └── pb_data/              # Données générées (non versionnées)
│
├── 📁 config/
│   └── config.json           # Configuration globale (13 catégories, wizard, outils)
│
├── 📁 content/                # Contenus Markdown par catégorie
│   ├── fondamentaux/
│   ├── frameworks/
│   ├── delivery-amelioration/
│   ├── animation-facilitation/
│   ├── gestion-defis/
│   ├── leadership-coaching/
│   ├── multi-equipes-scale/
│   ├── contextes-specialises/
│   ├── product-design/
│   ├── transformation-culture/
│   ├── outils-technologies/
│   ├── developpement-coach/
│   └── ressources-rex/
│
├── � tools/                  # 13 outils interactifs autonomes
│   ├── planning-poker/        # Estimation collaborative
│   ├── skills-matrix/         # Matrice de compétences
│   ├── velocity-squad/        # Suivi vélocité
│   ├── delegation-poker/      # Niveaux de délégation
│   ├── example-mapping/       # Exploration User Stories
│   ├── agile-fluency/         # Évaluation maturité
│   ├── ikigai/                # Raison d'être personnelle
│   ├── ikigai-engagement/     # Engagement d'équipe
│   ├── stakeholder-mapping/   # Cartographie parties prenantes
│   ├── mission-tracker/       # Suivi missions
│   ├── vizualiser/            # Visualiseur multi-équipes
│   ├── estimation-learning/   # Apprentissage estimations
│   └── shared/                # Composants partagés
│
├── 📁 serious-game/           # Serious Games Agiles
│   └── hospital-flow-master/  # Jeu d'apprentissage Kanban/Scrum
│
├── 📁 tests/                  # Tests visuels (Storybook)
│   ├── index.html            # Navigation centrale
│   └── test-*.html           # Tests spécifiques
│
├── 📁 docs/                   # Documentation technique
│   ├── DOCUMENTATION.md      # Documentation complète
│   ├── WIZARD.md             # Guide wizard V3
│   └── MERMAID-INTEGRATION.md # Support diagrammes
│
├── 📁 partials/               # Composants HTML réutilisables
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
│
├── 📄 README.md              # Ce fichier
├── 📄 CHANGELOG.md           # Historique des versions
├── 📄 LICENSE                # Licence MIT
├── 📄 package.json           # Dépendances Node.js
└── 📄 .env                   # Variables d'environnement
```

---

## 🎨 Fonctionnalités principales

### 🧭 1. Wizard de navigation intelligent V3

Le **wizard en 3 étapes** vous guide selon votre profil :

1. **Votre rôle** : Scrum Master, PO, Coach Agile, Membre d'équipe, Manager
2. **Votre objectif** : Animer un événement, faciliter une rétro, comprendre un framework, améliorer la collaboration...
3. **Votre contexte** : Équipe unique, scale, transformation, équipe mature, contexte spécialisé

→ Le wizard recommande les **catégories et outils les plus pertinents** selon vos réponses.

### 📚 2. 13 catégories thématiques

| Icône | Catégorie | Description | Couleur |
|-------|-----------|-------------|---------|
| 🎯 | **Fondamentaux** | Bases du coaching agile | #FF6B6B |
| 📦 | **Delivery & Amélioration** | Livraison et amélioration continue | #FFA07A |
| 🚵 | **Frameworks** | Scrum, Kanban & autres méthodes | #4ECDC4 |
| 🎨 | **Product & Design** | Product management et design thinking | #E91E63 |
| 🌱 | **Transformation & Culture** | Conduite du changement organisationnel | #8BC34A |
| 🛡️ | **Gestion des Défis** | Résistance, conflits et stress | #E74C3C |
| 👑 | **Leadership & Coaching** | Postures et soft skills | #F39C12 |
| 🏗️ | **Multi-équipes & Scale** | Coordination et scaling agile | #607D8B |
| 🖇️ | **Contextes Spécialisés** | Situations particulières et secteurs | #8E44AD |
| 🛠️ | **Outils & Technologies** | Applications et outils digitaux | #00BCD4 |
| 📚 | **Développement Coach** | Formation et montée en compétences | #3F51B5 |
| 📋 | **Ressources & REX** | Templates et retours d'expérience | #00ACC1 |
| 🎬 | **Animation & Facilitation** | Animations et facilitations | #9C27B0 |

### 🛠️ 3. 13 outils interactifs

Chaque outil est **autonome** et fonctionne avec persistance PocketBase :

| Outil | Statut | Description |
|-------|--------|-------------|
| 🎴 **Planning Poker** | Beta | Estimation collaborative avec cartes |
| 🎓 **Skills Matrix** | Stable | Matrice de compétences d'équipe |
| 📈 **Velocity Squad** | Stable | Suivi vélocité et métriques |
| 🃏 **Delegation Poker** | Beta | Niveaux de délégation Management 3.0 |
| 🗺️ **Example Mapping** | Beta | Exploration collaborative User Stories |
| 🎯 **Agile Fluency** | Beta | Évaluation maturité agile |
| 🌹 **Ikigai** | Stable | Découvrir sa raison d'être |
| 🌻 **Ikigai Engagement** | Stable | Ikigai adapté pour l'équipe |
| 🎯 **Stakeholder Mapping** | Stable | Cartographie parties prenantes (3 vues) |
| 🚀 **Mission Tracker** | Beta | Suivi missions et objectifs |
| 🎯 **Visualiseur Multi-Équipes** | Stable | Cartographie avec codes couleurs d'alerte |
| 🎓 **Apprentissage Estimations** | Stable | Cartes d'estimation avec animaux |
| 🎮 **Serious Games** | Beta | Hospital Flow Master (Kanban/Scrum) |

### 📖 4. Contenus Markdown avec Mermaid

Chaque catégorie dispose de **contenus pédagogiques** :
- Articles de fond avec métadonnées YAML
- Guides pratiques étape par étape
- Retours d'expérience terrain
- Templates et checklists prêts à l'emploi

#### 📊 Support des Diagrammes Mermaid

Les contenus Markdown supportent **Mermaid.js** pour créer des diagrammes :

```markdown
\`\`\`mermaid
graph LR
    A[Pourquoi ?<br/>Objectif] --> B[Qui ?<br/>Acteurs]
    B --> C[Comment ?<br/>Impacts]
    C --> D[Quoi ?<br/>Livrables]
\`\`\`
```

**Types supportés** : flowchart, sequence, class, state, gantt, pie, ERD, user journey

### 🎨 5. Design moderne BastaVerse

- **Dark mode** par défaut (confort visuel)
- **Responsive** : mobile-first, adaptatif
- **Accessibilité** : ARIA, contraste élevé, navigation clavier
- **Couleurs vives** : différenciation catégories
- **Animations fluides** : micro-interactions
- **Architecture CSS modulaire** : variables, composants, thèmes

---

## 🧩 Stack technique (Architecture BastaVerse)

### Frontend
- **HTML5** : Structure sémantique avec partials réutilisables
- **CSS3** : Variables CSS, Grid, Flexbox, architecture modulaire
- **JavaScript Vanilla ES6+** : Aucune dépendance externe lourde
- **Markdown** : Contenus avec [marked.js](https://marked.js.org/)
- **Mermaid.js** : Diagrammes intégrés dans le Markdown
- **js-yaml** : Parsing métadonnées YAML frontmatter

### Backend (API BastaVerse)
- **Node.js 18+** : Runtime JavaScript
- **Express.js 4.21** : Framework web minimaliste
- **PocketBase** : Base de données SQLite avec API REST
- **Multer + Sharp** : Upload et traitement d'images
- **CORS + Body-parser** : Middleware de sécurité

### Base de données
- **PocketBase** : SQLite avec interface admin
- **Migrations versionnées** : Gestion schema avec rollback
- **Collections typées** : Validation automatique des données
- **Hooks JavaScript** : Logique métier côté serveur

### Déploiement BastaVerse
- **Nginx Proxy Manager** : Reverse proxy avec SSL
- **PM2** : Process manager pour l'API
- **Ports dédiés** : 8116/8117 (PocketBase), 3001/3002 (API)
- **Hot-reload** : Rechargement automatique en développement

**Aucun framework lourd** → Performance maximale et légèreté (< 500 KB).

---

## 🚀 Guide d'utilisation

### Navigation

#### Desktop
- **Sidebar gauche** : 13 catégories avec codes couleurs
- **Wizard V3** : Recommandations personnalisées selon votre profil
- **Recherche** : Barre de recherche globale dans le header
- **Favoris** : Système de favoris avec localStorage

#### Mobile
- **Menu hamburger** : Accès à la sidebar responsive
- **Navigation tactile** : Swipe et touch optimisés
- **Interface adaptative** : Mobile-first design

### Utiliser le Wizard V3

1. **Première visite** : Le wizard se lance automatiquement
2. **Relancer** : Bouton "Recommandations" dans le header
3. **Personnalisation** : 3 questions pour cibler vos besoins
4. **Résultats** : Catégories et outils recommandés avec scores

### Ajouter aux favoris

- Cliquez sur ⭐ pour marquer un outil ou contenu
- **Sauvegarde locale** : Persistance via localStorage
- **Synchronisation** : Optionnelle via PocketBase (si connecté)

### Partager un contenu

URLs générées automatiquement :
```
https://drafts.agile.bastou.dev/category/animation-facilitation
https://drafts.agile.bastou.dev/tools/planning-poker
https://drafts.agile.bastou.dev/content/frameworks/scrum-guide
```

---

## 🛠️ Développement

### Ajouter une nouvelle catégorie

1. **Modifier `config/config.json`** :

```json
{
  "id": "nouvelle-categorie",
  "emoji": "🔥",
  "title": "Ma Catégorie",
  "subtitle": "Description courte",
  "color": "#FF6B6B",
  "icon": "fire",
  "order": 14
}
```

2. **Créer le dossier de contenu** :

```bash
mkdir content/nouvelle-categorie
echo '{"title": "Ma Catégorie", "articles": []}' > content/nouvelle-categorie/index.json
```

3. **Ajouter du contenu** :

```bash
touch content/nouvelle-categorie/introduction.md
```

### Ajouter un outil interactif

1. **Structure minimale** :

```bash
mkdir tools/mon-outil
cd tools/mon-outil
```

2. **Fichiers requis** :

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Outil | Agile Coach Toolkit</title>
  <link rel="stylesheet" href="../../assets/css/variables.css">
  <link rel="stylesheet" href="../../assets/css/base.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="tool-header">
    <a href="../../index.html" class="back-btn">← Retour au toolkit</a>
    <h1>Mon Outil</h1>
  </header>

  <main class="tool-container">
    <!-- Votre contenu -->
  </main>

  <script src="../../assets/js/shared/utils.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

3. **Enregistrer dans config.json** :

```json
{
  "id": "mon-outil",
  "name": "Mon Outil",
  "icon": "🔧",
  "path": "tools/mon-outil/",
  "description": "Description de mon outil",
  "status": "beta",
  "order": 14
}
```

### Intégration PocketBase

Pour ajouter la persistance à un outil :

```javascript
// Dans script.js de l'outil
import { createPocketBaseInstance } from '../../assets/js/shared/pocketbase.js';

const pb = createPocketBaseInstance();

// Sauvegarder des données
async function saveData(data) {
  try {
    const record = await pb.collection('mon_outil_data').create(data);
    console.log('Données sauvegardées:', record);
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
  }
}
```

### Modifier le thème

Variables CSS centralisées dans `assets/css/variables.css` :

```css
:root {
  /* Couleurs principales */
  --primary: #58a6ff;
  --secondary: #f78166;
  
  /* Couleurs catégories */
  --cat-fondamentaux: #FF6B6B;
  --cat-frameworks: #4ECDC4;
  --cat-delivery: #FFA07A;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Architecture CSS modulaire

```css
/* assets/css/style.css - Point d'entrée */
@import 'variables.css';
@import 'base.css';
@import 'components/buttons.css';
@import 'components/cards.css';
@import 'layout/grid.css';
@import 'modules/homepage.css';
@import 'themes/dark.css';
@import 'responsive.css';
```

---

## 📊 Métriques du projet

- **Langages** : HTML5, CSS3, JavaScript ES6+, Node.js
- **Taille frontend** : ~500 KB (sans images)
- **Performance** : Lighthouse Score > 95/100
- **Accessibilité** : WCAG 2.1 AA compliant
- **Compatibilité** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile** : iOS 14+, Android 10+

---

## 🤝 Contribution

Les contributions sont les bienvenues dans l'écosystème BastaVerse ! 🎉

---

## 📜 Licence

Ce projet est sous licence **MIT** - voir [LICENSE](LICENSE) pour plus de détails.

**Résumé** : Vous pouvez utiliser, modifier et distribuer ce projet librement, même commercialement, dans le respect de l'écosystème BastaVerse.

---

## 📅 Roadmap

### Version 4.1 (Q2 2026)
- [ ] **PWA** : Progressive Web App avec mode hors-ligne
- [ ] **Export PDF** : Génération de rapports et contenus
- [ ] **Collaboration temps réel** : WebSocket pour outils multi-utilisateurs
- [ ] **Templates personnalisés** : Création de templates d'outils

### Version 4.2 (Q3 2026)
- [ ] **Traduction anglaise** : Internationalisation complète
- [ ] **API publique** : Endpoints pour intégrations tierces
- [ ] **Plugins système** : Architecture extensible pour outils tiers
- [ ] **Analytics avancées** : Métriques d'usage et performance

### Version 4.3 (Q4 2026)
- [ ] **IA intégrée** : Assistant coach avec Ollama local
- [ ] **Recommandations intelligentes** : ML pour suggestions personnalisées
- [ ] **Intégration Storybook** : Design System BastaVerse complet
- [ ] **Multi-tenant** : Support organisations et équipes

---

## 💡 FAQ

**Q : Puis-je utiliser ce toolkit en entreprise ?**  
R : Oui, la licence MIT le permet. Aucune restriction commerciale. Idéal pour équipes agiles internes.

**Q : Les données sont-elles sauvegardées en ligne ?**  
R : Optionnel. Sauvegarde locale (localStorage) par défaut, synchronisation PocketBase disponible.

**Q : Comment mettre à jour le toolkit ?**  
R : `git pull` pour récupérer les dernières modifications, ou télécharger la dernière release GitHub.

**Q : Puis-je héberger ma propre version ?**  
R : Absolument ! Architecture BastaVerse compatible avec tout hébergement (Nginx, Apache, cloud).

**Q : Le toolkit fonctionne-t-il hors-ligne ?**  
R : Partiellement. Contenus statiques oui, outils avec PocketBase nécessitent connexion.

**Q : Comment contribuer à l'écosystème BastaVerse ?**  
R : Fork, développez, testez, soumettez une PR. Documentation complète dans `docs/CONTRIBUTING.md`.

---

## 🔗 Liens utiles

### Documentation
- [📖 Documentation technique complète](docs/DOCUMENTATION.md)
- [🧙‍♂️ Guide Wizard V3](docs/WIZARD.md)
- [📊 Intégration Mermaid](docs/MERMAID-INTEGRATION.md)
- [🎨 Architecture CSS](docs/ARCHITECTURE-CSS.md)

### Écosystème BastaVerse
- [🌐 BastaVerse Hub](https://bastaverse.bastou.dev)
- [📚 Documentation globale](https://docs.bastou.dev)
- [🔧 API Multi-Sites](https://api.bastou.dev)
- [🗄️ PocketBase Admin](https://agile.bastou.dev/pb/_/)

### Développement
- [📝 Changelog des versions](CHANGELOG.md)
- [🤝 Guide de contribution](docs/CONTRIBUTING.md)
- [🛡️ Code de conduite](docs/CODE_OF_CONDUCT.md)
- [🔒 Politique de sécurité](docs/SECURITY.md)

---

## 📱 Captures d'écran

### Interface principale
A venir...

### Outils interactifs
A venir...

### Mobile responsive
A venir...

---

## 👨‍💻 Auteur

**Sébastien ROUEN** 🎓  
*Créateur de l'écosystème BastaVerse*

- 🔗 **LinkedIn** : [sebastien-rouen](https://www.linkedin.com/in/sebastien-rouen/)
- 🌐 **GitHub** : [sebastien-rouen](https://github.com/sebastien-rouen/)
- ☕ **Support** : [Buy me a coffee](https://buymeacoffee.com/sebastien.rouen)

---

## 🙏 Remerciements

- **Communauté Agile francophone** pour les retours et contributions
- **Équipes terrain** qui testent et améliorent les outils
- **Open-source contributors** de l'écosystème BastaVerse
- **Coachs agiles** qui partagent leurs pratiques et expériences

---

**Fait avec ❤️ pour la communauté Agile - Écosystème BastaVerse**

⭐ **Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !** ⭐

---

*Dernière mise à jour : Janvier 2026 - Version 4.0.0*