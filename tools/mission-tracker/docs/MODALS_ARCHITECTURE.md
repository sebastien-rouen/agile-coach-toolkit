# 🏗️ Architecture des Modales - Mission Tracker

## Vue d'ensemble

Les modales utilisent **Shoelace Web Components** (`<sl-dialog>`) pour une expérience utilisateur moderne et accessible.

## Principes de conception

### 1. Séparation des responsabilités

```
HTML (index.html)          JavaScript (mission-tracker.js)
     ↓                              ↓
Structure de la modal    ←→    Logique d'ouverture
     ↓                              ↓
Contenu statique         ←→    Contenu dynamique
```

### 2. Cycle de vie d'une modal

```
1. Déclencheur (bouton cliqué)
   ↓
2. Fonction openXxxModal()
   ↓
3. Vérification de l'existence
   ↓
4. Chargement du contenu dynamique
   ↓
5. modal.show()
   ↓
6. Gestion des événements (submit, cancel)
   ↓
7. Traitement des données
   ↓
8. modal.hide()
   ↓
9. Mise à jour de l'interface
   ↓
10. Toast de confirmation
```

## Anatomie d'une modal

### Structure HTML

```html
<sl-dialog 
  id="modal-xxx"              <!-- ID unique -->
  label="🎯 Titre"            <!-- Titre avec emoji -->
  class="mission-tracker-modal modal-lg">  <!-- Classes CSS -->
  
  <!-- Contenu principal -->
  <div id="xxx-content">
    <!-- Chargé dynamiquement ou statique -->
  </div>
  
  <!-- Footer avec actions (optionnel) -->
  <div slot="footer">
    <sl-button variant="text" id="btn-cancel-xxx">
      Annuler
    </sl-button>
    <sl-button variant="primary" id="btn-confirm-xxx">
      Confirmer
    </sl-button>
  </div>
</sl-dialog>
```

### Fonction JavaScript

```javascript
// Fonction utilitaire pour échapper HTML (prévention XSS)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function openXxxModal() {
  // 1. Récupérer la modal
  const modal = document.getElementById('modal-xxx');
  if (!modal) {
    // Note : console.error acceptable côté client pour debugging
    // Côté serveur, utiliser req.siteLogger.error()
    console.error('❌ Modal non trouvée: modal-xxx');
    return;
  }
  
  // 2. Charger le contenu dynamique
  const content = document.getElementById('xxx-content');
  if (content) {
    content.innerHTML = `
      <form id="form-xxx">
        <!-- Formulaire -->
      </form>
    `;
  }
  
  // 3. Ouvrir la modal
  modal.show();
  
  // 4. Gérer la soumission
  const form = document.getElementById('form-xxx');
  if (form) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Traiter les données
      const formData = new FormData(e.target);
      const data = {
        field1: formData.get('field1'),
        field2: formData.get('field2')
      };
      
      try {
        // Sauvegarder
        await saveData(data);
        
        // Fermer
        modal.hide();
        
        // Confirmer
        showToast('Enregistré avec succès', 'success');
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        showToast('Erreur lors de l\'enregistrement', 'danger');
      }
      
      // Nettoyer
      form.removeEventListener('submit', handleSubmit);
    };
    
    // Écouter une seule fois
    form.addEventListener('submit', handleSubmit, { once: true });
  }
  
  // 5. Gérer l'annulation
  const btnCancel = document.getElementById('btn-cancel-xxx');
  if (btnCancel) {
    btnCancel.onclick = () => {
      modal.hide();
    };
  }
}
```

## Types de modales

### 1. Modal simple (Nouvelle mission)

**Caractéristiques :**
- Formulaire court (3-4 champs)
- Validation simple
- Largeur par défaut (600px)

**Exemple :**
```html
<sl-dialog id="modal-new-mission" label="🎯 Nouvelle mission">
  <form id="form-new-mission">
    <sl-input name="title" label="Titre" required></sl-input>
    <sl-input name="client" label="Client" required></sl-input>
    <sl-select name="role" label="Rôle" required></sl-select>
    <sl-input name="start_date" type="date" required></sl-input>
    
    <div slot="footer">
      <sl-button variant="text" id="btn-cancel">Annuler</sl-button>
      <sl-button variant="primary" type="submit">Créer</sl-button>
    </div>
  </form>
</sl-dialog>
```

