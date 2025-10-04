require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Expense = require('./models/Expense');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Expense.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // Create company
    const company = await Company.create({
      name: 'Acme Corporation',
      defaultCurrency: 'USD',
      country: 'United States',
      settings: {
        expenseApprovalWorkflow: 'single',
        autoApprovalLimit: 100,
        allowedExpenseCategories: ['travel', 'meals', 'supplies', 'equipment', 'software', 'training'],
        requireReceipts: true,
        maxReceiptSize: 5242880
      }
    });
    console.log('🏢 Created company: Acme Corporation');

    // Create users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@acme.com',
      password: 'admin123',
      firstName: 'Bob',
      lastName: 'Admin',
      role: 'admin',
      company: company._id
    });

    const managerUser = await User.create({
      username: 'manager',
      email: 'manager@acme.com',
      password: 'manager123',
      firstName: 'Jane',
      lastName: 'Manager',
      role: 'manager',
      company: company._id
    });

    const employeeUser = await User.create({
      username: 'employee',
      email: 'employee@acme.com',
      password: 'employee123',
      firstName: 'John',
      lastName: 'Employee',
      role: 'employee',
      company: company._id,
      manager: managerUser._id
    });

    const employee2User = await User.create({
      username: 'sarah',
      email: 'sarah@acme.com',
      password: 'sarah123',
      firstName: 'Sarah',
      lastName: 'Developer',
      role: 'employee',
      company: company._id,
      manager: managerUser._id
    });

    console.log('👥 Created users:');
    console.log(`   - Admin: ${adminUser.username}`);
    console.log(`   - Manager: ${managerUser.username}`);
    console.log(`   - Employee: ${employeeUser.username}`);
    console.log(`   - Employee 2: ${employee2User.username}`);

    // Create sample expenses
    const expenses = [
      {
        employee: employeeUser._id,
        company: company._id,
        amount: 45.99,
        currency: 'USD',
        category: 'meals',
        description: 'Team lunch at downtown restaurant',
        date: new Date('2024-01-15'),
        vendorName: 'Downtown Bistro',
        status: 'pending'
      },
      {
        employee: employeeUser._id,
        company: company._id,
        amount: 250.00,
        currency: 'USD',
        category: 'travel',
        description: 'Flight to client meeting in New York',
        date: new Date('2024-01-10'),
        vendorName: 'American Airlines',
        status: 'approved_manager',
        reviewedBy: managerUser._id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approver: managerUser._id,
          action: 'approved',
          comment: 'Approved for client meeting',
          date: new Date()
        }]
      },
      {
        employee: employeeUser._id,
        company: company._id,
        amount: 89.50,
        currency: 'USD',
        category: 'supplies',
        description: 'Office supplies and equipment',
        date: new Date('2024-01-08'),
        vendorName: 'Office Depot',
        status: 'rejected',
        rejectionReason: 'Receipt not clear enough to verify items',
        reviewedBy: managerUser._id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approver: managerUser._id,
          action: 'rejected',
          comment: 'Receipt not clear enough to verify items',
          date: new Date()
        }]
      },
      {
        employee: employee2User._id,
        company: company._id,
        amount: 320.00,
        currency: 'USD',
        category: 'training',
        description: 'React.js certification course',
        date: new Date('2024-01-12'),
        vendorName: 'Udemy',
        status: 'approved',
        reviewedBy: managerUser._id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approver: managerUser._id,
          action: 'approved',
          comment: 'Good investment in skills development',
          date: new Date()
        }]
      },
      {
        employee: employee2User._id,
        company: company._id,
        amount: 15.75,
        currency: 'USD',
        category: 'supplies',
        description: 'Notebook and pens for meetings',
        date: new Date('2024-01-20'),
        vendorName: 'Staples',
        status: 'pending'
      },
      {
        employee: managerUser._id,
        company: company._id,
        amount: 125.00,
        currency: 'USD',
        category: 'meals',
        description: 'Client dinner meeting',
        date: new Date('2024-01-18'),
        vendorName: 'The Capital Grille',
        status: 'approved',
        reviewedBy: adminUser._id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approver: adminUser._id,
          action: 'approved',
          comment: 'Client entertainment approved',
          date: new Date()
        }]
      }
    ];

    await Expense.insertMany(expenses);
    console.log('💰 Created sample expenses');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Manager: username=manager, password=manager123');
    console.log('   Employee: username=employee, password=employee123');
    console.log('   Employee 2: username=sarah, password=sarah123');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData };