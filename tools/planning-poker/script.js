/**
 * 🎲 PLANNING POKER TOOL
 * Outil d'estimation collaborative pour équipes Agile
 * by DevBast - BastaLab
 */

class PlanningPokerTool {
    constructor() {
        this.sessionId = null;
        this.facilitatorName = null;
        this.sessionName = null;
        this.participants = [];
        this.currentStory = null;
        this.votes = {};
        this.cardSets = {
            fibonacci: ['1', '2', '3', '5', '8', '13', '21', '?', '☕', '∞'],
            tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕', '∞'],
            hours: ['1h', '2h', '4h', '8h', '16h', '32h', '?', '☕', '∞'],
            power2: ['1', '2', '4', '8', '16', '32', '?', '☕', '∞']
        };
        this.currentCardSet = 'fibonacci';
        this.votingRevealed = false;
        this.storyHistory = [];
        this.questions = [];
        
        this.init();
    }

    init() {
        // Vérifier si on a un sessionId dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdFromUrl = urlParams.get('sessionId');
        
        if (sessionIdFromUrl) {
            // Rejoindre une session existante
            this.joinSession(sessionIdFromUrl);
        } else {
            // Afficher l'écran de création de room
            this.showRoomCreation();
        }
        
        // Événements
        this.attachEventListeners();
        
        console.log('🎲 Planning Poker initialisé');
    }

    generateSessionId() {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = Math.floor(now.getTime() / 1000).toString().slice(-3);
        return `PP-${dateStr}-${timeStr}`;
    }

    // === GESTION DES SESSIONS ===
    showRoomCreation() {
        document.getElementById('roomCreation').style.display = 'block';
        document.getElementById('sessionInterface').style.display = 'none';
        
        // Focus sur le champ nom
        setTimeout(() => {
            document.getElementById('facilitatorName').focus();
        }, 100);
    }

    createSession(facilitatorName, sessionName = '') {
        this.sessionId = this.generateSessionId();
        this.facilitatorName = facilitatorName;
        this.sessionName = sessionName;
        
        // Masquer l'écran de création et afficher l'interface
        document.getElementById('roomCreation').style.display = 'none';
        document.getElementById('sessionInterface').style.display = 'block';
        
        // Initialiser la session
        this.initializeSession();
        
        // Mettre à jour l'URL avec le sessionId
        const newUrl = `${window.location.pathname}?sessionId=${this.sessionId}`;
        window.history.pushState({ sessionId: this.sessionId }, '', newUrl);
        
        this.showNotification(`Session "${this.sessionId}" créée avec succès !`, 'success');
    }

    joinSession(sessionId) {
        // Vérifier si la session existe (simulation - en réalité on vérifierait sur un serveur)
        const savedSession = this.loadSessionFromStorage(sessionId);
        
        if (savedSession) {
            this.sessionId = sessionId;
            this.facilitatorName = savedSession.facilitatorName;
            this.sessionName = savedSession.sessionName;
            
            document.getElementById('sessionInterface').style.display = 'block';
            document.getElementById('roomCreation').style.display = 'none';
            
            this.initializeSession();
            this.loadFromLocalStorage();
            
            // Demander le nom du participant
            const participantName = prompt('Entrez votre nom pour rejoindre la session:');
            if (participantName && participantName.trim()) {
                this.addParticipant(participantName.trim(), true);
                this.showNotification(`Bienvenue dans la session "${this.sessionId}" !`, 'success');
            } else {
                this.showRoomCreation();
                return;
            }
        } else {
            // Session non trouvée
            this.showNotification('Session non trouvée. Création d\'une nouvelle session...', 'warning');
            this.showRoomCreation();
        }
    }

    initializeSession() {
        // Mettre à jour l'affichage de la session
        document.getElementById('sessionId').textContent = `Session: ${this.sessionId}`;
        
        // Générer le lien de partage
        const shareLink = `${window.location.origin}${window.location.pathname}?sessionId=${this.sessionId}`;
        document.getElementById('shareLink').value = shareLink;
        
        // Ajouter le facilitateur comme premier participant si c'est une nouvelle session
        if (this.participants.length === 0) {
            this.addParticipant(this.facilitatorName, true);
        }
        
        // Générer les cartes initiales
        this.generateVotingCards();
        
        // Sauvegarder la session
        this.saveSessionToStorage();
    }

    copyShareLink() {
        const shareLink = document.getElementById('shareLink');
        shareLink.select();
        shareLink.setSelectionRange(0, 99999); // Pour mobile
        
        navigator.clipboard.writeText(shareLink.value).then(() => {
            this.showNotification('Lien copié dans le presse-papiers !', 'success');
        }).catch(() => {
            // Fallback pour les navigateurs plus anciens
            try {
                document.execCommand('copy');
                this.showNotification('Lien copié dans le presse-papiers !', 'success');
            } catch (err) {
                this.showNotification('Impossible de copier le lien', 'error');
            }
        });
    }

