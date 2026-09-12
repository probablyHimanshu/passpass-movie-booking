import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    screenName: {
      type: String,
      default: 'Screen 1 - Grand Luxe IMAX',
    },
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // format: '10:30 AM', '02:15 PM', '06:45 PM', '10:00 PM'
      required: true,
    },
    format: {
      type: String, // 'IMAX 3D', 'Dolby Atmos', '4K Laser'
      default: 'Dolby Atmos',
    },
    bookedSeats: {
      type: [String], // Array of seat IDs like 'A1', 'A2', 'C5', etc.
      default: [],
    },
    priceVIP: {
      type: Number,
      default: 350,
    },
    pricePremium: {
      type: Number,
      default: 250,
    },
    priceStandard: {
      type: Number,
      default: 180,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick showtime queries
showtimeSchema.index({ movieId: 1, date: 1, time: 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;
