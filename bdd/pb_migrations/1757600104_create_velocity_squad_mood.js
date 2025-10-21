/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_mood
 * 
 * Cette collection stocke le suivi de l'humeur de l'équipe
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_mood",
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
        name: "session",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: app.findCollectionByNameOrId("tools_velocity_squad_sessions").id,
        cascadeDelete: true,
        maxSelect: 1,
        displayFields: ["name"]
      },
      {
        name: "date",
        type: "date",
        required: true,
        presentable: true
      },
      {
        name: "score",
        type: "number",
        required: true,
        presentable: false,
        min: 1,
        max: 3
      },
      {
        name: "comment",
        type: "text",
        required: false,
        presentable: false,
        max: 500
      },
      {
        name: "member",
        type: "text",
        required: false,
        presentable: false,
        max: 100
      },
      {
        name: "memberName",
        type: "text",
        required: false,
        presentable: true,
        max: 100
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
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_mood");
  return app.delete(collection);
});
