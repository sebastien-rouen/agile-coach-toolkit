/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_annotations
 * 
 * Cette collection stocke les faits marquants (annotations) sur les sprints
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_annotations",
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
        name: "sprint",
        type: "text",
        required: true,
        presentable: false,
        min: 1,
        max: 50
      },
      {
        name: "type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "team",
          "vacation",
          "incident",
          "process",
          "release",
          "training"
        ]
      },
      {
        name: "text",
        type: "text",
        required: true,
        presentable: true,
        min: 1,
        max: 500
      },
      {
        name: "active",
        type: "bool",
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
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_annotations");
  return app.delete(collection);
});
