// Simple test script to verify backend functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:8000';

async function testBackend() {
  try {
    console.log('🔄 Testing Backend API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.message);

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'employee', password: 'employee123' })
    });
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login successful for:', loginData.data.user.fullName);
      const token = loginData.data.accessToken;

      // Test profile endpoint
      console.log('\n3. Testing profile endpoint...');
      const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        console.log('✅ Profile retrieved for:', profileData.data.fullName);
      } else {
        console.log('❌ Profile failed:', profileData.message);
      }

      // Test expenses endpoint
      console.log('\n4. Testing expenses endpoint...');
      const expensesResponse = await fetch(`${BASE_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const expensesData = await expensesResponse.json();
      
      if (expensesData.success) {
        console.log('✅ Expenses retrieved:', expensesData.data.expenses.length, 'expenses');
      } else {
        console.log('❌ Expenses failed:', expensesData.message);
      }

      // Test expense creation
      console.log('\n5. Testing expense creation...');
      const createResponse = await fetch(`${BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 25.50,
          currency: 'USD',
          category: 'meals',
          description: 'Test lunch expense',
          date: '2024-01-30'
        })
      });
      const createData = await createResponse.json();
      
      if (createData.success) {
        console.log('✅ Expense created successfully:', createData.data.description);
      } else {
        console.log('❌ Expense creation failed:', createData.message);
        console.log('Error details:', createData.error);
      }

    } else {
      console.log('❌ Login failed:', loginData.message);
    }

    console.log('\n🎉 Backend test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackend();