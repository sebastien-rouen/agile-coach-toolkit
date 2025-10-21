/**
 * Skills Matrix - Système de conseils automatisés
 */

// Base de connaissances des conseils (style Coach Sticko)
const adviceDatabase = {
    1: { // Débutant
        emoji: '🌱',
        messages: [
            "Pas de panique ! Tout le monde commence quelque part. Voici comment démarrer en douceur.",
            "C'est le moment parfait pour apprendre ! Commence par les bases et tu verras, ça va vite.",
            "Débutant aujourd'hui, expert demain ! Voici ton plan d'action pour progresser.",
            "Super que tu veuilles apprendre ! Voici des ressources pour bien démarrer."
        ],
        messagesWithAppetence: [
            "🎯 <strong>Excellente nouvelle !</strong> Tu as exprimé une <em>appétence</em> pour cette compétence. C'est le moment idéal pour te lancer !",
            "⚡ <strong>Motivation détectée !</strong> Ton <em>appétence</em> va t'aider à progresser rapidement. Profites-en pour apprendre activement.",
            "🌟 <strong>Super !</strong> Ton intérêt pour cette compétence est un atout majeur. Commence par les bases et tu verras, ça va vite."
        ],
        messagesWithOwnership: [
            "🏆 <strong>Responsabilité identifiée !</strong> Tu es <em>owner</em> de ce sujet. Développe cette compétence pour assumer pleinement ton rôle.",
            "👑 <strong>Leadership requis !</strong> En tant qu'<em>owner</em>, tu dois monter en compétence rapidement sur ce sujet.",
            "🎯 <strong>Rôle clé !</strong> Ton <em>ownership</em> nécessite une montée en compétence prioritaire."
        ],
        resources: [
            { icon: '📺', text: 'Tutoriels vidéo pour débutants', type: 'video' },
            { icon: '📖', text: 'Documentation officielle - Getting Started', type: 'doc' },
            { icon: '👥', text: 'Trouver un mentor dans l\'équipe', type: 'mentor' },
            { icon: '💪', text: 'Exercices pratiques niveau débutant', type: 'practice' }
        ],
        actionPlan: "Commence par regarder des tutoriels, puis pratique avec des exercices simples. N'hésite pas à demander de l'aide !",
        actionPlanWithAppetence: "Profite de ta motivation pour apprendre activement ! Commence par les bases, pratique régulièrement et n'hésite pas à demander de l'aide à un mentor.",
        actionPlanWithOwnership: "En tant qu'owner, priorise cette compétence ! Trouve un mentor rapidement, pratique intensivement et fixe-toi un objectif de montée en compétence dans les 2-3 mois."
    },
    2: { // Apprentissage
        emoji: '🚀',
        messages: [
            "Tu progresses bien ! Continue comme ça, tu es sur la bonne voie.",
            "Bravo pour tes efforts ! Voici comment passer au niveau supérieur.",
            "Tu as les bases, maintenant il est temps de pratiquer davantage.",
            "Super progression ! Voici des ressources pour consolider tes acquis."
        ],
        messagesWithAppetence: [
            "🎯 <strong>Excellente progression !</strong> Ton <em>appétence</em> te pousse dans la bonne direction. Continue à pratiquer activement.",
            "⚡ <strong>Motivation payante !</strong> Ton intérêt pour cette compétence accélère ta progression. Passe au niveau supérieur !",
            "🌟 <strong>Super !</strong> Ton <em>appétence</em> combinée à ta pratique te mènera rapidement vers l'expertise."
        ],
        messagesWithOwnership: [
            "🏆 <strong>Responsabilité en cours !</strong> En tant qu'<em>owner</em>, tu dois viser le niveau 3-4 rapidement.",
            "👑 <strong>Leadership en développement !</strong> Ton <em>ownership</em> nécessite une montée en compétence accélérée.",
            "🎯 <strong>Rôle clé !</strong> Continue à progresser pour assumer pleinement ton <em>ownership</em>."
        ],
        resources: [
            { icon: '🎯', text: 'Projets pratiques intermédiaires', type: 'practice' },
            { icon: '📚', text: 'Cours avancés et best practices', type: 'course' },
            { icon: '👥', text: 'Pair programming avec un expert', type: 'mentor' },
            { icon: '🔧', text: 'Challenges et exercices', type: 'challenge' }
        ],
        actionPlan: "Pratique régulièrement avec des projets concrets. Travaille avec des collègues plus expérimentés pour apprendre leurs techniques.",
        actionPlanWithAppetence: "Profite de ta motivation pour accélérer ! Travaille sur des projets concrets, fais du pair programming et fixe-toi un objectif de niveau 3 dans les 3-4 mois.",
        actionPlanWithOwnership: "En tant qu'owner, intensifie ta pratique ! Travaille sur des projets critiques, fais-toi accompagner par un expert et vise le niveau 3-4 dans les 2-3 mois."
    },
    3: { // Compétent
        emoji: '⭐',
        messages: [
            "Excellent niveau ! Tu peux maintenant aider les autres à progresser.",
            "Tu maîtrises bien le sujet ! Pense à partager ton savoir avec l'équipe.",
            "Bravo ! Tu es autonome. Pourquoi ne pas viser l'expertise ?",
            "Super ! Tu peux maintenant te lancer dans des projets complexes."
        ],
        messagesWithAppetence: [
            "🎯 <strong>Maîtrise confirmée !</strong> Ton <em>appétence</em> t'a mené loin. Continue vers l'expertise !",
            "⚡ <strong>Passion récompensée !</strong> Ton intérêt pour cette compétence te permet maintenant d'innover.",
            "🌟 <strong>Excellent !</strong> Ton <em>appétence</em> combinée à ta maîtrise fait de toi une référence."
        ],
        messagesWithOwnership: [
            "🏆 <strong>Responsabilité assumée !</strong> En tant qu'<em>owner</em> niveau 3, tu es maintenant une référence. Vise l'expertise !",
            "👑 <strong>Leadership confirmé !</strong> Ton <em>ownership</em> est bien assumé. Partage ton expertise et vise le niveau 4.",
            "🎯 <strong>Rôle maîtrisé !</strong> Tu assumes pleinement ton <em>ownership</em>. Deviens l'expert de référence !"
        ],
        resources: [
            { icon: '🎓', text: 'Formations avancées et certifications', type: 'certification' },
            { icon: '📝', text: 'Rédiger de la documentation', type: 'doc' },
            { icon: '👨‍🏫', text: 'Devenir mentor pour les juniors', type: 'mentor' },
            { icon: '🚀', text: 'Projets innovants et R&D', type: 'innovation' }
        ],
        actionPlan: "Partage tes connaissances en mentorant d'autres membres. Explore des sujets avancés pour devenir expert.",
        actionPlanWithAppetence: "Continue à explorer les sujets avancés ! Partage ta passion en mentorant, crée de la documentation et innove sur des projets complexes.",
        actionPlanWithOwnership: "En tant qu'owner niveau 3, tu es une référence ! Mentore activement, crée de la documentation de qualité et vise l'expertise (niveau 4) pour assurer le leadership complet."
    },
    4: { // Expert
        emoji: '🏆',
        messages: [
            "Expert reconnu ! Tu es une ressource précieuse pour l'équipe.",
            "Maîtrise totale ! Continue à innover et à partager ton expertise.",
            "Bravo ! Tu es la référence sur ce sujet dans l'équipe.",
            "Excellence ! Pense à documenter tes connaissances pour l'équipe."
        ],
        resources: [
            { icon: '📢', text: 'Conférences et présentations', type: 'speaking' },
            { icon: '✍️', text: 'Articles techniques et blog posts', type: 'writing' },
            { icon: '🎯', text: 'Veille technologique et innovation', type: 'innovation' },
            { icon: '👥', text: 'Mentorat et formation d\'équipe', type: 'mentor' }
        ],
        actionPlan: "Partage ton expertise via des présentations, articles ou formations. Reste à jour avec les dernières innovations."
    }
};

