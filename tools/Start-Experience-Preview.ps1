$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$kit = Join-Path $repo 'latest-source\experience-kit'
if (-not (Test-Path -LiteralPath (Join-Path $kit 'app.py'))) { throw 'Experience Kit is missing. Extract the complete repository before running this script.' }
$state = Join-Path $env:LOCALAPPDATA 'IQS-Nigeria-Experience-Preview'
$venv = Join-Path $state 'venv'
$venvPython = Join-Path $venv 'Scripts\python.exe'
New-Item -ItemType Directory -Path $state -Force | Out-Null
if (-not (Test-Path -LiteralPath $venvPython)) {
    $python = $null
    $launcher = Get-Command py.exe -ErrorAction SilentlyContinue
    if ($launcher) {
        $candidate = (& $launcher.Source -3.12 -c 'import sys; print(sys.executable)' 2>$null | Select-Object -Last 1)
        if ($LASTEXITCODE -eq 0 -and $candidate -and (Test-Path -LiteralPath $candidate)) { $python = $candidate }
    }
    if (-not $python) {
        $candidate = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'
        if (Test-Path -LiteralPath $candidate) { $python = $candidate }
    }
    if (-not $python) {
        $winget = Get-Command winget.exe -ErrorAction SilentlyContinue
        if (-not $winget) { throw 'Python 3.12 and winget were not found. Install Python 3.12 from python.org, then rerun.' }
        Write-Host 'Installing Python 3.12 for the current user using Windows Package Manager...'
        & $winget.Source install --id Python.Python.3.12 --exact --scope user --accept-package-agreements --accept-source-agreements --disable-interactivity
        if ($LASTEXITCODE -ne 0) { throw 'Python installation failed. Install Python 3.12 and rerun.' }
        $candidate = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'
        if (-not (Test-Path -LiteralPath $candidate)) { throw 'Python was installed but its executable was not found. Open a new terminal and rerun.' }
        $python = $candidate
    }
    & $python -m venv $venv
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the preview virtual environment.' }
}
Write-Host 'Installing the pinned Flask dependency into the preview virtual environment...'
& $venvPython -m pip install 'Flask==3.1.3'
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed. Check internet access and retry.' }
$env:EXPERIENCE_SECURE_COOKIE = '0'
$env:EXPERIENCE_DATABASE = Join-Path $state 'knowledge.sqlite'
Write-Host ''
Write-Host 'Starting the standalone Experience Kit preview at http://127.0.0.1:18110/experience/'
Write-Host 'This is a local UI and knowledge preview, not the complete NigeriaG2P platform.'
Write-Host 'Leave this window open. Press Ctrl+C to stop.'
Start-Process 'http://127.0.0.1:18110/experience/'
Push-Location $kit
try { & $venvPython (Join-Path $kit 'app.py'); if ($LASTEXITCODE -ne 0) { throw 'Preview server exited with an error.' } } finally { Pop-Location }
