/**
 * Skills Matrix - Utilitaires
 */

/**
 * Échapper les caractères HTML pour prévenir les attaques XSS
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Valider un nom (membre ou compétence)
 * @param {string} name - Nom à valider
 * @param {number} maxLength - Longueur maximale
 * @returns {Object} { valid: boolean, error: string }
 */
function validateName(name, maxLength = 50) {
    if (!name || !name.trim()) {
        return { valid: false, error: 'Le nom ne peut pas être vide.' };
    }
    
    const trimmed = name.trim();
    
    if (trimmed.length > maxLength) {
        return { valid: false, error: `Le nom est trop long (maximum ${maxLength} caractères).` };
    }
    
    // Vérifier les caractères dangereux
    const dangerousChars = /<|>|&|"|'/g;
    if (dangerousChars.test(trimmed)) {
        return { valid: false, error: 'Le nom contient des caractères non autorisés.' };
    }
    
    return { valid: true, name: trimmed };
}

/**
 * Vérifier si un nom existe déjà dans une liste
 * @param {string} name - Nom à vérifier
 * @param {Array} list - Liste de noms ou d'objets avec propriété name
 * @returns {boolean}
 */
function nameExists(name, list) {
    const lowerName = name.toLowerCase();
    return list.some(item => {
        const itemName = typeof item === 'string' ? item : item.name;
        return itemName.toLowerCase() === lowerName;
    });
}

/**
 * Formater une date pour l'export
 * @returns {string} Date formatée YYYY-MM-DD_HH-MM-SS
 */
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

console.log('✅ utils.js chargé');
