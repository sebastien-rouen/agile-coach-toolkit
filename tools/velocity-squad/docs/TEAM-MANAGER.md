# 👥 Team Manager - Gestion CRUD des Membres

## Vue d'ensemble

Le **Team Manager** remplace l'ancienne "Heatmap Burnout" par une interface moderne de gestion CRUD (Create, Read, Update, Delete) des membres d'équipe avec suivi du mood intégré directement sur chaque ligne.

## Fonctionnalités

### ✨ Gestion des Membres

- **Ajout** : Créer un nouveau membre avec nom, rôle, compétences et capacité
- **Modification** : Éditer les informations d'un membre existant
- **Suppression** : Retirer un membre de l'équipe (avec confirmation)
- **Affichage** : Liste claire et organisée de tous les membres

### 😊 Mood Tracking Intégré

Chaque ligne de membre affiche 3 boutons de mood :
- **😊 Super** : Journée productive et positive
- **😐 Correct** : Journée normale
- **😞 Difficile** : Journée compliquée

Le mood est enregistré par jour et par membre. Un seul mood par jour et par membre.

## Architecture

### Fichiers

```
tools/velocity-squad/
├── js/
│   ├── team-manager.js          # Logique CRUD et mood
│   ├── script.js                # Script principal (modifié)
│   └── pocketbase-integration.js
├── css/
│   ├── team-manager.css         # Styles de la section équipe
│   └── styles.css               # Styles principaux
├── docs/
│   ├── TEAM-MANAGER.md          # Cette documentation
│   ├── README.md
│   └── CHANGELOG.md
└── index.html                   # Page principale (modifiée)
```

### Structure HTML

```html
<section class="team-section">
    <h3>
        <span>👥 Gestion de l'Équipe</span>
        <button id="addTeamMemberBtn">➕ Ajouter Membre</button>
    </h3>
    
    <div id="teamMembersContainer">
        <!-- Liste des membres générée dynamiquement -->
    </div>
    
    <div id="teamMemberFormContainer" style="display: none;">
        <!-- Formulaire d'ajout/édition -->
    </div>
</section>
```

### Ligne de Membre

Chaque membre est affiché sur une ligne avec :

```
┌─────────────────────────────────────────────────────────────────┐
│ 👤 Marie Dupont                    😊 😐 😞      100%    ✏️ 🗑️ │
│    Développeur Frontend                                          │
│    React, TypeScript, CSS                                        │
└─────────────────────────────────────────────────────────────────┘
```

- **Colonne 1** : Informations (nom, rôle, compétences)
- **Colonne 2** : Sélecteur de mood (3 boutons)
- **Colonne 3** : Capacité en %
- **Colonne 4** : Actions (éditer, supprimer)

## Utilisation

### Ajouter un Membre

1. Cliquer sur **"➕ Ajouter Membre"**
2. Remplir le formulaire :
   - Nom (requis)
   - Rôle (requis)
   - Compétences (optionnel, séparées par virgules)
   - Capacité (0-100%, défaut 100%)
3. Cliquer sur **"💾 Enregistrer"**

### Modifier un Membre

1. Cliquer sur l'icône **✏️** sur la ligne du membre
2. Le formulaire s'affiche pré-rempli
3. Modifier les informations
4. Cliquer sur **"💾 Enregistrer"**

### Supprimer un Membre

1. Cliquer sur l'icône **🗑️** sur la ligne du membre
2. Confirmer la suppression dans la popup

### Enregistrer le Mood