    saveSessionToStorage() {
        const sessionData = {
            sessionId: this.sessionId,
            facilitatorName: this.facilitatorName,
            sessionName: this.sessionName,
            createdAt: new Date().toISOString(),
            participants: this.participants,
            currentStory: this.currentStory,
            storyHistory: this.storyHistory,
            questions: this.questions,
            currentCardSet: this.currentCardSet
        };
        
        localStorage.setItem(`poker_session_${this.sessionId}`, JSON.stringify(sessionData));
    }

    loadSessionFromStorage(sessionId) {
        const sessionData = localStorage.getItem(`poker_session_${sessionId}`);
        return sessionData ? JSON.parse(sessionData) : null;
    }

    attachEventListeners() {
        // Form submission for room creation
        document.getElementById('roomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const facilitatorName = document.getElementById('facilitatorName').value.trim();
            const sessionName = document.getElementById('sessionName').value.trim();
            
            if (facilitatorName) {
                this.createSession(facilitatorName, sessionName);
            } else {
                this.showNotification('Veuillez entrer votre nom', 'warning');
            }
        });

        // Form submission for story creation
        document.getElementById('storyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStory();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.newStory();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetVotes();
                        break;
                    case 'Enter':
                        if (this.canRevealVotes()) {
                            e.preventDefault();
                            this.revealVotes();
                        }
                        break;
                }
            }
            
            // ESC pour fermer les modales
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeHelpModal();
                this.closeShareModal();
            }
        });

        // Clic à l'extérieur pour fermer les modales
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    // === GESTION DES STORIES ===
    newStory() {
        document.getElementById('storyModalTitle').textContent = '📝 Nouvelle User Story';
        document.getElementById('storyForm').reset();
        document.getElementById('storyModal').style.display = 'flex';
        document.getElementById('storyTitleInput').focus();
    }

    editStory() {
        if (!this.currentStory) {
            this.showNotification('Aucune story à éditer', 'warning');
            return;
        }

        document.getElementById('storyModalTitle').textContent = '✏️ Éditer la Story';
        document.getElementById('storyTitleInput').value = this.currentStory.title;
        document.getElementById('storyDescriptionInput').value = this.currentStory.description || '';
        document.getElementById('storyEpicInput').value = this.currentStory.epic || '';
        document.getElementById('storyPriorityInput').value = this.currentStory.priority || '';
        document.getElementById('storyModal').style.display = 'flex';
    }

    saveStory() {
        const title = document.getElementById('storyTitleInput').value.trim();
        const description = document.getElementById('storyDescriptionInput').value.trim();
        const epic = document.getElementById('storyEpicInput').value.trim();
        const priority = document.getElementById('storyPriorityInput').value;

        if (!title) {
            this.showNotification('Le titre de la story est requis', 'error');
            return;
        }

        const story = {
            id: this.currentStory?.id || this.generateStoryId(),
            title,
            description,
            epic,
            priority,
            createdAt: this.currentStory?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.currentStory = story;
        this.updateStoryDisplay();
        this.resetVotes();
        this.closeModal();
        
        this.showNotification('Story sauvegardée avec succès', 'success');
        this.saveToLocalStorage();
    }

    generateStoryId() {
        return `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    updateStoryDisplay() {
        if (!this.currentStory) return;

        document.getElementById('storyTitle').textContent = this.currentStory.title;
        document.getElementById('storyDescription').textContent = 
            this.currentStory.description || 'Aucune description fournie';
        document.getElementById('storyEpic').textContent = 
            this.currentStory.epic ? `Epic: ${this.currentStory.epic}` : '';
        
        const priorityEl = document.getElementById('storyPriority');
        const priorityText = {
            'critical': '🔴 Critique',
            'high': '🟠 Haute',
            'medium': '🟡 Moyenne',
            'low': '🟢 Basse'
        };
        priorityEl.textContent = this.currentStory.priority ? 
            priorityText[this.currentStory.priority] : '';
    }

    copyStory() {
        if (!this.currentStory) {
            this.showNotification('Aucune story à copier', 'warning');
            return;
        }

        const storyText = `**${this.currentStory.title}**\n\n` +
            `Description: ${this.currentStory.description || 'Non définie'}\n` +
            `Epic: ${this.currentStory.epic || 'Non définie'}\n` +
            `Priorité: ${this.currentStory.priority || 'Non définie'}`;

        navigator.clipboard.writeText(storyText).then(() => {
            this.showNotification('Story copiée dans le presse-papiers', 'success');
        }).catch(() => {
            this.showNotification('Erreur lors de la copie', 'error');
        });
    }

    skipStory() {
        if (!this.currentStory) return;

        const confirmation = confirm('Voulez-vous passer cette story sans l\'estimer ?');
        if (confirmation) {
            this.addToHistory({
                ...this.currentStory,
                estimate: 'Passée',
                votingResults: null,
                skipped: true,
                finishedAt: new Date().toISOString()
            });

            this.resetForNewStory();
            this.showNotification('Story passée', 'info');
        }
    }

    // === GESTION DES CARTES ===
    changeCardSet(setName) {
        this.currentCardSet = setName;
        this.generateVotingCards();
        this.resetVotes();
        this.saveToLocalStorage();
    }

    generateVotingCards() {
        const container = document.getElementById('cardsContainer');
        const cards = this.cardSets[this.currentCardSet];
        
        container.innerHTML = cards.map(value => `
            <div class="voting-card" 
                 data-value="${value}" 
                 onclick="poker.selectCard('${value}')"
                 title="Estimation: ${value}">
                <span class="card-value">${value}</span>
            </div>
        `).join('');
    }

    selectCard(value) {
        if (this.votingRevealed) {
            this.showNotification('Les votes sont déjà révélés', 'warning');
            return;
        }

        // Marquer la carte comme sélectionnée
        document.querySelectorAll('.voting-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-value="${value}"]`);
        selectedCard.classList.add('selected');

        // Enregistrer le vote
        this.votes['Vous'] = value;
        this.updateParticipantVote('Vous', value);
        this.checkVotingComplete();
        
        this.showNotification(`Carte ${value} sélectionnée`, 'success');
        this.saveToLocalStorage();
    }

    // === GESTION DES PARTICIPANTS ===
    addParticipant(name = null, isCurrentUser = false) {
        const participantName = name || prompt('Nom du participant:');
        if (!participantName || participantName.trim() === '') return;

        const trimmedName = participantName.trim();
        
        // Vérifier si le participant existe déjà
        if (this.participants.some(p => p.name === trimmedName)) {
            this.showNotification('Ce participant existe déjà', 'warning');
            return;
        }

        const participant = {
            id: this.generateParticipantId(),
            name: trimmedName,
            isCurrentUser,
            connected: true,
            vote: null,
            hasVoted: false
        };

        this.participants.push(participant);
        this.updateParticipantsDisplay();
        this.updateParticipantsCount();
        
        if (!isCurrentUser) {
            this.simulateParticipantVote(participant);
        }
        
        this.saveToLocalStorage();
    }

    generateParticipantId() {
        return `participant-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }

    removeParticipant(participantId) {
        const participant = this.participants.find(p => p.id === participantId);
        if (!participant) return;

        if (participant.isCurrentUser) {
            this.showNotification('Vous ne pouvez pas vous supprimer', 'error');
            return;
        }

        const confirmation = confirm(`Supprimer ${participant.name} de la session ?`);
        if (confirmation) {
            this.participants = this.participants.filter(p => p.id !== participantId);
            delete this.votes[participant.name];
            
            this.updateParticipantsDisplay();
            this.updateParticipantsCount();
            this.checkVotingComplete();
            this.saveToLocalStorage();
        }
    }

    updateParticipantsDisplay() {
        const grid = document.getElementById('participantsGrid');
        grid.innerHTML = this.participants.map(participant => `
            <div class="participant-card ${participant.hasVoted ? 'has-voted' : ''}" 
                 data-participant-id="${participant.id}">
                <div class="participant-info">
                    <span class="participant-name">
                        ${participant.name}
                        ${participant.isCurrentUser ? ' (Vous)' : ''}
                    </span>
                    <div class="participant-status">
                        <span class="connection-status ${participant.connected ? 'online' : 'offline'}">
                            ${participant.connected ? '🟢' : '🔴'}
                        </span>
                        <span class="vote-status">
                            ${participant.hasVoted ? '✅' : '⏳'}
                        </span>
                    </div>
                </div>
                
                <div class="participant-vote" id="vote-${participant.id}">
                    ${this.votingRevealed && participant.vote ? 
                        `<span class="revealed-vote">${participant.vote}</span>` : 
                        participant.hasVoted ? '🎴' : '❌'
                    }
                </div>
                
                ${!participant.isCurrentUser ? `
                    <button class="participant-remove" 
                            onclick="poker.removeParticipant('${participant.id}')" 
                            title="Supprimer">
                        ×
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    updateParticipantVote(participantName, vote) {
        const participant = this.participants.find(p => p.name === participantName);
        if (participant) {
            participant.vote = vote;
            participant.hasVoted = true;
            this.updateParticipantsDisplay();
        }
    }

    updateParticipantsCount() {
        document.getElementById('participantsCount').textContent = this.participants.length;
    }

    simulateParticipantVote(participant) {
        if (this.votingRevealed || !this.currentStory) return;

        // Simuler un vote après un délai aléatoire
        const delay = Math.random() * 10000 + 2000; // 2-12 secondes
        
        setTimeout(() => {
            if (this.votingRevealed || participant.hasVoted) return;

            const cards = this.cardSets[this.currentCardSet].filter(c => !['?', '☕', '∞'].includes(c));
            const randomVote = cards[Math.floor(Math.random() * cards.length)];
            
            this.votes[participant.name] = randomVote;
            this.updateParticipantVote(participant.name, randomVote);
            this.checkVotingComplete();
        }, delay);
    }

    // === GESTION DU VOTE ===
    resetVotes() {
        this.votes = {};
        this.votingRevealed = false;
        
        this.participants.forEach(participant => {
            participant.vote = null;
            participant.hasVoted = false;
        });

        // Réinitialiser l'UI
        document.querySelectorAll('.voting-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('revealBtn').disabled = true;
        document.getElementById('resultsPanel').style.display = 'none';
        
        this.updateParticipantsDisplay();
        this.saveToLocalStorage();
        
        // Relancer la simulation pour les autres participants
        this.participants.filter(p => !p.isCurrentUser).forEach(p => {
            this.simulateParticipantVote(p);
        });
    }

    checkVotingComplete() {
        const totalParticipants = this.participants.filter(p => p.connected).length;
        const totalVotes = Object.keys(this.votes).length;
        
        const canReveal = totalVotes > 0 && totalVotes >= Math.min(totalParticipants, 2);
        document.getElementById('revealBtn').disabled = !canReveal;
        
        return canReveal;
    }

    canRevealVotes() {
        return this.checkVotingComplete() && !this.votingRevealed;
    }

    revealVotes() {
        if (!this.canRevealVotes()) {
            this.showNotification('Impossible de révéler les votes maintenant', 'warning');
            return;
        }

        this.votingRevealed = true;
        this.updateParticipantsDisplay();
        this.calculateResults();
        this.displayResults();
        
        document.getElementById('revealBtn').disabled = true;
        this.saveToLocalStorage();
    }

    calculateResults() {
        const numericVotes = [];
        const specialVotes = { '?': 0, '☕': 0, '∞': 0 };
        
        Object.values(this.votes).forEach(vote => {
            if (['?', '☕', '∞'].includes(vote)) {
                specialVotes[vote]++;
            } else {
                const numValue = this.parseVoteValue(vote);
                if (!isNaN(numValue)) {
                    numericVotes.push(numValue);
                }
            }
        });

        this.votingResults = {
            numericVotes,
            specialVotes,
            totalVotes: Object.keys(this.votes).length,
            median: this.calculateMedian(numericVotes),
            average: numericVotes.length > 0 ? 
                Math.round(numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length * 10) / 10 : 0,
            consensus: this.checkConsensus(numericVotes),
            distribution: this.calculateDistribution()
        };
    }

    parseVoteValue(vote) {
        // Convertir les votes en valeurs numériques
        if (vote.endsWith('h')) {
            return parseInt(vote);
        }
        
        const tshirtValues = { 'XS': 0.5, 'S': 1, 'M': 3, 'L': 5, 'XL': 8, 'XXL': 13 };
        
        if (tshirtValues[vote]) {
            return tshirtValues[vote];
        }
        
        return parseFloat(vote) || 0;
    }

    calculateMedian(values) {
        if (values.length === 0) return 0;
        
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        return sorted.length % 2 === 0 ?
            (sorted[mid - 1] + sorted[mid]) / 2 :
            sorted[mid];
    }

    checkConsensus(votes) {
        if (votes.length === 0) return false;
        
        // Consensus si tous les votes sont identiques ou dans une fourchette de ±1
        const min = Math.min(...votes);
        const max = Math.max(...votes);
        
        return max - min <= 1;
    }

    calculateDistribution() {
        const distribution = {};
        Object.values(this.votes).forEach(vote => {
            distribution[vote] = (distribution[vote] || 0) + 1;
        });
        return distribution;
    }

    displayResults() {
        const resultsPanel = document.getElementById('resultsPanel');
        const { median, average, consensus, specialVotes, distribution } = this.votingResults;
        
        // Mise à jour des statistiques
        document.getElementById('medianValue').textContent = median || '-';
        document.getElementById('averageValue').textContent = average || '-';
        document.getElementById('consensusValue').textContent = consensus ? '✅ Oui' : '❌ Non';
        
        // Affichage du graphique simple
        this.displayDistributionChart(distribution);
        
        // Messages spéciaux
        let specialMessages = [];
        if (specialVotes['?'] > 0) {
            specialMessages.push(`${specialVotes['?']} participant(s) ne comprennent pas la story`);
        }
        if (specialVotes['☕'] > 0) {
            specialMessages.push(`${specialVotes['☕']} participant(s) demandent une pause`);
        }
        if (specialVotes['∞'] > 0) {
            specialMessages.push(`${specialVotes['∞']} participant(s) trouvent la story trop grosse`);
        }
        
        if (specialMessages.length > 0) {
            const specialAlert = document.createElement('div');
            specialAlert.className = 'special-votes-alert';
            specialAlert.innerHTML = `
                <h5>⚠️ Votes spéciaux:</h5>
                <ul>${specialMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>
            `;
            resultsPanel.querySelector('.results-content').prepend(specialAlert);
        }
        
        resultsPanel.style.display = 'block';
    }

    displayDistributionChart(distribution) {
        const chart = document.getElementById('resultsChart');
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        chart.innerHTML = Object.entries(distribution)
            .sort((a, b) => this.parseVoteValue(a[0]) - this.parseVoteValue(b[0]))
            .map(([vote, count]) => {
                const percentage = Math.round((count / total) * 100);
                return `
                    <div class="chart-bar">
                        <div class="chart-label">${vote}</div>
                        <div class="chart-progress">
                            <div class="chart-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-count">${count}</div>
                    </div>
                `;
            }).join('');
    }

    acceptEstimate() {
        if (!this.currentStory || !this.votingResults) return;
        
        const finalEstimate = prompt(
            `Estimation finale pour "${this.currentStory.title}" ?\n\n` +
            `Médiane: ${this.votingResults.median}\n` +
            `Moyenne: ${this.votingResults.average}\n` +
            `Consensus: ${this.votingResults.consensus ? 'Oui' : 'Non'}`,
            this.votingResults.consensus ? this.votingResults.median : ''
        );
        
        if (finalEstimate !== null && finalEstimate.trim() !== '') {
            this.addToHistory({
                ...this.currentStory,
                estimate: finalEstimate.trim(),
                votingResults: this.votingResults,
                votes: { ...this.votes },
                finishedAt: new Date().toISOString()
            });
            
            this.resetForNewStory();
            this.showNotification(`Story estimée à ${finalEstimate}`, 'success');
        }
    }

    discussAndRevote() {
        const discussion = prompt(
            'Points de discussion avant le re-vote:\n' +
            '(Ces notes seront ajoutées aux questions)'
        );
        
        if (discussion && discussion.trim()) {
            this.addQuestion(`💬 Discussion: ${discussion.trim()}`, 'Facilitateur');
        }
        
        this.resetVotes();
        this.showNotification('Nouveau round de vote lancé', 'info');
    }

    // === HISTORIQUE ===
    addToHistory(story) {
        this.storyHistory.unshift(story);
        this.updateHistoryDisplay();
        this.saveToLocalStorage();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.storyHistory.length === 0) {
            historyList.innerHTML = '<div class="history-empty"><p>Aucune estimation terminée</p></div>';
            return;
        }
        
        historyList.innerHTML = this.storyHistory.map(story => `
            <div class="history-item ${story.skipped ? 'skipped' : ''}">
                <div class="history-header">
                    <h5 class="history-title">${story.title}</h5>
                    <div class="history-meta">
                        <span class="history-estimate ${story.skipped ? 'estimate-skipped' : 'estimate-value'}">
                            ${story.skipped ? '⏭️ Passée' : story.estimate}
                        </span>
                        <span class="history-time">
                            ${new Date(story.finishedAt).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                
                ${!story.skipped ? `
                    <div class="history-stats">
                        <span>Médiane: ${story.votingResults.median}</span>
                        <span>Moyenne: ${story.votingResults.average}</span>
                        <span>Consensus: ${story.votingResults.consensus ? '✅' : '❌'}</span>
                        <span>Votes: ${Object.keys(story.votes).length}</span>
                    </div>
                ` : ''}
                
                <div class="history-actions">
                    <button class="btn btn-small" onclick="poker.viewHistoryDetails('${story.id}')">
                        👁️ Détails
                    </button>
                    <button class="btn btn-small" onclick="poker.duplicateStory('${story.id}')">
                        📋 Dupliquer
                    </button>
                    <button class="btn btn-small btn-danger" onclick="poker.removeFromHistory('${story.id}')">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        const confirmation = confirm('Supprimer tout l\'historique des estimations ?');
        if (confirmation) {
            this.storyHistory = [];
            this.updateHistoryDisplay();
            this.saveToLocalStorage();
            this.showNotification('Historique vidé', 'info');
        }
    }

    viewHistoryDetails(storyId) {
        const story = this.storyHistory.find(s => s.id === storyId);
        if (!story) return;
        
        const details = `
📋 DÉTAILS DE L'ESTIMATION

Story: ${story.title}
Epic: ${story.epic || 'Non définie'}
Priorité: ${story.priority || 'Non définie'}
Estimation finale: ${story.estimate}

${story.description ? `Description: ${story.description}\n` : ''}

${story.skipped ? 'Story passée sans estimation' : `
RÉSULTATS DU VOTE:
• Médiane: ${story.votingResults.median}
• Moyenne: ${story.votingResults.average}
• Consensus: ${story.votingResults.consensus ? 'Oui' : 'Non'}
• Total votes: ${Object.keys(story.votes).length}

DÉTAIL DES VOTES:
${Object.entries(story.votes).map(([name, vote]) => `• ${name}: ${vote}`).join('\n')}
`}

Terminée le: ${new Date(story.finishedAt).toLocaleString()}
        `.trim();
        
        alert(details);
    }

    duplicateStory(storyId) {
        const story = this.storyHistory.find(s => s.id === storyId);
        if (!story) return;
        
        this.currentStory = {
            id: this.generateStoryId(),
            title: `[COPY] ${story.title}`,
            description: story.description,
            epic: story.epic,
            priority: story.priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.updateStoryDisplay();
        this.resetVotes();
        this.showNotification('Story dupliquée', 'success');
    }

    removeFromHistory(storyId) {
        const confirmation = confirm('Supprimer cette estimation de l\'historique ?');
        if (confirmation) {
            this.storyHistory = this.storyHistory.filter(s => s.id !== storyId);
            this.updateHistoryDisplay();
            this.saveToLocalStorage();
        }
    }

    // === QUESTIONS & DISCUSSION ===
    addQuestion(text = null, author = 'Vous') {
        const questionText = text || document.getElementById('questionInput').value.trim();
        
        if (!questionText) {
            this.showNotification('Veuillez saisir une question', 'warning');
            return;
        }
        
        const question = {
            id: this.generateQuestionId(),
            text: questionText,
            author: author,
            timestamp: new Date().toISOString(),
            resolved: false
        };
        
        this.questions.unshift(question);
        this.updateQuestionsDisplay();
        
        if (!text) {
            document.getElementById('questionInput').value = '';
        }
        
        this.saveToLocalStorage();
        this.showNotification('Question ajoutée', 'success');
    }

    generateQuestionId() {
        return `question-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }

    addQuestionFromInput() {
        this.addQuestion();
    }

    handleQuestionKeypress(event) {
        if (event.key === 'Enter') {
            this.addQuestion();
        }
    }

    updateQuestionsDisplay() {
        const questionsList = document.getElementById('questionsList');
        
        if (this.questions.length === 0) {
            questionsList.innerHTML = '<div class="questions-empty">Aucune question pour le moment</div>';
            return;
        }
        
        questionsList.innerHTML = this.questions.map(question => `
            <div class="question-item ${question.resolved ? 'resolved' : ''}">
                <div class="question-content">
                    <div class="question-text">${question.text}</div>
                    <div class="question-meta">
                        <span class="question-author">${question.author}</span>
                        <span class="question-time">${new Date(question.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
                <div class="question-actions">
                    <button class="btn btn-small ${question.resolved ? 'btn-secondary' : 'btn-success'}"
                            onclick="poker.toggleQuestionResolved('${question.id}')">
                        ${question.resolved ? '↩️ Rouvrir' : '✅ Résolu'}
                    </button>
                    <button class="btn btn-small btn-danger" 
                            onclick="poker.removeQuestion('${question.id}')">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleQuestionResolved(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            question.resolved = !question.resolved;
            this.updateQuestionsDisplay();
            this.saveToLocalStorage();
        }
    }

    removeQuestion(questionId) {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.updateQuestionsDisplay();
        this.saveToLocalStorage();
    }

    // === UTILITAIRES ===
    resetForNewStory() {
        this.currentStory = null;
        this.votes = {};
        this.votingRevealed = false;
        this.votingResults = null;
        
        // Reset UI
        document.getElementById('storyTitle').textContent = 'Cliquez sur "Nouvelle Story" pour commencer';
        document.getElementById('storyDescription').textContent = 'Ajoutez une User Story à estimer par l\'équipe';
        document.getElementById('storyEpic').textContent = '';
        document.getElementById('storyPriority').textContent = '';
        document.getElementById('resultsPanel').style.display = 'none';
        document.getElementById('revealBtn').disabled = true;
        
        document.querySelectorAll('.voting-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.participants.forEach(participant => {
            participant.vote = null;
            participant.hasVoted = false;
        });
        
        this.updateParticipantsDisplay();
        this.saveToLocalStorage();
    }

    // === EXPORT & STATISTIQUES ===
    exportResults() {
        const exportData = {
            sessionId: this.sessionId,
            exportedAt: new Date().toISOString(),
            currentStory: this.currentStory,
            participants: this.participants,
            storyHistory: this.storyHistory,
            questions: this.questions,
            cardSet: this.currentCardSet,
            
            // Statistiques de session
            stats: {
                totalStories: this.storyHistory.length,
                totalSkipped: this.storyHistory.filter(s => s.skipped).length,
                totalEstimated: this.storyHistory.filter(s => !s.skipped).length,
                averageVotingTime: this.calculateAverageVotingTime(),
                consensusRate: this.calculateConsensusRate(),
                participantsCount: this.participants.length
            }
        };
        
        // Format pour JIRA (basique)
        const jiraFormat = this.generateJiraExport();
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `planning-poker-${this.sessionId}-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        this.showNotification('Données exportées avec succès', 'success');
    }

    generateJiraExport() {
        return this.storyHistory.filter(s => !s.skipped).map(story => ({
            summary: story.title,
            description: story.description,
            storyPoints: story.estimate,
            epic: story.epic,
            priority: story.priority
        }));
    }

    calculateAverageVotingTime() {
        // Simulation - dans une vraie app, on tracerait les temps
        return Math.round(Math.random() * 300 + 60); // 1-5 minutes
    }

    calculateConsensusRate() {
        const estimated = this.storyHistory.filter(s => !s.skipped && s.votingResults);
        if (estimated.length === 0) return 0;
        
        const consensusCount = estimated.filter(s => s.votingResults.consensus).length;
        return Math.round((consensusCount / estimated.length) * 100);
    }

    showStats() {
        const totalStories = this.storyHistory.length;
        const estimated = this.storyHistory.filter(s => !s.skipped);
        const skipped = this.storyHistory.filter(s => s.skipped);
        
        const avgEstimate = estimated.length > 0 ?
            Math.round(estimated.reduce((sum, s) => sum + (parseFloat(s.estimate) || 0), 0) / estimated.length * 10) / 10 :
            0;
        
        const consensusRate = this.calculateConsensusRate();
        
        const stats = `
📊 STATISTIQUES DE SESSION

📋 Stories:
• Total: ${totalStories}
• Estimées: ${estimated.length}
• Passées: ${skipped.length}
• Estimation moyenne: ${avgEstimate}

🎯 Qualité:
• Taux de consensus: ${consensusRate}%
• Participants: ${this.participants.length}
• Questions posées: ${this.questions.length}

🔧 Configuration:
• Jeu de cartes: ${this.currentCardSet}
• Session: ${this.sessionId}
• Temps de session: ${this.getSessionDuration()}

${estimated.length > 0 ? `
📈 Détail des estimations:
${estimated.map(s => `• ${s.title}: ${s.estimate} pts`).join('\n')}
` : ''}
        `.trim();
        
        alert(stats);
    }

    getSessionDuration() {
        // Estimer la durée depuis le premier élément de l'historique
        if (this.storyHistory.length === 0) return '0 min';
        
        const firstStory = this.storyHistory[this.storyHistory.length - 1];
        const duration = Date.now() - new Date(firstStory.createdAt).getTime();
        const minutes = Math.round(duration / 60000);
        
        return `${minutes} min`;
    }

    // === PARTAGE ===
    showShareModal() {
        if (!this.sessionId) {
            this.showNotification('Aucune session active à partager', 'warning');
            return;
        }
        
        // Générer le lien de partage
        const shareLink = `${window.location.origin}${window.location.pathname}?sessionId=${this.sessionId}`;
        document.getElementById('shareLink').value = shareLink;
        
        // Afficher la modale
        document.getElementById('shareModal').style.display = 'flex';
        
        // Focus sur le champ de lien pour faciliter la sélection
        setTimeout(() => {
            document.getElementById('shareLink').select();
        }, 100);
    }

    closeShareModal() {
        document.getElementById('shareModal').style.display = 'none';
        
        // Réinitialiser l'état de copie
        const container = document.querySelector('.share-link-input');
        if (container) {
            container.classList.remove('copied');
        }
    }

    toggleQR() {
        const qrSection = document.getElementById('shareQR');
        const button = event.target;
        
        if (qrSection.style.display === 'none') {
            qrSection.style.display = 'block';
            button.textContent = '📱 Masquer QR Code';
            
            // Ici on pourrait intégrer une vraie génération de QR Code
            // Par exemple avec une librairie comme qrcode.js
            this.generateQRCode();
        } else {
            qrSection.style.display = 'none';
            button.textContent = '📱 Afficher QR Code';
        }
    }

    generateQRCode() {
        // Simulation de génération de QR Code
        // Dans une vraie implémentation, on utiliserait une librairie
        const placeholder = document.querySelector('.qr-placeholder');
        const shareLink = document.getElementById('shareLink').value;
        
        placeholder.innerHTML = `
            <div style="width: 150px; height: 150px; background: white; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 12px; text-align: center; line-height: 1.2;">
                <div>
                    <strong>QR Code</strong><br>
                    <small>Session: ${this.sessionId}</small><br>
                    <small style="font-size: 10px; opacity: 0.7;">Scannez pour rejoindre</small>
                </div>
            </div>
        `;
        
        // Animation d'apparition
        placeholder.style.animation = 'qrGenerate 0.5s ease';
    }

    // === AIDE ===
    showHelp() {
        document.getElementById('helpModal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('storyModal').style.display = 'none';
    }

    closeHelpModal() {
        document.getElementById('helpModal').style.display = 'none';
    }

    // === SAUVEGARDE ===
    saveToLocalStorage() {
        const data = {
            sessionId: this.sessionId,
            facilitatorName: this.facilitatorName,
            sessionName: this.sessionName,
            currentStory: this.currentStory,
            participants: this.participants,
            votes: this.votes,
            votingRevealed: this.votingRevealed,
            currentCardSet: this.currentCardSet,
            storyHistory: this.storyHistory,
            questions: this.questions,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('planning-poker-session', JSON.stringify(data));
        
        // Sauvegarder aussi la session spécifique si on a un sessionId
        if (this.sessionId) {
            this.saveSessionToStorage();
        }
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('planning-poker-session');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            
            // Vérifier si les données ne sont pas trop anciennes (24h max)
            const lastSaved = new Date(data.lastSaved);
            const now = new Date();
            const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                console.log('Données sauvegardées trop anciennes, reset');
                return;
            }
            
            // Restaurer les données
            this.sessionId = data.sessionId || this.sessionId;
            this.facilitatorName = data.facilitatorName || this.facilitatorName;
            this.sessionName = data.sessionName || this.sessionName;
            this.currentStory = data.currentStory;
            this.votes = data.votes || {};
            this.votingRevealed = data.votingRevealed || false;
            this.currentCardSet = data.currentCardSet || 'fibonacci';
            this.storyHistory = data.storyHistory || [];
            this.questions = data.questions || [];
            
            // Restaurer les participants (sans le participant actuel)
            if (data.participants && data.participants.length > 1) {
                this.participants = data.participants;
            }
            
            // Mettre à jour l'UI
            if (this.sessionId) {
                document.getElementById('sessionId').textContent = `Session: ${this.sessionId}`;
                
                // Générer le lien de partage
                const shareLink = `${window.location.origin}${window.location.pathname}?sessionId=${this.sessionId}`;
                document.getElementById('shareLink').value = shareLink;
            }
            
            const cardSetElement = document.getElementById('cardSet');
            if (cardSetElement) {
                cardSetElement.value = this.currentCardSet;
            }
            
            if (this.currentStory) {
                this.updateStoryDisplay();
            }
            
            this.generateVotingCards();
            this.updateParticipantsDisplay();
            this.updateParticipantsCount();
            this.updateHistoryDisplay();
            this.updateQuestionsDisplay();
            
            if (this.votingRevealed && this.votes && Object.keys(this.votes).length > 0) {
                this.calculateResults();
                this.displayResults();
            }
            
            this.showNotification('Session restaurée', 'success');
            
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            this.showNotification('Erreur lors de la restauration de session', 'error');
        }
    }

    // === NOTIFICATIONS ===
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animation d'apparition
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// === INITIALISATION ===
let poker;

document.addEventListener('DOMContentLoaded', () => {
    poker = new PlanningPokerTool();
});

// Prévenir la fermeture accidentelle
window.addEventListener('beforeunload', (e) => {
    if (poker && (poker.currentStory || poker.storyHistory.length > 0)) {
        e.preventDefault();
        e.returnValue = 'Vous avez des données non sauvegardées. Voulez-vous vraiment quitter ?';
        return e.returnValue;
    }
});
