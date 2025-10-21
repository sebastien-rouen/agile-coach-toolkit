# 📘 Guide d'Utilisation - Program Increment (PI) Planning

## 🎯 Qu'est-ce qu'un Program Increment ?

Un **Program Increment (PI)** est un concept clé du framework SAFe (Scaled Agile Framework). C'est une période de temps fixe (généralement 8-12 semaines) pendant laquelle une Agile Release Train (ART) livre de la valeur incrémentale sous forme de systèmes fonctionnels et testés.

### Caractéristiques d'un PI

- **Durée** : Typiquement 5 sprints de 2 semaines (10 semaines)
- **Événement clé** : PI Planning (2 jours en présentiel ou remote)
- **Objectif** : Aligner toutes les équipes sur une vision commune
- **Livrable** : Incrément de solution intégré et testé

---

## 🚀 Utilisation dans Team Velocity Dashboard

### 1. Créer un Program Increment

#### Via PocketBase Admin

1. **Accéder à l'interface PocketBase**
   ```
   http://localhost:8116/_/        # Drafts
   http://localhost:8117/_/        # Production
   ```

2. **Naviguer vers la collection**
   - Collection : `tools_velocity_squad_pi`

3. **Créer un nouvel enregistrement**
   - **session** : Sélectionner la session active
   - **name** : Nom du PI (ex: "PI 2025.1", "Q1 2025")
   - **startDate** : Date de début du PI (ex: 2025-01-06)
   - **endDate** : Date de fin du PI (ex: 2025-03-14)
   - **location** : Localisation du PI Planning
     - "Remote" → Affiche 🏠
     - Adresse exacte → Affiche 📍
   - **comment** : Objectifs, notes, contexte
   - **sprints** : (Optionnel) JSON des IDs de sprints

#### Exemple de Données

```json
{
  "name": "PI 2025.1",
  "startDate": "2025-01-06",
  "endDate": "2025-03-14",
  "location": "Remote",
  "comment": "Objectifs: Migration cloud, Refonte UX, API v2",
  "sprints": ["sprint-1", "sprint-2", "sprint-3", "sprint-4", "sprint-5"]
}
```

---

### 2. Visualisation sur le Graphique

#### Affichage Automatique

Une fois le PI créé, il apparaît automatiquement sur le graphique de vélocité :

**Caractéristiques visuelles :**
- 🔵 Barre horizontale bleue avec flèche
- 📍 Icône de localisation (🏠 remote / 📍 présentiel)
- 📝 Nom du PI centré sur la barre
- 📊 Positionnée sous les noms des sprints

**Calcul automatique :**
- Le système identifie tous les sprints entre `startDate` et `endDate`
- La barre s'étend du premier au dernier sprint du PI
- Mise à jour automatique lors de l'ajout de nouveaux sprints

---

### 3. Bonnes Pratiques

#### Nommage des PIs

**Recommandations :**
- ✅ `PI 2025.1` : Année + numéro séquentiel
- ✅ `Q1 2025` : Trimestre + année
- ✅ `Release 5.0` : Version majeure
- ❌ `PI Planning` : Trop générique
- ❌ `Sprint 1-5` : Confusion avec les sprints

#### Durée Typique

**SAFe Standard :**
- 5 sprints de 2 semaines = 10 semaines
- 4 sprints de 2 semaines = 8 semaines
- 6 sprints de 2 semaines = 12 semaines

**Événements inclus :**
- Sprint 1-4 : Développement
- Sprint 5 : Innovation & Planning (IP Sprint)

#### Localisation

**Exemples :**
- `Remote` → PI Planning en visioconférence
- `Paris - La Défense` → Adresse exacte
- `Siège social` → Lieu générique
- `Hybrid (50% remote)` → Mode mixte

#### Commentaires Utiles

**Que noter :**
- 🎯 Objectifs du PI (3-5 objectifs SMART)
- 🚀 Features majeures prévues
- 🔗 Dépendances inter-équipes
- ⚠️ Risques identifiés
- 📊 Métriques cibles (vélocité, qualité)

**Exemple :**
```
Objectifs PI 2025.1:
1. Migration 80% des services vers AWS
2. Refonte complète du dashboard utilisateur
3. API v2 avec authentification OAuth2
4. Réduction temps de build de 50%
5. Couverture de tests > 85%

Risques:
- Dépendance équipe Infrastructure (Sprint 2)
- Formation OAuth2 nécessaire (Sprint 1)
```

---

## 📊 Cas d'Usage

### Scénario 1 : Équipe Scrum Classique

