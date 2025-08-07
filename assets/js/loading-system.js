/**
 * Loading System Component
 * Provides loading states and progress indicators
 */

class LoadingSystem {
  constructor() {
    this.activeLoaders = new Map();
    this.globalLoader = null;
    this.init();
  }

  init() {
    this.createGlobalLoader();
    this.setupProgressObserver();
  }

  createGlobalLoader() {
    // Check if global loader already exists
    this.globalLoader = document.getElementById('global-loading-indicator');
    
    if (!this.globalLoader) {
      this.globalLoader = document.createElement('div');
      this.globalLoader.id = 'global-loading-indicator';
      this.globalLoader.className = 'loading-overlay';
      this.globalLoader.setAttribute('aria-hidden', 'true');
      this.globalLoader.setAttribute('role', 'status');
      this.globalLoader.setAttribute('aria-label', 'Chargement en cours');

      this.globalLoader.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">Chargement...</p>
        </div>
      `;

      document.body.appendChild(this.globalLoader);
    }
  }

  setupProgressObserver() {
    // Observe for elements with loading states
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const loadingElements = node.querySelectorAll('[data-loading]');
            loadingElements.forEach((element) => {
              this.initializeLoadingElement(element);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initialize existing loading elements
    document.querySelectorAll('[data-loading]').forEach((element) => {
      this.initializeLoadingElement(element);
    });
  }

  initializeLoadingElement(element) {
    const loadingType = element.getAttribute('data-loading');
    const loadingText = element.getAttribute('data-loading-text') || 'Chargement...';
    
    if (loadingType === 'true' || loadingType === 'spinner') {
      this.showElementLoader(element, { type: 'spinner', text: loadingText });
    } else if (loadingType === 'skeleton') {
      this.showElementLoader(element, { type: 'skeleton', text: loadingText });
    } else if (loadingType === 'progress') {
      this.showElementLoader(element, { type: 'progress', text: loadingText });
    }
  }

  // Global loading methods
  showGlobalLoader(options = {}) {
    const {
      text = 'Chargement...',
      backdrop = true,
      spinner = true
    } = options;

    if (!this.globalLoader) {
      this.createGlobalLoader();
    }

    const textElement = this.globalLoader.querySelector('.loading-text');
    if (textElement) {
      textElement.textContent = text;
    }

    if (!backdrop) {
      this.globalLoader.classList.add('loading-no-backdrop');
    } else {
      this.globalLoader.classList.remove('loading-no-backdrop');
    }

    if (!spinner) {
      this.globalLoader.classList.add('loading-no-spinner');
    } else {
      this.globalLoader.classList.remove('loading-no-spinner');
    }

    this.globalLoader.setAttribute('aria-hidden', 'false');
    this.globalLoader.classList.add('loading-show');
    
    // Prevent body scroll
    document.body.classList.add('loading-active');

    // Announce to screen readers
    this.announceLoading(text);
  }

  hideGlobalLoader() {
    if (!this.globalLoader) return;

    this.globalLoader.classList.remove('loading-show');
    this.globalLoader.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.classList.remove('loading-active');

    // Announce completion to screen readers
    this.announceLoading('Chargement terminé');
  }

  // Element-specific loading methods
  showElementLoader(element, options = {}) {
    const {
      type = 'spinner',
      text = 'Chargement...',
      size = 'medium',
      position = 'center'
    } = options;

    // Remove existing loader if any
    this.hideElementLoader(element);

    const loaderId = `loader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const loader = this.createElementLoader(type, text, size, position);
    loader.id = loaderId;

    // Store loader reference
    this.activeLoaders.set(element, { loader, type, text });

    // Add loader to element
    element.style.position = 'relative';
    element.appendChild(loader);
    element.setAttribute('aria-busy', 'true');

    // Show with animation
    requestAnimationFrame(() => {
      loader.classList.add('loading-show');
    });

    return loaderId;
  }

  hideElementLoader(element) {
    const loaderData = this.activeLoaders.get(element);
    if (!loaderData) return;

    const { loader } = loaderData;
    
    loader.classList.remove('loading-show');
    element.setAttribute('aria-busy', 'false');

    // Remove after animation
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 200);

    this.activeLoaders.delete(element);
  }

  createElementLoader(type, text, size, position) {
    const loader = document.createElement('div');
    loader.className = `element-loader element-loader-${type} element-loader-${size} element-loader-${position}`;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', text);

    switch (type) {
      case 'spinner':
        loader.innerHTML = `
          <div class="element-loader-content">
            <div class="loading-spinner"></div>
            ${text ? `<span class="loading-text">${text}</span>` : ''}
          </div>
        `;
        break;

      case 'skeleton':
        loader.innerHTML = `
          <div class="element-loader-content">
            <div class="skeleton-loader">
              <div class="skeleton-line skeleton-line-title"></div>
              <div class="skeleton-line skeleton-line-text"></div>
              <div class="skeleton-line skeleton-line-text"></div>
              <div class="skeleton-line skeleton-line-short"></div>
            </div>
          </div>
        `;
        break;

      case 'progress':
        loader.innerHTML = `
          <div class="element-loader-content">
            <div class="progress-loader">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              ${text ? `<span class="loading-text">${text}</span>` : ''}
            </div>
          </div>
        `;
        break;

      case 'dots':
        loader.innerHTML = `
          <div class="element-loader-content">
            <div class="dots-loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            ${text ? `<span class="loading-text">${text}</span>` : ''}
          </div>
        `;
        break;

      default:
        loader.innerHTML = `
          <div class="element-loader-content">
            <div class="loading-spinner"></div>
            ${text ? `<span class="loading-text">${text}</span>` : ''}
          </div>
        `;
    }

    return loader;
  }

