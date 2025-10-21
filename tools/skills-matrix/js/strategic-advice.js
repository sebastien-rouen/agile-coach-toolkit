/**
 * Skills Matrix - Conseils Stratégiques d'Équipe
 */

/**
 * Générer tous les conseils stratégiques
 */
function generateStrategicAdvice() {
    const advice = {
        risks: analyzeSkillRisks(),
        mentoring: analyzeMentoringOpportunities(),
        workload: analyzeWorkloadBalance()
    };
    
    return advice;
}

/**
 * Analyser les risques de compétences
 */
function analyzeSkillRisks() {
    const risks = [];
    
    matrixData.skills.forEach((skill, skillIndex) => {
        const experts = matrixData.members.filter(m => m.levels[skillIndex] === 4);
        const competent = matrixData.members.filter(m => m.levels[skillIndex] === 3);
        const learning = matrixData.members.filter(m => m.levels[skillIndex] >= 1 && m.levels[skillIndex] <= 2);
        
        // Risque critique : 0 ou 1 expert
        if (experts.length <= 1) {
            const riskLevel = experts.length === 0 ? 'critical' : 'high';
            const backup = competent.length > 0 ? competent : learning;
            
            risks.push({
                skill: skill,
                skillIndex: skillIndex,
                riskLevel: riskLevel,
                experts: experts,
                backup: backup,
                inTraining: learning.length
            });
        }
    });
    
    // Trier par niveau de risque (critical > high)
    return risks.sort((a, b) => {
        if (a.riskLevel === 'critical' && b.riskLevel !== 'critical') return -1;
        if (a.riskLevel !== 'critical' && b.riskLevel === 'critical') return 1;
        return 0;
    });
}

/**
 * Analyser les opportunités de mentorat
 */
function analyzeMentoringOpportunities() {
    const opportunities = [];
    
    matrixData.skills.forEach((skill, skillIndex) => {
        const experts = matrixData.members.filter(m => m.levels[skillIndex] === 4);
        const beginners = matrixData.members.filter(m => m.levels[skillIndex] >= 1 && m.levels[skillIndex] <= 2);
        
        // Chercher les débutants avec appétence pour cette compétence
        beginners.forEach(beginner => {
            const hasAppetence = beginner.appetences && beginner.appetences.some(app => 
                app.toLowerCase().includes(skill.toLowerCase()) || 
                skill.toLowerCase().includes(app.toLowerCase())
            );
            
            if (experts.length > 0) {
                opportunities.push({
                    skill: skill,
                    skillIndex: skillIndex,
                    mentee: beginner,
                    menteeLevel: beginner.levels[skillIndex],
                    mentors: experts,
                    hasAppetence: hasAppetence,
                    priority: hasAppetence ? 'high' : 'medium'
                });
            }
        });
    });
    
    // Trier par priorité (appétence en premier)
    return opportunities.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return 0;
    });
}

/**
 * Analyser l'équilibrage de charge
 */
function analyzeWorkloadBalance() {
    const workloads = [];
    
    matrixData.members.forEach((member, memberIndex) => {
        const expertiseCount = member.levels.filter(l => l === 4).length;
        const ownershipsCount = member.ownerships ? member.ownerships.length : 0;
        const learningCount = member.levels.filter(l => l >= 1 && l <= 2).length;
        
        // Calculer un score de charge (pondéré)
        const workloadScore = (expertiseCount * 3) + (ownershipsCount * 2) + (learningCount * 1);
        
        let status = 'balanced';
        let recommendations = [];
        
        // Surcharge
        if (workloadScore > 15 || ownershipsCount > 4) {
            status = 'overloaded';
            recommendations.push('Déléguer certaines responsabilités');
            recommendations.push('Réduire le nombre d\'ownerships');
            recommendations.push('Former des successeurs');
        }
        // Sous-charge
        else if (workloadScore < 5 && expertiseCount === 0 && ownershipsCount === 0) {
            status = 'underutilized';
            recommendations.push('Proposer des responsabilités');
            recommendations.push('Identifier des appétences');
            recommendations.push('Planifier des formations');
        }
        
        if (status !== 'balanced') {
            workloads.push({
                member: member,
                memberIndex: memberIndex,
                status: status,
                expertiseCount: expertiseCount,
                ownershipsCount: ownershipsCount,
                learningCount: learningCount,
                workloadScore: workloadScore,
                recommendations: recommendations
            });
        }
    });
    
    // Trier par score de charge (décroissant)
    return workloads.sort((a, b) => b.workloadScore - a.workloadScore);
}

/**
 * Rendre les conseils stratégiques
 */
