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
  storage: path.join(__dirname, 'expense.sqlite'),
  logging: console.log
});

// User model
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'employee' },
  managerId: { type: DataTypes.INTEGER, allowNull: true }
});

// Expense model
const Expense = sequelize.define('Expense', {
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  rejectionReason: { type: DataTypes.TEXT, allowNull: true },
  reviewedById: { type: DataTypes.INTEGER, allowNull: true },
  reviewedAt: { type: DataTypes.DATE, allowNull: true }
});

// Define associations
User.hasMany(Expense, { foreignKey: 'employeeId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });
User.hasMany(Expense, { foreignKey: 'reviewedById', as: 'reviewedExpenses' });
Expense.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewedBy' });
User.hasMany(User, { foreignKey: 'managerId', as: 'teamMembers' });
User.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'simple-secret-key');
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Expense Management Server is running!',
    database: 'SQLite'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    database: 'SQLite'
  });
});

// Authentication routes
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

app.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: User, as: 'manager', attributes: ['id', 'username', 'firstName', 'lastName'] }]
    });
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        manager: user.manager
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
});

// Expense routes
app.get('/api/expenses', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, category } = req.query;

    let whereClause = {};

    // Filter by role
    if (userRole === 'employee') {
      whereClause.employeeId = userId;
    } else if (userRole === 'manager') {
      // Manager can see their team's expenses
      const teamMembers = await User.findAll({ 
        where: { managerId: userId },
        attributes: ['id']
      });
      const teamMemberIds = teamMembers.map(member => member.id);
      whereClause.employeeId = { [require('sequelize').Op.in]: [userId, ...teamMemberIds] };
    }
    // Admin can see all expenses (no filter)

    // Apply additional filters
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Expenses retrieved successfully',
      data: { expenses }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Failed to get expenses' });
  }
});

app.post('/api/expenses', authenticate, async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;
    const userId = req.user.id;

    const expense = await Expense.create({
      employeeId: userId,
      amount,
      currency: currency || 'USD',
      category,
      description,
      date,
      status: 'pending'
    });

    const createdExpense = await Expense.findByPk(expense.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    res.json({
      success: true,
      message: 'Expense created successfully',
      data: createdExpense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Failed to create expense' });
  }
});

app.post('/api/expenses/:id/approve', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!['manager', 'admin'].includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const expense = await Expense.findByPk(id, {
      include: [{ model: User, as: 'employee' }]
    });
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if manager can approve this expense
    if (userRole === 'manager') {
      const canApprove = await User.findOne({ 
        where: { 
          id: expense.employee.id, 
          managerId: userId 
        }
      });
      
      if (!canApprove) {
        return res.status(403).json({ success: false, message: 'You can only approve expenses from your team members' });
      }
    }

    await expense.update({
      status: 'approved_manager',
      reviewedById: userId,
      reviewedAt: new Date()
    });

    const updatedExpense = await Expense.findByPk(id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    res.json({
      success: true,
      message: 'Expense approved successfully',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Approve expense error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve expense' });
  }
});

app.post('/api/expenses/:id/reject', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!['manager', 'admin'].includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const expense = await Expense.findByPk(id, {
      include: [{ model: User, as: 'employee' }]
    });
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if manager can reject this expense
    if (userRole === 'manager') {
      const canReject = await User.findOne({ 
        where: { 
          id: expense.employee.id, 
          managerId: userId 
        }
      });
      
      if (!canReject) {
        return res.status(403).json({ success: false, message: 'You can only reject expenses from your team members' });
      }
    }

    await expense.update({
      status: 'rejected',
      rejectionReason: reason,
      reviewedById: userId,
      reviewedAt: new Date()
    });

    const updatedExpense = await Expense.findByPk(id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    res.json({
      success: true,
      message: 'Expense rejected successfully',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Reject expense error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject expense' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Connecting to SQLite database...');
    await sequelize.authenticate();
    console.log('✅ SQLite Connected');
    
    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced with fresh schema');
    
    console.log('🔄 Creating test users...');
    // Create test users
    const users = [
      { username: 'admin', email: 'admin@test.com', password: 'admin123', firstName: 'Bob', lastName: 'Admin', role: 'admin' },
      { username: 'manager', email: 'manager@test.com', password: 'manager123', firstName: 'Jane', lastName: 'Manager', role: 'manager' },
      { username: 'employee', email: 'employee@test.com', password: 'employee123', firstName: 'John', lastName: 'Employee', role: 'employee' },
      { username: 'sarah', email: 'sarah@test.com', password: 'sarah123', firstName: 'Sarah', lastName: 'Developer', role: 'employee' }
    ];
    
    const createdUsers = {};
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers[userData.username] = user;
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
    }

    console.log('🔄 Setting up manager relationships...');
    // Set manager relationships
    await createdUsers.employee.update({ managerId: createdUsers.manager.id });
    await createdUsers.sarah.update({ managerId: createdUsers.manager.id });
    console.log('✅ Manager relationships set');

    console.log('🔄 Creating sample expenses...');
    // Create sample expenses
    const sampleExpenses = [
      {
        employeeId: createdUsers.employee.id,
        amount: 45.99,
        currency: 'USD',
        category: 'meals',
        description: 'Team lunch at downtown restaurant',
        date: '2024-01-15',
        status: 'pending'
      },
      {
        employeeId: createdUsers.employee.id,
        amount: 250.00,
        currency: 'USD',
        category: 'travel',
        description: 'Flight to client meeting in New York',
        date: '2024-01-10',
        status: 'approved_manager',
        reviewedById: createdUsers.manager.id,
        reviewedAt: new Date()
      },
      {
        employeeId: createdUsers.sarah.id,
        amount: 89.50,
        currency: 'USD',
        category: 'supplies',
        description: 'Office supplies and equipment',
        date: '2024-01-08',
        status: 'rejected',
        rejectionReason: 'Receipt not clear enough to verify items',
        reviewedById: createdUsers.manager.id,
        reviewedAt: new Date()
      },
      {
        employeeId: createdUsers.sarah.id,
        amount: 15.75,
        currency: 'USD',
        category: 'supplies',
        description: 'Notebook and pens for meetings',
        date: '2024-01-20',
        status: 'pending'
      }
    ];

    for (const expenseData of sampleExpenses) {
      await Expense.create(expenseData);
      console.log(`✅ Created expense: ${expenseData.description.substring(0, 30)}...`);
    }
    
    console.log('🚀 Starting server...');
    app.listen(PORT, () => {
      console.log(`
🎉 Expense Management Server Running Successfully!
📍 Port: ${PORT}
🌐 Health: http://localhost:${PORT}/health
🔗 API: http://localhost:${PORT}/api/test
🔐 Login: POST http://localhost:${PORT}/api/auth/login

👤 Test Credentials:
   admin / admin123 (Admin - sees all expenses)
   manager / manager123 (Manager - sees team expenses, can approve/reject)
   employee / employee123 (Employee - sees own expenses, can submit)
   sarah / sarah123 (Employee - sees own expenses, can submit)

🔄 Workflow:
1. Employee submits expense → Status: pending
2. Manager approves/rejects → Status: approved_manager/rejected
3. Admin sees all approved expenses
      `);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();