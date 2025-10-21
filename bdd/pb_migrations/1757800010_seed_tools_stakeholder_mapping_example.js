/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const sessionsCollection = app.findCollectionByNameOrId("tools_stakeholder_mapping_sessions");
  const stakeholdersCollection = app.findCollectionByNameOrId("tools_stakeholder_mapping_stakeholders");

  // Create example session (PocketBase génère l'ID automatiquement)
  const sessionRecord = new Record(sessionsCollection);
  sessionRecord.set("name", "Projet Transformation Digitale");
  app.save(sessionRecord);

  // Récupérer l'ID généré
  const sessionId = sessionRecord.get("id");

  // Example stakeholders data
  const stakeholders = [
    {
      name: "Marie Dupont",
      role: "CEO",
      power: 5,
      interest: 5,
      influence: "vital",
      domain: "governance",
      notes: "Sponsor principal du projet"
    },
    {
      name: "Jean Martin",
      role: "CTO",
      power: 5,
      interest: 4,
      influence: "vital",
      domain: "governance",
      notes: "Responsable technique"
    },
    {
      name: "Sophie Bernard",
      role: "Product Owner",
      power: 3,
      interest: 5,
      influence: "necessary",
      domain: "customer",
      notes: "Représente les utilisateurs"
    },
    {
      name: "Pierre Dubois",
      role: "Scrum Master",
      power: 2,
      interest: 5,
      influence: "good",
      domain: "provider",
      notes: "Facilite l'équipe"
    },
    {
      name: "Claire Petit",
      role: "Utilisateur Final",
      power: 1,
      interest: 4,
      influence: "good",
      domain: "customer",
      notes: "Utilisateur clé"
    },
    {
      name: "Thomas Roux",
      role: "Consultant Externe",
      power: 2,
      interest: 3,
      influence: "courtesy",
      domain: "influencer",
      notes: "Conseil stratégique"
    },
    {
      name: "Isabelle Moreau",
      role: "Directrice RH",
      power: 4,
      interest: 3,
      influence: "necessary",
      domain: "governance",
      notes: "Gestion du changement"
    },
    {
      name: "Luc Fontaine",
      role: "Responsable Sécurité",
      power: 4,
      interest: 2,
      influence: "necessary",
      domain: "governance",
      notes: "Validation sécurité"
    }
  ];

  // Create stakeholder records (PocketBase génère les IDs automatiquement)
  stakeholders.forEach(data => {
    const record = new Record(stakeholdersCollection);
    record.set("session_id", sessionId);
    record.set("name", data.name);
    record.set("role", data.role);
    record.set("power", data.power);
    record.set("interest", data.interest);
    record.set("influence", data.influence);
    record.set("domain", data.domain);
    record.set("notes", data.notes);
    app.save(record);
  });

  return null;
}, (app) => {
  // Rollback: Delete example data
  // On supprime la session la plus récente nommée "Projet Transformation Digitale"
  try {
    const sessions = app.findRecordsByFilter(
      "tools_stakeholder_mapping_sessions",
      "name = 'Projet Transformation Digitale'",
      "-created",
      1
    );

    if (sessions.length > 0) {
      const sessionId = sessions[0].get("id");

      // Delete stakeholders
      const stakeholders = app.findRecordsByFilter(
        "tools_stakeholder_mapping_stakeholders",
        `session_id = '${sessionId}'`,
        "-created",
        500
      );
      stakeholders.forEach(record => {
        app.delete(record);
      });

      // Delete session
      app.delete(sessions[0]);
    }
  } catch (error) {
    // Ignore errors during rollback
  }

  return null;
});
