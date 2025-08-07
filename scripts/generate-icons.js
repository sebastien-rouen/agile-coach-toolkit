#!/usr/bin/env node

/**
 * Script de génération d'icônes PWA
 * Génère toutes les tailles d'icônes nécessaires pour la PWA
 */

const fs = require('fs');
const path = require('path');

class IconGenerator {
  constructor() {
    this.iconsDir = path.join(__dirname, '..', 'assets', 'icons');
    this.sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    this.shortcutSizes = [192];
  }

  async generate() {
    console.log('🎨 Génération des icônes PWA...');
    
    try {
      // Créer le dossier icons s'il n'existe pas
      if (!fs.existsSync(this.iconsDir)) {
        fs.mkdirSync(this.iconsDir, { recursive: true });
      }

      // Générer les icônes principales
      await this.generateMainIcons();
      
      // Générer les icônes de raccourcis
      await this.generateShortcutIcons();
      
      // Générer le favicon
      await this.generateFavicon();
      
      // Générer l'icône Apple Touch
      await this.generateAppleTouchIcon();
      
      console.log('✅ Génération des icônes terminée !');
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      process.exit(1);
    }
  }

  async generateMainIcons() {
    console.log('📱 Génération des icônes principales...');
    
    for (const size of this.sizes) {
      const iconPath = path.join(this.iconsDir, `icon-${size}.png`);
      
      if (!fs.existsSync(iconPath)) {
        await this.createIcon(size, iconPath);
        console.log(`✓ Icône ${size}x${size} créée`);
      } else {
        console.log(`✓ Icône ${size}x${size} existe déjà`);
      }
    }
  }

  async generateShortcutIcons() {
    console.log('🔗 Génération des icônes de raccourcis...');
    
    const shortcuts = [
      { name: 'example-mapping', emoji: '🗺️', color: '#10b981' },
      { name: 'planning-poker', emoji: '🎲', color: '#f59e0b' },
      { name: 'agile-fluency', emoji: '📊', color: '#8b5cf6' },
      { name: 'stats', emoji: '📈', color: '#ef4444' }
    ];

    for (const shortcut of shortcuts) {
      const iconPath = path.join(this.iconsDir, `shortcut-${shortcut.name}.png`);
      
      if (!fs.existsSync(iconPath)) {
        await this.createShortcutIcon(shortcut, iconPath);
        console.log(`✓ Icône raccourci ${shortcut.name} créée`);
      }
    }
  }

  async generateFavicon() {
    console.log('🌐 Génération du favicon...');
    
    const faviconPath = path.join(this.iconsDir, 'favicon.ico');
    
    if (!fs.existsSync(faviconPath)) {
      // Créer un favicon simple
      await this.createFavicon(faviconPath);
      console.log('✓ Favicon créé');
    }
  }

  async generateAppleTouchIcon() {
    console.log('🍎 Génération de l\'icône Apple Touch...');
    
    const appleTouchPath = path.join(this.iconsDir, 'apple-touch-icon.png');
    
    if (!fs.existsSync(appleTouchPath)) {
      await this.createIcon(180, appleTouchPath, true);
      console.log('✓ Icône Apple Touch créée');
    }
  }

  async createIcon(size, outputPath, isApple = false) {
    // Créer une icône SVG simple avec l'emoji 🚀
    const svg = this.generateIconSVG(size, isApple);
    
    // Pour cette démo, on sauvegarde le SVG
    // Dans un vrai projet, on utiliserait une lib comme sharp pour convertir en PNG
    const svgPath = outputPath.replace('.png', '.svg');
    fs.writeFileSync(svgPath, svg);
    
    // Créer un placeholder PNG simple (en réalité, il faudrait convertir le SVG)
    this.createPlaceholderPNG(outputPath, size);
  }

  generateIconSVG(size, isApple = false) {
    const bgColor = isApple ? '#000000' : '#3b82f6';
    const radius = isApple ? size * 0.2 : size * 0.1;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#grad)"/>
  <text x="${size/2}" y="${size/2 + size*0.1}" text-anchor="middle" fill="white" font-size="${size*0.4}" font-family="Arial, sans-serif">🚀</text>
  <text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="white" font-size="${size*0.08}" font-family="Arial, sans-serif" font-weight="bold">AGILE</text>
</svg>`;
  }

  async createShortcutIcon(shortcut, outputPath) {
    const size = 192;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${shortcut.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.darkenColor(shortcut.color)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="20" ry="20" fill="url(#grad)"/>
  <text x="${size/2}" y="${size/2 + 20}" text-anchor="middle" fill="white" font-size="80" font-family="Arial, sans-serif">${shortcut.emoji}</text>
</svg>`;

    const svgPath = outputPath.replace('.png', '.svg');
    fs.writeFileSync(svgPath, svg);
    this.createPlaceholderPNG(outputPath, size);
  }

  createPlaceholderPNG(outputPath, size) {
    // Créer un fichier PNG placeholder simple
    // En production, on utiliserait une vraie conversion SVG->PNG
    const placeholder = `PNG placeholder for ${size}x${size} icon`;
    fs.writeFileSync(outputPath, placeholder);
  }

  async createFavicon(outputPath) {
    // Créer un favicon simple
    const faviconData = 'ICO favicon placeholder';
    fs.writeFileSync(outputPath, faviconData);
  }

  darkenColor(color) {
    // Fonction simple pour assombrir une couleur hex
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Méthode pour créer des vraies icônes PNG (nécessite sharp ou canvas)
  async createRealPNG(svgContent, outputPath, size) {
    // Cette méthode nécessiterait sharp ou une autre lib de conversion
    // Pour l'instant, on crée juste un placeholder
    console.log(`📝 Création PNG ${size}x${size} -> ${outputPath}`);
    
    // Placeholder pour la démo
    fs.writeFileSync(outputPath, `PNG ${size}x${size} placeholder`);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const generator = new IconGenerator();
  generator.generate();
}

module.exports = IconGenerator;