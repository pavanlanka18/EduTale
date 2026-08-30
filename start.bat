@echo off
TITLE EduTale Service Launcher
CD /D "%~dp0"

echo ==========================================
echo        Starting EduTale Service (CMD)
echo ==========================================

IF NOT EXIST ".env" IF EXIST ".env.example" (
    echo Copying .env.example to .env...
    copy ".env.example" ".env" > NUL
)

IF NOT EXIST "backend\.env" IF EXIST "backend\.env.example" (
    copy "backend\.env.example" "backend\.env" > NUL
)

IF NOT EXIST "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo [1/2] Starting Backend API in new window...
start "EduTale Backend" cmd /k "python backend\main.py"

echo [2/2] Starting Frontend App in new window...
start "EduTale Frontend" cmd /k "cd frontend && npm run dev"

echo ==========================================
echo  EduTale services started in separate windows!
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:5173
echo ==========================================
pause
