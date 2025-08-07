class ExampleMappingTool {
    constructor() {
        this.cards = [];
        this.cardIdCounter = 1;
        this.votes = new Map();
        this.currentStoryPoints = null;
        this.storyColumns = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadFromStorage();
        this.setupDragAndDrop();
        this.initializeColumns();
    }
    
    initializeColumns() {
        // Créer une colonne par défaut
        this.createStoryColumn();
    }
    
    createStoryColumn() {
        const boardColumns = document.getElementById('main-board');
        const columnId = `column-${Date.now()}`;
        
        const column = document.createElement('div');
        column.className = 'story-column';
        column.id = columnId;
        column.innerHTML = `
            <h4>Nouvelle colonne</h4>
            <div class="story-section" data-type="story">
                <!-- Stories ici -->
            </div>
            <div class="rules-section" data-type="rule">
                <div class="section-title">Règles métier</div>
            </div>
            <div class="examples-section" data-type="example">
                <div class="section-title">Exemples concrets</div>
            </div>
        `;
        
        boardColumns.appendChild(column);
        this.storyColumns.push(columnId);
        
        this.setupColumnDragAndDrop(column);
        
        return column;
    }
    
    setupColumnDragAndDrop(column) {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', (e) => {
            if (!column.contains(e.relatedTarget)) {
                column.classList.remove('drag-over');
            }
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);
            
            if (card) {
                const cardType = card.classList.contains('story') ? 'story' :
                               card.classList.contains('rule') ? 'rule' :
                               card.classList.contains('example') ? 'example' : 'question';
                
                if (cardType === 'question') {
                    // Les questions vont dans la sidebar
                    const questionsContainer = document.getElementById('questions-container');
                    questionsContainer.appendChild(card);
                } else {
                    // Autres cartes dans les sections appropriées
                    const targetSection = column.querySelector(`[data-type="${cardType}"]`);
                    if (targetSection) {
                        targetSection.appendChild(card);
                        if (cardType === 'story') {
                            column.classList.add('has-story');
                            column.querySelector('h4').textContent = this.getCardContent(cardId) || 'User Story';
                        }
                    }
                }
                
                this.reorganizeBoard();
                this.saveToStorage();
            }
        });
    }
    
    bindEvents() {
        // Votes Fibonacci
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.vote(e.target.dataset.value);
            });
        });
        
        // Sauvegarde automatique
        setInterval(() => {
            this.saveToStorage();
        }, 5000);
        
        // Sauvegarde avant fermeture
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
        
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.exportJSON();
                        break;
                    case 'z':
                        e.preventDefault();
                        // TODO: Implémenter undo
                        break;
                }
            }
        });
    }
    
    setupDragAndDrop() {
        // Setup pour la sidebar des questions
        const questionsContainer = document.getElementById('questions-container');
        
        questionsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        questionsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);
            
            if (card && card.classList.contains('question')) {
                questionsContainer.appendChild(card);
                this.saveToStorage();
            }
        });
    }
    
    addCard(type, content = '', id = null) {
        const cardId = id || `card-${this.cardIdCounter++}`;
        const card = this.createCardElement(cardId, type, content);
        
        // Placement intelligent selon le type
        if (type === 'question') {
            document.getElementById('questions-container').appendChild(card);
        } else if (type === 'story') {
            // Créer une nouvelle colonne pour la story
            const column = this.createStoryColumn();
            const storySection = column.querySelector('[data-type="story"]');
            storySection.appendChild(card);
            column.classList.add('has-story');
            column.querySelector('h4').textContent = content || 'Nouvelle User Story';
        } else {
            // Placer dans la première colonne disponible ou créer une nouvelle
            const existingColumns = document.querySelectorAll('.story-column');
            const lastColumn = existingColumns[existingColumns.length - 1];
            
            if (lastColumn) {
                const targetSection = lastColumn.querySelector(`[data-type="${type}"]`);
                targetSection.appendChild(card);
            } else {
                const newColumn = this.createStoryColumn();
                const targetSection = newColumn.querySelector(`[data-type="${type}"]`);
                targetSection.appendChild(card);
            }
        }
        
        this.cards.push({
            id: cardId,
            type: type,
            content: content,
            timestamp: Date.now()
        });
        
        this.saveToStorage();
        
        // Focus sur le nouveau contenu
        setTimeout(() => {
            const input = card.querySelector('.card-input');
            if (input) {
                input.focus();
            }
        }, 100);
        
        return card;
    }
    
    createCardElement(id, type, content) {
        const card = document.createElement('div');
        card.className = `card ${type}`;
        card.id = id;
        card.draggable = true;
        
        const typeLabels = {
            story: 'User Story',
            rule: 'Règle',
            example: 'Exemple',
            question: 'Question'
        };
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-type">${typeLabels[type]}</span>
                <div class="card-actions">
                    <button class="card-btn" onclick="exampleTool.duplicateCard('${id}')" title="Dupliquer">📋</button>
                    <button class="card-btn" onclick="exampleTool.deleteCard('${id}')" title="Supprimer">🗑️</button>
                </div>
            </div>
            <div class="card-content">
                <textarea class="card-input" placeholder="${this.getPlaceholder(type)}">${content}</textarea>
            </div>
        `;
        
        // Événements drag & drop
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', id);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
        
        // Sauvegarde automatique du contenu
        const input = card.querySelector('.card-input');
        input.addEventListener('input', (e) => {
            this.updateCardContent(id, e.target.value);
            
            // Mettre à jour le titre de la colonne si c'est une story
            if (type === 'story') {
                const column = card.closest('.story-column');
                if (column) {
                    const title = column.querySelector('h4');
                    title.textContent = e.target.value.substring(0, 50) + (e.target.value.length > 50 ? '...' : '') || 'User Story';
                }
            }
        });
        
        // Auto-resize textarea
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        return card;
    }
    
    getPlaceholder(type) {
        const placeholders = {
            story: 'En tant que [utilisateur], je veux [action] pour [bénéfice]...',
            rule: 'Décrivez une règle métier ou contrainte...',
            example: 'Décrivez un exemple concret : "Quand [situation], alors [résultat]"...',
            question: 'Quelle question reste en suspens ?...'
        };
        return placeholders[type] || '';
    }
    
    getCardContent(id) {
        const card = this.cards.find(c => c.id === id);
        return card ? card.content : '';
    }
    
    updateCardContent(id, content) {
        const card = this.cards.find(c => c.id === id);
        if (card) {
            card.content = content;
            this.saveToStorage();
        }
    }
    
    deleteCard(id) {
        if (confirm('Supprimer cette carte ?')) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
            
            this.cards = this.cards.filter(c => c.id !== id);
            this.reorganizeBoard();
            this.saveToStorage();
        }
    }
    
    duplicateCard(id) {
        const originalCard = this.cards.find(c => c.id === id);
        if (originalCard) {
            this.addCard(originalCard.type, originalCard.content + ' (copie)');
        }
    }
    
    reorganizeBoard() {
        // Nettoyer les colonnes vides
        const columns = document.querySelectorAll('.story-column');
        columns.forEach(column => {
            const hasStory = column.querySelector('[data-type="story"] .card');
            const hasRules = column.querySelector('[data-type="rule"] .card');
            const hasExamples = column.querySelector('[data-type="example"] .card');
            
            if (!hasStory && !hasRules && !hasExamples) {
                column.remove();
            }
        });
        
        // Assurer qu'il y a toujours au moins une colonne
        if (document.querySelectorAll('.story-column').length === 0) {
            this.createStoryColumn();
        }
    }
    
    clearAll() {
        if (confirm('Supprimer toutes les cartes ? Cette action est irréversible.')) {
            document.getElementById('main-board').innerHTML = '';
            document.getElementById('questions-container').innerHTML = '';
            this.cards = [];
            this.votes.clear();
            this.currentStoryPoints = null;
            this.storyColumns = [];
            this.updateVoteResult();
            this.initializeColumns();
            this.saveToStorage();
        }
    }
    
    vote(value) {
        // Simuler un ID utilisateur unique
        const userId = 'user-' + Math.random().toString(36).substr(2, 9);
        
        this.votes.set(userId, value);
        
        // Mettre à jour l'interface
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelector(`[data-value="${value}"]`).classList.add('selected');
        
        this.updateVoteResult();
        this.saveToStorage();
    }
    
    updateVoteResult() {
        const voteArray = Array.from(this.votes.values());
        if (voteArray.length === 0) {
            document.getElementById('voteResult').textContent = '';
            return;
        }
        
        const numericVotes = voteArray.filter(v => v !== '?');
        if (numericVotes.length === 0) {
            document.getElementById('voteResult').textContent = 'Votes : ' + voteArray.join(', ');
            return;
        }
        
        const average = numericVotes.reduce((sum, val) => sum + parseInt(val), 0) / numericVotes.length;
        const consensus = this.findConsensus(voteArray);
        
        document.getElementById('voteResult').textContent = 
            `Résultat : ${consensus} (Moyenne: ${average.toFixed(1)})`;
        
        this.currentStoryPoints = consensus;
    }
    
    findConsensus(votes) {
        const numericVotes = votes.filter(v => v !== '?').map(v => parseInt(v));
        if (numericVotes.length === 0) return '?';
        
        const sorted = numericVotes.sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        
        const fibValues = [1, 2, 3, 5, 8, 13, 20];
        return fibValues.reduce((prev, curr) => 
            Math.abs(curr - median) < Math.abs(prev - median) ? curr : prev
        );
    }
    
    exportJSON() {
        const data = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            cards: this.cards,
            votes: Object.fromEntries(this.votes),
            storyPoints: this.currentStoryPoints
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `example-mapping-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    importJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Vider le board actuel
                this.clearAll();
                
                // Charger les données
                if (data.cards) {
                    data.cards.forEach(card => {
                        this.addCard(card.type, card.content, card.id);
                    });
                }
                
                if (data.votes) {
                    this.votes = new Map(Object.entries(data.votes));
                    this.updateVoteResult();
                }
                
                if (data.storyPoints) {
                    this.currentStoryPoints = data.storyPoints;
                }
                
                alert('Import réussi !');
                
            } catch (error) {
                alert('Erreur lors de l\'import : ' + error.message);
            }
        };
        
        reader.readAsText(file);
        event.target.value = '';
    }
    
    exportJIRA() {
        const storyCards = this.cards.filter(c => c.type === 'story');
        const ruleCards = this.cards.filter(c => c.type === 'rule');
        const exampleCards = this.cards.filter(c => c.type === 'example');
        const questionCards = this.cards.filter(c => c.type === 'question');
        
        let jiraContent = '';
        
        // En-tête
        jiraContent += '## 📒 User Story\n';
        if (storyCards.length > 0) {
            jiraContent += storyCards[0].content + '\n\n';
        } else {
            jiraContent += 'As a [user], I want [capability] so that [benefit].\n\n';
        }
        
        // Description
        jiraContent += '## 🗒️ Description\n';
        jiraContent += 'User story créée via Example Mapping le ' + new Date().toLocaleDateString('fr-FR') + '\n\n';
        
        // Critères d'acceptation basés sur les règles
        if (ruleCards.length > 0) {
            jiraContent += '## 🟪 Acceptance Criteria\n';
            ruleCards.forEach((rule, index) => {
                jiraContent += `**Rule ${index + 1}:** ${rule.content}\n`;
                
                // Trouver les exemples liés
                const relatedExamples = exampleCards.slice(index * 2, (index + 1) * 2);
                relatedExamples.forEach(example => {
                    jiraContent += `- **Example:** ${example.content}\n`;
                });
                jiraContent += '\n';
            });
        }
        
        // Exemples supplémentaires
        if (exampleCards.length > 0) {
            jiraContent += '## 🤖 Test Scenarios\n';
            exampleCards.forEach((example, index) => {
                jiraContent += `**Scenario ${index + 1}:** ${example.content}\n`;
            });
            jiraContent += '\n';
        }
        
        // Questions ouvertes
        if (questionCards.length > 0) {
            jiraContent += '## 🍥 Open Questions\n';
            questionCards.forEach((question, index) => {
                jiraContent += `- [ ] ${question.content}\n`;
            });
            jiraContent += '\n';
        }
        
        // Story Points
        if (this.currentStoryPoints) {
            jiraContent += `## Story Points\n${this.currentStoryPoints}\n\n`;
        }
        
        // Definition of Done
        jiraContent += `## ✅ Definition of Done\n`;
        jiraContent += `- [ ] Code developed and unit tested\n`;
        jiraContent += `- [ ] Code reviewed by peer\n`;
        jiraContent += `- [ ] All acceptance criteria met\n`;
        jiraContent += `- [ ] Integration tests passing\n`;
        jiraContent += `- [ ] Documentation updated\n`;
        jiraContent += `- [ ] QA testing completed\n`;
        jiraContent += `- [ ] Ready for production deployment\n`;
        
        // Créer et télécharger le fichier
        const blob = new Blob([jiraContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jira-export-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Aussi copier dans le presse-papier
        navigator.clipboard.writeText(jiraContent).then(() => {
            alert('Export JIRA créé et copié dans le presse-papier !');
        }).catch(() => {
            alert('Export JIRA créé ! Le fichier a été téléchargé.');
        });
    }
    
    loadExample(type) {
        if (this.cards.length > 0 && !confirm('Charger un exemple effacera les cartes actuelles. Continuer ?')) {
            return;
        }
        
        this.clearAll();
        
        const examples = {
            auth: {
                story: "En tant qu'utilisateur enregistré, je veux me connecter avec mon email et mon mot de passe pour accéder à mon compte",
                rules: [
                    "L'utilisateur doit fournir un email et un mot de passe valides",
                    "Les informations d'identification doivent être validées contre la base de données",
                    "L'utilisateur doit être redirigé vers la page appropriée après connexion réussie",
                    "Les tentatives de connexion échouées doivent être limitées pour sécurité"
                ],
                examples: [
                    "Marie saisit son email et mot de passe corrects → elle accède à son tableau de bord",
                    "Jean saisit un email incorrect → message d'erreur 'Email ou mot de passe incorrect'",
                    "Sarah saisit un mot de passe expiré → message 'Votre mot de passe a expiré'",
                    "Paul fait 3 tentatives échouées → son compte est temporairement bloqué",
                    "Utilisateur non enregistré tente de se connecter → message 'Aucun compte trouvé'"
                ],
                questions: [
                    "Combien de tentatives avant blocage temporaire ?",
                    "Quelle est la durée du blocage ?",
                    "Faut-il intégrer l'authentification à deux facteurs ?"
                ]
            },
            cart: {
                story: "En tant que client, je veux ajouter des produits à mon panier pour les acheter plus tard",
                rules: [
                    "Un produit peut être ajouté au panier seulement s'il est disponible en stock",
                    "La quantité demandée ne peut pas dépasser le stock disponible",
                    "Le prix total du panier doit être recalculé à chaque modification",
                    "Le panier doit persister entre les sessions utilisateur"
                ],
                examples: [
                    "Client ajoute 2 chaussures en stock → panier mis à jour avec nouveau prix total",
                    "Client tente d'ajouter 10 articles mais stock = 5 → message 'Stock insuffisant, maximum 5 disponibles'",
                    "Client ferme navigateur puis revient → panier conservé avec ses articles",
                    "Prix d'un article change → panier recalculé automatiquement",
                    "Article épuisé dans le panier → notification et retrait automatique"
                ],
                questions: [
                    "Quelle est la durée de conservation du panier ?",
                    "Que faire si le prix change drastiquement ?",
                    "Faut-il des notifications push pour articles en rupture ?"
                ]
            },
            search: {
                story: "En tant qu'utilisateur, je veux rechercher des produits par mot-clé pour trouver ce dont j'ai besoin",
                rules: [
                    "La recherche doit être insensible à la casse (majuscules/minuscules)",
                    "Les résultats doivent être triés par pertinence décroissante",
                    "Les recherches vides ne doivent pas retourner tous les produits",
                    "Les résultats doivent être paginés pour la performance"
                ],
                examples: [
                    "Utilisateur tape 'iPhone' → affiche tous les modèles iPhone disponibles",
                    "Utilisateur tape 'IPHONE' → même résultat qu'exemple précédent",
                    "Utilisateur tape '' (recherche vide) → message 'Veuillez saisir un terme de recherche'",
                    "Recherche retourne 100 résultats → affichage par pages de 20 produits",
                    "Recherche 'smartphone rouge' → produits contenant les deux mots en priorité"
                ],
                questions: [
                    "Faut-il suggérer des corrections orthographiques ?",
                    "Doit-on conserver un historique des recherches utilisateur ?",
                    "La recherche vocale doit-elle être intégrée ?"
                ]
            },
            payment: {
                story: "En tant que client, je veux payer ma commande de manière sécurisée pour finaliser mon achat",
                rules: [
                    "Le paiement doit être sécurisé avec chiffrement SSL/TLS",
                    "Plusieurs méthodes de paiement doivent être disponibles",
                    "Le montant doit correspondre exactement au total de la commande",
                    "Une confirmation doit être envoyée après paiement réussi"
                ],
                examples: [
                    "Client paie 99,99€ par carte bancaire → paiement accepté et confirmation envoyée",
                    "Paiement refusé par la banque → message 'Paiement refusé, veuillez vérifier vos informations'",
                    "Client utilise PayPal → redirection vers PayPal puis retour avec confirmation",
                    "Connexion interrompue pendant paiement → statut 'en attente' et vérification automatique",
                    "Double-clic sur 'Payer' → un seul paiement traité grâce à protection anti-double"
                ],
                questions: [
                    "Quel est le temps maximum d'attente pour confirmation bancaire ?",
                    "Comment gérer les remboursements automatiques ?",
                    "Doit-on conserver les données de carte pour futurs achats ?"
                ]
            },
            registration: {
                story: "En tant que visiteur, je veux créer un compte pour accéder aux fonctionnalités membres",
                rules: [
                    "L'email doit être unique dans le système et avoir un format valide",
                    "Le mot de passe doit respecter les critères de sécurité définis",
                    "L'utilisateur doit confirmer son email avant activation complète",
                    "Tous les champs obligatoires doivent être remplis"
                ],
                examples: [
                    "Nouvel utilisateur avec email valide et mot de passe fort → compte créé et email de confirmation envoyé",
                    "Utilisateur tente d'utiliser email déjà existant → message 'Cet email est déjà utilisé'",
                    "Mot de passe trop faible → message 'Le mot de passe doit contenir 8 caractères, 1 majuscule, 1 chiffre'",
                    "Email format invalide saisi → message 'Format d'email invalide'",
                    "Utilisateur ne confirme pas email dans 24h → compte suspendu temporairement"
                ],
                questions: [
                    "Quel est le délai maximum pour confirmation email ?",
                    "Doit-on permettre l'inscription via réseaux sociaux ?",
                    "Validation en temps réel ou seulement à la soumission ?"
                ]
            },
            health: {
                story: "En tant que patient, je veux consulter mon parcours de soins personnalisé pour mieux comprendre et suivre mon traitement",
                rules: [
                    "Le parcours doit être adapté à la pathologie et au stade de traitement du patient",
                    "Les informations médicales doivent être validées par l'équipe soignante",
                    "Les données personnelles de santé doivent être sécurisées selon RGPD Santé",
                    "Le patient doit pouvoir accéder 24h/24 à son parcours via interface sécurisée"
                ],
                examples: [
                    "Mme Dupont (diabète type 2) voit son parcours avec: contrôles glycémie, RDV nutritionniste, examens trimestriels",
                    "M. Martin (post-chirurgie) accède à son planning: rééducation, pansements, consultations de suivi",
                    "Patient avec allergie médicamenteuse → alerte automatique visible dans le parcours",
                    "Adolescent de 16 ans → parcours adapté avec langage simplifié et contenus pédagogiques",
                    "Urgence médicale → équipe soignante accède immédiatement à l'historique complet"
                ],
                questions: [
                    "Comment intégrer les proches aidants dans le parcours ?",
                    "Faut-il des notifications push pour rappels de traitement ?",
                    "Quelle granularité pour l'historique médical visible par le patient ?",
                    "Comment gérer les parcours pluridisciplinaires (plusieurs services) ?"
                ]
            },
            devops: {
                story: "En tant que développeur, je veux déclencher un déploiement automatisé en production pour livrer rapidement et en sécurité",
                rules: [
                    "Le déploiement ne peut être déclenché que sur la branche main/master protégée",
                    "Tous les tests automatisés (unit, integration, e2e) doivent passer avant déploiement",
                    "Un rollback automatique doit s'activer si les healthchecks post-déploiement échouent",
                    "Chaque déploiement doit être tracé avec qui, quand, quoi pour audit"
                ],
                examples: [
                    "Dev fait un merge request sur main → pipeline CI/CD démarre automatiquement",
                    "Tests d'intégration échouent → déploiement bloqué avec notification Slack équipe",
                    "Déploiement réussi mais API répond 500 → rollback automatique vers version précédente",
                    "Feature flag activé → nouvelle fonctionnalité visible pour 10% utilisateurs seulement",
                    "Hotfix critique → déploiement d'urgence avec validation express mais tracé complet"
                ],
                questions: [
                    "Quel est le temps maximum acceptable pour un rollback ?",
                    "Comment gérer les migrations base de données dans le pipeline ?",
                    "Faut-il un mécanisme d'approbation manuelle pour la production ?",
                    "Comment tester les déploiements sur un environnement miroir de production ?"
                ]
            }
        };
        
        const example = examples[type];
        if (!example) return;
        
        // Charger l'exemple avec la nouvelle organisation
        setTimeout(() => {
            this.addCard('story', example.story);
            
            example.rules.forEach(rule => {
                this.addCard('rule', rule);
            });
            
            example.examples.forEach(ex => {
                this.addCard('example', ex);
            });
            
            example.questions.forEach(question => {
                this.addCard('question', question);
            });
        }, 100);
    }
    
    showHelp() {
        document.getElementById('helpModal').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('helpModal').style.display = 'none';
    }
    
    saveToStorage() {
        const data = {
            cards: this.cards,
            votes: Object.fromEntries(this.votes),
            storyPoints: this.currentStoryPoints,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('exampleMapping', JSON.stringify(data));
        } catch (e) {
            console.warn('Impossible de sauvegarder dans localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem('exampleMapping');
            if (data) {
                const parsed = JSON.parse(data);
                
                if (parsed.cards && parsed.cards.length > 0) {
                    parsed.cards.forEach(card => {
                        this.addCard(card.type, card.content, card.id);
                    });
                }
                
                if (parsed.votes) {
                    this.votes = new Map(Object.entries(parsed.votes));
                    this.updateVoteResult();
                }
                
                if (parsed.storyPoints) {
                    this.currentStoryPoints = parsed.storyPoints;
                }
            }
        } catch (e) {
            console.warn('Impossible de charger depuis localStorage:', e);
        }
    }
}

// Initialisation globale
let exampleTool;

document.addEventListener('DOMContentLoaded', () => {
    exampleTool = new ExampleMappingTool();
    
    // Fermer modal en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('helpModal');
        if (e.target === modal) {
            exampleTool.closeModal();
        }
    });
});

// Prévenir la fermeture accidentelle avec des données non sauvegardées
window.addEventListener('beforeunload', (e) => {
    if (exampleTool && exampleTool.cards.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});