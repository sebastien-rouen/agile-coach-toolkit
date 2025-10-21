# 📋 Guide Import Multiple de User Stories

## Vue d'ensemble

L'import multiple permet d'ajouter rapidement plusieurs User Stories en une seule opération via un textarea normalisé.

## Format

### Format Standard
```
Titre | Description
```

### Format Simplifié
```
Titre
```

## Exemples

### Avec Descriptions
```
Login social OAuth | Intégration Google/GitHub/LinkedIn
Dashboard analytics | Métriques temps réel avec Chart.js
Notifications push | Alerts mobiles et desktop
Export PDF | Génération rapports automatiques
Mode hors-ligne | Sync différée des données
```

### Sans Descriptions
```
Recherche globale
Favoris et bookmarks
Partage de contenu
Commentaires et discussions
Tags et catégories
```

### Mixte
```
Login social OAuth | Intégration Google/GitHub/LinkedIn
Dashboard analytics
Notifications push | Alerts mobiles et desktop
Export PDF
Mode hors-ligne | Sync différée des données
```

## Utilisation

### Étape par Étape

1. **Ouvrir la modal**
   - Cliquez sur **➕ Ajouter US** dans le casino

2. **Sélectionner l'onglet**
   - Cliquez sur **📋 Plusieurs Stories**

3. **Saisir les stories**
   - Une story par ligne
   - Format: `Titre | Description` ou `Titre`
   - Les lignes vides sont ignorées

4. **Valider**
   - Cliquez sur **Ajouter toutes les stories**
   - Confirmation avec nombre de stories ajoutées

### Depuis un Fichier

**Préparation :**
```bash
# Créez un fichier texte avec vos stories
nano user-stories.txt
```

**Contenu du fichier :**
```
Login social OAuth | Intégration Google/GitHub/LinkedIn
Dashboard analytics | Métriques temps réel
Notifications push | Alerts mobiles et desktop
```

**Import :**
1. Ouvrez le fichier dans un éditeur de texte
2. Sélectionnez tout (Ctrl+A)
3. Copiez (Ctrl+C)
4. Collez dans le textarea (Ctrl+V)
5. Validez

### Depuis Excel/Sheets

**Préparation dans Excel :**
```
Colonne A: Titre
Colonne B: Description
```

**Export :**
1. Sélectionnez les colonnes A et B
2. Copiez (Ctrl+C)
3. Collez dans un éditeur de texte
4. Remplacez les tabulations par ` | `
5. Copiez le résultat
6. Collez dans le textarea

**Astuce :** Utilisez la fonction CONCATENATE
```excel
=A2&" | "&B2
```

### Depuis JIRA

**Export JIRA :**
1. Filtrez vos issues
2. Export → CSV
3. Ouvrez dans Excel
4. Sélectionnez colonnes "Summary" et "Description"
5. Suivez la procédure Excel ci-dessus

## Règles de Parsing

### Séparateur
- **Pipe** : `|` (recommandé)
- **Espaces** : Trimés automatiquement
- **Lignes vides** : Ignorées

### Validation
```javascript
// Ligne valide
"Login social OAuth | Description" ✅

// Ligne valide (sans description)
"Login social OAuth" ✅

// Ligne ignorée (vide)
"" ❌

// Ligne valide (description vide)
"Login social OAuth | " ✅
```

### Caractères Spéciaux
- **Pipe dans le titre** : Échapper avec `\|`
- **Retours à la ligne** : Une story par ligne
- **Commentaires** : Lignes commençant par `#` ignorées

## Exemples Avancés

### Avec Commentaires
```
# Authentification
Login social OAuth | Intégration Google/GitHub/LinkedIn
Mot de passe oublié | Système de réinitialisation

# Dashboard
Dashboard analytics | Métriques temps réel
Widgets personnalisables | Drag & drop
```

### Import Massif
```
# Sprint 1 - Authentification (10 stories)
Login social OAuth | Intégration Google/GitHub/LinkedIn
Inscription utilisateur | Formulaire avec validation
Mot de passe oublié | Email de réinitialisation
Confirmation email | Lien de validation
Profil utilisateur | Page de gestion du profil
Avatar utilisateur | Upload et crop d'image
Changement mot de passe | Formulaire sécurisé
Déconnexion | Invalidation de session
Authentification 2FA | Double authentification
Gestion des sessions | Liste des sessions actives
```

