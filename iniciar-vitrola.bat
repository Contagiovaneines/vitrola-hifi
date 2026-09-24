@echo off
chcp 65001 > nul
title Vitrola — Hi-Fi Turntable Console

echo ===============================================================
echo        VITROLA — HI-FI TURNTABLE CONSOLE PARA WINDOWS          
echo ===============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi encontrado no sistema!
    echo Por favor, instale o Node.js LTS (v20 ou superior) em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [*] Verificando dependencias...
if not exist "node_modules\" (
    echo [*] Instalando modulos necessarios...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias via npm.
        pause
        exit /b 1
    )
)

echo [*] Verificando pacote de producao...
if not exist "dist\index.html" (
    echo [*] Compilando aplicacao para producao...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERRO] Falha na compilacao da aplicacao.
        pause
        exit /b 1
    )
)

echo.
echo ===============================================================
echo  INICIANDO CONSOLE RETRO VITROLA (PRODUCAO)
echo  Pressione CTRL+C nesta janela para encerrar.
echo ===============================================================
echo.

REM Inicia o servidor de visualizacao otimizado e abre no navegador/webview padrao
start http://localhost:4173
call npx vite preview --port 4173 --host
