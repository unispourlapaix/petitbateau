@echo off
setlocal enabledelayedexpansion

REM ===== SCRIPT CLAUDE CODE LAUNCHER =====
REM Lance Claude Code et gère la sauvegarde du contexte

echo ========================================
echo    CLAUDE CODE PROJECT LAUNCHER
echo ========================================
echo.

REM Créer le dossier de sauvegarde s'il n'existe pas
if not exist ".claude-context" mkdir ".claude-context"

REM Obtenir la date et heure actuelles
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

REM Sauvegarder le contexte actuel avant de lancer Claude
echo [%timestamp%] === SESSION START === >> .claude-context\session-log.txt
echo Dossier de travail: %CD% >> .claude-context\session-log.txt
echo.

REM Vérifier s'il y a un contexte précédent
if exist ".claude-context\project-context.txt" (
    echo CONTEXTE PROJET TROUVE :
    echo ========================
    type ".claude-context\project-context.txt"
    echo.
    echo ========================
    echo.
) else (
    echo Aucun contexte précédent trouvé.
    echo.
)

REM Vérifier la bibliothèque de modules
echo BIBLIOTHEQUE DE MODULES :
echo ========================
if exist "C:\EmmanuelModules\module-registry.json" (
    echo ✅ Bibliothèque de modules trouvée sur C:\EmmanuelModules\
    echo    📋 Tapez 'C:\EmmanuelModules\list-modules.bat' pour voir les modules
    echo    🔧 Modules disponibles pour ce projet
) else (
    echo ⚠️  Bibliothèque de modules non trouvée
    echo    💡 Créez-la avec: mkdir C:\EmmanuelModules
)

echo.
echo ANALYSE DU PROJET :
echo ===================
if exist "package.json" (
    echo - Projet Node.js détecté
    echo   ^> package.json trouvé
)
if exist "*.html" (
    echo - Fichiers HTML détectés
    for %%f in (*.html) do echo   ^> %%f
)
if exist "*.js" (
    echo - Fichiers JavaScript détectés
)
if exist "manifest.json" (
    echo - Application web détectée (manifest.json)
)

echo.
echo LANCEMENT DE CLAUDE CODE...
echo Tapez 'exit' pour quitter et sauvegarder le contexte
echo.

REM Créer un prompt initial pour Claude avec le contexte
(
echo CONTEXTE DU PROJET :
echo ====================
echo Dossier: %CD%
echo Timestamp: %timestamp%
echo.
echo PREFERENCES DE DESIGN D'EMMANUEL :
echo ================================
echo - Style visuel : Thème pur blanc, géométrique, simple mais détaillé
echo - Esthétique : Futuriste, épuré, lignes nettes
echo - Narration : Toujours à la 3ème personne pour l'immersion
echo - Ambiance : Moderne, technologique, immersive
echo.
echo SPECIFICATIONS TECHNIQUES :
echo ===========================
echo - Interface : Une seule fenêtre, tout dedans
echo - Contrôles : Mobile tactile + souris PC
echo - Format : Ratio fixe, orientation portrait
echo - Responsive : Adaptation mobile/desktop
echo.
echo ARCHITECTURE MODULAIRE :
echo ========================
echo - Fonctions en modules désactivables facilement
echo - Modules stables réutilisables entre projets
echo - Architecture plug-and-play
echo - Séparation claire des responsabilités
echo.
echo STRUCTURE MODULAIRE IMPLEMENTEE :
echo =================================
echo - modules/graphics/ : Rendus graphiques (bateau, cœurs, lanterne, environnement)
echo - modules/systems/ : Systèmes de jeu (particules, animations)
echo - modules/config/ : Configuration centralisée
echo - modules/styles/ : Styles CSS réutilisables
echo - modules/index.js : Gestionnaire central ModuleManager
echo.
echo METHODE MODULAIRE :
echo ==================
echo 1. Isoler chaque composant graphique en module indépendant
echo 2. Créer des systèmes réutilisables (particules, animations)
echo 3. Centraliser la configuration dans game-config.js
echo 4. Séparer les styles CSS en fichiers modulaires
echo 5. Gestionnaire central pour import/export facile
echo 6. Version démo modulaire : voir-la-verite-modular.html
echo 7. Documentation complète : README-MODULES.md
echo 8. Hot-reload automatique pour développement rapide
echo 9. Tests unitaires par module (modules/tests/)
echo 10. Build system pour optimisation production
echo.
if exist ".claude-context\project-context.txt" (
    echo CONTEXTE PRECEDENT :
    type ".claude-context\project-context.txt"
    echo.
)
echo FICHIERS PRINCIPAUX :
dir /b *.html *.js *.json 2>nul
echo.
echo MODULES DISPONIBLES :
echo ====================
if exist "modules\" (
    echo ✅ Architecture modulaire détectée
    echo 📁 modules/graphics/ - Rendus graphiques
    echo 📁 modules/systems/ - Systèmes de jeu
    echo 📁 modules/config/ - Configuration
    echo 📁 modules/styles/ - Styles CSS
    if exist "modules\index.js" echo 📦 ModuleManager disponible
    if exist "voir-la-verite-modular.html" echo 🎮 Version démo modulaire disponible
    if exist "README-MODULES.md" echo 📖 Documentation modulaire disponible
) else (
    echo ⚠️ Modules non détectés - Architecture monolithique
)
echo.
echo QUE DOIS-JE FAIRE DANS CE PROJET ?
) > ".claude-context\current-prompt.txt"

