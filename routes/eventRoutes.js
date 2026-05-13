const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateCreateEvent, validateUpdateEvent } = require('../validators/eventValidators');

// Routes get all events
router.get('/', getEvents);

// Routes to get event by ID
router.get('/:id', getEventById);

// Routes to create a new event with admin accesss only
router.post('/', protect, adminOnly, validateCreateEvent, createEvent);

// Routes to update an existing event with admin only access
router.put('/:id', protect, adminOnly, validateUpdateEvent, updateEvent);

// Routes to delete an event with admin only access
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
