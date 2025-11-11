const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg
    }));
    return next(new ApiError(422, 'Validation failed', extractedErrors));
  }
  return next();
};

module.exports = {
  validateRequest
};



