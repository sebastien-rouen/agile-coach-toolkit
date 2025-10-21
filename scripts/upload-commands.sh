#!/bin/bash

# Script de commandes utiles pour le système d'upload
# Usage: ./scripts/upload-commands.sh [command]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}=== Système d'Upload - Commandes Utiles ===${NC}\n"
    echo "Usage: ./scripts/upload-commands.sh [command]"
    echo ""
    echo "Commandes disponibles:"
    echo "  install         - Installer les dépendances (multer, sharp)"
    echo "  setup           - Créer le dossier uploads avec les bonnes permissions"
    echo "  migrate         - Migrer les images existantes"
    echo "  test-api        - Tester l'API d'upload"
    echo "  list            - Lister toutes les images uploadées"
    echo "  stats           - Afficher les statistiques des uploads"
    echo "  clean           - Nettoyer les images orphelines"
    echo "  backup          - Sauvegarder le dossier uploads"
    echo "  restore         - Restaurer le dossier uploads depuis une sauvegarde"
    echo "  permissions     - Vérifier et corriger les permissions"
    echo "  nginx-test      - Tester la configuration Nginx"
    echo "  restart-api     - Redémarrer l'API"
    echo "  logs            - Afficher les logs de l'API"
    echo ""
}

# Installation des dépendances
install_deps() {
    echo -e "${BLUE}📦 Installation des dépendances...${NC}"
    npm install multer sharp
    echo -e "${GREEN}✅ Dépendances installées${NC}"
}

# Configuration initiale
setup() {
    echo -e "${BLUE}🔧 Configuration du système d'upload...${NC}"
    
    # Créer le dossier uploads
    mkdir -p uploads
    echo -e "${GREEN}✅ Dossier uploads créé${NC}"
    
    # Définir les permissions
    chmod 755 uploads
    echo -e "${GREEN}✅ Permissions définies (755)${NC}"
    
    # Créer les fichiers de documentation
    if [ ! -f "uploads/.gitignore" ]; then
        cat > uploads/.gitignore << 'EOF'
# Ignorer toutes les images uploadées
*

# Sauf ce fichier .gitignore
!.gitignore

# Sauf le fichier README
!README.md
EOF
        echo -e "${GREEN}✅ .gitignore créé${NC}"
    fi
    
    echo -e "${GREEN}✨ Configuration terminée${NC}"
}

# Migration des images
migrate() {
    echo -e "${BLUE}🔄 Migration des images...${NC}"
    node scripts/migrate-images.js
    echo -e "${GREEN}✅ Migration terminée${NC}"
    
    if [ -f "migration-report.json" ]; then
        echo -e "${BLUE}📄 Rapport de migration disponible: migration-report.json${NC}"
    fi
}

# Test de l'API
test_api() {
    echo -e "${BLUE}🧪 Test de l'API d'upload...${NC}"
    
    # Créer une image de test
    echo "Test" > /tmp/test-upload.txt
    
    # Tester l'upload
    echo -e "${YELLOW}Test 1: Upload d'un fichier...${NC}"
    curl -X POST http://localhost:3002/api/agile/uploads/upload \
        -F "image=@/tmp/test-upload.txt" \
        -F "categoryId=test" \
        -F "contentId=test" \
        2>/dev/null || echo -e "${RED}❌ Échec${NC}"
    
    # Tester la liste
    echo -e "\n${YELLOW}Test 2: Liste des images...${NC}"
    curl http://localhost:3002/api/agile/uploads/list 2>/dev/null | jq '.' || echo -e "${RED}❌ Échec${NC}"
    
    # Nettoyer
    rm -f /tmp/test-upload.txt
    
    echo -e "${GREEN}✅ Tests terminés${NC}"
}

# Lister les images
list_images() {
    echo -e "${BLUE}📋 Liste des images uploadées:${NC}\n"
    
    if [ ! -d "uploads" ]; then
        echo -e "${RED}❌ Le dossier uploads n'existe pas${NC}"
        return 1
    fi
    
    find uploads -type f ! -name ".*" ! -name "README.md" | while read file; do
        size=$(du -h "$file" | cut -f1)
        date=$(stat -c %y "$file" 2>/dev/null || stat -f %Sm "$file" 2>/dev/null)
        echo -e "${GREEN}📷${NC} $(basename "$file") - ${YELLOW}$size${NC} - $date"
    done
}

