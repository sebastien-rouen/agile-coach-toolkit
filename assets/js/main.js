/**
 * main.js - Point d'entrée principal de l'application
 * Initialise tous les composants et gère l'état global
 */

// État global de l'application
const AppState = {
    config: null,
    currentCategory: null,
    favorites: {
        categories: [],
        tools: []
    },
    recents: [],
    wizardCompleted: false
};

/**
 * Initialisation au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Charger la configuration
        await loadConfig();

        // 2. Initialiser le localStorage
        loadFromLocalStorage();

        // 3. Générer la sidebar
        renderSidebar();

        // 4. Vérifier si le wizard a déjà été complété
        checkWizardStatus();

        // 5. Initialiser les event listeners globaux
        initGlobalListeners();

        // 6. Charger la page appropriée
        initCurrentPage();

    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        showErrorState();
    }
});

/**
 * Charger la configuration depuis config.json
 */
async function loadConfig() {
    try {
        const response = await fetch('config/config.json');
        if (!response.ok) throw new Error('Impossible de charger la configuration');

        AppState.config = await response.json();
        console.log('✅ Configuration chargée', AppState.config);

    } catch (error) {
        console.error('❌ Erreur chargement config:', error);
        throw error;
    }
}

/**
 * Charger les données depuis localStorage
 */
function loadFromLocalStorage() {
    // Favoris
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        AppState.favorites = JSON.parse(storedFavorites);
    }

    // Récents
    const storedRecents = localStorage.getItem('recents');
    if (storedRecents) {
        AppState.recents = JSON.parse(storedRecents);
    }

    // Wizard complété
    AppState.wizardCompleted = localStorage.getItem('wizardCompleted') === 'true';
}

/**
 * Sauvegarder dans localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(AppState.favorites));
    localStorage.setItem('recents', JSON.stringify(AppState.recents));
}

/**
 * Générer la sidebar avec les catégories
 */
function renderSidebar() {
    const nav = document.getElementById('categoriesNav');
    if (!nav || !AppState.config) return;

    const categories = AppState.config.categories;

    nav.innerHTML = categories.map(cat => `
    <a href="category.html?cat=${cat.id}" class="category-item" data-category="${cat.id}">
      <div class="category-icon" style="background-color: ${cat.color}20; color: ${cat.color};">
        ${cat.emoji}
      </div>
      <div class="category-content">
        <div class="category-name">${cat.title}</div>
        <div class="category-description">${cat.subtitle}</div>
      </div>
      <button class="category-favorite" data-cat="${cat.id}" aria-label="Favori">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </button>
    </a>
  `).join('');

    // Mettre à jour les états de favoris
    updateFavoriteStates();

    // Ajouter les event listeners pour les favoris
    document.querySelectorAll('.category-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const catId = btn.dataset.cat;
            
            // Ajouter animation
            btn.classList.add('adding');
            setTimeout(() => btn.classList.remove('adding'), 600);
            
            toggleFavorite('category', catId);
            updateFavoriteStates();
        });
    });
}

/**
 * Mettre à jour l'affichage des favoris dans la sidebar
 */
function updateFavoriteStates() {
    document.querySelectorAll('.category-favorite').forEach(btn => {
        const catId = btn.dataset.cat;
        const isFavorite = AppState.favorites.categories.includes(catId);
        const svg = btn.querySelector('svg');

        if (isFavorite) {
            svg.setAttribute('fill', 'currentColor');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1.5');
            btn.classList.add('active');
            btn.setAttribute('aria-label', 'Retirer des favoris');
            btn.setAttribute('title', 'Retirer des favoris');
        } else {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            btn.classList.remove('active');
            btn.setAttribute('aria-label', 'Ajouter aux favoris');
            btn.setAttribute('title', 'Ajouter aux favoris');
        }
    });
    
    // Mettre à jour le compteur de favoris
    const favoritesCount = AppState.favorites.categories.length;
    const favoritesCountBadge = document.getElementById('favoritesCount');
    if (favoritesCountBadge) {
        favoritesCountBadge.textContent = favoritesCount;
        if (favoritesCount === 0) {
            favoritesCountBadge.style.display = 'none';
        } else {
            favoritesCountBadge.style.display = 'inline-flex';
        }
    }
}

/**
 * Vérifier le statut du wizard
 */
function checkWizardStatus() {
    const wizardContainer = document.getElementById('wizardContainer');
    const homepageContainer = document.getElementById('homepageContainer');

    if (!wizardContainer || !homepageContainer) return;

    if (AppState.wizardCompleted) {
        // Afficher directement la homepage
        wizardContainer.style.display = 'none';
        homepageContainer.style.display = 'block';
        renderHomepage();
    } else {
        // Afficher le wizard
        wizardContainer.style.display = 'block';
        homepageContainer.style.display = 'none';
        initWizard();
    }
}

