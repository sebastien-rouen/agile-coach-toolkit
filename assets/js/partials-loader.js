/**
 * partials-loader.js - Chargement des partiels HTML (header, footer, sidebar)
 */

/**
 * Charge un fichier HTML partiel et l'insère dans un élément
 * @param {string} partialPath - Chemin vers le fichier partiel
 * @param {string} targetSelector - Sélecteur CSS de l'élément cible
 */
async function loadPartial(partialPath, targetSelector) {
    try {
        const response = await fetch(partialPath);
        if (!response.ok) {
            throw new Error(`Erreur chargement ${partialPath}: ${response.status}`);
        }
        
        const html = await response.text();
        const targetElement = document.querySelector(targetSelector);
        
        if (targetElement) {
            targetElement.outerHTML = html;
        } else {
            console.warn(`Élément cible non trouvé: ${targetSelector}`);
        }
    } catch (error) {
        console.error(`Erreur chargement partiel ${partialPath}:`, error);
    }
}

/**
 * Charge tous les partiels de la page
 */
async function loadAllPartials() {
    const partials = [
        { path: 'partials/header.html', selector: '#header-placeholder' },
        { path: 'partials/sidebar.html', selector: '#sidebar-placeholder' },
        { path: 'partials/footer.html', selector: '#footer-placeholder' }
    ];
    
    // Charger tous les partiels en parallèle
    await Promise.all(
        partials.map(partial => loadPartial(partial.path, partial.selector))
    );
    
    console.log('✅ Tous les partiels sont chargés');
    
    // Déclencher un événement personnalisé quand tous les partiels sont chargés
    document.dispatchEvent(new CustomEvent('partialsLoaded'));
    
    console.log('📢 Événement partialsLoaded déclenché');
}

// Charger les partiels dès que le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllPartials);
} else {
    loadAllPartials();
}
