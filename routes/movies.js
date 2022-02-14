const moviesRouter = require('express').Router();
const { createMovie, deleteMovie, getAllMovies } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

moviesRouter.get('/movies', getAllMovies);
moviesRouter.post('/movies', validateCreateMovie, createMovie);
moviesRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
