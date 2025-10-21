# 🎯 Stakeholder Mapping

## Description

Outil de cartographie des parties prenantes (stakeholders) pour identifier, analyser et prioriser les acteurs clés d'un projet. Basé sur les méthodologies de gestion de projet et d'analyse des parties prenantes.

## Objectif

Visualiser et gérer les parties prenantes selon leur niveau de pouvoir, d'intérêt et d'influence sur le projet, permettant ainsi de définir des stratégies d'engagement adaptées.

## Fonctionnalités

### 📋 Vue Tableau
- Liste complète des stakeholders
- Tri et filtrage par critères
- Actions rapides (édition, suppression)
- Vue d'ensemble des métriques

### 🎯 Vue Cercles Concentriques
- Visualisation par niveaux d'influence (Vital, Necessary, Good, Courtesy)
- Répartition par domaines (Governance, Customer, Provider, Influencer)
- Positionnement spatial intuitif
- Interaction avec les stakeholders

### 📊 Vue Matrice Power/Interest
- Grille 2x2 classique de gestion des parties prenantes
- 4 quadrants stratégiques :
  - **High Power, High Interest** : Most Important (effort maximal)
  - **High Power, Low Interest** : Keep Satisfied (garder satisfait)
  - **Low Power, High Interest** : Keep Informed (tenir informé)
  - **Low Power, Low Interest** : Least Important (effort minimal)

### 💾 Gestion des Données
- Sauvegarde automatique avec PocketBase
- Import/Export JSON
- Sessions multiples
- Historique des modifications

## Utilisation

### 1. Créer une Session

Cliquez sur "➕ Nouvelle Session" pour démarrer une nouvelle analyse de stakeholders.

### 2. Ajouter des Stakeholders

Pour chaque partie prenante, renseignez :
- **Nom** : Identité du stakeholder
- **Rôle** : Fonction ou position
- **Pouvoir** (1-5) : Capacité d'influence sur le projet
- **Intérêt** (1-5) : Niveau d'intérêt pour le projet
- **Influence** : Niveau d'impact (Vital, Necessary, Good, Courtesy)
- **Domaine** : Catégorie (Governance, Customer, Provider, Influencer)
- **Notes** : Informations complémentaires

### 3. Analyser les Vues

Basculez entre les 3 vues pour différentes perspectives :
- **Tableau** : Vue détaillée et éditable
- **Cercles** : Vue spatiale par influence
- **Matrice** : Vue stratégique Power/Interest

### 4. Définir les Stratégies

Selon le quadrant dans la matrice :
- **Most Important** : Communication fréquente, implication maximale
- **Keep Satisfied** : Reporting régulier, consultation sur décisions clés
- **Keep Informed** : Information continue, feedback sollicité
- **Least Important** : Communication minimale, monitoring passif

## Méthodologie

### Modèle Power/Interest Grid

Développé par Mendelow (1991), ce modèle classe les stakeholders selon deux dimensions :
- **Pouvoir** : Capacité à influencer le projet
- **Intérêt** : Niveau d'attention porté au projet

### Niveaux d'Influence

- **Vital** : Impact critique, décisions stratégiques
- **Necessary** : Influence importante, validation requise
- **Good** : Influence modérée, consultation recommandée
- **Courtesy** : Influence limitée, information suffisante

### Domaines

- **Governance** : Décideurs, sponsors, comité de pilotage
- **Customer** : Utilisateurs finaux, clients, bénéficiaires
- **Provider** : Fournisseurs, partenaires, prestataires
- **Influencer** : Leaders d'opinion, experts, médias

## Bonnes Pratiques

### Identification

1. **Brainstorming** : Lister toutes les parties prenantes potentielles
2. **Catégorisation** : Classer par domaine et influence
3. **Priorisation** : Évaluer pouvoir et intérêt objectivement

### Analyse

1. **Mise à jour régulière** : Réévaluer périodiquement
2. **Contexte dynamique** : Adapter selon l'évolution du projet
3. **Validation collective** : Confirmer avec l'équipe

### Engagement

