// ===========================
// STATE MANAGEMENT
// ===========================
const AppState = {
    currentSession: null,
    decisions: [],
    currentDecision: null,
    votes: {},
    
    setSession(session) {
        this.currentSession = session;
        localStorage.setItem('currentSessionId', session.id);
        this.render();
    },
    
    loadSession() {
        const sessionId = localStorage.getItem('currentSessionId');
        if (sessionId) {
            // Ne pas essayer de charger les sessions locales depuis PocketBase
            if (sessionId.startsWith('local_')) {
                console.log('📦 Session locale détectée, chargement depuis localStorage');
                const sessions = JSON.parse(localStorage.getItem('delegation_poker_sessions') || '[]');
                const session = sessions.find(s => s.id === sessionId);
                if (session) {
                    this.currentSession = session;
                    this.loadDecisions();
                    this.render();
                } else {
                    localStorage.removeItem('currentSessionId');
                }
                return;
            }
            
            pbAPI.getSession(sessionId)
                .then(session => {
                    this.currentSession = session;
                    this.loadDecisions();
                    this.render();
                })
                .catch(() => {
                    localStorage.removeItem('currentSessionId');
                });
        }
    },
    
    async loadDecisions() {
        if (!this.currentSession) return;
        
        try {
            // Essayer de charger depuis PocketBase
            if (window.pbAPI && this.currentSession.id.indexOf('local_') !== 0) {
                const response = await pbAPI.getDecisions(this.currentSession.id);
                this.decisions = response.items || [];
            } else {
                // Charger depuis localStorage
                const allDecisions = JSON.parse(localStorage.getItem('delegation_poker_decisions') || '[]');
                this.decisions = allDecisions.filter(d => d.session_id === this.currentSession.id);
                console.log('📦 Décisions chargées depuis localStorage:', this.decisions.length);
            }
            this.render();
        } catch (error) {
            console.error('Erreur chargement décisions:', error);
        }
    },
    
    render() {
        const hasSession = !!this.currentSession;
        
        // Toggle empty state / active zone
        document.getElementById('emptyState').style.display = hasSession ? 'none' : 'block';
        document.getElementById('activeZone').style.display = hasSession ? 'block' : 'none';
        
        // Enable/disable export
        document.getElementById('btnExport').disabled = !hasSession || this.decisions.length === 0;
        
        // Render session info
        renderSessionInfo();
        
        // Render decisions list
        if (hasSession) {
            renderDecisionsList();
        }
    }
};

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier si on a un ID de session dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
        console.log('📋 Chargement de la session depuis l\'URL:', sessionId);
        try {
            const session = await pbAPI.getSession(sessionId);
            if (session) {
                AppState.setSession(session);
                await AppState.loadDecisions();
                showNotification('✅ Session chargée depuis l\'URL');
            }
        } catch (error) {
            console.error('Erreur chargement session depuis URL:', error);
            showNotification('⚠️ Session introuvable', 'warning');
        }
    } else {
        // Essayer de charger depuis localStorage
        AppState.loadSession();
    }
    
    AppState.render();
    setupEventListeners();
});

// ===========================
// EVENT LISTENERS
// ===========================
function setupEventListeners() {
    // Nouvelle session
    document.getElementById('btnNewSession').addEventListener('click', () => {
        openModal('modalNewSession');
    });
    
    document.getElementById('formNewSession').addEventListener('submit', handleNewSession);
    
    // Charger session
    document.getElementById('btnLoadSession').addEventListener('click', handleLoadSession);
    
    // Exporter
    document.getElementById('btnExport').addEventListener('click', handleExport);
    
    // Ajouter décision
    document.getElementById('formAddDecision').addEventListener('submit', handleAddDecision);
    
    // Révéler votes
    document.getElementById('btnRevealVotes').addEventListener('click', handleRevealVotes);
    
    // Sauvegarder consensus
    document.getElementById('btnSaveConsensus').addEventListener('click', handleSaveConsensus);
}

