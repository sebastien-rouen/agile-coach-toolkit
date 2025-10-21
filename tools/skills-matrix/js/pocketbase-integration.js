/**
 * PocketBase Integration pour Skills Matrix
 * 
 * Gère la synchronisation entre l'interface et PocketBase
 * Fallback automatique vers localStorage si PocketBase indisponible
 */

// Configuration PocketBase - Nouvelles collections (migrations v1.0.1)
const PB_CONFIG = {
    baseUrl: '/pb', // À adapter selon votre configuration
    collections: {
        matrices: 'tools_skills_matrix_matrices',
        members: 'tools_skills_matrix_members',
        items: 'tools_skills_matrix_items',
        memberItems: 'tools_skills_matrix_member_items',
        templates: 'tools_skills_matrix_templates'
    }
};

// Instance du gestionnaire PocketBase
let pbManager = null;
let usePocketBase = false;
let isInitialized = false;

/**
 * Initialise la connexion PocketBase
 */
async function initPocketBase() {
    // Éviter les initialisations multiples
    if (isInitialized) {
        console.log('⚠️ PocketBase déjà initialisé, skip');
        return;
    }

    isInitialized = true;

    // Vérifier si on a un ID de matrice dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const matrixId = urlParams.get('matrix');

    if (!matrixId) {
        console.log('📺 Mode DÉMO (sans ID de matrice)');
        console.log('💡 Pour éditer et sauvegarder, créez une nouvelle matrice');
        usePocketBase = false;
        showDemoNotification();
        return;
    }

    try {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        usePocketBase = await pbManager.testConnection();

        if (usePocketBase) {
            console.log('✅ PocketBase connecté - Mode ÉDITION');
            window.currentMatrixId = matrixId;
            try {
                await loadFromPocketBase();
            } catch (loadError) {
                console.warn('⚠️ Impossible de charger depuis PocketBase:', loadError.message);
                console.log('📦 Utilisation des données locales');
                usePocketBase = false;
            }
        } else {
            console.log('📦 Mode local (localStorage)');
        }
    } catch (error) {
        console.error('Erreur initialisation PocketBase:', error);
        usePocketBase = false;
    }
}

/**
 * Affiche une notification en mode démo
 */
