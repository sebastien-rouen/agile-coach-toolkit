/**
 * Velocity Squad - Routes API
 * Gestion des Program Increments (PI) via PocketBase
 */

const express = require('express');
const router = express.Router();

// Noms des collections PocketBase
const COLLECTIONS = {
    PI: 'tools_velocity_squad_pi',
    SESSIONS: 'tools_velocity_squad_sessions',
    SPRINTS: 'tools_velocity_squad_sprints'
};

/**
 * POST /api/velocity-squad/pi
 * Créer un nouveau Program Increment
 */
router.post('/pi', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { session, name, startDate, endDate, location, comment, sprints } = req.body;

        // Validation
        if (!session || !name || !startDate || !endDate) {
            logger.warn('Paramètres manquants pour création PI', { body: req.body });
            return res.status(400).json({ 
                error: 'Les champs session, name, startDate et endDate sont requis' 
            });
        }

        // Vérifier que la date de fin est après la date de début
        if (new Date(startDate) >= new Date(endDate)) {
            logger.warn('Dates invalides pour PI', { startDate, endDate });
            return res.status(400).json({ 
                error: 'La date de fin doit être après la date de début' 
            });
        }

        // Créer le PI
        const piData = {
            session,
            name,
            startDate,
            endDate,
            location: location || '',
            comment: comment || '',
            sprints: sprints || []
        };

        const pi = await pb.collection(COLLECTIONS.PI).create(piData);

        logger.info('PI créé avec succès', { piId: pi.id, name: pi.name });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.status(201).json({
            success: true,
            pi
        });
    } catch (error) {
        logger.logError(error, { operation: 'createPI', body: req.body });
        res.status(500).json({ error: 'Erreur lors de la création du PI' });
    }
});

/**
 * GET /api/velocity-squad/pi/:sessionId
 * Récupérer tous les PIs d'une session
 */
router.get('/pi/:sessionId', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { sessionId } = req.params;

        const pis = await pb.collection(COLLECTIONS.PI).getFullList({
            filter: `session = "${sessionId}"`,
            sort: 'startDate'
        });

        logger.info('PIs récupérés', { sessionId, count: pis.length });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            pis
        });
    } catch (error) {
        logger.logError(error, { operation: 'getPIs', sessionId: req.params.sessionId });
        res.status(500).json({ error: 'Erreur lors de la récupération des PIs' });
    }
});

/**
 * PUT /api/velocity-squad/pi/:piId
 * Mettre à jour un Program Increment
 */
router.put('/pi/:piId', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { piId } = req.params;
        const { name, startDate, endDate, location, comment, sprints } = req.body;

        // Validation
        if (!name || !startDate || !endDate) {
            logger.warn('Paramètres manquants pour mise à jour PI', { piId, body: req.body });
            return res.status(400).json({ 
                error: 'Les champs name, startDate et endDate sont requis' 
            });
        }

        // Vérifier que la date de fin est après la date de début
        if (new Date(startDate) >= new Date(endDate)) {
            logger.warn('Dates invalides pour PI', { piId, startDate, endDate });
            return res.status(400).json({ 
                error: 'La date de fin doit être après la date de début' 
            });
        }

        // Mettre à jour le PI
        const piData = {
            name,
            startDate,
            endDate,
            location: location || '',
            comment: comment || '',
            sprints: sprints || []
        };

        const pi = await pb.collection(COLLECTIONS.PI).update(piId, piData);

        logger.info('PI mis à jour', { piId, name: pi.name });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            pi
        });
    } catch (error) {
        if (error.status === 404) {
            logger.warn('PI introuvable', { piId: req.params.piId });
            return res.status(404).json({ error: 'PI introuvable' });
        }
        logger.logError(error, { operation: 'updatePI', piId: req.params.piId });
        res.status(500).json({ error: 'Erreur lors de la mise à jour du PI' });
    }
});

/**
 * DELETE /api/velocity-squad/pi/:piId
 * Supprimer un Program Increment
 */
router.delete('/pi/:piId', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { piId } = req.params;

        await pb.collection(COLLECTIONS.PI).delete(piId);

        logger.info('PI supprimé', { piId });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            message: 'PI supprimé avec succès'
        });
    } catch (error) {
        if (error.status === 404) {
            logger.warn('PI introuvable', { piId: req.params.piId });
            return res.status(404).json({ error: 'PI introuvable' });
        }
        logger.logError(error, { operation: 'deletePI', piId: req.params.piId });
        res.status(500).json({ error: 'Erreur lors de la suppression du PI' });
    }
});

module.exports = router;
