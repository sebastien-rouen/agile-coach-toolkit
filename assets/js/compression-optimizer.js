/**
 * Compression Optimizer
 * Optimizes assets and structure for better compression ratios
 */

class CompressionOptimizer {
  constructor(options = {}) {
    this.options = {
      // Compression settings
      enableGzip: true,
      enableBrotli: true,
      
      // Asset optimization
      minifyCSS: true,
      minifyJS: true,
      optimizeImages: true,
      
      // Bundle optimization
      bundleThreshold: 10000, // Bundle files smaller than 10KB
      splitThreshold: 100000, // Split files larger than 100KB
      
      // Cache optimization
      cacheStrategy: 'aggressive',
      
      ...options
    };

    this.assetMap = new Map();
    this.bundleMap = new Map();
    this.compressionStats = {
      originalSize: 0,
      compressedSize: 0,
      savings: 0
    };
    
    this.init();
  }

  init() {
    // Analyze current assets
    this.analyzeAssets();
    
    // Optimize asset loading order
    this.optimizeLoadOrder();
    
    // Setup compression headers
    this.setupCompressionHeaders();
    
    // Optimize for bundling
    this.optimizeForBundling();
    
    // Setup service worker caching
    this.setupServiceWorkerCaching();
    
    console.log('✅ Compression optimizer initialized');
  }

  analyzeAssets() {
    // Analyze CSS files
    this.analyzeCSSAssets();
    
    // Analyze JavaScript files
    this.analyzeJSAssets();
    
    // Analyze image assets
    this.analyzeImageAssets();
    
    // Generate optimization report
    this.generateOptimizationReport();
  }

  analyzeCSSAssets() {
    const cssFiles = [
      'assets/css/variables.css',
      'assets/css/base.css',
      'assets/css/layout.css',
      'assets/css/components.css',
      'assets/css/responsive.css',
      'assets/css/performance.css'
    ];

    cssFiles.forEach(file => {
      this.analyzeAsset(file, 'css');
    });
  }

  analyzeJSAssets() {
    const jsFiles = [
      'assets/js/main.js',
      'assets/js/navigation.js',
      'assets/js/tools-grid.js',
      'assets/js/theme-manager.js',
      'assets/js/pwa-manager.js',
      'assets/js/lazy-loading.js',
      'assets/js/critical-css.js',
      'assets/js/resource-preloader.js'
    ];

    jsFiles.forEach(file => {
      this.analyzeAsset(file, 'js');
    });
  }

  analyzeImageAssets() {
    const imageFiles = [
      'assets/images/screenshot-main.svg',
      'assets/icons/icon-192.svg',
      'assets/icons/icon-512.svg'
    ];

    imageFiles.forEach(file => {
      this.analyzeAsset(file, 'image');
    });
  }

  analyzeAsset(filePath, type) {
    // Simulate asset analysis (in real implementation, would fetch and analyze)
    const estimatedSize = this.estimateAssetSize(filePath, type);
    const compressionRatio = this.estimateCompressionRatio(type);
    
    this.assetMap.set(filePath, {
      type,
      originalSize: estimatedSize,
      compressedSize: Math.round(estimatedSize * compressionRatio),
      compressionRatio,
      priority: this.getAssetPriority(filePath),
      bundleCandidate: estimatedSize < this.options.bundleThreshold
    });
  }

  estimateAssetSize(filePath, type) {
    // Rough size estimates based on file type and name
    const sizeMap = {
      'variables.css': 2000,
      'base.css': 5000,
      'layout.css': 3000,
      'components.css': 8000,
      'responsive.css': 4000,
      'performance.css': 2000,
      'main.js': 6000,
      'navigation.js': 4000,
      'tools-grid.js': 7000,
      'theme-manager.js': 3000,
      'pwa-manager.js': 5000,
      'lazy-loading.js': 8000,
      'critical-css.js': 6000,
      'resource-preloader.js': 7000,
      'screenshot-main.svg': 15000,
      'icon-192.svg': 3000,
      'icon-512.svg': 8000
    };
    
    const fileName = filePath.split('/').pop();
    return sizeMap[fileName] || 5000;
  }

  estimateCompressionRatio(type) {
    // Typical compression ratios for different file types
    const ratios = {
      css: 0.25,    // CSS compresses very well
      js: 0.35,     // JavaScript compresses well
      image: 0.90,  // SVGs compress moderately
      html: 0.30    // HTML compresses very well
    };
    
    return ratios[type] || 0.50;
  }

  getAssetPriority(filePath) {
    // Determine loading priority based on file importance
    const criticalFiles = [
      'variables.css',
      'base.css',
      'main.js',
      'icon-192.svg'
    ];
    
    const highPriorityFiles = [
      'layout.css',
      'components.css',
      'navigation.js',
      'theme-manager.js'
    ];
    
    const fileName = filePath.split('/').pop();
    
    if (criticalFiles.includes(fileName)) return 'critical';
    if (highPriorityFiles.includes(fileName)) return 'high';
    return 'normal';
  }

