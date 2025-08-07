/**
 * Resource Preloader System
 * Handles preloading and prefetching of critical resources
 */

class ResourcePreloader {
  constructor(options = {}) {
    this.options = {
      // Critical resources to preload immediately
      criticalResources: [
        { href: 'assets/css/variables.css', as: 'style', type: 'preload' },
        { href: 'assets/css/base.css', as: 'style', type: 'preload' },
        { href: 'assets/js/main.js', as: 'script', type: 'preload' },
        { href: 'assets/icons/icon-192.svg', as: 'image', type: 'preload' }
      ],
      
      // Resources to prefetch for likely navigation
      prefetchResources: [
        { href: 'tools/example-mapping/', type: 'prefetch' },
        { href: 'tools/planning-poker/', type: 'prefetch' },
        { href: 'stats.html', type: 'prefetch' }
      ],
      
      // Fonts to preload
      fontResources: [
        { href: 'assets/fonts/inter-var.woff2', type: 'font/woff2' }
      ],
      
      // DNS prefetch domains
      dnsPrefetch: [
        'fonts.googleapis.com',
        'fonts.gstatic.com'
      ],
      
      // Preconnect domains
      preconnect: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ],
      
      ...options
    };

    this.preloadedResources = new Set();
    this.prefetchedResources = new Set();
    this.loadQueue = [];
    this.isProcessingQueue = false;
    
