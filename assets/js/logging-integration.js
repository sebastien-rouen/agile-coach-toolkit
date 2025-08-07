/**
 * Logging Integration System
 * Intègre avec le système de logs existant dans /logs
 */

class LoggingIntegration {
  constructor() {
    this.logsEndpoint = '/logs';
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 secondes
    this.logQueue = [];
    this.serverLoggingEnabled = false; // Désactivé par défaut
    this.init();
  }

  init() {
    this.loadExistingLogs();
    this.startBatchFlush();
    this.setupEventListeners();
  }

  loadExistingLogs() {
    // Charger les logs existants depuis localStorage
    try {
      const existingLogs = localStorage.getItem('agile-toolkit-logs');
      this.logQueue = existingLogs ? JSON.parse(existingLogs) : [];
    } catch (error) {
      console.warn('Erreur lors du chargement des logs:', error);
      this.logQueue = [];
    }
  }

  // Logger l'usage d'un outil
  logToolUsage(toolId, action = 'visit', metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'tool_usage',
      tool_id: toolId,
      action: action,
      session_id: this.getSessionId(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      metadata: metadata
    };

    this.addToQueue(logEntry);
  }

  // Logger les erreurs
  logError(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'error',
      message: error.message || error,
      stack: error.stack,
      url: window.location.href,
      user_agent: navigator.userAgent,
      context: context
    };

    this.addToQueue(logEntry);
    
