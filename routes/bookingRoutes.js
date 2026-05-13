const express = require('express');
const router = express.Router();
const {
  getMyBookings,
  getBookingById,
  createBooking,
  validateBookingByQr,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validateCreateBooking } = require('../validators/bookingValidators');

// IMPORTANT: Static route "validate" must come before dynamic "/:id"

// GET /api/bookings/validate?bookingId=...  (bonus — QR code validation)
router.get('/validate', protect, validateBookingByQr);

// GET /api/bookings                (logged-in user's bookings)
router.get('/', protect, getMyBookings);

// GET /api/bookings/:id            (logged-in user's single booking)
router.get('/:id', protect, getBookingById);

// POST /api/bookings               (create booking)
router.post('/', protect, validateCreateBooking, createBooking);

module.exports = router;
