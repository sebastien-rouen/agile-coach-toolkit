/**
 * Configuration PocketBase - Exemple
 * 
 * Copiez ce fichier en pocketbase-config.js et adaptez les valeurs
 * selon votre environnement
 */

const PB_CONFIG = {
    // URL de base de votre instance PocketBase
    // Développement local
    baseUrl: 'http://localhost:8090',
    
    // Production (à adapter)
    // baseUrl: 'https://pb.votre-domaine.com',
    
    // Mapping des collections
    // Format: {clé_logique: 'nom_collection_pocketbase'}
    collections: {
        members: 'skills_matrix_members',
        skills: 'skills_matrix_skills',
        memberSkills: 'skills_matrix_member_skills'
    },
    
    // Options de synchronisation
    sync: {
        enabled: true,              // Activer la synchronisation automatique
        interval: 5 * 60 * 1000,    // Intervalle en ms (5 minutes)
        onError: 'fallback'         // 'fallback' ou 'retry'
    },
    
    // Options de cache
    cache: {
        enabled: true,              // Activer le cache
        ttl: 10 * 60 * 1000        // Durée de vie en ms (10 minutes)
    },
    
    // Fallback vers localStorage
    fallback: {
        enabled: true,              // Activer le fallback
        key: 'skills_matrix_data'   // Clé localStorage
    }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PB_CONFIG;
}
