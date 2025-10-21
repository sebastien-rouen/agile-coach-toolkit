const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");

// Charger la configuration
let config = null;
const loadConfig = async (logger) => {
    if (!config) {
        try {
            const configPath = path.join("/sites/drafts/agile/config/config.json");
            const configData = await fs.readFile(configPath, "utf-8");
            config = JSON.parse(configData);
            if (logger) {
                console.log("Dossier actuel:", process.cwd());
                logger.info("Configuration chargée", { 
                    configPath,
                    currentDir: process.cwd(),
                    maxFileSize: config.upload.maxFileSize,
                    allowedExtensions: config.upload.allowedExtensions 
                });
            }
        } catch (error) {
            if (logger) {
                logger.warn("Config non trouvée, utilisation des valeurs par défaut", { 
                    error: error.message 
                });
            }
            // Configuration par défaut
            config = {
                upload: {
                    maxFileSize: 5242880,
                    allowedExtensions: ["jpg", "jpeg", "png", "gif", "svg", "webp"],
                    thumbnailSize: 200
                }
            };
        }
    }
    return config;
};

// Configuration du stockage multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join("./uploads");
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const { categoryId, contentId } = req.body;
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const filename = `${categoryId}_${contentId}_${timestamp}${ext}`;
        cb(null, filename);
    }
});

// Créer l'upload multer avec configuration dynamique
const createUpload = async () => {
    const cfg = await loadConfig();
    
    return multer({
        storage,
        limits: { fileSize: cfg.upload.maxFileSize },
        fileFilter: (req, file, cb) => {
            const allowedExts = cfg.upload.allowedExtensions.join("|");
            const allowedTypes = new RegExp(allowedExts);
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase().replace(".", ""));
            const mimetype = file.mimetype.startsWith("image/");
            
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error(`Seules les images sont autorisées (${allowedExts})`));
        }
    });
};

// Upload d'une image
router.post("/upload", async (req, res) => {
    const logger = req.siteLogger || console;
    
    try {
        logger.info("=== Début upload ===");
        logger.info("Body reçu:", { body: req.body });
        
        // Charger la config et créer l'upload
        const cfg = await loadConfig(logger);
        const upload = await createUpload();
        
        logger.info("Multer configuré, traitement du fichier...");
        
        // Utiliser multer
        upload.single("image")(req, res, async (err) => {
            if (err) {
                logger.error("Erreur upload multer", { error: err.message });
                return res.status(400).json({ error: err.message });
            }
            
            logger.info("Multer terminé", { 
                hasFile: !!req.file,
                body: req.body 
            });
            
            if (!req.file) {
                logger.error("Aucun fichier reçu par multer");
                return res.status(400).json({ error: "Aucun fichier fourni" });
            }

            const { categoryId, contentId } = req.body;
            
            logger.info("=== Données reçues ===", { 
                categoryId, 
                contentId,
                filename: req.file.filename,
                originalname: req.file.originalname
            });
            
            // Validation de présence
            if (!categoryId || !contentId) {
                logger.warn("Upload refusé: paramètres manquants", { categoryId, contentId });
                return res.status(400).json({ 
                    error: "categoryId et contentId sont requis" 
                });
            }

            // 🔒 SÉCURITÉ: Validation stricte du format (éviter path traversal)
            const validIdPattern = /^[a-z0-9-]+$/;
            if (!validIdPattern.test(categoryId) || !validIdPattern.test(contentId)) {
                logger.warn("Upload refusé: format invalide", { 
                    categoryId, 
                    contentId,
                    ip: req.ip 
                });
                return res.status(400).json({ 
                    error: "Format de catégorie/contenu invalide (a-z, 0-9, - uniquement)" 
                });
            }

            // 🔒 SÉCURITÉ: Limiter la longueur
            if (categoryId.length > 50 || contentId.length > 100) {
                logger.warn("Upload refusé: longueur excessive", { 
                    categoryId: categoryId.length, 
                    contentId: contentId.length 
                });
                return res.status(400).json({ 
                    error: "Catégorie ou contenu trop long" 
                });
            }

            // Créer une miniature
            const thumbnailSize = cfg.upload.thumbnailSize;
            const thumbnailPath = path.join(
                path.dirname(req.file.path),
                `thumb_${req.file.filename}`
            );

            await sharp(req.file.path)
                .resize(thumbnailSize, thumbnailSize, { fit: "cover" })
                .toFile(thumbnailPath);

            const imageData = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: `/uploads/${req.file.filename}`,
                thumbnailPath: `/uploads/thumb_${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype,
                categoryId,
                contentId,
                uploadedAt: new Date().toISOString()
            };

            logger.info("Image uploadée avec succès", { imageData });

            res.json({
                success: true,
                image: imageData
            });
        });
    } catch (error) {
        logger.error("Erreur lors de l'upload", { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// Liste des images
router.get("/list", async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const uploadDir = path.join("./uploads");
        
        // Créer le dossier s'il n'existe pas
        await fs.mkdir(uploadDir, { recursive: true });
        
        const files = await fs.readdir(uploadDir);
        
        logger.info(`${files.length} fichiers trouvés dans uploads/`, { files });
        
        // Filtrer les miniatures et récupérer les infos
        const images = await Promise.all(
            files
                .filter(file => !file.startsWith("thumb_"))
                .map(async (file) => {
                    const filePath = path.join(uploadDir, file);
                    const stats = await fs.stat(filePath);
                    
                    // Parser le nom du fichier
                    const match = file.match(/^(.+?)_(.+?)_(\d+)(\..+)$/);
                    
                    return {
                        filename: file,
                        path: `/uploads/${file}`,
                        thumbnailPath: `/uploads/thumb_${file}`,
                        size: stats.size,
                        categoryId: match ? match[1] : null,
                        contentId: match ? match[2] : null,
                        uploadedAt: stats.mtime.toISOString(),
                        modifiedAt: stats.mtime.toISOString()
                    };
                })
        );

        // Trier par date de modification décroissante
        images.sort((a, b) => 
            new Date(b.modifiedAt) - new Date(a.modifiedAt)
        );

        res.json({ images });
    } catch (error) {
        logger.error("Erreur lors de la récupération des images", { 
            error: error.message 
        });
        res.status(500).json({ error: error.message });
    }
});

// Supprimer une image
router.delete("/:filename", async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const { filename } = req.params;
        const uploadDir = path.join("./uploads");
        
        const imagePath = path.join(uploadDir, filename);
        const thumbnailPath = path.join(uploadDir, `thumb_${filename}`);

        // Supprimer l'image et sa miniature
        await fs.unlink(imagePath);
        
        try {
            await fs.unlink(thumbnailPath);
        } catch (err) {
            // Ignorer si la miniature n'existe pas
        }

        logger.info("Image supprimée", { filename });

        res.json({ success: true });
    } catch (error) {
        logger.error("Erreur lors de la suppression", { 
            error: error.message 
        });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
