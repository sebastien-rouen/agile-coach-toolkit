/**
 * ========================================
 * MODAL MANAGER
 * ========================================
 * Gestion des modales
 */

export class ModalManager {
    constructor() {
        this.openModals = new Set();
        this.setupGlobalEvents();
    }

    /**
     * Configurer les événements globaux
     */
    setupGlobalEvents() {
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });

        // Fermer en cliquant sur l'overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modalId = e.target.id;
                if (modalId) {
                    this.closeModal(modalId);
                }
            }
        });

        // Fermer avec les boutons close
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    /**
     * Ouvrir une modale
     * @param {string} modalId - ID de la modale
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} non trouvée`);
            return;
        }

        modal.classList.remove('is-hidden');
        this.openModals.add(modalId);

        // Empêcher le scroll du body
        if (this.openModals.size === 1) {
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Fermer une modale
     * @param {string} modalId - ID de la modale
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('is-hidden');
        this.openModals.delete(modalId);

        // Réactiver le scroll si plus de modales
        if (this.openModals.size === 0) {
            document.body.style.overflow = '';
        }
    }

    /**
     * Fermer la modale du dessus
     */
    closeTopModal() {
        if (this.openModals.size > 0) {
            const lastModal = Array.from(this.openModals).pop();
            this.closeModal(lastModal);
        }
    }

    /**
     * Fermer toutes les modales
     */
    closeAllModals() {
        this.openModals.forEach(modalId => {
            this.closeModal(modalId);
        });
    }

    /**
     * Vérifier si une modale est ouverte
     * @param {string} modalId - ID de la modale
     * @returns {boolean} True si ouverte
     */
    isOpen(modalId) {
        return this.openModals.has(modalId);
    }

    /**
     * Obtenir les données d'un formulaire
     * @param {string} formId - ID du formulaire
     * @returns {Object} Données du formulaire
     */
    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    /**
     * Réinitialiser un formulaire
     * @param {string} formId - ID du formulaire
     */
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    /**
     * Valider un formulaire
     * @param {string} formId - ID du formulaire
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) {
            return { valid: false, errors: ['Formulaire non trouvé'] };
        }

        const errors = [];

        // Vérifier les champs requis
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value || field.value.trim() === '') {
                const label = form.querySelector(`label[for="${field.id}"]`);
                const fieldName = label ? label.textContent : field.name;
                errors.push(`${fieldName} est requis`);
            }
        });

        // Vérifier les emails
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                errors.push('Email invalide');
            }
        });

        // Vérifier les URLs
        const urlFields = form.querySelectorAll('input[type="url"]');
        urlFields.forEach(field => {
            if (field.value && !this.isValidUrl(field.value)) {
                errors.push('URL invalide');
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Valider un email
     * @param {string} email - Email à valider
     * @returns {boolean} True si valide
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valider une URL
     * @param {string} url - URL à valider
     * @returns {boolean} True si valide
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Afficher des erreurs de validation
     * @param {string} formId - ID du formulaire
     * @param {Array} errors - Liste des erreurs
     */
    showValidationErrors(formId, errors) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Retirer les erreurs existantes
        const existingErrors = form.querySelectorAll('.validation-error');
        existingErrors.forEach(error => error.remove());

        // Ajouter les nouvelles erreurs
        const errorContainer = document.createElement('div');
        errorContainer.className = 'validation-error';
        errorContainer.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #F44336;
        `;

        const errorList = document.createElement('ul');
        errorList.style.margin = '0';
        errorList.style.paddingLeft = '1.5rem';

        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });

        errorContainer.appendChild(errorList);
        form.insertBefore(errorContainer, form.firstChild);
    }
}
