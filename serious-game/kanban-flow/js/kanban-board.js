/**
 * Gestionnaire du tableau Kanban médical
 * Gère le déplacement des patients, les WIP limits et les interactions
 */

class KanbanBoard {
    constructor() {
        this.columns = {
            'triage': { name: 'Triage', wipLimit: 5, patients: [] },
            'consultation': { name: 'Consultation', wipLimit: 4, patients: [] },
            'examens': { name: 'Examens', wipLimit: 3, patients: [] },
            'traitement': { name: 'Traitement', wipLimit: 6, patients: [] },
            'sortie': { name: 'Sortie', wipLimit: Infinity, patients: [] }
        };
        
        // NOUVEAU : Temps de base ajustés selon les spécifications
        this.processingTimes = {
            'triage': { min: 3, max: 8 },         // 3-8 secondes (rapide)
            'consultation': { min: 4, max: 10 },  // 4-10 secondes (plus rapide)
            'examens': { min: 8, max: 18 },       // 8-18 secondes (plus long)
            'traitement': { min: 10, max: 22 },   // 10-22 secondes (plus long)
            'sortie': { min: 2, max: 6 }          // 2-6 secondes (rapide)
        };
        
        this.selectedPatient = null;
        this.draggedPatient = null;
        
        // NOUVEAU : Système de limitation des notifications
        this.lastNotificationTime = {};
        this.notificationCooldown = 3000; // 3 secondes entre notifications du même type
        
        this.initializeEventListeners();
        this.startProcessingLoop();
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    initializeEventListeners() {
        // Écouter l'arrivée de nouveaux patients
        document.addEventListener('patientArrival', (event) => {
            this.addPatient(event.detail.patient, event.detail.animated);
        });
        
        // Gestion du drag & drop
        document.addEventListener('dragstart', this.handleDragStart.bind(this));
        document.addEventListener('dragover', this.handleDragOver.bind(this));
        document.addEventListener('drop', this.handleDrop.bind(this));
        document.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // Sélection de patients pour afficher les détails
        document.addEventListener('click', this.handlePatientClick.bind(this));
    }
    
    /**
     * Ajoute un nouveau patient au triage
     */
    addPatient(patient, animated = false) {
        // NOUVEAU : Tous les patients suivent le protocole normal
        // Les urgences et critiques vont au triage mais avec un timer d'urgence
        if (patient.priority === 'urgent' || patient.priority === 'expedite') {
            // Calculer le timer d'urgence proportionnel à la durée de jeu
            const gameDuration = window.gameEngine ? window.gameEngine.gameState.gameDuration : 300;
            const baseRatio = patient.priority === 'expedite' ? 0.08 : 0.20; // 8% ou 20% de la durée totale
            patient.emergencyTimer = Math.round(gameDuration * baseRatio);
            
            // Minimum 45 secondes, maximum selon la priorité
            const minTime = 45;
            const maxTime = patient.priority === 'expedite' ? 180 : 360; // 3min ou 6min max
            patient.emergencyTimer = Math.max(minTime, Math.min(maxTime, patient.emergencyTimer));
            
            // Démarrer le timer d'urgence
            this.startEmergencyTimer(patient);
        }
        
        // Vérifier la WIP limit du triage pour tous les patients
        if (this.columns.triage.patients.length >= this.columns.triage.wipLimit) {
            // File d'attente externe (salle d'attente)
            this.handleTriageOverflow(patient);
            return;
        }
        
        patient.startTime = new Date();
        patient.currentColumn = 'triage';
        patient.processingSteps.push({
            column: 'triage',
            startTime: new Date(),
            endTime: null
        });
        
        // NOUVEAU : Placer les patients urgents en haut de colonne (priorité)
        if (patient.priority === 'expedite' || patient.priority === 'urgent') {
            this.columns.triage.patients.unshift(patient); // Ajouter au début
        } else {
            this.columns.triage.patients.push(patient); // Ajouter à la fin
        }
        
        if (animated) {
            this.animatePatientArrival(patient);
        } else {
            this.renderPatient(patient);
        }
        
        // CORRECTION : Démarrer la barre de progression au triage automatiquement
        // Mais le déplacement vers la colonne suivante reste manuel
        setTimeout(() => {
            this.startPatientProcessing(patient);
        }, animated ? 1000 : 300);
        
        this.updateColumnCounts();
        
        // Déclencher l'événement de mise à jour des métriques
        this.triggerMetricsUpdate();
    }
    

    

    
    /**
     * Démarre le timer d'urgence pour un patient
     */
    startEmergencyTimer(patient) {
        const timerId = setInterval(() => {
            // Arrêter le timer si le jeu est terminé
            if (window.gameEngine && !window.gameEngine.gameState.isRunning) {
                clearInterval(timerId);
                patient.timerId = null;
                return;
            }
            
            if (patient.emergencyTimer > 0) {
                patient.emergencyTimer--;
                
                // Mettre à jour l'affichage du timer (couloir d'urgence)
                const timerElement = document.getElementById(`timer-${patient.id}`);
                if (timerElement) {
                    timerElement.textContent = this.formatEmergencyTime(patient.emergencyTimer);
                    
                    // Changer la couleur selon le temps restant
                    if (patient.emergencyTimer <= 60) { // 1 minute
                        timerElement.classList.add('timer-critical');
                    } else if (patient.emergencyTimer <= 120) { // 2 minutes
                        timerElement.classList.add('timer-warning');
                    }
                }
                
                // Mettre à jour l'affichage du timer inline (flux normal)
                const timerInlineElement = document.getElementById(`timer-inline-${patient.id}`);
                if (timerInlineElement) {
                    timerInlineElement.textContent = `⏰ ${this.formatEmergencyTime(patient.emergencyTimer)}`;
                    
                    // Changer la couleur selon le temps restant
                    if (patient.emergencyTimer <= 60) { // 1 minute
                        timerInlineElement.classList.add('timer-critical');
                    } else if (patient.emergencyTimer <= 120) { // 2 minutes
                        timerInlineElement.classList.add('timer-warning');
                    }
                }
            } else {
                // Temps écoulé - patient critique !
                clearInterval(timerId);
                patient.timerId = null;
                this.handleEmergencyTimeout(patient);
            }
        }, 1000);
        
        // Stocker l'ID du timer pour pouvoir l'arrêter
        patient.timerId = timerId;
    }
    
    /**
     * Formate le temps d'urgence en minutes:secondes
     */
    formatEmergencyTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Gère le dépassement de temps d'urgence
     */
    handleEmergencyTimeout(patient) {
        // CORRECTION : Ne pas faire disparaître les patients en Sortie
        if (patient.currentColumn === 'sortie') {
            console.log(`Patient ${patient.name} en sortie - pas de disparition`);
            return; // Sortir sans faire disparaître le patient
        }
        
        // Trouver et supprimer le patient de sa colonne actuelle
        const currentColumn = patient.currentColumn;
        if (this.columns[currentColumn]) {
            this.columns[currentColumn].patients = this.columns[currentColumn].patients.filter(p => p.id !== patient.id);
        }
        
        // Trouver l'élément patient dans le DOM
        const patientCard = document.querySelector(`[data-patient-id="${patient.id}"]`);
        if (patientCard) {
            // Animation de disparition
            patientCard.classList.add('disappearing');
            
            // Supprimer l'élément après l'animation
            setTimeout(() => {
                if (patientCard.parentNode) {
                    patientCard.parentNode.removeChild(patientCard);
                }
            }, 1000);
        }
        
        // Pénalité de score importante
        const penalty = patient.priority === 'expedite' ? 1000 : 500;
        
        // Notification critique avec disparition
        const message = `💀 ${patient.name} (${patient.priority.toUpperCase()}) a quitté l'hôpital ! Timer dépassé. -${penalty} points`;
        window.gameEngine.showCentralNotification(message, 'critical', 6000);
        
        // Déclencher l'événement de patient perdu
        const lostEvent = new CustomEvent('patientLost', {
            detail: { patient, penalty }
        });
        document.dispatchEvent(lostEvent);
        
        // Mettre à jour les compteurs
        this.updateColumnCounts();
        this.triggerMetricsUpdate();
        
        console.log(`Patient urgent ${patient.name} disparu après timeout`);
    }
    

    
    /**
     * Anime l'arrivée d'un patient (style Theme Hospital)
     */
    animatePatientArrival(patient) {
        // Créer un personnage animé
        const character = document.createElement('div');
        character.className = `patient-character ${patient.priority}`;
        character.textContent = this.getPatientEmoji(patient);
        
        // Position de départ (hors écran à gauche)
        const triageColumn = document.querySelector('[data-column="triage"]');
        const rect = triageColumn.getBoundingClientRect();
        
        character.style.left = '-50px';
        character.style.top = `${rect.top + rect.height / 2}px`;
        
        document.body.appendChild(character);
        
        // Animation vers la colonne triage
        setTimeout(() => {
            character.style.left = `${rect.left + 20}px`;
            character.classList.add('walking');
            
            // Effet sur la colonne de destination
            triageColumn.classList.add('receiving-patient');
            setTimeout(() => {
                triageColumn.classList.remove('receiving-patient');
            }, 500);
        }, 100);
        
        // Supprimer le personnage et afficher la carte patient
        setTimeout(() => {
            character.remove();
            this.renderPatient(patient);
            
            // Animation de satisfaction selon la priorité
            setTimeout(() => {
                const patientCard = document.querySelector(`[data-patient-id="${patient.id}"]`);
                if (patientCard) {
                    if (patient.priority === 'expedite' || patient.priority === 'urgent') {
                        patientCard.classList.add('sad');
                    } else {
                        patientCard.classList.add('happy');
                    }
                }
            }, 200);
        }, 800);
    }
    
    /**
     * Retourne l'emoji approprié pour un patient
     */
    getPatientEmoji(patient) {
        const emojis = {
            'expedite': '🏃‍♂️', // Course pour les critiques
            'urgent': '🚶‍♀️',   // Marche rapide pour les urgents
            'standard': '🚶‍♂️', // Marche normale
            'fixed-date': '👴'  // Personne âgée pour les programmés
        };
        
        // Varier selon l'âge et le genre
        if (patient.age < 18) {
            return patient.priority === 'expedite' ? '🏃‍♀️' : '🧒';
        } else if (patient.age > 70) {
            return patient.priority === 'expedite' ? '🏃‍♂️' : '👴';
        }
        
        return emojis[patient.priority] || '🚶‍♂️';
    }
    
    /**
     * Gère le débordement du triage - met les patients dans le parking
     */
    handleTriageOverflow(patient) {
        // Ajouter le patient au parking
        patient.currentColumn = 'parking';
        patient.startTime = new Date();
        
        // Initialiser le parking s'il n'existe pas
        if (!this.columns.parking) {
            this.columns.parking = { name: 'Parking', patients: [] };
        }
        
        this.columns.parking.patients.push(patient);
        
        // Afficher le patient dans le parking
        this.renderPatientInParking(patient);
        
        // Créer une notification d'embouteillage
        const event = new CustomEvent('bottleneckDetected', {
            detail: {
                column: 'triage',
                message: `🚧 Goulot d'étranglement détecté ! ${patient.name} attend en salle d'attente.`,
                patient: patient,
                suggestions: [
                    'Augmenter temporairement la WIP limit du triage',
                    'Accélérer le processus de triage',
                    'Rediriger vers un autre service si possible'
                ]
            }
        });
        document.dispatchEvent(event);
        
        // Mettre à jour les compteurs
        this.updateParkingCount();
        
        // Vérifier périodiquement si on peut déplacer des patients du parking vers le triage
        this.checkParkingToTriage();
    }
    
    /**
     * Affiche un patient dans le parking
     */
    renderPatientInParking(patient) {
        const patientElement = this.createPatientElement(patient);
        patientElement.classList.add('parking-patient');
        
        const parkingContent = document.getElementById('parkingContent');
        if (parkingContent) {
            parkingContent.appendChild(patientElement);
        }
    }
    
    /**
     * Met à jour le compteur du parking
     */
    updateParkingCount() {
        const parkingCountElement = document.getElementById('parkingCount');
        if (parkingCountElement && this.columns.parking) {
            parkingCountElement.textContent = this.columns.parking.patients.length;
        }
    }
    
    /**
     * Vérifie si on peut déplacer des patients du parking vers le triage
     */
    checkParkingToTriage() {
        // Arrêter si le jeu est terminé
        if (window.gameEngine && window.gameEngine.gameEnded) return;
        
        if (!this.columns.parking || this.columns.parking.patients.length === 0) return;
        
        if (this.columns.triage.patients.length < this.columns.triage.wipLimit) {
            // Déplacer le premier patient du parking vers le triage
            const patient = this.columns.parking.patients.shift();
            
            // Supprimer de l'affichage du parking
            const patientElement = document.querySelector(`#parkingContent [data-patient-id="${patient.id}"]`);
            if (patientElement) {
                patientElement.remove();
            }
            
            // Ajouter au triage
            patient.currentColumn = 'triage';
            this.columns.triage.patients.push(patient);
            this.renderPatient(patient);
            
            // Mettre à jour les compteurs
            this.updateParkingCount();
            this.updateColumnCounts();
            
            // Continuer à vérifier s'il y a d'autres patients seulement si le jeu continue
            if (window.gameEngine && window.gameEngine.gameState.isRunning) {
                setTimeout(() => this.checkParkingToTriage(), 1000);
            }
        }
    }
    
    /**
     * Rend un patient dans l'interface
     */
    renderPatient(patient) {
        const patientElement = this.createPatientElement(patient);
        const columnElement = document.getElementById(`${patient.currentColumn}Column`);
        
        if (columnElement) {
            columnElement.appendChild(patientElement);
        }
    }
    
    /**
     * Crée l'élément HTML d'un patient
     */
    createPatientElement(patient) {
        const patientDiv = document.createElement('div');
        patientDiv.className = `patient-card ${patient.priority}`;
        patientDiv.draggable = true;
        patientDiv.dataset.patientId = patient.id;
        
        // Ajouter les données du patient à l'élément pour le système de stress
        patientDiv.patientData = patient;
        
        const waitingTime = this.calculateWaitingTime(patient);
        const priorityLabel = this.getPriorityLabel(patient.priority);
        
        // Ajouter l'heure programmée si applicable
        const scheduledTimeHtml = patient.scheduledTime ? 
            `<div class="patient-scheduled">📅 RDV: ${patient.scheduledTime}</div>` : '';
        
        // Ajouter le timer d'urgence si le patient est urgent/critique
        const emergencyTimerHtml = (patient.priority === 'urgent' || patient.priority === 'expedite') && patient.emergencyTimer ? 
            `<div class="emergency-timer-inline" id="timer-inline-${patient.id}">⏰ ${this.formatEmergencyTime(patient.emergencyTimer)}</div>` : '';
        
        // NOUVEAU : Ajouter la barre de progression sauf pour triage, sortie et parking
        const showProgressBar = patient.currentColumn !== 'triage' && patient.currentColumn !== 'sortie' && patient.currentColumn !== 'parking';
        const progressBarHtml = showProgressBar ? 
            `<div class="patient-progress-bar">
                <div class="patient-progress-fill ${patient.priority}" id="progress-${patient.id}" style="width: ${patient.processingProgress || 0}%"></div>
            </div>
            <div class="patient-progress-text" id="progress-text-${patient.id}">
                ${this.getProgressText(patient)}
            </div>` : '';
        
        patientDiv.innerHTML = `
            <div class="patient-header">
                <div class="patient-name">${patient.name}</div>
                <div class="patient-age">${patient.age} ans</div>
            </div>
            <div class="patient-condition">${patient.condition}</div>
            ${scheduledTimeHtml}
            ${emergencyTimerHtml}
            ${progressBarHtml}
            <div class="patient-timing">
                <span class="patient-waiting">⏱️ ${waitingTime}</span>
                <span class="patient-priority priority-${patient.priority}">${priorityLabel}</span>
            </div>
        `;
        
        return patientDiv;
    }
    
    /**
     * Calcule le temps d'attente d'un patient
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
    
    /**
     * Retourne le temps d'attente en minutes (pour les calculs)
     */
    getWaitingTimeMinutes(patient) {
        if (!patient.startTime) return 0;
        return Math.floor((new Date() - patient.startTime) / (1000 * 60));
    }
    
    /**
     * Retourne le label de priorité
     */
    getPriorityLabel(priority) {
        const labels = {
            'urgent': 'URGENT',
            'expedite': 'CRITIQUE',
            'standard': 'STANDARD',
            'fixed-date': 'PROGRAMMÉ'
        };
        return labels[priority] || 'STANDARD';
    }
    
    /**
     * NOUVEAU : Retourne le texte de progression selon l'étape
     */
    getProgressText(patient) {
        const progressTexts = {
            'triage': 'Évaluation en cours...',
            'consultation': 'Consultation médicale...',
            'examens': 'Examens en cours...',
            'traitement': 'Traitement en cours...',
            'sortie': 'Finalisation du dossier...'
        };
        
        const progress = Math.round(patient.processingProgress || 0);
        const text = progressTexts[patient.currentColumn] || 'Traitement...';
        
        if (!patient.isProcessing) {
            return `En attente de traitement...`;
        }
        
        return `${text} ${progress}%`;
    }
    
    /**
     * NOUVEAU : Démarre le traitement automatique d'un patient avec barre de progression
     */
    startPatientProcessing(patient) {
        if (patient.isProcessing) return; // Déjà en cours
        
        patient.isProcessing = true;
        patient.processingProgress = 0;
        patient.processingStartTime = new Date();
        
        // Calculer le temps de traitement total pour cette étape
        const totalProcessingTime = this.getExpectedProcessingTime(patient.currentColumn, patient);
        
        // Mettre à jour la barre de progression toutes les 100ms
        const progressInterval = setInterval(() => {
            if (!patient.isProcessing || !window.gameEngine?.gameState?.isRunning) {
                clearInterval(progressInterval);
                return;
            }
            
            const elapsed = new Date() - patient.processingStartTime;
            const progress = Math.min(100, (elapsed / totalProcessingTime) * 100);
            
            patient.processingProgress = progress;
            this.updateProgressBar(patient);
            
            // Traitement terminé
            if (progress >= 100) {
                clearInterval(progressInterval);
                this.completePatientProcessing(patient);
            }
        }, 100);
        
        // Stocker l'ID de l'intervalle pour pouvoir l'arrêter
        patient.progressIntervalId = progressInterval;
        
        // Mettre à jour l'affichage initial - recréer la carte patient avec la barre de progression
        this.refreshPatientDisplay(patient);
    }
    
    /**
     * NOUVEAU : Met à jour la barre de progression d'un patient
     */
    updateProgressBar(patient) {
        const progressFill = document.getElementById(`progress-${patient.id}`);
        const progressText = document.getElementById(`progress-text-${patient.id}`);
        
        // Si les éléments n'existent pas, recréer la carte patient
        if (!progressFill || !progressText) {
            this.refreshPatientDisplay(patient);
            return;
        }
        
        if (progressFill) {
            progressFill.style.width = `${patient.processingProgress}%`;
            progressFill.classList.add('processing');
        }
        
        if (progressText) {
            progressText.textContent = this.getProgressText(patient);
        }
    }
    
    /**
     * NOUVEAU : Termine le traitement automatique d'un patient (SANS MOUVEMENT AUTO)
     */
    completePatientProcessing(patient) {
        patient.isProcessing = false;
        patient.processingProgress = 100;
        
        // Nettoyer l'intervalle
        if (patient.progressIntervalId) {
            clearInterval(patient.progressIntervalId);
            patient.progressIntervalId = null;
        }
        
        // CORRECTION : Ne plus déplacer automatiquement les patients
        // Le joueur doit maintenant faire le drag & drop manuellement
        // GARDER la barre de progression à 100% visible jusqu'au déplacement manuel
        // Ne pas supprimer la barre, elle sera mise à jour lors du prochain déplacement
        
        // CORRECTION : Retirer les notifications "est prêt pour l'étape suivante"
        // Plus de notification automatique à 100%
    }
    
    /**
     * NOUVEAU : Rafraîchit l'affichage d'un patient
     */
    refreshPatientDisplay(patient) {
        const patientElement = document.querySelector(`[data-patient-id="${patient.id}"]`);
        if (patientElement) {
            const newElement = this.createPatientElement(patient);
            patientElement.parentNode.replaceChild(newElement, patientElement);
        }
    }
    
    /**
     * Gestion du drag & drop
     */
    handleDragStart(event) {
        if (!event.target.classList.contains('patient-card')) return;
        
        this.draggedPatient = event.target.dataset.patientId;
        event.target.style.opacity = '0.5';
        event.dataTransfer.effectAllowed = 'move';
    }
    
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        // Nettoyer les highlights précédents
        document.querySelectorAll('.board-column').forEach(col => {
            col.classList.remove('drag-over', 'drag-valid', 'drag-invalid', 'drag-progress-incomplete');
        });
        
        // Highlight de la colonne cible
        const column = event.target.closest('.board-column');
        if (column && this.draggedPatient) {
            const patient = this.findPatient(this.draggedPatient);
            const targetColumnId = column.dataset.column;
            
            if (patient) {
                // Vérifier spécifiquement la progression pour un feedback visuel différent
                if (patient.currentColumn !== 'triage' && patient.isProcessing && patient.processingProgress < 100) {
                    column.classList.add('drag-over', 'drag-progress-incomplete');
                } else if (this.canMovePatient(patient, targetColumnId)) {
                    column.classList.add('drag-over', 'drag-valid');
                } else {
                    column.classList.add('drag-over', 'drag-invalid');
                }
            }
        }
    }
    
