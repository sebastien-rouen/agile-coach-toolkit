/**
 * markdown-parser.js - Parser Markdown vers HTML
 * Utilise marked.js pour un parsing robuste
 */

// Configuration de marked.js (si disponible)
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
    sanitize: false
  });
}

/**
 * Parser les tableaux Markdown
 */
function parseMarkdownTables(text) {
  const lines = text.split('\n');
  const result = [];
  let inTable = false;
  let tableLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecter le début d'un tableau (ligne avec |)
    if (line.includes('|') && !inTable) {
      // Vérifier si la ligne suivante est un séparateur
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && /^\|?[\s\-:|]+\|?$/.test(nextLine)) {
        inTable = true;
        tableLines = [line];
        continue;
      }
    }
    
    // Continuer à collecter les lignes du tableau
    if (inTable && line.includes('|')) {
      tableLines.push(line);
      continue;
    }
    
    // Fin du tableau
    if (inTable && !line.includes('|')) {
      result.push(convertTableToHtml(tableLines));
      tableLines = [];
      inTable = false;
    }
    
    // Ligne normale
    if (!inTable) {
      result.push(lines[i]);
    }
  }
  
  // Si le tableau va jusqu'à la fin
  if (inTable && tableLines.length > 0) {
    result.push(convertTableToHtml(tableLines));
  }
  
  return result.join('\n');
}

/**
 * Convertir un tableau Markdown en HTML
 */
