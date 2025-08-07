/**
 * 🎲 PLANNING POKER - SESSION ENHANCEMENTS
 * Améliorations UX pour la gestion des sessions
 * by DevBast - BastaLab
 */

// Améliorer l'expérience de création de session
document.addEventListener('DOMContentLoaded', function() {
    
    // Animation d'apparition pour la page de création
    const roomCreation = document.getElementById('roomCreation');
    if (roomCreation && roomCreation.style.display !== 'none') {
        roomCreation.style.opacity = '0';
        roomCreation.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            roomCreation.style.transition = 'all 0.6s ease';
            roomCreation.style.opacity = '1';
            roomCreation.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animation pour l'interface de session
    const sessionInterface = document.getElementById('sessionInterface');
    if (sessionInterface && sessionInterface.style.display !== 'none') {
        sessionInterface.style.opacity = '0';
        sessionInterface.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            sessionInterface.style.transition = 'all 0.6s ease';
            sessionInterface.style.opacity = '1';
            sessionInterface.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Améliorer le formulaire de création
    const facilitatorInput = document.getElementById('facilitatorName');
    const sessionNameInput = document.getElementById('sessionName');
    
    if (facilitatorInput) {
        // Auto-complétion basée sur le localStorage
        const savedName = localStorage.getItem('poker_facilitator_name');
        if (savedName) {
            facilitatorInput.value = savedName;
        }
        
        // Sauvegarder le nom pour la prochaine fois
        facilitatorInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                localStorage.setItem('poker_facilitator_name', this.value.trim());
            }
        });
        
        // Animation du placeholder
        facilitatorInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        facilitatorInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });
    }
    
    if (sessionNameInput) {
        // Suggestions de noms de session
        const suggestions = [
            'Sprint Planning - Sprint 12',
            'Estimation Epic Utilisateur',
            'Refinement Backlog Q1',
            'Stories MVP v2.0',
            'Estimation Features Mobile'
        ];
        
        sessionNameInput.addEventListener('focus', function() {
            if (!this.value.trim()) {
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                this.placeholder = randomSuggestion;
            }
        });
    }
    
    // Améliorer le lien de partage
    const shareLink = document.getElementById('shareLink');
    if (shareLink) {
        // Sélection automatique au clic
        shareLink.addEventListener('click', function() {
            this.select();
            this.setSelectionRange(0, 99999); // Pour mobile
        });
        
        // Animation de feedback lors de la copie
        shareLink.addEventListener('copy', function() {
            this.style.background = '#d4edda';
            this.style.borderColor = '#28a745';
            
            setTimeout(() => {
                this.style.background = '';
                this.style.borderColor = '';
            }, 1000);
        });
    }
    
    // Améliorer les cartes de participants
    function enhanceParticipantCards() {
        const participantCards = document.querySelectorAll('.participant-card');
        
        participantCards.forEach((card, index) => {
            // Animation d'apparition décalée
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 100);
            
            // Effet de pulsation pour les participants qui ont voté
            if (card.classList.contains('has-voted')) {
                card.addEventListener('mouseenter', function() {
                    this.style.animation = 'pulse 0.6s ease';
                });
                
                card.addEventListener('animationend', function() {
                    this.style.animation = '';
                });
            }
        });
    }
    
    // Observer les changements dans la liste des participants
    const participantsGrid = document.getElementById('participantsGrid');
    if (participantsGrid) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    enhanceParticipantCards();
                }
            });
        });
        
        observer.observe(participantsGrid, { childList: true, subtree: true });
    }
    
    // Améliorer les questions dans le panel de discussion
    function enhanceQuestions() {
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach((item, index) => {
            // Animation d'apparition
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    // Observer les changements dans la liste des questions
    const questionsList = document.getElementById('questionsList');
    if (questionsList) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    enhanceQuestions();
                }
            });
        });
        
        observer.observe(questionsList, { childList: true, subtree: true });
    }
    
    // Améliorer l'input de discussion
    const questionInput = document.getElementById('questionInput');
    if (questionInput) {
        // Compteur de caractères
        const maxLength = 200;
        
        questionInput.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            let counter = this.parentElement.querySelector('.char-counter');
            
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    position: absolute;
                    bottom: -20px;
                    right: 0;
                    font-size: 12px;
                    color: #6c757d;
                `;
                this.parentElement.style.position = 'relative';
                this.parentElement.appendChild(counter);
            }
            
            counter.textContent = `${remaining} caractères restants`;
            
            if (remaining < 20) {
                counter.style.color = '#dc3545';
            } else if (remaining < 50) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#6c757d';
            }
        });
        
        // Auto-resize
        questionInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Améliorer les modales
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                // Animation de fermeture
                const content = this.querySelector('.modal-content');
                content.style.animation = 'modalSlideOut 0.3s ease forwards';
                
                setTimeout(() => {
                    this.style.display = 'none';
                    content.style.animation = '';
                    
                    // Réinitialiser l'état de la modale de partage
                    if (this.id === 'shareModal') {
                        const container = this.querySelector('.share-link-input');
                        if (container) {
                            container.classList.remove('copied');
                        }
                    }
                }, 300);
            }
        });
    });
    
    // Ajouter les animations CSS manquantes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(-50px) scale(0.95);
            }
        }
        
        .form-group.focused label {
            color: var(--primary-color);
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        
        .char-counter {
            transition: color 0.3s ease;
        }
        
        .discussion-input {
            position: relative;
        }
        
        .question-item:hover {
            transform: translateX(4px);
        }
        
        .participant-card:hover {
            transform: translateY(-2px) translateX(4px);
        }
        
        .share-link input:focus {
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
});

// Fonction utilitaire pour copier du texte
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            try {
                document.execCommand('copy');
                textArea.remove();
                resolve();
            } catch (err) {
                textArea.remove();
                reject(err);
            }
        });
    }
}

// Améliorer la fonction de copie du lien dans la classe principale
if (typeof window !== 'undefined') {
    window.enhancedCopyShareLink = function() {
        const shareLink = document.getElementById('shareLink');
        const copyBtn = shareLink.parentElement.querySelector('.btn');
        const container = shareLink.parentElement;
        
        copyToClipboard(shareLink.value)
            .then(() => {
                // Animation de succès
                container.classList.add('copied');
                copyBtn.textContent = '✅';
                
                // Notification
                if (window.poker) {
                    window.poker.showNotification('Lien copié dans le presse-papiers !', 'success');
                }
                
                // Réinitialiser après 2 secondes
                setTimeout(() => {
                    container.classList.remove('copied');
                    copyBtn.textContent = '📋';
                }, 2000);
            })
            .catch(() => {
                // Animation d'erreur
                copyBtn.style.background = '#dc3545';
                copyBtn.textContent = '❌';
                
                setTimeout(() => {
                    copyBtn.style.background = '';
                    copyBtn.textContent = '📋';
                }, 2000);
                
                if (window.poker) {
                    window.poker.showNotification('Impossible de copier le lien', 'error');
                }
            });
    };
}