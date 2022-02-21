require('dotenv').config();

const { JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден.');
      }
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных пользователя.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  const trimmedPassword = String(password).trim();
  const trimmedEmail = String(email).trim();
  if (trimmedPassword.length < 8) {
    throw new BadRequestError('Пароль должен содержать не менее восьми символов.');
  }
  bcrypt
    .hash(trimmedPassword, 10)
    .then((hash) => User.create({
      email: trimmedEmail,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send({ data: { _id: user._id, email: user.email } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации данных нового пользователя.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new BadRequestError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const trimmedPassword = String(password).trim();
  const trimmedEmail = String(email).trim();
  User.findUserByCredentials(trimmedEmail, trimmedPassword)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, JWT_SECRET, { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getProfile,
  updateUserProfile,
  createUser,
  login,
};
