---
id: "po-ops-facilitateur"
title: "PO OPS dans l’équipe : comment passer du ‘bulldozer’ au ‘facilitateur’ sans casser l’équipe ?"
category: "gestion-defis"
tags: ["po-ops", "leadership", "conflits", "alignement", "run-vs-build", "soft-skills"]
description: "Votre PO OPS a du caractère, une roadmap en béton, et débarque dans l’équipe OPS comme un éléphant dans un magasin de porcelaine ? Voici comment transformer cette énergie en collaboration productive, sans écraser la motivation ou la stabilité du RUN."
---

# 🧱 **PO OPS dans l’équipe : "Je suis là pour aider… mais on me voit comme un ennemi"**

## **Scénario classique** :
Vous êtes **PO OPS**, vous arrivez dans une équipe technique avec :
✅ Une **roadmap ambitieuse** (déjà écrite, validée en haut lieu).
✅ Un **caractère direct** ("On n’a pas le temps pour les tergiversations").
✅ Une **mission claire** : **faire avancer le BUILD**.

**Problème** :
L’équipe OPS, elle, a :
- **50% de son temps en RUN** (incidents, support, maintenance).
- **Une culture de prudence** ("Si ça casse, c’est NOUS qui passons la nuit debout").
- **Un réflexe de défense** face à un PO perçu comme un **"cowboy qui veut tout, tout de suite"**.

**Résultat** :
- **Démotivation** ("Encore un qui nous dit comment faire notre boulot").
- **Résistance passive** ("Oui chef… mais on a un incident à régler, donc non").
- **Turnover ou burnout** (si la pression devient ingérable).

---

## 💡 **Le PO OPS intégré**

> **"Un PO OPS qui débarque dans une équipe OPS sans écouter d’abord, c’est comme un médecin qui prescrit un traitement sans diagnostic : ça peut tuer le patient."**

**Pourquoi ça coince ?**
| **Ce que dit le PO OPS**       | **Ce que entend l’équipe OPS** | **Réalité cachée** |
|---------------------------------|----------------------------------|---------------------|
| *"Il faut livrer cette feature !"* | *"Encore un truc à gérer en plus du RUN."* | Le RUN est **invisible** pour le business, mais **critique** pour l’équipe. |
| *"Pourquoi vous traînez ?"* | *"Il veut qu’on sacrifie la stabilité pour son bonus."* | L’équipe a **déjà 2 incidents en cours**. |
| *"Je suis là pour vous aider."* | *"Traduction : ‘Je suis là pour vous surveiller.’"* | **Méfiance historique** envers les "extérieurs". |

---

## 📖 **Citations qui font mal (mais qui sonnent vrai)**

> *"Un PO qui ne comprend pas le RUN, c’est comme un capitaine qui ignore que son bateau prend l’eau."* — **Un admin sys en burnout**

> *"On nous demande d’être agiles, mais on nous donne des roadmaps en béton armé."* — **Un ingénieur OPS cynique**

> *"Mon boulot, c’est de faire le lien entre le business et la technique. Sauf que si la technique me déteste, je suis juste un messager qu’on veut pendre."* — **Un PO OPS lucide**

---

## ⚠️ **Les 4 pièges qui font de vous "l’ennemi public n°1"**

### **1. Le syndrome du "Roadmap Hammer"**
*"Si tout ce que vous avez, c’est un marteau (la roadmap), tout problème ressemble à un clou."*
- **Exemple** : Vous arrivez avec votre Gantt tout beau, mais l’équipe est en **mode pompier** depuis 3 jours à cause d’un incident majeur.
- **Conséquence** : Votre roadmap devient **"le truc qui nous empêche de respirer"**.
- **Solution** :
  - **Règle d’or** : **"Avant de pousser, écoute."**
  - **Outils** :
    - **"Run vs Build" Board** : Visualiser le temps passé sur chaque type de tâche.
      ```markdown
      | Semaine | RUN (incidents/support) | BUILD (projets) | Dispo (formation/amélioration) |
      |---------|--------------------------|------------------|---------------------------------|
      | S1      | 60%                      | 30%              | 10%                             |
      ```
    - **Question magique** : *"Qu’est-ce qui, dans votre RUN actuel, pourrait impacter ma roadmap ?"* (et **écouter vraiment** la réponse).

