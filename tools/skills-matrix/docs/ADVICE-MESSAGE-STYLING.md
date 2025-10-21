# Guide de Stylisation des Messages de Conseils

## 🎨 Vue d'ensemble

Les messages de conseils (`.advice-message`) ont été améliorés avec un style élégant et interactif qui s'adapte au thème (dark/light).

## ✨ Caractéristiques

### Style de base
- **Fond** : Noir semi-transparent avec effet de flou (backdrop-filter)
- **Bordure gauche** : Ligne cyan (#00d4ff) de 3px
- **Padding** : Espacement confortable (12px 16px)
- **Line-height** : 1.8 pour une meilleure lisibilité
- **Border-radius** : Coins arrondis (8px)

### Effet hover
- **Fond** : Devient plus opaque
- **Bordure** : Devient plus visible
- **Translation** : Léger déplacement vers la droite (3px)
- **Transition** : Animation fluide (0.3s)

## 📝 Formatage du texte

### Texte en gras (strong)

```html
<div class="advice-message">
    <strong>Important :</strong> Ce texte est mis en évidence.
</div>
```

**Rendu** : Texte cyan (#00d4ff) en gras

### Texte en emphase (em)

```html
<div class="advice-message">
    Vous devriez <em>absolument</em> pratiquer cette compétence.
</div>
```

**Rendu** : Texte rose (#f093fb) en gras (pas d'italique)

### Code inline (code)

```html
<div class="advice-message">
    Utilisez la méthode <code>saveData()</code> pour sauvegarder.
</div>
```

**Rendu** : Fond violet semi-transparent, texte violet (#667eea), police monospace

## 🎯 Exemples d'utilisation

### Message simple

```javascript
const message = "Continuez à pratiquer régulièrement pour progresser.";
```

### Message avec emphase

```javascript
const message = "Vous êtes <strong>sur la bonne voie</strong> ! Continuez à <em>pratiquer</em> cette compétence.";
```

### Message avec code

```javascript
const message = "Pour sauvegarder vos données, utilisez <code>Ctrl+S</code> ou le bouton <strong>Sauvegarder</strong>.";
```

### Message complet

```javascript
const message = `
    <strong>Excellent travail !</strong> Vous maîtrisez maintenant cette compétence.
    <br><br>
    <em>Conseil :</em> Partagez vos connaissances avec les membres de niveau 1-2.
    <br><br>
    Utilisez la fonction <code>manageAppetencesOwnerships()</code> pour définir vos sujets d'expertise.
`;
```

## 🌓 Thème Light

En mode light, les couleurs s'adaptent automatiquement :

- **Fond** : Blanc semi-transparent
- **Bordure** : Bleu clair (#00a8cc)
- **Strong** : Bleu foncé (#0369a1)
- **Em** : Violet (#c026d3)
- **Code** : Fond violet clair, texte violet foncé (#5b21b6)

## 💻 Intégration dans le code

### ⚠️ Avertissement de Sécurité

**IMPORTANT** : Lors de l'utilisation de `innerHTML`, assurez-vous que le contenu est sécurisé :

```javascript
// ✅ Bon : Contenu statique ou échappé
adviceCard.innerHTML = `<div class="advice-message">${escapeHtml(userInput)}</div>`;

// ❌ Dangereux : Données utilisateur non échappées
adviceCard.innerHTML = `<div class="advice-message">${userInput}</div>`;
```

Si le contenu inclut des données utilisateur (nom de compétence, commentaires, etc.), utilisez **toujours** `escapeHtml()` ou une bibliothèque comme DOMPurify.

### Dans advice.js

```javascript
function generateAdviceMessage(member, skill, level) {
    let message = '';
    
    if (level === 1) {
        message = `
            <strong>Bienvenue dans l'apprentissage !</strong>
            <br><br>
            Vous débutez avec <em>${skill}</em>. C'est normal de ne pas tout comprendre au début.
            <br><br>
            <strong>Conseil :</strong> Commencez par les bases et pratiquez régulièrement.
        `;
    } else if (level === 2) {
        message = `
            Vous progressez bien sur <em>${skill}</em> !
            <br><br>
            <strong>Prochaine étape :</strong> Essayez de travailler sur des projets réels.
        `;
    }
    // ...
    
    return message;
}
```

### Création dynamique

```javascript
const adviceCard = document.createElement('div');
adviceCard.className = 'advice-card';
adviceCard.innerHTML = `
    <div class="advice-header">
        <span class="advice-emoji">💡</span>
        <span class="advice-title">Conseil personnalisé</span>
    </div>
    <div class="advice-message">
        ${generateAdviceMessage(member, skill, level)}
    </div>
`;
```

## 🎨 Personnalisation

### Modifier les couleurs

Dans `css/advice.css` :

```css
.advice-message {
    border-left-color: rgba(0, 212, 255, 0.3); /* Bordure */
}

.advice-message strong {
    color: #00d4ff; /* Texte en gras */
}

.advice-message em {
    color: #f093fb; /* Texte en emphase */
}

.advice-message code {
    background: rgba(102, 126, 234, 0.2); /* Fond du code */
    color: #667eea; /* Texte du code */
}
```

### Modifier l'effet hover

```css
.advice-message:hover {
    background: rgba(0, 0, 0, 0.3); /* Fond au survol */
    border-left-color: rgba(0, 212, 255, 0.6); /* Bordure au survol */
    transform: translateX(3px); /* Déplacement */
}
```

### Modifier l'espacement

```css
.advice-message {
    padding: 12px 16px; /* Espacement interne */
    margin-bottom: 15px; /* Espacement externe */
    line-height: 1.8; /* Hauteur de ligne */
}
```

## 📱 Responsive

Le style s'adapte automatiquement aux petits écrans :

```css
@media (max-width: 768px) {
    .advice-message {
        font-size: 0.9em;
        padding: 10px 14px;
    }
}
```

## ✅ Bonnes pratiques

### 1. Utiliser les balises sémantiques

```javascript
// ✅ Bon : Utilisation de strong et em
const message = "<strong>Important :</strong> Pratiquez <em>régulièrement</em>.";

// ❌ Mauvais : Utilisation de span avec classes
const message = "<span class='bold'>Important :</span> Pratiquez <span class='italic'>régulièrement</span>.";
```

### 2. Éviter le HTML inline excessif

```javascript
// ✅ Bon : HTML simple et lisible
const message = `
    <strong>Conseil :</strong> Pratiquez cette compétence.
    <br><br>
    Utilisez <code>saveData()</code> pour sauvegarder.
`;

// ❌ Mauvais : HTML complexe et difficile à maintenir
const message = `
    <div style="color: red; font-weight: bold;">Conseil :</div>
    <div style="margin-top: 10px;">Pratiquez cette compétence.</div>
`;
```

### 3. Utiliser des sauts de ligne appropriés

```javascript
// ✅ Bon : Utilisation de <br><br> pour les paragraphes
const message = `
    Premier paragraphe.
    <br><br>
    Deuxième paragraphe.
`;

// ❌ Mauvais : Trop de sauts de ligne
const message = `
    Premier paragraphe.
    <br><br><br><br>
    Deuxième paragraphe.
`;
```

### 4. Échapper le HTML si nécessaire (CRITIQUE)

```javascript
// ✅ TOUJOURS échapper les données utilisateur
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exemple d'utilisation sécurisée
const userSkillName = "<script>alert('XSS')</script>"; // Données utilisateur
const message = `Vous progressez sur : <strong>${escapeHtml(userSkillName)}</strong>`;

// ❌ DANGEREUX : Ne JAMAIS faire ceci
const unsafeMessage = `Vous progressez sur : <strong>${userSkillName}</strong>`;
```

**Règle d'or** : Si une donnée vient de l'utilisateur (input, URL, base de données), elle DOIT être échappée avant d'être insérée dans le DOM via `innerHTML`.

## 🔒 Sécurité

### Protection XSS

**Toutes les données utilisateur doivent être échappées** avant insertion dans le DOM :

```javascript
// ✅ Sécurisé : Échappement systématique
function generateAdviceMessage(member, skill, level) {
    const safeMemberName = escapeHtml(member.name);
    const safeSkillName = escapeHtml(skill);
    
    return `
        <strong>Bonjour ${safeMemberName} !</strong>
        <br><br>
        Vous progressez sur <em>${safeSkillName}</em>.
    `;
}

// ❌ Vulnérable : Pas d'échappement
function unsafeAdviceMessage(member, skill, level) {
    return `
        <strong>Bonjour ${member.name} !</strong>
        <br><br>
        Vous progressez sur <em>${skill}</em>.
    `;
}
```

### Validation des Entrées

```javascript
// Valider les données avant utilisation
function validateSkillName(skill) {
    if (typeof skill !== 'string' || skill.length > 100) {
        throw new Error('Nom de compétence invalide');
    }
    return escapeHtml(skill.trim());
}

// Utilisation
try {
    const safeSkill = validateSkillName(userInput);
    const message = generateAdviceMessage(member, safeSkill, level);
} catch (error) {
    logger.error('Validation échouée', { error });
}
```

### Checklist Sécurité

- [ ] Toutes les données utilisateur sont échappées avec `escapeHtml()`
- [ ] Pas d'utilisation de `innerHTML` avec données non validées
- [ ] Validation des types et longueurs des entrées
- [ ] Utilisation de Winston Logger (pas de `console.log`)
- [ ] Tests XSS effectués avec des payloads malveillants

## 🧪 Tests

### Test visuel

1. Ouvrir l'application
2. Aller dans la section "Conseils Personnalisés"
3. Vérifier que les messages ont :
   - Un fond semi-transparent
   - Une bordure gauche cyan
   - Un effet hover fluide
   - Des couleurs distinctes pour strong, em et code

### Test thème light

1. Activer le thème light
2. Vérifier que les couleurs s'adaptent
3. Vérifier la lisibilité

### Test responsive

1. Réduire la largeur de la fenêtre
2. Vérifier que les messages restent lisibles
3. Vérifier l'espacement sur mobile

## 📚 Références

- **Fichier principal** : `css/advice.css`
- **Thème light** : `css/theme-light.css`
- **Génération des conseils** : `js/advice.js`
- **Documentation conseils** : `docs/ADVICE-SYSTEM.md` (si existe)
