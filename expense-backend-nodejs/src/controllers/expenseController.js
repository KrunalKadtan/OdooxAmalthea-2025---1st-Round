const Expense = require('../models/Expense');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const path = require('path');
const fs = require('fs').promises;

const createExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date, vendorName } = req.body;
    const userId = req.user.id;
    const companyId = req.user.company._id;

    // Handle receipt upload
    let receiptData = null;
    if (req.file) {
      receiptData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    const expense = await Expense.create({
      employee: userId,
      company: companyId,
      amount,
      currency: currency || req.user.company.defaultCurrency,
      category,
      description,
      date,
      vendorName,
      receipt: receiptData
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('employee', 'username firstName lastName')
      .populate('reviewedBy', 'username firstName lastName');

    sendSuccess(res, 'Expense created successfully', populatedExpense, 201);
  } catch (error) {
    console.error('Create expense error:', error);
    sendError(res, 'Failed to create expense', 500);
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.company._id;
    
    const { 
      status, 
      category, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query based on user role
    let query = { company: companyId };

    if (userRole === 'employee') {
      query.employee = userId;
    } else if (userRole === 'manager') {
      // Manager can see their own expenses and their team's expenses
      const teamMembers = await User.find({ manager: userId }).select('_id');
      const teamMemberIds = teamMembers.map(member => member._id);
      query.employee = { $in: [userId, ...teamMemberIds] };
    }
    // Admin can see all company expenses (no additional filter needed)

    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [expenses, totalCount] = await Promise.all([
      Expense.find(query)
        .populate('employee', 'username firstName lastName')
        .populate('reviewedBy', 'username firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Expense.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const response = {
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    };

    sendSuccess(res, 'Expenses retrieved successfully', response);
  } catch (error) {
    console.error('Get expenses error:', error);
    sendError(res, 'Failed to retrieve expenses', 500);
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const expense = await Expense.findById(id)
      .populate('employee', 'username firstName lastName email')
      .populate('reviewedBy', 'username firstName lastName')
      .populate('approvalHistory.approver', 'username firstName lastName');

    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    // Check permissions
    const canView = 
      userRole === 'admin' ||
      expense.employee._id.toString() === userId ||
      (userRole === 'manager' && await User.findOne({ _id: expense.employee._id, manager: userId }));

    if (!canView) {
      return sendError(res, 'Access denied', 403);
    }

    sendSuccess(res, 'Expense retrieved successfully', expense);
  } catch (error) {
    console.error('Get expense error:', error);
    sendError(res, 'Failed to retrieve expense', 500);
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    // Only the expense owner can update, and only if it's pending
    if (expense.employee.toString() !== userId) {
      return sendError(res, 'Access denied', 403);
    }

    if (expense.status !== 'pending') {
      return sendError(res, 'Cannot update expense that has been reviewed', 400);
    }

    // Handle receipt upload
    if (req.file) {
      // Delete old receipt if exists
      if (expense.receipt && expense.receipt.path) {
        try {
          await fs.unlink(expense.receipt.path);
        } catch (err) {
          console.error('Error deleting old receipt:', err);
        }
      }

      updates.receipt = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('employee', 'username firstName lastName')
     .populate('reviewedBy', 'username firstName lastName');

    sendSuccess(res, 'Expense updated successfully', updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    sendError(res, 'Failed to update expense', 500);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const expense = await Expense.findById(id);
    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    // Only the expense owner or admin can delete
    const canDelete = 
      expense.employee.toString() === userId || 
      userRole === 'admin';

    if (!canDelete) {
      return sendError(res, 'Access denied', 403);
    }

    // Only pending expenses can be deleted
    if (expense.status !== 'pending') {
      return sendError(res, 'Cannot delete expense that has been reviewed', 400);
    }

    // Delete receipt file if exists
    if (expense.receipt && expense.receipt.path) {
      try {
        await fs.unlink(expense.receipt.path);
      } catch (err) {
        console.error('Error deleting receipt file:', err);
      }
    }

    await Expense.findByIdAndDelete(id);

    sendSuccess(res, 'Expense deleted successfully');
  } catch (error) {
    console.error('Delete expense error:', error);
    sendError(res, 'Failed to delete expense', 500);
  }
};

const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!['manager', 'admin'].includes(userRole)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    const expense = await Expense.findById(id).populate('employee');
    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    if (expense.status === 'approved') {
      return sendError(res, 'Expense already approved', 400);
    }

    if (expense.status === 'rejected') {
      return sendError(res, 'Cannot approve rejected expense', 400);
    }

    // Check if manager can approve this expense
    if (userRole === 'manager') {
      const canApprove = await User.findOne({ 
        _id: expense.employee._id, 
        manager: userId 
      });
      
      if (!canApprove) {
        return sendError(res, 'You can only approve expenses from your team members', 403);
      }
    }

    await expense.approve(userId, comment);

    const updatedExpense = await Expense.findById(id)
      .populate('employee', 'username firstName lastName')
      .populate('reviewedBy', 'username firstName lastName');

    sendSuccess(res, 'Expense approved successfully', updatedExpense);
  } catch (error) {
    console.error('Approve expense error:', error);
    sendError(res, 'Failed to approve expense', 500);
  }
};

const rejectExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!['manager', 'admin'].includes(userRole)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    const expense = await Expense.findById(id).populate('employee');
    if (!expense) {
      return sendError(res, 'Expense not found', 404);
    }

    if (expense.status === 'rejected') {
      return sendError(res, 'Expense already rejected', 400);
    }

    if (expense.status === 'approved') {
      return sendError(res, 'Cannot reject approved expense', 400);
    }

    // Check if manager can reject this expense
    if (userRole === 'manager') {
      const canReject = await User.findOne({ 
        _id: expense.employee._id, 
        manager: userId 
      });
      
      if (!canReject) {
        return sendError(res, 'You can only reject expenses from your team members', 403);
      }
    }

    await expense.reject(userId, reason);

    const updatedExpense = await Expense.findById(id)
      .populate('employee', 'username firstName lastName')
      .populate('reviewedBy', 'username firstName lastName');

    sendSuccess(res, 'Expense rejected successfully', updatedExpense);
  } catch (error) {
    console.error('Reject expense error:', error);
    sendError(res, 'Failed to reject expense', 500);
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.company._id;

    // Build base query
    let baseQuery = { company: companyId };

    if (userRole === 'employee') {
      baseQuery.employee = userId;
    } else if (userRole === 'manager') {
      const teamMembers = await User.find({ manager: userId }).select('_id');
      const teamMemberIds = teamMembers.map(member => member._id);
      baseQuery.employee = { $in: [userId, ...teamMemberIds] };
    }

    // Get stats
    const [
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmount,
      monthlyStats
    ] = await Promise.all([
      Expense.countDocuments(baseQuery),
      Expense.countDocuments({ ...baseQuery, status: 'pending' }),
      Expense.countDocuments({ ...baseQuery, status: { $in: ['approved_manager', 'approved'] } }),
      Expense.countDocuments({ ...baseQuery, status: 'rejected' }),
      Expense.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    const stats = {
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      monthlyStats: monthlyStats.reverse()
    };

    sendSuccess(res, 'Expense statistics retrieved successfully', stats);
  } catch (error) {
    console.error('Get expense stats error:', error);
    sendError(res, 'Failed to retrieve expense statistics', 500);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  getExpenseStats
};