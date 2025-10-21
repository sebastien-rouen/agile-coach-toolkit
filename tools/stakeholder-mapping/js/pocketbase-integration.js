/* ===================================
   POCKETBASE INTEGRATION
   =================================== */

// Configuration PocketBase
const PB_CONFIG = {
    baseUrl: '/pb',
    collections: {
        sessions: 'tools_stakeholder_mapping_sessions',
        stakeholders: 'tools_stakeholder_mapping_stakeholders'
    }
};

const PocketBaseIntegration = {
    pbManager: null,
    initialized: false,
    usePocketBase: false,

    /**
     * Initialize PocketBase
     */
    async init() {
        if (!CONFIG.pocketbase.enabled) {
            console.log('PocketBase désactivé dans la configuration');
            return;
        }

        try {
            // PocketBaseManager is loaded from ../../assets/js/pocketbase-manager.js
            if (typeof PocketBaseManager === 'undefined') {
                console.warn('⚠️ PocketBaseManager non disponible, mode local activé');
                this.usePocketBase = false;
                return;
            }

            // Instancier le PocketBaseManager
            this.pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);

            // Tester la connexion
            const connected = await this.pbManager.testConnection();

            if (connected) {
                this.initialized = true;
                this.usePocketBase = true;
                console.log('✅ PocketBase connecté');

                // Check for sessionId in URL
                const urlParams = new URLSearchParams(window.location.search);
                const sessionId = urlParams.get('sessionId');

                if (sessionId) {
                    // Load specific session from URL
                    console.log(`📂 Chargement de la session depuis l'URL: ${sessionId}`);
                    await this.loadSession(sessionId);
                } else {
                    // Load most recent session
                    await this.loadSessions();
                }
            } else {
                console.log('⚠️ PocketBase non disponible, mode local activé');
                this.usePocketBase = false;
            }
        } catch (error) {
            console.error('Erreur initialisation PocketBase:', error);
            this.usePocketBase = false;
        }
    },

    /**
     * Load sessions from PocketBase
     */
    async loadSessions() {
        if (!this.usePocketBase) return;

        try {
            const sessions = await this.pbManager.getRecords('sessions', {
                sort: '-updated'
            });

            if (sessions && sessions.length > 0) {
                console.log(`📂 ${sessions.length} session(s) trouvée(s)`);
                // Load most recent session
                await this.loadSession(sessions[0].id);
            } else {
                console.log('📂 Aucune session existante');
            }
        } catch (error) {
            console.error('Erreur chargement sessions:', error);
        }
    },

    /**
     * Load specific session
     */
    async loadSession(sessionId) {
        if (!this.usePocketBase) return;

        try {
            // Validate session ID format (alphanumeric, min 10 chars)
            if (!sessionId || !/^[a-z0-9]{10,}$/.test(sessionId)) {
                throw new Error('Format d\'ID de session invalide');
            }

            // Try to load session
            let session;
            let sessionExists = false;
            
            try {
                session = await this.pbManager.getRecord('sessions', sessionId);
                sessionExists = true;
            } catch (error) {
                // Session doesn't exist yet (404), this is normal for a new session
                if (error.message.includes('404')) {
                    console.log(`📝 Session ${sessionId} n'existe pas encore dans PocketBase`);
                    console.log(`💡 Elle sera automatiquement créée lors de la première sauvegarde`);
                    
                    // Update DataManager with current session info
                    if (DataManager.currentSession && DataManager.currentSession.id === sessionId) {
                        // Session already initialized in DataManager, just update UI
                        if (typeof App !== 'undefined') {
                            App.updateSessionInfo();
                            App.refreshAllViews();
                        }
                        console.log(`✅ Session locale prête (0 stakeholders)`);
                    }
                    return;
                }
                // Other errors (not 404) should be logged
                console.error('Erreur inattendue lors du chargement de la session:', error);
                return;
            }
            
            // If we reach here, session exists in PocketBase
            if (!sessionExists) return;

            // Load stakeholders
            const stakeholders = await this.pbManager.getRecords('stakeholders', {
                filter: `session_id = "${sessionId}"`,
                sort: 'created'
            });

            // Update DataManager
            DataManager.currentSession = {
                id: session.id,
                name: session.name,
                created: session.created,
                updated: session.updated
            };

            DataManager.stakeholders = (stakeholders || []).map(s => ({
                id: s.id,
                name: s.name,
                role: s.role,
                power: s.power,
                interest: s.interest,
                influence: s.influence,
                domain: s.domain,
                notes: s.notes || '',
                created: s.created,
                updated: s.updated
            }));

            if (typeof App !== 'undefined') {
                App.updateSessionInfo();
                App.refreshAllViews();
            }

            console.log(`✅ Session chargée (${stakeholders.length} stakeholders)`);
        } catch (error) {
            console.error('Erreur chargement session:', error);
        }
    },

    /**
     * Save current session
     */
    async saveSession() {
        console.log('💾 Début de la sauvegarde...');
        console.log('PocketBase actif:', this.usePocketBase);
        
        if (!this.usePocketBase) {
            console.warn('⚠️ PocketBase non disponible, sauvegarde locale uniquement');
            return;
        }

        try {
            const session = DataManager.currentSession;
            const stakeholders = DataManager.getAllStakeholders();
            
            console.log('Session à sauvegarder:', session);
            console.log('Nombre de stakeholders:', stakeholders.length);

            // Validate session ID format (alphanumeric, min 10 chars)
            if (!session.id || !/^[a-z0-9]{10,}$/.test(session.id)) {
                console.error('Format d\'ID de session invalide:', session.id);
                Utils.showNotification('Erreur: ID de session invalide', 'error');
                return;
            }

            // Save or update session
            let sessionExists = false;
            try {
                await this.pbManager.getRecord('sessions', session.id);
                sessionExists = true;
            } catch (error) {
                // Session doesn't exist yet
                sessionExists = false;
            }

            if (sessionExists) {
                // Update existing session
                await this.pbManager.updateRecord('sessions', session.id, {
                    name: session.name
                });
                console.log('📝 Session mise à jour');
            } else {
                // Create new session with explicit ID
                const sessionData = {
                    id: session.id,
                    name: session.name
                };
                
                await this.pbManager.createRecord('sessions', sessionData);
                console.log('✨ Nouvelle session créée avec ID:', session.id);
                
                // Update URL with session ID
                if (typeof App !== 'undefined' && App.updateUrlWithSessionId) {
                    App.updateUrlWithSessionId(session.id);
                }
            }

            // Save stakeholders
            let created = 0;
            let updated = 0;

            for (const stakeholder of stakeholders) {
                // Validate stakeholder data
                if (!stakeholder.name || stakeholder.name.length > 255) {
                    console.warn('Stakeholder ignoré: nom invalide');
                    continue;
                }
                if (stakeholder.power < 1 || stakeholder.power > 5) {
                    console.warn('Stakeholder ignoré: pouvoir invalide (doit être entre 1 et 5)');
                    continue;
                }
                if (stakeholder.interest < 1 || stakeholder.interest > 5) {
                    console.warn('Stakeholder ignoré: intérêt invalide (doit être entre 1 et 5)');
                    continue;
                }

                const data = {
                    session_id: session.id,
                    name: stakeholder.name.substring(0, 255),
                    role: stakeholder.role ? stakeholder.role.substring(0, 255) : '',
                    power: Math.max(1, Math.min(5, stakeholder.power)),
                    interest: Math.max(1, Math.min(5, stakeholder.interest)),
                    influence: stakeholder.influence || 'good',
                    domain: stakeholder.domain || 'customer',
                    notes: stakeholder.notes ? stakeholder.notes.substring(0, 1000) : ''
                };

                // Check if stakeholder exists
                let stakeholderExists = false;
                try {
                    await this.pbManager.getRecord('stakeholders', stakeholder.id);
                    stakeholderExists = true;
                } catch (error) {
                    stakeholderExists = false;
                }

                if (stakeholderExists) {
                    // Update existing
                    await this.pbManager.updateRecord('stakeholders', stakeholder.id, data);
                    updated++;
                } else {
                    // Create new with explicit ID
                    const stakeholderData = {
                        id: stakeholder.id,
                        ...data
                    };
                    await this.pbManager.createRecord('stakeholders', stakeholderData);
                    created++;
                }
            }

            console.log(`💾 Sauvegarde: ${created} créés, ${updated} mis à jour`);
            Utils.showNotification(`Session sauvegardée (${created} créés, ${updated} mis à jour)`, 'success');
        } catch (error) {
            console.error('Erreur sauvegarde session:', error);
            Utils.showNotification(`Erreur sauvegarde: ${error.message}`, 'error');
        }
    },

    /**
     * Delete session
     */
    async deleteSession(sessionId) {
        if (!this.usePocketBase) return;

        try {
            // Validate session ID format (alphanumeric, min 10 chars)
            if (!sessionId || !/^[a-z0-9]{10,}$/.test(sessionId)) {
                throw new Error('Format d\'ID de session invalide');
            }

            // Delete stakeholders
            const stakeholders = await this.pbManager.getRecords('stakeholders', {
                filter: `session_id = "${sessionId}"`
            });

            for (const stakeholder of stakeholders) {
                await this.pbManager.deleteRecord('stakeholders', stakeholder.id);
            }

            // Delete session
            await this.pbManager.deleteRecord('sessions', sessionId);

            console.log('🗑️ Session supprimée');
            Utils.showNotification('Session supprimée', 'success');
        } catch (error) {
            console.error('Erreur suppression session:', error);
            Utils.showNotification('Erreur suppression session', 'error');
        }
    }
};

// Initialize PocketBase when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PocketBaseIntegration.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PocketBaseIntegration;
}
