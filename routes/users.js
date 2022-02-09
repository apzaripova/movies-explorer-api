const usersRouter = require('express').Router();
const { getUser, updateUserProfile } = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validation');

usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me', validateUpdateUserProfile, updateUserProfile);

module.exports = usersRouter;