  optimizeLoadOrder() {
    // Sort assets by priority and dependencies
    const sortedAssets = Array.from(this.assetMap.entries())
      .sort(([, a], [, b]) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    // Generate optimized loading strategy
    this.generateLoadingStrategy(sortedAssets);
  }

  generateLoadingStrategy(sortedAssets) {
    const strategy = {
      critical: [],
      preload: [],
      defer: [],
      lazy: []
    };

    sortedAssets.forEach(([filePath, asset]) => {
      switch (asset.priority) {
        case 'critical':
          strategy.critical.push(filePath);
          break;
        case 'high':
          strategy.preload.push(filePath);
          break;
        default:
          if (asset.type === 'js') {
            strategy.defer.push(filePath);
          } else {
            strategy.lazy.push(filePath);
          }
      }
    });

    this.loadingStrategy = strategy;
    console.log('📋 Loading strategy generated:', strategy);
  }

  setupCompressionHeaders() {
    // Generate compression headers for service worker
    const compressionHeaders = {
      'Content-Encoding': 'gzip, br',
      'Vary': 'Accept-Encoding',
      'Cache-Control': 'public, max-age=31536000, immutable'
    };

    // Store for service worker usage
    this.compressionHeaders = compressionHeaders;
    
    // Dispatch event for service worker to pick up
    document.dispatchEvent(new CustomEvent('compressionHeadersReady', {
      detail: { headers: compressionHeaders }
    }));
  }

  optimizeForBundling() {
    // Group small assets for bundling
    const bundleCandidates = Array.from(this.assetMap.entries())
      .filter(([, asset]) => asset.bundleCandidate)
      .reduce((groups, [filePath, asset]) => {
        const group = groups[asset.type] || [];
        group.push(filePath);
        groups[asset.type] = group;
        return groups;
      }, {});

    // Create bundle configurations
    Object.entries(bundleCandidates).forEach(([type, files]) => {
      if (files.length > 1) {
        this.createBundle(type, files);
      }
    });
  }

  createBundle(type, files) {
    const bundleName = `bundle-${type}-${Date.now()}.${type}`;
    const totalSize = files.reduce((sum, file) => {
      return sum + this.assetMap.get(file).originalSize;
    }, 0);

    this.bundleMap.set(bundleName, {
      type,
      files,
      originalSize: totalSize,
      compressedSize: Math.round(totalSize * this.estimateCompressionRatio(type)),
      priority: this.getBundlePriority(files)
    });

    console.log(`📦 Bundle created: ${bundleName} (${files.length} files, ${totalSize} bytes)`);
  }

  getBundlePriority(files) {
    // Bundle priority is highest priority of included files
    const priorities = files.map(file => this.assetMap.get(file).priority);
    
    if (priorities.includes('critical')) return 'critical';
    if (priorities.includes('high')) return 'high';
    return 'normal';
  }

  setupServiceWorkerCaching() {
    // Generate caching strategies for different asset types
    const cachingStrategies = {
      critical: {
        strategy: 'CacheFirst',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        maxEntries: 50
      },
      static: {
        strategy: 'StaleWhileRevalidate',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        maxEntries: 100
      },
      dynamic: {
        strategy: 'NetworkFirst',
        maxAge: 24 * 60 * 60, // 1 day
        maxEntries: 50
      }
    };

    // Dispatch for service worker
    document.dispatchEvent(new CustomEvent('cachingStrategiesReady', {
      detail: { strategies: cachingStrategies }
    }));
  }

  generateOptimizationReport() {
    const totalOriginal = Array.from(this.assetMap.values())
      .reduce((sum, asset) => sum + asset.originalSize, 0);
    
    const totalCompressed = Array.from(this.assetMap.values())
      .reduce((sum, asset) => sum + asset.compressedSize, 0);
    
    const savings = totalOriginal - totalCompressed;
    const savingsPercent = Math.round((savings / totalOriginal) * 100);

    this.compressionStats = {
      originalSize: totalOriginal,
      compressedSize: totalCompressed,
      savings,
      savingsPercent,
      assetCount: this.assetMap.size,
      bundleCount: this.bundleMap.size
    };

    console.log('📊 Compression Report:', this.compressionStats);
  }

  // Public API methods
  getCompressionStats() {
    return this.compressionStats;
  }

  getLoadingStrategy() {
    return this.loadingStrategy;
  }

  getBundleMap() {
    return this.bundleMap;
  }

  // Generate optimized HTML for asset loading
  generateOptimizedHTML() {
    const html = {
      critical: [],
      preload: [],
      defer: []
    };

    // Critical CSS inline
    html.critical.push(`
      <style id="critical-css">
        /* Critical CSS will be inlined here */
      </style>
    `);

    // Preload important resources
    this.loadingStrategy.preload.forEach(asset => {
      const assetInfo = this.assetMap.get(asset);
      const asType = assetInfo.type === 'css' ? 'style' : 'script';
      
      html.preload.push(`
        <link rel="preload" href="${asset}" as="${asType}">
      `);
    });

    // Defer non-critical JavaScript
    this.loadingStrategy.defer.forEach(asset => {
      if (asset.endsWith('.js')) {
        html.defer.push(`
          <script src="${asset}" defer></script>
        `);
      }
    });

    return html;
  }

  // Optimize images for compression
  optimizeImages() {
    const imageOptimizations = {
      svg: {
        removeComments: true,
        removeMetadata: true,
        removeUnusedNS: true,
        cleanupAttrs: true,
        minifyStyles: true
      },
      png: {
        quality: 85,
        progressive: true
      },
      jpg: {
        quality: 80,
        progressive: true
      }
    };

    return imageOptimizations;
  }

  // Generate compression-optimized service worker
  generateServiceWorkerConfig() {
    return {
      cacheStrategies: {
        css: 'CacheFirst',
        js: 'StaleWhileRevalidate',
        images: 'CacheFirst',
        html: 'NetworkFirst'
      },
      compressionSettings: {
        gzip: true,
        brotli: true,
        level: 9
      },
      bundleConfig: Array.from(this.bundleMap.entries())
    };
  }
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
  window.CompressionOptimizer = CompressionOptimizer;
  
  // Initialize after other systems
  window.addEventListener('load', () => {
    window.compressionOptimizer = new CompressionOptimizer();
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompressionOptimizer;
}