import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      showtimeId,
      customerName,
      customerEmail,
      customerPhone,
      selectedSeats, // array of { seatId, tier, price }
      paymentMethod = 'UPI',
    } = req.body;

    if (!showtimeId || !customerName || !customerEmail || !customerPhone || !selectedSeats?.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields (showtime, customer details, seats).',
      });
    }

    // 1. Fetch showtime and movie
    const showtime = await Showtime.findById(showtimeId).populate('movieId');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    const requestedSeatIds = selectedSeats.map((s) => s.seatId);

    // 2. Check if any seat is already booked
    const alreadyBooked = requestedSeatIds.filter((seatId) =>
      showtime.bookedSeats.includes(seatId)
    );

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] have already been booked. Please choose other seats.`,
      });
    }

    // 3. Calculate financials
    const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
    const convenienceFee = 30 * selectedSeats.length;
    const tax = Math.round((subtotal + convenienceFee) * 0.18);
    const totalAmount = subtotal + convenienceFee + tax;

    // 4. Generate unique booking reference
    const bookingRef = `ETX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 5. Atomic seat reservation update
    showtime.bookedSeats.push(...requestedSeatIds);
    await showtime.save();

    // 6. Create booking record
    const booking = new Booking({
      bookingRef,
      movie: showtime.movieId._id,
      movieTitle: showtime.movieId.title,
      moviePoster: showtime.movieId.posterUrl,
      showtime: showtime._id,
      showDate: showtime.date,
      showTime: showtime.time,
      screenName: showtime.screenName,
      format: showtime.format,
      seats: selectedSeats,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'Completed',
      qrCodeData: JSON.stringify({
        ref: bookingRef,
        movie: showtime.movieId.title,
        seats: requestedSeatIds,
        date: showtime.date,
        time: showtime.time,
      }),
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings (filtered by email or booking reference)
export const getBookings = async (req, res) => {
  try {
    const { email, ref } = req.query;
    const query = {};

    if (email) {
      query.customerEmail = email.toLowerCase().trim();
    }
    if (ref) {
      query.bookingRef = ref.trim();
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking by ID or ref
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (id.startsWith('ETX-')) {
      booking = await Booking.findOne({ bookingRef: id });
    } else {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
