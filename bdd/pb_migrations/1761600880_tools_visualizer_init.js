/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // Collection : teams
  const teams = new Collection({
    name: "agile_visualizer_teams",
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
        options: { min: 1, max: 100, pattern: "" }
      },
      {
        name: "color",
        type: "text",
        required: false,
        presentable: false,
        options: { min: null, max: 7, pattern: "^#[0-9A-Fa-f]{6}$" }
      },
      {
        name: "members_count",
        type: "number",
        required: false,
        presentable: false,
        options: { min: 0, max: null, noDecimal: true }
      },
      {
        name: "icon",
        type: "text",
        required: false,
        presentable: false,
        options: { min: null, max: 10, pattern: "" }
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
  app.save(teams);

  // Collection : subjects
  const subjects = new Collection({
    name: "agile_visualizer_subjects",
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
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: { min: 1, max: 200, pattern: "" }
      },
      {
        name: "type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: ["team", "cross-team", "individual"]
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: ["planned", "in-progress", "blocked", "completed"]
      },
      {
        name: "priority",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: ["low", "medium", "high", "critical"]
      },
      {
        name: "deadline",
        type: "date",
        required: false,
        presentable: false,
        options: { min: "", max: "" }
      },
      {
        name: "teams",
        type: "relation",
        required: false,
        presentable: false,
        collectionId: teams.id,
        cascadeDelete: false,
        maxSelect: null
      },
      {
        name: "assignees",
        type: "json",
        required: false,
        presentable: false,
        options: { maxSize: 2000000 }
      },
      {
        name: "dependencies",
        type: "json",
        required: false,
        presentable: false,
        options: { maxSize: 2000000 }
      },
      {
        name: "jira_key",
        type: "text",
        required: false,
        presentable: false,
        options: { min: null, max: 50, pattern: "" }
      },
      {
        name: "description",
        type: "editor",
        required: false,
        presentable: false,
        options: { convertUrls: false }
      },
      {
        name: "tags",
        type: "json",
        required: false,
        presentable: false,
        options: { maxSize: 2000000 }
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
      "CREATE INDEX idx_agile_visualizer_subjects_deadline ON agile_visualizer_subjects (deadline)",
      "CREATE INDEX idx_agile_visualizer_subjects_status ON agile_visualizer_subjects (status)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  // Sauvegarder la collection subjects
  app.save(subjects);

}, (app) => {
  const subjects = app.findCollectionByNameOrId("agile_visualizer_subjects");
  const teams = app.findCollectionByNameOrId("agile_visualizer_teams");
  
  if (subjects) app.delete(subjects);
  if (teams) app.delete(teams);
});
