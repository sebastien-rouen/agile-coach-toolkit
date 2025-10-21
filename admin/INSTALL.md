# 🚀 Installation - Admin Panel

## Étapes d'installation

### 1️⃣ Copier les routes dans l'API multi-sites

```bash
# Copier le fichier de routes
cp api/routes/routes-admin.js /path/to/api-multi-sites/data/agile/api/routes/

# Exemple avec le chemin complet
cp api/routes/routes-admin.js ../../api-multi-sites/data/agile/api/routes/
```

### 2️⃣ Redémarrer l'API

```bash
# Redémarrer l'API drafts
pm2 restart "drafts.api"

# Vérifier que l'API est bien démarrée
pm2 status

# Voir les logs
pm2 logs "drafts.api"
```

### 3️⃣ Tester l'API

```bash
# Test de santé
curl http://localhost:3002/api/agile/health

# Liste des catégories
curl http://localhost:3002/api/agile/routes-admin/categories
```

### 4️⃣ Accéder à l'interface

Ouvrir dans le navigateur :
```
http://localhost:8116/admin/
```

Ou via Nginx :
```
https://agile.drafts.bastou.dev/admin/
```

## ✅ Vérifications

### L'interface se charge correctement
- [ ] La page admin s'affiche
- [ ] La sidebar est visible
- [ ] Les catégories se chargent

### L'API répond
- [ ] `GET /api/routes-admin/categories` retourne les catégories
- [ ] Les logs PM2 ne montrent pas d'erreurs

### Les permissions sont correctes
```bash
# Vérifier les permissions du dossier content
ls -la content/

# Si nécessaire, ajuster les permissions
chmod -R 755 content/
```

## 🐛 Problèmes courants

### L'API ne démarre pas
```bash
# Vérifier les logs
pm2 logs "drafts.api" --lines 50

# Redémarrer complètement
pm2 delete "drafts.api"
pm2 start pm2.ecosystem.js
```

### Les catégories ne se chargent pas
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs réseau
3. Vérifier que l'URL de l'API est correcte
4. Vérifier que CORS est configuré

### Erreur 404 sur les routes
- Vérifier que `routes-admin.js` est bien dans `data/agile/api/routes/`
- Redémarrer l'API : `pm2 restart "drafts.api"`

### Erreur de permissions
```bash
# Donner les droits d'écriture
chmod -R 755 content/

# Vérifier le propriétaire
chown -R $USER:$USER content/
```

## 📝 Configuration Nginx (si nécessaire)

Si les routes API ne fonctionnent pas, vérifier la configuration Nginx :

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3002/api/agile/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Important pour les uploads
    client_max_body_size 10M;
}
```

## 🎉 C'est prêt !

Une fois l'installation terminée, vous pouvez :
- Créer des catégories
- Ajouter des contenus Markdown
- Modifier et organiser vos contenus

## 📚 Documentation

- [README.md](README.md) - Documentation complète
- [CHANGELOG.md](../CHANGELOG.md) - Historique des modifications

## 🆘 Besoin d'aide ?

1. Consulter les logs : `pm2 logs "drafts.api"`
2. Vérifier la console du navigateur (F12)
3. Vérifier les permissions : `ls -la content/`
