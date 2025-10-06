#!/bin/bash

echo "🎮 Quête de Vérité - Démarrage Complet"
echo "====================================="
echo ""
echo "Choisissez une option :"
echo ""
echo "1️⃣  🚀 Lancer le serveur web"
echo "2️⃣  🔍 Activer surveillance automatique"
echo "3️⃣  💾 Sauvegarde manuelle"
echo "4️⃣  📊 Voir les sauvegardes"
echo "5️⃣  🌐 Ouvrir le jeu"
echo "6️⃣  ❌ Quitter"
echo ""
read -p "👉 Votre choix (1-6) : " choix

case $choix in
    1)
        echo ""
        echo "🚀 Démarrage du serveur web sur le port 8080..."
        echo "🌐 URL: http://localhost:8080"
        npx http-server -p 8080 &
        echo "✅ Serveur démarré en arrière-plan !"
        echo "🎮 Accédez au jeu : http://localhost:8080/voir-la-verite-responsive.html"
        ;;
    2)
        echo ""
        echo "🔍 Activation de la surveillance automatique..."
        ./surveillance.sh
        ;;
    3)
        echo ""
        echo "💾 Lancement de la sauvegarde..."
        ./sauvegarde.sh
        ;;
    4)
        echo ""
        echo "📊 SAUVEGARDES DISPONIBLES :"
        echo "=========================="
        if [ -d "sauvegardes" ]; then
            ls -la sauvegardes/
        else
            echo "Aucune sauvegarde trouvée"
        fi
        ;;
    5)
        echo ""
        echo "🌐 Ouverture du jeu..."
        if command -v start &> /dev/null; then
            start http://localhost:8080/voir-la-verite-responsive.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8080/voir-la-verite-responsive.html
        else
            echo "💡 Ouvrez manuellement : http://localhost:8080/voir-la-verite-responsive.html"
        fi
        ;;
    6)
        echo ""
        echo "👋 Au revoir et bon développement !"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide !"
        ;;
esac