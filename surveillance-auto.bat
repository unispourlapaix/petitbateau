@echo off
chcp 65001 >nul
title 🔍 Surveillance Automatique - Quête de Vérité

echo.
echo ========================================
echo 🔍 SURVEILLANCE AUTOMATIQUE ACTIVÉE
echo ========================================
echo 💡 Ce script surveille les modifications
echo 📁 Répertoire: %cd%
echo ⏰ Intervalle: 30 secondes
echo 🛑 CTRL+C pour arrêter
echo ========================================
echo.

:: Créer le dossier de sauvegardes s'il n'existe pas
if not exist "sauvegardes" mkdir "sauvegardes"

:: Variables pour la surveillance
set "derniere_modif="
set "compteur=0"

:surveillance_loop

:: Obtenir la date de dernière modification du fichier principal
for %%i in ("voir-la-verite-responsive.html") do set "modif_actuelle=%%~ti"

:: Vérifier si le fichier a été modifié
if not "%modif_actuelle%"=="%derniere_modif%" (
    if not "%derniere_modif%"=="" (
        set /a compteur+=1
        echo.
        echo 🔔 MODIFICATION DÉTECTÉE ! [Sauvegarde #!compteur!]
        echo ⏰ %date% %time%
        echo 📄 Fichier: voir-la-verite-responsive.html
        echo 🔄 Dernière modif: %modif_actuelle%
        echo.

        :: Appeler le script de sauvegarde
        call sauvegarde-auto.bat

        echo 💾 Sauvegarde automatique terminée !
        echo ========================================
    )
    set "derniere_modif=%modif_actuelle%"
)

:: Afficher statut de surveillance
echo 👁️ Surveillance active... [Vérification #!compteur!] - %time%

:: Attendre 30 secondes avant la prochaine vérification
timeout /t 30 >nul

goto surveillance_loop