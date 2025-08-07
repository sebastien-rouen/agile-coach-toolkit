/**
 * Animation System Component
 * Provides smooth animations and transitions with accessibility support
 */

class AnimationSystem {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.animationQueue = [];
    this.runningAnimations = new Set();
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupReducedMotionListener();
    this.initializeAnimatedElements();
  }

  setupIntersectionObserver() {
    // Observer for scroll-triggered animations
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerScrollAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }

  setupReducedMotionListener() {
    this.prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        // User prefers reduced motion - disable animations
        this.disableAnimations();
      } else {
        // User allows motion - enable animations
        this.enableAnimations();
      }
    });
  }

  initializeAnimatedElements() {
    // Initialize elements with animation attributes
    document.querySelectorAll('[data-animate]').forEach((element) => {
      this.initializeAnimatedElement(element);
    });

    // Use MutationObserver for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const animatedElements = node.querySelectorAll('[data-animate]');
            animatedElements.forEach((element) => {
              this.initializeAnimatedElement(element);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  initializeAnimatedElement(element) {
    const animationType = element.getAttribute('data-animate');
    const trigger = element.getAttribute('data-animate-trigger') || 'scroll';
    const delay = parseInt(element.getAttribute('data-animate-delay')) || 0;
    const duration = parseInt(element.getAttribute('data-animate-duration')) || 600;
    const easing = element.getAttribute('data-animate-easing') || 'ease-out';

    const animationData = {
      type: animationType,
      trigger,
      delay,
      duration,
      easing,
      element
    };

    // Store animation data
    element._animationData = animationData;

    // Set initial state
    this.setInitialAnimationState(element, animationType);

    // Set up trigger
    if (trigger === 'scroll') {
      this.scrollObserver.observe(element);
    } else if (trigger === 'hover') {
      this.setupHoverAnimation(element, animationData);
    } else if (trigger === 'click') {
      this.setupClickAnimation(element, animationData);
    } else if (trigger === 'load') {
      // Trigger immediately after a short delay
      setTimeout(() => {
        this.triggerAnimation(element, animationData);
      }, 100);
    }
  }

  setInitialAnimationState(element, animationType) {
    if (this.prefersReducedMotion.matches) return;

    element.classList.add('animate-initial');

    switch (animationType) {
      case 'fadeIn':
        element.style.opacity = '0';
        break;
      case 'fadeInUp':
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        break;
      case 'fadeInDown':
        element.style.opacity = '0';
        element.style.transform = 'translateY(-30px)';
        break;
      case 'fadeInLeft':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        break;
      case 'fadeInRight':
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        break;
      case 'scaleIn':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        break;
      case 'slideInUp':
        element.style.transform = 'translateY(100%)';
        break;
      case 'slideInDown':
        element.style.transform = 'translateY(-100%)';
        break;
      case 'slideInLeft':
        element.style.transform = 'translateX(-100%)';
        break;
      case 'slideInRight':
        element.style.transform = 'translateX(100%)';
        break;
      case 'rotateIn':
        element.style.opacity = '0';
        element.style.transform = 'rotate(-180deg) scale(0.8)';
        break;
    }
  }

  triggerScrollAnimation(element) {
    const animationData = element._animationData;
    if (!animationData || element.classList.contains('animate-complete')) return;

    this.triggerAnimation(element, animationData);
  }

  setupHoverAnimation(element, animationData) {
    element.addEventListener('mouseenter', () => {
      if (!element.classList.contains('animate-complete')) {
        this.triggerAnimation(element, animationData);
      }
    });
  }

  setupClickAnimation(element, animationData) {
    element.addEventListener('click', () => {
      if (!element.classList.contains('animate-complete')) {
        this.triggerAnimation(element, animationData);
      }
    });
  }

  triggerAnimation(element, animationData) {
    if (this.prefersReducedMotion.matches) {
      // Skip animation but apply final state
      this.applyFinalAnimationState(element, animationData.type);
      return;
    }

    const { type, delay, duration, easing } = animationData;

    // Add to running animations
    this.runningAnimations.add(element);

    // Apply animation class
    element.classList.add('animate-running');

    setTimeout(() => {
      this.applyAnimation(element, type, duration, easing);
    }, delay);
  }

  applyAnimation(element, type, duration, easing) {
    element.style.transition = `all ${duration}ms ${easing}`;

    switch (type) {
      case 'fadeIn':
        element.style.opacity = '1';
        break;
      case 'fadeInUp':
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        break;
      case 'fadeInDown':
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        break;
      case 'fadeInLeft':
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
        break;
      case 'fadeInRight':
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
        break;
      case 'scaleIn':
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        break;
      case 'slideInUp':
        element.style.transform = 'translateY(0)';
        break;
      case 'slideInDown':
        element.style.transform = 'translateY(0)';
        break;
      case 'slideInLeft':
        element.style.transform = 'translateX(0)';
        break;
      case 'slideInRight':
        element.style.transform = 'translateX(0)';
        break;
      case 'rotateIn':
        element.style.opacity = '1';
        element.style.transform = 'rotate(0deg) scale(1)';
        break;
    }

    // Clean up after animation
    setTimeout(() => {
      this.completeAnimation(element);
    }, duration);
  }

  applyFinalAnimationState(element, type) {
    // Apply final state immediately for reduced motion
    switch (type) {
      case 'fadeIn':
      case 'fadeInUp':
      case 'fadeInDown':
      case 'fadeInLeft':
      case 'fadeInRight':
      case 'scaleIn':
      case 'rotateIn':
        element.style.opacity = '1';
        element.style.transform = 'none';
        break;
      case 'slideInUp':
      case 'slideInDown':
      case 'slideInLeft':
      case 'slideInRight':
        element.style.transform = 'none';
        break;
    }

    this.completeAnimation(element);
  }

  completeAnimation(element) {
    element.classList.remove('animate-initial', 'animate-running');
    element.classList.add('animate-complete');
    element.style.transition = '';
    this.runningAnimations.delete(element);
  }

  // Utility animations
  fadeIn(element, options = {}) {
    return this.animate(element, 'fadeIn', options);
  }

  fadeOut(element, options = {}) {
    return this.animate(element, 'fadeOut', options);
  }

  slideUp(element, options = {}) {
    return this.animate(element, 'slideUp', options);
  }

  slideDown(element, options = {}) {
    return this.animate(element, 'slideDown', options);
  }

  animate(element, type, options = {}) {
    const {
      duration = 300,
      easing = 'ease-out',
      delay = 0,
      onComplete = null
    } = options;

    if (this.prefersReducedMotion.matches) {
      // Skip animation for reduced motion
      if (onComplete) onComplete();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.transition = `all ${duration}ms ${easing}`;

        switch (type) {
          case 'fadeIn':
            element.style.opacity = '1';
            break;
          case 'fadeOut':
            element.style.opacity = '0';
            break;
          case 'slideUp':
            element.style.transform = 'translateY(-100%)';
            element.style.opacity = '0';
            break;
          case 'slideDown':
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
            break;
        }

        setTimeout(() => {
          element.style.transition = '';
          if (onComplete) onComplete();
          resolve();
        }, duration);
      }, delay);
    });
  }

  // Stagger animations
  staggerAnimation(elements, animationType, options = {}) {
    const {
      staggerDelay = 100,
      duration = 600,
      easing = 'ease-out'
    } = options;

    elements.forEach((element, index) => {
      const delay = index * staggerDelay;
      
      setTimeout(() => {
        const animationData = {
          type: animationType,
          duration,
          easing,
          element
        };

        this.setInitialAnimationState(element, animationType);
        this.triggerAnimation(element, animationData);
      }, delay);
    });
  }

  // Parallax effect
  setupParallax(element, options = {}) {
    const {
      speed = 0.5,
      direction = 'vertical'
    } = options;

    if (this.prefersReducedMotion.matches) return;

    const updateParallax = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      if (direction === 'vertical') {
        element.style.transform = `translateY(${rate}px)`;
      } else {
        element.style.transform = `translateX(${rate}px)`;
      }
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    
    // Store cleanup function
    element._parallaxCleanup = () => {
      window.removeEventListener('scroll', updateParallax);
    };
  }

  // Pulse animation
  pulse(element, options = {}) {
    const {
      scale = 1.05,
      duration = 600,
      iterations = 1
    } = options;

    if (this.prefersReducedMotion.matches) return;

    element.style.animation = `pulse ${duration}ms ease-in-out ${iterations}`;
    element.style.setProperty('--pulse-scale', scale);

    setTimeout(() => {
      element.style.animation = '';
    }, duration * iterations);
  }

  // Shake animation
  shake(element, options = {}) {
    const {
      intensity = 10,
      duration = 600
    } = options;

    if (this.prefersReducedMotion.matches) return;

    element.style.animation = `shake ${duration}ms ease-in-out`;
    element.style.setProperty('--shake-intensity', `${intensity}px`);

    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }

  // Bounce animation
  bounce(element, options = {}) {
    const {
      height = 20,
      duration = 600,
      iterations = 1
    } = options;

    if (this.prefersReducedMotion.matches) return;

    element.style.animation = `bounce ${duration}ms ease-in-out ${iterations}`;
    element.style.setProperty('--bounce-height', `${height}px`);

    setTimeout(() => {
      element.style.animation = '';
    }, duration * iterations);
  }

  // Control methods
  disableAnimations() {
    document.documentElement.classList.add('animations-disabled');
    
    // Stop all running animations
    this.runningAnimations.forEach((element) => {
      this.completeAnimation(element);
    });
  }

  enableAnimations() {
    document.documentElement.classList.remove('animations-disabled');
  }

  pauseAnimations() {
    document.documentElement.classList.add('animations-paused');
  }

  resumeAnimations() {
    document.documentElement.classList.remove('animations-paused');
  }

  // Cleanup
  cleanup() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    // Clean up parallax effects
    document.querySelectorAll('[data-parallax]').forEach((element) => {
      if (element._parallaxCleanup) {
        element._parallaxCleanup();
      }
    });

    this.runningAnimations.clear();
    this.observers.clear();
  }

  // Public API
  isAnimationEnabled() {
    return !this.prefersReducedMotion.matches && 
           !document.documentElement.classList.contains('animations-disabled');
  }

  addAnimation(element, type, options = {}) {
    element.setAttribute('data-animate', type);
    if (options.trigger) element.setAttribute('data-animate-trigger', options.trigger);
    if (options.delay) element.setAttribute('data-animate-delay', options.delay);
    if (options.duration) element.setAttribute('data-animate-duration', options.duration);
    if (options.easing) element.setAttribute('data-animate-easing', options.easing);

    this.initializeAnimatedElement(element);
  }

  removeAnimation(element) {
    element.removeAttribute('data-animate');
    element.removeAttribute('data-animate-trigger');
    element.removeAttribute('data-animate-delay');
    element.removeAttribute('data-animate-duration');
    element.removeAttribute('data-animate-easing');

    if (element._animationData) {
      delete element._animationData;
    }

    this.scrollObserver.unobserve(element);
    this.runningAnimations.delete(element);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationSystem;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.AnimationSystem = AnimationSystem;
}