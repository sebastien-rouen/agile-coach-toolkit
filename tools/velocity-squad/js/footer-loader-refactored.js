/**
 * ========================================
 * FOOTER LOADER - Chargement et gestion du footer
 * ========================================
 * @requires window.velocityTool - Outil de vélocité (optionnel)
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        FOOTER_PATH: 'partials/footer.html',
        FRAMEWORK_UPDATE_DELAY: 100, // Délai pour synchronisation avec velocityTool
        DEFAULT_FRAMEWORK: 'scrum'
    };

    // Logger client-side simple
    const logger = {
        info: (msg, data) => {
            if (window.DEBUG) console.log(`[FooterLoader] ${msg}`, data || '');
        },
        error: (msg, error) => {
            if (window.DEBUG) console.error(`[FooterLoader] ${msg}`, error);
        },
        warn: (msg) => {
            if (window.DEBUG) console.warn(`[FooterLoader] ${msg}`);
        }
    };

    /**
     * Charger le footer depuis le fichier partial
     */
    async function loadFooter() {
        try {
            const response = await fetch(CONFIG.FOOTER_PATH);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const footerHTML = await response.text();
            
            // Créer un conteneur sécurisé pour le footer
            const footerContainer = document.createElement('footer');
            footerContainer.innerHTML = footerHTML;
            document.body.appendChild(footerContainer);
            
            logger.info('Footer chargé avec succès');
            
            // Initialiser l'affichage selon le mode
            updateFooterDisplay();
            
        } catch (error) {
            logger.error('Erreur chargement footer', error);
            showErrorMessage('Impossible de charger le footer. Veuillez rafraîchir la page.');
        }
    }

    /**
     * Afficher un message d'erreur à l'utilisateur
     * @param {string} message - Message à afficher
     */
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }

    /**
     * Récupérer le framework depuis velocityTool
     * @returns {string} 'scrum' ou 'kanban'
     */
    function getFramework() {
        if (!window.velocityTool) {
            logger.warn('velocityTool non disponible, utilisation du mode par défaut');
            return CONFIG.DEFAULT_FRAMEWORK;
        }
        
        return window.velocityTool.data?.settings?.framework || CONFIG.DEFAULT_FRAMEWORK;
    }

    /**
     * Mettre à jour l'affichage du footer selon le mode (Scrum/Kanban)
     */
    function updateFooterDisplay() {
        const scrumPillars = document.getElementById('scrumPillars');
        const kanbanPrinciples = document.getElementById('kanbanPrinciples');
        
        if (!scrumPillars || !kanbanPrinciples) {
            logger.warn('Éléments footer non trouvés');
            return;
        }

        const framework = getFramework();
        
        if (framework === 'scrum') {
            scrumPillars.classList.remove('is-hidden');
            kanbanPrinciples.classList.add('is-hidden');
        } else {
            scrumPillars.classList.add('is-hidden');
            kanbanPrinciples.classList.remove('is-hidden');
        }
        
        logger.info('Footer mis à jour', { framework });
    }

    /**
     * Observer les changements de mode
     */
    function observeFrameworkChanges() {
        const frameworkSelect = document.getElementById('frameworkMode');
        
        if (!frameworkSelect) {
            logger.warn('Sélecteur de framework non trouvé');
            return;
        }
        
        frameworkSelect.addEventListener('change', () => {
            // Délai pour laisser velocityTool se mettre à jour
            setTimeout(updateFooterDisplay, CONFIG.FRAMEWORK_UPDATE_DELAY);
        });
        
        logger.info('Observer de framework initialisé');
    }

    /**
     * Initialisation complète
     */
    function initialize() {
        loadFooter().then(() => {
            observeFrameworkChanges();
        }).catch(error => {
            logger.error('Erreur lors de l\'initialisation', error);
        });
    }

    /**
     * Démarrage au chargement de la page
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Exposer la fonction de mise à jour pour utilisation externe
    window.updateFooterDisplay = updateFooterDisplay;

})();
