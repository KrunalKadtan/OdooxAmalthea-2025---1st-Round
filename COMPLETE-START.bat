@echo off
title Expense Management System - Complete Startup
color 0A

echo ========================================
echo    EXPENSE MANAGEMENT SYSTEM
echo    Complete Dynamic Workflow Setup
echo ========================================
echo.

echo [1/3] Starting Backend Server...
echo.
cd expense-backend-nodejs

echo Installing dependencies...
call npm install --silent

echo.
echo Starting server...
start "Backend Server" cmd /k "node minimal-server.js"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

cd ..

echo.
echo [2/3] Starting Frontend...
echo.
cd "Expense Management"

echo Installing frontend dependencies...
call npm install --silent

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo [3/3] Setup Complete!
echo.
echo ========================================
echo    SYSTEM IS NOW RUNNING
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Test Credentials:
echo   admin / admin123     (Admin - sees all)
echo   manager / manager123 (Manager - approves/rejects)  
echo   employee / employee123 (Employee - submits)
echo   sarah / sarah123     (Employee - submits)
echo.
echo Workflow:
echo 1. Employee submits expense
echo 2. Manager approves/rejects
echo 3. Admin sees approved expenses
echo.
echo Press any key to open the application...
pause > nul

start http://localhost:5173

echo.
echo Both servers are running in separate windows.
echo Close this window when done testing.
pause