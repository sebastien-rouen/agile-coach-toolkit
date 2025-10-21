/**
 * Mission Tracker - Timeline Manager
 * Gestion et affichage de la timeline des événements
 */

import { formatDate, groupBy } from '../../../../assets/js/shared/utils.js';

// ==========================================
// TIMELINE RENDERING
// ==========================================

/**
 * Render timeline complète
 */
export function renderTimeline(events, filters = {}) {
  if (!events || events.length === 0) {
    return renderEmptyTimeline();
  }
  
  // Filtrer les événements
  const filteredEvents = filterEvents(events, filters);
  
  if (filteredEvents.length === 0) {
    return renderEmptyTimeline('Aucun événement ne correspond aux filtres sélectionnés.');
  }
  
  // Grouper par mois
  const eventsByMonth = groupEventsByMonth(filteredEvents);
  
  return `
    <div class="timeline">
      ${Object.entries(eventsByMonth).map(([month, monthEvents]) => 
        renderMonthGroup(month, monthEvents)
      ).join('')}
    </div>
  `;
}

/**
 * Timeline vide
 */
function renderEmptyTimeline(message = 'Aucun événement pour le moment.') {
  return `
    <div class="timeline-empty">
      <div class="timeline-empty-icon">📅</div>
      <h3>Timeline vide</h3>
      <p>${message}</p>
      <sl-button variant="primary" onclick="missionTracker.openAddEventModal()">
        <sl-icon slot="prefix" name="plus-circle"></sl-icon>
        Ajouter le premier événement
      </sl-button>
    </div>
  `;
}

/**
 * Grouper événements par mois
 */
function groupEventsByMonth(events) {
  const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return sorted.reduce((acc, event) => {
    const date = new Date(event.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        label: monthLabel,
        events: []
      };
    }
    
    acc[monthKey].events.push(event);
    return acc;
  }, {});
}

/**
 * Render groupe de mois
 */
function renderMonthGroup(monthKey, monthData) {
  return `
    <div class="timeline-month-group" data-month="${monthKey}">
      <div class="timeline-month-label">${monthData.label}</div>
      ${monthData.events.map(renderTimelineEvent).join('')}
    </div>
  `;
}

/**
 * Render événement timeline
 */
