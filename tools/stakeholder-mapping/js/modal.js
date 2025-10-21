/* ===================================
   MODAL MANAGEMENT
   =================================== */

const ModalManager = {
    currentStakeholder: null,

    /**
     * Initialize modal events
     */
    init() {
        // Stakeholder modal
        const stakeholderModal = document.getElementById('stakeholderModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('stakeholderForm');

        closeModal.addEventListener('click', () => this.closeStakeholderModal());
        cancelBtn.addEventListener('click', () => this.closeStakeholderModal());
        
        stakeholderModal.addEventListener('click', (e) => {
            if (e.target === stakeholderModal) {
                this.closeStakeholderModal();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.saveStakeholder();
            }
        });

        // Number selectors
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const field = e.target.dataset.field;
                const value = e.target.dataset.value;
                this.selectNumber(field, value);
            });
        });

        // Radio buttons for influence
        document.querySelectorAll('input[name="influence"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('stakeholderInfluence').value = e.target.value;
                this.clearError('influence');
            });
        });

        // Radio buttons for domain
        document.querySelectorAll('input[name="domain"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('stakeholderDomain').value = e.target.value;
                this.clearError('domain');
            });
        });

        // Real-time validation
        document.getElementById('stakeholderName').addEventListener('blur', () => {
            this.validateField('name');
        });

        document.getElementById('stakeholderRole').addEventListener('blur', () => {
            this.validateField('role');
        });

        // Import modal
        const importModal = document.getElementById('importModal');
        const closeImportModal = document.getElementById('closeImportModal');

        closeImportModal.addEventListener('click', () => this.closeImportModal());
        
        importModal.addEventListener('click', (e) => {
            if (e.target === importModal) {
                this.closeImportModal();
            }
        });
    },

    /**
     * Select number value
     */
    selectNumber(field, value) {
        // Update hidden input
        const inputId = field === 'power' ? 'stakeholderPower' : 'stakeholderInterest';
        document.getElementById(inputId).value = value;

        // Update button states
        document.querySelectorAll(`.number-btn[data-field="${field}"]`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === value);
        });

        // Clear error
        this.clearError(field);
    },

    /**
     * Validate single field
     */
    validateField(field) {
        let isValid = true;
        let errorMsg = '';

        switch (field) {
            case 'name':
                const name = document.getElementById('stakeholderName').value.trim();
                if (!name) {
                    isValid = false;
                    errorMsg = 'Le nom est requis';
                } else if (name.length < 2) {
                    isValid = false;
                    errorMsg = 'Le nom doit contenir au moins 2 caractères';
                }
                break;

            case 'role':
                const role = document.getElementById('stakeholderRole').value.trim();
                if (!role) {
                    isValid = false;
                    errorMsg = 'Le rôle est requis';
                }
                break;

            case 'power':
                const power = document.getElementById('stakeholderPower').value;
                if (!power) {
                    isValid = false;
                    errorMsg = 'Sélectionnez un niveau de pouvoir';
                }
                break;

            case 'interest':
                const interest = document.getElementById('stakeholderInterest').value;
                if (!interest) {
                    isValid = false;
                    errorMsg = 'Sélectionnez un niveau d\'intérêt';
                }
                break;

            case 'influence':
                const influence = document.getElementById('stakeholderInfluence').value;
                if (!influence) {
                    isValid = false;
                    errorMsg = 'Sélectionnez un niveau d\'influence';
                }
                break;

            case 'domain':
                const domain = document.getElementById('stakeholderDomain').value;
                if (!domain) {
                    isValid = false;
                    errorMsg = 'Sélectionnez un domaine';
                }
                break;
        }

        // Display error
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errorMsg;
        }

        // Update input style
        const inputElement = document.getElementById(`stakeholder${field.charAt(0).toUpperCase() + field.slice(1)}`);
        if (inputElement && inputElement.type !== 'hidden') {
            inputElement.classList.toggle('error', !isValid);
            inputElement.classList.toggle('success', isValid && inputElement.value);
        }

        return isValid;
    },

    /**
     * Clear error for field
     */
    clearError(field) {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }

        const inputElement = document.getElementById(`stakeholder${field.charAt(0).toUpperCase() + field.slice(1)}`);
        if (inputElement && inputElement.type !== 'hidden') {
            inputElement.classList.remove('error');
        }
    },

    /**
     * Validate entire form
     */
    validateForm() {
        const fields = ['name', 'role', 'power', 'interest', 'influence', 'domain'];
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Open stakeholder modal (add or edit)
     */
    openStakeholderModal(stakeholder = null) {
        this.currentStakeholder = stakeholder;
        const modal = document.getElementById('stakeholderModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('stakeholderForm');

        // Reset form and errors
        form.reset();
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.classList.remove('error', 'success');
        });

        if (stakeholder) {
            // Edit mode
            title.textContent = '✏️ Modifier un Stakeholder';
            document.getElementById('stakeholderId').value = stakeholder.id;
            document.getElementById('stakeholderName').value = stakeholder.name;
            document.getElementById('stakeholderRole').value = stakeholder.role;
            
            // Set power
            document.getElementById('stakeholderPower').value = stakeholder.power;
            this.selectNumber('power', stakeholder.power.toString());
            
            // Set interest
            document.getElementById('stakeholderInterest').value = stakeholder.interest;
            this.selectNumber('interest', stakeholder.interest.toString());
            
            // Set influence
            document.getElementById('stakeholderInfluence').value = stakeholder.influence;
            const influenceRadio = document.querySelector(`input[name="influence"][value="${stakeholder.influence}"]`);
            if (influenceRadio) influenceRadio.checked = true;
            
            // Set domain
            document.getElementById('stakeholderDomain').value = stakeholder.domain;
            const domainRadio = document.querySelector(`input[name="domain"][value="${stakeholder.domain}"]`);
            if (domainRadio) domainRadio.checked = true;
            
            document.getElementById('stakeholderNotes').value = stakeholder.notes || '';
        } else {
            // Add mode
            title.textContent = '➕ Ajouter un Stakeholder';
            document.getElementById('stakeholderId').value = '';
        }

        modal.classList.add('active');
    },

    /**
     * Close stakeholder modal
     */
    closeStakeholderModal() {
        const modal = document.getElementById('stakeholderModal');
        modal.classList.remove('active');
        this.currentStakeholder = null;
    },

    /**
     * Save stakeholder
     */
    saveStakeholder() {
        const id = document.getElementById('stakeholderId').value;
        const data = {
            name: document.getElementById('stakeholderName').value.trim(),
            role: document.getElementById('stakeholderRole').value.trim(),
            power: parseInt(document.getElementById('stakeholderPower').value),
            interest: parseInt(document.getElementById('stakeholderInterest').value),
            influence: document.getElementById('stakeholderInfluence').value,
            domain: document.getElementById('stakeholderDomain').value,
            notes: document.getElementById('stakeholderNotes').value.trim()
        };

        if (id) {
            // Update existing
            DataManager.updateStakeholder(id, data);
            Utils.showNotification('✅ Stakeholder mis à jour', 'success');
        } else {
            // Add new
            DataManager.addStakeholder(data);
            Utils.showNotification('✅ Stakeholder ajouté', 'success');
        }

        this.closeStakeholderModal();
        App.refreshAllViews();
    },

    /**
     * Open import modal
     */
    openImportModal() {
        const modal = document.getElementById('importModal');
        modal.classList.add('active');
    },

    /**
     * Close import modal
     */
    closeImportModal() {
        const modal = document.getElementById('importModal');
        modal.classList.remove('active');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
}
