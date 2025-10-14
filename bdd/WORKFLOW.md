# 🔄 Workflow Skills Matrix - Guide Complet

## 📋 Vue d'Ensemble

Ce document décrit les workflows complets pour utiliser l'outil Skills Matrix, de la création d'une matrice à l'export des données.

## 🎯 Workflow 1 : Création depuis un Template

### Étape 1 : Sélection du Template

```javascript
// Charger la liste des templates
const templates = await pb.collection('tools_skills_matrix_templates')
  .getFullList({
    filter: 'active=true',
    sort: 'category,name'
  });

// Afficher dans l'UI
templates.forEach(template => {
  console.log(`${template.icon} ${template.name} (${template.category})`);
  console.log(`  ${template.description}`);
});
```

**UI Suggérée** :
```
┌─────────────────────────────────────────┐
│  Choisir un template                    │
├─────────────────────────────────────────┤
│  🔐 Authentification (Tech)             │
│     Compétences pour système d'auth     │
│     [6 skills, 2 ownerships, 3 membres] │
│                                          │
│  🎯 Tribu VALUE (Agile)                 │
│     Coaching agile et accompagnement    │
│     [17 skills, 2 ownerships, 14 membres]│
│                                          │
│  🛒 Panier e-commerce (Business)        │
│     Plateforme e-commerce complète      │
│     [6 skills, 3 ownerships, 3 membres] │
│                                          │
│  [Créer une matrice vide]               │
└─────────────────────────────────────────┘
```

### Étape 2 : Personnalisation

```javascript
// Charger le template sélectionné
const template = await pb.collection('tools_skills_matrix_templates')
  .getOne(templateId);

// Afficher un formulaire de personnalisation
const customization = {
  matrixName: "Mon Équipe Auth",
  company: "Ma Startup",
  keepMembers: true,  // Garder les membres exemples
  keepSkills: true,   // Garder les skills
  keepOwnerships: true // Garder les ownerships
};
```

**UI Suggérée** :
```
┌─────────────────────────────────────────┐
│  Personnaliser la matrice               │
├─────────────────────────────────────────┤
│  Nom de la matrice:                     │
│  [Mon Équipe Auth________________]      │
│                                          │
│  Entreprise:                             │
│  [Ma Startup_____________________]      │
│                                          │
│  ☑ Inclure les membres exemples         │
│  ☑ Inclure les skills                   │
│  ☑ Inclure les ownerships               │
│                                          │
│  [Annuler]  [Créer la matrice]          │
└─────────────────────────────────────────┘
```

### Étape 3 : Création de la Matrice

```javascript
// 1. Créer la matrice
const matrix = await pb.collection('tools_skills_matrix_matrices').create({
  name: customization.matrixName,
  company: customization.company,
  active: true
});

// 2. Créer les items (skills + ownerships)
const itemsMap = {}; // Pour mapper nom → id

if (customization.keepSkills) {
  for (const skill of template.data.skills) {
    const item = await pb.collection('tools_skills_matrix_items').create({
      matrix: matrix.id,
      name: skill.name,
      type: "skill",
      category: skill.category,
      active: true
    });
    itemsMap[skill.name] = item.id;
  }
}

if (customization.keepOwnerships) {
  for (const ownership of template.data.ownerships) {
    const item = await pb.collection('tools_skills_matrix_items').create({
      matrix: matrix.id,
      name: ownership.name,
      type: "ownership",
      category: ownership.category,
      active: true
    });
    itemsMap[ownership.name] = item.id;
  }
}

// 3. Créer les membres et associations
if (customization.keepMembers) {
  for (const memberData of template.data.members) {
    const member = await pb.collection('tools_skills_matrix_members').create({
      matrix: matrix.id,
      name: memberData.name,
      role: memberData.role,
      active: true
    });

    // Associer les skills
    for (const [skillName, values] of Object.entries(memberData.skills)) {
      await pb.collection('tools_skills_matrix_member_items').create({
        matrix: matrix.id,
        member: member.id,
        item: itemsMap[skillName],
        level: values.level,
        appetite: values.appetite
      });
    }

    // Associer les ownerships
    for (const [ownershipName, role] of Object.entries(memberData.ownerships)) {
      await pb.collection('tools_skills_matrix_member_items').create({
        matrix: matrix.id,
        member: member.id,
        item: itemsMap[ownershipName],
        ownership_role: role
      });
    }
  }
}

// Rediriger vers la matrice créée
window.location.href = `/tools/skills-matrix/matrix.html?id=${matrix.id}`;
```

## 🎯 Workflow 2 : Création Manuelle

### Étape 1 : Créer la Matrice Vide

```javascript
const matrix = await pb.collection('tools_skills_matrix_matrices').create({
  name: "Mon Équipe",
  company: "Ma Startup",
  description: "Matrice de compétences de l'équipe produit",
  active: true
});
```

### Étape 2 : Ajouter des Membres

