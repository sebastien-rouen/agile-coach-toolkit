/**
 * Critical CSS Inlining System
 * Handles critical CSS extraction and inlining for optimal performance
 */

class CriticalCSS {
  constructor(options = {}) {
    this.options = {
      criticalHeight: 800, // Above-the-fold height
      criticalSelectors: [
        // Navigation
        '.header', '.navbar', '.navbar-container', '.navbar-brand', '.navbar-menu',
        '.navbar-toggle', '.navbar-mobile',
        
        // Hero section (critical above-the-fold content)
        '.hero-section', '.hero-container', '.hero-content', '.hero-title',
        '.hero-subtitle', '.hero-description', '.hero-actions', '.hero-badges',
        
        // Critical buttons and links
        '.btn', '.btn-primary', '.btn-secondary',
        
        // Essential layout
        'body', 'html', '.container', '.section-header',
        
        // Loading states
        '.loading', '.skeleton',
        
        // Critical typography
        'h1', 'h2', 'h3', 'p',
        
        // Theme variables (always critical)
        ':root'
      ],
      nonCriticalSelectors: [
        // Footer (below the fold)
        '.footer',
        
        // Tools grid (lazy loaded)
        '.tools-grid', '.tool-card',
        
        // Documentation section
        '.documentation', '.doc-card',
        
        // Installation section
        '.installation',
        
        // Animations (non-critical)
        '@keyframes', '.animate',
        
        // Modal and overlay components
        '.modal', '.overlay', '.tooltip'
      ],
      ...options
    };

    this.criticalCSS = '';
    this.nonCriticalCSS = '';
    this.extractedRules = new Set();
    
    this.init();
  }

  init() {
    // Extract critical CSS from existing stylesheets
    this.extractCriticalCSS();
    
    // Inline critical CSS
    this.inlineCriticalCSS();
    
    // Load non-critical CSS asynchronously
    this.loadNonCriticalCSS();
    
    console.log('✅ Critical CSS system initialized');
  }

