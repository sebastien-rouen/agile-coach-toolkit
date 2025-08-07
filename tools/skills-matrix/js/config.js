/**
 * Skills Matrix - Configuration centralisée
 */

const CONFIG = {
    // Limites de validation
    validation: {
        maxNameLength: 50,
        maxSkills: 20,
        maxMembers: 50,
        maxAppetences: 10,
        maxOwnerships: 10
    },
    
    // Niveaux de compétence
    levels: {
        min: 0,
        max: 4,
        labels: {
            0: 'Non évalué',
            1: 'Débutant',
            2: 'En apprentissage',
            3: 'Compétent',
            4: 'Expert'
        },
        descriptions: {
            0: '-',
            1: 'Formation nécessaire',
            2: 'Support régulier requis',
            3: 'Support occasionnel',
            4: 'Travail en autonomie'
        }
    },
    
    // Configuration du localStorage
    storage: {
        key: 'skillsMatrixData',
        autoSave: true,
        saveDelay: 500 // ms
    },
    
    // Configuration des notifications
    notifications: {
        duration: 3000, // ms
        position: 'top-right'
    },
    
    // Configuration du radar
    radar: {
        canvasSize: 800,
        minRadius: 80,
        gridLevels: 5
    },
    
    // Messages d'erreur
    messages: {
        errors: {
            nameEmpty: 'Le nom ne peut pas être vide.',
            nameTooLong: 'Le nom est trop long (maximum {max} caractères).',
            nameExists: 'Un élément avec ce nom existe déjà.',
            invalidChars: 'Le nom contient des caractères non autorisés.',
            saveError: 'Impossible de sauvegarder les données.',
            loadError: 'Impossible de charger les données sauvegardées.',
            exportError: 'Impossible d\'exporter les données.'
        },
        success: {
            saved: '💾 Données sauvegardées',
            exported: '📥 Export réussi',
            deleted: '🗑️ Élément supprimé',
            added: '✅ Élément ajouté'
        },
        confirmations: {
            reset: '⚠️ Réinitialiser toute la matrice ? Cette action est irréversible.',
            delete: 'Supprimer {name} ?',
            loadTemplate: 'Charger le modèle "{name}" ? Cela remplacera les données actuelles.'
        }
    }
};

// Rendre la configuration en lecture seule
Object.freeze(CONFIG);

console.log('✅ config.js chargé');
