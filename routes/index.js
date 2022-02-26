const Router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');

Router.post('/signup', validateSignUp, createUser);
Router.post('/signin', validateSignIn, login);

Router.use(auth);

Router.use('/users', usersRouter);
Router.use('/movies', moviesRouter);

module.exports = Router;
