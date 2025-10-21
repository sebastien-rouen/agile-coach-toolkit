/**
 * ========================================
 * VELOCITY SQUAD - APPLICATION PRINCIPALE
 * ========================================
 * Point d'entrée de l'application
 * Intégration des modules ES6
 */

// Import des modules Utils
import { DateUtils } from './utils/date-utils.js';
import { Formatters } from './utils/formatters.js';
import { Validators } from './utils/validators.js';

// Import des modules Core
import { StorageManager } from './core/storage-manager.js';
import { SprintManager } from './core/sprint-manager.js';
import { VelocityManager } from './core/velocity-manager.js';

// Import des modules UI
import { ChartsRenderer } from './ui/charts-renderer.js';
import { ModalsManager } from './ui/modals-manager.js';
import { NotificationsManager } from './ui/notifications-manager.js';

// Import des modules Features
import { AchievementsManager } from './features/achievements-manager.js';
import { AnnotationsManager } from './features/annotations-manager.js';
import { StoriesManager } from './features/stories-manager.js';
import { CasinoManager } from './features/casino-manager.js';
import { TemplatesManager } from './features/templates-manager.js';
import { PlanningManager } from './features/planning-manager.js';
import { CoachingManager } from './features/coaching-manager.js';

/**
 * Classe principale de l'application
 */
class VelocityApp {
    constructor() {
        // Structure de données
        this.data = {
            sprints: [],
            team: [],
            annotations: [],
            achievements: [],
            moodTracking: [],
            qualityMetrics: {},
            stories: [],
            events: [],
            pis: [],
            settings: {
                framework: 'scrum',
                sprintLength: 14,
                workingDays: 10,
                currentView: 'chart',
                chartView: 'velocity',
                userName: 'Utilisateur',
                dailyTime: '09:00'
            }
        };

        // Initialiser les managers Core
        this.storage = new StorageManager();
        this.sprints = new SprintManager(this.data);
        this.velocity = new VelocityManager(this.data);

        // Initialiser les managers UI
        this.notifications = new NotificationsManager();
        this.modals = new ModalsManager();
        this.charts = new ChartsRenderer(this.data);

        // Initialiser les managers Features
        this.achievements = new AchievementsManager(this.data, this.notifications);
        this.annotations = new AnnotationsManager(this.data, this.notifications);
        this.stories = new StoriesManager(this.data, this.notifications);
        this.casino = new CasinoManager(this.data, this.notifications);
        this.templates = new TemplatesManager(this.data, this.notifications);
        this.planning = new PlanningManager(this.data, this.notifications);
        this.coaching = new CoachingManager(this.data, this.notifications);

        // Exposer globalement pour compatibilité
        window.velocityApp = this;
        window.velocityTool = this; // Alias pour compatibilité avec l'ancien code
        window.notificationsManager = this.notifications;
        window.modalsManager = this.modals;
        window.DateUtils = DateUtils;
        window.Formatters = Formatters;
        window.Validators = Validators;
        window.Validators = Validators;

        console.log('✅ Modules ES6 chargés avec succès');
    }

    /**
     * Initialiser l'application
     */
    init() {
        console.log('🚀 Initialisation Velocity Squad...');
        
        // Vérifier si on attend PocketBase
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        
        if (sessionId) {
            console.log('📋 ID de session détecté, attente du chargement PocketBase...');
            // Ne pas charger depuis localStorage ni rendre les graphiques
            // PocketBase va charger les données et appeler renderAll()
            this.setupGlobalEvents();
            return;
        }
        
        // Mode sans session : charger depuis localStorage
        const savedData = this.storage.loadFromStorage();
        if (savedData) {
            this.data = { ...this.data, ...savedData };
        }

        // Initialiser l'interface
        this.initUI();

        // Vérifier les achievements
        this.achievements.checkAchievements();

        console.log('📊 Données chargées:', this.data.sprints.length, 'sprints');
        this.notifications.showSuccess('Application initialisée');
    }

    /**
     * Initialiser l'interface utilisateur
     */
    initUI() {
        // Rendre les graphiques si les canvas existent
        // Note: Le canvas principal s'appelle 'mainChart' dans index.html
        if (document.getElementById('mainChart')) {
            this.charts.renderVelocityChart('mainChart');
        }
        if (document.getElementById('trendChart')) {
            this.charts.renderTrendChart('trendChart');
        }
        if (document.getElementById('burndownChart')) {
            this.charts.renderBurndownChart('burndownChart');
        }
        if (document.getElementById('radarChart')) {
            // TODO: Implémenter le radar chart
        }

        // Configurer les événements globaux
        this.setupGlobalEvents();
    }

