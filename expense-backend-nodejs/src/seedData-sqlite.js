require('dotenv').config();
const { connectDB } = require('./config/database-sqlite');
const { User, Company, Expense } = require('./models-sqlite');

const seedData = async () => {
  try {
    console.log('🌱 Starting SQLite database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    await Expense.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Company.destroy({ where: {} });
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
      companyId: company.id
    });

    const managerUser = await User.create({
      username: 'manager',
      email: 'manager@acme.com',
      password: 'manager123',
      firstName: 'Jane',
      lastName: 'Manager',
      role: 'manager',
      companyId: company.id
    });

    const employeeUser = await User.create({
      username: 'employee',
      email: 'employee@acme.com',
      password: 'employee123',
      firstName: 'John',
      lastName: 'Employee',
      role: 'employee',
      companyId: company.id,
      managerId: managerUser.id
    });

    const employee2User = await User.create({
      username: 'sarah',
      email: 'sarah@acme.com',
      password: 'sarah123',
      firstName: 'Sarah',
      lastName: 'Developer',
      role: 'employee',
      companyId: company.id,
      managerId: managerUser.id
    });

    console.log('👥 Created users:');
    console.log(`   - Admin: ${adminUser.username}`);
    console.log(`   - Manager: ${managerUser.username}`);
    console.log(`   - Employee: ${employeeUser.username}`);
    console.log(`   - Employee 2: ${employee2User.username}`);

    // Create sample expenses
    const expenses = [
      {
        employeeId: employeeUser.id,
        companyId: company.id,
        amount: 45.99,
        currency: 'USD',
        category: 'meals',
        description: 'Team lunch at downtown restaurant',
        date: '2024-01-15',
        vendorName: 'Downtown Bistro',
        status: 'pending'
      },
      {
        employeeId: employeeUser.id,
        companyId: company.id,
        amount: 250.00,
        currency: 'USD',
        category: 'travel',
        description: 'Flight to client meeting in New York',
        date: '2024-01-10',
        vendorName: 'American Airlines',
        status: 'approved_manager',
        reviewedById: managerUser.id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approverId: managerUser.id,
          action: 'approved',
          comment: 'Approved for client meeting',
          date: new Date()
        }]
      },
      {
        employeeId: employeeUser.id,
        companyId: company.id,
        amount: 89.50,
        currency: 'USD',
        category: 'supplies',
        description: 'Office supplies and equipment',
        date: '2024-01-08',
        vendorName: 'Office Depot',
        status: 'rejected',
        rejectionReason: 'Receipt not clear enough to verify items',
        reviewedById: managerUser.id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approverId: managerUser.id,
          action: 'rejected',
          comment: 'Receipt not clear enough to verify items',
          date: new Date()
        }]
      },
      {
        employeeId: employee2User.id,
        companyId: company.id,
        amount: 320.00,
        currency: 'USD',
        category: 'training',
        description: 'React.js certification course',
        date: '2024-01-12',
        vendorName: 'Udemy',
        status: 'approved',
        reviewedById: managerUser.id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approverId: managerUser.id,
          action: 'approved',
          comment: 'Good investment in skills development',
          date: new Date()
        }]
      },
      {
        employeeId: employee2User.id,
        companyId: company.id,
        amount: 15.75,
        currency: 'USD',
        category: 'supplies',
        description: 'Notebook and pens for meetings',
        date: '2024-01-20',
        vendorName: 'Staples',
        status: 'pending'
      },
      {
        employeeId: managerUser.id,
        companyId: company.id,
        amount: 125.00,
        currency: 'USD',
        category: 'meals',
        description: 'Client dinner meeting',
        date: '2024-01-18',
        vendorName: 'The Capital Grille',
        status: 'approved',
        reviewedById: adminUser.id,
        reviewedAt: new Date(),
        approvalHistory: [{
          approverId: adminUser.id,
          action: 'approved',
          comment: 'Client entertainment approved',
          date: new Date()
        }]
      }
    ];

    await Expense.bulkCreate(expenses);
    console.log('💰 Created sample expenses');

    console.log('\n🎉 SQLite database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Manager: username=manager, password=manager123');
    console.log('   Employee: username=employee, password=employee123');
    console.log('   Employee 2: username=sarah, password=sarah123');
    console.log('\n🚀 You can now start the server with: npm run dev:sqlite');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

const runSeed = async () => {
  await seedData();
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData };