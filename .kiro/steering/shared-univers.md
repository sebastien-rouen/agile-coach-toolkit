---
inclusion: always
---

# Mon univers BastaVerse (et mes mondes)

## 🔧 API Multi-Sites (backend)

L'**API Multi-Sites** (`api-multi-sites`) est le backend centralisé qui gère toutes les applications du BastaVerse. Cette API unique expose des endpoints spécifiques pour chaque site via des routes préfixées (ex: `/api/carnet-animaux/`, `/api/maison/` mais simplifiée depuis le {site A} par `/api/`), permettant une architecture modulaire et une maintenance simplifiée. Elle centralise l'authentification, les utilitaires partagés, et la logique métier commune tout en gardant une séparation claire entre les différents projets.

### 🚀 Fonctionnement Rapide avec PM2

L'API Multi-Sites utilise **PM2** pour une gestion centralisée et optimisée des processus :

#### Architecture PM2
- **Point d'entrée unique** : `server.js` lance l'API Express centralisée
- **Configuration** : `pm2.ecosystem.js` définit les environnements drafts et production
- **Ports** : Drafts (3002), Production (3001)
- **Instances multiples** : Gestion automatique des instances PocketBase par site

#### Commandes Essentielles

```bash
# Démarrage de l'écosystème complet
pm2 start pm2.ecosystem.js

# Gestion des processus API
pm2 restart "drafts.api"        # Redémarrer l'API drafts
pm2 restart "api"                # Redémarrer l'API production
pm2 restart all                  # Redémarrer tous les processus

# Monitoring et logs
pm2 logs                         # Voir tous les logs en temps réel
pm2 logs "drafts.api"            # Logs spécifiques à drafts
pm2 monit                        # Monitoring interactif
pm2 status                       # État de tous les processus

# Gestion avancée
pm2 reload all                   # Rechargement sans downtime
pm2 stop all                     # Arrêter tous les processus
pm2 delete all                   # Supprimer tous les processus
pm2 save                         # Sauvegarder la configuration
pm2 startup                      # Démarrage automatique au boot
```

#### Avantages de la Centralisation

- **Réduction des ressources** : ~88% d'économie mémoire (1 API au lieu de 20+)
- **Hot-reload intelligent** : Rechargement automatique en développement via Chokidar
- **Détection automatique** : Scan des sites dans `/sites/drafts/` et `/sites/prod/`
- **Cache optimisé** : Routes mises en cache en production pour performances maximales
- **Logs centralisés** : Winston pour traçabilité complète
- **Haute disponibilité** : Redémarrage automatique en cas d'erreur

#### Workflow de Développement

1. **Modifier les routes** dans `data/{site}/api/routes/`
2. **Redémarrer l'API** : `pm2 restart "drafts.api"`
3. **Vérifier les logs** : `pm2 logs "drafts.api"`
4. **Tester** : Les routes sont automatiquement rechargées

#### Endpoints de Gestion

```bash
# Recharger la détection des sites
curl http://localhost:3002/api/reload-sites

# Recharger les routes d'un site spécifique
curl http://localhost:3002/api/{site}/reload

# Vérifier la santé de l'API
curl http://localhost:3002/api/health

# Lister tous les sites détectés
curl http://localhost:3002/api/sites
```


## 🌐 Sites Locaux

| Site | Drafts Port | Production Port | Collections | Description |
|------|-------------|-----------------|-------------|-------------|
| **carnet-animaux** | 8090 | 8091 | soins, poids, evenements, toilettages, liens, checklist | Suivi santé et bien-être des animaux |
| **photos** | 8092 | 8093 | voyages, etapes, checklist, stats | Gestion et organisation de photos de voyage |
| **maison** | 8094 | 8095 | items, categories, locations | Inventaire et gestion des objets du foyer |
| **prompts** | 8096 | 8097 | prompts, categories, tags | Collection de prompts pour IA et créativité |
| **cuisine** | 8098 | 8099 | recipes, ingredients, menus | Recettes, ingrédients et planification repas |
| **bastalab** | 8100 | 8101 | experiments, results, notes | Homelab auto-hébergé sur Proxmox - Dashboard temps réel, monitoring système, gestion VMs/containers pour domotique, multimédia et sauvegarde |
| **carnet-explorateur** | 8102 | 8103 | travels, steps, wishlists, weather | Planification et suivi de voyages d'exploration |
| **carnet-voiture** | 8104 | 8105 | maintenance, fuel, trips | Entretien véhicule et suivi des trajets |
| **articles** | 8106 | 8107 | articles, comments, tags | Publication et gestion d'articles |
| **bastaverse** | 8108 | 8109 | content, media, interactions | Hub central de l'écosystème BastaVerse |
| **oldies** | 8110 | 8111 | games, scores, reviews | Collection de jeux rétro et évaluations |
| **blog** | 8112 | 8113 | posts, comments, categories | Blog personnel avec système de commentaires |
| **volley** | 8114 | 8115 | scheduling, coordination, votes | Organisation d'équipe de volleyball |
| **stream** | 8122 | 8123 | channels, playlists, favorites | Gestion de contenus streaming et playlists |
| **quizz** | 8124 | 8125 | quizzes, questions, scores | Création et gestion de quiz interactifs |
| **slides** | 8126 | 8127 | presentations, slides, themes | Outil de création de présentations |
| **vetements** | 8128 | 8129 |  | Gestion garde-robe et tenues |
| **debug** | 8130 | 8131 |  | Environnement de débogage et tests |


