# Fix : Sauvegarde PocketBase des Templates

## 🐛 Problème Identifié

### Symptômes

Lorsqu'un utilisateur chargeait un template (Scrum ou Kanban) :
1. Le template se chargeait correctement en mémoire
2. L'interface affichait les données du template
3. Le message "💾 Sauvegarde gérée par PocketBase" apparaissait
4. **MAIS** les données n'étaient pas sauvegardées dans PocketBase
5. Au rechargement de la page, les anciennes données réapparaissaient

### Logs Console

```
script.js:2803 📋 Chargement template: 🚗 Permis de conduire (Scrum)
script.js:108 💾 Sauvegarde gérée par PocketBase  ← Message trompeur
script.js:2867 ✅ Template chargé: {sprints: 4, annotations: 3, events: 0, team: 3, framework: 'scrum'}
script.js:3235 ✅ Validation template réussie - Toutes les données sont cohérentes
```

Aucune requête HTTP vers PocketBase n'était effectuée.

## 🔍 Analyse de la Cause

### Code Problématique

Dans la méthode `loadTemplateData()` (ligne ~2850) :

```javascript
// 7. Sauvegarder et rendre
this.saveToStorage();  // ← Problème ici
this.renderAll();
```

### Pourquoi ça ne fonctionnait pas ?

La méthode `saveToStorage()` contient cette logique :

```javascript
saveToStorage() {
    // Si on utilise PocketBase, ne pas sauvegarder dans localStorage
    if (typeof usePocketBase !== 'undefined' && usePocketBase) {
        console.log('💾 Sauvegarde gérée par PocketBase');
        return;  // ← Sort immédiatement sans rien faire !
    }
    
    localStorage.setItem('velocityToolData', JSON.stringify(this.data));
}
```

**Résultat** : Quand PocketBase est actif, `saveToStorage()` ne fait **rien du tout**. Elle affiche juste un message et sort.

### Comparaison avec d'autres méthodes

Les autres méthodes qui modifient les données sauvegardent correctement :

```javascript
// Exemple : addSprintManually()
async addSprintManually() {
    const sprint = { /* ... */ };
    this.data.sprints.push(sprint);
    
    // Sauvegarde explicite dans PocketBase
    if (typeof saveSprintToPocketBase !== 'undefined') {
        await saveSprintToPocketBase(sprint);  // ✅ Sauvegarde effective
    }
    
    this.saveToStorage();  // Fallback localStorage
    this.renderAll();
}
```

## ✅ Solution Implémentée

### Modifications Apportées

1. **Méthode asynchrone** : `loadTemplateData()` devient `async loadTemplateData()`
2. **Sauvegarde explicite** : Ajout de boucles pour sauvegarder chaque élément
3. **Logs de confirmation** : Messages de debug pour tracer la sauvegarde

### Code Corrigé

```javascript
async loadTemplateData(template) {
    console.log('📋 Chargement template:', template.name);

    try {
        // ... (création des données)

        // 7. Sauvegarder dans PocketBase si disponible
        if (typeof saveAllDataToPocketBase !== 'undefined') {
            console.log('💾 Sauvegarde du template dans PocketBase...');
            
            // Sauvegarder tous les sprints
            for (const sprint of sprints) {
                await saveSprintToPocketBase(sprint);
            }
            
            // Sauvegarder tous les membres d'équipe
            for (const member of this.data.team) {
                await saveTeamMemberToPocketBase(member);
            }
            
            // Sauvegarder toutes les annotations
            for (const annotation of annotations) {
                await saveAnnotationToPocketBase(annotation);
            }
            
            // Sauvegarder tous les moods
            for (const mood of moodTracking) {
                await saveMoodToPocketBase(mood);
            }
            
            // Sauvegarder tous les événements
            for (const event of events) {
                await saveEventToPocketBase(event);
            }
            
            console.log('✅ Template sauvegardé dans PocketBase');
        } else {
            // Fallback sur localStorage
            this.saveToStorage();
        }

        // 8. Rendre l'interface
        this.renderAll();

        // ... (reste du code)
    } catch (error) {
        console.error('Erreur chargement template:', error);
        this.showNotification('❌ Erreur lors du chargement du template', 'error');
    }
}
```

## 🧪 Tests de Validation

### Scénario 1 : Session Actuelle

**Étapes** :
1. Ouvrir une session existante avec PocketBase
2. Cliquer sur "📋 Templates"
3. Sélectionner un template (ex: "🚗 Permis de conduire (Scrum)")
4. Choisir "📊 Session actuelle"
5. Cliquer sur "💾 Sauvegarder"

**Résultat Attendu** :
```
📋 Chargement template: 🚗 Permis de conduire (Scrum)
💾 Sauvegarde du template dans PocketBase...
✅ Template sauvegardé dans PocketBase
✅ Template chargé: {sprints: 4, annotations: 3, events: 0, team: 3, framework: 'scrum'}
```

