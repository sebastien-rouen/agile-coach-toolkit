/**
 * Estimation Learning Tool
 * Interactive cards with animals for learning estimation systems
 */

// Data: Animals with their weights and estimation values
const ANIMALS = {
    fibonacci: [
        { emoji: '🐜', name: 'Fourmi', weight: 0.002, value: 1 },
        { emoji: '🐝', name: 'Abeille', weight: 0.1, value: 2 },
        { emoji: '🐿️', name: 'Écureuil', weight: 0.5, value: 3 },
        { emoji: '🐇', name: 'Lapin', weight: 2, value: 5 },
        { emoji: '🦊', name: 'Renard', weight: 5, value: 8 },
        { emoji: '🐑', name: 'Mouton', weight: 70, value: 13 },
        { emoji: '🦌', name: 'Cerf', weight: 100, value: 21 },
        { emoji: '🐄', name: 'Vache', weight: 700, value: 34 },
        { emoji: '🦏', name: 'Rhinocéros', weight: 1400, value: 55 },
        { emoji: '🐘', name: 'Éléphant', weight: 5000, value: 89 }
    ],
    tshirt: [
        { emoji: '🐜', name: 'Fourmi', weight: 0.002, value: 'XS' },
        { emoji: '🐝', name: 'Abeille', weight: 0.1, value: 'XS' },
        { emoji: '🐿️', name: 'Écureuil', weight: 0.5, value: 'S' },
        { emoji: '🐇', name: 'Lapin', weight: 2, value: 'M' },
        { emoji: '🦊', name: 'Renard', weight: 5, value: 'L' },
        { emoji: '🐑', name: 'Mouton', weight: 70, value: 'XL' },
        { emoji: '🦌', name: 'Cerf', weight: 100, value: 'XL' },
        { emoji: '🐄', name: 'Vache', weight: 700, value: 'XXL' },
        { emoji: '🦏', name: 'Rhinocéros', weight: 1400, value: 'XXL' },
        { emoji: '🐘', name: 'Éléphant', weight: 5000, value: 'XXL' }
    ]
};

// State
let currentMode = 'fibonacci';
let currentCards = [];
let draggedCard = null;
let draggedIndex = null;

// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const cardsBoard = document.getElementById('cardsBoard');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadMode('fibonacci');
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Mode selection
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });

    // Control buttons
    shuffleBtn.addEventListener('click', shuffleCards);
    resetBtn.addEventListener('click', resetCards);
}

/**
 * Switch estimation mode
 */
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    loadMode(mode);
}

/**
 * Load cards for a specific mode
 */
function loadMode(mode) {
    const animals = ANIMALS[mode];
    currentCards = [...animals].sort(() => Math.random() - 0.5);
    renderCards();
}

/**
 * Render cards on the board
 */
function renderCards() {
    cardsBoard.innerHTML = '';
    
    currentCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardsBoard.appendChild(cardElement);
    });
}

/**
 * Render cards with animation on swap
 */
function renderCardsWithAnimation(fromIndex, toIndex) {
    const cards = cardsBoard.querySelectorAll('.card');
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    
    // Add moving class to cards that will move
    cards.forEach((card, index) => {
        if (index >= minIndex && index <= maxIndex) {
            card.classList.add('moving');
        }
    });
    
    // Re-render after a brief delay to allow animation to complete
    setTimeout(() => {
        renderCards();
    }, 500);
}

/**
 * Create a card element
 */
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.draggable = true;
    cardDiv.dataset.index = index;
    
    cardDiv.innerHTML = `
        <div class="card-emoji">${card.emoji}</div>
        <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-value">${card.value}</div>
            <div class="card-weight">${formatWeight(card.weight)}</div>
        </div>
    `;

    // Drag events
    cardDiv.addEventListener('dragstart', handleDragStart);
    cardDiv.addEventListener('dragend', handleDragEnd);
    cardDiv.addEventListener('dragover', handleDragOver);
    cardDiv.addEventListener('drop', handleDrop);
    cardDiv.addEventListener('dragenter', handleDragEnter);
    cardDiv.addEventListener('dragleave', handleDragLeave);

    // Touch events for mobile
    cardDiv.addEventListener('touchstart', handleTouchStart);
    cardDiv.addEventListener('touchmove', handleTouchMove);
    cardDiv.addEventListener('touchend', handleTouchEnd);

    return cardDiv;
}

/**
 * Format weight for display
 */
function formatWeight(weight) {
    if (weight < 1) {
        return `${(weight * 1000).toFixed(0)}g`;
    } else if (weight < 1000) {
        return `${weight.toFixed(1)}kg`;
    } else {
        return `${(weight / 1000).toFixed(1)}t`;
    }
}

/**
 * Drag and Drop Handlers
 */
function handleDragStart(e) {
    draggedCard = this;
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    cardsBoard.classList.remove('drag-over');
    removeDropIndicator();
    draggedCard = null;
    draggedIndex = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    if (this !== draggedCard) {
        cardsBoard.classList.add('drag-over');
        showDropIndicator(this);
    }
}

function handleDragLeave(e) {
    // Only remove if leaving the cards board entirely
    if (e.target === cardsBoard) {
        cardsBoard.classList.remove('drag-over');
        removeDropIndicator();
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    if (this === draggedCard) return;

    const targetIndex = parseInt(this.dataset.index);
    
    // Swap cards
    if (draggedIndex !== targetIndex) {
        const temp = currentCards[draggedIndex];
        currentCards[draggedIndex] = currentCards[targetIndex];
        currentCards[targetIndex] = temp;
        
        // Re-render with animation
        renderCardsWithAnimation(draggedIndex, targetIndex);
    }

    cardsBoard.classList.remove('drag-over');
    removeDropIndicator();
}

/**
 * Show drop indicator at target position
 */
function showDropIndicator(targetCard) {
    removeDropIndicator();
    
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    
    const rect = targetCard.getBoundingClientRect();
    const boardRect = cardsBoard.getBoundingClientRect();
    
    // Position indicator at the left edge of target card
    const leftPosition = rect.left - boardRect.left;
    indicator.style.left = leftPosition + 'px';
    
    cardsBoard.appendChild(indicator);
}

/**
 * Remove drop indicator
 */
function removeDropIndicator() {
    const indicator = cardsBoard.querySelector('.drop-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Touch Handlers for Mobile
 */
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    draggedCard = this;
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!draggedCard) return;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!draggedCard) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // Find card at touch end position
    const element = document.elementFromPoint(touchEndX, touchEndY);
    const targetCard = element?.closest('.card');

    if (targetCard && targetCard !== draggedCard) {
        const targetIndex = parseInt(targetCard.dataset.index);
        
        // Swap cards
        if (draggedIndex !== targetIndex) {
            const temp = currentCards[draggedIndex];
            currentCards[draggedIndex] = currentCards[targetIndex];
            currentCards[targetIndex] = temp;
            renderCards();
        }
    }

    draggedCard.classList.remove('dragging');
    draggedCard = null;
    draggedIndex = null;
}

/**
 * Shuffle cards randomly
 */
function shuffleCards() {
    currentCards.sort(() => Math.random() - 0.5);
    renderCards();
    
    // Visual feedback
    shuffleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        shuffleBtn.style.transform = 'rotate(0deg)';
    }, 300);
}

/**
 * Reset cards to sorted order
 */
function resetCards() {
    const animals = ANIMALS[currentMode];
    currentCards = [...animals];
    renderCards();
}

/**
 * Keyboard support
 */
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        shuffleCards();
    }
});
