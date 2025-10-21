# 🎯 Visualiseur de Sujets Multi-Équipes

## Description

Outil de visualisation **MindMap** pour cartographier les sujets de travail d'organisations de 80+ personnes, avec codes couleurs d'alerte automatiques et CRUD intégré.

**Contexte Méthodologique** : Dans les frameworks Agile à l'échelle (SAFe, LeSS, Spotify Model), gérer la visibilité des nombreux sujets cross-équipes devient critique. Ce visualiseur offre une vue d'ensemble instantanée pour :
- **PI Planning** : Visualiser les features d'un ART
- **Scrum of Scrums** : Identifier les dépendances bloquantes
- **Management** : Reporting visuel des sujets critiques

---

## 🚀 Utilisation

### Démarrage Rapide

1. **Charger une démo** :
   - Cliquer sur "📥 Importer" → "Charger une démo"
   - Choisir entre SAFe ART, Spotify Model ou exemple simple

2. **Deux vues disponibles** :

   **🌳 Vue MindMap** (par défaut) :
   - Arborescence hiérarchique par équipe
   - Détails complets de chaque sujet
   - Emojis de priorité (🔥 critique, ⚡ haute, ⭐ moyenne, 💡 basse)
   - Emojis d'échéance (⏰ retard, ⏱️ urgent, 📆 proche)
   - Badges colorés pour les priorités
   - Dépendances détaillées avec liens

   **🎯 Vue Radar** (nouveau !) :
   - Visualisation type stakeholder mapping
   - Placement selon la criticité (distance du centre)
   - Un axe par équipe
   - Identification rapide des zones à risque
   - Tooltips interactifs au survol
   - [📖 Guide complet de la vue Radar](RADAR-VIEW.md)

