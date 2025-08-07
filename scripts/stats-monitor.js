#!/usr/bin/env node

/**
 * 🚨 Moniteur de stats et alertes
 * by DevBast - Combine analytics.js et generate-stats.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StatsMonitor {
    constructor() {
        this.logPath = process.env.LOG_PATH || '/var/log/nginx/agile-toolkit-access.log';
        this.deployPath = process.env.DEPLOY_PATH || '/sites/drafts/agile-coach-toolkit';
        this.webhookUrl = process.env.WEBHOOK_URL;
    }

    async runFullAnalysis() {
        console.log('🚀 Analyse complète des stats...\n');

        try {
            // 1. Analyse en temps réel (comme analytics.js)
            const liveStats = this.analyzeLiveLogs();
            this.displayLiveStats(liveStats);

            // 2. Génération du dashboard (comme generate-stats.js)
            const { StatsGenerator } = await import('./generate-stats.js');
            const generator = new StatsGenerator(this.deployPath);
            await generator.generateStats();

            // 3. Vérification d'alertes
            this.checkAlerts(liveStats);

            console.log('\n✅ Analyse terminée avec succès!');

        } catch (error) {
            console.error('❌ Erreur lors de l\'analyse:', error);
            this.sendAlert(`Erreur stats: ${error.message}`);
        }
    }

    analyzeLiveLogs() {
        if (!fs.existsSync(this.logPath)) {
            console.log('⚠️ Fichier de log introuvable');
            return this.getMockStats();
        }

        const logs = fs.readFileSync(this.logPath, 'utf8');
        const lines = logs.split('\n').filter(line => line.trim());

        // Analyse des dernières 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentLines = lines.filter(line => {
            const dateMatch = line.match(/\[([^\]]+)\]/);
            if (dateMatch) {
                try {
                    const logDate = new Date(dateMatch[1].split(':')[0]);
                    return logDate > oneDayAgo;
                } catch (e) {
                    return false;
                }
            }
            return false;
        });

        return {
            totalVisits: lines.length,
            recentVisits: recentLines.length,
            topPages: this.getTopPages(recentLines),
            errorRate: this.getErrorRate(recentLines),
            uniqueIPs: this.getUniqueIPs(recentLines),
            avgResponseTime: this.getAvgResponseTime(recentLines)
        };
    }

    displayLiveStats(stats) {
        console.log('📊 STATS TEMPS RÉEL (24h)\n');
        console.log(`👥 Visites récentes: ${stats.recentVisits}`);
        console.log(`🌐 IPs uniques: ${stats.uniqueIPs}`);
        console.log(`❌ Taux d'erreur: ${(stats.errorRate * 100).toFixed(2)}%`);
        console.log(`⚡ Temps réponse moyen: ${stats.avgResponseTime}ms\n`);

        console.log('🔝 Pages les plus consultées:');
        stats.topPages.forEach((page, i) => {
            console.log(`  ${i + 1}. ${page.page} (${page.count} vues)`);
        });
    }

    checkAlerts(stats) {
        const alerts = [];

        // Alerte si taux d'erreur > 5%
        if (stats.errorRate > 0.05) {
            alerts.push(`🚨 Taux d'erreur élevé: ${(stats.errorRate * 100).toFixed(2)}%`);
        }

        // Alerte si temps de réponse > 2s
        if (stats.avgResponseTime > 2000) {
            alerts.push(`⏰ Temps de réponse lent: ${stats.avgResponseTime}ms`);
        }

        // Alerte si pas de visite depuis 2h
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
        if (stats.recentVisits === 0) {
            alerts.push('📵 Aucune visite depuis 2h');
        }

        // Envoi des alertes
        if (alerts.length > 0) {
            console.log('\n🚨 ALERTES DÉTECTÉES:');
            alerts.forEach(alert => console.log(`  ${alert}`));
            
            if (this.webhookUrl) {
                this.sendAlert(alerts.join(' | '));
            }
        }
    }

    sendAlert(message) {
        if (!this.webhookUrl) return;

        const payload = {
            text: `🚨 Coach Agile Toolkit - ${message}`,
            channel: '#monitoring',
            username: 'DevBast Monitor'
        };

        // Utilisation de fetch native Node.js 18+
        fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.error('❌ Erreur envoi alerte:', err);
        });
    }

    // Méthodes utilitaires (extraction depuis analytics.js)
    getTopPages(lines) {
        const pages = {};
        lines.forEach(line => {
            const urlMatch = line.match(/GET ([^\s\?]+)/);
            if (urlMatch) {
                const url = urlMatch[1];
                pages[url] = (pages[url] || 0) + 1;
            }
        });

        return Object.entries(pages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([page, count]) => ({ page, count }));
    }

    getErrorRate(lines) {
        if (lines.length === 0) return 0;
        
        const errors = lines.filter(line => 
            line.match(/HTTP\/1\.1" [45]\d\d/)
        ).length;
        
        return errors / lines.length;
    }

    getUniqueIPs(lines) {
        const ips = new Set();
        lines.forEach(line => {
            const ipMatch = line.match(/^([^\s]+)/);
            if (ipMatch) ips.add(ipMatch[1]);
        });
        return ips.size;
    }

    getAvgResponseTime(lines) {
        const times = [];
        lines.forEach(line => {
            const timeMatch = line.match(/(\d+)$/);
            if (timeMatch) {
                times.push(parseInt(timeMatch[1]));
            }
        });
        
        if (times.length === 0) return 0;
        return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    }

    getMockStats() {
        return {
            totalVisits: 150,
            recentVisits: 25,
            topPages: [
                { page: '/index.html', count: 12 },
                { page: '/retrospectives.html', count: 8 },
                { page: '/estimations.html', count: 5 }
            ],
            errorRate: 0.02,
            uniqueIPs: 15,
            avgResponseTime: 450
        };
    }
}

// Exécution
if (import.meta.url === `file://${process.argv[1]}`) {
    const monitor = new StatsMonitor();
    
    const command = process.argv[2] || 'full';
    
    switch (command) {
        case 'live':
            const stats = monitor.analyzeLiveLogs();
            monitor.displayLiveStats(stats);
            break;
        case 'alerts':
            const alertStats = monitor.analyzeLiveLogs();
            monitor.checkAlerts(alertStats);
            break;
        case 'full':
        default:
            monitor.runFullAnalysis();
            break;
    }
}

export default StatsMonitor;
