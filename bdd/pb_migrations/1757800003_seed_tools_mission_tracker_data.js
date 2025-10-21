/// <reference path="../pb_data/types.d.ts" />

/**
 * Mission Tracker - Données Exemple (Seed)
 * Créé le : 2025-01-14
 * 
 * Seed minimal pour tester les collections
 */

migrate((app) => {
  // ID utilisateur factice (à adapter selon votre système)
  const USER_ID = "user_example_123";

  // ========================================
  // 1. MISSION EXEMPLE
  // ========================================
  
  const missionCollection = app.findCollectionByNameOrId("tools_mission_tracker_missions");
  
  const mission = new Record(missionCollection);
  mission.set("user_id", USER_ID);
  mission.set("title", "Transformation Agile - Scale-up FinTech");
  mission.set("client", "PayFlow Solutions");
  mission.set("role", "coach-agile");
  mission.set("context", "<p>Scale-up de 150 personnes en pleine croissance.</p>");
  mission.set("start_date", "2024-10-01");
  mission.set("status", "active");
  mission.set("team_size", 45);
  mission.set("technologies", ["React", "Node.js", "PostgreSQL"]);
  mission.set("tags", ["scale-up", "SAFe", "fintech"]);
  mission.set("objectives", [
    "Harmoniser les pratiques Scrum",
    "Mettre en place un PI Planning",
    "Créer une communauté de pratique"
  ]);
  mission.set("archived", false);
  
  app.save(mission);
  const MISSION_ID = mission.id;

  // ========================================
  // 2. RAPPORT INITIAL
  // ========================================
  
  const initialReportsCollection = app.findCollectionByNameOrId("tools_mission_tracker_initial_reports");
  
  const initialReport = new Record(initialReportsCollection);
  initialReport.set("mission_id", MISSION_ID);
  initialReport.set("report_date", "2024-10-15");
  initialReport.set("first_impressions", "<p>Équipes motivées, forte expertise technique.</p>");
  initialReport.set("context_analysis", [
    { category: "Organisation", observation: "8 équipes autonomes" }
  ]);
  initialReport.set("team_observations", [
    { observation: "Bonne dynamique d'équipe" }
  ]);
  initialReport.set("process_observations", [
    { observation: "Scrum hétérogène" }
  ]);
  initialReport.set("strengths_identified", [
    "Expertise technique",
    "Motivation"
  ]);
  initialReport.set("challenges_identified", [
    "Silos",
    "Coordination"
  ]);
  initialReport.set("quick_wins", [
    "Communauté Scrum Masters",
    "Definition of Done commune"
  ]);
  initialReport.set("initial_recommendations", [
    "Lancer une communauté de pratique",
    "Harmoniser les DoD"
  ]);
  initialReport.set("mood_score", 4);
  initialReport.set("confidence_level", 4);
  
  app.save(initialReport);

  // ========================================
  // 3. CHECKPOINT
  // ========================================
  
  const checkpointsCollection = app.findCollectionByNameOrId("tools_mission_tracker_checkpoints");
  
  const checkpoint = new Record(checkpointsCollection);
  checkpoint.set("mission_id", MISSION_ID);
  checkpoint.set("checkpoint_type", "weekly");
  checkpoint.set("checkpoint_date", "2024-10-07");
  checkpoint.set("period_start", "2024-10-01");
  checkpoint.set("period_end", "2024-10-07");
  checkpoint.set("mood", "great");
  checkpoint.set("energy_level", 5);
  checkpoint.set("progress_feeling", 4);
  checkpoint.set("highlights", [
    "Excellente réception dans les équipes",
    "Découverte d'une équipe très mature"
  ]);
  checkpoint.set("lowlights", [
    "Certains managers résistants"
  ]);
  checkpoint.set("blockers", []);
  checkpoint.set("learnings", [
    "Les équipes veulent progresser"
  ]);
  checkpoint.set("next_actions", [
    "Organiser un atelier Agile Manifesto"
  ]);
  checkpoint.set("notes", "<p>Première semaine d'immersion réussie.</p>");
  
  app.save(checkpoint);

  // ========================================
  // 4. ACHIEVEMENT
  // ========================================
  
  const achievementsCollection = app.findCollectionByNameOrId("tools_mission_tracker_achievements");
  
  const achievement = new Record(achievementsCollection);
  achievement.set("mission_id", MISSION_ID);
  achievement.set("title", "Lancement de la communauté Scrum Masters");
  achievement.set("description", "<p>Mise en place d'une communauté de pratique hebdomadaire.</p>");
  achievement.set("achievement_date", "2024-10-11");
  achievement.set("category", "team");
  achievement.set("impact_level", "high");
  achievement.set("stakeholders_involved", ["Scrum Masters", "Coach Agile"]);
  achievement.set("metrics", { participants: 8, frequency: "weekly" });
  achievement.set("tags", ["communauté", "scrum"]);
  
  app.save(achievement);

  // ========================================
  // 5. CHALLENGE
  // ========================================
  
  const challengesCollection = app.findCollectionByNameOrId("tools_mission_tracker_challenges");
  
  const challenge = new Record(challengesCollection);
  challenge.set("mission_id", MISSION_ID);
  challenge.set("title", "Résistance managériale au changement");
  challenge.set("description", "<p>Certains managers voient l'Agilité comme une perte de contrôle.</p>");
  challenge.set("identified_date", "2024-10-08");
  challenge.set("category", "resistance");
  challenge.set("severity", "high");
  challenge.set("status", "in_progress");
  challenge.set("root_causes", [
    "Culture command & control",
    "Peur de perdre la légitimité"
  ]);
  challenge.set("actions_taken", [
    "Coaching individuel",
    "Atelier Leadership Agile"
  ]);
  challenge.set("learnings", "<p>La résistance au changement est normale.</p>");
  
  app.save(challenge);

  // ========================================
  // 6. EXPERIMENT
  // ========================================
  
  const experimentsCollection = app.findCollectionByNameOrId("tools_mission_tracker_experiments");
  
  const experiment = new Record(experimentsCollection);
  experiment.set("mission_id", MISSION_ID);
  experiment.set("title", "Daily Stand-up en 5 minutes chrono");
  experiment.set("hypothesis", "Si on limite le daily à 5 minutes, l'équipe sera plus focus.");
  experiment.set("description", "<p>Test d'un format de daily avec timer visible.</p>");
  experiment.set("start_date", "2024-10-18");
  experiment.set("end_date", "2024-10-28");
  experiment.set("status", "completed");
  experiment.set("success_criteria", [
    "Durée < 7 minutes",
    "Satisfaction équipe > 4/5"
  ]);
  experiment.set("observations", "<p>Les dailies sont passés de 25 min à 6 min.</p>");
  experiment.set("results", "<p>Format adopté par l'équipe.</p>");
  experiment.set("outcome", "success");
  experiment.set("next_steps", "<p>Déployer sur les autres équipes.</p>");
  
  app.save(experiment);

  // ========================================
  // 7. ROADMAP ITEM
  // ========================================
  
  const roadmapCollection = app.findCollectionByNameOrId("tools_mission_tracker_roadmap");
  
  const roadmapItem = new Record(roadmapCollection);
  roadmapItem.set("mission_id", MISSION_ID);
  roadmapItem.set("item_type", "skill");
  roadmapItem.set("title", "Obtenir la certification SAFe RTE");
  roadmapItem.set("description", "<p>Formation et certification pour accompagner des transformations à grande échelle.</p>");
  roadmapItem.set("status", "planned");
  roadmapItem.set("priority", "high");
  roadmapItem.set("due_date", "2025-03-01");
  roadmapItem.set("learnings", "<p>Nécessaire pour accompagner des organisations à grande échelle.</p>");
  roadmapItem.set("resources", [
    { type: "formation", name: "SAFe RTE Training", url: "https://scaledagile.com" }
  ]);
  
  app.save(roadmapItem);

}, (app) => {
  // Rollback
  // Note : PocketBase ne permet pas de rollback facilement les données.
  // En production, il faudrait supprimer manuellement les enregistrements créés.
});