    /**
     * Configurer les événements globaux
     */
    setupGlobalEvents() {
        // Sauvegarder automatiquement toutes les 30 secondes
        setInterval(() => {
            this.save();
        }, 30000);

        // Sauvegarder avant de quitter
        window.addEventListener('beforeunload', () => {
            this.save();
        });

        // Écouter les changements de thème
        document.addEventListener('themeChanged', () => {
            this.charts.updateChartsColors();
        });

        // Gestion du framework mode (Scrum/Kanban)
        const frameworkSelect = document.getElementById('frameworkMode');
        if (frameworkSelect) {
            frameworkSelect.addEventListener('change', (e) => {
                this.data.settings.framework = e.target.value;
                this.updateFrameworkUI();
                this.refresh();
            });
        }
    }

    /**
     * Mettre à jour l'UI selon le framework
     */
    updateFrameworkUI() {
        const isScrum = this.data.settings.framework === 'scrum';
        
        // Mettre à jour les labels
        document.querySelectorAll('[data-framework-label]').forEach(el => {
            const label = el.dataset.frameworkLabel;
            if (label === 'sprint') {
                el.textContent = isScrum ? 'Sprint' : 'Période';
            } else if (label === 'velocity') {
                el.textContent = isScrum ? 'Vélocité' : 'Débit';
            }
        });

        // Afficher/masquer les éléments spécifiques
        const sprintGoalSection = document.getElementById('sprintGoalSection');
        if (sprintGoalSection) {
            sprintGoalSection.style.display = isScrum ? 'block' : 'none';
        }
    }

    /**
     * Sauvegarder les données
     */
    save() {
        this.storage.saveToStorage(this.data);
        console.log('💾 Données sauvegardées');
    }

    /**
     * Obtenir les statistiques
     */
    getStats() {
        return {
            sprints: this.sprints.getSprintStats(),
            velocity: this.velocity.calculateQualityMetrics(),
            achievements: this.achievements.getProgress(),
            stories: this.stories.getStoriesStats()
        };
    }

    /**
     * Rafraîchir l'interface
     */
    refresh() {
        console.log('🔄 Rafraîchissement interface avec', this.data.sprints?.length || 0, 'sprints');
        
        // Rendre le graphique principal (mainChart)
        if (document.getElementById('mainChart')) {
            this.charts.renderVelocityChart('mainChart');
        }
        if (document.getElementById('trendChart')) {
            this.charts.renderTrendChart('trendChart');
        }
        
        // Mettre à jour les KPIs
        this.velocity.updateKPIsUI();
        
        // Mettre à jour le planning
        this.planning.renderPlanningEvents();
        
        // Afficher les conseils de coaching
        this.coaching.showCoachingInsights();
        
        this.achievements.checkAchievements();
        this.save();
    }
    
    /**
     * Rendre tous les graphiques et l'interface
     */
    renderAll() {
        console.log('🎨 Rendu complet de l\'interface avec', this.data.sprints?.length || 0, 'sprints');
        
        // Mettre à jour la référence data dans les managers
        this.charts.data = this.data;
        this.sprints.data = this.data;
        this.velocity.data = this.data;
        this.achievements.data = this.data;
        this.annotations.data = this.data;
        this.stories.data = this.data;
        this.casino.data = this.data;
        this.templates.data = this.data;
        this.planning.data = this.data;
        this.coaching.data = this.data;
        this.planning.data = this.data;
        
        this.initUI();
        this.achievements.checkAchievements();
        
        // Mettre à jour les KPIs et planning
        this.velocity.updateKPIsUI();
        this.planning.renderPlanningEvents();
        this.planning.renderPlanningTimeline(); // Afficher timeline par défaut
    }

    /**
     * Réinitialiser l'application
     */
    async reset() {
        const confirmed = await this.modals.confirm({
            title: 'Réinitialiser l\'application',
            message: 'Êtes-vous sûr de vouloir supprimer toutes les données ?',
            confirmText: 'Réinitialiser',
            cancelText: 'Annuler',
            confirmClass: 'btn-danger'
        });

        if (confirmed) {
            this.storage.clearStorage();
            this.data = {
                sprints: [],
                team: [],
                annotations: [],
                achievements: [],
                moodTracking: [],
                qualityMetrics: {},
                stories: [],
                events: [],
                pis: [],
                settings: {
                    framework: 'scrum',
                    sprintLength: 14,
                    workingDays: 10,
                    currentView: 'chart',
                    chartView: 'velocity',
                    userName: 'Utilisateur',
                    dailyTime: '09:00'
                }
            };
            this.refresh();
            this.notifications.showSuccess('Application réinitialisée');
        }
    }

