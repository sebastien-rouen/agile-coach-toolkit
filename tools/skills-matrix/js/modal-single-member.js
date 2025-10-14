/**
 * Édition des appétences et ownerships pour un seul membre
 */

/**
 * Éditer les appétences d'un seul membre
 */
function editMemberAppetences(memberIndex) {
    const modal = document.getElementById('appetencesModal');
    const content = document.getElementById('modalMembersContent');
    
    if (!modal || !content) return;
    
    const member = matrixData.members[memberIndex];
    
    // Vider le contenu et afficher uniquement ce membre
    content.innerHTML = '';
    
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
    `;
    
    content.appendChild(section);
    
    // Afficher la modal
    modal.classList.add('active');
}

/**
 * Éditer les ownerships d'un seul membre
 */
function editMemberOwnerships(memberIndex) {
    const modal = document.getElementById('appetencesModal');
    const content = document.getElementById('modalMembersContent');
    
    if (!modal || !content) return;
    
    const member = matrixData.members[memberIndex];
    
    // Vider le contenu et afficher uniquement ce membre
    content.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'member-section';
    
    section.innerHTML = `
        <div class="member-section-header">
            <h3 class="member-section-title">👤 ${member.name}</h3>
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
    
    // Afficher la modal
    modal.classList.add('active');
}

// Rendre les fonctions globales
window.editMemberAppetences = editMemberAppetences;
window.editMemberOwnerships = editMemberOwnerships;

console.log('✅ modal-single-member.js chargé');
