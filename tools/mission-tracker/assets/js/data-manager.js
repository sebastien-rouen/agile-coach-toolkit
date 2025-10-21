/**
 * Mission Tracker - Data Manager
 * Gestion des données (localStorage + PocketBase sync)
 */

// PocketBase est chargé via CDN (window.PocketBase)
import { pb } from '../../../../assets/js/shared/pocketbase.js';

// ==========================================
// CONFIGURATION
// ==========================================

const STORAGE_KEYS = {
  MISSIONS: 'mission_tracker_missions',
  EVENTS: 'mission_tracker_events',
  CURRENT_MISSION: 'mission_tracker_current',
  SETTINGS: 'mission_tracker_settings',
  SYNC_STATUS: 'mission_tracker_sync'
};

const COLLECTIONS = {
  MISSIONS: 'agile_missions',
  EVENTS: 'agile_mission_events'
};

// ==========================================
// MISSIONS - CRUD
// ==========================================

/**
 * Créer une mission
 */
export async function createMission(data) {
  const mission = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    objectives: data.objectives || [],
    metrics: data.metrics || [],
    events: []
  };
  
  // Sauvegarder localement
  const missions = getMissionsFromStorage();
  missions.push(mission);
  saveMissionsToStorage(missions);
  
  // Sync PocketBase si connecté
  if (pb.authStore.isValid) {
    try {
      const record = await pb.collection(COLLECTIONS.MISSIONS).create({
        ...mission,
        user_id: pb.authStore.model.id
      });
      mission.pb_id = record.id;
      updateMissionInStorage(mission);
    } catch (error) {
      console.warn('⚠️ Sync PocketBase échoué:', error);
      mission.needsSync = true;
      updateMissionInStorage(mission);
    }
  }
  
  return mission;
}

/**
 * Obtenir toutes les missions
 */
export function getMissions() {
  return getMissionsFromStorage();
}

/**
 * Obtenir une mission par ID
 */
export function getMissionById(id) {
  const missions = getMissionsFromStorage();
  return missions.find(m => m.id === id);
}

/**
 * Mettre à jour une mission
 */
export async function updateMission(id, updates) {
  const missions = getMissionsFromStorage();
  const index = missions.findIndex(m => m.id === id);
  
  if (index === -1) {
    throw new Error('Mission non trouvée');
  }
  
  missions[index] = {
    ...missions[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveMissionsToStorage(missions);
  
  // Sync PocketBase
  if (pb.authStore.isValid && missions[index].pb_id) {
    try {
      await pb.collection(COLLECTIONS.MISSIONS).update(missions[index].pb_id, updates);
    } catch (error) {
      console.warn('⚠️ Sync PocketBase échoué:', error);
      missions[index].needsSync = true;
      saveMissionsToStorage(missions);
    }
  }
  
  return missions[index];
}

/**
 * Supprimer une mission
 */
export async function deleteMission(id) {
  const missions = getMissionsFromStorage();
  const mission = missions.find(m => m.id === id);
  
  if (!mission) {
    throw new Error('Mission non trouvée');
  }
  
  // Supprimer de PocketBase
  if (pb.authStore.isValid && mission.pb_id) {
    try {
      await pb.collection(COLLECTIONS.MISSIONS).delete(mission.pb_id);
    } catch (error) {
      console.warn('⚠️ Suppression PocketBase échouée:', error);
    }
  }
  
  // Supprimer localement
  const filtered = missions.filter(m => m.id !== id);
  saveMissionsToStorage(filtered);
  
  // Supprimer les événements associés
  const events = getEventsFromStorage();
  const filteredEvents = events.filter(e => e.missionId !== id);
  saveEventsToStorage(filteredEvents);
}

// ==========================================
// EVENTS - CRUD
// ==========================================

/**
 * Créer un événement
 */
export async function createEvent(data) {
  const currentMission = getCurrentMission();
  
  if (!currentMission) {
    throw new Error('Aucune mission active');
  }
  
  const event = {
    id: generateId(),
    ...data,
    missionId: currentMission.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Sauvegarder localement
  const events = getEventsFromStorage();
  events.push(event);
  saveEventsToStorage(events);
  
  // Sync PocketBase
  if (pb.authStore.isValid) {
    try {
      const record = await pb.collection(COLLECTIONS.EVENTS).create({
        ...event,
        user_id: pb.authStore.model.id,
        mission_id: currentMission.pb_id
      });
      event.pb_id = record.id;
      updateEventInStorage(event);
    } catch (error) {
      console.warn('⚠️ Sync PocketBase échoué:', error);
      event.needsSync = true;
      updateEventInStorage(event);
    }
  }
  
  return event;
}

/**
 * Obtenir tous les événements d'une mission
 */
export function getEventsByMission(missionId) {
  const events = getEventsFromStorage();
  return events.filter(e => e.missionId === missionId);
}

/**
 * Mettre à jour un événement
 */
export async function updateEvent(id, updates) {
  const events = getEventsFromStorage();
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) {
    throw new Error('Événement non trouvé');
  }
  
  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveEventsToStorage(events);
  
  // Sync PocketBase
  if (pb.authStore.isValid && events[index].pb_id) {
    try {
      await pb.collection(COLLECTIONS.EVENTS).update(events[index].pb_id, updates);
    } catch (error) {
      console.warn('⚠️ Sync PocketBase échoué:', error);
      events[index].needsSync = true;
      saveEventsToStorage(events);
    }
  }
  
  return events[index];
}

/**
 * Supprimer un événement
 */
export async function deleteEvent(id) {
  const events = getEventsFromStorage();
  const event = events.find(e => e.id === id);
  
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  
  // Supprimer de PocketBase
  if (pb.authStore.isValid && event.pb_id) {
    try {
      await pb.collection(COLLECTIONS.EVENTS).delete(event.pb_id);
    } catch (error) {
      console.warn('⚠️ Suppression PocketBase échouée:', error);
    }
  }
  
  // Supprimer localement
  const filtered = events.filter(e => e.id !== id);
  saveEventsToStorage(filtered);
}

// ==========================================
// CURRENT MISSION
// ==========================================

/**
 * Définir la mission courante
 */
export function setCurrentMission(missionId) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_MISSION, missionId);
}

