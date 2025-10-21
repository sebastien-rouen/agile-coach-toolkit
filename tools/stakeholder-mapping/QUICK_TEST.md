# 🚀 Test Rapide - Stakeholder Mapping

## Test en 5 Minutes

### 1️⃣ Ouvrir l'Outil (30 secondes)

```
https://drafts.agile.bastou.dev/tools/stakeholder-mapping/
```

**Vérifications** :
- ✅ URL contient `?sessionId=xxxxx`
- ✅ Console : "✅ PocketBase connecté"
- ✅ Console : "📂 Chargement de la session depuis l'URL"
- ✅ Console : "📝 Session n'existe pas encore" (normal pour nouvelle session)
- ✅ Console : "✅ Session locale prête"
- ✅ Aucune erreur "Format d'ID de session invalide"

---

### 2️⃣ Ajouter un Stakeholder (1 minute)

1. Cliquer sur "👤 Ajouter"
2. Remplir rapidement :
   - Nom : "Test User"
   - Rôle : "Testeur"
   - Pouvoir : 3
   - Intérêt : 4
   - Influence : Good
   - Domaine : Customer
3. Cliquer "💾 Enregistrer"

**Vérifications** :
- ✅ Stakeholder apparaît dans le tableau
- ✅ Visible dans les 3 vues (Tableau, Cercles, Matrice)

---

### 3️⃣ Sauvegarder dans PocketBase (30 secondes)

1. Cliquer sur "💾 Sauvegarder"

**Vérifications** :
- ✅ Notification : "Session sauvegardée (1 créés, 0 mis à jour)"
- ✅ Console : "✨ Nouvelle session créée avec ID: xxxxx"
- ✅ Console : "💾 Sauvegarde: 1 créés, 0 mis à jour"

---

### 4️⃣ Vérifier PocketBase (1 minute)

1. Ouvrir : `http://localhost:8116/_/`
2. Aller dans `tools_stakeholder_mapping_sessions`
3. Vérifier qu'une session existe
4. Aller dans `tools_stakeholder_mapping_stakeholders`
5. Vérifier que le stakeholder existe

**Vérifications** :
- ✅ Session présente avec le bon ID
- ✅ Stakeholder présent avec `session_id` correct

---

### 5️⃣ Test de Rechargement (1 minute)

1. Copier l'URL complète
2. Ouvrir un nouvel onglet
3. Coller l'URL

**Vérifications** :
- ✅ Session rechargée automatiquement
- ✅ Stakeholder visible
- ✅ Console : "✅ Session chargée (1 stakeholders)"

---

### 6️⃣ Test de Modification (1 minute)

1. Cliquer sur "✏️" à côté du stakeholder
2. Modifier le nom : "Test User - Modifié"
3. Cliquer "💾 Enregistrer"
4. Cliquer "💾 Sauvegarder" (bouton principal)
5. Recharger la page (F5)

**Vérifications** :
- ✅ Notification : "Session sauvegardée (0 créés, 1 mis à jour)"
- ✅ Modification persistée après rechargement

---

## ✅ Checklist Rapide

- [ ] URL avec sessionId
- [ ] PocketBase connecté
- [ ] Stakeholder ajouté
- [ ] Sauvegarde réussie
- [ ] Données dans PocketBase
- [ ] Rechargement OK
- [ ] Modification persistée

---

## 🐛 Si Problème

### Erreur : "PocketBase non disponible"
```bash
pm2 restart pb-agile-drafts
pm2 logs pb-agile-drafts
```

### Erreur : "Format d'ID de session invalide"
- Vérifier que la correction a été appliquée
- Ouvrir `test-id-validation.html` pour tester la regex

### Stakeholders non sauvegardés
- Vérifier les logs PM2
- Vérifier que les migrations sont appliquées
- Vérifier les valeurs power/interest (doivent être 1-5)

---

## 📊 Test de Validation des IDs

Ouvrir dans le navigateur :
```
file:///path/to/tools/stakeholder-mapping/test-id-validation.html
```

Ou depuis le serveur :
```
https://drafts.agile.bastou.dev/tools/stakeholder-mapping/test-id-validation.html
```

**Résultat attendu** : Tous les tests doivent passer (100%)

---

## 🎯 Résultat Attendu

Si tous les tests passent :
- ✅ L'outil fonctionne correctement
- ✅ Les sessions sont créées dans PocketBase
- ✅ Les stakeholders sont sauvegardés
- ✅ Le rechargement fonctionne
- ✅ Les modifications sont persistées

**Temps total** : ~5 minutes

---

**Dernière mise à jour** : 30 Janvier 2025
