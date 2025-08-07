/**
 * Visual Effects for Hero & Features
 * Adds dynamic visual elements and effects
 */

class VisualEffects {
  constructor() {
    this.init();
  }

  init() {
    this.createParticleSystem();
    this.createScrollProgress();
    this.createFloatingElements();
    this.setupInteractiveBackground();
  }

  /**
   * Create particle system for hero background
   */
  createParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'hero-particles';
    heroSection.appendChild(particlesContainer);

    // Create particles
    const particleCount = window.innerWidth > 768 ? 50 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createParticle(particlesContainer);
      }, i * 200);
    }

    // Continuously create new particles
    setInterval(() => {
      if (particlesContainer.children.length < particleCount) {
        this.createParticle(particlesContainer);
      }
    }, 2000);
  }

  /**
   * Create individual particle
   */
  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    
    // Random positioning and properties
    const startX = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 4 + 6;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
      left: ${startX}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, (duration + delay) * 1000);
  }

  /**
   * Create scroll progress indicator
   */
  createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      ticking = false;
    };

    const requestProgressUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  }

  /**
   * Create floating elements in hero
   */
  createFloatingElements() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elements = ['⚡', '🎯', '🚀', '✨', '💡'];
    
    elements.forEach((emoji, index) => {
      const element = document.createElement('div');
      element.className = 'hero-floating-element';
      element.textContent = emoji;
      element.style.cssText = `
        font-size: 2rem;
        animation-delay: ${index * 1.2}s;
      `;
      
      heroSection.appendChild(element);
    });
  }

  /**
   * Setup interactive background elements
   */
  setupInteractiveBackground() {
    const featuresSection = document.querySelector('.features');
    if (!featuresSection) return;

    // Create interactive background elements
    for (let i = 0; i < 5; i++) {
      const element = document.createElement('div');
      element.className = 'interactive-bg-element';
      
      const size = Math.random() * 200 + 100;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      element.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        z-index: 1;
      `;
      
      featuresSection.appendChild(element);
    }

    // Add mouse interaction
    featuresSection.addEventListener('mousemove', (e) => {
      const elements = featuresSection.querySelectorAll('.interactive-bg-element');
      
      elements.forEach((element, index) => {
        const rect = featuresSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const moveX = (x - 0.5) * 20 * (index + 1);
        const moveY = (y - 0.5) * 20 * (index + 1);
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  /**
   * Create typing effect for hero title
   */
  createTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    const subtitle = heroTitle.querySelector('.hero-subtitle');
    const subtitleText = subtitle ? subtitle.textContent : '';
    
    // Clear content
    heroTitle.textContent = '';
    if (subtitle) {
      subtitle.textContent = '';
    }

    let index = 0;
    const typeSpeed = 100;

    const typeText = () => {
      if (index < text.length) {
        heroTitle.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, typeSpeed);
      } else if (subtitle && subtitleText) {
        // Start typing subtitle
        let subtitleIndex = 0;
        const typeSubtitle = () => {
          if (subtitleIndex < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(subtitleIndex);
            subtitleIndex++;
            setTimeout(typeSubtitle, typeSpeed);
          }
        };
        setTimeout(typeSubtitle, 500);
      }
    };

    // Start typing effect after a delay
    setTimeout(typeText, 1000);
  }

  /**
   * Create morphing shapes
   */
  createMorphingShapes() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
      opacity: 0.1;
    `;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'rgba(255, 255, 255, 0.3)');
    path.setAttribute('d', 'M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z');

    // Add morphing animation
    const morphKeyframes = [
      'M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z',
      'M0,100 C200,150 300,50 500,100 L500,00 L0,0 Z',
      'M0,100 C100,250 400,0 500,100 L500,00 L0,0 Z'
    ];

    let currentFrame = 0;
    setInterval(() => {
      currentFrame = (currentFrame + 1) % morphKeyframes.length;
      path.setAttribute('d', morphKeyframes[currentFrame]);
    }, 3000);

    svg.appendChild(path);
    heroSection.appendChild(svg);
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();

    const checkPerformance = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Reduce effects if performance is poor
        if (fps < 30) {
          document.body.classList.add('low-performance');
          this.reduceEffects();
        } else {
          document.body.classList.remove('low-performance');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };

    requestAnimationFrame(checkPerformance);
  }

  /**
   * Reduce effects for better performance
   */
  reduceEffects() {
    // Remove particles
    const particles = document.querySelectorAll('.hero-particle');
    particles.forEach(particle => particle.remove());

    // Reduce floating elements
    const floatingElements = document.querySelectorAll('.hero-floating-element');
    floatingElements.forEach((element, index) => {
      if (index > 2) element.remove();
    });

    // Disable complex animations
    document.body.classList.add('reduced-effects');
  }

  /**
   * Cleanup method
   */
  cleanup() {
    // Remove all created elements
    const elementsToRemove = [
      '.hero-particles',
      '.scroll-progress',
      '.hero-floating-element',
      '.interactive-bg-element'
    ];

    elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
  }
}

// Initialize visual effects
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not in reduced motion mode and on capable devices
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 
      window.innerWidth > 480) {
    new VisualEffects();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualEffects;
}