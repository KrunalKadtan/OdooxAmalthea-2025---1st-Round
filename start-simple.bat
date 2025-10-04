@echo off
echo Starting Expense Management System (SQLite - No MongoDB needed)
echo.

echo Step 1: Starting Backend...
cd expense-backend-nodejs
start "Backend" cmd /k "npm install && npm run seed:sqlite && npm run dev:sqlite"

echo Step 2: Waiting 5 seconds...
timeout /t 5 /nobreak > nul

echo Step 3: Starting Frontend...
cd ..
cd "Expense Management"
start "Frontend" cmd /k "npm install && npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:8000
echo 💾 Database: SQLite (no MongoDB required)
echo.
echo 👤 Test Login: admin / admin123
echo.
pause