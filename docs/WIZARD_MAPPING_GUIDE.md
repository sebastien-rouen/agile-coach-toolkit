# 📖 Guide - Ajouter des Outils et Templates au Wizard

## 🎯 Objectif

Ce guide explique comment ajouter de nouveaux outils et templates au système de recommandations du wizard.

## 📍 Localisation du code

Le mapping se trouve dans le fichier `assets/js/wizard.js`, dans la fonction `getToolsAndTemplatesForCategories()`.

```javascript
// Ligne ~1150 dans wizard.js
const categoryMapping = {
  'fondamentaux': {
    tools: [...],
    templates: [...]
  },
  // ...
}
```

## ➕ Ajouter un outil

### Structure d'un outil

```javascript
{
  title: 'Nom de l\'outil',        // Requis
  icon: '🎯',                       // Requis (emoji)
  url: '/tools/mon-outil/',        // Requis (chemin relatif)
  description: 'Description courte' // Optionnel mais recommandé
}
```

### Exemple complet

```javascript
const categoryMapping = {
  'frameworks': {
    tools: [
      {
        title: 'Planning Poker',
        icon: '🃏',
        url: '/tools/planning-poker/',
        description: 'Estimer la complexité des user stories'
      },
      // ✨ NOUVEL OUTIL
      {
        title: 'Burndown Chart',
        icon: '📉',
        url: '/tools/burndown-chart/',
        description: 'Visualiser l\'avancement du sprint'
      }
    ],
    templates: []
  }
}
```

## 📄 Ajouter un template

### Structure d'un template

```javascript
{
  title: 'Nom du template',        // Requis
  icon: '📋',                       // Requis (emoji)
  url: '/templates/mon-template/', // Requis (chemin relatif)
  description: 'Description courte' // Optionnel mais recommandé
}
```

### Exemple complet

```javascript
const categoryMapping = {
  'frameworks': {
    tools: [...],
    templates: [
      {
        title: 'Template Sprint Planning',
        icon: '📋',
        url: '/templates/sprint-planning.pdf',
        description: 'Modèle pour organiser votre sprint planning'
      },
      // ✨ NOUVEAU TEMPLATE
      {
        title: 'Template Daily Standup',
        icon: '📝',
        url: '/templates/daily-standup.pdf',
        description: 'Canevas pour structurer vos daily meetings'
      }
    ]
  }
}
```

## 🗂️ Catégories disponibles

Voici la liste complète des catégories que vous pouvez utiliser :

| ID Catégorie | Nom | Emoji |
|--------------|-----|-------|
| `fondamentaux` | Fondamentaux | 🎯 |
| `delivery-amelioration` | Delivery & Amélioration | 📦 |
| `frameworks` | Frameworks | 🚵 |
| `product-design` | Product & Design | 🎨 |
| `transformation-culture` | Transformation & Culture | 🌱 |
| `gestion-defis` | Gestion des Défis | 🛡️ |
| `leadership-coaching` | Leadership & Coaching | 👑 |
| `multi-equipes-scale` | Multi-équipes & Scale | 🏗️ |
| `contextes-specialises` | Contextes Spécialisés | 🖇️ |
| `outils-technologies` | Outils & Technologies | 🛠️ |
| `developpement-coach` | Développement Coach | 📚 |
| `ressources-rex` | Ressources & REX | 📋 |

## 🎨 Choisir un emoji approprié

### Outils
- 🃏 Jeux/Cartes (Planning Poker, Delegation Poker)
- 📊 Graphiques/Métriques (Velocity, Burndown)
- 🗺️ Cartographie (Example Mapping, Stakeholder Mapping)
- 🎯 Objectifs/Cibles (OKR, Ikigai)
- 🎴 Facilitation (Liberating Structures)
- 📈 Progression (Agile Fluency)
- 🔧 Outils techniques (CI/CD, DevOps)

### Templates
- 📋 Formulaires/Checklists
- 📝 Documents/Notes
- 📊 Tableaux/Matrices
- 📄 Modèles génériques
- 🎯 Plans/Stratégies
- 📑 Rapports/Comptes-rendus

## 🔗 Formats d'URL supportés

### Outils internes
```javascript
url: '/tools/mon-outil/'           // Outil hébergé localement
url: '/tools/mon-outil/index.html' // Avec fichier spécifique
```

### Templates
```javascript
url: '/templates/mon-template.pdf'  // PDF
url: '/templates/mon-template.docx' // Word
url: '/templates/mon-template.xlsx' // Excel
url: '/templates/mon-template/'     // Page HTML
```

