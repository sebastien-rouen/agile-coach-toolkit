/**
 * Générateur de patients pour Hospital Flow Master
 * Simule l'arrivée de patients avec différentes priorités et pathologies
 */

class PatientGenerator {
    constructor() {
        this.patientCounter = 1;
        this.isRunning = false;
        this.generationInterval = null;
        this.baseArrivalRate = 3000; // 3 secondes entre chaque patient
        this.currentSpeed = 1;
        this.isFirstPatients = true; // Flag pour les premiers patients
        
        // Données réalistes pour la simulation
        this.firstNames = [
            'Marie', 'Jean', 'Sophie', 'Pierre', 'Claire', 'Michel', 'Anne', 'Paul',
            'Isabelle', 'François', 'Catherine', 'Bernard', 'Sylvie', 'Alain', 'Martine',
            'Philippe', 'Nathalie', 'Daniel', 'Christine', 'Laurent', 'Françoise', 'Thierry'
        ];
        
        this.lastNames = [
            'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
            'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel',
            'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel'
        ];
        
        // Pathologies avec probabilités et classes de service
        this.conditions = [
            // Standard (84% - augmenté pour compenser)
            { name: 'Contrôle diabète', priority: 'standard', duration: { min: 30, max: 60 }, probability: 0.18 },
            { name: 'Hypertension', priority: 'standard', duration: { min: 20, max: 45 }, probability: 0.15 },
            { name: 'Consultation générale', priority: 'standard', duration: { min: 25, max: 50 }, probability: 0.12 },
            { name: 'Suivi cardiologique', priority: 'standard', duration: { min: 35, max: 70 }, probability: 0.10 },
            { name: 'Douleurs abdominales', priority: 'standard', duration: { min: 40, max: 80 }, probability: 0.08 },
            { name: 'Fatigue chronique', priority: 'standard', duration: { min: 30, max: 60 }, probability: 0.07 },
            { name: 'Maux de tête', priority: 'standard', duration: { min: 20, max: 40 }, probability: 0.06 },
            { name: 'Troubles du sommeil', priority: 'standard', duration: { min: 25, max: 50 }, probability: 0.05 },
            { name: 'Arthrose', priority: 'standard', duration: { min: 30, max: 55 }, probability: 0.03 },
            
            // Urgent (10% - réduit de moitié)
            { name: 'Douleur thoracique', priority: 'urgent', duration: { min: 15, max: 30 }, probability: 0.03 },
            { name: 'Difficultés respiratoires', priority: 'urgent', duration: { min: 20, max: 40 }, probability: 0.025 },
            { name: 'Malaise vagal', priority: 'urgent', duration: { min: 10, max: 25 }, probability: 0.02 },
            { name: 'Fièvre élevée', priority: 'urgent', duration: { min: 25, max: 45 }, probability: 0.015 },
            { name: 'Chute avec traumatisme', priority: 'urgent', duration: { min: 30, max: 60 }, probability: 0.01 },
            
            // Expedite (3% - réduit de plus de moitié)
            { name: 'AVC suspecté', priority: 'expedite', duration: { min: 5, max: 15 }, probability: 0.008 },
            { name: 'Infarctus suspecté', priority: 'expedite', duration: { min: 5, max: 15 }, probability: 0.008 },
            { name: 'Détresse respiratoire', priority: 'expedite', duration: { min: 10, max: 20 }, probability: 0.006 },
            { name: 'Coma', priority: 'expedite', duration: { min: 5, max: 10 }, probability: 0.004 },
            { name: 'Hémorragie active', priority: 'expedite', duration: { min: 5, max: 15 }, probability: 0.004 },
            
            // Fixed Date (3%) - Avec détails spécifiques
            { name: 'Chirurgie programmée - Appendicectomie', priority: 'fixed-date', duration: { min: 45, max: 90 }, probability: 0.005, scheduledTime: '14:00' },
            { name: 'Chirurgie programmée - Hernie inguinale', priority: 'fixed-date', duration: { min: 60, max: 120 }, probability: 0.003, scheduledTime: '09:00' },
            { name: 'Chirurgie programmée - Arthroscopie genou', priority: 'fixed-date', duration: { min: 30, max: 60 }, probability: 0.002, scheduledTime: '16:00' },
            { name: 'Examen pré-opératoire - Bilan cardiaque', priority: 'fixed-date', duration: { min: 30, max: 45 }, probability: 0.003, scheduledTime: '10:30' },
            { name: 'Examen pré-opératoire - Anesthésie', priority: 'fixed-date', duration: { min: 20, max: 30 }, probability: 0.002, scheduledTime: '15:30' },
            { name: 'Bilan annuel - Diabète type 2', priority: 'fixed-date', duration: { min: 40, max: 60 }, probability: 0.002, scheduledTime: '11:00' },
            { name: 'Bilan annuel - Hypertension', priority: 'fixed-date', duration: { min: 35, max: 50 }, probability: 0.002, scheduledTime: '13:30' },
            { name: 'Consultation spécialisée - Cardiologie', priority: 'fixed-date', duration: { min: 45, max: 75 }, probability: 0.001, scheduledTime: '08:30' }
        ];
    }
    
