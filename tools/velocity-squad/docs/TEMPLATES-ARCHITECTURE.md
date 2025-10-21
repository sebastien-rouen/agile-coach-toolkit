# Architecture des Templates Métiers

## Vue d'ensemble

Le système de templates permet de charger rapidement des configurations pré-définies adaptées à différents contextes métiers. Cette documentation décrit l'architecture technique et les conventions utilisées.

## Structure des Fichiers

```
tools/velocity-squad/
├── js/
│   ├── templates-data.js      # Définition des templates
│   ├── script.js               # Logique principale (méthodes de chargement)
│   └── team-manager.js         # Gestion d'équipe
├── index.html                  # Interface utilisateur (modals)
├── css/
│   └── styles.css              # Styles des templates
└── docs/
    ├── TEMPLATES-GUIDE.md      # Guide utilisateur
    └── TEMPLATES-ARCHITECTURE.md  # Ce fichier
```

## Format d'un Template

### Structure de Base

```javascript
'framework-metier': {
    name: "🎯 Nom du Template",
    framework: 'scrum' | 'kanban',
    sprints: [...],
    team: [...],
    annotationsTemplate: [...],
    events: [...],
    qualityMetrics: {...},
    settings: {...}
}
```

### Propriétés Détaillées

#### `name` (string)
- Format : `"🎯 Métier (Framework)"`
- Exemple : `"🛒 IT - E-commerce (Scrum)"`
- Inclut un emoji pour identification visuelle

#### `framework` (string)
- Valeurs : `'scrum'` ou `'kanban'`
- Détermine le mode de fonctionnement
- Doit correspondre au préfixe de la clé

#### `sprints` (array)
Tableau d'objets sprint/période :

```javascript
{
    name: "Sprint 1",              // Nom du sprint
    velocity: 21,                  // Points livrés
    startDate: "2025-06-02",       // Date de début (YYYY-MM-DD)
    endDate: "2025-06-15",         // Date de fin (YYYY-MM-DD)
    goal: "Objectif détaillé"      // Sprint Goal (obligatoire)
}
```

**Conventions** :
- Scrum : "Sprint X"
- Kanban : "Semaine X" ou "Période X"
- Vélocité réaliste selon la taille d'équipe
- Dates cohérentes et séquentielles
- Goal descriptif et actionnable

#### `team` (array)
Tableau de membres d'équipe :

```javascript
{
    id: 1,                         // ID unique (numérique)
    name: "Prénom",                // Prénom du membre
    role: "Rôle",                  // Rôle dans l'équipe
    capacity: 100,                 // Capacité en % (0-100)
    skills: ["Skill1", "Skill2"]   // Compétences (array)
}
```

**Conventions** :
- IDs séquentiels (1, 2, 3...)
- Noms fictifs courts
- Rôles spécifiques au métier
- Capacity : 100 = temps plein, 80 = 4j/semaine, etc.
- Skills : 3-5 compétences pertinentes

#### `annotationsTemplate` (array)
Annotations liées aux sprints :

```javascript
{
    sprintIndex: 0,                // Index du sprint (0-based)
    type: "release",               // Type d'annotation
    text: "Description"            // Texte de l'annotation
}
```

**Types disponibles** :
- `team` : Changement d'équipe
- `vacation` : Congés
- `incident` : Incident technique
- `process` : Changement de processus
- `release` : Déploiement
- `training` : Formation

**Conventions** :
- 3-5 annotations par template
- Réparties sur différents sprints
- Contextuelles au métier
- Texte concis et informatif

#### `events` (array, optionnel)
Événements de planning :

```javascript
{
    type: "daily",                 // Type d'événement
    title: "Daily Standup",        // Titre
    date: "2025-06-30",            // Date (YYYY-MM-DD)
    time: "09:00",                 // Heure (HH:MM)
    duration: 15,                  // Durée en minutes
    recurring: true,               // Récurrent (optionnel)
    description: "..."             // Description (optionnel)
}
```

**Types d'événements** :
- `daily` : Daily Standup
- `sprint_planning` : Sprint Planning
- `backlog_refinement` : Backlog Refinement
- `sprint_review` : Sprint Review
- `sprint_retrospective` : Sprint Retrospective
- `retrospective` : Retrospective (Kanban)

#### `qualityMetrics` (object, optionnel)
Métriques de qualité :

```javascript
{
    bugRate: 5,                    // Taux de bugs (nombre)
    testCoverage: 80               // Couverture de tests (%)
}
```

