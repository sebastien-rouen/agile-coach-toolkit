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
            settings: {
                framework: 'scrum',   // scrum | kanban
                sprintLength: 14,     // Durée sprint en jours
                workingDays: 10       // Jours ouvrés par sprint
            }
        };
        
        // État casino pour estimation collaborative
        this.casinoSession = {
            stories: [],
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
        this.renderAll();
    }

    /**
     * ========================================
     * GESTION STOCKAGE LOCAL
     * ========================================
     */
    
    loadFromStorage() {
        const saved = localStorage.getItem('velocityToolData');
        if (saved) {
            try {
                this.data = { ...this.data, ...JSON.parse(saved) };
                console.log("📱 Données restaurées:", this.data.sprints.length, "sprints");
            } catch (e) {
                console.error("Erreur chargement données:", e);
            }
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('velocityToolData', JSON.stringify(this.data));
            console.log("💾 Données sauvegardées");
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
        document.getElementById('templatesBtn').addEventListener('click', () => this.openModal('templatesModal'));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('shareBtn').addEventListener('click', () => this.openModal('shareModal'));
        document.getElementById('casinoBtn').addEventListener('click', () => this.toggleCasino());

        // Changement framework
        document.getElementById('frameworkMode').addEventListener('change', (e) => {
            this.data.settings.framework = e.target.value;
            this.renderAll();
            this.saveToStorage();
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

        // Templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.loadTemplate(card.dataset.template);
            });
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
            document.getElementById('addMemberForm').style.display = 'block';
        });

        document.getElementById('saveMemberBtn').addEventListener('click', () => {
            this.addTeamMember();
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

    addAnnotation() {
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
            sprintId: parseInt(sprintId), // S'assurer que c'est un number si nécessaire
            text: annotationText.trim(),
            timestamp: new Date().toISOString(),
            isNew: true
        };

        console.log('📝 Ajout annotation:', annotation); // Debug

        this.data.annotations = this.data.annotations || [];
        this.data.annotations.push(annotation);
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
    
    addTeamMember() {
        const skillsText = document.getElementById('memberSkills').value;
        const skills = skillsText ? skillsText.split(',').map(s => s.trim()) : [];
        
        const member = {
            id: Date.now(),
            name: document.getElementById('memberName').value,
            role: document.getElementById('memberRole').value,
            skills: skills,
            capacity: parseInt(document.getElementById('memberCapacity').value) || 100
        };

        if (!member.name || !member.role) return;

        this.data.team = this.data.team || [];
        this.data.team.push(member);
        this.saveToStorage();
        this.updateTeamCapacity();
        this.renderTeamList();
        this.checkAchievements();
        
        // Reset form
        document.getElementById('addMemberForm').style.display = 'none';
        ['memberName', 'memberRole', 'memberSkills'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('memberCapacity').value = '100';
    }

    renderTeamList() {
        const container = document.getElementById('teamMembersList');
        if (!container) return;
        
        container.innerHTML = (this.data.team || []).map(member => `
            <div class="team-member">
                <div>
                    <strong>${member.name}</strong> - ${member.role}
                    <div style="font-size:0.8rem; color:#666;">
                        ${(member.skills || []).join(', ')}
                    </div>
                </div>
                <div style="text-align:right;">
                    <span>${member.capacity}%</span>
                    <button onclick="window.velocityTool.removeMember(${member.id})" 
                            class="btn-small btn-danger" style="margin-left:0.5rem;">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    removeMember(id) {
        this.data.team = this.data.team.filter(m => m.id !== id);
        this.saveToStorage();
        this.renderTeamList();
        this.updateTeamCapacity();
    }

    /**
     * ========================================
     * MOOD TRACKING
     * ========================================
     */
    
    initMoodTracking() {
        document.getElementById('moodBtn').addEventListener('click', () => {
            this.openModal('moodModal');
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

    hasMoodToday() {
        const today = new Date().toISOString().split('T')[0];
        return (this.data.moodTracking || []).some(m => m.date === today);
    }

    saveMoodEntry() {
        const selectedMood = document.querySelector('.mood-btn.selected');
        if (!selectedMood) return;
        
        const moodEntry = {
            date: new Date().toISOString().split('T')[0],
            score: parseInt(selectedMood.dataset.mood),
            comment: document.getElementById('moodComment').value,
            memberId: 'current_user'
        };
        
        this.data.moodTracking = this.data.moodTracking || [];
        this.data.moodTracking.push(moodEntry);
        this.saveToStorage();
        
        document.getElementById('moodModal').style.display = 'none';
        document.getElementById('moodComment').value = '';
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        
        this.renderRadarChart(); // Mise à jour radar avec nouveau mood
    }

    /**
     * ========================================
     * AJOUT MANUEL DE SPRINT
     * ========================================
     */
    
    addSprintManually() {
        const sprint = {
            id: Date.now(),
            name: document.getElementById('sprintName').value,
            velocity: parseInt(document.getElementById('sprintVelocity').value),
            endDate: document.getElementById('sprintEndDate').value,
            timestamp: new Date().toISOString()
        };

        this.data.sprints.push(sprint);
        this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        
        this.saveToStorage();
        this.renderAll();
        this.checkAchievements();
        
        document.getElementById('manualModal').style.display = 'none';
        document.getElementById('sprintForm').reset();
        
        console.log("✅ Sprint ajouté:", sprint);
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
            }
        });

        
        for (const [sprintIndex, sprintAnnotations] of Object.entries(annotationsBySprint)) {
            try {
                const index = parseInt(sprintIndex);
                const sprint = this.data.sprints[index];
                
                if (index >= chart.data.labels.length) continue;
                
                const x = scales.x.getPixelForValue(index);
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
        const chartTitle = framework === 'scrum' ? '📊 Vélocité par Sprint' : '🌊 Flux Kanban';
        document.getElementById('chartTitle').textContent = chartTitle;

        const labels = this.data.sprints.map(s => s.name);
        const velocities = this.data.sprints.map(s => s.velocity);

        // Vérifier qu'on a des données
        if (labels.length === 0 || velocities.length === 0) {
            console.log('📊 Pas de données pour le graphique');
            return;
        }

        const trendLine = this.calculateTrend(velocities);

        if (framework === 'kanban') {
            this.renderKanbanChart(ctx, labels, velocities);
        } else {
            this.renderScrumChart(ctx, labels, velocities, trendLine);
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
                    annotationIcons: true
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
            
            return `<span style="
                font-size: 0.9rem; 
                color: ${typeInfo.color};
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            ">
                ${typeInfo.icon} ${typeInfo.label}
            </span>`;
        }).join('');
        
        container.appendChild(legend);
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
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;
        
        if (this.radarChart) {
            this.radarChart.destroy();
        }
        
        // Calcul des scores
        const velocity = this.getVelocityScore();
        const quality = this.getQualityScore();
        const mood = this.getMoodScore();
        const stability = Math.max(0, 100 - this.calculateVariance(this.data.sprints.map(s => s.velocity)));
        const collaboration = this.getCollaborationScore();
        
        this.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Vélocité', 'Qualité', 'Moral', 'Stabilité', 'Collaboration'],
                datasets: [{
                    label: 'Performance Équipe',
                    data: [velocity, quality, mood, stability, collaboration],
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderColor: '#2196F3',
                    pointBackgroundColor: '#2196F3',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
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
        
        const heatmapHTML = `
            <div class="heatmap-grid">
                ${team.map(member => `
                    <div class="heatmap-row">
                        <span class="member-name">${member.name}</span>
                        ${weeks.map(week => {
                            const burnoutLevel = this.calculateBurnout(member.id, week);
                            const color = this.getBurnoutColor(burnoutLevel);
                            return `<div class="heatmap-cell" style="background:${color}" 
                                         title="${member.name} - ${week}: Burnout ${burnoutLevel}%"></div>`;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = heatmapHTML;
    }

    getLast12Weeks() {
        const weeks = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i * 7);
            weeks.push(`S${52 - i}`); // Simulation numéros semaines
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
        
        if ((this.data.team || []).length === 0) {
            container.innerHTML = `
                <div class="capacity-warning">
                    ⚠️ Configurez votre équipe pour voir les prédictions
                    <button class="btn btn-primary" style="margin-top: 1rem;">➕ Ajouter Équipe</button>
                </div>
            `;
            return;
        }

        const avgVelocity = this.data.sprints.length > 0 
            ? Math.round(this.data.sprints.map(s => s.velocity).reduce((sum, v) => sum + v, 0) / this.data.sprints.length)
            : 20;

        const predictions = [];
        for (let i = 1; i <= 6; i++) {
            // Prédiction avec facteurs saisonniers
            const seasonalFactor = this.getSeasonalFactor(i);
            const teamCapacityFactor = this.getTeamCapacityFactor();
            const variation = (Math.random() - 0.5) * 0.15; // ±7.5%
            
            const predicted = Math.round(avgVelocity * seasonalFactor * teamCapacityFactor * (1 + variation));
            const confidence = Math.max(60, 90 - i * 4); // Décroissante
            
            predictions.push({
                sprint: `Sprint +${i}`,
                capacity: predicted,
                confidence: confidence
            });
        }

        container.innerHTML = `
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

    /**
     * ========================================
     * INTELLIGENCE COACHING
     * ========================================
     */
    
    showCoachingInsights() {
        const container = document.getElementById('coachingAlerts');
        const alerts = this.generateAdvancedAlerts();
        
        container.innerHTML = alerts.length > 0 
            ? alerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    ${alert.icon} ${alert.message}
                </div>
            `).join('')
            : '<div class="alert alert-info">💡 Ajoutez plus de sprints pour recevoir des conseils</div>';
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
        
        if (velocities.length < 3) return alerts;

        // Vélocité en baisse
        const lastThree = velocities.slice(-3);
        if (lastThree.every((v, i) => i === 0 || v < lastThree[i-1])) {
            alerts.push({
                type: 'warning',
                icon: '📉',
                message: 'Vélocité en baisse sur 3 sprints. Temps pour un 5 Whys ou Retrospective approfondie ?'
            });
        }

        // Vélocité variable
        const variance = this.calculateVariance(velocities);
        if (variance > 40) {
            alerts.push({
                type: 'warning',
                icon: '🎢',
                message: `Vélocité très variable (${variance}%). L'équipe a-t-elle besoin de stabilité ?`
            });
        }

        // Vélocité stable
        if (variance < 15 && velocities.length > 5) {
            alerts.push({
                type: 'success',
                icon: '🎯',
                message: 'Excellente stabilité ! Votre équipe a trouvé son rythme de croisière.'
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
                    message: '+20% de vélocité ! L\'équipe monte en compétence. Célébrez ce succès !'
                });
            }
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
        const summerMonths = velocities.filter(v => [6,7,8].includes(v.month));
        if (summerMonths.length >= 2) {
            const summerAvg = summerMonths.reduce((sum, v) => sum + v.velocity, 0) / summerMonths.length;
            const globalAvg = velocities.reduce((sum, v) => sum + v.velocity, 0) / velocities.length;
            
            if (summerAvg < globalAvg * 0.8) {
                alerts.push({
                    type: 'info',
                    icon: '🏖️',
                    message: `Pattern détecté: -${Math.round((1-summerAvg/globalAvg)*100)}% vélocité en été. Anticipez vos congés !`
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
    
    loadTemplate(templateType) {
        const templates = {
            startup: {
                name: "🚀 Équipe Startup",
                sprints: [
                    { name: "Sprint 1", velocity: 8, endDate: "2024-06-01" },
                    { name: "Sprint 2", velocity: 12, endDate: "2024-06-08" },
                    { name: "Sprint 3", velocity: 15, endDate: "2024-06-15" },
                    { name: "Sprint 4", velocity: 18, endDate: "2024-06-22" },
                    { name: "Sprint 5", velocity: 16, endDate: "2024-06-29" },
                    { name: "Sprint 6", velocity: 20, endDate: "2024-07-06" }
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
                    { name: "Sprint 1", velocity: 24, endDate: "2024-06-01" },
                    { name: "Sprint 2", velocity: 28, endDate: "2024-06-15" },
                    { name: "Sprint 3", velocity: 22, endDate: "2024-06-29" },
                    { name: "Sprint 4", velocity: 30, endDate: "2024-07-13" },
                    { name: "Sprint 5", velocity: 26, endDate: "2024-07-27" },
                    { name: "Sprint 6", velocity: 32, endDate: "2024-08-10" },
                    { name: "Sprint 7", velocity: 29, endDate: "2024-08-24" }
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
                    { name: "Semaine 1", velocity: 12, endDate: "2024-06-08" },
                    { name: "Semaine 2", velocity: 15, endDate: "2024-06-15" },
                    { name: "Semaine 3", velocity: 10, endDate: "2024-06-22" },
                    { name: "Semaine 4", velocity: 18, endDate: "2024-06-29" },
                    { name: "Semaine 5", velocity: 14, endDate: "2024-07-06" },
                    { name: "Semaine 6", velocity: 16, endDate: "2024-07-13" }
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
            console.error('❌ Template non trouvé:', templateType);
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

            // 3. Générer les données de mood tracking
            const moodTracking = this.generateMoodData(30, template.team.length);

            // 4. Copier toutes les données du template
            Object.assign(this.data, {
                sprints: sprints,
                team: template.team.map(member => ({ ...member })), // Clone pour éviter les références
                annotations: annotations,
                moodTracking: moodTracking,
                qualityMetrics: { ...template.qualityMetrics },
                settings: { ...this.data.settings, ...template.settings }
            });
            
            // 5. Mettre à jour l'interface
            const frameworkSelect = document.getElementById('frameworkMode');
            if (frameworkSelect) {
                frameworkSelect.value = template.settings.framework;
            }
            
            // 6. Sauvegarder et rendre
            this.saveToStorage();
            this.renderAll();
            
            // 7. Fermer modal et notifier
            document.getElementById('templatesModal').style.display = 'none';
            
            this.showNotification(`✅ Template "${template.name}" chargé avec succès !`, 'success');
            
            // 8. Debug info
            console.log('✅ Template chargé:', {
                sprints: this.data.sprints.length,
                annotations: this.data.annotations.length,
                team: this.data.team.length,
                framework: this.data.settings.framework
            });

            // 9. Vérifier la cohérence
            this.validateTemplateData();
            
        } catch (error) {
            console.error('❌ Erreur chargement template:', error);
            this.showNotification('❌ Erreur lors du chargement du template', 'error');
        }
    }

    /**
     * Génération de données de mood réalistes
     */
    generateMoodData(days, teamSize = 3) {
        const moods = [];
        
        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Générer mood pour chaque membre d'équipe
            for (let memberId = 1; memberId <= teamSize; memberId++) {
                const weekDay = date.getDay();
                
                // Patterns réalistes : lundi plus bas, vendredi plus haut
                let baseScore = 2; // Score moyen
                if (weekDay === 1) baseScore = 1.8; // Lundi
                if (weekDay === 5) baseScore = 2.7; // Vendredi
                if (weekDay === 0 || weekDay === 6) continue; // Pas de weekend
                
                // Variation individuelle
                const personalVariation = (memberId % 3) * 0.2 - 0.2; // -0.2, 0, +0.2
                
                // Variation aléatoire
                const randomVariation = (Math.random() - 0.5) * 0.6;
                
                const finalScore = baseScore + personalVariation + randomVariation;
                const score = Math.max(1, Math.min(3, Math.round(finalScore)));
                
                moods.push({
                    date: date.toISOString().split('T')[0],
                    score: score,
                    memberId: memberId,
                    comment: score === 1 ? 'Journée difficile' : score === 3 ? 'Super journée !' : ''
                });
            }
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
                    { name: "PROJ Sprint 1", velocity: 21, endDate: "2024-06-01" },
                    { name: "PROJ Sprint 2", velocity: 25, endDate: "2024-06-15" },
                    { name: "PROJ Sprint 3", velocity: 19, endDate: "2024-06-29" }
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
        const exportData = {
            sprints: this.data.sprints,
            team: this.data.team,
            annotations: this.data.annotations,
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
        this.showNotification('Données exportées avec succès !');
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
        const stories = [
            { title: "Login social OAuth", description: "Intégration Google/GitHub/LinkedIn", complexity: "?" },
            { title: "Dashboard analytics", description: "Métriques temps réel avec Chart.js", complexity: "?" },
            { title: "Notifications push", description: "Alerts mobiles et desktop", complexity: "?" },
            { title: "Export PDF", description: "Génération rapports automatiques", complexity: "?" },
            { title: "Mode hors-ligne", description: "Sync différée des données", complexity: "?" }
        ];
        
        this.casinoSession = {
            stories,
            currentStory: 0,
            estimates: {},
            revealed: false
        };
    }

    toggleCasino() {
        const container = document.getElementById('casinoContainer');
        if (container.innerHTML.trim() === '') {
            this.renderCasinoStory();
        } else {
            container.innerHTML = '';
        }
    }

    renderCasinoStory() {
        const story = this.casinoSession.stories[this.casinoSession.currentStory];
        const container = document.getElementById('casinoContainer');
        
        container.innerHTML = `
            <div class="casino-header">
                <h3>🎰 Story ${this.casinoSession.currentStory + 1}/${this.casinoSession.stories.length}</h3>
                <div class="story-card">
                    <h4>${story.title}</h4>
                    <p>${story.description}</p>
                </div>
            </div>
            
            <div class="estimation-zone">
                <div class="fibonacci-cards">
                    ${[1,2,3,5,8,13,21,34].map(point => `
                        <div class="poker-card" data-points="${point}" onclick="window.velocityTool.estimateStory(${point})">
                            <span class="card-value">${point}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="participants">
                ${(this.data.team || []).map(member => `
                    <div class="participant ${this.casinoSession.estimates[member.id] ? 'estimated' : ''}">
                        <span>${member.name}</span>
                        <div class="card-back">${this.casinoSession.estimates[member.id] ? '🎴' : '⏳'}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="casino-controls">
                <button onclick="window.velocityTool.revealEstimates()" 
                        class="btn btn-primary" ${this.allEstimated() ? '' : 'disabled'}>
                    🎭 Révéler
                </button>
                <button onclick="window.velocityTool.nextStory()" class="btn btn-secondary">
                    ➡️ Story Suivante
                </button>
                <button onclick="window.velocityTool.toggleCasino()" class="btn btn-danger">
                    ❌ Fermer
                </button>
            </div>`;
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
        const fibSeq = [1,2,3,5,8,13,21,34];
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
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 2000;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `${icons[type]} ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 4000);
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
     * RENDU GLOBAL
     * ========================================
     */
    
    renderAll() {
        this.renderChart();
        this.renderRadarChart();
        this.renderBurnoutHeatmap();
        this.updateKPIs();
        this.updateTeamCapacity();
        this.showCoachingInsights();
        this.checkAchievements();
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
        const x = Array.from({length: n}, (_, i) => i);
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

/**
 * ========================================
 * CSS DYNAMIQUE ADDITIONNEL
 * ========================================
 */
const additionalCSS = `
/* Améliorations visuelles */
.chart-container {
    position: relative;
    height: 400px;
    width: 100%;
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    border-radius: 8px;
    padding: 10px;
}

.capacity-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.capacity-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 6px;
    align-items: center;
    transition: all 0.3s ease;
}

.capacity-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.capacity-sprint {
    font-weight: 500;
    color: #495057;
}

.capacity-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--primary);
}

.capacity-confidence {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
}

/* Animations des cartes poker */
@keyframes cardFlip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
}

.poker-card.flipping {
    animation: cardFlip 0.6s ease-in-out;
}

/* Effets hover améliorés */
.template-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

/* Responsive amélioré */
@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .chart-section {
        grid-column: 1;
    }
    
    .poker-card, .point-btn {
        width: 50px;
        height: 70px;
        font-size: 1rem;
    }
}

/* Debug panel */
.debug-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.8rem;
    max-width: 300px;
    z-index: 1000;
    display: none;
}

/* Micro-interactions */
.kpi-card:hover .kpi-value {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}

.alert {
    border-left-width: 4px;
    position: relative;
    overflow: hidden;
}

.alert::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
    animation: shine 2s infinite;
}

@keyframes shine {
    0% { transform: translateY(-100%); }
    50% { transform: translateY(100%); }
    100% { transform: translateY(100%); }
}
`;

// Injection du CSS supplémentaire
const styleElement = document.createElement('style');
styleElement.textContent = additionalCSS;
document.head.appendChild(styleElement);

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
                if (index >= data.labels.length) return;

                const sprint = sprints[index];
                let x, y;
                
                try {
                    x = scales.x.getPixelForValue(index);
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
 * INITIALISATION GLOBALE
 * ========================================
 */

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.velocityTool = new VelocityTool();
    
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