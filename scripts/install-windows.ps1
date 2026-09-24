# scripts/install-windows.ps1
# Script de instalacao do Vitrola Hi-Fi no Windows

$ErrorActionPreference = "Stop"

$appDir = (Get-Item -Path "$PSScriptRoot\..").FullName
$iconPath = Join-Path $appDir "public\icon.ico"
$vbsLauncher = Join-Path $appDir "vitrola-desktop.vbs"
$batLauncher = Join-Path $appDir "iniciar-vitrola-desktop.bat"

Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host "      INSTALADOR WINDOWS - VITROLA HI-FI CONSOLE       " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host ""

# 1. Cria o launcher silencioso em VBScript (sem janela preta de prompt)
$vbsLines = @(
    'Set WshShell = CreateObject("WScript.Shell")',
    'Set fso = CreateObject("Scripting.FileSystemObject")',
    'scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)',
    'WshShell.CurrentDirectory = scriptDir',
    'WshShell.Run "cmd /c call npm run desktop", 0, False'
)
[System.IO.File]::WriteAllLines($vbsLauncher, $vbsLines)
Write-Host "[OK] Launcher silencioso criado: vitrola-desktop.vbs" -ForegroundColor Green

# 2. Caminhos para Atalhos
$desktopDir = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$startMenuDir = Join-Path ([System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)) "Vitrola Hi-Fi"

if (!(Test-Path $startMenuDir)) {
    New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
}

$wshShell = New-Object -ComObject WScript.Shell

# 3. Cria atalho na Area de Trabalho (Desktop)
$desktopShortcutPath = Join-Path $desktopDir "Vitrola Hi-Fi.lnk"
$desktopShortcut = $wshShell.CreateShortcut($desktopShortcutPath)
$desktopShortcut.TargetPath = "wscript.exe"
$desktopShortcut.Arguments = "`"$vbsLauncher`""
$desktopShortcut.WorkingDirectory = $appDir
$desktopShortcut.Description = "Vitrola Hi-Fi - Turntable Console Desktop com YouTube Music e Dock Widget"
if (Test-Path $iconPath) {
    $desktopShortcut.IconLocation = "$iconPath, 0"
}
$desktopShortcut.Save()
Write-Host "[OK] Atalho na Area de Trabalho criado: $desktopShortcutPath" -ForegroundColor Green

# 4. Cria atalho no Menu Iniciar
$startShortcutPath = Join-Path $startMenuDir "Vitrola Hi-Fi.lnk"
$startShortcut = $wshShell.CreateShortcut($startShortcutPath)
$startShortcut.TargetPath = "wscript.exe"
$startShortcut.Arguments = "`"$vbsLauncher`""
$startShortcut.WorkingDirectory = $appDir
$startShortcut.Description = "Vitrola Hi-Fi - Turntable Console Desktop"
if (Test-Path $iconPath) {
    $startShortcut.IconLocation = "$iconPath, 0"
}
$startShortcut.Save()
Write-Host "[OK] Atalho no Menu Iniciar criado em: $startShortcutPath" -ForegroundColor Green

# 5. Atalho para Desinstalar no Menu Iniciar
$uninstallerBat = Join-Path $appDir "desinstalar-vitrola.bat"
$uninstallShortcutPath = Join-Path $startMenuDir "Desinstalar Vitrola.lnk"
$uninstallShortcut = $wshShell.CreateShortcut($uninstallShortcutPath)
$uninstallShortcut.TargetPath = $uninstallerBat
$uninstallShortcut.WorkingDirectory = $appDir
$uninstallShortcut.Description = "Desinstalar atalhos do Vitrola Hi-Fi"
$uninstallShortcut.Save()

# 6. Registra no Windows (Aplicativos Instalados / Apps & Features)
try {
    $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Vitrola"
    if (!(Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "DisplayName" -Value "Vitrola Hi-Fi Turntable Console"
    Set-ItemProperty -Path $regPath -Name "DisplayVersion" -Value "1.0.0"
    Set-ItemProperty -Path $regPath -Name "Publisher" -Value "Vitrola Audio Lab"
    Set-ItemProperty -Path $regPath -Name "DisplayIcon" -Value $iconPath
    Set-ItemProperty -Path $regPath -Name "InstallLocation" -Value $appDir
    Set-ItemProperty -Path $regPath -Name "UninstallString" -Value "`"$uninstallerBat`""
    Write-Host "[OK] Registrado no Windows (Configuracoes > Aplicativos Instalados)!" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Aviso sobre registro do Windows: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host "     INSTALACAO CONCLUIDA COM SUCESSO NO WINDOWS!      " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "Voce ja pode abrir a Vitrola pelo icone na Area de Trabalho,"
Write-Host "pelo Menu Iniciar ou executando iniciar-vitrola-desktop.bat."
Write-Host ""
