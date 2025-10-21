# 🎓 Apprentissage des Estimations

Outil interactif pour apprendre et comprendre les systèmes d'estimation agiles (Fibonacci et Tailles T-Shirt) en manipulant des cartes représentées par des animaux.

## 🎯 Objectif

Fournir une approche ludique et visuelle pour :
- Comprendre la progression des estimations
- Visualiser la relation entre complexité et poids
- Former les équipes aux systèmes d'estimation
- Pratiquer l'organisation des tâches par complexité

## 🐾 Fonctionnalités

### Deux Systèmes d'Estimation

#### 📊 Fibonacci
Suite mathématique où chaque nombre est la somme des deux précédents :
- **Valeurs** : 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
- **Avantage** : Reflète l'incertitude croissante
- **Idéal pour** : Équipes techniques, projets complexes

#### 👕 Tailles T-Shirt
Système simple et intuitif :
- **Valeurs** : XS, S, M, L, XL, XXL
- **Avantage** : Facile à comprendre, moins numérique
- **Idéal pour** : Équipes mixtes, non-techniques

### Animaux Représentatifs

Chaque animal a un poids réel qui correspond à une valeur d'estimation :

| Emoji | Animal | Poids | Fibonacci | T-Shirt |
|-------|--------|-------|-----------|---------|
| 🐜 | Fourmi | 2g | 1 | XS |
| 🐝 | Abeille | 100g | 2 | XS |
| 🐿️ | Écureuil | 500g | 3 | S |
| 🐇 | Lapin | 2kg | 5 | M |
| 🦊 | Renard | 5kg | 8 | L |
| 🐑 | Mouton | 70kg | 13 | XL |
| 🦌 | Cerf | 100kg | 21 | XL |
| 🐄 | Vache | 700kg | 34 | XXL |
| 🦏 | Rhinocéros | 1.4t | 55 | XXL |
| 🐘 | Éléphant | 5t | 89 | XXL |

## 🎮 Comment Utiliser

### Interaction Desktop
1. **Sélectionnez un système** : Cliquez sur "Fibonacci" ou "Taille T-Shirt"
2. **Glissez-déposez** : Réorganisez les cartes en les traînant
3. **Mélangez** : Cliquez sur "🔀 Mélanger les cartes" pour une nouvelle disposition
4. **Réinitialisez** : Cliquez sur "↺ Réinitialiser" pour revenir à l'ordre correct

### Interaction Mobile
1. **Touchez une carte** : Elle se met en surbrillance
2. **Glissez-la** : Déplacez-la vers sa nouvelle position
3. **Relâchez** : La carte se place à la nouvelle position

### Clavier
- **Barre d'espace** : Mélange les cartes

## 📚 Cas d'Usage

### Formation d'Équipe
- Montrez la progression des estimations
- Laissez les équipes réorganiser les cartes
- Discutez de la complexité relative

### Atelier de Planification
- Utilisez comme brise-glace
- Aidez les équipes à calibrer leurs estimations
- Visualisez les sauts de complexité

### Coaching Individuel
- Expliquez les systèmes d'estimation
- Montrez pourquoi Fibonacci est préféré
- Comparez avec les tailles T-Shirt

## 🛠️ Caractéristiques Techniques

- **Aucune dépendance** : Vanilla JavaScript pur
- **Responsive** : Fonctionne sur desktop, tablette et mobile
- **Accessible** : Navigation au clavier, contraste élevé
- **Performant** : Chargement instantané, pas de serveur requis

## 📱 Responsive Design

- **Desktop** : Cartes de 120×160px, disposition flexible
- **Tablette** : Adaptation automatique de la taille
- **Mobile** : Cartes de 100×140px, support tactile complet

## 🎨 Personnalisation

### Ajouter des Animaux
Modifiez l'objet `ANIMALS` dans `script.js` :

```javascript
const ANIMALS = {
    fibonacci: [
        { emoji: '🦁', name: 'Lion', weight: 190, value: 13 },
        // ...
    ]
};
```

### Changer les Couleurs
Modifiez les variables CSS dans `styles.css` :

```css
:root {
    --primary: #your-color;
    --primary-dark: #darker-shade;
}
```

## 📖 Ressources Complémentaires

- [Fibonacci Estimation](https://www.mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating)
- [Planning Poker](https://en.wikipedia.org/wiki/Planning_poker)
- [Agile Estimation](https://www.agilealliance.org/glossary/estimation/)

## 🤝 Contribution

Les contributions sont bienvenues ! Vous pouvez :
- Ajouter de nouveaux animaux
- Améliorer l'interface
- Ajouter de nouveaux systèmes d'estimation
- Corriger des bugs

## 📄 Licence

MIT - Libre d'utilisation et de modification

---

**Créé pour l'Agile Coach Toolkit** 🚀
