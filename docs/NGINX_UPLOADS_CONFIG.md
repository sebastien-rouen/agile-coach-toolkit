# Configuration Nginx pour les Uploads

## Configuration pour servir le dossier uploads

Ajoutez cette configuration à votre fichier Nginx pour le site Agile Coach Toolkit :

```nginx
# Configuration pour drafts.agile.bastou.dev
server {
    listen 80;
    server_name drafts.agile.bastou.dev;

    # Contenu statique principal
    location / {
        root /sites/drafts/agile;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Servir les fichiers uploads
    location /uploads/ {
        alias /sites/drafts/agile/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # Types MIME pour les images
        types {
            image/jpeg jpg jpeg;
            image/png png;
            image/gif gif;
            image/svg+xml svg;
            image/webp webp;
        }
    }

    # Proxy vers l'API backend
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
        
        # Augmenter la limite pour les uploads
        client_max_body_size 10M;
    }
}
```

## Configuration pour la production

```nginx
# Configuration pour agile.bastou.dev
server {
    listen 443 ssl http2;
    server_name agile.bastou.dev;

    # Certificats SSL
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Contenu statique principal
    location / {
        root /sites/prod/agile;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Servir les fichiers uploads
    location /uploads/ {
        alias /sites/prod/agile/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # Sécurité: empêcher l'exécution de scripts
        location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }

    # Proxy vers l'API backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/agile/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Augmenter la limite pour les uploads
        client_max_body_size 10M;
    }
}
```

## Points Importants

### 1. Limite de Taille d'Upload
```nginx
client_max_body_size 10M;
```
Ajustez selon vos besoins (actuellement 10 MB).

### 2. Cache des Images
```nginx
expires 30d;
add_header Cache-Control "public, immutable";
```
Les images sont mises en cache pendant 30 jours pour optimiser les performances.

### 3. Sécurité
```nginx
location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
    deny all;
}
```
Empêche l'exécution de scripts dans le dossier uploads.

### 4. Types MIME
Assurez-vous que Nginx reconnaît correctement les types d'images.

## Redémarrage de Nginx

Après modification de la configuration :

```bash
# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx

# Ou redémarrer complètement
sudo systemctl restart nginx
```

## Vérification

Testez que les uploads sont accessibles :

```bash
# Créer une image de test
echo "test" > /sites/drafts/agile/uploads/test.txt

# Tester l'accès
curl http://drafts.agile.bastou.dev/uploads/test.txt

# Nettoyer
rm /sites/drafts/agile/uploads/test.txt
```

## Permissions

Assurez-vous que le dossier uploads a les bonnes permissions :

```bash
# Créer le dossier si nécessaire
mkdir -p /sites/drafts/agile/uploads

# Définir les permissions
chmod 755 /sites/drafts/agile/uploads

# Si Nginx tourne sous www-data
chown -R www-data:www-data /sites/drafts/agile/uploads
```

## Logs

En cas de problème, consultez les logs Nginx :

```bash
# Logs d'erreur
tail -f /var/log/nginx/error.log

# Logs d'accès
tail -f /var/log/nginx/access.log
```
