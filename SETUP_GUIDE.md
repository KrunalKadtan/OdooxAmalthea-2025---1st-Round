# 🚀 Complete Setup Guide - Expense Management System

## 📋 Prerequisites

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Choose one option):
   
   **Option A: Local MongoDB Installation**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   - Default connection: `mongodb://localhost:27017`
   
   **Option B: MongoDB Atlas (Cloud - Recommended)**
   - Sign up at: https://www.mongodb.com/atlas
   - Create a free cluster
   - Get connection string
   - Update `.env` file in `expense-backend-nodejs` folder

## 🛠️ Setup Instructions

### Step 1: MongoDB Setup

#### For Local MongoDB:
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

#### For MongoDB Atlas:
1. Create account at https://mongodb.com/atlas
2. Create a new cluster (free tier available)
3. Create database user
4. Get connection string
5. Update `expense-backend-nodejs/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_management
   ```

### Step 2: Backend Setup
```bash
cd expense-backend-nodejs
npm install
npm run seed    # This will create test data
npm run dev     # Start backend server
```

### Step 3: Frontend Setup
```bash
cd "Expense Management"
npm install
npm run dev     # Start frontend server
```

## 🎯 Quick Start Options

### Option 1: Use Individual Scripts
```bash
# Start backend only
start-backend-only.bat

# Start frontend only (in another terminal)
start-frontend-only.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd expense-backend-nodejs
npm install && npm run seed && npm run dev

# Terminal 2 - Frontend
cd "Expense Management"
npm install && npm run dev
```

## 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/health

## 👤 Test Credentials
- **Admin**: username=`admin`, password=`admin123`
- **Manager**: username=`manager`, password=`manager123`
- **Employee**: username=`employee`, password=`employee123`
- **Employee 2**: username=`sarah`, password=`sarah123`

## 🔧 Troubleshooting

### MongoDB Connection Issues
1. **Local MongoDB not running**:
   ```bash
   # Windows
   net start MongoDB
   
   # Or check if mongod process is running
   tasklist | findstr mongod
   ```

2. **MongoDB Atlas connection**:
   - Check connection string in `.env`
   - Ensure IP address is whitelisted
   - Verify username/password

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure
```
├── expense-backend-nodejs/     # Node.js Backend
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   └── server.js         # Main server
│   ├── .env                  # Environment variables
│   └── package.json
│
├── Expense Management/         # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   └── ...
│   ├── .env                  # Frontend config
│   └── package.json
│
├── start-backend-only.bat     # Backend startup
├── start-frontend-only.bat    # Frontend startup
└── README.md
```

## 🔍 Verification Steps

1. **Backend Health Check**:
   - Visit: http://localhost:8000/health
   - Should return: `{"success": true, "message": "Server is running"}`

2. **Frontend Loading**:
   - Visit: http://localhost:5173
   - Should show login page

3. **Database Connection**:
   - Backend logs should show: `✅ MongoDB Connected`
   - No connection errors in console

4. **API Test**:
   - Visit: http://localhost:8000/api/test
   - Should return success message

## 🆘 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install` in the respective directory

### Issue: "Port already in use"
**Solution**: Kill the process or use different ports

### Issue: "MongoDB connection failed"
**Solution**: 
- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas: check network access and credentials

### Issue: "CORS error"
**Solution**: Backend includes CORS middleware, ensure frontend URL is correct

### Issue: "Authentication failed"
**Solution**: 
- Clear browser localStorage
- Use correct test credentials
- Check if backend is running

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Backend Console**:
   ```
   ✅ MongoDB Connected
   🚀 Server is running!
   📍 Port: 8000
   ```

2. **Frontend Console**:
   ```
   VITE v5.4.20  ready in 271 ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Browser**:
   - Login page loads without errors
   - Can login with test credentials
   - Dashboard shows with real data

## 📞 Need Help?

If you encounter issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running and accessible
4. Check that both servers are running on correct ports

Happy coding! 🚀