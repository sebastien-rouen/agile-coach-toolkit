/**
 * Mission Tracker - Générateur de rapports
 * Génération des rapports d'étonnement et bilans finaux
 */

import { formatDate } from '../../../../assets/js/shared/utils.js';

// ==========================================
// RAPPORT D'ÉTONNEMENT
// ==========================================

/**
 * Générer le rapport d'étonnement
 */
export function generateEtonnementReport(mission, events, config) {
  const role = config.roles.find(r => r.id === mission.role);
  const questions = role?.report_questions || {};
  
  const firstWeekEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const startDate = new Date(mission.startDate);
    const daysDiff = Math.ceil((eventDate - startDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });
  
  const report = {
    title: `Rapport d'étonnement - ${mission.title}`,
    subtitle: `${mission.client} - ${role?.name || mission.role}`,
    date: mission.startDate,
    author: mission.user_name || 'Coach Agile',
    
    sections: [
      generateContextSection(mission, questions.context),
      generateWhatWorksSection(firstWeekEvents, questions.what_works),
      generatePainPointsSection(firstWeekEvents, questions.pain_points),
      generateOpportunitiesSection(mission, questions.opportunities),
      generateObjectivesSection(mission),
      generateRecommendationsSection(mission, role)
    ]
  };
  
  return report;
}

/**
 * Section Contexte
 */
function generateContextSection(mission, questions) {
  return {
    id: 'context',
    icon: '🎯',
    title: 'Contexte de la mission',
    content: {
      type: 'context-grid',
      items: [
        { label: 'Client', value: mission.client },
        { label: 'Rôle', value: mission.role },
        { label: 'Début', value: formatDate(mission.startDate) },
        { label: 'Durée prévue', value: `${mission.duration} jours` }
      ],
      description: mission.context?.description || 'Contexte en cours de documentation.',
      questions: questions || []
    }
  };
}

/**
 * Section Ce qui fonctionne
 */
function generateWhatWorksSection(events, questions) {
  const successEvents = events.filter(e => e.type === 'success');
  
  return {
    id: 'what-works',
    icon: '✅',
    title: 'Ce qui fonctionne bien',
    content: {
      type: 'observations',
      items: successEvents.map(e => ({
        icon: '✅',
        type: 'success',
        text: e.title,
        description: e.description,
        date: e.date
      })),
      questions: questions || [],
      emptyMessage: 'Aucune réussite documentée pour le moment.'
    }
  };
}

/**
 * Section Points de douleur
 */
function generatePainPointsSection(events, questions) {
  const painEvents = events.filter(e => ['failure', 'attempt'].includes(e.type));
  
  return {
    id: 'pain-points',
    icon: '⚠️',
    title: 'Points de douleur identifiés',
    content: {
      type: 'observations',
      items: painEvents.map(e => ({
        icon: e.type === 'failure' ? '❌' : '🔄',
        type: e.type === 'failure' ? 'warning' : 'info',
        text: e.title,
        description: e.description,
        date: e.date
      })),
      questions: questions || [],
      emptyMessage: 'Aucun point de douleur identifié.'
    }
  };
}

/**
 * Section Opportunités
 */
function generateOpportunitiesSection(mission, questions) {
  const learningEvents = mission.events?.filter(e => e.type === 'learning') || [];
  
  return {
    id: 'opportunities',
    icon: '💡',
    title: 'Opportunités d\'amélioration',
    content: {
      type: 'observations',
      items: learningEvents.map(e => ({
        icon: '💡',
        type: 'info',
        text: e.title,
        description: e.description,
        date: e.date
      })),
      questions: questions || [],
      emptyMessage: 'Aucune opportunité identifiée pour le moment.'
    }
  };
}

/**
 * Section Objectifs
 */
function generateObjectivesSection(mission) {
  return {
    id: 'objectives',
    icon: '🎯',
    title: 'Objectifs de la mission',
    content: {
      type: 'objectives-list',
      items: mission.objectives.map((obj, index) => ({
        number: index + 1,
        text: obj.text,
        completed: obj.completed,
        progress: obj.progress || 0
      })),
      emptyMessage: 'Aucun objectif défini.'
    }
  };
}

