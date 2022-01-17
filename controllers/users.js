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
            NODE_ENV === 'production' ? JWT_SECRET : 'extremly_secret_key',
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

module.exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((userProfile) => {
      if (userProfile) {
        res.send(userProfile);
      } else {
        throw new NotFoundError('Такой пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
