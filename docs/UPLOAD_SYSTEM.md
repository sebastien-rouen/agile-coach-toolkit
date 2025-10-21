# Système d'Upload d'Images

## 📋 Vue d'ensemble

Le système d'upload permet de gérer les images de manière centralisée dans le dossier `uploads/` avec une nomenclature cohérente et une bibliothèque visuelle dans l'interface d'administration.

## 🎯 Fonctionnalités

### 1. Upload d'Images
- Upload depuis l'éditeur de contenu
- Drag & drop supporté
- Formats acceptés: JPG, PNG, GIF, SVG, WEBP
- Taille maximale: 5 MB
- Génération automatique de miniatures (200x200px)

### 2. Nomenclature des Fichiers
Les images sont nommées selon le pattern:
```
{categoryId}_{contentId}_{timestamp}.{extension}
```

**Exemples:**
- `fondamentaux_agile-manifesto_1699876543210.png`
- `frameworks_scrum-guide_1699876543211.jpg`

### 3. Bibliothèque d'Images
- Affichage en grille avec miniatures
- Informations: nom du fichier, date, taille
- Actions: insérer, copier le chemin, supprimer
- Tri par date de modification décroissante

## 🚀 Utilisation

### Dans l'Admin

1. **Ouvrir l'éditeur de contenu**
   - Sélectionner une catégorie
   - Définir un nom de fichier

2. **Uploader une image**
   - Cliquer sur le bouton "📷 Upload" dans la toolbar
   - Sélectionner ou glisser une image
   - L'image est automatiquement insérée dans le markdown

3. **Utiliser la bibliothèque**
   - Cliquer sur le bouton "🖼️ Bibliothèque"
   - Parcourir les images existantes
   - Cliquer sur "+" pour insérer dans l'éditeur
   - Cliquer sur "📋" pour copier le chemin

### Dans le Markdown

Les images sont insérées avec le format:
```markdown
![Description de l'image](/uploads/category_content_timestamp.ext)
```

## 🔧 Migration des Images Existantes

### Script de Migration

Un script automatique permet de migrer les images depuis `assets/images/` vers `uploads/`:

```bash
node scripts/migrate-images.js
```

**Ce script:**
1. Copie les images vers `uploads/` avec la nouvelle nomenclature
2. Met à jour tous les liens dans les fichiers markdown
3. Génère un rapport de migration (`migration-report.json`)

### Via l'API

Vous pouvez aussi déclencher la migration via l'API:

```bash
curl -X POST http://localhost:3000/api/migrate-images/migrate
```

## 📁 Structure des Dossiers

```
uploads/
├── fondamentaux_agile-manifesto_1699876543210.png
├── thumb_fondamentaux_agile-manifesto_1699876543210.png
├── frameworks_scrum-guide_1699876543211.jpg
└── thumb_frameworks_scrum-guide_1699876543211.jpg
```

- Images originales: `{category}_{content}_{timestamp}.{ext}`
- Miniatures: `thumb_{category}_{content}_{timestamp}.{ext}`

## 🔌 API Endpoints

### Upload d'une Image
```http
POST /api/uploads/upload
Content-Type: multipart/form-data

{
  "image": File,
  "categoryId": "fondamentaux",
  "contentId": "agile-manifesto"
}
```

**Réponse:**
```json
{
  "success": true,
  "image": {
    "filename": "fondamentaux_agile-manifesto_1699876543210.png",
    "path": "/uploads/fondamentaux_agile-manifesto_1699876543210.png",
    "thumbnailPath": "/uploads/thumb_fondamentaux_agile-manifesto_1699876543210.png",
    "size": 245678,
    "mimetype": "image/png",
    "categoryId": "fondamentaux",
    "contentId": "agile-manifesto",
    "uploadedAt": "2024-11-13T10:30:00.000Z"
  }
}
```

### Liste des Images
```http
GET /api/uploads/list
```

**Réponse:**
```json
{
  "images": [
    {
      "filename": "fondamentaux_agile-manifesto_1699876543210.png",
      "path": "/uploads/fondamentaux_agile-manifesto_1699876543210.png",
      "thumbnailPath": "/uploads/thumb_fondamentaux_agile-manifesto_1699876543210.png",
      "size": 245678,
      "categoryId": "fondamentaux",
      "contentId": "agile-manifesto",
      "uploadedAt": "2024-11-13T10:30:00.000Z",
      "modifiedAt": "2024-11-13T10:30:00.000Z"
    }
  ]
}
```

### Supprimer une Image
```http
DELETE /api/uploads/{filename}
```

**Réponse:**
```json
{
  "success": true
}
```

## 🛠️ Configuration

### Dépendances NPM

```json
{
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.33.0"
}
```

### Installation

```bash
npm install multer sharp
```

### Limites

- **Taille maximale**: 5 MB par fichier
- **Formats acceptés**: JPEG, JPG, PNG, GIF, SVG, WEBP
- **Miniatures**: 200x200px (cover fit)

## 🔒 Sécurité

- Validation des types MIME
- Validation des extensions
- Limite de taille de fichier
- Noms de fichiers sécurisés (pas d'injection)
- Stockage hors du dossier web public

## 📝 Bonnes Pratiques

1. **Toujours définir une catégorie et un contentId** avant d'uploader
2. **Utiliser des descriptions alt** pertinentes dans le markdown
3. **Optimiser les images** avant upload (compression, dimensions)
4. **Nettoyer régulièrement** les images non utilisées
5. **Sauvegarder le dossier uploads** dans vos backups

## 🐛 Dépannage

### L'upload échoue
- Vérifier que le dossier `uploads/` existe et est accessible en écriture
- Vérifier la taille du fichier (< 5 MB)
- Vérifier le format du fichier

### Les miniatures ne s'affichent pas
- Vérifier que Sharp est correctement installé: `npm install sharp`
- Vérifier les permissions du dossier `uploads/`

### Les images ne s'affichent pas dans le contenu
- Vérifier que le chemin commence par `/uploads/`
- Vérifier que le serveur sert correctement le dossier `uploads/`

## 📚 Ressources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [MDN - File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
