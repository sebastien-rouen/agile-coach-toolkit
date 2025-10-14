/**
 * Script de validation des migrations PocketBase
 * 
 * Vérifie :
 * - Syntaxe JavaScript des fichiers de migration
 * - Présence des fonctions migrate() et rollback
 * - Ordre des timestamps
 * 
 * Usage: node bdd/validate-migrations.js
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, 'pb_migrations');
const REQUIRED_PATTERN = /^(\d+)_(.+)\.js$/;

console.log('🔍 Validation des migrations PocketBase\n');

// Lire tous les fichiers de migration
const files = fs.readdirSync(MIGRATIONS_DIR)
  .filter(file => file.endsWith('.js'))
  .sort();

if (files.length === 0) {
  console.error('❌ Aucun fichier de migration trouvé');
  process.exit(1);
}

console.log(`📁 ${files.length} fichiers de migration trouvés\n`);

let errors = 0;
let warnings = 0;
const timestamps = [];

files.forEach((file, index) => {
  console.log(`\n[${index + 1}/${files.length}] ${file}`);
  
  // Vérifier le format du nom
  const match = file.match(REQUIRED_PATTERN);
  if (!match) {
    console.error(`  ❌ Format de nom invalide (attendu: {timestamp}_{description}.js)`);
    errors++;
    return;
  }
  
  const [, timestamp, description] = match;
  timestamps.push(parseInt(timestamp));
  
  // Lire le contenu
  const filePath = path.join(MIGRATIONS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier la syntaxe de base
  const checks = [
    {
      name: 'Fonction migrate()',
      pattern: /migrate\s*\(\s*\(/,
      required: true
    },
    {
      name: 'Fonction rollback',
      pattern: /,\s*\(\s*\w+\s*\)\s*=>\s*{/,
      required: true
    },
    {
      name: 'Référence types.d.ts',
      pattern: /\/\/\/\s*<reference path="\.\.\/pb_data\/types\.d\.ts"\s*\/>/,
      required: false
    },
    {
      name: 'Collection ou Record',
      pattern: /(new Collection|new Record|dao\.findCollectionByNameOrId)/,
      required: true
    }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      if (check.required) {
        console.error(`  ❌ ${check.name} manquant`);
        errors++;
      } else {
        console.warn(`  ⚠️  ${check.name} manquant (recommandé)`);
        warnings++;
      }
    }
  });
  
  // Vérifier la taille du fichier
  const lines = content.split('\n').length;
  console.log(`  📊 ${lines} lignes`);
  
  if (lines > 500) {
    console.warn(`  ⚠️  Fichier volumineux (${lines} lignes)`);
    warnings++;
  }
});

// Vérifier l'ordre des timestamps
console.log('\n\n📅 Vérification de l\'ordre des timestamps');
let timestampErrors = 0;
for (let i = 1; i < timestamps.length; i++) {
  if (timestamps[i] <= timestamps[i - 1]) {
    console.error(`  ❌ Timestamp ${timestamps[i]} <= ${timestamps[i - 1]}`);
    timestampErrors++;
  }
}

if (timestampErrors === 0) {
  console.log('  ✅ Timestamps en ordre croissant');
} else {
  errors += timestampErrors;
}

// Résumé
console.log('\n\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ');
console.log('='.repeat(50));
console.log(`Fichiers analysés : ${files.length}`);
console.log(`Erreurs          : ${errors}`);
console.log(`Avertissements   : ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Validation échouée');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Validation réussie avec avertissements');
  process.exit(0);
} else {
  console.log('\n✅ Validation réussie');
  process.exit(0);
}
