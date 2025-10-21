/**
 * Radar Renderer - Vue radar type stakeholder mapping
 */

class RadarRenderer {
  constructor(svgId) {
    this.svg = document.getElementById(svgId);
    this.data = null;
  }

  /**
   * Render la vue radar
   * @param {Object} data - Données structurées
   */
  render(data) {
    if (!this.svg || !data) return;

    this.data = data;
    this.svg.innerHTML = '';

    const width = this.svg.clientWidth || 700;
    const height = this.svg.clientHeight || 700;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 80;

    // Créer les cercles concentriques (4 niveaux)
    const levels = 4;
    for (let i = 1; i <= levels; i++) {
      const radius = (maxRadius / levels) * i;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      circle.setAttribute('r', radius);
      circle.setAttribute('class', 'radar-circle');
      this.svg.appendChild(circle);
    }

    // Créer les axes (un par équipe) avec couleurs
    const teams = data.teams;
    const angleStep = (2 * Math.PI) / teams.length;
    const teamColors = this.generateTeamColors(teams.length);

    teams.forEach((team, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + maxRadius * Math.cos(angle);
      const y = centerY + maxRadius * Math.sin(angle);
      const teamColor = team.color || teamColors[index];

      // Ligne d'axe avec couleur de l'équipe
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', teamColor);
      line.setAttribute('stroke-width', '3');
      line.setAttribute('opacity', '0.6');
      this.svg.appendChild(line);

      // Label équipe
      const labelX = centerX + (maxRadius + 30) * Math.cos(angle);
      const labelY = centerY + (maxRadius + 30) * Math.sin(angle);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('class', 'radar-axis-label');
      text.setAttribute('fill', teamColor);
      text.textContent = `${team.icon || '👥'} ${team.name}`;
      this.svg.appendChild(text);
    });

    // Grouper les sujets par équipe et par présence de dépendances
    const subjectsByTeam = this.groupSubjectsByTeam(data);

    // Placer les sujets sur le radar
    teams.forEach((team, teamIndex) => {
      const teamSubjects = subjectsByTeam[team.id] || [];
      const angle = teamIndex * angleStep - Math.PI / 2;
      const teamColor = team.color || teamColors[teamIndex];

      // Séparer les sujets avec et sans dépendances
      const withDeps = teamSubjects.filter(s => s.dependencies && s.dependencies.length > 0);
      const withoutDeps = teamSubjects.filter(s => !s.dependencies || s.dependencies.length === 0);

      // Placer les sujets sans dépendances sur la ligne droite
      withoutDeps.forEach((subject, index) => {
        this.renderSubjectOnAxis(subject, angle, centerX, centerY, maxRadius, index, withoutDeps.length, teamColor);
      });

      // Placer les sujets avec dépendances (avec variation)
      withDeps.forEach(subject => {
        this.renderSubjectWithDependencies(subject, teams, centerX, centerY, maxRadius, angleStep, teamColor);
      });
    });
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
   * Génère des couleurs pour les équipes
   * @param {number} count - Nombre d'équipes
   * @returns {Array} - Tableau de couleurs
   */
  generateTeamColors(count) {
    const colors = [
      '#3498db', // Bleu
      '#2ecc71', // Vert
      '#9b59b6', // Violet
      '#f39c12', // Orange
      '#e74c3c', // Rouge
      '#1abc9c', // Turquoise
      '#34495e', // Gris foncé
      '#e67e22'  // Orange foncé
    ];
    return colors.slice(0, count);
  }

  /**
   * Render un sujet sur l'axe (sans dépendances)
   * @param {Object} subject - Sujet à afficher
   * @param {number} angle - Angle de l'axe
   * @param {number} centerX - Centre X
   * @param {number} centerY - Centre Y
   * @param {number} maxRadius - Rayon maximum
   * @param {number} index - Index du sujet sur l'axe
   * @param {number} total - Nombre total de sujets sur l'axe
   * @param {string} teamColor - Couleur de l'équipe
   */
  renderSubjectOnAxis(subject, angle, centerX, centerY, maxRadius, index, total, teamColor) {
    const status = AlertEngine.getAlertStatus(subject);
    const distance = this.getDistanceFromStatus(status, maxRadius);

    // Espacement régulier sur l'axe
    const spacing = 20; // pixels entre chaque sujet
    const offset = (index - (total - 1) / 2) * spacing;
    
    const x = centerX + distance * Math.cos(angle) + offset * Math.sin(angle);
    const y = centerY + distance * Math.sin(angle) - offset * Math.cos(angle);

    this.createSubjectPoint(subject, x, y, status, teamColor);
  }

  /**
   * Render un sujet avec dépendances (avec variation)
   * @param {Object} subject - Sujet à afficher
   * @param {Array} teams - Liste des équipes
   * @param {number} centerX - Centre X
   * @param {number} centerY - Centre Y
   * @param {number} maxRadius - Rayon maximum
   * @param {number} angleStep - Pas angulaire
   * @param {string} teamColor - Couleur de l'équipe
   */
  renderSubjectWithDependencies(subject, teams, centerX, centerY, maxRadius, angleStep, teamColor) {
    // Si le sujet est cross-team (plusieurs équipes), le placer entre les équipes
    if (subject.teams && subject.teams.length > 1) {
      this.renderCrossTeamSubject(subject, teams, centerX, centerY, maxRadius, angleStep, teamColor);
      return;
    }

    // Sinon, placer avec variation angulaire (comportement actuel)
    const teamId = subject.teams && subject.teams.length > 0 ? subject.teams[0] : null;
    if (!teamId) return;

    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return;

    // Calculer l'angle de base
    const baseAngle = teamIndex * angleStep - Math.PI / 2;

    // Calculer la distance depuis le centre (basée sur la criticité)
    const status = AlertEngine.getAlertStatus(subject);
    const distance = this.getDistanceFromStatus(status, maxRadius);

    // Créer une variation angulaire pour éviter les superpositions
    const hash = this.hashString(subject.title);
    const angleVariation = ((hash % 100) / 100 - 0.5) * (angleStep * 0.6);
    const distanceVariation = ((hash % 50) / 50 - 0.5) * (maxRadius * 0.15);
    
    const angle = baseAngle + angleVariation;
    const finalDistance = Math.max(maxRadius * 0.1, distance + distanceVariation);
    
    const x = centerX + finalDistance * Math.cos(angle);
    const y = centerY + finalDistance * Math.sin(angle);

    this.createSubjectPoint(subject, x, y, status, teamColor);
  }

  /**
   * Render un sujet cross-team entre les équipes concernées
   * @param {Object} subject - Sujet cross-team
   * @param {Array} teams - Liste des équipes
   * @param {number} centerX - Centre X
   * @param {number} centerY - Centre Y
   * @param {number} maxRadius - Rayon maximum
   * @param {number} angleStep - Pas angulaire
   * @param {string} teamColor - Couleur de l'équipe principale
   */
  renderCrossTeamSubject(subject, teams, centerX, centerY, maxRadius, angleStep, teamColor) {
    // Trouver les indices des équipes concernées
    const teamIndices = subject.teams
      .map(teamId => teams.findIndex(t => t.id === teamId))
      .filter(idx => idx !== -1)
      .sort((a, b) => a - b);

    if (teamIndices.length < 2) return;

    // Calculer l'angle moyen entre les équipes
    const angles = teamIndices.map(idx => idx * angleStep - Math.PI / 2);
    let avgAngle = angles.reduce((sum, a) => sum + a, 0) / angles.length;

    // Gérer le cas où les équipes sont de part et d'autre de l'axe 0
    const angleSpread = Math.max(...angles) - Math.min(...angles);
    if (angleSpread > Math.PI) {
      // Ajuster pour éviter de passer par le mauvais côté
      avgAngle = avgAngle > 0 ? avgAngle - Math.PI : avgAngle + Math.PI;
    }

    // Distance basée sur la criticité
    const status = AlertEngine.getAlertStatus(subject);
    const distance = this.getDistanceFromStatus(status, maxRadius);

    const x = centerX + distance * Math.cos(avgAngle);
    const y = centerY + distance * Math.sin(avgAngle);

    // Créer le point avec couleur mixte (utiliser la première équipe)
    const firstTeamColor = teams[teamIndices[0]].color || teamColor;
    this.createSubjectPoint(subject, x, y, status, firstTeamColor);

    // Dessiner des lignes vers chaque équipe concernée
    teamIndices.forEach(teamIdx => {
      const teamAngle = teamIdx * angleStep - Math.PI / 2;
      const teamX = centerX + maxRadius * Math.cos(teamAngle);
      const teamY = centerY + maxRadius * Math.sin(teamAngle);
      const teamLineColor = teams[teamIdx].color || teamColor;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
      line.setAttribute('x2', teamX);
      line.setAttribute('y2', teamY);
      line.setAttribute('stroke', teamLineColor);
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,4');
      line.setAttribute('opacity', '0.3');
      line.setAttribute('class', 'dependency-line');
      this.svg.insertBefore(line, this.svg.firstChild); // Insérer en arrière-plan
    });
  }

  /**
   * Crée un point pour un sujet
   * @param {Object} subject - Sujet
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {string} status - Statut d'alerte
   * @param {string} teamColor - Couleur de l'équipe
   */
  createSubjectPoint(subject, x, y, status, teamColor) {
    // Couleur selon le statut
    const statusColor = this.getColorFromStatus(status);

    // Créer le point avec bordure de couleur d'équipe
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', subject.type === 'cross-team' ? 10 : 8);
    circle.setAttribute('fill', statusColor);
    circle.setAttribute('stroke', teamColor);
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('class', 'radar-point');
    circle.setAttribute('data-title', subject.title);
    
    // Tooltip au survol
    circle.addEventListener('mouseenter', (e) => {
      this.showTooltip(e, subject, teamColor);
    });
    circle.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });

