@echo off
echo Starting Node.js Backend with SQLite...
echo.

cd /d "%~dp0expense-backend-nodejs"

echo Installing dependencies...
npm install

echo Seeding SQLite database with test data...
npm run seed:sqlite

echo Starting development server with SQLite...
npm run dev:sqlite

pause