/**
 * Générer la liste des conseils
 */
function generateAdviceList() {
    const memberAdviceMap = {};

    // Filtrer selon visibleMembers
    const membersToProcess = visibleMembers.length > 0
        ? matrixData.members.filter((_, idx) => visibleMembers.includes(idx))
        : matrixData.members;

    membersToProcess.forEach((member) => {
        const memberIndex = matrixData.members.indexOf(member);
        const memberSkills = [];

        member.levels.forEach((level, skillIndex) => {
            // Générer des conseils pour les niveaux 1, 2, 3 (pas pour 0 ni 4)
            if (level >= 1 && level <= 3) {
                memberSkills.push({
                    skill: matrixData.skills[skillIndex],
                    level: level,
                    skillIndex: skillIndex
                });
            }
        });

        if (memberSkills.length > 0) {
            memberAdviceMap[member.name] = {
                member: member.name,
                memberIndex: memberIndex,
                skills: memberSkills
            };
        }
    });

    return Object.values(memberAdviceMap);
}

/**
 * Mode d'affichage des conseils (par défaut: par membre)
 */
let adviceViewMode = 'member'; // 'member' ou 'skill'

/**
 * Rendre les conseils
 */
function renderAdvice() {
    const adviceCards = document.getElementById('adviceCards');
    if (!adviceCards) return;

    adviceCards.innerHTML = '';

    const adviceList = generateAdviceList();

    if (adviceList.length === 0) {
        adviceCards.innerHTML = `
            <div class="no-advice">
                <div style="font-size: 3em; margin-bottom: 20px;">🎉</div>
                <p>Aucun conseil pour le moment !</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Ajoutez des membres et évaluez leurs compétences pour recevoir des conseils personnalisés.</p>
            </div>
        `;
        return;
    }

    if (adviceViewMode === 'member') {
        renderAdviceByMember(adviceList, adviceCards);
    } else {
        renderAdviceBySkill(adviceList, adviceCards);
    }
}

/**
 * Rendre les conseils par membre (mode par défaut)
 */
function renderAdviceByMember(adviceList, container) {
    adviceList.forEach(memberAdvice => {
        const card = createMemberAdviceCard(memberAdvice);
        container.appendChild(card);
    });
}

/**
 * Rendre les conseils par compétence
 */
function renderAdviceBySkill(adviceList, container) {
    // Regrouper par compétence
    const skillMap = {};

    adviceList.forEach(memberAdvice => {
        memberAdvice.skills.forEach(skillData => {
            if (!skillMap[skillData.skill]) {
                skillMap[skillData.skill] = [];
            }
            skillMap[skillData.skill].push({
                member: memberAdvice.member,
                memberIndex: memberAdvice.memberIndex,
                level: skillData.level,
                skillIndex: skillData.skillIndex
            });
        });
    });

    // Créer une carte par compétence
    Object.keys(skillMap).sort().forEach(skillName => {
        const card = createSkillAdviceCard(skillName, skillMap[skillName]);
        container.appendChild(card);
    });
}

