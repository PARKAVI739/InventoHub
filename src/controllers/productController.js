const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const buildProductQuery = (req) => {
  const { search, category, minPrice, maxPrice, ownerId } = req.query;
  const query = {};

  if (ownerId) {
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Only administrators can view other users\' products');
    }
    query.owner = ownerId;
  } else if (req.user.role !== 'admin') {
    query.owner = req.user.id;
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  return query;
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category: categoryId } = req.body;

    if (categoryId) {
      const existingCategory = await Category.findOne({
        _id: categoryId,
        owner: req.user.id
      });

      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      category: categoryId || null,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = buildProductQuery(req);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updates = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    if (typeof updates.category !== 'undefined' && updates.category !== null && updates.category !== '') {
      const categoryCheck = await Category.findOne({
        _id: updates.category,
        owner: req.user.role === 'admin' ? product.owner : req.user.id
      });

      if (!categoryCheck) {
        throw new ApiError(404, 'Category not found');
      }
    }

    const allowedFields = ['name', 'description', 'price', 'quantity', 'category'];
    allowedFields.forEach((field) => {
      if (typeof updates[field] !== 'undefined') {
        if (field === 'price' || field === 'quantity') {
          product[field] = Number(updates[field]);
        } else {
          product[field] = updates[field];
        }
      }
    });
    if (typeof updates.category !== 'undefined' && (updates.category === '' || updates.category === null)) {
      product.category = null;
    }

    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

