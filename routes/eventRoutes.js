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

// GET /api/events          (public, supports ?category= and ?date=)
router.get('/', getEvents);

// GET /api/events/:id      (public)
router.get('/:id', getEventById);

// POST /api/events         (admin only)
router.post('/', protect, adminOnly, validateCreateEvent, createEvent);

// PUT /api/events/:id      (admin only)
router.put('/:id', protect, adminOnly, validateUpdateEvent, updateEvent);

// DELETE /api/events/:id   (admin only)
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
