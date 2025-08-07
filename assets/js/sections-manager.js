/**
 * Sections Manager - Gestion de la navigation et affichage des sections
 */
class SectionsManager {
    constructor() {
        this.sections = new Map();
        this.currentSection = null;
        this.isLoading = false;
        this.sidebarOpen = false;
        this.isLoadingFromURL = false;
        
        // Éléments DOM
        this.sidebar = null;
        this.overlay = null;
        this.toggleBtn = null;
        this.mainContent = null;
        this.sectionsList = null;
        this.detailContainer = null;
        
        this.init();
    }

    /**
     * Initialisation du gestionnaire de sections
     */
    async init() {
        try {
            await this.loadSectionsData();
            this.createSidebarStructure();
            this.bindEvents();
            this.updateToggleButton();
            this.initializeRouting();
            
            console.log('✅ Sections Manager initialisé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du Sections Manager:', error);
        }
    }

    /**
     * Chargement des données des sections depuis les fichiers JSON
     */
    async loadSectionsData() {
        const sectionFiles = [
            'fondamentaux',
            'frameworks', 
            'delivery-amelioration',
            'animation-facilitation',
            'gestion-defis',
            'leadership-coaching',
            'multi-equipes-scale',
            'contextes-specialises',
            'product-design',
            'transformation-culture',
            'outils-technologies',
            'developpement-coach',
            'ressources-rex'
        ];

        const loadPromises = sectionFiles.map(async (sectionId) => {
            try {
                const response = await fetch(`content/${sectionId}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                this.sections.set(sectionId, data);
                return { sectionId, success: true };
            } catch (error) {
                console.warn(`⚠️ Impossible de charger la section ${sectionId}:`, error);
                return { sectionId, success: false, error };
            }
        });

        const results = await Promise.all(loadPromises);
        const successCount = results.filter(r => r.success).length;
        
        console.log(`📚 ${successCount}/${sectionFiles.length} sections chargées`);
    }

    /**
     * Nettoyage des instances existantes
     */
    cleanup() {
        // Supprimer les éléments existants pour éviter les doublons
        const existingSidebar = document.querySelector('.sections-sidebar');
        const existingOverlay = document.querySelector('.sections-overlay');
        const existingToggle = document.querySelector('.sections-toggle');
        const existingContainer = document.getElementById('section-detail-container');
        
        if (existingSidebar) existingSidebar.remove();
        if (existingOverlay) existingOverlay.remove();
        if (existingToggle) existingToggle.remove();
        if (existingContainer) existingContainer.remove();
    }

    /**
     * Création de la structure HTML de la sidebar
     */
    createSidebarStructure() {
        // Nettoyer d'abord les instances existantes
        this.cleanup();
        
        // Bouton toggle - positionner dans la navbar sur mobile
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'sections-toggle';
        this.toggleBtn.innerHTML = '📚';
        this.toggleBtn.setAttribute('aria-label', 'Ouvrir les sections du coach');
        this.toggleBtn.setAttribute('title', 'Sections du coach agile');
        
        // Sur mobile, ajouter dans la navbar
        if (window.innerWidth <= 768) {
            const navbarActions = document.querySelector('.navbar-actions');
            if (navbarActions) {
                navbarActions.insertBefore(this.toggleBtn, navbarActions.firstChild);
            } else {
                document.body.appendChild(this.toggleBtn);
            }
        } else {
            document.body.appendChild(this.toggleBtn);
        }

        // Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'sections-overlay';
        document.body.appendChild(this.overlay);

        // Sidebar
        this.sidebar = document.createElement('aside');
        this.sidebar.className = 'sections-sidebar';
        this.sidebar.setAttribute('role', 'complementary');
        this.sidebar.setAttribute('aria-label', 'Navigation des sections');
        
        // Header de la sidebar
        const header = document.createElement('div');
        header.className = 'sections-sidebar-header';
        header.innerHTML = `
            <h2 class="sections-sidebar-title">
                📚 Sections Coach
            </h2>
            <p class="sections-sidebar-subtitle">
                13 domaines d'expertise agile
            </p>
        `;
        this.sidebar.appendChild(header);

        // Liste des sections
        this.sectionsList = document.createElement('ul');
        this.sectionsList.className = 'sections-list';
        this.sectionsList.setAttribute('role', 'navigation');
        this.populateSectionsList();
        this.sidebar.appendChild(this.sectionsList);

        document.body.appendChild(this.sidebar);

        // Container pour les détails de section
        this.detailContainer = document.createElement('div');
        this.detailContainer.id = 'section-detail-container';
        this.detailContainer.classList.add('section-detail-overlay');
        
        document.body.appendChild(this.detailContainer);

        // Référence au main content pour le décalage
        this.mainContent = document.querySelector('main') || document.body;
    }

    /**
     * Remplissage de la liste des sections
     */
    populateSectionsList() {
        this.sectionsList.innerHTML = '';
        
        let delay = 0;
        for (const [sectionId, sectionData] of this.sections) {
            const listItem = document.createElement('li');
            listItem.className = 'section-item';
            listItem.style.animationDelay = `${delay * 50}ms`;
            
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'section-link';
            link.setAttribute('data-section', sectionId);
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
            
            const iconClass = sectionData.section.icon || 'fas fa-folder';
            
            const itemCount = sectionData.items ? sectionData.items.length : 0;
            
            link.innerHTML = `
                <span class="section-icon ${iconClass}" aria-hidden="true"></span>
                <div class="section-info">
                    <div class="section-name">${sectionData.section.title}</div>
                    <div class="section-description">${sectionData.section.description}</div>
                    <div class="section-count">${itemCount} éléments</div>
                </div>
            `;
            
            listItem.appendChild(link);
            this.sectionsList.appendChild(listItem);
            delay++;
        }
    }

    /**
     * Liaison des événements
     */
    bindEvents() {
        // Toggle button
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Overlay
        this.overlay.addEventListener('click', () => this.closeSidebar());
        
        // Section links
        this.sectionsList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('.section-link');
            if (link) {
                const sectionId = link.getAttribute('data-section');
                this.showSection(sectionId);
            }
        });
        
        // Keyboard navigation
        this.sectionsList.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = e.target.closest('.section-link');
                if (link) {
                    const sectionId = link.getAttribute('data-section');
                    this.showSection(sectionId);
                }
            }
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarOpen) {
                this.closeSidebar();
            }
        });
        
        // Responsive
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Basculer l'état de la sidebar
     */
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    /**
     * Ouvrir la sidebar
     */
    openSidebar() {
        this.sidebarOpen = true;
        this.sidebar.classList.add('is-open');
        this.overlay.classList.add('is-visible');
        this.toggleBtn.classList.add('is-active');
        this.toggleBtn.innerHTML = '✕';
        this.toggleBtn.setAttribute('aria-label', 'Fermer les sections');
        
        // Empêcher le scroll du body sur mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
        
        // Décaler le contenu principal sur desktop
        this.updateMainContentShift();
        
        // Focus sur le premier lien
        setTimeout(() => {
            const firstLink = this.sectionsList.querySelector('.section-link');
            if (firstLink) {
                firstLink.focus();
            }
        }, 300);
    }

    /**
     * Fermer la sidebar
     */
    closeSidebar() {
        this.sidebarOpen = false;
        this.sidebar.classList.remove('is-open');
        this.overlay.classList.remove('is-visible');
        this.toggleBtn.classList.remove('is-active');
        this.toggleBtn.innerHTML = '📚';
        this.toggleBtn.setAttribute('aria-label', 'Ouvrir les sections du coach');
        
        // Rétablir le scroll du body
        document.body.style.overflow = '';
        
        // Remettre le contenu principal en place
        this.mainContent.classList.remove('sections-open');
        
        // Focus sur le toggle button après l'animation
        setTimeout(() => {
            this.toggleBtn.focus();
        }, 300);
    }

    /**
     * Mise à jour du décalage du contenu principal
     */
    updateMainContentShift() {
        if (window.innerWidth > 768 && this.sidebarOpen) {
            this.mainContent.classList.add('sections-open');
        } else {
            this.mainContent.classList.remove('sections-open');
        }
    }

    /**
     * Afficher une section spécifique
     */
    async showSection(sectionId) {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            
            // Mettre à jour l'état actif
            this.updateActiveSection(sectionId);
            
            // Charger et afficher le contenu
            await this.renderSectionDetail(sectionId);
            
            // Fermer la sidebar sur mobile
            if (window.innerWidth <= 768) {
                this.closeSidebar();
            }
            
            // Afficher le container de détail
            this.showDetailContainer();
            
            // Mettre à jour l'URL
            this.updateURL(sectionId);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'affichage de la section:', error);
            this.showError('Impossible de charger cette section');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Mettre à jour la section active dans la navigation
     */
    updateActiveSection(sectionId) {
        // Retirer l'état actif de tous les liens
        this.sectionsList.querySelectorAll('.section-link').forEach(link => {
            link.classList.remove('is-active');
        });
        
        // Ajouter l'état actif au lien sélectionné
        const activeLink = this.sectionsList.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('is-active');
        }
        
        this.currentSection = sectionId;
    }

    /**
     * Rendu du détail d'une section
     */
    async renderSectionDetail(sectionId) {
        const sectionData = this.sections.get(sectionId);
        if (!sectionData) {
            throw new Error(`Section ${sectionId} non trouvée`);
        }

        const section = sectionData.section;
        const items = sectionData.items || [];

        // Générer le HTML
        const html = `
            <div class="section-detail" style="--section-color: ${section.color || '#2196F3'}; --section-color-light: ${this.lightenColor(section.color || '#2196F3', 20)}">
                <div class="section-detail-header">
                    <button class="section-close-btn" aria-label="Fermer la section" title="Retour à l'accueil">
                        ✕
                    </button>
                    <span class="section-detail-icon">${this.getIconEmoji(section.icon)}</span>
                    <h1 class="section-detail-title">${section.title}</h1>
                    <p class="section-detail-description">${section.description}</p>
                </div>
                
                <div class="section-actions">
                    <div class="section-actions-left">
                        <span class="section-items-count">${items.length} éléments</span>
                    </div>
                    <div class="section-actions-right">
                        <button class="section-share-btn" data-action="share">
                            <span>🔗</span> Partager
                        </button>
                        <button class="section-print-btn" data-action="print">
                            <span>🖨️</span> Imprimer
                        </button>
                        <button class="section-bookmark-btn" data-action="bookmark">
                            <span>⭐</span> Favoris
                        </button>
                    </div>
                </div>
                
                <div class="section-content">
                    <div class="section-items">
                        ${items.map(item => this.renderSectionItem(item)).join('')}
                    </div>
                </div>
            </div>
        `;

        this.detailContainer.innerHTML = html;
        
        // Bind events pour les actions
        this.bindSectionDetailEvents();
    }

    /**
     * Rendu d'un élément de section
     */
    renderSectionItem(item) {
        const tags = item.tags ? item.tags.map(tag => `<span class="section-item-tag">${tag}</span>`).join('') : '';
        const hasDetails = item.sections_detaillees && Object.keys(item.sections_detaillees).length > 0;
        
        return `
            <div class="section-item-card">
                <div class="section-item-header">
                    <div class="section-item-icon">
                        ${this.getIconEmoji(item.icon)}
                    </div>
                    <div class="section-item-info">
                        <h3 class="section-item-title">${item.title}</h3>
                        <p class="section-item-description">${item.description}</p>
                    </div>
                </div>
                
                ${tags ? `<div class="section-item-tags">${tags}</div>` : ''}
                
                <div class="section-item-content">
                    <p>${item.content}</p>
                    
                    ${hasDetails ? `
                        <button class="section-item-toggle" data-item-id="${item.id}">
                            <span>📖</span> Voir les détails
                            <span class="toggle-icon">▼</span>
                        </button>
                        <div class="section-item-details" data-item-id="${item.id}">
                            ${this.renderItemDetails(item.sections_detaillees)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Rendu des détails d'un élément
     */
    renderItemDetails(details) {
        let html = '';
        
        if (details.pitch_elevator) {
            html += `
                <div class="detail-section">
                    <h4 class="detail-section-title">🎯 Pitch Elevator</h4>
                    <div class="detail-section-content">${details.pitch_elevator}</div>
                </div>
            `;
        }
        
        if (details.citations && details.citations.length > 0) {
            html += `
                <div class="detail-section">
                    <h4 class="detail-section-title">💬 Citations</h4>
                    <div class="detail-section-content">
                        ${details.citations.map(citation => `
                            <div class="citation">
                                <p class="citation-text">${citation.texte}</p>
                                <p class="citation-author">— ${citation.auteur}, ${citation.source}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (details.templates && details.templates.length > 0) {
            html += `
                <div class="detail-section">
                    <h4 class="detail-section-title">📋 Templates</h4>
                    <div class="detail-section-content">
                        ${details.templates.map(template => `
                            <div class="template-item">
                                <div class="template-info">
                                    <div class="template-name">${template.nom}</div>
                                    <div class="template-description">${template.description}</div>
                                </div>
                                <button class="template-download" data-template="${template.nom}">
                                    📥 Télécharger
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (details.checklist && details.checklist.length > 0) {
            html += `
                <div class="detail-section">
                    <h4 class="detail-section-title">✅ Checklist</h4>
                    <div class="detail-section-content">
                        <ul>
                            ${details.checklist.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    /**
     * Liaison des événements pour les détails de section
     */
    bindSectionDetailEvents() {
        // Toggle des détails d'items
        this.detailContainer.addEventListener('click', (e) => {
            // Bouton de fermeture
            if (e.target.closest('.section-close-btn')) {
                this.closeSection();
                return;
            }
            
            if (e.target.closest('.section-item-toggle')) {
                const button = e.target.closest('.section-item-toggle');
                const itemId = button.getAttribute('data-item-id');
                const details = this.detailContainer.querySelector(`.section-item-details[data-item-id="${itemId}"]`);
                
                if (details) {
                    const isExpanded = details.classList.contains('is-expanded');
                    details.classList.toggle('is-expanded');
                    
                    const icon = button.querySelector('.toggle-icon');
                    icon.textContent = isExpanded ? '▼' : '▲';
                    
                    button.innerHTML = button.innerHTML.replace(
                        isExpanded ? 'Masquer les détails' : 'Voir les détails',
                        isExpanded ? 'Voir les détails' : 'Masquer les détails'
                    );
                }
            }
            
            // Actions de section
            if (e.target.closest('[data-action]')) {
                const action = e.target.closest('[data-action]').getAttribute('data-action');
                this.handleSectionAction(action);
            }
        });
        
        // Escape key pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.detailContainer.classList.contains('is-visible')) {
                this.closeSection();
            }
        });
    }

    /**
     * Gestion des actions de section
     */
    handleSectionAction(action) {
        switch (action) {
            case 'share':
                this.shareSection();
                break;
            case 'print':
                this.printSection();
                break;
            case 'bookmark':
                this.toggleBookmark();
                break;
        }
    }

    /**
     * Partager une section
     */
    async shareSection() {
        const sectionData = this.sections.get(this.currentSection);
        const sectionTitle = sectionData ? sectionData.section.title : this.currentSection;
        const currentURL = window.location.href;
        const shareURL = currentURL.includes('#section-') ? currentURL : `${currentURL}#section-${this.currentSection}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${sectionTitle} - Coach Agile Toolkit`,
                    text: `Découvrez la section "${sectionTitle}" du Coach Agile Toolkit`,
                    url: shareURL
                });
            } catch (error) {
                console.log('Partage annulé');
            }
        } else {
            // Fallback: copier l'URL
            navigator.clipboard.writeText(shareURL).then(() => {
                this.showNotification('Lien copié dans le presse-papiers');
            });
        }
    }

    /**
     * Imprimer une section
     */
    printSection() {
        window.print();
    }

    /**
     * Basculer le favori
     */
    toggleBookmark() {
        const bookmarkBtn = this.detailContainer.querySelector('.section-bookmark-btn');
        const isBookmarked = bookmarkBtn.classList.contains('is-bookmarked');
        
        bookmarkBtn.classList.toggle('is-bookmarked');
        
        // Sauvegarder dans localStorage
        const bookmarks = JSON.parse(localStorage.getItem('agile-sections-bookmarks') || '[]');
        
        if (isBookmarked) {
            const index = bookmarks.indexOf(this.currentSection);
            if (index > -1) bookmarks.splice(index, 1);
            this.showNotification('Retiré des favoris');
        } else {
            if (!bookmarks.includes(this.currentSection)) {
                bookmarks.push(this.currentSection);
            }
            this.showNotification('Ajouté aux favoris');
        }
        
        localStorage.setItem('agile-sections-bookmarks', JSON.stringify(bookmarks));
    }

    /**
     * Afficher le container de détail
     */
    showDetailContainer() {
        this.detailContainer.classList.add('is-visible');
        
        // Animer l'apparition du contenu
        setTimeout(() => {
            const detail = this.detailContainer.querySelector('.section-detail');
            if (detail) {
                detail.classList.add('is-visible');
            }
        }, 50);
        
        // Scroll vers le haut
        this.detailContainer.scrollTop = 0;
    }
    
    /**
     * Fermer la section et revenir à l'accueil
     */
    closeSection() {
        // Animer la disparition
        const detail = this.detailContainer.querySelector('.section-detail');
        if (detail) {
            detail.classList.remove('is-visible');
        }
        
        setTimeout(() => {
            this.detailContainer.classList.remove('is-visible');
            this.currentSection = null;
            
            // Retirer l'état actif de tous les liens
            this.sectionsList.querySelectorAll('.section-link').forEach(link => {
                link.classList.remove('is-active');
            });
            
            // Mettre à jour l'URL
            window.history.pushState({}, '', window.location.pathname + window.location.search);
        }, 300);
    }
    
    /**
     * Gérer le redimensionnement
     */
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Repositionner le toggle button
        if (isMobile) {
            const navbarActions = document.querySelector('.navbar-actions');
            if (navbarActions && !navbarActions.contains(this.toggleBtn)) {
                navbarActions.insertBefore(this.toggleBtn, navbarActions.firstChild);
            }
        } else {
            // Sur desktop, masquer le toggle et fermer la sidebar si ouverte
            if (this.sidebarOpen) {
                this.closeSidebar();
            }
        }
        
        // Gérer le scroll du body
        if (isMobile && this.sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Afficher une erreur
     */
    showError(message) {
        this.detailContainer.innerHTML = `
            <div class="section-detail">
                <div class="section-detail-header" style="background: var(--color-danger-500);">
                    <button class="section-close-btn" aria-label="Fermer la section" title="Retour à l'accueil">
                        ✕
                    </button>
                    <span class="section-detail-icon">⚠️</span>
                    <h1 class="section-detail-title">Erreur</h1>
                    <p class="section-detail-description">${message}</p>
                </div>
            </div>
        `;
        this.showDetailContainer();
        this.bindSectionDetailEvents();
    }

    /**
     * Afficher une notification
     */
    showNotification(message) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success-500);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animer l'apparition
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Mettre à jour le bouton toggle selon l'état
     */
    updateToggleButton() {
        // Vérifier s'il y a des sections chargées
        if (this.sections.size === 0) {
            this.toggleBtn.style.display = 'none';
            return;
        }
        
        this.toggleBtn.style.display = 'block';
    }

    /**
     * Initialiser le système de routing
     */
    initializeRouting() {
        // Écouter les changements d'URL
        window.addEventListener('popstate', (e) => {
            this.handleRouteChange();
        });
        
        // Gérer l'URL initiale avec un délai pour éviter les doublons
        setTimeout(() => {
            this.handleRouteChange();
        }, 100);
    }

    /**
     * Gérer les changements de route
     */
    handleRouteChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#section-')) {
            const sectionId = hash.replace('#section-', '');
            if (this.sections.has(sectionId) && this.currentSection !== sectionId) {
                // Marquer comme chargement depuis URL pour éviter la mise à jour d'URL
                this.isLoadingFromURL = true;
                this.showSection(sectionId);
            }
        } else if (this.currentSection && this.detailContainer.classList.contains('is-visible')) {
            // Si pas de hash et qu'une section est ouverte, la fermer
            this.closeSection();
        }
    }

    /**
     * Mettre à jour l'URL
     */
    updateURL(sectionId) {
        // Ne pas mettre à jour l'URL si on charge depuis une URL
        if (this.isLoadingFromURL) {
            this.isLoadingFromURL = false;
            return;
        }
        
        const newURL = `${window.location.pathname}${window.location.search}#section-${sectionId}`;
        window.history.pushState({ sectionId }, '', newURL);
    }

    /**
     * Obtenir l'emoji d'une icône FontAwesome
     */
    getIconEmoji(iconClass) {
        const iconMap = {
            'fas fa-foundation': '🏗️',
            'fas fa-bullseye': '🎯',
            'fas fa-eye': '👁️',
            'fas fa-graduation-cap': '🎓',
            'fas fa-clipboard-check': '📋',
            'fas fa-cogs': '⚙️',
            'fas fa-sync-alt': '🔄',
            'fas fa-columns': '📊',
            'fas fa-blender': '🧺',
            'fas fa-sitemap': '🗺️',
            'fas fa-theater-masks': '🎭',
            'fas fa-snowflake': '❄️',
            'fas fa-hands-helping': '🤝',
            'fas fa-lightbulb': '💡',
            'fas fa-gamepad': '🎮'
        };
        
        return iconMap[iconClass] || '📁';
    }

    /**
     * Éclaircir une couleur
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.sectionsManager = new SectionsManager();
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SectionsManager;
}