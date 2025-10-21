/**
 * Visualizer App - Application principale
 */

class VisualizerApp {
  constructor() {
    this.data = null;
    this.filteredData = null;
    this.renderer = new MindMapRenderer('mindmap');
    this.radarRenderer = new RadarRenderer('radar-svg');
    this.importManager = new ImportManager();
    this.currentView = 'mindmap';
    this.filters = {
      types: ['team', 'cross-team', 'individual'],
      statuses: ['danger', 'warning', 'success', 'neutral'],
      team: 'all'
    };
  }

  /**
   * Initialise l'application
   */
  init() {
    console.log('🎯 Visualizer App - Initialisation');

    // Initialiser l'import manager
    this.importManager.init();

    // Initialiser les filtres
    this.initFilters();

    // Charger les données depuis localStorage si disponibles
    this.loadFromStorage();

    // Exposer l'app globalement pour les fonctions onclick
    window.visualizerApp = this;
  }

  /**
   * Initialise les événements des filtres
   */
  initFilters() {
    // Filtres type
    document.querySelectorAll('[data-filter="type"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateFilters();
      });
    });

    // Filtres statut
    document.querySelectorAll('[data-filter="status"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateFilters();
      });
    });

    // Filtre équipe
    const teamFilter = document.getElementById('team-filter');
    if (teamFilter) {
      teamFilter.addEventListener('change', (e) => {
        this.filters.team = e.target.value;
        this.applyFilters();
      });
    }
  }

  /**
   * Met à jour les filtres actifs
   */
  updateFilters() {
    // Types
    this.filters.types = Array.from(
      document.querySelectorAll('[data-filter="type"]:checked')
    ).map(cb => cb.value);

    // Statuts
    this.filters.statuses = Array.from(
      document.querySelectorAll('[data-filter="status"]:checked')
    ).map(cb => cb.value);

    this.applyFilters();
  }

  /**
   * Applique les filtres aux données
   */
  applyFilters() {
    if (!this.data) return;

    // Filtrer les sujets
    let filteredSubjects = this.data.subjects.filter(subject => {
      // Filtre type
      if (!this.filters.types.includes(subject.type)) {
        return false;
      }

      // Filtre statut
      const status = AlertEngine.getAlertStatus(subject);
      if (!this.filters.statuses.includes(status)) {
        return false;
      }

      // Filtre équipe
      if (this.filters.team !== 'all') {
        if (!subject.teams || !subject.teams.includes(this.filters.team)) {
          return false;
        }
      }

      return true;
    });

    // Créer les données filtrées
    this.filteredData = {
      teams: this.data.teams,
      subjects: filteredSubjects
    };

    // Re-render
    this.render();
  }

  /**
   * Charge les données
   * @param {Object} data - Données structurées
   */
  loadData(data) {
    console.log('📥 Chargement des données:', data);

    this.data = data;
    this.filteredData = data;

    // Sauvegarder dans localStorage
    this.saveToStorage();

    // Mettre à jour le dropdown des équipes
    this.updateTeamFilter();

    // Calculer et afficher les stats
    this.updateStats();

    // Render
    this.render();
  }

  /**
   * Met à jour le dropdown des équipes
   */
  updateTeamFilter() {
    const teamFilter = document.getElementById('team-filter');
    if (!teamFilter || !this.data) return;

    // Vider les options existantes (sauf "Toutes")
    teamFilter.innerHTML = '<option value="all">Toutes les équipes</option>';

    // Ajouter les équipes
    this.data.teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = `${team.icon || '👥'} ${team.name}`;
      teamFilter.appendChild(option);
    });
  }

  /**
   * Met à jour les statistiques
   */
  updateStats() {
    if (!this.data) return;

    const stats = AlertEngine.calculateStats(this.data.subjects);

    document.getElementById('stat-danger').textContent = stats.danger;
    document.getElementById('stat-warning').textContent = stats.warning;
    document.getElementById('stat-success').textContent = stats.success;
    document.getElementById('stat-dependencies').textContent = stats.dependencies;
  }

  /**
   * Render la vue active
   */
  render() {
    if (!this.filteredData) return;

    if (this.currentView === 'mindmap') {
      this.renderer.render(this.filteredData);
      // Recentrer automatiquement après le rendu
      this.renderer.autoFit();
    } else if (this.currentView === 'radar') {
      this.radarRenderer.render(this.filteredData);
    }
  }

  /**
   * Change la vue active
   * @param {string} view - Type de vue ('mindmap' ou 'radar')
   */
  switchView(view) {
    this.currentView = view;

    // Mettre à jour les boutons
    document.getElementById('btn-view-mindmap').classList.toggle('active', view === 'mindmap');
    document.getElementById('btn-view-radar').classList.toggle('active', view === 'radar');

    // Afficher/masquer les vues
    document.getElementById('mindmap').style.display = view === 'mindmap' ? 'block' : 'none';
    document.getElementById('radar-view').classList.toggle('active', view === 'radar');

    // Render la vue active
    this.render();
  }

  /**
   * Sauvegarde dans localStorage
   */
  saveToStorage() {
    if (this.data) {
      localStorage.setItem('visualizer-data', JSON.stringify(this.data));
    }
  }

  /**
   * Charge depuis localStorage
   */
  loadFromStorage() {
    const stored = localStorage.getItem('visualizer-data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.loadData(data);
        console.log('✅ Données chargées depuis localStorage');
      } catch (error) {
        console.error('❌ Erreur chargement localStorage:', error);
      }
    }
  }

  /**
   * Exporte les données
   */
  exportData() {
    if (!this.data) {
      alert('❌ Aucune donnée à exporter');
      return;
    }

    // Export YAML
    const yaml = jsyaml.dump(this.data);
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visualizer-export-${new Date().toISOString().split('T')[0]}.yaml`;
    a.click();
    
    URL.revokeObjectURL(url);

    this.importManager.showNotification('✅ Export réussi', 'success');
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters() {
    // Réinitialiser les checkboxes
    document.querySelectorAll('[data-filter]').forEach(cb => {
      cb.checked = true;
    });

    // Réinitialiser le dropdown
    document.getElementById('team-filter').value = 'all';

    // Réinitialiser les filtres
    this.filters = {
      types: ['team', 'cross-team', 'individual'],
      statuses: ['danger', 'warning', 'success', 'neutral'],
      team: 'all'
    };

    this.applyFilters();
  }
}

// ================================================
// Fonctions globales pour les onclick
// ================================================

function showImportModal() {
  document.getElementById('import-modal').classList.add('active');
}

function closeImportModal() {
  document.getElementById('import-modal').classList.remove('active');
  window.visualizerApp.importManager.reset();
}

function switchTab(tabName) {
  // Désactiver tous les tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Activer le tab sélectionné
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

function processYAML() {
  window.visualizerApp.importManager.processYAML();
}

function importJIRA() {
  window.visualizerApp.importManager.importJIRA();
}

function loadDemo(demoType) {
  window.visualizerApp.importManager.loadDemo(demoType);
}

function exportData() {
  window.visualizerApp.exportData();
}

function resetFilters() {
  window.visualizerApp.resetFilters();
}

function zoomIn() {
  window.visualizerApp.renderer.zoomIn();
}

function zoomOut() {
  window.visualizerApp.renderer.zoomOut();
}

function fitView() {
  window.visualizerApp.renderer.fitView();
}

function expandAll() {
  window.visualizerApp.renderer.expandAll();
}

function collapseAll() {
  window.visualizerApp.renderer.collapseAll();
}

function closeInfoPanel() {
  document.getElementById('info-panel').style.display = 'none';
}

function switchView(view) {
  window.visualizerApp.switchView(view);
}

// ================================================
// Initialisation au chargement
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  const app = new VisualizerApp();
  app.init();
});
