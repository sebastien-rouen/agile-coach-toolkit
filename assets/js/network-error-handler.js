/**
 * Gestionnaire d'erreurs réseau avec mécanismes de retry
 * Détecte les problèmes de connectivité et gère les tentatives de récupération
 */

class NetworkErrorHandler {
  constructor() {
    this.isOnline = navigator.onLine;
    this.retryQueue = new Map();
    this.maxRetries = 3;
    this.retryDelays = [1000, 3000, 5000]; // Délais progressifs
    this.networkStatus = 'unknown';
    this.connectionQuality = 'unknown';
    
    this.init();
  }

  init() {
    this.setupNetworkMonitoring();
    this.setupConnectionQualityMonitoring();
    this.setupFetchInterceptor();
    
    console.log('✅ Gestionnaire d\'erreurs réseau initialisé');
  }

  /**
   * Configuration de la surveillance réseau
   */
  setupNetworkMonitoring() {
    // Événements de connectivité
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.handleOffline();
    });

    // Test initial de connectivité
    this.checkConnectivity();
  }

  /**
   * Surveillance de la qualité de connexion
   */
  setupConnectionQualityMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Écouter les changements de connexion
      connection.addEventListener('change', () => {
        this.updateConnectionQuality();
      });
      
      this.updateConnectionQuality();
    }
  }

  /**
   * Met à jour les informations de qualité de connexion
   */
  updateConnectionQuality() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      this.connectionQuality = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
      
      // Adapter le comportement selon la qualité de connexion
      this.adaptToConnectionQuality();
    }
  }

  /**
   * Adapte le comportement selon la qualité de connexion
   */
  adaptToConnectionQuality() {
    if (!this.connectionQuality || typeof this.connectionQuality !== 'object') {
      return;
    }
    
    const { effectiveType, downlink, rtt } = this.connectionQuality;
    
    // Connexion lente détectée
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5 || rtt > 2000) {
      this.handleSlowConnection();
    }
    
    // Mode économie de données
    if (this.connectionQuality.saveData) {
      this.handleDataSaverMode();
    }
  }

  /**
   * Gère les connexions lentes
   */
  handleSlowConnection() {
    console.warn('🐌 Connexion lente détectée');
    
    // Augmenter les délais de retry
    this.retryDelays = [2000, 5000, 10000];
    
    // Notifier l'utilisateur
    if (window.errorHandler) {
      window.errorHandler.showNotification({
        title: "🐌 Connexion lente",
        message: "Votre connexion semble lente. Les temps de chargement peuvent être plus longs.",
        action: null
      }, 'low');
    }
  }

  /**
   * Gère le mode économie de données
   */
  handleDataSaverMode() {
    console.log('💾 Mode économie de données activé');
    
    // Désactiver le préchargement des ressources
    if (window.app && window.app.getComponent('resourcePreloader')) {
      window.app.getComponent('resourcePreloader').disable();
    }
    
    // Réduire la qualité des images
    this.optimizeImagesForDataSaver();
  }

  /**
   * Optimise les images pour le mode économie de données
   */
  optimizeImagesForDataSaver() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src && !src.includes('quality=low')) {
        // Ajouter un paramètre de qualité réduite si possible
        img.setAttribute('data-src', src + (src.includes('?') ? '&' : '?') + 'quality=low');
      }
    });
  }

  /**
   * Intercepte les requêtes fetch pour gérer les erreurs
   */
  setupFetchInterceptor() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      const requestId = this.generateRequestId(url, options);
      
      try {
        // Ajouter un timeout si pas déjà défini
        if (!options.signal) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
          
          options.signal = controller.signal;
          
          // Nettoyer le timeout si la requête se termine
          const cleanup = () => clearTimeout(timeoutId);
          options.signal.addEventListener('abort', cleanup);
        }
        
        const response = await originalFetch(url, options);
        
        // Requête réussie, supprimer de la queue de retry
        this.retryQueue.delete(requestId);
        
        // Vérifier si la réponse indique une erreur
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
        
      } catch (error) {
        return this.handleFetchError(error, url, options, requestId);
      }
    };
  }

  /**
   * Génère un ID unique pour une requête
   */
  generateRequestId(url, options) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return btoa(`${method}:${url}:${body}`).substring(0, 16);
  }

  /**
   * Gère les erreurs de fetch
   */
  async handleFetchError(error, url, options, requestId) {
    console.error('🌐 Erreur réseau:', error.message, 'URL:', url);
    
    // Déterminer le type d'erreur
    const errorType = this.classifyNetworkError(error);
    
    // Enregistrer l'erreur
    if (window.errorHandler) {
      window.errorHandler.logError({
        type: 'network',
        message: error.message,
        url: url,
        method: options.method || 'GET',
        errorType: errorType,
        timestamp: new Date().toISOString(),
        severity: this.getErrorSeverity(errorType)
      });
    }
    
    // Décider si on doit réessayer
    if (this.shouldRetry(errorType, requestId)) {
      return this.retryRequest(url, options, requestId);
    }
    
    // Pas de retry possible, propager l'erreur
    throw error;
  }

  /**
   * Classifie le type d'erreur réseau
   */
  classifyNetworkError(error) {
    const message = error.message.toLowerCase();
    
    if (error.name === 'AbortError') {
      return 'timeout';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    
    if (message.includes('cors')) {
      return 'cors';
    }
    
    if (message.includes('http 4')) {
      return 'client_error';
    }
    
    if (message.includes('http 5')) {
      return 'server_error';
    }
    
    return 'unknown';
  }

  /**
   * Détermine la gravité d'une erreur
   */
  getErrorSeverity(errorType) {
    const severityMap = {
      'timeout': 'medium',
      'network': 'high',
      'cors': 'high',
      'client_error': 'low',
      'server_error': 'medium',
      'unknown': 'medium'
    };
    
    return severityMap[errorType] || 'medium';
  }

  /**
   * Détermine si une requête doit être retentée
   */
  shouldRetry(errorType, requestId) {
    // Ne pas réessayer les erreurs client
    if (errorType === 'client_error' || errorType === 'cors') {
      return false;
    }
    
    // Vérifier le nombre de tentatives
    const retryInfo = this.retryQueue.get(requestId) || { attempts: 0 };
    return retryInfo.attempts < this.maxRetries;
  }

  /**
   * Réessaie une requête
   */
  async retryRequest(url, options, requestId) {
    const retryInfo = this.retryQueue.get(requestId) || { attempts: 0 };
    retryInfo.attempts++;
    this.retryQueue.set(requestId, retryInfo);
    
    const delay = this.retryDelays[retryInfo.attempts - 1] || this.retryDelays[this.retryDelays.length - 1];
    
    console.log(`🔄 Tentative ${retryInfo.attempts}/${this.maxRetries} dans ${delay}ms pour:`, url);
    
    // Attendre avant de réessayer
    await this.delay(delay);
    
    // Vérifier si on est toujours hors ligne
    if (!this.isOnline) {
      throw new Error('Hors ligne - retry annulé');
    }
    
    // Réessayer la requête
    return window.fetch(url, options);
  }

  /**
   * Utilitaire pour créer un délai
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gère le passage en ligne
   */
  handleOnline() {
    console.log('🌐 Connexion rétablie');
    this.isOnline = true;
    this.networkStatus = 'online';
    
    // Vérifier la connectivité réelle
    this.checkConnectivity();
    
    // Notifier l'utilisateur
    if (window.errorHandler) {
      window.errorHandler.showNotification({
        title: "🌐 Connexion rétablie",
        message: "Vous êtes de nouveau en ligne.",
        action: null
      }, 'low');
    }
    
    // Réessayer les requêtes en attente
    this.retryPendingRequests();
  }

  /**
   * Gère le passage hors ligne
   */
  handleOffline() {
    console.warn('📡 Connexion perdue');
    this.isOnline = false;
    this.networkStatus = 'offline';
    
    // Notifier l'utilisateur
    if (window.errorHandler) {
      window.errorHandler.showNotification({
        title: "📡 Hors ligne",
        message: "Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.",
        action: null
      }, 'medium');
    }
    
    // Activer le mode hors ligne si disponible
    this.enableOfflineMode();
  }

  /**
   * Vérifie la connectivité réelle
   */
  async checkConnectivity() {
    try {
      // Tenter une requête vers un endpoint fiable
      const response = await fetch('/manifest.json', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        this.networkStatus = 'online';
        this.isOnline = true;
      } else {
        throw new Error('Réponse non OK');
      }
    } catch (error) {
      this.networkStatus = 'offline';
      this.isOnline = false;
      console.warn('❌ Test de connectivité échoué:', error.message);
    }
  }

  /**
   * Réessaie les requêtes en attente
   */
  retryPendingRequests() {
    console.log('🔄 Retry des requêtes en attente...');
    
    // Cette méthode peut être étendue pour gérer une queue de requêtes
    // Pour l'instant, on se contente de nettoyer la queue
    this.retryQueue.clear();
  }

  /**
   * Active le mode hors ligne
   */
  enableOfflineMode() {
    // Ajouter une classe CSS pour indiquer le mode hors ligne
    document.body.classList.add('offline-mode');
    
    // Désactiver les fonctionnalités qui nécessitent une connexion
    this.disableOnlineFeatures();
  }

  /**
   * Désactive les fonctionnalités en ligne
   */
  disableOnlineFeatures() {
    // Désactiver les boutons qui nécessitent une connexion
    const onlineButtons = document.querySelectorAll('[data-requires-online]');
    onlineButtons.forEach(button => {
      button.disabled = true;
      button.setAttribute('title', 'Fonctionnalité indisponible hors ligne');
    });
    
    // Masquer les éléments qui nécessitent une connexion
    const onlineElements = document.querySelectorAll('[data-online-only]');
    onlineElements.forEach(element => {
      element.style.display = 'none';
    });
  }

  /**
   * Réactive les fonctionnalités en ligne
   */
  enableOnlineFeatures() {
    // Supprimer la classe offline
    document.body.classList.remove('offline-mode');
    
    // Réactiver les boutons
    const onlineButtons = document.querySelectorAll('[data-requires-online]');
    onlineButtons.forEach(button => {
      button.disabled = false;
      button.removeAttribute('title');
    });
    
    // Réafficher les éléments
    const onlineElements = document.querySelectorAll('[data-online-only]');
    onlineElements.forEach(element => {
      element.style.display = '';
    });
  }

  /**
   * Crée un wrapper pour les requêtes avec gestion d'erreur automatique
   */
  createSafeRequest(url, options = {}) {
    return {
      execute: async () => {
        try {
          const response = await fetch(url, options);
          return { success: true, data: response };
        } catch (error) {
          return { 
            success: false, 
            error: error.message,
            type: this.classifyNetworkError(error)
          };
        }
      },
      
      executeWithFallback: async (fallbackData) => {
        const result = await this.execute();
        return result.success ? result.data : fallbackData;
      }
    };
  }

  /**
   * Obtient le statut actuel du réseau
   */
  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      status: this.networkStatus,
      quality: this.connectionQuality,
      pendingRetries: this.retryQueue.size
    };
  }

  /**
   * Nettoie les ressources
   */
  cleanup() {
    this.retryQueue.clear();
    console.log('🧹 Gestionnaire d\'erreurs réseau nettoyé');
  }
}

// Créer une instance globale
window.networkErrorHandler = new NetworkErrorHandler();

// Exporter pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkErrorHandler;
}