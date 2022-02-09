const usersRouter = require('express').Router();
const { getUser, updateUserProfile } = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validation');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = usersRouter;
