/**
 * Mission Tracker - Application principale
 * Gestion des missions, événements, rapports et roadmap
 */

import { pb, isAuthenticated, getCurrentUser } from '../../../../assets/js/shared/pocketbase.js';
import { showToast, formatDate, debounce } from '../../../../assets/js/shared/utils.js';
import { 
  createMission as createMissionData, 
  getMissions, 
  updateMission as updateMissionData,
  deleteMission as deleteMissionData 
} from './data-manager.js';

// ==========================================
// ÉTAT DE L'APPLICATION
// ==========================================

const APP_STATE = {
  currentUser: null,
  missions: [],
  currentMission: null,
  events: [],
  filters: {
    status: 'all',
    role: 'all',
    search: '',
    eventTypes: ['success', 'failure', 'attempt', 'learning', 'decision']
  },
  view: 'dashboard', // dashboard | mission | report
  config: null
};

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 Mission Tracker - Initialisation...');

  try {
    // Charger la config
    APP_STATE.config = await loadConfig();
    
    // Vérifier l'authentification (optionnelle)
    if (isAuthenticated()) {
      APP_STATE.currentUser = getCurrentUser();
      console.log('✅ Utilisateur connecté:', APP_STATE.currentUser.email);
    } else {
      // Mode local sans authentification
      APP_STATE.currentUser = {
        id: 'local-user',
        email: 'local@agile',
        name: 'Utilisateur Local'
      };
      console.log('ℹ️ Mode local (sans authentification PocketBase)');
      showToast('Mode local activé - Les données sont stockées dans votre navigateur', 'info', 5000);
    }

    // Initialiser l'application
    await initApp();
    
  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
    showToast('Erreur lors du chargement', 'danger');
  }
});

/**
 * Charger la configuration
 */
async function loadConfig() {
  try {
    const response = await fetch('./config/config.json');
    if (!response.ok) throw new Error('Config non trouvée');
    const config = await response.json();
    console.log('📦 Configuration chargée:', config);
    return config;
  } catch (error) {
    console.error('❌ Erreur chargement config:', error);
    throw error;
  }
}

/**
 * Initialiser l'application
 */
async function initApp() {
  try {
    // Charger les missions
    await loadMissions();
    
    // Charger tous les événements
    await loadAllEvents();
    
    // Initialiser les filtres par défaut
    APP_STATE.filters = {
      eventTypes: ['milestone', 'meeting', 'delivery', 'issue', 'achievement'],
      status: 'all',
      search: ''
    };
    
    // Initialiser les event listeners
    initEventListeners();
    
    // Afficher le dashboard par défaut
    showView('dashboard');
    
    console.log('✅ Application initialisée avec', APP_STATE.missions.length, 'missions');
    
    // Afficher un toast de bienvenue si première visite
    const firstVisit = !localStorage.getItem('mission_tracker_visited');
    if (firstVisit) {
      localStorage.setItem('mission_tracker_visited', 'true');
      await showToast('Bienvenue dans Mission Tracker ! 🎯', 'primary', 5000);
    }
    
  } catch (error) {
    console.error('❌ Erreur init app:', error);
    await showToast('Erreur lors de l\'initialisation', 'danger');
    throw error;
  }
}

// ==========================================
// GESTION DES MISSIONS
// ==========================================

/**
 * Charger toutes les missions de l'utilisateur
 */
async function loadMissions() {
  try {
    // Utiliser le data-manager
    APP_STATE.missions = getMissions();
    console.log(`✅ ${APP_STATE.missions.length} missions chargées depuis localStorage`);
    
    // Mettre à jour le badge du menu
    const missionsCount = document.getElementById('missions-count');
    if (missionsCount) {
      missionsCount.textContent = APP_STATE.missions.length;
    }
    
    return APP_STATE.missions;
    
  } catch (error) {
    console.error('❌ Erreur chargement missions:', error);
    await showToast('Erreur lors du chargement des missions', 'danger');
    return [];
  }
}

/**
 * Créer une nouvelle mission
 */
async function createMission(data) {
  try {
    // Utiliser le data-manager
    const mission = await createMissionData(data);
    
    // Ajouter à l'état local
    APP_STATE.missions.unshift(mission);
    
    console.log('✅ Mission créée:', mission.id);
    await showToast('Mission créée avec succès', 'success');
    
    // Recharger les missions
    await loadMissions();
    
    return mission;
    
  } catch (error) {
    console.error('❌ Erreur création mission:', error);
    await showToast('Erreur lors de la création', 'danger');
    throw error;
  }
}

/**
 * Sauvegarder les missions dans localStorage
 */
function saveMissionsToLocalStorage() {
  localStorage.setItem('mission_tracker_missions', JSON.stringify(APP_STATE.missions));
}

/**
 * Générer un ID unique
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Mettre à jour une mission
 */
async function updateMission(missionId, data) {
  try {
    const record = await pb.collection('missions').update(missionId, data);
    
    const mission = formatMission(record);
    const index = APP_STATE.missions.findIndex(m => m.id === missionId);
    if (index !== -1) {
      APP_STATE.missions[index] = mission;
    }
    
    if (APP_STATE.currentMission?.id === missionId) {
      APP_STATE.currentMission = mission;
    }
    
    console.log('✅ Mission mise à jour:', missionId);
    showToast('Mission mise à jour', 'success');
    
    return mission;
    
  } catch (error) {
    console.error('❌ Erreur mise à jour mission:', error);
    showToast('Erreur lors de la mise à jour', 'danger');
    throw error;
  }
}

/**
 * Supprimer une mission
 */
async function deleteMission(missionId) {
  try {
    await pb.collection('missions').delete(missionId);
    
    APP_STATE.missions = APP_STATE.missions.filter(m => m.id !== missionId);
    
    if (APP_STATE.currentMission?.id === missionId) {
      APP_STATE.currentMission = null;
      showView('dashboard');
    }
    
    console.log('✅ Mission supprimée:', missionId);
    showToast('Mission supprimée', 'success');
    
  } catch (error) {
    console.error('❌ Erreur suppression mission:', error);
    showToast('Erreur lors de la suppression', 'danger');
    throw error;
  }
}

/**
 * Formater une mission pour l'affichage
 */
function formatMission(record) {
  const startDate = new Date(record.start_date);
  const endDate = record.end_date ? new Date(record.end_date) : new Date();
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  return {
    id: record.id,
    title: record.title,
    client: record.client,
    role: record.role,
    status: record.status,
    startDate: record.start_date,
    endDate: record.end_date,
    duration: duration,
    objectives: record.objectives || [],
    metrics: record.metrics || [],
    context: record.context || {},
    report: record.report || {},
    eventsCount: record.expand?.events_via_mission?.length || 0,
    created: record.created,
    updated: record.updated
  };
}

// ==========================================
// GESTION DES ÉVÉNEMENTS
// ==========================================

/**
 * Charger tous les événements (pour la timeline globale)
 */
async function loadAllEvents() {
  try {
    // Mode local : récupérer depuis localStorage
    if (!isAuthenticated()) {
      const allEvents = JSON.parse(localStorage.getItem('mission_tracker_events') || '[]');
      APP_STATE.events = allEvents;
      console.log(`✅ ${allEvents.length} événements chargés (local)`);
      return allEvents;
    }
    
    // Mode PocketBase
    const records = await pb.collection('events').getFullList({
      sort: '-date'
    });
    
    APP_STATE.events = records;
    console.log(`✅ ${records.length} événements chargés (PocketBase)`);
    return records;
    
  } catch (error) {
    console.error('❌ Erreur chargement événements:', error);
    // En cas d'erreur, fallback sur localStorage
    const allEvents = JSON.parse(localStorage.getItem('mission_tracker_events') || '[]');
    APP_STATE.events = allEvents;
    console.log(`✅ ${allEvents.length} événements chargés (fallback local)`);
    return allEvents;
  }
}

/**
 * Charger les événements d'une mission
 */
async function loadEvents(missionId) {
  try {
    const records = await pb.collection('events').getFullList({
      filter: `mission_id = "${missionId}"`,
      sort: '-date'
    });

    APP_STATE.events = records.map(formatEvent);
    console.log(`✅ ${APP_STATE.events.length} événements chargés`);
    
    return APP_STATE.events;
    
  } catch (error) {
    console.error('❌ Erreur chargement événements:', error);
    showToast('Erreur lors du chargement des événements', 'danger');
    return [];
  }
}

/**
 * Créer un événement
 */
async function createEvent(data) {
  try {
    const record = await pb.collection('events').create({
      ...data,
      mission_id: APP_STATE.currentMission.id,
      created: new Date().toISOString()
    });

    const event = formatEvent(record);
    APP_STATE.events.unshift(event);
    
    // Mettre à jour le compteur de la mission
    APP_STATE.currentMission.eventsCount++;
    
    console.log('✅ Événement créé:', event.id);
    showToast('Événement ajouté', 'success');
    
    return event;
    
  } catch (error) {
    console.error('❌ Erreur création événement:', error);
    showToast('Erreur lors de la création', 'danger');
    throw error;
  }
}

/**
 * Mettre à jour un événement
 */
async function updateEvent(eventId, data) {
  try {
    const record = await pb.collection('events').update(eventId, data);
    
    const event = formatEvent(record);
    const index = APP_STATE.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      APP_STATE.events[index] = event;
    }
    
    console.log('✅ Événement mis à jour:', eventId);
    showToast('Événement mis à jour', 'success');
    
    return event;
    
  } catch (error) {
    console.error('❌ Erreur mise à jour événement:', error);
    showToast('Erreur lors de la mise à jour', 'danger');
    throw error;
  }
}

/**
 * Supprimer un événement
 */
async function deleteEvent(eventId) {
  try {
    // Mode local : supprimer de localStorage
    if (!isAuthenticated()) {
      const allEvents = JSON.parse(localStorage.getItem('mission_tracker_events') || '[]');
      const filteredEvents = allEvents.filter(e => e.id !== eventId);
      localStorage.setItem('mission_tracker_events', JSON.stringify(filteredEvents));
      
      APP_STATE.events = filteredEvents;
      if (APP_STATE.currentMission) {
        APP_STATE.currentMission.eventsCount = (APP_STATE.currentMission.eventsCount || 0) - 1;
      }
      
      console.log('✅ Événement supprimé (local):', eventId);
      showToast('Événement supprimé', 'success');
      return;
    }
    
    // Mode PocketBase
    await pb.collection('events').delete(eventId);
    
    APP_STATE.events = APP_STATE.events.filter(e => e.id !== eventId);
    if (APP_STATE.currentMission) {
      APP_STATE.currentMission.eventsCount--;
    }
    
    console.log('✅ Événement supprimé (PocketBase):', eventId);
    showToast('Événement supprimé', 'success');
    
  } catch (error) {
    console.error('❌ Erreur suppression événement:', error);
    showToast('Erreur lors de la suppression', 'danger');
  }
}

/**
 * Formater un événement
 */
function formatEvent(record) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    description: record.description,
    date: record.date,
    tags: record.tags || [],
    impact: record.impact || 'medium',
    created: record.created
  };
}

// ==========================================
// AFFICHAGE DES VUES
// ==========================================

/**
 * Afficher une vue (tab panel)
 */
function showView(viewName, data = null) {
  console.log('📄 Affichage vue:', viewName, 'avec', APP_STATE.missions.length, 'missions');
  
  // Obtenir le tab group
  const tabGroup = document.getElementById('main-tabs');
  if (!tabGroup) {
    console.error('❌ Tab group non trouvé');
    return;
  }
  
  // Activer le bon tab
  const tabs = tabGroup.querySelectorAll('sl-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('panel') === viewName) {
      tab.click();
    }
  });
  
  APP_STATE.view = viewName;
  
  // Render selon la vue
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'missions':
      renderMissionsList();
      break;
    case 'mission':
      // Afficher les détails dans le panel missions
      if (data) APP_STATE.currentMission = data;
      // Basculer vers le panel missions
      const missionsTab = tabGroup.querySelector('sl-tab[panel="missions"]');
      if (missionsTab) missionsTab.click();
      // Afficher les détails de la mission
      renderMissionDetails();
      break;
    case 'report':
      renderReport(data);
      break;
    case 'roadmap':
      renderRoadmapTab();
      break;
    case 'analytics':
      renderAnalyticsTab();
      break;
  }
}

/**
 * Render Dashboard
 */
