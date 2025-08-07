/**
 * Navigation Component
 * Handles responsive navigation, smooth scrolling, and active section highlighting
 */

class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.header = document.querySelector('.header');
    this.mobileToggle = document.querySelector('.navbar-toggle');
    this.mobileMenu = document.querySelector('.navbar-mobile');
    this.navLinks = document.querySelectorAll('.navbar-link, .navbar-mobile-link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.isMenuOpen = false;
    this.currentSection = '';
    this.scrollTimeout = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupKeyboardNavigation();
    this.updateActiveSection();
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e);
      });
    });

    // Scroll events for sticky header
    window.addEventListener('scroll', () => {
      this.handleScroll();
    }, { passive: true });

    // Resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
          this.updateActiveLinks();
        }
      });
    }, options);

    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  setupKeyboardNavigation() {
    // Handle keyboard navigation for mobile menu
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleMobileMenu();
        }
      });
    }

    // Handle arrow key navigation in mobile menu
    const mobileLinks = this.mobileMenu?.querySelectorAll('.navbar-mobile-link');
    if (mobileLinks) {
      mobileLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (index + 1) % mobileLinks.length;
            mobileLinks[nextIndex].focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (index - 1 + mobileLinks.length) % mobileLinks.length;
            mobileLinks[prevIndex].focus();
          } else if (e.key === 'Home') {
            e.preventDefault();
            mobileLinks[0].focus();
          } else if (e.key === 'End') {
            e.preventDefault();
            mobileLinks[mobileLinks.length - 1].focus();
          }
        });
      });
    }

    // Handle keyboard navigation for desktop menu
    const desktopLinks = document.querySelectorAll('.navbar-link');
    desktopLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % desktopLinks.length;
          desktopLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + desktopLinks.length) % desktopLinks.length;
          desktopLinks[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          desktopLinks[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          desktopLinks[desktopLinks.length - 1].focus();
        }
      });
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    
    // Announce to screen readers
    this.mobileToggle.setAttribute('aria-label', 'Fermer le menu mobile');
    
    // Focus first menu item
    const firstLink = this.mobileMenu.querySelector('.navbar-mobile-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    
    // Restore original aria-label
    this.mobileToggle.setAttribute('aria-label', 'Menu mobile');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    this.mobileToggle.focus();
  }

  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Only handle internal links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
        
        // Smooth scroll to target
        this.scrollToElement(targetElement);
        
        // Update URL without triggering scroll
        history.pushState(null, null, href);
        
        // Update active state immediately
        this.currentSection = targetId;
        this.updateActiveLinks();
        
        // Manage focus
        this.manageFocus(targetElement);
      }
    }
  }

  scrollToElement(element) {
    const headerHeight = this.header.offsetHeight;
    const elementTop = element.offsetTop - headerHeight - 20;
    
    // Use smooth scrolling if supported and not reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && 'scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers without smooth scrolling
      this.smoothScrollTo(elementTop);
    }
  }

  smoothScrollTo(targetY) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 500;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      window.scrollTo(0, startY + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  manageFocus(targetElement) {
    // Make the target element focusable temporarily
    const originalTabIndex = targetElement.getAttribute('tabindex');
    targetElement.setAttribute('tabindex', '-1');
    
    // Focus the element
    targetElement.focus();
    
    // Restore original tabindex after a short delay
    setTimeout(() => {
      if (originalTabIndex !== null) {
        targetElement.setAttribute('tabindex', originalTabIndex);
      } else {
        targetElement.removeAttribute('tabindex');
      }
    }, 100);
  }

  handleScroll() {
    // Throttle scroll events
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      this.updateScrollState();
    }, 10);
  }

  updateScrollState() {
    const scrollY = window.pageYOffset;
    
    // Add scrolled class to header
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  updateActiveSection() {
    // Initial active section detection
    const scrollY = window.pageYOffset;
    const headerHeight = this.header.offsetHeight;
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      const sectionTop = section.offsetTop - headerHeight - 50;
      
      if (scrollY >= sectionTop) {
        this.currentSection = section.id;
        break;
      }
    }
    
    this.updateActiveLinks();
  }

  updateActiveLinks() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${this.currentSection}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        // Announce to screen readers
        link.setAttribute('aria-label', `${link.textContent} (section actuelle)`);
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        // Remove the current section announcement
        const originalText = link.textContent.trim();
        link.setAttribute('aria-label', originalText);
      }
    });
  }

  // Public method to programmatically navigate
  navigateTo(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      this.scrollToElement(targetElement);
      this.currentSection = sectionId;
      this.updateActiveLinks();
      history.pushState(null, null, `#${sectionId}`);
    }
  }

  // Public method to get current section
  getCurrentSection() {
    return this.currentSection;
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Restore body scroll if menu was open
    if (this.isMenuOpen) {
      document.body.style.overflow = '';
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.navigation = new Navigation();
    });
  } else {
    window.navigation = new Navigation();
  }
}