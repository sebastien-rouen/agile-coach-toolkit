/**
 * ========================================
 * COACHING MANAGER
 * ========================================
 * Gestion des conseils de coaching intelligents
 */

export class CoachingManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    /**
     * Afficher les insights de coaching
     */
    showCoachingInsights() {
        const container = document.getElementById('coachingAlerts');
        if (!container) return;

        const alerts = this.generateAdvancedAlerts();
        const groupedAlerts = this.groupSimilarAlerts(alerts);

        container.innerHTML = groupedAlerts.length > 0
            ? groupedAlerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    ${alert.icon} ${alert.message}
                    ${alert.details ? `<div class="alert-details">${alert.details}</div>` : ''}
                </div>
            `).join('')
            : `<div class="alert alert-info">💡 Ajoutez plus de sprints pour recevoir des conseils personnalisés</div>`;
    }

    /**
     * Regrouper les alertes similaires
     */
    groupSimilarAlerts(alerts) {
        const grouped = [];
        const busFactor = alerts.filter(a => a.message.includes('Bus factor'));
        const others = alerts.filter(a => !a.message.includes('Bus factor'));

        // Regrouper les Bus Factor
        if (busFactor.length > 0) {
            const skills = busFactor.map(a => {
                const match = a.message.match(/"([^"]+)"/);
                return match ? match[1] : '';
            }).filter(Boolean);

            grouped.push({
                type: 'warning',
                icon: '🚌',
                message: `Bus factor critique détecté sur ${busFactor.length} compétence${busFactor.length > 1 ? 's' : ''}`,
                details: `Compétences à risque : <strong>${skills.join(', ')}</strong><br>
                         <small>💡 Conseil : Organisez du pair programming pour partager ces compétences</small>`
            });
        }

        // Ajouter les autres alertes
        grouped.push(...others);

        return grouped;
    }

    /**
     * Générer toutes les alertes avancées
     */
    generateAdvancedAlerts() {
        return [
            ...this.generateCoachingAlerts(),
            ...this.detectBusFactor(),
            ...this.detectAnomalies()
        ];
    }

    /**
     * Générer les alertes de coaching basiques
     */
    generateCoachingAlerts() {
        const alerts = [];
        const sprints = this.data.sprints || [];
        
        if (sprints.length < 3) {
            return alerts;
        }

        const velocities = sprints.map(s => s.velocity || s.completed || 0);
        const lastVelocities = velocities.slice(-3);
        const avgVelocity = lastVelocities.reduce((a, b) => a + b, 0) / lastVelocities.length;

        // Vélocité en baisse
        if (lastVelocities.length >= 3) {
            const isDecreasing = lastVelocities[0] > lastVelocities[1] && lastVelocities[1] > lastVelocities[2];
            if (isDecreasing) {
                alerts.push({
                    type: 'warning',
                    icon: '📉',
                    message: 'Vélocité en baisse constante sur les 3 derniers sprints',
                    details: '💡 Conseil : Organisez une rétrospective pour identifier les blocages'
                });
            }
        }

        // Vélocité instable
        const stdDev = this.calculateStdDev(lastVelocities);
        if (stdDev > avgVelocity * 0.3) {
            alerts.push({
                type: 'info',
                icon: '📊',
                message: 'Vélocité instable détectée',
                details: '💡 Conseil : Revoyez votre estimation et votre définition of Done'
            });
        }

        return alerts;
    }

    /**
     * Détecter le bus factor
     */
    detectBusFactor() {
        const alerts = [];
        const team = this.data.team || [];

        if (team.length === 0) return alerts;

        // Analyser les compétences
        const skillsMap = {};
        team.forEach(member => {
            const skills = member.skills || [];
            skills.forEach(skill => {
                if (!skillsMap[skill]) {
                    skillsMap[skill] = [];
                }
                skillsMap[skill].push(member.name);
            });
        });

        // Trouver les compétences critiques (1 seule personne)
        Object.entries(skillsMap).forEach(([skill, members]) => {
            if (members.length === 1) {
                alerts.push({
                    type: 'warning',
                    icon: '🚌',
                    message: `Bus factor critique sur "${skill}"`,
                    details: `Seul ${members[0]} maîtrise cette compétence`
                });
            }
        });

        return alerts;
    }

    /**
     * Détecter les anomalies
     */
    detectAnomalies() {
        const alerts = [];
        const sprints = this.data.sprints || [];

        if (sprints.length < 5) return alerts;

        const velocities = sprints.map(s => s.velocity || s.completed || 0);
        const avg = velocities.reduce((a, b) => a + b, 0) / velocities.length;
        const stdDev = this.calculateStdDev(velocities);

        // Détecter les sprints anormaux
        sprints.forEach((sprint, index) => {
            const velocity = sprint.velocity || sprint.completed || 0;
            const zScore = Math.abs((velocity - avg) / stdDev);

            if (zScore > 2) {
                alerts.push({
                    type: 'info',
                    icon: '⚠️',
                    message: `Anomalie détectée sur ${sprint.name}`,
                    details: `Vélocité ${velocity > avg ? 'exceptionnellement haute' : 'exceptionnellement basse'} (${velocity} points)`
                });
            }
        });

        return alerts;
    }

    /**
     * Calculer l'écart-type
     */
    calculateStdDev(values) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }
}
