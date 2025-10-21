/**
 * search.js - Système de recherche avec autocomplétion
 * Recherche dans tous les contenus markdown des dossiers content/
 */

// Cache des contenus indexés
let searchIndex = [];
let isIndexing = false;

/**
 * Initialiser le système de recherche
 */
async function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // Créer le conteneur de résultats
    createSearchResultsContainer();

    // Indexer les contenus au chargement
    await indexAllContent();

    // Event listeners
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
            showSearchResults();
        }
    });

    // Fermer les résultats en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            hideSearchResults();
        }
    });

    // Navigation au clavier
    searchInput.addEventListener('keydown', handleSearchKeyboard);

    console.log('✅ Système de recherche initialisé');
}

/**
 * Créer le conteneur des résultats de recherche
 */
function createSearchResultsContainer() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar || document.getElementById('searchResults')) return;

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'searchResults';
    resultsContainer.className = 'search-results';
    resultsContainer.style.display = 'none';
    searchBar.appendChild(resultsContainer);
}

/**
 * Indexer tous les contenus des dossiers content/
 */
async function indexAllContent() {
    if (isIndexing) return;
    isIndexing = true;

    console.log('🔍 Indexation des contenus...');

    try {
        if (!AppState.config) {
            await loadConfig();
        }

        const categories = AppState.config.categories;
        const indexPromises = [];

        for (const category of categories) {
            indexPromises.push(indexCategoryContent(category));
        }

        await Promise.all(indexPromises);

        console.log(`✅ ${searchIndex.length} contenus indexés`);
    } catch (error) {
        console.error('❌ Erreur lors de l\'indexation:', error);
    } finally {
        isIndexing = false;
    }
}

/**
 * Indexer le contenu d'une catégorie
 */
async function indexCategoryContent(category) {
    try {
        const indexResponse = await fetch(`content/${category.id}/index.json`);
        if (!indexResponse.ok) return;

        const indexData = await indexResponse.json();
        if (!indexData.articles) return;

        for (const article of indexData.articles) {
            try {
                const mdResponse = await fetch(`content/${category.id}/${article.file}`);
                if (!mdResponse.ok) continue;

                const mdContent = await mdResponse.text();

                // Extraire le titre et un extrait
                const lines = mdContent.split('\n');
                const title = article.title || extractTitle(lines);
                const excerpt = extractExcerpt(lines);

                searchIndex.push({
                    id: article.id,
                    title: title,
                    excerpt: excerpt,
                    content: mdContent.toLowerCase(),
                    category: category.id,
                    categoryTitle: category.title,
                    categoryEmoji: category.emoji,
                    categoryColor: category.color,
                    file: article.file,
                    tags: article.tags || [],
                    url: `content.html?cat=${category.id}&file=${article.id}`
                });
            } catch (err) {
                console.warn(`Impossible d'indexer ${article.file}:`, err);
            }
        }
    } catch (error) {
        console.warn(`Impossible d'indexer la catégorie ${category.id}:`, error);
    }
}

/**
 * Extraire le titre depuis les premières lignes markdown
 */
function extractTitle(lines) {
    for (const line of lines) {
        if (line.startsWith('# ')) {
            return line.replace(/^#\s+/, '').trim();
        }
    }
    return 'Sans titre';
}

/**
 * Extraire un extrait du contenu
 */
function extractExcerpt(lines, maxLength = 150) {
    let excerpt = '';
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Ignorer les titres, lignes vides, et markdown spécial
        if (trimmed.startsWith('#') || 
            trimmed.startsWith('```') || 
            trimmed.startsWith('---') ||
            trimmed.length === 0) {
            continue;
        }
        
        excerpt += trimmed + ' ';
        
        if (excerpt.length >= maxLength) {
            break;
        }
    }
    
    excerpt = excerpt.trim();
    if (excerpt.length > maxLength) {
        excerpt = excerpt.substring(0, maxLength) + '...';
    }
    
    return excerpt || 'Aucun extrait disponible';
}

