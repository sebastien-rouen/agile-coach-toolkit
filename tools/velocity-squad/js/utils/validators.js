/**
 * ========================================
 * VALIDATORS
 * ========================================
 * Utilitaires de validation des données
 */

export class Validators {
    /**
     * Valider un sprint
     * @param {Object} sprint - Sprint à valider
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    static validateSprint(sprint) {
        const errors = [];

        if (!sprint.name || sprint.name.trim() === '') {
            errors.push('Le nom du sprint est requis');
        }

        if (!sprint.startDate) {
            errors.push('La date de début est requise');
        }

        if (!sprint.endDate) {
            errors.push('La date de fin est requise');
        }

        if (sprint.startDate && sprint.endDate) {
            const start = new Date(sprint.startDate);
            const end = new Date(sprint.endDate);
            if (end <= start) {
                errors.push('La date de fin doit être après la date de début');
            }
        }

        if (sprint.committed !== undefined && sprint.committed < 0) {
            errors.push('Les points engagés ne peuvent pas être négatifs');
        }

        if (sprint.completed !== undefined && sprint.completed < 0) {
            errors.push('Les points complétés ne peuvent pas être négatifs');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valider un membre d'équipe
     * @param {Object} member - Membre à valider
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    static validateTeamMember(member) {
        const errors = [];

        if (!member.name || member.name.trim() === '') {
            errors.push('Le nom du membre est requis');
        }

        if (!member.role || member.role.trim() === '') {
            errors.push('Le rôle est requis');
        }

        if (member.capacity !== undefined && member.capacity < 0) {
            errors.push('La capacité ne peut pas être négative');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valider une user story
     * @param {Object} story - Story à valider
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    static validateStory(story) {
        const errors = [];

        if (!story.title || story.title.trim() === '') {
            errors.push('Le titre de la story est requis');
        }

        if (story.points !== undefined && story.points < 0) {
            errors.push('Les points ne peuvent pas être négatifs');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valider une annotation
     * @param {Object} annotation - Annotation à valider
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    static validateAnnotation(annotation) {
        const errors = [];

        if (!annotation.text || annotation.text.trim() === '') {
            errors.push('Le texte de l\'annotation est requis');
        }

        if (!annotation.sprintIndex && annotation.sprintIndex !== 0) {
            errors.push('L\'index du sprint est requis');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valider un email
     * @param {string} email - Email à valider
     * @returns {boolean} True si valide
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valider une URL
     * @param {string} url - URL à valider
     * @returns {boolean} True si valide
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Nettoyer une chaîne de caractères
     * @param {string} str - Chaîne à nettoyer
     * @returns {string} Chaîne nettoyée
     */
    static sanitizeString(str) {
        if (!str) return '';
        return str.trim().replace(/[<>]/g, '');
    }
}
