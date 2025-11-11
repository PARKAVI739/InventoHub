const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  createProductValidation,
  updateProductValidation,
  paginationValidation,
  productIdValidation
} = require('../validators/productValidators');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

router
  .route('/')
  .post(createProductValidation, validateRequest, createProduct)
  .get(paginationValidation, validateRequest, getProducts);

router
  .route('/:id')
  .get(productIdValidation, validateRequest, getProductById)
  .put(updateProductValidation, validateRequest, updateProduct)
  .delete(productIdValidation, validateRequest, deleteProduct);

module.exports = router;

