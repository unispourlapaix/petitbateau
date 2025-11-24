# Remplacement automatique des MP3 compressés
Write-Host "🔄 Remplacement des MP3 par les versions compressées..." -ForegroundColor Cyan

$sourceDir = ".\modules\gospel"
$compressedDir = ".\modules\gospel-compressed"

if (Test-Path $compressedDir) {
    # Supprimer les anciens fichiers
    Remove-Item "$sourceDir\*.mp3" -Force
    Write-Host "✅ Anciens MP3 supprimés" -ForegroundColor Green
    
    # Copier les nouveaux fichiers
    Copy-Item "$compressedDir\*.mp3" -Destination $sourceDir -Force
    Write-Host "✅ MP3 compressés copiés" -ForegroundColor Green
    
    # Nettoyer le dossier temporaire
    Remove-Item $compressedDir -Recurse -Force
    Write-Host "✅ Dossier temporaire nettoyé" -ForegroundColor Green
    
    # Vérifier la nouvelle taille
    $newSize = (Get-ChildItem "$sourceDir\*.mp3" | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "`n📊 Nouvelle taille totale : $([math]::Round($newSize, 2)) MB" -ForegroundColor Yellow
    
    Write-Host "`n✅ Opération terminée !" -ForegroundColor Green
    Write-Host "💾 Backup disponible dans : .\modules\gospel-backup" -ForegroundColor Cyan
} else {
    Write-Host "❌ Dossier compressé introuvable : $compressedDir" -ForegroundColor Red
}
