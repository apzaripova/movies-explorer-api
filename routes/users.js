const usersRouter = require('express').Router();
const { getProfile, updateUserProfile } = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validation');

usersRouter.get('/me', getProfile);
usersRouter.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = usersRouter;
