const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new NotAuthError('Неверный токен, необходима авторизация'));
  }

  const token = cookie.replace('jwt=', '');

  let payload;

  try {
    payload = jwt.verify(token, 'dev-secret-key');
  } catch (err) {
    next(new NotAuthError('Неверный токен, необходима авторизация'));
  }

  req.user = payload;

  next();
};
