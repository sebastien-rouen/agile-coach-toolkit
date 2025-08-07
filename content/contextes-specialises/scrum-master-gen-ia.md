---
id: "scrum-master-gen-ia"
title: "🤖🚀 Scrum Master & Génération IA : accompagner une équipe tech en 2025"
category: "contextes-specialises"
tags:
  [
    "scrum master",
    "genia",
    "llm",
    "ia generative",
    "tech",
    "facilitation",
    "innovation",
  ]
description: "Comment adapter votre posture de Scrum Master pour une équipe tech travaillant sur des projets de Génération IA (LLM, agents autonomes, etc.) ? Décryptage des défis spécifiques, outils et bonnes pratiques pour rester agile dans un environnement en constante évolution."
---

# 🤖🚀 Scrum Master & Génération IA : accompagner une équipe tech en 2025

> _"Accompagner une équipe GenIA, c'est comme faire du Scrum sur un tapis volant :_ > _Les règles de base restent les mêmes, mais le paysage change à une vitesse folle,_ > _et il faut sans cesse réajuster son équilibre entre innovation et structure."_
> — **Coach Sticko**

---

## 🎯 Pourquoi la GenIA Change la Donne pour les Scrum Masters ?

### 📌 5 Défis Spécifiques aux Équipes GenIA

