const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUserProfile } = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserProfile);

module.exports = usersRouter;
