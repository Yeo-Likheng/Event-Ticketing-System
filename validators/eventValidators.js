const validateCreateEvent = (req, res, next) => {
  const { title, date, seatCapacity, price } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('Title is required.');
  if (!date) {
    errors.push('Date is required.');
  } else if (isNaN(new Date(date).getTime())) {
    errors.push('Date must be a valid date.');
  }
  if (seatCapacity === undefined || seatCapacity === null) {
    errors.push('Seat capacity is required.');
  } else if (Number(seatCapacity) <= 0) {
    errors.push('Seat capacity must be greater than 0.');
  }
  if (price === undefined || price === null) {
    errors.push('Price is required.');
  } else if (Number(price) < 0) {
    errors.push('Price cannot be negative.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
};

const validateUpdateEvent = (req, res, next) => {
  const { date, seatCapacity, price } = req.body;
  const errors = [];

  if (date !== undefined && isNaN(new Date(date).getTime())) {
    errors.push('Date must be a valid date.');
  }
  if (seatCapacity !== undefined && Number(seatCapacity) <= 0) {
    errors.push('Seat capacity must be greater than 0.');
  }
  if (price !== undefined && Number(price) < 0) {
    errors.push('Price cannot be negative.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  next();
};

module.exports = { validateCreateEvent, validateUpdateEvent };
