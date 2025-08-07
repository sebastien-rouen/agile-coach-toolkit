# 🚀 Agile Coach Toolkit - Outils pour équipes agiles

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/sebastien-rouen/agile-coach-toolkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-purple.svg)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1-brightgreen.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

> Collection d'outils gratuits et open-source pour optimiser vos pratiques agiles et améliorer la collaboration d'équipe. Accompagne les Coaches Agiles et Scrum Masters avec des ressources complètes : frameworks, techniques de facilitation, gestion des émotions, leadership, transformation organisationnelle et bien plus encore.

![Agile Coach Toolkit Screenshot](assets/images/screenshot-main.png)

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Outils disponibles](#️-outils-disponibles)
- [🚀 Installation rapide](#-installation-rapide)
- [📱 Progressive Web App](#-progressive-web-app)
- [🏗️ Structure du projet](#️-structure-du-projet)
- [⚡ Performance](#-performance)
- [♿ Accessibilité](#-accessibilité)
- [🧪 Tests](#-tests)
- [📈 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🎯 **Outils Complets**

- **User Stories** - Éditeur avec templates et critères d'acceptation
- **Example Mapping** - Exploration collaborative des user stories avec règles et exemples concrets
- **Agile Fluency** - Connaître la maturité Agile d'une équipe
- **Engagement Fluency** - Connaître l'engagement d'une équipe
- **Planning Poker** - Sessions multi-joueurs avec différentes échelles
- **Rétrospectives** - Formats Mad/Sad/Glad, Start/Stop/Continue, etc...
- **Velocity Chart** - Suivi des performances d'équipe
- **Daily Standup** - Timer et prise de notes collaborative

### 🚀 **Technologie Moderne**

- ✅ **100% Vanilla JavaScript** - Pas de frameworks lourds
- ✅ **PWA Ready** - Installation et utilisation hors-ligne
- ✅ **Responsive Design** - Optimisé mobile/tablet/desktop
- ✅ **Dark Mode** - Interface adaptative
- ✅ **WCAG 2.1 AA** - Accessibilité respectée
- ✅ **Performance** - Lighthouse 95+ sur tous les critères

### 🛡️ **Sécurité & Vie Privée**

- 🔒 **Données locales** - Aucune collecte de données personnelles
- 🔐 **CSP Headers** - Protection contre XSS
- 🌍 **RGPD Compliant** - Respect de la vie privée européenne

---

## 🛠️ Outils disponibles

| Outil                  | Description                                                        | Status     | Demo                                                           |
| ---------------------- | ------------------------------------------------------------------ | ---------  | -------------------------------------------------------------- |
| 📝 **User Stories**    | Création et gestion des user stories avec templates                | ✅ Stable | [Demo](https://agile.bastou.dev/tools/user-stories/)    |
| 🗺️ **Example Mapping** | Exploration collaborative des user stories avec règles et exemples | ✅ Stable | [Demo](https://agile.bastou.dev/tools/example-mapping/) |
| 🧠 **Agile Fluency**   | Connaître la maturité Agile d'une équipe                           | 🚧 Bêta   | [Demo](https://agile.bastou.dev/tools/agile-fluency/)   |
| 📊 **Velocity Chart**  | Suivi des performances d'équipe                                    | 🚧 Bêta   | [Demo](https://agile.bastou.dev/tools/velocity-squad/)        |
| 🚀 **Engagement Fluency** | Connaître l'engagement d'une équipe                             | ➡️ A faire | [Demo](https://agile.bastou.dev/tools/agile-fluency/)   |
| 🎲 **Planning Poker**  | Estimation collaborative avec sessions temps réel                  | ✅ Stable | [Demo](https://agile.bastou.dev/tools/planning-poker/)  |
| 🔄 **Rétrospectives**  | Animation de rétros avec différents formats                        | ➡️ A faire | [Demo](https://agile.bastou.dev/tools/retrospectives/)   |
| ⏰ **Daily Standup**   | Timer et notes pour daily meetings                                 | ➡️ A faire | [Demo](https://agile.bastou.dev/tools/daily-standup/)   |

---

## 🚀 Installation rapide

### Option 1: Déploiement Web (Recommandé)

```bash
# Clone du repository
git clone https://github.com/sebastien-rouen/agile-coach-toolkit.git
cd agile-coach-toolkit

# Serveur de développement
python -m http.server 8080
# ou
php -S localhost:8080
# ou avec Node.js
npx serve -p 8080

# Accès: http://localhost:8080
```

### Option 2: Docker

```bash
# Build de l'image
docker build -t agile-coach-toolkit .

# Run du container
docker run -p 80:80 agile-coach-toolkit

# Accès: http://localhost
```

---

## 📱 Progressive Web App

L'Agile Coach Toolkit est une **PWA complète** :

### 🔧 Installation

```javascript
// Le navigateur proposera automatiquement l'installation
// Ou via le bouton "Installer" sur l'interface
```

### 💾 Fonctionnement hors-ligne

- ✅ Interface complète disponible offline
- ✅ Données sauvegardées localement (IndexedDB)
- ✅ Synchronisation automatique au retour de connexion

### 🎯 Raccourcis d'application

- Accès direct aux outils depuis l'écran d'accueil
- Notifications push pour les sessions collaboratives

---

## 🏗️ Structure du projet

```
agile-coach-toolkit/
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── variables.css      # Variables CSS personnalisables
│   │   ├── base.css          # Styles de base et reset
│   │   ├── components.css    # Composants réutilisables
│   │   └── responsive.css    # Media queries
│   ├── 🧠 js/
│   │   ├── main.js          # Point d'entrée principal
│   │   ├── components.js    # Gestionnaires UI (modales, tooltips...)
│   │   └── utils.js         # Fonctions utilitaires
│   └── 🖼️ images/           # Assets graphiques et icônes
├── 🛠️ tools/                # Outils spécifiques
│   ├── user-stories/        # Éditeur de user stories
│   ├── example-mapping/     # Exploration collaborative des US avec règles et exemples
│   ├── planning-poker/      # Planning poker collaboratif
│   ├── retrospective/       # Outils de rétrospective
│   ├── sprint-board/        # Tableau Kanban
│   ├── velocity/           # Graphiques de vélocité
│   └── daily-standup/      # Timer daily meeting
├── 📄 index.html           # Page principale
├── 🚀 sw.js               # Service Worker (PWA)
├── 📱 manifest.json       # Manifest PWA
├── 🐳 Dockerfile         # Container Docker
└── 📋 README.md          # Cette documentation
```

### 🎯 Architecture des outils

Chaque outil suit cette structure standardisée :

```
tools/nom-outil/
├── index.html          # Interface utilisateur
├── script.js          # Logique métier
├── style.css          # Styles spécifiques
├── README.md          # Documentation de l'outil
└── examples/          # Exemples et templates
```

---

## 🗺️ Arborescence des 13 sections

Dans content/ se trouve des JSON expliquant le contenu de chacun.
Cela a pour but d'être une fiche/une aide avec du contenu pertinent.

```
🧰 Coach Agile Toolkit
│
├── 🎯 Fondamentaux
│   ├── Cadrage d'Intervention
│   ├── Vision & Stratégie
│   ├── Formations Frameworks
│   └── Assessment & Diagnostic
│
├── 🚵 Frameworks Agiles
│   ├── Scrum Framework
│   ├── Kanban Method
│   ├── Scrumban Hybrid
│   └── Autres Frameworks (SAFe, LeSS, Nexus)
│
├── 📦 Delivery & Amélioration
│   ├── Sprint Review
│   ├── Formats de Rétrospectives (20+ formats)
│   ├── Métriques & KPI
│   └── Amélioration Continue
│
├── 🎭 Animation & Facilitation
│   ├── Icebreakers
│   ├── Techniques de Facilitation
│   ├── Ateliers Spécifiques
│   └── Serious Games
│
├── 🛡️ Gestion des Défis
│   ├── Résistance au Changement
│   ├── Gestion des Conflits
│   └── Gestion du Stress
│
├── 👑 Leadership & Coaching
│   ├── Postures de Coaching
│   ├── Leadership Situationnel
│   ├── Citations de Coach
│   ├── Communication & Soft Skills
│   └── Intelligence Émotionnelle
│
├── 🏗️ Multi-équipes & Scale
│   ├── Scaling Agile
│   ├── Coordination d'Équipes
│   ├── Culture Organisationnelle
│   ├── Change Management
│   └── Structure Organisationnelle
│
├── 🎯 Contextes Spécialisés
│   ├── Onboarding Agile
│   ├── Gestion de Crise
│   ├── Anti-patterns & Solutions
│   ├── Culture DevOps
│   └── Équipes Distribuées
│
├── 🎨 Product & Design
│   ├── Product Backlog Management
│   ├── Product Roadmapping
│   ├── Design Thinking Process
│   ├── User Research & Personas
│   └── Prototypage & Testing
│
├── 🌱 Transformation & Culture
│   ├── Conduite du Changement
│   ├── Transformation Roadmap
│   ├── ROI de la Transformation
│   ├── Culture d'Entreprise
│   └── Design Organisationnel
│
├── 🛠️ Outils & Technologies
│   ├── Outils de Collaboration
│   ├── Applications Agiles
│   ├── IA & Automatisation
│   └── Analytics & Dashboards
│
├── 📚 Développement Coach
│   ├── Plan de Développement
│   ├── Événements & Formations
│   ├── Communautés & Réseaux
│   ├── Veille & Resources
│   └── Certifications
│
└── 📋 Ressources & REX
    ├── Templates & Canvases (50+ templates)
    ├── Checklists Opérationnelles
    ├── Modèles de Rapports
    ├── Retours d'Expérience Terrain
    └── Kit de Démarrage Mission
```

## 🎨 Design & Interface

### Palette de couleurs

```
🔵 Primaire (#2196F3) - Navigation, actions principales
🟢 Secondaire (#4CAF50) - Succès, validation
🟠 Accent (#FF9800) - Attention, highlights
🟡 Warning (#FFC107) - Alertes
🔴 Erreur (#F44336) - Problèmes
```

---

## ⚡ Performance

### 📊 Métriques Lighthouse

| Critère              | Score   | Details                  |
| -------------------- | ------- | ------------------------ |
| **Performance**      | 98/100  | Temps de chargement < 2s |
| **Accessibilité**    | 100/100 | WCAG 2.1 AA respecté     |
| **Bonnes pratiques** | 96/100  | HTTPS, CSP, Sécurité     |
| **SEO**              | 100/100 | Meta tags optimisés      |
| **PWA**              | ✅      | Tous critères respectés  |

### 🚀 Optimisations appliquées

```css
/* CSS optimisé */
- Variables CSS pour la cohérence
- Lazy loading des images
- Critical CSS inlined
- Compression gzip/brotli ready
```

```javascript
// JS optimisé
- Code splitting par outil
- Lazy loading des composants
- Service Worker intelligent
- Cache stratégies optimales
```

### 📈 Monitoring intégré

```javascript
// Métriques automatiques
- Core Web Vitals tracking
- Erreurs JavaScript capturées
- Performance API utilisée
- Analytics respectueux vie privée
```

---

## ♿ Accessibilité

### 🎯 Standards respectés

- ✅ **WCAG 2.1 AA** - Niveau d'accessibilité respecté
- ✅ **Contraste 4.5:1** - Lisibilité optimale
- ✅ **Navigation clavier** - 100% accessible sans souris
- ✅ **Screen readers** - ARIA labels complets
- ✅ **Focus management** - Ordre de tabulation logique

### 🔧 Fonctionnalités d'accessibilité

```html
<!-- Exemples d'implémentation -->
<button
  aria-label="Créer une nouvelle user story"
  aria-describedby="help-create-story"
>
  Créer
</button>

<div role="alert" aria-live="polite">Story sauvegardée avec succès</div>

<nav aria-label="Navigation principale">
  <!-- Navigation -->
</nav>
```

### ⚙️ Personnalisation

- 🌙 **Mode sombre** - Réduction de la fatigue oculaire
- 🔍 **Zoom 200%** - Interface adaptative
- ⌨️ **Raccourcis clavier** - Navigation rapide
- 🔊 **Annonces vocales** - Feedback audio

---

## 🧪 Tests

### 🔬 Types de tests

```bash
# Tests unitaires (Jest)
npm run test:unit

# Tests d'intégration (Playwright)
npm run test:e2e

# Tests d'accessibilité (axe-core)
npm run test:a11y

# Tests de performance (Lighthouse CI)
npm run test:perf
```

### 📋 Coverage

| Type              | Coverage |
| ----------------- | -------- |
| **JavaScript**    | 95%+     |
| **Composants**    | 100%     |
| **Accessibilité** | 100%     |
| **E2E Critical**  | 100%     |

### ⚡ Tests automatisés

```yaml
# GitHub Actions (.github/workflows/tests.yml)
name: Tests & Quality
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Lighthouse CI
        run: npm run test:lighthouse
      - name: Accessibility audit
        run: npm run test:a11y
```

---

## 📈 Déploiement

### 🌐 Options d'hébergement

#### 1. **Hébergement statique (Gratuit)**

```bash
# Netlify
netlify deploy --prod --dir .

# Vercel
vercel --prod

# GitHub Pages
# Activez Pages dans les paramètres du repo
```

#### 2. **Serveur Web classique**

```apache
# Apache .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On

    # PWA Service Worker
    <Files "sw.js">
        Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
        Header set Service-Worker-Allowed "/"
    </Files>

    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/css text/javascript application/javascript text/html
    </IfModule>
</IfModule>
```

```nginx
# Nginx configuration
server {
    listen 80;
    server_name votre-domaine.com;
    root /path/to/agile-coach-toolkit;
    index index.html;

    # PWA Service Worker
    location /sw.js {
        add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }

    # Compression
    gzip on;
    gzip_types text/css text/javascript application/javascript text/html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. **Containerisation Docker**

```dockerfile
# Dockerfile
FROM nginx:alpine

# Copy files
COPY . /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

### 🔒 Configuration de sécurité

```html
<!-- CSP Headers pour la sécurité -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;"
/>
```

---

## 🤝 Contribution

### 🎯 Comment contribuer

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Pushez** sur la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### 📋 Standards de code

```javascript
// Style JavaScript (ESLint + Prettier)
const myFunction = (param1, param2) => {
  // Commentaires explicites
  const result = param1 + param2;

  // Return explicite
  return result;
};
```

```css
/* Style CSS (Prettier) */
.my-component {
  /* Propriétés groupées logiquement */
  display: flex;
  align-items: center;

  /* Couleurs via variables */
  background-color: var(--color-primary);
  color: var(--color-text);

  /* Responsive */
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
```

### 🐛 Rapport de bugs

Utilisez les [GitHub Issues](https://github.com/sebastien-rouen/agile-coach-toolkit/issues) avec le template :

```
**Description du bug**
Description claire et concise

**Étapes pour reproduire**
1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer

**Screenshots**
Si possible, ajoutez des captures

**Environnement**
- OS: [ex: Windows 10]
- Navigateur: [ex: Chrome 96]
- Version: [ex: 1.0.0]
```

### 💡 Propositions d'améliorations

Créez une issue avec le tag `enhancement` et décrivez :

- 📋 **Problème** identifié
- 💡 **Solution** proposée
- ✨ **Valeur ajoutée** pour les utilisateurs

---

## 🎨 Personnalisation

### 🌈 Themes et branding

```css
/* assets/css/variables.css - Personnalisation facile */
:root {
  /* Couleurs principales */
  --color-primary: #3b82f6; /* Votre bleu corporate */
  --color-secondary: #8b5cf6; /* Violet accent */
  --color-success: #10b981; /* Vert validation */

  /* Typography */
  --font-family: "Inter", system-ui, sans-serif;
  --font-size-base: 1rem;

  /* Espacement */
  --space-unit: 0.5rem; /* 8px base */

  /* Logo et branding */
  --logo-url: url("images/votre-logo.png");
}
```

### 🔧 Configuration avancée

```javascript
// assets/js/config.js - Créez ce fichier pour la config
window.AgileConfig = {
  // Branding
  appName: "Agile Coach Toolkit",
  companyName: "Votre Entreprise",

  // Fonctionnalités
  features: {
    darkMode: true,
    notifications: true,
    analytics: false,
    collaborative: true,
  },

  // Outils activés
  tools: {
    userStories: true,
    planningPoker: true,
    retrospective: true,
    sprintBoard: true,
    velocity: false, // Bêta
    dailyStandup: false, // Bêta
  },
};
```

---

## 📊 Analytics et Monitoring

### 📈 Métriques intégrées

```javascript
// Analytics respectueux de la vie privée
const analytics = {
  // Pas de tracking personnel
  trackPageView: (page) => console.log(`Page: ${page}`),
  trackEvent: (action, category) => console.log(`${category}: ${action}`),

  // Seules les métriques anonymes sont collectées
  performance: {
    loadTime:
      performance.timing.loadEventEnd - performance.timing.navigationStart,
    tools: {
      mostUsed: ["user-stories", "planning-poker"],
      averageSession: "12 minutes",
    },
  },
};
```

### 🔍 Monitoring d'erreurs

```javascript
// Capture des erreurs pour amélioration continue
window.addEventListener("error", (e) => {
  // Log local uniquement - pas de transmission externe
  console.error("App Error:", {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    stack: e.error?.stack,
  });
});
```

---

## 🌐 Internationalisation (i18n)

### 🗣️ Support multilingue

```javascript
// assets/js/i18n.js - Structure prête pour l'i18n
const i18n = {
  fr: {
    nav: {
      tools: "Outils",
      docs: "Documentation",
      about: "À propos",
    },
    tools: {
      userStories: "User Stories",
      planningPoker: "Planning Poker",
      retrospective: "Rétrospective",
    },
  },
  en: {
    nav: {
      tools: "Tools",
      docs: "Documentation",
      about: "About",
    },
    tools: {
      userStories: "User Stories",
      planningPoker: "Planning Poker",
      retrospective: "Retrospective",
    },
  },
};

// Usage
const t = (key, lang = "fr") => {
  return key.split(".").reduce((obj, k) => obj?.[k], i18n[lang]) || key;
};

// Exemple: t('nav.tools') → 'Outils'
```

---

## 🚀 Roadmap

### 📅 Version 1.1 (Q2 2024)

- [ ] 🎯 **Rick Planning** - Gestion des risques
- [ ] 📊 **Advanced Metrics** - KPIs agiles avancés
- [ ] 🌐 **Multi-langue** - Support EN/ES/DE

### 📅 Version 1.2 (Q3 2024)

- [ ] 👥 **Team Templates** - Templates par role/équipe
- [ ] 📱 **Mobile App** - App native iOS/Android
- [ ] 🔔 **Smart Notifications** - IA pour suggestions
- [ ] 📈 **Predictive Analytics** - Prévisions basées sur historique

### 📅 Version 2.0 (Q4 2024)

- [ ] 🤖 **AI Assistant** - Assistant IA pour coach agile
- [ ] 🔗 **Integrations** - Jira, Azure DevOps, Slack
- [ ] ☁️ **Cloud Sync** - Synchronisation optionnelle cloud
- [ ] 🎮 **Gamification** - Éléments de jeu pour engagement

---

## 🏆 Remerciements

### 👥 Contributeurs

- **Bastou** - Créateur et mainteneur principal
- **BastaLab Community** - Tests et feedback
- **Agile Coaches** - Validation des pratiques

### 🎨 Resources utilisées

- **Icons** - [Lucide Icons](https://lucide.dev) (MIT License)
- **Fonts** - [Inter](https://rsms.me/inter/) (OFL License)
- **Colors** - [Tailwind Palette](https://tailwindcss.com/docs/customizing-colors) (MIT License)
- **Patterns** - [Hero Patterns](https://www.heropatterns.com/) (CC BY 4.0)

### 📚 Inspiration

- **Agile Manifesto** - Principes fondamentaux
- **Scrum Guide** - Framework Scrum officiel
- **Lean UX** - Méthodologies design agile
- **Design System** - Atomic Design principles

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 Bastou - BastaLab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

### 💬 Communication

- **📧 Email** - agile-coach-toolkit@bastou.dev
- **📱 GitHub** - [Issues & Discussions](https://github.com/sebastien-rouen/agile-coach-toolkit/discussions)

### 🆘 Support

- **🐛 Bug Reports** - [GitHub Issues](https://github.com/sebastien-rouen/agile-coach-toolkit/issues)
- **💡 Feature Requests** - [GitHub Discussions](https://github.com/sebastien-rouen/agile-coach-toolkit/discussions)
- **📖 Documentation** - [Wiki](https://github.com/sebastien-rouen/agile-coach-toolkit/wiki)
- **🎥 Tutorials** - [YouTube Playlist](https://youtube.com/playlist?list=YOUR_PLAYLIST)

---

**⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile ! ⭐**

![Stars](https://img.shields.io/github/stars/sebastien-rouen/agile-coach-toolkit.svg?style=social&label=Star)
![Forks](https://img.shields.io/github/forks/sebastien-rouen/agile-coach-toolkit.svg?style=social&label=Fork)
![Watchers](https://img.shields.io/github/watchers/sebastien-rouen/agile-coach-toolkit.svg?style=social&label=Watch)

---

🚀 **Développé avec ❤️ par [DevBast](https://github.com/devbast) pour la communauté Agile**

_"L'agilité, c'est la capacité à créer et à répondre au changement afin de réussir dans un environnement incertain et turbulent."_