/**
 * Section Recommandations
 */
function generateRecommendationsSection(mission, role) {
  const recommendations = [];
  
  // Recommandations basées sur le rôle
  if (role?.default_recommendations) {
    recommendations.push(...role.default_recommendations.slice(0, 3));
  }
  
  // Recommandations génériques si pas assez
  if (recommendations.length < 3) {
    recommendations.push(
      'Établir un rythme de rituels réguliers',
      'Créer un plan de communication transparent',
      'Définir des indicateurs de succès mesurables'
    );
  }
  
  return {
    id: 'recommendations',
    icon: '📋',
    title: 'Premières recommandations',
    content: {
      type: 'recommendations-grid',
      items: recommendations.slice(0, 3).map((rec, index) => ({
        icon: ['🎯', '📊', '🤝'][index],
        title: `Recommandation ${index + 1}`,
        description: rec
      }))
    }
  };
}

// ==========================================
// BILAN FINAL
// ==========================================

/**
 * Générer le bilan final
 */
export function generateFinalReport(mission, events, config) {
  const role = config.roles.find(r => r.id === mission.role);
  
  const report = {
    title: `Bilan Final - ${mission.title}`,
    subtitle: `${mission.client} - ${role?.name || mission.role}`,
    date: mission.endDate || new Date().toISOString().split('T')[0],
    author: mission.user_name || 'Coach Agile',
    period: {
      start: mission.startDate,
      end: mission.endDate || new Date().toISOString().split('T')[0],
      duration: mission.duration
    },
    
    sections: [
      generateExecutiveSummary(mission, events),
      generateTimelineSummary(events),
      generateObjectivesReport(mission),
      generateMetricsReport(mission, events),
      generateKeyLearnings(events),
      generateSuccessesReport(events),
      generateChallengesReport(events),
      generateFinalRecommendations(mission, events, role)
    ]
  };
  
  return report;
}

/**
 * Résumé exécutif
 */
function generateExecutiveSummary(mission, events) {
  const stats = {
    objectivesCompleted: mission.objectives.filter(o => o.completed).length,
    objectivesTotal: mission.objectives.length,
    eventsCount: events.length,
    successRate: calculateSuccessRate(events),
    duration: mission.duration
  };
  
  const completionRate = stats.objectivesTotal > 0 
    ? Math.round((stats.objectivesCompleted / stats.objectivesTotal) * 100) 
    : 0;
  
  return {
    id: 'executive-summary',
    icon: '📊',
    title: 'Résumé exécutif',
    content: {
      type: 'summary',
      stats: [
        { label: 'Objectifs atteints', value: `${stats.objectivesCompleted}/${stats.objectivesTotal}`, percent: completionRate },
        { label: 'Événements documentés', value: stats.eventsCount },
        { label: 'Taux de réussite', value: `${stats.successRate}%` },
        { label: 'Durée', value: `${stats.duration} jours` }
      ],
      summary: generateMissionSummaryText(mission, stats)
    }
  };
}

/**
 * Générer texte résumé mission
 */
function generateMissionSummaryText(mission, stats) {
  const completionRate = stats.objectivesTotal > 0 
    ? Math.round((stats.objectivesCompleted / stats.objectivesTotal) * 100) 
    : 0;
  
  let summary = `Mission de ${stats.duration} jours chez ${mission.client}. `;
  
  if (completionRate >= 80) {
    summary += `Excellent résultat avec ${completionRate}% des objectifs atteints. `;
  } else if (completionRate >= 50) {
    summary += `Résultats satisfaisants avec ${completionRate}% des objectifs atteints. `;
  } else {
    summary += `${completionRate}% des objectifs atteints, avec des axes d'amélioration identifiés. `;
  }
  
  if (stats.successRate >= 70) {
    summary += `Fort taux de réussite (${stats.successRate}%) démontrant une bonne dynamique d'équipe.`;
  } else if (stats.successRate >= 50) {
    summary += `Taux de réussite de ${stats.successRate}%, avec des apprentissages significatifs.`;
  } else {
    summary += `Contexte challengeant avec un taux de réussite de ${stats.successRate}%, nécessitant ajustements.`;
  }
  
  return summary;
}

