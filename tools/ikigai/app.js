/**
 * 🎯 Ikigai - Application principale
 * BastaVerse - Découverte interactive de son Ikigai
 */

class IkigaiApp {
    constructor() {
        this.state = {
            postits: [],
            circles: [],
            currentStep: 0,
            levers: [...IKIGAI_LEVERS], // Import depuis leviers.js
            leversVisible: false,
            draggedLever: null
        };

        this.circles = [
            { name: "AIMEZ", color: "#ff9aa2", cx: 320, cy: 230, r: 170, emoji: "❤️" },
            { name: "DOUÉ", color: "#87ceeb", cx: 480, cy: 230, r: 170, emoji: "💪" },
            { name: "BESOIN", color: "#90ee90", cx: 480, cy: 370, r: 170, emoji: "🌍" },
            { name: "PAYÉ", color: "#f0e68c", cx: 320, cy: 370, r: 170, emoji: "💰" }
        ];

        this.wizard = null;
        this.isDragging = false;
        this.storageKey = 'ikigai-explorer-data';

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.renderLevers();

        // Vérifier s'il y a des données sauvegardées pour restaurer l'état
        if (this.hasStoredData()) {
            this.showRestoreOption();
        }

        // Gérer les changements de taille d'écran
        this.handleResponsiveChanges();
    }

