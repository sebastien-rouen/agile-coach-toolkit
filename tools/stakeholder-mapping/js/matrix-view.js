/* ===================================
   MATRIX VIEW (Power/Interest Grid)
   =================================== */

const MatrixView = {
    /**
     * Render matrix view
     */
    render() {
        const stakeholders = DataManager.getAllStakeholders();

        // Clear all quadrants
        document.querySelectorAll('.quadrant-stakeholders').forEach(el => {
            el.innerHTML = '';
        });

        if (stakeholders.length === 0) {
            this.showEmptyState();
            return;
        }

        // Group stakeholders by quadrant
        const grouped = {
            'high-high': [],
            'high-low': [],
            'low-high': [],
            'low-low': []
        };

        stakeholders.forEach(s => {
            const quadrant = Utils.getQuadrant(s.power, s.interest);
            grouped[quadrant].push(s);
        });

        // Render each quadrant
        Object.keys(grouped).forEach(quadrant => {
            this.renderQuadrant(quadrant, grouped[quadrant]);
        });
    },

    /**
     * Render stakeholders in a quadrant
     */
    renderQuadrant(quadrant, stakeholders) {
        const container = document.querySelector(`[data-quadrant="${quadrant}"]`);

        if (stakeholders.length === 0) {
            container.innerHTML = '<div class="quadrant-empty">Aucun stakeholder</div>';
            return;
        }

        container.innerHTML = stakeholders.map(s => `
            <div class="matrix-stakeholder-card ${s.domain}" 
                 draggable="true"
                 data-id="${s.id}"
                 onclick="MatrixView.onStakeholderClick('${s.id}')">
                <div class="matrix-card-name">${Utils.sanitize(s.name)}</div>
                <div class="matrix-card-role">${Utils.sanitize(s.role)}</div>
                <div class="matrix-card-metrics">
                    <div class="matrix-card-metric">
                        <span>⚡</span>
                        <span>${s.power}</span>
                    </div>
                    <div class="matrix-card-metric">
                        <span>🎯</span>
                        <span>${s.interest}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add drag & drop event listeners
        this.initDragAndDrop();
    },

    /**
     * Initialize drag and drop
     */
    initDragAndDrop() {
        // Remove existing listeners to avoid duplicates
        const cards = document.querySelectorAll('.matrix-stakeholder-card');
        const quadrants = document.querySelectorAll('.quadrant-stakeholders');

        // Remove old listeners by cloning nodes
        quadrants.forEach(quadrant => {
            const newQuadrant = quadrant.cloneNode(true);
            quadrant.parentNode.replaceChild(newQuadrant, quadrant);
        });

        // Re-select after cloning
        const newQuadrants = document.querySelectorAll('.quadrant-stakeholders');
        const newCards = document.querySelectorAll('.matrix-stakeholder-card');

        newCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('stakeholder-id', card.dataset.id);
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
            });
        });

        newQuadrants.forEach(quadrant => {
            quadrant.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                quadrant.classList.add('drag-over');
            });

            quadrant.addEventListener('dragleave', (e) => {
                if (!quadrant.contains(e.relatedTarget)) {
                    quadrant.classList.remove('drag-over');
                }
            });

            quadrant.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                quadrant.classList.remove('drag-over');

                const stakeholderId = e.dataTransfer.getData('stakeholder-id');
                const targetQuadrant = quadrant.dataset.quadrant;

                if (stakeholderId && targetQuadrant) {
                    this.updateStakeholderQuadrant(stakeholderId, targetQuadrant);
                }
            });
        });
    },

    /**
     * Update stakeholder based on quadrant
     */
    updateStakeholderQuadrant(stakeholderId, quadrant) {
        const stakeholder = DataManager.getStakeholder(stakeholderId);
        if (!stakeholder) return;

        // Map quadrant to power/interest values
        const quadrantMap = {
            'high-high': { power: 5, interest: 5 },
            'high-low': { power: 5, interest: 2 },
            'low-high': { power: 2, interest: 5 },
            'low-low': { power: 2, interest: 2 }
        };

        const newValues = quadrantMap[quadrant];
        if (newValues) {
            DataManager.updateStakeholder(stakeholderId, newValues);
            App.refreshAllViews();
            Utils.showNotification(`${stakeholder.name} déplacé`, 'success');
        }
    },

    /**
     * Handle stakeholder click
     */
    onStakeholderClick(id) {
        const stakeholder = DataManager.getStakeholder(id);
        if (stakeholder) {
            ModalManager.openStakeholderModal(stakeholder);
        }
    },

    /**
     * Show empty state
     */
    showEmptyState() {
        document.querySelectorAll('.quadrant-stakeholders').forEach(el => {
            el.innerHTML = '<div class="quadrant-empty">Aucun stakeholder</div>';
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixView;
}
