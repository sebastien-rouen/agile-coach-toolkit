---
title: "User Stories : Écrire des Besoins Utilisateur (TO REVIEW)"
description: "Techniques pour rédiger des user stories efficaces et actionnables"
category: "fondamentaux"
tags: ["user-stories", "backlog", "product-owner", "besoins"]
difficulty: "débutant"
duration: "15 min"
author: "Coach Agile Toolkit"
lastUpdate: "2025-10-22"
---

# User Stories : Écrire des Besoins Utilisateur (TO REVIEW)

## 🎯 Objectif

Maîtriser l'art d'écrire des user stories claires, concises et centrées sur la valeur utilisateur.

---

## 📚 Qu'est-ce qu'une User Story ?

### Définition

Une user story est une description courte et simple d'une fonctionnalité, racontée du point de vue de l'utilisateur final.

**Format classique**
```
En tant que [type d'utilisateur]
Je veux [action/fonctionnalité]
Afin de [bénéfice/valeur]
```

**Exemple**
```
En tant que client
Je veux pouvoir filtrer les produits par prix
Afin de trouver rapidement des articles dans mon budget
```

### Les 3 C de Ron Jeffries

**Card (Carte)**
- Support physique ou digital
- Rappel de conversation
- Pas de spécification complète

**Conversation**
- Discussion entre PO et équipe
- Clarification des besoins
- Collaboration continue

**Confirmation**
- Critères d'acceptation
- Tests de validation
- Definition of Done

---

## ✍️ Rédiger une Bonne User Story

### Critères INVEST

**Independent (Indépendante)**
- Peut être développée seule
- Pas de dépendance forte
- Ordre flexible

**Negotiable (Négociable)**
- Pas un contrat figé
- Détails à discuter
- Adaptable

**Valuable (Valeur)**
- Apporte de la valeur à l'utilisateur
- Bénéfice clair
- Prioritisable

**Estimable (Estimable)**
- Équipe peut estimer la complexité
- Suffisamment claire
- Pas trop vague

**Small (Petite)**
- Réalisable en 1 sprint
- Idéalement 1-3 jours
- Découpable si trop grosse

**Testable (Testable)**
- Critères d'acceptation clairs
- Tests possibles
- Validation objective

---

## 📋 Critères d'Acceptation

### Format Given-When-Then

**Structure**
```
Given [contexte initial]
When [action]
Then [résultat attendu]
```

**Exemple**
```
Given je suis sur la page produits
When je sélectionne le filtre "Prix : 0-50€"
Then seuls les produits entre 0 et 50€ sont affichés
```

### Format Checklist

**Exemple**
```
✓ Le filtre affiche les tranches : 0-50€, 50-100€, 100-200€, 200€+
✓ Les produits sont filtrés en temps réel
✓ Le nombre de résultats est affiché
✓ Le filtre est réinitialisable
✓ Le filtre fonctionne sur mobile
```

---

## 🔪 Découper les User Stories

### Techniques de Découpage

**1. Par Workflow**
```
Story initiale : Gérer mon compte
→ Créer un compte
→ Modifier mon profil
→ Supprimer mon compte
```

**2. Par Règles Métier**
```
Story initiale : Calculer les frais de livraison
→ Livraison standard
→ Livraison express
→ Livraison internationale
```

**3. Par Opérations CRUD**
```
Story initiale : Gérer les produits
→ Créer un produit
→ Lire/Afficher un produit
→ Modifier un produit
→ Supprimer un produit
```

**4. Par Variantes**
```
Story initiale : Payer ma commande
→ Payer par carte bancaire
→ Payer par PayPal
→ Payer par virement
```

**5. Par Spike**
```
Story trop incertaine
→ Spike : Investiguer la faisabilité (2 jours)
→ Puis stories d'implémentation
```

---

## 🎨 Templates et Variantes

### Job Story (Jobs-to-be-Done)

**Format**
```
Quand [situation]
Je veux [motivation]
Afin de [résultat attendu]
```

**Exemple**
```
Quand je reçois une notification de livraison
Je veux pouvoir suivre mon colis en temps réel
Afin de planifier ma présence à la maison
```

### Feature Story

**Format**
```
En tant que [rôle]
Je peux [capacité]
De sorte que [bénéfice]
```

### Spike Story

**Format**
```
En tant que [équipe]
Nous devons [investiguer/prototyper]
Afin de [réduire l'incertitude/valider une approche]
```

---

## 💡 Bonnes Pratiques

### Rédaction

**Do's**
- ✅ Perspective utilisateur
- ✅ Langage simple
- ✅ Focus sur le "quoi" et "pourquoi"
- ✅ Valeur explicite

**Don'ts**
- ❌ Jargon technique
- ❌ Spécifications détaillées
- ❌ Focus sur le "comment"
- ❌ Stories techniques isolées

### Gestion du Backlog

**Priorisation**
- MoSCoW (Must, Should, Could, Won't)
- Value vs Effort
- WSJF (Weighted Shortest Job First)

**Raffinement**
- Grooming régulier (1h/semaine)
- Top 10 stories détaillées
- Reste du backlog en épics

---

## 🚧 Erreurs Courantes

### Story Trop Grosse (Epic)

**Problème**
```
En tant qu'utilisateur
Je veux un système de gestion de commandes complet
Afin de gérer mon e-commerce
```

**Solution**
- Découper en stories plus petites
- Créer un epic parent
- Prioriser les stories

### Story Technique

**Problème**
```
En tant que développeur
Je veux migrer vers PostgreSQL
Afin d'améliorer les performances
```

**Solution**
- Reformuler avec bénéfice utilisateur
- Ou accepter comme story technique si nécessaire
- Lier à une story utilisateur

### Pas de Valeur

**Problème**
```
En tant qu'utilisateur
Je veux un bouton rouge
Afin d'avoir un bouton rouge
```

**Solution**
- Identifier le vrai bénéfice
- Pourquoi rouge ? Visibilité ? Urgence ?
- Reformuler avec la valeur réelle

---

## 📊 Exemples par Domaine

### E-commerce

```
En tant que client
Je veux ajouter des produits à ma wishlist
Afin de les retrouver facilement plus tard

Critères :
✓ Bouton "Ajouter à la wishlist" sur chaque produit
✓ Wishlist accessible depuis le menu
✓ Possibilité de retirer des produits
✓ Notification si produit en promo
```

### SaaS B2B

```
En tant qu'administrateur
Je veux inviter des membres à mon équipe
Afin de collaborer sur les projets

Critères :
✓ Invitation par email
✓ Définition des rôles (admin, membre, viewer)
✓ Limite selon le plan (5, 10, illimité)
✓ Notification de l'invité
```

### Application Mobile

```
En tant qu'utilisateur
Je veux recevoir des notifications push
Afin d'être alerté des événements importants

Critères :
✓ Activation/désactivation des notifications
✓ Choix des types de notifications
✓ Fréquence paramétrable
✓ Fonctionne en arrière-plan
```

---

## 📚 Ressources

### Livres
- "User Stories Applied" - Mike Cohn
- "User Story Mapping" - Jeff Patton

### Outils
- Jira, Azure DevOps
- Trello, Notion
- Miro (Story Mapping)

### Templates
- User Story Template
- Acceptance Criteria Template
- Story Splitting Patterns

---

*À enrichir : Ajouter des exemples de workshops de rédaction, templates téléchargeables, vidéos tutoriels*
