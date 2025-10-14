/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection items (Skills + Ownerships fusionnés)
 * 
 * Structure :
 * - id : Identifiant unique auto-généré
 * - matrix : Relation vers la matrice parente (requis)
 * - name : Nom de l'item (requis)
 * - type : Type d'item - "skill" ou "ownership" (requis)
 * - category : Catégorie (Tech, Soft Skills, OKR, etc.) (optionnel)
 * - description : Description de l'item (optionnel)
 * - active : Statut actif/inactif (défaut: true)
 * - created/updated : Dates de création/modification
 */

migrate((app) => {
  // Récupérer la collection matrices pour obtenir son ID
  const matricesCollection = app.findCollectionByNameOrId("tools_skills_matrix_matrices");

  const collection = new Collection({
    id: "tools_skills_matrix_items",
    name: "tools_skills_matrix_items",
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
        name: "matrix",
        type: "relation",
        required: true,
        presentable: false,
        cascadeDelete: true,
        collectionId: matricesCollection.id,
        maxSelect: 1,
        minSelect: null,
        displayFields: ["name"]
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
        name: "type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: ["skill", "ownership", "appetence"]
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
        name: "description",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: null
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
      "CREATE INDEX idx_items_matrix ON tools_skills_matrix_items (matrix)",
      "CREATE INDEX idx_items_type ON tools_skills_matrix_items (type)",
      "CREATE INDEX idx_items_active ON tools_skills_matrix_items (active)",
      "CREATE UNIQUE INDEX idx_items_matrix_type_name ON tools_skills_matrix_items (matrix, type, name)"
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_skills_matrix_items");
  return app.delete(collection);
});
