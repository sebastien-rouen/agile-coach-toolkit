/**
 * Tools Data Structure
 * Contains all tool information for the Agile Coach Toolkit
 */

const TOOLS_DATA = [
  {
    id: 'example-mapping',
    name: 'Example Mapping',
    description: 'Exploration collaborative des user stories avec règles et exemples concrets',
    longDescription: 'L\'Example Mapping permet de structurer les conversations autour des critères d\'acceptation des User Stories en 25 minutes maximum, en utilisant des exemples concrets pour clarifier les règles métier.',
    status: 'stable',
    category: 'exploration',
    tags: ['collaboration', 'user-stories', 'exploration', 'critères-acceptation'],
    demoUrl: 'tools/example-mapping/',
    path: 'tools/example-mapping/',
    icon: '🗺️',
    screenshot: 'assets/images/screenshots/example-mapping.png',
    features: [
      'Organisation par couleurs (Stories, Règles, Exemples, Questions)',
      'Exemples pré-remplis par domaine métier',
      'Export JSON et JIRA',
      'Interface collaborative temps réel',
      'Guide intégré avec bonnes pratiques'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2024-01-15'),
    version: '1.2.0'
  },
  {
    id: 'planning-poker',
    name: 'Planning Poker',
    description: 'Estimation collaborative avec sessions temps réel et différentes échelles',
    longDescription: 'Outil d\'estimation collaborative qui permet aux équipes Agile d\'estimer l\'effort nécessaire pour réaliser des User Stories en utilisant différentes échelles (Fibonacci, T-Shirt, etc.).',
    status: 'stable',
    category: 'estimation',
    tags: ['estimation', 'temps-réel', 'multi-joueurs', 'fibonacci', 'collaboration'],
    demoUrl: 'tools/planning-poker/',
    path: 'tools/planning-poker/',
    icon: '🎲',
    screenshot: 'assets/images/screenshots/planning-poker.png',
    features: [
      'Sessions multi-joueurs en temps réel',
      'Différentes échelles (Fibonacci, T-Shirt, Heures)',
      'Statistiques et consensus automatique',
      'Historique des estimations',
      'Discussion intégrée avec questions'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '1.1.0'
  },
  {
    id: 'agile-fluency',
    name: 'Agile Fluency',
    description: '',
    longDescription: '',
    status: 'stable',
    category: 'estimation',
    tags: ['collaboration', 'maturite'],
    demoUrl: 'tools/agile-fluency/',
    path: 'tools/agile-fluency/',
    icon: '🗺️',
    screenshot: 'assets/images/screenshots/agile-fluency.png',
    features: [
      ''
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '1.1.0'
  },
  {
    id: 'velocity-squad',
    name: 'Velocity squad',
    description: '',
    longDescription: '',
    status: 'stable',
    category: 'estimation',
    tags: ['velocité', 'squad'],
    demoUrl: 'tools/velocity-squad/',
    path: 'tools/velocity-squad/',
    icon: '🗺️',
    screenshot: 'assets/images/screenshots/velocity-squad.png',
    features: [
      ''
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '1.1.0'
  },
  {
    id: 'user-stories',
    name: 'User Stories',
    description: 'Création et gestion des user stories avec templates et critères d\'acceptation',
    longDescription: 'Éditeur complet pour créer, gérer et organiser vos user stories avec des templates prédéfinis, critères d\'acceptation et liens vers les tests.',
    status: 'beta',
    category: 'documentation',
    tags: ['templates', 'critères', 'gestion', 'user-stories', 'documentation'],
    demoUrl: null,
    path: 'tools/user-stories/',
    icon: '📝',
    screenshot: 'assets/images/screenshots/user-stories.png',
    features: [
      'Templates de user stories prédéfinis',
      'Éditeur de critères d\'acceptation',
      'Gestion des épics et thèmes',
      'Export vers différents formats',
      'Intégration avec outils d\'estimation'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '0.8.0'
  },
  {
    id: 'retrospectives',
    name: 'Rétrospectives',
    description: 'Animation de rétros avec différents formats (Mad/Sad/Glad, Start/Stop/Continue)',
    longDescription: 'Outil d\'animation de rétrospectives avec plusieurs formats populaires, système de vote et génération automatique de plans d\'action.',
    status: 'beta',
    category: 'retrospective',
    tags: ['formats-multiples', 'animation', 'collaboration', 'retrospective', 'amélioration'],
    demoUrl: null,
    path: 'tools/retrospectives/',
    icon: '🔄',
    screenshot: 'assets/images/screenshots/retrospectives.png',
    features: [
      'Formats multiples (Mad/Sad/Glad, Start/Stop/Continue, etc.)',
      'Système de vote et priorisation',
      'Génération automatique de plans d\'action',
      'Historique des rétrospectives',
      'Templates personnalisables'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '0.6.0'
  },
  {
    id: 'sprint-board',
    name: 'Sprint Board',
    description: 'Tableau Kanban visuel avec drag\'n drop pour le suivi de sprint',
    longDescription: 'Tableau Kanban interactif pour visualiser et gérer le flux de travail pendant les sprints avec drag & drop, métriques et burndown chart.',
    status: 'alpha',
    category: 'tracking',
    tags: ['kanban', 'drag-drop', 'sprint', 'suivi', 'métriques'],
    demoUrl: null,
    path: 'tools/sprint-board/',
    icon: '📋',
    screenshot: 'assets/images/screenshots/sprint-board.png',
    features: [
      'Interface drag & drop intuitive',
      'Colonnes personnalisables',
      'Métriques de sprint en temps réel',
      'Burndown chart automatique',
      'Intégration avec Planning Poker'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '0.3.0'
  },
  {
    id: 'team-health-check',
    name: 'Team Health Check',
    description: 'Évaluation de la santé d\'équipe avec radar chart et recommandations',
    longDescription: 'Outil d\'évaluation de la santé d\'équipe basé sur le modèle Spotify avec visualisation radar et recommandations d\'amélioration personnalisées.',
    status: 'alpha',
    category: 'assessment',
    tags: ['santé-équipe', 'évaluation', 'radar-chart', 'spotify-model', 'amélioration'],
    demoUrl: null,
    path: 'tools/team-health-check/',
    icon: '💚',
    screenshot: 'assets/images/screenshots/team-health-check.png',
    features: [
      'Modèle d\'évaluation Spotify',
      'Visualisation radar interactive',
      'Recommandations personnalisées',
      'Suivi de l\'évolution dans le temps',
      'Export des résultats'
    ],
    requirements: ['Navigateur moderne', 'JavaScript activé'],
    lastUpdated: new Date('2025-07-30'),
    version: '0.2.0'
  }
];

// Status definitions
const TOOL_STATUS = {
  stable: {
    label: '✅ Stable',
    description: 'Outil testé et prêt pour la production',
    color: 'success'
  },
  beta: {
    label: '🚧 Bêta',
    description: 'Outil en phase de test, fonctionnalités principales disponibles',
    color: 'warning'
  },
  alpha: {
    label: '⚠️ Alpha',
    description: 'Outil en développement, fonctionnalités limitées',
    color: 'danger'
  }
};

// Category definitions
const TOOL_CATEGORIES = {
  exploration: {
    label: 'Exploration',
    description: 'Outils pour explorer et clarifier les besoins',
    icon: '🔍'
  },
  estimation: {
    label: 'Estimation',
    description: 'Outils pour estimer l\'effort et la complexité',
    icon: '📊'
  },
  documentation: {
    label: 'Documentation',
    description: 'Outils pour documenter et organiser',
    icon: '📝'
  },
  retrospective: {
    label: 'Rétrospective',
    description: 'Outils pour l\'amélioration continue',
    icon: '🔄'
  },
  tracking: {
    label: 'Suivi',
    description: 'Outils pour suivre l\'avancement',
    icon: '📈'
  },
  assessment: {
    label: 'Évaluation',
    description: 'Outils pour évaluer et mesurer',
    icon: '📋'
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOOLS_DATA, TOOL_STATUS, TOOL_CATEGORIES };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.TOOLS_DATA = TOOLS_DATA;
  window.TOOL_STATUS = TOOL_STATUS;
  window.TOOL_CATEGORIES = TOOL_CATEGORIES;
}