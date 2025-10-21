/**
 * navigation.js - Gestion de la navigation, favoris, récents
 */

/**
 * Toggle favori (catégorie ou outil)
 */
function toggleFavorite(type, id) {
  const key = type === 'category' ? 'categories' : 'tools';
  
  const index = AppState.favorites[key].indexOf(id);
  
  if (index > -1) {
    // Retirer des favoris
    AppState.favorites[key].splice(index, 1);
  } else {
    // Ajouter aux favoris
    AppState.favorites[key].push(id);
  }
  
  saveToLocalStorage();
  
  console.log(`${index > -1 ? '➖' : '➕'} Favori ${type}: ${id}`);
}

/**
 * Vérifier si un élément est en favori
 */
function isFavorite(type, id) {
  const key = type === 'category' ? 'categories' : 'tools';
  return AppState.favorites[key].includes(id);
}

/**
 * Ajouter aux récents
 */
function addToRecents(type, id, title, icon = '📄') {
  // Construire l'URL selon le type
  let url = '';
  switch(type) {
    case 'category':
      url = `category.html?cat=${id}`;
      break;
    case 'content':
      url = `content.html?cat=${id.split('/')[0]}&file=${id.split('/')[1]}`;
      break;
    case 'tool':
      url = `tools/${id}/`;
      break;
  }
  
  // Vérifier si déjà présent
  const existingIndex = AppState.recents.findIndex(r => r.id === id);
  
  const recentItem = {
    type,
    id,
    title,
    icon,
    url,
    timestamp: Date.now()
  };
  
  if (existingIndex > -1) {
    // Mettre à jour et remonter en première position
    AppState.recents.splice(existingIndex, 1);
  }
  
  // Ajouter en premier
  AppState.recents.unshift(recentItem);
  
  // Limiter à 20 éléments
  AppState.recents = AppState.recents.slice(0, 20);
  
  saveToLocalStorage();
  
  console.log('🕐 Ajouté aux récents:', title);
}

/**
 * Obtenir les récents
 */
function getRecents(limit = 10) {
  return AppState.recents.slice(0, limit);
}

/**
 * Effacer les récents
 */
function clearRecents() {
  AppState.recents = [];
  saveToLocalStorage();
  
  const section = document.getElementById('recentsSection');
  if (section) {
    section.style.display = 'none';
  }
  
  console.log('🗑️ Récents effacés');
}

/**
 * Partager une page (copier l'URL)
 */
function sharePage() {
  const url = window.location.href;
  
  if (navigator.share) {
    // API Web Share (mobile)
    navigator.share({
      title: document.title,
      url: url
    }).then(() => {
      showToast('✅ Partagé avec succès');
    }).catch(err => {
      console.log('Partage annulé', err);
    });
  } else if (navigator.clipboard) {
    // Copier dans le presse-papiers
    navigator.clipboard.writeText(url).then(() => {
      showToast('📋 Lien copié dans le presse-papiers');
    }).catch(err => {
      console.error('Erreur copie:', err);
      showToast('❌ Erreur lors de la copie');
    });
  } else {
    // Fallback : sélectionner le texte
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = url;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    showToast('📋 Lien copié');
  }
}

/**
 * Afficher un toast de notification
 */
