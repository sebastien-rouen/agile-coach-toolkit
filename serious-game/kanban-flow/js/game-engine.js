/**
 * Moteur principal du jeu Hospital Flow Master
 * Coordonne tous les systèmes et gère l'état global du jeu
 */

class GameEngine {
    constructor() {
        this.gameState = {
            isRunning: false,
            isPaused: false,
            speed: 1,
            score: 0,
            level: 1,
            startTime: null,
            endTime: null,
            gameDuration: 300, // 5 minutes par défaut (en secondes)
            elapsedTime: 0,
            totalPatientsTreated: 0,
            totalPatientsLost: 0, // Patients perdus (disparus)
            achievements: [],
            gameResults: null,
            stressLevel: 0 // Niveau de stress du service (0-100)
        };
        
        this.systems = {};
        this.gameLoop = null;
        this.saveInterval = null;
        this.timerInterval = null;
        
        this.initializeSystems();
        this.initializeUI();
        this.loadGameState();
    }
    
    /**
     * Initialise tous les sous-systèmes du jeu
     */
    initializeSystems() {
        // Initialiser les systèmes dans l'ordre de dépendance
        this.systems.patientGenerator = new PatientGenerator();
        this.systems.kanbanBoard = new KanbanBoard();
        this.systems.flowMetrics = new FlowMetrics();
        this.systems.eventSystem = new EventSystem();
        
        // Configurer les interactions entre systèmes
        this.setupSystemInteractions();
    }
    
    /**
     * Configure les interactions entre les différents systèmes
     */
    setupSystemInteractions() {
        // Écouter les événements de fin de patient pour le score
        document.addEventListener('patientCompleted', (event) => {
            this.handlePatientCompleted(event.detail.patient);
        });
        
        // Écouter les résolutions d'événements pour les achievements
        document.addEventListener('eventResolved', (event) => {
            this.handleEventResolved(event.detail);
        });
        
        // Écouter les changements de métriques pour les alertes
        document.addEventListener('metricsUpdate', (event) => {
            this.checkAchievements();
        });
        
        // Écouter les arrivées de patients pour le système de stress
        document.addEventListener('patientArrival', (event) => {
            this.handlePatientArrival(event.detail.patient);
        });
        
        // Écouter les patients perdus
        document.addEventListener('patientLost', (event) => {
            this.handlePatientLost(event.detail);
        });
        
        // Écouter les timeouts d'urgence
        document.addEventListener('emergencyTimeout', (event) => {
            this.handleEmergencyTimeout(event.detail);
        });
        
        // Écouter les blocages de priorité d'urgence
        document.addEventListener('emergencyPriorityBlocked', (event) => {
            this.showCentralNotification(event.detail.message, 'high', 3000);
        });
    }
    
    /**
     * Initialise l'interface utilisateur
     */
    initializeUI() {
        // Boutons de contrôle
        const pauseBtn = document.getElementById('pauseBtn');
        const speedBtn = document.getElementById('speedBtn');
        const helpBtn = document.getElementById('helpBtn');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }
        
