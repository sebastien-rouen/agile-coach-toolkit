/**
 * PocketBase Integration pour Velocity Squad
 * 
 * Gère la synchronisation entre l'interface et PocketBase
 * Fallback automatique vers localStorage si PocketBase indisponible
 * Gestion des sessions d'équipe pour réutilisation
 */

// Configuration PocketBase
const PB_CONFIG = {
    baseUrl: '/pb',
    collections: {
        sessions: 'tools_velocity_squad_sessions',
        sprints: 'tools_velocity_squad_sprints',
        team: 'tools_velocity_squad_team',
        annotations: 'tools_velocity_squad_annotations',
        mood: 'tools_velocity_squad_mood',
        events: 'tools_velocity_squad_events'
    }
};

// Instance du gestionnaire PocketBase
let pbManager = null;
let usePocketBase = false;
let isInitialized = false;

/**
 * Initialise la connexion PocketBase
 */
async function initPocketBase() {
    if (isInitialized) {
        console.log('⚠️ PocketBase déjà initialisé, skip');
        return;
    }

    isInitialized = true;

    // Vérifier si on a un ID de session dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');

    if (!sessionId) {
        console.log('📺 Mode DÉMO (sans ID de session)');
        console.log('💡 Pour sauvegarder, créez une nouvelle session');
        usePocketBase = false;
        return;
    }

    try {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        usePocketBase = await pbManager.testConnection();

        if (usePocketBase) {
            console.log('✅ PocketBase connecté - Mode ÉDITION');
            window.currentSessionId = sessionId;
            try {
                await loadFromPocketBase();
            } catch (loadError) {
                console.warn('⚠️ Impossible de charger depuis PocketBase:', loadError.message);
                console.log('📦 Utilisation des données locales');
                usePocketBase = false;
            }
        } else {
            console.log('📦 Mode local (localStorage)');
        }
    } catch (error) {
        console.error('Erreur initialisation PocketBase:', error);
        usePocketBase = false;
    }
}

/**
 * Charge les données depuis PocketBase
 */
