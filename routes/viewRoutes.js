const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewsController');
const authController = require('./../controller/authController');

/**RENDER THE CONTENT ON WEB PAGE */
router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
// router.get('/signup', viewController.getSignupForm);

module.exports = router;
