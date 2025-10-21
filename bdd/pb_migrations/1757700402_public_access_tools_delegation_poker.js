/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Accès public pour Delegation Poker
 * Permet l'utilisation sans authentification
 */
migrate((app) => {
    // Sessions
    const sessions = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    if (sessions) {
        sessions.listRule = "";
        sessions.viewRule = "";
        sessions.createRule = "";
        sessions.updateRule = "";
        sessions.deleteRule = "";
        app.save(sessions);
        console.log('✅ Accès public activé pour tools_delegation_poker_sessions');
    }

    // Decisions
    const decisions = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
    if (decisions) {
        decisions.listRule = "";
        decisions.viewRule = "";
        decisions.createRule = "";
        decisions.updateRule = "";
        decisions.deleteRule = "";
        app.save(decisions);
        console.log('✅ Accès public activé pour tools_delegation_poker_decisions');
    }

    // Votes
    const votes = app.findCollectionByNameOrId("tools_delegation_poker_votes");
    if (votes) {
        votes.listRule = "";
        votes.viewRule = "";
        votes.createRule = "";
        votes.updateRule = "";
        votes.deleteRule = "";
        app.save(votes);
        console.log('✅ Accès public activé pour tools_delegation_poker_votes');
    }

    // Consensus
    const consensus = app.findCollectionByNameOrId("tools_delegation_poker_consensus");
    if (consensus) {
        consensus.listRule = "";
        consensus.viewRule = "";
        consensus.createRule = "";
        consensus.updateRule = "";
        consensus.deleteRule = "";
        app.save(consensus);
        console.log('✅ Accès public activé pour tools_delegation_poker_consensus');
    }

    return null;
}, (app) => {
    // Rollback : Remettre les règles d'authentification
    const sessions = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    if (sessions) {
        sessions.listRule = "@request.auth.id != ''";
        sessions.viewRule = "@request.auth.id != ''";
        sessions.createRule = "@request.auth.id != ''";
        sessions.updateRule = "@request.auth.id != ''";
        sessions.deleteRule = "@request.auth.id != ''";
        app.save(sessions);
    }

    const decisions = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
    if (decisions) {
        decisions.listRule = "@request.auth.id != ''";
        decisions.viewRule = "@request.auth.id != ''";
        decisions.createRule = "@request.auth.id != ''";
        decisions.updateRule = "@request.auth.id != ''";
        decisions.deleteRule = "@request.auth.id != ''";
        app.save(decisions);
    }

    const votes = app.findCollectionByNameOrId("tools_delegation_poker_votes");
    if (votes) {
        votes.listRule = "@request.auth.id != ''";
        votes.viewRule = "@request.auth.id != ''";
        votes.createRule = "@request.auth.id != ''";
        votes.updateRule = "@request.auth.id != ''";
        votes.deleteRule = "@request.auth.id != ''";
        app.save(votes);
    }

    const consensus = app.findCollectionByNameOrId("tools_delegation_poker_consensus");
    if (consensus) {
        consensus.listRule = "@request.auth.id != ''";
        consensus.viewRule = "@request.auth.id != ''";
        consensus.createRule = "@request.auth.id != ''";
        consensus.updateRule = "@request.auth.id != ''";
        consensus.deleteRule = "@request.auth.id != ''";
        app.save(consensus);
    }

    return null;
});
