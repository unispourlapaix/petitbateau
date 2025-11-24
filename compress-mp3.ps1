# Script de compression MP3 à 92 kbps Joint Stéréo (qualité radio)
# Réduit drastiquement la taille tout en gardant une qualité acceptable

Write-Host "🎵 Compression MP3 - 92 kbps Joint Stéréo (Qualité Radio)" -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Cyan
1..70 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""

# Vérifier si FFmpeg est installé
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-String "ffmpeg version" | Select-Object -First 1
    Write-Host "✅ FFmpeg détecté : $ffmpegVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ FFmpeg n'est pas installé !" -ForegroundColor Red
    Write-Host "📥 Installe FFmpeg avec : winget install ffmpeg" -ForegroundColor Yellow
    Write-Host "Ou télécharge depuis : https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# Dossier source et destination
$sourceDir = ".\modules\gospel"
$backupDir = ".\modules\gospel-backup"
$tempDir = ".\modules\gospel-compressed"

# Créer le backup si non existant
if (-not (Test-Path $backupDir)) {
    Write-Host "`n💾 Création du backup..." -ForegroundColor Yellow
    Copy-Item $sourceDir -Destination $backupDir -Recurse -Force
    Write-Host "✅ Backup créé dans : $backupDir" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Backup existe déjà : $backupDir" -ForegroundColor Yellow
}

# Créer le dossier temporaire
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Récupérer tous les MP3
$mp3Files = Get-ChildItem "$sourceDir\*.mp3"
$totalFiles = $mp3Files.Count
$currentFile = 0
$totalSizeBefore = 0
$totalSizeAfter = 0

Write-Host "`n🎵 Compression de $totalFiles fichiers MP3..." -ForegroundColor Cyan
Write-Host "⚙️  Paramètres : 92 kbps, Joint Stéréo, Qualité Radio" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $mp3Files) {
    $currentFile++
    $sizeBefore = $file.Length / 1MB
    $totalSizeBefore += $sizeBefore
    
    $outputFile = Join-Path $tempDir $file.Name
    
    Write-Host "[$currentFile/$totalFiles] " -NoNewline -ForegroundColor Cyan
    Write-Host "$($file.Name)" -NoNewline -ForegroundColor White
    Write-Host " ($([math]::Round($sizeBefore, 2)) MB)" -ForegroundColor Gray
    
    # Compression avec FFmpeg
    # -codec:a libmp3lame = encodeur MP3
    # -b:a 92k = bitrate audio 92 kbps
    # -ac 2 = 2 canaux (stéréo)
    # -joint_stereo 1 = joint stereo (mode par défaut de LAME pour stéréo)
    # -compression_level 2 = qualité LAME (0=meilleure qualité, 9=plus rapide)
    $ffmpegArgs = @(
        "-i", $file.FullName,
        "-codec:a", "libmp3lame",
        "-b:a", "92k",
        "-ac", "2",
        "-compression_level", "2",
        "-y",
        $outputFile
    )
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru -RedirectStandardError "NUL"
    
    if ($process.ExitCode -eq 0 -and (Test-Path $outputFile)) {
        $sizeAfter = (Get-Item $outputFile).Length / 1MB
        $totalSizeAfter += $sizeAfter
        $reduction = (($sizeBefore - $sizeAfter) / $sizeBefore) * 100
        
        Write-Host "    ✓ Compressé : $([math]::Round($sizeAfter, 2)) MB " -NoNewline -ForegroundColor Green
        Write-Host "(-$([math]::Round($reduction, 1))%)" -ForegroundColor Yellow
    } else {
        Write-Host "    ✗ Erreur de compression" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
1..70 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""

# Statistiques finales
Write-Host "`n📊 RÉSULTATS :" -ForegroundColor Cyan
Write-Host "  Taille originale  : $([math]::Round($totalSizeBefore, 2)) MB" -ForegroundColor White
Write-Host "  Taille compressée : $([math]::Round($totalSizeAfter, 2)) MB" -ForegroundColor Green
Write-Host "  Économie          : $([math]::Round($totalSizeBefore - $totalSizeAfter, 2)) MB" -ForegroundColor Yellow
Write-Host "  Réduction         : $([math]::Round((($totalSizeBefore - $totalSizeAfter) / $totalSizeBefore) * 100, 1))%" -ForegroundColor Yellow

Write-Host "`n❓ Remplacer les fichiers originaux ? (O/N)" -ForegroundColor Yellow -NoNewline
$confirmation = Read-Host " "

if ($confirmation -eq "O" -or $confirmation -eq "o" -or $confirmation -eq "oui" -or $confirmation -eq "yes") {
    Write-Host "`n🔄 Remplacement des fichiers..." -ForegroundColor Cyan
    
    # Supprimer les anciens fichiers
    Remove-Item "$sourceDir\*.mp3" -Force
    
    # Copier les nouveaux fichiers
    Copy-Item "$tempDir\*.mp3" -Destination $sourceDir -Force
    
    # Nettoyer le dossier temporaire
    Remove-Item $tempDir -Recurse -Force
    
    Write-Host "✅ Fichiers remplacés avec succès !" -ForegroundColor Green
    Write-Host "💾 Backup disponible dans : $backupDir" -ForegroundColor Yellow
    
    Write-Host "`n🎮 N'oublie pas de recréer le ZIP itch.io avec : .\build-itch.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Opération annulée" -ForegroundColor Red
    Write-Host "📁 Fichiers compressés disponibles dans : $tempDir" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
1..70 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host ""
