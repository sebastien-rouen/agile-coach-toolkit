/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Création de la collection matrices
 * 
 * Structure :
 * - id : Identifiant unique auto-généré
 * - name : Nom de la matrice (requis)
 * - company : Entreprise/Organisation (optionnel)
 * - description : Description de la matrice (optionnel)
 * - active : Statut actif/inactif (défaut: true)
 * - created/updated : Dates de création/modification
 */

migrate((app) => {
  const collection = new Collection({
    id: "tools_skills_matrix_matrices",
    name: "tools_skills_matrix_matrices",
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
        name: "company",
        type: "text",
        required: false,
        presentable: false,
        min: null,
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
      "CREATE INDEX idx_matrices_active ON tools_skills_matrix_matrices (active)",
      "CREATE INDEX idx_matrices_name ON tools_skills_matrix_matrices (name)"
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools_skills_matrix_matrices");
  return app.delete(collection);
});
