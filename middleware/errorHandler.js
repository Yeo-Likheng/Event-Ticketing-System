// 404 handler for unmatched routes
const notFound = (req, res, next) => {
  return res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>404 Not Found</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 80px; background: #0f172a; color: #e2e8f0; }
          h1 { font-size: 5rem; margin: 0; color: #f59e0b; }
          p  { font-size: 1.25rem; color: #94a3b8; }
          a  { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">← Back to Home</a>
      </body>
    </html>
  `);
}
// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join('. ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already exists.` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { notFound, errorHandler };
