# 🚨 Système de gestion d'erreurs - Agile Coach Toolkit

## Vue d'ensemble

Le système de gestion d'erreurs de l'Agile Coach Toolkit est un système complet et robuste qui capture, traite et gère tous les types d'erreurs qui peuvent survenir dans l'application. Il est conçu pour offrir une expérience utilisateur fluide même en cas de problèmes techniques.

## Architecture du système

### Composants principaux

1. **ErrorHandler** (`assets/js/error-handler.js`)
   - Gestionnaire d'erreurs global
   - Capture les erreurs JavaScript, les promesses rejetées et les erreurs de ressources
   - Affiche des notifications conviviales à l'utilisateur
   - Stocke les erreurs localement pour le debugging

2. **NetworkErrorHandler** (`assets/js/network-error-handler.js`)
   - Gestion spécialisée des erreurs réseau
   - Détection de la qualité de connexion
   - Mécanismes de retry automatique
   - Adaptation au mode hors ligne

3. **FallbackContentManager** (`assets/js/fallback-content.js`)
   - Gestion du contenu de fallback
   - Remplacement automatique des ressources échouées
   - Stratégies de récupération personnalisables
   - Support pour images, scripts, CSS et composants

4. **Utils** (`assets/js/utils.js`)
   - Fonctions utilitaires sécurisées
   - Wrappers pour les opérations DOM
   - Utilitaires de stockage et validation
   - Helpers d'accessibilité

## Fonctionnalités

### 🎯 Gestion d'erreurs globale

- **Capture automatique** : Toutes les erreurs JavaScript sont automatiquement capturées
- **Classification intelligente** : Les erreurs sont classées par type et gravité
- **Messages conviviaux** : L'utilisateur voit des messages compréhensibles, pas des erreurs techniques
- **Stockage local** : Les erreurs sont sauvegardées pour le debugging sans transmission externe

### 🌐 Gestion réseau avancée

- **Détection de connectivité** : Surveillance en temps réel de l'état de la connexion
- **Qualité de connexion** : Adaptation du comportement selon la vitesse de connexion
- **Retry automatique** : Tentatives de récupération avec backoff exponentiel
- **Mode économie de données** : Optimisations pour les connexions limitées

### 🔄 Contenu de fallback

- **Images de placeholder** : Remplacement automatique des images échouées par des SVG générés
- **Scripts de fallback** : Chargement de versions alternatives des scripts
- **Styles de base** : Application de styles minimaux si les CSS échouent
- **Composants de secours** : Affichage de contenu alternatif pour les composants défaillants

### 📊 Monitoring et debugging

- **Statistiques en temps réel** : Suivi des erreurs et de leur fréquence
- **Export des rapports** : Génération de rapports d'erreurs détaillés
- **Console de debugging** : Interface de développement pour analyser les problèmes
- **Métriques de performance** : Intégration avec le système de monitoring des performances

## Utilisation

### Initialisation automatique

Le système s'initialise automatiquement au chargement de la page :

```javascript
// Les gestionnaires sont créés automatiquement
window.errorHandler = new ErrorHandler();
window.networkErrorHandler = new NetworkErrorHandler();
window.fallbackContentManager = new FallbackContentManager();
```

### Signalement manuel d'erreurs

```javascript
// Signaler une erreur manuellement
window.app.reportError(new Error('Erreur personnalisée'), {
  context: 'user_action',
  severity: 'medium'
});

// Ou directement via le gestionnaire
window.errorHandler.reportError(error, { context: 'custom' });
```

### Gestion des ressources avec fallback

```html
<!-- Image avec fallback automatique -->
<img src="image.jpg" alt="Description" data-fallback-src="fallback.jpg">

<!-- Script avec version de secours -->
<script src="main.js" data-fallback-src="main.min.js"></script>

<!-- Composant avec fallback -->
<div data-component="complex-widget" data-lazy-component="true">
  Chargement...
</div>
```

### Requêtes réseau sécurisées

```javascript
// Utilisation du wrapper sécurisé
const safeRequest = window.networkErrorHandler.createSafeRequest('/api/data');

const result = await safeRequest.execute();
if (result.success) {
  console.log('Données reçues:', result.data);
} else {
  console.log('Erreur:', result.error);
}

// Avec fallback
const data = await safeRequest.executeWithFallback({ default: 'value' });
```

## Configuration

### Personnalisation des messages d'erreur

```javascript
// Modifier les messages dans error-handler.js
const messages = {
  network: {
    title: "🌐 Problème de connexion personnalisé",
    message: "Message personnalisé pour les erreurs réseau",
    action: "Réessayer"
  }
};
```

### Stratégies de fallback personnalisées

