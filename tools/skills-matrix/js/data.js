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
        updateAllAdviceViews();
        saveData();
    }
}

/**
 * Sauvegarder les données dans localStorage
 */
function saveData() {
    try {
        // Si on utilise PocketBase, ne pas sauvegarder dans localStorage
        // La sauvegarde est gérée par pocketbase-integration.js
        if (typeof usePocketBase !== 'undefined' && usePocketBase) {
            console.log('💾 Sauvegarde gérée par PocketBase');
            return;
        }
        
        const dataStr = JSON.stringify(matrixData);
        localStorage.setItem('skillsMatrixData', dataStr);
        console.log('✅ Données sauvegardées dans localStorage');
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
        // Si on a un ID de matrice dans l'URL, ne pas charger le localStorage
        // Les données seront chargées depuis PocketBase
        const urlParams = new URLSearchParams(window.location.search);
        const matrixId = urlParams.get('matrix');
        
        if (matrixId) {
            console.log('📋 ID de matrice détecté, attente du chargement PocketBase...');
            return;
        }
        
        const saved = localStorage.getItem('skillsMatrixData');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Validation basique de la structure
            if (parsed && Array.isArray(parsed.skills) && Array.isArray(parsed.members)) {
                matrixData = parsed;
                console.log('✅ Données chargées depuis localStorage');
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
async function resetMatrix() {
    if (confirm('⚠️ Réinitialiser toute la matrice ? Cette action est irréversible.\n\nCela supprimera tous les membres et compétences de PocketBase.')) {
        try {
            showLoader('🔄 Réinitialisation...');
            showNotification('🔄 Réinitialisation en cours...', 'info');
            
            // Supprimer de PocketBase si disponible
            if (typeof usePocketBase !== 'undefined' && usePocketBase && typeof pbManager !== 'undefined' && window.currentMatrixId) {
                // Supprimer tous les member_items de cette matrice
                const memberItems = await pbManager.getRecords('memberItems', {
                    filter: `matrix = "${window.currentMatrixId}"`
                });
                
                for (const mi of memberItems) {
                    await pbManager.deleteRecord('memberItems', mi.id);
                }
                
                // Supprimer tous les membres de cette matrice
                const members = await pbManager.getRecords('members', {
                    filter: `matrix = "${window.currentMatrixId}"`
                });
                
                for (const member of members) {
                    await pbManager.deleteRecord('members', member.id);
                }
                
                // Supprimer tous les items de cette matrice
                const items = await pbManager.getRecords('items', {
                    filter: `matrix = "${window.currentMatrixId}"`
                });
                
                for (const item of items) {
                    await pbManager.deleteRecord('items', item.id);
                }
                
                console.log('✅ Données PocketBase supprimées');
            }
            
            // Supprimer de localStorage
            localStorage.removeItem('skillsMatrixData');
            
            // Réinitialiser la matrice
            initDefaultMatrix();
            renderMatrix();
            renderRadar();
            updateAllAdviceViews();
            
            hideLoader();
            showNotification('✅ Matrice réinitialisée', 'success');
        } catch (error) {
            hideLoader();
            console.error('Erreur lors de la réinitialisation:', error);
            showNotification('❌ Erreur lors de la réinitialisation', 'error');
        }
    }
}

/**
 * Exporter en JSON
 */
function exportToJSON() {
    try {
        showLoader('📥 Export JSON...');
        
        setTimeout(() => {
            const dataStr = JSON.stringify(matrixData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `skills-matrix-${getFormattedDate()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            hideLoader();
            showNotification('📥 Export JSON réussi', 'success');
        }, 300);
    } catch (error) {
        hideLoader();
        console.error('❌ Erreur lors de l\'export JSON:', error);
        showNotification('❌ Erreur lors de l\'export JSON', 'error');
    }
}

/**
 * Exporter en XLSX (Excel) avec couleurs dark, filtres et ajustement automatique
 */
function exportToXLSX() {
    try {
        // Vérifier si SheetJS est chargé
        if (typeof XLSX === 'undefined') {
            showLoader('📚 Chargement bibliothèque...');
            showNotification('📚 Chargement de la bibliothèque Excel...', 'info');
            
            // Charger SheetJS dynamiquement
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.onload = () => {
                hideLoader();
                exportToXLSX();
            };
            script.onerror = () => {
                hideLoader();
                showNotification('❌ Impossible de charger la bibliothèque Excel', 'error');
            };
            document.head.appendChild(script);
            return;
        }
        
        showLoader('📊 Export Excel...');

        // Créer les données pour le tableau
        const data = [];
        
        // En-tête avec Appétences et Ownerships
        const header = ['Membre', 'Appétences', 'Ownerships', ...matrixData.skills];
        data.push(header);
        
        // Lignes de données
        matrixData.members.forEach(member => {
            const appetences = (member.appetences || []).join(', ');
            const ownerships = (member.ownerships || []).join(', ');
            const row = [member.name, appetences, ownerships, ...member.levels];
            data.push(row);
        });
        
        // Ligne de totaux par compétence
        const totalRow = ['📊 Total par compétence', '', ''];
        matrixData.skills.forEach((_, skillIndex) => {
            const skillTotal = matrixData.members.reduce((sum, member) => {
                return sum + (member.levels[skillIndex] || 0);
            }, 0);
            totalRow.push(skillTotal);
        });
        data.push(totalRow);
        
        // Créer le workbook et la feuille
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Calculer la largeur optimale des colonnes
        const colWidths = [];
        
        // Colonne A (Membre) - calculer la largeur max
        let maxMemberLength = header[0].length;
        matrixData.members.forEach(member => {
            maxMemberLength = Math.max(maxMemberLength, (member.name || '').length);
        });
        colWidths.push({ wch: Math.min(Math.max(maxMemberLength + 2, 15), 30) });
        
        // Colonnes Appétences et Ownerships
        let maxAppetencesLength = header[1].length;
        let maxOwnershipsLength = header[2].length;
        matrixData.members.forEach(member => {
            const appetences = (member.appetences || []).join(', ');
            const ownerships = (member.ownerships || []).join(', ');
            maxAppetencesLength = Math.max(maxAppetencesLength, appetences.length);
            maxOwnershipsLength = Math.max(maxOwnershipsLength, ownerships.length);
        });
        colWidths.push({ wch: Math.min(Math.max(maxAppetencesLength + 2, 15), 40) });
        colWidths.push({ wch: Math.min(Math.max(maxOwnershipsLength + 2, 15), 40) });
        
        // Colonnes de compétences - calculer la largeur max
        matrixData.skills.forEach((skill, index) => {
            const skillLength = skill.length;
            colWidths.push({ wch: Math.min(Math.max(skillLength + 2, 12), 25) });
        });
        
        ws['!cols'] = colWidths;
        
        // Ajouter les filtres automatiques sur la ligne d'en-tête
        const range = XLSX.utils.decode_range(ws['!ref']);
        ws['!autofilter'] = { ref: XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: 0, c: range.e.c }
        })};
        
        // Appliquer les styles (couleurs dark)
        
        // Style pour l'en-tête principal (headerRow) - Colonne Membre
        const memberHeaderCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
        if (ws[memberHeaderCell]) {
            ws[memberHeaderCell].s = {
                fill: { fgColor: { rgb: "667EEA" } }, // Violet
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
        
        // Style pour Appétences header
        const appetencesCell = XLSX.utils.encode_cell({ r: 0, c: 1 });
        if (ws[appetencesCell]) {
            ws[appetencesCell].s = {
                fill: { fgColor: { rgb: "4FACFE" } }, // Bleu clair
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
        
        // Style pour Ownerships header
        const ownershipsCell = XLSX.utils.encode_cell({ r: 0, c: 2 });
        if (ws[ownershipsCell]) {
            ws[ownershipsCell].s = {
                fill: { fgColor: { rgb: "F093FB" } }, // Rose
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
        
        // Style pour les autres colonnes du header (compétences)
        for (let col = 3; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[cellAddress]) continue;
            
            ws[cellAddress].s = {
                fill: { fgColor: { rgb: "764BA2" } }, // Violet foncé
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
                alignment: { horizontal: "center", vertical: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
        
        // Style pour la colonne A (noms des membres) et les cellules de données
        for (let row = 1; row < range.e.r; row++) {
            // Colonne A - Noms des membres
            const memberCell = XLSX.utils.encode_cell({ r: row, c: 0 });
            if (ws[memberCell]) {
                ws[memberCell].s = {
                    fill: { fgColor: { rgb: "5A67D8" } }, // Bleu-violet
                    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
                    alignment: { horizontal: "left", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };
            }
            
            // Colonnes Appétences et Ownerships
            for (let col = 1; col <= 2; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        fill: { fgColor: { rgb: "F7FAFC" } }, // Gris très clair
                        font: { color: { rgb: "2D3748" }, sz: 10 },
                        alignment: { horizontal: "left", vertical: "center", wrapText: true },
                        border: {
                            top: { style: "thin", color: { rgb: "E2E8F0" } },
                            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                            left: { style: "thin", color: { rgb: "E2E8F0" } },
                            right: { style: "thin", color: { rgb: "E2E8F0" } }
                        }
                    };
                }
            }
            
            // Cellules de niveaux (compétences)
            for (let col = 3; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!ws[cellAddress]) continue;
                
                const level = ws[cellAddress].v;
                let fillColor = "E2E8F0"; // Niveau 0 - Gris clair
                let fontColor = "718096"; // Gris
                
                if (level === 4) {
                    fillColor = "38EF7D"; // Vert
                    fontColor = "1A202C"; // Noir
                } else if (level === 3) {
                    fillColor = "F6E05E"; // Jaune
                    fontColor = "1A202C";
                } else if (level === 2) {
                    fillColor = "F6AD55"; // Orange
                    fontColor = "1A202C";
                } else if (level === 1) {
                    fillColor = "FC8181"; // Rouge clair
                    fontColor = "1A202C";
                }
                
                ws[cellAddress].s = {
                    fill: { fgColor: { rgb: fillColor } },
                    font: { bold: true, color: { rgb: fontColor }, sz: 11 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "CBD5E0" } },
                        bottom: { style: "thin", color: { rgb: "CBD5E0" } },
                        left: { style: "thin", color: { rgb: "CBD5E0" } },
                        right: { style: "thin", color: { rgb: "CBD5E0" } }
                    }
                };
            }
        }
        
        // Style pour la ligne de totaux
        const totalRowIndex = range.e.r;
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
            if (!ws[cellAddress]) continue;
            
            if (col < 3) {
                // Cellules de label
                ws[cellAddress].s = {
                    fill: { fgColor: { rgb: "2D3748" } }, // Gris foncé
                    font: { bold: true, color: { rgb: "00D4FF" }, sz: 11 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "medium", color: { rgb: "000000" } },
                        bottom: { style: "medium", color: { rgb: "000000" } },
                        left: { style: "medium", color: { rgb: "000000" } },
                        right: { style: "medium", color: { rgb: "000000" } }
                    }
                };
            } else {
                // Cellules de totaux avec couleurs selon moyenne
                const total = ws[cellAddress].v;
                const avgLevel = matrixData.members.length > 0
                    ? Math.round(total / matrixData.members.length)
                    : 0;
                
                let fillColor = "E2E8F0";
                let fontColor = "718096";
                
                if (avgLevel === 4) {
                    fillColor = "38EF7D";
                    fontColor = "1A202C";
                } else if (avgLevel === 3) {
                    fillColor = "F6E05E";
                    fontColor = "1A202C";
                } else if (avgLevel === 2) {
                    fillColor = "F6AD55";
                    fontColor = "1A202C";
                } else if (avgLevel === 1) {
                    fillColor = "FC8181";
                    fontColor = "1A202C";
                }
                
                ws[cellAddress].s = {
                    fill: { fgColor: { rgb: fillColor } },
                    font: { bold: true, color: { rgb: fontColor }, sz: 12 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "medium", color: { rgb: "000000" } },
                        bottom: { style: "medium", color: { rgb: "000000" } },
                        left: { style: "medium", color: { rgb: "000000" } },
                        right: { style: "medium", color: { rgb: "000000" } }
                    }
                };
            }
        }
        
        // Figer la première ligne (header) et la première colonne (membres)
        ws['!freeze'] = { xSplit: 1, ySplit: 1 };
        
        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Skills Matrix');
        
        // Ajouter la feuille des conseils stratégiques
        if (typeof exportStrategicAdviceData === 'function') {
            const strategicData = exportStrategicAdviceData();
            const wsStrategic = XLSX.utils.aoa_to_sheet(strategicData);
            
            // Définir la largeur des colonnes
            wsStrategic['!cols'] = [
                { wch: 15 },  // Type
                { wch: 12 },  // Priorité
                { wch: 25 },  // Sujet
                { wch: 50 },  // Détails
                { wch: 50 }   // Recommandations
            ];
            
            // Style pour l'en-tête
            const strategicRange = XLSX.utils.decode_range(wsStrategic['!ref']);
            for (let col = strategicRange.s.c; col <= strategicRange.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                if (!wsStrategic[cellAddress]) continue;
                
                wsStrategic[cellAddress].s = {
                    fill: { fgColor: { rgb: "667EEA" } },
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
            
            // Style pour les lignes de données selon le type
            for (let row = 1; row <= strategicRange.e.r; row++) {
                const typeCell = wsStrategic[XLSX.utils.encode_cell({ r: row, c: 0 })];
                if (!typeCell) continue;
                
                let fillColor = "1A1A2E"; // Couleur par défaut
                
                // Couleur selon le type
                if (typeCell.v === 'Risque') {
                    const priorityCell = wsStrategic[XLSX.utils.encode_cell({ r: row, c: 1 })];
                    fillColor = priorityCell && priorityCell.v === 'CRITIQUE' ? "FF6B6B" : "DF982D";
                } else if (typeCell.v === 'Mentorat') {
                    fillColor = "4FACFE";
                } else if (typeCell.v === 'Charge') {
                    fillColor = "F093FB";
                }
                
                // Appliquer le style à toute la ligne
                for (let col = strategicRange.s.c; col <= strategicRange.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    if (!wsStrategic[cellAddress]) continue;
                    
                    wsStrategic[cellAddress].s = {
                        fill: { fgColor: { rgb: fillColor } },
                        font: { color: { rgb: "FFFFFF" } },
                        alignment: { horizontal: "left", vertical: "top", wrapText: true }
                    };
                }
            }
            
            // Activer le filtre automatique
            wsStrategic['!autofilter'] = { ref: XLSX.utils.encode_range(strategicRange) };
            
            XLSX.utils.book_append_sheet(wb, wsStrategic, 'Conseils Stratégiques');
        }
        
        // Télécharger le fichier
        setTimeout(() => {
            XLSX.writeFile(wb, `skills-matrix-${getFormattedDate()}.xlsx`);
            hideLoader();
            showNotification('📊 Export Excel réussi', 'success');
        }, 300);
    } catch (error) {
        hideLoader();
        console.error('❌ Erreur lors de l\'export Excel:', error);
        showNotification('⚠️ Impossible d\'exporter en Excel', 'error');
    }
}

/**
 * Importer depuis JSON
 */
function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showLoader('📤 Import JSON...');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                
                // Validation de la structure
                if (!imported.skills || !imported.members) {
                    throw new Error('Structure de données invalide');
                }
                
                if (confirm('⚠️ Importer ces données ? Cela remplacera les données actuelles.')) {
                    matrixData = imported;
                    
                    // Réinitialiser les membres visibles
                    visibleMembers = matrixData.members.map((_, index) => index);
                    
                    renderMatrix();
                    renderRadar();
                    renderAdvice();
                    
                    hideLoader();
                    showNotification('📥 Import JSON réussi', 'success');
                    
                    // Afficher le prompt de sauvegarde
                    if (typeof showImportPrompt === 'function') {
                        showImportPrompt('JSON');
                    }
                } else {
                    hideLoader();
                }
            } catch (error) {
                hideLoader();
                console.error('❌ Erreur lors de l\'import:', error);
                showNotification('⚠️ Fichier JSON invalide', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Importer depuis XLSX
 */
function importFromXLSX() {
    // Vérifier si SheetJS est chargé
    if (typeof XLSX === 'undefined') {
        showLoader('📚 Chargement bibliothèque...');
        showNotification('📚 Chargement de la bibliothèque Excel...', 'info');
        
        const script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
        script.onload = () => {
            hideLoader();
            importFromXLSX();
        };
        script.onerror = () => {
            hideLoader();
            showNotification('❌ Impossible de charger la bibliothèque Excel', 'error');
        };
        document.head.appendChild(script);
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showLoader('📈 Import Excel...');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                if (jsonData.length < 2) {
                    throw new Error('Fichier vide ou invalide');
                }
                
                // Parser les données
                const header = jsonData[0];
                const skillsStartIndex = 3; // Après Membre, Appétences, Ownerships
                const skills = header.slice(skillsStartIndex);
                
                const members = [];
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row[0] === '📊 Total par compétence') break; // Ignorer la ligne de totaux
                    
                    const member = {
                        name: row[0] || `Membre ${i}`,
                        appetences: row[1] ? row[1].split(',').map(s => s.trim()).filter(s => s) : [],
                        ownerships: row[2] ? row[2].split(',').map(s => s.trim()).filter(s => s) : [],
                        levels: row.slice(skillsStartIndex).map(v => parseInt(v) || 0)
                    };
                    members.push(member);
                }
                
                if (confirm('⚠️ Importer ces données ? Cela remplacera les données actuelles.')) {
                    matrixData = {
                        skills: skills,
                        members: members,
                        appetences: matrixData.appetences || [],
                        ownerships: matrixData.ownerships || []
                    };
                    
                    // Réinitialiser les membres visibles
                    visibleMembers = matrixData.members.map((_, index) => index);
                    
                    renderMatrix();
                    renderRadar();
                    renderAdvice();
                    
                    hideLoader();
                    showNotification('📊 Import Excel réussi', 'success');
                    
                    // Afficher le prompt de sauvegarde
                    if (typeof showImportPrompt === 'function') {
                        showImportPrompt('Excel');
                    }
                } else {
                    hideLoader();
                }
            } catch (error) {
                hideLoader();
                console.error('❌ Erreur lors de l\'import:', error);
                showNotification('⚠️ Fichier Excel invalide', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    };
    
    input.click();
}

console.log('✅ data.js chargé');
