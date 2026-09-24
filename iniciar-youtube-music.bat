@echo off
chcp 65001 > nul
title Vitrola — YouTube Music Companion

echo ===============================================================
echo        VITROLA — YOUTUBE MUSIC DESKTOP COMPANION               
echo ===============================================================
echo.
echo Abrindo YouTube Music com sua conta Google em janela dedicada...
echo.

set "EDGE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"

if exist "%EDGE_PATH%" (
    start "" "%EDGE_PATH%" --app=https://music.youtube.com
    goto done
)

if exist "%CHROME_PATH%" (
    start "" "%CHROME_PATH%" --app=https://music.youtube.com
    goto done
)

REM Fallback para navegador padrao
start https://music.youtube.com

:done
echo [OK] Janela do YouTube Music iniciada com sucesso!
echo Faca login com sua conta Google para acessar todas as suas playlists e musicas.
