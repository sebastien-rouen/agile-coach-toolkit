/**
 * Modal System Component
 * Enhanced modal system for tool demos and detailed views
 */

class ModalSystem {
  constructor() {
    this.activeModal = null;
    this.modalStack = [];
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardTrap();
  }

  setupEventListeners() {
    // Global escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });

    // Global click handler for backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
  }

  setupKeyboardTrap() {
    document.addEventListener('keydown', (e) => {
      if (!this.activeModal || e.key !== 'Tab') return;

      const focusableElements = this.activeModal.querySelectorAll(this.focusableElements);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  createModal(options = {}) {
    const {
      id = `modal-${Date.now()}`,
      title = '',
      content = '',
      size = 'medium',
      closable = true,
      backdrop = true,
      keyboard = true,
      className = '',
      onShow = null,
      onHide = null
    } = options;

    const modal = document.createElement('div');
    modal.className = `modal modal-${size} ${className}`;
    modal.id = id;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    if (title) {
      modal.setAttribute('aria-labelledby', `${id}-title`);
    }

    modal.innerHTML = `
      <div class="modal-content">
        ${title ? `
          <div class="modal-header">
            <h3 id="${id}-title" class="modal-title">${title}</h3>
            ${closable ? `
              <button class="modal-close" aria-label="Fermer la fenêtre">
                <span aria-hidden="true">&times;</span>
              </button>
            ` : ''}
          </div>
        ` : ''}
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    // Add event listeners
    if (closable) {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal));
      }
    }

    if (backdrop) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    }

    // Store callbacks
    modal._onShow = onShow;
    modal._onHide = onHide;

    return modal;
  }

  showModal(modal) {
    if (!modal) return;

    // Add to DOM if not already there
    if (!modal.parentNode) {
      document.body.appendChild(modal);
    }

    // Store previous active modal
    if (this.activeModal) {
      this.modalStack.push(this.activeModal);
    }

    this.activeModal = modal;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Show modal with animation
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('modal-show');

    // Focus management
    setTimeout(() => {
      const firstFocusable = modal.querySelector(this.focusableElements);
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    // Call onShow callback
    if (modal._onShow) {
      modal._onShow(modal);
    }

    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('modal:show', { detail: { modal } }));
  }

  closeModal(modal) {
    if (!modal || modal !== this.activeModal) return;

    // Call onHide callback
    if (modal._onHide) {
      modal._onHide(modal);
    }

    // Hide modal with animation
    modal.classList.remove('modal-show');
    modal.setAttribute('aria-hidden', 'true');

    // Remove from stack
    this.activeModal = this.modalStack.pop() || null;

    // Restore body scroll if no modals are open
    if (!this.activeModal) {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }

    // Remove from DOM after animation
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);

    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('modal:hide', { detail: { modal } }));
  }

  closeAllModals() {
    while (this.activeModal) {
      this.closeModal(this.activeModal);
    }
  }

  // Utility methods
  createConfirmModal(options = {}) {
    const {
      title = 'Confirmation',
      message = 'Êtes-vous sûr ?',
      confirmText = 'Confirmer',
      cancelText = 'Annuler',
      onConfirm = null,
      onCancel = null
    } = options;

    const modal = this.createModal({
      title,
      content: `
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
          <button class="btn btn-primary modal-confirm">${confirmText}</button>
          <button class="btn btn-secondary modal-cancel">${cancelText}</button>
        </div>
      `,
      size: 'small',
      className: 'modal-confirm'
    });

    // Add event listeners
    const confirmBtn = modal.querySelector('.modal-confirm');
    const cancelBtn = modal.querySelector('.modal-cancel');

    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      this.closeModal(modal);
    });

    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      this.closeModal(modal);
    });

    return modal;
  }

  createLoadingModal(options = {}) {
    const {
      title = 'Chargement...',
      message = 'Veuillez patienter'
    } = options;

    const modal = this.createModal({
      title,
      content: `
        <div class="modal-loading">
          <div class="loading-spinner"></div>
          <p class="loading-message">${message}</p>
        </div>
      `,
      size: 'small',
      closable: false,
      backdrop: false,
      className: 'modal-loading'
    });

    return modal;
  }

  // Public API
  show(modalOrOptions) {
    if (modalOrOptions instanceof HTMLElement) {
      this.showModal(modalOrOptions);
    } else {
      const modal = this.createModal(modalOrOptions);
      this.showModal(modal);
      return modal;
    }
  }

  hide(modal = null) {
    if (modal) {
      this.closeModal(modal);
    } else if (this.activeModal) {
      this.closeModal(this.activeModal);
    }
  }

  confirm(options) {
    const modal = this.createConfirmModal(options);
    this.showModal(modal);
    return modal;
  }

  loading(options) {
    const modal = this.createLoadingModal(options);
    this.showModal(modal);
    return modal;
  }

  getActiveModal() {
    return this.activeModal;
  }

  isModalOpen() {
    return this.activeModal !== null;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalSystem;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ModalSystem = ModalSystem;
}