@echo off
REM Script de démarrage rapide - Visualiseur Multi-Équipes
REM Windows Batch Script

echo.
echo ========================================
echo   Visualiseur Multi-Equipes - v1.0.0
echo ========================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detecte
    echo.
    echo Demarrage du serveur sur http://localhost:8000
    echo.
    echo Appuyez sur Ctrl+C pour arreter le serveur
    echo.
    python -m http.server 8000
) else (
    echo [ERREUR] Python n'est pas installe
    echo.
    echo Veuillez installer Python depuis https://www.python.org/
    echo Ou ouvrir index.html directement dans votre navigateur
    echo.
    pause
)
