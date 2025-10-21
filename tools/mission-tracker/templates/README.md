# 🎬 Templates de Démonstration - Mission Tracker

## 📋 Vue d'ensemble

Ce dossier contient des templates de démonstration pour Mission Tracker. Ces templates permettent aux utilisateurs de découvrir l'outil avec des données réalistes et complètes.

---

## 🎯 Templates disponibles

### 1. **Scrum Master** (`demo-scrum-master.json`)

**Contexte** : Transformation agile dans une banque digitale

**Contenu** :
- 1 mission active (BankTech Solutions)
- 4 objectifs (2 complétés)
- 5 événements clés (milestone, achievement, meeting, issue, delivery)
- 2 réalisations majeures
- 1 défi résolu

**Cas d'usage** : Idéal pour montrer le suivi d'une mission Scrum Master classique avec cérémonies, métriques de vélocité, et gestion d'équipe.

---

### 2. **Coach Agile** (`demo-coach-agile.json`)

**Contexte** : Transformation à l'échelle avec SAFe dans une assurance

**Contenu** :
- 1 mission active (AssurPlus Group)
- 5 objectifs (3 complétés)
- 6 événements majeurs (PI Planning, communauté, formation, metrics)
- 2 réalisations (certifications, DoD)
- 2 défis organisationnels (1 résolu, 1 en cours)
- 1 expérimentation réussie (Mob Programming)

**Cas d'usage** : Parfait pour illustrer une mission de coaching à grande échelle avec plusieurs équipes, framework SAFe, et transformation culturelle.

---

### 3. **Product Owner** (`demo-product-owner.json`)

**Contexte** : Refonte d'application mobile e-commerce

**Contenu** :
- 1 mission active (ShopNow)
- 4 objectifs business (2 complétés)
- 5 événements produit (MVP, release, backlog refinement)
- 2 réalisations techniques
- 1 défi de priorisation résolu
- Métriques : NPS +17 points, Conversion +18%

**Cas d'usage** : Excellent pour démontrer le suivi d'une mission Product Owner avec focus sur les métriques business et la gestion de backlog.

---

## 🔧 Structure d'un template

Chaque template suit cette structure JSON :

```json
{
  "name": "Nom de la démo",
  "description": "Description courte",
  "data": {
    "missions": [...],
    "events": [...],
    "achievements": [...],
    "challenges": [...],
    "experiments": [...]
  }
}
```

### Champs obligatoires

#### Mission
- `id` : Identifiant unique (ex: "demo-sm-001")
- `title` : Titre de la mission
- `client` : Nom du client
- `role` : Rôle (scrum-master, coach-agile, product-owner, etc.)
- `start_date` : Date de début (format YYYY-MM-DD)
- `status` : Statut (active, completed, paused)
- `objectives` : Tableau d'objectifs
- `createdAt` : Date de création ISO
- `updatedAt` : Date de mise à jour ISO

#### Event
- `id` : Identifiant unique
- `mission_id` : ID de la mission liée
- `type` : Type (milestone, meeting, delivery, issue, achievement)
- `title` : Titre de l'événement
- `date` : Date (format YYYY-MM-DD)
- `impact` : Impact (low, medium, high)

#### Achievement
- `id` : Identifiant unique
- `mission_id` : ID de la mission liée
- `title` : Titre de la réalisation
- `description` : Description détaillée
- `date` : Date (format YYYY-MM-DD)
- `impact` : Impact (low, medium, high)

#### Challenge
- `id` : Identifiant unique
- `mission_id` : ID de la mission liée
- `title` : Titre du défi
- `description` : Description du défi
- `date` : Date d'identification
- `status` : Statut (identified, in_progress, resolved, escalated, abandoned)
- `severity` : Sévérité (low, medium, high, critical)

---

## 🎨 Bonnes pratiques pour créer un template

### 1. Réalisme
- Utiliser des noms d'entreprises fictifs mais crédibles
- Dates cohérentes et récentes
- Métriques réalistes

