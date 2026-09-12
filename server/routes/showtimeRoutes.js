import express from 'express';
import { getShowtimes, getShowtimeById, createShowtime } from '../controllers/showtimeController.js';

const router = express.Router();

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', createShowtime);

export default router;
