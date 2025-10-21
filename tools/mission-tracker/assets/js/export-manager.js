/**
 * Mission Tracker - Export Manager
 * Export des données en PDF, Markdown, JSON
 */

import { exportTimelineToMarkdown } from './timeline-manager.js';
import { formatDate } from '../../../../assets/js/shared/utils.js';

// ==========================================
// EXPORT PDF
// ==========================================

/**
 * Exporter un rapport en PDF
 */
export async function exportReportToPDF(report, mission) {
  try {
    // Créer une fenêtre d'impression avec le contenu du rapport
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Popup bloquée. Autorisez les popups pour ce site.');
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${report.title}</title>
        <link rel="stylesheet" href="/assets/css/base.css">
        <link rel="stylesheet" href="/assets/css/report-templates.css">
        <style>
          @media print {
            body {
              background: white;
              color: black;
            }
            
            .report-container {
              max-width: 100%;
              padding: 0;
            }
            
            .report-section {
              page-break-inside: avoid;
              background: white !important;
              border: 1px solid #ddd;
            }
            
            .no-print {
              display: none !important;
            }
            
            @page {
              margin: 2cm;
            }
          }
        </style>
      </head>
      <body>
        ${renderReportForPrint(report, mission)}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
  } catch (error) {
    console.error('❌ Erreur export PDF:', error);
    throw error;
  }
}

/**
 * Render rapport pour impression
 */
function renderReportForPrint(report, mission) {
  return `
    <div class="report-container">
      <!-- Header -->
      <div class="report-header">
        <h1 class="report-title">${report.title}</h1>
        <p class="report-subtitle">${report.subtitle}</p>
        <div class="report-meta">
          <span>📅 ${formatDate(report.date)}</span>
          <span>👤 ${report.author}</span>
          ${mission.client ? `<span>🏢 ${mission.client}</span>` : ''}
        </div>
      </div>
      
      <!-- Sections -->
      ${report.sections.map(section => renderSectionForPrint(section)).join('')}
      
      <!-- Footer -->
      <div class="report-footer" style="margin-top: 3rem; padding-top: 1rem; border-top: 2px solid #ddd;">
        <p style="text-align: center; color: #666;">
          Document généré le ${formatDate(new Date())} avec Mission Tracker
        </p>
      </div>
    </div>
  `;
}

/**
 * Render section pour impression
 */
function renderSectionForPrint(section) {
  return `
    <div class="report-section">
      <h2 class="report-section-title">
        <span>${section.icon}</span>
        ${section.title}
      </h2>
      <div class="report-section-content">
        ${renderContentForPrint(section.content)}
      </div>
    </div>
  `;
}

/**
 * Render contenu selon le type
 */
function renderContentForPrint(content) {
  if (typeof content === 'string') {
    return content;
  }
  
  switch (content.type) {
    case 'context-grid':
      return renderContextGridForPrint(content);
    case 'observations':
      return renderObservationsForPrint(content);
    case 'recommendations':
      return renderRecommendationsForPrint(content);
    case 'list':
      return renderListForPrint(content);
    default:
      return '<p>Contenu non disponible</p>';
  }
}

function renderContextGridForPrint(content) {
  return `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
      ${content.items.map(item => `
        <div style="padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
          <strong style="color: #666; font-size: 0.875rem;">${item.label}</strong>
          <p style="margin: 0.5rem 0 0 0; font-size: 1rem;">${item.value}</p>
        </div>
      `).join('')}
    </div>
    ${content.description ? `<p style="margin-top: 1.5rem;">${content.description}</p>` : ''}
  `;
}

function renderObservationsForPrint(content) {
  if (content.items.length === 0) {
    return `<p style="color: #666;">${content.emptyMessage}</p>`;
  }
  
  return `
    <ul style="list-style: none; padding: 0;">
      ${content.items.map(item => `
        <li style="margin-bottom: 1rem; padding-left: 2rem; position: relative;">
          <span style="position: absolute; left: 0; font-size: 1.25rem;">${item.icon}</span>
          <strong>${item.text}</strong>
          ${item.description ? `<p style="margin: 0.5rem 0 0 0; color: #666;">${item.description}</p>` : ''}
        </li>
      `).join('')}
    </ul>
  `;
}

function renderRecommendationsForPrint(content) {
  if (content.items.length === 0) {
    return `<p style="color: #666;">${content.emptyMessage}</p>`;
  }
  
  return `
    <ol style="padding-left: 1.5rem;">
      ${content.items.map((item, index) => `
        <li style="margin-bottom: 1.5rem;">
          <strong style="font-size: 1.125rem;">${item.title}</strong>
          <p style="margin: 0.5rem 0; color: #666;">${item.description}</p>
          ${item.priority ? `
            <span style="display: inline-block; padding: 0.25rem 0.75rem; background: ${getPriorityColor(item.priority)}; color: white; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
              ${item.priority.toUpperCase()}
            </span>
          ` : ''}
        </li>
      `).join('')}
    </ol>
  `;
}

function renderListForPrint(content) {
  if (content.items.length === 0) {
    return `<p style="color: #666;">${content.emptyMessage}</p>`;
  }
  
  return `
    <ul style="padding-left: 1.5rem;">
      ${content.items.map(item => `
        <li style="margin-bottom: 0.75rem;">${item}</li>
      `).join('')}
    </ul>
  `;
}

function getPriorityColor(priority) {
  const colors = {
    high: '#e53e3e',
    medium: '#dd6b20',
    low: '#38a169'
  };
  return colors[priority] || colors.medium;
}

// ==========================================
// EXPORT MARKDOWN
// ==========================================

/**
 * Exporter un rapport en Markdown
 */
