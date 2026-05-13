// Validation middleware for creating a booking 
const validateCreateBooking = (req, res, next) => {
  const { event, quantity } = req.body;
  const errors = [];

  if (!event || event.trim() === '') errors.push('Event ID is required.');
  if (quantity === undefined || quantity === null) {
    errors.push('Quantity is required.');
  } else if (Number(quantity) < 1) {
    errors.push('Quantity must be at least 1.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
};

module.exports = { validateCreateBooking };
