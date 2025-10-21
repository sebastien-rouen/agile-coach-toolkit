/**
 * Templates de sessions pré-configurées pour Delegation Poker
 * Basés sur les exemples de la migration 1757700010_seed_examples.js
 */

const DELEGATION_TEMPLATES = {
    product: {
        name: "Équipe Produit - Sprint Planning",
        participants: ["Alice (PO)", "Bob (Dev)", "Charlie (SM)"],
        decisions: [
            {
                text: "Choix des technologies pour un nouveau composant",
                category: "technical"
            },
            {
                text: "Priorisation des user stories",
                category: "product"
            },
            {
                text: "Organisation des horaires de travail",
                category: "organizational"
            },
            {
                text: "Définition des rôles dans l'équipe",
                category: "team"
            },
            {
                text: "Budget alloué aux formations",
                category: "other"
            }
        ]
    },
    
    rh: {
        name: "Service RH - Processus de Recrutement",
        participants: ["Marie (DRH)", "Thomas (Manager)", "Sophie (Recruteur)", "Luc (Opérationnel)"],
        decisions: [
            {
                text: "Validation finale des candidatures",
                category: "organizational"
            },
            {
                text: "Définition des grilles salariales",
                category: "other"
            },
            {
                text: "Choix des outils de sourcing",
                category: "technical"
            },
            {
                text: "Organisation des entretiens techniques",
                category: "organizational"
            },
            {
                text: "Décision d'embauche immédiate",
                category: "team"
            },
            {
                text: "Négociation des avantages sociaux",
                category: "other"
            }
        ]
    },
    
    medical: {
        name: "Service Urgences - Protocoles de Soins",
        participants: ["Dr. Dubois (Chef)", "Infirmière Claire", "Dr. Martin (Interne)", "Aide-soignant Paul"],
        decisions: [
            {
                text: "Prescription de médicaments hors AMM",
                category: "other"
            },
            {
                text: "Triage des patients en cas d'affluence",
                category: "organizational"
            },
            {
                text: "Demande d'examens complémentaires urgents",
                category: "technical"
            },
            {
                text: "Transfert vers un service spécialisé",
                category: "organizational"
            },
            {
                text: "Gestion des stocks de matériel médical",
                category: "other"
            },
            {
                text: "Organisation des gardes et astreintes",
                category: "team"
            },
            {
                text: "Protocole de réanimation d'urgence",
                category: "technical"
            }
        ]
    },
    
    military: {
        name: "Unité Tactique - Préparation Mission",
        participants: ["Capitaine Moreau", "Lieutenant Durand", "Sergent-Chef Petit", "Caporal Bernard"],
        decisions: [
            {
                text: "Engagement au combat en situation critique",
                category: "other"
            },
            {
                text: "Choix de l'itinéraire de patrouille",
                category: "organizational"
            },
            {
                text: "Utilisation de l'équipement de communication",
                category: "technical"
            },
            {
                text: "Répartition des rôles dans l'escouade",
                category: "team"
            },
            {
                text: "Demande de soutien aérien",
                category: "other"
            },
            {
                text: "Gestion des permissions et repos",
                category: "organizational"
            },
            {
                text: "Maintenance préventive du matériel",
                category: "technical"
            },
            {
                text: "Protocole d'évacuation sanitaire",
                category: "organizational"
            }
        ]
    },
    
    'digital-license': {
        name: "Permis de Conduire Numérique - MVP",
        participants: ["Emma (Chef Projet)", "Lucas (Dev Backend)", "Chloé (UX Designer)", "Antoine (Sécurité)"],
        decisions: [
            {
                text: "Architecture de sécurité et chiffrement",
                category: "technical"
            },
            {
                text: "Choix du fournisseur d'identité numérique",
                category: "technical"
            },
            {
                text: "Priorisation des fonctionnalités du MVP",
                category: "product"
            },
            {
                text: "Validation des maquettes UX/UI",
                category: "product"
            },
            {
                text: "Stratégie de déploiement progressif",
                category: "organizational"
            },
            {
                text: "Gestion des incidents de sécurité",
                category: "technical"
            },
            {
                text: "Communication avec les partenaires institutionnels",
                category: "other"
            },
            {
                text: "Organisation des sprints et rétrospectives",
                category: "team"
            },
            {
                text: "Conformité RGPD et protection des données",
                category: "other"
            }
        ]
    }
};

/**
 * Charge un template dans l'application
 * @param {string} templateKey - Clé du template (product, rh, medical, military, digital-license)
 */
function loadTemplate(templateKey) {
    const template = DELEGATION_TEMPLATES[templateKey];
    
    if (!template) {
        console.error('Template introuvable:', templateKey);
        return;
    }
    
    // Pré-remplir le formulaire de nouvelle session avec les données du template
    document.getElementById('inputSessionName').value = template.name;
    document.getElementById('inputParticipants').value = template.participants.join('\n');
    
    // Stocker les décisions du template pour les créer après la session
    window.templateDecisions = template.decisions;
    
    // Ouvrir la modale de nouvelle session
    openModal('modalNewSession');
    
    // Afficher une notification
    showNotification(`📋 Template "${template.name}" chargé avec ${template.decisions.length} décisions`, 'info');
}

/**
 * Affiche une notification temporaire
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'info' ? 'var(--primary)' : 'var(--success)'};
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialiser l'écouteur d'événement pour le sélecteur de template
document.addEventListener('DOMContentLoaded', () => {
    const selectTemplate = document.getElementById('selectTemplate');
    
    if (selectTemplate) {
        selectTemplate.addEventListener('change', (e) => {
            const templateKey = e.target.value;
            
            if (templateKey) {
                loadTemplate(templateKey);
                // Réinitialiser le select
                e.target.value = '';
            }
        });
    }
});
