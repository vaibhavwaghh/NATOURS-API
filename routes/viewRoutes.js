const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewsController');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');
/**RENDER THE CONTENT ON WEB PAGE */
router.post('/getBookings', bookingController.createBookingCheckOut);
router.get(
  '/',
  // bookingController.createBookingCheckOut,
  authController.isLoggedIn,
  viewController.getOverview,
);

router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/me', authController.protect, viewController.getMe);
// router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

// router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData,
// );
// router.get('/signup', viewController.getSignupForm);

module.exports = router;
