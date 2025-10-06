#!/bin/bash

echo "🔙 Restauration - Quête de Vérité"
echo "================================="
echo ""

# Vérifier si le dossier sauvegardes existe
if [ ! -d "sauvegardes" ]; then
    echo "❌ Aucun dossier de sauvegarde trouvé!"
    exit 1
fi

# Lister les sauvegardes disponibles
echo "📁 SAUVEGARDES DISPONIBLES:"
echo "=========================="
ls -la sauvegardes/ | grep backup_

echo ""
echo "📝 Entrez le nom complet de la sauvegarde à restaurer:"
echo "   (ex: backup_2025-09-18_00-49-54)"
read -p "👉 Nom de la sauvegarde: " backup_name

backup_path="sauvegardes/$backup_name"

if [ ! -d "$backup_path" ]; then
    echo "❌ Sauvegarde '$backup_name' introuvable!"
    exit 1
fi

echo ""
echo "⚠️  ATTENTION: Cette action va remplacer les fichiers actuels!"
echo "📄 Fichiers qui seront restaurés depuis $backup_name:"
ls "$backup_path"/*.html 2>/dev/null

echo ""
read -p "🤔 Continuer la restauration? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

echo ""
echo "🔄 Restauration en cours..."

# Sauvegarder l'état actuel avant restauration
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_before="sauvegardes/avant_restauration_$timestamp"
mkdir -p "$backup_before"
cp *.html "$backup_before/" 2>/dev/null
echo "💾 État actuel sauvegardé dans: $backup_before"

# Restaurer les fichiers
cp "$backup_path"/*.html . 2>/dev/null
cp "$backup_path"/*.bat . 2>/dev/null
cp "$backup_path"/*.sh . 2>/dev/null

echo ""
echo "✅ RESTAURATION TERMINÉE!"
echo "📁 Fichiers restaurés depuis: $backup_path"
echo "💾 Ancienne version sauvée dans: $backup_before"
echo "================================="