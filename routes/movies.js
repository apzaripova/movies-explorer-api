const moviesRouter = require('express').Router();
const { createMovie, deleteMovie, getMovies } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
