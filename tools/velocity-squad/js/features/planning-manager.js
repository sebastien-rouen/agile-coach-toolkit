/**
 * ========================================
 * PLANNING MANAGER
 * ========================================
 * Gestion des événements de planning et timeline
 */

export class PlanningManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    /**
     * Afficher les événements de planning
     */
    renderPlanningEvents() {
        const events = this.data.events || [];
        const container = document.getElementById('planningEvents');
        
        if (!container) return;
        
        if (events.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>📅 Aucun événement planifié</p>
                    <p style="font-size: 0.9rem;">Cliquez sur "➕ Ajouter Événement" pour commencer</p>
                </div>
            `;
            return;
        }

        // Générer les occurrences pour les 4 prochaines semaines
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 28); // 4 semaines

        // Générer toutes les occurrences (incluant récurrences)
        const eventsByDate = this.generateEventOccurrences(events, today, endDate);

        // Trier les dates et filtrer uniquement les dates futures
        const sortedDates = Object.keys(eventsByDate)
            .filter(date => new Date(date) >= today)
            .sort();

        container.innerHTML = sortedDates.map(date => {
            const dateEvents = eventsByDate[date];
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            return `
                <div class="planning-date-group">
                    <h4 class="planning-date">${formattedDate}</h4>
                    <div class="planning-events-list">
                        ${dateEvents.map(event => `
                            <div class="planning-event" data-type="${event.type}">
                                <div class="event-time">${event.time || '—'}</div>
                                <div class="event-details">
                                    <div class="event-title">${this.getEventIcon(event.type)} ${event.title}</div>
                                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                                    ${event.duration ? `<div class="event-duration">⏱️ ${event.duration} min</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Afficher la timeline de planning (vue calendrier)
     */
    renderPlanningTimeline() {
        const container = document.getElementById('planningTimeline');
        if (!container) return;

        const events = this.data.events || [];
        
        if (events.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>📅 Aucun événement à afficher dans la timeline</p>
                </div>
            `;
            return;
        }

        // Obtenir la plage de dates à partir d'aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Toujours commencer à partir d'aujourd'hui
        const startDate = new Date(today);
        
        // Nombre de semaines à afficher (configurable)
        const weeksToShow = 3;
        
        // Calculer la date de fin
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + ((weeksToShow-1) * 7));

        // Calculer les semaines
        const weeks = this.calculateWeeks(startDate, endDate);

        // Types d'événements pour la légende
        const eventTypesInUse = [...new Set(events.map(e => e.type))];
        const eventTypeColors = {
            daily: { color: '#FFC107', label: 'Daily', icon: '☀️' },
            planning: { color: '#2196F3', label: 'Planning', icon: '📋' },
            sprint_planning: { color: '#2196F3', label: 'Sprint Planning', icon: '📋' },
            review: { color: '#be1959ff', label: 'Review', icon: '👀' },
            sprint_review: { color: '#be1959ff', label: 'Sprint Review', icon: '👀' },
            retro: { color: '#9C27B0', label: 'Rétrospective', icon: '🔄' },
            sprint_retrospective: { color: '#9C27B0', label: 'Sprint Rétrospective', icon: '🔄' },
            refinement: { color: '#FF9800', label: 'Refinement', icon: '🎯' },
            backlog_refinement: { color: '#FF9800', label: 'Backlog Refinement', icon: '🎯' },
            demo: { color: '#00BCD4', label: 'Démo', icon: '🎬' },
            meeting: { color: '#607D8B', label: 'Réunion', icon: '💼' },
            other: { color: '#9E9E9E', label: 'Autre', icon: '📌' }
        };

        // Générer la timeline
        container.innerHTML = `
            <div class="timeline-header">
                <div class="timeline-title">📅 Timeline des événements</div>
                <div class="timeline-range">
                    ${this.formatDate(startDate)} - ${this.formatDate(endDate)}
                </div>
            </div>
            <div class="timeline-weeks">
                ${weeks.map(week => `
                    <div class="timeline-week">
                        <div class="timeline-week-label">${week.label}</div>
                        <div class="timeline-week-dates">
                            ${this.formatDate(week.start)} - ${this.formatDate(week.end)}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="timeline-grid">
                ${this.generateTimelineDays(startDate, endDate, events)}
            </div>
            <div class="timeline-legend">
                <div class="timeline-legend-title">Types d'événements :</div>
                ${eventTypesInUse.map(type => {
                    const typeInfo = eventTypeColors[type] || { color: '#9E9E9E', label: type, icon: '📌' };
                    return `
                        <div class="timeline-legend-item">
                            <div class="timeline-legend-box" style="background: ${typeInfo.color};"></div>
                            <span>${typeInfo.label}</span>
                        </div>
                    `;
                }).join('')}
                <div class="timeline-legend-separator"></div>
                <div class="timeline-legend-item">
                    <div class="timeline-legend-box" style="background: var(--success); border: 2px solid var(--success);"></div>
                    <span>Aujourd'hui</span>
                </div>
            </div>
        `;

        // Ajouter les événements de clic sur les jours
        this.attachTimelineDayClickEvents();
    }

    /**
     * Attacher les événements de clic sur les jours de la timeline
     */
    attachTimelineDayClickEvents() {
        const timelineDays = document.querySelectorAll('.timeline-day.has-events, .timeline-day.has-multiple');
        
        timelineDays.forEach(day => {
            day.addEventListener('click', (e) => {
                const eventsData = e.currentTarget.getAttribute('data-events');
                const date = e.currentTarget.getAttribute('data-date');
                
                if (eventsData) {
                    try {
                        const dayEvents = JSON.parse(eventsData);
                        this.showDayEventsDetails(date, dayEvents);
                    } catch (error) {
                        console.error('Erreur parsing événements:', error);
                    }
                }
            });

            // Changer le curseur au survol
            day.style.cursor = 'pointer';
        });
    }

    /**
     * Afficher les détails des événements d'un jour
     * @param {string} date - Date au format YYYY-MM-DD
     * @param {Array} dayEvents - Événements du jour
     */
    showDayEventsDetails(date, dayEvents) {
        if (!dayEvents || dayEvents.length === 0) return;

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const eventTypeColors = {
            daily: '#FFC107',
            planning: '#2196F3',
            sprint_planning: '#2196F3',
            review: '#4CAF50',
            sprint_review: '#4CAF50',
            retro: '#9C27B0',
            sprint_retrospective: '#9C27B0',
            refinement: '#FF9800',
            backlog_refinement: '#FF9800',
            demo: '#00BCD4',
            meeting: '#607D8B',
            other: '#9E9E9E'
        };

        const details = dayEvents.map(event => {
            const color = eventTypeColors[event.type] || '#9E9E9E';
            const icon = this.getEventIcon(event.type);
            return `
                <li style="padding: 0.75rem; margin-bottom: 0.5rem; background: var(--bg-secondary); border-radius: 6px; border-left: 3px solid ${color};">
                    <div style="font-weight: 600; color: ${color}; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>${icon} ${event.title}</span>
                        ${event.time ? `<span style="margin-left: auto; font-size: 0.85rem; color: var(--text-secondary); font-weight: normal;">${event.time}</span>` : ''}
                    </div>
                    ${event.description ? `<div style="color: var(--text-primary); font-size: 0.85rem; margin-top: 0.25rem;">${event.description}</div>` : ''}
                    ${event.duration ? `<div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.25rem;">⏱️ ${event.duration} min</div>` : ''}
                </li>
            `;
        }).join('');

        // Afficher dans la sidebar
        this.showInSidebar(
            `📅 ${formattedDate}`,
            '#2196F3',
            dayEvents.length,
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

        // Mettre à jour le contenu
        sidebarTitle.textContent = title;
        sidebarIcon.textContent = title.split(' ')[0]; // Premier emoji
        
        sidebarContent.innerHTML = `
            <div class="sidebar-section">
                <div class="sidebar-section-title" style="color: ${color};">
                    ${count} événement${count > 1 ? 's' : ''}
                </div>
                <ul class="sidebar-items" style="list-style: none; padding: 0;">
                    ${content}
                </ul>
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
     * Afficher la timeline compacte
     */
    renderCompactTimeline() {
        const container = document.getElementById('compactTimeline');
        if (!container) return;

        const events = this.data.events || [];
        
        if (events.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1rem; color: #666;">
                    <p>📅 Aucun événement</p>
                </div>
            `;
            return;
        }

        // Grouper par date
        const eventsByDate = {};
        events.forEach(event => {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        });

        container.innerHTML = `
            <div class="compact-timeline-events">
                ${Object.keys(eventsByDate).sort().map(date => {
                    const count = eventsByDate[date].length;
                    const dateObj = new Date(date);
                    return `
                        <div class="compact-event-badge" title="${eventsByDate[date].map(e => e.title).join(', ')}">
                            <div class="compact-event-date">${dateObj.getDate()}/${dateObj.getMonth() + 1}</div>
                            <div class="compact-event-count">${count} événement${count > 1 ? 's' : ''}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Calculer les semaines
     */
    calculateWeeks(startDate, endDate) {
        const weeks = [];
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());

        while (currentDate <= endDate) {
            const weekStart = new Date(currentDate);
            const weekEnd = new Date(currentDate);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            weeks.push({
                start: weekStart,
                end: weekEnd,
                label: `Semaine ${weeks.length + 1}`
            });
            
            currentDate.setDate(currentDate.getDate() + 7);
        }

        return weeks;
    }

    /**
     * Générer toutes les occurrences d'événements (incluant récurrences)
     * @param {Array} events - Liste des événements
     * @param {Date} startDate - Date de début
     * @param {Date} endDate - Date de fin
     * @returns {Object} Événements groupés par date
     */
    generateEventOccurrences(events, startDate, endDate) {
        const eventsByDate = {};
        
        console.log('🔄 Génération occurrences:', {
            eventsCount: events.length,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
        
        events.forEach(event => {
            const eventDate = new Date(event.date);
            
            // Support des deux formats de récurrence
            // Format 1: event.recurrence = { type, interval, days, endDate }
            // Format 2: event.recurrence_type, event.recurrence_interval, etc.
            const isRecurring = event.recurring || 
                               (event.recurrence && event.recurrence.type !== 'none') ||
                               (event.recurrence_type && event.recurrence_type !== 'none');
            
            // Événement non récurrent
            if (!isRecurring) {
                const dateStr = event.date;
                if (!eventsByDate[dateStr]) {
                    eventsByDate[dateStr] = [];
                }
                eventsByDate[dateStr].push(event);
                return;
            }
            
            // Normaliser les données de récurrence
            let recurrenceType, recurrenceInterval, recurrenceDays, recurrenceEndDate;
            
            if (event.recurrence && typeof event.recurrence === 'object') {
                // Format imbriqué
                recurrenceType = event.recurrence.type;
                recurrenceInterval = event.recurrence.interval || 1;
                recurrenceDays = event.recurrence.days || [];
                recurrenceEndDate = event.recurrence.endDate ? new Date(event.recurrence.endDate) : endDate;
            } else {
                // Format plat (PocketBase)
                recurrenceType = event.recurrence_type;
                recurrenceInterval = event.recurrence_interval || 1;
                recurrenceDays = event.recurrence_days || [];
                recurrenceEndDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : endDate;
            }
            
            // Convertir recurrence_days si c'est une string JSON
            if (typeof recurrenceDays === 'string') {
                try {
                    recurrenceDays = JSON.parse(recurrenceDays);
                } catch (e) {
                    recurrenceDays = [];
                }
            }
            
            let currentDate = new Date(eventDate);
            
            console.log('📅 Événement récurrent:', {
                title: event.title,
                type: recurrenceType,
                interval: recurrenceInterval,
                days: recurrenceDays,
                startDate: eventDate.toISOString().split('T')[0],
                endDate: recurrenceEndDate.toISOString().split('T')[0]
            });
            
            while (currentDate <= recurrenceEndDate && currentDate <= endDate) {
                if (currentDate >= startDate) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    
                    // Vérifier si le jour correspond aux critères de récurrence
                    let shouldInclude = false;
                    
                    if (recurrenceType === 'daily') {
                        shouldInclude = true;
                    } else if (recurrenceType === 'weekly') {
                        const dayOfWeek = currentDate.getDay();
                        if (recurrenceDays && recurrenceDays.length > 0) {
                            shouldInclude = recurrenceDays.includes(dayOfWeek);
                        } else {
                            shouldInclude = dayOfWeek === eventDate.getDay();
                        }
                    } else if (recurrenceType === 'monthly') {
                        shouldInclude = currentDate.getDate() === eventDate.getDate();
                    }
                    
                    if (shouldInclude) {
                        if (!eventsByDate[dateStr]) {
                            eventsByDate[dateStr] = [];
                        }
                        eventsByDate[dateStr].push(event);
                    }
                }
                
                // Incrémenter selon le type de récurrence
                if (recurrenceType === 'daily') {
                    currentDate.setDate(currentDate.getDate() + recurrenceInterval);
                } else if (recurrenceType === 'weekly') {
                    currentDate.setDate(currentDate.getDate() + (7 * recurrenceInterval));
                } else if (recurrenceType === 'monthly') {
                    currentDate.setMonth(currentDate.getMonth() + recurrenceInterval);
                }
            }
        });
        
        return eventsByDate;
    }

    /**
     * Générer les jours de la timeline
     */
    generateTimelineDays(startDate, endDate, events) {
        const days = [];
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Générer toutes les occurrences d'événements (incluant récurrences)
        const eventsByDate = this.generateEventOccurrences(events, currentDate, endDate);

        // Couleurs par type d'événement
        const eventColors = {
            daily: '#FFC107',
            planning: '#2196F3',
            sprint_planning: '#2196F3',
            review: '#4CAF50',
            sprint_review: '#4CAF50',
            retro: '#9C27B0',
            sprint_retrospective: '#9C27B0',
            refinement: '#FF9800',
            backlog_refinement: '#FF9800',
            demo: '#00BCD4',
            meeting: '#607D8B',
            other: '#9E9E9E'
        };

        while (currentDate <= endDate || days.length % 7 !== 0) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = currentDate.getTime() === today.getTime();
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            
            let classes = ['timeline-day'];
            if (isWeekend) classes.push('weekend');
            if (isToday) classes.push('today');
            if (dayEvents.length === 1) classes.push('has-events');
            if (dayEvents.length > 1) classes.push('has-multiple');

            // Générer les petits carrés de couleurs pour chaque événement
            let eventSquares = '';
            if (dayEvents.length > 0) {
                // Limiter à 4 carrés maximum
                const displayEvents = dayEvents.slice(0, 4);
                eventSquares = displayEvents.map(event => {
                    const color = eventColors[event.type] || '#2196F3';
                    return `<span class="timeline-event-square" style="background: ${color};" title="${event.title}"></span>`;
                }).join('');
                
                // Ajouter un indicateur "+X" si plus de 4 événements
                if (dayEvents.length > 4) {
                    eventSquares += `<span class="timeline-event-more">+${dayEvents.length - 4}</span>`;
                }
            }

            const dayOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'][currentDate.getDay()];
            const eventTitles = dayEvents.map(e => `${this.getEventIcon(e.type)} ${e.title}`).join('\n');
            
            days.push(`
                <div class="${classes.join(' ')}" 
                     title="${eventTitles}"
                     data-date="${dateStr}"
                     data-events='${JSON.stringify(dayEvents.map(e => ({ title: e.title, type: e.type, time: e.time })))}'>
                    <span class="timeline-day-label">${currentDate.getDate()}</span>
                    <span class="timeline-day-letter">${dayOfWeek}</span>
                    ${eventSquares ? `<div class="timeline-event-squares">${eventSquares}</div>` : ''}
                </div>
            `);
            
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days.join('');
    }

    /**
     * Obtenir l'icône d'un événement
     */
    getEventIcon(type) {
        const icons = {
            daily: '☀️',
            planning: '📋',
            review: '👀',
            retro: '🔄',
            refinement: '🎯',
            demo: '🎬',
            meeting: '💼',
            other: '📌'
        };
        return icons[type] || '📌';
    }

    /**
     * Formater une date
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}