function showToast(message, duration = 3000) {
  // Créer le toast s'il n'existe pas
  let toast = document.getElementById('toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Obtenir le breadcrumb pour une page
 */
function getBreadcrumb(categoryId, contentSlug = null) {
  const config = AppState.config;
  if (!config) return [];
  
  const breadcrumb = [
    { label: 'Accueil', url: 'index.html' }
  ];
  
  const category = config.categories.find(c => c.id === categoryId);
  if (category) {
    breadcrumb.push({
      label: category.title,
      url: `category.html?cat=${categoryId}`
    });
  }
  
  if (contentSlug) {
    breadcrumb.push({
      label: contentSlug,
      url: null // Page actuelle
    });
  }
  
  return breadcrumb;
}

/**
 * Rendre le breadcrumb dans le DOM
 */
function renderBreadcrumb(items) {
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return;
  
  breadcrumb.innerHTML = items.map((item, index) => {
    if (index === items.length - 1 || !item.url) {
      return `<span>${item.label}</span>`;
    } else {
      return `
        <a href="${item.url}">${item.label}</a>
        <span class="breadcrumb-separator">/</span>
      `;
    }
  }).join('');
}

/**
 * Rendre les catégories dans la sidebar
 */
async function renderCategoriesNav() {
  const categoriesNav = document.getElementById('categoriesNav');
  if (!categoriesNav) return;
  
  try {
    const response = await fetch('config/config.json');
    const config = await response.json();
    
    // Charger le nombre d'articles et l'ordre pour chaque catégorie
    const categoriesWithCounts = await Promise.all(
      config.categories.map(async (cat) => {
        try {
          // Les IDs correspondent maintenant directement aux noms de dossiers
          const indexResponse = await fetch(`content/${cat.id}/index.json`);
          
          if (indexResponse.ok) {
            const indexData = await indexResponse.json();
            return { 
              ...cat, 
              count: indexData.articles ? indexData.articles.length : 0,
              order: indexData.order || 999 // Utiliser l'ordre du fichier index.json, ou 999 par défaut
            };
          }
        } catch (err) {
          console.warn(`Impossible de charger le count pour ${cat.id}:`, err);
        }
        return { ...cat, count: 0, order: 999 };
      })
    );
    
    // Trier les catégories par ordre
    categoriesWithCounts.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    // Charger les outils depuis config.json et les trier par ordre
    const tools = config.tools ? [...config.tools].sort((a, b) => (a.order || 999) - (b.order || 999)) : [];
    
    // Générer le HTML : Outils en premier, puis catégories
    let html = '';
    
    // Section Outils Interactifs
    html += `
      <div class="sidebar-section-title">
        <span class="section-icon">⚙️</span>
        <span>Outils Interactifs</span>
      </div>
    `;
    
    tools.forEach(tool => {
      const isFav = isFavorite('tool', tool.id);
      html += `
        <a href="${tool.path}" class="category-item" data-category="tool-${tool.id}" data-type="tool">
          <span class="category-icon">${tool.icon}</span>
          <div class="category-info">
            <div class="category-name">${tool.name}</div>
            <div class="category-count">Outil interactif</div>
          </div>
          <button class="favorite-btn ${isFav ? 'active' : ''}" 
                  data-type="tool" 
                  data-id="${tool.id}"
                  aria-label="Ajouter aux favoris">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </a>
      `;
    });
    
    // Section Catégories de contenu
    html += `
      <div class="sidebar-section-title">
        <span class="section-icon">📚</span>
        <span>Catégories</span>
      </div>
    `;
    
    categoriesWithCounts.forEach(cat => {
      const isFav = isFavorite('category', cat.id);
      html += `
        <a href="category.html?cat=${cat.id}" class="category-item" data-category="${cat.id}">
          <span class="category-icon">${cat.emoji}</span>
          <div class="category-info">
            <div class="category-name">${cat.title}</div>
            <div class="category-count">${cat.count} ressource${cat.count > 1 ? 's' : ''}</div>
          </div>
          <button class="favorite-btn ${isFav ? 'active' : ''}" 
                  data-type="category" 
                  data-id="${cat.id}"
                  aria-label="Ajouter aux favoris">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </a>
      `;
    });
    
    categoriesNav.innerHTML = html;
    
    // Ajouter les event listeners pour les boutons favoris
    categoriesNav.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = btn.dataset.type;
        const id = btn.dataset.id;
        toggleFavorite(type, id);
        
        // Mémoriser l'onglet actif avant le re-render
        const activeTab = document.querySelector('.tab.active');
        const activeTabType = activeTab ? activeTab.dataset.tab : 'all';
        
        // Re-render pour mettre à jour l'état
        renderCategoriesNav().then(() => {
          // Réappliquer le filtre de l'onglet actif
          filterSidebarCategories(activeTabType);
        });
      });
    });
    
    // Mettre à jour le compteur de sections
    const sectionsCount = document.getElementById('sectionsCount');
    if (sectionsCount) {
      sectionsCount.textContent = `${config.categories.length} sections`;
    }
    
    // Mettre à jour le compteur de favoris
    updateFavoritesCount();
    
  } catch (error) {
    console.error('Erreur chargement catégories:', error);
  }
}

/**
 * Mettre à jour le compteur de favoris
 */
function updateFavoritesCount() {
  // Compter les catégories ET les outils favoris
  const categoriesCount = AppState.favorites.categories ? AppState.favorites.categories.length : 0;
  const toolsCount = AppState.favorites.tools ? AppState.favorites.tools.length : 0;
  const totalFavorites = categoriesCount + toolsCount;
  
  const favoritesCountBadge = document.getElementById('favoritesCount');
  
  if (favoritesCountBadge) {
    favoritesCountBadge.textContent = totalFavorites;
    
    // Afficher/cacher le badge selon le nombre
    if (totalFavorites === 0) {
      favoritesCountBadge.style.display = 'none';
    } else {
      favoritesCountBadge.style.display = 'inline-flex';
    }
  }
}

