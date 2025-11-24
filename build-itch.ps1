# Script de création du package itch.io pour Le Petit Bateau Rouge
# Exécute ce script dans PowerShell pour créer le ZIP de déploiement

Write-Host "🎮 Création du package itch.io - Le Petit Bateau Rouge" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan -NoNewline
1..60 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""

# Nom du fichier ZIP
$zipName = "petitbateau-itch-$(Get-Date -Format 'yyyyMMdd-HHmm').zip"
$zipPath = ".\$zipName"

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "✅ Ancien ZIP supprimé" -ForegroundColor Green
}

Write-Host "`n📦 Fichiers et dossiers à inclure :" -ForegroundColor Yellow

# Liste des fichiers à inclure
$filesToInclude = @(
    "index.html",
    "petitbateauRouge.html",
    "manifest.json",
    "sw.js",
    "favicon.ico",
    ".itch.toml",
    "VERSION.json"
)

# Liste des dossiers à inclure
$foldersToInclude = @(
    "modules",
    "icons",
    "supabase"
)

# Créer un dossier temporaire
$tempDir = ".\temp-itch-build"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "`n📄 Copie des fichiers..." -ForegroundColor Cyan

# Copier les fichiers
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $tempDir -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $file (non trouvé)" -ForegroundColor Yellow
    }
}

Write-Host "`n📁 Copie des dossiers..." -ForegroundColor Cyan

# Copier les dossiers
foreach ($folder in $foldersToInclude) {
    if (Test-Path $folder) {
        Copy-Item $folder -Destination $tempDir -Recurse -Force
        $fileCount = (Get-ChildItem -Path "$tempDir\$folder" -Recurse -File).Count
        Write-Host "  ✓ $folder\ ($fileCount fichiers)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $folder\ (non trouvé)" -ForegroundColor Yellow
    }
}

# Calculer la taille totale
$totalSize = (Get-ChildItem -Path $tempDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "`n📊 Taille totale : $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan

# Créer le ZIP
Write-Host "`n🗜️  Compression en cours..." -ForegroundColor Cyan
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Nettoyer le dossier temporaire
Remove-Item $tempDir -Recurse -Force

# Vérifier la création du ZIP
if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "`n✅ ZIP créé avec succès !" -ForegroundColor Green
    Write-Host "📦 Fichier : $zipName" -ForegroundColor Cyan
    Write-Host "💾 Taille : $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "`n🚀 Prêt pour upload sur itch.io !" -ForegroundColor Green
    Write-Host "📖 Consulte ITCH_README.md pour les instructions de déploiement" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Erreur lors de la création du ZIP" -ForegroundColor Red
}

Write-Host "`n" -NoNewline
1..60 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""
