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
        resources: [
            { icon: '📺', text: 'Tutoriels vidéo pour débutants', type: 'video' },
            { icon: '📖', text: 'Documentation officielle - Getting Started', type: 'doc' },
            { icon: '👥', text: 'Trouver un mentor dans l\'équipe', type: 'mentor' },
            { icon: '💪', text: 'Exercices pratiques niveau débutant', type: 'practice' }
        ],
        actionPlan: "Commence par regarder des tutoriels, puis pratique avec des exercices simples. N'hésite pas à demander de l'aide !"
    },
    2: { // Apprentissage
        emoji: '🚀',
        messages: [
            "Tu progresses bien ! Continue comme ça, tu es sur la bonne voie.",
            "Bravo pour tes efforts ! Voici comment passer au niveau supérieur.",
            "Tu as les bases, maintenant il est temps de pratiquer davantage.",
            "Super progression ! Voici des ressources pour consolider tes acquis."
        ],
        resources: [
            { icon: '🎯', text: 'Projets pratiques intermédiaires', type: 'practice' },
            { icon: '📚', text: 'Cours avancés et best practices', type: 'course' },
            { icon: '👥', text: 'Pair programming avec un expert', type: 'mentor' },
            { icon: '🔧', text: 'Challenges et exercices', type: 'challenge' }
        ],
        actionPlan: "Pratique régulièrement avec des projets concrets. Travaille avec des collègues plus expérimentés pour apprendre leurs techniques."
    },
    3: { // Compétent
        emoji: '⭐',
        messages: [
            "Excellent niveau ! Tu peux maintenant aider les autres à progresser.",
            "Tu maîtrises bien le sujet ! Pense à partager ton savoir avec l'équipe.",
            "Bravo ! Tu es autonome. Pourquoi ne pas viser l'expertise ?",
            "Super ! Tu peux maintenant te lancer dans des projets complexes."
        ],
        resources: [
            { icon: '🎓', text: 'Formations avancées et certifications', type: 'certification' },
            { icon: '📝', text: 'Rédiger de la documentation', type: 'doc' },
            { icon: '👨‍🏫', text: 'Devenir mentor pour les juniors', type: 'mentor' },
            { icon: '🚀', text: 'Projets innovants et R&D', type: 'innovation' }
        ],
        actionPlan: "Partage tes connaissances en mentorant d'autres membres. Explore des sujets avancés pour devenir expert."
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

    adviceList.forEach(memberAdvice => {
        memberAdvice.skills.forEach(skillData => {
            const card = createAdviceCard(memberAdvice.member, skillData);
            adviceCards.appendChild(card);
        });
    });
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
 * Créer une carte de conseil
 */
function createAdviceCard(memberName, skillData) {
    const card = document.createElement('div');
    card.className = `advice-card level-${skillData.level}`;

    const adviceData = adviceDatabase[skillData.level];
    const message = adviceData.messages[Math.floor(Math.random() * adviceData.messages.length)];

    // Trouver des mentors potentiels
    const mentors = findMentors(skillData.skillIndex, skillData.level);
    const mentorSuggestions = mentors.length > 0 ? mentors.map(m => m.name) : [];

    // Récupérer les infos du membre
    const member = matrixData.members.find(m => m.name === memberName);
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
            <p>${adviceData.actionPlan}</p>
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

    // Filtrer les cartes
    const cards = document.querySelectorAll('.advice-card');
    cards.forEach(card => {
        const level = parseInt(card.className.match(/level-(\d)/)[1]);
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

        card.style.display = show ? 'block' : 'none';
    });
}

console.log('✅ advice.js chargé');
