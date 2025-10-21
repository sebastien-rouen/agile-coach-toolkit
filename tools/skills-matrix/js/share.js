/**
 * Skills Matrix - Gestion du partage et collaboration
 */

// Configuration API
const API_BASE_URL = '/api/routes-skills-matrix';

// ID de session actuelle
let currentSessionId = null;

// Intervalle de synchronisation (10 secondes)
let syncInterval = null;
const SYNC_INTERVAL_MS = 10000;

/**
 * Initialiser le partage
 */
function initShare() {
    // Vérifier si on est dans une session partagée
    const urlParams = new URLSearchParams(window.location.search);
    const matrixId = urlParams.get('matrix');
    const sessionId = urlParams.get('session'); // Ancien système (fallback)

    if (matrixId) {
        // Nouveau système : charger la matrice PocketBase
        currentSessionId = matrixId;
        window.currentMatrixId = matrixId;

        // PocketBase est déjà initialisé par main.js, juste démarrer la sync
        if (typeof usePocketBase !== 'undefined' && usePocketBase) {
            startAutoSync();
            updateShareUI(true);
            console.log('💾 Sauvegarde automatique activée (pas de sync périodique)');
        } else {
            updateShareUI(false);
        }
    } else if (sessionId) {
        // Ancien système (fallback)
        currentSessionId = sessionId;
        loadSharedSession(sessionId);
        startAutoSync();
        updateShareUI(true);
    } else {
        // Pas de partage
        updateShareUI(false);
    }
}

/**
 * Créer une nouvelle session partagée
 */
async function createSharedSession() {
    try {
        showNotification('🔄 Création du lien de partage...');

        // Si PocketBase est activé, utiliser l'ID de la matrice
        if (window.currentMatrixId) {
            currentSessionId = window.currentMatrixId;

            // Mettre à jour l'URL sans recharger
            const newUrl = `${window.location.pathname}?matrix=${window.currentMatrixId}`;
            window.history.pushState({}, '', newUrl);

            // Copier le lien dans le presse-papier
            const fullUrl = `${window.location.origin}${window.location.pathname}?matrix=${window.currentMatrixId}`;
            await navigator.clipboard.writeText(fullUrl);

            // Démarrer la synchronisation
            startAutoSync();
            updateShareUI(true);

            showNotification('✅ Lien copié ! Partagez-le avec votre équipe');
            showShareModal(fullUrl, null); // Pas d'expiration avec PocketBase

        } else {
            // Fallback : système de partage local (sans backend)
            showNotification('⚠️ Activez PocketBase pour partager la matrice', 'warning');
        }

    } catch (error) {
        console.error('Erreur création session:', error);
        showNotification('❌ Erreur lors de la création du lien');
    }
}

/**
 * Charger une session partagée
 */
async function loadSharedSession(sessionId) {
    try {
        showNotification('🔄 Chargement de la session partagée...');

        const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Session introuvable');
            } else if (response.status === 410) {
                throw new Error('Session expirée (> 48h)');
            }
            throw new Error('Erreur lors du chargement');
        }

        const result = await response.json();

        // Charger les données
        matrixData = result.data;

        // Mettre à jour l'interface
        renderMatrix();
        renderRadar();
        renderAdvice();

        showNotification('✅ Session partagée chargée');

    } catch (error) {
        console.error('Erreur chargement session:', error);
        showNotification(`❌ ${error.message}`);

        // Retirer le paramètre session de l'URL
        window.history.pushState({}, '', window.location.pathname);
        currentSessionId = null;
        updateShareUI(false);
    }
}

/**
 * Sauvegarder les modifications dans la session partagée
 */
async function saveSharedSession() {
    if (!currentSessionId) return;

    try {
        // Avec PocketBase, la sauvegarde est gérée par syncWithPocketBase()
        // Cette fonction n'est plus nécessaire car les données sont sauvegardées
        // automatiquement via pocketbase-integration.js
        console.log('💾 Sauvegarde gérée par PocketBase');
    } catch (error) {
        console.error('Erreur sauvegarde session:', error);
    }
}

/**
 * Synchroniser manuellement (désactivée - sauvegarde automatique)
 */
