# 🎯 Agile Coach Toolkit

> Collection d'outils gratuits et open-source pour optimiser vos pratiques agiles et améliorer la collaboration d'équipe.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/agile-coach-toolkit)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🌟 Vue d'ensemble

**Agile Coach Toolkit** est une plateforme web complète conçue par et pour les coachs agiles, Scrum Masters, Product Owners et équipes. Elle regroupe :

- ✅ **14 catégories thématiques** couvrant tous les aspects de l'agilité
- 🛠️ **Outils interactifs** (Planning Poker, rétrospectives, matrices...)
- 📖 **Ressources pédagogiques** en Markdown
- 🧭 **Wizard intelligent** pour vous guider vers les bons outils
- 🎨 **Interface moderne** : dark mode, responsive, accessible
- 🆓 **100% gratuit et open-source**

---

## 🚀 Démarrage rapide

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/yourusername/agile-coach-toolkit.git
cd agile-coach-toolkit

# Ouvrir dans votre navigateur
open index.html
# ou
python3 -m http.server 8000
# puis accéder à http://localhost:8000
```

### Utilisation en ligne

Accédez directement à la version hébergée : **[https://agile-coach-toolkit.dev](https://agile-coach-toolkit.dev)** *(à remplacer par votre URL)*

---

## 📂 Structure du projet

```
agile-coach-toolkit/
├── 📄 index.html              # Page d'accueil + wizard
├── 📄 category.html           # Template de page catégorie
├── 📄 tool-template.html      # Template d'outil interactif
│
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── variables.css      # Variables CSS (thème, couleurs)
│   │   ├── base.css          # Reset et styles de base
│   │   ├── components.css    # Composants UI (boutons, cards...)
│   │   ├── layout.css        # Layouts (grid, wizard, sidebar...)
│   │   └── responsive.css    # Media queries
│   │
│   ├── 🧠 js/
│   │   ├── main.js           # Point d'entrée et initialisation
│   │   ├── wizard.js         # Logique du wizard de navigation
│   │   ├── navigation.js     # Gestion menu / sidebar
│   │   ├── markdown-parser.js # Interprétation Markdown → HTML
│   │   └── utils.js          # Fonctions utilitaires
│   │
│   └── 🖼️ images/
│       ├── logo.svg
│       └── favicon.svg
│
├── 📁 config/
│   └── config.json           # Configuration globale (catégories, wizard...)
│
├── 📁 content/                # Contenus Markdown par catégorie
│   ├── fondamentaux/
│   ├── frameworks/
│   ├── delivery/
│   ├── animation/
│   ├── gestion-defis/
│   ├── leadership/
│   ├── multi-equipes/
│   ├── contextes/
│   ├── product-design/
│   ├── transformation/
│   ├── outils-tech/
│   ├── developpement-coach/
│   ├── ressources/
│   └── outils-interactifs/
│
├── 📁 tools/                  # Outils interactifs autonomes
│   ├── example-mapping/
│   ├── planning-poker/
│   ├── retrospectives/
│   ├── velocity-squad/
│   ├── ikigai/
│   ├── ikigai-engagement/
│   ├── skills-matrix/
│   └── agile-fluency/
│
├── 📁 docs/
│   └── DOCUMENTATION.md      # Documentation technique complète
│
├── 📄 README.md              # Ce fichier
├── 📄 CHANGELOG.md           # Historique des versions
└── 📄 LICENSE                # Licence MIT
```

---

## 🎨 Fonctionnalités principales

### 🧭 1. Wizard de navigation intelligent

Au premier accès, un **wizard en 3 étapes** vous guide :

1. **Votre rôle** : Scrum Master, PO, Coach Agile, Manager...
2. **Votre objectif** : Animer un événement, faciliter une rétro, comprendre un framework...
3. **Votre contexte** : Équipe unique, scale, transformation, remote...

→ Le wizard recommande les **catégories et outils les plus pertinents**.

### 📚 2. 14 catégories thématiques

| Icône | Catégorie | Description |
|-------|-----------|-------------|
| 🎯 | **Fondamentaux** | Bases du coaching agile |
| 🚵 | **Frameworks** | Scrum, Kanban & autres méthodes |
| 📦 | **Delivery & Amélioration** | Livraison et amélioration continue |
| 🎭 | **Animation & Facilitation** | Techniques d'animation et serious games |
| 🛡️ | **Gestion des Défis** | Résistance, conflits et stress |
| 👑 | **Leadership & Coaching** | Postures et soft skills |
| 🏗️ | **Multi-équipes & Scale** | Coordination et scaling agile |
| 🎯 | **Contextes Spécialisés** | Situations particulières et secteurs |
| 🎨 | **Product & Design** | Product management et design thinking |
| 🌱 | **Transformation & Culture** | Conduite du changement organisationnel |
| 🛠️ | **Outils & Technologies** | Applications et outils digitaux |
| 📚 | **Développement Coach** | Formation et montée en compétences |
| 📋 | **Ressources & REX** | Templates et retours d'expérience |
| ⚙️ | **Outils Interactifs** | Calculateurs et outils pratiques |

### 🛠️ 3. Outils interactifs

Chaque outil est **autonome** et fonctionne sans serveur :

- **Planning Poker** : Estimation collaborative
- **Rétrospectives** : Multiples formats (Starfish, 4L, Timeline...)
- **Example Mapping** : Exploration des User Stories
- **Velocity Squad** : Graphiques de vélocité
- **Skills Matrix** : Matrice de compétences d'équipe
- **Ikigai** : Personnel et d'équipe
- **Agile Fluency Model** : Évaluation de maturité

### 📖 4. Contenus Markdown

Chaque catégorie dispose de **contenus pédagogiques** :
- Articles de fond
- Guides pratiques
- Retours d'expérience
- Templates et checklists

Les fichiers Markdown sont **interprétés à la volée** et affichés avec style.

### 🎨 5. Design moderne

- **Dark mode** par défaut (confortable pour les yeux)
- **Responsive** : adapté mobile, tablette, desktop
- **Accessibilité** : ARIA labels, contraste élevé
- **Couleurs vives** pour différencier les catégories
- **Animations fluides** et micro-interactions

---

## 🧩 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Variables CSS, Grid, Flexbox
- **JavaScript Vanilla** : Aucune dépendance externe
- **Markdown** : Pour les contenus
- **JSON** : Configuration centralisée

**Aucun framework lourd** → Performance maximale et légèreté.

---

## 🚀 Guide d'utilisation

### Navigation

#### Desktop
- **Sidebar gauche** : Liste des 14 catégories
- **Onglets** : "Tout voir" / "Favoris" / "Récents"
- **Recherche** : Barre de recherche en haut

#### Mobile
- **Burger menu** : Accès à la sidebar
- **Icônes** : Représentation visuelle des catégories
- **Swipe** : Navigation tactile

### Ajouter aux favoris

Cliquez sur ⭐ pour marquer un outil ou une catégorie comme favori.
Les favoris sont **sauvegardés localement** (localStorage).

### Partager un contenu

Chaque page génère une **URL unique** partageable :
```
https://agile-coach-toolkit.dev/category/animation
https://agile-coach-toolkit.dev/tools/planning-poker
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
  "icon": "fire"
}
```

2. **Créer le dossier de contenu** :

```bash
mkdir content/nouvelle-categorie
touch content/nouvelle-categorie/introduction.md
```

3. **Relancer** : Le site détecte automatiquement la nouvelle catégorie.

### Ajouter un outil interactif

1. **Créer la structure** :

```bash
mkdir tools/mon-outil
cd tools/mon-outil
touch index.html script.js style.css README.md
```

2. **Utiliser le template** (voir `tool-template.html`) :

```html
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
  <!-- Header de retour -->
  <header class="tool-header">
    <a href="../../index.html" class="back-btn">← Retour au toolkit</a>
  </header>

  <!-- Votre contenu -->
  <main>
    <h1>Mon Outil</h1>
    <!-- ... -->
  </main>

  <script src="script.js"></script>
