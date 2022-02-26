const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const { isEmail } = require('validator');

const validateEmail = (value, helpers) => {
  if (isEmail(value)) {
    return value;
  }
  return helpers.message('Поле email заполнено неверно');
};

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24)
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(new RegExp(/^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/)).required(),
    trailer: Joi.string().required().pattern(new RegExp(/^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/)).required(),
    thumbnail: Joi.string().required().pattern(new RegExp(/^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/)).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .custom(validateEmail),
    password: Joi.string().required().min(8).max(50),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .custom(validateEmail),
    password: Joi.string().required().min(8).max(50),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateDeleteMovie,
  validateCreateMovie,
  validateSignUp,
  validateSignIn,
};