function showDemoNotification() {
    // Mettre à jour le nom de la matrice
    const matrixNameEl = document.getElementById('matrixName');
    if (matrixNameEl) {
        matrixNameEl.textContent = 'Mode Démo';
        matrixNameEl.style.opacity = '0.7';
    }

    // Créer la notification
    const notification = document.createElement('div');
    notification.className = 'demo-notification';
    notification.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 16px 24px; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 16px;
                    animation: slideDown 0.3s ease;">
            <span style="font-size: 24px;">📺</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">Mode Démo</div>
                <div style="font-size: 0.9em; opacity: 0.9;">
                    Les modifications ne seront pas sauvegardées. 
                    <button onclick="createNewMatrix()" 
                            style="background: white; 
                                   color: #667eea; 
                                   border: none; 
                                   padding: 4px 12px; 
                                   border-radius: 6px; 
                                   font-weight: 600; 
                                   cursor: pointer;
                                   margin-left: 8px;">
                        Créer une matrice
                    </button>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); 
                           border: none; 
                           color: white; 
                           width: 28px; 
                           height: 28px; 
                           border-radius: 50%; 
                           cursor: pointer;
                           font-size: 18px;">×</button>
        </div>
    `;
    
    // Insérer après le header
    const header = document.querySelector('.matrix-header');
    if (header) {
        header.after(notification);
    }
}

/**
 * Charge les données depuis PocketBase (nouvelle architecture)
 */
async function loadFromPocketBase() {
    try {
        // Récupérer ou créer la matrice par défaut
        let matrix = await getOrCreateDefaultMatrix();

        console.log(`📋 Chargement de la matrice: ${matrix.name} (${matrix.id})`);

        // Charger les membres de cette matrice
        const membersData = await pbManager.getRecords('members', {
            filter: `matrix = "${matrix.id}" && active = true`,
            sort: 'name'
        });

        console.log(`👥 ${membersData.length} membres trouvés:`, membersData.map(m => m.name));

        // Charger les items (skills + ownerships) de cette matrice
        const itemsData = await pbManager.getRecords('items', {
            filter: `matrix = "${matrix.id}" && active = true`,
            sort: 'type,category,name'
        });

        console.log(`📦 ${itemsData.length} items trouvés`);

        // Séparer skills et ownerships
        const skillsData = itemsData.filter(item => item.type === 'skill');
        const ownershipsData = itemsData.filter(item => item.type === 'ownership');

        console.log(`🎯 ${skillsData.length} skills, ${ownershipsData.length} ownerships`);

        // Charger les associations (avec expansion des relations)
        const memberItemsData = await pbManager.getRecords('memberItems', {
            filter: `matrix = "${matrix.id}"`,
            expand: 'member,item',
            sort: '-updated'
        });

        console.log(`🔗 ${memberItemsData.length} member_items trouvés`);

        // Convertir au format de l'application
        convertPocketBaseToApp(membersData, skillsData, ownershipsData, memberItemsData, matrix);

        console.log(`📊 Chargé: ${membersData.length} membres, ${skillsData.length} compétences, ${ownershipsData.length} ownerships, ${memberItemsData.length} évaluations`);
    } catch (error) {
        console.error('Erreur chargement PocketBase:', error);
        // Les données locales sont déjà chargées par data.js
        throw error;
    }
}

/**
 * Récupère la matrice par son ID
 */
async function getOrCreateDefaultMatrix() {
    try {
        const matrixId = window.currentMatrixId;
        
        if (!matrixId) {
            throw new Error('Aucun ID de matrice fourni');
        }

        // Récupérer la matrice par son ID
        try {
            const matrix = await pbManager.getRecord('matrices', matrixId);

            console.log('✅ Matrice trouvée:', matrix.name);

            // Afficher le nom de la matrice
            const matrixNameEl = document.getElementById('matrixName');
            if (matrixNameEl) {
                matrixNameEl.textContent = matrix.name;
            }

            return matrix;
        } catch (error) {
            // Si la matrice n'existe pas (404), proposer de créer une nouvelle matrice
            if (error.message.includes('404')) {
                console.warn('⚠️ Matrice introuvable:', matrixId);
                
                // Nettoyer l'URL
                window.history.replaceState({}, '', window.location.pathname);
                
                // Afficher un message et proposer de créer une nouvelle matrice
                showMatrixNotFoundNotification(matrixId);
                
                throw new Error('Matrice introuvable');
            }
            throw error;
        }
    } catch (error) {
        console.error('Erreur récupération matrice:', error);
        throw error;
    }
}

/**
 * Affiche une notification quand la matrice n'est pas trouvée
 */
function showMatrixNotFoundNotification(matrixId) {
    const notification = document.createElement('div');
    notification.className = 'matrix-not-found-notification';
    notification.innerHTML = `
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); 
                    color: white; 
                    padding: 16px 24px; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 16px;
                    animation: slideDown 0.3s ease;">
            <span style="font-size: 24px;">⚠️</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">Matrice introuvable</div>
                <div style="font-size: 0.9em; opacity: 0.9;">
                    La matrice <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">${matrixId}</code> n'existe pas.
                    <button onclick="createNewMatrix()" 
                            style="background: white; 
                                   color: #f59e0b; 
                                   border: none; 
                                   padding: 4px 12px; 
                                   border-radius: 6px; 
                                   font-weight: 600; 
                                   cursor: pointer;
                                   margin-left: 8px;">
                        Créer une nouvelle matrice
                    </button>
                    <button onclick="loadExistingMatrix()" 
                            style="background: rgba(255,255,255,0.2); 
                                   color: white; 
                                   border: none; 
                                   padding: 4px 12px; 
                                   border-radius: 6px; 
                                   font-weight: 600; 
                                   cursor: pointer;
                                   margin-left: 8px;">
                        Charger une matrice existante
                    </button>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); 
                           border: none; 
                           color: white; 
                           width: 28px; 
                           height: 28px; 
                           border-radius: 50%; 
                           cursor: pointer;
                           font-size: 18px;">×</button>
        </div>
    `;
    
    // Insérer après le header
    const header = document.querySelector('.matrix-header');
    if (header) {
        header.after(notification);
    }
    
    // Mettre à jour le nom de la matrice
    const matrixNameEl = document.getElementById('matrixName');
    if (matrixNameEl) {
        matrixNameEl.textContent = 'Matrice introuvable';
        matrixNameEl.style.opacity = '0.5';
    }
}

/**
 * Convertit les données PocketBase au format de l'application (nouvelle architecture)
 */
function convertPocketBaseToApp(membersData, skillsData, ownershipsData, memberItemsData, matrix) {
    // Stocker l'ID de la matrice pour les futures opérations
    window.currentMatrixId = matrix.id;

    // Convertir les compétences
    const skills = skillsData.map(skill => skill.name);

    console.log(`📊 Conversion: ${membersData.length} membres, ${skills.length} skills, ${memberItemsData.length} member_items`);

    // Créer un mapping membre -> items (skills + ownerships)
    const memberItemsMap = {};
    const memberAppetencesMap = {};
    const memberOwnershipsMap = {};

    // Initialiser les maps pour tous les membres
    membersData.forEach(member => {
        memberItemsMap[member.id] = {};
        memberAppetencesMap[member.id] = [];
        memberOwnershipsMap[member.id] = [];
    });

    // Remplir les maps avec les données des member_items
    memberItemsData.forEach(mi => {
        const memberId = mi.member;
        const item = mi.expand?.item;

        if (!item) {
            console.warn('⚠️ member_item sans item expand:', mi.id);
            return;
        }

        if (!memberItemsMap[memberId]) {
            console.warn('⚠️ member_item pour membre inconnu:', memberId);
            return;
        }

        if (item.type === 'skill') {
            // C'est une compétence
            memberItemsMap[memberId][item.name] = {
                level: mi.level || 0,
                appetite: mi.appetite || 0,
                notes: mi.notes || '',
                // Ne pas stocker l'ID ici, il sera géré par existingMap
            };

            // Si appétence élevée (>= 3), ajouter aux appétences
            if (mi.appetite >= 3) {
                memberAppetencesMap[memberId].push(item.name);
            }
        } else if (item.type === 'appetence') {
            // C'est une appétence libre (non liée à un skill)
            memberAppetencesMap[memberId].push(item.name);
            console.log(`🎯 Appétence libre: ${item.name} pour membre ${memberId}`);
        } else if (item.type === 'ownership') {
            // C'est un ownership
            const ownershipText = mi.ownership_role
                ? `${item.name}`
                : item.name;
            memberOwnershipsMap[memberId].push(ownershipText);
            console.log(`🏆 Ownership: ${ownershipText} pour membre ${memberId}`);
        }
    });

    // Convertir les membres avec leurs niveaux
    const members = membersData.map(member => {
        const levels = skills.map(skill => {
            const memberItem = memberItemsMap[member.id]?.[skill];
            return memberItem ? memberItem.level : 0;
        });

        const memberAppetences = memberAppetencesMap[member.id] || [];
        const memberOwnerships = memberOwnershipsMap[member.id] || [];

        console.log(`👤 Membre: ${member.name} (${member.id}) - ${levels.length} niveaux, ${memberAppetences.length} appétences, ${memberOwnerships.length} ownerships`);
        if (memberOwnerships.length > 0) {
            console.log(`   🏆 Ownerships: ${memberOwnerships.join(', ')}`);
        }

        return {
            name: member.name,
            levels: levels,
            appetences: memberAppetences,
            ownerships: memberOwnerships,
            pbId: member.id,
            email: member.email || '',
            role: member.role || ''
        };
    });

    // Mettre à jour matrixData (structure globale)
    matrixData = {
        skills: skills,
        members: members,
        appetences: [...new Set(Object.values(memberAppetencesMap).flat())],
        ownerships: ownershipsData.map(o => o.name)
    };

    console.log(`✅ matrixData mis à jour: ${matrixData.members.length} membres, ${matrixData.skills.length} skills`);

    // Réinitialiser visibleMembers pour afficher tous les membres chargés
    if (typeof visibleMembers !== 'undefined') {
        visibleMembers = matrixData.members.map((_, index) => index);
        console.log(`👁️ visibleMembers réinitialisé: ${visibleMembers.length} membres visibles`);
    }

    // Mettre à jour l'interface
    renderMatrix();
    renderRadar();
    renderAdvice();

    console.log('✅ Données PocketBase chargées et affichées');
}

/**
 * Sauvegarde un membre dans PocketBase (nouvelle architecture)
 */
async function saveMemberToPocketBase(member, index) {
    if (!usePocketBase || !pbManager || !window.currentMatrixId) return;

    try {
        const memberData = {
            matrix: window.currentMatrixId,
            name: member.name,
            email: member.email || '',
            role: member.role || '',
            active: true
        };

        let memberId = member.pbId;

        // Créer ou mettre à jour le membre
        if (memberId) {
            await pbManager.updateRecord('members', memberId, memberData);
        } else {
            const created = await pbManager.createRecord('members', memberData);
            memberId = created.id;
            matrixData.members[index].pbId = memberId;
        }

        // Sauvegarder les niveaux de compétences et appétences
        await saveMemberItemsToPocketBase(memberId, member);

    } catch (error) {
        console.error('Erreur sauvegarde membre:', error);
    }
}

/**
 * Sauvegarde les items (skills + ownerships) d'un membre (nouvelle architecture)
 */
async function saveMemberItemsToPocketBase(memberId, member) {
    if (!usePocketBase || !pbManager || !window.currentMatrixId) return;

    try {
        // Récupérer tous les items de la matrice (avec expand pour éviter les erreurs)
        const itemsData = await pbManager.getRecords('items', {
            filter: `matrix = "${window.currentMatrixId}" && active = true`
        });

        // Récupérer les associations existantes pour ce membre (avec expand)
        const existingItems = await pbManager.getRecords('memberItems', {
            filter: `matrix = "${window.currentMatrixId}" && member = "${memberId}"`,
            expand: 'item'
        });

        // Créer un mapping item -> association pour mise à jour
        const existingMap = {};
        const processedItemIds = new Set();

        existingItems.forEach(mi => {
            // Vérifier que l'item existe toujours
            if (mi.expand?.item) {
                existingMap[mi.item] = mi.id;
            }
        });

        // Sauvegarder les skills avec niveaux et appétences
        const skills = matrixData.skills || [];
        for (let i = 0; i < skills.length; i++) {
            const skillName = skills[i];
            const level = member.levels[i];

            // Trouver l'ID de l'item
            const itemData = itemsData.find(item => item.name === skillName && item.type === 'skill');
            if (!itemData) {
                // Créer l'item s'il n'existe pas
                const newItem = await pbManager.createRecord('items', {
                    matrix: window.currentMatrixId,
                    name: skillName,
                    type: 'skill',
                    category: 'Général',
                    active: true
                });
                itemsData.push(newItem);
                continue;
            }

            // Calculer l'appétence (si le skill est dans les appétences du membre)
            const appetite = member.appetences?.includes(skillName) ? 4 : 0;

            const data = {
                matrix: window.currentMatrixId,
                member: memberId,
                item: itemData.id,
                level: level,
                appetite: appetite,
                last_assessed: new Date().toISOString().split('T')[0]
            };

            const existingId = existingMap[itemData.id];

            if (existingId) {
                // Mettre à jour (avec gestion d'erreur 404)
                try {
                    await pbManager.updateRecord('memberItems', existingId, data);
                } catch (error) {
                    // Si l'item n'existe plus (404), le créer
                    if (error.message.includes('404')) {
                        await pbManager.createRecord('memberItems', data);
                    } else {
                        throw error;
                    }
                }
            } else {
                // Créer
                await pbManager.createRecord('memberItems', data);
            }

            // Marquer cet item comme traité
            processedItemIds.add(itemData.id);
        }

        // Sauvegarder les appétences libres (non liées à des skills)
        if (member.appetences && member.appetences.length > 0) {
            for (const appetenceName of member.appetences) {
                // Vérifier si c'est une appétence libre (pas un skill)
                if (!skills.includes(appetenceName)) {
                    // Trouver ou créer l'item appetence
                    let itemData = itemsData.find(item => item.name === appetenceName && item.type === 'appetence');

                    if (!itemData) {
                        console.log(`📝 Création de l'appétence libre "${appetenceName}"`);
                        itemData = await pbManager.createRecord('items', {
                            matrix: window.currentMatrixId,
                            name: appetenceName,
                            type: 'appetence',
                            category: 'Appétence',
                            active: true
                        });
                        itemsData.push(itemData);
                    }

                    const data = {
                        matrix: window.currentMatrixId,
                        member: memberId,
                        item: itemData.id
                    };

                    // Marquer cet item comme traité AVANT de le sauvegarder
                    // pour éviter qu'il soit supprimé par la logique de nettoyage
                    processedItemIds.add(itemData.id);

                    const existingId = existingMap[itemData.id];

                    if (existingId) {
                        // Mettre à jour (avec gestion d'erreur 404)
                        try {
                            await pbManager.updateRecord('memberItems', existingId, data);
                        } catch (error) {
                            // Si l'item n'existe plus (404), le créer
                            if (error.message.includes('404')) {
                                await pbManager.createRecord('memberItems', data);
                            } else {
                                throw error;
                            }
                        }
                    } else {
                        await pbManager.createRecord('memberItems', data);
                    }
                }
            }
        }

        // Sauvegarder les ownerships (uniquement si explicitement définis)
        if (member.ownerships && member.ownerships.length > 0) {
            for (const ownership of member.ownerships) {
                // Ignorer les ownerships vides ou invalides
                if (!ownership || ownership === '') continue;

                const ownershipName = typeof ownership === 'string' ? ownership.split(' (')[0].trim() : ownership.name;
                const ownershipRole = typeof ownership === 'string' && ownership.includes('(')
                    ? ownership.match(/\(([^)]+)\)/)?.[1] || 'Owner'
                    : (typeof ownership === 'object' ? ownership.role : 'Owner');

                // Trouver ou créer l'item ownership
                let itemData = itemsData.find(item => item.name === ownershipName && item.type === 'ownership');

                if (!itemData) {
                    // Créer l'ownership s'il n'existe pas
                    console.log(`📝 Création de l'ownership "${ownershipName}"`);
                    itemData = await pbManager.createRecord('items', {
                        matrix: window.currentMatrixId,
                        name: ownershipName,
                        type: 'ownership',
                        category: 'Responsabilité',
                        active: true
                    });
                    itemsData.push(itemData);
                }

                const data = {
                    matrix: window.currentMatrixId,
                    member: memberId,
                    item: itemData.id,
                    ownership_role: ownershipRole
                };

                // Marquer cet item comme traité AVANT de le sauvegarder
                // pour éviter qu'il soit supprimé par la logique de nettoyage
                processedItemIds.add(itemData.id);

                const existingId = existingMap[itemData.id];

                if (existingId) {
                    // Mettre à jour (avec gestion d'erreur 404)
                    try {
                        await pbManager.updateRecord('memberItems', existingId, data);
                    } catch (error) {
                        // Si l'item n'existe plus (404), le créer
                        if (error.message.includes('404')) {
                            await pbManager.createRecord('memberItems', data);
                        } else {
                            throw error;
                        }
                    }
                } else {
                    await pbManager.createRecord('memberItems', data);
                }
            }
        }

        // Supprimer les member_items qui ne sont plus utilisés
        // (cette logique est exécutée APRÈS le traitement de tous les items)
        for (const mi of existingItems) {
            // Vérifier que l'item existe toujours dans la base
            if (!processedItemIds.has(mi.item) && mi.expand?.item) {
                try {
                    console.log(`🗑️ Suppression member_item obsolète: ${mi.expand.item.name} (${mi.expand.item.type})`);
                    await pbManager.deleteRecord('memberItems', mi.id);
                } catch (error) {
                    // Ignorer les erreurs 404 (item déjà supprimé)
                    if (!error.message.includes('404')) {
                        console.warn('Erreur suppression member_item:', error);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Erreur sauvegarde items:', error);
    }
}

/**
 * Sauvegarde un seul skill d'un membre (optimisé pour les changements individuels)
 */
async function saveSingleSkillToPocketBase(memberId, skillName, level, appetite = 0) {
    if (!usePocketBase || !pbManager || !window.currentMatrixId) return;

    try {
        // Trouver l'item correspondant au skill
        const itemsData = await pbManager.getRecords('items', {
            filter: `matrix = "${window.currentMatrixId}" && name = "${skillName}" && type = "skill" && active = true`
        });

        if (itemsData.length === 0) {
            console.warn(`⚠️ Skill "${skillName}" non trouvé dans les items`);
            return;
        }

        const itemData = itemsData[0];

        // Chercher si un member_item existe déjà
        const existingItems = await pbManager.getRecords('memberItems', {
            filter: `matrix = "${window.currentMatrixId}" && member = "${memberId}" && item = "${itemData.id}"`
        });

        const data = {
            matrix: window.currentMatrixId,
            member: memberId,
            item: itemData.id,
            level: level,
            appetite: appetite,
            last_assessed: new Date().toISOString().split('T')[0]
        };

        if (existingItems.length > 0) {
            // Mettre à jour
            await pbManager.updateRecord('memberItems', existingItems[0].id, data);
        } else {
            // Créer
            await pbManager.createRecord('memberItems', data);
        }

        console.log(`✅ Skill "${skillName}" sauvegardé (niveau ${level})`);
    } catch (error) {
        console.error('Erreur sauvegarde skill:', error);
    }
}

/**
 * Supprime un membre de PocketBase
 */
async function deleteMemberFromPocketBase(member) {
    if (!usePocketBase || !pbManager || !member.pbId) return;

    try {
        await pbManager.deleteRecord('members', member.pbId);
    } catch (error) {
        console.error('Erreur suppression membre:', error);
    }
}

/**
 * Sauvegarde une compétence dans PocketBase (nouvelle architecture)
 */
async function saveSkillToPocketBase(skillName) {
    if (!usePocketBase || !pbManager || !window.currentMatrixId) return;

    try {
        // Vérifier si l'item existe déjà
        const existingItems = await pbManager.getRecords('items', {
            filter: `matrix = "${window.currentMatrixId}" && name = "${skillName}" && type = "skill"`
        });

        if (existingItems.length === 0) {
            await pbManager.createRecord('items', {
                matrix: window.currentMatrixId,
                name: skillName,
                type: 'skill',
                category: 'Général',
                active: true
            });
        }
    } catch (error) {
        console.error('Erreur sauvegarde compétence:', error);
    }
}

/**
 * Synchronisation automatique avec PocketBase
 */
async function syncWithPocketBase() {
    if (!usePocketBase || !matrixData) return;

    try {
        // Sauvegarder tous les membres
        for (let i = 0; i < matrixData.members.length; i++) {
            await saveMemberToPocketBase(matrixData.members[i], i);
        }

        // Sauvegarder toutes les compétences
        for (const skill of matrixData.skills) {
            await saveSkillToPocketBase(skill);
        }

        console.log('✅ Synchronisation PocketBase réussie');
    } catch (error) {
        console.error('Erreur synchronisation:', error);
    }
}

/**
 * Override de la fonction saveData pour inclure PocketBase
 */
const originalSaveDataPB = window.saveData;
window.saveData = async function (forceFullSync = false) {
    // Sauvegarder dans localStorage (fallback)
    if (originalSaveDataPB) {
        originalSaveDataPB();
    }

    // Si forceFullSync est true (sauvegarde manuelle), synchroniser tout
    if (forceFullSync && usePocketBase) {
        console.log('💾 Synchronisation complète demandée...');
        
        // Afficher le loader et une notification de début
        if (typeof showLoader === 'function') {
            showLoader('💾 Sauvegarde...');
        }
        if (typeof showNotification === 'function') {
            showNotification('🔄 Synchronisation en cours...', 'info');
        }
        
        try {
            await syncWithPocketBase();
            
            // Masquer le loader et afficher notification de succès
            if (typeof hideLoader === 'function') {
                hideLoader();
            }
            if (typeof showNotification === 'function') {
                showNotification('✅ Données sauvegardées avec succès !', 'success');
            }
        } catch (error) {
            console.error('Erreur synchronisation:', error);
            
            // Masquer le loader et afficher notification d'erreur
            if (typeof hideLoader === 'function') {
                hideLoader();
            }
            if (typeof showNotification === 'function') {
                showNotification('❌ Erreur lors de la sauvegarde', 'error');
            }
        }
    }
    
    // Sinon, la sauvegarde PocketBase est gérée par les fonctions spécifiques
    // (addMember, editMemberName, etc.) qui sauvegardent uniquement ce qui a changé
};

/**
 * Synchronise automatiquement après une modification
 */
async function autoSyncAfterChange() {
    if (!usePocketBase) return;

    try {
        await syncWithPocketBase();
        console.log('🔄 Auto-sync effectué');
    } catch (error) {
        console.error('Erreur auto-sync:', error);
    }
}

/**
 * Override de la fonction addMember pour inclure PocketBase
 */
const originalAddMemberPB = window.addMember;
window.addMember = async function () {
    if (originalAddMemberPB) {
        originalAddMemberPB();
    }

    // Sauvegarder le nouveau membre dans PocketBase
    if (usePocketBase && matrixData.members.length > 0) {
        const lastIndex = matrixData.members.length - 1;
        await saveMemberToPocketBase(matrixData.members[lastIndex], lastIndex);
        console.log('✅ Membre ajouté et synchronisé');
    }
};

/**
 * Override de la fonction removeMember pour inclure PocketBase
 */
const originalRemoveMemberPB = window.removeMember;
window.removeMember = async function (index) {
    const member = matrixData.members[index];

    if (originalRemoveMemberPB) {
        originalRemoveMemberPB(index);
    }

    // Supprimer de PocketBase
    if (usePocketBase && member) {
        await deleteMemberFromPocketBase(member);
        console.log('✅ Membre supprimé et synchronisé');
    }
};

/**
 * Override de la fonction addSkill pour inclure PocketBase
 */
const originalAddSkillPB = window.addSkill;
window.addSkill = async function () {
    if (originalAddSkillPB) {
        originalAddSkillPB();
    }

    // Sauvegarder la nouvelle compétence dans PocketBase
    if (usePocketBase && matrixData.skills.length > 0) {
        const lastSkill = matrixData.skills[matrixData.skills.length - 1];
        await saveSkillToPocketBase(lastSkill);
        console.log('✅ Compétence ajoutée et synchronisée');
    }
};

/**
 * Override de la fonction editSkillName pour inclure PocketBase
 */
const originalEditSkillNamePB = window.editSkillName;
window.editSkillName = async function (index) {
    if (originalEditSkillNamePB) {
        originalEditSkillNamePB(index);
    }

    // Synchroniser après modification
    if (usePocketBase) {
        await autoSyncAfterChange();
    }
};

/**
 * Override de la fonction editMemberName pour inclure PocketBase
 */
const originalEditMemberNamePB = window.editMemberName;
window.editMemberName = async function (index) {
    if (originalEditMemberNamePB) {
        originalEditMemberNamePB(index);
    }

    // Synchroniser après modification
    if (usePocketBase && matrixData.members[index]) {
        await saveMemberToPocketBase(matrixData.members[index], index);
        console.log('✅ Membre modifié et synchronisé');
    }
};

/**
 * Override de la fonction deleteMember pour inclure PocketBase
 */
const originalDeleteMemberPB = window.deleteMember;
window.deleteMember = async function (index) {
    const member = matrixData.members[index];

    if (originalDeleteMemberPB) {
        originalDeleteMemberPB(index);
    }

    // Supprimer de PocketBase
    if (usePocketBase && member) {
        await deleteMemberFromPocketBase(member);
        console.log('✅ Membre supprimé et synchronisé');
    }
};

/**
 * Charge les templates depuis PocketBase
 */
async function loadTemplatesFromPocketBase() {
    if (!usePocketBase || !pbManager) return [];

    try {
        const templates = await pbManager.getRecords('templates', {
            filter: 'active = true',
            sort: 'category,name'
        });

        console.log(`📚 ${templates.length} templates chargés depuis PocketBase`);
        return templates;
    } catch (error) {
        console.error('Erreur chargement templates:', error);
        return [];
    }
}

/**
 * Applique un template depuis PocketBase
 */
async function applyTemplateFromPocketBase(templateId) {
    if (!usePocketBase || !pbManager) return;

    try {
        const template = await pbManager.getRecord('templates', templateId);

        if (!template || !template.data) {
            throw new Error('Template invalide');
        }

        // Créer une nouvelle matrice depuis le template
        const matrix = await pbManager.createRecord('matrices', {
            name: template.name,
            company: '',
            description: `Créé depuis le template: ${template.name}`,
            active: true
        });

        window.currentMatrixId = matrix.id;

        // Créer les items (skills + ownerships)
        const itemsMap = {};

        for (const skill of template.data.skills) {
            const item = await pbManager.createRecord('items', {
                matrix: matrix.id,
                name: skill.name,
                type: 'skill',
                category: skill.category || 'Général',
                active: true
            });
            itemsMap[skill.name] = item.id;
        }

        for (const ownership of template.data.ownerships) {
            const item = await pbManager.createRecord('items', {
                matrix: matrix.id,
                name: ownership.name,
                type: 'ownership',
                category: ownership.category || 'Responsabilité',
                active: true
            });
            itemsMap[ownership.name] = item.id;
        }

        // Créer les membres et leurs associations
        for (const memberData of template.data.members) {
            const member = await pbManager.createRecord('members', {
                matrix: matrix.id,
                name: memberData.name,
                role: memberData.role || '',
                active: true
            });

            // Créer les associations skills
            for (const [skillName, values] of Object.entries(memberData.skills || {})) {
                if (itemsMap[skillName]) {
                    await pbManager.createRecord('memberItems', {
                        matrix: matrix.id,
                        member: member.id,
                        item: itemsMap[skillName],
                        level: values.level || 0,
                        appetite: values.appetite || 0
                    });
                }
            }

            // Créer les associations ownerships
            for (const [ownershipName, role] of Object.entries(memberData.ownerships || {})) {
                if (itemsMap[ownershipName]) {
                    await pbManager.createRecord('memberItems', {
                        matrix: matrix.id,
                        member: member.id,
                        item: itemsMap[ownershipName],
                        ownership_role: role
                    });
                }
            }
        }

        console.log(`✅ Template "${template.name}" appliqué avec succès`);

        // Recharger les données
        await loadFromPocketBase();

    } catch (error) {
        console.error('Erreur application template:', error);
        throw error;
    }
}

/**
 * Override de la fonction addAppetence pour inclure PocketBase
 */
const originalAddAppetencePB = window.addAppetence;
window.addAppetence = async function (memberIndex) {
    if (originalAddAppetencePB) {
        originalAddAppetencePB(memberIndex);
    }

    // Synchroniser après modification
    if (usePocketBase && matrixData.members[memberIndex]) {
        await saveMemberToPocketBase(matrixData.members[memberIndex], memberIndex);
        console.log('✅ Appétence ajoutée et synchronisée');
    }
};

/**
 * Override de la fonction removeAppetence pour inclure PocketBase
 */
const originalRemoveAppetencePB = window.removeAppetence;
window.removeAppetence = async function (memberIndex, appetenceIndex) {
    if (originalRemoveAppetencePB) {
        originalRemoveAppetencePB(memberIndex, appetenceIndex);
    }

    // Synchroniser après modification
    if (usePocketBase && matrixData.members[memberIndex]) {
        await saveMemberToPocketBase(matrixData.members[memberIndex], memberIndex);
        console.log('✅ Appétence supprimée et synchronisée');
    }
};

/**
 * Override de la fonction addOwnership pour inclure PocketBase
 */
const originalAddOwnershipPB = window.addOwnership;
window.addOwnership = async function (memberIndex) {
    if (originalAddOwnershipPB) {
        originalAddOwnershipPB(memberIndex);
    }

    // Synchroniser après modification
    if (usePocketBase && matrixData.members[memberIndex]) {
        await saveMemberToPocketBase(matrixData.members[memberIndex], memberIndex);
        console.log('✅ Ownership ajouté et synchronisé');
    }
};

/**
 * Override de la fonction removeOwnership pour inclure PocketBase
 */
const originalRemoveOwnershipPB = window.removeOwnership;
window.removeOwnership = async function (memberIndex, ownershipIndex) {
    if (originalRemoveOwnershipPB) {
        originalRemoveOwnershipPB(memberIndex, ownershipIndex);
    }

    // Synchroniser après modification
    if (usePocketBase && matrixData.members[memberIndex]) {
        await saveMemberToPocketBase(matrixData.members[memberIndex], memberIndex);
        console.log('✅ Ownership supprimé et synchronisé');
    }
};

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initPocketBase();

    // Synchronisation automatique toutes les 5 minutes
    setInterval(() => {
        if (usePocketBase) {
            syncWithPocketBase();
        }
    }, 5 * 60 * 1000);
});


