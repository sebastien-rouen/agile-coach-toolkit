---
id: "tres-amigos-example-mapping"
title: "Les 3 Amigos & Example Mapping : Le Duo Gagnant pour Aligner Product & Design"
category: "product-design"
tags: ["3-amigos", "example-mapping", "collaboration", "user-stories", "bdd", "refinement"]
description: "Comment aligner développeurs, testeurs et product owners dès la conception avec des techniques simples et efficaces"
---

# 🤝🎯 Les 3 Amigos & Example Mapping : L'Alliance Secrète pour des User Stories Sans Faille

**Imaginez cette scène :**
*En rétrospective, l’équipe râle : "On a développé une fonctionnalité qui ne sert à rien !"*
*Le PO soupire : "Mais c’était pourtant clair dans le Jira..."*
*Le designer montre ses maquettes : "Personne ne m’a dit que ce cas était important !"*

👉 **Problème classique** : Un manque d’alignement *dès la conception* qui coûte du temps, de l’énergie et de la crédibilité.

La solution ? **Deux techniques complémentaires** :
1. **Les 3 Amigos** – *La dream team de la clarification*
2. **L’Example Mapping** – *La carte au trésor des règles métiers*

Ensemble, ils transforment des user stories floues en **spécifications précises**, **testables** et **alignées avec les besoins utilisateurs**.

---
## 📖 Définitions & Origines

### 1️⃣ Les 3 Amigos (The Three Amigos)
**Définition** :
Une **collaboration structurée** entre trois rôles clés pour affiner une user story *avant* le développement :
- **Product Owner** (ou Product Manager) → *Le "pourquoi"*
- **Développeur** → *Le "comment" technique*
- **Testeur/QA** → *Le "comment vérifier"*

**Origine** :
Popularisé par **George Dinwiddie** (coach Agile) dans les années 2010, inspiré des pratiques **BDD (Behavior-Driven Development)**. L’idée ? Éviter les malentendus en **co-construisant** les critères d’acceptation.

> *"Trois perspectives > Une seule vérité"* – Proverbe Agile (inventé pour l’occasion 😉)

![Les 3 Amigos et Example Mapping](/uploads/templates/Tres%20Amigos%20et%20Example%20Mapping.png)


### 2️⃣ L’Example Mapping
**Définition** :
Un **atelier visuel** pour décomposer une user story en :
- **Règles métiers** (Business Rules)
- **Exemples concrets** (Examples)
- **Questions ouvertes** (Questions)
- **Cas limites** (Edge Cases)

**Origine** :
Créé par **Matt Wynne** (co-auteur de *"The Cucumber Book"*) comme outil de **modélisation collaborative** pour le BDD.

---
## 🛠️ **En Pratique : Comment ça Marche ?**

### Étapes Clés (Workshop Type)
| Étape | Durée | Objectif | Outils |
|-------|-------|----------|--------|
| **1. Sélection de la story** | 5 min | Choisir une user story *prioritaire mais floue* | Backlog raffiné |
| **2. Présentation par le PO** | 10 min | Contexte, enjeux, persona cible | User Story Map / Maquettes |
| **3. Example Mapping** | 30-45 min | Cartographier règles + exemples | Post-its / Miro / Figma |
| **4. Priorisation** | 10 min | Identifier les *must-have* vs *nice-to-have* | Dot Voting |
| **5. Rédaction collaborative** | 15 min | Affiner la story + critères d’acceptation | Confluence / Jira |

---

### 📌 **Template d’Example Mapping**
*(À faire sur un tableau blanc ou un outil comme Miro)*

| **User Story** *(Énoncé initial)* | *"En tant qu’utilisateur, je veux réinitialiser mon mot de passe pour accéder à mon compte en cas d’oubli."* |
|----------------------------------|--------------------------------------------------------------------------------------------------------|
| **Règles Métiers** *(Business Rules)* | - Le lien de réinitialisation expire après 24h <br> - Le mot de passe doit contenir 8 caractères (min 1 majuscule, 1 chiffre) <br> - L’email doit être vérifié au préalable |
| **Exemples** *(Concrets)* | ✅ Email valide → Lien envoyé <br> ❌ Email invalide → Message d’erreur "Compte introuvable" <br> ✅ Mot de passe "Bonjour1!" → Accepté <br> ❌ Mot de passe "bonjour" → Rejeté ("Manque une majuscule") |
| **Questions** *(À creuser)* | - Que faire si l’utilisateur n’a pas accès à son email ? <br> - Faut-il un captcha pour éviter les attaques ? <br> - Combien de tentatives autorisées avant blocage ? |
| **Cas Limites** *(Edge Cases)* | - Utilisateur avec 2 comptes (même email) <br> - Lien cliqué après expiration <br> - Réinitialisation depuis un VPN |

