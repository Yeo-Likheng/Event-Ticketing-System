const express = require('express');
const router = express.Router();
const { adminDashboard } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// Routes for admin dashboard
router.get('/dashboard', protect, adminOnly, adminDashboard);

module.exports = router;