    handleDrop(event) {
        event.preventDefault();
        
        const targetColumn = event.target.closest('.board-column');
        if (!targetColumn || !this.draggedPatient) return;
        
        const targetColumnId = targetColumn.dataset.column;
        const patient = this.findPatient(this.draggedPatient);
        
        if (patient && this.canMovePatient(patient, targetColumnId)) {
            this.movePatient(patient, targetColumnId);
        }
        
        // Nettoyer les highlights
        document.querySelectorAll('.board-column').forEach(col => {
            col.classList.remove('drag-over', 'drag-valid', 'drag-invalid', 'drag-progress-incomplete');
        });
    }
    
    handleDragEnd(event) {
        if (event.target.classList.contains('patient-card')) {
            event.target.style.opacity = '1';
        }
        this.draggedPatient = null;
    }
    
    /**
     * Vérifie si un patient peut être déplacé vers une colonne
     */
    canMovePatient(patient, targetColumn) {
        // NOUVEAU : Vérifier si la progression est terminée (sauf pour le triage initial)
        if (patient.currentColumn !== 'triage' && patient.isProcessing && patient.processingProgress < 100) {
            this.showProgressNotCompleteWarning(patient);
            return false;
        }
        
        // Empêcher le déplacement des patients standard s'il y a des urgences en attente
        if (patient.priority === 'standard' && this.hasEmergenciesWaiting()) {
            this.showEmergencyPriorityWarning();
            return false;
        }
        
        const normalColumns = ['triage', 'consultation', 'examens', 'traitement', 'sortie'];
        const currentColumnIndex = normalColumns.indexOf(patient.currentColumn);
        const targetColumnIndex = normalColumns.indexOf(targetColumn);
        
        // Si la colonne cible n'est pas dans le flux normal, refuser
        if (targetColumnIndex === -1) return false;
        
        // NOUVEAU : Tous les patients doivent suivre le flux séquentiel
        // Seule la colonne suivante est autorisée (pas de saut d'étapes)
        if (targetColumnIndex !== currentColumnIndex + 1) {
            return false;
        }
        
        // CORRECTION : Vérifier la WIP limit pour TOUS les patients (y compris urgents)
        const currentCount = this.columns[targetColumn].patients.length;
        const wipLimit = this.columns[targetColumn].wipLimit;
        
        if (currentCount >= wipLimit) {
            // Log pour débogage
            console.log(`WIP limit atteinte pour ${patient.name} (${patient.priority}) vers ${targetColumn}: ${currentCount}/${wipLimit}`);
            this.showWipLimitWarning(targetColumn);
            return false;
        }
        
        return true;
    }
    
