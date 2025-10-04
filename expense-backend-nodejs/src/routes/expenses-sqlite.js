const express = require('express');
const router = express.Router();
const { User, Company, Expense } = require('../models-sqlite');
const { authenticate, authorize } = require('../middleware/auth-sqlite');
const { uploadReceipt, handleUploadError } = require('../middleware/upload');
const { sendSuccess, sendError } = require('../utils/response');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authenticate);

// Get expenses with filters
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.company.id;
    
    const { 
      status, 
      category, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Build query based on user role
    let whereClause = { companyId };

    if (userRole === 'employee') {
      whereClause.employeeId = userId;
    } else if (userRole === 'manager') {
      // Manager can see their own expenses and their team's expenses
      const teamMembers = await User.findAll({ 
        where: { managerId: userId },
        attributes: ['id']
      });
      const teamMemberIds = teamMembers.map(member => member.id);
      whereClause.employeeId = { [Op.in]: [userId, ...teamMemberIds] };
    }
    // Admin can see all company expenses (no additional filter needed)

    // Apply filters
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ],
      order: [[sortBy, sortOrder]],
      offset,
      limit: parseInt(limit)
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    const response = {
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    };

    sendSuccess(res, 'Expenses retrieved successfully', response);
  } catch (error) {
    console.error('Get expenses error:', error);
    sendError(res, 'Failed to retrieve expenses', 500);
  }
});

// Create expense
router.post('/', uploadReceipt, handleUploadError, async (req, res) => {
  try {
    const { amount, currency, category, description, date, vendorName } = req.body;
    const userId = req.user.id;
    const companyId = req.user.company.id;

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
      employeeId: userId,
      companyId: companyId,
      amount,
      currency: currency || req.user.company.defaultCurrency,
      category,
      description,
      date,
      vendorName,
      receipt: receiptData
    });

    const populatedExpense = await Expense.findByPk(expense.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    sendSuccess(res, 'Expense created successfully', populatedExpense, 201);
  } catch (error) {
    console.error('Create expense error:', error);
    sendError(res, 'Failed to create expense', 500);
  }
});

// Get expense statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.company.id;

    // Build base query
    let whereClause = { companyId };

    if (userRole === 'employee') {
      whereClause.employeeId = userId;
    } else if (userRole === 'manager') {
      const teamMembers = await User.findAll({ 
        where: { managerId: userId },
        attributes: ['id']
      });
      const teamMemberIds = teamMembers.map(member => member.id);
      whereClause.employeeId = { [Op.in]: [userId, ...teamMemberIds] };
    }

    // Get stats
    const [
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmountResult
    ] = await Promise.all([
      Expense.count({ where: whereClause }),
      Expense.count({ where: { ...whereClause, status: 'pending' } }),
      Expense.count({ where: { ...whereClause, status: { [Op.in]: ['approved_manager', 'approved'] } } }),
      Expense.count({ where: { ...whereClause, status: 'rejected' } }),
      Expense.sum('amount', { where: whereClause })
    ]);

    const stats = {
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmount: totalAmountResult || 0,
      monthlyStats: [] // Simplified for now
    };

    sendSuccess(res, 'Expense statistics retrieved successfully', stats);
  } catch (error) {
    console.error('Get expense stats error:', error);
    sendError(res, 'Failed to retrieve expense statistics', 500);
  }
});

// Approve expense
router.post('/:id/approve', authorize('manager', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const expense = await Expense.findByPk(id, {
      include: [{ model: User, as: 'employee' }]
    });
    
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
        where: { 
          id: expense.employee.id, 
          managerId: userId 
        }
      });
      
      if (!canApprove) {
        return sendError(res, 'You can only approve expenses from your team members', 403);
      }
    }

    await expense.approve(userId, comment);

    const updatedExpense = await Expense.findByPk(id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    sendSuccess(res, 'Expense approved successfully', updatedExpense);
  } catch (error) {
    console.error('Approve expense error:', error);
    sendError(res, 'Failed to approve expense', 500);
  }
});

// Reject expense
router.post('/:id/reject', authorize('manager', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!reason || reason.trim().length === 0) {
      return sendError(res, 'Rejection reason is required', 400);
    }

    const expense = await Expense.findByPk(id, {
      include: [{ model: User, as: 'employee' }]
    });
    
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
        where: { 
          id: expense.employee.id, 
          managerId: userId 
        }
      });
      
      if (!canReject) {
        return sendError(res, 'You can only reject expenses from your team members', 403);
      }
    }

    await expense.reject(userId, reason);

    const updatedExpense = await Expense.findByPk(id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: User, as: 'reviewedBy', attributes: ['id', 'username', 'firstName', 'lastName'] }
      ]
    });

    sendSuccess(res, 'Expense rejected successfully', updatedExpense);
  } catch (error) {
    console.error('Reject expense error:', error);
    sendError(res, 'Failed to reject expense', 500);
  }
});

module.exports = router;