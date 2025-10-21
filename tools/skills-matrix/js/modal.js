/**
 * Skills Matrix - Gestion des modales
 */

/**
 * Gérer les appétences et ownerships
 */
function manageAppetencesOwnerships() {
    const modal = document.getElementById('appetencesModal');
    const content = document.getElementById('modalMembersContent');

    if (!modal || !content) return;

    content.innerHTML = '';

    matrixData.members.forEach((member, memberIndex) => {
        const section = document.createElement('div');
        section.className = 'member-section';

        section.innerHTML = `
            <div class="member-section-header">
                <h3 class="member-section-title">👤 ${member.name}</h3>
            </div>
            
            <div class="subsection">
                <div class="subsection-title">
                    <span>🎯 Appétences</span>
                    <span class="info-text">(Compétences vers lesquelles le membre tend)</span>
                </div>
                <div class="tag-list" id="appetences-${memberIndex}">
                    ${(member.appetences || []).map((app, appIndex) => `
                        <span class="tag appetence">
                            ${app}
                            <button class="tag-remove" onclick="removeAppetence(${memberIndex}, ${appIndex})">×</button>
                        </span>
                    `).join('')}
                </div>
                <div class="add-tag-form">
                    <input type="text" class="add-tag-input" id="appetence-input-${memberIndex}" placeholder="Ex: React, Leadership, DevOps...">
                    <button class="btn btn-small" onclick="addAppetence(${memberIndex})">➕ Ajouter</button>
                </div>
            </div>
            
            <div class="subsection">
                <div class="subsection-title">
                    <span>🏆 Ownerships</span>
                    <span class="info-text">(Sujets dont le membre est owner - non affichés dans le radar)</span>
                </div>
                <div class="tag-list" id="ownerships-${memberIndex}">
                    ${(member.ownerships || []).map((own, ownIndex) => `
                        <span class="tag ownership">
                            ${own}
                            <button class="tag-remove" onclick="removeOwnership(${memberIndex}, ${ownIndex})">×</button>
                        </span>
                    `).join('')}
                </div>
                <div class="add-tag-form">
                    <input type="text" class="add-tag-input" id="ownership-input-${memberIndex}" placeholder="Ex: Architecture, Sécurité, CI/CD...">
                    <button class="btn btn-small" onclick="addOwnership(${memberIndex})">➕ Ajouter</button>
                </div>
            </div>
        `;

        content.appendChild(section);
    });

    modal.classList.add('active');
    
    // Initialiser l'autocomplétion après que le DOM soit mis à jour
    setTimeout(() => {
        if (typeof initAutocomplete === 'function') {
            matrixData.members.forEach((member, memberIndex) => {
                const appetenceInput = document.getElementById(`appetence-input-${memberIndex}`);
                const ownershipInput = document.getElementById(`ownership-input-${memberIndex}`);
                
                if (appetenceInput) {
                    console.log(`🎯 Init autocomplétion appétence pour ${member.name}`);
                    initAutocomplete(appetenceInput, 'skill'); // Les appétences sont des skills
                }
                if (ownershipInput) {
                    console.log(`🏆 Init autocomplétion ownership pour ${member.name}`);
                    initAutocomplete(ownershipInput, 'ownership');
                }
            });
        } else {
            console.warn('⚠️ initAutocomplete non disponible');
        }
    }, 100);
}

/**
 * Fermer la modal
 */
