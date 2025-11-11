const { body, param, query } = require('express-validator');

const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer')
];

const categoryIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid category ID')
];

const updateCategoryValidation = [
  ...categoryIdValidation,
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty')
    .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer')
];

const listCategoryValidation = [
  query('ownerId')
    .optional()
    .isMongoId().withMessage('ownerId must be a valid ID')
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  listCategoryValidation
};

