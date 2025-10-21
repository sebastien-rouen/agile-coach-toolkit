/**
 * Skills Matrix - Routes API
 * Gestion des matrices de compétences via PocketBase
 */

const express = require('express');
const router = express.Router();

// Nom de la collection PocketBase
const COLLECTION_NAME = 'tools_skills_matrix_matrices';



/**
 * PUT /api/skills-matrix/:matrixId/keep-data
 * Mettre à jour le statut keepData d'une matrice
 */
router.put('/:matrixId/keep-data', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { matrixId } = req.params;
        const { keepData } = req.body;

        if (typeof keepData !== 'boolean') {
            logger.warn('Paramètre keepData invalide', { keepData });
            return res.status(400).json({ error: 'Le paramètre keepData doit être un booléen' });
        }

        await pb.collection(COLLECTION_NAME).update(matrixId, { keepData });

        logger.info('KeepData mis à jour', { matrixId, keepData });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            matrixId,
            keepData
        });
    } catch (error) {
        if (error.status === 404) {
            logger.warn('Matrice introuvable', { matrixId: req.params.matrixId });
            return res.status(404).json({ error: 'Matrice introuvable' });
        }
        logger.logError(error, { operation: 'updateKeepData', matrixId: req.params.matrixId });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/skills-matrix/:matrixId
 * Récupérer une matrice
 */
router.get('/:matrixId', async (req, res) => {
    const logger = req.siteLogger;
    const pb = req.pb;
    const startTime = Date.now();

    try {
        const { matrixId } = req.params;

        const matrix = await pb.collection(COLLECTION_NAME).getOne(matrixId);

        logger.info('Matrice récupérée', { matrixId });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            matrix
        });
    } catch (error) {
        if (error.status === 404) {
            logger.warn('Matrice introuvable', { matrixId: req.params.matrixId });
            return res.status(404).json({ error: 'Matrice introuvable' });
        }
        logger.logError(error, { operation: 'getMatrix', matrixId: req.params.matrixId });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});





module.exports = router;
