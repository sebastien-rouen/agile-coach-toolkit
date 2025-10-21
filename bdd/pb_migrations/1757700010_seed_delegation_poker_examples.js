/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed de données d'exemple pour Delegation Poker
 * Crée une session exemple avec décisions
 */
migrate((app) => {
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");

    // ========================================
    // SESSION 1 : Équipe Produit - Sprint Planning
    // ========================================
    const session1 = new Record(sessionsCollection);
    session1.set("session_name", "Équipe Produit - Sprint Planning");
    session1.set("participants", ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"]);
    session1.set("status", "active");
    app.save(session1);

    const decisions1 = [
        {
            decision_text: "Choix des technologies pour un nouveau composant",
            category: "technical",
            order: 1
        },
        {
            decision_text: "Priorisation des user stories",
            category: "product",
            order: 2
        },
        {
            decision_text: "Organisation des horaires de travail",
            category: "organizational",
            order: 3
        },
        {
            decision_text: "Définition des rôles dans l'équipe",
            category: "team",
            order: 4
        },
        {
            decision_text: "Budget alloué aux formations",
            category: "other",
            order: 5
        }
    ];

    decisions1.forEach(decisionData => {
        const decision = new Record(decisionsCollection);
        decision.set("session_id", session1.id);
        decision.set("decision_text", decisionData.decision_text);
        decision.set("category", decisionData.category);
        decision.set("order", decisionData.order);
        decision.set("status", "pending");
        app.save(decision);
    });

    // ========================================
    // SESSION 2 : Service RH - Recrutement
    // ========================================
    const session2 = new Record(sessionsCollection);
    session2.set("session_name", "Service RH - Processus de Recrutement");
    session2.set("participants", ["Marie (DRH)", "Thomas (Manager)", "Sophie (Recruteur)", "Luc (Opérationnel)"]);
    session2.set("status", "active");
    app.save(session2);

    const decisions2 = [
        {
            decision_text: "Validation finale des candidatures",
            category: "organizational",
            order: 1
        },
        {
            decision_text: "Définition des grilles salariales",
            category: "other",
            order: 2
        },
        {
            decision_text: "Choix des outils de sourcing",
            category: "technical",
            order: 3
        },
        {
            decision_text: "Organisation des entretiens techniques",
            category: "organizational",
            order: 4
        },
        {
            decision_text: "Décision d'embauche immédiate",
            category: "team",
            order: 5
        },
        {
            decision_text: "Négociation des avantages sociaux",
            category: "other",
            order: 6
        }
    ];

    decisions2.forEach(decisionData => {
        const decision = new Record(decisionsCollection);
        decision.set("session_id", session2.id);
        decision.set("decision_text", decisionData.decision_text);
        decision.set("category", decisionData.category);
        decision.set("order", decisionData.order);
        decision.set("status", "pending");
        app.save(decision);
    });

    // ========================================
    // SESSION 3 : Équipe Médicale - Urgences
    // ========================================
    const session3 = new Record(sessionsCollection);
    session3.set("session_name", "Service Urgences - Protocoles de Soins");
    session3.set("participants", ["Dr. Dubois (Chef)", "Infirmière Claire", "Dr. Martin (Interne)", "Aide-soignant Paul"]);
    session3.set("status", "completed");
    app.save(session3);

    const decisions3 = [
        {
            decision_text: "Prescription de médicaments hors AMM",
            category: "other",
            order: 1
        },
        {
            decision_text: "Triage des patients en cas d'affluence",
            category: "organizational",
            order: 2
        },
        {
            decision_text: "Demande d'examens complémentaires urgents",
            category: "technical",
            order: 3
        },
        {
            decision_text: "Transfert vers un service spécialisé",
            category: "organizational",
            order: 4
        },
        {
            decision_text: "Gestion des stocks de matériel médical",
            category: "other",
            order: 5
        },
        {
            decision_text: "Organisation des gardes et astreintes",
            category: "team",
            order: 6
        },
        {
            decision_text: "Protocole de réanimation d'urgence",
            category: "technical",
            order: 7
        }
    ];

    decisions3.forEach(decisionData => {
        const decision = new Record(decisionsCollection);
        decision.set("session_id", session3.id);
        decision.set("decision_text", decisionData.decision_text);
        decision.set("category", decisionData.category);
        decision.set("order", decisionData.order);
        decision.set("status", "completed");
        app.save(decision);
    });

    // ========================================
    // SESSION 4 : Unité Militaire - Opérations
    // ========================================
    const session4 = new Record(sessionsCollection);
    session4.set("session_name", "Unité Tactique - Préparation Mission");
    session4.set("participants", ["Capitaine Moreau", "Lieutenant Durand", "Sergent-Chef Petit", "Caporal Bernard"]);
    session4.set("status", "active");
    app.save(session4);

    const decisions4 = [
        {
            decision_text: "Engagement au combat en situation critique",
            category: "other",
            order: 1
        },
        {
            decision_text: "Choix de l'itinéraire de patrouille",
            category: "organizational",
            order: 2
        },
        {
            decision_text: "Utilisation de l'équipement de communication",
            category: "technical",
            order: 3
        },
        {
            decision_text: "Répartition des rôles dans l'escouade",
            category: "team",
            order: 4
        },
        {
            decision_text: "Demande de soutien aérien",
            category: "other",
            order: 5
        },
        {
            decision_text: "Gestion des permissions et repos",
            category: "organizational",
            order: 6
        },
        {
            decision_text: "Maintenance préventive du matériel",
            category: "technical",
            order: 7
        },
        {
            decision_text: "Protocole d'évacuation sanitaire",
            category: "organizational",
            order: 8
        }
    ];

    decisions4.forEach(decisionData => {
        const decision = new Record(decisionsCollection);
        decision.set("session_id", session4.id);
        decision.set("decision_text", decisionData.decision_text);
        decision.set("category", decisionData.category);
        decision.set("order", decisionData.order);
        decision.set("status", "pending");
        app.save(decision);
    });

    // ========================================
    // SESSION 5 : Projet Permis Numérique
    // ========================================
    const session5 = new Record(sessionsCollection);
    session5.set("session_name", "Permis de Conduire Numérique - MVP");
    session5.set("participants", ["Emma (Chef Projet)", "Lucas (Dev Backend)", "Chloé (UX Designer)", "Antoine (Sécurité)"]);
    session5.set("status", "active");
    app.save(session5);

    const decisions5 = [
        {
            decision_text: "Architecture de sécurité et chiffrement",
            category: "technical",
            order: 1
        },
        {
            decision_text: "Choix du fournisseur d'identité numérique",
            category: "technical",
            order: 2
        },
        {
            decision_text: "Priorisation des fonctionnalités du MVP",
            category: "product",
            order: 3
        },
        {
            decision_text: "Validation des maquettes UX/UI",
            category: "product",
            order: 4
        },
        {
            decision_text: "Stratégie de déploiement progressif",
            category: "organizational",
            order: 5
        },
        {
            decision_text: "Gestion des incidents de sécurité",
            category: "technical",
            order: 6
        },
        {
            decision_text: "Communication avec les partenaires institutionnels",
            category: "other",
            order: 7
        },
        {
            decision_text: "Organisation des sprints et rétrospectives",
            category: "team",
            order: 8
        },
        {
            decision_text: "Conformité RGPD et protection des données",
            category: "other",
            order: 9
        }
    ];

    decisions5.forEach(decisionData => {
        const decision = new Record(decisionsCollection);
        decision.set("session_id", session5.id);
        decision.set("decision_text", decisionData.decision_text);
        decision.set("category", decisionData.category);
        decision.set("order", decisionData.order);
        decision.set("status", "pending");
        app.save(decision);
    });

    return null;
}, (app) => {
    // Rollback : Supprimer toutes les sessions exemples et leurs décisions (cascade delete)
    const sessionNames = [
        "Équipe Produit - Sprint Planning",
        "Service RH - Processus de Recrutement",
        "Service Urgences - Protocoles de Soins",
        "Unité Tactique - Préparation Mission",
        "Permis de Conduire Numérique - MVP"
    ];

    sessionNames.forEach(sessionName => {
        const sessions = app.findRecordsByFilter(
            "tools_delegation_poker_sessions",
            "session_name = '" + sessionName + "'",
            "-created",
            1
        );

        if (sessions.length > 0) {
            app.delete(sessions[0]);
        }
    });

    return null;
});
