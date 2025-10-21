/**
 * Import Manager - Gestion des imports YAML, JIRA et démos
 */

class ImportManager {
  constructor() {
    this.currentFile = null;
  }

  /**
   * Initialise les événements d'import
   */
  init() {
    // Upload zone drag & drop
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    if (uploadZone) {
      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
      });

      uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
      });

      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFileSelect(files[0]);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelect(e.target.files[0]);
        }
      });
    }
  }

  /**
   * Gère la sélection d'un fichier
   * @param {File} file - Fichier sélectionné
   */
  handleFileSelect(file) {
    if (!file.name.match(/\.(yaml|yml)$/i)) {
      alert('❌ Format invalide. Veuillez sélectionner un fichier YAML (.yaml ou .yml)');
      return;
    }

    this.currentFile = file;

    // Afficher la prévisualisation
    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('upload-preview').style.display = 'block';
    document.getElementById('file-name').textContent = file.name;
  }

  /**
   * Traite le fichier YAML
   */
  async processYAML() {
    if (!this.currentFile) {
      alert('❌ Aucun fichier sélectionné');
      return;
    }

    try {
      const text = await this.currentFile.text();
      const data = jsyaml.load(text);

      // Valider la structure
      if (!data.teams || !data.subjects) {
        throw new Error('Structure YAML invalide. Attendu: teams[] et subjects[]');
      }

      // Charger les données
      window.visualizerApp.loadData(data);

      // Fermer la modal
      closeImportModal();

      // Notification
      this.showNotification('✅ Données importées avec succès', 'success');

    } catch (error) {
      console.error('Erreur import YAML:', error);
      alert(`❌ Erreur lors de l'import:\n${error.message}`);
    }
  }

  /**
   * Charge une démo prédéfinie
   * @param {string} demoType - Type de démo ('safe', 'spotify', 'simple')
   */
  async loadDemo(demoType) {
    try {
      const response = await fetch(`assets/data/templates/demo-${demoType}.yaml`);
      
      if (!response.ok) {
        throw new Error(`Démo non trouvée: ${demoType}`);
      }

      const text = await response.text();
      const data = jsyaml.load(text);

      // Charger les données
      window.visualizerApp.loadData(data);

      // Fermer la modal si ouverte
      const modal = document.getElementById('import-modal');
      if (modal && modal.classList.contains('active')) {
        closeImportModal();
      }

      // Notification
      this.showNotification(`✅ Démo "${demoType}" chargée`, 'success');

    } catch (error) {
      console.error('Erreur chargement démo:', error);
      alert(`❌ Erreur lors du chargement de la démo:\n${error.message}`);
    }
  }

  /**
   * Import depuis JIRA (à implémenter)
   */
  async importJIRA() {
    const url = document.getElementById('jira-url').value;
    const email = document.getElementById('jira-email').value;
    const token = document.getElementById('jira-token').value;
    const project = document.getElementById('jira-project').value;

    if (!url || !email || !token || !project) {
      alert('❌ Veuillez remplir tous les champs');
      return;
    }

    try {
      // TODO: Implémenter l'appel API JIRA
      // Pour l'instant, afficher un message
      alert('🚧 Fonctionnalité en cours de développement\n\nL\'import JIRA sera disponible dans la v1.1.0');

    } catch (error) {
      console.error('Erreur import JIRA:', error);
      alert(`❌ Erreur lors de l'import JIRA:\n${error.message}`);
    }
  }

  /**
   * Affiche une notification
   * @param {string} message - Message à afficher
   * @param {string} type - Type de notification ('success', 'error', 'info')
   */
  showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Retirer après 3 secondes
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Réinitialise l'état d'import
   */
  reset() {
    this.currentFile = null;
    document.getElementById('upload-zone').style.display = 'block';
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('file-input').value = '';
  }
}

// Animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImportManager;
}
