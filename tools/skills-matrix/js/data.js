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
        matrixData = {
            skills: [...template.skills],
            members: template.members.map(m => ({
                name: m.name,
                levels: [...m.levels],
                appetences: m.appetences || [],
                ownerships: m.ownerships || []
            })),
            appetences: template.appetences || [],
            ownerships: template.ownerships || []
        };
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
 * Exporter en CSV
 */
function exportToCSV() {
    try {
        let csv = 'Membre,' + matrixData.skills.map(s => `"${s}"`).join(',') + ',Total\n';

        matrixData.members.forEach(member => {
            const total = member.levels.reduce((sum, level) => sum + level, 0);
            const escapedName = member.name.replace(/"/g, '""');
            csv += `"${escapedName}",${member.levels.join(',')},${total}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `skills-matrix-${getFormattedDate()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('📊 Export CSV réussi');
    } catch (error) {
        console.error('❌ Erreur lors de l\'export CSV:', error);
        alert('⚠️ Impossible d\'exporter les données en CSV.');
    }
}

console.log('✅ data.js chargé');
