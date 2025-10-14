/**
 * PocketBase Manager - Gestionnaire centralisé pour les outils
 * 
 * Gère la connexion, la synchronisation et les opérations CRUD avec PocketBase
 * Réutilisable par tous les outils du répertoire /tools/
 * 
 * @version 1.0.0
 */

class PocketBaseManager {
    /**
     * Initialise le gestionnaire PocketBase
     * @param {string} baseUrl - URL de base de PocketBase (ex: 'http://localhost:8090')
     * @param {Object} collections - Mapping des collections {members: 'skills_matrix_members', ...}
     */
    constructor(baseUrl, collections) {
        this.baseUrl = baseUrl;
        this.collections = collections;
        this.connected = false;
        this.cache = {};
        this.syncInterval = null;
    }

    /**
     * Teste la connexion à PocketBase
     * @returns {Promise<boolean>}
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            this.connected = response.ok;
            return this.connected;
        } catch (error) {
            console.warn('PocketBase non disponible, mode local activé', error);
            this.connected = false;
            return false;
        }
    }

    /**
     * Récupère tous les enregistrements d'une collection
     * @param {string} collectionKey - Clé de la collection (ex: 'members')
     * @param {Object} options - Options de requête {filter, sort, expand}
     * @returns {Promise<Array>}
     */
    async getRecords(collectionKey, options = {}) {
        const collectionName = this.collections[collectionKey];
        if (!collectionName) {
            throw new Error(`Collection inconnue: ${collectionKey}`);
        }

        try {
            const params = new URLSearchParams();
            if (options.filter) params.append('filter', options.filter);
            if (options.sort) params.append('sort', options.sort);
            if (options.expand) params.append('expand', options.expand);
            params.append('perPage', options.perPage || 500);

            const url = `${this.baseUrl}/api/collections/${collectionName}/records?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            this.cache[collectionKey] = data.items;
            return data.items;
        } catch (error) {
            console.error(`Erreur lors de la récupération de ${collectionKey}:`, error);
            return this.cache[collectionKey] || [];
        }
    }

    /**
     * Récupère un enregistrement par ID
     * @param {string} collectionKey - Clé de la collection
     * @param {string} id - ID de l'enregistrement
     * @param {Object} options - Options {expand}
     * @returns {Promise<Object>}
     */
    async getRecord(collectionKey, id, options = {}) {
        const collectionName = this.collections[collectionKey];
        if (!collectionName) {
            throw new Error(`Collection inconnue: ${collectionKey}`);
        }

        try {
            const params = new URLSearchParams();
            if (options.expand) params.append('expand', options.expand);

            const url = `${this.baseUrl}/api/collections/${collectionName}/records/${id}?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'enregistrement ${id}:`, error);
            throw error;
        }
    }

    /**
     * Crée un nouvel enregistrement
     * @param {string} collectionKey - Clé de la collection
     * @param {Object} data - Données à créer
     * @returns {Promise<Object>}
     */
    async createRecord(collectionKey, data) {
        const collectionName = this.collections[collectionKey];
        if (!collectionName) {
            throw new Error(`Collection inconnue: ${collectionKey}`);
        }

        try {
            const url = `${this.baseUrl}/api/collections/${collectionName}/records`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            const record = await response.json();
            
            // Mettre à jour le cache
            if (this.cache[collectionKey]) {
                this.cache[collectionKey].push(record);
            }
            
            return record;
        } catch (error) {
            console.error(`Erreur lors de la création dans ${collectionKey}:`, error);
            throw error;
        }
    }

    /**
     * Met à jour un enregistrement
     * @param {string} collectionKey - Clé de la collection
     * @param {string} id - ID de l'enregistrement
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>}
     */
    async updateRecord(collectionKey, id, data) {
        const collectionName = this.collections[collectionKey];
        if (!collectionName) {
            throw new Error(`Collection inconnue: ${collectionKey}`);
        }

        try {
            const url = `${this.baseUrl}/api/collections/${collectionName}/records/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Erreur HTTP: ${response.status}`);
            }

            const record = await response.json();
            
            // Mettre à jour le cache
            if (this.cache[collectionKey]) {
                const index = this.cache[collectionKey].findIndex(r => r.id === id);
                if (index !== -1) {
                    this.cache[collectionKey][index] = record;
                }
            }
            
            return record;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de ${id}:`, error);
            throw error;
        }
    }

    /**
     * Supprime un enregistrement
     * @param {string} collectionKey - Clé de la collection
     * @param {string} id - ID de l'enregistrement
     * @returns {Promise<boolean>}
     */
    async deleteRecord(collectionKey, id) {
        const collectionName = this.collections[collectionKey];
        if (!collectionName) {
            throw new Error(`Collection inconnue: ${collectionKey}`);
        }

        try {
            const url = `${this.baseUrl}/api/collections/${collectionName}/records/${id}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Mettre à jour le cache
            if (this.cache[collectionKey]) {
                this.cache[collectionKey] = this.cache[collectionKey].filter(r => r.id !== id);
            }
            
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de ${id}:`, error);
            throw error;
        }
    }

    /**
     * Active la synchronisation automatique
     * @param {Function} callback - Fonction appelée à chaque synchronisation
     * @param {number} interval - Intervalle en ms (défaut: 30000 = 30s)
     */
    startSync(callback, interval = 30000) {
        if (this.syncInterval) {
            this.stopSync();
        }

        this.syncInterval = setInterval(async () => {
            if (this.connected) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Erreur lors de la synchronisation:', error);
                }
            }
        }, interval);
    }

    /**
     * Arrête la synchronisation automatique
     */
    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    /**
     * Vide le cache
     */
    clearCache() {
        this.cache = {};
    }

    /**
     * Récupère le cache d'une collection
     * @param {string} collectionKey - Clé de la collection
     * @returns {Array}
     */
    getCachedRecords(collectionKey) {
        return this.cache[collectionKey] || [];
    }

    /**
     * Vérifie si une collection est en cache
     * @param {string} collectionKey - Clé de la collection
     * @returns {boolean}
     */
    isCached(collectionKey) {
        return !!this.cache[collectionKey];
    }
}

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PocketBaseManager;
}
