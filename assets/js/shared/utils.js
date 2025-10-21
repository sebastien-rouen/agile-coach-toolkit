/**
 * Utilitaires partagés
 */

/**
 * Afficher un toast (notification)
 */
export async function showToast(message, variant = 'primary', duration = 3000) {
    // Attendre que Shoelace soit chargé
    if (typeof customElements !== 'undefined') {
        try {
            await customElements.whenDefined('sl-alert');
        } catch (error) {
            console.warn('⚠️ Shoelace non disponible:', error);
            console.log(`[${variant.toUpperCase()}] ${message}`);
            return;
        }
    } else {
        console.log(`[${variant.toUpperCase()}] ${message}`);
        return;
    }

    const alert = document.createElement('sl-alert');
    alert.variant = variant;
    alert.closable = true;
    alert.duration = duration;
    alert.innerHTML = `
        <sl-icon name="${getToastIcon(variant)}" slot="icon"></sl-icon>
        ${message}
    `;

    document.body.appendChild(alert);
    
    // Utiliser la méthode toast() de Shoelace
    return alert.toast();
}

/**
 * Obtenir l'icône pour un toast
 */
function getToastIcon(variant) {
    const icons = {
        primary: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'x-circle'
    };
    return icons[variant] || 'info-circle';
}

/**
 * Formater une date
 */
export function formatDate(dateString, format = 'short') {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (format === 'short') {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    if (format === 'long') {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    if (format === 'relative') {
        return formatRelativeDate(date);
    }
    
    return date.toLocaleDateString('fr-FR');
}

/**
 * Formater une date relative (il y a X jours)
 */
export function formatRelativeDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`;
    return `Il y a ${Math.floor(days / 365)} ans`;
}

/**
 * Formater une durée
 */
export function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours < 24) {
        return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`;
}

/**
 * Debounce une fonction
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Grouper un tableau par clé
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = typeof key === 'function' ? key(item) : item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Générer un ID unique
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Copier dans le presse-papier
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copié dans le presse-papier', 'success');
        return true;
    } catch (error) {
        console.error('❌ Erreur copie:', error);
        showToast('Erreur lors de la copie', 'danger');
        return false;
    }
}

/**
 * Télécharger un fichier
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Slugifier une chaîne
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Tronquer un texte
 */
export function truncate(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Échapper le HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Parser une query string
 */
export function parseQueryString(queryString = window.location.search) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

console.log('✅ Utils module loaded');
