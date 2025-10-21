/**
 * ========================================
 * VELOCITY MANAGER
 * ========================================
 * Calculs de vélocité et prédictions
 */

import { Formatters } from '../utils/formatters.js';

export class VelocityManager {
    constructor(data) {
        this.data = data;
    }

    /**
     * Calculer la vélocité moyenne
     * @param {number} lastN - Nombre de sprints à considérer (0 = tous)
     * @returns {number} Vélocité moyenne
     */
    calculateAverageVelocity(lastN = 0) {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) return 0;

        const sprints = lastN > 0 
            ? completedSprints.slice(-lastN)
            : completedSprints;

        const total = sprints.reduce((sum, sprint) => sum + (sprint.completed || 0), 0);
        return sprints.length > 0 ? total / sprints.length : 0;
    }

    /**
     * Calculer la vélocité médiane
     * @param {number} lastN - Nombre de sprints à considérer
     * @returns {number} Vélocité médiane
     */
    calculateMedianVelocity(lastN = 0) {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) return 0;

        const sprints = lastN > 0 
            ? completedSprints.slice(-lastN)
            : completedSprints;

        const velocities = sprints.map(s => s.completed || 0).sort((a, b) => a - b);
        const mid = Math.floor(velocities.length / 2);

        return velocities.length % 2 === 0
            ? (velocities[mid - 1] + velocities[mid]) / 2
            : velocities[mid];
    }

    /**
     * Calculer l'écart-type de la vélocité
     * @param {number} lastN - Nombre de sprints à considérer
     * @returns {number} Écart-type
     */
    calculateVelocityStdDev(lastN = 0) {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) return 0;

        const sprints = lastN > 0 
            ? completedSprints.slice(-lastN)
            : completedSprints;

        const avg = this.calculateAverageVelocity(lastN);
        const squaredDiffs = sprints.map(s => Math.pow((s.completed || 0) - avg, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / sprints.length;

        return Math.sqrt(variance);
    }

    /**
     * Prédire la vélocité du prochain sprint
     * @param {string} method - Méthode de prédiction (average, median, weighted)
     * @returns {Object} Prédiction avec intervalle de confiance
     */
    predictNextVelocity(method = 'average') {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) {
            return { prediction: 0, min: 0, max: 0, confidence: 0 };
        }

        let prediction = 0;

        switch (method) {
            case 'median':
                prediction = this.calculateMedianVelocity(3);
                break;
            case 'weighted':
                prediction = this.calculateWeightedVelocity();
                break;
            case 'average':
            default:
                prediction = this.calculateAverageVelocity(3);
                break;
        }

        const stdDev = this.calculateVelocityStdDev(3);
        const confidence = completedSprints.length >= 3 ? 0.8 : 0.5;

        return {
            prediction: Math.round(prediction),
            min: Math.max(0, Math.round(prediction - stdDev)),
            max: Math.round(prediction + stdDev),
            confidence
        };
    }

    /**
     * Calculer la vélocité pondérée (plus de poids aux sprints récents)
     * @returns {number} Vélocité pondérée
     */
    calculateWeightedVelocity() {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) return 0;

        const last3 = completedSprints.slice(-3);
        let weightedSum = 0;
        let totalWeight = 0;

        last3.forEach((sprint, index) => {
            const weight = index + 1; // Plus récent = plus de poids
            weightedSum += (sprint.completed || 0) * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    /**
     * Calculer le taux de complétion moyen
     * @returns {number} Taux de complétion (0-1)
     */
    calculateAverageCompletionRate() {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) return 0;

        const rates = completedSprints
            .filter(s => s.committed > 0)
            .map(s => s.completed / s.committed);

        return rates.length > 0 
            ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length 
            : 0;
    }

    /**
     * Calculer la tendance de vélocité
     * @returns {string} Tendance (increasing, decreasing, stable)
     */
    calculateVelocityTrend() {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length < 3) return 'stable';

        const last3 = completedSprints.slice(-3);
        const velocities = last3.map(s => s.completed || 0);

        const firstHalf = velocities.slice(0, Math.ceil(velocities.length / 2));
        const secondHalf = velocities.slice(Math.ceil(velocities.length / 2));

        const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

        const diff = avgSecond - avgFirst;
        const threshold = avgFirst * 0.1; // 10% de différence

        if (diff > threshold) return 'increasing';
        if (diff < -threshold) return 'decreasing';
        return 'stable';
    }

    /**
     * Calculer le nombre de sprints nécessaires pour terminer un backlog
     * @param {number} backlogPoints - Points restants dans le backlog
     * @returns {Object} Estimation avec min/max
     */
    estimateSprintsToComplete(backlogPoints) {
        const prediction = this.predictNextVelocity();
        
        if (prediction.prediction === 0) {
            return { sprints: 0, min: 0, max: 0 };
        }

        return {
            sprints: Math.ceil(backlogPoints / prediction.prediction),
            min: Math.ceil(backlogPoints / prediction.max),
            max: Math.ceil(backlogPoints / prediction.min)
        };
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
     * Calculer les métriques de qualité
     * @returns {Object} Métriques de qualité
     */
    calculateQualityMetrics() {
        const completedSprints = this.getCompletedSprints();
        
        if (completedSprints.length === 0) {
            return {
                averageVelocity: 0,
                medianVelocity: 0,
                stdDev: 0,
                completionRate: 0,
                trend: 'stable',
                consistency: 0
            };
        }

        const avgVelocity = this.calculateAverageVelocity();
        const stdDev = this.calculateVelocityStdDev();
        
        // Consistance = inverse du coefficient de variation
        const consistency = avgVelocity > 0 ? 1 - (stdDev / avgVelocity) : 0;

        return {
            averageVelocity: Math.round(avgVelocity),
            medianVelocity: Math.round(this.calculateMedianVelocity()),
            stdDev: Math.round(stdDev),
            completionRate: this.calculateAverageCompletionRate(),
            trend: this.calculateVelocityTrend(),
            consistency: Math.max(0, Math.min(1, consistency))
        };
    }

    /**
     * Obtenir les données pour le graphique de vélocité
     * @returns {Object} Données Chart.js
     */
    getVelocityChartData() {
        const sprints = this.data.sprints;
        
        return {
            labels: sprints.map((s, i) => s.name || `Sprint ${i + 1}`),
            datasets: [
                {
                    label: 'Engagé',
                    data: sprints.map(s => s.committed || 0),
                    backgroundColor: 'rgba(33, 150, 243, 0.5)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Complété',
                    data: sprints.map(s => s.completed || 0),
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2
                }
            ]
        };
    }

    /**
     * Calculer le burndown idéal
     * @param {Object} sprint - Sprint
     * @returns {Array} Points du burndown idéal
     */
    calculateIdealBurndown(sprint) {
        const duration = this.getSprintDuration(sprint);
        const committed = sprint.committed || 0;
        const points = [];

        for (let day = 0; day <= duration; day++) {
            points.push(committed - (committed * day / duration));
        }

        return points;
    }

    /**
     * Obtenir le sprint duration
     * @param {Object} sprint - Sprint
     * @returns {number} Durée en jours
     */
    getSprintDuration(sprint) {
        const start = new Date(sprint.startDate);
        const end = new Date(sprint.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    /**
     * Mettre à jour les KPIs dans l'interface
     */
    updateKPIsUI() {
        const sprints = this.data.sprints || [];
        
        // Éléments DOM
        const avgVelocityEl = document.getElementById('avgVelocity');
        const predictedNextEl = document.getElementById('predictedNext');
        const teamHealthEl = document.getElementById('teamHealth');

        if (!avgVelocityEl || !predictedNextEl || !teamHealthEl) return;

        if (sprints.length === 0) {
            avgVelocityEl.textContent = '-';
            predictedNextEl.textContent = '-';
            teamHealthEl.textContent = '-';
            return;
        }

        // Vélocité moyenne
        const avgVelocity = this.calculateAverageVelocity();
        avgVelocityEl.textContent = Math.round(avgVelocity);

        // Prédiction sprint +1
        const prediction = this.predictNextVelocity();
        predictedNextEl.textContent = prediction.prediction;

        // Santé équipe (basée sur la tendance)
        const trend = this.calculateVelocityTrend();
        const healthIcon = trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️';
        teamHealthEl.textContent = healthIcon;
    }
}
