/**
 * Hero & Features Enhanced Interactions
 * Handles animations, scroll effects, and interactive elements
 */

class HeroFeaturesManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupHeroInteractions();
    this.setupFeatureCardAnimations();
    this.setupBadgeTooltips();
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animate;
          const delay = element.dataset.animateDelay || 0;

          setTimeout(() => {
            element.classList.add('animate-in');
            
            // Trigger specific animations
            switch (animationType) {
              case 'fadeIn':
                this.animateFadeIn(element);
                break;
              case 'fadeInUp':
                this.animateFadeInUp(element);
                break;
              case 'scaleIn':
                this.animateScaleIn(element);
                break;
            }
          }, parseInt(delay));

          // Stop observing once animated
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all elements with animation attributes
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(el => {
      el.dataset.animate = 'fadeInUp';
      observer.observe(el);
    });
  }

  /**
   * Setup parallax effects for hero section
   */
  setupParallaxEffects() {
    const heroSection = document.querySelector('.hero-section');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (!heroSection || !heroVisual) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Apply parallax to hero background
      heroSection.style.transform = `translateY(${rate}px)`;
      
      // Apply subtle parallax to hero visual
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * -0.2}px)`;
      }
      
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Only apply parallax on larger screens and if motion is not reduced
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }
  }

  /**
   * Setup hero section interactions
   */
  setupHeroInteractions() {
    // Animate hero elements on load
    setTimeout(() => {
      this.animateHeroElements();
    }, 100);

    // Setup hero action buttons
    this.setupHeroButtons();

    // Setup hero screenshot hover effect
    this.setupHeroScreenshot();
  }

  /**
   * Animate hero elements in sequence
   */
  animateHeroElements() {
    const badges = document.querySelectorAll('.hero-badges .badge');
    const title = document.querySelector('.hero-title');
    const description = document.querySelector('.hero-description');
    const actions = document.querySelector('.hero-actions');

    // Animate badges with stagger
    badges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.style.transition = 'all 0.6s ease-out';
        
        requestAnimationFrame(() => {
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';
        });
      }, index * 100);
    });

    // Animate title
    if (title) {
      setTimeout(() => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.8s ease-out';
        
        requestAnimationFrame(() => {
          title.style.opacity = '1';
          title.style.transform = 'translateY(0)';
        });
      }, 500);
    }

    // Animate description
    if (description) {
      setTimeout(() => {
        description.style.opacity = '0';
        description.style.transform = 'translateY(20px)';
        description.style.transition = 'all 0.6s ease-out';
        
        requestAnimationFrame(() => {
          description.style.opacity = '1';
          description.style.transform = 'translateY(0)';
        });
      }, 700);
    }

    // Animate actions
    if (actions) {
      setTimeout(() => {
        actions.style.opacity = '0';
        actions.style.transform = 'translateY(20px)';
        actions.style.transition = 'all 0.6s ease-out';
        
        requestAnimationFrame(() => {
          actions.style.opacity = '1';
          actions.style.transform = 'translateY(0)';
        });
      }, 900);
    }
  }

  /**
   * Setup hero buttons with enhanced interactions
   */
  setupHeroButtons() {
    const buttons = document.querySelectorAll('.hero-actions .btn');
    
    buttons.forEach(button => {
      // Add ripple effect
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });

      // Add magnetic effect on hover
      button.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
          this.createMagneticEffect(e, button);
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  /**
   * Setup hero screenshot interactions
   */
  setupHeroScreenshot() {
    const screenshot = document.querySelector('.hero-screenshot');
    
    if (!screenshot) return;

    // Add mouse move effect
    screenshot.addEventListener('mousemove', (e) => {
      if (window.innerWidth > 768) {
        const rect = screenshot.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        screenshot.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }
    });

    screenshot.addEventListener('mouseleave', () => {
      screenshot.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
    });
  }

  /**
   * Setup feature card animations
   */
  setupFeatureCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      // Add hover sound effect (visual feedback)
      card.addEventListener('mouseenter', () => {
        this.animateFeatureIcon(card);
      });

      // Add click interaction for mobile
      card.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          card.classList.toggle('mobile-expanded');
        }
      });

      // Setup feature list item animations
      const listItems = card.querySelectorAll('.feature-list li');
      listItems.forEach((item, itemIndex) => {
        item.addEventListener('mouseenter', () => {
          this.animateListItem(item);
        });
      });
    });
  }

  /**
   * Setup badge tooltips
   */
  setupBadgeTooltips() {
    const badges = document.querySelectorAll('.badge[data-tooltip]');
    
    badges.forEach(badge => {
      let tooltip = null;
      
      badge.addEventListener('mouseenter', (e) => {
        tooltip = this.createTooltip(e.target, badge.dataset.tooltip);
      });
      
      badge.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });
    });
  }

  /**
   * Animation helper methods
   */
  animateFadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.6s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  animateFadeInUp(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  animateScaleIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = 'all 0.6s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  animateFeatureIcon(card) {
    const icon = card.querySelector('.feature-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.transition = 'transform 0.3s ease-out';
      
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }
  }

  animateListItem(item) {
    const originalPadding = item.style.paddingLeft;
    item.style.paddingLeft = '3rem';
    item.style.transition = 'padding-left 0.2s ease-out';
    
    setTimeout(() => {
      item.style.paddingLeft = originalPadding;
    }, 200);
  }

  /**
   * Create ripple effect on button click
   */
  createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Create magnetic effect on button hover
   */
  createMagneticEffect(event, button) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    
    const moveX = x * 0.1;
    const moveY = y * 0.1;
    
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    button.style.transition = 'transform 0.1s ease-out';
  }

  /**
   * Create tooltip element
   */
  createTooltip(target, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'hero-tooltip';
    tooltip.textContent = text;
    
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease-out;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = `${targetRect.left + targetRect.width / 2 - tooltipRect.width / 2}px`;
    tooltip.style.top = `${targetRect.bottom + 10}px`;
    
    // Animate in
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
    
    return tooltip;
  }

  /**
   * Setup responsive behavior
   */
  setupResponsiveBehavior() {
    const handleResize = () => {
      // Disable animations on small screens
      if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
      } else {
        document.body.classList.remove('mobile-view');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor animation performance
    let animationFrameId;
    let lastTime = 0;
    let frameCount = 0;
    
    const monitorFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Reduce animations if FPS is too low
        if (fps < 30) {
          document.body.classList.add('reduced-animations');
        } else {
          document.body.classList.remove('reduced-animations');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(monitorFPS);
    };
    
    // Start monitoring only if not in reduced motion mode
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animationFrameId = requestAnimationFrame(monitorFPS);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HeroFeaturesManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroFeaturesManager;
}