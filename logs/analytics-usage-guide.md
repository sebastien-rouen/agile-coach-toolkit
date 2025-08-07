# 📋 Guide d'Utilisation - Analytics Privé

## Démarrage Rapide

### 1. Vérification du Système

Le système d'analytics est automatiquement initialisé. Vérifiez dans la console du navigateur :

```
🔒 Analytics privé initialisé
```

### 2. Accès au Dashboard

Visitez `/stats.html` pour voir les métriques en temps réel.

### 3. Données Stockées

Les données sont stockées localement dans `localStorage` sous la clé `agile_toolkit_analytics`.

## Métriques Disponibles

### Performance (Core Web Vitals)

- **Load Time** : Temps de chargement total
- **FCP** : First Contentful Paint
- **LCP** : Largest Contentful Paint  
- **CLS** : Cumulative Layout Shift
- **FID** : First Input Delay

### Usage

- **Pages visitées** : Compteur par page
- **Outils utilisés** : Fréquence d'utilisation
- **Sessions** : Nombre de sessions uniques
- **Erreurs** : Erreurs JavaScript détectées

## Codes Couleur Performance

| Couleur | Signification | Seuil |
|---------|---------------|-------|
| 🟢 Vert | Bon | Dans les limites recommandées |
| 🟡 Orange | À améliorer | Proche des limites |
| 🔴 Rouge | Mauvais | Au-dessus des limites |

## Commandes Utiles

### Inspection des Données

```javascript
// Console du navigateur
console.log(window.analytics.getStoredData());
console.log(window.analytics.getSessionReport());
```

### Nettoyage Manuel

```javascript
// Vider les données analytics
localStorage.removeItem('agile_toolkit_analytics');
localStorage.removeItem('session_reports');
```

### Export des Données

```javascript
// Export pour analyse externe
const data = window.analytics.exportForDashboard();
console.log(JSON.stringify(data, null, 2));
```

## Dépannage

### Problème : Pas de données affichées

1. Vérifiez que JavaScript est activé
2. Ouvrez la console pour voir les erreurs
3. Vérifiez que localStorage est disponible

### Problème : Métriques de performance manquantes

1. Vérifiez la compatibilité du navigateur
2. Performance API peut ne pas être supportée
3. Certaines métriques nécessitent des interactions utilisateur

### Problème : Dashboard ne se charge pas

1. Vérifiez que le fichier `usage-stats.json` existe
2. Vérifiez les permissions de lecture
3. Consultez la console pour les erreurs réseau

## Maintenance

### Nettoyage Automatique

- Les données de plus de 30 jours sont supprimées automatiquement
- Maximum 1000 entrées conservées
- Nettoyage à chaque initialisation

### Mise à Jour des Données

Les données sont mises à jour :
- À chaque vue de page
- À chaque interaction trackée
- Toutes les 30 secondes pour le dashboard
- À la fermeture de la session

## Respect de la Vie Privée

### Données Collectées

✅ **Autorisé** :
- Métriques de performance anonymes
- Statistiques d'usage agrégées
- Erreurs techniques
- Préférences d'interface

❌ **Interdit** :
- Données personnelles identifiables
- Adresses IP
- Géolocalisation précise
- Historique de navigation externe

### Conformité RGPD

- **Base légale** : Intérêt légitime (amélioration du service)
- **Transparence** : Documentation complète disponible
- **Minimisation** : Seules les données nécessaires sont collectées
- **Sécurité** : Stockage local sécurisé uniquement

---

*Dernière mise à jour : 31 janvier 2025*