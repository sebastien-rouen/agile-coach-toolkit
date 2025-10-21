# 🎨 Guide Visuel - Delegation Poker

## 📊 Le Delegation Board

Le Delegation Board est l'outil central pour visualiser et communiquer les niveaux de délégation dans votre équipe.

### Structure du Board

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           DELEGATION BOARD                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Décision                    │ 1  │ 2  │ 3   │ 4   │ 5    │ 6     │ 7       │
│                              │Tell│Sell│Consult│Agree│Advise│Inquire│Delegate│
│  ────────────────────────────┼────┼────┼─────┼─────┼──────┼───────┼─────────│
│  Choix des technologies      │    │    │     │  ★  │      │       │         │
│  Priorisation du backlog     │    │    │     │     │  ★   │       │         │
│  Recrutement développeur     │    │    │  ★  │     │      │       │         │
│  Organisation rétros         │    │    │     │     │      │       │    ★    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Légende des Niveaux

| Niveau | Nom | Description | Quand l'utiliser ? |
|--------|-----|-------------|-------------------|
| **1** | Tell | Je décide et j'informe | Urgences, décisions stratégiques critiques |
| **2** | Sell | Je décide et je convaincs | Changements importants nécessitant adhésion |
| **3** | Consult | Je consulte puis décide | Décisions où l'expertise de l'équipe compte |
| **4** | Agree | Nous décidons ensemble | Décisions impactant toute l'équipe |
| **5** | Advise | Je conseille, tu décides | Équipe mature avec besoin de guidance |
| **6** | Inquire | Tu décides et m'informes | Équipe autonome, besoin de visibilité |
| **7** | Delegate | Tu décides en autonomie | Équipe experte, confiance totale |

## 🎯 Exemples par Contexte

### Équipe Produit - Sprint Planning

```
Décision                              Niveau  Justification
────────────────────────────────────  ──────  ─────────────────────────────
Choix des user stories du sprint        4     Décision collective PO + Dev
Estimation des stories                   7     Équipe dev autonome
Choix des technologies                   4     Accord nécessaire (impact long terme)
Priorisation du backlog                  5     PO décide, équipe conseille
Organisation des daily                   7     Équipe s'auto-organise
```

### Service RH - Recrutement

```
Décision                              Niveau  Justification
────────────────────────────────────  ──────  ─────────────────────────────
Définition du profil recherché           3     RH consulte le manager
Sélection des candidats (shortlist)     4     Décision partagée RH + Manager
Entretien technique                      6     Équipe technique autonome
Offre salariale                          2     RH décide et explique
Onboarding du nouveau                    5     RH conseille, équipe décide
```

### Service Urgences - Protocoles

```
Décision                              Niveau  Justification
────────────────────────────────────  ──────  ─────────────────────────────
Protocole de triage                      3     Chef consulte, décide
Répartition des patients                 4     Décision collective
Appel de renforts                        4     Accord selon urgence
Transfert vers autre service             4     Décision partagée
Gestion des stocks médicaux              6     Équipe autonome avec reporting
Organisation des plannings               5     Chef conseille, équipe décide
Protocole d'urgence vitale               2     Chef décide et explique
```

## 💡 Patterns de Délégation

### Pattern "Croissance Progressive"

Au fur et à mesure que l'équipe gagne en maturité, les niveaux évoluent :

```
Mois 1-3 (Équipe nouvelle)
Choix techniques:  3 (Consult) → Manager consulte puis décide

Mois 4-6 (Équipe en apprentissage)
Choix techniques:  4 (Agree) → Décision partagée

Mois 7-12 (Équipe mature)
Choix techniques:  5 (Advise) → Manager conseille, équipe décide

Mois 12+ (Équipe experte)
Choix techniques:  6 (Inquire) → Équipe décide et informe
```

### Pattern "Contexte Variable"

Le même type de décision peut avoir des niveaux différents selon le contexte :

```
Choix d'une librairie JavaScript
├─ Pour un POC rapide:           7 (Delegate) - Équipe autonome
├─ Pour un composant interne:    5 (Advise) - Architecte conseille
└─ Pour le cœur du produit:      4 (Agree) - Décision collective

Recrutement
├─ Stagiaire:                    5 (Advise) - RH conseille, équipe décide
├─ Développeur junior:           4 (Agree) - Décision partagée
└─ Lead technique:               3 (Consult) - Direction consulte puis décide
```

## 🚀 Utilisation du Board

### 1. Affichage Physique

Imprimez le board et affichez-le dans l'espace de travail :

- **Tableau blanc** : Dessinez le board avec des post-its pour les étoiles
- **Poster A3** : Imprimez et plastifiez pour durabilité
- **Mur dédié** : Créez un "mur de délégation" avec plusieurs boards

### 2. Affichage Digital

Partagez le board en ligne :

- **Confluence/Notion** : Intégrez le tableau dans votre wiki
- **Slack/Teams** : Épinglez une capture dans le canal de l'équipe
- **Miro/Mural** : Créez un board interactif

### 3. Référence Quotidienne

Utilisez le board comme référence :

- **Avant une décision** : "Quel est notre niveau pour ce type de décision ?"
- **En rétrospective** : "Avons-nous respecté nos niveaux de délégation ?"
- **En 1-on-1** : "Comment te sens-tu par rapport à ton niveau d'autonomie ?"

## 📈 Évolution du Board

### Revue Trimestrielle

Tous les 3 mois, revisitez le board :

1. **Quelles décisions ont changé de niveau ?**
2. **Pourquoi ? (maturité, contexte, apprentissage)**
3. **Quelles décisions devraient évoluer ?**
4. **Y a-t-il de nouvelles décisions à ajouter ?**

### Indicateurs de Maturité

Observez l'évolution des niveaux moyens :

```
Trimestre 1:  Moyenne = 3.2 (Consult)
Trimestre 2:  Moyenne = 3.8 (Consult → Agree)
Trimestre 3:  Moyenne = 4.5 (Agree → Advise)
Trimestre 4:  Moyenne = 5.1 (Advise)

→ Progression vers plus d'autonomie ✅
```

## ⚠️ Anti-Patterns à Éviter

### ❌ Le "Tout ou Rien"

```
MAUVAIS:
Toutes les décisions à 1 (Tell) → Micromanagement
Toutes les décisions à 7 (Delegate) → Abandon

BON:
Mix de niveaux selon contexte et maturité
```

### ❌ Le "Board Figé"

```
MAUVAIS:
Board créé une fois et jamais mis à jour

BON:
Revue régulière (tous les 3-6 mois)
Ajustements selon l'évolution de l'équipe
```

### ❌ Le "Board Théorique"

```
MAUVAIS:
Board affiché mais jamais utilisé en pratique

BON:
Référence active lors des décisions
Discussion en rétrospective
Ajustements basés sur la réalité
```

## 🎓 Ressources Complémentaires

- **Livre** : "Management 3.0" par Jurgen Appelo
- **Article** : [Delegation Poker sur Management30.com](https://management30.com/practice/delegation-poker/)
- **Vidéo** : Recherchez "Delegation Poker" sur YouTube
- **Communauté** : Rejoignez les groupes Management 3.0 sur LinkedIn

---

**Créé avec ❤️ par Coach Sticko**  
*Basé sur les pratiques de Management 3.0*
