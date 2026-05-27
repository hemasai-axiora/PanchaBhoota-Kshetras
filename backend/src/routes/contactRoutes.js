const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/', authLimiter, createContact);
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContactStatus);
router.delete('/:id', protect, deleteContact);

module.exports = router;
