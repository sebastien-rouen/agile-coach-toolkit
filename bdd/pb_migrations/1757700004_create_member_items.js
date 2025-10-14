/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection member_items (Associations membres ↔ items)
 * 
 * Structure :
 * - id : Identifiant unique auto-généré
 * - matrix : Relation vers la matrice parente (requis)
 * - member : Relation vers le membre (requis)
 * - item : Relation vers l'item (skill ou ownership) (requis)
 * - level : Niveau de compétence 0-4 (pour skills)
 * - appetite : Appétence 0-4 (pour skills)
 * - ownership_role : Rôle Owner/Contributor/Backup (pour ownerships)
 * - notes : Notes libres (optionnel)
 * - last_assessed : Date de dernière évaluation (optionnel)
 * - created/updated : Dates de création/modification
 */

migrate((app) => {
  // Récupérer les collections existantes pour obtenir leurs IDs
  const matricesCollection = app.findCollectionByNameOrId("tools_skills_matrix_matrices");
  const membersCollection = app.findCollectionByNameOrId("tools_skills_matrix_members");
  const itemsCollection = app.findCollectionByNameOrId("tools_skills_matrix_items");

  const collection = new Collection({
    id: "tools_skills_matrix_member_items",
    name: "tools_skills_matrix_member_items",
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
        name: "member",
        type: "relation",
        required: true,
        presentable: false,
        cascadeDelete: true,
        collectionId: membersCollection.id,
        maxSelect: 1,
        minSelect: null,
        displayFields: ["name"]
      },
      {
        name: "item",
        type: "relation",
        required: true,
        presentable: false,
        cascadeDelete: true,
        collectionId: itemsCollection.id,
        maxSelect: 1,
        minSelect: null,
        displayFields: ["name"]
      },
      {
        name: "level",
        type: "number",
        required: false,
        presentable: false,
        min: 0,
        max: 4
      },
      {
        name: "appetite",
        type: "number",
        required: false,
        presentable: false,
        min: 0,
        max: 4
      },
      {
        name: "ownership_role",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: ["Owner", "Contributor", "Backup"]
      },
      {
        name: "notes",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: null
      },
      {
        name: "last_assessed",
        type: "date",
        required: false,
        presentable: false,
        min: "",
        max: ""
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
      "CREATE INDEX idx_member_items_matrix ON tools_skills_matrix_member_items (matrix)",
      "CREATE INDEX idx_member_items_member ON tools_skills_matrix_member_items (member)",
      "CREATE INDEX idx_member_items_item ON tools_skills_matrix_member_items (item)",
      "CREATE UNIQUE INDEX idx_member_items_unique ON tools_skills_matrix_member_items (matrix, member, item)"
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_skills_matrix_member_items");
  return app.delete(collection);
});
