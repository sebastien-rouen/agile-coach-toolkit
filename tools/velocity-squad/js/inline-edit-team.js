/**
 * ========================================
 * INLINE EDIT TEAM MEMBERS
 * ========================================
 * Permet l'édition directe des membres d'équipe
 * en cliquant sur les champs
 */

/**
 * Initialiser l'édition inline pour l'équipe
 */
function initInlineEditTeam() {
    const app = window.velocityTool || window.velocityApp;
    if (!app) {
        console.warn('⚠️ Application non disponible pour inline edit');
        return;
    }

    console.log('✏️ Initialisation édition inline équipe');

    /**
     * Rendre la liste d'équipe avec édition inline
     */
    function renderTeamListInline() {
        const container = document.getElementById('teamMembersList');
        if (!container) return;

        const team = app.data.team || [];
        
        if (team.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">👥 Aucun membre dans l'équipe</p>
                    <p style="font-size: 0.9rem;">Cliquez sur "➕ Ajouter Membre" pour commencer</p>
                </div>
            `;
            return;
        }

        // Tri par rôle
        const sortedTeam = [...team].sort((a, b) => {
            const roleOrder = { 'PO': 1, 'Product Owner': 1, 'SM': 2, 'Scrum Master': 2 };
            const orderA = roleOrder[a.role] || 999;
            const orderB = roleOrder[b.role] || 999;
            
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

        container.innerHTML = `
            <div class="team-table-container">
                <table class="team-table">
                    <thead>
                        <tr>
                            <th>👤 Nom</th>
                            <th>💼 Rôle</th>
                            <th>🎯 Compétences</th>
                            <th>📊 Capacité</th>
                            <th>⚙️ Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedTeam.map(member => renderMemberRow(member)).join('')}
                    </tbody>
                </table>
            </div>
            <div class="team-summary">
                <strong>Total :</strong> ${team.length} membre${team.length > 1 ? 's' : ''} 
                | <strong>Équipe de développement :</strong> ${getDevTeamCount()} membre${getDevTeamCount() > 1 ? 's' : ''}
                | <strong>Capacité moyenne :</strong> ${getAverageCapacity()}%
            </div>
        `;

        // Attacher les événements d'édition
        attachInlineEditEvents();
    }

    /**
     * Rendre une ligne de membre
     */
    function renderMemberRow(member) {
        const isNonDev = isNonDevRole(member.role);
        
        return `
            <tr ${isNonDev ? 'class="non-dev-role"' : ''} data-member-id="${member.id}">
                <td>
                    <span class="editable-field" data-field="name" data-member-id="${member.id}">
                        <strong>${member.name}</strong>
                        <span class="edit-icon">✏️</span>
                    </span>
                </td>
                <td>
                    <span class="editable-field" data-field="role" data-member-id="${member.id}">
                        ${member.role}
                        ${isNonDev ? '<span class="role-badge">Non comptabilisé</span>' : ''}
                        <span class="edit-icon">✏️</span>
                    </span>
                </td>
                <td>
                    <div class="editable-field" data-field="skills" data-member-id="${member.id}">
                        <div class="skills-tags">
                            ${(member.skills || []).map(skill => 
                                `<span class="skill-tag">${skill}</span>`
                            ).join('')}
                        </div>
                        <span class="edit-icon">✏️</span>
                    </div>
                </td>
                <td>
                    <span class="editable-field" data-field="capacity" data-member-id="${member.id}">
                        <span class="capacity-badge" style="background: ${getCapacityColor(member.capacity)};">
                            ${member.capacity}%
                        </span>
                        <span class="edit-icon">✏️</span>
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="window.inlineEditTeam.deleteMember('${member.id}')" 
                                class="btn-small btn-danger" 
                                title="Supprimer">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Attacher les événements d'édition inline
     */
    function attachInlineEditEvents() {
        const editableFields = document.querySelectorAll('.editable-field');
        
        editableFields.forEach(field => {
            field.addEventListener('click', (e) => {
                const memberId = field.dataset.memberId;
                const fieldName = field.dataset.field;
                const member = app.data.team.find(m => String(m.id) === String(memberId));
                
                if (!member) return;
                
                startInlineEdit(field, member, fieldName);
            });
        });
    }

    /**
     * Démarrer l'édition inline
     */
    function startInlineEdit(fieldElement, member, fieldName) {
        // Empêcher l'édition multiple
        if (fieldElement.querySelector('input, textarea')) return;

        const currentValue = member[fieldName];
        let inputElement;

        // Créer l'input selon le type de champ
        switch (fieldName) {
            case 'name':
            case 'role':
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = currentValue || '';
                inputElement.className = 'inline-edit-input';
                break;

            case 'skills':
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = Array.isArray(currentValue) ? currentValue.join(', ') : '';
                inputElement.className = 'inline-edit-input';
                inputElement.placeholder = 'Compétences séparées par des virgules';
                break;

            case 'capacity':
                inputElement = document.createElement('input');
                inputElement.type = 'number';
                inputElement.value = currentValue || 100;
                inputElement.min = 0;
                inputElement.max = 100;
                inputElement.className = 'inline-edit-input';
                break;
        }

        // Remplacer le contenu par l'input
        const originalContent = fieldElement.innerHTML;
        fieldElement.innerHTML = '';
        fieldElement.appendChild(inputElement);

        // Focus sur l'input
        inputElement.focus();
        if (inputElement.type === 'text') {
            inputElement.select();
        }

        // Sauvegarder sur Enter ou perte de focus
        const saveEdit = () => {
            let newValue = inputElement.value.trim();

            // Traiter selon le type de champ
            if (fieldName === 'skills') {
                newValue = newValue.split(',').map(s => s.trim()).filter(s => s);
            } else if (fieldName === 'capacity') {
                newValue = parseInt(newValue) || 100;
                newValue = Math.max(0, Math.min(100, newValue));
            }

            // Mettre à jour le membre
            member[fieldName] = newValue;
            
            // Sauvegarder
            app.save();

            // Rafraîchir l'affichage
            renderTeamListInline();

            // Notification
            if (window.notificationsManager) {
                window.notificationsManager.showSuccess(`✅ ${fieldName} mis à jour`);
            }

            console.log('✅ Membre mis à jour:', member.name, fieldName, newValue);
        };

        // Annuler sur Escape
        const cancelEdit = () => {
            fieldElement.innerHTML = originalContent;
            attachInlineEditEvents();
        };

        // Événements
        inputElement.addEventListener('blur', saveEdit);
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    }

    /**
     * Supprimer un membre
     */
    async function deleteMember(memberId) {
        const member = app.data.team.find(m => String(m.id) === String(memberId));
        if (!member) return;

        const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer ${member.name} de l'équipe ?`);
        if (!confirmed) return;

        app.data.team = app.data.team.filter(m => String(m.id) !== String(memberId));
        app.save();
        renderTeamListInline();

        if (window.notificationsManager) {
            window.notificationsManager.showSuccess(`✅ ${member.name} supprimé de l'équipe`);
        }
    }

    // Helpers
    function isNonDevRole(role) {
        const nonDevRoles = ['PO', 'Product Owner', 'SM', 'Scrum Master'];
        return nonDevRoles.some(r => role.toLowerCase().includes(r.toLowerCase()));
    }

    function getDevTeamCount() {
        const team = app.data.team || [];
        return team.filter(member => !isNonDevRole(member.role)).length;
    }

    function getCapacityColor(capacity) {
        if (capacity >= 80) return 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        if (capacity >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
        return 'linear-gradient(135deg, #F44336, #EF5350)';
    }

    function getAverageCapacity() {
        const team = app.data.team || [];
        const devTeam = team.filter(member => !isNonDevRole(member.role));
        
        if (devTeam.length === 0) return 0;
        const total = devTeam.reduce((sum, member) => sum + (member.capacity || 0), 0);
        return Math.round(total / devTeam.length);
    }

    // Exposer les fonctions
    window.inlineEditTeam = {
        renderTeamListInline,
        deleteMember
    };

    // Remplacer la méthode renderTeamList de l'app
    if (app.renderTeamList) {
        app.renderTeamList = renderTeamListInline;
    }

    console.log('✅ Édition inline équipe initialisée');
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initInlineEditTeam, 600);
    });
} else {
    setTimeout(initInlineEditTeam, 600);
}
