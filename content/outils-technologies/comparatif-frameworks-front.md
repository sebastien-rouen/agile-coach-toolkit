---
id: "comparatif-frameworks-front"
title: "🎨 Atelier : Comparatif Pratique des Frameworks Front (React, Vue, Angular, Svelte, SolidJS...)"
category: "animation-facilitation"
tags: ["atelier", "frameworks", "frontend", "react", "vuejs", "angular", "svelte", "solidjs", "comparatif", "hands-on", "tech-radar"]
description: "Un atelier interactif pour comparer les frameworks front en **pratiquant**. Avec critères objectifs, benchmarks, et retour d'expérience des participants. Idéal pour choisir la bonne techno ou monter en compétences."
---

# **🎨 Atelier : Comparatif Pratique des Frameworks Front**
*Parce que le meilleur moyen de choisir un framework, c’est de **le coder** !*

**Tags** : `#atelier` `#frameworks` `#frontend` `#react` `#vuejs` `#angular` `#svelte` `#solidjs` `#comparatif` `#hands-on` `#tech-radar`

> *"Choisir un framework sans l’avoir testé, c’est comme acheter une voiture sans l’avoir conduite. Cet atelier, c’est votre **essai routier** !"*
> — **Coach Sticko** 🚗💨

---

## **💡 Pourquoi Cet Atelier ?**
### **Le Problème**
- **Trop de choix** : React, Vue, Angular, Svelte, SolidJS, Lit… **Lequel adopter ?**
- **Biais cognitifs** :
  - *"On prend React parce que c’est le plus populaire."*
  - *"Angular est trop complexe."* (⚠️ Préjugé sans preuve).
- **Manque de pratique** : Les benchmarks théoriques ≠ **expérience réelle**.

### **La Solution**
Un atelier **hands-on** où les participants :
1. **Codent** un même composant dans plusieurs frameworks.
2. **Mesurent** des critères objectifs (performance, DX, taille bundle…).
3. **Partagent** leurs retours d’expérience.
4. **Décident** en connaissance de cause.

---
## **⚙️ Préparation de l’Atelier**
### **Public Cible**
- **Développeurs front** (junior à senior).
- **Tech leads** ou **architectes** en phase de choix technologique.
- **Curieux** qui veulent découvrir d’autres frameworks.

### **Prérequis**
- Connaissances basiques en **HTML/CSS/JS**.
- Un **IDE** (VSCode, WebStorm…) ou un **online editor** (CodeSandbox, StackBlitz).
- **Node.js** installé (pour les benchmarks locaux).

