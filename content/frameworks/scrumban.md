---
id: "scrumban"
title: "🔄 Scrumban : le meilleur des deux mondes (scrum + kanban) sans les contraintes"
category: "frameworks"
tags: ["scrumban", "hybride", "agile", "flux", "amélioration continue"]
description: "Scrumban décrypté : comment combiner la structure de Scrum et la fluidité de Kanban pour des équipes qui veulent livrer sans se prendre la tête. Avec exemples concrets et pièges à éviter."
---

# 🔄 Scrumban : le guide pratique pour les équipes qui veulent du flow sans perdre le cap

> *"Scrumban, c'est comme un vélo électrique :*
> *Vous gardez les pédales (Scrum) mais vous ajoutez un moteur (Kanban) pour les côtes. Résultat : vous avancez plus vite sans transpirer comme un fou."*
> — **Coach Sticko**

---

## 🎯 **Pourquoi Scrumban ? (Le Pitch en 30 Secondes)**

Scrumban est un **hybride entre Scrum et Kanban** qui permet de :
✅ **Garder la cadence** (comme Scrum) **sans les contraintes** des Sprints rigides.
✅ **Fluidifier le travail** (comme Kanban) **sans perdre en prévisibilité**.
✅ **S'adapter aux demandes imprévues** (bugs, urgences) **sans tout casser**.

**Pour qui ?**
✔ Équipes qui **veulent sortir des Sprints** mais gardent besoin de **rythme**.
✔ Projets avec **des priorités changeantes** (ex : maintenance, support, produits en évolution).
✔ Équipes qui **saturent en Scrum** (trop de cérémonies, pas assez de flexibilité).

❌ **À éviter si :**
- Vous avez **besoin de livraisons synchronisées** (ex : jeu vidéo avec une date de sortie fixe).
- Votre équipe a **besoin de la discipline des Sprints** pour avancer.

---

## 📜 **Définition & Origines : Scrumban, C'est Pas Juste "Scrum + Kanban"**

### **📌 Définition (Corey Ladas, 2009)**
> *"Scrumban est une **approche transitionnelle** pour les équipes qui veulent **évoluer de Scrum vers un système de flux continu** (Kanban), sans tout casser du jour au lendemain."*

**Les 3 Piliers de Scrumban** *(inspirés de Claude Aubry)* :
1. **Partir de Scrum** (rôles, artefacts, cérémonies).
2. **Supprimer ce qui ne sert à rien** (ex : estimation en story points si ça ne apporte rien).
3. **Ajouter des éléments Kanban** (limites WIP, métriques de flux).

### **🕰️ Petite Histoire**
- **2009** : **Corey Ladas** publie *"Scrumban: Essays on Kanban Systems for Lean Software Development"* → premier cadre formel.
- **2010-2015** : Adoption massive par les équipes **en transition Agile** (notamment en France, grâce à Claude Aubry).
- **2020+** : Scrumban devient une **solution pérenne** pour les équipes en **mode flux**, pas juste une étape.

💥 **Fun Fact** :
Le terme "Scrumban" a d'abord été utilisé **comme une insulte** par les puristes Scrum pour désigner les équipes qui "trichaient". Aujourd'hui, c'est une **méthode reconnue** !

---

## 🔧 **Comment Passer de Scrum à Scrumban ? (Étapes Clés)**

### **📌 Étape 1 : Garder ce qui marche en Scrum**
| **Élément Scrum**       | **Pourquoi le garder ?**                                                                 | **Comment l'adapter ?**                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **Rôles (PO, SM, Devs)** | La répartition des responsabilités **fonctionne bien**.                              | Le SM devient un **coach de flux**, le PO reste focalisé sur la valeur.                  |
| **Daily Standup**       | Le synchronisation quotidienne est **utiles pour les équipes distribuées**.            | **Réorienter sur le flux** : *"Qu'est-ce qui bloque le travail en cours ?"* (pas *"Qu'as-tu fait hier ?"*). |
| **Review**              | La démo aux stakeholders **apporte de la transparence**.                              | **Faire des Reviews à la demande** (pas forcément toutes les 2 semaines).               |
| **Rétrospective**       | L'amélioration continue est **le cœur de l'Agile**.                                    | **Ajouter des métriques Kanban** (Cycle Time, WIP) pour guider les discussions.          |

