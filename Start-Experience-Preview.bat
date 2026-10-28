@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Start-Experience-Preview.ps1"
if errorlevel 1 pause
