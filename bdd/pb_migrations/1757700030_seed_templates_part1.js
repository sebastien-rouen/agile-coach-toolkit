/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed templates (Partie 1/2)
 * 
 * Templates créés :
 * - Authentification
 * - Tribu VALUE
 * 
 * @version 1.0.0
 */

migrate((app) => {
  const templatesCollection = app.findCollectionByNameOrId("tools_skills_matrix_templates");

  const templates = [
    // ========================================
    // Template 1: Authentification
    // ========================================
    {
      name: "Authentification",
      description: "Compétences pour système d'authentification et sécurité",
      category: "Tech",
      icon: "🔐",
      active: true,
      data: {
        skills: [
          { name: "OAuth/SSO", category: "Security", type: "skill" },
          { name: "JWT/Auth0", category: "Security", type: "skill" },
          { name: "Session Management", category: "Security", type: "skill" },
          { name: "2FA/TOTP", category: "Security", type: "skill" },
          { name: "Password Hash/bcrypt", category: "Security", type: "skill" },
          { name: "RBAC/Permissions", category: "Security", type: "skill" }
        ],
        ownerships: [
          { name: "Architecture Sécurité", category: "Strategic" },
          { name: "Audit Conformité", category: "Governance" }
        ],
        members: [
          {
            name: "Alice",
            role: "Security Engineer",
            skills: {
              "OAuth/SSO": { level: 4, appetite: 3 },
              "JWT/Auth0": { level: 4, appetite: 2 },
              "Session Management": { level: 3, appetite: 3 },
              "2FA/TOTP": { level: 2, appetite: 4 },
              "Password Hash/bcrypt": { level: 4, appetite: 2 },
              "RBAC/Permissions": { level: 3, appetite: 3 }
            },
            appetences: ["Biométrie", "Zero Trust"],
            ownerships: {
              "Architecture Sécurité": "Owner",
              "Audit Conformité": "Owner"
            }
          },
          {
            name: "Bob",
            role: "Backend Developer",
            skills: {
              "OAuth/SSO": { level: 3, appetite: 3 },
              "JWT/Auth0": { level: 4, appetite: 3 },
              "Session Management": { level: 4, appetite: 2 },
              "2FA/TOTP": { level: 4, appetite: 2 },
              "Password Hash/bcrypt": { level: 3, appetite: 3 },
              "RBAC/Permissions": { level: 2, appetite: 4 }
            },
            appetences: ["OAuth 2.1", "WebAuthn"],
            ownerships: {}
          },
          {
            name: "Charlie",
            role: "Junior Developer",
            skills: {
              "OAuth/SSO": { level: 2, appetite: 4 },
              "JWT/Auth0": { level: 3, appetite: 4 },
              "Session Management": { level: 2, appetite: 4 },
              "2FA/TOTP": { level: 1, appetite: 4 },
              "Password Hash/bcrypt": { level: 3, appetite: 3 },
              "RBAC/Permissions": { level: 4, appetite: 2 }
            },
            appetences: ["JWT", "Session Management", "2FA"],
            ownerships: {}
          }
        ]
      }
    },

    // ========================================
    // Template 2: Tribu VALUE
    // ========================================
    {
      name: "Tribu VALUE",
      description: "Compétences coaching agile et accompagnement d'équipes",
      category: "Agile",
      icon: "🎯",
      active: true,
      data: {
        skills: [
          { name: "Agile: framework / mindset", category: "Agile", type: "skill" },
          { name: "Facilitation", category: "Soft Skills", type: "skill" },
          { name: "Conseil Stratégique", category: "Strategy", type: "skill" },
          { name: "OKR Stratégique", category: "Strategy", type: "skill" },
          { name: "OKR Orga", category: "Strategy", type: "skill" },
          { name: "Lean Portfolio Management", category: "Management", type: "skill" },
          { name: "Value Management Office", category: "Management", type: "skill" },
          { name: "Accompgnt Équipes sur l'engagement", category: "Coaching", type: "skill" },
          { name: "Accompgnt Équipes sur la valeur", category: "Coaching", type: "skill" },
          { name: "Process d'innovations", category: "Innovation", type: "skill" },
          { name: "Donner des formations", category: "Teaching", type: "skill" },
          { name: "Mentoring", category: "Coaching", type: "skill" },
          { name: "Coaching pro et indiv", category: "Coaching", type: "skill" },
          { name: "Change Management", category: "Management", type: "skill" },
          { name: "Leadership", category: "Soft Skills", type: "skill" },
          { name: "Communication (interne et externe)", category: "Soft Skills", type: "skill" },
          { name: "Analyse Organisationnelle", category: "Analysis", type: "skill" }
        ],
        ownerships: [
          { name: "Leader de tribu", category: "Leadership" },
          { name: "OKR", category: "Strategy" }
        ],
        members: [
          { name: "Audrey", role: "Tribe Leader", skills: {}, appetences: [], ownerships: { "Leader de tribu": "Owner", "OKR": "Owner" } },
          { name: "Sébastien", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Mathilde", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Anthony", role: "Agile Coach", skills: {}, appetences: [], ownerships: { "OKR": "Contributor" } },
          { name: "Delphine", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Hao", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Jérémie", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Samy", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Valérie", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Yves", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Caroline", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Gabrielle", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Laetitia", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} },
          { name: "Marina", role: "Agile Coach", skills: {}, appetences: [], ownerships: {} }
        ]
      }
    }
  ];

  // Insertion des templates
  templates.forEach(template => {
    const record = new Record(templatesCollection);
    record.set("name", template.name);
    record.set("description", template.description);
    record.set("category", template.category);
    record.set("icon", template.icon);
    record.set("data", template.data);
    record.set("active", template.active);
    app.save(record);
  });

  return null;
}, (app) => {
  // Rollback
  const templatesCollection = app.findCollectionByNameOrId("tools_skills_matrix_templates");
  const templateNames = ["Authentification", "Tribu VALUE"];

  templateNames.forEach(name => {
    const records = app.findRecordsByFilter(templatesCollection.id, `name="${name}"`, "-created", 1);
    records.forEach(record => {
      app.delete(record);
    });
  });

  return null;
});
