import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Showtime from './models/Showtime.js';
import Booking from './models/Booking.js';
import Contact from './models/Contact.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eticket_db';

const initialMovies = [
  {
    title: 'Jigra',
    genre: ['Action', 'Thriller', 'Drama'],
    duration: '2h 35m',
    language: 'Hindi (2D, IMAX)',
    rating: 8.8,
    votes: '42.8K',
    synopsis: 'A fiercely devoted sister embarks on an extraordinarily daring and relentless journey to break her innocent brother out of a heavily fortified overseas prison.',
    posterUrl: '/posters/IMG-20240923-WA0010.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0010.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Vasan Bala',
    cast: ['Alia Bhatt', 'Vedang Raina', 'Manoj Pahwa'],
    priceVIP: 380,
    pricePremium: 260,
    priceStandard: 190,
    formats: ['2D', 'IMAX 2D', 'Dolby Atmos'],
    status: 'now_showing',
    isFeatured: true,
  },
  {
    title: 'Devara: Part 1',
    genre: ['Action', 'Drama'],
    duration: '2h 58m',
    language: 'Telugu / Hindi (IMAX 3D)',
    rating: 8.5,
    votes: '98.3K',
    synopsis: 'An epic coastal tale of courage, rebellion, and brotherhood set against ruthless maritime tides as a fearless protector confronts deep-rooted betrayal.',
    posterUrl: '/posters/IMG-20240923-WA0011.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0011.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Koratala Siva',
    cast: ['NTR Jr.', 'Janhvi Kapoor', 'Saif Ali Khan'],
    priceVIP: 400,
    pricePremium: 280,
    priceStandard: 200,
    formats: ['IMAX 3D', 'Dolby Atmos', '4DX'],
    status: 'now_showing',
    isFeatured: true,
  },
  {
    title: 'Vettaiyan',
    genre: ['Action', 'Thriller', 'Crime'],
    duration: '2h 42m',
    language: 'Tamil / Hindi / Telugu',
    rating: 8.7,
    votes: '64.1K',
    synopsis: 'A ruthless supercop known for swift frontier justice faces off against systemic corruption and a mastermind in the educational syndicate.',
    posterUrl: '/posters/IMG-20240923-WA0012.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0012.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'T. J. Gnanavel',
    cast: ['Rajinikanth', 'Amitabh Bachchan', 'Fahadh Faasil', 'Rana Daggubati'],
    priceVIP: 390,
    pricePremium: 270,
    priceStandard: 190,
    formats: ['2D', 'Dolby Atmos'],
    status: 'now_showing',
    isFeatured: true,
  },
  {
    title: 'Venom: The Last Dance',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    duration: '1h 50m',
    language: 'English / Hindi (3D 4DX)',
    rating: 8.4,
    votes: '55.7K',
    synopsis: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.',
    posterUrl: '/posters/IMG-20240923-WA0013.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0013.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Kelly Marcel',
    cast: ['Tom Hardy', 'Chiwetel Ejiofor', 'Juno Temple'],
    priceVIP: 420,
    pricePremium: 300,
    priceStandard: 220,
    formats: ['3D', 'IMAX 3D', '4DX 3D'],
    status: 'now_showing',
    isFeatured: true,
  },
  {
    title: 'The Greatest of All Time (GOAT)',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: '2h 59m',
    language: 'Tamil / Hindi / Telugu',
    rating: 8.2,
    votes: '89.4K',
    synopsis: 'A retired top-secret hostage negotiator and special antiterrorist squad agent is called back into action when past sins endanger his family.',
    posterUrl: '/posters/IMG-20240923-WA0014.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0014.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Venkat Prabhu',
    cast: ['Thalapathy Vijay', 'Prashanth', 'Prabhu Deva', 'Sneha'],
    priceVIP: 360,
    pricePremium: 250,
    priceStandard: 180,
    formats: ['2D', 'Dolby Atmos'],
    status: 'now_showing',
    isFeatured: false,
  },
  {
    title: 'Morbius: The Living Vampire',
    genre: ['Action', 'Fantasy', 'Horror'],
    duration: '1h 44m',
    language: 'English / Hindi',
    rating: 7.9,
    votes: '32.1K',
    synopsis: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but inadvertently infects himself with a form of vampirism instead.',
    posterUrl: '/posters/IMG-20240923-WA0015.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0015.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Daniel Espinosa',
    cast: ['Jared Leto', 'Matt Smith', 'Adria Arjona'],
    priceVIP: 320,
    pricePremium: 220,
    priceStandard: 160,
    formats: ['2D', 'Dolby Atmos'],
    status: 'now_showing',
    isFeatured: false,
  },
  {
    title: 'Raayan',
    genre: ['Action', 'Crime', 'Drama'],
    duration: '2h 25m',
    language: 'Tamil / Hindi / Telugu',
    rating: 8.6,
    votes: '48.9K',
    synopsis: 'A humble fast-food stall owner in North Chennai is forced to unleash fury and enter the criminal underworld to protect his younger siblings.',
    posterUrl: '/posters/IMG-20240923-WA0016.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0016.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Dhanush',
    cast: ['Dhanush', 'S. J. Suryah', 'Prakash Raj', 'Dushara Vijayan'],
    priceVIP: 340,
    pricePremium: 240,
    priceStandard: 170,
    formats: ['2D', 'Dolby Atmos'],
    status: 'now_showing',
    isFeatured: false,
  },
  {
    title: 'The Lost City',
    genre: ['Action', 'Adventure', 'Comedy'],
    duration: '1h 52m',
    language: 'English',
    rating: 7.8,
    votes: '26.4K',
    synopsis: 'A reclusive romance novelist on a book tour with her cover model gets swept up in a kidnapping attempt that lands them both in a cutthroat jungle adventure.',
    posterUrl: '/posters/IMG-20240923-WA0017.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0017.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Aaron Nee, Adam Nee',
    cast: ['Sandra Bullock', 'Channing Tatum', 'Brad Pitt', 'Daniel Radcliffe'],
    priceVIP: 300,
    pricePremium: 220,
    priceStandard: 160,
    formats: ['2D'],
    status: 'upcoming',
    isFeatured: false,
  },
  {
    title: 'Kantara: A Legend Chapter 1',
    genre: ['Action', 'Drama', 'Mythological'],
    duration: '2h 48m',
    language: 'Kannada / Hindi / Telugu',
    rating: 9.1,
    votes: '112.5K',
    synopsis: 'The mythic origin chronicle exploring the celestial compact between demigod Panjurli Daiva and an ancestral kingdom amid ancient sacred groves.',
    posterUrl: '/posters/IMG-20240923-WA0018.jpg',
    bannerUrl: '/posters/IMG-20240923-WA0018.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: 'Rishab Shetty',
    cast: ['Rishab Shetty', 'Sapthami Gowda', 'Kishore'],
    priceVIP: 420,
    pricePremium: 300,
    priceStandard: 210,
    formats: ['IMAX 2D', 'Dolby Atmos', '4DX'],
    status: 'now_showing',
    isFeatured: true,
  },
];