/**
 * Modifier le nom de la matrice
 */
async function editMatrixName() {
    if (!usePocketBase || !window.currentMatrixId) {
        alert('⚠️ Fonctionnalité indisponible en mode Démo');
        return;
    }

    const currentName = document.getElementById('matrixName').textContent;
    const newName = prompt('Nouveau nom de la matrice :', currentName);

    if (newName && newName.trim() !== '' && newName !== currentName) {
        try {
            await pbManager.updateRecord('matrices', window.currentMatrixId, {
                name: newName.trim()
            });

            document.getElementById('matrixName').textContent = newName.trim();
            showNotification('✅ Nom de la matrice mis à jour', 'success');
        } catch (error) {
            console.error('Erreur mise à jour nom:', error);
            showNotification('❌ Erreur lors de la mise à jour', 'error');
        }
    }
}

// Rendre la fonction globale
window.editMatrixName = editMatrixName;


/**
 * Créer une nouvelle matrice
 */
async function createNewMatrix() {
    // Initialiser PocketBase si pas encore fait
    if (!pbManager) {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        const connected = await pbManager.testConnection();
        
        if (!connected) {
            alert('⚠️ Impossible de se connecter à PocketBase');
            return;
        }
    }

    const matrixName = prompt('Nom de la nouvelle matrice :', 'Ma Matrice ' + new Date().toLocaleDateString('fr-FR'));

    if (!matrixName || matrixName.trim() === '') {
        return;
    }

    const confirmed = confirm(`Créer une nouvelle matrice "${matrixName}" ?\n\nCela va créer une matrice vide et vous y rediriger.`);

    if (!confirmed) {
        return;
    }

    try {
        showNotification('🔄 Création de la matrice...', 'info');

        const newMatrix = await pbManager.createRecord('matrices', {
            name: matrixName.trim(),
            company: '',
            description: '',
            active: true
        });

        showNotification('✅ Matrice créée avec succès !', 'success');

        // Rediriger vers la nouvelle matrice
        setTimeout(() => {
            window.location.href = `${window.location.pathname}?matrix=${newMatrix.id}`;
        }, 500);

    } catch (error) {
        console.error('Erreur création matrice:', error);
        showNotification('❌ Erreur lors de la création', 'error');
    }
}

