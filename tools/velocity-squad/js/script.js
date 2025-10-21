/**
 * ========================================
 * TEAM VELOCITY DASHBOARD - GPS AGILE
 * ========================================
 * Tableau de bord intelligent pour équipes Agile
 * Fonctionnalités: Vélocité, Coaching IA, Gamification
 * Version: 2.0 Avancée
 * ========================================
 */

class VelocityTool {
    constructor() {
        // Structure de données complète
        this.data = {
            sprints: [],              // Historique des sprints
            team: [],                 // Membres équipe avec compétences
            annotations: [],          // Faits marquants
            achievements: [],         // Succès débloqués
            moodTracking: [],         // Suivi humeur quotidienne
            qualityMetrics: {},       // Métriques qualité
            stories: [],              // User Stories pour estimation
            events: [],               // Événements de planning
            pis: [],                  // Program Increments (SAFe)
            settings: {
                framework: 'scrum',   // scrum | kanban
                sprintLength: 14,     // Durée sprint en jours
                workingDays: 10,      // Jours ouvrés par sprint
                currentView: 'chart', // chart | casino
                chartView: 'velocity', // velocity | burndown | burnup
                userName: 'Utilisateur', // Nom de l'utilisateur
                dailyTime: '09:00'    // Heure du daily par défaut
            }
        };

        // État casino pour estimation collaborative
        this.casinoSession = {
            currentStory: 0,
            estimates: {},
            revealed: false
        };

        this.chart = null;
        this.radarChart = null;
        this.init();
    }

    /**
     * Initialisation complète de l'application
     */
    init() {
        console.log("🚀 Démarrage GPS Agile Avancé...");
        this.loadFromStorage();
        this.loadSharedData();
        this.bindEvents();
        this.initAnnotations();
        this.initMoodTracking();
        this.initFullCasino();

        // Ne pas appeler renderAll() si on attend le chargement PocketBase
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');

        if (!sessionId) {
            // Pas de session PocketBase, afficher les données locales
            this.renderAll();
        } else {
            console.log('⏳ Attente du chargement PocketBase avant le rendu...');
        }
    }

    /**
     * ========================================
     * HELPERS TERMINOLOGIE
     * ========================================
     */

    getTerminology() {
        const isKanban = this.data.settings.framework === 'kanban';
        return {
            sprint: isKanban ? 'Période' : 'Sprint',
            sprints: isKanban ? 'Périodes' : 'Sprints',
            Sprint: isKanban ? 'Période' : 'Sprint',
            Sprints: isKanban ? 'Périodes' : 'Sprints',
            sprintGoal: isKanban ? 'Objectif de période' : 'Sprint Goal',
            velocity: isKanban ? 'Débit' : 'Vélocité'
        };
    }

    /**
     * ========================================
     * GESTION STOCKAGE LOCAL
     * ========================================
     */

    loadFromStorage() {
        // Si on a un ID de session dans l'URL, ne pas charger le localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');

        if (sessionId) {
            console.log('📋 ID de session détecté, attente du chargement PocketBase...');
            return;
        }

        const saved = localStorage.getItem('velocityToolData');
        if (saved) {
            try {
                this.data = { ...this.data, ...JSON.parse(saved) };

                // S'assurer que les sprints sont triés par date de fin (du plus ancien au plus récent)
                if (this.data.sprints && this.data.sprints.length > 0) {
                    this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                }

                console.log("📱 Données restaurées:", this.data.sprints.length, "sprints");
            } catch (e) {
                console.error("Erreur chargement données:", e);
            }
        }
    }

    saveToStorage() {
        try {
            // Si on utilise PocketBase, ne pas sauvegarder dans localStorage
            if (typeof usePocketBase !== 'undefined' && usePocketBase) {
                console.log('💾 Sauvegarde gérée par PocketBase');
                return;
            }

            localStorage.setItem('velocityToolData', JSON.stringify(this.data));
            console.log("💾 Données sauvegardées dans localStorage");
        } catch (e) {
            console.error("Erreur sauvegarde:", e);
        }
    }

    /**
     * ========================================
     * ÉVÉNEMENTS ET INTERACTIONS
     * ========================================
     */

    bindEvents() {
        // Boutons principaux
        document.getElementById('importBtn').addEventListener('click', () => this.openModal('importModal'));
        document.getElementById('manualEntryBtn').addEventListener('click', () => this.openModal('manualModal'));
        document.getElementById('manageTeamBtn').addEventListener('click', () => this.openModal('teamModal'));
        document.getElementById('templatesBtn').addEventListener('click', () => this.openModal('templatesModal'));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('downloadExportBtn').addEventListener('click', () => this.downloadExportFile());
        document.getElementById('shareBtn').addEventListener('click', () => this.openModal('shareModal'));
        document.getElementById('toggleViewBtn').addEventListener('click', () => this.toggleView());

        // Gestion PI (SAFe)
        document.getElementById('managePiBtn').addEventListener('click', () => this.openPiModal());
        document.getElementById('addPiBtn').addEventListener('click', () => this.openPiFormModal());
        document.getElementById('piForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePi();
        });
        document.getElementById('cancelPiFormBtn').addEventListener('click', () => {
            document.getElementById('piFormModal').style.display = 'none';
        });

