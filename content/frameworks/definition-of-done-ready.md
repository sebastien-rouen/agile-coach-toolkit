---
id: "definition-of-done-ready"
title: "🎯 Definition of Done (DoD) & Definition of Ready (DoR)"
category: "frameworks"
tags: ["scrum", "artefacts", "qualité", "transparence", "critères", "user-story", "backlog"]
description: "Les deux piliers de la qualité en Agile : comment définir clairement quand une story est prête à être démarrée (DoR) et quand elle est terminée (DoD)."
---

# **🎯 Definition of Done (DoD) & Definition of Ready (DoR)**
*Parce qu'en Agile, "presque fini" = "pas fini", et "à peu près clair" = "flou artistique."*

**Tags** : `#scrum` `#artefacts` `#qualité` `#transparence` `#critères` `#user-story` `#backlog`

> *"Une DoD floue, c’est comme un GPS sans destination : tu avances, mais tu ne sais pas quand tu es arrivé. Et une DoR inexistante, c’est comme partir en voyage sans valise : tu vas perdre du temps à faire demi-tour."*
> — **Coach Sticko**

---

## **💡 Pitch**
**Problème** :
- **40%** des équipes Agile livrent des incréments avec des **bugs critiques** car la DoD n’est pas respectée (*State of Agile Report*).
- **30%** des stories en sprint sont **mal estimées** car la DoR n’était pas claire (*Scrum Alliance*).
- Résultat : **rework**, frustration, et une vélocité qui ressemble à des montagnes russes.

**Solutions** :
1. **DoR** = **"Checklist de départ"** : *"Cette story est-elle assez mûre pour être démarrée ?"*
2. **DoD** = **"Ligne d’arrivée"** : *"À quel moment pouvons-nous dire que c’est terminé, sans culpabilité ?"*

*Exemple* :
- **DoR** pour *"En tant qu’utilisateur, je veux réinitialiser mon mot de passe"* :
  - [ ] Le design des écrans est validé.
  - [ ] Les règles métiers sont documentées (ex: "Lien valide 24h").
  - [ ] Les dépendances techniques sont identifiées (ex: API d’envoi d’email).
- **DoD** :
  - [ ] Code revu par un pair.
  - [ ] Tests unitaires et d’intégration passés.
  - [ ] Documentation utilisateur mise à jour.

---
## **📖 Définition & Origines**
### **Definition of Ready (DoR)**
**Quoi** : Liste de critères qu’une **user story** doit satisfaire pour être **éligible** à un sprint.
**Pourquoi** :
- Éviter les stories **"trop grosses"** ou **"trop floues"**.
- Garantir que l’équipe a **toutes les infos** pour estimer et démarrer le travail.
- Réduire les **blocages en cours de sprint**.

**Origine** :
Popularisée par **Roman Pichler** et **Mike Cohn** pour répondre au problème des backlogs mal préparés.
- **Roman Pichler** (Product Owner expert, auteur de "Agile Product Management")
- **Mike Cohn** (fondateur de Mountain Goat Software, référence en User Stories) ont formalisé ces concepts pour structurer les backlogs produit.


---
### **Definition of Done (DoD)**
**Quoi** : Liste de critères qu’un **incrément** (story, tâche) doit satisfaire pour être considéré comme **terminé**.
**Pourquoi** :
- **Transparence** : tout le monde sait ce que "fini" signifie.
- **Qualité** : éviter les livraisons **"à moitié cuites"**.
- **Prévisibilité** : la vélocité devient fiable.

**Origine** :
Issue de **Scrum** (Ken Schwaber, 1995), inspirée des pratiques de **Total Quality Management (TQM)**.

