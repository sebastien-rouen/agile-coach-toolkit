/**
 * utils.js - Fonctions utilitaires globales
 */

/**
 * Debounce - limite la fréquence d'exécution d'une fonction
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - exécute une fonction au maximum toutes les X ms
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Formater une date de manière lisible
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formater un temps de lecture (nombre de mots → temps)
 */
function calculateReadTime(wordCount) {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min de lecture`;
}

/**
 * Compter les mots dans un texte
 */
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

/**
 * Slugify - transformer un texte en slug URL-friendly
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')        // Remplacer espaces et _ par -
    .replace(/[^\w\-]+/g, '')       // Supprimer caractères non alphanumériques
    .replace(/\-\-+/g, '-')         // Remplacer -- par -
    .replace(/^-+/, '')             // Supprimer - au début
    .replace(/-+$/, '');            // Supprimer - à la fin
}

/**
 * Copier du texte dans le presse-papiers
 */
async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Erreur copie clipboard:', err);
      return false;
    }
  } else {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Obtenir un paramètre d'URL
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Mettre à jour un paramètre d'URL sans recharger
 */
function updateUrlParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Vérifier si on est sur mobile
 */
function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

/**
 * Vérifier si on est en mode sombre
 */
function isDarkMode() {
  return document.documentElement.dataset.theme === 'dark' ||
         (!document.documentElement.dataset.theme && 
          window.matchMedia('(prefers-color-scheme: dark)').matches);
}

/**
 * Toggle thème clair/sombre
 */
function toggleTheme() {
  console.log('🔄 toggleTheme appelé');
  
  const currentTheme = document.documentElement.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  console.log(`🎨 Changement: ${currentTheme} → ${newTheme}`);
  
  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
  
  // Mettre à jour l'icône du bouton
  updateThemeIcon(newTheme);
  
  console.log(`✅ Thème changé: ${newTheme}`);
}

/**
 * Mettre à jour l'icône du bouton de thème
 */
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const svg = themeToggle.querySelector('svg');
  if (!svg) return;
  
  if (theme === 'light') {
    // Icône lune pour passer en mode sombre
    svg.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
    themeToggle.setAttribute('aria-label', 'Passer en mode sombre');
  } else {
    // Icône soleil pour passer en mode clair
    svg.innerHTML = '<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>';
    themeToggle.setAttribute('aria-label', 'Passer en mode clair');
  }
}

/**
 * Initialiser le thème au chargement
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  
  console.log(`🎨 Thème initialisé: ${theme}`);
}

/**
 * Initialiser le bouton de thème (après chargement des partials)
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Mettre à jour l'icône initiale
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    updateThemeIcon(currentTheme);
    
    // Event listener pour le bouton de thème
    themeToggle.addEventListener('click', toggleTheme);
    
    console.log(`🎨 Bouton thème initialisé`);
  } else {
    console.warn('⚠️ Bouton themeToggle non trouvé');
  }
}

// Initialiser le thème dès que possible (avant le rendu)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Initialiser le bouton après le chargement des partials
document.addEventListener('partialsLoaded', initThemeToggle);

/**
 * Smooth scroll vers un élément
 */
function scrollToElement(element, offset = 0) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  
  if (!element) return;
  
  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

/**
 * Charger un script externe dynamiquement
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Générer un ID unique
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Vérifier si un élément est visible dans le viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Animation d'apparition au scroll
 */
function observeAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  
  if (elements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(el => observer.observe(el));
}

// Initialiser les animations au chargement
document.addEventListener('DOMContentLoaded', observeAnimations);

console.log('✅ utils.js chargé');