function closeAppetencesModal() {
    const modal = document.getElementById('appetencesModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Ajouter une appétence
 */
function addAppetence(memberIndex) {
    const input = document.getElementById(`appetence-input-${memberIndex}`);
    if (!input) return;

    const value = input.value.trim();

    if (value) {
        if (!matrixData.members[memberIndex].appetences) {
            matrixData.members[memberIndex].appetences = [];
        }
        matrixData.members[memberIndex].appetences.push(value);
        input.value = '';
        saveData();
        
        // Détecter si on est en mode "un seul membre" ou "tous les membres"
        const content = document.getElementById('modalMembersContent');
        const isSingleMember = content && content.querySelectorAll('.member-section').length === 1;
        
        if (isSingleMember && typeof editMemberAppetences === 'function') {
            // Rafraîchir uniquement ce membre
            editMemberAppetences(memberIndex);
        } else {
            // Rafraîchir tous les membres
            manageAppetencesOwnerships();
        }
        
        renderMatrix(); // Update matrix display
    }
}

/**
 * Supprimer une appétence
 */
function removeAppetence(memberIndex, appetenceIndex) {
    if (matrixData.members[memberIndex].appetences) {
        matrixData.members[memberIndex].appetences.splice(appetenceIndex, 1);
        saveData();
        
        // Détecter si on est en mode "un seul membre" ou "tous les membres"
        const content = document.getElementById('modalMembersContent');
        const isSingleMember = content && content.querySelectorAll('.member-section').length === 1;
        
        if (isSingleMember && typeof editMemberAppetences === 'function') {
            // Rafraîchir uniquement ce membre
            editMemberAppetences(memberIndex);
        } else {
            // Rafraîchir tous les membres
            manageAppetencesOwnerships();
        }
        
        renderMatrix(); // Update matrix display
    }
}

/**
 * Ajouter un ownership
 */
function addOwnership(memberIndex) {
    const input = document.getElementById(`ownership-input-${memberIndex}`);
    if (!input) return;

    const value = input.value.trim();

    if (value) {
        if (!matrixData.members[memberIndex].ownerships) {
            matrixData.members[memberIndex].ownerships = [];
        }
        matrixData.members[memberIndex].ownerships.push(value);
        input.value = '';
        saveData();
        
        // Détecter si on est en mode "un seul membre" ou "tous les membres"
        const content = document.getElementById('modalMembersContent');
        const isSingleMember = content && content.querySelectorAll('.member-section').length === 1;
        
        if (isSingleMember && typeof editMemberOwnerships === 'function') {
            // Rafraîchir uniquement ce membre
            editMemberOwnerships(memberIndex);
        } else {
            // Rafraîchir tous les membres
            manageAppetencesOwnerships();
        }
        
        renderMatrix(); // Update matrix display
    }
}

/**
 * Supprimer un ownership
 */
function removeOwnership(memberIndex, ownershipIndex) {
    if (matrixData.members[memberIndex].ownerships) {
        matrixData.members[memberIndex].ownerships.splice(ownershipIndex, 1);
        saveData();
        
        // Détecter si on est en mode "un seul membre" ou "tous les membres"
        const content = document.getElementById('modalMembersContent');
        const isSingleMember = content && content.querySelectorAll('.member-section').length === 1;
        
        if (isSingleMember && typeof editMemberOwnerships === 'function') {
            // Rafraîchir uniquement ce membre
            editMemberOwnerships(memberIndex);
        } else {
            // Rafraîchir tous les membres
            manageAppetencesOwnerships();
        }
        
        renderMatrix(); // Update matrix display
    }
}

/**
 * Gérer les compétences
 */
function manageSkills() {
    const modal = document.getElementById('skillsModal');
    const content = document.getElementById('modalSkillsContent');

    if (!modal || !content) return;

    content.innerHTML = '';

    // Section pour ajouter une nouvelle compétence
    const addSection = document.createElement('div');
    addSection.className = 'member-section';
    addSection.innerHTML = `
        <div class="member-section-header">
            <h3 class="member-section-title">➕ Ajouter une Compétence</h3>
        </div>
        <div class="add-tag-form">
            <input type="text" class="add-tag-input" id="new-skill-input" placeholder="Ex: TypeScript, Leadership, Docker...">
            <button class="btn btn-small" onclick="addSkillFromModal()">➕ Ajouter</button>
        </div>
    `;
    content.appendChild(addSection);
    
    // Initialiser l'autocomplétion pour le champ de nouvelle compétence
    setTimeout(() => {
        if (typeof initAutocomplete === 'function') {
            const skillInput = document.getElementById('new-skill-input');
            if (skillInput) {
                initAutocomplete(skillInput, 'skill');
            }
        }
    }, 100);

    // Section pour gérer les compétences existantes
    const listSection = document.createElement('div');
    listSection.className = 'member-section';
    listSection.innerHTML = `
        <div class="member-section-header">
            <h3 class="member-section-title">📋 Compétences Existantes</h3>
        </div>
        <div class="subsection">
            <div class="info-text" style="margin-bottom: 15px;">
                Cliquez sur ✏️ pour modifier ou 🗑️ pour supprimer une compétence
            </div>
            <div class="tag-list" id="skills-list">
                ${matrixData.skills.map((skill, index) => `
                    <span class="tag skill-tag">
                        <span class="skill-name-display">${skill}</span>
                        <button class="tag-action" onclick="editSkillFromModal(${index})" title="Modifier">✏️</button>
                        <button class="tag-remove" onclick="deleteSkillFromModal(${index})" title="Supprimer">🗑️</button>
                    </span>
                `).join('')}
            </div>
        </div>
    `;
    content.appendChild(listSection);

    modal.classList.add('active');
}

/**
 * Fermer la modal des compétences
 */
function closeSkillsModal() {
    const modal = document.getElementById('skillsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Ajouter une compétence depuis la modal
 */
async function addSkillFromModal() {
    const input = document.getElementById('new-skill-input');
    if (!input) return;

    const name = input.value.trim();

    if (name) {
        // Validation : vérifier si la compétence existe déjà
        const skillExists = matrixData.skills.some(skill =>
            skill.toLowerCase() === name.toLowerCase()
        );

        if (skillExists) {
            showNotification('⚠️ Une compétence avec ce nom existe déjà', 'error');
            return;
        }

        // Validation : longueur du nom
        if (name.length > 50) {
            showNotification('⚠️ Le nom est trop long (maximum 50 caractères)', 'error');
            return;
        }

        matrixData.skills.push(name);
        matrixData.members.forEach(member => {
            member.levels.push(0);
        });

        input.value = '';
        saveData();
        
        // Sauvegarder dans PocketBase si disponible
        if (typeof usePocketBase !== 'undefined' && usePocketBase && typeof pbManager !== 'undefined' && window.currentMatrixId) {
            try {
                // 1. Créer l'item skill dans PocketBase
                const newItem = await pbManager.createRecord('items', {
                    matrix: window.currentMatrixId,
                    name: name,
                    type: 'skill',
                    category: 'Général',
                    active: true
                });
                
                // 2. Créer les member_items pour tous les membres avec niveau 0
                // (en parallèle pour optimiser)
                const createPromises = matrixData.members
                    .filter(m => m.pbId) // Seulement les membres avec ID PocketBase
                    .map(member => 
                        pbManager.createRecord('memberItems', {
                            matrix: window.currentMatrixId,
                            member: member.pbId,
                            item: newItem.id,
                            level: 0,
                            appetite: 0,
                            last_assessed: new Date().toISOString().split('T')[0]
                        })
                    );
                
                await Promise.all(createPromises);
                
                console.log(`✅ Compétence "${name}" créée avec ${createPromises.length} member_items`);
            } catch (error) {
                console.error('Erreur sauvegarde compétence PocketBase:', error);
            }
        }
        
        renderMatrix();
        renderRadar();
        updateAllAdviceViews();
        manageSkills(); // Rafraîchir la modal
        showNotification('✅ Compétence ajoutée', 'success');
    }
}

/**
 * Modifier une compétence depuis la modal (ou depuis la matrice)
 */
async function editSkillFromModal(index) {
    const currentName = matrixData.skills[index];
    const newName = prompt('Nouveau nom de la compétence:', currentName);

    if (newName && newName.trim()) {
        const trimmedName = newName.trim();

        // Validation : vérifier si le nom existe déjà (sauf si c'est le même)
        const skillExists = matrixData.skills.some((skill, idx) =>
            idx !== index && skill.toLowerCase() === trimmedName.toLowerCase()
        );

        if (skillExists) {
            showNotification('⚠️ Une compétence avec ce nom existe déjà', 'error');
            return;
        }

        // Validation : longueur du nom
        if (trimmedName.length > 50) {
            showNotification('⚠️ Le nom est trop long (maximum 50 caractères)', 'error');
            return;
        }

        matrixData.skills[index] = trimmedName;
        saveData();
        
        // Mettre à jour dans PocketBase si disponible
        if (typeof usePocketBase !== 'undefined' && usePocketBase && typeof pbManager !== 'undefined' && window.currentMatrixId) {
            try {
                // Trouver et mettre à jour l'item skill dans PocketBase
                const items = await pbManager.getRecords('items', {
                    filter: `matrix = "${window.currentMatrixId}" && name = "${currentName}" && type = "skill"`
                });
                
                for (const item of items) {
                    await pbManager.updateRecord('items', item.id, {
                        name: trimmedName
                    });
                }
            } catch (error) {
                console.error('Erreur modification compétence PocketBase:', error);
            }
        }
        
        renderMatrix();
        renderRadar();
        
        // Rafraîchir la modal seulement si elle est ouverte
        const modal = document.getElementById('skillsModal');
        if (modal && modal.classList.contains('active')) {
            manageSkills();
        }
        
        showNotification('✅ Compétence modifiée', 'success');
    }
}

/**
 * Supprimer une compétence depuis la modal
 */
async function deleteSkillFromModal(index) {
    const skillName = matrixData.skills[index];

    if (confirm(`⚠️ Supprimer la compétence "${skillName}" ?\n\nCette action supprimera tous les niveaux associés pour tous les membres.`)) {
        matrixData.skills.splice(index, 1);
        matrixData.members.forEach(member => {
            member.levels.splice(index, 1);
        });

        saveData();
        
        // Supprimer de PocketBase si disponible
        if (typeof usePocketBase !== 'undefined' && usePocketBase && typeof pbManager !== 'undefined' && window.currentMatrixId) {
            try {
                // Supprimer l'item skill de PocketBase
                const items = await pbManager.getRecords('items', {
                    filter: `matrix = "${window.currentMatrixId}" && name = "${skillName}" && type = "skill"`
                });
                
                for (const item of items) {
                    await pbManager.deleteRecord('items', item.id);
                }
                
                // Mettre à jour tous les membres (pour supprimer les member_items associés)
                if (typeof saveMemberToPocketBase === 'function') {
                    for (let i = 0; i < matrixData.members.length; i++) {
                        await saveMemberToPocketBase(matrixData.members[i], i);
                    }
                }
            } catch (error) {
                console.error('Erreur suppression compétence PocketBase:', error);
            }
        }
        
        renderMatrix();
        renderRadar();
        updateAllAdviceViews();
        manageSkills(); // Rafraîchir la modal
        showNotification('🗑️ Compétence supprimée', 'success');
    }
}

// Fermer les modals en cliquant sur l'overlay
document.addEventListener('click', (e) => {
    if (e.target.id === 'appetencesModal') {
        closeAppetencesModal();
    }
    if (e.target.id === 'skillsModal') {
        closeSkillsModal();
    }
});

console.log('✅ modal.js chargé');