1. **Stratégie adaptée** : Personnaliser selon le quadrant
2. **Communication ciblée** : Adapter le message et la fréquence
3. **Gestion des risques** : Anticiper les résistances

## Cas d'Usage

### Lancement de Projet
- Identifier tous les acteurs clés
- Définir la stratégie de communication
- Planifier les points de contact

### Transformation Organisationnelle
- Cartographier les influenceurs
- Gérer les résistances au changement
- Mobiliser les champions

### Gestion de Crise
- Prioriser les communications
- Identifier les alliés et opposants
- Adapter la stratégie en temps réel

## Configuration

### PocketBase

Les collections suivantes sont créées automatiquement :
- `tools_stakeholder_mapping_sessions` : Sessions d'analyse
- `tools_stakeholder_mapping_stakeholders` : Parties prenantes

### Import/Export

Format JSON standard :
```json
{
  "session": {
    "id": "...",
    "name": "Projet X",
    "created": "...",
    "updated": "..."
  },
  "stakeholders": [
    {
      "id": "...",
      "name": "Marie Dupont",
      "role": "CEO",
      "power": 5,
      "interest": 5,
      "influence": "vital",
      "domain": "governance",
      "notes": "..."
    }
  ]
}
```

## Références

### Méthodologies
- **Mendelow's Matrix** (1991) - Power/Interest Grid
- **Stakeholder Theory** - R. Edward Freeman (1984)
- **PMBOK Guide** - Project Management Institute

### Ressources
- [Stakeholder Analysis Guide - PMI](https://www.pmi.org/)
- [Managing Stakeholders - Harvard Business Review](https://hbr.org/)
- [Stakeholder Engagement - APM](https://www.apm.org.uk/)

## Raccourcis Clavier

- `Ctrl/Cmd + S` : Sauvegarder
- `Ctrl/Cmd + N` : Nouvelle session
- `Ctrl/Cmd + E` : Export JSON
- `Tab` : Navigation entre vues

## Support

Pour toute question ou suggestion :
- GitHub : [sebastien-rouen](https://github.com/sebastien-rouen/)
- Buy me a coffee : [sebastien.rouen](https://buymeacoffee.com/sebastien.rouen)

## Nouveautés v1.1.0

### 🔗 Partage de Sessions via URL
Chaque session dispose maintenant d'un ID unique dans l'URL (`?sessionId=xxxxxxxxxxxxx`), permettant :
- Partage direct de sessions entre collaborateurs
- Rechargement automatique de la session au retour
- Bookmarking de sessions spécifiques

### 🎨 Interface Améliorée
- Boutons de vues agrandis pour meilleure visibilité
- Repositionnement des contrôles (Actions et Partage à droite)
- Meilleure organisation visuelle de l'interface

### 💾 Persistance PocketBase Optimisée
- Création automatique des sessions avec ID unique
- Sauvegarde fiable des stakeholders
- Validation stricte des données (power et interest entre 1-5)
- Messages de feedback détaillés
- Correction de la validation des IDs (accepte format variable)

### 📖 Documentation

| Fichier | Description |
|---------|-------------|
| [QUICK_TEST.md](./QUICK_TEST.md) | ⚡ Test rapide en 5 minutes |
| [DEBUG_GUIDE.md](./DEBUG_GUIDE.md) | 🐛 Guide de débogage et résolution de problèmes |
| [SESSION_LIFECYCLE.md](./SESSION_LIFECYCLE.md) | 🔄 Cycle de vie d'une session (création, sauvegarde, partage) |
| [TEST_GUIDE.md](./TEST_GUIDE.md) | 📋 Guide complet de test et validation |
| [CHANGELOG.md](./CHANGELOG.md) | 📝 Historique détaillé des modifications |
| [FIX_SUMMARY.md](./FIX_SUMMARY.md) | 🔧 Résumé des corrections appliquées |
| [test-id-validation.html](./test-id-validation.html) | 🧪 Page de test de validation des IDs |

---

**Version** : 1.1.0  
**Dernière mise à jour** : 30 Janvier 2025  
**Licence** : MIT
