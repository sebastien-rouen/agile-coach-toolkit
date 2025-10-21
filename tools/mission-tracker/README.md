# 🎯 Mission Tracker

Suivez l'évolution de vos missions depuis le rapport d'étonnement jusqu'au bilan final.

## 📋 Description

Mission Tracker est un outil conçu pour les coachs agiles, Scrum Masters, Product Owners et autres rôles agiles pour documenter et suivre leurs missions de manière structurée.

### Fonctionnalités principales

- **Dashboard** : Vue d'ensemble de toutes vos missions
- **Gestion des missions** : Créer, éditer, suivre vos missions
- **Timeline** : Visualiser les événements marquants (réussites, échecs, apprentissages)
- **Rapports** : Générer des rapports d'étonnement et bilans finaux
- **Roadmap personnelle** : Planifier votre développement professionnel
- **Analytics** : Analyser vos performances et progressions

## 🚀 Démarrage Rapide

### Mode Local (par défaut)

L'outil fonctionne directement dans votre navigateur sans authentification :
- Les données sont stockées dans le **localStorage**
- Aucune connexion requise
- Idéal pour tester ou utiliser en mode standalone

### Mode PocketBase (optionnel)

Pour synchroniser vos données entre appareils :
1. Connectez-vous à PocketBase via l'interface
2. Vos données seront automatiquement synchronisées
3. Accédez à vos missions depuis n'importe quel appareil

## 🎨 Rôles Supportés

- **Coach Agile / Scrum Master** 🎓
- **Product Owner / Product Manager** 👨‍💼
- **Designer (UX/UI)** 🎨
- **Développeur** 💻
- **Architecte** 🏗️
- **DevOps / SRE** ⚙️
- **RTE (Release Train Engineer)** 🚢
- **Coach Organisationnel** 🌐

Chaque rôle dispose de :
- Objectifs par défaut adaptés
- Métriques suggérées
- Questions de rapport personnalisées

## 📊 Types d'Événements

- **✨ Réussite** : Célébrez vos succès
- **❌ Échec** : Documentez les apprentissages
- **🧪 Tentative** : Suivez vos expérimentations
- **💡 Apprentissage** : Notez vos insights
- **⚖️ Décision** : Tracez les décisions importantes

## 📝 Rapports

### Rapport d'étonnement (J+7/J+15)
Capturez vos premières impressions :
- Contexte de la mission
- Ce qui fonctionne bien
- Points de douleur identifiés
- Opportunités d'amélioration
- Objectifs pour les 3 prochains mois

### Checkpoints (hebdo/mensuel)
Suivez votre progression :
- Réalisations de la période
- Défis rencontrés
- Apprentissages clés
- Prochaines actions

### Bilan final
Documentez l'impact de votre mission :
- Résumé de la mission
- Objectifs atteints
- Défis surmontés
- Leçons apprises
- Recommandations pour la suite

## 🗂️ Structure des Données

### Mission
```json
{
  "title": "Transformation Agile Équipe X",
  "client": "Entreprise ABC",
  "role": "coach-agile",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "objectives": [
    { "text": "Améliorer la vélocité de 20%", "completed": false }
  ],
  "metrics": [
    { "name": "Vélocité", "value": 25, "unit": "points" }
  ]
}
```

### Événement
```json
{
  "type": "success",
  "title": "Sprint goal atteint",
  "description": "L'équipe a livré toutes les stories...",
  "date": "2024-02-01",
  "tags": ["sprint", "delivery"],
  "impact": "high"
}
```

## 💾 Stockage des Données

### Mode Local
- **localStorage** : Toutes les données sont stockées localement
- **Pas de limite** : Dépend de votre navigateur (généralement 5-10 MB)
- **Export** : Exportez vos données en JSON pour backup

### Mode PocketBase
- **Synchronisation** : Données sync en temps réel
- **Multi-appareils** : Accédez depuis n'importe où
- **Backup automatique** : Vos données sont sauvegardées

## 🔧 Configuration

Le fichier `config/config.json` contient :
- Liste des rôles et leurs spécificités
- Types d'événements
- Catégories de roadmap
- Questions de checkpoint
- Options d'export

## 📤 Export

Exportez vos données dans plusieurs formats :
- **PDF** : Rapports formatés pour impression
- **Markdown** : Format texte pour documentation
- **JSON** : Données brutes pour backup/migration

## 🎯 Cas d'Usage

### Coach Agile
1. Créer une mission pour chaque équipe accompagnée
2. Documenter les événements marquants (rétrospectives, décisions)
3. Générer un rapport d'étonnement à J+15
4. Faire des checkpoints hebdomadaires
5. Produire un bilan final en fin de mission

### Product Owner
1. Suivre l'évolution du produit
2. Documenter les décisions produit importantes
3. Tracker les expérimentations (A/B tests, features)
4. Mesurer l'impact des livraisons
5. Partager les apprentissages avec les stakeholders

### Scrum Master
1. Suivre la maturité agile de l'équipe
2. Documenter les améliorations continues
3. Tracker les impediments et leur résolution
4. Mesurer l'efficacité des cérémonies
5. Célébrer les succès de l'équipe

## 🛠️ Développement

### Stack Technique
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **UI Components** : Shoelace Web Components
- **Backend** : PocketBase (optionnel)
- **Storage** : localStorage + PocketBase sync

### Structure des Fichiers
```
tools/mission-tracker/
├── assets/
│   ├── css/
│   │   ├── base.css              # Variables et reset
│   │   ├── mission-tracker.css   # Styles principaux
│   │   ├── timeline.css          # Timeline visuelle
│   │   └── report-templates.css  # Templates de rapports
│   ├── js/
│   │   ├── mission-tracker.js    # Logique principale
│   │   ├── data-manager.js       # Gestion des données
│   │   ├── timeline-manager.js   # Gestion timeline
│   │   ├── report-generator.js   # Génération rapports
│   │   ├── export-manager.js     # Export PDF/MD/JSON
│   │   ├── pocketbase.js         # Auth PocketBase
│   │   ├── utils.js              # Utilitaires
│   │   └── templates/
│   │       ├── roles-config.js   # Config des rôles
│   │       └── questions-bank.js # Banque de questions
│   └── img/
│       └── logo.svg
├── config/
│   └── config.json               # Configuration
├── index.html                    # Point d'entrée
├── README.md                     # Documentation
└── CORRECTIONS.md                # Historique corrections
```

## 🐛 Dépannage

### Les données ne se sauvent pas
- Vérifiez que le localStorage n'est pas plein
- Vérifiez les permissions du navigateur
- Essayez en navigation privée pour tester

### Erreur de chargement des modules
- Vérifiez que tous les fichiers JS sont présents
- Ouvrez la console pour voir les erreurs détaillées
- Vérifiez que le serveur web sert les fichiers .js avec le bon MIME type

### PocketBase ne se connecte pas
- Vérifiez que PocketBase est démarré
- Vérifiez l'URL dans `pocketbase.js`
- Vérifiez les CORS si vous êtes en développement

## 📚 Références

- [Agile Fluency Model](https://www.agilefluency.org/)
- [Scrum Guide](https://scrumguides.org/)
- [SAFe Framework](https://www.scaledagileframework.com/)
- [Management 3.0](https://management30.com/)

## 📄 License

MIT - Sébastien ROUEN (Bastou)

## 🤝 Support

- GitHub : https://github.com/sebastien-rouen/
- Buy me a coffee : https://buymeacoffee.com/sebastien.rouen

---

**Version** : 1.0.0  
**Dernière mise à jour** : 23 novembre 2024