    /**
     * Génère un nouveau patient avec des données réalistes
     */
    generatePatient() {
        const firstName = this.getRandomElement(this.firstNames);
        const lastName = this.getRandomElement(this.lastNames);
        const age = this.generateAge();
        const condition = this.selectConditionByProbability();
        const arrivalTime = new Date();
        
        const patient = {
            id: `P${String(this.patientCounter).padStart(4, '0')}`,
            name: `${firstName} ${lastName}`,
            age: age,
            condition: condition.name,
            priority: condition.priority,
            estimatedDuration: this.randomBetween(condition.duration.min, condition.duration.max),
            arrivalTime: arrivalTime,
            currentColumn: 'triage',
            startTime: null,
            endTime: null,
            leadTime: 0,
            cycleTime: 0,
            waitingTime: 0,
            processingSteps: [],
            satisfaction: this.calculateInitialSatisfaction(condition.priority),
            scheduledTime: condition.scheduledTime || null // Heure programmée si applicable
        };
        
        this.patientCounter++;
        return patient;
    }
    
    /**
     * Sélectionne une condition basée sur les probabilités réalistes
     */
    selectConditionByProbability() {
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const condition of this.conditions) {
            cumulativeProbability += condition.probability;
            if (random <= cumulativeProbability) {
                return condition;
            }
        }
        
        // Fallback sur consultation générale
        return this.conditions.find(c => c.name === 'Consultation générale');
    }
    
    /**
     * Génère un âge réaliste selon la distribution hospitalière
     */
    generateAge() {
        const random = Math.random();
        
        // Distribution réaliste des âges en médecine interne
        if (random < 0.05) return this.randomBetween(18, 30);      // 5% jeunes adultes
        if (random < 0.15) return this.randomBetween(31, 45);      // 10% adultes
        if (random < 0.35) return this.randomBetween(46, 65);      // 20% adultes matures
        if (random < 0.70) return this.randomBetween(66, 80);      // 35% seniors
        return this.randomBetween(81, 95);                         // 30% personnes âgées
    }
    
    /**
     * Calcule la satisfaction initiale selon la priorité
     */
    calculateInitialSatisfaction(priority) {
        const baseSatisfaction = {
            'standard': 85,
            'urgent': 70,
            'expedite': 60,
            'fixed-date': 90
        };
        
        const variation = this.randomBetween(-10, 10);
        return Math.max(0, Math.min(100, baseSatisfaction[priority] + variation));
    }
    
    /**
     * Démarre la génération automatique de patients
     */
    start() {
        if (this.isRunning) return;
        
        console.log('Démarrage du générateur de patients...');
        this.isRunning = true;
        this.isFirstPatients = true; // Réinitialiser pour les premiers patients rapides
        this.scheduleNextPatient();
    }
    
    /**
     * Arrête la génération de patients
     */
    stop() {
        this.isRunning = false;
        if (this.generationInterval) {
            clearTimeout(this.generationInterval);
            this.generationInterval = null;
        }
    }
    
    /**
     * Modifie la vitesse de génération
     */
    setSpeed(speed) {
        this.currentSpeed = speed;
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }
    
    /**
     * Programme l'arrivée du prochain patient
     */
    scheduleNextPatient() {
        if (!this.isRunning) return;
        
        const arrivalDelay = this.calculateArrivalDelay();
        
        this.generationInterval = setTimeout(() => {
            if (this.isRunning) {
                const patient = this.generatePatient();
                
                // Déclencher l'événement d'arrivée patient avec animation
                const event = new CustomEvent('patientArrival', {
                    detail: { patient, animated: true }
                });
                document.dispatchEvent(event);
                
                this.scheduleNextPatient();
            }
        }, arrivalDelay);
    }
    
    /**
     * Calcule le délai avant le prochain patient (avec variation réaliste)
     */
    calculateArrivalDelay() {
        // Pour les 3 premiers patients, arrivée très rapide (1-2 secondes)
        if (this.patientCounter <= 3 && this.isFirstPatients) {
            return this.randomBetween(1000, 2000); // 1-2 secondes
        }
        
        // Après les 3 premiers, délai normal
        if (this.patientCounter === 4) {
            this.isFirstPatients = false;
        }
        
        const baseDelay = this.baseArrivalRate / this.currentSpeed;
        
        // Variation réaliste : ±50% du délai de base
        const variation = this.randomBetween(0.5, 1.5);
        
        // Simulation des pics d'affluence (matin et après-midi)
        const hour = new Date().getHours();
        let rushMultiplier = 1;
        
        if ((hour >= 8 && hour <= 11) || (hour >= 14 && hour <= 17)) {
            rushMultiplier = 0.7; // Plus d'arrivées pendant les heures de pointe
        } else if (hour >= 22 || hour <= 6) {
            rushMultiplier = 2; // Moins d'arrivées la nuit
        }
        
        return Math.round(baseDelay * variation * rushMultiplier);
    }
    
    /**
     * Utilitaires
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Génère un événement spécial (afflux massif, urgence multiple, etc.)
     */
    generateSpecialEvent() {
        const events = [
            {
                type: 'mass_casualty',
                name: 'Accident de la route',
                description: 'Un accident impliquant plusieurs véhicules génère un afflux de patients urgents',
                patientCount: this.randomBetween(3, 6),
                priority: 'urgent'
            },
            {
                type: 'epidemic_outbreak',
                name: 'Pic épidémique',
                description: 'Une épidémie saisonnière augmente temporairement les arrivées',
                patientCount: this.randomBetween(5, 10),
                priority: 'standard'
            },
            {
                type: 'staff_shortage',
                name: 'Personnel réduit',
                description: 'Plusieurs soignants sont absents, réduisant la capacité de traitement',
                effect: 'reduce_capacity'
            }
        ];
        
        return this.getRandomElement(events);
    }
}

// Export pour utilisation dans d'autres modules
window.PatientGenerator = PatientGenerator;