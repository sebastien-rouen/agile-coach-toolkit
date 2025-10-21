# 📚 Documentation - Agile Coach Toolkit

Bienvenue dans la documentation complète du projet Agile Coach Toolkit.

## 📖 Table des matières

### 🧙 Wizard v3.0

1. **[WIZARD_V3_FEATURES.md](WIZARD_V3_FEATURES.md)** - Vue d'ensemble des nouvelles fonctionnalités
   - Affichage groupé (Catégories, Outils, Templates)
   - Différenciation visuelle par couleur
   - Mapping intelligent
   - Responsive design

2. **[WIZARD_MAPPING_GUIDE.md](WIZARD_MAPPING_GUIDE.md)** - Guide pour ajouter des outils et templates
   - Structure des données
   - Exemples de code
   - Catégories disponibles
   - Bonnes pratiques

3. **[WIZARD_VISUAL_COMPARISON.md](WIZARD_VISUAL_COMPARISON.md)** - Comparaison v2 vs v3
   - Avant/Après visuels
   - Palette de couleurs
   - Impact utilisateur
   - Statistiques d'amélioration

4. **[../WIZARD_IMPROVEMENTS.md](../WIZARD_IMPROVEMENTS.md)** - Documentation technique détaillée
   - Fichiers modifiés
   - Styles CSS ajoutés
   - Fonctions JavaScript
   - Prochaines étapes

### 🧪 Tests

5. **[../tests/README_WIZARD_RESULTS.md](../tests/README_WIZARD_RESULTS.md)** - Guide de test
   - Fichiers de test disponibles
   - Aperçu des améliorations
   - Métriques de succès
   - Problèmes connus

6. **[../tests/test-wizard-results.html](../tests/test-wizard-results.html)** - Page de test interactive
   - Visualisation complète des résultats
   - Exemples de catégories, outils et templates
   - Test responsive

### 📝 Changelog

7. **[../CHANGELOG.md](../CHANGELOG.md)** - Historique des modifications
   - Version 3.0.0 : Wizard amélioré
   - Versions précédentes
   - Corrections de bugs

## 🚀 Démarrage rapide

### Pour les développeurs

1. **Comprendre les nouvelles fonctionnalités**
   ```bash
   # Lire la documentation principale
   cat docs/WIZARD_V3_FEATURES.md
   ```

2. **Ajouter un outil ou template**
   ```bash
   # Suivre le guide de mapping
   cat docs/WIZARD_MAPPING_GUIDE.md
   ```

3. **Tester les modifications**
   ```bash
   # Ouvrir la page de test
   open tests/test-wizard-results.html
   ```

### Pour les utilisateurs

1. **Découvrir les améliorations**
   - Lire [WIZARD_V3_FEATURES.md](WIZARD_V3_FEATURES.md)
   - Voir la comparaison visuelle dans [WIZARD_VISUAL_COMPARISON.md](WIZARD_VISUAL_COMPARISON.md)

2. **Utiliser le wizard**
   - Ouvrir `index.html`
   - Compléter les 3 étapes
   - Explorer les recommandations

## 🎯 Structure de la documentation

```
docs/
├── README.md                      # Ce fichier (index)
├── WIZARD_V3_FEATURES.md          # Fonctionnalités v3.0
├── WIZARD_MAPPING_GUIDE.md        # Guide d'ajout d'outils/templates
└── WIZARD_VISUAL_COMPARISON.md    # Comparaison v2 vs v3

../
├── WIZARD_IMPROVEMENTS.md         # Documentation technique
├── CHANGELOG.md                   # Historique des versions
└── tests/
    ├── README_WIZARD_RESULTS.md   # Guide de test
    └── test-wizard-results.html   # Page de test
```

## 🔧 Fichiers techniques

### JavaScript
- `assets/js/wizard.js` - Logique du wizard
  - Fonction `renderResults()` - Affichage des résultats
  - Fonction `getToolsAndTemplatesForCategories()` - Mapping

### CSS
- `assets/css/wizard.css` - Styles du wizard
  - Sections `.results-section`
  - Cartes `.result-card-tool` et `.result-card-template`
  - Badges `.result-badge`

### Configuration
- `config/config.json` - Configuration globale
  - Catégories
  - Wizard options

## 📊 Métriques

### Version 3.0.0
- **Catégories** : 12 disponibles
- **Outils mappés** : 8 actuellement
- **Templates mappés** : 0 (à venir)
- **Lignes de code ajoutées** : ~300 (JS + CSS)
- **Fichiers modifiés** : 2 (wizard.js, wizard.css)
- **Fichiers créés** : 6 (documentation + tests)

### Objectifs
- 📈 **+30%** d'utilisation des outils interactifs
- 📈 **+20%** de temps passé sur le site
- 📈 **+40%** de complétion du wizard
- 📉 **-50%** de taux de rebond

## 🤝 Contribution

### Ajouter de la documentation

1. **Créer un nouveau fichier**
   ```bash
   touch docs/NOUVEAU_GUIDE.md
   ```

2. **Suivre le format**
   - Titre principal avec emoji
   - Table des matières
   - Sections claires
   - Exemples de code
   - Métadonnées en bas (version, date, auteur)

3. **Mettre à jour cet index**
   - Ajouter le lien dans la table des matières
   - Décrire brièvement le contenu

### Améliorer la documentation existante

1. **Identifier les lacunes**
   - Sections manquantes
   - Exemples insuffisants
   - Captures d'écran manquantes

2. **Proposer des améliorations**
   - Ouvrir une issue sur GitHub
   - Créer une pull request
   - Discuter dans les commentaires

## 🐛 Signaler un problème

### Documentation incorrecte
- Ouvrir une issue avec le label `documentation`
- Préciser le fichier et la section concernés
- Proposer une correction si possible

### Documentation manquante
- Ouvrir une issue avec le label `enhancement`
- Décrire ce qui devrait être documenté
- Expliquer pourquoi c'est important

## 📚 Ressources externes

### Agile & Scrum
- [Scrum Guide](https://scrumguides.org/) - Guide officiel Scrum
- [Agile Manifesto](https://agilemanifesto.org/) - Manifeste agile
- [Scrum.org](https://www.scrum.org/) - Ressources Scrum

### Design & UX
- [Material Design](https://material.io/) - Guidelines Google
- [Refactoring UI](https://www.refactoringui.com/) - Conseils design
- [Laws of UX](https://lawsofux.com/) - Principes UX

### Développement
- [MDN Web Docs](https://developer.mozilla.org/) - Documentation web
- [Can I Use](https://caniuse.com/) - Compatibilité navigateurs
- [CSS Tricks](https://css-tricks.com/) - Astuces CSS

## 📞 Contact

- **Auteur** : Sébastien - Coach Sticko
- **Email** : [À compléter]
- **GitHub** : [À compléter]
- **Site web** : [À compléter]

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

---

**Dernière mise à jour** : 2025-01-06  
**Version** : 3.0.0  
**Statut** : ✅ À jour