/**
 * Initialiser la page actuelle (homepage)
 */
function initCurrentPage() {
    // Compteur d'outils
    const toolsCount = document.getElementById('toolsCount');
    if (toolsCount) {
        // Compter les outils disponibles
        toolsCount.textContent = '50+'; // À dynamiser selon les outils réels
    }
}

/**
 * Rendre la homepage
 */
function renderHomepage() {
    renderCategoriesGrid();
    renderQuickTools();
    renderRecents();
}

/**
 * Rendre la grille de catégories
 */
function renderCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid || !AppState.config) return;

    const categories = AppState.config.categories;

    grid.innerHTML = categories.map(cat => `
    <a href="category.html?cat=${cat.id}" class="category-card" style="--cat-color: ${cat.color};">
      <div class="category-card-icon">${cat.emoji}</div>
      <h3 class="category-card-title">${cat.title}</h3>
      <p class="category-card-subtitle">${cat.subtitle}</p>
      <div class="category-card-footer">
        <span class="category-card-count">Découvrir →</span>
      </div>
    </a>
  `).join('');
}

/**
 * Rendre les outils rapides
 */
function renderQuickTools() {
    const grid = document.getElementById('quickToolsGrid');
    if (!grid) return;

    // Liste des outils interactifs (à synchroniser avec le dossier tools/)
    const quickTools = [
        { name: 'Planning Poker', icon: '🎴', path: 'tools/planning-poker/' },
        { name: 'Rétrospectives', icon: '🔄', path: 'tools/retrospectives/' },
        { name: 'Example Mapping', icon: '🗺️', path: 'tools/example-mapping/' },
        { name: 'Velocity Squad', icon: '📈', path: 'tools/velocity-squad/' },
        { name: 'Ikigai', icon: '🎯', path: 'tools/ikigai/' },
        { name: 'Skills Matrix', icon: '🎓', path: 'tools/skills-matrix/' },
    ];

    grid.innerHTML = quickTools.map(tool => `
    <a href="${tool.path}" class="tool-card">
      <div class="tool-card-icon">${tool.icon}</div>
      <h4 class="tool-card-name">${tool.name}</h4>
    </a>
  `).join('');
}

/**
 * Afficher les contenus récents
 */
function renderRecents() {
    const section = document.getElementById('recentsSection');
    const list = document.getElementById('recentsList');

    if (!section || !list) return;

    if (AppState.recents.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    list.innerHTML = AppState.recents.slice(0, 5).map(recent => `
    <a href="${recent.url}" class="recent-item">
      <div class="recent-icon">${recent.icon || '📄'}</div>
      <div class="recent-content">
        <div class="recent-title">${recent.title}</div>
        <div class="recent-date">${formatDate(recent.timestamp)}</div>
      </div>
    </a>
  `).join('');
}

/**
 * Initialiser les event listeners globaux
 */
function initGlobalListeners() {
    // Burger menu
    const burgerBtn = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (burgerBtn && sidebar && overlay) {
        burgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('visible');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });
    }

    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));

        // Raccourci clavier Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Tabs sidebar
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabType = tab.dataset.tab;
            filterSidebar(tabType);
        });
    });

    // Bouton aide (header et footer)
    const helpBtn = document.getElementById('helpBtn');
    const helpFooterBtn = document.getElementById('helpFooterBtn');
    const helpModal = document.getElementById('helpModal');
    const helpModalOverlay = document.getElementById('helpModalOverlay');

    const openHelpModal = () => {
        if (helpModal && helpModalOverlay) {
            helpModal.classList.add('active');
            helpModalOverlay.classList.add('active');
        }
    };

    const closeHelpModal = () => {
        if (helpModal && helpModalOverlay) {
            helpModal.classList.remove('active');
            helpModalOverlay.classList.remove('active');
        }
    };

    if (helpBtn) {
        helpBtn.addEventListener('click', openHelpModal);
    }

    if (helpFooterBtn) {
        helpFooterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openHelpModal();
        });
    }

    if (helpModal) {
        helpModal.querySelector('.modal-close')?.addEventListener('click', closeHelpModal);
        helpModal.querySelector('#closeHelpModalBtn')?.addEventListener('click', closeHelpModal);
    }

    if (helpModalOverlay) {
        helpModalOverlay.addEventListener('click', closeHelpModal);
    }

    // Bouton "Afficher le wizard"
    const showWizardBtn = document.getElementById('showWizardBtn');
    if (showWizardBtn) {
        showWizardBtn.addEventListener('click', () => {
            document.getElementById('homepageContainer').style.display = 'none';
            document.getElementById('wizardContainer').style.display = 'block';
            initWizard();
        });
    }

    // Échap pour fermer les modales/menus
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Fermer sidebar mobile
            sidebar?.classList.remove('open');
            overlay?.classList.remove('visible');

            // Fermer modales
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

