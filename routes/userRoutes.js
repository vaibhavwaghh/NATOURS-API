const express = require('express');

const authController = require('./../controller/authController');
const userController = require('../controller/userController');

/**ROUTES FOR USER */
const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logOut);
userRouter.get('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

/**PROTECT ALL ROUTES AFTER THIS MIDDLEWARE */
userRouter.use(authController.protect);

userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
userRouter.get('/me', userController.getMe, userController.getUserBasedOnId);

/**RESTRICT TO ADMIN */
userRouter.use(authController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .get(userController.getUserBasedOnId)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
