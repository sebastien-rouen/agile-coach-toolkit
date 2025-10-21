/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection tools_delegation_poker_decisions
 * Stocke les décisions à clarifier
 */
migrate((app) => {
  // Récupérer la collection sessions pour obtenir son ID
  const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
  
  const collection = new Collection({
    name: "tools_delegation_poker_decisions",
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
        name: "decision_text",
        type: "text",
        required: true,
        presentable: true,
        min: 3,
        max: 200
      },
      {
        name: "category",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "technical",
          "organizational",
          "product",
          "team",
          "other"
        ]
      },
      {
        name: "order",
        type: "number",
        required: false,
        presentable: false,
        min: 0
      },
      {
        name: "status",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "pending",
          "voting",
          "completed"
        ]
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
      "CREATE INDEX idx_decisions_session ON tools_delegation_poker_decisions (session_id)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
  return app.delete(collection);
});
