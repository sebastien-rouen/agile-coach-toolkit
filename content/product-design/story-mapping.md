---
title: "Story Mapping : visualiser le parcours utilisateur (TO REVIEW)"
description: "Technique collaborative pour construire un backlog produit centré utilisateur"
category: "product-design"
tags: ["story-mapping", "product-owner", "backlog", "user-journey"]
difficulty: "intermédiaire"
duration: "15 min"
author: "Coach Agile Toolkit"
lastUpdate: "2025-10-22"
---

# Story Mapping : visualiser le parcours utilisateur

## 🎯 Objectif

Créer une représentation visuelle du parcours utilisateur pour construire un backlog produit priorisé, partagé et centré sur la valeur.

---

## 📚 Qu'est-ce que le Story Mapping ?

### Définition

Le Story Mapping est une technique inventée par Jeff Patton qui permet de visualiser le parcours utilisateur sous forme de carte 2D, facilitant la priorisation et la planification des releases.

**Principe**
> "Raconter l'histoire de l'utilisateur de gauche à droite, et prioriser de haut en bas"

### Pourquoi Story Mapping ?

**Problèmes du backlog classique**
- ❌ Liste plate sans contexte
- ❌ Perte de la vision d'ensemble
- ❌ Difficile de prioriser
- ❌ Pas de lien avec le parcours utilisateur

**Avantages du Story Mapping**
- ✅ Vision d'ensemble du produit
- ✅ Priorisation par valeur utilisateur
- ✅ Identification des MVP
- ✅ Collaboration équipe + stakeholders
- ✅ Détection des gaps

---

## 🗺️ Structure d'une Story Map

### Anatomie

```
┌─────────────────────────────────────────────────────────┐
│  Backbone (Épine dorsale)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Activité │  │ Activité │  │ Activité │             │
│  │    1     │  │    2     │  │    3     │             │
│  └──────────┘  └──────────┘  └──────────┘             │
├─────────────────────────────────────────────────────────┤
│  Walking Skeleton (Squelette)                           │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │ Tâche│  │ Tâche│  │ Tâche│  │ Tâche│               │
│  │  1.1 │  │  2.1 │  │  3.1 │  │  1.2 │               │
│  └──────┘  └──────┘  └──────┘  └──────┘               │
├─────────────────────────────────────────────────────────┤
│  MVP / Release 1                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐                         │
│  │Story │  │Story │  │Story │                         │
│  │  A   │  │  B   │  │  C   │                         │
│  └──────┘  └──────┘  └──────┘                         │
├─────────────────────────────────────────────────────────┤
│  Release 2                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐                         │
│  │Story │  │Story │  │Story │                         │
│  │  D   │  │  E   │  │  F   │                         │
│  └──────┘  └──────┘  └──────┘                         │
└─────────────────────────────────────────────────────────┘
```

### Niveaux

**1. Activités (Backbone)**
- Actions principales de l'utilisateur
- Ordre chronologique (gauche → droite)
- Exemple : "Rechercher un produit", "Ajouter au panier", "Payer"

**2. Tâches (Walking Skeleton)**
- Étapes détaillées de chaque activité
- Toujours sous l'activité parente
- Exemple : "Filtrer par prix", "Trier par popularité"

**3. Stories (Détails)**
- Implémentations spécifiques
- Priorisées de haut en bas
- Exemple : "Filtrer par fourchette de prix", "Filtrer par marque"

**4. Releases (Lignes horizontales)**
- Découpage en versions
- MVP, Release 1, Release 2...

---

## 🛠️ Comment Créer une Story Map ?

### Étape 1 : Préparer l'Atelier (30 min)

**Participants**
- Product Owner (facilitateur)
- Équipe de développement
- Designer UX
- Stakeholders clés
- Utilisateurs (si possible)

**Matériel**
- **Physique** : Post-its, marqueurs, mur/tableau
- **Digital** : Miro, Mural, StoriesOnBoard

**Durée**
- 2-4 heures selon la complexité

### Étape 2 : Identifier les Personas (15 min)

**Qui sont les utilisateurs ?**
```
Persona 1 : Marie, 35 ans, acheteuse régulière
- Besoins : Rapidité, fiabilité
- Frustrations : Processus de paiement long

Persona 2 : Thomas, 28 ans, premier achat
- Besoins : Clarté, réassurance
- Frustrations : Manque d'informations produit
```

**Choisir le persona principal**
- Celui qui représente 80% des utilisateurs
- Ou celui avec le plus de valeur business

### Étape 3 : Raconter l'Histoire (30 min)

**Technique du "User Journey"**

1. **Démarrer par le début**
   - "Marie veut acheter un livre"

2. **Dérouler le parcours**
   - Rechercher → Comparer → Choisir → Acheter → Recevoir

3. **Identifier les activités principales**
   - Post-it par activité
   - Ordre chronologique
   - Verbes d'action

