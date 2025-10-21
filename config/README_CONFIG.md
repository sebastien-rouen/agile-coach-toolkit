# Configuration - config.json

## 📋 Vue d'ensemble

Le fichier `config.json` centralise toutes les configurations importantes du projet, permettant de personnaliser le comportement sans modifier le code.

## 🔧 Sections de Configuration

### 1. Site

Informations générales sur le site.

```json
"site": {
  "name": "Coach Agile Toolkit",
  "tagline": "Collection d'outils gratuits...",
  "version": "3.0.0",
  "author": "Sébastien",
  "license": "MIT"
}
```

### 2. Paths (Chemins)

Chemins utilisés dans l'application. Modifiez-les si vous changez la structure des dossiers.

```json
"paths": {
  "uploads": "/uploads/",
  "api": "/api/",
  "content": "/content/",
  "assets": "/assets/",
  "tools": "/tools/"
}
```

**Utilisation :**
- Frontend : `configLoader.getUploadPath()`
- Backend : Chargé automatiquement depuis `config.json`

### 3. Upload (Configuration d'Upload)

Paramètres pour le système d'upload d'images.

```json
"upload": {
  "maxFileSize": 5242880,
  "allowedExtensions": ["jpg", "jpeg", "png", "gif", "svg", "webp"],
  "thumbnailSize": 200
}
```

**Paramètres :**

| Paramètre | Type | Description | Valeur par défaut |
|-----------|------|-------------|-------------------|
| `maxFileSize` | number | Taille max en octets | 5242880 (5 MB) |
| `allowedExtensions` | array | Extensions autorisées | jpg, jpeg, png, gif, svg, webp |
| `thumbnailSize` | number | Taille miniatures (px) | 200 |

**Conversions utiles :**
- 1 MB = 1048576 octets
- 5 MB = 5242880 octets
- 10 MB = 10485760 octets

## 🎯 Exemples de Personnalisation

### Augmenter la taille maximale à 10 MB

```json
"upload": {
  "maxFileSize": 10485760,
  ...
}
```

### Ajouter le format AVIF

```json
"upload": {
  "allowedExtensions": ["jpg", "jpeg", "png", "gif", "svg", "webp", "avif"],
  ...
}
```

### Miniatures plus grandes (300x300)

```json
"upload": {
  "thumbnailSize": 300,
  ...
}
```

### Changer le chemin d'upload

```json
"paths": {
  "uploads": "/media/images/",
  ...
}
```

**⚠️ Important :** Si vous changez le chemin d'upload, pensez à :
1. Mettre à jour la configuration Nginx
2. Déplacer les images existantes
3. Mettre à jour les liens dans les fichiers markdown

## 💻 Utilisation dans le Code

### Frontend (JavaScript)

```javascript
// Charger la configuration (automatique au démarrage)
await configLoader.load();

// Obtenir les chemins
const uploadPath = configLoader.getUploadPath();
const apiPath = configLoader.getApiPath();

// Obtenir les paramètres d'upload
const maxSize = configLoader.getMaxFileSize();
const maxSizeMB = configLoader.getMaxFileSizeMB();
const allowedExts = configLoader.getAllowedExtensions();
const thumbSize = configLoader.getThumbnailSize();

// Validation
const isValid = configLoader.isValidExtension("image.jpg");
const isSizeOk = configLoader.isValidFileSize(fileSize);

// Formatage
const formatted = configLoader.formatFileSize(1024000);
```

### Backend (Node.js)

```javascript
// Charger la configuration
const configPath = path.join(__dirname, "../../config/config.json");
const configData = await fs.readFile(configPath, "utf-8");
const config = JSON.parse(configData);

// Utiliser les paramètres
const maxSize = config.upload.maxFileSize;
const allowedExts = config.upload.allowedExtensions;
const thumbSize = config.upload.thumbnailSize;
```

## 🔄 Rechargement de la Configuration

### Frontend

La configuration est chargée automatiquement au démarrage de la page. Pour recharger :

```javascript
configLoader.loaded = false;
await configLoader.load();
```

### Backend

Redémarrez l'API pour prendre en compte les modifications :

```bash
pm2 restart "drafts.api"
```

## ✅ Validation de la Configuration

Avant de modifier `config.json`, vérifiez :

1. **Syntaxe JSON valide** : Utilisez un validateur JSON
2. **Types corrects** : 
   - `maxFileSize` doit être un nombre
   - `allowedExtensions` doit être un tableau
   - `thumbnailSize` doit être un nombre
3. **Valeurs cohérentes** :
   - `maxFileSize` > 0
   - `thumbnailSize` entre 50 et 500
   - Extensions en minuscules

## 🐛 Dépannage

### La configuration ne se charge pas

```bash
# Vérifier la syntaxe JSON
cat config/config.json | jq .

# Vérifier les permissions
ls -la config/config.json

# Voir les logs
pm2 logs "drafts.api"
```

### Les modifications ne sont pas prises en compte

1. Vérifier que le fichier est bien sauvegardé
2. Redémarrer l'API : `pm2 restart "drafts.api"`
3. Vider le cache du navigateur (Ctrl+F5)
4. Vérifier les logs pour les erreurs

### Erreur de validation d'upload

Si les fichiers sont rejetés après modification :

1. Vérifier `maxFileSize` (en octets, pas en MB)
2. Vérifier `allowedExtensions` (minuscules, sans point)
3. Redémarrer l'API
4. Tester avec un petit fichier d'abord

## 📚 Références

- **Config Loader** : `admin/config-loader.js`
- **Backend Upload** : `api/routes/routes-uploads.js`
- **Documentation Upload** : `docs/UPLOAD_SYSTEM.md`

---

**Dernière mise à jour** : 2025-01-04  
**Version** : 1.0.0
