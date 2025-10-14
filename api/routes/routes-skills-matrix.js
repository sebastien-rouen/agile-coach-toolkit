/**
 * Skills Matrix - Routes API
 * Gestion du partage et collaboration en temps réel
 */

require("dotenv").config();
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Répertoire de stockage des données partagées
const DATA_DIR = process.env.SKILLS_MATRIX_DATA_DIR || path.join(__dirname, '../../tools/skills-matrix/data');

// Durée de conservation : 48h
const RETENTION_HOURS = 48;

// Taille maximale des données (5MB)
const MAX_DATA_SIZE = 5 * 1024 * 1024;

/**
 * Valider le format d'un sessionId
 * Format attendu: YYYYMMDD-xxxxxxxx (8 caractères hex)
 */
function isValidSessionId(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
        return false;
    }
    // Format: 20250114-a1b2c3d4
    const pattern = /^\d{8}-[a-f0-9]{8}$/;
    return pattern.test(sessionId);
}

/**
 * Valider les données de la matrice
 */
function validateMatrixData(matrixData) {
    if (!matrixData || typeof matrixData !== 'object') {
        return { valid: false, error: 'Format de données invalide' };
    }

    // Vérifier la taille des données
    const dataSize = JSON.stringify(matrixData).length;
    if (dataSize > MAX_DATA_SIZE) {
        return { valid: false, error: 'Données trop volumineuses (max 5MB)' };
    }

    // Validation basique de la structure
    if (!matrixData.members || !Array.isArray(matrixData.members)) {
        return { valid: false, error: 'Structure invalide: members requis' };
    }

    if (!matrixData.skills || !Array.isArray(matrixData.skills)) {
        return { valid: false, error: 'Structure invalide: skills requis' };
    }

    return { valid: true };
}

/**
 * Générer un ID unique pour une session partagée
 */
function generateSessionId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = crypto.randomBytes(4).toString('hex');
    return `${date}-${random}`;
}

/**
 * Nettoyer les fichiers expirés (> 48h)
 */
async function cleanExpiredFiles(logger) {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const files = await fs.readdir(DATA_DIR);
        const now = Date.now();
        const maxAge = RETENTION_HOURS * 60 * 60 * 1000;
        let deletedCount = 0;

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(DATA_DIR, file);
                const stats = await fs.stat(filePath);
                const age = now - stats.mtimeMs;

                if (age > maxAge) {
                    await fs.unlink(filePath);
                    deletedCount++;
                    if (logger) {
                        logger.info(`Fichier expiré supprimé: ${file}`, { age: Math.round(age / 3600000) + 'h' });
                    }
                }
            }
        }

        if (deletedCount > 0 && logger) {
            logger.info(`Nettoyage terminé: ${deletedCount} fichier(s) supprimé(s)`);
        }
    } catch (error) {
        if (logger) {
            logger.error('Erreur lors du nettoyage des fichiers expirés', { error: error.message });
        }
    }
}

// Nettoyer les fichiers expirés toutes les heures
setInterval(() => cleanExpiredFiles(), 60 * 60 * 1000);
cleanExpiredFiles(); // Nettoyage initial

/**
 * POST /api/skills-matrix/share
 * Créer une nouvelle session partagée
 */
