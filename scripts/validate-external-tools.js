#!/usr/bin/env node

/**
 * 🔍 VALIDATION OUTILS EXTERNES
 * Valide la structure et la disponibilité des outils externes
 * by DevBast - BastaLab
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ExternalToolsValidator {
    constructor() {
        this.rootPath = path.resolve(__dirname, '..');
        this.errors = [];
        this.warnings = [];
    }

    async validate() {
        console.log('🔍 Validation des outils externes...\n');

        try {
            const data = await this.loadToolsData();
            this.validateDataStructure(data);
            await this.validateToolsFiles(data.tools);
            this.validateConfig(data.config);
            
            this.displayResults();
            return this.errors.length === 0;
            
        } catch (error) {
            console.error('❌ Erreur lors de la validation:', error.message);
            return false;
        }
    }

    async loadToolsData() {
        const dataPath = path.join(this.rootPath, 'data', 'external-tools.json');
        
        if (!fs.existsSync(dataPath)) {
            throw new Error('Fichier external-tools.json introuvable');
        }

        const content = fs.readFileSync(dataPath, 'utf8');
        
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new Error(`JSON invalide: ${error.message}`);
        }
    }

    validateDataStructure(data) {
        // Validation des métadonnées
        if (!data.meta) {
            this.errors.push('Section "meta" manquante');
        } else {
            const requiredMeta = ['version', 'lastUpdate', 'totalTools'];
            requiredMeta.forEach(field => {
                if (!data.meta[field]) {
                    this.errors.push(`meta.${field} manquant`);
                }
            });
        }

        // Validation des outils
        if (!Array.isArray(data.tools)) {
            this.errors.push('Section "tools" doit être un array');
            return;
        }

        if (data.tools.length === 0) {
            this.warnings.push('Aucun outil défini');
        }

        // Validation du nombre d'outils
        if (data.meta && data.meta.totalTools !== data.tools.length) {
            this.errors.push(`meta.totalTools (${data.meta.totalTools}) ne correspond pas au nombre réel (${data.tools.length})`);
        }
    }

    async validateToolsFiles(tools) {
        for (const tool of tools) {
            await this.validateTool(tool);
        }
    }

    async validateTool(tool) {
        const requiredFields = ['id', 'name', 'description', 'category', 'url', 'icon'];
        
        // Validation des champs obligatoires
        requiredFields.forEach(field => {
            if (!tool[field]) {
                this.errors.push(`Tool "${tool.id || 'unknown'}": champ "${field}" manquant`);
            }
        });

        // Validation de l'unicité de l'ID
        const duplicateIds = tools.filter(t => t.id === tool.id).length;
        if (duplicateIds > 1) {
            this.errors.push(`ID "${tool.id}" dupliqué`);
        }

        // Validation des fichiers
        if (tool.url) {
            await this.validateToolFile(tool.url, tool.id);
        }

        if (tool.icon) {
            await this.validateIconFile(tool.icon, tool.id);
        }

        // Validation des tags
        if (tool.tags && !Array.isArray(tool.tags)) {
            this.errors.push(`Tool "${tool.id}": tags doit être un array`);
        }

        // Validation du statut
        if (tool.status && !['online', 'offline', 'maintenance'].includes(tool.status)) {
            this.errors.push(`Tool "${tool.id}": statut invalide "${tool.status}"`);
        }
    }

    async validateToolFile(url, toolId) {
        // Convertir URL relative en chemin fichier
        if (url.startsWith('./')) {
            const filePath = path.join(this.rootPath, url.replace('./', ''));
            
            if (!fs.existsSync(filePath)) {
                this.errors.push(`Tool "${toolId}": fichier "${url}" introuvable`);
                return;
            }

            // Vérifier que c'est un fichier HTML valide
            const content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes('<html') && !content.includes('<!DOCTYPE')) {
                this.warnings.push(`Tool "${toolId}": "${url}" ne semble pas être un fichier HTML valide`);
            }
        }
    }

    async validateIconFile(iconPath, toolId) {
        if (iconPath.startsWith('assets/')) {
            const filePath = path.join(this.rootPath, iconPath);
            
            if (!fs.existsSync(filePath)) {
                this.errors.push(`Tool "${toolId}": icône "${iconPath}" introuvable`);
            }
        }
    }

    validateConfig(config) {
        if (!config) {
            this.warnings.push('Section "config" manquante');
            return;
        }

        // Validation des intervalles
        if (config.checkStatusInterval && config.checkStatusInterval < 60000) {
            this.warnings.push('checkStatusInterval très faible (< 1 minute)');
        }

        if (config.defaultTimeout && config.defaultTimeout < 1000) {
            this.warnings.push('defaultTimeout très faible (< 1 seconde)');
        }
    }

    displayResults() {
        console.log('📊 RÉSULTATS DE LA VALIDATION\n');

        if (this.errors.length > 0) {
            console.log(`❌ ERREURS (${this.errors.length}):`);
            this.errors.forEach(error => console.log(`  • ${error}`));
            console.log();
        }

        if (this.warnings.length > 0) {
            console.log(`⚠️  AVERTISSEMENTS (${this.warnings.length}):`);
            this.warnings.forEach(warning => console.log(`  • ${warning}`));
            console.log();
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ Tous les outils externes sont valides !');
        } else if (this.errors.length === 0) {
            console.log('✅ Validation réussie avec quelques avertissements');
        } else {
            console.log('❌ Validation échouée - Corrigez les erreurs avant de continuer');
        }

        console.log(`\n📈 Statistiques : ${this.errors.length} erreurs, ${this.warnings.length} avertissements`);
    }
}

// Exécution si appelé directement
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const validator = new ExternalToolsValidator();
    const isValid = await validator.validate();
    process.exit(isValid ? 0 : 1);
}

export default ExternalToolsValidator;