function renderDashboard() {
  console.log('📊 Render Dashboard avec', APP_STATE.missions.length, 'missions');
  
  // Stats
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  // Calculer les checkpoints de la semaine (à implémenter avec le data-manager)
  const checkpointsThisWeek = 0; // TODO: Implémenter avec getCheckpointsByDateRange()
  
  // Calculer les réalisations (à implémenter avec le data-manager)
  const totalAchievements = 0; // TODO: Implémenter avec getAchievements()
  
  const stats = {
    total: APP_STATE.missions.length,
    active: APP_STATE.missions.filter(m => m.status === 'active').length,
    checkpoints: checkpointsThisWeek,
    achievements: totalAchievements
  };
  
  console.log('📊 Stats:', stats);
  
  // Mettre à jour les KPI
  const kpiTotal = document.getElementById('kpi-total-missions');
  const kpiActive = document.getElementById('kpi-active-missions');
  const kpiCheckpoints = document.getElementById('kpi-checkpoints');
  const kpiAchievements = document.getElementById('kpi-achievements');
  
  if (kpiTotal) kpiTotal.textContent = stats.total;
  if (kpiActive) kpiActive.textContent = stats.active;
  if (kpiCheckpoints) kpiCheckpoints.textContent = stats.checkpoints;
  if (kpiAchievements) kpiAchievements.textContent = stats.achievements;
  
  // Mettre à jour le badge du menu
  const missionsCount = document.getElementById('missions-count');
  if (missionsCount) missionsCount.textContent = stats.total;
  
  // Afficher la mission en cours
  renderCurrentMission();
  
  // Afficher les prochains checkpoints
  renderUpcomingCheckpoints();
  
  // Afficher les dernières réalisations
  renderRecentAchievements();
}

/**
 * Render mission en cours
 */
function renderCurrentMission() {
  const container = document.getElementById('current-mission-card');
  if (!container) return;
  
  const currentMission = APP_STATE.missions.find(m => m.status === 'active');
  
  if (!currentMission) {
    container.innerHTML = `
      <div class="empty-state-small">
        <p>Aucune mission active pour le moment</p>
        <button class="btn btn-primary btn-sm" id="btn-start-mission">
          <sl-icon name="plus-circle"></sl-icon>
          Créer une mission
        </button>
      </div>
    `;
    
    // Event listener pour le bouton
    document.getElementById('btn-start-mission')?.addEventListener('click', () => {
      openCreateMissionModal();
    });
    
    return;
  }
  
  const role = APP_STATE.config.roles.find(r => r.id === currentMission.role);
  
  container.innerHTML = `
    <div class="mission-card">
      <div class="mission-header">
        <h3>${role?.icon || '🎯'} ${currentMission.title}</h3>
        <sl-badge variant="success">Active</sl-badge>
      </div>
      <p class="mission-client">${currentMission.client}</p>
      <p class="mission-role">${role?.name || currentMission.role}</p>
      <div class="mission-actions">
        <button class="btn btn-sm btn-primary" data-mission-id="${currentMission.id}">
          Voir les détails
        </button>
      </div>
    </div>
  `;
  
  // Event listener pour voir les détails
  container.querySelector('[data-mission-id]')?.addEventListener('click', () => {
    showView('mission', currentMission);
  });
}

/**
 * Render prochains checkpoints
 */
function renderUpcomingCheckpoints() {
  const container = document.getElementById('upcoming-checkpoints');
  if (!container) return;
  
  // TODO: Récupérer les vrais checkpoints depuis le data-manager
  const checkpoints = []; // À implémenter
  
  if (checkpoints.length === 0) {
    container.innerHTML = `
      <div class="empty-state-small">
        <p>Aucun checkpoint planifié</p>
      </div>
    `;
    return;
  }
  
  // Afficher les checkpoints
  container.innerHTML = checkpoints.map(checkpoint => `
    <div class="checkpoint-item">
      <div class="checkpoint-date">${formatDate(checkpoint.date)}</div>
      <div class="checkpoint-title">${checkpoint.title}</div>
    </div>
  `).join('');
}

/**
 * Render dernières réalisations
 */
function renderRecentAchievements() {
  const container = document.getElementById('recent-achievements');
  if (!container) return;
  
  // Récupérer les réalisations depuis localStorage
  const achievements = JSON.parse(localStorage.getItem('mission_tracker_achievements') || '[]');
  
  // Trier par date décroissante et prendre les 3 dernières
  const recent = achievements
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  if (recent.length === 0) {
    container.innerHTML = `
      <div class="empty-state-small">
        <p>Aucune réalisation enregistrée</p>
      </div>
    `;
    return;
  }
  
  // Afficher les réalisations
  container.innerHTML = recent.map(achievement => `
    <div class="achievement-card">
      <div class="achievement-header">
        <div class="achievement-icon">${getCategoryIcon(achievement.category)}</div>
        <div class="achievement-date">${formatDate(achievement.date)}</div>
      </div>
      <div class="achievement-title">${achievement.title}</div>
      <div class="achievement-description">${achievement.description.substring(0, 100)}${achievement.description.length > 100 ? '...' : ''}</div>
    </div>
  `).join('');
}

/**
 * Helper: Icône catégorie réalisation
 */
function getCategoryIcon(category) {
  const icons = {
    team: '👥',
    process: '⚙️',
    delivery: '🚀',
    coaching: '🎯',
    innovation: '💡'
  };
  return icons[category] || '🏆';
}

/**
 * Render liste des missions
 */
async function renderMissionsList() {
  console.log('📋 Render missions list:', APP_STATE.missions.length, 'missions');
  
  // Attendre que la vue soit affichée
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const container = document.getElementById('missions-list');
  if (!container) {
    console.error('❌ Container missions-list non trouvé');
    return;
  }
  
  // Filtrer les missions
  let filtered = APP_STATE.missions;
  
  if (APP_STATE.filters.status && APP_STATE.filters.status !== 'all') {
    filtered = filtered.filter(m => m.status === APP_STATE.filters.status);
  }
  
  if (APP_STATE.filters.role && APP_STATE.filters.role !== 'all') {
    filtered = filtered.filter(m => m.role === APP_STATE.filters.role);
  }
  
  if (APP_STATE.filters.search) {
    const search = APP_STATE.filters.search.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(search) ||
      m.client.toLowerCase().includes(search)
    );
  }
  
  console.log('📋 Missions filtrées:', filtered.length);
  
  // Afficher
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucune mission</h3>
        <p>Créez votre première mission pour commencer</p>
        <sl-button variant="primary" id="btn-create-first-mission">
          <sl-icon slot="prefix" name="plus-circle"></sl-icon>
          Nouvelle mission
        </sl-button>
      </div>
    `;
    
    document.getElementById('btn-create-first-mission')?.addEventListener('click', () => {
      openCreateMissionModal();
    });
    
  } else {
    container.innerHTML = filtered.map(renderMissionCard).join('');
    
    // Event listeners pour les cartes
    container.querySelectorAll('.mission-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('sl-button')) {
          const missionId = card.dataset.missionId;
          const mission = APP_STATE.missions.find(m => m.id === missionId);
          if (mission) {
            showView('mission', mission);
          }
        }
      });
    });
  }
}

/**
 * Render carte mission
 */
function renderMissionCard(mission) {
  const role = APP_STATE.config.roles.find(r => r.id === mission.role);
  const progress = calculateMissionProgress(mission);
  
  return `
    <div class="mission-card" data-mission-id="${mission.id}">
      <div class="mission-card-header">
        <div class="mission-card-role">${role?.icon || '🎯'}</div>
        <div class="mission-card-status ${mission.status}">
          ${mission.status === 'active' ? 'En cours' : 'Terminée'}
        </div>
      </div>
      
      <h3 class="mission-card-title">${mission.title}</h3>
      <p class="mission-card-client">${mission.client}</p>
      
      <div class="mission-card-dates">
        <sl-icon name="calendar"></sl-icon>
        ${formatDate(mission.startDate)}
        ${mission.endDate ? ` → ${formatDate(mission.endDate)}` : ' → En cours'}
      </div>
      
      <div class="mission-card-progress">
        <div class="mission-card-progress-label">
          <span>Progression</span>
          <span>${progress}%</span>
        </div>
        <div class="mission-card-progress-bar">
          <div class="mission-card-progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
      
      <div class="mission-card-stats">
        <div class="mission-card-stat">
          <span class="mission-card-stat-value">${mission.objectives.length}</span>
          <span class="mission-card-stat-label">Objectifs</span>
        </div>
        <div class="mission-card-stat">
          <span class="mission-card-stat-value">${mission.eventsCount}</span>
          <span class="mission-card-stat-label">Événements</span>
        </div>
        <div class="mission-card-stat">
          <span class="mission-card-stat-value">${mission.duration}j</span>
          <span class="mission-card-stat-label">Durée</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Calculer la progression d'une mission
 */
function calculateMissionProgress(mission) {
  if (mission.objectives.length === 0) return 0;
  
  const completed = mission.objectives.filter(obj => obj.completed).length;
  return Math.round((completed / mission.objectives.length) * 100);
}

/**
 * Render Mission View
 */
/**
 * Afficher les détails d'une mission dans le panel missions
 */
