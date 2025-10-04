const { body, param, query, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return sendValidationError(res, formattedErrors);
  }
  
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and cannot exceed 50 characters'),
  
  body('role')
    .optional()
    .isIn(['employee', 'manager', 'admin'])
    .withMessage('Role must be employee, manager, or admin'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Expense validation rules
const validateExpenseCreation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'])
    .withMessage('Invalid currency'),
  
  body('category')
    .isIn(['travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other'])
    .withMessage('Invalid category'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and cannot exceed 500 characters'),
  
  body('date')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value > new Date()) {
        throw new Error('Expense date cannot be in the future');
      }
      return true;
    }),
  
  body('vendorName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Vendor name cannot exceed 100 characters'),
  
  handleValidationErrors
];

const validateExpenseUpdate = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'])
    .withMessage('Invalid currency'),
  
  body('category')
    .optional()
    .isIn(['travel', 'meals', 'supplies', 'equipment', 'software', 'training', 'entertainment', 'other'])
    .withMessage('Invalid category'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('vendorName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Vendor name cannot exceed 100 characters'),
  
  handleValidationErrors
];

const validateExpenseApproval = [
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  
  handleValidationErrors
];

const validateExpenseRejection = [
  body('reason')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Rejection reason is required and cannot exceed 500 characters'),
  
  handleValidationErrors
];

// Company validation rules
const validateCompanyCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name is required and cannot exceed 100 characters'),
  
  body('defaultCurrency')
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR', 'CNY'])
    .withMessage('Invalid currency'),
  
  body('country')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Country is required and cannot exceed 50 characters'),
  
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateExpenseCreation,
  validateExpenseUpdate,
  validateExpenseApproval,
  validateExpenseRejection,
  validateCompanyCreation,
  validateObjectId
};