### **2. L’effet "Usine à Gaz"**
Vous voulez **tout tracer, tout mesurer, tout optimiser**… mais l’équipe voit ça comme :
- **"Encore un tableau Excel à remplir."**
- **"Il passe son temps à nous auditer au lieu de nous aider."**
- **Solution** :
  - **Principe** : **"Moins de reporting, plus de dialogue."**
  - **Exemple** :
    - Remplacer les **réunions de suivi** par des **"Stand-up RUN"** (10 min max) :
      - *"Quels incidents bloquants aujourd’hui ?"*
      - *"Est-ce que ça impacte le BUILD ? Si oui, comment on ajuste ?"*

### **3. Le "Déni du RUN"**
Vous parlez **uniquement de BUILD**, comme si le RUN n’existait pas.
- **Conséquence** : L’équipe se sent **invisible** et **sous-estimée**.
- **Solution** :
  - **Rituel** : **"RUN Retrospective"** (1x/mois) :
    - *"Quel incident nous a le plus impactés ce mois-ci ?"*
    - *"Comment on pourrait l’éviter à l’avenir ?"* (et **budgeter du temps** pour ces améliorations).
  - **Action symbolique** : **Participer à une garde** (même 1h) pour **comprendre la réalité du support**.

### **4. Le "Leadership Toxique"**
Votre franchise est perçue comme de **l’agressivité**, et votre urgence comme du **mépris**.
- **Exemple** :
  - Vous : *"Pourquoi ce ticket traîne depuis 3 jours ?!"*
  - Équipe : *"Parce que Jean était en garde hier soir et qu’il a dormi 2h. Mais merci de demander."*
- **Solution** :
  - **Technique du "Feedback Sandwich"** (même en mode pression) :
    1. **Reconnaissance** : *"Je sais que vous gérez un RUN lourd en ce moment, et c’est super important."*
    2. **Besoin** : *"En même temps, on a ce délai client à tenir. Comment on peut avancer ensemble ?"*
    3. **Ouverture** : *"Qu’est-ce qui vous faciliterait la vie pour concilier les deux ?"*

---

## 🛠 **Boîte à outils pour passer de "Bulldozer" à "Facilitateur"**

### **1. Le "RUN/BUILD Balance Scorecard"**
Un tableau pour **visualiser l’équilibre** (ou le déséquilibre) entre RUN et BUILD.

| **Catégorie**       | **Indicateurs**                          | **Seuils d’alerte**               | **Actions**                          |
|---------------------|------------------------------------------|------------------------------------|--------------------------------------|
| **Charge RUN**      | % temps passé en incidents/support      | > 50% pendant 2 semaines          | Bloquer du temps pour réduire la dette technique. |
| **Pression BUILD**  | Nombre de demandes urgentes du PO       | > 3 par semaine                   | Prioriser avec l’équipe (vote dot).  |
| **Équilibre**       | Ratio RUN/BUILD                          | < 30% BUILD = équipe en survie    | Renégocier la roadmap.               |

**Exemple concret** :
> *Semaine 1* : RUN = 65%, BUILD = 20% → **Alerte rouge**.
> **Action** : Reporter 2 features mineures pour libérer 10% de temps.

### **2. Le "PO OPS Survival Kit" (checklist pour les 30 premiers jours)**
✅ **Semaine 1 : Écouter et observer**
- [ ] Assister à **une garde RUN** (même en shadow).
- [ ] Lister les **3 plus gros points de friction** de l’équipe (sans juger).
- [ ] Identifier **1 "quick win"** (ex : automatiser un rapport chronophage).

✅ **Semaine 2 : Construire la confiance**
- [ ] Organiser un **"Café RUN"** (discussion informelle sur leurs défis).
- [ ] Proposer un **atelier "Roadmap Collaborative"** (pas "voici LA roadmap", mais "comment on la construit ensemble ?").
- [ ] **Ne pas imposer de deadline** avant d’avoir compris leurs contraintes.