// ===========================
// HANDLERS - SESSION
// ===========================
async function handleNewSession(e) {
    e.preventDefault();
    
    const sessionName = document.getElementById('inputSessionName').value.trim();
    const participantsText = document.getElementById('inputParticipants').value.trim();
    
    const participants = participantsText
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
    
    if (participants.length < 2) {
        alert('⚠️ Il faut au moins 2 participants !');
        return;
    }
    
    try {
        let session = null;
        
        // Essayer de créer dans PocketBase
        if (window.pbAPI) {
            session = await pbAPI.createSession({
                session_name: sessionName,
                participants: participants,
                status: 'active'
            });
            
            // Ajouter l'ID de session dans l'URL
            if (session && session.id) {
                const url = new URL(window.location);
                url.searchParams.set('session', session.id);
                window.history.pushState({}, '', url);
                console.log('✅ Session créée avec ID:', session.id);
            }
        }
        
        // Fallback localStorage si PocketBase non disponible
        if (!session) {
            session = {
                id: 'local_' + Date.now(),
                session_name: sessionName,
                participants: participants,
                status: 'active',
                created: new Date().toISOString()
            };
            
            // Sauvegarder en localStorage
            const sessions = JSON.parse(localStorage.getItem('delegation_poker_sessions') || '[]');
            sessions.push(session);
            localStorage.setItem('delegation_poker_sessions', JSON.stringify(sessions));
            
            console.log('📦 Session créée en mode local (localStorage)');
        }
        
        AppState.setSession(session);
        closeModal('modalNewSession');
        
        // Si des décisions de template sont en attente, les créer
        if (window.templateDecisions && window.templateDecisions.length > 0) {
            const decisionsCount = window.templateDecisions.length;
            
            for (let i = 0; i < window.templateDecisions.length; i++) {
                const decisionData = window.templateDecisions[i];
                
                if (window.pbAPI && session.id.indexOf('local_') !== 0) {
                    // Créer dans PocketBase
                    await pbAPI.createDecision({
                        session_id: session.id,
                        decision_text: decisionData.text,
                        category: decisionData.category,
                        order: i + 1,
                        status: 'pending'
                    });
                } else {
                    // Créer en localStorage
                    const decision = {
                        id: 'local_' + Date.now() + '_' + i,
                        session_id: session.id,
                        decision_text: decisionData.text,
                        category: decisionData.category,
                        order: i + 1,
                        status: 'pending',
                        created: new Date().toISOString()
                    };
                    
                    const decisions = JSON.parse(localStorage.getItem('delegation_poker_decisions') || '[]');
                    decisions.push(decision);
                    localStorage.setItem('delegation_poker_decisions', JSON.stringify(decisions));
                    AppState.decisions.push(decision);
                }
            }
            
            // Recharger les décisions si PocketBase
            if (window.pbAPI && session.id.indexOf('local_') !== 0) {
                await AppState.loadDecisions();
            }
            
            // Nettoyer les décisions du template
            window.templateDecisions = null;
            
            showNotification(`✅ Session créée avec ${decisionsCount} décisions !`);
        } else {
            showNotification('✅ Session créée avec succès !');
        }
        
        // Rafraîchir l'affichage
        AppState.render();
        
        // Reset form
        document.getElementById('formNewSession').reset();
    } catch (error) {
        console.error('Erreur création session:', error);
        alert('❌ Erreur lors de la création de la session');
    }
}

async function handleLoadSession() {
    try {
        const response = await pbAPI.getSessions();
        const sessions = response.items || [];
        
        if (sessions.length === 0) {
            alert('Aucune session disponible. Créez-en une nouvelle !');
            return;
        }
        
        renderSessionsList(sessions);
        openModal('modalLoadSession');
        
    } catch (error) {
        console.error('Erreur chargement sessions:', error);
        alert('❌ Erreur lors du chargement des sessions');
    }
}

