/**
 * Tool Integration System
 * Provides unified navigation and styling for individual tools
 */

class ToolIntegration {
  constructor() {
    this.mainSiteUrl = '/';
    this.currentTool = this.detectCurrentTool();
    this.init();
  }

  init() {
    this.addBackNavigation();
    this.addUnifiedStyling();
    this.trackToolUsage();
    this.addThemeSupport();
  }

  detectCurrentTool() {
    const path = window.location.pathname;
    const toolMatch = path.match(/\/tools\/([^\/]+)/);
    return toolMatch ? toolMatch[1] : null;
  }

  addBackNavigation() {
    // Créer une barre de navigation unifiée pour les outils
    const navBar = document.createElement('div');
    navBar.className = 'tool-nav-bar';
    navBar.innerHTML = `
      <div class="tool-nav-container">
        <a href="${this.mainSiteUrl}" class="tool-nav-back">
          <span class="tool-nav-icon">←</span>
          <span class="tool-nav-text">Retour au toolkit</span>
        </a>
        <div class="tool-nav-info">
          <span class="tool-nav-title">${this.getToolDisplayName()}</span>
          <span class="tool-nav-status">${this.getToolStatus()}</span>
        </div>
        <div class="tool-nav-actions">
          <button class="tool-nav-theme-toggle" title="Basculer le mode sombre">
            <span class="theme-icon">🌙</span>
          </button>
        </div>
      </div>
    `;

    // Insérer en haut de la page
    document.body.insertBefore(navBar, document.body.firstChild);
  }

  addUnifiedStyling() {
    // Ajouter les styles CSS unifiés
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .tool-nav-bar {
        background: var(--primary-color, #3b82f6);
        color: white;
        padding: 0.75rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .tool-nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .tool-nav-back {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        transition: background-color 0.2s;
      }

      .tool-nav-back:hover {
        background-color: rgba(255,255,255,0.1);
      }

      .tool-nav-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .tool-nav-title {
        font-weight: 600;
        font-size: 1.1rem;
      }

      .tool-nav-status {
        background: rgba(255,255,255,0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
      }

      .tool-nav-actions {
        display: flex;
        gap: 0.5rem;
      }

      .tool-nav-theme-toggle {
        background: none;
        border: none;
        color: white;
        padding: 0.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .tool-nav-theme-toggle:hover {
        background-color: rgba(255,255,255,0.1);
      }

      /* Ajustements pour le contenu principal */
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .container {
        margin: 0 auto;
        padding: 1rem;
      }

      /* Mode sombre */
      [data-theme="dark"] {
        --bg-color: #1a1a1a;
        --text-color: #e5e5e5;
        --card-bg: #2d2d2d;
        --border-color: #404040;
      }

      [data-theme="dark"] body {
        background-color: var(--bg-color);
        color: var(--text-color);
      }

      [data-theme="dark"] .tool-nav-bar {
        background: #1f2937;
      }

      @media (max-width: 768px) {
        .tool-nav-container {
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }

        .tool-nav-info {
          justify-content: center;
        }

        .tool-nav-back {
          align-self: flex-start;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  getToolDisplayName() {
    const toolData = this.getToolData();
    return toolData ? toolData.name : this.currentTool || 'Outil';
  }

  getToolStatus() {
    const toolData = this.getToolData();
    if (!toolData) return '';
    
    const statusMap = {
      'stable': '✅ Stable',
      'beta': '🚧 Bêta',
      'alpha': '⚠️ Alpha'
    };
    
    return statusMap[toolData.status] || toolData.status;
  }

  getToolData() {
    // Essayer d'accéder aux données depuis le site principal
    if (window.TOOLS_DATA) {
      return window.TOOLS_DATA.find(tool => tool.id === this.currentTool);
    }
    
    // Données de fallback pour les outils connus
    const fallbackData = {
      'example-mapping': {
        name: 'Example Mapping',
        status: 'stable'
      },
      'planning-poker': {
        name: 'Planning Poker',
        status: 'stable'
      },
      'agile-fluency': {
        name: 'Agile Fluency',
        status: 'stable'
      },
      'velocity-squad': {
        name: 'Velocity Squad',
        status: 'stable'
      }
    };
    
    return fallbackData[this.currentTool];
  }

  addThemeSupport() {
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem('agile-toolkit-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Mettre à jour l'icône du thème
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Ajouter l'événement de basculement
    const themeToggle = document.querySelector('.tool-nav-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('agile-toolkit-theme', newTheme);
        
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }
  }

  trackToolUsage() {
    // Utiliser le système de synchronisation
    if (window.ToolsSync) {
      window.ToolsSync.trackUsage(this.currentTool, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    }

    // Utiliser le système de logging
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logTool(this.currentTool, 'visit', {
        toolName: this.getToolDisplayName(),
        status: this.getToolStatus()
      });
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('agile-toolkit-session');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('agile-toolkit-session', sessionId);
    }
    return sessionId;
  }

  // Méthode supprimée - remplacée par le système de logging unifié
}

// Auto-initialisation si nous sommes dans un outil
if (window.location.pathname.includes('/tools/')) {
  document.addEventListener('DOMContentLoaded', () => {
    new ToolIntegration();
  });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToolIntegration;
}

if (typeof window !== 'undefined') {
  window.ToolIntegration = ToolIntegration;
}