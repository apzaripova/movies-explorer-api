const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const { default: validator } = require('validator');

// вспомогательная ф-ия проверки id
const checkedId = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (ObjectId.isValid(value)) return value;
    return helpers.message('Невалидный id');
  });

// вспомогательная ф-ия проверки email
const checkedEmail = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isEmail(value)) return value;
    return helpers.message('Неверный формат почты');
  });

// вспомогательная ф-ия проверки ссылки
const checkedLink = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isURL(value)) return value;
    return helpers.message('Неверный формат ссылки');
  });

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: checkedEmail,
    password: Joi.string().required().min(4),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: checkedEmail,
    password: Joi.string().required().min(4),
  }),
});

const validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: checkedEmail,
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: checkedLink,
    trailer: checkedLink,
    thumbnail: checkedLink,
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: checkedId,
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateUpdateUserProfile,
  validateCreateMovie,
  validateDeleteMovie,
};
