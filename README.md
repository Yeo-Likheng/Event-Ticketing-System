# Event Ticketing System API

A REST API for an event ticketing system built with Node.js, Express, MongoDB, and JWT authentication. Users can register, browse events, and book tickets. Admins can create, update, and delete events.

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/event-ticketing.git
cd event-ticketing
```

2. Install dependencies:
```bash
npm install
```

---

## Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and fill in your values (see Environment Variables below)

3. In MongoDB Atlas, go to **Network Access** and allow your IP address or set it to `0.0.0.0/0` to allow all connections

4. To create an admin account, register a user normally then go to MongoDB Atlas → Browse Collections → `users` → find your user → change `role` from `user` to `admin`

---

## Environment Variables

| Variable | Description 
|---|---
| `PORT` | Port the server runs on (default: 3000) 
| `MONGO_URI` | MongoDB connection string 
| `JWT_SECRET` | Secret key for signing JWT tokens 
| `JWT_EXPIRES_IN` | JWT expiry duration e.g. `7d` 
| `EMAIL_HOST` | `smtp.gmail.com` 
| `EMAIL_PORT` | Port `587` 
| `EMAIL_USER` | Gmail address used to send emails 
| `EMAIL_PASS` | Gmail App Password (16 characters) 

Example `.env`:
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/event-ticketing
JWT_SECRET=yoursupersecretkey
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

---

## How to Run Locally

**Development** (auto-restarts on file changes):
```bash
npm start
```

**Production:**
```bash
npm start
```

Server runs at `http://localhost:3000`

API root: `http://localhost:3000/api`
---

## Deployed API

> https://your-project-name.onrender.com

---

## Endpoint List

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

### Events

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/events` | Get all events | No |
| GET | `/api/events?category=music` | Filter events by category | No |
| GET | `/api/events?date=2025-12-25` | Filter events by date | No |
| GET | `/api/events?category=music&date=2025-12-25` | Filter by both | No |
| GET | `/api/events/:id` | Get a single event | No |
| POST | `/api/events` | Create a new event | Admin |
| PUT | `/api/events/:id` | Update an event | Admin |
| DELETE | `/api/events/:id` | Delete an event | Admin |

### Bookings

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/bookings` | Get all bookings for logged-in user | User |
| GET | `/api/bookings/:id` | Get a single booking | User |
| POST | `/api/bookings` | Create a booking | User |
| GET | `/api/bookings/validate?qrCode=...` | Validate a ticket by QR code | User |

### Admin

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/dashboard` | All events with list of bookers | Admin |

---

## How to Use Protected Routes

Add the JWT token to the `Authorization` header:

```
Authorization: Bearer your_token_here
```

---

## Notes

- Passwords are hashed with bcryptjs before being stored — plain text passwords are never saved
- Admin role must be set manually in MongoDB Atlas — users cannot self-assign admin
- Events with active bookings **cannot be deleted** — all bookings must be removed first
- When a booking is created, `bookedSeats` on the event is updated automatically
- QR codes are generated per booking and stored as base64 strings in MongoDB
- Email confirmation is sent to the user's email address when a booking is created (requires email config in `.env`)