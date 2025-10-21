/**
 * Gestionnaire d'upload d'images pour l'admin
 */

class UploadManager {
    constructor() {
        this.images = [];
        this.currentCategoryId = null;
        this.currentContentId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadImages();
    }

    setupEventListeners() {
        // Bouton pour ouvrir la bibliothèque
        const libraryBtn = document.getElementById("open-library-btn");
        if (libraryBtn) {
            libraryBtn.addEventListener("click", () => this.openLibrary());
        }

        // Bouton pour uploader depuis l'éditeur
        const uploadBtn = document.getElementById("upload-image-btn");
        if (uploadBtn) {
            uploadBtn.addEventListener("click", () => this.openUploadModal());
        }

        // Drag & drop dans le markdown
        this.setupMarkdownDragAndDrop();

        // Fermer les modales
        document.querySelectorAll(".modal-close, .modal-cancel").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const modal = e.target.closest(".modal");
                if (modal) this.closeModal(modal);
            });
        });

        // Upload de fichier
        const uploadForm = document.getElementById("upload-form");
        if (uploadForm) {
            uploadForm.addEventListener("submit", (e) => this.handleUpload(e));
        }

        // Drag & Drop sur la zone d'upload
        this.setupDragAndDrop();

        // Changement de fichier
        const fileInput = document.getElementById("upload-file");
        if (fileInput) {
            fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
        }

        // Clic sur la zone d'upload
        const uploadZone = document.getElementById("upload-zone");
        if (uploadZone) {
            uploadZone.addEventListener("click", () => {
                fileInput?.click();
            });
        }
    }

    setupMarkdownDragAndDrop() {
        const textarea = document.getElementById("content-markdown");
        if (!textarea) return;

        // Empêcher le comportement par défaut
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            textarea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Effet visuel au survol
        ["dragenter", "dragover"].forEach(eventName => {
            textarea.addEventListener(eventName, () => {
                textarea.style.borderColor = "var(--accent-blue, #58a6ff)";
                textarea.style.backgroundColor = "rgba(88, 166, 255, 0.05)";
            });
        });

        ["dragleave", "drop"].forEach(eventName => {
            textarea.addEventListener(eventName, () => {
                textarea.style.borderColor = "";
                textarea.style.backgroundColor = "";
            });
        });

        // Gestion du drop
        textarea.addEventListener("drop", async (e) => {
            const files = e.dataTransfer.files;
            if (files.length === 0) return;

            const file = files[0];
            
            // Vérifier que c'est une image
            if (!file.type.startsWith("image/")) {
                this.showNotification("Veuillez déposer une image", "warning");
                return;
            }

            // Uploader l'image (la validation des IDs est faite dans uploadAndInsertImage)
            await this.uploadAndInsertImage(file, textarea.selectionStart);
        });
    }

    async uploadAndInsertImage(file, cursorPosition) {
        // Récupérer les IDs depuis le formulaire
        const categorySelect = document.getElementById("content-category");
        const contentFile = document.getElementById("content-file");

        const categoryId = categorySelect ? categorySelect.value : null;
        const contentId = contentFile ? contentFile.value.replace(".md", "") : null;

        if (!categoryId || !contentId) {
            this.showNotification("Veuillez d'abord sélectionner une catégorie et définir un nom de fichier", "warning");
            return;
        }

        // Validation
        if (!configLoader.isValidExtension(file.name)) {
            const allowed = configLoader.getAllowedExtensions().join(', ');
            this.showNotification(`Extensions autorisées: ${allowed}`, "warning");
            return;
        }

        const maxSize = configLoader.getMaxFileSize();
        if (file.size > maxSize) {
            const maxSizeMB = configLoader.getMaxFileSizeMB();
            this.showNotification(`L'image ne doit pas dépasser ${maxSizeMB} MB`, "warning");
            return;
        }

        console.log("Upload drag & drop avec:", { categoryId, contentId, filename: file.name });

        // Créer le FormData
        const formData = new FormData();
        formData.append("image", file);
        formData.append("categoryId", categoryId);
        formData.append("contentId", contentId);

        try {
            this.showNotification("Upload en cours...", "info");

            const apiPath = configLoader.getApiPath();
            
            // Log structuré de la requête
            if (window.logger) {
                window.logger.debug("Envoi upload à l'API", {
                    url: `${apiPath}uploads/upload`,
                    categoryId,
                    contentId,
                    filename: file.name,
                    size: file.size
                });
            }

            const response = await fetch(`${apiPath}uploads/upload`, {
                method: "POST",
                body: formData
            });

            if (window.logger) {
                window.logger.debug("Réponse API reçue", {
                    status: response.status,
                    ok: response.ok
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                if (window.logger) {
                    window.logger.error("Erreur HTTP upload", {
                        status: response.status,
                        error: errorText
                    });
                }
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (window.logger) {
                window.logger.info("Upload réussi", {
                    success: data.success,
                    url: data.url
                });
            }

            if (data.success) {
                // Insérer l'image à la position du curseur
                const textarea = document.getElementById("content-markdown");
                if (textarea) {
                    const uploadPath = configLoader.getUploadPath();
                    const imagePath = data.image.path.startsWith(uploadPath) 
                        ? data.image.path 
                        : uploadPath + data.image.path.replace(/^\/+/, '');

                    const markdownImage = `![${file.name.replace(/\.[^/.]+$/, "")}](${imagePath})`;
                    
                    const text = textarea.value;
                    textarea.value = text.substring(0, cursorPosition) + markdownImage + text.substring(cursorPosition);
                    
                    // Replacer le curseur après l'image
                    textarea.selectionStart = textarea.selectionEnd = cursorPosition + markdownImage.length;
                    textarea.focus();
                }

                this.showNotification("Image uploadée et insérée !", "success");
                this.loadImages(); // Recharger la bibliothèque
            } else {
                throw new Error(data.error || "Erreur lors de l'upload (manager)");
            }
        } catch (error) {
            console.error("Erreur upload:", error);
            this.showNotification(error.message, "error");
        }
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById("upload-zone");
        if (!uploadZone) return;

        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ["dragenter", "dragover"].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add("drag-over");
            });
        });

        ["dragleave", "drop"].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove("drag-over");
            });
        });

        uploadZone.addEventListener("drop", (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = document.getElementById("upload-file");
                if (fileInput) {
                    fileInput.files = files;
                    this.handleFileSelect({ target: fileInput });
                }
            }
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Vérifier le type
        if (!file.type.startsWith("image/")) {
            this.showNotification("Veuillez sélectionner une image", "warning");
            return;
        }

        // Vérifier l'extension
        if (!configLoader.isValidExtension(file.name)) {
            const allowed = configLoader.getAllowedExtensions().join(', ');
            this.showNotification(`Extensions autorisées: ${allowed}`, "warning");
            return;
        }

        // Vérifier la taille
        const maxSize = configLoader.getMaxFileSize();
        if (file.size > maxSize) {
            const maxSizeMB = configLoader.getMaxFileSizeMB();
            this.showNotification(`L'image ne doit pas dépasser ${maxSizeMB} MB`, "warning");
            return;
        }

        // Afficher l'aperçu
        const preview = document.getElementById("upload-preview");
        const previewImage = document.getElementById("preview-image");
        const uploadInfo = document.getElementById("upload-info");

        if (preview && previewImage && uploadInfo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                uploadInfo.innerHTML = `
                    <strong>${file.name}</strong><br>
                    Taille: ${this.formatSize(file.size)}<br>
                    Type: ${file.type}
                `;
                preview.classList.add("active");
            };
            reader.readAsDataURL(file);
        }
    }

    async loadImages() {
        try {
            const apiPath = configLoader.getApiPath();
            const response = await fetch(`${apiPath}routes-uploads/list`);
            const data = await response.json();
            
            if (data.images) {
                this.images = data.images;
                console.log(`${this.images.length} images chargées depuis l'API`);
            } else {
                this.images = [];
                console.warn("Aucune image retournée par l'API");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des images:", error);
            this.showNotification("Erreur lors du chargement des images", "error");
            this.images = [];
        }
    }

    async openLibrary() {
        const modal = document.getElementById("library-modal");
        if (modal) {
            // Recharger les images à chaque ouverture
            await this.loadImages();
            this.renderLibrary();
            this.updateImageCount();
            modal.classList.add("active");
        }
    }

    updateImageCount() {
        const usedImages = this.getImagesFromMarkdown();
        const totalImages = this.images.length;
        
        // Afficher les stats
        const statsDiv = document.getElementById("library-stats");
        const statsText = document.getElementById("library-stats-text");
        
        if (statsDiv && statsText) {
            if (usedImages.length > 0) {
                statsText.innerHTML = `
                    <strong>${usedImages.length}</strong> image(s) utilisée(s) dans ce contenu 
                    sur un total de <strong>${totalImages}</strong> image(s) disponible(s)
                `;
                statsDiv.style.display = "block";
            } else if (totalImages > 0) {
                statsText.innerHTML = `
                    <strong>${totalImages}</strong> image(s) disponible(s) 
                    (aucune utilisée dans ce contenu)
                `;
                statsDiv.style.display = "block";
            } else {
                statsDiv.style.display = "none";
            }
        }
        
        console.log(`Images utilisées: ${usedImages.length}/${totalImages}`, usedImages);
    }

    getImagesFromMarkdown() {
        const textarea = document.getElementById("content-markdown");
        if (!textarea) return [];

        const markdown = textarea.value;
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const images = [];
        let match;

        const uploadPath = configLoader.getUploadPath();

        while ((match = imageRegex.exec(markdown)) !== null) {
            const imagePath = match[2];
            // Extraire seulement le nom du fichier depuis le chemin d'upload
            if (imagePath.startsWith(uploadPath)) {
                const filename = imagePath.replace(uploadPath, "");
                images.push(filename);
            }
        }

        return images;
    }

    renderLibrary() {
        const container = document.getElementById("library-grid");
        if (!container) return;

        if (this.images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>Aucune image uploadée</p>
                </div>
            `;
            return;
        }

        // Récupérer les images utilisées dans le markdown actuel
        const usedImages = this.getImagesFromMarkdown();

        container.innerHTML = this.images.map(image => {
            const isUsed = usedImages.includes(image.filename);
            const usedClass = isUsed ? 'library-item-used' : '';
            const usedBadge = isUsed ? '<span class="library-used-badge">✓ Utilisée</span>' : '';

            return `
                <div class="library-item ${usedClass}" data-filename="${image.filename}">
                    <div class="library-thumbnail">
                        <img src="${image.thumbnailPath}" alt="${image.filename}" 
                             onerror="this.src='/assets/icons/image-placeholder.svg'">
                        ${usedBadge}
                    </div>
                    <div class="library-info">
                        <div class="library-filename" title="${image.filename}">
                            ${image.filename}
                        </div>
                        <div class="library-meta">
                            <span class="library-date">
                                ${this.formatDate(image.modifiedAt)}
                            </span>
                            <span class="library-size">
                                ${this.formatSize(image.size)}
                            </span>
                        </div>
                    </div>
                    <div class="library-actions">
                        <button class="btn-icon" onclick="uploadManager.insertImage('${image.path}')" 
                                title="Insérer dans l'éditeur">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-icon" onclick="uploadManager.copyPath('${image.path}')" 
                                title="Copier le chemin">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon btn-danger" 
                                onclick="uploadManager.deleteImage('${image.filename}')" 
                                title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    openUploadModal() {
        // Récupérer les IDs depuis le formulaire de contenu
        const categorySelect = document.getElementById("content-category");
        const contentFile = document.getElementById("content-file");

        if (!categorySelect || !categorySelect.value) {
            this.showNotification("Veuillez d'abord sélectionner une catégorie", "warning");
            return;
        }

        if (!contentFile || !contentFile.value) {
            this.showNotification("Veuillez d'abord définir un nom de fichier", "warning");
            return;
        }

        this.currentCategoryId = categorySelect.value;
        this.currentContentId = contentFile.value.replace(".md", "");

        const modal = document.getElementById("upload-modal");
        if (modal) {
            modal.classList.add("active");
        }
    }

    async handleUpload(e) {
        e.preventDefault();

        const fileInput = document.getElementById("upload-file");
        const file = fileInput.files[0];

        if (!file) {
            this.showNotification("Veuillez sélectionner un fichier", "warning");
            return;
        }

        // Récupérer les IDs à chaque fois (au cas où ils ont changé)
        const categorySelect = document.getElementById("content-category");
        const contentFile = document.getElementById("content-file");

        const categoryId = categorySelect ? categorySelect.value : this.currentCategoryId;
        const contentId = contentFile ? contentFile.value.replace(".md", "") : this.currentContentId;

        if (!categoryId || !contentId) {
            this.showNotification("Catégorie et nom de fichier requis", "warning");
            return;
        }

        // Validation format (sécurité)
        if (!/^[a-z0-9-]+$/.test(categoryId) || !/^[a-z0-9-]+$/.test(contentId)) {
            this.showNotification("Format de catégorie ou contenu invalide", "error");
            return;
        }

        // Validation taille fichier (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification("Fichier trop volumineux (max 5MB)", "error");
            return;
        }

        // Validation type MIME
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification("Type de fichier non autorisé", "error");
            return;
        }

        // TODO: Remplacer par Winston Logger quand disponible dans le contexte
        console.log("Upload d'image", { categoryId, contentId, filename: file.name });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("categoryId", categoryId);
        formData.append("contentId", contentId);

        try {
            const apiPath = configLoader.getApiPath();
            const response = await fetch(`${apiPath}routes-uploads/upload`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Réponse API upload:", data);

            if (data.success) {
                this.showNotification("Image uploadée avec succès", "success");
                this.insertImage(data.image.path);
                this.closeModal(document.getElementById("upload-modal"));
                this.loadImages(); // Recharger la bibliothèque
                fileInput.value = ""; // Reset input
            } else {
                throw new Error(data.error || "Erreur lors de l'upload (handle)");
            }
        } catch (error) {
            console.error("Erreur upload:", error);
            this.showNotification(error.message, "error");
        }
    }

    insertImage(imagePath) {
        const textarea = document.getElementById("content-markdown");
        if (!textarea) return;

        // S'assurer que le chemin commence par le chemin d'upload configuré
        const uploadPath = configLoader.getUploadPath();
        if (!imagePath.startsWith(uploadPath)) {
            imagePath = uploadPath + imagePath.replace(/^\/+/, '');
        }

        const markdownImage = `![Description de l'image](${imagePath})`;
        
        // Insérer à la position du curseur
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        textarea.value = text.substring(0, start) + markdownImage + text.substring(end);
        
        // Replacer le curseur
        textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length;
        textarea.focus();

        this.showNotification("Image insérée dans l'éditeur", "success");
        this.closeModal(document.getElementById("library-modal"));
    }

    copyPath(imagePath) {
        navigator.clipboard.writeText(imagePath).then(() => {
            this.showNotification("Chemin copié dans le presse-papier", "success");
        }).catch(err => {
            console.error("Erreur copie:", err);
            this.showNotification("Erreur lors de la copie", "error");
        });
    }

    async deleteImage(filename) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
            return;
        }

        try {
            const response = await fetch(`/api/uploads/${filename}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification("Image supprimée", "success");
                this.loadImages();
            } else {
                throw new Error(data.error || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
            this.showNotification(error.message, "error");
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove("active");
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(date);
    }

    formatSize(bytes) {
        return configLoader.formatFileSize(bytes);
    }

    showNotification(message, type = "info") {
        // Utiliser le système de notification existant ou créer un simple alert
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialiser le gestionnaire
const uploadManager = new UploadManager();
