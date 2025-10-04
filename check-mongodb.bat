@echo off
echo Checking MongoDB Status...
echo.

echo Checking if MongoDB service is running...
sc query MongoDB > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB service found
    sc query MongoDB | findstr "STATE"
) else (
    echo ❌ MongoDB service not found
    echo.
    echo MongoDB might not be installed as a Windows service.
    echo.
    echo Options:
    echo 1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community
    echo 2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas
    echo 3. Start MongoDB manually with: mongod --dbpath "C:\data\db"
)

echo.
echo Checking if MongoDB process is running...
tasklist | findstr "mongod" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB process is running
    tasklist | findstr "mongod"
) else (
    echo ❌ MongoDB process not found
)

echo.
echo Testing MongoDB connection...
cd expense-backend-nodejs
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
" 2>nul

echo.
pause