REM Sauvegarde automatique avant changements
echo.
echo 💾 SAUVEGARDE AUTOMATIQUE AVANT CHANGEMENTS...
call sauvegarde-auto.bat
echo ✅ Sauvegarde terminée !
echo.

REM Lancer Claude Code
claude

REM Après fermeture de Claude, générer un rapport intelligent
echo.
echo ========================================
echo   RAPPORT DE SESSION CLAUDE CODE
echo ========================================
echo.

REM Analyser les changements dans le projet
echo ANALYSE DES MODIFICATIONS:
echo ==========================
set "files_changed=0"

REM Détecter les nouveaux fichiers créés aujourd'hui
echo 📄 NOUVEAUX FICHIERS:
for %%f in (*.html *.js *.css *.json *.txt *.md) do (
    if exist "%%f" (
        forfiles /m "%%f" /c "cmd /c if @fdate gtr %YYYY%-%MM%-%DD% echo   ✨ NOUVEAU: %%f" 2>nul
        set /a files_changed+=1
    )
)

REM Détecter les fichiers modifiés
echo 📝 FICHIERS MODIFIES:
for %%f in (*.html *.js *.css *.json *.txt *.md) do (
    if exist "%%f" (
        forfiles /m "%%f" /c "cmd /c if @fdate equ %YYYY%-%MM%-%DD% echo   📝 MODIFIE: %%f" 2>nul
    )
)

REM Analyser la taille du projet
echo 📊 STATISTIQUES PROJET:
dir *.* /s /-c | find "File(s)" | find /v "Dir(s)"

REM Détecter les erreurs potentielles
echo 🔍 VERIFICATION RAPIDE:
if exist "*.html" (
    findstr /i "error\|undefined\|null" *.html >nul 2>nul && echo   ⚠️  Erreurs potentielles détectées dans HTML
)
if exist "*.js" (
    findstr /i "console.error\|throw\|undefined" *.js >nul 2>nul && echo   ⚠️  Erreurs potentielles détectées dans JS
)

echo.
echo COLLECTE DU CONTEXTE:
echo =====================
echo 1. Que faisiez-vous dans ce projet ?
set /p "task_description=   Description: "

echo.
echo 2. Statut de la tâche:
echo    [C] Complète   [P] En cours   [B] Bloquée   [A] Abandonnée
set /p "task_status=   Statut (C/P/B/A): "

if /i "%task_status%"=="P" (
    echo.
    echo 3. Pourquoi pas terminé ?
    set /p "blocker=   Raison: "
    echo.
    echo 4. Prochaines étapes pour continuer:
    set /p "next_steps=   Étapes: "
) else if /i "%task_status%"=="B" (
    echo.
    echo 3. Qu'est-ce qui bloque ?
    set /p "blocker=   Blocage: "
    echo.
    echo 4. Comment débloquer ?
    set /p "solution=   Solution: "
    set "next_steps=BLOQUE: !blocker! - Solution: !solution!"
) else if /i "%task_status%"=="C" (
    echo.
    echo 3. Prochaines fonctionnalités à ajouter ?
    set /p "next_steps=   Nouvelles idées: "
    set "blocker=Aucun"
) else (
    echo.
    echo 3. Pourquoi abandonné ?
    set /p "blocker=   Raison: "
    set "next_steps=ABANDONNE: !blocker!"
)

echo.
echo 5. Idées/améliorations notées pendant la session:
set /p "ideas=   Idées: "

