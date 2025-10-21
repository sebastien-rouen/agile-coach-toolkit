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
            { name: "Sprint 1", velocity: 21, startDate: "2025-09-15", endDate: "2025-09-28", duration: 14, goal: "Mise en place du catalogue produits et panier", bugCount: 2, teamSize: 5 },
            { name: "Sprint 2", velocity: 24, startDate: "2025-09-29", endDate: "2025-10-12", duration: 14, goal: "Système de paiement et gestion commandes", bugCount: 3, teamSize: 5 },
            { name: "Sprint 3", velocity: 26, startDate: "2025-10-13", endDate: "2025-10-26", duration: 14, goal: "Espace client et historique achats", bugCount: 1, teamSize: 5 },
            { name: "Sprint 4", velocity: 28, startDate: "2025-10-27", endDate: "2025-11-09", duration: 14, goal: "Système de recommandations et wishlist", bugCount: 2, teamSize: 5 }
        ],
        team: [
            { id: 1, name: "Sophie", role: "Product Owner", capacity: 80, skills: ["Product Management", "UX", "E-commerce"], startDate: "2025-09-01", endDate: "" },
            { id: 2, name: "Marc", role: "Tech Lead", capacity: 90, skills: ["Node.js", "React", "Architecture"], startDate: "2025-09-01", endDate: "" },
            { id: 3, name: "Julie", role: "Frontend Dev", capacity: 100, skills: ["React", "CSS", "TypeScript"], startDate: "2025-09-15", endDate: "" },
            { id: 4, name: "Thomas", role: "Backend Dev", capacity: 100, skills: ["Node.js", "PostgreSQL", "API"], startDate: "2025-09-01", endDate: "" },
            { id: 5, name: "Emma", role: "QA", capacity: 100, skills: ["Testing", "Automation", "Cypress"], startDate: "2025-09-01", endDate: "" }
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
            // PI 22 - Équipe complète avec Sabrina (15 membres)
            { name: "22.1", velocity: 45, startDate: "2024-11-15", endDate: "2024-11-28", duration: 14, goal: "Infrastructure et automatisation", bugCount: 3, teamSize: 15 },
            { name: "22.2", velocity: 48, startDate: "2024-11-29", endDate: "2024-12-12", duration: 14, goal: "CI/CD et déploiements", bugCount: 2, teamSize: 15 },
            { name: "22.3", velocity: 42, startDate: "2024-12-13", endDate: "2024-12-26", duration: 14, goal: "Monitoring et observabilité", bugCount: 4, teamSize: 15 },
            { name: "22.4", velocity: 38, startDate: "2024-12-27", endDate: "2025-01-09", duration: 14, goal: "Sécurité et conformité", bugCount: 1, teamSize: 14 },
            { name: "22.5", velocity: 50, startDate: "2025-01-10", endDate: "2025-01-23", duration: 14, goal: "Optimisations et performance", bugCount: 2, teamSize: 15 },
            // PI 23 - Montée en compétences cloud
            { name: "23.1", velocity: 52, startDate: "2025-01-24", endDate: "2025-02-06", duration: 14, goal: "Migration cloud native", bugCount: 5, teamSize: 15 },
            { name: "23.2", velocity: 49, startDate: "2025-02-07", endDate: "2025-02-20", duration: 14, goal: "Kubernetes et orchestration", bugCount: 3, teamSize: 15 },
            { name: "23.3", velocity: 51, startDate: "2025-02-21", endDate: "2025-03-06", duration: 14, goal: "GitOps et automatisation", bugCount: 2, teamSize: 15 },
            { name: "23.4", velocity: 47, startDate: "2025-03-07", endDate: "2025-03-20", duration: 14, goal: "Observabilité avancée", bugCount: 4, teamSize: 14 },
            { name: "23.5", velocity: 53, startDate: "2025-03-21", endDate: "2025-04-03", duration: 14, goal: "Résilience et disaster recovery", bugCount: 1, teamSize: 15 },
            // PI 24 - Focus infrastructure
            { name: "24.1", velocity: 55, startDate: "2025-04-04", endDate: "2025-04-17", duration: 14, goal: "Infrastructure as Code", bugCount: 2, teamSize: 15 },
            { name: "24.2", velocity: 50, startDate: "2025-04-18", endDate: "2025-05-01", duration: 14, goal: "Sécurité DevSecOps", bugCount: 3, teamSize: 15 },
            { name: "24.3", velocity: 54, startDate: "2025-05-02", endDate: "2025-05-15", duration: 14, goal: "Automatisation tests", bugCount: 1, teamSize: 15 },
            { name: "24.4", velocity: 52, startDate: "2025-05-16", endDate: "2025-05-29", duration: 14, goal: "Optimisation coûts cloud", bugCount: 2, teamSize: 14 },
            { name: "24.5", velocity: 56, startDate: "2025-05-30", endDate: "2025-06-12", duration: 14, goal: "Plateforme self-service", bugCount: 1, teamSize: 15 },
            // PI 25 - Arrivée Max-Emilien (Tech Lead) - 16 membres
            { name: "25.1", velocity: 58, startDate: "2025-06-13", endDate: "2025-06-26", duration: 14, goal: "Arrivée Max-Emilien - Refonte architecture", bugCount: 4, teamSize: 16 },
            { name: "25.2", velocity: 60, startDate: "2025-06-27", endDate: "2025-07-10", duration: 14, goal: "Modernisation pipelines", bugCount: 2, teamSize: 16 },
            { name: "25.3", velocity: 57, startDate: "2025-07-11", endDate: "2025-07-24", duration: 14, goal: "Monitoring distribué", bugCount: 3, teamSize: 16 },
            { name: "25.4", velocity: 59, startDate: "2025-07-25", endDate: "2025-08-07", duration: 14, goal: "Automatisation complète", bugCount: 1, teamSize: 16 },
            { name: "25.5", velocity: 55, startDate: "2025-08-08", endDate: "2025-08-21", duration: 14, goal: "Documentation et formation", bugCount: 2, teamSize: 15 },
            { name: "25.6", velocity: 53, startDate: "2025-08-22", endDate: "2025-09-04", duration: 14, goal: "Consolidation et stabilisation", bugCount: 1, teamSize: 16 },
            // PI 26 - Arrivée Sébastien, départ Sabrina
            { name: "26.1", velocity: 52, startDate: "2025-09-05", endDate: "2025-09-18", duration: 14, goal: "Nouvelle architecture microservices", bugCount: 3, teamSize: 16 },
            { name: "26.2", velocity: 50, startDate: "2025-09-19", endDate: "2025-10-02", duration: 14, goal: "Service mesh et observabilité", bugCount: 2, teamSize: 16 },
            { name: "26.3", velocity: 48, startDate: "2025-10-03", endDate: "2025-10-16", duration: 14, goal: "Arrivée Sébastien - Transition Scrum Master", bugCount: 4, teamSize: 16 },
            { name: "26.4", velocity: 51, startDate: "2025-10-17", endDate: "2025-10-30", duration: 14, goal: "Optimisation performances", bugCount: 2, teamSize: 16 },
            { name: "26.5", velocity: 49, startDate: "2025-10-31", endDate: "2025-11-13", duration: 14, goal: "Départ Sabrina - Sécurité renforcée", bugCount: 1, teamSize: 15 },
            // PI 27 - Consolidation avec Sébastien
            { name: "27.1", velocity: 47, startDate: "2025-11-14", endDate: "2025-11-27", duration: 14, goal: "Consolidation équipe et processus", bugCount: 2, teamSize: 15 }
        ],
        team: [
            { id: 1, name: "Alexandre", role: "DevOps", capacity: 100, skills: ["Kubernetes", "Docker", "CI/CD"], startDate: "2024-11-15", endDate: "" },
            { id: 2, name: "Arnaud", role: "DevOps", capacity: 100, skills: ["Terraform", "AWS", "Automation"], startDate: "2024-11-15", endDate: "" },
            { id: 3, name: "Emma", role: "DevOps", capacity: 100, skills: ["GitLab", "Python", "Monitoring"], startDate: "2024-11-15", endDate: "" },
            { id: 4, name: "Florian", role: "Product Owner", capacity: 80, skills: ["Product", "Agile", "DevOps"], startDate: "2024-11-15", endDate: "" },
            { id: 5, name: "Jacques", role: "DevOps", capacity: 100, skills: ["Linux", "Scripting", "Ansible"], startDate: "2024-11-15", endDate: "" },
            { id: 6, name: "Radostina", role: "DevOps", capacity: 100, skills: ["Cloud", "Security", "Compliance"], startDate: "2024-11-15", endDate: "" },
            { id: 7, name: "Lucas", role: "DevOps", capacity: 100, skills: ["Jenkins", "Docker", "Kubernetes"], startDate: "2024-11-15", endDate: "" },
            { id: 8, name: "Max-Emilien", role: "Tech Lead DevOps", capacity: 100, skills: ["Architecture", "Leadership", "Cloud Native"], startDate: "2025-06-13", endDate: "2025-12-15" },
            { id: 9, name: "Mohamed", role: "DevOps", capacity: 100, skills: ["CI/CD", "Automation", "Monitoring"], startDate: "2024-11-15", endDate: "" },
            { id: 10, name: "Paul", role: "DevOps", capacity: 100, skills: ["Infrastructure", "Terraform", "AWS"], startDate: "2024-11-15", endDate: "" },
            { id: 11, name: "Roberto", role: "DevOps", capacity: 100, skills: ["Kubernetes", "Helm", "GitOps"], startDate: "2024-11-15", endDate: "" },
            { id: 12, name: "Rossif", role: "DevOps", capacity: 100, skills: ["Monitoring", "Prometheus", "Grafana"], startDate: "2024-11-15", endDate: "" },
            { id: 13, name: "Selim", role: "DevOps", capacity: 100, skills: ["Security", "DevSecOps", "Vault"], startDate: "2024-11-15", endDate: "" },
            { id: 14, name: "Yassine", role: "DevOps", capacity: 100, skills: ["Cloud", "Azure", "Automation"], startDate: "2024-11-15", endDate: "" },
            { id: 15, name: "Sabrina", role: "Scrum Master", capacity: 50, skills: ["Scrum", "Agile", "Coaching"], startDate: "2024-09-01", endDate: "2025-11-14" },
            { id: 16, name: "Sébastien", role: "Scrum Master", capacity: 50, skills: ["Scrum", "SAFe", "Facilitation"], startDate: "2025-10-23", endDate: "" }
        ],
        events: [
            // Daily Standup - Tous les jours
            { type: "daily", title: "Daily Standup", date: "2024-11-15", time: "09:45", duration: 15, recurring: true, recurrence_type: "daily", recurrence_interval: 1, recurrence_days: [], recurrence_end_date: "2026-01-29", description: "Point quotidien de synchronisation de l'équipe" },

            // Sprint Planning - Tous les vendredis (début de sprint)
            { type: "sprint_planning", title: "Sprint Planning", date: "2024-11-15", time: "09:30", duration: 120, recurring: true, recurrence_type: "weekly", recurrence_interval: 2, recurrence_days: [5], recurrence_end_date: "2026-01-29", description: "Planification du sprint avec l'équipe" },

            // Backlog Refinement - Tous les mercredis (milieu de sprint)
            { type: "backlog_refinement", title: "Backlog Refinement", date: "2024-11-20", time: "14:00", duration: 90, recurring: true, recurrence_type: "weekly", recurrence_interval: 2, recurrence_days: [3], recurrence_end_date: "2026-01-29", description: "Affinage du backlog produit" },

            // Sprint Review - Tous les jeudis (fin de sprint)
            { type: "sprint_review", title: "Sprint Review", date: "2024-11-28", time: "15:00", duration: 60, recurring: true, recurrence_type: "weekly", recurrence_interval: 2, recurrence_days: [4], recurrence_end_date: "2026-01-29", description: "Revue du sprint avec les parties prenantes" },

            // Sprint Retrospective - Tous les jeudis (fin de sprint)
            { type: "sprint_retrospective", title: "Sprint Retrospective", date: "2024-11-28", time: "16:30", duration: 90, recurring: true, recurrence_type: "weekly", recurrence_interval: 2, recurrence_days: [4], recurrence_end_date: "2026-01-29", description: "Rétrospective d'équipe pour amélioration continue" }
        ],
        annotationsTemplate: [
            { sprintIndex: 0, type: "team", text: "🚀 Début PI 22 - Équipe complète avec Sabrina" },
            { sprintIndex: 4, type: "release", text: "🎯 Fin PI 22 - Objectifs atteints" },
            { sprintIndex: 5, type: "team", text: "📈 Début PI 23 - Montée en compétences" },
            { sprintIndex: 9, type: "release", text: "☁️ Fin PI 23 - Migration cloud réussie" },
            { sprintIndex: 10, type: "team", text: "🏗️ Début PI 24 - Focus infrastructure" },
            { sprintIndex: 14, type: "release", text: "🛠️ Fin PI 24 - Plateforme self-service opérationnelle" },
            { sprintIndex: 15, type: "team", text: "👨‍💼 Début PI 25 - Arrivée de Max-Emilien (Tech Lead)" },
            { sprintIndex: 20, type: "release", text: "🏛️ Fin PI 25 - Architecture modernisée" },
            { sprintIndex: 21, type: "team", text: "🔄 Début PI 26 - Nouvelle phase" },
            { sprintIndex: 22, type: "team", text: "👋 Arrivée de Sébastien (Scrum Master) - 23 Oct 2025" },
            { sprintIndex: 24, type: "team", text: "👋 Départ de Sabrina - Transition Scrum Master" },
            { sprintIndex: 26, type: "team", text: "🤝 Début PI 27 - Consolidation avec Sébastien" }
        ],
        pis: [
            { name: "PI 22", startDate: "2024-11-15", endDate: "2025-01-23", location: "Remote", objective: "Infrastructure et automatisation DevOps", status: "completed", comment: "Équipe complète avec Sabrina", risks: [], dependencies: [], confidence_vote: 4, sprints: [] },
            { name: "PI 23", startDate: "2025-01-24", endDate: "2025-04-03", location: "Remote", objective: "Migration cloud native et Kubernetes", status: "completed", comment: "Montée en compétences cloud", risks: [], dependencies: [], confidence_vote: 4, sprints: [] },
            { name: "PI 24", startDate: "2025-04-04", endDate: "2025-06-12", location: "Remote", objective: "Infrastructure as Code et plateforme self-service", status: "completed", comment: "Focus infrastructure", risks: [], dependencies: [], confidence_vote: 5, sprints: [] },
            { name: "PI 25", startDate: "2025-06-13", endDate: "2025-09-04", location: "Remote", objective: "Refonte architecture avec Max-Emilien", status: "completed", comment: "Arrivée Tech Lead - Architecture modernisée", risks: [], dependencies: [], confidence_vote: 5, sprints: [] },
            { name: "PI 26", startDate: "2025-09-05", endDate: "2025-11-13", location: "Remote", objective: "Microservices et transition Scrum Master", status: "completed", comment: "Arrivée Sébastien, départ Sabrina", risks: [], dependencies: [], confidence_vote: 4, sprints: [] },
            { name: "PI 27", startDate: "2025-11-14", endDate: "2026-01-29", location: "Remote", objective: "Consolidation équipe et processus", status: "planning", comment: "Nouvelle phase avec Sébastien", risks: [], dependencies: [], confidence_vote: null, sprints: [] }
        ],
        settings: { framework: 'scrum', sprintLength: 14, workingDays: 10 }
    },

    'scrum-data': {
        name: "📊 Data (Scrum)",
        framework: 'scrum',
        sprints: [
            { name: "Sprint 1", velocity: 16, startDate: "2025-09-15", endDate: "2025-09-28", duration: 14, goal: "Pipeline ETL pour données clients", bugCount: 1, teamSize: 4 },
            { name: "Sprint 2", velocity: 19, startDate: "2025-09-29", endDate: "2025-10-12", duration: 14, goal: "Dashboard analytics temps réel", bugCount: 2, teamSize: 4 },
            { name: "Sprint 3", velocity: 21, startDate: "2025-10-13", endDate: "2025-10-26", duration: 14, goal: "Modèles ML de prédiction", bugCount: 1, teamSize: 4 },
            { name: "Sprint 4", velocity: 23, startDate: "2025-10-27", endDate: "2025-11-09", duration: 14, goal: "API de recommandations", bugCount: 0, teamSize: 4 }
        ],
        team: [
            { id: 1, name: "Pierre", role: "Data Engineer", capacity: 100, skills: ["Python", "Spark", "Airflow"], startDate: "2025-09-01", endDate: "" },
            { id: 2, name: "Marie", role: "Data Scientist", capacity: 100, skills: ["ML", "Python", "TensorFlow"], startDate: "2025-09-01", endDate: "" },
            { id: 3, name: "Lucas", role: "Analytics Engineer", capacity: 90, skills: ["SQL", "dbt", "Looker"], startDate: "2025-09-01", endDate: "" },
            { id: 4, name: "Camille", role: "Data Analyst", capacity: 100, skills: ["SQL", "Python", "Tableau"], startDate: "2025-09-01", endDate: "" }
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
            { id: 1, name: "Claire", role: "Product Owner RH", capacity: 70, skills: ["RH", "Product", "Process"], startDate: "2025-06-01", endDate: "" },
            { id: 2, name: "Antoine", role: "Fullstack Dev", capacity: 100, skills: ["Vue.js", "Node.js", "PostgreSQL"], startDate: "2025-06-01", endDate: "" },
            { id: 3, name: "Léa", role: "UX Designer", capacity: 100, skills: ["UX/UI", "Figma", "User Research"], startDate: "2025-06-01", endDate: "" },
            { id: 4, name: "Maxime", role: "Backend Dev", capacity: 100, skills: ["Node.js", "API", "MongoDB"], startDate: "2025-05-15", endDate: "2025-06-20" }
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
            { id: 1, name: "François", role: "Chef de projet", capacity: 80, skills: ["Gestion projet", "Public", "RGPD"], startDate: "2025-06-01", endDate: "" },
            { id: 2, name: "Isabelle", role: "Développeur", capacity: 100, skills: ["PHP", "Symfony", "MySQL"], startDate: "2025-06-01", endDate: "" },
            { id: 3, name: "Jean", role: "Développeur", capacity: 100, skills: ["JavaScript", "Vue.js", "API"], startDate: "2025-06-01", endDate: "" },
            { id: 4, name: "Nathalie", role: "Testeur", capacity: 90, skills: ["Testing", "Accessibilité", "RGAA"], startDate: "2025-06-01", endDate: "" },
            { id: 5, name: "Bernard", role: "Architecte SI", capacity: 80, skills: ["Architecture", "Sécurité", "RGPD"], startDate: "2025-05-15", endDate: "2025-07-01" }
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
            { id: 1, name: "Dr. Martin", role: "Product Owner", capacity: 60, skills: ["Médecine", "Product", "Santé"], startDate: "2025-06-01", endDate: "" },
            { id: 2, name: "Julien", role: "Tech Lead", capacity: 90, skills: ["Java", "Spring", "Sécurité"], startDate: "2025-06-01", endDate: "" },
            { id: 3, name: "Céline", role: "Backend Dev", capacity: 100, skills: ["Java", "PostgreSQL", "HL7"], startDate: "2025-06-01", endDate: "" },
            { id: 4, name: "Maxime", role: "Frontend Dev", capacity: 100, skills: ["React", "TypeScript", "Accessibilité"], startDate: "2025-06-01", endDate: "" },
            { id: 5, name: "Sophie", role: "QA Santé", capacity: 100, skills: ["Testing", "Conformité", "Sécurité"], startDate: "2025-06-01", endDate: "" },
            { id: 6, name: "Philippe", role: "DevOps", capacity: 100, skills: ["Docker", "CI/CD", "Sécurité"], startDate: "2025-05-20", endDate: "2025-06-25" }
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
            { id: 1, name: "Olivier", role: "Product Owner", capacity: 80, skills: ["Product", "EdTech", "Auto-école"], startDate: "2025-06-01", endDate: "" },
            { id: 2, name: "Laura", role: "Fullstack Dev", capacity: 100, skills: ["React", "Node.js", "MongoDB"], startDate: "2025-06-01", endDate: "" },
            { id: 3, name: "Kevin", role: "Mobile Dev", capacity: 100, skills: ["React Native", "iOS", "Android"], startDate: "2025-06-15", endDate: "" },
            { id: 4, name: "Sandrine", role: "UX Designer", capacity: 100, skills: ["UX/UI", "Figma", "Mobile"], startDate: "2025-05-25", endDate: "2025-06-30" }
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