    // Envoyer immédiatement les erreurs critiques
    this.sendToServer([logEntry]);
  }

  // Logger les métriques de performance
  logPerformance(metrics) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'performance',
      url: window.location.href,
      metrics: {
        load_time: metrics.loadTime,
        first_contentful_paint: metrics.firstContentfulPaint,
        largest_contentful_paint: metrics.largestContentfulPaint,
        cumulative_layout_shift: metrics.cumulativeLayoutShift,
        first_input_delay: metrics.firstInputDelay
      }
    };

    this.addToQueue(logEntry);
  }

  // Logger les événements utilisateur
  logUserEvent(event, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'user_event',
      event: event,
      url: window.location.href,
      session_id: this.getSessionId(),
      data: data
    };

    this.addToQueue(logEntry);
  }

  addToQueue(logEntry) {
    this.logQueue.push(logEntry);
    
    // Sauvegarder localement
    this.saveLogsLocally();
    
    // Flush si la queue est pleine
    if (this.logQueue.length >= this.batchSize) {
      this.flushLogs();
    }
  }

  saveLogsLocally() {
    try {
      // Garder seulement les 100 derniers logs localement
      const logsToSave = this.logQueue.slice(-100);
      localStorage.setItem('agile-toolkit-logs', JSON.stringify(logsToSave));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des logs:', error);
    }
  }

  flushLogs() {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];
    
    this.sendToServer(logsToSend);
  }

  async sendToServer(logs) {
    // Pour l'instant, on privilégie le stockage local uniquement
    // Le serveur ne supporte pas encore l'endpoint POST /logs/usage
    console.log(`📊 ${logs.length} logs sauvegardés localement`);
    
    // Sauvegarder dans les stats locales
    this.updateLocalStats(logs);
    
    // Optionnel : essayer d'envoyer au serveur seulement si configuré
    if (this.serverLoggingEnabled) {
      try {
        const response = await fetch(`${this.logsEndpoint}/usage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            logs: logs,
            source: 'agile-toolkit-frontend'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        console.log(`📊 ${logs.length} logs envoyés au serveur avec succès`);
        
      } catch (error) {
        console.log('📊 Serveur de logs non disponible, utilisation du stockage local uniquement');
      }
    }
  }

  saveToLocalFile(logs) {
    // Fallback : sauvegarder dans un fichier local pour debug
    const logData = logs.map(log => JSON.stringify(log)).join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    
    // Créer un lien de téléchargement invisible
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agile-toolkit-logs-${new Date().toISOString().split('T')[0]}.log`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    // Ne pas déclencher automatiquement le téléchargement
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  startBatchFlush() {
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  setupEventListeners() {
    // Logger les erreurs globales
    window.addEventListener('error', (event) => {
      this.logError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Logger les erreurs de promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });

    // Logger la fermeture de page
    window.addEventListener('beforeunload', () => {
      this.flushLogs();
    });

    // Logger les métriques de performance
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.collectPerformanceMetrics();
        }, 1000);
      });
    }
  }

  collectPerformanceMetrics() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0, // Nécessite l'API LCP
        cumulativeLayoutShift: 0,  // Nécessite l'API CLS
        firstInputDelay: 0         // Nécessite l'API FID
      };

      // Collecter LCP si disponible
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.largestContentfulPaint = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP non supporté
        }
      }

      this.logPerformance(metrics);
    } catch (error) {
      console.warn('Erreur lors de la collecte des métriques:', error);
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

  // API publique
  static getInstance() {
    if (!window._loggingInstance) {
      window._loggingInstance = new LoggingIntegration();
    }
    return window._loggingInstance;
  }

  // Méthodes pour intégration avec les outils existants
  integrateWithExistingStats() {
    // Lire les stats existantes si disponibles
    try {
      fetch('/logs/usage-stats.json')
        .then(response => response.json())
        .then(stats => {
          console.log('📊 Stats existantes chargées:', stats);
          // Merger avec nos données locales
          this.mergeWithExistingStats(stats);
        })
        .catch(() => {
          console.log('📊 Pas de stats existantes trouvées');
        });
    } catch (error) {
      console.warn('Erreur lors du chargement des stats existantes:', error);
    }
  }

  mergeWithExistingStats(existingStats) {
    // Logique pour merger les statistiques existantes avec les nouvelles
    const mergedStats = {
      ...existingStats,
      lastUpdate: new Date().toISOString(),
      frontend_integration: true
    };

    // Sauvegarder les stats mergées
    localStorage.setItem('agile-toolkit-merged-stats', JSON.stringify(mergedStats));
  }

  updateLocalStats(logs) {
    try {
      // Charger les stats existantes
      let stats = JSON.parse(localStorage.getItem('agile-toolkit-local-stats') || '{}');
      
      // Initialiser si nécessaire
      if (!stats.sessions) stats.sessions = {};
      if (!stats.tools) stats.tools = {};
      if (!stats.errors) stats.errors = [];
      if (!stats.performance) stats.performance = [];
      
      // Traiter chaque log
      logs.forEach(log => {
        switch (log.type) {
          case 'tool_usage':
            if (!stats.tools[log.tool_id]) stats.tools[log.tool_id] = 0;
            stats.tools[log.tool_id]++;
            break;
          case 'error':
            stats.errors.push({
              timestamp: log.timestamp,
              message: log.message,
              url: log.url
            });
            // Garder seulement les 50 dernières erreurs
            stats.errors = stats.errors.slice(-50);
            break;
          case 'performance':
            stats.performance.push({
              timestamp: log.timestamp,
              metrics: log.metrics
            });
            // Garder seulement les 20 dernières mesures
            stats.performance = stats.performance.slice(-20);
            break;
        }
      });
      
      stats.lastUpdate = new Date().toISOString();
      localStorage.setItem('agile-toolkit-local-stats', JSON.stringify(stats));
      
    } catch (error) {
      console.warn('Erreur lors de la mise à jour des stats locales:', error);
    }
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.LoggingIntegration = LoggingIntegration.getInstance();
  
  // Intégrer avec les stats existantes
  window.LoggingIntegration.integrateWithExistingStats();
});

// Export pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoggingIntegration;
}

// API globale simplifiée
if (typeof window !== 'undefined') {
  window.agileToolkitLogger = {
    logTool: (toolId, action, metadata) => LoggingIntegration.getInstance().logToolUsage(toolId, action, metadata),
    logError: (error, context) => LoggingIntegration.getInstance().logError(error, context),
    logEvent: (event, data) => LoggingIntegration.getInstance().logUserEvent(event, data)
  };
}