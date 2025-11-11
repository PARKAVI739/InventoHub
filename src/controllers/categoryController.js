const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const trimmedName = name.trim();
    const normalizedDescription = typeof description === 'string' ? description.trim() : '';

    const existing = await Category.findOne({
      name: trimmedName,
      owner: req.user.id
    });

    if (existing) {
      throw new ApiError(409, 'Category with this name already exists');
    }

    const category = await Category.create({
      name: trimmedName,
      description: normalizedDescription,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    if (req.query.ownerId && req.user.role !== 'admin') {
      throw new ApiError(403, 'Only administrators can view other users\' categories');
    }

    const query = req.user.role === 'admin' && req.query.ownerId
      ? { owner: req.query.ownerId }
      : { owner: req.user.id };

    const categories = await Category.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    if (category.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    if (typeof name !== 'undefined') {
      const trimmed = name.trim();
      if (!trimmed) {
        throw new ApiError(422, 'Category name cannot be empty');
      }
      const duplicate = await Category.findOne({
        _id: { $ne: category._id },
        name: trimmed,
        owner: category.owner
      });
      if (duplicate) {
        throw new ApiError(409, 'Category with this name already exists');
      }
      category.name = trimmed;
    }

    if (typeof description !== 'undefined') {
      category.description = typeof description === 'string' ? description.trim() : '';
    }

    await category.save();

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    if (category.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }

    const linkedProducts = await Product.countDocuments({ category: category._id });
    if (linkedProducts > 0) {
      throw new ApiError(400, 'Cannot delete category with associated products');
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};