    this.svg.appendChild(circle);

    // Label (seulement pour les sujets critiques)
    if (status === 'danger') {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y - 15);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'radar-point-label');
      text.setAttribute('style', 'pointer-events: none;');
      text.textContent = subject.title.substring(0, 15) + (subject.title.length > 15 ? '...' : '');
      this.svg.appendChild(text);
    }
  }

  /**
   * Calcule la distance depuis le centre selon le statut
   * @param {string} status - Statut d'alerte
   * @param {number} maxRadius - Rayon maximum
   * @returns {number} - Distance
   */
  getDistanceFromStatus(status, maxRadius) {
    const distances = {
      'danger': maxRadius * 0.9,      // Proche du bord (critique)
      'warning': maxRadius * 0.65,    // Milieu-extérieur
      'success': maxRadius * 0.35,    // Milieu-intérieur
      'neutral': maxRadius * 0.15     // Proche du centre
    };
    return distances[status] || maxRadius * 0.5;
  }

  /**
   * Retourne la couleur selon le statut
   * @param {string} status - Statut d'alerte
   * @returns {string} - Couleur hexadécimale
   */
  getColorFromStatus(status) {
    const colors = {
      'danger': '#dc3545',
      'warning': '#fd7e14',
      'success': '#28a745',
      'neutral': '#6c757d'
    };
    return colors[status] || '#6c757d';
  }

  /**
   * Affiche un tooltip enrichi
   * @param {Event} event - Événement mouse
   * @param {Object} subject - Sujet
   * @param {string} teamColor - Couleur de l'équipe
   */
  showTooltip(event, subject, teamColor) {
    // Créer ou récupérer le tooltip
    let tooltip = document.getElementById('radar-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'radar-tooltip';
      document.body.appendChild(tooltip);
    }

    const status = AlertEngine.getAlertStatus(subject);
    const statusEmoji = AlertEngine.getStatusEmoji(status);
    const statusLabel = AlertEngine.getStatusLabel(status);

    // Emoji de priorité
    const priorityEmojis = {
      critical: '🔥',
      high: '⚡',
      medium: '⭐',
      low: '💡'
    };
    const priorityEmoji = priorityEmojis[subject.priority] || '';

    // Badge de priorité
    const priorityBadges = {
      critical: '🔴 CRITIQUE',
      high: '🟠 HAUTE',
      medium: '🟡 MOYENNE',
      low: '🟢 BASSE'
    };
    const priorityBadge = priorityBadges[subject.priority] || subject.priority;

    // Calcul des jours restants
    let deadlineInfo = '';
    if (subject.deadline) {
      const daysUntil = AlertEngine.getDaysUntilDeadline(subject.deadline);
      let deadlineEmoji = '📆';
      let deadlineText = '';
      
      if (daysUntil < 0) {
        deadlineEmoji = '⏰';
        deadlineText = `En retard de ${Math.abs(daysUntil)} jour(s)`;
      } else if (daysUntil === 0) {
        deadlineEmoji = '⏱️';
        deadlineText = 'Aujourd\'hui';
      } else if (daysUntil <= 3) {
        deadlineEmoji = '⏱️';
        deadlineText = `Dans ${daysUntil} jour(s)`;
      } else if (daysUntil <= 7) {
        deadlineEmoji = '📆';
        deadlineText = `Dans ${daysUntil} jours`;
      } else {
        deadlineEmoji = '📆';
        deadlineText = `Dans ${daysUntil} jours`;
      }
      
      deadlineInfo = `${deadlineEmoji} ${subject.deadline} (${deadlineText})`;
    }

    // Équipes avec couleurs
    let teamsInfo = '';
    if (subject.teams && subject.teams.length > 0) {
      const teamNames = subject.teams.map(teamId => {
        const team = this.data.teams.find(t => t.id === teamId);
        return team ? `<span style="color: ${team.color || teamColor}">${team.icon || '👥'} ${team.name}</span>` : teamId;
      }).join(', ');
      teamsInfo = `<div style="margin-top: 8px;"><strong>Équipes:</strong> ${teamNames}</div>`;
    }

    // Dépendances
    let depsInfo = '';
    if (subject.dependencies && subject.dependencies.length > 0) {
      depsInfo = `<div style="margin-top: 8px;"><strong>🔗 Dépendances:</strong><br><small>${subject.dependencies.join('<br>')}</small></div>`;
    }

    // Description
    let descInfo = '';
    if (subject.description) {
      const shortDesc = subject.description.length > 100 
        ? subject.description.substring(0, 100) + '...' 
        : subject.description;
      descInfo = `<div style="margin-top: 8px; font-style: italic; opacity: 0.9;"><small>${shortDesc}</small></div>`;
    }

    tooltip.innerHTML = `
      <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">
        ${statusEmoji} ${subject.title}
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
        <div><strong>Statut:</strong> ${statusLabel} ${subject.status === 'blocked' ? '🚫 Bloqué' : ''}</div>
        <div><strong>Type:</strong> ${subject.type === 'cross-team' ? '🔄 Cross-équipe' : subject.type === 'team' ? '👥 Équipe' : '👤 Individuel'}</div>
        ${subject.priority ? `<div><strong>Priorité:</strong> ${priorityEmoji} ${priorityBadge}</div>` : ''}
        ${deadlineInfo ? `<div><strong>Échéance:</strong> ${deadlineInfo}</div>` : ''}
      </div>
      ${teamsInfo}
      ${depsInfo}
      ${descInfo}
    `;

    tooltip.style.left = event.pageX + 15 + 'px';
    tooltip.style.top = event.pageY + 15 + 'px';
    tooltip.style.display = 'block';
  }

  /**
   * Masque le tooltip
   */
  hideTooltip() {
    const tooltip = document.getElementById('radar-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  /**
   * Génère un hash numérique à partir d'une chaîne
   * @param {string} str - Chaîne à hasher
   * @returns {number} - Hash numérique
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Nettoie la vue radar
   */
  clear() {
    if (this.svg) {
      this.svg.innerHTML = '';
    }
    this.hideTooltip();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RadarRenderer;
}
