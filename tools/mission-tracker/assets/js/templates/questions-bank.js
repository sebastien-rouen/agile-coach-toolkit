/**
 * Mission Tracker - Banque de questions
 * Questions types pour chaque type de rapport et contexte
 */

// ==========================================
// RAPPORT D'ÉTONNEMENT (J+7)
// ==========================================

export const ETONNEMENT_QUESTIONS = {
  general: {
    context: [
      'Quel est le contexte de la mission ?',
      'Quelle est la composition de l\'équipe ?',
      'Quels sont les principaux enjeux identifiés ?',
      'Quelle est la maturité agile actuelle ?'
    ],
    
    what_works: [
      'Quelles pratiques fonctionnent déjà bien ?',
      'Quels sont les points forts de l\'équipe ?',
      'Quelles bonnes surprises avez-vous eues ?',
      'Quels éléments facilitent votre mission ?'
    ],
    
    pain_points: [
      'Quels problèmes avez-vous identifiés ?',
      'Quelles difficultés récurrentes observez-vous ?',
      'Quels freins à l\'agilité avez-vous détectés ?',
      'Quelles zones de tension existent ?'
    ],
    
    opportunities: [
      'Quelles améliorations rapides sont possibles ?',
      'Quels quick wins pouvez-vous identifier ?',
      'Quelles opportunités d\'expérimentation voyez-vous ?',
      'Quels leviers de transformation sont disponibles ?'
    ],
    
    objectives: [
      'Quels sont vos objectifs pour les 3 prochains mois ?',
      'Quelles métriques allez-vous suivre ?',
      'Quels résultats concrets visez-vous ?',
      'Comment allez-vous mesurer votre impact ?'
    ]
  },
  
  team_dynamics: [
    'Comment l\'équipe communique-t-elle ?',
    'Quelle est la dynamique de collaboration ?',
    'Comment les décisions sont-elles prises ?',
    'Quel est le niveau de confiance dans l\'équipe ?',
    'Comment les conflits sont-ils gérés ?'
  ],
  
  ceremonies: [
    'Quelles cérémonies sont en place ?',
    'Comment se passent les daily stand-ups ?',
    'Les rétrospectives sont-elles efficaces ?',
    'Les plannings sont-ils pertinents ?',
    'Les reviews créent-elles de la valeur ?'
  ],
  
  technical: [
    'Quel est l\'état de la dette technique ?',
    'Comment est organisé le développement ?',
    'Quelles pratiques de qualité sont en place ?',
    'Comment sont gérés les déploiements ?',
    'Quel est le niveau d\'automatisation ?'
  ],
  
  organizational: [
    'Comment l\'organisation supporte-t-elle l\'agilité ?',
    'Quelles sont les relations avec les autres équipes ?',
    'Comment sont gérées les dépendances ?',
    'Quel est le niveau de support du management ?',
    'Quels sont les processus organisationnels impactants ?'
  ]
};

// ==========================================
// CHECKPOINT HEBDOMADAIRE
// ==========================================

export const WEEKLY_CHECKPOINT_QUESTIONS = {
  achievements: [
    'Quelles ont été les principales réussites cette semaine ?',
    'Quels objectifs ont été atteints ?',
    'Quelles pratiques ont bien fonctionné ?',
    'Quels problèmes ont été résolus ?'
  ],
  
  challenges: [
    'Quelles difficultés avez-vous rencontrées ?',
    'Quels blocages persistent ?',
    'Quels nouveaux problèmes sont apparus ?',
    'Quelles tensions avez-vous observées ?'
  ],
  
  learnings: [
    'Qu\'avez-vous appris cette semaine ?',
    'Quelles insights avez-vous eus ?',
    'Quels feedbacks avez-vous reçus ?',
    'Quelles expérimentations ont porté leurs fruits ?'
  ],
  
  next_steps: [
    'Quelles sont vos priorités pour la semaine prochaine ?',
    'Quelles actions allez-vous mettre en place ?',
    'Quels ajustements sont nécessaires ?',
    'Quelles expérimentations voulez-vous lancer ?'
  ],
  
  mood: [
    'Quel est votre niveau d\'énergie ? (1-5)',
    'Comment vous sentez-vous dans la mission ?',
    'Quel est le moral de l\'équipe ?',
    'Y a-t-il des signaux d\'alerte ?'
  ]
};

// ==========================================
// REVUE MENSUELLE
// ==========================================