```javascript
const members = [
  { name: "Alice Martin", email: "alice@startup.com", role: "Developer" },
  { name: "Bob Dupont", email: "bob@startup.com", role: "Scrum Master" },
  { name: "Charlie Durand", email: "charlie@startup.com", role: "Product Owner" }
];

for (const memberData of members) {
  await pb.collection('tools_skills_matrix_members').create({
    matrix: matrix.id,
    ...memberData,
    active: true
  });
}
```

### Étape 3 : Ajouter des Skills

```javascript
const skills = [
  { name: "JavaScript", category: "Tech" },
  { name: "Python", category: "Tech" },
  { name: "Facilitation", category: "Soft Skills" },
  { name: "Product Vision", category: "Product" }
];

for (const skillData of skills) {
  await pb.collection('tools_skills_matrix_items').create({
    matrix: matrix.id,
    type: "skill",
    ...skillData,
    active: true
  });
}
```

### Étape 4 : Ajouter des Ownerships

```javascript
const ownerships = [
  { name: "OKR Q1 2025", category: "OKR" },
  { name: "Animation rétros", category: "Ritual" },
  { name: "Roadmap Produit", category: "Product" }
];

for (const ownershipData of ownerships) {
  await pb.collection('tools_skills_matrix_items').create({
    matrix: matrix.id,
    type: "ownership",
    ...ownershipData,
    active: true
  });
}
```

### Étape 5 : Évaluer les Compétences

```javascript
// Alice : JavaScript
await pb.collection('tools_skills_matrix_member_items').create({
  matrix: matrix.id,
  member: aliceId,
  item: javascriptId,
  level: 4,
  appetite: 3,
  notes: "Expert en React et Node.js"
});

// Bob : Facilitation
await pb.collection('tools_skills_matrix_member_items').create({
  matrix: matrix.id,
  member: bobId,
  item: facilitationId,
  level: 3,
  appetite: 4,
  notes: "Anime les rétros et plannings"
});

// Charlie : Roadmap Produit (ownership)
await pb.collection('tools_skills_matrix_member_items').create({
  matrix: matrix.id,
  member: charlieId,
  item: roadmapId,
  ownership_role: "Owner",
  notes: "Responsable de la vision produit"
});
```

## 📊 Workflow 3 : Affichage de la Matrice

### Étape 1 : Charger les Données

```javascript
const matrixId = new URLSearchParams(window.location.search).get('id');

// Charger en parallèle
const [matrix, members, items, associations] = await Promise.all([
  pb.collection('tools_skills_matrix_matrices').getOne(matrixId),
  pb.collection('tools_skills_matrix_members').getFullList({
    filter: `matrix="${matrixId}" && active=true`,
    sort: 'name'
  }),
  pb.collection('tools_skills_matrix_items').getFullList({
    filter: `matrix="${matrixId}" && active=true`,
    sort: 'type,category,name'
  }),
  pb.collection('tools_skills_matrix_member_items').getFullList({
    filter: `matrix="${matrixId}"`,
    expand: 'member,item'
  })
]);
```

### Étape 2 : Construire la Structure de Données

```javascript
// Séparer skills et ownerships
const skills = items.filter(item => item.type === 'skill');
const ownerships = items.filter(item => item.type === 'ownership');

// Créer un index des associations
const matrixData = {};

members.forEach(member => {
  matrixData[member.id] = {
    member: member,
    skills: {},
    ownerships: {}
  };
});

associations.forEach(assoc => {
  const memberId = assoc.member;
  const item = assoc.expand.item;
  
  if (item.type === 'skill') {
    matrixData[memberId].skills[item.id] = {
      level: assoc.level,
      appetite: assoc.appetite,
      notes: assoc.notes
    };
  } else {
    matrixData[memberId].ownerships[item.id] = {
      role: assoc.ownership_role,
      notes: assoc.notes
    };
  }
});
```

### Étape 3 : Afficher le Tableau Skills

```javascript
// Générer le HTML du tableau
let html = '<table class="skills-matrix">';

// Header
html += '<thead><tr><th>Membre</th>';
skills.forEach(skill => {
  html += `<th>${skill.name}<br><small>${skill.category}</small></th>`;
});
html += '</tr></thead>';

// Body
html += '<tbody>';
members.forEach(member => {
  html += `<tr><td><strong>${member.name}</strong><br><small>${member.role}</small></td>`;
  
  skills.forEach(skill => {
    const data = matrixData[member.id].skills[skill.id];
    
    if (data) {
      const levelClass = `level-${data.level}`;
      const appetiteClass = `appetite-${data.appetite}`;
      html += `<td class="${levelClass} ${appetiteClass}">
        <div class="level">${data.level}</div>
        <div class="appetite">${data.appetite}</div>
      </td>`;
    } else {
      html += '<td class="empty">-</td>';
    }
  });
  
  html += '</tr>';
});
html += '</tbody></table>';

document.getElementById('skills-table').innerHTML = html;
```

### Étape 4 : Afficher les Ownerships