| **Défis**                        | **Explications**                                                                                                                    | **Exemples Concrets**                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 🌀 **Incertitude extrême**       | Les modèles évoluent **toutes les semaines** (ex : nouvelles versions de LLMs, nouvelles APIs).                                     | _"On a entraîné notre modèle sur GPT-3.5, mais GPT-4o vient de sortir avec des caps radicalement différentes."_ |
| 🎯 **Objectifs mouvants**        | Les use cases et les attentes **changent en cours de route** (ex : un client veut suddenly un agent autonome au lieu d'un chatbot). | _"On devait faire un résumeur de documents, mais maintenant le client veut un agent qui prend des décisions."_  |
| 🧠 **Compétences hybrides**      | Les devs doivent maîtriser **à la fois le code, les prompts, et l'éthique IA**.                                                     | _"Notre backend dev comprend mal les enjeux de fine-tuning, et notre prompt engineer ne sait pas coder."_       |
| ⚖️ **Enjeux éthiques**           | **Biais, hallucinations, RGPD**... La compliance devient un sujet quotidien.                                                        | _"Notre modèle génère des réponses discriminatoires, on doit tout revoir en urgence."_                          |
| 🔄 **Dette technique explosive** | Les modèles et frameworks **obsolètes en 6 mois** → maintenance constante.                                                          | _"On a built notre stack sur TensorFlow 1.x, mais tout le monde migre vers PyTorch 2.0 avec des plugins LLM."_  |

💡 **Citation Clé** (adaptée de [Martin Fowler sur l'IA](https://martinfowler.com/)) :

> _"Dans la GenIA, si votre backlog est figé, c'est que vous allez droit dans le mur._ > _Votre seul avantage compétitif, c'est votre capacité à **pivoter vite** sans perdre vos devs en route."_

---

## 🛠️ Boîte à Outils du Scrum Master GenIA

### 1️⃣ Adaptez les Cérémonies Scrum au Rythme de l'IA

| **Cérémonie**          | **Classique**                         | **Version GenIA**                                                                                      | **Outils Recommandés**                                                             |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **📌 Sprint Planning** | On planifie 2 semaines de travail.    | **Planification en "timeboxes courtes"** (1 semaine max) + **buffer pour l'imprévu**.                  | **Jira avec des "Spike Stories"** pour l'exploration.                              |
| **🔍 Daily Scrum**     | "Qu'est-ce que j'ai fait hier ?"      | **"Quels blocages liés à l'IA aujourd'hui ?"** (ex : quota API, modèle qui bug, nouveau paper à lire). | **Slack/Teams avec un canal #genia-blockers**.                                     |
| **🎯 Sprint Review**   | Démo des fonctionnalités livrées.     | **Démo + "IA Risk Assessment"** : _"Quels sont les risques éthiques/techniques de ce qu'on a built ?"_ | **Checklist éthique** (ex : [Ethics Guidelines for AI](https://aiethics.google/)). |
| **🔄 Retrospective**   | "Comment améliorer notre processus ?" | **"Qu'avons-nous appris sur l'IA ce sprint ?"** + adaptation des pratiques.                            | **Miro template "GenIA Lessons Learned"**.                                         |

---

### 2️⃣ Gérez la Dette Technique IA

**Problème** :

> _"Dans la GenIA, la dette technique n'est pas juste du code mal écrit :_ > _C'est aussi des **modèles non documentés**, des **prompts obsolètes**, ou des **dépendances à des APIs propriétaires** qui peuvent disparaître du jour au lendemain."_
> — **Coach Sticko**

**Solutions** :
✅ **Ajoutez une "Definition of Done" IA** :

- _"Le modèle est-il **reproductible** ?"_
- _"Les prompts sont-ils **versionnés** ?"_
- _"A-t-on testé les **biais** et les **hallucinations** ?"_

✅ **Utilisez des outils de tracking** :

- **Weights & Biases** ([wandb.ai](https://wandb.ai/)) pour suivre les expériences ML.
- **DVC** ([dvc.org](https://dvc.org/)) pour versionner les datasets et modèles.
- **PromptVersioning** (ex : un simple tableau Confluence avec les versions des prompts et leurs résultats).

✅ **Allouez 20% du temps à la veille tech** :

- _"Tous les vendredis après-midi, on fait un 'GenIA Lab' où chacun présente un nouveau tool/paper."_
- **Ressources** : [Arxiv Sanity](https://www.arxiv-sanity.com/), [Hugging Face Papers](https://huggingface.co/papers).

---

### 3️⃣ Facilitez la Collaboration entre Rôles Hybrides

**Problème** :

> _"Dans une équipe GenIA, vous avez :_ > _- Des **data scientists** qui parlent en 'perplexity' et 'loss functions',_ > _- Des **prompt engineers** qui optimisent des phrases comme du code,_ > _- Des **devs backend** qui veulent des APIs stables,_ > _- Et des **designers** qui veulent une UX fluide._ > _Faire communiquer tout ce monde, c'est comme organiser un dîner entre un mathématicien, un poète, un ingénieur et un artiste."_
> — **Claude Aubry** (adapté)

**Solutions** :
🔹 **Créez un "Lexique GenIA"** :
| **Terme** | **Définition pour les non-experts** |
|-----------------|-----------------------------------------------------------------------------------------------------|
| **Fine-tuning** | "Entraîner un modèle existant (comme GPT) sur nos données pour qu'il réponde mieux à nos besoins." |
| **Prompt** | "La phrase qu'on donne à l'IA pour qu'elle génère une réponse. C'est comme une question très précise." |
| **Hallucination** | "Quand l'IA invente des infos fausses (ex : 'La Tour Eiffel a été construite en 1920')." |
| **Token** | "Un morceau de texte (un mot ou une partie de mot). GPT-4 peut en traiter 8 000 à la fois." |

🔹 **Organisez des "GenIA Syncs"** :

- **1x/semaine**, 30 min max.
- **Format** :
  1. **Démo technique** (10 min) : _"Voici comment on a optimisé le prompt pour réduire les hallucinations."_
  2. **Impact métier** (10 min) : _"Ça va permettre de réduire les coûts de modération de 30%."_
  3. **Risques & Blocages** (10 min) : _"Mais on a un problème avec le RGPD sur les données d'entraînement."_

🔹 **Utilisez des outils collaboratifs visuels** :

- **Miro** pour cartographier les workflows IA.
- **Excalidraw** pour schématiser les architectures de modèles.
- **Hugging Face Spaces** pour partager des démos interactives.

---

### 4️⃣ Gérez les Risques Éthiques et Juridiques

**Problème** :

> _"Dans la GenIA, vous n'avez pas le choix :_ > _Soit vous intégrez l'éthique **dès le Sprint Planning**,_ > _soit vous passez votre Sprint Review à gérer des crises de compliance."_
> — **Coach Sticko**

**Checklist Éthique par Sprint** (à intégrer dans la DoD) :

- [ ] **Biais** : A-t-on testé le modèle sur des groupes minoritaires ?
- [ ] **Vie privée** : Les données d'entraînement sont-elles anonymisées ?
- [ ] **Transparence** : L'utilisateur sait-il qu'il interagit avec une IA ?
- [ ] **Contrôlabilité** : Peut-on "désactiver" ou corriger une décision de l'IA ?
- [ ] **Impact environnemental** : Quel est le coût carbone de notre modèle ? (ex : [ML CO2 Impact](https://mlco2.github.io/impact/))

**Outils** :

- **IBM AI Fairness 360** ([github.com/IBM/AIF360](https://github.com/IBM/AIF360)) pour détecter les biais.
- **Hugging Face Evaluate** ([huggingface.co/docs/evaluate](https://huggingface.co/docs/evaluate)) pour mesurer la toxicité des outputs.
- **Template de Fiche d'Impact IA** (ex : [CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitres/ia)).

---

### 5️⃣ Adaptez Votre Posture de Scrum Master

| **Posture Classique**          | **Posture GenIA**                                                                                                                 | **Exemples**                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **📌 Faciliteur de processus** | **🧠 Faciliteur d'apprentissage continu** : _"Comment on intègre cette nouvelle tech sans tout casser ?"_                         | _"On organise un 'GenIA Dojo' tous les mois pour tester de nouveaux outils."_                            |
| **⚡ Protecteur d'équipe**     | **🛡️ Protecteur contre la surcharge cognitive** : _"Stop, on ne peut pas adopter 3 nouveaux frameworks en 1 Sprint."_             | _"Non, on ne migre pas vers Llama 3 cette semaine, on finit d'abord notre POC sur Mistral."_             |
| **🗣️ Animateur de rétros**     | **🔍 Animateur de 'Lessons Learned' techniques** : _"Qu'est-ce que ce nouveau paper change pour nous ?"_                          | _"Cette semaine, on a appris que les RAGs réduisent les hallucinations : comment on l'applique ?"_       |
| **🎯 Gardien des objectifs**   | **🧭 Gardien de la vision à long terme** : _"Oui, ce nouveau modèle est cool, mais est-ce que ça nous rapproche de notre goal ?"_ | _"On arrête de jouer avec les agents autonomes, notre objectif c'est d'abord de stabiliser le chatbot."_ |

---

## 🚀 5 Bonnes Pratiques pour un Scrum Master GenIA

### 1️⃣ Créez un "GenIA Radar" pour la Veille

**Format** :

- Un **tableau partagé** (Notion, Confluence) avec 4 quadrants :
  1. **🔥 Urgent** : _"OpenAI sort GPT-4.5 demain, impact sur notre stack ?"_
  2. **📚 À lire** : _"Nouveau paper sur le fine-tuning efficace des petits modèles."_
  3. **🛠️ À tester** : _"Ce nouveau framework de vector DB pourrait remplacer Pinecone."_
  4. **🗑️ Obsolète** : _"Ce tool n'est plus maintenu, on l'abandonne."_

**Règle** :

- **10 min par jour** en daily pour discuter des mises à jour.
- **1 personne désignée** comme "veilleur" par semaine (rotation).

---

### 2️⃣ Utilisez des "Spike Stories" pour l'Exploration

**Problème** :

> _"Dans la GenIA, vous ne pouvez pas tout planifier :_ > _Parfois, il faut **explorer** avant de savoir ce qui est possible."_
> — **Scrum Guide** (adapté)

**Solution** :

- **Ajoutez des "Spike Stories"** dans votre backlog :
  - _"Évaluer si le modèle X peut remplacer notre solution actuelle."_
  - _"Tester l'intégration de l'API Y pour voir si elle réduit nos coûts."_
- **Timeboxez-les** (ex : 1 semaine max).
- **Documentez les résultats** (même négatifs) dans un **wiki d'équipe**.

---

### 3️⃣ Mesurez l'Impact, Pas Juste la Vitesse

**Métriques Classiques** → **Métriques GenIA** :

| **Classique**          | **GenIA**                                                                 | **Outil**                                      |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Vitesse (story points) | **Qualité des outputs** (ex : taux d'hallucinations, pertinence).         | **Hugging Face Evaluate**                      |
| Taux de bugs           | **Taux de "refus"** (quand l'IA ne répond pas) + **taux de correction**.  | **Custom metrics (ex : % de réponses utiles)** |
| Satisfaction client    | **Satisfaction + confiance** (ex : "Faites-vous confiance à cette IA ?"). | **Typeform/SurveyMonkey**                      |
| Coût                   | **Coût + empreinte carbone** (ex : $/requête + kg CO2/requête).           | **ML CO2 Impact Calculator**                   |

---

### 4️⃣ Préparez des "GenIA Crisis Plans"

**Scénario** : _"Notre modèle génère des réponses racistes en production, et ça fait la une de TechCrunch."_

**Plan d'Urgence** :

1. **🛑 Arrêter** : Désactiver le modèle en production.
2. **🔍 Diagnostiquer** : Identifier la source du biais (données ? prompt ?).
3. **📢 Communiquer** :
   - **Interne** : _"On a un incident, équipe en mode crise."_
   - **Externe** : _"On a détecté un problème, on travaille sur une correction."_
4. **🔧 Corriger** : Retraiter les données, ajuster les prompts, tester.
5. **📝 Documenter** : Ajouter un post-mortem dans le wiki.

**Template de Communication** :

> _"Nous avons identifié un comportement inapproprié dans les réponses de notre IA._ > _Nous avons **désactivé le service** le [date] à [heure] et travaillons sur une correction._ > _Cause préliminaire : [brève explication]._ > _Mise à jour prévue : [date]._ > _Contact : [email/phone] pour les questions urgentes."_

---

### 5️⃣ Célébrez les "Petites Victoires" IA

**Exemples** :

- _"On a réduit le taux d'hallucinations de 20% ce sprint !"_ → **🎉**
- _"Notre modèle tourne maintenant en 2s au lieu de 10s !"_ → **🚀**
- _"On a réussi à fine-tuner GPT-3.5 sur nos données sans tout casser !"_ → **🥳**

**Idées** :

- Un **tableau des "GenIA Wins"** dans l'espace de l'équipe.
- Un **canal Slack #genia-wins** pour partager les succès.
- Un **"GenIA Show & Tell"** mensuel où chacun présente une petite avancée.

---

## 📚 Ressources Indispensables pour les Scrum Masters GenIA

| **Type**          | **Ressource**                                                                                                                          | **Pourquoi ?**                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **📖 Guide**      | [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html)                                                                           | **Les bases** (à adapter pour la GenIA).                  |
| **📄 Article**    | [Building LLM Applications (Hugging Face)](https://huggingface.co/blog/llm-app-guide)                                                  | **Bonnes pratiques** pour les apps GenIA.                 |
| **🎓 Formation**  | [DeepLearning.AI - LLM Courses](https://www.deeplearning.ai/courses/)                                                                  | **Monter en compétences** sur les LLMs.                   |
| **🛠️ Outil**      | [Weights & Biases](https://wandb.ai/)                                                                                                  | **Tracker vos expériences ML**.                           |
| **⚖️ Éthique**    | [AI Ethics Guidelines (EU)](https://digital-strategy.ec.europa.eu/en/policies/ethics-ai)                                               | **Cadre légal et éthique**.                               |
| **📊 Métriques**  | [MLOps Metrics (Google)](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) | **Comment mesurer la qualité IA**.                        |
| **🤖 Communauté** | [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)                                                                                   | **Discuter des défis concrets** avec d'autres praticiens. |

---

## 💬 Le Mot de la Fin (Par Coach Sticko & Claude Aubry)

> _"Être Scrum Master dans une équipe GenIA, c'est un peu comme être le capitaine d'un bateau en pleine tempête :_ > _- **Les vagues** (les nouvelles techs) arrivent de toutes parts,_ > _- **L'équipage** (votre équipe) a des compétences très variées,_ > _- **La carte** (votre backlog) est redessinée chaque semaine._
>
> _Votre job n'est pas de prédire la météo, mais de :_ > _1. **Garder le cap** (la vision produit),_ > _2. **Protéger l'équipe** (des burnouts et des distractions),_ > _3. **Savoir virer de bord rapidement** quand une nouvelle info arrive._
>
> _Et surtout : **celebrate the chaos**._ > _Parce que c'est dans ce bordel organisé que naissent les innovations les plus folles."_
> — **Coach Sticko**

---

**Partagez vos retours** :

- **Un défi récurrent** ? _"Comment gérer les attentes des stakeholders quand les modèles évoluent tout le temps ?"_
- **Une astuce qui marche** ? _"On fait des 'GenIA Lightning Talks' de 10 min pour partager les découvertes."_
- **Une question sans réponse** ? _"Comment intégrer les prompt engineers dans les cérémonies Scrum ?"_

---

**📌 PS : Un Exercice pour Demain**

1. **Identifiez 1 risque GenIA** dans votre backlog (ex : biais, obsolescence).
2. **Ajoutez une "Spike Story"** pour l'explorer ce sprint.
3. **Posez 1 question éthique** en Sprint Review (_"Ce modèle pourrait-il discriminer un groupe d'utilisateurs ?"_).
4. **Partagez 1 découverte** avec l'équipe (ex : un nouveau paper, un outil).

> _"Dans la GenIA, si vous attendez d'avoir toutes les réponses pour commencer,_
> _vous allez attendre **trop longtemps**._
> _Mieux vaut **avancer avec des questions** que rester immobile avec des certitudes."_
> — **Coach Sticko** 🤖💨