function renderSessionsList(sessions) {
    const container = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Aucune session disponible</p>';
        return;
    }
    
    container.innerHTML = sessions.map(session => `
        <div class="session-item" onclick="loadSessionById('${session.id}')">
            <div class="session-item-info">
                <strong>${session.session_name}</strong>
                <small>${new Date(session.created).toLocaleDateString('fr-FR')}</small>
            </div>
            <span class="badge badge-${session.status === 'active' ? 'success' : 'warning'}">
                ${session.status}
            </span>
        </div>
    `).join('');
}

async function loadSessionById(sessionId) {
    try {
        const session = await pbAPI.getSession(sessionId);
        AppState.setSession(session);
        await AppState.loadDecisions();
        
        // Ajouter l'ID de session dans l'URL
        const url = new URL(window.location);
        url.searchParams.set('session', sessionId);
        window.history.pushState({}, '', url);
        
        closeModal('modalLoadSession');
        showNotification('✅ Session chargée !');
    } catch (error) {
        console.error('Erreur chargement session:', error);
        alert('❌ Erreur lors du chargement de la session');
    }
}

// ===========================
// HANDLERS - DECISIONS
// ===========================
async function handleAddDecision(e) {
    e.preventDefault();
    
    if (!AppState.currentSession) {
        alert('⚠️ Créez d\'abord une session !');
        return;
    }
    
    const decisionText = document.getElementById('inputDecision').value.trim();
    const category = document.getElementById('selectCategory').value;
    
    if (decisionText.length < 3) {
        alert('⚠️ La décision doit faire au moins 3 caractères');
        return;
    }
    
    try {
        const decision = await pbAPI.createDecision({
            session_id: AppState.currentSession.id,
            decision_text: decisionText,
            category: category,
            order: AppState.decisions.length
        });
        
        AppState.decisions.push(decision);
        AppState.render();
        
        // Reset form
        document.getElementById('formAddDecision').reset();
        
        showNotification('✅ Décision ajoutée !');
        
    } catch (error) {
        console.error('Erreur ajout décision:', error);
        alert('❌ Erreur lors de l\'ajout de la décision');
    }
}

async function handleDeleteDecision(decisionId) {
    if (!confirm('Supprimer cette décision ?')) return;
    
    try {
        await pbAPI.deleteDecision(decisionId);
        AppState.decisions = AppState.decisions.filter(d => d.id !== decisionId);
        AppState.render();
        showNotification('✅ Décision supprimée');
    } catch (error) {
        console.error('Erreur suppression décision:', error);
        alert('❌ Erreur lors de la suppression');
    }
}

// ===========================
// HANDLERS - VOTING
// ===========================
function handleStartVote(decisionId) {
    const decision = AppState.decisions.find(d => d.id === decisionId);
    if (!decision) return;
    
    AppState.currentDecision = decision;
    AppState.votes = {};
    
    renderVotingArea();
    openModal('modalVote');
}