    this.init();
  }

  init() {
    // Preload critical resources immediately
    this.preloadCriticalResources();
    
    // Setup DNS prefetch and preconnect
    this.setupDNSOptimizations();
    
    // Setup intelligent prefetching
    this.setupIntelligentPrefetch();
    
    // Setup font preloading
    this.preloadFonts();
    
    // Setup resource hints based on user behavior
    this.setupBehaviorBasedPrefetch();
    
    console.log('✅ Resource preloader initialized');
  }

  preloadCriticalResources() {
    this.options.criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  preloadResource(resource) {
    if (this.preloadedResources.has(resource.href)) return;

    const link = document.createElement('link');
    link.rel = resource.type || 'preload';
    link.href = resource.href;
    
    if (resource.as) {
      link.as = resource.as;
    }
    
    if (resource.type === 'font') {
      link.type = resource.fontType || 'font/woff2';
      link.crossOrigin = 'anonymous';
    }
    
    if (resource.media) {
      link.media = resource.media;
    }

    // Add load event listener
    link.onload = () => {
      console.log(`✅ Preloaded: ${resource.href}`);
      this.preloadedResources.add(resource.href);
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('resourcePreloaded', {
        detail: { resource, element: link }
      }));
    };

    link.onerror = () => {
      console.warn(`❌ Failed to preload: ${resource.href}`);
    };

    document.head.appendChild(link);
  }

  setupDNSOptimizations() {
    // DNS prefetch
    this.options.dnsPrefetch.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect
    this.options.preconnect.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  setupIntelligentPrefetch() {
    // Prefetch resources when user is likely to need them
    
    // Hover-based prefetching
    this.setupHoverPrefetch();
    
    // Viewport-based prefetching
    this.setupViewportPrefetch();
    
    // Time-based prefetching
    this.setupTimedPrefetch();
    
    // Connection-aware prefetching
    this.setupConnectionAwarePrefetch();
  }

  setupHoverPrefetch() {
    // Prefetch resources when user hovers over links
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.href;
      
      // Only prefetch internal links
      if (this.isInternalLink(href)) {
        this.prefetchResource({ href, type: 'prefetch' });
      }
    });
  }

  setupViewportPrefetch() {
    // Prefetch resources when they're about to enter viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const prefetchUrl = element.dataset.prefetch;
          
          if (prefetchUrl) {
            this.prefetchResource({ href: prefetchUrl, type: 'prefetch' });
          }
        }
      });
    }, {
      rootMargin: '200px 0px' // Prefetch 200px before entering viewport
    });

    // Observe elements with data-prefetch attribute
    document.querySelectorAll('[data-prefetch]').forEach(element => {
      observer.observe(element);
    });
  }

  setupTimedPrefetch() {
    // Prefetch non-critical resources after initial load
    window.addEventListener('load', () => {
      // Wait for critical resources to load, then prefetch others
      setTimeout(() => {
        this.options.prefetchResources.forEach(resource => {
          this.prefetchResource(resource);
        });
      }, 2000); // 2 seconds after load
    });
  }

  setupConnectionAwarePrefetch() {
    // Adjust prefetching based on connection quality
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Reduce prefetching on slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.log('🐌 Slow connection detected, reducing prefetch');
        this.options.prefetchResources = this.options.prefetchResources.slice(0, 2);
      }
      
      // Increase prefetching on fast connections
      if (connection.effectiveType === '4g' && !connection.saveData) {
        console.log('🚀 Fast connection detected, increasing prefetch');
        this.prefetchAdditionalResources();
      }
    }
  }

  prefetchResource(resource) {
    if (this.prefetchedResources.has(resource.href)) return;

    // Add to queue to avoid overwhelming the browser
    this.loadQueue.push(resource);
    this.processQueue();
  }

  processQueue() {
    if (this.isProcessingQueue || this.loadQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    // Process queue with delay to avoid blocking
    const processNext = () => {
      if (this.loadQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
      }
      
      const resource = this.loadQueue.shift();
      this.createPrefetchLink(resource);
      
      // Small delay between prefetches
      setTimeout(processNext, 100);
    };
    
    processNext();
  }

  createPrefetchLink(resource) {
    const link = document.createElement('link');
    link.rel = resource.type || 'prefetch';
    link.href = resource.href;
    
    if (resource.as) {
      link.as = resource.as;
    }

    link.onload = () => {
      console.log(`🔮 Prefetched: ${resource.href}`);
      this.prefetchedResources.add(resource.href);
    };

    link.onerror = () => {
      console.warn(`❌ Failed to prefetch: ${resource.href}`);
    };

    document.head.appendChild(link);
  }

  preloadFonts() {
    this.options.fontResources.forEach(font => {
      this.preloadResource({
        href: font.href,
        as: 'font',
        type: 'preload',
        fontType: font.type
      });
    });
  }

  setupBehaviorBasedPrefetch() {
    // Track user behavior and prefetch accordingly
    let toolsViewed = false;
    let documentationViewed = false;
    
    // Intersection observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          switch (sectionId) {
            case 'tools':
              if (!toolsViewed) {
                toolsViewed = true;
                this.prefetchToolResources();
              }
              break;
            case 'documentation':
              if (!documentationViewed) {
                documentationViewed = true;
                this.prefetchDocumentationResources();
              }
              break;
          }
        }
      });
    });

    // Observe main sections
    ['#tools', '#documentation', '#installation'].forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        sectionObserver.observe(element);
      }
    });
  }

  prefetchToolResources() {
    // Prefetch tool-related resources
    const toolResources = [
      { href: 'assets/js/tools-grid.js', as: 'script', type: 'prefetch' },
      { href: 'assets/js/tools-data.js', as: 'script', type: 'prefetch' },
      { href: 'assets/css/tool-integration.css', as: 'style', type: 'prefetch' }
    ];
    
    toolResources.forEach(resource => {
      this.prefetchResource(resource);
    });
  }

  prefetchDocumentationResources() {
    // Prefetch documentation-related resources
    const docResources = [
      { href: 'tools.html', type: 'prefetch' },
      { href: 'offline.html', type: 'prefetch' }
    ];
    
    docResources.forEach(resource => {
      this.prefetchResource(resource);
    });
  }

  prefetchAdditionalResources() {
    // Additional resources for fast connections
    const additionalResources = [
      { href: 'assets/js/analytics.js', as: 'script', type: 'prefetch' },
      { href: 'assets/js/visual-effects.js', as: 'script', type: 'prefetch' },
      { href: 'stats.html', type: 'prefetch' }
    ];
    
    additionalResources.forEach(resource => {
      this.prefetchResource(resource);
    });
  }

  isInternalLink(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  // Public API methods
  preloadCustomResource(resource) {
    this.preloadResource(resource);
  }

  prefetchCustomResource(resource) {
    this.prefetchResource(resource);
  }

  getPreloadStats() {
    return {
      preloaded: this.preloadedResources.size,
      prefetched: this.prefetchedResources.size,
      queueLength: this.loadQueue.length,
      isProcessing: this.isProcessingQueue
    };
  }

  // Preload images in viewport
  preloadViewportImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            this.preloadResource({
              href: src,
              as: 'image',
              type: 'preload'
            });
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Cleanup method
  cleanup() {
    this.loadQueue = [];
    this.isProcessingQueue = false;
  }
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
  window.ResourcePreloader = ResourcePreloader;
  
  // Initialize as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.resourcePreloader = new ResourcePreloader();
    });
  } else {
    window.resourcePreloader = new ResourcePreloader();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResourcePreloader;
}