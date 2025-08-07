/**
 * Theme Manager Component
 * Handles dark/light theme switching with system preference detection
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    this.storageKey = 'agile-toolkit-theme';
    this.toggleButton = null;
    
    this.init();
  }

  init() {
    try {
      // Get theme toggle button
      this.toggleButton = document.querySelector('.theme-toggle');
      
      if (!this.toggleButton) {
        console.warn('Theme toggle button not found');
        // Still continue initialization for programmatic usage
      }

      // Load saved theme or detect system preference
      this.loadTheme();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Apply initial theme
      this.applyTheme(this.currentTheme);
      
      console.log('✅ Theme manager initialized with theme:', this.currentTheme);
    } catch (error) {
      console.error('❌ Error initializing theme manager:', error);
    }
  }

  loadTheme() {
    // Try to load from localStorage first
    const savedTheme = localStorage.getItem(this.storageKey);
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.currentTheme = savedTheme;
    } else {
      // Detect system preference
      this.currentTheme = this.systemPreference.matches ? 'dark' : 'light';
    }
  }

  setupEventListeners() {
    // Theme toggle button click
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => {
        this.toggle();
      });
    }

    // Listen for system theme changes
    this.systemPreference.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem(this.storageKey);
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme, false); // Don't save to localStorage
      }
    });

    // Keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }

  setTheme(theme, saveToStorage = true) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Invalid theme:', theme);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    
    if (saveToStorage) {
      this.saveTheme(theme);
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: theme }
    }));
  }

  applyTheme(theme) {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button
    this.updateToggleButton(theme);
    
    // Update meta theme-color for PWA
    this.updateMetaThemeColor(theme);
    
    // Add transition class for smooth theme switching
    document.documentElement.classList.add('theme-transitioning');
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  }

  updateToggleButton(theme) {
    if (!this.toggleButton) return;

    const icon = this.toggleButton.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    // Update aria-label
    const label = theme === 'light' 
      ? 'Activer le mode sombre' 
      : 'Activer le mode clair';
    this.toggleButton.setAttribute('aria-label', label);
    this.toggleButton.setAttribute('title', label);
  }

  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Use CSS custom property values
      const color = theme === 'light' ? '#3b82f6' : '#1e293b';
      metaThemeColor.setAttribute('content', color);
    }
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
      // Fallback: dispatch event for other components to handle persistence
      window.dispatchEvent(new CustomEvent('themeStorageError', {
        detail: { theme: theme, error: error }
      }));
    }
  }

  // Public methods
  getCurrentTheme() {
    return this.currentTheme;
  }

  getSystemPreference() {
    return this.systemPreference.matches ? 'dark' : 'light';
  }

  // Reset to system preference
  resetToSystem() {
    localStorage.removeItem(this.storageKey);
    const systemTheme = this.getSystemPreference();
    this.setTheme(systemTheme, false);
  }

  // Check if user has manually set a theme
  hasUserPreference() {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch (error) {
      return false;
    }
  }

  // Get available themes
  getAvailableThemes() {
    return ['light', 'dark'];
  }

  // Check if theme is valid
  isValidTheme(theme) {
    return this.getAvailableThemes().includes(theme);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}