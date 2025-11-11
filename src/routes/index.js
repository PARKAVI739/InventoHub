const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', authenticate, productRoutes);
router.use('/categories', authenticate, categoryRoutes);

module.exports = router;