✅ **Semaine 3 : Co-construire**
- [ ] Créer un **backlog commun** (RUN + BUILD) avec des **étiquettes claires** :
  - 🚨 *Critique* (incident bloquant).
  - 🏗️ *BUILD* (projet).
  - 🔧 *Amélioration* (réduction de la dette technique).
- [ ] Instaurer un **"Time Buffer"** (ex : 20% du temps réservé aux imprévus).

### **3. Le "Conflit → Collaboration" Canvas**
Un template pour **désamorcer les tensions** en 4 étapes :

1. **Faits** : *"On a 3 incidents en cours et tu veux ajouter une feature."*
2. **Émotions** : *"Je stresse parce que je sais que ça va encore nous tomber dessus."*
3. **Besoin** : *"On a besoin de stabilité avant de prendre plus de risque."*
4. **Proposition** : *"Et si on reportait de 48h pour finir les fixes ?"*

**Exemple rempli** :
> *PO* : *"Je dois livrer X pour vendredi, sinon le client part."*
> *OPS* : *"On a un incident critique sur Y, et si on touche à X, ça peut empirer les choses."*
> **Sortie** : *"On livre une version minimaliste de X vendredi, et on fixe Y en parallèle. Si Y empire, on annule X."*

---

## 🎯 **Cas réel : "Comment j’ai évité la guerre civile en 6 semaines"**

**Contexte** :
- PO OPS (moi) débarqué dans une équipe OPS en **crise** :
  - **RUN à 70%** (dette technique énorme).
  - **Roadmap imposée** par le business (déploiement d’un nouveau module en 1 mois).
  - **Ambiance** : *"Encore un cost-killer qui va nous pourrir la vie."*

**Actions clés** :
1. **Semaine 1 : J’ai fermé ma bouche et ouvert mes oreilles.**
   - J’ai passé **2 jours en shadow** avec l’équipe de garde.
   - **Découverte** : Leur outil de monitoring était **obsolète** → 30% de leur temps perdu à trier des faux positifs.

2. **Semaine 2 : J’ai troqué ma casquette "PO" contre "Facilitateur".**
   - J’ai **annulé une réunion de suivi** pour organiser un **"Hackathon RUN"** :
     - **But** : Automatiser les alertes les plus chronophages.
     - **Résultat** : **2h gagnées par jour** pour l’équipe.

3. **Semaine 3 : J’ai co-construit la roadmap.**
   - J’ai présenté **3 scénarios** au business :
     - ⚡ *Aggressif* : Tout livrer en 1 mois (risque : burnout + incidents).
     - 🐢 *Prudent* : Livrer en 3 mois (risque : client mécontent).
     - 🤝 *Collaboratif* : Livrer un MVP en 1 mois + améliorer le RUN en parallèle.
   - **Le business a choisi le 3ème** (car j’avais **chiffré le risque** des autres options).

4. **Semaine 6 : On a livré… et l’équipe m’a invité à boire un coup.**
   - **Pas parce que j’avais "gagné"**, mais parce qu’on avait **travaillé ensemble**.

**Leçons** :
- **La confiance se construit avec des actes, pas des mots.**
- **Un PO OPS qui code/debugue avec l’équipe (même mal) vaut 10 réunions.**
- **Parfois, ralentir pour accélérer après.**

---

## 📌 **Résumé : 5 règles d’or pour un PO OPS intégré**

1. **Le RUN passe avant le BUILD** (sinon, il n’y aura **plus d’équipe** pour builder).
2. **Ta roadmap n’est pas une Bible** : C’est un **point de départ pour la négociation**.
3. **Gagne le droit d’être écouté** en aidant d’abord l’équipe sur **leurs** problèmes.
4. **Parle "risque", pas "deadline"** : *"Si on ne fait pas X, le risque est Y"* > *"Il faut faire X pour hier !"*
5. **Sois le pont, pas le mur** : Ton job est de **traduire le business pour les OPS**, et **les réalités OPS pour le business**.

