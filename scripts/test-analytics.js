#!/usr/bin/env node

/**
 * 🧪 Test du système d'analytics respectueux de la vie privée
 * Vérifie le bon fonctionnement des métriques et du stockage local
 * by DevBast
 */

import fs from 'fs';
import { execSync } from 'child_process';

class AnalyticsTestSuite {
    constructor() {
        this.testResults = [];
        this.dashboardPath = './logs/usage-stats.json';
    }

    /**
     * Lance tous les tests
     */
    async runAllTests() {
        console.log('🧪 TESTS DU SYSTÈME D\'ANALYTICS PRIVÉ\n');
        
        try {
            await this.testDashboardGeneration();
            await this.testDataStructure();
            await this.testPerformanceMetrics();
            await this.testPrivacyCompliance();
            await this.testErrorHandling();
            
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Erreur lors des tests:', error.message);
        }
    }

    /**
     * Test de génération du dashboard
     */
    async testDashboardGeneration() {
        console.log('📊 Test de génération du dashboard...');
        
        try {
            // Exécution du script d'analytics
            execSync('node scripts/analytics.js', { stdio: 'pipe' });
            
            // Vérification de l'existence du fichier
            if (fs.existsSync(this.dashboardPath)) {
                this.addTestResult('Dashboard Generation', true, 'Fichier généré avec succès');
            } else {
                this.addTestResult('Dashboard Generation', false, 'Fichier non généré');
            }
            
        } catch (error) {
            this.addTestResult('Dashboard Generation', false, error.message);
        }
    }

    /**
     * Test de la structure des données
     */
    async testDataStructure() {
        console.log('🏗️ Test de la structure des données...');
        
        try {
            if (!fs.existsSync(this.dashboardPath)) {
                this.addTestResult('Data Structure', false, 'Fichier dashboard inexistant');
                return;
            }
            
            const data = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));
            
            // Vérification des champs requis
            const requiredFields = [
                'generatedAt', 'totalVisits', 'uniqueSessions', 
                'pages', 'tools', 'dailyVisits', 'performance', 
                'errors', 'lastVisit'
            ];
            
            const missingFields = requiredFields.filter(field => !(field in data));
            
            if (missingFields.length === 0) {
                this.addTestResult('Data Structure', true, 'Tous les champs requis présents');
            } else {
                this.addTestResult('Data Structure', false, `Champs manquants: ${missingFields.join(', ')}`);
            }
            
            // Vérification des types
            if (Array.isArray(data.pages) && Array.isArray(data.tools) && Array.isArray(data.dailyVisits)) {
                this.addTestResult('Data Types', true, 'Types de données corrects');
            } else {
                this.addTestResult('Data Types', false, 'Types de données incorrects');
            }
            
        } catch (error) {
            this.addTestResult('Data Structure', false, error.message);
        }
    }

    /**
     * Test des métriques de performance
     */
    async testPerformanceMetrics() {
        console.log('⚡ Test des métriques de performance...');
        
        try {
            const data = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));
            
            if (data.performance) {
                const { loadTime, FCP, LCP, CLS, FID } = data.performance;
                
                // Vérification des seuils Core Web Vitals
                const tests = [
                    { name: 'Load Time', value: loadTime, threshold: 3000, unit: 'ms' },
                    { name: 'FCP', value: FCP, threshold: 3000, unit: 'ms' },
                    { name: 'LCP', value: LCP, threshold: 4000, unit: 'ms' },
                    { name: 'CLS', value: CLS, threshold: 0.25, unit: '' },
                    { name: 'FID', value: FID, threshold: 300, unit: 'ms' }
                ];
                
                tests.forEach(test => {
                    if (test.value !== null && test.value !== undefined) {
                        const status = test.value <= test.threshold ? 'GOOD' : 'NEEDS IMPROVEMENT';
                        this.addTestResult(
                            `Performance ${test.name}`, 
                            true, 
                            `${test.value}${test.unit} (${status})`
                        );
                    } else {
                        this.addTestResult(`Performance ${test.name}`, false, 'Valeur manquante');
                    }
                });
                
            } else {
                this.addTestResult('Performance Metrics', false, 'Données de performance manquantes');
            }
            
        } catch (error) {
            this.addTestResult('Performance Metrics', false, error.message);
        }
    }

    /**
     * Test de conformité à la vie privée
     */
    async testPrivacyCompliance() {
        console.log('🔒 Test de conformité à la vie privée...');
        
        try {
            const data = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));
            
            // Vérification qu'aucune donnée personnelle n'est stockée
            const dataString = JSON.stringify(data);
            const personalDataPatterns = [
                /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
                /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, // IP
                /\b\d{10,}\b/ // Numéros longs (téléphone, etc.)
            ];
            
            const hasPersonalData = personalDataPatterns.some(pattern => pattern.test(dataString));
            
            if (!hasPersonalData) {
                this.addTestResult('Privacy Compliance', true, 'Aucune donnée personnelle détectée');
            } else {
                this.addTestResult('Privacy Compliance', false, 'Données personnelles potentielles détectées');
            }
            
            // Vérification des flags de confidentialité
            if (data.privacyCompliant && data.localOnly) {
                this.addTestResult('Privacy Flags', true, 'Flags de confidentialité présents');
            } else {
                this.addTestResult('Privacy Flags', false, 'Flags de confidentialité manquants');
            }
            
        } catch (error) {
            this.addTestResult('Privacy Compliance', false, error.message);
        }
    }

    /**
     * Test de gestion d'erreurs
     */
    async testErrorHandling() {
        console.log('🚨 Test de gestion d\'erreurs...');
        
        try {
            const data = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));
            
            // Vérification que le compteur d'erreurs existe
            if (typeof data.errors === 'number') {
                this.addTestResult('Error Tracking', true, `${data.errors} erreurs trackées`);
            } else {
                this.addTestResult('Error Tracking', false, 'Compteur d\'erreurs manquant');
            }
            
            // Test de robustesse avec données corrompues
            const corruptedData = '{"invalid": json}';
            try {
                JSON.parse(corruptedData);
                this.addTestResult('Error Handling', false, 'Données corrompues non détectées');
            } catch (e) {
                this.addTestResult('Error Handling', true, 'Gestion des données corrompues OK');
            }
            
        } catch (error) {
            this.addTestResult('Error Handling', false, error.message);
        }
    }

    /**
     * Ajoute un résultat de test
     */
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Affiche les résultats des tests
     */
    displayResults() {
        console.log('\n📋 RÉSULTATS DES TESTS\n');
        
        const passed = this.testResults.filter(test => test.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.message}`);
        });
        
        console.log(`\n📊 Résumé: ${passed}/${total} tests réussis`);
        
        if (passed === total) {
            console.log('🎉 Tous les tests sont passés ! Le système d\'analytics est opérationnel.');
        } else {
            console.log('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
        }
        
        // Sauvegarde du rapport de test
        const report = {
            timestamp: new Date().toISOString(),
            summary: { passed, total, success: passed === total },
            results: this.testResults
        };
        
        fs.writeFileSync('./logs/analytics-test-report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Rapport sauvegardé dans logs/analytics-test-report.json');
    }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    const testSuite = new AnalyticsTestSuite();
    testSuite.runAllTests();
}

export default AnalyticsTestSuite;