  extractCriticalCSS() {
    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        this.processStylesheet(stylesheet);
      } catch (error) {
        console.warn('Cannot access stylesheet (CORS):', stylesheet.href);
      }
    });
  }

  processStylesheet(stylesheet) {
    if (!stylesheet.cssRules) return;
    
    Array.from(stylesheet.cssRules).forEach(rule => {
      this.processRule(rule);
    });
  }

  processRule(rule) {
    if (rule.type === CSSRule.STYLE_RULE) {
      this.processStyleRule(rule);
    } else if (rule.type === CSSRule.MEDIA_RULE) {
      this.processMediaRule(rule);
    } else if (rule.type === CSSRule.KEYFRAMES_RULE) {
      this.processKeyframesRule(rule);
    }
  }

  processStyleRule(rule) {
    const selector = rule.selectorText;
    const cssText = rule.cssText;
    
    if (this.isCriticalSelector(selector)) {
      this.criticalCSS += cssText + '\n';
    } else {
      this.nonCriticalCSS += cssText + '\n';
    }
    
    this.extractedRules.add(selector);
  }

  processMediaRule(rule) {
    const mediaText = rule.media.mediaText;
    let criticalRules = '';
    let nonCriticalRules = '';
    
    Array.from(rule.cssRules).forEach(innerRule => {
      if (innerRule.type === CSSRule.STYLE_RULE) {
        const selector = innerRule.selectorText;
        const cssText = innerRule.cssText;
        
        if (this.isCriticalSelector(selector)) {
          criticalRules += cssText + '\n';
        } else {
          nonCriticalRules += cssText + '\n';
        }
      }
    });
    
    if (criticalRules) {
      this.criticalCSS += `@media ${mediaText} {\n${criticalRules}}\n`;
    }
    
    if (nonCriticalRules) {
      this.nonCriticalCSS += `@media ${mediaText} {\n${nonCriticalRules}}\n`;
    }
  }

  processKeyframesRule(rule) {
    const cssText = rule.cssText;
    
    // Most animations are non-critical
    if (this.isAnimationCritical(rule.name)) {
      this.criticalCSS += cssText + '\n';
    } else {
      this.nonCriticalCSS += cssText + '\n';
    }
  }

  isCriticalSelector(selector) {
    // Check if selector matches critical patterns
    return this.options.criticalSelectors.some(pattern => {
      if (pattern.startsWith('.') || pattern.startsWith('#')) {
        return selector.includes(pattern);
      } else if (pattern === ':root') {
        return selector === ':root';
      } else {
        // Element selector
        return selector.includes(pattern);
      }
    });
  }

  isAnimationCritical(animationName) {
    // Only loading and essential UI animations are critical
    const criticalAnimations = ['fadeIn', 'slideIn', 'loading', 'spinner'];
    return criticalAnimations.some(name => animationName.includes(name));
  }

  inlineCriticalCSS() {
    if (!this.criticalCSS) return;
    
    // Create critical CSS style element
    const criticalStyle = document.createElement('style');
    criticalStyle.id = 'critical-css';
    criticalStyle.textContent = this.optimizeCriticalCSS(this.criticalCSS);
    
    // Insert before any existing stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      firstLink.parentNode.insertBefore(criticalStyle, firstLink);
    } else {
      document.head.appendChild(criticalStyle);
    }
    
    console.log(`📦 Critical CSS inlined: ${this.criticalCSS.length} characters`);
  }

  optimizeCriticalCSS(css) {
    // Basic CSS optimization
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove unnecessary semicolons
      .replace(/;\s*}/g, '}')
      // Remove trailing semicolons
      .replace(/;\s*$/gm, '')
      .trim();
  }

  loadNonCriticalCSS() {
    if (!this.nonCriticalCSS) return;
    
    // Create non-critical CSS and load it asynchronously
    const nonCriticalStyle = document.createElement('style');
    nonCriticalStyle.id = 'non-critical-css';
    nonCriticalStyle.media = 'print'; // Load with low priority
    nonCriticalStyle.textContent = this.nonCriticalCSS;
    
    // Load after critical rendering
    requestIdleCallback(() => {
      document.head.appendChild(nonCriticalStyle);
      
      // Switch to screen media after load
      setTimeout(() => {
        nonCriticalStyle.media = 'all';
      }, 100);
      
      console.log(`📦 Non-critical CSS loaded: ${this.nonCriticalCSS.length} characters`);
    });
  }

  // Generate critical CSS for specific viewport
  generateCriticalCSS(viewport = { width: 1200, height: 800 }) {
    const criticalElements = this.getCriticalElements(viewport);
    const usedSelectors = new Set();
    
    // Analyze which CSS rules are actually used
    criticalElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const matchedRules = this.getMatchedRules(element);
      
      matchedRules.forEach(rule => {
        if (rule.selectorText) {
          usedSelectors.add(rule.selectorText);
        }
      });
    });
    
    return Array.from(usedSelectors);
  }

  getCriticalElements(viewport) {
    const elements = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const rect = node.getBoundingClientRect();
          // Element is in critical viewport
          if (rect.top < viewport.height && rect.bottom > 0) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      elements.push(node);
    }
    
    return elements;
  }

  getMatchedRules(element) {
    const rules = [];
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        Array.from(stylesheet.cssRules).forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            try {
              if (element.matches(rule.selectorText)) {
                rules.push(rule);
              }
            } catch (e) {
              // Invalid selector
            }
          }
        });
      } catch (e) {
        // CORS or other access issues
      }
    });
    
    return rules;
  }

  // Public API methods
  updateCriticalCSS(newSelectors) {
    this.options.criticalSelectors = [
      ...this.options.criticalSelectors,
      ...newSelectors
    ];
    this.extractCriticalCSS();
    this.inlineCriticalCSS();
  }

  getCriticalCSSStats() {
    return {
      criticalSize: this.criticalCSS.length,
      nonCriticalSize: this.nonCriticalCSS.length,
      totalRules: this.extractedRules.size,
      criticalRatio: this.criticalCSS.length / (this.criticalCSS.length + this.nonCriticalCSS.length)
    };
  }

  // Development helper to analyze CSS usage
  analyzeCSSUsage() {
    const unusedSelectors = [];
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        Array.from(stylesheet.cssRules).forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            try {
              const elements = document.querySelectorAll(rule.selectorText);
              if (elements.length === 0) {
                unusedSelectors.push(rule.selectorText);
              }
            } catch (e) {
              // Invalid selector
            }
          }
        });
      } catch (e) {
        // CORS issues
      }
    });
    
    return {
      unusedSelectors,
      unusedCount: unusedSelectors.length,
      totalRules: this.extractedRules.size
    };
  }
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
  window.CriticalCSS = CriticalCSS;
  
  // Initialize after DOM and stylesheets are loaded
  window.addEventListener('load', () => {
    window.criticalCSS = new CriticalCSS();
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CriticalCSS;
}