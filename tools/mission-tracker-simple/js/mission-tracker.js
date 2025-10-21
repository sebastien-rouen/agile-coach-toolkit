/**
 * Mission Tracker - Logique principale
 */

import { pb, isAuthenticated, getCurrentUser, login, logout, register } from '../../../assets/js/shared/pocketbase.js';
import { showToast, formatDate, generateId } from '../../../assets/js/shared/utils.js';

// État de l'application
const state = {
    missions: [],
    currentMission: null,
    filters: {
        status: null,
        role: null
    },
    useLocalStorage: true
};

// Configuration des rôles
const ROLES = {
    'coach-agile': { label: 'Coach Agile', icon: '🎓' },
    'scrum-master': { label: 'Scrum Master', icon: '🎯' },
    'product-owner': { label: 'Product Owner', icon: '👨‍💼' },
    'designer': { label: 'Designer', icon: '🎨' },
    'dev': { label: 'Développeur', icon: '💻' },
    'architecte': { label: 'Architecte', icon: '🏗️' },
    'devops': { label: 'DevOps', icon: '⚙️' },
    'rte': { label: 'RTE', icon: '🚢' }
};

const STATUS_LABELS = {
    'active': 'Active',
    'completed': 'Terminée',
    'paused': 'En pause',
    'cancelled': 'Annulée'
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    updateAuthUI();
    await loadMissions();
    renderDashboard();
}

// Event Listeners
function setupEventListeners() {
    // Auth
    document.getElementById('auth-btn').addEventListener('click', handleAuthClick);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Mission CRUD
    document.getElementById('new-mission-btn').addEventListener('click', openMissionForm);
    document.getElementById('empty-new-mission-btn').addEventListener('click', openMissionForm);
    document.getElementById('cancel-mission-btn').addEventListener('click', closeMissionForm);
    document.getElementById('mission-form').addEventListener('submit', handleMissionSubmit);
    
    // Navigation
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);
    
    // Filters
    document.getElementById('status-filter').addEventListener('sl-change', handleFilterChange);
    document.getElementById('role-filter').addEventListener('sl-change', handleFilterChange);
}

// Auth
function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const authLabel = document.getElementById('auth-label');
    
    if (isAuthenticated()) {
        const user = getCurrentUser();
        authLabel.textContent = user.name || user.email;
        authBtn.addEventListener('click', handleLogout);
        state.useLocalStorage = false;
    } else {
        authLabel.textContent = 'Se connecter';
        state.useLocalStorage = true;
    }
}