```javascript
let html = '<div class="ownerships-grid">';

ownerships.forEach(ownership => {
  html += `<div class="ownership-card">
    <h3>${ownership.name}</h3>
    <p class="category">${ownership.category}</p>
    <div class="roles">`;
  
  // Trouver les membres avec ce ownership
  members.forEach(member => {
    const data = matrixData[member.id].ownerships[ownership.id];
    if (data) {
      const roleClass = data.role.toLowerCase();
      html += `<div class="role-badge ${roleClass}">
        ${member.name} - ${data.role}
      </div>`;
    }
  });
  
  html += '</div></div>';
});

html += '</div>';
document.getElementById('ownerships-grid').innerHTML = html;
```

## 🔍 Workflow 4 : Recherche et Filtrage

### Filtrer par Catégorie

```javascript
function filterByCategory(category) {
  const filteredSkills = skills.filter(skill => 
    category === 'all' || skill.category === category
  );
  
  renderSkillsTable(filteredSkills);
}
```

### Rechercher un Membre

```javascript
function searchMember(query) {
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(query.toLowerCase()) ||
    member.role.toLowerCase().includes(query.toLowerCase())
  );
  
  renderSkillsTable(skills, filteredMembers);
}
```

### Trouver les Experts

```javascript
function findExperts(skillId, minLevel = 3) {
  const experts = [];
  
  members.forEach(member => {
    const data = matrixData[member.id].skills[skillId];
    if (data && data.level >= minLevel) {
      experts.push({
        member: member,
        level: data.level,
        appetite: data.appetite
      });
    }
  });
  
  // Trier par niveau décroissant
  experts.sort((a, b) => b.level - a.level);
  
  return experts;
}
```

### Identifier les Gaps

```javascript
function identifyGaps() {
  const gaps = [];
  
  skills.forEach(skill => {
    const experts = findExperts(skill.id, 3);
    
    if (experts.length === 0) {
      gaps.push({
        skill: skill,
        severity: 'critical',
        message: 'Aucun expert'
      });
    } else if (experts.length === 1) {
      gaps.push({
        skill: skill,
        severity: 'warning',
        message: 'Un seul expert (risque)'
      });
    }
  });
  
  return gaps;
}
```

## 📤 Workflow 5 : Export

### Export CSV

```javascript
function exportToCSV() {
  let csv = 'Membre,Rôle,';
  
  // Header
  skills.forEach(skill => {
    csv += `${skill.name} (Niveau),${skill.name} (Appétence),`;
  });
  csv += '\n';
  
  // Rows
  members.forEach(member => {
    csv += `${member.name},${member.role},`;
    
    skills.forEach(skill => {
      const data = matrixData[member.id].skills[skill.id];
      if (data) {
        csv += `${data.level},${data.appetite},`;
      } else {
        csv += '0,0,';
      }
    });
    
    csv += '\n';
  });
  
  // Télécharger
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skills-matrix-${matrix.name}.csv`;
  a.click();
}
```

### Export JSON

```javascript
function exportToJSON() {
  const data = {
    matrix: matrix,
    members: members,
    skills: skills,
    ownerships: ownerships,
    associations: matrixData
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skills-matrix-${matrix.name}.json`;
  a.click();
}
```

## 🔄 Workflow 6 : Mise à Jour

### Mettre à Jour un Niveau

```javascript
async function updateSkillLevel(memberId, itemId, newLevel, newAppetite) {
  // Trouver l'association existante
  const existing = await pb.collection('tools_skills_matrix_member_items')
    .getFirstListItem(`matrix="${matrixId}" && member="${memberId}" && item="${itemId}"`);
  
  // Mettre à jour
  await pb.collection('tools_skills_matrix_member_items').update(existing.id, {
    level: newLevel,
    appetite: newAppetite,
    last_assessed: new Date().toISOString()
  });
  
  // Recharger les données
  await loadMatrixData();
}
```

### Ajouter un Nouveau Skill

```javascript
async function addSkill(name, category) {
  const item = await pb.collection('tools_skills_matrix_items').create({
    matrix: matrixId,
    name: name,
    type: "skill",
    category: category,
    active: true
  });
  
  // Recharger les données
  await loadMatrixData();
}
```

### Désactiver un Membre

```javascript
async function deactivateMember(memberId) {
  await pb.collection('tools_skills_matrix_members').update(memberId, {
    active: false
  });
  
  // Recharger les données
  await loadMatrixData();
}
```

## 📊 Workflow 7 : Statistiques

### Calculer les Métriques

```javascript
function calculateMetrics() {
  const metrics = {
    totalMembers: members.length,
    totalSkills: skills.length,
    totalOwnerships: ownerships.length,
    averageLevel: 0,
    averageAppetite: 0,
    expertCount: 0,
    gapsCount: 0
  };
  
  let totalLevel = 0;
  let totalAppetite = 0;
  let count = 0;
  
  members.forEach(member => {
    Object.values(matrixData[member.id].skills).forEach(data => {
      totalLevel += data.level;
      totalAppetite += data.appetite;
      count++;
      
      if (data.level >= 3) {
        metrics.expertCount++;
      }
    });
  });
  
  metrics.averageLevel = (totalLevel / count).toFixed(1);
  metrics.averageAppetite = (totalAppetite / count).toFixed(1);
  metrics.gapsCount = identifyGaps().length;
  
  return metrics;
}
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-14