router.post('/share', async (req, res) => {
    const logger = req.siteLogger;
    const startTime = Date.now();

    try {
        const { matrixData } = req.body;

        // Validation des données
        const validation = validateMatrixData(matrixData);
        if (!validation.valid) {
            logger.warn('Validation échouée lors de la création de session', { error: validation.error });
            return res.status(400).json({ error: validation.error });
        }

        const sessionId = generateSessionId();
        const filePath = path.join(DATA_DIR, `${sessionId}.json`);

        const sessionData = {
            id: sessionId,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + RETENTION_HOURS * 60 * 60 * 1000).toISOString(),
            data: matrixData,
            lastModified: new Date().toISOString()
        };

        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2));

        logger.info('Session créée avec succès', {
            sessionId,
            membersCount: matrixData.members?.length,
            skillsCount: matrixData.skills?.length
        });

        const responseTime = Date.now() - startTime;
        logger.logRequest(req, res, responseTime);

        res.json({
            success: true,
            sessionId,
            shareUrl: `/tools/skills-matrix/?session=${sessionId}`,
            expiresAt: sessionData.expiresAt
        });
    } catch (error) {
        logger.logError(error, { operation: 'createSession' });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/skills-matrix/session/:sessionId
 * Récupérer les données d'une session
 */
router.get('/session/:sessionId', async (req, res) => {
    const logger = req.siteLogger;
    const startTime = Date.now();

    try {
        const { sessionId } = req.params;

        // Validation du sessionId pour éviter path traversal
        if (!isValidSessionId(sessionId)) {
            logger.warn('SessionId invalide détecté', { sessionId });
            return res.status(400).json({ error: 'Identifiant de session invalide' });
        }

        const filePath = path.join(DATA_DIR, `${sessionId}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const sessionData = JSON.parse(data);

            // Vérifier l'expiration
            const expiresAt = new Date(sessionData.expiresAt);
            if (expiresAt < new Date()) {
                await fs.unlink(filePath);
                logger.info('Session expirée supprimée', { sessionId });
                return res.status(410).json({ error: 'Session expirée' });
            }

            logger.info('Session récupérée avec succès', { sessionId });

            const responseTime = Date.now() - startTime;
            logger.logRequest(req, res, responseTime);

            res.json({
                success: true,
                data: sessionData.data,
                createdAt: sessionData.createdAt,
                expiresAt: sessionData.expiresAt,
                lastModified: sessionData.lastModified
            });
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.warn('Session introuvable', { sessionId });
                return res.status(404).json({ error: 'Session introuvable' });
            }
            throw error;
        }
    } catch (error) {
        logger.logError(error, { operation: 'getSession', sessionId: req.params.sessionId });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * PUT /api/skills-matrix/session/:sessionId
 * Mettre à jour les données d'une session
 */
router.put('/session/:sessionId', async (req, res) => {
    const logger = req.siteLogger;
    const startTime = Date.now();

    try {
        const { sessionId } = req.params;
        const { matrixData } = req.body;

        // Validation du sessionId
        if (!isValidSessionId(sessionId)) {
            logger.warn('SessionId invalide lors de la mise à jour', { sessionId });
            return res.status(400).json({ error: 'Identifiant de session invalide' });
        }

        // Validation des données
        const validation = validateMatrixData(matrixData);
        if (!validation.valid) {
            logger.warn('Validation échouée lors de la mise à jour', { error: validation.error });
            return res.status(400).json({ error: validation.error });
        }

        const filePath = path.join(DATA_DIR, `${sessionId}.json`);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            const sessionData = JSON.parse(data);

            // Vérifier l'expiration
            const expiresAt = new Date(sessionData.expiresAt);
            if (expiresAt < new Date()) {
                await fs.unlink(filePath);
                logger.info('Session expirée lors de la mise à jour', { sessionId });
                return res.status(410).json({ error: 'Session expirée' });
            }

            // Mettre à jour les données
            sessionData.data = matrixData;
            sessionData.lastModified = new Date().toISOString();

            await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2));

            logger.info('Session mise à jour avec succès', { sessionId });

            const responseTime = Date.now() - startTime;
            logger.logRequest(req, res, responseTime);

            res.json({
                success: true,
                lastModified: sessionData.lastModified
            });
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.warn('Session introuvable lors de la mise à jour', { sessionId });
                return res.status(404).json({ error: 'Session introuvable' });
            }
            throw error;
        }
    } catch (error) {
        logger.logError(error, { operation: 'updateSession', sessionId: req.params.sessionId });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * DELETE /api/skills-matrix/session/:sessionId
 * Supprimer une session
 */
router.delete('/session/:sessionId', async (req, res) => {
    const logger = req.siteLogger;
    const startTime = Date.now();

    try {
        const { sessionId } = req.params;

        // Validation du sessionId
        if (!isValidSessionId(sessionId)) {
            logger.warn('SessionId invalide lors de la suppression', { sessionId });
            return res.status(400).json({ error: 'Identifiant de session invalide' });
        }

        const filePath = path.join(DATA_DIR, `${sessionId}.json`);

        try {
            await fs.unlink(filePath);
            logger.info('Session supprimée avec succès', { sessionId });

            const responseTime = Date.now() - startTime;
            logger.logRequest(req, res, responseTime);

            res.json({ success: true });
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.warn('Session introuvable lors de la suppression', { sessionId });
                return res.status(404).json({ error: 'Session introuvable' });
            }
            throw error;
        }
    } catch (error) {
        logger.logError(error, { operation: 'deleteSession', sessionId: req.params.sessionId });
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