---

### 🎯 **Exemple Réel : Une Story de Panier d’Achat**
**Contexte** : Une équipe e-commerce travaille sur la fonctionnalité *"Ajouter un produit au panier"*.

**Problème initial** :
- Le PO pense que le bouton doit être vert.
- Le designer veut une animation "fly-to-cart".
- Le dev s’interroge sur le stock temps réel.

**Après un atelier 3 Amigos + Example Mapping** :
| Élément | Avant | Après |
|---------|-------|-------|
| **Critères d’acceptation** | "Le bouton doit marcher" | - Bouton vert *seulement si stock > 0* <br> - Animation "fly-to-cart" *uniquement sur desktop* <br> - Message "Stock faible" si < 5 unités |
| **Tests automatisés** | Aucun | 3 scénarios BDD écrits (Cucumber) |
| **Temps de dev estimé** | 3 jours | 2 jours (moins de retours) |

---
## ⚠️ **Difficultés Courantes (et Comment les Éviter)**

### 1. **"On n’a pas le temps pour ces ateliers !"**
   - **Solution** :
     - Commencer par **1 story par sprint** pour montrer la valeur.
     - Limiter à **45 min max** (timer visible).
     - **Astuce** : *"Si vous pensez ne pas avoir le temps de clarifier maintenant, vous le perdrez 10x plus tard en bugs."*

### 2. **Déséquilibre des rôles**
   - **Symptôme** : Un des "Amigos" domine la discussion (souvent le PO ou le dev senior).
   - **Solution** :
     - **Tour de table** : Chacun donne son avis *sans interruption*.
     - **Règles de facilitation** :
       - *"Pas de 'non', mais des 'et si on essayait...'"* (improvisation théâtrale 🎭).
       - Utiliser un **talking stick** (ou un marteau en mousse pour les récalcitrants 🔨).

### 3. **Exemples trop théoriques**
   - **Problème** : Des exemples du type *"L’utilisateur clique et ça marche"* (merci Captain Obvious).
   - **Solution** :
     - **Technique du "Et si..."** :
       - *"Et si l’utilisateur a un bloqueur de pubs ?"*
       - *"Et s’il y a une coupure réseau pendant la validation ?"*
     - **Basé sur des données** : Analyser les logs ou feedbacks clients pour trouver des cas réels.

### 4. **Oublier les cas limites**
   - **Conséquence** : *"Ça marche en demo, mais pas en prod"* (classique).
   - **Solution** :
     - **Checklist des edge cases** (à afficher dans la salle) :
       - Données manquantes
       - Connexions multiples
       - Fuseaux horaires
       - Permissions utilisateur

---
## ✅ **Avantages Prouvés**

| Bénéfice | Impact Mesurable | Source |
|----------|------------------|--------|
| **Réduction des bugs** | -40% de retours QA | *Study by Agile Alliance (2019)* |
| **Meilleure estimation** | Précision à ±20% (vs ±50% avant) | *Retour d’expérience Spotify* |
| **Alignement équipe** | +30% de satisfaction dans les rétros | *Enquête Scrum.org* |
| **Documentation vivante** | Les exemples deviennent des tests automatisés | *BDD par exemple* |
| **Décisions plus rapides** | -50% de temps en réunions de clarification | *Cas client chez ING* |

---
## 💡 **10 Conseils pour Réussir vos Ateliers**

1. **Préparez le terrain** :
   - Envoyez la user story **24h avant** avec un contexte clair (maquettes, données métiers).
   - **Exemple d’email** :
     > *"Team, demain on affine la story 'Paiement en 1 clic'. Voici les maquettes Figma et les stats d’abandon de panier. Préparez vos questions !"*

2. **Limitez le scope** :
   - **1 story = 1 atelier**. Pas de multitâche !