function handleAuthClick() {
    if (isAuthenticated()) {
        handleLogout();
    } else {
        document.getElementById('auth-dialog').show();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        await login(formData.get('email'), formData.get('password'));
        document.getElementById('auth-dialog').hide();
        updateAuthUI();
        await loadMissions();
        renderDashboard();
        showToast('Connexion réussie', 'success');
    } catch (error) {
        showToast('Erreur de connexion', 'danger');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (formData.get('password') !== formData.get('passwordConfirm')) {
        showToast('Les mots de passe ne correspondent pas', 'warning');
        return;
    }
    
    try {
        await register(
            formData.get('email'),
            formData.get('password'),
            formData.get('passwordConfirm'),
            formData.get('name')
        );
        document.getElementById('auth-dialog').hide();
        updateAuthUI();
        await loadMissions();
        renderDashboard();
        showToast('Inscription réussie', 'success');
    } catch (error) {
        showToast('Erreur lors de l\'inscription', 'danger');
    }
}

function handleLogout() {
    logout();
    updateAuthUI();
    state.missions = [];
    renderDashboard();
    showToast('Déconnexion réussie', 'success');
}

// Data Management
async function loadMissions() {
    if (state.useLocalStorage) {
        loadMissionsFromLocalStorage();
    } else {
        await loadMissionsFromPocketBase();
    }
}

function loadMissionsFromLocalStorage() {
    const stored = localStorage.getItem('mission-tracker-missions');
    state.missions = stored ? JSON.parse(stored) : [];
}

async function loadMissionsFromPocketBase() {
    try {
        const records = await pb.collection('tools_mission_tracker_missions').getFullList({
            sort: '-created',
            filter: `user_id = "${getCurrentUser().id}"`
        });
        state.missions = records;
    } catch (error) {
        console.error('Erreur chargement missions:', error);
        showToast('Erreur lors du chargement', 'danger');
        state.missions = [];
    }
}

function saveMissionsToLocalStorage() {
    localStorage.setItem('mission-tracker-missions', JSON.stringify(state.missions));
}

async function saveMissionToPocketBase(mission) {
    try {
        const data = {
            ...mission,
            user_id: getCurrentUser().id
        };
        
        if (mission.id && !mission.id.startsWith('local-')) {
            return await pb.collection('tools_mission_tracker_missions').update(mission.id, data);
        } else {
            return await pb.collection('tools_mission_tracker_missions').create(data);
        }
    } catch (error) {
        console.error('Erreur sauvegarde mission:', error);
        throw error;
    }
}

// Mission CRUD
function openMissionForm(mission = null) {
    const dialog = document.getElementById('mission-form-dialog');
    const form = document.getElementById('mission-form');
    
    if (mission) {
        dialog.label = 'Éditer la mission';
        form.elements.title.value = mission.title;
        form.elements.client.value = mission.client;
        form.elements.role.value = mission.role;
        form.elements.start_date.value = mission.start_date;
        form.elements.end_date.value = mission.end_date || '';
        form.elements.context.value = mission.context || '';
        form.elements.team_size.value = mission.team_size || '';
        form.dataset.missionId = mission.id;
    } else {
        dialog.label = 'Nouvelle Mission';
        form.reset();
        delete form.dataset.missionId;
    }
    
    dialog.show();
}

function closeMissionForm() {
    document.getElementById('mission-form-dialog').hide();
}

async function handleMissionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const missionId = e.target.dataset.missionId;
    
    const mission = {
        title: formData.get('title'),
        client: formData.get('client'),
        role: formData.get('role'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date') || null,
        context: formData.get('context') || '',
        team_size: parseInt(formData.get('team_size')) || null,
        status: 'active',
        archived: false
    };
    
    try {
        if (missionId) {
            // Update
            mission.id = missionId;
            if (state.useLocalStorage) {
                const index = state.missions.findIndex(m => m.id === missionId);
                state.missions[index] = { ...state.missions[index], ...mission };
                saveMissionsToLocalStorage();
            } else {
                await saveMissionToPocketBase(mission);
                await loadMissions();
            }
            showToast('Mission mise à jour', 'success');
        } else {
            // Create
            if (state.useLocalStorage) {
                mission.id = 'local-' + generateId();
                mission.created = new Date().toISOString();
                state.missions.unshift(mission);
                saveMissionsToLocalStorage();
            } else {
                await saveMissionToPocketBase(mission);
                await loadMissions();
            }
            showToast('Mission créée', 'success');
        }
        
        closeMissionForm();
        renderDashboard();
    } catch (error) {
        showToast('Erreur lors de la sauvegarde', 'danger');
    }
}

// Filters
function handleFilterChange() {
    state.filters.status = document.getElementById('status-filter').value || null;
    state.filters.role = document.getElementById('role-filter').value || null;
    renderDashboard();
}

function getFilteredMissions() {
    return state.missions.filter(mission => {
        if (state.filters.status && mission.status !== state.filters.status) {
            return false;
        }
        if (state.filters.role && mission.role !== state.filters.role) {
            return false;
        }
        return true;
    });
}

// Rendering
function renderDashboard() {
    const missions = getFilteredMissions();
    const grid = document.getElementById('missions-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (missions.length === 0) {
        grid.classList.add('hidden');
        grid.classList.remove('visible');
        emptyState.classList.add('visible');
        emptyState.classList.remove('hidden');
    } else {
        grid.classList.add('visible');
        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        emptyState.classList.remove('visible');
        grid.innerHTML = missions.map(renderMissionCard).join('');
        
        // Add click handlers
        grid.querySelectorAll('.mission-card').forEach((card, index) => {
            card.addEventListener('click', () => showMissionDetail(missions[index]));
        });
    }
}

function renderMissionCard(mission) {
    const role = ROLES[mission.role] || { label: mission.role, icon: '📋' };
    const statusLabel = STATUS_LABELS[mission.status] || mission.status;
    
    return `
        <div class="mission-card" data-mission-id="${mission.id}">
            <div class="mission-card-header">
                <div>
                    <div class="mission-card-title">${mission.title}</div>
                    <div class="mission-card-client">${mission.client}</div>
                </div>
                <div class="mission-card-status ${mission.status}">${statusLabel}</div>
            </div>
            
            <div class="mission-card-meta">
                <div class="mission-card-meta-item">
                    <sl-icon name="calendar"></sl-icon>
                    <span>${formatDate(mission.start_date)}</span>
                </div>
                ${mission.team_size ? `
                    <div class="mission-card-meta-item">
                        <sl-icon name="people"></sl-icon>
                        <span>${mission.team_size} personnes</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="mission-card-role">
                <span>${role.icon}</span>
                <span>${role.label}</span>
            </div>
        </div>
    `;
}

function showMissionDetail(mission) {
    state.currentMission = mission;
    
    const role = ROLES[mission.role] || { label: mission.role, icon: '📋' };
    const statusLabel = STATUS_LABELS[mission.status] || mission.status;
    
    const content = document.getElementById('mission-detail-content');
    content.innerHTML = `
        <div class="mission-detail-header">
            <div class="mission-detail-title">${mission.title}</div>
            <div class="mission-detail-subtitle">${mission.client}</div>
            
            <div class="mission-detail-meta">
                <div class="mission-detail-meta-item">
                    <div class="mission-detail-meta-label">Rôle</div>
                    <div class="mission-detail-meta-value">${role.icon} ${role.label}</div>
                </div>
                <div class="mission-detail-meta-item">
                    <div class="mission-detail-meta-label">Statut</div>
                    <div class="mission-detail-meta-value">
                        <span class="mission-card-status ${mission.status}">${statusLabel}</span>
                    </div>
                </div>
                <div class="mission-detail-meta-item">
                    <div class="mission-detail-meta-label">Date de début</div>
                    <div class="mission-detail-meta-value">${formatDate(mission.start_date, 'long')}</div>
                </div>
                ${mission.end_date ? `
                    <div class="mission-detail-meta-item">
                        <div class="mission-detail-meta-label">Date de fin</div>
                        <div class="mission-detail-meta-value">${formatDate(mission.end_date, 'long')}</div>
                    </div>
                ` : ''}
                ${mission.team_size ? `
                    <div class="mission-detail-meta-item">
                        <div class="mission-detail-meta-label">Taille équipe</div>
                        <div class="mission-detail-meta-value">${mission.team_size} personnes</div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        ${mission.context ? `
            <div class="mission-detail-section">
                <div class="mission-detail-section-title">Contexte</div>
                <p>${mission.context}</p>
            </div>
        ` : ''}
        
        <div class="mission-tabs">
            <sl-tab-group>
                <sl-tab slot="nav" panel="checkpoints">Checkpoints</sl-tab>
                <sl-tab slot="nav" panel="achievements">Réussites</sl-tab>
                <sl-tab slot="nav" panel="challenges">Défis</sl-tab>
                <sl-tab slot="nav" panel="experiments">Expérimentations</sl-tab>
                
                <sl-tab-panel name="checkpoints">
                    <p class="tab-panel-placeholder">
                        Fonctionnalité à venir : Gestion des checkpoints hebdomadaires/mensuels
                    </p>
                </sl-tab-panel>
                
                <sl-tab-panel name="achievements">
                    <p class="tab-panel-placeholder">
                        Fonctionnalité à venir : Suivi des réussites et accomplissements
                    </p>
                </sl-tab-panel>
                
                <sl-tab-panel name="challenges">
                    <p class="tab-panel-placeholder">
                        Fonctionnalité à venir : Documentation des défis rencontrés
                    </p>
                </sl-tab-panel>
                
                <sl-tab-panel name="experiments">
                    <p class="tab-panel-placeholder">
                        Fonctionnalité à venir : Suivi des expérimentations
                    </p>
                </sl-tab-panel>
            </sl-tab-group>
        </div>
    `;
    
    // Setup edit button
    document.getElementById('edit-mission-btn').addEventListener('click', () => {
        openMissionForm(mission);
    });
    
    showView('mission-detail-view');
}

function showDashboard() {
    showView('dashboard-view');
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

console.log('✅ Mission Tracker loaded');