```bash
# Exemples d'accès admin PocketBase
http://localhost:8090/_/  # carnet-animaux (drafts)
http://localhost:8091/_/  # carnet-animaux (prod)
http://localhost:8092/_/  # photos (drafts)
http://localhost:8093/_/  # photos (prod)
http://localhost:8094/_/  # maison (drafts)
http://localhost:8095/_/  # maison (prod)
http://localhost:8096/_/  # prompts (drafts)
http://localhost:8097/_/  # prompts (prod)
```


## **📏 Conventions de code**

- **Langue** : Français pour l'interface utilisateur et commentaires
- **Nommage :** camelCase pour JavaScript, kebab-case pour CSS
- **Fichier :** création de fichiers par components (CSS/JS) (ex: camera.js, sell-modal.js, ...). Pas plus de 800 lignes par fichier, sinon optimiser par composants.
- **Indentation :** 4 espaces pour JavaScript, 2 espaces pour HTML/CSS
- **Structure :** Séparation claire HTML/CSS/JS
- **Bonnes pratiques :** de code
- **Sécurité :** éviter les failles
- **Ne jamais écrire de CSS** dans les fichiers JS
- **Documentation :** Mettre à jour systématiquement CHANGELOG.md à chaque modification
- **Tests :** Ne pas créer de fichiers tests automatiquement, seulement sur demande explicite


## 📦 Stack Générale

- **Serveur** : Node.js / Express
- **Base** : PocketBase (SQLite)
- **Proxy** : Nginx Proxy Manager
- **Automatisation** : PM2, scripts santé
- **Front** : HTML/CSS/JS statiques, Leaflet.js (cartes), Chart.js (stats)
- **Stockage médias** : Immich, NAS SMB/NFS

## 🛠️ Templates et Ressources Centralisées

L'API Multi-Sites fournit des templates standardisés pour accélérer le développement :

- **📋 Template de routes** : `/api/route-template` - Structure standardisée pour les routes Express
- **🗄️ Template PocketBase** : `/api/template/example/pocketbase-collection-create` - Modèle de création de collections PocketBase avec tous les types de champs et bonnes pratiques
- **📖 Guide d'architecture** : `/api/architecture-guide` - Documentation complète de l'architecture
- **🔍 Validation de site** : `/api/site-validation/{site}` - Rapport de conformité architecturale

Ces templates garantissent la cohérence et les bonnes pratiques dans tout l'écosystème BastaVerse.

---

## ⚒️ Structure générale (hors API Backend `api-multi-sites` `https://{site-A}/api/`)

```
site-A/
├── api/                        # API backend
│   ├── lib/                    # Utilitaires partagés
│   └── routes/                 # Gestionnaires de routes API (pour actualiser les routes `pm2 restart "drafts.api"` ou `pm2 restart "api"` sur NPM)
├── config/                     # Configurations du site
│   └── config.json             # Données JSON du dashboard
├── docs/                       # Toutes les documentations fonctionnelles, techniques, architectures
│   └── DOCUMENTATION.md
├── assets/                     # Ressources statiques
│   ├── css/                    # Feuilles de style (pas plus de 800 lignes par fichier, sinon optimiser par composants)
│   │   ├── main.css            # Styles principaux
│   │   └── module.css          # Autre CSS
│   ├── images/                 # Images et icônes
│   │   ├── favicon.png|svg     # Icône du site
│   │   └── logo.png            # Logo
│   └── js/                     # Scripts JavaScript (pas plus de 800 lignes par fichier, sinon optimiser par composants)
│       ├── script.js           # Logique principale du dashboard
│       └── managers/           # Création des collections inexistantes
│          └── composant-manager.js
├── bdd/                        # Gestion PocketBase
│   ├── pb_data/
│   │   ├── data.db             # Base SQLite
│   │   ├── logs.db             # Logs système
│   │   └── storage/            # Fichiers uploadés
│   ├── pb_migrations/          # Migrations versionnées
│   │   ├── 1670000000_initial.js
│   │   ├── 1670000001_users_extended.js
│   │   └── 1670000002_add_projects.js
│   └── pb_hooks/               # Logique métier
│       ├── main.pb.js
│       ├── collections/        # Création des collections inexistantes
│       │   ├── users.pb.js
│       │   └── projects.pb.js
│       └── routes/
│           └── custom_api.pb.js
├── tests/                      # Tests (fonctionnalités, html, tests divers, ...)
├── index.html                  # Page principale
├── page.html                   # Autre page
├── README.md                   # Documentation globale du projet (ne pas dépasser 1000 lignes, sinon splitter par domaine)
├── CHANGELOG.md                # CHANGELOG du projet
├── LICENSE                     # LICENSE MIT
└── .env                        # Config d'environnement
```

---

## ⚙️ Configuration Nginx Proxy Manager – Sites hors `api-multi-sites`

Exemple de configuration type pour servir les sites statiques et leur API :

```nginx
# Contenu statique
location / {
    root /sites/drafts/carnet-animaux;
    index index.html;
    try_files $uri $uri/ =404;
}

# Proxy vers l'API backend
location /api/ {
    proxy_pass http://127.0.0.1:3002/api/carnet-animaux/;  # Port API backend
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Proxy vers PocketBase (si utilisé)
location /pb/ {
    proxy_pass http://127.0.0.1:8090/;  # Port PocketBase
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Sécurité et limites
    client_max_body_size 5M;
    proxy_read_timeout 30s;
}
```

## Annexes

Github : https://github.com/sebastien-rouen/
Buy-me-a-coffee : https://buymeacoffee.com/sebastien.rouen
