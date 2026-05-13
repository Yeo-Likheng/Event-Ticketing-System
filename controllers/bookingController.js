const Booking = require('../models/Booking');
const Event = require('../models/Event');
const generateQrCode = require('../utils/generateQrCode');
const sendEmail = require('../utils/sendEmail');
const Jimp = require('jimp');
const QrCodeReader = require('qrcode-reader');

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings
// @access  Protected (user)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date venue price category seatCapacity bookedSeats')
      .populate('user', 'name email')
      .sort({ bookingDate: -1 });

    const mappedBookings = bookings.map((booking) => {
      const event = booking.event && booking.event.toObject ? booking.event.toObject() : booking.event;
      return {
        ...booking.toObject(),
        user: booking.user,
        event: {
          ...event,
          availableSeats: event ? event.seatCapacity - event.bookedSeats : null,
        },
      };
    });

    res.status(200).json({ count: mappedBookings.length, bookings: mappedBookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single booking (only if it belongs to the logged-in user)
// @route   GET /api/bookings/:id
// @access  Protected (user)
const getBookingById = async (req, res, next) => {
  try {
    // Handle bonus validate route collision — skip if id is "validate"
    if (req.params.id === 'validate') return next();

    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title date venue price category seatCapacity bookedSeats')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Ensure the booking belongs to the requesting user
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. This booking does not belong to you.' });
    }

    const bookingObj = booking.toObject();
    if (bookingObj.event) {
      bookingObj.event.availableSeats = bookingObj.event.seatCapacity - bookingObj.event.bookedSeats;
    }

    res.status(200).json({ booking: bookingObj });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Protected (user)
const createBooking = async (req, res, next) => {
  try {
    const { event: eventId, quantity } = req.body;
 
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
 
    const availableSeats = event.seatCapacity - event.bookedSeats;
    if (Number(quantity) > availableSeats) {
      return res.status(400).json({
        error: `Not enough seats available. Only ${availableSeats} seat(s) remaining.`,
      });
    }
 
    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity: Number(quantity),
    });
 
    // Update bookedSeats on the event atomically
    await Event.findByIdAndUpdate(eventId, {
      $inc: { bookedSeats: Number(quantity) },
    });
 
    // --- Bonus: Generate QR Code ---
    const qrCode = await generateQrCode(booking);
    if (qrCode) {
      booking.qrCode = qrCode;
      await booking.save();
    }
 
    // --- Bonus: Send confirmation email ---
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Booking Confirmed: ${event.title}`,
        html: `
          <h2>Booking Confirmed!</h2>
          <p>Hi ${req.user.name},</p>
          <p>Your booking for <strong>${event.title}</strong> has been confirmed.</p>
          <ul>
            <li>Date: ${new Date(event.date).toISOString().split('T')[0]}</li>
            <li>Time: ${event.time || 'TBA'}</li>
            <li>Venue: ${event.venue || 'TBA'}</li>
            <li>Quantity: ${quantity}</li>
            <li>Total: $${(event.price * quantity).toFixed(2)}</li>
          </ul>
          <p>Thank you for booking with us!</p>
        `,
      });
    } catch (emailErr) {
      console.warn('Email send failed (non-critical):', emailErr.message);
    }
 
    await booking.populate('event', 'title date venue price seatCapacity bookedSeats');
    const populated = await booking.populate('user', 'name email');
 
    res.status(201).json({ message: 'Booking created successfully.', booking: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Validate a booking via QR code (Bonus)
// @route   GET /api/bookings/validate?qr=...
// @access  Protected
const validateBookingByQr = async (req, res, next) => {
  try {
    let { qrCode } = req.query;
    qrCode = qrCode.replace(/ /g, '+');
 
    if (!qrCode) {
      return res.status(400).json({ valid: false, error: 'qrCode query parameter is required.' });
    }
 
    // Find booking directly by qrCode stored in MongoDB
    const booking = await Booking.findOne({ qrCode })
      .populate('event', 'title date venue price category')
      .populate('user', 'name email');
 
    if (!booking) {
      return res.status(404).json({ valid: false, error: 'Invalid QR code. No matching ticket found.' });
    }
 
    res.status(200).json({
      valid: true,
      message: 'Ticket is valid.',
      booking: {
        bookingId: booking._id,
        user: booking.user,
        event: booking.event,
        quantity: booking.quantity,
        bookingDate: booking.bookingDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all events with their bookers (Bonus)
// @route   GET /api/admin/dashboard
// @access  Admin only
const adminDashboard = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const dashboard = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id })
          .populate('user', 'name email');
        return {
          event: {
            id: event._id,
            title: event.title,
            date: event.date,
            venue: event.venue,
            seatCapacity: event.seatCapacity,
            bookedSeats: event.bookedSeats,
            availableSeats: event.seatCapacity - event.bookedSeats,
            price: event.price,
          },
          totalBookings: bookings.length,
          bookers: bookings.map((b) => ({
            bookingId: b._id,
            user: b.user,
            quantity: b.quantity,
            bookingDate: b.bookingDate,
          })),
        };
      })
    );

    res.status(200).json({ dashboard });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyBookings,
  getBookingById,
  createBooking,
  validateBookingByQr,
  adminDashboard,
};