/**
 * Filtrer la sidebar selon l'onglet actif
 */
function filterSidebar(type) {
    const nav = document.getElementById('categoriesNav');
    if (!nav) return;

    const items = nav.querySelectorAll('.category-item');
    const sectionTitles = nav.querySelectorAll('.sidebar-section-title');

    items.forEach(item => {
        const catId = item.dataset.category;
        const itemType = item.dataset.type; // 'tool' ou undefined (catégorie)

        switch (type) {
            case 'favorites':
                // Vérifier si c'est un outil ou une catégorie
                let isFavorite = false;
                if (itemType === 'tool') {
                    // Extraire l'ID de l'outil (tool-xxx -> xxx)
                    const toolId = catId.replace('tool-', '');
                    isFavorite = AppState.favorites.tools && AppState.favorites.tools.includes(toolId);
                } else {
                    // C'est une catégorie
                    isFavorite = AppState.favorites.categories.includes(catId);
                }
                item.style.display = isFavorite ? 'flex' : 'none';
                break;
            case 'recents':
                const isRecent = AppState.recents.some(r => r.url && r.url.includes(catId));
                item.style.display = isRecent ? 'flex' : 'none';
                break;
            default: // 'all'
                item.style.display = 'flex';
        }
    });
    
    // Gérer l'affichage des titres de section
    sectionTitles.forEach(title => {
        if (type === 'all') {
            title.style.display = 'flex';
        } else {
            // Cacher les titres de section quand on filtre
            title.style.display = 'none';
        }
    });
}

/**
 * Gérer la recherche
 */
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (query.length === 0) {
        filterSidebar('all');
        return;
    }

    const nav = document.getElementById('categoriesNav');
    if (!nav) return;

    const items = nav.querySelectorAll('.category-item');

    items.forEach(item => {
        const title = item.querySelector('.category-name')?.textContent.toLowerCase();
        const desc = item.querySelector('.category-description')?.textContent.toLowerCase();

        const matches = title?.includes(query) || desc?.includes(query);
        item.style.display = matches ? 'flex' : 'none';
    });
}

/**
 * Afficher un état d'erreur global
 */
function showErrorState() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
    <div class="error-state-global">
      <h1>⚠️ Erreur de chargement</h1>
      <p>Une erreur est survenue lors de l'initialisation de l'application.</p>
      <button class="btn btn-primary" onclick="location.reload()">
        Recharger la page
      </button>
    </div>
  `;
}

// ============================================
// GESTION DES MODALES
// ============================================
const modal = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Bouton aide
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.open('helpModal');
        });

        // Fermeture
        document.getElementById('closeHelpModal')?.addEventListener('click', () => {
            this.close('helpModal');
        });

        document.getElementById('closeHelpModalBtn')?.addEventListener('click', () => {
            this.close('helpModal');
        });

        // Clic sur l'overlay
        document.getElementById('helpModalOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'helpModalOverlay') {
                this.close('helpModal');
            }
        });

        // Touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    },

    open(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById(`${modalId}Overlay`);

        if (modal && overlay) {
            overlay.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById(`${modalId}Overlay`);

        if (modal && overlay) {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeAll() {
        document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
            overlay.classList.remove('active');
        });
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
};

// ============================================
// GESTION DES FAVORIS
// ============================================
const favorites = {
    items: [],

    init() {
        this.load();
        this.bindEvents();
        this.updateUI();
    },

    bindEvents() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const toolId = btn.dataset.toolId;
                this.toggle(toolId);
            });
        });
    },

    toggle(toolId) {
        if (this.items.includes(toolId)) {
            this.remove(toolId);
        } else {
            this.add(toolId);
        }
    },

    add(toolId) {
        if (!this.items.includes(toolId)) {
            this.items.push(toolId);
            this.save();
            this.updateUI();
        }
    },

    remove(toolId) {
        this.items = this.items.filter(id => id !== toolId);
        this.save();
        this.updateUI();
    },

    updateUI() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const toolId = btn.dataset.toolId;
            if (this.items.includes(toolId)) {
                btn.classList.add('active');
                btn.innerHTML = '⭐';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '☆';
            }
        });

        // Mettre à jour le compteur
        const counter = document.querySelector('.favorites-count');
        if (counter) {
            counter.textContent = this.items.length;
        }
    },

    save() {
        localStorage.setItem('favorites', JSON.stringify(this.items));
    },

    load() {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    modal.init();
    favorites.init();
});


console.log('✅ main.js chargé');