#### `settings` (object)
Configuration du template :

```javascript
{
    framework: 'scrum',            // Framework (doit correspondre)
    sprintLength: 14,              // Durée en jours
    workingDays: 10                // Jours ouvrés
}
```

**Conventions** :
- Scrum : 7-21 jours (typiquement 14)
- Kanban : 7 jours (semaine)
- workingDays : ~70% de sprintLength

## Conventions de Nommage

### Clés de Template

Format : `framework-metier`

Exemples :
- `scrum-it-ecommerce`
- `kanban-devops`
- `scrum-medical`

**Règles** :
- Tout en minuscules
- Tirets pour séparer les mots
- Préfixe = framework
- Suffixe = métier descriptif

### Noms de Template

Format : `🎯 Métier (Framework)`

Exemples :
- `"🛒 IT - E-commerce (Scrum)"`
- `"⚙️ DevOps (Kanban)"`
- `"🏥 Médical (Scrum)"`

**Règles** :
- Emoji représentatif du métier
- Nom du métier clair
- Framework entre parenthèses

## Flux de Chargement

### 1. Sélection du Template

```javascript
// Utilisateur clique sur une carte template
openTemplateConfirmation(templateKey, framework)
```

**Actions** :
1. Récupération du template depuis `TEMPLATES_DATA`
2. Stockage dans `this.selectedTemplate`
3. Affichage du nom dans la modal
4. Génération des options de session

### 2. Confirmation

```javascript
// Utilisateur confirme le chargement
confirmTemplateLoad()
```

**Actions** :
1. Vérification de l'option sélectionnée
2. Création de nouvelle session si nécessaire
3. Appel de `loadTemplateData()`

### 3. Chargement des Données

```javascript
// Chargement effectif du template
loadTemplateData(template)
```

**Actions** :
1. Génération d'IDs uniques pour les sprints
2. Création des annotations avec les bons `sprintId`
3. Génération des données de mood (30 jours)
4. Création des événements avec IDs uniques
5. Copie des données dans `this.data`
6. Mise à jour de l'interface
7. Sauvegarde (localStorage ou PocketBase)
8. Validation de la cohérence

### 4. Validation

```javascript
// Vérification de la cohérence
validateTemplateData()
```

**Vérifications** :
- Annotations → sprints existants
- Membres d'équipe complets
- Sprints valides
- Cohérence des IDs

## Génération des IDs

### Stratégie

Pour éviter les conflits d'IDs entre templates et données existantes :

```javascript
const baseId = Date.now();

// Sprints : baseId + index
sprints[0].id = baseId + 0
sprints[1].id = baseId + 1

// Annotations : baseId + 1000 + index
annotations[0].id = baseId + 1000
annotations[1].id = baseId + 1001

// Événements : baseId + 2000 + index
events[0].id = baseId + 2000
events[1].id = baseId + 2001
```

**Avantages** :
- IDs uniques garantis
- Pas de collision avec données existantes
- Traçabilité temporelle

## Génération du Mood

### Algorithme

```javascript
generateMoodData(days, teamMembers)
```