function handleVoteSelect(participant, level) {
    AppState.votes[participant] = level;
    
    // Update UI
    const participantSection = document.querySelector(`[data-participant="${participant}"]`);
    if (participantSection) {
        participantSection.querySelectorAll('.vote-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        event.target.closest('.vote-card').classList.add('selected');
    }
    
    // Check if all voted
    const allVoted = AppState.currentSession.participants.every(p => AppState.votes[p] !== undefined);
    document.getElementById('btnRevealVotes').disabled = !allVoted;
}

async function handleRevealVotes() {
    if (!AppState.currentDecision) return;
    
    try {
        // Enregistrer tous les votes
        for (const [participant, level] of Object.entries(AppState.votes)) {
            await pbAPI.createVote({
                session_id: AppState.currentSession.id,
                decision_id: AppState.currentDecision.id,
                participant_name: participant,
                delegation_level: level
            });
        }
        
        closeModal('modalVote');
        
        // Charger les votes et afficher les résultats
        const votesResponse = await pbAPI.getVotes(AppState.currentDecision.id);
        renderResults(votesResponse.items || []);
        openModal('modalResults');
        
    } catch (error) {
        console.error('Erreur enregistrement votes:', error);
        alert('❌ Erreur lors de l\'enregistrement des votes');
    }
}

async function handleSaveConsensus() {
    if (!AppState.currentDecision) return;
    
    const notes = document.getElementById('inputConsensusNotes').value.trim();
    
    // Calculer le niveau consensuel (médiane)
    const levels = Object.values(AppState.votes);
    levels.sort((a, b) => a - b);
    const median = levels[Math.floor(levels.length / 2)];
    
    try {
        await pbAPI.createConsensus({
            session_id: AppState.currentSession.id,
            decision_id: AppState.currentDecision.id,
            final_level: median,
            notes: notes
        });
        
        await AppState.loadDecisions();
        closeModal('modalResults');
        showNotification('✅ Consensus enregistré !');
        
    } catch (error) {
        console.error('Erreur enregistrement consensus:', error);
        alert('❌ Erreur lors de l\'enregistrement du consensus');
    }
}

// ===========================
// RENDERING
// ===========================
function renderSessionInfo() {
    const sessionInfo = document.getElementById('sessionInfo');
    
    if (!AppState.currentSession) {
        sessionInfo.style.display = 'none';
        return;
    }
    
    sessionInfo.style.display = 'block';
    document.getElementById('sessionName').textContent = AppState.currentSession.session_name;
    
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = `
        <strong>Participants (${AppState.currentSession.participants.length}) :</strong>
        <ul style="margin-top: 8px; padding-left: 20px;">
            ${AppState.currentSession.participants.map(p => `<li>${p}</li>`).join('')}
        </ul>
    `;
}

async function renderDecisionsList() {
    const container = document.getElementById('decisionsList');
    
    if (AppState.decisions.length === 0) {
        container.innerHTML = '';
        document.getElementById('delegationBoardSection').style.display = 'none';
        return;
    }
    
    const getCategoryEmoji = (cat) => {
        const emojis = {
            technical: '🔧',
            organizational: '🏢',
            product: '📦',
            team: '👥',
            other: '🔄'
        };
        return emojis[cat] || '🔄';
    };
    
    const getCategoryLabel = (cat) => {
        const labels = {
            technical: 'Technique',
            organizational: 'Organisationnel',
            product: 'Produit',
            team: 'Équipe',
            other: 'Autre'
        };
        return labels[cat] || 'Autre';
    };
    
    const levels = [
        { num: 1, label: 'Tell' },
        { num: 2, label: 'Sell' },
        { num: 3, label: 'Consult' },
        { num: 4, label: 'Agree' },
        { num: 5, label: 'Advise' },
        { num: 6, label: 'Inquire' },
        { num: 7, label: 'Delegate' }
    ];
    
    // Charger les consensus pour chaque décision
    const consensusData = [];
    const consensusMap = {};
    
    const consensusPromises = AppState.decisions.map(async (decision) => {
        try {
            const consensusResponse = await pbAPI.getConsensus(decision.id);
            if (consensusResponse.items && consensusResponse.items.length > 0) {
                const consensus = consensusResponse.items[0];
                consensusMap[decision.id] = consensus.final_level;
                
                return {
                    decision: decision.decision_text,
                    level: consensus.final_level,
                    notes: consensus.notes
                };
            }
        } catch (error) {
            console.error('Erreur chargement consensus:', error);
        }
        return null;
    });
    
    const results = await Promise.all(consensusPromises);
    const validConsensus = results.filter(r => r !== null);
    
    // Générer le tableau
    container.innerHTML = `
        <div class="card decisions-table-container">
            <table class="decisions-table">
                <thead>
                    <tr>
                        <th>Décision</th>
                        ${levels.map(l => `
                            <th class="level-header level-${l.num}">
                                <span class="level-number">${l.num}</span>
                                <span class="level-label">${l.label}</span>
                            </th>
                        `).join('')}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppState.decisions.map(decision => {
                        const consensusLevel = consensusMap[decision.id];
                        return `
                            <tr>
                                <td>
                                    <div class="decision-cell-content">
                                        <span class="decision-title">${decision.decision_text}</span>
                                        <span class="decision-category">
                                            ${getCategoryEmoji(decision.category)} ${getCategoryLabel(decision.category)}
                                        </span>
                                    </div>
                                </td>
                                ${levels.map(l => `
                                    <td>
                                        ${consensusLevel === l.num ? `
                                            <div class="consensus-indicator active">★</div>
                                        ` : `
                                            <div class="vote-status">—</div>
                                        `}
                                    </td>
                                `).join('')}
                                <td>
                                    <div class="decision-actions-cell">
                                        <button class="btn btn-primary btn-small" onclick="handleStartVote('${decision.id}')">
                                            🃏 Voter
                                        </button>
                                        <button class="btn btn-danger btn-small" onclick="handleDeleteDecision('${decision.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Les consensus sont déjà affichés dans le tableau principal avec les étoiles
}

function renderVotingArea() {
    if (!AppState.currentDecision) return;
    
    document.getElementById('voteDecisionText').textContent = AppState.currentDecision.decision_text;
    
    const votingArea = document.getElementById('votingArea');
    
    votingArea.innerHTML = AppState.currentSession.participants.map(participant => `
        <div class="participant-vote" data-participant="${participant}">
            <div class="participant-name">👤 ${participant}</div>
            <div class="voting-cards">
                ${[1, 2, 3, 4, 5, 6, 7].map(level => `
                    <div class="vote-card" onclick="handleVoteSelect('${participant}', ${level})">
                        <div class="vote-card-number">${level}</div>
                        <div class="vote-card-label">${getDelegationLabel(level)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderResults(votes) {
    const resultsArea = document.getElementById('resultsArea');
    
    if (votes.length === 0) {
        resultsArea.innerHTML = '<p class="text-muted text-center">Aucun vote enregistré</p>';
        return;
    }
    
    // Calculer stats
    const levels = votes.map(v => v.delegation_level);
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    const sorted = [...levels].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    
    resultsArea.innerHTML = `
        <div class="result-stats">
            <div class="stat-item">
                <div class="stat-value">${min}</div>
                <div class="stat-label">Minimum</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${median}</div>
                <div class="stat-label">Médiane</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${max}</div>
                <div class="stat-label">Maximum</div>
            </div>
        </div>
        
        <div class="results-grid">
            ${votes.map(vote => `
                <div class="result-item">
                    <div class="result-participant">👤 ${vote.participant_name}</div>
                    <div class="result-vote">
                        <span>${vote.delegation_level}</span>
                        <span>${getDelegationLabel(vote.delegation_level)}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===========================
// UTILITIES
// ===========================
function getDelegationLabel(level) {
    const labels = {
        1: 'Tell',
        2: 'Sell',
        3: 'Consult',
        4: 'Agree',
        5: 'Advise',
        6: 'Inquire',
        7: 'Delegate'
    };
    return labels[level] || '';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'success') {
    const colors = {
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--primary)'
    };
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${colors[type] || colors.success};
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================
// EXPORT
// ===========================
async function handleExport() {
    if (!AppState.currentSession) return;
    
    try {
        // Préparer les données d'export
        const exportData = {
            session: AppState.currentSession,
            decisions: []
        };
        
        for (const decision of AppState.decisions) {
            const votesResponse = await pbAPI.getVotes(decision.id);
            const consensusResponse = await pbAPI.getConsensus(decision.id);
            
            exportData.decisions.push({
                decision: decision,
                votes: votesResponse.items || [],
                consensus: consensusResponse.items?.[0] || null
            });
        }
        
        // Export JSON
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `delegation-poker-${AppState.currentSession.session_name.replace(/\s+/g, '-')}-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        showNotification('✅ Export réussi !');
        
    } catch (error) {
        console.error('Erreur export:', error);
        alert('❌ Erreur lors de l\'export');
    }
}
