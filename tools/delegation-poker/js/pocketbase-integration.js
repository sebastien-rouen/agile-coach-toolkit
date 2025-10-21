/**
 * PocketBase Integration pour Delegation Poker
 * 
 * Gère la synchronisation entre l'interface et PocketBase
 * Fallback automatique vers localStorage si PocketBase indisponible
 * Gestion des sessions pour réutilisation
 */

// Configuration PocketBase
const PB_CONFIG = {
    baseUrl: '/pb',
    collections: {
        sessions: 'tools_delegation_poker_sessions',
        decisions: 'tools_delegation_poker_decisions',
        votes: 'tools_delegation_poker_votes',
        consensus: 'tools_delegation_poker_consensus'
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

        // Charger les décisions
        let decisionsData = [];
        try {
            decisionsData = await pbManager.getRecords('decisions', {
                filter: `session_id = "${session.id}"`,
                sort: 'order'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les décisions:', error.message);
        }

        // Charger les votes
        let votesData = [];
        try {
            votesData = await pbManager.getRecords('votes', {
                filter: `session_id = "${session.id}"`,
                sort: '-created'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les votes:', error.message);
        }

        // Charger les consensus
        let consensusData = [];
        try {
            consensusData = await pbManager.getRecords('consensus', {
                filter: `session_id = "${session.id}"`,
                sort: '-created'
            });
        } catch (error) {
            console.warn('⚠️ Impossible de charger les consensus:', error.message);
        }

        // Convertir au format de l'application
        convertPocketBaseToApp(session, decisionsData, votesData, consensusData);

        console.log(`📊 Chargé: ${decisionsData.length} décisions, ${votesData.length} votes, ${consensusData.length} consensus`);
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
    const header = document.querySelector('.header h1');
    if (header) {
        const sessionName = session.session_name || session.name;
        // ✅ Sécurisé : Utiliser textContent pour éviter XSS
        header.textContent = '🃏 Delegation Poker';
        const span = document.createElement('span');
        span.style.fontSize = '0.7em';
        span.style.opacity = '0.8';
        span.style.fontWeight = 'normal';
        span.textContent = ` - ${sessionName}`;
        header.appendChild(span);
    }

    // Afficher les informations de session
    const sessionInfo = document.getElementById('sessionInfo');
    if (sessionInfo) {
        sessionInfo.style.display = 'block';
        const sessionName = document.getElementById('sessionName');
        if (sessionName) {
            sessionName.textContent = session.session_name || session.name;
        }

        // Afficher les participants
        const participantsList = document.getElementById('participantsList');
        if (participantsList && session.participants) {
            // PocketBase retourne déjà les champs JSON parsés
            const participants = Array.isArray(session.participants)
                ? session.participants
                : JSON.parse(session.participants);

            // ✅ Sécurisé : Créer les éléments DOM sans innerHTML
            participantsList.textContent = ''; // Vider le contenu

            const title = document.createElement('strong');
            title.textContent = `Participants (${participants.length})`;
            participantsList.appendChild(title);

            const ul = document.createElement('ul');

            participants.forEach(p => {
                const li = document.createElement('li');
                li.textContent = p; // Sécurisé avec textContent
                ul.appendChild(li);
            });

            participantsList.appendChild(ul);
        }
    }
}

/**
 * Affiche une notification quand la session n'est pas trouvée
 */
function showSessionNotFoundNotification(sessionId) {
    // ✅ Sécurisé : Créer les éléments DOM sans innerHTML
    const notification = document.createElement('div');

    const container = document.createElement('div');
    container.style.cssText = `
        background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 16px;
        animation: slideDown 0.3s ease;
    `;

    const icon = document.createElement('span');
    icon.style.fontSize = '24px';
    icon.textContent = '⚠️';
    container.appendChild(icon);

    const content = document.createElement('div');
    content.style.flex = '1';

    const title = document.createElement('div');
    title.style.fontWeight = '600';
    title.style.marginBottom = '4px';
    title.textContent = 'Session introuvable';
    content.appendChild(title);

    const message = document.createElement('div');
    message.style.fontSize = '0.9em';
    message.style.opacity = '0.9';
    message.textContent = 'La session ';

    const code = document.createElement('code');
    code.style.cssText = 'background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;';
    code.textContent = sessionId; // Sécurisé avec textContent
    message.appendChild(code);

    message.appendChild(document.createTextNode(' n\'existe pas. '));

    const button = document.createElement('button');
    button.style.cssText = `
        background: white;
        color: #f59e0b;
        border: none;
        padding: 4px 12px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
    `;
    button.textContent = 'Créer une nouvelle session';
    button.addEventListener('click', () => {
        document.getElementById('btnNewSession')?.click();
    });
    message.appendChild(button);

    content.appendChild(message);
    container.appendChild(content);

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
    `;
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    container.appendChild(closeBtn);

    notification.appendChild(container);

    const header = document.querySelector('.header');
    if (header) {
        header.after(notification);
    }
}

/**
 * Convertit les données PocketBase au format de l'application
 */
function convertPocketBaseToApp(session, decisionsData, votesData, consensusData) {
    window.currentSessionId = session.id;

    // Convertir les décisions
    const decisions = decisionsData.map(decision => ({
        id: decision.id,
        text: decision.text,
        category: decision.category,
        order: decision.order,
        status: decision.status || 'pending',
        pbId: decision.id
    }));

    // Convertir les votes
    const votes = votesData.map(vote => ({
        id: vote.id,
        decision_id: vote.decision_id,
        participant: vote.participant,
        level: vote.level,
        timestamp: vote.created,
        pbId: vote.id
    }));

    // Convertir les consensus
    const consensus = consensusData.map(cons => ({
        id: cons.id,
        decision_id: cons.decision_id,
        final_level: cons.final_level,
        notes: cons.notes || '',
        timestamp: cons.created,
        pbId: cons.id
    }));

    // Mettre à jour les données de l'application
    if (window.delegationPoker) {
        // PocketBase retourne déjà les champs JSON parsés
        const participants = Array.isArray(session.participants)
            ? session.participants
            : JSON.parse(session.participants || '[]');

        window.delegationPoker.session = {
            id: session.id,
            name: session.session_name || session.name,
            participants: participants,
            created_at: session.created
        };
        window.delegationPoker.decisions = decisions;
        window.delegationPoker.votes = votes;
        window.delegationPoker.consensus = consensus;

        // Rafraîchir l'interface
        window.delegationPoker.renderAll();
    }

    console.log('✅ Données PocketBase converties et appliquées');
}

/**
 * Sauvegarde une décision dans PocketBase
 */
async function saveDecisionToPocketBase(decision) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const decisionData = {
            session_id: window.currentSessionId,
            text: decision.text,
            category: decision.category,
            order: decision.order,
            status: decision.status || 'pending'
        };

        if (decision.pbId) {
            await pbManager.updateRecord('decisions', decision.pbId, decisionData);
        } else {
            const created = await pbManager.createRecord('decisions', decisionData);
            decision.pbId = created.id;
        }

        console.log('✅ Décision sauvegardée:', decision.text);
    } catch (error) {
        console.error('Erreur sauvegarde décision:', error);
    }
}

/**
 * Sauvegarde un vote dans PocketBase
 */
async function saveVoteToPocketBase(vote) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const voteData = {
            session_id: window.currentSessionId,
            decision_id: vote.decision_id,
            participant: vote.participant,
            level: vote.level
        };

        const created = await pbManager.createRecord('votes', voteData);
        vote.pbId = created.id;
        console.log('✅ Vote sauvegardé');
    } catch (error) {
        console.error('Erreur sauvegarde vote:', error);
    }
}

/**
 * Sauvegarde un consensus dans PocketBase
 */
async function saveConsensusToPocketBase(consensus) {
    if (!usePocketBase || !pbManager || !window.currentSessionId) return;

    try {
        const consensusData = {
            session_id: window.currentSessionId,
            decision_id: consensus.decision_id,
            final_level: consensus.final_level,
            notes: consensus.notes || ''
        };

        const created = await pbManager.createRecord('consensus', consensusData);
        consensus.pbId = created.id;
        console.log('✅ Consensus sauvegardé');
    } catch (error) {
        console.error('Erreur sauvegarde consensus:', error);
    }
}

/**
 * Supprime une décision de PocketBase
 */
async function deleteDecisionFromPocketBase(decision) {
    if (!usePocketBase || !pbManager || !decision.pbId) return;

    try {
        await pbManager.deleteRecord('decisions', decision.pbId);
        console.log('✅ Décision supprimée');
    } catch (error) {
        console.error('Erreur suppression décision:', error);
    }
}

/**
 * Crée une nouvelle session
 */
async function createNewSessionInPocketBase(sessionName, participants) {
    try {
        // Vérifier si PocketBase est disponible
        if (!pbManager) {
            pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
            usePocketBase = await pbManager.testConnection();
        }

        if (!usePocketBase) {
            console.warn('⚠️ PocketBase non disponible');
            return null;
        }

        const sessionData = {
            name: sessionName,
            participants: JSON.stringify(participants),
            active: true
        };

        const session = await pbManager.createRecord('sessions', sessionData);
        console.log('✅ Session créée:', session.id);

        return session;
    } catch (error) {
        console.error('Erreur création session:', error);
        return null;
    }
}

/**
 * Charge les sessions disponibles
 */
async function loadAvailableSessions() {
    try {
        if (!pbManager) {
            pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
            usePocketBase = await pbManager.testConnection();
        }

        if (!usePocketBase) {
            console.warn('⚠️ PocketBase non disponible');
            return [];
        }

        const sessions = await pbManager.getRecords('sessions', {
            filter: 'active = true',
            sort: '-created'
        });

        return sessions;
    } catch (error) {
        console.error('Erreur chargement sessions:', error);
        return [];
    }
}

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPocketBase);
} else {
    initPocketBase();
}


// ===========================
// INITIALISATION DU MANAGER
// ===========================
async function initPBManager() {
    if (!pbManager) {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        usePocketBase = await pbManager.testConnection();

        if (usePocketBase) {
            console.log('✅ PocketBase Manager initialisé');
        } else {
            console.log('📦 Mode local (PocketBase non disponible)');
        }
    }
    return pbManager;
}

// ===========================
// API PUBLIQUE pour app.js
// ===========================
window.pbAPI = {
    async createSession(data) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return null;
        try {
            // Adapter les données au schéma PocketBase
            const pbData = {
                session_name: data.session_name,
                participants: data.participants, // Déjà un array, PocketBase le convertira en JSON
                status: data.status || 'active'
            };
            return await pbManager.createRecord('sessions', pbData);
        } catch (error) {
            console.error('Erreur création session:', error);
            throw error;
        }
    },

    async getSession(id) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return null;
        try {
            return await pbManager.getRecord('sessions', id);
        } catch (error) {
            console.error('Erreur récupération session:', error);
            throw error;
        }
    },

    async getSessions() {
        await initPBManager();
        if (!pbManager || !usePocketBase) return { items: [] };
        try {
            const records = await pbManager.getRecords('sessions', {
                sort: '-created',
                filter: 'status = "active"'
            });
            return { items: records };
        } catch (error) {
            console.error('Erreur récupération sessions:', error);
            return { items: [] };
        }
    },

    async createDecision(data) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return null;
        try {
            return await pbManager.createRecord('decisions', data);
        } catch (error) {
            console.error('Erreur création décision:', error);
            throw error;
        }
    },

    async getDecisions(sessionId) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return { items: [] };
        try {
            const records = await pbManager.getRecords('decisions', {
                filter: `session_id = "${sessionId}"`,
                sort: 'order'
            });
            return { items: records };
        } catch (error) {
            console.error('Erreur récupération décisions:', error);
            return { items: [] };
        }
    },

    async deleteDecision(id) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return;
        try {
            await pbManager.deleteRecord('decisions', id);
        } catch (error) {
            console.error('Erreur suppression décision:', error);
            throw error;
        }
    },

    async createVote(data) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return null;
        try {
            // Adapter les données au schéma PocketBase
            const pbData = {
                session_id: data.session_id,
                decision_id: data.decision_id,
                participant_name: data.participant_name,
                delegation_level: data.delegation_level,
                comment: data.comment || '',
                voted_at: data.voted_at || new Date().toISOString()
            };
            return await pbManager.createRecord('votes', pbData);
        } catch (error) {
            console.error('Erreur création vote:', error);
            throw error;
        }
    },

    async getVotes(decisionId) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return { items: [] };
        try {
            const records = await pbManager.getRecords('votes', {
                filter: `decision_id = "${decisionId}"`
            });
            return { items: records };
        } catch (error) {
            console.error('Erreur récupération votes:', error);
            return { items: [] };
        }
    },

    async createConsensus(data) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return null;
        try {
            // Adapter les données au schéma PocketBase
            const pbData = {
                session_id: data.session_id,
                decision_id: data.decision_id,
                final_level: data.final_level,
                notes: data.notes || '',
                agreed_at: data.agreed_at || new Date().toISOString()
            };
            return await pbManager.createRecord('consensus', pbData);
        } catch (error) {
            console.error('Erreur création consensus:', error);
            throw error;
        }
    },

    async getConsensus(decisionId) {
        await initPBManager();
        if (!pbManager || !usePocketBase) return { items: [] };
        try {
            const records = await pbManager.getRecords('consensus', {
                filter: `decision_id = "${decisionId}"`
            });
            return { items: records };
        } catch (error) {
            console.error('Erreur récupération consensus:', error);
            return { items: [] };
        }
    }
};
