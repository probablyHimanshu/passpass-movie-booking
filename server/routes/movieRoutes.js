import express from 'express';
import { getMovies, getMovieById, createMovie } from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);

export default router;
