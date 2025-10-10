/**
 * 🧙‍♂️ Assistant guidé Ikigai
 * Guide l'utilisateur étape par étape
 */

class IkigaiWizard {
    constructor(circles, drawCallback) {
        this.circles = circles;
        this.drawCallback = drawCallback;
        this.currentStep = 0;
        this.isActive = false;

        this.steps = [
            {
                title: "🌸 Bienvenue dans votre exploration Ikigai d'Engagement !",
                content: "Cet Ikigai axé sur l'engagement permet de vous aider à vous guider à travers 3 dimensions : ce que vous aimez faire, vos talents et votre capacité à collaborer en équipe, et ce dont votre entreprise a besoin. Ensemble, nous allons explorer ces cercles pour découvrir votre zone d'épanouissement professionnel et identifier les leviers qui vous permettront de vous engager pleinement dans votre travail.",
                action: "Commencer l'exploration",
                circle: null
            },
            {
                title: "❤️ Ce que vous AIMEZ",
                content: "Première dimension : vos passions, ce qui vous fait vibrer, vos centres d'intérêt profonds dans votre travail. Qu'est-ce qui vous motive vraiment au quotidien ? Quelles activités vous donnent de l'énergie ?",
                action: "Dessiner la dimension MOI",
                circle: 0,
                tips: "💡 Pensez à ce qui vous fait perdre la notion du temps au travail, aux projets qui vous enthousiasment, aux moments où vous vous sentez le plus épanoui professionnellement."
            },
            {
                title: "💰 Ce dont votre entreprise a BESOIN",
                content: "Troisième dimension : les enjeux stratégiques de votre organisation, les défis à relever, les opportunités d'impact. Comment pouvez-vous contribuer à la mission et aux objectifs de l'entreprise ?",
                action: "Dessiner la dimension ENTREPRISE",
                circle: 1,
                tips: "💡 Identifiez les problématiques qui vous interpellent dans votre organisation, les projets porteurs de sens, les besoins non couverts où vous pourriez faire la différence."
            },
            {
                title: "🧢 Votre équipe",
                content: "Deuxième dimension : vos talents naturels, compétences acquises, et surtout votre capacité à collaborer et créer de la synergie. Comment votre équipe vous perçoit-elle ? Quel est votre rôle unique dans le collectif ?",
                action: "Dessiner la dimension de L'EQUIPE",
                circle: 2,
                tips: "💡 Réfléchissez aux compliments que vous recevez de vos collègues, à votre style de collaboration, aux moments où l'équipe compte sur vous. Quel est votre superpouvoir relationnel ?"
            },
            {
                title: "🎯 Votre Ikigai d'engagement prend forme !",
                content: "Parfait ! Les 3 dimensions sont maintenant visibles. L'intersection au centre représente votre Ikigai potentiel. Maintenant, placez des post-its pour explorer vos besoins !",
                action: "Commencer à placer des post-its",
                circle: null,
                tips: "🎨 Utilisez les post-its colorés pour marquer ce qui résonne avec vous dans chaque zone."
            }
        ];
    }

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.showStep();
    }

    showStep() {
        if (!this.isActive || this.currentStep >= this.steps.length) {
            this.finish();
            return;
        }

        const step = this.steps[this.currentStep];
        this.createStepPanel(step);
    }

    createStepPanel(step) {
        // Supprimer le panel précédent s'il existe
        const existingPanel = document.querySelector('.wizard-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.className = 'wizard-panel';
        panel.innerHTML = `
            <div class="wizard-header">
                <h4>${step.title}</h4>
                <button class="close-wizard">❌</button>
            </div>
            <div class="wizard-content">
                <p>${step.content}</p>
                ${step.tips ? `<div class="wizard-tips">${step.tips}</div>` : ''}
            </div>
            <div class="wizard-actions">
                <button class="wizard-action-btn">${step.action}</button>
                <div class="wizard-progress">
                    Étape ${this.currentStep + 1} / ${this.steps.length}
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Événements
        const actionBtn = panel.querySelector('.wizard-action-btn');
        const closeBtn = panel.querySelector('.close-wizard');

        actionBtn.addEventListener('click', () => {
            this.executeStepAction(step);
        });

        closeBtn.addEventListener('click', () => {
            this.close();
        });

        // Ajouter les styles CSS si pas déjà fait
        this.addWizardStyles();
    }

    executeStepAction(step) {
        // Désactiver le bouton pour éviter les clics multiples
        const actionBtn = document.querySelector('.wizard-action-btn');
        if (actionBtn) {
            actionBtn.disabled = true;
            actionBtn.style.opacity = '0.6';
            actionBtn.textContent = 'En cours...';
        }

        if (step.circle !== null) {
            // Vérifier si la dimension n'existe pas déjà
            const svg = document.getElementById('ikigai-svg');
            const existingCircles = svg.querySelectorAll('.ikigai-circle');

            if (existingCircles.length <= step.circle) {
                // Dessiner la dimension avec animation
                const circle = this.circles[step.circle];
                this.drawCallback(circle, step.circle);
            }

            // Attendre un peu avant de passer à l'étape suivante
            setTimeout(() => {
                this.nextStep();
            }, 1500);
        } else {
            this.nextStep();
        }
    }

    nextStep() {
        this.currentStep++;
        this.showStep();
    }

    finish() {
        this.isActive = false;
        const panel = document.querySelector('.wizard-panel');
        if (panel) {
            panel.style.animation = 'wizardSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(panel)) {
                    panel.remove();
                }
            }, 500);
        }
    }

    close() {
        this.isActive = false;
        const panel = document.querySelector('.wizard-panel');
        if (panel) {
            panel.style.animation = 'wizardSlideOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(panel)) {
                    panel.remove();
                }
            }, 500);
        }

        // Dessiner toutes les dimensions quand on ferme le wizard
        this.drawAllDimensions();
    }

    drawAllDimensions() {
        // Dessiner toutes les dimensions avec un délai progressif
        this.circles.forEach((circle, index) => {
            setTimeout(() => {
                // Vérifier si la dimension n'existe pas déjà
                const svg = document.getElementById('ikigai-svg');
                const existingCircles = svg.querySelectorAll('.ikigai-circle');

                if (existingCircles.length <= index) {
                    this.drawCallback(circle, index);
                }
            }, index * 300); // 0.8s entre chaque dimension
        });

        // Afficher un message d'instructions après avoir dessiné toutes les dimensions
        setTimeout(() => {
            this.showQuickInstructions();
        }, this.circles.length * 300 + 1000);
    }

    showQuickInstructions() {
        const instructions = document.createElement('div');
        instructions.className = 'instructions-panel quick-mode';
        instructions.innerHTML = `
            <button class="close-instructions">❌</button>
            <h5>🎯 Votre Ikigai est prêt !</h5>
            <div class="quick-tips">
                <div class="tip">📝 Clic sur post-it → placer</div>
                <div class="tip">🖱️ Glisser-déposer pour repositionner</div>
                <div class="tip">✏️ Double-clic pour éditer</div>
                <div class="tip">🎛️ Ajoutez vos leviers personnels</div>
            </div>
            <div class="center-tip">
                💡 <strong>L'intersection au centre = votre Ikigai !</strong>
            </div>
        `;

        // Style pour les instructions
        instructions.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            background: linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            animation: slideInFromRight 0.5s ease-out;
            z-index: 1001;
            max-width: 300px;
            font-size: 14px;
        `;

        document.body.appendChild(instructions);

        // Fermeture automatique après 8 secondes
        setTimeout(() => {
            if (document.body.contains(instructions)) {
                instructions.style.animation = 'slideOutToRight 0.3s ease-in forwards';
                setTimeout(() => {
                    if (document.body.contains(instructions)) {
                        document.body.removeChild(instructions);
                    }
                }, 300);
            }
        }, 8000);

        // Fermeture manuelle
        const closeBtn = instructions.querySelector('.close-instructions');
        closeBtn.addEventListener('click', () => {
            instructions.style.animation = 'slideOutToRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(instructions)) {
                    document.body.removeChild(instructions);
                }
            }, 300);
        });
    }

    addWizardStyles() {
        if (document.querySelector('#wizard-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'wizard-styles';

        document.head.appendChild(styles);
    }
}