### **📌 Étape 2 : Supprimer ce qui pèse**
| **Élément Scrum**       | **Pourquoi le virer ?**                                                                 | **Alternative Scrumban**                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| **Sprints fixes**        | Les deadlines artificielles **créent du stress inutile** si le travail est continu.     | **Travail en flux continu** avec des **livraisons à la demande**.                         |
| **Estimation en points** | Si l'équipe **n'utilise pas les données** pour planifier, c'est du temps perdu.         | **Mesurer le Cycle Time** pour prévoir (pas besoin d'estimer).                            |
| **Vélocité**            | La vélocité est **souvent mal utilisée** (objectifs arbitraires, pression).              | **Utiliser le Throughput** (nombre de tâches terminées/semaine) + **Cycle Time**.         |
| **Sprint Planning**     | Si les priorités changent **tous les jours**, planifier 2 semaines à l'avance est inutile. | **Replanning continu** (le PO ajuste le backlog en temps réel).                         |

### **📌 Étape 3 : Ajouter les Super-Pouvoirs Kanban**
| **Pratique Kanban**      | **Pourquoi l'ajouter ?**                                                                 | **Comment faire ?**                                                                     |
|--------------------------|-----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **Limites WIP**          | Éviter la **surcharge** et les tâches qui traînent.                                     | Commencer par **WIP = nombre de devs + 1** (ex : 4 devs → WIP max = 5).                   |
| **Classes de service**   | Prioriser **les urgences** sans tout casser.                                           | 4 niveaux : *Expedite (urgent) → Standard → Intangible (améliorations) → Parking*.       |
| **Métriques de flux**    | **Mesurer la performance réelle** (pas des estimations).                                | **Cycle Time** (temps pour terminer une tâche) + **Lead Time** (temps total).             |
| **Tableau de flux**      | **Visualiser les vrais blocages** (pas seulement "En cours").                           | Ajouter des colonnes comme *"Blocage"*, *"En review"*, *"Prêt à livrer"*.                 |
| **Pull System**          | L'équipe **tire le travail** quand elle est prête (pas de travail poussé).              | **"On ne prend une nouvelle tâche que si une place est libre en WIP."**                  |

---

## 📊 **Scrumban en Action : Exemples Concrets**

### **🌱 Cas 1 : Une Équipe de Développement qui Passe de Scrum à Scrumban** *(Inspiré de Claude Aubry)*
**Problème** :
- Les **Sprints de 2 semaines** deviennent **ingérables** à cause des urgences (bugs clients).
- L'équipe **stresse** pour "remplir le Sprint" même quand les priorités changent.

**Solution Scrumban** :
1. **Supprimer les Sprints** → Travail en **flux continu**.
2. **Ajouter des limites WIP** :
   - *"En développement"* : max 4 tâches.
   - *"En review"* : max 2 tâches.
3. **Classes de service** :
   - **Expedite** (bugs critiques) → Traité **immédiatement** (même si WIP est plein).
   - **Standard** (features) → Traité dans l'ordre.
4. **Métriques** :
   - **Cycle Time moyen** : 3 jours (objectif : <2 jours).
   - **Throughput** : 10 tâches/semaine.

**Résultat** :
- **Réduction de 40% du temps de résolution des bugs**.
- **Moins de stress** : l'équipe ne court plus après un Sprint "parfait".
- **Meilleure réactivité** aux demandes clients.

💡 **Leçon** :
> *"En Scrumban, on ne 'remplit' plus un Sprint. On **optimise le flux**."*
> — **Claude Aubry**

---

### **🛠️ Cas 2 : Une Équipe de Support Technique** *(Blog Octo)*
**Problème** :
- **Trop de tickets en parallèle** → Aucun n'est résolu rapidement.
- **Pas de visibilité** sur les blocages.

**Solution Scrumban** :
1. **Tableau visuel** avec colonnes :
   - *Nouveau → Triage → En cours (WIP=3) → En test → Résolu*.
2. **Limites WIP strictes** :
   - Si *"En cours"* est plein (3 tickets), **personne ne prend de nouveau ticket** avant d'en finir un.
3. **Métrique clé** : **Temps moyen de résolution** (objectif : <24h pour les tickets standard).
4. **Réunion quotidienne** (15 min max) :
   - *"Qu'est-ce qui bloque ?"* (pas *"Qu'as-tu fait ?"*).

**Résultat** :
- **Temps de résolution divisé par 2** (de 48h à 24h en moyenne).
- **Moins de multitâche** → **meilleure qualité** des solutions.

---

### **🎨 Cas 3 : Une Agence de Design** *(Claude Aubry - "Scrumban au Jardin")*
**Problème** :
- Les **clients changent d'avis** en cours de projet.
- Les **deadlines sont floues** ("Quand ce sera prêt").

**Solution Scrumban** :
1. **Pas de Sprints** → Travail en **flux continu** avec des **livraisons partielles**.
2. **Limites WIP par type de travail** :
   - *Création* (WIP=2) → *Revue client* (WIP=1) → *Finalisation* (WIP=2).
