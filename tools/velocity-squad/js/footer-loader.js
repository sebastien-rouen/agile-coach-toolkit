/**
 * ========================================
 * FOOTER LOADER - Chargement et gestion du footer
 * ========================================
 */

(function() {
    'use strict';

    /**
     * Charger le footer depuis le fichier partial
     */
    async function loadFooter() {
        try {
            const response = await fetch('partials/footer.html');
            if (!response.ok) {
                throw new Error('Impossible de charger le footer');
            }
            
            const footerHTML = await response.text();
            
            // Insérer le footer avant la fermeture du body
            document.body.insertAdjacentHTML('beforeend', footerHTML);
            
            console.log('✅ Footer chargé avec succès');
            
            // Initialiser l'affichage selon le mode
            updateFooterDisplay();
            
        } catch (error) {
            console.error('❌ Erreur chargement footer:', error);
        }
    }

    /**
     * Mettre à jour l'affichage du footer selon le mode (Scrum/Kanban)
     */
    function updateFooterDisplay() {
        const scrumPillars = document.getElementById('scrumPillars');
        const kanbanPrinciples = document.getElementById('kanbanPrinciples');
        
        if (!scrumPillars || !kanbanPrinciples) {
            console.warn('⚠️ Éléments footer non trouvés');
            return;
        }

        // Récupérer le mode depuis velocityTool si disponible
        const framework = window.velocityTool?.data?.settings?.framework || 'scrum';
        
        if (framework === 'scrum') {
            scrumPillars.classList.remove('is-hidden');
            kanbanPrinciples.classList.add('is-hidden');
        } else {
            scrumPillars.classList.add('is-hidden');
            kanbanPrinciples.classList.remove('is-hidden');
        }
    }

    /**
     * Observer les changements de mode
     */
    function observeFrameworkChanges() {
        const frameworkSelect = document.getElementById('frameworkMode');
        
        if (frameworkSelect) {
            frameworkSelect.addEventListener('change', () => {
                // Petit délai pour laisser velocityTool se mettre à jour
                setTimeout(updateFooterDisplay, 100);
            });
        }
    }

    /**
     * Initialisation au chargement de la page
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadFooter().then(() => {
                observeFrameworkChanges();
            });
        });
    } else {
        loadFooter().then(() => {
            observeFrameworkChanges();
        });
    }

    // Exposer la fonction de mise à jour pour utilisation externe
    window.updateFooterDisplay = updateFooterDisplay;

})();
