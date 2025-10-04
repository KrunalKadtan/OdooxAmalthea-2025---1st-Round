@echo off
echo Restarting Backend Server...
echo.

cd expense-backend-nodejs

echo Stopping any existing Node processes...
taskkill /f /im node.exe 2>nul

echo.
echo Starting backend server...
node minimal-server.js

pause