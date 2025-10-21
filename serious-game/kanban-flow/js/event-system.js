/**
 * Système d'événements pour Hospital Flow Master
 * Gère les événements aléatoires, les défis et les situations d'apprentissage
 */

class EventSystem {
    constructor() {
        this.activeEvents = [];
        this.eventHistory = [];
        this.isRunning = false;
        this.eventInterval = null;
        this.baseEventFrequency = 120000; // 2 minutes entre les événements
        
        // Définition des événements possibles
        this.eventTypes = {
            bottleneck: {
                name: 'Goulot d\'étranglement',
                probability: 0.3,
                impact: 'workflow',
                severity: 'medium'
            },
            mass_casualty: {
                name: 'Afflux massif',
                probability: 0.1,
                impact: 'capacity',
                severity: 'high'
            },
            staff_shortage: {
                name: 'Personnel réduit',
                probability: 0.15,
                impact: 'capacity',
                severity: 'medium'
            },
            equipment_failure: {
                name: 'Panne d\'équipement',
                probability: 0.12,
                impact: 'workflow',
                severity: 'medium'
            },
            vip_patient: {
                name: 'Patient VIP',
                probability: 0.08,
                impact: 'priority',
                severity: 'low'
            },
            emergency_drill: {
                name: 'Exercice d\'urgence',
                probability: 0.05,
                impact: 'workflow',
                severity: 'low'
            },
            system_upgrade: {
                name: 'Amélioration système',
                probability: 0.1,
                impact: 'improvement',
                severity: 'positive'
            },
            quality_audit: {
                name: 'Audit qualité',
                probability: 0.1,
                impact: 'process',
                severity: 'medium'
            }
        };
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    initializeEventListeners() {
        // Écouter les événements déclenchés par d'autres systèmes
        document.addEventListener('bottleneckDetected', (event) => {
            this.handleBottleneckEvent(event.detail);
        });
        
        document.addEventListener('wipLimitReached', (event) => {
            this.handleWipLimitEvent(event.detail);
        });
        
        document.addEventListener('urgentAlert', (event) => {
            this.handleUrgentAlert(event.detail);
        });
        
        // Gestion des réponses aux événements (seulement pour les événements du système, pas les événements de bienvenue)
        document.addEventListener('click', (event) => {
            const eventOption = event.target.closest('.event-option');
            if (eventOption && eventOption.dataset.eventId && !eventOption.dataset.welcomeOption) {
                this.handleEventResponse(eventOption);
            }
        });
    }
    
    /**
     * Démarre le système d'événements
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.scheduleNextEvent();
    }
    
    /**
     * Arrête le système d'événements
     */
    stop() {
        this.isRunning = false;
        if (this.eventInterval) {
            clearTimeout(this.eventInterval);
            this.eventInterval = null;
        }
    }
    
    /**
     * Programme le prochain événement aléatoire
     */
    scheduleNextEvent() {
        if (!this.isRunning) return;
        
        const delay = this.calculateEventDelay();
        
        this.eventInterval = setTimeout(() => {
            if (this.isRunning) {
                this.triggerRandomEvent();
                this.scheduleNextEvent();
            }
        }, delay);
    }
    
    /**
     * Calcule le délai avant le prochain événement
     */
    calculateEventDelay() {
        // Variation aléatoire ±50%
        const variation = 0.5 + Math.random();
        return Math.round(this.baseEventFrequency * variation);
    }
    
    /**
     * Déclenche un événement aléatoire
     */
    triggerRandomEvent() {
        const eventType = this.selectRandomEventType();
        const event = this.generateEvent(eventType);
        
        this.showEventModal(event);
        this.activeEvents.push(event);
    }
    
    /**
     * Sélectionne un type d'événement selon les probabilités
     */
    selectRandomEventType() {
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const [type, config] of Object.entries(this.eventTypes)) {
            cumulativeProbability += config.probability;
            if (random <= cumulativeProbability) {
                return type;
            }
        }
        
        return 'bottleneck'; // Fallback
    }
    