    bindEvents() {
        // Démarrage
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startExploration();
        });

        // Palette de post-its
        document.querySelectorAll('.postit-template').forEach(template => {
            template.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.createPostit(e.target.dataset.type);
                }
            });
        });

        // Actions principales
        document.getElementById('show-summary-btn').addEventListener('click', () => {
            this.showSummary();
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });

        // Ajouter levier personnalisé
        document.getElementById('add-custom-lever').addEventListener('click', () => {
            this.addCustomLever();
        });
    }

    startExploration() {
        // Vérifier si le wizard est activé
        const wizardEnabled = document.getElementById('wizard-enabled').checked;

        document.getElementById('welcome-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');

        this.renderLevers();

        if (wizardEnabled) {
            // Mode avec assistant
            this.wizard = new IkigaiWizard(this.circles, (circle, index) => {
                this.drawCircleAnimated(circle, index);
            });
            this.wizard.start();
        } else {
            // Mode direct sans assistant
            this.startDirectMode();
        }
    }

    startDirectMode() {
        // Dessiner tous les dimensions avec un délai
        this.circles.forEach((circle, index) => {
            setTimeout(() => {
                // Notification pour chaque dimension
                const notifications = [
                    "❤️ Dimension AMOUR : Vos passions !",
                    "💪 Dimension TALENT : Vos compétences !",
                    "🌍 Dimension BESOIN : L'impact mondial !",
                    "💰 Dimension REVENUS : Votre valeur économique !"
                ];

                this.showCircleNotification(
                    notifications[index],
                    null,
                    2000
                );

                this.drawCircleAnimated(circle, index);
            }, index * 1500); // 1.5s entre chaque dimension
        });

        // Message final après tous les dimensions
        setTimeout(() => {
            this.showCircleNotification(
                "🎉 C'est parti ! Placez vos post-its sur les dimensions qui vous parlent !",
                null,
                5000
            );

            // Afficher les instructions après 2 secondes
            setTimeout(() => {
                this.showQuickInstructions();
            }, 2000);
        }, this.circles.length * 1500 + 1000);
    }

    showCircleNotification(message, position, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'circle-notification';
        notification.textContent = message;
        // Position fixe en haut au centre
        notification.style.transform = 'translateX(-50%)';

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Animation de sortie
        setTimeout(() => {
            notification.classList.add('hide');
        }, duration - 500);

        // Suppression
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, duration);
    }

    getCircleNotificationPosition(circle) {
        // Calculer la position de notification basée sur le dimension
        const positions = [
            { x: '20%', y: '30%' },  // dimension amour (haut gauche)
            { x: '80%', y: '30%' },  // dimension talent (haut droite)  
            { x: '20%', y: '70%' },  // dimension besoin (bas gauche)
            { x: '80%', y: '70%' }   // dimension revenus (bas droite)
        ];

        const index = this.circles.indexOf(circle);
        return positions[index] || { x: '50%', y: '50%' };
    }

    showQuickInstructions() {
        const instructions = document.createElement('div');
        instructions.className = 'instructions-panel quick-mode';
        instructions.innerHTML = `
            <button class="close-instructions">❌</button>
            <h5>🚀 Mode Direct - Guide rapide</h5>
            <div class="quick-tips">
                <div class="tip">📝 Clic sur post-it → placer</div>
                <div class="tip">🖱️ Glisser-déposer pour repositionner</div>
                <div class="tip">✏️ Double-clic pour éditer</div>
                <div class="tip">⚙️ Ajoutez vos leviers personnels</div>
            </div>
            <div class="center-tip">
                💡 <strong>L'intersection au centre = votre Ikigai !</strong>
            </div>
        `;

        document.body.appendChild(instructions);

        // Style spécifique pour le mode rapide
        instructions.style.cssText += `
            right: 20px;
            bottom: 20px;
            background: linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            animation: slideInFromRight 0.5s ease-out;
        `;

        // Fermeture
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

    drawCircleAnimated(circle, index) {
        const svg = document.getElementById('ikigai-svg');
        const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circleElement.setAttribute('cx', circle.cx);
        circleElement.setAttribute('cy', circle.cy);
        circleElement.setAttribute('r', 0);
        circleElement.setAttribute('fill', circle.color);
        circleElement.setAttribute('fill-opacity', '0.6');
        circleElement.setAttribute('stroke', circle.color);
        circleElement.setAttribute('stroke-width', '3');
        circleElement.classList.add('ikigai-circle');

        svg.appendChild(circleElement);

        // Animation du rayon
        let currentR = 0;
        const targetR = circle.r;
        const animate = () => {
            currentR += (targetR - currentR) * 0.1;
            circleElement.setAttribute('r', currentR);

            if (Math.abs(targetR - currentR) > 0.5) {
                requestAnimationFrame(animate);
            } else {
                circleElement.setAttribute('r', targetR);
                this.addCircleLabel(circle);
            }
        };

        requestAnimationFrame(animate);

        this.state.circles.push(circle);
        this.saveToStorage();
    }

    addCircleLabel(circle) {
        const svg = document.getElementById('ikigai-svg');
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        // Position du label selon la dimension
        let labelY;
        if (circle.name === 'PAYÉ' || circle.name === 'BESOIN') {
            // Labels sous les dimensions du bas
            labelY = circle.cy + circle.r + 25;
        } else {
            // Labels au-dessus des dimensions du haut
            labelY = circle.cy - circle.r - 15;
        }

        text.setAttribute('x', circle.cx);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.classList.add('circle-label');
        text.textContent = `${circle.emoji} ${circle.name}`;

        svg.appendChild(text);
    }

    createPostit(type) {
        const types = {
            satisfied: { color: '#d4edda', text: '✅ Nouveau besoin' },
            neutral: { color: '#fff3cd', text: '⚖️ Non nourri mais OK' },
            frustrated: { color: '#f8d7da', text: '❌ Besoin non nourri' }
        };

        const postit = document.createElement('div');
        postit.className = `postit ${type}`;
        postit.style.background = types[type].color;

        // Position adaptée selon la taille de l'écran
        const canvas = document.querySelector('.ikigai-canvas');
        const canvasRect = canvas.getBoundingClientRect();
        const centerX = Math.max(50, (canvasRect.width / 2) - 75); // 75px = moitié largeur post-it
        const centerY = Math.max(50, (canvasRect.height / 2) - 40); // 40px = moitié hauteur post-it

        postit.style.left = centerX + 'px';
        postit.style.top = centerY + 'px';

        // Créer un conteneur pour le texte
        const textContainer = document.createElement('div');
        textContainer.className = 'postit-text';
        textContainer.textContent = types[type].text;
        postit.appendChild(textContainer);

        canvas.appendChild(postit);

        this.addPostitActions(postit);
        this.makePostitDraggable(postit);
        this.makePostitClickable(postit);
        this.makePostitDroppable(postit);

        // Sauvegarder dans l'état
        this.state.postits.push({
            type,
            content: types[type].text,
            x: centerX,
            y: centerY
        });

        this.saveToStorage();
    }

    makePostitDraggable(postit) {
        let startX = 0, startY = 0, initialX = 0, initialY = 0;
        let isDragging = false;

        // Fonction commune pour démarrer le drag
        const startDrag = (clientX, clientY) => {
            // Ne pas déclencher le drag si on clique sur les actions
            if (event.target.closest('.postit-actions')) {
                return false;
            }

            isDragging = true;
            this.isDragging = true;
            startX = clientX;
            startY = clientY;
            initialX = parseInt(postit.style.left, 10) || 0;
            initialY = parseInt(postit.style.top, 10) || 0;

            postit.style.zIndex = '1000';
            postit.style.transform = 'rotate(-2deg) scale(1.05)';

            // Désactiver la sélection de texte
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';

            return true;
        };

        // Fonction commune pour le drag
        const drag = (clientX, clientY) => {
            if (!isDragging) return;

            const x = initialX + clientX - startX;
            const y = initialY + clientY - startY;

            postit.style.left = x + 'px';
            postit.style.top = y + 'px';
        };

        // Fonction commune pour arrêter le drag
        const stopDrag = () => {
            if (!isDragging) return;

            isDragging = false;
            this.isDragging = false;
            postit.style.zIndex = '10';
            postit.style.transform = 'rotate(-1deg) scale(1)';

            // Réactiver la sélection de texte
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
            document.body.style.msUserSelect = '';

            // Mettre à jour l'état
            const textContainer = postit.querySelector('.postit-text');
            const currentText = textContainer.textContent.trim();
            const index = this.state.postits.findIndex(p => p.content === currentText);
            if (index !== -1) {
                this.state.postits[index].x = parseInt(postit.style.left, 10);
                this.state.postits[index].y = parseInt(postit.style.top, 10);
                this.saveToStorage();
            }

            // Nettoyer les événements
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        // Gestionnaires d'événements
        const handleMouseMove = (e) => drag(e.clientX, e.clientY);
        const handleMouseUp = () => stopDrag();
        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
        };
        const handleTouchEnd = () => stopDrag();

        // Événements souris (desktop)
        postit.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (startDrag(e.clientX, e.clientY)) {
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        });

        // Événements tactiles (mobile)
        postit.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (startDrag(touch.clientX, touch.clientY)) {
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                document.addEventListener('touchend', handleTouchEnd);
            }
        });
    }

    addPostitActions(postit) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'postit-actions';

        // Icône modifier
        const editAction = document.createElement('div');
        editAction.className = 'postit-action edit';
        editAction.innerHTML = '🛠️';
        editAction.title = 'Modifier le post-it';

        // Icône supprimer
        const deleteAction = document.createElement('div');
        deleteAction.className = 'postit-action delete';
        deleteAction.innerHTML = '🗑️';
        deleteAction.title = 'Supprimer le post-it';

        actionsContainer.appendChild(editAction);
        actionsContainer.appendChild(deleteAction);
        postit.appendChild(actionsContainer);

        // Événements
        editAction.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editPostit(postit);
        });

        deleteAction.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePostit(postit);
        });
    }

    makePostitClickable(postit) {
        let clickTimeout = null;

        postit.addEventListener('click', (e) => {
            // Ne pas déclencher si on est en train de faire du drag
            if (this.isDragging) return;

            // Faire passer le post-it au premier plan
            this.bringPostitToFront(postit);

            // Désélectionner tous les autres post-its
            document.querySelectorAll('.postit.selected, .postit.clicked').forEach(p => {
                if (p !== postit) {
                    p.classList.remove('selected', 'clicked');
                }
            });

            // Sur mobile, utiliser la classe 'clicked' pour afficher les actions
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // Basculer la classe 'clicked' pour afficher/masquer les actions
                postit.classList.toggle('clicked');

                // Auto-masquer après 3 secondes sur mobile
                if (postit.classList.contains('clicked')) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(() => {
                        postit.classList.remove('clicked');
                    }, 3000);
                }
            } else {
                // Sur desktop, utiliser la classe 'selected' comme avant
                postit.classList.toggle('selected');
            }
        });

        // Clic en dehors pour désélectionner
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.postit') && !e.target.closest('.postit-actions')) {
                document.querySelectorAll('.postit.selected, .postit.clicked').forEach(p => {
                    p.classList.remove('selected', 'clicked');
                });
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }
            }
        });
    }

    bringPostitToFront(postit) {
        // Trouver le z-index le plus élevé parmi tous les post-its
        let maxZIndex = 10; // z-index de base des post-its
        document.querySelectorAll('.postit').forEach(p => {
            const zIndex = parseInt(window.getComputedStyle(p).zIndex) || 10;
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        });

        // Assigner un z-index plus élevé au post-it cliqué
        postit.style.zIndex = maxZIndex + 1;
    }

    editPostit(postit) {
        const textContainer = postit.querySelector('.postit-text');
        const currentText = textContainer.textContent.trim();
        const newText = prompt('Modifier le post-it:', currentText);

        if (newText && newText !== currentText) {
            textContainer.textContent = newText;

            // Mettre à jour l'état
            const index = this.state.postits.findIndex(p =>
                p.content === currentText
            );
            if (index !== -1) {
                this.state.postits[index].content = newText;
                this.saveToStorage();
            }
        }

        // Désélectionner après modification
        postit.classList.remove('selected');
    }

    deletePostit(postit) {
        const textContainer = postit.querySelector('.postit-text');
        const currentText = textContainer.textContent.trim();

        if (confirm(`Êtes-vous sûr de vouloir supprimer ce post-it ?\n\n"${currentText}"`)) {
            // Supprimer de l'état
            const index = this.state.postits.findIndex(p =>
                p.content === currentText
            );
            if (index !== -1) {
                this.state.postits.splice(index, 1);
                this.saveToStorage();
            }

            // Animation de suppression
            postit.style.animation = 'postitDelete 0.3s ease-in forwards';
            setTimeout(() => {
                if (postit.parentNode) {
                    postit.remove();
                }
            }, 300);
        }
    }

    renderLevers() {
        const container = document.getElementById('levers-container');
        container.innerHTML = '';

        this.state.levers.forEach((lever, index) => {
            const leverElement = document.createElement('div');
            leverElement.className = 'lever';
            leverElement.draggable = true;
            leverElement.dataset.leverIndex = index;
            
            // Ajouter une classe basée sur la catégorie pour la couleur de bordure
            if (lever.category) {
                leverElement.classList.add(`lever-category-${lever.category}`);
            }

            // Utiliser l'icône du levier ou extraire l'emoji du titre
            const leverIcon = lever.icon || (lever.title.match(/^(\p{Emoji})/u)?.[1] || '⚙️');

            leverElement.innerHTML = `
                <div class="lever-icon">${leverIcon}</div>
                <div class="lever-content">
                    <div class="lever-title">${lever.title}</div>
                    <div class="lever-desc">${lever.desc}</div>
                    <div class="lever-examples">${lever.examples}</div>
                </div>
            `;

            // Rendre éditable si c'est un levier personnalisé
            if (lever.custom) {
                leverElement.classList.add('custom');
                this.addLeverActions(leverElement, index);
                this.makeLeverClickable(leverElement);
            }

            // Ajouter les événements de drag'n drop
            this.makeLeverDraggable(leverElement, index);

            container.appendChild(leverElement);
        });
    }

    addLeverActions(leverElement, index) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'lever-actions';

        // Icône modifier
        const editAction = document.createElement('div');
        editAction.className = 'lever-action edit';
        editAction.innerHTML = '🛠️';
        editAction.title = 'Modifier le levier';

        // Icône supprimer
        const deleteAction = document.createElement('div');
        deleteAction.className = 'lever-action delete';
        deleteAction.innerHTML = '🗑️';
        deleteAction.title = 'Supprimer le levier';

        actionsContainer.appendChild(editAction);
        actionsContainer.appendChild(deleteAction);
        leverElement.appendChild(actionsContainer);

        // Événements
        editAction.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editLever(index);
        });

        deleteAction.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteLever(index);
        });
    }

    makeLeverClickable(leverElement) {
        leverElement.addEventListener('click', (e) => {
            // Désélectionner tous les autres leviers
            document.querySelectorAll('.lever.selected').forEach(l => {
                if (l !== leverElement) {
                    l.classList.remove('selected');
                }
            });

            // Basculer la sélection du levier actuel
            leverElement.classList.toggle('selected');
        });

        // Clic en dehors pour désélectionner
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lever') && !e.target.closest('.lever-actions')) {
                document.querySelectorAll('.lever.selected').forEach(l => {
                    l.classList.remove('selected');
                });
            }
        });
    }

    editLever(index) {
        const lever = this.state.levers[index];
        if (!lever.custom) return;

        const title = prompt('Titre du levier :', lever.title);
        if (title === null) return;

        const desc = prompt('Description :', lever.desc);
        if (desc === null) return;

        const examples = prompt('Exemples :', lever.examples);
        if (examples === null) return;

        this.state.levers[index] = { title, desc, examples, custom: true };
        this.renderLevers();
        this.saveToStorage();
    }

    deleteLever(index) {
        const lever = this.state.levers[index];
        if (!lever.custom) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer ce levier ?\n\n"${lever.title}"`)) {
            this.state.levers.splice(index, 1);
            this.renderLevers();
            this.saveToStorage();
        }
    }

    addCustomLever() {
        const title = prompt('Titre du levier :');
        if (!title) return;

        const desc = prompt('Description :');
        if (!desc) return;

        const examples = prompt('Exemples de pratiques :');
        if (!examples) return;

        this.state.levers.push({
            title,
            desc,
            examples,
            custom: true
        });

        this.renderLevers();
        this.saveToStorage();
    }

    // === DRAG'N DROP DES LEVIERS ===

    makeLeverDraggable(leverElement, index) {
        let startX = 0, startY = 0, initialX = 0, initialY = 0;
        let isDragging = false;
        let draggedElement = null;

        // Fonction pour démarrer le drag
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            startX = clientX;
            startY = clientY;

            // Créer un élément de drag visuel
            draggedElement = leverElement.cloneNode(true);
            draggedElement.style.position = 'fixed';
            draggedElement.style.pointerEvents = 'none';
            draggedElement.style.zIndex = '2000';
            draggedElement.style.opacity = '0.8';
            draggedElement.style.transform = 'rotate(2deg) scale(0.9)';
            draggedElement.classList.add('lever-dragging'); // Ajouter la classe pour les dimensions
            document.body.appendChild(draggedElement);

            // Marquer le levier comme étant draggé
            this.state.draggedLever = {
                index: index,
                lever: this.state.levers[index]
            };

            leverElement.style.opacity = '0.5';
        };

        // Fonction pour le drag
        const drag = (clientX, clientY) => {
            if (!isDragging || !draggedElement) return;

            draggedElement.style.left = (clientX - 125) + 'px'; // 125px = moitié largeur levier (250px/2)
            draggedElement.style.top = (clientY - 60) + 'px';  // 60px = moitié hauteur levier estimée

            // Vérifier si on survole un post-it
            const elementBelow = document.elementFromPoint(clientX, clientY);
            const postit = elementBelow?.closest('.postit');

            // Mettre à jour les styles de drop
            document.querySelectorAll('.postit').forEach(p => {
                p.classList.remove('drop-target');
            });

            if (postit) {
                postit.classList.add('drop-target');
            }
        };

        // Fonction pour arrêter le drag
        const stopDrag = (clientX, clientY) => {
            if (!isDragging) return;

            isDragging = false;
            leverElement.style.opacity = '1';

            // Nettoyer l'élément de drag
            if (draggedElement) {
                document.body.removeChild(draggedElement);
                draggedElement = null;
            }

            // Vérifier si on a droppé sur un post-it
            const elementBelow = document.elementFromPoint(clientX, clientY);
            const postit = elementBelow?.closest('.postit');

            if (postit && this.state.draggedLever) {
                this.attachLeverToPostit(postit, this.state.draggedLever.lever);
            }

            // Nettoyer les styles de drop
            document.querySelectorAll('.postit').forEach(p => {
                p.classList.remove('drop-target');
            });

            this.state.draggedLever = null;

            // Nettoyer les événements
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        // Gestionnaires d'événements
        const handleMouseMove = (e) => drag(e.clientX, e.clientY);
        const handleMouseUp = (e) => stopDrag(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
        };
        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            stopDrag(touch.clientX, touch.clientY);
        };

        // Événements souris (desktop)
        leverElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Événements tactiles (mobile)
        leverElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        });

        // Garder le drag'n drop HTML5 pour desktop
        leverElement.addEventListener('dragstart', (e) => {
            this.state.draggedLever = {
                index: index,
                lever: this.state.levers[index]
            };

            leverElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', '');
        });

        leverElement.addEventListener('dragend', (e) => {
            leverElement.style.opacity = '1';
            this.state.draggedLever = null;
        });
    }

    setupPostitsDropZones() {
        document.querySelectorAll('.postit').forEach(postit => {
            this.makePostitDroppable(postit);
        });
    }

    makePostitDroppable(postit) {
        postit.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            postit.classList.add('drop-target');
        });

        postit.addEventListener('dragleave', (e) => {
            postit.classList.remove('drop-target');
        });

        postit.addEventListener('drop', (e) => {
            e.preventDefault();
            postit.classList.remove('drop-target');

            if (this.state.draggedLever) {
                this.attachLeverToPostit(postit, this.state.draggedLever.lever);
            }
        });
    }

    attachLeverToPostit(postit, lever) {
        const textContainer = postit.querySelector('.postit-text');
        const currentText = textContainer.textContent.trim();

        // Trouver le post-it dans l'état
        const postitIndex = this.state.postits.findIndex(p => p.content === currentText);
        if (postitIndex !== -1) {
            // Ajouter le levier au post-it
            if (!this.state.postits[postitIndex].attachedLevers) {
                this.state.postits[postitIndex].attachedLevers = [];
            }

            // Éviter les doublons
            const leverExists = this.state.postits[postitIndex].attachedLevers.some(
                l => l.title === lever.title
            );

            if (!leverExists) {
                this.state.postits[postitIndex].attachedLevers.push({
                    title: lever.title,
                    desc: lever.desc,
                    examples: lever.examples,
                    icon: lever.icon
                });

                this.saveToStorage();
                this.updatePostitDisplay(postit, this.state.postits[postitIndex]);

                // Notification de succès
                this.showCircleNotification(
                    `⚙️ Levier "${lever.title}" attaché au post-it !`,
                    null,
                    2000
                );
            } else {
                this.showCircleNotification(
                    `⚠️ Ce levier est déjà attaché à ce post-it`,
                    null,
                    2000
                );
            }
        }
    }

    getLeverIcon(lever) {
        // Si le levier a déjà une icône, l'utiliser
        if (lever.icon) {
            return lever.icon;
        }

        // Chercher le levier dans la liste des leviers disponibles par titre
        const foundLever = this.state.levers.find(l => l.title === lever.title);
        if (foundLever && foundLever.icon) {
            return foundLever.icon;
        }

        // Fallback : extraire l'emoji du titre ou utiliser ⚙️
        const match = lever.title.match(/^(\p{Emoji})/u);
        return match ? match[1] : '⚙️';
    }

    updatePostitDisplay(postit, postitData) {
        // Supprimer les anciens indicateurs de leviers
        const existingIndicators = postit.querySelectorAll('.lever-indicator');
        existingIndicators.forEach(indicator => indicator.remove());

        // Ajouter les indicateurs de leviers attachés
        if (postitData.attachedLevers && postitData.attachedLevers.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'lever-indicator';

            // Utiliser les icônes des leviers attachés
            const leverEmojis = postitData.attachedLevers.map(lever => {
                return this.getLeverIcon(lever);
            }).join('');

            indicator.innerHTML = leverEmojis;
            indicator.title = `Leviers attachés: ${postitData.attachedLevers.map(l => l.title).join(', ')}`;
            postit.appendChild(indicator);

            // Clic sur l'indicateur pour voir les leviers
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAttachedLevers(postit, postitData);
            });
        }
    }

    showAttachedLevers(postit, postitData) {
        if (!postitData.attachedLevers || postitData.attachedLevers.length === 0) return;

        const modal = document.createElement('div');
        modal.className = 'attached-levers-modal';
        modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>⚙️ Leviers attachés</h3>
                        <button class="close-modal">❌</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Post-it:</strong> ${postitData.content}</p>
                        <div class="attached-levers-list">
                            ${postitData.attachedLevers.map((lever, index) => `
                                <div class="attached-lever">
                                    <div class="lever-icon">${this.getLeverIcon(lever)}</div>
                                    <div class="lever-content">
                                        <div class="lever-title">${lever.title}</div>
                                        <div class="lever-desc">${lever.desc}</div>
                                        <div class="lever-examples">${lever.examples}</div>
                                    </div>
                                    <button class="remove-lever-btn" data-index="${index}">🗑️ Détacher</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            `;

        document.body.appendChild(modal);

        // Événements
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelectorAll('.remove-lever-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const leverIndex = parseInt(e.target.dataset.index);
                this.detachLeverFromPostit(postit, postitData, leverIndex);
                document.body.removeChild(modal);
            });
        });

        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    detachLeverFromPostit(postit, postitData, leverIndex) {
        if (postitData.attachedLevers && leverIndex >= 0 && leverIndex < postitData.attachedLevers.length) {
            const removedLever = postitData.attachedLevers.splice(leverIndex, 1)[0];
            this.saveToStorage();
            this.updatePostitDisplay(postit, postitData);

            this.showCircleNotification(
                `🗑️ Levier "${removedLever.title}" détaché !`,
                null,
                2000
            );
        }
    }

    makeCanvasLeverDraggable(leverElement, index) {
        let startX = 0, startY = 0, initialX = 0, initialY = 0;
        let isDragging = false;

        // Fonction commune pour démarrer le drag
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            startX = clientX;
            startY = clientY;
            initialX = parseInt(leverElement.style.left, 10) || 0;
            initialY = parseInt(leverElement.style.top, 10) || 0;

            leverElement.style.zIndex = '1000';

            // Marquer le levier comme étant draggé pour le drop sur post-its
            this.state.draggedLever = {
                index: index,
                lever: this.state.levers[index]
            };
        };

        // Fonction commune pour le drag
        const drag = (clientX, clientY) => {
            if (!isDragging) return;

            const x = initialX + clientX - startX;
            const y = initialY + clientY - startY;

            leverElement.style.left = x + 'px';
            leverElement.style.top = y + 'px';

            // Vérifier si on survole un post-it pour le feedback visuel
            const elementBelow = document.elementFromPoint(clientX, clientY);
            const postit = elementBelow?.closest('.postit');

            // Mettre à jour les styles de drop
            document.querySelectorAll('.postit').forEach(p => {
                p.classList.remove('drop-target');
            });

            if (postit) {
                postit.classList.add('drop-target');
            }
        };

        // Fonction commune pour arrêter le drag
        const stopDrag = (clientX, clientY) => {
            if (!isDragging) return;

            isDragging = false;
            leverElement.style.zIndex = '100';

            // Vérifier si on a droppé sur un post-it
            const elementBelow = document.elementFromPoint(clientX, clientY);
            const postit = elementBelow?.closest('.postit');

            if (postit && this.state.draggedLever) {
                this.attachLeverToPostit(postit, this.state.draggedLever.lever);
            }

            // Nettoyer les styles de drop
            document.querySelectorAll('.postit').forEach(p => {
                p.classList.remove('drop-target');
            });

            this.state.draggedLever = null;

            // Nettoyer les événements
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        // Gestionnaires d'événements
        const handleMouseMove = (e) => drag(e.clientX, e.clientY);
        const handleMouseUp = (e) => stopDrag(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
        };
        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            stopDrag(touch.clientX, touch.clientY);
        };

        // Événements souris (desktop)
        leverElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Événements tactiles (mobile)
        leverElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        });

        // Garder le drag'n drop HTML5 pour desktop
        leverElement.addEventListener('dragstart', (e) => {
            this.state.draggedLever = {
                index: index,
                lever: this.state.levers[index]
            };

            leverElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'copy';
        });

        leverElement.addEventListener('dragend', (e) => {
            leverElement.style.opacity = '1';
            this.state.draggedLever = null;
        });
    }

    // === GESTION DU LOCALSTORAGE ===

    saveToStorage() {
        try {
            const dataToSave = {
                timestamp: new Date().toISOString(),
                postits: this.state.postits,
                levers: this.state.levers.filter(l => l.custom),
                circles: this.state.circles,
                currentStep: this.state.currentStep,
                leversVisible: this.state.leversVisible
            };

            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Erreur sauvegarde localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);

                // Restaurer les post-its
                if (data.postits && data.postits.length > 0) {
                    this.state.postits = data.postits;
                }

                // Restaurer les leviers personnalisés
                if (data.levers && data.levers.length > 0) {
                    this.state.levers = [...IKIGAI_LEVERS, ...data.levers];
                }

                // Restaurer les cercles et l'étape
                if (data.circles) {
                    this.state.circles = data.circles;
                }
                if (data.currentStep !== undefined) {
                    this.state.currentStep = data.currentStep;
                }
                if (data.leversVisible !== undefined) {
                    this.state.leversVisible = data.leversVisible;
                }

                return true;
            }
        } catch (error) {
            console.warn('Erreur chargement localStorage:', error);
        }
        return false;
    }

    hasStoredData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                return data.postits && data.postits.length > 0;
            }
        } catch (error) {
            console.warn('Erreur vérification localStorage:', error);
        }
        return false;
    }

    showRestoreOption() {
        // Créer une notification pour proposer la restauration
        const notification = document.createElement('div');
        notification.className = 'restore-notification';
        notification.innerHTML = `
                <div class="restore-content">
                    <h4>💾 Données sauvegardées trouvées</h4>
                    <p>Voulez-vous restaurer votre travail précédent ?</p>
                    <div class="restore-actions">
                        <button id="restore-yes" class="btn-success">✅ Restaurer</button>
                        <button id="restore-no" class="btn-danger">❌ Nouveau</button>
                    </div>
                </div>
            `;

        // Styles inline pour la notification
        notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                z-index: 2000;
                text-align: center;
                border: 3px solid #667eea;
            `;

        document.body.appendChild(notification);

        // Événements
        document.getElementById('restore-yes').addEventListener('click', () => {
            this.restoreFromStorage();
            document.body.removeChild(notification);
        });

        document.getElementById('restore-no').addEventListener('click', () => {
            this.clearStorage();
            document.body.removeChild(notification);
        });
    }

    restoreFromStorage() {
        // Passer directement à l'écran principal si on a des données
        if (this.state.postits.length > 0 || this.state.circles.length > 0) {
            document.getElementById('welcome-screen').classList.remove('active');
            document.getElementById('main-screen').classList.add('active');

            // Restaurer les cercles
            if (this.state.circles.length > 0) {
                this.redrawCircles();
            }

            // Restaurer les post-its
            if (this.state.postits.length > 0) {
                this.recreatePostits();
            }

            // Restaurer la visibilité des leviers
            if (this.state.leversVisible) {
                const button = document.getElementById('toggle-levers-visibility');
                if (button) {
                    button.innerHTML = '👁️';
                    button.title = 'Masquer les leviers sur le canvas';
                    this.showLeversOnCanvas();
                }
            }

            // Afficher un message de confirmation
            this.showCircleNotification(
                "✅ Données restaurées avec succès !",
                null,
                3000
            );
        }
    }

    redrawCircles() {
        const svg = document.getElementById('ikigai-svg');
        svg.innerHTML = ''; // Vider le SVG

        // Redessiner tous les cercles instantanément
        this.circles.forEach((circle) => {
            const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            circleElement.setAttribute('cx', circle.cx);
            circleElement.setAttribute('cy', circle.cy);
            circleElement.setAttribute('r', circle.r);
            circleElement.setAttribute('fill', circle.color);
            circleElement.setAttribute('fill-opacity', '0.6');
            circleElement.setAttribute('stroke', circle.color);
            circleElement.setAttribute('stroke-width', '3');
            circleElement.classList.add('ikigai-circle');

            svg.appendChild(circleElement);
            this.addCircleLabel(circle);
        });
    }

    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Erreur suppression localStorage:', error);
        }
    }



    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            postits: this.state.postits,
            levers: this.state.levers.filter(l => l.custom)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ikigai-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                this.state.postits = data.postits || [];

                if (data.levers) {
                    this.state.levers = [...IKIGAI_LEVERS, ...data.levers];
                }

                this.recreatePostits();
                this.renderLevers();

                alert('Import réussi ! 🎉');
            } catch (error) {
                alert('Erreur d\'import : ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    recreatePostits() {
        // Supprimer les post-its existants
        document.querySelectorAll('.postit').forEach(p => p.remove());

        // Recréer depuis l'état
        this.state.postits.forEach(postitData => {
            const canvas = document.querySelector('.ikigai-canvas');
            const postit = document.createElement('div');
            postit.className = `postit ${postitData.type}`;

            // Utiliser les coordonnées sauvegardées, pas les nouvelles coordonnées centrées
            postit.style.left = postitData.x + 'px';
            postit.style.top = postitData.y + 'px';

            // Créer un conteneur pour le texte
            const textContainer = document.createElement('div');
            textContainer.className = 'postit-text';
            textContainer.textContent = postitData.content;
            postit.appendChild(textContainer);

            const colors = {
                satisfied: '#d4edda',
                neutral: '#fff3cd',
                frustrated: '#f8d7da'
            };
            postit.style.background = colors[postitData.type];

            canvas.appendChild(postit);
            this.addPostitActions(postit);
            this.makePostitDraggable(postit);
            this.makePostitClickable(postit);
            this.makePostitDroppable(postit);

            // Mettre à jour l'affichage avec les leviers attachés
            this.updatePostitDisplay(postit, postitData);
        });
    }

    showSummary() {
        const summary = document.getElementById('summary');
        const content = document.getElementById('summary-content');

        const satisfied = this.state.postits.filter(p => p.type === 'satisfied');
        const neutral = this.state.postits.filter(p => p.type === 'neutral');
        const frustrated = this.state.postits.filter(p => p.type === 'frustrated');

        // Fonction pour formater un post-it avec ses leviers
        const formatPostitWithLevers = (postit) => {
            let result = `  • ${postit.content}`;
            if (postit.attachedLevers && postit.attachedLevers.length > 0) {
                result += '\n' + postit.attachedLevers.map(lever =>
                    `    ${this.getLeverIcon(lever)} ${lever.title}: ${lever.desc}`
                ).join('\n');
            }
            return result;
        };

        const emojiText = `
    🎯 **MON IKIGAI - ${new Date().toLocaleDateString()}**

    ✅ **BESOINS NOURRIS** (${satisfied.length})
    ${satisfied.map(p => formatPostitWithLevers(p)).join('\n\n')}

    ⚖️ **NON NOURRIS MAIS OK** (${neutral.length})
    ${neutral.map(p => formatPostitWithLevers(p)).join('\n\n')}

    ❌ **BESOINS NON NOURRIS** (${frustrated.length})
    ${frustrated.map(p => formatPostitWithLevers(p)).join('\n\n')}

    ---

    ⚙️ **TOUS MES LEVIERS D'ACTION DISPONIBLES**
    ${this.state.levers.map(l => `  • ${l.icon || '⚙️'} ${l.title}: ${l.desc}`).join('\n')}

    ---

    💡 **PROCHAINES ÉTAPES**
    ${frustrated.length > 0 ? '🔥 Focus sur les besoins non nourris en priorité!' : '🎉 Bel équilibre ! Consolidez vos acquis.'}
    `;

        content.innerHTML = `
                <div class="modal-summary-block">${emojiText}</div>
                <button onclick="navigator.clipboard.writeText(\`${emojiText.replace(/`/g, '\\`')}\`).then(() => alert('📋 Copié dans le presse-papier!'))" class="btn-info" style="margin-right: 10px;">📋 Copier le texte</button>
            `;

        summary.classList.remove('hidden');
    }

    closeSummary() {
        document.getElementById('summary').classList.add('hidden');
    }

    handleResponsiveChanges() {
        // Gérer les changements de taille d'écran
        window.addEventListener('resize', () => {
            // Nettoyer les classes de clic sur changement de taille
            document.querySelectorAll('.postit.clicked').forEach(p => {
                p.classList.remove('clicked');
            });
        });
    }

    reset() {
        if (confirm('🔄 Recommencer complètement ? (Tous les post-its seront perdus)')) {
            // Supprimer tous les post-its
            document.querySelectorAll('.postit').forEach(p => p.remove());

            // Vider le SVG
            document.getElementById('ikigai-svg').innerHTML = '';

            // Reset state
            this.state.postits = [];
            this.state.circles = [];
            this.state.currentStep = 0;
            this.state.levers = [...IKIGAI_LEVERS];

            // Vider le localStorage
            this.clearStorage();

            // Retour à l'accueil
            document.getElementById('main-screen').classList.remove('active');
            document.getElementById('welcome-screen').classList.add('active');
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.app = new IkigaiApp();
});
