/**
 * Wizard d'accompagnement - Mission Tracker
 * Guide l'utilisateur dans la création de sa première mission
 */

const WIZARD_STATE = {
  active: false,
  currentStep: 0,
  completed: false,
  steps: [
    {
      id: 'welcome',
      title: 'Bienvenue dans Mission Tracker ! 🎯',
      description: 'Je vais vous guider pour créer votre première mission en quelques étapes simples.',
      target: null,
      position: 'center'
    },
    {
      id: 'new-mission',
      title: 'Créer une mission',
      description: 'Cliquez sur ce bouton pour créer votre première mission. Vous pourrez y documenter votre contexte, vos objectifs et votre progression.',
      target: '#btn-new-mission',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'fill-form',
      title: 'Remplissez les informations',
      description: 'Donnez un titre à votre mission, indiquez le client et votre rôle. Ces informations vous aideront à contextualiser votre travail.',
      target: '#form-new-mission',
      position: 'top',
      waitForModal: true
    },
    {
      id: 'dashboard',
      title: 'Votre tableau de bord',
      description: 'Ici vous retrouvez vos KPI, votre mission en cours et vos prochaines actions. C\'est votre point de départ quotidien.',
      target: '.dashboard-kpis',
      position: 'bottom'
    },
    {
      id: 'quick-actions',
      title: 'Actions rapides',
      description: 'Utilisez ces raccourcis pour documenter rapidement vos réalisations, défis et expérimentations.',
      target: '.quick-actions-grid',
      position: 'top'
    },
    {
      id: 'complete',
      title: 'Vous êtes prêt ! 🎉',
      description: 'Vous savez maintenant comment utiliser Mission Tracker. N\'hésitez pas à explorer les autres onglets et à consulter l\'aide si besoin.',
      target: null,
      position: 'center'
    }
  ]
};

/**
 * Initialiser le wizard
 */
export function initWizard() {
  // Vérifier si le wizard a déjà été complété
  const wizardCompleted = localStorage.getItem('mission_tracker_wizard_completed');
  const hasMissions = localStorage.getItem('mission_tracker_missions');
  
  // Si pas de missions et wizard pas complété, démarrer automatiquement
  if (!hasMissions && !wizardCompleted) {
    setTimeout(() => {
      startWizard();
    }, 1000);
  }
  
  // Ajouter le bouton toggle wizard dans le header
  addWizardToggle();
}

/**
 * Ajouter le bouton toggle wizard
 */
function addWizardToggle() {
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions) return;
  
  const wizardCompleted = localStorage.getItem('mission_tracker_wizard_completed');
  
  const toggleButton = document.createElement('sl-tooltip');
  toggleButton.content = wizardCompleted ? 'Relancer le guide' : 'Activer le guide';
  toggleButton.innerHTML = `
    <button class="btn btn-icon wizard-toggle" id="wizard-toggle" title="Guide d'accompagnement">
      <sl-icon name="question-circle"></sl-icon>
    </button>
  `;
  
  headerActions.insertBefore(toggleButton, headerActions.firstChild);
  
  document.getElementById('wizard-toggle')?.addEventListener('click', () => {
    if (WIZARD_STATE.active) {
      stopWizard();
    } else {
      startWizard();
    }
  });
}

/**
 * Démarrer le wizard
 */
export function startWizard() {
  WIZARD_STATE.active = true;
  WIZARD_STATE.currentStep = 0;
  
  // Créer l'overlay
  createWizardOverlay();
  
  // Afficher la première étape
  showStep(0);
  
  console.log('🧙 Wizard démarré');
}

/**
 * Arrêter le wizard
 */
export function stopWizard() {
  WIZARD_STATE.active = false;
  
  // Retirer l'overlay
  removeWizardOverlay();
  
  console.log('🧙 Wizard arrêté');
}

/**
 * Créer l'overlay du wizard
 */
function createWizardOverlay() {
  // Retirer l'overlay existant si présent
  removeWizardOverlay();
  
  const overlay = document.createElement('div');
  overlay.id = 'wizard-overlay';
  overlay.className = 'wizard-overlay';
  
  document.body.appendChild(overlay);
}

/**
 * Retirer l'overlay du wizard
 */
function removeWizardOverlay() {
  const overlay = document.getElementById('wizard-overlay');
  if (overlay) {
    overlay.remove();
  }
  
  const spotlight = document.getElementById('wizard-spotlight');
  if (spotlight) {
    spotlight.remove();
  }
  
  const tooltip = document.getElementById('wizard-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

/**
 * Afficher une étape
 */
function showStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= WIZARD_STATE.steps.length) {
    completeWizard();
    return;
  }
  
  WIZARD_STATE.currentStep = stepIndex;
  const step = WIZARD_STATE.steps[stepIndex];
  
  // Retirer le spotlight et tooltip précédents
  const oldSpotlight = document.getElementById('wizard-spotlight');
  if (oldSpotlight) oldSpotlight.remove();
  
  const oldTooltip = document.getElementById('wizard-tooltip');
  if (oldTooltip) oldTooltip.remove();
  
  if (step.target) {
    // Créer le spotlight
    createSpotlight(step.target);
    
    // Créer le tooltip
    createTooltip(step, stepIndex);
  } else {
    // Étape centrale (welcome ou complete)
    createCenterModal(step, stepIndex);
  }
}

