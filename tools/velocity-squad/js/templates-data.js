/**
 * ========================================
 * TEMPLATES MÉTIERS - DONNÉES
 * ========================================
 * Définition des templates Scrum et Kanban
 * pour différents domaines métiers
 */

const TEMPLATES_DATA = {
    // ========================================
    // TEMPLATES SCRUM
    // ========================================
    'scrum-it-ecommerce': {
        name: "🛒 IT - E-commerce (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 21, startDate: "2025-09-15", endDate: "2025-09-28", goal: "Mise en place du catalogue produits et panier" },
            { name: "Sprint 2", velocity: 24, startDate: "2025-09-29", endDate: "2025-10-12", goal: "Système de paiement et gestion commandes" },
            { name: "Sprint 3", velocity: 26, startDate: "2025-10-13", endDate: "2025-10-26", goal: "Espace client et historique achats" },
            { name: "Sprint 4", velocity: 28, startDate: "2025-10-27", endDate: "2025-11-09", goal: "Système de recommandations et wishlist" }
        ],
        team: [
            { id: 1, name: "Sophie", role: "Product Owner", capacity: 80, skills: ["Product Management", "UX", "E-commerce"] },
            { id: 2, name: "Marc", role: "Tech Lead", capacity: 90, skills: ["Node.js", "React", "Architecture"] },
            { id: 3, name: "Julie", role: "Frontend Dev", capacity: 100, skills: ["React", "CSS", "TypeScript"] },
            { id: 4, name: "Thomas", role: "Backend Dev", capacity: 100, skills: ["Node.js", "PostgreSQL", "API"] },
            { id: 5, name: "Emma", role: "QA", capacity: 100, skills: ["Testing", "Automation", "Cypress"] }
        ],
        events: [
            { type: "daily", title: "Daily Standup", date: "2025-09-15", time: "09:00", duration: 15, recurring: true },
            { type: "sprint_planning", title: "Sprint 1 Planning", date: "2025-09-15", time: "10:00", duration: 120, description: "Planification Sprint 1" },
            { type: "backlog_refinement", title: "Refinement Catalogue", date: "2025-09-18", time: "14:00", duration: 60 },
            { type: "sprint_review", title: "Sprint 1 Review", date: "2025-09-28", time: "14:00", duration: 60 },
            { type: "sprint_retrospective", title: "Sprint 1 Retro", date: "2025-09-28", time: "15:30", duration: 90 }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "release", text: "Lancement MVP catalogue" },
            { sprintIndex: 0, type: "team", text: "Arrivée de Julie dans l'équipe" },
            { sprintIndex: 1, type: "process", text: "Intégration Stripe payment" },
            { sprintIndex: 1, type: "incident", text: "Bug critique panier - résolu en 4h" },
            { sprintIndex: 2, type: "training", text: "Formation équipe sur Redis" },
            { sprintIndex: 2, type: "vacation", text: "Marc en congés 3 jours" },
            { sprintIndex: 3, type: "release", text: "Système de recommandations en prod" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-devops': {
        name: "⚙️ DevOps (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 18, startDate: "2025-09-15", endDate: "2025-09-28", goal: "Migration infrastructure vers Kubernetes" },
            { name: "Sprint 2", velocity: 22, startDate: "2025-09-29", endDate: "2025-10-12", goal: "Mise en place CI/CD avec GitLab" },
            { name: "Sprint 3", velocity: 20, startDate: "2025-10-13", endDate: "2025-10-26", goal: "Monitoring et alerting avec Prometheus" },
            { name: "Sprint 4", velocity: 24, startDate: "2025-10-27", endDate: "2025-11-09", goal: "Automatisation déploiements et rollback" }
        ],
        team: [
            { id: 1, name: "Alex", role: "DevOps Lead", capacity: 90, skills: ["Kubernetes", "Docker", "Terraform"] },
            { id: 2, name: "Sarah", role: "SRE", capacity: 100, skills: ["Monitoring", "Python", "AWS"] },
            { id: 3, name: "David", role: "DevOps Engineer", capacity: 100, skills: ["CI/CD", "GitLab", "Ansible"] },
            { id: 4, name: "Lisa", role: "Cloud Architect", capacity: 80, skills: ["AWS", "Azure", "Architecture"] }
        ],
        events: [
            { type: "daily", title: "Daily Standup", date: "2025-09-15", time: "09:30", duration: 15, recurring: true },
            { type: "sprint_planning", title: "Sprint 1 Planning", date: "2025-09-15", time: "10:00", duration: 120 },
            { type: "backlog_refinement", title: "Refinement Infrastructure", date: "2025-09-19", time: "14:00", duration: 90 },
            { type: "sprint_review", title: "Sprint 1 Review", date: "2025-09-28", time: "15:00", duration: 60 },
            { type: "sprint_retrospective", title: "Sprint 1 Retro", date: "2025-09-28", time: "16:30", duration: 90 }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "incident", text: "Migration K8s - downtime 2h" },
            { sprintIndex: 0, type: "team", text: "Lisa rejoint l'équipe" },
            { sprintIndex: 1, type: "process", text: "Pipeline CI/CD opérationnel" },
            { sprintIndex: 1, type: "release", text: "Déploiement automatisé actif" },
            { sprintIndex: 2, type: "training", text: "Formation Prometheus/Grafana" },
            { sprintIndex: 2, type: "vacation", text: "Alex en congés 1 semaine" },
            { sprintIndex: 3, type: "release", text: "Monitoring complet en production" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-data': {
        name: "📊 Data (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 16, startDate: "2025-09-15", endDate: "2025-09-28", goal: "Pipeline ETL pour données clients" },
            { name: "Sprint 2", velocity: 19, startDate: "2025-09-29", endDate: "2025-10-12", goal: "Dashboard analytics temps réel" },
            { name: "Sprint 3", velocity: 21, startDate: "2025-10-13", endDate: "2025-10-26", goal: "Modèles ML de prédiction" },
            { name: "Sprint 4", velocity: 23, startDate: "2025-10-27", endDate: "2025-11-09", goal: "API de recommandations" }
        ],
        team: [
            { id: 1, name: "Pierre", role: "Data Engineer", capacity: 100, skills: ["Python", "Spark", "Airflow"] },
            { id: 2, name: "Marie", role: "Data Scientist", capacity: 100, skills: ["ML", "Python", "TensorFlow"] },
            { id: 3, name: "Lucas", role: "Analytics Engineer", capacity: 90, skills: ["SQL", "dbt", "Looker"] },
            { id: 4, name: "Camille", role: "Data Analyst", capacity: 100, skills: ["SQL", "Python", "Tableau"] }
        ],
        events: [
            { type: "daily", title: "Daily Standup", date: "2025-09-15", time: "09:00", duration: 15, recurring: true },
            { type: "sprint_planning", title: "Sprint 1 Planning", date: "2025-09-15", time: "10:00", duration: 120 },
            { type: "backlog_refinement", title: "Refinement Data Pipeline", date: "2025-09-17", time: "14:00", duration: 60 },
            { type: "sprint_review", title: "Sprint 1 Review", date: "2025-09-28", time: "14:00", duration: 60 },
            { type: "sprint_retrospective", title: "Sprint 1 Retro", date: "2025-09-28", time: "15:30", duration: 90 }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Pipeline ETL en production" },
            { sprintIndex: 0, type: "incident", text: "Problème qualité données résolu" },
            { sprintIndex: 1, type: "release", text: "Dashboard v1 déployé" },
            { sprintIndex: 1, type: "team", text: "Camille promue Senior Analyst" },
            { sprintIndex: 2, type: "training", text: "Formation MLOps" },
            { sprintIndex: 2, type: "vacation", text: "Pierre en congés 5 jours" },
            { sprintIndex: 3, type: "release", text: "API recommandations en beta" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-rh': {
        name: "👥 RH (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 13, startDate: "2025-06-02", endDate: "2025-06-15", goal: "Portail RH - Gestion congés" },
            { name: "Sprint 2", velocity: 15, startDate: "2025-06-16", endDate: "2025-06-29", goal: "Module recrutement et candidatures" },
            { name: "Sprint 3", velocity: 17, startDate: "2025-06-30", endDate: "2025-07-13", goal: "Évaluations et entretiens annuels" },
            { name: "Sprint 4", velocity: 16, startDate: "2025-07-14", endDate: "2025-07-27", goal: "Formation et développement compétences" }
        ],
        team: [
            { id: 1, name: "Claire", role: "Product Owner RH", capacity: 70, skills: ["RH", "Product", "Process"] },
            { id: 2, name: "Antoine", role: "Fullstack Dev", capacity: 100, skills: ["Vue.js", "Node.js", "PostgreSQL"] },
            { id: 3, name: "Léa", role: "UX Designer", capacity: 100, skills: ["UX/UI", "Figma", "User Research"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "release", text: "Module congés en production" },
            { sprintIndex: 0, type: "training", text: "Formation RGPD pour l'équipe" },
            { sprintIndex: 1, type: "process", text: "Intégration avec ATS externe" },
            { sprintIndex: 1, type: "incident", text: "Bug calcul solde congés corrigé" },
            { sprintIndex: 2, type: "vacation", text: "Claire en congés 1 semaine" },
            { sprintIndex: 2, type: "release", text: "Module évaluations déployé" },
            { sprintIndex: 3, type: "team", text: "Nouveau designer UX recruté" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-mairie': {
        name: "🏛️ Mairie (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 14, startDate: "2025-06-02", endDate: "2025-06-22", goal: "Portail citoyen - Démarches en ligne" },
            { name: "Sprint 2", velocity: 16, startDate: "2025-06-23", endDate: "2025-07-13", goal: "Système de prise de rendez-vous" },
            { name: "Sprint 3", velocity: 18, startDate: "2025-07-14", endDate: "2025-08-03", goal: "Gestion des demandes et suivi" },
            { name: "Sprint 4", velocity: 17, startDate: "2025-08-04", endDate: "2025-08-24", goal: "Espace associations et réservations" }
        ],
        team: [
            { id: 1, name: "François", role: "Chef de projet", capacity: 80, skills: ["Gestion projet", "Public", "RGPD"] },
            { id: 2, name: "Isabelle", role: "Développeur", capacity: 100, skills: ["PHP", "Symfony", "MySQL"] },
            { id: 3, name: "Jean", role: "Développeur", capacity: 100, skills: ["JavaScript", "Vue.js", "API"] },
            { id: 4, name: "Nathalie", role: "Testeur", capacity: 90, skills: ["Testing", "Accessibilité", "RGAA"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Validation RGPD et sécurité" },
            { sprintIndex: 0, type: "training", text: "Formation accessibilité RGAA" },
            { sprintIndex: 1, type: "release", text: "Démarches en ligne actives" },
            { sprintIndex: 1, type: "incident", text: "Problème certificat SSL résolu" },
            { sprintIndex: 2, type: "vacation", text: "Congés d'été - équipe réduite" },
            { sprintIndex: 2, type: "team", text: "Jean passe Tech Lead" },
            { sprintIndex: 3, type: "release", text: "Espace associations lancé" }
        ],
        settings: { framework: 'scrum', sprintLength: 21, workingDays: 15 }
    },

    'scrum-medical': {
        name: "🏥 Médical (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 20, startDate: "2025-06-02", endDate: "2025-06-15", goal: "Dossier patient électronique - Base" },
            { name: "Sprint 2", velocity: 22, startDate: "2025-06-16", endDate: "2025-06-29", goal: "Gestion des prescriptions" },
            { name: "Sprint 3", velocity: 24, startDate: "2025-06-30", endDate: "2025-07-13", goal: "Planning et rendez-vous médicaux" },
            { name: "Sprint 4", velocity: 23, startDate: "2025-07-14", endDate: "2025-07-27", goal: "Téléconsultation et suivi" }
        ],
        team: [
            { id: 1, name: "Dr. Martin", role: "Product Owner", capacity: 60, skills: ["Médecine", "Product", "Santé"] },
            { id: 2, name: "Julien", role: "Tech Lead", capacity: 90, skills: ["Java", "Spring", "Sécurité"] },
            { id: 3, name: "Céline", role: "Backend Dev", capacity: 100, skills: ["Java", "PostgreSQL", "HL7"] },
            { id: 4, name: "Maxime", role: "Frontend Dev", capacity: 100, skills: ["React", "TypeScript", "Accessibilité"] },
            { id: 5, name: "Sophie", role: "QA Santé", capacity: 100, skills: ["Testing", "Conformité", "Sécurité"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Certification HDS obtenue" },
            { sprintIndex: 0, type: "incident", text: "Bug critique dossier patient résolu" },
            { sprintIndex: 1, type: "training", text: "Formation RGPD santé" },
            { sprintIndex: 1, type: "vacation", text: "Dr. Martin en congrès médical" },
            { sprintIndex: 2, type: "release", text: "Module prescriptions validé" },
            { sprintIndex: 2, type: "team", text: "Sophie certifiée sécurité santé" },
            { sprintIndex: 3, type: "release", text: "Téléconsultation en production" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-permis': {
        name: "🚗 Permis de conduire (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 15, startDate: "2025-06-02", endDate: "2025-06-15", goal: "Plateforme d'apprentissage - Code" },
            { name: "Sprint 2", velocity: 18, startDate: "2025-06-16", endDate: "2025-06-29", goal: "Tests blancs et suivi progression" },
            { name: "Sprint 3", velocity: 20, startDate: "2025-06-30", endDate: "2025-07-13", goal: "Réservation leçons de conduite" },
            { name: "Sprint 4", velocity: 19, startDate: "2025-07-14", endDate: "2025-07-27", goal: "Application mobile et notifications" }
        ],
        team: [
            { id: 1, name: "Olivier", role: "Product Owner", capacity: 80, skills: ["Product", "EdTech", "Auto-école"] },
            { id: 2, name: "Laura", role: "Fullstack Dev", capacity: 100, skills: ["React", "Node.js", "MongoDB"] },
            { id: 3, name: "Kevin", role: "Mobile Dev", capacity: 100, skills: ["React Native", "iOS", "Android"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "release", text: "Module code de la route lancé" },
            { sprintIndex: 0, type: "team", text: "Kevin rejoint l'équipe mobile" },
            { sprintIndex: 1, type: "process", text: "Intégration API auto-écoles" },
            { sprintIndex: 1, type: "incident", text: "Bug tests blancs corrigé" },
            { sprintIndex: 2, type: "training", text: "Formation React Native" },
            { sprintIndex: 2, type: "vacation", text: "Olivier en congés 1 semaine" },
            { sprintIndex: 3, type: "release", text: "Application mobile iOS/Android" }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    // ========================================
    // TEMPLATES KANBAN
    // ========================================
    'kanban-it-ecommerce': {
        name: "🛒 IT - E-commerce (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 18, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Maintenance et corrections bugs" },
            { name: "Semaine 2", velocity: 20, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Optimisations performances" },
            { name: "Semaine 3", velocity: 19, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Nouvelles fonctionnalités mineures" },
            { name: "Semaine 4", velocity: 21, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Support et améliorations UX" }
        ],
        team: [
            { id: 1, name: "Paul", role: "Lead Dev", capacity: 90, skills: ["React", "Node.js", "E-commerce"] },
            { id: 2, name: "Alice", role: "Fullstack Dev", capacity: 100, skills: ["JavaScript", "PostgreSQL", "API"] },
            { id: 3, name: "Tom", role: "Frontend Dev", capacity: 100, skills: ["React", "CSS", "UX"] },
            { id: 4, name: "Nina", role: "Support Dev", capacity: 100, skills: ["Debugging", "SQL", "Support"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "incident", text: "Bug critique paiement résolu" },
            { sprintIndex: 1, type: "process", text: "Optimisation temps de chargement" },
            { sprintIndex: 2, type: "release", text: "Nouvelle fonctionnalité wishlist" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-devops': {
        name: "⚙️ DevOps (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 15, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Support infrastructure et incidents" },
            { name: "Semaine 2", velocity: 17, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Automatisation et scripts" },
            { name: "Semaine 3", velocity: 16, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Monitoring et alerting" },
            { name: "Semaine 4", velocity: 18, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Optimisations et documentation" }
        ],
        team: [
            { id: 1, name: "Vincent", role: "DevOps", capacity: 100, skills: ["Docker", "K8s", "Terraform"] },
            { id: 2, name: "Amélie", role: "SRE", capacity: 90, skills: ["Monitoring", "Python", "AWS"] },
            { id: 3, name: "Hugo", role: "Support Ops", capacity: 100, skills: ["Linux", "Scripting", "Support"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "incident", text: "Incident production - résolu en 1h" },
            { sprintIndex: 1, type: "process", text: "Nouveau script de backup" },
            { sprintIndex: 2, type: "training", text: "Formation Kubernetes avancé" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-data': {
        name: "📊 Data (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 14, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Rapports et analyses ad-hoc" },
            { name: "Semaine 2", velocity: 16, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Maintenance pipelines ETL" },
            { name: "Semaine 3", velocity: 15, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Nouveaux dashboards" },
            { name: "Semaine 4", velocity: 17, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Optimisation requêtes" }
        ],
        team: [
            { id: 1, name: "Éric", role: "Data Analyst", capacity: 100, skills: ["SQL", "Python", "Tableau"] },
            { id: 2, name: "Chloé", role: "Analytics Engineer", capacity: 100, skills: ["SQL", "dbt", "Looker"] },
            { id: 3, name: "Romain", role: "Data Engineer", capacity: 90, skills: ["Python", "Airflow", "Spark"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Nouveau dashboard marketing" },
            { sprintIndex: 1, type: "incident", text: "Pipeline ETL corrigé" },
            { sprintIndex: 2, type: "release", text: "Rapport mensuel automatisé" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-rh': {
        name: "👥 RH (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 10, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Gestion quotidienne RH" },
            { name: "Semaine 2", velocity: 12, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Support et corrections" },
            { name: "Semaine 3", velocity: 11, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Améliorations processus" },
            { name: "Semaine 4", velocity: 13, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Nouvelles fonctionnalités" }
        ],
        team: [
            { id: 1, name: "Valérie", role: "RH Digital", capacity: 80, skills: ["RH", "Process", "SIRH"] },
            { id: 2, name: "Benjamin", role: "Dev RH", capacity: 100, skills: ["PHP", "Laravel", "MySQL"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Nouveau workflow congés" },
            { sprintIndex: 1, type: "release", text: "Module formation déployé" },
            { sprintIndex: 2, type: "vacation", text: "Valérie en congés" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-mairie': {
        name: "🏛️ Mairie (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 12, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Traitement demandes citoyennes" },
            { name: "Semaine 2", velocity: 14, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Support et assistance" },
            { name: "Semaine 3", velocity: 13, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Améliorations portail" },
            { name: "Semaine 4", velocity: 15, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Nouvelles démarches en ligne" }
        ],
        team: [
            { id: 1, name: "Martine", role: "Responsable SI", capacity: 70, skills: ["Gestion projet", "Public", "SI"] },
            { id: 2, name: "Christophe", role: "Développeur", capacity: 100, skills: ["PHP", "Symfony", "PostgreSQL"] },
            { id: 3, name: "Sandrine", role: "Support", capacity: 100, skills: ["Support", "Formation", "Documentation"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Nouvelle démarche état civil" },
            { sprintIndex: 1, type: "incident", text: "Problème certificat SSL résolu" },
            { sprintIndex: 2, type: "release", text: "Module réservation salles" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-medical': {
        name: "🏥 Médical (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 16, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Support et maintenance système" },
            { name: "Semaine 2", velocity: 18, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Corrections et optimisations" },
            { name: "Semaine 3", velocity: 17, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Améliorations UX" },
            { name: "Semaine 4", velocity: 19, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Nouvelles fonctionnalités" }
        ],
        team: [
            { id: 1, name: "Dr. Dubois", role: "Référent Médical", capacity: 50, skills: ["Médecine", "Santé", "Process"] },
            { id: 2, name: "Stéphane", role: "Dev Santé", capacity: 100, skills: ["Java", "Spring", "HL7"] },
            { id: 3, name: "Caroline", role: "Support Santé", capacity: 100, skills: ["Support", "Formation", "Santé"] },
            { id: 4, name: "Mathieu", role: "QA Santé", capacity: 90, skills: ["Testing", "Sécurité", "Conformité"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "incident", text: "Bug dossier patient corrigé" },
            { sprintIndex: 1, type: "process", text: "Amélioration sécurité données" },
            { sprintIndex: 2, type: "training", text: "Formation nouveau module" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    },

    'kanban-permis': {
        name: "🚗 Permis de conduire (Kanban)",
        framework: 'kanban',
        sprints: [
            { name: "Semaine 1", velocity: 11, startDate: "2025-06-02", endDate: "2025-06-08", goal: "Support utilisateurs" },
            { name: "Semaine 2", velocity: 13, startDate: "2025-06-09", endDate: "2025-06-15", goal: "Corrections et améliorations" },
            { name: "Semaine 3", velocity: 12, startDate: "2025-06-16", endDate: "2025-06-22", goal: "Nouveaux contenus pédagogiques" },
            { name: "Semaine 4", velocity: 14, startDate: "2025-06-23", endDate: "2025-06-29", goal: "Optimisations mobile" }
        ],
        team: [
            { id: 1, name: "Sylvie", role: "Responsable Pédagogique", capacity: 70, skills: ["Pédagogie", "Auto-école", "Contenu"] },
            { id: 2, name: "Fabien", role: "Développeur", capacity: 100, skills: ["React", "Node.js", "Mobile"] }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "process", text: "Nouveaux tests code ajoutés" },
            { sprintIndex: 1, type: "release", text: "Application mobile v2" },
            { sprintIndex: 2, type: "vacation", text: "Sylvie en formation" }
        ],
        settings: { framework: 'kanban', sprintLength: 7, workingDays: 5 }
    }
};

// Export pour utilisation dans script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEMPLATES_DATA;
}
