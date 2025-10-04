console.log('Testing Node.js...');

try {
  const express = require('express');
  console.log('✅ Express loaded');
  
  const { Sequelize } = require('sequelize');
  console.log('✅ Sequelize loaded');
  
  const bcrypt = require('bcryptjs');
  console.log('✅ bcryptjs loaded');
  
  const jwt = require('jsonwebtoken');
  console.log('✅ jsonwebtoken loaded');
  
  console.log('✅ All dependencies loaded successfully');
  
  // Test basic server
  const app = express();
  app.get('/', (req, res) => res.json({ message: 'Test server working!' }));
  
  const server = app.listen(8001, () => {
    console.log('✅ Test server running on port 8001');
    server.close();
    console.log('✅ Test completed successfully');
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('❌ Stack:', error.stack);
}