async function renderMissionDetails() {
  console.log('🎯 Render Mission Details');
  
  const mission = APP_STATE.currentMission;
  if (!mission) {
    console.error('❌ Aucune mission sélectionnée');
    return;
  }
  
  // Charger les événements
  await loadEvents(mission.id);
  
  const container = document.querySelector('.missions-container');
  if (!container) {
    console.error('❌ Container missions non trouvé');
    return;
  }
  
  const role = APP_STATE.config?.roles?.find(r => r.id === mission.role);
  const objectives = mission.objectives || [];
  const events = APP_STATE.events || [];
  
  // Calculer les stats
  const stats = calculateMissionStats(mission);
  
  // Créer le HTML des détails
  container.innerHTML = `
    <div class="mission-details-view">
      <!-- Header avec bouton retour -->
      <div class="mission-details-header">
        <button class="btn btn-secondary" id="btn-back-to-missions">
          <sl-icon name="arrow-left"></sl-icon>
          Retour aux missions
        </button>
        <div class="mission-details-actions">
          <button class="btn btn-secondary" id="btn-edit-mission-details">
            <sl-icon name="pencil"></sl-icon>
            Modifier
          </button>
          <button class="btn btn-danger" id="btn-delete-mission-details">
            <sl-icon name="trash"></sl-icon>
            Supprimer
          </button>
        </div>
      </div>
      
      <!-- Informations principales -->
      <div class="mission-details-card">
        <div class="mission-details-title">
          <h2>${role?.icon || '🎯'} ${mission.title}</h2>
          <span class="badge badge-${mission.status}">
            ${mission.status === 'active' ? 'En cours' : mission.status === 'completed' ? 'Terminée' : 'En pause'}
          </span>
        </div>
        
        <div class="mission-details-meta">
          <div class="meta-item">
            <sl-icon name="building"></sl-icon>
            <span>${mission.client}</span>
          </div>
          <div class="meta-item">
            <sl-icon name="person-badge"></sl-icon>
            <span>${role?.name || mission.role}</span>
          </div>
          <div class="meta-item">
            <sl-icon name="calendar"></sl-icon>
            <span>${formatDate(mission.start_date || mission.startDate)}</span>
          </div>
          ${mission.end_date || mission.endDate ? `
          <div class="meta-item">
            <sl-icon name="calendar-check"></sl-icon>
            <span>${formatDate(mission.end_date || mission.endDate)}</span>
          </div>
          ` : ''}
        </div>
        
        <!-- Stats -->
        <div class="mission-details-stats">
          <div class="stat-card">
            <div class="stat-value">${objectives.length}</div>
            <div class="stat-label">Objectifs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completedObjectives}</div>
            <div class="stat-label">Complétés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${events.length}</div>
            <div class="stat-label">Événements</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.successRate}%</div>
            <div class="stat-label">Succès</div>
          </div>
        </div>
      </div>
      
      <!-- Actions rapides -->
      <div class="mission-details-quick-actions">
        <button class="btn btn-primary" id="btn-add-event">
          <sl-icon name="plus-circle"></sl-icon>
          Ajouter un événement
        </button>
        <button class="btn btn-primary" id="btn-add-objective">
          <sl-icon name="target"></sl-icon>
          Ajouter un objectif
        </button>
        <button class="btn btn-primary" id="btn-create-checkpoint">
          <sl-icon name="flag"></sl-icon>
          Créer un checkpoint
        </button>
      </div>
      
      <!-- Objectifs -->
      ${objectives.length > 0 ? `
      <div class="mission-details-section">
        <h3>📋 Objectifs</h3>
        <div class="objectives-list">
          ${objectives.map(obj => `
            <div class="objective-item ${obj.completed ? 'completed' : ''}">
              <sl-checkbox ${obj.completed ? 'checked' : ''}></sl-checkbox>
              <span>${obj.title || obj.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <!-- Événements récents -->
      ${events.length > 0 ? `
      <div class="mission-details-section">
        <h3>📅 Événements récents</h3>
        <div class="events-list">
          ${events.slice(0, 5).map(event => `
            <div class="event-item">
              <div class="event-icon">${getEventIcon(event.type)}</div>
              <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${formatDate(event.date)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : `
      <div class="empty-state">
        <sl-icon name="calendar-x"></sl-icon>
        <p>Aucun événement pour cette mission</p>
        <button class="btn btn-primary" id="btn-add-first-event">
          Ajouter le premier événement
        </button>
      </div>
      `}
    </div>
  `;
  
  // Event listeners
  document.getElementById('btn-back-to-missions')?.addEventListener('click', () => {
    APP_STATE.currentMission = null;
    renderMissionsList();
  });
  
  document.getElementById('btn-edit-mission-details')?.addEventListener('click', () => {
    openEditMissionModal(mission);
  });
  
  document.getElementById('btn-delete-mission-details')?.addEventListener('click', async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la mission "${mission.title}" ?`)) {
      await deleteMission(mission.id);
      APP_STATE.currentMission = null;
      renderMissionsList();
    }
  });
  
  console.log('✅ Détails mission rendus:', mission.title);
}

/**
 * Obtenir l'icône d'un type d'événement
 */
function getEventIcon(type) {
  const icons = {
    milestone: '🎯',
    meeting: '👥',
    delivery: '📦',
    issue: '⚠️',
    achievement: '🏆',
    success: '✅'
  };
  return icons[type] || '📌';
}

/**
 * Calculer les statistiques d'une mission
 */
function calculateMissionStats(mission) {
  const objectives = mission.objectives || [];
  const completedObjectives = objectives.filter(obj => obj.completed).length;
  
  const events = APP_STATE.events || [];
  const successEvents = events.filter(e => e.type === 'success' || e.type === 'achievement').length;
  const totalEvents = events.length;
  const successRate = totalEvents > 0 ? Math.round((successEvents / totalEvents) * 100) : 0;
  
  return {
    completedObjectives,
    successRate
  };
}

// ==========================================
// ONGLETS MISSION
// ==========================================

/**
 * Render onglet Objectifs
 */
function renderObjectivesTab() {
  const container = document.getElementById('objectives-list');
  if (!container) return;
  
  const mission = APP_STATE.currentMission;
  
  if (mission.objectives.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <p>Aucun objectif défini</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = mission.objectives.map((obj, index) => `
    <div class="objective-item ${obj.completed ? 'completed' : ''}" data-objective-index="${index}">
      <div class="objective-checkbox-wrapper">
        <sl-checkbox 
          class="objective-checkbox"
          ${obj.completed ? 'checked' : ''}
          data-objective-index="${index}"
        ></sl-checkbox>
      </div>
      
      <div class="objective-content">
        <div class="objective-text">${obj.text || obj.title}</div>
        ${obj.description ? `<div class="objective-description">${obj.description}</div>` : ''}
        ${obj.progress !== undefined ? `
          <div class="objective-progress">
            <div class="objective-progress-bar">
              <div class="objective-progress-fill" style="width: ${obj.progress}%"></div>
            </div>
            <div class="objective-progress-label">${obj.progress}% complété</div>
          </div>
        ` : ''}
      </div>
      
      <div class="objective-actions">
        <sl-icon-button 
          name="pencil" 
          label="Modifier"
          data-objective-index="${index}"
          class="btn-edit-objective"
        ></sl-icon-button>
        <sl-icon-button 
          name="trash" 
          label="Supprimer"
          data-objective-index="${index}"
          class="btn-delete-objective"
        ></sl-icon-button>
      </div>
    </div>
  `).join('');
  
  // Event listeners
  container.querySelectorAll('.objective-checkbox').forEach(checkbox => {
    checkbox.addEventListener('sl-change', async (e) => {
      const index = parseInt(e.target.dataset.objectiveIndex);
      mission.objectives[index].completed = e.target.checked;
      await updateMission(mission.id, { objectives: mission.objectives });
      renderObjectivesTab();
      renderMission(); // Refresh stats
    });
  });
  
  container.querySelectorAll('.btn-edit-objective').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.objectiveIndex);
      openEditObjectiveModal(index);
    });
  });
  
  container.querySelectorAll('.btn-delete-objective').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.currentTarget.dataset.objectiveIndex);
      if (confirm('Supprimer cet objectif ?')) {
        mission.objectives.splice(index, 1);
        await updateMission(mission.id, { objectives: mission.objectives });
        renderObjectivesTab();
        renderMission();
      }
    });
  });
}

/**
 * Render onglet Timeline
 */
function renderTimelineTab() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  
  // Filtrer les événements
  let filtered = APP_STATE.events.filter(e => 
    APP_STATE.filters.eventTypes.includes(e.type)
  );
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="timeline-empty">
        <div class="timeline-empty-icon">📅</div>
        <h3>Aucun événement</h3>
        <p>Commencez à documenter votre mission</p>
        <sl-button variant="primary" id="btn-add-first-event">
          <sl-icon slot="prefix" name="plus-circle"></sl-icon>
          Ajouter un événement
        </sl-button>
      </div>
    `;
    
    document.getElementById('btn-add-first-event')?.addEventListener('click', () => {
      openAddEventModal();
    });
    
    return;
  }
  
  // Grouper par mois
  const grouped = groupEventsByMonth(filtered);
  
  container.innerHTML = `
    <div class="timeline">
      ${Object.entries(grouped).map(([month, events]) => `
        <div class="timeline-month">
          <div class="timeline-month-label">${month}</div>
          <div class="timeline-events">
            ${events.map(renderTimelineEvent).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // Event listeners
  container.querySelectorAll('.btn-edit-event').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventId = e.currentTarget.dataset.eventId;
      const event = APP_STATE.events.find(ev => ev.id === eventId);
      if (event) openEditEventModal(event);
    });
  });
  
  container.querySelectorAll('.btn-delete-event').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const eventId = e.currentTarget.dataset.eventId;
      if (confirm('Supprimer cet événement ?')) {
        await deleteEvent(eventId);
        renderTimelineTab();
        renderMission();
      }
    });
  });
}

/**
 * Grouper les événements par mois
 */
function groupEventsByMonth(events) {
  const grouped = {};
  
  events.forEach(event => {
    const date = new Date(event.date);
    const monthKey = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    const monthKeyCapitalized = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
    
    if (!grouped[monthKeyCapitalized]) {
      grouped[monthKeyCapitalized] = [];
    }
    grouped[monthKeyCapitalized].push(event);
  });
  
  return grouped;
}

/**
 * Render événement timeline
 */
function renderTimelineEvent(event) {
  const typeConfig = {
    milestone: { icon: 'flag-fill', label: 'Jalon', color: 'primary' },
    meeting: { icon: 'people-fill', label: 'Réunion', color: 'info' },
    delivery: { icon: 'box-seam', label: 'Livraison', color: 'success' },
    issue: { icon: 'exclamation-triangle-fill', label: 'Problème', color: 'warning' },
    achievement: { icon: 'trophy-fill', label: 'Réalisation', color: 'success' },
    success: { icon: 'check-circle-fill', label: 'Réussite', color: 'success' },
    failure: { icon: 'x-circle-fill', label: 'Échec', color: 'danger' },
    attempt: { icon: 'flask', label: 'Tentative', color: 'info' },
    learning: { icon: 'lightbulb-fill', label: 'Apprentissage', color: 'primary' },
    decision: { icon: 'signpost-fill', label: 'Décision', color: 'warning' }
  };
  
  const config = typeConfig[event.type] || { icon: 'circle-fill', label: 'Événement', color: 'neutral' };
  
  return `
    <div class="timeline-event ${event.type}">
      <div class="timeline-event-header">
        <div class="timeline-event-type ${event.type}">
          <sl-icon name="${config.icon}"></sl-icon>
          ${config.label}
        </div>
        <div class="timeline-event-date">
          <sl-icon name="calendar"></sl-icon>
          ${formatDate(event.date)}
        </div>
      </div>
      
      <div class="timeline-event-content">
        <h4 class="timeline-event-title">${event.title}</h4>
        ${event.description ? `<p class="timeline-event-description">${event.description}</p>` : ''}
      </div>
      
      <div class="timeline-event-footer">
        ${event.tags && event.tags.length > 0 ? `
        <div class="timeline-event-tags">
          ${event.tags.map(tag => `<span class="timeline-event-tag">${tag}</span>`).join('')}
        </div>
        ` : ''}
        ${event.impact ? `<span class="timeline-event-impact impact-${event.impact}">Impact: ${event.impact}</span>` : ''}
        <div class="timeline-event-actions">
          <sl-icon-button 
            name="pencil" 
            label="Modifier"
            class="btn-edit-event"
            data-event-id="${event.id}"
          ></sl-icon-button>
          <sl-icon-button 
            name="trash" 
            label="Supprimer"
            class="btn-delete-event"
            data-event-id="${event.id}"
          ></sl-icon-button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render onglet Roadmap
 */
function renderRoadmapTab() {
  console.log('🚧 Roadmap tab - Chargement des données');
  
  // Vision
  const visionContainer = document.getElementById('roadmap-vision');
  if (visionContainer) {
    const vision = JSON.parse(localStorage.getItem('mission_tracker_vision') || '{}');
    console.log('📋 Vision chargée:', vision);
    
    if (vision.statement || vision.vision) {
      visionContainer.innerHTML = `
        <div class="vision-card">
          <h3>🎯 Ma Vision</h3>
          <p class="vision-statement">${vision.statement || vision.vision}</p>
          ${vision.values ? `<h4>💎 Valeurs</h4><p>${vision.values}</p>` : ''}
          ${vision.goals && vision.goals.length > 0 ? `
            <h4>🎯 Objectifs</h4>
            <ul class="vision-goals-list">
              ${vision.goals.map(goal => `<li>${goal}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
    } else {
      visionContainer.innerHTML = `
        <div class="empty-state-small">
          <p>Définissez votre vision personnelle</p>
          <button class="btn btn-primary btn-sm" id="btn-add-vision">
            <sl-icon name="plus-circle"></sl-icon>
            Ajouter ma vision
          </button>
        </div>
      `;
      
      document.getElementById('btn-add-vision')?.addEventListener('click', () => {
        openEditVisionModal();
      });
    }
  }
  
  // Compétences actuelles
  const skillsContainer = document.getElementById('current-skills');
  if (skillsContainer) {
    const skills = JSON.parse(localStorage.getItem('mission_tracker_skills') || '[]');
    if (skills.length > 0) {
      skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-card">
          <div class="skill-header">
            <h4>${skill.name}</h4>
            <span class="skill-level">${getSkillLevelLabel(skill.level)}</span>
          </div>
          <p class="skill-category">${skill.category}</p>
          ${skill.description ? `<p class="skill-description">${skill.description}</p>` : ''}
        </div>
      `).join('');
    } else {
      skillsContainer.innerHTML = `
        <div class="empty-state-small">
          <p>Aucune compétence enregistrée</p>
        </div>
      `;
    }
  }
  
  // Compétences à développer
  const skillsToDevContainer = document.getElementById('skills-to-develop');
  if (skillsToDevContainer) {
    const skillsToDev = JSON.parse(localStorage.getItem('mission_tracker_skills_to_develop') || '[]');
    console.log('📋 Compétences à développer:', skillsToDev.length);
    
    if (skillsToDev.length > 0) {
      skillsToDevContainer.innerHTML = skillsToDev.map(skill => `
        <div class="skill-to-dev-card">
          <div class="skill-header">
            <h4>${skill.name}</h4>
            <span class="priority-badge ${skill.priority}">${getPriorityLabel(skill.priority)}</span>
          </div>
          <p><strong>Pourquoi :</strong> ${skill.reason || skill.why}</p>
          ${skill.how ? `<p><strong>Comment :</strong> ${skill.how}</p>` : ''}
          ${skill.targetDate ? `<p><strong>Date cible :</strong> ${formatDate(skill.targetDate)}</p>` : ''}
        </div>
      `).join('');
    } else {
      skillsToDevContainer.innerHTML = `
        <div class="empty-state-small">
          <p>Aucune compétence à développer</p>
          <button class="btn btn-primary btn-sm" id="btn-add-skill-to-dev">
            <sl-icon name="plus-circle"></sl-icon>
            Ajouter une compétence
          </button>
        </div>
      `;
      
      document.getElementById('btn-add-skill-to-dev')?.addEventListener('click', () => {
        openAddSkillToDevModal();
      });
    }
  }
  
  // Objectifs d'apprentissage
  const goalsContainer = document.getElementById('learning-goals');
  if (goalsContainer) {
    const goals = JSON.parse(localStorage.getItem('mission_tracker_learning_goals') || '[]');
    console.log('📋 Objectifs d\'apprentissage:', goals.length);
    
    if (goals.length > 0) {
      goalsContainer.innerHTML = goals.map(goal => `
        <div class="learning-goal-card ${goal.status || ''}">
          <div class="goal-header">
            <h4>${getGoalTypeIcon(goal.type)} ${goal.title}</h4>
            ${goal.status ? `<span class="status-badge ${goal.status}">${getStatusLabel(goal.status)}</span>` : ''}
          </div>
          ${goal.description ? `<p>${goal.description}</p>` : ''}
          ${goal.deadline ? `<p><strong>📅 Date limite :</strong> ${formatDate(goal.deadline)}</p>` : ''}
          ${goal.resources ? `<p><strong>📚 Ressources :</strong> ${goal.resources}</p>` : ''}
        </div>
      `).join('');
    } else {
      goalsContainer.innerHTML = `
        <div class="empty-state-small">
          <p>Aucun objectif défini</p>
        </div>
      `;
    }
  }
  
  // Expérimentations
  const experimentsContainer = document.getElementById('experiments-planned');
  if (experimentsContainer) {
    const experiments = JSON.parse(localStorage.getItem('mission_tracker_experiments') || '[]');
    if (experiments.length > 0) {
      experimentsContainer.innerHTML = experiments.map(exp => `
        <div class="experiment-card">
          <h4>🧪 ${exp.title}</h4>
          <p><strong>Hypothèse :</strong> ${exp.hypothesis}</p>
          <p><strong>Méthode :</strong> ${exp.method}</p>
          <p><strong>Critères de succès :</strong> ${exp.success}</p>
          <p><strong>Début :</strong> ${formatDate(exp.startDate)} | <strong>Durée :</strong> ${exp.duration} jours</p>
        </div>
      `).join('');
    } else {
      experimentsContainer.innerHTML = `
        <div class="empty-state-small">
          <p>Aucune expérimentation planifiée</p>
        </div>
      `;
    }
  }
}

/**
 * Helper: Label niveau de compétence
 */
function getSkillLevelLabel(level) {
  const labels = {
    beginner: '🌱 Débutant',
    intermediate: '🌿 Intermédiaire',
    advanced: '🌳 Avancé',
    expert: '🏆 Expert'
  };
  return labels[level] || level;
}

/**
 * Helper: Label priorité
 */
function getPriorityLabel(priority) {
  const labels = {
    high: '🔴 Haute',
    medium: '🟡 Moyenne',
    low: '🟢 Basse'
  };
  return labels[priority] || priority;
}

/**
 * Helper: Label statut
 */
function getStatusLabel(status) {
  const labels = {
    planned: '📋 Planifié',
    in_progress: '🔄 En cours',
    done: '✅ Terminé',
    cancelled: '❌ Annulé'
  };
  return labels[status] || status;
}

/**
 * Helper: Icône type d'objectif
 */
function getGoalTypeIcon(type) {
  const icons = {
    certification: '🎓',
    formation: '📖',
    pratique: '🛠️',
    lecture: '📚',
    mentorat: '👥'
  };
  return icons[type] || '📚';
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function initEventListeners() {
  // Navigation
  document.getElementById('btn-back-dashboard')?.addEventListener('click', () => {
    showView('dashboard');
  });
  
  document.getElementById('btn-back-mission')?.addEventListener('click', () => {
    showView('mission', APP_STATE.currentMission);
  });
  
  // Nouvelle mission (3 boutons différents)
  document.getElementById('btn-new-mission')?.addEventListener('click', () => {
    openCreateMissionModal();
  });
  
  document.getElementById('btn-new-mission-2')?.addEventListener('click', () => {
    openCreateMissionModal();
  });
  
  document.getElementById('btn-new-mission-empty')?.addEventListener('click', () => {
    openCreateMissionModal();
  });
  
  // Voir toutes les missions
  document.getElementById('btn-view-all-missions')?.addEventListener('click', () => {
    showView('missions');
  });
  
  // Voir toutes les réalisations
  document.getElementById('btn-view-all-achievements')?.addEventListener('click', () => {
    // Afficher l'onglet roadmap qui contient les réalisations
    showView('roadmap');
  });
  
  // Event listener pour les changements d'onglets
  const tabGroup = document.getElementById('main-tabs');
  if (tabGroup) {
    tabGroup.addEventListener('sl-tab-show', (event) => {
      const tabName = event.detail.name;
      console.log('📑 Changement onglet:', tabName);
      
      // Render selon l'onglet
      switch (tabName) {
        case 'dashboard':
          renderDashboard();
          break;
        case 'missions':
          renderMissionsList();
          break;
        case 'timeline':
          renderTimelineTab();
          break;
        case 'reports':
          renderReportsTab();
          break;
        case 'roadmap':
          renderRoadmapTab();
          break;
        case 'analytics':
          renderAnalyticsTab();
          break;
      }
    });
  }
  
  // Actions mission
  document.getElementById('btn-edit-mission')?.addEventListener('click', () => {
    openEditMissionModal();
  });
  
  document.getElementById('btn-export-mission')?.addEventListener('click', () => {
    openExportModal();
  });
  
  document.getElementById('btn-delete-mission')?.addEventListener('click', async () => {
    if (confirm('Supprimer cette mission ? Cette action est irréversible.')) {
      await deleteMission(APP_STATE.currentMission.id);
    }
  });
  
  // Rapport d'étonnement
  document.getElementById('btn-show-report')?.addEventListener('click', () => {
    showView('report', { type: 'etonnement' });
  });
  
  // Bilan final
  document.getElementById('btn-show-final-report')?.addEventListener('click', () => {
    showView('report', { type: 'final' });
  });
  
  // Ajouter événement
  document.getElementById('btn-add-event')?.addEventListener('click', () => {
    openAddEventModal();
  });
  
  // Filtres
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.dataset.filter;
      APP_STATE.filters.status = filter;
      
      // Update active button
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      renderMissionsList();
    });
  });
  
  // Recherche
  const searchInput = document.getElementById('search-missions');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      APP_STATE.filters.search = e.target.value;
      renderMissionsList();
    }, 300));
  }
  
  // Filtres événements timeline
  document.querySelectorAll('.event-type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.eventType;
      
      if (APP_STATE.filters.eventTypes.includes(type)) {
        APP_STATE.filters.eventTypes = APP_STATE.filters.eventTypes.filter(t => t !== type);
        e.currentTarget.classList.remove('active');
      } else {
        APP_STATE.filters.eventTypes.push(type);
        e.currentTarget.classList.add('active');
      }
      
      renderTimelineTab();
    });
  });
  
  // Actions rapides dashboard
  document.getElementById('quick-initial-report')?.addEventListener('click', () => {
    openInitialReportModal();
  });
  
  document.getElementById('quick-weekly-checkpoint')?.addEventListener('click', () => {
    openCheckpointModal();
  });
  
  document.getElementById('quick-final-report')?.addEventListener('click', () => {
    openFinalReportModal();
  });
  
  document.getElementById('quick-add-achievement')?.addEventListener('click', () => {
    openAddAchievementModal();
  });
  
  document.getElementById('quick-add-challenge')?.addEventListener('click', () => {
    openAddChallengeModal();
  });
  
  document.getElementById('quick-experiment')?.addEventListener('click', () => {
    openQuickExperimentModal();
  });
  
  document.getElementById('btn-new-checkpoint')?.addEventListener('click', () => {
    openCheckpointModal();
  });
  
  // Menu actions
  document.getElementById('menu-load-demo')?.addEventListener('click', () => {
    openLoadDemoModal();
  });
  
  document.getElementById('menu-export-all')?.addEventListener('click', () => {
    openExportModal();
  });
  
  document.getElementById('menu-import')?.addEventListener('click', () => {
    openImportModal();
  });
  
  document.getElementById('menu-settings')?.addEventListener('click', () => {
    openSettingsModal();
  });
  
  document.getElementById('menu-help')?.addEventListener('click', () => {
    openHelpModal();
  });
  
  // Roadmap actions
  document.getElementById('btn-edit-vision')?.addEventListener('click', () => {
    openEditVisionModal();
  });
  
  document.getElementById('btn-add-skill')?.addEventListener('click', () => {
    openAddSkillModal();
  });
  
  document.getElementById('btn-add-skill-to-develop')?.addEventListener('click', () => {
    openAddSkillToDevelopModal();
  });
  
  document.getElementById('btn-add-learning-goal')?.addEventListener('click', () => {
    openAddLearningGoalModal();
  });
  
  document.getElementById('btn-add-planned-experiment')?.addEventListener('click', () => {
    openAddExperimentModal();
  });
  
  console.log('✅ Event listeners initialisés');
}

// ==========================================
// MODALS
// ==========================================

/**
 * Ouvrir modal création mission
 */
function openCreateMissionModal() {
  const modal = document.getElementById('modal-new-mission');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-new-mission');
    return;
  }
  
  console.log('🔍 Modal trouvée, ouverture...');
  
  // Reset form
  const form = document.getElementById('form-new-mission');
  if (form) {
    form.reset();
    
    // Populate roles
    const roleSelect = document.getElementById('mission-role');
    if (roleSelect && APP_STATE.config) {
      roleSelect.innerHTML = APP_STATE.config.roles.map(role => `
        <sl-option value="${role.id}">
          ${role.icon} ${role.name}
        </sl-option>
      `).join('');
    }
  }
  
  // Ouvrir la modal (Shoelace)
  modal.show();
  
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      client: formData.get('client'),
      role: formData.get('role'),
      start_date: formData.get('start_date'),
      status: 'active',
      objectives: [],
      metrics: [],
      context: {}
    };
    
    try {
      const mission = await createMission(data);
      modal.hide();
      await loadMissions();
      showView('missions');
      renderMissionsList();
      await showToast('Mission créée avec succès', 'success');
    } catch (error) {
      console.error('❌ Erreur:', error);
      await showToast('Erreur lors de la création', 'danger');
    }
    
    form.removeEventListener('submit', handleSubmit);
  };
  
  form.addEventListener('submit', handleSubmit, { once: true });
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-mission');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
  
  console.log('✅ Modal nouvelle mission ouverte');
}

/**
 * Ouvrir modal édition mission
 */
function openEditMissionModal() {
  const modal = document.getElementById('modal-edit-mission');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-edit-mission');
    return;
  }
  
  if (!APP_STATE.currentMission) {
    console.error('❌ Aucune mission sélectionnée');
    return;
  }
  
  const mission = APP_STATE.currentMission;
  
  // Créer le formulaire dynamiquement
  const formContent = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <sl-input name="title" label="Titre de la mission" value="${mission.title}" required></sl-input>
      <sl-input name="client" label="Client / Entreprise" value="${mission.client}" required></sl-input>
      <sl-select name="role" label="Votre rôle" value="${mission.role}" required>
        ${APP_STATE.config.roles.map(role => `
          <sl-option value="${role.id}" ${role.id === mission.role ? 'selected' : ''}>
            ${role.icon} ${role.name}
          </sl-option>
        `).join('')}
      </sl-select>
      <sl-input name="start_date" label="Date de début" type="date" value="${mission.startDate}" required></sl-input>
      <sl-input name="end_date" label="Date de fin" type="date" value="${mission.endDate || ''}"></sl-input>
      <sl-select name="status" label="Statut" value="${mission.status}" required>
        <sl-option value="active">Active</sl-option>
        <sl-option value="completed">Terminée</sl-option>
        <sl-option value="paused">En pause</sl-option>
      </sl-select>
    </div>
  `;
  
  const form = document.getElementById('form-edit-mission');
  if (form) {
    form.innerHTML = formContent;
  }
  
  modal.show();
  
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      client: formData.get('client'),
      role: formData.get('role'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      status: formData.get('status')
    };
    
    try {
      await updateMission(mission.id, data);
      modal.hide();
      await loadMissions();
      renderMissionsList();
      showToast('Mission mise à jour', 'success');
    } catch (error) {
      console.error('❌ Erreur:', error);
      showToast('Erreur lors de la mise à jour', 'danger');
    }
    
    form.removeEventListener('submit', handleSubmit);
  };
  
  form.addEventListener('submit', handleSubmit, { once: true });
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-edit-mission');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}

/**
 * Ouvrir modal rapport d'étonnement
 */
function openInitialReportModal() {
  const modal = document.getElementById('modal-initial-report');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-initial-report');
    return;
  }
  
  // Charger le template du rapport
  const content = document.getElementById('initial-report-content');
  if (content) {
    content.innerHTML = `
      <div class="alert info">
        <sl-icon name="info-circle"></sl-icon>
        <div>
          <strong>Rapport d'étonnement (J+15)</strong>
          <p>Documentez vos premières impressions et découvertes après 15 jours de mission.</p>
        </div>
      </div>
      <form id="form-initial-report">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <sl-textarea name="context" label="Contexte de la mission" rows="3" required 
            help-text="Décrivez le contexte dans lequel vous intervenez"></sl-textarea>
          <sl-textarea name="discoveries" label="Découvertes et surprises" rows="4" required
            help-text="Qu'avez-vous découvert qui vous a surpris ?"></sl-textarea>
          <sl-textarea name="challenges" label="Défis identifiés" rows="4" required
            help-text="Quels sont les principaux défis à relever ?"></sl-textarea>
          <sl-textarea name="opportunities" label="Opportunités d'amélioration" rows="4" required
            help-text="Quelles opportunités voyez-vous ?"></sl-textarea>
          <sl-textarea name="next_steps" label="Prochaines étapes" rows="3" required
            help-text="Quelles sont vos prochaines actions ?"></sl-textarea>
        </div>
        <div class="modal-footer">
          <sl-button variant="text" id="btn-cancel-initial-report">Annuler</sl-button>
          <sl-button variant="primary" type="submit">Enregistrer le rapport</sl-button>
        </div>
      </form>
    `;
  }
  
  modal.show();
  
  // Handle submit
  const form = document.getElementById('form-initial-report');
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = {
        type: 'initial',
        context: formData.get('context'),
        discoveries: formData.get('discoveries'),
        challenges: formData.get('challenges'),
        opportunities: formData.get('opportunities'),
        next_steps: formData.get('next_steps'),
        date: new Date().toISOString()
      };
      
      try {
        // Sauvegarder le rapport (localStorage pour l'instant)
        const reports = JSON.parse(localStorage.getItem('mission_tracker_reports') || '[]');
        const report = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          ...data,
          missionId: APP_STATE.currentMission?.id,
          createdAt: new Date().toISOString()
        };
        reports.push(report);
        localStorage.setItem('mission_tracker_reports', JSON.stringify(reports));
        
        console.log('📝 Rapport d\'étonnement enregistré:', report);
        modal.hide();
        showToast('Rapport enregistré avec succès', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-initial-report');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}

/**
 * Ouvrir modal checkpoint
 */
function openCheckpointModal() {
  const modal = document.getElementById('modal-checkpoint');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-checkpoint');
    return;
  }
  
  const content = document.getElementById('checkpoint-content');
  if (content) {
    content.innerHTML = `
      <div class="alert info">
        <sl-icon name="calendar-check"></sl-icon>
        <div>
          <strong>Checkpoint</strong>
          <p>Point régulier pour documenter votre progression et vos apprentissages.</p>
        </div>
      </div>
      <form id="form-checkpoint">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <sl-input name="date" label="Date du checkpoint" type="date" value="${new Date().toISOString().split('T')[0]}" required></sl-input>
          <sl-select name="type" label="Type de checkpoint" value="weekly" required>
            <sl-option value="weekly">Hebdomadaire</sl-option>
            <sl-option value="monthly">Mensuel</sl-option>
            <sl-option value="milestone">Jalon important</sl-option>
          </sl-select>
          <sl-textarea name="achievements" label="Réalisations de la période" rows="4" required></sl-textarea>
          <sl-textarea name="learnings" label="Apprentissages clés" rows="4" required></sl-textarea>
          <sl-textarea name="challenges" label="Défis rencontrés" rows="3"></sl-textarea>
          <sl-textarea name="next_actions" label="Actions pour la prochaine période" rows="3" required></sl-textarea>
        </div>
        <div class="modal-footer">
          <sl-button variant="text" id="btn-cancel-checkpoint">Annuler</sl-button>
          <sl-button variant="primary" type="submit">Enregistrer le checkpoint</sl-button>
        </div>
      </form>
    `;
  }
  
  modal.show();
  
  // Handle submit
  const form = document.getElementById('form-checkpoint');
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = {
        type: 'checkpoint',
        checkpoint_type: formData.get('type'),
        date: formData.get('date'),
        achievements: formData.get('achievements'),
        learnings: formData.get('learnings'),
        challenges: formData.get('challenges'),
        next_actions: formData.get('next_actions')
      };
      
      try {
        console.log('📅 Checkpoint:', data);
        modal.hide();
        showToast('Checkpoint enregistré', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-checkpoint');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}

/**
 * Ouvrir modal bilan final
 */
function openFinalReportModal() {
  const modal = document.getElementById('modal-final-report');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-final-report');
    return;
  }
  
  const content = document.getElementById('final-report-content');
  if (content) {
    content.innerHTML = `
      <div class="alert success">
        <sl-icon name="check-circle"></sl-icon>
        <div>
          <strong>Bilan final de mission</strong>
          <p>Synthèse complète de votre mission et des apprentissages réalisés.</p>
        </div>
      </div>
      <form id="form-final-report">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <sl-textarea name="summary" label="Résumé de la mission" rows="4" required></sl-textarea>
          <sl-textarea name="objectives_achieved" label="Objectifs atteints" rows="4" required></sl-textarea>
          <sl-textarea name="key_learnings" label="Apprentissages clés" rows="4" required></sl-textarea>
          <sl-textarea name="challenges_overcome" label="Défis surmontés" rows="3"></sl-textarea>
          <sl-textarea name="recommendations" label="Recommandations pour l'avenir" rows="4" required></sl-textarea>
          <sl-textarea name="personal_growth" label="Évolution personnelle" rows="3"></sl-textarea>
        </div>
        <div class="modal-footer">
          <sl-button variant="text" id="btn-cancel-final-report">Annuler</sl-button>
          <sl-button variant="primary" type="submit">Enregistrer le bilan</sl-button>
        </div>
      </form>
    `;
  }
  
  modal.show();
  
  // Handle submit
  const form = document.getElementById('form-final-report');
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = {
        type: 'final',
        summary: formData.get('summary'),
        objectives_achieved: formData.get('objectives_achieved'),
        key_learnings: formData.get('key_learnings'),
        challenges_overcome: formData.get('challenges_overcome'),
        recommendations: formData.get('recommendations'),
        personal_growth: formData.get('personal_growth'),
        date: new Date().toISOString()
      };
      
      try {
        console.log('🏁 Bilan final:', data);
        modal.hide();
        showToast('Bilan final enregistré', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-final-report');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}

/**
 * Ouvrir modal import
 */
function openImportModal() {
  const modal = document.getElementById('modal-import');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-import');
    return;
  }
  
  modal.show();
  
  let importedData = null;
  
  // Handle file selection
  const fileInput = document.getElementById('import-file-input');
  if (fileInput) {
    fileInput.addEventListener('sl-change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        importedData = JSON.parse(text);
        
        // Preview
        const preview = document.getElementById('import-preview');
        const previewContent = document.getElementById('import-preview-content');
        
        if (preview && previewContent) {
          preview.style.display = 'block';
          previewContent.innerHTML = `
            <ul>
              <li><strong>Missions :</strong> ${importedData.missions?.length || 0}</li>
              <li><strong>Rapports :</strong> ${importedData.reports?.length || 0}</li>
              <li><strong>Date d'export :</strong> ${importedData.exportDate ? formatDate(importedData.exportDate) : 'N/A'}</li>
            </ul>
          `;
        }
        
        // Enable import button
        document.getElementById('btn-confirm-import').disabled = false;
        
      } catch (error) {
        console.error('❌ Erreur lecture fichier:', error);
        showToast('Fichier JSON invalide', 'danger');
      }
    });
  }
  
  // Handle import
  const btnConfirm = document.getElementById('btn-confirm-import');
  if (btnConfirm) {
    btnConfirm.onclick = () => {
      if (!importedData) return;
      
      try {
        // Merge missions
        if (importedData.missions) {
          const existingMissions = APP_STATE.missions;
          const newMissions = importedData.missions.filter(m => 
            !existingMissions.find(em => em.id === m.id)
          );
          APP_STATE.missions = [...existingMissions, ...newMissions];
          localStorage.setItem('mission_tracker_missions', JSON.stringify(APP_STATE.missions));
        }
        
        // Merge reports
        if (importedData.reports) {
          const existingReports = JSON.parse(localStorage.getItem('mission_tracker_reports') || '[]');
          const newReports = importedData.reports.filter(r => 
            !existingReports.find(er => er.id === r.id)
          );
          const allReports = [...existingReports, ...newReports];
          localStorage.setItem('mission_tracker_reports', JSON.stringify(allReports));
        }
        
        modal.hide();
        showToast('Import réussi', 'success');
        renderDashboard();
        renderMissionsList();
        
      } catch (error) {
        console.error('❌ Erreur import:', error);
        showToast('Erreur lors de l\'import', 'danger');
      }
    };
  }
  
  // Cancel button
  document.getElementById('btn-cancel-import').onclick = () => modal.hide();
}

/**
 * Ouvrir modal settings
 */
function openSettingsModal() {
  const modal = document.getElementById('modal-settings');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-settings');
    return;
  }
  
  // Load current settings
  const settings = JSON.parse(localStorage.getItem('mission_tracker_settings') || '{}');
  
  document.getElementById('setting-dark-mode').checked = settings.darkMode !== false;
  document.getElementById('setting-animations').checked = settings.animations !== false;
  document.getElementById('setting-notifications').checked = settings.notifications !== false;
  document.getElementById('setting-sound').checked = settings.sound === true;
  
  modal.show();
  
  // Clear cache
  document.getElementById('btn-clear-cache').onclick = () => {
    if (confirm('Vider le cache ? Cette action est irréversible.')) {
      // Clear only cache, not data
      showToast('Cache vidé', 'success');
    }
  };
  
  // Reset data
  document.getElementById('btn-reset-data').onclick = () => {
    if (confirm('⚠️ ATTENTION : Toutes vos données seront supprimées définitivement. Êtes-vous sûr ?')) {
      if (confirm('Dernière confirmation : Voulez-vous vraiment tout supprimer ?')) {
        localStorage.clear();
        location.reload();
      }
    }
  };
  
  // Save settings
  document.getElementById('btn-save-settings').onclick = () => {
    const newSettings = {
      darkMode: document.getElementById('setting-dark-mode').checked,
      animations: document.getElementById('setting-animations').checked,
      notifications: document.getElementById('setting-notifications').checked,
      sound: document.getElementById('setting-sound').checked
    };
    
    localStorage.setItem('mission_tracker_settings', JSON.stringify(newSettings));
    
    // Apply dark mode
    if (newSettings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    modal.hide();
    showToast('Paramètres enregistrés', 'success');
  };
  
  // Close button
  document.getElementById('btn-close-settings').onclick = () => modal.hide();
}

/**
 * Ouvrir modal help
 */
function openHelpModal() {
  const modal = document.getElementById('modal-help');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-help');
    return;
  }
  
  modal.show();
  
  // Close button
  document.getElementById('btn-close-help').onclick = () => modal.hide();
}

/**
 * Ouvrir modal export
 */
function openExportModal() {
  const modal = document.getElementById('modal-export');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-export');
    return;
  }
  
  modal.show();
  
  // Handle export
  const btnConfirm = document.getElementById('btn-confirm-export');
  if (btnConfirm) {
    btnConfirm.onclick = async () => {
      const format = document.querySelector('sl-radio-group[name="export-format"]')?.value || 'pdf';
      const scope = document.getElementById('export-scope')?.value || [];
      
      console.log('📥 Export:', { format, scope });
      
      try {
        // Implémenter l'export basique
        const data = {
          missions: APP_STATE.missions,
          reports: JSON.parse(localStorage.getItem('mission_tracker_reports') || '[]'),
          exportDate: new Date().toISOString(),
          format: format,
          scope: scope
        };
        
        if (format === 'json') {
          // Export JSON
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mission-tracker-export-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Export JSON réussi', 'success');
        } else {
          // PDF et Markdown à implémenter
          showToast(`Export ${format.toUpperCase()} en cours de développement`, 'info');
        }
        
        modal.hide();
      } catch (error) {
        console.error('❌ Erreur export:', error);
        showToast('Erreur lors de l\'export', 'danger');
      }
    };
  }
  
  // Cancel button
  const btnCancel = document.getElementById('btn-cancel-export');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}

/**
 * Ouvrir modal ajout réalisation
 */
function openAddAchievementModal() {
  const modal = document.getElementById('modal-add-achievement');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-achievement');
    return;
  }
  
  const form = document.getElementById('form-add-achievement');
  if (form) {
    form.reset();
    // Date du jour par défaut
    form.querySelector('[name="achievement_date"]').value = new Date().toISOString().split('T')[0];
  }
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const achievement = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: formData.get('achievement_title'),
        category: formData.get('achievement_category'),
        description: formData.get('achievement_description'),
        date: formData.get('achievement_date'),
        impact: formData.get('achievement_impact'),
        createdAt: new Date().toISOString()
      };
      
      try {
        const achievements = JSON.parse(localStorage.getItem('mission_tracker_achievements') || '[]');
        achievements.push(achievement);
        localStorage.setItem('mission_tracker_achievements', JSON.stringify(achievements));
        modal.hide();
        await showToast('Réalisation ajoutée', 'success');
        renderRecentAchievements();
      } catch (error) {
        console.error('❌ Erreur:', error);
        await showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-achievement').onclick = () => modal.hide();
}

