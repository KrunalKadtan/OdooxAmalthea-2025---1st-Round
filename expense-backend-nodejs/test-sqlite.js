const { Sequelize } = require('sequelize');
const path = require('path');

console.log('Testing SQLite setup...');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'test.sqlite'),
  logging: console.log
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite connection successful');
    
    // Test table creation
    const TestModel = sequelize.define('Test', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    
    await sequelize.sync();
    console.log('✅ Table creation successful');
    
    // Test data insertion
    await TestModel.create({ name: 'Test Record' });
    console.log('✅ Data insertion successful');
    
    const records = await TestModel.findAll();
    console.log('✅ Data retrieval successful:', records.length, 'records');
    
    console.log('🎉 SQLite is working perfectly!');
    
  } catch (error) {
    console.error('❌ SQLite test failed:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

test();