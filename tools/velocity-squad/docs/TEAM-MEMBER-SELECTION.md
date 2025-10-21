# 👥 Sélection de Membre Existant - Guide d'Utilisation

## 🎯 Objectif

Faciliter l'ajout de membres d'équipe en permettant de sélectionner un membre existant (actif ou sorti) pour pré-remplir automatiquement les champs du formulaire. Cette fonctionnalité est particulièrement utile pour :

- **Réintégrer un membre sorti** : Un membre qui revient dans l'équipe après une absence
- **Dupliquer un profil** : Créer un nouveau membre avec des compétences similaires
- **Corriger une erreur** : Recréer un membre supprimé par erreur

---

## 🚀 Utilisation

### 1. Ouvrir le Formulaire d'Ajout

1. Cliquer sur le bouton **"👥 Membres"** dans l'action-bar
2. Dans la modal "👥 Configuration Équipe", cliquer sur **"➕ Ajouter Membre"**
3. Le formulaire d'ajout s'affiche

### 2. Sélectionner un Membre Existant (Optionnel)

Au début du formulaire, vous trouverez une liste déroulante :

```
📋 Sélectionner un membre existant (optionnel):
[-- Nouveau membre --]
```

**Options disponibles** :

- **-- Nouveau membre --** : Formulaire vierge pour créer un nouveau membre
- **👥 Membres actifs** : Liste des membres actuellement dans l'équipe
- **🚪 Membres sortis** : Liste des membres qui ont quitté l'équipe

### 3. Pré-remplissage Automatique

Lorsque vous sélectionnez un membre dans la liste :

✅ **Nom** : Pré-rempli avec le nom du membre  
✅ **Rôle** : Pré-rempli avec le rôle du membre  
✅ **Compétences** : Pré-rempli avec les compétences (séparées par des virgules)  
✅ **Capacité** : Pré-rempli avec la capacité (%)

**Vous pouvez ensuite modifier ces valeurs avant de sauvegarder.**

### 4. Sauvegarder

1. Modifiez les champs si nécessaire
2. Cliquez sur **"💾 Sauvegarder"**
3. Le nouveau membre est ajouté à l'équipe

---

## 📋 Cas d'Usage

### Cas 1 : Réintégrer un Membre Sorti

**Contexte** : Marie Dupont a quitté l'équipe en juin 2024 et revient en janvier 2025.

**Étapes** :
1. Ouvrir le formulaire d'ajout de membre
2. Sélectionner "Marie Dupont - Développeur Frontend" dans **🚪 Membres sortis**
3. Les champs sont pré-remplis avec ses anciennes informations
4. Modifier si nécessaire (ex: nouveau rôle, nouvelles compétences)
5. Sauvegarder

**Résultat** : Marie est ajoutée comme nouveau membre avec ses compétences d'origine.

### Cas 2 : Dupliquer un Profil

**Contexte** : Vous recrutez un nouveau développeur avec des compétences similaires à Jean Martin.

**Étapes** :
1. Ouvrir le formulaire d'ajout de membre
2. Sélectionner "Jean Martin - Développeur Backend" dans **👥 Membres actifs**
3. Les champs sont pré-remplis
4. Modifier le nom : "Sophie Bernard"
5. Ajuster les compétences si nécessaire
6. Sauvegarder

**Résultat** : Sophie est ajoutée avec un profil similaire à Jean.

### Cas 3 : Corriger une Suppression

**Contexte** : Vous avez supprimé par erreur un membre actif.

**Étapes** :
1. Ouvrir le formulaire d'ajout de membre
2. Sélectionner le membre dans **🚪 Membres sortis** (il apparaît après suppression)
3. Les champs sont pré-remplis
4. Sauvegarder immédiatement

**Résultat** : Le membre est recréé avec toutes ses informations.

---

## 🎨 Interface

### Liste Déroulante

```
📋 Sélectionner un membre existant (optionnel):
┌─────────────────────────────────────────┐
│ -- Nouveau membre --                    │
├─────────────────────────────────────────┤
│ 👥 Membres actifs                       │
│   Marie Dupont - Développeur Frontend   │
│   Jean Martin - Développeur Backend     │
│   Sophie Bernard - Product Owner        │
├─────────────────────────────────────────┤
│ 🚪 Membres sortis                       │
│   Pierre Durand - Scrum Master          │
│   Lucie Petit - Designer UX             │
└─────────────────────────────────────────┘
```

### Formulaire Pré-rempli

Après sélection de "Marie Dupont - Développeur Frontend" :

```
Nom: [Marie Dupont                    ]
Rôle: [Développeur Frontend           ]
Compétences: [React, TypeScript, CSS  ]
Capacité (%): [100                    ]
```

---

## 🔧 Fonctionnalités Techniques

### Méthodes JavaScript

#### `populateExistingMembersSelect()`
Peuple la liste déroulante avec tous les membres existants.

**Comportement** :
- Récupère tous les membres de `this.data.team`
- Sépare les membres actifs et sortis
- Crée deux groupes (`<optgroup>`) dans le `<select>`

#### `prefillMemberForm(memberId)`
Pré-remplit le formulaire avec les données d'un membre.

**Paramètres** :
- `memberId` : ID du membre sélectionné

**Comportement** :
- Si `memberId` est vide : réinitialise le formulaire
- Sinon : charge les données du membre et remplit les champs

#### `resetMemberForm()`
Réinitialise tous les champs du formulaire.

**Comportement** :
- Réinitialise la liste déroulante à "-- Nouveau membre --"
- Vide tous les champs de saisie
- Remet la capacité à 100%

---

## 💡 Bonnes Pratiques

### ✅ À Faire

- **Vérifier les informations** : Toujours vérifier les champs pré-remplis avant de sauvegarder
- **Mettre à jour les compétences** : Si un membre revient après une longue absence, il peut avoir acquis de nouvelles compétences
- **Ajuster la capacité** : Vérifier si le membre revient à temps plein ou partiel

### ❌ À Éviter

- **Ne pas modifier le nom** : Si vous dupliquez un profil, pensez à changer le nom
- **Ne pas oublier les dates** : Pour un membre qui revient, pensez à mettre à jour les dates d'arrivée/sortie
- **Ne pas créer de doublons** : Vérifiez qu'un membre n'existe pas déjà avant de le créer

---

## 🐛 Dépannage

### La liste déroulante est vide

**Cause** : Aucun membre n'existe dans l'équipe.

**Solution** : Créez d'abord un membre en laissant la liste sur "-- Nouveau membre --".

### Les champs ne se pré-remplissent pas

**Cause** : Problème JavaScript ou membre introuvable.

**Solution** :
1. Ouvrir la console navigateur (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier que `this.data.team` contient des membres

### Un membre sorti n'apparaît pas

**Cause** : Le membre n'a pas de date de sortie (`endDate`).

**Solution** : Vérifier dans PocketBase que le champ `end_date` est rempli.

---

## 📚 Références

- **Gestion de l'équipe** : `docs/TEAM-MANAGER.md`
- **Membres actifs/sortis** : `docs/TEAM-MANAGER.md#membres-sortis`
- **PocketBase Integration** : `docs/README-POCKETBASE.md`

---

## ✅ Checklist d'Implémentation

- [x] Liste déroulante ajoutée dans le formulaire
- [x] Groupement des membres (actifs/sortis)
- [x] Pré-remplissage automatique des champs
- [x] Réinitialisation du formulaire
- [x] Gestion des événements (change, click)
- [x] Documentation complète
- [x] CHANGELOG mis à jour

---

**Date de création** : 27 octobre 2025  
**Version** : 1.0.0  
**Auteur** : Kiro AI Assistant
