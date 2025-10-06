#!/bin/bash

echo "🔍 Surveillance Automatique - Quête de Vérité"
echo "============================================="
echo "💡 Surveillance du fichier: voir-la-verite-responsive.html"
echo "⏰ Intervalle: 30 secondes"
echo "🛑 CTRL+C pour arrêter"
echo "============================================="
echo ""

# Variables
file_to_watch="voir-la-verite-responsive.html"
last_modified=""
counter=0

# Vérifier si le fichier existe
if [ ! -f "$file_to_watch" ]; then
    echo "❌ ERREUR: Fichier $file_to_watch introuvable !"
    exit 1
fi

# Fonction de sauvegarde
backup_function() {
    echo ""
    echo "🔔 MODIFICATION DÉTECTÉE ! [Sauvegarde #$counter]"
    echo "⏰ $(date)"
    echo "📄 Fichier: $file_to_watch"
    echo ""

    # Appeler le script de sauvegarde
    ./sauvegarde.sh

    echo ""
    echo "💾 Sauvegarde automatique terminée !"
    echo "=========================================="
}

# Boucle de surveillance
while true; do
    current_modified=$(stat -c %Y "$file_to_watch" 2>/dev/null)

    if [ "$current_modified" != "$last_modified" ] && [ -n "$last_modified" ]; then
        counter=$((counter + 1))
        backup_function
    fi

    last_modified="$current_modified"

    echo "👁️  Surveillance active... [Vérification #$counter] - $(date +%H:%M:%S)"
    sleep 30
done