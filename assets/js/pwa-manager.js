/**
 * PWA Manager
 * Handles PWA installation, updates, and offline functionality
 */

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.swRegistration = null;
    this.updateAvailable = false;
    
    this.init();
  }

  async init() {
    this.checkInstallation();
    this.setupEventListeners();
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdateNotifications();
    this.setupOfflineIndicator();
  }

  /**
   * Check if app is already installed
   */
  checkInstallation() {
    // Check if running in standalone mode
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true ||
                      document.referrer.includes('android-app://');
    
    console.log('📱 PWA Installation status:', this.isInstalled ? 'Installed' : 'Not installed');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('📱 Install prompt available');
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.trackInstallation();
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateConnectionStatus();
      this.syncWhenOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateConnectionStatus();
    });

    // Listen for visibility change (app focus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  /**
   * Register service worker
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('✅ Service Worker registered:', this.swRegistration.scope);

        // Listen for updates
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available');
              this.updateAvailable = true;
              this.showUpdateNotification();
            }
          });
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.warn('⚠️ Service Workers not supported');
    }
  }

  /**
   * Setup install prompt UI
   */
  setupInstallPrompt() {
    // Find or create install button
    let installButton = document.querySelector('.install-pwa-btn');
    
    if (!installButton) {
      // Create install button if it doesn't exist
      installButton = document.createElement('button');
      installButton.className = 'btn btn-primary install-pwa-btn';
      installButton.innerHTML = '📱 Installer l\'application';
      installButton.style.display = 'none';
      
      // Add to hero section
      const heroActions = document.querySelector('.hero-actions');
      if (heroActions) {
        heroActions.appendChild(installButton);
      }
    }

    installButton.addEventListener('click', () => {
      this.promptInstall();
    });

    this.installButton = installButton;
  }

  /**
   * Show install button
   */
  showInstallButton() {
    if (this.installButton && !this.isInstalled) {
      this.installButton.style.display = 'inline-flex';
      
      // Add install banner
      this.showInstallBanner();
    }
  }

  /**
   * Hide install button
   */
  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
    
    this.hideInstallBanner();
  }

  /**
   * Show install banner
   */
  showInstallBanner() {
    // Don't show if already dismissed
    if (localStorage.getItem('install-banner-dismissed') === 'true') {
      return;
    }

    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <div class="install-banner-icon">📱</div>
        <div class="install-banner-text">
          <strong>Installer l'application</strong>
          <p>Accédez rapidement à vos outils agiles depuis votre écran d'accueil</p>
        </div>
        <div class="install-banner-actions">
          <button class="btn btn-primary btn-small" onclick="window.pwaManager.promptInstall()">
            Installer
          </button>
          <button class="btn btn-secondary btn-small" onclick="window.pwaManager.dismissInstallBanner()">
            Plus tard
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .install-banner {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
      }
      
      .install-banner-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 1rem;
      }
      
      .install-banner-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      
      .install-banner-text {
        flex: 1;
      }
      
      .install-banner-text strong {
        display: block;
        margin-bottom: 0.25rem;
        color: #1f2937;
      }
      
      .install-banner-text p {
        margin: 0;
        font-size: 0.875rem;
        color: #6b7280;
      }
      
      .install-banner-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .install-banner {
          left: 10px;
          right: 10px;
        }
        
        .install-banner-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);
    
    this.installBanner = banner;
  }

  /**
   * Dismiss install banner
   */
  dismissInstallBanner() {
    if (this.installBanner) {
      this.installBanner.remove();
      localStorage.setItem('install-banner-dismissed', 'true');
    }
  }

  /**
   * Hide install banner
   */
  hideInstallBanner() {
    if (this.installBanner) {
      this.installBanner.remove();
    }
  }

  /**
   * Prompt for installation
   */
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.warn('⚠️ Install prompt not available');
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('📱 Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        this.trackInstallation();
      }
      
      // Clear the deferred prompt
      this.deferredPrompt = null;
      this.hideInstallButton();
      
    } catch (error) {
      console.error('❌ Install prompt failed:', error);
    }
  }

  /**
   * Setup update notifications
   */
  setupUpdateNotifications() {
    // Check for updates periodically
    setInterval(() => {
      this.checkForUpdates();
    }, 60000); // Check every minute
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates() {
    if (this.swRegistration) {
      try {
        await this.swRegistration.update();
      } catch (error) {
        console.error('❌ Update check failed:', error);
      }
    }
  }

  /**
   * Show update notification
   */
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-notification-content">
        <div class="update-notification-icon">🔄</div>
        <div class="update-notification-text">
          <strong>Mise à jour disponible</strong>
          <p>Une nouvelle version de l'application est prête</p>
        </div>
        <div class="update-notification-actions">
          <button class="btn btn-primary btn-small" onclick="window.pwaManager.applyUpdate()">
            Mettre à jour
          </button>
          <button class="btn btn-secondary btn-small" onclick="this.parentElement.parentElement.parentElement.remove()">
            Plus tard
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .update-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
        z-index: 1001;
        animation: slideDown 0.3s ease-out;
        max-width: 400px;
      }
      
      .update-notification-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 1rem;
      }
      
      .update-notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      
      .update-notification-text {
        flex: 1;
      }
      
      .update-notification-text strong {
        display: block;
        margin-bottom: 0.25rem;
      }
      
      .update-notification-text p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }
      
      .update-notification-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      
      .update-notification .btn {
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
      }
      
      .update-notification .btn-primary {
        background: white;
        color: #3b82f6;
      }
      
      .update-notification .btn-secondary {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
      }
      
      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .update-notification {
          left: 10px;
          right: 10px;
          top: 10px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  /**
   * Apply service worker update
   */
  async applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      // Tell the waiting service worker to skip waiting
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  }

  /**
   * Setup offline indicator
   */
  setupOfflineIndicator() {
    this.updateConnectionStatus();
  }

  /**
   * Update connection status indicator
   */
  updateConnectionStatus() {
    let indicator = document.querySelector('.connection-status');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'connection-status';
      document.body.appendChild(indicator);
    }

    if (this.isOnline) {
      indicator.className = 'connection-status online';
      indicator.innerHTML = '🟢 En ligne';
      
      // Hide after 3 seconds
      setTimeout(() => {
        if (indicator.classList.contains('online')) {
          indicator.style.display = 'none';
        }
      }, 3000);
    } else {
      indicator.className = 'connection-status offline';
      indicator.innerHTML = '🔴 Hors ligne';
      indicator.style.display = 'block';
    }
  }

  /**
   * Sync data when coming back online
   */
  async syncWhenOnline() {
    console.log('🔄 Back online, syncing data...');
    
    // Trigger background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-logs');
        await registration.sync.register('sync-usage');
        console.log('✅ Background sync registered');
      } catch (error) {
        console.error('❌ Background sync failed:', error);
      }
    }

    // Manual sync fallback
    if (window.LoggingIntegration) {
      window.LoggingIntegration.flushLogs();
    }
  }

  /**
   * Handle messages from service worker
   */
  handleServiceWorkerMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        console.log('📦 Cache updated:', payload);
        break;
        
      case 'OFFLINE_READY':
        console.log('📱 App ready for offline use');
        this.showOfflineReadyNotification();
        break;
        
      case 'ERROR':
        console.error('❌ Service Worker error:', payload);
        break;
    }
  }

  /**
   * Show offline ready notification
   */
  showOfflineReadyNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-ready-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">📱</span>
        <span class="notification-text">Application prête pour une utilisation hors ligne</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .offline-ready-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * Track installation for analytics
   */
  trackInstallation() {
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logEvent('pwa-installed', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });
    }

    // Store installation date
    localStorage.setItem('pwa-installed-date', new Date().toISOString());
  }

  /**
   * Get PWA status information
   */
  getStatus() {
    return {
      isInstalled: this.isInstalled,
      isOnline: this.isOnline,
      hasServiceWorker: !!this.swRegistration,
      updateAvailable: this.updateAvailable,
      canInstall: !!this.deferredPrompt
    };
  }

  /**
   * Force cache refresh
   */
  async refreshCache() {
    if (this.swRegistration) {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        this.swRegistration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
    }
  }

  /**
   * Preload specific URLs
   */
  async preloadUrls(urls) {
    if (this.swRegistration) {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        this.swRegistration.active.postMessage(
          { type: 'CACHE_URLS', data: { urls } },
          [messageChannel.port2]
        );
      });
    }
  }
}

// Initialize PWA Manager
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAManager;
}