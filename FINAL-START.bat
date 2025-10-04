@echo off
title Complete Expense Management System
color 0A

echo ==========================================
echo    EXPENSE MANAGEMENT SYSTEM
echo    Complete Dynamic Workflow
echo ==========================================
echo.

echo [1/2] Starting Backend Server...
echo.
cd expense-backend-nodejs

echo Starting backend on port 8000...
start "Backend Server" cmd /k "echo Backend Server Starting... && node minimal-server.js && echo Backend server stopped. Press any key to close. && pause"

echo.
echo Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

cd ..

echo.
echo [2/2] Starting Frontend...
echo.
cd "Expense Management"

echo Starting frontend on port 5173...
start "Frontend Server" cmd /k "echo Frontend Server Starting... && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo ==========================================
echo    SYSTEM IS NOW RUNNING!
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
echo   - Fill details and submit
echo   - See status: "Pending"
echo.
echo Step 2: Manager Approves/Rejects
echo   Login: manager / manager123
echo   - See employee's expense
echo   - Click "Approve" or "Reject"
echo   - Status changes to "Approved" or "Rejected"
echo.
echo Step 3: Admin Views All
echo   Login: admin / admin123
echo   - See ALL expenses from all users
echo   - View system statistics
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
echo Close those windows when done testing.
echo.
echo Press any key to close this window...
pause > nul