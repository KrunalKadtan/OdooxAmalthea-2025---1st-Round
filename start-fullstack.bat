@echo off
echo Starting Full Stack Expense Management System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd expense-backend-nodejs && npm install && npm run seed && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd \"Expense Management\" && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul