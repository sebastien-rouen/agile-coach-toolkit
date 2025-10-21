/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed des votes pour Delegation Poker
 * Crée des votes exemples pour la session "Service Urgences"
 */
migrate((app) => {
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
    const votesCollection = app.findCollectionByNameOrId("tools_delegation_poker_votes");
    
    // Récupérer la session médicale (completed)
    const sessionMedical = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Service Urgences - Protocoles de Soins'");
    
    if (sessionMedical) {
        // Récupérer les décisions de cette session
        const decisions = app.findRecordsByFilter(
            decisionsCollection.id,
            "session_id = '" + sessionMedical.id + "'",
            "order",
            10
        );
        
        const participants = ["Dr. Dubois (Chef)", "Infirmière Claire", "Dr. Martin (Interne)", "Aide-soignant Paul"];
        
        // Créer des votes pour chaque décision
        decisions.forEach((decision, index) => {
            // Votes variés selon le type de décision
            const voteLevels = [
                [2, 4, 3, 5],  // Prescription hors AMM
                [4, 4, 5, 6],  // Triage patients
                [3, 5, 4, 6],  // Examens urgents
                [3, 4, 4, 5],  // Transfert service
                [5, 6, 6, 7],  // Gestion stocks
                [4, 5, 5, 6],  // Gardes et astreintes
                [2, 3, 2, 4]   // Réanimation urgence
            ];
            
            const levels = voteLevels[index] || [4, 4, 5, 5];
            
            participants.forEach((participant, pIndex) => {
                const record = new Record(votesCollection);
                record.set("session_id", sessionMedical.id);
                record.set("decision_id", decision.id);
                record.set("participant_name", participant);
                record.set("delegation_level", levels[pIndex]);
                app.save(record);
            });
        });
    }
    
    return null;
}, (app) => {
    // Rollback : Supprimer tous les votes de la session médicale
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const sessionMedical = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Service Urgences - Protocoles de Soins'");
    
    if (sessionMedical) {
        const votes = app.findRecordsByFilter(
            "tools_delegation_poker_votes",
            "session_id = '" + sessionMedical.id + "'",
            "-created",
            1000
        );
        
        votes.forEach(vote => {
            app.delete(vote);
        });
    }
    
    return null;
});
