const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, loginAdmin);
router.post('/register', registerAdmin);
router.get('/me', protect, getMe);

module.exports = router;
