/* ===================================
   CIRCLES VIEW (Concentric Circles)
   =================================== */

const CirclesView = {
    svg: null,
    tooltip: null,

    /**
     * Initialize circles view
     */
    init() {
        this.svg = document.getElementById('circlesSvg');
        this.createTooltip();
    },

    /**
     * Create tooltip element
     */
    createTooltip() {
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'stakeholder-tooltip';
            document.body.appendChild(this.tooltip);
        }
    },

    /**
     * Render circles view
     */
    render() {
        if (!this.svg) return;

        const stakeholders = DataManager.getAllStakeholders();
        const center = CONFIG.circles.center;
        const radii = CONFIG.circles.radii;

        // Clear SVG
        this.svg.innerHTML = '';

        // Draw concentric circles
        this.drawCircles(center, radii);

        // Draw domain lines
        this.drawDomainLines(center);

        // Draw domain labels
        this.drawDomainLabels(center);

        // Draw stakeholders
        if (stakeholders.length === 0) {
            this.showEmptyState();
        } else {
            this.drawStakeholders(stakeholders, center, radii);
        }
    },

    /**
     * Draw concentric circles
     */
    drawCircles(center, radii) {
        const levels = ['courtesy', 'good', 'necessary', 'vital'];
        
        levels.forEach(level => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', center.x);
            circle.setAttribute('cy', center.y);
            circle.setAttribute('r', radii[level]);
            circle.setAttribute('class', `circle-${level}`);
            this.svg.appendChild(circle);

            // Add label with background for better visibility
            const labelY = center.y - radii[level] + 25;
            
            // Background rectangle
            const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const labelText = CONFIG.influenceLevels[level].label;
            const textWidth = labelText.length * 8;
            bg.setAttribute('x', center.x - textWidth / 2 - 8);
            bg.setAttribute('y', labelY - 16);
            bg.setAttribute('width', textWidth + 16);
            bg.setAttribute('height', 24);
            bg.setAttribute('fill', 'var(--bg-card)');
            bg.setAttribute('opacity', '0.9');
            bg.setAttribute('rx', '4');
            this.svg.appendChild(bg);

            // Label text
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', center.x);
            label.setAttribute('y', labelY);
            label.setAttribute('class', 'circle-label');
            label.textContent = labelText;
            this.svg.appendChild(label);
        });
    },

    /**
     * Draw domain lines
     */
    drawDomainLines(center) {
        const maxRadius = CONFIG.circles.radii.courtesy;
        const domains = ['governance', 'customer', 'provider', 'influencer'];

        domains.forEach(domain => {
            const angle = Utils.getDomainAngle(domain);
            const end = Utils.polarToCartesian(center.x, center.y, maxRadius, angle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', center.x);
            line.setAttribute('y1', center.y);
            line.setAttribute('x2', end.x);
            line.setAttribute('y2', end.y);
            line.setAttribute('class', 'domain-line');
            this.svg.appendChild(line);
        });
    },

    /**
     * Draw domain labels
     */
    drawDomainLabels(center) {
        const labelRadius = CONFIG.circles.radii.courtesy + 30;
        const domains = Object.keys(CONFIG.domains);

        domains.forEach(domain => {
            const angle = Utils.getDomainAngle(domain);
            const pos = Utils.polarToCartesian(center.x, center.y, labelRadius, angle);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y);
            label.setAttribute('class', 'domain-label');
            label.textContent = CONFIG.domains[domain].label;
            this.svg.appendChild(label);
        });
    },

    /**
     * Draw stakeholders
     */
    drawStakeholders(stakeholders, center, radii) {
        const domainEmojis = {
            governance: '👑',
            customer: '👥',
            provider: '🤝',
            influencer: '💡'
        };

        // Group stakeholders by influence and domain
        const grouped = {};
        stakeholders.forEach(s => {
            const key = `${s.influence}-${s.domain}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(s);
        });

        // Place stakeholders with better distribution
        Object.keys(grouped).forEach(key => {
            const [influence, domain] = key.split('-');
            const group = grouped[key];
            const radius = radii[influence];
            const baseAngle = Utils.getDomainAngle(domain);
            
            // Calculate spread angle based on number of stakeholders
            const spreadAngle = Math.min(60, 30 + group.length * 5);
            const angleStep = group.length > 1 ? spreadAngle / (group.length - 1) : 0;
            const startAngle = baseAngle - spreadAngle / 2;

            group.forEach((s, index) => {
                const angle = group.length === 1 ? baseAngle : startAngle + (angleStep * index);
                
                // Add slight radius variation for same position
                const radiusVariation = (Math.random() - 0.5) * 15;
                
                const pos = Utils.polarToCartesian(
                    center.x, 
                    center.y, 
                    radius + radiusVariation, 
                    angle
                );

                this.drawStakeholder(s, pos, domainEmojis[s.domain]);
            });
        });
    },

    /**
     * Draw single stakeholder
     */
    drawStakeholder(s, pos, emoji) {
        // Create group for stakeholder
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `stakeholder-node ${s.domain}`);
        group.setAttribute('data-id', s.id);

        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', 24);
        group.appendChild(circle);

        // Domain emoji (background)
        const emojiText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        emojiText.setAttribute('x', pos.x);
        emojiText.setAttribute('y', pos.y - 8);
        emojiText.setAttribute('class', 'stakeholder-emoji');
        emojiText.setAttribute('text-anchor', 'middle');
        emojiText.textContent = emoji || '📍';
        group.appendChild(emojiText);

        // Initials (foreground)
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y + 10);
        text.setAttribute('class', 'stakeholder-initials');
        text.textContent = this.getInitials(s.name);
        group.appendChild(text);

        // Events
        group.addEventListener('mouseenter', (e) => this.showTooltip(e, s));
        group.addEventListener('mouseleave', () => this.hideTooltip());
        group.addEventListener('click', () => this.onStakeholderClick(s.id));

        this.svg.appendChild(group);
    },

    /**
     * Get initials from name
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    /**
     * Show tooltip
     */
    showTooltip(event, stakeholder) {
        this.tooltip.innerHTML = `
            <div class="tooltip-name">${Utils.sanitize(stakeholder.name)}</div>
            <div class="tooltip-role">${Utils.sanitize(stakeholder.role)}</div>
        `;
        this.tooltip.style.left = event.pageX + 10 + 'px';
        this.tooltip.style.top = event.pageY + 10 + 'px';
        this.tooltip.classList.add('visible');
    },

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.classList.remove('visible');
    },

    /**
     * Handle stakeholder click
     */
    onStakeholderClick(id) {
        const stakeholder = DataManager.getStakeholder(id);
        if (stakeholder) {
            ModalManager.openStakeholderModal(stakeholder);
        }
    },

    /**
     * Show empty state
     */
    showEmptyState() {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', CONFIG.circles.center.x);
        text.setAttribute('y', CONFIG.circles.center.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'circle-label');
        text.textContent = 'Aucun stakeholder';
        this.svg.appendChild(text);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CirclesView;
}
