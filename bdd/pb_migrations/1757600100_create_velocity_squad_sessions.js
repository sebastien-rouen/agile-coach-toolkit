/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_sessions
 * 
 * Cette collection stocke les sessions d'équipe pour le Velocity Squad Dashboard
 * Chaque session représente une équipe avec ses paramètres
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_sessions",
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
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        min: 1,
        max: 255
      },
      {
        name: "framework",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "scrum",
          "kanban"
        ]
      },
      {
        name: "sprint_length",
        type: "number",
        required: false,
        presentable: false,
        min: 1,
        max: 30
      },
      {
        name: "working_days",
        type: "number",
        required: false,
        presentable: false,
        min: 1,
        max: 30
      },
      {
        name: "active",
        type: "bool",
        required: false,
        presentable: false,
        default: true
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
      "CREATE INDEX idx_sessions_active ON tools_velocity_squad_sessions (active)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_sessions");
  return app.delete(collection);
});