3. **Codes couleurs** :
   - 🔴 = Danger (échéance dépassée, bloqué)
   - 🟠 = Warning (échéance < 7j)
   - 🟢 = OK (dans les temps)
   - ⚪ = Neutre (pas d'échéance)
   - 🔵 = Dépendances entre sujets

4. **Filtres** :
   - Par type : Équipe | Cross-équipe | Individuel
   - Par statut : 🔴 🟠 🟢 ⚪
   - Par équipe : Sélection dropdown
   - Recentrage automatique après filtrage

### Gestion des Sujets (CRUD)

1. Cliquer sur "✏️ Gérer" (header)
2. Interface tableau avec actions :
   - ➕ **Créer** : Nouveau sujet
   - ✏️ **Éditer** : Modifier un sujet existant
   - 🗑️ **Supprimer** : Retirer un sujet
3. Champs disponibles :
   - Titre, Type, Statut, Priorité
   - Échéance (calcul automatique du code couleur)
   - Équipes affectées (multi-sélection)
   - Description

--- 

### 📁 Structure Complète
```
agile/
├── tools/
│   └── visualizer/
│       ├── index.html
│       ├── crud.html
│       ├── assets/
│       │   ├── css/
│       │   │   ├── visualizer.css
│       │   │   ├── mindmap.css
│       │   │   └── responsive.css
│       │   ├── js/
│       │   │   ├── visualizer.js
│       │   │   ├── mindmap-renderer.js
│       │   │   ├── crud-manager.js
│       │   │   ├── alert-engine.js
│       │   │   └── import-manager.js
│       │   └── data/
│       │       └── templates/
│       │           ├── demo-safe.yaml
│       │           ├── demo-spotify.yaml
│       │           └── demo-simple.yaml
│       └── README.md
```

--- 

### Import de Données

**YAML** :
```yaml
teams:
  - id: team_alpha
    name: "Team Alpha"
    members: 8
    color: "#3498db"
    icon: "🚀"

subjects:
  - title: "Migration Base de Données"
    type: cross-team
    teams: [team_alpha]
    status: in-progress
    priority: critical
    deadline: "2024-02-15"
```

Glisser-déposer le fichier YAML dans la zone d'import.

**JIRA** :
1. Configurer : URL, Email, API Token
2. Sélectionner le projet
3. Import automatique des issues

---

## ⚙️ Configuration

### Variables dans `config.json`

```json
{
  "id": "visualizer",
  "name": "Visualiseur Multi-Équipes",
  "icon": "🎯",
  "path": "tools/visualizer",
  "description": "Cartographie visuelle des sujets avec codes couleurs d'alerte",
  "order": 10,
  "features": {
    "mindmap": true,
    "crud": true,
    "import_jira": true,
    "import_yaml": true,
    "export": true
  },
  "alert_thresholds": {
    "warning_days": 7,
    "critical_days": 14
  }
}
```

### Personnalisation des Codes Couleurs

Modifier `assets/js/alert-engine.js` :

```javascript
static getAlertStatus(subject) {
  // Personnaliser les seuils
  const WARNING_DAYS = 7;   // Modifier ici
  const CRITICAL_DAYS = 14; // Modifier ici
  
  // ... reste du code
}
```

---

## 📚 Références Agile

### SAFe (Scaled Agile Framework)

**Use case** : PI Planning avec 80 personnes
- **Problème** : Visualiser 23 features sur 5 équipes en 2 jours
- **Solution** : Projeter la MindMap en plénière
  - 1 branche = 1 équipe
  - Sous-branches = features assignées
  - Codes couleurs = échéances et blocages
- **Résultat** : Alignement immédiat, moins de réunions post-PI

**Références** :
- [PI Planning](https://scaledagileframework.com/pi-planning/)
- [Agile Release Train](https://scaledagileframework.com/agile-release-train/)

### Spotify Model

**Use case** : Coordination Squads & Guilds
- **Problème** : 12 squads, 4 guilds, sujets transverses invisibles
- **Solution** : Vue MindMap
  - Branches niveau 1 = Squads
  - Sujets cross-team = Initiatives Guild
  - Filtre par Guild (tag)
- **Résultat** : Identification rapide des silos

**Références** :
- [Spotify Engineering Culture](https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf)

### LeSS (Large-Scale Scrum)

**Use case** : Multi-Team Sprint Planning
- **Problème** : Dépendances entre 8 équipes non documentées
- **Solution** : Liens 🔵 entre sujets
  - Identification automatique des blocages
  - Vue "Dépendances critiques" en un clic
- **Résultat** : Réduction 40% des blocages inter-équipes

**Références** :
- [LeSS Coordination](https://less.works/less/framework/coordination-and-integration)

---

## 🎓 Conseils Coach Sticko

### 💡 Astuce #1 : PI Planning Efficace

> **Avant** : Flip charts illisibles, post-its qui tombent  
> **Après** : MindMap projetée en 4K, tout le monde voit les priorités

**Pratique** :
1. Préparer la MindMap 1 semaine avant (import JIRA)
2. Jour 1 PI : Projeter en mode lecture seule
3. Jour 2 PI : Mode édition collaborative (1 facilitateur)
4. Post-PI : Export PNG pour le reporting

### 💡 Astuce #2 : Daily Scrum of Scrums

> **"Team A attend Team B depuis 3 jours"**  
> → Filtrer sujets cross-team en 🔴 = Instant visibility

**Pratique** :
- Rituel : Chaque RTE consulte la MindMap avant le SoS
- Règle : Tout 🔴 cross-team = discussion obligatoire
- Résultat : -60% de temps de synchronisation

### 💡 Astuce #3 : Reporting Management

> **CTO : "Donne-moi l'état des sujets critiques"**  
> → Screenshot de la vue 🔴 = 30 secondes

**Pratique** :
- Hebdo : Export PNG + tableau Excel
- Mensuel : Analyse tendance (historique des codes couleurs)

---

## 📸 Captures d'Écran

### Vue MindMap Principale
![MindMap](./screenshots/mindmap.png)
*Organisation arborescente avec codes couleurs d'alerte*

### Interface CRUD
![CRUD](./screenshots/crud.png)
*Tableau de gestion des sujets avec filtres*

### Import YAML
![Import](./screenshots/import.png)
*Glisser-déposer d'un fichier de configuration*

---

## 🐛 Troubleshooting

### Les codes couleurs ne s'affichent pas
- **Cause** : Échéances mal formatées
- **Solution** : Vérifier format `YYYY-MM-DD` dans les données

### La MindMap est vide
- **Cause** : Aucune donnée chargée
- **Solution** : Charger une démo ou importer un YAML

### Import JIRA échoue
- **Cause** : Credentials invalides
- **Solution** : Régénérer API Token JIRA

---

## 📦 Templates Inclus

### 1. SAFe ART (demo-safe.yaml)
- 4 équipes (33 personnes)
- 12 sujets dont 3 cross-team
- 2 rôles individuels (PO, Architecte)

### 2. Spotify Model (demo-spotify.yaml)
- 5 squads
- 3 guilds
- 15 sujets avec tags guild

### 3. Simple (demo-simple.yaml)
- 2 équipes
- 5 sujets basiques
- Idéal pour tester

---

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✅ Vue MindMap avec Markmap.js
- ✅ CRUD complet
- ✅ Codes couleurs automatiques
- ✅ Import YAML
- ✅ 3 templates de démo
- ✅ Design responsive Serris-like

### Roadmap v1.1.0
- 🔄 Import JIRA
- 🔄 Export PNG/PDF
- 🔄 Mode collaboratif (multi-users)
- 🔄 Historique des changements