  // Progress bar methods
  createProgressBar(container, options = {}) {
    const {
      id = `progress-${Date.now()}`,
      value = 0,
      max = 100,
      text = '',
      showPercentage = true,
      animated = true
    } = options;

    const progressBar = document.createElement('div');
    progressBar.className = `progress-bar-container ${animated ? 'progress-animated' : ''}`;
    progressBar.id = id;

    progressBar.innerHTML = `
      <div class="progress-info">
        ${text ? `<span class="progress-label">${text}</span>` : ''}
        ${showPercentage ? `<span class="progress-percentage">0%</span>` : ''}
      </div>
      <div class="progress-bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}">
        <div class="progress-fill" style="width: ${(value / max) * 100}%"></div>
      </div>
    `;

    if (container) {
      container.appendChild(progressBar);
    }

    return {
      element: progressBar,
      update: (newValue, newText = null) => {
        const percentage = Math.min(100, Math.max(0, (newValue / max) * 100));
        const fill = progressBar.querySelector('.progress-fill');
        const percentageElement = progressBar.querySelector('.progress-percentage');
        const labelElement = progressBar.querySelector('.progress-label');
        const progressElement = progressBar.querySelector('.progress-bar');

        if (fill) {
          fill.style.width = `${percentage}%`;
        }

        if (percentageElement && showPercentage) {
          percentageElement.textContent = `${Math.round(percentage)}%`;
        }

        if (labelElement && newText) {
          labelElement.textContent = newText;
        }

        if (progressElement) {
          progressElement.setAttribute('aria-valuenow', newValue);
        }

        // Announce progress to screen readers
        if (percentage === 100) {
          this.announceLoading('Chargement terminé');
        } else if (percentage % 25 === 0) {
          this.announceLoading(`${Math.round(percentage)}% terminé`);
        }
      },
      destroy: () => {
        if (progressBar.parentNode) {
          progressBar.parentNode.removeChild(progressBar);
        }
      }
    };
  }

  // Button loading states
  setButtonLoading(button, options = {}) {
    const {
      text = 'Chargement...',
      spinner = true,
      disabled = true
    } = options;

    if (button.hasAttribute('data-loading-active')) return;

    // Store original state
    const originalText = button.textContent;
    const originalDisabled = button.disabled;
    const originalHTML = button.innerHTML;

    button.setAttribute('data-loading-active', 'true');
    button.setAttribute('data-original-text', originalText);
    button.setAttribute('data-original-disabled', originalDisabled);
    button.setAttribute('data-original-html', originalHTML);

    // Apply loading state
    if (disabled) {
      button.disabled = true;
    }

    button.setAttribute('aria-busy', 'true');
    button.classList.add('btn-loading');

    if (spinner) {
      button.innerHTML = `
        <span class="btn-loading-spinner"></span>
        <span class="btn-loading-text">${text}</span>
      `;
    } else {
      button.textContent = text;
    }
  }

  removeButtonLoading(button) {
    if (!button.hasAttribute('data-loading-active')) return;

    // Restore original state
    const originalText = button.getAttribute('data-original-text');
    const originalDisabled = button.getAttribute('data-original-disabled') === 'true';
    const originalHTML = button.getAttribute('data-original-html');

    button.disabled = originalDisabled;
    button.setAttribute('aria-busy', 'false');
    button.classList.remove('btn-loading');

    if (originalHTML && originalHTML !== originalText) {
      button.innerHTML = originalHTML;
    } else {
      button.textContent = originalText;
    }

    // Clean up attributes
    button.removeAttribute('data-loading-active');
    button.removeAttribute('data-original-text');
    button.removeAttribute('data-original-disabled');
    button.removeAttribute('data-original-html');
  }

  announceLoading(message) {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('loading-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'loading-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }

  // Utility methods
  isLoading(element = null) {
    if (element) {
      return this.activeLoaders.has(element);
    }
    return this.globalLoader && this.globalLoader.classList.contains('loading-show');
  }

  hideAllLoaders() {
    this.hideGlobalLoader();
    this.activeLoaders.forEach((loaderData, element) => {
      this.hideElementLoader(element);
    });
  }

  // Public API shortcuts
  show(options) {
    this.showGlobalLoader(options);
  }

  hide() {
    this.hideGlobalLoader();
  }

  showElement(element, options) {
    return this.showElementLoader(element, options);
  }

  hideElement(element) {
    this.hideElementLoader(element);
  }

  progress(container, options) {
    return this.createProgressBar(container, options);
  }

  buttonLoading(button, options) {
    this.setButtonLoading(button, options);
  }

  buttonDone(button) {
    this.removeButtonLoading(button);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoadingSystem;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.LoadingSystem = LoadingSystem;
}