**Logique** :
1. Boucle sur les N derniers jours
2. Pour chaque membre d'équipe
3. Calcul du score basé sur :
   - Jour de la semaine (lundi bas, vendredi haut)
   - Variation personnelle (basée sur l'index)
   - Variation aléatoire
4. Score final entre 1 et 3
5. Commentaire selon le score

**Patterns réalistes** :
- Lundi : score ~1.8
- Vendredi : score ~2.7
- Weekend : pas de données
- Variation individuelle : ±0.2
- Variation aléatoire : ±0.3

## Interface Utilisateur

### Modal Templates

Structure HTML :

```html
<div id="templatesModal" class="modal">
    <div class="modal-content modal-large">
        <div class="templates-columns">
            <!-- Colonne Scrum -->
            <div class="template-column">
                <h3>🏃‍♂️ Scrum</h3>
                <div class="template-cards-list">
                    <!-- Cartes templates -->
                </div>
            </div>
            
            <!-- Colonne Kanban -->
            <div class="template-column">
                <h3>🌊 Kanban</h3>
                <div class="template-cards-list">
                    <!-- Cartes templates -->
                </div>
            </div>
        </div>
    </div>
</div>
```

### Carte Template

```html
<div class="template-card" 
     data-template="scrum-it-ecommerce" 
     data-framework="scrum">
    <div class="template-icon">🛒</div>
    <h4>IT - E-commerce</h4>
    <p>Équipe 5 pers, sprints 2 semaines<br>
       Développement plateforme e-commerce</p>
</div>
```

**Attributs data** :
- `data-template` : Clé du template
- `data-framework` : Framework (scrum/kanban)

### Modal Confirmation

```html
<div id="templateConfirmModal" class="modal">
    <div class="modal-content">
        <h2>💾 Sauvegarder le template</h2>
        <p>Template : <strong id="selectedTemplateName"></strong></p>
        
        <div id="sessionOptions">
            <!-- Options générées dynamiquement -->
        </div>
        
        <button id="confirmTemplateSaveBtn">💾 Sauvegarder</button>
        <button id="cancelTemplateSaveBtn">Annuler</button>
    </div>
</div>
```

## Styles CSS

### Layout Colonnes

```css
.templates-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}
```

### Carte Template

```css
.template-card {
    border: 2px solid #ddd;
    border-radius: 10px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.template-card:hover {
    border-color: var(--primary);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

### Responsive

```css
@media (max-width: 768px) {
    .templates-columns {
        grid-template-columns: 1fr;
    }
}
```

## Intégration PocketBase

### Sauvegarde

Si PocketBase est disponible, les données sont sauvegardées automatiquement :

```javascript
// Dans loadTemplateData()
if (typeof saveSprintToPocketBase !== 'undefined') {
    await saveSprintToPocketBase(sprint);
}
```

**Collections concernées** :
- `sprints` : Sprints/périodes
- `team_members` : Membres d'équipe
- `annotations` : Annotations
- `mood_tracking` : Mood quotidien
- `events` : Événements de planning

### Sessions

Avec PocketBase, plusieurs sessions peuvent coexister :

```javascript
// Créer une nouvelle session
if (typeof createNewSession !== 'undefined') {
    await createNewSession();
}
```

## Tests et Validation

### Fichier de Test

`tests/test-templates.html` permet de :
- Visualiser tous les templates
- Vérifier la structure
- Lancer des tests de validation
- Détecter les incohérences

### Tests Automatiques

1. **Présence du nom** : Tous les templates ont un nom
2. **Présence des sprints** : Au moins 1 sprint
3. **Présence de l'équipe** : Au moins 1 membre
4. **Objectifs des sprints** : Tous les sprints ont un goal
5. **Compétences** : Tous les membres ont des skills
6. **Framework valide** : scrum ou kanban
7. **Cohérence clé/framework** : La clé commence par le framework

## Bonnes Pratiques

### Création d'un Nouveau Template

1. **Recherche** : Identifier le contexte métier
2. **Structure** : Copier un template similaire
3. **Adaptation** :
   - Modifier le nom et la clé
   - Ajuster les sprints (durée, vélocité)
   - Définir l'équipe (rôles, compétences)
   - Créer des annotations contextuelles
   - Configurer les événements
4. **Validation** : Tester avec `test-templates.html`
5. **Documentation** : Ajouter dans `TEMPLATES-GUIDE.md`

### Maintenance

- **Cohérence** : Vérifier régulièrement avec les tests
- **Mise à jour** : Adapter aux évolutions du métier
- **Feedback** : Intégrer les retours utilisateurs
- **Versioning** : Documenter les changements dans CHANGELOG

### Performance

- **Lazy loading** : Templates chargés à la demande
- **IDs uniques** : Éviter les conflits
- **Validation** : Vérifier la cohérence après chargement
- **Optimisation** : Limiter la taille des templates

## Évolutions Futures

### Fonctionnalités Envisagées

1. **Templates personnalisés** :
   - Sauvegarde de configurations utilisateur
   - Partage de templates entre équipes
   - Import/export de templates

2. **Templates dynamiques** :
   - Génération basée sur des paramètres
   - Adaptation automatique selon la taille d'équipe
   - Calcul intelligent de la vélocité

3. **Marketplace** :
   - Bibliothèque communautaire
   - Notation et commentaires
   - Catégories et tags

4. **IA** :
   - Suggestion de templates
   - Optimisation automatique
   - Prédictions personnalisées

## Support

Pour toute question technique :
- 📧 Email : rouen.sebastien@gmail.com
- 💬 GitHub : https://github.com/sebastien-rouen/
- 📖 Documentation : [TEMPLATES-GUIDE.md](TEMPLATES-GUIDE.md)