---
## **🔍 DoR vs DoD : Comparatif**
| Critère               | **🔵 Definition of Ready (DoR)**                      | **🟢 Definition of Done (DoD)**                          |
|-----------------------|-------------------------------------------------------|-------------------------------------------------------|
| **Quand ?**           | **Avant** le sprint planning.                          | **À la fin** du sprint (ou de la story).               |
| **Objectif**          | S’assurer que la story est **compréhensible et faisable**. | Garantir que le travail est **complet et de qualité**. |
| **Portée**            | **1 story** à la fois.                                | **Tout l’incrément** (toutes les stories du sprint).   |
| **Responsable**       | **Product Owner** (avec l’équipe).                     | **Équipe de développement** (avec le PO).              |
| **Exemple de critère** | "Les maquettes sont validées."                        | "Les tests de non-régression sont passés."             |
| **Conséquence si ignoré** | Stories **sous-estimées** ou **bloquées**.          | **Rework**, bugs en production, dette technique.       |

---
## **📋 Exemples Concrets**
### **1. Definition of Ready (DoR)**
**Template générique** (à adapter) :
```markdown
✅ **Clarté** :
- [ ] La story a une **description claire** (format "En tant que... je veux... afin de...").
- [ ] Les **critères d’acceptation** sont définis et testables.
- [ ] Les **dépendances** (techniques, métiers) sont identifiées.

✅ **Taille** :
- [ ] La story est **estimable** (pas de "?" en planning poker).
- [ ] La story tient dans **un sprint** (ou est découpée en sous-tâches).

✅ **Contexte** :
- [ ] Les **règles métiers** sont documentées (ex: "Le mot de passe doit faire 8 caractères min").
- [ ] Les **maquettes/UI** sont disponibles (si applicable).
- [ ] Les **données test** sont prêtes (ex: jeux de données pour les tests).
```

**Exemple pour une story e-commerce** :
*"En tant qu’utilisateur, je veux payer avec PayPal afin d’avoir plus d’options de paiement."*
- [x] Les APIs PayPal sont documentées et accessibles.
- [x] Le design des écrans de paiement est validé.
- [x] Les frais de transaction PayPal sont clarifiés avec la compta.
- [x] La story est estimée à **5 story points** (consensus en planning poker).

---
### **2. Definition of Done (DoD)**
**Template générique** (niveaux progressifs) :
```markdown
🔹 **Niveau 1 (Minimum)** :
- [ ] Le code est **commité** et **poussé** sur la branche principale.
- [ ] Le code est **revu par un pair** (pull request mergée).
- [ ] Les **tests unitaires** passent.

🔹 **Niveau 2 (Standard)** :
- [ ] Les **tests d’intégration** passent.
- [ ] La **documentation technique** est mise à jour (README, commentaires).
- [ ] La **story est déployée en staging** et testée manuellement.

🔹 **Niveau 3 (Excellence)** :
- [ ] Les **tests de non-régression** passent.
- [ ] La **documentation utilisateur** est mise à jour (wiki, help center).
- [ ] Les **métriques de performance** sont dans les limites (ex: temps de réponse < 2s).
- [ ] La story est **déployée en production** et monitorée.
```

**Exemple pour une équipe DevOps** :
- [x] Code revu et mergé.
- [x] Pipeline CI/CD passe (build + tests + déploiement auto).
- [x] Feature flag activée en production.
- [x] Métriques (latence, erreurs) surveillées 24h après déploiement.

---
## **🛠️ Comment Construire sa DoD/DoR ?**
### **Atelier Collaboratif (1h)**
**Participants** : Équipe de dev + PO + Scrum Master.
**Matériel** : Tableau blanc, post-its, timer.

#### **Étapes pour la DoD** :
1. **Brainstorming** (15 min) :
   - *"Qu’est-ce que 'fini' signifie pour nous ?"* (1 critère = 1 post-it).
2. **Regroupement** (10 min) :
   - Thèmes communs (ex: "Tests", "Documentation", "Déploiement").
3. **Priorisation** (10 min) :
   - *"Quels sont les 3 critères **non-négociables** ?"* (vote dot).
4. **Validation** (5 min) :
   - *"Est-ce que cette DoD est **réaliste** et **mesurable** ?"*
