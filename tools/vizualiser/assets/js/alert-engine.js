/**
 * Alert Engine - Calcul automatique des codes couleurs d'alerte
 * Basé sur échéances, statuts et blocages
 */

class AlertEngine {
  static WARNING_DAYS = 7;
  static CRITICAL_DAYS = 0;

  /**
   * Calcule le statut d'alerte d'un sujet
   * @param {Object} subject - Sujet à analyser
   * @returns {string} - 'danger', 'warning', 'success', 'neutral'
   */
  static getAlertStatus(subject) {
    // Bloqué = toujours critique
    if (subject.status === 'blocked') {
      return 'danger';
    }

    // Pas d'échéance = neutre
    if (!subject.deadline) {
      return 'neutral';
    }

    const daysUntilDeadline = this.getDaysUntilDeadline(subject.deadline);

    // Échéance dépassée = critique
    if (daysUntilDeadline < this.CRITICAL_DAYS) {
      return 'danger';
    }

    // Échéance proche = warning
    if (daysUntilDeadline <= this.WARNING_DAYS) {
      return 'warning';
    }

    // Dans les temps = success
    return 'success';
  }

  /**
   * Calcule le nombre de jours jusqu'à l'échéance
   * @param {string} deadline - Date au format YYYY-MM-DD
   * @returns {number} - Nombre de jours (négatif si passé)
   */
  static getDaysUntilDeadline(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Retourne l'emoji correspondant au statut
   * @param {string} status - Statut d'alerte
   * @returns {string} - Emoji
   */
  static getStatusEmoji(status) {
    const emojis = {
      danger: '🔴',
      warning: '🟠',
      success: '🟢',
      neutral: '⚪',
      info: '🔵'
    };
    return emojis[status] || '⚪';
  }

  /**
   * Retourne le label du statut
   * @param {string} status - Statut d'alerte
   * @returns {string} - Label
   */
  static getStatusLabel(status) {
    const labels = {
      danger: 'Critique',
      warning: 'À surveiller',
      success: 'Dans les temps',
      neutral: 'Neutre',
      info: 'Dépendance'
    };
    return labels[status] || 'Inconnu';
  }

  /**
   * Calcule les statistiques globales
   * @param {Array} subjects - Liste des sujets
   * @returns {Object} - Stats par statut
   */
  static calculateStats(subjects) {
    const stats = {
      danger: 0,
      warning: 0,
      success: 0,
      neutral: 0,
      dependencies: 0
    };

    subjects.forEach(subject => {
      const status = this.getAlertStatus(subject);
      stats[status]++;
      
      if (subject.dependencies && subject.dependencies.length > 0) {
        stats.dependencies += subject.dependencies.length;
      }
    });

    return stats;
  }

  /**
   * Filtre les sujets par statut d'alerte
   * @param {Array} subjects - Liste des sujets
   * @param {Array} statuses - Statuts à inclure
   * @returns {Array} - Sujets filtrés
   */
  static filterByStatus(subjects, statuses) {
    return subjects.filter(subject => {
      const status = this.getAlertStatus(subject);
      return statuses.includes(status);
    });
  }

  /**
   * Trie les sujets par criticité
   * @param {Array} subjects - Liste des sujets
   * @returns {Array} - Sujets triés
   */
  static sortByCriticality(subjects) {
    const order = { danger: 0, warning: 1, success: 2, neutral: 3 };
    
    return [...subjects].sort((a, b) => {
      const statusA = this.getAlertStatus(a);
      const statusB = this.getAlertStatus(b);
      return order[statusA] - order[statusB];
    });
  }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlertEngine;
}