### 2. Modal large (Rapport d'étonnement)

**Caractéristiques :**
- Formulaire long (5+ champs)
- Contenu riche (textarea, markdown)
- Largeur étendue (800px)

**Exemple :**
```html
<sl-dialog id="modal-initial-report" label="📝 Rapport" class="modal-lg">
  <div id="initial-report-content">
    <!-- Contenu chargé dynamiquement -->
  </div>
</sl-dialog>
```

**CSS :**
```css
.modal-lg::part(panel) {
  max-width: 800px;
}
```

### 3. Modal avec contenu dynamique

**Caractéristiques :**
- Contenu généré au moment de l'ouverture
- Données pré-remplies
- Formulaire adaptatif

**Exemple :**
```javascript
function openEditMissionModal() {
  const modal = document.getElementById('modal-edit-mission');
  const mission = APP_STATE.currentMission;
  
  // Générer le formulaire avec les données (échapper pour prévenir XSS)
  const form = document.getElementById('form-edit-mission');
  form.innerHTML = `
    <sl-input name="title" value="${escapeHtml(mission.title)}" required></sl-input>
    <sl-input name="client" value="${escapeHtml(mission.client)}" required></sl-input>
    <sl-select name="role" value="${escapeHtml(mission.role)}" required>
      ${APP_STATE.config.roles.map(role => `
        <sl-option value="${escapeHtml(role.id)}" ${role.id === mission.role ? 'selected' : ''}>
          ${escapeHtml(role.icon)} ${escapeHtml(role.name)}
        </sl-option>
      `).join('')}
    </sl-select>
  `;
  
  modal.show();
}
```

## Sécurité

### Prévention XSS (Cross-Site Scripting)

**Toujours échapper les données utilisateur** avant de les injecter dans le DOM :

```javascript
// Fonction utilitaire (déjà définie plus haut)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ✅ Bon - Données échappées
modal.innerHTML = `<h2>${escapeHtml(userInput)}</h2>`;

// ❌ Mauvais - Risque XSS
modal.innerHTML = `<h2>${userInput}</h2>`;
```

### Validation des données

```javascript
// Valider côté client ET serveur
function validateMissionData(data) {
  if (!data.title || data.title.length < 3) {
    throw new Error('Titre trop court');
  }
  
  if (!data.client || data.client.length < 2) {
    throw new Error('Client invalide');
  }
  
  // Validation de format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.start_date)) {
    throw new Error('Format de date invalide');
  }
  
  return true;
}
```

### Sanitisation des entrées

```javascript
// Nettoyer les espaces et caractères spéciaux
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer < et >
    .substring(0, 200);   // Limiter la longueur
}
```

## Bonnes pratiques

### ✅ À faire

1. **Vérifier l'existence de la modal**
```javascript
const modal = document.getElementById('modal-xxx');
if (!modal) {
  console.error('❌ Modal non trouvée');
  return;
}
```

2. **Utiliser `{ once: true }` pour les événements**
```javascript
form.addEventListener('submit', handleSubmit, { once: true });
```

3. **Nettoyer les event listeners**
```javascript
form.removeEventListener('submit', handleSubmit);
```

4. **Afficher des toasts de confirmation**
```javascript
showToast('Enregistré avec succès', 'success');
```

5. **Gérer les erreurs**
```javascript
try {
  await saveData(data);
} catch (error) {
  console.error('❌ Erreur:', error);
  showToast('Erreur lors de l\'enregistrement', 'danger');
}
```

### ❌ À éviter

1. **Ne pas vérifier l'existence**
```javascript
// ❌ Mauvais
document.getElementById('modal-xxx').show();

// ✅ Bon
const modal = document.getElementById('modal-xxx');
if (modal) modal.show();
```

2. **Oublier de nettoyer les listeners**
```javascript
// ❌ Mauvais - Crée des doublons
form.addEventListener('submit', handleSubmit);

// ✅ Bon - Une seule fois
form.addEventListener('submit', handleSubmit, { once: true });
```