/**
 * Gérer la saisie dans le champ de recherche
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();

    if (query.length === 0) {
        hideSearchResults();
        return;
    }

    if (query.length < 2) {
        showSearchResults('<div class="search-no-results">Tapez au moins 2 caractères</div>');
        return;
    }

    performSearch(query);
}

/**
 * Effectuer la recherche
 */
function performSearch(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const item of searchIndex) {
        let score = 0;
        let matchType = '';

        // Recherche dans le titre (priorité haute)
        if (item.title.toLowerCase().includes(queryLower)) {
            score += 10;
            matchType = 'title';
        }

        // Recherche dans les tags (priorité moyenne)
        if (item.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
            score += 5;
            if (!matchType) matchType = 'tag';
        }

        // Recherche dans l'extrait (priorité moyenne)
        if (item.excerpt.toLowerCase().includes(queryLower)) {
            score += 3;
            if (!matchType) matchType = 'excerpt';
        }

        // Recherche dans le contenu complet (priorité basse)
        if (item.content.includes(queryLower)) {
            score += 1;
            if (!matchType) matchType = 'content';
        }

        if (score > 0) {
            results.push({ ...item, score, matchType });
        }
    }

    // Trier par score décroissant
    results.sort((a, b) => b.score - a.score);

    // Limiter à 10 résultats
    const topResults = results.slice(0, 10);

    displaySearchResults(topResults, query);
}

/**
 * Afficher les résultats de recherche
 */
function displaySearchResults(results, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
                    <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Aucun résultat pour "<strong>${escapeHtml(query)}</strong>"</p>
            </div>
        `;
        showSearchResults();
        return;
    }

    const html = `
        <div class="search-results-header">
            <span>${results.length} résultat${results.length > 1 ? 's' : ''}</span>
        </div>
        <div class="search-results-list">
            ${results.map((result, index) => `
                <a href="${result.url}" 
                   class="search-result-item" 
                   data-index="${index}"
                   onclick="addToRecents('content', '${result.category}/${result.id}', '${escapeHtml(result.title)}', '${result.categoryEmoji}')">
                    <div class="search-result-icon" style="background-color: ${result.categoryColor}20; color: ${result.categoryColor};">
                        ${result.categoryEmoji}
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">
                            ${highlightMatch(result.title, query)}
                        </div>
                        <div class="search-result-excerpt">
                            ${highlightMatch(result.excerpt, query)}
                        </div>
                        <div class="search-result-meta">
                            <span class="search-result-category">${result.categoryTitle}</span>
                            ${result.tags.length > 0 ? `
                                <span class="search-result-tags">
                                    ${result.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
    showSearchResults();
}

/**
 * Surligner les correspondances dans le texte
 */
function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return escapedText.replace(regex, '<mark>$1</mark>');
}

/**
 * Échapper le HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Afficher le conteneur de résultats
 */
function showSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
        container.style.display = 'block';
    }
}

/**
 * Masquer le conteneur de résultats
 */
function hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
        container.style.display = 'none';
    }
}

/**
 * Navigation au clavier dans les résultats
 */
function handleSearchKeyboard(e) {
    const container = document.getElementById('searchResults');
    if (!container || container.style.display === 'none') return;

    const items = container.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    let currentIndex = -1;
    items.forEach((item, index) => {
        if (item.classList.contains('active')) {
            currentIndex = index;
        }
    });

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, items.length - 1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            break;
        case 'Enter':
            e.preventDefault();
            if (currentIndex >= 0) {
                items[currentIndex].click();
            }
            return;
        case 'Escape':
            e.preventDefault();
            hideSearchResults();
            e.target.blur();
            return;
        default:
            return;
    }

    // Mettre à jour la sélection
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialiser la recherche après le chargement des partials
document.addEventListener('partialsLoaded', initSearch);

// Fallback si les partials sont déjà chargés
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initSearch, 100);
}

console.log('✅ search.js chargé');
