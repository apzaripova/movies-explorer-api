const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!(user === null)) throw new ConflictError('Пользователь с таким email уже существует');
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: 'Пользователь успешно деавторизован' });
};

module.exports.getUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => { // обновляем данные текущего пользователя
  const { name, email } = req.body;
  const id = req.user._id;

  User.find({ email })
    .then((data) => {
      if (data.length !== 0) { // проверка, что такого имейла нет в базе
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      }

      User.findByIdAndUpdate(id, { name, email }, {
        runValidators: true,
        new: true,
      })
        .orFail(new NotFoundError('Ресурс не найден'))
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};
