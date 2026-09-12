import Movie from '../models/Movie.js';
import Showtime from '../models/Showtime.js';

// Get all movies with optional filters
export const getMovies = async (req, res) => {
  try {
    const { genre, search, status, featured } = req.query;
    const query = {};

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { cast: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const movies = await Movie.find(query).sort({ isFeatured: -1, rating: -1, createdAt: -1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single movie by ID with its showtimes
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const showtimes = await Showtime.find({
      movieId: movie._id,
      date: { $gte: todayStr },
    }).sort({ date: 1, time: 1 });

    res.json({ success: true, data: { ...movie.toObject(), showtimes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
