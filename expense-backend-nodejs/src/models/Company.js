const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  defaultCurrency: {
    type: String,
    required: [true, 'Default currency is required'],
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'],
    default: 'USD'
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country name cannot exceed 50 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  logo: {
    type: String,
    default: null
  },
  settings: {
    expenseApprovalWorkflow: {
      type: String,
      enum: ['single', 'dual', 'custom'],
      default: 'single'
    },
    autoApprovalLimit: {
      type: Number,
      default: 0 // 0 means no auto-approval
    },
    allowedExpenseCategories: [{
      type: String,
      enum: ['travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other']
    }],
    requireReceipts: {
      type: Boolean,
      default: true
    },
    maxReceiptSize: {
      type: Number,
      default: 5242880 // 5MB in bytes
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for users count
companySchema.virtual('usersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'company',
  count: true
});

// Virtual for expenses count
companySchema.virtual('expensesCount', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'company',
  count: true
});

module.exports = mongoose.model('Company', companySchema);