/**
 * ========================================
 * TEMPLATES MANAGER
 * ========================================
 * Gestion des templates de données
 */

export class TemplatesManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
        this.availableTemplates = this.initTemplates();
    }

    /**
     * Initialiser les templates disponibles
     * @returns {Array} Liste des templates
     */
    initTemplates() {
        return [
            {
                id: 'startup_mvp',
                name: '🚀 Startup MVP',
                description: 'Template pour développement MVP avec sprints courts',
                category: 'startup',
                data: {
                    settings: {
                        framework: 'scrum',
                        sprintLength: 7,
                        workingDays: 5
                    },
                    sprints: [
                        {
                            name: 'MVP Sprint 1',
                            startDate: new Date().toISOString().split('T')[0],
                            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            committed: 20,
                            completed: 0,
                            goal: 'Développer les fonctionnalités core du MVP'
                        }
                    ],
                    stories: [
                        { title: 'Authentification utilisateur', points: 8, priority: 'high' },
                        { title: 'Interface principale', points: 5, priority: 'high' },
                        { title: 'API de base', points: 13, priority: 'high' }
                    ]
                }
            },
            {
                id: 'enterprise_project',
                name: '🏢 Projet Entreprise',
                description: 'Template pour projets entreprise avec sprints de 2 semaines',
                category: 'enterprise',
                data: {
                    settings: {
                        framework: 'scrum',
                        sprintLength: 14,
                        workingDays: 10
                    },
                    sprints: [
                        {
                            name: 'Sprint 1 - Foundation',
                            startDate: new Date().toISOString().split('T')[0],
                            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            committed: 40,
                            completed: 0,
                            goal: 'Établir les fondations du projet'
                        }
                    ],
                    team: [
                        { name: 'Product Owner', role: 'PO', capacity: 40 },
                        { name: 'Scrum Master', role: 'SM', capacity: 40 },
                        { name: 'Dev Lead', role: 'Developer', capacity: 40 },
                        { name: 'Developer 1', role: 'Developer', capacity: 40 },
                        { name: 'Developer 2', role: 'Developer', capacity: 40 }
                    ]
                }
            },
            {
                id: 'demo_data',
                name: '📊 Données de Démonstration',
                description: 'Jeu de données complet pour démonstration',
                category: 'demo',
                data: {
                    sprints: [
                        { name: 'Sprint 1', startDate: '2024-01-01', endDate: '2024-01-14', committed: 25, completed: 23 },
                        { name: 'Sprint 2', startDate: '2024-01-15', endDate: '2024-01-28', committed: 30, completed: 28 },
                        { name: 'Sprint 3', startDate: '2024-01-29', endDate: '2024-02-11', committed: 28, completed: 30 },
                        { name: 'Sprint 4', startDate: '2024-02-12', endDate: '2024-02-25', committed: 32, completed: 29 }
                    ],
                    team: [
                        { name: 'Alice Martin', role: 'Product Owner', capacity: 35 },
                        { name: 'Bob Dupont', role: 'Scrum Master', capacity: 40 },
                        { name: 'Claire Durand', role: 'Developer', capacity: 40 },
                        { name: 'David Moreau', role: 'Developer', capacity: 38 }
                    ],
                    annotations: [
                        { text: 'Excellent sprint !', sprintIndex: 2, date: '2024-02-11' },
                        { text: 'Blocage résolu', sprintIndex: 3, date: '2024-02-20' }
                    ]
                }
            }
        ];
    }

    /**
     * Charger un template
     * @param {string} templateId - ID du template
     * @param {string} action - Action (new, merge, replace)
     * @returns {boolean} True si chargé avec succès
     */
    loadTemplate(templateId, action = 'replace') {
        const template = this.availableTemplates.find(t => t.id === templateId);
        if (!template) {
            console.error('❌ Template non trouvé:', templateId);
            if (this.notifications) {
                this.notifications.showError('Template non trouvé');
            }
            return false;
        }

        try {
            switch (action) {
                case 'new':
                    this.replaceData(template.data);
                    break;
                case 'merge':
                    this.mergeData(template.data);
                    break;
                case 'replace':
                default:
                    this.replaceData(template.data);
                    break;
            }

            this.markTemplateAsUsed(templateId);

            if (this.notifications) {
                this.notifications.showSuccess(`✅ Template "${template.name}" chargé`);
            }

            console.log('📋 Template chargé:', template.name);
            return true;
        } catch (error) {
            console.error('❌ Erreur chargement template:', error);
            if (this.notifications) {
                this.notifications.showError('Erreur lors du chargement');
            }
            return false;
        }
    }

    /**
     * Remplacer les données
     * @param {Object} templateData - Données du template
     */
    replaceData(templateData) {
        Object.keys(templateData).forEach(key => {
            this.data[key] = JSON.parse(JSON.stringify(templateData[key]));
        });
    }

    /**
     * Fusionner les données
     * @param {Object} templateData - Données du template
     */
    mergeData(templateData) {
        Object.keys(templateData).forEach(key => {
            if (Array.isArray(templateData[key])) {
                if (!this.data[key]) {
                    this.data[key] = [];
                }
                this.data[key] = [...this.data[key], ...templateData[key]];
            } else if (typeof templateData[key] === 'object') {
                if (!this.data[key]) {
                    this.data[key] = {};
                }
                this.data[key] = { ...this.data[key], ...templateData[key] };
            } else {
                this.data[key] = templateData[key];
            }
        });
    }

    /**
     * Marquer un template comme utilisé
     * @param {string} templateId - ID du template
     */
    markTemplateAsUsed(templateId) {
        if (!this.data.templatesUsed) {
            this.data.templatesUsed = [];
        }
        if (!this.data.templatesUsed.includes(templateId)) {
            this.data.templatesUsed.push(templateId);
        }
    }

    /**
     * Obtenir tous les templates
     * @returns {Array} Liste des templates
     */
    getAllTemplates() {
        const customTemplates = this.getCustomTemplates();
        return [...this.availableTemplates, ...customTemplates];
    }

    /**
     * Obtenir les templates personnalisés
     * @returns {Array} Templates personnalisés
     */
    getCustomTemplates() {
        try {
            const saved = localStorage.getItem('velocityTool_customTemplates');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('❌ Erreur chargement templates personnalisés:', error);
            return [];
        }
    }

    /**
     * Sauvegarder comme template
     * @param {string} name - Nom du template
     * @param {string} description - Description
     * @param {string} category - Catégorie
     * @returns {boolean} True si sauvegardé avec succès
     */
    saveAsTemplate(name, description, category = 'custom') {
        if (!name || name.trim() === '') {
            if (this.notifications) {
                this.notifications.showError('Nom du template requis');
            }
            return false;
        }

        const templateId = this.generateTemplateId(name);
        const template = {
            id: templateId,
            name: name.trim(),
            description: description || '',
            category: category,
            createdAt: new Date().toISOString(),
            data: this.extractTemplateData()
        };

        this.saveCustomTemplate(template);

        if (this.notifications) {
            this.notifications.showSuccess(`✅ Template "${name}" sauvegardé`);
        }

        console.log('💾 Template sauvegardé:', name);
        return true;
    }

    /**
     * Extraire les données pour template
     * @returns {Object} Données à sauvegarder
     */
    extractTemplateData() {
        const templateData = {};
        const keysToInclude = ['sprints', 'team', 'settings', 'stories'];
        
        keysToInclude.forEach(key => {
            if (this.data[key]) {
                templateData[key] = JSON.parse(JSON.stringify(this.data[key]));
            }
        });

        return templateData;
    }

    /**
     * Sauvegarder un template personnalisé
     * @param {Object} template - Template à sauvegarder
     */
    saveCustomTemplate(template) {
        try {
            const customTemplates = this.getCustomTemplates();
            customTemplates.push(template);
            localStorage.setItem('velocityTool_customTemplates', JSON.stringify(customTemplates));
        } catch (error) {
            console.error('❌ Erreur sauvegarde template:', error);
        }
    }

    /**
     * Supprimer un template personnalisé
     * @param {string} templateId - ID du template
     * @returns {boolean} True si supprimé avec succès
     */
    deleteCustomTemplate(templateId) {
        try {
            const customTemplates = this.getCustomTemplates();
            const filtered = customTemplates.filter(t => t.id !== templateId);
            localStorage.setItem('velocityTool_customTemplates', JSON.stringify(filtered));
            
            if (this.notifications) {
                this.notifications.showSuccess('✅ Template supprimé');
            }
            return true;
        } catch (error) {
            console.error('❌ Erreur suppression template:', error);
            return false;
        }
    }

    /**
     * Générer un ID de template
     * @param {string} name - Nom du template
     * @returns {string} ID généré
     */
    generateTemplateId(name) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        return `custom_${slug}_${Date.now()}`;
    }
}