### **Matériel Nécessaire**
| Élément               | Exemple                                  |
|-----------------------|------------------------------------------|
| **Template de base**  | Un composant simple à implémenter (ex: liste de tâches avec filtres). |
| **Environnement**     | [CodeSandbox](https://codesandbox.io/) ou [StackBlitz](https://stackblitz.com/). |
| **Outils de mesure**  | Lighthouse, WebPageTest, BundlePhobia. |
| **Grille d’évaluation** | Tableau comparatif (voir plus bas). |
| **Timer**             | Pour timeboxer les sessions de code. |

### **Durée**
- **2h à 3h** (selon le nombre de frameworks testés).

---
## **📌 Déroulement de l’Atelier**
### **Étape 1 : Introduction (15 min)**
1. **Tour de table** :
   - *"Quel framework utilisez-vous aujourd’hui ? Pourquoi ?"*
   - *"Quels sont vos critères de choix ?"*
2. **Présentation des frameworks** (5 min chacun) :
   | Framework  | Créateur       | Année | Particularités                          |
   |------------|----------------|-------|----------------------------------------|
   | **React**  | Meta           | 2013  | Virtual DOM, JSX, écosystème géant.    |
   | **Vue.js** | Evan You       | 2014  | Réactivité fine, template HTML.        |
   | **Angular**| Google         | 2016  | Full framework (DI, RxJS, TypeScript). |
   | **Svelte** | Rich Harris    | 2019  | Compilation, pas de Virtual DOM.       |
   | **SolidJS**| Ryan Carniato  | 2020  | Réactivité fine comme Vue, mais plus proche de React. |
   | **Lit**    | Google         | 2019  | Web Components natifs.                |

3. **Présentation du composant à coder** :
   - Exemple : Une **todo-list** avec :
     - Ajout/suppression de tâches.
     - Filtre (toutes/actives/complétées).
     - Persistance locale (localStorage).

---
### **Étape 2 : Session de Code (60-90 min)**
#### **Format**
- **Par groupes de 2-3 personnes**.
- **1 framework par groupe** (ou rotation si temps).
- **Timebox** : 20-30 min par framework.

#### **Consignes**
1. Implémenter le composant **sans copier-coller** (pour ressentir la DX).
2. **Noter les difficultés** (ex: *"La gestion des états est verbeuse en Angular"*).
3. **Mesurer** :
   - Taille du bundle ([BundlePhobia](https://bundlephobia.com/)).
   - Performance (Lighthouse dans Chrome).
   - Temps de développement (subjectif).

#### **Exemple de Code de Base (TodoList)**
```javascript
// À implémenter dans chaque framework !
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const addTodo = (text) => { /* ... */ };
  const toggleTodo = (id) => { /* ... */ };

  return (
    <div>
      <input onKeyDown={(e) => { /* Ajouter une tâche */ }} />
      <button onClick={() => setFilter("active")}>Actives</button>
      <ul>
        {todos.filter(/* Filtre selon 'filter' */).map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---
### **Étape 3 : Benchmark et Évaluation (30 min)**
#### **Critères de Comparaison**
| Critère               | Description                                  | Outils de Mesure                     |
|-----------------------|---------------------------------------------|--------------------------------------|
| **Taille du bundle**  | Impact sur le temps de chargement.          | BundlePhobia, Webpack Bundle Analyzer |
| **Performance**        | Temps de rendu, FPS.                        | Lighthouse, WebPageTest               |
| **DX (Developer eXperience)** | Facilité à coder, docs, outils.       | Retour subjectif des participants    |
| **Courbe d’apprentissage** | Temps pour maîtriser le framework.      | Enquête post-atelier                 |
| **Écosystème**        | Nombre de librairies, communauté.           | npm trends, GitHub stars              |
| **Maintenabilité**    | Facilité à déboguer, tester.                | Retour d’expérience                  |
| **SEO**               | Rendu côté serveur (SSR) ou hydratation.    | Test avec `curl` ou "View Page Source" |

#### **Grille d’Évaluation (à remplir par les groupes)**
| Framework  | Taille Bundle | Lighthouse Score | DX (1-5) | Temps Dev | Écosystème | Notes |
|------------|---------------|-------------------|----------|-----------|------------|-------|
| React      |               |                   |          |           |            |       |
| Vue.js     |               |                   |          |           |            |       |
| Angular    |               |                   |          |           |            |       |
| Svelte     |               |                   |          |           |            |       |
| SolidJS    |               |                   |          |           |            |       |

---
### **Étape 4 : Restitution et Débat (30 min)**
1. **Chaque groupe présente** :
   - *"On a testé **Vue.js** : on a aimé [X], détesté [Y], et voici nos metrics."*
2. **Synthèse collective** :
   - **Top 3 des frameworks** selon les critères.
   - **Surprises** (ex: *"Svelte est plus simple que prévu !"*).
3. **Débat** :
   - *"Quel framework pour quel cas d’usage ?"* (ex: React pour les gros projets, Svelte pour les micro-apps).
   - *"Comment concilier performance et DX ?"*

---
### **Étape 5 : Conclusion et Prochaines Étapes (15 min)**
1. **Ressources pour aller plus loin** :
   - [State of JS](https://stateofjs.com/) (tendances).
   - [RealWorld App](https://github.com/gothinkster/realworld) (comparaison sur une même app).
   - [krausest/js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) (benchmarks avancés).
2. **Plan d’action** :
   - *"On teste **SolidJS** sur un nouveau projet pilote."*
   - *"On organise un brown-bag sur **Svelte** la semaine prochaine."*
3. **Feedback** :
   - *"Quel format d’atelier préférez-vous ?"* (plus/moins de pratique, durée…).

---
## **⚖️ Avantages et Inconvénients par Framework**
*(Synthèse basée sur les retours courants en atelier)*

| Framework  | ✅ Avantages                                  | ❌ Inconvénients                              | 🔍 Cas d’Usage Idéal                     |
|------------|---------------------------------------------|---------------------------------------------|------------------------------------------|
| **React**  | - Écosystème énorme (Next.js, Redux…).<br>- Grande communauté.<br>- Flexible. | - Courbe d’apprentissage (JSX, hooks).<br>- Taille bundle élevée. | Apps complexes, équipes expérimentées. |
| **Vue.js** | - Courbe d’apprentissage douce.<br>- Réactivité simple.<br>- Bonne performance. | - Moins mature pour les très grosses apps.<br>- Écosystème plus petit que React. | Projets moyens, équipes mixtes (junior/senior). |
| **Angular**| - Tout-en-un (routing, DI, RxJS).<br>- TypeScript natif.<br>- Bon pour les entreprises. | - Complexité initiale.<br>- Lourd (taille bundle). | Applications d’entreprise, longs cycles de vie. |
| **Svelte** | - Pas de Virtual DOM → **ultra-performant**.<br>- Syntaxe simple.<br>- Petit bundle. | - Écosystème jeune.<br>- Moins de librairies. | Micro-apps, projets où la perf est critique. |
| **SolidJS**| - Réactivité fine comme Vue + syntaxe proche de React.<br>- Pas de Virtual DOM.<br>- Très performant. | - Communauté petite (mais grandissante).<br>- Moins de tutos. | Apps réactives complexes (alternative à React). |
| **Lit**    | - Web Components natifs → **interopérabilité**.<br>- Léger.<br>- Bon pour les design systems. | - Moins adapté aux apps complexes.<br>- Pas de gestion d’état intégrée. | Composants réutilisables, intégration progressive. |

---
## **⚠️ Pièges à Éviter**
| Piège                          | Conséquence                              | Solution                                  |
|--------------------------------|-----------------------------------------|-------------------------------------------|
| **Trop de frameworks en 1 atelier** | Surface, pas de profondeur.            | **Limiter à 3-4 frameworks max**.        |
| **Groupes déséquilibrés**      | Certains finissent trop vite/trop tard. | **Équipes hétérogènes** (junior + senior). |
| **Pas de timebox**             | L’atelier dérape en 4h.                 | **20-30 min par framework max**.          |
| **Oublier les metrics**        | Débat subjectif sans données.           | **Préparer un tableau comparatif**.       |
| **Négliger la restitution**    | Perte des insights.                     | **Noter les retours sur un board partagé**. |

---
## **📌 Checklist pour Animer l’Atelier**
### **Avant l’Atelier**
- [ ] **Choisir les frameworks à comparer** (3-4 max).
- [ ] **Préparer un template de base** (ex: todo-list) sur CodeSandbox.
- [ ] **Créer un tableau comparatif** (Google Sheets ou Miro).
- [ ] **Vérifier les outils** (Lighthouse, BundlePhobia).
- [ ] **Envoyer un pré-questionnaire** :
  - *"Quel framework maîtrisez-vous déjà ?"*
  - *"Quels critères sont importants pour vous ?"*

### **Pendant l’Atelier**
- [ ] **Lancer un timer visible** pour chaque session.
- [ ] **Circuler entre les groupes** pour répondre aux questions.
- [ ] **Encourager les retours honnêtes** (ex: *"Ce framework m’a énervé parce que…"*).
- [ ] **Prendre des notes** sur les surprises/insights.

### **Après l’Atelier**
- [ ] **Partager les résultats** (metrics + retours).
- [ ] **Créer un canal dédié** (Slack/Teams) pour continuer les échanges.
- [ ] **Proposer un suivi** :
  - *"On refait un atelier sur **SolidJS** dans 1 mois ?"*
  - *"Qui veut contribuer à un POC ?"*

---
> *"Le meilleur framework, c’est celui que votre équipe **maîtrise et aime utiliser**. Les benchmarks, c’est bien. Le ressenti des devs, c’est mieux. Cet atelier, c’est les deux !"*
> — **Coach Sticko** 🎯🚀

---
### **📚 Ressources Complémentaires**
- **Pour approfondir** :
  - [RealWorld App](https://github.com/gothinkster/realworld) (même app dans +20 frameworks).
  - [JS Framework Benchmark](https://krausest.github.io/js-framework-benchmark/) (perfs brutes).
- **Pour choisir** :
  - [State of JS](https://stateofjs.com/) (tendances 2023).
  - [npm trends](https://npmtrends.com/) (popularité des librairies).
- **Pour pratiquer** :
  - [CodeSandbox Templates](https://codesandbox.io/explore).
  - [StackBlitz](https://stackblitz.com/) (IDE online ultra-rapide).