export const MONTHLY_REVIEW_QUESTIONS = {
  progress: [
    'Quels progrès ont été réalisés ce mois-ci ?',
    'Où en êtes-vous par rapport à vos objectifs ?',
    'Quelles métriques montrent une amélioration ?',
    'Quels jalons ont été franchis ?'
  ],
  
  trends: [
    'Quelles tendances positives observez-vous ?',
    'Quelles tendances négatives nécessitent attention ?',
    'Comment évoluent vos indicateurs clés ?',
    'Quels patterns émergent ?'
  ],
  
  retrospective: [
    'Qu\'est-ce qui a bien fonctionné ce mois-ci ?',
    'Qu\'est-ce qui pourrait être amélioré ?',
    'Quelles surprises avez-vous eues ?',
    'Quelles leçons tirez-vous de ce mois ?'
  ],
  
  adjustments: [
    'Quels ajustements de stratégie sont nécessaires ?',
    'Quels objectifs doivent être revus ?',
    'Quelles nouvelles approches tester ?',
    'Quels changements de priorités ?'
  ],
  
  stakeholders: [
    'Comment les stakeholders perçoivent-ils les progrès ?',
    'Quels feedbacks avez-vous reçus ?',
    'Quelles attentes ont évolué ?',
    'Quels alignements sont nécessaires ?'
  ]
};

// ==========================================
// BILAN FINAL
// ==========================================

export const FINAL_REPORT_QUESTIONS = {
  mission_summary: [
    'Quel était le contexte initial de la mission ?',
    'Quels étaient les objectifs fixés ?',
    'Quelle a été la durée réelle de la mission ?',
    'Quelles ont été les principales phases ?'
  ],
  
  achievements: [
    'Quels objectifs ont été atteints ?',
    'Quelles améliorations concrètes ont été apportées ?',
    'Quels changements durables ont été instaurés ?',
    'Quelles success stories pouvez-vous partager ?'
  ],
  
  challenges: [
    'Quelles ont été les principales difficultés ?',
    'Quels obstacles n\'ont pas été surmontés ?',
    'Quelles résistances ont persisté ?',
    'Quels objectifs n\'ont pas été atteints et pourquoi ?'
  ],
  
  learnings: [
    'Quelles sont les principales leçons apprises ?',
    'Qu\'auriez-vous fait différemment ?',
    'Quelles bonnes pratiques sont à retenir ?',
    'Quels patterns avez-vous identifiés ?'
  ],
  
  impact: [
    'Quel a été l\'impact mesurable de la mission ?',
    'Comment les métriques ont-elles évolué ?',
    'Quel est le ROI de la mission ?',
    'Quels bénéfices à long terme sont attendus ?'
  ],
  
  recommendations: [
    'Quelles sont vos recommandations pour la suite ?',
    'Quels axes d\'amélioration prioritaires ?',
    'Quels risques à surveiller ?',
    'Quelles opportunités futures ?'
  ],
  
  handover: [
    'Quelles sont les conditions de réussite pour la suite ?',
    'Qui prend le relais et comment ?',
    'Quels documents/outils sont transmis ?',
    'Quel accompagnement post-mission est prévu ?'
  ]
};

// ==========================================
// QUESTIONS PAR ÉVÉNEMENT
// ==========================================

export const EVENT_CONTEXT_QUESTIONS = {
  success: [
    'Qu\'est-ce qui a permis cette réussite ?',
    'Quels facteurs clés ont contribué ?',
    'Comment capitaliser sur ce succès ?',
    'Quelles pratiques sont à diffuser ?'
  ],
  
  failure: [
    'Quelles ont été les causes de l\'échec ?',
    'Quels signaux d\'alerte avez-vous manqués ?',
    'Qu\'auriez-vous pu faire différemment ?',
    'Quelles actions correctives mettre en place ?'
  ],
  
  learning: [
    'Quelle est la principale leçon ?',
    'Comment cette connaissance va-t-elle changer votre approche ?',
    'Avec qui devez-vous partager cet apprentissage ?',
    'Comment l\'appliquer concrètement ?'
  ],
  
  decision: [
    'Quel était le contexte de la décision ?',
    'Quelles options avez-vous considérées ?',
    'Quels critères ont guidé le choix ?',
    'Quelles implications cette décision a-t-elle ?'
  ],
  
  attempt: [
    'Quelle est l\'hypothèse testée ?',
    'Comment allez-vous mesurer le résultat ?',
    'Quels sont les critères de succès ?',
    'Quelle est la durée de l\'expérimentation ?'
  ],
  
  blocker: [
    'Quelle est la nature du blocage ?',
    'Quel est l\'impact sur l\'équipe/le projet ?',
    'Qui peut aider à lever ce blocage ?',
    'Quelles actions ont déjà été tentées ?'
  ],
  
  risk: [
    'Quel est le risque identifié ?',
    'Quelle est la probabilité/impact ?',
    'Quelles actions de mitigation sont possibles ?',
    'Qui doit être informé de ce risque ?'
  ]
};

