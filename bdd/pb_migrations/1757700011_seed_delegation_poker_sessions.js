/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed des sessions pour Delegation Poker
 * Crée 5 sessions exemples
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    
    const sessions = [
        {
            session_name: "Équipe Produit - Sprint Planning",
            participants: ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"],
            status: "active"
        },
        {
            session_name: "Service RH - Processus de Recrutement",
            participants: ["Marie (DRH)", "Thomas (Manager)", "Sophie (Recruteur)", "Luc (Opérationnel)"],
            status: "active"
        },
        {
            session_name: "Service Urgences - Protocoles de Soins",
            participants: ["Dr. Dubois (Chef)", "Infirmière Claire", "Dr. Martin (Interne)", "Aide-soignant Paul"],
            status: "completed"
        },
        {
            session_name: "Unité Tactique - Préparation Mission",
            participants: ["Capitaine Moreau", "Lieutenant Durand", "Sergent-Chef Petit", "Caporal Bernard"],
            status: "active"
        },
        {
            session_name: "Permis de Conduire Numérique - MVP",
            participants: ["Emma (Chef Projet)", "Lucas (Dev Backend)", "Chloé (UX Designer)", "Antoine (Sécurité)"],
            status: "active"
        }
    ];
    
    sessions.forEach(sessionData => {
        const record = new Record(collection);
        record.set("session_name", sessionData.session_name);
        record.set("participants", sessionData.participants);
        record.set("status", sessionData.status);
        app.save(record);
    });
    
    return null;
}, (app) => {
    // Rollback : Supprimer toutes les sessions seed
    const sessionNames = [
        "Équipe Produit - Sprint Planning",
        "Service RH - Processus de Recrutement",
        "Service Urgences - Protocoles de Soins",
        "Unité Tactique - Préparation Mission",
        "Permis de Conduire Numérique - MVP"
    ];
    
    sessionNames.forEach(name => {
        const records = app.findRecordsByFilter(
            "tools_delegation_poker_sessions",
            "session_name = '" + name + "'",
            "-created",
            1
        );
        
        if (records.length > 0) {
            app.delete(records[0]);
        }
    });
    
    return null;
});
