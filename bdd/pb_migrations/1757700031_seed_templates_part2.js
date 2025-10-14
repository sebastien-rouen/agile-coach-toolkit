/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed templates (Partie 2/2)
 * 
 * Templates créés :
 * - E-commerce
 * - Recherche
 * - Paiement
 * 
 * @version 1.0.0
 */

migrate((app) => {
  const templatesCollection = app.findCollectionByNameOrId("tools_skills_matrix_templates");

  const templates = [
    // ========================================
    // Template 3: E-commerce
    // ========================================
    {
      name: "Panier e-commerce",
      description: "Compétences pour plateforme e-commerce complète",
      category: "Business",
      icon: "🛒",
      active: true,
      data: {
        skills: [
          { name: "Gestion Produits/Catalog", category: "Product", type: "skill" },
          { name: "Panier/Redis", category: "Tech", type: "skill" },
          { name: "Stock/Inventory", category: "Business", type: "skill" },
          { name: "Prix/Promos/Coupons", category: "Business", type: "skill" },
          { name: "API Payment/Stripe", category: "Tech", type: "skill" },
          { name: "Livraison/Shipping", category: "Business", type: "skill" }
        ],
        ownerships: [
          { name: "Product Owner E-commerce", category: "Product" },
          { name: "Stratégie Pricing", category: "Business" },
          { name: "Architecture Backend", category: "Tech" }
        ],
        members: [
          {
            name: "Sophie",
            role: "Product Owner",
            skills: {
              "Gestion Produits/Catalog": { level: 4, appetite: 3 },
              "Panier/Redis": { level: 4, appetite: 2 },
              "Stock/Inventory": { level: 3, appetite: 3 },
              "Prix/Promos/Coupons": { level: 4, appetite: 3 },
              "API Payment/Stripe": { level: 3, appetite: 2 },
              "Livraison/Shipping": { level: 2, appetite: 3 }
            },
            appetences: ["Microservices", "Event Sourcing"],
            ownerships: {
              "Product Owner E-commerce": "Owner",
              "Stratégie Pricing": "Owner"
            }
          },
          {
            name: "Thomas",
            role: "Backend Engineer",
            skills: {
              "Gestion Produits/Catalog": { level: 3, appetite: 2 },
              "Panier/Redis": { level: 4, appetite: 3 },
              "Stock/Inventory": { level: 4, appetite: 3 },
              "Prix/Promos/Coupons": { level: 3, appetite: 2 },
              "API Payment/Stripe": { level: 4, appetite: 3 },
              "Livraison/Shipping": { level: 3, appetite: 2 }
            },
            appetences: ["Kubernetes", "GraphQL"],
            ownerships: {
              "Architecture Backend": "Owner"
            }
          },
          {
            name: "Marie",
            role: "Developer",
            skills: {
              "Gestion Produits/Catalog": { level: 2, appetite: 3 },
              "Panier/Redis": { level: 3, appetite: 4 },
              "Stock/Inventory": { level: 2, appetite: 4 },
              "Prix/Promos/Coupons": { level: 2, appetite: 3 },
              "API Payment/Stripe": { level: 2, appetite: 4 },
              "Livraison/Shipping": { level: 4, appetite: 2 }
            },
            appetences: ["Redis", "Gestion Stock", "API Payment"],
            ownerships: {}
          }
        ]
      }
    },

    // ========================================
    // Template 4: Recherche
    // ========================================
    {
      name: "Recherche",
      description: "Compétences moteur de recherche et indexation",
      category: "Tech",
      icon: "🔍",
      active: true,
      data: {
        skills: [
          { name: "Elasticsearch/Solr", category: "Search", type: "skill" },
          { name: "Indexation/Lucene", category: "Search", type: "skill" },
          { name: "Filtres/Facettes", category: "Search", type: "skill" },
          { name: "Autocomplete/Suggest", category: "Search", type: "skill" },
          { name: "Facettes/Aggregations", category: "Search", type: "skill" },
          { name: "Performance/Caching", category: "Performance", type: "skill" }
        ],
        ownerships: [
          { name: "Expert Elasticsearch", category: "Tech" },
          { name: "Performance Tuning", category: "Tech" }
        ],
        members: [
          {
            name: "Lucas",
            role: "Search Engineer",
            skills: {
              "Elasticsearch/Solr": { level: 4, appetite: 3 },
              "Indexation/Lucene": { level: 4, appetite: 2 },
              "Filtres/Facettes": { level: 3, appetite: 3 },
              "Autocomplete/Suggest": { level: 4, appetite: 3 },
              "Facettes/Aggregations": { level: 3, appetite: 2 },
              "Performance/Caching": { level: 4, appetite: 3 }
            },
            appetences: ["Vector Search", "AI/ML Search"],
            ownerships: {
              "Expert Elasticsearch": "Owner",
              "Performance Tuning": "Owner"
            }
          },
          {
            name: "Emma",
            role: "Backend Developer",
            skills: {
              "Elasticsearch/Solr": { level: 3, appetite: 3 },
              "Indexation/Lucene": { level: 3, appetite: 2 },
              "Filtres/Facettes": { level: 4, appetite: 3 },
              "Autocomplete/Suggest": { level: 3, appetite: 3 },
              "Facettes/Aggregations": { level: 4, appetite: 3 },
              "Performance/Caching": { level: 3, appetite: 2 }
            },
            appetences: ["NLP", "Semantic Search"],
            ownerships: {}
          },
          {
            name: "Noah",
            role: "Junior Developer",
            skills: {
              "Elasticsearch/Solr": { level: 2, appetite: 4 },
              "Indexation/Lucene": { level: 3, appetite: 3 },
              "Filtres/Facettes": { level: 2, appetite: 4 },
              "Autocomplete/Suggest": { level: 2, appetite: 4 },
              "Facettes/Aggregations": { level: 2, appetite: 3 },
              "Performance/Caching": { level: 2, appetite: 3 }
            },
            appetences: ["Elasticsearch", "Filtres", "Autocomplete"],
            ownerships: {}
          }
        ]
      }
    },

    // ========================================
    // Template 5: Paiement
    // ========================================
    {
      name: "Paiement",
      description: "Compétences systèmes de paiement et conformité",
      category: "Business",
      icon: "💳",
      active: true,
      data: {
        skills: [
          { name: "Stripe/Square", category: "Payment", type: "skill" },
          { name: "PayPal/Adyen", category: "Payment", type: "skill" },
          { name: "3D Secure/SCA", category: "Security", type: "skill" },
          { name: "Webhooks/Events", category: "Tech", type: "skill" },
          { name: "Remboursements/Refunds", category: "Business", type: "skill" },
          { name: "PCI DSS/Compliance", category: "Compliance", type: "skill" }
        ],
        ownerships: [
          { name: "Référente Paiements", category: "Business" },
          { name: "Conformité PCI DSS", category: "Compliance" },
          { name: "Documentation Compliance", category: "Documentation" }
        ],
        members: [
          {
            name: "Léa",
            role: "Payment Lead",
            skills: {
              "Stripe/Square": { level: 4, appetite: 3 },
              "PayPal/Adyen": { level: 3, appetite: 2 },
              "3D Secure/SCA": { level: 4, appetite: 3 },
              "Webhooks/Events": { level: 4, appetite: 2 },
              "Remboursements/Refunds": { level: 3, appetite: 2 },
              "PCI DSS/Compliance": { level: 3, appetite: 3 }
            },
            appetences: ["Crypto Payments", "Open Banking"],
            ownerships: {
              "Référente Paiements": "Owner",
              "Conformité PCI DSS": "Owner"
            }
          },
          {
            name: "Hugo",
            role: "Backend Developer",
            skills: {
              "Stripe/Square": { level: 3, appetite: 3 },
              "PayPal/Adyen": { level: 4, appetite: 3 },
              "3D Secure/SCA": { level: 3, appetite: 2 },
              "Webhooks/Events": { level: 3, appetite: 3 },
              "Remboursements/Refunds": { level: 4, appetite: 3 },
              "PCI DSS/Compliance": { level: 2, appetite: 2 }
            },
            appetences: ["Stripe Connect", "Fraud Detection"],
            ownerships: {}
          },
          {
            name: "Chloé",
            role: "Compliance Officer",
            skills: {
              "Stripe/Square": { level: 2, appetite: 3 },
              "PayPal/Adyen": { level: 2, appetite: 2 },
              "3D Secure/SCA": { level: 2, appetite: 3 },
              "Webhooks/Events": { level: 3, appetite: 3 },
              "Remboursements/Refunds": { level: 2, appetite: 2 },
              "PCI DSS/Compliance": { level: 4, appetite: 3 }
            },
            appetences: ["Stripe", "3D Secure", "Webhooks"],
            ownerships: {
              "Documentation Compliance": "Owner"
            }
          }
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
  const templateNames = ["Panier e-commerce", "Recherche", "Paiement"];
  
  templateNames.forEach(name => {
    const records = app.findRecordsByFilter(templatesCollection.id, `name="${name}"`, "-created", 1);
    records.forEach(record => {
      app.delete(record);
    });
  });
  
  return null;
});