3. **Utilisez un support visuel** :
   - **Outils recommandés** :
     - **Physique** : Post-its + tableau blanc (idéal pour l’énergie).
     - **Digital** : Miro (template prêt à l’emploi [ici](#)) ou FigJam.

4. **Impliquez le designer** :
   - Son rôle ? Valider que les exemples couvrent **l’expérience utilisateur** (ex : messages d’erreur clairs).

5. **Capturez les décisions** :
   - Prenez une **photo du tableau** et collez-la dans la story Jira/Confluence.
   - **Bonus** : Utilisez un outil comme **Loom** pour enregistrer un résumé audio-visuel.

6. **Terminez par un "contrat"** :
   - *"On est tous d’accord pour dire que cette story est prête si [liste des critères] sont validés ?"* → **Validation explicite**.

7. **Itérez sur le format** :
   - Après 3 ateliers, faites un **mini-retro** :
     - *"Qu’est-ce qui nous a fait gagner du temps ?"*
     - *"Qu’est-ce qu’on pourrait améliorer ?"*

8. **Liez aux tests** :
   - Transformez les exemples en **scénarios Gherkin** (BDD) :
     ```gherkin
     Scenario: Réinitialisation de mot de passe avec email valide
       Given l’utilisateur a un compte avec email "test@exemple.com"
       When il clique sur "Mot de passe oublié"
       Then il reçoit un email avec un lien valide 24h
     ```

9. **Adaptez aux remote teams** :
   - **Règles pour le distanciel** :
     - Caméras allumées (pour capter les réactions).
     - **Breakout rooms** pour les sous-groupes (ex : 1 dev + 1 testeur).
     - Utilisez des **emojis** pour voter (✅/❌ dans le chat).

10. **Célébrez les succès** :
    - Affichez dans l’espace équipe un **"Mur des Stories Clarifiées"** avec les stories traitées et leur impact (ex : *"Cette story a évité 3 jours de dev en moins !"*).

---
## 📚 **Pour Aller Plus Loin**

### Ressources Utiles
- **Livre** : *"The Three Amigos: Collaboration for Better Software"* (George Dinwiddie)
- **Outil** : [Template Miro pour Example Mapping](https://miro.com/templates/example-mapping/)
- **Formation** : Cours *"BDD with Cucumber"* sur Udemy (inclut des ateliers pratiques).
- **Communauté** : Rejoignez le Slack *"Agile Testing Fellowship"* pour échanger des retours terrain.

### **Variantes Avancées**
- **4 Amigos** : Ajoutez un **data scientist** pour les stories liées à l’analytique.
- **Example Mapping + Event Storming** : Pour les systèmes complexes (microservices).
- **3 Amigos "Light"** : Version express (20 min) pour les petites stories.

---
## 🎯 **En Résumé : Votre Checklist Clé en Main**

✅ **Avant l’atelier** :
- [ ] User story sélectionnée et partagée à l’avance.
- [ ] Maquettes/données métiers disponibles.
- [ ] Outils prêts (Miro, post-its, timer).

✅ **Pendant l’atelier** :
- [ ] Tour de table pour les 3 perspectives (PO/Dev/Testeur).
- [ ] Remplir les 4 sections de l’Example Mapping.
- [ ] Prioriser les exemples avec un dot voting.
- [ ] Capturer les décisions (photo + notes).

✅ **Après l’atelier** :
- [ ] Mettre à jour la story avec les critères d’acceptation.
- [ ] Créer les tickets de tests associés.
- [ ] Planifier un point de suivi si des questions restent ouvertes.

---
## 🚀 **Et Maintenant, à Vous de Jouer !**

**Prochaine étape** :
1. **Identifiez une story floue** dans votre backlog.
2. **Bloquez 45 min** avec vos 3 Amigos.
3. **Testez le format** et mesurez l’impact (temps gagné, bugs évités).

> *"Une user story bien clarifiée = 10 lignes de code en moins et 1 utilisateur heureux en plus."* – Coach Sticko

**Partagez vos retours** :
- Quel a été votre plus gros *"Aha!"* moment en faisant cet atelier ?
- Avez-vous adapté la méthode à votre contexte ? (Dites-le en commentaire !)

---
*PS : Un template Miro prêt à l’emploi est disponible [ici](#). Copiez-le et lancez-vous !* 🚀

#3Amigos #ExampleMapping #ProductDesign #Agile #BDD
