/// <reference path="../pb_data/types.d.ts" />

/**
 * Agile - Collection Events
 * Créé le : 2025-01-14
 * 
 * Cette collection stocke les événements liés aux missions agiles
 * (milestones, meetings, deliveries, issues, achievements)
 */

migrate((app) => {
  const missionsCollection = app.findCollectionByNameOrId("agile_missions");
  
  const eventsCollection = new Collection({
    name: "agile_events",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "milestone",
          "meeting",
          "delivery",
          "issue",
          "achievement"
        ]
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        options: {
          min: null,
          max: 1000,
          pattern: ""
        }
      },
      {
        name: "date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "tags",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 1000000
        }
      },
      {
        name: "impact",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "low",
          "medium",
          "high"
        ]
      }
    ],
    indexes: [
      "CREATE INDEX idx_events_mission_id ON agile_events (mission_id)",
      "CREATE INDEX idx_events_date ON agile_events (date)",
      "CREATE INDEX idx_events_type ON agile_events (type)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(eventsCollection);
  
}, (app) => {
  // Rollback
  try {
    const collection = app.findCollectionByNameOrId("agile_events");
    if (collection) {
      app.delete(collection);
    }
  } catch (e) {
    // Ignore errors during rollback
  }
});
