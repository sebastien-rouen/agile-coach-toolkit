/**
 * wizard.js - Gestion du wizard de navigation intelligent
 * Guide l'utilisateur vers les bonnes catégories selon son profil
 */

const WizardState = {
  currentStep: 1,
  maxSteps: 3,
  answers: {
    role: null,
    goal: null,
    context: [] // Tableau pour sélection multiple
  }
};

/**
 * Options du wizard (à personnaliser selon vos besoins)
 */
const WizardOptions = {
  roles: [
    {
      id: 'scrum-master',
      label: 'Scrum Master',
      icon: '🎯',
      description: 'Facilitateur d\'équipe Scrum',
      categories: ['fondamentaux', 'frameworks', 'animation', 'gestion-defis', 'leadership']
    },
    {
      id: 'coach-agile',
      label: 'Coach Agile',
      icon: '🧭',
      description: 'Coach de transformation',
      categories: ['transformation', 'leadership', 'multi-equipes', 'developpement-coach']
    },
    {
      id: 'product-owner',
      label: 'Product Owner',
      icon: '📦',
      description: 'Responsable produit',
      categories: ['product-design', 'frameworks', 'delivery']
    },
    {
      id: 'dev-team',
      label: 'Développeur',
      icon: '💻',
      description: 'Membre de l\'équipe de développement',
      categories: ['frameworks', 'delivery', 'outils-tech']
    },
    {
      id: 'manager',
      label: 'Manager',
      icon: '👔',
      description: 'Manager d\'équipe ou de département',
      categories: ['transformation', 'leadership', 'multi-equipes', 'contextes']
    },
    {
      id: 'rh',
      label: 'RH / Recrutement',
      icon: '👥',
      description: 'Ressources humaines et recrutement',
      categories: ['transformation', 'leadership', 'ressources', 'developpement-coach']
    },
    {
      id: 'data',
      label: 'Data Analyst / Scientist',
      icon: '📊',
      description: 'Analyse de données et métriques',
      categories: ['outils-tech', 'delivery', 'frameworks', 'ressources']
    },
    {
      id: 'designer',
      label: 'Designer UX/UI',
      icon: '🎨',
      description: 'Design d\'expérience utilisateur',
      categories: ['product-design', 'animation', 'ressources', 'frameworks']
    },
    {
      id: 'curious',
      label: 'Curieux / Débutant',
      icon: '🌱',
      description: 'Je découvre l\'agilité',
      categories: ['fondamentaux', 'frameworks', 'ressources']
    }
  ],

  goals: [
    // 🎯 SCRUM MASTER
    {
      id: 'improve-team-collab',
      label: 'Améliorer la collaboration d\'équipe',
      icon: '🤝',
      description: 'Fluidifier les interactions et créer un climat de confiance',
      categories: ['animation', 'gestion-defis', 'frameworks'],
      relevantRoles: ['scrum-master', 'coach-agile', 'manager', 'dev-team']
    },
    {
      id: 'create-safety',
      label: 'Créer un climat de sécurité psychologique',
      icon: '🛡️',
      description: 'Encourager la transparence et l\'expression sans jugement',
      categories: ['animation', 'gestion-defis', 'leadership'],
      relevantRoles: ['scrum-master', 'coach-agile', 'manager']
    },
    {
      id: 'reduce-blockers',
      label: 'Réduire les blocages récurrents',
      icon: '🚧',
      description: 'Cartographier et éliminer les obstacles systémiques',
      categories: ['gestion-defis', 'delivery', 'frameworks'],
      relevantRoles: ['scrum-master', 'coach-agile']
    },
    {
      id: 'actionable-retros',
      label: 'Rendre les rétros actionnables',
      icon: '🎯',
      description: 'Passer de la théorie aux actions concrètes',
      categories: ['animation', 'frameworks', 'ressources'],
      relevantRoles: ['scrum-master', 'coach-agile']
    },
    {
      id: 'facilitate-events',
      label: 'Faciliter des événements agiles engageants',
      icon: '🎭',
      description: 'Animer des rituels dynamiques en présentiel et remote',
      categories: ['animation', 'frameworks', 'ressources'],
      relevantRoles: ['scrum-master', 'coach-agile']
    },
    {
      id: 'advanced-facilitation',
      label: 'Maîtriser des techniques de facilitation avancées',
      icon: '🧠',
      description: 'Liberating Structures, Management 3.0, coaching non-directif',
      categories: ['developpement-coach', 'animation', 'ressources'],
      relevantRoles: ['scrum-master', 'coach-agile']
    },
    {
      id: 'useful-metrics',
      label: 'Identifier des métriques utiles',
      icon: '📊',
      description: 'Au-delà de la vélocité : temps de cycle, taux de blocages',
      categories: ['delivery', 'outils-tech', 'frameworks'],
      relevantRoles: ['scrum-master', 'data', 'product-owner', 'manager']
    },
    {
      id: 'manage-tensions',
      label: 'Gérer les tensions et conflits d\'équipe',
      icon: '⚖️',
      description: 'Médiation, désamorçage, protection face aux pressions',
      categories: ['gestion-defis', 'leadership', 'animation'],
      relevantRoles: ['scrum-master', 'coach-agile', 'manager']
    },

    // 🧭 COACH AGILE
    {
      id: 'break-silos',
      label: 'Briser les silos entre équipes',
      icon: '🌉',
      description: 'Ateliers cross-team, guildes, communautés de pratique',
      categories: ['multi-equipes', 'transformation', 'animation'],
      relevantRoles: ['coach-agile', 'manager']
    },
    {
      id: 'feedback-culture',
      label: 'Créer une culture du feedback',
      icon: '💬',
      description: '360° feedback, retours constructifs, transparence',
      categories: ['transformation', 'leadership', 'animation'],
      relevantRoles: ['coach-agile', 'manager', 'rh']
    },
    {
      id: 'start-transformation',
      label: 'Démarrer une transformation agile',
      icon: '🚀',
      description: 'Convaincre avec des preuves, éviter les pièges classiques',
      categories: ['fondamentaux', 'transformation', 'frameworks'],
      relevantRoles: ['coach-agile', 'manager', 'curious']
    },
    {
      id: 'scale-agile',
      label: 'Passer à l\'échelle (plusieurs équipes)',
      icon: '🏗️',
      description: 'Choisir le bon framework : LeSS, SAFe, Spotify',
      categories: ['multi-equipes', 'frameworks', 'transformation'],
      relevantRoles: ['coach-agile', 'manager']
    },
    {
      id: 'strategic-alignment',
      label: 'Aligner stratégiquement les équipes',
      icon: '🎯',
      description: 'OKRs, North Star Metric, vision partagée',
      categories: ['multi-equipes', 'transformation', 'leadership'],
      relevantRoles: ['coach-agile', 'manager', 'product-owner']
    },
    {
      id: 'systemic-coaching',
      label: 'Devenir expert en coaching systémique',
      icon: '🔄',
      description: 'Comprendre les dynamiques organisationnelles',
      categories: ['developpement-coach', 'leadership', 'transformation'],
      relevantRoles: ['coach-agile']
    },
    {
      id: 'manage-resistance',
      label: 'Gérer les résistances au changement',
      icon: '🛡️',
      description: 'Ateliers "Why Agile?", storytelling, servant leadership',
      categories: ['gestion-defis', 'transformation', 'leadership'],
      relevantRoles: ['coach-agile', 'manager']
    },

    // 📦 PRODUCT OWNER
    {
      id: 'reduce-time-to-market',
      label: 'Réduire le time-to-market',
      icon: '⚡',
      description: 'Découpage de stories, MVP, livraison incrémentale',
      categories: ['delivery', 'product-design', 'frameworks'],
      relevantRoles: ['product-owner', 'dev-team']
    },
    {
      id: 'maximize-roi',
      label: 'Maximiser le ROI des sprints',
      icon: '💰',
      description: 'Priorisation par impact/effort, Cost of Delay',
      categories: ['delivery', 'product-design', 'frameworks'],
      relevantRoles: ['product-owner', 'manager']
    },
    {
      id: 'master-story-mapping',
      label: 'Maîtriser la story mapping',
      icon: '🗺️',
      description: 'Ateliers collaboratifs avec utilisateurs et équipe',
      categories: ['product-design', 'animation', 'ressources'],
      relevantRoles: ['product-owner', 'designer']
    },
    {
      id: 'learn-to-say-no',
      label: 'Apprendre à dire "non" aux parties prenantes',
      icon: '🚫',
      description: 'Techniques de négociation sans frustrer',
      categories: ['leadership', 'gestion-defis', 'ressources'],
      relevantRoles: ['product-owner', 'manager']
    },
    {
      id: 'product-metrics',
      label: 'Suivre des métriques produit',
      icon: '📈',
      description: 'Taux d\'adoption, NPS, retention, engagement',
      categories: ['delivery', 'outils-tech', 'product-design'],
      relevantRoles: ['product-owner', 'data', 'manager']
    },
    {
      id: 'validate-hypotheses',
      label: 'Valider les hypothèses avec des expérimentations',
      icon: '🧪',
      description: 'A/B tests, fake doors, tests utilisateurs légers',
      categories: ['product-design', 'delivery', 'ressources'],
      relevantRoles: ['product-owner', 'designer', 'data']
    },
    {
      id: 'user-centric-design',
      label: 'Concevoir un produit centré utilisateur',
      icon: '🎨',
      description: 'User journeys, interviews, tests utilisateurs',
      categories: ['product-design', 'ressources', 'frameworks'],
      relevantRoles: ['product-owner', 'designer']
    },

    // 💻 DÉVELOPPEUR
    {
      id: 'active-refinement',
      label: 'Participer activement aux raffinements',
      icon: '💡',
      description: 'Poser des questions "pourquoi" avant "comment"',
      categories: ['frameworks', 'animation', 'delivery'],
      relevantRoles: ['dev-team', 'product-owner']
    },
    {
      id: 'mentor-juniors',
      label: 'Mentorer les juniors',
      icon: '👨‍🏫',
      description: 'Pair programming, code reviews bienveillantes',
      categories: ['leadership', 'ressources', 'outils-tech'],
      relevantRoles: ['dev-team']
    },
    {
      id: 'reduce-cycle-time',
      label: 'Réduire le temps de cycle des stories',
      icon: '⏱️',
      description: 'Limiter le WIP, automatiser les tests',
      categories: ['delivery', 'outils-tech', 'frameworks'],
      relevantRoles: ['dev-team', 'scrum-master']
    },
    {
      id: 'improve-code-quality',
      label: 'Améliorer la qualité du code',
      icon: '✨',
      description: 'Dette technique, coverage tests, refactoring',
      categories: ['outils-tech', 'delivery', 'ressources'],
      relevantRoles: ['dev-team']
    },
    {
      id: 'devops-skills',
      label: 'Monter en compétences DevOps/CI-CD',
      icon: '🔧',
      description: 'Pipelines, feature flags, automatisation',
      categories: ['outils-tech', 'delivery', 'ressources'],
      relevantRoles: ['dev-team', 'data']
    },
    {
      id: 'understand-product',
      label: 'Comprendre les enjeux produit',
      icon: '🎯',
      description: 'Participer aux ateliers de priorisation',
      categories: ['product-design', 'frameworks', 'ressources'],
      relevantRoles: ['dev-team', 'product-owner']
    },
    {
      id: 'learn-agile-basics',
      label: 'Comprendre les bases de l\'agilité',
      icon: '🌱',
      description: 'Distinguer Agile, Scrum, Kanban - comprendre le "pourquoi"',
      categories: ['fondamentaux', 'frameworks', 'ressources'],
      relevantRoles: ['dev-team', 'curious']
    },
    {
      id: 'automate-tasks',
      label: 'Automatiser les tâches répétitives',
      icon: '🤖',
      description: 'Scripts, bots, outils adaptés (Jira, Trello, Notion)',
      categories: ['outils-tech', 'delivery', 'ressources'],
      relevantRoles: ['dev-team', 'data']
    },

    // 👔 MANAGER
    {
      id: 'create-trust',
      label: 'Créer des espaces de confiance',
      icon: '🤝',
      description: '1:1 réguliers, feedbacks bidirectionnels, transparence',
      categories: ['leadership', 'animation', 'gestion-defis'],
      relevantRoles: ['manager', 'coach-agile']
    },
    {
      id: 'servant-leadership',
      label: 'Devenir un servant leader',
      icon: '🙏',
      description: 'Enlever les blocages, donner de l\'autonomie',
      categories: ['leadership', 'transformation', 'frameworks'],
      relevantRoles: ['manager', 'coach-agile']
    },
    {
      id: 'align-strategy',
      label: 'Aligner stratégie business et agilité',
      icon: '🎯',
      description: 'OKRs agiles, vision partagée',
      categories: ['transformation', 'leadership', 'multi-equipes'],
      relevantRoles: ['manager', 'coach-agile']
    },
    {
      id: 'communities-practice',
      label: 'Créer des communautés de pratique',
      icon: '👥',
      description: 'Guildes tech, product, agile',
      categories: ['multi-equipes', 'transformation', 'ressources'],
      relevantRoles: ['manager', 'coach-agile']
    },
    {
      id: 'delegate-effectively',
      label: 'Apprendre à déléguer sans perdre le contrôle',
      icon: '🎯',
      description: 'Management par objectifs, autonomie responsable',
      categories: ['leadership', 'ressources', 'frameworks'],
      relevantRoles: ['manager']
    },
    {
      id: 'recruit-agile-profiles',
      label: 'Recruter des profils agiles',
      icon: '🎯',
      description: 'Identifier les soft skills, vendre la culture agile',
      categories: ['ressources', 'transformation', 'leadership'],
      relevantRoles: ['manager', 'rh']
    },
    {
      id: 'avoid-toxic-metrics',
      label: 'Éviter les métriques toxiques',
      icon: '⚠️',
      description: 'Suivre l\'engagement et la santé d\'équipe',
      categories: ['delivery', 'leadership', 'frameworks'],
      relevantRoles: ['manager', 'scrum-master']
    },
    {
      id: 'manage-inter-team-conflicts',
      label: 'Gérer les conflits inter-équipes',
      icon: '🤝',
      description: 'Dépendances, priorités, protection des équipes',
      categories: ['gestion-defis', 'multi-equipes', 'leadership'],
      relevantRoles: ['manager', 'coach-agile']
    },

    // 👥 RH / RECRUTEMENT
    {
      id: 'understand-agile-roles',
      label: 'Comprendre les rôles agiles',
      icon: '🎭',
      description: 'SM, PO, Dev - pour mieux recruter',
      categories: ['ressources', 'transformation', 'fondamentaux'],
      relevantRoles: ['rh', 'manager']
    },
    {
      id: 'evaluate-agile-mindset',
      label: 'Évaluer l\'agile mindset en entretien',
      icon: '🧠',
      description: 'Jeux de rôle, questions comportementales',
      categories: ['ressources', 'leadership', 'animation'],
      relevantRoles: ['rh', 'manager']
    },
    {
      id: 'employer-branding',
      label: 'Attirer avec une marque employeur agile',
      icon: '✨',
      description: 'Montrer des retours d\'équipes, adapter les fiches de poste',
      categories: ['ressources', 'transformation', 'leadership'],
      relevantRoles: ['rh', 'manager']
    },
    {
      id: 'agile-onboarding',
      label: 'Améliorer l\'onboarding agile',
      icon: '🚀',
      description: 'Parcours expérientiel, participation aux rituels dès J1',
      categories: ['ressources', 'animation', 'frameworks'],
      relevantRoles: ['rh', 'manager', 'scrum-master']
    },

    // 📊 DATA ANALYST / SCIENTIST
    {
      id: 'prioritize-analyses',
      label: 'Prioriser les analyses avec l\'équipe produit',
      icon: '🎯',
      description: 'Alignement sur les OKRs, insights actionnables',
      categories: ['delivery', 'product-design', 'frameworks'],
      relevantRoles: ['data', 'product-owner']
    },
    {
      id: 'data-viz-agile',
      label: 'Maîtriser les outils de data viz agile',
      icon: '📊',
      description: 'Tableau, Power BI intégrés aux rituels',
      categories: ['outils-tech', 'delivery', 'ressources'],
      relevantRoles: ['data']
    },
    {
      id: 'product-data-metrics',
      label: 'Créer des métriques produit-data',
      icon: '📈',
      description: 'Corrélation features/engagement, A/B tests',
      categories: ['delivery', 'product-design', 'outils-tech'],
      relevantRoles: ['data', 'product-owner']
    },
    {
      id: 'automate-reporting',
      label: 'Automatiser le reporting',
      icon: '🤖',
      description: 'Scripts Python, extraction Jira, dashboards temps réel',
      categories: ['outils-tech', 'delivery', 'ressources'],
      relevantRoles: ['data', 'dev-team']
    },

    // 🎨 DESIGNER UX/UI
    {
      id: 'co-design-workshops',
      label: 'Maîtriser les ateliers de co-conception',
      icon: '🎨',
      description: 'Design Sprint, Crazy 8s, ateliers collaboratifs',
      categories: ['product-design', 'animation', 'ressources'],
      relevantRoles: ['designer', 'product-owner']
    },
    {
      id: 'pitch-ideas',
      label: 'Pitcher des idées aux parties prenantes',
      icon: '💡',
      description: 'Storytelling, prototypes rapides',
      categories: ['leadership', 'product-design', 'ressources'],
      relevantRoles: ['designer', 'product-owner']
    },
    {
      id: 'ux-in-backlog',
      label: 'Intégrer l\'UX dans le backlog produit',
      icon: '📋',
      description: 'Stories UX dans les raffinements',
      categories: ['product-design', 'frameworks', 'delivery'],
      relevantRoles: ['designer', 'product-owner', 'scrum-master']
    },
    {
      id: 'dev-design-collab',
      label: 'Collaborer avec les devs pour des solutions faisables',
      icon: '🤝',
      description: 'Ateliers Dev-Design, compromis créatifs',
      categories: ['product-design', 'animation', 'outils-tech'],
      relevantRoles: ['designer', 'dev-team']
    },

    // 🌱 CURIEUX / DÉBUTANT
    {
      id: 'why-agile-exists',
      label: 'Comprendre pourquoi l\'agilité existe',
      icon: '❓',
      description: 'Manifeste agile, problèmes résolus',
      categories: ['fondamentaux', 'ressources', 'frameworks'],
      relevantRoles: ['curious']
    },
    {
      id: 'experiment-personal-project',
      label: 'Expérimenter sur un projet perso',
      icon: '🧪',
      description: 'Appliquer Scrum à l\'organisation d\'un événement',
      categories: ['fondamentaux', 'frameworks', 'ressources'],
      relevantRoles: ['curious']
    },
    {
      id: 'read-practical-resources',
      label: 'Lire des ressources pratiques',
      icon: '📚',
      description: 'Scrum Guide, Agile Retrospectives, blogs',
      categories: ['ressources', 'fondamentaux', 'developpement-coach'],
      relevantRoles: ['curious', 'dev-team', 'designer']
    },
    {
      id: 'join-community',
      label: 'Rejoindre une communauté agile',
      icon: '👥',
      description: 'Meetups, Slack/Discord, conférences',
      categories: ['ressources', 'developpement-coach', 'transformation'],
      relevantRoles: ['curious', 'scrum-master', 'coach-agile']
    },
    {
      id: 'distinguish-frameworks',
      label: 'Distinguer les frameworks agiles',
      icon: '🔍',
      description: 'Scrum, Kanban, SAFe - quel cadre pour quel problème ?',
      categories: ['fondamentaux', 'frameworks', 'ressources'],
      relevantRoles: ['curious', 'manager']
    },

    // 🌿 OBJECTIFS TRANSVERSES
    {
      id: 'team-wellbeing',
      label: 'Améliorer le bien-être et l\'énergie d\'équipe',
      icon: '🌿',
      description: 'Enquêtes eNPS, lutte contre le burnout, WIP limits',
      categories: ['gestion-defis', 'leadership', 'animation'],
      relevantRoles: ['scrum-master', 'coach-agile', 'manager', 'rh']
    },
    {
      id: 'develop-skills-universal',
      label: 'Développer mes compétences agiles',
      icon: '📚',
      description: 'Formation continue, certifications, pratique',
      categories: ['developpement-coach', 'leadership', 'ressources'],
      relevantRoles: ['scrum-master', 'coach-agile', 'product-owner', 'dev-team', 'manager', 'rh', 'data', 'designer', 'curious']
    }
  ],

  contexts: [
    // 🌍 ORGANISATION DU TRAVAIL
    {
      id: 'remote',
      label: 'Équipe distante / hybride',
      icon: '🌍',
      description: 'Collaboration asynchrone, fuseaux horaires, outils digitaux',
      categories: ['outils-tech', 'animation', 'gestion-defis'],
      challenges: ['Communication', 'Cohésion', 'Rituels engageants']
    },
    {
      id: 'full-remote',
      label: 'Full remote (100% à distance)',
      icon: '💻',
      description: 'Équipe entièrement distribuée, jamais en présentiel',
      categories: ['outils-tech', 'animation', 'gestion-defis', 'leadership'],
      challenges: ['Isolement', 'Culture d\'équipe', 'Onboarding']
    },
    {
      id: 'colocated',
      label: 'Équipe colocalisée (même bureau)',
      icon: '🏢',
      description: 'Tous au même endroit, interactions physiques quotidiennes',
      categories: ['animation', 'frameworks', 'fondamentaux'],
      challenges: ['Distractions', 'Espaces de travail', 'Rituels efficaces']
    },

    // 🏗️ TAILLE & STRUCTURE
    {
      id: 'small-team',
      label: 'Petite équipe (3-5 personnes)',
      icon: '👥',
      description: 'Équipe réduite, polyvalence nécessaire',
      categories: ['frameworks', 'delivery', 'animation'],
      challenges: ['Polyvalence', 'Charge de travail', 'Rituels légers']
    },
    {
      id: 'large-team',
      label: 'Grande équipe (10+ personnes)',
      icon: '👨‍👩‍👧‍👦',
      description: 'Équipe nombreuse, besoin de coordination accrue',
      categories: ['multi-equipes', 'frameworks', 'animation'],
      challenges: ['Communication', 'Coordination', 'Sous-équipes']
    },
    {
      id: 'multi-teams',
      label: 'Plusieurs équipes interdépendantes',
      icon: '🔗',
      description: 'Coordination inter-équipes, dépendances, alignement',
      categories: ['multi-equipes', 'transformation', 'leadership'],
      challenges: ['Dépendances', 'Alignement', 'Synchronisation']
    },

    // 🏢 TYPE D'ORGANISATION
    {
      id: 'startup',
      label: 'Startup / Scale-up',
      icon: '⚡',
      description: 'Croissance rapide, pivots fréquents, ressources limitées',
      categories: ['contextes', 'delivery', 'product-design'],
      challenges: ['Vélocité', 'Priorisation', 'Dette technique']
    },
    {
      id: 'corporate',
      label: 'Grande entreprise',
      icon: '🏢',
      description: 'Processus établis, hiérarchie, transformation progressive',
      categories: ['transformation', 'multi-equipes', 'contextes'],
      challenges: ['Bureaucratie', 'Silos', 'Changement culturel']
    },
    {
      id: 'agency',
      label: 'Agence / ESN / Consulting',
      icon: '🎯',
      description: 'Projets clients multiples, deadlines serrées, équipes variables',
      categories: ['delivery', 'animation', 'gestion-defis'],
      challenges: ['Multitasking', 'Attentes clients', 'Turnover']
    },
    {
      id: 'public-sector',
      label: 'Secteur public / Administration',
      icon: '🏛️',
      description: 'Réglementations strictes, processus formels, budgets contraints',
      categories: ['transformation', 'contextes', 'gestion-defis'],
      challenges: ['Conformité', 'Processus lourds', 'Résistance']
    },

    // 🌱 MATURITÉ AGILE
    {
      id: 'new-team',
      label: 'Équipe nouvellement formée',
      icon: '🌱',
      description: 'Membres qui se découvrent, norming en cours',
      categories: ['fondamentaux', 'frameworks', 'animation'],
      challenges: ['Confiance', 'Normes d\'équipe', 'Rythme']
    },
    {
      id: 'agile-beginner',
      label: 'Débutant en agilité (< 6 mois)',
      icon: '🆕',
      description: 'Première expérience agile, apprentissage des bases',
      categories: ['fondamentaux', 'frameworks', 'ressources'],
      challenges: ['Compréhension', 'Adoption', 'Patience']
    },
    {
      id: 'agile-intermediate',
      label: 'Pratique agile intermédiaire (6-24 mois)',
      icon: '📈',
      description: 'Rituels en place, recherche d\'optimisation',
      categories: ['frameworks', 'delivery', 'animation'],
      challenges: ['Amélioration continue', 'Métriques', 'Scaling']
    },
    {
      id: 'agile-mature',
      label: 'Équipe agile mature (2+ ans)',
      icon: '🏆',
      description: 'Pratiques ancrées, autonomie élevée, innovation',
      categories: ['developpement-coach', 'leadership', 'multi-equipes'],
      challenges: ['Stagnation', 'Complaisance', 'Évolution']
    },

    // 🚧 DÉFIS SPÉCIFIQUES
    {
      id: 'resistance',
      label: 'Résistance au changement',
      icon: '🛡️',
      description: 'Opposition active ou passive, scepticisme',
      categories: ['gestion-defis', 'transformation', 'leadership'],
      challenges: ['Convaincre', 'Accompagner', 'Prouver la valeur']
    },
    {
      id: 'technical-debt',
      label: 'Dette technique importante',
      icon: '⚠️',
      description: 'Code legacy, architecture fragile, tests insuffisants',
      categories: ['outils-tech', 'delivery', 'gestion-defis'],
      challenges: ['Refactoring', 'Qualité', 'Équilibre features/dette']
    },
    {
      id: 'high-pressure',
      label: 'Forte pression / Deadlines serrées',
      icon: '⏰',
      description: 'Urgences fréquentes, stress élevé, burnout risk',
      categories: ['gestion-defis', 'leadership', 'delivery'],
      challenges: ['Priorisation', 'Bien-être', 'Qualité vs. vitesse']
    },
    {
      id: 'low-engagement',
      label: 'Faible engagement d\'équipe',
      icon: '😴',
      description: 'Motivation basse, turnover élevé, absentéisme',
      categories: ['gestion-defis', 'leadership', 'animation'],
      challenges: ['Remotivation', 'Reconnaissance', 'Sens du travail']
    },
    {
      id: 'skill-gaps',
      label: 'Écarts de compétences importants',
      icon: '📚',
      description: 'Niveaux hétérogènes, besoin de formation, mentoring',
      categories: ['ressources', 'developpement-coach', 'leadership'],
      challenges: ['Formation', 'Pair programming', 'Montée en compétences']
    },

    // 🎯 CONTEXTE PRODUIT
    {
      id: 'b2b',
      label: 'Produit B2B (entreprises)',
      icon: '🏢',
      description: 'Clients entreprises, cycles longs, contrats complexes',
      categories: ['product-design', 'delivery', 'contextes'],
      challenges: ['Feedback utilisateur', 'Customisation', 'Support']
    },
    {
      id: 'b2c',
      label: 'Produit B2C (grand public)',
      icon: '👤',
      description: 'Utilisateurs finaux, UX critique, volume élevé',
      categories: ['product-design', 'delivery', 'outils-tech'],
      challenges: ['Scalabilité', 'UX', 'Feedback rapide']
    },
    {
      id: 'regulated',
      label: 'Secteur réglementé (santé, finance, etc.)',
      icon: '⚖️',
      description: 'Conformité stricte, audits, documentation obligatoire',
      categories: ['contextes', 'gestion-defis', 'delivery'],
      challenges: ['Compliance', 'Documentation', 'Processus rigides']
    },

    // 🔄 TRANSFORMATION
    {
      id: 'waterfall-to-agile',
      label: 'Transition Waterfall → Agile',
      icon: '🔄',
      description: 'Changement de paradigme, désapprentissage nécessaire',
      categories: ['transformation', 'fondamentaux', 'gestion-defis'],
      challenges: ['Mindset', 'Processus', 'Outils']
    },
    {
      id: 'scaling-agile',
      label: 'Passage à l\'échelle en cours',
      icon: '📈',
      description: 'Croissance rapide, multiplication des équipes',
      categories: ['multi-equipes', 'transformation', 'frameworks'],
      challenges: ['Coordination', 'Culture', 'Frameworks (SAFe, LeSS)']
    },

    // ⚙️ CONTEXTE STANDARD
    {
      id: 'standard',
      label: 'Contexte standard / Pas de spécificité',
      icon: '⚙️',
      description: 'Situation classique sans contrainte particulière',
      categories: [],
      challenges: []
    }
  ]
};

