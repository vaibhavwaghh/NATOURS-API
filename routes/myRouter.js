const express = require('express');
const router = express.Router();
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

router.get('/', authController.isLoggedIn);
// router.get('/logout', authController.logOut);
module.exports = router;
