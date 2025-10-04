@echo off
title Complete Expense Management Workflow Test
color 0B

echo ==========================================
echo    COMPLETE EXPENSE MANAGEMENT SYSTEM
echo    Dynamic Workflow Test
echo ==========================================
echo.

echo This will test the complete workflow:
echo 1. Employee submits expense
echo 2. Manager approves/rejects  
echo 3. Admin sees all expenses
echo.

echo Starting Backend Server...
cd expense-backend-nodejs
start "Backend" cmd /k "echo Starting Backend... && node minimal-server.js"

echo.
echo Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

cd ..

echo.
echo Starting Frontend...
cd "Expense Management"
start "Frontend" cmd /k "echo Starting Frontend... && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo ==========================================
echo    SYSTEM IS READY FOR TESTING!
echo ==========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo TEST WORKFLOW:
echo.
echo Step 1: Login as Employee
echo   Username: employee
echo   Password: employee123
echo   - Submit a new expense
echo   - See it in "My Expenses" with status "Pending"
echo.
echo Step 2: Login as Manager  
echo   Username: manager
echo   Password: manager123
echo   - See employee's expense in dashboard
echo   - Click "Approve" or "Reject" 
echo   - See status change immediately
echo.
echo Step 3: Login as Admin
echo   Username: admin
echo   Password: admin123
echo   - See ALL expenses from all users
echo   - View system statistics
echo   - See approved expenses from manager
echo.
echo Additional Test User:
echo   Username: sarah
echo   Password: sarah123
echo   - Another employee under same manager
echo.
echo ==========================================

start http://localhost:5173

echo.
echo Opening application in browser...
echo Both servers are running in separate windows.
echo.
echo Press any key to close this window...
pause > nul