/**
 * Initialiser le wizard
 */
function initWizard() {
  console.log('🧙 Initialisation du wizard');

  // Reset state
  WizardState.currentStep = 1;
  WizardState.answers = { role: null, goal: null, context: [] };

  // Réafficher la question et le sous-titre
  const questionEl = document.querySelector('.wizard-question');
  const subtitleEl = document.querySelector('.wizard-question-subtitle');
  if (questionEl) questionEl.style.display = 'block';
  if (subtitleEl) subtitleEl.style.display = 'block';

  // Rendre les options de la première étape
  renderWizardStep(1);

  // Event listeners
  setupWizardListeners();
}

/**
 * Configuration des event listeners du wizard
 */
function setupWizardListeners() {
  // Bouton Retour
  const backBtn = document.getElementById('wizardBack');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (WizardState.currentStep > 1) {
        goToWizardStep(WizardState.currentStep - 1);
      }
    });
  }

  // Bouton Passer
  const skipBtn = document.getElementById('wizardSkip');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      // Passer à l'étape suivante sans sélection
      if (WizardState.currentStep < WizardState.maxSteps) {
        goToWizardStep(WizardState.currentStep + 1);
      } else {
        // Dernière étape : afficher les résultats même sans sélection
        showWizardResults();
      }
    });
  }

  // Bouton "Passer le wizard" (final)
  const skipWizardBtn = document.getElementById('skipWizard');
  if (skipWizardBtn) {
    skipWizardBtn.addEventListener('click', () => {
      completeWizard(true);
    });
  }

  // Bouton Recommencer
  const restartBtn = document.getElementById('restartWizard');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      initWizard();
    });
  }

  // Bouton "Voir les recommandations"
  const nextBtn = document.getElementById('wizardNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showWizardResults();
    });
  }
}