```javascript
// Ajouter une nouvelle stratégie
window.fallbackContentManager.registerFallbackStrategy('video', {
  detect: (element) => element.tagName.toLowerCase() === 'video',
  fallback: (element) => {
    // Logique de fallback pour les vidéos
    element.poster = 'assets/images/video-placeholder.jpg';
  },
  retry: (element) => {
    // Logique de retry
    element.load();
  }
});
```

### Configuration du retry réseau

```javascript
// Modifier les paramètres de retry
window.networkErrorHandler.maxRetries = 5;
window.networkErrorHandler.retryDelays = [1000, 2000, 4000, 8000, 16000];
```

## API publique

### ErrorHandler

```javascript
// Méthodes principales
window.errorHandler.reportError(error, context)
window.errorHandler.getStoredErrors()
window.errorHandler.clearStoredErrors()
window.errorHandler.exportErrorReport()
```

### NetworkErrorHandler

```javascript
// État du réseau
window.networkErrorHandler.getNetworkStatus()
window.networkErrorHandler.isOnline
window.networkErrorHandler.connectionQuality

// Requêtes sécurisées
window.networkErrorHandler.createSafeRequest(url, options)
```

### FallbackContentManager

```javascript
// Gestion des fallbacks
window.fallbackContentManager.retryAll()
window.fallbackContentManager.getStats()
window.fallbackContentManager.registerFallbackStrategy(name, strategy)
```

### Utilitaires globaux

```javascript
// Fonctions de debugging
window.getErrorStats()
window.retryFailedResources()
window.exportErrorReport()
```

## Tests et debugging

### Page de test

Une page de test complète est disponible à `/error-test.html` pour :
- Tester tous les types d'erreurs
- Vérifier les mécanismes de fallback
- Analyser les statistiques en temps réel
- Exporter les rapports d'erreurs

### Console de debugging

```javascript
// Activer le mode debug
localStorage.setItem('debug_errors', 'true');

// Voir les statistiques
console.log(window.getErrorStats());

// Forcer un retry
window.retryFailedResources();
```

## Bonnes pratiques

### Pour les développeurs

1. **Utilisez les wrappers sécurisés** : Préférez `ErrorUtils.safeExecute()` pour les fonctions critiques
2. **Gérez les promesses** : Utilisez `ErrorUtils.safePromise()` pour les opérations asynchrones
3. **Testez les fallbacks** : Vérifiez que vos composants ont des alternatives
4. **Surveillez les métriques** : Consultez régulièrement les statistiques d'erreurs

### Pour les utilisateurs

1. **Signalement automatique** : Les erreurs sont automatiquement capturées et traitées
2. **Actions recommandées** : Suivez les suggestions des notifications d'erreur
3. **Mode hors ligne** : L'application continue de fonctionner sans connexion
4. **Rechargement intelligent** : Utilisez les boutons de retry plutôt que F5

## Intégration avec les autres systèmes

### Analytics

```javascript
// Les erreurs sont automatiquement rapportées à l'analytics local
// Aucune donnée n'est transmise à l'extérieur
```

### Performance

```javascript
// Intégration avec le monitoring de performance
// Les erreurs affectant les métriques sont trackées
```

### PWA

```javascript
// Support du mode hors ligne
// Synchronisation automatique au retour en ligne
```

## Sécurité et vie privée

- **Stockage local uniquement** : Aucune donnée d'erreur n'est transmise à l'extérieur
- **Anonymisation** : Les informations personnelles sont automatiquement masquées
- **Nettoyage automatique** : Les anciennes erreurs sont supprimées automatiquement
- **Conformité RGPD** : Respect total de la vie privée des utilisateurs

## Maintenance

### Nettoyage automatique

Le système nettoie automatiquement :
- Les erreurs anciennes (> 7 jours)
- Les caches de retry expirés
- Les fallbacks obsolètes

### Monitoring

Surveillez ces métriques :
- Taux d'erreurs par type
- Temps de récupération
- Efficacité des fallbacks
- Qualité de connexion des utilisateurs

## Support et dépannage

### Problèmes courants

1. **Erreurs non capturées** : Vérifiez que les scripts sont chargés dans le bon ordre
2. **Fallbacks non appliqués** : Contrôlez les stratégies de fallback enregistrées
3. **Retry en boucle** : Ajustez les paramètres de retry et timeout

### Debugging avancé

```javascript
// Activer les logs détaillés
localStorage.setItem('error_debug', 'verbose');

// Désactiver temporairement les fallbacks
window.fallbackContentManager.disabled = true;

// Forcer le mode hors ligne
window.dispatchEvent(new Event('offline'));
```

---

Ce système de gestion d'erreurs garantit une expérience utilisateur robuste et professionnelle, même en cas de problèmes techniques. Il respecte les principes de l'Agile Coach Toolkit : simplicité, performance et respect de la vie privée.