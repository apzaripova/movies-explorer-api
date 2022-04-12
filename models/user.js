const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NotAuthError = require('../errors/NotAuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')

    .then((user) => {
      if (!user) {
        throw new NotAuthError('Необходима авторизация');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthError('Необходима авторизация');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
