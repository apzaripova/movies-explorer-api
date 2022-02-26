const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NotAuthError = require('../errors/NotAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ресурс не найден');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Произошла ошибка, не удалось найти пользователей');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError('Такой email уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then(() => {
          res.send({ email, name });
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.status(200).send({ token, name: user.name, email: user.email });
    })
    .catch(() => {
      next(new NotAuthError('Ошибка авторизации'));
    });
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  createUser,
  login,
};
