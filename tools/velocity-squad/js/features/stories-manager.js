/**
 * STORIES MANAGER - Version minimale
 */

export class StoriesManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    addStory(story) {
        console.log('Stories: À implémenter');
        return true;
    }

    getAllStories() {
        return this.data.stories || [];
    }

    getStoriesStats() {
        const stories = this.getAllStories();
        return {
            total: stories.length,
            todo: 0,
            inProgress: 0,
            done: 0,
            totalPoints: 0
        };
    }
}
