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


// Routes for validating booking by QR code 
router.get('/validate', protect, validateBookingByQr);

// Routes to get user bookings
router.get('/', protect, getMyBookings);

// Routes to get booking by ID
router.get('/:id', protect, getBookingById);

// Route to create a new booking for an event
router.post('/', protect, validateCreateBooking, createBooking);

module.exports = router;
