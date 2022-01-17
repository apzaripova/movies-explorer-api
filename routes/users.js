const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getUserProfile, updateUserProfile } = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/me', getUserProfile);
usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}),
updateUserProfile);

exports.usersRoutes = usersRoutes;
