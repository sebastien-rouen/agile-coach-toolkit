---
inclusion: fileMatch
fileMatchPattern: ["tools/**/*", "**/tools/**/*"]
---

# Outils Agile - Conventions de Développement

## Structure Standardisée

Chaque outil dans `tools/` suit cette architecture :

```
tools/{nom-outil}/
├── index.html              # Point d'entrée de l'outil
├── assets/
│   ├── css/
│   │   └── {nom-outil}.css # Styles isolés (max 800 lignes)
│   └── js/
│       └── {nom-outil}.js  # Logique métier (max 800 lignes)
├── config/
│   └── config.json         # Configuration spécifique
└── README.md               # Documentation complète
```

## Règles de Nommage

- **Dossiers** : kebab-case (`planning-poker`, `skills-matrix`)
- **Fichiers CSS/JS** : Identique au nom du dossier parent
- **Classes CSS** : Préfixer avec le nom de l'outil (`.planning-poker-card`, `.skills-matrix-cell`)
- **Variables CSS** : Utiliser les variables globales de `base.css` en priorité

## Principes d'Architecture

### Autonomie

- Chaque outil fonctionne indépendamment sans dépendances externes
- Pas de couplage entre outils
- Chargement isolé des ressources

### Réutilisation

- Utiliser les composants partagés : `assets/css/components/`
- Respecter les variables CSS globales : `--primary`, `--spacing-*`, `--border-radius`
- Importer uniquement les styles nécessaires

### Intégration au Thème

```css
/* ✅ Bon : Utiliser les variables globales */
.tool-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

/* ❌ Mauvais : Valeurs en dur */
.tool-card {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 12px;
}
```

## Documentation Obligatoire

Chaque `README.md` doit contenir :

1. **Description** : Objectif et contexte méthodologique
2. **Utilisation** : Instructions pas à pas
3. **Configuration** : Options disponibles dans `config.json`
4. **Références** : Sources agiles/Scrum pertinentes
5. **Captures** : Screenshots si l'interface est complexe

## Outils Disponibles

| Outil               | Description                  | Méthodologie                   |
| ------------------- | ---------------------------- | ------------------------------ |
| `agile-fluency`     | Évaluation de maturité agile | Modèle Fluency de Diana Larsen |
| `example-mapping`   | Cartographie d'exemples BDD  | Example Mapping (Matt Wynne)   |
| `ikigai`            | Découverte du sens personnel | Concept japonais Ikigai        |
| `ikigai-engagement` | Mesure d'engagement équipe   | Ikigai appliqué au travail     |
| `planning-poker`    | Estimation collaborative     | Planning Poker (Scrum)         |
| `skills-matrix`     | Matrice de compétences       | Skill Matrix (Agile)           |
| `velocity-squad`    | Suivi de vélocité            | Métriques Scrum                |

## Checklist de Développement

Avant de créer ou modifier un outil :

- [ ] Structure de dossier respectée
- [ ] Fichiers CSS/JS < 800 lignes (sinon découper)
- [ ] Classes CSS préfixées avec le nom de l'outil
- [ ] Variables CSS globales utilisées
- [ ] Outil fonctionnel en standalone
- [ ] README.md complet avec références méthodologiques
- [ ] Responsive et accessible (navigation clavier)
- [ ] Testé sur mobile et desktop
- [ ] Pas de dépendances externes non documentées

## Bonnes Pratiques

### Performance

- Lazy loading des ressources lourdes
- Minimiser les requêtes HTTP
- Optimiser les images et icônes

### Accessibilité

- Navigation clavier complète
- Attributs ARIA appropriés
- Contraste WCAG AA minimum
- Labels explicites pour les formulaires

### Responsive

- Mobile-first design
- Breakpoints cohérents avec le thème global
- Touch-friendly sur mobile (zones tactiles ≥ 44px)

### Maintenance

- Code commenté en français
- Logique métier séparée de la présentation
- Pas de CSS inline dans le JavaScript
- Utiliser `textContent` au lieu de `innerHTML` pour les données utilisateur