async function syncSession() {
    // Synchronisation automatique désactivée
    // La sauvegarde se fait via saveData() qui appelle syncWithPocketBase()
    return;
}

/**
 * Démarrer la synchronisation automatique (désactivée - sauvegarde automatique à chaque modification)
 */
function startAutoSync() {
    // Synchronisation automatique désactivée
    // La sauvegarde se fait automatiquement à chaque modification via saveData()
    console.log('💾 Sauvegarde automatique activée (pas de sync périodique)');
}

/**
 * Arrêter la synchronisation automatique (désactivée)
 */
function stopAutoSync() {
    // Rien à faire, la sync automatique est désactivée
    console.log('💾 Mode sauvegarde automatique');
}

/**
 * Quitter la session partagée
 */
function leaveSharedSession() {
    stopAutoSync();
    currentSessionId = null;

    // Retirer le paramètre session de l'URL
    window.history.pushState({}, '', window.location.pathname);

    updateShareUI(false);
    showNotification('👋 Session partagée quittée');
}

/**
 * Mettre à jour l'interface de partage
 */
function updateShareUI(isShared) {
    const shareBtn = document.getElementById('shareBtn');

    if (!shareBtn) return;

    if (isShared) {
        shareBtn.classList.add('btn-shared');
        shareBtn.title = 'Matrice partagée - Sauvegarde automatique active';
    } else {
        shareBtn.classList.remove('btn-shared');
        shareBtn.title = 'Cliquer pour créer un lien de partage';
    }
}

/**
 * Afficher la modal de partage
 */
function showShareModal(shareUrl, expiresAt) {
    const modal = document.createElement('div');
    modal.className = 'share-modal-overlay';

    let expiryInfo = '';
    if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        const expiryStr = expiryDate.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        expiryInfo = `<p><strong>⏰ Expire le :</strong> ${expiryStr}</p>`;
    } else {
        expiryInfo = `<p><strong>♾️ Lien permanent</strong> (stocké dans PocketBase)</p>`;
    }

    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>🔗 Lien de partage créé</h3>
                <button class="modal-close" onclick="closeShareModal()">×</button>
            </div>
            <div class="share-modal-body">
                <p>Partagez ce lien avec votre équipe pour collaborer en temps réel :</p>
                <div class="share-url-container">
                    <input type="text" class="share-url-input" value="${shareUrl}" readonly>
                    <button class="btn btn-success" onclick="copyShareUrl('${shareUrl}')">
                        <span class="btn-icon">📋</span> Copier
                    </button>
                </div>
                <div class="share-info">
                    ${expiryInfo}
                    <p><strong>🔄 Synchronisation :</strong> Automatique via PocketBase</p>
                    <p><strong>💾 Conservation :</strong> 48 heures</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

/**
 * Fermer la modal de partage
 */
function closeShareModal() {
    const modal = document.querySelector('.share-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

/**
 * Copier l'URL de partage
 */
async function copyShareUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        showNotification('✅ Lien copié dans le presse-papier');
    } catch (error) {
        console.error('Erreur copie:', error);
        showNotification('❌ Erreur lors de la copie');
    }
}

/**
 * Gérer le clic sur le bouton de partage
 */
function handleShareClick() {
    if (currentSessionId) {
        // Si déjà en session, recréer le lien (copier à nouveau)
        const fullUrl = `${window.location.origin}${window.location.pathname}?matrix=${currentSessionId}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            showNotification('✅ Lien copié ! Partagez-le avec votre équipe');
            showShareModal(fullUrl, null);
        }).catch(() => {
            showNotification('❌ Erreur lors de la copie');
        });
    } else {
        // Créer une nouvelle session
        createSharedSession();
    }
}

// Sauvegarder automatiquement lors des modifications
// Note: Avec PocketBase, la sauvegarde est gérée par pocketbase-integration.js
// via syncWithPocketBase() qui est appelé automatiquement
const originalSaveData = window.saveData;
window.saveData = function () {
    originalSaveData();
    // saveSharedSession() n'est plus nécessaire avec PocketBase
};

console.log('✅ share.js chargé');
