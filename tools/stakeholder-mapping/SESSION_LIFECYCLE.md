# 🔄 Cycle de Vie d'une Session - Stakeholder Mapping

## Vue d'Ensemble

Une session passe par plusieurs états depuis sa création jusqu'à son partage. Voici le cycle complet.

---

## 📊 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────┐
│                    PREMIÈRE VISITE                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Aucun sessionId │
                  │    dans l'URL    │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Génération d'un  │
                  │  ID unique local │
                  │  (Utils.generateId)│
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Mise à jour URL │
                  │ ?sessionId=xxxxx │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Session LOCALE   │
                  │ (localStorage)   │
                  └──────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Utilisateur ajoute des  │
              │     stakeholders        │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Clic sur "💾 Sauvegarder"│
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Création dans PocketBase│
              │  - Session (avec ID)    │
              │  - Stakeholders         │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │ Session PERSISTÉE       │
              │ (PocketBase)            │
              └─────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  VISITE AVEC URL PARTAGÉE                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  sessionId dans  │
                  │      l'URL       │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Tentative de     │
                  │ chargement depuis│
                  │   PocketBase     │
                  └──────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │ Session      │        │ Session      │
        │ EXISTE       │        │ N'EXISTE PAS │
        │ (200 OK)     │        │ (404)        │
        └──────────────┘        └──────────────┘
                │                       │
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │ Chargement   │        │ Initialisation│
        │ session +    │        │ session locale│
        │ stakeholders │        │ (vide)       │
        └──────────────┘        └──────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                  ┌──────────────────┐
                  │ Session PRÊTE    │
                  │ (affichage UI)   │
                  └──────────────────┘