    /**
     * Exporter les données
     * @returns {string} JSON des données
     */
    exportData() {
        return this.storage.exportToJSON();
    }

    /**
     * Importer des données
     * @param {string} jsonData - Données JSON
     * @returns {boolean} True si importé avec succès
     */
    async importData(jsonData) {
        const confirmed = await this.modals.confirm({
            title: 'Importer des données',
            message: 'Les données actuelles seront remplacées. Continuer ?',
            confirmText: 'Importer',
            cancelText: 'Annuler'
        });

        if (confirmed) {
            const success = this.storage.importFromJSON(jsonData);
            if (success) {
                const savedData = this.storage.loadFromStorage();
                if (savedData) {
                    this.data = { ...this.data, ...savedData };
                }
                this.refresh();
                this.notifications.showSuccess('Données importées avec succès');
                return true;
            } else {
                this.notifications.showError('Erreur lors de l\'import');
                return false;
            }
        }
        return false;
    }

    /**
     * ========================================
     * GESTION DE L'ÉQUIPE
     * ========================================
     */

    /**
     * Afficher la liste des membres de l'équipe
     */
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
     * Vérifier si un rôle est non-développeur (PO, SM)
     */
    isNonDevRole(role) {
        const nonDevRoles = ['PO', 'Product Owner', 'SM', 'Scrum Master'];
        return nonDevRoles.some(r => role.toLowerCase().includes(r.toLowerCase()));
    }

    /**
     * Compter le nombre de membres de l'équipe de développement (hors PO/SM)
     */
    getDevTeamCount() {
        const team = this.data.team || [];
        return team.filter(member => !this.isNonDevRole(member.role)).length;
    }

    /**
     * Obtenir la couleur du badge de capacité
     */
    getCapacityColor(capacity) {
        if (capacity >= 80) return 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        if (capacity >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
        return 'linear-gradient(135deg, #F44336, #EF5350)';
    }

    /**
     * Obtenir la capacité moyenne de l'équipe (hors PO/SM)
     */
    getAverageCapacity() {
        const team = this.data.team || [];
        const devTeam = team.filter(member => !this.isNonDevRole(member.role));
        
        if (devTeam.length === 0) return 0;
        const total = devTeam.reduce((sum, member) => sum + (member.capacity || 0), 0);
        return Math.round(total / devTeam.length);
    }

    /**
     * Éditer un membre de l'équipe
     */
    editMember(id) {
        const member = this.data.team.find(m => String(m.id) === String(id));
        
        if (!member) {
            console.error('Membre non trouvé:', id);
            this.notifications.showError('❌ Membre non trouvé');
            return;
        }

        console.log('Édition du membre:', member);

        // Pré-remplir le formulaire
        document.getElementById('memberName').value = member.name || '';
        document.getElementById('memberRole').value = member.role || '';
        document.getElementById('memberSkills').value = (member.skills || []).join(', ');
        document.getElementById('memberCapacity').value = member.capacity || 100;

        // Afficher le formulaire
        document.getElementById('addMemberForm').style.display = 'block';
        document.getElementById('addMemberBtn').style.display = 'none';

        // Stocker l'ID en cours d'édition
        this.editingMemberId = member.id;
    }

    /**
     * Supprimer un membre de l'équipe
     */
    async removeMember(id) {
        const member = this.data.team.find(m => String(m.id) === String(id));

        if (!member) {
            console.error('Membre non trouvé:', id);
            this.notifications.showError('❌ Membre non trouvé');
            return;
        }

        console.log('Suppression du membre:', member);

        // Demander confirmation
        const confirmed = await this.modals.confirm({
            title: 'Supprimer le membre',
            message: `Êtes-vous sûr de vouloir supprimer ${member.name} de l'équipe ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            confirmClass: 'btn-danger'
        });

        if (!confirmed) return;

        // Supprimer le membre
        this.data.team = this.data.team.filter(m => String(m.id) !== String(id));
        this.save();
        this.renderTeamList();
        
        this.notifications.showSuccess(`✅ ${member.name} a été supprimé de l'équipe`);
    }

    /**
     * Ouvrir une modale
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            
            // Rafraîchir la liste des membres quand on ouvre la modal équipe
            if (modalId === 'teamModal') {
                this.renderTeamList();
            }
        }
    }

    /**
     * Fermer une modale
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialiser l'application au chargement et exposer globalement
function initializeApp() {
    console.log('🚀 Initialisation Velocity Squad v2.0...');
    const app = new VelocityApp();
    app.init();
    console.log('✅ Application initialisée - window.velocityTool disponible');
    return app;
}

// Créer et exposer l'instance globalement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export { VelocityApp };
