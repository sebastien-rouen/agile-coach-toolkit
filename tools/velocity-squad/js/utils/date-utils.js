/**
 * ========================================
 * DATE UTILITIES
 * ========================================
 * Utilitaires pour la gestion des dates
 */

export class DateUtils {
    /**
     * Formater une date en français
     * @param {Date|string} date - Date à formater
     * @returns {string} Date formatée
     */
    static formatDate(date) {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('fr-FR', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formater une date courte
     * @param {Date|string} date - Date à formater
     * @returns {string} Date formatée (JJ/MM/AAAA)
     */
    static formatDateShort(date) {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('fr-FR');
    }

    /**
     * Calculer le nombre de jours entre deux dates
     * @param {Date|string} start - Date de début
     * @param {Date|string} end - Date de fin
     * @returns {number} Nombre de jours
     */
    static getDaysBetween(start, end) {
        const startDate = typeof start === 'string' ? new Date(start) : start;
        const endDate = typeof end === 'string' ? new Date(end) : end;
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculer le nombre de jours ouvrés entre deux dates
     * @param {Date|string} start - Date de début
     * @param {Date|string} end - Date de fin
     * @returns {number} Nombre de jours ouvrés
     */
    static getWorkingDays(start, end) {
        const startDate = typeof start === 'string' ? new Date(start) : start;
        const endDate = typeof end === 'string' ? new Date(end) : end;
        
        let count = 0;
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Pas samedi ni dimanche
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    }

    /**
     * Vérifier si une date est aujourd'hui
     * @param {Date|string} date - Date à vérifier
     * @returns {boolean} True si aujourd'hui
     */
    static isToday(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }

    /**
     * Vérifier si une date est un weekend
     * @param {Date|string} date - Date à vérifier
     * @returns {boolean} True si weekend
     */
    static isWeekend(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const dayOfWeek = d.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    }

    /**
     * Ajouter des jours à une date
     * @param {Date|string} date - Date de départ
     * @param {number} days - Nombre de jours à ajouter
     * @returns {Date} Nouvelle date
     */
    static addDays(date, days) {
        const d = typeof date === 'string' ? new Date(date) : new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    /**
     * Obtenir la date au format ISO (YYYY-MM-DD)
     * @param {Date|string} date - Date à formater
     * @returns {string} Date au format ISO
     */
    static toISODate(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().split('T')[0];
    }

    /**
     * Obtenir le nom du jour de la semaine
     * @param {Date|string} date - Date
     * @returns {string} Nom du jour
     */
    static getDayName(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('fr-FR', { weekday: 'long' });
    }

    /**
     * Obtenir le nom du mois
     * @param {Date|string} date - Date
     * @returns {string} Nom du mois
     */
    static getMonthName(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('fr-FR', { month: 'long' });
    }
}
