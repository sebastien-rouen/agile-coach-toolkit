# 🎯 Ikigai Explorer - Outil de Découverte Interactive

## 📋 Vue d'ensemble

L'Ikigai Explorer est un outil interactif de facilitation agile qui permet de découvrir et visualiser son Ikigai personnel. Basé sur le concept japonais d'Ikigai (raison d'être), cet outil aide à identifier l'intersection entre ce que vous aimez, ce pour quoi vous êtes doué, ce dont le monde a besoin et ce pour quoi vous pouvez être payé.

## 🎯 Objectif et Besoin

### Pourquoi cet outil ?
- **Clarification personnelle** : Aider les individus à identifier leur raison d'être
- **Facilitation d'équipe** : Support pour les coachs agiles et facilitateurs
- **Développement professionnel** : Orienter les choix de carrière et projets
- **Équilibre vie/travail** : Harmoniser passions, talents, besoins et revenus

### Public cible
- Coachs agiles et facilitateurs
- Individus en transition professionnelle
- Équipes en quête de sens et d'alignement
- Managers souhaitant accompagner leurs collaborateurs

## ⚙️ Fonctionnalités Principales

### 🎨 Interface Interactive
- **4 dimensions visuelles** : Cercles colorés représentant les 4 piliers de l'Ikigai
  - ❤️ **AMOUR** : Ce que vous aimez (passions)
  - 💪 **TALENT** : Ce pour quoi vous êtes doué (compétences)
  - 🌍 **BESOIN** : Ce dont le monde a besoin (impact)
  - 💰 **REVENUS** : Ce pour quoi vous pouvez être payé (valeur économique)

### 📝 Système de Post-its
- **3 types de post-its** pour catégoriser vos réflexions :
  - ✅ **Besoins nourris** : Aspects déjà satisfaits
  - ⚖️ **Non nourris mais OK** : Aspects acceptables en l'état
  - ❌ **Besoins non nourris** : Aspects à développer prioritairement

- **Interactions** :
  - Clic pour créer et placer un post-it
  - Glisser-déposer pour repositionner
  - Double-clic pour éditer le contenu
  - Actions de modification et suppression

### ⚙️ Leviers d'Action Intégrés

#### Collection de 10 Leviers Prédéfinis
1. **🎨 Explorer de nouvelles passions** - Découvrir ce qui vous anime vraiment
2. **💪 Développer ses compétences** - Renforcer vos talents naturels
3. **🌍 Identifier les besoins du monde** - Comprendre les problèmes à résoudre
4. **💰 Monétiser ses talents** - Transformer ses compétences en revenus
5. **🤝 Construire un réseau** - S'entourer de personnes inspirantes
6. **📚 Apprendre continuellement** - Rester curieux et ouvert
7. **⚖️ Équilibrer vie pro/perso** - Harmoniser tous les aspects de sa vie
8. **🎯 Définir sa mission personnelle** - Clarifier sa raison d'être
9. **🚀 Passer à l'action** - Concrétiser ses idées
10. **🔄 Accepter le changement** - S'adapter et évoluer

#### Fonctionnalités des Leviers
- **Drag & Drop** : Glisser un levier sur un post-it pour l'associer
- **Leviers personnalisés** : Créer ses propres leviers d'action
- **Gestion complète** : Éditer, supprimer, visualiser les leviers attachés
- **Indicateurs visuels** : Emojis sur les post-its montrant les leviers associés
- **Modal détaillé** : Voir tous les leviers attachés à un post-it

### 🧙‍♂️ Modes d'Utilisation

#### Mode Assistant (Wizard)
- Guide étape par étape pour les débutants
- Instructions contextuelles
- Progression structurée

#### Mode Direct
- Accès immédiat à tous les outils
- Pour les utilisateurs expérimentés
- Instructions rapides intégrées

### 💾 Gestion des Données
- **Sauvegarde automatique** : LocalStorage du navigateur
- **Export/Import** : Fichiers JSON pour partager ou sauvegarder
- **Restauration** : Proposition de récupération des données précédentes
- **Reset complet** : Remise à zéro avec confirmation

### 📊 Résumé et Export

#### Résumé Markdown Intégré
Le résumé génère automatiquement un document structuré incluant :

```markdown
🎯 **MON IKIGAI - [Date]**

✅ **BESOINS NOURRIS** (X)
  • [Post-it satisfait]
    ⚙️ [Levier associé]: [Description]
    ⚙️ [Autre levier]: [Description]

⚖️ **NON NOURRIS MAIS OK** (X)
  • [Post-it neutre]
    ⚙️ [Levier associé]: [Description]

❌ **BESOINS NON NOURRIS** (X)
  • [Post-it à améliorer]
    ⚙️ [Levier d'action]: [Description]
    ⚙️ [Plan d'amélioration]: [Description]

⚙️ **TOUS MES LEVIERS D'ACTION DISPONIBLES**
  • [Liste complète des leviers avec descriptions]

---
💡 **PROCHAINES ÉTAPES**
[Recommandations basées sur l'analyse]
```

#### Fonctionnalités d'Export
- **Copie presse-papier** : Résumé markdown prêt à coller
- **Export JSON** : Données complètes pour sauvegarde
- **Import JSON** : Restauration de sessions précédentes

## 🚀 Utilisation

### Démarrage Rapide
1. **Choisir le mode** : Assistant ou Direct
2. **Placer les post-its** : Cliquer sur les types et positionner sur les dimensions
3. **Associer les leviers** : Glisser les leviers sur les post-its pertinents
4. **Analyser** : Visualiser l'intersection centrale (votre Ikigai)
5. **Exporter** : Générer le résumé markdown avec leviers

### Bonnes Pratiques
- **Commencer par les passions** : Dimension AMOUR en premier
- **Être honnête** : Utiliser les 3 types de post-its sans complaisance
- **Associer les leviers** : Chaque post-it "non nourri" devrait avoir des leviers
- **Itérer** : Revenir régulièrement pour ajuster sa vision

## 🎨 Interface Responsive
- **Mobile-first** : Optimisé pour tablettes et smartphones
- **Touch-friendly** : Interactions tactiles fluides
- **Desktop** : Drag & drop HTML5 complet
- **Accessibilité** : Contrastes et tailles adaptés

## 🔧 Architecture Technique

### Stack
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Stockage** : LocalStorage + Export JSON
- **Responsive** : CSS Grid/Flexbox
- **Animations** : CSS transitions + JavaScript

### Fichiers Principaux
- `index.html` : Interface utilisateur
- `app.js` : Logique principale (1505 lignes)
- `leviers.js` : Collection des leviers d'action
- `wizard.js` : Mode assistant guidé
- `style.css` : Styles et animations

## 📈 Cas d'Usage

### Pour les Facilitateurs
- **Ateliers d'équipe** : Découverte collective de l'Ikigai
- **Coaching individuel** : Support visuel pour les entretiens
- **Formations** : Outil pédagogique interactif

### Pour les Individus
- **Transition professionnelle** : Clarifier ses objectifs
- **Développement personnel** : Identifier les axes d'amélioration
- **Planification de carrière** : Aligner passions et opportunités

### Pour les Organisations
- **Onboarding** : Aider les nouveaux collaborateurs
- **Entretiens annuels** : Support pour les discussions de développement
- **Team building** : Activité de cohésion d'équipe

## 🎯 Valeur Ajoutée

### Innovation
- **Leviers intégrés** : Première implémentation combinant Ikigai et plans d'action
- **Drag & Drop intelligent** : Association visuelle leviers/besoins
- **Export markdown** : Format universel pour documentation

### Facilitation
- **Outil complet** : De la réflexion à l'action en une session
- **Visuel et interactif** : Engagement maximal des participants
- **Personnalisable** : Leviers sur mesure selon le contexte

### Praticité
- **Aucune installation** : Fonctionne dans tout navigateur
- **Données privées** : Stockage local, pas de serveur
- **Partage facile** : Export/import pour collaboration

---

*Développé dans le cadre du BastaVerse - Outils Agiles Interactifs*