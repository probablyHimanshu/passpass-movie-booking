import Showtime from '../models/Showtime.js';

// Get showtimes by movie and date
export const getShowtimes = async (req, res) => {
  try {
    const { movieId, date } = req.query;
    const query = {};

    if (movieId) query.movieId = movieId;
    if (date) query.date = date;

    const showtimes = await Showtime.find(query)
      .populate('movieId', 'title duration posterUrl priceVIP pricePremium priceStandard')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, count: showtimes.length, data: showtimes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single showtime with real-time seat occupation
export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movieId');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.json({ success: true, data: showtime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create showtime
export const createShowtime = async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    await showtime.save();
    res.status(201).json({ success: true, data: showtime });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
