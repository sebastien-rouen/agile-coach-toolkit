/**
 * Gestionnaire de contenu de fallback
 * Fournit des alternatives quand les ressources principales échouent
 */

class FallbackContentManager {
  constructor() {
    this.fallbackStrategies = new Map();
    this.fallbackCache = new Map();
    this.init();
  }

  init() {
    this.setupDefaultStrategies();
    this.setupResourceObserver();
    console.log('✅ Gestionnaire de contenu de fallback initialisé');
  }

  /**
   * Configure les stratégies de fallback par défaut
   */
  setupDefaultStrategies() {
    // Stratégie pour les images
    this.registerFallbackStrategy('img', {
      detect: (element) => element.tagName.toLowerCase() === 'img',
      fallback: (element) => this.createImageFallback(element),
      retry: (element) => this.retryImageLoad(element)
    });

    // Stratégie pour les scripts
    this.registerFallbackStrategy('script', {
      detect: (element) => element.tagName.toLowerCase() === 'script',
      fallback: (element) => this.createScriptFallback(element),
      retry: (element) => this.retryScriptLoad(element)
    });

    // Stratégie pour les feuilles de style
    this.registerFallbackStrategy('link', {
      detect: (element) => element.tagName.toLowerCase() === 'link' && element.rel === 'stylesheet',
      fallback: (element) => this.createStylesheetFallback(element),
      retry: (element) => this.retryStylesheetLoad(element)
    });

    // Stratégie pour les composants dynamiques
    this.registerFallbackStrategy('component', {
      detect: (element) => element.hasAttribute('data-component'),
      fallback: (element) => this.createComponentFallback(element),
      retry: (element) => this.retryComponentLoad(element)
    });
  }

  /**
   * Enregistre une nouvelle stratégie de fallback
   */
  registerFallbackStrategy(name, strategy) {
    if (!strategy.detect || !strategy.fallback) {
      throw new Error('Une stratégie doit avoir au minimum detect() et fallback()');
    }
    
    this.fallbackStrategies.set(name, strategy);
  }

