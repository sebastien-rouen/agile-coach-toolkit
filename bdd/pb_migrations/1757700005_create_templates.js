/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection templates
 * 
 * Structure :
 * - id : Identifiant unique auto-généré
 * - name : Nom du template (requis, unique)
 * - description : Description du template (optionnel)
 * - category : Catégorie (Tech, Agile, Business, etc.) (optionnel)
 * - icon : Emoji/Icône (optionnel)
 * - data : Structure JSON complète du template (requis)
 * - active : Statut actif/inactif (défaut: true)
 * - created/updated : Dates de création/modification
 */

migrate((app) => {
  const collection = new Collection({
    id: "tools_skills_matrix_templates",
    name: "tools_skills_matrix_templates",
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
        min: 2,
        max: 255
      },
      {
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: null
      },
      {
        name: "category",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: 100
      },
      {
        name: "icon",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: 10
      },
      {
        name: "data",
        type: "json",
        required: true,
        presentable: false
      },
      {
        name: "active",
        type: "bool",
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
      "CREATE UNIQUE INDEX idx_templates_name ON tools_skills_matrix_templates (name)",
      "CREATE INDEX idx_templates_category ON tools_skills_matrix_templates (category)",
      "CREATE INDEX idx_templates_active ON tools_skills_matrix_templates (active)"
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_skills_matrix_templates");
  return app.delete(collection);
});
