# EduTale - Windows PowerShell One-click Start Script
# Runs FastAPI Backend + SQLite DB and Vite Frontend simultaneously

$ErrorActionPreference = "Stop"

$RepoRoot = $PSScriptRoot
Set-Location -Path $RepoRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       Starting EduTale Service (Windows)  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Environment files setup
if (-not (Test-Path "$RepoRoot\.env") -and (Test-Path "$RepoRoot\.env.example")) {
    Write-Host "Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item "$RepoRoot\.env.example" "$RepoRoot\.env"
}

if (-not (Test-Path "$RepoRoot\backend\.env") -and (Test-Path "$RepoRoot\backend\.env.example")) {
    Copy-Item "$RepoRoot\backend\.env.example" "$RepoRoot\backend\.env"
}

# 2. Check Python executable
$PythonExe = Get-Command python3 -ErrorAction SilentlyContinue
if (-not $PythonExe) {
    $PythonExe = Get-Command python -ErrorAction SilentlyContinue
}

if (-not $PythonExe) {
    Write-Error "Python was not found on PATH. Please install Python 3.10+ and try again."
    exit 1
}

# 3. Check npm executable
$NpmExe = Get-Command npm -ErrorAction SilentlyContinue
if (-not $NpmExe) {
    Write-Error "npm was not found on PATH. Please install Node.js and try again."
    exit 1
}

# 4. Check/Install Frontend dependencies
if (-not (Test-Path "$RepoRoot\frontend\node_modules")) {
    Write-Host "Installing frontend dependencies (npm install)..." -ForegroundColor Yellow
    Set-Location -Path "$RepoRoot\frontend"
    & npm install
    Set-Location -Path $RepoRoot
}

# 5. Start Backend Process
Write-Host "[1/2] Starting Backend API (FastAPI + SQLite Database)..." -ForegroundColor Green
$BackendProcess = Start-Process -FilePath $PythonExe.Source -ArgumentList "$RepoRoot\backend\main.py" -WorkingDirectory $RepoRoot -PassThru

Start-Sleep -Seconds 2

# 6. Start Frontend Process
Write-Host "[2/2] Starting Frontend App (Vite)..." -ForegroundColor Green
$FrontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory "$RepoRoot\frontend" -PassThru

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " EduTale services are running!" -ForegroundColor Cyan
Write-Host " Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host " Press Ctrl+C in this terminal to stop services." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

try {
    while ($true) {
        if ($BackendProcess.HasExited -or $FrontendProcess.HasExited) {
            Write-Host "One of the services exited. Cleaning up..." -ForegroundColor Yellow
            break
        }
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Shutting down EduTale background services..." -ForegroundColor Yellow
    if ($BackendProcess -and -not $BackendProcess.HasExited) {
        Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($FrontendProcess -and -not $FrontendProcess.HasExited) {
        Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Services stopped." -ForegroundColor Green
}
