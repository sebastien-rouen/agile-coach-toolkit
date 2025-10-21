# Dossier Uploads

Ce dossier contient toutes les images uploadées via l'interface d'administration.

## Structure

- Images originales: `{category}_{content}_{timestamp}.{ext}`
- Miniatures: `thumb_{category}_{content}_{timestamp}.{ext}`

## Nomenclature

Les fichiers suivent le pattern:
```
{categoryId}_{contentId}_{timestamp}.{extension}
```

**Exemple:**
```
fondamentaux_agile-manifesto_1699876543210.png
thumb_fondamentaux_agile-manifesto_1699876543210.png
```

## Gestion

- Les images sont gérées via l'interface d'administration (`/admin`)
- La bibliothèque d'images permet de visualiser et gérer tous les uploads
- Les miniatures sont générées automatiquement lors de l'upload

## Sauvegarde

⚠️ **Important**: Ce dossier doit être inclus dans vos sauvegardes régulières.

Les images ne sont pas versionnées dans Git (voir `.gitignore`).
