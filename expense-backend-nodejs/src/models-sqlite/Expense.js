const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'),
    defaultValue: 'USD'
  },
  category: {
    type: DataTypes.ENUM('travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 500],
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString().split('T')[0]
    }
  },
  receipt: {
    type: DataTypes.JSON,
    allowNull: true
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved_manager', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  approvalHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  reviewedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isReimbursed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reimbursementDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  }
}, {
  tableName: 'Expenses'
});

// Instance methods
Expense.prototype.approve = async function(approverId, comment = '') {
  this.status = this.status === 'pending' ? 'approved_manager' : 'approved';
  this.reviewedById = approverId;
  this.reviewedAt = new Date();
  
  const history = this.approvalHistory || [];
  history.push({
    approverId: approverId,
    action: 'approved',
    comment: comment,
    date: new Date()
  });
  this.approvalHistory = history;
  
  return await this.save();
};

Expense.prototype.reject = async function(approverId, reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.reviewedById = approverId;
  this.reviewedAt = new Date();
  
  const history = this.approvalHistory || [];
  history.push({
    approverId: approverId,
    action: 'rejected',
    comment: reason,
    date: new Date()
  });
  this.approvalHistory = history;
  
  return await this.save();
};

// Virtual for formatted amount
Expense.prototype.getFormattedAmount = function() {
  return `${this.currency} ${parseFloat(this.amount).toFixed(2)}`;
};

// Virtual for days since submission
Expense.prototype.getDaysSinceSubmission = function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = Expense;