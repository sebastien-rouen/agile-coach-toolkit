/* ===================================
   TEMPLATES
   =================================== */

const Templates = {
    data: {
        'it-ecommerce-scrum': {
            name: 'Équipe IT E-commerce SCRUM',
            stakeholders: [
                { name: 'CEO', role: 'Directeur Général', power: 5, interest: 4, influence: 'vital', domain: 'governance' },
                { name: 'Product Owner', role: 'Product Owner', power: 4, interest: 5, influence: 'vital', domain: 'customer' },
                { name: 'Scrum Master', role: 'Scrum Master', power: 3, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Tech Lead', role: 'Lead Développeur', power: 4, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Développeur Frontend', role: 'Développeur', power: 2, interest: 4, influence: 'good', domain: 'provider' },
                { name: 'Développeur Backend', role: 'Développeur', power: 2, interest: 4, influence: 'good', domain: 'provider' },
                { name: 'Client VIP', role: 'Client Premium', power: 3, interest: 5, influence: 'necessary', domain: 'customer' },
                { name: 'Fournisseur Paiement', role: 'Stripe/PayPal', power: 3, interest: 2, influence: 'good', domain: 'provider' }
            ]
        },
        'it-ecommerce-kanban': {
            name: 'Équipe IT E-commerce KANBAN',
            stakeholders: [
                { name: 'Team Lead', role: 'Chef d\'équipe', power: 4, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Développeur Senior', role: 'Senior Dev', power: 3, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Développeur Junior', role: 'Junior Dev', power: 2, interest: 4, influence: 'good', domain: 'provider' },
                { name: 'Support Client', role: 'Customer Success', power: 2, interest: 5, influence: 'good', domain: 'customer' },
                { name: 'Client', role: 'Utilisateur Final', power: 2, interest: 5, influence: 'good', domain: 'customer' },
                { name: 'Partenaire Logistique', role: 'Transporteur', power: 3, interest: 3, influence: 'good', domain: 'provider' },
                { name: 'Marketing Manager', role: 'Responsable Marketing', power: 3, interest: 4, influence: 'necessary', domain: 'influencer' }
            ]
        },
        'it-scrum-safe': {
            name: 'Équipe IT SCRUM en SAFe',
            stakeholders: [
                { name: 'RTE', role: 'Release Train Engineer', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Product Manager', role: 'PM', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'System Architect', role: 'Architecte', power: 4, interest: 4, influence: 'necessary', domain: 'provider' },
                { name: 'Scrum Master Équipe 1', role: 'SM', power: 3, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Scrum Master Équipe 2', role: 'SM', power: 3, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Product Owner Équipe 1', role: 'PO', power: 4, interest: 5, influence: 'necessary', domain: 'customer' },
                { name: 'Product Owner Équipe 2', role: 'PO', power: 4, interest: 5, influence: 'necessary', domain: 'customer' },
                { name: 'Business Owner', role: 'Sponsor', power: 5, interest: 3, influence: 'vital', domain: 'governance' }
            ]
        },
        'rh': {
            name: 'Équipe RH',
            stakeholders: [
                { name: 'DRH', role: 'Directeur RH', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Responsable Recrutement', role: 'Recruteur Senior', power: 4, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Chargé RH', role: 'Gestionnaire RH', power: 3, interest: 4, influence: 'good', domain: 'provider' },
                { name: 'Manager Opérationnel', role: 'Chef de Service', power: 4, interest: 4, influence: 'necessary', domain: 'customer' },
                { name: 'Employé', role: 'Collaborateur', power: 2, interest: 5, influence: 'good', domain: 'customer' },
                { name: 'Représentant Syndical', role: 'Délégué', power: 3, interest: 4, influence: 'good', domain: 'influencer' },
                { name: 'Direction Générale', role: 'CEO', power: 5, interest: 3, influence: 'vital', domain: 'governance' }
            ]
        },
        'armee': {
            name: 'Équipe dans l\'Armée',
            stakeholders: [
                { name: 'Général', role: 'Commandant en Chef', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Colonel', role: 'Chef de Corps', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Capitaine', role: 'Commandant d\'Unité', power: 4, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Lieutenant', role: 'Chef de Section', power: 3, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Sergent', role: 'Sous-officier', power: 3, interest: 4, influence: 'good', domain: 'provider' },
                { name: 'Soldat', role: 'Militaire du Rang', power: 2, interest: 4, influence: 'good', domain: 'customer' },
                { name: 'État-major', role: 'Planification', power: 4, interest: 3, influence: 'necessary', domain: 'governance' },
                { name: 'Logistique', role: 'Soutien', power: 3, interest: 3, influence: 'good', domain: 'provider' }
            ]
        },
        'medicale': {
            name: 'Équipe Médicale',
            stakeholders: [
                { name: 'Chef de Service', role: 'Médecin Chef', power: 5, interest: 5, influence: 'vital', domain: 'governance' },
                { name: 'Médecin Senior', role: 'Praticien Hospitalier', power: 4, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Médecin Junior', role: 'Interne', power: 3, interest: 5, influence: 'good', domain: 'provider' },
                { name: 'Infirmier Coordinateur', role: 'IDEC', power: 4, interest: 5, influence: 'necessary', domain: 'provider' },
                { name: 'Infirmier', role: 'IDE', power: 3, interest: 5, influence: 'good', domain: 'provider' },
                { name: 'Patient', role: 'Bénéficiaire', power: 2, interest: 5, influence: 'good', domain: 'customer' },
                { name: 'Famille Patient', role: 'Proche', power: 2, interest: 4, influence: 'courtesy', domain: 'customer' },
                { name: 'Direction Hôpital', role: 'Administratif', power: 5, interest: 3, influence: 'vital', domain: 'governance' },
                { name: 'Pharmacien', role: 'Pharmacie', power: 3, interest: 3, influence: 'good', domain: 'provider' }
            ]
        }
    },

    /**
     * Load template
     */
    loadTemplate(templateId) {
        const template = this.data[templateId];
        if (!template) {
            Utils.showNotification('Template introuvable', 'error');
            return;
        }

        if (!Utils.confirm(`Charger le template "${template.name}" ? Les données actuelles seront remplacées.`)) {
            return;
        }

        // Create new session with template name
        DataManager.createSession(template.name);

        // Add all stakeholders
        template.stakeholders.forEach(s => {
            DataManager.addStakeholder(s);
        });

        // Refresh views
        App.updateSessionInfo();
        App.refreshAllViews();

        Utils.showNotification(`✅ Template "${template.name}" chargé avec ${template.stakeholders.length} stakeholders`, 'success');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Templates;
}