# Statistiques
show_stats() {
    echo -e "${BLUE}📊 Statistiques des uploads:${NC}\n"
    
    if [ ! -d "uploads" ]; then
        echo -e "${RED}❌ Le dossier uploads n'existe pas${NC}"
        return 1
    fi
    
    total_files=$(find uploads -type f ! -name ".*" ! -name "README.md" | wc -l)
    total_size=$(du -sh uploads 2>/dev/null | cut -f1)
    thumbnails=$(find uploads -type f -name "thumb_*" | wc -l)
    originals=$((total_files - thumbnails))
    
    echo -e "Images originales: ${GREEN}$originals${NC}"
    echo -e "Miniatures: ${YELLOW}$thumbnails${NC}"
    echo -e "Total fichiers: ${BLUE}$total_files${NC}"
    echo -e "Espace utilisé: ${YELLOW}$total_size${NC}"
}

# Nettoyage
clean_orphans() {
    echo -e "${BLUE}🧹 Nettoyage des images orphelines...${NC}"
    
    # TODO: Implémenter la logique de nettoyage
    # - Trouver les images non référencées dans les fichiers markdown
    # - Demander confirmation avant suppression
    
    echo -e "${YELLOW}⚠️  Fonctionnalité à implémenter${NC}"
}

# Sauvegarde
backup() {
    echo -e "${BLUE}💾 Sauvegarde du dossier uploads...${NC}"
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="uploads_backup_$timestamp.tar.gz"
    
    tar -czf "$backup_file" uploads/
    
    echo -e "${GREEN}✅ Sauvegarde créée: $backup_file${NC}"
}

# Restauration
restore() {
    echo -e "${BLUE}📥 Restauration du dossier uploads...${NC}"
    
    # Trouver la dernière sauvegarde
    latest_backup=$(ls -t uploads_backup_*.tar.gz 2>/dev/null | head -1)
    
    if [ -z "$latest_backup" ]; then
        echo -e "${RED}❌ Aucune sauvegarde trouvée${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Restauration depuis: $latest_backup${NC}"
    read -p "Continuer? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        tar -xzf "$latest_backup"
        echo -e "${GREEN}✅ Restauration terminée${NC}"
    else
        echo -e "${YELLOW}⚠️  Restauration annulée${NC}"
    fi
}

# Vérifier les permissions
check_permissions() {
    echo -e "${BLUE}🔐 Vérification des permissions...${NC}\n"
    
    if [ ! -d "uploads" ]; then
        echo -e "${RED}❌ Le dossier uploads n'existe pas${NC}"
        return 1
    fi
    
    perms=$(stat -c %a uploads 2>/dev/null || stat -f %Lp uploads 2>/dev/null)
    owner=$(stat -c %U uploads 2>/dev/null || stat -f %Su uploads 2>/dev/null)
    
    echo -e "Permissions: ${YELLOW}$perms${NC}"
    echo -e "Propriétaire: ${YELLOW}$owner${NC}"
    
    if [ "$perms" != "755" ]; then
        echo -e "${YELLOW}⚠️  Permissions incorrectes (attendu: 755)${NC}"
        read -p "Corriger? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            chmod 755 uploads
            echo -e "${GREEN}✅ Permissions corrigées${NC}"
        fi
    else
        echo -e "${GREEN}✅ Permissions correctes${NC}"
    fi
}

# Test Nginx
test_nginx() {
    echo -e "${BLUE}🌐 Test de la configuration Nginx...${NC}"
    
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
    else
        echo -e "${RED}❌ Erreur dans la configuration Nginx${NC}"
    fi
}

# Redémarrer l'API
restart_api() {
    echo -e "${BLUE}🔄 Redémarrage de l'API...${NC}"
    
    pm2 restart "drafts.api"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ API redémarrée${NC}"
    else
        echo -e "${RED}❌ Erreur lors du redémarrage${NC}"
    fi
}

# Afficher les logs
show_logs() {
    echo -e "${BLUE}📋 Logs de l'API:${NC}\n"
    pm2 logs "drafts.api" --lines 50
}

# Main
case "${1:-help}" in
    install)
        install_deps
        ;;
    setup)
        setup
        ;;
    migrate)
        migrate
        ;;
    test-api)
        test_api
        ;;
    list)
        list_images
        ;;
    stats)
        show_stats
        ;;
    clean)
        clean_orphans
        ;;
    backup)
        backup
        ;;
    restore)
        restore
        ;;
    permissions)
        check_permissions
        ;;
    nginx-test)
        test_nginx
        ;;
    restart-api)
        restart_api
        ;;
    logs)
        show_logs
        ;;
    help|*)
        show_help
        ;;
esac
