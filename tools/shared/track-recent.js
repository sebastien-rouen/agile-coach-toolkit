/**
 * track-recent.js - Script partagé pour tracker les visites d'outils
 * À inclure dans chaque outil pour ajouter automatiquement aux récents
 */

(function () {
    // Configuration des outils (chargée depuis config.json)
    let TOOLS_CONFIG = null;

    // Charger la configuration depuis config.json
    async function loadToolsConfig() {
        try {
            const response = await fetch('../../config/config.json');
            const config = await response.json();

            // Convertir le tableau en objet pour compatibilité avec validation
            TOOLS_CONFIG = {};
            if (config.tools && Array.isArray(config.tools)) {
                config.tools.forEach(tool => {
                    // Validation et sanitization des données
                    if (tool.id && typeof tool.id === 'string' &&
                        tool.name && typeof tool.name === 'string' &&
                        tool.icon && typeof tool.icon === 'string') {

                        TOOLS_CONFIG[tool.id] = {
                            // Échapper les caractères HTML pour prévenir XSS
                            name: sanitizeText(tool.name),
                            icon: sanitizeText(tool.icon)
                        };
                    }
                });
            }
        } catch (error) {
            // Note: En production, utiliser Winston Logger au lieu de console
            if (typeof logger !== 'undefined') {
                logger.warn('Impossible de charger config.json, utilisation du fallback', { error: error.message });
            } else {
                console.warn('Impossible de charger config.json, utilisation du fallback');
            }
        }
    }

    /**
     * Sanitize le texte pour prévenir les attaques XSS
     * @param {string} text - Texte à nettoyer
     * @returns {string} Texte sécurisé
     */
    function sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Détecter l'ID de l'outil depuis l'URL
     */
    function detectToolId() {
        const path = window.location.pathname;
        const match = path.match(/tools\/([^\/]+)/);
        return match ? match[1] : null;
    }

    /**
     * Ajouter l'outil aux récents
     */
    async function addToRecents(toolId) {
        // Attendre que la config soit chargée
        if (!TOOLS_CONFIG) {
            await loadToolsConfig();
        }

        const toolConfig = TOOLS_CONFIG[toolId];
        if (!toolConfig) {
            console.warn(`Outil inconnu: ${toolId}`);
            return;
        }

        // Reste du code...
    }

    /**
     * Initialiser le tracking
     */
    function trackToolVisit() {
        const toolId = detectToolId();

        if (!toolId || !TOOLS_CONFIG[toolId]) {
            console.warn('Outil non reconnu:', toolId);
            return;
        }

        const toolConfig = TOOLS_CONFIG[toolId];

        // Vérifier si la fonction addToRecents existe (chargée depuis navigation.js)
        if (typeof addToRecents === 'function') {
            addToRecents('tool', toolId, toolConfig.name, toolConfig.icon);
            console.log(`✅ Outil "${toolConfig.name}" ajouté aux récents`);
        } else {
            console.warn('⚠️ La fonction addToRecents n\'est pas disponible');
        }
    }

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackToolVisit);
    } else {
        trackToolVisit();
    }
})();