/**
 * Filtrer les objectifs selon le rôle sélectionné
 */
function getFilteredGoals() {
  const selectedRole = WizardState.answers.role;

  // Si aucun rôle sélectionné, afficher tous les objectifs
  if (!selectedRole) {
    return WizardOptions.goals;
  }

  // Filtrer les objectifs pertinents pour le rôle
  const filtered = WizardOptions.goals.filter(goal => {
    return goal.relevantRoles && goal.relevantRoles.includes(selectedRole);
  });

  // Si aucun objectif trouvé (ne devrait pas arriver), retourner tous les objectifs
  return filtered.length > 0 ? filtered : WizardOptions.goals;
}

/**
 * Rendre une étape du wizard
 */
function renderWizardStep(step) {
  WizardState.currentStep = step;

  // Cacher toutes les étapes
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));

  // Afficher l'étape courante
  const currentStepEl = document.getElementById(`wizardStep${step}`);
  if (currentStepEl) {
    currentStepEl.classList.add('active');
  }

  // Mettre à jour la barre de progression
  updateProgressBar(step);

  // Mettre à jour les boutons de navigation
  updateWizardButtons(step);

  // Rendre les options selon l'étape
  switch (step) {
    case 1:
      renderWizardQuestion('Quel est votre rôle ?');
      renderOptions('role', WizardOptions.roles);
      break;
    case 2:
      renderWizardQuestion('Quel est votre objectif principal ?');
      // Filtrer les objectifs selon le rôle sélectionné
      const filteredGoals = getFilteredGoals();
      renderOptions('goal', filteredGoals);
      break;
    case 3:
      renderWizardQuestion('Quel est votre contexte ?', 'Vous pouvez sélectionner plusieurs options');
      renderOptions('context', WizardOptions.contexts);
      break;
  }
}

