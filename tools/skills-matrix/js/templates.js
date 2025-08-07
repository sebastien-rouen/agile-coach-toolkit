/**
 * Skills Matrix - Templates prédéfinis
 */

// Templates prédéfinis avec exemples d'appétences et ownerships
const templates = {
    auth: {
        name: "Authentification",
        skills: ["OAuth/SSO", "JWT/Auth0", "Session Management", "2FA/TOTP", "Password Hash/bcrypt", "RBAC/Permissions"],
        members: [
            {
                name: "Alice",
                levels: [4, 4, 3, 2, 4, 3],
                appetences: ["Biométrie", "Zero Trust"],
                ownerships: ["Architecture Sécurité", "Audit Conformité"]
            },
            {
                name: "Bob",
                levels: [3, 4, 4, 4, 3, 2],
                appetences: ["OAuth 2.1", "WebAuthn"],
                ownerships: []
            },
            {
                name: "Charlie",
                levels: [2, 3, 2, 1, 3, 4],
                appetences: ["JWT", "Session Management", "2FA"],
                ownerships: []
            }
        ]
    },
    tribu_value: {
        name: "Tribu VALUE",
        skills: ["Coaching Agile", "Facilitation", "Conseil Stratégique", "Accompagnement Équipes", "Formation", "Mentoring", "Change Management", "Leadership", "Communication", "Analyse Organisationnelle"],
        members: [
            { name: "Audrey", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: ["Leader de tribu", "OKR"] },
            { name: "Sébastien", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Mathilde", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Anthony", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: ["OKR"] },
            { name: "Delphine", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Hao", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Jérémie", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Samy", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Valérie", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Yves", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Caroline", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Gabrielle", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Laetitia", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] },
            { name: "Marina", levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], appetences: [], ownerships: [] }
        ]
    },
    ecommerce: {
        name: "Panier e-commerce",
        skills: ["Gestion Produits/Catalog", "Panier/Redis", "Stock/Inventory", "Prix/Promos/Coupons", "API Payment/Stripe", "Livraison/Shipping"],
        members: [
            {
                name: "Sophie",
                levels: [4, 4, 3, 4, 3, 2],
                appetences: ["Microservices", "Event Sourcing"],
                ownerships: ["Product Owner E-commerce", "Stratégie Pricing"]
            },
            {
                name: "Thomas",
                levels: [3, 4, 4, 3, 4, 3],
                appetences: ["Kubernetes", "GraphQL"],
                ownerships: ["Architecture Backend"]
            },
            {
                name: "Marie",
                levels: [2, 3, 2, 2, 2, 4],
                appetences: ["Redis", "Gestion Stock", "API Payment"],
                ownerships: []
            }
        ]
    },
    search: {
        name: "Recherche",
        skills: ["Elasticsearch/Solr", "Indexation/Lucene", "Filtres/Facettes", "Autocomplete/Suggest", "Facettes/Aggregations", "Performance/Caching"],
        members: [
            {
                name: "Lucas",
                levels: [4, 4, 3, 4, 3, 4],
                appetences: ["Vector Search", "AI/ML Search"],
                ownerships: ["Expert Elasticsearch", "Performance Tuning"]
            },
            {
                name: "Emma",
                levels: [3, 3, 4, 3, 4, 3],
                appetences: ["NLP", "Semantic Search"],
                ownerships: []
            },
            {
                name: "Noah",
                levels: [2, 3, 2, 2, 2, 2],
                appetences: ["Elasticsearch", "Filtres", "Autocomplete"],
                ownerships: []
            }
        ]
    },
    payment: {
        name: "Paiement",
        skills: ["Stripe/Square", "PayPal/Adyen", "3D Secure/SCA", "Webhooks/Events", "Remboursements/Refunds", "PCI DSS/Compliance"],
        members: [
            {
                name: "Léa",
                levels: [4, 3, 4, 4, 3, 3],
                appetences: ["Crypto Payments", "Open Banking"],
                ownerships: ["Référente Paiements", "Conformité PCI DSS"]
            },
            {
                name: "Hugo",
                levels: [3, 4, 3, 3, 4, 2],
                appetences: ["Stripe Connect", "Fraud Detection"],
                ownerships: []
            },
            {
                name: "Chloé",
                levels: [2, 2, 2, 3, 2, 4],
                appetences: ["Stripe", "3D Secure", "Webhooks"],
                ownerships: ["Documentation Compliance"]
            }
        ]
    },
    registration: {
        name: "Inscription",
        skills: ["Validation Form/Joi", "Email Verify/SendGrid", "CAPTCHA/reCAPTCHA", "RGPD/GDPR", "Profil User/Profile", "Onboarding/UX"],
        members: [
            {
                name: "Louis",
                levels: [4, 4, 3, 4, 3, 2],
                appetences: ["Progressive Profiling", "A/B Testing"],
                ownerships: ["Expert RGPD", "Responsable Onboarding"]
            },
            {
                name: "Camille",
                levels: [3, 3, 4, 3, 4, 4],
                appetences: ["Design System", "Accessibilité"],
                ownerships: ["UX Lead"]
            },
            {
                name: "Arthur",
                levels: [2, 2, 2, 3, 2, 1],
                appetences: ["Validation Forms", "Email Verify", "UX Design"],
                ownerships: []
            }
        ]
    },
    health: {
        name: "Santé - Parcours patient",
        skills: ["Dossier Patient/EMR", "RDV/Scheduling", "Prescriptions/ePrescribing", "HL7/FHIR", "Sécurité/HIPAA", "Télémédecine/WebRTC"],
        members: [
            {
                name: "Dr. Martin",
                levels: [4, 4, 3, 3, 4, 2],
                appetences: ["IA Diagnostic", "Télémédecine"],
                ownerships: ["Référent Médical", "Conformité HIPAA"]
            },
            {
                name: "Infirmière Julie",
                levels: [3, 4, 4, 2, 3, 3],
                appetences: ["HL7/FHIR", "Télémédecine"],
                ownerships: ["Coordination Soins"]
            },
            {
                name: "Tech Paul",
                levels: [2, 2, 2, 4, 3, 4],
                appetences: ["EMR", "Scheduling"],
                ownerships: ["Expert HL7/FHIR", "Infrastructure WebRTC"]
            }
        ]
    },
    devops: {
        name: "DevOps - Déploiement",
        skills: ["Docker/Containers", "Kubernetes/K8s", "CI/CD/Jenkins", "Terraform/IaC", "Monitoring/Prometheus", "Sécurité/DevSecOps"],
        members: [
            {
                name: "Alex",
                levels: [4, 4, 4, 3, 4, 3],
                appetences: ["GitOps", "Service Mesh"],
                ownerships: ["Architecte DevOps", "Lead Kubernetes"]
            },
            {
                name: "Sam",
                levels: [3, 3, 4, 4, 3, 4],
                appetences: ["Observability", "Chaos Engineering"],
                ownerships: ["Expert Terraform", "Responsable Sécurité"]
            },
            {
                name: "Jordan",
                levels: [2, 2, 3, 2, 2, 2],
                appetences: ["Docker", "Kubernetes", "CI/CD"],
                ownerships: []
            }
        ]
    },
    sirh: {
        name: "SIRH - Ressources Humaines",
        skills: ["Gestion Employés/HR", "Paie/Payroll", "Congés/Absences", "Formation/LMS", "Recrutement/ATS", "Évaluation/Performance"],
        members: [
            {
                name: "RH Manager",
                levels: [4, 4, 4, 3, 4, 4],
                appetences: ["People Analytics", "QVCT"],
                ownerships: ["Directeur RH", "Stratégie Talents"]
            },
            {
                name: "Gestionnaire Paie",
                levels: [3, 4, 3, 2, 2, 3],
                appetences: ["Automatisation Paie", "DSN"],
                ownerships: ["Expert Paie"]
            },
            {
                name: "Assistant RH",
                levels: [3, 2, 4, 3, 3, 2],
                appetences: ["Paie", "Formation", "Recrutement"],
                ownerships: []
            }
        ]
    },
    education: {
        name: "Éducation Nationale",
        skills: ["ENT/Pronote", "Moodle/LMS", "Évaluations/Notes", "Vie Scolaire/CPE", "Communication/Parents", "Ressources/BRNE"],
        members: [
            {
                name: "Professeur Principal",
                levels: [4, 4, 4, 4, 3, 3],
                appetences: ["Pédagogie Numérique", "Classe Inversée"],
                ownerships: ["Référent Numérique", "Coordinateur Pédagogique"]
            },
            {
                name: "Enseignant",
                levels: [3, 4, 4, 2, 3, 4],
                appetences: ["Gamification", "Évaluation par Compétences"],
                ownerships: []
            },
            {
                name: "Admin Système",
                levels: [4, 3, 2, 3, 2, 2],
                appetences: ["Moodle", "Vie Scolaire"],
                ownerships: ["Administrateur ENT", "Support Technique"]
            }
        ]
    }
};

// Palette de couleurs vibrantes pour les compétences
const skillColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#E63946',
    '#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E07A5F'
];
