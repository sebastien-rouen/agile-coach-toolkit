/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_team
 * 
 * Cette collection stocke les membres de l'équipe avec leurs compétences
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_team",
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
        min: 1,
        max: 100
      },
      {
        name: "role",
        type: "text",
        required: true,
        presentable: false,
        min: 1,
        max: 100
      },
      {
        name: "skills",
        type: "json",
        required: false,
        presentable: false
      },
      {
        name: "capacity",
        type: "number",
        required: false,
        presentable: false,
        min: 0,
        max: 100
      },
      {
        name: "active",
        type: "bool",
        required: false,
        presentable: false
      },
      {
        name: "start_date",
        type: "date",
        required: false,
        presentable: false
      },
      {
        name: "end_date",
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
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_team");
  return app.delete(collection);
});