  /**
   * Configure l'observateur de ressources
   */
  setupResourceObserver() {
    // Observer les erreurs de chargement
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event.target);
      }
    }, true);

    // Observer les nouveaux éléments ajoutés au DOM
    if ('MutationObserver' in window) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkElementForFallback(node);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Gère les erreurs de ressources
   */
  handleResourceError(element) {
    console.warn('🚨 Erreur de ressource détectée:', element);
    
    // Trouver la stratégie appropriée
    const strategy = this.findStrategyForElement(element);
    
    if (strategy) {
      // Marquer l'élément comme ayant une erreur
      element.setAttribute('data-error', 'true');
      element.setAttribute('data-error-timestamp', Date.now());
      
      // Appliquer le fallback
      strategy.fallback(element);
      
      // Programmer un retry si disponible
      if (strategy.retry) {
        this.scheduleRetry(element, strategy);
      }
    } else {
      console.warn('Aucune stratégie de fallback trouvée pour:', element);
    }
  }

  /**
   * Trouve la stratégie appropriée pour un élément
   */
  findStrategyForElement(element) {
    for (const [name, strategy] of this.fallbackStrategies) {
      if (strategy.detect(element)) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Vérifie si un élément nécessite un fallback
   */
  checkElementForFallback(element) {
    // Vérifier les images avec lazy loading
    if (element.tagName === 'IMG' && element.hasAttribute('data-src')) {
      this.setupLazyImageFallback(element);
    }
    
    // Vérifier les composants avec chargement différé
    if (element.hasAttribute('data-lazy-component')) {
      this.setupLazyComponentFallback(element);
    }
  }

  /**
   * Crée un fallback pour les images
   */
  createImageFallback(img) {
    const alt = img.alt || 'Image non disponible';
    const width = img.width || 200;
    const height = img.height || 150;
    
    // Créer un SVG de placeholder
    const placeholder = this.createImagePlaceholder(alt, width, height);
    
    // Remplacer la source
    img.src = placeholder;
    img.classList.add('error-fallback');
    
    // Sauvegarder l'URL originale pour retry
    if (!img.hasAttribute('data-original-src')) {
      img.setAttribute('data-original-src', img.getAttribute('src') || img.getAttribute('data-src') || '');
    }
    
    // Ajouter un message d'erreur accessible
    img.setAttribute('title', `Erreur de chargement: ${alt}`);
    
    console.log('🖼️ Fallback image appliqué pour:', img.getAttribute('data-original-src'));
  }

  /**
   * Crée un placeholder SVG pour les images
   */
  createImagePlaceholder(text, width = 200, height = 150) {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style="stroke:#ddd, stroke-width:1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonalHatch)" stroke="#ccc" stroke-width="2"/>
        <rect x="10%" y="10%" width="80%" height="60%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="4"/>
        <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="#6c757d" font-family="Arial, sans-serif" font-size="12" font-weight="500">
          📷 Image
        </text>
        <text x="50%" y="65%" text-anchor="middle" dy=".3em" fill="#868e96" font-family="Arial, sans-serif" font-size="10">
          ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}
        </text>
        <text x="50%" y="85%" text-anchor="middle" dy=".3em" fill="#adb5bd" font-family="Arial, sans-serif" font-size="8">
          Non disponible
        </text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  /**
   * Crée un fallback pour les scripts
   */
  createScriptFallback(script) {
    const src = script.src;
    console.warn('📜 Script non chargé:', src);
    
    // Créer un message d'erreur dans la console
    const errorMessage = `// ❌ Échec du chargement du script: ${src}`;
    console.error(errorMessage);
    
    // Essayer de charger une version de fallback si définie
    const fallbackSrc = script.getAttribute('data-fallback-src');
    if (fallbackSrc) {
      this.loadFallbackScript(fallbackSrc, script);
    }
    
    // Notifier les composants dépendants
    this.notifyScriptFailure(src);
  }

  /**
   * Charge un script de fallback
   */
  loadFallbackScript(fallbackSrc, originalScript) {
    const fallbackScript = document.createElement('script');
    fallbackScript.src = fallbackSrc;
    fallbackScript.async = originalScript.async;
    fallbackScript.defer = originalScript.defer;
    
    fallbackScript.onload = () => {
      console.log('✅ Script de fallback chargé:', fallbackSrc);
    };
    
    fallbackScript.onerror = () => {
      console.error('❌ Échec du script de fallback:', fallbackSrc);
    };
    
    document.head.appendChild(fallbackScript);
  }

  /**
   * Notifie l'échec d'un script
   */
  notifyScriptFailure(src) {
    // Émettre un événement personnalisé
    const event = new CustomEvent('scriptLoadFailure', {
      detail: { src: src }
    });
    document.dispatchEvent(event);
  }

  /**
   * Crée un fallback pour les feuilles de style
   */
  createStylesheetFallback(link) {
    const href = link.href;
    console.warn('🎨 Feuille de style non chargée:', href);
    
    // Appliquer des styles de base si pas déjà fait
    this.applyBasicFallbackStyles();
    
    // Essayer de charger une version de fallback
    const fallbackHref = link.getAttribute('data-fallback-href');
    if (fallbackHref) {
      this.loadFallbackStylesheet(fallbackHref);
    }
  }

  /**
   * Applique des styles de fallback de base
   */
  applyBasicFallbackStyles() {
    if (document.getElementById('fallback-styles')) {
      return; // Déjà appliqués
    }
    
    const fallbackCSS = `
      /* Styles de fallback de base */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background: #fff;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      .btn {
        display: inline-block;
        padding: 8px 16px;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        border: none;
        cursor: pointer;
      }
      
      .btn:hover {
        background: #0056b3;
      }
      
      .error-fallback {
        opacity: 0.7;
        border: 2px dashed #ddd;
        background: #f8f9fa;
      }
      
      .loading-error {
        text-align: center;
        padding: 40px 20px;
        color: #6c757d;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 20px 0;
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'fallback-styles';
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  /**
   * Charge une feuille de style de fallback
   */
  loadFallbackStylesheet(fallbackHref) {
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = fallbackHref;
    
    fallbackLink.onload = () => {
      console.log('✅ Feuille de style de fallback chargée:', fallbackHref);
    };
    
    fallbackLink.onerror = () => {
      console.error('❌ Échec de la feuille de style de fallback:', fallbackHref);
    };
    
    document.head.appendChild(fallbackLink);
  }

  /**
   * Crée un fallback pour les composants
   */
  createComponentFallback(element) {
    const componentName = element.getAttribute('data-component');
    console.warn('🧩 Composant non chargé:', componentName);
    
    // Créer un contenu de fallback
    const fallbackContent = this.createComponentFallbackContent(componentName);
    element.innerHTML = fallbackContent;
    element.classList.add('component-fallback');
  }

  /**
   * Crée le contenu de fallback pour un composant
   */
  createComponentFallbackContent(componentName) {
    const fallbackTemplates = {
      'tools-grid': `
        <div class="loading-error">
          <div class="loading-error-icon">🛠️</div>
          <div class="loading-error-message">
            Impossible de charger la grille d'outils.<br>
            <small>Vérifiez votre connexion internet.</small>
          </div>
          <button class="loading-error-action" onclick="window.location.reload()">
            Actualiser la page
          </button>
        </div>
      `,
      'performance-metrics': `
        <div class="loading-error">
          <div class="loading-error-icon">📊</div>
          <div class="loading-error-message">
            Métriques de performance indisponibles
          </div>
        </div>
      `,
      'default': `
        <div class="loading-error">
          <div class="loading-error-icon">⚠️</div>
          <div class="loading-error-message">
            Contenu temporairement indisponible
          </div>
          <button class="loading-error-action" onclick="window.location.reload()">
            Réessayer
          </button>
        </div>
      `
    };
    
    return fallbackTemplates[componentName] || fallbackTemplates['default'];
  }

  /**
   * Configure le fallback pour les images lazy
   */
  setupLazyImageFallback(img) {
    // Ajouter un timeout pour détecter les échecs de chargement
    const timeout = setTimeout(() => {
      if (!img.complete || img.naturalHeight === 0) {
        this.createImageFallback(img);
      }
    }, 10000); // 10 secondes
    
    img.addEventListener('load', () => {
      clearTimeout(timeout);
    });
    
    img.addEventListener('error', () => {
      clearTimeout(timeout);
    });
  }

  /**
   * Configure le fallback pour les composants lazy
   */
  setupLazyComponentFallback(element) {
    // Ajouter un indicateur de chargement
    element.innerHTML = `
      <div class="component-loading">
        <div class="loading-spinner">⏳</div>
        <div>Chargement...</div>
      </div>
    `;
    
    // Timeout pour détecter les échecs
    setTimeout(() => {
      if (element.classList.contains('component-loading') || 
          element.querySelector('.component-loading')) {
        this.createComponentFallback(element);
      }
    }, 15000); // 15 secondes
  }

  /**
   * Programme un retry pour un élément
   */
  scheduleRetry(element, strategy) {
    const retryCount = parseInt(element.getAttribute('data-retry-count') || '0');
    const maxRetries = 3;
    
    if (retryCount >= maxRetries) {
      console.log('🚫 Nombre maximum de tentatives atteint pour:', element);
      return;
    }
    
    const delay = Math.pow(2, retryCount) * 1000; // Backoff exponentiel
    
    setTimeout(() => {
      if (navigator.onLine) {
        element.setAttribute('data-retry-count', (retryCount + 1).toString());
        strategy.retry(element);
      }
    }, delay);
  }

  /**
   * Réessaie de charger une image
   */
  retryImageLoad(img) {
    const originalSrc = img.getAttribute('data-original-src');
    if (originalSrc) {
      console.log('🔄 Retry chargement image:', originalSrc);
      
      // Supprimer les attributs d'erreur
      img.removeAttribute('data-error');
      img.classList.remove('error-fallback');
      
      // Recharger l'image
      img.src = originalSrc + '?retry=' + Date.now();
    }
  }

  /**
   * Réessaie de charger un script
   */
  retryScriptLoad(script) {
    const src = script.src;
    if (src) {
      console.log('🔄 Retry chargement script:', src);
      
      const newScript = document.createElement('script');
      newScript.src = src + '?retry=' + Date.now();
      newScript.async = script.async;
      newScript.defer = script.defer;
      
      document.head.appendChild(newScript);
    }
  }

  /**
   * Réessaie de charger une feuille de style
   */
  retryStylesheetLoad(link) {
    const href = link.href;
    if (href) {
      console.log('🔄 Retry chargement stylesheet:', href);
      
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = href + '?retry=' + Date.now();
      
      document.head.appendChild(newLink);
    }
  }

  /**
   * Réessaie de charger un composant
   */
  retryComponentLoad(element) {
    const componentName = element.getAttribute('data-component');
    if (componentName) {
      console.log('🔄 Retry chargement composant:', componentName);
      
      // Supprimer le fallback
      element.classList.remove('component-fallback');
      element.innerHTML = '<div class="component-loading">Rechargement...</div>';
      
      // Déclencher le rechargement du composant
      const event = new CustomEvent('retryComponent', {
        detail: { componentName, element }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Nettoie les fallbacks et réessaie tout
   */
  retryAll() {
    console.log('🔄 Retry global de tous les éléments en erreur');
    
    const errorElements = document.querySelectorAll('[data-error="true"]');
    errorElements.forEach(element => {
      const strategy = this.findStrategyForElement(element);
      if (strategy && strategy.retry) {
        strategy.retry(element);
      }
    });
  }

  /**
   * Obtient les statistiques des fallbacks
   */
  getStats() {
    const errorElements = document.querySelectorAll('[data-error="true"]');
    const stats = {
      totalErrors: errorElements.length,
      byType: {}
    };
    
    errorElements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      stats.byType[tagName] = (stats.byType[tagName] || 0) + 1;
    });
    
    return stats;
  }
}

// Créer une instance globale
window.fallbackContentManager = new FallbackContentManager();

// Exporter pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FallbackContentManager;
}