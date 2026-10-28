param([string]$Destination = (Join-Path $env:USERPROFILE 'IQS-Nigeria-Setup'))
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$bundle = Join-Path $repo 'IQS-Nigeria-G2P-Recovery-Bundle.zip'
$manifest = Join-Path $repo 'BUNDLE.sha256'
if (-not (Test-Path -LiteralPath $bundle) -or -not (Test-Path -LiteralPath $manifest)) { throw 'The recovery bundle or checksum is missing. Download the complete repository.' }
$expected = ((Get-Content -LiteralPath $manifest -TotalCount 1) -split '\s+')[0]
if ($expected -notmatch '^[a-fA-F0-9]{64}$') { throw 'Invalid recovery bundle checksum.' }
Write-Host 'Verifying the recovery bundle...'
if ((Get-FileHash -LiteralPath $bundle -Algorithm SHA256).Hash -ne $expected) { throw 'Bundle checksum mismatch. Download a fresh copy before proceeding.' }
if (Test-Path -LiteralPath $Destination) { throw "Destination already exists: $Destination. Choose a new empty path; nothing was overwritten." }
New-Item -ItemType Directory -Path $Destination | Out-Null
try {
    Expand-Archive -LiteralPath $bundle -DestinationPath $Destination
    $inner = Join-Path $Destination 'iqs-nigeria-g2p\installation\IQS-Nigeria-Installation-Kit.zip'
    if (-not (Test-Path -LiteralPath $inner)) { throw 'Installation kit was not found in the recovery bundle.' }
    Expand-Archive -LiteralPath $inner -DestinationPath $Destination
} catch { Write-Warning "Preparation did not finish. Inspect the new directory: $Destination"; throw }
Write-Host ''
Write-Host "Files prepared in: $Destination"
Write-Host 'The full platform is NOT installed by this preparation script.'
Write-Host 'Next: follow DEVELOPER-SETUP.md and the installation guide, including WSL, staging, checkpoints and domain setup.'
Write-Host 'Never point another installation at the existing public domain or reuse its tunnel and credentials.'
if (Get-Command wsl.exe -ErrorAction SilentlyContinue) { Write-Host 'WSL is available. Inspect distributions with: wsl --list --verbose' } else { Write-Host 'WSL is not available; install and configure it following DEVELOPER-SETUP.md.' }
