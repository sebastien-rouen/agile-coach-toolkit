# Tests du Système d'Upload

## Checklist de Tests

### ✅ Installation

- [ ] Installer les dépendances : `npm install multer sharp`
- [ ] Vérifier que le dossier `uploads/` existe
- [ ] Vérifier les permissions du dossier `uploads/`
- [ ] Redémarrer l'API : `pm2 restart "drafts.api"`

### ✅ Tests API

#### Upload d'une Image

```bash
# Test avec curl
curl -X POST http://localhost:3002/api/agile/uploads/upload \
  -F "image=@test-image.png" \
  -F "categoryId=fondamentaux" \
  -F "contentId=test-content"
```

**Résultat attendu:**
```json
{
  "success": true,
  "image": {
    "filename": "fondamentaux_test-content_1699876543210.png",
    "path": "/uploads/fondamentaux_test-content_1699876543210.png",
    "thumbnailPath": "/uploads/thumb_fondamentaux_test-content_1699876543210.png",
    "size": 245678,
    "mimetype": "image/png",
    "categoryId": "fondamentaux",
    "contentId": "test-content",
    "uploadedAt": "2024-11-13T10:30:00.000Z"
  }
}
```

#### Liste des Images

```bash
curl http://localhost:3002/api/agile/uploads/list
```

**Résultat attendu:**
```json
{
  "images": [
    {
      "filename": "fondamentaux_test-content_1699876543210.png",
      "path": "/uploads/fondamentaux_test-content_1699876543210.png",
      "thumbnailPath": "/uploads/thumb_fondamentaux_test-content_1699876543210.png",
      "size": 245678,
      "categoryId": "fondamentaux",
      "contentId": "test-content",
      "uploadedAt": "2024-11-13T10:30:00.000Z",
      "modifiedAt": "2024-11-13T10:30:00.000Z"
    }
  ]
}
```

#### Suppression d'une Image

```bash
curl -X DELETE http://localhost:3002/api/agile/uploads/fondamentaux_test-content_1699876543210.png
```

**Résultat attendu:**
```json
{
  "success": true
}
```

### ✅ Tests Interface Admin

#### Accès à l'Admin
- [ ] Ouvrir `http://drafts.agile.bastou.dev/admin/`
- [ ] Naviguer vers "Contenus"
- [ ] Cliquer sur "Nouveau Contenu"

#### Upload depuis l'Éditeur
- [ ] Sélectionner une catégorie
- [ ] Définir un nom de fichier
- [ ] Cliquer sur le bouton "📷 Upload" dans la toolbar
- [ ] Sélectionner une image
- [ ] Vérifier l'aperçu
- [ ] Cliquer sur "Uploader"
- [ ] Vérifier que l'image est insérée dans le markdown

#### Drag & Drop
- [ ] Ouvrir la modale d'upload
- [ ] Glisser une image sur la zone d'upload
- [ ] Vérifier l'aperçu
- [ ] Uploader l'image

#### Bibliothèque d'Images
- [ ] Cliquer sur le bouton "🖼️ Bibliothèque"
- [ ] Vérifier l'affichage des miniatures
- [ ] Vérifier les métadonnées (nom, date, taille)
- [ ] Cliquer sur "+" pour insérer une image
- [ ] Vérifier l'insertion dans l'éditeur
- [ ] Cliquer sur "📋" pour copier le chemin
- [ ] Vérifier le presse-papier
- [ ] Cliquer sur "🗑️" pour supprimer
- [ ] Confirmer la suppression
- [ ] Vérifier que l'image disparaît

### ✅ Tests de Validation

#### Taille de Fichier
- [ ] Tenter d'uploader une image > 5 MB
- [ ] Vérifier le message d'erreur

#### Type de Fichier
- [ ] Tenter d'uploader un fichier non-image (PDF, TXT)
- [ ] Vérifier le message d'erreur

#### Formats Supportés
- [ ] Uploader une image JPG
- [ ] Uploader une image PNG
- [ ] Uploader une image GIF
- [ ] Uploader une image SVG
- [ ] Uploader une image WEBP

### ✅ Tests de Migration

#### Migration Automatique
```bash
node scripts/migrate-images.js
```

**Vérifications:**
- [ ] Les images sont copiées dans `uploads/`
- [ ] Les liens markdown sont mis à jour
- [ ] Le rapport `migration-report.json` est généré
- [ ] Aucune erreur dans les logs

#### Vérification des Liens
- [ ] Ouvrir un fichier markdown migré
- [ ] Vérifier que les liens pointent vers `/uploads/`
- [ ] Vérifier que les images s'affichent correctement

### ✅ Tests de Performance

#### Temps d'Upload
- [ ] Uploader une petite image (< 100 KB)
- [ ] Mesurer le temps de réponse (< 2s attendu)
- [ ] Uploader une grande image (~ 5 MB)
- [ ] Mesurer le temps de réponse (< 5s attendu)

#### Génération de Miniatures
- [ ] Vérifier que les miniatures sont créées
- [ ] Vérifier la taille des miniatures (200x200px)
- [ ] Vérifier la qualité des miniatures

### ✅ Tests de Sécurité

#### Injection de Nom de Fichier
- [ ] Tenter d'uploader avec un nom malveillant
- [ ] Vérifier que le nom est sécurisé

#### Accès aux Fichiers
- [ ] Vérifier que les fichiers sont accessibles via `/uploads/`
- [ ] Vérifier que les fichiers ne sont pas exécutables

### ✅ Tests de Régression

#### Fonctionnalités Existantes
- [ ] Créer un nouveau contenu
- [ ] Éditer un contenu existant
- [ ] Supprimer un contenu
- [ ] Vérifier que tout fonctionne normalement

## Résultats des Tests

### Date: ___________
### Testeur: ___________

| Test | Statut | Notes |
|------|--------|-------|
| Installation | ⬜ | |
| API Upload | ⬜ | |
| API Liste | ⬜ | |
| API Suppression | ⬜ | |
| Upload Interface | ⬜ | |
| Drag & Drop | ⬜ | |
| Bibliothèque | ⬜ | |
| Validation Taille | ⬜ | |
| Validation Type | ⬜ | |
| Migration | ⬜ | |
| Performance | ⬜ | |
| Sécurité | ⬜ | |
| Régression | ⬜ | |

## Bugs Identifiés

1. 
2. 
3. 

## Améliorations Suggérées

1. 
2. 
3. 
