# 📊 Guide des Vues Scrum

## Vue d'ensemble

Le Team Velocity Dashboard propose **3 vues de graphiques** pour analyser la performance de votre équipe Scrum sous différents angles. Chaque vue offre des insights uniques pour piloter votre sprint.

---

## 📊 Vue Vélocité (par défaut)

### Description
La vue classique qui affiche la **vélocité par sprint** avec une ligne de tendance.

### Utilisation
- **Barres bleues** : Story points complétés par sprint
- **Ligne orange** : Tendance calculée sur l'historique
- **Annotations** : Faits marquants affichés sur chaque sprint

### Quand l'utiliser ?
- ✅ Comparer les performances entre sprints
- ✅ Identifier les tendances à long terme
- ✅ Détecter les anomalies de vélocité
- ✅ Planifier la capacité des futurs sprints

### Insights clés
- **Vélocité moyenne** : Capacité de l'équipe
- **Tendance** : Amélioration ou dégradation
- **Variabilité** : Stabilité de l'équipe

---

## 📉 Vue Burndown Chart

### Description
Affiche le **travail restant** au fil des sprints avec une ligne idéale de descente.

### Utilisation
- **Ligne rouge** : Travail restant réel
- **Ligne grise pointillée** : Burndown idéal (descente linéaire)
- **Point final** : Objectif zéro à la fin

### Quand l'utiliser ?
- ✅ Suivre l'avancement vers l'objectif
- ✅ Détecter les retards précocement
- ✅ Comparer réel vs idéal
- ✅ Identifier les sprints problématiques

### Insights clés
- **Écart à l'idéal** : Retard ou avance
- **Pente** : Vitesse de progression
- **Risques** : Sprints au-dessus de l'idéal

### Interprétation
```
Ligne rouge AU-DESSUS de l'idéal → Retard
Ligne rouge EN-DESSOUS de l'idéal → Avance
Ligne rouge PARALLÈLE à l'idéal → Rythme constant
```

---

## 📈 Vue Burnup Chart

### Description
Affiche le **travail complété** (cumulatif) par rapport au **scope total** du projet.

### Utilisation
- **Ligne verte** : Travail complété (cumulatif)
- **Ligne bleue** : Scope total (peut varier)
- **Tooltip** : Pourcentage de progression

### Quand l'utiliser ?
- ✅ Visualiser la progression globale
- ✅ Détecter les ajouts de scope (scope creep)
- ✅ Communiquer l'avancement aux stakeholders
- ✅ Prévoir la date de fin

### Insights clés
- **Progression** : % du scope complété
- **Variations de scope** : Ajouts en cours de route
- **Prédiction** : Estimation de la date de fin

### Interprétation
```
Ligne verte MONTE → Travail complété augmente
Ligne bleue MONTE → Ajout de scope (attention !)
Ligne bleue STABLE → Scope figé (idéal)
Écart entre les lignes → Travail restant
```

---

## 🎯 Comparaison des Vues

| Vue | Focus | Métrique | Meilleur pour |
|-----|-------|----------|---------------|
| **📊 Vélocité** | Performance par sprint | Story points / sprint | Planification capacité |
| **📉 Burndown** | Travail restant | Points restants | Suivi d'avancement |
| **📈 Burnup** | Progression globale | Points complétés vs scope | Communication stakeholders |

---

## 🔄 Changement de Vue

### Interface
Les 3 boutons emoji en haut du graphique permettent de basculer entre les vues :
- 📊 = Vélocité
- 📉 = Burndown
- 📈 = Burnup

### Sauvegarde
La vue sélectionnée est **automatiquement sauvegardée** et restaurée au rechargement de la page.

### Disponibilité
Les vues multiples sont disponibles **uniquement en mode Scrum** avec au moins un sprint enregistré.

### Ordre d'Affichage
Les sprints s'affichent dans l'**ordre chronologique** :
- **Gauche** : Sprint le plus ancien
- **Droite** : Sprint le plus récent
- **Lecture naturelle** : Le temps progresse de gauche à droite comme une timeline

---

## 📝 Annotations et Faits Marquants

### Préservation
Les **annotations** (faits marquants) sont affichées sur **toutes les vues** :
- 👥 Changement d'équipe
- 🏖️ Congés
- 🚨 Incident
- 🔧 Changement de process
- 🚀 Release
- 🎓 Formation

### Tooltip
Survolez un point pour voir les faits marquants du sprint correspondant.

---

## 💡 Bonnes Pratiques

### Vélocité
- Utilisez la **moyenne des 3 derniers sprints** pour planifier
- Ignorez les sprints avec incidents majeurs
- Cherchez la **stabilité** plutôt que l'augmentation

### Burndown
- Vérifiez **quotidiennement** pendant le sprint
- Alertez si écart > 20% avec l'idéal
- Ajustez le scope si nécessaire

### Burnup
- Présentez aux **stakeholders** pour transparence
- Documentez les **ajouts de scope**
- Utilisez pour les **prédictions de fin**

---

## 🎓 Exemples d'Analyse

### Scénario 1 : Équipe stable
```
Vélocité : Barres régulières autour de 30 points
Burndown : Ligne proche de l'idéal
Burnup : Progression linéaire
→ Équipe performante et prévisible
```

### Scénario 2 : Ajout de scope
```
Vélocité : Stable à 25 points
Burndown : Ligne monte au lieu de descendre
Burnup : Ligne bleue (scope) monte brusquement
→ Scope creep détecté, revoir les priorités
```

### Scénario 3 : Incident majeur
```
Vélocité : Chute brutale à 10 points
Burndown : Ligne s'éloigne de l'idéal
Burnup : Plateau sur la ligne verte
→ Sprint impacté, annotation 🚨 visible
```

---

## 🚀 Prochaines Évolutions

- [ ] Burndown par jour (intra-sprint)
- [ ] Prédiction de fin de projet
- [ ] Comparaison multi-équipes
- [ ] Export des graphiques en PNG
- [ ] Alertes automatiques sur écarts

---

**Version** : 3.4.0  
**Dernière mise à jour** : 2025-10-20