/**
 * Calculer le taux de réussite
 */
function calculateSuccessRate(events) {
  if (events.length === 0) return 0;
  
  const successEvents = events.filter(e => e.type === 'success').length;
  return Math.round((successEvents / events.length) * 100);
}

/**
 * Résumé de la timeline
 */
function generateTimelineSummary(events) {
  const eventsByType = {
    success: events.filter(e => e.type === 'success').length,
    failure: events.filter(e => e.type === 'failure').length,
    attempt: events.filter(e => e.type === 'attempt').length,
    learning: events.filter(e => e.type === 'learning').length,
    decision: events.filter(e => e.type === 'decision').length
  };
  
  return {
    id: 'timeline-summary',
    icon: '📅',
    title: 'Chronologie de la mission',
    content: {
      type: 'timeline-stats',
      stats: [
        { icon: '✅', label: 'Réussites', value: eventsByType.success, color: 'success' },
        { icon: '❌', label: 'Échecs', value: eventsByType.failure, color: 'failure' },
        { icon: '🔄', label: 'Tentatives', value: eventsByType.attempt, color: 'attempt' },
        { icon: '💡', label: 'Apprentissages', value: eventsByType.learning, color: 'learning' },
        { icon: '🚦', label: 'Décisions', value: eventsByType.decision, color: 'decision' }
      ],
      highlights: getTopEvents(events, 3)
    }
  };
}

/**
 * Obtenir les événements les plus importants
 */
function getTopEvents(events, count = 3) {
  // Prioriser : success > learning > decision
  const prioritized = [
    ...events.filter(e => e.type === 'success'),
    ...events.filter(e => e.type === 'learning'),
    ...events.filter(e => e.type === 'decision'),
    ...events.filter(e => e.type === 'failure'),
    ...events.filter(e => e.type === 'attempt')
  ];
  
  return prioritized.slice(0, count).map(e => ({
    type: e.type,
    title: e.title,
    description: e.description,
    date: e.date
  }));
}

/**
 * Rapport sur les objectifs
 */
function generateObjectivesReport(mission) {
  return {
    id: 'objectives-report',
    icon: '🎯',
    title: 'Bilan des objectifs',
    content: {
      type: 'objectives-report-list',
      items: mission.objectives.map((obj, index) => ({
        number: index + 1,
        text: obj.text,
        completed: obj.completed,
        progress: obj.progress || (obj.completed ? 100 : 0),
        status: obj.completed ? 'completed' : 'in-progress'
      }))
    }
  };
}

/**
 * Rapport sur les métriques
 */
function generateMetricsReport(mission, events) {
  const metrics = mission.metrics || [];
  
  // Si pas de métriques, générer des métriques par défaut
  if (metrics.length === 0) {
    return {
      id: 'metrics',
      icon: '📈',
      title: 'Métriques de la mission',
      content: {
        type: 'metrics-table',
        headers: ['Métrique', 'Valeur', 'Évolution'],
        rows: [
          { metric: 'Événements documentés', value: events.length, trend: null },
          { metric: 'Taux de réussite', value: `${calculateSuccessRate(events)}%`, trend: null },
          { metric: 'Objectifs complétés', value: `${mission.objectives.filter(o => o.completed).length}/${mission.objectives.length}`, trend: null }
        ]
      }
    };
  }
  
  return {
    id: 'metrics',
    icon: '📈',
    title: 'Métriques de la mission',
    content: {
      type: 'metrics-table',
      headers: ['Métrique', 'Début', 'Fin', 'Évolution'],
      rows: metrics.map(m => ({
        metric: m.name,
        initial: m.initial_value,
        final: m.final_value,
        trend: calculateTrend(m.initial_value, m.final_value),
        target: m.target_value
      }))
    }
  };
}

/**
 * Calculer la tendance
 */
function calculateTrend(initial, final) {
  if (initial === undefined || final === undefined) return null;
  
  const diff = final - initial;
  if (diff > 0) return { direction: 'up', value: diff, positive: true };
  if (diff < 0) return { direction: 'down', value: Math.abs(diff), positive: false };
  return { direction: 'stable', value: 0, positive: true };
}

/**
 * Apprentissages clés
 */
function generateKeyLearnings(events) {
  const learningEvents = events.filter(e => e.type === 'learning');
  const failureEvents = events.filter(e => e.type === 'failure');
  
  const learnings = [
    ...learningEvents.map(e => ({ title: e.title, description: e.description, source: 'learning' })),
    ...failureEvents.map(e => ({ title: `Leçon tirée : ${e.title}`, description: e.description, source: 'failure' }))
  ];
  
  return {
    id: 'key-learnings',
    icon: '💡',
    title: 'Apprentissages clés',
    content: {
      type: 'key-learnings-list',
      items: learnings.slice(0, 5).map((l, index) => ({
        number: index + 1,
        title: l.title,
        description: l.description
      })),
      emptyMessage: 'Aucun apprentissage documenté.'
    }
  };
}

/**
 * Rapport des réussites
 */
function generateSuccessesReport(events) {
  const successes = events.filter(e => e.type === 'success');
  
  return {
    id: 'successes',
    icon: '🏆',
    title: 'Réussites et points forts',
    content: {
      type: 'events-highlights',
      items: successes.slice(0, 5).map(e => ({
        type: 'success',
        title: e.title,
        description: e.description,
        date: e.date,
        tags: e.tags
      })),
      emptyMessage: 'Aucune réussite documentée.'
    }
  };
}

/**
 * Rapport des défis
 */
function generateChallengesReport(events) {
  const challenges = events.filter(e => ['failure', 'attempt'].includes(e.type));
  
  return {
    id: 'challenges',
    icon: '⚡',
    title: 'Défis et difficultés',
    content: {
      type: 'events-highlights',
      items: challenges.slice(0, 5).map(e => ({
        type: e.type,
        title: e.title,
        description: e.description,
        date: e.date,
        tags: e.tags
      })),
      emptyMessage: 'Aucun défi documenté.'
    }
  };
}

/**
 * Recommandations finales
 */
function generateFinalRecommendations(mission, events, role) {
  const recommendations = [];
  
  const completionRate = mission.objectives.length > 0
    ? (mission.objectives.filter(o => o.completed).length / mission.objectives.length) * 100
    : 0;
  
  const successRate = calculateSuccessRate(events);
  
  // Recommandations basées sur les résultats
  if (completionRate >= 80 && successRate >= 70) {
    recommendations.push({
      icon: '🚀',
      title: 'Capitaliser sur le succès',
      description: 'Les résultats sont excellents. Documenter les pratiques qui ont fonctionné pour les réutiliser.'
    });
  }
  
  if (completionRate < 50) {
    recommendations.push({
      icon: '🎯',
      title: 'Revoir les objectifs',
      description: 'Le taux de completion est faible. Analyser si les objectifs étaient réalistes ou si des impediments ont bloqué.'
    });
  }
  
  if (successRate < 50) {
    recommendations.push({
      icon: '🔄',
      title: 'Adapter l\'approche',
      description: 'Le taux de réussite est bas. Identifier les causes et ajuster la stratégie pour les prochaines missions.'
    });
  }
  
  const learnings = events.filter(e => e.type === 'learning');
  if (learnings.length > 5) {
    recommendations.push({
      icon: '📚',
      title: 'Valoriser les apprentissages',
      description: `${learnings.length} apprentissages documentés. Les partager avec l'équipe et l'organisation.`
    });
  }
  
  // Recommandations du rôle
  if (role?.default_recommendations && recommendations.length < 3) {
    role.default_recommendations.slice(0, 3 - recommendations.length).forEach((rec, index) => {
      recommendations.push({
        icon: ['💼', '📊', '🤝'][index],
        title: `Recommandation ${recommendations.length + 1}`,
        description: rec
      });
    });
  }
  
  // Recommandations génériques si pas assez
  if (recommendations.length === 0) {
    recommendations.push(
      {
        icon: '📝',
        title: 'Documentation continue',
        description: 'Continuer à documenter les événements pour améliorer le suivi des prochaines missions.'
      },
      {
        icon: '🔄',
        title: 'Amélioration continue',
        description: 'Mettre en place des rétrospectives régulières pour identifier les axes d\'amélioration.'
      },
      {
        icon: '🤝',
        title: 'Partage de connaissance',
        description: 'Organiser des sessions de partage pour diffuser les apprentissages.'
      }
    );
  }
  
  return {
    id: 'recommendations',
    icon: '💼',
    title: 'Recommandations pour l\'avenir',
    content: {
      type: 'recommendations-grid',
      items: recommendations.slice(0, 4)
    }
  };
}

