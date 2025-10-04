@echo off
echo Starting Frontend...
echo.

cd "Expense Management"

echo Installing dependencies...
npm install

echo Starting frontend server...
npm run dev

pause