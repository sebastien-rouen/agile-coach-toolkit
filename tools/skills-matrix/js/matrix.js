/**
 * Skills Matrix - Logique de la matrice
 */

/**
 * Rendre la matrice
 */
function renderMatrix() {
    const headerRow = document.getElementById('headerRow');
    const matrixBody = document.getElementById('matrixBody');

    // Clear
    headerRow.innerHTML = '<th>Personnel / Compétences</th>';
    matrixBody.innerHTML = '';

    // Add Appétences column
    const appetencesTh = document.createElement('th');
    appetencesTh.className = 'appetences-header';
    appetencesTh.textContent = '🎯 Appétences';
    headerRow.appendChild(appetencesTh);

    // Add Ownerships column
    const ownershipsTh = document.createElement('th');
    ownershipsTh.className = 'ownerships-header';
    ownershipsTh.textContent = '🏆 Ownerships';
    headerRow.appendChild(ownershipsTh);

    // Headers (skills)
    matrixData.skills.forEach((skill, index) => {
        const th = document.createElement('th');
        th.className = 'skill-name editable';
        th.textContent = skill;
        th.onclick = () => editSkillName(index);
        headerRow.appendChild(th);
    });

    // Add delete column
    const deleteTh = document.createElement('th');
    deleteTh.textContent = '❌';
    headerRow.appendChild(deleteTh);

    // Rows (members) - Filtrer selon visibleMembers
    const membersToDisplay = visibleMembers.length > 0 
        ? matrixData.members.filter((_, idx) => visibleMembers.includes(idx))
        : matrixData.members;
    
    membersToDisplay.forEach((member, displayIndex) => {
        const memberIndex = matrixData.members.indexOf(member);
        const tr = document.createElement('tr');

        // Member name
        const nameTd = document.createElement('td');
        nameTd.className = 'member-name editable';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = member.name;
        nameSpan.onclick = () => editMemberName(memberIndex);
        nameTd.appendChild(nameSpan);

        tr.appendChild(nameTd);

        // Appétences column
        const appetencesTd = document.createElement('td');
        appetencesTd.className = 'appetences-cell';
        if (member.appetences && member.appetences.length > 0) {
            const badgesContainer = document.createElement('div');
            badgesContainer.className = 'badges-container';
            member.appetences.forEach(app => {
                const badge = document.createElement('span');
                badge.className = 'badge badge-appetence';
                badge.textContent = app;
                badgesContainer.appendChild(badge);
            });
            appetencesTd.appendChild(badgesContainer);
        }
        tr.appendChild(appetencesTd);

        // Ownerships column
        const ownershipsTd = document.createElement('td');
        ownershipsTd.className = 'ownerships-cell';
        if (member.ownerships && member.ownerships.length > 0) {
            const badgesContainer = document.createElement('div');
            badgesContainer.className = 'badges-container';
            member.ownerships.forEach(own => {
                const badge = document.createElement('span');
                badge.className = 'badge badge-ownership';
                badge.textContent = own;
                badgesContainer.appendChild(badge);
            });
            ownershipsTd.appendChild(badgesContainer);
        }
        tr.appendChild(ownershipsTd);

        // Skills levels
        matrixData.skills.forEach((_, skillIndex) => {
            const td = document.createElement('td');
            const select = document.createElement('select');
            select.className = 'skill-level';

            const level = member.levels[skillIndex] || 0;
            select.className += ` level-${level}`;

            for (let i = 0; i <= 4; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === level) option.selected = true;
                select.appendChild(option);
            }

            select.onchange = (e) => {
                const newLevel = parseInt(e.target.value);
                member.levels[skillIndex] = newLevel;
                e.target.className = `skill-level level-${newLevel}`;
                updateTotals();
                saveData();
                renderRadar();
                renderAdvice();
            };

            td.appendChild(select);
            tr.appendChild(td);
        });

        // Delete button
        const deleteTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteMember(memberIndex);
        deleteTd.appendChild(deleteBtn);
        tr.appendChild(deleteTd);

        matrixBody.appendChild(tr);
    });

    // Add Total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';

    const totalLabelTd = document.createElement('td');
    totalLabelTd.textContent = 'Total';
    totalRow.appendChild(totalLabelTd);

    // Empty cells for Appétences and Ownerships columns
    const emptyAppetencesTd = document.createElement('td');
    totalRow.appendChild(emptyAppetencesTd);
    
    const emptyOwnershipsTd = document.createElement('td');
    totalRow.appendChild(emptyOwnershipsTd);

    // Calculate totals for each skill
    matrixData.skills.forEach((_, skillIndex) => {
        const skillTotal = matrixData.members.reduce((sum, member) => {
            return sum + (member.levels[skillIndex] || 0);
        }, 0);

        const td = document.createElement('td');
        const span = document.createElement('span');
        span.className = 'skill-total';
        span.textContent = skillTotal;

        // Determine color based on average level
        const avgLevel = matrixData.members.length > 0
            ? Math.round(skillTotal / matrixData.members.length)
            : 0;
        span.className += ` level-${avgLevel}`;

        td.appendChild(span);
        totalRow.appendChild(td);
    });

    // Empty cell for delete column
    const emptyTd = document.createElement('td');
    totalRow.appendChild(emptyTd);

    matrixBody.appendChild(totalRow);
}