async function loadFromPocketBase() {
    try {
        const session = await getOrCreateSession();
        console.log(`📋 Chargement de la session: ${session.name} (${session.id})`);

        // Charger les sprints (avec gestion d'erreur)
        let sprintsData = [];
        try {
            sprintsData = await pbManager.getRecords('sprints', {
                filter: `session_id = "${session.id}"`,
                sort: '-created'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les sprints:', error.message);
            console.warn('💡 Vérifiez que la collection tools_velocity_squad_sprints existe et possède un champ session_id');
            // Essayer sans filtre pour voir si la collection existe
            try {
                const testData = await pbManager.getRecords('sprints', { perPage: 1 });
                console.log('✅ Collection sprints existe, problème avec le filtre');
            } catch (e) {
                console.error('Collection sprints n\'existe pas ou n\'est pas accessible');
            }
        }

        // Charger l'équipe (avec gestion d'erreur)
        let teamData = [];
        try {
            teamData = await pbManager.getRecords('team', {
                filter: `session = "${session.id}"`,
                sort: 'name'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger l\'équipe:', error.message);
        }

        // Charger les annotations (avec gestion d'erreur)
        let annotationsData = [];
        try {
            annotationsData = await pbManager.getRecords('annotations', {
                filter: `session = "${session.id}"`,
                sort: '-created'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les annotations:', error.message);
        }

        // Charger le mood tracking (avec gestion d'erreur)
        let moodData = [];
        try {
            moodData = await pbManager.getRecords('mood', {
                filter: `session = "${session.id}"`,
                sort: '-date'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger le mood:', error.message);
        }

        // Charger les événements (avec gestion d'erreur)
        let eventsData = [];
        try {
            eventsData = await pbManager.getRecords('events', {
                filter: `session_id = "${session.id}"`,
                sort: 'date,time'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les événements:', error.message);
        }

        // Convertir au format de l'application
        convertPocketBaseToApp(session, sprintsData, teamData, annotationsData, moodData, eventsData);

        console.log(`📊 Chargé: ${sprintsData.length} sprints, ${teamData.length} membres, ${annotationsData.length} annotations, ${eventsData.length} événements`);
    } catch (error) {
        console.error('Erreur chargement PocketBase:', error);
        throw error;
    }
}

/**
 * Récupère ou crée la session
 */
async function getOrCreateSession() {
    try {
        const sessionId = window.currentSessionId;
        
        if (!sessionId) {
            throw new Error('Aucun ID de session fourni');
        }

        try {
            const session = await pbManager.getRecord('sessions', sessionId);
            console.log('✅ Session trouvée:', session.name);
            updateSessionHeader(session);
            return session;
        } catch (error) {
            if (error.message.includes('404')) {
                console.warn('⚠️ Session introuvable:', sessionId);
                window.history.replaceState({}, '', window.location.pathname);
                showSessionNotFoundNotification(sessionId);
                throw new Error('Session introuvable');
            }
            throw error;
        }
    } catch (error) {
        console.error('Erreur récupération session:', error);
        throw error;
    }
}

/**
 * Met à jour l'en-tête avec le nom de la session
 */
function updateSessionHeader(session) {
    const header = document.querySelector('.dashboard-header h1');
    if (header) {
        header.innerHTML = `🎯 Team Velocity Dashboard <span style="font-size: 0.7em; opacity: 0.8; font-weight: normal;">- ${session.name}</span>`;
    }

    // Cacher la notification démo si session valide
    const demoNotification = document.getElementById('demo-notification');
    if (demoNotification) {
        demoNotification.style.display = 'none';
    }
}

/**
 * Affiche une notification quand la session n'est pas trouvée
 */
function showSessionNotFoundNotification(sessionId) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); 
                    color: white; 
                    padding: 16px 24px; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 16px;
                    animation: slideDown 0.3s ease;">
            <span style="font-size: 24px;">⚠️</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">Session introuvable</div>
                <div style="font-size: 0.9em; opacity: 0.9;">
                    La session <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">${sessionId}</code> n'existe pas.
                    <button onclick="createNewSession()" 
                            style="background: white; 
                                   color: #f59e0b; 
                                   border: none; 
                                   padding: 4px 12px; 
                                   border-radius: 6px; 
                                   font-weight: 600; 
                                   cursor: pointer;
                                   margin-left: 8px;">
                        Créer une nouvelle session
                    </button>
                </div>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); 
                           border: none; 
                           color: white; 
                           width: 28px; 
                           height: 28px; 
                           border-radius: 50%; 
                           cursor: pointer;
                           font-size: 18px;">×</button>
        </div>
    `;
    
    const header = document.querySelector('.dashboard-header');
    if (header) {
        header.after(notification);
    }
}

/**
 * Convertit les données PocketBase au format de l'application
 */
function convertPocketBaseToApp(session, sprintsData, teamData, annotationsData, moodData, eventsData = []) {
    window.currentSessionId = session.id;

    // Convertir les sprints
    const sprints = sprintsData.map(sprint => ({
        id: sprint.id,
        name: sprint.name,
        velocity: sprint.velocity,
        startDate: sprint.startDate || '',
        endDate: sprint.endDate || sprint.end_date || '',
        duration: sprint.duration || null,
        goal: sprint.goal || '',
        bugCount: sprint.bugCount || 0,
        teamSize: sprint.teamSize || 0,
        source: sprint.source || 'manual',
        timestamp: sprint.created,
        pbId: sprint.id
    }));

    // Convertir l'équipe
    const team = teamData.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        skills: member.skills || [],
        capacity: member.capacity || 100,
        pbId: member.id
    }));

    // Convertir les annotations
    const annotations = annotationsData.map(annotation => ({
        id: annotation.id,
        type: annotation.type,
        sprintId: annotation.sprint,
        text: annotation.text,
        timestamp: annotation.created,
        pbId: annotation.id
    }));

    // Convertir le mood tracking
    const moodTracking = moodData.map(mood => ({
        id: mood.id,
        date: mood.date,
        score: mood.score,
        comment: mood.comment || '',
        memberId: mood.member || null,
        memberName: mood.memberName || '',
        timestamp: mood.created,
        pbId: mood.id
    }));

    // Convertir les événements
    const events = eventsData.map(event => ({
        id: event.id,
        type: event.type,
        title: event.title,
        date: event.date,
        time: event.time || '',
        duration: event.duration || null,
        description: event.description || '',
        recurring: event.recurring || false,
        recurrence_type: event.recurrence_type || 'none',
        recurrence_interval: event.recurrence_interval || 1,
        recurrence_days: event.recurrence_days || [],
        recurrence_end_date: event.recurrence_end_date || '',
        sprint_id: event.sprint_id || null,
        session_id: event.session_id,
        created: event.created,
        pbId: event.id
    }));

    // Mettre à jour les données de l'outil
    if (window.velocityTool) {
        window.velocityTool.data = {
            ...window.velocityTool.data,
            sprints,
            team,
            annotations,
            moodTracking,
            events,
            settings: {
                framework: session.framework || 'scrum',
                sprintLength: session.sprint_length || 14,
                workingDays: session.working_days || 10
            }
        };

        // Rafraîchir l'interface
        window.velocityTool.renderAll();
    }

    console.log('✅ Données PocketBase converties et appliquées');
}

/**
 * Sauvegarde un sprint dans PocketBase
 */
async function saveSprintToPocketBase(sprint) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const sprintData = {
            session_id: window.currentSessionId,
            name: sprint.name,
            velocity: sprint.velocity,
            startDate: sprint.startDate || '',
            endDate: sprint.endDate,
            duration: sprint.duration || null,
            goal: sprint.goal || '',
            bugCount: sprint.bugCount || 0,
            teamSize: sprint.teamSize || 0,
            source: sprint.source || 'manual'
        };

        if (sprint.pbId) {
            await pbManager.updateRecord('sprints', sprint.pbId, sprintData);
        } else {
            const created = await pbManager.createRecord('sprints', sprintData);
            sprint.pbId = created.id;
        }

        console.log('✅ Sprint sauvegardé:', sprint.name);
    } catch (error) {
        console.error('Erreur sauvegarde sprint:', error);
    }
}

/**
 * Met à jour un sprint dans PocketBase
 */
async function updateSprintInPocketBase(sprint) {
    if (!usePocketBase || !pbManager || !sprint.pbId) return;

    try {
        const sprintData = {
            name: sprint.name,
            velocity: sprint.velocity,
            startDate: sprint.startDate || '',
            endDate: sprint.endDate,
            duration: sprint.duration || null,
            goal: sprint.goal || '',
            bugCount: sprint.bugCount || 0,
            teamSize: sprint.teamSize || 0,
            source: sprint.source || 'manual'
        };

        await pbManager.updateRecord('sprints', sprint.pbId, sprintData);
        console.log('✅ Sprint mis à jour:', sprint.name);
    } catch (error) {
        console.error('Erreur mise à jour sprint:', error);
    }
}

/**
 * Sauvegarde un membre d'équipe dans PocketBase
 */
async function saveTeamMemberToPocketBase(member) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const memberData = {
            session: window.currentSessionId,
            name: member.name,
            role: member.role,
            skills: member.skills || [],
            capacity: member.capacity || 100,
            active: true
        };

        if (member.pbId) {
            await pbManager.updateRecord('team', member.pbId, memberData);
        } else {
            const created = await pbManager.createRecord('team', memberData);
            member.pbId = created.id;
        }

        console.log('✅ Membre sauvegardé:', member.name);
    } catch (error) {
        console.error('Erreur sauvegarde membre:', error);
    }
}

/**
 * Sauvegarde une annotation dans PocketBase
 */
async function saveAnnotationToPocketBase(annotation) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const annotationData = {
            session: window.currentSessionId,
            sprint: String(annotation.sprintId), // Convertir en string
            type: annotation.type,
            text: annotation.text
        };

        if (annotation.pbId) {
            await pbManager.updateRecord('annotations', annotation.pbId, annotationData);
        } else {
            const created = await pbManager.createRecord('annotations', annotationData);
            annotation.pbId = created.id;
        }

        console.log('✅ Annotation sauvegardée');
    } catch (error) {
        console.error('Erreur sauvegarde annotation:', error);
    }
}

/**
 * Sauvegarde une entrée mood dans PocketBase
 */
async function saveMoodToPocketBase(moodEntry) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const moodData = {
            session: window.currentSessionId,
            date: moodEntry.date,
            score: moodEntry.score,
            comment: moodEntry.comment || '',
            member: moodEntry.memberId || null,
            memberName: moodEntry.memberName || ''
        };

        const created = await pbManager.createRecord('mood', moodData);
        moodEntry.pbId = created.id; // Stocker l'ID PocketBase
        console.log('✅ Mood sauvegardé pour', moodEntry.memberName);
    } catch (error) {
        console.error('Erreur sauvegarde mood:', error);
    }
}

/**
 * Sauvegarde un événement dans PocketBase
 */
async function saveEventToPocketBase(event) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const eventData = {
            session_id: window.currentSessionId,
            sprint_id: event.sprint_id || '',
            type: event.type,
            title: event.title,
            date: event.date,
            time: event.time || '',
            duration: event.duration || null,
            description: event.description || '',
            recurring: event.recurring || false,
            recurrence_type: event.recurrence_type || 'none',
            recurrence_interval: event.recurrence_interval || 1,
            recurrence_days: event.recurrence_days || [],
            recurrence_end_date: event.recurrence_end_date || ''
        };

        const created = await pbManager.createRecord('events', eventData);
        event.pbId = created.id; // Stocker l'ID PocketBase
        console.log('✅ Événement sauvegardé dans PocketBase');
    } catch (error) {
        console.error('Erreur sauvegarde événement:', error);
    }
}

/**
 * Met à jour un événement dans PocketBase
 */
async function updateEventInPocketBase(event) {
    if (!usePocketBase || !pbManager || !event.pbId) return;

    try {
        const eventData = {
            type: event.type,
            title: event.title,
            date: event.date,
            time: event.time || '',
            duration: event.duration || null,
            description: event.description || '',
            recurring: event.recurring || false,
            recurrence_type: event.recurrence_type || 'none',
            recurrence_interval: event.recurrence_interval || 1,
            recurrence_days: event.recurrence_days || [],
            recurrence_end_date: event.recurrence_end_date || ''
        };

        await pbManager.updateRecord('events', event.pbId, eventData);
        console.log('✅ Événement mis à jour dans PocketBase');
    } catch (error) {
        console.error('Erreur mise à jour événement:', error);
    }
}

/**
 * Supprime un événement de PocketBase
 */
async function deleteEventFromPocketBase(event) {
    if (!usePocketBase || !pbManager || !event.pbId) return;

    try {
        await pbManager.deleteRecord('events', event.pbId);
        console.log('✅ Événement supprimé de PocketBase');
    } catch (error) {
        console.error('Erreur suppression événement:', error);
    }
}

/**
 * Supprime un sprint de PocketBase
 */
async function deleteSprintFromPocketBase(sprint) {
    if (!usePocketBase || !pbManager || !sprint.pbId) return;

    try {
        await pbManager.deleteRecord('sprints', sprint.pbId);
        console.log('✅ Sprint supprimé');
    } catch (error) {
        console.error('Erreur suppression sprint:', error);
    }
}

/**
 * Met à jour un membre d'équipe dans PocketBase
 */
async function updateTeamMemberInPocketBase(member) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;
    if (!member.pbId) {
        console.warn('⚠️ Membre sans pbId, impossible de mettre à jour');
        return;
    }

    try {
        const data = {
            session_id: window.currentSessionId,
            member_id: String(member.id),
            name: member.name,
            role: member.role,
            skills: member.skills || [],
            capacity: member.capacity || 100
        };

        await pbManager.updateRecord('team', member.pbId, data);
        console.log('✅ Membre mis à jour dans PocketBase');
    } catch (error) {
        console.error('Erreur mise à jour membre:', error);
    }
}

/**
 * Met à jour une entrée mood dans PocketBase
 */
async function updateMoodInPocketBase(moodEntry) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;
    if (!moodEntry.pbId) {
        console.warn('⚠️ Mood sans pbId, impossible de mettre à jour');
        return;
    }

    try {
        const data = {
            session_id: window.currentSessionId,
            member: String(moodEntry.memberId),
            memberName: moodEntry.memberName,
            date: moodEntry.date,
            score: moodEntry.score,
            comment: moodEntry.comment || ''
        };

        await pbManager.updateRecord('mood', moodEntry.pbId, data);
        console.log('✅ Mood mis à jour dans PocketBase');
    } catch (error) {
        console.error('Erreur mise à jour mood:', error);
    }
}

/**
 * Supprime un membre de PocketBase
 */
async function deleteTeamMemberFromPocketBase(member) {
    if (!usePocketBase || !pbManager || !member.pbId) return;

    try {
        await pbManager.deleteRecord('team', member.pbId);
        console.log('✅ Membre supprimé');
    } catch (error) {
        console.error('Erreur suppression membre:', error);
    }
}

/**
 * Supprime toutes les données de la session actuelle
 */
async function clearCurrentSessionData() {
    if (!usePocketBase || !pbManager || !window.currentSessionId) {
        console.log('⚠️ PocketBase non disponible ou pas de session active');
        return;
    }

    console.log('🗑️ Suppression des données de la session:', window.currentSessionId);

    // Fonction helper pour supprimer avec gestion d'erreur
    async function deleteCollection(collectionKey, collectionName) {
        try {
            const records = await pbManager.getRecords(collectionKey, {
                filter: `session_id = "${window.currentSessionId}"`
            });
            console.log(`🗑️ Suppression de ${records.length} ${collectionName}...`);
            
            let deleted = 0;
            for (const record of records) {
                try {
                    await pbManager.deleteRecord(collectionKey, record.id);
                    deleted++;
                } catch (err) {
                    console.warn(`⚠️ Impossible de supprimer ${collectionName} ${record.id}:`, err.message);
                }
            }
            console.log(`✅ ${deleted}/${records.length} ${collectionName} supprimé(s)`);
        } catch (error) {
            console.warn(`⚠️ Erreur lors de la récupération de ${collectionName}:`, error.message);
        }
    }

    // Supprimer dans l'ordre inverse des dépendances
    // 1. D'abord les moods (dépendent des membres)
    await deleteCollection('mood', 'moods');
    
    // 2. Ensuite les annotations (dépendent des sprints)
    await deleteCollection('annotations', 'annotations');
    
    // 3. Puis les événements (dépendent des sprints)
    await deleteCollection('events', 'événements');
    
    // 4. Ensuite les membres
    await deleteCollection('team', 'membres');
    
    // 5. Enfin les sprints
    await deleteCollection('sprints', 'sprints');

    console.log('✅ Suppression terminée');
}

/**
 * Crée une nouvelle session
 */
async function createNewSession() {
    const sessionName = prompt('Nom de la session (ex: "Équipe Alpha - Q1 2025"):', 'Ma Session Velocity');
    
    if (!sessionName) return;

    try {
        // Vérifier si PocketBase est disponible
        if (!pbManager) {
            pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
            usePocketBase = await pbManager.testConnection();
        }

        if (!usePocketBase) {
            alert('⚠️ PocketBase non disponible. Impossible de créer une session.');
            return;
        }

        const sessionData = {
            name: sessionName,
            framework: 'scrum',
            sprint_length: 14,
            working_days: 10,
            active: true
        };

        const session = await pbManager.createRecord('sessions', sessionData);
        
        // Rediriger vers la nouvelle session
        window.location.href = `?session=${session.id}`;
    } catch (error) {
        console.error('Erreur création session:', error);
        alert('❌ Erreur lors de la création de la session');
    }
}

/**
 * Synchronisation automatique avec PocketBase
 */
async function syncWithPocketBase() {
    if (!usePocketBase || !window.velocityTool) return;

    try {
        // Sauvegarder tous les sprints
        for (const sprint of window.velocityTool.data.sprints) {
            await saveSprintToPocketBase(sprint);
        }

        // Sauvegarder tous les membres
        for (const member of window.velocityTool.data.team) {
            await saveTeamMemberToPocketBase(member);
        }

        // Sauvegarder toutes les annotations
        for (const annotation of window.velocityTool.data.annotations) {
            await saveAnnotationToPocketBase(annotation);
        }

        console.log('✅ Synchronisation PocketBase réussie');
    } catch (error) {
        console.error('Erreur synchronisation:', error);
    }
}

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPocketBase);
} else {
    initPocketBase();
}
