/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection tools_velocity_squad_sprints
 * 
 * Cette collection stocke les sprints avec leurs métriques et objectifs
 * pour l'outil Team Velocity Dashboard
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_sprints",
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
        type: "text",
        required: true,
        presentable: false
      },
      {
        name: "name",
        type: "text",
        required: true,
        presentable: true
      },
      {
        name: "velocity",
        type: "number",
        required: true,
        presentable: false
      },
      {
        name: "startDate",
        type: "date",
        required: false,
        presentable: false
      },
      {
        name: "endDate",
        type: "date",
        required: true,
        presentable: false
      },
      {
        name: "duration",
        type: "number",
        required: false,
        presentable: false
      },
      {
        name: "goal",
        type: "text",
        required: false,
        presentable: false
      },
      {
        name: "bugCount",
        type: "number",
        required: false,
        presentable: false
      },
      {
        name: "teamSize",
        type: "number",
        required: false,
        presentable: false
      },
      {
        name: "source",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "manual",
          "jira",
          "csv",
          "template"
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
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {}
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_sprints");
  return app.delete(collection);
});
