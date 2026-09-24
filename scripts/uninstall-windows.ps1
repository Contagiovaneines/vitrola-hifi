# scripts/uninstall-windows.ps1
$desktopDir = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$startMenuDir = Join-Path ([System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)) "Vitrola Hi-Fi"
$desktopShortcutPath = Join-Path $desktopDir "Vitrola Hi-Fi.lnk"

Write-Host "Removendo atalhos do Vitrola Hi-Fi..." -ForegroundColor Yellow

if (Test-Path $desktopShortcutPath) {
    Remove-Item -Path $desktopShortcutPath -Force
    Write-Host "[-] Atalho da Area de Trabalho removido." -ForegroundColor Green
}

if (Test-Path $startMenuDir) {
    Remove-Item -Path $startMenuDir -Recurse -Force
    Write-Host "[-] Pasta do Menu Iniciar removida." -ForegroundColor Green
}

$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Vitrola"
if (Test-Path $regPath) {
    Remove-Item -Path $regPath -Recurse -Force
    Write-Host "[-] Registro do Windows removido." -ForegroundColor Green
}

Write-Host ""
Write-Host "Vitrola Hi-Fi desinstalada com sucesso do seu sistema!" -ForegroundColor Green
