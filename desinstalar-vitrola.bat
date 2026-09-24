@echo off
chcp 65001 > nul
title Desinstalador do Vitrola Hi-Fi — Windows Desktop

echo ===============================================================
echo            DESINSTALADOR DO VITROLA HI-FI                      
echo ===============================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0scripts\uninstall-windows.ps1"

echo.
pause
