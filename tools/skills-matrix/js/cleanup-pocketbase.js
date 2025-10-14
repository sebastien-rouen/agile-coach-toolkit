/**
 * Script de nettoyage PocketBase
 * À exécuter depuis la console du navigateur
 */

async function cleanupPocketBase() {
    if (!window.pbManager || !window.currentMatrixId) {
        console.error('❌ PocketBase non initialisé ou pas de matrice active');
        return;
    }
    
    const matrixId = window.currentMatrixId;
    console.log(`🧹 Nettoyage de la matrice: ${matrixId}`);
    
    try {
        // 1. Récupérer tous les membres de cette matrice
        const members = await pbManager.getRecords('members', {
            filter: `matrix = "${matrixId}"`
        });
        
        console.log(`📊 ${members.length} membres trouvés`);
        
        // 2. Détecter les doublons (même nom)
        const membersByName = {};
        const duplicates = [];
        
        members.forEach(member => {
            if (membersByName[member.name]) {
                duplicates.push(member);
            } else {
                membersByName[member.name] = member;
            }
        });
        
        console.log(`🔍 ${duplicates.length} doublons détectés`);
        
        // 3. Supprimer les doublons
        for (const duplicate of duplicates) {
            console.log(`🗑️ Suppression du doublon: ${duplicate.name} (${duplicate.id})`);
            
            // Supprimer les member_items associés
            const memberItems = await pbManager.getRecords('memberItems', {
                filter: `member = "${duplicate.id}"`
            });
            
            for (const mi of memberItems) {
                await pbManager.deleteRecord('memberItems', mi.id);
            }
            
            // Supprimer le membre
            await pbManager.deleteRecord('members', duplicate.id);
        }
        
        console.log('✅ Nettoyage terminé !');
        console.log(`📊 ${Object.keys(membersByName).length} membres uniques conservés`);
        
        // Recharger les données
        if (typeof loadFromPocketBase === 'function') {
            await loadFromPocketBase();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    }
}

// Rendre la fonction globale
window.cleanupPocketBase = cleanupPocketBase;

console.log('🧹 Script de nettoyage chargé. Exécutez cleanupPocketBase() pour nettoyer les doublons.');
