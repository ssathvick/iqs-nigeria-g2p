@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Install-WSL-Ubuntu.ps1"
pause
