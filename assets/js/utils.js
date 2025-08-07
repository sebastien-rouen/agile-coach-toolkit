/**
 * Fonctions utilitaires pour l'Agile Coach Toolkit
 * Inclut des helpers pour la gestion d'erreurs et autres utilitaires
 */

/**
 * Utilitaires de gestion d'erreurs
 */
const ErrorUtils = {
  /**
   * Crée un wrapper sécurisé pour les fonctions
   */
  safeExecute: (fn, context = 'unknown', fallback = null) => {
    return (...args) => {
      try {
        return fn.apply(this, args);
      } catch (error) {
        console.error(`Erreur dans ${context}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.reportError(error, { context });
        }
        
        return fallback;
      }
    };
  },

  /**
   * Wrapper pour les promesses avec gestion d'erreur
   */
  safePromise: (promise, context = 'unknown') => {
    return promise.catch(error => {
      console.error(`Erreur de promesse dans ${context}:`, error);
      
      if (window.errorHandler) {
        window.errorHandler.reportError(error, { context, type: 'promise' });
      }
      
      throw error;
    });
  },

  /**
   * Debounce pour éviter les erreurs répétées
   */
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  /**
   * Throttle pour limiter les appels
   */
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

/**
 * Utilitaires DOM avec gestion d'erreurs
 */
const DOMUtils = {
  /**
   * Sélecteur sécurisé
   */
  safeQuerySelector: (selector, context = document) => {
    try {
      return context.querySelector(selector);
    } catch (error) {
      console.error('Erreur de sélecteur:', selector, error);
      return null;
    }
  },

  /**
   * Sélecteur multiple sécurisé
   */
  safeQuerySelectorAll: (selector, context = document) => {
    try {
      return context.querySelectorAll(selector);
    } catch (error) {
      console.error('Erreur de sélecteur multiple:', selector, error);
      return [];
    }
  },

  /**
   * Ajout d'événement sécurisé
   */
  safeAddEventListener: (element, event, handler, options = {}) => {
    if (!element || typeof handler !== 'function') {
      console.warn('Élément ou handler invalide pour addEventListener');
      return;
    }

    const safeHandler = ErrorUtils.safeExecute(handler, `event_${event}`);
    
    try {
      element.addEventListener(event, safeHandler, options);
      return () => element.removeEventListener(event, safeHandler, options);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'événement:', error);
      return () => {};
    }
  },

  /**
   * Création d'élément sécurisée
   */
  safeCreateElement: (tagName, attributes = {}, textContent = '') => {
    try {
      const element = document.createElement(tagName);
      
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'innerHTML') {
          element.innerHTML = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      
      if (textContent) {
        element.textContent = textContent;
      }
      
      return element;
    } catch (error) {
      console.error('Erreur lors de la création d\'élément:', error);
      return null;
    }
  },

  /**
   * Vérification de visibilité d'un élément
   */
  isElementVisible: (element) => {
    if (!element) return false;
    
    try {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && 
             rect.top >= 0 && rect.left >= 0 &&
             rect.bottom <= window.innerHeight && 
             rect.right <= window.innerWidth;
    } catch (error) {
      console.error('Erreur lors de la vérification de visibilité:', error);
      return false;
    }
  }
};

/**
 * Utilitaires de stockage avec gestion d'erreurs
 */
const StorageUtils = {
  /**
   * Lecture sécurisée du localStorage
   */
  safeGetItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erreur de lecture localStorage:', key, error);
      return defaultValue;
    }
  },

  /**
   * Écriture sécurisée dans le localStorage
   */
  safeSetItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Erreur d\'écriture localStorage:', key, error);
      
      // Essayer de nettoyer l'espace si quota dépassé
      if (error.name === 'QuotaExceededError') {
        StorageUtils.cleanupStorage();
        
        // Réessayer une fois
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('Échec du retry localStorage:', retryError);
        }
      }
      
      return false;
    }
  },

  /**
   * Suppression sécurisée du localStorage
   */
  safeRemoveItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erreur de suppression localStorage:', key, error);
      return false;
    }
  },

  /**
   * Nettoyage du localStorage
   */
  cleanupStorage: () => {
    try {
      const keysToRemove = [];
      
      // Identifier les clés anciennes ou non essentielles
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Supprimer les erreurs anciennes (plus de 7 jours)
        if (key && key.includes('errors')) {
          const data = StorageUtils.safeGetItem(key);
          if (data && data.timestamp) {
            const age = Date.now() - new Date(data.timestamp).getTime();
            if (age > 7 * 24 * 60 * 60 * 1000) { // 7 jours
              keysToRemove.push(key);
            }
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Nettoyage localStorage: ${keysToRemove.length} éléments supprimés`);
      
    } catch (error) {
      console.error('Erreur lors du nettoyage localStorage:', error);
    }
  }
};

/**
 * Utilitaires de performance
 */
const PerformanceUtils = {
  /**
   * Mesure le temps d'exécution d'une fonction
   */
  measureTime: (fn, label = 'operation') => {
    return (...args) => {
      const start = performance.now();
      try {
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
      } catch (error) {
        const end = performance.now();
        console.error(`❌ ${label} (erreur après ${(end - start).toFixed(2)}ms):`, error);
        throw error;
      }
    };
  },

  /**
   * Observe les métriques de performance
   */
  observePerformance: (callback) => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            callback(entry);
          });
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
        return observer;
      } catch (error) {
        console.error('Erreur lors de l\'observation des performances:', error);
        return null;
      }
    }
    return null;
  }
};

/**
 * Utilitaires de validation
 */
const ValidationUtils = {
  /**
   * Valide une URL
   */
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Valide un email
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Sanitise une chaîne HTML
   */
  sanitizeHtml: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Valide les données JSON
   */
  isValidJson: (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }
};

/**
 * Utilitaires de formatage
 */
const FormatUtils = {
  /**
   * Formate une date de manière lisible
   */
  formatDate: (date, locale = 'fr-FR') => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date));
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return date.toString();
    }
  },

  /**
   * Formate une taille de fichier
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Formate un nombre avec séparateurs
   */
  formatNumber: (num, locale = 'fr-FR') => {
    try {
      return new Intl.NumberFormat(locale).format(num);
    } catch (error) {
      console.error('Erreur de formatage de nombre:', error);
      return num.toString();
    }
  }
};

/**
 * Utilitaires d'accessibilité
 */
const A11yUtils = {
  /**
   * Annonce un message aux lecteurs d'écran
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Gère le focus de manière sécurisée
   */
  safeFocus: (element) => {
    if (!element) return;
    
    try {
      // Vérifier si l'élément peut recevoir le focus
      if (element.tabIndex >= 0 || element.matches('a, button, input, select, textarea')) {
        element.focus();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du focus:', error);
    }
    
    return false;
  },

  /**
   * Crée un ID unique pour l'accessibilité
   */
  generateId: (prefix = 'element') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Exporter les utilitaires
window.ErrorUtils = ErrorUtils;
window.DOMUtils = DOMUtils;
window.StorageUtils = StorageUtils;
window.PerformanceUtils = PerformanceUtils;
window.ValidationUtils = ValidationUtils;
window.FormatUtils = FormatUtils;
window.A11yUtils = A11yUtils;

// Exporter pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ErrorUtils,
    DOMUtils,
    StorageUtils,
    PerformanceUtils,
    ValidationUtils,
    FormatUtils,
    A11yUtils
  };
}