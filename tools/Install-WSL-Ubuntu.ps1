$ErrorActionPreference = 'Stop'
$wsl = Get-Command wsl.exe -ErrorAction SilentlyContinue
if (-not $wsl) { throw 'WSL is unavailable. Install it using Microsoft Windows features, then retry.' }
$raw = (& $wsl.Source --list --quiet 2>$null | Out-String) -replace "`0", ''
if ($LASTEXITCODE -eq 0 -and ($raw -split "`r?`n" | ForEach-Object { $_.Trim() }) -contains 'Ubuntu-22.04') {
    Write-Host 'Ubuntu-22.04 is already registered. Nothing was installed or modified.'
    & $wsl.Source --list --verbose
    exit 0
}
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run Install-WSL-Ubuntu.bat from an Administrator command prompt. Enabling WSL may require a Windows restart.'
}
Write-Host 'Installing WSL and Ubuntu 22.04. Windows may request a restart or first-run account setup.'
& $wsl.Source --install --distribution Ubuntu-22.04
if ($LASTEXITCODE -ne 0) { throw 'WSL installation did not complete. Follow the Microsoft WSL installation instructions and retry.' }
Write-Host 'Complete any requested restart and Ubuntu first-run setup, then continue with DEVELOPER-SETUP.md.'
