/**
 * Footer Enhancements
 * Handles footer interactions, animations, and dynamic content
 */

class FooterEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.createBackToTopButton();
    this.addFloatingIcons();
    this.setupDynamicContent();
    this.setupScrollAnimations();
    this.setupFooterInteractions();
  }

  /**
   * Create and manage back to top button
   */
  createBackToTopButton() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Retour en haut de la page');
    backToTop.setAttribute('title', 'Retour en haut');
    
    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    let ticking = false;
    const updateBackToTop = () => {
      const scrollTop = window.pageYOffset;
      const shouldShow = scrollTop > 300;
      
      if (shouldShow) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
      
      ticking = false;
    };

    const requestBackToTopUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateBackToTop);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestBackToTopUpdate, { passive: true });

    // Handle click
    backToTop.addEventListener('click', () => {
      this.smoothScrollToTop();
    });

    // Handle keyboard
    backToTop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.smoothScrollToTop();
      }
    });
  }

  /**
   * Smooth scroll to top
   */
  smoothScrollToTop() {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 800;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - ease));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  /**
   * Add floating decorative icons
   */
  addFloatingIcons() {
    const footer = document.querySelector('.footer');
    if (!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const icons = ['🚀', '⚡', '🎯', '✨', '💡', '🔧'];
    
    icons.forEach((icon, index) => {
      const element = document.createElement('div');
      element.className = 'footer-floating-icon';
      element.textContent = icon;
      element.style.cssText = `
        animation-delay: ${index * 1.5}s;
      `;
      
      // Random positioning
      const positions = [
        { top: '15%', left: '8%' },
        { top: '25%', right: '12%' },
        { top: '45%', left: '15%' },
        { bottom: '35%', right: '8%' },
        { bottom: '20%', left: '10%' },
        { top: '60%', right: '20%' }
      ];
      
      if (positions[index]) {
        Object.assign(element.style, positions[index]);
      }
      
      footer.appendChild(element);
    });
  }

  /**
   * Setup dynamic content updates
   */
  setupDynamicContent() {
    this.updateLoadTime();
    this.updateLastModified();
    this.updateAppVersion();
    this.setupLiveStats();
  }

  /**
   * Update load time display
   */
  updateLoadTime() {
    const loadTimeElement = document.getElementById('load-time');
    if (loadTimeElement) {
      window.addEventListener('load', () => {
        const loadTime = Math.round(performance.now());
        loadTimeElement.textContent = loadTime;
        
        // Add performance indicator
        const performanceClass = loadTime < 1000 ? 'excellent' : 
                               loadTime < 2000 ? 'good' : 'needs-improvement';
        loadTimeElement.className = `performance-${performanceClass}`;
      });
    }
  }

  /**
   * Update last modified date
   */
  updateLastModified() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
      const lastModified = new Date(document.lastModified);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      lastUpdateElement.textContent = lastModified.toLocaleDateString('fr-FR', options);
    }
  }

  /**
   * Update app version
   */
  updateAppVersion() {
    const versionElement = document.getElementById('app-version');
    if (versionElement) {
      // Try to get version from manifest or package
      fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
          if (manifest.version) {
            versionElement.textContent = manifest.version;
          }
        })
        .catch(() => {
          // Fallback version
          versionElement.textContent = '1.0.0';
        });
    }
  }

  /**
   * Setup live statistics
   */
  setupLiveStats() {
    // Update visitor count (if available)
    this.updateVisitorCount();
    
    // Update tool usage stats
    this.updateToolStats();
    
    // Update performance metrics
    this.updatePerformanceMetrics();
  }

  /**
   * Update visitor count
   */
  updateVisitorCount() {
    // Get from localStorage or analytics
    const visits = parseInt(localStorage.getItem('site-visits') || '0') + 1;
    localStorage.setItem('site-visits', visits.toString());
    
    // Display if element exists
    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
      visitorElement.textContent = visits.toLocaleString('fr-FR');
    }
  }

  /**
   * Update tool statistics
   */
  updateToolStats() {
    if (window.ToolsSync) {
      const stats = window.ToolsSync.getUsageStats();
      
      const toolStatsElement = document.getElementById('tool-stats');
      if (toolStatsElement) {
        toolStatsElement.innerHTML = `
          <span>🛠️ ${stats.toolsCount} outils</span>
          <span>📊 ${stats.totalVisits} utilisations</span>
        `;
      }
    }
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const metrics = {
          loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
          firstPaint: 0
        };

        // Get paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (firstPaint) {
          metrics.firstPaint = Math.round(firstPaint.startTime);
        }

        // Update display
        const metricsElement = document.getElementById('performance-metrics');
        if (metricsElement) {
          metricsElement.innerHTML = `
            <div class="metric">⚡ ${metrics.loadTime}ms</div>
            <div class="metric">🎨 ${metrics.firstPaint}ms</div>
          `;
        }
      }
    }
  }

  /**
   * Setup scroll animations for footer elements
   */
  setupScrollAnimations() {
    const footerElements = document.querySelectorAll('.footer-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Stagger animation for child elements
          const links = entry.target.querySelectorAll('.footer-link');
          links.forEach((link, index) => {
            setTimeout(() => {
              link.style.opacity = '0';
              link.style.transform = 'translateY(20px)';
              link.style.transition = 'all 0.4s ease-out';
              
              requestAnimationFrame(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
              });
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    footerElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Setup footer interactions
   */
  setupFooterInteractions() {
    this.setupSocialLinks();
    this.setupToolLinks();
    this.setupNewsletterForm();
    this.setupFooterHover();
  }

  /**
   * Enhance social links
   */
  setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.footer-social .footer-link');
    
    socialLinks.forEach(link => {
      // Add click tracking
      link.addEventListener('click', (e) => {
        const linkText = link.textContent.trim();
        
        if (window.agileToolkitLogger) {
          window.agileToolkitLogger.logEvent('footer-social-click', {
            link: linkText,
            url: link.href
          });
        }
        
        // Add visual feedback
        this.createClickFeedback(link);
      });

      // Add hover effect
      link.addEventListener('mouseenter', () => {
        this.createHoverEffect(link);
      });
    });
  }

  /**
   * Enhance tool links
   */
  setupToolLinks() {
    const toolLinks = document.querySelectorAll('.footer-section:nth-child(3) .footer-link');
    
    toolLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const toolName = link.textContent.trim();
        
        if (window.agileToolkitLogger) {
          window.agileToolkitLogger.logEvent('footer-tool-click', {
            tool: toolName,
            url: link.href
          });
        }
      });
    });
  }

  /**
   * Setup newsletter form (if exists)
   */
  setupNewsletterForm() {
    const newsletterForm = document.querySelector('.footer-newsletter-form');
    if (!newsletterForm) return;

    const input = newsletterForm.querySelector('.footer-newsletter-input');
    const button = newsletterForm.querySelector('.footer-newsletter-button');

    if (input && button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        
        if (this.validateEmail(email)) {
          this.handleNewsletterSignup(email);
        } else {
          this.showValidationError(input);
        }
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          button.click();
        }
      });
    }
  }

  /**
   * Setup footer hover effects
   */
  setupFooterHover() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    // Add mouse move effect for background
    footer.addEventListener('mousemove', (e) => {
      const rect = footer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Update CSS custom properties for dynamic effects
      footer.style.setProperty('--mouse-x', `${x * 100}%`);
      footer.style.setProperty('--mouse-y', `${y * 100}%`);
    });
  }

  /**
   * Helper methods
   */
  createClickFeedback(element) {
    const feedback = document.createElement('div');
    feedback.className = 'click-feedback';
    feedback.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: clickFeedback 0.6s ease-out;
      pointer-events: none;
    `;

    // Add animation keyframes if not exists
    if (!document.querySelector('#click-feedback-styles')) {
      const style = document.createElement('style');
      style.id = 'click-feedback-styles';
      style.textContent = `
        @keyframes clickFeedback {
          to {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 600);
  }

  createHoverEffect(element) {
    // Add subtle glow effect
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 300);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleNewsletterSignup(email) {
    // Simulate newsletter signup
    console.log('Newsletter signup:', email);
    
    // Show success message
    this.showNotification('✅ Inscription réussie !', 'success');
    
    // Clear input
    const input = document.querySelector('.footer-newsletter-input');
    if (input) {
      input.value = '';
    }
  }

  showValidationError(input) {
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
    
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 3000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `footer-notification footer-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideDown 0.3s ease-out forwards';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Cleanup method
   */
  cleanup() {
    // Remove event listeners and elements if needed
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.remove();
    }

    const floatingIcons = document.querySelectorAll('.footer-floating-icon');
    floatingIcons.forEach(icon => icon.remove());
  }
}

// Initialize footer enhancements
document.addEventListener('DOMContentLoaded', () => {
  new FooterEnhancements();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FooterEnhancements;
}