/**
 * Vérifier si une compétence correspond à une appétence du membre
 */
function hasAppetenceForSkill(member, skillName) {
    if (!member.appetences || member.appetences.length === 0) return false;
    return member.appetences.some(app => 
        app.toLowerCase().includes(skillName.toLowerCase()) || 
        skillName.toLowerCase().includes(app.toLowerCase())
    );
}

/**
 * Vérifier si une compétence correspond à un ownership du membre
 */
function hasOwnershipForSkill(member, skillName) {
    if (!member.ownerships || member.ownerships.length === 0) return false;
    return member.ownerships.some(own => 
        own.toLowerCase().includes(skillName.toLowerCase()) || 
        skillName.toLowerCase().includes(own.toLowerCase())
    );
}

/**
 * Obtenir le message et le plan d'action adaptés selon le contexte
 */
function getAdaptedAdvice(level, skillName, member) {
    const adviceData = adviceDatabase[level];
    if (!adviceData) return { message: '', actionPlan: '' };
    
    const hasAppetence = hasAppetenceForSkill(member, skillName);
    const hasOwnership = hasOwnershipForSkill(member, skillName);
    
    let message = '';
    let actionPlan = adviceData.actionPlan;
    
    // Prioriser ownership > appétence > message standard
    if (hasOwnership && adviceData.messagesWithOwnership) {
        message = adviceData.messagesWithOwnership[Math.floor(Math.random() * adviceData.messagesWithOwnership.length)];
        actionPlan = adviceData.actionPlanWithOwnership || actionPlan;
    } else if (hasAppetence && adviceData.messagesWithAppetence) {
        message = adviceData.messagesWithAppetence[Math.floor(Math.random() * adviceData.messagesWithAppetence.length)];
        actionPlan = adviceData.actionPlanWithAppetence || actionPlan;
    } else {
        message = adviceData.messages[Math.floor(Math.random() * adviceData.messages.length)];
    }
    
    return { message, actionPlan };
}

/**
 * Trouver des mentors pour une appétence
 */
function findMentorsForAppetence(appetenceName, currentMemberName) {
    const mentors = [];

    matrixData.members.forEach(member => {
        // Ne pas suggérer le membre lui-même
        if (member.name === currentMemberName) return;

        // Vérifier si le membre a cette compétence (skill)
        const skillIndex = matrixData.skills.indexOf(appetenceName);
        if (skillIndex !== -1 && member.levels[skillIndex] >= 3) {
            mentors.push({
                name: member.name,
                type: 'skill',
                level: member.levels[skillIndex]
            });
        }

        // Vérifier si le membre a un ownership sur ce sujet
        if (member.ownerships && member.ownerships.some(own => own.toLowerCase().includes(appetenceName.toLowerCase()))) {
            mentors.push({
                name: member.name,
                type: 'ownership',
                level: 4 // Ownership = expertise
            });
        }
    });

    // Trier par niveau (les plus experts en premier)
    return mentors.sort((a, b) => b.level - a.level);
}

/**
 * Créer une carte de conseil par membre (regroupe toutes les compétences)
 */