function convertTableToHtml(lines) {
  if (lines.length < 2) return lines.join('\n');
  
  // Extraire les cellules de chaque ligne
  const rows = lines.map(line => {
    return line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
  });
  
  // La première ligne est le header
  const headers = rows[0];
  
  // La deuxième ligne est le séparateur (on la saute)
  // Les lignes suivantes sont les données
  const dataRows = rows.slice(2);
  
  // Construire le HTML
  let html = '<table>\n';
  
  // Header
  html += '  <thead>\n    <tr>\n';
  headers.forEach(header => {
    html += `      <th>${header}</th>\n`;
  });
  html += '    </tr>\n  </thead>\n';
  
  // Body
  if (dataRows.length > 0) {
    html += '  <tbody>\n';
    dataRows.forEach(row => {
      html += '    <tr>\n';
      row.forEach(cell => {
        html += `      <td>${cell}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n';
  }
  
  html += '</table>';
  
  return html;
}

/**
 * Parser les listes (ordonnées et non ordonnées)
 */
function parseLists(text) {
  const lines = text.split('\n');
  const result = [];
  let inList = false;
  let listType = null; // 'ul' ou 'ol'
  let listItems = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Liste non ordonnée (- ou *)
    if (trimmed.match(/^[-*]\s+(.+)$/)) {
      const content = trimmed.substring(2).trim();
      
      if (!inList || listType !== 'ul') {
        // Fermer la liste précédente si nécessaire
        if (inList) {
          result.push(`<${listType}>${listItems.join('')}</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ul';
      }
      
      listItems.push(`<li>${content}</li>`);
      continue;
    }
    
    // Liste ordonnée (1. 2. etc.)
    if (trimmed.match(/^\d+\.\s+(.+)$/)) {
      const content = trimmed.replace(/^\d+\.\s+/, '');
      
      if (!inList || listType !== 'ol') {
        // Fermer la liste précédente si nécessaire
        if (inList) {
          result.push(`<${listType}>${listItems.join('')}</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ol';
      }
      
      listItems.push(`<li>${content}</li>`);
      continue;
    }
    
    // Fin de la liste
    if (inList && trimmed !== '') {
      result.push(`<${listType}>${listItems.join('')}</${listType}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
    
    // Ligne normale
    if (!inList) {
      result.push(line);
    }
  }
  
  // Si la liste va jusqu'à la fin
  if (inList && listItems.length > 0) {
    result.push(`<${listType}>${listItems.join('')}</${listType}>`);
  }
  
  return result.join('\n');
}

/**
 * Parser les blockquotes (citations)
 */
function parseBlockquotes(text) {
  const lines = text.split('\n');
  const result = [];
  let inBlockquote = false;
  let blockquoteLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Ligne de citation (commence par >)
    if (trimmed.startsWith('>')) {
      inBlockquote = true;
      // Retirer le > et l'espace qui suit
      const content = trimmed.substring(1).trim();
      blockquoteLines.push(content);
      continue;
    }
    
    // Ligne vide dans une citation (continuer la citation)
    if (inBlockquote && trimmed === '') {
      blockquoteLines.push('');
      continue;
    }
    
    // Fin de la citation (ligne non vide qui ne commence pas par >)
    if (inBlockquote && trimmed !== '' && !trimmed.startsWith('>')) {
      // Convertir les lignes de citation en HTML
      const blockquoteContent = blockquoteLines
        .filter(l => l !== '') // Retirer les lignes vides
        .join('<br>'); // Joindre avec des <br> pour préserver les sauts de ligne
      result.push(`<blockquote>${blockquoteContent}</blockquote>`);
      blockquoteLines = [];
      inBlockquote = false;
      // Ajouter la ligne actuelle
      result.push(line);
      continue;
    }
    
    // Ligne normale
    if (!inBlockquote) {
      result.push(line);
    }
  }
  
  // Si la citation va jusqu'à la fin
  if (inBlockquote && blockquoteLines.length > 0) {
    const blockquoteContent = blockquoteLines
      .filter(l => l !== '')
      .join('<br>');
    result.push(`<blockquote>${blockquoteContent}</blockquote>`);
  }
  
  return result.join('\n');
}

/**
 * Parser Markdown → HTML (version améliorée avec marked.js)
 */
function parseMarkdownAdvanced(content) {
  // Extraire les métadonnées YAML (front matter)
  const frontMatterRegex = /^---\s*[\r\n]+(.*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/s;
  const match = content.match(frontMatterRegex);
  
  let metadata = {};
  let markdownContent = content;
  
  if (match) {
    try {
      // Utiliser js-yaml si disponible, sinon parser basique
      if (typeof jsyaml !== 'undefined') {
        metadata = jsyaml.load(match[1]) || {};
      } else {
        // Fallback : parser YAML basique
        metadata = parseYAMLBasic(match[1]);
      }
      markdownContent = match[2];
    } catch (error) {
      console.warn('⚠️ Erreur lors du parsing YAML:', error);
    }
  }
  
  // Convertir le Markdown en HTML
  let htmlContent;
  if (typeof marked !== 'undefined') {
    // Utiliser marked.js si disponible
    htmlContent = marked.parse(markdownContent);
  } else {
    // Fallback : utiliser notre parser maison
    htmlContent = parseMarkdown(markdownContent);
  }
  
  // Générer un extrait
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  const excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
  
  return {
    ...metadata,
    content: htmlContent,
    excerpt: metadata.excerpt || excerpt
  };
}

/**
 * Parser YAML basique (fallback si js-yaml n'est pas disponible)
 */
function parseYAMLBasic(yamlString) {
  const metadata = {};
  yamlString.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Gérer les arrays [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
      } else {
        // Retirer les guillemets
        metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });
  return metadata;
}

/**
 * Parser Markdown → HTML (version basique, fallback)
 */
function parseMarkdown(markdown) {
  let html = markdown;
  
  // Échapper le HTML existant
  html = escapeHtml(html);
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Gras et italique
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Blocs de code (```langue ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'plaintext';
    
    // Détecter les blocs Mermaid
    if (language === 'mermaid') {
      return `<div class="mermaid">${code.trim()}</div>`;
    }
    
    return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
  });
  
  // Liens [texte](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Images ![alt](url) avec légendes stylisées
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (alt && alt.trim()) {
      // Si il y a un texte alt, créer une figure avec légende
      return `<figure class="image-with-caption">
        <img src="${src}" alt="${alt}" loading="lazy">
        <figcaption>${alt}</figcaption>
      </figure>`;
    } else {
      // Sinon, image simple
      return `<img src="${src}" alt="" loading="lazy">`;
    }
  });
  
  // Tableaux (avant les autres conversions)
  html = parseMarkdownTables(html);
  
  // Blockquotes (parser les blocs multi-lignes)
  html = parseBlockquotes(html);
  
  // Listes (parser les blocs multi-lignes)
  html = parseLists(html);
  
  // Lignes horizontales
  html = html.replace(/^---$/gim, '<hr>');
  html = html.replace(/^\*\*\*$/gim, '<hr>');
  
  // Paragraphes (lignes séparées par une ligne vide)
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para) return '';
    
    // Ne pas wrapper les balises de bloc
    if (para.startsWith('<h') || 
        para.startsWith('<ul') || 
        para.startsWith('<ol') || 
        para.startsWith('<pre') || 
        para.startsWith('<blockquote') ||
        para.startsWith('<table') ||
        para.startsWith('<hr')) {
      return para;
    }
    
    return `<p>${para}</p>`;
  }).join('\n\n');
  
  // Sauts de ligne simples UNIQUEMENT dans les paragraphes
  // Ne pas ajouter de <br> dans les tableaux, listes, etc.
  html = html.replace(/<p>(.*?)<\/p>/gs, (match, content) => {
    // Remplacer les \n par <br> uniquement dans les paragraphes
    return `<p>${content.replace(/\n/g, '<br>')}</p>`;
  });
  
  return html;
}

/**
 * Échapper le HTML pour éviter les injections
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  // Ne pas échapper à l'intérieur des blocs de code
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Charger et parser un fichier Markdown
 */
async function loadMarkdownFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const markdown = await response.text();
    
    // Utiliser la version avancée si les bibliothèques sont disponibles
    if (typeof marked !== 'undefined') {
      const result = parseMarkdownAdvanced(markdown);
      return result.content;
    } else {
      // Fallback : parser basique
      return parseMarkdown(markdown);
    }
    
  } catch (error) {
    console.error('Erreur chargement Markdown:', error);
    return '<p class="error">Impossible de charger le contenu.</p>';
  }
}

/**
 * Charger et parser un fichier Markdown avec métadonnées
 */
async function loadMarkdownFileWithMetadata(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const markdown = await response.text();
    
    // Utiliser la version avancée
    if (typeof marked !== 'undefined') {
      return parseMarkdownAdvanced(markdown);
    } else {
      // Fallback : extraire manuellement
      const { metadata, content } = extractFrontmatter(markdown);
      return {
        ...metadata,
        content: parseMarkdown(content),
        excerpt: metadata.excerpt || ''
      };
    }
    
  } catch (error) {
    console.error('Erreur chargement Markdown:', error);
    return {
      content: '<p class="error">Impossible de charger le contenu.</p>',
      excerpt: ''
    };
  }
}

/**
 * Extraire les métadonnées YAML du frontmatter (optionnel)
 * Format :
 * ---
 * title: Mon titre
 * date: 2024-01-15
 * tags: [agile, scrum]
 * ---
 */
function extractFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return {
      metadata: {},
      content: markdown
    };
  }
  
  const [, yamlString, content] = match;
  
  // Parser YAML basique (key: value)
  const metadata = {};
  yamlString.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Gérer les arrays [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim());
      } else {
        metadata[key.trim()] = value;
      }
    }
  });
  
  return {
    metadata,
    content: content.trim()
  };
}

/**
 * Générer une table des matières depuis les headers
 */
function generateTOC(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3');
  
  if (headings.length === 0) return null;
  
  const toc = [];
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent;
    const id = `heading-${index}`;
    
    heading.id = id;
    
    toc.push({
      level,
      text,
      id
    });
  });
  
  return toc;
}

/**
 * Styliser les citations avec auteur
 * Détecte les lignes qui commencent par — et les met en forme
 */
function styleBlockquotesWithAuthor() {
  document.querySelectorAll('.markdown-content blockquote').forEach(blockquote => {
    const paragraphs = blockquote.querySelectorAll('p');
    if (paragraphs.length > 0) {
      const lastP = paragraphs[paragraphs.length - 1];
      const text = lastP.textContent.trim();
      
      // Détecter si c'est une ligne d'auteur (commence par — ou –)
      if (text.match(/^[—–]\s*.+/)) {
        lastP.classList.add('blockquote-author');
      }
    }
  });
}

/**
 * Initialiser Mermaid pour le rendu des diagrammes
 */
function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
    
    // Re-render les diagrammes Mermaid après chargement du contenu
    setTimeout(() => {
      mermaid.contentLoaded();
    }, 100);
  }
}

/**
 * Rafraîchir les diagrammes Mermaid (utile après changement de thème)
 */
function refreshMermaid() {
  if (typeof mermaid !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
    mermaid.initialize({ theme });
    
    // Re-render tous les diagrammes
    document.querySelectorAll('.mermaid').forEach((element, index) => {
      const graphDefinition = element.textContent;
      element.removeAttribute('data-processed');
      element.innerHTML = graphDefinition;
    });
    
    mermaid.contentLoaded();
  }
}

/**
 * Styliser les images avec légendes
 * Les styles sont maintenant dans markdown.css
 */
function styleImagesWithCaptions() {
  // Les styles sont maintenant gérés par CSS
  // Cette fonction peut être utilisée pour des ajustements dynamiques si nécessaire
  document.querySelectorAll('.markdown-content figure.image-with-caption').forEach(figure => {
    // Ajouter des classes ou attributs si nécessaire
    figure.setAttribute('data-styled', 'true');
  });
}

/**
 * Ajouter des boutons de copie aux blocs de code
 */
function addCopyButtonsToCodeBlocks() {
  document.querySelectorAll('pre code').forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    
    // Éviter de dupliquer les boutons
    if (pre.querySelector('.copy-button')) return;
    
    // Créer le bouton de copie
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyButton.title = 'Copier le code';
    
    // Positionner le bouton (les styles sont maintenant dans CSS)
    pre.style.position = 'relative';
    
    // Fonction de copie
    copyButton.addEventListener('click', async () => {
      const code = codeBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        
        // Feedback visuel
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `;
        copyButton.style.color = 'var(--success-color, #28a745)';
        
        setTimeout(() => {
          copyButton.innerHTML = originalHTML;
          copyButton.style.color = '';
        }, 2000);
        
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
        
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Feedback visuel
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `;
        copyButton.style.color = 'var(--success-color, #28a745)';
        
        setTimeout(() => {
          copyButton.innerHTML = originalHTML;
          copyButton.style.color = '';
        }, 2000);
      }
    });
    
    pre.appendChild(copyButton);
  });
}

// Appliquer le style après le chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    styleBlockquotesWithAuthor();
    styleImagesWithCaptions();
    initMermaid();
    addCopyButtonsToCodeBlocks();
  });
} else {
  styleBlockquotesWithAuthor();
  styleImagesWithCaptions();
  initMermaid();
  addCopyButtonsToCodeBlocks();
}

// Exporter pour utilisation externe
window.styleBlockquotesWithAuthor = styleBlockquotesWithAuthor;
window.styleImagesWithCaptions = styleImagesWithCaptions;
window.initMermaid = initMermaid;
window.refreshMermaid = refreshMermaid;
window.addCopyButtonsToCodeBlocks = addCopyButtonsToCodeBlocks;

console.log('✅ markdown-parser.js chargé');
