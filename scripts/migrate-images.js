#!/usr/bin/env node

/**
 * Script de migration des images
 * Déplace les images de assets/images/* vers uploads/{category}_{content}_{timestamp}.{ext}
 * Met à jour les liens dans les fichiers markdown
 */

const fs = require("fs").promises;
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "../content");
const ASSETS_IMAGES_DIR = path.join(__dirname, "../assets/images");
const UPLOADS_DIR = path.join(__dirname, "../uploads");

async function migrateImages() {
    console.log("🚀 Début de la migration des images...\n");

    const results = {
        moved: [],
        updated: [],
        errors: []
    };

    try {
        // Créer le dossier uploads s'il n'existe pas
        await fs.mkdir(UPLOADS_DIR, { recursive: true });

        // Lire toutes les catégories
        const categories = await fs.readdir(CONTENT_DIR);

        for (const category of categories) {
            const categoryPath = path.join(CONTENT_DIR, category);
            const stat = await fs.stat(categoryPath);

            if (!stat.isDirectory()) continue;

            console.log(`📁 Traitement de la catégorie: ${category}`);

            const files = await fs.readdir(categoryPath);

            for (const file of files) {
                if (!file.endsWith(".md")) continue;

                const filePath = path.join(categoryPath, file);
                let content = await fs.readFile(filePath, "utf-8");
                let modified = false;
                let imageCount = 0;

                // Trouver tous les liens vers assets/images
                // Patterns: ![alt](assets/images/...) ou ![alt](../../assets/images/...)
                const imageRegex = /!\[([^\]]*)\]\((\.\.\/)*assets\/images\/([^)]+)\)/g;
                const matches = [...content.matchAll(imageRegex)];

                for (const match of matches) {
                    const fullMatch = match[0];
                    const altText = match[1];
                    const imagePath = match[3];

                    const oldImagePath = path.join(ASSETS_IMAGES_DIR, imagePath);

                    try {
                        // Vérifier si l'image existe
                        await fs.access(oldImagePath);

                        // Créer le nouveau nom
                        const ext = path.extname(imagePath);
                        const contentId = file.replace(".md", "");
                        const timestamp = Date.now() + imageCount; // Éviter les collisions
                        const newFilename = `${category}_${contentId}_${timestamp}${ext}`;

                        // Copier l'image
                        const newImagePath = path.join(UPLOADS_DIR, newFilename);
                        await fs.copyFile(oldImagePath, newImagePath);

                        // Mettre à jour le contenu markdown
                        const newMarkdownLink = `![${altText}](/uploads/${newFilename})`;
                        content = content.replace(fullMatch, newMarkdownLink);
                        modified = true;
                        imageCount++;

                        results.moved.push({
                            from: imagePath,
                            to: newFilename,
                            category,
                            content: contentId
                        });

                        console.log(`  ✅ ${imagePath} → ${newFilename}`);
                    } catch (err) {
                        results.errors.push({
                            image: imagePath,
                            file: `${category}/${file}`,
                            error: err.message
                        });
                        console.log(`  ❌ Erreur: ${imagePath} - ${err.message}`);
                    }
                }

                // Sauvegarder le fichier markdown modifié
                if (modified) {
                    await fs.writeFile(filePath, content, "utf-8");
                    results.updated.push({
                        file: `${category}/${file}`,
                        images: imageCount
                    });
                    console.log(`  📝 Fichier mis à jour: ${file} (${imageCount} images)`);
                }
            }

            console.log("");
        }

        // Afficher le résumé
        console.log("📊 Résumé de la migration:");
        console.log(`  ✅ Images déplacées: ${results.moved.length}`);
        console.log(`  📝 Fichiers mis à jour: ${results.updated.length}`);
        console.log(`  ❌ Erreurs: ${results.errors.length}`);

        if (results.errors.length > 0) {
            console.log("\n⚠️  Erreurs détectées:");
            results.errors.forEach(err => {
                console.log(`  - ${err.file}: ${err.image} (${err.error})`);
            });
        }

        // Sauvegarder le rapport
        const reportPath = path.join(__dirname, "../migration-report.json");
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);

        console.log("\n✨ Migration terminée!");
    } catch (error) {
        console.error("❌ Erreur fatale:", error);
        process.exit(1);
    }
}

// Exécuter la migration
migrateImages();
