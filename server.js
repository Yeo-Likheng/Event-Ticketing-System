require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Root HTML Welcome Page ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Event Ticketing System</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 1rem;
            padding: 2.5rem;
            max-width: 640px;
            width: 100%;
            text-align: center;
          }
          h1 { font-size: 2rem; color: #f59e0b; margin-bottom: .5rem; }
          p  { color: #94a3b8; margin-bottom: 1.5rem; }
          .badge {
            display: inline-block;
            background: #065f46;
            color: #6ee7b7;
            border-radius: 999px;
            padding: .25rem .75rem;
            font-size: .8rem;
            margin-bottom: 2rem;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Welcome to Event Ticketing System</h1>
          <p>A fully featured REST API for event management and ticket booking.</p>
          <span class="badge">✓ API is live</span>
        </div>
      </body>
    </html>
  `);
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling middleware
app.use(notFound);
app.use(errorHandler);

// Start Server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
