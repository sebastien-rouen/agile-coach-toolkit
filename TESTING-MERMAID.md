# 🧪 Guide de Test - Intégration Mermaid.js

## Objectif

Vérifier que l'intégration de Mermaid.js fonctionne correctement dans tous les contextes.

## Tests à Effectuer

### ✅ Test 1 : Page de Test Standalone

**Fichier** : `tests/test-mermaid.html`

**Procédure** :
1. Ouvrir le fichier dans un navigateur
2. Vérifier que les 7 diagrammes s'affichent correctement
3. Cliquer sur le bouton "Changer de thème"
4. Vérifier que les diagrammes se rechargent avec le nouveau thème

**Résultat attendu** :
- ✅ Tous les diagrammes sont visibles
- ✅ Les couleurs sont appliquées
- ✅ Le changement de thème fonctionne

---

### ✅ Test 2 : Parser avec Marked.js

**Fichier** : `tests/test-mermaid-parser.html`

**Procédure** :
1. Ouvrir le fichier dans un navigateur
2. Vérifier que les 3 tests affichent correctement les diagrammes
3. Ouvrir la console du navigateur (F12)
4. Vérifier les logs : "✅ X blocs Mermaid détectés"

**Résultat attendu** :
- ✅ Test 1 : Diagramme simple affiché
- ✅ Test 2 : Diagramme avec styles affiché
- ✅ Test 3 : Markdown mixte (texte + diagramme + code) affiché
- ✅ Console : "✅ 3 blocs Mermaid détectés"

---

### ✅ Test 3 : Contenu Markdown Réel

**Fichier** : `content/animation-facilitation/impact-mapping.md`

**Procédure** :
1. Démarrer un serveur local :
   ```bash
   python3 -m http.server 8000
   # ou
   npx http-server -p 8000
   ```

2. Ouvrir dans le navigateur :
   ```
   http://localhost:8000/content.html?cat=animation-facilitation&file=impact-mapping
   ```

3. Vérifier que le diagramme Impact Mapping s'affiche dans l'article

**Résultat attendu** :
- ✅ Le diagramme Impact Mapping est visible
- ✅ Les 4 nœuds (Pourquoi, Qui, Comment, Quoi) sont affichés
- ✅ Les couleurs sont appliquées (bleu, vert, orange, rouge)
- ✅ Les flèches connectent les nœuds

---

### ✅ Test 4 : Fichier Markdown de Test

**Fichier** : `tests/test-mermaid-content.md`

**Procédure** :
1. Copier le fichier dans `content/test/` (créer le dossier si nécessaire)
2. Créer `content/test/index.json` :
   ```json
   {
     "articles": [
       {
         "id": "test-mermaid-content",
         "title": "Test Mermaid",
         "tags": ["test"]
       }
     ]
   }
   ```

3. Ouvrir dans le navigateur :
   ```
   http://localhost:8000/content.html?cat=test&file=test-mermaid-content
   ```

**Résultat attendu** :
- ✅ Tous les diagrammes du fichier sont affichés
- ✅ Les différents types de diagrammes fonctionnent

---

## Checklist de Validation Complète

### Fonctionnalités de Base
- [ ] Les blocs ` ```mermaid ` sont détectés
- [ ] Les diagrammes sont rendus visuellement
- [ ] Les sauts de ligne (`\n`) fonctionnent dans les labels
- [ ] Les flèches et connexions sont visibles

### Styles et Thèmes
- [ ] Les couleurs personnalisées sont appliquées
- [ ] Le thème clair fonctionne
- [ ] Le thème sombre fonctionne
- [ ] Le changement de thème recharge les diagrammes

### Types de Diagrammes
- [ ] Flowchart (graph LR/TD)
- [ ] Sequence diagram
- [ ] State diagram
- [ ] Pie chart
- [ ] Autres types (class, gantt, erd, journey)

### Intégration
- [ ] Fonctionne dans `content.html`
- [ ] Fonctionne avec marked.js
- [ ] Fonctionne avec le parser maison (fallback)
- [ ] Pas d'erreurs dans la console

### Performance
- [ ] Les diagrammes se chargent rapidement (< 1s)
- [ ] Pas de ralentissement de la page
- [ ] Le scroll fonctionne pour les diagrammes larges

### Responsive
- [ ] Les diagrammes s'adaptent sur mobile
- [ ] Le scroll horizontal fonctionne si nécessaire
- [ ] Les labels restent lisibles

---

## Dépannage

### Le diagramme ne s'affiche pas

**Vérifications** :
1. Ouvrir la console (F12) et chercher les erreurs
2. Vérifier que le bloc commence par ` ```mermaid `
3. Tester la syntaxe sur https://mermaid.live/
4. Vérifier que mermaid.js est chargé : `typeof mermaid` dans la console

**Solutions** :
- Recharger la page (Ctrl+F5)
- Vérifier la syntaxe Mermaid
- Vérifier que le CDN est accessible

### Le diagramme est tronqué

**Solutions** :
- Réduire la complexité du diagramme
- Utiliser l'orientation verticale (TD) au lieu d'horizontale (LR)
- Vérifier le CSS : `.mermaid { overflow-x: auto; }`

### Les couleurs ne s'affichent pas

**Solutions** :
- Vérifier la syntaxe : `style A fill:#3b82f6,stroke:#1e40af,color:#fff`
- Utiliser le format hexadécimal pour les couleurs
- Tester avec le thème par défaut

---

## Commandes Utiles

### Démarrer un serveur local
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Vérifier les logs
```javascript
// Dans la console du navigateur
console.log(typeof mermaid);  // Doit afficher "object"
console.log(typeof marked);   // Doit afficher "function"
```

### Forcer le rendu Mermaid
```javascript
// Dans la console du navigateur
mermaid.contentLoaded();
```

---

## Résultats Attendus

Si tous les tests passent, vous devriez voir :

✅ **7 diagrammes** dans `test-mermaid.html`  
✅ **3 diagrammes** dans `test-mermaid-parser.html`  
✅ **1 diagramme** dans `impact-mapping.md`  
✅ **7 diagrammes** dans `test-mermaid-content.md`  

**Total** : 18 diagrammes fonctionnels

---

## Support

- **Documentation complète** : [docs/MERMAID-INTEGRATION.md](docs/MERMAID-INTEGRATION.md)
- **Guide rapide** : [docs/GUIDE-MERMAID-RAPIDE.md](docs/GUIDE-MERMAID-RAPIDE.md)
- **Éditeur en ligne** : https://mermaid.live/
- **Documentation officielle** : https://mermaid.js.org/

---

**Date de création** : 2025-01-19  
**Version** : 1.0.0