const timeSlots = [
  { time: '10:30 AM', format: 'Dolby Atmos', screen: 'Screen 1 - Grand Luxe IMAX' },
  { time: '02:15 PM', format: 'IMAX 3D', screen: 'Screen 2 - Atmos Prime' },
  { time: '06:45 PM', format: 'Dolby Atmos', screen: 'Screen 1 - Grand Luxe IMAX' },
  { time: '10:00 PM', format: '4DX Laser', screen: 'Screen 3 - 4DX VIP Suite' },
];

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected.');

    // Clear existing data
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    await Contact.deleteMany({});
    console.log('[Seed] Cleared existing movies, showtimes, bookings, and contacts.');

    // 1. Insert Movies
    const createdMovies = await Movie.insertMany(initialMovies);
    console.log(`[Seed] Successfully seeded ${createdMovies.length} movies.`);

    // 2. Generate Showtimes for each movie across today + next 6 days
    const showtimesToInsert = [];
    const baseDate = new Date();

    for (const movie of createdMovies) {
      // 7 days of showtimes
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + dayOffset);
        const dateStr = currentDate.toISOString().split('T')[0];

        for (const slot of timeSlots) {
          // Pre-populate realistic occupied seats for first few showtimes
          let sampleBooked = [];
          if (dayOffset === 0 || dayOffset === 1) {
            sampleBooked = ['A4', 'A5', 'C3', 'C4', 'E6', 'F7', 'F8'];
          } else if (dayOffset === 2) {
            sampleBooked = ['B3', 'B4', 'D5', 'D6'];
          }

          showtimesToInsert.push({
            movieId: movie._id,
            screenName: slot.screen,
            date: dateStr,
            time: slot.time,
            format: slot.format,
            bookedSeats: sampleBooked,
            priceVIP: movie.priceVIP,
            pricePremium: movie.pricePremium,
            priceStandard: movie.priceStandard,
          });
        }
      }
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`[Seed] Seeded ${createdShowtimes.length} showtime slots across dates.`);

    // 3. Create a sample initial confirmed booking for testing
    const sampleShow = createdShowtimes[0];
    const sampleMovie = createdMovies[0];
    const sampleBooking = new Booking({
      bookingRef: 'ETX-DEMO-9921',
      movie: sampleMovie._id,
      movieTitle: sampleMovie.title,
      moviePoster: sampleMovie.posterUrl,
      showtime: sampleShow._id,
      showDate: sampleShow.date,
      showTime: sampleShow.time,
      screenName: sampleShow.screenName,
      format: sampleShow.format,
      seats: [
        { seatId: 'A4', tier: 'VIP', price: sampleMovie.priceVIP },
        { seatId: 'A5', tier: 'VIP', price: sampleMovie.priceVIP },
      ],
      customerName: 'Alex Mercer',
      customerEmail: 'alex@example.com',
      customerPhone: '+91 98765 43210',
      subtotal: sampleMovie.priceVIP * 2,
      convenienceFee: 60,
      tax: Math.round((sampleMovie.priceVIP * 2 + 60) * 0.18),
      totalAmount: sampleMovie.priceVIP * 2 + 60 + Math.round((sampleMovie.priceVIP * 2 + 60) * 0.18),
      paymentMethod: 'UPI',
      paymentStatus: 'Completed',
      qrCodeData: JSON.stringify({
        ref: 'ETX-DEMO-9921',
        movie: sampleMovie.title,
        seats: ['A4', 'A5'],
        date: sampleShow.date,
        time: sampleShow.time,
      }),
    });
    await sampleBooking.save();
    console.log('[Seed] Created sample booking (ETX-DEMO-9921 / alex@example.com).');

    console.log('[Seed] Database seeding completed successfully!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    throw err;
  }
};

// If run directly via `node seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
