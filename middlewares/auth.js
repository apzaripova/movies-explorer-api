const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    next(new NotAuthError('Неверный токен, необходимо авторизоваться'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');
  } catch (err) {
    next(new NotAuthError('Неверный токен, необходимо авторизоваться'));
  }

  req.user = payload;

  next();
};
