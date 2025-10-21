/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration : Mettre toutes les collections Velocity Squad en accès public
 * 
 * Cette migration configure les règles d'accès pour permettre :
 * - Lecture publique (listRule et viewRule vides)
 * - Création publique (createRule vide)
 * - Modification publique (updateRule vide)
 * - Suppression publique (deleteRule vide)
 * 
 * Collections concernées :
 * - tools_velocity_squad_sessions
 * - tools_velocity_squad_sprints
 * - tools_velocity_squad_team
 * - tools_velocity_squad_annotations
 * - tools_velocity_squad_mood
 * - tools_velocity_squad_events
 * 
 * Note: Utilise SQL directement car app.dao().saveCollection() ne fonctionne pas
 * toujours correctement dans les migrations pour modifier les règles d'accès.
 */

migrate((app) => {
    // Utiliser une requête SQL directe pour modifier les règles
    const sql = `
        UPDATE _collections 
        SET listRule = '', 
            viewRule = '', 
            createRule = '', 
            updateRule = '', 
            deleteRule = '' 
        WHERE name LIKE 'tools_velocity_squad_%'
    `;

    try {
        app.db().newQuery(sql).execute();
        console.log('✅ Migration terminée : toutes les collections Velocity Squad sont en accès public');
    } catch (e) {
        console.log('⚠️ Erreur lors de la migration:', e.message);
    }

    return null;
}, (app) => {
    // Rollback : remettre les règles avec authentification
    const sql = `
        UPDATE _collections 
        SET listRule = '@request.auth.id != ''''', 
            viewRule = '@request.auth.id != ''''', 
            createRule = '@request.auth.id != ''''', 
            updateRule = '@request.auth.id != ''''', 
            deleteRule = '@request.auth.id != ''''' 
        WHERE name LIKE 'tools_velocity_squad_%'
    `;

    try {
        app.db().newQuery(sql).execute();
        console.log('✅ Rollback terminé : authentification requise pour toutes les collections Velocity Squad');
    } catch (e) {
        console.log('⚠️ Erreur lors du rollback:', e.message);
    }

    return null;
});
