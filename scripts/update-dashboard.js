#!/usr/bin/env node

/**
 * 🔄 Mise à jour du dashboard avec les analytics privés
 * Intègre les données locales avec le système existant
 * by DevBast
 */

import fs from 'fs';
import path from 'path';

class DashboardUpdater {
    constructor() {
        this.dashboardPath = './logs/usage-stats.json';
        this.analyticsDataPath = './logs/analytics-data.json';
    }

    /**
     * Met à jour le dashboard avec les nouvelles données
     */
    async updateDashboard() {
        try {
            console.log('🔄 Mise à jour du dashboard...');
            
            // Lecture des données existantes
            const existingData = this.readExistingData();
            
            // Simulation de données analytics (en production, elles viendraient du localStorage)
            const analyticsData = this.generateSampleAnalyticsData();
            
            // Fusion des données
            const mergedData = this.mergeData(existingData, analyticsData);
            
            // Sauvegarde
            this.saveData(mergedData);
            
            console.log('✅ Dashboard mis à jour avec succès');
            console.log(`📊 ${mergedData.totalVisits} visites totales`);
            console.log(`🔧 ${mergedData.tools.length} outils trackés`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour:', error.message);
        }
    }

    /**
     * Lit les données existantes du dashboard
     */
    readExistingData() {
        try {
            if (fs.existsSync(this.dashboardPath)) {
                const data = fs.readFileSync(this.dashboardPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('⚠️ Impossible de lire les données existantes:', error.message);
        }
        
        return this.getDefaultData();
    }

    /**
     * Génère des données d'exemple (en production, elles viendraient du navigateur)
     */
    generateSampleAnalyticsData() {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Simulation de données réalistes
        const pages = [
            { page: '/index.html', count: Math.floor(Math.random() * 50) + 20 },
            { page: '/tools/planning-poker/', count: Math.floor(Math.random() * 30) + 10 },
            { page: '/tools/example-mapping/', count: Math.floor(Math.random() * 25) + 8 },
            { page: '/tools/velocity-squad/', count: Math.floor(Math.random() * 20) + 5 },
            { page: '/stats.html', count: Math.floor(Math.random() * 15) + 3 }
        ];

        const tools = [
            { tool: 'planning-poker', count: Math.floor(Math.random() * 30) + 10 },
            { tool: 'example-mapping', count: Math.floor(Math.random() * 25) + 8 },
            { tool: 'velocity-squad', count: Math.floor(Math.random() * 20) + 5 },
            { tool: 'agile-fluency', count: Math.floor(Math.random() * 15) + 3 }
        ];

        // Génération des visites quotidiennes
        const dailyVisits = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                visits: Math.floor(Math.random() * 20) + 5
            };
        }).reverse();

        // Métriques de performance simulées
        const performance = {
            loadTime: Math.floor(Math.random() * 1000) + 500, // 500-1500ms
            FCP: Math.floor(Math.random() * 800) + 400,       // 400-1200ms
            LCP: Math.floor(Math.random() * 1200) + 800,      // 800-2000ms
            CLS: Math.round((Math.random() * 0.1) * 1000) / 1000, // 0-0.1
            FID: Math.floor(Math.random() * 50) + 10          // 10-60ms
        };

        return {
            generatedAt: now.toISOString(),
            totalVisits: pages.reduce((sum, page) => sum + page.count, 0),
            uniqueSessions: Math.floor(Math.random() * 50) + 20,
            pages: pages.sort((a, b) => b.count - a.count),
            tools: tools.sort((a, b) => b.count - a.count),
            dailyVisits,
            performance,
            errors: Math.floor(Math.random() * 5), // 0-5 erreurs
            lastVisit: now.toISOString()
        };
    }

    /**
     * Fusionne les données existantes avec les nouvelles
     */
    mergeData(existingData, analyticsData) {
        return {
            ...existingData,
            ...analyticsData,
            // Garde certaines données existantes si pertinentes
            generatedAt: analyticsData.generatedAt,
            // Ajoute les nouvelles métriques
            performance: analyticsData.performance,
            uniqueSessions: analyticsData.uniqueSessions,
            errors: analyticsData.errors
        };
    }

    /**
     * Sauvegarde les données mises à jour
     */
    saveData(data) {
        try {
            // Sauvegarde principale
            fs.writeFileSync(this.dashboardPath, JSON.stringify(data, null, 2));
            
            // Sauvegarde de backup avec timestamp
            const backupPath = `./logs/usage-stats-${Date.now()}.json`;
            fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
            
            // Nettoyage des anciens backups (garde les 5 derniers)
            this.cleanupBackups();
            
        } catch (error) {
            throw new Error(`Impossible de sauvegarder: ${error.message}`);
        }
    }

    /**
     * Nettoie les anciens fichiers de backup
     */
    cleanupBackups() {
        try {
            const files = fs.readdirSync('./logs/')
                .filter(file => file.startsWith('usage-stats-') && file.endsWith('.json'))
                .map(file => ({
                    name: file,
                    path: path.join('./logs/', file),
                    time: fs.statSync(path.join('./logs/', file)).mtime
                }))
                .sort((a, b) => b.time - a.time);

            // Supprime les fichiers au-delà des 5 plus récents
            files.slice(5).forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`🗑️ Backup supprimé: ${file.name}`);
            });
            
        } catch (error) {
            console.warn('⚠️ Nettoyage des backups échoué:', error.message);
        }
    }

    /**
     * Données par défaut si aucune donnée existante
     */
    getDefaultData() {
        return {
            generatedAt: new Date().toISOString(),
            totalVisits: 0,
            uniqueSessions: 0,
            pages: [],
            tools: [],
            dailyVisits: Array.from({ length: 7 }, (_, i) => {
                const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
                return {
                    date: date.toISOString().split('T')[0],
                    visits: 0
                };
            }).reverse(),
            performance: null,
            errors: 0,
            lastVisit: null
        };
    }

    /**
     * Génère un rapport de performance
     */
    generatePerformanceReport(data) {
        if (!data.performance) return null;

        const { loadTime, FCP, LCP, CLS, FID } = data.performance;
        
        const getScore = (metric, value) => {
            const thresholds = {
                loadTime: { good: 1500, poor: 3000 },
                FCP: { good: 1800, poor: 3000 },
                LCP: { good: 2500, poor: 4000 },
                CLS: { good: 0.1, poor: 0.25 },
                FID: { good: 100, poor: 300 }
            };

            const threshold = thresholds[metric];
            if (!threshold || value === null) return 'unknown';
            
            if (value <= threshold.good) return 'good';
            if (value <= threshold.poor) return 'needs-improvement';
            return 'poor';
        };

        return {
            loadTime: { value: loadTime, score: getScore('loadTime', loadTime) },
            FCP: { value: FCP, score: getScore('FCP', FCP) },
            LCP: { value: LCP, score: getScore('LCP', LCP) },
            CLS: { value: CLS, score: getScore('CLS', CLS) },
            FID: { value: FID, score: getScore('FID', FID) }
        };
    }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    const updater = new DashboardUpdater();
    updater.updateDashboard();
}

export default DashboardUpdater;