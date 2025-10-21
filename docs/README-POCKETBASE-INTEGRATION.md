# ☁️ Intégration PocketBase - Skills Matrix

## ✅ Statut : FONCTIONNEL

L'outil Skills Matrix utilise maintenant PocketBase pour le stockage cloud.

## 🎯 Fonctionnalités

- ☁️ **Stockage cloud** avec PocketBase
- 🖥️ **Fallback local** automatique (localStorage)
- 🔄 **Synchronisation** automatique (5 min)
- 📚 **Templates** depuis PocketBase
- 🎨 **Badge** de statut dans l'interface

## 🚀 Utilisation

### Automatique

Aucune configuration nécessaire. L'intégration se fait automatiquement :

1. Ouvrir l'outil : `http://localhost/tools/skills-matrix/`
2. Le badge affiche le mode de stockage
3. Les données se synchronisent automatiquement

### Badge de Stockage

- 🖥️ **Local (navigateur)** : PocketBase non disponible
- ☁️ **Cloud (actif)** : Connecté et synchronisé

## 📊 Collections PocketBase

| Collection | Description |
|------------|-------------|
| `tools_skills_matrix_matrices` | Contexte des matrices |
| `tools_skills_matrix_members` | Membres de l'équipe |
| `tools_skills_matrix_items` | Skills + Ownerships |
| `tools_skills_matrix_member_items` | Associations |
| `tools_skills_matrix_templates` | Templates prédéfinis |

## 🔧 Configuration

Par défaut : `http://localhost:8090`

Pour modifier :
```javascript
// tools/skills-matrix/js/pocketbase-integration.js
const PB_CONFIG = {
    baseUrl: 'http://votre-serveur:8090'
};
```

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `INTEGRATION-POCKETBASE-COMPLETE.md` | ⭐ Guide complet |
| `assets/js/POCKETBASE-MANAGER-GUIDE.md` | API et exemples |
| `tools/skills-matrix/POCKETBASE-INTEGRATION-V2.md` | Détails techniques |

## 🧪 Test Rapide

```bash
# Vérifier PocketBase
pm2 status pb-agile-drafts

# Tester l'API
curl http://localhost:8090/api/health

# Compter les données
sqlite3 bdd/pb_data/data.db "SELECT COUNT(*) FROM tools_skills_matrix_members;"
```

## 🎨 Réutilisation

Le système est réutilisable pour d'autres outils. Voir :
- `assets/js/POCKETBASE-MANAGER-GUIDE.md`

---

**Version** : 2.0.0  
**Date** : 2025-01-14  
**Statut** : ✅ Fonctionnel
