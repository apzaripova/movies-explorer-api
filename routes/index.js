const Router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

Router.post('/signup', validateSignUp, createUser);
Router.post('/signin', validateSignIn, login);

Router.use(auth);

Router.use('/users', usersRouter);
Router.use('/movies', moviesRouter);

Router.use((req, res, next) => {
  next(new NotFoundError('Такой ресурс не найден.'));
});

module.exports = Router;
