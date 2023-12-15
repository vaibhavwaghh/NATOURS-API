const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  /**1) GET TOUR DATA FROM COLLECTION */
  const tours = await Tour.find();

  /**2) BUILD TEMPLATE */
  /**3) RENDER THE TEMPLATE  */
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = catchAsyncError(async (req, res, next) => {
  /**1) GET DATA FOR REQUESTED TOUR (INCLUDE REVIEWS AND GUIDES) */
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  /**2) BUILD TEMPLATE  */

  /**3) RENDER THE TEMPLATE */
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('login', {
      title: 'Log into your account',
    });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};
