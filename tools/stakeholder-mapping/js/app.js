/* ===================================
   MAIN APPLICATION
   =================================== */

const App = {
    currentView: 'table',

    /**
     * Initialize application
     */
    init() {
        // Check for sessionId in URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        // Initialize data
        if (sessionId) {
            // Load session from URL parameter
            console.log(`📂 Chargement de la session depuis l'URL: ${sessionId}`);
            DataManager.init();
            DataManager.currentSession.id = sessionId;
            console.log(`✨ Session initialisée localement (sera créée dans PocketBase lors de la première sauvegarde)`);
        } else {
            // Create new session
            console.log(`✨ Création d'une nouvelle session`);
            DataManager.init();
            // Update URL with new session ID
            this.updateUrlWithSessionId(DataManager.currentSession.id);
            console.log(`🔗 URL mise à jour avec sessionId: ${DataManager.currentSession.id}`);
        }

        // Initialize modules
        ModalManager.init();
        CirclesView.init();
        ImportExport.init();

        // Setup event listeners
        this.setupEventListeners();

        // Initial render
        this.updateSessionInfo();
        this.refreshAllViews();
    },

    /**
     * Update URL with session ID
     */
    updateUrlWithSessionId(sessionId) {
        const url = new URL(window.location);
        url.searchParams.set('sessionId', sessionId);
        window.history.replaceState({}, '', url);
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // New session button
        document.getElementById('newSessionBtn').addEventListener('click', () => {
            this.createNewSession();
        });

        // Edit session name
        document.getElementById('editSessionName').addEventListener('click', () => {
            this.editSessionName();
        });

        // Add stakeholder button
        document.getElementById('addStakeholderBtn').addEventListener('click', () => {
            ModalManager.openStakeholderModal();
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveData();
        });

        // View buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.closest('.btn-view').dataset.view);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarPin = document.getElementById('sidebarPin');
        
        if (sidebarToggle && sidebar) {
            // Open sidebar
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
                if (!sidebar.classList.contains('pinned')) {
                    sidebarOverlay.classList.add('active');
                }
            });

            // Close sidebar
            sidebarClose.addEventListener('click', () => {
                if (!sidebar.classList.contains('pinned')) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }
            });

            // Click overlay to close
            sidebarOverlay.addEventListener('click', () => {
                if (!sidebar.classList.contains('pinned')) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }
            });

            // Pin/Unpin sidebar
            sidebarPin.addEventListener('click', () => {
                const isPinned = sidebar.classList.toggle('pinned');
                sidebarPin.classList.toggle('pinned');
                document.body.classList.toggle('sidebar-pinned');
                
                if (isPinned) {
                    sidebar.classList.add('active');
                    sidebarOverlay.classList.remove('active');
                    sidebarPin.title = 'Détacher la sidebar';
                } else {
                    sidebarPin.title = 'Épingler la sidebar';
                }
            });
        }

        // Templates button
        document.getElementById('templatesBtn').addEventListener('click', () => {
            this.openTemplatesModal();
        });
    },

    /**
     * Open templates modal
     */
    openTemplatesModal() {
        const modal = document.getElementById('templatesModal');
        modal.classList.add('active');

        // Close button
        document.getElementById('closeTemplatesModal').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Template load buttons
        document.querySelectorAll('.template-load-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.template-card');
                const templateId = card.dataset.template;
                Templates.loadTemplate(templateId);
                modal.classList.remove('active');
            });
        });
    },

    /**
     * Create new session
     */
    createNewSession() {
        if (DataManager.stakeholders.length > 0) {
            if (!Utils.confirm('Créer une nouvelle session ? Les données actuelles seront perdues.')) {
                return;
            }
        }

        const name = prompt('Nom de la session:', CONFIG.defaultSessionName);
        if (name) {
            DataManager.createSession(name);
            
            // Update URL with new session ID
            this.updateUrlWithSessionId(DataManager.currentSession.id);
            
            this.updateSessionInfo();
            this.refreshAllViews();
            Utils.showNotification('Nouvelle session créée', 'success');
        }
    },

    /**
     * Edit session name
     */
    editSessionName() {
        const currentName = DataManager.currentSession?.name || CONFIG.defaultSessionName;
        const newName = prompt('Nom de la session:', currentName);
        
        if (newName && newName !== currentName) {
            DataManager.updateSessionName(newName);
            this.updateSessionInfo();
            Utils.showNotification('Nom de session mis à jour', 'success');
        }
    },

    /**
     * Update session info display
     */
    updateSessionInfo() {
        const sessionName = document.getElementById('sessionName');
        if (DataManager.currentSession) {
            sessionName.textContent = DataManager.currentSession.name;
        }
    },

    /**
     * Switch view
     */
    switchView(view) {
        this.currentView = view;

        // Update buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view-content').forEach(content => {
            content.classList.remove('active');
        });

        const viewElement = document.getElementById(`${view}View`);
        if (viewElement) {
            viewElement.classList.add('active');
        }

        // Render current view
        this.renderCurrentView();
    },

    /**
     * Render current view
     */
    renderCurrentView() {
        switch (this.currentView) {
            case 'table':
                TableView.render();
                break;
            case 'circles':
                CirclesView.render();
                break;
            case 'matrix':
                MatrixView.render();
                break;
        }
    },

    /**
     * Refresh all views
     */
    refreshAllViews() {
        TableView.render();
        CirclesView.render();
        MatrixView.render();
    },

    /**
     * Save data
     */
    saveData() {
        // This will be enhanced with PocketBase integration
        Utils.showNotification('Données sauvegardées localement', 'success');
        
        // If PocketBase is available, save to database
        if (window.PocketBaseIntegration && CONFIG.pocketbase.enabled) {
            PocketBaseIntegration.saveSession();
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
