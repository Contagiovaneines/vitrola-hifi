@echo off
chcp 65001 > nul
title Instalador do Vitrola Hi-Fi — Windows Desktop

echo ===============================================================
echo            INSTALADOR AUTOMATICO DO VITROLA HI-FI              
echo ===============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi detectado no sistema!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo [*] Gerando icones e recursos visuais...
node scripts/generate_app_icon.cjs
node scripts/generate_thumbar_icons.cjs

echo [*] Verificando compilacao de producao...
if not exist "dist\index.html" (
    echo [*] Compilando assets do Vitrola...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao compilar aplicacao.
        pause
        exit /b 1
    )
)

echo [*] Instalando atalhos na Area de Trabalho, Menu Iniciar e Registro...
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\install-windows.ps1"

echo.
echo Pressione qualquer tecla para sair ou testar agora...
pause