**Exemple : E-commerce**
```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Rechercher│  │ Comparer │  │ Acheter  │  │ Recevoir │
│  produit │  │ produits │  │  produit │  │  produit │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

<div style="font-family:Arial,sans-serif;border:1px solid #ddd;border-radius:8px;padding:20px;background-color:#f8f9fa;box-shadow:0 4px 6px rgba(0,0,0,0.1);margin:20px 0;">
<div style="text-align:center;color:#2c3e50;margin-bottom:20px;">Story Map : Parcours d'Achat en Ligne</div>
<div style="display:flex;justify-content:space-around;margin-bottom:20px;padding:10px;background-color:#5f6061;border-radius:4px;">
<div><span style="color:#e74c3c;">🟥</span> Activités</div>
<div><span style="color:#3498db;">🟦</span> Tâches</div>
<div><span style="color:#2ecc71;">🟩</span> Stories</div>
<div><span style="color:#9b59b6;">🟪</span> Releases</div>
</div>
<div style="display:flex;">
<div style="display:flex;flex-direction:column;width:25%;">
<div style="background-color:#e74c3c;color:white;padding:10px;margin:5px;border-radius:4px;text-align:center;">Rechercher</div>
<div style="display:flex;flex-direction:column;">
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Saisir mot-clé</div>
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Filtrer par catégorie</div>
</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;">
<div style="background-color:#e74c3c;color:white;padding:10px;margin:5px;border-radius:4px;text-align:center;">Comparer</div>
<div style="display:flex;flex-direction:column;">
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Voir détails</div>
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Comparer prix</div>
</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;">
<div style="background-color:#e74c3c;color:white;padding:10px;margin:5px;border-radius:4px;text-align:center;">Acheter</div>
<div style="display:flex;flex-direction:column;">
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Ajouter au panier</div>
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Payer</div>
</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;">
<div style="background-color:#e74c3c;color:white;padding:10px;margin:5px;border-radius:4px;text-align:center;">Recevoir</div>
<div style="display:flex;flex-direction:column;">
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Suivre livraison</div>
<div style="background-color:#3498db;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">Noter produit</div>
</div>
</div>
</div>
<div style="display:flex;position:relative;">
<div style="position:relative;left:-80px;background-color:#9b59b6;color:white;padding:5px 10px;border-radius:4px;font-weight:bold;align-content:center;width:55px;text-align: center;margin-bottom:5px;">MVP</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US1: Barre de recherche</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US2: Filtres basiques</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US3: Fiche produit</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US4: Panier simple</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US5: Paiement CB</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US6: Email confirmation</div>
</div>
</div>
<div style="display:flex;position:relative;">
<div style="position:relative;left:-80px;background-color:#9b59b6;color:white;padding:5px 10px;border-radius:4px;font-weight:bold;align-content: center;width:55px;text-align: center;margin-bottom:5px;">V1</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US7: Recherche avancée</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US8: Filtres dynamiques</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US9: Comparatif produits</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US10: Panier persistant</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US11: Paiement PayPal</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US12: Suivi livraison</div>
</div>
</div>
<div style="display:flex;position:relative;">
<div style="position:relative;left:-80px;background-color:#9b59b6;color:white;padding:5px 10px;border-radius:4px;font-weight:bold;align-content: center;width:55px;text-align: center;margin-bottom:5px;">V2</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US13: Recherche vocale</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US14: Recommandations IA</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US15: Vidéo 360° produit</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US16: Paiement crypto</div>
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US17: Abonnement</div>
</div>
<div style="display:flex;flex-direction:column;width:25%;border-top:2px dashed #9b59b6;padding-top:10px;">
<div style="background-color:#2ecc71;color:white;padding:8px;margin:2px;border-radius:4px;font-size:14px;">US18: Livraison drone</div>
</div>
</div>
</div>


### Étape 4 : Détailler les Tâches (45 min)

**Pour chaque activité, lister les tâches**

**Activité : Rechercher produit**
- Saisir un mot-clé
- Filtrer par catégorie
- Filtrer par prix
- Trier les résultats
- Voir les détails

**Technique**
- Brainstorming en silence (5 min)
- Chacun écrit ses idées sur post-its
- Regroupement par activité
- Discussion et validation

### Étape 5 : Prioriser (45 min)

**Critères de priorisation**
- **Valeur utilisateur** : Indispensable / Utile / Nice-to-have
- **Valeur business** : ROI, différenciation
- **Risque technique** : Complexité, dépendances
- **Effort** : Estimation en T-shirt sizes (S/M/L/XL)

**Technique MoSCoW**
- **Must have** : MVP (ligne 1)
- **Should have** : Release 1 (ligne 2)
- **Could have** : Release 2 (ligne 3)
- **Won't have** : Backlog futur

**Tracer les lignes de release**
```
─────────────────────────────────────────
         MVP (Must have)
─────────────────────────────────────────
       Release 1 (Should have)
─────────────────────────────────────────
       Release 2 (Could have)
