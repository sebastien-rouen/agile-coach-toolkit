# Mise à jour des fonctionnalités - Velocity Squad

## 🎯 Nouvelles fonctionnalités

### 1. Ajout de Sprint amélioré

#### Date de début et boutons de durée rapide

Lors de l'ajout d'un nouveau sprint, vous pouvez maintenant :

1. **Sélectionner une date de début** : Choisissez la date de démarrage du sprint
2. **Utiliser les boutons rapides** : Trois boutons permettent de définir rapidement la date de fin :
   - **+1 semaine** : Ajoute 7 jours à la date de début
   - **+2 semaines** : Ajoute 14 jours à la date de début (recommandé pour Scrum)
   - **+3 semaines** : Ajoute 21 jours à la date de début

#### Fonctionnement

1. Sélectionnez d'abord la **date de début**
2. Cliquez sur l'un des boutons de durée (+1w, +2w, +3w)
3. La **date de fin** est automatiquement calculée et remplie
4. Une notification confirme l'action

**Note** : Si vous cliquez sur un bouton de durée sans avoir sélectionné de date de début, un message d'avertissement s'affiche.

### 2. Thème Casino amélioré

Le mode Casino a été redesigné pour offrir une expérience visuelle immersive :

#### Améliorations visuelles

- **Dégradé de couleurs** : Fond avec dégradé vert/bleu/violet évoquant une table de casino
- **Effets de lumière** : Radial-gradient doré pour simuler l'éclairage d'un casino
- **Bordure dorée** : Contour doré avec effet de brillance
- **Ombres** : Ombres internes et externes pour donner de la profondeur
- **Symboles de cartes** : En-tête avec les symboles ♠ ♥ ♦ ♣ en doré

#### Ambiance

Le nouveau design crée une atmosphère de jeu de cartes professionnelle, rendant l'estimation collaborative plus ludique et engageante.

### 3. Amélioration de l'accessibilité

#### Curseur pointer sur les boutons

Tous les boutons cliquables dans la section `chart-controls` affichent maintenant un curseur pointer au survol, améliorant l'indication visuelle des éléments interactifs.

**Éléments concernés** :
- Bouton "✏️" pour changer le nom d'utilisateur
- Boutons de vue de graphique (Vélocité, Burndown, Burnup)
- Bouton "📝 Fait marquant"
- Tous les autres boutons d'action

## 🎨 Détails techniques

### Modifications CSS

```css
/* Boutons de durée rapide */
.quick-duration-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.btn-duration {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 2px solid var(--primary);
    background: white;
    color: var(--primary);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

/* Thème casino */
.casino-container-full {
    background: linear-gradient(135deg, #0f3443, #1a5f3e, #2d1b4e);
    background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(220, 20, 60, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0f3443, #1a5f3e, #2d1b4e);
    border: 2px solid rgba(255, 215, 0, 0.3);
    box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.2),
        inset 0 0 50px rgba(0, 0, 0, 0.3);
}

/* Curseur pointer */
.chart-controls button {
    cursor: pointer;
}
```

### Modifications JavaScript

```javascript
// Gestionnaire d'événements pour les boutons de durée
document.querySelectorAll('.btn-duration').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const weeks = parseInt(btn.dataset.weeks);
        const startDateInput = document.getElementById('sprintStartDate');
        const endDateInput = document.getElementById('sprintEndDate');
        
        if (!startDateInput.value) {
            this.showNotification('⚠️ Veuillez d\'abord sélectionner une date de début', 'warning');
            return;
        }
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (weeks * 7));
        
        endDateInput.value = endDate.toISOString().split('T')[0];
        this.showNotification(`✅ Date de fin définie à +${weeks} semaine${weeks > 1 ? 's' : ''}`, 'success');
    });
});
```

## 📝 Notes de version

**Version** : 2.1.0  
**Date** : 27 octobre 2025  
**Auteur** : Kiro AI Assistant

## 🔗 Liens utiles

- [Documentation principale](../README.md)
- [Guide d'utilisation](../docs/USER-GUIDE.md)
- [Changelog global](../../../CHANGELOG.md)
