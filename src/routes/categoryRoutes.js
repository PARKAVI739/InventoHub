const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  listCategoryValidation
} = require('../validators/categoryValidators');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

router
  .route('/')
  .post(createCategoryValidation, validateRequest, createCategory)
  .get(listCategoryValidation, validateRequest, getCategories);

router
  .route('/:id')
  .put(updateCategoryValidation, validateRequest, updateCategory)
  .delete(categoryIdValidation, validateRequest, deleteCategory);

module.exports = router;

