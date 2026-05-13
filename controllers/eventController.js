const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events (with optional filters)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: 'i' };
    }

    if (req.query.date) {
      const start = new Date(req.query.date);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.status(200).json({ count: events.length, events });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json({ event });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Admin only
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: 'Event created successfully.', event });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Admin only
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Prevent reducing seatCapacity below bookedSeats
    if (
      req.body.seatCapacity !== undefined &&
      Number(req.body.seatCapacity) < event.bookedSeats
    ) {
      return res.status(400).json({
        error: `Cannot reduce seat capacity below the number of already booked seats (${event.bookedSeats}).`,
      });
    }

    // Prevent updating _id
    delete req.body._id;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Event updated successfully.', event: updatedEvent });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Admin only
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // Prevent deletion if the event has existing bookings
    const bookingCount = await Booking.countDocuments({ event: event._id });
    if (bookingCount > 0) {
      return res.status(400).json({
        error: `Cannot delete this event. It has ${bookingCount} active booking(s). Cancel all bookings before deleting the event.`,
      });
    }

    await event.deleteOne();

    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };