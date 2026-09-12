# Pass Pass - Online Movie Seat Booking System

A full-stack online movie ticket and seat reservation system built with **React 18**, **Vite**, **Express**, and **MongoDB (Mongoose)**, styled in the **Moon Color Palette** with transparent **Pass Pass** branding, real-time seat reservation, atomic double-booking protection, and animated UPI QR scanner.

---

## Features

- **Luxury Cinema Dark Theme**: Deep midnight tones, glowing primary accents, and curved cinema screen lighting.
- **Dynamic Hero Carousel**: Movie preview banners with ratings, synopsis, format pills, and trailer modal.
- **Live Movie Catalog**: Search by title/actor/synopsis and filter by genre (*Action, Drama, Thriller, Sci-Fi, Upcoming*).
- **Interactive 3-Tier Seating Grid**:
  - **VIP Recliners** (Rows A-B) - ₹380
  - **Premium Club** (Rows C-E) - ₹260
  - **Standard Classic** (Rows F-H) - ₹190
  - Real-time seat statuses (Available, Selected, Occupied).
  - Multi-date picker (7 days) and showtime experience selectors (*IMAX 3D, Dolby Atmos, 4DX*).
- **Atomic Double-Booking Protection**: Powered by Mongoose transactional validations.
- **Instant Digital E-Ticket**: Generates digital tickets with unique Booking Reference (`ETX-...`), seat breakdown, and QR code pass.
- **My Tickets Lookup**: Retrieve active and past bookings at `/my-bookings` by email or booking ID.
- **Customer Support & Inquiries**: Functional contact form persisted to MongoDB.

---

## Localhost Access

Both servers are configured to run simultaneously:

- **Frontend Web Interface**: [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API**: [http://localhost:5000/api/movies](http://localhost:5000/api/movies)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Running the Application

### 1. Ensure MongoDB is Running
MongoDB is connected to:
```
mongodb://127.0.0.1:27017/eticket_db
```

### 2. Start Backend Server
From `e-ticket-master/`:
```bash
npm run server
```
*(Runs on port 5000 with auto-seeding on first run)*

To manually re-seed database with movies, showtimes, and sample bookings:
```bash
npm run seed
```

### 3. Start Frontend Development Server
From `e-ticket-master/`:
```bash
npm run dev
```
*(Runs on [http://localhost:5173/](http://localhost:5173/) with automatic proxying to the backend)*

---

## Project Structure

```
e-ticket-master/
├── server/                    # Express + Mongoose Backend
│   ├── config/db.js          # MongoDB connection handler
│   ├── models/               # Mongoose Schemas (Movie, Showtime, Booking, Contact)
│   ├── controllers/          # Business logic & atomic booking verification
│   ├── routes/               # API endpoints (/api/movies, /api/showtimes, etc.)
│   ├── seed.js               # Database population script
│   └── server.js             # Server entry point
├── src/                       # React Frontend
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation with live search & tickets shortcut
│   │   ├── slider.jsx        # Cinematic Hero Carousel with trailer preview
│   │   ├── Moviecard.jsx     # Movie Catalog with category tabs
│   │   ├── Setbook.jsx       # 3-Tier Seat Selection & Checkout Modal
│   │   ├── MyBookings.jsx    # Digital ticket retrieval & pass print
│   │   ├── About.jsx         # Cinema showcase & tech stack overview
│   │   ├── contact.jsx       # Contact form saving to MongoDB
│   │   └── Footer.jsx        # Cinema footer
│   ├── home/
│   │   └── Homepage.jsx      # Main landing page
│   ├── App.jsx               # React Router routes
│   └── index.css             # Cinema dark design tokens
└── public/
    └── posters/              # Movie poster assets
```
