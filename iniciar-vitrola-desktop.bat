@echo off
chcp 65001 > nul
title Vitrola — Hi-Fi Desktop Console (Electron Desktop)

echo ===============================================================
echo        VITROLA — HI-FI TURNTABLE CONSOLE DESKTOP (NATIVO)        
echo ===============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi encontrado no sistema!
    echo Por favor, instale o Node.js LTS (v20 ou superior) em: https://nodejs.org/
    pause
    exit /b 1
)

echo [*] Verificando compilacao de producao...
if not exist "dist\index.html" (
    echo [*] Compilando aplicacao Vitrola...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERRO] Falha na compilacao da aplicacao.
        pause
        exit /b 1
    )
)

echo [*] Iniciando Vitrola como Aplicativo Desktop com Navegador Integrado...
echo [*] Login do Google e YouTube Music sao suportados diretamente na janela.
echo.

call npx electron electron/main.cjs