/**
 * Rendre la question du wizard
 */
function renderWizardQuestion(question, subtitle = '') {
  const questionEl = document.querySelector('.wizard-question');
  if (questionEl) {
    questionEl.textContent = question;
  }

  // Ajouter ou mettre à jour le sous-titre
  let subtitleEl = document.querySelector('.wizard-question-subtitle');
  if (subtitle) {
    if (!subtitleEl) {
      subtitleEl = document.createElement('p');
      subtitleEl.className = 'wizard-question-subtitle';
      questionEl.parentNode.insertBefore(subtitleEl, questionEl.nextSibling);
    }
    subtitleEl.textContent = subtitle;
    subtitleEl.style.display = 'block';
  } else if (subtitleEl) {
    subtitleEl.style.display = 'none';
  }
}

/**
 * Rendre les options d'une étape
 */
function renderOptions(type, options) {
  const containerId = `${type}Options`;
  const container = document.getElementById(containerId);

  if (!container) return;

  // Pour le contexte (sélection multiple), vérifier si l'option est dans le tableau
  const isSelected = (optionId) => {
    if (type === 'context') {
      return WizardState.answers.context.includes(optionId);
    }
    return WizardState.answers[type] === optionId;
  };

  container.innerHTML = options.map(option => `
    <button class="wizard-option ${isSelected(option.id) ? 'selected' : ''}" 
            data-type="${type}" 
            data-value="${option.id}">
      <div class="option-icon">${option.icon}</div>
      <div class="option-label">${option.label}</div>
      ${option.description ? `<p class="option-description">${option.description}</p>` : ''}
    </button>
  `).join('');

  // Event listeners sur les options
  container.querySelectorAll('.wizard-option').forEach(btn => {
    btn.addEventListener('click', () => handleOptionClick(btn));
  });
}

