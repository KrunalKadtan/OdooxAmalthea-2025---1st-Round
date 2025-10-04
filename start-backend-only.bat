@echo off
echo Starting Node.js Backend Server...
echo.

cd /d "%~dp0expense-backend-nodejs"

echo Installing dependencies...
npm install

echo Seeding database with test data...
npm run seed

echo Starting development server...
npm run dev

pause