5. **Documentation** (10 min) :
   - Écrire la DoD dans le **Confluence de l’équipe** ou sur un **tableau Miro partagé**.

#### **Étapes pour la DoR** :
1. **Analyse des blocages passés** (10 min) :
   - *"Quelles stories ont été bloquées ou mal estimées dans le dernier sprint ? Pourquoi ?"*
2. **Critères minimaux** (15 min) :
   - *"Quelles infos devons-nous avoir **avant** de démarrer une story ?"*
3. **Validation avec le PO** (10 min) :
   - *"Est-ce que ces critères sont **réalistes** pour le PO ?"*
4. **Intégration au workflow** (5 min) :
   - Ajouter la DoR comme **colonne dans Jira** ("Ready for Refinement" → "Ready for Sprint").

---
## **⚠️ Pièges à Éviter**
| Piège                          | Conséquence                                  | Solution                                  |
|--------------------------------|---------------------------------------------|-------------------------------------------|
| **DoD trop vague**             | "Fini" signifie quelque chose de différent pour chacun. | **Exemples concrets** (ex: "Tests = 100% coverage"). |
| **DoD trop stricte**          | L’équipe passe plus de temps à cocher des cases qu’à livrer. | **Niveaux progressifs** (ex: Niveau 1 pour les MVP). |
| **DoR ignorée**               | Stories "pourries" en sprint → blocages.    | **Refinement obligatoire** avant le planning. |
| **DoD/DoR imposées**          | L’équipe ne s’approprie pas les critères.  | **Co-construction en atelier**.           |
| **DoD différente par équipe**  | Incohérences dans la qualité.              | **Alignement entre équipes** (guilde qualité). |

---
## **📊 Avantages Mesurables**
| Bénéfice               | Métrique d’Impact                          | Exemple                                  |
|------------------------|-------------------------------------------|------------------------------------------|
| **Moins de rework**    | ↓ **30% de bugs en production**.          | De 15 bugs/sprint à 10 bugs/sprint.      |
| **Meilleure vélocité** | ↑ **Stabilité de la vélocité** (±10%).  | Vélocité passe de [30, 45, 20] à [40, 42, 45]. |
| **Transparence**       | ↓ **20% de malentendus** en sprint review. | Plus de "Je pensais que c’était fini !". |
| **Autonomie**          | ↑ **Décisions prises sans le PO**.        | Équipe décide seule si une story est "ready". |

---
## **🎯 DoD/DoR dans Différents Contextes**
### **1. Équipe Produit (Scrum/Kanban)**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Maquettes Figma validées.<br>- Règles métiers documentées (Confluence).<br>- Dépendances techniques identifiées (ex: API externe). | Jira (champ "DoR Checklist"), Miro. |
| **DoD**        | - Tests E2E passés (Cypress).<br>- Feature flag activée.<br>- Métriques de performance (New Relic) dans les limites. | Pipeline CI/CD (Jenkins, GitLab CI). |

---
### **2. Équipe Data Science**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Jeu de données nettoyé et disponible (S3).<br>- Hypothèse à valider clairement formulée.<br>- Environnement de calcul réservé (AWS). | Jupyter Notebook + Dataiku. |
| **DoD**        | - Modèle entraîné et évalué (AUC > 0.9).<br>- Code versionné (MLflow).<br>- Dashboard de monitoring (Grafana) déployé. | MLflow, TensorBoard. |

---
### **3. Équipe DevOps/Infrastructure**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Schéma d’architecture validé (Lucidchart).<br>- Accès aux environnements (AWS, Kubernetes).<br>- Backlog des risques identifiés. | Terraform, ArgoCD. |
| **DoD**        | - Infrastructure as Code (IaC) versionnée.<br>- Tests de sécurité (OWASP ZAP) passés.<br>- Runbook mis à jour. | Terraform Cloud, SonarQube. |