echo.
echo 6. Fonctions utiles découvertes (ex: raccourcis, astuces):
set /p "useful_functions=   Fonctions: "

echo.
echo 7. Modules/composants créés ou modifiés:
set /p "modules_work=   Modules: "

echo.
echo 8. Performance/optimisations apportées:
set /p "optimizations=   Optimisations: "

echo.
echo 9. Bugs découverts/résolus:
set /p "bugs=   Bugs: "

echo.
echo GENERATION DU RAPPORT...

REM Déterminer les suggestions intelligentes basées sur le projet
set "suggestions="
if exist "*.html" set "suggestions=!suggestions! [HTML] Optimisation responsive, animations CSS, SEO"
if exist "*.js" set "suggestions=!suggestions! [JS] Modules ES6, gestion erreurs, tests unitaires, minification"
if exist "package.json" set "suggestions=!suggestions! [NODE] Scripts npm, dépendances, build, déploiement"
if exist "manifest.json" set "suggestions=!suggestions! [PWA] Service Worker, cache offline, notifications push, icônes"
if exist "*.css" set "suggestions=!suggestions! [CSS] Variables CSS, grid/flexbox, media queries, animations"
if exist "sw*.js" set "suggestions=!suggestions! [SW] Cache strategies, background sync, push notifications"
if exist "*test*" set "suggestions=!suggestions! [TEST] Coverage, CI/CD, tests e2e, mocking"
if exist "*debug*" set "suggestions=!suggestions! [DEBUG] Console, breakpoints, performance profiling"

REM Suggestions basées sur les fichiers récents et préférences d'Emmanuel
if /i "%task_description%"=="mobile" set "suggestions=!suggestions! [MOBILE] Touch events, viewport, orientation"
if /i "%task_description%"=="game" set "suggestions=!suggestions! [GAME] Canvas, animations, physics, audio"
if /i "%task_description%"=="api" set "suggestions=!suggestions! [API] Fetch, async/await, error handling, caching"

REM Suggestions de design selon les préférences d'Emmanuel
set "suggestions=!suggestions! [DESIGN] Thème blanc pur, géométrie simple, détails fins"
set "suggestions=!suggestions! [UX] Interface futuriste, épurée, navigation intuitive"
set "suggestions=!suggestions! [NARRATION] 3ème personne, immersion, ambiance technologique"
set "suggestions=!suggestions! [LAYOUT] Single-page app, ratio portrait fixe, responsive"
set "suggestions=!suggestions! [CONTROLS] Touch events, mouse support, unified interface"
set "suggestions=!suggestions! [MODULES] Architecture modulaire, plug-and-play, désactivables"
set "suggestions=!suggestions! [CODE] Modules réutilisables, config centralisée, hot-reload"
set "suggestions=!suggestions! [GRAPHICS] BoatRenderer, HeartRenderer, LanternRenderer, EnvironmentRenderer"
set "suggestions=!suggestions! [SYSTEMS] ParticleSystem collections, ModuleManager centralisé"
set "suggestions=!suggestions! [CONFIG] GameConfig centralisé, RESPONSIVE calculations, COLORS palettes"
set "suggestions=!suggestions! [DEMO] voir-la-verite-modular.html, README-MODULES.md documentation"
set "suggestions=!suggestions! [PERFORMANCE] Canvas optimizations, requestAnimationFrame, memory management"
set "suggestions=!suggestions! [AUDIO] Web Audio API, sound effects, background music, audio modules"
set "suggestions=!suggestions! [ANIMATION] CSS keyframes, JS tweening, particle effects, smooth transitions"
set "suggestions=!suggestions! [DATA] LocalStorage persistence, JSON config, save/load system"
set "suggestions=!suggestions! [DEBUG] Console logging, performance monitoring, error tracking"
set "suggestions=!suggestions! [DEPLOY] GitHub Pages, Netlify, PWA manifest, service worker"
set "suggestions=!suggestions! [TOOLS] ESLint, Prettier, bundler, live server, auto-reload"
set "suggestions=!suggestions! [SECURITY] Input validation, XSS protection, content security policy"

