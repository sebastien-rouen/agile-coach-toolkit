/**
 * Planning Poker - UX Enhancements
 * Améliorations de l'expérience utilisateur pour les cartes et la toolbar
 */

class PlanningPokerUX {
    constructor() {
        this.selectedCard = null;
        this.cardAnimationTimeout = null;
        this.init();
    }

    init() {
        this.setupCardInteractions();
        this.setupToolbarEnhancements();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
        this.setupResponsiveHandling();
    }

    /**
     * Configuration des interactions avec les cartes
     */
    setupCardInteractions() {
        // Observer pour les cartes ajoutées dynamiquement
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('voting-card')) {
                        this.enhanceCard(node);
                    }
                });
            });
        });

        const cardsContainer = document.getElementById('cardsContainer');
        if (cardsContainer) {
            observer.observe(cardsContainer, { childList: true });
            
            // Améliorer les cartes existantes
            cardsContainer.querySelectorAll('.voting-card').forEach(card => {
                this.enhanceCard(card);
            });
        }
    }

    /**
     * Amélioration d'une carte individuelle
     */
    enhanceCard(card) {
        // Ajouter les attributs d'accessibilité
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-pressed', 'false');
        
        const value = card.dataset.value || card.textContent.trim();
        card.setAttribute('aria-label', `Voter pour ${value}`);
        card.setAttribute('title', `Cliquez pour voter ${value}`);

        // Ajouter les événements
        card.addEventListener('click', (e) => this.handleCardClick(e, card));
        card.addEventListener('keydown', (e) => this.handleCardKeydown(e, card));
        card.addEventListener('mouseenter', (e) => this.handleCardHover(e, card));
        card.addEventListener('mouseleave', (e) => this.handleCardLeave(e, card));
        card.addEventListener('focus', (e) => this.handleCardFocus(e, card));
        card.addEventListener('blur', (e) => this.handleCardBlur(e, card));

        // Ajouter l'effet de ripple
        this.addRippleEffect(card);
    }

    /**
     * Gestion du clic sur une carte
     */
    handleCardClick(event, card) {
        event.preventDefault();
        
        // Désélectionner l'ancienne carte
        if (this.selectedCard && this.selectedCard !== card) {
            this.selectedCard.classList.remove('selected');
            this.selectedCard.setAttribute('aria-pressed', 'false');
        }

        // Sélectionner la nouvelle carte
        const isSelected = card.classList.contains('selected');
        
        if (isSelected) {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
            this.selectedCard = null;
        } else {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            this.selectedCard = card;
            
            // Animation de sélection
            this.animateCardSelection(card);
        }

        // Créer l'effet ripple
        this.createRipple(event, card);

        // Feedback haptique sur mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }

        // Notifier la sélection
        this.notifyCardSelection(card, !isSelected);
    }

    /**
     * Gestion des touches clavier sur les cartes
     */
    handleCardKeydown(event, card) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleCardClick(event, card);
        }
    }

    /**
     * Gestion du survol des cartes
     */
    handleCardHover(event, card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = 'translateY(-8px) scale(1.05)';
        }
    }

    /**
     * Gestion de la sortie du survol
     */
    handleCardLeave(event, card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = '';
        }
    }

    /**
     * Gestion du focus sur les cartes
     */
    handleCardFocus(event, card) {
        card.style.outline = '3px solid var(--primary-color)';
        card.style.outlineOffset = '2px';
    }

    /**
     * Gestion de la perte de focus
     */
    handleCardBlur(event, card) {
        card.style.outline = '';
        card.style.outlineOffset = '';
    }

    /**
     * Animation de sélection de carte
     */
    animateCardSelection(card) {
        // Animation de "pop"
        card.style.transform = 'translateY(-8px) scale(1.15)';
        
        setTimeout(() => {
            card.style.transform = 'translateY(-8px) scale(1.08)';
        }, 150);

        // Effet de brillance
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            transition: left 0.6s ease;
            pointer-events: none;
        `;
        
        card.appendChild(shine);
        
        setTimeout(() => {
            shine.style.left = '100%';
        }, 50);
        
        setTimeout(() => {
            shine.remove();
        }, 650);
    }

    /**
     * Ajouter l'effet ripple à une carte
     */
    addRippleEffect(card) {
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
    }

    /**
     * Créer l'effet ripple
     */
    createRipple(event, card) {
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        card.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Notifier la sélection de carte
     */
    notifyCardSelection(card, isSelected) {
        const value = card.dataset.value || card.textContent.trim();
        
        // Créer une notification visuelle
        const notification = document.createElement('div');
        notification.textContent = isSelected ? `Voté: ${value}` : 'Vote annulé';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isSelected ? 'var(--success-color)' : 'var(--warning-color)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        // Ajouter l'animation
        if (!document.querySelector('#notification-animation')) {
            const style = document.createElement('style');
            style.id = 'notification-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    /**
     * Améliorations de la toolbar
     */
    setupToolbarEnhancements() {
        const toolbar = document.querySelector('.toolbar');
        if (!toolbar) return;

        // Ajouter un indicateur de scroll si nécessaire
        this.addScrollIndicator(toolbar);

        // Améliorer les boutons
        toolbar.querySelectorAll('.btn').forEach(btn => {
            this.enhanceButton(btn);
        });

        // Améliorer le sélecteur
        const selector = toolbar.querySelector('.card-set-selector');
        if (selector) {
            this.enhanceSelector(selector);
        }
    }

    /**
     * Ajouter un indicateur de scroll pour la toolbar
     */
    addScrollIndicator(toolbar) {
        if (toolbar.scrollWidth > toolbar.clientWidth) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                width: 20px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8));
                pointer-events: none;
                z-index: 1;
            `;
            toolbar.style.position = 'relative';
            toolbar.appendChild(indicator);

            // Masquer l'indicateur quand on scroll à la fin
            toolbar.addEventListener('scroll', () => {
                const isAtEnd = toolbar.scrollLeft >= toolbar.scrollWidth - toolbar.clientWidth - 5;
                indicator.style.opacity = isAtEnd ? '0' : '1';
            });
        }
    }

    /**
     * Améliorer un bouton
     */
    enhanceButton(button) {
        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-1px)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.transform = '';
            }
        });

        button.addEventListener('mousedown', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(0)';
            }
        });

        button.addEventListener('mouseup', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(-1px)';
            }
        });
    }

    /**
     * Améliorer le sélecteur
     */
    enhanceSelector(selector) {
        selector.addEventListener('change', () => {
            // Animation de changement
            selector.style.transform = 'scale(1.05)';
            setTimeout(() => {
                selector.style.transform = '';
            }, 150);
        });
    }

    /**
     * Navigation clavier
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            const cards = Array.from(document.querySelectorAll('.voting-card'));
            const currentIndex = cards.findIndex(card => card === document.activeElement);

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    const nextIndex = (currentIndex + 1) % cards.length;
                    cards[nextIndex]?.focus();
                    break;

                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    const prevIndex = currentIndex <= 0 ? cards.length - 1 : currentIndex - 1;
                    cards[prevIndex]?.focus();
                    break;

                case 'Home':
                    event.preventDefault();
                    cards[0]?.focus();
                    break;

                case 'End':
                    event.preventDefault();
                    cards[cards.length - 1]?.focus();
                    break;
            }
        });
    }

    /**
     * Améliorations d'accessibilité
     */
    setupAccessibility() {
        // Ajouter des annonces pour les lecteurs d'écran
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);
        this.announcer = announcer;

        // Annoncer les changements de cartes
        const cardsContainer = document.getElementById('cardsContainer');
        if (cardsContainer) {
            const observer = new MutationObserver(() => {
                const cardCount = cardsContainer.querySelectorAll('.voting-card').length;
                this.announce(`${cardCount} cartes de vote disponibles`);
            });
            observer.observe(cardsContainer, { childList: true });
        }
    }

    /**
     * Annoncer un message aux lecteurs d'écran
     */
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
        }
    }

    /**
     * Gestion responsive
     */
    setupResponsiveHandling() {
        const handleResize = () => {
            const toolbar = document.querySelector('.toolbar');
            const cardsContainer = document.getElementById('cardsContainer');

            // Ajuster la toolbar sur mobile
            if (window.innerWidth < 768) {
                if (toolbar) {
                    toolbar.style.justifyContent = 'flex-start';
                }
            } else {
                if (toolbar) {
                    toolbar.style.justifyContent = '';
                }
            }

            // Ajuster les cartes
            if (cardsContainer && window.innerWidth < 480) {
                cardsContainer.style.maxWidth = '300px';
            } else if (cardsContainer) {
                cardsContainer.style.maxWidth = '';
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Appel initial
    }

    /**
     * Réinitialiser la sélection
     */
    resetSelection() {
        if (this.selectedCard) {
            this.selectedCard.classList.remove('selected');
            this.selectedCard.setAttribute('aria-pressed', 'false');
            this.selectedCard = null;
        }
    }

    /**
     * Obtenir la carte sélectionnée
     */
    getSelectedCard() {
        return this.selectedCard;
    }

    /**
     * Sélectionner une carte par valeur
     */
    selectCardByValue(value) {
        const card = document.querySelector(`.voting-card[data-value="${value}"]`);
        if (card) {
            this.handleCardClick({ preventDefault: () => {}, clientX: 0, clientY: 0 }, card);
        }
    }
}

// Initialiser les améliorations UX
document.addEventListener('DOMContentLoaded', () => {
    window.planningPokerUX = new PlanningPokerUX();
});

// Export pour usage externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlanningPokerUX;
}