/**
 * Gérer l'ouverture/fermeture de la sidebar
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const burgerBtn = document.getElementById('burgerBtn');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    if (burgerBtn) {
      burgerBtn.classList.toggle('active');
    }
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const burgerBtn = document.getElementById('burgerBtn');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    if (burgerBtn) {
      burgerBtn.classList.remove('active');
    }
  }
}

/**
 * Gérer le bouton de partage
 * Attendre que les partiels soient chargés avant d'accéder aux éléments
 */
function initNavigationButtons() {
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', sharePage);
  }
  
  // Gérer le burger menu
  const burgerBtn = document.getElementById('burgerBtn');
  if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleSidebar);
  }
  
  // Fermer la sidebar en cliquant sur l'overlay
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Gérer les tabs de la sidebar
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Retirer la classe active de tous les tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Ajouter la classe active au tab cliqué
      tab.classList.add('active');
      
      // Filtrer les catégories selon le tab
      const tabType = tab.dataset.tab;
      filterSidebarCategories(tabType);
    });
  });
  
  // Charger les catégories dans la sidebar puis activer l'onglet par défaut
  renderCategoriesNav().then(() => {
    // Activer l'onglet Favoris par défaut s'il existe des favoris
    activateDefaultTab();
  });
}

/**
 * Filtrer les catégories dans la sidebar selon le tab actif
 */
function filterSidebarCategories(type) {
  const nav = document.getElementById('categoriesNav');
  if (!nav) return;
  
  const items = nav.querySelectorAll('.category-item');
  
  items.forEach(item => {
    const catId = item.dataset.category;
    const itemType = item.dataset.type; // 'tool' ou undefined (catégorie)
    
    switch (type) {
      case 'favorites':
        // Afficher seulement les favoris (catégories ET outils)
        let isFavorite = false;
        if (itemType === 'tool') {
          // Extraire l'ID de l'outil depuis data-category (format: "tool-{id}")
          const toolId = catId.replace('tool-', '');
          isFavorite = AppState.favorites.tools && AppState.favorites.tools.includes(toolId);
        } else {
          isFavorite = AppState.favorites.categories.includes(catId);
        }
        item.style.display = isFavorite ? 'flex' : 'none';
        break;
      case 'recents':
        // Afficher seulement les récents (catégories ET outils)
        let isRecent = false;
        if (itemType === 'tool') {
          // Pour les outils, extraire l'ID et vérifier dans les récents
          const toolId = catId.replace('tool-', '');
          isRecent = AppState.recents.some(r => r.type === 'tool' && r.id === toolId);
        } else {
          // Pour les catégories, vérifier si l'URL contient le catId
          isRecent = AppState.recents.some(r => 
            (r.type === 'category' && r.id === catId) || 
            (r.url && r.url.includes(catId))
          );
        }
        item.style.display = isRecent ? 'flex' : 'none';
        break;
      default: // 'all'
        // Afficher tout
        item.style.display = 'flex';
    }
  });
}

/**
 * Activer l'onglet par défaut selon le contexte
 * Si des favoris existent, activer l'onglet Favoris
 * Sinon, garder l'onglet "Tout voir" actif
 */
function activateDefaultTab() {
  const categoriesCount = AppState.favorites.categories ? AppState.favorites.categories.length : 0;
  const toolsCount = AppState.favorites.tools ? AppState.favorites.tools.length : 0;
  const totalFavorites = categoriesCount + toolsCount;
  
  // S'il y a des favoris, activer l'onglet Favoris
  if (totalFavorites > 0) {
    const tabs = document.querySelectorAll('.tab');
    const favoritesTab = document.querySelector('.tab[data-tab="favorites"]');
    
    if (favoritesTab) {
      // Retirer la classe active de tous les tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Activer l'onglet Favoris
      favoritesTab.classList.add('active');
      
      // Filtrer pour afficher seulement les favoris
      filterSidebarCategories('favorites');
      
      console.log('✨ Onglet Favoris activé par défaut');
    }
  }
}

// Attendre que les partiels soient chargés
document.addEventListener('partialsLoaded', initNavigationButtons);

// Si les partiels sont déjà chargés (cas où navigation.js se charge après)
if (document.querySelector('#shareBtn')) {
  initNavigationButtons();
}

console.log('✅ navigation.js chargé');
