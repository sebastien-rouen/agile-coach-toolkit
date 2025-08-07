/**
 * Footer Particles System
 * Creates animated particles in the footer background
 */

class FooterParticles {
  constructor() {
    this.footer = document.querySelector('.footer');
    this.particles = [];
    this.maxParticles = 15;
    this.init();
  }

  init() {
    if (!this.footer || 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.innerWidth < 768) {
      return;
    }

    this.createParticleContainer();
    this.startParticleSystem();
    this.setupResizeHandler();
  }

  createParticleContainer() {
    this.particleContainer = document.createElement('div');
    this.particleContainer.className = 'footer-particles-container';
    this.particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.footer.appendChild(this.particleContainer);
  }

  startParticleSystem() {
    // Create initial particles
    for (let i = 0; i < this.maxParticles; i++) {
      setTimeout(() => {
        this.createParticle();
      }, i * 300);
    }

    // Continuously create new particles
    this.particleInterval = setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createParticle();
      }
    }, 2000);
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'footer-particle';
    
    // Random properties
    const startX = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 6 + 8;
    const delay = Math.random() * 2;
    const opacity = Math.random() * 0.5 + 0.2;
    
    particle.style.cssText = `
      left: ${startX}%;
      bottom: 0;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      animation: particleFloat ${duration}s linear ${delay}s forwards;
    `;
    
    this.particleContainer.appendChild(particle);
    this.particles.push(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      this.removeParticle(particle);
    }, (duration + delay) * 1000);
  }

  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
    }
    
    if (particle.parentNode) {
      particle.remove();
    }
  }

  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 768) {
          this.destroy();
        } else if (!this.particleContainer && window.innerWidth >= 768) {
          this.init();
        }
      }, 250);
    });
  }

  destroy() {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
    
    if (this.particleContainer) {
      this.particleContainer.remove();
      this.particleContainer = null;
    }
    
    this.particles = [];
  }
}

// Initialize footer particles
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on capable devices
  if (window.innerWidth > 768 && 
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new FooterParticles();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FooterParticles;
}