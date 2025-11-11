const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const { validateRequest } = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', authenticate, getProfile);

module.exports = router;



