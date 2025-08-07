#!/usr/bin/env node

/**
 * 🔍 Validateur JSON - DevBast Scripts
 * Valide la structure et cohérence de tous les fichiers JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des schémas
const SCHEMAS = {
    tool: {
        required: ['id', 'name', 'description', 'type', 'complexity', 'duration', 'participants'],
        optional: ['tags', 'keywords', 'objectives', 'materials', 'steps', 'benefits', 'variations'],
        types: {
            complexity: ['beginner', 'intermediate', 'advanced', 'expert'],
            type: ['workshop', 'framework', 'method', 'tool', 'technique', 'assessment']
        }
    },
    section: {
        required: ['id', 'name', 'description', 'tools'],
        optional: ['lastUpdated', 'order'],
        types: {}
    },
    externalTool: {
        required: ['id', 'name', 'description', 'url', 'type'],
        optional: ['tags', 'author', 'version', 'screenshot'],
        types: {
            type: ['calculator', 'generator', 'template', 'game', 'simulator', 'analyzer']
        }
    }
};

class JSONValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.stats = {
            files: 0,
            tools: 0,
            sections: 0,
            externalTools: 0
        };
    }

    /**
     * 🚀 Point d'entrée principal
     */
    async validate() {
        console.log('🔍 Validation des fichiers JSON...\n');
        
        try {
            await this.validateSections();
            await this.validateExternalTools();
            await this.validateConfig();
            await this.checkConsistency();
            
            this.displayResults();
            
            return this.errors.length === 0;
        } catch (error) {
            console.error('❌ Erreur lors de la validation:', error.message);
            return false;
        }
    }

    /**
     * 📁 Validation des sections
     */
    async validateSections() {
        const sectionsDir = path.join(__dirname, '../data/sections');
        
        if (!fs.existsSync(sectionsDir)) {
            this.addError('Dossier sections manquant: ' + sectionsDir);
            return;
        }

        const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.json'));
        
        for (const file of files) {
            const filePath = path.join(sectionsDir, file);
            await this.validateFile(filePath, 'section');
            this.stats.files++;
        }
    }

    /**
     * 🔗 Validation des outils externes
     */
    async validateExternalTools() {
        const externalDir = path.join(__dirname, '../data/external');
        
        if (!fs.existsSync(externalDir)) {
            this.addWarning('Dossier external-tools manquant - création automatique');
            fs.mkdirSync(externalDir, { recursive: true });
            await this.createExternalToolsStructure(externalDir);
            return;
        }

        const configPath = path.join(externalDir, 'external-tools.json');
        if (fs.existsSync(configPath)) {
            await this.validateFile(configPath, 'externalTools');
        }
    }

    /**
     * ⚙️ Validation de la configuration
     */
    async validateConfig() {
        const configFiles = [
            'data/app-config.json',
            'data/search/search-config.json'
        ];

        for (const configFile of configFiles) {
            const filePath = path.join(__dirname, '..', configFile);
            if (fs.existsSync(filePath)) {
                await this.validateFile(filePath, 'config');
            } else {
                this.addError(`Fichier de configuration manquant: ${configFile}`);
            }
        }
    }

    /**
     * 📝 Validation d'un fichier spécifique
     */
    async validateFile(filePath, type) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            console.log(`   📄 ${path.basename(filePath)}`);
            
            if (type === 'section') {
                this.validateSection(data, filePath);
                this.stats.sections++;
                this.stats.tools += data.tools?.length || 0;
            } else if (type === 'externalTools') {
                this.validateExternalTools(data, filePath);
                this.stats.externalTools += data.tools?.length || 0;
            } else if (type === 'config') {
                this.validateConfig(data, filePath);
            }
            
        } catch (error) {
            this.addError(`Erreur JSON dans ${filePath}: ${error.message}`);
        }
    }

    /**
     * 📋 Validation d'une section
     */
    validateSection(section, filePath) {
        const schema = SCHEMAS.section;
        
        // Vérification des champs requis
        for (const field of schema.required) {
            if (!section[field]) {
                this.addError(`${filePath}: Champ requis manquant '${field}'`);
            }
        }

        // Validation des outils
        if (section.tools) {
            section.tools.forEach((tool, index) => {
                this.validateTool(tool, `${filePath}[tools][${index}]`);
            });
        }

        // Validation des IDs uniques
        if (section.tools) {
            const ids = section.tools.map(t => t.id);
            const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
            if (duplicates.length > 0) {
                this.addError(`${filePath}: IDs dupliqués: ${duplicates.join(', ')}`);
            }
        }
    }

    /**
     * 🛠️ Validation d'un outil
     */
    validateTool(tool, context) {
        const schema = SCHEMAS.tool;
        
        // Champs requis
        for (const field of schema.required) {
            if (!tool[field]) {
                this.addError(`${context}: Champ requis manquant '${field}'`);
            }
        }

        // Validation des types
        if (tool.complexity && !schema.types.complexity.includes(tool.complexity)) {
            this.addError(`${context}: Complexité invalide '${tool.complexity}'`);
        }

        if (tool.type && !schema.types.type.includes(tool.type)) {
            this.addError(`${context}: Type invalide '${tool.type}'`);
        }

        // Validation de la durée
        if (tool.duration && !this.isValidDuration(tool.duration)) {
            this.addWarning(`${context}: Format de durée suspect '${tool.duration}'`);
        }

        // Validation des participants
        if (tool.participants && !this.isValidParticipants(tool.participants)) {
            this.addWarning(`${context}: Format participants suspect '${tool.participants}'`);
        }
    }

    /**
     * 🔗 Validation des outils externes
     */
    validateExternalTools(data, filePath) {
        if (!data.tools || !Array.isArray(data.tools)) {
            this.addError(`${filePath}: La propriété 'tools' doit être un tableau`);
            return;
        }

        data.tools.forEach((tool, index) => {
            this.validateExternalTool(tool, `${filePath}[tools][${index}]`);
        });
    }

    /**
     * 🌐 Validation d'un outil externe
     */
    validateExternalTool(tool, context) {
        const schema = SCHEMAS.externalTool;
        
        // Champs requis
        for (const field of schema.required) {
            if (!tool[field]) {
                this.addError(`${context}: Champ requis manquant '${field}'`);
            }
        }

        // Validation de l'URL
        if (tool.url && !this.isValidURL(tool.url)) {
            this.addError(`${context}: URL invalide '${tool.url}'`);
        }

        // Validation du type
        if (tool.type && !schema.types.type.includes(tool.type)) {
            this.addError(`${context}: Type invalide '${tool.type}'`);
        }
    }

    /**
     * 🔧 Vérifications de cohérence entre fichiers
     */
    async checkConsistency() {
        console.log('🔧 Vérification de la cohérence...');
        
        // Vérifier que la config correspond aux sections
        const appConfigPath = path.join(__dirname, '../data/app-config.json');
        if (fs.existsSync(appConfigPath)) {
            const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
            
            // Vérifier que chaque section déclarée existe
            for (const section of appConfig.sections || []) {
                const sectionFile = path.join(__dirname, `../data/sections/${section.id}.json`);
                if (!fs.existsSync(sectionFile)) {
                    this.addError(`Section déclarée mais fichier manquant: ${section.id}.json`);
                }
            }
        }
    }

    /**
     * 🏗️ Création de la structure des outils externes
     */
    async createExternalToolsStructure(baseDir) {
        // Créer le fichier de configuration
        const configTemplate = {
            "name": "Outils Externes",
            "description": "Outils HTML/CSS/JS autonomes intégrés au toolkit",
            "version": "1.0.0",
            "lastUpdated": new Date().toISOString(),
            "tools": [
                {
                    "id": "example-calculator",
                    "name": "🧮 Calculateur d'Exemple",
                    "description": "Exemple d'outil externe autonome",
                    "type": "calculator",
                    "url": "./tools/example-calculator/index.html",
                    "tags": ["exemple", "calculateur"],
                    "author": "DevBast",
                    "version": "1.0",
                    "screenshot": "./tools/example-calculator/screenshot.png",
                    "enabled": false
                }
            ],
            "categories": [
                {
                    "id": "calculators",
                    "name": "📊 Calculateurs",
                    "icon": "🧮",
                    "color": "#059669"
                },
                {
                    "id": "generators",
                    "name": "⚡ Générateurs",
                    "icon": "🎰",
                    "color": "#7c3aed"
                },
                {
                    "id": "games",
                    "name": "🎮 Jeux & Energizers",
                    "icon": "🎲",
                    "color": "#dc2626"
                }
            ]
        };

        fs.writeFileSync(
            path.join(baseDir, 'external-tools.json'),
            JSON.stringify(configTemplate, null, 2)
        );

        // Créer le dossier des outils
        const toolsDir = path.join(baseDir, 'tools');
        fs.mkdirSync(toolsDir, { recursive: true });

        // Créer un exemple d'outil
        await this.createExampleTool(toolsDir);

        console.log('✅ Structure des outils externes créée');
    }

    /**
     * 🎯 Création d'un outil d'exemple
     */
    async createExampleTool(toolsDir) {
        const exampleDir = path.join(toolsDir, 'example-calculator');
        fs.mkdirSync(exampleDir, { recursive: true });

        // HTML
        const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧮 Calculateur d'Exemple</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🧮 Calculateur d'Exemple</h1>
            <p>Outil autonome intégré au Coach Toolkit</p>
        </header>
        
        <main>
            <div class="calculator">
                <input type="number" id="value1" placeholder="Valeur 1">
                <select id="operation">
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">×</option>
                    <option value="/">/</option>
                </select>
                <input type="number" id="value2" placeholder="Valeur 2">
                <button onclick="calculate()">Calculer</button>
            </div>
            
            <div id="result" class="result"></div>
        </main>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;

        // CSS
        const cssTemplate = `/* 🎨 Style pour l'outil exemple */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 100%;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    color: #2d3748;
    margin-bottom: 0.5rem;
}

header p {
    color: #718096;
    font-size: 0.9rem;
}

.calculator {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
}

input, select, button {
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
}

input:focus, select:focus {
    outline: none;
    border-color: #667eea;
}

button {
    grid-column: 1 / -1;
    background: #667eea;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

button:hover {
    background: #5a67d8;
}

.result {
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3748;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}`;

        // JavaScript
        const jsTemplate = `// 🚀 Logic pour le calculateur exemple
function calculate() {
    const value1 = parseFloat(document.getElementById('value1').value);
    const value2 = parseFloat(document.getElementById('value2').value);
    const operation = document.getElementById('operation').value;
    const resultDiv = document.getElementById('result');
    
    if (isNaN(value1) || isNaN(value2)) {
        resultDiv.textContent = '⚠️ Veuillez saisir des nombres valides';
        resultDiv.style.color = '#e53e3e';
        return;
    }
    
    let result;
    switch(operation) {
        case '+':
            result = value1 + value2;
            break;
        case '-':
            result = value1 - value2;
            break;
        case '*':
            result = value1 * value2;
            break;
        case '/':
            if (value2 === 0) {
                resultDiv.textContent = '⚠️ Division par zéro impossible';
                resultDiv.style.color = '#e53e3e';
                return;
            }
            result = value1 / value2;
            break;
    }
    
    resultDiv.textContent = \`✨ Résultat: \${result}\`;
    resultDiv.style.color = '#38a169';
}

// Auto-calcul quand on change les valeurs
document.getElementById('value1').addEventListener('input', calculate);
document.getElementById('value2').addEventListener('input', calculate);
document.getElementById('operation').addEventListener('change', calculate);`;

        fs.writeFileSync(path.join(exampleDir, 'index.html'), htmlTemplate);
        fs.writeFileSync(path.join(exampleDir, 'style.css'), cssTemplate);
        fs.writeFileSync(path.join(exampleDir, 'script.js'), jsTemplate);
    }

    // === Méthodes utilitaires ===
    
    isValidDuration(duration) {
        return /^\d+\s*(min|h|heures?|minutes?)$/i.test(duration);
    }

    isValidParticipants(participants) {
        return /^\d+(-\d+)?(\+)?$|illimité/.test(participants);
    }

    isValidURL(url) {
        try {
            new URL(url.startsWith('./') ? 'http://localhost' + url.slice(1) : url);
            return true;
        } catch {
            return false;
        }
    }

    addError(message) {
        this.errors.push(message);
        console.log(`   ❌ ${message}`);
    }

    addWarning(message) {
        this.warnings.push(message);
        console.log(`   ⚠️  ${message}`);
    }

    /**
     * 📊 Affichage des résultats
     */
    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 RÉSULTATS DE LA VALIDATION');
        console.log('='.repeat(50));
        
        console.log(`📁 Fichiers validés: ${this.stats.files}`);
        console.log(`📋 Sections: ${this.stats.sections}`);
        console.log(`🛠️  Outils internes: ${this.stats.tools}`);
        console.log(`🔗 Outils externes: ${this.stats.externalTools}`);
        
        if (this.errors.length > 0) {
            console.log(`\n❌ ERREURS (${this.errors.length}):`);
            this.errors.forEach(error => console.log(`   • ${error}`));
        }
        
        if (this.warnings.length > 0) {
            console.log(`\n⚠️  AVERTISSEMENTS (${this.warnings.length}):`);
            this.warnings.forEach(warning => console.log(`   • ${warning}`));
        }
        
        if (this.errors.length === 0) {
            console.log('\n✅ Validation réussie ! Tous les fichiers sont conformes.');
        } else {
            console.log('\n❌ Validation échouée. Corrigez les erreurs ci-dessus.');
        }
    }
}

// 🚀 Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new JSONValidator();
    const success = await validator.validate();
    process.exit(success ? 0 : 1);
}

export default JSONValidator;