/**
 * Gérer le clic sur une option
 */
function handleOptionClick(button) {
  const type = button.dataset.type;
  const value = button.dataset.value;

  // Étape 3 (contexte) : sélection multiple
  if (type === 'context') {
    const currentContexts = WizardState.answers.context;
    const index = currentContexts.indexOf(value);

    if (index > -1) {
      // Désélectionner
      currentContexts.splice(index, 1);
      button.classList.remove('selected');
    } else {
      // Sélectionner
      currentContexts.push(value);
      button.classList.add('selected');
    }

    // Afficher le bouton "Suivant" si au moins 1 sélection
    updateNextButton();

  } else {
    // Étapes 1 et 2 : sélection unique
    WizardState.answers[type] = value;

    // Mettre à jour visuellement
    button.parentElement.querySelectorAll('.wizard-option').forEach(btn => {
      btn.classList.remove('selected');
    });
    button.classList.add('selected');

    // Passer à l'étape suivante après un court délai
    setTimeout(() => {
      if (WizardState.currentStep < WizardState.maxSteps) {
        goToWizardStep(WizardState.currentStep + 1);
      }
    }, 400);
  }
}

/**
 * Mettre à jour le bouton "Suivant" pour l'étape 3
 */
function updateNextButton() {
  const nextBtn = document.getElementById('wizardNext');
  if (!nextBtn) return;

  // Toujours afficher le bouton à l'étape 3, même sans sélection
  nextBtn.style.display = 'inline-flex';
  nextBtn.disabled = false;
}

