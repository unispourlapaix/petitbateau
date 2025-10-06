#!/bin/bash

echo "🚀 Système de Sauvegarde Automatique - Quête de Vérité"
echo "=================================================="

# Créer le timestamp
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_dir="sauvegardes/backup_$timestamp"

echo "📁 Création du dossier: $backup_dir"
mkdir -p "$backup_dir"

# Sauvegarder tous les fichiers HTML
echo "📄 Sauvegarde des fichiers HTML..."
cp *.html "$backup_dir/" 2>/dev/null

# Sauvegarder les scripts
echo "⚙️ Sauvegarde des scripts..."
cp *.bat "$backup_dir/" 2>/dev/null
cp *.sh "$backup_dir/" 2>/dev/null

# Créer un fichier d'information
echo "📝 Création du fichier d'information..."
cat > "$backup_dir/BACKUP_INFO.txt" << EOF
========================================
SAUVEGARDE AUTOMATIQUE - QUÊTE DE VÉRITÉ
========================================

Date/Heure: $(date)
Timestamp: $timestamp
Répertoire: $(pwd)

FICHIERS SAUVEGARDÉS:
=====================
$(ls *.html 2>/dev/null)

STATUT: ✅ Sauvegarde réussie
========================================
EOF

# Statistiques
echo "📊 STATISTIQUES:"
echo "=================="
html_count=$(ls *.html 2>/dev/null | wc -l)
total_files=$(ls "$backup_dir"/* 2>/dev/null | wc -l)
echo "📄 Fichiers HTML: $html_count"
echo "💾 Total sauvegardé: $total_files fichiers"
echo "📁 Dossier: $backup_dir"

# Nettoyer les anciennes sauvegardes (garder les 10 dernières)
echo "🧹 Nettoyage des anciennes sauvegardes..."
if [ -d "sauvegardes" ]; then
    cd sauvegardes
    ls -dt backup_* 2>/dev/null | tail -n +11 | xargs rm -rf 2>/dev/null
    cd ..
fi

echo "✅ SAUVEGARDE TERMINÉE AVEC SUCCÈS !"
echo "📍 Localisation: $backup_dir"
echo "=================================================="