/**
 * Ouvrir modal ajout défi
 */
function openAddChallengeModal() {
  const modal = document.getElementById('modal-add-challenge');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-challenge');
    return;
  }
  
  const form = document.getElementById('form-add-challenge');
  if (form) {
    form.reset();
    // Date du jour par défaut
    form.querySelector('[name="challenge_date"]').value = new Date().toISOString().split('T')[0];
  }
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const challenge = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: formData.get('challenge_title'),
        severity: formData.get('challenge_severity'),
        description: formData.get('challenge_description'),
        actions: formData.get('challenge_actions'),
        date: formData.get('challenge_date'),
        status: formData.get('challenge_status'),
        createdAt: new Date().toISOString()
      };
      
      try {
        const challenges = JSON.parse(localStorage.getItem('mission_tracker_challenges') || '[]');
        challenges.push(challenge);
        localStorage.setItem('mission_tracker_challenges', JSON.stringify(challenges));
        modal.hide();
        await showToast('Défi ajouté', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        await showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-challenge').onclick = () => modal.hide();
}

/**
 * Ouvrir modal expérimentation rapide
 */
function openQuickExperimentModal() {
  const modal = document.getElementById('modal-quick-experiment');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-quick-experiment');
    return;
  }
  
  const form = document.getElementById('form-quick-experiment');
  if (form) {
    form.reset();
    // Date du jour par défaut
    form.querySelector('[name="experiment_start"]').value = new Date().toISOString().split('T')[0];
  }
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const experiment = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: formData.get('experiment_title'),
        hypothesis: formData.get('experiment_hypothesis'),
        method: formData.get('experiment_method'),
        success: formData.get('experiment_success'),
        startDate: formData.get('experiment_start'),
        duration: parseInt(formData.get('experiment_duration')),
        createdAt: new Date().toISOString()
      };
      
      try {
        const experiments = JSON.parse(localStorage.getItem('mission_tracker_experiments') || '[]');
        experiments.push(experiment);
        localStorage.setItem('mission_tracker_experiments', JSON.stringify(experiments));
        modal.hide();
        await showToast('Expérimentation lancée', 'success');
        renderRoadmapTab();
      } catch (error) {
        console.error('❌ Erreur:', error);
        await showToast('Erreur lors du lancement', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-quick-experiment').onclick = () => modal.hide();
}

/**
 * Ouvrir modal édition vision
 */
function openEditVisionModal() {
  const modal = document.getElementById('modal-edit-vision');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-edit-vision');
    return;
  }
  
  // Charger les données existantes
  const vision = JSON.parse(localStorage.getItem('mission_tracker_vision') || '{}');
  const form = document.getElementById('form-edit-vision');
  if (form && vision) {
    form.querySelector('[name="vision"]').value = vision.vision || '';
    form.querySelector('[name="values"]').value = vision.values || '';
    form.querySelector('[name="goals"]').value = vision.goals || '';
  }
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        vision: formData.get('vision'),
        values: formData.get('values'),
        goals: formData.get('goals'),
        updatedAt: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('mission_tracker_vision', JSON.stringify(data));
        modal.hide();
        renderRoadmapTab();
        showToast('Vision enregistrée', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-vision').onclick = () => modal.hide();
}

/**
 * Ouvrir modal ajout compétence
 */
function openAddSkillModal() {
  const modal = document.getElementById('modal-add-skill');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-skill');
    return;
  }
  
  const form = document.getElementById('form-add-skill');
  if (form) form.reset();
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const skill = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: formData.get('skill_name'),
        level: formData.get('skill_level'),
        category: formData.get('skill_category'),
        description: formData.get('skill_description'),
        createdAt: new Date().toISOString()
      };
      
      try {
        const skills = JSON.parse(localStorage.getItem('mission_tracker_skills') || '[]');
        skills.push(skill);
        localStorage.setItem('mission_tracker_skills', JSON.stringify(skills));
        modal.hide();
        renderRoadmapTab();
        showToast('Compétence ajoutée', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-skill').onclick = () => modal.hide();
}

/**
 * Ouvrir modal ajout compétence à développer
 */
function openAddSkillToDevelopModal() {
  const modal = document.getElementById('modal-add-skill-to-develop');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-skill-to-develop');
    return;
  }
  
  const form = document.getElementById('form-add-skill-to-develop');
  if (form) form.reset();
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const skill = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: formData.get('skill_name'),
        priority: formData.get('priority'),
        why: formData.get('why'),
        how: formData.get('how'),
        targetDate: formData.get('target_date'),
        createdAt: new Date().toISOString()
      };
      
      try {
        const skills = JSON.parse(localStorage.getItem('mission_tracker_skills_to_develop') || '[]');
        skills.push(skill);
        localStorage.setItem('mission_tracker_skills_to_develop', JSON.stringify(skills));
        modal.hide();
        renderRoadmapTab();
        showToast('Compétence à développer ajoutée', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-skill-to-develop').onclick = () => modal.hide();
}

/**
 * Ouvrir modal ajout objectif d'apprentissage
 */
function openAddLearningGoalModal() {
  const modal = document.getElementById('modal-add-learning-goal');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-learning-goal');
    return;
  }
  
  const form = document.getElementById('form-add-learning-goal');
  if (form) form.reset();
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const goal = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: formData.get('goal_title'),
        type: formData.get('goal_type'),
        description: formData.get('goal_description'),
        deadline: formData.get('goal_deadline'),
        resources: formData.get('goal_resources'),
        createdAt: new Date().toISOString()
      };
      
      try {
        const goals = JSON.parse(localStorage.getItem('mission_tracker_learning_goals') || '[]');
        goals.push(goal);
        localStorage.setItem('mission_tracker_learning_goals', JSON.stringify(goals));
        modal.hide();
        renderRoadmapTab();
        showToast('Objectif d\'apprentissage ajouté', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-learning-goal').onclick = () => modal.hide();
}

/**
 * Ouvrir modal ajout expérimentation
 */
function openAddExperimentModal() {
  const modal = document.getElementById('modal-add-experiment');
  if (!modal) {
    console.error('❌ Modal non trouvée: modal-add-experiment');
    return;
  }
  
  const form = document.getElementById('form-add-experiment');
  if (form) form.reset();
  
  modal.show();
  
  // Handle submit
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const experiment = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: formData.get('experiment_title'),
        hypothesis: formData.get('experiment_hypothesis'),
        method: formData.get('experiment_method'),
        success: formData.get('experiment_success'),
        startDate: formData.get('experiment_start'),
        duration: parseInt(formData.get('experiment_duration')),
        createdAt: new Date().toISOString()
      };
      
      try {
        const experiments = JSON.parse(localStorage.getItem('mission_tracker_experiments') || '[]');
        experiments.push(experiment);
        localStorage.setItem('mission_tracker_experiments', JSON.stringify(experiments));
        modal.hide();
        renderRoadmapTab();
        showToast('Expérimentation ajoutée', 'success');
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'ajout', 'danger');
      }
      
      form.removeEventListener('submit', handleSubmit);
    };
    
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // Cancel button
  document.getElementById('btn-cancel-experiment').onclick = () => modal.hide();
}