        // Onglets PI
        document.querySelectorAll('.pi-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchPiTab(tabName);
            });
        });

        // Boutons de statut
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.getElementById('piStatus').value = e.currentTarget.dataset.status;
            });
        });

        // Boutons de confiance
        document.querySelectorAll('.confidence-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.confidence-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.getElementById('piConfidenceVote').value = e.currentTarget.dataset.vote;
            });
        });

        // Gestion des objectifs, risques et dépendances
        document.getElementById('addObjectiveBtn').addEventListener('click', () => this.addObjective());
        document.getElementById('addRiskBtn').addEventListener('click', () => this.addRisk());
        document.getElementById('addDependencyBtn').addEventListener('click', () => this.addDependency());

        // Nouvelle session
        document.getElementById('newSessionBtn').addEventListener('click', () => {
            if (typeof createNewSession !== 'undefined') {
                createNewSession();
            } else {
                alert('⚠️ Fonctionnalité de session nécessite PocketBase');
            }
        });

        // Changement framework
        document.getElementById('frameworkMode').addEventListener('change', (e) => {
            this.data.settings.framework = e.target.value;
            this.updateSprintGoalVisibility();
            this.renderAll();
            this.saveToStorage();
        });

        // Sélecteur de vue de graphique (Vélocité, Burndown, Burnup)
        document.querySelectorAll('.chart-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.changeChartView(view);
            });
        });

        // Restaurer la vue de graphique sauvegardée
        this.restoreChartView();

        // Sprint Goal - Ouvre la modal d'édition du sprint actuel
        document.getElementById('editSprintGoalBtn').addEventListener('click', () => {
            // Trouver le sprint le plus récent (dernier de la liste après tri)
            if (this.data.sprints.length > 0) {
                // S'assurer que les sprints sont triés par date de fin
                this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

                const latestSprint = this.data.sprints[this.data.sprints.length - 1];
                console.log('📝 Édition du sprint le plus récent:', latestSprint.name, latestSprint.endDate);
                this.openEditSprintDatesModal(latestSprint.id);
            } else {
                this.showNotification('❌ Aucun sprint disponible', 'error');
            }
        });

        document.getElementById('sprintGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSprintGoal();
        });

        // Gestion User Stories Casino
        document.getElementById('addStoryBtn').addEventListener('click', () => {
            this.openModal('addStoryModal');
        });

        document.getElementById('manageStoriesBtn').addEventListener('click', () => {
            this.openManageStoriesModal();
        });

        document.getElementById('addStoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUserStory();
        });

        document.getElementById('addMultipleStoriesForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMultipleUserStories();
        });

        document.getElementById('closeManageStoriesBtn').addEventListener('click', () => {
            document.getElementById('manageStoriesModal').style.display = 'none';
        });

        // Tabs pour ajout de stories
        document.getElementById('singleStoryTab').addEventListener('click', () => {
            this.switchStoryTab('single');
        });

        document.getElementById('multipleStoriesTab').addEventListener('click', () => {
            this.switchStoryTab('multiple');
        });

        // Édition des dates de sprint
        document.getElementById('editSprintDatesForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSprintDates();
        });

        // Gestion des événements de planning
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.openAddEventModal();
        });

        document.getElementById('addEventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlanningEvent();
        });

        document.getElementById('deleteEventBtn').addEventListener('click', () => {
            if (this.editingEventId) {
                this.deleteEvent(this.editingEventId);
            }
        });

        // Toggle vue timeline compacte
        document.getElementById('toggleTimelineViewBtn').addEventListener('click', () => {
            this.toggleTimelineView();
        });

        // Gestion de la récurrence
        document.getElementById('recurrenceType').addEventListener('change', (e) => {
            const type = e.target.value;
            const recurrenceOptions = document.getElementById('recurrenceOptions');
            const recurrenceDaysGroup = document.getElementById('recurrenceDaysGroup');
            const recurrenceIntervalGroup = document.getElementById('recurrenceIntervalGroup');
            const recurrenceIntervalLabel = document.getElementById('recurrenceIntervalLabel');

            // Afficher les options de récurrence si type != none
            recurrenceOptions.style.display = type !== 'none' ? 'block' : 'none';

            if (type === 'none') {
                return;
            }

            // Afficher le sélecteur de jours uniquement pour weekly
            recurrenceDaysGroup.style.display = type === 'weekly' ? 'block' : 'none';

            // Afficher l'intervalle pour weekly et monthly
            if (type === 'weekly' || type === 'monthly') {
                recurrenceIntervalGroup.style.display = 'block';
                recurrenceIntervalLabel.textContent = type === 'weekly' ? 'semaine(s)' : 'mois';
            } else {
                recurrenceIntervalGroup.style.display = 'none';
            }
        });

        // Gestion des boutons d'intervalle
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const interval = btn.dataset.interval;

                // Retirer la classe active de tous les boutons
                document.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'));

                // Ajouter la classe active au bouton cliqué
                btn.classList.add('active');

                // Mettre à jour le champ caché
                document.getElementById('recurrenceInterval').value = interval;
            });
        });

        // Fermeture modales
        document.querySelectorAll('.modal .close').forEach(close => {
            close.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Formulaires
        document.getElementById('sprintForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSprintManually();
        });

        // Boutons de durée rapide pour le formulaire d'ajout de sprint
        document.querySelectorAll('.btn-duration').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const weeks = parseInt(btn.dataset.weeks);
                const startDateInput = document.getElementById('sprintStartDate');
                const endDateInput = document.getElementById('sprintEndDate');

                if (!startDateInput.value) {
                    this.showNotification('⚠️ Veuillez d\'abord sélectionner une date de début', 'warning');
                    return;
                }

                const startDate = new Date(startDateInput.value);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + (weeks * 7));

                endDateInput.value = endDate.toISOString().split('T')[0];
                this.showNotification(`✅ Date de fin définie à +${weeks} semaine${weeks > 1 ? 's' : ''}`, 'success');
            });
        });

        // Templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openTemplateConfirmation(card.dataset.template, card.dataset.framework);
            });
        });

        // Confirmation template
        document.getElementById('confirmTemplateSaveBtn').addEventListener('click', () => {
            this.confirmTemplateLoad();
        });

        document.getElementById('cancelTemplateSaveBtn').addEventListener('click', () => {
            document.getElementById('templateConfirmModal').style.display = 'none';
        });

        // Import fichiers
        document.getElementById('csvFile').addEventListener('change', (e) => {
            this.importCSV(e.target.files[0]);
        });

        document.getElementById('jsonFile').addEventListener('change', (e) => {
            this.importJSON(e.target.files[0]);
        });

        // Import JIRA
        document.getElementById('jiraImportBtn').addEventListener('click', () => {
            this.importFromJira();
        });

        // Partage
        document.getElementById('generateUrlBtn').addEventListener('click', () => {
            this.generatePublicUrl();
        });

        document.getElementById('moodBtn').addEventListener('click', () => {
            this.openModal('moodModal');
        });

        document.getElementById('copyAgainBtn').addEventListener('click', async () => {
            const url = document.getElementById('publicUrl').value;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(url);
                    this.showNotification('✅ URL copiée !');
                } else {
                    this.fallbackCopyToClipboard(url);
                }
            } catch (err) {
                this.fallbackCopyToClipboard(url);
            }
        });
    }

    /**
     * ========================================
     * SYSTÈME D'ANNOTATIONS (FAITS MARQUANTS)
     * ========================================
     */

    initAnnotations() {
        document.getElementById('addAnnotation').addEventListener('click', () => {
            this.prepareAnnotationModal();
            this.openModal('annotationModal');
        });

        document.getElementById('annotationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAnnotation();
        });

        // Configuration équipe
        document.addEventListener('click', (e) => {
            if (e.target.matches('.capacity-warning button')) {
                this.openModal('teamModal');
                this.renderTeamList();
            }
        });

        document.getElementById('addMemberBtn').addEventListener('click', () => {
            console.log('🔘 Clic sur Ajouter Membre - Membres disponibles:', this.data.team?.length || 0);
            this.populateExistingMembersSelect();
            document.getElementById('addMemberForm').style.display = 'block';
        });

        // Attacher l'événement change si l'élément existe
        const existingMemberSelect = document.getElementById('existingMemberSelect');
        if (existingMemberSelect) {
            existingMemberSelect.addEventListener('change', (e) => {
                this.prefillMemberForm(e.target.value);
            });
        } else {
            console.warn('⚠️ Element existingMemberSelect introuvable lors de l\'initialisation');
        }

        document.getElementById('saveMemberBtn').addEventListener('click', () => {
            this.addTeamMember();
        });

        document.getElementById('cancelMemberBtn').addEventListener('click', () => {
            document.getElementById('addMemberForm').style.display = 'none';
            document.getElementById('addMemberBtn').style.display = 'block';
            this.editingMemberId = null;
            this.resetMemberForm();
        });
    }

    prepareAnnotationModal() {
        const select = document.getElementById('annotationSprint');

        if (this.data.sprints.length === 0) {
            select.innerHTML = '<option value="">Aucun sprint disponible</option>';
            this.showNotification('⚠️ Ajoutez d\'abord des sprints avant les annotations', 'warning');
            return;
        }

        select.innerHTML = this.data.sprints.map(s =>
            `<option value="${s.id}">${s.name} (${s.endDate})</option>`
        ).join('');

        console.log('📝 Sprints disponibles:', this.data.sprints); // Debug
    }

    async addAnnotation() {
        const sprintId = document.getElementById('annotationSprint').value;
        const annotationType = document.getElementById('annotationType').value;
        const annotationText = document.getElementById('annotationText').value;

        // Vérifications
        if (!sprintId || !annotationType || !annotationText.trim()) {
            this.showNotification('⚠️ Veuillez remplir tous les champs', 'warning');
            return;
        }

        const annotation = {
            id: Date.now() + Math.random(), // ID unique
            type: annotationType,
            sprintId: sprintId, // Garder l'ID tel quel (peut être string ou number)
            text: annotationText.trim(),
            timestamp: new Date().toISOString(),
            isNew: true
        };

        console.log('📝 Ajout annotation:', annotation); // Debug

        this.data.annotations = this.data.annotations || [];
        this.data.annotations.push(annotation);

        // Sauvegarder dans PocketBase si disponible
        if (typeof saveAnnotationToPocketBase !== 'undefined') {
            await saveAnnotationToPocketBase(annotation);
        }

        this.saveToStorage();
        this.renderChart();

        // Supprimer le flag "nouveau" après 3 secondes
        setTimeout(() => {
            annotation.isNew = false;
            this.renderChart();
        }, 3000);

        document.getElementById('annotationModal').style.display = 'none';
        document.getElementById('annotationForm').reset();
        this.checkAchievements();

        const sprint = this.data.sprints.find(s => s.id == annotation.sprintId);
        this.showNotification(`✅ Fait marquant ajouté sur ${sprint?.name || 'le sprint'}`);
    }


    /**
     * ========================================
     * GESTION ÉQUIPE
     * ========================================
     */

    /**
     * Peuple la liste déroulante avec tous les membres existants
     */
    populateExistingMembersSelect() {
        const select = document.getElementById('existingMemberSelect');
        if (!select) {
            console.warn('⚠️ Element existingMemberSelect introuvable');
            return;
        }

        // Réinitialiser
        select.innerHTML = '<option value="">-- Nouveau membre --</option>';

        // Récupérer tous les membres (actifs et sortis)
        const allMembers = this.data.team || [];
        console.log('📋 Membres disponibles:', allMembers.length, allMembers);

        // Si aucun membre, afficher un message
        if (allMembers.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '(Aucun membre existant)';
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        // Grouper par statut
        const activeMembers = allMembers.filter(m => {
            if (!m.endDate || m.endDate === '') return true;
            return new Date(m.endDate) > new Date();
        });
        const exitedMembers = allMembers.filter(m => {
            if (!m.endDate || m.endDate === '') return false;
            return new Date(m.endDate) <= new Date();
        });

        console.log('👥 Membres actifs:', activeMembers.length);
        console.log('🚪 Membres sortis:', exitedMembers.length);

        // Ajouter les membres actifs
        if (activeMembers.length > 0) {
            const activeGroup = document.createElement('optgroup');
            activeGroup.label = '👥 Membres actifs';
            activeMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = `${member.name} - ${member.role}`;
                activeGroup.appendChild(option);
            });
            select.appendChild(activeGroup);
        }

        // Ajouter les membres sortis
        if (exitedMembers.length > 0) {
            const exitedGroup = document.createElement('optgroup');
            exitedGroup.label = '🚪 Membres sortis';
            exitedMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = `${member.name} - ${member.role}`;
                exitedGroup.appendChild(option);
            });
            select.appendChild(exitedGroup);
        }
    }

    /**
     * Pré-remplit le formulaire avec les données d'un membre existant
     */
    prefillMemberForm(memberId) {
        if (!memberId) {
            this.resetMemberForm();
            return;
        }

        const member = this.data.team.find(m => m.id == memberId);
        if (!member) return;

        document.getElementById('memberName').value = member.name || '';
        document.getElementById('memberRole').value = member.role || '';
        document.getElementById('memberSkills').value = (member.skills || []).join(', ');
        document.getElementById('memberCapacity').value = member.capacity || 100;
    }

    /**
     * Réinitialise le formulaire de membre
     */
    resetMemberForm() {
        document.getElementById('existingMemberSelect').value = '';
        document.getElementById('memberName').value = '';
        document.getElementById('memberRole').value = '';
        document.getElementById('memberSkills').value = '';
        document.getElementById('memberCapacity').value = '100';
    }

    async addTeamMember() {
        const skillsText = document.getElementById('memberSkills').value;
        const skills = skillsText ? skillsText.split(',').map(s => s.trim()) : [];

        const name = document.getElementById('memberName').value;
        const role = document.getElementById('memberRole').value;
        const capacity = parseInt(document.getElementById('memberCapacity').value) || 100;

        if (!name || !role) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        this.data.team = this.data.team || [];

        // Mode édition
        if (this.editingMemberId) {
            const memberIndex = this.data.team.findIndex(m => String(m.id) === String(this.editingMemberId));
            if (memberIndex !== -1) {
                this.data.team[memberIndex] = {
                    ...this.data.team[memberIndex],
                    name,
                    role,
                    skills,
                    capacity
                };
                this.showNotification('✅ Membre modifié avec succès', 'success');
                console.log('Membre modifié:', this.data.team[memberIndex]);
            } else {
                console.error('Membre non trouvé pour édition:', this.editingMemberId);
                this.showNotification('❌ Erreur lors de la modification', 'error');
            }
            this.editingMemberId = null;
        } 
        // Mode ajout
        else {
            const member = {
                id: Date.now(),
                name,
                role,
                skills,
                capacity
            };
            this.data.team.push(member);
            this.showNotification('✅ Membre ajouté avec succès', 'success');
            console.log('Membre ajouté:', member);

            // Sauvegarder dans PocketBase si disponible
            if (typeof saveTeamMemberToPocketBase !== 'undefined') {
                await saveTeamMemberToPocketBase(member);
            }
        }

        this.saveToStorage();
        this.updateTeamCapacity();
        this.renderTeamList();
        this.checkAchievements();

        // Reset form
        document.getElementById('addMemberForm').style.display = 'none';
        document.getElementById('addMemberBtn').style.display = 'block';
        this.resetMemberForm();
    }

    renderTeamList() {
        const container = document.getElementById('teamMembersList');
        if (!container) return;

        const team = this.data.team || [];
        
        if (team.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">👥 Aucun membre dans l'équipe</p>
                    <p style="font-size: 0.9rem;">Cliquez sur "➕ Ajouter Membre" pour commencer</p>
                </div>
            `;
            return;
        }

        // Tri par rôle : PO, SM, puis autres par ordre alphabétique
        const sortedTeam = [...team].sort((a, b) => {
            const roleOrder = { 'PO': 1, 'Product Owner': 1, 'SM': 2, 'Scrum Master': 2 };
            const orderA = roleOrder[a.role] || 999;
            const orderB = roleOrder[b.role] || 999;
            
            if (orderA !== orderB) {
                return orderA - orderB;
            }
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
                        ${sortedTeam.map(member => {
                            const isNonDev = this.isNonDevRole(member.role);
                            return `
                            <tr ${isNonDev ? 'class="non-dev-role"' : ''}>
                                <td><strong>${member.name}</strong></td>
                                <td>
                                    ${member.role}
                                    ${isNonDev ? '<span class="role-badge">Non comptabilisé</span>' : ''}
                                </td>
                                <td>
                                    <div class="skills-tags">
                                        ${(member.skills || []).map(skill => 
                                            `<span class="skill-tag">${skill}</span>`
                                        ).join('')}
                                    </div>
                                </td>
                                <td>
                                    <span class="capacity-badge" style="background: ${this.getCapacityColor(member.capacity)};">
                                        ${member.capacity}%
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button onclick="window.velocityTool.editMember('${member.id}')" 
                                                class="btn-small btn-secondary" 
                                                title="Modifier">
                                            ✏️
                                        </button>
                                        <button onclick="window.velocityTool.removeMember('${member.id}')" 
                                                class="btn-small btn-danger" 
                                                title="Supprimer">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
            <div class="team-summary">
                <strong>Total :</strong> ${team.length} membre${team.length > 1 ? 's' : ''} 
                | <strong>Équipe de développement :</strong> ${this.getDevTeamCount()} membre${this.getDevTeamCount() > 1 ? 's' : ''}
                | <strong>Capacité moyenne :</strong> ${this.getAverageCapacity()}%
            </div>
        `;
    }

    /**
     * Vérifie si un rôle est non-développeur (PO, SM)
     */
    isNonDevRole(role) {
        const nonDevRoles = ['PO', 'Product Owner', 'SM', 'Scrum Master'];
        return nonDevRoles.some(r => role.toLowerCase().includes(r.toLowerCase()));
    }

    /**
     * Compte le nombre de membres de l'équipe de développement (hors PO/SM)
     */
    getDevTeamCount() {
        const team = this.data.team || [];
        return team.filter(member => !this.isNonDevRole(member.role)).length;
    }

    getCapacityColor(capacity) {
        if (capacity >= 80) return 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        if (capacity >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
        return 'linear-gradient(135deg, #F44336, #EF5350)';
    }

    getAverageCapacity() {
        const team = this.data.team || [];
        // Filtrer pour ne garder que l'équipe de développement (hors PO/SM)
        const devTeam = team.filter(member => !this.isNonDevRole(member.role));
        
        if (devTeam.length === 0) return 0;
        const total = devTeam.reduce((sum, member) => sum + (member.capacity || 0), 0);
        return Math.round(total / devTeam.length);
    }

    editMember(id) {
        // Chercher le membre avec l'ID (string ou number)
        const member = this.data.team.find(m => String(m.id) === String(id));
        
        if (!member) {
            console.error('Membre non trouvé:', id);
            this.showNotification('❌ Membre non trouvé', 'error');
            return;
        }

        console.log('Édition du membre:', member);

        // Pré-remplir le formulaire avec les données du membre
        document.getElementById('memberName').value = member.name || '';
        document.getElementById('memberRole').value = member.role || '';
        document.getElementById('memberSkills').value = (member.skills || []).join(', ');
        document.getElementById('memberCapacity').value = member.capacity || 100;

        // Afficher le formulaire
        document.getElementById('addMemberForm').style.display = 'block';
        document.getElementById('addMemberBtn').style.display = 'none';

        // Stocker l'ID du membre en cours d'édition (garder le type original)
        this.editingMemberId = member.id;
    }

    async removeMember(id) {
        // Chercher le membre avec l'ID (string ou number)
        const member = this.data.team.find(m => String(m.id) === String(id));

        if (!member) {
            console.error('Membre non trouvé:', id);
            this.showNotification('❌ Membre non trouvé', 'error');
            return;
        }

        console.log('Suppression du membre:', member);

        // Demander confirmation
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${member.name} de l'équipe ?`)) {
            return;
        }

        // Supprimer de PocketBase si disponible
        if (typeof deleteTeamMemberFromPocketBase !== 'undefined') {
            await deleteTeamMemberFromPocketBase(member);
        }

        // Supprimer le membre (comparaison en string pour gérer les deux types)
        this.data.team = this.data.team.filter(m => String(m.id) !== String(id));
        this.saveToStorage();
        this.renderTeamList();
        this.updateTeamCapacity();
        
        this.showNotification(`✅ ${member.name} a été supprimé de l'équipe`, 'success');
    }

    /**
     * ========================================
     * MOOD TRACKING
     * ========================================
     */

    initMoodTracking() {
        document.getElementById('moodBtn').addEventListener('click', () => {
            this.openMoodModal();
        });

        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        document.getElementById('saveMoodBtn').addEventListener('click', () => {
            this.saveMoodEntry();
        });
    }

    openMoodModal() {
        const team = this.data.team || [];
        const memberSelect = document.getElementById('moodMemberSelect');

        if (team.length === 0) {
            this.showNotification('⚠️ Ajoutez d\'abord des membres à l\'équipe', 'warning');
            return;
        }

        // Remplir le select avec les membres de l'équipe
        memberSelect.innerHTML = team.map(member =>
            `<option value="${member.id}">${member.name} - ${member.role}</option>`
        ).join('');

        // Initialiser la date du jour
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('moodDate').value = today;

        // Charger le mood existant pour le premier membre et la date du jour
        this.loadExistingMood();

        // Ajouter un événement pour charger le mood quand on change de membre ou de date
        memberSelect.onchange = () => this.loadExistingMood();
        document.getElementById('moodDate').onchange = () => {
            this.updateMoodDateDisplay(document.getElementById('moodDate').value);
            this.loadExistingMood();
        };

        this.openModal('moodModal');

        // Mettre à jour l'affichage de la date après ouverture de la modal
        setTimeout(() => {
            this.updateMoodDateDisplay(today);
        }, 100);
    }

    updateMoodDateDisplay(dateValue) {
        const displayElement = document.getElementById('moodDateDisplay');
        if (!displayElement) {
            console.warn('⚠️ Élément moodDateDisplay non trouvé');
            return;
        }

        if (dateValue) {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                const formattedDate = date.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                displayElement.textContent = formattedDate;
            } else {
                displayElement.textContent = 'Date invalide';
            }
        } else {
            displayElement.textContent = 'Sélectionnez une date';
        }
    }

    loadExistingMood() {
        const memberSelect = document.getElementById('moodMemberSelect');
        const moodDate = document.getElementById('moodDate').value;
        const memberId = memberSelect.value;

        // Réinitialiser la sélection
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        document.getElementById('moodComment').value = '';

        if (!memberId || !moodDate) return;

        // Chercher un mood existant pour ce membre et cette date
        const existingMood = (this.data.moodTracking || []).find(m =>
            m.memberId == memberId && m.date === moodDate
        );

        if (existingMood) {
            console.log('🎯 Mood existant trouvé:', existingMood);

            // Sélectionner le bouton correspondant
            const moodBtn = document.querySelector(`.mood-btn[data-mood="${existingMood.score}"]`);
            if (moodBtn) {
                moodBtn.classList.add('selected');
            }

            // Remplir le commentaire
            if (existingMood.comment) {
                document.getElementById('moodComment').value = existingMood.comment;
            }
        }
    }

    hasMoodToday() {
        const today = new Date().toISOString().split('T')[0];
        return (this.data.moodTracking || []).some(m => m.date === today);
    }

    async saveMoodEntry() {
        const selectedMood = document.querySelector('.mood-btn.selected');
        const memberSelect = document.getElementById('moodMemberSelect');
        const moodDate = document.getElementById('moodDate').value;

        if (!selectedMood) {
            this.showNotification('⚠️ Veuillez sélectionner une humeur', 'warning');
            return;
        }

        if (!memberSelect.value) {
            this.showNotification('⚠️ Veuillez sélectionner un membre', 'warning');
            return;
        }

        if (!moodDate) {
            this.showNotification('⚠️ Veuillez sélectionner une date', 'warning');
            return;
        }

        const member = this.data.team.find(m => m.id == memberSelect.value);
        const memberId = memberSelect.value;

        // Chercher un mood existant pour ce membre et cette date
        this.data.moodTracking = this.data.moodTracking || [];
        const existingMoodIndex = this.data.moodTracking.findIndex(m =>
            m.memberId == memberId && m.date === moodDate
        );

        const moodData = {
            date: moodDate,
            score: parseInt(selectedMood.dataset.mood),
            comment: document.getElementById('moodComment').value.trim(),
            memberId: memberId,
            memberName: member ? member.name : 'Inconnu',
            timestamp: new Date().toISOString()
        };

        if (existingMoodIndex !== -1) {
            // Mettre à jour le mood existant
            const existingMood = this.data.moodTracking[existingMoodIndex];
            Object.assign(existingMood, moodData);

            console.log('🔄 Mise à jour du mood existant');

            // Mettre à jour dans PocketBase si disponible
            if (typeof updateMoodInPocketBase !== 'undefined' && existingMood.pbId) {
                await updateMoodInPocketBase(existingMood);
            } else if (typeof saveMoodToPocketBase !== 'undefined') {
                await saveMoodToPocketBase(existingMood);
            }

            this.showNotification(`✅ Humeur mise à jour pour ${member.name}`);
        } else {
            // Créer un nouveau mood
            const moodEntry = {
                id: Date.now(),
                ...moodData
            };

            this.data.moodTracking.push(moodEntry);

            console.log('➕ Création d\'un nouveau mood');

            // Sauvegarder dans PocketBase si disponible
            if (typeof saveMoodToPocketBase !== 'undefined') {
                await saveMoodToPocketBase(moodEntry);
            }

            this.showNotification(`✅ Humeur enregistrée pour ${member.name}`);
        }

        this.saveToStorage();

        document.getElementById('moodModal').style.display = 'none';
        document.getElementById('moodComment').value = '';
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));

        this.renderRadarChart();
    }

    /**
     * ========================================
     * AJOUT MANUEL DE SPRINT
     * ========================================
     */

    async addSprintManually() {
        const sprint = {
            id: Date.now(),
            name: document.getElementById('sprintName').value,
            velocity: parseInt(document.getElementById('sprintVelocity').value),
            endDate: document.getElementById('sprintEndDate').value,
            timestamp: new Date().toISOString()
        };

        // Ajouter le sprint goal si en mode Scrum
        if (this.data.settings.framework === 'scrum') {
            const goalInput = document.getElementById('sprintGoalInput');
            if (goalInput && goalInput.value.trim()) {
                sprint.goal = goalInput.value.trim();
            }
        }

        this.data.sprints.push(sprint);
        this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        // Sauvegarder dans PocketBase si disponible
        if (typeof saveSprintToPocketBase !== 'undefined') {
            await saveSprintToPocketBase(sprint);
        }

        this.saveToStorage();
        this.renderAll();
        this.checkAchievements();

        document.getElementById('manualModal').style.display = 'none';
        document.getElementById('sprintForm').reset();

        // Mettre à jour l'affichage du sprint goal
        this.updateSprintGoalDisplay();

        console.log("✅ Sprint ajouté:", sprint);
    }

    /**
     * ========================================
     * GESTION SPRINT GOAL
     * ========================================
     */

    updateSprintGoalVisibility() {
        const isScrum = this.data.settings.framework === 'scrum';
        const hasSprints = this.data.sprints && this.data.sprints.length > 0;

        const sprintGoalSection = document.getElementById('sprintGoalSection');
        const sprintGoalFormGroup = document.getElementById('sprintGoalFormGroup');
        const editSprintGoalBtn = document.getElementById('editSprintGoalBtn');
        const chartViewSelector = document.getElementById('chartViewSelector');

        // Afficher la section uniquement si Scrum ET qu'il y a des sprints
        if (sprintGoalSection) {
            sprintGoalSection.style.display = (isScrum && hasSprints) ? 'block' : 'none';
        }

        if (sprintGoalFormGroup) {
            sprintGoalFormGroup.style.display = isScrum ? 'block' : 'none';
        }

        // Cacher le bouton d'édition s'il n'y a pas de sprints
        if (editSprintGoalBtn) {
            editSprintGoalBtn.style.display = hasSprints ? 'block' : 'none';
        }

        // Afficher le sélecteur de vue uniquement en mode Scrum avec des sprints
        if (chartViewSelector) {
            chartViewSelector.style.display = (isScrum && hasSprints) ? 'flex' : 'none';
        }

        if (isScrum && hasSprints) {
            this.updateSprintGoalDisplay();
        }
    }

    updateSprintGoalDisplay() {
        const display = document.getElementById('sprintGoalDisplay');
        if (!display) return;

        const hasSprints = this.data.sprints && this.data.sprints.length > 0;

        if (!hasSprints) {
            display.innerHTML = '<p class="sprint-goal-empty">Aucun sprint disponible</p>';
            return;
        }

        // S'assurer que les sprints sont triés par date de fin
        this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        // Trouver le sprint actuel (le plus récent non terminé ou le dernier)
        const now = new Date();
        const currentSprint = this.data.sprints
            .filter(s => new Date(s.endDate) >= now)
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0]
            || this.data.sprints[this.data.sprints.length - 1];

        console.log('📊 Sprint affiché:', currentSprint.name, '| Date fin:', currentSprint.endDate);

        if (!currentSprint) {
            display.innerHTML = '<p class="sprint-goal-empty">Aucun sprint disponible</p>';
            return;
        }

        if (currentSprint.goal && currentSprint.goal.trim()) {
            display.innerHTML = `
                <p class="sprint-goal-text">${currentSprint.goal}</p>
                <p class="sprint-goal-meta">Sprint: ${currentSprint.name} | Fin: ${new Date(currentSprint.endDate).toLocaleDateString('fr-FR')}</p>
            `;
        } else {
            display.innerHTML = `
                <p class="sprint-goal-empty">Aucun objectif défini pour ${currentSprint.name}</p>
                <p class="sprint-goal-meta">Fin: ${new Date(currentSprint.endDate).toLocaleDateString('fr-FR')}</p>
            `;
        }
    }

    openSprintGoalModal() {
        const select = document.getElementById('sprintGoalSelect');
        const textarea = document.getElementById('sprintGoalTextarea');

        if (this.data.sprints.length === 0) {
            this.showNotification('⚠️ Ajoutez d\'abord des sprints', 'warning');
            return;
        }

        // Remplir le select avec les sprints
        select.innerHTML = this.data.sprints.map(s =>
            `<option value="${s.id}">${s.name} (${s.endDate})</option>`
        ).join('');

        // Sélectionner le sprint actuel par défaut
        const now = new Date();
        const currentSprint = this.data.sprints
            .filter(s => new Date(s.endDate) >= now)
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0]
            || this.data.sprints[this.data.sprints.length - 1];

        if (currentSprint) {
            select.value = currentSprint.id;
            textarea.value = currentSprint.goal || '';
        }

        // Mettre à jour le textarea quand on change de sprint
        select.addEventListener('change', () => {
            const selectedSprint = this.data.sprints.find(s => s.id == select.value);
            textarea.value = selectedSprint?.goal || '';
        });

        this.openModal('sprintGoalModal');
    }

    async saveSprintGoal() {
        const sprintId = parseInt(document.getElementById('sprintGoalSelect').value);
        const goal = document.getElementById('sprintGoalTextarea').value.trim();

        const sprint = this.data.sprints.find(s => s.id === sprintId);
        if (!sprint) {
            this.showNotification('Sprint non trouvé', 'error');
            return;
        }

        sprint.goal = goal;

        // Sauvegarder dans PocketBase si disponible
        if (typeof updateSprintInPocketBase !== 'undefined') {
            await updateSprintInPocketBase(sprint);
        }

        this.saveToStorage();
        this.updateSprintGoalDisplay();

        document.getElementById('sprintGoalModal').style.display = 'none';
        this.showNotification(`✅ Objectif enregistré pour ${sprint.name}`);
    }

    /**
     * ========================================
     * ÉDITION DES DATES DE SPRINT
     * ========================================
     */

    openEditSprintDatesModal(sprintId) {
        const sprint = this.data.sprints.find(s => s.id === sprintId);
        if (!sprint) {
            this.showNotification('❌ Sprint non trouvé', 'error');
            return;
        }

        // Fonction helper pour formater les dates
        const formatDateForInput = (dateStr) => {
            if (!dateStr) return '';
            // Si la date contient un timestamp, extraire juste la partie date
            return dateStr.split(' ')[0].split('T')[0];
        };

        // Pré-remplir le formulaire
        document.getElementById('editSprintName').value = sprint.name;
        document.getElementById('editSprintGoal').value = sprint.goal || '';
        document.getElementById('editSprintVelocity').value = sprint.velocity || '';
        document.getElementById('editSprintBugCount').value = sprint.bugCount || 0;
        document.getElementById('editSprintTeamSize').value = sprint.teamSize || '';
        document.getElementById('editSprintEndDate').value = formatDateForInput(sprint.endDate);

        // Calculer la date de début si elle n'existe pas
        let startDate;
        if (sprint.startDate && sprint.startDate !== '') {
            startDate = formatDateForInput(sprint.startDate);
            document.getElementById('editSprintStartDate').value = startDate;
        } else {
            // Calculer la date de début basée sur la durée du sprint (par défaut 14 jours)
            const endDate = new Date(formatDateForInput(sprint.endDate));
            if (isNaN(endDate.getTime())) {
                // Date de fin invalide, utiliser aujourd'hui
                const today = new Date();
                const calculatedStartDate = new Date(today);
                calculatedStartDate.setDate(calculatedStartDate.getDate() - (this.data.settings.sprintLength || 14));
                startDate = calculatedStartDate.toISOString().split('T')[0];
            } else {
                const calculatedStartDate = new Date(endDate);
                calculatedStartDate.setDate(calculatedStartDate.getDate() - (this.data.settings.sprintLength || 14));
                startDate = calculatedStartDate.toISOString().split('T')[0];
            }
            document.getElementById('editSprintStartDate').value = startDate;
        }

        // Calculer la durée actuelle pour le slider
        const start = new Date(startDate);
        const end = new Date(formatDateForInput(sprint.endDate));
        let currentDuration = 14; // Valeur par défaut

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            currentDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            // S'assurer que la durée est dans les limites du slider
            currentDuration = Math.max(1, Math.min(30, currentDuration));
        }

        // Configurer le slider
        const slider = document.getElementById('editSprintEndDateSlider');
        slider.value = currentDuration;
        this.updateEndDateFromSlider();

        // Stocker l'ID du sprint en cours d'édition
        this.editingSprintId = sprintId;

        // Initialiser les événements du slider si pas déjà fait
        this.initDateSliderEvents();

        this.openModal('editSprintDatesModal');

        // Mettre à jour l'affichage de la date de début après ouverture de la modal
        setTimeout(() => {
            this.updateStartDateDisplay(startDate);
        }, 100);
    }

    initDateSliderEvents() {
        // Éviter de réinitialiser plusieurs fois
        if (this.dateSliderInitialized) return;
        this.dateSliderInitialized = true;

        const slider = document.getElementById('editSprintEndDateSlider');
        const startDateInput = document.getElementById('editSprintStartDate');

        // Mise à jour en temps réel du slider
        slider.addEventListener('input', () => {
            this.updateEndDateFromSlider();
        });

        // Mise à jour quand on change la date de début
        startDateInput.addEventListener('change', () => {
            this.updateStartDateDisplay(startDateInput.value);
            this.updateEndDateFromSlider();
        });

        // Ouvrir le datepicker au clic sur la date affichée
        startDateInput.addEventListener('click', function () {
            this.showPicker();
        });
    }

    updateStartDateDisplay(dateValue) {
        const displayElement = document.getElementById('editSprintStartDateDisplay');
        if (!displayElement) {
            console.warn('⚠️ Élément editSprintStartDateDisplay non trouvé');
            return;
        }

        if (dateValue) {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                const formattedDate = date.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                displayElement.textContent = formattedDate;
                console.log('✅ Date de début affichée:', formattedDate);
            } else {
                displayElement.textContent = 'Date invalide';
                console.warn('⚠️ Date invalide:', dateValue);
            }
        } else {
            displayElement.textContent = 'Sélectionnez une date';
        }
    }

    updateEndDateFromSlider() {
        const slider = document.getElementById('editSprintEndDateSlider');
        const startDateInput = document.getElementById('editSprintStartDate');
        const endDateInput = document.getElementById('editSprintEndDate');
        const endDateLabel = document.getElementById('editSprintEndDateLabel');
        const sliderDaysLabel = document.getElementById('sliderDaysLabel');

        const days = parseInt(slider.value);
        const startDate = new Date(startDateInput.value);

        if (!startDateInput.value || isNaN(startDate.getTime())) {
            return;
        }

        // Calculer la date de fin
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days);

        // Mettre à jour les affichages
        const endDateStr = endDate.toISOString().split('T')[0];
        endDateInput.value = endDateStr;

        const formattedEndDate = endDate.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        endDateLabel.textContent = formattedEndDate;
        sliderDaysLabel.textContent = `+${days} jour${days > 1 ? 's' : ''}`;
    }

    async saveSprintDates() {
        const sprintId = this.editingSprintId;
        const sprint = this.data.sprints.find(s => s.id === sprintId);

        if (!sprint) {
            this.showNotification('❌ Sprint non trouvé', 'error');
            return;
        }

        const name = document.getElementById('editSprintName').value.trim();
        const goal = document.getElementById('editSprintGoal').value.trim();
        const velocity = parseInt(document.getElementById('editSprintVelocity').value) || sprint.velocity || 0;
        const bugCount = parseInt(document.getElementById('editSprintBugCount').value) || 0;
        const teamSize = parseInt(document.getElementById('editSprintTeamSize').value) || sprint.teamSize || 0;
        const startDate = document.getElementById('editSprintStartDate').value;
        const endDate = document.getElementById('editSprintEndDate').value;

        // Validation
        if (!name) {
            this.showNotification('⚠️ Le nom est requis', 'warning');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            this.showNotification('⚠️ La date de début doit être avant la date de fin', 'warning');
            return;
        }

        // Calculer la durée du sprint
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Mettre à jour le sprint
        sprint.name = name;
        sprint.goal = goal;
        sprint.velocity = velocity;
        sprint.bugCount = bugCount;
        sprint.teamSize = teamSize;
        sprint.startDate = startDate;
        sprint.endDate = endDate;
        sprint.duration = duration;
        sprint.updated = new Date().toISOString();

        // Sauvegarder dans PocketBase si disponible
        if (typeof updateSprintInPocketBase !== 'undefined') {
            await updateSprintInPocketBase(sprint);
        }

        this.saveToStorage();
        this.renderAll();

        document.getElementById('editSprintDatesModal').style.display = 'none';
        this.showNotification(`✅ Sprint "${name}" mis à jour (${duration} jours)`);
    }

    /**
     * ========================================
     * TOGGLE VUE CHART / CASINO
     * ========================================
     */

    toggleView() {
        // Empêcher les appels multiples rapides
        if (this.isTogglingView) {
            console.log('⏸️ Toggle déjà en cours, ignoré');
            return;
        }
        this.isTogglingView = true;

        // S'assurer que currentView a une valeur par défaut
        const currentView = this.data.settings.currentView || 'chart';
        const newView = currentView === 'chart' ? 'casino' : 'chart';

        console.log('🔄 Toggle view:', currentView, '→', newView);

        this.data.settings.currentView = newView;
        this.saveToStorage();

        const chartView = document.getElementById('chartView');
        const chartCasinoView = document.getElementById('chartCasinoView');
        const toggleBtn = document.getElementById('toggleViewBtn');

        if (!chartView || !chartCasinoView || !toggleBtn) {
            console.error('❌ Éléments de vue non trouvés');
            this.isTogglingView = false;
            return;
        }

        if (newView === 'casino') {
            chartView.style.display = 'none';
            chartCasinoView.style.display = 'block';
            toggleBtn.innerHTML = '📊 Graphique';
            toggleBtn.className = 'btn btn-primary';
            console.log('✅ Vue Casino activée');
            this.renderFullCasino();
        } else {
            chartView.style.display = 'block';
            chartCasinoView.style.display = 'none';
            toggleBtn.innerHTML = '🎰 Casino';
            toggleBtn.className = 'btn btn-warning';
            console.log('✅ Vue Graphique activée');
        }

        // Réactiver après un court délai
        setTimeout(() => {
            this.isTogglingView = false;
        }, 300);
    }

    /**
     * ========================================
     * CRUD USER STORIES
     * ========================================
     */

    switchStoryTab(tab) {
        const singleTab = document.getElementById('singleStoryTab');
        const multipleTab = document.getElementById('multipleStoriesTab');
        const singleForm = document.getElementById('addStoryForm');
        const multipleForm = document.getElementById('addMultipleStoriesForm');

        if (tab === 'single') {
            singleTab.classList.add('active');
            multipleTab.classList.remove('active');
            singleForm.style.display = 'block';
            multipleForm.style.display = 'none';
        } else {
            singleTab.classList.remove('active');
            multipleTab.classList.add('active');
            singleForm.style.display = 'none';
            multipleForm.style.display = 'block';
        }
    }

    async addUserStory() {
        const title = document.getElementById('storyTitle').value.trim();
        const description = document.getElementById('storyDescription').value.trim();

        if (!title) {
            this.showNotification('⚠️ Veuillez saisir au moins un titre', 'warning');
            return;
        }

        const story = {
            id: Date.now(),
            title: title,
            description: description || '',
            complexity: '?',
            estimate: null,
            estimates: {}, // Stockage de toutes les estimations
            created: new Date().toISOString()
        };

        this.data.stories = this.data.stories || [];
        this.data.stories.push(story);

        // Sauvegarder dans PocketBase si disponible
        if (typeof saveStoryToPocketBase !== 'undefined') {
            await saveStoryToPocketBase(story);
        }

        this.saveToStorage();

        document.getElementById('addStoryModal').style.display = 'none';
        document.getElementById('addStoryForm').reset();

        this.showNotification(`✅ User Story "${story.title}" ajoutée`);

        // Rafraîchir le casino si ouvert
        if (this.data.settings.currentView === 'casino') {
            this.renderFullCasino();
        }
    }

    async addMultipleUserStories() {
        const text = document.getElementById('multipleStoriesText').value.trim();

        if (!text) {
            this.showNotification('⚠️ Veuillez saisir au moins une User Story', 'warning');
            return;
        }

        const lines = text.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('#'); // Ignorer les lignes vides et les commentaires
        });

        const stories = [];
        let baseTimestamp = Date.now();

        lines.forEach((line, index) => {
            const parts = line.split('|').map(p => p.trim());
            const title = parts[0];
            const description = parts[1] || '';

            if (title) {
                stories.push({
                    id: baseTimestamp + index,
                    title: title,
                    description: description,
                    complexity: '?',
                    estimate: null,
                    estimates: {},
                    created: new Date().toISOString()
                });
            }
        });

        if (stories.length === 0) {
            this.showNotification('⚠️ Aucune User Story valide trouvée', 'warning');
            return;
        }

        this.data.stories = this.data.stories || [];
        this.data.stories.push(...stories);

        // Sauvegarder dans PocketBase si disponible
        if (typeof saveStoriesToPocketBase !== 'undefined') {
            await saveStoriesToPocketBase(stories);
        }

        this.saveToStorage();

        document.getElementById('addStoryModal').style.display = 'none';
        document.getElementById('addMultipleStoriesForm').reset();

        this.showNotification(`✅ ${stories.length} User Stories ajoutées`);

        // Rafraîchir le casino si ouvert
        if (this.data.settings.currentView === 'casino') {
            // S'assurer que l'index actuel est valide
            if (this.casinoSession.currentStory >= this.data.stories.length) {
                this.casinoSession.currentStory = this.data.stories.length - 1;
            }
            this.renderFullCasino();
        }
    }

    async editUserStory(id) {
        const story = this.data.stories.find(s => s.id === id);
        if (!story) return;

        const newTitle = prompt('Titre de la User Story:', story.title);
        if (!newTitle || newTitle.trim() === '') return;

        const newDescription = prompt('Description:', story.description);
        if (!newDescription || newDescription.trim() === '') return;

        story.title = newTitle.trim();
        story.description = newDescription.trim();
        story.updated = new Date().toISOString();

        // Sauvegarder dans PocketBase si disponible
        if (typeof updateStoryInPocketBase !== 'undefined') {
            await updateStoryInPocketBase(story);
        }

        this.saveToStorage();
        this.openManageStoriesModal();
        this.showNotification('✅ User Story mise à jour');
    }

    async deleteUserStory(id) {
        const story = this.data.stories.find(s => s.id === id);
        if (!story) return;

        if (!confirm(`Supprimer la User Story "${story.title}" ?`)) return;

        // Supprimer de PocketBase si disponible
        if (typeof deleteStoryFromPocketBase !== 'undefined') {
            await deleteStoryFromPocketBase(story);
        }

        this.data.stories = this.data.stories.filter(s => s.id !== id);
        this.saveToStorage();
        this.openManageStoriesModal();
        this.showNotification('✅ User Story supprimée');

        // Rafraîchir le casino si ouvert
        if (this.data.settings.currentView === 'casino') {
            this.renderFullCasino();
        }
    }

    openManageStoriesModal() {
        const container = document.getElementById('storiesList');
        const stories = this.data.stories || [];

        if (stories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📝 Aucune User Story pour le moment</p>
                    <p style="color: #666; font-size: 0.9rem;">Ajoutez des User Stories pour commencer les estimations</p>
                </div>
            `;
        } else {
            container.innerHTML = stories.map(story => {
                // Récupérer toutes les estimations
                const estimates = story.estimates || {};
                const estimatesList = Object.entries(estimates).map(([user, data]) => {
                    const points = typeof data === 'object' ? data.points : data;
                    return `<span class="estimate-chip" data-points="${points}">${user}: ${points}</span>`;
                }).join('');

                return `
                    <div class="story-item">
                        <div class="story-content">
                            <h4>${story.title}</h4>
                            <p>${story.description || '<em style="color: #999;">Pas de description</em>'}</p>
                            <div class="story-estimates-container">
                                ${story.estimate ? `<span class="story-estimate-main">Estimation finale: ${story.estimate} pts</span>` : '<span class="story-estimate-pending">Non estimé</span>'}
                                ${estimatesList ? `
                                    <div class="story-estimates-detail">
                                        <small style="color: #666; display: block; margin-top: 0.5rem;">Estimations individuelles:</small>
                                        <div class="estimates-chips">${estimatesList}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="story-actions">
                            <button onclick="window.velocityTool.editUserStory(${story.id})" class="btn-small btn-primary">✏️</button>
                            <button onclick="window.velocityTool.deleteUserStory(${story.id})" class="btn-small btn-danger">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        this.openModal('manageStoriesModal');
    }

    /**
     * ========================================
     * ANNOTATIONS ET SURVOL
     * ========================================
     */

    // Gestion survol corrigée
    handleAnnotationHover(event, chart) {
        if (!chart.scales || !chart.scales.x || !chart.scales.y) {
            return;
        }

        try {
            const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
            const hoveredAnnotation = this.getAnnotationAtPosition(canvasPosition, chart);

            if (hoveredAnnotation) {
                chart.canvas.style.cursor = 'pointer';
                this.showAnnotationTooltip(event, hoveredAnnotation);
            } else {
                chart.canvas.style.cursor = 'default';
                this.hideAnnotationTooltip();
            }
        } catch (error) {
            console.warn('Erreur hover annotation:', error);
        }
    }

    // Gestion clic corrigée
    handleAnnotationClick(event, chart) {
        if (!chart.scales || !chart.scales.x || !chart.scales.y) {
            return;
        }

        try {
            const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
            const annotations = this.getAnnotationAtPosition(canvasPosition, chart);

            if (annotations) {
                this.showAnnotationDetails(annotations);
            }
        } catch (error) {
            console.warn('Erreur clic annotation:', error);
        }
    }

    // Fonction de détection position corrigée
    getAnnotationAtPosition(position, chart) {
        const annotations = this.data.annotations || [];
        const { scales } = chart;

        if (!scales.x || !scales.y) return null;

        // Grouper par sprint avec comparaison flexible
        const annotationsBySprint = {};
        annotations.forEach(annotation => {
            const sprintIndex = this.data.sprints.findIndex(s => s.id == annotation.sprintId);
            if (sprintIndex !== -1) {
                if (!annotationsBySprint[sprintIndex]) {
                    annotationsBySprint[sprintIndex] = [];
                }
                annotationsBySprint[sprintIndex].push(annotation);
            } else {
                console.warn('⚠️ Sprint non trouvé pour annotation:', {
                    annotationSprintId: annotation.sprintId,
                    availableSprintIds: this.data.sprints.map(s => s.id),
                    text: annotation.text
                });
            }
        });


        for (const [sprintIndex, sprintAnnotations] of Object.entries(annotationsBySprint)) {
            try {
                const index = parseInt(sprintIndex);
                const sprint = this.data.sprints[index];

                // Les sprints sont déjà inversés dans le graphique (sprintsReversed)
                // donc on utilise directement l'index pour correspondre à l'affichage
                const displayIndex = index;

                if (displayIndex >= chart.data.labels.length) continue;

                const x = scales.x.getPixelForValue(displayIndex);
                const y = scales.y.getPixelForValue(sprint.velocity) - 25;

                if (isNaN(x) || isNaN(y)) continue;

                // Vérifier chaque annotation du sprint
                const annotationCount = sprintAnnotations.length;
                const startOffset = annotationCount > 1 ? -(annotationCount - 1) * 12 : 0;

                for (let i = 0; i < Math.min(3, sprintAnnotations.length); i++) {
                    const offsetX = startOffset + (i * 24);
                    const finalX = x + offsetX;

                    const distance = Math.sqrt(
                        Math.pow(position.x - finalX, 2) + Math.pow(position.y - y, 2)
                    );

                    if (distance <= 12) {
                        // Retourner toutes les annotations du sprint
                        return sprintAnnotations;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#2196F3',
                    borderWidth: 1
                },
                // Plugin d'annotations activé seulement si on a des données
                annotationIcons: this.data.sprints.length > 0
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: this.data.settings.framework === 'scrum' ? 'Story Points' : 'Items'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            // Interactions sécurisées
            onHover: (event, elements, chart) => {
                if (chart.scales && chart.scales.x && chart.scales.y) {
                    this.handleAnnotationHover(event, chart);
                }
            },
            onClick: (event, elements, chart) => {
                if (chart.scales && chart.scales.x && chart.scales.y) {
                    this.handleAnnotationClick(event, chart);
                }
            }
        };
    }

    // Afficher tooltip annotation
    showAnnotationTooltip(event, annotations) {
        this.hideAnnotationTooltip();

        // Si c'est un tableau (multiples annotations)
        const annotationList = Array.isArray(annotations) ? annotations : [annotations];

        const annotationTypes = {
            team: { icon: "👥", label: "Changement équipe" },
            vacation: { icon: "🏖️", label: "Congés" },
            incident: { icon: "🚨", label: "Incident" },
            process: { icon: "🔧", label: "Process" },
            release: { icon: "🚀", label: "Release" },
            training: { icon: "🎓", label: "Formation" }
        };

        const tooltip = document.createElement('div');
        tooltip.id = 'annotation-tooltip';
        tooltip.className = 'annotation-tooltip';

        if (annotationList.length === 1) {
            const annotation = annotationList[0];
            const type = annotationTypes[annotation.type];
            tooltip.innerHTML = `
                <div style="font-weight: bold;">
                    ${type?.icon} ${type?.label}
                </div>
                <div style="margin-top: 0.25rem;">${annotation.text}</div>
            `;
        } else {
            tooltip.innerHTML = `
                <div style="font-weight: bold;">📝 ${annotationList.length} faits marquants</div>
                ${annotationList.map(annotation => {
                const type = annotationTypes[annotation.type];
                return `<div style="margin-top: 0.25rem; font-size: 0.85rem;">
                        ${type?.icon} ${annotation.text}
                    </div>`;
            }).join('')}
            `;
        }

        tooltip.style.position = 'absolute';
        tooltip.style.left = (event.clientX + 10) + 'px';
        tooltip.style.top = (event.clientY - 10) + 'px';
        tooltip.style.zIndex = '3000';

        document.body.appendChild(tooltip);
    }

    // Masquer tooltip
    hideAnnotationTooltip() {
        const tooltip = document.getElementById('annotation-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Afficher détails annotation
    showAnnotationDetails(annotations) {
        // Gérer le cas où on reçoit un tableau ou une seule annotation
        const annotationList = Array.isArray(annotations) ? annotations : [annotations];

        const annotationTypes = {
            team: { icon: "👥", label: "Changement équipe" },
            vacation: { icon: "🏖️", label: "Congés" },
            incident: { icon: "🚨", label: "Incident" },
            process: { icon: "🔧", label: "Process" },
            release: { icon: "🚀", label: "Release" },
            training: { icon: "🎓", label: "Formation" }
        };

        if (annotationList.length === 1) {
            // Une seule annotation
            const annotation = annotationList[0];
            const type = annotationTypes[annotation.type];
            const sprint = this.data.sprints.find(s => s.id == annotation.sprintId);

            const details = `
    ${type?.icon || '📝'} ${type?.label || 'Fait marquant'}
    Sprint: ${sprint?.name || 'Sprint non trouvé'}
    Date: ${annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR') : 'Date inconnue'}

    "${annotation.text || 'Pas de description'}"
            `.trim();

            alert(details);
        } else {
            // Multiples annotations
            const sprint = this.data.sprints.find(s => s.id == annotationList[0].sprintId);

            let details = `📝 ${annotationList.length} faits marquants - ${sprint?.name || 'Sprint inconnu'}\n\n`;

            annotationList.forEach((annotation, index) => {
                const type = annotationTypes[annotation.type];
                const date = annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR') : 'Date inconnue';

                details += `${index + 1}. ${type?.icon || '📝'} ${type?.label || 'Fait marquant'}\n`;
                details += `   Date: ${date}\n`;
                details += `   "${annotation.text || 'Pas de description'}"\n\n`;
            });

            alert(details);
        }
    }


    /**
     * ========================================
     * RENDU GRAPHIQUES
     * ========================================
     */

    renderChart() {
        const ctx = document.getElementById('mainChart').getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        const framework = this.data.settings.framework;
        const chartView = this.data.settings.chartView || 'velocity';

        // Définir le titre selon le framework et la vue
        let chartTitle = '📊 Vélocité d\'Équipe';
        if (framework === 'kanban') {
            chartTitle = '🌊 Flux Kanban';
        } else if (framework === 'scrum') {
            const titles = {
                velocity: '📊 Vélocité par Sprint',
                burndown: '📉 Burndown Chart',
                burnup: '📈 Burnup Chart'
            };
            chartTitle = titles[chartView] || titles.velocity;
        }
        document.getElementById('chartTitle').textContent = chartTitle;

        // Inverser l'ordre : du plus ancien (gauche) au plus récent (droite)
        const sprintsReversed = [...this.data.sprints].reverse();
        const labels = sprintsReversed.map(s => s.name);
        const velocities = sprintsReversed.map(s => s.velocity);

        // Vérifier qu'on a des données
        if (labels.length === 0 || velocities.length === 0) {
            console.log('📊 Pas de données pour le graphique');
            console.log('📊 Debug - this.data.sprints:', this.data.sprints);
            console.log('📊 Debug - labels:', labels);
            console.log('📊 Debug - velocities:', velocities);
            return;
        }

        console.log('📊 Rendu graphique avec:', {
            sprints: this.data.sprints.length,
            annotations: this.data.annotations?.length || 0,
            team: this.data.team?.length || 0
        });

        const trendLine = this.calculateTrend(velocities);

        if (framework === 'kanban') {
            this.renderKanbanChart(ctx, labels, velocities);
        } else {
            // Mode Scrum : choisir la vue appropriée
            switch (chartView) {
                case 'burndown':
                    this.renderBurndownChart(ctx, labels, velocities);
                    break;
                case 'burnup':
                    this.renderBurnupChart(ctx, labels, velocities);
                    break;
                case 'velocity':
                default:
                    this.renderScrumChart(ctx, labels, velocities, trendLine);
                    break;
            }
        }

        // Ajouter les annotations avec un délai pour s'assurer que le graphique est prêt
        setTimeout(() => {
            this.renderAnnotationLegend();
        }, 100);
    }

    renderScrumChart(ctx, labels, velocities, trendLine) {
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Story Points',
                    data: velocities,
                    backgroundColor: 'rgba(33, 150, 243, 0.8)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                }, {
                    label: 'Tendance',
                    data: trendLine,
                    type: 'line',
                    borderColor: '#FF9800',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#FF9800',
                    tension: 0.4
                }]
            },
            options: {
                ...this.getChartOptions(),
                plugins: {
                    ...this.getChartOptions().plugins,
                    // Activer notre plugin d'annotations
                    annotationIcons: true,
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#2196F3',
                        borderWidth: 1,
                        callbacks: {
                            afterBody: (tooltipItems) => {
                                const displayIndex = tooltipItems[0].dataIndex;
                                // Les sprints sont déjà inversés dans le graphique, utiliser directement displayIndex
                                const sprint = this.data.sprints[displayIndex];
                                const annotations = (this.data.annotations || []).filter(a => a.sprintId == sprint.id);

                                if (annotations.length > 0) {
                                    const annotationTypes = {
                                        team: "👥", vacation: "🏖️", incident: "🚨",
                                        process: "🔧", release: "🚀", training: "🎓"
                                    };

                                    return [
                                        '',
                                        '📝 Faits marquants:',
                                        ...annotations.map(a => `${annotationTypes[a.type] || '📝'} ${a.text}`)
                                    ];
                                }
                                return [];
                            }
                        }
                    }
                },
                // Ajouter gestion survol des annotations
                onHover: (event, elements, chart) => {
                    this.handleAnnotationHover(event, chart);
                },
                onClick: (event, elements, chart) => {
                    this.handleAnnotationClick(event, chart);
                }
            }
        });
    }

    renderKanbanChart(ctx, labels, velocities) {
        // Simulation données Kanban
        const cumulativeData = [];
        let cumulative = 0;
        velocities.forEach(v => {
            cumulative += v;
            cumulativeData.push(cumulative);
        });

        const wipData = velocities.map(v => Math.round(v * 0.3));

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Items Terminés (Cumulé)',
                    data: cumulativeData,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    borderColor: '#4CAF50',
                    borderWidth: 3,
                    tension: 0.4
                }, {
                    label: 'WIP Moyen',
                    data: wipData,
                    fill: false,
                    backgroundColor: 'rgba(255, 152, 0, 0.3)',
                    borderColor: '#FF9800',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4
                }]
            },
            options: {
                ...this.getChartOptions(),
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre d\'items'
                        }
                    }
                }
            }
        });
    }

    /**
     * Burndown Chart - Affiche le travail restant au fil du sprint
     */
    renderBurndownChart(ctx, labels, velocities) {
        // Calculer le travail restant (burndown)
        const totalWork = velocities.reduce((sum, v) => sum + v, 0);
        const remainingWork = [];
        let remaining = totalWork;

        velocities.forEach(v => {
            remainingWork.push(remaining);
            remaining -= v;
        });
        remainingWork.push(0); // Fin du dernier sprint

        // Ligne idéale (descente linéaire)
        const idealBurndown = [];
        const step = totalWork / velocities.length;
        for (let i = 0; i <= velocities.length; i++) {
            idealBurndown.push(totalWork - (step * i));
        }

        // Ajouter un label pour le point final
        const extendedLabels = [...labels, 'Fin'];

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: extendedLabels,
                datasets: [{
                    label: 'Travail Restant',
                    data: remainingWork,
                    fill: true,
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    borderColor: '#F44336',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#F44336',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.3
                }, {
                    label: 'Burndown Idéal',
                    data: idealBurndown,
                    fill: false,
                    borderColor: '#9E9E9E',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 4,
                    pointBackgroundColor: '#9E9E9E',
                    tension: 0
                }]
            },
            options: {
                ...this.getChartOptions(),
                plugins: {
                    ...this.getChartOptions().plugins,
                    annotationIcons: true,
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: ${value} points`;
                            },
                            afterBody: (tooltipItems) => {
                                const displayIndex = tooltipItems[0].dataIndex;
                                if (displayIndex >= this.data.sprints.length) return [];

                                // Les sprints sont déjà inversés dans le graphique, utiliser directement displayIndex
                                const sprint = this.data.sprints[displayIndex];
                                const annotations = (this.data.annotations || []).filter(a => a.sprintId == sprint.id);

                                if (annotations.length > 0) {
                                    const annotationTypes = {
                                        team: "👥", vacation: "🏖️", incident: "🚨",
                                        process: "🔧", release: "🚀", training: "🎓"
                                    };

                                    return [
                                        '',
                                        '📝 Faits marquants:',
                                        ...annotations.map(a => `${annotationTypes[a.type] || '📝'} ${a.text}`)
                                    ];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Story Points Restants'
                        }
                    }
                },
                onHover: (event, elements, chart) => {
                    this.handleAnnotationHover(event, chart);
                },
                onClick: (event, elements, chart) => {
                    this.handleAnnotationClick(event, chart);
                }
            }
        });
    }

    /**
     * Burnup Chart - Affiche le travail complété vs scope total
     */
    renderBurnupChart(ctx, labels, velocities) {
        // Calculer le travail complété (cumulatif)
        const completedWork = [];
        let completed = 0;

        velocities.forEach(v => {
            completed += v;
            completedWork.push(completed);
        });

        // Scope total (peut varier si ajout de stories)
        const totalScope = [];
        const finalScope = velocities.reduce((sum, v) => sum + v, 0);

        // Simuler des variations de scope (ajouts en cours de route)
        let currentScope = finalScope * 0.8; // Commence à 80% du scope final
        velocities.forEach((v, i) => {
            if (i === Math.floor(velocities.length / 2)) {
                currentScope = finalScope; // Ajout de scope à mi-parcours
            }
            totalScope.push(currentScope);
        });

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Travail Complété',
                    data: completedWork,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: '#4CAF50',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.3
                }, {
                    label: 'Scope Total',
                    data: totalScope,
                    fill: false,
                    borderColor: '#2196F3',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#2196F3',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.2
                }]
            },
            options: {
                ...this.getChartOptions(),
                plugins: {
                    ...this.getChartOptions().plugins,
                    annotationIcons: true,
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: ${value} points`;
                            },
                            footer: (tooltipItems) => {
                                const completed = tooltipItems[0].parsed.y;
                                const scope = tooltipItems[1]?.parsed.y || 0;
                                const progress = scope > 0 ? Math.round((completed / scope) * 100) : 0;
                                return `Progression: ${progress}%`;
                            },
                            afterBody: (tooltipItems) => {
                                const displayIndex = tooltipItems[0].dataIndex;
                                // Les sprints sont déjà inversés dans le graphique, utiliser directement displayIndex
                                const sprint = this.data.sprints[displayIndex];
                                const annotations = (this.data.annotations || []).filter(a => a.sprintId == sprint.id);

                                if (annotations.length > 0) {
                                    const annotationTypes = {
                                        team: "👥", vacation: "🏖️", incident: "🚨",
                                        process: "🔧", release: "🚀", training: "🎓"
                                    };

                                    return [
                                        '',
                                        '📝 Faits marquants:',
                                        ...annotations.map(a => `${annotationTypes[a.type] || '📝'} ${a.text}`)
                                    ];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Story Points'
                        }
                    }
                },
                onHover: (event, elements, chart) => {
                    this.handleAnnotationHover(event, chart);
                },
                onClick: (event, elements, chart) => {
                    this.handleAnnotationClick(event, chart);
                }
            }
        });
    }

    /**
     * Changer la vue du graphique (Vélocité, Burndown, Burnup)
     */
    changeChartView(view) {
        console.log('📊 Changement de vue:', view);

        // Mettre à jour les boutons actifs
        document.querySelectorAll('.chart-view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        // Sauvegarder la vue
        this.data.settings.chartView = view;
        this.saveToStorage();

        // Re-render le graphique
        this.renderChart();
    }

    /**
     * Restaurer la vue de graphique sauvegardée
     */
    restoreChartView() {
        const savedView = this.data.settings.chartView || 'velocity';

        // Activer le bon bouton
        document.querySelectorAll('.chart-view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === savedView) {
                btn.classList.add('active');
            }
        });
    }

    // Ajouter dans renderChart() après création du graphique
    renderAnnotationLegend() {
        const container = document.querySelector('.chart-header');
        if (!container) return;

        const existing = container.querySelector('.annotation-legend');
        if (existing) existing.remove();

        const annotations = this.data.annotations || [];
        if (annotations.length === 0) return;

        const annotationTypes = {
            team: { icon: "👥", label: "Équipe", color: "#2196F3" },
            vacation: { icon: "🏖️", label: "Congés", color: "#FF9800" },
            incident: { icon: "🚨", label: "Incident", color: "#F44336" },
            process: { icon: "🔧", label: "Process", color: "#9C27B0" },
            release: { icon: "🚀", label: "Release", color: "#4CAF50" },
            training: { icon: "🎓", label: "Formation", color: "#00BCD4" }
        };

        const usedTypes = [...new Set(annotations.map(a => a.type))];

        const legend = document.createElement('div');
        legend.className = 'annotation-legend';
        legend.style.cssText = `
            display: flex; 
            gap: 1rem; 
            flex-wrap: wrap; 
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(0,0,0,0.05);
            border-radius: 6px;
        `;

        legend.innerHTML = usedTypes.map(type => {
            const typeInfo = annotationTypes[type];
            if (!typeInfo) return '';

            const count = annotations.filter(a => a.type === type).length;

            return `<span class="annotation-legend-item" data-type="${type}" style="
                font-size: 0.9rem; 
                color: ${typeInfo.color};
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            " onclick="window.velocityTool.showAnnotationsByType('${type}')">
                ${typeInfo.icon} ${typeInfo.label} <span style="
                    background: ${typeInfo.color};
                    color: white;
                    padding: 0.125rem 0.375rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    margin-left: 0.25rem;
                ">${count}</span>
            </span>`;
        }).join('');

        container.appendChild(legend);
    }

    showAnnotationsByType(type) {
        const annotations = (this.data.annotations || []).filter(a => a.type === type);

        if (annotations.length === 0) {
            this.showNotification('Aucune annotation de ce type', 'info');
            return;
        }

        const annotationTypes = {
            team: { icon: "👥", label: "Équipe", color: "#2196F3" },
            vacation: { icon: "🏖️", label: "Congés", color: "#FF9800" },
            incident: { icon: "🚨", label: "Incident", color: "#F44336" },
            process: { icon: "🔧", label: "Process", color: "#9C27B0" },
            release: { icon: "🚀", label: "Release", color: "#4CAF50" },
            training: { icon: "🎓", label: "Formation", color: "#00BCD4" }
        };

        const typeInfo = annotationTypes[type];

        // Créer le panneau
        const panel = document.createElement('div');
        panel.id = 'annotationsPanel';
        panel.className = 'annotations-panel';
        panel.innerHTML = `
            <div class="annotations-panel-header" style="background: ${typeInfo.color};">
                <h3>${typeInfo.icon} ${typeInfo.label} (${annotations.length})</h3>
                <button onclick="document.getElementById('annotationsPanel').remove()" class="btn-close">✕</button>
            </div>
            <div class="annotations-panel-content">
                ${annotations.map(annotation => {
            const sprint = this.data.sprints.find(s => s.id == annotation.sprintId);
            const date = annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : 'Date inconnue';

            return `
                        <div class="annotation-panel-item">
                            <div class="annotation-panel-sprint">
                                <strong>${sprint?.name || 'Sprint inconnu'}</strong>
                                <span class="annotation-panel-date">${date}</span>
                            </div>
                            <div class="annotation-panel-text">${annotation.text}</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

        // Supprimer le panneau existant s'il y en a un
        const existingPanel = document.getElementById('annotationsPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Ajouter le panneau au DOM
        document.body.appendChild(panel);

        // Animation d'entrée
        setTimeout(() => {
            panel.classList.add('show');
        }, 10);
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#2196F3',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: this.data.settings.framework === 'scrum' ? 'Story Points' : 'Items'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const sprintIndex = elements[0].index;
                    this.showSprintDetails(this.data.sprints[sprintIndex]);
                }
            }
        };
    }

    /**
     * Radar Chart - Performance multi-critères
     */
    renderRadarChart() {
        let ctx = document.getElementById('radarChart');
        console.log('🎯 renderRadarChart() - Canvas trouvé:', !!ctx);

        // Trouver le container (que le canvas existe ou non)
        let container = ctx ? ctx.parentElement : document.querySelector('.radar-container');

        if (!container) {
            console.warn('⚠️ Container .radar-container non trouvé');
            return;
        }

        // Si le canvas n'existe pas, le recréer
        if (!ctx) {
            console.log('🔧 Recréation du canvas radarChart');
            container.innerHTML = '<canvas id="radarChart"></canvas>';
            ctx = document.getElementById('radarChart');

            if (!ctx) {
                console.error('❌ Impossible de créer le canvas');
                return;
            }
        }

        if (this.radarChart) {
            this.radarChart.destroy();
            this.radarChart = null;
        }

        // Vérifier s'il y a des membres dans l'équipe
        const hasTeamMembers = this.data.team && this.data.team.length > 0;

        console.log('🎯 Radar - Membres:', this.data.team?.length || 0, 'membres');

        if (!hasTeamMembers) {
            // Afficher un message si pas de membres
            container.innerHTML = `
                <div class="empty-state">
                    <p>👥 Aucun membre d'équipe</p>
                    <p style="color: #666; font-size: 0.9rem;">Ajoutez des membres pour voir le radar de compétences</p>
                </div>
            `;
            return;
        }

        // S'assurer que le canvas existe
        if (!ctx.getContext) {
            container.innerHTML = '<canvas id="radarChart"></canvas>';
            // Attendre un tick pour que le DOM soit mis à jour
            setTimeout(() => this.renderRadarChart(), 0);
            return;
        }

        // Collecter toutes les compétences uniques de l'équipe
        const allSkills = new Set();
        this.data.team.forEach(member => {
            console.log('🎯 Membre:', member.name, 'Skills:', member.skills);
            if (member.skills && Array.isArray(member.skills)) {
                member.skills.forEach(skill => allSkills.add(skill));
            }
        });

        const skillsArray = Array.from(allSkills).sort();
        console.log('🎯 Compétences uniques:', skillsArray);

        // Si pas de compétences, afficher un message
        if (skillsArray.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>🎯 Aucune compétence définie</p>
                    <p style="color: #666; font-size: 0.9rem;">Ajoutez des compétences aux membres pour voir le radar</p>
                </div>
            `;
            return;
        }

        // S'assurer que le canvas existe après avoir vérifié les compétences
        const radarCanvas = document.getElementById('radarChart');
        if (!radarCanvas || !radarCanvas.getContext) {
            container.innerHTML = '<canvas id="radarChart"></canvas>';
            setTimeout(() => this.renderRadarChart(), 0);
            return;
        }

        // Palette de couleurs pour chaque membre
        const colors = [
            { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196F3' },      // Bleu
            { bg: 'rgba(76, 175, 80, 0.2)', border: '#4CAF50' },       // Vert
            { bg: 'rgba(255, 152, 0, 0.2)', border: '#FF9800' },       // Orange
            { bg: 'rgba(156, 39, 176, 0.2)', border: '#9C27B0' },      // Violet
            { bg: 'rgba(244, 67, 54, 0.2)', border: '#F44336' },       // Rouge
            { bg: 'rgba(0, 188, 212, 0.2)', border: '#00BCD4' },       // Cyan
            { bg: 'rgba(255, 193, 7, 0.2)', border: '#FFC107' },       // Jaune
            { bg: 'rgba(233, 30, 99, 0.2)', border: '#E91E63' },       // Rose
            { bg: 'rgba(103, 58, 183, 0.2)', border: '#673AB7' },      // Indigo
            { bg: 'rgba(96, 125, 139, 0.2)', border: '#607D8B' }       // Gris bleu
        ];

        // Créer un dataset par membre
        const datasets = this.data.team.map((member, index) => {
            const color = colors[index % colors.length];

            // Pour chaque compétence, mettre 100 si le membre l'a, 0 sinon
            const data = skillsArray.map(skill => {
                return member.skills && member.skills.includes(skill) ? 100 : 0;
            });

            return {
                label: member.name,
                data: data,
                backgroundColor: color.bg,
                borderColor: color.border,
                pointBackgroundColor: color.border,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 2
            };
        });

        this.radarChart = new Chart(radarCanvas, {
            type: 'radar',
            data: {
                labels: skillsArray,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false, // Masquer les valeurs 0-100
                            stepSize: 50
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const memberName = context.dataset.label;
                                const skill = context.label;
                                const hasSkill = context.parsed.r > 0;
                                return `${memberName}: ${hasSkill ? '✓ ' + skill : '✗ ' + skill}`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Calculs scores radar
     */
    getVelocityScore() {
        if (this.data.sprints.length === 0) return 0;
        const velocities = this.data.sprints.map(s => s.velocity);
        const avg = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
        return Math.min(100, (avg / 30) * 100); // 30 = vélocité parfaite
    }

    getQualityScore() {
        const bugRate = this.data.qualityMetrics?.bugRate || 10;
        return Math.max(0, 100 - bugRate * 5); // Moins de bugs = meilleur score
    }

    getMoodScore() {
        const moods = this.data.moodTracking || [];
        if (moods.length === 0) return 70; // Score par défaut

        const recent = moods.slice(-7); // 7 derniers jours
        const avg = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
        return (avg / 3) * 100; // 3 = très heureux
    }

    getCollaborationScore() {
        const teamSize = (this.data.team || []).length;
        if (teamSize < 2) return 30;

        // Score basé sur diversité compétences et taille équipe
        const skills = new Set();
        (this.data.team || []).forEach(member => {
            (member.skills || []).forEach(skill => skills.add(skill));
        });

        const diversityScore = Math.min(100, (skills.size / teamSize) * 50);
        const sizeScore = teamSize >= 3 && teamSize <= 8 ? 50 : 30;

        return diversityScore + sizeScore;
    }

    /**
     * Heatmap Burnout
     */
    renderBurnoutHeatmap() {
        const container = document.getElementById('burnoutHeatmap');
        if (!container) return;

        const team = this.data.team || [];
        if (team.length === 0) {
            container.innerHTML = '<div class="capacity-warning">Ajoutez des membres pour voir la heatmap</div>';
            return;
        }

        const weeks = this.getLast12Weeks();
        const moodTracking = this.data.moodTracking || [];

        console.log('🔥 Heatmap Burnout - Debug:');
        console.log('- Équipe:', team.map(m => `${m.name} (ID: ${m.id})`));
        console.log('- Semaines:', weeks);
        console.log('- Moods disponibles:', moodTracking.length);
        if (moodTracking.length > 0) {
            console.log('- Exemple mood:', moodTracking[0]);
        }

        const heatmapHTML = `
            <div class="heatmap-grid">
                ${team.map(member => `
                    <div class="heatmap-row">
                        <span class="member-name">${member.name}</span>
                        ${weeks.map(week => {
            // Vérifier s'il y a des données de mood pour ce membre cette semaine
            const weekData = this.getMoodDataForWeek(member.id, week);

            if (!weekData || weekData.count === 0) {
                // Pas de données : cellule grisée
                return `<div class="heatmap-cell heatmap-empty" 
                                         title="${member.name} - ${week}: Aucune donnée"></div>`;
            }

            // Calculer le burnout basé sur les données réelles
            const burnoutLevel = this.calculateBurnoutFromMood(weekData);
            const color = this.getBurnoutColor(burnoutLevel);
            return `<div class="heatmap-cell" style="background:${color}" 
                                         title="${member.name} - ${week}: Burnout ${burnoutLevel}% (${weekData.count} entrée${weekData.count > 1 ? 's' : ''})"></div>`;
        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = heatmapHTML;
    }

    getMoodDataForWeek(memberId, weekLabel) {
        const moodTracking = this.data.moodTracking || [];

        // Trouver le membre pour obtenir son nom
        const member = this.data.team.find(m => m.id == memberId);
        if (!member) {
            console.warn('Membre non trouvé:', memberId);
            return null;
        }

        // Extraire le numéro de semaine du label (ex: "S41" -> 41)
        const weekNumber = parseInt(weekLabel.replace('S', ''));

        // Filtrer les moods pour ce membre et cette semaine
        // Matcher par ID ou nom pour compatibilité avec anciennes données
        const weekMoods = moodTracking.filter(mood => {
            // Vérifier si c'est le bon membre
            const isSameMember =
                // Match exact par ID (string ou number)
                mood.memberId == memberId ||
                // Match par nom (anciennes données ou fallback)
                mood.memberId == member.name ||
                mood.memberName == member.name;

            if (!isSameMember) return false;

            const moodDate = new Date(mood.date);
            const moodWeek = this.getWeekNumber(moodDate);

            return moodWeek === weekNumber;
        });

        if (weekMoods.length === 0) {
            console.log(`Aucun mood pour ${member.name} (ID: ${memberId}) semaine ${weekNumber}`);
            return null;
        }

        // Calculer la moyenne des scores
        const avgScore = weekMoods.reduce((sum, m) => sum + m.score, 0) / weekMoods.length;

        console.log(`✅ ${weekMoods.length} mood(s) trouvé(s) pour ${member.name} semaine ${weekNumber}`);

        return {
            count: weekMoods.length,
            avgScore: avgScore,
            moods: weekMoods
        };
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    calculateBurnoutFromMood(weekData) {
        // Convertir le score de mood (1-3) en niveau de burnout (0-100)
        // Score 3 (heureux) = 0-20% burnout
        // Score 2 (neutre) = 30-50% burnout
        // Score 1 (triste) = 60-100% burnout

        const avgScore = weekData.avgScore;

        if (avgScore >= 2.5) {
            // Très heureux : burnout faible
            return Math.round(10 + Math.random() * 15); // 10-25%
        } else if (avgScore >= 2) {
            // Heureux : burnout modéré-faible
            return Math.round(25 + Math.random() * 20); // 25-45%
        } else if (avgScore >= 1.5) {
            // Neutre : burnout modéré
            return Math.round(45 + Math.random() * 20); // 45-65%
        } else {
            // Triste : burnout élevé
            return Math.round(65 + Math.random() * 30); // 65-95%
        }
    }

    getLast12Weeks() {
        const weeks = [];
        const today = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i * 7);
            const weekNumber = this.getWeekNumber(date);
            weeks.push(`S${weekNumber}`);
        }

        return weeks;
    }

    calculateBurnout(memberId, week) {
        // Simulation réaliste du burnout
        const baseStress = Math.random() * 30;
        const sprintPressure = this.getSprintPressure() * 0.3;
        const personalFactor = (memberId % 3) * 10; // Variation par personne

        return Math.min(100, Math.round(baseStress + sprintPressure + personalFactor));
    }

    getSprintPressure() {
        if (this.data.sprints.length < 2) return 20;

        const recent = this.data.sprints.slice(-2);
        const pressure = recent.reduce((sum, s) => sum + s.velocity, 0) / recent.length;
        return Math.min(60, pressure * 2);
    }

    getBurnoutColor(level) {
        if (level < 30) return '#4CAF50';      // Vert - OK
        if (level < 50) return '#8BC34A';      // Vert clair
        if (level < 70) return '#FFC107';      // Jaune
        if (level < 85) return '#FF9800';      // Orange
        return '#F44336';                      // Rouge - Danger
    }

    /**
     * ========================================
     * CALCULS ET MÉTRIQUES
     * ========================================
     */

    calculateTrend(data) {
        if (data.length < 2) return data;

        const trend = [];
        const window = Math.min(3, data.length);

        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - window + 1);
            const slice = data.slice(start, i + 1);
            const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
            trend.push(Math.round(avg * 10) / 10);
        }

        return trend;
    }

    calculateVariance(data) {
        if (data.length < 2) return 0;

        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        return Math.round(Math.sqrt(variance) / mean * 100);
    }

    /**
     * ========================================
     * KPIS ET MÉTRIQUES
     * ========================================
     */

    updateKPIs() {
        const velocities = this.data.sprints.map(s => s.velocity);

        if (velocities.length === 0) {
            ['avgVelocity', 'predictedNext', 'teamHealth'].forEach(id => {
                document.getElementById(id).textContent = '-';
            });
            return;
        }

        // Vélocité moyenne
        const avgVelocity = Math.round(velocities.reduce((sum, v) => sum + v, 0) / velocities.length);
        document.getElementById('avgVelocity').textContent = avgVelocity;

        // Prédiction sprint suivant
        const lastThree = velocities.slice(-3);
        const prediction = Math.round(lastThree.reduce((sum, v) => sum + v, 0) / lastThree.length);
        document.getElementById('predictedNext').textContent = prediction;

        // Santé équipe
        const variance = this.calculateVariance(velocities);
        const health = variance < 20 ? '🟢' : variance < 40 ? '🟡' : '🔴';
        document.getElementById('teamHealth').textContent = health;
    }

    /**
     * ========================================
     * CAPACITÉ ÉQUIPE ET PRÉDICTIONS
     * ========================================
     */

    updateTeamCapacity() {
        const container = document.getElementById('teamCapacity');
        const terms = this.getTerminology();

        if ((this.data.team || []).length === 0) {
            container.innerHTML = `
                <div class="capacity-warning">
                    ⚠️ Configurez votre équipe pour voir les prédictions
                    <button class="btn btn-primary" style="margin-top: 1rem;">➕ Ajouter Équipe</button>
                </div>
            `;
            return;
        }

        // Ajouter l'événement pour le helper après le rendu
        setTimeout(() => {
            const helper = document.querySelector('.prediction-helper');
            if (helper) {
                helper.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPredictionExplanation();
                });
            }
        }, 100);

        const avgVelocity = this.data.sprints.length > 0
            ? Math.round(this.data.sprints.map(s => s.velocity).reduce((sum, v) => sum + v, 0) / this.data.sprints.length)
            : 20;
        // ========================================
        // ALGORITHME DE PRÉDICTION DES FUTURS SPRINTS
        // ========================================
        // Cet algorithme prédit la vélocité des 6 prochains sprints en combinant :
        // 1. La vélocité moyenne historique comme base de calcul
        // 2. Des facteurs saisonniers (congés été/hiver qui réduisent la capacité)
        // 3. La capacité actuelle de l'équipe (membres à temps partiel, absences)
        // 4. Une variation aléatoire réaliste pour simuler l'incertitude naturelle
        // 5. Un niveau de confiance décroissant dans le temps (plus on prédit loin, moins c'est fiable)

        const predictions = [];
        for (let i = 1; i <= 6; i++) {
            // Facteur saisonnier : réduit la vélocité en juillet/août (0.75-0.8) et décembre (0.9)
            // Prend en compte les congés d'été et de fin d'année qui impactent la productivité
            const seasonalFactor = this.getSeasonalFactor(i);

            // Facteur capacité équipe : moyenne des capacités individuelles (ex: 80% si quelqu'un à mi-temps)
            // Permet d'ajuster selon la disponibilité réelle des membres de l'équipe
            const teamCapacityFactor = this.getTeamCapacityFactor();

            // Variation aléatoire de ±7.5% pour simuler l'imprévisibilité naturelle des sprints
            // Reflète les imprévus, changements de priorité, complexité sous-estimée, etc.
            const variation = (Math.random() - 0.5) * 0.15; // ±7.5%

            // Calcul final : Base × Saison × Capacité × Variation
            // Exemple : 20 pts × 0.8 (été) × 0.9 (équipe) × 1.05 (variation) = 15 pts
            const predicted = Math.round(avgVelocity * seasonalFactor * teamCapacityFactor * (1 + variation));

            // Confiance décroissante : 90% pour Sprint+1, puis -4% par sprint (66% pour Sprint+6)
            // Plus on prédit loin dans le futur, moins la prédiction est fiable
            const confidence = Math.max(60, 90 - i * 4); // Décroissante

            predictions.push({
                sprint: `${terms.Sprint} +${i}`,
                capacity: predicted,
                confidence: confidence
            });
        }

        // Afficher les sprints existants avec possibilité de modification
        // S'assurer que les sprints sont triés par date de fin (du plus ancien au plus récent)
        this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        const existingSprints = this.data.sprints.slice(-3); // 3 derniers sprints
        const existingSprintsHTML = existingSprints.length > 0 ? `
            <div class="existing-sprints">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">📊 ${terms.Sprints} récents</h4>
                ${existingSprints.map(sprint => {
            const endDate = new Date(sprint.endDate);
            const dateStr = isNaN(endDate.getTime()) ? 'Date non définie' : endDate.toLocaleDateString('fr-FR');
            return `
                    <div class="capacity-item clickable" onclick="window.velocityTool.openEditSprintDatesModal('${sprint.id}')">
                        <span class="capacity-sprint">${sprint.name}</span>
                        <span class="capacity-value">${sprint.velocity} pts</span>
                        <span class="capacity-date">🏁 ${dateStr}</span>
                    </div>
                    `;
        }).join('')}
            </div>
        ` : '';

        container.innerHTML = `
            ${existingSprintsHTML}
            ${existingSprintsHTML ? '<hr style="margin: 1rem 0; border: none; border-top: 1px solid #e9ecef;">' : ''}
            <h4 style="margin-bottom: 0.5rem; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem;">
                🔮 Prédictions
                <span class="prediction-helper" title="Comment sont calculées les prédictions ?">ℹ️</span>
            </h4>
            <div class="capacity-list">
                ${predictions.map(p => `
                    <div class="capacity-item">
                        <span class="capacity-sprint">${p.sprint}</span>
                        <span class="capacity-value">${p.capacity} pts</span>
                        <span class="capacity-confidence">${p.confidence}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getSeasonalFactor(sprintOffset) {
        const currentMonth = new Date().getMonth();
        const futureMonth = (currentMonth + sprintOffset) % 12;

        // Facteurs saisonniers (congés été/hiver)
        const seasonalFactors = {
            0: 0.85,  // Janvier
            1: 1.0,   // Février
            2: 1.0,   // Mars
            3: 1.0,   // Avril
            4: 1.0,   // Mai
            5: 1.0,   // Juin
            6: 0.8,   // Juillet
            7: 0.75,  // Août
            8: 1.0,   // Septembre
            9: 1.0,   // Octobre
            10: 1.0,  // Novembre
            11: 0.9   // Décembre
        };

        return seasonalFactors[futureMonth] || 1.0;
    }

    getTeamCapacityFactor() {
        const team = this.data.team || [];
        if (team.length === 0) return 1.0;

        const avgCapacity = team.reduce((sum, m) => sum + m.capacity, 0) / team.length;
        return avgCapacity / 100;
    }

    showPredictionExplanation() {
        const velocities = this.data.sprints.map(s => s.velocity);
        const avgVelocity = velocities.length > 0
            ? Math.round(velocities.reduce((sum, v) => sum + v, 0) / velocities.length)
            : 20;

        const explanation = `
            <div style="max-width: 600px; text-align: left;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">🔮 Comment sont calculées les prédictions ?</h3>
                
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="margin-bottom: 0.5rem; color: #495057;">📊 Algorithme de prédiction</h4>
                    <p style="margin-bottom: 0.5rem; line-height: 1.6;">
                        Les prédictions combinent plusieurs facteurs pour estimer la vélocité des 6 prochains sprints :
                    </p>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">1️⃣ Base de calcul</h4>
                    <p style="line-height: 1.6; margin-bottom: 0.5rem;">
                        <strong>Vélocité moyenne historique :</strong> ${avgVelocity} points
                    </p>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5;">
                        Moyenne des ${velocities.length} derniers sprints comme point de départ
                    </p>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">2️⃣ Facteur saisonnier</h4>
                    <p style="line-height: 1.6; margin-bottom: 0.5rem;">
                        <strong>Congés et périodes creuses :</strong>
                    </p>
                    <ul style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-left: 1.5rem;">
                        <li>🏖️ Juillet/Août : -20% à -25% (congés d'été)</li>
                        <li>🎄 Décembre : -10% (congés de fin d'année)</li>
                        <li>✅ Autres mois : 100% (capacité normale)</li>
                    </ul>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">3️⃣ Capacité équipe</h4>
                    <p style="line-height: 1.6; margin-bottom: 0.5rem;">
                        <strong>Disponibilité des membres :</strong>
                    </p>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5;">
                        Moyenne des capacités individuelles (ex: 80% si quelqu'un à mi-temps)
                    </p>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">4️⃣ Variation aléatoire</h4>
                    <p style="line-height: 1.6; margin-bottom: 0.5rem;">
                        <strong>Incertitude naturelle :</strong> ±7.5%
                    </p>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5;">
                        Simule les imprévus, changements de priorité, complexité sous-estimée, etc.
                    </p>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">5️⃣ Niveau de confiance</h4>
                    <p style="line-height: 1.6; margin-bottom: 0.5rem;">
                        <strong>Fiabilité décroissante :</strong>
                    </p>
                    <ul style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-left: 1.5rem;">
                        <li>Sprint +1 : 90% de confiance</li>
                        <li>Sprint +2 : 86% de confiance</li>
                        <li>Sprint +3 : 82% de confiance</li>
                        <li>Sprint +6 : 66% de confiance</li>
                    </ul>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-top: 0.5rem;">
                        Plus on prédit loin dans le futur, moins la prédiction est fiable
                    </p>
                </div>

                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="margin-bottom: 0.5rem; color: #1976d2;">📐 Formule finale</h4>
                    <code style="display: block; background: white; padding: 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; margin-top: 0.5rem;">
                        Prédiction = Base × Saison × Capacité × (1 + Variation)
                    </code>
                    <p style="font-size: 0.85rem; color: #1565c0; margin-top: 0.5rem; line-height: 1.5;">
                        Exemple : 20 pts × 0.8 (été) × 0.9 (équipe) × 1.05 (variation) = <strong>15 pts</strong>
                    </p>
                </div>
            </div>
        `;

        this.showCustomNotification(explanation);
    }

    /**
     * ========================================
     * INTELLIGENCE COACHING
     * ========================================
     */

    showCoachingInsights() {
        const container = document.getElementById('coachingAlerts');
        const terms = this.getTerminology();
        const alerts = this.generateAdvancedAlerts();

        // Regrouper les alertes similaires
        const groupedAlerts = this.groupSimilarAlerts(alerts);

        container.innerHTML = groupedAlerts.length > 0
            ? groupedAlerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    ${alert.icon} ${alert.message}
                    ${alert.details ? `<div class="alert-details">${alert.details}</div>` : ''}
                </div>
            `).join('')
            : `<div class="alert alert-info">💡 Ajoutez plus de ${terms.sprints.toLowerCase()} pour recevoir des conseils</div>`;
    }

    groupSimilarAlerts(alerts) {
        const grouped = [];
        const busFactor = alerts.filter(a => a.message.includes('Bus factor'));
        const others = alerts.filter(a => !a.message.includes('Bus factor'));

        // Regrouper les Bus Factor
        if (busFactor.length > 0) {
            const skills = busFactor.map(a => {
                const match = a.message.match(/"([^"]+)"/);
                return match ? match[1] : '';
            }).filter(Boolean);

            grouped.push({
                type: 'warning',
                icon: '🚌',
                message: `Bus factor critique détecté sur ${busFactor.length} compétence${busFactor.length > 1 ? 's' : ''}`,
                details: `Compétences à risque : <strong>${skills.join(', ')}</strong><br>
                         <small>💡 Conseil : Organisez du pair programming pour partager ces compétences</small>`
            });
        }

        // Ajouter les autres alertes
        grouped.push(...others);

        return grouped;
    }

    generateAdvancedAlerts() {
        return [
            ...this.generateCoachingAlerts(),
            ...this.detectSeasonalPatterns(),
            ...this.detectBusFactor(),
            ...this.predictBugs(),
            ...this.optimizeWIP(),
            ...this.detectAnomalies()
        ];
    }

    generateCoachingAlerts() {
        const alerts = [];
        const velocities = this.data.sprints.map(s => s.velocity);
        const terms = this.getTerminology();

        if (velocities.length < 3) return alerts;

        // Vélocité en baisse
        const lastThree = velocities.slice(-3);
        if (lastThree.every((v, i) => i === 0 || v < lastThree[i - 1])) {
            alerts.push({
                type: 'warning',
                icon: '📉',
                message: `${terms.velocity} en baisse sur 3 ${terms.sprints.toLowerCase()}. Temps pour un 5 Whys ou Retrospective approfondie ?`,
                action: 'Organisez une rétrospective focalisée sur les obstacles'
            });
        }

        // Vélocité variable
        const variance = this.calculateVariance(velocities);
        if (variance > 40) {
            alerts.push({
                type: 'warning',
                icon: '🎢',
                message: `${terms.velocity} très variable (${variance}%). L'équipe a-t-elle besoin de stabilité ?`,
                action: 'Revoyez votre Definition of Done et vos estimations'
            });
        }

        // Vélocité stable
        if (variance < 15 && velocities.length > 5) {
            alerts.push({
                type: 'success',
                icon: '🎯',
                message: 'Excellente stabilité ! Votre équipe a trouvé son rythme de croisière.',
                action: 'Maintenez ce rythme soutenable et célébrez les succès'
            });
        }

        // Tendance positive
        const recent = velocities.slice(-4);
        const older = velocities.slice(-8, -4);
        if (recent.length === 4 && older.length === 4) {
            const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
            const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;

            if (recentAvg > olderAvg * 1.2) {
                alerts.push({
                    type: 'success',
                    icon: '🚀',
                    message: `+20% de ${terms.velocity.toLowerCase()} ! L'équipe monte en compétence. Célébrez ce succès !`,
                    action: 'Partagez vos bonnes pratiques avec d\'autres équipes'
                });
            }
        }

        // Vélocité trop élevée (risque de burnout)
        const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
        const lastSprint = velocities[velocities.length - 1];
        if (lastSprint > avgVelocity * 1.5 && velocities.length > 4) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                message: `${terms.velocity} exceptionnellement haute (+50%). Attention au surmenage !`,
                action: 'Vérifiez le bien-être de l\'équipe et la qualité du code'
            });
        }

        // Équipe trop petite
        const team = this.data.team || [];
        if (team.length > 0 && team.length < 3) {
            alerts.push({
                type: 'info',
                icon: '👥',
                message: `Équipe de ${team.length} personne${team.length > 1 ? 's' : ''}. Scrum recommande 3-9 membres.`,
                action: 'Envisagez de renforcer l\'équipe ou de simplifier le scope'
            });
        }

        // Équipe trop grande
        if (team.length > 9) {
            alerts.push({
                type: 'warning',
                icon: '👥',
                message: `Équipe de ${team.length} personnes. Au-delà de 9, la communication devient complexe.`,
                action: 'Envisagez de diviser en plusieurs équipes Scrum'
            });
        }

        // Manque de diversité de compétences
        const allSkills = new Set();
        team.forEach(member => {
            (member.skills || []).forEach(skill => allSkills.add(skill));
        });

        if (team.length > 0 && allSkills.size < team.length * 2) {
            alerts.push({
                type: 'info',
                icon: '🎓',
                message: 'Diversité de compétences limitée. Investissez dans la formation !',
                action: 'Planifiez des formations croisées et du pair programming'
            });
        }

        return alerts;
    }

    /**
     * Intelligence prédictive avancée
     */
    detectSeasonalPatterns() {
        const alerts = [];
        const velocities = this.data.sprints.map(s => ({
            velocity: s.velocity,
            month: new Date(s.endDate).getMonth()
        }));

        if (velocities.length < 6) return alerts;

        // Détection pattern été
        const summerMonths = velocities.filter(v => [6, 7, 8].includes(v.month));
        if (summerMonths.length >= 2) {
            const summerAvg = summerMonths.reduce((sum, v) => sum + v.velocity, 0) / summerMonths.length;
            const globalAvg = velocities.reduce((sum, v) => sum + v.velocity, 0) / velocities.length;

            if (summerAvg < globalAvg * 0.8) {
                alerts.push({
                    type: 'info',
                    icon: '🏖️',
                    message: `Pattern détecté: -${Math.round((1 - summerAvg / globalAvg) * 100)}% vélocité en été. Anticipez vos congés !`
                });
            }
        }

        return alerts;
    }

    detectBusFactor() {
        const alerts = [];
        const team = this.data.team || [];
        if (team.length < 2) return alerts;

        const skills = {};

        team.forEach(member => {
            (member.skills || []).forEach(skill => {
                skills[skill] = (skills[skill] || 0) + 1;
            });
        });

        const criticalSkills = Object.entries(skills).filter(([skill, count]) => count === 1);

        criticalSkills.forEach(([skill]) => {
            alerts.push({
                type: 'warning',
                icon: '🚌',
                message: `Bus factor critique: "${skill}" maîtrisé par 1 seule personne ! Organisez du pair programming.`
            });
        });

        return alerts;
    }

    predictBugs() {
        const alerts = [];
        const velocities = this.data.sprints.map(s => s.velocity);
        if (velocities.length < 4) return alerts;

        const recentVelocity = velocities.slice(-3).reduce((sum, v) => sum + v, 0) / 3;
        const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;

        if (recentVelocity > avgVelocity * 1.3) {
            alerts.push({
                type: 'warning',
                icon: '🐛',
                message: `Vélocité +30% récente. Risque bugs accru. Renforcez la qualité !`
            });
        }

        return alerts;
    }

    optimizeWIP() {
        const teamSize = (this.data.team || []).length;
        if (teamSize === 0) return [];

        const optimalWIP = Math.ceil(teamSize * 1.5);

        return [{
            type: 'info',
            icon: '⚙️',
            message: `WIP optimal recommandé: ${optimalWIP} items (${teamSize} personnes)`
        }];
    }

    detectAnomalies() {
        const alerts = [];
        const velocities = this.data.sprints.map(s => s.velocity);
        if (velocities.length < 5) return alerts;

        // Détection outliers (méthode IQR)
        const sorted = [...velocities].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        this.data.sprints.forEach(sprint => {
            if (sprint.velocity < lowerBound || sprint.velocity > upperBound) {
                alerts.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `Anomalie: ${sprint.name} (${sprint.velocity} pts) sort des patterns habituels`
                });
            }
        });

        return alerts;
    }

    /**
     * ========================================
     * DÉTAILS SPRINT
     * ========================================
     */

    showSprintDetails(sprint) {
        if (!sprint) {
            alert('❌ Sprint non trouvé');
            return;
        }

        const annotations = (this.data.annotations || []).filter(a => a.sprintId == sprint.id);
        const annotationTypes = {
            team: "👥", vacation: "🏖️", incident: "🚨",
            process: "🔧", release: "🚀", training: "🎓"
        };

        let details = `📊 Détails Sprint\n\n`;
        details += `Sprint: ${sprint.name}\n`;
        details += `Vélocité: ${sprint.velocity} points\n`;
        details += `Date fin: ${sprint.endDate}\n\n`;

        if (annotations.length > 0) {
            details += `📝 Faits marquants (${annotations.length}):\n`;
            annotations.forEach((annotation, index) => {
                const icon = annotationTypes[annotation.type] || '📝';
                const date = annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR') : '';
                details += `${index + 1}. ${icon} ${annotation.text} ${date ? `(${date})` : ''}\n`;
            });
        } else {
            details += `📝 Aucun fait marquant`;
        }

        alert(details);
    }

    /**
     * ========================================
     * TEMPLATES ENRICHIS
     * ========================================
     */

    /**
     * Ouvre la modal de confirmation pour charger un template
     */
    openTemplateConfirmation(templateKey, framework) {
        // Charger les données du template depuis templates-data.js
        const template = typeof TEMPLATES_DATA !== 'undefined' ? TEMPLATES_DATA[templateKey] : null;

        if (!template) {
            console.error('Template non trouvé:', templateKey);
            this.showNotification('❌ Template non trouvé', 'error');
            return;
        }

        // Stocker le template sélectionné
        this.selectedTemplate = { key: templateKey, data: template };

        // Afficher le nom du template
        document.getElementById('selectedTemplateName').textContent = template.name;

        // Générer les options de session
        const sessionOptions = document.getElementById('sessionOptions');

        // Vérifier si une session existe (soit avec des sprints, soit une session PocketBase active)
        const hasCurrentSession = (this.data.sprints && this.data.sprints.length > 0) ||
            (typeof window.currentSessionId !== 'undefined' && window.currentSessionId);

        if (hasCurrentSession) {
            const sprintCount = this.data.sprints ? this.data.sprints.length : 0;
            const sessionInfo = sprintCount > 0 ? `${sprintCount} sprints` : 'session vide';

            // Option 1: Sauvegarder dans la session actuelle
            sessionOptions.innerHTML = `
                <div class="session-option" data-action="current">
                    <input type="radio" name="sessionChoice" value="current" id="sessionCurrent" checked>
                    <label class="session-option-label" for="sessionCurrent">
                        <strong>📊 Session actuelle</strong>
                        <small>Remplacer les données actuelles (${sessionInfo})</small>
                    </label>
                </div>
                <div class="session-option" data-action="new">
                    <input type="radio" name="sessionChoice" value="new" id="sessionNew">
                    <label class="session-option-label" for="sessionNew">
                        <strong>➕ Nouvelle session</strong>
                        <small>Créer une nouvelle session et sauvegarder le template</small>
                    </label>
                </div>
            `;
        } else {
            // Pas de session, créer une nouvelle
            sessionOptions.innerHTML = `
                <div class="session-option selected" data-action="new">
                    <input type="radio" name="sessionChoice" value="new" id="sessionNew" checked>
                    <label class="session-option-label" for="sessionNew">
                        <strong>➕ Nouvelle session</strong>
                        <small>Créer une nouvelle session avec ce template</small>
                    </label>
                </div>
            `;
        }

        // Gérer la sélection des options
        document.querySelectorAll('.session-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.session-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input[type="radio"]').checked = true;
            });
        });

        // Fermer la modal des templates et ouvrir la confirmation
        document.getElementById('templatesModal').style.display = 'none';
        this.openModal('templateConfirmModal');
    }

    /**
     * Confirme et charge le template sélectionné
     */
    async confirmTemplateLoad() {
        if (!this.selectedTemplate) {
            this.showNotification('❌ Aucun template sélectionné', 'error');
            return;
        }

        const selectedAction = document.querySelector('input[name="sessionChoice"]:checked')?.value;

        if (!selectedAction) {
            this.showNotification('⚠️ Veuillez sélectionner une option', 'warning');
            return;
        }

        // Fermer la modal de confirmation
        document.getElementById('templateConfirmModal').style.display = 'none';

        if (selectedAction === 'new') {
            // Créer une nouvelle session si la fonction existe
            if (typeof createNewSession !== 'undefined') {
                await createNewSession();
            } else {
                // Sinon, réinitialiser les données localement
                this.data = {
                    sprints: [],
                    team: [],
                    annotations: [],
                    achievements: [],
                    moodTracking: [],
                    qualityMetrics: {},
                    stories: [],
                    events: [],
                    settings: {
                        framework: 'scrum',
                        sprintLength: 14,
                        workingDays: 10,
                        currentView: 'chart',
                        userName: 'Utilisateur',
                        dailyTime: '09:00'
                    }
                };
            }
        } else if (selectedAction === 'current') {
            // Session actuelle : supprimer les anciennes données de PocketBase
            if (typeof clearCurrentSessionData !== 'undefined') {
                console.log('🗑️ Suppression des anciennes données de la session...');
                await clearCurrentSessionData();
                console.log('✅ Anciennes données supprimées');
            }

            // Réinitialiser les données locales
            this.data.sprints = [];
            this.data.team = [];
            this.data.annotations = [];
            this.data.moodTracking = [];
            this.data.events = [];
        }

        // Charger le template
        await this.loadTemplateData(this.selectedTemplate.data);

        // Nettoyer
        this.selectedTemplate = null;
    }

    /**
     * Charge les données d'un template (nouvelle méthode unifiée)
     */
    async loadTemplateData(template) {
        console.log('📋 Chargement template:', template.name);

        try {
            // 1. Créer les sprints avec des IDs uniques
            const baseId = Date.now();
            const sprints = template.sprints.map((sprint, index) => ({
                ...sprint,
                id: baseId + index,
                timestamp: new Date().toISOString()
            }));

            // 2. Créer les annotations avec les bons sprintId
            const annotations = (template.annotationsTemplate || []).map((annotationTemplate, index) => {
                const targetSprint = sprints[annotationTemplate.sprintIndex];
                if (!targetSprint) {
                    console.warn('⚠️ Sprint non trouvé pour annotation index:', annotationTemplate.sprintIndex);
                    return null;
                }

                return {
                    id: baseId + 1000 + index,
                    type: annotationTemplate.type,
                    sprintId: targetSprint.id,
                    text: annotationTemplate.text,
                    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                };
            }).filter(Boolean);

            // 3. Générer les données de mood tracking
            const moodTracking = this.generateMoodData(30, template.team);

            // 4. Créer les événements avec des IDs uniques
            const events = (template.events || []).map((event, index) => ({
                ...event,
                id: baseId + 2000 + index,
                session_id: this.sessionId || 'local',
                sprint_id: sprints.find(s => s.endDate >= event.date)?.id || null
            }));

            // 5. Créer les PIs avec des IDs uniques
            const pis = (template.pis || []).map((pi, index) => ({
                ...pi,
                id: baseId + 3000 + index,
                session_id: this.sessionId || 'local'
            }));

            // 6. Trier les sprints par date (du plus ancien au plus récent)
            sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

            // 7. Copier toutes les données du template (les IDs seront mis à jour après la sauvegarde PocketBase)
            Object.assign(this.data, {
                sprints: sprints,
                team: template.team.map(member => ({ ...member })),
                annotations: annotations,
                moodTracking: moodTracking,
                events: events,
                pis: pis,
                qualityMetrics: { ...template.qualityMetrics },
                settings: { ...this.data.settings, ...template.settings }
            });

            // 6. Mettre à jour l'interface
            const frameworkSelect = document.getElementById('frameworkMode');
            if (frameworkSelect) {
                frameworkSelect.value = template.settings.framework;
            }

            // 7. Sauvegarder dans PocketBase si disponible
            if (typeof saveSprintToPocketBase !== 'undefined' && typeof usePocketBase !== 'undefined' && usePocketBase) {
                console.log('💾 Sauvegarde du template dans PocketBase...');
                console.log('📊 Données à sauvegarder:', {
                    sprints: sprints.length,
                    pis: pis.length,
                    team: this.data.team.length,
                    annotations: annotations.length,
                    moods: moodTracking.length,
                    events: events.length
                });

                // Créer un mapping entre les IDs temporaires et les IDs PocketBase
                const sprintIdMapping = {};

                // Sauvegarder tous les sprints et créer le mapping
                console.log('💾 Sauvegarde des sprints...');
                for (const sprint of sprints) {
                    const oldId = sprint.id;
                    const savedSprint = await saveSprintToPocketBase(sprint);
                    if (savedSprint && savedSprint.id) {
                        sprintIdMapping[oldId] = savedSprint.id;
                        // Mettre à jour l'ID local
                        sprint.id = savedSprint.id;
                        sprint.pbId = savedSprint.id;
                    }
                }
                console.log('✅ Sprints sauvegardés avec mapping:', sprintIdMapping);

                // Mettre à jour les sprintId des annotations avec les nouveaux IDs PocketBase
                annotations.forEach(annotation => {
                    if (sprintIdMapping[annotation.sprintId]) {
                        console.log(`🔄 Mise à jour annotation: ${annotation.sprintId} → ${sprintIdMapping[annotation.sprintId]}`);
                        annotation.sprintId = sprintIdMapping[annotation.sprintId];
                    }
                });

                // Sauvegarder tous les membres d'équipe
                console.log('💾 Sauvegarde des membres...');
                for (const member of this.data.team) {
                    await saveTeamMemberToPocketBase(member);
                }
                console.log('✅ Membres sauvegardés');

                // Sauvegarder toutes les annotations (avec les IDs mis à jour)
                console.log('💾 Sauvegarde des annotations...');
                for (const annotation of annotations) {
                    await saveAnnotationToPocketBase(annotation);
                }
                console.log('✅ Annotations sauvegardées');

                // Sauvegarder tous les moods
                console.log('💾 Sauvegarde des moods...');
                for (const mood of moodTracking) {
                    await saveMoodToPocketBase(mood);
                }
                console.log('✅ Moods sauvegardés');

                // Sauvegarder tous les événements
                if (events.length > 0) {
                    console.log('💾 Sauvegarde des événements...');
                    for (const event of events) {
                        await saveEventToPocketBase(event);
                    }
                    console.log('✅ Événements sauvegardés');
                }

                // Sauvegarder tous les PIs (déjà déclarés plus haut)
                if (pis.length > 0) {
                    console.log('💾 Sauvegarde des PIs...');
                    for (const pi of pis) {
                        await savePiToPocketBase(pi);
                    }
                    console.log('✅ PIs sauvegardés');
                }

                console.log('✅ Template sauvegardé dans PocketBase');
            } else {
                console.log('⚠️ PocketBase non disponible, sauvegarde dans localStorage');
                console.log('Debug:', {
                    saveSprintToPocketBase: typeof saveSprintToPocketBase,
                    usePocketBase: typeof usePocketBase !== 'undefined' ? usePocketBase : 'undefined'
                });
                // Fallback sur localStorage
                this.saveToStorage();
            }

            // 8. Rendre l'interface
            this.renderAll();

            // 9. Notifier
            this.showNotification(`✅ Template "${template.name}" chargé avec succès !`, 'success');

            // 10. Debug info
            console.log('✅ Template chargé:', {
                sprints: this.data.sprints.length,
                annotations: this.data.annotations.length,
                pis: this.data.pis?.length || 0,
                events: this.data.events.length,
                team: this.data.team.length,
                framework: this.data.settings.framework
            });

            // 11. Vérifier la cohérence
            this.validateTemplateData();

        } catch (error) {
            console.error('Erreur chargement template:', error);
            this.showNotification('❌ Erreur lors du chargement du template', 'error');
        }
    }

    loadTemplate(templateType) {
        const templates = {
            startup: {
                name: "🚀 Équipe Startup",
                sprints: [
                    { name: "Sprint 1", velocity: 8, startDate: "2025-05-25", endDate: "2025-06-01", goal: "Mise en place de l'infrastructure de base et premiers composants UI" },
                    { name: "Sprint 2", velocity: 12, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Développement des fonctionnalités d'authentification et profil utilisateur" },
                    { name: "Sprint 3", velocity: 15, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Intégration API et dashboard principal" },
                    { name: "Sprint 4", velocity: 18, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Système de notifications et amélioration UX" },
                    { name: "Sprint 5", velocity: 16, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Tests end-to-end et corrections de bugs" },
                    { name: "Sprint 6", velocity: 20, startDate: "2025-06-30", endDate: "2025-07-06", goal: "Optimisation performances et préparation release v1.1" }
                ],
                events: [
                    { type: "daily", title: "Daily Standup", date: "2025-06-30", time: "09:00", duration: 15, recurring: true },
                    { type: "sprint_planning", title: "Sprint 6 Planning", date: "2025-06-30", time: "10:00", duration: 120, description: "Planification du sprint 6 avec toute l'équipe" },
                    { type: "backlog_refinement", title: "Refinement - Features v1.2", date: "2025-07-02", time: "14:00", duration: 60 },
                    { type: "sprint_review", title: "Sprint 6 Review", date: "2025-07-06", time: "14:00", duration: 60, description: "Démonstration des fonctionnalités développées" },
                    { type: "sprint_retrospective", title: "Sprint 6 Retrospective", date: "2025-07-06", time: "15:30", duration: 90 }
                ],
                team: [
                    {
                        id: 1,
                        name: "Alex",
                        role: "Frontend Dev",
                        capacity: 100,
                        skills: ["React", "TypeScript", "CSS", "Jest"]
                    },
                    {
                        id: 2,
                        name: "Sam",
                        role: "Backend Dev",
                        capacity: 90,
                        skills: ["Node.js", "Python", "AWS", "Docker"]
                    },
                    {
                        id: 3,
                        name: "Jordan",
                        role: "Designer",
                        capacity: 100,
                        skills: ["UI/UX", "Figma", "Animation", "Prototyping"]
                    }
                ],
                annotationsTemplate: [
                    { sprintIndex: 0, type: "release", text: "Premier MVP lancé avec succès" },
                    { sprintIndex: 2, type: "team", text: "Nouveau designer rejoint l'équipe" },
                    { sprintIndex: 3, type: "process", text: "Mise en place CI/CD" },
                    { sprintIndex: 4, type: "vacation", text: "Alex en congés 2 jours" },
                    { sprintIndex: 5, type: "release", text: "Version 1.1 déployée" }
                ],
                qualityMetrics: { bugRate: 5, testCoverage: 80 },
                settings: { framework: 'scrum', sprintLength: 7, workingDays: 5 }
            },

            enterprise: {
                name: "🏢 Équipe Enterprise",
                sprints: [
                    { name: "Sprint 1", velocity: 24, startDate: "2025-05-18", endDate: "2025-06-01", goal: "Migration architecture microservices - Phase 1" },
                    { name: "Sprint 2", velocity: 28, startDate: "2025-06-02", endDate: "2025-06-15", goal: "Implémentation API Gateway et service d'authentification" },
                    { name: "Sprint 3", velocity: 22, startDate: "2025-06-16", endDate: "2025-06-29", goal: "Développement services métier et intégration base de données" },
                    { name: "Sprint 4", velocity: 30, startDate: "2025-06-30", endDate: "2025-07-13", goal: "Mise en place monitoring et observabilité complète" },
                    { name: "Sprint 5", velocity: 26, startDate: "2025-07-14", endDate: "2025-07-27", goal: "Tests de charge et optimisation performances" },
                    { name: "Sprint 6", velocity: 32, startDate: "2025-07-28", endDate: "2025-08-10", goal: "Déploiement production et documentation technique" },
                    { name: "Sprint 7", velocity: 29, startDate: "2025-08-11", endDate: "2025-08-24", goal: "Stabilisation post-release et nouvelles fonctionnalités" }
                ],
                events: [
                    { type: "daily", title: "Daily Standup", date: "2025-07-28", time: "09:30", duration: 15, recurring: true },
                    { type: "sprint_planning", title: "Sprint 6 Planning", date: "2025-07-28", time: "10:00", duration: 180, description: "Planification détaillée avec architecture review" },
                    { type: "backlog_refinement", title: "Refinement - Microservices", date: "2025-07-30", time: "14:00", duration: 90 },
                    { type: "backlog_refinement", title: "Refinement - Infrastructure", date: "2025-08-06", time: "14:00", duration: 90 },
                    { type: "sprint_review", title: "Sprint 6 Review", date: "2025-08-10", time: "14:00", duration: 90, description: "Démonstration aux stakeholders" },
                    { type: "sprint_retrospective", title: "Sprint 6 Retrospective", date: "2025-08-10", time: "16:00", duration: 120, description: "Rétrospective approfondie avec actions concrètes" }
                ],
                team: [
                    {
                        id: 1,
                        name: "Marie",
                        role: "Tech Lead",
                        capacity: 80,
                        skills: ["Architecture", "Java", "DevOps", "Mentoring", "Spring"]
                    },
                    {
                        id: 2,
                        name: "Pierre",
                        role: "Senior Dev",
                        capacity: 100,
                        skills: ["Java", "Spring", "PostgreSQL", "Microservices"]
                    },
                    {
                        id: 3,
                        name: "Sophie",
                        role: "Frontend",
                        capacity: 100,
                        skills: ["Angular", "CSS", "Testing", "TypeScript"]
                    },
                    {
                        id: 4,
                        name: "Lucas",
                        role: "QA",
                        capacity: 100,
                        skills: ["Automation", "Selenium", "Performance", "API Testing"]
                    },
                    {
                        id: 5,
                        name: "Emma",
                        role: "DevOps",
                        capacity: 90,
                        skills: ["Docker", "K8s", "AWS", "Monitoring", "Terraform"]
                    }
                ],
                annotationsTemplate: [
                    { sprintIndex: 1, type: "incident", text: "Incident production - 2h downtime résolu" },
                    { sprintIndex: 2, type: "vacation", text: "Marie en congés 1 semaine" },
                    { sprintIndex: 3, type: "process", text: "Migration vers CI/CD automatisé" },
                    { sprintIndex: 4, type: "training", text: "Formation équipe sur Kubernetes" },
                    { sprintIndex: 5, type: "release", text: "Release majeure v2.0" },
                    { sprintIndex: 6, type: "process", text: "Mise en place monitoring avancé" }
                ],
                qualityMetrics: { bugRate: 12, testCoverage: 95 },
                settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
            },

            maintenance: {
                name: "🔧 Équipe Maintenance",
                sprints: [
                    { name: "Semaine 1", velocity: 12, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Résolution bugs critiques et amélioration stabilité" },
                    { name: "Semaine 2", velocity: 15, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Mise à jour dépendances et refactoring code legacy" },
                    { name: "Semaine 3", velocity: 10, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Support utilisateurs et corrections mineures" },
                    { name: "Semaine 4", velocity: 18, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Amélioration documentation et automatisation tests" },
                    { name: "Semaine 5", velocity: 14, startDate: "2025-06-30", endDate: "2025-07-06", goal: "Optimisation base de données et monitoring" },
                    { name: "Semaine 6", velocity: 16, startDate: "2025-07-07", endDate: "2025-07-13", goal: "Nouvelles fonctionnalités mineures et UX" }
                ],
                events: [
                    { type: "daily", title: "Daily Standup", date: "2025-06-30", time: "09:00", duration: 15, recurring: true },
                    { type: "backlog_refinement", title: "Refinement - Tickets Support", date: "2025-07-02", time: "14:00", duration: 60 },
                    { type: "backlog_refinement", title: "Refinement - Améliorations", date: "2025-07-05", time: "14:00", duration: 60 },
                    { type: "retrospective", title: "Retrospective Mensuelle", date: "2025-07-06", time: "15:00", duration: 90, description: "Rétrospective du mois avec actions d'amélioration" }
                ],
                team: [
                    {
                        id: 1,
                        name: "Carlos",
                        role: "Full Stack",
                        capacity: 100,
                        skills: ["PHP", "MySQL", "JS", "Support", "WordPress"]
                    },
                    {
                        id: 2,
                        name: "Nina",
                        role: "Support",
                        capacity: 100,
                        skills: ["Debugging", "SQL", "Customer Support", "Documentation"]
                    }
                ],
                annotationsTemplate: [
                    { sprintIndex: 2, type: "vacation", text: "Carlos en congés une semaine" },
                    { sprintIndex: 3, type: "incident", text: "Pic de tickets support - Black Friday" },
                    { sprintIndex: 4, type: "process", text: "Nouveau système de ticketing" },
                    { sprintIndex: 5, type: "training", text: "Formation Nina sur nouvelle stack" }
                ],
                qualityMetrics: { bugRate: 8, testCoverage: 60 },
                settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
            }
        };

        const template = templates[templateType];
        if (!template) {
            console.error('Template non trouvé:', templateType);
            this.showNotification('❌ Template non trouvé', 'error');
            return;
        }

        console.log('📋 Chargement template:', template.name);

        try {
            // 1. Créer les sprints avec des IDs uniques
            const baseId = Date.now();
            const sprints = template.sprints.map((sprint, index) => ({
                ...sprint,
                id: baseId + index, // IDs séquentiels pour éviter les conflits
                timestamp: new Date().toISOString()
            }));

            console.log('📊 Sprints créés:', sprints.map(s => ({ id: s.id, name: s.name })));

            // 2. Créer les annotations avec les bons sprintId
            const annotations = template.annotationsTemplate.map((annotationTemplate, index) => {
                const targetSprint = sprints[annotationTemplate.sprintIndex];
                if (!targetSprint) {
                    console.warn('⚠️ Sprint non trouvé pour annotation index:', annotationTemplate.sprintIndex);
                    return null;
                }

                return {
                    id: baseId + 1000 + index, // ID unique pour annotation
                    type: annotationTemplate.type,
                    sprintId: targetSprint.id, // Utiliser l'ID réel du sprint créé
                    text: annotationTemplate.text,
                    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Date aléatoire dans les 30 derniers jours
                };
            }).filter(Boolean); // Supprimer les annotations null

            console.log('📝 Annotations créées:', annotations.map(a => ({
                id: a.id,
                sprintId: a.sprintId,
                sprintName: sprints.find(s => s.id === a.sprintId)?.name,
                type: a.type
            })));

            // 3. Générer les données de mood tracking avec les vrais membres
            const moodTracking = this.generateMoodData(30, template.team);

            // 4. Créer les événements avec des IDs uniques
            const events = (template.events || []).map((event, index) => ({
                ...event,
                id: baseId + 2000 + index, // ID unique pour événement
                session_id: this.sessionId || 'local',
                sprint_id: sprints.find(s => s.endDate >= event.date)?.id || null
            }));

            console.log('📅 Événements créés:', events.map(e => ({
                id: e.id,
                type: e.type,
                title: e.title,
                date: e.date
            })));

            // 5. Copier toutes les données du template
            Object.assign(this.data, {
                sprints: sprints,
                team: template.team.map(member => ({ ...member })), // Clone pour éviter les références
                annotations: annotations,
                moodTracking: moodTracking,
                events: events,
                qualityMetrics: { ...template.qualityMetrics },
                settings: { ...this.data.settings, ...template.settings }
            });

            // 6. Mettre à jour l'interface
            const frameworkSelect = document.getElementById('frameworkMode');
            if (frameworkSelect) {
                frameworkSelect.value = template.settings.framework;
            }

            // 7. Sauvegarder et rendre
            this.saveToStorage();
            this.renderAll();

            // 8. Fermer modal et notifier
            document.getElementById('templatesModal').style.display = 'none';

            this.showNotification(`✅ Template "${template.name}" chargé avec succès !`, 'success');

            // 9. Debug info
            console.log('✅ Template chargé:', {
                sprints: this.data.sprints.length,
                annotations: this.data.annotations.length,
                events: this.data.events.length,
                team: this.data.team.length,
                framework: this.data.settings.framework
            });

            // 9. Vérifier la cohérence
            this.validateTemplateData();

        } catch (error) {
            console.error('Erreur chargement template:', error);
            this.showNotification('❌ Erreur lors du chargement du template', 'error');
        }
    }

    /**
     * Génération de données de mood réalistes
     */
    generateMoodData(days, teamMembers = []) {
        const moods = [];

        // Si pas de membres fournis, retourner tableau vide
        if (!teamMembers || teamMembers.length === 0) {
            return moods;
        }

        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Générer mood pour chaque membre d'équipe
            teamMembers.forEach((member, index) => {
                const weekDay = date.getDay();

                // Patterns réalistes : lundi plus bas, vendredi plus haut
                let baseScore = 2; // Score moyen
                if (weekDay === 1) baseScore = 1.8; // Lundi
                if (weekDay === 5) baseScore = 2.7; // Vendredi
                if (weekDay === 0 || weekDay === 6) return; // Pas de weekend

                // Variation individuelle basée sur l'index du membre
                const personalVariation = (index % 3) * 0.2 - 0.2; // -0.2, 0, +0.2

                // Variation aléatoire
                const randomVariation = (Math.random() - 0.5) * 0.6;

                const finalScore = baseScore + personalVariation + randomVariation;
                const score = Math.max(1, Math.min(3, Math.round(finalScore)));

                moods.push({
                    id: Date.now() + Math.random(),
                    date: date.toISOString().split('T')[0],
                    score: score,
                    memberId: member.id,
                    memberName: member.name,
                    comment: score === 1 ? 'Journée difficile' : score === 3 ? 'Super journée !' : '',
                    timestamp: new Date(date).toISOString()
                });
            });
        }

        return moods;
    }

    /**
     * Validation de la cohérence des données du template
     */
    validateTemplateData() {
        const issues = [];

        // Vérifier que chaque annotation a un sprint correspondant
        (this.data.annotations || []).forEach(annotation => {
            const sprint = this.data.sprints.find(s => s.id === annotation.sprintId);
            if (!sprint) {
                issues.push(`Annotation "${annotation.text}" référence un sprint inexistant (ID: ${annotation.sprintId})`);
            }
        });

        // Vérifier les données d'équipe
        (this.data.team || []).forEach(member => {
            if (!member.name || !member.role) {
                issues.push(`Membre d'équipe avec données incomplètes: ${JSON.stringify(member)}`);
            }
        });

        // Vérifier les sprints
        (this.data.sprints || []).forEach(sprint => {
            if (!sprint.name || typeof sprint.velocity !== 'number') {
                issues.push(`Sprint avec données incomplètes: ${JSON.stringify(sprint)}`);
            }
        });

        if (issues.length > 0) {
            console.warn('⚠️ Problèmes de cohérence détectés:', issues);
            this.showNotification(`⚠️ ${issues.length} problème(s) de données détecté(s)`, 'warning');
        } else {
            console.log('✅ Validation template réussie - Toutes les données sont cohérentes');
        }

        return issues;
    }

    /**
     * ========================================
     * IMPORT/EXPORT
     * ========================================
     */

    importCSV(file) {
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const sprints = results.data
                    .filter(row => row.Sprint && row.Velocity)
                    .map((row, index) => ({
                        id: Date.now() + index,
                        name: row.Sprint || `Sprint ${index + 1}`,
                        velocity: parseInt(row.Velocity) || 0,
                        endDate: row.EndDate || new Date().toISOString().split('T')[0],
                        timestamp: new Date().toISOString()
                    }));

                this.data.sprints = sprints;
                this.saveToStorage();
                this.renderAll();
                this.checkAchievements();

                document.getElementById('importModal').style.display = 'none';
                this.showNotification(`${sprints.length} sprints importés avec succès !`);
            },
            error: (error) => {
                this.showNotification("Erreur lors de l'import du fichier CSV", 'error');
            }
        });
    }

    importJSON(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };

                document.getElementById('frameworkMode').value = this.data.settings.framework;

                this.saveToStorage();
                this.renderAll();
                this.checkAchievements();

                document.getElementById('importModal').style.display = 'none';
                this.showNotification("Données JSON importées avec succès !");
            } catch (error) {
                this.showNotification("Fichier JSON invalide", 'error');
            }
        };
        reader.readAsText(file);
    }

    async importFromJira() {
        const jiraConfig = {
            url: document.getElementById('jiraUrl').value,
            token: document.getElementById('jiraToken').value,
            project: document.getElementById('jiraProject').value
        };

        if (!jiraConfig.url || !jiraConfig.token || !jiraConfig.project) {
            this.showNotification('Veuillez remplir tous les champs JIRA', 'warning');
            return;
        }

        try {
            // Simulation d'import JIRA (en réalité, cela nécessiterait un proxy côté serveur)
            this.showNotification('Import JIRA en cours...', 'info');

            // Simulation de données JIRA
            setTimeout(() => {
                const mockSprints = [
                    { name: "PROJ Sprint 1", velocity: 21, endDate: "2025-06-01" },
                    { name: "PROJ Sprint 2", velocity: 25, endDate: "2025-06-15" },
                    { name: "PROJ Sprint 3", velocity: 19, endDate: "2025-06-29" }
                ];

                const sprints = mockSprints.map((sprint, index) => ({
                    ...sprint,
                    id: Date.now() + index,
                    source: 'jira',
                    timestamp: new Date().toISOString()
                }));

                this.data.sprints.push(...sprints);
                this.saveToStorage();
                this.renderAll();

                document.getElementById('importModal').style.display = 'none';
                this.showNotification(`${sprints.length} sprints JIRA importés !`);
            }, 2000);

        } catch (error) {
            this.showNotification('Erreur connexion JIRA: ' + error.message, 'error');
        }
    }

    exportData() {
        // Ouvrir la modal d'export
        this.openModal('exportModal');
    }

    downloadExportFile() {
        const exportData = {
            sprints: this.data.sprints,
            team: this.data.team,
            annotations: this.data.annotations,
            moodTracking: this.data.moodTracking,
            events: this.data.events,
            stories: this.data.stories,
            settings: this.data.settings,
            achievements: this.data.achievements,
            exportDate: new Date().toISOString(),
            version: "2.0"
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `velocity-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);

        // Fermer la modal
        document.getElementById('exportModal').style.display = 'none';

        this.showNotification('✅ Données exportées avec succès !');
    }

    /**
     * ========================================
     * PARTAGE PUBLIC
     * ========================================
     */

    async generatePublicUrl() {
        const publicData = {
            charts: this.getChartsData(),
            kpis: this.getKPIsData(),
            framework: this.data.settings.framework,
            teamSize: (this.data.team || []).length,
            timestamp: new Date().toISOString()
        };

        const encoded = btoa(JSON.stringify(publicData));
        const baseUrl = window.location.origin + window.location.pathname;
        const publicUrl = `${baseUrl}?share=${encoded}`;

        document.getElementById('publicUrl').value = publicUrl;

        // Afficher la zone de résultat
        document.getElementById('urlResult').style.display = 'block';

        // Copie avec fallback pour compatibilité
        try {
            // Méthode moderne
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(publicUrl);
                this.showNotification('✅ URL copiée dans le presse-papier !');
            } else {
                // Fallback pour navigateurs plus anciens
                this.fallbackCopyToClipboard(publicUrl);
                this.showNotification('✅ URL générée - Sélectionnez et copiez manuellement');
            }
        } catch (err) {
            console.warn('Erreur copie clipboard:', err);
            this.fallbackCopyToClipboard(publicUrl);
            this.showNotification('⚠️ URL générée - Copiez manuellement le lien ci-dessous');
        }
    }

    // Fallback pour copie manuelle
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            console.log('✅ Copie fallback réussie');
        } catch (err) {
            console.warn('❌ Copie fallback échouée:', err);
        }

        document.body.removeChild(textArea);

        // Sélectionner le champ URL pour copie manuelle
        const urlField = document.getElementById('publicUrl');
        urlField.select();
        urlField.focus();
    }

    getChartsData() {
        return this.data.sprints.map(s => ({
            name: s.name.replace(/\d+/g, 'X'), // Masquer numéros
            velocity: s.velocity,
            month: new Date(s.endDate).getMonth()
        }));
    }

    getKPIsData() {
        const velocities = this.data.sprints.map(s => s.velocity);
        return {
            avgVelocity: velocities.length > 0 ? Math.round(velocities.reduce((sum, v) => sum + v, 0) / velocities.length) : 0,
            variance: this.calculateVariance(velocities),
            sprintCount: velocities.length
        };
    }

    loadSharedData() {
        const urlParams = new URLSearchParams(window.location.search);
        const shared = urlParams.get('share');

        if (shared) {
            try {
                const data = JSON.parse(atob(shared));
                this.renderSharedView(data);
            } catch (e) {
                console.error('URL partagée invalide');
            }
        }
    }

    renderSharedView(data) {
        // Mode lecture seule pour affichage public
        document.querySelector('.action-bar').style.display = 'none';
        document.getElementById('chartTitle').textContent = `📊 Dashboard Partagé - ${data.framework.toUpperCase()}`;

        // Afficher données publiques seulement
        this.showNotification('Vue publique - Données anonymisées', 'info');
    }

    /**
     * ========================================
     * CASINO STORY POINTS
     * ========================================
     */

    initFullCasino() {
        // Initialiser avec des stories par défaut si vide
        if (!this.data.stories || this.data.stories.length === 0) {
            this.data.stories = [
                {
                    id: Date.now() + 1,
                    title: "Login social OAuth",
                    description: "Intégration Google/GitHub/LinkedIn",
                    complexity: "?",
                    estimate: null,
                    created: new Date().toISOString()
                },
                {
                    id: Date.now() + 2,
                    title: "Dashboard analytics",
                    description: "Métriques temps réel avec Chart.js",
                    complexity: "?",
                    estimate: null,
                    created: new Date().toISOString()
                },
                {
                    id: Date.now() + 3,
                    title: "Notifications push",
                    description: "Alerts mobiles et desktop",
                    complexity: "?",
                    estimate: null,
                    created: new Date().toISOString()
                }
            ];
            this.saveToStorage();
        }

        this.casinoSession = {
            currentStory: 0,
            estimates: {},
            revealed: false
        };
    }



    renderFullCasino() {
        const container = document.getElementById('casinoMainContainer');
        const stories = this.data.stories || [];

        if (stories.length === 0) {
            container.innerHTML = `
                <div class="casino-empty">
                    <h3>🎰 Aucune User Story à estimer</h3>
                    <p>Ajoutez des User Stories pour commencer les estimations collaboratives</p>
                    <button onclick="document.getElementById('addStoryBtn').click()" class="btn btn-primary" style="margin-top: 1rem;">
                        ➕ Ajouter une User Story
                    </button>
                </div>
            `;
            return;
        }

        const currentStory = stories[this.casinoSession.currentStory];
        const userName = this.data.settings.userName || 'Utilisateur';

        container.innerHTML = `
            <div class="casino-container-full">
                <div class="casino-header-full">
                    <div class="casino-progress">
                        <span>Story ${this.casinoSession.currentStory + 1} / ${stories.length}</span>
                    </div>
                    <div class="casino-user">
                        <span>👤 ${userName}</span>
                        <button onclick="window.velocityTool.changeUserName()" class="btn-small btn-secondary">✏️</button>
                    </div>
                </div>
                
                <div class="story-card-large">
                    <h3>${currentStory.title}</h3>
                    <p>${currentStory.description}</p>
                </div>
                
                <div class="estimation-zone-full">
                    <h4>Sélectionnez votre estimation :</h4>
                    <div class="fibonacci-cards">
                        ${[1, 2, 3, 5, 8, 13, 21, 34].map(point => `
                            <div class="poker-card ${this.casinoSession.estimates[userName] === point ? 'selected' : ''}" 
                                 data-points="${point}" 
                                 onclick="window.velocityTool.estimateStoryFull(${point})">
                                <span class="card-value">${point}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${this.casinoSession.estimates[userName] ? `
                    <div class="estimation-result">
                        <p>✅ Votre estimation : <strong>${this.casinoSession.estimates[userName]} points</strong></p>
                        ${this.casinoSession.revealed ? `
                            <div class="consensus-info">
                                <p>📊 Résultat final : <strong>${currentStory.estimate || '?'} points</strong></p>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="casino-controls-full">
                    <div class="casino-navigation">
                        <button onclick="window.velocityTool.previousStoryFull()" 
                                class="btn btn-secondary" 
                                ${this.casinoSession.currentStory === 0 ? 'disabled' : ''}>
                            ⬅️ US Précédente
                        </button>
                        <button onclick="window.velocityTool.nextStoryFull()" 
                                class="btn btn-secondary"
                                ${this.casinoSession.currentStory >= stories.length - 1 ? 'disabled' : ''}>
                            ➡️ US Suivante
                        </button>
                    </div>
                    <div class="casino-actions">
                        ${this.casinoSession.estimates[userName] && !this.casinoSession.revealed ? `
                            <button onclick="window.velocityTool.saveEstimate()" class="btn btn-success">
                                💾 Enregistrer l'estimation
                            </button>
                        ` : ''}
                        <button onclick="window.velocityTool.resetEstimates()" class="btn btn-secondary">
                            🔄 Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    changeUserName() {
        const currentName = this.data.settings.userName || 'Utilisateur';
        const newName = prompt('Votre nom :', currentName);

        if (newName && newName.trim()) {
            this.data.settings.userName = newName.trim();
            this.saveToStorage();
            this.renderFullCasino();
            this.showNotification(`✅ Nom changé en "${newName.trim()}"`);
        }
    }

    estimateStoryFull(points) {
        const userName = this.data.settings.userName || 'Utilisateur';

        // Animation sélection carte
        document.querySelectorAll('.poker-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-points="${points}"]`).classList.add('selected');

        this.casinoSession.estimates[userName] = points;
        this.renderFullCasino();
        this.showNotification(`Estimation ${points} enregistrée !`);
    }

    async saveEstimate() {
        const userName = this.data.settings.userName || 'Utilisateur';
        const estimate = this.casinoSession.estimates[userName];

        if (!estimate) {
            this.showNotification('⚠️ Veuillez sélectionner une estimation', 'warning');
            return;
        }

        const currentStory = this.data.stories[this.casinoSession.currentStory];

        // Initialiser le tableau des estimations si nécessaire
        if (!currentStory.estimates) {
            currentStory.estimates = {};
        }

        // Sauvegarder l'estimation de cet utilisateur
        currentStory.estimates[userName] = {
            points: estimate,
            timestamp: new Date().toISOString()
        };

        // Mettre à jour l'estimation principale (dernière ou moyenne)
        currentStory.estimate = estimate;
        currentStory.estimatedBy = userName;
        currentStory.estimatedAt = new Date().toISOString();

        this.casinoSession.revealed = true;

        // Sauvegarder dans PocketBase si disponible
        if (typeof updateStoryInPocketBase !== 'undefined') {
            await updateStoryInPocketBase(currentStory);
        }

        this.saveToStorage();
        this.renderFullCasino();
        this.showNotification(`✅ Estimation enregistrée : ${estimate} points`);
        this.checkAchievements();
    }

    resetEstimates() {
        this.casinoSession.estimates = {};
        this.casinoSession.revealed = false;
        this.renderFullCasino();
        this.showNotification('🔄 Estimations réinitialisées');
    }

    nextStoryFull() {
        const stories = this.data.stories || [];

        if (this.casinoSession.currentStory < stories.length - 1) {
            this.casinoSession.currentStory++;
            this.casinoSession.estimates = {};
            this.casinoSession.revealed = false;
            this.renderFullCasino();
        } else {
            this.showNotification('✅ Dernière story atteinte', 'info');
        }
    }

    previousStoryFull() {
        if (this.casinoSession.currentStory > 0) {
            this.casinoSession.currentStory--;
            this.casinoSession.estimates = {};
            this.casinoSession.revealed = false;
            this.renderFullCasino();
        } else {
            this.showNotification('✅ Première story atteinte', 'info');
        }
    }

    /**
     * ========================================
     * GESTION DES ÉVÉNEMENTS DE PLANNING
     * ========================================
     */

    openAddEventModal() {
        // Réinitialiser le mode édition
        this.editingEventId = null;

        // Restaurer le titre et les boutons de la modal
        const modal = document.getElementById('addEventModal');
        const title = modal.querySelector('h2');
        const submitBtn = modal.querySelector('button[type="submit"]');
        const deleteBtn = document.getElementById('deleteEventBtn');

        title.textContent = '📅 Ajouter un Événement';
        submitBtn.textContent = 'Ajouter';
        deleteBtn.style.display = 'none';

        // Réinitialiser le formulaire
        document.getElementById('addEventForm').reset();

        // Réinitialiser les options de récurrence
        document.getElementById('recurrenceType').value = 'none';
        document.getElementById('recurrenceOptions').style.display = 'none';
        document.getElementById('recurrenceDaysGroup').style.display = 'none';
        document.getElementById('recurrenceIntervalGroup').style.display = 'none';
        document.getElementById('recurrenceInterval').value = '1';

        // Réinitialiser les boutons d'intervalle
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.interval === '1') {
                btn.classList.add('active');
            }
        });

        document.querySelectorAll('input[name="recurrenceDays"]').forEach(cb => {
            cb.checked = false;
        });

        const select = document.getElementById('eventType');
        const isScrum = this.data.settings.framework === 'scrum';

        // Types d'événements selon le framework
        const scrumEvents = [
            { value: 'daily', label: '🌅 Daily Standup' },
            { value: 'sprint_planning', label: '📋 Sprint Planning' },
            { value: 'backlog_refinement', label: '🔍 Backlog Refinement' },
            { value: 'sprint_review', label: '🎯 Sprint Review' },
            { value: 'sprint_retrospective', label: '🔄 Sprint Retrospective' }
        ];

        const kanbanEvents = [
            { value: 'daily', label: '🌅 Daily Standup' },
            { value: 'backlog_refinement', label: '🔍 Backlog Refinement' },
            { value: 'retrospective', label: '🔄 Retrospective' }
        ];

        const events = isScrum ? scrumEvents : kanbanEvents;

        select.innerHTML = events.map(e =>
            `<option value="${e.value}">${e.label}</option>`
        ).join('');

        // Pré-remplir avec la date du jour
        document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('eventTime').value = this.data.settings.dailyTime || '09:00';

        this.openModal('addEventModal');
    }

    async addPlanningEvent() {
        const title = document.getElementById('eventTitle').value.trim();

        if (!title) {
            this.showNotification('⚠️ Le titre est requis', 'warning');
            return;
        }

        // Mode édition ou ajout
        if (this.editingEventId) {
            // Mise à jour d'un événement existant
            const event = this.data.events.find(e => e.id === this.editingEventId);
            if (event) {
                event.type = document.getElementById('eventType').value;
                event.title = title;
                event.date = document.getElementById('eventDate').value;
                event.time = document.getElementById('eventTime').value;
                event.duration = parseInt(document.getElementById('eventDuration').value) || null;
                event.description = document.getElementById('eventDescription').value.trim();
                event.updated = new Date().toISOString();

                // Mettre à jour les informations de récurrence
                const recurrenceType = document.getElementById('recurrenceType').value;
                event.recurrence_type = recurrenceType;
                event.recurring = recurrenceType !== 'none';

                if (recurrenceType !== 'none') {
                    event.recurrence_interval = parseInt(document.getElementById('recurrenceInterval').value) || 1;
                    event.recurrence_end_date = document.getElementById('recurrenceEndDate').value || null;

                    // Pour weekly, récupérer les jours sélectionnés
                    if (recurrenceType === 'weekly') {
                        const selectedDays = Array.from(document.querySelectorAll('input[name="recurrenceDays"]:checked'))
                            .map(cb => parseInt(cb.value));
                        event.recurrence_days = selectedDays;
                    } else {
                        event.recurrence_days = [];
                    }
                } else {
                    event.recurrence_interval = 1;
                    event.recurrence_days = [];
                    event.recurrence_end_date = null;
                }

                // Mettre à jour dans PocketBase si disponible
                if (typeof updateEventInPocketBase !== 'undefined') {
                    await updateEventInPocketBase(event);
                }

                this.showNotification(`✅ Événement "${event.title}" mis à jour`);
            }

            // Réinitialiser le mode édition
            this.editingEventId = null;

            // Restaurer le titre et le bouton de la modal
            const modal = document.getElementById('addEventModal');
            const modalTitle = modal.querySelector('h2');
            const submitBtn = modal.querySelector('button[type="submit"]');
            modalTitle.textContent = '📅 Ajouter un Événement';
            submitBtn.textContent = 'Ajouter';
        } else {
            // Ajout d'un nouvel événement
            const recurrenceType = document.getElementById('recurrenceType').value;

            const event = {
                id: Date.now(),
                type: document.getElementById('eventType').value,
                title: title,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                duration: parseInt(document.getElementById('eventDuration').value) || null,
                description: document.getElementById('eventDescription').value.trim(),
                recurring: recurrenceType !== 'none',
                recurrence_type: recurrenceType,
                created: new Date().toISOString()
            };

            if (recurrenceType !== 'none') {
                event.recurrence_interval = parseInt(document.getElementById('recurrenceInterval').value) || 1;
                event.recurrence_end_date = document.getElementById('recurrenceEndDate').value || null;

                // Pour weekly, récupérer les jours sélectionnés
                if (recurrenceType === 'weekly') {
                    const selectedDays = Array.from(document.querySelectorAll('input[name="recurrenceDays"]:checked'))
                        .map(cb => parseInt(cb.value));
                    event.recurrence_days = selectedDays;
                } else {
                    event.recurrence_days = [];
                }
            } else {
                event.recurrence_interval = 1;
                event.recurrence_days = [];
                event.recurrence_end_date = null;
            }

            this.data.events = this.data.events || [];
            this.data.events.push(event);

            // Sauvegarder dans PocketBase si disponible
            if (typeof saveEventToPocketBase !== 'undefined') {
                await saveEventToPocketBase(event);
            }

            this.showNotification(`✅ Événement "${event.title}" ajouté`);
        }

        this.saveToStorage();
        this.renderPlanningEvents();

        document.getElementById('addEventModal').style.display = 'none';
        document.getElementById('addEventForm').reset();
    }

    // Fonction helper pour calculer la prochaine occurrence d'un événement récurrent
    getNextOccurrence(event) {
        if (!event.recurring || event.recurrence_type === 'none') {
            return new Date(event.date);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(event.date);
        const endDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : null;

        let currentDate = new Date(startDate);
        const interval = event.recurrence_interval || 1;

        // Si la date de début est dans le futur, la retourner
        if (startDate >= today) {
            return startDate;
        }

        // Calculer la prochaine occurrence selon le type de récurrence
        if (event.recurrence_type === 'daily') {
            const daysDiff = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
            const nextOccurrence = Math.ceil(daysDiff / interval) * interval;
            currentDate.setDate(startDate.getDate() + nextOccurrence);
        } else if (event.recurrence_type === 'weekly') {
            const recurrenceDays = event.recurrence_days || [];
            // Trouver le prochain jour de la semaine correspondant
            while (currentDate < today || (recurrenceDays.length > 0 && !recurrenceDays.includes(currentDate.getDay()))) {
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate >= today && recurrenceDays.includes(currentDate.getDay())) {
                    break;
                }
            }
        }

        // Vérifier si on a dépassé la date de fin
        if (endDate && currentDate > endDate) {
            return new Date(event.date); // Retourner la date originale si dépassée
        }

        return currentDate;
    }

    renderPlanningTimeline() {
        const container = document.getElementById('planningTimeline');
        if (!container) return;

        const events = this.data.events || [];
        if (events.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';

        // Calculer la durée basée sur le premier sprint ou par défaut 3 semaines
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let numberOfWeeks = 3; // Par défaut
        const firstSprint = this.data.sprints && this.data.sprints.length > 0 ? this.data.sprints[0] : null;

        if (firstSprint && firstSprint.duration) {
            numberOfWeeks = Math.ceil(firstSprint.duration / 7);
            numberOfWeeks = Math.max(1, Math.min(4, numberOfWeeks)); // Entre 1 et 4 semaines
        }

        const totalDays = numberOfWeeks * 7;
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + totalDays - 1);

        // Générer les jours
        const days = [];
        for (let i = 0; i < totalDays; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            days.push(date);
        }

        // Grouper les événements par date (en utilisant la prochaine occurrence)
        const eventsByDate = {};
        events.forEach(event => {
            const eventDate = this.getNextOccurrence(event);
            eventDate.setHours(0, 0, 0, 0);
            const dateKey = eventDate.toISOString().split('T')[0];
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });

        // Générer les semaines dynamiquement
        const weeks = [];
        for (let i = 0; i < numberOfWeeks; i++) {
            weeks.push({
                label: `Semaine ${i + 1}`,
                start: i * 7,
                end: Math.min((i + 1) * 7 - 1, totalDays - 1)
            });
        }

        const weeksHTML = weeks.map(week => {
            const startDate = days[week.start];
            const endDate = days[week.end];
            return `
                <div class="timeline-week">
                    <div class="timeline-week-label">${week.label}</div>
                    <div class="timeline-week-dates">
                        ${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}
                    </div>
                </div>
            `;
        }).join('');

        // Générer la grille de jours
        const daysHTML = days.map((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const dayEvents = eventsByDate[dateKey] || [];
            const isToday = date.toDateString() === today.toDateString();
            const hasEvents = dayEvents.length > 0;
            const hasMultiple = dayEvents.length > 1;

            let classes = 'timeline-day';
            if (isToday) classes += ' today';
            if (hasEvents) classes += ' has-events';
            if (hasMultiple) classes += ' has-multiple';

            const dayLabel = date.getDate();
            const eventTitles = dayEvents.map(e => `• ${e.title}`).join('\n');
            const title = hasEvents ? eventTitles : `${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`;

            // Détecter les week-ends (samedi = 6, dimanche = 0)
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            if (isWeekend) classes += ' weekend';

            // Obtenir la première lettre du jour de la semaine
            const dayLetters = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
            const dayLetter = dayLetters[date.getDay()];

            return `
                <div class="${classes}" title="${title}" onclick="window.velocityTool.showDayEvents('${dateKey}')">
                    <span class="timeline-day-label">${dayLabel}</span>
                    <span class="timeline-day-letter">${dayLetter}</span>
                    ${hasMultiple ? `<span class="timeline-day-count">${dayEvents.length}</span>` : ''}
                </div>
            `;
        }).join('');

        // Calculer le range de dates
        const startDateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        const endDateStr = endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

        container.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">📊 Timeline des événements</span>
                <span class="timeline-range">${startDateStr} - ${endDateStr}</span>
            </div>
            <div class="timeline-weeks">${weeksHTML}</div>
            <div class="timeline-grid">${daysHTML}</div>
            <div class="timeline-legend">
                <div class="timeline-legend-item">
                    <div class="timeline-legend-box" style="background: #f8f9fa;"></div>
                    <span>Aucun événement</span>
                </div>
                <div class="timeline-legend-item">
                    <div class="timeline-legend-box" style="background: linear-gradient(135deg, var(--primary), #1976D2);"></div>
                    <span>1 événement</span>
                </div>
                <div class="timeline-legend-item">
                    <div class="timeline-legend-box" style="background: linear-gradient(135deg, #FF9800, #F57C00);"></div>
                    <span>Plusieurs événements</span>
                </div>
                <div class="timeline-legend-item">
                    <div class="timeline-legend-box" style="background: white; border: 2px solid var(--success);"></div>
                    <span>Aujourd'hui</span>
                </div>
            </div>
        `;
    }

    showDayEvents(dateKey) {
        const events = (this.data.events || []).filter(e => e.date === dateKey);
        if (events.length === 0) return;

        const date = new Date(dateKey);
        const dateStr = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const eventTypes = {
            daily: { icon: '🌅', label: 'Daily Standup', color: '#2196F3' },
            sprint_planning: { icon: '📋', label: 'Sprint Planning', color: '#9C27B0' },
            backlog_refinement: { icon: '🔍', label: 'Backlog Refinement', color: '#FF9800' },
            sprint_review: { icon: '🎯', label: 'Sprint Review', color: '#4CAF50' },
            sprint_retrospective: { icon: '🔄', label: 'Sprint Retrospective', color: '#F44336' },
            retrospective: { icon: '🔄', label: 'Retrospective', color: '#F44336' }
        };

        const eventsHTML = events.map(event => {
            const typeInfo = eventTypes[event.type];
            return `
                <div style="padding: 0.5rem; background: #f8f9fa; border-radius: 6px; margin-bottom: 0.5rem; border-left: 3px solid ${typeInfo.color};">
                    <div style="font-weight: 600; color: ${typeInfo.color}; margin-bottom: 0.25rem;">
                        ${typeInfo.icon} ${typeInfo.label}
                    </div>
                    <div style="font-size: 0.9rem; margin-bottom: 0.25rem;">${event.title}</div>
                    <div style="font-size: 0.8rem; color: #666;">
                        ${event.time ? `🕐 ${event.time}` : ''} 
                        ${event.duration ? `⏱️ ${event.duration} min` : ''}
                    </div>
                    ${event.description ? `<div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">${event.description}</div>` : ''}
                </div>
            `;
        }).join('');

        const message = `
            <div style="max-width: 400px;">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">📅 ${dateStr}</h3>
                <div style="margin-bottom: 1rem; font-weight: 600;">${events.length} événement${events.length > 1 ? 's' : ''} :</div>
                ${eventsHTML}
            </div>
        `;

        // Utiliser une notification personnalisée ou une modal simple
        this.showCustomNotification(message);
    }

    showCustomNotification(htmlContent) {
        // Créer une modal temporaire pour afficher les événements du jour
        const existingModal = document.getElementById('dayEventsModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'dayEventsModal';
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="document.getElementById('dayEventsModal').remove()">&times;</span>
                ${htmlContent}
            </div>
        `;

        document.body.appendChild(modal);

        // Fermer au clic en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    toggleTimelineView() {
        const timeline = document.getElementById('planningTimeline');
        const compactTimeline = document.getElementById('compactTimeline');
        const eventsList = document.getElementById('planningEvents');
        const toggleBtn = document.getElementById('toggleTimelineViewBtn');

        if (compactTimeline.style.display === 'none') {
            // Passer en vue compacte
            timeline.style.display = 'none';
            eventsList.style.display = 'none';
            compactTimeline.style.display = 'block';
            toggleBtn.textContent = '📋';
            toggleBtn.title = 'Vue détaillée';
            this.renderCompactTimeline();
        } else {
            // Passer en vue détaillée
            timeline.style.display = 'block';
            eventsList.style.display = 'flex';
            compactTimeline.style.display = 'none';
            toggleBtn.textContent = '📊';
            toggleBtn.title = 'Vue compacte';
        }
    }

    renderCompactTimeline() {
        const container = document.getElementById('compactTimeline');
        if (!container) return;

        const events = this.data.events || [];
        if (events.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>📅 Aucun événement planifié</p></div>';
            return;
        }

        // Trier par date et heure
        const sortedEvents = [...events].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
        });

        const eventTypes = {
            daily: { icon: '🌅', label: 'Daily', color: '#2196F3' },
            sprint_planning: { icon: '📋', label: 'Planning', color: '#9C27B0' },
            backlog_refinement: { icon: '🔍', label: 'Refinement', color: '#FF9800' },
            sprint_review: { icon: '🎯', label: 'Review', color: '#4CAF50' },
            sprint_retrospective: { icon: '🔄', label: 'Retro', color: '#F44336' },
            retrospective: { icon: '🔄', label: 'Retro', color: '#F44336' }
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventsHTML = sortedEvents.map((event, index) => {
            const typeInfo = eventTypes[event.type];
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);

            const isToday = eventDate.getTime() === today.getTime();
            const isPast = eventDate < today;
            const isFuture = eventDate > today;

            // Format date
            const dateStr = eventDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            });

            // Calculer les jours relatifs
            const diffTime = eventDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let relativeDate = '';
            if (isToday) {
                relativeDate = "Aujourd'hui";
            } else if (diffDays === 1) {
                relativeDate = 'Demain';
            } else if (diffDays === -1) {
                relativeDate = 'Hier';
            } else if (diffDays > 0 && diffDays <= 7) {
                relativeDate = `Dans ${diffDays}j`;
            } else if (diffDays < 0 && diffDays >= -7) {
                relativeDate = `Il y a ${Math.abs(diffDays)}j`;
            }

            return `
                <div class="timeline-item ${isToday ? 'timeline-today' : ''} ${isPast ? 'timeline-past' : ''}" 
                     onclick="window.velocityTool.editEvent('${event.id}')"
                     title="Cliquer pour modifier">
                    <div class="timeline-marker" style="background: ${typeInfo.color};"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-icon">${typeInfo.icon}</span>
                            <span class="timeline-title">${event.title}</span>
                            ${event.duration ? `<span class="timeline-duration">⏱️ ${event.duration}min</span>` : ''}
                        </div>
                        <div class="timeline-meta">
                            <span class="timeline-date">${dateStr}</span>
                            ${event.time ? `<span class="timeline-time">🕐 ${event.time}</span>` : ''}
                            ${relativeDate ? `<span class="timeline-relative">${relativeDate}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="vertical-timeline">
                ${eventsHTML}
            </div>
        `;
    }

    renderPlanningEvents() {
        const container = document.getElementById('planningEvents');
        if (!container) return;

        // Rendre la timeline
        this.renderPlanningTimeline();

        const events = this.data.events || [];
        const isScrum = this.data.settings.framework === 'scrum';

        if (events.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📅 Aucun événement planifié</p>
                    <p style="color: #666; font-size: 0.9rem;">Ajoutez vos événements ${isScrum ? 'Scrum' : 'Kanban'} pour visualiser votre planning</p>
                </div>
            `;
            return;
        }

        const eventTypes = {
            daily: { icon: '🌅', label: 'Daily Standup', color: '#2196F3' },
            sprint_planning: { icon: '📋', label: 'Sprint Planning', color: '#9C27B0' },
            backlog_refinement: { icon: '🔍', label: 'Backlog Refinement', color: '#FF9800' },
            sprint_review: { icon: '🎯', label: 'Sprint Review', color: '#4CAF50' },
            sprint_retrospective: { icon: '🔄', label: 'Sprint Retrospective', color: '#F44336' },
            retrospective: { icon: '🔄', label: 'Retrospective', color: '#F44336' }
        };

        // Calculer les prochaines occurrences pour les événements récurrents
        const eventsWithNextOccurrence = events.map(event => {
            const nextOccurrence = this.getNextOccurrence(event);
            console.log(`📅 Événement "${event.title}": ${event.date} → ${nextOccurrence.toISOString().split('T')[0]}`);
            return {
                ...event,
                displayDate: nextOccurrence
            };
        });

        // Trier par date et heure de la prochaine occurrence
        const sortedEvents = [...eventsWithNextOccurrence].sort((a, b) => {
            const dateA = new Date(`${a.displayDate.toISOString().split('T')[0]}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.displayDate.toISOString().split('T')[0]}T${b.time || '00:00'}`);
            return dateA - dateB;
        });

        // Date d'aujourd'hui et demain
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        container.innerHTML = sortedEvents.map(event => {
            const typeInfo = eventTypes[event.type];
            const eventDate = new Date(event.displayDate);
            eventDate.setHours(0, 0, 0, 0);

            // Déterminer si c'est aujourd'hui ou demain
            const isToday = eventDate.getTime() === today.getTime();
            const isTomorrow = eventDate.getTime() === tomorrow.getTime();
            const isPast = eventDate < today;

            // Classes CSS pour la mise en surbrillance
            let highlightClass = '';
            let highlightStyle = '';
            if (isToday) {
                highlightClass = 'event-today';
                highlightStyle = 'background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(129, 199, 132, 0.1)); border-left-width: 5px; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);';
            } else if (isTomorrow) {
                highlightClass = 'event-tomorrow';
                highlightStyle = 'background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(100, 181, 246, 0.05)); border-left-width: 4px; box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);';
            } else if (isPast) {
                highlightClass = 'event-past';
                highlightStyle = 'opacity: 0.6;';
            }

            // Format de date avec indicateur
            let dateLabel = '';
            if (isToday) {
                dateLabel = `<span style="background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">📍 Aujourd'hui</span>`;
            } else if (isTomorrow) {
                dateLabel = `<span style="background: linear-gradient(135deg, #2196F3, #42A5F5); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">➡️ Demain</span>`;
            } else {
                const date = event.displayDate.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                });
                dateLabel = `<span>📅 ${date}</span>`;
            }

            // Générer le label de récurrence avant le template
            const recurrenceLabel = event.recurring ? this.getRecurrenceLabel(event) : '';

            return `
                <div class="planning-event ${highlightClass}" style="border-left-color: ${typeInfo.color}; cursor: pointer; ${highlightStyle}" onclick="window.velocityTool.editEvent('${event.id}')">
                    <div class="event-header">
                        <span class="event-type" style="color: ${typeInfo.color};">
                            ${typeInfo.icon} ${typeInfo.label}
                        </span>
                        ${isToday || isTomorrow ? dateLabel : ''}
                    </div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        ${!isToday && !isTomorrow ? dateLabel : ''}
                        ${event.time ? `<span>🕐 ${event.time}</span>` : ''}
                        ${event.duration ? `<span>⏱️ ${event.duration} min</span>` : ''}
                        ${recurrenceLabel}
                    </div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    editEvent(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) {
            this.showNotification('Événement non trouvé', 'error');
            return;
        }

        // Stocker l'ID de l'événement en cours d'édition
        this.editingEventId = id;

        // Changer le titre et les boutons de la modal
        const modal = document.getElementById('addEventModal');
        const modalTitle = modal.querySelector('h2');
        const submitBtn = modal.querySelector('button[type="submit"]');
        const deleteBtn = document.getElementById('deleteEventBtn');

        modalTitle.textContent = '✏️ Modifier l\'Événement';
        submitBtn.textContent = '💾 Enregistrer';
        deleteBtn.style.display = 'block';

        // Remplir la liste déroulante selon le framework
        const select = document.getElementById('eventType');
        const isScrum = this.data.settings.framework === 'scrum';

        const scrumEvents = [
            { value: 'daily', label: '🌅 Daily Standup' },
            { value: 'sprint_planning', label: '📋 Sprint Planning' },
            { value: 'backlog_refinement', label: '🔍 Backlog Refinement' },
            { value: 'sprint_review', label: '🎯 Sprint Review' },
            { value: 'sprint_retrospective', label: '🔄 Sprint Retrospective' }
        ];

        const kanbanEvents = [
            { value: 'daily', label: '🌅 Daily Standup' },
            { value: 'backlog_refinement', label: '🔍 Backlog Refinement' },
            { value: 'retrospective', label: '🔄 Retrospective' }
        ];

        const events = isScrum ? scrumEvents : kanbanEvents;

        select.innerHTML = events.map(e =>
            `<option value="${e.value}">${e.label}</option>`
        ).join('');

        // Fonction helper pour formater les dates
        const formatDateForInput = (dateStr) => {
            if (!dateStr) return '';
            // Si la date contient un timestamp, extraire juste la partie date
            return dateStr.split(' ')[0].split('T')[0];
        };

        // Pré-remplir le formulaire avec les données de l'événement
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = formatDateForInput(event.date);
        document.getElementById('eventTime').value = event.time || '09:00';
        document.getElementById('eventDuration').value = event.duration || '';
        document.getElementById('eventDescription').value = event.description || '';

        // Pré-remplir les options de récurrence
        const recurrenceType = event.recurrence_type || 'none';
        const recurrenceInterval = event.recurrence_interval || 1;

        document.getElementById('recurrenceType').value = recurrenceType;
        document.getElementById('recurrenceInterval').value = recurrenceInterval;

        // Convertir la date au format yyyy-MM-dd si nécessaire
        let recurrenceEndDate = event.recurrence_end_date || '';
        if (recurrenceEndDate && recurrenceEndDate.includes('T')) {
            recurrenceEndDate = recurrenceEndDate.split('T')[0];
        }
        document.getElementById('recurrenceEndDate').value = recurrenceEndDate;

        // Gérer l'affichage des options de récurrence
        const recurrenceOptions = document.getElementById('recurrenceOptions');
        recurrenceOptions.style.display = recurrenceType !== 'none' ? 'block' : 'none';

        if (recurrenceType !== 'none') {
            // Afficher/masquer les groupes selon le type
            const recurrenceDaysGroup = document.getElementById('recurrenceDaysGroup');
            const recurrenceIntervalGroup = document.getElementById('recurrenceIntervalGroup');
            const recurrenceIntervalLabel = document.getElementById('recurrenceIntervalLabel');

            recurrenceDaysGroup.style.display = recurrenceType === 'weekly' ? 'block' : 'none';

            if (recurrenceType === 'weekly' || recurrenceType === 'monthly') {
                recurrenceIntervalGroup.style.display = 'block';
                recurrenceIntervalLabel.textContent = recurrenceType === 'weekly' ? 'semaine(s)' : 'mois';

                // Activer le bon bouton d'intervalle
                document.querySelectorAll('.interval-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (parseInt(btn.dataset.interval) === recurrenceInterval) {
                        btn.classList.add('active');
                    }
                });
            } else {
                recurrenceIntervalGroup.style.display = 'none';
            }

            // Pré-cocher les jours sélectionnés pour weekly
            if (recurrenceType === 'weekly' && event.recurrence_days) {
                document.querySelectorAll('input[name="recurrenceDays"]').forEach(cb => {
                    cb.checked = event.recurrence_days.includes(parseInt(cb.value));
                });
            }
        }

        this.openModal('addEventModal');
    }

    getRecurrenceLabel(event) {
        if (!event.recurring) return '';

        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const interval = event.recurrence_interval || 1;
        let label = '🔄 ';

        switch (event.recurrence_type) {
            case 'daily':
                label += 'Chaque jour';
                break;
            case 'weekly':
                if (interval > 1) {
                    label += `Toutes les ${interval} semaines`;
                } else {
                    label += 'Chaque semaine';
                }
                if (event.recurrence_days && event.recurrence_days.length > 0) {
                    const days = event.recurrence_days.map(d => dayNames[d]).join(', ');
                    label += ` (${days})`;
                }
                break;
            case 'monthly':
                if (interval > 1) {
                    label += `Tous les ${interval} mois`;
                } else {
                    label += 'Chaque mois';
                }
                break;
            default:
                label += 'Récurrent';
        }

        return `<span class="event-recurring">${label}</span>`;
    }

    async deleteEvent(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) return;

        if (!confirm(`Supprimer l'événement "${event.title}" ?`)) return;

        // Supprimer de PocketBase si disponible
        if (typeof deleteEventFromPocketBase !== 'undefined') {
            await deleteEventFromPocketBase(event);
        }

        this.data.events = this.data.events.filter(e => e.id !== id);
        this.saveToStorage();
        this.renderPlanningEvents();

        // Fermer la modal et réinitialiser
        document.getElementById('addEventModal').style.display = 'none';
        this.editingEventId = null;

        this.showNotification('✅ Événement supprimé');
    }

    estimateStory(points) {
        // Animation sélection carte
        document.querySelectorAll('.poker-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-points="${points}"]`).classList.add('selected');

        this.casinoSession.estimates['current_user'] = points;

        // Simulation autres membres équipe
        (this.data.team || []).forEach(member => {
            if (!this.casinoSession.estimates[member.id]) {
                setTimeout(() => {
                    this.casinoSession.estimates[member.id] = this.simulateEstimate(points);
                    this.renderCasinoStory();
                }, Math.random() * 3000);
            }
        });

        this.renderCasinoStory();
        this.showNotification(`Estimation ${points} enregistrée !`);
    }

    simulateEstimate(userEstimate) {
        // Variance réaliste autour estimation user
        const variance = [-2, -1, 0, 1, 2];
        const fibSeq = [1, 2, 3, 5, 8, 13, 21, 34];
        const userIndex = fibSeq.indexOf(userEstimate);
        const variation = variance[Math.floor(Math.random() * variance.length)];
        const newIndex = Math.max(0, Math.min(fibSeq.length - 1, userIndex + variation));
        return fibSeq[newIndex];
    }

    allEstimated() {
        const teamCount = (this.data.team || []).length;
        const estimateCount = Object.keys(this.casinoSession.estimates).length;
        return estimateCount >= teamCount + 1; // +1 pour current_user
    }

    revealEstimates() {
        if (!this.allEstimated()) return;

        const estimates = Object.values(this.casinoSession.estimates);
        const avg = estimates.reduce((sum, e) => sum + e, 0) / estimates.length;
        const consensus = estimates.every(e => e === estimates[0]);

        // Animation révélation
        document.querySelectorAll('.card-back').forEach(card => {
            const estimate = Math.floor(Math.random() * 21) + 1; // Random pour animation
            card.textContent = estimate;
            card.style.background = consensus ? '#4CAF50' : '#FF9800';
        });

        setTimeout(() => {
            const message = consensus
                ? `🎯 Consensus parfait: ${estimates[0]} points !`
                : `📊 Moyenne: ${Math.round(avg)} points (variance: ${Math.round(Math.max(...estimates) - Math.min(...estimates))})`;

            this.showNotification(message);
        }, 1000);
    }

    nextStory() {
        this.casinoSession.currentStory = (this.casinoSession.currentStory + 1) % this.casinoSession.stories.length;
        this.casinoSession.estimates = {};
        this.renderCasinoStory();
    }

    /**
     * ========================================
     * SYSTÈME D'ACHIEVEMENTS
     * ========================================
     */

    checkAchievements() {
        const achievements = [
            {
                id: 'first_sprint',
                name: '🎯 Premier Sprint',
                description: 'Ajouter votre premier sprint',
                condition: () => this.data.sprints.length >= 1
            },
            {
                id: 'consistent_performer',
                name: '📈 Performer Constant',
                description: '5 sprints avec moins de 20% de variation',
                condition: () => {
                    if (this.data.sprints.length < 5) return false;
                    const variance = this.calculateVariance(this.data.sprints.map(s => s.velocity));
                    return variance < 20;
                }
            },
            {
                id: 'velocity_hero',
                name: '🚀 Héros de Vélocité',
                description: 'Atteindre 30+ points en un sprint',
                condition: () => this.data.sprints.some(s => s.velocity >= 30)
            },
            {
                id: 'team_builder',
                name: '👥 Team Builder',
                description: 'Configurer une équipe de 3+ personnes',
                condition: () => (this.data.team || []).length >= 3
            },
            {
                id: 'annotator',
                name: '📝 Chroniqueur',
                description: 'Ajouter 5 faits marquants',
                condition: () => (this.data.annotations || []).length >= 5
            },
            {
                id: 'mood_tracker',
                name: '😊 Mood Tracker',
                description: 'Suivre son humeur pendant 7 jours',
                condition: () => (this.data.moodTracking || []).length >= 7
            },
            {
                id: 'data_master',
                name: '📊 Data Master',
                description: 'Avoir 10+ sprints d\'historique',
                condition: () => this.data.sprints.length >= 10
            },
            {
                id: 'stable_team',
                name: '🎯 Équipe Stable',
                description: 'Maintenir une variance < 15% sur 8 sprints',
                condition: () => {
                    if (this.data.sprints.length < 8) return false;
                    const variance = this.calculateVariance(this.data.sprints.map(s => s.velocity));
                    return variance < 15;
                }
            },
            {
                id: 'casino_master',
                name: '🎰 Casino Master',
                description: 'Utiliser l\'estimation collaborative',
                condition: () => Object.keys(this.casinoSession.estimates || {}).length > 0
            },
            {
                id: 'sharer',
                name: '🔗 Partage Expert',
                description: 'Générer une URL de partage',
                condition: () => document.getElementById('publicUrl').value !== ''
            }
        ];

        const unlockedAchievements = achievements.filter(a =>
            a.condition() && !this.isAchievementUnlocked(a.id)
        );

        unlockedAchievements.forEach(achievement => {
            this.unlockAchievement(achievement);
        });
    }

    isAchievementUnlocked(id) {
        return (this.data.achievements || []).some(a => a.id === id);
    }

    unlockAchievement(achievement) {
        this.data.achievements = this.data.achievements || [];
        this.data.achievements.push({
            ...achievement,
            unlockedAt: new Date().toISOString()
        });

        this.saveToStorage();
        this.showAchievementNotification(achievement);
    }

    showAchievementNotification(achievement) {
        // Supprimer les achievements existants pour éviter les chevauchements
        document.querySelectorAll('.achievement-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
                <div>
                    <strong>🏆 Achievement Débloqué!</strong>
                    <div>${achievement.name}</div>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => notification.remove(), 5000);
    }

    /**
     * ========================================
     * UTILITAIRES ET HELPERS
     * ========================================
     */

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        
        // Rafraîchir la liste des membres quand on ouvre la modal équipe
        if (modalId === 'teamModal') {
            this.renderTeamList();
        }
    }

    showNotification(message, type = 'success') {
        // Système de regroupement des notifications
        if (!this.notificationQueue) {
            this.notificationQueue = [];
            this.notificationTimer = null;
        }

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        // Ajouter à la queue
        this.notificationQueue.push({ message, type, icon: icons[type] });

        // Annuler le timer précédent
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Attendre 100ms pour regrouper les notifications
        this.notificationTimer = setTimeout(() => {
            this.displayGroupedNotifications();
        }, 100);
    }

    displayGroupedNotifications() {
        if (!this.notificationQueue || this.notificationQueue.length === 0) return;

        // Supprimer les notifications existantes de type alert pour éviter les chevauchements
        document.querySelectorAll('.alert[style*="position: fixed"]').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'alert alert-info';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 2000;
            max-width: 350px;
            animation: slideIn 0.5s ease;
        `;

        // Si une seule notification, affichage simple
        if (this.notificationQueue.length === 1) {
            const { icon, message, type } = this.notificationQueue[0];
            notification.className = `alert alert-${type}`;
            notification.textContent = `${icon} ${message}`;
        } else {
            // Plusieurs notifications : affichage groupé
            const header = document.createElement('div');
            header.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem;';
            header.textContent = `📋 ${this.notificationQueue.length} notifications`;
            notification.appendChild(header);

            this.notificationQueue.forEach(n => {
                const msgDiv = document.createElement('div');
                msgDiv.style.cssText = 'margin: 0.25rem 0;';
                msgDiv.textContent = `${n.icon} ${n.message}`;
                notification.appendChild(msgDiv);
            });
        }

        document.body.appendChild(notification);

        // Nettoyer la queue
        this.notificationQueue = [];
        this.notificationTimer = null;

        // Supprimer après 5 secondes
        setTimeout(() => notification.remove(), 5000);
    }

    /**
     * Auto-tagging et intelligence simple
     */
    autoTagStories() {
        const patterns = {
            bug: ['fix', 'bug', 'error', 'issue', 'broken'],
            feature: ['add', 'new', 'create', 'implement', 'feature'],
            refactor: ['refactor', 'clean', 'improve', 'optimize', 'restructure'],
            test: ['test', 'spec', 'coverage', 'unit', 'integration'],
            ui: ['design', 'ui', 'ux', 'interface', 'style'],
            api: ['api', 'endpoint', 'service', 'backend'],
            security: ['security', 'auth', 'permission', 'login', 'password']
        };

        (this.data.stories || []).forEach(story => {
            const text = story.title.toLowerCase();

            for (const [tag, keywords] of Object.entries(patterns)) {
                if (keywords.some(keyword => text.includes(keyword))) {
                    story.tags = story.tags || [];
                    if (!story.tags.includes(tag)) {
                        story.tags.push(tag);
                    }
                    break;
                }
            }
        });
    }

    /**
     * ========================================
     * GESTION DES PROGRAM INCREMENTS (SAFe)
     * ========================================
     */

    openPiModal() {
        this.renderPiList();
        this.openModal('piModal');
    }

    switchPiTab(tabName) {
        // Désactiver tous les onglets
        document.querySelectorAll('.pi-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.pi-tab-content').forEach(content => content.classList.remove('active'));

        // Activer l'onglet sélectionné
        document.querySelector(`.pi-tab[data-tab="${tabName}"]`).classList.add('active');
        document.querySelector(`.pi-tab-content[data-tab="${tabName}"]`).classList.add('active');
    }

    addObjective() {
        const container = document.getElementById('objectivesList');
        const index = container.children.length;

        const objectiveItem = document.createElement('div');
        objectiveItem.className = 'objective-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ex: Migrer 80% des services vers AWS';
        input.setAttribute('data-objective-index', index);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '🗑️';
        button.addEventListener('click', () => objectiveItem.remove());

        objectiveItem.appendChild(input);
        objectiveItem.appendChild(button);
        container.appendChild(objectiveItem);
    }

    addRisk() {
        const container = document.getElementById('risksList');
        const index = container.children.length;

        const riskItem = document.createElement('div');
        riskItem.className = 'risk-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ex: Dépendance équipe Infrastructure';
        input.setAttribute('data-risk-index', index);

        const select = document.createElement('select');
        select.setAttribute('data-risk-impact', index);

        const optionLow = document.createElement('option');
        optionLow.value = 'low';
        optionLow.textContent = '🟢 Faible';

        const optionMedium = document.createElement('option');
        optionMedium.value = 'medium';
        optionMedium.selected = true;
        optionMedium.textContent = '🟡 Moyen';

        const optionHigh = document.createElement('option');
        optionHigh.value = 'high';
        optionHigh.textContent = '🔴 Élevé';

        select.appendChild(optionLow);
        select.appendChild(optionMedium);
        select.appendChild(optionHigh);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '🗑️';
        button.addEventListener('click', () => riskItem.remove());

        riskItem.appendChild(input);
        riskItem.appendChild(select);
        riskItem.appendChild(button);
        container.appendChild(riskItem);
    }

    addDependency() {
        const container = document.getElementById('dependenciesList');
        const index = container.children.length;

        const dependencyItem = document.createElement('div');
        dependencyItem.className = 'dependency-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ex: Équipe Backend - API v2 prête pour Sprint 3';
        input.setAttribute('data-dependency-index', index);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '🗑️';
        button.addEventListener('click', () => dependencyItem.remove());

        dependencyItem.appendChild(input);
        dependencyItem.appendChild(button);
        container.appendChild(dependencyItem);
    }

    openPiFormModal(piId = null) {
        const modal = document.getElementById('piFormModal');
        const title = document.getElementById('piFormTitle');
        const form = document.getElementById('piForm');

        form.reset();
        document.getElementById('piId').value = '';

        // Réinitialiser les listes
        document.getElementById('objectivesList').innerHTML = '';
        document.getElementById('risksList').innerHTML = '';
        document.getElementById('dependenciesList').innerHTML = '';

        // Réinitialiser les boutons
        document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.confidence-btn').forEach(b => b.classList.remove('active'));

        // Retour au premier onglet
        this.switchPiTab('general');

        if (piId) {
            // Mode édition
            const pi = this.data.pis.find(p => p.id === piId);
            if (pi) {
                title.textContent = '✏️ Modifier le Program Increment';
                document.getElementById('piId').value = pi.id;
                document.getElementById('piName').value = pi.name;
                
                // Convertir les dates au format yyyy-MM-dd pour les champs input[type="date"]
                const formatDateForInput = (dateStr) => {
                    if (!dateStr) return '';
                    // Si la date contient déjà un timestamp, extraire juste la partie date
                    return dateStr.split(' ')[0].split('T')[0];
                };
                
                document.getElementById('piStartDate').value = formatDateForInput(pi.startDate);
                document.getElementById('piEndDate').value = formatDateForInput(pi.endDate);
                document.getElementById('piLocation').value = pi.location || '';
                document.getElementById('piComment').value = pi.comment || '';
                
                console.log('📝 Pré-remplissage PI:', {
                    name: pi.name,
                    startDate: formatDateForInput(pi.startDate),
                    endDate: formatDateForInput(pi.endDate),
                    location: pi.location,
                    comment: pi.comment
                });

                // Statut
                if (pi.status) {
                    document.getElementById('piStatus').value = pi.status;
                    const statusBtn = document.querySelector(`.status-btn[data-status="${pi.status}"]`);
                    if (statusBtn) statusBtn.classList.add('active');
                }

                // Objectifs
                if (pi.objective) {
                    const objectives = pi.objective.split('\n').filter(o => o.trim());
                    objectives.forEach(obj => {
                        this.addObjective();
                        const inputs = document.querySelectorAll('#objectivesList input');
                        inputs[inputs.length - 1].value = obj;
                    });
                }

                // Risques
                if (pi.risks && Array.isArray(pi.risks)) {
                    pi.risks.forEach(risk => {
                        this.addRisk();
                        const items = document.querySelectorAll('.risk-item');
                        const lastItem = items[items.length - 1];
                        lastItem.querySelector('input').value = risk.risk || '';
                        lastItem.querySelector('select').value = risk.impact || 'medium';
                    });
                }

                // Dépendances
                if (pi.dependencies && Array.isArray(pi.dependencies)) {
                    pi.dependencies.forEach(dep => {
                        this.addDependency();
                        const inputs = document.querySelectorAll('#dependenciesList input');
                        inputs[inputs.length - 1].value = dep;
                    });
                }

                // Vote de confiance
                if (pi.confidence_vote) {
                    document.getElementById('piConfidenceVote').value = pi.confidence_vote;
                    const confBtn = document.querySelector(`.confidence-btn[data-vote="${pi.confidence_vote}"]`);
                    if (confBtn) confBtn.classList.add('active');
                }
            }
        } else {
            // Mode création
            title.textContent = '➕ Nouveau Program Increment';
            // Statut par défaut
            document.querySelector('.status-btn[data-status="planning"]').classList.add('active');
            document.getElementById('piStatus').value = 'planning';
        }

        modal.style.display = 'block';
    }

    async savePi() {
        const piId = document.getElementById('piId').value;
        const name = document.getElementById('piName').value.trim();
        const startDate = document.getElementById('piStartDate').value;
        const endDate = document.getElementById('piEndDate').value;
        const location = document.getElementById('piLocation').value.trim();
        const comment = document.getElementById('piComment').value.trim();
        const status = document.getElementById('piStatus').value;
        const confidenceVote = document.getElementById('piConfidenceVote').value;

        // Validation
        if (!name || !startDate || !endDate) {
            this.showNotification('❌ Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            this.showNotification('❌ La date de fin doit être après la date de début', 'error');
            return;
        }

        // Récupérer les objectifs
        const objectiveInputs = document.querySelectorAll('#objectivesList input');
        const objectives = Array.from(objectiveInputs)
            .map(input => input.value.trim())
            .filter(obj => obj);
        const objectiveText = objectives.join('\n');

        // Récupérer les risques
        const riskItems = document.querySelectorAll('.risk-item');
        const risks = Array.from(riskItems).map(item => ({
            risk: item.querySelector('input').value.trim(),
            impact: item.querySelector('select').value
        })).filter(r => r.risk);

        // Récupérer les dépendances
        const dependencyInputs = document.querySelectorAll('#dependenciesList input');
        const dependencies = Array.from(dependencyInputs)
            .map(input => input.value.trim())
            .filter(dep => dep);

        // Calculer les sprints du PI
        const piSprints = this.data.sprints.filter(sprint => {
            const sprintDate = new Date(sprint.endDate);
            const piStart = new Date(startDate);
            const piEnd = new Date(endDate);
            return sprintDate >= piStart && sprintDate <= piEnd;
        }).map(s => s.id);

        if (piId) {
            // Mise à jour
            const pi = this.data.pis.find(p => p.id === piId);
            if (pi) {
                pi.name = name;
                pi.startDate = startDate;
                pi.endDate = endDate;
                pi.location = location;
                pi.comment = comment;
                pi.status = status;
                pi.objective = objectiveText;
                pi.risks = risks;
                pi.dependencies = dependencies;
                pi.confidence_vote = confidenceVote ? parseInt(confidenceVote) : null;
                pi.sprints = piSprints;
                pi.updated = new Date().toISOString();

                // Sauvegarder dans PocketBase si disponible
                if (typeof savePiToPocketBase !== 'undefined') {
                    await savePiToPocketBase(pi);
                }

                this.showNotification('✅ PI mis à jour avec succès');
            }
        } else {
            // Création
            const newPi = {
                id: Date.now().toString(),
                name,
                startDate,
                endDate,
                location,
                comment,
                status,
                objective: objectiveText,
                risks,
                dependencies,
                confidence_vote: confidenceVote ? parseInt(confidenceVote) : null,
                sprints: piSprints,
                created: new Date().toISOString()
            };
            this.data.pis.push(newPi);

            // Sauvegarder dans PocketBase si disponible
            if (typeof savePiToPocketBase !== 'undefined') {
                await savePiToPocketBase(newPi);
            }

            this.showNotification('✅ PI créé avec succès');
        }

        this.saveToStorage();
        this.renderAll();
        this.renderPiList();

        document.getElementById('piFormModal').style.display = 'none';
    }

    async deletePi(piId) {
        if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce PI ?')) {
            return;
        }

        const pi = this.data.pis.find(p => p.id === piId);

        // Supprimer de PocketBase si disponible
        if (pi && typeof deletePiFromPocketBase !== 'undefined') {
            await deletePiFromPocketBase(pi);
        }

        this.data.pis = this.data.pis.filter(p => p.id !== piId);
        this.saveToStorage();
        this.renderAll();
        this.renderPiList();
        this.showNotification('✅ PI supprimé avec succès');
    }

    /**
     * Échappe les caractères HTML pour prévenir les attaques XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderPiList() {
        const container = document.getElementById('piList');

        if (!this.data.pis || this.data.pis.length === 0) {
            container.innerHTML = `
                <div class="pi-empty-state">
                    <div class="pi-empty-state-icon">🎯</div>
                    <div class="pi-empty-state-text">Aucun Program Increment</div>
                    <div class="pi-empty-state-subtext">Créez votre premier PI pour commencer à planifier avec SAFe</div>
                </div>
            `;
            return;
        }

        // Trier les PIs par date de début (plus récent en premier)
        const sortedPis = [...this.data.pis].sort((a, b) =>
            new Date(b.startDate) - new Date(a.startDate)
        );

        container.innerHTML = sortedPis.map(pi => {
            const startDate = new Date(pi.startDate).toLocaleDateString('fr-FR');
            const endDate = new Date(pi.endDate).toLocaleDateString('fr-FR');
            const duration = Math.ceil((new Date(pi.endDate) - new Date(pi.startDate)) / (1000 * 60 * 60 * 24 * 7));
            const locationIcon = pi.location && pi.location.toLowerCase().includes('remote') ? '🏠' : '📍';
            const sprintCount = pi.sprints ? pi.sprints.length : 0;

            // Statut
            const statusLabels = {
                planning: '📝 Planning',
                active: '🚀 Actif',
                completed: '✅ Terminé'
            };
            const statusLabel = statusLabels[pi.status] || '📝 Planning';

            // Vote de confiance
            const confidenceStars = pi.confidence_vote ? '⭐'.repeat(pi.confidence_vote) : '';

            // Échapper toutes les données utilisateur pour prévenir XSS
            const safeName = this.escapeHtml(pi.name);
            const safeLocation = this.escapeHtml(pi.location);
            const safeComment = this.escapeHtml(pi.comment);

            return `
                <div class="pi-item">
                    <div class="pi-item-header">
                        <div class="pi-item-title">
                            🎯 ${safeName}
                            ${pi.location ? `<span style="font-size: 1rem;">${locationIcon}</span>` : ''}
                            <span style="font-size: 0.85rem; margin-left: 0.5rem;">${statusLabel}</span>
                        </div>
                        <div class="pi-item-actions">
                            <button class="btn-edit" onclick="window.velocityTool.openPiFormModal('${this.escapeHtml(pi.id)}')">
                                ✏️ Modifier
                            </button>
                            <button class="btn-delete" onclick="window.velocityTool.deletePi('${this.escapeHtml(pi.id)}')">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                    <div class="pi-item-meta">
                        <div class="pi-item-meta-item">
                            <span>📅</span>
                            <strong>Début:</strong> ${startDate}
                        </div>
                        <div class="pi-item-meta-item">
                            <span>🏁</span>
                            <strong>Fin:</strong> ${endDate}
                        </div>
                        <div class="pi-item-meta-item">
                            <span>⏱️</span>
                            <strong>Durée:</strong> ${duration} semaines
                        </div>
                        <div class="pi-item-meta-item">
                            <span>🏃</span>
                            <strong>Sprints:</strong> ${sprintCount}
                        </div>
                        ${pi.location ? `
                        <div class="pi-item-meta-item">
                            <span>${locationIcon}</span>
                            <strong>Lieu:</strong> ${safeLocation}
                        </div>
                        ` : ''}
                        ${pi.confidence_vote ? `
                        <div class="pi-item-meta-item">
                            <span>📊</span>
                            <strong>Confiance:</strong> ${confidenceStars} (${pi.confidence_vote}/5)
                        </div>
                        ` : ''}
                    </div>
                    ${pi.objective ? `
                    <div class="pi-item-comment">
                        <strong>🎯 Objectifs:</strong><br>
                        ${pi.objective.split('\n').map(obj => `• ${this.escapeHtml(obj)}`).join('<br>')}
                    </div>
                    ` : ''}
                    ${pi.risks && pi.risks.length > 0 ? `
                    <div class="pi-item-comment" style="border-left-color: #FF9800;">
                        <strong>⚠️ Risques (${pi.risks.length}):</strong><br>
                        ${pi.risks.map(r => {
                const impactIcon = r.impact === 'high' ? '🔴' : r.impact === 'medium' ? '🟡' : '🟢';
                return `${impactIcon} ${this.escapeHtml(r.risk)}`;
            }).join('<br>')}
                    </div>
                    ` : ''}
                    ${pi.dependencies && pi.dependencies.length > 0 ? `
                    <div class="pi-item-comment" style="border-left-color: #00BCD4;">
                        <strong>🔗 Dépendances (${pi.dependencies.length}):</strong><br>
                        ${pi.dependencies.map(dep => `• ${this.escapeHtml(dep)}`).join('<br>')}
                    </div>
                    ` : ''}
                    ${pi.comment ? `
                    <div class="pi-item-comment">
                        <strong>💬 Commentaires:</strong><br>
                        ${safeComment}
                    </div>
                    ` : ''}
                    ${sprintCount > 0 ? `
                    <div class="pi-item-sprints">
                        ${pi.sprints.map(sprintId => {
                const sprint = this.data.sprints.find(s => s.id === sprintId);
                return sprint ? `<span class="pi-sprint-badge">${this.escapeHtml(sprint.name)}</span>` : '';
            }).join('')}
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * ========================================
     * RENDU GLOBAL
     * ========================================
     */

    renderAll() {
        console.log('🔄 renderAll() appelé - Membres:', this.data.team?.length || 0);
        this.renderChart();
        this.renderRadarChart();
        this.updateKPIs();
        this.updateTeamCapacity();
        this.showCoachingInsights();
        this.checkAchievements();
        this.updateSprintGoalVisibility();
        this.updateSprintGoalDisplay();
        this.renderPlanningEvents();

        // Rafraîchir la liste des membres
        if (window.teamManager) {
            window.teamManager.render();
        }

        // Mettre à jour le footer selon le mode
        if (window.updateFooterDisplay) {
            window.updateFooterDisplay();
        }

        // Restaurer la vue sauvegardée
        if (this.data.settings.currentView === 'casino') {
            const chartView = document.getElementById('chartView');
            const chartCasinoView = document.getElementById('chartCasinoView');
            const toggleBtn = document.getElementById('toggleViewBtn');

            if (chartView && chartCasinoView && toggleBtn) {
                chartView.style.display = 'none';
                chartCasinoView.style.display = 'block';
                toggleBtn.innerHTML = '📊 Graphique';
                toggleBtn.className = 'btn btn-primary';
                this.renderFullCasino();
            }
        }
    }

    /**
     * ========================================
     * ANALYSE AVANCÉE
     * ========================================
     */

    getTeamProductivity() {
        const teamSize = (this.data.team || []).length;
        const avgVelocity = this.data.sprints.length > 0
            ? this.data.sprints.reduce((sum, s) => sum + s.velocity, 0) / this.data.sprints.length
            : 0;

        return teamSize > 0 ? Math.round(avgVelocity / teamSize * 10) / 10 : 0;
    }

    getPredictiveInsights() {
        const velocities = this.data.sprints.map(s => s.velocity);
        if (velocities.length < 4) return null;

        // Analyse tendance avec régression linéaire simple
        const n = velocities.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = velocities.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * velocities[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Prédiction prochains 3 sprints
        const predictions = [];
        for (let i = 1; i <= 3; i++) {
            const predicted = Math.round(slope * (n + i - 1) + intercept);
            predictions.push(Math.max(0, predicted)); // Pas de vélocité négative
        }

        return {
            trend: slope > 0.1 ? 'positive' : slope < -0.1 ? 'negative' : 'stable',
            predictions: predictions,
            confidence: Math.max(60, 100 - Math.abs(slope) * 20)
        };
    }

    getQualityTrends() {
        const bugRate = this.data.qualityMetrics?.bugRate || 10;
        const testCoverage = this.data.qualityMetrics?.testCoverage || 70;

        return {
            qualityScore: Math.round((100 - bugRate) * 0.6 + testCoverage * 0.4),
            recommendation: bugRate > 15 ? 'focus_quality' : testCoverage < 80 ? 'increase_tests' : 'maintain'
        };
    }

    /**
     * ========================================
     * EXPORT AVANCÉ
     * ========================================
     */

    exportToPowerPoint() {
        // Simulation export PowerPoint
        const slides = this.generateSlides();
        const content = slides.map(slide =>
            `Slide: ${slide.title}\n${slide.content}\n---\n`
        ).join('');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `velocity-presentation-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();

        URL.revokeObjectURL(url);
        this.showNotification('Présentation exportée (format texte)');
    }

    generateSlides() {
        const velocities = this.data.sprints.map(s => s.velocity);
        const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
        const insights = this.getPredictiveInsights();

        return [
            {
                title: 'Vue d\'ensemble équipe',
                content: `
                • Équipe: ${(this.data.team || []).length} personnes
                • Framework: ${this.data.settings.framework.toUpperCase()}
                • Sprints analysés: ${this.data.sprints.length}
                • Vélocité moyenne: ${Math.round(avgVelocity)} points
                `
            },
            {
                title: 'Performance',
                content: `
                • Stabilité: ${this.calculateVariance(velocities) < 20 ? 'Excellente' : 'À améliorer'}
                • Tendance: ${insights?.trend || 'Stable'}
                • Productivité/personne: ${this.getTeamProductivity()} pts
                `
            },
            {
                title: 'Recommandations',
                content: this.generateAdvancedAlerts().map(alert => `• ${alert.message}`).join('\n')
            }
        ];
    }

    /**
     * ========================================
     * RECHERCHE ET FILTRES
     * ========================================
     */

    searchSprints(query) {
        if (!query) return this.data.sprints;

        return this.data.sprints.filter(sprint =>
            sprint.name.toLowerCase().includes(query.toLowerCase()) ||
            sprint.endDate.includes(query)
        );
    }

    filterByDateRange(startDate, endDate) {
        return this.data.sprints.filter(sprint => {
            const sprintDate = new Date(sprint.endDate);
            return sprintDate >= new Date(startDate) && sprintDate <= new Date(endDate);
        });
    }

    filterByVelocityRange(min, max) {
        return this.data.sprints.filter(sprint =>
            sprint.velocity >= min && sprint.velocity <= max
        );
    }

    /**
     * ========================================
     * INTÉGRATIONS FUTURES
     * ========================================
     */

    setupSlackIntegration() {
        // Placeholder pour intégration Slack
        this.showNotification('Intégration Slack - Fonctionnalité en développement', 'info');
    }

    setupCalendarSync() {
        // Placeholder pour synchronisation calendrier
        this.showNotification('Sync Calendrier - Fonctionnalité en développement', 'info');
    }

    /**
     * ========================================
     * DEBUGGING ET MONITORING
     * ========================================
     */

    getDebugInfo() {
        return {
            version: '2.0',
            dataSize: JSON.stringify(this.data).length,
            sprintCount: this.data.sprints.length,
            teamSize: (this.data.team || []).length,
            annotationsCount: (this.data.annotations || []).length,
            achievementsCount: (this.data.achievements || []).length,
            lastSave: localStorage.getItem('velocityToolData') ? 'OK' : 'None',
            browserInfo: {
                userAgent: navigator.userAgent,
                localStorage: typeof Storage !== 'undefined',
                canvas: !!document.createElement('canvas').getContext
            }
        };
    }

    validateData() {
        const issues = [];

        // Validation sprints
        this.data.sprints.forEach((sprint, index) => {
            if (!sprint.name || sprint.name.trim() === '') {
                issues.push(`Sprint ${index}: nom manquant`);
            }
            if (typeof sprint.velocity !== 'number' || sprint.velocity < 0) {
                issues.push(`Sprint ${index}: vélocité invalide`);
            }
            if (!sprint.endDate || isNaN(new Date(sprint.endDate))) {
                issues.push(`Sprint ${index}: date invalide`);
            }
        });

        // Validation équipe
        (this.data.team || []).forEach((member, index) => {
            if (!member.name || member.name.trim() === '') {
                issues.push(`Membre ${index}: nom manquant`);
            }
            if (member.capacity < 0 || member.capacity > 100) {
                issues.push(`Membre ${index}: capacité invalide`);
            }
        });

        return issues;
    }

    repairData() {
        // Auto-réparation des données corrompues
        let repairCount = 0;

        // Nettoyer sprints
        this.data.sprints = this.data.sprints.filter(sprint => {
            if (!sprint.id) {
                sprint.id = Date.now() + Math.random();
                repairCount++;
            }
            return sprint.name && typeof sprint.velocity === 'number';
        });

        // Nettoyer équipe
        this.data.team = (this.data.team || []).filter(member => {
            if (member.capacity > 100) {
                member.capacity = 100;
                repairCount++;
            }
            return member.name;
        });

        if (repairCount > 0) {
            this.saveToStorage();
            this.showNotification(`${repairCount} éléments réparés automatiquement`);
        }

        return repairCount;
    }
}

