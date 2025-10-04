const multer = require('multer');
const path = require('path');
const { sendError } = require('../utils/response');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
    files: 1
  },
  fileFilter: fileFilter
});

// Middleware for single file upload
const uploadReceipt = upload.single('receipt');

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File too large. Maximum size is 5MB', 400);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return sendError(res, 'Too many files. Only one file allowed', 400);
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return sendError(res, 'Unexpected field name. Use "receipt" as field name', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }
  
  if (err) {
    return sendError(res, err.message, 400);
  }
  
  next();
};

module.exports = {
  uploadReceipt,
  handleUploadError
};