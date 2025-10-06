@echo off
chcp 65001 >nul
title 🚀 Sauvegarde Automatique - Quête de Vérité

echo.
echo ========================================
echo 💾 SAUVEGARDE AUTOMATIQUE ACTIVÉE
echo ========================================
echo.

:: Créer dossier de sauvegardes avec timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set year=%datetime:~0,4%
set month=%datetime:~4,2%
set day=%datetime:~6,2%
set hour=%datetime:~8,2%
set minute=%datetime:~10,2%
set second=%datetime:~12,2%

set timestamp=%year%-%month%-%day%_%hour%h%minute%m%second%s
set backup_dir=sauvegardes\backup_%timestamp%

echo 📁 Création du dossier : %backup_dir%
mkdir "%backup_dir%" 2>nul

:: Sauvegarder tous les fichiers HTML
echo.
echo 📄 Sauvegarde des fichiers HTML...
copy "*.html" "%backup_dir%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Fichiers HTML sauvegardés
) else (
    echo ❌ Erreur sauvegarde HTML
)

:: Sauvegarder les fichiers de configuration
echo.
echo ⚙️ Sauvegarde configuration...
copy "*.json" "%backup_dir%\" >nul 2>&1
copy "*.md" "%backup_dir%\" >nul 2>&1
copy "*.txt" "%backup_dir%\" >nul 2>&1

:: Créer un fichier de log avec informations
echo.
echo 📝 Création du log de sauvegarde...
echo ========================================> "%backup_dir%\BACKUP_INFO.txt"
echo SAUVEGARDE AUTOMATIQUE - QUÊTE DE VÉRITÉ>> "%backup_dir%\BACKUP_INFO.txt"
echo ========================================>> "%backup_dir%\BACKUP_INFO.txt"
echo.>> "%backup_dir%\BACKUP_INFO.txt"
echo Date/Heure: %date% %time%>> "%backup_dir%\BACKUP_INFO.txt"
echo Timestamp: %timestamp%>> "%backup_dir%\BACKUP_INFO.txt"
echo Répertoire: %cd%>> "%backup_dir%\BACKUP_INFO.txt"
echo.>> "%backup_dir%\BACKUP_INFO.txt"
echo FICHIERS SAUVEGARDÉS:>> "%backup_dir%\BACKUP_INFO.txt"
echo =====================>> "%backup_dir%\BACKUP_INFO.txt"
dir /b *.html >> "%backup_dir%\BACKUP_INFO.txt"
echo.>> "%backup_dir%\BACKUP_INFO.txt"
echo STATUT: ✅ Sauvegarde réussie>> "%backup_dir%\BACKUP_INFO.txt"
echo ========================================>> "%backup_dir%\BACKUP_INFO.txt"

:: Affichage des statistiques
echo.
echo 📊 STATISTIQUES DE SAUVEGARDE:
echo ================================
for /f %%i in ('dir /b *.html ^| find /c /v ""') do echo 📄 Fichiers HTML: %%i
for /f %%i in ('dir /s /b "%backup_dir%\*.*" ^| find /c /v ""') do echo 💾 Total sauvegardé: %%i fichiers
echo 📁 Dossier: %backup_dir%

:: Nettoyer les anciennes sauvegardes (garder les 10 dernières)
echo.
echo 🧹 Nettoyage des anciennes sauvegardes...
for /f "skip=10 delims=" %%i in ('dir /b /ad /o-d "sauvegardes\backup_*" 2^>nul') do (
    echo 🗑️ Suppression: %%i
    rmdir /s /q "sauvegardes\%%i" 2>nul
)

echo.
echo ✅ SAUVEGARDE TERMINÉE AVEC SUCCÈS !
echo 📍 Localisation: %backup_dir%
echo.
echo ========================================
echo 🎮 Retour au développement...
echo ========================================
echo.

timeout /t 3 >nul