    /**
     * Vérifie s'il y a des urgences en attente
     */
    hasEmergenciesWaiting() {
        // Vérifier s'il y a des patients urgents/critiques dans les colonnes normales
        const normalColumns = ['triage', 'consultation', 'examens', 'traitement'];
        return normalColumns.some(columnId => {
            return this.columns[columnId].patients.some(patient => 
                patient.priority === 'urgent' || patient.priority === 'expedite'
            );
        });
    }
    
    /**
     * NOUVEAU : Affiche un avertissement quand la progression n'est pas terminée
     */
    showProgressNotCompleteWarning(patient) {
        const notificationType = 'progressNotComplete';
        const now = Date.now();
        
        // Vérifier si on peut afficher la notification (cooldown)
        if (this.lastNotificationTime[notificationType] && 
            now - this.lastNotificationTime[notificationType] < this.notificationCooldown) {
            return; // Ignorer si trop récent
        }
        
        this.lastNotificationTime[notificationType] = now;
        
        const progress = Math.round(patient.processingProgress || 0);
        const message = `⏳ ${patient.name} est encore en traitement (${progress}%). Attendez la fin de la progression !`;
        
        if (window.gameEngine) {
            window.gameEngine.showCentralNotification(message, 'medium', 3000);
        }
    }

    /**
     * Affiche un avertissement de priorité d'urgence (avec limitation)
     */
    showEmergencyPriorityWarning() {
        const notificationType = 'emergencyPriority';
        const now = Date.now();
        
        // Vérifier si on peut afficher la notification (cooldown)
        if (this.lastNotificationTime[notificationType] && 
            now - this.lastNotificationTime[notificationType] < this.notificationCooldown) {
            return; // Ignorer si trop récent
        }
        
        this.lastNotificationTime[notificationType] = now;
        
        // Corriger le message (plus de référence au couloir d'urgence)
        const message = '🚨 Les urgences ont la priorité ! Traitez d\'abord les patients urgents en cours.';
        
        if (window.gameEngine) {
            window.gameEngine.showCentralNotification(message, 'high', 4000);
        }
    }
    
