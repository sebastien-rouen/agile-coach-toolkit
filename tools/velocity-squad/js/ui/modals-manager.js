/**
 * ========================================
 * MODALS MANAGER
 * ========================================
 * Gestion des modales de l'application
 */

export class ModalsManager {
    constructor() {
        this.activeModal = null;
        this.setupModalEvents();
    }

    /**
     * Configurer les événements des modales
     */
    setupModalEvents() {
        // Fermer les modales avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });

        // Fermer en cliquant sur l'overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                const modalId = e.target.querySelector('.modal')?.id;
                if (modalId) {
                    this.closeModal(modalId);
                }
            }
        });
    }

    /**
     * Ouvrir une modale
     * @param {string} modalId - ID de la modale
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('❌ Modale non trouvée:', modalId);
            return;
        }

        // Fermer la modale active
        if (this.activeModal && this.activeModal !== modalId) {
            this.closeModal(this.activeModal);
        }

        modal.classList.add('is-active');
        this.activeModal = modalId;

        // Focus sur le premier input
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fermer une modale
     * @param {string} modalId - ID de la modale
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('❌ Modale non trouvée:', modalId);
            return;
        }

        modal.classList.remove('is-active');
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }

        // Réactiver le scroll du body
        document.body.style.overflow = '';

        // Réinitialiser le formulaire si présent
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }

    /**
     * Basculer une modale
     * @param {string} modalId - ID de la modale
     */
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('❌ Modale non trouvée:', modalId);
            return;
        }

        if (modal.classList.contains('is-active')) {
            this.closeModal(modalId);
        } else {
            this.openModal(modalId);
        }
    }

    /**
     * Créer une modale de confirmation
     * @param {Object} options - Options de la modale
     * @returns {Promise} Promesse résolue avec true/false
     */
    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmation',
                message = 'Êtes-vous sûr ?',
                confirmText = 'Confirmer',
                cancelText = 'Annuler',
                confirmClass = 'btn-danger'
            } = options;

            // Créer la modale
            const modalId = 'confirmModal_' + Date.now();
            const modalHTML = `
                <div id="${modalId}" class="modal-overlay">
                    <div class="modal modal-confirm">
                        <div class="modal-header">
                            <h3>${title}</h3>
                            <button class="modal-close" onclick="window.modalsManager.closeModal('${modalId}')">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="${modalId}_cancel">${cancelText}</button>
                            <button class="btn ${confirmClass}" id="${modalId}_confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>
            `;

            // Ajouter au DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Ouvrir la modale
            this.openModal(modalId);

            // Gérer les événements
            const confirmBtn = document.getElementById(`${modalId}_confirm`);
            const cancelBtn = document.getElementById(`${modalId}_cancel`);

            const cleanup = () => {
                this.closeModal(modalId);
                setTimeout(() => {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.remove();
                    }
                }, 300);
            };

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
        });
    }

    /**
     * Créer une modale d'alerte
     * @param {Object} options - Options de la modale
     * @returns {Promise} Promesse résolue quand fermée
     */
    alert(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Information',
                message = '',
                okText = 'OK',
                type = 'info'
            } = options;

            const modalId = 'alertModal_' + Date.now();
            const iconMap = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };

            const modalHTML = `
                <div id="${modalId}" class="modal-overlay">
                    <div class="modal modal-alert modal-${type}">
                        <div class="modal-header">
                            <h3>${iconMap[type]} ${title}</h3>
                            <button class="modal-close" onclick="window.modalsManager.closeModal('${modalId}')">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" id="${modalId}_ok">${okText}</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.openModal(modalId);

            const okBtn = document.getElementById(`${modalId}_ok`);
            okBtn.addEventListener('click', () => {
                this.closeModal(modalId);
                setTimeout(() => {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.remove();
                    }
                }, 300);
                resolve();
            });
        });
    }

    /**
     * Créer une modale de prompt
     * @param {Object} options - Options de la modale
     * @returns {Promise} Promesse résolue avec la valeur saisie ou null
     */
    prompt(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Saisie',
                message = '',
                defaultValue = '',
                placeholder = '',
                confirmText = 'OK',
                cancelText = 'Annuler'
            } = options;

            const modalId = 'promptModal_' + Date.now();
            const modalHTML = `
                <div id="${modalId}" class="modal-overlay">
                    <div class="modal modal-prompt">
                        <div class="modal-header">
                            <h3>${title}</h3>
                            <button class="modal-close" onclick="window.modalsManager.closeModal('${modalId}')">&times;</button>
                        </div>
                        <div class="modal-body">
                            ${message ? `<p>${message}</p>` : ''}
                            <input type="text" id="${modalId}_input" class="form-input" 
                                   value="${defaultValue}" placeholder="${placeholder}">
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="${modalId}_cancel">${cancelText}</button>
                            <button class="btn btn-primary" id="${modalId}_confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.openModal(modalId);

            const input = document.getElementById(`${modalId}_input`);
            const confirmBtn = document.getElementById(`${modalId}_confirm`);
            const cancelBtn = document.getElementById(`${modalId}_cancel`);

            const cleanup = () => {
                this.closeModal(modalId);
                setTimeout(() => {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.remove();
                    }
                }, 300);
            };

            const submit = () => {
                const value = input.value.trim();
                cleanup();
                resolve(value || null);
            };

            confirmBtn.addEventListener('click', submit);
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submit();
                }
            });
        });
    }

    /**
     * Fermer toutes les modales
     */
    closeAllModals() {
        document.querySelectorAll('.modal-overlay.is-active').forEach(modal => {
            modal.classList.remove('is-active');
        });
        this.activeModal = null;
        document.body.style.overflow = '';
    }

    /**
     * Vérifier si une modale est ouverte
     * @returns {boolean} True si une modale est ouverte
     */
    isModalOpen() {
        return this.activeModal !== null;
    }

    /**
     * Obtenir la modale active
     * @returns {string|null} ID de la modale active
     */
    getActiveModal() {
        return this.activeModal;
    }
}
