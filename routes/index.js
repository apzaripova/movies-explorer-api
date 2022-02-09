const Router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login, logout } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

Router.post('/signup', validateSignUp, createUser);

Router.post('/signin', validateSignIn, login);

Router.delete('/signout', auth, logout);

Router.use('/users', auth, usersRouter);
Router.use('/', auth, moviesRouter);

Router.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = Router;
