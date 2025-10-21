# 🛠️ Outils Agile - Coach Agile Toolkit

Collection d'outils interactifs gratuits et open-source pour optimiser vos pratiques agiles et améliorer la collaboration d'équipe.

## 📋 Table des Matières

- [Outils Disponibles](#-outils-disponibles)
- [Structure et Conventions](#-structure-et-conventions)
- [Créer un Nouvel Outil](#-créer-un-nouvel-outil)
- [Prompt Generator](#-prompt-generator-pour-ia)
- [Intégration au Site](#-intégration-au-site)
- [Contribution](#-contribution)

---

## 🎯 Outils Disponibles

### 📊 Agile Fluency
**Évaluation de maturité agile**

Outil d'auto-évaluation basé sur le modèle Agile Fluency de Diana Larsen et James Shore. Permet aux équipes de mesurer leur niveau de maîtrise agile et d'identifier les axes d'amélioration.

- **Méthodologie** : Agile Fluency Model
- **Cas d'usage** : Assessment d'équipe, diagnostic de maturité
- **Référence** : [agilefluency.org](https://www.agilefluency.org)

---

### 🗺️ Example Mapping
**Cartographie d'exemples BDD**

Facilite les ateliers d'Example Mapping pour clarifier les User Stories avant le développement. Organise les règles métier, exemples et questions en cartes colorées.

- **Méthodologie** : Example Mapping (Matt Wynne)
- **Cas d'usage** : Refinement, Three Amigos, BDD
- **Référence** : [cucumber.io/blog/example-mapping](https://cucumber.io/blog/bdd/example-mapping-webinar/)

---

### 🌸 Ikigai
**Découverte du sens personnel**

Outil de réflexion basé sur le concept japonais Ikigai pour aider les individus à trouver leur raison d'être professionnelle à l'intersection de leurs passions, talents, besoins du monde et rémunération.

- **Méthodologie** : Concept japonais Ikigai
- **Cas d'usage** : Coaching individuel, orientation de carrière
- **Référence** : Philosophie japonaise traditionnelle

---

### 💼 Ikigai Engagement
**Mesure d'engagement d'équipe**

Adaptation de l'Ikigai pour mesurer l'engagement collectif d'une équipe. Identifie les leviers de motivation et les zones d'amélioration pour renforcer la cohésion. Merci à la Tribu Engagement d'OCTO Technology ❤️

- **Méthodologie** : Ikigai appliqué au travail d'équipe
- **Cas d'usage** : Team building, rétrospectives, diagnostic d'engagement
- **Référence** : Adaptation du concept Ikigai

---

### 🃏 Planning Poker
**Estimation collaborative**

Outil de Planning Poker en ligne pour estimer les User Stories de manière collaborative. Support des suites Fibonacci, T-Shirt sizes, et gestion de sessions multi-joueurs.

- **Méthodologie** : Planning Poker (Scrum)
- **Cas d'usage** : Sprint Planning, Backlog Refinement
- **Référence** : [planningpoker.com](https://www.planningpoker.com)

---

### 🎓 Skills Matrix
**Matrice de compétences d'équipe**

Visualise et suit l'évolution des compétences de l'équipe. Identifie les experts, les zones de risque (single point of failure) et les besoins de formation.

- **Méthodologie** : Skill Matrix (Agile/Management 3.0)
- **Cas d'usage** : Gestion des compétences, formation, succession planning
- **Référence** : [management30.com/practice/competency-matrix](https://management30.com/practice/competency-matrix/)

---

### 🚀 Velocity Squad
**Tableau de bord de vélocité d'équipe**

Dashboard intelligent pour suivre la vélocité, prédire les capacités futures, gérer l'équipe et planifier les sprints. Support Scrum et Kanban avec 14 templates métiers pré-configurés.

- **Méthodologie** : Métriques Scrum/Kanban
- **Cas d'usage** : Suivi de performance, prédiction, planning, conseils, guide
- **Référence** : Scrum Guide, Kanban Method

---

### 🃏 Delegation Poker
**Clarification des niveaux de délégation**

Outil basé sur Management 3.0 pour clarifier les 7 niveaux de délégation (Tell, Sell, Consult, Agree, Advise, Inquire, Delegate) dans une équipe. Facilite les discussions sur la prise de décision et l'autonomie.

- **Méthodologie** : Management 3.0 (Jurgen Appelo)
- **Cas d'usage** : Clarification des responsabilités, onboarding managers, rétrospectives
- **Référence** : [management30.com/practice/delegation-poker](https://management30.com/practice/delegation-poker/)
- **Intégration PocketBase** : Sauvegarde des sessions, décisions, votes et consensus

---

## 🏗️ Structure et Conventions

### Architecture Standardisée

Chaque outil suit cette structure pour garantir cohérence et maintenabilité :

```
tools/{nom-outil}/
├── index.html              # Point d'entrée de l'outil
├── assets/
│   ├── css/
│   │   └── {nom-outil}.css # Styles isolés (max 800 lignes)
│   └── js/
│       └── {nom-outil}.js  # Logique métier (max 800 lignes)
├── js/                     # Scripts additionnels
│   └── pocketbase-integration.js # Intégration PocketBase (optionnel)
├── config/
│   └── config.json         # Configuration spécifique
├── docs/                   # Documentation technique (optionnel)
├── tests/                  # Tests unitaires (optionnel)
└── README.md               # Documentation complète
```

### Intégration PocketBase

Les outils peuvent optionnellement s'intégrer avec PocketBase pour la persistance des données :

```html
<!-- Dans index.html, en bas avant </body> -->
<!-- PocketBase Integration -->
<script src="../../assets/js/pocketbase-manager.js"></script>
<script src="js/pocketbase-integration.js"></script>

<!-- Intégration Agile Coach Toolkit -->
<script src="../../assets/js/tool-integration.js"></script>
<script>
    // Configuration spécifique à l'outil
    window.TOOL_CONFIG = {
        name: '{nom-outil}',
        backUrl: '../../index.html#tools'
    };
</script>
```

**Fonctionnalités PocketBase** :
- Sauvegarde automatique des sessions
- Partage de sessions via URL (`?session=xxx`)
- Fallback automatique vers localStorage si PocketBase indisponible
- Mode démo sans session pour tester l'outil

### Règles de Nommage

- **Dossiers** : kebab-case (`planning-poker`, `skills-matrix`)
- **Fichiers CSS/JS** : Identique au nom du dossier parent
- **Classes CSS** : Préfixer avec le nom de l'outil (`.planning-poker-card`, `.skills-matrix-cell`)
- **Variables CSS** : Utiliser les variables globales de `../../assets/css/base.css`

### Principes d'Architecture

#### 1. Autonomie
- Chaque outil fonctionne indépendamment
- Pas de dépendances entre outils
- Chargement isolé des ressources

#### 2. Réutilisation
- Utiliser les composants partagés : `../../assets/css/components/`
- Respecter les variables CSS globales : `--primary`, `--spacing-*`, `--border-radius`
- Importer uniquement les styles nécessaires

#### 3. Intégration au Thème

```css
/* ✅ Bon : Utiliser les variables globales */
.tool-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  color: var(--text-primary);
}

/* ❌ Mauvais : Valeurs en dur */
.tool-card {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
}
```

---

## 🆕 Créer un Nouvel Outil

### Checklist de Développement

Avant de créer ou modifier un outil :

- [ ] Structure de dossier respectée
- [ ] Fichiers CSS/JS < 800 lignes (sinon découper en composants)
- [ ] Classes CSS préfixées avec le nom de l'outil
- [ ] Variables CSS globales utilisées (thème clair/sombre)
- [ ] Outil fonctionnel en standalone
- [ ] README.md complet avec références méthodologiques
- [ ] Responsive et accessible (navigation clavier)
- [ ] Testé sur mobile et desktop
- [ ] Pas de dépendances externes non documentées
- [ ] Pas de CSS inline dans le JavaScript
- [ ] Utiliser `textContent` au lieu de `innerHTML` pour les données utilisateur

### Documentation Obligatoire

Chaque `README.md` doit contenir :

1. **Description** : Objectif et contexte méthodologique
2. **Utilisation** : Instructions pas à pas
3. **Configuration** : Options disponibles dans `config.json`
4. **Références** : Sources agiles/Scrum pertinentes
5. **Captures** : Screenshots si l'interface est complexe
6. **Technologies** : Stack technique utilisée
7. **Licence** : MIT License

### Bonnes Pratiques

#### Performance
- Lazy loading des ressources lourdes
- Minimiser les requêtes HTTP
- Optimiser les images et icônes (SVG préféré)

#### Accessibilité
- Navigation clavier complète (Tab, Enter, Escape)
- Attributs ARIA appropriés (`aria-label`, `role`)
- Contraste WCAG AA minimum (4.5:1)
- Labels explicites pour les formulaires

#### Responsive
- Mobile-first design
- Breakpoints cohérents avec le thème global
- Touch-friendly sur mobile (zones tactiles ≥ 44px)
- Tester sur différentes tailles d'écran

#### Maintenance
- Code commenté en français
- Logique métier séparée de la présentation
- Pas de CSS dans les fichiers JS
- Utiliser Winston Logger pour les logs (si backend)

---

## 🤖 Prompt Generator pour IA

### Template de Prompt pour Créer un Outil

Utilisez ce template pour générer un prompt structuré à donner à une IA (ChatGPT, Claude, etc.) pour créer un nouvel outil agile :

--- 

# Création d'un Outil Agile : [NOM D'OUTIL]

## 🎯 Besoin

**Contexte méthodologique** :
[Décrivez la pratique agile ou le framework concerné]

**Problème à résoudre** :
[Quel problème cet outil résout-il pour les équipes agiles ?]

**Utilisateurs cibles** :
- [ ] Scrum Master
- [ ] Product Owner
- [ ] Coach Agile
- [ ] Équipe de développement
- [ ] Manager
- [ ] Autre : _______

**Cas d'usage principaux** :
1. [Cas d'usage 1]
2. [Cas d'usage 2]
3. [Cas d'usage 3]

---

## 🏗️ Structure Attendue

**Nom de l'outil** : `[nom-en-kebab-case]`

**Architecture** :
```
tools/[nom-outil]/
├── index.html
├── assets/
│   ├── css/
│   │   └── [nom-outil].css
│   └── js/
│       └── [nom-outil].js
├── config/
│   └── config.json
└── README.md
```

**Fonctionnalités principales** :
- [ ] [Fonctionnalité 1]
- [ ] [Fonctionnalité 2]
- [ ] [Fonctionnalité 3]

**Interactions utilisateur** :
- [Décrire les actions principales : clic, drag & drop, saisie, etc.]

---

## 🎨 Stack Technique

**Frontend** :
- HTML5 sémantique
- CSS3 avec variables CSS (thème clair/sombre)
- JavaScript Vanilla (pas de framework)

**Bibliothèques autorisées** (optionnel) :
- [ ] Chart.js (graphiques)
- [ ] PapaParse (import CSV)
- [ ] Sortable.js (drag & drop)
- [ ] Autre : _______

**Stockage** :
- [ ] LocalStorage (données locales)
- [ ] PocketBase (backend optionnel)
- [ ] Export JSON/CSV

**Responsive** :
- Mobile-first
- Breakpoints : 480px, 768px, 991px, 1200px

---

## 🎨 Design System

**Variables CSS à utiliser** :
```css
/* Couleurs */
--primary: #3b82f6;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Backgrounds */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

/* Textes */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;

/* Espacements */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 20px;
--space-xl: 32px;

/* Bordures */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
```

**Composants réutilisables** :
- Boutons : `.btn`, `.btn-primary`, `.btn-secondary`
- Cartes : `.card`, `.card-header`, `.card-body`
- Badges : `.badge`, `.badge-success`, `.badge-warning`
- Modales : `.modal`, `.modal-overlay`

---

## 📋 Spécifications Fonctionnelles

### Interface Principale

**Layout** :
[Décrire la disposition : header, sidebar, main content, footer]

**Sections** :
1. [Section 1] : [Description]
2. [Section 2] : [Description]
3. [Section 3] : [Description]

### Fonctionnalités Détaillées

#### Fonctionnalité 1 : [Nom]
* **Description** : [Que fait cette fonctionnalité ?]
* **Interactions** : [Comment l'utilisateur interagit ?]
* **Validation** : [Quelles règles de validation ?]
* **Feedback** : [Quel retour visuel pour l'utilisateur ?]

#### Fonctionnalité 2 : [Nom]
[Même structure]

#### Fonctionnalité 3 : [Nom]
[Même structure]

---

## 🔧 Configuration

**Fichier `config/config.json`** :
```json
{
  "toolName": "[nom-outil]",
  "version": "1.0.0",
  "settings": {
    "defaultLanguage": "fr",
    "theme": "auto",
    "storage": "localStorage"
  },
  "options": {
    // Options spécifiques à l'outil
  }
}
```

---

## 📚 Références Méthodologiques

**Sources** :
- [Lien vers la méthodologie officielle]
- [Livre de référence]
- [Article ou blog post]

**Crédits** :
- Auteur original de la pratique
- Adaptations connues

---

## ✅ Critères d'Acceptation

- [ ] L'outil fonctionne en standalone (sans dépendances externes)
- [ ] Responsive sur mobile, tablette et desktop
- [ ] Navigation clavier complète
- [ ] Thème clair/sombre supporté
- [ ] Données sauvegardées en LocalStorage
- [ ] Export des données en JSON
- [ ] README.md complet avec captures d'écran
- [ ] Code commenté en français
- [ ] Pas de CSS inline dans le JavaScript
- [ ] Validation des entrées utilisateur
- [ ] Messages d'erreur explicites
- [ ] Performance optimisée (< 2s de chargement)

---

## 🎯 Livrable Attendu

Génère le code complet de l'outil avec :

1. **index.html** : Structure HTML sémantique
2. **assets/css/[nom-outil].css** : Styles isolés (< 800 lignes)
3. **assets/js/[nom-outil].js** : Logique métier (< 800 lignes)
4. **config/config.json** : Configuration
5. **README.md** : Documentation complète

**Format de réponse** :
- Code complet et fonctionnel
- Commentaires en français
- Exemples d'utilisation
- Instructions d'installation

### Exemple d'Utilisation du Prompt

Voici un exemple concret pour créer un outil "Delegation Poker" :

```markdown
# Création d'un Outil Agile : Delegation Poker

## 🎯 Besoin

**Contexte méthodologique** :
Le Delegation Poker est une pratique de Management 3.0 créée par Jurgen Appelo pour clarifier les niveaux de délégation dans une équipe.

**Problème à résoudre** :
Les équipes agiles ont souvent des zones floues sur qui décide quoi. Cet outil aide à clarifier les 7 niveaux de délégation (Tell, Sell, Consult, Agree, Advise, Inquire, Delegate) pour chaque type de décision.

**Utilisateurs cibles** :
- [x] Scrum Master
- [x] Manager
- [x] Coach Agile
- [x] Équipe de développement

**Cas d'usage principaux** :
1. Atelier de clarification des responsabilités
2. Onboarding de nouveaux managers
3. Rétrospective sur la prise de décision

---

## 🏗️ Structure Attendue

**Nom de l'outil** : `delegation-poker`

**Fonctionnalités principales** :
- [ ] Créer des cartes de décision (ex: "Choix des technologies", "Horaires de travail")
- [ ] Chaque participant vote avec un niveau de délégation (1-7)
- [ ] Révélation simultanée des votes
- [ ] Discussion facilitée sur les écarts
- [ ] Sauvegarde du consensus final
- [ ] Export du Delegation Board

**Interactions utilisateur** :
- Créer/éditer/supprimer des décisions
- Voter avec des cartes (1-7)
- Révéler les votes simultanément
- Discuter et converger vers un consensus

---

## 🎨 Stack Technique

**Frontend** :
- HTML5 sémantique
- CSS3 avec variables CSS (thème clair/sombre)
- JavaScript Vanilla

**Bibliothèques autorisées** :
- [ ] Aucune (Vanilla JS uniquement)

**Stockage** :
- [x] LocalStorage (sessions)
- [x] Export JSON

---

## 📋 Spécifications Fonctionnelles

### Interface Principale

**Layout** :
- Header : Titre + boutons d'action (Nouvelle session, Export)
- Main : Liste des décisions + zone de vote
- Sidebar : Légende des 7 niveaux de délégation

**Sections** :
1. **Gestion des décisions** : CRUD des décisions à clarifier
2. **Zone de vote** : Cartes 1-7 pour chaque participant
3. **Résultats** : Affichage des votes et consensus

### Fonctionnalités Détaillées

#### Fonctionnalité 1 : Gestion des Décisions
**Description** : Créer, éditer, supprimer des décisions à clarifier
**Interactions** : Formulaire avec champ texte + bouton "Ajouter"
**Validation** : Minimum 3 caractères, maximum 100
**Feedback** : Animation d'ajout, message de confirmation

#### Fonctionnalité 2 : Vote avec Cartes
**Description** : Chaque participant sélectionne un niveau (1-7)
**Interactions** : Clic sur une carte, carte sélectionnée mise en surbrillance
**Validation** : Un seul vote par participant
**Feedback** : Carte retournée, compteur de votes

#### Fonctionnalité 3 : Révélation et Consensus
**Description** : Révéler tous les votes simultanément et faciliter la discussion
**Interactions** : Bouton "Révéler", affichage des votes, zone de discussion
**Validation** : Tous les participants ont voté
**Feedback** : Animation de révélation, calcul de la médiane

---

## 📚 Références Méthodologiques

**Sources** :
- [Management 3.0 - Delegation Poker](https://management30.com/practice/delegation-poker/)
- Livre : "Management 3.0" par Jurgen Appelo

**Crédits** :
- Jurgen Appelo (créateur)

---

## ✅ Critères d'Acceptation

- [x] Tous les critères standards
- [ ] 7 niveaux de délégation clairement expliqués
- [ ] Support multi-participants (2-10 personnes)
- [ ] Export du Delegation Board en PDF/JSON
- [ ] Historique des sessions précédentes
```

---

## 🔗 Intégration au Site

### Ajouter un Outil au Catalogue

1. **Créer le dossier** dans `tools/[nom-outil]/`
2. **Développer l'outil** selon les conventions
3. **Ajouter au fichier `content/[categorie]/index.json`** :

```json
{
  "tools": [
    {
      "id": "nom-outil",
      "title": "Nom de l'Outil",
      "description": "Description courte de l'outil",
      "tags": ["tag1", "tag2", "tag3"],
      "platform": "Web",
      "external": false,
      "url": "tools/nom-outil/index.html",
      "order": 1
    }
  ]
}
```

4. **Tester l'intégration** :
   - Vérifier l'affichage dans la catégorie
   - Tester le lien depuis la page catégorie
   - Valider le responsive

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour ajouter un nouvel outil :

1. Développer selon les conventions
2. Tester sur mobile et desktop
3. Documenter dans le README.md
4. Respecter les conventions de nommage
5. Documenter les références méthodologiques
6. Fournir des captures d'écran
7. Mettre à jour le CHANGELOG.md

---

## 📝 Licence

MIT License - Voir [LICENSE](../LICENSE)

Tous les outils sont open-source et gratuits. Vous êtes libre de les utiliser, modifier et distribuer selon les termes de la licence MIT.

---

## 👤 Auteur

**Sébastien ROUEN**
- GitHub : [@sebastien-rouen](https://github.com/sebastien-rouen/)
- Email : rouen.sebastien@gmail.com
- Buy me a coffee : [sebastien.rouen](https://buymeacoffee.com/sebastien.rouen)

---

## 🙏 Remerciements

- La communauté Agile pour les retours et suggestions
- Les créateurs des méthodologies originales
- Les contributeurs open-source

---

**Dernière mise à jour** : 22 octobre 2025
