/**
 * Tooltip System Component
 * Provides accessible tooltips for additional information
 */

class TooltipSystem {
  constructor() {
    this.tooltips = new Map();
    this.activeTooltip = null;
    this.showDelay = 500;
    this.hideDelay = 100;
    this.showTimeout = null;
    this.hideTimeout = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardHandlers();
    this.observeTooltipElements();
  }

  setupEventListeners() {
    // Use event delegation for better performance
    document.addEventListener('mouseenter', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const tooltipElement = e.target.closest('[data-tooltip]');
      if (tooltipElement) {
        this.handleMouseEnter(tooltipElement);
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const tooltipElement = e.target.closest('[data-tooltip]');
      if (tooltipElement) {
        this.handleMouseLeave(tooltipElement);
      }
    }, true);

    document.addEventListener('focus', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const tooltipElement = e.target.closest('[data-tooltip]');
      if (tooltipElement) {
        this.handleFocus(tooltipElement);
      }
    }, true);

    document.addEventListener('blur', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const tooltipElement = e.target.closest('[data-tooltip]');
      if (tooltipElement) {
        this.handleBlur(tooltipElement);
      }
    }, true);

    // Hide tooltip on scroll
    document.addEventListener('scroll', () => {
      if (this.activeTooltip) {
        this.hideTooltip();
      }
    }, { passive: true });

    // Hide tooltip on resize
    window.addEventListener('resize', () => {
      if (this.activeTooltip) {
        this.hideTooltip();
      }
    });
  }

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeTooltip) {
        this.hideTooltip();
      }
    });
  }

  observeTooltipElements() {
    // Use MutationObserver to handle dynamically added tooltip elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tooltipElements = node.querySelectorAll('[data-tooltip]');
            tooltipElements.forEach((element) => {
              this.initializeTooltipElement(element);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initialize existing tooltip elements
    document.querySelectorAll('[data-tooltip]').forEach((element) => {
      this.initializeTooltipElement(element);
    });
  }

  initializeTooltipElement(element) {
    if (this.tooltips.has(element)) return;

    const tooltipData = {
      content: element.getAttribute('data-tooltip'),
      position: element.getAttribute('data-tooltip-position') || 'top',
      delay: parseInt(element.getAttribute('data-tooltip-delay')) || this.showDelay,
      theme: element.getAttribute('data-tooltip-theme') || 'default'
    };

    this.tooltips.set(element, tooltipData);

    // Add ARIA attributes for accessibility
    const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.setAttribute('aria-describedby', tooltipId);
    tooltipData.id = tooltipId;
  }

  handleMouseEnter(element) {
    this.clearTimeouts();
    
    const tooltipData = this.tooltips.get(element);
    if (!tooltipData) return;

    this.showTimeout = setTimeout(() => {
      this.showTooltip(element, tooltipData);
    }, tooltipData.delay);
  }

  handleMouseLeave(element) {
    this.clearTimeouts();
    
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, this.hideDelay);
  }

  handleFocus(element) {
    this.clearTimeouts();
    
    const tooltipData = this.tooltips.get(element);
    if (!tooltipData) return;

    // Show immediately on focus for accessibility
    this.showTooltip(element, tooltipData);
  }

  handleBlur(element) {
    this.clearTimeouts();
    this.hideTooltip();
  }

  showTooltip(element, tooltipData) {
    // Hide any existing tooltip
    this.hideTooltip();

    const tooltip = this.createTooltipElement(tooltipData);
    document.body.appendChild(tooltip);

    // Position the tooltip
    this.positionTooltip(tooltip, element, tooltipData.position);

    // Show with animation
    requestAnimationFrame(() => {
      tooltip.classList.add('tooltip-show');
    });

    this.activeTooltip = {
      element: tooltip,
      target: element,
      data: tooltipData
    };

    // Announce to screen readers
    this.announceTooltip(tooltipData.content);
  }

  hideTooltip() {
    if (!this.activeTooltip) return;

    const { element } = this.activeTooltip;
    
    element.classList.remove('tooltip-show');
    
    // Remove after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 200);

    this.activeTooltip = null;
  }

  createTooltipElement(tooltipData) {
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${tooltipData.theme}`;
    tooltip.id = tooltipData.id;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'false');

    tooltip.innerHTML = `
      <div class="tooltip-content">
        ${tooltipData.content}
      </div>
      <div class="tooltip-arrow"></div>
    `;

    return tooltip;
  }

  positionTooltip(tooltip, target, position) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    let top, left;
    let actualPosition = position;

    // Calculate initial position
    switch (position) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + 8;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + scrollX + 8;
        break;
      default:
        // Default to top
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        actualPosition = 'top';
    }

    // Adjust for viewport boundaries
    if (left < 8) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    if (top < 8) {
      // Flip to bottom if there's not enough space at top
      if (position === 'top') {
        top = targetRect.bottom + scrollY + 8;
        actualPosition = 'bottom';
      } else {
        top = 8;
      }
    } else if (top + tooltipRect.height > viewportHeight + scrollY - 8) {
      // Flip to top if there's not enough space at bottom
      if (position === 'bottom') {
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        actualPosition = 'top';
      } else {
        top = viewportHeight + scrollY - tooltipRect.height - 8;
      }
    }

    // Apply position
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.setAttribute('data-position', actualPosition);

    // Position arrow
    this.positionArrow(tooltip, target, actualPosition);
  }

  positionArrow(tooltip, target, position) {
    const arrow = tooltip.querySelector('.tooltip-arrow');
    if (!arrow) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    switch (position) {
      case 'top':
      case 'bottom':
        const centerX = targetRect.left + targetRect.width / 2;
        const tooltipLeft = tooltipRect.left;
        const arrowLeft = centerX - tooltipLeft - 6; // 6px is half arrow width
        arrow.style.left = `${Math.max(8, Math.min(arrowLeft, tooltipRect.width - 16))}px`;
        arrow.style.top = '';
        break;
      case 'left':
      case 'right':
        const centerY = targetRect.top + targetRect.height / 2;
        const tooltipTop = tooltipRect.top;
        const arrowTop = centerY - tooltipTop - 6; // 6px is half arrow height
        arrow.style.top = `${Math.max(8, Math.min(arrowTop, tooltipRect.height - 16))}px`;
        arrow.style.left = '';
        break;
    }
  }

  announceTooltip(content) {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('tooltip-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'tooltip-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = content;
  }

  clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  // Public API
  show(element, content, options = {}) {
    const tooltipData = {
      content,
      position: options.position || 'top',
      delay: options.delay || 0,
      theme: options.theme || 'default',
      id: `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.tooltips.set(element, tooltipData);
    element.setAttribute('aria-describedby', tooltipData.id);
    
    this.showTooltip(element, tooltipData);
  }

  hide() {
    this.hideTooltip();
  }

  destroy() {
    this.hideTooltip();
    this.clearTimeouts();
    this.tooltips.clear();
  }

  // Utility method to add tooltip to element
  addTooltip(element, content, options = {}) {
    element.setAttribute('data-tooltip', content);
    if (options.position) element.setAttribute('data-tooltip-position', options.position);
    if (options.delay) element.setAttribute('data-tooltip-delay', options.delay);
    if (options.theme) element.setAttribute('data-tooltip-theme', options.theme);
    
    this.initializeTooltipElement(element);
  }

  // Utility method to remove tooltip from element
  removeTooltip(element) {
    element.removeAttribute('data-tooltip');
    element.removeAttribute('data-tooltip-position');
    element.removeAttribute('data-tooltip-delay');
    element.removeAttribute('data-tooltip-theme');
    element.removeAttribute('aria-describedby');
    
    this.tooltips.delete(element);
    
    if (this.activeTooltip && this.activeTooltip.target === element) {
      this.hideTooltip();
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TooltipSystem;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.TooltipSystem = TooltipSystem;
}