const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    next(new NotAuthError('Неверный токен, необходимо авторизоваться'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'dev-secret-key');
  } catch (err) {
    next(new NotAuthError('Неверный токен, необходимо авторизоваться'));
  }

  req.user = payload;

  next();
};
