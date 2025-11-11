const { body, param, query } = require('express-validator');

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid ID')
];

const productIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid product ID')
];

const updateProductValidation = [
  ...productIdValidation,
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid ID')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be 1 or greater'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isMongoId().withMessage('Category filter must be a valid ID'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('minPrice must be positive'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('maxPrice must be positive'),
  query('ownerId')
    .optional()
    .isMongoId().withMessage('ownerId must be a valid ID')
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  paginationValidation,
  productIdValidation
};

