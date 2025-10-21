/**
 * Skills Matrix - Gestion du loader
 * Affiche un loader élégant lors des actions de contrôle
 */

/**
 * Afficher le loader des controls (desktop)
 * @param {string} message - Message à afficher
 */
function showControlsLoader(message = 'Chargement...') {
    const loader = document.getElementById('controlsLoader');
    const loaderText = document.getElementById('controlsLoaderText');
    
    if (loader) {
        if (loaderText) {
            loaderText.textContent = message;
        }
        loader.classList.add('active');
    }
}

/**
 * Masquer le loader des controls (desktop)
 */
function hideControlsLoader() {
    const loader = document.getElementById('controlsLoader');
    if (loader) {
        loader.classList.remove('active');
    }
}

/**
 * Afficher le loader du menu mobile
 * @param {string} message - Message à afficher
 */
function showMobileMenuLoader(message = 'Chargement...') {
    const loader = document.getElementById('mobileMenuLoader');
    const loaderText = document.getElementById('mobileMenuLoaderText');
    
    if (loader) {
        if (loaderText) {
            loaderText.textContent = message;
        }
        loader.classList.add('active');
    }
}

/**
 * Masquer le loader du menu mobile
 */
function hideMobileMenuLoader() {
    const loader = document.getElementById('mobileMenuLoader');
    if (loader) {
        loader.classList.remove('active');
    }
}

/**
 * Afficher le loader approprié selon le contexte (desktop ou mobile)
 * @param {string} message - Message à afficher
 */
function showLoader(message = 'Chargement...') {
    // Détecter si on est sur mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        showMobileMenuLoader(message);
    } else {
        showControlsLoader(message);
    }
}

/**
 * Masquer tous les loaders
 */
function hideLoader() {
    hideControlsLoader();
    hideMobileMenuLoader();
}

console.log('✅ loader.js chargé');
