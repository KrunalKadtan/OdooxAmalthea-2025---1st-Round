const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'],
    default: 'USD'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Expense date cannot be in the future'
    }
  },
  receipt: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  vendorName: {
    type: String,
    trim: true,
    maxlength: [100, 'Vendor name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved_manager', 'approved', 'rejected'],
    default: 'pending'
  },
  approvalHistory: [{
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['approved', 'rejected'],
      required: true
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  isReimbursed: {
    type: Boolean,
    default: false
  },
  reimbursementDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
expenseSchema.index({ employee: 1, status: 1 });
expenseSchema.index({ company: 1, status: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ createdAt: -1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Virtual for days since submission
expenseSchema.virtual('daysSinceSubmission').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to approve expense
expenseSchema.methods.approve = function(approverId, comment = '') {
  this.status = this.status === 'pending' ? 'approved_manager' : 'approved';
  this.reviewedBy = approverId;
  this.reviewedAt = new Date();
  
  this.approvalHistory.push({
    approver: approverId,
    action: 'approved',
    comment: comment
  });
  
  return this.save();
};

// Method to reject expense
expenseSchema.methods.reject = function(approverId, reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.reviewedBy = approverId;
  this.reviewedAt = new Date();
  
  this.approvalHistory.push({
    approver: approverId,
    action: 'rejected',
    comment: reason
  });
  
  return this.save();
};

module.exports = mongoose.model('Expense', expenseSchema);