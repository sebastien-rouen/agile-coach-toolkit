const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;

/**
 * Script de migration des images
 * Déplace les images de assets/images/* vers uploads/{category}_{content}.{ext}
 * Met à jour les liens dans les fichiers markdown
 */
router.post("/migrate", async (req, res) => {
    const logger = req.siteLogger;
    
    try {
        const results = {
            moved: [],
            updated: [],
            errors: []
        };

        // Lire tous les fichiers markdown
        const contentDir = path.join(__dirname, "../../content");
        const categories = await fs.readdir(contentDir);

        for (const category of categories) {
            const categoryPath = path.join(contentDir, category);
            const stat = await fs.stat(categoryPath);
            
            if (!stat.isDirectory()) continue;

            const files = await fs.readdir(categoryPath);
            
            for (const file of files) {
                if (!file.endsWith(".md")) continue;

                const filePath = path.join(categoryPath, file);
                let content = await fs.readFile(filePath, "utf-8");
                let modified = false;

                // Trouver tous les liens vers assets/images
                const imageRegex = /!\[([^\]]*)\]\((\.\.\/)*assets\/images\/([^)]+)\)/g;
                const matches = [...content.matchAll(imageRegex)];

                for (const match of matches) {
                    const fullMatch = match[0];
                    const altText = match[1];
                    const imagePath = match[3];
                    
                    const oldImagePath = path.join(
                        __dirname, 
                        "../../assets/images", 
                        imagePath
                    );

                    try {
                        // Vérifier si l'image existe
                        await fs.access(oldImagePath);

                        // Créer le nouveau nom
                        const ext = path.extname(imagePath);
                        const contentId = file.replace(".md", "");
                        const timestamp = Date.now();
                        const newFilename = `${category}_${contentId}_${timestamp}${ext}`;

                        // Créer le dossier uploads
                        const uploadsDir = path.join(__dirname, "../../uploads");
                        await fs.mkdir(uploadsDir, { recursive: true });

                        // Copier l'image
                        const newImagePath = path.join(uploadsDir, newFilename);
                        await fs.copyFile(oldImagePath, newImagePath);

                        // Mettre à jour le contenu markdown
                        const newMarkdownLink = `![${altText}](/uploads/${newFilename})`;
                        content = content.replace(fullMatch, newMarkdownLink);
                        modified = true;

                        results.moved.push({
                            from: imagePath,
                            to: newFilename,
                            category,
                            content: contentId
                        });

                        logger.info("Image migrée", {
                            from: imagePath,
                            to: newFilename
                        });
                    } catch (err) {
                        results.errors.push({
                            image: imagePath,
                            error: err.message
                        });
                    }
                }

                // Sauvegarder le fichier markdown modifié
                if (modified) {
                    await fs.writeFile(filePath, content, "utf-8");
                    results.updated.push({
                        file: `${category}/${file}`,
                        images: matches.length
                    });
                }
            }
        }

        logger.info("Migration terminée", { results });

        res.json({
            success: true,
            results
        });
    } catch (error) {
        logger.error("Erreur lors de la migration", { 
            error: error.message 
        });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
