@echo off
echo Starting Backend with SQLite...
echo.

cd expense-backend-nodejs

echo Installing dependencies...
npm install

echo Setting up SQLite database...
npm run seed:sqlite

echo Starting backend server...
npm run dev:sqlite

pause