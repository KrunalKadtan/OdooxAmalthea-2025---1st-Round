@echo off
title Complete Expense Management System - Start and Test
color 0B

echo ==========================================
echo    EXPENSE MANAGEMENT SYSTEM
echo    Starting and Testing Complete Workflow
echo ==========================================
echo.

echo [1/3] Starting Backend Server...
echo.
cd expense-backend-nodejs

echo Stopping any existing Node processes...
taskkill /f /im node.exe 2>nul

echo.
echo Starting backend server...
start "Backend Server" cmd /k "echo Backend Server Starting... && node minimal-server.js"

echo.
echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

cd ..

echo.
echo [2/3] Testing Backend API...
echo.
node test-backend.js

echo.
echo [3/3] Starting Frontend...
echo.
cd "Expense Management"

echo Starting frontend development server...
start "Frontend Server" cmd /k "echo Frontend Starting... && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 8 /nobreak > nul

echo.
echo ==========================================
echo    SYSTEM IS READY FOR TESTING!
echo ==========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo 🔄 COMPLETE WORKFLOW TEST:
echo.
echo Step 1: Employee Submits Expense
echo   Login: employee / employee123
echo   - Click "Submit New Expense"
echo   - Fill: Amount, Category, Description, Date
echo   - Submit and see "Pending" status
echo.
echo Step 2: Manager Approves/Rejects
echo   Login: manager / manager123
echo   - See employee's expense in dashboard
echo   - Click "Approve" or "Reject" with reason
echo   - Status changes immediately
echo.
echo Step 3: Admin Views All
echo   Login: admin / admin123
echo   - See ALL expenses from all users
echo   - View complete system statistics
echo.
echo Additional Test User:
echo   Login: sarah / sarah123
echo   - Another employee under same manager
echo.
echo ==========================================

start http://localhost:5173

echo.
echo Opening application in browser...
echo.
echo Both servers are running in separate windows.
echo Press any key to close this window...
pause > nul