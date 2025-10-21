/**
 * ========================================
 * CHARTS RENDERER
 * ========================================
 * Rendu des graphiques avec Chart.js
 */

import { Formatters } from '../utils/formatters.js';

export class ChartsRenderer {
    constructor(data) {
        this.data = data;
        this.charts = {};
    }

    /**
     * Afficher la légende des annotations
     */
    renderAnnotationLegend() {
        const container = document.querySelector('.chart-header');
        if (!container) return;

        const existing = container.querySelector('.annotation-legend');
        if (existing) existing.remove();

        const annotations = this.data.annotations || [];
        if (annotations.length === 0) return;

        const annotationTypes = {
            team: { icon: "👥", label: "Équipe", color: "#2196F3" },
            vacation: { icon: "🏖️", label: "Congés", color: "#FF9800" },
            incident: { icon: "🚨", label: "Incident", color: "#F44336" },
            process: { icon: "🔧", label: "Process", color: "#9C27B0" },
            release: { icon: "🚀", label: "Release", color: "#4CAF50" },
            training: { icon: "🎓", label: "Formation", color: "#00BCD4" }
        };

        const usedTypes = [...new Set(annotations.map(a => a.type))];

        const legend = document.createElement('div');
        legend.className = 'annotation-legend';
        legend.setAttribute('role', 'list');
        legend.setAttribute('aria-label', 'Légende des annotations');
        
        legend.innerHTML = usedTypes.map(type => {
            const typeInfo = annotationTypes[type];
            if (!typeInfo) return '';

            const count = annotations.filter(a => a.type === type).length;
            const annotationsOfType = annotations.filter(a => a.type === type);
            const tooltipText = annotationsOfType.map(a => a.text).join(' • ');

            return `
                <span class="annotation-legend-item" 
                      data-type="${type}" 
                      style="color: ${typeInfo.color};"
                      role="listitem"
                      title="${tooltipText}"
                      tabindex="0">
                    ${typeInfo.icon} ${typeInfo.label} 
                    <span class="annotation-count">${count}</span>
                </span>
            `;
        }).join('');

        container.appendChild(legend);

        // Ajouter les événements de clic pour afficher les détails
        legend.querySelectorAll('.annotation-legend-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-type');
                this.showAnnotationDetails(type);
            });
            
            // Support clavier
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const type = e.currentTarget.getAttribute('data-type');
                    this.showAnnotationDetails(type);
                }
            });
        });
    }

    /**
     * Afficher les détails des annotations d'un type
     * @param {string} type - Type d'annotation
     */
    showAnnotationDetails(type) {
        const annotations = this.data.annotations.filter(a => a.type === type);
        if (annotations.length === 0) return;

        const annotationTypes = {
            team: { icon: "👥", label: "Équipe", color: "#2196F3" },
            vacation: { icon: "🏖️", label: "Congés", color: "#FF9800" },
            incident: { icon: "🚨", label: "Incident", color: "#F44336" },
            process: { icon: "🔧", label: "Process", color: "#9C27B0" },
            release: { icon: "🚀", label: "Release", color: "#4CAF50" },
            training: { icon: "🎓", label: "Formation", color: "#00BCD4" }
        };

        const typeInfo = annotationTypes[type];
        const sprints = this.data.sprints || [];

        const details = annotations.map(annotation => {
            const sprint = sprints.find(s => String(s.id) === String(annotation.sprintId));
            const sprintName = sprint ? sprint.name : 'Sprint inconnu';
            const timestamp = annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR') : '';
            return `
                <li style="padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 6px; border-left: 3px solid ${typeInfo.color};">
                    <div style="font-weight: 600; color: ${typeInfo.color}; margin-bottom: 0.25rem;">
                        ${sprintName}
                        ${timestamp ? `<span style="float: right; font-size: 0.85rem; color: #666;">${timestamp}</span>` : ''}
                    </div>
                    <div style="color: #333; line-height: 1.5;">${annotation.text}</div>
                </li>
            `;
        }).join('');

        // Afficher dans la sidebar
        this.showInSidebar(
            `${typeInfo.icon} ${typeInfo.label}`,
            typeInfo.color,
            annotations.length,
            details
        );
    }

    /**
     * Afficher du contenu dans la sidebar
     * @param {string} title - Titre de la sidebar
     * @param {string} color - Couleur du thème
     * @param {number} count - Nombre d'éléments
     * @param {string} content - Contenu HTML
     */
    showInSidebar(title, color, count, content) {
        const sidebar = document.getElementById('annotationsSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const sidebarTitle = document.getElementById('sidebarTitle');
        const sidebarIcon = document.getElementById('sidebarIcon');
        const sidebarContent = document.getElementById('sidebarContent');
        const sidebarClose = document.getElementById('sidebarClose');

        if (!sidebar || !overlay) return;

        sidebarContent.innerHTML = `
            <div class="sidebar-section">
                <div class="sidebar-section-title" style="color: ${color};">
                    ${count} élément${count > 1 ? 's' : ''}
                </div>
                <div class="sidebar-items">
                    ${content}
                </div>
            </div>
        `;

        // Appliquer la couleur au header
        const header = sidebar.querySelector('.sidebar-header');
        if (header) {
            header.style.background = color;
        }

        // Afficher la sidebar
        sidebar.classList.add('active');
        overlay.classList.add('active');

        // Gérer la fermeture
        const closeSidebar = () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        };

        sidebarClose.onclick = closeSidebar;
        overlay.onclick = closeSidebar;

        // Fermer avec Échap
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeSidebar();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Afficher les annotations d'un sprint spécifique
     * @param {string} sprintId - ID du sprint
     * @param {Array} annotations - Annotations du sprint
     */
    showSprintAnnotations(sprintId, annotations) {
        if (!annotations || annotations.length === 0) return;

        const annotationTypes = {
            team: { icon: "👥", label: "Équipe", color: "#2196F3" },
            vacation: { icon: "🏖️", label: "Congés", color: "#FF9800" },
            incident: { icon: "🚨", label: "Incident", color: "#F44336" },
            process: { icon: "🔧", label: "Process", color: "#9C27B0" },
            release: { icon: "🚀", label: "Release", color: "#4CAF50" },
            training: { icon: "🎓", label: "Formation", color: "#00BCD4" }
        };

        const sprints = this.data.sprints || [];
        const sprint = sprints.find(s => String(s.id) === String(sprintId));
        const sprintName = sprint ? sprint.name : 'Sprint inconnu';

        const details = annotations.map(annotation => {
            const typeInfo = annotationTypes[annotation.type] || { icon: "📌", label: "Autre", color: "#666" };
            const timestamp = annotation.timestamp ? new Date(annotation.timestamp).toLocaleDateString('fr-FR') : '';
            return `
                <li style="padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 6px; border-left: 3px solid ${typeInfo.color};">
                    <div style="font-weight: 600; color: ${typeInfo.color}; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>${typeInfo.icon} ${typeInfo.label}</span>
                        ${timestamp ? `<span style="margin-left: auto; font-size: 0.85rem; color: #666; font-weight: normal;">${timestamp}</span>` : ''}
                    </div>
                    <div style="color: #333; line-height: 1.5;">${annotation.text}</div>
                </li>
            `;
        }).join('');

        // Afficher dans la sidebar
        this.showInSidebar(
            `📝 Faits marquants - ${sprintName}`,
            '#2196F3',
            annotations.length,
            details
        );
    }

    /**
     * Rendre le graphique de vélocité
     * @param {string} canvasId - ID du canvas
     */
    renderVelocityChart(canvasId = 'velocityChart') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('❌ Canvas non trouvé:', canvasId);
            return;
        }

        // Détruire le graphique existant
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        const sprints = this.data.sprints || [];
        const annotations = this.data.annotations || [];

        // Trier les sprints par date de début (chronologique)
        const sortedSprints = [...sprints].sort((a, b) => {
            const dateA = new Date(a.startDate || 0);
            const dateB = new Date(b.startDate || 0);
            return dateA - dateB;
        });

        console.log('📊 Rendu graphique vélocité:', {
            canvasId,
            sprintsCount: sortedSprints.length,
            annotationsCount: annotations.length,
            firstSprint: sortedSprints[0],
            lastSprint: sortedSprints[sortedSprints.length - 1]
        });

        const labels = sortedSprints.map((s, i) => s.name || `Sprint ${i + 1}`);
        const committed = sortedSprints.map(s => s.committed || s.velocity || 0);
        const completed = sortedSprints.map(s => s.completed || s.velocity || 0);

        // Plugin pour dessiner les annotations
        const annotationsPlugin = {
            id: 'annotationsPlugin',
            afterDatasetsDraw: (chart) => {
                this.drawAnnotations(chart, sortedSprints, annotations);
            }
        };

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Engagé',
                        data: committed,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2
                    },
                    {
                        label: 'Complété',
                        data: completed,
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim()
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} points`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    }
                }
            },
            plugins: [annotationsPlugin]
        });

        // Ajouter l'événement de clic sur le canvas pour les annotations
        canvas.onclick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Vérifier si on a cliqué sur une annotation
            if (this.annotationClickAreas) {
                for (const area of this.annotationClickAreas) {
                    if (x >= area.x && x <= area.x + area.width &&
                        y >= area.y && y <= area.y + area.height) {
                        this.showSprintAnnotations(area.sprintId, area.annotations);
                        break;
                    }
                }
            }
        };

        // Changer le curseur au survol des annotations
        canvas.onmousemove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            let isOverAnnotation = false;
            if (this.annotationClickAreas) {
                for (const area of this.annotationClickAreas) {
                    if (x >= area.x && x <= area.x + area.width &&
                        y >= area.y && y <= area.y + area.height) {
                        isOverAnnotation = true;
                        break;
                    }
                }
            }

            canvas.style.cursor = isOverAnnotation ? 'pointer' : 'default';
        };

        // Afficher la légende des annotations
        this.renderAnnotationLegend();
    }

    /**
     * Dessiner les annotations sur le graphique
     */
    drawAnnotations(chart, sprints, annotations) {
        const ctx = chart.ctx;
        const { scales } = chart;

        if (!scales.x || !scales.y) return;

        // Grouper annotations par sprint
        const annotationsBySprint = {};
        annotations.forEach(annotation => {
            const sprintIndex = sprints.findIndex(s => String(s.id) === String(annotation.sprintId));
            if (sprintIndex !== -1) {
                if (!annotationsBySprint[sprintIndex]) {
                    annotationsBySprint[sprintIndex] = [];
                }
                annotationsBySprint[sprintIndex].push(annotation);
            }
        });

        // Stocker les zones cliquables pour les annotations
        if (!this.annotationClickAreas) {
            this.annotationClickAreas = [];
        }
        this.annotationClickAreas = [];

        // Dessiner les annotations
        Object.entries(annotationsBySprint).forEach(([sprintIndex, sprintAnnotations]) => {
            const index = parseInt(sprintIndex);
            const sprint = sprints[index];
            
            if (!sprint) return;

            const x = scales.x.getPixelForValue(index);
            const y = scales.y.getPixelForValue(sprint.velocity || sprint.completed || 0) - 30;

            // Dessiner jusqu'à 3 annotations par sprint
            const displayCount = Math.min(3, sprintAnnotations.length);
            const startOffset = displayCount > 1 ? -(displayCount - 1) * 12 : 0;

            for (let i = 0; i < displayCount; i++) {
                const annotation = sprintAnnotations[i];
                const offsetX = startOffset + (i * 24);
                const finalX = x + offsetX;

                // Dessiner l'icône
                const icon = this.getAnnotationIcon(annotation.type);
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(icon, finalX, y);

                // Stocker la zone cliquable
                this.annotationClickAreas.push({
                    x: finalX - 12,
                    y: y - 12,
                    width: 24,
                    height: 24,
                    sprintId: sprint.id,
                    annotations: sprintAnnotations
                });

                // Badge de compteur si plus de 3
                if (i === 2 && sprintAnnotations.length > 3) {
                    ctx.fillStyle = '#FF9800';
                    ctx.beginPath();
                    ctx.arc(finalX + 8, y - 8, 8, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(`+${sprintAnnotations.length - 3}`, finalX + 8, y - 8);
                }
            }
        });
    }

    /**
     * Obtenir l'icône d'une annotation
     */
    getAnnotationIcon(type) {
        const icons = {
            team: '👥',
            vacation: '🏖️',
            incident: '🚨',
            process: '🔧',
            release: '🚀',
            training: '🎓'
        };
        return icons[type] || '📌';
    }

    /**
     * Rendre le graphique de tendance
     * @param {string} canvasId - ID du canvas
     */
    renderTrendChart(canvasId = 'trendChart') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('❌ Canvas non trouvé:', canvasId);
            return;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        const sprints = this.data.sprints || [];

        const labels = sprints.map((s, i) => s.name || `Sprint ${i + 1}`);
        const completed = sprints.map(s => s.completed || 0);

        // Calculer la moyenne mobile
        const movingAverage = this.calculateMovingAverage(completed, 3);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Vélocité',
                        data: completed,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Tendance (moyenne mobile)',
                        data: movingAverage,
                        borderColor: 'rgb(251, 146, 60)',
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim()
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    }
                }
            }
        });
    }

    /**
     * Rendre le graphique de burndown
     * @param {string} canvasId - ID du canvas
     * @param {number} sprintIndex - Index du sprint
     */
    renderBurndownChart(canvasId = 'burndownChart', sprintIndex = null) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('❌ Canvas non trouvé:', canvasId);
            return;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Utiliser le dernier sprint si non spécifié
        if (sprintIndex === null) {
            sprintIndex = (this.data.sprints?.length || 1) - 1;
        }

        const sprint = this.data.sprints?.[sprintIndex];
        if (!sprint) {
            console.error('❌ Sprint non trouvé:', sprintIndex);
            return;
        }

        const days = this.calculateSprintDays(sprint);
        const idealBurndown = this.calculateIdealBurndown(sprint.committed, days);
        const actualBurndown = sprint.burndown || idealBurndown;

        const labels = Array.from({ length: days + 1 }, (_, i) => `Jour ${i}`);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Idéal',
                        data: idealBurndown,
                        borderColor: 'rgb(156, 163, 175)',
                        borderDash: [5, 5],
                        tension: 0,
                        fill: false
                    },
                    {
                        label: 'Réel',
                        data: actualBurndown,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim()
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color').trim()
                        }
                    }
                }
            }
        });
    }

    /**
     * Calculer la moyenne mobile
     * @param {Array} data - Données
     * @param {number} window - Fenêtre
     * @returns {Array} Moyenne mobile
     */
    calculateMovingAverage(data, window = 3) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < window - 1) {
                result.push(null);
            } else {
                const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
                result.push(sum / window);
            }
        }
        return result;
    }

    /**
     * Calculer le nombre de jours d'un sprint
     * @param {Object} sprint - Sprint
     * @returns {number} Nombre de jours
     */
    calculateSprintDays(sprint) {
        if (sprint.startDate && sprint.endDate) {
            const start = new Date(sprint.startDate);
            const end = new Date(sprint.endDate);
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return this.data.settings?.sprintLength || 14;
    }

    /**
     * Calculer le burndown idéal
     * @param {number} totalPoints - Points totaux
     * @param {number} days - Nombre de jours
     * @returns {Array} Burndown idéal
     */
    calculateIdealBurndown(totalPoints, days) {
        const burndown = [];
        const pointsPerDay = totalPoints / days;
        
        for (let i = 0; i <= days; i++) {
            burndown.push(Math.max(0, totalPoints - (pointsPerDay * i)));
        }
        
        return burndown;
    }

    /**
     * Détruire tous les graphiques
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                delete this.charts[key];
            }
        });
    }

    /**
     * Mettre à jour les couleurs des graphiques (pour changement de thème)
     */
    updateChartsColors() {
        Object.keys(this.charts).forEach(key => {
            const chart = this.charts[key];
            if (chart) {
                const textColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--text-primary').trim();
                const secondaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--text-secondary').trim();
                const borderColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--border-color').trim();

                chart.options.plugins.legend.labels.color = textColor;
                chart.options.scales.y.ticks.color = secondaryColor;
                chart.options.scales.y.grid.color = borderColor;
                chart.options.scales.x.ticks.color = secondaryColor;
                chart.options.scales.x.grid.color = borderColor;
                
                chart.update();
            }
        });
    }
}
