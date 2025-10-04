@echo off
echo Starting Fixed Expense Management Backend...
echo.

cd expense-backend-nodejs

echo Stopping any existing processes...
taskkill /f /im node.exe 2>nul

echo Starting enhanced backend server...
node server-fixed.js

pause