function renderTimelineEvent(event) {
  const typeConfig = getEventTypeConfig(event.type);
  
  return `
    <div class="timeline-event" data-event-id="${event.id}" data-type="${event.type}">
      <div class="timeline-event-marker" style="background-color: ${typeConfig.color}"></div>
      
      <div class="timeline-event-card">
        <div class="timeline-event-header">
          <div class="timeline-event-type" style="background-color: ${typeConfig.color}">
            <span class="timeline-event-icon">${typeConfig.icon}</span>
            <span class="timeline-event-type-label">${typeConfig.label}</span>
          </div>
          
          <div class="timeline-event-date">
            <sl-icon name="calendar"></sl-icon>
            ${formatDate(event.date)}
          </div>
        </div>
        
        <div class="timeline-event-content">
          <h3 class="timeline-event-title">${event.title}</h3>
          ${event.description ? `
            <p class="timeline-event-description">${event.description}</p>
          ` : ''}
        </div>
        
        ${renderEventFooter(event)}
        
        <div class="timeline-event-actions">
          <sl-icon-button 
            name="pencil" 
            label="Éditer"
            onclick="editEvent('${event.id}')"
          ></sl-icon-button>
          <sl-icon-button 
            name="trash" 
            label="Supprimer"
            onclick="deleteEvent('${event.id}')"
          ></sl-icon-button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Configuration des types d'événements
 */
function getEventTypeConfig(type) {
  const configs = {
    success: {
      icon: '✅',
      label: 'Réussite',
      color: 'var(--mt-success)'
    },
    failure: {
      icon: '❌',
      label: 'Échec',
      color: 'var(--mt-failure)'
    },
    attempt: {
      icon: '🔄',
      label: 'Tentative',
      color: 'var(--mt-attempt)'
    },
    learning: {
      icon: '💡',
      label: 'Apprentissage',
      color: 'var(--mt-learning)'
    },
    decision: {
      icon: '🚦',
      label: 'Décision',
      color: 'var(--mt-decision)'
    }
  };
  
  return configs[type] || configs.success;
}

/**
 * Render footer événement
 */
function renderEventFooter(event) {
  const hasFooter = event.tags?.length > 0 || event.impact;
  
  if (!hasFooter) return '';
  
  return `
    <div class="timeline-event-footer">
      ${event.tags?.length > 0 ? `
        <div class="timeline-event-tags">
          ${event.tags.map(tag => `
            <span class="timeline-event-tag">${tag}</span>
          `).join('')}
        </div>
      ` : ''}
      
      ${event.impact ? `
        <div class="timeline-event-impact" data-impact="${event.impact}">
          <sl-icon name="speedometer"></sl-icon>
          Impact : ${getImpactLabel(event.impact)}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Label impact
 */
function getImpactLabel(impact) {
  const labels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Fort'
  };
  return labels[impact] || 'Moyen';
}

// ==========================================
// FILTRES
// ==========================================

/**
 * Filtrer les événements
 */
export function filterEvents(events, filters) {
  let filtered = [...events];
  
  // Filtre par type
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter(e => filters.types.includes(e.type));
  }
  
  // Filtre par tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(e => 
      e.tags?.some(tag => filters.tags.includes(tag))
    );
  }
  
  // Filtre par période
  if (filters.startDate) {
    const start = new Date(filters.startDate);
    filtered = filtered.filter(e => new Date(e.date) >= start);
  }
  
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    filtered = filtered.filter(e => new Date(e.date) <= end);
  }
  
  // Filtre par recherche texte
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(search) ||
      e.description?.toLowerCase().includes(search)
    );
  }
  
  return filtered;
}

/**
 * Render filtres timeline
 */
export function renderTimelineFilters(events, currentFilters = {}) {
  const allTags = extractUniqueTags(events);
  
  return `
    <div class="timeline-filters">
      <div class="timeline-search">
        <sl-input
          placeholder="Rechercher un événement..."
          clearable
          value="${currentFilters.search || ''}"
          oninput="updateTimelineFilter('search', this.value)"
        >
          <sl-icon slot="prefix" name="search"></sl-icon>
        </sl-input>
      </div>
      
      <div class="event-type-filter">
        <sl-button
          size="small"
          variant="${!currentFilters.types || currentFilters.types.length === 0 ? 'primary' : 'default'}"
          onclick="updateTimelineFilter('types', [])"
        >
          Tous
        </sl-button>
        
        ${renderTypeFilterButtons(currentFilters.types)}
      </div>
      
      ${allTags.length > 0 ? `
        <div class="timeline-tags-filter">
          <sl-dropdown>
            <sl-button slot="trigger" caret size="small">
              <sl-icon slot="prefix" name="tags"></sl-icon>
              Tags
              ${currentFilters.tags?.length > 0 ? `(${currentFilters.tags.length})` : ''}
            </sl-button>
            <sl-menu>
              ${allTags.map(tag => `
                <sl-menu-item
                  type="checkbox"
                  ${currentFilters.tags?.includes(tag) ? 'checked' : ''}
                  onclick="toggleTagFilter('${tag}')"
                >
                  ${tag}
                </sl-menu-item>
              `).join('')}
            </sl-menu>
          </sl-dropdown>
        </div>
      ` : ''}
      
      <div class="timeline-date-filter">
        <sl-input
          type="date"
          size="small"
          label="Du"
          value="${currentFilters.startDate || ''}"
          onchange="updateTimelineFilter('startDate', this.value)"
        ></sl-input>
        
        <sl-input
          type="date"
          size="small"
          label="Au"
          value="${currentFilters.endDate || ''}"
          onchange="updateTimelineFilter('endDate', this.value)"
        ></sl-input>
      </div>
      
      ${hasActiveFilters(currentFilters) ? `
        <sl-button
          size="small"
          variant="text"
          onclick="clearTimelineFilters()"
        >
          <sl-icon slot="prefix" name="x-circle"></sl-icon>
          Réinitialiser
        </sl-button>
      ` : ''}
    </div>
  `;
}

/**
 * Render boutons filtres par type
 */
function renderTypeFilterButtons(selectedTypes = []) {
  const types = [
    { id: 'success', icon: '✅', label: 'Réussites' },
    { id: 'failure', icon: '❌', label: 'Échecs' },
    { id: 'attempt', icon: '🔄', label: 'Tentatives' },
    { id: 'learning', icon: '💡', label: 'Apprentissages' },
    { id: 'decision', icon: '🚦', label: 'Décisions' }
  ];
  
  return types.map(type => `
    <sl-button
      size="small"
      variant="${selectedTypes.includes(type.id) ? 'primary' : 'default'}"
      onclick="toggleTypeFilter('${type.id}')"
    >
      <span slot="prefix">${type.icon}</span>
      ${type.label}
    </sl-button>
  `).join('');
}

/**
 * Extraire tous les tags uniques
 */
function extractUniqueTags(events) {
  const tags = new Set();
  events.forEach(event => {
    event.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Vérifier si des filtres sont actifs
 */
function hasActiveFilters(filters) {
  return (
    (filters.types && filters.types.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    filters.startDate ||
    filters.endDate ||
    filters.search
  );
}

// ==========================================
// STATISTIQUES TIMELINE
// ==========================================

/**
 * Calculer stats timeline
 */
export function calculateTimelineStats(events) {
  const stats = {
    total: events.length,
    byType: {},
    byMonth: {},
    tags: {},
    successRate: 0,
    averageImpact: 0
  };
  
  // Stats par type
  events.forEach(event => {
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
    
    // Stats par mois
    const month = new Date(event.date).toISOString().slice(0, 7);
    stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    
    // Stats tags
    event.tags?.forEach(tag => {
      stats.tags[tag] = (stats.tags[tag] || 0) + 1;
    });
  });
  
  // Taux de réussite
  const successCount = stats.byType.success || 0;
  const failureCount = stats.byType.failure || 0;
  const total = successCount + failureCount;
  stats.successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
  
  return stats;
}

/**
 * Render stats timeline
 */
export function renderTimelineStats(stats) {
  return `
    <div class="timeline-stats">
      <div class="timeline-stat-card">
        <div class="timeline-stat-value">${stats.total}</div>
        <div class="timeline-stat-label">Événements</div>
      </div>
      
      <div class="timeline-stat-card">
        <div class="timeline-stat-value">${stats.byType.success || 0}</div>
        <div class="timeline-stat-label">✅ Réussites</div>
      </div>
      
      <div class="timeline-stat-card">
        <div class="timeline-stat-value">${stats.byType.learning || 0}</div>
        <div class="timeline-stat-label">💡 Apprentissages</div>
      </div>
      
      <div class="timeline-stat-card">
        <div class="timeline-stat-value">${stats.successRate}%</div>
        <div class="timeline-stat-label">Taux de réussite</div>
      </div>
    </div>
  `;
}

// ==========================================
// EXPORT TIMELINE
// ==========================================

/**
 * Exporter timeline en Markdown
 */
export function exportTimelineToMarkdown(events, mission) {
  let md = `# Timeline - ${mission.title}\n\n`;
  md += `**Client:** ${mission.client}\n`;
  md += `**Période:** ${formatDate(mission.startDate)}`;
  
  if (mission.endDate) {
    md += ` → ${formatDate(mission.endDate)}`;
  }
  
  md += `\n\n---\n\n`;
  
  // Grouper par mois
  const eventsByMonth = groupEventsByMonth(events);
  
  Object.entries(eventsByMonth).forEach(([monthKey, monthData]) => {
    md += `## ${monthData.label}\n\n`;
    
    monthData.events.forEach(event => {
      const typeConfig = getEventTypeConfig(event.type);
      md += `### ${typeConfig.icon} ${event.title}\n\n`;
      md += `**Type:** ${typeConfig.label}  \n`;
      md += `**Date:** ${formatDate(event.date)}  \n`;
      
      if (event.description) {
        md += `\n${event.description}\n\n`;
      }
      
      if (event.tags?.length > 0) {
        md += `**Tags:** ${event.tags.join(', ')}\n\n`;
      }
      
      if (event.impact) {
        md += `**Impact:** ${getImpactLabel(event.impact)}\n\n`;
      }
      
      md += `---\n\n`;
    });
  });
  
  return md;
}

console.log('✅ Timeline Manager loaded');