    /**
     * Génère un événement spécifique
     */
    generateEvent(eventType) {
        const generators = {
            bottleneck: () => this.generateBottleneckEvent(),
            mass_casualty: () => this.generateMassCasualtyEvent(),
            staff_shortage: () => this.generateStaffShortageEvent(),
            equipment_failure: () => this.generateEquipmentFailureEvent(),
            vip_patient: () => this.generateVipPatientEvent(),
            emergency_drill: () => this.generateEmergencyDrillEvent(),
            system_upgrade: () => this.generateSystemUpgradeEvent(),
            quality_audit: () => this.generateQualityAuditEvent()
        };
        
        return generators[eventType] ? generators[eventType]() : this.generateBottleneckEvent();
    }
    
    /**
     * Génère un événement de goulot d'étranglement
     */
    generateBottleneckEvent() {
        const columns = ['consultation', 'examens', 'traitement'];
        const column = columns[Math.floor(Math.random() * columns.length)];
        
        return {
            id: this.generateEventId(),
            type: 'bottleneck',
            title: '🚧 Goulot d\'étranglement détecté',
            description: `La colonne ${column} accumule du retard. Les patients attendent plus longtemps que prévu.`,
            column: column,
            severity: 'medium',
            options: [
                {
                    text: 'Augmenter temporairement la WIP limit (+2)',
                    effect: { type: 'increase_wip', column: column, amount: 2 },
                    cost: 'Risque de surcharge du personnel',
                    kanbanPrinciple: 'Flexibilité des limites WIP'
                },
                {
                    text: 'Ajouter une ressource temporaire',
                    effect: { type: 'add_resource', column: column, duration: 300000 }, // 5 minutes
                    cost: 'Coût supplémentaire',
                    kanbanPrinciple: 'Gestion de la capacité'
                },
                {
                    text: 'Analyser et optimiser le processus',
                    effect: { type: 'process_improvement', column: column },
                    cost: 'Temps d\'analyse requis',
                    kanbanPrinciple: 'Amélioration continue'
                },
                {
                    text: 'Ne rien faire et observer',
                    effect: { type: 'no_action' },
                    cost: 'Dégradation possible des métriques',
                    kanbanPrinciple: 'Observation du flux'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement d'afflux massif
     */
    generateMassCasualtyEvent() {
        const scenarios = [
            'Accident de la route avec 5 blessés',
            'Intoxication alimentaire collective',
            'Accident du travail sur un chantier',
            'Malaise collectif dans une école'
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const patientCount = 3 + Math.floor(Math.random() * 4); // 3-6 patients
        
        return {
            id: this.generateEventId(),
            type: 'mass_casualty',
            title: '🚨 Afflux massif de patients',
            description: `${scenario}. ${patientCount} patients arrivent simultanément, dont plusieurs urgences.`,
            patientCount: patientCount,
            severity: 'high',
            options: [
                {
                    text: 'Activer le plan blanc (ressources d\'urgence)',
                    effect: { type: 'emergency_protocol', capacity_boost: 0.5 },
                    cost: 'Coût élevé, stress du personnel',
                    kanbanPrinciple: 'Classes de service d\'urgence'
                },
                {
                    text: 'Rediriger une partie vers d\'autres services',
                    effect: { type: 'redirect_patients', percentage: 0.3 },
                    cost: 'Délai de transfert',
                    kanbanPrinciple: 'Gestion de la demande'
                },
                {
                    text: 'Traiter avec les ressources actuelles',
                    effect: { type: 'normal_processing' },
                    cost: 'Allongement significatif des délais',
                    kanbanPrinciple: 'Respect des limites WIP'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement de personnel réduit
     */
    generateStaffShortageEvent() {
        const reasons = [
            'Plusieurs soignants en arrêt maladie',
            'Grève du personnel non-médical',
            'Formation obligatoire du personnel',
            'Congés simultanés non planifiés'
        ];
        
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        
        return {
            id: this.generateEventId(),
            type: 'staff_shortage',
            title: '👥 Personnel réduit',
            description: `${reason}. La capacité de traitement est réduite de 30%.`,
            capacityReduction: 0.3,
            severity: 'medium',
            options: [
                {
                    text: 'Faire appel à du personnel intérimaire',
                    effect: { type: 'temporary_staff', capacity_restore: 0.8 },
                    cost: 'Coût élevé, temps d\'adaptation',
                    kanbanPrinciple: 'Gestion de la capacité'
                },
                {
                    text: 'Réduire les WIP limits proportionnellement',
                    effect: { type: 'reduce_wip_limits', factor: 0.7 },
                    cost: 'Débit réduit',
                    kanbanPrinciple: 'Adaptation des limites WIP'
                },
                {
                    text: 'Prioriser uniquement les urgences',
                    effect: { type: 'priority_only', priority: 'urgent' },
                    cost: 'Report des cas standards',
                    kanbanPrinciple: 'Classes de service'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement de panne d'équipement
     */
    generateEquipmentFailureEvent() {
        const equipment = [
            'Scanner médical',
            'Système informatique',
            'Équipement de laboratoire',
            'Matériel de radiologie'
        ];
        
        const item = equipment[Math.floor(Math.random() * equipment.length)];
        
        return {
            id: this.generateEventId(),
            type: 'equipment_failure',
            title: '⚙️ Panne d\'équipement',
            description: `${item} en panne. Les examens nécessitant cet équipement sont bloqués.`,
            affectedColumn: 'examens',
            severity: 'medium',
            options: [
                {
                    text: 'Réparation d\'urgence (coûteuse)',
                    effect: { type: 'emergency_repair', duration: 60000 }, // 1 minute
                    cost: 'Coût élevé',
                    kanbanPrinciple: 'Élimination des blocages'
                },
                {
                    text: 'Rediriger vers un autre établissement',
                    effect: { type: 'external_redirect' },
                    cost: 'Délai de transfert, insatisfaction',
                    kanbanPrinciple: 'Gestion des contraintes'
                },
                {
                    text: 'Reporter les examens non-urgents',
                    effect: { type: 'defer_non_urgent' },
                    cost: 'Accumulation de retard',
                    kanbanPrinciple: 'Priorisation'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement patient VIP
     */
    generateVipPatientEvent() {
        const vipTypes = [
            'Personnalité politique locale',
            'Médecin de l\'hôpital',
            'Donateur important',
            'Célébrité locale'
        ];
        
        const vipType = vipTypes[Math.floor(Math.random() * vipTypes.length)];
        
        return {
            id: this.generateEventId(),
            type: 'vip_patient',
            title: '⭐ Patient VIP',
            description: `${vipType} arrive pour une consultation. La direction demande un traitement prioritaire.`,
            severity: 'low',
            options: [
                {
                    text: 'Traitement prioritaire immédiat',
                    effect: { type: 'vip_priority' },
                    cost: 'Retard pour les autres patients',
                    kanbanPrinciple: 'Classes de service spéciales'
                },
                {
                    text: 'Traitement selon la priorité médicale',
                    effect: { type: 'medical_priority_only' },
                    cost: 'Risque de mécontentement',
                    kanbanPrinciple: 'Équité du flux'
                },
                {
                    text: 'Créer une file dédiée temporaire',
                    effect: { type: 'dedicated_lane' },
                    cost: 'Complexité organisationnelle',
                    kanbanPrinciple: 'Swimlanes'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement d'amélioration système
     */
    generateSystemUpgradeEvent() {
        const improvements = [
            'Nouveau logiciel de gestion des patients',
            'Optimisation du circuit pharmaceutique',
            'Amélioration de la signalétique',
            'Formation du personnel aux nouvelles procédures'
        ];
        
        const improvement = improvements[Math.floor(Math.random() * improvements.length)];
        
        return {
            id: this.generateEventId(),
            type: 'system_upgrade',
            title: '🚀 Opportunité d\'amélioration',
            description: `${improvement} est disponible. Cela pourrait améliorer l'efficacité du service.`,
            severity: 'positive',
            options: [
                {
                    text: 'Implémenter immédiatement',
                    effect: { type: 'immediate_improvement', boost: 0.15 },
                    cost: 'Perturbation temporaire',
                    kanbanPrinciple: 'Amélioration continue'
                },
                {
                    text: 'Planifier pour une période calme',
                    effect: { type: 'scheduled_improvement' },
                    cost: 'Retard des bénéfices',
                    kanbanPrinciple: 'Gestion du changement'
                },
                {
                    text: 'Tester sur un échantillon d\'abord',
                    effect: { type: 'pilot_test' },
                    cost: 'Bénéfices partiels',
                    kanbanPrinciple: 'Expérimentation'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Génère un événement d'audit qualité
     */
    generateQualityAuditEvent() {
        return {
            id: this.generateEventId(),
            type: 'quality_audit',
            title: '📋 Audit qualité surprise',
            description: 'Un auditeur externe arrive pour évaluer la qualité des soins et l\'organisation du service.',
            severity: 'medium',
            options: [
                {
                    text: 'Maintenir les procédures normales',
                    effect: { type: 'normal_operations' },
                    cost: 'Risque de non-conformités',
                    kanbanPrinciple: 'Transparence du processus'
                },
                {
                    text: 'Renforcer temporairement les contrôles',
                    effect: { type: 'enhanced_controls' },
                    cost: 'Ralentissement temporaire',
                    kanbanPrinciple: 'Qualité du flux'
                },
                {
                    text: 'Présenter les métriques Kanban',
                    effect: { type: 'showcase_metrics' },
                    cost: 'Temps de présentation',
                    kanbanPrinciple: 'Mesure et visualisation'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
    }
    
    /**
     * Affiche la modal d'événement
     */
    showEventModal(event) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const options = document.getElementById('eventOptions');
        
        if (!modal || !title || !description || !options) return;
        
        title.textContent = event.title;
        description.textContent = event.description;
        
        // Créer les options de réponse
        options.innerHTML = '';
        event.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'event-option';
            optionDiv.dataset.eventId = event.id;
            optionDiv.dataset.optionIndex = index;
            
            // NOUVEAU : Ajouter des icônes et couleurs selon l'impact
            const impactIcon = this.getImpactIcon(option.effect?.type);
            const impactClass = this.getImpactClass(option.effect?.type);
            
            optionDiv.innerHTML = `
                <div class="option-header">
                    <span class="option-impact-icon">${impactIcon}</span>
                    <div class="option-text">${option.text}</div>
                </div>
                <div class="option-details">
                    <div class="option-cost">⚠️ ${option.cost || 'Aucun coût particulier'}</div>
                    <div class="option-principle">📚 Principe Kanban: ${option.kanbanPrinciple || 'Principe général'}</div>
                </div>
            `;
            
            optionDiv.classList.add(impactClass);
            
            options.appendChild(optionDiv);
        });
        
        modal.classList.add('show');
    }
    
    /**
     * Gère la réponse à un événement
     */
    handleEventResponse(optionElement) {
        const eventId = optionElement.dataset.eventId;
        const optionIndex = parseInt(optionElement.dataset.optionIndex);
        
        // Chercher l'événement dans les événements actifs ou traiter les événements spéciaux
        let event = this.activeEvents.find(e => e.id === eventId);
        
        // Si c'est l'événement de bienvenue, le traiter spécialement
        if (eventId === 'welcome') {
            this.handleWelcomeResponse(optionIndex);
            return;
        }
        
        if (!event) return;
        
        const selectedOption = event.options[optionIndex];
        
        // Appliquer l'effet de l'option choisie
        this.applyEventEffect(selectedOption.effect, event);
        
        // Marquer l'événement comme résolu
        event.resolved = true;
        event.resolution = selectedOption;
        event.resolvedAt = new Date();
        
        // Déplacer vers l'historique
        this.eventHistory.push(event);
        this.activeEvents = this.activeEvents.filter(e => e.id !== eventId);
        
        // Fermer la modal
        document.getElementById('eventModal').classList.remove('show');
        
        // Déclencher l'événement de résolution
        const resolutionEvent = new CustomEvent('eventResolved', {
            detail: { event, option: selectedOption }
        });
        document.dispatchEvent(resolutionEvent);
    }
    
    /**
     * Gère la réponse au message de bienvenue
     */
    handleWelcomeResponse(optionIndex) {
        // Fermer la modal
        document.getElementById('eventModal').classList.remove('show');
        
        if (optionIndex === 0) {
            // Commencer le tutoriel
            this.startTutorial();
        } else {
            // Commencer directement
            console.log('Jeu démarré directement !');
        }
    }
    
    /**
     * Démarre le tutoriel
     */
    startTutorial() {
        console.log('Tutoriel démarré !');
        // Ici on pourrait ajouter une série d'événements tutoriels
        this.showTutorialStep1();
    }
    
    /**
     * Première étape du tutoriel
     */
    showTutorialStep1() {
        const tutorialEvent = {
            id: 'tutorial_step1',
            title: '📚 Tutoriel - Étape 1',
            description: 'Voici votre tableau Kanban médical. Chaque colonne représente une étape du parcours patient. Observez les métriques en haut de l\'écran.',
            options: [
                {
                    text: 'Continuer',
                    effect: { type: 'tutorial_continue' },
                    cost: 'Apprentissage des bases',
                    kanbanPrinciple: 'Visualisation du flux'
                }
            ]
        };
        
        setTimeout(() => {
            this.showEventModal(tutorialEvent);
        }, 1000);
    }
    
    /**
     * NOUVEAU : Gère les événements de WIP limit atteinte
     */
    handleWipLimitEvent(eventDetail) {
        const { column, message, suggestions } = eventDetail;
        
        // Créer un événement de WIP limit
        const wipEvent = {
            id: this.generateEventId(),
            type: 'wip_limit',
            title: '🚧 Limite WIP atteinte',
            description: message,
            column: column,
            severity: 'medium',
            options: [
                {
                    text: 'Augmenter temporairement la WIP limit (+1)',
                    effect: { type: 'increase_wip', column: column, amount: 1 },
                    cost: 'Risque de surcharge',
                    kanbanPrinciple: 'Flexibilité des limites WIP'
                },
                {
                    text: 'Analyser le goulot d\'étranglement',
                    effect: { type: 'analyze_bottleneck', column: column },
                    cost: 'Temps d\'analyse',
                    kanbanPrinciple: 'Identification des contraintes'
                },
                {
                    text: 'Maintenir la limite actuelle',
                    effect: { type: 'maintain_limit' },
                    cost: 'Accumulation possible',
                    kanbanPrinciple: 'Respect des limites WIP'
                }
            ],
            timestamp: new Date(),
            resolved: false
        };
        
        // Afficher l'événement avec un délai pour éviter le spam
        setTimeout(() => {
            this.showEventModal(wipEvent);
            this.activeEvents.push(wipEvent);
        }, 1000);
    }

    /**
     * Applique l'effet d'une décision d'événement
     */
    applyEventEffect(effect, event) {
        switch (effect.type) {
            case 'increase_wip':
                this.increaseWipLimit(effect.column, effect.amount);
                break;
            case 'add_resource':
                this.addTemporaryResource(effect.column, effect.duration);
                break;
            case 'process_improvement':
                this.improveProcess(effect.column);
                break;
            case 'emergency_protocol':
                this.activateEmergencyProtocol(effect.capacity_boost);
                break;
            case 'reduce_wip_limits':
                this.reduceAllWipLimits(effect.factor);
                break;
            case 'tutorial_continue':
                this.continueTutorial();
                break;
            case 'start_tutorial':
                this.startTutorial();
                break;
            case 'start_game':
                console.log('Jeu démarré directement !');
                break;
            // Ajouter d'autres effets selon les besoins
        }
    }
    
    /**
     * Continue le tutoriel à l'étape suivante
     */
    continueTutorial() {
        console.log('Tutoriel - Étape suivante');
        // Ici on pourrait ajouter d'autres étapes du tutoriel
    }
    
    /**
     * Augmente temporairement une WIP limit
     */
    increaseWipLimit(column, amount) {
        const kanbanBoard = window.gameEngine?.systems?.kanbanBoard;
        if (!kanbanBoard || !kanbanBoard.columns[column]) return;
        
        // Sauvegarder la limite originale
        const originalLimit = kanbanBoard.columns[column].wipLimit;
        
        // Augmenter la limite
        kanbanBoard.columns[column].wipLimit += amount;
        kanbanBoard.updateColumnCounts();
        
        // NOUVEAU : Mettre à jour visuellement le header de la colonne
        this.updateColumnHeaderForWipIncrease(column, amount);
        
        // Notification de l'effet avec affichage central
        const message = `✅ WIP limit de ${column} augmentée temporairement (+${amount})`;
        window.gameEngine.showCentralNotification(message, 'low', 4000);
        
        // NOUVEAU : Afficher l'événement actif dans le header
        this.showActiveEvent(`WIP Limit +${amount}`, `${column} peut traiter ${amount} patient(s) supplémentaire(s)`);
        
        console.log(`Augmentation WIP limit ${column} de ${amount} (${originalLimit} → ${kanbanBoard.columns[column].wipLimit})`);
        
        // Programmer la restauration après la durée de l'événement (30% de la durée de jeu)
        const gameDuration = window.gameEngine?.gameState?.gameDuration || 300;
        const effectDuration = Math.round(gameDuration * 0.3 * 1000); // 30% en millisecondes
        
        setTimeout(() => {
            if (kanbanBoard.columns[column] && window.gameEngine.gameState.isRunning) {
                kanbanBoard.columns[column].wipLimit = originalLimit;
                kanbanBoard.updateColumnCounts();
                
                // NOUVEAU : Restaurer l'affichage normal du header
                this.restoreColumnHeaderDisplay(column);
                
                // NOUVEAU : Masquer l'événement actif
                this.hideActiveEvent();
                
                const restoreMessage = `⏰ WIP limit de ${column} restaurée (${originalLimit})`;
                window.gameEngine.showCentralNotification(restoreMessage, 'medium', 3000);
                
                console.log(`Restauration WIP limit ${column} à ${originalLimit}`);
            }
        }, effectDuration);
    }
    
    /**
     * Ajoute une ressource temporaire
     */
    addTemporaryResource(column, duration) {
        const kanbanBoard = window.gameEngine?.systems?.kanbanBoard;
        if (!kanbanBoard || !kanbanBoard.columns[column]) return;
        
        // Réduire les temps de traitement de 50%
        const originalProcessingTimes = { ...kanbanBoard.processingTimes[column] };
        kanbanBoard.processingTimes[column].min = Math.round(originalProcessingTimes.min * 0.5);
        kanbanBoard.processingTimes[column].max = Math.round(originalProcessingTimes.max * 0.5);
        
        // Notification de l'effet avec affichage central
        const message = `👨‍⚕️ Ressource temporaire ajoutée en ${column} (traitement 50% plus rapide)`;
        window.gameEngine.showCentralNotification(message, 'low', 4000);
        
        console.log(`Ajout ressource temporaire ${column} pour ${duration}ms`);
        
        // Calculer la durée proportionnelle à la durée de jeu
        const gameDuration = window.gameEngine?.gameState?.gameDuration || 300;
        const effectDuration = Math.round(gameDuration * 0.25 * 1000); // 25% de la durée de jeu
        
        setTimeout(() => {
            if (kanbanBoard.processingTimes[column] && window.gameEngine.gameState.isRunning) {
                kanbanBoard.processingTimes[column] = originalProcessingTimes;
                
                const restoreMessage = `⏰ Ressource temporaire retirée de ${column}`;
                window.gameEngine.showCentralNotification(restoreMessage, 'medium', 3000);
                
                console.log(`Fin ressource temporaire ${column}`);
            }
        }, effectDuration);
    }
    
    /**
     * Améliore un processus
     */
    improveProcess(column) {
        const kanbanBoard = window.gameEngine?.systems?.kanbanBoard;
        if (!kanbanBoard || !kanbanBoard.processingTimes[column]) return;
        
        // Réduction permanente des temps de traitement de 15%
        kanbanBoard.processingTimes[column].min = Math.round(kanbanBoard.processingTimes[column].min * 0.85);
        kanbanBoard.processingTimes[column].max = Math.round(kanbanBoard.processingTimes[column].max * 0.85);
        
        // Notification de l'effet avec affichage central
        const message = `🔧 Processus ${column} amélioré ! Traitement 15% plus rapide de façon permanente`;
        window.gameEngine.showCentralNotification(message, 'low', 5000);
        
        // Bonus de score pour l'amélioration
        window.gameEngine.gameState.score += 200;
        window.gameEngine.updateGameDisplay();
        
        console.log(`Amélioration processus ${column} - réduction permanente de 15%`);
    }
    
    /**
     * Active le protocole d'urgence
     */
    activateEmergencyProtocol(capacityBoost) {
        const kanbanBoard = window.gameEngine?.systems?.kanbanBoard;
        if (!kanbanBoard) return;
        
        // Augmenter toutes les WIP limits temporairement
        const originalLimits = {};
        Object.keys(kanbanBoard.columns).forEach(column => {
            if (column !== 'parking' && column !== 'emergency' && kanbanBoard.columns[column].wipLimit !== Infinity) {
                originalLimits[column] = kanbanBoard.columns[column].wipLimit;
                kanbanBoard.columns[column].wipLimit = Math.round(kanbanBoard.columns[column].wipLimit * (1 + capacityBoost));
            }
        });
        
        kanbanBoard.updateColumnCounts();
        
        // Notification de l'effet avec affichage central
        const message = `🚨 Protocole d'urgence activé ! Capacité augmentée de ${Math.round(capacityBoost * 100)}% temporairement`;
        window.gameEngine.showCentralNotification(message, 'critical', 6000);
        
        console.log(`Activation protocole d'urgence, boost: ${capacityBoost}`);
        
        // Calculer la durée proportionnelle à la durée de jeu
        const gameDuration = window.gameEngine?.gameState?.gameDuration || 300;
        const effectDuration = Math.round(gameDuration * 0.4 * 1000); // 40% de la durée de jeu
        
        // Restaurer après la durée calculée
        setTimeout(() => {
            if (window.gameEngine.gameState.isRunning) {
                Object.keys(originalLimits).forEach(column => {
                    if (kanbanBoard.columns[column]) {
                        kanbanBoard.columns[column].wipLimit = originalLimits[column];
                    }
                });
                kanbanBoard.updateColumnCounts();
                
                const restoreMessage = `⏰ Protocole d'urgence désactivé - capacité normale restaurée`;
                window.gameEngine.showCentralNotification(restoreMessage, 'medium', 4000);
            }
        }, effectDuration);
    }
    
    /**
     * Réduit toutes les WIP limits
     */
    reduceAllWipLimits(factor) {
        const kanbanBoard = window.gameEngine?.systems?.kanbanBoard;
        if (!kanbanBoard) return;
        
        // Sauvegarder les limites originales
        const originalLimits = {};
        Object.keys(kanbanBoard.columns).forEach(column => {
            if (column !== 'parking' && column !== 'emergency' && kanbanBoard.columns[column].wipLimit !== Infinity) {
                originalLimits[column] = kanbanBoard.columns[column].wipLimit;
                kanbanBoard.columns[column].wipLimit = Math.max(1, Math.round(kanbanBoard.columns[column].wipLimit * factor));
            }
        });
        
        kanbanBoard.updateColumnCounts();
        
        // Notification de l'effet avec affichage central
        const message = `📉 Personnel réduit ! WIP limits diminuées de ${Math.round((1 - factor) * 100)}% temporairement`;
        window.gameEngine.showCentralNotification(message, 'high', 5000);
        
        console.log(`Réduction WIP limits facteur: ${factor}`);
        
        // Restaurer après la durée de l'événement
        const gameDuration = window.gameEngine?.gameState?.gameDuration || 300;
        const effectDuration = Math.round(gameDuration * 0.4 * 1000); // 40% en millisecondes
        
        setTimeout(() => {
            if (window.gameEngine.gameState.isRunning) {
                Object.keys(originalLimits).forEach(column => {
                    if (kanbanBoard.columns[column]) {
                        kanbanBoard.columns[column].wipLimit = originalLimits[column];
                    }
                });
                kanbanBoard.updateColumnCounts();
                
                const restoreMessage = `⏰ Personnel de retour - WIP limits normales restaurées`;
                window.gameEngine.showCentralNotification(restoreMessage, 'medium', 4000);
            }
        }, effectDuration);
    }
    
    /**
     * Gère les événements de goulot d'étranglement
     */
    handleBottleneckEvent(detail) {
        // Créer un événement spécifique au goulot détecté
        const event = {
            id: this.generateEventId(),
            type: 'bottleneck_detected',
            title: '🚧 Goulot d\'étranglement',
            description: detail.message,
            column: detail.column,
            suggestions: detail.suggestions,
            severity: 'medium',
            timestamp: new Date(),
            autoGenerated: true
        };
        
        // Afficher une notification plutôt qu'une modal complète
        this.showNotification(event);
    }
    
    /**
     * Affiche une notification légère
     */
    showNotification(event) {
        // Créer une notification toast
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${event.title}</span>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-body">${event.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Suppression manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    /**
     * NOUVEAU : Met à jour visuellement le header d'une colonne lors d'augmentation WIP
     */
    updateColumnHeaderForWipIncrease(column, amount) {
        const columnHeader = document.querySelector(`[data-column="${column}"] .column-header`);
        if (columnHeader) {
            // Ajouter une classe CSS pour indiquer l'augmentation temporaire
            columnHeader.classList.add('wip-increased');
            
            // Ajouter un indicateur visuel
            const indicator = document.createElement('span');
            indicator.className = 'wip-increase-indicator';
            indicator.textContent = `+${amount}`;
            indicator.style.cssText = `
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 0.7rem;
                margin-left: 8px;
                animation: wipIncreaseGlow 2s ease-in-out infinite;
            `;
            
            columnHeader.appendChild(indicator);
        }
    }
    
    /**
     * NOUVEAU : Restaure l'affichage normal du header d'une colonne
     */
    restoreColumnHeaderDisplay(column) {
        const columnHeader = document.querySelector(`[data-column="${column}"] .column-header`);
        if (columnHeader) {
            // Retirer la classe CSS
            columnHeader.classList.remove('wip-increased');
            
            // Supprimer l'indicateur visuel
            const indicator = columnHeader.querySelector('.wip-increase-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }

    /**
     * NOUVEAU : Affiche un événement actif dans le header
     */
    showActiveEvent(title, effect) {
        const activeEventsBar = document.getElementById('activeEventsBar');
        const activeEventTitle = document.getElementById('activeEventTitle');
        const activeEventEffect = document.getElementById('activeEventEffect');
        
        if (activeEventsBar && activeEventTitle && activeEventEffect) {
            activeEventTitle.textContent = title;
            activeEventEffect.textContent = effect;
            activeEventsBar.style.display = 'block';
        }
    }

    /**
     * NOUVEAU : Masque l'événement actif du header
     */
    hideActiveEvent() {
        const activeEventsBar = document.getElementById('activeEventsBar');
        if (activeEventsBar) {
            activeEventsBar.style.display = 'none';
        }
    }

    /**
     * NOUVEAU : Retourne l'icône selon le type d'impact
     */
    getImpactIcon(effectType) {
        const icons = {
            'increase_wip': '📈',
            'add_resource': '👨‍⚕️',
            'process_improvement': '🔧',
            'emergency_protocol': '🚨',
            'reduce_wip_limits': '📉',
            'analyze_bottleneck': '🔍',
            'maintain_limit': '⚖️',
            'no_action': '👀'
        };
        return icons[effectType] || '⚡';
    }

    /**
     * NOUVEAU : Retourne la classe CSS selon le type d'impact
     */
    getImpactClass(effectType) {
        const classes = {
            'increase_wip': 'option-positive',
            'add_resource': 'option-positive',
            'process_improvement': 'option-very-positive',
            'emergency_protocol': 'option-critical',
            'reduce_wip_limits': 'option-negative',
            'analyze_bottleneck': 'option-neutral',
            'maintain_limit': 'option-neutral',
            'no_action': 'option-neutral'
        };
        return classes[effectType] || 'option-neutral';
    }

    /**
     * Génère un ID unique pour les événements
     */
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Retourne les statistiques des événements
     */
    getEventStats() {
        return {
            totalEvents: this.eventHistory.length,
            activeEvents: this.activeEvents.length,
            resolutionRate: this.eventHistory.length / (this.eventHistory.length + this.activeEvents.length),
            eventsByType: this.getEventsByType(),
            averageResolutionTime: this.getAverageResolutionTime()
        };
    }
    
    /**
     * Groupe les événements par type
     */
    getEventsByType() {
        const byType = {};
        this.eventHistory.forEach(event => {
            byType[event.type] = (byType[event.type] || 0) + 1;
        });
        return byType;
    }
    
    /**
     * Calcule le temps moyen de résolution
     */
    getAverageResolutionTime() {
        const resolvedEvents = this.eventHistory.filter(e => e.resolvedAt);
        if (resolvedEvents.length === 0) return 0;
        
        const totalTime = resolvedEvents.reduce((sum, event) => {
            return sum + (event.resolvedAt - event.timestamp);
        }, 0);
        
        return Math.round(totalTime / resolvedEvents.length / 1000); // en secondes
    }
}

// Export pour utilisation dans d'autres modules
window.EventSystem = EventSystem;