# 📊 Intégration Mermaid.js - Guide d'Utilisation

## Vue d'ensemble

Le site supporte maintenant **Mermaid.js** pour créer des diagrammes directement dans les fichiers Markdown. Mermaid permet de créer des diagrammes de flux, des graphiques, des diagrammes de séquence, et bien plus encore, en utilisant une syntaxe simple basée sur du texte.

## 🚀 Utilisation de Base

### Syntaxe dans les fichiers Markdown

Pour créer un diagramme Mermaid, utilisez un bloc de code avec le langage `mermaid` :

````markdown
```mermaid
graph LR
    A[Pourquoi ?\nObjectif] --> B[Qui ?\nActeurs]
    B --> C[Comment ?\nImpacts]
    C --> D[Quoi ?\nLivrables]
```
````

### Résultat

Le diagramme sera automatiquement rendu lors de l'affichage de la page.

## 📐 Types de Diagrammes Supportés

### 1. Diagrammes de Flux (Flowchart)

#### Orientation Horizontale (LR = Left to Right)
````markdown
```mermaid
graph LR
    A[Début] --> B{Décision}
    B -->|Oui| C[Action 1]
    B -->|Non| D[Action 2]
    C --> E[Fin]
    D --> E
```
````

#### Orientation Verticale (TD = Top Down)
````markdown
```mermaid
graph TD
    A[Début] --> B{Décision}
    B -->|Oui| C[Action 1]
    B -->|Non| D[Action 2]
    C --> E[Fin]
    D --> E
```
````

### 2. Diagrammes de Séquence

````markdown
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
````

### 3. Diagrammes de Classes

````markdown
```mermaid
classDiagram
    class Animal {
        +String nom
        +int age
        +manger()
        +dormir()
    }
    
    class Chien {
        +String race
        +aboyer()
    }
    
    class Chat {
        +String couleur
        +miauler()
    }
    
    Animal <|-- Chien
    Animal <|-- Chat
```
````

### 4. Diagrammes d'État

````markdown
```mermaid
stateDiagram-v2
    [*] --> Inactif
    Inactif --> Actif: Démarrer
    Actif --> EnPause: Pause
    EnPause --> Actif: Reprendre
    Actif --> Terminé: Terminer
    Terminé --> [*]
```
````

### 5. Diagrammes de Gantt

````markdown
```mermaid
gantt
    title Planning de Projet
    dateFormat YYYY-MM-DD
    section Phase 1
    Analyse       :a1, 2024-01-01, 30d
    Conception    :a2, after a1, 20d
    section Phase 2
    Développement :a3, after a2, 45d
    Tests         :a4, after a3, 15d
```
````

### 6. Diagrammes Circulaires (Pie Chart)

````markdown
```mermaid
pie title Répartition du temps
    "Développement" : 45
    "Tests" : 20
    "Documentation" : 15
    "Réunions" : 20
```
````

### 7. Diagrammes de Relations Entités (ERD)

````markdown
```mermaid
erDiagram
    UTILISATEUR ||--o{ COMMANDE : passe
    COMMANDE ||--|{ LIGNE_COMMANDE : contient
    PRODUIT ||--o{ LIGNE_COMMANDE : "est dans"
    
    UTILISATEUR {
        int id PK
        string nom
        string email
    }
    
    COMMANDE {
        int id PK
        date date_commande
        int utilisateur_id FK
    }
```
````

### 8. User Journey (Parcours Utilisateur)

````markdown
```mermaid
journey
    title Parcours d'achat en ligne
    section Découverte
      Recherche produit: 5: Client
      Consulte fiche: 4: Client
    section Achat
      Ajoute au panier: 3: Client
      Valide commande: 2: Client
    section Livraison
      Reçoit colis: 5: Client
```
````

## 🎨 Personnalisation des Styles

### Formes de Nœuds

````markdown
```mermaid
graph LR
    A[Rectangle]
    B(Rectangle arrondi)
    C([Stade])
    D[[Sous-routine]]
    E[(Base de données)]
    F((Cercle))
    G>Drapeau]
    H{Losange}
    I{{Hexagone}}
```
````

### Types de Flèches

````markdown
```mermaid
graph LR
    A --> B
    C --- D
    E -.-> F
    G ==> H
    I --o J
    K --x L
```
````

### Texte sur les Flèches

````markdown
```mermaid
graph LR
    A -->|Texte| B
    C ---|Texte| D
    E -.->|Texte| F
```
````