/**
 * Aller à une étape spécifique
 */
function goToWizardStep(step) {
  if (step < 1 || step > WizardState.maxSteps + 1) return;

  renderWizardStep(step);
}

/**
 * Mettre à jour la barre de progression
 */
function updateProgressBar(step) {
  document.querySelectorAll('.progress-step').forEach((el, index) => {
    if (index + 1 <= step) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

/**
 * Mettre à jour les boutons de navigation
 */
function updateWizardButtons(step) {
  const backBtn = document.getElementById('wizardBack');
  const skipBtn = document.getElementById('wizardSkip');
  const nextBtn = document.getElementById('wizardNext');

  if (backBtn) {
    backBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  }

  if (skipBtn) {
    skipBtn.style.display = step <= WizardState.maxSteps ? 'inline-flex' : 'none';
  }

  // Bouton "Suivant" uniquement pour l'étape 3 (contexte)
  if (nextBtn) {
    if (step === 3) {
      // Toujours afficher le bouton "Voir les recommandations" à l'étape 3
      nextBtn.style.display = 'inline-flex';
      nextBtn.disabled = false;
    } else {
      nextBtn.style.display = 'none';
    }
  }
}

/**
 * Afficher les résultats du wizard
 */
function showWizardResults() {
  // Cacher les étapes
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));

  // Afficher les résultats
  const resultsStep = document.getElementById('wizardResults');
  if (resultsStep) {
    resultsStep.classList.add('active');
  }

  // Calculer les catégories recommandées
  const recommendations = calculateRecommendations();

  // Rendre les résultats
  renderResults(recommendations);

  // Masquer la question et le sous-titre
  const questionEl = document.querySelector('.wizard-question');
  const subtitleEl = document.querySelector('.wizard-question-subtitle');
  if (questionEl) questionEl.style.display = 'none';
  if (subtitleEl) subtitleEl.style.display = 'none';

  // Cacher les boutons de navigation
  const backBtn = document.getElementById('wizardBack');
  const skipBtn = document.getElementById('wizardSkip');
  const nextBtn = document.getElementById('wizardNext');

  if (backBtn) backBtn.style.display = 'none';
  if (skipBtn) skipBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
}

/**
 * Calculer les recommandations selon les réponses
 */
function calculateRecommendations() {
  const { role, goal, context } = WizardState.answers;

  // Récupérer les catégories associées à chaque réponse
  const roleCategories = WizardOptions.roles.find(r => r.id === role)?.categories || [];
  const goalCategories = WizardOptions.goals.find(g => g.id === goal)?.categories || [];

  // Pour le contexte, fusionner toutes les catégories des contextes sélectionnés
  const contextCategories = [];
  context.forEach(contextId => {
    const contextOption = WizardOptions.contexts.find(c => c.id === contextId);
    if (contextOption) {
      contextCategories.push(...contextOption.categories);
    }
  });

  // Fusionner et compter les occurrences
  const allCategories = [...roleCategories, ...goalCategories, ...contextCategories];
  const categoryCounts = {};

  allCategories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Trier par pertinence (nombre d'occurrences)
  const sorted = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  // Retourner les 5 premières
  return sorted.slice(0, 5);
}

/**
 * Rendre les résultats
 */
function renderResults(recommendations) {
  const container = document.getElementById('resultsContainer');
  if (!container || !AppState.config) return;

  // Vérifier si aucune sélection n'a été faite
  const { role, goal, context } = WizardState.answers;
  const hasNoSelection = !role && !goal && context.length === 0;

  // Afficher le récapitulatif des sélections
  renderSelectionSummary();

  if (hasNoSelection) {
    // Message convivial si aucun choix n'a été fait
    container.innerHTML = `
      <div class="empty-results">
        <div class="empty-icon">🤔</div>
        <h3 class="empty-title">Vous n'avez fait aucune sélection</h3>
        <p class="empty-description">
          Pour obtenir des recommandations personnalisées, nous avons besoin d'en savoir un peu plus sur vous.
        </p>
        <div class="empty-suggestions">
          <h4 class="suggestions-title">💡 Quelques questions pour vous guider :</h4>
          <ul class="suggestions-list">
            <li><strong>Quel est votre rôle ?</strong> Êtes-vous Scrum Master, Product Owner, développeur, ou simplement curieux de découvrir l'agilité ?</li>
            <li><strong>Quel est votre objectif ?</strong> Souhaitez-vous améliorer la collaboration, démarrer une transformation, ou faciliter des événements ?</li>
            <li><strong>Quel est votre contexte ?</strong> Travaillez-vous en remote, dans une startup, ou faites-vous face à de la résistance au changement ?</li>
          </ul>
        </div>
        <div class="empty-actions">
          <button class="btn btn-primary" onclick="initWizard()">
            🔄 Recommencer le guide
          </button>
          <a href="category.html?cat=fondamentaux" class="btn btn-secondary">
            📚 Explorer les fondamentaux
          </a>
        </div>
      </div>
    `;
    return;
  }

  if (recommendations.length === 0) {
    // Message si des sélections ont été faites mais pas de recommandations
    container.innerHTML = `
      <div class="empty-results">
        <div class="empty-icon">🎯</div>
        <h3 class="empty-title">Aucune recommandation spécifique</h3>
        <p class="empty-description">
          Vos réponses ne correspondent pas à des catégories précises, mais ne vous inquiétez pas !
        </p>
        <div class="empty-actions">
          <button class="btn btn-primary" onclick="initWizard()">
            🔄 Recommencer avec d'autres choix
          </button>
          <a href="category.html?cat=fondamentaux" class="btn btn-secondary">
            📚 Explorer toutes les catégories
          </a>
        </div>
      </div>
    `;
    return;
  }

  const categories = AppState.config.categories;

  // Récupérer les outils et templates pour les catégories recommandées
  const toolsAndTemplates = getToolsAndTemplatesForCategories(recommendations);

  // Construire le HTML avec sections groupées
  let html = '';

  // Section Catégories
  html += `
    <div class="results-section">
      <h3 class="results-section-title">
        <span class="section-icon">📚</span>
        Catégories recommandées
      </h3>
      <div class="results-section-grid">
  `;

  recommendations.forEach(rec => {
    const cat = categories.find(c => c.id === rec.id);
    if (!cat) return;

    html += `
      <a href="category.html?cat=${cat.id}" class="result-card result-card-category">
        <div class="result-icon" style="background-color: ${cat.color}20; color: ${cat.color};">
          ${cat.emoji}
        </div>
        <div class="result-content">
          <h3 class="result-title">${cat.title}</h3>
          <p class="result-subtitle">${cat.subtitle}</p>
        </div>
        <div class="result-score">
          ${'⭐'.repeat(Math.min(rec.score, 3))}
        </div>
      </a>
    `;
  });

  html += `
      </div>
    </div>
  `;

  // Section Outils
  if (toolsAndTemplates.tools.length > 0) {
    html += `
      <div class="results-section">
        <h3 class="results-section-title">
          <span class="section-icon">🛠️</span>
          Outils recommandés
        </h3>
        <div class="results-section-grid results-section-grid-compact">
    `;

    toolsAndTemplates.tools.forEach(tool => {
      html += `
        <a href="${tool.url}" class="result-card result-card-tool" target="_blank" rel="noopener">
          <div class="result-icon result-icon-tool">
            ${tool.icon || '🔧'}
          </div>
          <div class="result-content">
            <h4 class="result-title">${tool.title}</h4>
            <p class="result-subtitle">${tool.description || ''}</p>
          </div>
          <div class="result-badge">Outil</div>
        </a>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  // Section Templates
  if (toolsAndTemplates.templates.length > 0) {
    html += `
      <div class="results-section">
        <h3 class="results-section-title">
          <span class="section-icon">📄</span>
          Templates recommandés
        </h3>
        <div class="results-section-grid results-section-grid-compact">
    `;

    toolsAndTemplates.templates.forEach(template => {
      html += `
        <a href="${template.url}" class="result-card result-card-template" target="_blank" rel="noopener">
          <div class="result-icon result-icon-template">
            ${template.icon || '📋'}
          </div>
          <div class="result-content">
            <h4 class="result-title">${template.title}</h4>
            <p class="result-subtitle">${template.description || ''}</p>
          </div>
          <div class="result-badge">Template</div>
        </a>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Récupérer les outils et templates pour les catégories recommandées
 */
function getToolsAndTemplatesForCategories(recommendations) {
  const tools = [];
  const templates = [];

  // Mapping des catégories vers les outils et templates
  const categoryMapping = {
    'fondamentaux': {
      tools: [
        { title: 'Agile Fluency', icon: '🎯', url: '/tools/agile-fluency/', description: 'Évaluer la maturité agile de votre équipe' }
      ],
      templates: []
    },
    'frameworks': {
      tools: [
        { title: 'Planning Poker', icon: '🃏', url: '/tools/planning-poker/', description: 'Estimer la complexité des user stories' },
        { title: 'Velocity Squad', icon: '📊', url: '/tools/velocity-squad/', description: 'Suivre la vélocité de votre équipe' }
      ],
      templates: []
    },
    'product-design': {
      tools: [
        { title: 'Example Mapping', icon: '🗺️', url: '/tools/example-mapping/', description: 'Clarifier les user stories avec des exemples' },
        { title: 'Ikigai', icon: '🎯', url: '/tools/ikigai/', description: 'Trouver le sens et la raison d\'être' }
      ],
      templates: []
    },
    'leadership-coaching': {
      tools: [
        { title: 'Delegation Poker', icon: '🎴', url: '/tools/delegation-poker/', description: 'Clarifier les niveaux de délégation' },
        { title: 'Skills Matrix', icon: '📊', url: '/tools/skills-matrix/', description: 'Cartographier les compétences de l\'équipe' }
      ],
      templates: []
    },
    'multi-equipes-scale': {
      tools: [
        { title: 'Stakeholder Mapping', icon: '🗺️', url: '/tools/stakeholder-mapping/', description: 'Cartographier les parties prenantes' }
      ],
      templates: []
    },
    'gestion-defis': {
      tools: [
        { title: 'Ikigai Engagement', icon: '💡', url: '/tools/ikigai-engagement/', description: 'Améliorer l\'engagement de l\'équipe' }
      ],
      templates: []
    }
  };

  // Parcourir les recommandations et collecter les outils/templates
  recommendations.forEach(rec => {
    const mapping = categoryMapping[rec.id];
    if (mapping) {
      tools.push(...mapping.tools);
      templates.push(...mapping.templates);
    }
  });

  // Limiter à 6 outils et 6 templates maximum
  return {
    tools: tools.slice(0, 6),
    templates: templates.slice(0, 6)
  };
}

/**
 * Afficher le récapitulatif des sélections
 */
function renderSelectionSummary() {
  const summaryContainer = document.getElementById('selectionSummary');
  if (!summaryContainer) return;

  const { role, goal, context } = WizardState.answers;

  // Récupérer les labels
  const roleLabel = WizardOptions.roles.find(r => r.id === role)?.label || '';
  const roleIcon = WizardOptions.roles.find(r => r.id === role)?.icon || '';

  const goalLabel = WizardOptions.goals.find(g => g.id === goal)?.label || '';
  const goalIcon = WizardOptions.goals.find(g => g.id === goal)?.icon || '';

  const contextLabels = context.map(ctxId => {
    const ctx = WizardOptions.contexts.find(c => c.id === ctxId);
    return ctx ? { label: ctx.label, icon: ctx.icon } : null;
  }).filter(Boolean);

  summaryContainer.innerHTML = `
    <div class="selection-summary">
      <p class="summary-intro">Basé sur votre profil :</p>
      <div class="summary-badges">
        <span class="summary-badge summary-badge-role">
          <span class="badge-icon">${roleIcon}</span>
          ${roleLabel}
        </span>
        <span class="summary-badge summary-badge-goal">
          <span class="badge-icon">${goalIcon}</span>
          ${goalLabel}
        </span>
        ${contextLabels.map(ctx => `
          <span class="summary-badge summary-badge-context">
            <span class="badge-icon">${ctx.icon}</span>
            ${ctx.label}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Compléter le wizard
 */
function completeWizard(skipped = false) {
  // Redémarrer le wizard au lieu de fermer
  initWizard();

  console.log(`🔄 Wizard redémarré`);
}

console.log('✅ wizard.js chargé');