```

---

## 🎯 États d'une Session

### 1️⃣ État : LOCALE (Non Sauvegardée)

**Caractéristiques** :
- ✅ ID généré localement
- ✅ URL mise à jour avec sessionId
- ✅ Données en localStorage uniquement
- ❌ Pas encore dans PocketBase
- ❌ Non partageable (données locales)

**Console** :
```
✨ Création d'une nouvelle session
🔗 URL mise à jour avec sessionId: mhdoi14c1h7u37w3klaj
✅ Session locale prête (0 stakeholders)
```

**Actions possibles** :
- Ajouter des stakeholders
- Modifier le nom de session
- Sauvegarder dans PocketBase

---

### 2️⃣ État : PERSISTÉE (Sauvegardée)

**Caractéristiques** :
- ✅ ID dans l'URL
- ✅ Données en localStorage
- ✅ Données dans PocketBase
- ✅ Partageable via URL

**Console** :
```
💾 Sauvegarde: 3 créés, 0 mis à jour
✨ Nouvelle session créée avec ID: mhdoi14c1h7u37w3klaj
Session sauvegardée (3 créés, 0 mis à jour)
```

**Actions possibles** :
- Ajouter/modifier/supprimer des stakeholders
- Partager l'URL
- Recharger depuis PocketBase

---

### 3️⃣ État : CHARGÉE (Depuis URL)

**Caractéristiques** :
- ✅ ID dans l'URL
- ✅ Chargement depuis PocketBase
- ✅ Synchronisée avec la base

**Console (session existe)** :
```
📂 Chargement de la session depuis l'URL: mhdoi14c1h7u37w3klaj
✅ PocketBase connecté
✅ Session chargée (3 stakeholders)
```

**Console (session n'existe pas encore)** :
```
📂 Chargement de la session depuis l'URL: mhdoi14c1h7u37w3klaj
✅ PocketBase connecté
📝 Session mhdoi14c1h7u37w3klaj n'existe pas encore dans PocketBase
💡 Elle sera automatiquement créée lors de la première sauvegarde
✅ Session locale prête (0 stakeholders)
```

---

## 🔄 Scénarios d'Usage

### Scénario 1 : Création Simple

1. **Utilisateur A** ouvre l'outil
2. URL devient : `?sessionId=abc123def456`
3. Ajoute 3 stakeholders
4. Clique "💾 Sauvegarder"
5. Session créée dans PocketBase
6. ✅ Session partageable

---

### Scénario 2 : Partage d'URL (Session Sauvegardée)

1. **Utilisateur A** copie l'URL : `?sessionId=abc123def456`
2. **Utilisateur B** ouvre cette URL
3. Système charge depuis PocketBase
4. ✅ Utilisateur B voit les 3 stakeholders

---

### Scénario 3 : Partage d'URL (Session Non Sauvegardée)

1. **Utilisateur A** copie l'URL : `?sessionId=abc123def456`
2. **Utilisateur A** n'a pas encore sauvegardé
3. **Utilisateur B** ouvre cette URL
4. Système tente de charger → 404
5. ⚠️ Utilisateur B voit une session vide
6. Les données de A sont uniquement en local

**Solution** : Utilisateur A doit sauvegarder avant de partager

---

### Scénario 4 : Modification Collaborative

1. **Utilisateur A** sauvegarde une session
2. **Utilisateur B** charge la même URL
3. **Utilisateur B** ajoute un stakeholder
4. **Utilisateur B** sauvegarde
5. **Utilisateur A** recharge la page
6. ✅ Utilisateur A voit le nouveau stakeholder

---

## 💾 Persistance des Données

### LocalStorage (Automatique)

```javascript
// Sauvegarde automatique à chaque modification
localStorage.setItem('stakeholder-mapping-session', JSON.stringify({
    session: DataManager.currentSession,
    stakeholders: DataManager.stakeholders
}));
```

**Avantages** :
- ✅ Sauvegarde instantanée
- ✅ Fonctionne hors ligne
- ✅ Pas besoin de PocketBase

**Limites** :
- ❌ Données locales au navigateur
- ❌ Non partageable
- ❌ Perdu si cache effacé

---

### PocketBase (Manuel)

```javascript
// Sauvegarde manuelle via bouton "💾 Sauvegarder"
await PocketBaseIntegration.saveSession();
```

**Avantages** :
- ✅ Données centralisées
- ✅ Partageable via URL
- ✅ Persistant
- ✅ Accessible depuis n'importe quel navigateur

**Limites** :
- ❌ Nécessite une action utilisateur
- ❌ Nécessite PocketBase actif

---

## 🔍 Débogage

### Vérifier l'État d'une Session

**Dans la console** :
```javascript
// Voir la session actuelle
console.log(DataManager.currentSession);

// Voir les stakeholders
console.log(DataManager.stakeholders);

// Vérifier si PocketBase est actif
console.log(PocketBaseIntegration.usePocketBase);
```

**Dans PocketBase Admin** :
```
http://localhost:8116/_/collections?collectionId=tools_stakeholder_mapping_sessions
```

---

## 📋 Checklist de Partage

Avant de partager une URL :

- [ ] Session sauvegardée dans PocketBase
- [ ] Notification "Session sauvegardée" affichée
- [ ] Vérification dans PocketBase Admin
- [ ] Test de l'URL dans un onglet privé
- [ ] Stakeholders visibles après rechargement

---

## 🎓 Bonnes Pratiques

### ✅ À Faire

1. **Sauvegarder régulièrement** : Cliquer sur "💾 Sauvegarder" après chaque modification importante
2. **Vérifier avant de partager** : S'assurer que la session est sauvegardée
3. **Tester l'URL** : Ouvrir dans un onglet privé pour vérifier
4. **Nommer les sessions** : Donner un nom explicite pour faciliter l'identification

### ❌ À Éviter

1. **Partager sans sauvegarder** : L'URL ne contiendra pas les données
2. **Modifier sans sauvegarder** : Les modifications restent locales
3. **Effacer le cache** : Perte des données non sauvegardées
4. **Utiliser plusieurs onglets** : Risque de désynchronisation

---

**Dernière mise à jour** : 30 Janvier 2025  
**Version** : 1.1.0
