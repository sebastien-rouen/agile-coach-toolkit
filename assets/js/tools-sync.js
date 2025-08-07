/**
 * Tools Synchronization System
 * Synchronise les données entre le site principal et les outils individuels
 */

class ToolsSync {
  constructor() {
    this.storageKey = 'agile-toolkit-sync';
    this.syncInterval = 30000; // 30 secondes
    this.init();
  }

  init() {
    this.loadSyncData();
    this.startSyncInterval();
    this.setupEventListeners();
  }

  loadSyncData() {
    try {
      const syncData = localStorage.getItem(this.storageKey);
      this.syncData = syncData ? JSON.parse(syncData) : this.getDefaultSyncData();
    } catch (error) {
      console.warn('Erreur lors du chargement des données de sync:', error);
      this.syncData = this.getDefaultSyncData();
    }
  }

  getDefaultSyncData() {
    return {
      lastSync: new Date().toISOString(),
      toolsUsage: {},
      userPreferences: {
        theme: 'light',
        favoriteTools: [],
        recentTools: []
      },
      sharedData: {}
    };
  }

  saveSyncData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.syncData));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des données de sync:', error);
    }
  }

  // Synchroniser l'usage d'un outil
  trackToolUsage(toolId, data = {}) {
    if (!this.syncData.toolsUsage[toolId]) {
      this.syncData.toolsUsage[toolId] = {
        visits: 0,
        lastVisit: null,
        totalTime: 0,
        features: {}
      };
    }

    const toolUsage = this.syncData.toolsUsage[toolId];
    toolUsage.visits++;
    toolUsage.lastVisit = new Date().toISOString();
    
    // Ajouter aux outils récents
    this.addToRecentTools(toolId);
    
    // Merger les données spécifiques
    Object.assign(toolUsage, data);
    
    this.saveSyncData();
    this.notifyToolUsage(toolId, toolUsage);
  }

  addToRecentTools(toolId) {
    const recent = this.syncData.userPreferences.recentTools;
    const index = recent.indexOf(toolId);
    
    if (index > -1) {
      recent.splice(index, 1);
    }
    
    recent.unshift(toolId);
    
    // Garder seulement les 5 derniers
    if (recent.length > 5) {
      recent.splice(5);
    }
  }

  // Partager des données entre outils
  shareData(key, data, toolId = null) {
    if (!this.syncData.sharedData[key]) {
      this.syncData.sharedData[key] = {};
    }
    
    this.syncData.sharedData[key] = {
      data: data,
      timestamp: new Date().toISOString(),
      source: toolId || this.getCurrentTool(),
      version: 1
    };
    
    this.saveSyncData();
    this.notifyDataShared(key, data);
  }

  // Récupérer des données partagées
  getSharedData(key) {
    return this.syncData.sharedData[key]?.data || null;
  }

  // Synchroniser les préférences utilisateur
  syncUserPreferences(preferences) {
    Object.assign(this.syncData.userPreferences, preferences);
    this.saveSyncData();
    this.notifyPreferencesChanged(preferences);
  }

  getUserPreferences() {
    return { ...this.syncData.userPreferences };
  }

  // Obtenir les statistiques d'usage
  getUsageStats() {
    const stats = {
      totalVisits: 0,
      toolsCount: Object.keys(this.syncData.toolsUsage).length,
      mostUsedTool: null,
      recentTools: this.syncData.userPreferences.recentTools,
      favoriteTools: this.syncData.userPreferences.favoriteTools
    };

    let maxVisits = 0;
    for (const [toolId, usage] of Object.entries(this.syncData.toolsUsage)) {
      stats.totalVisits += usage.visits;
      if (usage.visits > maxVisits) {
        maxVisits = usage.visits;
        stats.mostUsedTool = toolId;
      }
    }

    return stats;
  }

  // Exporter toutes les données
  exportData() {
    const exportData = {
      ...this.syncData,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agile-toolkit-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importer des données
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Valider la structure
          if (this.validateImportData(importedData)) {
            this.syncData = importedData;
            this.saveSyncData();
            resolve(importedData);
          } else {
            reject(new Error('Format de données invalide'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }

  validateImportData(data) {
    return data && 
           typeof data === 'object' &&
           data.toolsUsage &&
           data.userPreferences &&
           data.sharedData;
  }

  // Nettoyer les anciennes données
  cleanup() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Nettoyer les données partagées anciennes
    for (const [key, data] of Object.entries(this.syncData.sharedData)) {
      const dataDate = new Date(data.timestamp);
      if (dataDate < thirtyDaysAgo) {
        delete this.syncData.sharedData[key];
      }
    }
    
    this.saveSyncData();
  }

  // Démarrer la synchronisation périodique
  startSyncInterval() {
    setInterval(() => {
      this.cleanup();
      this.syncData.lastSync = new Date().toISOString();
      this.saveSyncData();
    }, this.syncInterval);
  }

  // Configuration des événements
  setupEventListeners() {
    // Écouter les changements de thème
    document.addEventListener('themeChanged', (event) => {
      this.syncUserPreferences({ theme: event.detail.theme });
    });

    // Écouter la fermeture de la page
    window.addEventListener('beforeunload', () => {
      this.saveSyncData();
    });
  }

  // Notifications d'événements
  notifyToolUsage(toolId, usage) {
    window.dispatchEvent(new CustomEvent('toolUsageUpdated', {
      detail: { toolId, usage }
    }));
  }

  notifyDataShared(key, data) {
    window.dispatchEvent(new CustomEvent('dataShared', {
      detail: { key, data }
    }));
  }

  notifyPreferencesChanged(preferences) {
    window.dispatchEvent(new CustomEvent('preferencesChanged', {
      detail: preferences
    }));
  }

  getCurrentTool() {
    const path = window.location.pathname;
    const toolMatch = path.match(/\/tools\/([^\/]+)/);
    return toolMatch ? toolMatch[1] : 'main-site';
  }

  // API publique pour les outils
  static getInstance() {
    if (!window._toolsSyncInstance) {
      window._toolsSyncInstance = new ToolsSync();
    }
    return window._toolsSyncInstance;
  }
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  window.ToolsSync = ToolsSync.getInstance();
});

// Export pour usage en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToolsSync;
}

// API globale simplifiée
if (typeof window !== 'undefined') {
  window.agileToolkit = {
    trackUsage: (toolId, data) => ToolsSync.getInstance().trackToolUsage(toolId, data),
    shareData: (key, data) => ToolsSync.getInstance().shareData(key, data),
    getData: (key) => ToolsSync.getInstance().getSharedData(key),
    getStats: () => ToolsSync.getInstance().getUsageStats(),
    exportData: () => ToolsSync.getInstance().exportData(),
    importData: (file) => ToolsSync.getInstance().importData(file)
  };
}