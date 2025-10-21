/// <reference path="../pb_data/types.d.ts" />

/**
 * Mission Tracker - Collection Missions (Simple)
 * Créé le : 2025-01-14
 * 
 * Cette collection stocke les missions de manière simple
 * pour correspondre au code JavaScript existant
 */

migrate((app) => {
  const missionsCollection = new Collection({
    name: "missions",
    type: "base",
    system: false,
    fields: [
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
        name: "client",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 150,
          pattern: ""
        }
      },
      {
        name: "role",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 100,
          pattern: ""
        }
      },
      {
        name: "start_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "end_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "active",
          "completed",
          "paused"
        ]
      },
      {
        name: "objectives",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "metrics",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "context",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      }
    ],
    indexes: [
      "CREATE INDEX idx_missions_status ON missions (status)",
      "CREATE INDEX idx_missions_start_date ON missions (start_date)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(missionsCollection);
  
}, (app) => {
  // Rollback
  try {
    const collection = app.findCollectionByNameOrId("missions");
    if (collection) {
      app.delete(collection);
    }
  } catch (e) {
    // Ignore errors during rollback
  }
});
