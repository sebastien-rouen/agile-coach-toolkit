# 🛠️ Admin Panel - Agile Coach Toolkit

Interface d'administration pour gérer les catégories et contenus Markdown du site.

## 🚀 Démarrage

### Accès

Ouvrir dans le navigateur :
```
https://drafts.agile.bastou.dev/admin/
```

## 📋 Fonctionnalités

### Gestion des Catégories

- **Créer** une nouvelle catégorie
- **Modifier** les informations (titre, description, icône, couleur)
- **Supprimer** une catégorie (supprime aussi tous ses contenus)
- **Visualiser** le nombre d'articles et d'outils par catégorie

### Gestion des Contenus

- **Créer** un nouveau contenu Markdown
- **Modifier** un contenu existant
- **Supprimer** un contenu
- **Filtrer** par catégorie
- **Éditeur Markdown** avec barre d'outils
- **Prévisualisation** en temps réel

## 🎨 Éditeur Markdown

### Barre d'outils

- **Gras** : `**texte**`
- **Italique** : `*texte*`
- **Titre** : `## Titre`
- **Lien** : `[texte](url)`
- **Code** : `` `code` ``
- **Liste** : `- élément`
- **Prévisualiser** : Affiche le rendu HTML

### Format des contenus

Les fichiers Markdown doivent suivre cette structure :

```markdown
---
id: "mon-article"
title: "Mon Article"
category: "ma-categorie"
tags: ["tag1", "tag2"]
description: "Description courte"
---

# Titre Principal

Contenu de l'article...
```

## 🔧 API Routes

Les routes suivantes sont disponibles via l'API backend :

### Catégories

- `GET /api/routes-admin/categories` - Liste toutes les catégories
- `POST /api/routes-admin/categories` - Créer une catégorie
- `PUT /api/routes-admin/categories` - Modifier une catégorie
- `DELETE /api/routes-admin/categories/:categoryId` - Supprimer une catégorie

### Contenus

- `GET /api/routes-admin/contents/:categoryId/:contentId` - Récupérer un contenu
- `POST /api/routes-admin/contents` - Créer un contenu
- `PUT /api/routes-admin/contents` - Modifier un contenu
- `DELETE /api/routes-admin/contents/:categoryId/:contentId` - Supprimer un contenu

## 📁 Structure des fichiers

```
content/
├── ma-categorie/
│   ├── index.json          # Métadonnées de la catégorie
│   ├── article-1.md        # Contenu Markdown
│   ├── article-2.md
│   └── ...
```

### Format index.json

```json
{
  "category": "ma-categorie",
  "title": "Ma Catégorie",
  "description": "Description de la catégorie",
  "icon": "fas fa-folder",
  "color": "#00d4ff",
  "articles": [
    {
      "id": "article-1",
      "title": "Article 1",
      "file": "article-1.md",
      "tags": ["tag1", "tag2"],
      "order": 1
    }
  ],
  "tools": [],
  "templates": []
}
```

## ⚠️ Important

### Sauvegarde

Avant toute modification importante :
```bash
# Sauvegarder le dossier content
cp -r content content.backup
```

### Redémarrage de l'API

Après avoir modifié des contenus, redémarrer l'API si nécessaire :
```bash
pm2 restart "drafts.api"
```

### Permissions

Assurez-vous que l'API a les droits d'écriture sur le dossier `content/` :
```bash
chmod -R 755 content/
```

## 🐛 Dépannage

### L'admin ne charge pas les catégories

1. Vérifier que l'API est démarrée : `pm2 status`
2. Vérifier les logs : `pm2 logs "drafts.api"`
3. Vérifier la console du navigateur (F12)

### Erreur lors de la sauvegarde

1. Vérifier les permissions du dossier `content/`
2. Vérifier que le format JSON est valide
3. Consulter les logs de l'API

### Les modifications ne s'affichent pas

1. Vider le cache du navigateur (Ctrl+Shift+R)
2. Redémarrer l'API : `pm2 restart "drafts.api"`

## 🔒 Sécurité

⚠️ **Important** : Cette interface d'administration n'a pas d'authentification par défaut.

Pour la production, ajouter :
- Authentification (JWT, OAuth, etc.)
- Validation des entrées côté serveur
- Rate limiting
- HTTPS obligatoire

## 📝 Changelog

### Version 1.0.0
- Interface CRUD pour catégories
- Interface CRUD pour contenus Markdown
- Éditeur Markdown avec prévisualisation
- Filtrage par catégorie
- Gestion automatique de l'index.json

## 🤝 Contribution

Pour ajouter des fonctionnalités :
1. Modifier `admin/admin.js` pour le frontend
2. Modifier `api/routes/routes-admin.js` pour le backend
3. Tester localement
4. Mettre à jour ce README

## 📚 Ressources

- [Marked.js](https://marked.js.org/) - Parser Markdown
- [Font Awesome](https://fontawesome.com/) - Icônes
- [Express.js](https://expressjs.com/) - Framework API
