# 🚀 Velocity Squad - Démarrage Rapide

## Installation et Configuration

### 1. Appliquer les migrations PocketBase

```bash
# Redémarrer PocketBase pour appliquer les migrations
pm2 restart pb-agile-drafts

# Vérifier que les collections sont créées
# Accéder à l'admin PocketBase : http://localhost:8090/_/
```

### 2. Vérifier les collections

Dans l'interface admin PocketBase, vous devriez voir :
- ✅ `tools_velocity_squad_sessions`
- ✅ `tools_velocity_squad_sprints`
- ✅ `tools_velocity_squad_team`
- ✅ `tools_velocity_squad_annotations`
- ✅ `tools_velocity_squad_mood`

## Utilisation

### Première utilisation

1. **Ouvrir l'outil** : `http://localhost/tools/velocity-squad/`
2. **Créer une session** : Cliquer sur "➕ Nouvelle Session"
3. **Nommer la session** : Ex: "Équipe Alpha - Q1 2025"
4. **Commencer à utiliser** : L'URL est mise à jour avec l'ID de session

### Ajouter des données

#### Ajouter un sprint
1. Cliquer sur "✏️ Saisie"
2. Remplir le formulaire :
   - Nom du sprint (ex: "Sprint 1")
   - Vélocité (story points)
   - Date de fin
3. Valider → Sauvegarde automatique dans PocketBase

#### Ajouter un membre d'équipe
1. Cliquer sur "➕ Ajouter Équipe" dans la section Capacité
2. Remplir :
   - Nom du membre
   - Rôle (Developer, PO, SM, etc.)
   - Compétences (séparées par virgules)
   - Capacité (0-100%)
3. Sauver → Synchronisation automatique

#### Ajouter un fait marquant
1. Cliquer sur "📝 Fait marquant"
2. Choisir :
   - Type (Équipe, Congés, Incident, Process, Release, Formation)
   - Sprint concerné
   - Description
3. Ajouter → Visible sur le graphique

#### Suivre l'humeur
1. Cliquer sur "😊 Humeur"
2. Sélectionner le mood du jour (Super, Correct, Difficile)
3. Ajouter un commentaire optionnel
4. Sauver → Intégré au radar de performance

### Réutiliser une session

Pour revenir à une session existante, utilisez l'URL avec l'ID :

```
http://localhost/tools/velocity-squad/?session=abc123xyz
```

💡 **Astuce** : Mettez cette URL en favori pour accéder rapidement à votre équipe !

## Cas d'usage

### Équipe Scrum classique

```
Session: "Équipe Produit - 2025"
Framework: Scrum
Sprint: 2 semaines (14 jours)
Jours ouvrés: 10

Membres:
- Alice (PO) - 100%
- Bob (Dev) - 100%
- Charlie (Dev) - 80%
- Diana (SM) - 50%
```

### Équipe Kanban

```
Session: "Support Client"
Framework: Kanban
Suivi: Items terminés par semaine

Membres:
- Eve (Support L1) - 100%
- Frank (Support L2) - 100%
```

### Plusieurs équipes

```
Équipe Alpha (Frontend):
URL: ?session=abc123

Équipe Beta (Backend):
URL: ?session=def456

Équipe Gamma (Mobile):
URL: ?session=ghi789
```

## Mode Démo

Sans paramètre `?session` dans l'URL :
- ✅ Toutes les fonctionnalités disponibles
- ⚠️ Données stockées uniquement dans localStorage
- ❌ Pas de sauvegarde PocketBase
- 💡 Idéal pour tester ou faire des démos

## Fonctionnalités Avancées

### Import de données

#### CSV/Excel
1. Exporter depuis JIRA ou Azure DevOps
2. Cliquer sur "📥 Import"
3. Sélectionner le fichier CSV
4. Les sprints sont automatiquement créés

#### JSON
1. Restaurer une sauvegarde précédente
2. Cliquer sur "📥 Import"
3. Sélectionner le fichier JSON
4. Toutes les données sont restaurées

### Export de données

#### JSON
- Sauvegarde complète de la session
- Inclut sprints, équipe, annotations, mood

#### Partage
- Génère une URL publique
- Données anonymisées (sans noms/commentaires sensibles)
- Idéal pour présenter aux stakeholders

### Templates

Démarrez rapidement avec des templates prédéfinis :

1. **Startup** : Équipe 3 pers, sprints 1 semaine
2. **Enterprise** : Équipe 5 pers, sprints 2 semaines
3. **Maintenance** : Mode Kanban, équipe 2 pers

## Dépannage

### PocketBase non disponible
**Symptôme** : Notification "Mode Démo"

**Solution** :
```bash
# Vérifier que PocketBase est démarré
pm2 status

# Redémarrer si nécessaire
pm2 restart pb-agile-drafts
```

### Session introuvable
**Symptôme** : Notification "Session introuvable"

**Solution** :
- Vérifier l'ID dans l'URL
- Créer une nouvelle session
- Vérifier dans l'admin PocketBase que la session existe

### Données non sauvegardées
**Symptôme** : Modifications perdues après rechargement

**Solution** :
1. Vérifier qu'une session est active (URL avec `?session=`)
2. Ouvrir la console du navigateur (F12)
3. Chercher des erreurs PocketBase
4. Vérifier que les migrations sont appliquées

## Support

- 📖 Documentation complète : `README-POCKETBASE.md`
- 🐛 Issues : Ouvrir un ticket sur GitHub
- 💬 Questions : Contacter l'équipe de développement

---

**Bon coaching ! 🎯**
