/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed des consensus pour Delegation Poker
 * Crée des consensus pour la session "Service Urgences"
 */
migrate((app) => {
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
    const consensusCollection = app.findCollectionByNameOrId("tools_delegation_poker_consensus");

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

        // Consensus pour chaque décision
        const consensusData = [
            { level: 3, notes: "Le chef de service garde la décision finale mais consulte l'équipe" },
            { level: 4, notes: "Décision collective basée sur les protocoles établis" },
            { level: 4, notes: "Accord sur une décision partagée selon l'urgence" },
            { level: 4, notes: "Décision prise ensemble selon les capacités des services" },
            { level: 6, notes: "L'équipe gère de manière autonome avec reporting" },
            { level: 5, notes: "Le chef conseille mais l'équipe décide de l'organisation" },
            { level: 2, notes: "Protocole strict, le chef décide et explique les raisons" }
        ];

        decisions.forEach((decision, index) => {
            if (consensusData[index]) {
                const record = new Record(consensusCollection);
                record.set("session_id", sessionMedical.id);
                record.set("decision_id", decision.id);
                record.set("final_level", consensusData[index].level);
                record.set("notes", consensusData[index].notes);
                app.save(record);
            }
        });
    }

    return null;
}, (app) => {
    // Rollback : Supprimer tous les consensus de la session médicale
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const sessionMedical = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Service Urgences - Protocoles de Soins'");

    if (sessionMedical) {
        const consensus = app.findRecordsByFilter(
            "tools_delegation_poker_consensus",
            "session_id = '" + sessionMedical.id + "'",
            "-created",
            1000
        );

        consensus.forEach(cons => {
            app.delete(cons);
        });
    }

    return null;
});
