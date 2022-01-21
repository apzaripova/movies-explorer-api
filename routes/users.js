const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUserProfile } = require('../controllers/users');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}),
updateUserProfile);

module.exports = usersRouter;
