/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection tools_delegation_poker_consensus
 * Stocke les consensus finaux par décision
 */
migrate((app) => {
  // Récupérer les collections pour obtenir leurs IDs
  const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
  const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
  
  const collection = new Collection({
    name: "tools_delegation_poker_consensus",
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
        name: "final_level",
        type: "number",
        required: true,
        presentable: true,
        min: 1,
        max: 7
      },
      {
        name: "notes",
        type: "text",
        required: false,
        presentable: false,
        max: 1000
      },
      {
        name: "agreed_at",
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
      "CREATE INDEX idx_consensus_decision ON tools_delegation_poker_consensus (decision_id)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_delegation_poker_consensus");
  return app.delete(collection);
});
