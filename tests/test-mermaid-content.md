---
id: "test-mermaid"
title: "Test d'Intégration Mermaid.js"
category: "test"
tags: ["mermaid", "diagrammes", "test", "documentation"]
description: "Fichier de test pour valider l'intégration de Mermaid.js dans le système de rendu Markdown"
---

# Test d'Intégration Mermaid.js

Ce document teste l'intégration de **Mermaid.js** dans le système de rendu Markdown.

## 🎯 Impact Mapping

Voici un exemple d'Impact Mapping avec Mermaid :

```mermaid
graph LR
    A[Pourquoi ?\nObjectif] --> B[Qui ?\nActeurs]
    B --> C[Comment ?\nImpacts]
    C --> D[Quoi ?\nLivrables]
```

**Explication** : Ce diagramme montre les 4 niveaux de l'Impact Mapping, de l'objectif aux livrables.

---

## 🔄 Cycle Scrum

Le cycle Scrum peut être représenté ainsi :

```mermaid
graph TD
    A[Product Backlog] --> B[Sprint Planning]
    B --> C[Sprint Backlog]
    C --> D[Daily Scrum]
    D --> E[Sprint Review]
    E --> F[Sprint Retrospective]
    F --> A
    
    D --> D
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#ef4444,stroke:#dc2626,color:#fff
    style E fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style F fill:#ec4899,stroke:#db2777,color:#fff
```

**Note** : Les couleurs permettent de différencier visuellement chaque étape du cycle.

---

## 📊 Flux de Travail Kanban

Un workflow Kanban simple :

```mermaid
graph LR
    A[Backlog] --> B[À faire]
    B --> C[En cours]
    C --> D[En revue]
    D --> E[Terminé]
    
    style A fill:#94a3b8
    style B fill:#3b82f6
    style C fill:#f59e0b
    style D fill:#8b5cf6
    style E fill:#10b981
```

---

## 🔀 Diagramme de Décision

Exemple d'arbre de décision pour la gestion des bugs :

```mermaid
graph TD
    A[Bug détecté] --> B{Urgent ?}
    B -->|Oui| C[Hotfix immédiat]
    B -->|Non| D{Impact élevé ?}
    D -->|Oui| E[Prioriser dans le sprint]
    D -->|Non| F[Ajouter au backlog]
    
    C --> G[Déploiement]
    E --> G
    F --> H[Prochaine planification]
```

---

## 💬 Diagramme de Séquence

Interaction utilisateur-système :

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant S as Système
    participant DB as Base de données
    
    U->>S: Demande de connexion
    S->>DB: Vérifier identifiants
    DB-->>S: Identifiants valides
    S-->>U: Connexion réussie
```

---

## 📈 Diagramme d'État

États d'un processus :

```mermaid
stateDiagram-v2
    [*] --> Inactif
    Inactif --> Actif: Démarrer
    Actif --> EnPause: Pause
    EnPause --> Actif: Reprendre
    Actif --> Terminé: Terminer
    Terminé --> [*]
```

---

## 🥧 Diagramme Circulaire

Répartition du temps de travail :

```mermaid
pie title Répartition du temps
    "Développement" : 45
    "Tests" : 20
    "Documentation" : 15
    "Réunions" : 20
```

---

## ✅ Validation

Si vous voyez tous les diagrammes ci-dessus correctement rendus, l'intégration Mermaid.js fonctionne parfaitement ! 🎉

### Points à vérifier

- ✅ Les diagrammes sont rendus (pas de code brut)
- ✅ Les couleurs sont appliquées
- ✅ Les sauts de ligne (`\n`) fonctionnent
- ✅ Les flèches et connexions sont visibles
- ✅ Le style s'adapte au thème du site

---

**Créé pour Coach Agile Toolkit**  
*Test d'intégration Mermaid.js v1.0*
