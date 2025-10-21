/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_pi
 * 
 * Cette collection stocke les Program Increments (PI) SAFe
 * Un PI peut contenir 0 à n sprints d'une équipe
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_pi",
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
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        max: 100
      },
      {
        name: "startDate",
        type: "date",
        required: true,
        presentable: false
      },
      {
        name: "endDate",
        type: "date",
        required: true,
        presentable: false
      },
      {
        name: "location",
        type: "text",
        required: false,
        presentable: false,
        max: 200
      },
      {
        name: "comment",
        type: "text",
        required: false,
        presentable: false,
        max: 1000
      },
      {
        name: "objective",
        type: "text",
        required: false,
        presentable: false,
        max: 2000
      },
      {
        name: "status",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "planning",
          "active",
          "completed"
        ]
      },
      {
        name: "risks",
        type: "json",
        required: false,
        presentable: false
      },
      {
        name: "dependencies",
        type: "json",
        required: false,
        presentable: false
      },
      {
        name: "confidence_vote",
        type: "number",
        required: false,
        presentable: false,
        min: 1,
        max: 5
      },
      {
        name: "sprints",
        type: "json",
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
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_pi");
  return app.delete(collection);
});
