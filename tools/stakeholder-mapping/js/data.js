/* ===================================
   DATA MANAGEMENT
   =================================== */

const DataManager = {
    currentSession: null,
    stakeholders: [],

    /**
     * Initialize with default session
     */
    init() {
        this.currentSession = {
            id: Utils.generateId(),
            name: CONFIG.defaultSessionName,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        this.stakeholders = [];
    },

    /**
     * Create new session
     */
    createSession(name = CONFIG.defaultSessionName) {
        this.currentSession = {
            id: Utils.generateId(),
            name: name,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        this.stakeholders = [];
        return this.currentSession;
    },

    /**
     * Update session name
     */
    updateSessionName(name) {
        if (this.currentSession) {
            this.currentSession.name = name;
            this.currentSession.updated = new Date().toISOString();
        }
    },

    /**
     * Add stakeholder
     */
    addStakeholder(stakeholder) {
        const newStakeholder = {
            id: Utils.generateId(),
            ...stakeholder,
            created: new Date().toISOString()
        };
        this.stakeholders.push(newStakeholder);
        this.updateSessionTimestamp();
        return newStakeholder;
    },

    /**
     * Update stakeholder
     */
    updateStakeholder(id, updates) {
        const index = this.stakeholders.findIndex(s => s.id === id);
        if (index !== -1) {
            this.stakeholders[index] = {
                ...this.stakeholders[index],
                ...updates,
                updated: new Date().toISOString()
            };
            this.updateSessionTimestamp();
            return this.stakeholders[index];
        }
        return null;
    },

    /**
     * Delete stakeholder
     */
    deleteStakeholder(id) {
        const index = this.stakeholders.findIndex(s => s.id === id);
        if (index !== -1) {
            this.stakeholders.splice(index, 1);
            this.updateSessionTimestamp();
            return true;
        }
        return false;
    },

    /**
     * Get stakeholder by ID
     */
    getStakeholder(id) {
        return this.stakeholders.find(s => s.id === id);
    },

    /**
     * Get all stakeholders
     */
    getAllStakeholders() {
        return [...this.stakeholders];
    },

    /**
     * Get stakeholders by influence level
     */
    getStakeholdersByInfluence(influence) {
        return this.stakeholders.filter(s => s.influence === influence);
    },

    /**
     * Get stakeholders by domain
     */
    getStakeholdersByDomain(domain) {
        return this.stakeholders.filter(s => s.domain === domain);
    },

    /**
     * Get stakeholders by quadrant
     */
    getStakeholdersByQuadrant(quadrant) {
        return this.stakeholders.filter(s => {
            const q = Utils.getQuadrant(s.power, s.interest);
            return q === quadrant;
        });
    },

    /**
     * Update session timestamp
     */
    updateSessionTimestamp() {
        if (this.currentSession) {
            this.currentSession.updated = new Date().toISOString();
        }
    },

    /**
     * Export data
     */
    exportData() {
        return {
            session: this.currentSession,
            stakeholders: this.stakeholders,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    },

    /**
     * Import data
     */
    importData(data) {
        if (!data.session || !Array.isArray(data.stakeholders)) {
            throw new Error('Format de données invalide');
        }

        this.currentSession = data.session;
        this.stakeholders = data.stakeholders;
        return true;
    },

    /**
     * Clear all data
     */
    clearData() {
        this.init();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
