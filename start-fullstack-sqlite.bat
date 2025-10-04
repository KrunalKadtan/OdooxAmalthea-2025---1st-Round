@echo off
echo Starting Full Stack Expense Management System with SQLite...
echo.

echo Starting Backend Server with SQLite...
start "Backend Server (SQLite)" cmd /k "cd /d \"%~dp0expense-backend-nodejs\" && npm install && npm run seed:sqlite && npm run dev:sqlite"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%~dp0Expense Management\" && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend (SQLite): http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo ✅ No MongoDB required! Using SQLite database.
echo.
echo Press any key to close this window...
pause > nul