@echo off
echo Starting Node.js Backend Server...
echo.

echo Navigating to backend directory...
cd expense-backend-nodejs

echo Installing dependencies...
npm install

echo Seeding database with test data...
npm run seed

echo Starting development server...
npm run dev

pause