---

## 💥 Punchlines & phrases chocs
### 🔥 Pour réveiller les consciences :

"Quand on dit ‘on n’a pas le temps pour la qualité’, c’est comme dire ‘on n’a pas le temps pour mettre de l’essence’… avant de tomber en panne sur l’autoroute."
"Si on court toujours après les deadlines, un jour on se réveillera en train de courir… mais sans équipe derrière nous."
"La dette technique, c’est comme un crédit à la consommation : au début, c’est génial, puis un jour tu te réveilles et tu ne peux plus rien payer."
"Un ‘oui’ sous pression aujourd’hui = un ‘je te l’avais dit’ dans 3 mois."

### 🤔 Pour faire réfléchir sur les priorités :

"Si tout est urgent, alors rien ne l’est vraiment. Et si rien n’est urgent… pourquoi on court ?"
"On passe 80% de notre temps à éteindre des incendies. Mais qui allume les allumettes ?"
"Le RUN, c’est comme la respiration : si tu arrêtes de le faire pour ‘gagner du temps’, tu meurs. Littéralement."
"Une roadmap figée, c’est comme un GPS qui ne recalcule pas : tu vas droit dans le mur, même si tu roules à 200 km/h."

### 🤝 Pour l’alignement et la collaboration :

"Le pire gaspillage en équipe ? Deux personnes qui tirent dans des directions opposées… en pensant toutes les deux ‘j’ai raison’."
"La confiance, c’est comme le Wi-Fi : invisible, mais quand c’est coupé, plus rien ne marche."
"Un désaccord bien géré > un consensus mou. Parce qu’après un vrai débat, tout le monde sait POURQUOI on a choisi cette direction."
"Si on ne peut pas se dire les choses en réunion, on se les dira dans les couloirs. Et là, c’est trop tard."

### 🚀 Pour l’amélioration continue :

"La rétro où tout le monde dit ‘ça va’ est comme un check-up où le médecin dit ‘tout est parfait’… juste avant l’infarctus."
"Expérimenter, c’est comme goûter un nouveau plat : parfois c’est dégueu, mais au moins on sait. Ne pas expérimenter, c’est manger la même merde tous les jours."
"Si on attend d’être parfaits pour changer, on est déjà morts."
"L’échec n’est pas le problème. Le problème, c’est l’échec qu’on ne comprend pas."

### 😅 Avec une touche d’humour :

"Notre backlog ressemble à ma liste de courses : 80% de trucs qu’on achètera jamais, 15% de trucs inutiles, et 5% de vrai nourriture. Sauf que nous, la ‘nourriture’, c’est le RUN."
"Si on mesurait notre vélocité en ‘cafés bus par story point’, on serait tous des champions du monde."
"Notre processus de priorisation actuel : 1. Cri du client le plus bruyant. 2. Dernière idée du boss. 3. Ce qui brûle. 4. Le reste (spoiler : le reste, on en parle jamais)."
"On est comme les pompiers : soit on passe notre temps à éteindre des feux, soit on installe des détecteurs de fumée. Devinez quoi ? Les détecteurs, c’est moins glamour… mais ça sauve des vies."

---

**📚 Pour aller plus loin** :
- [Livre] *"Team Topologies"* – Matthew Skelton (pour comprendre les dynamiques d’équipe).
- [Outil] **Template "RUN/BUILD Balance"** (DM pour le fichier).
- [Article] *"Why Ops Teams Hate Product Owners (And How to Fix It)"* – DevOps.com.

---

> **"Un bon PO OPS ne pousse pas une équipe : il la tire vers le haut en marchant à ses côtés."**
> — **Coach Sticko** 🎯 *(qui a déjà été le PO qu’on voulait pendre… et qui a appris)*```---

**Variantes possibles** :
- Ajouter un **schéma** du "RUN vs BUILD" (camembert ou jauge).
- Intégrer un **template de "Contrat d’Équipe"** (règles de collaboration PO/OPS).
- **Interview fictive** : "Un jour dans la tête d’un OPS qui déteste son PO" (pour montrer l’autre perspective).

