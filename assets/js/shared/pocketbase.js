/**
 * PocketBase - Gestion centralisée de l'authentification
 */

// Instance PocketBase globale (chargée via CDN)
export const pb = new window.PocketBase(window.location.origin + '/pb');

/**
 * Vérifier si l'utilisateur est authentifié
 */
export function isAuthenticated() {
    return pb.authStore.isValid;
}

/**
 * Obtenir l'utilisateur courant
 */
export function getCurrentUser() {
    return pb.authStore.model;
}

/**
 * Se connecter
 */
export async function login(email, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        console.log('✅ Connexion réussie:', authData.record.email);
        return authData;
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        throw error;
    }
}

/**
 * Se déconnecter
 */
export function logout() {
    pb.authStore.clear();
    console.log('✅ Déconnexion');
}

/**
 * S'inscrire
 */
export async function register(email, password, passwordConfirm, name) {
    try {
        const data = {
            email,
            password,
            passwordConfirm,
            name,
            emailVisibility: true
        };
        
        const record = await pb.collection('users').create(data);
        console.log('✅ Inscription réussie:', record.email);
        
        // Auto-login après inscription
        await login(email, password);
        
        return record;
    } catch (error) {
        console.error('❌ Erreur inscription:', error);
        throw error;
    }
}

console.log('✅ PocketBase module loaded');