3. **Visualisation des blocages** :
   - Une colonne *"Attente client"* avec un **timer** (si un projet y reste >3 jours, on relance le client).
4. **Métriques** :
   - **Lead Time** (temps entre la demande et la livraison).
   - **Taux de révision** (nombre de retours clients par projet).

**Résultat** :
- **Réduction de 30% des retards** (moins de projets en parallèle).
- **Clients plus satisfaits** (livraisons plus fréquentes, même partielles).

---

## ⚠️ **Les 5 Pièges Qui Tuent Scrumban (Et Comment Les Éviter)**

### **1️⃣ Piège : "On fait du Scrumban = on fait n'importe quoi"**
**Symptôme** :
- L'équipe **supprime toutes les règles** sans en ajouter de nouvelles.
- Résultat : **chaos** ("On ne sait plus qui fait quoi").

**Solution** :
➡️ **Garder un cadre minimal** :
   - **1 tableau visuel** (physique ou digital).
   - **1 limite WIP** (même basique : ex WIP=5).
   - **1 métrique** (ex : Cycle Time).
➡️ **Fixer des règles explicites** :
   - *"Si une tâche est bloquée >24h, on en parle en daily."*
   - *"Les tâches 'Expedite' passent avant tout."*

---

### **2️⃣ Piège : "On garde les Sprints mais on appelle ça Scrumban"**
**Symptôme** :
- L'équipe **fait toujours des Sprints de 2 semaines** mais dit faire du Scrumban.
- **Aucun bénéfice** (juste un Scrum mal nommé).

**Solution** :
➡️ **Supprimer les Sprints** ET :
   - **Livrer dès qu'une tâche est terminée** (pas en fin de Sprint).
   - **Faire des replannings continus** (le PO ajuste le backlog en temps réel).
➡️ **Mesurer le flux** :
   - *"Combien de tâches terminons-nous par semaine ?"* (Throughput).
   - *"Combien de temps mettent-elles en moyenne ?"* (Cycle Time).

---

### **3️⃣ Piège : "On ne limite pas le WIP"**
**Symptôme** :
- Le tableau est **surchargé** ("En cours" = 20 tâches).
- **Rien n'avance** (trop de multitâche).

**Solution** :
➡️ **Commencer avec une limite WIP simple** :
   - *"Nombre de devs + 1"* (ex : 4 devs → WIP=5).
➡️ **Rendre les limites visibles** :
   - Si une colonne dépasse sa limite → **post-it rouge** pour alerter.

**Exemple (Claude Aubry)** :
> *"Une équipe a réduit son WIP de 10 à 4. Résultat : leur Cycle Time est passé de 14 à 5 jours."*

---

### **4️⃣ Piège : "On ne mesure rien"**
**Symptôme** :
- L'équipe **ne suit aucune métrique**.
- Impossible de savoir si **Scrumban améliore les choses**.

**Solution** :
➡️ **Mesurer au moins 2 choses** :
1. **Cycle Time** (temps pour terminer une tâche).
2. **Throughput** (nombre de tâches terminées/semaine).
➡️ **Afficher les graphes** (ex : Cumulative Flow Diagram) **en visible**.

**Outil simple** :
- Un **tableau Excel** avec :
  - Date de début / Date de fin / Type de tâche.
  - Formules pour calculer **Cycle Time moyen**.

---

### **5️⃣ Piège : "Le PO ou le SM bloquent la transition"**
**Symptôme** :
- Le **Product Owner** veut garder les Sprints ("Sinon, comment je planifie ?").
- Le **Scrum Master** a peur de perdre son rôle.

**Solution** :
➡️ **Former le PO** :
   - *"En Scrumban, tu priorises en continu, pas une fois par Sprint."*
   - *"On livre plus souvent, donc tu as plus de feedback client."*
➡️ **Redéfinir le rôle du SM** :
   - Il devient un **coach de flux** :
     - *"Comment réduire nos Cycle Time ?"*
     - *"Où sont nos goulots d'étranglement ?"*

---

## 📈 **Métriques Clés en Scrumban** *(Inspiré du Blog Octo)*

