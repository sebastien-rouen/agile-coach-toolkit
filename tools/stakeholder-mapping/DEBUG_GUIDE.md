# 🐛 Guide de Débogage - Stakeholder Mapping

## Problèmes Courants et Solutions

### 1. Session non sauvegardée dans PocketBase

#### Symptômes
- Message "Données sauvegardées localement" affiché
- Aucun log de sauvegarde PocketBase dans la console
- Session absente de PocketBase Admin

#### Vérifications

**Console navigateur** - Chercher ces logs :
```javascript
💾 Début de la sauvegarde...
PocketBase actif: true
Session à sauvegarder: {id: "...", name: "..."}
Nombre de stakeholders: X
```

**Si "PocketBase actif: false"** :
```bash
# Vérifier que PocketBase est démarré
pm2 status pb-agile-drafts

# Si arrêté, redémarrer
pm2 restart pb-agile-drafts

# Vérifier les logs
pm2 logs pb-agile-drafts --lines 50
```

**Si "PocketBase actif: true" mais pas de sauvegarde** :
- Vérifier qu'il n'y a pas d'erreur JavaScript dans la console
- Vérifier que `CONFIG.pocketbase.enabled` est `true`
- Ouvrir la console et taper : `PocketBaseIntegration.usePocketBase`

---

### 2. Erreur "Format d'ID de session invalide"

#### Symptômes
```
Erreur: Format d'ID de session invalide
```

#### Solution
L'ID doit être alphanumeric minuscule avec minimum 10 caractères.

**Vérifier l'ID** :
```javascript
// Dans la console
console.log(DataManager.currentSession.id);
console.log(/^[a-z0-9]{10,}$/.test(DataManager.currentSession.id));
```

**Si false** : L'ID est invalide, créer une nouvelle session

---

### 3. Erreur 404 persistante

#### Symptômes
```
GET .../records/xxxxx 404 (Not Found)
Erreur chargement session: Error: Erreur HTTP: 404
```

#### Vérifications

**C'est normal si** :
- Première visite avec ce sessionId
- Session pas encore sauvegardée
- Logs montrent : "📝 Session n'existe pas encore dans PocketBase"

**C'est un problème si** :
- Session déjà sauvegardée auparavant
- Pas de message "📝 Session n'existe pas encore"

**Solution** :
```bash
# Vérifier dans PocketBase Admin
http://localhost:8116/_/collections?collectionId=tools_stakeholder_mapping_sessions

# Chercher la session par ID
# Si absente : normal, sauvegarder à nouveau
# Si présente : problème de chargement
```

---

### 4. Stakeholders non sauvegardés

#### Symptômes
- Session créée dans PocketBase
- Stakeholders absents de la collection

#### Vérifications

**Console** - Chercher :
```javascript
💾 Sauvegarde: X créés, Y mis à jour
```

**Si absent** :
- Vérifier que les stakeholders existent localement : `DataManager.stakeholders`
- Vérifier les valeurs power/interest (doivent être 1-5)

**Validation des données** :
```javascript
// Dans la console
DataManager.stakeholders.forEach(s => {
    console.log(s.name, 'power:', s.power, 'interest:', s.interest);
});
```

**Si power ou interest hors limites** :
- Éditer le stakeholder
- Corriger les valeurs (1-5)
- Sauvegarder à nouveau

---

### 5. PocketBase non connecté

#### Symptômes
```
⚠️ PocketBase non disponible, mode local activé
```

#### Solutions

**1. Vérifier le statut PM2** :
```bash
pm2 status pb-agile-drafts
```

**2. Vérifier le port** :
```bash
# Tester l'API health
curl http://localhost:8116/api/health

# Devrait retourner: {"code":200,"message":"API is healthy."}
```

**3. Vérifier la configuration** :
```javascript
// Dans la console
console.log(CONFIG.pocketbase);
// Devrait afficher: {enabled: true, collections: {...}}
```

**4. Redémarrer PocketBase** :
```bash
pm2 restart pb-agile-drafts
pm2 logs pb-agile-drafts
```

---

### 6. Migrations non appliquées

#### Symptômes
- Erreur lors de la création de session
- Champs manquants dans PocketBase

#### Vérification

**PocketBase Admin** :
```
http://localhost:8116/_/
```

**Collections attendues** :
- `tools_stakeholder_mapping_sessions`
- `tools_stakeholder_mapping_stakeholders`

**Si absentes** :
```bash
# Redémarrer PocketBase pour appliquer les migrations
pm2 restart pb-agile-drafts

# Vérifier les logs de migration
pm2 logs pb-agile-drafts --lines 100 | grep migration
```