// ==========================================
// EXPORTS
// ==========================================

window.missionTracker = {
  showView,
  openCreateMissionModal,
  openEditMissionModal,
  openInitialReportModal,
  openCheckpointModal,
  openFinalReportModal,
  openExportModal,
  openImportModal,
  openSettingsModal,
  openHelpModal,
  openAddAchievementModal,
  openAddChallengeModal,
  openQuickExperimentModal,
  openEditVisionModal,
  openAddSkillModal,
  openAddSkillToDevelopModal,
  openAddLearningGoalModal,
  openAddExperimentModal,
  renderMissionsList,
  renderTimelineTab,
  renderRoadmapTab
};

console.log('✅ Mission Tracker loaded');


// ==========================================
// DEMO TEMPLATES
// ==========================================

/**
 * Ouvrir la modale de chargement de démo
 */
function openLoadDemoModal() {
  const modal = document.getElementById('modal-load-demo');
  if (!modal) return;
  
  modal.show();
  
  // Event listeners pour les boutons de chargement
  const loadButtons = modal.querySelectorAll('.btn-load-template');
  loadButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const card = e.target.closest('.demo-card');
      const templateName = card.dataset.template;
      await loadDemoTemplate(templateName);
      modal.hide();
    }, { once: true });
  });
  
  // Bouton annuler
  document.getElementById('btn-cancel-demo')?.addEventListener('click', () => {
    modal.hide();
  }, { once: true });
}

/**
 * Charger un template de démo
 */