</body>
</html>
```

3. **Documenter dans `README.md`** :

```markdown
# Mon Outil

## Description
Cet outil permet de...

## Utilisation
1. Étape 1
2. Étape 2

## Fonctionnalités
- Feature 1
- Feature 2
```

### Modifier le thème

Toutes les couleurs sont dans `assets/css/variables.css` :

```css
:root {
  --accent-blue: #58a6ff;    /* Modifier ici */
  --cat-fondamentaux: #FF6B6B;
  /* ... */
}
```

---

## 📊 Statistiques du projet

- **Langages** : HTML, CSS, JavaScript
- **Taille** : ~500 KB (sans images)
- **Performance** : Lighthouse Score > 95/100
- **Compatibilité** : Chrome, Firefox, Safari, Edge (versions récentes)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 🎉

### Comment contribuer

1. **Fork** le projet
2. **Créez une branche** : `git checkout -b feature/ma-feature`
3. **Committez** : `git commit -m "Ajout de ma feature"`
4. **Pushez** : `git push origin feature/ma-feature`
5. **Ouvrez une Pull Request**

### Guidelines

- Respecter la structure du projet
- Documenter les nouvelles fonctionnalités
- Tester sur mobile et desktop
- Suivre le style de code existant

---

## 🐛 Signaler un bug

Ouvrez une **issue** sur GitHub avec :
- Description du problème
- Étapes pour reproduire
- Captures d'écran si pertinent
- Navigateur et version

---

## 📜 Licence

Ce projet est sous licence **MIT** - voir [LICENSE](LICENSE) pour plus de détails.

**Résumé** : Vous pouvez utiliser, modifier et distribuer ce projet librement, même commercialement.

---

## 👨‍💻 Auteur

**Sébastien** 🎓

- 🔗 LinkedIn : [Votre profil](https://www.linkedin.com/in/sebastien-rouen/)
- 📧 Email : sebastien@rouen.info

---

## 🙏 Remerciements

- Communauté Agile francophone
- Open-source contributors
- Tous les coachs qui partagent leurs pratiques

---

## 📅 Roadmap

### Version 1.1 (Q2 2024)
- [ ] Mode clair/sombre switchable
- [ ] Export PDF des contenus
- [ ] Traduction anglaise
- [ ] PWA (Progressive Web App)

### Version 1.2 (Q3 2024)
- [ ] Système de commentaires
- [ ] Partage social amélioré
- [ ] Statistiques d'usage
- [ ] Mode hors-ligne complet

---

## 💡 FAQ

**Q : Puis-je utiliser ce toolkit en entreprise ?**  
R : Oui, la licence MIT le permet. Aucune restriction commerciale.

**Q : Les données sont-elles sauvegardées en ligne ?**  
R : Non, tout est local (localStorage). Aucune donnée ne quitte votre navigateur.

**Q : Comment mettre à jour le toolkit ?**  
R : `git pull` pour récupérer les dernières modifications, ou télécharger la dernière release.

**Q : Puis-je héberger ma propre version ?**  
R : Absolument ! Déployez sur GitHub Pages, Netlify, Vercel, ou votre serveur.

---

## 📱 Captures d'écran

### Desktop
![Homepage Desktop](docs/screenshots/desktop-home.png)
![Wizard](docs/screenshots/wizard.png)
![Catégorie](docs/screenshots/category.png)

### Mobile
![Mobile Menu](docs/screenshots/mobile-menu.png)
![Mobile Tool](docs/screenshots/mobile-tool.png)

---

## 🔗 Liens utiles

- [Documentation technique complète](docs/DOCUMENTATION.md)
- [Changelog des versions](CHANGELOG.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Code de conduite](CODE_OF_CONDUCT.md)

---

**Fait avec ❤️ grâce à la communauté Agile**

⭐ **Si ce projet vous aide, n'hésitez pas à lui donner une étoile !** ⭐