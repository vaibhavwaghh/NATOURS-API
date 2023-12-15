const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewsController');
const authController = require('./../controller/authController');

// router.use(authController.isLoggedIn);
/**RENDER THE CONTENT ON WEB PAGE */
router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
module.exports = router;