| **Métrique**          | **Définition**                                                                 | **Pourquoi c'est utile**                                                                 | **Objectif Typique**                     |
|------------------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------|
| **Cycle Time**         | Temps entre **début et fin** d'une tâche.                                     | Mesurer **l'efficacité réelle** (pas les estimations).                                  | Réduire de 20% en 3 mois.               |
| **Lead Time**          | Temps entre **demande et livraison** (inclut l'attente).                      | Comprendre **les délais perçus par le client**.                                          | Stabiliser à <5 jours pour les urgences.|
| **Throughput**         | Nombre de tâches **terminées par semaine**.                                   | Savoir **combien on livre vraiment**.                                                    | Augmenter de 10% sans ajouter de gens.  |
| **WIP (Work In Progress)** | Nombre de tâches **en cours**.                                               | Éviter la **surcharge** et le multitâche.                                               | WIP ≤ nombre de devs + 1.               |
| **Taux de Blocage**    | % de tâches **bloquées >24h**.                                                | Identifier **les processus fragiles** (ex : attente de validation).                     | <5% des tâches.                         |
| **Cumulative Flow Diagram (CFD)** | Graphique montrant **l'évolution du travail dans chaque colonne**.      | Voir **où s'accumulent les tâches** (goulots d'étranglement).                           | Flux stable (bandes parallèles).         |

**Exemple Scrumban** :
![Exemple Scrumban](https://blog.octo.com/du-scrum-au-scrumban-liberez-votre-process-agile-premiere-etape-adapter-le-management-visuel/media-201803164_resize.webp)
*(Source : Blog Octo)*

---

## 🛠️ **Outils pour Scrumban**

| **Outil**          | **Pourquoi ?**                                                                 | **Lien**                                                                 |
|--------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **Trello**         | Simple, visuel, idéal pour **débuter en Scrumban**.                           | [Template Scrumban Trello](https://trello.com/templates/scrumban)         |
| **Jira**           | Pour les équipes **tech** qui veulent des métriques avancées.                | [Guide Scrumban Jira](https://www.atlassian.com/agile/kanban/scrumban)    |
| **Miro**           | Parfait pour les **tableaux physiques virtuels** (idéal en remote).          | [Template Scrumban Miro](https://miro.com/templates/scrumban/)            |
| **Kanbanize**      | Outil **100% flux** avec analytics intégrés (CFD, Cycle Time…).             | [Kanbanize](https://kanbanize.com/)                                     |
| **Excel/Google Sheets** | Pour les **petits budgets** (avec graphes manuels).                      | [Template gratuit](https://docs.google.com/spreadsheets/d/1Qx5Qb5g5Z5Q/) |

---

## 📚 **Pour Aller Plus Loin**

1. **Livres** :
   - *"Scrumban: Essays on Kanban Systems for Lean Software Development"* – **Corey Ladas** (2009).
   - *"Kanban: Successful Evolutionary Change for Your Technology Business"* – **David J. Anderson**.

2. **Articles** :
   - [Du Scrum au Scrumban : Libérez votre process Agile (Blog Octo)](https://blog.octo.com/du-scrum-au-scrumban-liberez-votre-process-agile-premiere-etape-adapter-le-management-visuel/)
   - [Scrumban au Jardin (Claude Aubry)](https://claudeaubry.fr/post/2011/scrumban-au-jardin/)
   - [Arrêter Scrum pour le flux (Claude Aubry)](https://claudeaubry.fr/post/2015/arrêter-scrum-pour-le-flux-un-début-dexpérience/)

3. **Formations** :
   - [Scrumban par Kanban University](https://kanban.university/training/scrumban/)
   - [Webinaire : Transition Scrum → Scrumban (Claude Aubry)](https://claudeaubry.fr/prez/scrumBan_avec_iceScrum__version_stories.pdf)

---

## 💬 **Le Mot de la Fin (Par Claude Aubry & Coach Sticko)**

> *"Scrumban, c'est comme enlever les roulettes d'un vélo :*
> *Au début, on a peur de tomber. Mais une fois qu'on a trouvé l'équilibre, on va **beaucoup plus vite** sans elles."*
> — **Claude Aubry** (adapté)

**Et vous, où en êtes-vous ?**
- **En transition Scrum → Scrumban** ? Quel est votre **plus gros défi** ?
- **Déjà en Scrumban** ? Quel est votre **meilleur hack** pour garder le flux fluide ?
- **Sceptique** ? Qu'est-ce qui vous **freine** ?

👇 **Partagez vos retours en commentaire** – et si vous avez un **cas compliqué**, je vous aide à le démêler !

---
**📌 PS : Un Exercice pour Demain**
1. Prenez **votre tableau Scrum actuel**.
2. **Supprimez la colonne "Sprint Backlog"** → Remplacez par *"À faire"* (sans limite de temps).
3. **Ajoutez une limite WIP** sur *"En cours"* (ex : WIP = nombre de devs).
4. **Mesurez** : Combien de tâches **terminées cette semaine** ? Quel était leur **Cycle Time moyen** ?

*"Scrumban, c'est pas de la magie. C'est juste **Scrum sans les contraintes inutiles + Kanban sans le laxisme**."*
— **Coach Sticko** 🚀
