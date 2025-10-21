/**
 * Gestionnaire des métriques de flux Kanban
 * Calcule et affiche les métriques clés : Lead Time, Throughput, CFD, etc.
 */

class FlowMetrics {
    constructor() {
        this.completedPatients = [];
        this.metricsHistory = [];
        this.currentMetrics = {
            leadTime: 0,
            cycleTime: 0,
            throughput: 0,
            satisfaction: 0,
            wipTotal: 0
        };
        
        this.initializeEventListeners();
        this.startMetricsCollection();
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    initializeEventListeners() {
        document.addEventListener('patientCompleted', (event) => {
            this.recordCompletedPatient(event.detail.patient);
        });
        
        document.addEventListener('metricsUpdate', (event) => {
            this.updateMetrics(event.detail.board);
        });
    }
    
    /**
     * Enregistre un patient terminé pour les calculs de métriques
     */
    recordCompletedPatient(patient) {
        this.completedPatients.push({
            ...patient,
            completedAt: new Date()
        });
        
        // Garder seulement les 100 derniers patients pour les calculs
        if (this.completedPatients.length > 100) {
            this.completedPatients.shift();
        }
        
        this.calculateMetrics();
        this.updateMetricsDisplay();
    }
    
    /**
     * Met à jour les métriques en temps réel
     */
    updateMetrics(board) {
        if (!board) return;
        
        const boardData = board.getBoardData();
        this.currentMetrics.wipTotal = boardData.totalPatients;
        
        this.calculateMetrics();
        this.updateMetricsDisplay();
    }
    
    /**
     * Calcule toutes les métriques
     */
    calculateMetrics() {
        this.calculateLeadTime();
        this.calculateCycleTime();
        this.calculateThroughput();
        this.calculateSatisfaction();
        this.recordMetricsSnapshot();
    }
    
    /**
     * Calcule le Lead Time moyen
     */
    calculateLeadTime() {
        if (this.completedPatients.length === 0) {
            this.currentMetrics.leadTime = 0;
            return;
        }
        
        // Lead Time des 20 derniers patients
        const recentPatients = this.completedPatients.slice(-20);
        const totalLeadTime = recentPatients.reduce((sum, patient) => sum + patient.leadTime, 0);
        
        this.currentMetrics.leadTime = Math.round(totalLeadTime / recentPatients.length);
    }
    
    /**
     * Calcule le Cycle Time moyen
     */
    calculateCycleTime() {
        if (this.completedPatients.length === 0) {
            this.currentMetrics.cycleTime = 0;
            return;
        }
        
        const recentPatients = this.completedPatients.slice(-20);
        const totalCycleTime = recentPatients.reduce((sum, patient) => sum + patient.cycleTime, 0);
        
        this.currentMetrics.cycleTime = Math.round(totalCycleTime / recentPatients.length);
    }
    
    /**
     * Calcule le Throughput (patients traités par jour)
     */
    calculateThroughput() {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const patientsLast24h = this.completedPatients.filter(patient => 
            patient.completedAt >= oneDayAgo
        );
        
        this.currentMetrics.throughput = patientsLast24h.length;
    }
    
    /**
     * Calcule la satisfaction moyenne
     */
    calculateSatisfaction() {
        if (this.completedPatients.length === 0) {
            this.currentMetrics.satisfaction = 0;
            return;
        }
        
        const recentPatients = this.completedPatients.slice(-20);
        const totalSatisfaction = recentPatients.reduce((sum, patient) => sum + patient.satisfaction, 0);
        
        this.currentMetrics.satisfaction = Math.round(totalSatisfaction / recentPatients.length);
    }
    
    /**
     * Enregistre un instantané des métriques pour l'historique
     */
    recordMetricsSnapshot() {
        const snapshot = {
            timestamp: new Date(),
            ...this.currentMetrics
        };
        
        this.metricsHistory.push(snapshot);
        
        // Garder seulement les 24 dernières heures d'historique (1 point par minute)
        if (this.metricsHistory.length > 1440) {
            this.metricsHistory.shift();
        }
    }
    
    /**
     * Met à jour l'affichage des métriques
     */
    updateMetricsDisplay() {
        // Lead Time
        const leadTimeElement = document.getElementById('leadTime');
        if (leadTimeElement) {
            leadTimeElement.textContent = this.formatTime(this.currentMetrics.leadTime);
            this.updateMetricStatus(leadTimeElement, this.currentMetrics.leadTime, 180); // 3h = seuil
        }
        
        // Throughput
        const throughputElement = document.getElementById('throughput');
        if (throughputElement) {
            throughputElement.textContent = `${this.currentMetrics.throughput}/jour`;
            this.updateMetricStatus(throughputElement, this.currentMetrics.throughput, 15); // 15 patients/jour = objectif
        }
        
        // Urgences en attente (calculé en temps réel)
        this.updateUrgentCount();
        
        // Satisfaction
        const satisfactionElement = document.getElementById('satisfaction');
        if (satisfactionElement) {
            satisfactionElement.textContent = `${this.currentMetrics.satisfaction}%`;
            this.updateMetricStatus(satisfactionElement, this.currentMetrics.satisfaction, 80); // 80% = seuil
        }
    }
    
    /**
     * Met à jour le statut visuel d'une métrique
     */
    updateMetricStatus(element, value, threshold) {
        element.classList.remove('good', 'warning', 'critical');
        
        if (value >= threshold) {
            element.classList.add('good');
        } else if (value >= threshold * 0.7) {
            element.classList.add('warning');
        } else {
            element.classList.add('critical');
        }
    }
    
    /**
     * Met à jour le compteur d'urgences en attente
     */
    updateUrgentCount() {
        const urgentElement = document.getElementById('urgentCount');
        if (!urgentElement) return;
        
        // Compter les patients urgents et critiques dans toutes les colonnes sauf sortie
        let urgentCount = 0;
        document.querySelectorAll('.patient-card.urgent, .patient-card.expedite').forEach(card => {
            const column = card.closest('.board-column');
            if (column && column.dataset.column !== 'sortie') {
                urgentCount++;
            }
        });
        
        urgentElement.textContent = urgentCount;
        
        // Alerte si trop d'urgences en attente
        if (urgentCount >= 5) {
            urgentElement.classList.add('critical');
            this.triggerUrgentAlert(urgentCount);
        } else if (urgentCount >= 3) {
            urgentElement.classList.add('warning');
            urgentElement.classList.remove('critical');
        } else {
            urgentElement.classList.remove('warning', 'critical');
        }
    }
    
    /**
     * Déclenche une alerte pour trop d'urgences
     */
    triggerUrgentAlert(count) {
        const event = new CustomEvent('urgentAlert', {
            detail: {
                count: count,
                message: `${count} patients urgents en attente ! Risque de dégradation de la qualité des soins.`,
                suggestions: [
                    'Prioriser le traitement des urgences',
                    'Augmenter temporairement les ressources',
                    'Rediriger vers d\'autres services si possible',
                    'Activer le plan de gestion de crise'
                ]
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Formate un temps en minutes vers un format lisible
     */
    formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes}min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h${mins.toString().padStart(2, '0')}`;
        }
    }
    
    /**
     * Démarre la collecte périodique de métriques
     */
    startMetricsCollection() {
        // Mise à jour des métriques toutes les minutes
        setInterval(() => {
            this.calculateMetrics();
            this.updateMetricsDisplay();
        }, 60000);
        
        // Mise à jour de l'affichage toutes les 5 secondes
        setInterval(() => {
            this.updateMetricsDisplay();
        }, 5000);
    }
    
    /**
     * Génère un rapport de performance
     */
    generatePerformanceReport() {
        const report = {
            period: '24 dernières heures',
            metrics: {
                leadTime: {
                    current: this.currentMetrics.leadTime,
                    target: 180, // 3 heures
                    status: this.currentMetrics.leadTime <= 180 ? 'good' : 'needs_improvement'
                },
                throughput: {
                    current: this.currentMetrics.throughput,
                    target: 15,
                    status: this.currentMetrics.throughput >= 15 ? 'good' : 'needs_improvement'
                },
                satisfaction: {
                    current: this.currentMetrics.satisfaction,
                    target: 80,
                    status: this.currentMetrics.satisfaction >= 80 ? 'good' : 'needs_improvement'
                }
            },
            recommendations: this.generateRecommendations(),
            completedPatients: this.completedPatients.length,
            averageWaitTime: this.calculateAverageWaitTime()
        };
        
        return report;
    }
    
    /**
     * Génère des recommandations d'amélioration
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.currentMetrics.leadTime > 180) {
            recommendations.push({
                type: 'lead_time',
                priority: 'high',
                message: 'Le Lead Time dépasse 3 heures. Identifier les goulots d\'étranglement.',
                actions: [
                    'Analyser les temps d\'attente par étape',
                    'Augmenter les WIP limits des colonnes saturées',
                    'Optimiser les processus de traitement'
                ]
            });
        }
        
        if (this.currentMetrics.throughput < 15) {
            recommendations.push({
                type: 'throughput',
                priority: 'medium',
                message: 'Le débit est inférieur à l\'objectif de 15 patients/jour.',
                actions: [
                    'Augmenter les ressources aux heures de pointe',
                    'Paralléliser certains traitements',
                    'Réduire les temps de traitement non-critiques'
                ]
            });
        }
        
        if (this.currentMetrics.satisfaction < 80) {
            recommendations.push({
                type: 'satisfaction',
                priority: 'high',
                message: 'La satisfaction patient est en dessous de 80%.',
                actions: [
                    'Améliorer la communication avec les patients',
                    'Réduire les temps d\'attente',
                    'Former le personnel à l\'accueil'
                ]
            });
        }
        
        return recommendations;
    }
    
    /**
     * Calcule le temps d'attente moyen
     */
    calculateAverageWaitTime() {
        if (this.completedPatients.length === 0) return 0;
        
        const recentPatients = this.completedPatients.slice(-20);
        const totalWaitTime = recentPatients.reduce((sum, patient) => {
            return sum + (patient.leadTime - patient.cycleTime);
        }, 0);
        
        return Math.round(totalWaitTime / recentPatients.length);
    }
    
    /**
     * Exporte les données pour analyse
     */
    exportMetricsData() {
        return {
            currentMetrics: this.currentMetrics,
            history: this.metricsHistory,
            completedPatients: this.completedPatients,
            report: this.generatePerformanceReport()
        };
    }
    
    /**
     * Détecte les tendances dans les métriques
     */
    detectTrends() {
        if (this.metricsHistory.length < 10) return null;
        
        const recent = this.metricsHistory.slice(-10);
        const older = this.metricsHistory.slice(-20, -10);
        
        const trends = {};
        
        ['leadTime', 'throughput', 'satisfaction'].forEach(metric => {
            const recentAvg = recent.reduce((sum, m) => sum + m[metric], 0) / recent.length;
            const olderAvg = older.reduce((sum, m) => sum + m[metric], 0) / older.length;
            
            const change = ((recentAvg - olderAvg) / olderAvg) * 100;
            
            trends[metric] = {
                direction: change > 5 ? 'improving' : change < -5 ? 'degrading' : 'stable',
                change: Math.round(change)
            };
        });
        
        return trends;
    }
}

// Export pour utilisation dans d'autres modules
window.FlowMetrics = FlowMetrics;