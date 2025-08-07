/**
 * Interactive Components Manager
 * Coordinates all interactive systems (modals, tooltips, loading, animations)
 */

class InteractiveComponents {
  constructor() {
    this.systems = {};
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;

    try {
      // Initialize all systems
      this.initializeSystems();
      
      // Setup global event handlers
      this.setupGlobalHandlers();
      
      // Enhance existing elements
      this.enhanceExistingElements();
      
      this.initialized = true;
      console.log('✅ Interactive components initialized');
    } catch (error) {
      console.error('❌ Error initializing interactive components:', error);
    }
  }

  initializeSystems() {
    // Initialize Modal System
    if (typeof ModalSystem !== 'undefined') {
      this.systems.modal = new ModalSystem();
    }

    // Initialize Tooltip System
    if (typeof TooltipSystem !== 'undefined') {
      this.systems.tooltip = new TooltipSystem();
    }

    // Initialize Loading System
    if (typeof LoadingSystem !== 'undefined') {
      this.systems.loading = new LoadingSystem();
    }

    // Initialize Animation System
    if (typeof AnimationSystem !== 'undefined') {
      this.systems.animation = new AnimationSystem();
    }
  }

  setupGlobalHandlers() {
    // Handle dynamic content loading
    document.addEventListener('DOMContentLoaded', () => {
      this.enhanceExistingElements();
    });

    // Handle tool info buttons (enhance existing functionality)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tool-info-btn')) {
        this.handleToolInfoClick(e);
      }
    });

    // Handle demo buttons with loading states
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn') && e.target.href) {
        this.handleDemoButtonClick(e);
      }
    });

    // Handle form submissions with loading states
    document.addEventListener('submit', (e) => {
      this.handleFormSubmit(e);
    });

    // Handle PWA install with enhanced modal
    const pwaInstallBtn = document.querySelector('.install-pwa-btn');
    if (pwaInstallBtn) {
      pwaInstallBtn.addEventListener('click', (e) => {
        this.handlePWAInstall(e);
      });
    }
  }

  enhanceExistingElements() {
    // Add tooltips to elements that need them
    this.addTooltipsToElements();
    
    // Add animations to elements
    this.addAnimationsToElements();
    
    // Enhance buttons with loading capabilities
    this.enhanceButtons();
    
    // Add hover effects
    this.addHoverEffects();
  }

  addTooltipsToElements() {
    if (!this.systems.tooltip) return;

    // Add tooltips to status badges
    document.querySelectorAll('.tool-status').forEach((badge) => {
      const status = badge.textContent.trim();
      let tooltipText = '';
      
      if (status.includes('Stable')) {
        tooltipText = 'Outil testé et prêt pour la production';
      } else if (status.includes('Bêta')) {
        tooltipText = 'Outil en phase de test, fonctionnalités principales disponibles';
      } else if (status.includes('Alpha')) {
        tooltipText = 'Outil en développement, fonctionnalités limitées';
      }
      
      if (tooltipText) {
        this.systems.tooltip.addTooltip(badge, tooltipText, {
          position: 'top',
          theme: 'default'
        });
      }
    });

    // Add tooltips to badges
    document.querySelectorAll('.badge').forEach((badge) => {
      const text = badge.textContent.trim();
      let tooltipText = '';
      
      if (text.includes('PWA Ready')) {
        tooltipText = 'Application web progressive installable';
      } else if (text.includes('WCAG 2.1 AA')) {
        tooltipText = 'Conforme aux standards d\'accessibilité';
      } else if (text.includes('MIT License')) {
        tooltipText = 'Licence open source permissive';
      }
      
      if (tooltipText) {
        this.systems.tooltip.addTooltip(badge, tooltipText, {
          position: 'bottom',
          theme: 'light'
        });
      }
    });

    // Add tooltips to navigation links
    document.querySelectorAll('.navbar-link, .navbar-mobile-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTitle = section.querySelector('h2, h3');
          if (sectionTitle) {
            this.systems.tooltip.addTooltip(link, `Aller à la section ${sectionTitle.textContent}`, {
              position: 'bottom',
              delay: 1000
            });
          }
        }
      }
    });

    // Add tooltips to theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      const updateThemeTooltip = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const tooltipText = currentTheme === 'dark' 
          ? 'Activer le mode clair' 
          : 'Activer le mode sombre';
        
        this.systems.tooltip.removeTooltip(themeToggle);
        this.systems.tooltip.addTooltip(themeToggle, tooltipText, {
          position: 'bottom'
        });
      };
      
      updateThemeTooltip();
      
      // Update tooltip when theme changes
      document.addEventListener('themeChanged', updateThemeTooltip);
    }
  }

  addAnimationsToElements() {
    if (!this.systems.animation) return;

    // Add fade-in animations to cards
    document.querySelectorAll('.tool-card, .feature-card, .doc-card').forEach((card, index) => {
      this.systems.animation.addAnimation(card, 'fadeInUp', {
        trigger: 'scroll',
        delay: index * 100,
        duration: 600
      });
    });

    // Add fade-in animations to sections
    document.querySelectorAll('section').forEach((section, index) => {
      const header = section.querySelector('.section-header');
      if (header) {
        this.systems.animation.addAnimation(header, 'fadeInUp', {
          trigger: 'scroll',
          delay: 0,
          duration: 800
        });
      }
    });

    // Add animations to badges
    document.querySelectorAll('.badge').forEach((badge, index) => {
      this.systems.animation.addAnimation(badge, 'fadeIn', {
        trigger: 'load',
        delay: index * 100,
        duration: 400
      });
    });

    // Add hover animations to buttons
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.classList.add('hover-lift');
    });
  }

  enhanceButtons() {
    // Add loading capability to all buttons
    document.querySelectorAll('.btn').forEach((btn) => {
      // Skip if already enhanced
      if (btn.hasAttribute('data-enhanced')) return;
      
      btn.setAttribute('data-enhanced', 'true');
      
      // Add hover effects
      btn.addEventListener('mouseenter', () => {
        if (this.systems.animation && !btn.disabled) {
          this.systems.animation.pulse(btn, { scale: 1.02, duration: 200 });
        }
      });
    });
  }

  addHoverEffects() {
    // Add hover effects to cards
    document.querySelectorAll('.tool-card, .feature-card, .doc-card').forEach((card) => {
      card.classList.add('hover-lift');
    });

    // Add hover effects to links
    document.querySelectorAll('.footer-link').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        if (this.systems.animation) {
          this.systems.animation.pulse(link, { scale: 1.05, duration: 300 });
        }
      });
    });
  }

  handleToolInfoClick(e) {
    e.preventDefault();
    
    if (!this.systems.modal || !this.systems.loading) return;
    
    const button = e.target;
    const toolCard = button.closest('.tool-card');
    const toolId = toolCard?.dataset.toolId;
    
    if (!toolId) return;
    
    // Show loading state
    this.systems.loading.buttonLoading(button, {
      text: 'Chargement...',
      spinner: true
    });
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      this.systems.loading.buttonDone(button);
      
      // Find tool data
      const tool = window.TOOLS_DATA?.find(t => t.id === toolId);
      if (!tool) return;
      
      // Create enhanced modal
      const modal = this.createEnhancedToolModal(tool);
      this.systems.modal.show(modal);
    }, 500);
  }

  createEnhancedToolModal(tool) {
    const statusInfo = window.TOOL_STATUS?.[tool.status] || { label: tool.status, description: '' };
    const categoryInfo = window.TOOL_CATEGORIES?.[tool.category] || { label: tool.category, icon: '' };
    
    return this.systems.modal.createModal({
      title: `${tool.icon} ${tool.name}`,
      size: 'large',
      content: `
        <div class="tool-modal-content">
          <div class="tool-modal-meta">
            <span class="tool-status tool-status-${tool.status}" 
                  data-tooltip="${statusInfo.description}">
              ${statusInfo.label}
            </span>
            <span class="tool-category" 
                  data-tooltip="Catégorie: ${categoryInfo.label}">
              ${categoryInfo.icon} ${categoryInfo.label}
            </span>
            <span class="tool-version" 
                  data-tooltip="Version actuelle">
              v${tool.version}
            </span>
          </div>
          
          <div class="tool-description">
            <p>${tool.longDescription}</p>
          </div>
          
          <div class="tool-features-section">
            <h4>✨ Fonctionnalités principales</h4>
            <ul class="tool-features-list">
              ${tool.features.map(feature => `<li data-animate="fadeInLeft" data-animate-trigger="load">${feature}</li>`).join('')}
            </ul>
          </div>
          
          <div class="tool-tags-section">
            <h4>🏷️ Tags</h4>
            <div class="tool-tags-list">
              ${tool.tags.map((tag, index) => `
                <span class="tool-tag" 
                      data-animate="fadeIn" 
                      data-animate-trigger="load" 
                      data-animate-delay="${index * 50}">
                  ${this.formatTag(tag)}
                </span>
              `).join('')}
            </div>
          </div>
          
          <div class="tool-requirements-section">
            <h4>📋 Prérequis</h4>
            <ul class="tool-requirements-list">
              ${tool.requirements.map(req => `<li data-animate="fadeInRight" data-animate-trigger="load">${req}</li>`).join('')}
            </ul>
          </div>
          
          <div class="tool-meta-section">
            <div class="tool-meta-grid">
              <div class="tool-meta-item">
                <strong>Dernière mise à jour:</strong>
                <time datetime="${tool.lastUpdated.toISOString()}">
                  ${tool.lastUpdated.toLocaleDateString('fr-FR')}
                </time>
              </div>
            </div>
          </div>
          
          <div class="tool-actions-section">
            ${tool.demoUrl && tool.status === 'stable' ? `
              <a href="${tool.demoUrl}" 
                 class="btn btn-primary btn-lg" 
                 target="_blank"
                 rel="noopener"
                 data-tooltip="Ouvrir l'outil dans un nouvel onglet">
                🚀 Lancer l'outil
              </a>
            ` : `
              <button class="btn btn-secondary btn-lg" disabled
                      data-tooltip="Outil non encore disponible">
                ${tool.status === 'beta' ? '🚧 Bientôt disponible' : '⚠️ En développement'}
              </button>
            `}
          </div>
        </div>
      `,
      onShow: (modal) => {
        // Initialize tooltips in modal
        if (this.systems.tooltip) {
          modal.querySelectorAll('[data-tooltip]').forEach((element) => {
            const tooltip = element.getAttribute('data-tooltip');
            this.systems.tooltip.addTooltip(element, tooltip);
          });
        }
        
        // Initialize animations in modal
        if (this.systems.animation) {
          modal.querySelectorAll('[data-animate]').forEach((element) => {
            const animationType = element.getAttribute('data-animate');
            const trigger = element.getAttribute('data-animate-trigger') || 'load';
            const delay = parseInt(element.getAttribute('data-animate-delay')) || 0;
            
            this.systems.animation.addAnimation(element, animationType, {
              trigger,
              delay,
              duration: 400
            });
          });
        }
      }
    });
  }

  handleDemoButtonClick(e) {
    if (!this.systems.loading) return;
    
    const button = e.target;
    
    // Add loading state for external links
    if (button.target === '_blank') {
      this.systems.loading.buttonLoading(button, {
        text: 'Ouverture...',
        spinner: true
      });
      
      // Remove loading state after a short delay
      setTimeout(() => {
        this.systems.loading.buttonDone(button);
      }, 1000);
    }
  }

  handleFormSubmit(e) {
    if (!this.systems.loading) return;
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (submitButton) {
      this.systems.loading.buttonLoading(submitButton, {
        text: 'Envoi...',
        spinner: true
      });
      
      // Note: In a real application, you would remove the loading state
      // when the form submission completes (success or error)
    }
  }

  handlePWAInstall(e) {
    if (!this.systems.modal) return;
    
    e.preventDefault();
    
    const modal = this.systems.modal.createModal({
      title: '📱 Installer l\'application',
      size: 'medium',
      content: `
        <div class="pwa-install-content">
          <div class="pwa-install-icon">📱</div>
          <h3>Installer Agile Coach Toolkit</h3>
          <p>Installez l'application sur votre appareil pour un accès rapide et une expérience optimisée.</p>
          
          <div class="pwa-benefits">
            <h4>Avantages de l'installation :</h4>
            <ul>
              <li>✅ Accès rapide depuis votre écran d'accueil</li>
              <li>✅ Fonctionne hors-ligne</li>
              <li>✅ Interface native et optimisée</li>
              <li>✅ Notifications de mise à jour</li>
            </ul>
          </div>
          
          <div class="pwa-actions">
            <button class="btn btn-primary pwa-install-confirm">
              📱 Installer maintenant
            </button>
            <button class="btn btn-secondary pwa-install-later">
              Plus tard
            </button>
          </div>
        </div>
      `,
      onShow: (modal) => {
        const installBtn = modal.querySelector('.pwa-install-confirm');
        const laterBtn = modal.querySelector('.pwa-install-later');
        
        installBtn.addEventListener('click', () => {
          // Trigger PWA install (this would be handled by the PWA manager)
          this.systems.modal.hide(modal);
          
          // Show success message
          setTimeout(() => {
            this.showNotification('Application installée avec succès !', 'success');
          }, 500);
        });
        
        laterBtn.addEventListener('click', () => {
          this.systems.modal.hide(modal);
        });
      }
    });
    
    this.systems.modal.show(modal);
  }

  formatTag(tag) {
    return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  showNotification(message, type = 'info') {
    if (!this.systems.modal) return;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    const modal = this.systems.modal.createModal({
      title: `${icons[type]} Notification`,
      size: 'small',
      content: `<p class="notification-message">${message}</p>`,
      className: `notification-modal notification-${type}`
    });
    
    this.systems.modal.show(modal);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      this.systems.modal.hide(modal);
    }, 3000);
  }

  // Public API
  getSystem(name) {
    return this.systems[name];
  }

  showModal(options) {
    return this.systems.modal?.show(options);
  }

  hideModal() {
    this.systems.modal?.hide();
  }

  showLoading(options) {
    this.systems.loading?.show(options);
  }

  hideLoading() {
    this.systems.loading?.hide();
  }

  addTooltip(element, content, options) {
    this.systems.tooltip?.addTooltip(element, content, options);
  }

  removeTooltip(element) {
    this.systems.tooltip?.removeTooltip(element);
  }

  animate(element, type, options) {
    return this.systems.animation?.animate(element, type, options);
  }

  // Cleanup
  destroy() {
    Object.values(this.systems).forEach(system => {
      if (system.destroy) {
        system.destroy();
      }
    });
    
    this.systems = {};
    this.initialized = false;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveComponents;
}

// Make available globally and auto-initialize
if (typeof window !== 'undefined') {
  window.InteractiveComponents = InteractiveComponents;
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.interactiveComponents = new InteractiveComponents();
    });
  } else {
    window.interactiveComponents = new InteractiveComponents();
  }
}