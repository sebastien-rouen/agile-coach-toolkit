/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection tools_delegation_poker_sessions
 * Stocke les sessions de Delegation Poker
 */
migrate((app) => {
  const collection = new Collection({
    name: "tools_delegation_poker_sessions",
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
        name: "session_name",
        type: "text",
        required: true,
        presentable: true,
        min: 3,
        max: 200
      },
      {
        name: "participants",
        type: "json",
        required: true,
        presentable: false
      },
      {
        name: "status",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "active",
          "completed",
          "archived"
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
    indexes: [],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
  return app.delete(collection);
});
