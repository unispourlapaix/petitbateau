@echo off
chcp 65001 >nul
title 💬 Sauvegarde Chat Claude - Quête de Vérité

echo.
echo ========================================
echo 💬 SAUVEGARDE CHAT CLAUDE
echo ========================================
echo.

:: Créer timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set year=%datetime:~0,4%
set month=%datetime:~4,2%
set day=%datetime:~6,2%
set hour=%datetime:~8,2%
set minute=%datetime:~10,2%
set second=%datetime:~12,2%

set timestamp=%year%-%month%-%day%_%hour%h%minute%m%second%s
set chat_dir=sauvegardes\chat_%timestamp%

echo 📁 Création du dossier chat : %chat_dir%
mkdir "%chat_dir%" 2>nul

:: Instructions pour l'utilisateur
echo.
echo 📋 INSTRUCTIONS DE SAUVEGARDE CHAT:
echo ===================================
echo.
echo 1️⃣ Dans Claude, appuyez sur CTRL+A (tout sélectionner)
echo 2️⃣ Puis CTRL+C (copier)
echo 3️⃣ Appuyez sur ENTRÉE ici pour continuer...
echo.
pause

:: Créer un fichier pour coller le contenu
echo.
echo 📝 Ouverture du Bloc-notes pour coller le chat...
echo 💡 Collez avec CTRL+V et sauvegardez avec CTRL+S
echo.

:: Créer un fichier template
echo ========================================> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo CONVERSATION CLAUDE - QUÊTE DE VÉRITÉ>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo ========================================>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo.>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo Date/Heure: %date% %time%>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo Projet: Voir la Vérité - Jeu HTML5>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo ========================================>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo.>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo [COLLEZ ICI LA CONVERSATION CLAUDE]>> "%chat_dir%\conversation_claude_%timestamp%.txt"
echo.>> "%chat_dir%\conversation_claude_%timestamp%.txt"

:: Ouvrir le fichier dans le bloc-notes
notepad "%chat_dir%\conversation_claude_%timestamp%.txt"

:: Créer un résumé des fonctionnalités développées
echo.
echo 📊 Création du résumé des fonctionnalités...

echo ========================================> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo # 🎮 RÉSUMÉ DES FONCTIONNALITÉS - QUÊTE DE VÉRITÉ>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ========================================>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo **Date:** %date% %time%>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo **Projet:** Voir la Vérité - Jeu HTML5 Narratif>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ## ✨ Fonctionnalités Développées>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ### 🎬 Animation d'Introduction>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Bateau arrive de gauche vers le centre (3s)>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Arrêt au centre pendant 20 secondes>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Messages narratifs translucides>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Contrôles désactivés pendant la narration>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ### ❤️ Briques en Forme de Cœur>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Équation paramétrique mathématique du cœur>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - 6 couleurs aléatoires différentes>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - 3 coups de vie par brique>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Effet de clignotement quand touchée>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ### 🚢 Bateau Détaillé>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Coque en bois avec bordures>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Mât et voile triangulaire>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Animations fluides>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ### 💙 Bulle d'Âme>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Style bulle transparente avec dégradés>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Reflets et ombres réalistes>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Physique de rebond fluide>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ### 📱 Interface Responsive>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Design adaptatif mobile/PC>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Messages cinématiques>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Contrôles tactiles et souris>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo.>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo ## 🔧 Système de Sauvegarde>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Scripts .bat automatiques>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Surveillance des modifications>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Sauvegarde conversations Claude>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"
echo - Nettoyage automatique (garde 10 dernières)>> "%chat_dir%\resume_fonctionnalites_%timestamp%.md"

echo.
echo ✅ SAUVEGARDE CHAT TERMINÉE !
echo 📁 Dossier: %chat_dir%
echo 📄 Fichiers créés:
echo    - conversation_claude_%timestamp%.txt
echo    - resume_fonctionnalites_%timestamp%.md
echo.
echo 💡 N'oubliez pas de sauvegarder le fichier Bloc-notes !
echo.

pause