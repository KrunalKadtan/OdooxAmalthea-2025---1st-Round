const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadReceipt, handleUploadError } = require('../middleware/upload');
const {
  validateExpenseCreation,
  validateExpenseUpdate,
  validateExpenseApproval,
  validateExpenseRejection,
  validateObjectId
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Expense CRUD routes
router.get('/', getExpenses);
router.post('/', uploadReceipt, handleUploadError, validateExpenseCreation, createExpense);
router.get('/stats', getExpenseStats);
router.get('/:id', validateObjectId('id'), getExpenseById);
router.put('/:id', validateObjectId('id'), uploadReceipt, handleUploadError, validateExpenseUpdate, updateExpense);
router.delete('/:id', validateObjectId('id'), deleteExpense);

// Approval routes (manager and admin only)
router.post('/:id/approve', validateObjectId('id'), authorize('manager', 'admin'), validateExpenseApproval, approveExpense);
router.post('/:id/reject', validateObjectId('id'), authorize('manager', 'admin'), validateExpenseRejection, rejectExpense);

module.exports = router;