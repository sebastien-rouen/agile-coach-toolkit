# Velocity Squad - Intégration PocketBase

## 📋 Vue d'ensemble

L'outil Velocity Squad utilise PocketBase pour persister les données et gérer les sessions d'équipe. Cela permet de :

- **Sauvegarder** automatiquement les sprints, membres, annotations et mood tracking
- **Partager** les sessions entre plusieurs utilisateurs
- **Réutiliser** les données d'une équipe spécifique (Équipe Alpha, Équipe Beta, etc.)
- **Historiser** les performances sur le long terme

## 🗄️ Architecture des Collections

### 1. `tools_velocity_squad_sessions`
Stocke les sessions d'équipe avec leurs paramètres.

**Champs :**
- `name` (text) : Nom de la session (ex: "Équipe Alpha - Q1 2025")
- `framework` (select) : "scrum" ou "kanban"
- `sprint_length` (number) : Durée du sprint en jours
- `working_days` (number) : Jours ouvrés par sprint
- `active` (bool) : Session active ou archivée

### 2. `tools_velocity_squad_sprints`
Stocke les sprints avec leur vélocité.

**Champs :**
- `session` (relation) : Lien vers la session
- `name` (text) : Nom du sprint (ex: "Sprint 1")
- `velocity` (number) : Story points complétés
- `end_date` (date) : Date de fin du sprint
- `active` (bool) : Sprint actif

### 3. `tools_velocity_squad_team`
Stocke les membres de l'équipe.

**Champs :**
- `session` (relation) : Lien vers la session
- `name` (text) : Nom du membre
- `role` (text) : Rôle (Developer, PO, SM, etc.)
- `skills` (json) : Liste des compétences
- `capacity` (number) : Capacité en % (0-100)
- `active` (bool) : Membre actif

### 4. `tools_velocity_squad_annotations`
Stocke les faits marquants sur les sprints.

**Champs :**
- `session` (relation) : Lien vers la session
- `sprint` (text) : ID du sprint concerné
- `type` (select) : Type d'annotation (team, vacation, incident, process, release, training)
- `text` (text) : Description de l'événement
- `active` (bool) : Annotation active

### 5. `tools_velocity_squad_mood`
Stocke le suivi de l'humeur de l'équipe.

**Champs :**
- `session` (relation) : Lien vers la session
- `date` (date) : Date de l'entrée
- `score` (number) : Score 1-3 (1=Difficile, 2=Correct, 3=Super)
- `comment` (text) : Commentaire optionnel
- `member` (text) : Identifiant du membre (ID numérique)
- `memberName` (text) : Nom du membre

## 🚀 Utilisation

### Créer une nouvelle session

1. Cliquez sur le bouton **"➕ Nouvelle Session"** dans l'en-tête
2. Entrez un nom descriptif (ex: "Équipe Alpha - Q1 2025")
3. La session est créée et l'URL est mise à jour avec l'ID

### Charger une session existante

Ajoutez le paramètre `?session=ID_SESSION` à l'URL :

```
http://localhost/tools/velocity-squad/?session=abc123xyz
```

### Mode Démo

Sans paramètre `session` dans l'URL, l'outil fonctionne en mode démo :
- Les données sont stockées uniquement dans localStorage
- Aucune sauvegarde PocketBase
- Idéal pour tester ou faire des démos

## 🔄 Synchronisation

### Automatique
Toutes les actions (ajout de sprint, membre, annotation, mood) sont automatiquement sauvegardées dans PocketBase si une session est active.

### Manuelle
La fonction `syncWithPocketBase()` peut être appelée pour forcer une synchronisation complète.

## 📊 Cas d'usage

### Équipe unique
```
Session: "Mon Équipe Scrum"
URL: ?session=abc123
```

### Plusieurs équipes
```
Session 1: "Équipe Alpha - Frontend"
URL: ?session=abc123

Session 2: "Équipe Beta - Backend"
URL: ?session=def456
```

### Historique long terme
```
Session Q1: "Équipe Alpha - Q1 2025"
Session Q2: "Équipe Alpha - Q2 2025"
```

## 🛠️ Migrations PocketBase

Les migrations sont situées dans `/bdd/pb_migrations/` :

- `1757600100_create_velocity_squad_sessions.js`
- `1757600101_create_velocity_squad_sprints.js`
- `1757600102_create_velocity_squad_team.js`
- `1757600103_create_velocity_squad_annotations.js`
- `1757600104_create_velocity_squad_mood.js` (inclut le champ `memberName`)

Pour appliquer les migrations :

```bash
# Redémarrer PocketBase
pm2 restart pb-agile-drafts
```

## 🔐 Sécurité

Les règles d'accès sont configurées pour permettre :
- **Lecture** : Tous les utilisateurs
- **Création** : Tous les utilisateurs
- **Modification** : Tous les utilisateurs
- **Suppression** : Tous les utilisateurs

⚠️ **Note** : Pour un environnement de production, ajustez les règles selon vos besoins de sécurité.

## 🐛 Dépannage

### PocketBase non disponible
Si PocketBase n'est pas accessible, l'outil bascule automatiquement en mode localStorage.

### Session introuvable
Si l'ID de session dans l'URL n'existe pas, une notification s'affiche avec l'option de créer une nouvelle session.

### Données non sauvegardées
Vérifiez que :
1. PocketBase est démarré (`pm2 status`)
2. L'URL contient un paramètre `?session=ID`
3. Les migrations sont appliquées
4. La console du navigateur ne montre pas d'erreurs

## 📚 Ressources

- [Documentation PocketBase](https://pocketbase.io/docs/)
- [Guide des migrations](../../docs/pocketbase-migrations.md)
- [Architecture API Multi-Sites](../../README.md)
