/* ===================================
   IMPORT/EXPORT FUNCTIONALITY
   =================================== */

const ImportExport = {
    /**
     * Initialize import/export events
     */
    init() {
        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToJSON();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            ModalManager.openImportModal();
        });

        // JSON file input
        const fileInput = document.getElementById('jsonFile');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Display file name
                const fileNameDisplay = document.getElementById('fileNameDisplay');
                fileNameDisplay.textContent = `📄 ${file.name}`;
                
                // Handle import
                this.handleJSONImport(file);
            }
        });
    },

    /**
     * Export to JSON
     */
    exportToJSON() {
        const data = DataManager.exportData();
        const filename = `stakeholder-mapping-${data.session.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
        Utils.downloadJSON(data, filename);
        Utils.showNotification('Export réussi', 'success');
    },

    /**
     * Handle JSON import
     */
    async handleJSONImport(file) {
        if (!file) return;

        try {
            const data = await Utils.readJSONFile(file);
            
            if (!Utils.confirm('Importer ces données ? Les données actuelles seront remplacées.')) {
                return;
            }

            DataManager.importData(data);
            App.refreshAllViews();
            App.updateSessionInfo();
            ModalManager.closeImportModal();
            Utils.showNotification('Import réussi', 'success');
        } catch (error) {
            Utils.showNotification(`Erreur d'import: ${error.message}`, 'error');
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImportExport;
}
