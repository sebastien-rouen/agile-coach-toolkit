/**
 * ========================================
 * LEGACY BRIDGE
 * ========================================
 * Pont temporaire entre l'ancienne architecture (script.js)
 * et la nouvelle architecture modulaire ES6 (app.js)
 * 
 * Ce fichier sera progressivement vidé au fur et à mesure
 * que les fonctionnalités seront migrées vers les modules ES6
 */

/**
 * Initialiser les événements manquants
 */
function initLegacyEvents() {
    const app = window.velocityTool || window.velocityApp;
    if (!app) {
        console.warn('⚠️ Application non disponible pour legacy bridge');
        return;
    }

    console.log('🔗 Initialisation Legacy Bridge...');

    // ========================================
    // FONCTIONS MIGRÉES VERS MODULES ES6
    // ========================================
    // Les fonctions suivantes ont été migrées :
    // - updateKPIs() → velocity-manager.js
    // - renderAnnotations() → charts-renderer.js
    // - renderPlanningEvents() → planning-manager.js
    // - renderPlanningTimeline() → planning-manager.js
    // - renderCoachingInsights() → coaching-manager.js

    // ========================================
    // GESTION DE LA CAPACITÉ ÉQUIPE
    // ========================================
    
    /**
     * Afficher la capacité de l'équipe
     */
    function renderTeamCapacity() {
        const container = document.getElementById('teamCapacity');
        if (!container) return;

        const team = app.data.team || [];
        const devTeam = team.filter(m => !isNonDevRole(m.role));

        if (devTeam.length === 0) {
            container.innerHTML = `
                <div class="capacity-warning">
                    ⚠️ Configurez votre équipe pour voir les prédictions
                    <button class="btn btn-primary" onclick="document.getElementById('manageTeamBtn').click()" style="margin-top: 1rem;">
                        ➕ Ajouter Équipe
                    </button>
                </div>
            `;
            return;
        }

        const totalCapacity = devTeam.reduce((sum, m) => sum + (m.capacity || 100), 0);
        const avgCapacity = Math.round(totalCapacity / devTeam.length);

        container.innerHTML = `
            <div class="capacity-summary">
                <div class="capacity-stat">
                    <div class="capacity-value">${devTeam.length}</div>
                    <div class="capacity-label">Membres</div>
                </div>
                <div class="capacity-stat">
                    <div class="capacity-value">${avgCapacity}%</div>
                    <div class="capacity-label">Capacité Moyenne</div>
                </div>
            </div>
            <div class="capacity-members">
                ${devTeam.map(member => `
                    <div class="capacity-member">
                        <span class="member-name">${member.name}</span>
                        <div class="capacity-bar">
                            <div class="capacity-fill" style="width: ${member.capacity || 100}%"></div>
                        </div>
                        <span class="capacity-percent">${member.capacity || 100}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function isNonDevRole(role) {
        const nonDevRoles = ['PO', 'Product Owner', 'SM', 'Scrum Master'];
        return nonDevRoles.some(r => role.toLowerCase().includes(r.toLowerCase()));
    }

    // ========================================
    // GESTION DU RADAR CHART (COMPÉTENCES)
    // ========================================
    
    /**
     * Afficher le radar des compétences
     */
    function renderRadarChart() {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;

        const team = app.data.team || [];
        
        if (team.length === 0) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('Ajoutez des membres avec compétences', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Extraire toutes les compétences uniques
        const allSkills = new Set();
        team.forEach(member => {
            if (member.skills && Array.isArray(member.skills)) {
                member.skills.forEach(skill => allSkills.add(skill));
            }
        });

        const skills = Array.from(allSkills).slice(0, 8); // Max 8 compétences

        if (skills.length === 0) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune compétence définie', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Compter les membres par compétence
        const skillCounts = skills.map(skill => {
            return team.filter(member => 
                member.skills && member.skills.includes(skill)
            ).length;
        });

        // Créer le radar chart
        if (window.radarChartInstance) {
            window.radarChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        window.radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skills,
                datasets: [{
                    label: 'Nombre de membres',
                    data: skillCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(59, 130, 246)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        },
                        pointLabels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim()
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // ========================================
    // ÉVÉNEMENTS DES BOUTONS
    // ========================================
    
    /**
     * Bind tous les événements manquants
     */
    function bindMissingEvents() {
        // Bouton SAFe (PI Management)
        const managePiBtn = document.getElementById('managePiBtn');
        if (managePiBtn) {
            managePiBtn.addEventListener('click', () => {
                app.openModal('piModal');
                renderPiList();
            });
        }

        // Bouton Add PI
        const addPiBtn = document.getElementById('addPiBtn');
        if (addPiBtn) {
            addPiBtn.addEventListener('click', () => {
                openPiFormModal();
            });
        }

        // Gestion des tabs PI
        initPiTabs();

        // Gestion des boutons de statut PI
        initPiStatusButtons();

        // Gestion du vote de confiance
        initConfidenceVote();

        // Gestion des objectifs, risques, dépendances
        initPiDynamicLists();

        // Bouton Annuler PI Form
        const cancelPiFormBtn = document.getElementById('cancelPiFormBtn');
        if (cancelPiFormBtn) {
            cancelPiFormBtn.addEventListener('click', () => {
                document.getElementById('piFormModal').style.display = 'none';
            });
        }

        // Bouton Sprint (Saisie manuelle)
        const manualEntryBtn = document.getElementById('manualEntryBtn');
        if (manualEntryBtn) {
            manualEntryBtn.addEventListener('click', () => {
                app.openModal('manualModal');
            });
        }

        // Bouton Équipe
        const manageTeamBtn = document.getElementById('manageTeamBtn');
        if (manageTeamBtn) {
            manageTeamBtn.addEventListener('click', () => {
                app.openModal('teamModal');
                if (app.renderTeamList) {
                    app.renderTeamList();
                }
            });
        }

        // Bouton Templates
        const templatesBtn = document.getElementById('templatesBtn');
        if (templatesBtn) {
            templatesBtn.addEventListener('click', () => {
                app.openModal('templatesModal');
                initTemplateCards();
            });
        }

        // Bouton Humeur
        const moodBtn = document.getElementById('moodBtn');
        if (moodBtn) {
            moodBtn.addEventListener('click', () => {
                app.openModal('moodModal');
            });
        }

        // Bouton Casino (Toggle View)
        const toggleViewBtn = document.getElementById('toggleViewBtn');
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => {
                const chartView = document.getElementById('chartView');
                const casinoView = document.getElementById('chartCasinoView');
                
                if (chartView && casinoView) {
                    const isChartVisible = chartView.style.display !== 'none';
                    chartView.style.display = isChartVisible ? 'none' : 'block';
                    casinoView.style.display = isChartVisible ? 'block' : 'none';
                    toggleViewBtn.textContent = isChartVisible ? '📊 Graphique' : '🎰 Casino';
                }
            });
        }

        // Bouton Import
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                app.openModal('importModal');
            });
        }

        // Bouton Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                app.openModal('exportModal');
            });
        }

        // Bouton Download Export JSON
        const downloadExportBtn = document.getElementById('downloadExportBtn');
        if (downloadExportBtn) {
            downloadExportBtn.addEventListener('click', () => {
                exportToJSON();
            });
        }

        // Bouton Download Export XLSX
        const downloadExportXlsxBtn = document.getElementById('downloadExportXlsxBtn');
        if (downloadExportXlsxBtn) {
            downloadExportXlsxBtn.addEventListener('click', () => {
                exportToXLSX();
            });
        }

        // Bouton Partager
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                app.openModal('shareModal');
            });
        }

        // Bouton Ajouter Événement
        const addEventBtn = document.getElementById('addEventBtn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                app.openModal('addEventModal');
                populateEventTypeSelect();
            });
        }

        // Bouton Toggle Timeline View
        const toggleTimelineViewBtn = document.getElementById('toggleTimelineViewBtn');
        if (toggleTimelineViewBtn) {
            toggleTimelineViewBtn.addEventListener('click', () => {
                const timeline = document.getElementById('planningTimeline');
                const compactTimeline = document.getElementById('compactTimeline');
                
                if (timeline && compactTimeline) {
                    const isTimelineVisible = timeline.style.display !== 'none';
                    timeline.style.display = isTimelineVisible ? 'none' : 'block';
                    compactTimeline.style.display = isTimelineVisible ? 'block' : 'none';
                    
                    // Générer le contenu de la timeline via le manager
                    if (app.planning) {
                        if (!isTimelineVisible) {
                            app.planning.renderPlanningTimeline();
                        } else {
                            app.planning.renderCompactTimeline();
                        }
                    }
                }
            });
        }

        // Fermeture des modales
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Fermeture au clic en dehors
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    /**
     * Peupler le select des types d'événements
     */
    function populateEventTypeSelect() {
        const select = document.getElementById('eventType');
        if (!select) return;

        const eventTypes = [
            { value: 'daily', label: '☀️ Daily Standup' },
            { value: 'planning', label: '📋 Sprint Planning' },
            { value: 'review', label: '👀 Sprint Review' },
            { value: 'retro', label: '🔄 Rétrospective' },
            { value: 'refinement', label: '🎯 Refinement' },
            { value: 'demo', label: '🎬 Démo' },
            { value: 'meeting', label: '💼 Réunion' },
            { value: 'other', label: '📌 Autre' }
        ];

        select.innerHTML = eventTypes.map(type => 
            `<option value="${type.value}">${type.label}</option>`
        ).join('');
    }

    // ========================================
    // EXPORT / IMPORT
    // ========================================
    
    /**
     * Exporter les données en JSON
     */
    function exportToJSON() {
        const data = {
            ...app.data,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `velocity-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Export JSON réussi');
        if (window.notificationsManager) {
            window.notificationsManager.showSuccess('📥 Données exportées en JSON');
        }
    }

    // ========================================
    // GESTION DES PIs (SAFe)
    // ========================================
    
    /**
     * Afficher la liste des PIs
     */
    function renderPiList() {
        const container = document.getElementById('piList');
        if (!container) return;

        const pis = app.data.pis || [];

        if (pis.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">🎯 Aucun PI configuré</p>
                    <p style="font-size: 0.9rem;">Cliquez sur "➕ Nouveau PI" pour commencer</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pis.map(pi => `
            <div class="pi-card" data-status="${pi.status || 'planning'}">
                <div class="pi-card-header">
                    <h3>${pi.name}</h3>
                    <span class="pi-status-badge">${getPiStatusLabel(pi.status)}</span>
                </div>
                <div class="pi-card-body">
                    <div class="pi-info">
                        <span>📅 ${formatDate(pi.startDate)} → ${formatDate(pi.endDate)}</span>
                        ${pi.location ? `<span>📍 ${pi.location}</span>` : ''}
                    </div>
                    ${pi.objective ? `<p class="pi-objective">${pi.objective}</p>` : ''}
                    ${pi.comment ? `<p class="pi-comment">${pi.comment}</p>` : ''}
                </div>
                <div class="pi-card-footer">
                    <button onclick="window.legacyBridge.editPi('${pi.id}')" class="btn-small btn-secondary">✏️ Modifier</button>
                    <button onclick="window.legacyBridge.deletePi('${pi.id}')" class="btn-small btn-danger">🗑️ Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    function getPiStatusLabel(status) {
        const labels = {
            planning: '📝 Planning',
            active: '🚀 Actif',
            completed: '✅ Terminé'
        };
        return labels[status] || status;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    // ========================================
    // GESTION DES TEMPLATES
    // ========================================
    
    /**
     * Initialiser les cartes de templates
     */
    function initTemplateCards() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.dataset.template;
                const framework = card.dataset.framework;
                
                if (typeof TEMPLATES_DATA !== 'undefined' && TEMPLATES_DATA[templateId]) {
                    loadTemplate(templateId, TEMPLATES_DATA[templateId]);
                } else {
                    console.error('Template non trouvé:', templateId);
                    if (window.notificationsManager) {
                        window.notificationsManager.showError('Template non disponible');
                    }
                }
            });
        });
    }

    /**
     * Charger un template
     */
    function loadTemplate(templateId, templateData) {
        const confirmed = confirm(`Charger le template "${templateData.name}" ?\n\nCela remplacera toutes vos données actuelles.`);
        
        if (!confirmed) return;

        // Charger les données du template
        app.data.sprints = templateData.sprints || [];
        app.data.team = templateData.team || [];
        app.data.events = templateData.events || [];
        app.data.settings = { ...app.data.settings, ...templateData.settings };

        // Générer les annotations à partir du template
        if (templateData.annotationsTemplate) {
            app.data.annotations = templateData.annotationsTemplate.map((ann, index) => {
                const sprint = app.data.sprints[ann.sprintIndex];
                return {
                    id: `ann_${Date.now()}_${index}`,
                    type: ann.type,
                    sprintId: sprint ? sprint.id || `sprint_${ann.sprintIndex}` : '',
                    text: ann.text,
                    timestamp: new Date().toISOString()
                };
            });
        }

        // Générer des IDs si manquants
        app.data.sprints = app.data.sprints.map((s, i) => ({
            ...s,
            id: s.id || `sprint_${Date.now()}_${i}`
        }));

        app.data.team = app.data.team.map((m, i) => ({
            ...m,
            id: m.id || `member_${Date.now()}_${i}`
        }));

        // Sauvegarder
        app.save();

        // Fermer la modal et rafraîchir
        document.getElementById('templatesModal').style.display = 'none';
        
        if (window.legacyBridge) {
            window.legacyBridge.refreshAll();
        }

        if (app.renderAll) {
            app.renderAll();
        }

        if (window.notificationsManager) {
            window.notificationsManager.showSuccess(`✅ Template "${templateData.name}" chargé avec succès`);
        }

        console.log('✅ Template chargé:', templateId);
    }

    /**
     * Initialiser les tabs du formulaire PI
     */
    function initPiTabs() {
        const tabs = document.querySelectorAll('.pi-tab');
        const tabContents = document.querySelectorAll('.pi-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Désactiver tous les tabs
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                // Activer le tab cliqué
                tab.classList.add('active');
                const targetContent = document.querySelector(`.pi-tab-content[data-tab="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /**
     * Initialiser les boutons de statut PI
     */
    function initPiStatusButtons() {
        const statusButtons = document.querySelectorAll('.status-btn');
        const statusInput = document.getElementById('piStatus');

        statusButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const status = btn.dataset.status;

                // Désactiver tous les boutons
                statusButtons.forEach(b => b.classList.remove('active'));

                // Activer le bouton cliqué
                btn.classList.add('active');

                // Mettre à jour l'input caché
                if (statusInput) {
                    statusInput.value = status;
                }
            });
        });
    }

    /**
     * Initialiser le vote de confiance
     */
    function initConfidenceVote() {
        const confidenceButtons = document.querySelectorAll('.confidence-btn');
        const confidenceInput = document.getElementById('piConfidenceVote');

        confidenceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const vote = btn.dataset.vote;

                // Désactiver tous les boutons
                confidenceButtons.forEach(b => b.classList.remove('active'));

                // Activer le bouton cliqué
                btn.classList.add('active');

                // Mettre à jour l'input caché
                if (confidenceInput) {
                    confidenceInput.value = vote;
                }
            });
        });
    }

    /**
     * Initialiser les listes dynamiques (objectifs, risques, dépendances)
     */
    function initPiDynamicLists() {
        // Bouton Ajouter Objectif
        const addObjectiveBtn = document.getElementById('addObjectiveBtn');
        if (addObjectiveBtn) {
            addObjectiveBtn.addEventListener('click', () => {
                addObjectiveItem();
            });
        }

        // Bouton Ajouter Risque
        const addRiskBtn = document.getElementById('addRiskBtn');
        if (addRiskBtn) {
            addRiskBtn.addEventListener('click', () => {
                addRiskItem();
            });
        }

        // Bouton Ajouter Dépendance
        const addDependencyBtn = document.getElementById('addDependencyBtn');
        if (addDependencyBtn) {
            addDependencyBtn.addEventListener('click', () => {
                addDependencyItem();
            });
        }
    }

    /**
     * Ajouter un objectif
     */
    function addObjectiveItem() {
        const container = document.getElementById('objectivesList');
        if (!container) return;

        const id = `objective_${Date.now()}`;
        const item = document.createElement('div');
        item.className = 'objective-item';
        item.dataset.id = id;
        item.innerHTML = `
            <input type="text" 
                   placeholder="Ex: Déployer 3 microservices en production" 
                   class="objective-input"
                   data-id="${id}">
            <button type="button" onclick="this.parentElement.remove()" class="btn-remove">
                🗑️
            </button>
        `;
        container.appendChild(item);
    }

    /**
     * Ajouter un risque
     */
    function addRiskItem() {
        const container = document.getElementById('risksList');
        if (!container) return;

        const id = `risk_${Date.now()}`;
        const item = document.createElement('div');
        item.className = 'risk-item';
        item.dataset.id = id;
        item.innerHTML = `
            <input type="text" 
                   placeholder="Ex: Dépendance externe non confirmée" 
                   class="risk-input"
                   data-id="${id}">
            <select class="risk-severity" data-id="${id}">
                <option value="low">🟢 Faible</option>
                <option value="medium" selected>🟡 Moyen</option>
                <option value="high">🔴 Élevé</option>
            </select>
            <button type="button" onclick="this.parentElement.remove()" class="btn-remove">
                🗑️
            </button>
        `;
        container.appendChild(item);
    }

    /**
     * Ajouter une dépendance
     */
    function addDependencyItem() {
        const container = document.getElementById('dependenciesList');
        if (!container) return;

        const id = `dependency_${Date.now()}`;
        const item = document.createElement('div');
        item.className = 'dependency-item';
        item.dataset.id = id;
        item.innerHTML = `
            <input type="text" 
                   placeholder="Ex: Équipe Backend doit livrer l'API v2" 
                   class="dependency-input"
                   data-id="${id}">
            <button type="button" onclick="this.parentElement.remove()" class="btn-remove">
                🗑️
            </button>
        `;
        container.appendChild(item);
    }

    /**
     * Ouvrir le formulaire de PI
     */
    function openPiFormModal(piId = null) {
        const modal = document.getElementById('piFormModal');
        if (!modal) return;

        const title = document.getElementById('piFormTitle');
        const form = document.getElementById('piForm');
        
        if (piId) {
            const pi = (app.data.pis || []).find(p => p.id === piId);
            if (!pi) return;

            title.textContent = '✏️ Modifier Program Increment';
            document.getElementById('piId').value = pi.id;
            document.getElementById('piName').value = pi.name || '';
            document.getElementById('piStartDate').value = pi.startDate || '';
            document.getElementById('piEndDate').value = pi.endDate || '';
            document.getElementById('piStatus').value = pi.status || 'planning';
            document.getElementById('piLocation').value = pi.location || '';
            document.getElementById('piComment').value = pi.comment || '';

            // Activer le bon bouton de statut
            const statusButtons = document.querySelectorAll('.status-btn');
            statusButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.status === pi.status) {
                    btn.classList.add('active');
                }
            });

            // Activer le bon vote de confiance
            if (pi.confidence_vote) {
                const confidenceButtons = document.querySelectorAll('.confidence-btn');
                confidenceButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.vote === String(pi.confidence_vote)) {
                        btn.classList.add('active');
                    }
                });
                document.getElementById('piConfidenceVote').value = pi.confidence_vote;
            }
        } else {
            title.textContent = '➕ Nouveau Program Increment';
            form.reset();
            document.getElementById('piId').value = '';

            // Réinitialiser les boutons
            document.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.confidence-btn').forEach(btn => btn.classList.remove('active'));
        }

        app.openModal('piFormModal');
    }

    /**
     * Exporter les données en XLSX
     */
    function exportToXLSX() {
        // Vérifier si SheetJS est disponible
        if (typeof XLSX === 'undefined') {
            console.error('❌ SheetJS non disponible');
            if (window.notificationsManager) {
                window.notificationsManager.showError('SheetJS non chargé. Ajoutez le CDN dans index.html');
            }
            return;
        }

        const wb = XLSX.utils.book_new();

        // Feuille 1: Sprints
        const sprintsData = (app.data.sprints || []).map(s => ({
            'Sprint': s.name,
            'Vélocité': s.velocity || s.completed || 0,
            'Date début': s.startDate || '',
            'Date fin': s.endDate || '',
            'Objectif': s.goal || '',
            'Bugs': s.bugCount || 0,
            'Taille équipe': s.teamSize || 0
        }));
        const ws1 = XLSX.utils.json_to_sheet(sprintsData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Sprints');

        // Feuille 2: Équipe
        const teamData = (app.data.team || []).map(m => ({
            'Nom': m.name,
            'Rôle': m.role,
            'Compétences': (m.skills || []).join(', '),
            'Capacité': m.capacity || 100,
            'Date arrivée': m.startDate || '',
            'Date départ': m.endDate || ''
        }));
        const ws2 = XLSX.utils.json_to_sheet(teamData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Équipe');

        // Feuille 3: Annotations
        const annotationsData = (app.data.annotations || []).map(a => {
            const sprint = (app.data.sprints || []).find(s => s.id === a.sprintId);
            return {
                'Type': a.type,
                'Sprint': sprint ? sprint.name : a.sprintId,
                'Description': a.text,
                'Date': new Date(a.timestamp).toLocaleDateString('fr-FR')
            };
        });
        const ws3 = XLSX.utils.json_to_sheet(annotationsData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Annotations');

        // Feuille 4: Événements
        const eventsData = (app.data.events || []).map(e => ({
            'Type': e.type,
            'Titre': e.title,
            'Date': e.date,
            'Heure': e.time || '',
            'Durée (min)': e.duration || '',
            'Description': e.description || '',
            'Récurrent': e.recurring ? 'Oui' : 'Non'
        }));
        const ws4 = XLSX.utils.json_to_sheet(eventsData);
        XLSX.utils.book_append_sheet(wb, ws4, 'Événements');

        // Télécharger
        XLSX.writeFile(wb, `velocity-data-${new Date().toISOString().split('T')[0]}.xlsx`);

        console.log('✅ Export XLSX réussi');
        if (window.notificationsManager) {
            window.notificationsManager.showSuccess('📊 Données exportées en Excel');
        }
    }

    // ========================================
    // INITIALISATION
    // ========================================
    
    // Bind les événements manquants
    bindMissingEvents();
    
    // Mettre à jour l'interface
    renderTeamCapacity();
    renderRadarChart();

    // Exposer les fonctions pour usage externe
    window.legacyBridge = {
        renderTeamCapacity,
        renderRadarChart,
        renderPiList,
        openPiFormModal,
        editPi: openPiFormModal,
        deletePi: function(piId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce PI ?')) {
                app.data.pis = (app.data.pis || []).filter(p => p.id !== piId);
                app.save();
                renderPiList();
            }
        },
        exportToJSON,
        exportToXLSX,
        refreshAll: function() {
            // Appeler les méthodes des managers ES6
            if (app.velocity) app.velocity.updateKPIsUI();
            if (app.charts) app.charts.renderVelocityChart('mainChart');
            if (app.planning) {
                app.planning.renderPlanningEvents();
                app.planning.renderPlanningTimeline();
            }
            if (app.coaching) app.coaching.showCoachingInsights();
            
            // Fonctions legacy restantes
            renderTeamCapacity();
            renderRadarChart();
            renderPiList();
        }
    };

    console.log('✅ Legacy Bridge initialisé avec tous les événements');
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Attendre que l'app soit disponible
        setTimeout(initLegacyEvents, 500);
    });
} else {
    setTimeout(initLegacyEvents, 500);
}
