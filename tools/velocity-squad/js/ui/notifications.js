/**
 * ========================================
 * NOTIFICATIONS
 * ========================================
 * Gestion des notifications toast
 */

export class Notifications {
    constructor() {
        this.queue = [];
        this.currentNotification = null;
    }

    /**
     * Afficher une notification de succès
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée en ms
     */
    showSuccess(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    /**
     * Afficher une notification d'erreur
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée en ms
     */
    showError(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    /**
     * Afficher une notification d'information
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée en ms
     */
    showInfo(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    /**
     * Afficher une notification d'avertissement
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée en ms
     */
    showWarning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    }

    /**
     * Afficher une notification
     * @param {string} message - Message
     * @param {string} type - Type (success, error, info, warning)
     * @param {number} duration - Durée en ms
     */
    show(message, type = 'info', duration = 3000) {
        const notification = {
            message,
            type,
            duration,
            id: Date.now()
        };

        this.queue.push(notification);
        
        if (!this.currentNotification) {
            this.processQueue();
        }
    }

    /**
     * Traiter la file d'attente
     */
    processQueue() {
        if (this.queue.length === 0) {
            this.currentNotification = null;
            return;
        }

        const notification = this.queue.shift();
        this.currentNotification = notification;
        this.display(notification);
    }

    /**
     * Afficher une notification
     * @param {Object} notification - Notification à afficher
     */
    display(notification) {
        // Créer l'élément
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.textContent = notification.message;
        element.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // Couleurs selon le type
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #F44336, #D32F2F)',
            warning: 'linear-gradient(135deg, #FF9800, #F57C00)',
            info: 'linear-gradient(135deg, #2196F3, #1976D2)'
        };

        element.style.background = colors[notification.type] || colors.info;
        element.style.color = 'white';

        // Ajouter au DOM
        document.body.appendChild(element);

        // Retirer après la durée
        setTimeout(() => {
            element.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.processQueue();
            }, 300);
        }, notification.duration);
    }

    /**
     * Afficher une notification d'achievement
     * @param {Object} achievement - Achievement débloqué
     */
    showAchievement(achievement) {
        const element = document.createElement('div');
        element.className = 'achievement-notification';
        element.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div>
                    <h3>${achievement.title || 'Achievement Débloqué !'}</h3>
                    <p>${achievement.description || ''}</p>
                </div>
            </div>
        `;

        element.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            max-width: 400px;
            transition: right 0.5s ease;
        `;

        document.body.appendChild(element);

        // Animation d'entrée
        setTimeout(() => {
            element.style.right = '20px';
        }, 100);

        // Animation de sortie
        setTimeout(() => {
            element.style.right = '-400px';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 500);
        }, 5000);
    }

    /**
     * Effacer toutes les notifications
     */
    clearAll() {
        this.queue = [];
        this.currentNotification = null;
        
        // Retirer toutes les notifications du DOM
        const notifications = document.querySelectorAll('.notification, .achievement-notification');
        notifications.forEach(notif => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        });
    }
}
