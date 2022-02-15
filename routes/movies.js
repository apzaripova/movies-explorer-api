const moviesRouter = require('express').Router();
const { createMovie, deleteMovie, getMovies } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateCreateMovie, createMovie);
moviesRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