    /**
     * Déplace un patient vers une nouvelle colonne
     */
    movePatient(patient, targetColumn) {
        // Retirer de l'ancienne colonne
        const oldColumn = patient.currentColumn;
        
        this.columns[oldColumn].patients = this.columns[oldColumn].patients.filter(p => p.id !== patient.id);
        
        // Finaliser l'étape précédente
        const currentStep = patient.processingSteps[patient.processingSteps.length - 1];
        if (currentStep && !currentStep.endTime) {
            currentStep.endTime = new Date();
        }
        
        // Ajouter à la nouvelle colonne
        patient.currentColumn = targetColumn;
        patient.processingSteps.push({
            column: targetColumn,
            startTime: new Date(),
            endTime: null
        });
        
        // NOUVEAU : Réinitialiser l'état de progression pour la nouvelle colonne
        patient.isProcessing = false;
        patient.processingProgress = 0;
        if (patient.progressIntervalId) {
            clearInterval(patient.progressIntervalId);
            patient.progressIntervalId = null;
        }
        
        // NOUVEAU : Placer les patients urgents en haut de colonne (priorité)
        if (patient.priority === 'expedite' || patient.priority === 'urgent') {
            this.columns[targetColumn].patients.unshift(patient); // Ajouter au début
        } else {
            this.columns[targetColumn].patients.push(patient); // Ajouter à la fin
        }
        
        // Animation de déplacement
        this.animatePatientMovement(patient, oldColumn, targetColumn);
        
        // NOUVEAU : Démarrer le traitement avec barre de progression lors du drag & drop manuel
        if (targetColumn !== 'sortie') {
            setTimeout(() => {
                this.startPatientProcessing(patient);
            }, 700); // Attendre la fin de l'animation
        }
        
        this.updateColumnCounts();
        
        // Si le patient arrive en sortie, calculer les métriques finales
        if (targetColumn === 'sortie') {
            this.completePatientJourney(patient);
        }
        
        this.triggerMetricsUpdate();
    }
    
