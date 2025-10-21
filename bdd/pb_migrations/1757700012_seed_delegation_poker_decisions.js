/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Seed des décisions pour Delegation Poker
 * Crée les décisions pour chaque session
 */
migrate((app) => {
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const decisionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_decisions");
    
    // Récupérer les sessions par leur nom
    const sessionProduct = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Équipe Produit - Sprint Planning'");
    const sessionRH = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Service RH - Processus de Recrutement'");
    const sessionMedical = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Service Urgences - Protocoles de Soins'");
    const sessionMilitary = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Unité Tactique - Préparation Mission'");
    const sessionDigital = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = 'Permis de Conduire Numérique - MVP'");
    
    // Décisions pour Équipe Produit
    if (sessionProduct) {
        const decisions1 = [
            { text: "Choix des technologies pour un nouveau composant", category: "technical", order: 1 },
            { text: "Priorisation des user stories", category: "product", order: 2 },
            { text: "Organisation des horaires de travail", category: "organizational", order: 3 },
            { text: "Définition des rôles dans l'équipe", category: "team", order: 4 },
            { text: "Budget alloué aux formations", category: "other", order: 5 }
        ];
        
        decisions1.forEach(d => {
            const record = new Record(decisionsCollection);
            record.set("session_id", sessionProduct.id);
            record.set("decision_text", d.text);
            record.set("category", d.category);
            record.set("order", d.order);
            record.set("status", "pending");
            app.save(record);
        });
    }
    
    // Décisions pour Service RH
    if (sessionRH) {
        const decisions2 = [
            { text: "Validation finale des candidatures", category: "organizational", order: 1 },
            { text: "Définition des grilles salariales", category: "other", order: 2 },
            { text: "Choix des outils de sourcing", category: "technical", order: 3 },
            { text: "Organisation des entretiens techniques", category: "organizational", order: 4 },
            { text: "Décision d'embauche immédiate", category: "team", order: 5 },
            { text: "Négociation des avantages sociaux", category: "other", order: 6 }
        ];
        
        decisions2.forEach(d => {
            const record = new Record(decisionsCollection);
            record.set("session_id", sessionRH.id);
            record.set("decision_text", d.text);
            record.set("category", d.category);
            record.set("order", d.order);
            record.set("status", "pending");
            app.save(record);
        });
    }
    
    // Décisions pour Service Urgences
    if (sessionMedical) {
        const decisions3 = [
            { text: "Prescription de médicaments hors AMM", category: "other", order: 1 },
            { text: "Triage des patients en cas d'affluence", category: "organizational", order: 2 },
            { text: "Demande d'examens complémentaires urgents", category: "technical", order: 3 },
            { text: "Transfert vers un service spécialisé", category: "organizational", order: 4 },
            { text: "Gestion des stocks de matériel médical", category: "other", order: 5 },
            { text: "Organisation des gardes et astreintes", category: "team", order: 6 },
            { text: "Protocole de réanimation d'urgence", category: "technical", order: 7 }
        ];
        
        decisions3.forEach(d => {
            const record = new Record(decisionsCollection);
            record.set("session_id", sessionMedical.id);
            record.set("decision_text", d.text);
            record.set("category", d.category);
            record.set("order", d.order);
            record.set("status", "completed");
            app.save(record);
        });
    }
    
    // Décisions pour Unité Tactique
    if (sessionMilitary) {
        const decisions4 = [
            { text: "Engagement au combat en situation critique", category: "other", order: 1 },
            { text: "Choix de l'itinéraire de patrouille", category: "organizational", order: 2 },
            { text: "Utilisation de l'équipement de communication", category: "technical", order: 3 },
            { text: "Répartition des rôles dans l'escouade", category: "team", order: 4 },
            { text: "Demande de soutien aérien", category: "other", order: 5 },
            { text: "Gestion des permissions et repos", category: "organizational", order: 6 },
            { text: "Maintenance préventive du matériel", category: "technical", order: 7 },
            { text: "Protocole d'évacuation sanitaire", category: "organizational", order: 8 }
        ];
        
        decisions4.forEach(d => {
            const record = new Record(decisionsCollection);
            record.set("session_id", sessionMilitary.id);
            record.set("decision_text", d.text);
            record.set("category", d.category);
            record.set("order", d.order);
            record.set("status", "pending");
            app.save(record);
        });
    }
    
    // Décisions pour Permis Numérique
    if (sessionDigital) {
        const decisions5 = [
            { text: "Architecture de sécurité et chiffrement", category: "technical", order: 1 },
            { text: "Choix du fournisseur d'identité numérique", category: "technical", order: 2 },
            { text: "Priorisation des fonctionnalités du MVP", category: "product", order: 3 },
            { text: "Validation des maquettes UX/UI", category: "product", order: 4 },
            { text: "Stratégie de déploiement progressif", category: "organizational", order: 5 },
            { text: "Gestion des incidents de sécurité", category: "technical", order: 6 },
            { text: "Communication avec les partenaires institutionnels", category: "other", order: 7 },
            { text: "Organisation des sprints et rétrospectives", category: "team", order: 8 },
            { text: "Conformité RGPD et protection des données", category: "other", order: 9 }
        ];
        
        decisions5.forEach(d => {
            const record = new Record(decisionsCollection);
            record.set("session_id", sessionDigital.id);
            record.set("decision_text", d.text);
            record.set("category", d.category);
            record.set("order", d.order);
            record.set("status", "pending");
            app.save(record);
        });
    }
    
    return null;
}, (app) => {
    // Rollback : Supprimer toutes les décisions des sessions seed
    const sessionsCollection = app.findCollectionByNameOrId("tools_delegation_poker_sessions");
    const sessionNames = [
        "Équipe Produit - Sprint Planning",
        "Service RH - Processus de Recrutement",
        "Service Urgences - Protocoles de Soins",
        "Unité Tactique - Préparation Mission",
        "Permis de Conduire Numérique - MVP"
    ];
    
    sessionNames.forEach(name => {
        const session = app.findFirstRecordByFilter(sessionsCollection.id, "session_name = '" + name + "'");
        if (session) {
            const decisions = app.findRecordsByFilter(
                "tools_delegation_poker_decisions",
                "session_id = '" + session.id + "'",
                "-created",
                100
            );
            
            decisions.forEach(decision => {
                app.delete(decision);
            });
        }
    });
    
    return null;
});
