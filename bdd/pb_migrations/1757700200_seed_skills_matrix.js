/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // 1. Créer une matrice
    const matricesCollection = app.findCollectionByNameOrId("tools_skills_matrix_matrices");
    const matrix = new Record(matricesCollection);
    matrix.set("name", "Compétences Équipe Dev 2025");
    matrix.set("company", "BastaVerse");
    matrix.set("description", "Matrice de compétences de l'équipe de développement");
    matrix.set("active", true);
    app.save(matrix);
    const matrixId = matrix.id;

    // 2. Créer des membres
    const membersCollection = app.findCollectionByNameOrId("tools_skills_matrix_members");
    const members = [
        { name: "Alice Martin", role: "Développeuse Senior" },
        { name: "Bob Dupont", role: "Tech Lead" },
        { name: "Claire Bernard", role: "Développeuse Full-Stack" },
        { name: "David Rousseau", role: "DevOps Engineer" },
        { name: "Emma Lefebvre", role: "Développeuse Frontend" }
    ];

    const memberIds = [];
    members.forEach(memberData => {
        const record = new Record(membersCollection);
        record.set("matrix", matrixId);
        record.set("name", memberData.name);
        record.set("role", memberData.role);
        record.set("active", true);
        app.save(record);
        memberIds.push(record.id);
    });

    // 3. Créer des items (compétences)
    const itemsCollection = app.findCollectionByNameOrId("tools_skills_matrix_items");
    const items = [
        { name: "JavaScript", category: "Frontend", type: "skill" },
        { name: "React", category: "Frontend", type: "skill" },
        { name: "Vue.js", category: "Frontend", type: "skill" },
        { name: "Node.js", category: "Backend", type: "skill" },
        { name: "Express", category: "Backend", type: "skill" },
        { name: "PostgreSQL", category: "Database", type: "skill" },
        { name: "MongoDB", category: "Database", type: "skill" },
        { name: "Docker", category: "DevOps", type: "skill" },
        { name: "Kubernetes", category: "DevOps", type: "skill" },
        { name: "Git", category: "Tools", type: "skill" }
    ];

    const itemIds = [];
    items.forEach(itemData => {
        const record = new Record(itemsCollection);
        record.set("matrix", matrixId);
        record.set("name", itemData.name);
        record.set("category", itemData.category);
        record.set("type", itemData.type);
        record.set("active", true);
        app.save(record);
        itemIds.push(record.id);
    });

    // 4. Créer les évaluations (member_items)
    const memberItemsCollection = app.findCollectionByNameOrId("tools_skills_matrix_member_items");

    memberIds.forEach(memberId => {
        itemIds.forEach(itemId => {
            const record = new Record(memberItemsCollection);
            record.set("matrix", matrixId);
            record.set("member", memberId);
            record.set("item", itemId);
            record.set("level", Math.floor(Math.random() * 5)); // 0-4
            record.set("appetite", Math.floor(Math.random() * 5)); // 0-4
            app.save(record);
        });
    });

    console.log("✅ Seed Skills Matrix: 1 matrice, 5 membres, 10 compétences, 50 évaluations créés");
    return null;

}, (app) => {
    // Supprimer dans l'ordre inverse
    try {
        const memberItems = app.findRecordsByFilter("tools_skills_matrix_member_items", "", "-created", 500);
        memberItems.forEach(record => app.delete(record));

        const items = app.findRecordsByFilter("tools_skills_matrix_items", "", "-created", 100);
        items.forEach(record => app.delete(record));

        const members = app.findRecordsByFilter("tools_skills_matrix_members", "", "-created", 100);
        members.forEach(record => app.delete(record));

        const matrices = app.findRecordsByFilter("tools_skills_matrix_matrices", "", "-created", 100);
        matrices.forEach(record => app.delete(record));

        console.log("✅ Rollback Skills Matrix: données supprimées");
    } catch (e) {
        console.log("⚠️ Rollback partiel:", e.message);
    }

    return null;
});