// Plugin custom pour dessiner les icônes sur le graphique avec vérifications de sécurité
const annotationPlugin = {
    id: 'annotationIcons',
    afterDatasetsDraw(chart) {
        const { ctx, data, scales } = chart;

        if (!ctx || !scales || !scales.x || !scales.y) {
            return;
        }

        if (!window.velocityTool || !window.velocityTool.data) {
            return;
        }

        const annotations = window.velocityTool.data.annotations || [];
        const sprints = window.velocityTool.data.sprints || [];

        if (annotations.length === 0 || sprints.length === 0) {
            return;
        }

        const annotationTypes = {
            team: { icon: "👥", color: "#2196F3" },
            vacation: { icon: "🏖️", color: "#FF9800" },
            incident: { icon: "🚨", color: "#F44336" },
            process: { icon: "🔧", color: "#9C27B0" },
            release: { icon: "🚀", color: "#4CAF50" },
            training: { icon: "🎓", color: "#00BCD4" }
        };

        // Grouper les annotations par sprint
        const annotationsBySprint = {};
        annotations.forEach(annotation => {
            const sprintIndex = sprints.findIndex(s => s.id == annotation.sprintId);
            if (sprintIndex !== -1) {
                if (!annotationsBySprint[sprintIndex]) {
                    annotationsBySprint[sprintIndex] = [];
                }
                annotationsBySprint[sprintIndex].push(annotation);
            }
        });

        // Dessiner les annotations groupées
        Object.entries(annotationsBySprint).forEach(([sprintIndex, sprintAnnotations]) => {
            try {
                const index = parseInt(sprintIndex);
                const sprint = sprints[index];

                // Les sprints sont déjà inversés dans le graphique (sprintsReversed)
                // donc on utilise directement l'index pour correspondre à l'affichage
                const displayIndex = index;

                if (displayIndex >= data.labels.length) return;

                let x, y;

                try {
                    x = scales.x.getPixelForValue(displayIndex);
                    y = scales.y.getPixelForValue(sprint.velocity);
                } catch (e) {
                    return;
                }

                if (isNaN(x) || isNaN(y)) return;

                // Calculer positions pour multiples annotations
                const annotationCount = sprintAnnotations.length;
                const startOffset = annotationCount > 1 ? -(annotationCount - 1) * 12 : 0;

                sprintAnnotations.forEach((annotation, annotationIndex) => {
                    const annotationType = annotationTypes[annotation.type];
                    if (!annotationType) return;

                    // Position horizontale décalée pour multiples annotations
                    const offsetX = startOffset + (annotationIndex * 24);
                    const finalX = x + offsetX;
                    const finalY = y - 25;

                    ctx.save();

                    // Animation pour nouvelles annotations
                    if (annotation.isNew) {
                        const time = Date.now();
                        const pulse = 1 + 0.2 * Math.sin(time / 300);
                        ctx.translate(finalX, finalY);
                        ctx.scale(pulse, pulse);
                        ctx.translate(-finalX, -finalY);
                    }

                    // Dimension de fond
                    ctx.fillStyle = annotationType.color;
                    ctx.beginPath();
                    ctx.arc(finalX, finalY, 12, 0, 2 * Math.PI);
                    ctx.fill();

                    // Bordure blanche
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Icône emoji (plus petite pour multiples)
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(annotationType.icon, finalX, finalY);

                    // Badge compteur si plus de 3 annotations
                    if (annotationCount > 3 && annotationIndex === 2) {
                        ctx.fillStyle = '#FF5722';
                        ctx.beginPath();
                        ctx.arc(finalX + 8, finalY - 8, 6, 0, 2 * Math.PI);
                        ctx.fill();

                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px Arial';
                        ctx.fillText(`+${annotationCount - 3}`, finalX + 8, finalY - 8);

                        ctx.restore();
                        return; // Arrêter après 3 + badge
                    }

                    ctx.restore();
                });

            } catch (error) {
                console.warn('Erreur rendu annotations groupées:', error);
            }
        });
    }
};

