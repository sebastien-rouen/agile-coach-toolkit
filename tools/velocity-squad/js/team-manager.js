/**
 * ========================================
 * TEAM MANAGER - Gestion CRUD des membres
 * ========================================
 * Gestion complète des membres d'équipe avec mood tracking
 */

class TeamManager {
    constructor(velocityTool) {
        this.tool = velocityTool;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Bouton d'ajout de membre
        const addBtn = document.getElementById('addTeamMemberBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        // Formulaire d'ajout
        const form = document.getElementById('teamMemberForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMember();
            });
        }

        // Bouton d'annulation
        const cancelBtn = document.getElementById('cancelTeamMemberBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Fermeture modal
        const modal = document.getElementById('teamMemberModal');
        if (modal) {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }

            // Fermer en cliquant en dehors
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Autocomplétion des compétences
        const skillsInput = document.getElementById('teamMemberSkills');
        if (skillsInput) {
            skillsInput.addEventListener('input', (e) => this.handleSkillsInput(e));
            skillsInput.addEventListener('keydown', (e) => this.handleSkillsKeydown(e));
            
            // Fermer l'autocomplétion en cliquant ailleurs
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.autocomplete-container')) {
                    this.hideAutocomplete();
                }
            });
        }
    }

    openModal(isEdit = false) {
        const modal = document.getElementById('teamMemberModal');
        const title = document.getElementById('teamMemberModalTitle');
        
        if (modal) {
            modal.style.display = 'block';
            if (title) {
                title.textContent = isEdit ? '✏️ Modifier le Membre' : '➕ Ajouter un Membre';
            }
            
            if (!isEdit) {
                this.resetForm();
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('teamMemberModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetForm();
            this.hideAutocomplete();
        }
    }

    resetForm() {
        document.getElementById('teamMemberName').value = '';
        document.getElementById('teamMemberRole').value = '';
        document.getElementById('teamMemberSkills').value = '';
        document.getElementById('teamMemberCapacity').value = '100';
        document.getElementById('teamMemberId').value = '';
        document.getElementById('teamMemberStartDate').value = '';
        document.getElementById('teamMemberEndDate').value = '';
    }

    async saveMember() {
        const memberId = document.getElementById('teamMemberId').value;
        const name = document.getElementById('teamMemberName').value.trim();
        const role = document.getElementById('teamMemberRole').value.trim();
        const skillsText = document.getElementById('teamMemberSkills').value.trim();
        const capacity = parseInt(document.getElementById('teamMemberCapacity').value) || 100;
        const startDate = document.getElementById('teamMemberStartDate').value;
        const endDate = document.getElementById('teamMemberEndDate').value;

        if (!name || !role) {
            this.tool.showNotification('⚠️ Nom et rôle sont requis', 'warning');
            return;
        }

        const skills = skillsText ? skillsText.split(',').map(s => s.trim()) : [];

        if (memberId && memberId !== '') {
            // Mise à jour
            const member = this.tool.data.team.find(m => m.id == memberId);
            if (member) {
                console.log('Mise à jour du membre:', member);
                
                member.name = name;
                member.role = role;
                member.skills = skills;
                member.capacity = capacity;
                member.startDate = startDate || null;
                member.endDate = endDate || null;
                member.updatedAt = new Date().toISOString();

                // Mise à jour dans PocketBase
                if (typeof updateTeamMemberInPocketBase !== 'undefined') {
                    try {
                        await updateTeamMemberInPocketBase(member);
                        console.log('✅ Membre mis à jour dans PocketBase');
                    } catch (error) {
                        console.error('Erreur mise à jour PocketBase:', error);
                    }
                }

                this.tool.showNotification(`✅ ${name} mis à jour`);
            } else {
                console.error('Membre non trouvé pour mise à jour:', memberId);
                this.tool.showNotification('❌ Membre non trouvé', 'error');
                return;
            }
        } else {
            // Création
            const member = {
                id: Date.now(),
                name: name,
                role: role,
                skills: skills,
                capacity: capacity,
                startDate: startDate || null,
                endDate: endDate || null,
                createdAt: new Date().toISOString()
            };

            this.tool.data.team = this.tool.data.team || [];
            this.tool.data.team.push(member);

            if (typeof saveTeamMemberToPocketBase !== 'undefined') {
                try {
                    await saveTeamMemberToPocketBase(member);
                    console.log('✅ Membre créé dans PocketBase');
                } catch (error) {
                    console.error('Erreur création PocketBase:', error);
                }
            }

            this.tool.showNotification(`✅ ${name} ajouté à l'équipe`);
        }

        this.tool.saveToStorage();
        this.render();
        this.closeModal();
        this.tool.updateTeamCapacity();
    }

    async deleteMember(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            return;
        }

        const member = this.tool.data.team.find(m => m.id === id);

        if (member && typeof deleteTeamMemberFromPocketBase !== 'undefined') {
            await deleteTeamMemberFromPocketBase(member);
        }

        this.tool.data.team = this.tool.data.team.filter(m => m.id !== id);
        this.tool.saveToStorage();
        this.render();
        this.tool.updateTeamCapacity();
        this.tool.showNotification('✅ Membre supprimé');
    }

    editMember(id) {
        const member = this.tool.data.team.find(m => m.id == id);
        if (!member) {
            console.error('Membre non trouvé:', id);
            return;
        }

        console.log('Édition du membre:', member);

        document.getElementById('teamMemberId').value = member.id;
        document.getElementById('teamMemberName').value = member.name;
        document.getElementById('teamMemberRole').value = member.role;
        document.getElementById('teamMemberSkills').value = (member.skills || []).join(', ');
        document.getElementById('teamMemberCapacity').value = member.capacity || 100;
        document.getElementById('teamMemberStartDate').value = member.startDate || '';
        document.getElementById('teamMemberEndDate').value = member.endDate || '';

        this.openModal(true);
    }

    async saveMoodForMember(memberId, mood) {
        const member = this.tool.data.team.find(m => m.id == memberId);
        if (!member) {
            console.error('Membre non trouvé pour mood:', memberId);
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        this.tool.data.moodTracking = this.tool.data.moodTracking || [];
        
        // Chercher un mood existant pour ce membre aujourd'hui
        const existingMood = this.tool.data.moodTracking.find(
            m => m.memberId == memberId && m.date === today
        );

        if (existingMood) {
            // Mise à jour du mood existant
            console.log('Mise à jour du mood existant:', existingMood);
            existingMood.score = mood;
            existingMood.timestamp = new Date().toISOString();

            // Mise à jour dans PocketBase
            if (typeof updateMoodInPocketBase !== 'undefined') {
                try {
                    await updateMoodInPocketBase(existingMood);
                    console.log('✅ Mood mis à jour dans PocketBase');
                } catch (error) {
                    console.error('Erreur mise à jour mood PocketBase:', error);
                }
            }
        } else {
            // Création d'un nouveau mood
            const moodEntry = {
                id: Date.now(),
                date: today,
                score: mood,
                memberId: memberId,
                memberName: member.name,
                timestamp: new Date().toISOString()
            };

            console.log('Création d\'un nouveau mood:', moodEntry);
            this.tool.data.moodTracking.push(moodEntry);

            // Sauvegarde dans PocketBase
            if (typeof saveMoodToPocketBase !== 'undefined') {
                try {
                    await saveMoodToPocketBase(moodEntry);
                    console.log('✅ Mood créé dans PocketBase');
                } catch (error) {
                    console.error('Erreur création mood PocketBase:', error);
                }
            }
        }

        this.tool.saveToStorage();
        this.render();
        this.tool.showNotification(`✅ Humeur enregistrée pour ${member.name}`);
    }

    getMoodForMember(memberId) {
        const today = new Date().toISOString().split('T')[0];
        
        const mood = this.tool.data.moodTracking?.find(
            m => {
                // Extraire la partie date (YYYY-MM-DD) du format PocketBase
                const moodDate = m.date ? m.date.split(' ')[0] : m.date;
                const memberIdMatch = m.memberId == memberId;
                const dateMatch = moodDate === today;
                return memberIdMatch && dateMatch;
            }
        );

        return mood ? mood.score : null;
    }

    getMoodIcon(score) {
        if (score === 3) return '😊';
        if (score === 2) return '😐';
        if (score === 1) return '😞';
        return '❓';
    }

    /**
     * Gestion de l'autocomplétion des compétences
     */
    getAllSkills() {
        const team = this.tool.data.team || [];
        const skillsMap = new Map();

        // Compter les occurrences de chaque compétence
        team.forEach(member => {
            if (member.skills && Array.isArray(member.skills)) {
                member.skills.forEach(skill => {
                    const normalizedSkill = skill.trim();
                    if (normalizedSkill) {
                        const count = skillsMap.get(normalizedSkill) || 0;
                        skillsMap.set(normalizedSkill, count + 1);
                    }
                });
            }
        });

        // Convertir en tableau et trier par fréquence
        return Array.from(skillsMap.entries())
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count);
    }

    handleSkillsInput(e) {
        const input = e.target.value;
        const cursorPos = e.target.selectionStart;
        
        // Trouver le mot actuel (entre virgules)
        const beforeCursor = input.substring(0, cursorPos);
        const lastComma = beforeCursor.lastIndexOf(',');
        const currentWord = beforeCursor.substring(lastComma + 1).trim();

        if (currentWord.length < 2) {
            this.hideAutocomplete();
            return;
        }

        // Filtrer les compétences
        const allSkills = this.getAllSkills();
        const suggestions = allSkills.filter(({ skill }) => 
            skill.toLowerCase().includes(currentWord.toLowerCase())
        );

        this.showAutocomplete(suggestions, currentWord);
    }

    handleSkillsKeydown(e) {
        const container = document.getElementById('skillsAutocomplete');
        if (!container || !container.classList.contains('show')) return;

        const suggestions = container.querySelectorAll('.autocomplete-suggestion');
        const active = container.querySelector('.autocomplete-suggestion.active');
        let activeIndex = Array.from(suggestions).indexOf(active);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
            this.setActiveSuggestion(suggestions, activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            this.setActiveSuggestion(suggestions, activeIndex);
        } else if (e.key === 'Enter' && active) {
            e.preventDefault();
            this.selectSuggestion(active.dataset.skill);
        } else if (e.key === 'Escape') {
            this.hideAutocomplete();
        }
    }

    setActiveSuggestion(suggestions, index) {
        suggestions.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
    }

    showAutocomplete(suggestions, currentWord) {
        const container = document.getElementById('skillsAutocomplete');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '<div class="autocomplete-no-results">Aucune suggestion</div>';
            container.classList.add('show');
            return;
        }

        const html = suggestions.map(({ skill, count }) => `
            <div class="autocomplete-suggestion" data-skill="${skill}">
                <span class="autocomplete-suggestion-text">${this.highlightMatch(skill, currentWord)}</span>
                <span class="autocomplete-suggestion-count">${count}</span>
            </div>
        `).join('');

        container.innerHTML = html;
        container.classList.add('show');

        // Ajouter les event listeners
        container.querySelectorAll('.autocomplete-suggestion').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(item.dataset.skill);
            });
        });
    }

    hideAutocomplete() {
        const container = document.getElementById('skillsAutocomplete');
        if (container) {
            container.classList.remove('show');
            container.innerHTML = '';
        }
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    selectSuggestion(skill) {
        const input = document.getElementById('teamMemberSkills');
        if (!input) return;

        const value = input.value;
        const cursorPos = input.selectionStart;
        
        // Trouver le mot actuel
        const beforeCursor = value.substring(0, cursorPos);
        const afterCursor = value.substring(cursorPos);
        const lastComma = beforeCursor.lastIndexOf(',');
        
        // Remplacer le mot actuel par la suggestion
        const before = lastComma >= 0 ? beforeCursor.substring(0, lastComma + 1) + ' ' : '';
        const after = afterCursor.trimStart();
        
        input.value = before + skill + (after.startsWith(',') ? after : ', ' + after);
        
        // Positionner le curseur après la compétence
        const newPos = (before + skill + ', ').length;
        input.setSelectionRange(newPos, newPos);
        input.focus();

        this.hideAutocomplete();
    }

    render() {
        const container = document.getElementById('teamMembersContainer');
        if (!container) return;

        const team = this.tool.data.team || [];

        if (team.length === 0) {
            container.innerHTML = `
                <div class="team-empty">
                    <p>👥 Aucun membre dans l'équipe</p>
                    <p style="font-size: 0.9rem; color: #666;">Ajoutez des membres pour commencer</p>
                </div>
            `;
            return;
        }

        // Séparer les membres actifs et sortis
        const activeMembers = team.filter(m => !m.endDate || m.endDate === '');
        const leftMembers = team.filter(m => m.endDate && m.endDate !== '');

        const renderMember = (member, isLeft = false) => {
            const currentMood = this.getMoodForMember(member.id);
            const rowClass = isLeft ? 'team-member-row team-member-left' : 'team-member-row';
            
            return `
                <div class="${rowClass}" data-member-id="${member.id}">
                    <div class="team-member-info">
                        <div class="team-member-name">
                            ${member.name}
                            ${isLeft ? '<span class="member-left-badge">Sorti(e)</span>' : ''}
                        </div>
                        <div class="team-member-role">${member.role}</div>
                        ${member.skills && member.skills.length > 0 ? 
                            `<div class="team-member-skills">${member.skills.join(', ')}</div>` : 
                            ''}
                        ${member.startDate || member.endDate ? `
                            <div class="team-member-dates">
                                ${member.startDate ? `📅 Arrivée: ${new Date(member.startDate).toLocaleDateString('fr-FR')}` : ''}
                                ${member.endDate ? ` • 🚪 Sortie: ${new Date(member.endDate).toLocaleDateString('fr-FR')}` : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="team-member-mood">
                        <div class="mood-selector-inline">
                            <button class="mood-btn-inline ${currentMood === 3 ? 'active' : ''}" 
                                    data-mood="3"
                                    title="Super"
                                    ${isLeft ? 'disabled' : ''}>😊</button>
                            <button class="mood-btn-inline ${currentMood === 2 ? 'active' : ''}" 
                                    data-mood="2"
                                    title="Correct"
                                    ${isLeft ? 'disabled' : ''}>😐</button>
                            <button class="mood-btn-inline ${currentMood === 1 ? 'active' : ''}" 
                                    data-mood="1"
                                    title="Difficile"
                                    ${isLeft ? 'disabled' : ''}>😞</button>
                        </div>
                    </div>
                    
                    <div class="team-member-capacity">
                        ${member.capacity}%
                    </div>
                    
                    <div class="team-member-actions">
                        <button class="btn-icon btn-edit" 
                                data-action="edit"
                                title="Modifier">✏️</button>
                        <button class="btn-icon btn-delete" 
                                data-action="delete"
                                title="Supprimer">🗑️</button>
                    </div>
                </div>
            `;
        };

        let html = '';

        // Membres actifs
        if (activeMembers.length > 0) {
            html += `
                <div class="team-section-header">
                    <h4>👥 Membres actifs (${activeMembers.length})</h4>
                </div>
                ${activeMembers.map(m => renderMember(m, false)).join('')}
            `;
        }

        // Membres sortis
        if (leftMembers.length > 0) {
            html += `
                <div class="team-section-header team-section-left">
                    <h4>🚪 Membres sortis (${leftMembers.length})</h4>
                </div>
                ${leftMembers.map(m => renderMember(m, true)).join('')}
            `;
        }

        container.innerHTML = html;
        
        // Attacher les event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const container = document.getElementById('teamMembersContainer');
        if (!container) return;

        // Event delegation pour les boutons de mood
        container.addEventListener('click', (e) => {
            const moodBtn = e.target.closest('.mood-btn-inline');
            if (moodBtn) {
                const row = moodBtn.closest('.team-member-row');
                const memberId = row.dataset.memberId;
                const mood = parseInt(moodBtn.dataset.mood);
                
                // Convertir l'ID en nombre si c'est un nombre
                const id = isNaN(memberId) ? memberId : parseInt(memberId);
                
                this.saveMoodForMember(id, mood);
                return;
            }

            // Event delegation pour les boutons d'action
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const row = actionBtn.closest('.team-member-row');
                const memberId = row.dataset.memberId;
                const action = actionBtn.dataset.action;
                
                // Convertir l'ID en nombre si c'est un nombre
                const id = isNaN(memberId) ? memberId : parseInt(memberId);
                
                if (action === 'edit') {
                    this.editMember(id);
                } else if (action === 'delete') {
                    this.deleteMember(id);
                }
            }
        });
    }
}

// Export pour utilisation globale
if (typeof window !== 'undefined') {
    window.TeamManager = TeamManager;
}
