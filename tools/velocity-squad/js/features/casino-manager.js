/**
 * CASINO MANAGER - Version minimale
 */

export class CasinoManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    initCasino() {
        console.log('Casino: À implémenter');
    }

    startSession(stories) {
        console.log('Casino session: À implémenter');
    }

    getCasinoStats() {
        return {
            totalUsage: this.data.casinoUsage || 0,
            currentSession: null
        };
    }
}
