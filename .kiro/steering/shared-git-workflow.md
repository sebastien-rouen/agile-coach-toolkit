---
inclusion: always
---

# Workflow Git

## Conventions de Commit

### Format Conventional Commits
```
<type>(<scope>): <description>

[body optionnel]

[footer(s) optionnel]
```

### Types de Commits
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

### Règles des Messages
- Description en français, impératif présent
- Limite de 50 caractères pour le titre
- Corps optionnel pour détails (72 caractères par ligne)
- Footer pour breaking changes ou issues

### Exemples Pratiques
```
feat(carnet-animaux): ajout système de rappels vaccins
fix(photos): correction upload images multiples
docs(bastalab): mise à jour architecture réseau
refactor(shared): optimisation utilitaires communs
chore(deps): mise à jour PocketBase vers v0.19.0
style(css): améliore l'indentation des composants
perf(api): optimise les requêtes de base de données
```

## Gestion des Branches

### Stratégie de Branching
- `main` : branche de production stable
- `develop` : branche de développement
- `feature/*` : nouvelles fonctionnalités
- `hotfix/*` : corrections urgentes
- `refactor/*` : refactorisation majeure

### Nommage des Branches
```
feature/nom-fonctionnalite
hotfix/correction-critique
refactor/css-architecture
```

### Workflow Standard
1. Créer une branche depuis `develop`
2. Développer la fonctionnalité
3. Tester localement
4. Créer une pull request
5. Review et merge

```bash
# Créer une branche feature
git checkout develop
git pull origin develop
git checkout -b feature/nouvelle-fonctionnalite

# Développer et commiter
git add .
git commit -m "feat(scope): description"

# Pousser et créer PR
git push origin feature/nouvelle-fonctionnalite
```

## Bonnes Pratiques

### Commits
- **Commits atomiques** : Un commit = une modification logique
- **Éviter les commits volumineux** : Splitter en plusieurs commits
- **Tester avant chaque commit** : S'assurer que le code fonctionne
- **Messages descriptifs** : Expliquer le "pourquoi"

```bash
# ✅ Bon : Commits atomiques
git commit -m "feat(auth): ajout validation email"
git commit -m "feat(auth): ajout gestion erreurs"
git commit -m "test(auth): ajout tests validation"

# ❌ Mauvais : Commit trop large
git commit -m "feat(auth): ajout système authentification complet"
```

### Collaboration
- **Pull requests obligatoires** pour `main`
- **Review de code systématique** : Au moins 1 reviewer
- **Résolution des conflits en amont** : Rebase régulier
- **CI/CD** : Tests automatiques avant merge

### Historique
- **Rebase interactif** pour nettoyer l'historique
- **Éviter les merge commits inutiles** : Préférer rebase
- **Messages de commit informatifs** : Faciliter la lecture de l'historique

```bash
# Nettoyer l'historique avant merge
git rebase -i develop

# Rebase au lieu de merge
git pull --rebase origin develop
```

## Versioning Sémantique

### Format
```
v[MAJOR].[MINOR].[PATCH]

v1.0.0  # Version initiale stable
v1.1.0  # Nouvelles fonctionnalités
v1.1.1  # Corrections de bugs
v2.0.0  # Breaking changes
```

### Règles
- **MAJOR** : Breaking changes (incompatibilité)
- **MINOR** : Nouvelles fonctionnalités (rétrocompatible)
- **PATCH** : Corrections de bugs (rétrocompatible)

### Création de Tags
```bash
# Créer un tag annoté
git tag -a v1.2.0 -m "Version 1.2.0 - Ajout système de notifications"

# Pousser les tags
git push origin v1.2.0
git push origin --tags
```

## Configuration Git

### Configuration par Projet
```bash
git config user.name "Sébastien ROUEN"
git config user.email "rouen.sebastien@gmail.com"
git config init.defaultBranch main
git config pull.rebase true
git config core.autocrlf false
```

### Configuration Globale
```bash
git config --global user.name "Sébastien ROUEN"
git config --global user.email "rouen.sebastien@gmail.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
```

## Sécurité

### Secrets et Variables d'Environnement
```bash
# .env.example (à versionner)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=example_db
API_BASE_URL=/api

# .env (à ne PAS versionner)
DB_PASSWORD=motdepasse_secret
JWT_SECRET=clé_super_secrète
POCKETBASE_URL=/pb
POCKETBASE_ADMIN_PASSWORD=admin123
POCKETBASE_ADMIN_EMAIL=admin@example.com
```

### .gitignore
```
# Secrets
.env
*.key
*.pem

# Dépendances
node_modules/
vendor/

# Build
dist/
build/

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db
```

## Hooks Git

### Pre-commit Hook
```bash
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

### Commit-msg Hook
```bash
# .git/hooks/commit-msg
#!/bin/bash
commit_msg=$(cat "$1")

# Vérifier le format conventional commits
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .+"; then
    echo "❌ Format de commit invalide"
    echo "Format attendu: type(scope): description"
    exit 1
fi

echo "✅ Format de commit valide"
```

## Commandes Utiles

```bash
# Voir l'historique
git log --oneline --graph --all

# Voir les modifications
git diff
git diff --staged

# Annuler des modifications
git restore fichier.js
git restore --staged fichier.js

# Stash temporaire
git stash
git stash pop

# Rebase interactif
git rebase -i HEAD~3

# Cherry-pick
git cherry-pick <commit-hash>

# Nettoyer les branches
git branch -d feature/ancienne-branche
git remote prune origin
```

## Ressources

- **Conventional Commits** : https://www.conventionalcommits.org/
- **Git Flow** : https://nvie.com/posts/a-successful-git-branching-model/
- **Semantic Versioning** : https://semver.org/