/**
 * Mettre à jour les totaux
 */
function updateTotals() {
    const skillTotals = document.querySelectorAll('.total-row .skill-total');

    matrixData.skills.forEach((_, skillIndex) => {
        const skillTotal = matrixData.members.reduce((sum, member) => {
            return sum + (member.levels[skillIndex] || 0);
        }, 0);

        if (skillTotals[skillIndex]) {
            skillTotals[skillIndex].textContent = skillTotal;

            const avgLevel = matrixData.members.length > 0
                ? Math.round(skillTotal / matrixData.members.length)
                : 0;

            skillTotals[skillIndex].className = `skill-total level-${avgLevel}`;
        }
    });
}

/**
 * Éditer le nom d'une compétence
 */
function editSkillName(index) {
    const newName = prompt('Nouveau nom de la compétence:', matrixData.skills[index]);
    if (newName && newName.trim()) {
        matrixData.skills[index] = newName.trim();
        saveData();
        renderMatrix();
    }
}

/**
 * Éditer le nom d'un membre
 */
function editMemberName(index) {
    const newName = prompt('Nouveau nom du membre:', matrixData.members[index].name);
    if (newName && newName.trim()) {
        matrixData.members[index].name = newName.trim();
        saveData();
        renderMatrix();
        renderRadar();
    }
}

/**
 * Ajouter un membre
 */
function addMember() {
    const name = prompt('Nom du nouveau membre:', `Membre ${matrixData.members.length + 1}`);
    if (name && name.trim()) {
        const trimmedName = name.trim();
        
        // Validation : vérifier si le nom existe déjà
        const nameExists = matrixData.members.some(member => 
            member.name.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (nameExists) {
            alert('⚠️ Un membre avec ce nom existe déjà.');
            return;
        }
        
        // Validation : longueur du nom
        if (trimmedName.length > 50) {
            alert('⚠️ Le nom est trop long (maximum 50 caractères).');
            return;
        }
        
        const newMemberIndex = matrixData.members.length;
        matrixData.members.push({
            name: trimmedName,
            levels: new Array(matrixData.skills.length).fill(0),
            appetences: [],
            ownerships: []
        });

        // Ajouter automatiquement le nouveau membre aux membres visibles
        visibleMembers.push(newMemberIndex);

        saveData();
        renderMatrix();
        renderRadar();
        renderAdvice();
    }
}

/**
 * Ajouter une compétence
 */
function addSkill() {
    const name = prompt('Nom de la nouvelle compétence:', `Compétence ${matrixData.skills.length + 1}`);
    if (name && name.trim()) {
        const trimmedName = name.trim();
        
        // Validation : vérifier si la compétence existe déjà
        const skillExists = matrixData.skills.some(skill => 
            skill.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (skillExists) {
            alert('⚠️ Une compétence avec ce nom existe déjà.');
            return;
        }
        
        // Validation : longueur du nom
        if (trimmedName.length > 50) {
            alert('⚠️ Le nom est trop long (maximum 50 caractères).');
            return;
        }
        
        matrixData.skills.push(trimmedName);
        matrixData.members.forEach(member => {
            member.levels.push(0);
        });
        saveData();
        renderMatrix();
        renderRadar();
        renderAdvice();
    }
}

/**
 * Supprimer un membre
 */
function deleteMember(index) {
    if (confirm(`Supprimer ${matrixData.members[index].name} ?`)) {
        matrixData.members.splice(index, 1);

        // Mettre à jour les indices des membres visibles
        visibleMembers = visibleMembers.filter(i => i !== index).map(i => i > index ? i - 1 : i);

        saveData();
        renderMatrix();
        renderRadar();
        renderAdvice();
    }
}

console.log('✅ matrix.js chargé');
