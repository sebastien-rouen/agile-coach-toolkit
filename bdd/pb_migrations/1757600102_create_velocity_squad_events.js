/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Création de la collection velocity_squad_events
 * 
 * Cette collection stocke les événements de planning (daily, retrospective, etc.)
 * pour l'outil Team Velocity Dashboard
 * 
 * Champs de récurrence :
 * - recurring: booléen pour activer/désactiver la récurrence
 * - recurrence_type: type de récurrence (none, daily, weekly, monthly)
 * - recurrence_interval: intervalle de récurrence (ex: toutes les 2 semaines)
 * - recurrence_days: jours de la semaine pour weekly (JSON array)
 * - recurrence_end_date: date de fin de la récurrence (optionnelle)
 */

migrate((app) => {
  const collection = new Collection({
    name: "tools_velocity_squad_events",
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
        name: "sprint_id",
        type: "text",
        required: false,
        presentable: false
      },
      {
        name: "type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "daily",
          "sprint_planning",
          "backlog_refinement",
          "sprint_review",
          "sprint_retrospective",
          "retrospective"
        ]
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true
      },
      {
        name: "date",
        type: "date",
        required: true,
        presentable: false
      },
      {
        name: "time",
        type: "text",
        required: false,
        presentable: false
      },
      {
        name: "duration",
        type: "number",
        required: false,
        presentable: false
      },
      {
        name: "description",
        type: "text",
        required: false,
        presentable: false
      },
      {
        name: "recurring",
        type: "bool",
        required: false,
        presentable: false
      },
      {
        name: "recurrence_type",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "none",
          "daily",
          "weekly",
          "monthly"
        ]
      },
      {
        name: "recurrence_interval",
        type: "number",
        required: false,
        presentable: false
      },
      {
        name: "recurrence_days",
        type: "json",
        required: false,
        presentable: false
      },
      {
        name: "recurrence_end_date",
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
      "CREATE INDEX idx_velocity_squad_events_session ON tools_velocity_squad_events (session_id)",
      "CREATE INDEX idx_velocity_squad_events_sprint ON tools_velocity_squad_events (sprint_id)",
      "CREATE INDEX idx_velocity_squad_events_date ON tools_velocity_squad_events (date)",
      "CREATE INDEX idx_velocity_squad_events_type ON tools_velocity_squad_events (type)"
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {}
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_velocity_squad_events");
  return app.delete(collection);
});
