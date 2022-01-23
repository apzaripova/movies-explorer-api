const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/NotAuthError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError('Все поля обязательны');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 110000) {
        next(new ConflictError('Пользователь уже существует'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
            {
              expiresIn: '7d',
            },
          );
          res
            .cookie('userToken', token, {
              maxAge: 360000000,
              httpOnly: true,
              sameSite: true,
            })
            .send({ _id: user._id });
        })
        .catch(next);
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

module.exports.updateUserInfo = (req, res, next) => { // обновляем данные текущего пользователя
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
          }

          next(err);
        });
    })
    .catch(next);
};