// ==========================================
// QUESTIONS DE COACHING
// ==========================================

export const COACHING_QUESTIONS = {
  powerful_questions: [
    'Qu\'est-ce qui est vraiment important pour vous ici ?',
    'Si vous aviez une baguette magique, que changeriez-vous ?',
    'Qu\'est-ce qui vous empêche d\'avancer ?',
    'Quelle serait la prochaine petite étape ?',
    'Comment saurez-vous que vous avez réussi ?',
    'Qu\'est-ce que vous n\'avez pas encore essayé ?',
    'Quel conseil donneriez-vous à quelqu\'un dans votre situation ?',
    'Qu\'est-ce qui dépend de vous dans cette situation ?'
  ],
  
  retrospective: [
    'Qu\'est-ce qui a bien fonctionné ?',
    'Qu\'est-ce qui pourrait être amélioré ?',
    'Quelles actions mettre en place ?',
    'Qui fait quoi pour quand ?'
  ],
  
  problem_solving: [
    'Quel est vraiment le problème ?',
    'Quelles sont les causes racines ?',
    'Quelles solutions avez-vous envisagées ?',
    'Qu\'allez-vous essayer en premier ?',
    'Comment saurez-vous si ça fonctionne ?'
  ],
  
  team_dynamics: [
    'Comment l\'équipe se sent-elle ?',
    'Qu\'est-ce qui crée de l\'énergie dans l\'équipe ?',
    'Qu\'est-ce qui draine l\'énergie ?',
    'Comment améliorer la collaboration ?',
    'Quelles conversations doivent avoir lieu ?'
  ],
  
  alignment: [
    'Tout le monde a-t-il la même compréhension ?',
    'Quels sont les désalignements ?',
    'Comment créer un alignement ?',
    'Qui doit être impliqué dans la décision ?'
  ]
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Obtenir les questions pour un rapport d'étonnement
 */
export function getEtonnementQuestions(role = null) {
  return ETONNEMENT_QUESTIONS.general;
}

/**
 * Obtenir les questions pour un checkpoint hebdo
 */
export function getWeeklyCheckpointQuestions() {
  return WEEKLY_CHECKPOINT_QUESTIONS;
}

/**
 * Obtenir les questions pour une revue mensuelle
 */
export function getMonthlyReviewQuestions() {
  return MONTHLY_REVIEW_QUESTIONS;
}

/**
 * Obtenir les questions pour un bilan final
 */
export function getFinalReportQuestions() {
  return FINAL_REPORT_QUESTIONS;
}

/**
 * Obtenir les questions contextuelles pour un type d'événement
 */
export function getEventContextQuestions(eventType) {
  return EVENT_CONTEXT_QUESTIONS[eventType] || [];
}

/**
 * Obtenir des questions de coaching
 */
export function getCoachingQuestions(category = 'powerful_questions') {
  return COACHING_QUESTIONS[category] || [];
}

/**
 * Générer un questionnaire personnalisé
 */
export function generateCustomQuestionnaire(sections) {
  const questionnaire = {};
  
  sections.forEach(section => {
    const questions = [];
    
    // Questions générales
    if (section.includeGeneral) {
      questions.push(...ETONNEMENT_QUESTIONS.general[section.category]);
    }
    
    // Questions spécifiques
    if (section.includeDynamics) {
      questions.push(...ETONNEMENT_QUESTIONS.team_dynamics);
    }
    
    if (section.includeCeremonies) {
      questions.push(...ETONNEMENT_QUESTIONS.ceremonies);
    }
    
    if (section.includeTechnical) {
      questions.push(...ETONNEMENT_QUESTIONS.technical);
    }
    
    if (section.includeOrganizational) {
      questions.push(...ETONNEMENT_QUESTIONS.organizational);
    }
    
    questionnaire[section.name] = questions;
  });
  
  return questionnaire;
}

console.log('✅ Questions Bank loaded');
