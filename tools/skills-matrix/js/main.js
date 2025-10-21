/**
 * Skills Matrix - Point d'entrée principal
 */

/**
 * Initialiser l'application
 */
async function initApp() {
    console.log('🚀 Initialisation de Skills Matrix...');

    // Charger les templates dans le select
    loadTemplatesIntoSelect();

    // Vérifier si on a un ID de matrice dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const matrixId = urlParams.get('matrix');

    // Si on a un ID de matrice, attendre le chargement PocketBase
    if (matrixId) {
        console.log('📋 Chargement depuis PocketBase...');
        
        // Initialiser PocketBase en premier
        if (typeof initPocketBase === 'function') {
            try {
                await initPocketBase();
            } catch (error) {
                console.error('Erreur chargement PocketBase:', error);
                // Fallback sur localStorage
                loadData();
            }
        }
    } else {
        // Pas d'ID de matrice, charger depuis localStorage
        loadData();
    }

    // Si pas de données, initialiser avec le template par défaut
    if (!matrixData.skills || matrixData.skills.length === 0) {
        initDefaultMatrix();
    }

    // Initialiser les membres visibles (tous par défaut)
    if (visibleMembers.length === 0 && matrixData.members.length > 0) {
        visibleMembers = matrixData.members.map((_, index) => index);
    }

    // Rendre l'interface
    renderMatrix();
    renderRadar();
    updateAllAdviceViews();

    // Initialiser les event listeners
    initEventListeners();

    // Initialiser le sélecteur de membres dans les controls
    initMemberSelectorControl();

    // Initialiser le dropdown des actions
    initActionsDropdown();

    // Initialiser le comportement sticky des controls
    initStickyControls();

    // Initialiser le partage (pour la synchronisation automatique)
    initShare();

    console.log('✅ Skills Matrix initialisée');
}

/**
 * Charger les templates dans le select
 */
function loadTemplatesIntoSelect() {
    const templateSelect = document.getElementById('templateSelect');
    const mobileTemplateSelect = document.getElementById('mobileTemplateSelect');
    
    if (!templateSelect) return;

    // Définir les icônes pour chaque template
    const templateIcons = {
        tribu_value: '👥',
        auth: '🔐',
        ecommerce: '🛒',
        search: '🔍',
        payment: '💳',
        registration: '📝',
        health: '🏥',
        devops: '🚀',
        sirh: '👥',
        education: '🎓'
    };

    // Vider les options existantes (sauf la première)
    while (templateSelect.options.length > 1) {
        templateSelect.remove(1);
    }

    // Ajouter les templates depuis templates.js
    Object.keys(templates).forEach(key => {
        const template = templates[key];
        const icon = templateIcons[key] || '📋';
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${icon} ${template.name}`;
        templateSelect.appendChild(option);

        // Ajouter aussi au select mobile si présent
        if (mobileTemplateSelect) {
            const mobileOption = option.cloneNode(true);
            mobileTemplateSelect.appendChild(mobileOption);
        }
    });

    console.log(`✅ ${Object.keys(templates).length} templates chargés dans le select`);
}

/**
 * Initialiser les event listeners
 */
function initEventListeners() {
    // Template selector
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
        templateSelect.addEventListener('change', function() {
            if (this.value) {
                loadTemplate(this.value);
                this.value = '';
            }
        });
    }

    // Mobile menu
    initMobileMenu();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S pour sauvegarder
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveData(true); // Synchronisation complète (notification gérée par pocketbase-integration.js)
        }

        // Échap pour fermer les modales
        if (e.key === 'Escape') {
            closeAppetencesModal();
        }
    });
}

/**
 * Initialiser le menu mobile
 */
function initMobileMenu() {
    const mobileMenuContent = document.getElementById('mobileMenuContent');
    if (!mobileMenuContent) return;

    mobileMenuContent.innerHTML = `
        <button class="mobile-menu-item" onclick="showTemplateMenu();">
            <span class="icon">📋</span>
            <span>Charger un modèle</span>
            <span class="arrow">▼</span>
        </button>
        <button class="mobile-menu-item" onclick="showMobileMemberSelector();">
            <span class="icon">👥</span>
            <span>Sélectionner les membres</span>
            <span class="arrow">▼</span>
        </button>
        <button class="mobile-menu-item" onclick="createSharedSession(); closeMobileMenu();">
            <span class="icon">🔗</span>
            <span>Partager avec l'équipe</span>
        </button>
        <button class="mobile-menu-item" onclick="addMember(); closeMobileMenu();">
            <span class="icon">👤</span>
            <span>Ajouter Membre</span>
        </button>
        <button class="mobile-menu-item" onclick="addSkill(); closeMobileMenu();">
            <span class="icon">🎯</span>
            <span>Ajouter Compétence</span>
        </button>
        <button class="mobile-menu-item" onclick="manageAppetencesOwnerships(); closeMobileMenu();">
            <span class="icon">⚡</span>
            <span>Gérer Appétences & Ownerships</span>
            <span class="arrow">▼</span>
        </button>
        <button class="mobile-menu-item" onclick="saveData(true); closeMobileMenu();">
            <span class="icon">💾</span>
            <span>Sauvegarder</span>
        </button>
        <button class="mobile-menu-item" onclick="exportToJSON(); closeMobileMenu();">
            <span class="icon">📥</span>
            <span>Exporter JSON</span>
        </button>
        <button class="mobile-menu-item" onclick="exportToXLSX(); closeMobileMenu();">
            <span class="icon">📊</span>
            <span>Exporter Excel</span>
        </button>
        <button class="mobile-menu-item" onclick="resetMatrix(); closeMobileMenu();">
            <span class="icon">🔄</span>
            <span>Réinitialiser</span>
        </button>
    `;
}

/**
 * Toggle menu mobile
 */
function toggleMobileMenu() {
    const content = document.getElementById('mobileMenuContent');
    if (content) {
        content.classList.toggle('active');
    }
}

/**
 * Fermer le menu mobile
 */
function closeMobileMenu() {
    const content = document.getElementById('mobileMenuContent');
    if (content) {
        content.classList.remove('active');
    }
}

/**
 * Afficher le menu des templates (mobile)
 */
function showTemplateMenu() {
    closeMobileMenu();
    const mobileSelect = document.getElementById('mobileTemplateSelect');
    if (mobileSelect) {
        mobileSelect.style.display = 'block';
        mobileSelect.focus();
        mobileSelect.click();
        
        // Masquer après sélection
        mobileSelect.addEventListener('change', function() {
            if (this.value) {
                loadTemplate(this.value);
                this.value = '';
            }
            this.style.display = 'none';
        }, { once: true });
        
        // Masquer si on clique ailleurs
        setTimeout(() => {
            mobileSelect.addEventListener('blur', function() {
                this.style.display = 'none';
            }, { once: true });
        }, 100);
    }
}

/**
 * Afficher une notification
 */
function showNotification(message) {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.add('notification-exit');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialiser l'application au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log('✅ main.js chargé');


/**
 * Afficher le sélecteur de membres (mobile)
 */
function showMobileMemberSelector() {
    closeMobileMenu();
    
    // Créer une modal pour la sélection des membres
    const modal = document.createElement('div');
    modal.className = 'mobile-member-selector-modal';
    modal.innerHTML = `
        <div class="mobile-member-selector-content">
            <div class="mobile-member-selector-header">
                <h3>👥 Sélectionner les membres</h3>
                <button class="close-btn" onclick="closeMobileMemberSelector()">×</button>
            </div>
            <div class="mobile-member-selector-list" id="mobileMemberSelectorList"></div>
            <div class="mobile-member-selector-footer">
                <button class="btn btn-success" onclick="closeMobileMemberSelector()">
                    <span class="btn-icon">✓</span> Valider
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remplir la liste des membres
    updateMobileMemberSelectorList();
    
    // Afficher la modal avec animation
    setTimeout(() => modal.classList.add('active'), 10);
}

/**
 * Mettre à jour la liste des membres dans le sélecteur mobile
 */
function updateMobileMemberSelectorList() {
    const list = document.getElementById('mobileMemberSelectorList');
    if (!list) return;
    
    list.innerHTML = '';
    
    // Bouton Tout/Rien
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'mobile-member-toggle-all';
    const allSelected = visibleMembers.length === matrixData.members.length;
    toggleAllBtn.innerHTML = `
        <span class="toggle-all-icon">${allSelected ? '❌' : '✓'}</span>
        <span class="toggle-all-text">${allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}</span>
    `;
    toggleAllBtn.onclick = () => {
        toggleAllMembers();
        updateMobileMemberSelectorList();
    };
    list.appendChild(toggleAllBtn);
    
    // Séparateur
    const separator = document.createElement('div');
    separator.className = 'mobile-member-separator';
    list.appendChild(separator);
    
    // Liste des membres
    matrixData.members.forEach((member, index) => {
        const item = document.createElement('button');
        item.className = 'mobile-member-item';
        item.innerHTML = `
            <span class="member-name">${member.name}</span>
            <span class="member-check">${visibleMembers.includes(index) ? '✓' : ''}</span>
        `;
        
        if (visibleMembers.includes(index)) {
            item.classList.add('active');
        }
        
        item.onclick = () => {
            toggleMemberVisibility(index);
            updateMobileMemberSelectorList();
        };
        
        list.appendChild(item);
    });
}

/**
 * Fermer le sélecteur de membres mobile
 */
function closeMobileMemberSelector() {
    const modal = document.querySelector('.mobile-member-selector-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}


/**
 * Initialiser le comportement sticky des controls
 */
function initStickyControls() {
    const controls = document.querySelector('.controls');
    const mobileMenu = document.querySelector('.mobile-menu');
    const scrollThreshold = 200; // Pixels avant de devenir sticky
    
    // Créer les placeholders
    const controlsPlaceholder = document.createElement('div');
    controlsPlaceholder.className = 'controls-placeholder';
    if (controls) {
        controls.parentNode.insertBefore(controlsPlaceholder, controls);
    }
    
    const mobileMenuPlaceholder = document.createElement('div');
    mobileMenuPlaceholder.className = 'mobile-menu-placeholder';
    if (mobileMenu) {
        mobileMenu.parentNode.insertBefore(mobileMenuPlaceholder, mobileMenu);
    }
    
    let controlsSticky = false;
    let mobileMenuSticky = false;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Desktop controls
        if (controls) {
            if (scrollTop > scrollThreshold && !controlsSticky) {
                // Devenir sticky
                const controlsHeight = controls.offsetHeight;
                controlsPlaceholder.style.height = controlsHeight + 'px';
                controlsPlaceholder.classList.add('active');
                controls.classList.add('sticky');
                controlsSticky = true;
            } else if (scrollTop <= scrollThreshold && controlsSticky) {
                // Redevenir normal
                controlsPlaceholder.classList.remove('active');
                controlsPlaceholder.style.height = '0';
                controls.classList.remove('sticky');
                controlsSticky = false;
            }
        }
        
        // Mobile menu
        if (mobileMenu) {
            if (scrollTop > scrollThreshold && !mobileMenuSticky) {
                const menuHeight = mobileMenu.offsetHeight;
                mobileMenuPlaceholder.style.height = menuHeight + 'px';
                mobileMenuPlaceholder.classList.add('active');
                mobileMenu.classList.add('sticky');
                mobileMenuSticky = true;
            } else if (scrollTop <= scrollThreshold && mobileMenuSticky) {
                mobileMenuPlaceholder.classList.remove('active');
                mobileMenuPlaceholder.style.height = '0';
                mobileMenu.classList.remove('sticky');
                mobileMenuSticky = false;
            }
        }
    });
}