**Contexte :**
- Équipe de 5 développeurs
- Sprints de 2 semaines
- Pas de coordination multi-équipes

**Utilisation des PIs :**
- ❌ Non recommandé (overhead inutile)
- ✅ Utiliser uniquement les sprints

---

### Scénario 2 : Agile Release Train (ART)

**Contexte :**
- 3-5 équipes Scrum
- Coordination nécessaire
- Livraison synchronisée

**Utilisation des PIs :**
- ✅ Fortement recommandé
- Créer un PI tous les 10-12 semaines
- Aligner toutes les équipes sur le même PI

**Exemple :**
```
PI 2025.1 (10 semaines)
├── Équipe Frontend : 5 sprints
├── Équipe Backend : 5 sprints
├── Équipe DevOps : 5 sprints
└── PI Planning : J1-J2 du PI
```

---

### Scénario 3 : Portfolio SAFe

**Contexte :**
- Plusieurs ARTs
- Coordination stratégique
- Roadmap produit complexe

**Utilisation des PIs :**
- ✅ Essentiel pour la synchronisation
- Créer des PIs alignés entre ARTs
- Utiliser les commentaires pour les dépendances

**Exemple :**
```
Q1 2025 (12 semaines)
├── ART Mobile : PI 2025.1
├── ART Web : PI 2025.1
├── ART Data : PI 2025.1
└── Solution Demo : Fin de chaque PI
```

---

## 🔧 Configuration Avancée

### Sprints JSON

**Format :**
```json
{
  "sprints": [
    "sprint-id-1",
    "sprint-id-2",
    "sprint-id-3",
    "sprint-id-4",
    "sprint-id-5"
  ]
}
```

**Utilité :**
- Liaison explicite des sprints au PI
- Filtrage et reporting par PI
- Calcul de métriques PI (vélocité cumulée, prédictibilité)

---

### Métriques PI (à venir v3.7.0)

**Prévues :**
- 📊 Vélocité cumulée du PI
- 🎯 % d'objectifs atteints
- 📈 Prédictibilité (planned vs actual)
- 🔥 Burndown PI
- 📉 Burnup PI

---

## 🎓 Ressources SAFe

### Documentation Officielle

- [SAFe Official Website](https://scaledagileframework.com/)
- [Program Increment](https://scaledagileframework.com/program-increment/)
- [PI Planning](https://scaledagileframework.com/pi-planning/)
- [PI Objectives](https://scaledagileframework.com/pi-objectives/)

### Événements PI

**PI Planning (2 jours) :**
- Jour 1 : Vision, contexte, draft plan
- Jour 2 : Finalisation, risques, objectifs

**Autres Événements :**
- System Demo (fin de chaque sprint)
- Inspect & Adapt (fin du PI)
- Innovation & Planning Sprint (dernier sprint du PI)

---

## ❓ FAQ

### Q: Puis-je avoir plusieurs PIs actifs en même temps ?

**R:** Oui, mais ce n'est pas recommandé dans SAFe. Un ART travaille sur un seul PI à la fois. Cependant, vous pouvez avoir des PIs historiques et un PI actif.

---

### Q: Comment supprimer un PI ?

**R:** Via PocketBase Admin :
1. Accéder à la collection `tools_velocity_squad_pi`
2. Sélectionner le PI à supprimer
3. Cliquer sur "Delete"

---

### Q: Le PI n'apparaît pas sur le graphique, pourquoi ?

**R:** Vérifiez :
- ✅ Les dates `startDate` et `endDate` sont correctes
- ✅ Il existe des sprints entre ces dates
- ✅ La session est correctement liée
- ✅ Le graphique est en mode Scrum (pas Kanban)

---

### Q: Puis-je modifier un PI après sa création ?

**R:** Oui, via PocketBase Admin. Les modifications sont reflétées immédiatement sur le graphique.

---

### Q: Comment gérer un PI qui chevauche deux trimestres ?

**R:** Utilisez un nom descriptif comme "PI 2025.1-2" ou "Q4-Q1 2025" et ajustez les dates en conséquence.

---

## 🚀 Prochaines Fonctionnalités

**Version 3.7.0 (prévue) :**
- 📋 Modal UI pour créer/modifier les PIs
- 🔗 Liaison automatique des sprints
- 📊 Dashboard métriques PI
- 🎨 Personnalisation des couleurs
- 📅 Synchronisation avec les événements

---

## 📞 Support

Pour toute question ou suggestion :
- 📧 Créer une issue sur le repository
- 💬 Contacter l'équipe de développement
- 📚 Consulter la documentation SAFe officielle