function createMemberAdviceCard(memberAdvice) {
    const card = document.createElement('div');
    card.className = 'advice-card member-card';

    const member = matrixData.members.find(m => m.name === memberAdvice.member);
    const hasAppetences = member?.appetences && member.appetences.length > 0;
    const hasOwnerships = member?.ownerships && member.ownerships.length > 0;

    // Trouver des mentors pour les appétences
    const appetenceMentors = {};
    if (hasAppetences) {
        member.appetences.forEach(appetence => {
            const mentorsForAppetence = findMentorsForAppetence(appetence, memberAdvice.member);
            if (mentorsForAppetence.length > 0) {
                appetenceMentors[appetence] = mentorsForAppetence;
            }
        });
    }

    // Générer la liste des compétences à développer
    const skillsList = memberAdvice.skills.map(skillData => {
        const adviceData = adviceDatabase[skillData.level];
        return `
            <div class="skill-item level-${skillData.level}">
                <span class="skill-emoji">${adviceData.emoji}</span>
                <span class="skill-name">${skillData.skill}</span>
                <span class="skill-level">Niveau ${skillData.level}/4</span>
            </div>
        `;
    }).join('');

    // Sections Appétences et Ownerships
    let appetencesSection = '';
    if (hasAppetences) {
        const appetencesWithMentors = member.appetences.map(app => {
            const mentors = appetenceMentors[app] || [];
            return { name: app, mentors };
        });

        appetencesSection = `
            <div class="advice-appetences-section">
                <h4 class="advice-appetences-title">
                    🎯 Appétences
                </h4>
                <div class="advice-appetences-list">
                    ${appetencesWithMentors.map(({ name, mentors }) => `
                        <div class="advice-appetence-item">
                            <div class="advice-appetence-header">
                                <span class="advice-appetence-badge">${name}</span>
                                ${mentors.length > 0 ? `
                                    <span class="advice-appetence-mentors-label">→ Mentors</span>
                                ` : ''}
                            </div>
                            ${mentors.length > 0 ? `
                                <div class="advice-mentors-list">
                                    ${mentors.slice(0, 3).map(mentor => `
                                        <span class="advice-mentor-badge">
                                            ${mentor.type === 'ownership' ? '🏆' : '⭐'} ${mentor.name}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    let ownershipsSection = '';
    if (hasOwnerships) {
        ownershipsSection = `
            <div class="advice-ownerships-section">
                <h4 class="advice-ownerships-title">
                    🏆 Responsabilités
                </h4>
                <div class="advice-ownerships-list">
                    ${member.ownerships.map(own => `
                        <span class="advice-ownership-badge">${own}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="advice-header">
            <span class="advice-emoji">👤</span>
            <div>
                <div class="advice-title">${memberAdvice.member}</div>
                <div class="advice-member">${memberAdvice.skills.length} compétence(s) à développer</div>
            </div>
        </div>

        <div class="advice-skills-list">
            <h4>🎯 Compétences à développer</h4>
            ${skillsList}
        </div>

        ${appetencesSection}
        ${ownershipsSection}

        <div class="advice-message">
            💡 Continue à progresser sur ces compétences pour atteindre l'autonomie complète !
        </div>
    `;

    return card;
}

/**
 * Créer une carte de conseil par compétence (regroupe tous les membres)
 */
function createSkillAdviceCard(skillName, members) {
    const card = document.createElement('div');
    card.className = 'advice-card skill-card';

    // Regrouper par niveau
    const byLevel = {
        1: members.filter(m => m.level === 1),
        2: members.filter(m => m.level === 2),
        3: members.filter(m => m.level === 3)
    };

    // Générer la liste des membres par niveau
    const membersList = Object.keys(byLevel).map(level => {
        if (byLevel[level].length === 0) return '';

        const adviceData = adviceDatabase[level];
        return `
            <div class="level-group level-${level}">
                <div class="level-group-header">
                    <span class="level-emoji">${adviceData.emoji}</span>
                    <span class="level-title">Niveau ${level}/4</span>
                    <span class="level-count">${byLevel[level].length} membre(s)</span>
                </div>
                <div class="level-members">
                    ${byLevel[level].map(m => `
                        <span class="member-badge">${m.member}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }).filter(html => html).join('');

    // Trouver les experts (niveau 4)
    const experts = matrixData.members.filter(member => {
        const skillIndex = matrixData.skills.indexOf(skillName);
        return skillIndex !== -1 && member.levels[skillIndex] === 4;
    });

    let expertsSection = '';
    if (experts.length > 0) {
        expertsSection = `
            <div class="advice-experts-section">
                <h4 class="advice-experts-title">
                    🏆 Experts disponibles
                </h4>
                <div class="advice-experts-list">
                    ${experts.map(expert => `
                        <span class="advice-expert-badge">${expert.name}</span>
                    `).join('')}
                </div>
                <p class="advice-experts-note">
                    Ces membres peuvent aider à progresser sur cette compétence.
                </p>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="advice-header">
            <span class="advice-emoji">🎯</span>
            <div>
                <div class="advice-title">${skillName}</div>
                <div class="advice-member">${members.length} membre(s) en progression</div>
            </div>
        </div>

        <div class="advice-members-by-level">
            ${membersList}
        </div>

        ${expertsSection}

        <div class="advice-message">
            💡 Organisez des sessions de partage de connaissances pour faire progresser toute l'équipe !
        </div>
    `;

    return card;
}

/**
 * Créer une carte de conseil (ancienne version - conservée pour compatibilité)
 */
function createAdviceCard(memberName, skillData) {
    const card = document.createElement('div');
    card.className = `advice-card level-${skillData.level}`;

    // Récupérer le membre pour adapter les conseils
    const member = matrixData.members.find(m => m.name === memberName);
    const adviceData = adviceDatabase[skillData.level];
    
    // Obtenir le message et le plan d'action adaptés selon appétence/ownership
    const adaptedAdvice = getAdaptedAdvice(skillData.level, skillData.skill, member);
    const message = adaptedAdvice.message;
    const actionPlan = adaptedAdvice.actionPlan;

    // Trouver des mentors potentiels
    const mentors = findMentors(skillData.skillIndex, skillData.level);
    const mentorSuggestions = mentors.length > 0 ? mentors.map(m => m.name) : [];

    // Récupérer les infos du membre
    const hasAppetences = member?.appetences && member.appetences.length > 0;
    const hasOwnerships = member?.ownerships && member.ownerships.length > 0;

    // Trouver des mentors pour les appétences
    const appetenceMentors = {};
    if (hasAppetences) {
        member.appetences.forEach(appetence => {
            const mentorsForAppetence = findMentorsForAppetence(appetence, memberName);
            if (mentorsForAppetence.length > 0) {
                appetenceMentors[appetence] = mentorsForAppetence;
            }
        });
    }

    const skillsList = `<strong>${skillData.skill}</strong> (Niveau ${skillData.level}/4)`;

    // Générer les sections supplémentaires
    let appetencesSection = '';
    if (hasAppetences) {
        const appetencesWithMentors = member.appetences.map(app => {
            const mentors = appetenceMentors[app] || [];
            return { name: app, mentors };
        });

        appetencesSection = `
            <div class="advice-appetences-section">
                <h4 class="advice-appetences-title">
                    🎯 Appétences de ${memberName}
                </h4>
                <div class="advice-appetences-list">
                    ${appetencesWithMentors.map(({ name, mentors }) => `
                        <div class="advice-appetence-item">
                            <div class="advice-appetence-header">
                                <span class="advice-appetence-badge">${name}</span>
                                ${mentors.length > 0 ? `
                                    <span class="advice-appetence-mentors-label">→ Mentors disponibles</span>
                                ` : ''}
                            </div>
                            ${mentors.length > 0 ? `
                                <div class="advice-mentors-list">
                                    ${mentors.map(mentor => `
                                        <span class="advice-mentor-badge">
                                            ${mentor.type === 'ownership' ? '🏆' : '⭐'} ${mentor.name}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                <p class="advice-appetences-note">
                    💡 Ces sujets intéressent ${memberName}. ${Object.keys(appetenceMentors).length > 0 ? 'Contacte les mentors suggérés pour progresser !' : 'Pense à les intégrer dans ton plan de développement !'}
                </p>
            </div>
        `;
    }

    let ownershipsSection = '';
    if (hasOwnerships) {
        ownershipsSection = `
            <div class="advice-ownerships-section">
                <h4 class="advice-ownerships-title">
                    🏆 Responsabilités de ${memberName}
                </h4>
                <div class="advice-ownerships-list">
                    ${member.ownerships.map(own => `
                        <span class="advice-ownership-badge">${own}</span>
                    `).join('')}
                </div>
                <p class="advice-ownerships-note">
                    💪 ${memberName} est responsable de ces sujets. Développer cette compétence renforcera son expertise !
                </p>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="advice-header">
            <span class="advice-emoji">${adviceData.emoji}</span>
            <div>
                <div class="advice-title">Conseil pour ${memberName}</div>
                <div class="advice-member">${skillsList}</div>
            </div>
        </div>

        <div class="advice-message">
            ${message}
        </div>

        <div class="advice-skill-section">
            <h4 class="advice-skill-title">🎯 Compétence à développer</h4>
            ${skillsList}
        </div>

        ${appetencesSection}
        ${ownershipsSection}

        <div class="advice-resources">
            <h4>📚 Ressources recommandées</h4>
            ${adviceData.resources.map(resource => `
                <div class="resource-item" onclick="handleResourceClick('${resource.type}', '${resource.text}')">
                    <span class="resource-icon">${resource.icon}</span>
                    <span class="resource-text">${resource.text}</span>
                </div>
            `).join('')}
            ${mentorSuggestions.length > 0 ? `
                <div class="resource-item" onclick="handleResourceClick('mentor', 'Mentors suggérés')">
                    <span class="resource-icon">👥</span>
                    <span class="resource-text">Mentors suggérés : ${mentorSuggestions.join(', ')}</span>
                </div>
            ` : ''}
        </div>

        <div class="action-plan">
            <h4>📋 Plan d'action</h4>
            <p>${actionPlan}</p>
        </div>
    `;

    return card;
}

/**
 * Trouver des mentors potentiels
 */
function findMentors(skillIndex, currentLevel) {
    return matrixData.members.filter(member => {
        const memberLevel = member.levels[skillIndex] || 0;
        return memberLevel >= 3 && memberLevel > currentLevel;
    });
}

/**
 * Gérer le clic sur une ressource
 */
function handleResourceClick(type, text) {
    console.log(`Ressource cliquée: ${type} - ${text}`);
    // Ici vous pouvez ajouter une logique pour ouvrir des liens, etc.
}

/**
 * Changer le mode d'affichage des conseils
 */
function switchAdviceView(mode, targetButton) {
    adviceViewMode = mode;

    // Mettre à jour les boutons de vue
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Réinitialiser le filtre à "Tous"
    activeAdviceFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-btn[onclick*="all"]')?.classList.add('active');

    // Re-rendre les conseils
    renderAdvice();
}

/**
 * Filtrer les conseils
 */
function filterAdvice(filter, targetButton) {
    activeAdviceFilter = filter;

    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Filtrer les cartes selon le mode
    const cards = document.querySelectorAll('.advice-card');

    if (adviceViewMode === 'member') {
        // En mode membre, afficher/masquer les cartes entières
        cards.forEach(card => {
            card.style.display = filter === 'all' ? 'block' : 'none';
        });
    } else {
        // En mode compétence, filtrer les groupes de niveau
        cards.forEach(card => {
            const levelGroups = card.querySelectorAll('.level-group');
            let hasVisibleGroups = false;

            levelGroups.forEach(group => {
                const level = parseInt(group.className.match(/level-(\d)/)[1]);
                let show = false;

                switch (filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'beginner':
                        show = level === 1;
                        break;
                    case 'learning':
                        show = level === 2;
                        break;
                    case 'competent':
                        show = level === 3;
                        break;
                }

                group.style.display = show ? 'block' : 'none';
                if (show) hasVisibleGroups = true;
            });

            // Masquer la carte si aucun groupe n'est visible
            card.style.display = hasVisibleGroups ? 'block' : 'none';
        });
    }
}

/**
 * Mettre à jour toutes les vues de conseils
 */
function updateAllAdviceViews() {
    renderAdvice();
    if (typeof renderStrategicAdvice === 'function') {
        renderStrategicAdvice();
    }
}

/**
 * Exporter les conseils en Markdown
 */
function exportAdviceToMarkdown() {
    try {
        showLoader('📝 Export Markdown...');

        setTimeout(() => {
            let markdown = `# 💡 Conseils Personnalisés - Coach Sticko\n\n`;
            markdown += `*Généré le ${new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}*\n\n`;
            markdown += `---\n\n`;

            // Générer la liste des conseils
            const memberAdviceMap = {};
            const membersToProcess = visibleMembers.length > 0
                ? matrixData.members.filter((_, idx) => visibleMembers.includes(idx))
                : matrixData.members;

            membersToProcess.forEach((member) => {
                const memberSkills = [];
                member.levels.forEach((level, skillIndex) => {
                    if (level >= 1 && level <= 3) {
                        memberSkills.push({
                            skill: matrixData.skills[skillIndex],
                            level: level
                        });
                    }
                });

                if (memberSkills.length > 0) {
                    memberAdviceMap[member.name] = {
                        member: member,
                        skills: memberSkills
                    };
                }
            });

            // Trier par nombre de compétences à améliorer
            const sortedMembers = Object.entries(memberAdviceMap)
                .sort((a, b) => b[1].skills.length - a[1].skills.length);

            // Calculer les statistiques pour le sommaire
            const totalMembers = sortedMembers.length;
            const totalSkillsToImprove = sortedMembers.reduce((sum, [_, data]) => sum + data.skills.length, 0);

            // Compter les compétences uniques
            const uniqueSkills = new Set();
            sortedMembers.forEach(([_, data]) => {
                data.skills.forEach(skill => uniqueSkills.add(skill.skill));
            });

            // Calculer les conseils stratégiques
            let strategicAdvice = null;
            let risksCount = 0;
            let mentoringCount = 0;
            let workloadCount = 0;

            if (typeof generateStrategicAdvice === 'function') {
                strategicAdvice = generateStrategicAdvice();
                risksCount = strategicAdvice.risks ? strategicAdvice.risks.length : 0;
                mentoringCount = strategicAdvice.mentoring ? strategicAdvice.mentoring.length : 0;
                workloadCount = strategicAdvice.workload ? strategicAdvice.workload.length : 0;
            }

            // Générer le sommaire
            markdown += `## 📋 Sommaire\n\n`;
            markdown += `### 📊 Vue d'ensemble\n\n`;
            markdown += `- **${totalMembers}** membre${totalMembers > 1 ? 's' : ''} à accompagner\n`;
            markdown += `- **${totalSkillsToImprove}** compétence${totalSkillsToImprove > 1 ? 's' : ''} à développer (total)\n`;
            markdown += `- **${uniqueSkills.size}** compétence${uniqueSkills.size > 1 ? 's' : ''} unique${uniqueSkills.size > 1 ? 's' : ''} concernée${uniqueSkills.size > 1 ? 's' : ''}\n`;

            if (strategicAdvice) {
                markdown += `- **${risksCount}** risque${risksCount > 1 ? 's' : ''} de compétence identifié${risksCount > 1 ? 's' : ''}\n`;
                markdown += `- **${mentoringCount}** opportunité${mentoringCount > 1 ? 's' : ''} de mentorat\n`;
            }
            markdown += `\n`;

            markdown += `### 📑 Sections du rapport\n\n`;
            markdown += `1. [💡 Conseils par Membre](#-conseils-par-membre)\n`;
            markdown += `   - Conseils personnalisés pour chaque membre\n`;
            markdown += `   - Plans d'action et ressources recommandées\n`;
            markdown += `\n`;
            markdown += `2. [🎯 Conseils par Compétence](#-conseils-par-compétence)\n`;
            markdown += `   - Vue globale par compétence\n`;
            markdown += `   - Identification des experts disponibles\n`;
            markdown += `   - Répartition par niveau (Débutant, Apprentissage, Compétent)\n`;
            markdown += `\n`;
            markdown += `3. [📊 Conseils Stratégiques d'Équipe](#-conseils-stratégiques-déquipe)\n`;

            if (risksCount > 0) {
                markdown += `   - [⚠️ Risques de Compétences](#️-risques-de-compétences) (${risksCount})\n`;
            }
            if (mentoringCount > 0) {
                markdown += `   - [👥 Opportunités de Mentorat](#-opportunités-de-mentorat) (${mentoringCount})\n`;
            }
            if (workloadCount > 0) {
                markdown += `   - [⚖️ Équilibrage de Charge](#️-équilibrage-de-charge) (${workloadCount} membres)\n`;
            }
            markdown += `\n`;

            markdown += `---\n\n`;

            // Section 1: Conseils par membre
            markdown += `# 💡 Conseils par Membre\n\n`;

            // Générer le markdown par membre
            sortedMembers.forEach(([memberName, data]) => {
                markdown += `## 👤 ${memberName}\n\n`;

                // Grouper par niveau
                const skillsByLevel = {
                    1: [],
                    2: [],
                    3: []
                };

                data.skills.forEach(skill => {
                    skillsByLevel[skill.level].push(skill.skill);
                });

                // Niveau 1 - Débutant
                if (skillsByLevel[1].length > 0) {
                    const advice = adviceDatabase[1];
                    markdown += `### ${advice.emoji} Débutant (${skillsByLevel[1].length} compétence${skillsByLevel[1].length > 1 ? 's' : ''})\n\n`;
                    markdown += `**Compétences :** ${skillsByLevel[1].join(', ')}\n\n`;
                    markdown += `**Message :** ${advice.messages[0]}\n\n`;
                    markdown += `**Plan d'action :** ${advice.actionPlan}\n\n`;
                    markdown += `**Ressources recommandées :**\n`;
                    advice.resources.forEach(resource => {
                        markdown += `- ${resource.icon} ${resource.text}\n`;
                    });
                    markdown += `\n`;
                }

                // Niveau 2 - Apprentissage
                if (skillsByLevel[2].length > 0) {
                    const advice = adviceDatabase[2];
                    markdown += `### ${advice.emoji} En apprentissage (${skillsByLevel[2].length} compétence${skillsByLevel[2].length > 1 ? 's' : ''})\n\n`;
                    markdown += `**Compétences :** ${skillsByLevel[2].join(', ')}\n\n`;
                    markdown += `**Message :** ${advice.messages[0]}\n\n`;
                    markdown += `**Plan d'action :** ${advice.actionPlan}\n\n`;
                    markdown += `**Ressources recommandées :**\n`;
                    advice.resources.forEach(resource => {
                        markdown += `- ${resource.icon} ${resource.text}\n`;
                    });
                    markdown += `\n`;
                }

                // Niveau 3 - Compétent
                if (skillsByLevel[3].length > 0) {
                    const advice = adviceDatabase[3];
                    markdown += `### ${advice.emoji} Compétent (${skillsByLevel[3].length} compétence${skillsByLevel[3].length > 1 ? 's' : ''})\n\n`;
                    markdown += `**Compétences :** ${skillsByLevel[3].join(', ')}\n\n`;
                    markdown += `**Message :** ${advice.messages[0]}\n\n`;
                    markdown += `**Plan d'action :** ${advice.actionPlan}\n\n`;
                    markdown += `**Ressources recommandées :**\n`;
                    advice.resources.forEach(resource => {
                        markdown += `- ${resource.icon} ${resource.text}\n`;
                    });
                    markdown += `\n`;
                }

                markdown += `---\n\n`;
            });

            // Ajouter les conseils par compétences
            markdown += `# 🎯 Conseils par Compétence\n\n`;

            // Regrouper par compétence
            const skillMap = {};
            sortedMembers.forEach(([memberName, data]) => {
                data.skills.forEach(skillData => {
                    if (!skillMap[skillData.skill]) {
                        skillMap[skillData.skill] = [];
                    }
                    skillMap[skillData.skill].push({
                        member: memberName,
                        level: skillData.level
                    });
                });
            });

            // Trier les compétences par nombre de personnes à former
            const sortedSkills = Object.entries(skillMap)
                .sort((a, b) => b[1].length - a[1].length);

            sortedSkills.forEach(([skillName, members]) => {
                markdown += `## 🎯 ${skillName}\n\n`;
                markdown += `**${members.length} personne${members.length > 1 ? 's' : ''} à accompagner**\n\n`;

                // Grouper par niveau
                const byLevel = {
                    1: [],
                    2: [],
                    3: []
                };

                members.forEach(m => {
                    byLevel[m.level].push(m.member);
                });

                // Débutants
                if (byLevel[1].length > 0) {
                    markdown += `### 🌱 Débutants (${byLevel[1].length})\n`;
                    byLevel[1].forEach(name => {
                        markdown += `- ${name}\n`;
                    });
                    markdown += `\n`;
                }

                // En apprentissage
                if (byLevel[2].length > 0) {
                    markdown += `### 🚀 En apprentissage (${byLevel[2].length})\n`;
                    byLevel[2].forEach(name => {
                        markdown += `- ${name}\n`;
                    });
                    markdown += `\n`;
                }

                // Compétents
                if (byLevel[3].length > 0) {
                    markdown += `### ⭐ Compétents (${byLevel[3].length})\n`;
                    byLevel[3].forEach(name => {
                        markdown += `- ${name}\n`;
                    });
                    markdown += `\n`;
                }

                // Trouver les experts disponibles pour mentorat
                const experts = matrixData.members.filter(m => {
                    const skillIndex = matrixData.skills.indexOf(skillName);
                    return skillIndex !== -1 && m.levels[skillIndex] === 4;
                });

                if (experts.length > 0) {
                    markdown += `**👨‍🏫 Experts disponibles pour mentorat :** ${experts.map(e => e.name).join(', ')}\n\n`;
                } else {
                    markdown += `**⚠️ Aucun expert disponible** - Envisager une formation externe\n\n`;
                }

                markdown += `---\n\n`;
            });

            // Ajouter les conseils stratégiques si disponibles
            if (typeof generateStrategicAdvice === 'function') {
                const strategicAdvice = generateStrategicAdvice();

                markdown += `# 📊 Conseils Stratégiques d'Équipe\n\n`;

                // Risques de compétences
                if (strategicAdvice.risks && strategicAdvice.risks.length > 0) {
                    markdown += `## ⚠️ Risques de Compétences\n\n`;
                    markdown += `*Compétences avec peu ou pas d'experts - Risque de perte de connaissance*\n\n`;

                    strategicAdvice.risks.forEach(risk => {
                        const riskIcon = risk.riskLevel === 'critical' ? '🔴' : '🟠';
                        const riskLabel = risk.riskLevel === 'critical' ? 'CRITIQUE' : 'ÉLEVÉ';

                        markdown += `### ${riskIcon} ${risk.skill} - Risque ${riskLabel}\n\n`;

                        if (risk.experts.length === 0) {
                            markdown += `**⚠️ AUCUN EXPERT** - Risque de perte de compétence critique\n\n`;
                        } else {
                            markdown += `**Expert unique :** ${risk.experts[0].name}\n\n`;
                        }

                        if (risk.backup.length > 0) {
                            markdown += `**Personnes en backup :**\n`;
                            risk.backup.forEach(member => {
                                const skillIndex = risk.skillIndex;
                                const level = member.levels[skillIndex];
                                const levelLabel = level === 3 ? 'Compétent' : level === 2 ? 'En apprentissage' : 'Débutant';
                                markdown += `- ${member.name} (${levelLabel})\n`;
                            });
                            markdown += `\n`;
                        }

                        markdown += `**Actions recommandées :**\n`;
                        if (risk.experts.length === 0) {
                            markdown += `- 🚨 Formation externe urgente\n`;
                            markdown += `- 📚 Documentation de la compétence\n`;
                            markdown += `- 🔍 Recrutement d'un expert\n`;
                        } else {
                            markdown += `- 👥 Organiser des sessions de partage de connaissances\n`;
                            markdown += `- 📝 Documenter les pratiques et processus\n`;
                            markdown += `- 🎯 Former ${risk.backup.length} personne${risk.backup.length > 1 ? 's' : ''} en backup\n`;
                        }
                        markdown += `\n---\n\n`;
                    });
                }

                // Opportunités de mentorat
                if (strategicAdvice.mentoring && strategicAdvice.mentoring.length > 0) {
                    markdown += `## 👥 Opportunités de Mentorat\n\n`;
                    markdown += `*Paires mentor/mentoré recommandées pour accélérer la montée en compétence*\n\n`;

                    // Grouper par compétence
                    const mentoringBySkill = {};
                    strategicAdvice.mentoring.forEach(opp => {
                        if (!mentoringBySkill[opp.skill]) {
                            mentoringBySkill[opp.skill] = [];
                        }
                        mentoringBySkill[opp.skill].push(opp);
                    });

                    Object.entries(mentoringBySkill).forEach(([skill, opportunities]) => {
                        markdown += `### 🎯 ${skill}\n\n`;

                        opportunities.forEach(opp => {
                            const priorityIcon = opp.hasAppetence ? '⭐' : '📌';
                            const priorityLabel = opp.hasAppetence ? 'PRIORITAIRE (Appétence)' : 'Recommandé';

                            markdown += `**${priorityIcon} ${priorityLabel}**\n`;
                            markdown += `- **mentoré :** ${opp.mentoré.name} (Niveau ${opp.mentoréLevel})\n`;
                            markdown += `- **Mentors disponibles :** ${opp.mentors.map(m => m.name).join(', ')}\n`;

                            if (opp.hasAppetence) {
                                markdown += `- **💡 Motivation élevée** - Cette personne a exprimé une appétence pour cette compétence\n`;
                            }

                            markdown += `\n`;
                        });

                        markdown += `---\n\n`;
                    });
                }

                // Équilibrage de charge
                if (strategicAdvice.workload && strategicAdvice.workload.length > 0) {
                    markdown += `## ⚖️ Équilibrage de Charge\n\n`;
                    markdown += `*Analyse de la répartition des expertises et responsabilités*\n\n`;

                    // Trier par charge (expertises + ownerships)
                    const sortedWorkload = strategicAdvice.workload
                        .sort((a, b) => (b.expertiseCount + b.ownershipsCount) - (a.expertiseCount + a.ownershipsCount));

                    sortedWorkload.forEach(workload => {
                        const totalLoad = workload.expertiseCount + workload.ownershipsCount;
                        const loadIcon = totalLoad > 8 ? '🔴' : totalLoad > 5 ? '🟡' : '🟢';
                        const loadLabel = totalLoad > 8 ? 'Charge élevée' : totalLoad > 5 ? 'Charge moyenne' : 'Charge normale';

                        markdown += `### ${loadIcon} ${workload.member.name} - ${loadLabel}\n\n`;
                        markdown += `- **Expertises (niveau 4) :** ${workload.expertiseCount}\n`;
                        markdown += `- **Ownerships :** ${workload.ownershipsCount}\n`;
                        markdown += `- **Total :** ${totalLoad}\n\n`;

                        if (totalLoad > 8) {
                            markdown += `**⚠️ Recommandations :**\n`;
                            markdown += `- Déléguer certaines responsabilités\n`;
                            markdown += `- Former des backup sur les expertises critiques\n`;
                            markdown += `- Éviter de surcharger avec de nouvelles responsabilités\n\n`;
                        } else if (totalLoad < 3) {
                            markdown += `**💡 Opportunités :**\n`;
                            markdown += `- Peut prendre de nouvelles responsabilités\n`;
                            markdown += `- Candidat idéal pour développer de nouvelles expertises\n\n`;
                        }

                        markdown += `---\n\n`;
                    });
                }
            }

            // Télécharger le fichier
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `conseils-skills-matrix-${getFormattedDate()}.md`;
            link.click();
            URL.revokeObjectURL(url);

            hideLoader();
            showNotification('📝 Export Markdown réussi', 'success');
        }, 300);
    } catch (error) {
        hideLoader();
        console.error('❌ Erreur lors de l\'export Markdown:', error);
        showNotification('⚠️ Impossible d\'exporter en Markdown', 'error');
    }
}

console.log('✅ advice.js chargé');
