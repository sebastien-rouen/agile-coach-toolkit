/* ===================================
   CONFIGURATION
   =================================== */

const CONFIG = {
    // PocketBase
    pocketbase: {
        enabled: true,
        collections: {
            sessions: 'tools_stakeholder_mapping_sessions',
            stakeholders: 'tools_stakeholder_mapping_stakeholders'
        }
    },

    // Influence levels
    influenceLevels: {
        vital: { label: 'Vital', color: '#ef4444', order: 1 },
        necessary: { label: 'Nécessaire', color: '#f59e0b', order: 2 },
        good: { label: 'Bon', color: '#10b981', order: 3 },
        courtesy: { label: 'Courtoisie', color: '#3b82f6', order: 4 }
    },

    // Domains
    domains: {
        governance: { label: 'Gouvernance', color: '#8b5cf6' },
        customer: { label: 'Client', color: '#06b6d4' },
        provider: { label: 'Fournisseur', color: '#f97316' },
        influencer: { label: 'Influenceur', color: '#ec4899' }
    },

    // Circle view configuration
    circles: {
        center: { x: 400, y: 400 },
        radii: {
            vital: 100,
            necessary: 200,
            good: 300,
            courtesy: 380
        }
    },

    // Default session name
    defaultSessionName: 'Nouvelle Session'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
