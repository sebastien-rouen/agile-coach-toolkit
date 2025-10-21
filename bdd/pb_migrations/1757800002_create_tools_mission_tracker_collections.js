/// <reference path="../pb_data/types.d.ts" />

/**
 * Mission Tracker - Collections Principales
 * Créé le : 2025-01-14
 */

migrate((app) => {
  // ========================================
  // 1. COLLECTION: mission_tracker_missions
  // ========================================
  
  const missionsCollection = new Collection({
    name: "tools_mission_tracker_missions",
    type: "base",
    system: false,
    fields: [
      {
        name: "user_id",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: null,
          pattern: ""
        }
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "client",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 150,
          pattern: ""
        }
      },
      {
        name: "role",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "coach-agile",
          "scrum-master",
          "coach-organisationnel",
          "product-owner",
          "product-manager",
          "designer",
          "rte",
          "dev",
          "architecte",
          "devops"
        ]
      },
      {
        name: "context",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "start_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "end_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "active",
          "completed",
          "paused",
          "cancelled"
        ]
      },
      {
        name: "team_size",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 0,
          max: 500,
          noDecimal: true
        }
      },
      {
        name: "technologies",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "tags",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "objectives",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "archived",
        type: "bool",
        required: false,
        presentable: false,
        options: {}
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_missions_user_id ON tools_mission_tracker_missions (user_id)",
      "CREATE INDEX idx_tools_mission_tracker_missions_status ON tools_mission_tracker_missions (status)",
      "CREATE INDEX idx_tools_mission_tracker_missions_archived ON tools_mission_tracker_missions (archived)"
    ],
    listRule: "@request.auth.id = user_id",
    viewRule: "@request.auth.id = user_id",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id = user_id",
    deleteRule: "@request.auth.id = user_id"
  });

  app.save(missionsCollection);

  // ========================================
  // 2. COLLECTION: mission_tracker_initial_reports
  // ========================================
  
  const initialReportsCollection = new Collection({
    name: "tools_mission_tracker_initial_reports",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "report_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "first_impressions",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "context_analysis",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "team_observations",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "process_observations",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "strengths_identified",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "challenges_identified",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "quick_wins",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "initial_recommendations",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "mood_score",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 1,
          max: 5,
          noDecimal: false
        }
      },
      {
        name: "confidence_level",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 1,
          max: 5,
          noDecimal: false
        }
      }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_tools_mission_tracker_initial_reports_mission ON tools_mission_tracker_initial_reports (mission_id)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(initialReportsCollection);

  // ========================================
  // 3. COLLECTION: mission_tracker_checkpoints
  // ========================================
  
  const checkpointsCollection = new Collection({
    name: "tools_mission_tracker_checkpoints",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "checkpoint_type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "weekly",
          "monthly",
          "quarterly",
          "custom"
        ]
      },
      {
        name: "checkpoint_date",
        type: "date",
        required: true,
        presentable: true,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "period_start",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "period_end",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "mood",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "great",
          "good",
          "neutral",
          "bad"
        ]
      },
      {
        name: "energy_level",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 1,
          max: 5,
          noDecimal: true
        }
      },
      {
        name: "progress_feeling",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 1,
          max: 5,
          noDecimal: true
        }
      },
      {
        name: "highlights",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "lowlights",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "blockers",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "learnings",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "next_actions",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "notes",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_checkpoints_mission ON tools_mission_tracker_checkpoints (mission_id)",
      "CREATE INDEX idx_tools_mission_tracker_checkpoints_type ON tools_mission_tracker_checkpoints (checkpoint_type)",
      "CREATE INDEX idx_tools_mission_tracker_checkpoints_date ON tools_mission_tracker_checkpoints (checkpoint_date)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(checkpointsCollection);

  // ========================================
  // 4. COLLECTION: mission_tracker_achievements
  // ========================================
  
  const achievementsCollection = new Collection({
    name: "tools_mission_tracker_achievements",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "description",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "achievement_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "category",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "team",
          "process",
          "technical",
          "delivery",
          "culture",
          "tooling",
          "quality",
          "other"
        ]
      },
      {
        name: "impact_level",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "low",
          "medium",
          "high",
          "critical"
        ]
      },
      {
        name: "stakeholders_involved",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "metrics",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "tags",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "related_checkpoint_id",
        type: "relation",
        required: false,
        presentable: false,
        collectionId: checkpointsCollection.id,
        cascadeDelete: false,
        maxSelect: 1
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_achievements_mission ON tools_mission_tracker_achievements (mission_id)",
      "CREATE INDEX idx_tools_mission_tracker_achievements_category ON tools_mission_tracker_achievements (category)",
      "CREATE INDEX idx_tools_mission_tracker_achievements_date ON tools_mission_tracker_achievements (achievement_date)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(achievementsCollection);

  // ========================================
  // 5. COLLECTION: mission_tracker_challenges
  // ========================================
  
  const challengesCollection = new Collection({
    name: "tools_mission_tracker_challenges",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "description",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "identified_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "category",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "resistance",
          "technical",
          "organizational",
          "communication",
          "resources",
          "cultural",
          "political",
          "other"
        ]
      },
      {
        name: "severity",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "low",
          "medium",
          "high",
          "critical"
        ]
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "identified",
          "in_progress",
          "resolved",
          "escalated",
          "abandoned"
        ]
      },
      {
        name: "root_causes",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "actions_taken",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "resolution_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "learnings",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "related_checkpoint_id",
        type: "relation",
        required: false,
        presentable: false,
        collectionId: checkpointsCollection.id,
        cascadeDelete: false,
        maxSelect: 1
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_challenges_mission ON tools_mission_tracker_challenges (mission_id)",
      "CREATE INDEX idx_tools_mission_tracker_challenges_status ON tools_mission_tracker_challenges (status)",
      "CREATE INDEX idx_tools_mission_tracker_challenges_severity ON tools_mission_tracker_challenges (severity)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(challengesCollection);

  // ========================================
  // 6. COLLECTION: mission_tracker_experiments
  // ========================================
  
  const experimentsCollection = new Collection({
    name: "tools_mission_tracker_experiments",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "hypothesis",
        type: "text",
        required: true,
        presentable: false,
        options: {
          min: null,
          max: 500,
          pattern: ""
        }
      },
      {
        name: "description",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "start_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "end_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "planned",
          "running",
          "completed",
          "cancelled"
        ]
      },
      {
        name: "success_criteria",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "observations",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "results",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "outcome",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "success",
          "partial_success",
          "failure",
          "inconclusive"
        ]
      },
      {
        name: "next_steps",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_experiments_mission ON tools_mission_tracker_experiments (mission_id)",
      "CREATE INDEX idx_tools_mission_tracker_experiments_status ON tools_mission_tracker_experiments (status)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(experimentsCollection);

  // ========================================
  // 7. COLLECTION: mission_tracker_roadmap
  // ========================================
  
  const roadmapCollection = new Collection({
    name: "tools_mission_tracker_roadmap",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "item_type",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "skill",
          "experiment",
          "read",
          "meet",
          "create",
          "learn",
          "network",
          "other"
        ]
      },
      {
        name: "title",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 3,
          max: 200,
          pattern: ""
        }
      },
      {
        name: "description",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "status",
        type: "select",
        required: true,
        presentable: false,
        maxSelect: 1,
        values: [
          "planned",
          "in_progress",
          "done",
          "cancelled"
        ]
      },
      {
        name: "priority",
        type: "select",
        required: false,
        presentable: false,
        maxSelect: 1,
        values: [
          "low",
          "medium",
          "high"
        ]
      },
      {
        name: "due_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "completion_date",
        type: "date",
        required: false,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "learnings",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "resources",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      }
    ],
    indexes: [
      "CREATE INDEX idx_tools_mission_tracker_roadmap_mission ON tools_mission_tracker_roadmap (mission_id)",
      "CREATE INDEX idx_tools_mission_tracker_roadmap_status ON tools_mission_tracker_roadmap (status)",
      "CREATE INDEX idx_tools_mission_tracker_roadmap_type ON tools_mission_tracker_roadmap (item_type)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(roadmapCollection);

  // ========================================
  // 8. COLLECTION: mission_tracker_final_reports
  // ========================================
  
  const finalReportsCollection = new Collection({
    name: "tools_mission_tracker_final_reports",
    type: "base",
    system: false,
    fields: [
      {
        name: "mission_id",
        type: "relation",
        required: true,
        presentable: false,
        collectionId: missionsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        name: "report_date",
        type: "date",
        required: true,
        presentable: false,
        options: {
          min: "",
          max: ""
        }
      },
      {
        name: "executive_summary",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "objectives_completion",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "key_achievements",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "transformation_impact",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "metrics_evolution",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "challenges_faced",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "key_learnings",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "recommendations",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "post_mission_roadmap",
        type: "json",
        required: false,
        presentable: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "conclusion",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "gratitude",
        type: "editor",
        required: false,
        presentable: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: "overall_satisfaction",
        type: "number",
        required: false,
        presentable: false,
        options: {
          min: 1,
          max: 5,
          noDecimal: false
        }
      }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_tools_mission_tracker_final_reports_mission ON tools_mission_tracker_final_reports (mission_id)"
    ],
    listRule: "@request.auth.id = mission_id.user_id",
    viewRule: "@request.auth.id = mission_id.user_id",
    createRule: "@request.auth.id = mission_id.user_id",
    updateRule: "@request.auth.id = mission_id.user_id",
    deleteRule: "@request.auth.id = mission_id.user_id"
  });

  app.save(finalReportsCollection);

}, (app) => {
  // Rollback
  const collections = [
    "tools_mission_tracker_final_reports",
    "tools_mission_tracker_roadmap",
    "tools_mission_tracker_experiments",
    "tools_mission_tracker_challenges",
    "tools_mission_tracker_achievements",
    "tools_mission_tracker_checkpoints",
    "tools_mission_tracker_initial_reports",
    "tools_mission_tracker_missions"
  ];

  collections.forEach(name => {
    try {
      const collection = app.findCollectionByNameOrId(name);
      if (collection) {
        app.delete(collection);
      }
    } catch (e) {
      // Ignore errors during rollback
    }
  });
});