REM Générer le rapport complet
(
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    RAPPORT DE SESSION                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📅 SESSION: %timestamp%
echo 🗂️  PROJET: %CD%
echo.
echo ┌─ TRAVAIL EFFECTUE ─────────────────────────────────────────┐
echo │ TACHE: %task_description%
if /i "%task_status%"=="C" echo │ ✅ STATUT: COMPLETE
if /i "%task_status%"=="P" echo │ ⏳ STATUT: EN COURS
if /i "%task_status%"=="B" echo │ ❌ STATUT: BLOQUEE
if /i "%task_status%"=="A" echo │ ⛔ STATUT: ABANDONNEE
if not "%blocker%"=="Aucun" echo │ 🚫 PROBLEME: %blocker%
echo └────────────────────────────────────────────────────────────┘
echo.
if /i "%task_status%"=="P" (
    echo ┌─ PROCHAINES ETAPES (PRIORITE) ─────────────────────────────┐
    echo │ 🎯 %next_steps%
    echo │ 📋 TODO: Reprendre cette tâche en priorité
    echo └────────────────────────────────────────────────────────────┘
) else if /i "%task_status%"=="B" (
    echo ┌─ BLOCAGE A RESOUDRE (URGENT) ──────────────────────────────┐
    echo │ 🚨 %next_steps%
    echo │ 📋 TODO: Résoudre ce blocage avant tout
    echo └────────────────────────────────────────────────────────────┘
) else (
    echo ┌─ PROCHAINES IDEES ─────────────────────────────────────────┐
    echo │ 💡 %next_steps%
    echo └────────────────────────────────────────────────────────────┘
)
echo.
if not "%ideas%"=="" (
    echo ┌─ IDEES NOTEES ─────────────────────────────────────────────┐
    echo │ 🧠 %ideas%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
if not "%useful_functions%"=="" (
    echo ┌─ FONCTIONS UTILES DECOUVERTS ──────────────────────────────┐
    echo │ 🔧 %useful_functions%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
if not "%modules_work%"=="" (
    echo ┌─ MODULES/COMPOSANTS TRAVAILLES ───────────────────────────┐
    echo │ 📦 %modules_work%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
if not "%optimizations%"=="" (
    echo ┌─ OPTIMISATIONS APPORTEES ──────────────────────────────────┐
    echo │ ⚡ %optimizations%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
if not "%bugs%"=="" (
    echo ┌─ BUGS DECOUVERTS/RESOLUS ──────────────────────────────────┐
    echo │ 🐛 %bugs%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
if not "%suggestions%"=="" (
    echo ┌─ SUGGESTIONS INTELLIGENTES ────────────────────────────────┐
    echo │ 🤖 %suggestions%
    echo └────────────────────────────────────────────────────────────┘
    echo.
)
echo ┌─ FICHIERS MODIFIES ────────────────────────────────────────┐
forfiles /m *.* /c "cmd /c echo │ 📝 @path - @fdate @ftime" 2>nul | findstr "%YYYY%-%MM%-%DD%"
echo └────────────────────────────────────────────────────────────┘
echo.
echo ═══════════════════════════════════════════════════════════════
) > ".claude-context\project-context.txt"

echo [%timestamp%] Tâche: %task_description% >> .claude-context\session-log.txt
echo [%timestamp%] Statut: %task_status% >> .claude-context\session-log.txt
echo [%timestamp%] Prochaines étapes: %next_steps% >> .claude-context\session-log.txt
if not "%modules_work%"=="" echo [%timestamp%] Modules: %modules_work% >> .claude-context\session-log.txt
if not "%optimizations%"=="" echo [%timestamp%] Optimisations: %optimizations% >> .claude-context\session-log.txt
if not "%bugs%"=="" echo [%timestamp%] Bugs: %bugs% >> .claude-context\session-log.txt
echo [%timestamp%] === SESSION END === >> .claude-context\session-log.txt
echo.

echo ✅ Rapport généré dans .claude-context\project-context.txt
echo 📋 Session archivée dans .claude-context\session-log.txt

REM Jouer un son de fin si possible (Windows)
powershell -c "[console]::beep(800,300); [console]::beep(1000,200)" 2>nul

REM Afficher un résumé rapide des prochaines actions
echo.
echo 🎯 RESUME POUR LA PROCHAINE SESSION:
if /i "%task_status%"=="P" (
    echo    ⚠️  REPRENDRE: %task_description%
    echo    📝 ETAPES: %next_steps%
) else if /i "%task_status%"=="B" (
    echo    🚨 URGENT: Résoudre le blocage
    echo    🔧 ACTION: %next_steps%
) else if /i "%task_status%"=="C" (
    echo    ✅ Tâche terminée
    echo    💡 IDEES: %next_steps%
) else (
    echo    ⛔ Tâche abandonnée
)

echo.
echo 💾 Utilisez 'launch-claude.bat' pour reprendre avec le contexte
echo.
pause