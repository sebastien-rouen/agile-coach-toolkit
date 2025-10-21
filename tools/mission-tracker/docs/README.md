# 📚 Documentation Mission Tracker

Bienvenue dans la documentation complète du Mission Tracker !

## 📖 Table des matières

### 🚀 Démarrage
- [**QUICK_START.md**](../QUICK_START.md) - Guide de démarrage rapide
  - Installation
  - Premiers pas
  - Tests de base
  - Problèmes courants

### 🔧 Corrections récentes
- [**MODALS_FIX.md**](../MODALS_FIX.md) - Documentation technique des corrections
  - Problème identifié
  - Solutions apportées
  - Modales implémentées
  - Structure et exemples

- [**CHANGELOG_MODALS.md**](../CHANGELOG_MODALS.md) - Historique des changements
  - Version 1.1.0
  - Corrections de bugs
  - Améliorations
  - Notes de migration

### 🧪 Tests
- [**TEST_MODALS.md**](../TEST_MODALS.md) - Checklist de tests complète
  - Tests par modal
  - Tests de régression
  - Commandes de test
  - Bugs connus

### 🏗️ Architecture
- [**MODALS_ARCHITECTURE.md**](MODALS_ARCHITECTURE.md) - Architecture des modales
  - Vue d'ensemble
  - Cycle de vie
  - Types de modales
  - Bonnes pratiques
  - Accessibilité
  - Performance
  - Dépannage

## 🎯 Par cas d'usage

### Je veux démarrer rapidement
→ Lisez [QUICK_START.md](../QUICK_START.md)

### Je veux comprendre les corrections
→ Lisez [MODALS_FIX.md](../MODALS_FIX.md)

### Je veux tester l'application
→ Lisez [TEST_MODALS.md](../TEST_MODALS.md)

### Je veux développer une nouvelle modal
→ Lisez [MODALS_ARCHITECTURE.md](MODALS_ARCHITECTURE.md)

### Je veux voir l'historique des changements
→ Lisez [CHANGELOG_MODALS.md](../CHANGELOG_MODALS.md)

## 📂 Structure de la documentation

```
tools/mission-tracker/
├── QUICK_START.md              # 🚀 Démarrage rapide
├── MODALS_FIX.md               # 🔧 Corrections techniques
├── CHANGELOG_MODALS.md         # 📋 Historique
├── TEST_MODALS.md              # 🧪 Tests
└── docs/
    ├── README.md               # 📚 Ce fichier
    └── MODALS_ARCHITECTURE.md  # 🏗️ Architecture
```

## 🔍 Index des modales

| Modal | Fonction | Documentation |
|-------|----------|---------------|
| Nouvelle mission | `openCreateMissionModal()` | [MODALS_FIX.md](../MODALS_FIX.md#1-nouvelle-mission) |
| Édition mission | `openEditMissionModal()` | [MODALS_FIX.md](../MODALS_FIX.md#2-édition-mission) |
| Rapport d'étonnement | `openInitialReportModal()` | [MODALS_FIX.md](../MODALS_FIX.md#3-rapport-détonnement) |
| Checkpoint | `openCheckpointModal()` | [MODALS_FIX.md](../MODALS_FIX.md#4-checkpoint) |
| Bilan final | `openFinalReportModal()` | [MODALS_FIX.md](../MODALS_FIX.md#5-bilan-final) |
| Export | `openExportModal()` | [MODALS_FIX.md](../MODALS_FIX.md#6-export) |

## 🛠️ Ressources techniques

### Stack technique
- **Framework UI** : Shoelace Web Components
- **Base de données** : PocketBase (à venir)
- **Export** : jsPDF, Marked.js
- **Templates** : Handlebars

### Fichiers clés
- `index.html` - Structure HTML
- `assets/js/mission-tracker.js` - Logique principale
- `assets/js/data-manager.js` - Gestion des données
- `assets/css/mission-tracker.css` - Styles
- `config/config.json` - Configuration

### APIs utilisées
- **Shoelace Dialog** : https://shoelace.style/components/dialog
- **FormData** : https://developer.mozilla.org/en-US/docs/Web/API/FormData
- **LocalStorage** : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## 📊 Statistiques

- **6 modales** fonctionnelles
- **100% de couverture** des fonctionnalités
- **0 bug connu** après correction
- **4 fichiers** de documentation

## 🤝 Contribution

Pour contribuer à la documentation :

1. Créez un fichier dans `docs/`
2. Ajoutez-le à ce README
3. Suivez le format Markdown
4. Utilisez des emojis pour la lisibilité

### Conventions

- **Titres** : Utilisez des emojis pertinents
- **Code** : Utilisez des blocs de code avec syntaxe
- **Exemples** : Incluez des exemples concrets
- **Liens** : Créez des liens entre les documents

## 📞 Support

- **Issues** : https://github.com/sebastien-rouen/agile-coach-toolkit/issues
- **Email** : rouen.sebastien@gmail.com
- **Documentation** : Ce dossier

## 📝 Licence

MIT License - Voir [LICENSE](../../../LICENSE)

---

**Dernière mise à jour** : 2024-01-XX
**Version** : 1.1.0
**Auteur** : Sébastien ROUEN
