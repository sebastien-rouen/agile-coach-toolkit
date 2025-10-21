# Guide de Test - Stakeholder Mapping

## Prérequis

1. PocketBase doit être démarré :
```bash
pm2 status pb-agile-drafts
```

2. Les migrations doivent être appliquées :
```bash
pm2 restart pb-agile-drafts
pm2 logs pb-agile-drafts --lines 50
```

## Tests à effectuer

### ✅ Test 1 : Création d'une nouvelle session

1. Ouvrir l'outil : `http://drafts.agile.bastou.dev/tools/stakeholder-mapping/`
2. Vérifier que l'URL contient `?sessionId=` suivi de 15 caractères
3. Vérifier dans la console : `✅ PocketBase connecté`
4. Le nom de session par défaut doit être "Nouvelle Session"

**Résultat attendu** : 
- URL avec sessionId
- Console : "✅ PocketBase connecté"
- Console : "📂 Chargement de la session depuis l'URL"
- Console : "📝 Session xxxxx n'existe pas encore dans PocketBase" (normal pour une nouvelle session)
- Console : "💡 Elle sera automatiquement créée lors de la première sauvegarde"
- Console : "✅ Session locale prête (0 stakeholders)"

---

### ✅ Test 2 : Ajout d'un stakeholder

1. Cliquer sur "👤 Ajouter"
2. Remplir le formulaire :
   - Nom : "Jean Dupont"
   - Rôle : "Product Owner"
   - Pouvoir : 5
   - Intérêt : 5
   - Influence : Vital
   - Domaine : Gouvernance
3. Cliquer sur "💾 Enregistrer"
4. Vérifier que le stakeholder apparaît dans le tableau

**Résultat attendu** : Stakeholder visible dans toutes les vues

---

### ✅ Test 3 : Sauvegarde dans PocketBase

1. Cliquer sur "💾 Sauvegarder"
2. Vérifier la notification : "Session sauvegardée (1 créés, 0 mis à jour)"
3. Vérifier dans la console : `✨ Nouvelle session créée avec ID: xxxxxxxxxxxxx`
4. Ouvrir PocketBase Admin : `http://localhost:8116/_/`
5. Aller dans la collection `tools_stakeholder_mapping_sessions`
6. Vérifier que la session existe avec le bon ID
7. Aller dans la collection `tools_stakeholder_mapping_stakeholders`
8. Vérifier que le stakeholder existe avec le bon `session_id`

**Résultat attendu** : Données présentes dans PocketBase

---

### ✅ Test 4 : Rechargement depuis l'URL

1. Copier l'URL complète (avec sessionId)
2. Ouvrir un nouvel onglet
3. Coller l'URL et valider
4. Vérifier que la session et les stakeholders sont chargés
5. Vérifier dans la console : `📂 Chargement de la session depuis l'URL: xxxxxxxxxxxxx`

**Résultat attendu** : Session et stakeholders rechargés correctement

---

### ✅ Test 5 : Modification d'un stakeholder

1. Cliquer sur "✏️" à côté d'un stakeholder
2. Modifier le nom : "Jean Dupont - Modifié"
3. Cliquer sur "💾 Enregistrer"
4. Cliquer sur "💾 Sauvegarder" (bouton principal)
5. Vérifier la notification : "Session sauvegardée (0 créés, 1 mis à jour)"
6. Recharger la page
7. Vérifier que la modification est persistée

**Résultat attendu** : Modification sauvegardée et rechargée

---

### ✅ Test 6 : Nouvelle session

1. Cliquer sur "➕ Nouvelle Session"
2. Confirmer la création
3. Entrer un nom : "Session Test 2"
4. Vérifier que l'URL change avec un nouveau sessionId
5. Vérifier que la liste des stakeholders est vide
6. Ajouter un stakeholder
7. Sauvegarder
8. Vérifier dans PocketBase que 2 sessions existent

**Résultat attendu** : Nouvelle session créée avec nouvel ID

---

### ✅ Test 7 : Responsive et UI

1. Ouvrir l'outil sur mobile (ou DevTools responsive)
2. Vérifier que les contrôles s'empilent verticalement
3. Vérifier que les boutons de vues sont bien visibles
4. Vérifier que les actions sont accessibles
5. Tester la navigation entre les vues (Tableau, Cercles, Matrice)

**Résultat attendu** : Interface responsive et fonctionnelle

---

### ✅ Test 8 : Validation des données

1. Essayer de créer un stakeholder avec :
   - Pouvoir = 0 (invalide, doit être 1-5)
   - Intérêt = 10 (invalide, doit être 1-5)
2. Vérifier que la validation empêche la sauvegarde
3. Corriger les valeurs (Pouvoir = 3, Intérêt = 4)
4. Sauvegarder
5. Vérifier dans PocketBase que les valeurs sont correctes

**Résultat attendu** : Validation fonctionnelle

---

## Vérifications PocketBase Admin

### Sessions
```
http://localhost:8116/_/collections?collectionId=tools_stakeholder_mapping_sessions
```

Vérifier :
- ✅ Champ `id` présent (format alphanumeric, longueur variable générée par `Date.now().toString(36) + Math.random()`)
- ✅ Champ `name` présent
- ✅ Champs `created` et `updated` présents

### Stakeholders
```
http://localhost:8116/_/collections?collectionId=tools_stakeholder_mapping_stakeholders
```

Vérifier :
- ✅ Champ `id` présent (format alphanumeric, longueur variable)
- ✅ Champ `session_id` correspond à une session existante
- ✅ Champs `power` et `interest` entre 1 et 5
- ✅ Champs `influence` et `domain` avec valeurs valides

---

## Logs à surveiller

### Console navigateur
```javascript
✅ PocketBase connecté
📂 Chargement de la session depuis l'URL: xxxxxxxxxxxxx
✨ Nouvelle session créée avec ID: xxxxxxxxxxxxx
💾 Sauvegarde: 1 créés, 0 mis à jour
```

### PM2 Logs
```bash
pm2 logs pb-agile-drafts --lines 20
```

Rechercher :
- Erreurs de migration
- Erreurs de connexion
- Erreurs de validation

---

## Résolution de problèmes

### Problème : "PocketBase non disponible"
**Solution** : 
```bash
pm2 restart pb-agile-drafts
pm2 logs pb-agile-drafts
```

### Problème : "Format d'ID de session invalide"
**Solution** : Vérifier que l'ID contient au moins 10 caractères alphanumériques minuscules (format généré par `Utils.generateId()`)

### Problème : "Stakeholder ignoré: pouvoir invalide"
**Solution** : Vérifier que power et interest sont entre 1 et 5

### Problème : Sessions non sauvegardées
**Solution** : 
1. Vérifier que PocketBase est démarré
2. Vérifier les migrations dans PocketBase Admin
3. Vérifier les logs PM2

---

## Checklist finale

- [ ] URL contient sessionId au chargement
- [ ] Sessions créées dans PocketBase
- [ ] Stakeholders créés dans PocketBase
- [ ] Rechargement depuis URL fonctionne
- [ ] Modifications persistées
- [ ] Validation des données active
- [ ] Interface responsive
- [ ] Notifications affichées
- [ ] Logs sans erreur
- [ ] Toutes les vues fonctionnelles (Tableau, Cercles, Matrice)