        if (speedBtn) {
            speedBtn.addEventListener('click', () => this.cycleSpeed());
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelp());
        }
        
        // Panneau d'informations
        document.addEventListener('showPatientDetails', (event) => {
            this.showPatientDetails(event.detail.patient);
        });
        
        // Fermeture du panneau
        const closePanelBtn = document.getElementById('closePanelBtn');
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', () => this.closeInfoPanel());
        }
        
        // Initialiser l'affichage du timer
        this.initializeTimerDisplay();
        
        // Afficher le message de bienvenue au lieu de démarrer automatiquement
        setTimeout(() => {
            this.waitForDOMAndShowWelcome();
        }, 1500);
    }
    
    /**
     * Initialise le jeu (sans démarrer la génération)
     */
    startGame() {
        if (this.gameState.isRunning) return;
        
        // Initialiser sans démarrer la génération
        this.gameState.isRunning = false; // Restera false jusqu'à la sélection de durée
        
        // Démarrer seulement la boucle de jeu pour les métriques
        this.startGameLoop();
        
        // Démarrer la sauvegarde automatique
        this.startAutoSave();
        
        console.log('🏥 Hospital Flow Master initialisé !');
    }
    
    /**
     * NOUVEAU : Réinitialise l'état du jeu pour une nouvelle session
     */
    resetGameState() {
        console.log('Réinitialisation de l\'état du jeu...');
        
        // Arrêter tous les systèmes en cours
        if (this.systems.patientGenerator) {
            this.systems.patientGenerator.stop();
        }
        if (this.systems.eventSystem) {
            this.systems.eventSystem.stop();
        }
        
        // Nettoyer les timers
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.stressInterval) {
            clearInterval(this.stressInterval);
            this.stressInterval = null;
        }
        
        // Réinitialiser l'état du jeu
        this.gameState.isRunning = false;
        this.gameState.isPaused = false;
        this.gameState.elapsedTime = 0;
        this.gameState.score = 0;
        this.gameState.totalPatientsTreated = 0;
        this.gameState.totalPatientsLost = 0;
        this.gameState.stressLevel = 0;
        
        // Réinitialiser le générateur de patients
        if (this.systems.patientGenerator) {
            this.systems.patientGenerator.patientCounter = 1;
            this.systems.patientGenerator.isFirstPatients = true;
        }
        
        // Vider le tableau Kanban
        if (this.systems.kanbanBoard) {
            Object.keys(this.systems.kanbanBoard.columns).forEach(columnId => {
                this.systems.kanbanBoard.columns[columnId].patients = [];
            });
            this.systems.kanbanBoard.updateColumnCounts();
        }
        
        // Nettoyer l'affichage
        document.querySelectorAll('.patient-card').forEach(card => card.remove());
        
        console.log('État du jeu réinitialisé');
    }

    /**
     * Démarre réellement le jeu après sélection de durée
     */
    startGameSession() {
        // CORRECTION : Réinitialiser l'état du jeu avant de démarrer
        this.resetGameState();
        
        console.log('Démarrage de la session de jeu...');
        this.gameState.isRunning = true;
        this.gameState.startTime = new Date();
        
        // Démarrer tous les systèmes
        console.log('Démarrage du générateur de patients...');
        this.systems.patientGenerator.start();
        
        console.log('Démarrage du système d\'événements...');
        this.systems.eventSystem.start();
        
        // Démarrer le système de stress et de disparition
        this.startStressSystem();
        
        console.log('🏥 Session de jeu démarrée avec succès !');
        
        // Vérifier que les systèmes sont bien démarrés
        setTimeout(() => {
            console.log('État des systèmes après 1 seconde:');
            console.log('- Patient generator running:', this.systems.patientGenerator.isRunning);
            console.log('- Event system running:', this.systems.eventSystem.isRunning);
            console.log('- Game state running:', this.gameState.isRunning);
            console.log('- Patient counter:', this.systems.patientGenerator.patientCounter);
        }, 1000);
    }
    
    /**
     * Met en pause ou reprend le jeu
     */
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.gameState.isPaused ? '▶️ Reprendre' : '⏸️ Pause';
        }
        
        if (this.gameState.isPaused) {
            this.systems.patientGenerator.stop();
            this.systems.eventSystem.stop();
        } else {
            this.systems.patientGenerator.start();
            this.systems.eventSystem.start();
        }
    }
    
    /**
     * Change la vitesse du jeu
     */
    cycleSpeed() {
        const speeds = [0.5, 1, 2, 4];
        const currentIndex = speeds.indexOf(this.gameState.speed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        
        this.gameState.speed = speeds[nextIndex];
        this.systems.patientGenerator.setSpeed(this.gameState.speed);
        
        const speedBtn = document.getElementById('speedBtn');
        if (speedBtn) {
            speedBtn.textContent = `⏩ x${this.gameState.speed}`;
        }
    }
    
    /**
     * Démarre la boucle principale du jeu
     */
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.updateGame();
            }
        }, 1000); // Mise à jour chaque seconde
    }
    
    /**
     * Met à jour l'état du jeu
     */
    updateGame() {
        // Calculer le score
        this.updateScore();
        
        // Vérifier les conditions de niveau
        this.checkLevelProgression();
        
        // Vérifier les achievements
        this.checkAchievements();
        
        // Mettre à jour l'affichage
        this.updateGameDisplay();
        
        // Mettre à jour le timer
        this.updateTimer();
        
        // Vérifier le parking
        if (this.systems.kanbanBoard) {
            this.systems.kanbanBoard.checkParkingToTriage();
        }
    }
    
    /**
     * Démarre le timer du jeu
     */
    startGameTimer() {
        this.gameState.startTime = new Date();
        this.gameState.elapsedTime = 0;
        
        this.timerInterval = setInterval(() => {
            if (!this.gameState.isPaused && this.gameState.isRunning) {
                this.gameState.elapsedTime++;
                this.updateTimerDisplay();
                
                // Vérifier si le temps est écoulé
                if (this.gameState.elapsedTime >= this.gameState.gameDuration) {
                    this.endGame();
                }
            }
        }, 1000);
        
        this.updateTimerDisplay();
    }
    
    /**
     * Met à jour l'affichage du timer
     */
    updateTimerDisplay() {
        const remainingTime = this.gameState.gameDuration - this.gameState.elapsedTime;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Changer la couleur selon le temps restant
            if (remainingTime <= 30) {
                timerElement.classList.add('timer-critical');
            } else if (remainingTime <= 60) {
                timerElement.classList.add('timer-warning');
            } else {
                timerElement.classList.remove('timer-warning', 'timer-critical');
            }
        }
    }
    
    /**
     * Initialise l'affichage du timer
     */
    initializeTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        const scoreElement = document.getElementById('gameScore');
        
        if (timerElement) {
            timerElement.textContent = '5:00'; // Affichage par défaut
        }
        
        if (scoreElement) {
            scoreElement.textContent = '0';
        }
    }
    
    /**
     * Met à jour le timer (appelé dans updateGame)
     */
    updateTimer() {
        // Cette méthode est appelée par updateGame pour des mises à jour supplémentaires si nécessaire
    }
    
    /**
     * Démarre le système de stress et de disparition de patients
     */
    startStressSystem() {
        // Vérifier périodiquement les patients en attente trop longtemps
        this.stressInterval = setInterval(() => {
            if (this.gameState.isRunning && !this.gameState.isPaused) {
                this.checkPatientStress();
                this.updateStressLevel();
            }
        }, 10000); // Vérification toutes les 10 secondes
    }
    
    /**
     * Vérifie le stress des patients et gère les disparitions
     */
    checkPatientStress() {
        const allPatients = this.getAllPatientsInSystem();
        const now = new Date();
        
        allPatients.forEach(patient => {
            if (!patient.startTime) return;
            
            const waitingMinutes = Math.floor((now - patient.startTime) / (1000 * 60));
            const maxWaitTime = this.getMaxWaitTime(patient.priority);
            
            // Vérifier si le patient dépasse le temps d'attente critique
            if (waitingMinutes > maxWaitTime) {
                const disappearanceChance = this.calculateDisappearanceChance(waitingMinutes, maxWaitTime);
                
                if (Math.random() < disappearanceChance) {
                    this.makePatientDisappear(patient);
                } else {
                    // Afficher une notification de stress
                    this.showStressNotification(patient, waitingMinutes);
                }
            }
        });
    }
    
    /**
     * Récupère tous les patients actuellement dans le système
     */
    getAllPatientsInSystem() {
        const patients = [];
        const columns = ['triage', 'consultation', 'examens', 'traitement'];
        
        columns.forEach(columnId => {
            const column = document.getElementById(`${columnId}Column`);
            if (column) {
                const patientCards = column.querySelectorAll('.patient-card');
                patientCards.forEach(card => {
                    const patientData = card.patientData;
                    if (patientData) {
                        patients.push(patientData);
                    }
                });
            }
        });
        
        return patients;
    }
    
    /**
     * Détermine le temps d'attente maximum selon la priorité
     */
    getMaxWaitTime(priority) {
        const maxTimes = {
            'expedite': 15,    // 15 minutes max pour critique
            'urgent': 45,      // 45 minutes max pour urgent
            'standard': 120,   // 2 heures max pour standard
            'fixed-date': 90   // 1h30 max pour programmé
        };
        return maxTimes[priority] || 120;
    }
    
    /**
     * Calcule la probabilité de disparition d'un patient
     */
    calculateDisappearanceChance(waitingMinutes, maxWaitTime) {
        const overtimeRatio = (waitingMinutes - maxWaitTime) / maxWaitTime;
        
        // Probabilité croissante selon le dépassement
        if (overtimeRatio <= 0.5) return 0.1;  // 10% de chance
        if (overtimeRatio <= 1.0) return 0.25; // 25% de chance
        if (overtimeRatio <= 2.0) return 0.5;  // 50% de chance
        return 0.8; // 80% de chance si très en retard
    }
    
    /**
     * Fait disparaître un patient (il quitte l'hôpital mécontent)
     */
    makePatientDisappear(patient) {
        const patientCard = document.querySelector(`[data-patient-id="${patient.id}"]`);
        if (!patientCard) return;
        
        // Animation de disparition
        patientCard.classList.add('disappearing');
        
        // Calculer la pénalité de score
        const scorePenalty = this.calculateDisappearancePenalty(patient);
        this.gameState.score = Math.max(0, this.gameState.score - scorePenalty);
        this.gameState.totalPatientsLost++;
        
        // Afficher notification de disparition
        this.showDisappearanceNotification(patient, scorePenalty);
        
        // Supprimer le patient après l'animation
        setTimeout(() => {
            if (patientCard.parentNode) {
                patientCard.parentNode.removeChild(patientCard);
            }
            
            // Déclencher l'événement de patient perdu
            const event = new CustomEvent('patientLost', {
                detail: { patient, penalty: scorePenalty }
            });
            document.dispatchEvent(event);
        }, 1000);
        
        // Augmenter le niveau de stress
        this.gameState.stressLevel = Math.min(100, this.gameState.stressLevel + 15);
    }
    
    /**
     * Calcule la pénalité de score pour un patient qui disparaît
     */
    calculateDisappearancePenalty(patient) {
        const basePenalty = {
            'expedite': 500,   // Pénalité élevée pour critique
            'urgent': 300,     // Pénalité moyenne pour urgent
            'standard': 150,   // Pénalité faible pour standard
            'fixed-date': 200  // Pénalité moyenne pour programmé
        };
        
        return basePenalty[patient.priority] || 150;
    }
    
    /**
     * Affiche une notification de stress pour un patient en attente
     */
    showStressNotification(patient, waitingMinutes) {
        const urgencyLevel = this.getUrgencyLevel(patient.priority, waitingMinutes);
        
        const messages = {
            low: `⚠️ ${patient.name} attend depuis ${waitingMinutes}min`,
            medium: `🚨 ${patient.name} s'impatiente (${waitingMinutes}min d'attente)`,
            high: `🔥 ${patient.name} est très mécontent ! (${waitingMinutes}min)`,
            critical: `💥 ${patient.name} menace de partir ! (${waitingMinutes}min)`
        };
        
        this.showCentralNotification(messages[urgencyLevel], urgencyLevel, 3000);
    }
    
    /**
     * Affiche une notification de disparition
     */
    showDisappearanceNotification(patient, penalty) {
        const message = `😡 ${patient.name} a quitté l'hôpital mécontent ! -${penalty} points`;
        this.showCentralNotification(message, 'critical', 5000);
    }
    
    /**
     * Détermine le niveau d'urgence d'une notification
     */
    getUrgencyLevel(priority, waitingMinutes) {
        const maxTime = this.getMaxWaitTime(priority);
        const ratio = waitingMinutes / maxTime;
        
        if (ratio < 0.7) return 'low';
        if (ratio < 1.0) return 'medium';
        if (ratio < 1.5) return 'high';
        return 'critical';
    }
    
    /**
     * Affiche une notification centrale colorée
     */
    showCentralNotification(message, urgency = 'medium', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `central-notification urgency-${urgency}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <div class="notification-close">×</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Fermeture manuelle
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideCentralNotification(notification);
        });
        
        // Fermeture automatique
        setTimeout(() => {
            this.hideCentralNotification(notification);
        }, duration);
    }
    
    /**
     * Cache une notification centrale
     */
    hideCentralNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    /**
     * Met à jour le niveau de stress global
     */
    updateStressLevel() {
        const allPatients = this.getAllPatientsInSystem();
        const now = new Date();
        let totalStress = 0;
        
        allPatients.forEach(patient => {
            if (!patient.startTime) return;
            
            const waitingMinutes = Math.floor((now - patient.startTime) / (1000 * 60));
            const maxTime = this.getMaxWaitTime(patient.priority);
            const stressContribution = Math.max(0, (waitingMinutes / maxTime) * 20);
            
            totalStress += stressContribution;
        });
        
        // Décroissance naturelle du stress
        this.gameState.stressLevel = Math.max(0, this.gameState.stressLevel - 2);
        
        // Ajouter le stress des patients en attente
        this.gameState.stressLevel = Math.min(100, this.gameState.stressLevel + totalStress / 10);
        
        // Afficher des notifications selon le niveau de stress
        this.checkStressLevelNotifications();
    }
    
    /**
     * Vérifie si des notifications de niveau de stress sont nécessaires
     */
    checkStressLevelNotifications() {
        const stress = this.gameState.stressLevel;
        
        if (stress > 80 && Math.random() < 0.1) {
            this.showCentralNotification('🔥 Le service est en surchauffe ! Attention aux patients qui partent !', 'critical', 4000);
        } else if (stress > 60 && Math.random() < 0.05) {
            this.showCentralNotification('⚠️ Niveau de stress élevé dans le service', 'high', 3000);
        } else if (stress > 40 && Math.random() < 0.02) {
            this.showCentralNotification('📈 La pression monte dans le service...', 'medium', 2500);
        }
    }
    
    /**
     * Gère l'arrivée d'un nouveau patient
     */
    handlePatientArrival(patient) {
        // Augmenter légèrement le stress à chaque arrivée
        this.gameState.stressLevel = Math.min(100, this.gameState.stressLevel + 2);
        
        // Notification spéciale pour les patients critiques
        if (patient.priority === 'expedite') {
            this.showCentralNotification(`🚨 URGENCE VITALE : ${patient.name} (${patient.condition})`, 'critical', 4000);
        } else if (patient.priority === 'urgent') {
            this.showCentralNotification(`⚡ Patient urgent : ${patient.name}`, 'high', 2500);
        }
    }
    
    /**
     * Gère la perte d'un patient
     */
    handlePatientLost(eventDetail) {
        const { patient, penalty } = eventDetail;
        console.log(`Patient perdu: ${patient.name}, Pénalité: ${penalty} points`);
        
        // Appliquer la pénalité
        this.gameState.score = Math.max(0, this.gameState.score - penalty);
        this.gameState.totalPatientsLost++;
        
        // Mettre à jour l'affichage du score
        this.updateGameDisplay();
    }
    
    /**
     * Gère les timeouts d'urgence
     */
    handleEmergencyTimeout(eventDetail) {
        const { patient, message } = eventDetail;
        
        // Notification critique
        this.showCentralNotification(message, 'critical', 5000);
        
        // Augmenter drastiquement le stress
        this.gameState.stressLevel = Math.min(100, this.gameState.stressLevel + 30);
        
        console.log(`Timeout d'urgence: ${patient.name}`);
    }
    
    /**
     * Gère la fin de traitement d'un patient
     */
    handlePatientCompleted(patient) {
        this.gameState.totalPatientsTreated++;
        
        // Calculer les points selon la performance
        let points = this.calculatePatientScore(patient);
        this.gameState.score += points;
        
        // Afficher les points gagnés
        this.showScorePopup(points, patient);
    }
    
    /**
     * Calcule le score pour un patient traité
     */
    calculatePatientScore(patient) {
        let baseScore = 100;
        
        // Bonus selon la priorité
        const priorityBonus = {
            'expedite': 200,
            'urgent': 150,
            'standard': 100,
            'fixed-date': 120
        };
        baseScore = priorityBonus[patient.priority] || 100;
        
        // Bonus/malus selon le Lead Time
        const expectedLeadTime = {
            'expedite': 30,
            'urgent': 60,
            'standard': 180,
            'fixed-date': 120
        };
        
        const expected = expectedLeadTime[patient.priority];
        const timeRatio = patient.leadTime / expected;
        
        if (timeRatio <= 0.7) {
            baseScore *= 1.5; // Bonus 50% pour traitement rapide
        } else if (timeRatio <= 1.0) {
            baseScore *= 1.2; // Bonus 20% pour traitement dans les temps
        } else if (timeRatio <= 1.5) {
            baseScore *= 0.8; // Malus 20% pour léger retard
        } else {
            baseScore *= 0.5; // Malus 50% pour retard important
        }
        
        // Bonus selon la satisfaction
        const satisfactionMultiplier = patient.satisfaction / 100;
        baseScore *= satisfactionMultiplier;
        
        return Math.round(baseScore);
    }
    
    /**
     * Met à jour le score affiché
     */
    updateScore() {
        // Le score est mis à jour lors de la completion des patients
        // Ici on peut ajouter des bonus temporels ou autres
    }
    
    /**
     * Vérifie la progression de niveau
     */
    checkLevelProgression() {
        const patientsForNextLevel = this.gameState.level * 20; // 20 patients par niveau
        
        if (this.gameState.totalPatientsTreated >= patientsForNextLevel) {
            this.levelUp();
        }
    }
    
    /**
     * Fait passer au niveau supérieur
     */
    levelUp() {
        this.gameState.level++;
        
        // Augmenter la difficulté
        this.increaseDifficulty();
        
        // Afficher la notification de niveau
        this.showLevelUpNotification();
        
        // Débloquer de nouveaux achievements
        this.unlockLevelAchievements();
    }
    
    /**
     * Augmente la difficulté du jeu
     */
    increaseDifficulty() {
        // Augmenter la fréquence d'arrivée des patients
        this.systems.patientGenerator.baseArrivalRate *= 0.9;
        
        // Augmenter la probabilité d'événements
        this.systems.eventSystem.baseEventFrequency *= 0.95;
        
        console.log(`Niveau ${this.gameState.level} : Difficulté augmentée`);
    }
    
    /**
     * Vérifie et débloque les achievements
     */
    checkAchievements() {
        const achievements = [
            {
                id: 'first_patient',
                name: 'Premier patient',
                description: 'Traiter votre premier patient',
                condition: () => this.gameState.totalPatientsTreated >= 1,
                icon: '🏥'
            },
            {
                id: 'speed_demon',
                name: 'Démon de la vitesse',
                description: 'Traiter 5 patients en moins de 2h chacun',
                condition: () => this.checkSpeedAchievement(),
                icon: '⚡'
            },
            {
                id: 'satisfaction_master',
                name: 'Maître de la satisfaction',
                description: 'Maintenir 90%+ de satisfaction sur 10 patients',
                condition: () => this.checkSatisfactionAchievement(),
                icon: '😊'
            },
            {
                id: 'crisis_manager',
                name: 'Gestionnaire de crise',
                description: 'Résoudre 5 événements de crise',
                condition: () => this.checkCrisisAchievement(),
                icon: '🚨'
            },
            {
                id: 'efficiency_expert',
                name: 'Expert en efficacité',
                description: 'Atteindre un throughput de 20 patients/jour',
                condition: () => this.systems.flowMetrics.currentMetrics.throughput >= 20,
                icon: '📈'
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.gameState.achievements.includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    /**
     * Débloque un achievement
     */
    unlockAchievement(achievement) {
        this.gameState.achievements.push(achievement.id);
        this.showAchievementNotification(achievement);
        
        // Bonus de score pour l'achievement
        this.gameState.score += 500;
    }
    
    /**
     * Affiche les détails d'un patient dans le panneau latéral
     */
    showPatientDetails(patient) {
        const infoPanel = document.getElementById('infoPanel');
        const patientDetails = document.getElementById('patientDetails');
        
        if (!infoPanel || !patientDetails) return;
        
        const waitingTime = this.calculateWaitingTime(patient);
        const waitingMinutes = this.getWaitingMinutes(patient);
        const processingSteps = this.formatProcessingSteps(patient);
        
        // Déterminer les classes CSS selon les valeurs
        const waitingTimeClass = this.getWaitingTimeClass(waitingMinutes);
        const satisfactionClass = this.getSatisfactionClass(patient.satisfaction);
        
        patientDetails.innerHTML = `
            <div class="patient-detail-card">
                <div class="patient-detail-header">
                    <h4>${patient.name}</h4>
                    <span class="patient-id">${patient.id}</span>
                </div>
                
                <div class="patient-detail-info">
                    <div class="detail-row">
                        <span class="detail-label">👤 Âge:</span>
                        <span class="detail-value">${patient.age} ans</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">🏥 Condition:</span>
                        <span class="detail-value">${patient.condition}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">⚡ Priorité:</span>
                        <span class="detail-value priority-${patient.priority}">${this.getPriorityLabel(patient.priority)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">⏱️ Temps d'attente:</span>
                        <span class="detail-value ${waitingTimeClass}">${waitingTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">😊 Satisfaction:</span>
                        <span class="detail-value ${satisfactionClass}">${patient.satisfaction}%</span>
                    </div>
                </div>
                
                <div class="processing-timeline">
                    <h5>Parcours de soins</h5>
                    ${processingSteps}
                </div>
            </div>
        `;
        
        infoPanel.classList.add('open');
    }
    
    /**
     * Ferme le panneau d'informations
     */
    closeInfoPanel() {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.classList.remove('open');
        }
    }
    
    /**
     * Calcule le temps d'attente en minutes
     */
    getWaitingMinutes(patient) {
        if (!patient.startTime) return 0;
        
        const now = new Date();
        return Math.floor((now - patient.startTime) / (1000 * 60));
    }
    
    /**
     * Détermine la classe CSS pour le temps d'attente
     */
    getWaitingTimeClass(waitingMinutes) {
        if (waitingMinutes <= 30) return 'waiting-time-good';
        if (waitingMinutes <= 60) return 'waiting-time-warning';
        return 'waiting-time-critical';
    }
    
    /**
     * Détermine la classe CSS pour la satisfaction
     */
    getSatisfactionClass(satisfaction) {
        if (satisfaction >= 80) return 'satisfaction-high';
        if (satisfaction >= 60) return 'satisfaction-medium';
        return 'satisfaction-low';
    }
    
    /**
     * Affiche le message de bienvenue
     */
    showWelcomeMessage() {
        console.log('Tentative d\'affichage du message de bienvenue...');
        
        // Vérifier que les éléments DOM existent
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const options = document.getElementById('eventOptions');
        
        console.log('Éléments DOM trouvés:', { modal: !!modal, title: !!title, description: !!description, options: !!options });
        
        const welcomeEvent = {
            id: 'welcome',
            title: '🏥 Bienvenue à Hospital Flow Master !',
            description: 'Choisissez la durée de votre session de gestion hospitalière. Vous appliquerez les principes Kanban pour optimiser le flux de patients.',
            options: [
                {
                    text: '⚡ Session rapide (3 minutes)',
                    effect: { type: 'start_game', duration: 180 },
                    cost: 'Idéal pour découvrir les bases',
                    kanbanPrinciple: 'Expérimentation rapide'
                },
                {
                    text: '🎯 Session standard (5 minutes)',
                    effect: { type: 'start_game', duration: 300 },
                    cost: 'Équilibre entre apprentissage et pratique',
                    kanbanPrinciple: 'Cycle d\'amélioration continue'
                },
                {
                    text: '🏆 Session longue (10 minutes)',
                    effect: { type: 'start_game', duration: 600 },
                    cost: 'Pour maîtriser tous les aspects',
                    kanbanPrinciple: 'Optimisation complète du flux'
                },
                {
                    text: '📚 Tutoriel guidé (2 minutes)',
                    effect: { type: 'start_tutorial', duration: 120 },
                    cost: 'Apprentissage pas à pas',
                    kanbanPrinciple: 'Formation progressive'
                }
            ]
        };
        
        // Toujours utiliser le fallback direct pour garantir l'affichage
        console.log('Utilisation du fallback direct pour garantir l\'affichage');
        console.log('Event ID du message de bienvenue:', welcomeEvent.id);
        this.showEventModalDirect(welcomeEvent);
    }
    
    /**
     * Affiche l'aide du jeu
     */
    showHelp() {
        const helpContent = `
            <div class="help-content">
                <h3>🎯 Objectif</h3>
                <p>Gérez le flux de patients en appliquant les principes Kanban pour optimiser les délais et la satisfaction.</p>
                
                <h3>🎮 Comment jouer</h3>
                <ul>
                    <li><strong>Glisser-déposer</strong> : Déplacez les patients entre les colonnes</li>
                    <li><strong>Cliquer</strong> : Sélectionnez un patient pour voir ses détails</li>
                    <li><strong>Observer</strong> : Surveillez les métriques en temps réel</li>
                    <li><strong>Réagir</strong> : Répondez aux événements pour maintenir le flux</li>
                </ul>
                
                <h3>📊 Métriques clés</h3>
                <ul>
                    <li><strong>Lead Time</strong> : Temps total de prise en charge</li>
                    <li><strong>Throughput</strong> : Nombre de patients traités par jour</li>
                    <li><strong>Satisfaction</strong> : Niveau de satisfaction des patients</li>
                    <li><strong>WIP Limits</strong> : Limites de travail en cours par colonne</li>
                </ul>
                
                <h3>🚨 Classes de service</h3>
                <ul>
                    <li><strong>Critique</strong> : Traitement immédiat (AVC, infarctus)</li>
                    <li><strong>Urgent</strong> : Traitement prioritaire (douleurs thoraciques)</li>
                    <li><strong>Standard</strong> : Traitement normal (consultations)</li>
                    <li><strong>Programmé</strong> : Rendez-vous planifiés</li>
                </ul>
            </div>
        `;
        
        // Créer et afficher la modal d'aide
        this.showInfoModal('Aide - Hospital Flow Master', helpContent);
    }
    
    /**
     * Sauvegarde l'état du jeu
     */
    saveGameState() {
        const saveData = {
            gameState: this.gameState,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('hospitalFlowMaster_save', JSON.stringify(saveData));
        } catch (error) {
            console.warn('Impossible de sauvegarder:', error);
        }
    }
    
    /**
     * Charge l'état du jeu sauvegardé
     */
    loadGameState() {
        try {
            const saveData = localStorage.getItem('hospitalFlowMaster_save');
            if (saveData) {
                const parsed = JSON.parse(saveData);
                this.gameState = { ...this.gameState, ...parsed.gameState };
                console.log('État du jeu chargé');
            }
        } catch (error) {
            console.warn('Impossible de charger la sauvegarde:', error);
        }
    }
    
    /**
     * Démarre la sauvegarde automatique
     */
    startAutoSave() {
        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000); // Sauvegarde toutes les 30 secondes
    }
    
    /**
     * Utilitaires
     */
    calculateWaitingTime(patient) {
        if (!patient.startTime) return '0min';
        
        const now = new Date();
        const waitingMinutes = Math.floor((now - patient.startTime) / (1000 * 60));
        
        if (waitingMinutes < 60) {
            return `${waitingMinutes}min`;
        } else {
            const hours = Math.floor(waitingMinutes / 60);
            const minutes = waitingMinutes % 60;
            return `${hours}h${minutes.toString().padStart(2, '0')}`;
        }
    }
    
    formatProcessingSteps(patient) {
        if (!patient.processingSteps || patient.processingSteps.length === 0) {
            return '<div class="no-steps">📋 Aucune étape enregistrée pour le moment</div>';
        }
        
        // Définir les noms français des colonnes
        const columnNames = {
            'triage': 'Triage',
            'consultation': 'Consultation',
            'examens': 'Examens',
            'traitement': 'Traitement',
            'sortie': 'Sortie'
        };
        
        return patient.processingSteps.map(step => {
            const duration = step.endTime ? 
                Math.floor((step.endTime - step.startTime) / (1000 * 60)) : 
                Math.floor((new Date() - step.startTime) / (1000 * 60));
            
            const status = step.endTime ? '✅' : '⏳';
            const columnName = columnNames[step.column] || step.column;
            
            return `
                <div class="timeline-step">
                    <span class="step-status">${status}</span>
                    <span class="step-name">${columnName}</span>
                    <span class="step-duration">${duration}min</span>
                </div>
            `;
        }).join('');
    }
    
    getPriorityLabel(priority) {
        const labels = {
            'urgent': 'URGENT',
            'expedite': 'CRITIQUE',
            'standard': 'STANDARD',
            'fixed-date': 'PROGRAMMÉ'
        };
        return labels[priority] || 'STANDARD';
    }
    
    showInfoModal(title, content) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('eventTitle');
        const modalDescription = document.getElementById('eventDescription');
        const modalOptions = document.getElementById('eventOptions');
        
        if (!modal || !modalTitle || !modalDescription || !modalOptions) return;
        
        modalTitle.textContent = title;
        modalDescription.innerHTML = content;
        
        // Créer un bouton de fermeture pour l'aide
        modalOptions.innerHTML = '';
        const closeOption = document.createElement('div');
        closeOption.className = 'event-option';
        closeOption.innerHTML = `
            <div class="option-text">Fermer</div>
            <div class="option-cost">💡 Retour au jeu</div>
            <div class="option-principle">📚 Principe Kanban: Application pratique</div>
        `;
        
        closeOption.addEventListener('click', () => {
            console.log('Fermeture de la modal d\'aide');
            document.getElementById('eventModal').classList.remove('show');
        });
        
        modalOptions.appendChild(closeOption);
        
        modal.classList.add('show');
    }
    
    /**
     * Affiche une modal d'événement directement (fallback)
     */
    showEventModalDirect(event) {
        console.log('showEventModalDirect appelée avec:', event);
        
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const options = document.getElementById('eventOptions');
        
        console.log('Éléments trouvés:', { modal: !!modal, title: !!title, description: !!description, options: !!options });
        
        if (!modal || !title || !description || !options) {
            console.error('Éléments de modal non trouvés');
            console.error('Modal:', modal);
            console.error('Title:', title);
            console.error('Description:', description);
            console.error('Options:', options);
            return;
        }
        
        console.log('Configuration de la modal...');
        title.textContent = event.title;
        description.textContent = event.description;
        
        // Créer les options de réponse
        options.innerHTML = '';
        event.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'event-option';
            
            // Utiliser des data attributes différents pour éviter la confusion avec le système d'événements
            if (event.id === 'welcome') {
                optionDiv.dataset.welcomeOption = index;
            } else {
                optionDiv.dataset.eventId = event.id;
                optionDiv.dataset.optionIndex = index;
            }
            
            optionDiv.innerHTML = `
                <div class="option-text">${option.text}</div>
                <div class="option-cost">💡 ${option.cost || 'Aucun coût particulier'}</div>
                <div class="option-principle">📚 Principe Kanban: ${option.kanbanPrinciple || 'Principe général'}</div>
            `;
            
            // Ajouter l'écouteur d'événement directement avec stopPropagation pour éviter les conflits
            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Option cliquée:', index, 'pour événement:', event.id);
                
                if (event.id === 'welcome') {
                    this.handleWelcomeOptionClick(index);
                } else {
                    this.handleEventOptionClick(event.id, index);
                }
            });
            
            options.appendChild(optionDiv);
        });
        
        console.log('Affichage de la modal...');
        modal.classList.add('show');
        
        // Vérifier que la modal est visible
        setTimeout(() => {
            const isVisible = modal.classList.contains('show');
            console.log('Modal visible après 100ms:', isVisible);
        }, 100);
    }
    
    /**
     * Gère le clic sur les options de bienvenue
     */
    handleWelcomeOptionClick(optionIndex) {
        console.log('handleWelcomeOptionClick appelée avec index:', optionIndex);
        
        // Fermer la modal
        document.getElementById('eventModal').classList.remove('show');
        
        const durations = [180, 300, 600, 120]; // 3min, 5min, 10min, 2min tutoriel
        const selectedDuration = durations[optionIndex];
        
        this.gameState.gameDuration = selectedDuration;
        
        if (optionIndex === 3) {
            // Tutoriel guidé - définir la durée avant d'afficher le tutoriel
            console.log('Tutoriel démarré avec durée:', selectedDuration);
            this.showTutorialMessage();
        } else {
            // Commencer le jeu avec la durée choisie
            console.log(`Jeu démarré pour ${selectedDuration / 60} minutes !`);
            this.startGameSession();
            this.startGameTimer();
            
            // Afficher un message de début
            setTimeout(() => {
                this.showStartMessage(selectedDuration);
            }, 500);
        }
    }
    
    /**
     * Gère les clics sur les options d'événements génériques
     */
    handleEventOptionClick(eventId, optionIndex) {
        console.log('handleEventOptionClick appelée:', eventId, optionIndex);
        
        // Fermer la modal
        document.getElementById('eventModal').classList.remove('show');
        
        if (eventId === 'tutorial_step1') {
            // Fin du tutoriel, démarrer le jeu
            console.log('Fin du tutoriel, démarrage du jeu avec durée:', this.gameState.gameDuration);
            
            // S'assurer que la durée est définie (2 minutes pour le tutoriel)
            if (!this.gameState.gameDuration) {
                this.gameState.gameDuration = 120; // 2 minutes par défaut pour le tutoriel
            }
            
            this.startGameSession();
            this.startGameTimer();
            
            setTimeout(() => {
                this.showStartMessage(this.gameState.gameDuration);
            }, 500);
        }
        // Ajouter d'autres gestions d'événements ici si nécessaire
    }
    
    /**
     * Affiche un message de début de partie
     */
    showStartMessage(duration) {
        const minutes = duration / 60;
        const notification = document.createElement('div');
        notification.className = 'start-notification';
        notification.innerHTML = `
            <div class="start-icon">🏥</div>
            <div class="start-text">Session de ${minutes} minute${minutes > 1 ? 's' : ''} commencée !</div>
            <div class="start-subtext">Gérez le flux de patients avec les principes Kanban</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    /**
     * Affiche un message de tutoriel
     */
    /**
     * Attend que le DOM soit prêt et affiche le message de bienvenue
     */
    waitForDOMAndShowWelcome() {
        const checkDOM = () => {
            const modal = document.getElementById('eventModal');
            const title = document.getElementById('eventTitle');
            const description = document.getElementById('eventDescription');
            const options = document.getElementById('eventOptions');
            
            console.log('Vérification DOM:', { 
                modal: !!modal, 
                title: !!title, 
                description: !!description, 
                options: !!options 
            });
            
            if (modal && title && description && options) {
                console.log('DOM prêt, affichage du message de bienvenue');
                // Forcer l'affichage même si le système d'événements n'est pas prêt
                setTimeout(() => {
                    this.showWelcomeMessage();
                }, 200);
            } else {
                console.log('DOM pas encore prêt, nouvelle tentative dans 200ms...');
                setTimeout(checkDOM, 200);
            }
        };
        
        // Commencer la vérification immédiatement
        checkDOM();
    }
    
    showTutorialMessage() {
        console.log('Affichage du message de tutoriel...');
        
        // Démarrer immédiatement le jeu pour le tutoriel
        this.startGameSession();
        this.startGameTimer();
        
        // Afficher un message d'information rapide
        setTimeout(() => {
            const tutorialEvent = {
                id: 'tutorial_info',
                title: '📚 Tutoriel en cours !',
                description: 'Vous êtes en mode tutoriel (2 minutes). Les patients vont arriver dans la colonne Triage. Votre mission : les faire progresser dans le système de soins en respectant les principes Kanban. Glissez-déposez les patients entre les colonnes !',
                options: [
                    {
                        text: 'Compris, commençons !',
                        effect: { type: 'tutorial_continue' },
                        cost: 'Apprentissage par la pratique',
                        kanbanPrinciple: 'Visualisation du flux'
                    }
                ]
            };
            
            this.showEventModalDirect(tutorialEvent);
        }, 1000);
    }
    
    // Méthodes de vérification d'achievements
    checkSpeedAchievement() {
        const recentPatients = this.systems.flowMetrics.completedPatients.slice(-5);
        return recentPatients.length >= 5 && recentPatients.every(p => p.leadTime <= 120);
    }
    
    checkSatisfactionAchievement() {
        const recentPatients = this.systems.flowMetrics.completedPatients.slice(-10);
        return recentPatients.length >= 10 && recentPatients.every(p => p.satisfaction >= 90);
    }
    
    checkCrisisAchievement() {
        const crisisEvents = this.systems.eventSystem.eventHistory.filter(e => 
            ['mass_casualty', 'staff_shortage', 'equipment_failure'].includes(e.type)
        );
        return crisisEvents.length >= 5;
    }
    
    showScorePopup(points, patient) {
        // Créer une animation de points gagnés
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        
        // Positionner près de la colonne de sortie
        const sortieColumn = document.querySelector('[data-column="sortie"]');
        if (sortieColumn) {
            const rect = sortieColumn.getBoundingClientRect();
            popup.style.left = `${rect.left + rect.width / 2}px`;
            popup.style.top = `${rect.top + 50}px`;
        }
        
        document.body.appendChild(popup);
        
        // Animation et suppression
        setTimeout(() => {
            popup.classList.add('animate');
        }, 10);
        
        setTimeout(() => {
            popup.remove();
        }, 2000);
        
        console.log(`+${points} points pour ${patient.name}`);
    }
    
    showLevelUpNotification() {
        console.log(`Niveau ${this.gameState.level} atteint !`);
    }
    
    showAchievementNotification(achievement) {
        // Créer une notification d'achievement avec animation
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-icon">${achievement.icon}</span>
                <span class="achievement-title">Achievement débloqué !</span>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Créer des particules de célébration
        this.createCelebrationParticles();
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        console.log(`Achievement débloqué: ${achievement.name}`);
    }
    
    /**
     * Crée des particules de célébration pour les achievements
     */
    createCelebrationParticles() {
        const particles = ['🎉', '⭐', '🏆', '✨', '🎊'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'achievement-particle';
                particle.textContent = particles[Math.floor(Math.random() * particles.length)];
                
                // Position aléatoire
                particle.style.left = `${Math.random() * window.innerWidth}px`;
                particle.style.top = `${window.innerHeight - 50}px`;
                
                document.body.appendChild(particle);
                
                // Suppression automatique
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, i * 100);
        }
    }
    
    unlockLevelAchievements() {
        // Débloquer des achievements spécifiques au niveau
    }
    
    updateGameDisplay() {
        // Mettre à jour l'affichage du score
        const scoreElement = document.getElementById('gameScore');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score.toLocaleString();
        }
        
        // Mettre à jour l'indicateur de stress
        this.updateStressDisplay();
    }
    
    /**
     * Met à jour l'affichage du niveau de stress
     */
    updateStressDisplay() {
        const stressElement = document.getElementById('stressLevel');
        if (!stressElement) return;
        
        const stress = Math.round(this.gameState.stressLevel);
        stressElement.textContent = `${stress}%`;
        
        // Changer la classe selon le niveau de stress
        stressElement.className = '';
        if (stress < 25) {
            stressElement.classList.add('stress-level-low');
        } else if (stress < 50) {
            stressElement.classList.add('stress-level-medium');
        } else if (stress < 75) {
            stressElement.classList.add('stress-level-high');
        } else {
            stressElement.classList.add('stress-level-critical');
        }
    }
    
    /**
     * Termine le jeu et affiche les résultats
     */
    endGame() {
        this.gameState.isRunning = false;
        this.gameState.endTime = new Date();
        
        // Arrêter tous les systèmes
        this.systems.patientGenerator.stop();
        this.systems.eventSystem.stop();
        
        // Arrêter le système de stress
        if (this.stressInterval) {
            clearInterval(this.stressInterval);
        }
        
        // Arrêter les timers
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Arrêter tous les timers d'urgence
        this.stopAllEmergencyTimers();
        
        // Arrêter les transferts du parking
        this.stopParkingTransfers();
        
        // Calculer les résultats finaux
        this.calculateFinalResults();
        
        // Afficher le récapitulatif
        setTimeout(() => {
            this.showGameResults();
        }, 1000);
    }
    
    /**
     * Arrête tous les timers d'urgence actifs
     */
    stopAllEmergencyTimers() {
        if (this.systems.kanbanBoard) {
            // Parcourir toutes les colonnes pour trouver les patients avec des timers d'urgence
            Object.values(this.systems.kanbanBoard.columns).forEach(column => {
                if (column.patients) {
                    column.patients.forEach(patient => {
                        if (patient.timerId) {
                            clearInterval(patient.timerId);
                            patient.timerId = null;
                            console.log(`Timer d'urgence arrêté pour ${patient.name}`);
                        }
                        
                        // NOUVEAU : Arrêter aussi les barres de progression
                        if (patient.progressIntervalId) {
                            clearInterval(patient.progressIntervalId);
                            patient.progressIntervalId = null;
                            patient.isProcessing = false;
                            console.log(`Traitement arrêté pour ${patient.name}`);
                        }
                    });
                }
            });
        }
    }
    
    /**
     * Arrête les transferts automatiques du parking
     */
    stopParkingTransfers() {
        // Marquer que le jeu est terminé pour arrêter les vérifications du parking
        this.gameEnded = true;
    }
    
    /**
     * Calcule les résultats finaux du jeu
     */
    calculateFinalResults() {
        const metrics = this.systems.flowMetrics.currentMetrics;
        const completedPatients = this.systems.flowMetrics.completedPatients;
        
        // Calculs de performance
        const averageLeadTime = completedPatients.length > 0 ? 
            completedPatients.reduce((sum, p) => sum + p.leadTime, 0) / completedPatients.length : 0;
        
        const averageSatisfaction = completedPatients.length > 0 ?
            completedPatients.reduce((sum, p) => sum + p.satisfaction, 0) / completedPatients.length : 0;
        
        // Évaluation des performances
        const performance = this.evaluatePerformance(averageLeadTime, averageSatisfaction, metrics.throughput);
        
        this.gameState.gameResults = {
            duration: this.gameState.gameDuration,
            elapsedTime: this.gameState.elapsedTime,
            score: this.gameState.score,
            totalPatients: this.gameState.totalPatientsTreated,
            totalPatientsLost: this.gameState.totalPatientsLost,
            averageLeadTime: Math.round(averageLeadTime),
            averageSatisfaction: Math.round(averageSatisfaction),
            throughput: metrics.throughput,
            maxStressLevel: Math.round(this.gameState.stressLevel),
            achievements: this.gameState.achievements,
            performance: performance,
            kanbanLessons: this.generateKanbanLessons(performance)
        };
    }
    
    /**
     * Évalue la performance globale
     */
    evaluatePerformance(leadTime, satisfaction, throughput) {
        let score = 0;
        let grade = 'F';
        
        // Évaluation Lead Time (30 points max)
        if (leadTime <= 120) score += 30;
        else if (leadTime <= 180) score += 20;
        else if (leadTime <= 240) score += 10;
        
        // Évaluation Satisfaction (40 points max)
        if (satisfaction >= 90) score += 40;
        else if (satisfaction >= 80) score += 30;
        else if (satisfaction >= 70) score += 20;
        else if (satisfaction >= 60) score += 10;
        
        // Évaluation Throughput (30 points max)
        if (throughput >= 20) score += 30;
        else if (throughput >= 15) score += 20;
        else if (throughput >= 10) score += 10;
        
        // Attribution de la note
        if (score >= 90) grade = 'A+';
        else if (score >= 80) grade = 'A';
        else if (score >= 70) grade = 'B';
        else if (score >= 60) grade = 'C';
        else if (score >= 50) grade = 'D';
        
        return { score, grade };
    }
    
    /**
     * Génère les leçons Kanban basées sur la performance
     */
    generateKanbanLessons(performance) {
        const lessons = [];
        const metrics = this.systems.flowMetrics.currentMetrics;
        
        // Leçons sur le Lead Time
        if (metrics.leadTime > 180) {
            lessons.push({
                principle: 'Optimisation du flux',
                lesson: 'Votre Lead Time est élevé. En Kanban, réduire les temps d\'attente améliore la satisfaction client.',
                suggestion: 'Identifiez les goulots d\'étranglement et augmentez la capacité aux étapes critiques.'
            });
        }
        
        // Leçons sur les WIP Limits
        lessons.push({
            principle: 'Limites WIP (Work In Progress)',
            lesson: 'Les limites WIP empêchent la surcharge et maintiennent un flux régulier.',
            suggestion: 'Expérimentez avec différentes limites pour trouver l\'équilibre optimal.'
        });
        
        // Leçons sur les classes de service
        lessons.push({
            principle: 'Classes de service',
            lesson: 'Différencier les priorités (Critique, Urgent, Standard) optimise la valeur délivrée.',
            suggestion: 'Traitez les urgences rapidement tout en maintenant un flux pour les cas standards.'
        });
        
        // Leçons sur l'amélioration continue
        if (performance.grade >= 'B') {
            lessons.push({
                principle: 'Amélioration continue (Kaizen)',
                lesson: 'Excellente performance ! En Kanban, l\'amélioration continue est la clé du succès.',
                suggestion: 'Analysez vos métriques pour identifier les axes d\'amélioration prioritaires.'
            });
        } else {
            lessons.push({
                principle: 'Amélioration continue (Kaizen)',
                lesson: 'Chaque difficulté est une opportunité d\'apprentissage en Kanban.',
                suggestion: 'Analysez vos métriques pour identifier les axes d\'amélioration prioritaires.'
            });
        }
        
        return lessons;
    }
    
    /**
     * Affiche les résultats finaux du jeu
     */
    showGameResults() {
        const results = this.gameState.gameResults;
        if (!results) return;
        
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const options = document.getElementById('eventOptions');
        
        if (!modal || !title || !description || !options) return;
        
        title.textContent = '🏆 Résultats de votre session';
        
        // Construire le contenu des résultats
        const resultsHTML = `
            <div class="game-results">
                <div class="results-header">
                    <div class="final-score">Score final: ${results.score.toLocaleString()} points</div>
                    <div class="final-grade grade-${results.performance.grade.toLowerCase().replace('+', '\\+')}">${results.performance.grade}</div>
                </div>
                
                <div class="results-metrics">
                    <div class="metric-result">
                        <span class="metric-icon">👥</span>
                        <span class="metric-label">Patients traités</span>
                        <span class="metric-value">${results.totalPatients}</span>
                    </div>
                    <div class="metric-result ${results.totalPatientsLost > 0 ? 'metric-warning' : ''}">
                        <span class="metric-icon">😡</span>
                        <span class="metric-label">Patients perdus</span>
                        <span class="metric-value">${results.totalPatientsLost}</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">⏱️</span>
                        <span class="metric-label">Lead Time moyen</span>
                        <span class="metric-value">${results.averageLeadTime} min</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">😊</span>
                        <span class="metric-label">Satisfaction moyenne</span>
                        <span class="metric-value">${results.averageSatisfaction}%</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">🚀</span>
                        <span class="metric-label">Throughput</span>
                        <span class="metric-value">${results.throughput}/jour</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">🌡️</span>
                        <span class="metric-label">Stress maximum</span>
                        <span class="metric-value">${results.maxStressLevel}%</span>
                    </div>
                </div>
                
                <div class="kanban-lessons">
                    <h3>📚 Leçons Kanban apprises</h3>
                    ${results.kanbanLessons.map(lesson => `
                        <div class="lesson-card">
                            <h4>${lesson.principle}</h4>
                            <p class="lesson-text">${lesson.lesson}</p>
                            <p class="lesson-suggestion">💡 ${lesson.suggestion}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="achievements-summary">
                    <h3>🏅 Achievements débloqués (${results.achievements.length})</h3>
                    <div class="achievements-list">
                        ${results.achievements.length > 0 ? 
                            results.achievements.map(id => `<span class="achievement-badge">${this.getAchievementName(id)}</span>`).join('') :
                            '<span class="no-achievements">Aucun achievement débloqué cette fois</span>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        description.innerHTML = resultsHTML;
        
        // Créer le bouton de fermeture
        options.innerHTML = '';
        const closeOption = document.createElement('div');
        closeOption.className = 'event-option';
        closeOption.innerHTML = `
            <div class="option-text">Nouvelle partie</div>
            <div class="option-cost">💡 Recommencer avec une nouvelle session</div>
            <div class="option-principle">📚 Principe Kanban: Amélioration continue</div>
        `;
        
        closeOption.addEventListener('click', () => {
            modal.classList.remove('show');
            // Recharger la page pour une nouvelle partie
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
        
        options.appendChild(closeOption);
        
        modal.classList.add('show');
    }
    
    /**
     * Retourne le nom d'un achievement
     */
    getAchievementName(achievementId) {
        const names = {
            'first_patient': '🏥 Premier patient',
            'speed_demon': '⚡ Démon de la vitesse',
            'satisfaction_master': '😊 Maître de la satisfaction',
            'crisis_manager': '🚨 Gestionnaire de crise',
            'efficiency_expert': '📈 Expert en efficacité'
        };
        return names[achievementId] || achievementId;
    }
    
    /**
     * Affiche les résultats du jeu
     */
    showGameResults() {
        const results = this.gameState.gameResults;
        
        const resultsContent = `
            <div class="game-results">
                <div class="results-header">
                    <h2>🏆 Résultats de votre session</h2>
                    <div class="final-grade grade-${results.performance.grade.toLowerCase().replace('+', '\\+')}">
                        Note finale: ${results.performance.grade}
                    </div>
                    <div class="final-score">
                        🏆 Score total: ${results.score.toLocaleString()} points
                    </div>
                </div>
                
                <div class="results-metrics">
                    <div class="metric-result">
                        <span class="metric-icon">👥</span>
                        <span class="metric-label">Patients traités</span>
                        <span class="metric-value">${results.totalPatients}</span>
                    </div>
                    <div class="metric-result ${results.totalPatientsLost > 0 ? 'metric-warning' : ''}">
                        <span class="metric-icon">😡</span>
                        <span class="metric-label">Patients perdus</span>
                        <span class="metric-value">${results.totalPatientsLost}</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">⏱️</span>
                        <span class="metric-label">Lead Time moyen</span>
                        <span class="metric-value">${results.averageLeadTime} min</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">😊</span>
                        <span class="metric-label">Satisfaction moyenne</span>
                        <span class="metric-value">${results.averageSatisfaction}%</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">🚀</span>
                        <span class="metric-label">Throughput</span>
                        <span class="metric-value">${results.throughput}/jour</span>
                    </div>
                    <div class="metric-result">
                        <span class="metric-icon">🌡️</span>
                        <span class="metric-label">Stress maximum</span>
                        <span class="metric-value">${results.maxStressLevel}%</span>
                    </div>
                </div>
                
                <div class="kanban-lessons">
                    <h3>📚 Leçons Kanban apprises</h3>
                    ${results.kanbanLessons.map(lesson => `
                        <div class="lesson-card">
                            <h4>${lesson.principle}</h4>
                            <p class="lesson-text">${lesson.lesson}</p>
                            <p class="lesson-suggestion">💡 ${lesson.suggestion}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="achievements-summary">
                    <h3>🏅 Achievements débloqués (${results.achievements.length})</h3>
                    <div class="achievements-list">
                        ${results.achievements.length > 0 ? 
                            results.achievements.map(id => `<span class="achievement-badge">${this.getAchievementName(id)}</span>`).join('') :
                            '<span class="no-achievements">Aucun achievement cette fois. Réessayez pour en débloquer !</span>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        this.showInfoModal('🎯 Fin de session - Hospital Flow Master', resultsContent);
    }
    
    /**
     * Retourne le nom d'un achievement
     */
    getAchievementName(achievementId) {
        const achievements = {
            'first_patient': '🏥 Premier patient',
            'speed_demon': '⚡ Démon de la vitesse',
            'satisfaction_master': '😊 Maître de la satisfaction',
            'crisis_manager': '🚨 Gestionnaire de crise',
            'efficiency_expert': '📈 Expert en efficacité'
        };
        return achievements[achievementId] || achievementId;
    }

    handleEventResolved(detail) {
        // Gérer la résolution d'événements
        console.log('Événement résolu:', detail);
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
});

// Export pour utilisation dans d'autres modules
window.GameEngine = GameEngine;