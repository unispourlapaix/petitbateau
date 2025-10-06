@echo off
chcp 65001 >nul
title 🚀 Démarrage Complet - Quête de Vérité

echo.
echo ========================================
echo 🎮 QUÊTE DE VÉRITÉ - DÉMARRAGE COMPLET
echo ========================================
echo.
echo 💻 Initialisation de l'environnement de développement...
echo.

:: Vérifier si on est dans le bon répertoire
if not exist "voir-la-verite-responsive.html" (
    echo ❌ ERREUR: Fichier principal introuvable !
    echo 📁 Assurez-vous d'être dans le bon répertoire
    pause
    exit /b 1
)

echo ✅ Fichier principal détecté !
echo.

:: Créer les dossiers nécessaires
echo 📁 Création des dossiers...
if not exist "sauvegardes" mkdir "sauvegardes"
if not exist "logs" mkdir "logs"
echo ✅ Dossiers créés !
echo.

:: Menu principal
:menu
cls
echo.
echo ========================================
echo 🎮 QUÊTE DE VÉRITÉ - MENU PRINCIPAL
echo ========================================
echo.
echo Choisissez une option :
echo.
echo 1️⃣  🚀 Lancer le serveur web (port 8080)
echo 2️⃣  🔍 Activer surveillance automatique
echo 3️⃣  💾 Sauvegarde manuelle immédiate
echo 4️⃣  💬 Sauvegarder conversation Claude
echo 5️⃣  📊 Voir les statistiques
echo 6️⃣  🧹 Nettoyer les anciennes sauvegardes
echo 7️⃣  📁 Ouvrir dossier sauvegardes
echo 8️⃣  🌐 Ouvrir le jeu dans le navigateur
echo 9️⃣  🆘 Aide et documentation
echo 0️⃣  ❌ Quitter
echo.
echo ========================================
set /p choix="👉 Votre choix (0-9) : "

if "%choix%"=="1" goto serveur
if "%choix%"=="2" goto surveillance
if "%choix%"=="3" goto sauvegarde
if "%choix%"=="4" goto chat
if "%choix%"=="5" goto stats
if "%choix%"=="6" goto nettoyage
if "%choix%"=="7" goto dossier
if "%choix%"=="8" goto navigateur
if "%choix%"=="9" goto aide
if "%choix%"=="0" goto fin

echo ❌ Choix invalide !
timeout /t 2 >nul
goto menu

:serveur
echo.
echo 🚀 Démarrage du serveur web...
echo 🌐 URL: http://localhost:8080
echo 📁 Répertoire: %cd%
echo.
start cmd /c "title 🌐 Serveur Web - Port 8080 && npx http-server -p 8080"
echo ✅ Serveur démarré dans une nouvelle fenêtre !
timeout /t 3 >nul
goto menu

:surveillance
echo.
echo 🔍 Activation de la surveillance automatique...
start cmd /c surveillance-auto.bat
echo ✅ Surveillance activée dans une nouvelle fenêtre !
timeout /t 3 >nul
goto menu

:sauvegarde
echo.
echo 💾 Lancement de la sauvegarde...
call sauvegarde-auto.bat
echo.
echo ✅ Sauvegarde terminée !
pause
goto menu

:chat
echo.
echo 💬 Sauvegarde de la conversation Claude...
call sauvegarde-chat.bat
echo.
echo ✅ Processus de sauvegarde chat terminé !
pause
goto menu

:stats
echo.
echo 📊 STATISTIQUES DU PROJET
echo ========================
echo.
for /f %%i in ('dir /b *.html ^| find /c /v ""') do echo 📄 Fichiers HTML: %%i
for /f %%i in ('dir /b *.bat ^| find /c /v ""') do echo ⚙️ Scripts BAT: %%i
if exist "sauvegardes" (
    for /f %%i in ('dir /b /ad "sauvegardes\*" 2^>nul ^| find /c /v ""') do echo 💾 Sauvegardes: %%i
) else (
    echo 💾 Sauvegardes: 0
)
echo.
echo 📁 Taille du projet:
for /f "tokens=3" %%i in ('dir *.html *.bat /s /-c ^| find "fichier(s)"') do echo    %%i octets
echo.
echo 📅 Dernière modification:
for %%i in ("voir-la-verite-responsive.html") do echo    %%~ti
echo.
pause
goto menu

:nettoyage
echo.
echo 🧹 Nettoyage des anciennes sauvegardes...
if exist "sauvegardes" (
    echo 📊 Sauvegardes avant nettoyage:
    for /f %%i in ('dir /b /ad "sauvegardes\*" 2^>nul ^| find /c /v ""') do echo    %%i dossiers
    echo.
    echo 🗑️ Conservation des 5 dernières sauvegardes...
    for /f "skip=5 delims=" %%i in ('dir /b /ad /o-d "sauvegardes\backup_*" 2^>nul') do (
        echo    Suppression: %%i
        rmdir /s /q "sauvegardes\%%i" 2>nul
    )
    echo ✅ Nettoyage terminé !
) else (
    echo ℹ️ Aucun dossier de sauvegarde trouvé
)
echo.
pause
goto menu

:dossier
echo.
echo 📁 Ouverture du dossier sauvegardes...
if exist "sauvegardes" (
    explorer "sauvegardes"
    echo ✅ Dossier ouvert !
) else (
    echo ❌ Dossier sauvegardes introuvable
    echo 💡 Lancez d'abord une sauvegarde
)
timeout /t 2 >nul
goto menu

:navigateur
echo.
echo 🌐 Ouverture du jeu dans le navigateur...
echo 💡 Assurez-vous que le serveur est démarré (option 1)
start http://localhost:8080/voir-la-verite-responsive.html
echo ✅ Jeu ouvert !
timeout /t 3 >nul
goto menu

:aide
echo.
echo 🆘 AIDE ET DOCUMENTATION
echo ======================
echo.
echo 📖 GUIDE D'UTILISATION:
echo.
echo 🚀 DÉMARRAGE RAPIDE:
echo    1. Option 1: Lancer le serveur
echo    2. Option 8: Ouvrir dans le navigateur
echo    3. Option 2: Activer la surveillance (optionnel)
echo.
echo 💾 SAUVEGARDES:
echo    - Option 3: Sauvegarde manuelle
echo    - Option 4: Sauvegarder conversation Claude
echo    - Option 2: Surveillance automatique (toutes les 30s)
echo.
echo 🔧 FICHIERS IMPORTANTS:
echo    - voir-la-verite-responsive.html : Jeu principal
echo    - sauvegarde-auto.bat : Script de sauvegarde
echo    - surveillance-auto.bat : Surveillance continue
echo.
echo 💡 CONSEILS:
echo    - Laissez la surveillance active pendant le développement
echo    - Sauvegardez régulièrement les conversations Claude
echo    - Utilisez CTRL+C pour arrêter la surveillance
echo.
echo 🌐 URLS UTILES:
echo    - Jeu: http://localhost:8080/voir-la-verite-responsive.html
echo    - Serveur: http://localhost:8080
echo.
pause
goto menu

:fin
echo.
echo 👋 Au revoir et bon développement !
echo 🎮 Que la vérité soit avec vous !
echo.
timeout /t 3 >nul
exit