1. Cliquer sur l'un des 3 boutons de mood sur la ligne du membre
2. Le mood est enregistré instantanément
3. Le bouton actif est mis en surbrillance
4. Un seul mood par jour et par membre (écrase l'ancien)

## Intégration PocketBase

Le Team Manager s'intègre automatiquement avec PocketBase si disponible :

### Collections Utilisées

- **`velocity_team`** : Stockage des membres
- **`velocity_mood`** : Stockage des moods quotidiens

### Fonctions PocketBase

```javascript
// Sauvegarde d'un membre
await saveTeamMemberToPocketBase(member);

// Mise à jour d'un membre
await updateTeamMemberInPocketBase(member);

// Suppression d'un membre
await deleteTeamMemberFromPocketBase(member);

// Sauvegarde d'un mood
await saveMoodToPocketBase(moodEntry);
```

## API JavaScript

### Classe TeamManager

```javascript
class TeamManager {
    constructor(velocityTool)
    
    // Affichage
    render()
    
    // CRUD Membres
    saveMember()
    editMember(id)
    deleteMember(id)
    
    // Mood
    saveMoodForMember(memberId, mood)
    getMoodForMember(memberId)
    getMoodIcon(score)
    
    // Formulaire
    showAddMemberForm()
    hideAddMemberForm()
    resetForm()
}
```

### Initialisation

```javascript
// Dans script.js
document.addEventListener('DOMContentLoaded', () => {
    window.velocityTool = new VelocityTool();
    window.teamManager = new TeamManager(window.velocityTool);
    window.teamManager.render();
});
```

## Données

### Structure Membre

```javascript
{
    id: 1729425600000,
    name: "Marie Dupont",
    role: "Développeur Frontend",
    skills: ["React", "TypeScript", "CSS"],
    capacity: 100,
    createdAt: "2025-10-20T09:00:00.000Z"
}
```

### Structure Mood

```javascript
{
    id: 1729425600001,
    date: "2025-10-20",
    score: 3,              // 1=😞, 2=😐, 3=😊
    memberId: 1729425600000,
    memberName: "Marie Dupont",
    timestamp: "2025-10-20T09:15:00.000Z"
}
```

## Styles CSS

### Variables Utilisées

```css
--primary: #2196F3;
--danger: #F44336;
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
--border-radius: 8px;
--transition: all 0.3s ease;
```

### Classes Principales

- `.team-section` : Conteneur principal
- `.team-member-row` : Ligne de membre
- `.mood-btn-inline` : Bouton de mood
- `.btn-icon` : Bouton d'action (éditer/supprimer)

## Responsive

Le design s'adapte automatiquement aux petits écrans :

```css
@media (max-width: 768px) {
    .team-member-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}
```

## Migration depuis Heatmap Burnout

### Changements

1. **Section HTML** : `heatmap-section` → `team-section`
2. **Fichiers** : Ajout de `team-manager.js` et `team-manager.css`
3. **Fonction supprimée** : `renderBurnoutHeatmap()`
4. **Données conservées** : Les moods existants restent compatibles

### Compatibilité

Les données de mood existantes sont **100% compatibles** :
- Même structure de données
- Même collection PocketBase
- Affichage différent mais données identiques

## Avantages

### Par rapport à la Heatmap

✅ **Interface plus claire** : Actions directes sur chaque ligne  
✅ **Mood immédiat** : Enregistrement en un clic  
✅ **CRUD complet** : Gestion complète des membres  
✅ **Moins d'espace** : Pas de grille 12 semaines  
✅ **Plus intuitif** : Tout sur une seule ligne  

### Performance

- Rendu instantané (pas de calculs complexes)
- Mise à jour ciblée (un seul membre à la fois)
- Pas de boucles imbriquées

## Exemples d'Utilisation

### Ajouter une Équipe Complète

```javascript
const team = [
    { name: "Alice", role: "Product Owner", skills: ["Agile", "UX"], capacity: 100 },
    { name: "Bob", role: "Scrum Master", skills: ["Facilitation", "Coaching"], capacity: 80 },
    { name: "Charlie", role: "Dev Backend", skills: ["Node.js", "PostgreSQL"], capacity: 100 }
];

team.forEach(async (member) => {
    member.id = Date.now() + Math.random();
    window.velocityTool.data.team.push(member);
    await saveTeamMemberToPocketBase(member);
});

window.teamManager.render();
```

### Enregistrer le Mood de Toute l'Équipe

```javascript
const team = window.velocityTool.data.team;
team.forEach(member => {
    const mood = Math.floor(Math.random() * 3) + 1; // 1-3
    window.teamManager.saveMoodForMember(member.id, mood);
});
```

## Dépannage

### Le formulaire ne s'affiche pas

Vérifier que `team-manager.js` est bien chargé :
```javascript
console.log(window.TeamManager); // Doit afficher la classe
```

### Les moods ne s'enregistrent pas

Vérifier la structure des données :
```javascript
console.log(window.velocityTool.data.moodTracking);
```

### Les membres ne s'affichent pas

Vérifier le conteneur :
```javascript
console.log(document.getElementById('teamMembersContainer'));
```

## Roadmap

### Futures Améliorations

- [ ] Filtrage par rôle/compétence
- [ ] Export CSV de l'équipe
- [ ] Historique des moods par membre
- [ ] Graphique d'évolution du mood
- [ ] Notifications de mood bas
- [ ] Intégration avec le radar de performance

---

**Version** : 2.0.0  
**Date** : 20 octobre 2025  
**Auteur** : Sébastien ROUEN