function renderStrategicAdvice() {
    const container = document.getElementById('strategicAdviceCards');
    if (!container) return;
    
    container.innerHTML = '';
    
    const advice = generateStrategicAdvice();
    
    // Vérifier s'il y a des conseils
    const hasAdvice = advice.risks.length > 0 || 
                      advice.mentoring.length > 0 || 
                      advice.workload.length > 0;
    
    if (!hasAdvice) {
        container.innerHTML = `
            <div class="no-advice">
                <div style="font-size: 3em; margin-bottom: 20px;">✅</div>
                <p>Aucun conseil stratégique pour le moment !</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Votre équipe est bien équilibrée.</p>
            </div>
        `;
        return;
    }
    
    // Rendre les risques
    if (advice.risks.length > 0) {
        advice.risks.slice(0, 5).forEach(risk => {
            container.appendChild(createRiskCard(risk));
        });
    }
    
    // Rendre les opportunités de mentorat
    if (advice.mentoring.length > 0) {
        advice.mentoring.slice(0, 5).forEach(opportunity => {
            container.appendChild(createMentoringCard(opportunity));
        });
    }
    
    // Rendre l'équilibrage de charge
    if (advice.workload.length > 0) {
        advice.workload.slice(0, 3).forEach(workload => {
            container.appendChild(createWorkloadCard(workload));
        });
    }
}

/**
 * Créer une carte de risque
 */
