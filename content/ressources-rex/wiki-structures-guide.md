---
id: "wiki-structures-agiles"
title: "🗺️ Comment structurer une documentation Agile qui ne finit pas aux oubliettes ?"
category: "ressources-rex"
tags: ["wiki", "documentation", "safe", "connaissances", "transmission", "rôles", "débutant", "expert", "devops", "product"]
description: "Des structures de wiki adaptées à tous les niveaux et rôles - parce qu'une doc inutilisable est pire qu'une absence de doc"
---

# 🗺️ **Comment structurer une documentation Agile qui ne finit pas aux oubliettes ?**

> *"La meilleure documentation est celle qu'on trouve quand on en a besoin, pas celle qu'on écrit pour cocher une case."*
> — Un DevOps qui a passé 3h à chercher un mot de passe dans Confluence

**Problème** : 80% des wikis d'entreprise deviennent des cimetières de connaissances en moins d'un an (source : [mon expérience douloureuse](#)).
**Solution** : Adapter la structure **au public cible** et **au niveau de maturité**, comme on adapte un atelier de facilitation.

---

## 🧩 **Les 3 lois à connaître avant de structurer votre wiki**

1. **Loi de Conway inversée** :
   *"Votre wiki reflétera la structure de vos équipes. Si vos docs sont en silos, c'est que vos équipes le sont aussi."*
   → **Solution** : Organisez par **flux de valeur** (ex: "De l'idée à la prod") plutôt que par service.

2. **Loi de Parkinson appliquée aux docs** :
   *"Le temps passé à documenter s'étire jusqu'à occuper tout le temps disponible."*
   → **Solution** : Fixez des **timeboxes** (ex: 20 min max par page) et utilisez des templates.

3. **Effet Dunning-Kruger de la documentation** :
   *"Les experts surestiment la clarté de leurs explications, les débutants sous-estiment ce qu'ils ne comprennent pas."*
   → **Solution** : Faites **relire par un junior** avant publication.

---

## 📚 **Structures de wiki par niveau de maturité**

### 🟢 **Niveau Débutant (Découverte)**
**Objectif** : Comprendre les bases sans se noyer.
**Structure type** :

```markdown
1. 🏠 Accueil
   - "Par où commencer ?" (chemin critique)
   - Glossaire visuel (1 image = 1 concept)
   - FAQ "Questions que tout le monde pose mais personne n'ose poser"

2. 🎯 Rôles & Responsabilités
   - Fiches rôle en 1 page max (ex: "PO pour les nuls")
   - "Une journée type de [rôle]" (timeline visuelle)

3. 🛠 Outils
   - "Comment faire X dans [Jira/Confluence/Miro]?" (captures + GIFs)
   - Checklists "Première fois que je..." (ex: "Je crée mon 1er ticket")

4. 🚀 Processus simplifiés
   - "Le cycle de vie d'une user story" (version "pour les enfants")
   - "Qui faire quoi quand ?" (matrice RACI simplifiée)
```

**Exemple concret** :
Pour un **nouveau Dev** :
```markdown
## 👉 Ma première pull request
1. **Où est le code ?** [Lien vers le repo] + branche `main`
2. **Comment je travaille ?**
   - `git checkout -b feature/ma-fonctionnalité`
   - `npm run test` (oui, les tests existent !)
3. **Je bloque ?**
   - #help-dev sur Slack
   - @mention ton buddy (liste ici : [Buddies Dev](#))
4. **Je valide quand ?**
   - ✅ 2 approbations
   - ✅ Pipeline vert
   - ✅ Documentation mise à jour (même 1 ligne !)
```

---

### 🟡 **Niveau Intermédiaire (Pratique)**
**Objectif** : Trouver l'information rapidement pour résoudre des problèmes concrets.
**Structure type** :

```markdown
1. 🔍 Troubleshooting
   - "Symptôme → Cause → Solution" (format tableau)
   - Ex: "Mon build échoue avec l'erreur X" → [Solution](#) + owner

2. 📊 Décisions & Rétros
   - "Pourquoi on a choisi [technologie/process] ?" (contexte + alternatives)
   - Archives des rétros avec **actions + owners + statut**

3. 🤝 Interactions entre équipes
   - "Comment travailler avec [équipe X]?" (ex: "Dev ↔ Data")
   - Contrats d'interface (ex: "API entre Front et Back")

4. 🧪 Bonnes pratiques
   - "Comment on fait des tests chez nous ?" (avec exemples)
   - "Nos standards de code" (linter + exemples concrets)
```

**Exemple pour un Scrum Master** :
```markdown
## 🎭 Animation de rétrospective
### 📌 Préparation (15 min max)
- **Outils** : [Template Miro](#) ou [Retro Tool](#)
- **Checklist** :
  - [ ] Inviter toute l'équipe (y compris le PO absent la dernière fois)
  - [ ] Pré-remplir avec les metrics auto (ex: velocity, bugs)
  - [ ] Prévoir un timebox strict (45 min max)

### 💡 Formats testés chez nous
| Format          | Quand l'utiliser          | Pièges à éviter          |
|-----------------|---------------------------|--------------------------|
| Mad/Sad/Glad    | Équipe nouvelle           | Trop superficiel        |
| Sailboat        | Problèmes de direction    | Nécessite un bon faciliteur |
| 4L (Liked/Learned/Lacked/Longed) | Rétro approfondie | Prendre des notes ! |
```

---

### 🔴 **Niveau Avancé (Expertise)**
**Objectif** : Capitaliser sur les connaissances tacites et les décisions stratégiques.
**Structure type** :

```markdown
1. 🧠 Architecture & Design
   - ADR (Architecture Decision Records) avec :
     - Contexte ("Pourquoi cette décision ?")
     - Alternatives envisagées
     - Conséquences à long terme
   - Schémas d'architecture **à jour** (liens vers Draw.io/Lucidchart)

2. 📈 Métriques & Amélioration continue
   - Tableaux de bord avec **seuils d'alerte**
   - "Comment on mesure [X] et pourquoi ?" (ex: DORA metrics)

3. 🚀 Innovation & Expérimentations
   - "Nos hypothèses en cours" (format Lean Startup)
   - Résultats des tests A/B avec analyse

4. 🤝 Gouvernance
   - "Comment on prend les décisions techniques ?" (ex: RFC process)
   - "Nos principes d'ingénierie" (manifestes internes)
```

**Exemple pour un Product Owner** :
```markdown
## 🎯 Stratégie Produit
### 📊 Nos North Star Metrics (2024)
| Metric               | Cible Q1  | Cible Q2  | Owner      | Source des données       |
|----------------------|-----------|-----------|------------|--------------------------|
| Activation (7j)      | 65%       | 70%       | @PO-Mobile | Amplitude                |
| Revenue/MAU          | $1.2      | $1.5      | @PO-Growth | Stripe + DB               |
| NPS                  | 45        | 50        | @PO-Core   | SurveyMonkey             |

### 💡 Nos hypothèses en test
**Hypothèse** : "Ajouter un onboarding guidé augmentera l'activation de 15%"
- **Expérience** : [Figma prototype](#) + [Jira epic](#)
- **Résultats** : [Dashboard](#) (màj hebdo)
- **Décision** : Go/No-Go le 15/03 en Product Council
```

---

## 👥 **Structures de wiki par rôle**

| Rôle               | Besoins spécifiques                          | Exemple de structure dédiée                     |
|--------------------|---------------------------------------------|--------------------------------------------------|
| **Développeur**    | Code, debug, standards                      | 📁 `/dev` → "Comment deployer ?" / "Nos design patterns" |
| **Ops/DevOps**     | Infrastructure, monitoring, incidents        | 🚨 `/ops` → "Runbooks" / "Post-mortems"           |
| **Scrum Master**   | Facilitation, métriques d'équipe            | 🎭 `/facilitation` → "Templates de rétro" / "Conflits : comment gérer ?" |
| **Product Owner**  | Roadmap, priorisation, metrics produit      | 📈 `/product` → "Nos OKRs" / "Comment prioriser ?" |
| **UX/UI**          | Design system, recherches utilisateurs      | 🎨 `/ux` → "Nos personas" / "Tests utilisateurs"  |
| **Data**           | Modèles, pipelines, visualisations          | 📊 `/data` → "Dictionnaire des données" / "Comment requêter ?" |
| **QA**             | Scénarios de test, rapports de bugs        | 🐛 `/qa` → "Comment reproduire un bug ?" / "Nos suites de test" |
| **Business/BO**    | Processus métiers, indicateurs              | 💼 `/business` → "Comment on facture ?" / "Nos KPIs" |

---

## 🏗️ **Exemple complet avec SAFe (Scaled Agile Framework)**

```markdown
# 🏢 Documentation SAFe - [Nom de l'Organisation]

## 1. 🗺️ Cartographie des trains (ARTs)
- **Train A (Mobile)** : [Lien vers la page dédiée](#)
  - Équipes : 6
  - PI Planning : [Calendrier](#)
  - RTE : @Jean.D
- **Train B (Backend)** : [Lien](#)...

## 2. 🚂 Cérémonies SAFe
| Cérémonie          | Fréquence  | Owner          | Template          | Archives          |
|--------------------|------------|----------------|-------------------|-------------------|
| PI Planning        | Tous les 3 mois | RTE            | [Miro](#)         | [Confluence](#)   |
| Scrum of Scrums    | Hebdo      | Scrum Masters  | [Notes](#)        | [Historique](#)   |
| System Demo        | Bi-mensuel | PO Chief       | [Checklist](#)    | [Vidéos](#)       |

## 3. 📦 Livraison Continue
### 🔄 Nos pipelines par train
- **Train A** :
  - Build : [Jenkins](#) → [Configuration](#)
  - Deploy : [ArgoCD](#) → "Comment rollback ?" [Guide](#)
- **Train B** : ...

### 🚨 Gestion des dépendances
- **Matrice des dépendances** : [Sheet](#) (màj avant chaque PI Planning)
- **Processus d'escalade** :
  1. Identifier dans le **ROAM board**
  2. Escalader au **System Architect** si blocage > 2 jours
  3. Décision en **ART Sync** si nécessaire

## 4. 📊 Métriques SAFe
| Metric               | Cible      | Source          | Owner     |
|----------------------|------------|-----------------|-----------|
| Predictability       | >80%       | Jira + Script    | @RTE      |
| Time to Market       | <6 semaines| Confluence      | @PM       |
| Quality (Defects)    | <5%        | SonarQube       | @QA-Lead  |
```

---

## 🏗️ Autre exemple Wiki pour 10 équipes techniques
*(8 Dev, 1 OPS, 1 Data, 1 Qualité)*

### **1. 🏠 Accueil (Landing Page)**
- **🗺️ Cartographie des équipes** (1 ligne par équipe + liens vers leurs espaces)
  - Ex: `👉 Équipe A (Frontend Mobile) | 👉 Équipe B (Backend Payment) | 👉 OPS (Build/Support/Run)`
- **🔥 Top 5 liens utiles** (ex: "Comment deployer ?", "Qui contacter en urgence ?")
- **📅 Calendrier partagé** (PI Planning, releases, maintenances)
- **🚨 Statut des systèmes** (lien vers dashboard OPS en temps réel)

---

### **2. 👨‍💻 Équipes Dev (x8)**
*Structure identique pour chaque équipe, avec un espace dédié.*

#### **📂 [Nom Équipe] (ex: "Équipe A - Checkout")**
- **📌 Infos clés**
  - Composition (PO, Devs, SM, QA dédié si applicable)
  - Backlog (lien Jira/GitHub)
  - Canal Slack/Teams
- **🚀 Processus**
  - "Notre flow Git" (branching strategy, PR rules)
  - "Comment on gère les bugs ?"
- **📦 Livraison**
  - "De la PR à la prod" (étapes + owners)
  - "Checklist avant release"
- **📊 Métriques**
  - Velocity, temps de cycle, taux de bugs (liens vers dashboards)
- **🤝 Interactions**
  - "Comment travailler avec nous ?" (pour les autres équipes)
  - Dépendances connues (ex: "On dépend de l’équipe B pour l’API X")

---

### **3. 🛠️ Équipe OPS (Build/Support/Run)**
#### **📂 OPS - Infrastructure & Support**
- **📌 Infos clés**
  - Composition (PO, Devs, SM)
  - Backlog (lien Jira/GitHub)
  - Canal Slack/Teams
- **🚀 Processus**
  - "Notre flow Git" (branching strategy, PR rules)
  - "Comment on gère les bugs/incidents ?"
  - "Comment on gère les changements ?"
  - "Comment on gère les demandes de features ?"
  - "Comment on gère les demandes de bugs ?"
  - "Comment on gère les demandes de tests ?"
  - "Comment on gère les demandes de déploiements ?"
  - "Comment on gère les demandes de releases ?"
  - "Comment on gère les demandes de maintenances ?"
  - "Comment on gère les demandes de supports ?"
  - "Comment on gère les demandes de sorties ?"
- **Le rôle d'émissaire par équipe (1 OPS dédié sur 1 équipe)**
- **🔧 Build & CI/CD**
  - "Nos pipelines" (par environnement : dev/staging/prod)
  - "Comment ajouter un nouveau service ?" (template + processus)
  - "Secrets & accès" (comment obtenir/gérer les credentials)
- **🆘 Support & Run**
  - **Runbooks** (par service critique) :
    - Symptômes → Diagnostics → Solutions → Escalade
    - Ex: "Le paiement est down → Vérifier X, redémarrer Y, contacter Z"
  - "On-call rotation" (calendrier + processus d’escalade)
  - "Post-mortems" (archive des incidents majeurs + actions)
- **📡 Monitoring**
  - Liens vers dashboards (Grafana, Datadog, etc.)
  - "Seuils d’alerte et qui contacter"
- **🔒 Sécurité**
  - "Processus de vuln management" (comment signaler/corriger)
  - "Compliance checklist" (RGPD, SOC2, etc.)

---

### **4. 📊 Équipe Data**
#### **📂 Data - Analytics & ML**
- **🗃️ Data Sources**
  - Schéma des bases de données (avec owners)
  - "Dictionnaire des données" (définitions + exemples)
- **🔄 Pipelines ETL**
  - "Nos jobs Airflow/Spark" (où ils tournent, qui les maintient)
  - "Comment ajouter une nouvelle source ?"
- **📈 Reporting**
  - Liens vers Tableau/Looker (avec description des dashboards)
  - "Comment créer un nouveau rapport ?" (template + validation)
- **🤖 Machine Learning**
  - "Modèles en production" (version, performance, owner)
  - "Comment déployer un nouveau modèle ?"
- **🔍 Data Quality**
  - "Comment signaler un problème de données ?"
  - Métriques de qualité (frais, doublons, etc.)

---

### **5. 🛡️ Équipe Qualité (QA)**
#### **📂 QA - Tests & Assurance Qualité**
- **🧪 Stratégie de test**
  - "Pyramide de tests" (unitaires, intégration, E2E)
  - "Critères d’entrée/sortie" (Definition of Ready/Done)
- **🐞 Gestion des bugs**
  - "Comment reporter un bug ?" (template Jira + champs obligatoires)
  - "Processus de triage" (qui priorise, critères)
- **📋 Suites de tests**
  - "Où trouver les tests automatisés ?" (liens vers repos)
  - "Comment exécuter la suite de régression ?"
- **📊 Métriques qualité**
  - Taux de couverture, temps moyen de correction, etc.
- **🤝 Collaboration avec les Devs**
  - "Comment nous impliquer tôt dans un projet ?"
  - "Checklist avant une release"

---

### **6. 🤝 Transverse (Toutes Équipes)**
#### **📂 Processus Communs**
- **📅 Cérémonies partagées**
  - PI Planning (agenda, préparation, rétros)
  - System Demo (format, qui présente quoi)
- **📦 Livraison & Releases**
  - "Calendrier des releases" (dates, freeze periods)
  - "Processus de rollback" (qui décide, comment communiquer)
- **🚨 Gestion des incidents**
  - "Qui contacter en cas de problème ?" (matrice RACI)
  - "Comment déclarer un incident majeur ?"
- **📝 Documentation technique partagée**
  - "Nos standards de code" (linters, conventions)
  - "Comment documenter une API ?" (template OpenAPI/Swagger)

#### **📂 Outils & Accès**
- **🔑 Accès & Permissions**
  - "Comment obtenir l’accès à X ?" (Jira, prod, bases de données)
  - "Qui peut valider les demandes ?"
- **🛠️ Outils par équipe** (tableau récap)
  | Outil       | Équipe A | Équipe B | OPS  | Data | QA   |
  |-------------|----------|----------|------|------|------|
  | Jira        | ✅        | ✅        | ❌    | ✅    | ✅    |
  | Grafana     | ❌        | ❌        | ✅    | ✅    | ❌    |

#### **📂 Onboarding**
- **👋 Nouveau arrivant ? Commencez ici !**
  - Checklist par rôle (Dev/OPS/Data/QA)
  - "Qui contacter pour X ?" (mentors par équipe)
- **📚 Ressources utiles**
  - Glossaire (acronymes, jargon interne)
  - "Nos valeurs techniques" (ex: "On privilégie la simplicité")

---

### **7. 🗑️ Archive & Obsolète**
- **📦 Anciennes versions** (documents dépassés mais gardés pour référence)
- **🚫 À supprimer** (pages non mises à jour depuis >1 an)
- **🔄 En cours de refactor** (liste des pages à améliorer)


---

## 💡 **7 conseils pour une doc qui reste vivante** *(inspiré de [OpenSeriousGames](https://openseriousgames.org/osg-703-7-conseils-pratiques-pour-etablir-une-base-de-connaissances-prete-a-transmettre-20-min/))*

1. **🎯 Commencez par le "chemin critique"** :
   - *"Quelles sont les 3 pages qu'un nouveau doit lire en premier ?"* → Mettez-les en évidence.

2. **🔄 Appliquez le principe des "5 pourquoi"** :
   - Pour chaque processus documenté, demandez : *"Pourquoi on fait comme ça ?"* jusqu'à atteindre la racine. Documentez **le contexte**, pas juste les étapes.

3. **🤹 Utilisez la règle des 3 formats** :
   - **Texte** (pour le détail)
   - **Visuel** (schéma, infographie)
   - **Vidéo** (capture d'écran commentée pour les tutos)

4. **🗑️ Nettoyez régulièrement** :
   - *"Si cette page n'a pas été lue/modifiée depuis 6 mois, supprimez-la ou archivez-la."*

5. **👥 Désignez des "gardiens de la connaissance"** :
   - 1 personne par rôle/équipe responsable de :
     - Valider les mises à jour
     - Organiser des "doc sprints" trimestriels

6. **🎓 Intégrez la doc dans l'onboarding** :
   - *"Jour 1 : Lire X et faire Y. Jour 3 : Contribuer à Z."*
   - Exemple : *"Ajoute une astuce dans le wiki avant la fin de ta 1ère semaine."*

7. **🔍 Rendez-la searchable** :
   - **Tags obligatoires** : `#role-dev`, `#niveau-debutant`, `#process-deploy`
   - **Moteur de recherche interne**

---

## 🚀 **Checklist pour démarrer votre wiki**

```markdown
- [ ] Identifier les **3 persona principaux** (ex: "Dev junior", "PO senior")
- [ ] Créer un **template par type de contenu** (ex: "Fiche rôle", "Tuto technique")
- [ ] Définir un **processus de mise à jour** (qui, quand, comment)
- [ ] Lister les **10 questions les plus posées** sur Slack/Teams → en faire des pages
- [ ] Organiser un **atelier de co-création** avec 1 représentant par rôle
- [ ] Mettre en place un **système de feedback** (ex: "Cette page t'a aidé ? 👍/👎")
- [ ] Planifier un **doc sprint** dans les 3 prochains mois
```