### Format Structuré
```
# Epic: Authentification
US-001: Login social OAuth | Intégration Google/GitHub/LinkedIn
US-002: Inscription utilisateur | Formulaire avec validation
US-003: Mot de passe oublié | Email de réinitialisation

# Epic: Dashboard
US-004: Dashboard analytics | Métriques temps réel
US-005: Widgets personnalisables | Drag & drop
US-006: Export PDF | Génération de rapports
```

## Bonnes Pratiques

### ✅ À Faire

**Descriptions claires :**
```
✅ Login social OAuth | Intégration Google, GitHub et LinkedIn avec gestion tokens
❌ Login | Faire le login
```

**Organisation par Epic :**
```
# Epic: Authentification
Login social OAuth | ...
Inscription | ...

# Epic: Dashboard
Analytics | ...
Widgets | ...
```

**Numérotation :**
```
US-001: Login social OAuth | ...
US-002: Inscription | ...
US-003: Mot de passe oublié | ...
```

### ❌ À Éviter

**Descriptions trop longues :**
```
❌ Login | Implémenter un système complet d'authentification avec OAuth 2.0 
    supportant Google, GitHub, LinkedIn, Facebook, Twitter avec gestion 
    des tokens, refresh tokens, révocation, etc.
    
✅ Login social OAuth | Intégration Google, GitHub et LinkedIn
```

**Mélange de formats :**
```
❌ Login social OAuth | Description
    Dashboard analytics - Description
    Notifications push: Description
    
✅ Login social OAuth | Description
    Dashboard analytics | Description
    Notifications push | Description
```

**Stories trop grosses :**
```
❌ Refonte complète du système | Tout refaire
✅ Découper en plusieurs stories de 3-8 points
```

## Cas d'Usage

### Sprint Planning
```
1. Product Owner prépare le backlog dans Excel
2. Export en format texte
3. Import multiple dans le casino
4. Estimation collaborative en équipe
```

### Backlog Refinement
```
1. Équipe brainstorme les stories
2. Saisie rapide dans le textarea
3. Ajout en masse
4. Affinage des descriptions après
```

### Migration depuis JIRA
```
1. Export CSV depuis JIRA
2. Transformation du format
3. Import multiple
4. Vérification et ajustements
```

### Préparation de Release
```
1. Liste des features de la release
2. Découpage en User Stories
3. Import multiple par Epic
4. Estimation et priorisation
```

## Dépannage

### "Aucune User Story valide trouvée"
**Causes :**
- Toutes les lignes sont vides
- Format incorrect sur toutes les lignes
- Commentaires uniquement

**Solution :**
- Vérifiez qu'au moins une ligne contient un titre
- Respectez le format `Titre | Description`

### Stories dupliquées
**Prévention :**
- Vérifiez avant l'import
- Utilisez la modal de gestion pour supprimer les doublons

### Descriptions tronquées
**Cause :**
- Plusieurs pipes `|` dans la ligne

**Solution :**
- Seuls les deux premiers segments sont pris
- `Titre | Description | Autre` → Titre et Description uniquement

### Caractères spéciaux
**Problème :**
- Emojis, accents, caractères spéciaux

**Solution :**
- Tous les caractères UTF-8 sont supportés
- Pas de limitation

## Statistiques

### Performance
- **Vitesse** : ~100 stories/seconde
- **Limite** : Aucune limite technique
- **Recommandation** : 50-100 stories par import

### Validation
- **Taux de succès** : 99%+ si format respecté
- **Lignes ignorées** : Vides et commentaires
- **Erreurs** : Affichées dans la notification

## Évolutions Futures

### Version 2.2
- 📁 **Import fichier** : Upload direct de fichier .txt
- 🔄 **Import CSV** : Support natif du format CSV
- 📋 **Templates** : Modèles pré-remplis par domaine
- 🔍 **Validation avancée** : Détection de doublons

### Version 2.3
- 🤖 **IA génération** : Génération automatique de descriptions
- 📊 **Analyse** : Statistiques sur les stories importées
- 🔗 **Sync JIRA** : Import direct depuis JIRA
- 💾 **Historique** : Traçabilité des imports

---

**Version** : 2.1.0  
**Dernière mise à jour** : 19 janvier 2025  
**Auteur** : Team Velocity Dashboard

**Fichier d'exemple** : `examples/user-stories-example.txt`
