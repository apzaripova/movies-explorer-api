const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NotAuthError = require('../errors/NotAuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email обязательно должен быть указан'],
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Невалидный email',
    },
  },
  password: {
    type: String,
    required: [true, 'пароль обязательно должен быть указан'],
    minlength: 4,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function getUserIfAuth(email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // не нашёлся — отклоняем промис
        return Promise.reject(new NotAuthError('Неверный логин или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthError('Неверный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
