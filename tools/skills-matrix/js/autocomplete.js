/**
 * Skills Matrix - Autocomplétion avec PocketBase
 */

/**
 * Récupérer les suggestions d'autocomplétion depuis PocketBase
 * @param {string} type - Type d'item ('skill', 'appetence', 'ownership')
 * @param {string} query - Texte de recherche
 * @returns {Promise<string[]>} Liste des suggestions
 */
async function getAutocompleteSuggestions(type, query = '') {
    if (typeof usePocketBase === 'undefined' || !usePocketBase || !pbManager) {
        console.log('⚠️ PocketBase non disponible pour autocomplétion');
        return [];
    }

    try {
        // Récupérer tous les items du type demandé depuis toutes les matrices
        const filter = type ? `type = "${type}" && active = true` : `active = true`;
        
        const items = await pbManager.getRecords('items', {
            filter: filter,
            sort: 'name',
            perPage: 500
        });

        console.log(`📋 ${items.length} items trouvés pour type "${type}"`);

        // Extraire les noms uniques
        const uniqueNames = [...new Set(items.map(item => item.name))];

        // Filtrer par query si fourni
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = uniqueNames.filter(name => 
                name.toLowerCase().includes(lowerQuery)
            ).slice(0, 10); // Limiter à 10 suggestions
            
            console.log(`🔍 ${filtered.length} suggestions pour "${query}"`);
            return filtered;
        }

        return uniqueNames.slice(0, 20); // Limiter à 20 suggestions sans query
    } catch (error) {
        console.error('❌ Erreur récupération suggestions:', error);
        return [];
    }
}

/**
 * Initialiser l'autocomplétion sur un input
 * @param {HTMLInputElement} input - Élément input
 * @param {string} type - Type d'item ('skill', 'appetence', 'ownership')
 */
function initAutocomplete(input, type) {
    if (!input) {
        console.warn('⚠️ Input non trouvé pour autocomplétion');
        return;
    }

    console.log(`✅ Initialisation autocomplétion pour ${input.id} (type: ${type})`);

    // Vérifier si le conteneur existe déjà
    let suggestionsContainer = input.parentElement.querySelector('.autocomplete-suggestions');
    
    if (!suggestionsContainer) {
        // Créer le conteneur de suggestions
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'autocomplete-suggestions';
        suggestionsContainer.style.display = 'none';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestionsContainer);
    }

    let currentSuggestions = [];
    let selectedIndex = -1;

    // Fonction pour afficher les suggestions
    const showSuggestions = async () => {
        const query = input.value.trim();
        
        console.log(`🔍 Recherche suggestions pour: "${query}"`);
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const suggestions = await getAutocompleteSuggestions(type, query);
        currentSuggestions = suggestions;

        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            console.log('❌ Aucune suggestion trouvée');
            return;
        }

        console.log(`✅ ${suggestions.length} suggestions affichées`);

        suggestionsContainer.innerHTML = suggestions.map((suggestion, index) => `
            <div class="autocomplete-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
                ${suggestion}
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Ajouter les événements de clic
        suggestionsContainer.querySelectorAll('.autocomplete-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                input.value = suggestions[index];
                suggestionsContainer.style.display = 'none';
                selectedIndex = -1;
                input.focus();
                console.log(`✅ Suggestion sélectionnée: ${suggestions[index]}`);
            });
        });
    };

    // Événement input
    input.addEventListener('input', () => {
        console.log('📝 Input event déclenché');
        showSuggestions();
    });

    // Événement clavier
    input.addEventListener('keydown', (e) => {
        if (suggestionsContainer.style.display === 'none') return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
            showSuggestions();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            showSuggestions();
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            input.value = currentSuggestions[selectedIndex];
            suggestionsContainer.style.display = 'none';
            selectedIndex = -1;
        } else if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
            selectedIndex = -1;
        }
    });

    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
            selectedIndex = -1;
        }
    });
}

console.log('✅ autocomplete.js chargé');
