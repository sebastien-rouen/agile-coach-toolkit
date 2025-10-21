/**
 * ACHIEVEMENTS MANAGER - Version minimale
 */

export class AchievementsManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    checkAchievements() {
        // TODO: Implémenter la logique des achievements
        console.log('Achievements: À implémenter');
    }

    getProgress() {
        return {
            total: 10,
            unlocked: 0,
            percentage: 0
        };
    }
}
