const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createMovie, removeMovie, getAllMovies } = require('../controllers/movies');

const moviesRoutes = express.Router();

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Заполните поле валидным URL');
}

moviesRoutes.get('/', getAllMovies);

moviesRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().integer(),
    owner: Joi.string().hex().length(24),
  }),
}),
createMovie);
moviesRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), removeMovie);

exports.moviesRoutes = moviesRoutes;
