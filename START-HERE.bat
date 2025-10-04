@echo off
title Expense Management System - No MongoDB Required!
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                 EXPENSE MANAGEMENT SYSTEM                    ║
echo  ║                   SQLite Version (No MongoDB!)               ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Starting Backend Server (SQLite)...
cd expense-backend-nodejs
start "Backend - SQLite" cmd /k "node simple-server.js"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Server...
cd ..
cd "Expense Management"
start "Frontend - React" cmd /k "npm install && npm run dev"

echo.
echo ✅ SERVERS STARTING!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔗 Backend:  http://localhost:8000
echo 💾 Database: SQLite (No MongoDB needed!)
echo.
echo 👤 LOGIN CREDENTIALS:
echo    Username: admin     Password: admin123
echo    Username: manager   Password: manager123  
echo    Username: employee  Password: employee123
echo.
echo 📖 Wait for both windows to show "ready" then visit:
echo    http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul