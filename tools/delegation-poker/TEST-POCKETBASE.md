# 🧪 Test de l'intégration PocketBase

## Prérequis

1. **PocketBase en cours d'exécution**
   ```bash
   pm2 status
   # Vérifier que pb-agile-drafts est running
   ```

2. **Migrations appliquées**
   - Vérifier dans PocketBase Admin : `http://localhost:8108/_/`
   - Collections attendues :
     - `tools_delegation_poker_sessions`
     - `tools_delegation_poker_decisions`
     - `tools_delegation_poker_votes`
     - `tools_delegation_poker_consensus`

## Test 1 : Création de session

### Étapes
1. Ouvrir l'outil : `http://localhost/tools/delegation-poker/`
2. Cliquer sur "➕ Nouvelle session"
3. Remplir :
   - Nom : "Test PocketBase"
   - Participants : 
     ```
     Alice (PO)
     Bob (Dev)
     Charlie (SM)
     ```
4. Cliquer sur "Créer la session"

### Résultat attendu
- ✅ Notification "Session créée avec succès !"
- ✅ URL mise à jour : `?session=<id>`
- ✅ Console : "✅ Session créée avec ID: <id>"
- ✅ Dans PocketBase Admin : Nouvelle entrée dans `tools_delegation_poker_sessions`

### Vérification PocketBase
```bash
# Ouvrir PocketBase Admin
http://localhost:8108/_/

# Aller dans Collections > tools_delegation_poker_sessions
# Vérifier :
- session_name = "Test PocketBase"
- participants = ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"]
- status = "active"
```

## Test 2 : Ajout de décisions

### Étapes
1. Dans la session créée, ajouter une décision :
   - Texte : "Choix des technologies"
   - Catégorie : Technique
2. Cliquer sur "Ajouter"

### Résultat attendu
- ✅ Notification "Décision ajoutée !"
- ✅ Décision apparaît dans le tableau
- ✅ Console : "✅ Décision sauvegardée: Choix des technologies"
- ✅ Dans PocketBase Admin : Nouvelle entrée dans `tools_delegation_poker_decisions`

### Vérification PocketBase
```bash
# Collections > tools_delegation_poker_decisions
# Vérifier :
- session_id = <id de la session>
- decision_text = "Choix des technologies"
- category = "technical"
- order = 0
- status = "pending"
```

## Test 3 : Vote et consensus

### Étapes
1. Cliquer sur "🃏 Voter" pour la décision
2. Faire voter chaque participant (ex: Alice=4, Bob=4, Charlie=5)
3. Cliquer sur "🎭 Révéler les votes"
4. Ajouter des notes : "Décision collective avec légère autonomie"
5. Cliquer sur "💾 Enregistrer le consensus"

### Résultat attendu
- ✅ Votes enregistrés dans `tools_delegation_poker_votes`
- ✅ Consensus enregistré dans `tools_delegation_poker_consensus`
- ✅ Étoile (★) apparaît dans le tableau au niveau consensuel
- ✅ Delegation Board s'affiche en bas

### Vérification PocketBase
```bash
# Collections > tools_delegation_poker_votes
# Vérifier 3 entrées :
- decision_id = <id de la décision>
- participant_name = "Alice (PO)", "Bob (Dev)", "Charlie (SM)"
- delegation_level = 4, 4, 5

# Collections > tools_delegation_poker_consensus
# Vérifier :
- decision_id = <id de la décision>
- final_level = 4 (médiane)
- notes = "Décision collective avec légère autonomie"
```

## Test 4 : Partage d'URL

### Étapes
1. Copier l'URL complète : `http://localhost/tools/delegation-poker/?session=<id>`
2. Ouvrir dans un nouvel onglet (ou navigateur privé)

### Résultat attendu
- ✅ Session chargée automatiquement
- ✅ Toutes les décisions visibles
- ✅ Consensus affichés avec étoiles
- ✅ Delegation Board visible
- ✅ Console : "📋 Chargement de la session depuis l'URL: <id>"

## Test 5 : Chargement de session existante

### Étapes
1. Ouvrir l'outil sans paramètre : `http://localhost/tools/delegation-poker/`
2. Cliquer sur "📂 Charger session"
3. Sélectionner "Test PocketBase"

### Résultat attendu
- ✅ Session chargée
- ✅ URL mise à jour avec `?session=<id>`
- ✅ Toutes les données restaurées

## Test 6 : Mode local (fallback)

### Étapes
1. Arrêter PocketBase : `pm2 stop pb-agile-drafts`
2. Rafraîchir la page
3. Créer une nouvelle session

### Résultat attendu
- ✅ Console : "📦 Mode local (PocketBase non disponible)"
- ✅ Session créée avec ID `local_<timestamp>`
- ✅ Données sauvegardées dans localStorage
- ✅ Outil fonctionnel en mode démo

### Restaurer PocketBase
```bash
pm2 start pb-agile-drafts
```

## Dépannage

### Problème : "Session créée" mais pas dans PocketBase

**Causes possibles :**
1. PocketBase non démarré
2. Migrations non appliquées
3. Erreur de connexion

**Solutions :**
```bash
# Vérifier PocketBase
pm2 logs pb-agile-drafts

# Vérifier les collections
curl http://localhost:8108/api/collections

# Redémarrer PocketBase
pm2 restart pb-agile-drafts
```

### Problème : "Erreur création session"

**Vérifier la console :**
```javascript
// Ouvrir DevTools (F12)
// Onglet Console
// Chercher les erreurs rouges
```

**Vérifier les migrations :**
```bash
# Aller dans bdd/pb_migrations/
ls -la

# Vérifier que les fichiers existent :
# 1757700001_create_tools_delegation_poker_sessions.js
# 1757700002_create_tools_delegation_poker_decisions.js
# 1757700003_create_tools_delegation_poker_votes.js
# 1757700004_create_tools_delegation_poker_consensus.js
```

### Problème : URL ne se met pas à jour

**Vérifier :**
1. Console : Chercher "✅ Session créée avec ID:"
2. Si l'ID est présent mais pas dans l'URL, vérifier `window.history.pushState`
3. Rafraîchir la page et vérifier si l'URL persiste

## Logs utiles

### Console navigateur
```javascript
// Activer les logs détaillés
localStorage.setItem('debug', 'true');

// Voir l'état de PocketBase
console.log('PocketBase:', window.pbAPI);

// Voir la session courante
console.log('Session:', AppState.currentSession);
```

### Logs PocketBase
```bash
# Voir les logs en temps réel
pm2 logs pb-agile-drafts

# Voir les dernières erreurs
pm2 logs pb-agile-drafts --err
```

## Checklist de validation

- [ ] Session créée dans PocketBase
- [ ] ID de session dans l'URL
- [ ] Décisions enregistrées
- [ ] Votes enregistrés
- [ ] Consensus enregistrés
- [ ] Étoiles visibles dans le tableau
- [ ] Delegation Board affiché
- [ ] Partage d'URL fonctionnel
- [ ] Chargement de session existante
- [ ] Mode local (fallback) fonctionnel

---

**Note** : Ce fichier est destiné aux développeurs et testeurs. Il ne doit pas être inclus dans la version de production.
