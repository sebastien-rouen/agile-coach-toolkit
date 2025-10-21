# 📋 Schéma YAML - Visualiseur Multi-Équipes

Ce document décrit la structure des fichiers YAML pour importer vos propres données.

## 📐 Structure globale

```yaml
teams:
  - # Liste des équipes
subjects:
  - # Liste des sujets
```

## 👥 Section `teams`

Définit les équipes de votre organisation.

### Champs

| Champ | Type | Obligatoire | Description | Exemple |
|-------|------|-------------|-------------|---------|
| `id` | string | ✅ | Identifiant unique | `team_alpha` |
| `name` | string | ✅ | Nom affiché | `Team Alpha` |
| `members` | number | ❌ | Nombre de membres | `8` |
| `color` | string | ❌ | Couleur hexadécimale | `#3498db` |
| `icon` | string | ❌ | Emoji représentatif | `🚀` |

### Exemple

```yaml
teams:
  - id: team_alpha
    name: "Team Alpha"
    members: 8
    color: "#3498db"
    icon: "🚀"
    
  - id: team_beta
    name: "Team Beta"
    members: 7
    color: "#e74c3c"
    icon: "⚡"
```

## 📝 Section `subjects`

Définit les sujets de travail (features, tâches, initiatives).

### Champs

| Champ | Type | Obligatoire | Description | Valeurs possibles |
|-------|------|-------------|-------------|-------------------|
| `title` | string | ✅ | Titre du sujet | Texte libre |
| `type` | string | ✅ | Type de sujet | `team`, `cross-team`, `individual` |
| `teams` | array | ✅* | IDs des équipes | `[team_alpha, team_beta]` |
| `status` | string | ✅ | Statut actuel | `planned`, `in-progress`, `blocked`, `completed` |
| `priority` | string | ✅ | Niveau de priorité | `critical`, `high`, `medium`, `low` |
| `deadline` | string | ❌ | Date d'échéance | `YYYY-MM-DD` (ex: `2025-01-15`) |
| `description` | string | ❌ | Description détaillée | Texte libre |
| `dependencies` | array | ❌ | Titres des sujets dépendants | `["Autre sujet"]` |

**\*** `teams` est obligatoire sauf pour `type: individual`

### Exemple

```yaml
subjects:
  - title: "Migration Base de Données"
    type: cross-team
    teams: [team_alpha, team_beta]
    status: in-progress
    priority: critical
    deadline: "2025-01-15"
    description: "Migration complète de MySQL vers PostgreSQL"
    dependencies: []
    
  - title: "API Gateway v2"
    type: team
    teams: [team_alpha]
    status: in-progress
    priority: high
    deadline: "2025-01-20"
    description: "Refonte de l'API Gateway"
    dependencies: ["Migration Base de Données"]
    
  - title: "Documentation Architecture"
    type: individual
    teams: []
    status: planned
    priority: medium
    deadline: "2025-02-01"
    description: "ADR et diagrammes C4"
    dependencies: []
```

## 🎨 Valeurs des énumérations

### Type de sujet (`type`)

| Valeur | Description | Badge | Usage |
|--------|-------------|-------|-------|
| `team` | Sujet d'une seule équipe | 👥 Équipe | Travail interne à l'équipe |
| `cross-team` | Sujet multi-équipes | 🔀 Cross-équipe | Collaboration entre équipes |
| `individual` | Sujet individuel | 👤 Individuel | Rôle spécifique (PO, Archi) |

### Statut (`status`)

| Valeur | Description | Impact alerte |
|--------|-------------|---------------|
| `planned` | Planifié | Basé sur échéance |
| `in-progress` | En cours | Basé sur échéance |
| `blocked` | Bloqué | 🔴 Toujours critique |
| `completed` | Terminé | Basé sur échéance |

### Priorité (`priority`)

| Valeur | Description | Badge |
|--------|-------------|-------|
| `critical` | Critique | 🔴 Rouge |
| `high` | Haute | 🟠 Orange |
| `medium` | Moyenne | 🟡 Jaune |
| `low` | Basse | 🟢 Vert |

## 🚨 Calcul des codes couleurs d'alerte

Le système calcule automatiquement les alertes selon ces règles :

### Règle 1 : Statut bloqué (prioritaire)

```yaml
status: blocked  # → 🔴 Critique (peu importe l'échéance)
```

### Règle 2 : Échéance dépassée

```yaml
deadline: "2024-12-01"  # Date passée → 🔴 Critique
```

### Règle 3 : Échéance proche (< 7 jours)

```yaml
deadline: "2025-01-10"  # Dans 5 jours → 🟠 Warning
```

### Règle 4 : Échéance lointaine (> 7 jours)

```yaml
deadline: "2025-02-15"  # Dans 30 jours → 🟢 OK
```

### Règle 5 : Pas d'échéance

```yaml
# Pas de champ deadline → ⚪ Neutre
```

## 📊 Exemples complets

### Exemple 1 : Petit projet (2 équipes)

