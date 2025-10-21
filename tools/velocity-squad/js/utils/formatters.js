/**
 * ========================================
 * FORMATTERS
 * ========================================
 * Utilitaires de formatage des données
 */

export class Formatters {
    /**
     * Formater un nombre avec séparateurs de milliers
     * @param {number} num - Nombre à formater
     * @returns {string} Nombre formaté
     */
    static formatNumber(num) {
        if (num === undefined || num === null) return '0';
        return num.toLocaleString('fr-FR');
    }

    /**
     * Formater un pourcentage
     * @param {number} value - Valeur (0-1 ou 0-100)
     * @param {boolean} isDecimal - True si la valeur est entre 0 et 1
     * @returns {string} Pourcentage formaté
     */
    static formatPercentage(value, isDecimal = true) {
        if (value === undefined || value === null) return '0%';
        const percent = isDecimal ? value * 100 : value;
        return `${Math.round(percent)}%`;
    }

    /**
     * Formater une durée en jours
     * @param {number} days - Nombre de jours
     * @returns {string} Durée formatée
     */
    static formatDuration(days) {
        if (!days) return '0 jour';
        return days === 1 ? '1 jour' : `${days} jours`;
    }

    /**
     * Formater des points (story points)
     * @param {number} points - Nombre de points
     * @returns {string} Points formatés
     */
    static formatPoints(points) {
        if (points === undefined || points === null) return '0 pt';
        return points === 1 ? '1 pt' : `${points} pts`;
    }

    /**
     * Formater une vélocité
     * @param {number} velocity - Vélocité
     * @returns {string} Vélocité formatée
     */
    static formatVelocity(velocity) {
        if (velocity === undefined || velocity === null) return '0';
        return Math.round(velocity).toString();
    }

    /**
     * Formater un nom de sprint
     * @param {string} name - Nom du sprint
     * @param {number} index - Index du sprint
     * @returns {string} Nom formaté
     */
    static formatSprintName(name, index) {
        if (name) return name;
        return `Sprint ${index + 1}`;
    }

    /**
     * Tronquer un texte
     * @param {string} text - Texte à tronquer
     * @param {number} maxLength - Longueur maximale
     * @returns {string} Texte tronqué
     */
    static truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Capitaliser la première lettre
     * @param {string} str - Chaîne à capitaliser
     * @returns {string} Chaîne capitalisée
     */
    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Formater un mood emoji
     * @param {number} mood - Mood (1-5)
     * @returns {string} Emoji correspondant
     */
    static formatMoodEmoji(mood) {
        const moods = {
            1: '😢',
            2: '😕',
            3: '😐',
            4: '😊',
            5: '😄'
        };
        return moods[mood] || '😐';
    }

    /**
     * Formater une priorité
     * @param {string} priority - Priorité (low, medium, high)
     * @returns {string} Priorité formatée
     */
    static formatPriority(priority) {
        const priorities = {
            low: 'Basse',
            medium: 'Moyenne',
            high: 'Haute'
        };
        return priorities[priority] || priority;
    }
}
