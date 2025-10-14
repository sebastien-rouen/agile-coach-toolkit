# 🛠️ Commandes Utiles - PocketBase Skills Matrix

## 📦 Gestion PocketBase

### Démarrage et Arrêt

```bash
# Démarrer PocketBase (drafts)
pm2 start pm2.ecosystem.js --only pb-agile-drafts

# Démarrer PocketBase (production)
pm2 start pm2.ecosystem.js --only pb-agile-prod

# Redémarrer (applique les migrations)
pm2 restart pb-agile-drafts
pm2 restart pb-agile-prod

# Arrêter
pm2 stop pb-agile-drafts
pm2 stop pb-agile-prod

# Supprimer du gestionnaire PM2
pm2 delete pb-agile-drafts
pm2 delete pb-agile-prod
```

### Logs et Monitoring

```bash
# Voir tous les logs
pm2 logs

# Logs d'un processus spécifique
pm2 logs pb-agile-drafts

# Logs en temps réel avec filtre
pm2 logs pb-agile-drafts --lines 100

# Monitoring interactif
pm2 monit

# Statut de tous les processus
pm2 status
```

## 🗄️ Migrations

### Validation

```bash
# Valider la syntaxe des migrations
node bdd/validate-migrations.js

# Lister les migrations
ls -la bdd/pb_migrations/*.js
```

### Application

```bash
# Les migrations s'appliquent automatiquement au redémarrage
pm2 restart pb-agile-drafts

# Vérifier dans les logs
pm2 logs pb-agile-drafts | grep -i migration
```

### Rollback Manuel

```bash
# 1. Arrêter PocketBase
pm2 stop pb-agile-drafts

# 2. Supprimer la migration problématique
rm bdd/pb_migrations/1757700012_seed_templates_part2.js

# 3. Redémarrer
pm2 start pb-agile-drafts
```

## 💾 Backup et Restauration

### Backup

```bash
# Backup complet avec timestamp
tar -czf bdd/pb_data_backup_$(date +%s).tar.gz bdd/pb_data/

# Backup avec date lisible
tar -czf bdd/pb_data_backup_$(date +%Y%m%d_%H%M%S).tar.gz bdd/pb_data/

# Backup de la base de données uniquement
cp bdd/pb_data/data.db bdd/pb_data_backup_$(date +%s).db

# Lister les backups
ls -lh bdd/pb_data_backup_*
```

### Restauration

```bash
# 1. Arrêter PocketBase
pm2 stop pb-agile-drafts

# 2. Sauvegarder l'état actuel
mv bdd/pb_data bdd/pb_data_old

# 3. Restaurer le backup
tar -xzf bdd/pb_data_backup_1234567890.tar.gz -C bdd/

# 4. Redémarrer
pm2 start pb-agile-drafts

# 5. Vérifier
pm2 logs pb-agile-drafts
```

## 🔍 Inspection de la Base

### SQLite Direct

```bash
# Ouvrir la base avec sqlite3
sqlite3 bdd/pb_data/data.db

# Lister les tables
sqlite3 bdd/pb_data/data.db ".tables"

# Compter les enregistrements
sqlite3 bdd/pb_data/data.db "SELECT COUNT(*) FROM tools_skills_matrix_matrices;"

# Exporter en CSV
sqlite3 bdd/pb_data/data.db -header -csv "SELECT * FROM tools_skills_matrix_members;" > members.csv
```

### Requêtes Utiles

```sql
-- Lister toutes les collections
SELECT name FROM _collections;

-- Compter les enregistrements par collection
SELECT 
  c.name,
  COUNT(r.id) as count
FROM _collections c
LEFT JOIN (
  SELECT collectionId, id FROM tools_skills_matrix_matrices
  UNION ALL SELECT collectionId, id FROM tools_skills_matrix_members
  UNION ALL SELECT collectionId, id FROM tools_skills_matrix_items
  UNION ALL SELECT collectionId, id FROM tools_skills_matrix_member_items
  UNION ALL SELECT collectionId, id FROM tools_skills_matrix_templates
) r ON c.id = r.collectionId
WHERE c.name LIKE 'tools_skills_matrix_%'
GROUP BY c.name;

-- Vérifier les relations
SELECT 
  m.name as matrix,
  COUNT(DISTINCT mem.id) as members,
  COUNT(DISTINCT i.id) as items,
  COUNT(DISTINCT mi.id) as associations
FROM tools_skills_matrix_matrices m
LEFT JOIN tools_skills_matrix_members mem ON mem.matrix = m.id
LEFT JOIN tools_skills_matrix_items i ON i.matrix = m.id
LEFT JOIN tools_skills_matrix_member_items mi ON mi.matrix = m.id
GROUP BY m.id;
```

