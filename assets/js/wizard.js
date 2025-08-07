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
    context: null
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
      categories: ['fondamentaux', 'frameworks', 'animation', 'gestion-defis', 'leadership']
    },
    { 
      id: 'coach-agile', 
      label: 'Coach Agile', 
      icon: '🧭',
      categories: ['transformation', 'leadership', 'multi-equipes', 'developpement-coach']
    },
    { 
      id: 'product-owner', 
      label: 'Product Owner', 
      icon: '📦',
      categories: ['product-design', 'frameworks', 'delivery']
    },
    { 
      id: 'dev-team', 
      label: 'Développeur', 
      icon: '💻',
      categories: ['frameworks', 'delivery', 'outils-tech']
    },
    { 
      id: 'manager', 
      label: 'Manager', 
      icon: '👔',
      categories: ['transformation', 'leadership', 'multi-equipes', 'contextes']
    },
    { 
      id: 'curious', 
      label: 'Curieux / Débutant', 
      icon: '🌱',
      categories: ['fondamentaux', 'frameworks', 'ressources']
    }
  ],
  
  goals: [
    { 
      id: 'improve-team', 
      label: 'Améliorer la collaboration d\'équipe', 
      icon: '🤝',
      categories: ['animation', 'gestion-defis', 'frameworks']
    },
    { 
      id: 'start-agile', 
      label: 'Démarrer une transformation agile', 
      icon: '🚀',
      categories: ['fondamentaux', 'transformation', 'frameworks']
    },
    { 
      id: 'optimize-delivery', 
      label: 'Optimiser la livraison de valeur', 
      icon: '📈',
      categories: ['delivery', 'product-design', 'frameworks']
    },
    { 
      id: 'facilitate-events', 
      label: 'Faciliter des événements agiles', 
      icon: '🎭',
      categories: ['animation', 'frameworks', 'ressources']
    },
    { 
      id: 'scale-agile', 
      label: 'Passer à l\'échelle (plusieurs équipes)', 
      icon: '🏗️',
      categories: ['multi-equipes', 'frameworks', 'transformation']
    },
    { 
      id: 'develop-skills', 
      label: 'Développer mes compétences de coach', 
      icon: '📚',
      categories: ['developpement-coach', 'leadership', 'ressources']
    }
  ],
  
  contexts: [
    { 
      id: 'remote', 
      label: 'Équipe distante / hybride', 
      icon: '🌍',
      categories: ['outils-tech', 'animation', 'gestion-defis']
    },
    { 
      id: 'startup', 
      label: 'Startup / Scale-up', 
      icon: '⚡',
      categories: ['contextes', 'delivery', 'product-design']
    },
    { 
      id: 'corporate', 
      label: 'Grande entreprise', 
      icon: '🏢',
      categories: ['transformation', 'multi-equipes', 'contextes']
    },
    { 
      id: 'new-team', 
      label: 'Équipe nouvellement formée', 
      icon: '🌱',
      categories: ['fondamentaux', 'frameworks', 'animation']
    },
    { 
      id: 'resistance', 
      label: 'Résistance au changement', 
      icon: '🛡️',
      categories: ['gestion-defis', 'transformation', 'leadership']
    },
    { 
      id: 'universal', 
      label: 'Contexte standard', 
      icon: '⚙️',
      categories: []
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
  WizardState.answers = { role: null, goal: null, context: null };
  
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
      completeWizard(true);
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
  switch(step) {
    case 1:
      renderOptions('role', WizardOptions.roles);
      break;
    case 2:
      renderOptions('goal', WizardOptions.goals);
      break;
    case 3:
      renderOptions('context', WizardOptions.contexts);
      break;
  }
}

/**
 * Rendre les options d'une étape
 */
function renderOptions(type, options) {
  const containerId = `${type}Options`;
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  container.innerHTML = options.map(option => `
    <button class="wizard-option ${WizardState.answers[type] === option.id ? 'selected' : ''}" 
            data-type="${type}" 
            data-value="${option.id}">
      <div class="option-icon">${option.icon}</div>
      <div class="option-label">${option.label}</div>
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
  
  // Enregistrer la réponse
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
    } else {
      // Dernière étape → afficher les résultats
      showWizardResults();
    }
  }, 400);
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
  
  if (backBtn) {
    backBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  }
  
  if (skipBtn) {
    skipBtn.style.display = step <= WizardState.maxSteps ? 'inline-flex' : 'none';
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
  
  // Cacher les boutons de navigation
  document.getElementById('wizardBack').style.display = 'none';
  document.getElementById('wizardSkip').style.display = 'none';
}

/**
 * Calculer les recommandations selon les réponses
 */
function calculateRecommendations() {
  const { role, goal, context } = WizardState.answers;
  
  // Récupérer les catégories associées à chaque réponse
  const roleCategories = WizardOptions.roles.find(r => r.id === role)?.categories || [];
  const goalCategories = WizardOptions.goals.find(g => g.id === goal)?.categories || [];
  const contextCategories = WizardOptions.contexts.find(c => c.id === context)?.categories || [];
  
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
  
  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="empty-results">
        <p>Aucune recommandation spécifique. Explorez toutes les catégories !</p>
      </div>
    `;
    return;
  }
  
  const categories = AppState.config.categories;
  
  container.innerHTML = recommendations.map(rec => {
    const cat = categories.find(c => c.id === rec.id);
    if (!cat) return '';
    
    return `
      <a href="category.html?cat=${cat.id}" class="result-card">
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
  }).join('');
}

/**
 * Compléter le wizard
 */
function completeWizard(skipped = false) {
  // Marquer comme complété dans localStorage
  localStorage.setItem('wizardCompleted', 'true');
  AppState.wizardCompleted = true;
  
  // Masquer le wizard et afficher la homepage
  document.getElementById('wizardContainer').style.display = 'none';
  document.getElementById('homepageContainer').style.display = 'block';
  
  // Rendre la homepage
  renderHomepage();
  
  console.log(`✅ Wizard ${skipped ? 'passé' : 'complété'}`);
}

console.log('✅ wizard.js chargé');