    /**
     * Anime le déplacement d'un patient entre colonnes
     */
    animatePatientMovement(patient, fromColumn, toColumn) {
        const patientElement = document.querySelector(`[data-patient-id="${patient.id}"]`);
        if (!patientElement) {
            this.renderPatient(patient);
            return;
        }
        
        // Créer un clone pour l'animation
        const clone = patientElement.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        
        const rect = patientElement.getBoundingClientRect();
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        
        document.body.appendChild(clone);
        
        // Cacher l'original
        patientElement.style.opacity = '0';
        
        // Position de destination
        const targetColumnElement = document.querySelector(`[data-column="${toColumn}"]`);
        const targetRect = targetColumnElement.getBoundingClientRect();
        
        // Animation
        setTimeout(() => {
            clone.style.transition = 'all 0.6s ease-in-out';
            clone.style.left = `${targetRect.left + 20}px`;
            clone.style.top = `${targetRect.top + 80}px`;
            
            // Effet sur la colonne de destination
            targetColumnElement.classList.add('receiving-patient');
            setTimeout(() => {
                targetColumnElement.classList.remove('receiving-patient');
            }, 600);
        }, 50);
        
        // NOUVEAU : Afficher immédiatement le patient dans la nouvelle colonne
        this.removePatientElement(patient.id);
        this.renderPatient(patient);
        
        // CORRECTION : Démarrer le traitement seulement lors du drag & drop manuel
        // Plus de traitement automatique à l'arrivée
        // if (toColumn !== 'sortie') {
        //     setTimeout(() => {
        //         this.startPatientProcessing(patient);
        //     }, 300);
        // }
        
        // Finaliser l'animation visuelle (cosmétique seulement)
        setTimeout(() => {
            clone.remove();
            
            // Animation de satisfaction selon le temps d'attente
            setTimeout(() => {
                const newPatientCard = document.querySelector(`[data-patient-id="${patient.id}"]`);
                if (newPatientCard) {
                    const waitingTime = this.calculateWaitingTime(patient);
                    const waitingMinutes = parseInt(waitingTime);
                    
                    if (waitingMinutes > 60) {
                        newPatientCard.classList.add('sad');
                    } else if (waitingMinutes < 30) {
                        newPatientCard.classList.add('happy');
                    }
                }
            }, 200);
        }, 650);
    }
    
