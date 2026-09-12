import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    duration: {
      type: String, // e.g., '2h 35m'
      default: '2h 15m',
    },
    language: {
      type: String,
      default: 'English / Hindi',
    },
    rating: {
      type: Number, // e.g. 8.6
      default: 8.0,
    },
    votes: {
      type: String,
      default: '45.2K',
    },
    synopsis: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    director: {
      type: String,
      default: 'Christopher Nolan',
    },
    cast: {
      type: [String],
      default: ['Lead Actor', 'Lead Actress', 'Supporting Actor'],
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
    formats: {
      type: [String],
      default: ['2D', 'IMAX 3D', 'Dolby Atmos'],
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