async function loadDemoTemplate(templateName) {
  try {
    console.log('📥 Chargement du template:', templateName);
    
    // Charger le fichier JSON
    const response = await fetch(`templates/${templateName}.json`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const template = await response.json();
    console.log('✅ Template chargé:', template.name);
    
    // Confirmer le remplacement
    const confirm = window.confirm(
      `Voulez-vous charger la démo "${template.name}" ?\n\n` +
      `⚠️ Cela remplacera toutes vos données actuelles.\n\n` +
      `Pensez à exporter vos données avant si nécessaire.`
    );
    
    if (!confirm) {
      console.log('❌ Chargement annulé par l\'utilisateur');
      return;
    }
    
    // Vider les données actuelles
    localStorage.clear();
    
    // Charger les données du template
    const data = template.data;
    
    // Sauvegarder les missions
    if (data.missions) {
      localStorage.setItem('mission_tracker_missions', JSON.stringify(data.missions));
      APP_STATE.missions = data.missions;
      console.log('✅ Missions chargées:', data.missions.length);
    }
    
    // Sauvegarder les événements
    if (data.events) {
      localStorage.setItem('mission_tracker_events', JSON.stringify(data.events));
      console.log('✅ Événements chargés:', data.events.length);
    }
    
    // Sauvegarder les réalisations
    if (data.achievements) {
      localStorage.setItem('mission_tracker_achievements', JSON.stringify(data.achievements));
      console.log('✅ Réalisations chargées:', data.achievements.length);
    }
    
    // Sauvegarder les défis
    if (data.challenges) {
      localStorage.setItem('mission_tracker_challenges', JSON.stringify(data.challenges));
      console.log('✅ Défis chargés:', data.challenges.length);
    }
    
    // Sauvegarder les expérimentations
    if (data.experiments) {
      localStorage.setItem('mission_tracker_experiments', JSON.stringify(data.experiments));
      console.log('✅ Expérimentations chargées:', data.experiments.length);
    }
    
    // Sauvegarder les checkpoints
    if (data.checkpoints) {
      localStorage.setItem('mission_tracker_checkpoints', JSON.stringify(data.checkpoints));
      console.log('✅ Checkpoints chargés:', data.checkpoints.length);
    }
    
    // Sauvegarder les rapports
    if (data.reports) {
      localStorage.setItem('mission_tracker_reports', JSON.stringify(data.reports));
      console.log('✅ Rapports chargés:', data.reports.length);
    }
    
    // Sauvegarder la roadmap
    if (data.roadmap) {
      localStorage.setItem('mission_tracker_roadmap', JSON.stringify(data.roadmap));
      console.log('✅ Roadmap chargée:', data.roadmap.length);
    }
    
    // Sauvegarder la vision
    if (data.vision) {
      localStorage.setItem('mission_tracker_vision', JSON.stringify(data.vision));
      console.log('✅ Vision chargée');
    }
    
    // Sauvegarder les compétences
    if (data.skills) {
      localStorage.setItem('mission_tracker_skills', JSON.stringify(data.skills));
      console.log('✅ Compétences chargées:', data.skills.length);
    }
    
    // Sauvegarder les compétences à développer
    if (data.skills_to_develop) {
      localStorage.setItem('mission_tracker_skills_to_develop', JSON.stringify(data.skills_to_develop));
      console.log('✅ Compétences à développer chargées:', data.skills_to_develop.length);
    }
    
    // Sauvegarder les objectifs d'apprentissage
    if (data.learning_goals) {
      localStorage.setItem('mission_tracker_learning_goals', JSON.stringify(data.learning_goals));
      console.log('✅ Objectifs d\'apprentissage chargés:', data.learning_goals.length);
    }
    
    // Recharger l'application
    await loadMissions();
    showView('dashboard');
    
    await showToast(
      `Démo "${template.name}" chargée avec succès ! 🎉`,
      'success'
    );
    
    console.log('✅ Démo chargée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur chargement template:', error);
    await showToast(
      'Erreur lors du chargement de la démo',
      'danger'
    );
  }
}


// ==========================================
// ANALYTICS TAB
// ==========================================

/**
 * Render onglet Analytics
 */
function renderAnalyticsTab() {
  console.log('📊 Render Analytics Tab');
  
  // Calculer les statistiques
  const stats = calculateAnalyticsStats();
  
  // Répartition par rôle
  renderRoleDistribution(stats.roleDistribution);
  
  // Évolution des compétences
  renderSkillsEvolution(stats.skills);
  
  // Mood tracker
  renderMoodTracker(stats.checkpoints);
  
  // Réalisations par catégorie
  renderAchievementsByCategory(stats.achievements);
  
  // Défis
  renderChallengesStatus(stats.challenges);
  
  // Expérimentations
  renderExperimentsStats(stats.experiments);
}

/**
 * Calculer les statistiques pour analytics
 */
function calculateAnalyticsStats() {
  const missions = APP_STATE.missions || [];
  const checkpoints = JSON.parse(localStorage.getItem('mission_tracker_checkpoints') || '[]');
  const achievements = JSON.parse(localStorage.getItem('mission_tracker_achievements') || '[]');
  const challenges = JSON.parse(localStorage.getItem('mission_tracker_challenges') || '[]');
  const experiments = JSON.parse(localStorage.getItem('mission_tracker_experiments') || '[]');
  const skills = JSON.parse(localStorage.getItem('mission_tracker_skills') || '[]');
  
  // Répartition par rôle
  const roleDistribution = {};
  missions.forEach(m => {
    roleDistribution[m.role] = (roleDistribution[m.role] || 0) + 1;
  });
  
  return {
    roleDistribution,
    checkpoints,
    achievements,
    challenges,
    experiments,
    skills
  };
}

/**
 * Render répartition par rôle
 */
function renderRoleDistribution(distribution) {
  const container = document.getElementById('chart-roles');
  if (!container) return;
  
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    container.parentElement.innerHTML = '<div class="analytics-empty">Aucune donnée</div>';
    return;
  }
  
  const roles = APP_STATE.config?.roles || [];
  
  container.parentElement.innerHTML = `
    <h3>📊 Répartition par rôle</h3>
    <div class="analytics-bars">
      ${Object.entries(distribution).map(([roleId, count]) => {
        const role = roles.find(r => r.id === roleId);
        const percentage = Math.round((count / total) * 100);
        return `
          <div class="analytics-bar-item">
            <div class="analytics-bar-label">
              <span>${role?.icon || '🎯'} ${role?.name || roleId}</span>
              <span class="analytics-bar-value">${count} (${percentage}%)</span>
            </div>
            <div class="analytics-bar-track">
              <div class="analytics-bar-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render évolution des compétences
 */
function renderSkillsEvolution(skills) {
  const container = document.getElementById('chart-skills');
  if (!container) return;
  
  if (skills.length === 0) {
    container.parentElement.innerHTML = '<div class="analytics-empty">Aucune compétence enregistrée</div>';
    return;
  }
  
  const maxLevel = 5;
  
  container.parentElement.innerHTML = `
    <h3>📈 Évolution des compétences</h3>
    <div class="analytics-bars">
      ${skills.slice(0, 6).map(skill => {
        const percentage = (skill.level / maxLevel) * 100;
        return `
          <div class="analytics-bar-item">
            <div class="analytics-bar-label">
              <span>${skill.name}</span>
              <span class="analytics-bar-value">${skill.level}/${maxLevel}</span>
            </div>
            <div class="analytics-bar-track">
              <div class="analytics-bar-fill skill-level-${skill.level}" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render mood tracker
 */
function renderMoodTracker(checkpoints) {
  const container = document.getElementById('chart-mood');
  if (!container) return;
  
  if (checkpoints.length === 0) {
    container.parentElement.innerHTML = '<div class="analytics-empty">Aucun checkpoint enregistré</div>';
    return;
  }
  
  const moodIcons = {
    great: '😄',
    good: '🙂',
    neutral: '😐',
    bad: '😞'
  };
  
  const moodLabels = {
    great: 'Excellent',
    good: 'Bien',
    neutral: 'Neutre',
    bad: 'Difficile'
  };
  
  const moodCounts = {};
  checkpoints.forEach(cp => {
    if (cp.mood) {
      moodCounts[cp.mood] = (moodCounts[cp.mood] || 0) + 1;
    }
  });
  
  const total = Object.values(moodCounts).reduce((sum, val) => sum + val, 0);
  
  container.parentElement.innerHTML = `
    <h3>😊 Mood tracker</h3>
    <div class="analytics-mood-grid">
      ${Object.entries(moodCounts).map(([mood, count]) => {
        const percentage = Math.round((count / total) * 100);
        return `
          <div class="analytics-mood-item">
            <div class="analytics-mood-icon">${moodIcons[mood]}</div>
            <div class="analytics-mood-label">${moodLabels[mood]}</div>
            <div class="analytics-mood-value">${count} (${percentage}%)</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render réalisations par catégorie
 */
function renderAchievementsByCategory(achievements) {
  const container = document.getElementById('chart-achievements');
  if (!container) return;
  
  if (achievements.length === 0) {
    container.parentElement.innerHTML = '<div class="analytics-empty">Aucune réalisation enregistrée</div>';
    return;
  }
  
  const categories = {};
  achievements.forEach(a => {
    const cat = a.category || 'other';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
  
  container.parentElement.innerHTML = `
    <h3>🏆 Réalisations par catégorie</h3>
    <div class="analytics-bars">
      ${Object.entries(categories).map(([category, count]) => {
        const percentage = Math.round((count / total) * 100);
        return `
          <div class="analytics-bar-item">
            <div class="analytics-bar-label">
              <span>${category}</span>
              <span class="analytics-bar-value">${count} (${percentage}%)</span>
            </div>
            <div class="analytics-bar-track">
              <div class="analytics-bar-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render statut des défis
 */
function renderChallengesStatus(challenges) {
  const container = document.getElementById('chart-challenges');
  if (!container) return;
  
  if (challenges.length === 0) {
    container.parentElement.innerHTML = '<div class="analytics-empty">Aucun défi enregistré</div>';
    return;
  }
  
  const statusCounts = {
    resolved: 0,
    in_progress: 0,
    identified: 0,
    escalated: 0
  };
  
  challenges.forEach(c => {
    if (statusCounts[c.status] !== undefined) {
      statusCounts[c.status]++;
    }
  });
  
  const statusLabels = {
    resolved: '✅ Résolus',
    in_progress: '🔄 En cours',
    identified: '🆕 Identifiés',
    escalated: '⚠️ Escaladés'
  };
  
  container.parentElement.innerHTML = `
    <h3>🛡️ Défis résolus vs en cours</h3>
    <div class="analytics-stats-grid">
      ${Object.entries(statusCounts).map(([status, count]) => `
        <div class="analytics-stat-card">
          <div class="analytics-stat-value">${count}</div>
          <div class="analytics-stat-label">${statusLabels[status]}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render statistiques expérimentations
 */
function renderExperimentsStats(experiments) {
  const container = document.getElementById('experiments-stats');
  if (!container) return;
  
  if (experiments.length === 0) {
    container.innerHTML = '<div class="analytics-empty">Aucune expérimentation enregistrée</div>';
    return;
  }
  
  const outcomes = {
    success: 0,
    partial_success: 0,
    failure: 0,
    inconclusive: 0
  };
  
  experiments.forEach(e => {
    if (e.outcome && outcomes[e.outcome] !== undefined) {
      outcomes[e.outcome]++;
    }
  });
  
  const outcomeLabels = {
    success: '✅ Succès',
    partial_success: '⚡ Succès partiel',
    failure: '❌ Échec',
    inconclusive: '❓ Non concluant'
  };
  
  container.innerHTML = `
    <div class="analytics-stats-grid">
      ${Object.entries(outcomes).map(([outcome, count]) => `
        <div class="analytics-stat-card">
          <div class="analytics-stat-value">${count}</div>
          <div class="analytics-stat-label">${outcomeLabels[outcome]}</div>
        </div>
      `).join('')}
    </div>
    <div class="analytics-total">
      Total: ${experiments.length} expérimentation${experiments.length > 1 ? 's' : ''}
    </div>
  `;
}


// ==========================================
// REPORTS TAB
// ==========================================

/**
 * Render onglet Rapports
 */
function renderReportsTab() {
  console.log('📄 Render Reports Tab');
  
  // Charger tous les rapports et checkpoints
  const reports = JSON.parse(localStorage.getItem('mission_tracker_reports') || '[]');
  const checkpoints = JSON.parse(localStorage.getItem('mission_tracker_checkpoints') || '[]');
  
  // Compter par type
  const initialReports = reports.filter(r => r.type === 'initial');
  const finalReports = reports.filter(r => r.type === 'final');
  
  // Mettre à jour les badges
  document.getElementById('initial-reports-count').textContent = initialReports.length;
  document.getElementById('checkpoints-count').textContent = checkpoints.length;
  document.getElementById('final-reports-count').textContent = finalReports.length;
  
  // Type de rapport actif
  let activeType = 'initial';
  
  // Event listeners pour les boutons de type
  document.querySelectorAll('.report-type-card').forEach(btn => {
    btn.addEventListener('click', () => {
      // Retirer active de tous
      document.querySelectorAll('.report-type-card').forEach(b => b.classList.remove('active'));
      // Ajouter active au bouton cliqué
      btn.classList.add('active');
      // Mettre à jour le type actif
      activeType = btn.dataset.reportType;
      // Recharger la liste
      renderReportsList(activeType, reports, checkpoints);
    });
  });
  
  // Afficher la liste initiale
  renderReportsList(activeType, reports, checkpoints);
  
  // Event listener pour nouveau rapport
  document.getElementById('btn-new-report')?.addEventListener('click', () => {
    if (activeType === 'initial') {
      openReportModal('etonnement');
    } else if (activeType === 'checkpoint') {
      openCheckpointModal();
    } else if (activeType === 'final') {
      openReportModal('final');
    }
  });
}

/**
 * Render liste des rapports selon le type
 */
function renderReportsList(type, reports, checkpoints) {
  const container = document.getElementById('reports-list');
  if (!container) return;
  
  let items = [];
  
  if (type === 'initial') {
    items = reports.filter(r => r.type === 'initial');
  } else if (type === 'checkpoint') {
    items = checkpoints;
  } else if (type === 'final') {
    items = reports.filter(r => r.type === 'final');
  }
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>Aucun ${getReportTypeLabel(type)}</h3>
        <p>${getReportTypeDescription(type)}</p>
        <button class="btn btn-primary" id="btn-create-first-report">
          <sl-icon name="plus-circle"></sl-icon>
          Créer le premier ${getReportTypeLabel(type)}
        </button>
      </div>
    `;
    
    document.getElementById('btn-create-first-report')?.addEventListener('click', () => {
      if (type === 'initial') {
        openReportModal('etonnement');
      } else if (type === 'checkpoint') {
        openCheckpointModal();
      } else if (type === 'final') {
        openReportModal('final');
      }
    });
    
    return;
  }
  
  // Afficher les rapports
  if (type === 'checkpoint') {
    container.innerHTML = items.map(checkpoint => renderCheckpointCard(checkpoint)).join('');
  } else {
    container.innerHTML = items.map(report => renderReportCard(report)).join('');
  }
  
  // Event listeners pour les cartes
  container.querySelectorAll('.report-card').forEach(card => {
    card.addEventListener('click', () => {
      const reportId = card.dataset.reportId;
      const report = items.find(r => r.id === reportId);
      if (report) {
        openReportDetailModal(report);
      }
    });
  });
}

/**
 * Render carte de rapport
 */
function renderReportCard(report) {
  const mission = APP_STATE.missions.find(m => m.id === report.mission_id);
  const missionTitle = mission ? mission.title : 'Mission inconnue';
  
  return `
    <div class="report-card" data-report-id="${report.id}">
      <div class="report-card-header">
        <div class="report-card-icon">
          ${report.type === 'initial' ? '📝' : '📊'}
        </div>
        <div class="report-card-info">
          <h3>${report.title}</h3>
          <p class="report-card-mission">${missionTitle}</p>
        </div>
        <div class="report-card-date">
          ${formatDate(report.date)}
        </div>
      </div>
      <div class="report-card-preview">
        ${getReportPreview(report)}
      </div>
      <div class="report-card-footer">
        <button class="btn btn-sm btn-ghost">
          <sl-icon name="eye"></sl-icon>
          Voir le détail
        </button>
      </div>
    </div>
  `;
}

/**
 * Render carte de checkpoint
 */
function renderCheckpointCard(checkpoint) {
  const mission = APP_STATE.missions.find(m => m.id === checkpoint.mission_id);
  const missionTitle = mission ? mission.title : 'Mission inconnue';
  
  const moodEmojis = {
    great: '😄',
    good: '🙂',
    neutral: '😐',
    bad: '😞'
  };
  
  return `
    <div class="report-card checkpoint-card" data-report-id="${checkpoint.id}">
      <div class="report-card-header">
        <div class="report-card-icon">
          ${moodEmojis[checkpoint.mood] || '📅'}
        </div>
        <div class="report-card-info">
          <h3>Checkpoint ${checkpoint.type}</h3>
          <p class="report-card-mission">${missionTitle}</p>
        </div>
        <div class="report-card-date">
          ${formatDate(checkpoint.date)}
        </div>
      </div>
      <div class="report-card-stats">
        <div class="checkpoint-stat">
          <span class="stat-label">Énergie</span>
          <span class="stat-value">${checkpoint.energy_level || 0}/5</span>
        </div>
        <div class="checkpoint-stat">
          <span class="stat-label">Highlights</span>
          <span class="stat-value">${checkpoint.highlights?.length || 0}</span>
        </div>
        <div class="checkpoint-stat">
          <span class="stat-label">Blockers</span>
          <span class="stat-value">${checkpoint.blockers?.length || 0}</span>
        </div>
      </div>
      <div class="report-card-footer">
        <button class="btn btn-sm btn-ghost">
          <sl-icon name="eye"></sl-icon>
          Voir le détail
        </button>
      </div>
    </div>
  `;
}

/**
 * Obtenir un aperçu du rapport
 */
function getReportPreview(report) {
  if (!report.content) return '<p>Aucun contenu</p>';
  
  const content = report.content;
  
  if (content.first_impressions) {
    return `<p>${content.first_impressions.substring(0, 150)}...</p>`;
  }
  
  if (content.summary) {
    return `<p>${content.summary.substring(0, 150)}...</p>`;
  }
  
  if (content.highlights && content.highlights.length > 0) {
    return `<p>✅ ${content.highlights[0]}</p>`;
  }
  
  return '<p>Voir le détail du rapport</p>';
}

/**
 * Obtenir le label du type de rapport
 */
function getReportTypeLabel(type) {
  const labels = {
    initial: 'rapport d\'étonnement',
    checkpoint: 'checkpoint',
    final: 'bilan final'
  };
  return labels[type] || type;
}

/**
 * Obtenir la description du type de rapport
 */
function getReportTypeDescription(type) {
  const descriptions = {
    initial: 'Documentez vos premières impressions après 15 jours de mission',
    checkpoint: 'Faites un point régulier sur l\'avancement de votre mission',
    final: 'Rédigez un bilan complet en fin de mission'
  };
  return descriptions[type] || '';
}

/**
 * Ouvrir modal détail rapport
 */
function openReportDetailModal(report) {
  console.log('📄 Ouverture détail rapport:', report);
  
  const modal = document.getElementById('modal-report-detail');
  if (!modal) {
    showToast('Modal non trouvée', 'warning');
    return;
  }
  
  // Mettre à jour le titre
  const titleElement = document.querySelector('#modal-report-detail [slot="label"]');
  if (titleElement) {
    const icon = report.type === 'initial' ? '📝' : report.type === 'final' ? '📊' : '📅';
    titleElement.textContent = `${icon} ${report.title || 'Détail du rapport'}`;
  }
  
  // Générer le contenu selon le type
  const contentElement = document.getElementById('report-detail-content');
  if (contentElement) {
    if (report.type === 'checkpoint' || report.checkpoint_type) {
      contentElement.innerHTML = renderCheckpointDetail(report);
    } else {
      contentElement.innerHTML = renderReportDetail(report);
    }
  }
  
  // Afficher la modale
  modal.show();
  
  // Event listeners
  document.getElementById('btn-close-report-detail')?.addEventListener('click', () => {
    modal.hide();
  }, { once: true });
  
  document.getElementById('btn-edit-report-detail')?.addEventListener('click', () => {
    modal.hide();
    showToast('Édition en développement', 'info');
  }, { once: true });
}

/**
 * Render détail d'un rapport
 */
function renderReportDetail(report) {
  const mission = APP_STATE.missions.find(m => m.id === report.mission_id);
  const content = report.content || {};
  
  let html = `
    <div class="report-detail-header">
      <div class="report-detail-meta">
        <div class="meta-item">
          <sl-icon name="briefcase"></sl-icon>
          <span>${mission ? mission.title : 'Mission inconnue'}</span>
        </div>
        <div class="meta-item">
          <sl-icon name="calendar"></sl-icon>
          <span>${formatDate(report.date)}</span>
        </div>
      </div>
    </div>
  `;
  
  // Rapport d'étonnement
  if (report.type === 'initial') {
    html += `
      ${content.first_impressions ? `
        <div class="report-section">
          <h3>💭 Premières impressions</h3>
          <p>${content.first_impressions}</p>
        </div>
      ` : ''}
      
      ${content.context ? `
        <div class="report-section">
          <h3>📋 Contexte</h3>
          <p>${content.context}</p>
        </div>
      ` : ''}
      
      ${content.strengths && content.strengths.length > 0 ? `
        <div class="report-section">
          <h3>💪 Forces identifiées</h3>
          <ul>
            ${content.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.challenges && content.challenges.length > 0 ? `
        <div class="report-section">
          <h3>⚠️ Défis identifiés</h3>
          <ul>
            ${content.challenges.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.quick_wins && content.quick_wins.length > 0 ? `
        <div class="report-section">
          <h3>🎯 Quick wins</h3>
          <ul>
            ${content.quick_wins.map(q => `<li>${q}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.recommendations && content.recommendations.length > 0 ? `
        <div class="report-section">
          <h3>💡 Recommandations</h3>
          <ul>
            ${content.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }
  
  // Bilan final
  if (report.type === 'final') {
    html += `
      ${content.summary ? `
        <div class="report-section">
          <h3>📊 Résumé</h3>
          <p>${content.summary}</p>
        </div>
      ` : ''}
      
      ${content.objectives_achieved && content.objectives_achieved.length > 0 ? `
        <div class="report-section">
          <h3>✅ Objectifs atteints</h3>
          <ul>
            ${content.objectives_achieved.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.key_achievements && content.key_achievements.length > 0 ? `
        <div class="report-section">
          <h3>🏆 Réalisations clés</h3>
          <ul>
            ${content.key_achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.lessons_learned && content.lessons_learned.length > 0 ? `
        <div class="report-section">
          <h3>📚 Leçons apprises</h3>
          <ul>
            ${content.lessons_learned.map(l => `<li>${l}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${content.recommendations && content.recommendations.length > 0 ? `
        <div class="report-section">
          <h3>💡 Recommandations</h3>
          <ul>
            ${content.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }
  
  return html;
}

/**
 * Render détail d'un checkpoint
 */
function renderCheckpointDetail(checkpoint) {
  const mission = APP_STATE.missions.find(m => m.id === checkpoint.mission_id);
  
  const moodEmojis = {
    great: '😄 Excellent',
    good: '🙂 Bien',
    neutral: '😐 Neutre',
    bad: '😞 Difficile'
  };
  
  return `
    <div class="report-detail-header">
      <div class="report-detail-meta">
        <div class="meta-item">
          <sl-icon name="briefcase"></sl-icon>
          <span>${mission ? mission.title : 'Mission inconnue'}</span>
        </div>
        <div class="meta-item">
          <sl-icon name="calendar"></sl-icon>
          <span>${formatDate(checkpoint.date)}</span>
        </div>
      </div>
    </div>
    
    <div class="checkpoint-stats-grid">
      <div class="checkpoint-stat-card">
        <div class="stat-icon">${moodEmojis[checkpoint.mood] || '😐'}</div>
        <div class="stat-label">Humeur</div>
      </div>
      <div class="checkpoint-stat-card">
        <div class="stat-value">${checkpoint.energy_level || 0}/5</div>
        <div class="stat-label">Énergie</div>
      </div>
      <div class="checkpoint-stat-card">
        <div class="stat-value">${checkpoint.progress_feeling || 0}/5</div>
        <div class="stat-label">Progression</div>
      </div>
    </div>
    
    ${checkpoint.highlights && checkpoint.highlights.length > 0 ? `
      <div class="report-section">
        <h3>✨ Highlights</h3>
        <ul>
          ${checkpoint.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${checkpoint.lowlights && checkpoint.lowlights.length > 0 ? `
      <div class="report-section">
        <h3>📉 Lowlights</h3>
        <ul>
          ${checkpoint.lowlights.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${checkpoint.blockers && checkpoint.blockers.length > 0 ? `
      <div class="report-section">
        <h3>🚧 Blockers</h3>
        <ul>
          ${checkpoint.blockers.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${checkpoint.learnings && checkpoint.learnings.length > 0 ? `
      <div class="report-section">
        <h3>📚 Apprentissages</h3>
        <ul>
          ${checkpoint.learnings.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${checkpoint.next_actions && checkpoint.next_actions.length > 0 ? `
      <div class="report-section">
        <h3>🎯 Prochaines actions</h3>
        <ul>
          ${checkpoint.next_actions.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  `;
}


// ==========================================
// FONCTIONS MANQUANTES
// ==========================================

/**
 * Ouvrir modal édition événement
 */
function openEditEventModal(event) {
  console.log('✏️ Édition événement:', event);
  
  // Pour l'instant, afficher les détails dans une alerte
  const details = `
Événement: ${event.title}
Type: ${event.type}
Date: ${formatDate(event.date)}
${event.description ? `Description: ${event.description}` : ''}
${event.impact ? `Impact: ${event.impact}` : ''}
${event.tags && event.tags.length > 0 ? `Tags: ${event.tags.join(', ')}` : ''}
  `.trim();
  
  if (confirm(`${details}\n\nVoulez-vous supprimer cet événement ?`)) {
    deleteEvent(event.id).then(() => {
      renderTimelineTab();
    });
  }
}

/**
 * Ouvrir modal rapport
 */
function openReportModal(type) {
  console.log('📄 Ouverture modal rapport:', type);
  
  if (type === 'etonnement') {
    const modal = document.getElementById('modal-report-etonnement');
    if (modal) {
      modal.show();
    } else {
      showToast('Modal rapport d\'étonnement non trouvée', 'warning');
    }
  } else if (type === 'final') {
    const modal = document.getElementById('modal-report-final');
    if (modal) {
      modal.show();
    } else {
      showToast('Modal bilan final non trouvée', 'warning');
    }
  }
}
