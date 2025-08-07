#!/usr/bin/env node

/**
 * 📊 Générateur de statistiques
 * by DevBast - Analyse les logs et génère les stats JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StatsGenerator {
    constructor(deployPath) {
        this.deployPath = deployPath || process.env.DEPLOY_PATH || '/sites/drafts/agile-coach-toolkit';
        this.logPath = process.env.LOG_PATH || '/var/log/nginx/agile-toolkit-access.log';
        this.statsPath = path.join(this.deployPath, 'logs', 'usage-stats.json');
    }

    async generateStats() {
        console.log('📊 Génération des statistiques...');
        
        try {
            const logData = this.readLogs();
            const stats = this.analyzeData(logData);
            
            // Sauvegarde des stats
            await this.saveStats(stats);
            
            // Génération de la page HTML
            await this.generateStatsPage();
            
            console.log(`✅ Stats générées: ${this.statsPath}`);
            
        } catch (error) {
            console.error('❌ Erreur génération stats:', error);
        }
    }

    readLogs() {
        if (!fs.existsSync(this.logPath)) {
            console.log('⚠️ Fichier de log introuvable, génération de données de test');
            return this.generateTestData();
        }

        const logs = fs.readFileSync(this.logPath, 'utf8');
        return logs.split('\n').filter(line => line.trim());
    }

    analyzeData(lines) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const stats = {
            generatedAt: now.toISOString(),
            totalVisits: lines.length,
            pages: this.analyzePagesVisited(lines),
            tools: this.analyzeToolsUsage(lines),
            dailyVisits: this.analyzeDailyVisits(lines, sevenDaysAgo),
            uniqueDevices: this.analyzeUniqueDevices(lines),
            lastVisit: this.getLastVisit(lines)
        };

        return stats;
    }

    analyzePagesVisited(lines) {
        const pages = {};
        
        lines.forEach(line => {
            const urlMatch = line.match(/GET ([^\s\?]+)/);
            if (urlMatch) {
                let url = urlMatch[1];
                // Normalisation des URLs
                if (url === '/') url = '/index.html';
                if (!url.includes('.')) url += '.html';
                
                pages[url] = (pages[url] || 0) + 1;
            }
        });

        return Object.entries(pages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([page, count]) => ({ page, count }));
    }

    analyzeToolsUsage(lines) {
        const tools = {};
        
        lines.forEach(line => {
            const toolMatch = line.match(/GET \/([^\/\s]+)\.html/);
            if (toolMatch) {
                const tool = toolMatch[1];
                if (tool !== 'index' && tool !== 'stats') {
                    tools[tool] = (tools[tool] || 0) + 1;
                }
            }
        });

        return Object.entries(tools)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tool, count]) => ({ tool, count }));
    }

    analyzeDailyVisits(lines, since) {
        const daily = new Map();
        
        lines.forEach(line => {
            const dateMatch = line.match(/\[([^\]]+)\]/);
            if (dateMatch) {
                try {
                    const date = new Date(dateMatch[1].split(':')[0]);
                    if (date >= since) {
                        const day = date.toISOString().split('T')[0];
                        daily.set(day, (daily.get(day) || 0) + 1);
                    }
                } catch (e) {
                    // Ignore les erreurs de parsing de date
                }
            }
        });

        // Remplir les jours manquants
        const result = [];
        for (let d = new Date(since); d <= new Date(); d.setDate(d.getDate() + 1)) {
            const day = d.toISOString().split('T')[0];
            result.push({
                date: day,
                visits: daily.get(day) || 0
            });
        }

        return result;
    }

    analyzeUniqueDevices(lines) {
        const devices = new Set();
        
        lines.forEach(line => {
            const ipMatch = line.match(/^([^\s]+)/);
            const uaMatch = line.match(/"([^"]*User-Agent[^"]*)"/);
            
            if (ipMatch && uaMatch) {
                devices.add(`${ipMatch[1]}-${uaMatch[1]}`);
            }
        });

        return devices.size;
    }

    getLastVisit(lines) {
        if (lines.length === 0) return null;
        
        // Prendre la dernière ligne avec une date
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            const dateMatch = line.match(/\[([^\]]+)\]/);
            if (dateMatch) {
                try {
                    return new Date(dateMatch[1].split(':')[0]).toISOString();
                } catch (e) {
                    continue;
                }
            }
        }
        
        return null;
    }

    generateTestData() {
        // Données de test pour le développement
        const testLines = [];
        const now = new Date();
        
        for (let i = 0; i < 100; i++) {
            const date = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            const pages = ['/index.html', '/retrospectives.html', '/estimations.html', '/vision.html'];
            const page = pages[Math.floor(Math.random() * pages.length)];
            const ip = `192.168.1.${Math.floor(Math.random() * 100) + 1}`;
            
            testLines.push(`${ip} - - [${date.toISOString()}] "GET ${page} HTTP/1.1" 200 1234 "-" "Mozilla/5.0"`);
        }
        
        return testLines;
    }

    async saveStats(stats) {
        // S'assurer que le dossier existe
        const dir = path.dirname(this.statsPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(this.statsPath, JSON.stringify(stats, null, 2));
    }

    async generateStatsPage() {
        const statsHtmlPath = path.join(this.deployPath, 'stats.html');
        
        // Copier le template HTML des stats
        const templatePath = path.join(__dirname, '..', 'templates', 'stats.html');
        
        if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, statsHtmlPath);
        } else {
            console.log('⚠️ Template stats.html introuvable, génération basique');
            // Générer une page basique si le template n'existe pas
        }
    }
}

// Exécution
if (import.meta.url === `file://${process.argv[1]}`) {
    const deployPath = process.argv[2];
    const generator = new StatsGenerator(deployPath);
    generator.generateStats();
}

export default StatsGenerator;
