# Script de remplacement automatique du CSS inline
# Remplace les .style. par des classes CSS

$files = @(
    "js/script.js",
    "js/pocketbase-integration.js",
    "js/footer-loader.js"
)

$replacements = @{
    # Display
    "\.style\.display\s*=\s*['\"]none['\"]" = ".classList.add('is-hidden')"
    "\.style\.display\s*=\s*['\"]block['\"]" = ".classList.remove('is-hidden')"
    "\.style\.display\s*=\s*['\"]flex['\"]" = ".classList.add('is-flex')"
    
    # Cursor
    "\.style\.cursor\s*=\s*['\"]pointer['\"]" = ".classList.add('cursor-pointer')"
    "\.style\.cursor\s*=\s*['\"]default['\"]" = ".classList.remove('cursor-pointer')"
}

Write-Host "🔧 Remplacement du CSS inline..." -ForegroundColor Cyan

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot "..\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "`n📄 Traitement de $file..." -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        $changeCount = 0
        
        foreach ($pattern in $replacements.Keys) {
            $replacement = $replacements[$pattern]
            $matches = [regex]::Matches($content, $pattern)
            
            if ($matches.Count -gt 0) {
                Write-Host "  ✓ $($matches.Count) occurrence(s) de '$pattern'" -ForegroundColor Green
                $content = $content -replace $pattern, $replacement
                $changeCount += $matches.Count
            }
        }
        
        if ($changeCount -gt 0) {
            # Backup
            $backupPath = "$fullPath.backup"
            Copy-Item $fullPath $backupPath -Force
            Write-Host "  💾 Backup créé: $backupPath" -ForegroundColor Gray
            
            # Sauvegarder
            Set-Content $fullPath $content -NoNewline
            Write-Host "  ✅ $changeCount remplacement(s) effectué(s)" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  Aucun remplacement nécessaire" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  Fichier non trouvé: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`n✨ Remplacement terminé!" -ForegroundColor Cyan
Write-Host "⚠️  Note: Les propriétés dynamiques (left, top, width, height) doivent rester en inline" -ForegroundColor Yellow
Write-Host "📝 Vérifiez manuellement les fichiers modifiés avant de commiter" -ForegroundColor Yellow
