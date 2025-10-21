/// <reference path="../pb_data/types.d.ts" />

/**
 * Mission Tracker - Collection Reports
 * Créé le : 2025-01-14
 * 
 * Cette collection stocke les rapports génériques liés aux missions
 * (initial, checkpoint, final)
 */

migrate((app) => {
  const missionsCollection = app.findCollectionByNameOrId("tools_mission_tracker_missions");
  
  const reportsCollection = new Collection({
    name: "reports",
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
          "initial",
          "checkpoint",
          "final"
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
        name: "content",
        type: "json",
        required: true,
        presentable: false,
        options: {
          maxSize: 5000000
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
      }
    ],
    indexes: [
      "CREATE INDEX idx_reports_mission_id ON reports (mission_id)",
      "CREATE INDEX idx_reports_type ON reports (type)",
      "CREATE INDEX idx_reports_date ON reports (date)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(reportsCollection);
  
}, (app) => {
  // Rollback
  try {
    const collection = app.findCollectionByNameOrId("reports");
    if (collection) {
      app.delete(collection);
    }
  } catch (e) {
    // Ignore errors during rollback
  }
});
