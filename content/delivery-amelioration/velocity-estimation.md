---
title: "Vélocité et Estimation"
description: "Techniques d'estimation et suivi de la vélocité d'équipe"
category: "delivery-amelioration"
tags: ["vélocité", "estimation", "planning-poker", "métriques"]
difficulty: "intermédiaire"
duration: "12 min"
author: "Coach Agile Toolkit"
lastUpdate: "2025-10-22"
---

# Vélocité et Estimation

## 🎯 **Pourquoi estimer les tickets, c’est utile ? (même si c’est pas parfait)**

Estimer, ce n’est **pas une science exacte**, mais ça reste un **outil précieux** pour une équipe Agile :

### **1️⃣ Ça force la discussion (et ça évite les mauvaises surprises)**

✅ **Clarifier les attentes** : En parlant d’un ticket, on découvre souvent des zones floues (*"Ah, en fait, il faut aussi gérer ce cas ?"*).
✅ **Partager la compréhension** : Tout le monde se met d’accord sur **ce qui est inclus (ou pas)** dans le travail.
✅ **Détecter les risques tôt** : *"Ce ticket semble simple, mais en vrai, il dépend de 3 autres équipes…"*

### **2️⃣ Ça aide à prioriser (et à dire "non")**

🔹 **Comparer l’effort vs. la valeur** : Un ticket à 13 points qui rapporte peu ? Peut-être qu’on le repousse.
🔹 **Équilibrer le sprint** : Si tout est estimé "gros", on sait qu’il faut **découper** ou **réajuster les attentes**.
🔹 **Dire stop** : *"On a déjà 30 points dans le sprint, si on ajoute ça, on va exploser notre capacité."*

### **3️⃣ Ça rend les prévisions (un peu) plus fiables**

📊 **Vitesse d’équipe (velocity)** : en suivant combien de points on livre par sprint, on peut **mieux prévoir** les prochaines itérations.
📅 **Roadmap réaliste** : *"Si on fait 20 points/sprint, ce projet de 100 points prendra ~5 sprints… pas 2."*
⚠️ **Attention** : les estimations ne sont **pas des engagements**, mais des **indicateurs** pour ajuster.

### **4️⃣ Ça responsabilise l’équipe**

👨💻👩💻 **Décision collective** : ce n’est pas le PO ou le manager qui impose, c’est **l’équipe qui s’accorde** sur la complexité.
⚒️ **Amélioration continue** : si on se trompe souvent, on en parle en rétro : *"Pourquoi ce ticket a pris 3x plus de temps ?"*

---
### **Mais attention aux pièges !**

❌ **Ne pas confondre estimation et engagement** → *"On a dit 5 points, pas 5 jours !"*
❌ **Éviter le perfectionnisme** → une estimation à ±50% est souvent suffisante.
❌ **Ne pas estimer pour estimer** → Si le ticket est trop flou, **affinez-le d’abord** !

---
### **En résumé : Estimer, c’est…**
🌿 **Parler avant de coder** (éviter les quiproquos).
🌿 **Prioriser avec intelligence** (pas juste "on fait tout").
🌿 **Avoir des repères** (même imparfaits).
🌿 *S’améliorer en équipe** (en analysant les écarts).

> *"Mieux vaut une estimation approximative aujourd’hui qu’une précision parfaite trop tard."* ⏳🎯

---

## 📚 Concepts Fondamentaux

### Vélocité

**Définition**
La vélocité est la quantité de travail qu'une équipe peut accomplir durant un sprint, mesurée en points de story ou en nombre de stories.

**Formule**
```
Vélocité = Somme des points des stories terminées (Done) dans un sprint
```

**Exemple**
```
Sprint 1 : 23 points
Sprint 2 : 27 points
Sprint 3 : 25 points
Vélocité moyenne : (23 + 27 + 25) / 3 = 25 points
```

### Estimation

**Principe**
Évaluer la complexité relative d'une user story, pas le temps absolu.

**Pourquoi pas en heures ?**
- ❌ Trop précis (fausse précision)
- ❌ Varie selon les personnes
- ❌ Pression sur les estimations
- ✅ Points = Complexité relative

