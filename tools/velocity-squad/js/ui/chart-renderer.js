/**
 * ========================================
 * CHART RENDERER
 * ========================================
 * Rendu des graphiques Chart.js
 */

export class ChartRenderer {
    constructor() {
        this.charts = {};
    }

    /**
     * Créer un graphique de vélocité
     * @param {string} canvasId - ID du canvas
     * @param {Object} data - Données du graphique
     * @param {Array} annotations - Annotations à afficher
     * @returns {Object} Instance Chart.js
     */
    renderVelocityChart(canvasId, data, annotations = []) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Détruire le graphique existant
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Points'
                        }
                    }
                }
            }
        };

        // Ajouter les annotations si présentes
        if (annotations.length > 0) {
            config.options.plugins.annotation = {
                annotations: this.formatAnnotations(annotations)
            };
        }

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    /**
     * Créer un graphique burndown
     * @param {string} canvasId - ID du canvas
     * @param {Object} sprint - Sprint
     * @param {Array} actualData - Données réelles
     * @returns {Object} Instance Chart.js
     */
    renderBurndownChart(canvasId, sprint, actualData = []) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Détruire le graphique existant
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const duration = this.getSprintDuration(sprint);
        const labels = Array.from({ length: duration + 1 }, (_, i) => `Jour ${i}`);
        
        // Calculer le burndown idéal
        const idealData = this.calculateIdealBurndown(sprint.committed || 0, duration);

        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Idéal',
                        data: idealData,
                        borderColor: '#999',
                        borderDash: [5, 5],
                        fill: false
                    },
                    {
                        label: 'Réel',
                        data: actualData,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Points Restants'
                        }
                    }
                }
            }
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    /**
     * Créer un graphique burnup
     * @param {string} canvasId - ID du canvas
     * @param {Object} sprint - Sprint
     * @param {Array} actualData - Données réelles
     * @returns {Object} Instance Chart.js
     */
    renderBurnupChart(canvasId, sprint, actualData = []) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Détruire le graphique existant
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const duration = this.getSprintDuration(sprint);
        const labels = Array.from({ length: duration + 1 }, (_, i) => `Jour ${i}`);
        
        // Ligne de scope (total committed)
        const scopeData = Array(duration + 1).fill(sprint.committed || 0);

        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Scope',
                        data: scopeData,
                        borderColor: '#999',
                        borderDash: [5, 5],
                        fill: false
                    },
                    {
                        label: 'Complété',
                        data: actualData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Points Complétés'
                        }
                    }
                }
            }
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    /**
     * Créer un radar chart
     * @param {string} canvasId - ID du canvas
     * @param {Object} data - Données du radar
     * @returns {Object} Instance Chart.js
     */
    renderRadarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Détruire le graphique existant
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        };

        this.charts[canvasId] = new Chart(ctx, config);
        return this.charts[canvasId];
    }

    /**
     * Mettre à jour un graphique
     * @param {string} canvasId - ID du canvas
     * @param {Object} newData - Nouvelles données
     */
    updateChart(canvasId, newData) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update();
    }

    /**
     * Détruire un graphique
     * @param {string} canvasId - ID du canvas
     */
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    /**
     * Détruire tous les graphiques
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(canvasId => {
            this.destroyChart(canvasId);
        });
    }

    /**
     * Formater les annotations pour Chart.js
     * @param {Array} annotations - Annotations
     * @returns {Object} Annotations formatées
     */
    formatAnnotations(annotations) {
        const formatted = {};
        
        annotations.forEach((annotation, index) => {
            formatted[`annotation${index}`] = {
                type: 'line',
                xMin: annotation.sprintIndex,
                xMax: annotation.sprintIndex,
                borderColor: annotation.color || '#FF9800',
                borderWidth: 2,
                label: {
                    content: annotation.text,
                    enabled: true,
                    position: 'top'
                }
            };
        });

        return formatted;
    }

    /**
     * Calculer le burndown idéal
     * @param {number} committed - Points engagés
     * @param {number} duration - Durée en jours
     * @returns {Array} Points du burndown
     */
    calculateIdealBurndown(committed, duration) {
        const points = [];
        for (let day = 0; day <= duration; day++) {
            points.push(committed - (committed * day / duration));
        }
        return points;
    }

    /**
     * Obtenir la durée d'un sprint
     * @param {Object} sprint - Sprint
     * @returns {number} Durée en jours
     */
    getSprintDuration(sprint) {
        const start = new Date(sprint.startDate);
        const end = new Date(sprint.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    /**
     * Obtenir un graphique
     * @param {string} canvasId - ID du canvas
     * @returns {Object|null} Instance Chart.js ou null
     */
    getChart(canvasId) {
        return this.charts[canvasId] || null;
    }
}