    /**
     * Finalise le parcours d'un patient
     */
    completePatientJourney(patient) {
        patient.endTime = new Date();
        patient.leadTime = Math.floor((patient.endTime - patient.startTime) / (1000 * 60)); // en minutes
        
        // Calculer le cycle time (temps de traitement actif)
        let cycleTime = 0;
        patient.processingSteps.forEach(step => {
            if (step.endTime) {
                cycleTime += (step.endTime - step.startTime) / (1000 * 60);
            }
        });
        patient.cycleTime = Math.floor(cycleTime);
        
        // Calculer la satisfaction finale
        patient.satisfaction = this.calculateFinalSatisfaction(patient);
        
        // Déclencher l'événement de patient terminé
        const event = new CustomEvent('patientCompleted', {
            detail: { patient }
        });
        document.dispatchEvent(event);
        
        // Retirer le patient après un délai (pour visualisation)
        setTimeout(() => {
            this.removePatientFromSystem(patient);
        }, 5000);
    }
    
    /**
     * Calcule la satisfaction finale du patient
     */
    calculateFinalSatisfaction(patient) {
        let satisfaction = patient.satisfaction;
        
        // Pénalité pour temps d'attente excessif
        const expectedLeadTime = {
            'urgent': 60,      // 1 heure max
            'expedite': 30,    // 30 minutes max
            'standard': 180,   // 3 heures max
            'fixed-date': 120  // 2 heures max
        };
        
        const expected = expectedLeadTime[patient.priority];
        if (patient.leadTime > expected) {
            const penalty = Math.floor((patient.leadTime - expected) / 30) * 5; // -5% par 30min de retard
            satisfaction = Math.max(0, satisfaction - penalty);
        }
        
        // Bonus pour traitement rapide
        if (patient.leadTime < expected * 0.7) {
            satisfaction = Math.min(100, satisfaction + 10);
        }
        
        return satisfaction;
    }
    
    /**
     * Trouve un patient par son ID
     */
    findPatient(patientId) {
        for (const column of Object.values(this.columns)) {
            const patient = column.patients.find(p => p.id === patientId);
            if (patient) return patient;
        }
        return null;
    }
    
    /**
     * Supprime l'élément patient de l'interface
     */
    removePatientElement(patientId) {
        const element = document.querySelector(`[data-patient-id="${patientId}"]`);
        if (element) {
            element.remove();
        }
    }
    
    /**
     * Retire définitivement un patient du système
     */
    removePatientFromSystem(patient) {
        this.columns.sortie.patients = this.columns.sortie.patients.filter(p => p.id !== patient.id);
        this.removePatientElement(patient.id);
        this.updateColumnCounts();
        this.triggerMetricsUpdate();
    }
    
