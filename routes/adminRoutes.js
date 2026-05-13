const express = require('express');
const router = express.Router();
const { adminDashboard } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/dashboard  (admin only — bonus)
router.get('/dashboard', protect, adminOnly, adminDashboard);

module.exports = router;
