/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection members
 * 
 * Structure :
 * - id : Identifiant unique auto-généré
 * - matrix : Relation vers la matrice parente (requis)
 * - name : Nom du membre (requis)
 * - email : Email du membre (optionnel)
 * - role : Rôle dans l'équipe (optionnel)
 * - avatar : Photo de profil (optionnel)
 * - active : Statut actif/inactif (défaut: true)
 * - created/updated : Dates de création/modification
 */

migrate((app) => {
  // Récupérer la collection matrices pour obtenir son ID
  const matricesCollection = app.findCollectionByNameOrId("tools_skills_matrix_matrices");

  const collection = new Collection({
    id: "tools_skills_matrix_members",
    name: "tools_skills_matrix_members",
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
        name: "email",
        type: "email",
        required: false,
        presentable: false,
        exceptDomains: [],
        onlyDomains: []
      },
      {
        name: "role",
        type: "text",
        required: false,
        presentable: false,
        min: null,
        max: 100
      },
      {
        name: "avatar",
        type: "file",
        required: false,
        presentable: false,
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
        thumbs: ["100x100"]
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
      "CREATE INDEX idx_members_matrix ON tools_skills_matrix_members (matrix)",
      "CREATE INDEX idx_members_active ON tools_skills_matrix_members (active)",
      "CREATE UNIQUE INDEX idx_members_matrix_email ON tools_skills_matrix_members (matrix, email) WHERE email != ''"
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_skills_matrix_members");
  return app.delete(collection);
});
