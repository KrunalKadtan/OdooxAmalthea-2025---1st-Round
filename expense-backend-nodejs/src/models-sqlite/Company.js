const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      notEmpty: true
    }
  },
  defaultCurrency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'),
    defaultValue: 'USD'
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      expenseApprovalWorkflow: 'single',
      autoApprovalLimit: 0,
      allowedExpenseCategories: ['travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other'],
      requireReceipts: true,
      maxReceiptSize: 5242880
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Companies'
});

module.exports = Company;