// ==========================================
// RENDER HTML
// ==========================================

/**
 * Render rapport en HTML
 */
export function renderReportHTML(report) {
  return `
    <div class="report-container">
      ${renderReportHeader(report)}
      ${report.sections.map(renderSection).join('')}
      ${renderReportFooter(report)}
    </div>
  `;
}

/**
 * Render header
 */
function renderReportHeader(report) {
  return `
    <div class="report-header">
      <h1 class="report-title">${report.title}</h1>
      <p class="report-subtitle">${report.subtitle}</p>
      <div class="report-meta">
        <div class="report-meta-item">
          <sl-icon name="calendar"></sl-icon>
          ${formatDate(report.date)}
        </div>
        <div class="report-meta-item">
          <sl-icon name="person"></sl-icon>
          ${report.author}
        </div>
        ${report.period ? `
          <div class="report-meta-item">
            <sl-icon name="clock"></sl-icon>
            ${report.period.duration} jours
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render section
 */
function renderSection(section) {
  return `
    <div class="report-section" id="section-${section.id}">
      <h2 class="report-section-title">
        <span>${section.icon}</span>
        ${section.title}
      </h2>
      ${renderSectionContent(section.content)}
    </div>
  `;
}

/**
 * Render contenu section selon type
 */
function renderSectionContent(content) {
  switch (content.type) {
    case 'context-grid':
      return renderContextGrid(content);
    case 'observations':
      return renderObservations(content);
    case 'objectives-list':
      return renderObjectivesList(content);
    case 'recommendations-grid':
      return renderRecommendationsGrid(content);
    case 'summary':
      return renderSummary(content);
    case 'timeline-stats':
      return renderTimelineStats(content);
    case 'objectives-report-list':
      return renderObjectivesReportList(content);
    case 'metrics-table':
      return renderMetricsTable(content);
    case 'key-learnings-list':
      return renderKeyLearningsList(content);
    case 'events-highlights':
      return renderEventsHighlights(content);
    default:
      return `<p>${JSON.stringify(content)}</p>`;
  }
}

/**
 * Render context grid
 */
function renderContextGrid(content) {
  return `
    <div class="context-grid">
      ${content.items.map(item => `
        <div class="context-item">
          <div class="context-item-label">${item.label}</div>
          <div class="context-item-value">${item.value}</div>
        </div>
      `).join('')}
    </div>
    ${content.description ? `<p>${content.description}</p>` : ''}
  `;
}

/**
 * Render observations
 */
function renderObservations(content) {
  if (content.items.length === 0) {
    return `<p class="text-muted">${content.emptyMessage}</p>`;
  }
  
  return `
    <div class="observation-list">
      ${content.items.map(item => `
        <div class="observation-item ${item.type}">
          <div class="observation-icon">${item.icon}</div>
          <div class="observation-content">
            <strong>${item.text}</strong>
            <p class="observation-text">${item.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render objectives list
 */
function renderObjectivesList(content) {
  if (content.items.length === 0) {
    return `<p class="text-muted">${content.emptyMessage}</p>`;
  }
  
  return `
    <div class="objectives-report-list">
      ${content.items.map(item => `
        <div class="objective-report-item">
          <div class="objective-report-header">
            <div class="objective-report-number">${item.number}</div>
            <div class="objective-report-text">${item.text}</div>
          </div>
          ${item.progress !== undefined ? `
            <div class="objective-report-progress">
              Progression : ${item.progress}%
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render recommendations grid
 */
function renderRecommendationsGrid(content) {
  return `
    <div class="recommendations-grid">
      ${content.items.map(item => `
        <div class="recommendation-card">
          <div class="recommendation-icon">${item.icon}</div>
          <h3 class="recommendation-title">${item.title}</h3>
          <p class="recommendation-description">${item.description}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render summary
 */
function renderSummary(content) {
  return `
    <div class="timeline-summary">
      ${content.stats.map(stat => `
        <div class="timeline-summary-item">
          <div class="timeline-summary-value">${stat.value}</div>
          <div class="timeline-summary-label">${stat.label}</div>
        </div>
      `).join('')}
    </div>
    <p>${content.summary}</p>
  `;
}

/**
 * Render timeline stats
 */
function renderTimelineStats(content) {
  return `
    <div class="timeline-summary">
      ${content.stats.map(stat => `
        <div class="timeline-summary-item">
          <div class="timeline-summary-icon">${stat.icon}</div>
          <div class="timeline-summary-value">${stat.value}</div>
          <div class="timeline-summary-label">${stat.label}</div>
        </div>
      `).join('')}
    </div>
    
    ${content.highlights && content.highlights.length > 0 ? `
      <h3 class="report-section-subtitle">Événements marquants</h3>
      <div class="events-highlights">
        ${content.highlights.map(event => `
          <div class="event-highlight ${event.type}">
            <div class="event-highlight-header">
              <span class="event-highlight-type ${event.type}">${event.type}</span>
              <span class="event-highlight-date">${formatDate(event.date)}</span>
            </div>
            <h4 class="event-highlight-title">${event.title}</h4>
            <p class="event-highlight-description">${event.description}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

/**
 * Render objectives report list
 */
function renderObjectivesReportList(content) {
  return `
    <div class="objectives-report-list">
      ${content.items.map(item => `
        <div class="objective-report-item">
          <div class="objective-report-header">
            <div class="objective-report-number">${item.number}</div>
            <div class="objective-report-text">${item.text}</div>
          </div>
          <div class="objective-report-progress">
            ${item.completed ? '✅ Complété' : `📊 ${item.progress}% complété`}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render metrics table
 */
function renderMetricsTable(content) {
  return `
    <table class="metrics-table">
      <thead>
        <tr>
          ${content.headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${content.rows.map(row => `
          <tr>
            <td>${row.metric}</td>
            <td class="metric-value">${row.value || row.initial}</td>
            ${row.final !== undefined ? `<td class="metric-value">${row.final}</td>` : ''}
            ${row.trend ? `
              <td>
                <div class="metric-trend ${row.trend.positive ? 'positive' : 'negative'}">
                  <sl-icon name="arrow-${row.trend.direction}"></sl-icon>
                  ${row.trend.value}
                </div>
              </td>
            ` : '<td>-</td>'}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Render key learnings list
 */
function renderKeyLearningsList(content) {
  if (content.items.length === 0) {
    return `<p class="text-muted">${content.emptyMessage}</p>`;
  }
  
  return `
    <ol class="key-learnings-list">
      ${content.items.map(item => `
        <li>
          <strong>${item.title}</strong>
          <p>${item.description}</p>
        </li>
      `).join('')}
    </ol>
  `;
}

/**
 * Render events highlights
 */
function renderEventsHighlights(content) {
  if (content.items.length === 0) {
    return `<p class="text-muted">${content.emptyMessage}</p>`;
  }
  
  return `
    <div class="events-highlights">
      ${content.items.map(event => `
        <div class="event-highlight ${event.type}">
          <div class="event-highlight-header">
            <span class="event-highlight-type ${event.type}">${event.type}</span>
            <span class="event-highlight-date">${formatDate(event.date)}</span>
          </div>
          <h4 class="event-highlight-title">${event.title}</h4>
          <p class="event-highlight-description">${event.description}</p>
          ${event.tags && event.tags.length > 0 ? `
            <div class="event-tags">
              ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render footer
 */
function renderReportFooter(report) {
  return `
    <div class="report-footer">
      <p class="report-footer-signature">
        Rédigé par ${report.author}
      </p>
      <p class="report-footer-date">
        ${formatDate(report.date)}
      </p>
    </div>
  `;
}
