const Router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { register, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

Router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

Router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), register);

Router.use(auth, usersRouter);
Router.use(auth, moviesRouter);

// обработчики ошибок
Router.all('*', () => {
  throw new NotFoundError('На сервере произошла ошибка');
});

module.exports = Router;
