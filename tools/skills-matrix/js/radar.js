/**
 * Skills Matrix - Logique du radar chart
 */

/**
 * Rendre le radar
 */
function renderRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const isMobile = window.innerWidth <= 768;
    const radius = Math.min(centerX, centerY) - (isMobile ? 110 : 80);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (matrixData.skills.length === 0) {
        ctx.fillStyle = '#95a5a6';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Aucune compétence définie', centerX, centerY);
        return;
    }

    // Draw grid
    drawRadarGrid(ctx, centerX, centerY, radius, matrixData.skills.length);

    // Draw skill labels
    drawSkillLabels(ctx, centerX, centerY, radius, matrixData.skills);

    // Draw member data
    visibleMembers.forEach((memberIndex, idx) => {
        if (memberIndex < matrixData.members.length) {
            const member = matrixData.members[memberIndex];
            const color = skillColors[idx % skillColors.length];
            drawMemberData(ctx, centerX, centerY, radius, member.levels, color, 0.3);
            drawMemberData(ctx, centerX, centerY, radius, member.levels, color, 1, 2);
        }
    });

    // Update legend
    updateRadarLegend();
    updateMemberSelector();
}

/**
 * Dessiner la grille du radar
 */
function drawRadarGrid(ctx, centerX, centerY, radius, numSkills) {
    const levels = 5;
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? 20 : 12;

    // Draw concentric circles
    for (let i = 1; i <= levels; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / levels) * i, 0, 2 * Math.PI);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = isMobile ? 1.5 : 1;
        ctx.stroke();

        // Draw level number
        ctx.fillStyle = '#95a5a6';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(i.toString(), centerX, centerY - (radius / levels) * i - (isMobile ? 8 : 5));
    }

    // Draw axes
    for (let i = 0; i < numSkills; i++) {
        const angle = (Math.PI * 2 * i) / numSkills - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

/**
 * Dessiner les labels des compétences
 */
function drawSkillLabels(ctx, centerX, centerY, radius, skills) {
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? 18 : 14;
    const labelOffset = isMobile ? 60 : 40;

    skills.forEach((skill, i) => {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const labelRadius = radius + labelOffset;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);

        ctx.fillStyle = skillColors[i % skillColors.length];
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Ombre pour meilleure lisibilité sur mobile
        if (isMobile) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        ctx.fillText(skill, x, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    });
}

/**
 * Dessiner les données d'un membre
 */
function drawMemberData(ctx, centerX, centerY, radius, levels, color, alpha = 1, lineWidth = 2) {
    if (levels.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const adjustedLineWidth = isMobile ? lineWidth + 1 : lineWidth;
    const pointRadius = isMobile ? 6 : 4;

    ctx.beginPath();
    levels.forEach((level, i) => {
        const angle = (Math.PI * 2 * i) / levels.length - Math.PI / 2;
        const distance = (radius / 4) * level;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    if (alpha < 1) {
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = adjustedLineWidth;
    ctx.stroke();

    // Draw points
    levels.forEach((level, i) => {
        const angle = (Math.PI * 2 * i) / levels.length - Math.PI / 2;
        const distance = (radius / 4) * level;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Bordure blanche pour meilleure visibilité sur mobile
        if (isMobile) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

/**
 * Mettre à jour la légende du radar
 */
function updateRadarLegend() {
    const legend = document.getElementById('radarLegend');
    if (!legend) return;

    legend.innerHTML = '';

    matrixData.skills.forEach((skill, index) => {
        const item = document.createElement('div');
        item.className = 'legend-skill';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = skillColors[index % skillColors.length];

        const text = document.createElement('span');
        text.textContent = skill;

        item.appendChild(colorBox);
        item.appendChild(text);
        legend.appendChild(item);
    });
}

/**
 * Mettre à jour le sélecteur de membres
 * Note: Cette fonction n'est plus utilisée car le sélecteur est maintenant dans les controls (desktop)
 * et dans le menu mobile. Conservée pour compatibilité.
 */
function updateMemberSelector() {
    // Le sélecteur de membres est maintenant géré par:
    // - Desktop: updateMemberSelectorControl() dans les controls
    // - Mobile: showMobileMemberSelector() dans le menu actions
    // Cette fonction est conservée pour éviter les erreurs mais ne fait plus rien
}

/**
 * Basculer la visibilité d'un membre
 */
function toggleMemberVisibility(index) {
    const idx = visibleMembers.indexOf(index);
    if (idx > -1) {
        visibleMembers.splice(idx, 1);
    } else {
        visibleMembers.push(index);
    }
    
    // Mettre à jour toutes les vues
    renderRadar();
    renderMatrix();
    renderAdvice();
}

console.log('✅ radar.js chargé');


/**
 * Initialiser le dropdown des actions
 */
function initActionsDropdown() {
    const btn = document.getElementById('actionsDropdownBtn');
    const dropdown = document.getElementById('actionsDropdown');
    
    if (!btn || !dropdown) return;

    // Toggle dropdown au clic
    btn.onclick = (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.toggle('active');
        btn.classList.toggle('active', isActive);
    };

    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.actions-dropdown-control')) {
            dropdown.classList.remove('active');
            btn.classList.remove('active');
        }
    });
}

/**
 * Fermer le dropdown des actions
 */
function closeActionsDropdown() {
    const dropdown = document.getElementById('actionsDropdown');
    const btn = document.getElementById('actionsDropdownBtn');
    
    if (dropdown) dropdown.classList.remove('active');
    if (btn) btn.classList.remove('active');
}

/**
 * Initialiser le sélecteur de membres dans les controls
 */
function initMemberSelectorControl() {
    const btn = document.getElementById('memberSelectorBtn');
    const dropdown = document.getElementById('memberSelectorDropdown');
    
    if (!btn || !dropdown) return;

    // Toggle dropdown au clic
    btn.onclick = (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.toggle('active');
        btn.classList.toggle('active', isActive);
        updateMemberSelectorControl();
    };

    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.member-selector-control')) {
            dropdown.classList.remove('active');
            btn.classList.remove('active');
        }
    });
}

/**
 * Mettre à jour le sélecteur de membres dans les controls
 */
function updateMemberSelectorControl() {
    const dropdown = document.getElementById('memberSelectorDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';

    // Bouton Tout/Rien
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'member-toggle-all';
    const allSelected = visibleMembers.length === matrixData.members.length;
    toggleAllBtn.innerHTML = `<span>${allSelected ? '❌ Tout désélectionner' : '✓ Tout sélectionner'}</span>`;
    toggleAllBtn.onclick = (e) => {
        e.stopPropagation();
        toggleAllMembers();
        updateMemberSelectorControl();
    };
    dropdown.appendChild(toggleAllBtn);

    // Séparateur
    const separator = document.createElement('div');
    separator.className = 'member-selector-separator';
    dropdown.appendChild(separator);

    // Liste des membres
    matrixData.members.forEach((member, index) => {
        const btn = document.createElement('button');
        btn.className = 'member-toggle';
        btn.textContent = member.name;
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleMemberVisibility(index);
            updateMemberSelectorControl();
        };

        if (visibleMembers.includes(index)) {
            btn.classList.add('active');
        }

        dropdown.appendChild(btn);
    });
}

/**
 * Tout sélectionner / Tout désélectionner
 */
function toggleAllMembers() {
    if (visibleMembers.length === matrixData.members.length) {
        // Tout désélectionner
        visibleMembers = [];
    } else {
        // Tout sélectionner
        visibleMembers = matrixData.members.map((_, index) => index);
    }
    
    // Mettre à jour toutes les vues
    renderRadar();
    renderMatrix();
    renderAdvice();
}
