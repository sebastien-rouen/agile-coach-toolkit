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
        manageAppetencesOwnerships(); // Refresh
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
        manageAppetencesOwnerships(); // Refresh
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
        manageAppetencesOwnerships(); // Refresh
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
        manageAppetencesOwnerships(); // Refresh
        renderMatrix(); // Update matrix display
    }
}

// Fermer la modal en cliquant sur l'overlay
document.addEventListener('click', (e) => {
    if (e.target.id === 'appetencesModal') {
        closeAppetencesModal();
    }
});

console.log('✅ modal.js chargé');
