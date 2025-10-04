@echo off
echo Starting React Frontend Server...
echo.

cd /d "%~dp0Expense Management"

echo Installing dependencies...
npm install

echo Starting development server...
npm run dev

pause