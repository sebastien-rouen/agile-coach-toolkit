/**
 * MindMap Renderer - Génération de la visualisation avec Markmap
 */

class MindMapRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.svg = null;
    this.markmap = null;
    this.data = null;
  }

  /**
   * Initialise la MindMap avec les données
   * @param {Object} data - Données structurées (teams, subjects)
   */
  async render(data) {
    this.data = data;
    
    // Masquer l'état vide
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    // Générer le markdown
    const markdown = this.generateMarkdown(data);

    // Créer le SVG si nécessaire
    if (!this.svg) {
      this.container.innerHTML = '<svg id="mindmap-svg" style="width: 100%; height: 100%;"></svg>';
      this.svg = document.getElementById('mindmap-svg');
    }

    // Utiliser Markmap pour le rendu
    try {
      // Vérifier que les bibliothèques sont chargées
      if (typeof window.markmap === 'undefined') {
        console.error('Markmap non chargé. Vérifiez les scripts CDN.');
        return;
      }

      const { Markmap, loadCSS, loadJS } = window.markmap;
      const { Transformer } = window.markmap;
      
      const transformer = new Transformer();
      const { root, features } = transformer.transform(markdown);
      
      // Charger les assets nécessaires
      const { styles, scripts } = transformer.getUsedAssets(features);
      if (styles) loadCSS(styles);
      if (scripts) loadJS(scripts, { getMarkmap: () => window.markmap });
      
      if (!this.markmap) {
        this.markmap = Markmap.create(this.svg, {
          duration: 500,
          maxWidth: 300,
          color: (node) => {
            // Personnaliser les couleurs selon le niveau
            const colors = ['#0056b3', '#6c757d', '#28a745', '#17a2b8'];
            return colors[node.depth % colors.length];
          },
          // Activer le clic pour plier/déplier
          onClick: (node) => {
            this.handleNodeClick(node);
          }
        }, root);
      } else {
        this.markmap.setData(root);
        this.markmap.fit();
      }
    } catch (error) {
      console.error('Erreur lors du rendu Markmap:', error);
      this.container.innerHTML = '<div style="padding: 24px; text-align: center; color: #dc3545;">❌ Erreur lors du rendu de la MindMap. Vérifiez la console pour plus de détails.</div>';
    }
  }

  /**
   * Génère le markdown pour Markmap
   * @param {Object} data - Données structurées
   * @returns {string} - Markdown formaté
   */
  generateMarkdown(data) {
    let markdown = '# 📊 Source\n\n';

    // Grouper les sujets par équipe
    const subjectsByTeam = this.groupSubjectsByTeam(data);

    // Générer une branche par équipe
    data.teams.forEach(team => {
      const teamSubjects = subjectsByTeam[team.id] || [];
      const teamIcon = team.icon || '👥';
      
      markdown += `## ${teamIcon} ${team.name}\n\n`;

      if (teamSubjects.length === 0) {
        markdown += `- *Aucun sujet*\n\n`;
      } else {
        teamSubjects.forEach(subject => {
          const status = AlertEngine.getAlertStatus(subject);
          const emoji = AlertEngine.getStatusEmoji(status);
          const priorityEmoji = this.getPriorityEmoji(subject.priority);
          const deadlineEmoji = this.getDeadlineEmoji(subject.deadline);
          const typeLabel = this.getTypeLabel(subject.type);
          
          // Titre avec emojis de priorité et échéance
          markdown += `- ${emoji} ${priorityEmoji}${deadlineEmoji}**${subject.title}**\n`;
          
          // Badge type
          markdown += `  - 🏷️ *${typeLabel}*\n`;
          
          // Priorité avec badge
          if (subject.priority) {
            const priorityBadge = this.getPriorityBadge(subject.priority);
            markdown += `  - ${priorityBadge}\n`;
          }
          
          // Échéance avec badge
          if (subject.deadline) {
            const days = AlertEngine.getDaysUntilDeadline(subject.deadline);
            const daysLabel = days < 0 ? `⚠️ Retard de ${Math.abs(days)}j` : `${days}j restants`;
            markdown += `  - 📅 ${subject.deadline} *(${daysLabel})*\n`;
          }
          
          // Dépendances avec badge
          if (subject.dependencies && subject.dependencies.length > 0) {
            markdown += `  - 🔗 **${subject.dependencies.length} dépendance(s)**\n`;
            subject.dependencies.forEach(dep => {
              markdown += `    - 🔵 ${dep}\n`;
            });
          }
        });
        markdown += '\n';
      }
    });

    // Sujets sans équipe (individuels)
    const orphanSubjects = data.subjects.filter(s => 
      !s.teams || s.teams.length === 0 || s.type === 'individual'
    );

    if (orphanSubjects.length > 0) {
      markdown += `## 👤 Sujets Individuels\n\n`;
      orphanSubjects.forEach(subject => {
        const status = AlertEngine.getAlertStatus(subject);
        const emoji = AlertEngine.getStatusEmoji(status);
        const priorityEmoji = this.getPriorityEmoji(subject.priority);
        const deadlineEmoji = this.getDeadlineEmoji(subject.deadline);
        markdown += `- ${emoji} ${priorityEmoji}${deadlineEmoji}**${subject.title}**\n`;
      });
    }

    return markdown;
  }

  /**
   * Retourne l'emoji de priorité
   * @param {string} priority - Priorité du sujet
   * @returns {string} - Emoji
   */
  getPriorityEmoji(priority) {
    const emojis = {
      'critical': '🔥 ',
      'high': '⚡ ',
      'medium': '⭐ ',
      'low': '💡 '
    };
    return emojis[priority] || '';
  }

  /**
   * Retourne l'emoji d'échéance
   * @param {string} deadline - Date d'échéance
   * @returns {string} - Emoji
   */
  getDeadlineEmoji(deadline) {
    if (!deadline) return '';
    
    const days = AlertEngine.getDaysUntilDeadline(deadline);
    if (days < 0) return '⏰ ';
    if (days <= 3) return '⏱️ ';
    if (days <= 7) return '📆 ';
    return '';
  }

  /**
   * Retourne le badge de priorité
   * @param {string} priority - Priorité du sujet
   * @returns {string} - Badge formaté
   */
  getPriorityBadge(priority) {
    const badges = {
      'critical': '🔴 **CRITIQUE**',
      'high': '🟠 **HAUTE**',
      'medium': '🟡 **MOYENNE**',
      'low': '🟢 **BASSE**'
    };
    return badges[priority] || priority;
  }

  /**
   * Groupe les sujets par équipe
   * @param {Object} data - Données complètes
   * @returns {Object} - Map teamId => subjects[]
   */
  groupSubjectsByTeam(data) {
    const grouped = {};

    data.subjects.forEach(subject => {
      if (subject.teams && subject.teams.length > 0) {
        subject.teams.forEach(teamId => {
          if (!grouped[teamId]) {
            grouped[teamId] = [];
          }
          grouped[teamId].push(subject);
        });
      }
    });

    return grouped;
  }

  /**
   * Retourne le label du type de sujet
   * @param {string} type - Type du sujet
   * @returns {string} - Label
   */
  getTypeLabel(type) {
    const labels = {
      'team': 'Équipe',
      'cross-team': 'Cross-équipe',
      'individual': 'Individuel'
    };
    return labels[type] || type;
  }

  /**
   * Zoom avant
   */
  zoomIn() {
    if (this.markmap) {
      this.markmap.rescale(1.2);
    }
  }

  /**
   * Zoom arrière
   */
  zoomOut() {
    if (this.markmap) {
      this.markmap.rescale(0.8);
    }
  }

  /**
   * Ajuster la vue
   */
  fitView() {
    if (this.markmap) {
      this.markmap.fit();
    }
  }

  /**
   * Recentrer automatiquement la vue (appelé après chargement)
   */
  autoFit() {
    // Attendre que le rendu soit terminé
    setTimeout(() => {
      this.fitView();
    }, 300);
  }

  /**
   * Gère le clic sur un nœud
   * @param {Object} node - Nœud cliqué
   */
  handleNodeClick(node) {
    // Si c'est un nœud d'équipe (depth = 1), mettre à jour les filtres
    if (node.depth === 1 && window.visualizerApp) {
      // Extraire le nom de l'équipe du contenu
      const teamName = node.content.replace(/^[^\s]+\s/, ''); // Enlever l'emoji
      
      // Trouver l'ID de l'équipe correspondante
      const team = window.visualizerApp.data.teams.find(t => t.name === teamName);
      
      if (team) {
        // Mettre à jour le filtre d'équipe
        const teamFilter = document.getElementById('team-filter');
        if (teamFilter) {
          teamFilter.value = team.id;
          window.visualizerApp.filters.team = team.id;
          window.visualizerApp.applyFilters();
        }
      }
    }
    
    // Comportement par défaut de Markmap (plier/déplier)
    if (this.markmap) {
      this.markmap.handleClick(node);
    }
  }

  /**
   * Déplier tous les nœuds
   */
  expandAll() {
    if (this.markmap) {
      this.markmap.setData(this.markmap.state.data, { autoFit: true });
    }
  }

  /**
   * Replier tous les nœuds
   */
  collapseAll() {
    // Markmap ne supporte pas nativement le collapse all
    // On recharge les données
    if (this.data) {
      this.render(this.data);
    }
  }

  /**
   * Nettoie la MindMap
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.svg = null;
    this.markmap = null;
    this.data = null;
    
    // Réafficher l'état vide
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
      emptyState.style.display = 'block';
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MindMapRenderer;
}