/**
 * Obtenir la mission courante
 */
export function getCurrentMission() {
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_MISSION);
  return currentId ? getMissionById(currentId) : null;
}

/**
 * Effacer la mission courante
 */
export function clearCurrentMission() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_MISSION);
}

// ==========================================
// LOCALSTORAGE HELPERS
// ==========================================

function getMissionsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
  return data ? JSON.parse(data) : [];
}

function saveMissionsToStorage(missions) {
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
}

function updateMissionInStorage(mission) {
  const missions = getMissionsFromStorage();
  const index = missions.findIndex(m => m.id === mission.id);
  
  if (index !== -1) {
    missions[index] = mission;
    saveMissionsToStorage(missions);
  }
}

function getEventsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
}

function saveEventsToStorage(events) {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

function updateEventInStorage(event) {
  const events = getEventsFromStorage();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index !== -1) {
    events[index] = event;
    saveEventsToStorage(events);
  }
}

// ==========================================
// SYNC POCKETBASE
// ==========================================

/**
 * Synchroniser toutes les données avec PocketBase
 */
export async function syncWithPocketBase() {
  if (!pb.authStore.isValid) {
    console.warn('⚠️ Non connecté à PocketBase');
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    console.log('🔄 Synchronisation PocketBase...');
    
    // Sync missions
    await syncMissions();
    
    // Sync events
    await syncEvents();
    
    // Mettre à jour le statut de sync
    const syncStatus = {
      lastSync: new Date().toISOString(),
      success: true
    };
    localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(syncStatus));
    
    console.log('✅ Synchronisation réussie');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erreur sync:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync missions
 */
async function syncMissions() {
  const localMissions = getMissionsFromStorage();
  const needsSync = localMissions.filter(m => m.needsSync || !m.pb_id);
  
  for (const mission of needsSync) {
    try {
      if (mission.pb_id) {
        // Mettre à jour
        await pb.collection(COLLECTIONS.MISSIONS).update(mission.pb_id, mission);
      } else {
        // Créer
        const record = await pb.collection(COLLECTIONS.MISSIONS).create({
          ...mission,
          user_id: pb.authStore.model.id
        });
        mission.pb_id = record.id;
      }
      
      mission.needsSync = false;
      updateMissionInStorage(mission);
      
    } catch (error) {
      console.error(`❌ Erreur sync mission ${mission.id}:`, error);
    }
  }
}

/**
 * Sync events
 */
async function syncEvents() {
  const localEvents = getEventsFromStorage();
  const needsSync = localEvents.filter(e => e.needsSync || !e.pb_id);
  
  for (const event of needsSync) {
    try {
      const mission = getMissionById(event.missionId);
      
      if (!mission?.pb_id) {
        console.warn(`⚠️ Mission ${event.missionId} pas encore sync`);
        continue;
      }
      
      if (event.pb_id) {
        // Mettre à jour
        await pb.collection(COLLECTIONS.EVENTS).update(event.pb_id, event);
      } else {
        // Créer
        const record = await pb.collection(COLLECTIONS.EVENTS).create({
          ...event,
          user_id: pb.authStore.model.id,
          mission_id: mission.pb_id
        });
        event.pb_id = record.id;
      }
      
      event.needsSync = false;
      updateEventInStorage(event);
      
    } catch (error) {
      console.error(`❌ Erreur sync event ${event.id}:`, error);
    }
  }
}

/**
 * Importer depuis PocketBase
 */
export async function importFromPocketBase() {
  if (!pb.authStore.isValid) {
    throw new Error('Non connecté');
  }
  
  try {
    console.log('📥 Import depuis PocketBase...');
    
    // Import missions
    const missionsRecords = await pb.collection(COLLECTIONS.MISSIONS).getFullList({
      filter: `user_id = "${pb.authStore.model.id}"`,
      sort: '-created'
    });
    
    const missions = missionsRecords.map(record => ({
      id: record.id,
      pb_id: record.id,
      ...record
    }));
    
    saveMissionsToStorage(missions);
    
    // Import events
    const eventsRecords = await pb.collection(COLLECTIONS.EVENTS).getFullList({
      filter: `user_id = "${pb.authStore.model.id}"`,
      sort: '-date'
    });
    
    const events = eventsRecords.map(record => ({
      id: record.id,
      pb_id: record.id,
      ...record
    }));
    
    saveEventsToStorage(events);
    
    console.log(`✅ Import réussi: ${missions.length} missions, ${events.length} événements`);
    return { success: true, missions: missions.length, events: events.length };
    
  } catch (error) {
    console.error('❌ Erreur import:', error);
    throw error;
  }
}

// ==========================================
// UTILS
// ==========================================

/**
 * Générer un ID unique
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Obtenir le statut de sync
 */
export function getSyncStatus() {
  const data = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
  return data ? JSON.parse(data) : null;
}

/**
 * Vérifier si des données nécessitent une sync
 */
export function needsSync() {
  const missions = getMissionsFromStorage();
  const events = getEventsFromStorage();
  
  return missions.some(m => m.needsSync || !m.pb_id) || 
         events.some(e => e.needsSync || !e.pb_id);
}

console.log('✅ Data Manager loaded');