```yaml
teams:
  - id: dev
    name: "Équipe Dev"
    members: 6
    color: "#3498db"
    icon: "💻"
    
  - id: ops
    name: "Équipe Ops"
    members: 4
    color: "#e74c3c"
    icon: "⚙️"

subjects:
  - title: "Nouvelle fonctionnalité paiement"
    type: team
    teams: [dev]
    status: in-progress
    priority: critical
    deadline: "2025-01-15"
    description: "Intégration Stripe"
    dependencies: []
    
  - title: "Pipeline CI/CD"
    type: cross-team
    teams: [dev, ops]
    status: in-progress
    priority: high
    deadline: "2025-01-20"
    description: "GitHub Actions"
    dependencies: []
```

### Exemple 2 : SAFe ART (4 équipes)

```yaml
teams:
  - id: team_1
    name: "Team 1"
    members: 8
    color: "#3498db"
    icon: "🚀"
  - id: team_2
    name: "Team 2"
    members: 7
    color: "#e74c3c"
    icon: "⚡"
  - id: team_3
    name: "Team 3"
    members: 9
    color: "#2ecc71"
    icon: "🎯"
  - id: team_4
    name: "Team 4"
    members: 8
    color: "#f39c12"
    icon: "🔥"

subjects:
  # Features par équipe
  - title: "Feature 1.1"
    type: team
    teams: [team_1]
    status: in-progress
    priority: high
    deadline: "2025-01-20"
    
  - title: "Feature 1.2"
    type: team
    teams: [team_1]
    status: planned
    priority: medium
    deadline: "2025-02-05"
    
  # Feature cross-team
  - title: "Integration Platform"
    type: cross-team
    teams: [team_1, team_2, team_3]
    status: in-progress
    priority: critical
    deadline: "2025-01-25"
    dependencies: ["Feature 1.1"]
    
  # Rôle individuel
  - title: "Architecture Decision Records"
    type: individual
    teams: []
    status: in-progress
    priority: high
    deadline: "2025-01-15"
```

## ✅ Validation du fichier

### Checklist avant import

- [ ] Structure `teams:` et `subjects:` présentes
- [ ] Tous les `id` d'équipes sont uniques
- [ ] Tous les sujets ont `title`, `type`, `status`, `priority`
- [ ] Les `teams` référencés existent dans la section `teams`
- [ ] Les dates sont au format `YYYY-MM-DD`
- [ ] Les valeurs d'énumération sont correctes
- [ ] Le fichier est encodé en UTF-8

### Outils de validation

**En ligne** :
- https://www.yamllint.com/

**Ligne de commande** :
```bash
# Avec Python
python -c "import yaml; yaml.safe_load(open('mon-fichier.yaml'))"

# Avec yamllint
yamllint mon-fichier.yaml
```

## 🔧 Conseils de modélisation

### 1. Nommage des IDs

```yaml
# ✅ Bon : kebab-case, descriptif
id: team_alpha
id: squad_backend

# ❌ Mauvais : trop court, peu clair
id: t1
id: a
```

### 2. Granularité des sujets

```yaml
# ✅ Bon : Niveau feature/epic
title: "Migration Base de Données"

# ❌ Mauvais : Trop détaillé (niveau tâche)
title: "Créer script SQL migration table users"
```

### 3. Dépendances

```yaml
# ✅ Bon : Dépendances réelles et bloquantes
dependencies: ["Migration Base de Données"]

# ❌ Mauvais : Trop de dépendances (complexité)
dependencies: ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4"]
```

### 4. Échéances réalistes

```yaml
# ✅ Bon : Échéance alignée avec le sprint/PI
deadline: "2025-01-31"  # Fin du sprint

# ❌ Mauvais : Échéance trop précise
deadline: "2025-01-23"  # Milieu de sprint
```

## 📤 Export depuis d'autres outils

### JIRA (via API)

```bash
# Exemple de requête JIRA REST API
curl -u email:token \
  "https://votreentreprise.atlassian.net/rest/api/3/search?jql=project=PROJ" \
  | jq '.issues[] | {title: .fields.summary, status: .fields.status.name}'
```

### Trello (via export JSON)

Convertir le JSON Trello en YAML avec un script Python :

```python
import json
import yaml

with open('trello-export.json') as f:
    trello = json.load(f)

data = {
    'teams': [],
    'subjects': []
}

for card in trello['cards']:
    data['subjects'].append({
        'title': card['name'],
        'type': 'team',
        'status': 'in-progress',
        'priority': 'medium'
    })

with open('output.yaml', 'w') as f:
    yaml.dump(data, f)
```

## 🆘 Erreurs courantes

### Erreur : "Structure YAML invalide"

**Cause** : Indentation incorrecte

```yaml
# ❌ Mauvais
teams:
- id: team_1
  name: "Team 1"
 members: 8  # Indentation incorrecte

# ✅ Bon
teams:
  - id: team_1
    name: "Team 1"
    members: 8
```

### Erreur : "Team ID not found"

**Cause** : Référence à une équipe inexistante

```yaml
teams:
  - id: team_alpha

subjects:
  - teams: [team_beta]  # ❌ team_beta n'existe pas
```

### Erreur : "Invalid date format"

**Cause** : Format de date incorrect

```yaml
# ❌ Mauvais
deadline: "15/01/2025"
deadline: "2025-1-15"

# ✅ Bon
deadline: "2025-01-15"
```

---

**Besoin d'aide ?** Consultez les exemples dans `assets/data/templates/`
