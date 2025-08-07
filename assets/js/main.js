/**
 * Main JavaScript Entry Point
 * Coordinates all components and handles global functionality
 */

class App {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize Error Handling System First
      if (typeof ErrorHandler !== 'undefined') {
        this.components.errorHandler = window.errorHandler || new ErrorHandler();
        console.log('✅ Error handler initialized');
      }

      if (typeof NetworkErrorHandler !== 'undefined') {
        this.components.networkErrorHandler = window.networkErrorHandler || new NetworkErrorHandler();
        console.log('✅ Network error handler initialized');
      }

      if (typeof FallbackContentManager !== 'undefined') {
        this.components.fallbackContentManager = window.fallbackContentManager || new FallbackContentManager();
        console.log('✅ Fallback content manager initialized');
      }

      // Initialize Performance Components
      if (typeof LazyLoader !== 'undefined') {
        this.components.lazyLoader = new LazyLoader();
        console.log('✅ Lazy loader initialized');
      }

      if (typeof ResourcePreloader !== 'undefined') {
        this.components.resourcePreloader = new ResourcePreloader();
        console.log('✅ Resource preloader initialized');
      }

      if (typeof CompressionOptimizer !== 'undefined') {
        this.components.compressionOptimizer = new CompressionOptimizer();
        console.log('✅ Compression optimizer initialized');
      }

      // Initialize Navigation Component
      if (typeof Navigation !== 'undefined') {
        this.components.navigation = new Navigation();
        console.log('✅ Navigation component initialized');
      }

      // Initialize Tools Grid Component
      if (typeof ToolsGrid !== 'undefined' && typeof TOOLS_DATA !== 'undefined') {
        const toolsContainer = document.querySelector('.tools-grid');
        if (toolsContainer) {
          this.components.toolsGrid = new ToolsGrid(toolsContainer, TOOLS_DATA);
          // Add category filter
          this.components.toolsGrid.addCategoryFilter();
          // Make globally available for easy access
          window.toolsGrid = this.components.toolsGrid;
          console.log('✅ Tools grid component initialized');
        }
      }

      // Initialize Theme Manager
      if (typeof ThemeManager !== 'undefined') {
        this.components.themeManager = new ThemeManager();
        console.log('✅ Theme manager initialized');
      }

      // Initialize Tools Synchronization
      if (typeof ToolsSync !== 'undefined') {
        this.components.toolsSync = ToolsSync.getInstance();
        this.setupToolsIntegration();
        console.log('✅ Tools synchronization initialized');
      }

      // Initialize Interactive Components (if not already initialized)
      if (typeof InteractiveComponents !== 'undefined' && !window.interactiveComponents) {
        this.components.interactiveComponents = new InteractiveComponents();
        console.log('✅ Interactive components initialized');
      }

      // Initialize Sections Manager
      if (typeof SectionsManager !== 'undefined') {
        this.components.sectionsManager = new SectionsManager();
        console.log('✅ Sections manager initialized');
      }

      // Initialize Critical CSS after other components
      if (typeof CriticalCSS !== 'undefined') {
        // Delay critical CSS to avoid blocking
        setTimeout(() => {
          this.components.criticalCSS = new CriticalCSS();
          console.log('✅ Critical CSS system initialized');
        }, 100);
      }

      // Initialize other components as they are added
      this.setupGlobalEventListeners();
      this.setupPerformanceMonitoring();
      