// Rendre la fonction globale
window.createNewMatrix = createNewMatrix;

/**
 * Charger une matrice existante
 */
async function loadExistingMatrix() {
    // Initialiser PocketBase si pas encore fait
    if (!pbManager) {
        pbManager = new PocketBaseManager(PB_CONFIG.baseUrl, PB_CONFIG.collections);
        const connected = await pbManager.testConnection();
        
        if (!connected) {
            alert('⚠️ Impossible de se connecter à PocketBase');
            return;
        }
    }

    try {
        showNotification('🔄 Chargement des matrices...', 'info');

        // Récupérer toutes les matrices actives
        const matrices = await pbManager.getRecords('matrices', {
            filter: 'active = true',
            sort: '-updated',
            perPage: 50
        });

        if (matrices.length === 0) {
            showNotification('⚠️ Aucune matrice trouvée', 'warning');
            
            const createNew = confirm('Aucune matrice existante. Voulez-vous en créer une nouvelle ?');
            if (createNew) {
                createNewMatrix();
            }
            return;
        }

        // Créer une liste de sélection
        let message = 'Sélectionnez une matrice :\n\n';
        matrices.forEach((matrix, index) => {
            const date = new Date(matrix.updated).toLocaleDateString('fr-FR');
            message += `${index + 1}. ${matrix.name} (${date})\n`;
        });
        message += '\nEntrez le numéro de la matrice :';

        const choice = prompt(message);
        
        if (!choice) return;

        const index = parseInt(choice) - 1;
        
        if (index < 0 || index >= matrices.length) {
            showNotification('❌ Choix invalide', 'error');
            return;
        }

        const selectedMatrix = matrices[index];
        
        showNotification('✅ Matrice sélectionnée !', 'success');

        // Rediriger vers la matrice sélectionnée
        setTimeout(() => {
            window.location.href = `${window.location.pathname}?matrix=${selectedMatrix.id}`;
        }, 500);

    } catch (error) {
        console.error('Erreur chargement matrices:', error);
        showNotification('❌ Erreur lors du chargement', 'error');
    }
}

// Rendre la fonction globale
window.loadExistingMatrix = loadExistingMatrix;