---

### 7. Données désynchronisées

#### Symptômes
- Données différentes entre localStorage et PocketBase
- Modifications non visibles après rechargement

#### Solution

**Forcer le rechargement depuis PocketBase** :
```javascript
// Dans la console
await PocketBaseIntegration.loadSession(DataManager.currentSession.id);
App.refreshAllViews();
```

**Forcer la sauvegarde** :
```javascript
// Dans la console
await PocketBaseIntegration.saveSession();
```

**Réinitialiser localStorage** :
```javascript
// Dans la console
localStorage.clear();
location.reload();
```

---

## Commandes de Débogage Utiles

### Console Navigateur

```javascript
// Vérifier l'état de PocketBase
console.log('PocketBase actif:', PocketBaseIntegration.usePocketBase);
console.log('PocketBase initialisé:', PocketBaseIntegration.initialized);

// Vérifier la session actuelle
console.log('Session:', DataManager.currentSession);
console.log('Stakeholders:', DataManager.stakeholders);

// Vérifier la configuration
console.log('Config PocketBase:', CONFIG.pocketbase);

// Tester la connexion
await PocketBaseIntegration.pbManager.testConnection();

// Forcer une sauvegarde
await PocketBaseIntegration.saveSession();

// Recharger une session
await PocketBaseIntegration.loadSession('mhdoi14c1h7u37w3klaj');
```

### Terminal (PM2)

```bash
# Statut de tous les processus
pm2 status

# Logs en temps réel
pm2 logs pb-agile-drafts

# Logs des 100 dernières lignes
pm2 logs pb-agile-drafts --lines 100

# Redémarrer PocketBase
pm2 restart pb-agile-drafts

# Arrêter/Démarrer
pm2 stop pb-agile-drafts
pm2 start pb-agile-drafts

# Monitoring
pm2 monit
```

### cURL (API PocketBase)

```bash
# Health check
curl http://localhost:8116/api/health

# Lister les sessions
curl http://localhost:8116/api/collections/tools_stakeholder_mapping_sessions/records

# Récupérer une session spécifique
curl http://localhost:8116/api/collections/tools_stakeholder_mapping_sessions/records/mhdoi14c1h7u37w3klaj

# Lister les stakeholders d'une session
curl "http://localhost:8116/api/collections/tools_stakeholder_mapping_stakeholders/records?filter=session_id='mhdoi14c1h7u37w3klaj'"
```

---

## Checklist de Diagnostic

Avant de signaler un bug, vérifier :

- [ ] PocketBase est démarré (`pm2 status`)
- [ ] Migrations appliquées (collections visibles dans Admin)
- [ ] Console sans erreur JavaScript
- [ ] `PocketBaseIntegration.usePocketBase === true`
- [ ] `CONFIG.pocketbase.enabled === true`
- [ ] SessionId valide (alphanumeric, 10+ chars)
- [ ] Stakeholders avec power/interest entre 1-5
- [ ] Logs de sauvegarde présents dans la console

---

## Logs Attendus (Scénario Complet)

### Au Chargement
```
✨ Création d'une nouvelle session
🔗 URL mise à jour avec sessionId: mhdoi14c1h7u37w3klaj
✅ PocketBase connecté
📂 Chargement de la session depuis l'URL: mhdoi14c1h7u37w3klaj
📝 Session mhdoi14c1h7u37w3klaj n'existe pas encore dans PocketBase
💡 Elle sera automatiquement créée lors de la première sauvegarde
✅ Session locale prête (0 stakeholders)
```

### Après Ajout Stakeholder
```
(Aucun log automatique, c'est normal)
```

### Après Sauvegarde
```
💾 Début de la sauvegarde...
PocketBase actif: true
Session à sauvegarder: {id: "mhdoi14c1h7u37w3klaj", name: "Nouvelle Session"}
Nombre de stakeholders: 1
✨ Nouvelle session créée avec ID: mhdoi14c1h7u37w3klaj
💾 Sauvegarde: 1 créés, 0 mis à jour
Session sauvegardée (1 créés, 0 mis à jour)
```

### Après Rechargement
```
📂 Chargement de la session depuis l'URL: mhdoi14c1h7u37w3klaj
✅ PocketBase connecté
✅ Session chargée (1 stakeholders)
```

---

## Support

Si le problème persiste après ces vérifications :

1. Copier les logs de la console
2. Copier les logs PM2 : `pm2 logs pb-agile-drafts --lines 50`
3. Vérifier l'état dans PocketBase Admin
4. Créer un rapport avec ces informations

---

**Dernière mise à jour** : 30 Janvier 2025  
**Version** : 1.1.0
