# 📖 DOCUMENTATION - Agile Coach Toolkit

> Documentation technique et fonctionnelle complète du projet

**Version :** 1.0.0  
**Dernière mise à jour :** 15 janvier 2024  
**Auteur :** Sébastien - Coach Sticko

---

## 📑 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Guide d'installation](#guide-dinstallation)
4. [Configuration](#configuration)
5. [Structure des données](#structure-des-données)
6. [Création de contenu](#création-de-contenu)
7. [Personnalisation](#personnalisation)
8. [Déploiement](#déploiement)
9. [Maintenance](#maintenance)
10. [Contribution](#contribution)
11. [FAQ](#faq)

---

## 🎯 Vue d'ensemble

### Objectif du projet

**Agile Coach Toolkit** est une plateforme web open-source destinée aux coachs agiles, Scrum Masters, Product Owners et équipes souhaitant :

- ✅ Accéder rapidement à des ressources pédagogiques sur l'agilité
- ✅ Utiliser des outils interactifs (Planning Poker, rétrospectives, matrices...)
- ✅ Structurer leurs connaissances par catégories thématiques
- ✅ Partager des bonnes pratiques et retours d'expérience

### Caractéristiques principales

- **🌐 100% client-side** : pas de backend, hébergeable sur GitHub Pages, Netlify, etc.
- **📱 Responsive** : mobile-first, tablette et desktop
- **🎨 Dark mode** : palette sombre et colorée par défaut
- **🧭 Wizard intelligent** : guide l'utilisateur selon son profil
- **📄 Contenu en Markdown** : facile à éditer et versionner
- **🔍 Recherche** : recherche rapide dans les catégories et contenus
- **⭐ Favoris & Récents** : personnalisation de l'expérience utilisateur
- **🔗 URLs partageables** : chaque page a une URL unique

---

## 🏗️ Architecture

### Stack technique

| Composant | Technologie | Raison du choix |
|-----------|-------------|-----------------|
| **HTML** | HTML5 sémantique | Accessibilité, SEO |
| **CSS** | CSS3 natif (variables, grid, flexbox) | Performance, maintenabilité |
| **JavaScript** | ES6+ vanilla | Pas de dépendances, rapidité |
| **Markdown** | Parser custom | Contrôle total, légèreté |
| **Données** | JSON statique | Simplicité, pas de DB |

### Principes architecturaux

1. **Progressive Enhancement** : le site fonctionne sans JS (contenu statique)
2. **Mobile-first** : conçu d'abord pour mobile, puis adapté
3. **Modularité** : chaque fichier JS < 800 lignes, CSS par composants
4. **Performance** : lazy loading, debounce, pas de frameworks lourds
5. **Accessibilité** : ARIA, contraste, navigation clavier

---

## 🚀 Guide d'installation

### Prérequis

- **Navigateur moderne** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Serveur web local** (optionnel pour le développement)

### Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/yourusername/agile-coach-toolkit.git
cd agile-coach-toolkit

# 2. Lancer un serveur local
# Option A : Python 3
python3 -m http.server 8000

# Option B : Node.js (npx)
npx serve

# Option C : PHP
php -S localhost:8000

# 3. Ouvrir dans le navigateur
# http://localhost:8000
```

### Installation pour contribution

```bash
# 1. Fork du repository sur GitHub

# 2. Clone de votre fork
git clone https://github.com/YOUR_USERNAME/agile-coach-toolkit.git
cd agile-coach-toolkit

# 3. Créer une branche pour vos modifications
git checkout -b feature/ma-nouvelle-fonctionnalite

# 4. Faire vos modifications

# 5. Commit et push
git add .
git commit -m "feat: ajout de [fonctionnalité]"
git push origin feature/ma-nouvelle-fonctionnalite

# 6. Créer une Pull Request sur GitHub
```

---

## ⚙️ Configuration

### Fichier `config/config.json`

Le fichier de configuration central contient :

```json
{
  "siteTitle": "Coach Agile Toolkit",
  "siteDescription": "Outils gratuits pour l'agilité",
  "version": "1.0.0",
  "author": "Sébastien - Coach Sticko",
  "categories": [ /* ... */ ],
  "tools": [ /* ... */ ],
  "settings": {
    "defaultTheme": "dark",
    "enableWizard": true,
    "enableSearch": true,
    "maxRecents": 20,
    "searchMinChars": 2
  }
}
```

### Personnalisation des couleurs

Modifier `assets/css/variables.css` :

```css
:root {
  /* Couleurs principales */
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  
  /* Couleurs par catégorie */
  --color-fondamentaux: #3b82f6;
  --color-frameworks: #10b981;
  /* ... */
}
```

### Ajout d'une nouvelle catégorie

1. **Modifier `config/config.json`** :

```json
{
  "id": "ma-categorie",
  "title": "🚀 Ma Catégorie",
  "subtitle": "Description courte",
  "color": "#ff6b6b",
  "emoji": "🚀",
  "order": 15
}
```

2. **Créer le dossier de contenu** :

```bash
mkdir -p content/ma-categorie
```

3. **Créer l'index JSON** :

```bash
touch content/ma-categorie/index.json
```

4. **Ajouter des contenus Markdown** :

```bash
touch content/ma-categorie/mon-article.md
```

---

## 📊 Structure des données

### Catégorie (`config/config.json`)

```typescript
{
  id: string;              // Identifiant unique (slug)
  title: string;           // Titre affiché
  subtitle: string;        // Description courte
  color: string;           // Couleur hexadécimale
  emoji: string;           // Emoji représentatif
  order: number;           // Ordre d'affichage
}
```

### Contenu (`content/{category}/index.json`)

```typescript
{
  id: string;              // Identifiant unique
  title: string;           // Titre
  subtitle: string;        // Sous-titre
  slug: string;            // Slug URL
  file: string;            // Nom du fichier .md
  type: string;            // article | guide | concept | liste | outil
  difficulty: string;      // débutant | intermédiaire | avancé
  readTime: number;        // Minutes de lecture
  tags: string[];          // Tags de recherche
  icon: string;            // Emoji
  featured: boolean;       // Mis en avant
  updated: string;         // Date ISO 8601
}
```

### Frontmatter Markdown

```yaml
---
title: Titre de l'article
subtitle: Sous-titre
author: Coach Sticko
date: 2024-01-15
tags: [tag1, tag2, tag3]
difficulty: intermédiaire
readTime: 8
icon: 📚
---
```

---

## ✍️ Création de contenu

### Workflow de création

1. **Choisir la catégorie** appropriée
2. **Créer le fichier Markdown** dans `content/{category}/`
3. **Ajouter le frontmatter** avec les métadonnées
4. **Écrire le contenu** en Markdown
5. **Référencer dans `index.json`** de la catégorie
6. **Tester localement**
7. **Commit et push**

### Template de contenu Markdown

```markdown
---
title: Votre titre
subtitle: Votre sous-titre
author: Coach Sticko
date: 2024-01-15
tags: [tag1, tag2]
difficulty: débutant
readTime: 5
icon: 📄
---

# Titre principal

> Citation ou introduction

Votre contenu ici...

## Section 1

Contenu de la section...

### Sous-section

- Point 1
- Point 2

## 💡 Ce qu'il faut retenir

- ✅ Point clé 1
- ✅ Point clé 2

## 📚 Pour aller plus loin

- [Lien 1](https://example.com)
- [Lien 2](https://example.com)

---

**Dernière mise à jour :** {date}  
**Auteur :** {author}
```

### Syntaxe Markdown supportée

- **Headers** : `# H1`, `## H2`, `### H3`
- **Gras** : `**texte**` ou `__texte__`
- **Italique** : `*texte*` ou `_texte_`
- **Code inline** : `` `code` ``
- **Bloc de code** : ` ```langue ... ``` `
- **Liens** : `[texte](url)`
- **Images** : `![alt](url)`
- **Listes** : `- item` ou `1. item`
- **Blockquotes** : `> citation`
- **Ligne horizontale** : `---` ou `***`

---

## 🎨 Personnalisation

### Modifier le logo

Remplacer les fichiers :
- `assets/icons/logo.svg` (logo principal)
- `assets/images/favicon.svg` (favicon)

### Modifier les polices

Dans `assets/css/variables.css` :

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
}
```

### Ajouter des styles personnalisés

Créer `assets/css/custom.css` et l'inclure dans `index.html` :

```html
<link rel="stylesheet" href="assets/css/custom.css">
```

---

## 🚀 Déploiement

### GitHub Pages

```bash
# 1. Activer GitHub Pages dans Settings > Pages
# Source : main branch / root

# 2. Pousser vos modifications
git push origin main

# 3. Accéder à https://username.github.io/agile-coach-toolkit/
```

### Netlify

```bash
# 1. Connecter votre repo GitHub à Netlify
# 2. Build command : (vide)
# 3. Publish directory : .
# 4. Deploy !
```

### Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Suivre les instructions
```

### Serveur Apache/Nginx

```bash
# 1. Copier les fichiers sur le serveur
scp -r . user@server:/var/www/html/toolkit/

# 2. Configuration Apache (.htaccess)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# 3. Configuration Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 🔧 Maintenance

### Mise à jour du contenu

```bash
# 1. Éditer les fichiers .md dans content/
# 2. Mettre à jour les dates dans index.json
# 3. Commit et push
git add content/
git commit -m "docs: mise à jour du contenu [catégorie]"
git push
```

### Mise à jour de version

```bash
# 1. Modifier version dans config/config.json et package.json
# 2. Mettre à jour CHANGELOG.md
# 3. Tag Git
git tag v1.1.0
git push --tags
```

### Monitoring

- **Analytics** : intégrer Google Analytics ou Plausible
- **Errors** : Sentry pour les erreurs JS
- **Performance** : Lighthouse CI

---

## 🤝 Contribution

### Guidelines

1. **Fork** le projet
2. **Créer une branche** pour votre feature
3. **Respecter les conventions** de code
4. **Tester** vos modifications
5. **Documenter** (README, CHANGELOG)
6. **Créer une Pull Request**

### Conventions de commit

Format : `type(scope): message`

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, CSS
- `refactor`: Refactorisation
- `test`: Tests
- `chore`: Maintenance

**Exemples :**
```bash
git commit -m "feat(wizard): ajout étape de personnalisation"
git commit -m "fix(search): correction regex accents"
git commit -m "docs(readme): ajout section déploiement"
```

---

## ❓ FAQ

### Le site ne se charge pas localement

**Problème :** `file://` protocol restrictions

**Solution :** Utiliser un serveur local :
```bash
python3 -m http.server 8000
```

### Les fichiers Markdown ne s'affichent pas

**Causes possibles :**
- Chemin incorrect dans `index.json`
- Erreur de parsing Markdown
- CORS (si fichier externe)

**Debug :**
```javascript
// Ouvrir la console (F12)
// Vérifier les erreurs réseau et JS
```

### Comment ajouter un outil interactif ?

1. Créer un dossier `tools/mon-outil/`
2. Ajouter `index.html` avec l'outil
3. Référencer dans `config/config.json` :

```json
{
  "tools": [
    {
      "id": "mon-outil",
      "title": "Mon Outil",
      "category": "outils-interactifs",
      "url": "tools/mon-outil/"
    }
  ]
}
```

### Le wizard ne se lance pas

**Vérifier :**
- `localStorage` activé dans le navigateur
- `config.json` bien chargé
- Console pour erreurs JS

### Comment changer la langue ?

Actuellement en français. Pour internationalisation :
1. Créer `i18n/en.json`, `i18n/fr.json`
2. Modifier les scripts pour charger selon `navigator.language`
3. Dupliquer les contenus Markdown par langue

---

## 📞 Support

- **Issues GitHub** : [github.com/username/agile-coach-toolkit/issues](https://github.com/username/agile-coach-toolkit/issues)
- **Discussions** : [github.com/username/agile-coach-toolkit/discussions](https://github.com/username/agile-coach-toolkit/discussions)
- **Email** : contact@example.com
- **LinkedIn** : [Sébastien - Coach Sticko](https://linkedin.com)

---

## 📜 Licence

MIT License - Voir [LICENSE](../LICENSE)

---

**🎉 Merci de contribuer à l'Agile Coach Toolkit !**