### Ressources externes
```javascript
url: 'https://example.com/outil'    // Lien externe
// Note : Les liens externes s'ouvrent dans un nouvel onglet automatiquement
```

## 📝 Exemple complet : Ajouter plusieurs éléments

```javascript
const categoryMapping = {
  'frameworks': {
    tools: [
      // Outils existants
      {
        title: 'Planning Poker',
        icon: '🃏',
        url: '/tools/planning-poker/',
        description: 'Estimer la complexité des user stories'
      },
      // ✨ NOUVEAUX OUTILS
      {
        title: 'Burndown Chart',
        icon: '📉',
        url: '/tools/burndown-chart/',
        description: 'Visualiser l\'avancement du sprint'
      },
      {
        title: 'Cumulative Flow',
        icon: '📊',
        url: '/tools/cumulative-flow/',
        description: 'Analyser le flux de travail'
      }
    ],
    templates: [
      // ✨ NOUVEAUX TEMPLATES
      {
        title: 'Template Sprint Planning',
        icon: '📋',
        url: '/templates/sprint-planning.pdf',
        description: 'Modèle pour organiser votre sprint planning'
      },
      {
        title: 'Template Daily Standup',
        icon: '📝',
        url: '/templates/daily-standup.pdf',
        description: 'Canevas pour structurer vos daily meetings'
      },
      {
        title: 'Template Rétrospective',
        icon: '🔄',
        url: '/templates/retrospective.pdf',
        description: 'Format pour animer vos rétrospectives'
      }
    ]
  },
  
  'product-design': {
    tools: [
      // Outils existants
      {
        title: 'Example Mapping',
        icon: '🗺️',
        url: '/tools/example-mapping/',
        description: 'Clarifier les user stories avec des exemples'
      },
      // ✨ NOUVEL OUTIL
      {
        title: 'Impact Mapping',
        icon: '🎯',
        url: '/tools/impact-mapping/',
        description: 'Aligner les fonctionnalités avec les objectifs'
      }
    ],
    templates: [
      // ✨ NOUVEAUX TEMPLATES
      {
        title: 'Template User Story',
        icon: '📄',
        url: '/templates/user-story.pdf',
        description: 'Format standardisé pour vos user stories'
      },
      {
        title: 'Template Product Vision',
        icon: '🎯',
        url: '/templates/product-vision.pdf',
        description: 'Définir la vision de votre produit'
      }
    ]
  }
}
```

## ⚙️ Limites et contraintes

### Nombre maximum
- **6 outils** maximum affichés par recommandation
- **6 templates** maximum affichés par recommandation

Si vous ajoutez plus de 6 éléments, seuls les 6 premiers seront affichés.

### Ordre d'affichage
Les outils et templates sont affichés dans l'ordre où ils apparaissent dans le mapping.

**Astuce** : Placez les plus importants en premier !

## 🧪 Tester vos modifications

1. **Sauvegarder** le fichier `assets/js/wizard.js`

2. **Recharger** la page du wizard

3. **Compléter** le wizard jusqu'à l'étape 3

4. **Vérifier** que vos nouveaux outils/templates apparaissent

5. **Tester** les liens pour s'assurer qu'ils fonctionnent

## ✅ Checklist avant commit

- [ ] Titre descriptif et concis
- [ ] Emoji approprié au type d'outil/template
- [ ] URL valide et testée
- [ ] Description claire (max 60 caractères)
- [ ] Catégorie correcte
- [ ] Pas de doublons
- [ ] Ordre logique (du plus important au moins important)
- [ ] Testé dans le wizard

## 🐛 Dépannage

### L'outil n'apparaît pas
- Vérifiez que la catégorie est bien recommandée
- Vérifiez l'orthographe de l'ID de catégorie
- Rechargez la page (Ctrl+F5)

### Le lien ne fonctionne pas
- Vérifiez que l'URL est correcte
- Vérifiez que le fichier existe
- Testez l'URL directement dans le navigateur

### L'emoji ne s'affiche pas
- Utilisez un emoji standard (pas de caractères spéciaux)
- Vérifiez l'encodage du fichier (UTF-8)

## 📚 Ressources

- [Emojipedia](https://emojipedia.org/) - Trouver des emojis
- [Can I Use](https://caniuse.com/) - Compatibilité navigateurs
- [MDN Web Docs](https://developer.mozilla.org/) - Documentation web

---

**Dernière mise à jour** : 2025-01-06  
**Version** : 3.0.0