## 🌐 Accès Admin

### URLs

```bash
# Drafts
http://localhost:8090/_/

# Production
http://localhost:8091/_/
```

### Credentials par défaut

```
Email: admin@example.com
Password: (à définir au premier lancement)
```

## 🧪 Tests

### Test des Collections

```bash
# Vérifier que les collections existent
curl http://localhost:8090/api/collections

# Tester l'authentification
curl -X POST http://localhost:8090/api/admins/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@example.com","password":"your_password"}'

# Lister les matrices (nécessite auth)
curl http://localhost:8090/api/collections/tools_skills_matrix_matrices/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test des Templates

```bash
# Lister les templates (public)
curl http://localhost:8090/api/collections/tools_skills_matrix_templates/records

# Récupérer un template spécifique
curl "http://localhost:8090/api/collections/tools_skills_matrix_templates/records?filter=name='Authentification'"
```

## 🔧 Maintenance

### Nettoyage

```bash
# Supprimer les anciens backups (garder les 5 derniers)
ls -t bdd/pb_data_backup_*.tar.gz | tail -n +6 | xargs rm -f

# Nettoyer les logs PocketBase
rm bdd/pb_data/logs.db
pm2 restart pb-agile-drafts

# Vider le cache PM2
pm2 flush
```

### Optimisation

```bash
# Vacuum de la base SQLite
sqlite3 bdd/pb_data/data.db "VACUUM;"

# Analyser la base
sqlite3 bdd/pb_data/data.db "ANALYZE;"

# Vérifier l'intégrité
sqlite3 bdd/pb_data/data.db "PRAGMA integrity_check;"
```

## 📊 Statistiques

### Taille de la Base

```bash
# Taille du répertoire pb_data
du -sh bdd/pb_data/

# Taille de la base de données
ls -lh bdd/pb_data/data.db

# Taille des fichiers uploadés
du -sh bdd/pb_data/storage/
```

### Compteurs

```bash
# Nombre de migrations
ls -1 bdd/pb_migrations/*.js | wc -l

# Nombre de backups
ls -1 bdd/pb_data_backup_* | wc -l

# Lignes de code des migrations
find bdd/pb_migrations -name "*.js" -exec wc -l {} + | tail -1
```

## 🚨 Dépannage

### PocketBase ne démarre pas

```bash
# Vérifier les logs
pm2 logs pb-agile-drafts --err

# Vérifier le port
netstat -ano | findstr :8090

# Tester le binaire directement
cd bdd
./pocketbase serve --http=127.0.0.1:8090
```

### Migrations échouées

```bash
# 1. Voir l'erreur exacte
pm2 logs pb-agile-drafts --lines 50

# 2. Restaurer un backup
pm2 stop pb-agile-drafts
rm -rf bdd/pb_data
tar -xzf bdd/pb_data_backup_TIMESTAMP.tar.gz -C bdd/
pm2 start pb-agile-drafts

# 3. Corriger la migration
# Éditer le fichier problématique
# Redémarrer
pm2 restart pb-agile-drafts
```

### Base corrompue

```bash
# 1. Backup immédiat
cp bdd/pb_data/data.db bdd/data_corrupted_$(date +%s).db

# 2. Tenter une réparation
sqlite3 bdd/pb_data/data.db ".recover" | sqlite3 bdd/pb_data/data_recovered.db

# 3. Remplacer si OK
mv bdd/pb_data/data.db bdd/pb_data/data_old.db
mv bdd/pb_data/data_recovered.db bdd/pb_data/data.db

# 4. Redémarrer
pm2 restart pb-agile-drafts
```

## 📝 Scripts Personnalisés

### Export JSON de toutes les données

```bash
# Créer un script d'export
cat > bdd/export-all.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%s)
EXPORT_DIR="bdd/exports/$TIMESTAMP"
mkdir -p "$EXPORT_DIR"

collections=(
  "tools_skills_matrix_matrices"
  "tools_skills_matrix_members"
  "tools_skills_matrix_items"
  "tools_skills_matrix_member_items"
  "tools_skills_matrix_templates"
)

for collection in "${collections[@]}"; do
  curl "http://localhost:8090/api/collections/$collection/records?perPage=500" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -o "$EXPORT_DIR/$collection.json"
done

echo "Export terminé dans $EXPORT_DIR"
EOF

chmod +x bdd/export-all.sh
./bdd/export-all.sh
```

---

**Dernière mise à jour** : 2025-01-14  
**Version PocketBase** : 0.23.x
