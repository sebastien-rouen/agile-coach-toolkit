/**
 * Installation, Documentation & PWA Enhancements
 * Handles interactions, animations, and dynamic content for these sections
 */

class InstallationDocsEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupCodeBlocks();
    this.setupInstallationCards();
    this.setupDocumentationCards();
    this.setupPWAPrompt();
    this.setupScrollAnimations();
    this.setupPerformanceMetrics();
  }

  /**
   * Setup code blocks with copy functionality
   */
  setupCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
      this.addCopyButton(block);
      this.addSyntaxHighlighting(block);
    });
  }

  /**
   * Add copy button to code blocks
   */
  addCopyButton(codeBlock) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '📋 Copier';
    copyBtn.setAttribute('aria-label', 'Copier le code');
    
    copyBtn.addEventListener('click', async () => {
      const code = codeBlock.querySelector('code');
      if (code) {
        try {
          await navigator.clipboard.writeText(code.textContent);
          this.showCopyFeedback(copyBtn, true);
        } catch (err) {
          // Fallback for older browsers
          this.fallbackCopyText(code.textContent);
          this.showCopyFeedback(copyBtn, true);
        }
      }
    });
    
    codeBlock.appendChild(copyBtn);
  }

  /**
   * Show copy feedback
   */
  showCopyFeedback(button, success) {
    const originalText = button.innerHTML;
    button.innerHTML = success ? '✅ Copié!' : '❌ Erreur';
    button.style.background = success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 2000);
  }

  /**
   * Fallback copy method
   */
  fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Add basic syntax highlighting
   */
  addSyntaxHighlighting(codeBlock) {
    const code = codeBlock.querySelector('code');
    if (!code) return;

    let content = code.innerHTML;
    
    // Highlight comments
    content = content.replace(/(#.*$)/gm, '<span style="color: #6b7280; font-style: italic;">$1</span>');
    
    // Highlight commands
    content = content.replace(/^(git|docker|python|php|cd|npm|yarn)\s/gm, '<span style="color: #10b981; font-weight: bold;">$1</span> ');
    
    // Highlight URLs
    content = content.replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #3b82f6;">$1</span>');
    
    // Highlight flags
    content = content.replace(/(\s-[a-zA-Z]+)/g, '<span style="color: #f59e0b;">$1</span>');
    
    code.innerHTML = content;
  }

  /**
   * Setup installation cards interactions
   */
  setupInstallationCards() {
    const installationCards = document.querySelectorAll('.installation-card');
    
    installationCards.forEach((card, index) => {
      // Add hover sound effect (visual feedback)
      card.addEventListener('mouseenter', () => {
        this.animateInstallationIcon(card);
      });

      // Add click tracking
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.trackInstallationMethod(index);
        }
      });

      // Setup PWA install button
      const installBtn = card.querySelector('.install-pwa-btn');
      if (installBtn) {
        this.setupPWAInstallButton(installBtn);
      }
    });
  }

  /**
   * Animate installation icon
   */
  animateInstallationIcon(card) {
    const icon = card.querySelector('.installation-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.transition = 'transform 0.3s ease-out';
      
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }
  }

  /**
   * Track installation method selection
   */
  trackInstallationMethod(method) {
    const methods = ['PWA', 'Web', 'Docker'];
    
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logEvent('installation-method-viewed', {
        method: methods[method] || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Setup PWA install button
   */
  setupPWAInstallButton(button) {
    // Show button if PWA can be installed
    if (window.pwaManager && window.pwaManager.deferredPrompt) {
      button.style.display = 'inline-flex';
    }

    button.addEventListener('click', () => {
      if (window.pwaManager) {
        window.pwaManager.promptInstall();
      }
    });

    // Listen for PWA events
    window.addEventListener('beforeinstallprompt', () => {
      button.style.display = 'inline-flex';
    });

    window.addEventListener('appinstalled', () => {
      button.style.display = 'none';
    });
  }

  /**
   * Setup documentation cards
   */
  setupDocumentationCards() {
    const docCards = document.querySelectorAll('.doc-card');
    
    docCards.forEach((card, index) => {
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.animateDocIcon(card);
      });

      // Track documentation section views
      card.addEventListener('click', () => {
        this.trackDocumentationView(index);
      });

      // Setup doc links
      const links = card.querySelectorAll('.doc-links a');
      links.forEach(link => {
        this.setupDocLink(link);
      });
    });
  }

  /**
   * Animate documentation icon
   */
  animateDocIcon(card) {
    const icon = card.querySelector('.doc-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(-5deg)';
      icon.style.transition = 'transform 0.3s ease-out';
      
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }
  }

  /**
   * Track documentation view
   */
  trackDocumentationView(section) {
    const sections = ['getting-started', 'architecture', 'contribution', 'performance'];
    
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logEvent('documentation-section-viewed', {
        section: sections[section] || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Setup documentation links
   */
  setupDocLink(link) {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Handle placeholder links
      if (href === '#' || link.onclick) {
        e.preventDefault();
        this.showComingSoonNotification(link.textContent);
      }
      
      // Track link clicks
      if (window.agileToolkitLogger) {
        window.agileToolkitLogger.logEvent('documentation-link-clicked', {
          link: link.textContent,
          href: href
        });
      }
    });
  }

  /**
   * Show coming soon notification
   */
  showComingSoonNotification(linkText) {
    const notification = document.createElement('div');
    notification.className = 'coming-soon-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">🚧</span>
        <span class="notification-text">"${linkText}" arrive bientôt !</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-warning-500);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
    `;

    // Add animation keyframes
    if (!document.querySelector('#coming-soon-styles')) {
      const style = document.createElement('style');
      style.id = 'coming-soon-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
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
    }

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 4000);
  }

  /**
   * Setup PWA install prompt
   */
  setupPWAPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (!prompt) return;

    const acceptBtn = document.getElementById('pwa-install-accept');
    const dismissBtn = document.getElementById('pwa-install-dismiss');

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'pwa-install-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Fermer');
    prompt.appendChild(closeBtn);

    // Setup event listeners
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        this.handlePWAInstall();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        this.dismissPWAPrompt();
      });
    }

    closeBtn.addEventListener('click', () => {
      this.dismissPWAPrompt();
    });

    // Show prompt when appropriate
    this.checkPWAPromptConditions();
  }

  /**
   * Check conditions to show PWA prompt
   */
  checkPWAPromptConditions() {
    // Don't show if already dismissed recently
    const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Show after user has been on site for a while
    setTimeout(() => {
      if (window.pwaManager && window.pwaManager.deferredPrompt) {
        this.showPWAPrompt();
      }
    }, 30000); // 30 seconds
  }

  /**
   * Show PWA prompt
   */
  showPWAPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.setAttribute('aria-hidden', 'false');
      
      // Track prompt shown
      if (window.agileToolkitLogger) {
        window.agileToolkitLogger.logEvent('pwa-prompt-shown', {
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Handle PWA install
   */
  handlePWAInstall() {
    if (window.pwaManager) {
      window.pwaManager.promptInstall();
    }
    
    this.hidePWAPrompt();
    
    // Track install attempt
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logEvent('pwa-install-attempted', {
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Dismiss PWA prompt
   */
  dismissPWAPrompt() {
    this.hidePWAPrompt();
    
    // Remember dismissal
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    
    // Track dismissal
    if (window.agileToolkitLogger) {
      window.agileToolkitLogger.logEvent('pwa-prompt-dismissed', {
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Hide PWA prompt
   */
  hidePWAPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Setup scroll animations
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Stagger animations for child elements
          const cards = entry.target.querySelectorAll('.installation-card, .doc-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '0';
              card.style.transform = 'translateY(30px)';
              card.style.transition = 'all 0.6s ease-out';
              
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.installation, .documentation');
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Setup performance metrics
   */
  setupPerformanceMetrics() {
    const metrics = document.querySelectorAll('.metric');
    
    metrics.forEach(metric => {
      // Add click interaction
      metric.addEventListener('click', () => {
        this.showMetricDetails(metric);
      });

      // Add hover effect
      metric.addEventListener('mouseenter', () => {
        this.animateMetric(metric);
      });
    });

    // Update metrics with real data
    this.updatePerformanceMetrics();
  }

  /**
   * Animate metric on hover
   */
  animateMetric(metric) {
    const value = metric.querySelector('.metric-value');
    if (value) {
      const originalValue = value.textContent;
      const numericValue = parseInt(originalValue);
      
      if (!isNaN(numericValue)) {
        // Animate counter
        let current = 0;
        const increment = numericValue / 20;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          value.textContent = Math.round(current) + (originalValue.includes('/') ? '/100' : '');
        }, 50);
      }
    }
  }

  /**
   * Show metric details
   */
  showMetricDetails(metric) {
    const label = metric.querySelector('.metric-label').textContent;
    const value = metric.querySelector('.metric-value').textContent;
    
    const details = {
      'Performance': 'Temps de chargement optimisé avec lazy loading et compression',
      'Accessibilité': 'Conforme WCAG 2.1 AA avec navigation clavier et lecteurs d\'écran',
      'SEO': 'Optimisé pour les moteurs de recherche avec métadonnées complètes'
    };
    
    const detail = details[label] || 'Métrique de qualité du site web';
    
    // Show tooltip or modal with details
    this.showMetricTooltip(metric, `${label}: ${value}`, detail);
  }

  /**
   * Show metric tooltip
   */
  showMetricTooltip(element, title, description) {
    const tooltip = document.createElement('div');
    tooltip.className = 'metric-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">${title}</div>
      <div class="tooltip-description">${description}</div>
    `;
    
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-secondary-900);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      max-width: 250px;
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease-out;
      pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.transform = 'translateX(-50%) translateY(0)';
    
    // Animate in
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
    });
    
    // Remove after delay
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        tooltip.remove();
      }, 200);
    }, 3000);
  }

  /**
   * Update performance metrics with real data
   */
  updatePerformanceMetrics() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const loadTime = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
        
        // Update performance score based on load time
        const performanceMetric = document.querySelector('.metric-value');
        if (performanceMetric && loadTime > 0) {
          let score = 100;
          if (loadTime > 1000) score = Math.max(50, 100 - Math.floor(loadTime / 100));
          performanceMetric.textContent = `${score}/100`;
        }
      }
    }
  }
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
  new InstallationDocsEnhancements();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InstallationDocsEnhancements;
}