    /**
     * Met à jour les compteurs de colonnes
     */
    updateColumnCounts() {
        Object.keys(this.columns).forEach(columnId => {
            // Ignorer les colonnes spéciales
            if (columnId === 'parking' || columnId === 'emergency') return;
            
            const count = this.columns[columnId].patients.length;
            const countElement = document.getElementById(`${columnId}Count`);
            const columnHeader = document.querySelector(`[data-column="${columnId}"] .column-header`);
            
            if (countElement) {
                countElement.textContent = count;
                
                // Vérifier si la WIP limit est atteinte
                const wipLimit = this.columns[columnId].wipLimit;
                if (wipLimit !== Infinity && count >= wipLimit) {
                    // WIP limit atteinte - alerte rouge
                    countElement.classList.add('wip-limit-reached');
                    if (columnHeader) {
                        columnHeader.classList.add('wip-limit-reached');
                    }
                } else {
                    // WIP limit OK - retirer les alertes
                    countElement.classList.remove('wip-limit-reached');
                    if (columnHeader) {
                        columnHeader.classList.remove('wip-limit-reached');
                    }
                    
                    // Highlight si proche de la WIP limit (80%)
                    if (wipLimit !== Infinity && count >= wipLimit * 0.8) {
                        countElement.classList.add('near-limit');
                    } else {
                        countElement.classList.remove('near-limit');
                    }
                }
            }
            
            // NOUVEAU : Réorganiser visuellement les patients par priorité
            this.reorderPatientsByPriority(columnId);
        });
    }
    
    /**
     * NOUVEAU : Réorganise visuellement les patients par priorité dans une colonne
     */
    reorderPatientsByPriority(columnId) {
        const columnElement = document.getElementById(`${columnId}Column`);
        if (!columnElement) return;
        
        // Récupérer tous les éléments patients de cette colonne
        const patientElements = Array.from(columnElement.querySelectorAll('.patient-card'));
        
        // Trier par priorité (expedite > urgent > standard > fixed-date)
        const priorityOrder = { 'expedite': 0, 'urgent': 1, 'standard': 2, 'fixed-date': 3 };
        
        patientElements.sort((a, b) => {
            const priorityA = a.classList.contains('expedite') ? 'expedite' :
                            a.classList.contains('urgent') ? 'urgent' :
                            a.classList.contains('fixed-date') ? 'fixed-date' : 'standard';
            
            const priorityB = b.classList.contains('expedite') ? 'expedite' :
                            b.classList.contains('urgent') ? 'urgent' :
                            b.classList.contains('fixed-date') ? 'fixed-date' : 'standard';
            
            return priorityOrder[priorityA] - priorityOrder[priorityB];
        });
        
        // Réorganiser dans le DOM
        patientElements.forEach(element => {
            columnElement.appendChild(element);
        });
    }
    
