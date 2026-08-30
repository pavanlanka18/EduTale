#!/usr/bin/env bash

# EduTale - One-click Start Script
# Runs backend (FastAPI + SQLite DB initialized on startup) and frontend (Vite dev server)

set -e

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Determine repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}          Starting EduTale Service        ${NC}"
echo -e "${BLUE}==========================================${NC}"

# Check Python environment
PYTHON_BIN=""
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PYTHON_BIN="python"
else
    echo "Error: Python is required but neither python3 nor python was found on PATH." >&2
    exit 1
fi

# Check Node / npm
if ! command -v npm &>/dev/null; then
    echo "Error: npm is required to start the frontend." >&2
    exit 1
fi

# Setup environment variables if .env doesn't exist
if [ ! -f "$REPO_ROOT/.env" ] && [ -f "$REPO_ROOT/.env.example" ]; then
    echo -e "${YELLOW}No .env file found. Copying .env.example to .env...${NC}"
    cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
fi

if [ ! -f "$REPO_ROOT/backend/.env" ] && [ -f "$REPO_ROOT/backend/.env.example" ]; then
    cp "$REPO_ROOT/backend/.env.example" "$REPO_ROOT/backend/.env"
fi

# Function to handle shutdown on SIGINT/SIGTERM
cleanup() {
    echo -e "\n${YELLOW}Shutting down EduTale services...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}EduTale stopped successfully.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend (FastAPI + SQLite DB)
echo -e "${GREEN}[1/2] Starting Backend API (FastAPI + SQLite Database)...${NC}"
"$PYTHON_BIN" "$REPO_ROOT/backend/main.py" &
BACKEND_PID=$!

# Give backend a moment to initialize database and start listening
sleep 2

# 2. Start Frontend (Vite)
echo -e "${GREEN}[2/2] Starting Frontend App (Vite)...${NC}"
cd "$REPO_ROOT/frontend"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies (npm install)...${NC}"
    npm install
fi

npm run dev &
FRONTEND_PID=$!

cd "$REPO_ROOT"

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN} EduTale services are up and running!     ${NC}"
echo -e "${GREEN} Backend:  http://localhost:8000           ${NC}"
echo -e "${GREEN} Frontend: http://localhost:5173          ${NC}"
echo -e "${GREEN} Press Ctrl+C to stop all services.       ${NC}"
echo -e "${GREEN}==========================================${NC}"

# Wait for background processes
wait
