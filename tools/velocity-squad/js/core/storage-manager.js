/**
 * ========================================
 * STORAGE MANAGER
 * ========================================
 * Gestion du stockage local et PocketBase
 */

export class StorageManager {
    constructor() {
        this.storageKey = 'velocityToolData';
        this.usePocketBase = typeof window.usePocketBase !== 'undefined' && window.usePocketBase;
    }

    /**
     * Charger les données depuis le stockage
     * @returns {Object|null} Données chargées ou null
     */
    loadFromStorage() {
        // Si on a un ID de session dans l'URL, ne pas charger le localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');

        if (sessionId) {
            console.log('📋 ID de session détecté, attente du chargement PocketBase...');
            return null;
        }

        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);

                // S'assurer que les sprints sont triés par date de fin
                if (data.sprints && data.sprints.length > 0) {
                    data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                }

                console.log("📱 Données restaurées:", data.sprints?.length || 0, "sprints");
                return data;
            } catch (e) {
                console.error("❌ Erreur chargement données:", e);
                return null;
            }
        }

        return null;
    }

    /**
     * Sauvegarder les données dans le stockage
     * @param {Object} data - Données à sauvegarder
     */
    saveToStorage(data) {
        try {
            // Si on utilise PocketBase, ne pas sauvegarder dans localStorage
            if (this.usePocketBase) {
                console.log('💾 Sauvegarde gérée par PocketBase');
                return;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log("💾 Données sauvegardées dans localStorage");
        } catch (e) {
            console.error("❌ Erreur sauvegarde:", e);
        }
    }

    /**
     * Effacer les données du stockage
     */
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log("🗑️ Données effacées du localStorage");
        } catch (e) {
            console.error("❌ Erreur effacement données:", e);
        }
    }

    /**
     * Exporter les données en JSON
     * @param {Object} data - Données à exporter
     * @returns {string} JSON stringifié
     */
    exportToJSON(data) {
        try {
            return JSON.stringify(data, null, 2);
        } catch (e) {
            console.error("❌ Erreur export JSON:", e);
            return null;
        }
    }

    /**
     * Importer des données depuis JSON
     * @param {string} jsonString - JSON à importer
     * @returns {Object|null} Données importées ou null
     */
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Valider la structure des données
            if (!data.sprints || !Array.isArray(data.sprints)) {
                throw new Error('Structure de données invalide');
            }

            return data;
        } catch (e) {
            console.error("❌ Erreur import JSON:", e);
            return null;
        }
    }

    /**
     * Obtenir l'ID de session depuis l'URL
     * @returns {string|null} ID de session ou null
     */
    getSessionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('session');
    }

    /**
     * Vérifier si PocketBase est utilisé
     * @returns {boolean} True si PocketBase est actif
     */
    isPocketBaseActive() {
        return this.usePocketBase;
    }

    /**
     * Obtenir la taille du stockage utilisé
     * @returns {number} Taille en octets
     */
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? new Blob([data]).size : 0;
        } catch (e) {
            console.error("❌ Erreur calcul taille:", e);
            return 0;
        }
    }

    /**
     * Vérifier si le stockage est disponible
     * @returns {boolean} True si disponible
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Créer une sauvegarde des données
     * @param {Object} data - Données à sauvegarder
     * @returns {string} Clé de la sauvegarde
     */
    createBackup(data) {
        try {
            const timestamp = new Date().toISOString();
            const backupKey = `${this.storageKey}_backup_${timestamp}`;
            localStorage.setItem(backupKey, JSON.stringify(data));
            console.log("💾 Backup créé:", backupKey);
            return backupKey;
        } catch (e) {
            console.error("❌ Erreur création backup:", e);
            return null;
        }
    }

    /**
     * Restaurer depuis une sauvegarde
     * @param {string} backupKey - Clé de la sauvegarde
     * @returns {Object|null} Données restaurées ou null
     */
    restoreFromBackup(backupKey) {
        try {
            const saved = localStorage.getItem(backupKey);
            if (saved) {
                const data = JSON.parse(saved);
                console.log("♻️ Backup restauré:", backupKey);
                return data;
            }
            return null;
        } catch (e) {
            console.error("❌ Erreur restauration backup:", e);
            return null;
        }
    }

    /**
     * Lister les sauvegardes disponibles
     * @returns {Array} Liste des clés de sauvegarde
     */
    listBackups() {
        const backups = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.storageKey}_backup_`)) {
                    backups.push(key);
                }
            }
        } catch (e) {
            console.error("❌ Erreur liste backups:", e);
        }
        return backups;
    }

    /**
     * Nettoyer les anciennes sauvegardes
     * @param {number} keepLast - Nombre de sauvegardes à conserver
     */
    cleanOldBackups(keepLast = 5) {
        try {
            const backups = this.listBackups();
            if (backups.length > keepLast) {
                // Trier par date (plus ancien en premier)
                backups.sort();
                
                // Supprimer les plus anciennes
                const toDelete = backups.slice(0, backups.length - keepLast);
                toDelete.forEach(key => {
                    localStorage.removeItem(key);
                    console.log("🗑️ Backup supprimé:", key);
                });
            }
        } catch (e) {
            console.error("❌ Erreur nettoyage backups:", e);
        }
    }
}
