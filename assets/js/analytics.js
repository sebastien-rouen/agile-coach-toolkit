/**
 * 🔒 Analytics respectueux de la vie privée - Agile Coach Toolkit
 * Collecte locale uniquement, pas de tracking externe
 * by DevBast
 */

class PrivacyAnalytics {
    constructor(options = {}) {
        this.options = {
            respectPrivacy: true,
            storageKey: 'agile_toolkit_analytics',
            maxStorageSize: 1000, // Limite à 1000 entrées
            enablePerformanceMetrics: true,
            enableErrorLogging: true,
            ...options
        };
        
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.isInitialized = false;
        
        // Core Web Vitals observer
        this.performanceObserver = null;
        this.webVitals = {
            FCP: null, // First Contentful Paint
            LCP: null, // Largest Contentful Paint
            FID: null, // First Input Delay
            CLS: null  // Cumulative Layout Shift
        };
    }

    /**
     * Initialise le système d'analytics
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🔒 Analytics privé initialisé');
        
        // Démarrage des métriques de performance
        if (this.options.enablePerformanceMetrics) {
            this.initPerformanceMetrics();
        }
        
        // Gestion des erreurs globales
        if (this.options.enableErrorLogging) {
            this.initErrorLogging();
        }
        
        // Tracking de la session
        this.trackPageView();
        
        // Nettoyage automatique du stockage
        this.cleanupStorage();
        
        // Événements de fermeture de page
        this.initUnloadTracking();
        
        this.isInitialized = true;
    }

    /**
     * Génère un ID de session unique (pas d'identification utilisateur)
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Initialise le tracking des Core Web Vitals
     */
    initPerformanceMetrics() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.webVitals.FCP = Math.round(entry.startTime);
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Performance Observer non supporté:', e);
            }
        }

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.webVitals.LCP = Math.round(lastEntry.startTime);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP Observer non supporté:', e);
            }
        }

        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.webVitals.CLS = Math.round(clsValue * 1000) / 1000;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS Observer non supporté:', e);
            }
        }

        // First Input Delay (via polyfill simple)
        this.initFirstInputDelay();
    }

    /**
     * Mesure le First Input Delay
     */
    initFirstInputDelay() {
        let firstInputTime = null;
        
        const measureFID = (event) => {
            if (firstInputTime) return;
            
            firstInputTime = event.timeStamp;
            const processingStart = performance.now();
            
            // Mesure approximative du FID
            requestAnimationFrame(() => {
                const processingEnd = performance.now();
                this.webVitals.FID = Math.round(processingEnd - processingStart);
                
                // Nettoyage des listeners
                ['click', 'keydown', 'touchstart'].forEach(type => {
                    document.removeEventListener(type, measureFID, { passive: true });
                });
            });
        };

        ['click', 'keydown', 'touchstart'].forEach(type => {
            document.addEventListener(type, measureFID, { passive: true, once: true });
        });
    }

    /**
     * Initialise le logging d'erreurs local
     */
    initErrorLogging() {
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack?.substring(0, 500), // Limite la taille
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent.substring(0, 200) // Limite la taille
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || 'Promise rejection',
                stack: event.reason?.stack?.substring(0, 500),
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        });
    }

    /**
     * Track une vue de page
     */
    trackPageView(page = window.location.pathname) {
        const data = {
            type: 'pageview',
            sessionId: this.sessionId,
            page: page,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || null,
            device: this.getDeviceInfo(),
            performance: this.getBasicPerformanceMetrics()
        };

        this.storeEvent(data);
        console.log('📊 Page vue trackée:', page);
    }

    /**
     * Track un événement personnalisé
     */
    trackEvent(action, category = 'general', label = null, value = null) {
        const data = {
            type: 'event',
            sessionId: this.sessionId,
            action: action,
            category: category,
            label: label,
            value: value,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };

        this.storeEvent(data);
        console.log('📊 Événement tracké:', action, category);
    }

    /**
     * Track l'utilisation d'un outil
     */
    trackToolUsage(toolName, action = 'view') {
        this.trackEvent(action, 'tool', toolName);
    }

    /**
     * Log une erreur localement
     */
    logError(errorData) {
        const data = {
            type: 'error',
            sessionId: this.sessionId,
            ...errorData
        };

        this.storeEvent(data);
        console.warn('🚨 Erreur loggée:', errorData.message);
    }

    /**
     * Obtient les métriques de performance de base
     */
    getBasicPerformanceMetrics() {
        if (!window.performance) return null;

        const navigation = performance.getEntriesByType('navigation')[0];
        if (!navigation) return null;

        return {
            loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            firstByte: Math.round(navigation.responseStart - navigation.fetchStart),
            ...this.webVitals
        };
    }

    /**
     * Obtient les informations de l'appareil (anonymisées)
     */
    getDeviceInfo() {
        return {
            type: this.getDeviceType(),
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine
        };
    }

    /**
     * Détermine le type d'appareil
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * Stocke un événement localement
     */
    storeEvent(data) {
        try {
            const stored = JSON.parse(localStorage.getItem(this.options.storageKey) || '[]');
            stored.push(data);

            // Limite le nombre d'entrées
            if (stored.length > this.options.maxStorageSize) {
                stored.splice(0, stored.length - this.options.maxStorageSize);
            }

            localStorage.setItem(this.options.storageKey, JSON.stringify(stored));
        } catch (e) {
            console.warn('Impossible de stocker les analytics:', e);
        }
    }

    /**
     * Récupère toutes les données stockées
     */
    getStoredData() {
        try {
            return JSON.parse(localStorage.getItem(this.options.storageKey) || '[]');
        } catch (e) {
            console.warn('Impossible de lire les analytics:', e);
            return [];
        }
    }

    /**
     * Génère un rapport de session
     */
    getSessionReport() {
        const data = this.getStoredData();
        const sessionData = data.filter(item => item.sessionId === this.sessionId);
        
        return {
            sessionId: this.sessionId,
            duration: Date.now() - this.startTime,
            pageViews: sessionData.filter(item => item.type === 'pageview').length,
            events: sessionData.filter(item => item.type === 'event').length,
            errors: sessionData.filter(item => item.type === 'error').length,
            performance: this.getBasicPerformanceMetrics(),
            device: this.getDeviceInfo()
        };
    }

    /**
     * Nettoie les anciennes données (garde 30 jours)
     */
    cleanupStorage() {
        try {
            const data = this.getStoredData();
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            const cleaned = data.filter(item => {
                const itemDate = new Date(item.timestamp);
                return itemDate > thirtyDaysAgo;
            });

            localStorage.setItem(this.options.storageKey, JSON.stringify(cleaned));
        } catch (e) {
            console.warn('Nettoyage analytics échoué:', e);
        }
    }

    /**
     * Initialise le tracking de fermeture de page
     */
    initUnloadTracking() {
        const trackUnload = () => {
            const sessionReport = this.getSessionReport();
            
            // Utilise sendBeacon si disponible pour un envoi fiable
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(sessionReport)], { type: 'application/json' });
                // Pas d'envoi externe - juste pour la démo de l'API
                console.log('📊 Rapport de session:', sessionReport);
            }
            
            // Stockage local du rapport de session
            try {
                const reports = JSON.parse(localStorage.getItem('session_reports') || '[]');
                reports.push(sessionReport);
                
                // Garde seulement les 50 derniers rapports
                if (reports.length > 50) {
                    reports.splice(0, reports.length - 50);
                }
                
                localStorage.setItem('session_reports', JSON.stringify(reports));
            } catch (e) {
                console.warn('Impossible de sauver le rapport de session:', e);
            }
        };

        // Événements de fermeture
        window.addEventListener('beforeunload', trackUnload);
        window.addEventListener('pagehide', trackUnload);
        
        // Visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                trackUnload();
            }
        });
    }

    /**
     * Exporte les données pour le dashboard
     */
    exportForDashboard() {
        const data = this.getStoredData();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Filtre les données des 7 derniers jours
        const recentData = data.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate > sevenDaysAgo;
        });

        // Agrégation pour le dashboard
        const pageViews = recentData.filter(item => item.type === 'pageview');
        const events = recentData.filter(item => item.type === 'event');
        const errors = recentData.filter(item => item.type === 'error');

        // Pages populaires
        const pageStats = {};
        pageViews.forEach(view => {
            pageStats[view.page] = (pageStats[view.page] || 0) + 1;
        });

        // Outils utilisés
        const toolStats = {};
        events.filter(event => event.category === 'tool').forEach(event => {
            toolStats[event.label] = (toolStats[event.label] || 0) + 1;
        });

        // Statistiques par jour
        const dailyStats = {};
        pageViews.forEach(view => {
            const date = new Date(view.timestamp).toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });

        // Performance moyenne
        const performanceMetrics = pageViews
            .filter(view => view.performance)
            .map(view => view.performance);

        const avgPerformance = performanceMetrics.length > 0 ? {
            loadTime: Math.round(performanceMetrics.reduce((sum, p) => sum + (p.loadTime || 0), 0) / performanceMetrics.length),
            FCP: Math.round(performanceMetrics.reduce((sum, p) => sum + (p.FCP || 0), 0) / performanceMetrics.length),
            LCP: Math.round(performanceMetrics.reduce((sum, p) => sum + (p.LCP || 0), 0) / performanceMetrics.length),
            CLS: Math.round((performanceMetrics.reduce((sum, p) => sum + (p.CLS || 0), 0) / performanceMetrics.length) * 1000) / 1000
        } : null;

        return {
            generatedAt: now.toISOString(),
            totalVisits: pageViews.length,
            uniqueSessions: new Set(pageViews.map(view => view.sessionId)).size,
            pages: Object.entries(pageStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([page, count]) => ({ page, count })),
            tools: Object.entries(toolStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([tool, count]) => ({ tool, count })),
            dailyVisits: Array.from({ length: 7 }, (_, i) => {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
                    .toISOString().split('T')[0];
                return {
                    date,
                    visits: dailyStats[date] || 0
                };
            }).reverse(),
            performance: avgPerformance,
            errors: errors.length,
            lastVisit: pageViews.length > 0 ? pageViews[pageViews.length - 1].timestamp : null
        };
    }

    /**
     * Sauvegarde les données pour le dashboard existant
     */
    saveToDashboard() {
        const dashboardData = this.exportForDashboard();
        
        try {
            // Mise à jour du fichier JSON pour le dashboard existant
            localStorage.setItem('dashboard_data', JSON.stringify(dashboardData));
            console.log('📊 Données exportées pour le dashboard');
            
            // Déclenche un événement personnalisé pour notifier le dashboard
            window.dispatchEvent(new CustomEvent('analyticsUpdated', { 
                detail: dashboardData 
            }));
            
        } catch (e) {
            console.warn('Impossible de sauver pour le dashboard:', e);
        }
    }
}

// Instance globale
window.PrivacyAnalytics = PrivacyAnalytics;

// Auto-initialisation si le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.analytics) {
            window.analytics = new PrivacyAnalytics();
            window.analytics.init();
        }
    });
} else {
    if (!window.analytics) {
        window.analytics = new PrivacyAnalytics();
        window.analytics.init();
    }
}

export default PrivacyAnalytics;