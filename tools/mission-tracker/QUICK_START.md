# 🚀 Quick Start - Mission Tracker

## Démarrage rapide

### 1. Ouvrir l'application

```bash
# Depuis la racine du projet
open tools/mission-tracker/index.html
```

Ou directement dans votre navigateur :
```
file:///path/to/agile/tools/mission-tracker/index.html
```

### 2. Tester les modales

#### Console du navigateur (F12)

```javascript
// Ouvrir la modal "Nouvelle mission"
window.missionTracker.openCreateMissionModal();

// Ouvrir la modal "Rapport d'étonnement"
window.missionTracker.openInitialReportModal();

// Ouvrir la modal "Checkpoint"
window.missionTracker.openCheckpointModal();

// Ouvrir la modal "Bilan final"
window.missionTracker.openFinalReportModal();

// Ouvrir la modal "Export"
window.missionTracker.openExportModal();
```

### 3. Créer votre première mission

1. Cliquez sur **"Nouvelle mission"** dans le header
2. Remplissez les champs :
   - **Titre** : Ex. "Transformation Agile Équipe X"
   - **Client** : Ex. "Entreprise ABC"
   - **Rôle** : Sélectionnez votre rôle
   - **Date de début** : Sélectionnez la date
3. Cliquez sur **"Créer la mission"**
4. Votre mission apparaît dans la liste

### 4. Utiliser les actions rapides

Dans le **Dashboard**, vous trouverez 6 actions rapides :

| Action | Description |
|--------|-------------|
| 📝 Rapport d'étonnement | Documentez vos premières impressions (J+15) |
| 📅 Checkpoint hebdo | Point régulier sur votre progression |
| 🏆 Ajouter une réalisation | Notez vos succès |
| ⚠️ Noter un défi | Documentez les obstacles |
| 💡 Lancer une expérimentation | Testez une nouvelle approche |
| 🏁 Bilan final | Synthèse complète de la mission |

### 5. Navigation

#### Tabs disponibles

- **Dashboard** : Vue d'ensemble et actions rapides
- **Mes missions** : Liste de toutes vos missions
- **Timeline** : Chronologie des événements
- **Rapports** : Tous vos rapports (étonnement, checkpoints, bilans)
- **Roadmap perso** : Votre plan de développement
- **Analytics** : Statistiques et graphiques

### 6. Mode local (sans PocketBase)

L'application fonctionne en **mode local** par défaut :
- ✅ Les données sont stockées dans `localStorage`
- ✅ Pas besoin de serveur
- ✅ Idéal pour tester et prototyper

**Console attendue :**
```
🎯 Mission Tracker - Initialisation...
📦 Configuration chargée: {roles: [...]}
ℹ️ Mode local (sans authentification PocketBase)
✅ 0 missions chargées
✅ Event listeners initialisés
✅ Application initialisée
✅ Mission Tracker loaded
```

### 7. Vérifier que tout fonctionne

#### Checklist rapide

- [ ] La page se charge sans erreur
- [ ] Le dashboard affiche les KPI (0/0/0/0)
- [ ] Le bouton "Nouvelle mission" ouvre la modal
- [ ] Les actions rapides ouvrent les bonnes modales
- [ ] Les tabs sont cliquables
- [ ] Aucune erreur dans la console

#### Console de debug

```javascript
// Vérifier l'état de l'application
console.log(window.APP_STATE);

// Vérifier la config
console.log(window.APP_STATE.config);

// Vérifier les missions
console.log(window.APP_STATE.missions);
```

### 8. Problèmes courants

#### La modal ne s'ouvre pas
```javascript
// Vérifier que la modal existe
const modal = document.getElementById('modal-new-mission');
console.log(modal); // Doit afficher l'élément <sl-dialog>

// Vérifier que Shoelace est chargé
console.log(window.SlDialog); // Doit afficher la classe
```

#### Les rôles ne s'affichent pas
```javascript
// Vérifier la config
console.log(window.APP_STATE.config.roles);
// Doit afficher un tableau de rôles
```

#### Les données ne se sauvent pas
C'est normal ! La sauvegarde PocketBase n'est pas encore implémentée.
Les données sont actuellement affichées dans la console :
```
✅ Mission créée: {id: "...", title: "..."}
📝 Rapport d'étonnement: {...}
```

### 9. Développement

#### Structure des fichiers

```
tools/mission-tracker/
├── index.html              # Point d'entrée
├── assets/
│   ├── css/
│   │   └── mission-tracker.css
│   └── js/
│       ├── mission-tracker.js    # Logique principale
│       ├── data-manager.js       # Gestion des données
│       └── templates/
│           ├── roles-config.js
│           └── questions-bank.js
├── config/
│   └── config.json         # Configuration (rôles, etc.)
└── docs/
    ├── MODALS_FIX.md       # Documentation technique
    ├── TEST_MODALS.md      # Tests
    └── QUICK_START.md      # Ce fichier
```

#### Hot reload

Pour le développement, utilisez un serveur local :

```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000/tools/mission-tracker/`

### 10. Prochaines étapes

1. **Créer quelques missions de test**
2. **Remplir un rapport d'étonnement**
3. **Ajouter des checkpoints**
4. **Explorer les différents tabs**
5. **Tester sur mobile**

---

## Support

- **Documentation** : Voir `docs/`
- **Tests** : Voir `TEST_MODALS.md`
- **Changelog** : Voir `CHANGELOG_MODALS.md`
- **Issues** : https://github.com/sebastien-rouen/agile-coach-toolkit/issues

---

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Escape` | Fermer la modal active |
| `Tab` | Navigation entre les champs |
| `Enter` | Soumettre le formulaire (si dans un champ) |

---

Bon coaching ! 🎯
