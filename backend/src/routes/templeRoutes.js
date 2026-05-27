const express = require('express');
const router = express.Router();
const {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple
} = require('../controllers/templeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTemples)
  .post(protect, createTemple);

router.route('/:id')
  .get(getTempleById)
  .put(protect, updateTemple)
  .delete(protect, deleteTemple);

module.exports = router;