// Enregistrer le plugin seulement s'il n'existe pas déjà
if (!Chart.registry.plugins.get('annotationIcons')) {
    Chart.register(annotationPlugin);
}

/**
 * ========================================
 * PLUGIN PI TIMELINE - Timeline SAFe Program Increment
 * ========================================
 */
const piTimelinePlugin = {
    id: 'piTimeline',
    afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;

        if (!ctx || !chartArea || !scales || !scales.x) {
            return;
        }

        if (!window.velocityTool || !window.velocityTool.data) {
            return;
        }

        const pis = window.velocityTool.data.pis || [];
        const sprints = window.velocityTool.data.sprints || [];

        if (pis.length === 0 || sprints.length === 0) {
            return;
        }

        const { left, right, bottom } = chartArea;
        const timelineY = bottom + 40; // Position sous le graphique
        const timelineHeight = 30;

        // Dessiner chaque PI
        pis.forEach(pi => {
            try {
                // Trouver les sprints du PI
                const piSprints = sprints.filter(sprint => {
                    const sprintDate = new Date(sprint.endDate);
                    const piStart = new Date(pi.startDate);
                    const piEnd = new Date(pi.endDate);
                    return sprintDate >= piStart && sprintDate <= piEnd;
                });

                if (piSprints.length === 0) return;

                // Calculer les positions X du premier et dernier sprint du PI
                const firstSprintIndex = sprints.findIndex(s => s.id === piSprints[0].id);
                const lastSprintIndex = sprints.findIndex(s => s.id === piSprints[piSprints.length - 1].id);

                // Les sprints sont déjà inversés dans le graphique, utiliser directement les index
                const startX = scales.x.getPixelForValue(firstSprintIndex);
                const endX = scales.x.getPixelForValue(lastSprintIndex);

                if (isNaN(startX) || isNaN(endX)) return;

                // Dessiner la barre de timeline PI
                ctx.save();

                // Flèche bleue
                const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
                gradient.addColorStop(0, '#1976D2');
                gradient.addColorStop(1, '#2196F3');

                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#1565C0';
                ctx.lineWidth = 2;

                // Corps de la flèche
                ctx.beginPath();
                ctx.moveTo(startX, timelineY);
                ctx.lineTo(endX - 15, timelineY);
                ctx.lineTo(endX - 15, timelineY - 8);
                ctx.lineTo(endX, timelineY + timelineHeight / 2);
                ctx.lineTo(endX - 15, timelineY + timelineHeight + 8);
                ctx.lineTo(endX - 15, timelineY + timelineHeight);
                ctx.lineTo(startX, timelineY + timelineHeight);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Texte du PI
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textX = (startX + endX) / 2;
                const textY = timelineY + timelineHeight / 2;
                ctx.fillText(pi.name, textX, textY);

                // Icône de localisation si présente
                if (pi.location) {
                    ctx.font = '14px Arial';
                    const locationIcon = pi.location.toLowerCase().includes('remote') ? '🏠' : '📍';
                    ctx.fillText(locationIcon, startX + 15, textY);
                }

                ctx.restore();

            } catch (error) {
                console.warn('Erreur rendu PI timeline:', error);
            }
        });

        // Légende PI
        if (pis.length > 0) {
            ctx.save();
            ctx.fillStyle = '#666';
            ctx.font = '11px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('PI Planning:', left, timelineY + timelineHeight + 15);
            ctx.restore();
        }
    }
};