    /**
     * Affiche un avertissement de WIP limit
     */
    showWipLimitWarning(column) {
        const event = new CustomEvent('wipLimitReached', {
            detail: {
                column: column,
                message: `La colonne ${this.columns[column].name} a atteint sa limite WIP !`,
                suggestions: [
                    'Augmenter temporairement la WIP limit',
                    'Accélérer le traitement dans cette colonne',
                    'Identifier et résoudre les blocages'
                ]
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Gestion du clic sur un patient
     */
    handlePatientClick(event) {
        if (!event.target.closest('.patient-card')) return;
        
        const patientId = event.target.closest('.patient-card').dataset.patientId;
        const patient = this.findPatient(patientId);
        
        if (patient) {
            this.selectedPatient = patient;
            this.showPatientDetails(patient);
        }
    }
    
    /**
     * Affiche les détails d'un patient
     */
    showPatientDetails(patient) {
        const event = new CustomEvent('showPatientDetails', {
            detail: { patient }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Boucle de traitement automatique (DÉSACTIVÉE - seulement mise à jour des timings)
     */
    startProcessingLoop() {
        setInterval(() => {
            // CORRECTION : Ne plus traiter automatiquement les patients
            // this.processPatients(); // DÉSACTIVÉ
            this.updatePatientTimings();
        }, 1000); // Mise à jour chaque seconde
    }
    
    /**
     * DÉSACTIVÉ : Traite automatiquement les patients selon leur temps de traitement
     * Cette méthode est désactivée pour que seules les actions manuelles déplacent les patients
     */
    processPatients() {
        // CORRECTION : Cette méthode est désactivée pour empêcher le mouvement automatique
        // Les patients ne bougent plus automatiquement, seulement par drag & drop
        return;
        
        /* CODE DÉSACTIVÉ
        Object.keys(this.columns).forEach(columnId => {
            if (columnId === 'sortie') return; // Pas de traitement automatique pour la sortie
            
            this.columns[columnId].patients.forEach(patient => {
                const currentStep = patient.processingSteps[patient.processingSteps.length - 1];
                if (!currentStep || currentStep.endTime) return;
                
                const processingTime = new Date() - currentStep.startTime;
                const expectedTime = this.getExpectedProcessingTime(columnId, patient);
                
                // Traitement automatique si le temps est écoulé et la colonne suivante a de la place
                if (processingTime >= expectedTime) {
                    const nextColumn = this.getNextColumn(columnId);
                    if (nextColumn && this.canMovePatient(patient, nextColumn)) {
                        this.movePatient(patient, nextColumn);
                    }
                }
            });
        });
        */
    }
    
    /**
     * Retourne le temps de traitement attendu pour une colonne et un patient
     */
    getExpectedProcessingTime(columnId, patient) {
        const baseTime = this.processingTimes[columnId];
        let time = this.randomBetween(baseTime.min, baseTime.max) * 1000; // Temps en secondes → millisecondes
        
        // NOUVEAU : Ajustement proportionnel à la durée de session
        const gameDuration = window.gameEngine?.gameState?.gameDuration || 300; // Durée en secondes
        const sessionMultiplier = this.getSessionMultiplier(gameDuration);
        time *= sessionMultiplier;
        
        // NOUVEAU : Ajustement selon la condition médicale spécifique
        const conditionMultiplier = this.getConditionMultiplier(patient.condition, columnId);
        time *= conditionMultiplier;
        
        // Ajustement selon la priorité
        const priorityMultiplier = {
            'expedite': 0.5,   // Traitement 2x plus rapide
            'urgent': 0.7,     // Traitement plus rapide
            'standard': 1.0,   // Temps normal
            'fixed-date': 1.2  // Peut prendre plus de temps
        };
        
        return time * (priorityMultiplier[patient.priority] || 1.0);
    }
    
    /**
     * NOUVEAU : Calcule le multiplicateur selon la durée de session
     */
    getSessionMultiplier(gameDuration) {
        // Durées de session : 120s (2min), 180s (3min), 300s (5min), 600s (10min)
        const sessionMultipliers = {
            120: 0.4,   // Session 2min : très rapide (40% du temps de base)
            180: 0.6,   // Session 3min : rapide (60% du temps de base)
            300: 1.0,   // Session 5min : temps normal (100% du temps de base)
            600: 1.8    // Session 10min : plus lent (180% du temps de base)
        };
        
        // Trouver le multiplicateur le plus proche
        const durations = Object.keys(sessionMultipliers).map(Number).sort((a, b) => a - b);
        let closestDuration = durations[0];
        
        for (const duration of durations) {
            if (Math.abs(gameDuration - duration) < Math.abs(gameDuration - closestDuration)) {
                closestDuration = duration;
            }
        }
        
        return sessionMultipliers[closestDuration] || 1.0;
    }
    
    /**
     * NOUVEAU : Calcule le multiplicateur de temps selon la condition médicale
     */
    getConditionMultiplier(condition, columnId) {
        // Multiplicateurs spécifiques par condition et par colonne
        const conditionMultipliers = {
            // Conditions simples - traitement plus rapide
            'Consultation générale': {
                'triage': 0.8,
                'consultation': 0.9,
                'examens': 0.7,      // Peu d'examens nécessaires
                'traitement': 0.8,
                'sortie': 0.9
            },
            'Maux de tête': {
                'triage': 0.9,
                'consultation': 0.8,
                'examens': 0.6,      // Examens basiques
                'traitement': 0.7,   // Traitement simple
                'sortie': 0.8
            },
            'Hypertension': {
                'triage': 0.9,
                'consultation': 1.0,
                'examens': 0.8,
                'traitement': 0.9,
                'sortie': 0.9
            },
            
            // Conditions complexes - traitement plus long
            'AVC suspecté': {
                'triage': 0.6,       // Triage très rapide
                'consultation': 0.7,
                'examens': 1.5,      // Scanner, IRM nécessaires
                'traitement': 1.8,   // Traitement complexe
                'sortie': 1.3
            },
            'Infarctus suspecté': {
                'triage': 0.5,       // Triage immédiat
                'consultation': 0.6,
                'examens': 1.4,      // ECG, prise de sang
                'traitement': 1.7,   // Intervention cardiaque
                'sortie': 1.4
            },
            'Douleur thoracique': {
                'triage': 0.8,
                'consultation': 1.1,
                'examens': 1.3,      // ECG, radio thorax
                'traitement': 1.2,
                'sortie': 1.1
            },
            'Douleurs abdominales': {
                'triage': 1.0,
                'consultation': 1.2,
                'examens': 1.4,      // Scanner abdominal
                'traitement': 1.3,
                'sortie': 1.1
            },
            
            // Chirurgies programmées - temps très variables
            'Chirurgie programmée - Appendicectomie': {
                'triage': 0.7,
                'consultation': 1.1,
                'examens': 1.2,
                'traitement': 2.0,   // Chirurgie longue
                'sortie': 1.5
            },
            'Chirurgie programmée - Hernie inguinale': {
                'triage': 0.8,
                'consultation': 1.0,
                'examens': 1.1,
                'traitement': 1.8,
                'sortie': 1.4
            },
            
            // Examens spécialisés
            'Suivi cardiologique': {
                'triage': 0.9,
                'consultation': 1.3,  // Consultation spécialisée
                'examens': 1.6,       // ECG, échographie
                'traitement': 1.1,
                'sortie': 1.0
            },
            'Contrôle diabète': {
                'triage': 0.9,
                'consultation': 1.1,
                'examens': 1.2,       // Prise de sang
                'traitement': 1.0,
                'sortie': 0.9
            }
        };
        
        // Retourner le multiplicateur spécifique ou 1.0 par défaut
        return conditionMultipliers[condition]?.[columnId] || 1.0;
    }
    
    /**
     * Retourne la colonne suivante dans le flux
     */
    getNextColumn(currentColumn) {
        const columns = Object.keys(this.columns);
        const currentIndex = columns.indexOf(currentColumn);
        return currentIndex < columns.length - 1 ? columns[currentIndex + 1] : null;
    }
    
    /**
     * Met à jour les timings affichés des patients
     */
    updatePatientTimings() {
        document.querySelectorAll('.patient-card').forEach(element => {
            const patientId = element.dataset.patientId;
            const patient = this.findPatient(patientId);
            
            if (patient) {
                const waitingTimeElement = element.querySelector('.patient-waiting');
                if (waitingTimeElement) {
                    waitingTimeElement.textContent = `⏱️ ${this.calculateWaitingTime(patient)}`;
                }
            }
        });
    }
    
    /**
     * Déclenche la mise à jour des métriques
     */
    triggerMetricsUpdate() {
        const event = new CustomEvent('metricsUpdate', {
            detail: { board: this }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Utilitaire pour générer un nombre aléatoire
     */
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Retourne toutes les données du tableau pour les métriques
     */
    getBoardData() {
        return {
            columns: this.columns,
            totalPatients: Object.values(this.columns).reduce((sum, col) => sum + col.patients.length, 0)
        };
    }
}

// Export pour utilisation dans d'autres modules
window.KanbanBoard = KanbanBoard;