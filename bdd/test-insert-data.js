// Script de test pour insérer des données directement via l'API PocketBase
// Exécuter avec: node bdd/test-insert-data.js

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://localhost:8090');

async function insertTestData() {
    try {
        console.log('🔄 Connexion à PocketBase...');
        
        // 1. Créer une matrice
        console.log('📝 Création de la matrice...');
        const matrix = await pb.collection('tools_skills_matrix_matrices').create({
            name: 'Compétences Équipe Dev 2025',
            company: 'BastaVerse',
            description: 'Matrice de compétences de l\'équipe de développement',
            active: true
        });
        console.log('✅ Matrice créée:', matrix.id);

        // 2. Créer des membres
        console.log('📝 Création des membres...');
        const members = [];
        const memberNames = [
            { name: 'Alice Martin', role: 'Développeuse Senior' },
            { name: 'Bob Dupont', role: 'Tech Lead' },
            { name: 'Claire Bernard', role: 'Développeuse Full-Stack' }
        ];

        for (const memberData of memberNames) {
            const member = await pb.collection('tools_skills_matrix_members').create({
                matrix: matrix.id,
                name: memberData.name,
                role: memberData.role,
                active: true
            });
            members.push(member);
            console.log(`✅ Membre créé: ${member.name}`);
        }

        // 3. Créer des items
        console.log('📝 Création des items...');
        const items = [];
        const itemNames = [
            { name: 'JavaScript', category: 'Frontend', type: 'skill' },
            { name: 'React', category: 'Frontend', type: 'skill' },
            { name: 'Node.js', category: 'Backend', type: 'skill' }
        ];

        for (const itemData of itemNames) {
            const item = await pb.collection('tools_skills_matrix_items').create({
                matrix: matrix.id,
                name: itemData.name,
                category: itemData.category,
                type: itemData.type,
                active: true
            });
            items.push(item);
            console.log(`✅ Item créé: ${item.name}`);
        }

        // 4. Créer des évaluations
        console.log('📝 Création des évaluations...');
        for (const member of members) {
            for (const item of items) {
                await pb.collection('tools_skills_matrix_member_items').create({
                    matrix: matrix.id,
                    member: member.id,
                    item: item.id,
                    level: Math.floor(Math.random() * 5),
                    appetite: Math.floor(Math.random() * 5)
                });
            }
        }
        console.log(`✅ ${members.length * items.length} évaluations créées`);

        console.log('\n✅ Toutes les données ont été insérées avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        if (error.response) {
            console.error('Détails:', error.response);
        }
    }
}

insertTestData();
