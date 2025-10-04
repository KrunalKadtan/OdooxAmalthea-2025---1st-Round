const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

const sendError = (res, message, statusCode = 400, data = null) => {
  return sendResponse(res, statusCode, false, message, data);
};

const sendValidationError = (res, errors) => {
  return sendResponse(res, 422, false, 'Validation failed', { errors });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError
};