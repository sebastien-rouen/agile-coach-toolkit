/**
 * Système de gestion d'erreurs complet pour l'Agile Coach Toolkit
 * Gère les erreurs globales, réseau, et fournit des mécanismes de récupération
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxStoredErrors = 50;
    this.retryAttempts = new Map();
    this.maxRetryAttempts = 3;
    this.retryDelay = 1000; // 1 seconde
    this.isOnline = navigator.onLine;
    
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupNetworkMonitoring();
    this.setupUnhandledPromiseRejection();
    this.loadStoredErrors();
    
    console.log('✅ Gestionnaire d\'erreurs initialisé');
  }

  /**
   * Configuration des gestionnaires d'erreurs globaux
   */
  setupGlobalErrorHandlers() {
    // Gestionnaire d'erreurs JavaScript globales
    window.addEventListener('error', (event) => {
      const errorData = {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        severity: this.determineSeverity(event.error)
      };

      this.logError(errorData);
      this.showUserFriendlyError(errorData);
    });

    // Gestionnaire d'erreurs de ressources (images, scripts, CSS)
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const errorData = {
          type: 'resource',
          message: `Échec de chargement de la ressource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          timestamp: new Date().toISOString(),
          severity: 'medium'
        };

        this.logError(errorData);
        this.handleResourceError(event.target);
      }
    }, true);
  }

  /**
   * Gestion des promesses rejetées non capturées
   */
  setupUnhandledPromiseRejection() {
    window.addEventListener('unhandledrejection', (event) => {
      const errorData = {
        type: 'promise',
        message: event.reason?.message || 'Promesse rejetée non gérée',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        severity: 'high'
      };

      this.logError(errorData);
      this.showUserFriendlyError(errorData);
      
      // Empêcher l'affichage de l'erreur dans la console
      event.preventDefault();
    });
  }

  /**
   * Surveillance de l'état du réseau
   */
  setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showNetworkStatus('online');
      this.retryFailedRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNetworkStatus('offline');
    });
  }

  /**
   * Détermine la gravité d'une erreur
   */
  determineSeverity(error) {
    if (!error) return 'low';
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'medium';
    }
    
    if (message.includes('syntax') || message.includes('reference')) {
      return 'high';
    }
    
    if (message.includes('security') || message.includes('permission')) {
      return 'critical';
    }
    
    return 'medium';
  }

  /**
   * Enregistre une erreur
   */
  logError(errorData) {
    // Ajouter à la liste des erreurs
    this.errors.unshift(errorData);
    
    // Limiter le nombre d'erreurs stockées
    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors);
    }
    
    // Sauvegarder dans le localStorage
    this.saveErrorsToStorage();
    
    // Log dans la console pour le développement
    console.error('🚨 Erreur capturée:', errorData);
    
    // Envoyer à l'analytics local si disponible
    this.reportToAnalytics(errorData);
  }

  /**
   * Sauvegarde les erreurs dans le localStorage
   */
  saveErrorsToStorage() {
    try {
      const errorsToStore = this.errors.slice(0, 10); // Garder seulement les 10 dernières
      localStorage.setItem('agile_toolkit_errors', JSON.stringify(errorsToStore));
    } catch (e) {
      console.warn('Impossible de sauvegarder les erreurs dans le localStorage:', e);
    }
  }

  /**
   * Charge les erreurs depuis le localStorage
   */
  loadStoredErrors() {
    try {
      const storedErrors = localStorage.getItem('agile_toolkit_errors');
      if (storedErrors) {
        const parsedErrors = JSON.parse(storedErrors);
        this.errors = Array.isArray(parsedErrors) ? parsedErrors : [];
      }
    } catch (e) {
      console.warn('Impossible de charger les erreurs depuis le localStorage:', e);
      this.errors = [];
    }
  }

  /**
   * Affiche un message d'erreur convivial à l'utilisateur
   */
  showUserFriendlyError(errorData) {
    const message = this.getUserFriendlyMessage(errorData);
    
    // Ne pas afficher les erreurs de faible gravité
    if (errorData.severity === 'low') {
      return;
    }
    
    this.showNotification(message, errorData.severity);
  }

  /**
   * Génère un message d'erreur convivial
   */
  getUserFriendlyMessage(errorData) {
    const messages = {
      network: {
        title: "🌐 Problème de connexion",
        message: "Vérifiez votre connexion internet et réessayez.",
        action: "Réessayer"
      },
      resource: {
        title: "📦 Ressource indisponible",
        message: "Certains éléments n'ont pas pu être chargés.",
        action: "Actualiser"
      },
      javascript: {
        title: "⚠️ Erreur technique",
        message: "Une erreur technique s'est produite. L'équipe a été notifiée.",
        action: "Continuer"
      },
      promise: {
        title: "🔄 Opération échouée",
        message: "L'opération n'a pas pu être terminée. Veuillez réessayer.",
        action: "Réessayer"
      }
    };

    return messages[errorData.type] || messages.javascript;
  }

  /**
   * Affiche une notification à l'utilisateur
   */
  showNotification(messageData, severity = 'medium') {
    // Créer ou récupérer le conteneur de notifications
    let notificationContainer = document.getElementById('error-notifications');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'error-notifications';
      notificationContainer.className = 'error-notifications';
      notificationContainer.setAttribute('aria-live', 'polite');
      notificationContainer.setAttribute('aria-label', 'Notifications d\'erreur');
      document.body.appendChild(notificationContainer);
    }

    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `error-notification error-${severity}`;
    notification.setAttribute('role', 'alert');
    
    notification.innerHTML = `
      <div class="error-notification-content">
        <div class="error-notification-header">
          <h4 class="error-notification-title">${messageData.title}</h4>
          <button class="error-notification-close" aria-label="Fermer la notification">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p class="error-notification-message">${messageData.message}</p>
        ${messageData.action ? `
          <div class="error-notification-actions">
            <button class="error-notification-action btn btn-sm btn-primary">
              ${messageData.action}
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Ajouter les gestionnaires d'événements
    const closeBtn = notification.querySelector('.error-notification-close');
    closeBtn.addEventListener('click', () => {
      this.dismissNotification(notification);
    });

    const actionBtn = notification.querySelector('.error-notification-action');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        this.handleNotificationAction(messageData.action);
        this.dismissNotification(notification);
      });
    }

    // Ajouter la notification
    notificationContainer.appendChild(notification);

    // Auto-dismiss après 10 secondes pour les erreurs de faible gravité
    if (severity === 'low' || severity === 'medium') {
      setTimeout(() => {
        if (notification.parentNode) {
          this.dismissNotification(notification);
        }
      }, 10000);
    }
  }

  /**
   * Ferme une notification
   */
  dismissNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Gère les actions des notifications
   */
  handleNotificationAction(action) {
    switch (action) {
      case 'Réessayer':
        window.location.reload();
        break;
      case 'Actualiser':
        window.location.reload();
        break;
      case 'Continuer':
        // Ne rien faire, juste fermer la notification
        break;
      default:
        console.log('Action non reconnue:', action);
    }
  }

  /**
   * Gère les erreurs de chargement de ressources
   */
  handleResourceError(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'img':
        this.handleImageError(element);
        break;
      case 'script':
        this.handleScriptError(element);
        break;
      case 'link':
        this.handleStylesheetError(element);
        break;
      default:
        console.warn('Erreur de ressource non gérée:', element);
    }
  }

  /**
   * Gère les erreurs d'images
   */
  handleImageError(img) {
    // Remplacer par une image de placeholder
    const placeholder = this.createImagePlaceholder(img.alt || 'Image non disponible');
    img.src = placeholder;
    img.classList.add('error-fallback');
    
    // Ajouter un attribut pour indiquer l'erreur
    img.setAttribute('data-error', 'true');
    img.setAttribute('title', 'Image non disponible');
  }

  /**
   * Crée un placeholder SVG pour les images
   */
  createImagePlaceholder(text) {
    const svg = `
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
          📷 ${text}
        </text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  /**
   * Gère les erreurs de scripts
   */
  handleScriptError(script) {
    console.warn('Script non chargé:', script.src);
    
    // Marquer le script comme défaillant
    script.setAttribute('data-error', 'true');
    
    // Essayer de recharger le script après un délai
    const src = script.src;
    const retryKey = `script_${src}`;
    
    if (!this.retryAttempts.has(retryKey) || this.retryAttempts.get(retryKey) < this.maxRetryAttempts) {
      const attempts = this.retryAttempts.get(retryKey) || 0;
      this.retryAttempts.set(retryKey, attempts + 1);
      
      setTimeout(() => {
        this.retryScriptLoad(src);
      }, this.retryDelay * (attempts + 1));
    }
  }

  /**
   * Réessaie de charger un script
   */
  retryScriptLoad(src) {
    const newScript = document.createElement('script');
    newScript.src = src;
    newScript.async = true;
    
    newScript.onload = () => {
      console.log('✅ Script rechargé avec succès:', src);
      this.retryAttempts.delete(`script_${src}`);
    };
    
    newScript.onerror = () => {
      console.error('❌ Échec du rechargement du script:', src);
    };
    
    document.head.appendChild(newScript);
  }

  /**
   * Gère les erreurs de feuilles de style
   */
  handleStylesheetError(link) {
    console.warn('Feuille de style non chargée:', link.href);
    
    // Marquer comme défaillante
    link.setAttribute('data-error', 'true');
    
    // Appliquer des styles de fallback si nécessaire
    this.applyFallbackStyles();
  }

  /**
   * Applique des styles de fallback
   */
  applyFallbackStyles() {
    if (document.getElementById('fallback-styles')) {
      return; // Déjà appliqués
    }
    
    const fallbackCSS = `
      /* Styles de fallback en cas d'échec de chargement CSS */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 20px;
      }
      
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 400px;
        z-index: 10000;
      }
      
      .error-notification.error-high {
        border-left: 4px solid #dc3545;
      }
      
      .error-notification.error-medium {
        border-left: 4px solid #ffc107;
      }
      
      .error-notification.error-low {
        border-left: 4px solid #17a2b8;
      }
      
      .error-fallback {
        opacity: 0.7;
        filter: grayscale(100%);
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'fallback-styles';
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  /**
   * Affiche l'état du réseau
   */
  showNetworkStatus(status) {
    const message = status === 'online' 
      ? { title: "🌐 Connexion rétablie", message: "Vous êtes de nouveau en ligne.", action: null }
      : { title: "📡 Hors ligne", message: "Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.", action: null };
    
    this.showNotification(message, status === 'online' ? 'low' : 'medium');
  }

  /**
   * Réessaie les requêtes échouées
   */
  retryFailedRequests() {
    // Cette méthode peut être étendue pour réessayer des requêtes spécifiques
    console.log('🔄 Tentative de récupération des requêtes échouées...');
    
    // Réessayer de charger les images qui ont échoué
    const failedImages = document.querySelectorAll('img[data-error="true"]');
    failedImages.forEach(img => {
      const originalSrc = img.getAttribute('data-original-src');
      if (originalSrc) {
        img.removeAttribute('data-error');
        img.src = originalSrc;
      }
    });
  }

  /**
   * Rapporte l'erreur à l'analytics local
   */
  reportToAnalytics(errorData) {
    if (typeof Analytics !== 'undefined' && window.analytics) {
      window.analytics.trackEvent('error', {
        type: errorData.type,
        severity: errorData.severity,
        message: errorData.message,
        timestamp: errorData.timestamp
      });
    }
  }

  /**
   * Méthode publique pour signaler une erreur manuellement
   */
  reportError(error, context = {}) {
    const errorData = {
      type: 'manual',
      message: error.message || error,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      severity: context.severity || 'medium'
    };
    
    this.logError(errorData);
    this.showUserFriendlyError(errorData);
  }

  /**
   * Récupère les erreurs stockées
   */
  getStoredErrors() {
    return [...this.errors];
  }

  /**
   * Efface les erreurs stockées
   */
  clearStoredErrors() {
    this.errors = [];
    localStorage.removeItem('agile_toolkit_errors');
    console.log('🧹 Erreurs effacées');
  }

  /**
   * Génère un rapport d'erreurs
   */
  generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: this.errors,
      systemInfo: {
        online: this.isOnline,
        cookiesEnabled: navigator.cookieEnabled,
        language: navigator.language,
        platform: navigator.platform,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth
        }
      }
    };
    
    return report;
  }

  /**
   * Exporte le rapport d'erreurs
   */
  exportErrorReport() {
    const report = this.generateErrorReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agile-toolkit-errors-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Créer une instance globale
window.errorHandler = new ErrorHandler();

// Exporter pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}