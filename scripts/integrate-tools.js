#!/usr/bin/env node

/**
 * Script d'intégration des outils existants
 * Met à jour les outils pour utiliser le système d'intégration unifié
 */

const fs = require('fs');
const path = require('path');

class ToolsIntegrator {
  constructor() {
    this.toolsDir = path.join(__dirname, '..', 'tools');
    this.assetsDir = path.join(__dirname, '..', 'assets');
  }

  async integrate() {
    console.log('🔧 Intégration des outils existants...');
    
    try {
      const tools = this.getToolDirectories();
      
      for (const tool of tools) {
        console.log(`📦 Traitement de l'outil: ${tool}`);
        await this.integrateTool(tool);
      }
      
      console.log('✅ Intégration terminée avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'intégration:', error);
      process.exit(1);
    }
  }

  getToolDirectories() {
    return fs.readdirSync(this.toolsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  async integrateTool(toolName) {
    const toolPath = path.join(this.toolsDir, toolName);
    const indexPath = path.join(toolPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.log(`⚠️  Pas de fichier index.html trouvé pour ${toolName}`);
      return;
    }

    // Lire le fichier HTML existant
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Vérifier si l'intégration est déjà présente
    if (htmlContent.includes('tool-integration.js')) {
      console.log(`✓ ${toolName} est déjà intégré`);
      return;
    }

    // Ajouter l'intégration
    htmlContent = this.addIntegrationToHtml(htmlContent, toolName);
    
    // Sauvegarder le fichier modifié
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    
    console.log(`✅ ${toolName} intégré avec succès`);
  }

  addIntegrationToHtml(htmlContent, toolName) {
    // Ajouter le script d'intégration avant la fermeture du body
    const integrationScript = `
    <!-- Intégration Agile Coach Toolkit -->
    <script src="../../assets/js/tool-integration.js"></script>
    <script>
      // Configuration spécifique à l'outil
      window.TOOL_CONFIG = {
        name: '${toolName}',
        backUrl: '../../index.html#tools'
      };
    </script>
</body>`;

    // Remplacer la fermeture du body
    htmlContent = htmlContent.replace('</body>', integrationScript);

    // Ajouter les meta tags PWA si pas présents
    if (!htmlContent.includes('theme-color')) {
      const pwaMetaTags = `
    <!-- PWA Integration -->
    <meta name="theme-color" content="#3b82f6">
    <link rel="manifest" href="../../manifest.json">
    <link rel="icon" href="../../assets/icons/favicon.ico">
</head>`;
      
      htmlContent = htmlContent.replace('</head>', pwaMetaTags);
    }

    return htmlContent;
  }

  // Méthode pour créer des liens de retour dans les outils
  createToolNavigation() {
    const navTemplate = `
<!-- Navigation unifiée -->
<div class="unified-nav">
  <a href="../../index.html" class="nav-back">← Retour au Toolkit</a>
  <div class="nav-tool-info">
    <span class="tool-name">{{TOOL_NAME}}</span>
    <span class="tool-status">{{TOOL_STATUS}}</span>
  </div>
</div>
`;
    return navTemplate;
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const integrator = new ToolsIntegrator();
  integrator.integrate();
}

module.exports = ToolsIntegrator;