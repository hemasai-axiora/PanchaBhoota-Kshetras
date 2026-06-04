const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  trackBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/', authLimiter, createBooking);
router.get('/track', trackBooking);
router.get('/', protect, getBookings);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
