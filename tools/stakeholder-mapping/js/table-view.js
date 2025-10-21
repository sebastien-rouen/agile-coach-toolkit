/* ===================================
   TABLE VIEW
   =================================== */

const TableView = {
    /**
     * Render table view
     */
    render() {
        const tbody = document.getElementById('tableBody');
        const stakeholders = DataManager.getAllStakeholders();

        if (stakeholders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="table-empty">
                        <div class="table-empty-icon">📋</div>
                        <p>Aucun stakeholder ajouté</p>
                        <p style="font-size: 0.9rem; color: var(--text-tertiary);">
                            Cliquez sur "+ Stakeholder" pour commencer
                        </p>
                    </td>
                </tr>
            `;
            return;
        }

        const influenceLabels = {
            vital: 'Vital',
            necessary: 'Nécessaire',
            good: 'Bon',
            courtesy: 'Courtoisie'
        };

        const domainLabels = {
            governance: 'Gouvernance',
            customer: 'Client',
            provider: 'Fournisseur',
            influencer: 'Influenceur'
        };

        tbody.innerHTML = stakeholders.map(s => `
            <tr>
                <td>
                    <div class="stakeholder-name">${Utils.sanitize(s.name)}</div>
                </td>
                <td>
                    <div class="stakeholder-role">${Utils.sanitize(s.role)}</div>
                </td>
                <td>
                    <span class="power-badge level-${s.power}">${s.power}/5</span>
                </td>
                <td>
                    <span class="interest-badge level-${s.interest}">${s.interest}/5</span>
                </td>
                <td>
                    <span class="influence-badge ${s.influence}">
                        ${influenceLabels[s.influence]}
                    </span>
                </td>
                <td>
                    <span class="domain-badge ${s.domain}">
                        ${domainLabels[s.domain]}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table-action edit" onclick="TableView.editStakeholder('${s.id}')" title="Modifier">
                            ✏️
                        </button>
                        <button class="btn-table-action delete" onclick="TableView.deleteStakeholder('${s.id}')" title="Supprimer">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    /**
     * Edit stakeholder
     */
    editStakeholder(id) {
        const stakeholder = DataManager.getStakeholder(id);
        if (stakeholder) {
            ModalManager.openStakeholderModal(stakeholder);
        }
    },

    /**
     * Delete stakeholder
     */
    deleteStakeholder(id) {
        const stakeholder = DataManager.getStakeholder(id);
        if (stakeholder && Utils.confirm(`Supprimer ${stakeholder.name} ?`)) {
            DataManager.deleteStakeholder(id);
            App.refreshAllViews();
            Utils.showNotification('Stakeholder supprimé', 'success');
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableView;
}