function createRiskCard(risk) {
    const card = document.createElement('div');
    card.className = `strategic-card risk-card risk-${risk.riskLevel}`;
    
    // Créer les badges pour les experts
    const expertsBadges = risk.experts.length > 0 
        ? risk.experts.map(e => `<span class="strategic-member-badge expert">${e.name}</span>`).join('')
        : '<span class="stat-value">Aucun</span>';
    
    // Créer les badges pour les backups
    const backupBadges = risk.backup.length > 0
        ? risk.backup.slice(0, 3).map(b => 
            `<span class="strategic-member-badge backup">${b.name} (niv ${b.levels[risk.skillIndex]})</span>`
          ).join('')
        : '<span class="stat-value">Aucun</span>';
    
    card.innerHTML = `
        <div class="strategic-header">
            <span class="strategic-icon">${risk.riskLevel === 'critical' ? '🚨' : '⚠️'}</span>
            <div style="flex: 1;">
                <div class="strategic-title">Risque ${risk.riskLevel === 'critical' ? 'Critique' : 'Élevé'}</div>
                <div class="strategic-subtitle">${risk.skill}</div>
            </div>
        </div>
        
        <div class="strategic-content">
            <div class="strategic-stat">
                <span class="stat-label">🏆 Experts :</span>
            </div>
            <div class="strategic-members-list">
                ${expertsBadges}
            </div>
            
            <div class="strategic-stat" style="margin-top: 12px;">
                <span class="stat-label">🔄 Backup :</span>
            </div>
            <div class="strategic-members-list">
                ${backupBadges}
            </div>
            
            <div class="strategic-stat" style="margin-top: 12px;">
                <span class="stat-label">🌱 En formation :</span>
                <span class="stat-value">${risk.inTraining} personne(s)</span>
            </div>
        </div>
        
        <div class="strategic-recommendations">
            <h4>💡 Recommandations</h4>
            <ul>
                ${risk.experts.length === 0 ? '<li>Former d\'urgence au moins 2 personnes</li>' : ''}
                ${risk.experts.length === 1 ? `<li>Former un backup pour ${risk.experts[0].name}</li>` : ''}
                <li>Documenter les bonnes pratiques</li>
                <li>Planifier des sessions de partage</li>
                ${risk.backup.length > 0 ? `<li>Accompagner ${risk.backup[0].name} vers l'expertise</li>` : ''}
            </ul>
        </div>
    `;
    
    return card;
}

/**
 * Créer une carte d'opportunité de mentorat
 */
function createMentoringCard(opportunity) {
    const card = document.createElement('div');
    card.className = `strategic-card mentoring-card ${opportunity.priority === 'high' ? 'priority-high' : ''}`;
    
    // Badge pour le mentoré
    const menteeBadge = `<span class="strategic-member-badge mentee">${opportunity.mentee.name} (niveau ${opportunity.menteeLevel})</span>`;
    
    // Badges pour les mentors
    const mentorsBadges = opportunity.mentors.slice(0, 2).map(m => 
        `<span class="strategic-member-badge expert">${m.name}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="strategic-header">
            <span class="strategic-icon">🤝</span>
            <div style="flex: 1;">
                <div class="strategic-title">Opportunité de Mentorat ${opportunity.hasAppetence ? '⭐' : ''}</div>
                <div class="strategic-subtitle">${opportunity.skill}</div>
            </div>
        </div>
        
        <div class="strategic-content">
            <div class="strategic-stat">
                <span class="stat-label">🌱 Mentoré :</span>
            </div>
            <div class="strategic-members-list">
                ${menteeBadge}
            </div>
            
            ${opportunity.hasAppetence ? `
                <div class="strategic-stat appetence-detected" style="margin-top: 12px;">
                    <span class="stat-label">🎯 Appétence détectée :</span>
                    <span class="stat-value">Forte motivation !</span>
                </div>
            ` : ''}
            
            <div class="strategic-stat" style="margin-top: 12px;">
                <span class="stat-label">🏆 Mentors suggérés :</span>
            </div>
            <div class="strategic-members-list">
                ${mentorsBadges}
            </div>
        </div>
        
        <div class="strategic-recommendations">
            <h4>💡 Plan d'action</h4>
            <ul>
                <li>Planifier 1h/semaine de pair programming</li>
                <li>Définir un projet fil rouge concret</li>
                <li>Suivi mensuel des progrès</li>
                <li>Objectif : niveau ${opportunity.menteeLevel + 1} dans 3 mois</li>
            </ul>
        </div>
    `;
    
    return card;
}

/**
 * Créer une carte d'équilibrage de charge
 */
function createWorkloadCard(workload) {
    const card = document.createElement('div');
    card.className = `strategic-card workload-card workload-${workload.status}`;
    
    const statusText = workload.status === 'overloaded' ? 'Surcharge' : 'Sous-utilisé';
    const statusIcon = workload.status === 'overloaded' ? '⚖️' : '📊';
    
    // Badge pour le membre
    const memberBadge = `<span class="strategic-member-badge">${workload.member.name}</span>`;
    
    card.innerHTML = `
        <div class="strategic-header">
            <span class="strategic-icon">${statusIcon}</span>
            <div style="flex: 1;">
                <div class="strategic-title">${statusText}</div>
                <div class="strategic-members-list" style="margin-top: 8px;">
                    ${memberBadge}
                </div>
            </div>
        </div>
        
        <div class="strategic-content">
            <div class="strategic-stat">
                <span class="stat-label">🏆 Expertises :</span>
                <span class="stat-value">${workload.expertiseCount}</span>
            </div>
            <div class="strategic-stat">
                <span class="stat-label">🎯 Ownerships :</span>
                <span class="stat-value">${workload.ownershipsCount}</span>
            </div>
            <div class="strategic-stat">
                <span class="stat-label">🌱 En apprentissage :</span>
                <span class="stat-value">${workload.learningCount}</span>
            </div>
            <div class="strategic-stat">
                <span class="stat-label">📊 Score de charge :</span>
                <span class="stat-value">${workload.workloadScore}</span>
            </div>
        </div>
        
        <div class="strategic-recommendations">
            <h4>💡 Recommandations</h4>
            <ul>
                ${workload.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    return card;
}

/**
 * Exporter les conseils stratégiques pour Excel
 */
function exportStrategicAdviceData() {
    const advice = generateStrategicAdvice();
    const data = [];
    
    // En-tête
    data.push(['Type', 'Priorité', 'Sujet', 'Détails', 'Recommandations']);
    
    // Risques
    advice.risks.forEach(risk => {
        const experts = risk.experts.length > 0 
            ? risk.experts.map(e => e.name).join(', ')
            : 'Aucun';
        const backup = risk.backup.length > 0
            ? risk.backup.slice(0, 3).map(b => `${b.name} (niv ${b.levels[risk.skillIndex]})`).join(', ')
            : 'Aucun';
        
        const details = `Experts: ${experts} | Backup: ${backup} | En formation: ${risk.inTraining}`;
        const recommendations = risk.experts.length === 0 
            ? 'Former d\'urgence 2+ personnes, Documenter'
            : `Former backup pour ${risk.experts[0].name}, Documenter`;
        
        data.push([
            'Risque',
            risk.riskLevel === 'critical' ? 'CRITIQUE' : 'ÉLEVÉ',
            risk.skill,
            details,
            recommendations
        ]);
    });
    
    // Mentorat
    advice.mentoring.forEach(opp => {
        const mentors = opp.mentors.slice(0, 2).map(m => m.name).join(', ');
        const details = `Mentoré: ${opp.mentee.name} (niv ${opp.menteeLevel}) | Mentors: ${mentors}${opp.hasAppetence ? ' | Appétence détectée ⭐' : ''}`;
        const recommendations = '1h/semaine pairing, Projet fil rouge, Suivi mensuel';
        
        data.push([
            'Mentorat',
            opp.priority === 'high' ? 'HAUTE' : 'MOYENNE',
            opp.skill,
            details,
            recommendations
        ]);
    });
    
    // Charge
    advice.workload.forEach(wl => {
        const details = `Expertises: ${wl.expertiseCount} | Ownerships: ${wl.ownershipsCount} | Apprentissage: ${wl.learningCount} | Score: ${wl.workloadScore}`;
        const recommendations = wl.recommendations.join(', ');
        
        data.push([
            'Charge',
            wl.status === 'overloaded' ? 'SURCHARGE' : 'SOUS-UTILISÉ',
            wl.member.name,
            details,
            recommendations
        ]);
    });
    
    return data;
}

console.log('✅ strategic-advice.js chargé');
