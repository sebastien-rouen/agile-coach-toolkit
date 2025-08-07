---
inclusion: always
---


# Standards Généraux de Développement

## Principes de Base

- **Lisibilité avant tout** : Le code doit être écrit pour être lu par des humains
- **Simplicité** : Privilégier les solutions simples et directes
- **Cohérence** : Maintenir un style uniforme dans tout le projet
- **Documentation** : Commenter le "pourquoi", pas le "quoi"

## Conventions de Nommage

### Variables et Fonctions
- Utiliser camelCase pour JavaScript/TypeScript
- Noms descriptifs et explicites
- Éviter les abréviations obscures

### Fichiers et Dossiers
- Utiliser kebab-case pour les noms de fichiers
- Structure logique et hiérarchique
- Noms en anglais pour la compatibilité
- Pas plus de 800 lignes par fichier : sinon optimiser le code

## Structure de Code

### Organisation des Fichiers
- Séparer la logique métier de la présentation
- Regrouper les fichiers par fonctionnalité
- Maintenir une architecture modulaire

### Gestion des Erreurs
- Toujours gérer les cas d'erreur
- Messages d'erreur explicites et utiles
- Logging approprié pour le débogage


# Workflow Git

## Conventions de Commit

### Format des Messages
- Utiliser le format conventionnel : `type(scope): description`
- Types : feat, fix, docs, style, refactor, test, chore
- Description en français, impératif présent
- Limite de 50 caractères pour le titre

### Exemples
```
feat(auth): ajoute la connexion par OAuth
fix(ui): corrige l'alignement du bouton principal
docs(readme): met à jour les instructions d'installation
style(css): améliore l'indentation des composants
```

## Gestion des Branches

### Stratégie de Branching
- `main` : branche de production stable
- `develop` : branche de développement
- `feature/*` : nouvelles fonctionnalités
- `hotfix/*` : corrections urgentes

### Workflow
1. Créer une branche depuis `develop`
2. Développer la fonctionnalité
3. Tester localement
4. Créer une pull request
5. Review et merge

## Bonnes Pratiques

### Commits
- Commits atomiques et logiques
- Éviter les commits trop volumineux
- Tester avant chaque commit

### Collaboration
- Pull requests obligatoires pour `main`
- Review de code systématique
- Résolution des conflits en amont

### Historique
- Rebase interactif pour nettoyer l'historique
- Éviter les merge commits inutiles
- Messages de commit informatifs


# 📝 Convention des commits

## Format Conventional Commits
```
<type>(<scope>): <description>

[body optionnel]

[footer(s) optionnel]
```

## Types de commits
```
feat:      Nouvelle fonctionnalité
fix:       Correction de bug
docs:      Documentation
style:     Formatage, pas de changement de code
refactor:  Refactorisation sans ajout de fonctionnalité
test:      Ajout/modification de tests
chore:     Maintenance, dépendances, scripts
perf:      Amélioration des performances
ci:        Intégration continue
build:     Système de build, dépendances externes
```

## Exemples pratiques
```
feat(carnet-animaux): ajout système de rappels vaccins
fix(photos): correction upload images multiples
docs(bastalab): mise à jour architecture réseau
refactor(shared): optimisation utilitaires communs
chore(deps): mise à jour PocketBase vers v0.19.0
```

## Configuration Git par projet

### Dans chaque projet
```
git config user.name "Sébastien ROUEN"
git config user.email "rouen.sebastien@gmail.com"
git config init.defaultBranch main
git config pull.rebase true
git config core.autocrlf false
```

# 🏷️ Stratégie de tags et releases

## Versioning sémantique
```
# Format: v[MAJOR].[MINOR].[PATCH]
v1.0.0  # Version initiale stable
v1.1.0  # Nouvelles fonctionnalités
v1.1.1  # Corrections de bugs
v2.0.0  # Breaking changes
```

# 🛡️ Sécurité et bonnes pratiques

## Secrets et variables d'environnement
```
# .env.example (à versionner)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=example_db
API_BASE_URL=https://api.bastou.dev

# .env (à ne PAS versionner)
DB_PASSWORD=motdepasse_secret
JWT_SECRET=clé_super_secrète
POCKETBASE_ADMIN_PASSWORD=admin123
```

## Hooks Git pour la qualité
```
# .git/hooks/pre-commit
#!/bin/bash
echo "🔍 Vérification avant commit..."

# Vérifier les fichiers sensibles
if git diff --cached --name-only | grep -E "\.(env|key|pem)$"; then
    echo "⚠️  Fichiers sensibles détectés!"
    exit 1
fi

# Linter JavaScript
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Erreurs de linting détectées"
    exit 1
fi

echo "✅ Vérifications OK"
```