/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = new Collection({
    name: "tools_stakeholder_mapping_stakeholders",
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
        presentable: true,
        min: 1,
        max: 255
      },
      {
        name: "role",
        type: "text",
        required: true,
        presentable: false,
        min: 1,
        max: 255
      },
      {
        name: "power",
        type: "number",
        required: true,
        presentable: false,
        min: 1,
        max: 5
      },
      {
        name: "interest",
        type: "number",
        required: true,
        presentable: false,
        min: 1,
        max: 5
      },
      {
        name: "influence",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "vital",
          "necessary",
          "good",
          "courtesy"
        ]
      },
      {
        name: "domain",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "governance",
          "customer",
          "provider",
          "influencer"
        ]
      },
      {
        name: "notes",
        type: "text",
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
      "CREATE INDEX idx_stakeholders_session ON tools_stakeholder_mapping_stakeholders (session_id)",
      "CREATE INDEX idx_stakeholders_influence ON tools_stakeholder_mapping_stakeholders (influence)",
      "CREATE INDEX idx_stakeholders_domain ON tools_stakeholder_mapping_stakeholders (domain)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_stakeholder_mapping_stakeholders");
  return app.delete(collection);
});
