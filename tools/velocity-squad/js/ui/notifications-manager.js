/**
 * ========================================
 * NOTIFICATIONS MANAGER
 * ========================================
 * Gestion des notifications toast
 */

export class NotificationsManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.initContainer();
    }

    /**
     * Initialiser le conteneur de notifications
     */
    initContainer() {
        // Vérifier si le conteneur existe déjà
        this.container = document.getElementById('notificationsContainer');
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationsContainer';
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Afficher une notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type (success, error, warning, info)
     * @param {number} duration - Durée en ms (0 = permanent)
     * @returns {string} ID de la notification
     */
    show(message, type = 'info', duration = 3000) {
        const id = this.generateId();
        const notification = this.createNotification(id, message, type);
        
        this.notifications.push({ id, element: notification, type });
        this.container.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-fermeture
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    /**
     * Créer un élément de notification
     * @param {string} id - ID de la notification
     * @param {string} message - Message
     * @param {string} type - Type
     * @returns {HTMLElement} Élément de notification
     */
    createNotification(id, message, type) {
        const notification = document.createElement('div');
        notification.id = `notification_${id}`;
        notification.className = `notification notification-${type}`;

        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="window.notificationsManager.hide('${id}')">&times;</button>
        `;

        return notification;
    }

    /**
     * Obtenir l'icône selon le type
     * @param {string} type - Type de notification
     * @returns {string} Icône
     */
    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    /**
     * Masquer une notification
     * @param {string} id - ID de la notification
     */
    hide(id) {
        const notification = document.getElementById(`notification_${id}`);
        if (!notification) return;

        notification.classList.remove('show');
        notification.classList.add('hide');

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 300);
    }

    /**
     * Afficher une notification de succès
     * @param {string} message - Message
     * @param {number} duration - Durée
     * @returns {string} ID de la notification
     */
    showSuccess(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Afficher une notification d'erreur
     * @param {string} message - Message
     * @param {number} duration - Durée
     * @returns {string} ID de la notification
     */
    showError(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Afficher une notification d'avertissement
     * @param {string} message - Message
     * @param {number} duration - Durée
     * @returns {string} ID de la notification
     */
    showWarning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Afficher une notification d'information
     * @param {string} message - Message
     * @param {number} duration - Durée
     * @returns {string} ID de la notification
     */
    showInfo(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Afficher une notification d'achievement
     * @param {Object} achievement - Achievement débloqué
     */
    showAchievement(achievement) {
        const message = `
            <div class="achievement-notification">
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-content">
                    <strong>Achievement débloqué !</strong>
                    <div>${achievement.title}</div>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;
        return this.show(message, 'success', 5000);
    }

    /**
     * Afficher une notification de progression
     * @param {string} message - Message
     * @param {number} progress - Progression (0-100)
     * @returns {string} ID de la notification
     */
    showProgress(message, progress = 0) {
        const id = this.generateId();
        const notification = document.createElement('div');
        notification.id = `notification_${id}`;
        notification.className = 'notification notification-progress';

        notification.innerHTML = `
            <div class="notification-message">${message}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
        `;

        this.notifications.push({ id, element: notification, type: 'progress' });
        this.container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        return id;
    }

    /**
     * Mettre à jour une notification de progression
     * @param {string} id - ID de la notification
     * @param {number} progress - Nouvelle progression (0-100)
     * @param {string} message - Nouveau message (optionnel)
     */
    updateProgress(id, progress, message = null) {
        const notification = document.getElementById(`notification_${id}`);
        if (!notification) return;

        const progressFill = notification.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        if (message) {
            const messageEl = notification.querySelector('.notification-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }

        // Fermer automatiquement à 100%
        if (progress >= 100) {
            setTimeout(() => {
                this.hide(id);
            }, 1000);
        }
    }

    /**
     * Masquer toutes les notifications
     */
    hideAll() {
        this.notifications.forEach(n => {
            this.hide(n.id);
        });
    }

    /**
     * Obtenir le nombre de notifications actives
     * @returns {number} Nombre de notifications
     */
    getCount() {
        return this.notifications.length;
    }

    /**
     * Générer un ID unique
     * @returns {string} ID unique
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Vérifier si une notification existe
     * @param {string} id - ID de la notification
     * @returns {boolean} True si existe
     */
    exists(id) {
        return this.notifications.some(n => n.id === id);
    }

    /**
     * Obtenir une notification par ID
     * @param {string} id - ID de la notification
     * @returns {Object|null} Notification ou null
     */
    getNotification(id) {
        return this.notifications.find(n => n.id === id) || null;
    }
}
