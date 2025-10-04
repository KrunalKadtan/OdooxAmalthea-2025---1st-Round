require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// SQLite setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'simple.sqlite'),
  logging: false
});

// Simple User model
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'employee' }
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple SQLite server is running!',
    database: 'SQLite'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working with SQLite!',
    database: 'SQLite'
  });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      'simple-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Connected');
    
    await sequelize.sync();
    console.log('✅ Database synced');
    
    // Create test users
    const users = [
      { username: 'admin', email: 'admin@test.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' },
      { username: 'manager', email: 'manager@test.com', password: 'manager123', firstName: 'Manager', lastName: 'User', role: 'manager' },
      { username: 'employee', email: 'employee@test.com', password: 'employee123', firstName: 'Employee', lastName: 'User', role: 'employee' }
    ];
    
    for (const userData of users) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.username}`);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`
🚀 Simple SQLite Server Running!
📍 Port: ${PORT}
🌐 Health: http://localhost:${PORT}/health
🔗 API: http://localhost:${PORT}/api/test
🔐 Login: POST http://localhost:${PORT}/api/auth/login

👤 Test Credentials:
   admin / admin123
   manager / manager123
   employee / employee123
      `);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
}

startServer();