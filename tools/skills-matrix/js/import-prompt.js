/**
 * Skills Matrix - Gestion du prompt d'import
 * Affiche un message temporaire après import pour demander si l'utilisateur souhaite sauvegarder
 */

let importPromptTimeout = null;

/**
 * Afficher le prompt d'import
 * @param {string} importType - Type d'import (JSON ou Excel)
 */
function showImportPrompt(importType = 'JSON') {
    // Supprimer le prompt existant s'il y en a un
    hideImportPrompt();
    
    // Créer le prompt de manière sécurisée
    const prompt = document.createElement('div');
    prompt.id = 'importPrompt';
    prompt.className = 'import-prompt';
    
    // Header
    const header = document.createElement('div');
    header.className = 'import-prompt-header';
    
    const icon = document.createElement('span');
    icon.className = 'import-prompt-icon';
    icon.textContent = '💾';
    
    const title = document.createElement('span');
    title.textContent = `Import ${importType} réussi`; // Échappé automatiquement
    
    header.appendChild(icon);
    header.appendChild(title);
    
    // Message
    const message = document.createElement('div');
    message.className = 'import-prompt-message';
    message.textContent = 'Souhaitez-vous sauvegarder ces données maintenant ?';
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'import-prompt-actions';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'import-prompt-btn import-prompt-btn-save';
    saveBtn.onclick = handleImportSave;
    saveBtn.innerHTML = '<span>✓</span> Sauvegarder';
    
    const skipBtn = document.createElement('button');
    skipBtn.className = 'import-prompt-btn import-prompt-btn-skip';
    skipBtn.onclick = handleImportSkip;
    skipBtn.innerHTML = '<span>✕</span> Plus tard';
    
    actions.appendChild(saveBtn);
    actions.appendChild(skipBtn);
    
    prompt.appendChild(header);
    prompt.appendChild(message);
    prompt.appendChild(actions);
    
    document.body.appendChild(prompt);
    
    // Afficher avec animation
    setTimeout(() => {
        prompt.classList.add('active');
    }, 10);
    
    // Auto-masquer après 10 secondes
    importPromptTimeout = setTimeout(() => {
        hideImportPrompt();
    }, 10000);
}

/**
 * Masquer le prompt d'import
 */
function hideImportPrompt() {
    const prompt = document.getElementById('importPrompt');
    if (prompt) {
        prompt.classList.add('exit');
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                document.body.removeChild(prompt);
            }
        }, 300);
    }
    
    // Annuler le timeout
    if (importPromptTimeout) {
        clearTimeout(importPromptTimeout);
        importPromptTimeout = null;
    }
}

/**
 * Gérer la sauvegarde après import
 */
function handleImportSave() {
    hideImportPrompt();
    
    // Appeler la fonction de sauvegarde
    if (typeof saveData === 'function') {
        saveData(true); // true pour forcer la synchronisation complète
        showNotification('💾 Données sauvegardées', 'success');
    }
}

/**
 * Gérer le skip de la sauvegarde
 */
function handleImportSkip() {
    hideImportPrompt();
    showNotification('ℹ️ Vous pourrez sauvegarder plus tard', 'info', 2000);
}

console.log('✅ import-prompt.js chargé');
