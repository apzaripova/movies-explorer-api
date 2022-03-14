const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createMovie, deleteMovie, getMovies } = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(100),
    director: Joi.string().required().min(1).max(100),
    duration: Joi.number().required(),
    year: Joi.string().required().min(1).max(4),
    description: Joi.string().required().min(1).max(1000),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    nameRU: Joi.string().required().min(1).max(100),
    nameEN: Joi.string().required().min(1).max(100),
    movieId: Joi.number().required(),
  }),
}),
createMovie);

moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}),
deleteMovie);

module.exports = moviesRouter;