      console.log('🚀 App initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      
      // Utiliser le gestionnaire d'erreurs si disponible
      if (this.components.errorHandler) {
        this.components.errorHandler.reportError(error, {
          context: 'app_initialization',
          severity: 'critical'
        });
      }
      
      // Afficher un message d'erreur à l'utilisateur
      this.showInitializationError(error);
    }
  }

  setupGlobalEventListeners() {
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
      const hash = window.location.hash;
      if (hash && this.components.navigation) {
        const sectionId = hash.substring(1);
        this.components.navigation.navigateTo(sectionId);
      }
    });

    // Handle initial hash navigation
    if (window.location.hash) {
      setTimeout(() => {
        const sectionId = window.location.hash.substring(1);
        if (this.components.navigation) {
          this.components.navigation.navigateTo(sectionId);
        }
      }, 100);
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + M to toggle mobile menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        if (this.components.navigation) {
          this.components.navigation.toggleMobileMenu();
        }
      }
    });
  }

  // Public method to get component instances
  getComponent(name) {
    return this.components[name];
  }

  // Public method to reinitialize components (useful for dynamic content)
  reinitialize() {
    this.initializeComponents();
  }

  setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', Math.round(lastEntry.startTime), 'ms');
        
        // Update performance display if available
        this.updatePerformanceDisplay('lcp', Math.round(lastEntry.startTime));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('📊 FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
          this.updatePerformanceDisplay('fid', Math.round(entry.processingStart - entry.startTime));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('📊 CLS:', clsValue.toFixed(3));
        this.updatePerformanceDisplay('cls', clsValue.toFixed(3));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor resource loading
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log('📊 Page Load Time:', Math.round(loadTime), 'ms');
      this.updatePerformanceDisplay('loadTime', Math.round(loadTime));
    });
  }

  updatePerformanceDisplay(metric, value) {
    // Update performance metrics in the UI
    const metricElement = document.querySelector(`[data-metric="${metric}"]`);
    if (metricElement) {
      metricElement.textContent = value + (metric === 'cls' ? '' : 'ms');
    }

    // Update footer performance info
    const footerMetric = document.getElementById(`perf-${metric}`);
    if (footerMetric) {
      footerMetric.textContent = value + (metric === 'cls' ? '' : 'ms');
    }
  }

  setupToolsIntegration() {
    // Écouter les événements de synchronisation
    window.addEventListener('toolUsageUpdated', (event) => {
      this.updateToolUsageDisplay(event.detail);
    });

    // Mettre à jour les statistiques d'usage dans l'interface
    this.updateUsageStats();

    // Ajouter les outils récents à l'interface
    this.displayRecentTools();
  }

  updateToolUsageDisplay(detail) {
    const { toolId, usage } = detail;
    
    // Mettre à jour le badge de l'outil si visible
    const toolCard = document.querySelector(`[data-tool-id="${toolId}"]`);
    if (toolCard) {
      const usageElement = toolCard.querySelector('.tool-usage-count');
      if (usageElement) {
        usageElement.textContent = `${usage.visits} utilisations`;
      }
    }
  }

  updateUsageStats() {
    if (!this.components.toolsSync) return;

    const stats = this.components.toolsSync.getUsageStats();
    
    // Mettre à jour les compteurs dans le footer
    const totalVisitsElement = document.getElementById('total-tool-visits');
    if (totalVisitsElement) {
      totalVisitsElement.textContent = stats.totalVisits;
    }

    // Mettre à jour l'outil le plus utilisé
    const mostUsedElement = document.getElementById('most-used-tool');
    if (mostUsedElement && stats.mostUsedTool) {
      const toolData = TOOLS_DATA.find(tool => tool.id === stats.mostUsedTool);
      mostUsedElement.textContent = toolData ? toolData.name : stats.mostUsedTool;
    }
  }

  displayRecentTools() {
    if (!this.components.toolsSync) return;

    const preferences = this.components.toolsSync.getUserPreferences();
    const recentTools = preferences.recentTools;

    if (recentTools.length === 0) return;

    // Créer une section pour les outils récents
    const recentSection = document.createElement('div');
    recentSection.className = 'recent-tools-section';
    recentSection.innerHTML = `
      <h3>🕒 Outils récemment utilisés</h3>
      <div class="recent-tools-list">
        ${recentTools.map(toolId => {
          const tool = TOOLS_DATA.find(t => t.id === toolId);
          if (!tool) return '';
          
          return `
            <a href="${tool.demoUrl}" class="recent-tool-link">
              <span class="recent-tool-icon">${tool.icon}</span>
              <span class="recent-tool-name">${tool.name}</span>
            </a>
          `;
        }).join('')}
      </div>
    `;

    // Insérer après la section hero
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && heroSection.nextElementSibling) {
      heroSection.parentNode.insertBefore(recentSection, heroSection.nextElementSibling);
    }
  }
  /**
   * Affiche une erreur d'initialisation à l'utilisateur
   */
  showInitializationError(error) {
    // Créer un message d'erreur simple si le gestionnaire d'erreurs n'est pas disponible
    const errorContainer = document.createElement('div');
    errorContainer.className = 'initialization-error';
    errorContainer.innerHTML = `
      <div class="initialization-error-content">
        <h2>⚠️ Erreur d'initialisation</h2>
        <p>Une erreur s'est produite lors du chargement de l'application.</p>
        <details>
          <summary>Détails techniques</summary>
          <pre>${error.message}\n${error.stack}</pre>
        </details>
        <button onclick="window.location.reload()" class="btn btn-primary">
          🔄 Recharger la page
        </button>
      </div>
    `;
    
    // Ajouter les styles d'urgence
    const emergencyStyles = `
      .initialization-error {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .initialization-error-content {
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .initialization-error h2 {
        color: #dc3545;
        margin-bottom: 15px;
      }
      
      .initialization-error details {
        text-align: left;
        margin: 15px 0;
        background: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
      }
      
      .initialization-error pre {
        font-size: 12px;
        overflow: auto;
        max-height: 200px;
      }
      
      .initialization-error .btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .initialization-error .btn:hover {
        background: #0056b3;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = emergencyStyles;
    document.head.appendChild(style);
    
    document.body.appendChild(errorContainer);
  }

  /**
   * Méthode pour signaler une erreur manuellement
   */
  reportError(error, context = {}) {
    if (this.components.errorHandler) {
      this.components.errorHandler.reportError(error, context);
    } else {
      console.error('Erreur non gérée:', error, context);
    }
  }

  /**
   * Obtient les statistiques d'erreurs
   */
  getErrorStats() {
    const stats = {
      errors: this.components.errorHandler ? this.components.errorHandler.getStoredErrors() : [],
      network: this.components.networkErrorHandler ? this.components.networkErrorHandler.getNetworkStatus() : {},
      fallbacks: this.components.fallbackContentManager ? this.components.fallbackContentManager.getStats() : {}
    };
    
    return stats;
  }

  /**
   * Nettoie les erreurs et réessaie les ressources
   */
  retryFailedResources() {
    if (this.components.errorHandler) {
      this.components.errorHandler.clearStoredErrors();
    }
    
    if (this.components.fallbackContentManager) {
      this.components.fallbackContentManager.retryAll();
    }
    
    console.log('🔄 Retry des ressources échouées lancé');
  }
}

// Initialize the app
window.app = new App();

// Ajouter des méthodes globales pour le debugging
window.getErrorStats = () => window.app.getErrorStats();
window.retryFailedResources = () => window.app.retryFailedResources();
window.exportErrorReport = () => {
  if (window.errorHandler) {
    window.errorHandler.exportErrorReport();
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}