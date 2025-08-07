---
inclusion: always
---

# Sécurité et Bonnes Pratiques

## Sécurité Frontend

### Validation des Données

- Toujours valider côté client ET serveur
- Échapper les données utilisateur
- Utiliser des bibliothèques de validation éprouvées

### Protection XSS

- Éviter `innerHTML` avec des données utilisateur
- Utiliser `textContent` ou des frameworks sécurisés
- Valider et nettoyer toutes les entrées

### Gestion des Secrets

- Jamais de clés API dans le code frontend
- Variables d'environnement pour les configurations
- Rotation régulière des tokens

## Bonnes Pratiques Générales

### Authentification

- Utiliser HTTPS en production
- Tokens JWT avec expiration
- Gestion appropriée des sessions

### Données Sensibles

- Chiffrement des données sensibles
- Logs sans informations personnelles
- Respect du RGPD

### Dépendances

- Audit régulier des dépendances
- Mise à jour des packages de sécurité
- Utilisation de versions stables

## Checklist Sécurité

### Avant Déploiement

- [ ] Audit de sécurité des dépendances
- [ ] Validation de toutes les entrées utilisateur
- [ ] Configuration HTTPS
- [ ] Headers de sécurité appropriés
- [ ] Tests de pénétration basiques

### Monitoring

- [ ] Logs d'erreurs configurés
- [ ] Alertes de sécurité actives
- [ ] Surveillance des performances
- [ ] Backup et récupération testés
