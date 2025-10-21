/**
 * Mission Tracker - Configuration par rôle
 * Définition des rôles et leurs spécificités
 */

export const ROLES_CONFIG = {
  scrum_master: {
    id: 'scrum_master',
    name: 'Scrum Master',
    icon: '🎯',
    color: '#3b82f6',
    description: 'Facilitateur et gardien du cadre Scrum',
    
    focus_areas: [
      'Facilitation des cérémonies',
      'Amélioration continue',
      'Levée des blocages',
      'Coaching d\'équipe',
      'Protection de l\'équipe'
    ],
    
    key_metrics: [
      { id: 'velocity', name: 'Vélocité moyenne', unit: 'points', type: 'number' },
      { id: 'sprint_goal', name: 'Atteinte des sprint goals', unit: '%', type: 'percentage' },
      { id: 'blockers', name: 'Temps moyen de résolution des blocages', unit: 'heures', type: 'duration' },
      { id: 'ceremonies', name: 'Satisfaction cérémonies', unit: '/5', type: 'rating' },
      { id: 'team_mood', name: 'Moral de l\'équipe', unit: '/5', type: 'rating' }
    ],
    
    suggested_objectives: [
      'Améliorer la vélocité de X%',
      'Réduire le temps de résolution des blocages',
      'Atteindre X% de sprint goals',
      'Augmenter la satisfaction des cérémonies',
      'Améliorer le moral de l\'équipe'
    ],
    
    report_questions: {
      context: [
        'Quelle est la maturité agile de l\'équipe ?',
        'Quelle est la composition de l\'équipe ?',
        'Quels sont les principaux défis identifiés ?'
      ],
      what_works: [
        'Quelles cérémonies fonctionnent bien ?',
        'Quelles pratiques sont adoptées par l\'équipe ?',
        'Quels sont les points forts de l\'équipe ?'
      ],
      pain_points: [
        'Quels blocages récurrents rencontrez-vous ?',
        'Quelles difficultés dans l\'adoption des pratiques agiles ?',
        'Quels problèmes de communication ou collaboration ?'
      ],
      opportunities: [
        'Quelles améliorations rapides sont possibles ?',
        'Quelles nouvelles pratiques pourraient être testées ?',
        'Quels leviers pour augmenter la performance ?'
      ]
    },
    
    recommended_events: [
      { type: 'success', label: 'Sprint goal atteint' },
      { type: 'failure', label: 'Sprint goal manqué' },
      { type: 'learning', label: 'Amélioration identifiée en rétro' },
      { type: 'decision', label: 'Nouvelle pratique adoptée' },
      { type: 'attempt', label: 'Expérimentation lancée' }
    ]
  },
  
  agile_coach: {
    id: 'agile_coach',
    name: 'Agile Coach',
    icon: '🚀',
    color: '#8b5cf6',
    description: 'Coach de transformation agile',
    
    focus_areas: [
      'Transformation organisationnelle',
      'Coaching d\'équipes et de managers',
      'Évolution culturelle',
      'Scaling agile',
      'Mesure de la maturité'
    ],
    
    key_metrics: [
      { id: 'maturity', name: 'Niveau de maturité agile', unit: '/5', type: 'rating' },
      { id: 'adoption', name: 'Taux d\'adoption des pratiques', unit: '%', type: 'percentage' },
      { id: 'coaching_sessions', name: 'Sessions de coaching', unit: 'nombre', type: 'number' },
      { id: 'culture', name: 'Évolution culturelle', unit: '/5', type: 'rating' },
      { id: 'autonomy', name: 'Autonomie des équipes', unit: '/5', type: 'rating' }
    ],
    
    suggested_objectives: [
      'Augmenter la maturité agile de X niveaux',
      'Former X personnes aux pratiques agiles',
      'Améliorer l\'autonomie des équipes',
      'Mettre en place une communauté de pratiques',
      'Faciliter l\'évolution culturelle'
    ],
    
    report_questions: {
      context: [
        'Quel est le contexte de transformation ?',
        'Quel est le niveau de maturité actuel ?',
        'Quels sont les objectifs de la transformation ?'
      ],
      what_works: [
        'Quelles initiatives de transformation fonctionnent ?',
        'Quels sponsors soutiennent le changement ?',
        'Quelles équipes sont motrices ?'
      ],
      pain_points: [
        'Quelles résistances au changement rencontrez-vous ?',
        'Quels freins organisationnels ?',
        'Quelles tensions culturelles ?'
      ],
      opportunities: [
        'Quels quick wins pour créer de l\'élan ?',
        'Quels ambassadeurs potentiels ?',
        'Quelles opportunités de scaling ?'
      ]
    },
    
    recommended_events: [
      { type: 'success', label: 'Équipe autonome' },
      { type: 'learning', label: 'Insight coaching' },
      { type: 'decision', label: 'Changement organisationnel' },
      { type: 'attempt', label: 'Nouvelle initiative' }
    ]
  },
  
  product_owner: {
    id: 'product_owner',
    name: 'Product Owner',
    icon: '📦',
    color: '#10b981',
    description: 'Responsable de la vision produit et du backlog',
    
    focus_areas: [
      'Vision et stratégie produit',
      'Gestion du backlog',
      'Priorisation de la valeur',
      'Relation avec les stakeholders',
      'Mesure de la valeur livrée'
    ],
    
    key_metrics: [
      { id: 'value_delivered', name: 'Valeur livrée', unit: '€', type: 'currency' },
      { id: 'user_satisfaction', name: 'Satisfaction utilisateurs', unit: '/5', type: 'rating' },
      { id: 'backlog_health', name: 'Santé du backlog', unit: '/5', type: 'rating' },
      { id: 'stakeholder_satisfaction', name: 'Satisfaction stakeholders', unit: '/5', type: 'rating' },
      { id: 'features_delivered', name: 'Features livrées', unit: 'nombre', type: 'number' }
    ],
    
    suggested_objectives: [
      'Augmenter la valeur livrée de X%',
      'Améliorer la satisfaction utilisateurs',
      'Optimiser le ROI des sprints',
      'Réduire le time-to-market',
      'Améliorer l\'alignement avec la stratégie'
    ],
    
    report_questions: {
      context: [
        'Quelle est la vision produit ?',
        'Qui sont les principaux stakeholders ?',
        'Quels sont les KPIs produit ?'
      ],
      what_works: [
        'Quelles features créent le plus de valeur ?',
        'Quels processus de priorisation fonctionnent ?',
        'Quelles relations stakeholders sont solides ?'
      ],
      pain_points: [
        'Quelles difficultés de priorisation ?',
        'Quels conflits avec les stakeholders ?',
        'Quels problèmes de vision partagée ?'
      ],
      opportunities: [
        'Quelles opportunités de création de valeur ?',
        'Quelles optimisations du backlog ?',
        'Quels nouveaux segments à adresser ?'
      ]
    },
    
    recommended_events: [
      { type: 'success', label: 'Feature à forte valeur livrée' },
      { type: 'learning', label: 'Feedback utilisateur' },
      { type: 'decision', label: 'Pivot stratégique' },
      { type: 'attempt', label: 'Expérimentation produit' }
    ]
  },
  
  release_train_engineer: {
    id: 'release_train_engineer',
    name: 'Release Train Engineer (RTE)',
    icon: '🚂',
    color: '#f59e0b',
    description: 'Facilitateur du train SAFe',
    
    focus_areas: [
      'Facilitation du PI Planning',
      'Coordination inter-équipes',
      'Gestion des dépendances',
      'Risques et impediments du train',
      'Amélioration continue du train'
    ],
    
    key_metrics: [
      { id: 'pi_predictability', name: 'Prévisibilité du PI', unit: '%', type: 'percentage' },
      { id: 'dependencies', name: 'Dépendances résolues', unit: '%', type: 'percentage' },
      { id: 'train_velocity', name: 'Vélocité du train', unit: 'points', type: 'number' },
      { id: 'pi_objectives', name: 'Atteinte des PI Objectives', unit: '%', type: 'percentage' },
      { id: 'art_health', name: 'Santé de l\'ART', unit: '/5', type: 'rating' }
    ],
    
    suggested_objectives: [
      'Améliorer la prévisibilité du PI',
      'Réduire les dépendances inter-équipes',
      'Augmenter la vélocité du train',
      'Améliorer la satisfaction du PI Planning',
      'Renforcer la collaboration ART'
    ],
    
    report_questions: {
      context: [
        'Quelle est la taille et composition de l\'ART ?',
        'Quel est le niveau de maturité SAFe ?',
        'Quels sont les principaux défis du train ?'
      ],
      what_works: [
        'Quelles synchronisations fonctionnent bien ?',
        'Quelles équipes collaborent efficacement ?',
        'Quels processus sont fluides ?'
      ],
      pain_points: [
        'Quelles dépendances bloquantes ?',
        'Quels problèmes de synchronisation ?',
        'Quelles difficultés de scaling ?'
      ],
      opportunities: [
        'Quelles optimisations du PI Planning ?',
        'Quels leviers de collaboration ?',
        'Quelles améliorations de process ?'
      ]
    },
    
    recommended_events: [
      { type: 'success', label: 'PI objectives atteints' },
      { type: 'failure', label: 'Risque matérialisé' },
      { type: 'learning', label: 'Inspect & Adapt' },
      { type: 'decision', label: 'Décision architecture' },
      { type: 'attempt', label: 'Innovation spike' }
    ]
  },
  
  delivery_manager: {
    id: 'delivery_manager',
    name: 'Delivery Manager',
    icon: '📊',
    color: '#ef4444',
    description: 'Garant de la livraison et de la qualité',
    
    focus_areas: [
      'Pilotage de la livraison',
      'Qualité et dette technique',
      'Gestion des risques',
      'Métriques et reporting',
      'Amélioration des process'
    ],
    
    key_metrics: [
      { id: 'delivery_time', name: 'Lead time moyen', unit: 'jours', type: 'duration' },
      { id: 'deployment_freq', name: 'Fréquence de déploiement', unit: '/mois', type: 'number' },
      { id: 'mttr', name: 'MTTR (Mean Time To Recovery)', unit: 'heures', type: 'duration' },
      { id: 'quality', name: 'Taux de bugs en production', unit: '%', type: 'percentage' },
      { id: 'predictability', name: 'Prévisibilité', unit: '%', type: 'percentage' }
    ],
    
    suggested_objectives: [
      'Réduire le lead time de X%',
      'Augmenter la fréquence de déploiement',
      'Améliorer la qualité (réduire bugs)',
      'Réduire le MTTR',
      'Améliorer la prévisibilité'
    ],
    
    report_questions: {
      context: [
        'Quelle est la chaîne de livraison actuelle ?',
        'Quels sont les indicateurs de performance ?',
        'Quels sont les objectifs de delivery ?'
      ],
      what_works: [
        'Quels process de livraison sont efficaces ?',
        'Quelles pratiques d\'amélioration continue ?',
        'Quels outils facilitent le delivery ?'
      ],
      pain_points: [
        'Quels goulots d\'étranglement ?',
        'Quels problèmes de qualité récurrents ?',
        'Quelles difficultés de déploiement ?'
      ],
      opportunities: [
        'Quelles optimisations du pipeline ?',
        'Quelles automatisations possibles ?',
        'Quels leviers d\'amélioration continue ?'
      ]
    },
    
    recommended_events: [
      { type: 'success', label: 'Release sans incident' },
      { type: 'failure', label: 'Incident production' },
      { type: 'learning', label: 'Post-mortem' },
      { type: 'decision', label: 'Amélioration process' },
      { type: 'attempt', label: 'Nouvelle pratique DevOps' }
    ]
  }
};

/**
 * Obtenir la config d'un rôle
 */
export function getRoleConfig(roleId) {
  return ROLES_CONFIG[roleId] || null;
}

/**
 * Obtenir tous les rôles
 */
export function getAllRoles() {
  return Object.values(ROLES_CONFIG);
}

/**
 * Obtenir les métriques d'un rôle
 */
export function getRoleMetrics(roleId) {
  const config = getRoleConfig(roleId);
  return config?.key_metrics || [];
}

/**
 * Obtenir les objectifs suggérés d'un rôle
 */
export function getRoleSuggestedObjectives(roleId) {
  const config = getRoleConfig(roleId);
  return config?.suggested_objectives || [];
}

console.log('✅ Roles Config loaded');