/**
 * Créer le spotlight sur un élément
 */
function createSpotlight(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  
  const rect = target.getBoundingClientRect();
  
  const spotlight = document.createElement('div');
  spotlight.id = 'wizard-spotlight';
  spotlight.className = 'wizard-spotlight';
  spotlight.style.top = `${rect.top - 8}px`;
  spotlight.style.left = `${rect.left - 8}px`;
  spotlight.style.width = `${rect.width + 16}px`;
  spotlight.style.height = `${rect.height + 16}px`;
  
  document.body.appendChild(spotlight);
  
  // Scroll vers l'élément
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Créer le tooltip
 */
function createTooltip(step, stepIndex) {
  const target = document.querySelector(step.target);
  if (!target) return;
  
  const rect = target.getBoundingClientRect();
  
  const tooltip = document.createElement('div');
  tooltip.id = 'wizard-tooltip';
  tooltip.className = 'wizard-tooltip';
  
  tooltip.innerHTML = `
    <div class="wizard-tooltip-header">
      <h3>${step.title}</h3>
      <button class="wizard-close" id="wizard-close">
        <sl-icon name="x"></sl-icon>
      </button>
    </div>
    <div class="wizard-tooltip-body">
      <p>${step.description}</p>
    </div>
    <div class="wizard-tooltip-footer">
      <div class="wizard-progress">
        <span>${stepIndex + 1} / ${WIZARD_STATE.steps.length}</span>
      </div>
      <div class="wizard-actions">
        ${stepIndex > 0 ? '<button class="btn btn-sm btn-ghost" id="wizard-prev">Précédent</button>' : ''}
        <button class="btn btn-sm btn-primary" id="wizard-next">
          ${stepIndex < WIZARD_STATE.steps.length - 1 ? 'Suivant' : 'Terminer'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(tooltip);
  
  // Positionner le tooltip
  positionTooltip(tooltip, rect, step.position);
  
  // Event listeners
  document.getElementById('wizard-close')?.addEventListener('click', stopWizard);
  document.getElementById('wizard-prev')?.addEventListener('click', () => showStep(stepIndex - 1));
  document.getElementById('wizard-next')?.addEventListener('click', () => {
    if (step.action === 'click') {
      // Simuler le clic sur l'élément
      target.click();
      setTimeout(() => showStep(stepIndex + 1), 500);
    } else {
      showStep(stepIndex + 1);
    }
  });
}

/**
 * Créer une modal centrale
 */
function createCenterModal(step, stepIndex) {
  const modal = document.createElement('div');
  modal.id = 'wizard-tooltip';
  modal.className = 'wizard-tooltip wizard-center';
  
  modal.innerHTML = `
    <div class="wizard-tooltip-header">
      <h3>${step.title}</h3>
      <button class="wizard-close" id="wizard-close">
        <sl-icon name="x"></sl-icon>
      </button>
    </div>
    <div class="wizard-tooltip-body">
      <p>${step.description}</p>
    </div>
    <div class="wizard-tooltip-footer">
      <div class="wizard-progress">
        <span>${stepIndex + 1} / ${WIZARD_STATE.steps.length}</span>
      </div>
      <div class="wizard-actions">
        ${stepIndex > 0 ? '<button class="btn btn-sm btn-ghost" id="wizard-prev">Précédent</button>' : ''}
        <button class="btn btn-sm btn-primary" id="wizard-next">
          ${stepIndex < WIZARD_STATE.steps.length - 1 ? 'Commencer' : 'Terminer'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners
  document.getElementById('wizard-close')?.addEventListener('click', stopWizard);
  document.getElementById('wizard-prev')?.addEventListener('click', () => showStep(stepIndex - 1));
  document.getElementById('wizard-next')?.addEventListener('click', () => showStep(stepIndex + 1));
}

/**
 * Positionner le tooltip
 */
function positionTooltip(tooltip, targetRect, position) {
  const tooltipRect = tooltip.getBoundingClientRect();
  let top, left;
  
  switch (position) {
    case 'top':
      top = targetRect.top - tooltipRect.height - 16;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = targetRect.bottom + 16;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left - tooltipRect.width - 16;
      break;
    case 'right':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + 16;
      break;
    default:
      top = targetRect.bottom + 16;
      left = targetRect.left;
  }
  
  // S'assurer que le tooltip reste dans la fenêtre
  top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));
  left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

/**
 * Compléter le wizard
 */
function completeWizard() {
  localStorage.setItem('mission_tracker_wizard_completed', 'true');
  WIZARD_STATE.completed = true;
  stopWizard();
  
  // Afficher un toast de félicitations
  if (typeof showToast === 'function') {
    showToast('Guide terminé ! Vous êtes prêt à utiliser Mission Tracker 🎉', 'success', 5000);
  }
}

console.log('✅ Wizard module loaded');
