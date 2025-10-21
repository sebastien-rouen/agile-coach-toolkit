# 🧪 Test du Delegation Board

## Comment tester l'affichage du board

### Option 1 : Utiliser les données de seed

Si vous avez exécuté les migrations PocketBase, vous avez déjà des données d'exemple :

1. Ouvrez l'outil : `http://localhost:8108/_/` (ou votre port PocketBase)
2. Vérifiez que les collections existent :
   - `tools_delegation_poker_sessions`
   - `tools_delegation_poker_decisions`
   - `tools_delegation_poker_votes`
   - `tools_delegation_poker_consensus`

3. Ouvrez l'outil Delegation Poker
4. Cliquez sur "📂 Charger session"
5. Sélectionnez "Service Urgences - Protocoles de Soins" (status: completed)
6. Le Delegation Board devrait s'afficher automatiquement avec 7 décisions

### Option 2 : Créer une session de test

1. Cliquez sur "➕ Nouvelle session"
2. Nom : "Test Board"
3. Participants :
   ```
   Alice (PO)
   Bob (Dev)
   Charlie (SM)
   ```

4. Ajoutez quelques décisions :
   - "Choix des technologies" (Technique)
   - "Priorisation du backlog" (Produit)
   - "Organisation des rétrospectives" (Équipe)

5. Pour chaque décision :
   - Cliquez sur "🃏 Voter"
   - Faites voter chaque participant
   - Cliquez sur "🎭 Révéler les votes"
   - Ajoutez des notes (optionnel)
   - Cliquez sur "💾 Enregistrer le consensus"

6. Le Delegation Board devrait apparaître après le premier consensus enregistré

## Résultat attendu

Le board devrait ressembler à ceci :

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           📊 DELEGATION BOARD                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Décision                         │ 1  │ 2  │ 3   │ 4   │ 5    │ 6     │ 7  │
│                                   │Tell│Sell│Consult│Agree│Advise│Inquire│Delegate│
│  ─────────────────────────────────┼────┼────┼─────┼─────┼──────┼───────┼────│
│  Choix des technologies           │    │    │     │  ★  │      │       │    │
│  Priorisation du backlog          │    │    │     │     │  ★   │       │    │
│  Organisation des rétrospectives  │    │    │     │     │      │       │ ★  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Vérifications visuelles

### ✅ Le board doit :
- [ ] S'afficher dans la zone principale (main-zone)
- [ ] Avoir un header "📊 Delegation Board"
- [ ] Afficher 7 colonnes (niveaux 1-7)
- [ ] Montrer les labels (Tell, Sell, Consult, etc.)
- [ ] Afficher les descriptions sous chaque label
- [ ] Marquer le niveau consensuel avec une étoile bleue (★)
- [ ] Avoir un fond neutre (pas de bleu clair)
- [ ] Être responsive (scroll horizontal sur mobile)

### ✅ Les interactions doivent :
- [ ] Afficher le board automatiquement après un consensus
- [ ] Mettre à jour le board quand un nouveau consensus est ajouté
- [ ] Cacher le board si aucun consensus n'existe
- [ ] Fonctionner en thème dark et light

## Dépannage

### Le board ne s'affiche pas

1. **Vérifiez la console** : Ouvrez les DevTools (F12) et regardez les erreurs
2. **Vérifiez PocketBase** : L'API est-elle accessible ?
3. **Vérifiez les consensus** : Y a-t-il au moins un consensus enregistré ?
4. **Rechargez la page** : Parfois un simple refresh suffit

### Le board s'affiche mal

1. **Vérifiez le CSS** : Les fichiers `styles.css` et `themes/light.css` sont-ils chargés ?
2. **Vérifiez le responsive** : Testez sur différentes tailles d'écran
3. **Vérifiez le thème** : Testez en dark et light mode

### Les étoiles ne s'affichent pas

1. **Vérifiez les données** : Les consensus ont-ils un `final_level` valide (1-7) ?
2. **Vérifiez le JavaScript** : La fonction `renderDelegationBoard` est-elle appelée ?
3. **Vérifiez le CSS** : La classe `.board-cell.active::after` est-elle définie ?

## Logs utiles

Ajoutez ces logs dans la console pour déboguer :

```javascript
// Dans renderDecisionsList
console.log('Consensus chargés:', validConsensus);

// Dans renderDelegationBoard
console.log('Rendu du board avec:', consensusData);
```

## Exemple de données de test

Si vous voulez tester manuellement, voici des données JSON :

```json
{
  "session": {
    "session_name": "Test Board",
    "participants": ["Alice", "Bob", "Charlie"],
    "status": "active"
  },
  "decisions": [
    {
      "decision_text": "Choix des technologies",
      "category": "technical",
      "consensus": { "final_level": 4 }
    },
    {
      "decision_text": "Priorisation du backlog",
      "category": "product",
      "consensus": { "final_level": 5 }
    }
  ]
}
```

---

**Note** : Ce fichier est destiné aux développeurs et testeurs. Il ne doit pas être inclus dans la version de production.
