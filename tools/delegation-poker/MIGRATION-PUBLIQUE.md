# 🔓 Migration pour accès public

## Problème

Les collections Delegation Poker ont des règles d'authentification qui empêchent la création de sessions :

```javascript
listRule: "@request.auth.id != ''"
createRule: "@request.auth.id != ''"
// etc.
```

Cela génère des erreurs **400 Bad Request** lors de la création de sessions.

## Solution

Appliquer la migration `1757700402_public_access_tools_delegation_poker.js` qui rend les collections publiques.

## Étapes

### 1. Vérifier que PocketBase est démarré

```bash
pm2 status
# Vérifier que pb-agile-drafts est running
```

### 2. La migration s'applique automatiquement

PocketBase détecte et applique automatiquement les nouvelles migrations au démarrage.

Si PocketBase était déjà démarré, redémarrez-le :

```bash
pm2 restart pb-agile-drafts
```

### 3. Vérifier dans PocketBase Admin

1. Ouvrir : `http://localhost:8108/_/`
2. Aller dans **Collections**
3. Sélectionner `tools_delegation_poker_sessions`
4. Onglet **API Rules**
5. Vérifier que toutes les règles sont vides :
   - List rule: ` ` (vide)
   - View rule: ` ` (vide)
   - Create rule: ` ` (vide)
   - Update rule: ` ` (vide)
   - Delete rule: ` ` (vide)

### 4. Tester la création de session

1. Ouvrir l'outil : `http://localhost/tools/delegation-poker/`
2. Cliquer sur "➕ Nouvelle session"
3. Remplir et créer
4. Vérifier :
   - ✅ Pas d'erreur 400
   - ✅ Session créée dans PocketBase
   - ✅ URL mise à jour avec `?session=<id>`

## Vérification manuelle (si besoin)

Si la migration ne s'applique pas automatiquement, vous pouvez modifier manuellement dans PocketBase Admin :

1. Ouvrir `http://localhost:8108/_/`
2. Pour chaque collection :
   - `tools_delegation_poker_sessions`
   - `tools_delegation_poker_decisions`
   - `tools_delegation_poker_votes`
   - `tools_delegation_poker_consensus`

3. Aller dans **API Rules**
4. Vider toutes les règles (laisser vide)
5. Cliquer sur **Save changes**

## Sécurité

⚠️ **Note** : Cette configuration rend les collections publiques. C'est acceptable pour un outil interne, mais pour une utilisation en production publique, il faudrait :

1. Implémenter un système d'authentification
2. Ajouter des règles basées sur l'utilisateur connecté
3. Ou utiliser des tokens d'accès temporaires

## Rollback

Si vous voulez restaurer les règles d'authentification :

1. Supprimer la migration `1757700402_public_access_tools_delegation_poker.js`
2. Redémarrer PocketBase : `pm2 restart pb-agile-drafts`
3. Les règles d'authentification seront restaurées

Ou manuellement dans PocketBase Admin, remettre :
```
@request.auth.id != ''
```
dans toutes les règles.

## Logs

Pour vérifier que la migration s'est bien appliquée :

```bash
pm2 logs pb-agile-drafts | grep "Accès public"
```

Vous devriez voir :
```
✅ Accès public activé pour tools_delegation_poker_sessions
✅ Accès public activé pour tools_delegation_poker_decisions
✅ Accès public activé pour tools_delegation_poker_votes
✅ Accès public activé pour tools_delegation_poker_consensus
```

---

**Après cette migration, l'outil Delegation Poker fonctionnera sans authentification !**
