/* ===================================
   UTILITY FUNCTIONS
   =================================== */

const Utils = {
    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Format date to locale string
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Sanitize text content
     */
    sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        }[type] || 'ℹ️';
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Confirm action
     */
    confirm(message) {
        return window.confirm(message);
    },

    /**
     * Calculate quadrant based on power and interest
     */
    getQuadrant(power, interest) {
        const powerHigh = power >= 3;
        const interestHigh = interest >= 3;

        if (powerHigh && interestHigh) return 'high-high';
        if (powerHigh && !interestHigh) return 'high-low';
        if (!powerHigh && interestHigh) return 'low-high';
        return 'low-low';
    },

    /**
     * Get angle for domain in circle view
     */
    getDomainAngle(domain) {
        const angles = {
            governance: 0,      // Top
            customer: 90,       // Right
            provider: 180,      // Bottom
            influencer: 270     // Left
        };
        return angles[domain] || 0;
    },

    /**
     * Convert polar to cartesian coordinates
     */
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    },

    /**
     * Download JSON file
     */
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Read JSON file
     */
    readJSONFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Fichier JSON invalide'));
                }
            };
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
            reader.readAsText(file);
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