export function exportReportToMarkdown(report, mission, events) {
  let md = `# ${report.title}\n\n`;
  md += `**${report.subtitle}**\n\n`;
  md += `---\n\n`;
  md += `- 📅 Date : ${formatDate(report.date)}\n`;
  md += `- 👤 Auteur : ${report.author}\n`;
  
  if (mission.client) {
    md += `- 🏢 Client : ${mission.client}\n`;
  }
  
  md += `\n---\n\n`;
  
  // Sections
  report.sections.forEach(section => {
    md += `## ${section.icon} ${section.title}\n\n`;
    md += convertContentToMarkdown(section.content);
    md += `\n---\n\n`;
  });
  
  // Timeline si événements fournis
  if (events && events.length > 0) {
    md += `## 📅 Timeline\n\n`;
    md += exportTimelineToMarkdown(events, mission);
  }
  
  // Footer
  md += `\n---\n\n`;
  md += `*Document généré le ${formatDate(new Date())} avec Mission Tracker*\n`;
  
  return md;
}

/**
 * Convertir contenu en Markdown
 */
function convertContentToMarkdown(content) {
  if (typeof content === 'string') {
    return content + '\n\n';
  }
  
  switch (content.type) {
    case 'context-grid':
      return convertContextGridToMarkdown(content);
    case 'observations':
      return convertObservationsToMarkdown(content);
    case 'recommendations':
      return convertRecommendationsToMarkdown(content);
    case 'list':
      return convertListToMarkdown(content);
    default:
      return 'Contenu non disponible\n\n';
  }
}

function convertContextGridToMarkdown(content) {
  let md = '';
  
  content.items.forEach(item => {
    md += `**${item.label}** : ${item.value}  \n`;
  });
  
  md += '\n';
  
  if (content.description) {
    md += `${content.description}\n\n`;
  }
  
  return md;
}

function convertObservationsToMarkdown(content) {
  if (content.items.length === 0) {
    return `*${content.emptyMessage}*\n\n`;
  }
  
  let md = '';
  
  content.items.forEach(item => {
    md += `- ${item.icon} **${item.text}**\n`;
    if (item.description) {
      md += `  ${item.description}\n`;
    }
  });
  
  md += '\n';
  return md;
}

function convertRecommendationsToMarkdown(content) {
  if (content.items.length === 0) {
    return `*${content.emptyMessage}*\n\n`;
  }
  
  let md = '';
  
  content.items.forEach((item, index) => {
    md += `${index + 1}. **${item.title}**\n`;
    md += `   ${item.description}\n`;
    if (item.priority) {
      md += `   *Priorité : ${item.priority.toUpperCase()}*\n`;
    }
    md += '\n';
  });
  
  return md;
}

function convertListToMarkdown(content) {
  if (content.items.length === 0) {
    return `*${content.emptyMessage}*\n\n`;
  }
  
  return content.items.map(item => `- ${item}`).join('\n') + '\n\n';
}

// ==========================================
// EXPORT JSON
// ==========================================

/**
 * Exporter données complètes en JSON
 */
export function exportMissionToJSON(mission, events) {
  const data = {
    mission: {
      ...mission,
      exportDate: new Date().toISOString()
    },
    events: events || [],
    metadata: {
      version: '1.0',
      generator: 'Mission Tracker',
      totalEvents: events?.length || 0
    }
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Importer depuis JSON
 */
export function importMissionFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Valider structure
    if (!data.mission || !data.events) {
      throw new Error('Format JSON invalide');
    }
    
    return {
      mission: data.mission,
      events: data.events
    };
    
  } catch (error) {
    console.error('❌ Erreur import JSON:', error);
    throw new Error('Fichier JSON invalide');
  }
}

// ==========================================
// DOWNLOAD HELPERS
// ==========================================

/**
 * Télécharger un fichier
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Exporter et télécharger rapport Markdown
 */
export function downloadReportMarkdown(report, mission, events) {
  const content = exportReportToMarkdown(report, mission, events);
  const filename = `${sanitizeFilename(report.title)}_${formatDate(new Date(), 'YYYY-MM-DD')}.md`;
  
  downloadFile(content, filename, 'text/markdown');
}

/**
 * Exporter et télécharger mission JSON
 */
export function downloadMissionJSON(mission, events) {
  const content = exportMissionToJSON(mission, events);
  const filename = `mission_${sanitizeFilename(mission.title)}_${formatDate(new Date(), 'YYYY-MM-DD')}.json`;
  
  downloadFile(content, filename, 'application/json');
}

/**
 * Sanitize filename
 */
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// ==========================================
// BATCH EXPORT
// ==========================================

/**
 * Exporter toutes les missions
 */
export async function exportAllMissions(missions, eventsMap) {
  const exports = [];
  
  for (const mission of missions) {
    const events = eventsMap[mission.id] || [];
    const content = exportMissionToJSON(mission, events);
    
    exports.push({
      filename: `mission_${mission.id}.json`,
      content
    });
  }
  
  // Créer un fichier ZIP si plusieurs missions
  if (exports.length > 1) {
    return createZipArchive(exports);
  } else if (exports.length === 1) {
    downloadFile(exports[0].content, exports[0].filename, 'application/json');
  }
}

/**
 * Créer archive ZIP (placeholder - nécessite JSZip)
 */
async function createZipArchive(files) {
  console.warn('⚠️ Export ZIP nécessite la librairie JSZip');
  
  // Alternative : télécharger les fichiers individuellement
  for (const file of files) {
    downloadFile(file.content, file.filename, 'application/json');
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai entre téléchargements
  }
}

console.log('✅ Export Manager loaded');
