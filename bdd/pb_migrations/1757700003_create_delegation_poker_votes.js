/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection tools_delegation_poker_votes
 * Stocke les votes des participants
 */
migrate((app) => {
  // Récupérer les collections pour obtenir leurs IDs
  const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
  const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
  
  const collection = new Collection({
    name: "tools_delegation_poker_votes",
    type: "base",
    system: false,
    fields: [
      {
        name: "id",
        type: "text",
        required: true,
        presentable: false,
        primaryKey: true,
        autogeneratePattern: "[a-z0-9]{15}",
        hidden: false
      },
      {
        name: "session_id",
        type: "relation",
        required: true,
        presentable: false,
        cascadeDelete: true,
        collectionId: sessionsCollection.id,
        maxSelect: 1
      },
      {
        name: "decision_id",
        type: "relation",
        required: true,
        presentable: false,
        cascadeDelete: true,
        collectionId: decisionsCollection.id,
        maxSelect: 1
      },
      {
        name: "participant_name",
        type: "text",
        required: true,
        presentable: false,
        min: 1,
        max: 100
      },
      {
        name: "delegation_level",
        type: "number",
        required: true,
        presentable: true,
        min: 1,
        max: 7
      },
      {
        name: "comment",
        type: "text",
        required: false,
        presentable: false,
        max: 500
      },
      {
        name: "voted_at",
        type: "date",
        required: false,
        presentable: false
      },
      {
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
        presentable: false
      },
      {
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
        presentable: false
      }
    ],
    indexes: [
      "CREATE INDEX idx_votes_decision ON tools_delegation_poker_votes (decision_id)",
      "CREATE UNIQUE INDEX idx_votes_unique ON tools_delegation_poker_votes (decision_id, participant_name)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_delegation_poker_votes");
  return app.delete(collection);
});