---
### **4. Équipe RH/Recrutement**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Fiche de poste validée par le manager.<br>- Budget et niveau de salaire approuvés (DRH).<br>- Canaux de diffusion identifiés (LinkedIn, JobBoard). | Workday, BambooHR. |
| **DoD**        | - Candidat sélectionné et contrat signé.<br>- Onboarding planifié (buddy, matériel).<br>- Feedback collecté auprès du manager recruteur. | ATS (Applicant Tracking System). |

---
### **5. Équipe Militaire/Opérationnelle**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Ordre de mission signé par la hiérarchie.<br>- Matériel et équipements vérifiés (check-list).<br>- Briefing sécurité effectué (ROE, menaces). | SICS (Système d'Information de Commandement). |
| **DoD**        | - Mission accomplie selon les objectifs.<br>- Rapport de mission (RETEX) rédigé.<br>- Matériel rendu et inventorié.<br>- Débriefing sécurité effectué. | Logiciel de gestion opérationnelle. |

---
### **6. Association Sportive/Événementiel**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Budget événement validé par le bureau.<br>- Lieu et date réservés (contrat signé).<br>- Équipe de bénévoles constituée (min 5 personnes). | HelloAsso, Eventbrite. |
| **DoD**        | - Événement réalisé avec 90% de participants présents.<br>- Bilan financier établi (recettes/dépenses).<br>- Feedback participants collecté (satisfaction > 4/5).<br>- Photos/vidéos partagées sur réseaux sociaux. | Google Forms, Canva. |

### **7. Équipe Médicale/Hospitalière**
| Artefact       | Critères Spécifiques                              | Outils Associés                          |
|----------------|---------------------------------------------------|------------------------------------------|
| **DoR**        | - Dossier patient complet et accessible (DPI).<br>- Protocole de soins validé par le médecin référent.<br>- Matériel médical disponible et stérilisé.<br>- Équipe soignante briefée (allergies, antécédents). | DPI (Dossier Patient Informatisé), PMSI. |
| **DoD**        | - Soins prodigués selon le protocole.<br>- Observations médicales consignées dans le dossier.<br>- Patient stabilisé (constantes dans les normes).<br>- Transmission effectuée à l'équipe suivante.<br>- Matériel nettoyé et restocké. | Logiciel de gestion hospitalière (Crossway, McKesson). |

---
## **📌 Checklist pour Implémenter DoD/DoR**
### **Pour les Équipes**
- [ ] **Co-construire** la DoD/DoR en atelier (pas imposée par le PO ou le SM).
- [ ] **Afficher la DoD/DoR** dans l’espace de travail (Miro, Confluence, mur physique).
- [ ] **Vérifier la DoR** avant chaque **refinement** et **planning**.
- [ ] **Valider la DoD** à chaque **sprint review** (avec démonstration).
- [ ] **Réviser la DoD/DoR** tous les **3 sprints** (amélioration continue).

### **Pour les Scrum Masters**
- [ ] **Former l’équipe** sur l’importance de la DoD/DoR (ex: atelier "Pourquoi on en a besoin ?").
- [ ] **Bloquer les stories** qui ne respectent pas la DoR (même si le PO insiste).
- [ ] **Mesurer l’impact** (ex: "Depuis qu’on applique la DoD, on a 20% de bugs en moins").
- [ ] **Escalader** si des dépendances externes bloquent la DoR (ex: design manquant).

### **Pour les Product Owners**
- [ ] **Préparer les stories** avec la DoR **avant le refinement**.
- [ ] **Accepter que des stories soient rejetées** si la DoR n’est pas respectée.
- [ ] **Prioriser la dette technique** si elle empêche de respecter la DoD.

---
> *"Une DoD sans DoR, c’est comme construire une maison sans fondations. Une DoR sans DoD, c’est comme avoir un beau plan… mais une maison jamais finie. Les deux sont les **jumeaux indissociables** de la qualité Agile."*
> — **Coach Sticko** 🏗️