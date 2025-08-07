/**
 * Tools Grid Component
 * Handles rendering, filtering, and search functionality for tools
 */

class ToolsGrid {
  constructor(container, tools = []) {
    this.container = container;
    this.tools = tools;
    this.filteredTools = [...tools];
    this.currentFilters = {
      search: '',
      status: 'all',
      category: 'all'
    };
    
    // DOM elements
    this.searchInput = null;
    this.statusFilter = null;
    this.categoryFilter = null;
    this.toolsContainer = null;
    this.toolsCount = null;
    
    this.init();
  }

  init() {
    this.setupDOMReferences();
    this.setupEventListeners();
    this.render();
    this.updateCounts();
  }

  setupDOMReferences() {
    // Get filter elements
    this.searchInput = document.getElementById('tools-search');
    this.statusFilter = document.getElementById('status-filter');
    this.categoryFilter = document.getElementById('category-filter');
    
    // Get tools container
    this.toolsContainer = document.querySelector('.tools-grid');
    
    // Get count elements
    this.toolsCount = {
      total: document.getElementById('tools-total'),
      stable: document.getElementById('tools-stable'),
      beta: document.getElementById('tools-beta'),
      alpha: document.getElementById('tools-alpha')
    };
  }

  setupEventListeners() {
    // Search input with debouncing
    if (this.searchInput) {
      let searchTimeout;
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 300);
      });
    }

    // Status filter
    if (this.statusFilter) {
      this.statusFilter.addEventListener('change', (e) => {
        this.handleStatusFilter(e.target.value);
      });
    }

    // Category filter (if it exists)
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', (e) => {
        this.handleCategoryFilter(e.target.value);
      });
    }

    // Tool info buttons
    this.setupToolInfoListeners();
  }

  setupToolInfoListeners() {
    // Delegate event handling for tool info buttons
    if (this.toolsContainer) {
      this.toolsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tool-info-btn')) {
          e.preventDefault();
          const toolCard = e.target.closest('.tool-card');
          const toolId = toolCard?.dataset.toolId;
          if (toolId) {
            this.showToolInfo(toolId);
          }
        }
      });
    }
  }

  handleSearch(query) {
    this.currentFilters.search = query.toLowerCase().trim();
    this.applyFilters();
  }

  handleStatusFilter(status) {
    this.currentFilters.status = status;
    this.applyFilters();
  }

  handleCategoryFilter(category) {
    this.currentFilters.category = category;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTools = this.tools.filter(tool => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search;
        const searchableText = [
          tool.name,
          tool.description,
          tool.longDescription,
          ...tool.tags,
          tool.category
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Status filter
      if (this.currentFilters.status !== 'all' && tool.status !== this.currentFilters.status) {
        return false;
      }

      // Category filter
      if (this.currentFilters.category !== 'all' && tool.category !== this.currentFilters.category) {
        return false;
      }

      return true;
    });

    this.render();
    this.updateCounts();
    this.announceFilterResults();
  }

  render() {
    if (!this.toolsContainer) return;

    // Clear existing content
    this.toolsContainer.innerHTML = '';

    if (this.filteredTools.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Render filtered tools
    this.filteredTools.forEach(tool => {
      const toolCard = this.createToolCard(tool);
      this.toolsContainer.appendChild(toolCard);
    });
  }

  createToolCard(tool) {
    const article = document.createElement('article');
    article.className = 'tool-card';
    article.dataset.status = tool.status;
    article.dataset.category = tool.category;
    article.dataset.toolId = tool.id;

    const statusInfo = TOOL_STATUS[tool.status] || TOOL_STATUS.alpha;
    const isAvailable = tool.demoUrl && tool.status === 'stable';

    article.innerHTML = `
      <div class="tool-header">
        <div class="tool-icon" aria-hidden="true">${tool.icon}</div>
        <div class="tool-meta">
          <h3 class="tool-title">${tool.name}</h3>
          <span class="tool-status tool-status-${tool.status}" 
                aria-label="Statut: ${statusInfo.label}"
                title="${statusInfo.description}">
            ${statusInfo.label}
          </span>
        </div>
      </div>
      
      <p class="tool-description">${tool.description}</p>
      
      <div class="tool-features">
        ${tool.tags.slice(0, 3).map(tag => 
          `<span class="tool-tag">${this.formatTag(tag)}</span>`
        ).join('')}
        ${tool.tags.length > 3 ? `<span class="tool-tag-more">+${tool.tags.length - 3}</span>` : ''}
      </div>
      
      <div class="tool-actions">
        ${isAvailable ? `
          <a href="${tool.demoUrl}" 
             class="btn btn-primary btn-sm" 
             target="_blank"
             rel="noopener"
             aria-label="Lancer ${tool.name}">
            🚀 Lancer l'outil
          </a>
        ` : `
          <button class="btn btn-secondary btn-sm" disabled>
            ${tool.status === 'beta' ? '🚧 Bientôt disponible' : '⚠️ En développement'}
          </button>
        `}
        <button class="btn btn-ghost btn-sm tool-info-btn" 
                aria-label="Plus d'informations sur ${tool.name}"
                title="Voir les détails">
          ℹ️ Info
        </button>
      </div>
    `;

    return article;
  }

  formatTag(tag) {
    return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'tools-empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-content">
        <div class="empty-state-icon" aria-hidden="true">🔍</div>
        <h3 class="empty-state-title">Aucun outil trouvé</h3>
        <p class="empty-state-description">
          Essayez de modifier vos critères de recherche ou de filtrage.
        </p>
        <button class="btn btn-secondary btn-sm" onclick="toolsGrid.clearFilters()">
          🔄 Réinitialiser les filtres
        </button>
      </div>
    `;
    this.toolsContainer.appendChild(emptyState);
  }

  updateCounts() {
    const counts = this.getToolCounts();
    
    if (this.toolsCount.total) {
      this.toolsCount.total.textContent = this.filteredTools.length;
    }
    
    if (this.toolsCount.stable) {
      this.toolsCount.stable.textContent = counts.stable;
    }
    
    if (this.toolsCount.beta) {
      this.toolsCount.beta.textContent = counts.beta;
    }
    
    if (this.toolsCount.alpha) {
      this.toolsCount.alpha.textContent = counts.alpha;
    }
  }

  getToolCounts() {
    return this.filteredTools.reduce((counts, tool) => {
      counts[tool.status] = (counts[tool.status] || 0) + 1;
      return counts;
    }, { stable: 0, beta: 0, alpha: 0 });
  }

  announceFilterResults() {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('tools-filter-results');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'tools-filter-results';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const count = this.filteredTools.length;
    const message = count === 0 
      ? 'Aucun outil ne correspond aux critères de recherche'
      : `${count} outil${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
    
    liveRegion.textContent = message;
  }

  showToolInfo(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;

    // Use the new interactive components system if available
    if (window.interactiveComponents) {
      // Let the interactive components handle the modal
      return;
    }

    // Fallback to original modal system
    const modal = this.createToolInfoModal(tool);
    document.body.appendChild(modal);
    
    // Show modal
    modal.classList.add('modal-open');
    
    // Focus management
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  createToolInfoModal(tool) {
    const modal = document.createElement('div');
    modal.className = 'modal tool-info-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'tool-modal-title');
    modal.setAttribute('aria-describedby', 'tool-modal-description');

    const statusInfo = TOOL_STATUS[tool.status] || TOOL_STATUS.alpha;
    const categoryInfo = TOOL_CATEGORIES[tool.category] || {};

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="tool-modal-header">
            <div class="tool-modal-icon">${tool.icon}</div>
            <div>
              <h3 id="tool-modal-title" class="tool-modal-title">${tool.name}</h3>
              <div class="tool-modal-meta">
                <span class="tool-status tool-status-${tool.status}">${statusInfo.label}</span>
                <span class="tool-category">${categoryInfo.icon || ''} ${categoryInfo.label || tool.category}</span>
                <span class="tool-version">v${tool.version}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" aria-label="Fermer la fenêtre d'information">&times;</button>
        </div>
        
        <div class="modal-body">
          <p id="tool-modal-description" class="tool-long-description">
            ${tool.longDescription}
          </p>
          
          <div class="tool-features-section">
            <h4>✨ Fonctionnalités principales</h4>
            <ul class="tool-features-list">
              ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <div class="tool-tags-section">
            <h4>🏷️ Tags</h4>
            <div class="tool-tags-list">
              ${tool.tags.map(tag => `<span class="tool-tag">${this.formatTag(tag)}</span>`).join('')}
            </div>
          </div>
          
          <div class="tool-requirements-section">
            <h4>📋 Prérequis</h4>
            <ul class="tool-requirements-list">
              ${tool.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
          </div>
          
          <div class="tool-meta-section">
            <div class="tool-meta-item">
              <strong>Dernière mise à jour:</strong>
              <time datetime="${tool.lastUpdated.toISOString()}">
                ${tool.lastUpdated.toLocaleDateString('fr-FR')}
              </time>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          ${tool.demoUrl && tool.status === 'stable' ? `
            <a href="${tool.demoUrl}" 
               class="btn btn-primary" 
               target="_blank"
               rel="noopener">
              🚀 Lancer l'outil
            </a>
          ` : ''}
          <button class="btn btn-secondary modal-close-btn">
            Fermer
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.closeToolInfoModal(modal));
    });

    // Close on escape key
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeToolInfoModal(modal);
      }
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeToolInfoModal(modal);
      }
    });

    return modal;
  }

  closeToolInfoModal(modal) {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // Remove modal after animation
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }

  clearFilters() {
    this.currentFilters = {
      search: '',
      status: 'all',
      category: 'all'
    };

    // Reset form elements
    if (this.searchInput) this.searchInput.value = '';
    if (this.statusFilter) this.statusFilter.value = 'all';
    if (this.categoryFilter) this.categoryFilter.value = 'all';

    this.applyFilters();
  }

  // Public method to add category filter if needed
  addCategoryFilter() {
    const filterGroup = document.querySelector('.tools-filter');
    if (!filterGroup || document.getElementById('category-filter')) return;

    const categoryFilterHTML = `
      <div class="filter-group">
        <label for="category-filter" class="filter-label">Catégorie</label>
        <select id="category-filter" class="filter-select">
          <option value="all">Toutes les catégories</option>
          ${Object.entries(TOOL_CATEGORIES).map(([key, category]) => 
            `<option value="${key}">${category.icon} ${category.label}</option>`
          ).join('')}
        </select>
      </div>
    `;

    filterGroup.insertAdjacentHTML('beforeend', categoryFilterHTML);
    this.categoryFilter = document.getElementById('category-filter');
    
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', (e) => {
        this.handleCategoryFilter(e.target.value);
      });
    }
  }

  // Public method to get filtered tools
  getFilteredTools() {
    return this.filteredTools;
  }

  // Public method to get current filters
  getCurrentFilters() {
    return { ...this.currentFilters };
  }

  // Public method to set tools data
  setTools(tools) {
    this.tools = tools;
    this.filteredTools = [...tools];
    this.render();
    this.updateCounts();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToolsGrid;
}