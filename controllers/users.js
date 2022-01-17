const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/NotAuthError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError('Все поля обязательны');
  }

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ email, name, password: hash }))
    .then((createUser) => res.send({
      _id: createUser._id,
      name: createUser.name,
      email: createUser.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь уже существует'));
      }
      next(err);
    });
};

exports.onLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((userIsExist) => {
      if (!userIsExist) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      bcrypt
        .compare(password, userIsExist.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: userIsExist._id },
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
            .send({ _id: userIsExist._id });
        })
        .catch(next);
    })
    .catch(next);
};

exports.onSignOut = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    throw new UnauthorizedError(
      'Токена нет в куках. Сначала надо залогиниться',
    );
  }

  try {
    res
      .clearCookie('userToken', {
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .send({ message: 'Токен удален из куков' });
  } catch (err) {
    next(err);
  }
};

exports.getUserProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

exports.updateUserProfile = (req, res, next) => {
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
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
