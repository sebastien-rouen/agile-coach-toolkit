/**
 * Lazy Loading System
 * Handles lazy loading of images, components, and non-critical content
 */

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.1,
      imageSelector: 'img[loading="lazy"], img[data-src]',
      componentSelector: '[data-lazy-component]',
      contentSelector: '[data-lazy-content]',
      ...options
    };

    this.imageObserver = null;
    this.componentObserver = null;
    this.contentObserver = null;
    this.loadedImages = new Set();
    this.loadedComponents = new Set();

    this.init();
  }

  init() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, loading all content immediately');
      this.loadAllContent();
      return;
    }

    this.setupImageLazyLoading();
    this.setupComponentLazyLoading();
    this.setupContentLazyLoading();
    
    console.log('✅ Lazy loading system initialized');
  }

  setupImageLazyLoading() {
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Observe all lazy images
    document.querySelectorAll(this.options.imageSelector).forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  setupComponentLazyLoading() {
    this.componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent(entry.target);
          this.componentObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px', // Load components a bit earlier
      threshold: 0.1
    });

    // Observe all lazy components
    document.querySelectorAll(this.options.componentSelector).forEach(component => {
      this.componentObserver.observe(component);
    });
  }

  setupContentLazyLoading() {
    this.contentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
          this.contentObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Observe all lazy content
    document.querySelectorAll(this.options.contentSelector).forEach(content => {
      this.contentObserver.observe(content);
    });
  }

  loadImage(img) {
    if (this.loadedImages.has(img)) return;

    const src = img.dataset.src || img.src;
    const srcset = img.dataset.srcset;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Add fade-in animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      if (srcset) {
        img.srcset = srcset;
      }
      img.src = src;
      
      // Remove data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;
      
      // Fade in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });

      // Mark as loaded
      this.loadedImages.add(img);
      img.classList.add('lazy-loaded');
      
      // Dispatch custom event
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { src, element: img }
      }));
    };

    imageLoader.onerror = () => {
      console.warn('Failed to load image:', src);
      img.classList.add('lazy-error');
      
      // Set fallback image if available
      const fallback = img.dataset.fallback;
      if (fallback) {
        img.src = fallback;
      }
    };

    // Start loading
    if (srcset) {
      imageLoader.srcset = srcset;
    }
    imageLoader.src = src;
  }

  loadComponent(element) {
    if (this.loadedComponents.has(element)) return;

    const componentType = element.dataset.lazyComponent;
    const componentData = element.dataset.componentData;

    try {
      // Parse component data if available
      const data = componentData ? JSON.parse(componentData) : {};
      
      // Load component based on type
      switch (componentType) {
        case 'tools-grid':
          this.loadToolsGrid(element, data);
          break;
        case 'performance-metrics':
          this.loadPerformanceMetrics(element, data);
          break;
        case 'analytics-chart':
          this.loadAnalyticsChart(element, data);
          break;
        case 'code-highlighter':
          this.loadCodeHighlighter(element, data);
          break;
        default:
          console.warn('Unknown lazy component type:', componentType);
      }

      this.loadedComponents.add(element);
      element.classList.add('lazy-component-loaded');
      
      // Dispatch custom event
      element.dispatchEvent(new CustomEvent('componentLoaded', {
        detail: { type: componentType, element, data }
      }));

    } catch (error) {
      console.error('Error loading lazy component:', error);
      element.classList.add('lazy-component-error');
    }
  }

  loadContent(element) {
    const contentType = element.dataset.lazyContent;
    const contentSrc = element.dataset.contentSrc;

    switch (contentType) {
      case 'iframe':
        this.loadIframe(element, contentSrc);
        break;
      case 'external-content':
        this.loadExternalContent(element, contentSrc);
        break;
      case 'heavy-animation':
        this.loadHeavyAnimation(element);
        break;
      default:
        // Just reveal the content
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-in-out';
        requestAnimationFrame(() => {
          element.style.opacity = '1';
        });
    }

    element.classList.add('lazy-content-loaded');
  }

  loadToolsGrid(element, data) {
    // This would integrate with the existing ToolsGrid component
    if (typeof ToolsGrid !== 'undefined' && typeof TOOLS_DATA !== 'undefined') {
      const toolsGrid = new ToolsGrid(element, TOOLS_DATA);
      element.toolsGridInstance = toolsGrid;
    }
  }

  loadPerformanceMetrics(element, data) {
    // Load performance metrics display
    if (typeof PerformanceMonitor !== 'undefined') {
      const monitor = new PerformanceMonitor();
      const metrics = monitor.getMetrics();
      
      element.innerHTML = `
        <div class="performance-metrics">
          <div class="metric">
            <span class="metric-label">FCP</span>
            <span class="metric-value">${Math.round(metrics.fcp)}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">LCP</span>
            <span class="metric-value">${Math.round(metrics.lcp)}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">CLS</span>
            <span class="metric-value">${metrics.cls.toFixed(3)}</span>
          </div>
        </div>
      `;
    }
  }

  loadAnalyticsChart(element, data) {
    // Placeholder for analytics chart loading
    element.innerHTML = '<div class="analytics-placeholder">📊 Graphique chargé</div>';
  }

  loadCodeHighlighter(element, data) {
    // Apply syntax highlighting to code blocks
    const codeBlocks = element.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      // Simple syntax highlighting (could be replaced with Prism.js or similar)
      this.highlightCode(block);
    });
  }

  loadIframe(element, src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.style.width = '100%';
    iframe.style.height = element.dataset.height || '400px';
    
    element.appendChild(iframe);
  }

  loadExternalContent(element, src) {
    fetch(src)
      .then(response => response.text())
      .then(html => {
        element.innerHTML = html;
      })
      .catch(error => {
        console.error('Failed to load external content:', error);
        element.innerHTML = '<div class="error">Contenu indisponible</div>';
      });
  }

  loadHeavyAnimation(element) {
    // Enable heavy animations only when visible
    element.classList.add('animations-enabled');
  }

  highlightCode(codeBlock) {
    // Simple code highlighting
    const code = codeBlock.textContent;
    const language = codeBlock.className.match(/language-(\w+)/)?.[1] || 'text';
    
    // Basic highlighting for common languages
    let highlighted = code;
    
    if (language === 'javascript' || language === 'js') {
      highlighted = code
        .replace(/\b(const|let|var|function|class|if|else|for|while|return)\b/g, '<span class="keyword">$1</span>')
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        .replace(/'([^']*)'|"([^"]*)"/g, '<span class="string">$&</span>');
    } else if (language === 'css') {
      highlighted = code
        .replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span class="property">$1</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/#[a-fA-F0-9]{3,6}/g, '<span class="color">$&</span>');
    }
    
    codeBlock.innerHTML = highlighted;
  }

  // Public methods
  observeNewImages(container = document) {
    if (!this.imageObserver) return;
    
    container.querySelectorAll(this.options.imageSelector).forEach(img => {
      if (!this.loadedImages.has(img)) {
        this.imageObserver.observe(img);
      }
    });
  }

  observeNewComponents(container = document) {
    if (!this.componentObserver) return;
    
    container.querySelectorAll(this.options.componentSelector).forEach(component => {
      if (!this.loadedComponents.has(component)) {
        this.componentObserver.observe(component);
      }
    });
  }

  loadAllContent() {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll(this.options.imageSelector).forEach(img => {
      this.loadImage(img);
    });
    
    document.querySelectorAll(this.options.componentSelector).forEach(component => {
      this.loadComponent(component);
    });
    
    document.querySelectorAll(this.options.contentSelector).forEach(content => {
      this.loadContent(content);
    });
  }

  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    if (this.componentObserver) {
      this.componentObserver.disconnect();
    }
    if (this.contentObserver) {
      this.contentObserver.disconnect();
    }
  }
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
  window.LazyLoader = LazyLoader;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.lazyLoader = new LazyLoader();
    });
  } else {
    window.lazyLoader = new LazyLoader();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}