─────────────────────────────────────────
```

### Étape 6 : Valider et Documenter (15 min)

**Questions de validation**
- ✅ Le parcours est-il complet ?
- ✅ Le MVP est-il viable ?
- ✅ Les dépendances sont-elles identifiées ?
- ✅ L'équipe est-elle alignée ?

**Documentation**
- Prendre une photo de la map
- Exporter en PDF (Miro)
- Créer les stories dans Jira
- Partager avec les stakeholders

---

## 💡 Bonnes Pratiques

### Facilitation

**Avant l'atelier**
- ✅ Préparer les personas
- ✅ Définir l'objectif clair
- ✅ Inviter les bonnes personnes
- ✅ Réserver une salle adaptée

**Pendant l'atelier**
- ✅ Timeboxer chaque étape
- ✅ Encourager la participation de tous
- ✅ Utiliser des couleurs (activités, tâches, stories)
- ✅ Faire des pauses régulières

**Après l'atelier**
- ✅ Documenter rapidement
- ✅ Créer les tickets
- ✅ Partager la map
- ✅ Planifier la mise à jour

### Erreurs à Éviter

**❌ Trop de détails**
- Rester au niveau des activités et tâches
- Éviter de descendre au niveau des sous-tâches techniques

**❌ Pas de priorisation**
- Toujours tracer les lignes de release
- Forcer les choix difficiles

**❌ Oublier l'utilisateur**
- Toujours partir du besoin utilisateur
- Pas de features techniques isolées

**❌ Map statique**
- Mettre à jour régulièrement
- Ajouter les learnings

---

## 🎯 Cas d'Usage

### Cas 1 : Nouveau Produit

**Contexte**
- Startup, MVP à définir
- Équipe de 5 personnes
- Budget limité

**Approche**
1. Atelier Story Mapping (4h)
2. Identifier le MVP minimal
3. Découper en sprints de 2 semaines
4. Valider avec des utilisateurs beta

**Résultat**
- MVP livré en 6 semaines
- 3 releases majeures en 6 mois
- Pivot facilité grâce à la map

### Cas 2 : Refonte d'Application

**Contexte**
- Application existante complexe
- Besoin de simplifier
- Équipe de 15 personnes

**Approche**
1. Story Mapping de l'existant
2. Story Mapping de la cible
3. Comparaison et identification des gaps
4. Priorisation par valeur

**Résultat**
- 40% de features supprimées
- Parcours utilisateur simplifié
- Satisfaction +60%

### Cas 3 : Alignement Multi-Équipes

**Contexte**
- 3 équipes sur le même produit
- Dépendances complexes
- Manque de vision partagée

**Approche**
1. Story Mapping collaboratif (toutes les équipes)
2. Identification des dépendances
3. Planification des releases
4. Synchronisation des sprints

**Résultat**
- Vision partagée
- Dépendances anticipées
- Vélocité +30%

---

## 🛠️ Outils

### Physique

**Avantages**
- ✅ Collaboration naturelle
- ✅ Manipulation tactile
- ✅ Créativité stimulée

**Matériel**
- Post-its de 3 couleurs
- Marqueurs épais
- Mur ou tableau blanc
- Ruban adhésif

### Digital

**Miro**
- Template Story Mapping intégré
- Collaboration temps réel
- Export PDF/PNG

**Mural**
- Templates variés
- Intégration Jira
- Facilitation guidée

**StoriesOnBoard**
- Outil dédié Story Mapping
- Intégration Jira/Trello
- Gestion des releases

**Jira**
- Plugin "Easy Agile User Story Maps"
- Synchronisation automatique
- Suivi des sprints

---

## 📚 Ressources

### Livres
- "User Story Mapping" - Jeff Patton
- "Impact Mapping" - Gojko Adzic

### Articles
- [Story Mapping Guide](https://www.jpattonassociates.com/story-mapping/) - Jeff Patton
- [Story Mapping 101](https://www.agilealliance.org/glossary/storymap/)

### Vidéos
- [Story Mapping Explained](https://www.youtube.com/watch?v=AzBuohuOU6g) - Jeff Patton

### Templates
- [Miro Story Mapping Template](https://miro.com/templates/user-story-map/)
- [Mural Story Mapping Template](https://www.mural.co/templates/story-mapping)

---

## ✅ Checklist

**Préparation**
- [ ] Personas définis
- [ ] Participants invités
- [ ] Salle/outil réservé
- [ ] Matériel préparé
- [ ] Objectif clair

**Atelier**
- [ ] Activités identifiées
- [ ] Tâches détaillées
- [ ] Stories créées
- [ ] Releases tracées
- [ ] Consensus obtenu

**Après**
- [ ] Photo/export réalisé
- [ ] Stories créées dans Jira
- [ ] Map partagée
- [ ] Prochaine mise à jour planifiée

---

*À enrichir : Ajouter des photos de story maps réelles, vidéos d'ateliers, templates Miro téléchargeables*
