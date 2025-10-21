/**
 * ========================================
 * SPRINT MANAGER
 * ========================================
 * Gestion des sprints (CRUD et calculs)
 */

import { DateUtils } from '../utils/date-utils.js';
import { Validators } from '../utils/validators.js';
import { Formatters } from '../utils/formatters.js';

export class SprintManager {
    constructor(data) {
        this.data = data;
    }

    /**
     * Ajouter un sprint
     * @param {Object} sprint - Sprint à ajouter
     * @returns {boolean} True si ajouté avec succès
     */
    addSprint(sprint) {
        // Valider le sprint
        const validation = Validators.validateSprint(sprint);
        if (!validation.valid) {
            console.error("❌ Sprint invalide:", validation.errors);
            return false;
        }

        // Générer un ID si nécessaire
        if (!sprint.id) {
            sprint.id = this.generateSprintId();
        }

        // Ajouter le sprint
        this.data.sprints.push(sprint);
        
        // Trier par date de fin
        this.sortSprints();

        console.log("✅ Sprint ajouté:", sprint.name);
        return true;
    }

    /**
     * Mettre à jour un sprint
     * @param {string} sprintId - ID du sprint
     * @param {Object} updates - Modifications à appliquer
     * @returns {boolean} True si mis à jour avec succès
     */
    updateSprint(sprintId, updates) {
        const index = this.data.sprints.findIndex(s => s.id === sprintId);
        if (index === -1) {
            console.error("❌ Sprint non trouvé:", sprintId);
            return false;
        }

        // Appliquer les modifications
        this.data.sprints[index] = { ...this.data.sprints[index], ...updates };

        // Valider le sprint modifié
        const validation = Validators.validateSprint(this.data.sprints[index]);
        if (!validation.valid) {
            console.error("❌ Sprint invalide après modification:", validation.errors);
            return false;
        }

        // Trier par date de fin
        this.sortSprints();

        console.log("✅ Sprint mis à jour:", this.data.sprints[index].name);
        return true;
    }

    /**
     * Supprimer un sprint
     * @param {string} sprintId - ID du sprint
     * @returns {boolean} True si supprimé avec succès
     */
    deleteSprint(sprintId) {
        const index = this.data.sprints.findIndex(s => s.id === sprintId);
        if (index === -1) {
            console.error("❌ Sprint non trouvé:", sprintId);
            return false;
        }

        const sprintName = this.data.sprints[index].name;
        this.data.sprints.splice(index, 1);

        console.log("✅ Sprint supprimé:", sprintName);
        return true;
    }

    /**
     * Obtenir un sprint par ID
     * @param {string} sprintId - ID du sprint
     * @returns {Object|null} Sprint ou null
     */
    getSprint(sprintId) {
        return this.data.sprints.find(s => s.id === sprintId) || null;
    }

    /**
     * Obtenir tous les sprints
     * @returns {Array} Liste des sprints
     */
    getAllSprints() {
        return this.data.sprints;
    }

    /**
     * Obtenir les sprints terminés
     * @returns {Array} Liste des sprints terminés
     */
    getCompletedSprints() {
        const now = new Date();
        return this.data.sprints.filter(s => new Date(s.endDate) < now);
    }

    /**
     * Obtenir le sprint en cours
     * @returns {Object|null} Sprint en cours ou null
     */
    getCurrentSprint() {
        const now = new Date();
        return this.data.sprints.find(s => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            return start <= now && now <= end;
        }) || null;
    }

    /**
     * Calculer la durée d'un sprint
     * @param {Object} sprint - Sprint
     * @returns {number} Durée en jours
     */
    getSprintDuration(sprint) {
        return DateUtils.getDaysBetween(sprint.startDate, sprint.endDate);
    }

    /**
     * Calculer les jours ouvrés d'un sprint
     * @param {Object} sprint - Sprint
     * @returns {number} Jours ouvrés
     */
    getSprintWorkingDays(sprint) {
        return DateUtils.getWorkingDays(sprint.startDate, sprint.endDate);
    }

    /**
     * Calculer le taux de complétion d'un sprint
     * @param {Object} sprint - Sprint
     * @returns {number} Taux de complétion (0-1)
     */
    getCompletionRate(sprint) {
        if (!sprint.committed || sprint.committed === 0) return 0;
        return sprint.completed / sprint.committed;
    }

    /**
     * Vérifier si un sprint est terminé
     * @param {Object} sprint - Sprint
     * @returns {boolean} True si terminé
     */
    isSprintCompleted(sprint) {
        return new Date(sprint.endDate) < new Date();
    }

    /**
     * Générer un ID unique pour un sprint
     * @returns {string} ID unique
     */
    generateSprintId() {
        return `sprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Trier les sprints par date de fin
     */
    sortSprints() {
        this.data.sprints.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }

    /**
     * Obtenir le nombre total de sprints
     * @returns {number} Nombre de sprints
     */
    getSprintCount() {
        return this.data.sprints.length;
    }

    /**
     * Obtenir les statistiques des sprints
     * @returns {Object} Statistiques
     */
    getSprintStats() {
        const completed = this.getCompletedSprints();
        const totalCommitted = completed.reduce((sum, s) => sum + (s.committed || 0), 0);
        const totalCompleted = completed.reduce((sum, s) => sum + (s.completed || 0), 0);

        return {
            total: this.data.sprints.length,
            completed: completed.length,
            inProgress: this.getCurrentSprint() ? 1 : 0,
            totalCommitted,
            totalCompleted,
            averageCommitted: completed.length > 0 ? totalCommitted / completed.length : 0,
            averageCompleted: completed.length > 0 ? totalCompleted / completed.length : 0,
            completionRate: totalCommitted > 0 ? totalCompleted / totalCommitted : 0
        };
    }

    /**
     * Dupliquer un sprint
     * @param {string} sprintId - ID du sprint à dupliquer
     * @param {Object} overrides - Modifications à appliquer
     * @returns {Object|null} Nouveau sprint ou null
     */
    duplicateSprint(sprintId, overrides = {}) {
        const sprint = this.getSprint(sprintId);
        if (!sprint) {
            console.error("❌ Sprint non trouvé:", sprintId);
            return null;
        }

        const newSprint = {
            ...sprint,
            id: this.generateSprintId(),
            name: `${sprint.name} (copie)`,
            completed: 0,
            ...overrides
        };

        if (this.addSprint(newSprint)) {
            return newSprint;
        }

        return null;
    }

    /**
     * Obtenir le prochain numéro de sprint
     * @returns {number} Prochain numéro
     */
    getNextSprintNumber() {
        return this.data.sprints.length + 1;
    }

    /**
     * Créer un sprint par défaut
     * @param {Object} overrides - Modifications à appliquer
     * @returns {Object} Sprint créé
     */
    createDefaultSprint(overrides = {}) {
        const sprintNumber = this.getNextSprintNumber();
        const startDate = new Date();
        const endDate = DateUtils.addDays(startDate, this.data.settings.sprintLength || 14);

        return {
            id: this.generateSprintId(),
            name: `Sprint ${sprintNumber}`,
            startDate: DateUtils.toISODate(startDate),
            endDate: DateUtils.toISODate(endDate),
            committed: 0,
            completed: 0,
            goal: '',
            ...overrides
        };
    }
}
