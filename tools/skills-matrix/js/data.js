/**
 * Skills Matrix - Gestion des données
 */

/**
 * Structure des données de la matrice
 * @typedef {Object} MatrixData
 * @property {string[]} skills - Liste des compétences
 * @property {Member[]} members - Liste des membres
 * @property {string[]} appetences - Liste des appétences disponibles
 * @property {string[]} ownerships - Liste des sujets owner disponibles
 */

/**
 * Structure d'un membre
 * @typedef {Object} Member
 * @property {string} name - Nom du membre
 * @property {number[]} levels - Niveaux de compétence (0-4)
 * @property {string[]} appetences - Appétences du membre
 * @property {string[]} ownerships - Ownerships du membre
 */

/**
 * Données de la matrice
 * @type {MatrixData}
 */
let matrixData = {
    skills: [],
    members: [],
    appetences: [],
    ownerships: []
};

/**
 * État des membres visibles dans le radar
 * @type {number[]}
 */
let visibleMembers = [];

/**
 * Filtre actif pour les conseils
 * @type {string}
 */
let activeAdviceFilter = 'all';

/**
 * Initialiser la matrice par défaut
 */
function initDefaultMatrix() {
    matrixData = {
        skills: ["Compétence 1", "Compétence 2", "Compétence 3"],
        members: [
            { name: "Membre A", levels: [0, 0, 0], appetences: [], ownerships: [] },
            { name: "Membre B", levels: [0, 0, 0], appetences: [], ownerships: [] }
        ],
        appetences: [],
        ownerships: []
    };
}

/**
 * Charger un template
 */
function loadTemplate(templateKey) {
    const template = templates[templateKey];
    if (!template) return;

    if (confirm(`Charger le modèle "${template.name}" ? Cela remplacera les données actuelles.`)) {
        // Conserver les pbId existants pour éviter de créer des doublons
        const existingMembers = matrixData.members || [];
        
        matrixData = {
            skills: [...template.skills],
            members: template.members.map((m, index) => {
                // Réutiliser le pbId si un membre existe déjà à cet index
                const existingMember = existingMembers[index];
                return {
                    name: m.name,
                    levels: [...m.levels],
                    appetences: m.appetences || [],
                    ownerships: m.ownerships || [],
                    pbId: existingMember?.pbId || undefined // Conserver l'ID PocketBase si existe
                };
            }),
            appetences: template.appetences || [],
            ownerships: template.ownerships || []
        };
        
        // Si on a plus de membres dans l'ancien matrixData, supprimer les extras de PocketBase
        if (existingMembers.length > template.members.length && typeof deleteMemberFromPocketBase === 'function') {
            for (let i = template.members.length; i < existingMembers.length; i++) {
                if (existingMembers[i].pbId) {
                    deleteMemberFromPocketBase(existingMembers[i]);
                }
            }
        }
        
        renderMatrix();
        renderRadar();
        renderAdvice();
        saveData();
    }
}

/**
 * Sauvegarder les données dans localStorage
 */
function saveData() {
    try {
        const dataStr = JSON.stringify(matrixData);
        localStorage.setItem('skillsMatrixData', dataStr);
        console.log('✅ Données sauvegardées');
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        alert('⚠️ Impossible de sauvegarder les données. Vérifiez l\'espace de stockage disponible.');
    }
}

/**
 * Charger les données depuis localStorage
 */
function loadData() {
    try {
        const saved = localStorage.getItem('skillsMatrixData');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Validation basique de la structure
            if (parsed && Array.isArray(parsed.skills) && Array.isArray(parsed.members)) {
                matrixData = parsed;
                console.log('✅ Données chargées');
            } else {
                console.warn('⚠️ Structure de données invalide, initialisation par défaut');
                initDefaultMatrix();
            }
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        alert('⚠️ Impossible de charger les données sauvegardées. Initialisation par défaut.');
        initDefaultMatrix();
    }
}

/**
 * Réinitialiser la matrice
 */
function resetMatrix() {
    if (confirm('⚠️ Réinitialiser toute la matrice ? Cette action est irréversible.')) {
        localStorage.removeItem('skillsMatrixData');
        initDefaultMatrix();
        renderMatrix();
        renderRadar();
        renderAdvice();
    }
}

/**
 * Exporter en JSON
 */
function exportToJSON() {
    try {
        const dataStr = JSON.stringify(matrixData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `skills-matrix-${getFormattedDate()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('📥 Export JSON réussi');
    } catch (error) {
        console.error('❌ Erreur lors de l\'export JSON:', error);
        alert('⚠️ Impossible d\'exporter les données en JSON.');
    }
}

/**
 * Exporter en XLSX (Excel)
 */
function exportToXLSX() {
    try {
        // Vérifier si SheetJS est chargé
        if (typeof XLSX === 'undefined') {
            showNotification('⚠️ Chargement de la bibliothèque Excel...', 'info');
            
            // Charger SheetJS dynamiquement
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.onload = () => exportToXLSX();
            script.onerror = () => {
                showNotification('❌ Impossible de charger la bibliothèque Excel', 'error');
            };
            document.head.appendChild(script);
            return;
        }

        // Créer les données pour le tableau
        const data = [];
        
        // En-tête
        const header = ['Membre', ...matrixData.skills, 'Total'];
        data.push(header);
        
        // Lignes de données
        matrixData.members.forEach(member => {
            const total = member.levels.reduce((sum, level) => sum + level, 0);
            const row = [member.name, ...member.levels, total];
            data.push(row);
        });
        
        // Créer le workbook et la feuille
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Définir la largeur des colonnes
        const colWidths = [{ wch: 20 }]; // Colonne Membre
        matrixData.skills.forEach(() => colWidths.push({ wch: 12 }));
        colWidths.push({ wch: 10 }); // Colonne Total
        ws['!cols'] = colWidths;
        
        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Skills Matrix');
        
        // Télécharger le fichier
        XLSX.writeFile(wb, `skills-matrix-${getFormattedDate()}.xlsx`);
        
        showNotification('📊 Export Excel réussi', 'success');
    } catch (error) {
        console.error('❌ Erreur lors de l\'export Excel:', error);
        showNotification('⚠️ Impossible d\'exporter en Excel', 'error');
    }
}

console.log('✅ data.js chargé');