![Sizing](https://media.licdn.com/dms/image/v2/C5112AQG8k6CwKd94QA/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1526461773597?e=1763596800&v=beta&t=7YlqMMqVBTsM8JLHx5oVyfll8cYx55xCHC4Zc-w6GZA)

---

## 🎲 Techniques d'Estimation

![Estimations](https://media.licdn.com/dms/image/v2/C5112AQHljHi4ujx_3w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1596578409080?e=1764201600&v=beta&t=UtJBwqL1AvnSO0jX3yq70yOGGFJr2pxyT6CwMoosLMQ)

### Planning Poker

**Matériel**
- Cartes avec suite de Fibonacci : 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕

**Déroulé**
1. Product Owner présente la story
2. Équipe pose des questions
3. Chacun choisit une carte en secret
4. Révélation simultanée
5. Discussion si écarts importants
6. Nouveau vote jusqu'à consensus

**Avantages**
- ✅ Engagement de toute l'équipe
- ✅ Discussions riches
- ✅ Consensus rapide

![SketchNotePokerPlanning](https://www.oeildecoach.com/wp-content/uploads/2019/03/poker-planning-poster-anthonycoulon-768x545.jpg)

### T-Shirt Sizing

![Tshirt](https://media.licdn.com/dms/image/v2/C5112AQERgARzV-kYZg/article-inline_image-shrink_400_744/article-inline_image-shrink_400_744/0/1526473979051?e=1763596800&v=beta&t=CxvOM6gkT2LnJhPecLwCkr3FcTVPoVQNGba6kahZAdU)

**Tailles**
- XS : Très simple
- S : Simple
- M : Moyen
- L : Complexe
- XL : Très complexe

**Usage**
- Estimation rapide du backlog
- Grooming initial
- Conversion en points ensuite

### Bucket System

**Principe**
- Créer des "seaux" (0, 1, 2, 3, 5, 8, 13, 21)
- Placer les stories dans les seaux
- Rapide pour gros backlog

Le Bucket System utilise la même échelle que le Planning Poker, mais en bien plus rapide. L’équipe estime les éléments en les plaçant directement dans des "seaux".

**Pourquoi c’est plus efficace ?**
✅ Gain de temps : grâce à une approche "diviser pour régner", l’équipe traite les éléments en parallèle.
✅ Adapté aux grands groupes : contrairement au Planning Poker, qui peut devenir lent avec beaucoup de participants.
✅ Idéal pour les gros backlogs : permet d’estimer un grand nombre d’items en une seule session.
Comment ça marche ?

Préparer les seaux : des feuilles (ou des paniers physiques) étiquetées avec les tailles (ex : 1, 2, 3, 5, 8, 13… comme en Fibonacci).
Tri rapide : chaque membre place les sticky notes (post-its) dans le seau qui lui semble correspondre.
Discussion ciblée : on ne débat que des items mal classés (ex : un post-it en "5" pour l’un, en "13" pour l’autre).
Affiner si besoin : répéter avec des sous-seaux pour les éléments ambigus.

💡 Astuce : Utiliser des vrais paniers pour éviter de revenir sur les items déjà traités !

En résumé :
🔹 Plus rapide que le Planning Poker.
🔹 Moins de débats (on discute seulement des désaccords).
🔹 Scalable pour les grosses équipes et les backlogs volumineux.

![Bucket](https://media.licdn.com/dms/image/v2/C5112AQGaNtSNShOT9g/article-inline_image-shrink_400_744/article-inline_image-shrink_400_744/0/1526468499592?e=1763596800&v=beta&t=eBZhBkqDxzrXhX-IYN9cnpzIYZ7h48zluNPivF_2pak)

---

## 📊 Utiliser la Vélocité

### Planification de Sprint

**Capacité du sprint**
```
Vélocité moyenne = 25 points
Capacité du sprint = 25 points ± 10%
→ Sélectionner 22-28 points de stories
```

### Prévision de Release

**Formule**
```
Nombre de sprints = Points restants / Vélocité moyenne
```

**Exemple**
```
Backlog : 150 points
Vélocité : 25 points/sprint
Estimation : 150 / 25 = 6 sprints
```

### Graphiques

**Burndown Chart**
```
Points
  |
100|●
 80|  ●
 60|    ●
 40|      ●
 20|        ●
  0|__________●
    S1 S2 S3 S4 S5 S6
```

**Burnup Chart**
```
Points
  |          ●
100|        ●
 80|      ●
 60|    ●
 40|  ●
 20|●
  0|__________
    S1 S2 S3 S4 S5 S6
```

---

## 💡 Bonnes Pratiques

### Estimation

**Do**
- ✅ Estimer en équipe
- ✅ Utiliser des références
- ✅ Accepter l'incertitude
- ✅ Ré-estimer si nécessaire

**Don't**
- ❌ Estimer seul
- ❌ Convertir en heures
- ❌ Comparer les équipes
- ❌ Utiliser pour évaluer les personnes

### Vélocité

**Do**
- ✅ Mesurer sur 3-5 sprints
- ✅ Utiliser pour la planification
- ✅ Accepter les variations
- ✅ Focus sur la tendance

**Don't**
- ❌ Comparer les équipes
- ❌ Fixer des objectifs de vélocité
- ❌ Pression pour augmenter
- ❌ Utiliser comme KPI de performance

---

## 🚧 Pièges à Éviter

### Inflation des Points

**Symptôme**
- Vélocité qui augmente artificiellement
- Stories surestimées

**Solution**
- Calibrer régulièrement
- Utiliser des stories de référence
- Rétrospectives sur l'estimation

### Vélocité Instable

**Causes**
- Équipe qui change
- Interruptions fréquentes
- Stories mal découpées

**Solution**
- Stabiliser l'équipe
- Protéger le sprint
- Améliorer le découpage

---

## 📚 Ressources

### Livres
- "Agile Estimating and Planning" - Mike Cohn

### Outils
- Planning Poker Online
- Scrum Poker Cards
- Jira (vélocité intégrée)

---

*À enrichir : Ajouter des exemples de sessions de planning poker, templates de burndown charts, calculateurs de vélocité*