### 2. Complétude
- Minimum 1 mission avec 4-5 objectifs
- 5-6 événements variés
- 2-3 réalisations
- 1-2 défis (dont au moins 1 résolu)

### 3. Diversité
- Varier les types d'événements
- Mélanger objectifs complétés et en cours
- Inclure des défis résolus et en cours

### 4. Pédagogie
- Choisir des exemples parlants
- Illustrer les fonctionnalités clés
- Montrer l'évolution dans le temps

---

## 🚀 Utilisation

### Dans l'application

1. Cliquer sur le menu (⋮) dans le header
2. Sélectionner "Charger une démo"
3. Choisir un template
4. Confirmer le chargement

**⚠️ Attention** : Charger une démo remplace toutes les données actuelles. Pensez à exporter avant !

### Programmatiquement

```javascript
// Charger un template
await loadDemoTemplate('demo-scrum-master');

// Ou directement via fetch
const response = await fetch('templates/demo-scrum-master.json');
const template = await response.json();
```

---

## 📝 Créer un nouveau template

### 1. Créer le fichier JSON

```bash
touch tools/mission-tracker/templates/demo-mon-template.json
```

### 2. Suivre la structure

Copier un template existant et adapter :
- Changer les IDs (préfixe unique)
- Modifier le contenu
- Vérifier la cohérence des dates
- Tester le chargement

### 3. Ajouter dans la modale

Éditer `index.html` et ajouter une carte dans `.demo-templates` :

```html
<div class="demo-card" data-template="demo-mon-template">
  <div class="demo-card-icon">🎯</div>
  <div class="demo-card-content">
    <h3>Mon Template</h3>
    <p>Description du template</p>
    <ul class="demo-card-features">
      <li>✅ X objectifs</li>
      <li>📅 Y événements</li>
    </ul>
  </div>
  <sl-button variant="primary" class="btn-load-template">
    <sl-icon name="play-circle"></sl-icon>
    Charger
  </sl-button>
</div>
```

---

## 🧪 Tests

### Checklist avant commit

- [ ] JSON valide (pas d'erreur de syntaxe)
- [ ] Tous les IDs sont uniques
- [ ] Les `mission_id` correspondent bien
- [ ] Les dates sont au format YYYY-MM-DD
- [ ] Les champs obligatoires sont présents
- [ ] Le template se charge sans erreur
- [ ] Les données s'affichent correctement dans l'UI

### Commande de validation

```bash
# Valider le JSON
cat demo-mon-template.json | jq .

# Tester le chargement
# Ouvrir l'application et charger le template
```

---

## 📊 Statistiques des templates

| Template | Missions | Objectifs | Événements | Réalisations | Défis | Expérimentations |
|----------|----------|-----------|------------|--------------|-------|------------------|
| Scrum Master | 1 | 4 | 5 | 2 | 1 | 0 |
| Coach Agile | 1 | 5 | 6 | 2 | 2 | 1 |
| Product Owner | 1 | 4 | 5 | 2 | 1 | 0 |

---

## 🔄 Maintenance

### Mise à jour des templates

- Vérifier la compatibilité avec les nouvelles versions
- Ajouter de nouveaux champs si nécessaire
- Mettre à jour les dates pour rester récent
- Améliorer le contenu selon les retours utilisateurs

### Versioning

Les templates suivent le versioning de l'application. En cas de breaking change dans la structure des données, créer de nouvelles versions des templates.

---

## 📞 Support

- **Documentation** : `tools/mission-tracker/docs/`
- **GitHub** : https://github.com/sebastien-rouen/
- **Support** : https://buymeacoffee.com/sebastien.rouen
- **Email** : rouen.sebastien@gmail.com

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024-11-24  
**Auteur** : Sébastien ROUEN  
**Licence** : MIT

🎉 **Templates prêts à l'emploi pour découvrir Mission Tracker !**