// Enregistrer le plugin PI timeline
if (!Chart.registry.plugins.get('piTimeline')) {
    Chart.register(piTimelinePlugin);
}

/**
 * ========================================
 * INITIALISATION GLOBALE
 * ========================================
 */

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.velocityTool = new VelocityTool();

    // Initialiser le gestionnaire d'équipe
    window.teamManager = new TeamManager(window.velocityTool);
    window.teamManager.render();

    // Mode debug (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const debugPanel = document.createElement('div');
            debugPanel.className = 'debug-panel';
            debugPanel.style.display = 'block';
            debugPanel.innerHTML = `
                <h4>🔧 Debug Info</h4>
                <pre>${JSON.stringify(window.velocityTool.getDebugInfo(), null, 2)}</pre>
                <button onclick="this.parentElement.remove()" style="margin-top:0.5rem;">Fermer</button>
            `;
            document.body.appendChild(debugPanel);
        }
    });

    // Auto-sauvegarde toutes les 30 secondes
    setInterval(() => {
        if (window.velocityTool) {
            window.velocityTool.saveToStorage();
        }
    }, 30000);

    console.log("🎯 Team Velocity Dashboard initialisé avec succès !");
    console.log("💡 Raccourci: Ctrl+Shift+D pour le debug");
});

// Export global pour debugging
window.VelocityToolClass = VelocityTool;