const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Utilitaires
// Dans l'API multi-sites, ce fichier est dans : /sites/drafts/api-multi-sites/data/agile/api/routes/
// Le dossier content est dans : /sites/drafts/agile/content/
const contentDir = path.resolve('../agile/content');

/**
 * GET /api/admin/debug
 * Route de debug pour vérifier les chemins
 */
router.get('/debug', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const exists = await fs.access(contentDir).then(() => true).catch(() => false);
        
        res.json({
            __dirname,
            contentDir,
            contentDirExists: exists,
            cwd: process.cwd()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/categories
 * Liste toutes les catégories (ordre basé sur config.json)
 */
router.get('/categories', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        logger.info('Chargement des catégories', { contentDir });
        
        // Charger config.json pour obtenir l'ordre
        const configPath = path.resolve('../agile/config/config.json');
        let configData;
        try {
            configData = JSON.parse(await fs.readFile(configPath, 'utf8'));
        } catch (err) {
            logger.error('Impossible de charger config.json', { error: err.message });
            return res.status(500).json({ error: 'Impossible de charger la configuration' });
        }
        
        // Vérifier que le dossier content existe
        try {
            await fs.access(contentDir);
        } catch (err) {
            logger.error('Dossier content introuvable', { contentDir, error: err.message });
            return res.status(500).json({ 
                error: 'Dossier content introuvable',
                path: contentDir 
            });
        }
        
        const categories = [];
        
        // Charger les catégories et utiliser l'ordre de config.json
        for (const configCat of configData.categories) {
            const categoryId = configCat.id;
            const indexPath = path.join(contentDir, categoryId, 'index.json');
            
            try {
                const data = await fs.readFile(indexPath, 'utf8');
                const categoryData = JSON.parse(data);
                // Utiliser l'ordre défini dans config.json
                categoryData.order = configCat.order || 999;
                categories.push(categoryData);
            } catch (err) {
                logger.warn(`Index.json manquant pour ${categoryId}`, { indexPath });
            }
        }
        
        // Trier par le champ order
        categories.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        logger.info('Catégories chargées', { count: categories.length });
        res.json(categories);
    } catch (error) {
        logger.error('Erreur lors du chargement des catégories', { 
            error: error.message,
            stack: error.stack,
            contentDir 
        });
        res.status(500).json({ 
            error: 'Erreur serveur',
            message: error.message,
            contentDir 
        });
    }
});

/**
 * POST /api/admin/categories
 * Créer une nouvelle catégorie
 */
router.post('/categories', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { category, title, description, icon, color } = req.body;
        
        if (!category || !title) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        const categoryPath = path.join(contentDir, category);
        
        // Vérifier si la catégorie existe déjà
        try {
            await fs.access(categoryPath);
            return res.status(409).json({ error: 'Cette catégorie existe déjà' });
        } catch (err) {
            // La catégorie n'existe pas, on peut continuer
        }
        
        // Créer le dossier
        await fs.mkdir(categoryPath, { recursive: true });
        
        // Créer l'index.json
        const indexData = {
            category,
            title,
            description: description || '',
            icon: icon || 'fas fa-folder',
            color: color || '#00d4ff',
            order: req.body.order || 1,
            articles: [],
            tools: [],
            templates: []
        };
        
        const indexPath = path.join(categoryPath, 'index.json');
        await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
        
        logger.info('Catégorie créée', { category });
        res.status(201).json(indexData);
    } catch (error) {
        logger.error('Erreur lors de la création de la catégorie', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/admin/categories
 * Modifier une catégorie existante
 */
router.put('/categories', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { category, title, description, icon, color } = req.body;
        
        if (!category || !title) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        const categoryPath = path.join(contentDir, category);
        const indexPath = path.join(categoryPath, 'index.json');
        
        // Vérifier si la catégorie existe
        try {
            await fs.access(indexPath);
        } catch (err) {
            return res.status(404).json({ error: 'Catégorie introuvable' });
        }
        
        // Charger l'index existant
        const existingData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        
        // Mettre à jour les données
        const updatedData = {
            ...existingData,
            title,
            description: description || '',
            icon: icon || 'fas fa-folder',
            color: color || '#00d4ff',
            order: req.body.order || existingData.order || 1
        };
        
        await fs.writeFile(indexPath, JSON.stringify(updatedData, null, 2), 'utf8');
        
        logger.info('Catégorie modifiée', { category });
        res.json(updatedData);
    } catch (error) {
        logger.error('Erreur lors de la modification de la catégorie', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * DELETE /api/admin/categories/:categoryId
 * Supprimer une catégorie
 */
router.delete('/categories/:categoryId', async (req, res) => {
    const logger = req.siteLogger;
    const { categoryId } = req.params;
    
    try {
        const categoryPath = path.join(contentDir, categoryId);
        
        // Vérifier si la catégorie existe
        try {
            await fs.access(categoryPath);
        } catch (err) {
            return res.status(404).json({ error: 'Catégorie introuvable' });
        }
        
        // Supprimer le dossier et son contenu
        await fs.rm(categoryPath, { recursive: true, force: true });
        
        logger.info('Catégorie supprimée', { category: categoryId });
        res.json({ success: true, message: 'Catégorie supprimée' });
    } catch (error) {
        logger.error('Erreur lors de la suppression de la catégorie', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/admin/contents/:categoryId/:contentId
 * Récupérer un contenu spécifique
 */
router.get('/contents/:categoryId/:contentId', async (req, res) => {
    const logger = req.siteLogger;
    const { categoryId, contentId } = req.params;
    
    try {
        const categoryPath = path.join(contentDir, categoryId);
        const indexPath = path.join(categoryPath, 'index.json');
        
        // Charger l'index pour trouver le fichier
        const indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        const article = indexData.articles.find(a => a.id === contentId);
        
        if (!article) {
            return res.status(404).json({ error: 'Contenu introuvable' });
        }
        
        // Charger le contenu Markdown
        const filePath = path.join(categoryPath, article.file);
        const markdown = await fs.readFile(filePath, 'utf8');
        
        logger.info('Contenu chargé', { category: categoryId, content: contentId });
        res.json({
            ...article,
            markdown
        });
    } catch (error) {
        logger.error('Erreur lors du chargement du contenu', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/admin/contents
 * Créer un nouveau contenu
 */
router.post('/contents', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { id, category, file, title, tags, order, markdown } = req.body;
        
        if (!category || !file || !title || !markdown) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        const categoryPath = path.join(contentDir, category);
        const indexPath = path.join(categoryPath, 'index.json');
        const filePath = path.join(categoryPath, file);
        
        // Vérifier si la catégorie existe
        try {
            await fs.access(categoryPath);
        } catch (err) {
            return res.status(404).json({ error: 'Catégorie introuvable' });
        }
        
        // Charger l'index
        const indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        
        // Vérifier si le fichier existe déjà
        try {
            await fs.access(filePath);
            return res.status(409).json({ error: 'Ce fichier existe déjà' });
        } catch (err) {
            // Le fichier n'existe pas, on peut continuer
        }
        
        // Créer le fichier markdown
        await fs.writeFile(filePath, markdown, 'utf8');
        
        // Ajouter l'article à l'index
        const newArticle = {
            id: id || generateId(title),
            title,
            file,
            tags: tags || [],
            order: order || 1
        };
        
        indexData.articles = indexData.articles || [];
        indexData.articles.push(newArticle);
        indexData.articles.sort((a, b) => a.order - b.order);
        
        await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
        
        logger.info('Contenu créé', { category, file });
        res.status(201).json(newArticle);
    } catch (error) {
        logger.error('Erreur lors de la création du contenu', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/admin/contents
 * Modifier un contenu existant
 */
router.put('/contents', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { id, category, file, originalFile, title, tags, order, markdown } = req.body;
        
        if (!category || !file || !title || !markdown) {
            return res.status(400).json({ error: 'Champs obligatoires manquants' });
        }
        
        const categoryPath = path.join(contentDir, category);
        const indexPath = path.join(categoryPath, 'index.json');
        const newFilePath = path.join(categoryPath, file);
        const oldFilePath = originalFile ? path.join(categoryPath, originalFile) : newFilePath;
        
        // Charger l'index
        const indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        
        // Si le nom du fichier a changé, supprimer l'ancien
        if (originalFile && originalFile !== file) {
            try {
                await fs.unlink(oldFilePath);
            } catch (err) {
                logger.warn('Ancien fichier introuvable', { file: originalFile });
            }
        }
        
        // Écrire le nouveau fichier
        await fs.writeFile(newFilePath, markdown, 'utf8');
        
        // Mettre à jour l'index
        const articleIndex = indexData.articles.findIndex(a => a.id === id);
        
        if (articleIndex !== -1) {
            indexData.articles[articleIndex] = {
                id,
                title,
                file,
                tags: tags || [],
                order: order || 1
            };
        } else {
            // Si l'article n'existe pas dans l'index, l'ajouter
            indexData.articles.push({
                id: id || generateId(title),
                title,
                file,
                tags: tags || [],
                order: order || 1
            });
        }
        
        indexData.articles.sort((a, b) => a.order - b.order);
        
        await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
        
        logger.info('Contenu modifié', { category, file });
        res.json({ success: true });
    } catch (error) {
        logger.error('Erreur lors de la modification du contenu', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * DELETE /api/admin/contents/:categoryId/:contentId
 * Supprimer un contenu
 */
router.delete('/contents/:categoryId/:contentId', async (req, res) => {
    const logger = req.siteLogger;
    const { categoryId, contentId } = req.params;
    
    try {
        const categoryPath = path.join(contentDir, categoryId);
        const indexPath = path.join(categoryPath, 'index.json');
        
        // Charger l'index
        const indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        
        // Trouver l'article
        const article = indexData.articles.find(a => a.id === contentId);
        
        if (!article) {
            return res.status(404).json({ error: 'Contenu introuvable' });
        }
        
        // Supprimer le fichier markdown
        const filePath = path.join(categoryPath, article.file);
        try {
            await fs.unlink(filePath);
        } catch (err) {
            logger.warn('Fichier markdown introuvable', { file: article.file });
        }
        
        // Retirer l'article de l'index
        indexData.articles = indexData.articles.filter(a => a.id !== contentId);
        
        await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
        
        logger.info('Contenu supprimé', { category: categoryId, content: contentId });
        res.json({ success: true, message: 'Contenu supprimé' });
    } catch (error) {
        logger.error('Erreur lors de la suppression du contenu', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/admin/categories/reorder
 * Réorganiser les catégories et mettre à jour config.json
 */
router.put('/categories/reorder', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { categories } = req.body; // Array of category IDs in new order
        
        if (!Array.isArray(categories)) {
            return res.status(400).json({ error: 'Format invalide' });
        }
        
        // Charger config.json
        // Depuis /sites/drafts/api-multi-sites/data/agile/api/routes/
        // Vers /sites/drafts/agile/config/config.json
        const configPath = path.resolve('../agile/config/config.json');
        
        logger.info('Tentative de chargement config.json', { configPath });
        const configData = JSON.parse(await fs.readFile(configPath, 'utf8'));
        
        // Créer un map pour retrouver les catégories par ID
        const categoryMap = new Map(configData.categories.map(cat => [cat.id, cat]));
        
        // Réorganiser selon le nouvel ordre et mettre à jour le champ order
        configData.categories = categories.map((id, index) => {
            const cat = categoryMap.get(id);
            if (cat) {
                cat.order = index + 1; // Mettre à jour le champ order
            }
            return cat;
        }).filter(Boolean);
        
        // Sauvegarder config.json
        await fs.writeFile(configPath, JSON.stringify(configData, null, 2), 'utf8');
        logger.info('config.json sauvegardé', { configPath });
        
        // Mettre à jour les index.json de chaque catégorie avec le champ order
        for (let i = 0; i < categories.length; i++) {
            const categoryId = categories[i];
            const categoryPath = path.join(contentDir, categoryId);
            const indexPath = path.join(categoryPath, 'index.json');
            
            try {
                const indexData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
                indexData.order = i + 1;
                await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
            } catch (err) {
                logger.warn(`Impossible de mettre à jour l'ordre pour ${categoryId}`, { error: err.message });
            }
        }
        
        logger.info('Ordre des catégories mis à jour', { count: categories.length });
        res.json({ success: true, message: 'Ordre mis à jour' });
    } catch (error) {
        logger.error('Erreur lors de la réorganisation', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/admin/tools/reorder
 * Réorganiser les outils et mettre à jour config.json
 */
router.put('/tools/reorder', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { tools } = req.body; // Array of tool IDs in new order
        
        if (!Array.isArray(tools)) {
            return res.status(400).json({ error: 'Format invalide' });
        }
        
        // Charger config.json
        const configPath = path.resolve('../agile/config/config.json');
        logger.info('Tentative de chargement config.json (tools)', { configPath });
        
        const configData = JSON.parse(await fs.readFile(configPath, 'utf8'));
        
        if (!configData.tools) {
            logger.error('Section tools manquante dans config.json');
            return res.status(500).json({ error: 'Section tools manquante dans config.json' });
        }
        
        // Créer un map pour retrouver les outils par ID
        const toolMap = new Map(configData.tools.map(tool => [tool.id, tool]));
        
        // Réorganiser selon le nouvel ordre et mettre à jour le champ order
        configData.tools = tools.map((id, index) => {
            const tool = toolMap.get(id);
            if (tool) {
                tool.order = index + 1; // Mettre à jour le champ order
            }
            return tool;
        }).filter(Boolean);
        
        // Sauvegarder config.json
        await fs.writeFile(configPath, JSON.stringify(configData, null, 2), 'utf8');
        logger.info('config.json sauvegardé (tools)', { configPath });
        
        logger.info('Ordre des outils mis à jour', { count: tools.length });
        res.json({ success: true, message: 'Ordre mis à jour' });
    } catch (error) {
        logger.error('Erreur lors de la réorganisation des outils', { 
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Erreur serveur',
            message: error.message 
        });
    }
});
 
/**
 * POST /api/admin/tools/create
 * Créer un nouvel outil avec toute sa structure
 */
router.post('/tools/create', async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { id, name, icon, description, includePocketbase } = req.body;
        
        if (!id || !name) {
            return res.status(400).json({ error: 'ID et nom obligatoires' });
        }
        
        // Chemin vers le dossier tools
        const toolsDir = path.resolve(__dirname, '../../../../../agile/tools');
        const toolPath = path.join(toolsDir, id);
        
        // Vérifier si l'outil existe déjà
        try {
            await fs.access(toolPath);
            return res.status(409).json({ error: 'Cet outil existe déjà' });
        } catch (err) {
            // L'outil n'existe pas, on peut continuer
        }
        
        // Créer la structure de dossiers
        await fs.mkdir(toolPath, { recursive: true });
        await fs.mkdir(path.join(toolPath, 'js'), { recursive: true });
        await fs.mkdir(path.join(toolPath, 'css', 'themes'), { recursive: true });
        
        // Créer index.html
        const indexHtml = generateIndexHtml(id, name);
        await fs.writeFile(path.join(toolPath, 'index.html'), indexHtml, 'utf8');
        
        // Créer css/styles.css
        const stylesCSS = generateStylesCSS(id);
        await fs.writeFile(path.join(toolPath, 'css', 'styles.css'), stylesCSS, 'utf8');
        
        // Créer js/app.js
        const appJS = generateAppJS(id, name);
        await fs.writeFile(path.join(toolPath, 'js', 'app.js'), appJS, 'utf8');
        
        // Créer js/pocketbase-integration.js si demandé
        if (includePocketbase) {
            const pocketbaseJS = generatePocketbaseIntegrationJS(id);
            await fs.writeFile(path.join(toolPath, 'js', 'pocketbase-integration.js'), pocketbaseJS, 'utf8');
        }
        
        // Ajouter l'outil dans config.json
        const configPath = path.resolve(__dirname, '../../../../../agile/config/config.json');
        const configData = JSON.parse(await fs.readFile(configPath, 'utf8'));
        
        const nextOrder = Math.max(...(configData.tools || []).map(t => t.order || 0), 0) + 1;
        
        configData.tools = configData.tools || [];
        configData.tools.push({
            id,
            name,
            icon: icon || '🎯',
            path: `tools/${id}/`,
            description: description || '',
            order: nextOrder
        });
        
        await fs.writeFile(configPath, JSON.stringify(configData, null, 2), 'utf8');
        
        logger.info('Outil créé', { id, name });
        res.status(201).json({ success: true, message: 'Outil créé avec succès' });
    } catch (error) {
        logger.error('Erreur lors de la création de l\'outil', { error: error.message });
        res.status(500).json({ error: 'Erreur serveur', message: error.message });
    }
});

/**
 * Générer le contenu de index.html
 */
function generateIndexHtml(id, name) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Agile Coach Toolkit</title>
    
    <!-- Styles globaux -->
    <link rel="stylesheet" href="../../assets/css/variables.css">
    <link rel="stylesheet" href="../../assets/css/base.css">
    
    <!-- Styles de l'outil -->
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="tool-container">
        <header class="tool-header">
            <h1>${name}</h1>
            <p class="tool-description">Description de l'outil</p>
        </header>
        
        <main class="tool-main">
            <!-- Contenu de l'outil ici -->
            <p>Bienvenue dans ${name} !</p>
        </main>
    </div>

    <!-- Application principale -->
    <script src="js/app.js"></script>
    
    <!-- PocketBase Integration -->
    <script src="../../assets/js/pocketbase-manager.js"></script>
    <script src="js/pocketbase-integration.js"></script>
    
    <!-- Intégration Agile Coach Toolkit -->
    <script src="../../assets/js/tool-integration.js"></script>
    <script>
        // Configuration spécifique à l'outil
        window.TOOL_CONFIG = {
            name: '${id}',
            backUrl: '../../index.html#${id}'
        };
    </script>
</body>
</html>`;
}

/**
 * Générer le contenu de css/styles.css
 */
function generateStylesCSS(id) {
    return `:root {
    /* Variables spécifiques à l'outil */
    --${id}-primary: var(--accent-blue);
}

.tool-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
}

.tool-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}

.tool-header h1 {
    font-size: var(--font-size-xxl);
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
}

.tool-description {
    color: var(--text-secondary);
    font-size: var(--font-size-md);
}

.tool-main {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow);
}`;
}

/**
 * Générer le contenu de js/app.js
 */
function generateAppJS(id, name) {
    return `/**
 * ${name} - Application principale
 */

class ${toPascalCase(id)}App {
    constructor() {
        this.init();
    }

    init() {
        console.log('${name} initialisé');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Ajouter vos event listeners ici
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new ${toPascalCase(id)}App();
});`;
}

/**
 * Générer le contenu de js/pocketbase-integration.js
 */
function generatePocketbaseIntegrationJS(id) {
    return `/**
 * ${id} - Intégration PocketBase
 */

// Configuration de l'outil
window.TOOL_CONFIG = window.TOOL_CONFIG || {};
window.TOOL_CONFIG.pocketbase = {
    collections: {
        // Définir vos collections ici
        // example: 'tools_${id}_example'
    }
};

// Initialiser PocketBase Manager
const pbManager = new PocketBaseManager('${id}');

// Fonctions utilitaires pour PocketBase
const pbAPI = {
    // Ajouter vos fonctions API ici
};`;
}

/**
 * Convertir kebab-case en PascalCase
 */
function toPascalCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

/**
 * Générer un ID à partir d'un titre
 */
function generateId(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

module.exports = router;
