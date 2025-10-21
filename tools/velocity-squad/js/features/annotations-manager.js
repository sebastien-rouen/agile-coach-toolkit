/**
 * ANNOTATIONS MANAGER - Version minimale
 */

export class AnnotationsManager {
    constructor(data, notifications) {
        this.data = data;
        this.notifications = notifications;
    }

    addAnnotation(annotation) {
        console.log('Annotations: À implémenter');
        return true;
    }

    getAnnotations(sprintIndex = null) {
        return this.data.annotations || [];
    }
}