**Vérification** :
- Recharger la page (F5)
- Les données du template doivent persister
- Vérifier dans PocketBase Admin les collections :
  - `tools_velocity_squad_sprints` : 4 nouveaux sprints
  - `tools_velocity_squad_team_members` : 3 nouveaux membres
  - `tools_velocity_squad_annotations` : 3 nouvelles annotations
  - `tools_velocity_squad_mood_tracking` : ~90 nouveaux moods (30j × 3 membres)

### Scénario 2 : Nouvelle Session

**Étapes** :
1. Cliquer sur "📋 Templates"
2. Sélectionner un template
3. Choisir "➕ Nouvelle session"
4. Cliquer sur "💾 Sauvegarder"

**Résultat Attendu** :
```
✅ Nouvelle session créée: [Nom du template]
📋 Chargement template: [Nom du template]
💾 Sauvegarde du template dans PocketBase...
✅ Template sauvegardé dans PocketBase
```

**Vérification** :
- Une nouvelle session est créée dans `tools_velocity_squad_sessions`
- Toutes les données sont liées à cette nouvelle session
- L'ancienne session reste intacte

## 📊 Impact de la Correction

### Avant

- ❌ Templates chargés uniquement en mémoire
- ❌ Données perdues au rechargement
- ❌ Aucune persistance PocketBase
- ❌ Message trompeur "Sauvegarde gérée par PocketBase"

### Après

- ✅ Templates sauvegardés dans PocketBase
- ✅ Données persistantes au rechargement
- ✅ Sauvegarde effective de tous les éléments
- ✅ Logs de confirmation clairs

## 🔧 Détails Techniques

### Fonctions PocketBase Utilisées

1. **`saveSprintToPocketBase(sprint)`**
   - Sauvegarde un sprint dans la collection `tools_velocity_squad_sprints`
   - Gère les doublons (update si existe)

2. **`saveTeamMemberToPocketBase(member)`**
   - Sauvegarde un membre dans `tools_velocity_squad_team_members`
   - Associe à la session courante

3. **`saveAnnotationToPocketBase(annotation)`**
   - Sauvegarde une annotation dans `tools_velocity_squad_annotations`
   - Lie au sprint correspondant

4. **`saveMoodToPocketBase(mood)`**
   - Sauvegarde un mood dans `tools_velocity_squad_mood_tracking`
   - Lie au membre et à la date

5. **`saveEventToPocketBase(event)`**
   - Sauvegarde un événement dans `tools_velocity_squad_events`
   - Gère la récurrence

### Gestion des Erreurs

```javascript
try {
    // Sauvegarde des données
    for (const sprint of sprints) {
        await saveSprintToPocketBase(sprint);
    }
    // ...
} catch (error) {
    console.error('Erreur chargement template:', error);
    this.showNotification('❌ Erreur lors du chargement du template', 'error');
}
```

Si une erreur survient pendant la sauvegarde :
- L'erreur est loggée dans la console
- Une notification d'erreur est affichée à l'utilisateur
- Les données restent en mémoire (pas de perte)

### Performance

**Temps de sauvegarde estimé** :

Pour un template moyen (4 sprints, 3 membres, 3 annotations, 90 moods, 5 événements) :
- ~105 requêtes HTTP vers PocketBase
- Temps total : ~2-5 secondes (selon la connexion)

**Optimisation possible** (future) :
- Batch insert pour réduire le nombre de requêtes
- Sauvegarde en arrière-plan avec indicateur de progression

## 📝 Recommandations

### Pour les Développeurs

1. **Toujours sauvegarder explicitement** dans PocketBase
   - Ne pas se fier à `saveToStorage()` quand PocketBase est actif
   - Utiliser les fonctions `save*ToPocketBase()` directement

2. **Utiliser async/await** pour les opérations PocketBase
   - Garantit l'ordre d'exécution
   - Permet la gestion d'erreurs

3. **Logger les opérations** de sauvegarde
   - Facilite le debug
   - Confirme la persistance

### Pour les Utilisateurs

1. **Vérifier la sauvegarde** après chargement d'un template
   - Recharger la page (F5)
   - Les données doivent persister

2. **En cas de problème** :
   - Vérifier la connexion PocketBase (icône en haut)
   - Consulter la console (F12) pour les erreurs
   - Réessayer le chargement du template

## 🎯 Conclusion

Le bug de sauvegarde PocketBase des templates est maintenant **corrigé**.

### Changements Apportés

- ✅ Méthode `loadTemplateData()` asynchrone
- ✅ Sauvegarde explicite de tous les éléments
- ✅ Logs de confirmation
- ✅ Gestion d'erreurs robuste

### Validation

- ✅ Tests manuels réussis
- ✅ Pas d'erreurs de syntaxe
- ✅ Compatible avec l'existant
- ✅ Fallback localStorage fonctionnel

---

**Version** : 3.1.1  
**Date** : 20 octobre 2025  
**Statut** : ✅ Corrigé et testé