### Sauts de Ligne dans les Nœuds

Utilisez `\n` pour créer des sauts de ligne :

````markdown
```mermaid
graph LR
    A[Ligne 1\nLigne 2\nLigne 3]
```
````

## 🎯 Exemples Pratiques pour l'Agilité

### Impact Mapping

````markdown
```mermaid
graph LR
    A[Pourquoi ?\nObjectif] --> B[Qui ?\nActeurs]
    B --> C[Comment ?\nImpacts]
    C --> D[Quoi ?\nLivrables]
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#ef4444,stroke:#dc2626,color:#fff
```
````

### Cycle Scrum

````markdown
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
````

### Flux de Travail Kanban

````markdown
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
````

### Diagramme de Décision

````markdown
```mermaid
graph TD
    A[Problème détecté] --> B{Urgent ?}
    B -->|Oui| C[Hotfix immédiat]
    B -->|Non| D{Impact élevé ?}
    D -->|Oui| E[Prioriser dans le sprint]
    D -->|Non| F[Ajouter au backlog]
    
    C --> G[Déploiement]
    E --> G
    F --> H[Prochaine planification]
```
````

## 🔧 Configuration Technique

### Initialisation Automatique

Le système initialise automatiquement Mermaid lors du chargement du contenu Markdown :

```javascript
// Dans markdown-parser.js
function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }
}
```

### Configuration de Marked.js

Pour que les blocs Mermaid soient correctement détectés, `marked.js` utilise un renderer personnalisé :

```javascript
// Dans content.html
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code.bind(renderer);

renderer.code = function(code, language) {
    if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
    }
    return originalCodeRenderer(code, language);
};

// Utiliser marked avec le renderer
html = marked.parse(markdown, { renderer });
```

Cette configuration permet de transformer automatiquement les blocs ` ```mermaid ` en `<div class="mermaid">` qui seront ensuite rendus par Mermaid.js.

### Adaptation au Thème

Les diagrammes s'adaptent automatiquement au thème clair/sombre du site. Lors du changement de thème, utilisez :

```javascript
refreshMermaid(); // Recharge tous les diagrammes avec le nouveau thème
```

### Styles CSS

Les diagrammes sont stylisés via `assets/css/markdown.css` :

```css
.markdown-content .mermaid {
  background: var(--bg-secondary);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  margin: var(--space-md) 0;
  border: 1px solid var(--border-default);
  overflow-x: auto;
  text-align: center;
}
```

## 📚 Ressources

- **Documentation officielle Mermaid** : https://mermaid.js.org/
- **Éditeur en ligne** : https://mermaid.live/
- **Exemples** : https://mermaid.js.org/ecosystem/integrations.html

## ⚠️ Limitations et Bonnes Pratiques

### Limitations

1. **Complexité** : Évitez les diagrammes trop complexes (> 50 nœuds)
2. **Performance** : Les diagrammes très larges peuvent ralentir le rendu
3. **Mobile** : Certains diagrammes larges nécessitent un scroll horizontal

### Bonnes Pratiques

1. **Simplicité** : Privilégiez des diagrammes simples et lisibles
2. **Sauts de ligne** : Utilisez `\n` pour améliorer la lisibilité des labels
3. **Couleurs** : Utilisez les styles pour différencier les éléments importants
4. **Test** : Testez vos diagrammes sur https://mermaid.live/ avant de les intégrer
5. **Accessibilité** : Ajoutez toujours une description textuelle alternative

## 🐛 Dépannage

### Le diagramme ne s'affiche pas

1. Vérifiez la syntaxe sur https://mermaid.live/
2. Assurez-vous que le bloc commence par ` ```mermaid `
3. Vérifiez la console du navigateur pour les erreurs
4. Rechargez la page (Ctrl+F5)

### Le diagramme est tronqué

1. Ajoutez `overflow-x: auto` au conteneur
2. Réduisez la complexité du diagramme
3. Utilisez l'orientation verticale (TD) au lieu d'horizontale (LR)

### Les couleurs ne s'affichent pas

1. Vérifiez que les styles sont bien appliqués
2. Utilisez le format hexadécimal pour les couleurs : `#3b82f6`
3. Testez avec le thème par défaut

---

**Créé avec ❤️ pour Coach Agile Toolkit**  
*Version 1.0.0 - Janvier 2025*
