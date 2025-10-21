// Admin Panel JavaScript

class AdminPanel {
    constructor() {
        this.currentSection = 'categories';
        this.categories = [];
        this.contents = [];
        this.currentEditItem = null;
        this.deleteCallback = null;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadCategories();
        await this.loadContents();
        await this.loadTools();
        this.renderCategories();
        this.renderContents();
        this.renderTools();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('nav-back')) {
                    e.preventDefault();
                    const section = item.dataset.section;
                    this.switchSection(section);
                }
            });
        });

        // Category buttons
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        // Content buttons
        document.getElementById('add-content-btn').addEventListener('click', () => {
            this.openContentModal();
        });

        // Tool buttons
        document.getElementById('add-tool-btn').addEventListener('click', () => {
            this.openCreateToolModal();
        });

        // Category filter
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterContents(e.target.value);
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Fermer seulement la modale parente du bouton cliqué
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Forms
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        document.getElementById('content-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContent();
        });

        document.getElementById('create-tool-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTool();
        });

        // Delete confirmation
        document.getElementById('confirm-delete').addEventListener('click', () => {
            if (this.deleteCallback) {
                this.deleteCallback();
            }
        });

        // Editor toolbar
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleEditorAction(action);
            });
        });

        // Icon picker
        document.getElementById('open-icon-picker').addEventListener('click', () => {
            this.openIconPicker();
        });

        // Color picker
        const colorInput = document.getElementById('category-color');
        const colorHex = document.getElementById('category-color-hex');
        const colorPreview = document.getElementById('color-preview');

        colorInput.addEventListener('input', (e) => {
            const color = e.target.value;
            colorHex.value = color;
            colorPreview.style.background = color;
        });

        colorHex.addEventListener('input', (e) => {
            let color = e.target.value;
            if (!color.startsWith('#')) color = '#' + color;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                colorInput.value = color;
                colorPreview.style.background = color;
            }
        });

        // Color presets
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                colorInput.value = color;
                colorHex.value = color;
                colorPreview.style.background = color;
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    switchSection(section) {
        this.currentSection = section;

        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/routes-admin/categories');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.categories = await response.json();

            // Trier par ordre (double sécurité)
            this.categories.sort((a, b) => (a.order || 999) - (b.order || 999));
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Erreur lors du chargement des catégories', 'error');
        }
    }

    async loadContents() {
        this.contents = [];

        for (const category of this.categories) {
            if (category.articles) {
                for (const article of category.articles) {
                    this.contents.push({
                        ...article,
                        category: category.category,
                        categoryTitle: category.title
                    });
                }
            }
        }
    }

    async loadTools() {
        try {
            // Charger depuis config.json
            const response = await fetch('../config/config.json');
            const config = await response.json();

            this.tools = config.tools || [];

            // Trier par ordre
            this.tools.sort((a, b) => (a.order || 999) - (b.order || 999));
        } catch (error) {
            console.error('Error loading tools:', error);
            this.tools = [];
        }
    }

    renderCategories() {
        const list = document.getElementById('categories-list');
        list.innerHTML = '';

        // Sort by order
        const sortedCategories = [...this.categories].sort((a, b) => (a.order || 999) - (b.order || 999));

        sortedCategories.forEach((category, index) => {
            const item = this.createCategoryItem(category, index);
            list.appendChild(item);
        });

        // Setup drag and drop
        this.setupDragAndDrop();

        // Update category filter
        const filter = document.getElementById('category-filter');
        const contentCategory = document.getElementById('content-category');

        filter.innerHTML = '<option value="">Toutes les catégories</option>';
        contentCategory.innerHTML = '<option value="">Sélectionner une catégorie</option>';

        sortedCategories.forEach(cat => {
            const option1 = document.createElement('option');
            option1.value = cat.category;
            option1.textContent = cat.title;
            filter.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = cat.category;
            option2.textContent = cat.title;
            contentCategory.appendChild(option2);
        });
    }

    createCategoryItem(category, index) {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.draggable = true;
        item.dataset.categoryId = category.category;
        item.dataset.order = category.order || index + 1;

        const articlesCount = category.articles ? category.articles.length : 0;
        const toolsCount = category.tools ? category.tools.length : 0;

        item.innerHTML = `
            <div class="category-drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="category-item-icon" style="background: ${category.color}">
                <i class="${category.icon.startsWith('fa') ? category.icon : 'fas fa-' + category.icon}"></i>
            </div>
            <div class="category-item-content">
                <div class="category-item-header">
                    <h3 class="category-item-title">${category.title}</h3>
                    <span class="category-item-order">#${category.order || index + 1}</span>
                </div>
                <div class="category-item-description">
                    ${category.description || 'Aucune description'}
                </div>
                <div class="category-item-stats">
                    <div class="stat-item">
                        <i class="fas fa-file-alt"></i>
                        <span>${articlesCount} articles</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-tools"></i>
                        <span>${toolsCount} outils</span>
                    </div>
                </div>
            </div>
            <div class="category-item-actions">
                <button class="btn-icon" onclick="adminPanel.editCategory('${category.category}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn-icon btn-danger" onclick="adminPanel.deleteCategory('${category.category}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        `;

        return item;
    }

    renderContents(filter = '') {
        const list = document.getElementById('contents-list');
        list.innerHTML = '';

        const filteredContents = filter
            ? this.contents.filter(c => c.category === filter)
            : this.contents;

        if (filteredContents.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Aucun contenu trouvé</p>';
            return;
        }

        // Sort by order
        filteredContents.sort((a, b) => (a.order || 999) - (b.order || 999));

        // Group by category if no filter
        if (!filter) {
            const grouped = {};
            filteredContents.forEach(content => {
                if (!grouped[content.category]) {
                    grouped[content.category] = [];
                }
                grouped[content.category].push(content);
            });

            // Render grouped by category
            Object.keys(grouped).forEach(categoryId => {
                // Essayer plusieurs champs pour trouver la catégorie
                const category = this.categories.find(c => 
                    c.category === categoryId || c.id === categoryId
                );
                
                // Debug
                if (!category) {
                    console.warn('Catégorie non trouvée pour groupe:', categoryId);
                    console.log('Categories:', this.categories.map(c => ({ id: c.id, category: c.category, title: c.title })));
                }
                
                const categoryTitle = category ? category.title : categoryId;
                const categoryColor = category ? category.color : '#3b82f6';
                const categoryIconRaw = category ? category.icon : 'folder';
                const categoryIcon = categoryIconRaw.startsWith('fa') ? categoryIconRaw : 'fas fa-' + categoryIconRaw;

                const groupHeader = document.createElement('div');
                groupHeader.className = 'content-group-header';
                groupHeader.style.borderLeftColor = categoryColor;
                groupHeader.innerHTML = `
                    <h3 style="color: ${categoryColor}">
                        <i class="${categoryIcon}"></i> ${categoryTitle}
                    </h3>
                    <span class="content-group-count">${grouped[categoryId].length} contenu(s)</span>
                `;
                list.appendChild(groupHeader);

                grouped[categoryId].forEach(content => {
                    const item = this.createContentItem(content);
                    list.appendChild(item);
                });
            });
        } else {
            // Render flat list when filtered
            filteredContents.forEach(content => {
                const item = this.createContentItem(content);
                list.appendChild(item);
            });
        }

        // Setup drag and drop for contents
        this.setupContentsDragAndDrop();
    }

    createContentItem(content) {
        const item = document.createElement('div');
        item.className = 'content-item';
        item.draggable = true;
        item.dataset.contentId = content.id;
        item.dataset.categoryId = content.category;
        item.dataset.order = content.order || 1;

        // Fonction d'échappement HTML pour prévenir XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };

        // Note: Les tags affichés ici viennent de index.json de la catégorie
        // Ils peuvent différer des tags dans le markdown
        // Pour voir les vrais tags du markdown, cliquez sur "Modifier"
        const tags = content.tags ? content.tags.map(tag =>
            `<span class="tag">${escapeHtml(tag)}</span>`
        ).join('') : '';

        // Priorité : Titre du markdown, sinon ID
        const displayTitle = content.title || content.id || 'Sans titre';
        const safeTitle = escapeHtml(displayTitle);
        const safeCategoryTitle = escapeHtml(content.categoryTitle);
        const safeFile = escapeHtml(content.file);
        
        // Récupérer l'icône et la couleur de la catégorie
        // Essayer de trouver par 'id' ou 'category'
        const category = this.categories.find(cat => 
            cat.id === content.category || cat.category === content.category
        );
        
        // Debug: afficher les données pour comprendre la structure
        if (!category) {
            console.warn('Catégorie non trouvée pour:', content.category);
            console.log('Categories disponibles:', this.categories.map(c => ({ id: c.id, category: c.category })));
        }
        
        const categoryIconRaw = category ? category.icon : 'file';
        const categoryIcon = categoryIconRaw.startsWith('fa') ? categoryIconRaw : 'fas fa-' + categoryIconRaw;
        const categoryColor = category ? category.color : '#2196f3';

        console.log(content);
        item.innerHTML = `
            <div class="content-drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="content-item-icon" style="background: ${categoryColor}">
                <i class="${categoryIcon}"></i>
            </div>
            <div class="content-info">
                <div class="content-title">${safeTitle}</div>
                <div class="content-meta">
                    <span><i class="fas fa-folder"></i> ${safeCategoryTitle}</span>
                    <span><i class="fas fa-file"></i> ${safeFile}</span>
                    <span><i class="fas fa-sort-numeric-up"></i> Ordre: ${content.order}</span>
                </div>
                ${tags ? `<div class="content-tags">${tags}</div>` : ''}
            </div>
            <div class="content-actions">
                <a href="../content.html?cat=${content.category}&file=${content.file.replace('.md', '')}" 
                   class="btn-icon" 
                   target="_blank" 
                   title="Voir le contenu">
                    <i class="fas fa-external-link-alt"></i> Voir
                </a>
                <button class="btn-icon" onclick="adminPanel.editContent('${content.category}', '${content.id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn-icon btn-danger" onclick="adminPanel.deleteContent('${content.category}', '${content.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return item;
    }

    filterContents(categoryId) {
        this.renderContents(categoryId);
    }

    renderTools() {
        const list = document.getElementById('tools-list');
        list.innerHTML = '';

        if (this.tools.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Aucun outil trouvé</p>';
            return;
        }

        this.tools.forEach((tool, index) => {
            const item = this.createToolItem(tool, index);
            list.appendChild(item);
        });

        // Setup drag and drop for tools
        this.setupToolsDragAndDrop();
    }

    createToolItem(tool, index) {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.draggable = true;
        item.dataset.toolId = tool.id;
        item.dataset.order = index + 1;

        item.innerHTML = `
            <div class="tool-drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="tool-item-icon">${tool.icon}</div>
            <div class="tool-item-content">
                <div class="tool-item-header">
                    <h3 class="tool-item-name">${tool.name}</h3>
                    <span class="tool-item-order">#${index + 1}</span>
                </div>
                <div class="tool-item-path">${tool.path}</div>
                <div class="tool-item-description">${tool.description}</div>
            </div>
            <div class="tool-item-actions">
                <a href="../${tool.path}" target="_blank" class="btn-icon">
                    <i class="fas fa-external-link-alt"></i> Ouvrir
                </a>
            </div>
        `;

        return item;
    }

    openCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const form = document.getElementById('category-form');
        const title = document.getElementById('category-modal-title');
        const colorPreview = document.getElementById('color-preview');
        const iconPreview = document.getElementById('icon-preview');

        form.reset();

        if (categoryId) {
            const category = this.categories.find(c => c.category === categoryId);
            if (category) {
                title.textContent = 'Modifier la Catégorie';
                document.getElementById('category-id').value = category.category;
                document.getElementById('category-name').value = category.category;
                document.getElementById('category-title').value = category.title;
                document.getElementById('category-description').value = category.description || '';
                document.getElementById('category-icon').value = category.icon || 'fas fa-folder';
                document.getElementById('category-color').value = category.color || '#00d4ff';
                document.getElementById('category-color-hex').value = category.color || '#00d4ff';

                // Update previews
                colorPreview.style.background = category.color || '#00d4ff';
                iconPreview.innerHTML = `<i class="${category.icon || 'fas fa-folder'}"></i>`;
            }
        } else {
            title.textContent = 'Nouvelle Catégorie';
            colorPreview.style.background = '#00d4ff';
            iconPreview.innerHTML = '<i class="fas fa-folder"></i>';
        }

        modal.classList.add('active');
    }

    async openContentModal(categoryId = null, contentId = null) {
        const modal = document.getElementById('content-modal');
        const form = document.getElementById('content-form');
        const title = document.getElementById('content-modal-title');

        form.reset();
        document.getElementById('markdown-preview').style.display = 'none';
        document.getElementById('content-markdown').style.display = 'block';

        // Setup category change listener BEFORE setting values
        this.setupCategoryOrderUpdate();

        if (categoryId && contentId) {
            const content = this.contents.find(c => c.category === categoryId && c.id === contentId);
            if (content) {
                title.textContent = `Modifier : ${content.title || content.id}`;
                document.getElementById('content-id').value = content.id;
                document.getElementById('content-file').value = content.file;
                document.getElementById('content-original-file').value = content.file;

                // Priorité : Titre du markdown, sinon ID
                document.getElementById('content-title').value = content.title || content.id || '';

                document.getElementById('content-tags').value = content.tags ? content.tags.join(', ') : '';
                document.getElementById('content-order').value = content.order || 1;

                // Set category AFTER setupCategoryOrderUpdate to preserve the value
                document.getElementById('content-category').value = content.category;

                // Load markdown content
                try {
                    const response = await fetch(`/api/routes-admin/contents/${categoryId}/${contentId}`);
                    if (response.ok) {
                        const data = await response.json();
                        document.getElementById('content-markdown').value = data.markdown || '';
                    }
                } catch (error) {
                    console.error('Error loading markdown:', error);
                    this.showNotification('Erreur lors du chargement du contenu', 'error');
                }
            }
        } else {
            title.textContent = 'Nouveau Contenu';

            // Setup auto-fill for filename from title
            this.setupTitleToFilenameAutoFill();

            if (categoryId) {
                document.getElementById('content-category').value = categoryId;

                // Set default order to number of contents in this category + 1
                const categoryContents = this.contents.filter(c => c.category === categoryId);
                const nextOrder = categoryContents.length + 1;
                document.getElementById('content-order').value = nextOrder;
            } else {
                // If no category selected, order = 1
                document.getElementById('content-order').value = 1;
            }
        }

        // Setup markdown change listener for tag extraction
        this.setupMarkdownTagExtraction();

        // Setup drag & drop pour les images dans le markdown
        if (window.uploadManager) {
            uploadManager.setupMarkdownDragAndDrop();
        }

        modal.classList.add('active');
    }

    setupCategoryOrderUpdate() {
        const categorySelect = document.getElementById('content-category');
        const orderInput = document.getElementById('content-order');
        const contentId = document.getElementById('content-id').value;

        // Remove existing listener
        const newCategorySelect = categorySelect.cloneNode(true);
        categorySelect.parentNode.replaceChild(newCategorySelect, categorySelect);

        newCategorySelect.addEventListener('change', () => {
            const selectedCategory = newCategorySelect.value;

            // Validate category selection
            if (selectedCategory) {
                newCategorySelect.style.borderColor = '';
                newCategorySelect.style.backgroundColor = '';

                // Only update order for new content
                if (!contentId) {
                    const categoryContents = this.contents.filter(c => c.category === selectedCategory);
                    const nextOrder = categoryContents.length + 1;
                    orderInput.value = nextOrder;
                }
            } else {
                newCategorySelect.style.borderColor = '#ef4444';
                newCategorySelect.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';

                if (!contentId) {
                    orderInput.value = 1;
                }
            }
        });
    }

    setupTitleToFilenameAutoFill() {
        const titleInput = document.getElementById('content-title');
        const fileInput = document.getElementById('content-file');
        const contentId = document.getElementById('content-id').value;

        // Only auto-fill for new content
        if (!contentId) {
            // Remove any existing listeners to avoid duplicates
            const newTitleInput = titleInput.cloneNode(true);
            titleInput.parentNode.replaceChild(newTitleInput, titleInput);

            const handler = () => {
                const title = newTitleInput.value.trim();
                if (title) {
                    // Convert title to filename: lowercase, replace spaces with hyphens, remove special chars
                    const filename = title
                        .toLowerCase()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                        .replace(/\s+/g, '-') // Replace spaces with hyphens
                        .replace(/-+/g, '-') // Replace multiple hyphens with single
                        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

                    fileInput.value = filename;
                }
            };

            newTitleInput.addEventListener('input', handler);
            newTitleInput.addEventListener('blur', handler);
        }
    }

    setupMarkdownTagExtraction() {
        const markdownInput = document.getElementById('content-markdown');

        // Remove existing listener to avoid duplicates
        const newMarkdownInput = markdownInput.cloneNode(true);
        markdownInput.parentNode.replaceChild(newMarkdownInput, markdownInput);

        // Works for both new and edit modes
        newMarkdownInput.addEventListener('blur', () => {
            this.extractMetadataFromMarkdown();
        });
    }

    extractMetadataFromMarkdown() {
        const markdownContent = document.getElementById('content-markdown').value;
        const titleInput = document.getElementById('content-title');
        const fileInput = document.getElementById('content-file');
        const tagsInput = document.getElementById('content-tags');
        const categorySelect = document.getElementById('content-category');
        const orderInput = document.getElementById('content-order');
        const contentId = document.getElementById('content-id').value;
        const currentCategory = categorySelect.value;

        // Extract category: value (remove quotes if present)
        const categoryMatch = markdownContent.match(/^category:\s*(.+)$/m);
        if (categoryMatch && categoryMatch[1]) {
            let categoryValue = categoryMatch[1].trim();
            // Remove surrounding quotes (single or double)
            categoryValue = categoryValue.replace(/^["']|["']$/g, '');

            // Check if category exists in the list
            const categoryExists = Array.from(categorySelect.options).some(option => option.value === categoryValue);

            if (categoryExists) {
                const categoryChanged = currentCategory !== categoryValue;
                categorySelect.value = categoryValue;
                categorySelect.style.borderColor = '';
                categorySelect.style.backgroundColor = '';

                // Update order only if:
                // - It's a new content (no contentId)
                // - OR the category has changed in edit mode
                if (!contentId || categoryChanged) {
                    const categoryContents = this.contents.filter(c => c.category === categoryValue);
                    const nextOrder = categoryContents.length + 1;
                    orderInput.value = nextOrder;
                }
            } else {
                // Category doesn't exist, highlight in red
                categorySelect.style.borderColor = '#ef4444';
                categorySelect.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }
        }

        // Extract id: value
        const idMatch = markdownContent.match(/^id:\s*(.+)$/m);
        if (idMatch && idMatch[1]) {
            const idValue = idMatch[1].trim();

            // Convert id to filename: lowercase, replace spaces with hyphens, remove special chars
            const filename = idValue
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

            fileInput.value = filename + '.md';
        }

        // Extract title: value (remove quotes if present)
        const titleMatch = markdownContent.match(/^title:\s*(.+)$/m);
        if (titleMatch && titleMatch[1]) {
            let titleValue = titleMatch[1].trim();
            // Remove surrounding quotes (single or double)
            titleValue = titleValue.replace(/^["']|["']$/g, '');

            // Always update title from markdown (even in edit mode)
            titleInput.value = titleValue;
        }

        // Extract tags: [tag1, tag2, "tag with spaces", tag3]
        const tagsMatch = markdownContent.match(/tags:\s*\[(.*?)\]/);
        if (tagsMatch && tagsMatch[1]) {
            // Parse the tags array
            const tagsString = tagsMatch[1];
            const tags = [];

            // Match quoted strings and unquoted words
            const tagMatches = tagsString.matchAll(/(?:"([^"]+)"|'([^']+)'|([^,\s]+))/g);

            for (const match of tagMatches) {
                const tag = (match[1] || match[2] || match[3]).trim();
                if (tag) {
                    tags.push(tag);
                }
            }

            if (tags.length > 0) {
                // Always update tags from markdown (even in edit mode)
                tagsInput.value = tags.join(', ');
            }
        }

        // Validate category selection
        this.validateCategorySelection();
    }

    validateCategorySelection() {
        const categorySelect = document.getElementById('content-category');

        if (!categorySelect.value) {
            categorySelect.style.borderColor = '#ef4444';
            categorySelect.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        } else {
            categorySelect.style.borderColor = '';
            categorySelect.style.backgroundColor = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentEditItem = null;
        this.deleteCallback = null;
    }

    async saveCategory() {
        const categoryId = document.getElementById('category-id').value;
        const categoryName = document.getElementById('category-name').value.trim();
        const categoryTitle = document.getElementById('category-title').value.trim();
        const categoryDescription = document.getElementById('category-description').value.trim();
        const categoryIcon = document.getElementById('category-icon').value.trim();
        const categoryColor = document.getElementById('category-color').value;

        // Get the next order for new categories, or keep existing order for updates
        let categoryOrder = 1;
        if (categoryId) {
            const existingCategory = this.categories.find(c => c.category === categoryId);
            categoryOrder = existingCategory ? existingCategory.order || 1 : 1;
        } else {
            categoryOrder = Math.max(...this.categories.map(c => c.order || 0), 0) + 1;
        }

        if (!categoryName || !categoryTitle) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const categoryData = {
            category: categoryName,
            title: categoryTitle,
            description: categoryDescription,
            icon: categoryIcon || 'fas fa-folder',
            color: categoryColor,
            order: categoryOrder,
            articles: [],
            tools: [],
            templates: []
        };

        try {
            const response = await fetch('/api/routes-admin/categories', {
                method: categoryId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                this.showNotification(
                    categoryId ? 'Catégorie modifiée avec succès' : 'Catégorie créée avec succès',
                    'success'
                );
                this.closeAllModals();
                await this.loadCategories();
                await this.loadContents();
                this.renderCategories();
                this.renderContents();
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            this.showNotification('Erreur lors de la sauvegarde de la catégorie', 'error');
        }
    }

    async saveContent() {
        const contentId = document.getElementById('content-id').value;
        const category = document.getElementById('content-category').value;
        const categorySelect = document.getElementById('content-category');
        const file = document.getElementById('content-file').value.trim();
        const originalFile = document.getElementById('content-original-file').value;
        const title = document.getElementById('content-title').value.trim();
        const tagsInput = document.getElementById('content-tags').value.trim();
        const order = parseInt(document.getElementById('content-order').value) || 1;
        const markdown = document.getElementById('content-markdown').value;

        if (!category || !file || !title || !markdown) {
            // Highlight category if empty
            if (!category) {
                categorySelect.style.borderColor = '#ef4444';
                categorySelect.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        const contentData = {
            id: contentId || this.generateId(title),
            category,
            file: file.endsWith('.md') ? file : `${file}.md`,
            originalFile: originalFile || null,
            title,
            tags,
            order,
            markdown
        };

        try {
            const response = await fetch('/api/routes-admin/contents', {
                method: contentId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentData)
            });

            if (response.ok) {
                this.showNotification(
                    contentId ? 'Contenu modifié avec succès' : 'Contenu créé avec succès',
                    'success'
                );
                this.closeAllModals();
                await this.loadCategories();
                await this.loadContents();
                this.renderCategories();
                this.renderContents();
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            this.showNotification('Erreur lors de la sauvegarde du contenu', 'error');
        }
    }

    editCategory(categoryId) {
        this.openCategoryModal(categoryId);
    }

    editContent(categoryId, contentId) {
        this.openContentModal(categoryId, contentId);
    }

    deleteCategory(categoryId) {
        const category = this.categories.find(c => c.category === categoryId);
        if (!category) return;

        const articlesCount = category.articles ? category.articles.length : 0;

        document.getElementById('delete-message').textContent =
            `Êtes-vous sûr de vouloir supprimer la catégorie "${category.title}" ? ${articlesCount > 0 ? `Cette action supprimera également ${articlesCount} article(s).` : ''}`;

        this.deleteCallback = async () => {
            try {
                const response = await fetch(`/api/routes-admin/categories/${categoryId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.showNotification('Catégorie supprimée avec succès', 'success');
                    this.closeAllModals();
                    await this.loadCategories();
                    await this.loadContents();
                    this.renderCategories();
                    this.renderContents();
                } else {
                    throw new Error('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                this.showNotification('Erreur lors de la suppression de la catégorie', 'error');
            }
        };

        document.getElementById('delete-modal').classList.add('active');
    }

    deleteContent(categoryId, contentId) {
        const content = this.contents.find(c => c.category === categoryId && c.id === contentId);
        if (!content) return;

        document.getElementById('delete-message').textContent =
            `Êtes-vous sûr de vouloir supprimer le contenu "${content.title}" ?`;

        this.deleteCallback = async () => {
            try {
                const response = await fetch(`/api/routes-admin/contents/${categoryId}/${contentId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.showNotification('Contenu supprimé avec succès', 'success');
                    this.closeAllModals();
                    await this.loadCategories();
                    await this.loadContents();
                    this.renderCategories();
                    this.renderContents();
                } else {
                    throw new Error('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Error deleting content:', error);
                this.showNotification('Erreur lors de la suppression du contenu', 'error');
            }
        };

        document.getElementById('delete-modal').classList.add('active');
    }

    handleEditorAction(action) {
        const textarea = document.getElementById('content-markdown');
        const preview = document.getElementById('markdown-preview');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement = '';

        switch (action) {
            case 'bold':
                replacement = `**${selectedText || 'texte en gras'}**`;
                break;
            case 'italic':
                replacement = `*${selectedText || 'texte en italique'}*`;
                break;
            case 'heading':
                replacement = `## ${selectedText || 'Titre'}`;
                break;
            case 'link':
                replacement = `[${selectedText || 'texte du lien'}](url)`;
                break;
            case 'code':
                replacement = `\`${selectedText || 'code'}\``;
                break;
            case 'list':
                replacement = `- ${selectedText || 'élément de liste'}`;
                break;
            case 'preview':
                if (preview.style.display === 'none') {
                    // Extraire le contenu sans les métadonnées frontmatter
                    let content = textarea.value;
                    
                    // Supprimer le frontmatter (entre --- et ---)
                    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
                    content = content.replace(frontmatterRegex, '');
                    
                    preview.innerHTML = marked.parse(content);
                    preview.style.display = 'block';
                    textarea.style.display = 'none';
                } else {
                    preview.style.display = 'none';
                    textarea.style.display = 'block';
                }
                return;
        }

        if (replacement) {
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start, start + replacement.length);
        }
    }

    generateId(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc3545' : '#58a6ff'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }


    setupDragAndDrop() {
        const items = document.querySelectorAll('.category-item');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.categoryId);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                document.querySelectorAll('.category-item').forEach(i => {
                    i.classList.remove('drag-over');
                });
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                const dragging = document.querySelector('.dragging');
                if (dragging && dragging !== item) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', async (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');

                const draggedId = e.dataTransfer.getData('text/plain');
                const targetId = item.dataset.categoryId;

                if (draggedId !== targetId) {
                    await this.reorderCategories(draggedId, targetId);
                }
            });
        });
    }

    async reorderCategories(draggedId, targetId) {
        const draggedIndex = this.categories.findIndex(c => c.category === draggedId);
        const targetIndex = this.categories.findIndex(c => c.category === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Reorder array
        const [draggedItem] = this.categories.splice(draggedIndex, 1);
        this.categories.splice(targetIndex, 0, draggedItem);

        // Update order values
        this.categories.forEach((cat, index) => {
            cat.order = index + 1;
        });

        // Save new order via API (updates both config.json and index.json files)
        try {
            const categoryIds = this.categories.map(cat => cat.category);

            const response = await fetch('/api/routes-admin/categories/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: categoryIds })
            });

            if (response.ok) {
                this.showNotification('Ordre des catégories mis à jour', 'success');
                this.renderCategories();
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error reordering categories:', error);
            this.showNotification('Erreur lors de la réorganisation', 'error');
        }
    }

    openIconPicker() {
        const modal = document.getElementById('icon-picker-modal');
        const grid = document.getElementById('icon-grid');
        const searchInput = document.getElementById('icon-search-input');

        // Font Awesome icons list (popular ones)
        const icons = [
            'fa-folder', 'fa-users', 'fa-rocket', 'fa-chart-line', 'fa-lightbulb',
            'fa-cogs', 'fa-graduation-cap', 'fa-heart', 'fa-shield-alt', 'fa-star',
            'fa-book', 'fa-clipboard', 'fa-wrench', 'fa-palette', 'fa-compass',
            'fa-building', 'fa-crown', 'fa-package', 'fa-layers', 'fa-target',
            'fa-fire', 'fa-bolt', 'fa-cloud', 'fa-database', 'fa-code',
            'fa-laptop', 'fa-mobile', 'fa-tablet', 'fa-desktop', 'fa-server',
            'fa-network-wired', 'fa-wifi', 'fa-signal', 'fa-rss', 'fa-podcast',
            'fa-microphone', 'fa-video', 'fa-camera', 'fa-image', 'fa-file',
            'fa-folder-open', 'fa-save', 'fa-download', 'fa-upload', 'fa-share',
            'fa-link', 'fa-paperclip', 'fa-tag', 'fa-tags', 'fa-bookmark',
            'fa-flag', 'fa-bell', 'fa-envelope', 'fa-inbox', 'fa-comment',
            'fa-comments', 'fa-bullhorn', 'fa-quote-left', 'fa-quote-right', 'fa-pencil-alt',
            'fa-pen', 'fa-highlighter', 'fa-eraser', 'fa-paint-brush', 'fa-magic',
            'fa-wand-magic', 'fa-sparkles', 'fa-gift', 'fa-trophy', 'fa-medal',
            'fa-award', 'fa-certificate', 'fa-ribbon', 'fa-thumbs-up', 'fa-thumbs-down',
            'fa-check', 'fa-times', 'fa-plus', 'fa-minus', 'fa-equals',
            'fa-divide', 'fa-percentage', 'fa-infinity', 'fa-circle', 'fa-square',
            'fa-triangle', 'fa-hexagon', 'fa-diamond', 'fa-shapes', 'fa-cube',
            'fa-cubes', 'fa-box', 'fa-boxes', 'fa-archive', 'fa-briefcase',
            'fa-suitcase', 'fa-shopping-cart', 'fa-shopping-bag', 'fa-credit-card', 'fa-money-bill',
            'fa-coins', 'fa-wallet', 'fa-piggy-bank', 'fa-chart-bar', 'fa-chart-pie',
            'fa-chart-area', 'fa-analytics', 'fa-graph', 'fa-sitemap', 'fa-project-diagram',
            'fa-tasks', 'fa-list', 'fa-list-ul', 'fa-list-ol', 'fa-th',
            'fa-th-large', 'fa-th-list', 'fa-table', 'fa-columns', 'fa-grip-horizontal',
            'fa-grip-vertical', 'fa-ellipsis-h', 'fa-ellipsis-v', 'fa-bars', 'fa-sliders-h'
        ];

        const renderIcons = (filter = '') => {
            const filteredIcons = filter
                ? icons.filter(icon => icon.includes(filter.toLowerCase()))
                : icons;

            grid.innerHTML = filteredIcons.map(icon => `
                <div class="icon-item" data-icon="fas ${icon}">
                    <i class="fas ${icon}"></i>
                    <span>${icon.replace('fa-', '')}</span>
                </div>
            `).join('');

            // Add click handlers
            grid.querySelectorAll('.icon-item').forEach(item => {
                item.addEventListener('click', () => {
                    const iconClass = item.dataset.icon;
                    document.getElementById('category-icon').value = iconClass;
                    document.getElementById('icon-preview').innerHTML = `<i class="${iconClass}"></i>`;
                    modal.classList.remove('active');
                });
            });
        };

        renderIcons();

        searchInput.value = '';
        searchInput.addEventListener('input', (e) => {
            renderIcons(e.target.value);
        });

        modal.classList.add('active');
    }

    setupToolsDragAndDrop() {
        const items = document.querySelectorAll('.tool-item');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.toolId);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                document.querySelectorAll('.tool-item').forEach(i => {
                    i.classList.remove('drag-over');
                });
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                const dragging = document.querySelector('.dragging');
                if (dragging && dragging !== item) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');

                const draggedId = e.dataTransfer.getData('text/plain');
                const targetId = item.dataset.toolId;

                if (draggedId !== targetId) {
                    this.reorderTools(draggedId, targetId);
                }
            });
        });
    }

    async reorderTools(draggedId, targetId) {
        const draggedIndex = this.tools.findIndex(t => t.id === draggedId);
        const targetIndex = this.tools.findIndex(t => t.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Reorder array
        const [draggedItem] = this.tools.splice(draggedIndex, 1);
        this.tools.splice(targetIndex, 0, draggedItem);

        // Update order values
        this.tools.forEach((tool, index) => {
            tool.order = index + 1;
        });

        // Save via API
        try {
            const toolIds = this.tools.map(t => t.id);

            const response = await fetch('/api/routes-admin/tools/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tools: toolIds })
            });

            if (response.ok) {
                this.showNotification('Ordre des outils mis à jour', 'success');
                this.renderTools();
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error reordering tools:', error);
            this.showNotification('Erreur lors de la réorganisation', 'error');
        }
    }

    setupContentsDragAndDrop() {
        const items = document.querySelectorAll('.content-item');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    contentId: item.dataset.contentId,
                    categoryId: item.dataset.categoryId
                }));
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                document.querySelectorAll('.content-item').forEach(i => {
                    i.classList.remove('drag-over');
                });
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                const dragging = document.querySelector('.dragging');
                if (dragging && dragging !== item) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', async (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');

                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const targetData = {
                    contentId: item.dataset.contentId,
                    categoryId: item.dataset.categoryId
                };

                if (data.contentId !== targetData.contentId && data.categoryId === targetData.categoryId) {
                    await this.reorderContents(data.categoryId, data.contentId, targetData.contentId);
                }
            });
        });
    }

    async reorderContents(categoryId, draggedId, targetId) {
        // Find category
        const category = this.categories.find(c => c.category === categoryId);
        if (!category || !category.articles) return;

        const draggedIndex = category.articles.findIndex(a => a.id === draggedId);
        const targetIndex = category.articles.findIndex(a => a.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Reorder array
        const [draggedItem] = category.articles.splice(draggedIndex, 1);
        category.articles.splice(targetIndex, 0, draggedItem);

        // Update order values
        category.articles.forEach((article, index) => {
            article.order = index + 1;
        });

        // Save via API
        try {
            const response = await fetch('/api/routes-admin/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });

            if (response.ok) {
                this.showNotification('Ordre des contenus mis à jour', 'success');
                await this.loadContents();
                this.renderContents(document.getElementById('category-filter').value);
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error reordering contents:', error);
            this.showNotification('Erreur lors de la réorganisation', 'error');
        }
    }

    openCreateToolModal() {
        const modal = document.getElementById('create-tool-modal');
        const form = document.getElementById('create-tool-form');

        form.reset();
        modal.classList.add('active');
    }

    async createTool() {
        const toolId = document.getElementById('tool-id').value.trim();
        const toolName = document.getElementById('tool-name').value.trim();
        const toolIcon = document.getElementById('tool-icon').value.trim() || '🎯';
        const toolDescription = document.getElementById('tool-description').value.trim();
        const includePocketbase = document.getElementById('tool-pocketbase').checked;

        if (!toolId || !toolName) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const toolData = {
            id: toolId,
            name: toolName,
            icon: toolIcon,
            description: toolDescription,
            includePocketbase
        };

        try {
            const response = await fetch('/api/routes-admin/tools/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(toolData)
            });

            if (response.ok) {
                this.showNotification('Outil créé avec succès', 'success');
                this.closeAllModals();
                await this.loadTools();
                this.renderTools();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error('Error creating tool:', error);
            this.showNotification(error.message || 'Erreur lors de la création de l\'outil', 'error');
        }
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});
