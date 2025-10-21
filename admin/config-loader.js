/**
 * Configuration Loader
 * Charge et expose la configuration depuis config.json
 */

class ConfigLoader {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    async load() {
        if (this.loaded) {
            return this.config;
        }

        try {
            const response = await fetch('../config/config.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.config = await response.json();
            this.loaded = true;
            
            return this.config;
        } catch (error) {
            console.error('Erreur lors du chargement de la configuration:', error);
            
            // Configuration par défaut en cas d'erreur
            this.config = {
                paths: {
                    uploads: '/uploads/',
                    api: '/api/',
                    content: '/content/',
                    assets: '/assets/',
                    tools: '/tools/'
                },
                upload: {
                    maxFileSize: 5242880, // 5 MB
                    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
                    thumbnailSize: 200
                }
            };
            this.loaded = true;
            
            return this.config;
        }
    }

    // Getters pour les chemins
    getUploadPath() {
        return this.config?.paths?.uploads || '/uploads/';
    }

    getApiPath() {
        return this.config?.paths?.api || '/api/';
    }

    getContentPath() {
        return this.config?.paths?.content || '/content/';
    }

    getAssetsPath() {
        return this.config?.paths?.assets || '/assets/';
    }

    getToolsPath() {
        return this.config?.paths?.tools || '/tools/';
    }

    // Getters pour la configuration d'upload
    getMaxFileSize() {
        return this.config?.upload?.maxFileSize || 5242880;
    }

    getMaxFileSizeMB() {
        return Math.round(this.getMaxFileSize() / 1024 / 1024);
    }

    getAllowedExtensions() {
        return this.config?.upload?.allowedExtensions || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    }

    getThumbnailSize() {
        return this.config?.upload?.thumbnailSize || 200;
    }

    // Validation
    isValidExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return this.getAllowedExtensions().includes(ext);
    }

    isValidFileSize(size) {
        return size <= this.getMaxFileSize();
    }

    // Formatage
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// Instance globale
const configLoader = new ConfigLoader();

// Charger automatiquement au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    await configLoader.load();
    console.log('Configuration chargée:', configLoader.config);
});