3. **Mélanger HTML et JavaScript**
```javascript
// ❌ Mauvais
modal.innerHTML = `<form onsubmit="handleSubmit()">...</form>`;

// ✅ Bon
modal.innerHTML = `<form id="form-xxx">...</form>`;
form.addEventListener('submit', handleSubmit);
```

4. **Oublier la validation**
```javascript
// ❌ Mauvais - Pas de validation
<sl-input name="title"></sl-input>

// ✅ Bon - Validation HTML5
<sl-input name="title" required minlength="3"></sl-input>
```

## Accessibilité

### Navigation clavier

- **Tab** : Navigation entre les champs
- **Shift+Tab** : Navigation inverse
- **Enter** : Soumettre le formulaire
- **Escape** : Fermer la modal

### ARIA

Shoelace gère automatiquement :
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` (titre de la modal)
- Focus trap (le focus reste dans la modal)

### Labels

```html
<!-- ✅ Bon - Label explicite -->
<sl-input name="title" label="Titre de la mission" required></sl-input>

<!-- ❌ Mauvais - Pas de label -->
<sl-input name="title" placeholder="Titre"></sl-input>
```

## Performance

### Lazy loading du contenu

```javascript
// Charger le contenu uniquement à l'ouverture
function openModal() {
  const modal = document.getElementById('modal-xxx');
  
  // Contenu chargé à la demande
  const content = document.getElementById('xxx-content');
  if (content && !content.innerHTML) {
    content.innerHTML = generateContent();
  }
  
  modal.show();
}
```

### Éviter les re-renders inutiles

```javascript
// ✅ Bon - Vérifier si le contenu existe déjà
if (!content.innerHTML) {
  content.innerHTML = generateContent();
}

// ❌ Mauvais - Toujours re-générer
content.innerHTML = generateContent();
```

## Tests

### Test unitaire

```javascript
describe('openCreateMissionModal', () => {
  it('devrait ouvrir la modal', () => {
    openCreateMissionModal();
    const modal = document.getElementById('modal-new-mission');
    expect(modal.open).toBe(true);
  });
  
  it('devrait charger les rôles', () => {
    openCreateMissionModal();
    const roleSelect = document.getElementById('mission-role');
    expect(roleSelect.children.length).toBeGreaterThan(0);
  });
});
```

### Test d'intégration

```javascript
describe('Création de mission', () => {
  it('devrait créer une mission complète', async () => {
    // Ouvrir la modal
    openCreateMissionModal();
    
    // Remplir le formulaire
    document.querySelector('[name="title"]').value = 'Test Mission';
    document.querySelector('[name="client"]').value = 'Test Client';
    document.querySelector('[name="role"]').value = 'coach-agile';
    document.querySelector('[name="start_date"]').value = '2024-01-01';
    
    // Soumettre
    const form = document.getElementById('form-new-mission');
    form.dispatchEvent(new Event('submit'));
    
    // Vérifier
    await waitFor(() => {
      expect(APP_STATE.missions.length).toBe(1);
    });
  });
});
```

## Dépannage

### La modal ne s'ouvre pas

1. Vérifier que Shoelace est chargé
2. Vérifier l'ID de la modal
3. Vérifier la console pour les erreurs
4. Vérifier que `.show()` est appelé

### Le formulaire ne se soumet pas

1. Vérifier que le bouton est de type `submit`
2. Vérifier que l'événement `submit` est écouté
3. Vérifier la validation HTML5
4. Vérifier que `e.preventDefault()` est appelé

### Les données ne se sauvent pas

1. Vérifier que `FormData` récupère les bonnes valeurs
2. Vérifier que la fonction de sauvegarde est appelée
3. Vérifier les erreurs dans la console
4. Vérifier que PocketBase est configuré (si applicable)

---

## Ressources

- **Shoelace Dialog** : https://shoelace.style/components/dialog
- **FormData API** : https://developer.mozilla.org/en-US/docs/Web/API/FormData
- **Event Listeners** : https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
